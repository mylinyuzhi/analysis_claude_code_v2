# Thinking Mode Integration (Claude Code 2.1.76)

> Complete analysis of extended thinking and adaptive thinking modes: budget token calculation, model-specific behavior, and API integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Thinking Mode)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `QG7` - supportsThinking (chunks.56.mjs:1348)
- `I21` - supportsAdaptiveThinking (chunks.56.mjs:1355)
- `FGq` - getDefaultThinkingBudget (chunks.176.mjs:1549)
- `oa` - getThinkingBudgetLimits (chunks.176.mjs:1533)
- `gG7` - buildContextManagementConfig (chunks.56.mjs:1291)
- `fD6` - isThinkingEnabled (chunks.56.mjs:1362)

---

## Architecture Overview

Thinking mode enables Claude models to perform extended reasoning before responding. There are two types:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THINKING MODE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TWO THINKING MODES:                                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ADAPTIVE THINKING (Recommended for Claude 4.6+)                   │  │
│  │ - Type: { type: "adaptive" }                                      │  │
│  │ - Model dynamically adjusts thinking depth                        │  │
│  │ - No budget_tokens required                                       │  │
│  │ - Works with effort levels                                        │  │
│  │ - Supported: Opus 4.6, Sonnet 4.6                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ENABLED THINKING (Legacy for older models)                       │  │
│  │ - Type: { type: "enabled", budget_tokens: N }                     │  │
│  │ - Fixed budget for thinking                                       │  │
│  │ - budget_tokens must be < max_tokens (min 1024)                   │  │
│  │ - Supported: Opus 4.5, Sonnet 4.5, Claude 3.x                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  CONFIGURATION FLOW:                                                    │
│                                                                          │
│  streamingQueryCore()                                                   │
│      │                                                                   │
│      ├── Check: supportsThinking(model) → QG7                          │
│      │   └── Returns true for Claude 4.x+ (not Claude 3.x)             │
│      │                                                                   │
│      ├── Check: supportsAdaptiveThinking(model) → I21                  │
│      │   └── Returns true for Opus 4.6, Sonnet 4.6                     │
│      │                                                                   │
│      ├── If Adaptive:                                                    │
│      │   └── thinking: { type: "adaptive" }                            │
│      │                                                                   │
│      └── If Enabled (legacy):                                            │
│          ├── getDefaultThinkingBudget(model) → FGq                     │
│          │   └── Returns upperLimit - 1                                 │
│          │                                                               │
│          └── thinking: { type: "enabled", budget_tokens: N }           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Functions

### supportsThinking (QG7)

**What it does:**
Determines if a model supports any form of extended thinking.

**Location:** chunks.56.mjs:1348-1353

```javascript
// ============================================
// supportsThinking - Checks if model supports thinking
// Location: chunks.56.mjs:1348-1353
// ============================================

// ORIGINAL (for source lookup):
function QG7(A) {
    let q = IY(A),
        K = QA();
    if (K === "foundry" || K === "firstParty") return !q.includes("claude-3-");
    return q.includes("sonnet-4") || q.includes("opus-4")
}

// READABLE (for understanding):
function supportsThinking(model) {
    let normalizedModel = normalizeModelName(model);
    let provider = getApiProvider();

    // For foundry and first-party APIs, all non-Claude-3 models support thinking
    if (provider === "foundry" || provider === "firstParty") {
        return !normalizedModel.includes("claude-3-");
    }

    // For other providers, only Claude 4.x models support thinking
    return normalizedModel.includes("sonnet-4") || normalizedModel.includes("opus-4");
}

// Mapping: QG7→supportsThinking, A→model, IY→normalizeModelName, QA→getApiProvider
```

**Why this approach:**
- Provider-specific logic accounts for different API capabilities
- Claude 3.x models don't support the new thinking API
- Ensures thinking is only enabled on capable models

### supportsAdaptiveThinking (I21)

**What it does:**
Determines if a model supports adaptive thinking (dynamic budget adjustment).

**Location:** chunks.56.mjs:1355-1360

```javascript
// ============================================
// supportsAdaptiveThinking - Checks if model supports adaptive thinking
// Location: chunks.56.mjs:1355-1360
// ============================================

// ORIGINAL (for source lookup):
function I21(A) {
    let q = IY(A);
    if (q.includes("opus-4-6") || q.includes("sonnet-4-6")) return !0;
    if (q.includes("opus") || q.includes("sonnet") || q.includes("haiku")) return !1;
    return !1
}

// READABLE (for understanding):
function supportsAdaptiveThinking(model) {
    let normalizedModel = normalizeModelName(model);

    // Only Opus 4.6 and Sonnet 4.6 support adaptive thinking
    if (normalizedModel.includes("opus-4-6") || normalizedModel.includes("sonnet-4-6")) {
        return true;
    }

    // Other Opus/Sonnet/Haiku explicitly don't support adaptive
    if (normalizedModel.includes("opus") ||
        normalizedModel.includes("sonnet") ||
        normalizedModel.includes("haiku")) {
        return false;
    }

    return false;
}

// Mapping: I21→supportsAdaptiveThinking, A→model, IY→normalizeModelName
```

**Key insight:**
- Adaptive thinking is the modern approach (no fixed budget)
- Only Claude 4.6 models support it
- Falls back to enabled thinking for older models

### getThinkingBudgetLimits (oa)

**What it does:**
Returns model-specific default and upper limit for thinking budget tokens.

**Location:** chunks.176.mjs:1533-1547

```javascript
// ============================================
// getThinkingBudgetLimits - Returns thinking budget limits by model
// Location: chunks.176.mjs:1533-1547
// ============================================

// ORIGINAL (for source lookup):
function oa(A) {
    let q, K, Y = IY(A);
    if (Y.includes("opus-4-5") || Y.includes("opus-4-6") || Y.includes("sonnet-4") || Y.includes("haiku-4")) q = 32000, K = 64000;
    else if (Y.includes("opus-4-1") || Y.includes("opus-4")) q = 32000, K = 32000;
    else if (Y.includes("claude-3-opus")) q = 4096, K = 4096;
    else if (Y.includes("claude-3-sonnet")) q = 8192, K = 8192;
    else if (Y.includes("claude-3-haiku")) q = 4096, K = 4096;
    else if (Y.includes("3-5-sonnet") || Y.includes("3-5-haiku")) q = 8192, K = 8192;
    else if (Y.includes("3-7-sonnet")) q = 32000, K = 64000;
    else q = q2z, K = K2z;
    return {
        default: q,
        upperLimit: K
    }
}

// READABLE (for understanding):
function getThinkingBudgetLimits(model) {
    let normalizedModel = normalizeModelName(model);
    let defaultBudget, upperLimit;

    // Claude 4.x series (32K default, 64K max)
    if (normalizedModel.includes("opus-4-5") ||
        normalizedModel.includes("opus-4-6") ||
        normalizedModel.includes("sonnet-4") ||
        normalizedModel.includes("haiku-4")) {
        defaultBudget = 32000;
        upperLimit = 64000;
    }
    // Opus 4 (fixed 32K)
    else if (normalizedModel.includes("opus-4-1") || normalizedModel.includes("opus-4")) {
        defaultBudget = 32000;
        upperLimit = 32000;
    }
    // Claude 3 Opus (4K fixed)
    else if (normalizedModel.includes("claude-3-opus")) {
        defaultBudget = 4096;
        upperLimit = 4096;
    }
    // Claude 3 Sonnet (8K fixed)
    else if (normalizedModel.includes("claude-3-sonnet")) {
        defaultBudget = 8192;
        upperLimit = 8192;
    }
    // Claude 3 Haiku (4K fixed)
    else if (normalizedModel.includes("claude-3-haiku")) {
        defaultBudget = 4096;
        upperLimit = 4096;
    }
    // Claude 3.5 (8K fixed)
    else if (normalizedModel.includes("3-5-sonnet") || normalizedModel.includes("3-5-haiku")) {
        defaultBudget = 8192;
        upperLimit = 8192;
    }
    // Claude 3.7 Sonnet (32K default, 64K max)
    else if (normalizedModel.includes("3-7-sonnet")) {
        defaultBudget = 32000;
        upperLimit = 64000;
    }
    // Default fallback
    else {
        defaultBudget = 32000;  // q2z constant
        upperLimit = 64000;     // K2z constant
    }

    return { default: defaultBudget, upperLimit };
}

// Mapping: oa→getThinkingBudgetLimits, A→model, IY→normalizeModelName,
//   q→defaultBudget, K→upperLimit, Y→normalizedModel, q2z→DEFAULT_BUDGET, K2z→UPPER_LIMIT
```

**Budget Summary Table:**

| Model Series | Default | Upper Limit | Notes |
|--------------|---------|-------------|-------|
| Opus 4.5/4.6 | 32K | 64K | Supports adaptive |
| Sonnet 4.x | 32K | 64K | Supports adaptive |
| Haiku 4.x | 32K | 64K | Supports adaptive |
| Opus 4.1/4 | 32K | 32K | Fixed budget |
| Claude 3 Opus | 4K | 4K | Fixed budget |
| Claude 3 Sonnet | 8K | 8K | Fixed budget |
| Claude 3 Haiku | 4K | 4K | Fixed budget |
| Claude 3.5 | 8K | 8K | Fixed budget |
| Claude 3.7 Sonnet | 32K | 64K | Fixed budget |

### getDefaultThinkingBudget (FGq)

**What it does:**
Returns the default thinking budget for a model (upperLimit - 1 for safety).

**Location:** chunks.176.mjs:1549-1551

```javascript
// ============================================
// getDefaultThinkingBudget - Returns safe default budget
// Location: chunks.176.mjs:1549-1551
// ============================================

// ORIGINAL (for source lookup):
function FGq(A) {
    return oa(A).upperLimit - 1
}

// READABLE (for understanding):
function getDefaultThinkingBudget(model) {
    // Return upper limit - 1 to ensure budget < max_tokens
    return getThinkingBudgetLimits(model).upperLimit - 1;
}

// Mapping: FGq→getDefaultThinkingBudget, A→model, oa→getThinkingBudgetLimits
```

**Why upperLimit - 1:**
The API requires `budget_tokens < max_tokens`. Using `upperLimit - 1` ensures the budget always fits within the max_tokens constraint.

### buildContextManagementConfig (gG7)

**What it does:**
Builds the context_management configuration for API requests when thinking is enabled.

**Location:** chunks.56.mjs:1291-1302

```javascript
// ============================================
// buildContextManagementConfig - Context management for thinking
// Location: chunks.56.mjs:1291-1302
// ============================================

// ORIGINAL (for source lookup):
function gG7(A) {
    let {
        hasThinking: q = !1
    } = A ?? {}, K = [];
    if (q && w8("tengu_marble_anvil", !1)) K.push({
        type: "clear_thinking_20251015",
        keep: "all"
    });
    return K.length > 0 ? {
        edits: K
    } : void 0
}

// READABLE (for understanding):
function buildContextManagementConfig(options) {
    let { hasThinking = false } = options ?? {};
    let edits = [];

    // Experimental feature: keep thinking blocks in context
    if (hasThinking && getFeatureFlag("tengu_marble_anvil", false)) {
        edits.push({
            type: "clear_thinking_20251015",
            keep: "all"
        });
    }

    return edits.length > 0 ? { edits } : undefined;
}

// Mapping: gG7→buildContextManagementConfig, A→options, q→hasThinking,
//   K→edits, w8→getFeatureFlag
```

**Key insight:**
- Context management controls how thinking blocks are preserved
- The `tengu_marble_anvil` flag enables keeping all thinking in context
- This is an experimental feature for advanced thinking preservation

---

## Thinking Configuration Algorithm

### Decision Flow

```
                    ┌─────────────────────────────────┐
                    │   isThinkingEnabled()?          │
                    │   Check DISABLE_THINKING env    │
                    │   Check alwaysThinkingEnabled   │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │ Yes                           │ No
                    ▼                               ▼
            ┌───────────────────┐           ┌───────────────┐
            │ supportsThinking? │           │ thinking:     │
            │ (QG7)             │           │ undefined     │
            └─────────┬─────────┘           └───────────────┘
                      │
                      │ Only for Claude 4.x+
                      │
                      ▼
            ┌───────────────────────────────┐
            │ CLAUDE_CODE_DISABLE_          │
            │ ADAPTIVE_THINKING?            │
            └───────────────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            │ No                            │ Yes
            ▼                               ▼
    ┌───────────────────────┐       ┌───────────────────────┐
    │ supportsAdaptive?     │       │ Use enabled thinking  │
    │ (I21)                 │       │ with budget_tokens    │
    └───────────┬───────────┘       └───────────────────────┘
                │
                ┌───────────────────┐
                │ Opus 4.6/Sonnet 4.6│
                │                   │
                ▼                   ▼
        ┌───────────────┐   ┌───────────────────────┐
        │ thinking:     │   │ thinking:             │
        │ { type:       │   │ { type: "enabled",    │
        │   "adaptive"} │   │   budget_tokens: N }  │
        └───────────────┘   └───────────────────────┘
```

### Implementation in streamingQueryCore

```javascript
// ============================================
// Thinking configuration in streamingQueryCore
// Location: chunks.171.mjs:130-143
// ============================================

// ORIGINAL (for source lookup):
C6 = K.type !== "disabled" && !t6(process.env.CLAUDE_CODE_DISABLE_THINKING),
    o6 = void 0;
if (C6 && QG7(_.model))
    if (!t6(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) && I21(_.model)) o6 = {
        type: "adaptive"
    };
    else {
        let j6 = FGq(_.model);
        if (K.type === "enabled" && K.budgetTokens !== void 0) j6 = K.budgetTokens;
        j6 = Math.min(u6 - 1, j6), o6 = {
            budget_tokens: j6,
            type: "enabled"
        }
    }

// READABLE (for understanding):
let hasThinking = thinkingConfig.type !== "disabled" &&
    !parseBoolean(process.env.CLAUDE_CODE_DISABLE_THINKING);
let thinkingParams = undefined;

if (hasThinking && supportsThinking(model)) {
    // Try adaptive thinking first (Claude 4.6+)
    if (!parseBoolean(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) &&
        supportsAdaptiveThinking(model)) {
        thinkingParams = { type: "adaptive" };
    } else {
        // Fall back to enabled thinking with budget
        let budget = getDefaultThinkingBudget(model);

        // Allow override from thinkingConfig
        if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== undefined) {
            budget = thinkingConfig.budgetTokens;
        }

        // Ensure budget < max_tokens
        budget = Math.min(maxTokens - 1, budget);

        thinkingParams = {
            budget_tokens: budget,
            type: "enabled"
        };
    }
}

// Mapping: C6→hasThinking, o6→thinkingParams, K→thinkingConfig, u6→maxTokens,
//   t6→parseBoolean, QG7→supportsThinking, I21→supportsAdaptiveThinking, FGq→getDefaultThinkingBudget
```

---

## Environment Variables

| Variable | Effect |
|----------|--------|
| `CLAUDE_CODE_DISABLE_THINKING` | Disables all thinking mode |
| `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` | Forces enabled thinking instead of adaptive |
| `MAX_THINKING_TOKENS` | Custom max thinking budget |

---

## API Request Integration

### Request Parameter Building

When thinking is enabled, the API request includes:

```javascript
{
    model: "claude-sonnet-4-6",
    messages: [...],
    system: [...],
    max_tokens: 8192,
    thinking: {
        type: "adaptive"  // or { type: "enabled", budget_tokens: 31999 }
    },
    // Temperature is excluded when thinking is enabled
    // ... other parameters
}
```

**Important:** When thinking is enabled, the `temperature` parameter is **not included** in the request. This is because thinking mode and temperature are mutually exclusive.

```javascript
// Location: chunks.171.mjs:156
let K1 = !C6 ? _.temperatureOverride ?? 1 : void 0;

// Only include temperature when thinking is disabled
...K1 !== void 0 && { temperature: K1 }
```

---

## Effort Level Integration

Effort levels control the depth of thinking (for adaptive thinking models):

| Effort | Value | Use Case |
|--------|-------|----------|
| `low` | 1 | Subagents, simple tasks |
| `medium` | 5 | Balanced reasoning |
| `high` | 10 | Default, deep reasoning |
| `max` | - | Opus 4.6 only, deepest reasoning |

Effort is configured in `output_config`:

```javascript
{
    output_config: {
        effort: "high"  // or "low", "medium", "max"
    }
}
```

---

## Telemetry Events

```javascript
// Thinking mode enabled
logEvent("tengu_thinking_mode", {
    type: "adaptive" | "enabled",
    budgetTokens: number | undefined,
    model: string
});

// Thinking budget adjusted
logEvent("tengu_thinking_budget_adjusted", {
    originalBudget: number,
    adjustedBudget: number,
    maxTokens: number,
    reason: "max_tokens_limit"
});
```

---

## Cross-Feature Linkages

### Integration with Agent Loop (03_llm_core/agent_loop.md)

Thinking configuration is passed through the agent loop to streamingQueryCore:

```
mainAgentLoop
    │
    └── callModel(params)
            │
            └── streamingQueryCore(messages, systemPrompt, tools, thinkingConfig, options)
                    │
                    └── Build thinking params based on model capabilities
```

### Integration with Model Selection

Thinking support affects model selection:
- Adaptive thinking models (Opus 4.6, Sonnet 4.6) get priority for complex reasoning
- Legacy thinking models use fixed budget

### Integration with Context Overflow Recovery

When context overflow occurs, thinking budget is considered:

```javascript
// Location: chunks.89.mjs:70-71
let thinkingBudget = (retryContext.thinkingConfig.type === "enabled"
    ? retryContext.thinkingConfig.budgetTokens
    : 0) + 1;
let adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, thinkingBudget);
```

---

## Summary

Thinking mode in Claude Code 2.1.76 provides:

1. **Adaptive thinking** - Dynamic reasoning depth for Claude 4.6+ models
2. **Enabled thinking** - Fixed budget for older Claude models
3. **Model-specific budgets** - Different limits per model family
4. **Environment control** - Flags to disable or customize thinking
5. **Effort levels** - Control reasoning depth for adaptive models
6. **API integration** - Proper parameter building with temperature exclusion

The key insight is that adaptive thinking is the future direction - it allows the model to dynamically adjust reasoning depth based on task complexity, without requiring manual budget tuning.