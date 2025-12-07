# Tool Permissions System

This document describes how Claude Code handles tool permissions, including permission checking flow, behaviors, context, and file path patterns.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

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

### Key Permission Functions

- `Wb3` (toolPermissionDecisionEngine) - Main permission checking function - chunks.153.mjs:1358-1417
- `M$` (toolPermissionDispatcher) - Permission wrapper with mode handling - chunks.153.mjs:1480-1502
- `KVA` (getDenialRules) - Retrieve denial rules - chunks.153.mjs:1299-1305
- `CVA` (getAllowRules) - Retrieve allow rules - chunks.153.mjs:1250-1256
- `yY1` (getAskRules) - Retrieve ask rules - chunks.153.mjs:1307-1313
- `nN` (parseRuleString) - Parse permission rule strings - chunks.153.mjs:1230-1244
- `jD` (filePathRuleMatching) - Match file paths against rules - chunks.154.mjs:1697-1726
- `no1` (bashCommandPermissionCheck) - Bash command permission checker - chunks.90.mjs:1935-2008

---

## Core Permission Retrieval Functions

### Rule Retrieval Functions

```javascript
// ============================================
// getDenialRules - Retrieve all denial rules from context
// Location: chunks.153.mjs:1299-1305
// ============================================

// ORIGINAL (for source lookup):
function KVA(A) {
  return MK0.flatMap((Q) => (A.alwaysDenyRules[Q] ?? []).map((B) => ({
    source: Q,
    ruleBehavior: "deny",
    ruleValue: B
  })))
}

// READABLE (for understanding):
function getDenialRules(toolPermissionContext) {
  return PERMISSION_SOURCES.flatMap((source) =>
    (toolPermissionContext.alwaysDenyRules[source] ?? []).map((rule) => ({
      source: source,
      ruleBehavior: "deny",
      ruleValue: rule
    }))
  )
}

// Mapping: KVA→getDenialRules, A→toolPermissionContext, MK0→PERMISSION_SOURCES, Q→source, B→rule
```

```javascript
// ============================================
// getAllowRules - Retrieve all allow rules from context
// Location: chunks.153.mjs:1250-1256
// ============================================

// ORIGINAL (for source lookup):
function CVA(A) {
  return MK0.flatMap((Q) => (A.alwaysAllowRules[Q] ?? []).map((B) => ({
    source: Q,
    ruleBehavior: "allow",
    ruleValue: B
  })))
}

// READABLE (for understanding):
function getAllowRules(toolPermissionContext) {
  return PERMISSION_SOURCES.flatMap((source) =>
    (toolPermissionContext.alwaysAllowRules[source] ?? []).map((rule) => ({
      source: source,
      ruleBehavior: "allow",
      ruleValue: rule
    }))
  )
}

// Mapping: CVA→getAllowRules, A→toolPermissionContext, MK0→PERMISSION_SOURCES, Q→source, B→rule
```

```javascript
// ============================================
// getAskRules - Retrieve all ask rules from context
// Location: chunks.153.mjs:1307-1313
// ============================================

// ORIGINAL (for source lookup):
function yY1(A) {
  return MK0.flatMap((Q) => (A.alwaysAskRules[Q] ?? []).map((B) => ({
    source: Q,
    ruleBehavior: "ask",
    ruleValue: B
  })))
}

// READABLE (for understanding):
function getAskRules(toolPermissionContext) {
  return PERMISSION_SOURCES.flatMap((source) =>
    (toolPermissionContext.alwaysAskRules[source] ?? []).map((rule) => ({
      source: source,
      ruleBehavior: "ask",
      ruleValue: rule
    }))
  )
}

// Mapping: yY1→getAskRules, A→toolPermissionContext, MK0→PERMISSION_SOURCES, Q→source, B→rule
```

### Permission Sources Constant

```javascript
// ============================================
// PERMISSION_SOURCES - All permission source types
// Location: chunks.153.mjs:1517
// ============================================

// ORIGINAL (for source lookup):
let MK0 = [...iN, "cliArg", "command", "session"]
// where iN = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]

// READABLE (for understanding):
const PERMISSION_SOURCES = [
  "userSettings",       // ~/.claude/settings.json
  "projectSettings",    // <project>/.claude/settings.json
  "localSettings",      // <project>/.claude/settings.local.json
  "flagSettings",       // Feature flags
  "policySettings",     // Managed/enterprise policies
  "cliArg",             // --allow / --deny CLI arguments
  "command",            // Runtime commands
  "session"             // In-memory session rules
]

// Mapping: MK0→PERMISSION_SOURCES, iN→FILE_BASED_SOURCES
```

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

### Main Permission Decision Engine

```javascript
// ============================================
// toolPermissionDecisionEngine - Main permission checking function
// Location: chunks.153.mjs:1358-1417
// ============================================

// ORIGINAL (for source lookup):
async function Wb3(A, Q, B, G) {
  let { checkPermissions: Z, name: K } = A,
      { toolPermissionContext: F } = await B.getAppState(),
      U = ro1(F, A)
  if (U) return { behavior: "deny", decisionReason: { type: "rules", behavior: "deny", rule: U } }

  let W = oo1(F, A)
  if (W) return { behavior: "ask", decisionReason: { type: "rules", behavior: "ask", rule: W } }

  if (Z) {
    let N = await Z(Q, B)
    if (N?.behavior) return N
  }

  let Y = F.isBypassPermissionsModeAvailable && F.mode === "bypassPermissions"
  if (Y) return { behavior: "allow", decisionReason: { type: "bypassPermissionsMode" } }

  let H = so1(F, A)
  if (H) return { behavior: "allow", decisionReason: { type: "rules", behavior: "allow", rule: H } }

  return { behavior: "ask" }
}

// READABLE (for understanding):
async function toolPermissionDecisionEngine(tool, input, sessionContext, additionalParam) {
  const { checkPermissions, name: toolName } = tool
  const { toolPermissionContext } = await sessionContext.getAppState()

  // Step 1: Check deny rules first (highest priority)
  const denyRule = findDenyRuleForTool(toolPermissionContext, tool)
  if (denyRule) {
    return {
      behavior: "deny",
      decisionReason: { type: "rules", behavior: "deny", rule: denyRule }
    }
  }

  // Step 2: Check ask rules
  const askRule = findAskRuleForTool(toolPermissionContext, tool)
  if (askRule) {
    return {
      behavior: "ask",
      decisionReason: { type: "rules", behavior: "ask", rule: askRule }
    }
  }

  // Step 3: Call tool's custom permission check (if exists)
  if (checkPermissions) {
    const toolResult = await checkPermissions(input, sessionContext)
    if (toolResult?.behavior) return toolResult
  }

  // Step 4: Check bypassPermissions mode
  const isBypassMode = toolPermissionContext.isBypassPermissionsModeAvailable &&
                       toolPermissionContext.mode === "bypassPermissions"
  if (isBypassMode) {
    return { behavior: "allow", decisionReason: { type: "bypassPermissionsMode" } }
  }

  // Step 5: Check allow rules
  const allowRule = findAllowRuleForTool(toolPermissionContext, tool)
  if (allowRule) {
    return {
      behavior: "allow",
      decisionReason: { type: "rules", behavior: "allow", rule: allowRule }
    }
  }

  // Step 6: Default to ask
  return { behavior: "ask" }
}

// Mapping: Wb3→toolPermissionDecisionEngine, A→tool, Q→input, B→sessionContext, G→additionalParam
// ro1→findDenyRuleForTool, oo1→findAskRuleForTool, so1→findAllowRuleForTool, F→toolPermissionContext
```

**Decision Flow:**
1. **Deny rules** are evaluated first (highest priority)
2. **Ask rules** are evaluated second
3. **Tool's custom checkPermissions()** hook runs if defined
4. **BypassPermissions mode** grants auto-allow if enabled
5. **Allow rules** are evaluated last
6. **Default behavior** is to ask the user

### Rule Finding Helpers

```javascript
// ============================================
// Rule finding functions
// Location: chunks.153.mjs:1323-1333
// ============================================

// ORIGINAL (for source lookup):
let so1 = (A, Q) => CVA(A).find((B) => OK0(Q, B.ruleValue))
let ro1 = (A, Q) => KVA(A).find((B) => OK0(Q, B.ruleValue))
let oo1 = (A, Q) => yY1(A).find((B) => OK0(Q, B.ruleValue))

// READABLE (for understanding):
const findAllowRuleForTool = (context, tool) =>
  getAllowRules(context).find((rule) => ruleMatchesTool(tool, rule.ruleValue))

const findDenyRuleForTool = (context, tool) =>
  getDenialRules(context).find((rule) => ruleMatchesTool(tool, rule.ruleValue))

const findAskRuleForTool = (context, tool) =>
  getAskRules(context).find((rule) => ruleMatchesTool(tool, rule.ruleValue))

// Mapping: so1→findAllowRuleForTool, ro1→findDenyRuleForTool, oo1→findAskRuleForTool, OK0→ruleMatchesTool
```

### Permission Dispatcher with Mode Handling

```javascript
// ============================================
// toolPermissionDispatcher - Wrapper with special mode handling
// Location: chunks.153.mjs:1480-1502
// ============================================

// ORIGINAL (for source lookup):
async function M$(A, Q, B, G, Z) {
  let K = await Wb3(A, Q, B, G)
  if (K.behavior === "ask") {
    let F = await B.getAppState()
    if (F.toolPermissionContext.shouldAvoidPermissionPrompts)
      return { behavior: "deny", message: "Async agent should not ask permissions" }
    if (Z === "dontAsk")
      return { behavior: "deny", message: "Permission denied in dontAsk mode" }
  }
  return K
}

// READABLE (for understanding):
async function toolPermissionDispatcher(tool, input, sessionContext, additionalParam, mode) {
  const decision = await toolPermissionDecisionEngine(tool, input, sessionContext, additionalParam)

  if (decision.behavior === "ask") {
    const appState = await sessionContext.getAppState()

    // Check if async agent should avoid prompts
    if (appState.toolPermissionContext.shouldAvoidPermissionPrompts) {
      return {
        behavior: "deny",
        message: "Async agent should not ask permissions"
      }
    }

    // Check if in dontAsk mode (non-interactive)
    if (mode === "dontAsk") {
      return {
        behavior: "deny",
        message: "Permission denied in dontAsk mode"
      }
    }
  }

  return decision
}

// Mapping: M$→toolPermissionDispatcher, Wb3→toolPermissionDecisionEngine, Z→mode
```

### Permission Check Examples

#### Write Tool Permission Check

```javascript
// ============================================
// Write tool checkPermissions implementation
// Location: chunks.122.mjs:3333
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A, Q) {
  let B = await Q.getAppState()
  return L0A(QV, A, B.toolPermissionContext)
}

// READABLE (for understanding):
async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return checkEditPermission(WriteTool, input, appState.toolPermissionContext);
}

// Mapping: L0A→checkEditPermission, QV→WriteTool
```

#### Bash Tool Permission Check

```javascript
// ============================================
// Bash command permission check (simplified flow)
// Location: chunks.90.mjs:1935-2008
// ============================================

// READABLE (for understanding - actual impl is more complex):
async function bashCommandPermissionCheck(input, sessionContext) {
  const { toolPermissionContext } = await sessionContext.getAppState()
  const { command } = input

  // Step 1: Parse command for syntax errors
  const parseResult = parseCommand(command)
  if (parseResult.error) {
    return { behavior: "allow" }  // Let bash handle syntax errors
  }

  // Step 2: Check sandbox auto-allow rules if enabled
  if (isSandboxEnabled(input)) {
    const sandboxResult = sandboxAutoAllowBash(input, toolPermissionContext)
    if (sandboxResult.behavior !== "passthrough") {
      return sandboxResult
    }
  }

  // Step 3: Exact command match
  const exactMatch = exactBashCommandMatcher(input, toolPermissionContext)
  if (exactMatch.behavior !== "passthrough") {
    return exactMatch
  }

  // Step 4: Parse and validate subcommands
  const subcommands = parseSubcommands(command)
  for (const subcommand of subcommands) {
    const result = prefixBashCommandMatcher(subcommand, toolPermissionContext)
    if (result.behavior === "deny" || result.behavior === "ask") {
      return result
    }
  }

  // Step 5: Check path redirections
  const redirectionResult = pathRedirectionPermissionCheck(input, toolPermissionContext)
  if (redirectionResult.behavior !== "passthrough") {
    return redirectionResult
  }

  return { behavior: "allow" }
}

// Key functions: no1→bashCommandPermissionCheck, io1→exactBashCommandMatcher,
// oA2→prefixBashCommandMatcher, fo1→pathRedirectionPermissionCheck, k05→sandboxAutoAllowBash
```

#### LSP Tool Permission Check

```javascript
// ============================================
// LSP tool checkPermissions implementation
// Location: chunks.146.mjs:80
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A, Q) {
  let B = await Q.getAppState()
  return jl(FV0, A, B.toolPermissionContext)
}

// READABLE (for understanding):
async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return checkLspPermission(LspTool, input, appState.toolPermissionContext);
}

// Mapping: jl→checkLspPermission, FV0→LspTool
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

```javascript
// ============================================
// parseRuleString - Parse permission rule strings
// Location: chunks.153.mjs:1230-1244
// ============================================

// ORIGINAL (for source lookup):
function nN(A) {
  let Q = /^([^(]+)\(([^)]+)\)$/,
      B = A.match(Q)
  return B ? { toolName: B[1], ruleContent: B[2] } : { toolName: A }
}

// READABLE (for understanding):
function parseRuleString(rule) {
  const RULE_REGEX = /^([^(]+)\(([^)]+)\)$/   // matches "toolName(content)"
  const match = rule.match(RULE_REGEX)

  if (match) {
    return {
      toolName: match[1],     // e.g., "Edit", "WebFetch", "Bash"
      ruleContent: match[2]   // e.g., "/path/to/file", "domain:example.com"
    }
  }

  return {
    toolName: rule           // e.g., "Edit", "Bash", "Read" (without content)
  }
}

// Mapping: nN→parseRuleString, Q→RULE_REGEX
```

**Rule Format Examples:**
```
Edit                           → { toolName: "Edit" }
Edit(/path/to/file)            → { toolName: "Edit", ruleContent: "/path/to/file" }
Bash(cat /etc/passwd)          → { toolName: "Bash", ruleContent: "cat /etc/passwd" }
WebFetch(domain:example.com)   → { toolName: "WebFetch", ruleContent: "domain:example.com" }
```

### Rule Stringify

```javascript
// ============================================
// stringifyRule - Convert rule object back to string
// Location: chunks.153.mjs:1246-1248
// ============================================

// ORIGINAL (for source lookup):
let B3 = (A) => A.ruleContent ? `${A.toolName}(${A.ruleContent})` : A.toolName

// READABLE (for understanding):
const stringifyRule = (rule) =>
  rule.ruleContent
    ? `${rule.toolName}(${rule.ruleContent})`
    : rule.toolName

// Mapping: B3→stringifyRule
```

### Rule-Tool Matching

```javascript
// ============================================
// ruleMatchesTool - Check if rule matches tool
// Location: chunks.153.mjs:1315-1321
// ============================================

// ORIGINAL (for source lookup):
function OK0(A, Q) {
  if (A.name === Q.toolName) return !0
  let B = mU(A.name)
  return B && Q.toolName === `mcp__${B.serverName}` ? !0 : !1
}

// READABLE (for understanding):
function ruleMatchesTool(tool, rule) {
  // Exact tool name match
  if (tool.name === rule.toolName) return true

  // MCP server-level match (e.g., rule "mcp__myserver" matches tool "mcp__myserver__toolname")
  const mcpParsed = parseMcpToolName(tool.name)
  if (mcpParsed && rule.toolName === `mcp__${mcpParsed.serverName}`) {
    return true
  }

  return false
}

// Mapping: OK0→ruleMatchesTool, A→tool, Q→rule, mU→parseMcpToolName
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

### File Path Rule Matching Implementation

```javascript
// ============================================
// filePathRuleMatching - Match file paths against rules
// Location: chunks.154.mjs:1697-1726
// ============================================

// ORIGINAL (for source lookup):
function jD(A, Q, B, G) {
  let Z = G === "allow" ? CVA : G === "deny" ? KVA : yY1,
      K = Z(Q).filter((W) => {
        let { toolName: N, ruleContent: Y } = W.ruleValue
        if (N !== B) return !1
        if (!Y) return !1
        return yq(A, Y) !== null
      })
  return K.length > 0 ? K[0] : null
}

// READABLE (for understanding):
function filePathRuleMatching(filePath, permissionContext, operation, behavior) {
  // Select appropriate rule getter based on behavior type
  const getRules = behavior === "allow" ? getAllowRules
                 : behavior === "deny"  ? getDenialRules
                 : getAskRules

  const matchingRules = getRules(permissionContext).filter((rule) => {
    const { toolName, ruleContent } = rule.ruleValue

    // Must be for the correct operation (Edit, Read, etc.)
    if (toolName !== operation) return false

    // Must have a path pattern
    if (!ruleContent) return false

    // Check if file path matches the pattern
    return globMatch(filePath, ruleContent) !== null
  })

  return matchingRules.length > 0 ? matchingRules[0] : null
}

// Mapping: jD→filePathRuleMatching, A→filePath, Q→permissionContext, B→operation, G→behavior
// CVA→getAllowRules, KVA→getDenialRules, yY1→getAskRules, yq→globMatch
```

### Edit Permission Check

```javascript
// ============================================
// checkEditPermission - Comprehensive file edit permission checker
// Location: chunks.154.mjs:1815-1856
// ============================================

// ORIGINAL (for source lookup):
function L0A(A, Q, B) {
  let G = A.getPath(Q),
      Z = jD(G, B, "Edit", "deny")
  if (Z) return { behavior: "deny", decisionReason: { type: "rules", behavior: "deny", rule: Z } }

  if (X2(G)) return { behavior: "allow", decisionReason: { type: "planFiles" } }

  let K = yR(G)
  if (K) return { behavior: "ask", decisionReason: { type: "fileSafety", issue: K } }

  let F = jD(G, B, "Edit", "allow")
  if (F) return { behavior: "allow", decisionReason: { type: "rules", behavior: "allow", rule: F } }

  return { behavior: "ask" }
}

// READABLE (for understanding):
function checkEditPermission(tool, input, permissionContext) {
  const filePath = tool.getPath(input)

  // Step 1: Check explicit deny rules
  const denyRule = filePathRuleMatching(filePath, permissionContext, "Edit", "deny")
  if (denyRule) {
    return {
      behavior: "deny",
      decisionReason: { type: "rules", behavior: "deny", rule: denyRule }
    }
  }

  // Step 2: Auto-allow plan files
  if (isPlanFile(filePath)) {
    return {
      behavior: "allow",
      decisionReason: { type: "planFiles" }
    }
  }

  // Step 3: Check file safety (symlinks, special files)
  const safetyIssue = checkFileSafety(filePath)
  if (safetyIssue) {
    return {
      behavior: "ask",
      decisionReason: { type: "fileSafety", issue: safetyIssue }
    }
  }

  // Step 4: Check explicit allow rules
  const allowRule = filePathRuleMatching(filePath, permissionContext, "Edit", "allow")
  if (allowRule) {
    return {
      behavior: "allow",
      decisionReason: { type: "rules", behavior: "allow", rule: allowRule }
    }
  }

  // Step 5: Default to ask
  return { behavior: "ask" }
}

// Mapping: L0A→checkEditPermission, A→tool, Q→input, B→permissionContext
// jD→filePathRuleMatching, X2→isPlanFile, yR→checkFileSafety
```

### Main File Permission Check Function (Pseudocode)

```javascript
// ============================================
// File Permission Check Flow (consolidated pseudocode)
// ============================================

function checkFilePermission(tool, input, permissionContext, operation = "edit") {
  const filePath = resolvePath(tool.getPath(input));

  // Step 1: Check denylists first (denies have highest priority)
  const denyMatch = filePathRuleMatching(filePath, permissionContext, operation, "deny")
  if (denyMatch !== null) {
    return { behavior: "deny", decisionReason: { type: "rules", rule: denyMatch } }
  }

  // Step 2: Check allowlists
  const allowMatch = filePathRuleMatching(filePath, permissionContext, operation, "allow")
  if (allowMatch !== null) {
    return { behavior: "allow", decisionReason: { type: "rules", rule: allowMatch } }
  }

  // Step 3: Default to ask
  return { behavior: "ask" }
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

## Permission Context Management

### Permission Context Initialization

```javascript
// ============================================
// initializePermissionContext - Create default permission context
// Location: chunks.70.mjs:2169-2176
// ============================================

// ORIGINAL (for source lookup):
let ZE = () => ({
  mode: "default",
  additionalWorkingDirectories: new Map,
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: !1
})

// READABLE (for understanding):
function initializePermissionContext() {
  return {
    mode: "default",                         // Permission mode
    additionalWorkingDirectories: new Map(), // Extra directories
    alwaysAllowRules: {},                    // Allow rules by source
    alwaysDenyRules: {},                     // Deny rules by source
    alwaysAskRules: {},                      // Ask rules by source
    isBypassPermissionsModeAvailable: false  // Can bypass permissions?
  }
}

// Mapping: ZE→initializePermissionContext
```

### Apply Permission Update

```javascript
// ============================================
// applyPermissionUpdate - Apply permission changes to context
// Location: chunks.16.mjs:1122-1192
// ============================================

// ORIGINAL (for source lookup):
function UF(A, Q) {
  let { type: B } = Q
  switch (B) {
    case "setMode":
      return { ...A, mode: Q.mode }
    case "addRules":
      return { ...A, [Q.ruleBehavior === "allow" ? "alwaysAllowRules" : Q.ruleBehavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules"]: /* merge logic */ }
    case "replaceRules":
      return { ...A, /* replace logic */ }
    case "addDirectories":
      return { ...A, additionalWorkingDirectories: /* merge logic */ }
    case "removeRules":
      return { ...A, /* remove logic */ }
    case "removeDirectories":
      return { ...A, /* remove logic */ }
    default:
      return A
  }
}

// READABLE (for understanding):
function applyPermissionUpdate(currentContext, update) {
  const { type } = update

  switch (type) {
    case "setMode":
      return { ...currentContext, mode: update.mode }

    case "addRules":
      // Add rules to appropriate behavior bucket (allow/deny/ask)
      const rulesKey = update.ruleBehavior === "allow" ? "alwaysAllowRules"
                     : update.ruleBehavior === "deny"  ? "alwaysDenyRules"
                     : "alwaysAskRules"
      return {
        ...currentContext,
        [rulesKey]: mergeRules(currentContext[rulesKey], update.destination, update.rules)
      }

    case "replaceRules":
      // Replace all rules for a destination source
      return {
        ...currentContext,
        [rulesKey]: replaceRules(currentContext[rulesKey], update.destination, update.rules)
      }

    case "addDirectories":
      // Add working directories
      const newDirs = new Map(currentContext.additionalWorkingDirectories)
      for (const dir of update.directories) {
        newDirs.set(dir.path, { path: dir.path, source: dir.source })
      }
      return { ...currentContext, additionalWorkingDirectories: newDirs }

    case "removeRules":
      // Remove specific rules
      return { ...currentContext, /* filtered rules */ }

    case "removeDirectories":
      // Remove working directories
      return { ...currentContext, /* filtered directories */ }

    default:
      return currentContext
  }
}

// Mapping: UF→applyPermissionUpdate, A→currentContext, Q→update, B→type
```

### Persist Rule to Settings

```javascript
// ============================================
// persistRuleAddition - Save rules to settings file
// Location: chunks.16.mjs:1072-1098
// ============================================

// ORIGINAL (for source lookup):
async function JxA(A, Q, B) {
  let G = A.map(B3),
      Z = await OB(B)
  if (!Z) Z = {}
  let K = Z.permissions?.[Q] ?? [],
      F = new Set(K),
      U = G.filter((W) => !F.has(W))
  if (U.length === 0) return !0
  return cB(B, { ...Z, permissions: { ...Z.permissions, [Q]: [...K, ...U] } })
}

// READABLE (for understanding):
async function persistRuleAddition(ruleValues, ruleBehavior, settingsSource) {
  // Convert rules to string format
  const ruleStrings = ruleValues.map(stringifyRule)

  // Read current settings
  let settings = await readSettingsFile(settingsSource)
  if (!settings) settings = {}

  // Get existing rules for this behavior
  const existingRules = settings.permissions?.[ruleBehavior] ?? []

  // Deduplicate new rules
  const existingSet = new Set(existingRules)
  const newRules = ruleStrings.filter((rule) => !existingSet.has(rule))

  // Nothing new to add
  if (newRules.length === 0) return true

  // Write updated settings
  return writeSettingsFile(settingsSource, {
    ...settings,
    permissions: {
      ...settings.permissions,
      [ruleBehavior]: [...existingRules, ...newRules]
    }
  })
}

// Mapping: JxA→persistRuleAddition, B3→stringifyRule, OB→readSettingsFile, cB→writeSettingsFile
```

### Persist Rule Deletion

```javascript
// ============================================
// persistRuleDeletion - Remove rule from settings file
// Location: chunks.16.mjs:1038-1060
// ============================================

// ORIGINAL (for source lookup):
async function fh0(A) {
  let Q = B3(A.ruleValue),
      B = await OB(A.source)
  if (!B) return !1
  let G = B.permissions?.[A.ruleBehavior]
  if (!G) return !1
  let Z = G.filter((K) => K !== Q)
  return cB(A.source, { ...B, permissions: { ...B.permissions, [A.ruleBehavior]: Z } })
}

// READABLE (for understanding):
async function persistRuleDeletion(rule) {
  const ruleString = stringifyRule(rule.ruleValue)

  // Read current settings
  const settings = await readSettingsFile(rule.source)
  if (!settings) return false

  // Get existing rules for this behavior
  const existingRules = settings.permissions?.[rule.ruleBehavior]
  if (!existingRules) return false

  // Filter out the rule to delete
  const remainingRules = existingRules.filter((r) => r !== ruleString)

  // Write updated settings
  return writeSettingsFile(rule.source, {
    ...settings,
    permissions: {
      ...settings.permissions,
      [rule.ruleBehavior]: remainingRules
    }
  })
}

// Mapping: fh0→persistRuleDeletion, B3→stringifyRule, OB→readSettingsFile, cB→writeSettingsFile
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

**Tool Name Constants:**
- `$5` → EDIT_TOOL_NAME = "Edit"
- `d5` → READ_TOOL_NAME = "Read"
- `$X` → WEBFETCH_TOOL_NAME = "WebFetch"
- `C9` → BASH_TOOL_NAME = "Bash"
- `wX` → WRITE_TOOL_NAME = "Write"

### Edit/Write Tool Rules

From `chunks.19.mjs:569-577`:

```typescript
// Allow rules for Edit tool ($5 = EDIT_TOOL_NAME = "Edit")
for (const rule of permissions.allow || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$5" && parsed.ruleContent) {  // $5 = "Edit"
    allowedPaths.push(parsed.ruleContent);
  }
}

// Deny rules for Edit tool
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$5" && parsed.ruleContent) {  // $5 = "Edit"
    deniedPaths.push(parsed.ruleContent);
  }
}
```

### Read Tool Rules

From `chunks.19.mjs:575-577`:

```typescript
// Deny rules for Read tool (d5 = READ_TOOL_NAME = "Read")
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "d5" && parsed.ruleContent) {  // d5 = "Read"
    readDeniedPaths.push(parsed.ruleContent);
  }
}
```

### WebFetch Domain Rules

From `chunks.19.mjs:553-560`:

```typescript
// Allow rules for WebFetch ($X = WEBFETCH_TOOL_NAME = "WebFetch")
const allowedDomains = [];
for (const rule of permissions.allow || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$X" && parsed.ruleContent?.startsWith("domain:")) {  // $X = "WebFetch"
    allowedDomains.push(parsed.ruleContent.substring(7));
  }
}

// Deny rules for WebFetch
const blockedDomains = [];
for (const rule of permissions.deny || []) {
  const parsed = parsePermissionRule(rule);
  if (parsed.toolName === "$X" && parsed.ruleContent?.startsWith("domain:")) {  // $X = "WebFetch"
    blockedDomains.push(parsed.ruleContent.substring(7));
  }
}
```

### Bash Command Rules

From `chunks.19.mjs:728-733`:

```typescript
// Find Bash tool rules in permissions (C9 = BASH_TOOL_NAME = "Bash")
const bashRules = permissions.filter(
  rule => rule.type === "addRules" &&
  rule.rules.some(r => r.toolName === "C9")  // C9 = "Bash"
);

if (bashRules.length > 0) {
  const bashRule = bashRules[0].rules.find(r => r.toolName === "C9");  // C9 = "Bash"
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
