# Cache Control Implementation (Claude Code 2.1.7)

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform modules
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution modules

## Core Functions

### 1. isPromptCachingSupported (AJ9)

Determines whether prompt caching should be enabled for a given model.

```javascript
// ============================================
// isPromptCachingSupported - Check if prompt caching is enabled for model
// Location: chunks.146.mjs:2872-2886
// ============================================

// ORIGINAL (for source lookup):
function AJ9(A) {
  if (a1(process.env.DISABLE_PROMPT_CACHING)) return !1;
  if (a1(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    let Q = SD();
    if (A === Q) return !1
  }
  if (a1(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    let Q = OR();
    if (A === Q) return !1
  }
  if (a1(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    let Q = sJA();
    if (A === Q) return !1
  }
  return !0
}

// READABLE (for understanding):
function isPromptCachingSupported(model) {
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

// Mapping: AJ9→isPromptCachingSupported, A→model, a1→parseBoolean, SD→getHaikuModel, OR→getSonnetModel, sJA→getOpusModel
```

**Key insight:** Caching is enabled by default. Environment variables provide granular control to disable caching globally or per-model. This allows:
- Testing without cache (debugging)
- Cost optimization for specific models
- A/B testing of caching effectiveness

---

### 2. getCacheControl (wuA)

Builds the cache_control object with appropriate TTL.

```javascript
// ============================================
// getCacheControl - Create cache_control with TTL configuration
// Location: chunks.146.mjs:2889-2895
// ============================================

// ORIGINAL (for source lookup):
function wuA() {
  return HX("prompt_cache_1h_experiment", "use_1h_cache", !1) ? {
    type: "ephemeral",
    ttl: "1h"
  } : {
    type: "ephemeral"
  }
}

// READABLE (for understanding):
function getCacheControl() {
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

// Mapping: wuA→getCacheControl, HX→checkExperimentFlag
```

**Key insight:** The function uses an experiment flag to control TTL duration:
- **Default (5 minutes):** Standard interactive use where requests are frequent
- **Extended (1 hour):** For longer sessions with gaps between requests

The experiment flag allows Anthropic to:
1. Test extended TTL impact on cache hit rates
2. Roll out 1-hour TTL gradually
3. Measure cost savings vs cache storage costs

---

### 3. applyUserMessageCacheBreakpoint ($z7)

Adds cache_control to user messages.

```javascript
// ============================================
// applyUserMessageCacheBreakpoint - Add cache_control to user message content
// Location: chunks.146.mjs:2948-2972
// ============================================

// ORIGINAL (for source lookup):
function $z7(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "user",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: wuA()
        } : {}
      }]
    };
    else return {
      role: "user",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 ? B ? {
          cache_control: wuA()
        } : {} : {}
      }))
    };
  return {
    role: "user",
    content: A.message.content
  }
}

// READABLE (for understanding):
function applyUserMessageCacheBreakpoint(
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
          ...(cachingEnabled ? { cache_control: getCacheControl() } : {})
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
          ? (cachingEnabled ? { cache_control: getCacheControl() } : {})
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

// Mapping: $z7→applyUserMessageCacheBreakpoint, A→normalizedMessage, Q→isInCacheWindow, B→cachingEnabled, G→block, Z→index, wuA→getCacheControl
```

**Key insight:** Cache control is added to the **last content block** of a message. This is crucial because:
1. Anthropic's caching works at prefix level - cache must be at the end of prefix
2. Adding to last block ensures maximum prefix coverage
3. Multi-block messages (text + images) get cache on last block only

---

### 4. applyAssistantMessageCacheBreakpoint (Cz7)

Adds cache_control to assistant messages, with special handling for thinking blocks.

```javascript
// ============================================
// applyAssistantMessageCacheBreakpoint - Add cache_control to assistant message (excluding thinking)
// Location: chunks.146.mjs:2975-3000
// ============================================

// ORIGINAL (for source lookup):
function Cz7(A, Q = !1, B) {
  if (Q)
    if (typeof A.message.content === "string") return {
      role: "assistant",
      content: [{
        type: "text",
        text: A.message.content,
        ...B ? {
          cache_control: wuA()
        } : {}
      }]
    };
    else return {
      role: "assistant",
      content: A.message.content.map((G, Z) => ({
        ...G,
        ...Z === A.message.content.length - 1 && G.type !== "thinking" && G.type !== "redacted_thinking" ? B ? {
          cache_control: wuA()
        } : {} : {}
      }))
    };
  return {
    role: "assistant",
    content: A.message.content
  }
}

// READABLE (for understanding):
function applyAssistantMessageCacheBreakpoint(
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
          ...(cachingEnabled ? { cache_control: getCacheControl() } : {})
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
            ? (cachingEnabled ? { cache_control: getCacheControl() } : {})
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

// Mapping: Cz7→applyAssistantMessageCacheBreakpoint, A→normalizedMessage, Q→isInCacheWindow, B→cachingEnabled, G→block, Z→index, wuA→getCacheControl
```

**Key insight:** **Thinking blocks are explicitly excluded from caching.** This is critical because:

1. **Size:** Thinking blocks can be extremely large (up to budget_tokens)
2. **Variability:** Thinking content varies significantly between requests
3. **Cost:** Caching large, variable content wastes cache write costs
4. **Privacy:** Thinking content may contain sensitive reasoning

---

### 5. applyMessageCacheBreakpoints (qz7)

Orchestrates cache control addition across all messages.

```javascript
// ============================================
// applyMessageCacheBreakpoints - Apply cache_control to last 2 messages in array
// Location: chunks.147.mjs:483-490
// ============================================

// ORIGINAL (for source lookup):
function qz7(A, Q) {
  return l("tengu_api_cache_breakpoints", {
    totalMessageCount: A.length,
    cachingEnabled: Q
  }), A.map((B, G) => {
    return B.type === "user" ? $z7(B, G > A.length - 3, Q) : Cz7(B, G > A.length - 3, Q)
  })
}

// READABLE (for understanding):
function applyMessageCacheBreakpoints(messages, cachingEnabled) {
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
      return applyUserMessageCacheBreakpoint(message, isInCacheWindow, cachingEnabled);
    } else {
      return applyAssistantMessageCacheBreakpoint(message, isInCacheWindow, cachingEnabled);
    }
  });
}

// Mapping: qz7→applyMessageCacheBreakpoints, A→messages, Q→cachingEnabled, B→message, G→index, l→trackEvent, $z7→applyUserMessageCacheBreakpoint, Cz7→applyAssistantMessageCacheBreakpoint
```

**Key insight:** The cache window calculation `index > messages.length - 3` ensures exactly the **last 2 messages** are cached:

| Length | Condition | Cached Indices |
|--------|-----------|----------------|
| 6 | `idx > 3` | 4, 5 |
| 4 | `idx > 1` | 2, 3 |
| 2 | `idx > -1` | 0, 1 (all) |

---

### 6. formatSystemPromptWithCache (Nz7)

Formats system prompts with cache control, **excluding billing headers**.

```javascript
// ============================================
// formatSystemPromptWithCache - Add cache_control to system prompt blocks (exclude billing headers)
// Location: chunks.147.mjs:492-502
// ============================================

// ORIGINAL (for source lookup):
function Nz7(A, Q) {
  return rO0(A).map((B) => {
    let G = B.startsWith("x-anthropic-billing-header");
    return {
      type: "text",
      text: B,
      ...Q && !G ? {
        cache_control: wuA()
      } : {}
    }
  })
}

// READABLE (for understanding):
function formatSystemPromptWithCache(systemPromptArray, cachingEnabled) {
  // formatSystemPrompt converts array to normalized text blocks
  return formatSystemPrompt(systemPromptArray).map((textContent) => {
    // NEW: Check if this is a billing header
    const isBillingHeader = textContent.startsWith("x-anthropic-billing-header");

    return {
      type: "text",
      text: textContent,
      // Add cache_control to system prompt blocks EXCEPT billing headers
      ...(cachingEnabled && !isBillingHeader ? { cache_control: getCacheControl() } : {})
    };
  });
}

// Mapping: Nz7→formatSystemPromptWithCache, A→systemPromptArray, Q→cachingEnabled, B→textContent, G→isBillingHeader, rO0→formatSystemPrompt, wuA→getCacheControl
```

**Key insight:** Unlike v2.0.59, v2.1.7 **excludes billing headers** from caching. This is optimal because:

1. Billing headers may contain dynamic session/attribution info
2. They change between requests/sessions
3. Caching them would waste cache write costs with low hit rate
4. All other system prompt blocks still get cache_control

---

### 7. formatSystemPrompt (rO0)

Normalizes system prompt array into ordered text blocks.

```javascript
// ============================================
// formatSystemPrompt - Normalize and order system prompt blocks
// Location: chunks.133.mjs:2563-2577
// ============================================

// ORIGINAL (for source lookup):
function rO0(A) {
  let Q, B, G = [];
  for (let J of A) {
    if (!J) continue;
    if (J.startsWith("x-anthropic-billing-header")) Q = J;
    else if (DCB.has(J)) B = J;
    else G.push(J)
  }
  let Z = [];
  if (Q) Z.push(Q);
  if (B) Z.push(B);
  let Y = G.join(`
`);
  if (Y) Z.push(Y);
  return Z
}

// READABLE (for understanding):
function formatSystemPrompt(systemPromptArray) {
  let billingHeader;     // x-anthropic-billing-header
  let identityHeader;    // Agent identity (Claude Code, etc.)
  let otherContent = []; // All other system prompt content

  for (let block of systemPromptArray) {
    if (!block) continue;

    if (block.startsWith("x-anthropic-billing-header")) {
      billingHeader = block;
    } else if (AGENT_IDENTITIES.has(block)) {
      identityHeader = block;
    } else {
      otherContent.push(block);
    }
  }

  // Build ordered result: billing → identity → content
  let result = [];
  if (billingHeader) result.push(billingHeader);
  if (identityHeader) result.push(identityHeader);

  const joinedContent = otherContent.join("\n");
  if (joinedContent) result.push(joinedContent);

  return result;
}

// Mapping: rO0→formatSystemPrompt, A→systemPromptArray, Q→billingHeader, B→identityHeader, G→otherContent, DCB→AGENT_IDENTITIES
```

**Key insight:** System prompt is organized into ordered blocks:
1. **Billing header** (first, excluded from cache)
2. **Agent identity** (second, cached)
3. **All other content** (joined, cached)

---

## Usage Tracking Functions

### 8. mergeUsage (dhA)

Merges usage data from streaming events.

```javascript
// ============================================
// mergeUsage - Merge usage from streaming events (take non-zero values)
// Location: chunks.147.mjs:447-462
// ============================================

// ORIGINAL (for source lookup):
function dhA(A, Q) {
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

// Mapping: dhA→mergeUsage, A→accumulated, Q→incoming
```

---

### 9. aggregateUsage (SH1)

Aggregates usage across multiple API calls.

```javascript
// ============================================
// aggregateUsage - Sum usage across multiple API calls
// Location: chunks.147.mjs:465-480
// ============================================

// ORIGINAL (for source lookup):
function SH1(A, Q) {
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

// Mapping: SH1→aggregateUsage, A→total, Q→current
```

---

## Main Query Integration

### 10. Query Function (BJ9) Cache Integration

The main query function integrates caching at several points:

```javascript
// ============================================
// streamQuery (excerpt) - Cache integration in main query function
// Location: chunks.147.mjs:3, 63-64, 104, 107-108
// ============================================

// ORIGINAL (excerpt for cache-related lines):
async function* BJ9(A, Q, B, G, Z, Y) {
  // ...
  let E = Y.enablePromptCaching ?? AJ9(Y.model),  // Line 63: Determine if caching enabled
      z = Nz7(Q, E),                               // Line 64: Format system prompt with cache
  // ...
  let S = (jA) => {
    // ...
    let s = Y.enablePromptCaching ?? AJ9(jA.model);  // Line 104: Re-check for retry
    return {
      model: Lu(Y.model),
      messages: qz7(V, s),  // Line 107: Format messages with cache
      system: z,             // Line 108: Use cached system prompt
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
  const enablePromptCaching = options.enablePromptCaching ?? isPromptCachingSupported(options.model);

  // Step 2: Format system prompt with cache control
  const formattedSystemPrompt = formatSystemPromptWithCache(systemPrompt, enablePromptCaching);

  // Step 3: Build request payload generator
  const buildRequestPayload = (retryOptions) => {
    // Re-check caching for current model (may differ on retry/fallback)
    const currentEnablePromptCaching = options.enablePromptCaching ?? isPromptCachingSupported(retryOptions.model);

    return {
      model: normalizeModelId(options.model),
      messages: applyMessageCacheBreakpoints(normalizedMessages, currentEnablePromptCaching),
      system: formattedSystemPrompt,
      tools: [...toolSchemas, ...(options.extraToolSchemas ?? [])],
      // ... other fields
    };
  };

  // Step 4: Execute streaming request
  // ...
}

// Mapping: BJ9→streamQuery, A→messages, Q→systemPrompt, B→maxThinkingTokens, G→tools, Z→signal, Y→options, E→enablePromptCaching, z→formattedSystemPrompt, S→buildRequestPayload, V→normalizedMessages, s→currentEnablePromptCaching, qz7→applyMessageCacheBreakpoints, Nz7→formatSystemPromptWithCache, AJ9→isPromptCachingSupported
```

**Key insight:** Cache control is applied at two points:
1. **System prompt** - Formatted once at start
2. **Messages** - Formatted in payload builder (allows retry with different caching)

---

## Cost Calculation

### 11. calculateCost (Lw3)

```javascript
// ============================================
// calculateCost - Calculate total cost including cache tokens
// Location: chunks.46.mjs:1909-1910
// ============================================

// ORIGINAL (for source lookup):
function Lw3(A, Q) {
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

// Mapping: Lw3→calculateCost, A→pricingModel, Q→usage
```

---

### 12. Pricing Model Definitions

```javascript
// ============================================
// Pricing model definitions
// Location: chunks.46.mjs:1961-2007
// ============================================

// Sonnet 4.5 / Sonnet 4 (KQA)
const SONNET_PRICING = {
  inputTokens: 3,           // $3 per Mtok
  outputTokens: 15,         // $15 per Mtok
  promptCacheWriteTokens: 3.75,   // 1.25x input = $3.75
  promptCacheReadTokens: 0.3,     // 0.1x input = $0.30
  webSearchRequests: 0.01
};

// Opus 4 / Opus 3.5 (seA)
const OPUS_PRICING = {
  inputTokens: 15,          // $15 per Mtok
  outputTokens: 75,         // $75 per Mtok
  promptCacheWriteTokens: 18.75,  // 1.25x input = $18.75
  promptCacheReadTokens: 1.5,     // 0.1x input = $1.50
  webSearchRequests: 0.01
};

// Sonnet 3.5 (teA)
const SONNET35_PRICING = {
  inputTokens: 5,           // $5 per Mtok
  outputTokens: 25,         // $25 per Mtok
  promptCacheWriteTokens: 6.25,   // 1.25x input = $6.25
  promptCacheReadTokens: 0.5,     // 0.1x input = $0.50
  webSearchRequests: 0.01
};

// Sonnet 4.5 > 200K context (yp1)
const SONNET45_LONG_PRICING = {
  inputTokens: 6,           // $6 per Mtok (2x normal)
  outputTokens: 22.5,       // $22.5 per Mtok
  promptCacheWriteTokens: 7.5,    // 1.25x input = $7.50
  promptCacheReadTokens: 0.6,     // 0.1x input = $0.60
  webSearchRequests: 0.01
};

// Haiku 4.5 (vp1)
const HAIKU45_PRICING = {
  inputTokens: 0.8,         // $0.80 per Mtok
  outputTokens: 4,          // $4 per Mtok
  promptCacheWriteTokens: 1,      // 1.25x input = $1.00
  promptCacheReadTokens: 0.08,    // 0.1x input = $0.08
  webSearchRequests: 0.01
};

// Haiku 3.5 (kp1)
const HAIKU35_PRICING = {
  inputTokens: 1,           // $1 per Mtok
  outputTokens: 5,          // $5 per Mtok
  promptCacheWriteTokens: 1.25,   // 1.25x input = $1.25
  promptCacheReadTokens: 0.1,     // 0.1x input = $0.10
  webSearchRequests: 0.01
};
```

---

## Cache Hit Rate Calculation

### 13. trackForkAgentQuery (i77)

```javascript
// ============================================
// trackForkAgentQuery - Calculate and track cache hit rate
// Location: chunks.134.mjs:2036-2063
// ============================================

// ORIGINAL (for source lookup):
function i77({
  forkLabel: A,
  querySource: Q,
  durationMs: B,
  messageCount: G,
  totalUsage: Z,
  queryTracking: Y
}) {
  let J = Z.input_tokens + Z.cache_creation_input_tokens + Z.cache_read_input_tokens,
    X = J > 0 ? Z.cache_read_input_tokens / J : 0;
  l("tengu_fork_agent_query", {
    // ...
    cacheReadInputTokens: Z.cache_read_input_tokens,
    cacheCreationInputTokens: Z.cache_creation_input_tokens,
    cacheHitRate: X,
    cacheCreationEphemeral1hTokens: Z.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: Z.cache_creation.ephemeral_5m_input_tokens,
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

// Mapping: i77→trackForkAgentQuery, A→forkLabel, Q→querySource, B→durationMs, G→messageCount, Z→totalUsage, Y→queryTracking, J→totalInputTokens, X→cacheHitRate, l→trackEvent
```

**Key insight:** Cache hit rate formula:
```
cacheHitRate = cache_read_input_tokens / (input_tokens + cache_creation_input_tokens + cache_read_input_tokens)
```

A high cache hit rate indicates effective caching. Target: >50% for interactive sessions.

---

## Default Usage Object

```javascript
// ============================================
// Default usage object - Initial state for usage tracking
// Location: chunks.134.mjs:1847-1859
// ============================================

// ORIGINAL (for source lookup):
Cj = {
  input_tokens: 0,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
  output_tokens: 0,
  server_tool_use: {
    web_search_requests: 0,
    web_fetch_requests: 0
  },
  service_tier: "standard",
  cache_creation: {
    ephemeral_1h_input_tokens: 0,
    ephemeral_5m_input_tokens: 0
  }
}

// Mapping: Cj→DEFAULT_USAGE
```

---

## Symbol Reference

Key functions in this document:

| Function | Obfuscated | Description |
|----------|-----------|-------------|
| `isPromptCachingSupported` | AJ9 | Check if caching is enabled for model |
| `getCacheControl` | wuA | Build cache_control with TTL |
| `applyUserMessageCacheBreakpoint` | $z7 | Add cache to user messages |
| `applyAssistantMessageCacheBreakpoint` | Cz7 | Add cache to assistant messages (excluding thinking) |
| `applyMessageCacheBreakpoints` | qz7 | Apply cache to last 2 messages |
| `formatSystemPromptWithCache` | Nz7 | Add cache to system blocks (excluding billing) |
| `formatSystemPrompt` | rO0 | Normalize system prompt order |
| `mergeUsage` | dhA | Merge streaming usage events |
| `aggregateUsage` | SH1 | Sum usage across calls |
| `streamQuery` | BJ9 | Main query function with cache integration |
| `calculateCost` | Lw3 | Cost calculation with cache tokens |
| `trackForkAgentQuery` | i77 | Cache hit rate telemetry |
| `DEFAULT_USAGE` | Cj | Initial usage object |

---

## Related Documents

- [prompt_cache_overview.md](./prompt_cache_overview.md) - Architecture overview
- [cache_strategies.md](./cache_strategies.md) - Usage patterns and optimization
