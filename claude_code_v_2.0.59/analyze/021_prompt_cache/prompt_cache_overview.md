# Prompt Cache Overview

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Executive Summary

Claude Code implements Anthropic's prompt caching feature to achieve up to **90% cost reduction** on repeated API calls. The caching strategy focuses on:

1. **System prompts** - Always cached (stable across requests)
2. **Last 2 messages** - Cached for context continuity
3. **Thinking blocks excluded** - Large and variable content

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Claude Code LLM API Flow                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Request                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                         │
│  │ shouldEnable    │◄── Environment Variables:                               │
│  │ PromptCaching   │    DISABLE_PROMPT_CACHING                               │
│  │ (UE9)           │    DISABLE_PROMPT_CACHING_HAIKU                         │
│  └────────┬────────┘    DISABLE_PROMPT_CACHING_SONNET                        │
│           │             DISABLE_PROMPT_CACHING_OPUS                          │
│           ▼                                                                  │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────┐     │
│  │ buildCacheCtrl  │───►│ { type: "ephemeral" }      (default: 5min)  │     │
│  │ Object (jSA)    │    │ { type: "ephemeral", ttl: "1h" } (experiment)│     │
│  └────────┬────────┘    └─────────────────────────────────────────────┘     │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Message Transformation Layer                       │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │ formatSystemWith │  │ formatUserWith   │  │ formatAssistWith │   │    │
│  │  │ Cache (dv3)      │  │ Cache (gv3)      │  │ Cache (uv3)      │   │    │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         API Request Payload                          │    │
│  │  {                                                                   │    │
│  │    system: [                                                         │    │
│  │      { type: "text", text: "...", cache_control: {ephemeral} }  ✓   │    │
│  │    ],                                                                │    │
│  │    messages: [                                                       │    │
│  │      { role: "user", content: [...] },                              │    │
│  │      { role: "assistant", content: [...] },                         │    │
│  │      ...                                                             │    │
│  │      { role: "user", content: [..., cache_control] },           ✓   │    │
│  │      { role: "assistant", content: [..., cache_control] }       ✓   │    │
│  │    ]                                                                 │    │
│  │  }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                         │
│  │ Anthropic API   │                                                         │
│  │ (Streaming)     │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Usage Response                               │    │
│  │  {                                                                   │    │
│  │    input_tokens: 1000,                                               │    │
│  │    cache_creation_input_tokens: 5000,   ← First request (write)     │    │
│  │    cache_read_input_tokens: 0,                                       │    │
│  │    cache_creation: {                                                 │    │
│  │      ephemeral_1h_input_tokens: 0,                                   │    │
│  │      ephemeral_5m_input_tokens: 5000                                 │    │
│  │    }                                                                 │    │
│  │  }                                                                   │    │
│  │  ─────────────────── OR (subsequent request) ───────────────────    │    │
│  │  {                                                                   │    │
│  │    input_tokens: 1000,                                               │    │
│  │    cache_creation_input_tokens: 0,                                   │    │
│  │    cache_read_input_tokens: 5000,       ← Cache hit! (read)         │    │
│  │    cache_creation: { ... }                                           │    │
│  │  }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Decision Functions

### 1. Cache Enable Decision (`shouldEnablePromptCaching`)

```
┌─────────────────────────────────────────────────────────┐
│              shouldEnablePromptCaching(model)            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  DISABLE_PROMPT_CACHING=true? ──────► return false      │
│           │ no                                           │
│           ▼                                              │
│  DISABLE_PROMPT_CACHING_HAIKU=true                      │
│  AND model === haiku? ──────────────► return false      │
│           │ no                                           │
│           ▼                                              │
│  DISABLE_PROMPT_CACHING_SONNET=true                     │
│  AND model === sonnet? ─────────────► return false      │
│           │ no                                           │
│           ▼                                              │
│  DISABLE_PROMPT_CACHING_OPUS=true                       │
│  AND model === opus? ───────────────► return false      │
│           │ no                                           │
│           ▼                                              │
│                     return true                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2. Cache Breakpoint Strategy (`mv3`)

The `mv3` function (obfuscated `mapMessagesWithCache`) applies cache_control to the last 2 messages:

```
Message Index:    0    1    2    3    4    5   (length = 6)
                  │    │    │    │    │    │
                  ▼    ▼    ▼    ▼    ▼    ▼
Condition:     idx>3? No   No   No   Yes  Yes
              (idx > length - 3)
                  │    │    │    │    │    │
                  ▼    ▼    ▼    ▼    ▼    ▼
Cache Control:    ✗    ✗    ✗    ✗    ✓    ✓
```

**Why last 2 messages?**
- Recent context is most likely to be reused in follow-up requests
- Earlier messages change frequently as conversation grows
- Optimal balance between cache hits and cache write costs

## Cost-Benefit Analysis

### Pricing Model (per Million Tokens)

| Model | Regular Input | Cache Write (1.25x) | Cache Read (0.1x) | Savings on Hit |
|-------|--------------|---------------------|-------------------|----------------|
| Claude 3.5 Sonnet | $3.00 | $3.75 | $0.30 | **90%** |
| Claude Opus 4.5 | $15.00 | $18.75 | $1.50 | **90%** |
| Claude 3 Sonnet | $5.00 | $6.25 | $0.50 | **90%** |
| Claude 3.5 Sonnet (>200K) | $6.00 | $7.50 | $0.60 | **90%** |
| Claude 3.5 Haiku | $0.80 | $1.00 | $0.08 | **90%** |
| Claude 3 Haiku | $1.00 | $1.25 | $0.10 | **90%** |

### Cost Formula

```javascript
totalCost =
    (input_tokens / 1M) * inputPrice +
    (output_tokens / 1M) * outputPrice +
    (cache_read_input_tokens / 1M) * promptCacheReadPrice +
    (cache_creation_input_tokens / 1M) * promptCacheWritePrice
```

### Cache Hit Rate Calculation

```javascript
// Location: chunks.145.mjs:1036-1037
totalInputTokens = input_tokens + cache_creation_input_tokens + cache_read_input_tokens;
cacheHitRate = totalInputTokens > 0 ? cache_read_input_tokens / totalInputTokens : 0;
```

## Cache TTL Options

### Default: 5-Minute TTL

```javascript
{ type: "ephemeral" }  // Default TTL is 5 minutes
```

**Use case:** Standard interactive sessions where requests are typically within 5 minutes

### Experiment: 1-Hour TTL

```javascript
{ type: "ephemeral", ttl: "1h" }  // Extended TTL
```

**Controlled by:** `prompt_cache_1h_experiment` experiment flag with key `use_1h_cache`

**Use case:**
- Long-running sessions with gaps
- Batch processing with periodic breaks
- Reducing cache write costs over extended periods

## Metrics Tracking

Claude Code tracks comprehensive cache metrics:

| Metric | Description |
|--------|-------------|
| `cache_read_input_tokens` | Tokens read from cache (cost savings) |
| `cache_creation_input_tokens` | Tokens used to create cache entries |
| `ephemeral_1h_input_tokens` | Cache tokens with 1-hour TTL |
| `ephemeral_5m_input_tokens` | Cache tokens with 5-minute TTL |
| `cacheHitRate` | Ratio of cache reads to total input |

### Telemetry Events

```javascript
// Cache breakpoint telemetry
GA("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: enablePromptCaching
});

// Fork agent query telemetry
GA("tengu_fork_agent_query", {
    cacheReadInputTokens: usage.cache_read_input_tokens,
    cacheCreationInputTokens: usage.cache_creation_input_tokens,
    cacheHitRate: cacheHitRate,
    // ...
});
```

## Files Reference

| File | Lines | Content |
|------|-------|---------|
| chunks.152.mjs | 2690-2705 | `shouldEnablePromptCaching` (UE9) |
| chunks.152.mjs | 2707-2714 | `buildCacheControlObject` (jSA) |
| chunks.152.mjs | 2766-2791 | `formatUserMessageWithCache` (gv3) |
| chunks.152.mjs | 2793-2818 | `formatAssistantMessageWithCache` (uv3) |
| chunks.153.mjs | 406-413 | `mapMessagesWithCache` (mv3) |
| chunks.153.mjs | 415-423 | `formatSystemPromptWithCache` (dv3) |
| chunks.153.mjs | 370-386 | `mergeUsage` (ljA) |
| chunks.153.mjs | 388-404 | `aggregateUsage` (vI1) |
| chunks.56.mjs | 3145-3147 | Cost calculation |
| chunks.56.mjs | 3197-3243 | Pricing model definitions |
| chunks.145.mjs | 1036-1050 | Cache hit rate calculation |

## Related Documents

- [cache_control_implementation.md](./cache_control_implementation.md) - Detailed code analysis
- [cache_strategies.md](./cache_strategies.md) - Usage patterns and optimization
