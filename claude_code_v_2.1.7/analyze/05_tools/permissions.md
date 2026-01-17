# Tool Permissions System (Claude Code v2.1.7)

This document describes how Claude Code handles tool permissions, including permission checking flow, behaviors, context, and file path patterns.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

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
- **Session settings** - Runtime permissions

---

## Key Permission Functions

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `lz7` | toolPermissionDecisionEngine | chunks.147.mjs:1538 | Main permission checking |
| `B$` | toolPermissionDispatcher | chunks.147.mjs:1658 | Permission wrapper with mode handling |
| `Jr` | fileReadPermissionCheck | chunks.148.mjs:2339 | Read permission checker |
| `g6A` | fileWritePermissionCheck | chunks.148.mjs:2419 | Write permission checker |
| `AE` | filePathRuleMatching | chunks.148.mjs:2308 | Path rule matching |
| `CVA` | getAllowRules | chunks.147.mjs:1422 | Get allow rules |
| `_d` | getDenyRules | chunks.147.mjs:1471 | Get deny rules |
| `UVA` | getAskRules | chunks.147.mjs:1479 | Get ask rules |

---

## Permission Behaviors

The permission system returns one of four behaviors:

| Behavior | Description | UI Action |
|----------|-------------|-----------|
| `"allow"` | Automatically allowed | Execute immediately |
| `"deny"` | Automatically blocked | Return error to model |
| `"ask"` | Requires user prompt | Show permission dialog |
| `"passthrough"` | No rule match | Use defaults |

---

## Permission Decision Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Permission Decision Flow                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool.checkPermissions(input, context)                                       │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────┐                                     │
│  │ 1. Check DENY rules                 │  If match → return "deny"           │
│  │    getDenyRules(context)            │                                     │
│  └─────────────────┬───────────────────┘                                     │
│                    │ No match                                                │
│                    ▼                                                         │
│  ┌─────────────────────────────────────┐                                     │
│  │ 2. Check ASK rules                  │  If match → return "ask"            │
│  │    getAskRules(context)             │                                     │
│  └─────────────────┬───────────────────┘                                     │
│                    │ No match                                                │
│                    ▼                                                         │
│  ┌─────────────────────────────────────┐                                     │
│  │ 3. Tool-specific checkPermissions   │  Custom logic per tool              │
│  │    (e.g., Bash command analysis)    │                                     │
│  └─────────────────┬───────────────────┘                                     │
│                    │                                                         │
│                    ▼                                                         │
│  ┌─────────────────────────────────────┐                                     │
│  │ 4. Check ALLOW rules                │  If match → return "allow"          │
│  │    getAllowRules(context)           │                                     │
│  └─────────────────┬───────────────────┘                                     │
│                    │ No match                                                │
│                    ▼                                                         │
│  ┌─────────────────────────────────────┐                                     │
│  │ 5. Default behavior                 │  Usually "ask" for writes           │
│  │    (passthrough → ask)              │  "allow" for reads                  │
│  └─────────────────────────────────────┘                                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Rule Retrieval Functions

### getAllowRules

```javascript
// ============================================
// getAllowRules - Retrieve all allow rules from context
// Location: chunks.147.mjs:1422
// ============================================

// READABLE (for understanding):
function getAllowRules(permissionContext) {
  return getPermissionRules(permissionContext, "allow")
    .map(rule => ({
      ...rule,
      ruleValue: parseRuleValue(rule.ruleValue)
    }));
}
```

### getDenyRules

```javascript
// ============================================
// getDenyRules - Retrieve all deny rules from context
// Location: chunks.147.mjs:1471
// ============================================

// READABLE (for understanding):
function getDenyRules(permissionContext) {
  return getPermissionRules(permissionContext, "deny")
    .map(rule => ({
      ...rule,
      ruleValue: parseRuleValue(rule.ruleValue)
    }));
}
```

### getAskRules

```javascript
// ============================================
// getAskRules - Retrieve all ask rules from context
// Location: chunks.147.mjs:1479
// ============================================

// READABLE (for understanding):
function getAskRules(permissionContext) {
  return getPermissionRules(permissionContext, "ask")
    .map(rule => ({
      ...rule,
      ruleValue: parseRuleValue(rule.ruleValue)
    }));
}
```

---

## File Permission Checking

### Read Permission Check (Jr)

```javascript
// ============================================
// fileReadPermissionCheck - Evaluate read permissions
// Location: chunks.148.mjs:2339
// ============================================

// READABLE (for understanding):
function fileReadPermissionCheck(tool, input, permissionContext) {
  const filePath = tool.getPath(input);
  const resolvedPath = resolvePath(filePath);

  // Step 1: Check UNC paths (Windows network paths)
  if (resolvedPath.startsWith("\\\\") || resolvedPath.startsWith("//")) {
    return { behavior: "ask", message: "UNC paths require permission" };
  }

  // Step 2: Windows suspicious pattern check
  if (hasWindowsSuspiciousPattern(resolvedPath)) {
    return { behavior: "deny", message: "Suspicious Windows path pattern" };
  }

  // Step 3: Check deny rules
  const denyMatch = filePathRuleMatching(resolvedPath, permissionContext, "read", "deny");
  if (denyMatch) {
    return { behavior: "deny", decisionReason: { type: "rule", rule: denyMatch } };
  }

  // Step 4: Check ask rules
  const askMatch = filePathRuleMatching(resolvedPath, permissionContext, "read", "ask");
  if (askMatch) {
    return { behavior: "ask", decisionReason: { type: "rule", rule: askMatch } };
  }

  // Step 5: Check if external write (outside working directory)
  if (!isPathInWorkingDirectory(resolvedPath)) {
    return { behavior: "ask", message: "File is outside working directory" };
  }

  // Step 6: Check allow rules
  const allowMatch = filePathRuleMatching(resolvedPath, permissionContext, "read", "allow");
  if (allowMatch) {
    return { behavior: "allow", decisionReason: { type: "rule", rule: allowMatch } };
  }

  // Step 7: Default to allow for reads in working directory
  return { behavior: "allow", updatedInput: input };
}
```

### Write Permission Check (g6A)

```javascript
// ============================================
// fileWritePermissionCheck - Evaluate write permissions
// Location: chunks.148.mjs:2419
// ============================================

// READABLE (for understanding):
function fileWritePermissionCheck(tool, input, permissionContext) {
  const filePath = tool.getPath(input);
  const resolvedPath = resolvePath(filePath);

  // Step 1: Check deny rules
  const denyMatch = filePathRuleMatching(resolvedPath, permissionContext, "edit", "deny");
  if (denyMatch) {
    return { behavior: "deny", decisionReason: { type: "rule", rule: denyMatch } };
  }

  // Step 2: Check if safe file (e.g., plan files)
  if (isSafeFile(resolvedPath)) {
    return { behavior: "allow", updatedInput: input };
  }

  // Step 3: Check ask rules
  const askMatch = filePathRuleMatching(resolvedPath, permissionContext, "edit", "ask");
  if (askMatch) {
    return { behavior: "ask", decisionReason: { type: "rule", rule: askMatch } };
  }

  // Step 4: Check acceptEdits mode
  if (permissionContext.acceptEdits) {
    return { behavior: "allow", updatedInput: input };
  }

  // Step 5: Check allow rules
  const allowMatch = filePathRuleMatching(resolvedPath, permissionContext, "edit", "allow");
  if (allowMatch) {
    return { behavior: "allow", decisionReason: { type: "rule", rule: allowMatch } };
  }

  // Step 6: Default to ask for writes
  return { behavior: "ask", message: "File modification requires permission" };
}
```

---

## File Path Rule Matching (AE)

```javascript
// ============================================
// filePathRuleMatching - Match path against permission rules
// Location: chunks.148.mjs:2308
// ============================================

// READABLE (for understanding):
function filePathRuleMatching(path, permissionContext, operation, behavior) {
  const rules = getRulesByBehavior(permissionContext, behavior);
  const allPaths = resolveAllPaths(path);  // Follow symlinks

  for (const resolvedPath of allPaths) {
    for (const [ruleContent, rule] of rules) {
      // Check if rule applies to this operation
      if (rule.operation && rule.operation !== operation) continue;

      // Check glob pattern match
      if (globMatch(resolvedPath, ruleContent)) {
        return rule;
      }
    }
  }

  return null;
}
```

---

## Path Safety Validation

### Windows Suspicious Pattern Detection

```javascript
// ============================================
// hasWindowsSuspiciousPattern - Detect suspicious Windows paths
// Location: chunks.148.mjs:2136
// ============================================

// READABLE (for understanding):
function hasWindowsSuspiciousPattern(path) {
  // Check for:
  // 1. Alternate data streams (`:` at position 2+)
  // 2. Short name syntax (`~\d`)
  // 3. Extended-length paths (`\\?\`, `\\.\\`, `//?/`, `//./`)
  // 4. Trailing dots/spaces
  // 5. Reserved names (CON, PRN, AUX, NUL, COM#, LPT#)
  // 6. 3+ consecutive dots

  if (path.indexOf(":", 2) !== -1) return true;  // ADS
  if (/~\d/.test(path)) return true;  // Short names
  if (/^(\\\\[\?\.][\\\/]|\/\/[\?\.]\/)/i.test(path)) return true;  // Extended
  if (/[\. ]$/.test(path)) return true;  // Trailing dot/space
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(getBasename(path))) return true;
  if (/\.{3,}/.test(path)) return true;  // Multiple dots

  return false;
}
```

### Locked Directory Check

```javascript
// ============================================
// isLockedDirectory - Check if path is in locked directory
// Location: chunks.148.mjs:2046
// ============================================

// READABLE (for understanding):
function isLockedDirectory(path) {
  const lockedDirs = [".claude", ".claude/commands", ".claude/agents", ".claude/skills"];
  return lockedDirs.some(dir => path.includes(dir));
}
```

### Sensitive File Check

```javascript
// ============================================
// isSensitiveFile - Check if path is a sensitive file
// Location: chunks.148.mjs:2113
// ============================================

// Sensitive file names
const SENSITIVE_FILES = [
  ".gitconfig", ".gitmodules", ".bashrc", ".bash_profile",
  ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"
];

// Sensitive directories
const SENSITIVE_DIRS = [".git", ".vscode", ".idea", ".claude"];

function isSensitiveFile(path) {
  const basename = getBasename(path);
  const dirname = getDirname(path);

  if (SENSITIVE_FILES.includes(basename)) return true;
  if (SENSITIVE_DIRS.some(dir => path.includes(`/${dir}/`))) return true;

  return false;
}
```

---

## Permission Context Structure

```typescript
interface ToolPermissionContext {
  // Rule sources (in priority order)
  userSettings: PermissionRules;
  policySettings: PermissionRules;      // Managed/enterprise
  projectSettings: PermissionRules;     // .claude/settings.json
  localSettings: PermissionRules;       // ~/.claude/settings.json
  flagSettings: PermissionRules;        // Feature flags
  cliArg: PermissionRules;              // CLI arguments
  command: PermissionRules;             // Slash command permissions
  session: PermissionRules;             // Runtime permissions

  // Mode flags
  acceptEdits?: boolean;                // Auto-accept file edits
  dontAsk?: boolean;                    // Skip all prompts
  shouldAvoidPermissionPrompts?: boolean;

  // Path restrictions
  allowedPaths?: string[];
  deniedPaths?: string[];
  workingDirectories: string[];
}

interface PermissionRules {
  allow?: PermissionRule[];
  deny?: PermissionRule[];
  ask?: PermissionRule[];
}

interface PermissionRule {
  toolName?: string;
  ruleContent?: string;    // Glob pattern or command pattern
  operation?: "read" | "edit";
  source: string;          // Where rule came from
}
```

---

## Tool-Specific Permission Checking

### Bash Command Permission Check

```javascript
// ============================================
// dq0 - Bash tool permission check
// Location: chunks.124.mjs:1557-1559
// ============================================

async checkPermissions(input, context) {
  return await bashCommandPermissionCheck(input, context);
}

// The bashCommandPermissionCheck function analyzes:
// 1. Command string parsing
// 2. Read-only vs write commands
// 3. Dangerous command patterns
// 4. Sandbox bypass requests
```

### WebFetch Permission Check

```javascript
// ============================================
// WebFetch permission check
// Location: chunks.119.mjs:1275-1332
// ============================================

async checkPermissions(input, context) {
  const { url } = input;
  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Step 1: Check preapproved hosts
  for (const approved of PREAPPROVED_HOSTS) {
    if (approved.includes("/")) {
      const [host, ...pathParts] = approved.split("/");
      const path = "/" + pathParts.join("/");
      if (hostname === host && parsed.pathname.startsWith(path)) {
        return { behavior: "allow", reason: "Preapproved host and path" };
      }
    } else if (hostname === approved) {
      return { behavior: "allow", reason: "Preapproved host" };
    }
  }

  // Step 2: Check deny/ask/allow rules by domain
  const permissionKey = `domain:${hostname}`;
  // ... check rules
}
```

---

## Decision Reason Types

Permission decisions include a `decisionReason` for debugging:

```typescript
type DecisionReason =
  | { type: "rule"; rule: PermissionRule }      // Matched a permission rule
  | { type: "mode"; mode: string }              // Permission mode (acceptEdits, etc.)
  | { type: "other"; reason: string }           // Other reasons (UNC path, sensitive file)
  | { type: "workingDir" }                      // Outside allowed directories
  | { type: "hook" }                            // Hook-based decision
  | { type: "asyncAgent" }                      // Async agent limitations
```

---

## Permission Dispatcher (B$)

Wraps the permission engine with mode handling:

```javascript
// ============================================
// toolPermissionDispatcher - Permission wrapper
// Location: chunks.147.mjs:1658
// ============================================

// READABLE (for understanding):
async function toolPermissionDispatcher(tool, input, context, assistantMessage, toolUseId) {
  // Call the decision engine
  const result = await toolPermissionDecisionEngine(tool, input, context);

  // Handle special modes
  if (context.dontAsk && result.behavior === "ask") {
    return { behavior: "deny", message: "Permission prompt skipped (dontAsk mode)" };
  }

  if (context.shouldAvoidPermissionPrompts && result.behavior === "ask") {
    return { behavior: "passthrough" };
  }

  // Convert passthrough to ask
  if (result.behavior === "passthrough") {
    return { behavior: "ask", ...result };
  }

  return result;
}
```

---

## Permission Rule Sources (Priority Order)

```javascript
// ============================================
// Rule source priority list
// Location: chunks.147.mjs:1696
// ============================================

const RULE_SOURCES = [
  "userSettings",     // User's global settings
  "policySettings",   // Enterprise/managed policies
  "projectSettings",  // Project-level .claude/settings.json
  "localSettings",    // User-local overrides
  "flagSettings",     // Feature flag-based rules
  "cliArg",           // Command-line arguments
  "command",          // Slash command permissions
  "session"           // Runtime session permissions
];
```

Higher priority sources override lower ones for the same rule pattern.

---

## Summary

The permission system in Claude Code v2.1.7:

1. **Multi-Level Rules** - Checks deny → ask → allow rules in order
2. **Path Safety** - Validates Windows patterns, locked directories, sensitive files
3. **Tool-Specific Logic** - Each tool has custom `checkPermissions` implementation
4. **Mode Support** - `acceptEdits`, `dontAsk`, and other modes affect behavior
5. **Symlink Resolution** - Follows symlinks up to 40 levels for complete checking
6. **Rule Sources** - Multiple configuration sources with priority ordering
7. **Decision Tracking** - `decisionReason` provides debugging information
