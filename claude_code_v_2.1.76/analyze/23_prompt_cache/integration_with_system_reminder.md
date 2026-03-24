# Integration with System Reminders

## Overview

This document details how the prompt cache system integrates with system reminders to provide real-time feedback to the model about token usage, budget constraints, and caching effectiveness. System reminders are meta-messages (user-role with `isMeta: true`) that inform the model about session state without being visible to the end user.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (System Reminders)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (State Management)

Key functions in this document:
- `getTokenUsageAttachment` (qmY) - Creates token usage attachment for system reminders
- `getBudgetUsdAttachment` (YmY) - Creates budget attachment for system reminders
- `aggregateTokenUsage` (Tm3) - Accumulates token usage including cache stats
- `recordTokenUsage` (s21) - Records usage with telemetry
- `calculateCacheHitRate` - Calculates cache effectiveness metric

---

## Token Usage Attachment

### getTokenUsageAttachment (qmY)

**What it does:** Creates a token usage attachment that gets injected into system reminders, showing the model how many tokens have been used in the session.

```javascript
// ============================================
// getTokenUsageAttachment - Create token usage attachment for reminders
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
    // Feature flag check - must be enabled via environment variable
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

**When it's used:**
- During attachment production in the main agent loop
- Provides context for the model to understand token budget constraints
- Helps the model make decisions about context usage (e.g., whether to use verbose responses)

**Why feature flag:** The token usage attachment can add significant tokens to each reminder. The feature flag allows operators to disable it for cost-sensitive scenarios.

---

## Budget USD Attachment

### getBudgetUsdAttachment (YmY)

**What it does:** Creates a budget attachment that shows the model the remaining budget, helping it understand cost constraints.

```javascript
// ============================================
// getBudgetUsdAttachment - Create budget attachment for reminders
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
    // If no budget is set, return empty
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

**When it's used:**
- When the user specifies a budget via CLI flag or configuration
- During attachment production for main agent (not subagents)
- Helps the model understand when it should be more cost-conscious

**Budget Warning Integration:**

When the remaining budget falls below certain thresholds, the system may inject additional warnings:

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  BUDGET WARNING                                              │
│                                                                 │
│ You've used $4.50 of your $5.00 budget (90%).                  │
│                                                                 │
│ Current session costs:                                          │
│   Input:    $1.20                                               │
│   Output:   $0.80                                               │
│   Cache:    $0.30 (saved $2.50)                                 │
│   ──────────────────                                            │
│   Total:    $2.30                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cache Statistics in Compaction

### Cache Token Tracking During Compaction

When auto-compaction occurs, cache statistics are tracked and reported:

```javascript
// ============================================
// Compaction cache telemetry
// Location: chunks.147.mjs:1574-1582
// ============================================

// Cache tokens are tracked during compaction:
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

### Cache Hit Rate Calculation

```javascript
// ============================================
// Cache hit rate calculation during compaction
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
    if (usage.cache_read_input_tokens <= 0) {
        return 0;
    }

    let totalInputTokens =
        usage.cache_read_input_tokens +
        usage.cache_creation_input_tokens +
        usage.input_tokens;

    return usage.cache_read_input_tokens / totalInputTokens;
}
```

**What this metric tells you:**
- **0%**: No cache hits (first request, or caching disabled)
- **1-30%**: Low hit rate (short sessions, frequent prompt changes)
- **30-60%**: Moderate hit rate (normal for mixed workloads)
- **60-85%**: Good hit rate (effective caching)
- **85%+**: Excellent hit rate (long sessions, stable prompts)

---

## Attachment Production Pipeline

### How Cache Stats Flow into Reminders

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCTION FLOW                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  1. API Response Received                                                     │
│     - Contains usage stats: input, output, cache_read, cache_creation       │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  2. recordTokenUsage (s21)                                                    │
│     - Aggregate into session total                                           │
│     - Update cost tracker                                                    │
│     - Record to telemetry collectors                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  3. Next Turn - Attachment Production                                         │
│     - assembleAllAttachments() is called                                     │
│     - Main-agent-only producers run (including token/budget)                │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  4. getTokenUsageAttachment (qmY)                                             │
│     - Get current token usage from context                                   │
│     - Format as attachment object                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  5. getBudgetUsdAttachment (YmY)                                              │
│     - Get total session cost                                                 │
│     - Calculate remaining budget                                             │
│     - Format as attachment object                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  6. normalizeAttachmentForAPI (Ui8)                                           │
│     - Convert attachments to user messages                                   │
│     - Wrap in <system-reminder> XML tags                                     │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  7. Injection into Message Stream                                             │
│     - Attachments appear as meta user messages                               │
│     - Model sees token/budget context                                        │
│     - User doesn't see these messages in UI                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration with Auth State

### How Authentication Affects Cache Attachments

| Auth State | TTL | Budget Warning | Token Usage Attachment |
|------------|-----|----------------|------------------------|
| API Key | 5-min | Yes (if budget set) | Yes (if enabled) |
| OAuth (normal) | 1h (if in allowlist) | Yes (if budget set) | Yes (if enabled) |
| OAuth (overage) | 5-min | Always | Yes (if enabled) |
| Bedrock | 1h (if env var set) | Yes (if budget set) | Yes (if enabled) |

**Key insight:** The token usage and budget attachments are independent of the cache TTL decision. They provide visibility into usage regardless of caching mode.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | Enable token usage in system reminders |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disable all attachment production (including token/budget) |

---

## Telemetry Events

| Event | Data | Purpose |
|-------|------|---------|
| `tengu_attachment_compute_duration` | `label`, `duration`, `error` | Track attachment production time |
| `tengu_compact_cache_sharing_success` | `sessionId` | Track successful cache prefix sharing |
| `tengu_compact_cache_sharing_fallback` | `reason`, `preCompactTokenCount` | Track when cache sharing fails |

---

## Complete Attachment Flow

### Producer Functions

The prompt cache system produces two main attachment types for system reminders:

```javascript
// ============================================
// getTokenUsageAttachment - Token usage for model context
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
function getTokenUsageAttachment(messages, mainLoopModel) {
    // Feature flag check
    if (!parseBoolean(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) {
        return [];
    }

    let totalTokens = getModelContextLimit(mainLoopModel);
    let usedTokens = countMessagesTokens(messages);

    return [{
        type: "token_usage",
        used: usedTokens,
        total: totalTokens,
        remaining: totalTokens - usedTokens
    }];
}

// Mapping: qmY->getTokenUsageAttachment, A->messages, q->mainLoopModel,
//   t6->parseBoolean, OF->getModelContextLimit, Ck->countMessagesTokens
```

```javascript
// ============================================
// getBudgetUsdAttachment - Budget status for model context
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
function getBudgetUsdAttachment(maxBudgetUsd) {
    // No budget set - return empty
    if (maxBudgetUsd === undefined) {
        return [];
    }

    let usedCost = getTotalSessionCost();
    let remaining = maxBudgetUsd - usedCost;

    return [{
        type: "budget_usd",
        used: usedCost,
        total: maxBudgetUsd,
        remaining: remaining
    }];
}

// Mapping: YmY->getBudgetUsdAttachment, A->maxBudgetUsd, q->usedCost,
//   K->remaining, LD->getTotalSessionCost
```

### Normalization and Injection

```javascript
// ============================================
// normalizeAttachmentForAPI - Convert attachment to user message
// Location: chunks.174.mjs:3-468
// ============================================

function Ui8(A) {
    // ... team context handling ...

    switch (A.type) {
        case "token_usage":
            return [createUserMessage({
                content: wrapInXmlTag(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
                isMeta: true
            })];

        case "budget_usd":
            return [createUserMessage({
                content: wrapInXmlTag(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
                isMeta: true
            })];

        // ... other attachment types ...
    }
}

// Mapping: Ui8->normalizeAttachmentForAPI, A->attachment
```

### Complete Injection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE ATTACHMENT PRODUCTION FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘

Turn N API Response
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  1. recordTokenUsage (s21) - chunks.57.mjs:17-39                              │
│                                                                               │
│     - Tm3: Aggregate into session totals                                      │
│     - ax1: Update cost tracker (budget warnings)                              │
│     - Bw6: Record to telemetry collectors                                     │
│                                                                               │
│     Key data updated:                                                         │
│     - sessionUsage.inputTokens += usage.input_tokens                          │
│     - sessionUsage.outputTokens += usage.output_tokens                        │
│     - sessionUsage.cacheReadInputTokens += usage.cache_read_input_tokens      │
│     - sessionUsage.cacheCreationInputTokens += usage.cache_creation_input_tok │
│     - sessionUsage.costUSD += cost                                            │
└───────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  2. Turn N+1 begins - assembleAllAttachments()                                │
│                                                                               │
│     Called at start of each new API request preparation                       │
│     Runs all attachment producers in sequence                                 │
└───────────────────────────────────────────────────────────────────────────────┘
        │
        ├──► qmY (getTokenUsageAttachment)
        │    └── Returns: [{ type: "token_usage", used, total, remaining }]
        │
        └──► YmY (getBudgetUsdAttachment)
             └── Returns: [{ type: "budget_usd", used, total, remaining }]
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  3. normalizeAttachmentForAPI (Ui8) - chunks.174.mjs:3                        │
│                                                                               │
│     For each attachment:                                                      │
│     - Create user message with isMeta: true                                   │
│     - Wrap content in <system-reminder> tags                                  │
│     - Return array of normalized messages                                     │
│                                                                               │
│     Result for token_usage:                                                   │
│     {                                                                         │
│       role: "user",                                                           │
│       content: "<system-reminder>\nToken usage: 45000/200000; 155000 remainin│
│       isMeta: true                                                            │
│     }                                                                         │
│                                                                               │
│     Result for budget_usd:                                                    │
│     {                                                                         │
│       role: "user",                                                           │
│       content: "<system-reminder>\nUSD budget: $1.25/$5.00; $3.75 remaining\n│
│       isMeta: true                                                            │
│     }                                                                         │
└───────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  4. Message Stream Assembly                                                   │
│                                                                               │
│     Normalized attachments are appended to the message array:                 │
│                                                                               │
│     [                                                                         │
│       { role: "user", content: "First message..." },                          │
│       { role: "assistant", content: "Response..." },                          │
│       { role: "user", content: "...", isMeta: true },  // token_usage         │
│       { role: "user", content: "...", isMeta: true },  // budget_usd          │
│       { role: "user", content: "Next user message..." }                       │
│     ]                                                                         │
│                                                                               │
│     Note: Meta messages are not displayed in UI                               │
└───────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│  5. API Request Sent                                                          │
│                                                                               │
│     Model receives token/budget context in message stream                     │
│     Model can make informed decisions about:                                  │
│     - Token usage (context remaining)                                         │
│     - Cost awareness (budget remaining)                                       │
│     - Response length decisions                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## UI Display vs Model Context

### What the Model Sees

The model receives attachments as user messages wrapped in `<system-reminder>` tags:

```xml
<system-reminder>
Token usage: 45000/200000; 155000 remaining
</system-reminder>

<system-reminder>
USD budget: $1.25/$5.00; $3.75 remaining
</system-reminder>
```

### What the User Sees

Users do NOT see these messages in the conversation UI. However, they can see:

1. **Status Line** - Real-time token/cost display
2. **End-of-Session Summary** - Complete token breakdown
3. **Budget Warnings** - Visual alerts when approaching limits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VISIBILITY COMPARISON                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MODEL SEES:                          USER SEES:                            │
│  ─────────────                        ───────────                           │
│  <system-reminder>                    Status line: "$0.47 | 45K tokens"     │
│  Token usage: 45000/200000                                                   │
│  </system-reminder>                   Budget warning modal (if threshold)   │
│                                                                              │
│  <system-reminder>                    End-of-session:                       │
│  USD budget: $1.25/$5.00              "Usage by model: sonnet: 125K in..."  │
│  </system-reminder>                                                          │
│                                                                              │
│  Model uses for:                      User uses for:                        │
│  - Context management                 - Cost awareness                       │
│  - Budget-conscious decisions         - Session planning                     │
│  - Response length optimization       - Usage tracking                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cache Statistics Visibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CACHE STATS VISIBILITY MATRIX                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Metric              │ Model Context │ UI Status │ Session Summary │        │
│  ────────────────────┼───────────────┼───────────┼─────────────────┤        │
│  input_tokens        │      ✗        │     ✓     │        ✓        │        │
│  output_tokens       │      ✗        │     ✓     │        ✓        │        │
│  cache_read_tokens   │      ✗        │     ✓     │        ✓        │        │
│  cache_write_tokens  │      ✗        │     ✓     │        ✓        │        │
│  total_cost          │      ✗        │     ✓     │        ✓        │        │
│  context_remaining   │      ✓        │     ✓     │        ✓        │        │
│  budget_remaining    │      ✓        │     ✓     │        ✓        │        │
│  cache_hit_rate      │      ✗        │     ✗     │        ✗        │        │
│                                                                              │
│  Notes:                                                                      │
│  - Model gets context_remaining via token_usage attachment                   │
│  - Model gets budget_remaining via budget_usd attachment                     │
│  - Cache hit rate is computed but only logged to telemetry                   │
│  - User sees all token counts in session summary                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cache Hit Rate in Reminders

### Computation

The cache hit rate is computed during compaction and logged to telemetry:

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
function calculateCacheHitRate(totalUsage) {
    if (totalUsage.cache_read_input_tokens <= 0) {
        return 0;
    }

    let totalInputTokens =
        totalUsage.cache_read_input_tokens +
        totalUsage.cache_creation_input_tokens +
        totalUsage.input_tokens;

    return totalUsage.cache_read_input_tokens / totalInputTokens;
}
```

### Interpretation Guide

| Hit Rate | Interpretation | Action |
|----------|---------------|--------|
| 0% | Cold cache | First turn or cache invalidation |
| 1-30% | Low | Frequent prompt changes |
| 30-60% | Moderate | Normal mixed workload |
| 60-85% | Good | Effective caching |
| 85%+ | Excellent | Long session, stable prompts |

### Why Not Exposed to Model

The cache hit rate is NOT included in system reminders because:

1. **Model doesn't need it** - The model's behavior doesn't change based on cache efficiency
2. **Token overhead** - Adding this information costs tokens without benefit
3. **User metric** - This is primarily useful for the user/operator, not the model
4. **Telemetry value** - More valuable for analytics and debugging

---

## Budget Warning Integration

### Threshold-Based Warning System

```javascript
// ============================================
// Budget warning thresholds
// ============================================

const BUDGET_WARNING_THRESHOLDS = {
    warning: 0.75,    // 75% used
    critical: 0.90,   // 90% used
    exceeded: 1.0     // 100% used (budget exceeded)
};

function checkBudgetStatus(used, total) {
    let ratio = used / total;

    if (ratio >= 1.0) {
        // Budget exceeded - may need to stop
        return {
            level: "exceeded",
            color: "red",
            shouldStop: true
        };
    } else if (ratio >= 0.90) {
        // Critical warning
        return {
            level: "critical",
            color: "orange",
            shouldWarn: true
        };
    } else if (ratio >= 0.75) {
        // Early warning
        return {
            level: "warning",
            color: "yellow",
            shouldIndicate: true
        };
    }

    return { level: "normal" };
}
```

### Model Awareness of Budget

The model receives budget information via the `budget_usd` attachment:

```xml
<system-reminder>
USD budget: $4.50/$5.00; $0.50 remaining
</system-reminder>
```

This allows the model to:
1. Be aware of remaining budget
2. Potentially adjust response verbosity
3. Consider cost in tool usage decisions

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.147.mjs` | `qmY`, `YmY` | Token usage and budget attachments |
| `chunks.57.mjs` | `Tm3`, `s21` | Token usage aggregation and recording |
| `chunks.174.mjs` | `Ui8` | Attachment normalization |
| `chunks.173.mjs` | `b5`, `p1` | XML wrapping and message creation |
| `chunks.166.mjs` | Various | Session state management |

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture
- [../04_system_reminder/types_status_budget.md](../04_system_reminder/types_status_budget.md) - Status and budget reminder types
- [ui_integration.md](./ui_integration.md) - UI display of cache statistics
- [compaction_integration.md](./compaction_integration.md) - Cache prefix sharing during compaction