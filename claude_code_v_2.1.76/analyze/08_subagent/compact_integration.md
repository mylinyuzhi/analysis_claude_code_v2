# Compact Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how subagents interact with the context compaction system, including token counting, auto-compact triggering, and isolation of compaction state.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact section)

Key functions in this document:
- `countTokensInAgentLoop` (PU1) - Token counting in agent loop
- `autoCompactDispatcher` (fs4) - Auto-compaction entry point
- `inProcessAgentRunner` (GVY) - In-process teammate with isolated compaction
- `deriveToolUseContext` (vQ1) - Context derivation with cloned readFileState

---

## Token Counting in Agent Loop (PU1)

The agent loop tracks token usage after each LLM response:

```javascript
// After each LLM call in the agent loop
let tokenCount = countTokensInMessages(messages);
updateTaskProgress(taskId, { tokenCount });
```

The token count is used to:
1. Update the UI's token counter for the subagent
2. Check against the auto-compact threshold
3. Report in the final task completion result

---

## Auto-Compaction in Subagents

### When It Triggers

Subagents have independent compaction cycles from the parent. Each subagent's context window is tracked separately. Compaction triggers when:

```
currentTokens > threshold * 0.8
```

The 80% threshold provides a safety buffer for:
1. The next user/tool message
2. Injected system reminders
3. Token estimation inaccuracies

### sessionMemoryType Behavior

Subagents inherit the parent's `sessionMemoryType`. However, compaction in a subagent only affects the subagent's message history - the parent's conversation is not affected.

**In-process teammates** get isolated compaction because their readFileState is cloned:

```javascript
// From deriveToolUseContext (vQ1)
let clonedReadFileState = new Map(parentContext.readFileState);
// Subagent's file reads tracked independently
```

This means the subagent's compaction can safely remove file-read entries without affecting the parent's file tracking.

---

## readFileState Isolation

### Why Clone readFileState?

The `readFileState` Map tracks which files have been read and their content hashes. During compaction, this is used to determine which files need to be re-injected into the compacted context.

If the parent and subagent shared the same `readFileState`, the subagent's reads would pollute the parent's tracking, potentially causing unnecessary re-reads in the parent after compaction.

By cloning with `new Map(parentContext.readFileState)`:
1. **Subagent inherits** the parent's current read state as a starting point
2. **Subagent updates** are isolated to its own copy
3. **Parent is unaffected** by the subagent's file operations

---

## In-Process Teammate Compaction (GVY)

In-process teammates run compaction independently from the parent, even though they share the same Node.js process:

```javascript
// In inProcessAgentRunner (GVY)
let subagentContext = {
    ...parentContext,
    readFileState: new Map(parentContext.readFileState), // Cloned
    // getAppState and setAppState are shared
};
```

**Shared:** `appState` (global session state)
**Isolated:** `readFileState` (per-agent file read tracking)

This design means each agent's compaction is independent but they all operate on the same underlying session state (tools, permissions, settings).

---

## Design Rationale

### Why Independent Compaction?

Subagents can run for many turns on complex tasks, consuming large context windows. If compaction were only at the parent level, long-running subagents would fail when their context fills up.

Independent compaction allows subagents to run indefinitely by periodically summarizing their history, just like the parent agent does.

### Why Clone But Not Fully Isolate?

Full isolation (new appState, new permissions) would require duplicating all session state, which is expensive and complex. The hybrid approach (clone readFileState, share appState) balances:
- **Isolation where needed** - file tracking does not cross-contaminate
- **Efficiency** - shared appState avoids expensive duplication
- **Consistency** - subagent permission changes (hooks, skill activations) affect the session
