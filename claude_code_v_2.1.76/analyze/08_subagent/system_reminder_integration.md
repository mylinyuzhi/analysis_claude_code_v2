# System Reminder Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how system reminders interact with subagent execution, what context is propagated from parent to subagent, and how progress is reported.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `reportToolProgress` (RjA) - Update progress preserving summary - chunks.89.mjs:1393
- `updateTaskProgress` (Yd7) - Update summary text - chunks.89.mjs:1407
- `agent_progress` event - Progress event emitted to parent UI

---

## What Is NOT Directly Propagated

System reminders from the parent agent's context are **not** directly injected into the subagent's system prompt. The subagent gets a fresh system prompt built for its agent type.

**Why:** Subagent system prompts are generated fresh via `agentDefinition.getSystemPrompt()`. They reflect the subagent's specific role and constraints, not the parent's current conversation context.

---

## What IS Propagated

The following context does propagate from parent to subagent:

| Item | How Propagated | Reason |
|------|---------------|--------|
| Session ID | Via context object | Same session |
| App state | Via shared getter | Same global state |
| Settings (permissions, model) | Via derived context | Inherited policy |
| File read state | Via cloned Map | Starting knowledge base |
| Task description | Via fork context messages | The subagent's assignment |
| criticalSystemReminder_EXPERIMENTAL | Via agent definition | Critical behavioral constraints |

---

## Fork Context Integration

The fork context messages (built by `buildForkContextMessages` / Nn7) serve as the primary mechanism for passing parent context to the subagent. They establish:

1. The subagent's identity and role
2. A reference to the parent session
3. The specific task to perform

---

## Dual Progress Functions

Progress reporting to the parent uses two distinct functions with different semantics:

### reportToolProgress (RjA) - Preserves Summary

Used for in-progress updates during tool execution. Shows what tool is running without overwriting the accumulated summary.

```javascript
// Example: subagent is running git status
reportToolProgress(taskId, "Running git status...");
// Summary (previous phases) is preserved
```

### updateTaskProgress (Yd7) - Replaces Summary

Used when the subagent has completed a significant phase and wants to update the overall summary.

```javascript
// Example: subagent has completed analysis phase
updateTaskProgress(taskId, "Analyzed 23 files, found 3 issues in TypeScript types");
// Summary is replaced with this text
```

### agent_progress Event Flow

Progress events flow from the subagent to the parent's UI:

```
Subagent calls reportToolProgress(taskId, "message")
    ↓
atomicUpdateTask updates task state
    ↓
agent_progress event emitted
    ↓
Parent's event listener updates UI
    ↓
User sees "Subagent: message" in status area
```

---

## Design Rationale

### Why Fresh System Prompt Instead of Parent's?

If the subagent inherited the parent's system prompt, it would get all the parent's context, constraints, and accumulated session state. This causes:
1. **Context pollution** - Irrelevant parent history distracts the subagent
2. **Role confusion** - Subagent may follow parent constraints not appropriate for its specialized task
3. **Token waste** - Parent's context takes up tokens in the subagent's already-limited window

Fresh system prompts give each subagent a clean, purpose-built context.

### Why Two Progress Functions?

User-facing status needs two layers:
1. **Current activity** - "What is the subagent doing right now?" (reportToolProgress)
2. **Overall progress** - "What has the subagent accomplished?" (updateTaskProgress)

Combining these into one function would cause the summary to flicker with every tool call. The dual-function design keeps these concerns separate.
