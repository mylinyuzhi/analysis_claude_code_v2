# Compaction Reminder & Boundary Marker System

## Overview

This document covers two complementary mechanisms that support the compaction subsystem:

1. **Compaction Reminder** — A meta system message injected into the prompt to prevent the LLM from self-truncating its responses in anticipation of context overflow.
2. **Compact Boundary Markers** — Invisible system messages inserted at each compaction point, enabling the runtime to slice the message array to the "current session" view.

Both live in `chunks.174.mjs`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createCompactBoundaryMessage` (Ri6) - Constructs the boundary marker message
- `isCompactBoundaryMessage` (RZ) - Type predicate for boundary detection
- `findLastCompactBoundaryIndex` (Szz) - Reverse scan to find most recent boundary
- `getMessagesFromLastBoundary` (fN) - Slices messages from last boundary onward

---

## Part A: Compaction Reminder Injection

### What it does

When assembling the system prompt, a `compaction_reminder` case injects a reminder telling the LLM that auto-compact is enabled and it will never run out of context.

### How it works

```javascript
// ============================================
// compactionReminderInjection - Injects reminder into system prompt
// Location: chunks.174.mjs:398-402
// ============================================

// ORIGINAL (for source lookup):
case "compaction_reminder":
    return b5([p1({
        content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
        isMeta: !0
    })]);

// READABLE (for understanding):
case "compaction_reminder":
    return wrapInSystemPromptBoundary([createSystemMessage({
        content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
        isMeta: true
    })]);

// Mapping: b5→wrapInSystemPromptBoundary, p1→createSystemMessage
```

**Key properties:**
- `isMeta: true` — this message is treated as metadata by the rendering pipeline; it's injected into the prompt but not shown as a regular conversation turn
- Wrapped with `b5` (`wrapInSystemPromptBoundary`) — consistent with other injected system context blocks
- No conditional: whenever this case is reached during system prompt assembly, the reminder is always included

### Why this approach

**The problem it solves:** Without this reminder, the LLM may exhibit "context anxiety" — artificially shortening its responses, declining to continue long tasks, or explicitly warning the user that it's running out of context. This behavior is technically correct but unhelpful when auto-compact will transparently extend the conversation.

**Design rationale:**
- The message content explicitly says "no need to stop or rush" — it directly counteracts the LLM's trained caution about context limits
- `isMeta: true` keeps it out of the conversation transcript; users don't see it
- Injected via the system prompt assembly pipeline (not as a user/assistant message), so it appears with system-level authority to the LLM

---

## Part B: Compact Boundary Marker System

### What it does

After each compaction, a compact boundary marker message is inserted at the start of the new (compacted) message array. This marker records metadata about the compaction event and serves as a permanent divider between pre-compaction and post-compaction history.

### `createCompactBoundaryMessage` (Ri6)

**What it does:** Constructs a system message that records a compaction event with full metadata.

```javascript
// ============================================
// createCompactBoundaryMessage - Constructs compact boundary marker
// Location: chunks.174.mjs:580-599
// ============================================

// ORIGINAL (for source lookup):
function Ri6(A, q, K, Y, z) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: SE(),
        level: "info",
        compactMetadata: {
            trigger: A,
            preTokens: q,
            userContext: Y,
            messagesSummarized: z
        },
        ...K ? { logicalParentUuid: K } : {}
    }
}

// READABLE (for understanding):
function createCompactBoundaryMessage(trigger, preTokens, logicalParentUuid, userContext, messagesSummarized) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: false,
        timestamp: new Date().toISOString(),
        uuid: generateUUID(),
        level: "info",
        compactMetadata: {
            trigger,          // "auto" | "manual" | "session_memory"
            preTokens,        // token count before compaction
            userContext,      // user-supplied context at time of compact
            messagesSummarized // number of messages that were compacted
        },
        ...(logicalParentUuid ? { logicalParentUuid } : {})
    }
}

// Mapping: Ri6→createCompactBoundaryMessage, A→trigger, q→preTokens, K→logicalParentUuid, Y→userContext, z→messagesSummarized, SE→generateUUID
```

**Field analysis:**

| Field | Value | Purpose |
|-------|-------|---------|
| `type` | `"system"` | Part of the system message type family |
| `subtype` | `"compact_boundary"` | Unique identifier for boundary detection |
| `content` | `"Conversation compacted"` | Human-readable label (shown in transcript) |
| `isMeta` | `false` | **Visible** in conversation timeline (unlike reminder) |
| `compactMetadata.trigger` | `"auto"` / `"manual"` / `"session_memory"` | How compaction was triggered |
| `compactMetadata.preTokens` | integer | Token count before compaction (for analytics) |
| `compactMetadata.userContext` | string | User-supplied context captured at compact time |
| `compactMetadata.messagesSummarized` | integer | How many messages were collapsed |
| `logicalParentUuid` | optional string | Links boundary to parent conversation node in tree |

**Key contrast:** Unlike the compaction reminder (`isMeta: true`), boundary markers have `isMeta: false`. They are intentionally visible in the conversation transcript — users see "Conversation compacted" as a timeline event, giving them visibility into when auto-compact fired.

---

### `isCompactBoundaryMessage` (RZ)

**What it does:** Type predicate that returns `true` if a message is a compact boundary marker.

```javascript
// ============================================
// isCompactBoundaryMessage - Type predicate for boundary messages
// Location: chunks.174.mjs:616-618
// ============================================

// ORIGINAL (for source lookup):
function RZ(A) {
    return A?.type === "system" && A.subtype === "compact_boundary"
}

// READABLE (for understanding):
function isCompactBoundaryMessage(message) {
    return message?.type === "system" && message.subtype === "compact_boundary"
}

// Mapping: RZ→isCompactBoundaryMessage, A→message
```

Uses optional chaining (`?.`) to safely handle `null`/`undefined` entries in message arrays.

---

### `findLastCompactBoundaryIndex` (Szz)

**What it does:** Reverse-scans the message array to find the index of the most recent compact boundary marker. Returns `-1` if no boundary exists.

```javascript
// ============================================
// findLastCompactBoundaryIndex - Reverse scan for latest boundary
// Location: chunks.174.mjs:620-626
// ============================================

// ORIGINAL (for source lookup):
function Szz(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && RZ(K)) return q
    }
    return -1
}

// READABLE (for understanding):
function findLastCompactBoundaryIndex(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];
        if (message && isCompactBoundaryMessage(message)) return i
    }
    return -1
}

// Mapping: Szz→findLastCompactBoundaryIndex, A→messages, q→i, K→message, RZ→isCompactBoundaryMessage
```

**Algorithm:** O(n) reverse scan. Iterates from the end of the array because:
- The most recent compaction is what matters (we want messages since the *last* compact)
- In the common case (no recent compaction), the scan exits early after checking a few recent messages
- Boundaries are rare (only one per compaction), so the scan typically terminates quickly

---

### `getMessagesFromLastBoundary` (fN)

**What it does:** Returns the sub-array of messages starting from the last compact boundary. If no boundary exists, returns the full array.

```javascript
// ============================================
// getMessagesFromLastBoundary - Slices messages from last boundary
// Location: chunks.174.mjs:628-632
// ============================================

// ORIGINAL (for source lookup):
function fN(A) {
    let q = Szz(A);
    if (q === -1) return A;
    return A.slice(q)
}

// READABLE (for understanding):
function getMessagesFromLastBoundary(messages) {
    let lastBoundaryIndex = findLastCompactBoundaryIndex(messages);
    if (lastBoundaryIndex === -1) return messages;   // No boundary → return all
    return messages.slice(lastBoundaryIndex)          // Boundary found → slice from it
}

// Mapping: fN→getMessagesFromLastBoundary, A→messages, q→lastBoundaryIndex, Szz→findLastCompactBoundaryIndex
```

**Usage in query loop:** `fN` is called at the start of each query loop iteration (in `omY` / `queryLoopMainFunction`, `chunks.148.mjs:932`):

```javascript
let I = [...fN(P)];
```

This means every API call to the LLM only includes messages from the last boundary forward — the pre-compaction history is excluded. The compacted summary messages (which are placed just after the boundary) serve as the "history" for the current session.

---

## Design Insights

### Boundary as "Session Start" Anchor

The compact boundary message serves as the anchor for "current session" computation. After compaction:

```
[...old messages...] [BOUNDARY] [summary message] [new messages...]
                         ↑
                    fN() slices here
```

- Everything before the boundary is excluded from LLM context
- The boundary marker itself IS included (slice includes index `q`)
- The summary message immediately follows the boundary
- New conversation continues after that

### Multiple Compactions

If a session is compacted multiple times:

```
[BOUNDARY₁] [summary₁] [...] [BOUNDARY₂] [summary₂] [new messages]
                                   ↑
                              fN() slices here (most recent wins)
```

`findLastCompactBoundaryIndex` always returns the index of the *most recent* boundary, so only the most recent compaction's summary is used as context base. Earlier summaries are excluded from the LLM context but remain in the internal message array (for transcript display).

### Why `isMeta: false` for Boundaries

Boundary markers are intentionally visible in the transcript (`isMeta: false`) while reminder messages are hidden (`isMeta: true`). This distinction reflects their audiences:
- **Reminder**: For the LLM (guides behavior) — should not pollute user-visible transcript
- **Boundary**: For the user (shows when auto-compact fired) — should appear in transcript as a timeline event

---

## Cross-References

- **Rewind/Checkpointing**: The `createCompactBoundaryMessage` function is also used by the rewind feature's "Summarize from here" option. See [../35_rewind/implementation.md](../35_rewind/implementation.md).
- **System Reminder Types**: For the full catalog of system reminder types, see [../04_system_reminder/reminder_types.md](../04_system_reminder/reminder_types.md).
- **Symbol Index**: See [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) for the compact module section.
