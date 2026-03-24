# Compaction Cache Integration

## Overview

This document details how the prompt cache system integrates with the auto-compaction mechanism. When conversations are compacted (summarized), there's an opportunity to preserve cache prefixes across the compaction boundary, resulting in significant cost savings for subsequent API calls.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `generateCompactSummary` (Gqq) - Main compaction summary generation with cache support
- `getPromptCacheSharingFeatureFlag` - Checks `tengu_compact_cache_prefix` feature flag
- `forkAgentQuery` (av) - Fork agent used for cache prefix preservation
- `getCacheSafeParams` (Fb) - Builds parameters for cache-safe API calls
- `autoCompactDispatcher` (sI2) - Main auto-compact entry point

---

## Cache Prefix Sharing Concept

### The Problem

When messages are compacted:
1. Old conversation content is replaced with a summary
2. The previous cache (built on old messages) becomes invalid
3. The next API call must rebuild the cache from scratch
4. This results in cache_creation costs for the entire prompt prefix

### The Solution: Cache Prefix Sharing

The system can use a "fork agent" to generate the summary while preserving the cache prefix:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITHOUT CACHE PREFIX SHARING                              │
└─────────────────────────────────────────────────────────────────────────────┘

  Original Messages:        After Compaction:         Next API Call:
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │ M1 (cached)   │        │ Summary       │        │ Summary       │
  │ M2 (cached)   │   →    │ (new content) │   →    │ (cache miss)  │
  │ M3 (cached)   │        │               │        │               │
  │ M4 (cached)   │        │               │        │               │
  │ M5 (recent)   │        │               │        │               │
  └───────────────┘        └───────────────┘        └───────────────┘
         ↓                         ↓                        ↓
   Cache hit          Cache invalidated!         Must rebuild entire
   on old content                                cache (expensive!)


┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITH CACHE PREFIX SHARING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  Original Messages:        Fork Agent Call:          Next API Call:
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │ M1 (cached)   │        │ M1 (cache hit!)│       │ Summary       │
  │ M2 (cached)   │   →    │ M2 (cache hit!)│  →    │ (cache hit on │
  │ M3 (cached)   │        │ M3 (cache hit!)│       │  shared prefix)│
  │ M4 (cached)   │        │ Summary req    │       │               │
  │ Summary req   │        │ (skipCacheWrite)│      │               │
  └───────────────┘        └───────────────┘        └───────────────┘
         ↓                         ↓                        ↓
   Cache hit          Cache preserved!           Cache hit on
   on old content     (skipCacheWrite)           shared prefix!
```

---

## Implementation Details

### generateCompactSummary (Gqq)

**What it does:** Main function that generates the conversation summary during compaction, with optional cache prefix sharing.

```javascript
// ============================================
// generateCompactSummary - Generate summary with optional cache sharing
// Location: chunks.147.mjs:1752-1850
// ============================================

// ORIGINAL (for source lookup):
async function Gqq({
    messages: A,
    summaryRequest: q,
    appState: K,
    context: Y,
    preCompactTokenCount: z,
    cacheSafeParams: _
}) {
    let w = w8("tengu_compact_cache_prefix", !1),
        O = v4q() ? setInterval(() => {
            T4q()
        }, 50000) : void 0;
    try {
        if (w) try {
            let j = await av({
                    promptMessages: [q],
                    cacheSafeParams: _,
                    canUseTool: MmY(),
                    querySource: "compact",
                    forkLabel: "compact",
                    maxTurns: 1,
                    skipCacheWrite: !0
                }),
                J = bX(j.messages);
            if (J && BE1(J)) return d("tengu_compact_cache_sharing_success", {
                preCompactTokenCount: z,
                outputTokens: j.totalUsage.output_tokens,
                cacheReadInputTokens: j.totalUsage.cache_read_input_tokens,
                cacheCreationInputTokens: j.totalUsage.cache_creation_input_tokens,
                cacheHitRate: j.totalUsage.cache_read_input_tokens > 0 ? j.totalUsage.cache_read_input_tokens / (j.totalUsage.cache_read_input_tokens + j.totalUsage.cache_creation_input_tokens + j.totalUsage.input_tokens) : 0
            }), J;
            k(`Compact cache sharing: no text in response, falling back. Response: ${B6(J)}`, {
                level: "warn"
            }), d("tengu_compact_cache_sharing_fallback", {
                reason: "no_text_response",
                preCompactTokenCount: z
            })
        } catch (j) {
            _6(j), d("tengu_compact_cache_sharing_fallback", {
                reason: "error",
                preCompactTokenCount: z
            })
        }
        // ... fallback to standard compaction ...
    } finally {
        // cleanup
    }
}

// READABLE (for understanding):
async function generateCompactSummary({
    messages,
    summaryRequest,
    appState,
    context,
    preCompactTokenCount,
    cacheSafeParams
}) {
    // Check if cache prefix sharing is enabled via feature flag
    let cacheSharingEnabled = getFeatureFlag("tengu_compact_cache_prefix", false);

    // Setup keepalive timer for long operations
    let keepaliveInterval = isLongRunning()
        ? setInterval(() => sendKeepalive(), 50000)
        : undefined;

    try {
        // =====================================================
        // PATH 1: Cache Prefix Sharing (if enabled)
        // =====================================================
        if (cacheSharingEnabled) {
            try {
                // Use fork agent with skipCacheWrite to preserve cache
                let forkResult = await forkAgentQuery({
                    promptMessages: [summaryRequest],
                    cacheSafeParams: cacheSafeParams,
                    canUseTool: getCompactCanUseTool(),
                    querySource: "compact",
                    forkLabel: "compact",
                    maxTurns: 1,
                    skipCacheWrite: true  // KEY: Don't write new cache, preserve existing
                });

                let assistantMessage = extractAssistantMessage(forkResult.messages);

                if (assistantMessage && hasValidTextContent(assistantMessage)) {
                    // SUCCESS: Cache prefix was preserved
                    trackEvent("tengu_compact_cache_sharing_success", {
                        preCompactTokenCount,
                        outputTokens: forkResult.totalUsage.output_tokens,
                        cacheReadInputTokens: forkResult.totalUsage.cache_read_input_tokens,
                        cacheCreationInputTokens: forkResult.totalUsage.cache_creation_input_tokens,
                        cacheHitRate: calculateCacheHitRate(forkResult.totalUsage)
                    });

                    return assistantMessage;
                }

                // FALLBACK: No valid text in response
                debugLog(`Compact cache sharing: no text in response, falling back.`);
                trackEvent("tengu_compact_cache_sharing_fallback", {
                    reason: "no_text_response",
                    preCompactTokenCount
                });
            } catch (error) {
                // ERROR: Fork agent failed, fall back to standard
                logError(error);
                trackEvent("tengu_compact_cache_sharing_fallback", {
                    reason: "error",
                    preCompactTokenCount
                });
            }
        }

        // =====================================================
        // PATH 2: Standard Compaction (fallback or cache sharing disabled)
        // =====================================================
        // ... standard streaming compaction logic ...
    } finally {
        if (keepaliveInterval) clearInterval(keepaliveInterval);
    }
}

// Mapping: Gqq->generateCompactSummary, A->messages, q->summaryRequest,
//   K->appState, Y->context, z->preCompactTokenCount, _->cacheSafeParams,
//   w8->getFeatureFlag, av->forkAgentQuery, d->trackEvent, k->debugLog,
//   _6->logError, bX->extractAssistantMessage, BE1->hasValidTextContent
```

### Key Insight: skipCacheWrite Flag

The `skipCacheWrite: true` parameter is critical for cache preservation:

```javascript
skipCacheWrite: true  // Don't create NEW cache entries
                      // This preserves the EXISTING cache prefix
                      // for the next turn's API call
```

When `skipCacheWrite` is true:
1. The API call uses existing cached content (cache_read)
2. No new cache entries are created (avoid cache_creation)
3. The existing cache prefix remains valid for subsequent calls

---

## Feature Flag Configuration

### tengu_compact_cache_prefix

| Value | Behavior |
|-------|----------|
| `false` (default) | Standard compaction, no cache preservation |
| `true` | Use fork agent with `skipCacheWrite` to preserve cache |

**Configuration:**
```json
{
    "tengu_compact_cache_prefix": true
}
```

---

## Cache Safe Parameters

### getCacheSafeParams (Fb)

**What it does:** Builds parameters that preserve cache validity across API calls.

```javascript
// ============================================
// getCacheSafeParams - Build cache-safe parameters
// Location: chunks.146.mjs:1572
// ============================================

// Used to pass parameters that maintain cache consistency:
// - Same model
// - Same system prompt structure
// - Same tool definitions
// - Consistent cache breakpoints

let cacheSafeParams = getCacheSafeParams(options);
// Or fallback to default:
let cacheSafeParams = z ?? Fb(q);
```

**Why needed:** For cache prefix sharing to work, subsequent API calls must use compatible parameters. The `cacheSafeParams` object captures these at compaction time.

---

## Telemetry Events

### tengu_compact_cache_sharing_success

Emitted when cache prefix sharing succeeds:

```javascript
d("tengu_compact_cache_sharing_success", {
    preCompactTokenCount: z,
    outputTokens: j.totalUsage.output_tokens,
    cacheReadInputTokens: j.totalUsage.cache_read_input_tokens,
    cacheCreationInputTokens: j.totalUsage.cache_creation_input_tokens,
    cacheHitRate: /* calculated */
})
```

### tengu_compact_cache_sharing_fallback

Emitted when cache sharing fails and falls back to standard:

```javascript
d("tengu_compact_cache_sharing_fallback", {
    reason: "no_text_response" | "error",
    preCompactTokenCount: z
})
```

### tengu_compact (Main Event)

Emitted after every compaction with full cache statistics:

```javascript
// From chunks.147.mjs:1559-1578
d("tengu_compact", {
    preCompactTokenCount: O,
    postCompactTokenCount: b,
    truePostCompactTokenCount: p,
    autoCompactThreshold: w?.autoCompactThreshold ?? -1,
    willRetriggerNextTurn: w !== void 0 && p >= w.autoCompactThreshold,
    isAutoCompact: _,
    querySource: U,
    queryChainId: q.queryTracking?.chainId ?? "",
    queryDepth: q.queryTracking?.depth ?? -1,
    isRecompactionInChain: w?.isRecompactionInChain ?? !1,
    turnsSincePreviousCompact: w?.turnsSincePreviousCompact ?? -1,
    previousCompactTurnId: w?.previousCompactTurnId ?? "",
    compactionInputTokens: Q?.input_tokens,
    compactionOutputTokens: Q?.output_tokens,
    compactionCacheReadTokens: Q?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: Q?.cache_creation_input_tokens ?? 0,
    compactionTotalTokens: Q ? Q.input_tokens + (Q.cache_creation_input_tokens ?? 0) + (Q.cache_read_input_tokens ?? 0) + Q.output_tokens : 0,
    promptCacheSharingEnabled: D,
    ...H
});
```

---

## Cache Statistics During Compaction

### Token Tracking

The compaction API call itself is tracked with cache statistics:

```javascript
// From chunks.147.mjs:1574-1576
compactionCacheReadTokens: Q?.cache_read_input_tokens ?? 0,
compactionCacheCreationTokens: Q?.cache_creation_input_tokens ?? 0,
compactionTotalTokens: Q ? Q.input_tokens + (Q.cache_creation_input_tokens ?? 0) + (Q.cache_read_input_tokens ?? 0) + Q.output_tokens : 0,
```

### Interpreting the Metrics

| Scenario | cacheReadTokens | cacheCreationTokens | Interpretation |
|----------|-----------------|---------------------|----------------|
| Cache sharing success | High | Low | Existing cache was reused |
| Cache sharing fallback | Low | High | New cache had to be built |
| No cache configured | 0 | 0 | Caching not active |

---

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPACTION WITH CACHE SHARING                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ Auto-compact    │
│ triggered       │
│ (token threshold│
│  exceeded)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: tengu_compact_cache_prefix feature flag                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
    ┌────┴────┐
    │ false   │ true
    ▼         ▼
┌─────────┐  ┌───────────────────────────────────────────────────────────────┐
│ Standard│  │ Fork Agent Path                                                │
│Compact  │  │                                                                │
│         │  │  1. Build cacheSafeParams (preserve model, tools, prompt)     │
│         │  │  2. Call forkAgentQuery with skipCacheWrite: true             │
│         │  │  3. API reuses existing cache (cache_read_input_tokens high)   │
│         │  │  4. Summary generated WITHOUT invalidating cache              │
│         │  │                                                                │
│         │  │  Success? ──Yes──► Return summary, cache preserved            │
│         │  │     │                                                         │
│         │  │     No                                                        │
│         │  │     ▼                                                         │
│         │  │  Fallback to standard compaction                              │
└─────────┘  └───────────────────────────────────────────────────────────────┘
         │         │
         └────┬────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Replace old messages with summary                                           │
│ Attach post_compact hooks                                                   │
│ Track tengu_compact telemetry                                               │
└─────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Next API Call                                                               │
│                                                                              │
│ WITHOUT cache sharing: Cache miss, must rebuild (expensive)                 │
│ WITH cache sharing: Cache hit on preserved prefix (cheap)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cost Savings Analysis

### Example: 100-Turn Session with Compaction

**Scenario:**
- System prompt: 20,000 tokens
- 100 turns before compaction triggers
- Compaction summarizes 80 turns

**WITHOUT Cache Sharing:**
```
Pre-compaction:  100 turns × 20,000 tokens cached = ~95% hit rate
Compaction API:  Cache invalidated, rebuild 20,000 tokens
Post-compaction: First turn = cache_creation for entire prefix
                 Cost = $0.05 (cache write at $6.25/M for Sonnet 4)
```

**WITH Cache Sharing:**
```
Pre-compaction:  100 turns × 20,000 tokens cached = ~95% hit rate
Compaction API:  Fork agent reuses cache (skipCacheWrite)
                 Cache read = 20,000 tokens
                 Cost = $0.01 (cache read at $0.50/M for Sonnet 4)
Post-compaction: First turn = cache hit on shared prefix
                 No additional cache creation cost
```

**Savings:** $0.04 per compaction event, plus sustained hit rate post-compaction.

---

## Related Functions in Other Modules

### Fork Agent (av)

Located in the subagent execution module, the fork agent provides isolated execution for cache preservation:

```javascript
// Used for cache prefix sharing
await forkAgentQuery({
    promptMessages: [summaryRequest],
    cacheSafeParams: cacheSafeParams,
    querySource: "compact",
    forkLabel: "compact",
    maxTurns: 1,
    skipCacheWrite: true
});
```

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.147.mjs` | `Gqq`, auto-compact functions | Compaction summary generation |
| `chunks.146.mjs` | `Fb` | Cache safe params builder |
| `chunks.148.mjs` | Fork agent telemetry | Cache hit rate in forked agents |

---

## See Also

- [overview.md](./overview.md) - Prompt cache system overview
- [ui_interaction.md](./ui_interaction.md) - UI display of cache statistics
- [../07_compact/overview.md](../07_compact/overview.md) - Compaction system architecture
- [cache_placement.md](./cache_placement.md) - Cache breakpoint placement