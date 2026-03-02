# Implementation Report - Context Compaction (Module 07)

## Overview

Context Compaction is a critical subsystem in Claude Code that manages the LLM's finite context window. It ensures that the conversation can continue indefinitely by summarizing older parts of the conversation while preserving essential state (files, tasks, plans). In v2.1.38, this system is tightly integrated with the new **Agent Teams** and **Task System**.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `autoCompactDispatcher` (fs4) - Main entry point for automatic compaction logic
- `shouldAutoCompact` (amY) - Logic to determine if token limits require compaction
- `getCompactionStatus` (Ac) - Calculates usage percentages and threshold status
- `generateConversationSummary` (ga4) - LLM-powered summarization of history
- `performSessionMemoryCompaction` (vZ6) - Advanced compaction using session memory templates
- `collectFilesToKeep` (Ua4) - Identifies and restores recently accessed files after compaction
- `collectTasksToKeep` (ca4) - Preserves the state of active/recent tasks

## Sub-Documents

- [Trigger Mechanism](./trigger_mechanism.md) - Detailed analysis of compaction thresholds and triggers
- [Session Memory Compaction](./session_memory_compaction.md) - SM-based compaction path
- [File Tracker](./file_tracker.md) - File preservation during compaction
- [Microcompaction](./microcompaction.md) - Lightweight pre-compaction optimization

---

## Core Algorithms

### 1. Compaction Threshold Logic

The system uses a dynamic thresholding strategy to trigger compaction before the model's hard limit is reached.

**Threshold Calculation:**
The auto-compact threshold is typically calculated as:
`Threshold = EffectiveWindow - Offset`
Where:
- `EffectiveWindow` is roughly `TotalContext - 20000` (buffer for response)
- `Offset` is `13000` tokens by default.

**Status Levels (`Ac` / `getCompactionStatus`):**
- **Warning**: Triggered when tokens reach `Threshold - 20000`.
- **Error**: Triggered when tokens reach `Threshold - 20000` (identical in current config).
- **Auto-Compact**: Triggered when `currentTokens >= Threshold`.
- **Blocking**: Triggered when tokens reach `EffectiveWindow - 3000`.

### 2. The Compaction Lifecycle (`fs4` / `autoCompactDispatcher`)

When compaction is triggered, the `autoCompactDispatcher` (fs4) orchestrates the process with a failover strategy:

1.  **Check Triggers**: First verifies `shouldAutoCompact` (amY).
2.  **Attempt Session Memory Compaction**:
    - Calls `vZ6` (performSessionMemoryCompaction).
    - This method uses structured templates to summarize the session if `tengu_sm_compact` is enabled.
    - If successful, returns the result immediately.
3.  **Fallback to Standard Compaction**:
    - If Session Memory compaction is disabled or fails (returns null), it falls back to `AW1` (performFullCompaction).
    - This is the standard LLM-based summarization of message history.

**Standard Compaction Steps (`AW1`):**

1.  **Pre-Compact Hooks**: Fires `PreCompact` event for any registered hooks.
2.  **State Snapshot**:
    - Recent files (up to 5 most recent, max 50k tokens) are identified.
    - Active Tasks, Plan files, and invoked Skills are marked for preservation.
    - Todo list items are collected.
3.  **Summarization**:
    - The LLM is called with a specialized prompt to summarize the conversation history.
    - This summary becomes the new "starting point" of the conversation.
4.  **Context Reconstitution**:
    - A new message list is created starting with the summary.
    - The preserved state (Files, Tasks, Plans) is injected as new "attachments".
    - `isCompactSummary: true` is set on the summary message.
5.  **Post-Compact Cleanup**:
    - File read history is cleared (`readFileState.clear()`).
    - Token counts are updated.

### 3. Preservation Strategy

Unlike simple "sliding window" approaches, Claude Code uses a **Semantic Reconstitution** strategy.

====
// collectFilesToKeep - Restores recently read files after compaction
// Location: chunks.146.mjs:2665-2686
====

// ORIGINAL (for source lookup):
async function Ua4(A, q, K) {
    let Y = Object.entries(A).map(([H, $]) => ({ filename: H, ...$ })).filter((H) => !EmY(H.filename, q.agentId)).sort((H, $) => $.timestamp - H.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (H) => {
            let $ = await TyA(H.filename, { ...q, fileReadingLimits: { maxTokens: VmY } }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return $ ? kq($) : null
        })),
        w = 0;
    return z.filter((H) => {
        if (H === null) return !1;
        let $ = A2(Q1(H));
        if (w + $ <= fmY) return w += $, !0;
        return !1
    })
}

// READABLE (for understanding):
async function collectFilesToKeep(readFileState, context, maxFilesToKeep) {
    // 1. Sort files by access timestamp and filter out internal/temporary files
    let candidates = Object.entries(readFileState)
        .map(([filename, data]) => ({ filename, ...data }))
        .filter((file) => !isInternalFile(file.filename, context.agentId))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxFilesToKeep);

    // 2. Re-read the file contents (with a token limit per file)
    let restoredFiles = await Promise.all(candidates.map(async (file) => {
        let content = await readFileContent(file.filename, {
            ...context,
            fileReadingLimits: { maxTokens: 5000 }
        }, "compact");
        return content ? createAttachment(content) : null;
    }));

    // 3. Filter and respect global token limit for all restored files (50k tokens)
    let currentTotalTokens = 0;
    return restoredFiles.filter((attachment) => {
        if (attachment === null) return false;
        let tokens = countTokens(serialize(attachment));
        if (currentTotalTokens + tokens <= 50000) {
            currentTotalTokens += tokens;
            return true;
        }
        return false;
    });
}

// Mapping: Ua4→collectFilesToKeep, A→readFileState, q→context, K→maxFilesToKeep, VmY→FILE_RESTORE_TOKEN_LIMIT (5000), fmY→TOTAL_RESTORE_TOKEN_LIMIT (50000)

## Key Insight

The "Magic" of Claude Code's compaction is not just summarization, but **State Anchoring**. By explicitly re-injecting the Plan file and active Tasks after every compaction, the agent never "forgets" what it was doing, even if the detailed conversation history of how it got there is compressed into a 1-2 sentence summary.
