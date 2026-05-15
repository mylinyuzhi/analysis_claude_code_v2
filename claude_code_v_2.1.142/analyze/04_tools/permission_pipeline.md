# Permission Pipeline — checkPermissions Contract

> Permission is a three-layer cake: hooks may pre-decide, the tool's own `checkPermissions` runs tool-specific logic, and the general policy system (allow/deny/ask rules) handles anything left to it. This file documents the tool side. For the policy system itself, see `37_permission_policy/`.

## The contract

```typescript
checkPermissions(input, ctx) => Promise<PermissionResult>

type PermissionResult =
  | { behavior: 'allow', updatedInput: Input }
  | { behavior: 'deny', message: string }
  | { behavior: 'ask', message?: string, suggestions?: PermissionSuggestion[] }
  | { behavior: 'passthrough', message: string, suggestions?: PermissionSuggestion[] }
```

`updatedInput` lets the tool rewrite the input as part of granting permission (e.g., the user's reply to "Bash → continue with `--dry-run`" rewrites the command). `suggestions` are addRules-style hints the dialog UI can offer ("Always allow Bash(git status)").

## The four behaviors

### `allow` — proceed

The tool decides this call is fine without user prompt. The dispatcher uses `updatedInput` (which may differ from the original) as the input to `call`.

**Use cases:** Read-only tools that have already validated their input, internal tools (StructuredOutput, ToolSearch), tools whose work is bounded enough that user confirmation is friction.

### `deny` — fail

The tool refuses outright. The model sees `Permission denied for <toolName>: <message>` and must adapt.

**Use cases:** Hard policy violations (writing to /etc/passwd), feature-disabled scenarios (PowerShell on Linux), gating on environment (REPL outside `ant` builds).

### `ask` — prompt

The dispatcher pauses execution, raises a permission dialog in the UI (or auto-denies in non-interactive mode), and resumes based on the user's decision.

**Use cases:** Bash commands not covered by allow-rules, file writes outside the working directory, network-reaching tools (WebFetch, MCP).

### `passthrough` — defer to general policy

The tool has no tool-specific opinion; let the allow-rules / deny-rules / ask-rules engine decide. The `message` is shown if the engine ends up asking the user.

**Use cases:** MCP tools (delegate to the user's `mcp__server__tool`-prefix allow rules), the `mcp` catch-all base.

## Integration into allow/deny/ask flow

### Full dispatcher sequence (pre-call)

```
1. Parse input via Zod (schema_validation.md, Stage 1)
2. Call tool.validateInput(input, ctx) (schema_validation.md, Stage 2)
3. Run PreToolUse hooks
     ├─ Hook may return permissionDecision: 'allow'/'deny'/'ask'/'defer'
     ├─ Hook may emit hookUpdatedInput: ... to rewrite input
     └─ Hook may emit preventContinuation: true to stop the turn
4. Compute final permission decision:
     ├─ If a hook returned permissionDecision != null, use that
     ├─ Otherwise call tool.checkPermissions(input, ctx)
     │    ├─ allow → proceed with updatedInput
     │    ├─ deny → return permission-denied result
     │    ├─ ask → raise dialog, await user choice
     │    └─ passthrough → fall through to general policy
     └─ General policy (allow/deny/ask rules in settings.json)
          ├─ Deny rule matches → deny
          ├─ Allow rule matches → allow
          ├─ Ask rule matches → raise dialog
          └─ Default behavior (mode-dependent: default/auto/bypass)
5. If decision.behavior !== 'allow', short-circuit with the deny result
6. Otherwise call tool.call(updatedInput, ctx, canUseTool, parentMessage, onProgress?)
```

The actual code (around `cli_inner_pretty.js:379417`):

```javascript
// ============================================
// dispatchPermissionDecision — combines hook + tool + general policy
// Location: cli_inner_pretty.js:379417-379423 (REPL/in-process path)
// ============================================

// ORIGINAL (for source lookup):
V = await V38(Z, H, P, G, q, K, M),
v = V.decision;
if (((P = V.input), v.behavior !== "allow")) {
  $.onPermissionDenial?.(H, M, P);
  let B = v.behavior === "deny" ? (v.message ?? "Permission denied") : "Permission denied";
  return w(`Permission denied for ${H.name}: ${B}`);
}

// READABLE (for understanding):
const policy = await resolvePermission(hookPermissionResult, tool, input, contextWithTools, canUseTool, parentMessage, toolUseID);
const decision = policy.decision;
input = policy.input;                                // May have been rewritten
if (decision.behavior !== "allow") {
  toolUseCtx.onPermissionDenial?.(tool, toolUseID, input);
  const reason = decision.behavior === "deny" ? (decision.message ?? "Permission denied") : "Permission denied";
  return errorResult(`Permission denied for ${tool.name}: ${reason}`);
}

// Mapping: V→policy, V38→resolvePermission, Z→hookPermissionResult, H→tool, P→input, G→contextWithTools, q→canUseTool, K→parentMessage, M→toolUseID, v→decision, B→reason, w→errorResult
```

## Examples

### Example 1: Read — tool-level allow with classifier fallback

```javascript
// ============================================
// readTool.checkPermissions — delegate to policy engine via CwH
// Location: cli_inner_pretty.js:407268-407271
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(H, $) {
  let q = $.getAppState();
  return CwH($Y, H, q.toolPermissionContext);
},

// READABLE (for understanding):
async checkPermissions(input, ctx) {
  const appState = ctx.getAppState();
  // CwH = evaluatePermissionForFileTool
  // It checks deny rules → allow rules → ask rules against the file path
  // and returns the appropriate PermissionResult.
  return evaluatePermissionForFileTool(readTool, input, appState.toolPermissionContext);
},

// Mapping: H→input, $→ctx, q→appState, CwH→evaluatePermissionForFileTool, $Y→readTool
```

**Why delegate to a helper:** Read, Edit, Write, and NotebookEdit all share the same path-based allow/deny logic. The helper centralises the per-path rule matcher and the "include CLAUDE.md auto-trigger" side effects. Without it, each file tool would duplicate the same 30-line check.

### Example 2: SendUserFile — pre-validated, allow

The new SendUserFile tool relies entirely on `validateInput` for path checks and grants `allow` directly:

```javascript
// ============================================
// sendUserFileTool.checkPermissions — implicit (uses TOOL_DEFAULTS)
// Location: cli_inner_pretty.js:385814+ (createTool factory provides default)
// ============================================

// ORIGINAL (for source lookup):
// (Not explicitly overridden; uses TI1 default which is:)
// checkPermissions: (H, $) => Promise.resolve({ behavior: "allow", updatedInput: H })

// READABLE (for understanding):
// Falls through to general policy. Since SendUserFile is read-only and
// validateInput already enforced path safety, there is no tool-specific
// permission decision to make.

// Mapping: (default from TOOL_DEFAULTS/TI1)
```

**Why no override:** The tool is `isReadOnly: () => true` and its dangerous surface (file existence, allowed roots) is fully handled in `validateInput`. There is no further "deny by tool-specific logic" condition. The general policy engine will see the tool name `SendUserFile` and check allow/deny rules against it.

### Example 3: MCP tool — passthrough with addRules suggestion

```javascript
// ============================================
// mcpToolFactory.checkPermissions — passthrough with allow-rule suggestion
// Location: cli_inner_pretty.js:414795-414808
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions() {
  return {
    behavior: "passthrough",
    message: "MCPTool requires permission.",
    suggestions: [
      { type: "addRules", rules: [{ toolName: O, ruleContent: void 0 }], behavior: "allow", destination: "localSettings" },
    ],
  };
},

// READABLE (for understanding):
async checkPermissions() {
  // MCP tools delegate to the general policy engine — the engine will check
  // user's allow/deny/ask rules using mcp__<server>__<tool> name patterns.
  // If the engine raises a dialog, the suggestion is offered:
  //   "Always allow this tool" — adds an allow-rule to local settings.
  return {
    behavior: "passthrough",
    message: "MCPTool requires permission.",
    suggestions: [{
      type: "addRules",
      rules: [{ toolName: prefixedName, ruleContent: undefined }],
      behavior: "allow",
      destination: "localSettings",
    }],
  };
},

// Mapping: O→prefixedName
```

**Why `passthrough` not `ask`:**
- `ask` would force a dialog every time, regardless of rules.
- `passthrough` lets the user pre-approve via allow-rules (e.g., `mcp__github__*` → allow) and skip the dialog entirely for trusted servers.

The suggestion is what makes "Always allow this tool" possible from the dialog — it pre-fills the rule the user would otherwise have to write by hand.

**Key insight:** MCP servers are user-installed third-party code. Defaulting to "allow" would be unsafe; defaulting to "ask every time" would be friction-heavy. `passthrough` with a suggestion strikes the balance: the user explicitly opts into trust, persistently.

### Example 4: TestingPermission — always ask

```javascript
// ============================================
// testingPermissionTool.checkPermissions — fixed ask behavior
// Location: cli_inner_pretty.js:381296 (approximate)
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions(H) {
  return { behavior: "ask" };
},

// READABLE (for understanding):
async checkPermissions(_input) {
  // Test fixture — always raises the permission dialog so tests can assert
  // on dialog rendering and user-decision pathways.
  return { behavior: "ask" };
},

// Mapping: (none — H→_input)
```

## The `canUseTool` callback

`call(input, ctx, canUseTool, parentMessage, onProgress)` receives a `canUseTool` callback. Most tools never invoke it, but a few (Agent, REPL, MCP wrappers) use it to delegate nested tool calls.

```typescript
type CanUseToolFn = (toolName: string, input: unknown, options: {...}) => Promise<PermissionResult>
```

When the **Agent** tool spawns a subagent, the subagent's tool calls flow through the parent's `canUseTool` rather than re-running the parent's permission stack. This lets the parent (a) audit every subagent call, (b) maintain the cumulative denial-tracking state, and (c) ensure the subagent inherits the parent's permission context (`additionalWorkingDirectories`, etc.) without re-deriving it.

The **REPL** tool invokes `canUseTool` for every inner tool call within the VM context, so a `Read` inside REPL still goes through the same permission gauntlet as a top-level `Read`.

## Hook integration

`PreToolUse` hooks can override `checkPermissions` entirely by returning a `permissionDecision` field in their JSON response. The dispatcher checks the hook result first and only falls through to `tool.checkPermissions` if the hook returned `null` / `undefined` / `permissionDecision: 'inherit'`.

### Hook decision precedence

```
PreToolUse hook returns permissionDecision:
  'allow'   → final, skip tool.checkPermissions
  'deny'    → final, skip tool.checkPermissions
  'ask'     → final, raise dialog
  'defer'   → print-mode-only; queue the call for later (rejected if interactive)
  undefined → fall through to tool.checkPermissions
```

Hooks can also rewrite the input via `hookUpdatedInput`. The rewrite happens **before** `tool.checkPermissions` runs, so the tool sees the rewritten input when making its decision.

**Why hooks come first:** Hooks are user-level policy that may need to override a tool's own opinion. For example, a user can hook `PreToolUse` for `Bash` to force `permissionDecision: 'ask'` even if Bash's `checkPermissions` returns `allow` (e.g., to add an extra audit step in a security-sensitive project). The reverse — letting tool override hook — would undermine user control.

## Permission context

The `toolPermissionContext` lives in `AppState` and contains:

```typescript
{
  mode: 'default' | 'auto' | 'bypassPermissions' | ...
  additionalWorkingDirectories: Map<path, AdditionalWorkingDirectory>
  alwaysAllowRules: ToolPermissionRulesBySource
  alwaysDenyRules: ToolPermissionRulesBySource
  alwaysAskRules: ToolPermissionRulesBySource
  isBypassPermissionsModeAvailable: boolean
  isAutoModeAvailable?: boolean
  strippedDangerousRules?: ToolPermissionRulesBySource
  shouldAvoidPermissionPrompts?: boolean       // Background agents — auto-deny ask
  awaitAutomatedChecksBeforeDialog?: boolean    // Coordinator workers
  prePlanMode?: PermissionMode                  // Restore on plan-mode exit
}
```

The empty default:

```javascript
// ============================================
// getEmptyToolPermissionContext (vZ) — initial permission state
// Location: cli_inner_pretty.js:141071-141078
// ============================================

// ORIGINAL (for source lookup):
var vZ = () => ({
  mode: "default",
  additionalWorkingDirectories: new Map(),
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: !1,
}),

// READABLE (for understanding):
const getEmptyToolPermissionContext = () => ({
  mode: "default",                                    // Standard interactive mode
  additionalWorkingDirectories: new Map(),            // Empty — only cwd allowed
  alwaysAllowRules: {},                               // No pre-approvals
  alwaysDenyRules: {},                                // No blocks
  alwaysAskRules: {},                                 // No ask-rules
  isBypassPermissionsModeAvailable: false,            // No --dangerously-skip-permissions
});

// Mapping: vZ→getEmptyToolPermissionContext
```

This is the empty/test fixture; real sessions populate it from settings.json, command-line flags, and runtime UI choices.

## Cross-link to permission_policy module

The general allow/deny/ask engine, rule grammar, mode semantics (default/auto/bypass), and managed-settings inheritance are documented separately in `37_permission_policy/`. This document covers only the **tool-side** contract — what tools must implement and how their decisions feed the engine.

See also:
- `37_permission_policy/README.md` — full policy engine
- `11_hooks/` — PreToolUse / PostToolUse hooks
- `12_plan_mode/` — plan mode constrains tools by `isReadOnly`
- `18_sandbox/` — Bash sandbox-aware permissions

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `resolvePermission` (obfuscated: `V38`) - Combine hook + tool + general policy decision
- `evaluatePermissionForFileTool` (obfuscated: `CwH`) - Path-based permission helper shared by Read/Edit/Write/NotebookEdit
- `getEmptyToolPermissionContext` (obfuscated: `vZ`) - Initial empty permission context
