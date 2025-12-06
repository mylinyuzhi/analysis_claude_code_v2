# Tool Permissions System

This document describes how Claude Code handles tool permissions, including permission checking flow, behaviors, context, and file path patterns.

## Overview

Claude Code implements a comprehensive permission system that controls:

1. **Which tools can be used**
2. **What files/directories can be accessed**
3. **What commands can be executed**
4. **Whether the user is prompted or actions are auto-allowed/denied**

The permission system operates at multiple levels:
- **Global settings** - System-wide permissions
- **Managed settings** - Enterprise/organization policies
- **Project settings** - Per-repository configuration
- **Local settings** - User-specific overrides

---

## Permission Checking Flow

### checkPermissions Function

Each tool implements a `checkPermissions` method that is called before execution:

```typescript
interface PermissionCheckContext {
  getAppState(): Promise<AppState>;
  // ... other context methods
}

interface AppState {
  toolPermissionContext: ToolPermissionContext;
  readFileState: Map<string, FileState>;
  // ... other state
}

interface PermissionResult {
  behavior: "allow" | "deny" | "prompt";
  updatedInput?: any;           // Modified input if needed
  promptMessage?: string;       // Custom prompt message
}

// Example implementation
async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return checkFilePermission(
    this,                              // Tool definition
    input,                             // Tool input
    appState.toolPermissionContext     // Permission context
  );
}
```

### Permission Check Examples

#### Write Tool Permission Check

```typescript
// chunks.122.mjs:3333
async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return L0A(QV, input, appState.toolPermissionContext);
}

// L0A is a helper function that checks file permissions
function L0A(tool, input, permissionContext) {
  const filePath = tool.getPath(input);  // Extract file path
  return checkFilePermission(tool, filePath, permissionContext, "edit");
}
```

#### Bash Tool Permission Check

```typescript
// Bash tool checks both command and file permissions
async checkPermissions(input, context) {
  // Check if command is allowed
  const commandBehavior = checkCommandPermission(input.command, permissionContext);
  if (commandBehavior === "deny") {
    return { behavior: "deny" };
  }

  // Check file access if command touches files
  const filePermission = checkFileAccess(input.command, permissionContext);
  return filePermission;
}
```

#### LSP Tool Permission Check

```typescript
// chunks.146.mjs:80
async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return jl(FV0, input, appState.toolPermissionContext);
}

// jl checks LSP-specific permissions
function jl(tool, input, permissionContext) {
  const filePath = tool.getPath(input);
  return checkFilePermission(tool, filePath, permissionContext, "read");
}
```

---

## Permission Behaviors

### Three Permission Behaviors

#### 1. Allow (Auto-Approve)

```typescript
{
  behavior: "allow",
  updatedInput: input  // Input may be unchanged or modified
}
```

**When Used**:
- File/directory is in allowlist
- Command is explicitly allowed
- Tool has blanket approval
- Default allow mode is enabled

**Effect**: Tool executes immediately without user prompt

#### 2. Deny (Auto-Reject)

```typescript
{
  behavior: "deny",
  updatedInput: input
}
```

**When Used**:
- File/directory is in denylist
- Command is explicitly denied
- File is in restricted location
- Enterprise policy blocks the operation

**Effect**: Tool execution is blocked, error returned to Claude

#### 3. Prompt (Ask User)

```typescript
{
  behavior: "prompt",
  updatedInput: input,
  promptMessage: "Allow Claude to read /sensitive/file.txt?"
}
```

**When Used**:
- No explicit allow or deny rule matches
- User interaction available (non-interactive mode returns deny)
- First time accessing a path/command

**Effect**: User is prompted to allow/deny/always allow/always deny

---

## Tool Permission Context

### ToolPermissionContext Structure

```typescript
interface ToolPermissionContext {
  // Permission rules
  allow?: string[];          // Allowlist of patterns
  deny?: string[];           // Denylist of patterns

  // Path allowlists/denylists
  allowedPaths?: string[];   // Allowed file paths/patterns
  deniedPaths?: string[];    // Denied file paths/patterns

  // Command restrictions
  excludedCommands?: string[];  // Bash commands that are denied

  // Sandbox configuration
  sandbox?: {
    ripgrep?: {
      command: string;
      args: string[];
    };
    excludedCommands?: string[];
  };

  // Settings metadata
  settingsSource?: "managed" | "project" | "local" | "global";
  settingsPath?: string;
}
```

### Permission Rule Format

Rules can be specified with optional parameters:

```
toolName
toolName(ruleContent)
```

Examples:
```
Edit                           // Allow/deny all Edit operations
Edit(/path/to/file)            // Allow/deny Edit on specific file
Edit(/src/**)                  // Allow/deny Edit on pattern
Read(/config/**)               // Allow/deny Read on pattern
Bash                           // Allow/deny all Bash commands
WebFetch(domain:example.com)   // Allow/deny WebFetch for domain
```

### Rule Parsing

```typescript
// chunks.19.mjs:529
function parsePermissionRule(rule: string) {
  const match = rule.match(/^([^(]+)\(([^)]+)\)$/);

  if (!match) {
    return {
      toolName: rule      // e.g., "Edit", "Bash", "Read"
    };
  }

  return {
    toolName: match[1],   // e.g., "Edit", "WebFetch"
    ruleContent: match[2] // e.g., "/path/to/file", "domain:example.com"
  };
}
```

---

## File Path Permission Patterns

### Pattern Matching

Claude Code supports glob patterns for file permissions:

```typescript
// Glob patterns
/src/**                 // All files under /src recursively
/config/*.json          // JSON files in /config
/home/user/project/**   // Entire project tree

// Absolute paths
/etc/passwd             // Specific file
/Users/username/Desktop // Specific directory

// Relative patterns (converted to absolute)
src/**                  // Relative to CWD
*.ts                    // TypeScript files in CWD
```

### Permission Evaluation Order

1. **Exact denies** - Exact path matches in denylist
2. **Pattern denies** - Glob pattern matches in denylist
3. **Exact allows** - Exact path matches in allowlist
4. **Pattern allows** - Glob pattern matches in allowlist
5. **Default behavior** - Prompt (or deny in non-interactive mode)

**Important**: Denies take precedence over allows

### File Permission Check Implementation

```typescript
// ============================================
// File Permission Check Implementation
// Source: Extracted from chunks.19.mjs, chunks.122.mjs
// Location: chunks.19.mjs:~570-650
// ============================================

// Main permission check function
function checkFilePermission(tool, input, permissionContext, operation = "edit") {
  const filePath = resolvePath(tool.getPath(input));

  // Step 1: Check denylists first (denies have highest priority)
  const denyMatch = findPathMatch(filePath, permissionContext.deniedPaths);
  if (denyMatch !== null) {
    return { behavior: "deny", updatedInput: input };
  }

  // Step 2: Check allowlists
  const allowMatch = findPathMatch(filePath, permissionContext.allowedPaths);
  if (allowMatch !== null) {
    return { behavior: "allow", updatedInput: input };
  }

  // Step 3: Check tool-specific rules from permissions.allow/deny
  const toolRuleBehavior = checkToolSpecificRules(
    tool.name,
    filePath,
    permissionContext,
    operation
  );
  if (toolRuleBehavior !== null) {
    return toolRuleBehavior;
  }

  // Step 4: Default behavior based on mode
  if (isInteractive()) {
    return {
      behavior: "prompt",
      promptMessage: `Allow ${tool.name} operation on ${filePath}?`,
      updatedInput: input
    };
  } else {
    // Non-interactive mode: deny by default
    return { behavior: "deny", updatedInput: input };
  }
}

// ============================================
// Tool-Specific Permission Rule Checking
// Source: chunks.19.mjs:~553-577
// ============================================
function checkToolSpecificRules(toolName, filePath, permissionContext, operation) {
  const { permissions } = permissionContext;
  if (!permissions) return null;

  // Parse tool-specific allow rules
  for (const rule of permissions.allow || []) {
    const parsed = parsePermissionRule(rule);

    if (parsed.toolName === toolName) {
      // Tool-level allow (e.g., "Read" allows all Read operations)
      if (!parsed.ruleContent) {
        return { behavior: "allow", updatedInput: input };
      }

      // Path-specific allow (e.g., "Read(/src/**)")
      if (minimatch(filePath, parsed.ruleContent)) {
        return { behavior: "allow", updatedInput: input };
      }
    }
  }

  // Parse tool-specific deny rules
  for (const rule of permissions.deny || []) {
    const parsed = parsePermissionRule(rule);

    if (parsed.toolName === toolName) {
      // Tool-level deny (e.g., "Bash" denies all Bash operations)
      if (!parsed.ruleContent) {
        return { behavior: "deny", updatedInput: input };
      }

      // Path-specific deny (e.g., "Edit(/etc/**)")
      if (minimatch(filePath, parsed.ruleContent)) {
        return { behavior: "deny", updatedInput: input };
      }
    }
  }

  return null;
}

// ============================================
// Bash Command Permission Check
// Source: chunks.106.mjs:~446-451
// ============================================
function checkBashCommandPermission(input, permissionContext) {
  const { command, dangerouslyDisableSandbox } = input;

  // Step 1: Check if sandboxing is enabled
  if (!isSandboxingEnabled()) {
    return { behavior: "allow", updatedInput: input };
  }

  // Step 2: Check if sandbox is disabled for this command
  if (dangerouslyDisableSandbox && areUnsandboxedCommandsAllowed()) {
    return { behavior: "allow", updatedInput: input };
  }

  // Step 3: Check excluded commands
  if (isCommandExcluded(command, permissionContext)) {
    return { behavior: "deny", updatedInput: input };
  }

  // Step 4: Default allow for Bash (behavior based on command analysis)
  return { behavior: "allow", updatedInput: input };
}

// Helper: Check if command is in excluded list
function isCommandExcluded(command, permissionContext) {
  const excludedCommands = permissionContext.sandbox?.excludedCommands ?? [];
  if (excludedCommands.length === 0) return false;

  for (const excluded of excludedCommands) {
    const parsed = parseExcludedCommand(excluded);

    switch (parsed.type) {
      case "exact":
        // Exact command match
        if (command.trim() === parsed.command) return true;
        break;

      case "prefix":
        // Prefix match (e.g., "rm" matches "rm -rf /")
        const trimmed = command.trim();
        if (trimmed === parsed.prefix || trimmed.startsWith(parsed.prefix + " ")) {
          return true;
        }
        break;
    }
  }

  return false;
}

// Helper: Parse excluded command
function parseExcludedCommand(excludedCommand) {
  // If command ends with space, it's a prefix match
  // Otherwise, it's an exact match
  if (excludedCommand.endsWith(" ")) {
    return {
      type: "prefix",
      prefix: excludedCommand.trim()
    };
  }

  return {
    type: "exact",
    command: excludedCommand
  };
}
```

### findPathMatch Implementation

```typescript
function findPathMatch(filePath: string, patterns?: string[]): string | null {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  for (const pattern of patterns) {
    // Exact match
    if (filePath === pattern) {
      return pattern;
    }

    // Glob pattern match
    if (isGlobPattern(pattern)) {
      if (minimatch(filePath, pattern)) {
        return pattern;
      }
    }

    // Prefix match for directories
    if (pattern.endsWith('/') && filePath.startsWith(pattern)) {
      return pattern;
    }
  }

  return null;
}
```

---

## Permission Context Sources

### Settings Hierarchy

Permission settings are merged from multiple sources in order of precedence:

1. **Managed Settings** (highest precedence)
   - Enterprise/organization policies
   - Cannot be overridden by users
   - Path: `~/.claude/managed-settings.json`

2. **Project Settings**
   - Repository-specific configuration
   - Path: `<project>/.claude/settings.json`

3. **Local Settings**
   - User overrides for specific project
   - Path: `<project>/.claude/settings.local.json`

4. **Global Settings** (lowest precedence)
   - User's default configuration
   - Path: `~/.claude/settings.json`

### Permission Settings Schema

```typescript
interface Settings {
  permissions?: {
    allow?: string[];        // Allow rules
    deny?: string[];         // Deny rules
  };

  sandbox?: {
    excludedCommands?: string[];   // Bash commands to block
    ripgrep?: {
      command: string;
      args: string[];
    };
  };

  // ... other settings
}
```

### Example Permission Configuration

```json
{
  "permissions": {
    "allow": [
      "Read(/home/user/project/**)",
      "Edit(/home/user/project/src/**)",
      "Glob",
      "Grep",
      "WebFetch(domain:docs.anthropic.com)"
    ],
    "deny": [
      "Edit(/home/user/project/.git/**)",
      "Write(/etc/**)",
      "Bash",
      "WebFetch(domain:malicious.com)"
    ]
  },
  "sandbox": {
    "excludedCommands": [
      "rm -rf /",
      "dd if=/dev/zero",
      ":(){ :|:& };:"
    ]
  }
}
```

---

## Tool-Specific Permission Rules

### Edit/Write Tool Rules

From `chunks.19.mjs:569-577`:

```typescript
// Allow rules for Edit tool
for (const rule of permissions.allow || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$5" && parsed.ruleContent) {
    allowedPaths.push(parsed.ruleContent);
  }
}

// Deny rules for Edit tool
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$5" && parsed.ruleContent) {
    deniedPaths.push(parsed.ruleContent);
  }
}
```

### Read Tool Rules

From `chunks.19.mjs:575-577`:

```typescript
// Deny rules for Read tool
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "d5" && parsed.ruleContent) {
    readDeniedPaths.push(parsed.ruleContent);
  }
}
```

### WebFetch Domain Rules

From `chunks.19.mjs:553-560`:

```typescript
// Allow rules for WebFetch
const allowedDomains = [];
for (const rule of permissions.allow || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$X" && parsed.ruleContent?.startsWith("domain:")) {
    allowedDomains.push(parsed.ruleContent.substring(7));
  }
}

// Deny rules for WebFetch
const blockedDomains = [];
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$X" && parsed.ruleContent?.startsWith("domain:")) {
    blockedDomains.push(parsed.ruleContent.substring(7));
  }
}
```

### Bash Command Rules

From `chunks.19.mjs:728-733`:

```typescript
// Find Bash tool rules in permissions
const bashRules = permissions.filter(
  rule => rule.type === "addRules" &&
  rule.rules.some(r => r.toolName === "C9")
);

if (bashRules.length > 0) {
  const bashRule = bashRules[0].rules.find(r => r.toolName === "C9");
  if (bashRule?.ruleContent) {
    excludedCommands.push(bashRule.ruleContent);
  }
}
```

---

## Special Permission Cases

### Always-Allowed Paths

Certain paths are always allowed regardless of permission settings:

```typescript
// chunks.19.mjs:564-569
const alwaysAllowedPaths = [
  ".",                                      // Current directory
  ...contextPaths,                          // Context-specific paths
  ...projectSettingsPaths,                  // Project .claude/settings.json files
];

// Project settings paths
const workingDirectory = process.cwd();
const homeDirectory = os.homedir();

if (workingDirectory !== homeDirectory) {
  alwaysAllowedPaths.push(
    path.join(workingDirectory, ".claude", "settings.json"),
    path.join(workingDirectory, ".claude", "settings.local.json")
  );
}
```

### Default Denies

Certain operations are denied by default for safety:

```typescript
// Default denied paths
const defaultDeniedPaths = [
  "/etc/shadow",              // System password file
  "/etc/sudoers",             // Sudo configuration
  "/proc/**",                 // Process information
  "/sys/**",                  // System information
  // ... other sensitive paths
];

// Default excluded Bash commands
const defaultExcludedCommands = [
  "rm -rf /",                 // Recursive delete root
  "dd if=/dev/zero",          // Disk wipe
  ":(){ :|:& };:",            // Fork bomb
  "curl * | sh",              // Remote code execution
  // ... other dangerous commands
];
```

### Sandbox-Specific Behavior

When Bash tool is in sandbox mode:

```typescript
// Sandbox restrictions
if (isSandboxed(input)) {
  // Limit command whitelist
  const allowedCommands = [
    "ls", "cat", "echo", "pwd", "cd",
    "git", "npm", "yarn", "node", "python",
    // ... other safe commands
  ];

  const command = extractBaseCommand(input.command);
  if (!allowedCommands.includes(command)) {
    return { behavior: "deny" };
  }
}

// Override sandbox with flag
if (input.dangerouslyDisableSandbox) {
  // Still check excluded commands
  // But allow more operations
}
```

---

## Permission Prompts

### Interactive Permission Prompts

When `behavior: "prompt"` is returned, the user sees a prompt:

```
┌─────────────────────────────────────────┐
│ Tool Permission Request                 │
├─────────────────────────────────────────┤
│ Tool: Edit                              │
│ File: /home/user/project/src/index.ts  │
│                                         │
│ Allow this operation?                   │
│                                         │
│ [A] Allow once                          │
│ [Y] Always allow this file              │
│ [P] Always allow this directory         │
│ [N] Deny                                │
│ [D] Always deny this file               │
└─────────────────────────────────────────┘
```

### Prompt Responses

User choices update the permission context:

```typescript
// Allow once - Execute this time only
// No permission rule changes

// Always allow this file - Add to allowlist
permissions.allow.push("Edit(/home/user/project/src/index.ts)");

// Always allow this directory - Add pattern to allowlist
permissions.allow.push("Edit(/home/user/project/src/**)");

// Deny - Don't execute this time
// No permission rule changes

// Always deny this file - Add to denylist
permissions.deny.push("Edit(/home/user/project/src/index.ts)");
```

### Non-Interactive Mode

In non-interactive mode (e.g., CI/CD, automated workflows):

```typescript
// All prompts are automatically denied
if (!isInteractive()) {
  if (permissionResult.behavior === "prompt") {
    return { behavior: "deny", updatedInput: input };
  }
}
```

---

## Permission Validation

### Validation on File Operations

Write and Edit tools perform additional validation beyond permission checks:

```typescript
// Write tool validation (chunks.122.mjs:3341)
async validateInput({ file_path }, context) {
  const absolutePath = resolvePath(file_path);
  const appState = await context.getAppState();

  // Check if file is denied by permissions
  const denyMatch = findPathMatch(
    absolutePath,
    appState.toolPermissionContext.deniedPaths,
    "edit",
    "deny"
  );

  if (denyMatch !== null) {
    return {
      result: false,
      message: "File is in a directory that is denied by your permission settings.",
      errorCode: 1
    };
  }

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    return { result: true };  // New file, OK
  }

  // Check if file was read first
  const fileState = context.readFileState.get(absolutePath);
  if (!fileState) {
    return {
      result: false,
      message: "File has not been read yet. Read it first before writing to it.",
      errorCode: 2
    };
  }

  // Check if file was modified since read
  if (getModificationTime(absolutePath) > fileState.timestamp) {
    return {
      result: false,
      message: "File has been modified since read. Read it again before writing.",
      errorCode: 3
    };
  }

  return { result: true };
}
```

---

## Enterprise Permission Management

### Managed Settings

Enterprise organizations can enforce permissions via managed settings:

```json
{
  "permissions": {
    "allow": [
      "Read(/workspace/**)",
      "Edit(/workspace/src/**)",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash",
      "WebFetch",
      "WebSearch",
      "Write(/workspace/config/**)"
    ]
  },
  "strictKnownMarketplaces": ["anthropic-official"],
  "allowedMcpServers": [
    { "command": "approved-server", "args": [] }
  ],
  "deniedMcpServers": [
    { "command": "risky-server", "args": [] }
  ]
}
```

### Managed Settings Precedence

```typescript
// Managed settings cannot be overridden
if (managedSettings.permissions) {
  // Use managed permissions
  permissionContext.allow = managedSettings.permissions.allow;
  permissionContext.deny = managedSettings.permissions.deny;
  permissionContext.settingsSource = "managed";

  // Ignore user/project overrides
  return permissionContext;
}
```

---

## Summary

The permission system in Claude Code provides:

1. **Fine-grained control** - Per-tool, per-file, per-directory, per-command
2. **Flexible patterns** - Glob patterns, exact matches, domain filtering
3. **Layered settings** - Global → Project → Local → Managed hierarchy
4. **Safety defaults** - Prompt or deny by default, allow via explicit rules
5. **Enterprise support** - Managed settings enforce organization policies
6. **User experience** - Interactive prompts with remember options
7. **Validation** - Multi-level checks (permissions, state, consistency)

This ensures Claude Code operates safely while giving users and organizations full control over what operations are permitted.
