# Compact Integration - Subagent System (Claude Code 2.1.76)

## Overview

This document covers how subagents interact with the context compaction system, including token counting, auto-compact triggering, and isolation of compaction state.

> **Main Documentation:** [07_compact/](../07_compact/) - Complete compaction module documentation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact section)

Key functions in this document:
- `agentLoopRunner` (qh) - Core agent execution loop with token tracking - chunks.133.mjs:1565
- `llmMessageLoop` (Yh) - LLM message processing with token counting - chunks.148.mjs:875
- `deriveToolUseContext` (Bc6) - Context derivation with cloned readFileState - chunks.148.mjs:1978
- `inProcessAgentRunner` (XNY) - In-process teammate with isolated compaction - chunks.134.mjs:1571

---

## Token Counting in Agent Loop

The agent loop tracks token usage after each LLM response. Token counting is critical for determining when to trigger auto-compaction.

### How Token Counting Works

```javascript
// ============================================
// Token counting and progress reporting in agentLoopRunner
// Location: chunks.133.mjs:1757-1778
// ============================================

// ORIGINAL (for source lookup):
if (G?.(), $6.type === "stream_event" && $6.event.type === "message_start" && $6.ttftMs != null) {
    K.pushApiMetricsEntry?.($6.ttftMs);
    continue
}
if ($6.type === "attachment") {
    if ($6.attachment.type === "max_turns_reached") {
        k(`[Agent: ${A.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
        break
    }
    yield $6;
    continue
}
if (TvY($6)) await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`)), N6 = $6.uuid, yield $6

// READABLE (for understanding):
if (onQueryProgress?.(), event.type === "stream_event" && event.event.type === "message_start" && event.ttftMs != null) {
    toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
    continue;  // Skip to next event, don't yield stream events
}
if (event.type === "attachment") {
    if (event.attachment.type === "max_turns_reached") {
        log(`[Agent: ${agentDefinition.agentType}] Reached max turns limit (${message.attachment.maxTurns})`);
        break;  // Exit the loop
    }
    yield event;  // Pass attachment events to caller
    continue;
}
// Record transcript for message-type events
if (isTranscriptableMessage(event)) {
    await writeToTranscript([event], agentId, lastTranscriptUuid)
        .catch((err) => log(`Failed to record sidechain transcript: ${err}`));
    lastTranscriptUuid = event.uuid;
    yield event;  // Pass to caller for UI updates
}

// Mapping: G→onQueryProgress, $6→event, K→toolUseContext, A→agentDefinition,
// k→log, TvY→isTranscriptableMessage, dg→writeToTranscript, L→agentId, N6→lastTranscriptUuid
```

**Key insight:** The `pushApiMetricsEntry` callback allows the subagent to report its time-to-first-token (TTFT) back to the parent context for metrics aggregation. This is only available when `shareSetResponseLength` is true in the context derivation.

### Token Count Usage

The token count is used to:
1. **Update UI:** Display token counter for the subagent
2. **Auto-compact check:** Compare against threshold * 0.8
3. **Final report:** Include in task completion result

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
// From deriveToolUseContext (Bc6) - chunks.148.mjs:1992
readFileState: DI(q?.readFileState ?? A.readFileState),
// Subagent's file reads tracked independently via DI (cloneMap)
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

## In-Process Teammate Compaction (XNY)

In-process teammates run compaction independently from the parent, even though they share the same Node.js process:

```javascript
// ============================================
// inProcessAgentRunner - Context isolation for compaction
// Location: chunks.134.mjs:1571-1850
// ============================================

// READABLE (for understanding):
// In inProcessAgentRunner (XNY), the subagent gets:
let subagentContext = {
    ...parentContext,
    readFileState: new Map(parentContext.readFileState), // Cloned
    // getAppState and setAppState are shared
};

// The agentLoopRunner (qh) creates a derived context via Bc6:
let derivedContext = deriveToolUseContext(parentContext, {
    options: { mainLoopModel, ... },
    agentId,
    agentType,
    messages,
    readFileState: clonedReadFileState,
    ...
});
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
