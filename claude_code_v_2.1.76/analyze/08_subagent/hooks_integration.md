# Hooks Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how the hook system integrates with subagent execution, including hook timing, propagation, and cleanup.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)

Key hooks referenced in this document:
- `SubagentStart` - Fires after tool assembly, before first LLM call
- `SubagentStop` - Fires in finally block after agent loop ends
- `PreToolUse` - Fires before each tool execution in subagent context
- `PostToolUse` - Fires after successful tool execution
- `PostToolUseFailure` - Fires after failed tool execution

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

**Cleanup sequence:**
1. Fire `SubagentStop` hooks (user-defined cleanup)
2. Remove hooks registered by the subagent's skill invocations
3. Release any resources held by hook handlers

---

## Design Rationale

### Why SubagentStart Before First LLM Call?

**Alternative:** Fire SubagentStart immediately after spawn (before tool assembly).

**Chosen approach:** After tool assembly, before first LLM call.

This timing is most useful: hooks can see the complete tool set (post-assembly) but still run before any LLM work happens. Hooks before tool assembly couldn't inspect or modify the tool set. Hooks after the first LLM call would be too late for setup work.

### Why Guarantee SubagentStop?

Placing `SubagentStop` hook firing in the `finally` block guarantees it runs even on errors. Without this guarantee, resources allocated in `SubagentStart` might never be cleaned up if the agent fails mid-run.
