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

### Main Permission Decision Engine (Full 8-Step Process)

The central permission orchestrator `Wb3` implements an 8-step decision process:

```javascript
// ============================================
// toolPermissionDecisionEngine - Central Permission Orchestrator
// Location: chunks.153.mjs:1358-1417
// ============================================

// ORIGINAL (for source lookup):
async function Wb3(A, Q, B, G) {
  // A = tool, Q = input, B = context with getAppState/abortController
  if (B.abortController.signal.aborted) throw new WW;

  let Z = await B.getAppState(),
    I = ro1(Z.toolPermissionContext, A);

  // 1. Check for global deny rules
  if (I) return {
    behavior: "deny",
    decisionReason: { type: "rule", rule: I },
    message: `Permission to use ${A.name} has been denied.`
  };

  // 2. Check for global ask rules (unless Bash + sandbox + autoAllow)
  let Y = oo1(Z.toolPermissionContext, A);
  if (Y) {
    if (!(A.name === C9 && nQ.isSandboxingEnabled() && nQ.isAutoAllowBashIfSandboxedEnabled()))
      return {
        behavior: "ask",
        decisionReason: { type: "rule", rule: Y },
        message: yV(A.name)
      }
  }

  // 3. Call tool-specific checkPermissions (may be passthrough)
  let J = { behavior: "passthrough", message: yV(A.name) };
  try {
    let V = A.inputSchema.parse(Q);
    J = await A.checkPermissions(V, B)
  } catch (V) {
    AA(V)
  }

  // 4. Return if explicitly deny
  if (J?.behavior === "deny") return J;

  // 5. Skip further checks if tool requires user interaction + returns ask
  if (A.requiresUserInteraction?.() && J?.behavior === "ask") return J;

  // 6. Check for bypassPermissions mode
  if (Z = await B.getAppState(), Z.toolPermissionContext.mode === "bypassPermissions")
    return {
      behavior: "allow",
      updatedInput: Q,
      decisionReason: { type: "mode", mode: Z.toolPermissionContext.mode }
    };

  // 7. Check for global allow rules
  let W = so1(Z.toolPermissionContext, A);
  if (W) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: { type: "rule", rule: W }
  };

  // 8. Convert passthrough to ask, preserve existing ask
  let X = J.behavior === "passthrough" ? {
    ...J,
    behavior: "ask",
    message: yV(A.name, J.decisionReason)
  } : J;

  if (X.behavior === "ask" && X.suggestions)
    g(`Permission suggestions for ${A.name}: ${JSON.stringify(X.suggestions,null,2)}`);

  return X
}

// READABLE (for understanding):
async function toolPermissionDecisionEngine(tool, input, context, additionalParam) {
  // Step 0: Check for abort signal
  if (context.abortController.signal.aborted) {
    throw new AbortError();
  }

  const appState = await context.getAppState();
  const { toolPermissionContext } = appState;

  // Step 1: Check global deny rules (highest priority)
  const denyRule = findDenyRuleForTool(toolPermissionContext, tool);
  if (denyRule) {
    return {
      behavior: "deny",
      decisionReason: { type: "rule", rule: denyRule },
      message: `Permission to use ${tool.name} has been denied.`
    };
  }

  // Step 2: Check global ask rules
  // EXCEPTION: Bash tool can bypass ask if sandboxed + autoAllow enabled
  const askRule = findAskRuleForTool(toolPermissionContext, tool);
  if (askRule) {
    const isBashWithSandboxAutoAllow =
      tool.name === BASH_TOOL_NAME &&
      sandbox.isSandboxingEnabled() &&
      sandbox.isAutoAllowBashIfSandboxedEnabled();

    if (!isBashWithSandboxAutoAllow) {
      return {
        behavior: "ask",
        decisionReason: { type: "rule", rule: askRule },
        message: formatPermissionMessage(tool.name)
      };
    }
  }

  // Step 3: Call tool's custom checkPermissions
  let toolDecision = { behavior: "passthrough", message: formatPermissionMessage(tool.name) };
  try {
    const parsedInput = tool.inputSchema.parse(input);
    toolDecision = await tool.checkPermissions(parsedInput, context);
  } catch (error) {
    logError(error);
  }

  // Step 4: Return immediately if tool explicitly denies
  if (toolDecision?.behavior === "deny") {
    return toolDecision;
  }

  // Step 5: ★ CRITICAL - requiresUserInteraction bypass ★
  // If tool requires user interaction AND returns "ask", skip all further checks
  // This ensures tools like AskUserQuestion ALWAYS show their UI
  if (tool.requiresUserInteraction?.() && toolDecision?.behavior === "ask") {
    return toolDecision;
  }

  // Step 6: Check bypassPermissions mode
  const refreshedState = await context.getAppState();
  if (refreshedState.toolPermissionContext.mode === "bypassPermissions") {
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: { type: "mode", mode: "bypassPermissions" }
    };
  }

  // Step 7: Check global allow rules
  const allowRule = findAllowRuleForTool(toolPermissionContext, tool);
  if (allowRule) {
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: { type: "rule", rule: allowRule }
    };
  }

  // Step 8: Convert passthrough to ask, preserve existing ask
  const finalDecision = toolDecision.behavior === "passthrough"
    ? {
        ...toolDecision,
        behavior: "ask",
        message: formatPermissionMessage(tool.name, toolDecision.decisionReason)
      }
    : toolDecision;

  // Log suggestions if present
  if (finalDecision.behavior === "ask" && finalDecision.suggestions) {
    logDebug(`Permission suggestions for ${tool.name}: ${JSON.stringify(finalDecision.suggestions, null, 2)}`);
  }

  return finalDecision;
}

// Mapping: Wb3→toolPermissionDecisionEngine, A→tool, Q→input, B→context, G→additionalParam
// ro1→findDenyRuleForTool, oo1→findAskRuleForTool, so1→findAllowRuleForTool
// C9→BASH_TOOL_NAME, nQ→sandbox, yV→formatPermissionMessage, WW→AbortError
```

**Complete 8-Step Decision Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION DECISION FLOW (Wb3)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Input: tool, input, context]                                              │
│         ↓                                                                   │
│  Step 0: Check abort signal                                                 │
│         ↓                                                                   │
│  Step 1: Check global DENY rules ──────────────────────────▶ DENY          │
│         ↓ (no match)                                                        │
│  Step 2: Check global ASK rules ───────────────────────────▶ ASK           │
│         │ (exception: Bash + sandbox + autoAllow → continue)                │
│         ↓ (no match or exception)                                           │
│  Step 3: Call tool.checkPermissions() ─────────▶ toolDecision               │
│         ↓                                                                   │
│  Step 4: If toolDecision = DENY ───────────────────────────▶ DENY          │
│         ↓ (not deny)                                                        │
│  Step 5: If requiresUserInteraction + ASK ─────────────────▶ ASK (★)       │
│         │ ★ CRITICAL: Bypasses bypassPermissions mode!                      │
│         ↓ (not applicable)                                                  │
│  Step 6: Check bypassPermissions mode ─────────────────────▶ ALLOW         │
│         ↓ (not bypass mode)                                                 │
│  Step 7: Check global ALLOW rules ─────────────────────────▶ ALLOW         │
│         ↓ (no match)                                                        │
│  Step 8: Convert passthrough → ask ────────────────────────▶ ASK           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Observations:**

1. **Deny rules have highest priority** - Checked before anything else
2. **Bash has special handling** - Can bypass ask rules when sandboxed
3. **Tool-specific logic runs early** - Before bypassPermissions check
4. **requiresUserInteraction is critical** - Ensures AskUserQuestion always prompts
5. **Passthrough is internal state** - Converted to "ask" at the end

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

### Four Permission Behavior Types

Claude Code uses four behavior types in its permission system. Three are external (returned to the caller), and one is internal (used during processing):

```javascript
// ============================================
// Permission Behavior Schema
// Location: chunks.106.mjs:1634-1644
// ============================================

// External behaviors (returned to caller)
behavior: W2.enum(["allow", "deny", "ask"])

// Internal behavior (used during processing)
behavior: "passthrough"  // Means: no decision made yet, continue processing
```

| Behavior | Type | Meaning | Next Action |
|----------|------|---------|-------------|
| `"allow"` | External | Permission granted | Execute tool immediately |
| `"deny"` | External | Permission denied | Block tool, show error |
| `"ask"` | External | Request user approval | Show permission dialog |
| `"passthrough"` | Internal | No decision yet | Continue to next check |

#### 1. Allow (Auto-Approve)

```typescript
{
  behavior: "allow",
  updatedInput: input,           // Input may be unchanged or modified
  decisionReason?: {             // Optional reason for the decision
    type: "rule" | "mode" | "other",
    rule?: Rule,
    mode?: string,
    reason?: string
  }
}
```

**When Used**:
- File/directory matches an allow rule
- Command is explicitly allowed
- Tool has blanket approval
- bypassPermissions mode is enabled
- Plan files (auto-allowed during plan mode)

**Effect**: Tool executes immediately without user prompt

#### 2. Deny (Auto-Reject)

```typescript
{
  behavior: "deny",
  updatedInput: input,
  message?: string,              // Error message shown to user
  decisionReason?: {
    type: "rule" | "hook" | "fileSafety" | "other",
    rule?: Rule,
    hookName?: string,
    issue?: string
  }
}
```

**When Used**:
- File/directory matches a deny rule
- Command is explicitly denied
- File is in restricted location (symlinks, special files)
- Enterprise policy blocks the operation
- Hook rejects the operation
- Async agent attempting to prompt (shouldAvoidPermissionPrompts)

**Effect**: Tool execution is blocked, error returned to Claude

#### 3. Ask (Prompt User)

```typescript
{
  behavior: "ask",
  updatedInput: input,
  message?: string,              // Custom prompt message
  suggestions?: Suggestion[],    // Suggested rules for user
  decisionReason?: {
    type: "rule" | "hook" | "classifier" | "workingDir" | "other",
    // ... additional fields based on type
  }
}
```

**When Used**:
- No explicit allow or deny rule matches
- User interaction is available
- First time accessing a path/command
- Tool-specific validation requires confirmation
- Tools that require user interaction (AskUserQuestion)

**Effect**: User is prompted to allow/deny/always allow/always deny

#### 4. Passthrough (Internal - No Decision)

```typescript
{
  behavior: "passthrough",
  message?: string,              // Default permission message
  decisionReason?: {
    type: "other",
    reason: string
  }
}
```

**When Used**:
- Default return from tool's checkPermissions when no specific decision is made
- Tool wants to defer to the global rule checks
- Used internally during permission evaluation

**Effect**: Continue to next check in the decision flow. Eventually converted to "ask" at step 8 if no other decision is made.

**Important**: Passthrough is NEVER returned to the caller. It's always converted to "ask" before the final return.

### Behavior Conversion Flow

```
Tool.checkPermissions() returns:
  ├── "allow"      → Return immediately (Step 3+7)
  ├── "deny"       → Return immediately (Step 4)
  ├── "ask"        → Return immediately if requiresUserInteraction (Step 5)
  │                  Otherwise, continue to mode/rule checks
  └── "passthrough" → Continue processing, convert to "ask" at Step 8
```

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

## AskUserQuestion Permission Integration

AskUserQuestion has a unique permission implementation that ensures it **always prompts the user**, even when `bypassPermissions` mode is enabled.

### Key Mechanism: requiresUserInteraction

```javascript
// ============================================
// AskUserQuestion Tool - requiresUserInteraction method
// Location: chunks.130.mjs:3438-3440
// ============================================

requiresUserInteraction() {
  return true  // ★ CRITICAL: Always requires user interaction
}
```

This method is checked in Step 5 of the permission decision flow:

```javascript
// Step 5 in Wb3 (permission orchestrator):
if (tool.requiresUserInteraction?.() && toolDecision?.behavior === "ask") {
  return toolDecision;  // Bypass all remaining checks including bypassPermissions mode
}
```

### checkPermissions Implementation

```javascript
// ============================================
// AskUserQuestion Tool - checkPermissions method
// Location: chunks.130.mjs:3428-3434
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(A) {
  return {
    behavior: "ask",
    message: "Answer questions?",
    updatedInput: A
    // NOTE: No timeout field - waits indefinitely for user response
  }
}

// READABLE (for understanding):
async checkPermissions(input) {
  return {
    behavior: "ask",              // Always ask - triggers UI
    message: "Answer questions?", // Prompt message
    updatedInput: input           // Pass through original input
  };
}
```

### Permission Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ASKUSERQUESTION PERMISSION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Claude calls AskUserQuestion                                            │
│     tool_use: { name: "AskUserQuestion", input: { questions: [...] } }      │
│         ↓                                                                   │
│  2. Wb3 (permission orchestrator) is invoked                                │
│     ├── Step 1: No global deny rule for AskUserQuestion                     │
│     ├── Step 2: No global ask rule (or bypassed)                            │
│     └── Step 3: Call tool.checkPermissions(input)                           │
│         ↓                                                                   │
│  3. AskUserQuestion.checkPermissions() returns:                             │
│     { behavior: "ask", message: "Answer questions?", updatedInput: input }  │
│         ↓                                                                   │
│  4. Wb3 Step 4: Not a deny → continue                                       │
│         ↓                                                                   │
│  5. Wb3 Step 5: ★ CRITICAL CHECK ★                                          │
│     tool.requiresUserInteraction() → true                                   │
│     toolDecision.behavior → "ask"                                           │
│     → IMMEDIATELY RETURN, skip bypassPermissions check!                     │
│         ↓                                                                   │
│  6. Permission system triggers UI display                                   │
│     ├── Custom UI component (md2) is rendered                               │
│     ├── Questions are displayed with options                                │
│     └── User selects answers or enters custom text                          │
│         ↓                                                                   │
│  7. User clicks Submit                                                      │
│     N() callback fires → A.onAllow(updatedInputWithAnswers, [])             │
│         ↓                                                                   │
│  8. Tool.call() executes with injected answers                              │
│     Returns: { data: { questions, answers } }                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why requiresUserInteraction is Critical

Without `requiresUserInteraction`, the permission flow would be:

```
Step 3: checkPermissions() → { behavior: "ask" }
Step 4: Not deny → continue
Step 5: No requiresUserInteraction check → continue
Step 6: bypassPermissions mode? → YES → return "allow"
        ★ BUG: Tool would execute without showing questions!
```

With `requiresUserInteraction`:

```
Step 3: checkPermissions() → { behavior: "ask" }
Step 4: Not deny → continue
Step 5: requiresUserInteraction() = true + behavior = "ask"
        → RETURN "ask" immediately
        ★ CORRECT: UI is always shown regardless of mode
```

### Tools Using requiresUserInteraction

Only **AskUserQuestion** currently uses this mechanism:

| Tool | requiresUserInteraction() | Reason |
|------|---------------------------|--------|
| AskUserQuestion | `true` | Must always show question UI |
| Other tools | `undefined` | Standard permission flow |

### Integration with Answer Injection

After permissions are granted via `onAllow`, the answer injection mechanism takes over:

```javascript
// ============================================
// Answer Injection via onAllow callback
// Location: chunks.131.mjs:214-219
// ============================================

// Permission UI Submit handler:
N = useCallback((collectedAnswers) => {
  let updatedInput = {
    ...originalInput,           // questions, etc.
    answers: collectedAnswers   // ★ Inject answers here
  };
  onDone();                      // Close dialog
  toolUseConfirm.onAllow(updatedInput, []);  // ★ Call onAllow with answers
}, [toolUseConfirm, onDone]);
```

The flow continues in `Tool.call()`:

```javascript
// ============================================
// Tool receives answers in call()
// Location: chunks.130.mjs:3472-3481
// ============================================

async call({
  questions: A,
  answers: Q = {}     // ★ Answers available via input.answers
}, B) {
  return {
    data: {
      questions: A,
      answers: Q
    }
  }
}
```

### Input Schema with Answers Field

```javascript
// ============================================
// AskUserQuestion Input Schema (ZZ0)
// Location: chunks.130.mjs:3400-3402
// ============================================

ZZ0 = z.strictObject({
  questions: z.array(QuestionSchema).min(1).max(4).describe("Questions to ask"),
  answers: z.record(z.string(), z.string()).optional()
    .describe("User answers collected by the permission component")
    // ★ answers field is optional in schema, filled by UI component
})
```

### Tool Result Format

```javascript
// ============================================
// mapToolResultToToolResultBlockParam
// Location: chunks.130.mjs:3483-3491
// ============================================

mapToolResultToToolResultBlockParam({ answers: A }, Q) {
  return {
    type: "tool_result",
    content: `User has answered your questions: ${
      Object.entries(A).map(([question, answer]) => `"${question}"="${answer}"`).join(", ")
    }. You can now continue with the user's answers in mind.`,
    tool_use_id: Q
  }
}

// Example output:
// "User has answered your questions: "Auth method"="JWT tokens", "Cache type"="Redis".
//  You can now continue with the user's answers in mind."
```

### No Timeout Behavior

AskUserQuestion has **no explicit timeout**. The permission dialog waits indefinitely:

```javascript
// checkPermissions returns no timeout field:
{
  behavior: "ask",
  message: "Answer questions?",
  updatedInput: input
  // No timeout: dialog stays open until user action
}
```

The dialog can only be dismissed by:
1. User clicking Submit (onAllow)
2. User clicking Cancel/Escape (onReject)
3. User aborting the conversation

---

## requiresUserInteraction Mechanism

The `requiresUserInteraction` method is an optional tool property that bypasses certain permission checks.

### Method Definition

```typescript
interface Tool {
  // ... other properties
  requiresUserInteraction?(): boolean;
}
```

### Effect on Permission Flow

```javascript
// Location: chunks.153.mjs:1392

// In the permission orchestrator (Wb3):
if (A.requiresUserInteraction?.() && J?.behavior === "ask") return J;
```

When a tool returns `true` from `requiresUserInteraction()`:
1. The permission check at Step 5 short-circuits
2. `bypassPermissions` mode is NOT checked (Step 6 skipped)
3. Global allow rules are NOT checked (Step 7 skipped)
4. The "ask" behavior is returned immediately

### Use Cases

| Use Case | Behavior |
|----------|----------|
| User input collection | Always show UI to collect data |
| Confirmation dialogs | Force user acknowledgment |
| Critical decisions | Prevent automation bypass |

### Current Implementations

Only AskUserQuestion uses this mechanism currently:

```javascript
// AskUserQuestion - chunks.130.mjs:3438-3440
requiresUserInteraction() {
  return true
}
```

Other interactive tools like EnterPlanMode and ExitPlanMode do NOT use `requiresUserInteraction`. They rely on the standard "ask" behavior which can be affected by mode settings.

---

## Permission UI Components

### UI Callback Structure

The permission UI uses three callbacks to handle user responses:

```javascript
// ============================================
// Permission UI Callbacks
// Location: chunks.125.mjs:2504-2676
// ============================================

interface ToolUseConfirm {
  input: any;                          // Original tool input
  onAllow: (updatedInput, rules) => void;  // User approved
  onReject: (feedback?: string) => void;   // User rejected
  assistantMessage: Message;           // Context message
}
```

### Response Option Types

```javascript
// ============================================
// Permission Response Handlers
// Location: chunks.125.mjs:2584-2600
// ============================================

const ResponseHandlers = {
  "accept-once": handleAcceptOnce,     // Allow this time only
  "accept-session": handleAcceptSession, // Allow + add session rule
  "reject": handleReject               // Deny + optional feedback
}
```

#### Accept-Once Handler

```javascript
// ============================================
// handleAcceptOnce (Jn5)
// Location: chunks.125.mjs
// ============================================

function handleAcceptOnce(params) {
  const { messageId, toolUseConfirm, onDone, completionType, languageName } = params;

  // Log telemetry
  trackEvent("accept", completionType, languageName, messageId);

  // Close dialog
  onDone();

  // Call onAllow with original input, no rule proposals
  toolUseConfirm.onAllow(toolUseConfirm.input, []);
}
```

#### Accept-Session Handler

```javascript
// ============================================
// handleAcceptSession (Wn5)
// Location: chunks.125.mjs
// ============================================

function handleAcceptSession(params) {
  const {
    messageId, path, toolUseConfirm, toolPermissionContext,
    onDone, completionType, languageName, operationType
  } = params;

  trackEvent("accept", completionType, languageName, messageId);

  // Generate rule suggestions based on path
  const suggestions = path
    ? generateRuleSuggestions(path, operationType, toolPermissionContext)
    : [];

  onDone();

  // Call onAllow with suggestions for session rule creation
  toolUseConfirm.onAllow(toolUseConfirm.input, suggestions);
}
```

#### Reject Handler

```javascript
// ============================================
// handleReject (Xn5)
// Location: chunks.125.mjs
// ============================================

function handleReject(params, feedback) {
  const {
    messageId, toolUseConfirm, onDone, onReject,
    completionType, languageName
  } = params;

  trackEvent("reject", completionType, languageName, messageId, feedback?.hasFeedback);

  onDone();      // Close dialog
  onReject();    // Internal cleanup

  // Call onReject with optional user feedback
  toolUseConfirm.onReject(feedback?.feedback);
}
```

### File Edit Dialog Options

```javascript
// ============================================
// generateFileEditDialogOptions (Pf2)
// Location: chunks.125.mjs
// ============================================

function generateFileEditDialogOptions({ filePath, toolPermissionContext, operationType, onRejectFeedbackChange }) {
  const options = [
    {
      label: "Yes",
      value: "yes",
      option: { type: "accept-once" }
    }
  ];

  const isInWorkingDir = isInWorkingDirectory(filePath, toolPermissionContext);
  const modeLabel = `(${ACCEPT_EDITS_MODE.displayText})`;

  // Session-wide approval option
  let sessionLabel;
  if (isInWorkingDir) {
    sessionLabel = `Yes, allow all ${operationType === "read" ? "reads" : "edits"} during this session ${bold(modeLabel)}`;
  } else {
    const dirName = getDirectoryDisplayName(filePath);
    sessionLabel = `Yes, allow all ${operationType === "read" ? "reads from" : "edits in"} ${bold(`${dirName}/`)} during this session ${bold(modeLabel)}`;
  }

  options.push({
    label: sessionLabel,
    value: "yes-session",
    option: { type: "accept-session" }
  });

  // Reject option with feedback
  if (onRejectFeedbackChange) {
    options.push({
      type: "input",
      label: "No",
      value: "no",
      placeholder: "Type to tell Claude what to do differently",
      onChange: onRejectFeedbackChange,
      option: { type: "reject" }
    });
  } else {
    options.push({
      label: `No, and tell Claude what to do differently ${bold("(esc)")}`,
      value: "no",
      option: { type: "reject" }
    });
  }

  return options;
}
```

---

## Decision Reason Types

The `decisionReason` field provides detailed context for permission decisions:

```javascript
// ============================================
// Decision Reason Types
// Location: chunks.153.mjs:1258-1297
// ============================================

type DecisionReason =
  | { type: "hook"; hookName: string; reason?: string }
  | { type: "rule"; rule: Rule }
  | { type: "subcommandResults"; reasons: Map<string, DecisionResult> }
  | { type: "permissionPromptTool"; permissionPromptToolName: string }
  | { type: "sandboxOverride" }
  | { type: "classifier"; classifier: string; reason: string }
  | { type: "workingDir"; reason: string }
  | { type: "other"; reason: string }
  | { type: "mode"; mode: PermissionMode }
  | { type: "asyncAgent"; reason: string }
  | { type: "planFiles" }
  | { type: "fileSafety"; issue: string }
  | { type: "bypassPermissionsMode" }
```

### Reason Type Details

| Type | Description | Example |
|------|-------------|---------|
| `hook` | Hook blocked operation | `{ type: "hook", hookName: "pre-commit", reason: "Linting failed" }` |
| `rule` | Permission rule matched | `{ type: "rule", rule: { source: "session", ruleValue: {...} } }` |
| `subcommandResults` | Bash subcommand analysis | `{ type: "subcommandResults", reasons: Map{...} }` |
| `permissionPromptTool` | Permission prompt tool | `{ type: "permissionPromptTool", permissionPromptToolName: "Bash" }` |
| `sandboxOverride` | dangerouslyDisableSandbox | `{ type: "sandboxOverride" }` |
| `classifier` | Command classifier | `{ type: "classifier", classifier: "destructive", reason: "rm -rf" }` |
| `workingDir` | Path outside allowed dirs | `{ type: "workingDir", reason: "Path outside working directory" }` |
| `other` | Generic reason | `{ type: "other", reason: "Custom message" }` |
| `mode` | Permission mode setting | `{ type: "mode", mode: "bypassPermissions" }` |
| `asyncAgent` | Async agent restriction | `{ type: "asyncAgent", reason: "Cannot prompt in async" }` |
| `planFiles` | Plan file auto-allowed | `{ type: "planFiles" }` |
| `fileSafety` | File safety issue | `{ type: "fileSafety", issue: "Symlink detected" }` |

### Message Formatting

```javascript
// ============================================
// formatPermissionMessage (yV)
// Location: chunks.153.mjs:1258-1297
// ============================================

function formatPermissionMessage(toolName, decisionReason) {
  if (decisionReason) {
    switch (decisionReason.type) {
      case "hook":
        return decisionReason.reason
          ? `Hook '${decisionReason.hookName}' blocked: ${decisionReason.reason}`
          : `Hook requires approval`;

      case "rule": {
        const ruleStr = stringifyRule(decisionReason.rule.ruleValue);
        const sourceStr = formatRuleSource(decisionReason.rule.source);
        return `Permission rule '${ruleStr}' from ${sourceStr} requires approval`;
      }

      case "subcommandResults": {
        const askCommands = [];
        for (const [cmd, result] of decisionReason.reasons) {
          if (result.behavior === "ask" || result.behavior === "passthrough") {
            askCommands.push(cmd);
          }
        }
        return askCommands.length > 0
          ? `This command contains parts requiring approval: ${askCommands.join(", ")}`
          : `This command contains operations requiring approval`;
      }

      case "workingDir":
        return decisionReason.reason;

      case "classifier":
        return `Classifier '${decisionReason.classifier}' requires approval: ${decisionReason.reason}`;

      case "mode":
        return `Permission mode (${formatMode(decisionReason.mode)}) requires approval`;

      case "other":
        return decisionReason.reason;

      default:
        break;
    }
  }

  return `Permission to use ${toolName} not granted yet.`;
}
```

---

## Permission Suggestions System

When a permission dialog is shown, the system can suggest rules for the user to accept.

### Suggestion Types

```javascript
// ============================================
// Permission Suggestion Schema (A91)
// Location: chunks.106.mjs:1631-1658
// ============================================

type PermissionSuggestion =
  | {
      type: "addRules";
      rules: Rule[];
      behavior: "allow" | "deny" | "ask";
      destination: SettingsDestination;
    }
  | {
      type: "replaceRules";
      rules: Rule[];
      behavior: "allow" | "deny" | "ask";
      destination: SettingsDestination;
    }
  | {
      type: "removeRules";
      rules: Rule[];
      behavior: "allow" | "deny" | "ask";
      destination: SettingsDestination;
    }
  | {
      type: "setMode";
      mode: PermissionMode;
      destination: SettingsDestination;
    }
  | {
      type: "addDirectories";
      directories: string[];
      destination: SettingsDestination;
    }
  | {
      type: "removeDirectories";
      directories: string[];
      destination: SettingsDestination;
    };

type SettingsDestination =
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "session"
  | "cliArg";
```

### Suggestion Generation

```javascript
// ============================================
// generateRuleSuggestions (I31)
// Location: chunks.154.mjs
// ============================================

function generateRuleSuggestions(filePath, operationType, permissionContext) {
  const isOutsideWorkingDir = !isInWorkingDirectory(filePath, permissionContext);

  if (operationType === "write" || operationType === "create") {
    const suggestions = [
      {
        type: "setMode",
        mode: "acceptEdits",     // Suggest switching to acceptEdits mode
        destination: "session"
      }
    ];

    if (isOutsideWorkingDir) {
      const parentDir = getParentDirectory(filePath);
      const ancestorDirs = getAncestorDirectories(parentDir);

      suggestions.push({
        type: "addDirectories",
        directories: ancestorDirs,  // Suggest adding parent directories
        destination: "session"
      });
    }

    return suggestions;
  }

  // Default: just suggest mode change
  return [
    {
      type: "setMode",
      mode: "acceptEdits",
      destination: "session"
    }
  ];
}
```

### Suggestion Display

```javascript
// ============================================
// SuggestionsDisplay (Tn5)
// Location: chunks.125.mjs
// ============================================

function SuggestionsDisplay({ suggestions, width }) {
  if (!suggestions || suggestions.length === 0) {
    return <Box>Suggestions: None</Box>;
  }

  const ruleSuggestions = extractRuleSuggestions(suggestions);
  const directorySuggestions = extractDirectorySuggestions(suggestions);
  const modeSuggestion = extractModeSuggestion(suggestions);

  return (
    <Box flexDirection="column">
      {ruleSuggestions.map(rule => (
        <Text key={rule.ruleContent}>
          {rule.toolName}({rule.ruleContent})
        </Text>
      ))}
      {directorySuggestions.map(dir => (
        <Text key={dir}>Add directory: {dir}</Text>
      ))}
      {modeSuggestion && (
        <Text>Set mode to: {modeSuggestion}</Text>
      )}
    </Box>
  );
}
```

---

## Tool-Specific checkPermissions Implementations

### Edit Tool

```javascript
// ============================================
// Edit Tool checkPermissions
// Location: chunks.122.mjs:3333-3336
// ============================================

async checkPermissions(input, context) {
  const appState = await context.getAppState();
  return checkEditPermission(EditTool, input, appState.toolPermissionContext);
}

// checkEditPermission (L0A) is detailed in "File Path Permission Patterns" section
```

### WebFetch Tool

```javascript
// ============================================
// WebFetch Tool checkPermissions
// Location: chunks.130.mjs:1259-1317
// ============================================

async checkPermissions(input, context) {
  const { toolPermissionContext } = await context.getAppState();

  try {
    const { url } = input;
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const pathname = parsedUrl.pathname;

    // 1. Check preapproved hosts (hardcoded allowlist)
    for (const preapproved of PREAPPROVED_HOSTS) {
      if (preapproved.includes("/")) {
        // Host + path pattern (e.g., "docs.anthropic.com/api")
        const [host, ...pathParts] = preapproved.split("/");
        const path = "/" + pathParts.join("/");
        if (hostname === host && pathname.startsWith(path)) {
          return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: { type: "other", reason: "Preapproved host and path" }
          };
        }
      } else {
        // Host only pattern
        if (hostname === preapproved) {
          return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: { type: "other", reason: "Preapproved host" }
          };
        }
      }
    }
  } catch {}

  // 2. Extract domain key for rule matching
  const domainKey = extractDomainKey(input);

  // 3. Check deny rules
  const denyRule = getRulesForTool(toolPermissionContext, WebFetchTool, "deny").get(domainKey);
  if (denyRule) {
    return {
      behavior: "deny",
      message: `WebFetch denied access to ${domainKey}.`,
      decisionReason: { type: "rule", rule: denyRule }
    };
  }

  // 4. Check ask rules
  const askRule = getRulesForTool(toolPermissionContext, WebFetchTool, "ask").get(domainKey);
  if (askRule) {
    return {
      behavior: "ask",
      message: `Permission to use WebFetch not granted yet.`,
      decisionReason: { type: "rule", rule: askRule }
    };
  }

  // 5. Check allow rules
  const allowRule = getRulesForTool(toolPermissionContext, WebFetchTool, "allow").get(domainKey);
  if (allowRule) {
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: { type: "rule", rule: allowRule }
    };
  }

  // 6. Default to ask
  return {
    behavior: "ask",
    message: `Permission to use WebFetch not granted yet.`
  };
}
```

### Skill Tool

```javascript
// ============================================
// Skill Tool checkPermissions
// Location: chunks.130.mjs:2603-2658
// ============================================

async checkPermissions({ skill }, context) {
  const skillName = skill.trim();
  const normalizedName = skillName.startsWith("/") ? skillName.substring(1) : skillName;

  const { toolPermissionContext } = await context.getAppState();
  const availableSkills = await getAvailableSkills();
  const skillCommand = findSkillCommand(normalizedName, availableSkills);

  // Helper: Check if rule matches skill (supports wildcards like "skill:*")
  const ruleMatchesSkill = (ruleContent) => {
    if (ruleContent === skill) return true;
    if (ruleContent.endsWith(":*")) {
      const prefix = ruleContent.slice(0, -2);
      return skill.startsWith(prefix);
    }
    return false;
  };

  // 1. Check deny rules
  const denyRules = getRulesForTool(toolPermissionContext, SkillTool, "deny");
  for (const [content, rule] of denyRules.entries()) {
    if (ruleMatchesSkill(content)) {
      return {
        behavior: "deny",
        message: "Skill execution blocked",
        decisionReason: { type: "rule", rule }
      };
    }
  }

  // 2. Check allow rules
  const allowRules = getRulesForTool(toolPermissionContext, SkillTool, "allow");
  for (const [content, rule] of allowRules.entries()) {
    if (ruleMatchesSkill(content)) {
      return {
        behavior: "allow",
        updatedInput: { skill },
        decisionReason: { type: "rule", rule }
      };
    }
  }

  // 3. Default: ask with suggestion to allow this skill
  const suggestions = [{
    type: "addRules",
    rules: [{ toolName: SKILL_TOOL_NAME, ruleContent: skill }],
    behavior: "allow",
    destination: "localSettings"
  }];

  return {
    behavior: "ask",
    message: `Execute skill: ${normalizedName}`,
    decisionReason: undefined,
    suggestions,
    metadata: { command: skillCommand }
  };
}
```

---

## Summary

The permission system in Claude Code provides:

1. **8-Step Decision Flow** - Comprehensive permission orchestrator (Wb3) with clear precedence rules
2. **Four Behavior Types** - allow, deny, ask (external) + passthrough (internal)
3. **Fine-grained Control** - Per-tool, per-file, per-directory, per-command
4. **Flexible Patterns** - Glob patterns, exact matches, domain filtering
5. **Layered Settings** - Global → Project → Local → Managed hierarchy
6. **Safety Defaults** - Prompt or deny by default, allow via explicit rules
7. **Enterprise Support** - Managed settings enforce organization policies
8. **User Experience** - Interactive prompts with remember options and suggestions
9. **Validation** - Multi-level checks (permissions, state, consistency)

### Special Mechanisms

| Mechanism | Purpose | Key Tool |
|-----------|---------|----------|
| `requiresUserInteraction` | Bypass automation, always prompt | AskUserQuestion |
| `passthrough` behavior | Defer decision to global rules | Most tools |
| Decision reasons | Detailed context for decisions | All tools |
| Permission suggestions | Smart rule proposals | Edit, Write, Skill |

### AskUserQuestion Integration

AskUserQuestion uses a unique permission flow:
- **Always prompts** via `requiresUserInteraction()` returning `true`
- **Bypasses bypassPermissions mode** - UI is always shown
- **Answer injection** via `onAllow(updatedInput)` callback
- **No timeout** - Dialog waits indefinitely for user response

### Key Functions Reference

| Function | Location | Purpose |
|----------|----------|---------|
| `Wb3` | chunks.153.mjs:1358 | Central permission orchestrator |
| `ro1/oo1/so1` | chunks.153.mjs:1323 | Find deny/ask/allow rules |
| `L0A` | chunks.154.mjs:1815 | File edit permission checker |
| `no1` | chunks.90.mjs:1935 | Bash command permission checker |
| `yV` | chunks.153.mjs:1258 | Format permission messages |
| `I31` | chunks.154.mjs | Generate rule suggestions |

This ensures Claude Code operates safely while giving users and organizations full control over what operations are permitted.
