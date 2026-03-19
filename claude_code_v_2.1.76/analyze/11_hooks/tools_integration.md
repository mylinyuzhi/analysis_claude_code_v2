# Hooks & Tools Integration

## Overview

The hooks system integrates deeply with the tool execution pipeline, providing three interception points: **PreToolUse** (before execution), **PostToolUse** (after success), and **PostToolUseFailure** (after error). Hooks can modify tool inputs, override permission decisions, transform outputs (MCP tools only), and prevent continuation.

This document analyzes the integration architecture, execution flow, and key decision points where hooks influence tool behavior.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `toolDispatcher` (bU1) - Top-level tool dispatch entry point
- `toolExecutionPipeline` (NdY) - Core pipeline with hook integration points
- `executePreToolHooksIterator` - Pre-tool hook processing
- `executePostToolHooksIterator` - Post-tool hook processing
- `executePostToolFailureHooksIterator` - Post-failure hook processing
- `executePreToolHooks` (LF8) - PreToolUse event generator
- `executePostToolHooks` (RF8) - PostToolUse event generator

---

## Architecture Overview

### Hook Integration Points in Tool Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     TOOL EXECUTION PIPELINE WITH HOOKS                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LLM Response (tool_use block)                                               │
│     │                                                                        │
│     ▼                                                                        │
│  ┌────────────────────────────┐                                              │
│  │ 1. Tool Lookup             │ ← Find tool in registry                      │
│  └─────────────┬──────────────┘                                              │
│                ▼                                                              │
│  ┌────────────────────────────┐                                              │
│  │ 2. Input Validation        │ ← Zod schema + custom validation            │
│  │    (safeParse + validate)  │                                              │
│  └─────────────┬──────────────┘                                              │
│                ▼                                                              │
│  ╔════════════════════════════╗                                              │
│  ║ 3. PRE-TOOL HOOKS          ║ ← HOOK INTEGRATION POINT #1                  │
│  ║    (executePreToolHooks)   ║                                              │
│  ╠════════════════════════════╣   Can:                                       │
│  ║ • block execution          ║   - Block with error                         │
│  ║ • modify input             ║   - Modify input parameters                  │
│  ║ • override permission      ║   - Override permission (allow/deny/ask)    │
│  ║ • inject context           ║   - Inject additional context               │
│  ║ • prevent continuation     ║   - Stop agent loop after this tool         │
│  ╚══════════════╤═════════════╝                                              │
│                 ▼                                                            │
│  ┌────────────────────────────┐                                              │
│  │ 4. Permission Check        │ ← Uses hook result if provided              │
│  │    (canUseTool)            │   - Hook "allow" → bypass user prompt       │
│  └─────────────┬──────────────┘   - Hook "deny" → block immediately         │
│                ▼                   - Hook "ask" → force user prompt         │
│  ┌────────────────────────────┐                                              │
│  │ 5. Tool Execution          │ ← Actual tool.call()                        │
│  │    (tool.call)             │                                              │
│  └─────────────┬──────────────┘                                              │
│                │                                                              │
│        ┌───────┴───────┐                                                      │
│        ▼               ▼                                                      │
│  ┌───────────┐   ┌──────────────┐                                            │
│  │  SUCCESS  │   │   FAILURE    │                                            │
│  └─────┬─────┘   └──────┬───────┘                                            │
│        │                │                                                     │
│        ▼                ▼                                                     │
│  ╔═══════════════╗  ╔══════════════════════╗                                  │
│  ║ 6a. POST-TOOL║  ║ 6b. POST-FAILURE     ║ ← HOOK INTEGRATION #2/#3         │
│  ║    HOOKS     ║  ║     HOOKS            ║                                  │
│  ╠═══════════════╣  ╠══════════════════════╣                                  │
│  ║ • modify MCP ║  ║ • provide recovery  ║                                  │
│  ║   output     ║  ║   context            ║                                  │
│  ║ • inject     ║  ║ • log error details ║                                  │
│  ║   context    ║  ╚══════════════════════╝                                  │
│  ╚═══════╤══════╝                                                            │
│          ▼                                                                   │
│  ┌────────────────────────────┐                                              │
│  │ 7. Result Formatting       │ ← Return to LLM as tool_result              │
│  └────────────────────────────┘                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## PreToolUse Hook Integration

### When It Triggers

PreToolUse hooks fire **after** input validation but **before** the permission check and tool execution. This timing allows hooks to:

1. Block execution before any user interaction
2. Modify input parameters that appear in permission dialogs
3. Override permission decisions to bypass or force user prompts

### Permission Override Flow

**Hook permission behavior vs. standard permission flow:**

```javascript
// ============================================
// Permission Decision Logic with Hook Override
// Location: chunks.149.mjs:630-680 (NdY pipeline)
// ============================================

// READABLE (for understanding):
// Decision tree for permission handling with hooks

if (hookPermissionResult?.behavior === "allow") {
    if (tool.requiresUserInteraction?.() || toolUseContext.requireCanUseTool) {
        // Hook approved, but tool requires user interaction
        // Fall through to standard permission flow
        permissionResult = await canUseTool(tool, updatedInput, ...);
    } else {
        // Hook approved and no special user interaction required
        // Bypass user prompt entirely
        permissionResult = hookPermissionResult;
    }
} else if (hookPermissionResult?.behavior === "deny") {
    // Hook denied - block immediately, no user prompt
    permissionResult = hookPermissionResult;
} else if (hookPermissionResult?.behavior === "ask") {
    // Hook wants user to be asked (even if auto-allow would apply)
    permissionResult = await canUseTool(tool, updatedInput, ...);
} else {
    // No hook override - standard permission flow
    permissionResult = await canUseTool(tool, updatedInput, ...);
}
```

### Permission Override Hierarchy

```
Hook Decision          Tool requires interaction    Result
─────────────────────────────────────────────────────────────
"allow"                No                           → EXECUTE (no prompt)
"allow"                Yes                          → STANDARD PERMISSION
"deny"                 Any                          → BLOCKED (no prompt)
"ask"                  Any                          → USER PROMPT (forced)
undefined              Any                          → STANDARD PERMISSION
```

**Key insight:** A hook's "allow" can be **downgraded** to standard permission flow if the tool explicitly requires user interaction. This safety mechanism prevents hooks from silently approving destructive operations that tool authors marked as requiring human oversight.

### Input Modification Flow

Hooks can modify tool input via `updatedInput`:

```javascript
// ============================================
// Input Modification by PreToolUse Hooks
// Location: chunks.149.mjs:573-600
// ============================================

// READABLE (for understanding):
let updatedInput = parseResult.data;  // Start with validated input

for await (let hookEvent of executePreToolHooksIterator(...)) {
    switch (hookEvent.type) {
        case "hookUpdatedInput":
            // Hook modified the input
            updatedInput = hookEvent.updatedInput;
            break;
        case "hookPermissionResult":
            // Hook with permission decision (may also have updatedInput)
            if (hookEvent.hookPermissionResult.updatedInput) {
                updatedInput = hookEvent.hookPermissionResult.updatedInput;
            }
            break;
    }
}

// updatedInput now flows to:
// 1. Permission check (user sees modified input in dialog)
// 2. Tool execution (tool.call receives modified input)
```

**Why this matters:**
- User sees **sanitized/normalized input** in permission dialog
- Tool receives consistent, cleaned input regardless of LLM output quality
- Security hooks can block dangerous patterns before user sees them

### Blocking Execution

Hooks block execution by returning `blockingError`:

```javascript
// ============================================
// Blocking Error Handling
// Location: chunks.149.mjs:186-200
// ============================================

// ORIGINAL (for source lookup):
if (J.blockingError) {
    yield {
        type: "hookPermissionResult",
        hookPermissionResult: {
            behavior: "deny",
            message: formatBlockError(J.blockingError, z.name)
        }
    };
}

// READABLE (for understanding):
if (hookResult.blockingError) {
    yield {
        type: "hookPermissionResult",
        hookPermissionResult: {
            behavior: "deny",
            message: formatBlockError(hookResult.blockingError, tool.name)
        }
    };
}
```

The blocking error is formatted as:

```xml
<PreToolUse:Bash hook blocking error from command: "npm run lint">
Command blocked: Found 3 security vulnerabilities in dependencies
</PreToolUse:Bash hook blocking error from command: "npm run lint">
```

---

## PostToolUse Hook Integration

### When It Triggers

PostToolUse hooks fire **after** successful tool execution. They receive the tool result and can:

1. Inject additional context into conversation
2. Modify MCP tool output (native tool output cannot be modified)
3. Prevent continuation (stop agent loop after this tool)

### MCP Output Modification

**Only MCP tools support output modification.** Native tool output formats are fixed because the UI depends on them.

```javascript
// ============================================
// MCP Output Modification
// Location: chunks.149.mjs:70-85 (b1q)
// ============================================

// ORIGINAL (for source lookup):
if (j.updatedMCPToolOutput && $E(q)) {
    D = j.updatedMCPToolOutput;
    yield { updatedMCPToolOutput: D };
}

// READABLE (for understanding):
if (hookResult.updatedMCPToolOutput && isMcpToolByFlag(tool)) {
    toolResult = hookResult.updatedMCPToolOutput;
    yield { updatedMCPToolOutput: toolResult };
}
```

**Why MCP-only:**
- Native tools (Read, Write, Bash, etc.) have structured output that the UI renders specifically
- MCP tool output is opaque JSON - the system doesn't know its structure
- This allows hooks to filter sensitive data, add annotations, or reformat responses

### Prevent Continuation

PostToolUse hooks can stop the agent loop:

```javascript
// ============================================
// Prevent Continuation from PostToolUse Hook
// Location: chunks.149.mjs:60-70
// ============================================

// READABLE (for understanding):
if (hookResult.preventContinuation) {
    yield {
        message: createHookAttachment({
            type: "hook_stopped_continuation",
            hookName: hookResult.hookName,
            message: hookResult.stopReason
        })
    };
    return;  // Stop processing further hooks, exit pipeline
}
```

**Use case:** A PostToolUse hook detects dangerous output (e.g., a command that would expose credentials) and stops the agent from continuing to prevent further damage.

---

## PostToolUseFailure Hook Integration

### When It Triggers

PostToolUseFailure hooks fire when a tool execution fails (validation error, permission denied, runtime exception). They can only inject context - no output modification or permission overrides.

### Error Context Injection

```javascript
// ============================================
// Failure Hook Input Payload
// Location: chunks.141.mjs:2850-2868
// ============================================

// READABLE (for understanding):
let hookInput = {
    ...buildBasePayload(permissionMode),
    hook_event_name: "PostToolUseFailure",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId,
    tool_result: errorMessage,
    tool_result_is_error: true,
    error_message: errorMessage,
    tool_error_code: errorCode
};
```

**Error codes available to hooks:**

| Code | Meaning |
|------|---------|
| `InputValidationError` | Schema validation failed |
| `PermissionDenied` | User denied permission |
| `ToolExecutionError` | Tool threw exception |
| `TimeoutError` | Tool exceeded time limit |
| `CancelledError` | Execution was cancelled |

**Key insight:** Failure hooks receive the error code, allowing intelligent recovery suggestions. A "file not found" error might trigger a hook to suggest alternative paths.

---

## Hook Execution Timing

### PreToolUse Hook Timing

```
┌─────────────────────────────────────────────────────────────────┐
│                    PreToolUse Hook Timing                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LLM Response arrives                                           │
│       │                                                         │
│       ▼ (~1-5ms)                                                │
│  Tool Lookup in registry                                        │
│       │                                                         │
│       ▼ (~1-10ms)                                               │
│  Schema Validation (Zod safeParse)                             │
│       │                                                         │
│       ▼ (~0-5ms if no custom validation)                        │
│  Custom Validation (if defined)                                │
│       │                                                         │
│       ▼                                                         │
│  ╔═════════════════════════════════════════════════════════╗    │
│  ║  PRE-TOOL HOOKS EXECUTION                                ║    │
│  ╠═════════════════════════════════════════════════════════╣    │
│  ║  • All hooks run concurrently (Promise.all semantics)   ║    │
│  ║  • Results collected in completion order                 ║    │
│  ║  • Permission aggregation: deny > ask > allow            ║    │
│  ║  • Timeout: DEFAULT_HOOK_TIMEOUT (10 min)               ║    │
│  ║  • Duration: Variable (hooks run shell commands)        ║    │
│  ╚═════════════════════════════════════════════════════════╝    │
│       │                                                         │
│       ▼ (~0-500ms for user prompt)                              │
│  Permission Check (may prompt user)                            │
│       │                                                         │
│       ▼                                                         │
│  Tool Execution                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Timing Considerations

1. **Concurrent execution**: All PreToolUse hooks for a tool run in parallel, not sequentially
2. **First-completed-wins**: Permission aggregation happens as results arrive
3. **Blocking on all hooks**: Pipeline waits for all hooks to complete before proceeding
4. **Timeout protection**: Individual hooks timeout at `DEFAULT_HOOK_TIMEOUT` (10 min)

---

## Hook Result Aggregation

### Permission Aggregation Rules

When multiple PreToolUse hooks return different permission behaviors:

```
┌─────────────────────────────────────────────────────────────┐
│              Permission Aggregation Hierarchy                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Hook A: "allow"                                           │
│   Hook B: "ask"                                             │
│   Hook C: "deny"                                            │
│                                                             │
│   Result: "deny" (most restrictive wins)                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   deny > ask > allow > undefined (passthrough)             │
│                                                             │
│   • "deny" is immutable - once set, cannot be overridden   │
│   • "ask" overrides "allow" and undefined                  │
│   • "allow" only sets if currently undefined               │
│   • undefined means hook didn't return a decision          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Input Modification Merging

When multiple hooks modify input:

```javascript
// Last-writer-wins for input modifications
// Hooks execute concurrently but results processed in completion order

let updatedInput = originalInput;

for (let hookResult of hookResults) {
    if (hookResult.updatedInput) {
        updatedInput = hookResult.updatedInput;  // Overwrites previous
    }
}
```

**Key insight:** The last hook to complete with `updatedInput` wins. There's no merge/combine logic - it's pure replacement.

---

## Practical Examples

### Example 1: Security Hook Blocking Dangerous Commands

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "type": "command",
      "command": "bash -c 'if [[ \"$TOOL_INPUT\" =~ rm\\ -rf\\ / ]]; then echo \"{\\\"blockingError\\\": \\\"Blocked destructive command\\\"}\"; exit 2; fi'"
    }
  ]
}
```

**Flow:**
1. Bash tool requested with `command: "rm -rf /"`
2. PreToolUse hook executes, detects pattern
3. Hook returns `{"blockingError": "Blocked destructive command"}` with exit code 2
4. Pipeline receives `behavior: "deny"`
5. Tool execution blocked, error shown to LLM

### Example 2: Auto-Approve Hook for Safe Operations

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Read",
      "type": "command",
      "command": "echo '{\"permissionBehavior\": \"allow\"}'"
    }
  ]
}
```

**Flow:**
1. Read tool requested
2. PreToolUse hook returns `permissionBehavior: "allow"`
3. Pipeline skips user permission dialog
4. Tool executes immediately

### Example 3: Post-Write Test Hook

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": "Write",
      "type": "command",
      "command": "npm test 2>&1 | head -20"
    }
  ]
}
```

**Flow:**
1. Write tool completes successfully
2. PostToolUse hook runs `npm test`
3. Hook output injected as additional context
4. LLM sees test results and can react to failures

---

## Integration with Other Systems

### Permission System Integration

PreToolUse hooks integrate with the permission system at `canUseTool`:

- Hook "allow" → Bypasses `canUseTool` entirely (unless tool requires interaction)
- Hook "deny" → Returns denied `canUseTool` result without calling the function
- Hook "ask" → Forces `canUseTool` to prompt user even if auto-allow rules apply

### Telemetry Integration

Hook execution emits telemetry events:

| Event | When | Data |
|-------|------|------|
| `tengu_run_hook` | Hook starts | hookName, eventName, toolName |
| `tengu_pre_tool_hook_error` | PreToolUse hook fails | toolName, error, duration |
| `tengu_post_tool_hook_error` | PostToolUse hook fails | toolName, error, duration |

### System Reminder Integration

Hook results are delivered to the LLM via system reminders:

- `hook_blocking_error` → Blocking error message
- `hook_success` → Success message (SessionStart, UserPromptSubmit only)
- `hook_additional_context` → Additional context from hook
- `hook_stopped_continuation` → Continuation prevented message

See [../04_system_reminder/types_hooks.md](../04_system_reminder/types_hooks.md) for details.

---

## Summary

### Key Integration Points

| Point | Hook Event | Can Do | Cannot Do |
|-------|------------|--------|-----------|
| Before execution | PreToolUse | Block, modify input, override permission | Modify output |
| After success | PostToolUse | Modify MCP output, inject context, stop continuation | Block execution |
| After failure | PostToolUseFailure | Inject recovery context | Block, modify output, override |

### Permission Override Safety

- Hook "allow" is **downgraded** if tool requires user interaction
- Hook "deny" is **absolute** - cannot be overridden
- Hook "ask" is **sticky** - forces user prompt regardless of auto-allow rules

### MCP-Only Output Modification

PostToolUse hooks can only modify MCP tool output. Native tools have fixed output formats that the UI depends on. This design choice:
- Preserves UI rendering guarantees
- Allows safe transformation of opaque MCP JSON
- Enables filtering sensitive data from MCP responses