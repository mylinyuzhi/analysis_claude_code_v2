# Cache Control Implementation

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Core Functions

### 1. shouldEnablePromptCaching (UE9)

Determines whether prompt caching should be enabled for a given model.

```javascript
// ============================================
// shouldEnablePromptCaching - Check if prompt caching is enabled for model
// Location: chunks.152.mjs:2690-2705
// ============================================

// ORIGINAL (for source lookup):
function UE9(A) {
  if (Y0(process.env.DISABLE_PROMPT_CACHING)) return !1;
  if (Y0(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    let Q = MW();
    if (A === Q) return !1
  }
  if (Y0(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    let Q = XU();
    if (A === Q) return !1
  }
  if (Y0(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    let Q = wUA();
    if (A === Q) return !1
  }
  return !0
}

// READABLE (for understanding):
function shouldEnablePromptCaching(model) {
  // Global disable check
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING)) {
    return false;
  }

  // Haiku-specific disable
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    const haikuModel = getHaikuModel();
    if (model === haikuModel) return false;
  }

  // Sonnet-specific disable
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    const sonnetModel = getSonnetModel();
    if (model === sonnetModel) return false;
  }

  // Opus-specific disable
  if (parseBoolean(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    const opusModel = getOpusModel();
    if (model === opusModel) return false;
  }

  return true;  // Caching enabled by default
}

// Mapping: UE9→shouldEnablePromptCaching, A→model, Y0→parseBoolean, MW→getHaikuModel, XU→getSonnetModel, wUA→getOpusModel
```

**Key insight:** Caching is enabled by default. Environment variables provide granular control to disable caching globally or per-model. This allows:
- Testing without cache (debugging)
- Cost optimization for specific models
- A/B testing of caching effectiveness

---

### 2. buildCacheControlObject (jSA)

Builds the cache_control object with appropriate TTL.

```javascript
// ============================================
// buildCacheControlObject - Create cache_control with TTL configuration
// Location: chunks.152.mjs:2707-2714
// ============================================

// ORIGINAL (for source lookup):
function jSA() {
  return BZ("prompt_cache_1h_experiment", "use_1h_cache", !1) ? {
    type: "ephemeral",
    ttl: "1h"
  } : {
    type: "ephemeral"
  }
}

// READABLE (for understanding):
function buildCacheControlObject() {
  // Check if 1-hour cache experiment is enabled
  const use1hCache = checkExperimentFlag(
    "prompt_cache_1h_experiment",  // experiment name
    "use_1h_cache",                // flag key
    false                          // default value
  );

  if (use1hCache) {
    return {
      type: "ephemeral",
      ttl: "1h"  // Extended 1-hour TTL
    };
  }

  return {
    type: "ephemeral"  // Default 5-minute TTL
  };
}

// Mapping: jSA→buildCacheControlObject, BZ→checkExperimentFlag
```

**Key insight:** The function uses an experiment flag to control TTL duration:
- **Default (5 minutes):** Standard interactive use where requests are frequent
- **Extended (1 hour):** For longer sessions with gaps between requests

The experiment flag allows Anthropic to:
1. Test extended TTL impact on cache hit rates
2. Roll out 1-hour TTL gradually
3. Measure cost savings vs cache storage costs

---

### 3. formatUserMessageWithCache (gv3)

Adds cache_control to user messages.

```javascript
// ============================================
// formatUserMessageWithCache - Add cache_control to user message content
// Location: chunks.152.mjs:2766-2791
// ============================================

// ORIGINAL (for source lookup):
function gv3(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "user",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: jSA()
        } : {}
      }]
    };
    else return {
      role: "user",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 ? B ? {
          cache_control: jSA()
        } : {} : {}
      }))
    };
  return {
    role: "user",
    content: A.message.content
  }
}

// READABLE (for understanding):
function formatUserMessageWithCache(
  normalizedMessage,
  isInCacheWindow = false,  // true if this is one of the last 2 messages
  cachingEnabled
) {
  // Only add cache_control if in cache window
  if (isInCacheWindow) {

    // Handle string content (simple message)
    if (typeof normalizedMessage.message.content === "string") {
      return {
        role: "user",
        content: [{
          type: "text",
          text: normalizedMessage.message.content,
          // Add cache_control if caching is enabled
          ...(cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
        }]
      };
    }

    // Handle array content (complex message with multiple blocks)
    return {
      role: "user",
      content: normalizedMessage.message.content.map((block, index) => ({
        ...block,
        // Only add cache_control to the LAST content block
        ...(index === normalizedMessage.message.content.length - 1
          ? (cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
          : {})
      }))
    };
  }

  // Not in cache window - return as-is
  return {
    role: "user",
    content: normalizedMessage.message.content
  };
}

// Mapping: gv3→formatUserMessageWithCache, A→normalizedMessage, Q→isInCacheWindow, B→cachingEnabled, G→block, Z→index, jSA→buildCacheControlObject
```

**Key insight:** Cache control is added to the **last content block** of a message. This is crucial because:
1. Anthropic's caching works at prefix level - cache must be at the end of prefix
2. Adding to last block ensures maximum prefix coverage
3. Multi-block messages (text + images) get cache on last block only

---

### 4. formatAssistantMessageWithCache (uv3)

Adds cache_control to assistant messages, with special handling for thinking blocks.

```javascript
// ============================================
// formatAssistantMessageWithCache - Add cache_control to assistant message (excluding thinking)
// Location: chunks.152.mjs:2793-2818
// ============================================

// ORIGINAL (for source lookup):
function uv3(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "assistant",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: jSA()
        } : {}
      }]
    };
    else return {
      role: "assistant",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 && G.type !== "thinking" && G.type !== "redacted_thinking" ? B ? {
          cache_control: jSA()
        } : {} : {}
      }))
    };
  return {
    role: "assistant",
    content: A.message.content
  }
}

// READABLE (for understanding):
function formatAssistantMessageWithCache(
  normalizedMessage,
  isInCacheWindow = false,
  cachingEnabled
) {
  if (isInCacheWindow) {

    // Handle string content
    if (typeof normalizedMessage.message.content === "string") {
      return {
        role: "assistant",
        content: [{
          type: "text",
          text: normalizedMessage.message.content,
          ...(cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
        }]
      };
    }

    // Handle array content with THINKING BLOCK EXCLUSION
    return {
      role: "assistant",
      content: normalizedMessage.message.content.map((block, index) => ({
        ...block,
        // Add cache_control ONLY if:
        // 1. This is the last content block
        // 2. Block type is NOT "thinking" or "redacted_thinking"
        // 3. Caching is enabled
        ...(
          index === normalizedMessage.message.content.length - 1 &&
          block.type !== "thinking" &&
          block.type !== "redacted_thinking"
            ? (cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
            : {}
        )
      }))
    };
  }

  return {
    role: "assistant",
    content: normalizedMessage.message.content
  };
}

// Mapping: uv3→formatAssistantMessageWithCache, A→normalizedMessage, Q→isInCacheWindow, B→cachingEnabled, G→block, Z→index
```

**Key insight:** **Thinking blocks are explicitly excluded from caching.** This is critical because:

1. **Size:** Thinking blocks can be extremely large (up to budget_tokens)
2. **Variability:** Thinking content varies significantly between requests
3. **Cost:** Caching large, variable content wastes cache write costs
4. **Privacy:** Thinking content may contain sensitive reasoning

---

### 5. mapMessagesWithCache (mv3)

Orchestrates cache control addition across all messages.

```javascript
// ============================================
// mapMessagesWithCache - Apply cache_control to last 2 messages in array
// Location: chunks.153.mjs:406-413
// ============================================

// ORIGINAL (for source lookup):
function mv3(A, Q) {
  return GA("tengu_api_cache_breakpoints", {
    totalMessageCount: A.length,
    cachingEnabled: Q
  }), A.map((B, G) => {
    return B.type === "user" ? gv3(B, G > A.length - 3, Q) : uv3(B, G > A.length - 3, Q)
  })
}

// READABLE (for understanding):
function mapMessagesWithCache(messages, cachingEnabled) {
  // Log telemetry about cache breakpoints
  trackEvent("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: cachingEnabled
  });

  return messages.map((message, index) => {
    // Determine if this message is in the cache window
    // Cache window = last 2 messages (index > length - 3)
    const isInCacheWindow = index > messages.length - 3;

    // Delegate to appropriate formatter based on message type
    if (message.type === "user") {
      return formatUserMessageWithCache(message, isInCacheWindow, cachingEnabled);
    } else {
      return formatAssistantMessageWithCache(message, isInCacheWindow, cachingEnabled);
    }
  });
}

// Mapping: mv3→mapMessagesWithCache, A→messages, Q→cachingEnabled, B→message, G→index, GA→trackEvent, gv3→formatUserMessageWithCache, uv3→formatAssistantMessageWithCache
```

**Key insight:** The cache window calculation `index > messages.length - 3` ensures exactly the **last 2 messages** are cached:

| Length | Condition | Cached Indices |
|--------|-----------|----------------|
| 6 | `idx > 3` | 4, 5 |
| 4 | `idx > 1` | 2, 3 |
| 2 | `idx > -1` | 0, 1 (all) |

---

### 6. formatSystemPromptWithCache (dv3)

Formats system prompts with cache control.

```javascript
// ============================================
// formatSystemPromptWithCache - Add cache_control to all system prompt blocks
// Location: chunks.153.mjs:415-423
// ============================================

// ORIGINAL (for source lookup):
function dv3(A, Q) {
  return HV0(A).map((B) => ({
    type: "text",
    text: B,
    ...Q ? {
      cache_control: jSA()
    } : {}
  }))
}

// READABLE (for understanding):
function formatSystemPromptWithCache(systemPromptArray, cachingEnabled) {
  // formatSystemPrompt converts array to normalized text blocks
  return formatSystemPrompt(systemPromptArray).map((textContent) => ({
    type: "text",
    text: textContent,
    // Add cache_control to EVERY system prompt block
    ...(cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
  }));
}

// Mapping: dv3→formatSystemPromptWithCache, A→systemPromptArray, Q→cachingEnabled, B→textContent, HV0→formatSystemPrompt, jSA→buildCacheControlObject
```

**Key insight:** Unlike messages, **ALL system prompt blocks** get cache_control. This is optimal because:

1. System prompts are stable across requests
2. They appear at the start of the prompt (prefix position)
3. High cache hit rate expected
4. Caching them saves significant costs on every request

---

## Usage Tracking Functions

### 7. mergeUsage (ljA)

Merges usage data from streaming events.

```javascript
// ============================================
// mergeUsage - Merge usage from streaming events (take non-zero values)
// Location: chunks.153.mjs:370-386
// ============================================

// ORIGINAL (for source lookup):
function ljA(A, Q) {
  return {
    input_tokens: Q.input_tokens !== null && Q.input_tokens > 0 ? Q.input_tokens : A.input_tokens,
    cache_creation_input_tokens: Q.cache_creation_input_tokens !== null && Q.cache_creation_input_tokens > 0 ? Q.cache_creation_input_tokens : A.cache_creation_input_tokens,
    cache_read_input_tokens: Q.cache_read_input_tokens !== null && Q.cache_read_input_tokens > 0 ? Q.cache_read_input_tokens : A.cache_read_input_tokens,
    output_tokens: Q.output_tokens ?? A.output_tokens,
    server_tool_use: {
      web_search_requests: Q.server_tool_use?.web_search_requests ?? A.server_tool_use.web_search_requests,
      web_fetch_requests: Q.server_tool_use?.web_fetch_requests ?? A.server_tool_use.web_fetch_requests
    },
    service_tier: A.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: Q.cache_creation?.ephemeral_1h_input_tokens ?? A.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: Q.cache_creation?.ephemeral_5m_input_tokens ?? A.cache_creation.ephemeral_5m_input_tokens
    }
  }
}

// READABLE (for understanding):
function mergeUsage(accumulated, incoming) {
  return {
    // For token counts, take incoming if positive, otherwise keep accumulated
    input_tokens: (incoming.input_tokens !== null && incoming.input_tokens > 0)
      ? incoming.input_tokens
      : accumulated.input_tokens,

    cache_creation_input_tokens: (incoming.cache_creation_input_tokens !== null && incoming.cache_creation_input_tokens > 0)
      ? incoming.cache_creation_input_tokens
      : accumulated.cache_creation_input_tokens,

    cache_read_input_tokens: (incoming.cache_read_input_tokens !== null && incoming.cache_read_input_tokens > 0)
      ? incoming.cache_read_input_tokens
      : accumulated.cache_read_input_tokens,

    output_tokens: incoming.output_tokens ?? accumulated.output_tokens,

    server_tool_use: {
      web_search_requests: incoming.server_tool_use?.web_search_requests ?? accumulated.server_tool_use.web_search_requests,
      web_fetch_requests: incoming.server_tool_use?.web_fetch_requests ?? accumulated.server_tool_use.web_fetch_requests
    },

    service_tier: accumulated.service_tier,

    // Detailed cache creation breakdown by TTL
    cache_creation: {
      ephemeral_1h_input_tokens: incoming.cache_creation?.ephemeral_1h_input_tokens ?? accumulated.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: incoming.cache_creation?.ephemeral_5m_input_tokens ?? accumulated.cache_creation.ephemeral_5m_input_tokens
    }
  };
}

// Mapping: ljA→mergeUsage, A→accumulated, Q→incoming
```

---

### 8. aggregateUsage (vI1)

Aggregates usage across multiple API calls.

```javascript
// ============================================
// aggregateUsage - Sum usage across multiple API calls
// Location: chunks.153.mjs:388-404
// ============================================

// ORIGINAL (for source lookup):
function vI1(A, Q) {
  return {
    input_tokens: A.input_tokens + Q.input_tokens,
    cache_creation_input_tokens: A.cache_creation_input_tokens + Q.cache_creation_input_tokens,
    cache_read_input_tokens: A.cache_read_input_tokens + Q.cache_read_input_tokens,
    output_tokens: A.output_tokens + Q.output_tokens,
    server_tool_use: {
      web_search_requests: A.server_tool_use.web_search_requests + Q.server_tool_use.web_search_requests,
      web_fetch_requests: A.server_tool_use.web_fetch_requests + Q.server_tool_use.web_fetch_requests
    },
    service_tier: Q.service_tier,
    cache_creation: {
      ephemeral_1h_input_tokens: A.cache_creation.ephemeral_1h_input_tokens + Q.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: A.cache_creation.ephemeral_5m_input_tokens + Q.cache_creation.ephemeral_5m_input_tokens
    }
  }
}

// READABLE (for understanding):
function aggregateUsage(total, current) {
  return {
    input_tokens: total.input_tokens + current.input_tokens,
    cache_creation_input_tokens: total.cache_creation_input_tokens + current.cache_creation_input_tokens,
    cache_read_input_tokens: total.cache_read_input_tokens + current.cache_read_input_tokens,
    output_tokens: total.output_tokens + current.output_tokens,

    server_tool_use: {
      web_search_requests: total.server_tool_use.web_search_requests + current.server_tool_use.web_search_requests,
      web_fetch_requests: total.server_tool_use.web_fetch_requests + current.server_tool_use.web_fetch_requests
    },

    service_tier: current.service_tier,  // Take latest tier

    cache_creation: {
      ephemeral_1h_input_tokens: total.cache_creation.ephemeral_1h_input_tokens + current.cache_creation.ephemeral_1h_input_tokens,
      ephemeral_5m_input_tokens: total.cache_creation.ephemeral_5m_input_tokens + current.cache_creation.ephemeral_5m_input_tokens
    }
  };
}

// Mapping: vI1→aggregateUsage, A→total, Q→current
```

---

## Main Query Integration

### 9. Query Function ($E9) Cache Integration

The main query function integrates caching at several points:

```javascript
// ============================================
// streamQuery (excerpt) - Cache integration in main query function
// Location: chunks.153.mjs:3, 24-25, 61-64
// ============================================

// ORIGINAL (excerpt for cache-related lines):
async function* $E9(A, Q, B, G, Z, I) {
  // ...
  let X = I.enablePromptCaching ?? UE9(I.model),  // Line 24: Determine if caching enabled
      V = dv3(Q, X),                               // Line 25: Format system prompt with cache
  // ...
  let U = (l) => {
    // ...
    let NA = I.enablePromptCaching ?? UE9(l.model);  // Line 61: Re-check for retry
    return {
      model: ac(I.model),
      messages: mv3(K, NA),  // Line 64: Format messages with cache
      system: V,
      // ...
    }
  }
  // ...
}

// READABLE (for understanding):
async function* streamQuery(
  messages,
  systemPrompt,
  maxThinkingTokens,
  tools,
  signal,
  options
) {
  // Step 1: Determine if prompt caching should be enabled
  // Options can override, otherwise use model-based decision
  const enablePromptCaching = options.enablePromptCaching ?? shouldEnablePromptCaching(options.model);

  // Step 2: Format system prompt with cache control
  const formattedSystemPrompt = formatSystemPromptWithCache(systemPrompt, enablePromptCaching);

  // Step 3: Build request payload generator
  const buildRequestPayload = (retryOptions) => {
    // Re-check caching for current model (may differ on retry/fallback)
    const currentEnablePromptCaching = options.enablePromptCaching ?? shouldEnablePromptCaching(retryOptions.model);

    return {
      model: normalizeModelId(options.model),
      messages: mapMessagesWithCache(normalizedMessages, currentEnablePromptCaching),
      system: formattedSystemPrompt,
      tools: [...toolSchemas, ...(options.extraToolSchemas ?? [])],
      // ... other fields
    };
  };

  // Step 4: Execute streaming request
  // ...
}

// Mapping: $E9→streamQuery, A→messages, Q→systemPrompt, B→maxThinkingTokens, G→tools, Z→signal, I→options, X→enablePromptCaching, V→formattedSystemPrompt, U→buildRequestPayload, K→normalizedMessages, NA→currentEnablePromptCaching, mv3→mapMessagesWithCache, dv3→formatSystemPromptWithCache, UE9→shouldEnablePromptCaching
```

**Key insight:** Cache control is applied at two points:
1. **System prompt** - Formatted once at start
2. **Messages** - Formatted in payload builder (allows retry with different caching)

---

## Cost Calculation

### 10. calculateCost (or8)

```javascript
// ============================================
// calculateCost - Calculate total cost including cache tokens
// Location: chunks.56.mjs:3145-3147
// ============================================

// ORIGINAL (for source lookup):
function or8(A, Q) {
  return Q.input_tokens / 1e6 * A.inputTokens + Q.output_tokens / 1e6 * A.outputTokens + (Q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (Q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (Q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}

// READABLE (for understanding):
function calculateCost(pricingModel, usage) {
  return (
    // Regular input tokens
    (usage.input_tokens / 1_000_000) * pricingModel.inputTokens +

    // Output tokens
    (usage.output_tokens / 1_000_000) * pricingModel.outputTokens +

    // Cache read tokens (90% cheaper than input)
    ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * pricingModel.promptCacheReadTokens +

    // Cache creation tokens (25% more than input)
    ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * pricingModel.promptCacheWriteTokens +

    // Web search requests
    ((usage.server_tool_use?.web_search_requests ?? 0) * pricingModel.webSearchRequests)
  );
}

// Mapping: or8→calculateCost, A→pricingModel, Q→usage
```

---

## Cache Hit Rate Calculation

### 11. Fork Agent Query Telemetry (z_3)

```javascript
// ============================================
// trackForkAgentQuery - Calculate and track cache hit rate
// Location: chunks.145.mjs:1028-1056
// ============================================

// ORIGINAL (excerpt):
function z_3({
  forkLabel: A,
  querySource: Q,
  durationMs: B,
  messageCount: G,
  totalUsage: Z,
  queryTracking: I
}) {
  let Y = Z.input_tokens + Z.cache_creation_input_tokens + Z.cache_read_input_tokens,
    J = Y > 0 ? Z.cache_read_input_tokens / Y : 0;
  GA("tengu_fork_agent_query", {
    // ...
    cacheReadInputTokens: Z.cache_read_input_tokens,
    cacheCreationInputTokens: Z.cache_creation_input_tokens,
    cacheHitRate: J,
    // ...
  })
}

// READABLE (for understanding):
function trackForkAgentQuery({
  forkLabel,
  querySource,
  durationMs,
  messageCount,
  totalUsage,
  queryTracking
}) {
  // Calculate total input tokens (including cached)
  const totalInputTokens =
    totalUsage.input_tokens +
    totalUsage.cache_creation_input_tokens +
    totalUsage.cache_read_input_tokens;

  // Calculate cache hit rate
  const cacheHitRate = totalInputTokens > 0
    ? totalUsage.cache_read_input_tokens / totalInputTokens
    : 0;

  trackEvent("tengu_fork_agent_query", {
    forkLabel,
    querySource,
    durationMs,
    messageCount,
    inputTokens: totalUsage.input_tokens,
    outputTokens: totalUsage.output_tokens,
    cacheReadInputTokens: totalUsage.cache_read_input_tokens,
    cacheCreationInputTokens: totalUsage.cache_creation_input_tokens,
    serviceTier: totalUsage.service_tier,
    cacheCreationEphemeral1hTokens: totalUsage.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: totalUsage.cache_creation.ephemeral_5m_input_tokens,
    cacheHitRate: cacheHitRate,
    // ...
  });
}

// Mapping: z_3→trackForkAgentQuery, A→forkLabel, Q→querySource, B→durationMs, G→messageCount, Z→totalUsage, I→queryTracking, Y→totalInputTokens, J→cacheHitRate, GA→trackEvent
```

**Key insight:** Cache hit rate formula:
```
cacheHitRate = cache_read_input_tokens / (input_tokens + cache_creation_input_tokens + cache_read_input_tokens)
```

A high cache hit rate indicates effective caching. Target: >50% for interactive sessions.

---

## Symbol Reference

Key functions in this document:
- `shouldEnablePromptCaching` (UE9) - Check if caching is enabled
- `buildCacheControlObject` (jSA) - Build cache_control with TTL
- `formatUserMessageWithCache` (gv3) - Add cache to user messages
- `formatAssistantMessageWithCache` (uv3) - Add cache to assistant messages (excluding thinking)
- `mapMessagesWithCache` (mv3) - Apply cache to last 2 messages
- `formatSystemPromptWithCache` (dv3) - Add cache to all system blocks
- `mergeUsage` (ljA) - Merge streaming usage events
- `aggregateUsage` (vI1) - Sum usage across calls
- `streamQuery` ($E9) - Main query function with cache integration
- `calculateCost` (or8) - Cost calculation with cache tokens
- `trackForkAgentQuery` (z_3) - Cache hit rate telemetry

---

## Thinking Block Handling Note

For comprehensive coverage of how thinking blocks and reasoning signatures are handled during API requests, see:
- [message_history_and_thinking.md](./message_history_and_thinking.md) - Full analysis of message history, thinking blocks, signatures, and ultrathink mode

**Quick summary:**
- Thinking blocks ARE included in message history sent to API (only `cache_control` is excluded)
- Trailing thinking blocks are filtered from the last message via `xb3()` function
- Signatures are accumulated on thinking blocks via `signature_delta` streaming events

---

## Related Documents

- [prompt_cache_overview.md](./prompt_cache_overview.md) - Architecture overview
- [cache_strategies.md](./cache_strategies.md) - Usage patterns and optimization
- [message_history_and_thinking.md](./message_history_and_thinking.md) - Message history and thinking blocks
