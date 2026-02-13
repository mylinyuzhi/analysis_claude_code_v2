# Fast Mode API Integration

## Module Overview

This document analyzes how Fast Mode integrates with the Anthropic LLM API, including beta flag injection, model selection, and request parameter modifications.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Fast mode symbols

Key functions:
- `getSmallFastModel` (_J) - Resolves fast model name from env/config
- `isOpusCompatible` (x$) - Checks if model supports fast mode
- API request builder in chunks.169.mjs - Injects beta flags

---

## 1. API Beta Flag Injection

### 1.1 Research Preview Beta

**THE KEY INSIGHT**: Fast Mode is NOT a model switch - it's a **beta flag** that enables optimized streaming on Opus 4.6.

// ============================================
// API Request Builder with Fast Mode Beta
// Location: chunks.169.mjs:880-900
// ============================================

// ORIGINAL (for source lookup):
if (i4() && !Kv() && lH() && x$(w.model) && !!z1.fastMode) {
    $1.research_preview_2026_02 = "active",
    Y1.push(BcA);
}

// READABLE (for understanding):
if (isFastModeAvailable() &&
    !isFastModeCooldownActive() &&
    canUserUseFastMode() &&
    isOpusCompatible(currentModel) &&
    userHasFastModeEnabled) {

    // Add to request metadata
    requestMetadata.research_preview_2026_02 = "active";

    // Push beta identifier to betas array
    betasArray.push("research-preview-2026-02-01");
}

// Mapping:
// i4 → isFastModeAvailable
// Kv → isFastModeCooldownActive
// lH → canUserUseFastMode
// x$ → isOpusCompatible
// $1 → requestMetadata
// Y1 → betasArray
// BcA → "research-preview-2026-02-01"

**What it does**: Conditionally injects the research preview beta flag into API requests.

**Conditions for injection** (ALL must be true):
1. Fast mode feature enabled globally (`isFastModeAvailable()`)
2. Not in cooldown period (`!isFastModeCooldownActive()`)
3. User subscription allows fast mode (`canUserUseFastMode()`)
4. Current model is Opus 4.6 (`isOpusCompatible()`)
5. User toggled fast mode ON (`userHasFastModeEnabled`)

**API request format**:
```javascript
{
    model: "claude-opus-4-6-20250514",
    messages: [...],
    system: "...",
    tools: [...],
    betas: ["research-preview-2026-02-01"],  // ← Fast mode beta
    metadata: {
        research_preview_2026_02: "active",  // ← Additional metadata
        user_id: "..."
    },
    max_tokens: 8192,
    temperature: 1.0
}
```

**Why this approach**:
- **Backward compatible**: Old clients work without beta
- **Gradual rollout**: Can control who gets fast mode via feature flags
- **A/B testing**: Can track performance via metadata flag
- **Future-proof**: Can add more betas independently

---

### 1.2 Beta Effect on API Behavior

**What the beta does** (server-side):
1. **Prioritizes output streaming** over internal thinking
2. **Reduces time-to-first-token** (TTFT) latency
3. **Limits extended thinking** (via client-side `max_thinking_tokens: 0`)
4. **Optimizes for interactive use** vs. batch processing

**Performance characteristics**:
- **TTFT reduction**: ~40-60% faster initial response
- **Total response time**: Similar (thinking still happens, just optimized)
- **Quality trade-off**: Minimal for simple tasks, noticeable for complex reasoning

---

## 2. Model Selection Logic

### 2.1 Fast Model Name Resolution

// ============================================
// Fast Model Name Getter
// Location: chunks.47.mjs:1933-1935
// ============================================

// ORIGINAL (for source lookup):
function _J() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || I7A()
}

function I7A() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL)
        return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return HH().haiku45
}

// READABLE (for understanding):
function getSmallFastModel() {
    // Priority 1: Explicit fast model override
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultHaikuModel();
}

function getDefaultHaikuModel() {
    // Priority 2: Default Haiku override
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
        return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    }

    // Priority 3: Hardcoded Haiku 4.5
    return getModelConfig().haiku45;  // "claude-3-5-haiku-20241022"
}

// Mapping: _J→getSmallFastModel, I7A→getDefaultHaikuModel, HH→getModelConfig

**Environment variable precedence**:
```
ANTHROPIC_SMALL_FAST_MODEL  (highest)
  ↓ if not set
ANTHROPIC_DEFAULT_HAIKU_MODEL
  ↓ if not set
"claude-3-5-haiku-20241022"  (hardcoded)
```

**Why three levels**:
- **ANTHROPIC_SMALL_FAST_MODEL**: For testing experimental models
- **ANTHROPIC_DEFAULT_HAIKU_MODEL**: For enterprise custom deployments
- **Hardcoded**: Ensures fallback always works

---

### 2.2 Opus Compatibility Check

// ============================================
// Opus Model Check
// Location: chunks.47.mjs:707-711
// ============================================

// ORIGINAL (for source lookup):
function x$(A) {
    if (!i4()) return !1;
    let q = A ?? u_1();
    return t9(q).toLowerCase().includes("opus-4-6")
}

// READABLE (for understanding):
function isOpusCompatibleWithFastMode(modelName) {
    if (!isFastModeAvailable()) return false;

    const modelToCheck = modelName ?? getCurrentMainLoopModel();
    return normalizeModelName(modelToCheck).toLowerCase().includes("opus-4-6");
}

// Mapping: x$→isOpusCompatibleWithFastMode, i4→isFastModeAvailable,
// u_1→getCurrentMainLoopModel, t9→normalizeModelName

**Compatible models**:
- `claude-opus-4-6-20250514`
- `claude-opus-4-6`
- Any model name containing "opus-4-6" (case-insensitive)

**NOT compatible**:
- Sonnet variants
- Haiku variants
- Opus 3.x variants

**Key design decision**: Fast mode is ONLY for Opus 4.6, not a general feature.

---

## 3. Request Parameter Modifications

### 3.1 Extended Thinking Disabling

**When fast mode is active**, the following parameter is forced:

```javascript
{
    max_thinking_tokens: 0  // Disable extended thinking
}
```

**Rationale**:
- Extended thinking adds latency (waiting for <thinking> blocks)
- Fast mode prioritizes speed over deep reasoning
- User explicitly chose fast mode = willing to trade quality for speed

**Example comparison**:

| Mode | max_thinking_tokens | Behavior |
|------|---------------------|----------|
| Standard | Default (varies) | Full extended thinking enabled |
| Fast Mode | 0 | No <thinking> blocks, direct response |

---

### 3.2 Model Lock on Enable

When user toggles `/fast` on, the system auto-switches to Opus if not already on it:

// ============================================
// Model Auto-Switch on Fast Mode Enable
// Location: chunks.163.mjs:631-649
// ============================================

// READABLE (for understanding):
if (enableFastMode) {
    setAppState((state) => {
        const needsModelChange = !isOpusCompatible(state.mainLoopModel);
        return {
            ...state,
            ...needsModelChange ? {
                mainLoopModel: DEFAULT_OPUS_MODEL,  // "claude-opus-4-6"
                mainLoopModelForSession: null
            } : {},
            fastMode: true
        };
    });
}

**What it does**: Forces Opus 4.6 when enabling fast mode if user was on different model.

**Example flow**:
```
User is on: Sonnet 4.5
User types: /fast
Result:
  - Model changes to: Opus 4.6
  - Fast mode enabled: true
  - Message: "Fast mode ON · model set to Opus 4.6 · Billed at a premium rate"
```

---

### 3.3 Auto-Disable on Model Switch

// ============================================
// Fast Mode Disabling on Non-Opus Model Selection
// Location: chunks.166.mjs:2327-2341
// ============================================

// READABLE (for understanding):
function setSelectedModel(newModel) {
    updateAppState((state) => ({
        ...state,
        mainLoopModel: newModel,
        mainLoopModelForSession: null
    }));

    if (isFastModeAvailable()) {
        resetCooldownStatus();

        if (!isOpusCompatible(newModel) && userHadFastModeEnabled) {
            updateAppState((state) => ({
                ...state,
                fastMode: false
            }));
            notifyUser("Set model to Sonnet 4.5 · Fast mode OFF");
        }
    }
}

**What it does**: Auto-disables fast mode if user switches to non-Opus model.

**Example flow**:
```
User is on: Opus 4.6 (fast mode ON)
User types: /model sonnet
Result:
  - Model changes to: Sonnet 4.5
  - Fast mode disabled: false
  - Message: "Set model to Sonnet 4.5 · Fast mode OFF"
```

**Rationale**: Fast mode beta only works with Opus 4.6, so disabling prevents confusion.

---

## 4. Billing and Cost Integration

### 4.1 Premium Rate Notification

**UI Display** (chunks.47.mjs:864):
```javascript
$S = "Opus 4.6"
O7A = "Billed at a premium rate"
```

**When shown**:
```javascript
if (fastModeEnabled && isOpusModel(currentModel)) {
    message += ` · ${BILLING_MESSAGE}`;  // "Billed at a premium rate"
}
```

**Example messages**:
- `"Fast mode ON · Billed at a premium rate"`
- `"Set model to Opus 4.6 · Billed at a premium rate"`

---

### 4.2 Promotional Pricing

Fast mode supports dynamic promotional messaging:

// ============================================
// Promotional Info Display
// Location: chunks.163.mjs:803-834
// ============================================

// READABLE (for understanding):
const promoInfo = getPromoInfo();  // { discountPercent: 20, endDate: "2026-03-01" }
if (promoInfo) {
    message += ` (${promoInfo.discountPercent}% off through ${promoInfo.endDate})`;
}

**Example with promo**:
```
"Fast mode ON · Billed at a premium rate (20% off through March 1)"
```

**Promo configuration**: Likely server-fetched via API, stored in global state.

---

## 5. Error Handling

### 5.1 API Error Codes

**Fast mode can fail with specific API error codes**:

| Error Code | Meaning | User Action |
|------------|---------|-------------|
| `research_preview_not_available` | Beta not available for account | Contact support |
| `model_overloaded` | Opus 4.6 at capacity | Retry later or disable fast mode |
| `invalid_beta` | Beta flag malformed | Check client version |

---

### 5.2 Fallback on Error

When API request with fast mode beta fails:

1. **Cooldown triggered**: `triggerFastModeCooldown(resetAt)`
2. **User notified**: "Fast mode temporarily unavailable"
3. **Request retried**: WITHOUT beta flag, normal mode
4. **Auto-recovery**: After cooldown expires, fast mode re-enables

---

## 6. Telemetry Integration

**Events tracked**:

```javascript
telemetry("tengu_fast_mode_enabled", {
    model: "opus-4-6",
    previous_model: "sonnet-4-5"
});

telemetry("tengu_fast_mode_api_request", {
    beta_included: true,
    cooldown_active: false
});

telemetry("tengu_fast_mode_fallback_triggered", {
    cooldown_duration_ms: 300000  // 5 minutes
});
```

**Purpose**:
- Track adoption rates
- Measure latency improvements
- Debug quota issues
- Analyze cost impact

---

## 7. Integration with Agent Loop

### 7.1 State Reporting to Agent

**Location: chunks.179.mjs:209-212**

The agent loop reports fast mode state in system message:

```javascript
let isFastModeActive = isFastModeAvailable() &&
                       userHasFastModeEnabled &&
                       isOpusCompatible(currentModel);

let fastModeState = "off";

if (isFastModeActive && isCooldownActive()) {
    fastModeState = "cooldown";
} else if (isFastModeActive) {
    fastModeState = "on";
}

systemMessageData.fast_mode_state = fastModeState;
```

**Agent receives one of**:
- `"off"` - Not enabled
- `"on"` - Actively enabled
- `"cooldown"` - Temporarily disabled

**Agent can adapt behavior**: When `fast_mode_state === "on"`, Claude knows it's in fast mode and can adjust responses accordingly (e.g., provide quicker, more concise answers).

---

## Summary

Fast Mode API integration is **sophisticated and multi-layered**:

1. **Beta Flag System**: `research-preview-2026-02-01` enables server-side optimizations
2. **Model Locking**: Forces Opus 4.6, auto-disables on model switch
3. **Parameter Injection**: Sets `max_thinking_tokens: 0` for speed
4. **Conditional Application**: Only when 5 conditions met (available, not cooldown, user allowed, Opus, enabled)
5. **Error Handling**: Graceful fallback with cooldown on failures
6. **Cost Transparency**: Clear "premium rate" messaging
7. **Telemetry**: Comprehensive tracking for optimization

**Key architectural insight**: Fast mode is NOT about using a smaller model - it's about **optimizing the SAME model (Opus 4.6) for lower latency** via API beta flags and client-side parameter tuning.
