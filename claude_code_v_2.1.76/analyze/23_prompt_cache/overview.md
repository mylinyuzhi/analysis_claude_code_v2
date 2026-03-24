# Prompt Cache System

## Overview

Claude Code implements a sophisticated prompt caching strategy to minimize token re-processing costs when making repeated API calls. The system places `cache_control` markers on specific message and system prompt segments, allowing the Anthropic API to reuse previously processed token prefixes rather than recomputing them from scratch.

The caching system operates at three distinct layers:
1. **System prompt caching** -- splitting the system prompt into stable/dynamic segments with appropriate cache scopes
2. **Message-level caching** -- placing cache breakpoints on recent conversation messages
3. **Tool schema caching** -- caching stable tool definitions via a designated "cache marker" tool

A prompt hash is also computed for billing attribution, using characters from the first user message combined with the application version.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `createCacheControl` (Ml) - Builds a cache_control directive object with scope and TTL
- `isPromptCachingEnabled` (IGq) - Checks if prompt caching is active for a given model
- `shouldUse1HourTTL` (o3z) - Determines if 1-hour TTL should be used based on OAuth status
- `applyCacheBreakpointsToMessages` (z9z) - Adds cache markers to conversation messages
- `buildSystemPromptWithCache` (_9z) - Converts system prompt strings into cache-annotated blocks
- `splitSystemPromptForCache` (Jn8) - Splits system prompt into segments with cache scope assignments
- `formatUserMessageForCache` (s3z) - Formats a user message with optional cache_control
- `formatAssistantMessageForCache` (t3z) - Formats an assistant message with optional cache_control
- `getAttributionHeader` (m21) - Builds the x-anthropic-billing-header string
- `calculatePromptHash` (zO8) - Computes a short hash for billing attribution
- `getFirstUserMessageText` (pu3) - Extracts the first user message text for hash input
- `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (S_6) - Sentinel marker for prompt splitting

---

## Cache Architecture

### What Gets Cached and Why

The Anthropic Messages API supports prompt caching by recognizing `cache_control` markers on content blocks. When the same token prefix is encountered across requests, the API can skip re-processing those tokens, resulting in:
- **Cost reduction**: Cached input tokens are billed at a fraction of the normal rate
- **Latency reduction**: Less computation per request when cache hits occur

Claude Code strategically places these markers on three categories of content:

1. **System prompt blocks** -- The system prompt is the most stable part of the request. It only changes when the model, tools, or configuration changes. Most of it can be cached "globally" (shared across all sessions for an organization) or at "org" scope.

2. **Recent conversation messages** -- The last few messages receive cache breakpoints. This is because earlier messages are stable across successive turns, while the most recent ones are new.

3. **Tool definitions** -- When MCP tools or deferred tools are in use, a single stable tool is designated as the "cache marker" tool to anchor the tool schema cache.

### Cache Scopes

The system supports multiple cache scopes:
- **No scope** (default `ephemeral`): Standard per-session caching with a 5-minute TTL
- **`global` scope**: Shared across all sessions and users within the organization; requires the `prompt-caching-scope-2026-01-05` beta
- **`org` scope**: Shared within an organization, used for system prompt blocks

---

## Key Design Decisions

### Why Three-Layer Caching?

The separation into system prompt, messages, and tools layers is deliberate:

| Layer | Stability | Cache Strategy | Rationale |
|-------|-----------|----------------|-----------|
| System Prompt | Highly stable | Global/Org scope | Changes only on config/tool updates |
| Messages | Moderately stable | Rolling cache | Last message is "frontier", earlier ones are cached |
| Tool Schemas | Stable | Global scope (single anchor tool) | MCP tools rarely change |

**Alternative considered:** Single cache marker at the end of the entire request.
**Why rejected:** This would force re-caching of everything when just one part changes. The three-layer approach allows each layer to be cached independently.

### Why Last Message Gets Cache Breakpoint?

```javascript
let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;
```

**The rolling window strategy:**
1. Turn N: Messages [M0, M1, M2] - M2 gets cache_control
2. Turn N+1: Messages [M0, M1, M2, M3] - M3 gets cache_control
3. Result: M0, M1, M2 are now cache hits

**Why not the first message?**
- The first message is already "behind" the newest content
- Cache hit rate would be lower because the prefix changes more often
- The API caches from the beginning up to the cache_control marker

**Why skipCacheWrite uses length-2:**
- `skipCacheWrite: true` means the last message is new (just created)
- There's no point caching a message that was just generated
- Caching the second-to-last preserves the rolling window

### Why Global Scope Requires Feature Flag?

```javascript
let globalCacheEnabled = isFirstPartyProvider() && (
    parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
    getFeatureFlag("tengu_system_prompt_global_cache", false)
);
```

**Design rationale:**
1. **Bedrock/Vertex don't support global scope** - Their APIs don't have the beta headers
2. **Privacy considerations** - Global scope shares cache across all org users
3. **Rollout control** - Feature flag enables A/B testing
4. **Experimental nature** - The beta header `prompt-caching-scope-2026-01-05` may change

### Why 1-Hour TTL is Allowlist-Controlled?

```javascript
let allowlist = getFeatureFlag("tengu_prompt_cache_1h_config", {}).allowlist ?? [];
return querySource !== undefined && allowlist.some((pattern) =>
    pattern.endsWith("*") ? querySource.startsWith(pattern.slice(0, -1)) : querySource === pattern
);
```

**Business logic:**
- Longer TTL = higher server-side cache storage costs
- Allowlist enables gradual rollout to specific use cases
- High-value queries (main REPL) get priority access
- Lower-value queries (prompt suggestions) use default TTL

**Wildcard support rationale:**
- `repl_*` matches `repl_main_thread`, `repl_background`, etc.
- `subagent_*` matches all subagent types
- Simplifies configuration while maintaining granular control

### Why Billing Header is Not Cached?

```javascript
if (Y) w.push({
    text: Y,  // billing header
    cacheScope: null  // explicitly NOT cached
});
```

**Rationale:**
1. **Contains session-specific hash** - Changes every session
2. **Contains entrypoint** - Changes based on invocation method
3. **Contains workload type** - Changes based on swarm/MCP mode
4. **Caching would cause cache invalidation** for the entire system prompt

### Why Thinking Blocks Are Excluded from Cache?

```javascript
...(block.type !== "thinking" && block.type !== "redacted_thinking" && cachingEnabled
    ? { cache_control: createCacheControl({ querySource }) }
    : {})
```

**Technical reasons:**
1. **Thinking content is non-deterministic** - Same prompt may generate different reasoning
2. **Token savings minimal** - Thinking blocks are typically small relative to output
3. **Privacy/security** - Redacted thinking may contain sensitive information
4. **API behavior** - Cached thinking could cause unexpected model behavior

---

### Cache Pricing (v2.1.76)

```javascript
// ============================================
// Pricing constants - Cost per million tokens
// Location: chunks.82.mjs:1487-1509
// ============================================

// Sonnet pricing (DD1)
const SONNET_PRICING = {
    inputTokens: 3,           // $3/M input
    outputTokens: 15,         // $15/M output
    promptCacheWriteTokens: 3.75,  // $3.75/M cache write
    promptCacheReadTokens: 0.3,    // $0.30/M cache read (10x cheaper!)
    webSearchRequests: 0.01
};

// Opus pricing (zT9) - Fast mode
const OPUS_FAST_PRICING = {
    inputTokens: 30,
    outputTokens: 150,
    promptCacheWriteTokens: 37.5,
    promptCacheReadTokens: 3,  // Still 10x cheaper than input
    webSearchRequests: 0.01
};
```

**Key insight:** Cache reads are ~10x cheaper than regular input tokens, making aggressive caching highly valuable for cost optimization.

---

## Core Functions

### createCacheControl (Ml)

**What it does:** Builds a `cache_control` directive object with optional TTL and scope settings.

```javascript
// ============================================
// createCacheControl - Builds cache_control directive with TTL and scope
// Location: chunks.170.mjs:1849-1862
// ============================================

// ORIGINAL (for source lookup):
function Ml({
    scope: A,
    querySource: q
} = {}) {
    return {
        type: "ephemeral",
        ...o3z(q) ? {
            ttl: "1h"
        } : {},
        ...A === "global" ? {
            scope: A
        } : {}
    }
}

// READABLE (for understanding):
function createCacheControl({ scope, querySource } = {}) {
    return {
        type: "ephemeral",
        // OAuth users NOT on overage get extended 1-hour TTL
        ...shouldUse1HourTTL(querySource) ? { ttl: "1h" } : {},
        // Only include scope if explicitly "global"
        ...scope === "global" ? { scope } : {}
    };
}

// Mapping: Ml->createCacheControl, A->scope, q->querySource, o3z->shouldUse1HourTTL
```

**Why this approach:**
- OAuth subscription users (Pro, Max, Enterprise, Team) who are NOT in overage mode get a 1-hour cache TTL
- API key users and overage users get the default 5-minute TTL
- The `global` scope is only applied when explicitly requested, because global caches are shared across sessions

---

### isPromptCachingEnabled (IGq)

**What it does:** Determines whether prompt caching should be enabled for a given model, checking multiple environment variable overrides.

```javascript
// ============================================
// isPromptCachingEnabled - Per-model prompt caching gate
// Location: chunks.170.mjs:1832-1847
// ============================================

// ORIGINAL (for source lookup):
function IGq(A) {
    if (t6(process.env.DISABLE_PROMPT_CACHING)) return !1;
    if (t6(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
        let q = lH();
        if (A === q) return !1
    }
    if (t6(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
        let q = wT6();
        if (A === q) return !1
    }
    if (t6(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
        let q = GN();
        if (A === q) return !1
    }
    return !0
}

// READABLE (for understanding):
function isPromptCachingEnabled(model) {
    // Global disable - affects ALL models
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING)) return false;

    // Per-model disables
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
        if (model === getHaikuModel()) return false;
    }
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
        if (model === getSonnetModel()) return false;
    }
    if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
        if (model === getOpusModel()) return false;
    }
    return true;
}

// Mapping: IGq->isPromptCachingEnabled, A->model, t6->parseBoolean,
//   lH->getHaikuModel, wT6->getSonnetModel, GN->getOpusModel
```

**Why per-model controls:** Different models have different cache pricing. For development/testing scenarios, disabling caching on specific models allows operators to compare cached vs uncached performance and costs.

---

### shouldUse1HourTTL (o3z)

**What it does:** Determines if the 1-hour TTL should be applied based on user authentication status and query source allowlist.

```javascript
// ============================================
// shouldUse1HourTTL - Check if user qualifies for extended cache TTL
// Location: chunks.170.mjs:1864-1870
// ============================================

// ORIGINAL (for source lookup):
function o3z(A) {
    if (QA() === "bedrock" && t6(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)) return !0;
    if (!(iA() && !Jf.isUsingOverage)) return !1;
    let K = eu1();
    if (K === null) K = w8("tengu_prompt_cache_1h_config", {}).allowlist ?? [], Am1(K);
    return A !== void 0 && K.some((Y) => Y.endsWith("*") ? A.startsWith(Y.slice(0, -1)) : A === Y)
}

// READABLE (for understanding):
function shouldUse1HourTTL(querySource) {
    // Bedrock: Enable if env var is set
    if (getProvider() === "bedrock" && parseBoolean(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)) {
        return true;
    }

    // First-party: Check OAuth status and overage
    if (!(isOAuthUser() && !rateLimitState.isUsingOverage)) {
        return false;  // API key users or overage users get 5-minute TTL
    }

    // Check allowlist
    let allowlist = get1HourTTLAllowlist();
    if (allowlist === null) {
        allowlist = getFeatureFlag("tengu_prompt_cache_1h_config", {}).allowlist ?? [];
        set1HourTTLAllowlist(allowlist);
    }

    // Match against query source (supports wildcard matching)
    return querySource !== undefined && allowlist.some((pattern) =>
        pattern.endsWith("*")
            ? querySource.startsWith(pattern.slice(0, -1))
            : querySource === pattern
    );
}

// Mapping: o3z->shouldUse1HourTTL, A->querySource, QA->getProvider, t6->parseBoolean,
//   iA->isOAuthUser, Jf->rateLimitState, eu1->get1HourTTLAllowlist, Am1->set1HourTTLAllowlist
```

**Why this complex logic:**
- Bedrock users have a simple env var toggle
- First-party OAuth users get longer TTL only if NOT in overage (billing protection)
- The allowlist enables A/B testing of 1-hour TTL for specific query sources

---

### applyCacheBreakpointsToMessages (z9z)

**What it does:** Iterates over normalized messages and adds `cache_control` markers. Also handles `cache_edits` blocks for content deletion.

```javascript
// ============================================
// applyCacheBreakpointsToMessages - Mark messages for caching with cache_edits support
// Location: chunks.171.mjs:721-796
// ============================================

// ORIGINAL (for source lookup):
function z9z(A, q, K, Y = !1, z, _, w = !1) {
    d("tengu_api_cache_breakpoints", {
        totalMessageCount: A.length,
        cachingEnabled: q,
        skipCacheWrite: w
    });
    let O = w ? A.length - 2 : A.length - 1,
        $ = A.map((J, M) => {
            let D = M === O;
            if (J.type === "user") return s3z(J, D, q, K);
            return t3z(J, D, q, K)
        });
    if (!Y) return $;
    // ... cache_edits handling for compaction ...
}

// READABLE (for understanding):
function applyCacheBreakpointsToMessages(
    messages,
    cachingEnabled,
    querySource,
    hasCompactionEdits = false,
    userMessageEdits,
    lastUserMessageEdit,
    skipCacheWrite = false
) {
    // Emit telemetry
    telemetry("tengu_api_cache_breakpoints", {
        totalMessageCount: messages.length,
        cachingEnabled,
        skipCacheWrite
    });

    // Determine which message gets the cache breakpoint
    // If skipCacheWrite, we skip the last message (it's new)
    let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;

    // Apply cache_control to each message
    let formattedMessages = messages.map((message, index) => {
        let shouldCache = index === cacheBreakpointIndex;
        if (message.type === "user") {
            return formatUserMessageForCache(message, shouldCache, cachingEnabled, querySource);
        }
        return formatAssistantMessageForCache(message, shouldCache, cachingEnabled, querySource);
    });

    // Handle cache_edits from compaction (if enabled)
    if (!hasCompactionEdits) return formattedMessages;
    // ... cache_edits injection logic ...

    return formattedMessages;
}

// Mapping: z9z->applyCacheBreakpointsToMessages, A->messages, q->cachingEnabled,
//   K->querySource, Y->hasCompactionEdits, z->userMessageEdits, _->lastUserMessageEdit,
//   w->skipCacheWrite, s3z->formatUserMessageForCache, t3z->formatAssistantMessageForCache
```

**Key insight:** The `cacheBreakpointIndex` calculation is crucial - when `skipCacheWrite` is true, the newest message is excluded from caching because it's fresh content that won't benefit from caching.

---

### formatUserMessageForCache (s3z)

**What it does:** Formats a user message with optional `cache_control`, handling both string and array content.

```javascript
// ============================================
// formatUserMessageForCache - Format user message with cache_control
// Location: chunks.170.mjs:1928-1957
// ============================================

// ORIGINAL (for source lookup):
function s3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "user",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "user",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "user",
        content: Array.isArray(A.message.content) ? [...A.message.content] : A.message.content
    }
}

// READABLE (for understanding):
function formatUserMessageForCache(message, shouldApplyCache = false, cachingEnabled, querySource) {
    // Apply cache_control only if conditions are met
    if (shouldApplyCache) {
        if (typeof message.message.content === "string") {
            // String content: wrap in array with cache_control on the text block
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: message.message.content,
                    ...(cachingEnabled ? { cache_control: createCacheControl({ querySource }) } : {})
                }]
            };
        } else {
            // Array content: add cache_control to the LAST content block
            return {
                role: "user",
                content: message.message.content.map((block, index) => ({
                    ...block,
                    ...(index === message.message.content.length - 1 && cachingEnabled
                        ? { cache_control: createCacheControl({ querySource }) }
                        : {})
                }))
            };
        }
    }

    // No caching: return content as-is
    return {
        role: "user",
        content: Array.isArray(message.message.content)
            ? [...message.message.content]
            : message.message.content
    };
}

// Mapping: s3z->formatUserMessageForCache, A->message, q->shouldApplyCache,
//   K->cachingEnabled, Y->querySource, Ml->createCacheControl
```

**Why cache_control goes on the last block:** The Anthropic API caches everything UP TO the block with `cache_control`. By placing it on the last content block, we maximize the cached prefix.

---

### formatAssistantMessageForCache (t3z)

**What it does:** Formats an assistant message with optional `cache_control`, excluding thinking blocks.

```javascript
// ============================================
// formatAssistantMessageForCache - Format assistant message with cache_control
// Location: chunks.170.mjs:1959-1988
// ============================================

// ORIGINAL (for source lookup):
function t3z(A, q = !1, K, Y) {
    if (q)
        if (typeof A.message.content === "string") return {
            role: "assistant",
            content: [{
                type: "text",
                text: A.message.content,
                ...K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {}
            }]
        };
        else return {
            role: "assistant",
            content: A.message.content.map((z, _) => ({
                ...z,
                ..._ === A.message.content.length - 1 && z.type !== "thinking" && z.type !== "redacted_thinking" ? K ? {
                    cache_control: Ml({
                        querySource: Y
                    })
                } : {} : {}
            }))
        };
    return {
        role: "assistant",
        content: A.message.content
    }
}

// READABLE (for understanding):
function formatAssistantMessageForCache(message, shouldApplyCache = false, cachingEnabled, querySource) {
    if (shouldApplyCache) {
        if (typeof message.message.content === "string") {
            return {
                role: "assistant",
                content: [{
                    type: "text",
                    text: message.message.content,
                    ...(cachingEnabled ? { cache_control: createCacheControl({ querySource }) } : {})
                }]
            };
        } else {
            // Array content: add cache_control to last NON-THINKING block
            return {
                role: "assistant",
                content: message.message.content.map((block, index) => ({
                    ...block,
                    // Skip thinking blocks - they can't be cached
                    ...(index === message.message.content.length - 1
                         && block.type !== "thinking"
                         && block.type !== "redacted_thinking"
                         && cachingEnabled
                        ? { cache_control: createCacheControl({ querySource }) }
                        : {})
                }))
            };
        }
    }
    return { role: "assistant", content: message.message.content };
}

// Mapping: t3z->formatAssistantMessageForCache, A->message, q->shouldApplyCache,
//   K->cachingEnabled, Y->querySource, Ml->createCacheControl
```

**Key insight:** Thinking blocks (`thinking` and `redacted_thinking`) are explicitly excluded from cache_control because they contain model reasoning that shouldn't be cached.

---

## Billing Attribution

### getAttributionHeader (m21)

**What it does:** Builds the `x-anthropic-billing-header` string containing version, entrypoint, and workload identifiers.

```javascript
// ============================================
// getAttributionHeader - Build billing attribution header
// Location: chunks.56.mjs:1520-1528
// ============================================

// ORIGINAL (for source lookup):
function m21(A) {
    let q = `${{VERSION:"2.1.76",...}.VERSION}.${A}`,
        K = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown",
        Y = " cch=a9396;",
        z = oA1(),
        _ = z ? ` cc_workload=${z};` : "",
        w = `x-anthropic-billing-header: cc_version=${q}; cc_entrypoint=${K};${Y}${_}`;
    return k(`attribution header ${w}`), w
}

// READABLE (for understanding):
function getAttributionHeader(promptHash) {
    let version = `2.1.76.${promptHash}`;  // Version + 3-char hash
    let entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown";
    let cch = " cch=a9396;";  // Cache header identifier
    let workload = getWorkloadType();
    let workloadPart = workload ? ` cc_workload=${workload};` : "";

    let header = `x-anthropic-billing-header: cc_version=${version}; cc_entrypoint=${entrypoint};${cch}${workloadPart}`;
    debugLog(`attribution header ${header}`);
    return header;
}

// Mapping: m21->getAttributionHeader, A->promptHash, K->entrypoint, Y->cch,
//   z->workload, oA1->getWorkloadType
```

---

### calculatePromptHash (zO8)

**What it does:** Generates a short 3-character hex hash from the first user message for billing attribution.

```javascript
// ============================================
// calculatePromptHash - Generate 3-char billing hash
// Location: chunks.56.mjs:1562-1565
// ============================================

// ORIGINAL (for source lookup):
function zO8(A, q) {
    let Y = [4, 7, 20].map((w) => A[w] || "0").join(""),
        z = `${Fu3}${Y}${q}`;
    return gu3("sha256").update(z).digest("hex").slice(0, 3)
}

// READABLE (for understanding):
function calculatePromptHash(firstUserText, version) {
    // Sample characters at specific positions (or "0" if out of bounds)
    let sampleChars = [4, 7, 20].map((pos) => firstUserText[pos] || "0").join("");

    // Concatenate: salt + sample + version
    let hashInput = `${SALT}${sampleChars}${version}`;  // SALT = "59cf53e54c78"

    // SHA-256 hash, take first 3 hex chars
    return crypto.createHash("sha256").update(hashInput).digest("hex").slice(0, 3);
}

// Mapping: zO8->calculatePromptHash, A->firstUserText, q->version,
//   Fu3->SALT, gu3->crypto.createHash
```

**Why this approach:** The hash provides a lightweight fingerprint for billing analytics without exposing conversation content. Sampling only 3 character positions preserves privacy while providing enough entropy to distinguish conversations.

---

### getFirstUserMessageText (pu3)

**What it does:** Extracts text content from the first user message in a conversation.

```javascript
// ============================================
// getFirstUserMessageText - Extract first user message text
// Location: chunks.56.mjs:1550-1560
// ============================================

// ORIGINAL (for source lookup):
function pu3(A) {
    let q = A.find((Y) => Y.type === "user");
    if (!q) return "";
    let K = q.message.content;
    if (typeof K === "string") return K;
    if (Array.isArray(K)) {
        let Y = K.find((z) => z.type === "text");
        if (Y && Y.type === "text") return Y.text
    }
    return ""
}

// READABLE (for understanding):
function getFirstUserMessageText(messages) {
    let firstUser = messages.find((msg) => msg.type === "user");
    if (!firstUser) return "";

    let content = firstUser.message.content;
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        let textBlock = content.find((block) => block.type === "text");
        if (textBlock && textBlock.type === "text") return textBlock.text;
    }
    return "";
}

// Mapping: pu3->getFirstUserMessageText, A->messages
```

---

## Integration with System Reminders

System reminders are injected as user messages with `isMeta: true`. They interact with the cache system in important ways:

### Cache Placement for Reminders

```javascript
// From chunks.171.mjs:721-796
// Reminders are positioned BEFORE the real user message
// The cache breakpoint goes on the LAST user message (the real one, not reminders)

let cacheBreakpointIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1;
```

**Why this matters:**
- System reminders are meta-messages that shouldn't affect cache placement
- The cache breakpoint should be on the user's actual input, not on injected context
- This ensures cache hits are maximized even when reminders change

### Token Usage Tracking

System reminders include token usage information that shows cache statistics:

```javascript
// From chunks.147.mjs:1574-1576 (compaction telemetry)
compactionCacheReadTokens: usage?.cache_read_input_tokens ?? 0,
compactionCacheCreationTokens: usage?.cache_creation_input_tokens ?? 0,
compactionTotalTokens: usage ? usage.input_tokens + ... : 0,
```

---

## Integration with Compact Mode

The compaction system shares cache prefixes across sessions when the `tengu_compact_cache_prefix` feature flag is enabled:

```javascript
// From chunks.147.mjs:1760-1790
let useCachePrefix = getFeatureFlag("tengu_compact_cache_prefix", false);

if (useCachePrefix) {
    // Try to reuse the cache prefix from the parent session
    let sharedPrefix = await tryGetSharedCachePrefix(sessionId);
    if (sharedPrefix && isValidCachePrefix(sharedPrefix)) {
        telemetry("tengu_compact_cache_sharing_success", { sessionId });
        return sharedPrefix;
    }
}
```

**Why cache sharing matters:**
- Compaction creates a new session with summarized context
- Without cache sharing, the first query after compaction has 0% cache hit rate
- With sharing, the summarized prefix can reuse the parent session's cache
- This dramatically reduces latency and cost immediately after compaction

---

## Token Usage Aggregation

### aggregateTokenUsage (Tm3)

**What it does:** Accumulates token usage from API responses into a running total.

```javascript
// ============================================
// aggregateTokenUsage - Accumulate token usage from API response
// Location: chunks.57.mjs:3-15
// ============================================

// ORIGINAL (for source lookup):
function Tm3(A, q, K) {
    let Y = Ju1(K) ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };
    return Y.inputTokens += q.input_tokens, Y.outputTokens += q.output_tokens,
           Y.cacheReadInputTokens += q.cache_read_input_tokens ?? 0,
           Y.cacheCreationInputTokens += q.cache_creation_input_tokens ?? 0,
           Y.webSearchRequests += q.server_tool_use?.web_search_requests ?? 0,
           Y.costUSD += A, Y.contextWindow = uM(K, Zj()),
           Y.maxOutputTokens = oa(K).default, Y
}

// READABLE (for understanding):
function aggregateTokenUsage(cost, usage, model) {
    let current = getSessionTokenTracker(model) ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };

    // Accumulate usage
    current.inputTokens += usage.input_tokens;
    current.outputTokens += usage.output_tokens;
    current.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
    current.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
    current.webSearchRequests += usage.server_tool_use?.web_search_requests ?? 0;
    current.costUSD += cost;
    current.contextWindow = getContextWindowSize(model, getDefaultContextVariant());
    current.maxOutputTokens = getModelOutputLimits(model).default;

    return current;
}

// Mapping: Tm3->aggregateTokenUsage, A->cost, q->usage, K->model,
//   Ju1->getSessionTokenTracker, uM->getContextWindowSize, Zj->getDefaultContextVariant,
//   oa->getModelOutputLimits
```

---

## Cost Calculation

### calculateApiCost (wT9)

**What it does:** Calculates the monetary cost of an API call including cache tokens.

```javascript
// ============================================
// calculateApiCost - Calculate API cost with cache tokens
// Location: chunks.82.mjs:1419-1421
// ============================================

// ORIGINAL (for source lookup):
function wT9(A, q) {
    return q.input_tokens / 1e6 * A.inputTokens +
           q.output_tokens / 1e6 * A.outputTokens +
           (q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens +
           (q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens +
           (q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}

// READABLE (for understanding):
function calculateApiCost(pricing, usage) {
    let inputCost = usage.input_tokens / 1e6 * pricing.inputTokens;
    let outputCost = usage.output_tokens / 1e6 * pricing.outputTokens;
    let cacheReadCost = (usage.cache_read_input_tokens ?? 0) / 1e6 * pricing.promptCacheReadTokens;
    let cacheWriteCost = (usage.cache_creation_input_tokens ?? 0) / 1e6 * pricing.promptCacheWriteTokens;
    let webSearchCost = (usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests;

    return inputCost + outputCost + cacheReadCost + cacheWriteCost + webSearchCost;
}

// Mapping: wT9->calculateApiCost, A->pricing, q->usage
```

**Key insight:** Cache read tokens are billed at ~10% of regular input tokens, making cache hits extremely cost-effective.

---

## Performance Characteristics

| Cache Type | Hit Rate | Cost Reduction |
|-----------|----------|---------------|
| System prompt (global) | ~90-95% in long sessions | ~70% of system prompt tokens |
| Recent messages | ~60-70% | Last 2 messages re-cached each turn |
| Tool schemas | ~85-90% | Entire tool list if stable |

**When caches miss:**
- System prompt: model change, tool additions, settings change
- Messages: always miss for the newest user message
- Tools: MCP server reconnect, dynamic tool registration

---

## Cache Initialization Flow

### Provider Detection

Before caching can be configured, the system must detect the API provider:

```javascript
// ============================================
// isFirstPartyProvider - Check if first-party API with beta support
// Location: chunks.176.mjs:1638-1640
// ============================================

// ORIGINAL (for source lookup):
function C_6() {
    return (QA() === "firstParty" || QA() === "foundry") && !t6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}

// READABLE (for understanding):
function isFirstPartyProvider() {
    let provider = getProvider();
    let isExperimentalBetasDisabled = parseBoolean(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS);

    // First-party or Foundry provider with experimental betas enabled
    return (provider === "firstParty" || provider === "foundry") && !isExperimentalBetasDisabled;
}

// Mapping: C_6->isFirstPartyProvider, QA->getProvider, t6->parseBoolean
```

### Global Cache Enablement

Global cache scope requires both first-party provider AND feature flag or environment variable:

```javascript
let globalCacheEnabled = isFirstPartyProvider() && (
    parseBoolean(process.env.CLAUDE_CODE_FORCE_GLOBAL_CACHE) ||
    getFeatureFlag("tengu_system_prompt_global_cache", false)
);
```

### 1-Hour TTL Allowlist Caching

The 1-hour TTL allowlist is fetched once from feature flags and cached globally:

```javascript
// ============================================
// get1HourTTLAllowlist / set1HourTTLAllowlist
// Location: chunks.1.mjs:3147-3153
// ============================================

function get1HourTTLAllowlist() {
    return globalState.promptCache1hAllowlist;
}

function set1HourTTLAllowlist(allowlist) {
    globalState.promptCache1hAllowlist = allowlist;
}
```

---

## Complete Cache Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CACHE INITIALIZATION                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. Detect Provider: isFirstPartyProvider()                                  │
│  2. Check Global Cache: env var + feature flag                               │
│  3. Fetch 1H TTL Allowlist: feature flag -> cache                            │
│  4. Check Per-Model Disable: DISABLE_PROMPT_CACHING_*                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM PROMPT BUILDING                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. Build prompt array with sections                                         │
│  2. Inject boundary marker if global cache enabled                           │
│  3. Calculate prompt hash for billing                                        │
│  4. Build attribution header                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CACHE MARKING DECISION                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  isPromptCachingEnabled(model)?                                              │
│       │                                                                      │
│       ├── NO → Skip all cache_control markers                               │
│       │                                                                      │
│       └── YES → Continue:                                                   │
│              │                                                               │
│              shouldUse1HourTTL(querySource)?                                 │
│                     │                                                        │
│                     ├── YES → TTL = "1h"                                    │
│                     └── NO  → TTL = default (5 min)                          │
│                                                                              │
│              isFirstPartyProvider() && globalCacheEnabled?                   │
│                     │                                                        │
│                     ├── YES → Check for tool-based or boundary-based        │
│                     │         Assign scope: "global" or "org"               │
│                     │                                                        │
│                     └── NO  → Default to "org" scope                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API REQUEST ASSEMBLY                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. splitSystemPromptForCache() → blocks with cacheScope                     │
│  2. buildSystemPromptWithCache() → API format with cache_control             │
│  3. applyCacheBreakpointsToMessages() → message cache markers               │
│  4. Handle cache_edits if compaction occurred                                │
│  5. Inject cache_reference for tool_result blocks                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API CALL & RESPONSE                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. Send request with cache_control markers                                  │
│  2. Receive response with usage stats                                        │
│  3. recordTokenUsage() → aggregate cache tokens                              │
│  4. Calculate cache hit rate for telemetry                                   │
│  5. Update UI with usage statistics                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DISABLE_PROMPT_CACHING` | Disable caching for ALL models |
| `DISABLE_PROMPT_CACHING_HAIKU` | Disable caching for Haiku only |
| `DISABLE_PROMPT_CACHING_SONNET` | Disable caching for Sonnet only |
| `DISABLE_PROMPT_CACHING_OPUS` | Disable caching for Opus only |
| `CLAUDE_CODE_FORCE_GLOBAL_CACHE` | Force global cache scope (testing) |
| `ENABLE_PROMPT_CACHING_1H_BEDROCK` | Enable 1-hour TTL for Bedrock users |
| `CLAUDE_CODE_ATTRIBUTION_HEADER` | Disable billing header (if "false") |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | Disable experimental beta features (affects global cache) |
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | Enable token usage in system reminders |

---

## Feature Flags

| Flag | Purpose |
|------|---------|
| `tengu_system_prompt_global_cache` | Enable global scope for system prompt caching |
| `tengu_prompt_cache_1h_config` | Configuration for 1-hour TTL allowlist |
| `tengu_attribution_header` | Enable/disable billing attribution header |
| `tengu_compact_cache_prefix` | Enable cache prefix sharing during compaction |

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.170.mjs` | `IGq`, `Ml`, `o3z`, `Jn8`, `s3z`, `t3z`, `Mn8` | Core caching functions, TTL logic, message formatting, cache_edits injection |
| `chunks.171.mjs` | `z9z`, `_9z`, `Y9z` | Message cache breakpoints, system prompt with cache, tool_result type guard |
| `chunks.56.mjs` | `m21`, `zO8`, `pu3`, `Bu3`, `Gm3`, `a21`, `gx6` | Billing header, prompt hash, usage formatting |
| `chunks.57.mjs` | `Tm3`, `s21` | Token usage aggregation and recording |
| `chunks.82.mjs` | `wT9`, `OT9`, `tg6` | Cost calculation, pricing lookup |
| `chunks.168.mjs` | `S_6` | System prompt boundary marker constant |
| `chunks.176.mjs` | `C_6` | First-party provider detection |
| `chunks.1.mjs` | `eu1`, `Am1` | 1-hour TTL allowlist management |
| `chunks.147.mjs` | `qmY`, `YmY` | Token usage and budget attachments for system reminders |

---

## Cache Hit Rate Calculation

### Formula (Verified from Source)

The cache hit rate is calculated to measure caching effectiveness:

```javascript
// ============================================
// Cache hit rate calculation
// Location: chunks.147.mjs:1781
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
    // If no cache read tokens, hit rate is 0
    if (usage.cache_read_input_tokens <= 0) {
        return 0;
    }

    // Total input tokens = cache read + cache creation + regular input
    let totalInputTokens =
        usage.cache_read_input_tokens +
        usage.cache_creation_input_tokens +
        usage.input_tokens;

    // Hit rate = cached tokens / total input tokens
    return usage.cache_read_input_tokens / totalInputTokens;
}
```

**Why this formula:**
- `cache_read_input_tokens` = tokens successfully retrieved from cache (hits)
- `cache_creation_input_tokens` = tokens written to cache (misses that build cache)
- `input_tokens` = regular input tokens processed without cache involvement
- The ratio shows what fraction of input processing was avoided via caching

### Cache Hit Rate Interpretation

| Hit Rate | Interpretation | Action |
|----------|----------------|--------|
| 0% | No cache hits | Check if caching is enabled, first request of session |
| 1-30% | Low hit rate | Short conversations, frequent prompt changes |
| 30-60% | Moderate hit rate | Normal for mixed workloads |
| 60-85% | Good hit rate | Effective caching, stable prompts |
| 85%+ | Excellent hit rate | Long sessions, stable system prompts, high reuse |

---

## Billing Header Flow

### Complete Attribution Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BILLING ATTRIBUTION FLOW                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  1. Extract First User Message Text (pu3)                                     │
│     - Find first user message in conversation                                │
│     - Extract text content (string or from text block)                       │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  2. Calculate Prompt Hash (zO8)                                               │
│     - Sample characters at positions [4, 7, 20]                              │
│     - Concatenate: SALT + sampled_chars + version                            │
│     - SHA-256 hash, take first 3 hex characters                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  3. Build Attribution Header (m21)                                            │
│     Format: x-anthropic-billing-header: cc_version=VER.HASH;                │
│             cc_entrypoint=ENTRYPOINT; cch=ID; cc_workload=TYPE;              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  4. Inject into System Prompt                                                 │
│     - Header added as first system prompt block                              │
│     - Gets cacheScope: null (not cached - changes per session)               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Header Components (Verified from Source)

```javascript
// ============================================
// Attribution header components
// Location: chunks.56.mjs:1520-1528
// ============================================

// Version format: "2.1.76.abc" where "abc" is 3-char hash
let version = `${VERSION}.${promptHash}`;  // "2.1.76.abc"

// Entrypoint values (from CLAUDE_CODE_ENTRYPOINT env var):
// - "cli" - CLI interactive mode
// - "sdk-ts" - TypeScript SDK
// - "sdk-py" - Python SDK
// - "sdk-cli" - SDK CLI mode
// - "remote" - Remote session
// - "local-agent" - Local agent mode
// - "mcp" - MCP CLI
// - "claude-vscode" - VS Code extension

// Cache header identifier (constant in source)
let cch = " cch=00000;";

// Workload types (optional):
// - "swarm" - Swarm/team mode
// - "mcp" - MCP server
// - undefined - Normal operation
```

---

## Cross-Functional Integration

### Integration with System Reminders (04_system_reminder)

The prompt cache system integrates with system reminders through token usage attachments:

```javascript
// ============================================
// getTokenUsageAttachment - Token usage in system reminders
// Location: chunks.147.mjs:1108-1118
// ============================================

// ORIGINAL (for source lookup):
function qmY(A, q) {
    if (!t6(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
    let K = OF(q),
        Y = Ck(A);
    return [{
        type: "token_usage",
        used: Y,
        total: K,
        remaining: K - Y
    }]
}

// READABLE (for understanding):
function getTokenUsageAttachment(toolUseContext, querySource) {
    // Feature flag check
    if (!parseBoolean(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) {
        return [];
    }

    let totalTokens = getTotalContextTokens(querySource);
    let usedTokens = calculateUsedTokens(toolUseContext);

    return [{
        type: "token_usage",
        used: usedTokens,
        total: totalTokens,
        remaining: totalTokens - usedTokens
    }];
}

// Mapping: qmY->getTokenUsageAttachment, A->toolUseContext, q->querySource,
//   t6->parseBoolean, OF->getTotalContextTokens, Ck->calculateUsedTokens
```

```javascript
// ============================================
// getBudgetUsdAttachment - Budget tracking in system reminders
// Location: chunks.147.mjs:1124-1134
// ============================================

// ORIGINAL (for source lookup):
function YmY(A) {
    if (A === void 0) return [];
    let q = LD(),
        K = A - q;
    return [{
        type: "budget_usd",
        used: q,
        total: A,
        remaining: K
    }]
}

// READABLE (for understanding):
function getBudgetUsdAttachment(budgetUSD) {
    if (budgetUSD === undefined) {
        return [];
    }

    let usedCost = getTotalSessionCost();
    let remaining = budgetUSD - usedCost;

    return [{
        type: "budget_usd",
        used: usedCost,
        total: budgetUSD,
        remaining: remaining
    }];
}

// Mapping: YmY->getBudgetUsdAttachment, A->budgetUSD, LD->getTotalSessionCost
```

### Integration with Compact Mode (07_compact)

During compaction, cache statistics are tracked and reported:

```javascript
// From chunks.147.mjs:1574-1582
// Compaction telemetry includes cache token tracking
{
    compactionCacheReadTokens: usage?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: usage?.cache_creation_input_tokens ?? 0,
    compactionTotalTokens: usage
        ? usage.input_tokens +
          (usage.cache_creation_input_tokens ?? 0) +
          (usage.cache_read_input_tokens ?? 0) +
          usage.output_tokens
        : 0,
    promptCacheSharingEnabled: isCacheSharingEnabled
}
```

### Integration with Auth (24_auth)

The TTL decision depends on authentication state:

| Auth State | TTL Behavior |
|------------|--------------|
| API Key user | 5-minute TTL (default) |
| OAuth user (normal) | Check allowlist for 1-hour TTL |
| OAuth user (overage) | 5-minute TTL (billing protection) |
| Bedrock user | 1-hour TTL if env var set |

### Integration with Model Selection (03_llm_core)

Model resolution affects pricing lookup for cache cost calculation:

```javascript
// From chunks.82.mjs:1423-1432
function getModelPricing(model, options) {
    let family = extractModelFamily(model);

    // Look up pricing from model family registry
    let pricing = MODEL_FAMILY_PRICING[family];

    if (!pricing) {
        // Log unknown model and fall back to default
        return MODEL_FAMILY_PRICING[extractModelFamily(getDefaultModel())] ?? SONNET_4_PRICING;
    }

    return pricing;
}
```

---

## Telemetry Events

| Event | Data | Purpose |
|-------|------|---------|
| `tengu_api_cache_breakpoints` | `totalMessageCount`, `cachingEnabled`, `skipCacheWrite` | Track cache placement |
| `tengu_sysprompt_boundary_found` | `blockCount`, `staticBlockLength`, `dynamicBlockLength` | Track boundary usage |
| `tengu_sysprompt_using_tool_based_cache` | `promptBlockCount` | Track tool-based caching |
| `tengu_sysprompt_missing_boundary_marker` | `promptBlockCount` | Track missing boundary |
| `tengu_compact_cache_sharing_success` | `sessionId` | Track cache prefix sharing |
| `tengu_compact_cache_sharing_fallback` | `reason`, `preCompactTokenCount` | Track sharing failures |

---

## UI Integration and Display

### Real-Time Token Streaming

During API responses, token counts are streamed in real-time to the UI:

```javascript
// ============================================
// recordTokenUsage - Distributes tokens to collectors for real-time display
// Location: chunks.57.mjs:17-39
// ============================================

function recordTokenUsage(cost, usage, model) {
    // Aggregate into session total for display
    let sessionUsage = aggregateTokenUsage(cost, usage, model);

    // Record to metric collectors for UI display
    getTokenCollector()?.add(usage.input_tokens, { model, type: "input" });
    getTokenCollector()?.add(usage.output_tokens, { model, type: "output" });
    getTokenCollector()?.add(usage.cache_read_input_tokens ?? 0, { model, type: "cacheRead" });
    getTokenCollector()?.add(usage.cache_creation_input_tokens ?? 0, { model, type: "cacheCreation" });
}
```

### End-of-Session Summary

At session end, a comprehensive summary is displayed including cache statistics:

```
Total cost:            $0.47
Total duration (API):  45.2s
Total duration (wall): 2m 32s
Total code changes:    156 lines added, 23 lines removed

Usage by model:
            sonnet:  125,000 input, 32,000 output, 620,000 cache read, 30,000 cache write ($0.38)
              opus:   25,000 input, 13,000 output, 230,000 cache read, 20,000 cache write ($0.09)
```

> **See [ui_integration.md](./ui_integration.md)** for complete documentation of UI display mechanisms.

---

## Compaction Cache Prefix Sharing

### Overview

When conversations are compacted, the cache can be preserved across the compaction boundary using a fork agent with `skipCacheWrite: true`:

```javascript
// From chunks.147.mjs:1765-1782
if (cacheSharingEnabled) {
    let result = await forkAgentQuery({
        promptMessages: [summaryRequest],
        cacheSafeParams: cacheSafeParams,
        querySource: "compact",
        forkLabel: "compact",
        maxTurns: 1,
        skipCacheWrite: true  // KEY: Preserve existing cache
    });

    // Cache hit rate indicates preservation success
    let hitRate = result.totalUsage.cache_read_input_tokens /
        (result.totalUsage.cache_read_input_tokens +
         result.totalUsage.cache_creation_input_tokens +
         result.totalUsage.input_tokens);
}
```

### Cache Sharing Decision Tree

```
Compaction triggered
        │
        ▼
Check: tengu_compact_cache_prefix feature flag
        │
   ┌────┴────┐
   │ false   │ true
   ▼         ▼
Standard   Fork agent with
Compact    skipCacheWrite: true
        │         │
        │    Cache preserved?
        │    ┌────┴────┐
        │    │ Yes     │ No
        │    ▼         ▼
        │ Summary   Fallback to
        │ returned  standard
        └────┬──────┘
             │
             ▼
        Summary replaces
        old messages
```

> **See [compaction_integration.md](./compaction_integration.md)** for complete documentation of cache preservation during compaction.

---

## Document Index

| Document | Content |
|----------|---------|
| [overview.md](./overview.md) | This file - system overview, core functions |
| [key_algorithms.md](./key_algorithms.md) | Deep analysis of critical algorithms and design decisions |
| [cache_placement.md](./cache_placement.md) | Detailed algorithm for cache breakpoint placement |
| [ttl_scope_logic.md](./ttl_scope_logic.md) | TTL and scope decision trees |
| [ui_integration.md](./ui_integration.md) | UI display of cache statistics and real-time streaming |
| [api_integration.md](./api_integration.md) | API request construction with caching |
| [pricing_models.md](./pricing_models.md) | Complete model pricing table |
| [compaction_integration.md](./compaction_integration.md) | Cache prefix sharing during compaction |
| [integration_with_system_reminder.md](./integration_with_system_reminder.md) | System reminder integration details |

## Related Modules

- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture
- [../07_compact/overview.md](../07_compact/overview.md) - Compaction system architecture
- [../03_llm_core/overview.md](../03_llm_core/overview.md) - LLM API integration
- [../24_auth/overview.md](../24_auth/overview.md) - Authentication and OAuth status

---

## Complete Data Flow Diagram

### Cache Markers in API Request Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROMPT CACHE DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ User Request    │     │ System Prompt   │     │ Conversation    │
│ (new message)   │     │ Builder         │     │ History         │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CACHE CONTROL PLACEMENT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. splitSystemPromptForCache (Jn8)                                     │  │
│  │    - Detect S_6 boundary marker                                        │  │
│  │    - Assign scope: null → org → global based on mode                   │  │
│  │    - Return blocks with cacheScope assigned                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                               │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. buildSystemPromptWithCache (_9z)                                    │  │
│  │    - Convert blocks to API format                                      │  │
│  │    - Call createCacheControl(Ml) for each block with scope             │  │
│  │    - Add cache_control: { type: "ephemeral", ttl, scope }              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                               │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. shouldUse1HourTTL (o3z)                                             │  │
│  │    - Check provider (firstParty/bedrock/vertex)                        │  │
│  │    - Check isOAuthUser() && !isUsingOverage                            │  │
│  │    - Check querySource in allowlist                                    │  │
│  │    - Return true → ttl: "1h", false → default (5min)                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                               │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. applyCacheBreakpointsToMessages (z9z)                               │  │
│  │    - Calculate breakpoint index (len-1 or len-2 if skipCacheWrite)     │  │
│  │    - Format user messages (s3z) and assistant messages (t3z)           │  │
│  │    - Inject cache_edits blocks if compaction occurred                  │  │
│  │    - Add cache_reference to tool_result blocks                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FINAL API REQUEST                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ {                                                                            │
│   system: [                                                                  │
│     { type: "text", text: "billing-header..." },  // no cache               │
│     { type: "text", text: "identity...", cache_control: { scope: "org" } }, │
│     { type: "text", text: "stable...", cache_control: { scope: "global" } },│
│     { type: "text", text: "dynamic..." }  // no cache                       │
│   ],                                                                         │
│   messages: [                                                                │
│     { role: "user", content: [...] },                                        │
│     { role: "assistant", content: [...] },                                   │
│     { role: "user", content: [..., { cache_control: { ttl: "1h" } }] }      │
│   ],                                                                         │
│   tools: [                                                                   │
│     { name: "Read", cache_control: { scope: "global" } },  // anchor tool   │
│     { name: "Write", ... }                                                   │
│   ]                                                                          │
│ }                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    API RESPONSE PROCESSING                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  API returns usage:                                                          │
│  {                                                                           │
│    input_tokens: 15000,                                                      │
│    output_tokens: 3200,                                                      │
│    cache_read_input_tokens: 85000,       ← Cache hit                        │
│    cache_creation_input_tokens: 5000     ← New cache                        │
│  }                                                                           │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ recordTokenUsage (s21)                                                 │  │
│  │    - aggregateTokenUsage (Tm3): Update session totals                  │  │
│  │    - Update cost tracker (budget warnings)                             │  │
│  │    - Record to telemetry collectors (real-time UI)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                               │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ UI Display                                                             │  │
│  │    - formatUsageByModel (Gm3): Per-model breakdown                     │  │
│  │    - formatSessionStats (a21): End-of-session summary                  │  │
│  │    - formatCost (gx6): Adaptive precision ($0.05 vs $1.25)             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                               │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ System Reminder Integration                                            │  │
│  │    - getTokenUsageAttachment (qmY): Token usage for model context      │  │
│  │    - getBudgetUsdAttachment (YmY): Budget status for model context     │  │
│  │    - normalizeAttachmentForAPI (Ui8): Convert to user message          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference: All Verified Symbols

### Core Cache Functions

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Ml` | createCacheControl | chunks.170.mjs:1849 | Build cache_control object |
| `o3z` | shouldUse1HourTTL | chunks.170.mjs:1864 | Determine TTL duration |
| `Jn8` | splitSystemPromptForCache | chunks.170.mjs:1483 | Partition system prompt |
| `z9z` | applyCacheBreakpointsToMessages | chunks.171.mjs:721 | Add cache markers to messages |
| `_9z` | buildSystemPromptWithCache | chunks.171.mjs:799 | Convert to API format |
| `s3z` | formatUserMessageForCache | chunks.170.mjs:1928 | Format user message |
| `t3z` | formatAssistantMessageForCache | chunks.170.mjs:1959 | Format assistant message |
| `Y9z` | isToolResultBlock | chunks.171.mjs:717 | Type guard for tool_result |
| `Mn8` | injectCacheEditsBlock | chunks.170.mjs:1789 | Inject cache_edits |
| `IGq` | isPromptCachingEnabled | chunks.170.mjs:1828 | Check if caching active |

### Token Usage & Cost Functions

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Tm3` | aggregateTokenUsage | chunks.57.mjs:3 | Accumulate session usage |
| `s21` | recordTokenUsage | chunks.57.mjs:17 | Record with telemetry |
| `wT9` | calculateApiCost | chunks.82.mjs:1419 | Calculate API cost |
| `OT9` | getModelPricing | chunks.82.mjs:1423 | Get pricing for model |
| `PD1` | calculateCostFromUsage | chunks.82.mjs:1446 | Cost from session stats |
| `Gm3` | formatUsageByModel | chunks.56.mjs:3037 | Format per-model usage |
| `a21` | formatSessionStats | chunks.56.mjs:3065 | Format session summary |
| `gx6` | formatCost | chunks.56.mjs:3033 | Format USD with precision |

### System Reminder Integration

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `qmY` | getTokenUsageAttachment | chunks.147.mjs:1108 | Create token attachment |
| `YmY` | getBudgetUsdAttachment | chunks.147.mjs:1124 | Create budget attachment |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3 | Convert to user message |

### Compaction Integration

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Gqq` | generateCompactSummary | chunks.147.mjs:1752 | Summary with cache sharing |
| `av` | forkAgentQuery | chunks.148.mjs | Fork agent for cache preservation |

### Pricing Constants

| Obfuscated | Readable | Location | Value |
|------------|----------|----------|-------|
| `OB` | SONNET_PRICING | chunks.82.mjs:1487 | $3/$15/$3.75/$0.30 |
| `I64` | OPUS_PRICING | chunks.82.mjs:1493 | $15/$75/$18.75/$1.50 |
| `DD1` | SONNET_4_PRICING | chunks.82.mjs:1499 | $5/$25/$6.25/$0.50 |
| `zT9` | OPUS_FAST_PRICING | chunks.82.mjs:1505 | $30/$150/$37.50/$3 |
| `Wf8` | HAIKU_PRICING_1 | chunks.82.mjs:1511 | $0.80/$4/$1/$0.08 |
| `Zf8` | HAIKU_PRICING_2 | chunks.82.mjs:1516 | $1/$5/$1.25/$0.10 |

### Helper Functions

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `iA` | isOAuthUser | chunks.16.mjs | Check OAuth status |
| `QA` | getProvider | chunks.18.mjs | Get API provider type |
| `C_6` | isFirstPartyProvider | chunks.176.mjs:1638 | Check first-party API |
| `w8` | getFeatureFlag | chunks.1.mjs | Get feature flag value |
| `t6` | parseBoolean | chunks.50.mjs | Parse env var boolean |
| `eu1` | get1HourTTLAllowlist | chunks.1.mjs:3147 | Get cached allowlist |
| `Am1` | set1HourTTLAllowlist | chunks.1.mjs:3150 | Cache allowlist |
| `m21` | getAttributionHeader | chunks.56.mjs:1520 | Build billing header |
| `zO8` | calculatePromptHash | chunks.56.mjs | Compute session hash |
| `S_6` | SYSTEM_PROMPT_DYNAMIC_BOUNDARY | chunks.170.mjs | Boundary marker constant |