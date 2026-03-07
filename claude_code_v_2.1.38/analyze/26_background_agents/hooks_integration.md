# Background Agents — Hooks Integration (Claude Code 2.1.38)

> Analysis of how hooks integrate with background agents: PreToolUse/PostToolUse hook execution,
> hook context passing, and async hook handling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `executePreToolHooks` (qyA) - Executes PreToolUse hooks before tool execution — `chunks.141.mjs:2812`
- `executePostToolHooks` (KyA) - Executes PostToolUse hooks after tool execution — `chunks.141.mjs:2831`
- `executePostToolFailureHooks` (YyA) - Executes hooks when tool fails — `chunks.141.mjs:2850`
- `createHookMessage` (kq) - Creates hook context message object — `chunks.142.mjs:2615`
- `runWithAgentIdentity` (p01) - Wraps agent execution with identity context — `chunks.80.mjs:2353`

---

## Overview

Hooks are user-defined scripts or functions that execute at specific points in the agent lifecycle. For background agents, hooks present unique challenges:

1. **Context passing** - Background agents need access to hook configuration
2. **Async execution** - Hooks must not block background task launching
3. **Error handling** - Hook failures in background agents shouldn't crash the parent

---

## Deep Analysis: Hook Execution for Background Agents

### Hook Context Passing

**What it does:** When a background agent is spawned, the hook configuration from the parent context is passed to the child agent.

```javascript
// ============================================
// aX - Build hook context from tool use context
// Location: chunks.141.mjs (referenced in hook functions)
// ============================================

// The aX function extracts hook-relevant context:
function buildHookContext(toolUseContext) {
    return {
        // Session information
        session_id: toolUseContext.sessionId,
        agent_id: toolUseContext.agentId,

        // Working directory
        cwd: toolUseContext.options.cwd,

        // Hook configuration (from settings)
        hooks: toolUseContext.options.hooks,

        // Environment and feature flags
        ...extractEnvContext(toolUseContext)
    };
}

// Mapping: aX→buildHookContext
```

**Why this approach:**
- **Inherited context** - Background agents get the same hook configuration as their parent
- **Isolated execution** - Each agent has its own hook context instance
- **No shared state** - Prevents hook side effects from affecting parent

### PreToolUse Hook Execution

**What it does:** Executes before any tool use, including the Agent tool that spawns background tasks.

```javascript
// ============================================
// executePreToolHooks - Pre-tool hook execution
// Location: chunks.141.mjs:2812-2829
// ============================================

// ORIGINAL (for source lookup):
async function* qyA(A, q, K, Y, z, w, H = MP) {
    h(`executePreToolHooks called for tool: ${A}`);
    let $ = {
        ...aX(z),
        hook_event_name: "PreToolUse",
        tool_name: A,
        tool_input: K,
        tool_use_id: q
    };
    yield* NI({
        hookInput: $,
        toolUseID: q,
        matchQuery: A,
        signal: w,
        timeoutMs: H,
        toolUseContext: Y
    })
}

// READABLE (for understanding):
async function* executePreToolHooks(
    toolName, toolUseId, toolInput,
    toolUseContext, hookContext, signal,
    timeoutMs = DEFAULT_HOOK_TIMEOUT
) {
    log(`executePreToolHooks called for tool: ${toolName}`);

    let hookInput = {
        ...buildHookContext(hookContext),
        hook_event_name: "PreToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_use_id: toolUseId
    };

    yield* executeHookIteration({
        hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal,
        timeoutMs,
        toolUseContext
    });
}

// Mapping: qyA→executePreToolHooks, A→toolName, q→toolUseId, K→toolInput,
//   Y→toolUseContext, z→hookContext, w→signal, H→timeoutMs, aX→buildHookContext,
//   NI→executeHookIteration
```

**Key insight:** The function is a generator (`async function*`) that yields hook execution results. This allows the caller to process hook outcomes incrementally.

### PostToolUse Hook Execution

**What it does:** Executes after a tool completes successfully.

```javascript
// ============================================
// executePostToolHooks - Post-tool hook execution
// Location: chunks.141.mjs:2831-2848
// ============================================

// ORIGINAL (for source lookup):
async function* KyA(A, q, K, Y, z, w, H, $ = MP) {
    let O = {
        ...aX(w),
        hook_event_name: "PostToolUse",
        tool_name: A,
        tool_input: K,
        tool_response: Y,
        tool_use_id: q
    };
    yield* NI({
        hookInput: O,
        toolUseID: q,
        matchQuery: A,
        signal: H,
        timeoutMs: $,
        toolUseContext: z
    })
}

// READABLE (for understanding):
async function* executePostToolHooks(
    toolName, toolUseId, toolInput, toolResponse,
    toolUseContext, hookContext, signal,
    timeoutMs = DEFAULT_HOOK_TIMEOUT
) {
    let hookInput = {
        ...buildHookContext(hookContext),
        hook_event_name: "PostToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_response: toolResponse,
        tool_use_id: toolUseId
    };

    yield* executeHookIteration({
        hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal,
        timeoutMs,
        toolUseContext
    });
}

// Mapping: KyA→executePostToolHooks, Y→toolResponse
```

### PostToolUseFailure Hook Execution

**What it does:** Executes when a tool fails, allowing hooks to log or recover from errors.

```javascript
// ============================================
// executePostToolFailureHooks - Tool failure hook execution
// Location: chunks.141.mjs:2850-2865
// ============================================

// ORIGINAL (for source lookup):
async function* YyA(A, q, K, Y, z, w, H, $, O = MP) {
    let _ = {
        ...aX(H),
        hook_event_name: "PostToolUseFailure",
        tool_name: A,
        tool_input: K,
        tool_use_id: q,
        error: Y,
        is_fatal: z
    };
    yield* NI({
        hookInput: _,
        toolUseID: q,
        matchQuery: A,
        signal: $,
        timeoutMs: O,
        toolUseContext: w
    })
}

// READABLE (for understanding):
async function* executePostToolFailureHooks(
    toolName, toolUseId, toolInput, error,
    isFatal, toolUseContext, hookContext, signal,
    timeoutMs = DEFAULT_HOOK_TIMEOUT
) {
    let hookInput = {
        ...buildHookContext(hookContext),
        hook_event_name: "PostToolUseFailure",
        tool_name: toolName,
        tool_input: toolInput,
        tool_use_id: toolUseId,
        error: error,
        is_fatal: isFatal
    };

    yield* executeHookIteration({
        hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal,
        timeoutMs,
        toolUseContext
    });
}

// Mapping: YyA→executePostToolFailureHooks, Y→error, z→isFatal
```

---

## Deep Analysis: Hooks and Background Agent Spawning

### Agent Tool Hook Flow

When the Agent tool spawns a background agent, hooks execute at multiple points:

```
1. PreToolUse (Agent tool)
   ├── Validate spawn request
   ├── Check permissions
   └── User-defined PreToolUse hooks
           │
           ▼
2. Background Agent Spawn
   ├── Create task entry
   ├── Initialize AbortController
   └── Detach agent loop (run in background)
           │
           ▼
3. Agent Loop Runs Independently
   ├── Each tool use within agent runs its own hooks
   ├── Hooks use agent's toolUseContext
   └── No hook state shared with parent
           │
           ▼
4. PostToolUse (Agent tool) - IMMEDIATE
   ├── Returns { status: "async_launched" }
   └── PostToolUse hooks receive this result
           │
           ▼
5. Background Agent Completes (LATER)
   └── Notification injected into parent's command queue
```

### Hook Context Isolation

**What it does:** Background agents receive a copy of the hook configuration, not a reference. This prevents cross-contamination.

```javascript
// When spawning a background agent:
let backgroundToolUseContext = {
    ...parentToolUseContext,
    // Isolated message array
    messages: [],
    // New session ID for subagent
    sessionId: generateNewSessionId(),
    // Inherited hook config (copy)
    options: {
        ...parentToolUseContext.options,
        hooks: structuredClone(parentToolUseContext.options.hooks)
    }
};
```

**Why this approach:**
- **Prevents interference** - Hook state in background agent doesn't affect parent
- **Allows customization** - Background agents can have different hook configs
- **Safe cleanup** - Background agent hook state is garbage collected independently

---

## Deep Analysis: Hook Timeout Handling

### Default Timeout

```javascript
// ============================================
// MP - Default hook timeout
// Location: chunks.142.mjs:~360215
// ============================================

// ORIGINAL (for source lookup):
MP = 600000  // 10 minutes

// READABLE (for understanding):
const DEFAULT_HOOK_TIMEOUT_MS = 600000;  // 10 minutes

// Mapping: MP→DEFAULT_HOOK_TIMEOUT_MS
```

### Timeout for Background Agents

When hooks are executed for background agents:

1. **Same timeout applies** - Background agent hooks use the same default timeout
2. **Abort signal propagation** - If the background agent is killed, the abort signal cancels pending hooks
3. **Non-blocking** - Hook timeouts don't prevent the background agent from returning immediately

```javascript
// Hook execution respects abort signal
async function* executeHookIteration(config) {
    let { signal, timeoutMs } = config;

    // Create combined timeout + abort signal
    let combinedSignal = combineSignals([
        AbortSignal.timeout(timeoutMs),
        signal
    ]);

    for (let hook of matchingHooks) {
        if (combinedSignal.aborted) {
            yield { outcome: "cancelled", hook };
            continue;
        }

        let result = await executeHook(hook, combinedSignal);
        yield result;
    }
}
```

---

## Hook Events for Agent/Bash Tools

### PreToolUse Event Payload

```javascript
{
    hook_event_name: "PreToolUse",
    tool_name: "Task" | "Bash",
    tool_use_id: "toolu_xxx",
    tool_input: {
        // For Task tool:
        prompt: "Search for X",
        subagent_type: "explore",
        run_in_background: true,
        // ...
        // For Bash tool:
        command: "npm test",
        run_in_background: true,
        // ...
    }
}
```

### PostToolUse Event Payload (Background Launch)

```javascript
{
    hook_event_name: "PostToolUse",
    tool_name: "Task" | "Bash",
    tool_use_id: "toolu_xxx",
    tool_input: { /* ... */ },
    tool_response: {
        status: "async_launched",
        agentId: "a3f4b2",
        description: "Search for X",
        outputFile: "~/.claude/tasks/a3f4b2.output"
    }
}
```

### PostToolUse Event Payload (Sync Completion)

```javascript
{
    hook_event_name: "PostToolUse",
    tool_name: "Task",
    tool_use_id: "toolu_xxx",
    tool_input: { /* ... */ },
    tool_response: {
        status: "completed",
        agentId: "a3f4b2",
        content: [{ type: "text", text: "Found 5 matches..." }],
        totalTokens: 1500,
        // ...
    }
}
```

---

## Integration Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Main Agent Loop                              │
│                                                                 │
│  1. LLM requests Agent tool with run_in_background=true        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              executePreToolHooks("Task", ...)                   │
│                                                                 │
│  - Run user-defined PreToolUse hooks                           │
│  - Hooks can block/reject the tool use                         │
│  - Timeout: 10 minutes                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AgentTool.call({ run_in_background: true })        │
│                                                                 │
│  1. createAsyncTask() - Create task entry                      │
│  2. Initialize AbortController                                  │
│  3. Spawn agent loop in background (non-awaited)               │
│  4. Return { status: "async_launched", ... }                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              executePostToolHooks("Task", ...)                  │
│                                                                 │
│  - Run user-defined PostToolUse hooks                          │
│  - Hook receives async_launched result                         │
│  - Hooks run in main context, not background agent             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Main loop continues...                       │
│                                                                 │
│  Meanwhile, in background:                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Background Agent Loop                        │ │
│  │                                                           │ │
│  │  Each tool use runs its own hooks:                       │ │
│  │  - PreToolUse for each tool call                         │ │
│  │  - PostToolUse/PostToolUseFailure for results            │ │
│  │                                                           │ │
│  │  Hook context isolated from parent                       │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Context copy, not reference | Prevents hook state cross-contamination |
| Generator-based hooks | Allows incremental processing of hook results |
| 10-minute default timeout | Long enough for most operations, prevents hangs |
| Abort signal propagation | Kill operations cancel pending hooks |
| Immediate PostToolUse for background | Parent doesn't wait for background completion |
| Isolated hook context in background | Background agent hooks are independent |