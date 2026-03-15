# Effort & Thinking Level Control (Claude Code 2.1.38)

> Effort/thinking level configuration, beta header management, level-to-budget mapping, adaptive vs enabled thinking, model-specific behavior, and LLM request integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getEffortFromEnv` (Sn7) - Reads effort level from CLAUDE_CODE_EFFORT_LEVEL env var
- `getEffortFromSettings` (qPA) - Reads effort level from user settings
- `parseEffortValue` (uK1) - Parses and validates effort values (string names or integer budgets)
- `getDefaultEffortForModel` (p17) - Returns the default effort for a given model (currently always `undefined`)
- `isOpus46Model` (VB1/ok7) - Checks if the model is Opus 4.6 (affects thinking mode)
- `getInitialThinkingEnabled` (fw6) - Determines initial thinking toggle state
- `getDefaultThinkingBudget` (rz1) - Returns the default thinking budget (31999 tokens)
- `applyEffortToRequest` (x9z) - Applies effort config to the API request output_config

---

## Architecture Overview

```
User Configuration
  ├── CLAUDE_CODE_EFFORT_LEVEL env var
  ├── settings.json → effortLevel
  ├── /settings menu → effortValue (runtime toggle)
  └── CLI --effort flag

  ▼
Effort Resolution Chain (priority order):
  1. Sn7() - Environment variable (highest priority)
  2. w.effortValue - Session-level override from AppState
  3. p17(model) - Model default (currently always undefined)

  ▼
Request Building (in O1 closure):
  ├── If Opus 4.6 (ok7): Use "adaptive" thinking
  │    └── Beta: adaptive-thinking-2026-01-28
  ├── Else: Use "enabled" thinking with budget_tokens
  │    └── Beta: interleaved-thinking-2025-05-14
  └── Effort: Applied to output_config.effort
       └── Beta: effort-2025-11-24

  ▼
API Request:
  {
    thinking: { type: "adaptive" } | { type: "enabled", budget_tokens: N },
    output_config: { effort: "low" | "medium" | "high" | "max" },
    betas: [...applicable beta headers...]
  }
```

---

## Effort Level System

### Valid Effort Values

Effort controls how much computational effort the model expends on a response. It accepts two types of values:

1. **String levels**: `"low"`, `"medium"`, `"high"`, `"max"` -- mapped to the API's effort parameter
2. **Integer budget**: A numeric thinking token budget (e.g., `10000`) -- used directly as `budget_tokens`

```javascript
// ============================================
// parseEffortValue - Validates and normalizes effort values
// Location: chunks.90.mjs:3072-3078
// ============================================

// ORIGINAL (for source lookup):
function uK1(A) {
    if (A === void 0 || A === null || A === "") return;
    let q = typeof A === "number" ? A : parseInt(String(A), 10);
    if (!isNaN(q) && nL9(q)) return q;
    if (typeof A === "string" && WJ6.includes(A)) return A;
    return
}

// READABLE (for understanding):
function parseEffortValue(value) {
    if (value === undefined || value === null || value === "") return undefined;

    // Try as integer (thinking token budget)
    let numericValue = typeof value === "number" ? value : parseInt(String(value), 10);
    if (!isNaN(numericValue) && Number.isInteger(numericValue)) return numericValue;

    // Try as string level
    if (typeof value === "string" && EFFORT_LEVELS.includes(value)) return value;

    return undefined;  // Invalid value
}

// Mapping: uK1→parseEffortValue, A→value, q→numericValue, WJ6→EFFORT_LEVELS, nL9→Number.isInteger
```

**Why this approach:**
- Supporting both string levels and integer budgets provides flexibility: string levels are user-friendly for configuration, while integer budgets give precise control for power users and programmatic access
- Invalid values silently return `undefined` (which means "use default"), rather than throwing errors. This makes the system resilient to misconfiguration.

### Effort Resolution Priority

The effort value is resolved with a clear priority chain:

```javascript
// ============================================
// Effort Resolution - Priority chain in request building
// Location: chunks.169.mjs:862
// ============================================

// ORIGINAL (for source lookup):
L1 = Sn7() ?? w.effortValue ?? p17(w.model);

// READABLE (for understanding):
effortLevel = getEffortFromEnv() ?? options.effortValue ?? getDefaultEffortForModel(options.model);
// Priority: env var > session override > model default (currently always undefined)

// Mapping: L1→effortLevel, Sn7→getEffortFromEnv, w.effortValue→options.effortValue, p17→getDefaultEffortForModel
```

```javascript
// ============================================
// getEffortFromEnv - Reads effort from environment
// Location: chunks.90.mjs:3085-3087
// ============================================

// ORIGINAL (for source lookup):
function Sn7() {
    return uK1(process.env.CLAUDE_CODE_EFFORT_LEVEL)
}

// READABLE (for understanding):
function getEffortFromEnv() {
    return parseEffortValue(process.env.CLAUDE_CODE_EFFORT_LEVEL);
}

// Mapping: Sn7→getEffortFromEnv, uK1→parseEffortValue
```

```javascript
// ============================================
// getEffortFromSettings - Reads effort from user settings
// Location: chunks.90.mjs:3080-3083
// ============================================

// ORIGINAL (for source lookup):
function qPA() {
    let A = l4();
    return uK1(A.effortLevel)
}

// READABLE (for understanding):
function getEffortFromSettings() {
    let settings = getUserSettings();
    return parseEffortValue(settings.effortLevel);
}

// Mapping: qPA→getEffortFromSettings, A→settings, l4→getUserSettings
```

**Key insight:** `p17` (getDefaultEffortForModel) currently always returns `undefined`, meaning there is no model-specific default effort. All models use the same default behavior when no explicit effort is configured. This function exists as a hook for future differentiation.

---

## Thinking Mode Configuration

### Two Thinking Modes: Adaptive vs Enabled

Claude Code uses two distinct thinking modes depending on the model:

#### Adaptive Thinking (Opus 4.6 only)

When the model is Opus 4.6 (detected by `ok7`/`VB1`), thinking is set to **adaptive** mode:

```javascript
thinking: { type: "adaptive" }
```

This uses the `adaptive-thinking-2026-01-28` beta header. In adaptive mode, the model decides internally how much thinking to do based on the task complexity. No budget is specified.

#### Enabled Thinking (all other models)

For other models, thinking uses **enabled** mode with an explicit budget:

```javascript
thinking: { type: "enabled", budget_tokens: budgetValue }
```

This uses the `interleaved-thinking-2025-05-14` beta header.

```javascript
// ============================================
// Thinking Configuration - Applied in request building
// Location: chunks.169.mjs:867-884
// ============================================

// ORIGINAL (for source lookup):
if (K !== 0)
    if (ok7(w.model)) {
        if ($1.thinking = { type: "adaptive" }, !Y1.includes($L6)) Y1.push($L6);
        let A6 = Y1.indexOf(Hn1);
        if (A6 !== -1) Y1.splice(A6, 1)
    } else {
        let A6 = K ?? rz1(w.model),
            O6 = z1.maxTokensOverride || w.maxOutputTokensOverride;
        x1 = { budget_tokens: O6 ? Math.min(A6, O6 - 1) : A6, type: "enabled" }
    }

// READABLE (for understanding):
if (maxThinkingTokens !== 0) {
    if (isOpus46(options.model)) {
        // Opus 4.6: Use adaptive thinking (model decides budget)
        outputConfig.thinking = { type: "adaptive" };
        if (!betas.includes(ADAPTIVE_THINKING_BETA)) betas.push(ADAPTIVE_THINKING_BETA);
        // Remove old interleaved thinking beta if present
        let oldBetaIndex = betas.indexOf(INTERLEAVED_THINKING_BETA);
        if (oldBetaIndex !== -1) betas.splice(oldBetaIndex, 1);
    } else {
        // Other models: Use enabled thinking with explicit budget
        let budget = maxThinkingTokens ?? getDefaultThinkingBudget(options.model);
        let maxOutputOverride = retryContext.maxTokensOverride || options.maxOutputTokensOverride;
        thinkingConfig = {
            budget_tokens: maxOutputOverride ? Math.min(budget, maxOutputOverride - 1) : budget,
            type: "enabled"
        };
    }
}

// Mapping: K→maxThinkingTokens, ok7→isOpus46, $L6→ADAPTIVE_THINKING_BETA, Hn1→INTERLEAVED_THINKING_BETA, rz1→getDefaultThinkingBudget
```

**Why this approach:**
- Opus 4.6 has a more advanced thinking capability that can self-regulate, so adaptive mode lets it optimize internally
- Other models benefit from explicit budget control to prevent runaway thinking that consumes the output token limit
- The budget is capped at `maxOutputOverride - 1` when an output override exists, ensuring at least 1 token remains for actual output after thinking

**Key insight:** When `maxThinkingTokens === 0`, thinking is completely disabled -- no thinking config is set, and the old non-thinking API behavior is used. The `thinkingEnabled` toggle in the UI maps to `maxThinkingTokens > 0` vs `maxThinkingTokens === 0`.

---

## Default Thinking Budget

### getDefaultThinkingBudget

```javascript
// ============================================
// getDefaultThinkingBudget - Default thinking token budget
// Location: chunks.1.mjs:2319-2321
// ============================================

// ORIGINAL (for source lookup):
function rz1(A) {
    return Jbq
}
// Jbq = 31999

// READABLE (for understanding):
function getDefaultThinkingBudget(model) {
    return DEFAULT_THINKING_BUDGET;  // 31999 tokens
}
// DEFAULT_THINKING_BUDGET = 31999

// Mapping: rz1→getDefaultThinkingBudget, Jbq→DEFAULT_THINKING_BUDGET
```

The default budget of **31999** tokens is one less than the default max output tokens (32000), ensuring the thinking budget fits within the output limit. This value is model-independent (the function ignores its `model` parameter), establishing a universal baseline.

---

## Effort Application to Request

### applyEffortToRequest

**What it does:** Adds the effort parameter to the API request's `output_config` and ensures the appropriate beta header is included.

**How it works:**

1. Checks if the model supports effort via `VB1` (isOpus46Model). If NOT Opus 4.6, or if effort is already set in `output_config`, returns without changes.
2. If effort is `undefined` (no explicit setting), adds the effort beta header but no effort value -- the API uses its default.
3. If effort is a string level, sets `output_config.effort = level` and adds the beta header.

```javascript
// ============================================
// applyEffortToRequest - Adds effort to output_config
// Location: chunks.169.mjs:566-570
// ============================================

// ORIGINAL (for source lookup):
function x9z(A, q, K, Y, z) {
    if (!VB1(z) || "effort" in q) return;
    if (A === void 0) Y.push(HL6);
    else if (typeof A === "string") q.effort = A, Y.push(HL6)
}

// READABLE (for understanding):
function applyEffortToRequest(effortLevel, outputConfig, extraBody, betas, model) {
    // Only apply to Opus 4.6 models, and only if not already set
    if (!isOpus46Model(model) || "effort" in outputConfig) return;

    if (effortLevel === undefined) {
        // No explicit effort: just add beta header, API uses default
        betas.push(EFFORT_BETA);
    } else if (typeof effortLevel === "string") {
        // String level: set on output_config
        outputConfig.effort = effortLevel;
        betas.push(EFFORT_BETA);
    }
    // Note: integer budget values are NOT handled here - they go through thinking config instead
}

// Mapping: x9z→applyEffortToRequest, A→effortLevel, q→outputConfig, K→extraBody, Y→betas, z→model
```

**Why this approach:**
- Effort is only supported on Opus 4.6, so it is gated by `VB1` model check
- The `"effort" in q` check prevents overriding effort that was already set via `CLAUDE_CODE_EXTRA_BODY` env var
- When effort is `undefined`, the beta header is still added to enable the API's default effort behavior (which may differ from no-effort behavior)

**Key insight:** Integer effort values (thinking budgets) do NOT flow through `applyEffortToRequest`. Instead, they are used directly as `maxThinkingTokens` in the thinking config. This means:
- String levels ("low", "medium", "high", "max") affect the `effort` API parameter
- Integer values (e.g., `10000`) affect the `thinking.budget_tokens` parameter
- These are two different mechanisms: effort controls reasoning depth at the API level, while budget_tokens controls the thinking block size

---

## Beta Header Management

### Beta Headers for Thinking & Effort

The system manages several related beta headers:

| Constant | Obfuscated | Value | Purpose |
|----------|-----------|-------|---------|
| `INTERLEAVED_THINKING_BETA` | `Hn1` | `"interleaved-thinking-2025-05-14"` | Standard thinking mode |
| `ADAPTIVE_THINKING_BETA` | `$L6` | `"adaptive-thinking-2026-01-28"` | Opus 4.6 adaptive thinking |
| `EFFORT_BETA` | `HL6` | `"effort-2025-11-24"` | Effort level control |
| `CLAUDE_CODE_BETA` | `xcA` | `"claude-code-20250219"` | Base Claude Code beta |

Header selection logic:
1. Start with model-specific base betas via `es1` (getModelBetas)
2. If dynamic tool loading is enabled, add tool search beta
3. If global prompt caching is enabled, add caching scope beta
4. During request param building (O1 closure):
   - If Opus 4.6 with thinking: add `ADAPTIVE_THINKING_BETA`, remove `INTERLEAVED_THINKING_BETA`
   - If other model with thinking: keep `INTERLEAVED_THINKING_BETA` (already in base)
   - If effort is configured: add `EFFORT_BETA`
   - If fast mode is active: add research preview beta
   - If structured output is requested: add structured output beta

**Key insight:** When switching from a non-Opus-4.6 model to Opus 4.6 (or vice versa), the beta headers are dynamically adjusted. The `INTERLEAVED_THINKING_BETA` is explicitly removed for Opus 4.6 to prevent conflicts with `ADAPTIVE_THINKING_BETA`. This swap happens at request time, not at configuration time, so mid-session model changes are handled correctly.

---

## Initial Thinking State

### getInitialThinkingEnabled - Startup thinking toggle

**What it does:** Determines whether thinking should be enabled when the session starts.

**How it works:**

1. If `MAX_THINKING_TOKENS` env var is set and > 0, thinking is enabled
2. If `settings.alwaysThinkingEnabled === false`, thinking is disabled
3. Otherwise, calls `C59(l3())` which checks whether the current model supports thinking

```javascript
// ============================================
// getInitialThinkingEnabled - Startup thinking toggle
// Location: chunks.75.mjs:1759-1766
// ============================================

// ORIGINAL (for source lookup):
function fw6() {
    if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
    let { settings: A } = E81();
    if (A.alwaysThinkingEnabled === !1) return !1;
    return C59(l3())
}

// READABLE (for understanding):
function getInitialThinkingEnabled() {
    // Env var override (highest priority)
    if (process.env.MAX_THINKING_TOKENS) {
        return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
    }
    // User setting override
    let { settings } = getSettingsState();
    if (settings.alwaysThinkingEnabled === false) return false;
    // Default: check if current model supports thinking
    return modelSupportsThinking(getCurrentModel());
}

// Mapping: fw6→getInitialThinkingEnabled, A→settings, E81→getSettingsState, C59→modelSupportsThinking, l3→getCurrentModel
```

**Why this approach:**
- Environment variable has highest priority for CI/CD and testing scenarios
- User settings allow permanent preference (e.g., users on metered plans who want to save tokens)
- Model-based default ensures thinking is automatically enabled for capable models and disabled for models that do not support it

---

## Temperature Interaction

When thinking is enabled (`maxThinkingTokens !== 0`), temperature is forced to `undefined`:

```javascript
let B1 = K !== 0 ? void 0 : w.temperatureOverride ?? 1;
```

This is because the Anthropic API requires temperature to be unset when thinking is enabled. Setting both thinking and temperature results in an API error. When thinking is disabled, temperature defaults to `1` unless overridden.

---

## Non-Streaming Fallback Token Capping

In the non-streaming fallback path, the thinking budget is additionally capped:

```javascript
// ============================================
// capMaxTokens - Caps tokens for non-streaming mode
// Location: chunks.169.mjs:1481-1494
// ============================================

// ORIGINAL (for source lookup):
function g9z(A, q) {
    let K = Math.min(A.max_tokens, q), Y = { ...A };
    if (Y.thinking?.type === "enabled" && Y.thinking.budget_tokens)
        Y.thinking = { ...Y.thinking, budget_tokens: Math.min(Y.thinking.budget_tokens, K - 1) };
    return { ...Y, max_tokens: K }
}

// READABLE (for understanding):
function capMaxTokens(params, nonStreamingMaxTokens) {
    let cappedMax = Math.min(params.max_tokens, nonStreamingMaxTokens);
    let result = { ...params };
    if (result.thinking?.type === "enabled" && result.thinking.budget_tokens) {
        result.thinking = { ...result.thinking, budget_tokens: Math.min(result.thinking.budget_tokens, cappedMax - 1) };
    }
    return { ...result, max_tokens: cappedMax };
}

// Mapping: g9z→capMaxTokens, A→params, q→nonStreamingMaxTokens
```

**Why this approach:** Non-streaming responses must be received in a single HTTP response, so there is a practical limit on response size. The thinking budget is proportionally reduced to fit within this limit, maintaining the invariant that `budget_tokens < max_tokens`.
