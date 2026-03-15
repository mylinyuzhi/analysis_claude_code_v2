# Implementation Report - Context Compaction (Module 07)

## Overview

Context Compaction is a critical subsystem in Claude Code that manages the LLM's finite context window. It ensures that the conversation can continue indefinitely by summarizing older parts of the conversation while preserving essential state (files, tasks, plans). In v2.1.76, this system is tightly integrated with the new **Agent Teams** and **Task System**.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `autocompactDispatcher` (sqq) - Inner dispatcher for automatic compaction (chunks.147.mjs:2633)
- `shouldTriggerAutoCompaction` (CmY) - Threshold + enable check combined (chunks.147.mjs:2620)
- `isAutoCompactGloballyEnabled` (Xh) - Env var + setting check (chunks.147.mjs:2614)
- `getCompactionStatus` (mz6) - Calculates usage percentages and threshold status (chunks.147.mjs:2591)
- `generateConversationSummary` (ga4) - LLM-powered summarization of history
- `performSessionMemoryCompaction` (vZ6) - Advanced compaction using session memory templates
- `collectFilesToKeep` (Ua4) - Identifies and restores recently accessed files after compaction
- `collectTasksToKeep` (ca4) - Preserves the state of active/recent tasks

## Sub-Documents

- [Trigger Mechanism](./trigger_mechanism.md) - Detailed analysis of compaction thresholds and triggers
- [Session Memory Compaction](./session_memory_compaction.md) - SM-based compaction path
- [File Tracker](./file_tracker.md) - File preservation during compaction
- [Microcompaction](./microcompaction.md) - Lightweight pre-compaction optimization
- [Slash Command](./slash_command.md) - `/compact` command handler and reactive mode path
- [Reminder & Boundary](./reminder_and_boundary.md) - Compaction reminder injection and boundary marker system
- [Query Pipeline Integration](./query_pipeline_integration.md) - How compact hooks into the agent query loop

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

**Status Levels (`mz6` / `getCompactionStatus`):**
- **Warning**: Triggered when tokens reach `Threshold - 20000`.
- **Error**: Triggered when tokens reach `Threshold - 20000` (identical in current config).
- **Auto-Compact**: Triggered when `currentTokens >= Threshold`.
- **Blocking**: Triggered when tokens reach `EffectiveWindow - 3000`.

### 2. The Compaction Lifecycle (`sqq` / `autocompactDispatcher`)

When compaction is triggered, the `autocompactDispatcher` (sqq, chunks.147.mjs:2633) orchestrates the process with a failover strategy:

1.  **Circuit Breaker Check**: Returns early if `consecutiveFailures >= 3` (aqq).
2.  **Check Triggers**: Calls `shouldTriggerAutoCompaction` (CmY), which checks both `isAutoCompactGloballyEnabled` (Xh) and token threshold.
3.  **Attempt Session Memory Quick Path**:
    - Calls `lE1` (trySessionMemoryQuickPath).
    - Uses pre-built templates if available; no LLM call needed.
    - If successful, clears caches and returns immediately.
4.  **Fallback to Standard Compaction**:
    - Calls `mf6` (performFullCompactionFlow) — full LLM-based summarization.
    - On failure, increments `consecutiveFailures` counter.

**Reactive compact mode:** The `/compact` command also supports a reactive-only path via `WpY` (`manualCompactWithReactiveMode`) when `Z9q.isReactiveOnlyMode()` is true. See [slash_command.md](./slash_command.md) for details.

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

## Auto-Compact Circuit Breaker (v2.1.76)

### Overview

To prevent cascading failures during compaction, Claude Code v2.1.76 implements a **circuit breaker** mechanism that disables auto-compaction after 3 consecutive failures.

### What it does

The circuit breaker tracks consecutive compaction failures and temporarily disables auto-compaction to prevent repeated error cycles.

### How it works

**Failure tracking:**
1. Each failed compaction increments a counter in session state
2. Counter is persistent across turns within a session
3. After 3 consecutive failures, auto-compaction is disabled
4. Counter resets to 0 on successful compaction

**Disabled state behavior:**
- `autoCompactDispatcher()` returns early without attempting compaction
- UI displays "Auto-compaction disabled" status message
- Error message guides user to manually trigger compaction or start a new session
- Logs detailed error information for diagnostics

**Circuit breaker reset:**
- Successful compaction: Counter → 0, auto-compaction re-enabled
- New session: Counter starts at 0
- Manual compaction: Does NOT reset counter (manual still allowed when disabled)

### State persistence

**Location:** `sessionContext.autoCompactFailureCount`

```javascript
// Failure counter lifecycle
{
    autoCompactFailureCount: 0  // Resets on success or new session
}
```

**When failure count increments:**
- `performFullCompaction()` throws error
- `performSessionMemoryCompaction()` throws error
- Exception caught in `autoCompactDispatcher()` → increment counter

**When disabled state is triggered:**
- Failure count reaches 3
- UI alerts user
- Session continues (not fatally aborted)

### User experience

**Scenario 1: Single failure**
- User sees error message with suggestion to retry
- Auto-compaction retries normally on next trigger

**Scenario 2: Three consecutive failures**
- Auto-compaction disabled status shown
- User guided to either:
  - Trigger manual compaction if safe
  - Start new session
- Error logs include compaction error details

### Why this approach

**Design rationale:**

1. **Prevents infinite retry loops**
   - Without circuit breaker, repeated failures could hang the session
   - 3-failure threshold balances "temporary glitch" vs "systemic problem"

2. **Graceful degradation**
   - Session continues despite compaction failure
   - Manual compaction still available if user knows it's safe
   - New session always works (clean state)

3. **Debugging support**
   - Failure count signals severity to user
   - Distinguishes transient vs persistent failures
   - Error logs retained for post-mortem

**Trade-offs:**

- **Automatic doesn't retry after 3 failures** - User must decide to try manual or restart
- **Silent after disabling** - No automatic retries, explicit user action required

### Key insight

The circuit breaker implements **fail-fast safety** for a critical subsystem. Rather than cascade failures trying to recover from a broken state, the system transparently signals the problem and gives users explicit control.

---

## Key Insight

The "Magic" of Claude Code's compaction is not just summarization, but **State Anchoring**. By explicitly re-injecting the Plan file and active Tasks after every compaction, the agent never "forgets" what it was doing, even if the detailed conversation history of how it got there is compressed into a 1-2 sentence summary.
