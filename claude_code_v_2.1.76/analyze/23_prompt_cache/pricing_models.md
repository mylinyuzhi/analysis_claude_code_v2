# Model Pricing and Cache Economics

## Overview

This document provides the complete pricing structure for all models supported by Claude Code, including prompt cache pricing. Understanding these prices is essential for cost optimization and evaluating the value of prompt caching.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model Selection)

Key functions in this document:
- `getModelPricing` (OT9) - Returns pricing object for a model
- `calculateApiCost` (wT9) - Calculates API cost from usage
- `calculateCostFromUsage` (PD1) - Calculates cost from session usage

---

## Pricing Constants (v2.1.76)

All prices are in USD per million tokens.

### Complete Pricing Table

```javascript
// ============================================
// Model pricing constants - Cost per million tokens
// Location: chunks.82.mjs:1487-1536
// ============================================

// Sonnet 3.5/4 (OB)
const SONNET_PRICING = {
    inputTokens: 3,           // $3.00/M input tokens
    outputTokens: 15,         // $15.00/M output tokens
    promptCacheWriteTokens: 3.75,  // $3.75/M cache write
    promptCacheReadTokens: 0.3,    // $0.30/M cache read
    webSearchRequests: 0.01   // $0.01 per web search
};

// Opus 4 (I64)
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

// Haiku variant 1 (Wf8)
const HAIKU_PRICING_1 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
};

// Haiku variant 2 (Zf8)
const HAIKU_PRICING_2 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
};
```

---

## Pricing Summary Table

| Model | Input | Output | Cache Write | Cache Read | Web Search |
|-------|-------|--------|-------------|------------|------------|
| Sonnet 3.5/4 | $3.00 | $15.00 | $3.75 | $0.30 | $0.01 |
| Sonnet 4 | $5.00 | $25.00 | $6.25 | $0.50 | $0.01 |
| Opus 4 | $15.00 | $75.00 | $18.75 | $1.50 | $0.01 |
| Opus Fast | $30.00 | $150.00 | $37.50 | $3.00 | $0.01 |
| Haiku (Wf8) | $0.80 | $4.00 | $1.00 | $0.08 | $0.01 |
| Haiku (Zf8) | $1.00 | $5.00 | $1.25 | $0.10 | $0.01 |

---

## Cache Economics

### Cache Discount Rates

| Model | Cache Read vs Input | Savings |
|-------|---------------------|---------|
| Sonnet 3.5/4 | $0.30 vs $3.00 | **90% off** |
| Sonnet 4 | $0.50 vs $5.00 | **90% off** |
| Opus 4 | $1.50 vs $15.00 | **90% off** |
| Opus Fast | $3.00 vs $30.00 | **90% off** |
| Haiku (Wf8) | $0.08 vs $0.80 | **90% off** |
| Haiku (Zf8) | $0.10 vs $1.00 | **90% off** |

**Key insight:** Cache read tokens are consistently 90% cheaper than regular input tokens across all models.

### Cache Write vs Input

| Model | Cache Write vs Input | Premium |
|-------|---------------------|---------|
| Sonnet 3.5/4 | $3.75 vs $3.00 | +25% |
| Sonnet 4 | $6.25 vs $5.00 | +25% |
| Opus 4 | $18.75 vs $15.00 | +25% |
| Opus Fast | $37.50 vs $30.00 | +25% |
| Haiku (Wf8) | $1.00 vs $0.80 | +25% |
| Haiku (Zf8) | $1.25 vs $1.00 | +25% |

**Key insight:** Cache write tokens cost 25% more than regular input tokens. This is the cost of building the cache.

---

## Cost Calculation Functions

### getModelPricing (OT9)

**What it does:** Returns the pricing object for a given model, handling model family detection.

```javascript
// ============================================
// getModelPricing - Get pricing for model
// Location: chunks.82.mjs:1423-1432
// ============================================

// ORIGINAL (for source lookup):
function OT9(A, q) {
    let K = IY(A);
    if (K === Of(wJ6.firstParty)) {
        let z = q.speed === "fast";
        return N06(z)
    }
    let Y = XD1[K];
    if (!Y) return $T9(A, K), XD1[IY(Mv())] ?? _T9;
    return Y
}

// READABLE (for understanding):
function getModelPricing(model, options) {
    let family = extractModelFamily(model);

    // Special handling for first-party Sonnet with fast mode
    if (family === extractModelFamily(SONNET_4_FIRST_PARTY)) {
        let isFast = options?.speed === "fast";
        return getPricingForFastMode(isFast);
    }

    // Look up pricing from model family registry
    let pricing = MODEL_FAMILY_PRICING[family];

    if (!pricing) {
        // Log unknown model and fall back to default
        logUnknownModelCost(model, family);
        return MODEL_FAMILY_PRICING[extractModelFamily(getDefaultModel())] ?? SONNET_4_PRICING;
    }

    return pricing;
}

// Mapping: OT9->getModelPricing, A->model, q->options, IY->extractModelFamily,
//   Of->extractModelFamily, wJ6->SONNET_4_FIRST_PARTY, N06->getPricingForFastMode,
//   XD1->MODEL_FAMILY_PRICING, $T9->logUnknownModelCost, Mv->getDefaultModel, _T9->SONNET_4_PRICING
```

---

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
    let inputCost = (usage.input_tokens / 1_000_000) * pricing.inputTokens;
    let outputCost = (usage.output_tokens / 1_000_000) * pricing.outputTokens;
    let cacheReadCost = ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheReadTokens;
    let cacheWriteCost = ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * pricing.promptCacheWriteTokens;
    let webSearchCost = (usage.server_tool_use?.web_search_requests ?? 0) * pricing.webSearchRequests;

    return inputCost + outputCost + cacheReadCost + cacheWriteCost + webSearchCost;
}

// Mapping: wT9->calculateApiCost, A->pricing, q->usage
```

---

### calculateCostFromUsage (PD1)

**What it does:** Calculates cost from session-level usage stats.

```javascript
// ============================================
// calculateCostFromUsage - Calculate cost from session usage
// Location: chunks.82.mjs:1446-1454
// ============================================

// ORIGINAL (for source lookup):
function PD1(A, q) {
    let K = {
        input_tokens: q.inputTokens,
        output_tokens: q.outputTokens,
        cache_read_input_tokens: q.cacheReadInputTokens,
        cache_creation_input_tokens: q.cacheCreationInputTokens
    };
    return tg6(A, K)
}

// READABLE (for understanding):
function calculateCostFromUsage(model, sessionUsage) {
    let apiUsage = {
        input_tokens: sessionUsage.inputTokens,
        output_tokens: sessionUsage.outputTokens,
        cache_read_input_tokens: sessionUsage.cacheReadInputTokens,
        cache_creation_input_tokens: sessionUsage.cacheCreationInputTokens
    };

    return calculateApiCostWithModel(model, apiUsage);
}

// Mapping: PD1->calculateCostFromUsage, A->model, q->sessionUsage, tg6->calculateApiCostWithModel
```

---

## Cost Savings Analysis

### Example: 100-Turn Conversation with Sonnet 4

**Scenario:**
- System prompt: 15,000 tokens (stable)
- Each turn: 1,000 input tokens + 500 output tokens
- 100 turns total

**Without Caching:**
```
Input tokens: 100 * (15,000 + 1,000) = 1,600,000 tokens
Output tokens: 100 * 500 = 50,000 tokens

Cost = (1.6M * $5) + (50K * $25)
     = $8.00 + $1.25
     = $9.25
```

**With 5-Minute TTL (Default):**
```
Turn 1: Cache miss on system prompt (15K)
Turns 2-20: Cache hits within 5-minute window (~19 turns)
Turns 21-40: New cache creation (15K each segment)
...

Estimated cache hit rate: ~60-70%
Cache read tokens: ~1,000,000
Cache write tokens: ~300,000
Regular input tokens: ~300,000

Cost = (300K * $5) + (50K * $25) + (1M * $0.50) + (300K * $6.25)
     = $1.50 + $1.25 + $0.50 + $1.875
     = $5.125

Savings: 44%
```

**With 1-Hour TTL:**
```
All 100 turns within 1-hour window
Cache hit rate: ~95%
Cache read tokens: ~1,500,000
Cache write tokens: ~100,000 (only first turn)
Regular input tokens: ~100,000

Cost = (100K * $5) + (50K * $25) + (1.5M * $0.50) + (100K * $6.25)
     = $0.50 + $1.25 + $0.75 + $0.625
     = $3.125

Savings: 66%
```

### Savings Summary

| Scenario | Cost | Savings vs No Cache |
|----------|------|---------------------|
| No caching | $9.25 | 0% |
| 5-minute TTL | $5.13 | 44% |
| 1-hour TTL | $3.13 | 66% |

---

## Cache ROI Analysis

### When Does Caching Pay Off?

Cache write costs 25% more than regular input. The break-even point is:

```
Break-even cache reads = Cache write premium / Cache read discount
                       = 25% / 90%
                       = 0.28 reads

In practice: If you read cached content at least once after writing it, caching is profitable.
```

### ROI Formula

```
ROI = (Savings - Cache Write Cost) / Cache Write Cost

Where:
Savings = Cache Read Tokens * (Input Price - Cache Read Price)
Cache Write Cost = Cache Write Tokens * (Cache Write Price - Input Price)
```

---

## Model Family Registry

### Pricing Constants (Verified from Source)

```javascript
// ============================================
// Model pricing constants - Cost per million tokens
// Location: chunks.82.mjs:1487-1523
// ============================================

// ORIGINAL (for source lookup):
OB = {
    inputTokens: 3,
    outputTokens: 15,
    promptCacheWriteTokens: 3.75,
    promptCacheReadTokens: 0.3,
    webSearchRequests: 0.01
}, I64 = {
    inputTokens: 15,
    outputTokens: 75,
    promptCacheWriteTokens: 18.75,
    promptCacheReadTokens: 1.5,
    webSearchRequests: 0.01
}, DD1 = {
    inputTokens: 5,
    outputTokens: 25,
    promptCacheWriteTokens: 6.25,
    promptCacheReadTokens: 0.5,
    webSearchRequests: 0.01
}, zT9 = {
    inputTokens: 30,
    outputTokens: 150,
    promptCacheWriteTokens: 37.5,
    promptCacheReadTokens: 3,
    webSearchRequests: 0.01
}, Wf8 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
}, Zf8 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
}

// Mapping: OB->SONNET_PRICING, I64->OPUS_PRICING, DD1->SONNET_4_PRICING,
//   zT9->OPUS_FAST_PRICING, Wf8->HAIKU_PRICING_1, Zf8->HAIKU_PRICING_2
```

### Model Family Registry Implementation

```javascript
// From chunks.82.mjs:1524-1536
// The registry maps model family (from extractModelFamily) to pricing object
const MODEL_FAMILY_PRICING = {
    [extractModelFamily(HAIKU_VARIANT_1)]: HAIKU_PRICING_1,  // Wf8
    [extractModelFamily(HAIKU_VARIANT_2)]: HAIKU_PRICING_2,  // Zf8
    [extractModelFamily(SONNET_VARIANT_1)]: SONNET_PRICING,  // OB
    [extractModelFamily(SONNET_VARIANT_2)]: SONNET_PRICING,  // OB
    [extractModelFamily(SONNET_VARIANT_3)]: SONNET_PRICING,  // OB
    [extractModelFamily(SONNET_VARIANT_4)]: SONNET_PRICING,  // OB
    [extractModelFamily(SONNET_VARIANT_5)]: SONNET_PRICING,  // OB
    [extractModelFamily(OPUS_VARIANT_1)]: OPUS_PRICING,      // I64
    [extractModelFamily(OPUS_VARIANT_2)]: OPUS_PRICING,      // I64
    [extractModelFamily(SONNET_4)]: SONNET_4_PRICING,        // DD1
    [extractModelFamily(SONNET_4_FIRST_PARTY)]: SONNET_4_PRICING  // DD1
};
```

---

## Source Files

| File | Key Symbols | Content |
|------|-------------|---------|
| `chunks.82.mjs` | `OB`, `I64`, `DD1`, `zT9`, `Wf8`, `Zf8`, `_T9`, `XD1`, `wT9`, `OT9`, `PD1`, `tg6` | Pricing constants, cost calculation functions |
| `chunks.176.mjs` | `IY`, `Of` | Model family extraction |

---

## See Also

- [overview.md](./overview.md) - Overview of the prompt cache system
- [ui_integration.md](./ui_integration.md) - Cost display in UI
- [ttl_scope_logic.md](./ttl_scope_logic.md) - TTL decision logic