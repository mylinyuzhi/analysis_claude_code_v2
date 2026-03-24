# UI Integration and Cache Statistics Display

## Overview

This document covers how prompt cache statistics are displayed to users, including token usage tracking, cache hit rate visualization, and billing attribution display. The UI integration provides visibility into caching performance and cost savings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Prompt Building)
> - [overview.md](./overview.md) - Prompt cache system overview

Key functions in this document:
- `aggregateTokenUsage` (Tm3) - Accumulates token usage from API responses
- `recordTokenUsage` (s21) - Records token usage with telemetry
- `calculateApiCost` (wT9) - Calculates monetary cost including cache tokens
- `getModelPricing` (OT9) - Returns pricing for a given model
- `formatUsageByModel` (Gm3) - Formats per-model token usage for display
- `formatSessionStats` (a21) - Formats complete session statistics
- `formatCost` (gx6) - Formats USD cost with appropriate precision
- `getAttributionHeader` (m21) - Builds billing header string
- `getTokenUsageAttachment` (qmY) - Creates token usage attachment for system reminders
- `getBudgetUsdAttachment` (YmY) - Creates budget attachment for system reminders

---

## Token Usage Tracking

### Usage Data Structure

The system tracks comprehensive token usage including cache statistics:

```typescript
interface TokenUsage {
    inputTokens: number;           // Regular input tokens
    outputTokens: number;          // Output tokens generated
    cacheReadInputTokens: number;  // Tokens read from cache (cheaper)
    cacheCreationInputTokens: number;  // Tokens written to cache
    webSearchRequests: number;     // Web search API calls
    costUSD: number;               // Total cost in USD
    contextWindow: number;         // Context window size
    maxOutputTokens: number;       // Max output tokens for model
}
```

### Multi-Collector Architecture

The system distributes token data to multiple collectors for different purposes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TOKEN USAGE DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    API Response with Usage                                   │
│   {                                                                          │
│     input_tokens: 15000,                                                    │
│     output_tokens: 3200,                                                    │
│     cache_read_input_tokens: 85000,                                         │
│     cache_creation_input_tokens: 5000                                       │
│   }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    recordTokenUsage (s21)                                    │
│                    chunks.57.mjs:17-39                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ Session Tracker │  │  Cost Tracker   │  │ Telemetry Collectors │
│  (Tm3 aggregate)│  │ (Budget warnings)│  │ (Real-time display) │
│                 │  │                 │  │                     │
│ Per-model usage │  │ Total cost      │  │ Token counters      │
│ cacheRead       │  │ Budget tracking │  │ by type:            │
│ cacheCreation   │  │                 │  │ - input             │
│ inputTokens     │  │                 │  │ - output            │
│ outputTokens    │  │                 │  │ - cacheRead         │
│ costUSD         │  │                 │  │ - cacheCreation     │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ End-of-session  │  │ Budget warning  │  │ Real-time UI        │
│ stats display   │  │ UI component    │  │ streaming display   │
│ (formatSession  │  │ (when budget    │  │ during API calls    │
│  Stats)         │  │  set)           │  │                     │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
```

**Why this architecture:**
- **Separation of concerns**: Each collector serves a distinct purpose
- **Session Tracker**: Provides persistent storage for end-of-session summaries
- **Cost Tracker**: Enables real-time budget enforcement and warnings
- **Telemetry Collectors**: Feed live displays and analytics pipelines
- **Loose coupling**: Collectors are optional (`?.` null-safe calls), system works without them

### aggregateTokenUsage (Tm3)

**What it does:** Accumulates token usage from an API response into a running total for the session.

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
    // Get or initialize session tracker for this model
    let tracker = getSessionTokenTracker(model) ?? {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
    };

    // Accumulate usage from this response
    tracker.inputTokens += usage.input_tokens;
    tracker.outputTokens += usage.output_tokens;
    tracker.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
    tracker.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
    tracker.webSearchRequests += usage.server_tool_use?.web_search_requests ?? 0;
    tracker.costUSD += cost;

    // Update model-specific values
    tracker.contextWindow = getContextWindowSize(model, getDefaultContextVariant());
    tracker.maxOutputTokens = getModelOutputLimits(model).default;

    return tracker;
}

// Mapping: Tm3->aggregateTokenUsage, A->cost, q->usage, K->model,
//   Ju1->getSessionTokenTracker, uM->getContextWindowSize, Zj->getDefaultContextVariant,
//   oa->getModelOutputLimits
```

**Why this approach:**
- Each model gets its own tracker, allowing per-model cost breakdowns
- Cache tokens are tracked separately from regular input tokens
- Context window is updated each time (may vary by model)
- Null coalescing (`?? 0`) ensures robustness when API omits optional fields

---

### recordTokenUsage (s21)

**What it does:** Records token usage with telemetry for analytics and UI display.

```javascript
// ============================================
// recordTokenUsage - Record usage with telemetry and metrics
// Location: chunks.57.mjs:17-39
// ============================================

// ORIGINAL (for source lookup):
function s21(A, q, K) {
    let Y = Tm3(A, q, K);
    ax1(A, Y, K);
    let z = Dq() && q.speed === "fast" ? { model: K, speed: "fast" } : { model: K };
    Zu1()?.add(A, z),
    Bw6()?.add(q.input_tokens, { ...z, type: "input" }),
    Bw6()?.add(q.output_tokens, { ...z, type: "output" }),
    Bw6()?.add(q.cache_read_input_tokens ?? 0, { ...z, type: "cacheRead" }),
    Bw6()?.add(q.cache_creation_input_tokens ?? 0, { ...z, type: "cacheCreation" })
}

// READABLE (for understanding):
function recordTokenUsage(cost, usage, model) {
    // Aggregate into session total
    let sessionUsage = aggregateTokenUsage(cost, usage, model);

    // Update cost tracker (for budget warnings)
    updateCostTracker(cost, sessionUsage, model);

    // Build metrics context
    let metricContext = isFastMode() && usage.speed === "fast"
        ? { model, speed: "fast" }
        : { model };

    // Record to various metric collectors
    getSessionCostCollector()?.add(cost, metricContext);

    getTokenCollector()?.add(usage.input_tokens, { ...metricContext, type: "input" });
    getTokenCollector()?.add(usage.output_tokens, { ...metricContext, type: "output" });
    getTokenCollector()?.add(usage.cache_read_input_tokens ?? 0, { ...metricContext, type: "cacheRead" });
    getTokenCollector()?.add(usage.cache_creation_input_tokens ?? 0, { ...metricContext, type: "cacheCreation" });
}

// Mapping: s21->recordTokenUsage, A->cost, q->usage, K->model,
//   Tm3->aggregateTokenUsage, ax1->updateCostTracker, Dq->isFastMode,
//   Zu1->getSessionCostCollector, Bw6->getTokenCollector
```

**Key insight:** The function distributes data to multiple collectors:
- Session-level aggregation for display
- Cost tracker for budget management
- Telemetry collectors for analytics (input, output, cache read, cache creation tracked separately)

---

## Cache Hit Rate Calculation

### Formula

```
Cache Hit Rate = cache_read_input_tokens / (input_tokens + cache_read_input_tokens + cache_creation_input_tokens)
```

### Implementation in Telemetry

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

### UI Display Example

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN USAGE SUMMARY                          │
├─────────────────────────────────────────────────────────────────┤
│  Input Tokens:          150,000                                 │
│  Output Tokens:         45,000                                  │
│  Cache Read:            850,000  ← 85% hit rate                 │
│  Cache Creation:        50,000                                  │
│  ─────────────────────────────────────────────                 │
│  Total Processed:       1,095,000                               │
│                                                                 │
│  Cost: $0.47 (saved $3.20 via caching)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Display Functions

### formatUsageByModel (Gm3)

**What it does:** Formats per-model token usage statistics for end-of-session display.

```javascript
// ============================================
// formatUsageByModel - Format per-model usage for display
// Location: chunks.56.mjs:3037-3062
// ============================================

// ORIGINAL (for source lookup):
function Gm3() {
    let A = $S();
    if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
    let q = {};
    for (let [Y, z] of Object.entries(A)) {
        let _ = IY(Y);
        if (!q[_]) q[_] = {
            inputTokens: 0,
            outputTokens: 0,
            cacheReadInputTokens: 0,
            cacheCreationInputTokens: 0,
            webSearchRequests: 0,
            costUSD: 0,
            contextWindow: 0,
            maxOutputTokens: 0
        };
        let w = q[_];
        w.inputTokens += z.inputTokens, w.outputTokens += z.outputTokens, w.cacheReadInputTokens += z.cacheReadInputTokens, w.cacheCreationInputTokens += z.cacheCreationInputTokens, w.webSearchRequests += z.webSearchRequests, w.costUSD += z.costUSD
    }
    let K = "Usage by model:";
    for (let [Y, z] of Object.entries(q)) {
        let _ = `  ${fq(z.inputTokens)} input, ${fq(z.outputTokens)} output, ${fq(z.cacheReadInputTokens)} cache read, ${fq(z.cacheCreationInputTokens)} cache write` + (z.webSearchRequests > 0 ? `, ${fq(z.webSearchRequests)} web search` : "") + ` (${gx6(z.costUSD)})`;
        K += `
` + `${Y}:`.padStart(21) + _
    }
    return K
}

// READABLE (for understanding):
function formatUsageByModel() {
    let modelUsage = getModelUsage();

    if (Object.keys(modelUsage).length === 0) {
        return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
    }

    // Aggregate by model family (e.g., "sonnet", "opus")
    let familyUsage = {};
    for (let [modelId, usage] of Object.entries(modelUsage)) {
        let family = extractModelFamily(modelId);

        if (!familyUsage[family]) {
            familyUsage[family] = {
                inputTokens: 0,
                outputTokens: 0,
                cacheReadInputTokens: 0,
                cacheCreationInputTokens: 0,
                webSearchRequests: 0,
                costUSD: 0,
                contextWindow: 0,
                maxOutputTokens: 0
            };
        }

        let acc = familyUsage[family];
        acc.inputTokens += usage.inputTokens;
        acc.outputTokens += usage.outputTokens;
        acc.cacheReadInputTokens += usage.cacheReadInputTokens;
        acc.cacheCreationInputTokens += usage.cacheCreationInputTokens;
        acc.webSearchRequests += usage.webSearchRequests;
        acc.costUSD += usage.costUSD;
    }

    // Format output string
    let result = "Usage by model:";
    for (let [family, usage] of Object.entries(familyUsage)) {
        let line = `  ${formatNumber(usage.inputTokens)} input, ${formatNumber(usage.outputTokens)} output, ${formatNumber(usage.cacheReadInputTokens)} cache read, ${formatNumber(usage.cacheCreationInputTokens)} cache write`;

        if (usage.webSearchRequests > 0) {
            line += `, ${formatNumber(usage.webSearchRequests)} web search`;
        }

        line += ` (${formatCost(usage.costUSD)})`;

        result += `\n${family}:`.padStart(21) + line;
    }

    return result;
}

// Mapping: Gm3->formatUsageByModel, $S->getModelUsage, IY->extractModelFamily,
//   fq->formatNumber, gx6->formatCost
```

**Output example:**
```
Usage by model:
            sonnet:  125,000 input, 32,000 output, 620,000 cache read, 30,000 cache write ($0.38)
              opus:   25,000 input, 13,000 output, 230,000 cache read, 20,000 cache write ($0.09)
```

---

### formatSessionStats (a21)

**What it does:** Formats complete session statistics including total cost, duration, and code changes.

```javascript
// ============================================
// formatSessionStats - Format complete session statistics
// Location: chunks.56.mjs:3065-3073
// ============================================

// ORIGINAL (for source lookup):
function a21() {
    let A = gx6(LD()) + (ju1() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
        q = Gm3();
    return O1.dim(`Total cost:            ${A}
Total duration (API):  ${UK(OV())}
Total duration (wall): ${UK(Iw6())}
Total code changes:    ${n86()} ${n86()===1?"line":"lines"} added, ${r86()} ${r86()===1?"line":"lines"} removed
${q}`)
}

// READABLE (for understanding):
function formatSessionStats() {
    let totalCost = formatCost(getTotalSessionCost());

    if (hasUnknownModelUsage()) {
        totalCost += " (costs may be inaccurate due to usage of unknown models)";
    }

    let usageByModel = formatUsageByModel();

    return chalk.dim(`
Total cost:            ${totalCost}
Total duration (API):  ${formatDuration(getApiDuration())}
Total duration (wall): ${formatDuration(getWallDuration())}
Total code changes:    ${getLinesAdded()} ${getLinesAdded()===1?"line":"lines"} added, ${getLinesRemoved()} ${getLinesRemoved()===1?"line":"lines"} removed
${usageByModel}`);
}

// Mapping: a21->formatSessionStats, gx6->formatCost, LD->getTotalSessionCost,
//   ju1->hasUnknownModelUsage, Gm3->formatUsageByModel, UK->formatDuration,
//   OV->getApiDuration, Iw6->getWallDuration, n86->getLinesAdded, r86->getLinesRemoved
```

---

### formatCost (gx6)

**What it does:** Formats USD cost with appropriate precision based on magnitude.

```javascript
// ============================================
// formatCost - Format USD cost with precision
// Location: chunks.56.mjs:3033-3035
// ============================================

// ORIGINAL (for source lookup):
function gx6(A, q = 4) {
    return `$${A>0.5?fm3(A,100).toFixed(2):A.toFixed(q)}`
}

// READABLE (for understanding):
function formatCost(cost, precision = 4) {
    if (cost > 0.5) {
        // For larger amounts, round to cents
        return `$${(Math.round(cost * 100) / 100).toFixed(2)}`;
    } else {
        // For smaller amounts, show more precision
        return `$${cost.toFixed(precision)}`;
    }
}

// Mapping: gx6->formatCost, fm3->roundToPrecision
```

**Examples:**
- `$0.47` (cost = 0.47)
- `$1.25` (cost = 1.25, rounded to cents)
- `$0.0023` (cost = 0.0023, 4 decimal places)

---

## Cost Calculation with Cache Tokens

### Pricing Constants

```javascript
// ============================================
// Model pricing constants - Cost per million tokens
// Location: chunks.82.mjs:1487-1523
// ============================================

// Sonnet (OB)
const SONNET_PRICING = {
    inputTokens: 3,           // $3.00 per million input tokens
    outputTokens: 15,         // $15.00 per million output tokens
    promptCacheWriteTokens: 3.75,  // $3.75 per million cache write
    promptCacheReadTokens: 0.3,    // $0.30 per million cache read
    webSearchRequests: 0.01   // $0.01 per web search
};

// Opus (I64)
const OPUS_PRICING = {
    inputTokens: 15,
    outputTokens: 75,
    promptCacheWriteTokens: 18.75,
    promptCacheReadTokens: 1.5,
    webSearchRequests: 0.01
};

// Sonnet 4 (DD1)
const SONNET_4_PRICING = {
    inputTokens: 5,
    outputTokens: 25,
    promptCacheWriteTokens: 6.25,
    promptCacheReadTokens: 0.5,
    webSearchRequests: 0.01
};

// Opus Fast Mode (zT9)
const OPUS_FAST_PRICING = {
    inputTokens: 30,
    outputTokens: 150,
    promptCacheWriteTokens: 37.5,
    promptCacheReadTokens: 3,
    webSearchRequests: 0.01
};

// Haiku variants (Wf8, Zf8)
const HAIKU_PRICING_1 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
};

const HAIKU_PRICING_2 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
};
```

### calculateApiCost (wT9)

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
    let inputCost = (usage.input_tokens / 1_000_000) * pricing.inputTokens;
    let outputCost = (usage.output_tokens / 1_000_000) * pricing.outputTokens;
    let cacheReadCost = ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheReadTokens;
    let cacheWriteCost = ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheWriteTokens;
    let webSearchCost = (usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests;

    return inputCost + outputCost + cacheReadCost + cacheWriteCost + webSearchCost;
}

// Mapping: wT9->calculateApiCost, A->pricing, q->usage
```

### Cost Savings Calculation

```javascript
// Calculate what the cost would have been without caching
function calculateSavings(pricing, usage) {
    let actualCost = calculateApiCost(pricing, usage);

    // Hypothetical cost without cache (all input tokens at regular rate)
    let uncachedInputTokens = usage.input_tokens +
                              (usage.cache_read_input_tokens ?? 0) +
                              (usage.cache_creation_input_tokens ?? 0);
    let hypotheticalCost = (uncachedInputTokens / 1_000_000) * pricing.inputTokens +
                           (usage.output_tokens / 1_000_000) * pricing.outputTokens +
                           (usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests;

    return {
        actualCost,
        hypotheticalCost,
        savings: hypotheticalCost - actualCost,
        savingsPercent: ((hypotheticalCost - actualCost) / hypotheticalCost) * 100
    };
}
```

---

## Billing Header Display

### getAttributionHeader (m21)

The billing header is included in the system prompt for attribution:

```javascript
// ============================================
// getAttributionHeader - Build billing attribution header
// Location: chunks.56.mjs:1520-1528
// ============================================

// ORIGINAL (for source lookup):
function m21(A) {
    if (!Bu3()) return "";
    let q = `${{VERSION:"2.1.76",...}.VERSION}.${A}`,
        K = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown",
        Y = " cch=00000;",
        z = oA1(),
        _ = z ? ` cc_workload=${z};` : "",
        w = `x-anthropic-billing-header: cc_version=${q}; cc_entrypoint=${K};${Y}${_}`;
    return k(`attribution header ${w}`), w
}

// READABLE (for understanding):
function getAttributionHeader(promptHash) {
    // Check if attribution header is enabled
    if (!isAttributionHeaderEnabled()) return "";

    // Version + prompt hash for session identification
    let version = `2.1.76.${promptHash}`;

    // Entry point: cli, sdk-ts, sdk-py, etc.
    let entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown";

    // Cache header identifier (constant)
    let cch = " cch=00000;";

    // Workload type (if applicable)
    let workload = getWorkloadType();
    let workloadPart = workload ? ` cc_workload=${workload};` : "";

    // Build complete header
    let header = `x-anthropic-billing-header: cc_version=${version}; cc_entrypoint=${entrypoint};${cch}${workloadPart}`;

    debugLog(`attribution header ${header}`);
    return header;
}

// Mapping: m21->getAttributionHeader, A->promptHash, K->entrypoint, Y->cch,
//   z->workload, oA1->getWorkloadType, Bu3->isAttributionHeaderEnabled
```

### Header Format

```
x-anthropic-billing-header: cc_version=2.1.76.abc; cc_entrypoint=cli; cch=00000; cc_workload=swarm;
```

| Component | Example | Description |
|-----------|---------|-------------|
| `cc_version` | `2.1.76.abc` | Version + 3-char prompt hash |
| `cc_entrypoint` | `cli`, `sdk-py` | How Claude Code was invoked |
| `cch` | `00000` | Cache header identifier |
| `cc_workload` | `swarm`, `mcp` | Optional workload type |

---

## System Reminder Integration

### Token Usage Attachment

The system periodically injects token usage information as a reminder:

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

### Budget USD Attachment

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

### Budget Warning Integration

The system warns users when approaching budget limits:

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

## Cache Cold Detection

The system detects when the cache is "cold" (low hit rate on new queries) and may suppress certain optimizations:

```javascript
// ============================================
// isCacheCold - Detect cold cache state
// Location: chunks.148.mjs:2253-2262
// ============================================

function isCacheCold(assistantMessage) {
    if (!assistantMessage) return false;

    let usage = assistantMessage.message.usage;
    let inputTokens = usage.input_tokens ?? 0;
    let cacheReadTokens = usage.cache_read_input_tokens ?? 0;
    let cacheCreationTokens = usage.cache_creation_input_tokens ?? 0;

    let totalTokens = inputTokens + cacheReadTokens + cacheCreationTokens;
    if (totalTokens === 0) return false;

    // Cache is "cold" if > 70% of tokens are cache creation (new cache entries)
    let creationRatio = cacheCreationTokens / totalTokens;
    return creationRatio > 0.70;
}
```

**Why this matters:** When the cache is cold, prompt suggestions may be suppressed to avoid spending tokens on speculative operations.

---

## Telemetry Events

### Cache-Related Telemetry

| Event | Data | Purpose |
|-------|------|---------|
| `tengu_api_cache_breakpoints` | `totalMessageCount`, `cachingEnabled`, `skipCacheWrite` | Track cache placement |
| `tengu_sysprompt_boundary_found` | `blockCount`, `staticBlockLength`, `dynamicBlockLength` | Track boundary usage |
| `tengu_sysprompt_using_tool_based_cache` | `promptBlockCount` | Track tool-based caching |
| `tengu_fork_agent_query` | `cacheReadInputTokens`, `cacheCreationInputTokens`, `cacheHitRate` | Track fork agent caching |
| `tengu_compact_cache_sharing_success` | `sessionId` | Track cache prefix sharing |

---

## Real-Time Stats Display

### During Streaming

The UI displays live token counts during streaming responses. Token usage is accumulated during streaming and the display updates as each chunk arrives from the API:

```javascript
// ============================================
// Real-time token tracking during streaming
// Location: chunks.57.mjs:17-39
// ============================================

// As the API streams tokens, they are accumulated:
// - Input tokens processed
// - Output tokens generated
// - Cache read tokens (from cache hits)
// - Cache creation tokens (building new cache)

// Example display format during streaming:
// "Input: 12.5K | Output: 3.2K | Cache: 45.8K read, 2.1K write | Cost: $0.05"
```

### Streaming Token Updates

The `recordTokenUsage` function (s21) distributes data to multiple collectors for real-time display:

```javascript
// ============================================
// recordTokenUsage - Record usage with telemetry and metrics
// Location: chunks.57.mjs:17-39
// ============================================

// ORIGINAL (for source lookup):
function s21(A, q, K) {
    let Y = Tm3(A, q, K);
    ax1(A, Y, K);
    let z = Dq() && q.speed === "fast" ? { model: K, speed: "fast" } : { model: K };
    Zu1()?.add(A, z),
    Bw6()?.add(q.input_tokens, { ...z, type: "input" }),
    Bw6()?.add(q.output_tokens, { ...z, type: "output" }),
    Bw6()?.add(q.cache_read_input_tokens ?? 0, { ...z, type: "cacheRead" }),
    Bw6()?.add(q.cache_creation_input_tokens ?? 0, { ...z, type: "cacheCreation" })
}

// READABLE (for understanding):
function recordTokenUsage(cost, usage, model) {
    // Aggregate into session total
    let sessionUsage = aggregateTokenUsage(cost, usage, model);

    // Update cost tracker (for budget warnings)
    updateCostTracker(cost, sessionUsage, model);

    // Build metrics context
    let metricContext = isFastMode() && usage.speed === "fast"
        ? { model, speed: "fast" }
        : { model };

    // Record to various metric collectors for UI display
    getSessionCostCollector()?.add(cost, metricContext);

    getTokenCollector()?.add(usage.input_tokens, { ...metricContext, type: "input" });
    getTokenCollector()?.add(usage.output_tokens, { ...metricContext, type: "output" });
    getTokenCollector()?.add(usage.cache_read_input_tokens ?? 0, { ...metricContext, type: "cacheRead" });
    getTokenCollector()?.add(usage.cache_creation_input_tokens ?? 0, { ...metricContext, type: "cacheCreation" });
}

// Mapping: s21->recordTokenUsage, A->cost, q->usage, K->model,
//   Tm3->aggregateTokenUsage, ax1->updateCostTracker, Dq->isFastMode,
//   Zu1->getSessionCostCollector, Bw6->getTokenCollector
```

**Key insight:** The function distributes data to multiple collectors:
- Session-level aggregation for display
- Cost tracker for budget management
- Telemetry collectors for analytics (input, output, cache read, cache creation tracked separately)

### End-of-Session Summary

When the session ends, a comprehensive summary is displayed:

```
Total cost:            $0.47
Total duration (API):  45.2s
Total duration (wall): 2m 32s
Total code changes:    156 lines added, 23 lines removed

Usage by model:
            sonnet:  125,000 input, 32,000 output, 620,000 cache read, 30,000 cache write ($0.38)
              opus:   25,000 input, 13,000 output, 230,000 cache read, 20,000 cache write ($0.09)
```

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.57.mjs` | `Tm3`, `s21` | Token usage aggregation and recording |
| `chunks.82.mjs` | `wT9`, `OT9` | Cost calculation, pricing lookup |
| `chunks.56.mjs` | `m21`, `Gm3`, `a21`, `gx6` | Billing header, usage formatting, cost formatting |
| `chunks.147.mjs` | `qmY`, `YmY` | Token usage and budget attachments |
| `chunks.148.mjs` | `isCacheCold` | Cache cold detection |
| `chunks.93.mjs` | Various | Cache hit rate telemetry |
| `chunks.166.mjs` | Various | Session state token tracking |

---

## Streaming Response Display Integration

### Response Length Tracking

During streaming responses, the UI tracks the response length in real-time:

```javascript
// ============================================
// Response length tracking during streaming
// Location: chunks.147.mjs:1828-1831
// ============================================

// As content blocks stream in, length is updated:
if (G.type === "stream_event" && G.event.type === "content_block_delta"
    && G.event.delta.type === "text_delta") {
    let charCount = G.event.delta.text.length;
    context.setResponseLength?.((prev) => prev + charCount);
}
```

### Display Update Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STREAMING DISPLAY UPDATE FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

API Stream Event
        │
        ▼
┌───────────────────────┐
│ content_block_delta   │
│ type: "text_delta"    │
│ text: "..."           │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ setResponseLength()   │
│ Increment by char     │
│ count                 │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ UI React Component    │
│ Updates live display  │
└───────────────────────┘
```

### Cost Display During Streaming

While streaming, the UI can show estimated cost:

```javascript
// Example streaming display format:
// "Input: 12.5K | Output: 3.2K | Cache: 45.8K read, 2.1K write | Cost: $0.05"

// Cost is computed from accumulated tokens:
let inputCost = (inputTokens / 1_000_000) * pricing.inputTokens;
let outputCost = (outputTokens / 1_000_000) * pricing.outputTokens;
let cacheReadCost = (cacheReadTokens / 1_000_000) * pricing.promptCacheReadTokens;
let cacheWriteCost = (cacheWriteTokens / 1_000_000) * pricing.promptCacheWriteTokens;
let totalCost = inputCost + outputCost + cacheReadCost + cacheWriteCost;
```

---

## Status Line Integration

### Real-Time Status Display

Claude Code displays real-time token and cost information in the status line at the bottom of the terminal UI. The status line updates dynamically during API calls:

```javascript
// ============================================
// Status line token/cost display
// Location: chunks.56.mjs (status line module)
// ============================================

// Status line format during active session:
// "Tokens: 45.2K input, 12.1K output | Cache: 125.8K read, 8.5K write | Cost: $0.47"

// The status line pulls from session state:
let statusDisplay = {
    inputTokens: formatCompact(sessionUsage.inputTokens),       // "45.2K"
    outputTokens: formatCompact(sessionUsage.outputTokens),     // "12.1K"
    cacheReadTokens: formatCompact(sessionUsage.cacheReadInputTokens),   // "125.8K"
    cacheWriteTokens: formatCompact(sessionUsage.cacheCreationInputTokens), // "8.5K"
    cost: formatCost(sessionUsage.costUSD)  // "$0.47"
};
```

### Status Line Update Frequency

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STATUS LINE UPDATE TRIGGERS                               │
└─────────────────────────────────────────────────────────────────────────────┘

Update triggers:
1. API response received → Full token usage update
2. Streaming chunk received → Output token increment
3. Tool execution → Cost refresh
4. Budget threshold crossed → Warning overlay

Debounce strategy:
- Batch updates within 100ms to reduce flicker
- Skip updates if change is < 0.01 in cost
- Always update on API call completion
```

---

## Budget Warning UI

### Warning Thresholds

```javascript
// ============================================
// Budget warning thresholds and display
// Location: chunks.147.mjs + UI components
// ============================================

const BUDGET_THRESHOLDS = {
    warning: 0.75,    // 75% of budget → Yellow warning
    critical: 0.90,   // 90% of budget → Orange warning
    exceeded: 1.0     // 100% of budget → Red error
};

function getBudgetStatus(used, budget) {
    let ratio = used / budget;

    if (ratio >= 1.0) {
        return {
            level: "exceeded",
            color: "red",
            message: "Budget exceeded",
            action: "Stop and notify user"
        };
    } else if (ratio >= 0.90) {
        return {
            level: "critical",
            color: "orange",
            message: "Critical: 90% of budget used",
            action: "Show warning, continue"
        };
    } else if (ratio >= 0.75) {
        return {
            level: "warning",
            color: "yellow",
            message: "Warning: 75% of budget used",
            action: "Show subtle indicator"
        };
    }

    return { level: "normal", color: "green" };
}
```

### Budget Warning Display Format

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  BUDGET WARNING                                               │
│                                                                  │
│ You've used $4.50 of your $5.00 budget (90%).                  │
│                                                                  │
│ Current session costs:                                           │
│   Input:     $1.20  (25,000 tokens)                            │
│   Output:    $0.80  (8,000 tokens)                             │
│   Cache:     $0.30  (60,000 read, 5,000 write)                 │
│   ──────────────────                                             │
│   Total:     $2.30                                               │
│                                                                  │
│ Remaining: $0.50                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Budget Attachment for Model Context

The budget information is also sent to the model via system reminders:

```javascript
// ============================================
// getBudgetUsdAttachment - Budget context for model
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

// The model receives this as:
// <system-reminder>
// USD budget: $4.50/$5.00; $0.50 remaining
// </system-reminder>
```

---

## Interactive Elements

### Token Usage Breakdown Modal

Users can view detailed token breakdown through an interactive modal:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOKEN USAGE DETAILS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Model: claude-sonnet-4-20250514                                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ INPUT TOKENS                                                  25,000     ││
│  │ ├── Regular input                                             15,000     ││
│  │ ├── Cache read (90% cheaper)                                  60,000     ││
│  │ └── Cache creation (new)                                       5,000     ││
│  │                                                                 total     ││
│  │ OUTPUT TOKENS                                                  8,000     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ COST BREAKDOWN                                                           ││
│  │                                                                          ││
│  │ Regular input:     15,000 × $3.00/M      =     $0.045                   ││
│  │ Cache read:        60,000 × $0.30/M      =     $0.018  (saved $0.162)   ││
│  │ Cache creation:     5,000 × $3.75/M      =     $0.019                   ││
│  │ Output:             8,000 × $15.00/M     =     $0.120                   ││
│  │ ─────────────────────────────────────────────────────────               ││
│  │ Total:                                               $0.202              ││
│  │                                                                          ││
│  │ Savings from caching: $0.162 (45%)                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Cache hit rate: 75.0% (excellent)                                          │
│  Effective cost reduction: 45%                                              │
│                                                                              │
│                                          [Close]                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Compact Stats Display (Inline)

During active sessions, a compact inline display shows key metrics:

```
┌──────────────────────────────────────────────┐
│ 💰 $0.47 │ 📊 45K in, 12K out │ ⚡ 126K cache │
└──────────────────────────────────────────────┘
```

---

## TUI/React Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOKEN DISPLAY COMPONENT HIERARCHY                         │
└─────────────────────────────────────────────────────────────────────────────┘

<App>
├── <MainConversation>
│   ├── <MessageList>
│   │   └── <Message> (each shows token count for assistant responses)
│   └── <InputStreamingHandler>
│       └── Updates token counters in real-time
│
├── <StatusBar>
│   ├── <TokenCounter>
│   │   ├── input: number
│   │   ├── output: number
│   │   ├── cacheRead: number
│   │   └── cacheWrite: number
│   ├── <CostDisplay>
│   │   └── cost: number
│   └── <BudgetIndicator>
│       └── budgetStatus: "normal" | "warning" | "critical"
│
└── <SessionEndSummary>
    ├── <TotalCostDisplay>
    ├── <DurationDisplay>
    ├── <CodeChangesDisplay>
    └── <UsageByModelTable>
```

### State Management for Token Counts

```javascript
// ============================================
// Token count state management
// Location: chunks.166.mjs (session state)
// ============================================

// Session state tracks per-model usage:
const sessionTokenState = {
    // Per-model aggregations
    modelUsage: new Map<string, TokenUsage>(),

    // Total session cost
    totalCost: 0,

    // Real-time streaming counters
    streamingTokens: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0
    }
};

// State update on API response:
function updateTokenState(usage, model) {
    let current = sessionTokenState.modelUsage.get(model) || emptyUsage;

    current.inputTokens += usage.input_tokens;
    current.outputTokens += usage.output_tokens;
    current.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
    current.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
    current.costUSD += calculateCost(usage, model);

    sessionTokenState.modelUsage.set(model, current);
    sessionTokenState.totalCost += current.costUSD;
}
```

### Reactive UI Updates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACTIVE UPDATE FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

API Response
     │
     ▼
recordTokenUsage(cost, usage, model)
     │
     ├──► Session State Update (Tm3)
     │         │
     │         └──► Triggers re-render of:
     │              - TokenCounter component
     │              - CostDisplay component
     │              - BudgetIndicator component
     │
     ├──► Cost Tracker Update (ax1)
     │         │
     │         └──► Triggers budget warning check
     │              - If threshold crossed → Show warning modal
     │
     └──► Telemetry Collectors (Bw6)
              │
              └──► Metrics exported to:
                   - Real-time dashboard
                   - Analytics pipeline
                   - Performance monitoring
```

---

## Streaming Response Details

### Token Accumulation During Streaming

```javascript
// ============================================
// Token accumulation during streaming
// Location: chunks.147.mjs (main agent loop)
// ============================================

// Streaming accumulates tokens differently:
// 1. Input/cache tokens available at start (from usage field in response)
// 2. Output tokens increment as text streams in

function handleStreamingResponse(stream, context) {
    let accumulatedTokens = {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0
    };

    // Initial usage comes from message_start event
    stream.on('message_start', (event) => {
        let usage = event.message.usage;
        accumulatedTokens.input = usage.input_tokens;
        accumulatedTokens.cacheRead = usage.cache_read_input_tokens ?? 0;
        accumulatedTokens.cacheWrite = usage.cache_creation_input_tokens ?? 0;

        // Update UI immediately
        context.updateTokenDisplay(accumulatedTokens);
    });

    // Output tokens increment during content_block_delta
    stream.on('content_block_delta', (event) => {
        if (event.delta.type === 'text_delta') {
            // Estimate output tokens (approximate)
            let estimatedTokens = Math.ceil(event.delta.text.length / 4);
            accumulatedTokens.output += estimatedTokens;

            // Throttled UI update (debounced to 100ms)
            context.updateTokenDisplay(accumulatedTokens);
        }
    });

    // Final usage comes from message_delta
    stream.on('message_delta', (event) => {
        if (event.usage) {
            // Replace estimate with actual
            accumulatedTokens.output = event.usage.output_tokens;
            context.updateTokenDisplay(accumulatedTokens);
        }
    });
}
```

### Output Token Estimation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OUTPUT TOKEN ESTIMATION                                   │
└─────────────────────────────────────────────────────────────────────────────┘

During streaming, output tokens are estimated:
- Character count / 4 (rough approximation for English)
- This gives users a sense of progress before final count

When streaming completes:
- Actual token count from message_delta event
- Estimate replaced with actual
- recordTokenUsage called with final values

Why estimation:
- API doesn't stream per-token output counts
- Users need progress indication
- Final count corrects any estimation error
```

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [cache_placement.md](./cache_placement.md) - Cache breakpoint placement algorithms
- [ttl_scope_logic.md](./ttl_scope_logic.md) - TTL and scope decision trees
- [compaction_integration.md](./compaction_integration.md) - Cache prefix sharing during compaction
- [key_algorithms.md](./key_algorithms.md) - Deep analysis of key algorithms
- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture
- [api_integration.md](./api_integration.md) - API request construction with caching