# Hooks Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how the hook system integrates with subagent execution, including hook timing, propagation, and cleanup.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key functions in this document:
- `executeSubagentStartHooks` (Ux8) - Fire SubagentStart hooks before first LLM call - chunks.175.mjs:2666
- `agentLoopRunner` (qh) - Agent loop with hook cleanup in finally block - chunks.133.mjs:1565

Key hooks referenced in this document:
- `SubagentStart` - Fires after tool assembly, before first LLM call
- `SubagentStop` - Fires in finally block after agent loop ends
- `PreToolUse` - Fires before each tool execution in subagent context
- `PostToolUse` - Fires after successful tool execution
- `PostToolUseFailure` - Fires after failed tool execution

---

## executeSubagentStartHooks (Ux8)

### What it does

Fires the `SubagentStart` hook event to all registered hook handlers, allowing them to inject additional context or perform setup before the subagent begins execution.

### Source Code

```javascript
// ============================================
// executeSubagentStartHooks - Fire SubagentStart hooks
// Location: chunks.175.mjs:2666-2680
// ============================================

// ORIGINAL (for source lookup):
async function* Ux8(A, q, K, Y = T$) {
    let z = {
        ...$w(void 0),
        hook_event_name: "SubagentStart",
        agent_id: A,
        agent_type: q
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: q,
        signal: K,
        timeoutMs: Y
    })
}

// READABLE (for understanding):
async function* executeSubagentStartHooks(agentId, agentType, signal, timeoutMs = DEFAULT_TIMEOUT) {
    let hookInput = {
        ...buildBaseHookInput(undefined),
        hook_event_name: "SubagentStart",
        agent_id: agentId,
        agent_type: agentType
    };
    yield* executeHooks({
        hookInput: hookInput,
        toolUseID: generateToolUseId(),
        matchQuery: agentType,
        signal: signal,
        timeoutMs: timeoutMs
    });
}

// Mapping: Ux8→executeSubagentStartHooks, A→agentId, q→agentType, K→signal, Y→timeoutMs,
// $w→buildBaseHookInput, Ax→executeHooks, CE→generateToolUseId, T$→DEFAULT_TIMEOUT
```

### How it works

1. **Build hook input:** Creates the hook input object with the `SubagentStart` event name and agent identity
2. **Execute hooks:** Calls `executeHooks` (Ax) which runs all matching hook handlers
3. **Yield results:** Generator yields hook results for the caller to process

### Hook Input Structure

```javascript
{
    hook_event_name: "SubagentStart",
    agent_id: "agent-abc123",
    agent_type: "general-purpose",
    // ... base hook input fields (cwd, session_id, etc.)
}
```

---

## SubagentStart Hook Timing

### When It Fires

The `SubagentStart` hook fires **after** tool assembly and **before** the first LLM call. This is the optimal placement because:

1. **After tool assembly** - Hooks can inspect or modify the tool set before it's used
2. **Before first LLM call** - Hooks can set up state that will affect the agent's behavior

### What Hooks Can Do

In `SubagentStart`, hooks can:
- Read the subagent's tool set and log it for monitoring
- Set up external resources (start a server, open a connection)
- Register additional hooks for this subagent's session
- Modify the agent's initial context
- Inject additional context messages via `additionalContexts`

### Hook Result Processing in agentLoopRunner

```javascript
// ============================================
// Hook result processing in agentLoopRunner
// Location: chunks.133.mjs:1636-1646
// ============================================

// ORIGINAL (for source lookup):
for await (let $6 of Ux8(L, A.agentType, r.signal))
    if ($6.additionalContexts && $6.additionalContexts.length > 0)
        e.push(...$6.additionalContexts);
if (e.length > 0) {
    let $6 = f4({
        type: "hook_additional_context",
        content: e,
        hookName: "SubagentStart",
        toolUseID: GvY(),
        hookEvent: "SubagentStart"
    });
    R.push($6)
}

// READABLE (for understanding):
let additionalContexts = [];
for await (let hookResult of executeSubagentStartHooks(agentId, agentDefinition.agentType, abortSignal)) {
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
        additionalContexts.push(...hookResult.additionalContexts);
    }
}
if (additionalContexts.length > 0) {
    let contextMessage = createSystemMessage({
        type: "hook_additional_context",
        content: additionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(contextMessage);
}

// Mapping: Ux8→executeSubagentStartHooks, L→agentId, A→agentDefinition, r→abortController,
// e→additionalContexts, R→messages, f4→createSystemMessage, GvY→generateToolUseId
```

**Key insight:** Hook handlers can return `additionalContexts` which get injected as system messages into the subagent's conversation. This allows hooks to provide extra context to the LLM without modifying the agent definition.

### Example Use Case

```yaml
# In SKILL.md or hook configuration
hooks:
  SubagentStart:
    - matcher: "*"
      hooks:
        - hook: "echo 'Subagent started'"
```

---

## SubagentStop Hook Timing

### When It Fires

The `SubagentStop` hook fires in the `finally` block of the agent loop, ensuring it always runs even when the agent fails or is killed.

**Guaranteed execution even on:**
- Normal completion
- LLM API errors
- Tool execution failures
- User abort/kill

### What Hooks Can Do

In `SubagentStop`, hooks can:
- Clean up external resources
- Log completion status
- Report metrics to monitoring systems

---

## AsyncLocalStorage Propagation Through Hooks

Hooks executed in the subagent context inherit the subagent's identity via `AsyncLocalStorage`. This means:

```javascript
// In any hook handler:
let agentId = getCurrentAgentIdentity()?.agentId;
// agentId is the subagent's ID, not the parent's
```

**Why this matters:** Hooks that emit telemetry or log messages need to know which agent they are running on behalf of. Without AsyncLocalStorage propagation, hooks would need explicit parameters for agent identity.

---

## Pre/Post Tool Hooks in Subagent Context

When the subagent calls a tool:

```
Subagent tool call
    ↓
PreToolUse hooks fire (in subagent's AsyncLocalStorage context)
    ↓
Tool executes
    ↓
PostToolUse hooks fire (on success)
 OR PostToolUseFailure hooks fire (on failure)
    ↓
Result returned to subagent's LLM
```

**Hook inheritance:** Hooks registered in the parent session are inherited by the subagent via shared `setAppState`. Skills invoked in the parent's session that registered `PreToolUse` hooks will also fire for the subagent's tool calls.

---

## Hook Cleanup in Finally Block

All hooks registered during the subagent's execution are cleaned up when `SubagentStop` fires. This prevents hook accumulation across multiple subagent invocations.

### Source Code

```javascript
// ============================================
// Hook cleanup in agentLoopRunner finally block
// Location: chunks.133.mjs:1782-1784
// ============================================

// ORIGINAL (for source lookup):
} finally {
    if (await K6(), A.hooks) zZ6(N, L);
    z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
}

// READABLE (for understanding):
} finally {
    if (await flushTranscriptQueue(), agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }
    toolUseContext.readFileState.clear();
    messages.length = 0;
    cleanupAgentIdentity(agentId);
    cleanupTranscriptWriter(agentId);
    cleanupTaskState(agentId, toolUseContext.getAppState, setAppState);
}

// Mapping: K6→flushTranscriptQueue, A→agentDefinition, zZ6→deregisterAgentHooks,
// N→setAppState, L→agentId, z6→toolUseContext, R→messages,
// a36→cleanupAgentIdentity, Qx8→cleanupTranscriptWriter, t24→cleanupTaskState
```

**Cleanup sequence:**
1. Fire `SubagentStop` hooks (user-defined cleanup)
2. Remove hooks registered by the subagent's skill invocations
3. Release any resources held by hook handlers
4. Clear readFileState to prevent memory leaks
5. Clear message array references
6. Clean up agent identity from AsyncLocalStorage
7. Finalize transcript writer
8. Remove task from active task tracking

---

## Design Rationale

### Why SubagentStart Before First LLM Call?

**Alternative:** Fire SubagentStart immediately after spawn (before tool assembly).

**Chosen approach:** After tool assembly, before first LLM call.

This timing is most useful: hooks can see the complete tool set (post-assembly) but still run before any LLM work happens. Hooks before tool assembly couldn't inspect or modify the tool set. Hooks after the first LLM call would be too late for setup work.

### Why Guarantee SubagentStop?

Placing `SubagentStop` hook firing in the `finally` block guarantees it runs even on errors. Without this guarantee, resources allocated in `SubagentStart` might never be cleaned up if the agent fails mid-run.
