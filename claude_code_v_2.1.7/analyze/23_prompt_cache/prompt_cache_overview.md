# Prompt Cache Overview (Claude Code 2.1.7)

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform modules (includes Prompt Caching)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution modules

## Executive Summary

Claude Code implements Anthropic's prompt caching feature to achieve up to **90% cost reduction** on repeated API calls. The caching strategy focuses on:

1. **System prompts** - Always cached (stable across requests)
2. **Last 2 messages** - Cached for context continuity
3. **Thinking blocks excluded** - Large and variable content
4. **Billing headers excluded** - Dynamic content (NEW in 2.1.x)

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
│  │ isPromptCaching │◄── Environment Variables:                               │
│  │ Supported       │    DISABLE_PROMPT_CACHING                               │
│  │ (AJ9)           │    DISABLE_PROMPT_CACHING_HAIKU                         │
│  └────────┬────────┘    DISABLE_PROMPT_CACHING_SONNET                        │
│           │             DISABLE_PROMPT_CACHING_OPUS                          │
│           ▼                                                                  │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────┐     │
│  │ getCacheControl │───►│ { type: "ephemeral" }      (default: 5min)  │     │
│  │ Object (wuA)    │    │ { type: "ephemeral", ttl: "1h" } (experiment)│     │
│  └────────┬────────┘    └─────────────────────────────────────────────┘     │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Message Transformation Layer                       │    │
│  │  ┌──────────────────────┐  ┌──────────────────────┐                  │    │
│  │  │ formatSystemPrompt   │  │ applyMessageCache    │                  │    │
│  │  │ WithCache (Nz7)      │  │ Breakpoints (qz7)    │                  │    │
│  │  └──────────────────────┘  └──────────────────────┘                  │    │
│  │         │                           │                                 │    │
│  │         ▼                           ▼                                 │    │
│  │  ┌──────────────────┐    ┌──────────────────┐  ┌──────────────────┐  │    │
│  │  │ Exclude billing  │    │ $z7 - User msg   │  │ Cz7 - Assistant  │  │    │
│  │  │ headers from     │    │ cache breakpoint │  │ msg cache        │  │    │
│  │  │ cache_control    │    └──────────────────┘  │ (skip thinking)  │  │    │
│  │  └──────────────────┘                          └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         API Request Payload                          │    │
│  │  {                                                                   │    │
│  │    system: [                                                         │    │
│  │      { type: "text", text: "...", cache_control: {ephemeral} }  ✓   │    │
│  │      { type: "text", text: "billing...", NO cache_control }     ✗   │    │
│  │    ],                                                                │    │
│  │    messages: [                                                       │    │
│  │      { role: "user", content: [...] },                    (early)   │    │
│  │      { role: "assistant", content: [...] },               (early)   │    │
│  │      ...                                                             │    │
│  │      { role: "user", content: [..., cache_control] },     (N-1)  ✓  │    │
│  │      { role: "assistant", content: [..., cache_control] } (N)    ✓  │    │
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
│  │  }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Decision Functions

### 1. Cache Enable Decision (`isPromptCachingSupported`)

```
┌─────────────────────────────────────────────────────────┐
│          isPromptCachingSupported(model)                │
│                      (AJ9)                              │
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

### 2. Cache Breakpoint Strategy (`qz7`)

The `qz7` function (applyMessageCacheBreakpoints) applies cache_control to the **last 2 messages**:

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

### 3. System Prompt Cache Strategy

**NEW in 2.1.x:** Billing headers (`x-anthropic-billing-header`) are explicitly **excluded** from caching:

```javascript
// formatSystemPromptWithCache (Nz7) - chunks.147.mjs:492-502
return formatSystemPrompt(systemPromptArray).map((textContent) => {
  // Check if this is a billing header
  const isBillingHeader = textContent.startsWith("x-anthropic-billing-header");

  return {
    type: "text",
    text: textContent,
    // Add cache_control ONLY if caching enabled AND NOT a billing header
    ...(cachingEnabled && !isBillingHeader ? { cache_control: getCacheControl() } : {})
  };
});
```

**Why exclude billing headers?**
1. Billing headers may contain dynamic information
2. They change between requests/sessions
3. Caching them would waste cache write costs with low hit rate

## Cost-Benefit Analysis

### Pricing Model (per Million Tokens)

| Model | Regular Input | Cache Write (1.25x) | Cache Read (0.1x) | Savings on Hit |
|-------|--------------|---------------------|-------------------|----------------|
| Claude Sonnet 4.5 | $3.00 | $3.75 | $0.30 | **90%** |
| Claude Opus 4.5 | $15.00 | $18.75 | $1.50 | **90%** |
| Claude Sonnet 4 | $5.00 | $6.25 | $0.50 | **90%** |
| Claude Sonnet 4.5 (>200K) | $6.00 | $7.50 | $0.60 | **90%** |
| Claude Haiku 4.5 | $0.80 | $1.00 | $0.08 | **90%** |
| Claude Haiku 3.5 | $1.00 | $1.25 | $0.10 | **90%** |

### Cost Formula

```javascript
// calculateCost (Lw3) - chunks.46.mjs:1909-1910
totalCost =
    (input_tokens / 1M) * inputPrice +
    (output_tokens / 1M) * outputPrice +
    (cache_read_input_tokens / 1M) * promptCacheReadPrice +
    (cache_creation_input_tokens / 1M) * promptCacheWritePrice +
    (web_search_requests) * webSearchRequestPrice
```

### Cache Hit Rate Calculation

```javascript
// trackForkAgentQuery (i77) - chunks.134.mjs:2044-2045
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

## Integration with Plan Mode

Plan mode system reminders are injected into the system prompt and are cached like other system prompt content. The plan mode prompt includes:

1. **Plan file location and instructions**
2. **Restriction reminders** (read-only tools only)
3. **Exit plan mode instructions**

Since plan mode prompts are relatively stable during a planning session, they benefit from caching.

## Integration with System Reminders

System reminders (`<system-reminder>` tags) are injected into **user messages**, not system prompts. They are wrapped using:

```javascript
// Yh function - chunks.147.mjs:3212-3215
function wrapInSystemReminder(content) {
  return `<system-reminder>
${content}
</system-reminder>`;
}
```

**Cache implications:**
- System reminders are injected into user message content
- If the user message is in the cache window (last 2 messages), the reminder gets cached
- Dynamic reminders should be placed in messages outside the cache window when possible

## Integration with Tools

Tools themselves don't directly interact with the cache system, but:

1. **Tool results** are stored in user messages (tool_result type)
2. **Tool use requests** are in assistant messages
3. Both are subject to the "last 2 messages" cache breakpoint strategy

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
trackEvent("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: enablePromptCaching
});

// Fork agent query telemetry
trackEvent("tengu_fork_agent_query", {
    cacheReadInputTokens: usage.cache_read_input_tokens,
    cacheCreationInputTokens: usage.cache_creation_input_tokens,
    cacheHitRate: cacheHitRate,
    cacheCreationEphemeral1hTokens: usage.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: usage.cache_creation.ephemeral_5m_input_tokens,
    // ...
});
```

## Integration with Compaction

When auto-compaction or manual compaction occurs, the system tracks cache token usage:

```javascript
// Compaction telemetry includes cache metrics
trackEvent("tengu_auto_compact_succeeded", {
  compactionCacheReadTokens: usage?.cache_read_input_tokens ?? 0,
  compactionCacheCreationTokens: usage?.cache_creation_input_tokens ?? 0,
  compactionTotalTokens: usage
    ? usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) +
      (usage.cache_read_input_tokens ?? 0) + usage.output_tokens
    : 0,
  // ...
});
```

**How compaction benefits from caching:**
1. **System prompt reuse** - Compaction uses cached system prompt
2. **Token accounting** - Cache tokens tracked separately for cost analysis
3. **Efficiency metrics** - Cache hit rate during compaction indicates prompt stability

## Additional Usage Contexts

Prompt caching is also enabled in these auxiliary functions:

| Function | Location | Purpose |
|----------|----------|---------|
| `extractCommandPaths` | chunks.85.mjs:2698 | Extract file paths from bash output |
| `summarizeForResume` | chunks.155.mjs:1478 | Generate conversation titles |
| `validateModel` | chunks.120.mjs:698 | Test model availability with cache_control |

---

## Changes from v2.0.59 to v2.1.7

| Aspect | v2.0.59 | v2.1.7 |
|--------|---------|--------|
| Billing header handling | Not excluded | Explicitly excluded from cache |
| Function: isPromptCachingSupported | `UE9` | `AJ9` |
| Function: getCacheControl | `jSA` | `wuA` |
| Function: applyUserMessageCache | `gv3` | `$z7` |
| Function: applyAssistantMessageCache | `uv3` | `Cz7` |
| Function: applyMessageCacheBreakpoints | `mv3` | `qz7` |
| Function: formatSystemPromptWithCache | `dv3` | `Nz7` |
| Function: mergeUsage | `ljA` | `dhA` |
| Function: aggregateUsage | `vI1` | `SH1` |
| Function: calculateCost | `or8` | `Lw3` |
| Function: trackForkAgentQuery | `z_3` | `i77` |

## Files Reference

| File | Lines | Content |
|------|-------|---------|
| chunks.146.mjs | 2872-2886 | `isPromptCachingSupported` (AJ9) |
| chunks.146.mjs | 2889-2895 | `getCacheControl` (wuA) |
| chunks.146.mjs | 2948-2972 | `applyUserMessageCacheBreakpoint` ($z7) |
| chunks.146.mjs | 2975-3000 | `applyAssistantMessageCacheBreakpoint` (Cz7) |
| chunks.147.mjs | 483-490 | `applyMessageCacheBreakpoints` (qz7) |
| chunks.147.mjs | 492-502 | `formatSystemPromptWithCache` (Nz7) |
| chunks.147.mjs | 447-462 | `mergeUsage` (dhA) |
| chunks.147.mjs | 465-480 | `aggregateUsage` (SH1) |
| chunks.46.mjs | 1909-1910 | `calculateCost` (Lw3) |
| chunks.46.mjs | 1961-2007 | Pricing model definitions |
| chunks.134.mjs | 2036-2063 | `trackForkAgentQuery` (i77) - cache hit rate |
| chunks.133.mjs | 2563-2577 | `formatSystemPrompt` (rO0) - billing header handling |

## Related Documents

- [cache_control_implementation.md](./cache_control_implementation.md) - Detailed code analysis
- [cache_strategies.md](./cache_strategies.md) - Usage patterns and optimization
