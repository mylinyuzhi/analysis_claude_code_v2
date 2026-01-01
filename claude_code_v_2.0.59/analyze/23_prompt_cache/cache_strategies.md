# Cache Strategies and Optimization

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Cache Point Selection Strategy

Claude Code implements a carefully designed caching strategy that balances cost savings with cache hit probability.

### Strategy Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Cache Point Selection                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        System Prompt                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────┐     │   │
│  │  │ "You are Claude Code..."                    cache_control ✓ │     │   │
│  │  └─────────────────────────────────────────────────────────────┘     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐     │   │
│  │  │ Tool definitions, instructions...           cache_control ✓ │     │   │
│  │  └─────────────────────────────────────────────────────────────┘     │   │
│  │                                                                       │   │
│  │  WHY: Stable content, reused every request, high hit probability    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          Messages                                     │   │
│  │                                                                       │   │
│  │  Message 1: "user: What is X?"                        NO CACHE       │   │
│  │  Message 2: "assistant: X is..."                      NO CACHE       │   │
│  │  Message 3: "user: How about Y?"                      NO CACHE       │   │
│  │  ...                                                                  │   │
│  │  Message N-1: "user: Latest question"          cache_control ✓       │   │
│  │  Message N: "assistant: Latest response"       cache_control ✓       │   │
│  │                                                                       │   │
│  │  WHY: Recent context most likely to be reused in follow-up          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        Thinking Blocks                                │   │
│  │                                                                       │   │
│  │  Message N: [                                                         │   │
│  │    { type: "thinking", thinking: "..." }          NEVER CACHED       │   │
│  │    { type: "text", text: "..." }                  cache_control ✓    │   │
│  │  ]                                                                    │   │
│  │                                                                       │   │
│  │  WHY: Large, variable content - caching would waste write costs     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Strategy 1: Cache All System Prompts

### Why System Prompts Are Ideal for Caching

| Characteristic | Impact on Caching |
|---------------|-------------------|
| **Stability** | System prompt rarely changes during a session |
| **Position** | Appears at prefix - maximum cache coverage |
| **Size** | Typically 5K-20K tokens - significant savings |
| **Frequency** | Included in EVERY API request |

### Implementation Details

```javascript
// Every system prompt block gets cache_control
function formatSystemPromptWithCache(systemPromptArray, cachingEnabled) {
  return formatSystemPrompt(systemPromptArray).map((textContent) => ({
    type: "text",
    text: textContent,
    ...(cachingEnabled ? { cache_control: buildCacheControlObject() } : {})
  }));
}
```

### Cost-Benefit Analysis

**Scenario:** Interactive session with 20 API calls, system prompt = 10K tokens

| Metric | Without Cache | With Cache |
|--------|--------------|------------|
| System prompt tokens | 10K × 20 = 200K | 10K (first) + 10K × 19 (cached) |
| Cost (Sonnet @ $3/Mtok) | $0.60 | $0.0375 (write) + $0.057 (reads) = $0.09 |
| **Savings** | - | **85%** |

---

## Strategy 2: Cache Last 2 Messages

### Why Only Last 2 Messages?

The decision to cache only the last 2 messages (not all messages) is based on careful trade-offs:

#### Arguments FOR caching more messages:
- Higher cache hit rate potential
- More context preserved in cache

#### Arguments AGAINST caching more messages:
1. **Diminishing returns:** Earlier messages less likely to be reused
2. **Cache write costs:** Each cache creation costs 25% more than regular input
3. **Cache invalidation:** Any change to earlier messages invalidates downstream cache
4. **Conversation dynamics:** Users typically build on recent context

### The "Last 2" Sweet Spot

```
Request 1: [M1] → Cache M1
Request 2: [M1, M2, M3] → M1 cache hit, Cache M2+M3
Request 3: [M1, M2, M3, M4, M5] → M1 hit, M2+M3 might hit, Cache M4+M5
```

**Pattern observation:** In typical Claude Code usage:
- Users ask follow-up questions
- Context builds incrementally
- Most relevant context is recent

### Implementation Logic

```javascript
// Cache window: index > length - 3
// For 6 messages: indices 4, 5 are cached (last 2)
return messages.map((message, index) => {
  const isInCacheWindow = index > messages.length - 3;
  // ...
});
```

---

## Strategy 3: Exclude Thinking Blocks

### Why Thinking Blocks Are Not Cached

Thinking blocks are explicitly excluded from caching for several critical reasons:

#### 1. Size Variability

```
┌────────────────────────────────────────────────────────────────┐
│ Thinking Block Size Distribution                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Simple task:   [████░░░░░░░░░░░░░░░░░░░░] ~1K tokens          │
│  Medium task:   [████████████░░░░░░░░░░░░] ~10K tokens         │
│  Complex task:  [████████████████████████] ~50K+ tokens        │
│                                                                 │
│  Regular text:  [██░░░░░░░░░░░░░░░░░░░░░░] ~500 tokens         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

Caching 50K tokens of thinking = $1.875 write cost (Sonnet)

#### 2. Content Variability

Even with identical prompts, thinking content varies:
- Different exploration paths
- Random seed effects
- Context-dependent reasoning

Low reuse probability = wasted cache write costs

#### 3. Privacy Considerations

Thinking blocks may contain:
- Internal reasoning steps
- Discarded ideas
- Sensitive intermediate thoughts

Not caching reduces cache storage of potentially sensitive content.

### Implementation

```javascript
// Explicitly check block type before adding cache_control
...(
  index === message.content.length - 1 &&
  block.type !== "thinking" &&
  block.type !== "redacted_thinking"  // Also exclude redacted thinking
    ? { cache_control: buildCacheControlObject() }
    : {}
)
```

---

## Strategy 4: Environment-Based Control

### Granular Disable Options

Claude Code provides fine-grained control over caching:

| Variable | Use Case |
|----------|----------|
| `DISABLE_PROMPT_CACHING` | Debug/test without cache effects |
| `DISABLE_PROMPT_CACHING_HAIKU` | Haiku cost already low, may not benefit |
| `DISABLE_PROMPT_CACHING_SONNET` | Test Sonnet without cache |
| `DISABLE_PROMPT_CACHING_OPUS` | Opus sessions may have different patterns |

### When to Disable Caching

#### Testing/Debugging
```bash
DISABLE_PROMPT_CACHING=true claude
```
Use when debugging token counting or cost issues.

#### Cost Optimization for Short Sessions
For single-request scripts, cache write cost may exceed savings:
```
Single request: 10K tokens
- Without cache: $0.03
- With cache: $0.0375 (cache write) + $0.003 (cache read) = $0.0405
```
No benefit unless cache is reused.

#### Model-Specific Optimization
```bash
# Haiku is already cheap, cache overhead may not be worth it
DISABLE_PROMPT_CACHING_HAIKU=true claude
```

---

## Strategy 5: TTL Optimization

### 5-Minute TTL (Default)

**Optimal for:**
- Interactive coding sessions
- Rapid back-and-forth conversations
- IDE integrations with frequent requests

**Characteristics:**
- Lower cache storage costs
- Matches typical request patterns
- Sufficient for most use cases

### 1-Hour TTL (Experiment)

**Optimal for:**
- Long-running sessions with breaks
- Batch processing with pauses
- Sessions spanning meetings/interruptions

**Characteristics:**
- Higher cache storage overhead
- Better for sporadic usage patterns
- Reduces cache misses from TTL expiry

### Experiment Flag Usage

```javascript
// Controlled by experiment system
const use1hCache = checkExperimentFlag(
  "prompt_cache_1h_experiment",
  "use_1h_cache",
  false
);
```

This allows Anthropic to:
1. A/B test TTL impact
2. Measure cost savings vs storage
3. Roll out gradually

---

## Optimization Recommendations

### For Claude Code Users

| Scenario | Recommendation |
|----------|----------------|
| Interactive session | Keep defaults (caching enabled) |
| Single API call | Consider disabling cache |
| Haiku for simple tasks | May disable Haiku cache |
| Long sessions with gaps | Request 1h TTL experiment |

### For API Integration Developers

1. **System prompt design:**
   - Keep system prompts stable
   - Avoid dynamic content in system prompt
   - Move variable content to messages

2. **Message structure:**
   - Design for cache-friendly patterns
   - Consider message ordering

3. **Cost monitoring:**
   - Track cache_read_input_tokens
   - Calculate cache hit rate
   - Adjust strategy based on data

---

## Metrics and Monitoring

### Key Metrics to Track

| Metric | Healthy Range | Action if Outside |
|--------|--------------|-------------------|
| Cache hit rate | >40% | Review message patterns |
| Cache creation vs read ratio | <0.5 | Reduce cache writes |
| Cost savings % | >30% | Verify cache is working |

### Cache Hit Rate Calculation

```javascript
cacheHitRate = cache_read_input_tokens /
  (input_tokens + cache_creation_input_tokens + cache_read_input_tokens)
```

### Telemetry Events

Claude Code tracks caching effectiveness via:
- `tengu_api_cache_breakpoints` - Cache point configuration
- `tengu_fork_agent_query` - Cache hit rate per query
- Token usage breakdown in cost display

---

## Common Pitfalls

### 1. Over-caching

**Problem:** Caching everything leads to high cache write costs.
**Solution:** Cache only stable, reusable content.

### 2. Under-caching

**Problem:** Not leveraging system prompt caching.
**Solution:** Ensure system prompts get cache_control.

### 3. TTL Mismatch

**Problem:** 5-minute TTL expires during long thinking.
**Solution:** Keep requests flowing or use 1h TTL.

### 4. Dynamic System Prompts

**Problem:** Changing system prompt every request invalidates cache.
**Solution:** Move dynamic content to messages.

---

## Summary: The Claude Code Caching Philosophy

1. **System prompts are gold** - Cache everything, highest ROI
2. **Recent context matters** - Cache last 2 messages only
3. **Thinking is ephemeral** - Never cache thinking blocks
4. **Flexibility is key** - Environment controls for edge cases
5. **Measure and adjust** - Track metrics, optimize strategy

---

## Related Documents

- [prompt_cache_overview.md](./prompt_cache_overview.md) - Architecture overview
- [cache_control_implementation.md](./cache_control_implementation.md) - Detailed code analysis
