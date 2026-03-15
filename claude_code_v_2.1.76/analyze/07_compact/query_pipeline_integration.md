# Compact Integration in the Query Pipeline

## Overview

This document covers how compaction hooks into the agent query execution loop. Compaction is not a standalone subsystem — it runs as an integrated phase inside every query iteration, interleaved between microcompaction and the actual LLM API call.

**Source:** `chunks.148.mjs`, function `omY` (`queryLoopMainFunction`)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createCompactionToolsContext` (SKq) - Factory for the compaction tools object injected into the query loop
- `queryLoopMainFunction` (omY) - The main agent loop where compaction phases run
- `queryEntryPoint` (Yh) - Entry point that wraps omY

---

## Compaction Tools Context

### `createCompactionToolsContext` (SKq)

**What it does:** Creates the dependency injection object that provides compaction capabilities to the query loop. This object is what the loop uses to call microcompact and autocompact.

```javascript
// ============================================
// createCompactionToolsContext - Builds compaction DI object for query loop
// Location: chunks.148.mjs:834-841
// ============================================

// ORIGINAL (for source lookup):
function SKq() {
    return {
        callModel: NT6,
        microcompact: pg,
        autocompact: sqq,
        uuid: nmY
    }
}

// READABLE (for understanding):
function createCompactionToolsContext() {
    return {
        callModel: callLLMModel,          // LLM API call function
        microcompact: microCompact,        // pg — lightweight token reducer (chunks.133.mjs:991)
        autocompact: autocompactDispatcher, // sqq — full compaction orchestrator (chunks.147.mjs:2633)
        uuid: generateUUID                 // nmY — UUID generator for tracking
    }
}

// Mapping: SKq→createCompactionToolsContext, NT6→callLLMModel, pg→microCompact, sqq→autocompactDispatcher, nmY→generateUUID
```

**Why dependency injection:** The query loop uses `A.deps ?? SKq()` — the `deps` field can be overridden in tests or specialized query invocations. This allows tests to inject mock compaction functions without patching globals.

---

## Execution Sequence in Query Loop

The query loop (`omY` / `queryLoopMainFunction`) runs compaction in two distinct phases before each LLM API call:

### Phase 1: Microcompaction

```javascript
// chunks.148.mjs:936-938
K5("query_microcompact_start");
I = (await j.microcompact(I, X, O)).messages;
K5("query_microcompact_end");
```

- Calls `pg` (`microCompact`) — a lightweight, synchronous-like operation
- **Does not call the LLM** — just reorganizes/truncates messages below a threshold
- Updates `I` (the working message array) in-place for this iteration
- Timing logged via `K5` (performance marker)

### Phase 2: Token Count

```javascript
// chunks.148.mjs:939
let Q = uq(xKq(K, z));
```

After microcompaction, the effective token count is recomputed. This gives `shouldTriggerAutoCompaction` (`CmY`) an accurate post-microcompact baseline.

### Phase 3: Autocompaction

```javascript
// chunks.148.mjs:940-950
K5("query_autocompact_start");
let {
    compactionResult: U,
    consecutiveFailures: r
} = await j.autocompact(I, X, {
    systemPrompt: K,
    userContext: Y,
    systemContext: z,
    toolUseContext: X,
    forkContextMessages: I
}, O, g, B);
K5("query_autocompact_end");
```

Calls `sqq` (`autocompactDispatcher`) with:
- `I` — current messages (post-microcompact)
- `X` — toolUseContext
- Compaction context object (see below)
- `O` — querySource (e.g., `"auto"`, `"compact"`, `"session_memory"`)
- `g` — autoCompactTracking state (compacted flag, turn counter, consecutive failures)
- `B` — token offset freed by prior operations

**Key ordering insight:** Microcompact always runs *before* autocompact. This means:
1. Microcompact may bring token count below the autocompact threshold → autocompact check is skipped
2. Microcompact reduces the message array before autocompact attempts full LLM summarization
3. The token count for the autocompact threshold check uses the post-microcompact count (`z - Y` in `CmY`, where `Y` is the snipFreed offset `B`)

---

## Compaction Context Object

The object passed to `autocompact` as its third argument:

```javascript
{
    systemPrompt: K,           // Full assembled system prompt
    userContext: Y,            // User context string (from getUserContext())
    systemContext: z,          // System context (OS, platform info)
    toolUseContext: X,         // Full toolUseContext (tools, model, permissions, etc.)
    forkContextMessages: I     // Message array (post-microcompact)
}
```

This context is used by `performFullCompactionFlow` (`mf6`) during summarization. The system prompt, userContext, and systemContext are passed to the LLM compaction call so the summary is grounded in the full session context.

---

## Auto-Compact Success Path

When `compactionResult` (`U`) is truthy, the query loop:

1. **Emits telemetry** via `d("tengu_auto_compact_succeeded", {...})`
2. **Yields compaction result messages** to the caller via async generator
3. **Updates `autoCompactTracking`** state (`g`)

### `tengu_auto_compact_succeeded` Telemetry Payload

```javascript
// chunks.148.mjs:958-971
d("tengu_auto_compact_succeeded", {
    originalMessageCount: P.length,          // messages BEFORE microcompact
    compactedMessageCount:                   // summary + attachments + hook results
        U.summaryMessages.length + U.attachments.length + U.hookResults.length,
    preCompactTokenCount: D6,                // tokens before compaction
    postCompactTokenCount: Q6,               // tokens after (estimated)
    truePostCompactTokenCount: k6,           // tokens after (actual count)
    compactionInputTokens: Z6?.input_tokens,
    compactionOutputTokens: Z6?.output_tokens,
    compactionCacheReadTokens: Z6?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: Z6?.cache_creation_input_tokens ?? 0,
    compactionTotalTokens: Z6 ? Z6.input_tokens + (Z6.cache_creation_input_tokens ?? 0) + (Z6.cache_read_input_tokens ?? 0) + Z6.output_tokens : 0,
    queryChainId: u,                         // chain ID for correlating with other events
    queryDepth: R.depth                      // nesting depth (0 = top-level query)
})
```

**Why `truePostCompactTokenCount` vs `postCompactTokenCount`:** The "post" count is estimated immediately after compaction (fast but approximate), while "true post" is computed after the full message reconstitution. Both are recorded so analytics can assess estimation accuracy.

### `autoCompactTracking` Update After Success

```javascript
g = {
    compacted: true,
    turnId: j.uuid(),      // New UUID for this compaction event
    turnCounter: 0,        // Reset turn counter
    consecutiveFailures: 0 // Reset failure counter
}
```

The `turnCounter` resets to 0 after compaction — it tracks "turns since last compact" and feeds into the compaction metadata recorded in boundary markers.

---

## Auto-Compact Failure Path

When `compactionResult` is falsy but `consecutiveFailures` (`r`) is defined:

```javascript
// chunks.148.mjs:980-987
else if (r !== void 0) g = {
    ...g ?? {
        compacted: false,
        turnId: "",
        turnCounter: 0
    },
    consecutiveFailures: r
}
```

The failure count is accumulated in `autoCompactTracking`. Once it reaches `aqq` (3), `autocompactDispatcher` (`sqq`) returns early without attempting compaction:

```javascript
// chunks.147.mjs:2637-2639 (sqq)
if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
    wasCompacted: false
}
```

This is the **circuit breaker**: 3 consecutive failures disable further auto-compact attempts for the session.

---

## Blocking Limit Check (Post-Compaction)

After the autocompact phase (whether it ran or not), there is a blocking limit safety check:

```javascript
// chunks.148.mjs:1008-1017
if (!U && O !== "compact" && O !== "session_memory" && !(Bi6?.isReactiveOnlyMode() && Xh()) && !n) {
    let { isAtBlockingLimit: D6 } = mz6(eW(I) - B, X.options.mainLoopModel);
    if (D6) return yield y9({ content: EB, error: "invalid_request" }), { reason: "blocking_limit" }
}
```

**Conditions for blocking limit check:**
- `!U` — compaction did NOT succeed (if it did, we're safe)
- `O !== "compact"` and `O !== "session_memory"` — not already in a compaction query
- Not in reactive-only mode with auto-compact enabled
- Blocking limit is checked using `mz6` (`getCompactionStatus`)
- If at limit: yields an error message and returns `{ reason: "blocking_limit" }` — the query loop exits without making an LLM call

**Why this safety valve:** Even after microcompact + failed autocompact, the context could still be too large for the model. Rather than sending an oversized request to the API (which would result in a server-side error), the loop short-circuits with a clean error.

---

## Full Execution Flow Diagram

```
omY (queryLoopMainFunction) — one iteration:
│
├── [1] fN(messages) → slice from last compact boundary
│       └── getMessagesFromLastBoundary ensures only post-compact messages used
│
├── [2] T34(...) → content replacement (not compaction-related)
│
├── [3] query_microcompact_start
│   pg(messages) → microCompact
│   → returns possibly-reduced messages (no LLM call)
│   query_microcompact_end
│
├── [4] uq(xKq(K, z)) → recompute effective token count
│
├── [5] query_autocompact_start
│   sqq(messages, ctx, compactionCtx, querySource, tracking, snipFreed)
│   → autocompactDispatcher
│       ├── check consecutiveFailures >= 3 → skip (circuit breaker)
│       ├── CmY(tokens, model, querySource) → shouldTriggerAutoCompaction
│       │   ├── false → { wasCompacted: false }
│       │   └── true → continue
│       ├── lE1() → trySessionMemoryQuickPath
│       │   └── success → { wasCompacted: true, compactionResult }
│       └── mf6() → performFullCompactionFlow
│           └── { wasCompacted: true, compactionResult } or throw
│   query_autocompact_end
│
├── [6] if compacted → emit tengu_auto_compact_succeeded, yield results
│     if failed → update consecutiveFailures in tracking
│
├── [7] blocking limit check (if not compacted)
│   └── at limit → yield error, return { reason: "blocking_limit" }
│
└── [8] → proceed to LLM API call
```
