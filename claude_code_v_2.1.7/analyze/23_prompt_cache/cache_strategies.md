# Cache Strategies and Optimization (Claude Code 2.1.7)

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform modules
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution modules

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
│  │  │ "x-anthropic-billing-header..."            NO cache_control │     │   │
│  │  └─────────────────────────────────────────────────────────────┘     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐     │   │
│  │  │ "You are Claude Code..."                   cache_control ✓  │     │   │
│  │  └─────────────────────────────────────────────────────────────┘     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐     │   │
│  │  │ Tool definitions, instructions...          cache_control ✓  │     │   │
│  │  └─────────────────────────────────────────────────────────────┘     │   │
│  │                                                                       │   │
│  │  WHY: Stable content, reused every request, high hit probability     │   │
│  │  NEW: Billing headers excluded (dynamic content)                     │   │
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

## Strategy 1: Cache All System Prompts (Except Billing Headers)

### Why System Prompts Are Ideal for Caching

| Characteristic | Impact on Caching |
|---------------|-------------------|
| **Stability** | System prompt rarely changes during a session |
| **Position** | Appears at prefix - maximum cache coverage |
| **Size** | Typically 5K-20K tokens - significant savings |
| **Frequency** | Included in EVERY API request |

### NEW in 2.1.x: Billing Header Exclusion

```javascript
// Billing headers are excluded from caching
function formatSystemPromptWithCache(systemPromptArray, cachingEnabled) {
  return formatSystemPrompt(systemPromptArray).map((textContent) => {
    const isBillingHeader = textContent.startsWith("x-anthropic-billing-header");

    return {
      type: "text",
      text: textContent,
      // Cache everything EXCEPT billing headers
      ...(cachingEnabled && !isBillingHeader ? { cache_control: getCacheControl() } : {})
    };
  });
}
```

**Why exclude billing headers?**
1. **Dynamic content:** May contain session-specific attribution info
2. **Low reuse:** Changes between requests/sessions
3. **Cost inefficiency:** Caching would waste write costs

### System Prompt Order

The system prompt is organized in this order:
1. **Billing header** (first, NOT cached)
2. **Agent identity** (second, cached)
3. **All other content joined** (cached as single block)

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

### Cache Window Examples

| Message Count | Cache Window Condition | Cached Message Indices |
|---------------|------------------------|------------------------|
| 2 | `idx > -1` | 0, 1 (all) |
| 4 | `idx > 1` | 2, 3 |
| 6 | `idx > 3` | 4, 5 |
| 10 | `idx > 7` | 8, 9 |

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
│  Complex task:  [████████████████████████] ~32K+ tokens        │
│                                                                 │
│  Regular text:  [██░░░░░░░░░░░░░░░░░░░░░░] ~500 tokens         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

Caching 32K tokens of thinking = $1.20 write cost (Sonnet)

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
    ? { cache_control: getCacheControl() }
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

## Strategy 6: Integration with Plan Mode

### Plan Mode System Reminders

When plan mode is active, additional system prompt content is added:

```javascript
// Plan mode prompt structure
const planModePrompt = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits...

## Plan File Info:
${planFileLocation}
${planFileInstructions}
`;
```

**Cache implications:**
- Plan mode prompts are relatively stable during planning
- They are cached as part of the system prompt
- Exiting plan mode invalidates the plan mode cache content

### System Reminders in Messages

System reminders are injected into **user messages** using:

```javascript
function wrapInSystemReminder(content) {
  return `<system-reminder>
${content}
</system-reminder>`;
}
```

**Cache interaction:**
- Reminders are part of user message content
- If in cache window (last 2 messages), they get cached
- Dynamic reminders should be minimized in cached messages

---

## Strategy 7: Tool Result Caching

### How Tool Results Are Cached

Tool results are stored as user messages with `tool_result` content blocks:

```javascript
{
  role: "user",
  content: [{
    type: "tool_result",
    tool_use_id: "toolu_...",
    content: "Result content here..."
  }]
}
```

**Cache behavior:**
- Tool results in the last 2 messages get cache_control
- Large tool results (file reads, grep results) benefit from caching
- Sequential tool calls may push earlier results out of cache window

### Optimization Tips

1. **Batch tool calls:** Multiple tools in one response keep results together
2. **Minimize intermediate steps:** Fewer messages = more cache hits
3. **Use streaming tool execution:** Reduces message count

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

### Usage Display Format

```javascript
// Format: input, output, cache read, cache write (cost)
const usageDisplay = `${inputTokens} input, ${outputTokens} output, ` +
                     `${cacheReadTokens} cache read, ${cacheCreationTokens} cache write ` +
                     `(${costUSD})`;
```

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

### 5. Large Thinking Blocks

**Problem:** Thinking blocks consume context but aren't cached.
**Solution:** This is intentional - thinking blocks are too variable to cache effectively.

### 6. Billing Header Caching (Fixed in 2.1.x)

**Problem:** Earlier versions may have cached billing headers.
**Solution:** v2.1.7 explicitly excludes billing headers from caching.

---

## Summary: The Claude Code Caching Philosophy

1. **System prompts are gold** - Cache everything except billing headers
2. **Recent context matters** - Cache last 2 messages only
3. **Thinking is ephemeral** - Never cache thinking blocks
4. **Flexibility is key** - Environment controls for edge cases
5. **Measure and adjust** - Track metrics, optimize strategy
6. **Dynamic content excluded** - Billing headers, variable content not cached

---

## Cost Savings Examples

### Example 1: Interactive Coding Session

**Scenario:** 30-minute session, 15 API calls, 10K token system prompt

| Without Cache | With Cache |
|---------------|------------|
| System: 10K × 15 = 150K tokens | System: 10K write + 10K × 14 read |
| Messages: 50K tokens | Messages: 30K write + 20K read |
| Total input cost: $0.60 | Write: $0.05, Read: $0.015 |
| | **Savings: ~89%** |

### Example 2: Background Agent Session

**Scenario:** Long-running agent, 100 turns, stable system prompt

| Without Cache | With Cache |
|---------------|------------|
| System: 15K × 100 = 1.5M tokens | System: 15K write + 15K × 99 read |
| Cost @ $3/Mtok: $4.50 | Write: $0.056, Read: $0.445 |
| | **Savings: ~89%** |

### Example 3: Single Query (No Benefit)

**Scenario:** One-shot query, no follow-up

| Without Cache | With Cache |
|---------------|------------|
| System: 10K tokens | System: 10K write (1.25x) |
| Cost @ $3/Mtok: $0.03 | Write: $0.0375 |
| | **No savings (actually more expensive)** |

---

---

## Additional Usage Contexts

### 1. Bash Command Path Extraction

When extracting file paths from bash command output, prompt caching is enabled:

```javascript
// ============================================
// extractCommandPaths - Uses prompt caching for path extraction
// Location: chunks.85.mjs:2698-2708
// ============================================

// READABLE (for understanding):
async function extractCommandPaths(command, output, signal, isNonInteractive) {
  return await simpleLLMQuery({
    systemPrompt: [PATH_EXTRACTION_PROMPT],
    userPrompt: `Command: ${command}\nOutput: ${output}`,
    enablePromptCaching: true,  // ← Caching enabled
    signal: signal,
    options: {
      querySource: "bash_extract_command_paths",
      agents: [],
      isNonInteractiveSession: isNonInteractive,
      hasAppendSystemPrompt: false,
      mcpTools: []
    }
  });
}
```

**Why enable caching here?**
- System prompt for path extraction is stable
- Multiple bash commands in a session benefit from cached system prompt

### 2. Session Summary for Resume

When generating conversation titles for session resume, caching is enabled:

```javascript
// ============================================
// summarizeForResume - Uses prompt caching for title generation
// Location: chunks.155.mjs:1478-1491
// ============================================

// READABLE (for understanding):
async function summarizeForResume(messages, isNonInteractive) {
  return await simpleLLMQuery({
    systemPrompt: [TITLE_GENERATION_PROMPT],
    userPrompt: conversationSummary,
    enablePromptCaching: true,  // ← Caching enabled
    signal: new AbortController().signal,
    options: {
      querySource: "summarize_for_resume",
      agents: [],
      isNonInteractiveSession: isNonInteractive,
      hasAppendSystemPrompt: false,
      mcpTools: []
    }
  });
}
```

### 3. Model Validation

When validating model availability, a test message with cache_control is sent:

```javascript
// ============================================
// validateModel - Uses cache_control in test message
// Location: chunks.120.mjs:698-714
// ============================================

// READABLE (for understanding):
async function validateModel(model) {
  try {
    return await sendMessage({
      model: model,
      max_tokens: 1,
      maxRetries: 0,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "Hi",
          cache_control: {
            type: "ephemeral"  // ← Cache control for validation
          }
        }]
      }]
    });
  } catch (error) {
    return handleValidationError(error, model);
  }
}
```

**Why include cache_control in validation?**
- Tests that the model supports caching features
- Validates full API capability

---

## Compaction and Cache Interaction

### Cache Tokens During Compaction

When auto-compaction or manual compaction occurs, the system tracks cache token usage:

```javascript
// ============================================
// Compaction telemetry includes cache metrics
// Location: chunks.132.mjs:547-556 and chunks.134.mjs:145-154
// ============================================

// READABLE (for understanding):
trackEvent("tengu_compact", {
  preCompactTokenCount: preCompactTokens,
  postCompactTokenCount: postCompactTokens,
  compactionInputTokens: compactionUsage?.input_tokens,
  compactionOutputTokens: compactionUsage?.output_tokens,
  compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
  compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
  compactionTotalTokens: compactionUsage
    ? compactionUsage.input_tokens +
      (compactionUsage.cache_creation_input_tokens ?? 0) +
      (compactionUsage.cache_read_input_tokens ?? 0) +
      compactionUsage.output_tokens
    : 0,
  // ... other metrics
});
```

**How compaction benefits from caching:**
1. **System prompt reuse** - Compaction uses cached system prompt
2. **Token accounting** - Cache tokens are tracked separately for cost analysis
3. **Efficiency metrics** - Cache hit rate during compaction indicates prompt stability

### Auto-compaction Cache Metrics

```javascript
// ============================================
// Auto-compaction success telemetry
// Location: chunks.134.mjs:145-154
// ============================================

trackEvent("tengu_auto_compact_succeeded", {
  originalMessageCount: messages.length,
  compactedMessageCount: summaryMessages.length + attachments.length + hookResults.length,
  preCompactTokenCount: preCompactTokens,
  postCompactTokenCount: postCompactTokens,
  compactionInputTokens: usage?.input_tokens,
  compactionOutputTokens: usage?.output_tokens,
  compactionCacheReadTokens: usage?.cache_read_input_tokens ?? 0,
  compactionCacheCreationTokens: usage?.cache_creation_input_tokens ?? 0,
  compactionTotalTokens: usage
    ? usage.input_tokens +
      (usage.cache_creation_input_tokens ?? 0) +
      (usage.cache_read_input_tokens ?? 0) +
      usage.output_tokens
    : 0,
  queryChainId: queryTracking.chainId,
  queryDepth: queryTracking.depth
});
```

---

## Display and Reporting

### Cost Display Format

The UI displays cache metrics in the following format:

```javascript
// ============================================
// Usage display format
// Location: chunks.46.mjs:1842
// ============================================

const usageDisplay = `${inputTokens} input, ${outputTokens} output, ` +
                     `${cacheReadTokens} cache read, ${cacheCreationTokens} cache write` +
                     (webSearchRequests > 0 ? `, ${webSearchRequests} web search` : "") +
                     ` (${formatCost(costUSD)})`;

// Example output:
// "1,234 input, 567 output, 890 cache read, 123 cache write ($0.05)"
```

### Session Totals

The system accumulates totals across an entire session:

```javascript
// ============================================
// Session total accumulation
// Location: chunks.46.mjs:1838
// ============================================

sessionTotals.inputTokens += usage.inputTokens;
sessionTotals.outputTokens += usage.outputTokens;
sessionTotals.cacheReadInputTokens += usage.cacheReadInputTokens;
sessionTotals.cacheCreationInputTokens += usage.cacheCreationInputTokens;
sessionTotals.webSearchRequests += usage.webSearchRequests;
sessionTotals.costUSD += usage.costUSD;
```

---

## Related Documents

- [prompt_cache_overview.md](./prompt_cache_overview.md) - Architecture overview
- [cache_control_implementation.md](./cache_control_implementation.md) - Detailed code analysis
