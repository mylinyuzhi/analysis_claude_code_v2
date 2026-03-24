# Key Algorithms and Design Decisions

## Overview

This document provides in-depth analysis of the critical algorithms in the prompt cache system. Each algorithm is examined with focus on: why it was designed this way, what alternatives exist, and what trade-offs were made.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `splitSystemPromptForCache` (Jn8) - Three-mode system prompt partitioning
- `shouldUse1HourTTL` (o3z) - TTL decision algorithm
- `calculateCacheHitRate` - Cache efficiency measurement
- `applyCacheBreakpointsToMessages` (z9z) - Message cache placement
- `createCacheControl` (Ml) - Cache control object construction

---

## Algorithm 1: Cache Breakpoint Index Calculation

### The Problem

When placing cache breakpoints on messages, we need to decide which message gets the `cache_control` marker. The API caches everything UP TO the marked message. If we mark the wrong message, we either:
- Miss cache hits (mark too early, new messages not cached for next turn)
- Waste cache storage (mark too late, cache same content twice)

### The Solution

```javascript
// ============================================
// Cache breakpoint index calculation
// Location: chunks.171.mjs:732-733
// ============================================

// ORIGINAL (for source lookup):
let O = w ? A.length - 2 : A.length - 1;

// READABLE (for understanding):
let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;

// Mapping: O->cacheBreakpointIndex, w->skipCacheWrite, A->messages
```

### Decision Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BREAKPOINT INDEX DECISION                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │ skipCacheWrite? │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
               ┌─────────┐               ┌─────────┐
               │  true   │               │  false  │
               └────┬────┘               └────┬────┘
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │ index = len - 2     │   │ index = len - 1     │
        │                     │   │                     │
        │ Mark second-to-last │   │ Mark last message   │
        │ message             │   │                     │
        └─────────────────────┘   └─────────────────────┘
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │ Example:            │   │ Example:            │
        │ [M0, M1, M2, M3,    │   │ [M0, M1, M2, M3,    │
        │  M4, M5]            │   │  M4, M5]            │
        │         ↑           │   │              ↑      │
        │      M4 gets        │   │           M5 gets   │
        │      cache_control  │   │           cache_    │
        │                     │   │           control   │
        └─────────────────────┘   └─────────────────────┘
```

### Why This Design

**Why `skipCacheWrite` affects index:**

When `skipCacheWrite = true`, the last message is a NEW message being sent. We don't want to cache it yet because:
1. It hasn't been processed by the API (no response yet)
2. Caching it would create a cache entry we can't immediately use
3. The NEXT turn will need to cache it anyway

**Why last message normally:**
- The last message is the "frontier" - it's the most recently added content
- Earlier messages should already be cached from previous turns
- This creates a "rolling cache" effect where each turn extends the cached prefix

### Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| Always last | Simple, rolling cache works well | May waste cache on new messages |
| Always second-to-last | Avoids caching new messages | Misses caching the latest response |
| Conditional (current design) | Best of both worlds | Slightly more complex logic |

---

## Algorithm 2: System Prompt Three-Mode Splitting

### The Problem

The system prompt contains:
1. **Stable content** (coding instructions, safety rules) - rarely changes
2. **Semi-stable content** (MCP instructions, environment info) - changes per session
3. **Dynamic content** (CLAUDE.md memory, user preferences) - changes frequently

If we cache the entire system prompt with one scope, ANY change invalidates the entire cache. We need to split it intelligently.

### The Solution: Three-Mode Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM PROMPT SPLITTING MODES                             │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │ Global cache        │
                        │ enabled?            │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
             ┌─────────────┐               ┌─────────────┐
             │    YES      │               │     NO      │
             └──────┬──────┘               └──────┬──────┘
                    │                             │
                    ▼                             │
         ┌──────────────────┐                     │
         │ skipGlobalCache  │                     │
         │ ForSystemPrompt? │                     │
         └────────┬─────────┘                     │
                  │                               │
         ┌────────┴────────┐                      │
         │                 │                      │
         ▼                 ▼                      ▼
   ┌───────────┐    ┌───────────┐          ┌───────────┐
   │   YES     │    │    NO     │          │  MODE 3   │
   └─────┬─────┘    └─────┬─────┘          │  Default  │
         │                │                └─────┬─────┘
         ▼                ▼                      │
   ┌───────────┐    ┌───────────┐                │
   │  MODE 1   │    │  MODE 2   │                │
   │Tool-based │    │Boundary-  │                │
   │ Global    │    │based      │                │
   └─────┬─────┘    └─────┬─────┘                │
         │                │                      │
         │                ▼                      │
         │    ┌───────────────────────┐          │
         │    │ Find S_6 boundary     │          │
         │    │ marker?               │          │
         │    └───────────┬───────────┘          │
         │                │                      │
         │       ┌────────┴────────┐             │
         │       │                 │             │
         │       ▼                 ▼             │
         │ ┌───────────┐    ┌───────────┐        │
         │ │  FOUND    │    │ NOT FOUND │        │
         │ └─────┬─────┘    └─────┬─────┘        │
         │       │                │              │
         │       ▼                └──────────────┤
         │  Split at                 (fallthrough)
         │  boundary                              │
         │       │                                │
         └───────┴────────────────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Return blocks with    │
                     │ appropriate scopes    │
                     └───────────────────────┘
```

### Mode Details

#### Mode 1: Tool-Based Global Cache

**When:** `skipGlobalCacheForSystemPrompt = true`

**Strategy:** Tool schemas get `global` scope, system prompt gets `org` scope

```javascript
// Result structure:
[
    { text: "x-anthropic-billing-header: ...", cacheScope: null },
    { text: "identity-string", cacheScope: "org" },
    { text: "system-prompt-content...", cacheScope: "org" }
]
// Tool schema gets global scope separately
```

**Why this design:**
- Tools are MORE stable than system prompt
- Tool schema changes are less frequent than CLAUDE.md edits
- Cache prefix anchored on tools covers BOTH tools AND system prompt
- Results in higher cache hit rates when tools are stable

#### Mode 2: Boundary-Based Global Cache

**When:** Global cache enabled, `skipGlobalCacheForSystemPrompt = false`, boundary marker found

**Strategy:** Split at `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`, global scope before, null after

```javascript
// Result structure:
[
    { text: "x-anthropic-billing-header: ...", cacheScope: null },
    { text: "identity-string", cacheScope: null },
    { text: "stable-content...", cacheScope: "global" },  // Before boundary
    { text: "dynamic-content...", cacheScope: null }      // After boundary
]
```

**Why this design:**
- Static content (coding rules, tool instructions) rarely changes
- Dynamic content (CLAUDE.md, memory) changes per session
- Global caching stable content survives across sessions
- Dynamic content changes don't invalidate global cache prefix

#### Mode 3: Default (Org-Scoped)

**When:** Global cache disabled, or boundary not found

**Strategy:** All content gets `org` scope

```javascript
// Result structure:
[
    { text: "x-anthropic-billing-header: ...", cacheScope: null },
    { text: "identity-string", cacheScope: "org" },
    { text: "all-other-content...", cacheScope: "org" }
]
```

**Why this design:**
- Org scope provides some cross-session sharing within organization
- No risk of global cache invalidation from other orgs
- Simpler fallback when boundary detection fails

### Evolution Insight

```
Mode 3 (org scope)
    ↓ Added global cache with boundary detection
Mode 2 (boundary-based global)
    ↓ Discovered tools are more stable than system prompt
Mode 1 (tool-based global)
```

The three modes represent an evolution of the caching strategy, each improving on the previous by:
1. Identifying more stable content to anchor the cache
2. Reducing invalidation frequency
3. Increasing cache hit rates across sessions

---

## Algorithm 3: TTL Decision Algorithm

### The Problem

Cache entries have a Time-To-Live (TTL). Shorter TTL = more cache misses, longer TTL = more memory usage. We need to choose the right TTL based on user context.

### The Solution

```javascript
// ============================================
// shouldUse1HourTTL - Determine cache TTL duration
// Location: chunks.170.mjs:1864-1869
// ============================================

// ORIGINAL (for source lookup):
function o3z(A) {
    return iA(A) && !nI(A) && !w8("tengu_disable_extended_caching", !1)
}

// READABLE (for understanding):
function shouldUse1HourTTL(options) {
    // Must be OAuth authenticated
    if (!isOAuthUser(options)) return false;

    // Must NOT be in overage state
    if (isInOverage(options)) return false;

    // Extended caching must not be disabled by feature flag
    if (getFeatureFlag("tengu_disable_extended_caching", false)) return false;

    return true;  // 1-hour TTL approved
}

// Mapping: o3z->shouldUse1HourTTL, iA->isOAuthUser, nI->isInOverage, w8->getFeatureFlag
```

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TTL DECISION TREE                                         │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │ isOAuthUser?    │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
               ┌─────────┐               ┌─────────┐
               │   YES   │               │   NO    │
               └────┬────┘               └────┬────┘
                    │                         │
                    ▼                         ▼
          ┌──────────────────┐         ┌──────────────┐
          │ isInOverage?     │         │ 5-minute TTL │
          └────────┬─────────┘         │ (default)    │
                   │                   └──────────────┘
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │   YES   │         │   NO    │
    └────┬────┘         └────┬────┘
         │                   │
         ▼                   ▼
  ┌──────────────┐    ┌───────────────────┐
  │ 5-minute TTL │    │ tengu_disable_    │
  │ (overage)    │    │ extended_caching? │
  └──────────────┘    └─────────┬─────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
               ┌─────────┐             ┌─────────┐
               │   YES   │             │   NO    │
               └────┬────┘             └────┬────┘
                    │                       │
                    ▼                       ▼
            ┌──────────────┐         ┌──────────────┐
            │ 5-minute TTL │         │ 1-hour TTL   │
            │ (disabled)   │         │ (extended)   │
            └──────────────┘         └──────────────┘
```

### Why OAuth Required for Extended TTL

**Design rationale:**

1. **Authentication stability**: OAuth users have persistent identities, allowing longer cache associations
2. **Billing attribution**: Extended caching costs more in server memory; OAuth ensures we can track usage
3. **Risk mitigation**: API key users might share keys, risking cache contamination
4. **User experience**: OAuth users typically have longer sessions, benefit more from extended caching

### Why Overage Disables Extended TTL

**Design rationale:**

1. **Cost control**: Overage means the user is already exceeding limits
2. **Resource management**: Extended TTL consumes more server-side memory
3. **Graceful degradation**: Shorter TTL reduces server load during overage
4. **User awareness**: Signals to the system that cost optimization is critical

### Trade-offs

| TTL | Pros | Cons |
|-----|------|------|
| 5 minutes | Lower memory usage, fresh cache | More cache misses on resumed sessions |
| 1 hour | Higher hit rates, better for long sessions | Higher memory usage, stale content risk |

---

## Algorithm 4: Cache Scope Assignment

### The Problem

Different content has different "stability" profiles. We need to assign cache scopes that:
1. Maximize cache hits (choose appropriate scope)
2. Minimize invalidation (don't over-share)
3. Balance cost (global caching has server costs)

### The Solution

```javascript
// ============================================
// createCacheControl - Build cache_control object with scope and TTL
// Location: chunks.170.mjs:1849-1862
// ============================================

// ORIGINAL (for source lookup):
function Ml(A) {
    let {
        scope: q,
        querySource: K
    } = A, Y = o3z(K);
    return {
        type: "ephemeral",
        ttl: Y ? "1h" : "5m",
        ...q !== null ? { scope: q } : {}
    }
}

// READABLE (for understanding):
function createCacheControl(options) {
    let { scope, querySource } = options;

    // Determine TTL based on user context
    let useExtendedTTL = shouldUse1HourTTL(querySource);

    return {
        type: "ephemeral",
        ttl: useExtendedTTL ? "1h" : "5m",
        // Only include scope if it's not null
        ...(scope !== null ? { scope } : {})
    };
}

// Mapping: Ml->createCacheControl, q->scope, K->querySource, o3z->shouldUse1HourTTL
```

### Scope Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CACHE SCOPE HIERARCHY                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL SCOPE                                                                 │
│                                                                              │
│ • Shared across ALL users and sessions                                       │
│ • Best for: Stable system prompts, tool schemas                             │
│ • Risk: Any change invalidates for everyone                                  │
│ • Cache key: content hash only                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ORG SCOPE                                                                    │
│                                                                              │
│ • Shared within organization                                                 │
│ • Best for: Org-specific prompts, identity strings                          │
│ • Risk: Changes within org invalidate for org members                        │
│ • Cache key: org_id + content hash                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ NULL (EPHEMERAL) SCOPE                                                       │
│                                                                              │
│ • Session-specific only                                                      │
│ • Best for: Dynamic content, user messages                                   │
│ • Risk: No cross-session sharing                                             │
│ • Cache key: session_id + content hash                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Assignment Strategy

| Content Type | Typical Scope | Reason |
|--------------|---------------|--------|
| Billing header | `null` | Changes per request, no caching benefit |
| Identity string | `org` or `null` | Org-specific but may vary |
| Stable system prompt | `global` | Rarely changes, maximize sharing |
| Dynamic system prompt | `null` | Changes per session |
| Tool schemas (tool-based) | `global` | Tools are stable |
| User messages | `null` (ephemeral) | Unique per conversation |

### Why Scope is Optional in API

When `scope: null`, the `cache_control` object omits the `scope` field entirely:

```javascript
// scope = "global"
{ type: "ephemeral", ttl: "1h", scope: "global" }

// scope = "org"
{ type: "ephemeral", ttl: "1h", scope: "org" }

// scope = null (ephemeral)
{ type: "ephemeral", ttl: "1h" }  // No scope field
```

**Why this design:**
- The API treats missing `scope` as ephemeral (session-scoped)
- Reduces payload size
- Maintains backward compatibility with earlier API versions

---

## Algorithm 5: Cache Hit Rate Calculation

### The Problem

We need to measure cache efficiency to:
1. Report cost savings to users
2. Detect "cold cache" situations for optimization
3. Guide telemetry for system improvement

### The Solution

```javascript
// ============================================
// Cache hit rate calculation
// Location: chunks.147.mjs:1779-1781
// ============================================

// ORIGINAL (for source lookup):
cacheHitRate: j.totalUsage.cache_read_input_tokens > 0
    ? j.totalUsage.cache_read_input_tokens / (
        j.totalUsage.cache_read_input_tokens +
        j.totalUsage.cache_creation_input_tokens +
        j.totalUsage.input_tokens
    )
    : 0

// READABLE (for understanding):
function calculateCacheHitRate(usage) {
    // No cache reads means 0% hit rate
    if (usage.cache_read_input_tokens <= 0) {
        return 0;
    }

    // Total input tokens = all tokens processed from input
    let totalInputTokens =
        usage.cache_read_input_tokens +      // Read from cache (HIT)
        usage.cache_creation_input_tokens +  // Written to cache (MISS but cached)
        usage.input_tokens;                  // Regular input (MISS)

    // Hit rate = cached reads / total input
    return usage.cache_read_input_tokens / totalInputTokens;
}
```

### Why This Formula

```
Cache Hit Rate = cache_read / (cache_read + cache_creation + input)

Where:
- cache_read:     Tokens retrieved from cache (SAVINGS)
- cache_creation: Tokens written to cache (INVESTMENT)
- input:          Regular input tokens (BASELINE)

Interpretation:
- 0%:   No cache reads, all content is new (cold cache or first turn)
- 50%:  Half of input came from cache
- 90%+: Excellent caching, most content reused
```

### Edge Cases

| Scenario | cache_read | cache_creation | input | Hit Rate | Interpretation |
|----------|------------|----------------|-------|----------|----------------|
| First turn | 0 | 15000 | 5000 | 0% | Cold cache, building cache |
| Second turn | 15000 | 0 | 1000 | 94% | Cache hit, minimal new input |
| CLAUDE.md edit | 0 | 15000 | 5000 | 0% | Cache invalidated, rebuilding |
| Compaction | 12000 | 3000 | 2000 | 71% | Partial cache preserved |

### Cold Cache Detection

The system uses hit rate to detect "cold cache" situations:

```javascript
// From chunks.148.mjs:2253-2262
function isCacheCold(assistantMessage) {
    if (!assistantMessage) return false;

    let usage = assistantMessage.message.usage;
    let inputTokens = usage.input_tokens ?? 0;
    let cacheReadTokens = usage.cache_read_input_tokens ?? 0;
    let cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;

    let totalTokens = inputTokens + cacheReadTokens + cacheCreationTokens;
    if (totalTokens === 0) return false;

    // Cold if > 70% of tokens are cache creation (building new cache)
    let creationRatio = cacheCreationTokens / totalTokens;
    return creationRatio > 0.70;
}
```

**Why 70% threshold:**
- Below 70%: Some cache reuse happening, not "cold"
- Above 70%: Mostly creating new cache entries, likely cold
- This triggers suppression of speculative operations to save tokens

---

## Algorithm 6: Cache Prefix Sharing During Compaction

### The Problem

When compaction occurs:
1. Old messages are replaced with a summary
2. The cache prefix (built on old messages) becomes invalid
3. The next API call must rebuild cache from scratch
4. This incurs expensive `cache_creation` costs

### The Solution: Fork Agent with skipCacheWrite

```javascript
// From chunks.147.mjs:1752-1850 (simplified)
async function generateCompactSummary({
    messages,
    summaryRequest,
    cacheSafeParams
}) {
    if (getFeatureFlag("tengu_compact_cache_prefix", false)) {
        try {
            // Use fork agent to generate summary
            let forkResult = await forkAgentQuery({
                promptMessages: [summaryRequest],
                cacheSafeParams: cacheSafeParams,
                skipCacheWrite: true,  // KEY: Don't create new cache
                maxTurns: 1
            });

            // If successful, the existing cache prefix was preserved
            trackEvent("tengu_compact_cache_sharing_success", {
                cacheReadInputTokens: forkResult.totalUsage.cache_read_input_tokens
            });

            return extractAssistantMessage(forkResult.messages);
        } catch (error) {
            // Fallback to standard compaction
            trackEvent("tengu_compact_cache_sharing_fallback", { reason: "error" });
        }
    }
    // ... standard compaction logic ...
}
```

### How skipCacheWrite Preserves Cache

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITHOUT CACHE PREFIX SHARING                              │
└─────────────────────────────────────────────────────────────────────────────┘

Turn N:                         Turn N+1 (Post-compact):
┌───────────────────────┐      ┌───────────────────────┐
│ System Prompt         │      │ System Prompt         │
│ (cached)              │      │ (cache INVALIDATED)   │
├───────────────────────┤      ├───────────────────────┤
│ Messages [1..N-1]     │      │ Summary               │
│ (cached)              │ →    │ (NEW content)         │
├───────────────────────┤      ├───────────────────────┤
│ Message N             │      │ Message N+1           │
│ (current)             │      │ (new request)         │
└───────────────────────┘      └───────────────────────┘
         │                              │
         ▼                              ▼
  Cache HIT                    Cache MISS
  (cheap)                      (expensive rebuild)


┌─────────────────────────────────────────────────────────────────────────────┐
│                    WITH CACHE PREFIX SHARING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Turn N:                         Compaction API:              Turn N+1:
┌───────────────────────┐      ┌───────────────────────┐   ┌───────────────────────┐
│ System Prompt         │      │ System Prompt         │   │ System Prompt         │
│ (cached)              │      │ (cache HIT!)          │   │ (cache HIT!)          │
├───────────────────────┤      ├───────────────────────┤   ├───────────────────────┤
│ Messages [1..N-1]     │      │ Summary request       │   │ Summary               │
│ (cached)              │ →    │ (skipCacheWrite)      │ →  │ (from shared prefix)  │
├───────────────────────┤      ├───────────────────────┤   ├───────────────────────┤
│ Message N             │      │                       │   │ Message N+1           │
│ (current)             │      │                       │   │ (new request)         │
└───────────────────────┘      └───────────────────────┘   └───────────────────────┘
         │                              │                       │
         ▼                              ▼                       ▼
  Cache HIT                    Cache HIT (preserved)    Cache HIT
  (cheap)                      (cheap)                  (cheap)
```

### Why This Works

1. **Same cache prefix**: The fork agent uses the same `cacheSafeParams` (model, tools, system prompt)
2. **skipCacheWrite**: Tells the API "read from cache but don't create new entries"
3. **Cache preservation**: The existing cache remains valid for subsequent calls
4. **Cost savings**: Turns expensive cache_creation into cheap cache_read

### Cost Impact Example

**Without cache sharing:**
```
Compaction turn:
  cache_creation: 50,000 tokens × $6.25/M = $0.31
Next turn:
  cache_creation: 50,000 tokens × $6.25/M = $0.31
Total: $0.62
```

**With cache sharing:**
```
Compaction turn:
  cache_read: 50,000 tokens × $0.50/M = $0.025
Next turn:
  cache_read: 50,000 tokens × $0.50/M = $0.025
Total: $0.05

Savings: 92%
```

---

## Performance Analysis

### Cache Efficiency Metrics

| Metric | Formula | Good | Excellent |
|--------|---------|------|-----------|
| Hit Rate | cache_read / total_input | > 60% | > 85% |
| Creation Ratio | cache_creation / total_input | < 30% | < 10% |
| Savings % | (hypothetical - actual) / hypothetical | > 50% | > 80% |

### Cache Invalidation Frequency

| Trigger | Frequency | Impact |
|---------|-----------|--------|
| New message | Every turn | Rolling cache extends |
| Tool add/remove | Rare | Global cache invalidated |
| CLAUDE.md edit | Per session | Dynamic section invalidated |
| Model change | Per session | Full cache invalidated |
| Compaction | When threshold exceeded | Cache prefix potentially lost |

---

## Algorithm 7: Cold Cache Detection

### The Problem

When the cache is "cold" (few or no cache hits), speculative operations like prompt suggestions waste tokens. The system needs to detect cold cache states to optimize behavior.

### The Solution

```javascript
// ============================================
// isCacheCold - Detect cold cache state
// Location: chunks.148.mjs:2253-2262
// ============================================

// ORIGINAL (for source lookup):
function YBY(A) {
    if (!A) return !1;
    let q = A.message.usage,
        K = q.input_tokens ?? 0,
        Y = q.cache_read_input_tokens ?? 0,
        z = q.cache_creation_input_tokens ?? 0,
        _ = K + Y + z;
    if (_ === 0) return !1;
    return z / _ > KBY
}

// READABLE (for understanding):
function isCacheCold(assistantMessage) {
    // No message means no data to analyze
    if (!assistantMessage) return false;

    let usage = assistantMessage.message.usage;

    // Extract token counts with null safety
    let inputTokens = usage.input_tokens ?? 0;
    let cacheReadTokens = usage.cache_read_input_tokens ?? 0;
    let cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;

    // Calculate total input tokens processed
    let totalTokens = inputTokens + cacheReadTokens + cacheCreationTokens;
    if (totalTokens === 0) return false;

    // Cache is "cold" if > 50% of tokens are cache creation (building new cache)
    let creationRatio = cacheCreationTokens / totalTokens;
    return creationRatio > CACHE_COLD_THRESHOLD;  // KBY = 0.5
}

// Mapping: YBY->isCacheCold, A->assistantMessage, q->usage,
//   K->inputTokens, Y->cacheReadTokens, z->cacheCreationTokens, _->totalTokens,
//   KBY->CACHE_COLD_THRESHOLD (0.5)
```

### Threshold Constant

```javascript
// ============================================
// CACHE_COLD_THRESHOLD - Cold cache detection threshold
// Location: chunks.148.mjs:2367
// ============================================

KBY = 0.5  // Cache is cold when > 50% of tokens are cache creation
```

### Decision Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLD CACHE DETECTION                                      │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │ Assistant       │
                        │ Message exists? │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
               ┌─────────┐               ┌─────────┐
               │   NO    │               │   YES   │
               └────┬────┘               └────┬────┘
                    │                         │
                    ▼                         ▼
           ┌─────────────────┐      ┌─────────────────────────┐
           │ Return FALSE    │      │ Calculate:              │
           │ (no data)       │      │ creationRatio =         │
           └─────────────────┘      │   cache_creation /      │
                                    │   (input + cache_read + │
                                    │    cache_creation)      │
                                    └───────────┬─────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │                       │
                                    ▼                       ▼
                           ┌─────────────────┐   ┌─────────────────┐
                           │ creationRatio   │   │ creationRatio   │
                           │ > 0.50          │   │ ≤ 0.50          │
                           └────────┬────────┘   └────────┬────────┘
                                    │                     │
                                    ▼                     ▼
                          ┌─────────────────┐   ┌─────────────────┐
                          │ Return TRUE     │   │ Return FALSE    │
                          │ (cold cache)    │   │ (warm cache)    │
                          └─────────────────┘   └─────────────────┘
```

### Why 50% Threshold

**Design rationale:**

1. **Below 50% creation** - Significant cache reuse occurring (cache_read tokens present)
2. **Above 50% creation** - Mostly creating new cache entries, indicating:
   - First turn in session
   - Recent cache invalidation (CLAUDE.md edit, tool change)
   - New conversation topic

**Why this matters:**

| Cache State | Creation Ratio | Behavior |
|-------------|---------------|----------|
| Cold | > 50% | Suppress speculative operations |
| Warm | 25-50% | Normal operation |
| Hot | < 25% | Aggressive caching benefits |

**What gets suppressed when cold:**
- Prompt suggestions (speculative LLM calls)
- Background summarization
- Proactive indexing

---

## Algorithm 8: Cache Reference Injection

### The Problem

When messages are compacted, the API's cache contains old content that should be invalidated. The `cache_edits` block tells the API which cached content is obsolete. But to reference cached content, we need unique identifiers: `cache_reference` fields.

### The Solution

```javascript
// ============================================
// Cache reference injection into tool_result blocks
// Location: chunks.171.mjs:771-794
// ============================================

// During applyCacheBreakpointsToMessages (z9z):

if (cachingEnabled) {
    // Find the last message that has cache_control
    let lastCacheControlIndex = -1;
    for (let i = 0; i < formattedMessages.length; i++) {
        let msg = formattedMessages[i];
        if (Array.isArray(msg.content)) {
            for (let block of msg.content) {
                if (block && typeof block === "object" && "cache_control" in block) {
                    lastCacheControlIndex = i;
                }
            }
        }
    }

    // Add cache_reference to all tool_result blocks BEFORE the cache breakpoint
    if (lastCacheControlIndex >= 0) {
        for (let i = 0; i < lastCacheControlIndex; i++) {
            let msg = formattedMessages[i];

            // Only process user messages with array content
            if (msg.role !== "user" || !Array.isArray(msg.content)) continue;

            for (let j = 0; j < msg.content.length; j++) {
                let block = msg.content[j];

                // Add cache_reference to tool_result blocks
                if (block && isToolResultBlock(block)) {
                    msg.content[j] = Object.assign({}, block, {
                        cache_reference: block.tool_use_id
                    });
                }
            }
        }
    }
}
```

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CACHE REFERENCE INJECTION                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Before injection:
┌───────────────────────────────────────────────────────────────────────────────┐
│ Messages:                                                                     │
│ [0] user: "First message"                                                     │
│ [1] assistant: "Response"                                                     │
│ [2] user: [                                                                   │
│       { type: "tool_use", id: "toolu_123" },                                  │
│       { type: "tool_result", tool_use_id: "toolu_123", content: "..." }       │
│     ]                                                                         │
│ [3] assistant: "Response with tool"                                           │
│ [4] user: "Latest message" ← cache_control here                              │
└───────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
After injection:
┌───────────────────────────────────────────────────────────────────────────────┐
│ Messages:                                                                     │
│ [0] user: "First message"                                                     │
│ [1] assistant: "Response"                                                     │
│ [2] user: [                                                                   │
│       { type: "tool_use", id: "toolu_123" },                                  │
│       {                                                                        │
│         type: "tool_result",                                                  │
│         tool_use_id: "toolu_123",                                             │
│         content: "...",                                                       │
│         cache_reference: "toolu_123"  ← ADDED                                │
│       }                                                                        │
│     ]                                                                         │
│ [3] assistant: "Response with tool"                                           │
│ [4] user: "Latest message" ← cache_control here                              │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Why Only Before Cache Breakpoint

**Design rationale:**

1. **Messages after breakpoint** - Will be cached fresh, no need for reference
2. **Messages before breakpoint** - Already cached, may need to be deleted
3. **Only tool_result blocks** - These are the primary cached content that compaction removes

### Integration with cache_edits

```javascript
// ============================================
// How cache_edits uses cache_reference
// ============================================

// When compaction occurs, a cache_edits block is created:
{
    type: "cache_edits",
    edits: [
        {
            cache_reference: "toolu_123",  // Matches the injected reference
            operation: "delete"
        },
        {
            cache_reference: "toolu_456",
            operation: "delete"
        }
    ]
}

// The API uses this to:
// 1. Identify which cached content is now obsolete
// 2. Remove it from the cache efficiently
// 3. Avoid cache pollution from stale content
```

---

## Algorithm 9: Breakpoint Index Edge Cases

### The Problem

The simple formula `messages.length - 1` or `messages.length - 2` has edge cases that need handling.

### Edge Case Analysis

```javascript
// ============================================
// Breakpoint index edge cases
// Location: chunks.171.mjs:727
// ============================================

let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;
```

### Edge Cases Table

| Scenario | Message Count | skipCacheWrite | Index | Behavior |
|----------|---------------|----------------|-------|----------|
| Normal turn | 5 | false | 4 | Last message gets cache |
| First turn | 1 | false | 0 | Only message gets cache |
| skipCacheWrite | 5 | true | 3 | Second-to-last gets cache |
| skipCacheWrite + 1 message | 1 | true | -1 | **Edge case: No cache!** |
| Empty messages | 0 | any | -2 or -1 | **Edge case: Invalid** |

### Edge Case Handling

```javascript
// How the code handles edge cases:

// Case 1: Empty or single message with skipCacheWrite
if (messages.length === 0) {
    // No messages to cache - handled by early return
    return [];
}

if (messages.length === 1 && skipCacheWrite) {
    // With skipCacheWrite and only 1 message:
    // index = 1 - 2 = -1 (invalid)
    // The condition `M === O` (index === breakpointIndex) never matches
    // Result: No cache_control is applied (correct behavior)
}

// Case 2: Very short conversations
// The algorithm still works correctly:
// - 1 message: index 0, cache on that message
// - 2 messages: index 1, cache on last
```

### Why skipCacheWrite = -2

**What skipCacheWrite means:**

When `skipCacheWrite = true`, the last message was just created by the current API call. Caching it would:
1. Create a cache entry for content we just processed
2. Not benefit us until the NEXT turn
3. Potentially waste cache storage

**Why -2 specifically:**

```
Turn N:   Messages [M1, M2, M3, M4, M5]
          M5 is from user, gets cache_control
          API creates cache for M1-M5 prefix

Turn N+1: Messages [M1, M2, M3, M4, M5, M6]  ← M6 is NEW assistant response
          If skipCacheWrite=true, we're generating M6
          We don't want to cache M6 yet
          So we cache M4 (index = 6-2 = 4)

          But wait, M5 already has cache_control from last turn!
          Actually, cache_control is re-applied each turn.
          M5 gets it because it's now second-to-last.
```

**The rolling window:**
- Turn N: M5 cached → M1-M5 in cache
- Turn N+1: M5 cached → M1-M5 still in cache, M6 new
- Turn N+2: M6 cached → M1-M6 in cache, M7 new

This creates a "rolling cache" where each turn extends the cached prefix.

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.170.mjs` | `Jn8`, `Ml`, `o3z` | System prompt splitting, cache_control creation, TTL decision |
| `chunks.171.mjs` | `z9z` | Message cache breakpoints |
| `chunks.147.mjs` | `Gqq` | Compaction with cache sharing |
| `chunks.57.mjs` | `Tm3`, `s21` | Token usage aggregation |
| `chunks.82.mjs` | `wT9`, `OT9` | Cost calculation |
| `chunks.148.mjs` | `isCacheCold` | Cold cache detection |

---

## See Also

- [overview.md](./overview.md) - Prompt cache system overview
- [cache_placement.md](./cache_placement.md) - Cache breakpoint placement details
- [ttl_scope_logic.md](./ttl_scope_logic.md) - TTL and scope decision trees
- [compaction_integration.md](./compaction_integration.md) - Cache sharing during compaction
- [pricing_models.md](./pricing_models.md) - Cost calculation details