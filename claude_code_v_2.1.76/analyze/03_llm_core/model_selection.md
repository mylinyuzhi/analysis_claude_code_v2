# LLM Core: Model Selection (Claude Code 2.1.76)

> Model resolution, deployment types, fallback logic, and fast mode integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (callModel, API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Fast Mode)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model selection, Settings)

Key functions in this document:
- `OJ6` - Model ID registry with deployment-specific IDs
- `_3` - getModelRegistry (returns model ID map)
- `H5` - resolveModelAlias (converts alias to canonical ID)
- `Of` - normalizeModelId (extracts canonical family from partial ID)
- `IY` - extractModelFamily (wraps normalizeModelId)
- `lg` - stripContextMarker (removes [1m] suffix)
- `GN` - getDefaultOpusModel
- `Ef` - getDefaultSonnetModel
- `hT6` - getDefaultHaikuModel
- `cK` - getEffectiveModel (config → env → default)
- `uR` - getConfiguredModel (from settings/env)
- `lH` - getSmallFastModel
- `FH` - isOpus46Model (fast mode eligibility)
- `Dq` - isFastModeAvailable
- `yj` - isFastModeEligible
- `Jm` - isInFastModeCooldown
- `Mm` - getFastModeState

---

## Architecture Overview

```
[User Configuration]
    │ ANTHROPIC_MODEL, settings.model
    ▼
[uR: getConfiguredModel]
    │ Read env var → settings → null
    ▼
[cK: getEffectiveModel]
    │ If null, call g0() for default
    ▼
[H5: resolveModelAlias]
    │ Convert "opus"/"sonnet"/"haiku" → canonical ID
    ▼
[lg: stripContextMarker]
    │ Remove [1m] suffix for API call
    ▼
[API Request]
    model: "claude-opus-4-6" (clean ID)
```

---

## Stage 1: Model Registry

### OJ6 - Central Model ID Registry

**What it does:** A single source of truth for model IDs across all deployment types (firstParty, Bedrock, Vertex, Foundry).

**How it works:**

```javascript
// ============================================
// OJ6 - Model ID registry with deployment-specific mappings
// Location: chunks.39.mjs:2841-2853
// ============================================

// ORIGINAL (for source lookup):
OJ6 = {
    haiku35: dK8,
    haiku45: cK8,
    sonnet35: UK8,
    sonnet37: QK8,
    sonnet40: lK8,
    sonnet45: iK8,
    sonnet46: aK8,
    opus40: nK8,
    opus41: rK8,
    opus45: oK8,
    opus46: wJ6
}

// READABLE (for understanding):
const MODEL_REGISTRY = {
    haiku35: {  // Claude 3.5 Haiku
        firstParty: "claude-3-5-haiku-20241022",
        bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
        vertex: "claude-3-5-haiku@20241022",
        foundry: "claude-3-5-haiku"
    },
    haiku45: {  // Claude Haiku 4.5
        firstParty: "claude-haiku-4-5-20251001",
        bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        vertex: "claude-haiku-4-5@20251001",
        foundry: "claude-haiku-4-5"
    },
    sonnet46: {  // Claude Sonnet 4.6
        firstParty: "claude-sonnet-4-6",
        bedrock: "us.anthropic.claude-sonnet-4-6",
        vertex: "claude-sonnet-4-6",
        foundry: "claude-sonnet-4-6"
    },
    opus46: {  // Claude Opus 4.6
        firstParty: "claude-opus-4-6",
        bedrock: "us.anthropic.claude-opus-4-6-v1",
        vertex: "claude-opus-4-6",
        foundry: "claude-opus-4-6"
    }
    // ... additional models
};

// Mapping: OJ6→MODEL_REGISTRY, dK8→HAIKU_35_CONFIG, cK8→HAIKU_45_CONFIG, etc.
```

### _3 - getModelRegistry

**What it does:** Returns the appropriate model registry, initializing Bedrock model list on first access if needed.

**How it works:**

```javascript
// ============================================
// _3 - getModelRegistry - Returns model ID map
// Location: chunks.176.mjs:1194-1198
// ============================================

// ORIGINAL (for source lookup):
function _3() {
    let A = mw6();
    if (A === null) return s_z(), Ivq(CS1(QA()));
    return Ivq(A)
}

// READABLE (for understanding):
function getModelRegistry() {
    let cachedRegistry = getBedrockModelListCache();
    if (cachedRegistry === null) {
        // Initialize registry for current deployment
        initializeModelRegistry();
        return buildModelRegistryForDeployment(getDeploymentType());
    }
    return buildModelRegistryFromCache(cachedRegistry);
}

// Mapping: _3→getModelRegistry, mw6→getBedrockModelListCache, s_z→initializeModelRegistry
```

---

## Stage 2: Model Resolution

### H5 - resolveModelAlias

**What it does:** Converts user-friendly aliases ("opus", "sonnet", "haiku", "opusplan") to canonical model IDs.

**How it works:**

1. **Normalize input**: Trim whitespace, convert to lowercase
2. **Check context marker**: Detect `[1m]` suffix for 1M context window
3. **Resolve aliases**: Map known aliases to default model IDs
4. **Handle legacy remap**: Special handling for older model IDs
5. **Preserve context marker**: Re-append `[1m]` if originally present

```javascript
// ============================================
// H5 - resolveModelAlias - Converts alias to canonical ID
// Location: chunks.176.mjs:1404-1425
// ============================================

// ORIGINAL (for source lookup):
function H5(A) {
    let q = A.trim(),
        K = q.toLowerCase(),
        Y = Cf(K),
        z = Y ? K.replace(/\[1m\]$/i, "").trim() : K;
    if (zc(z)) switch (z) {
        case "opusplan":
            return Ef() + (Y ? "[1m]" : "");
        case "sonnet":
            return Ef() + (Y ? "[1m]" : "");
        case "haiku":
            return hT6() + (Y ? "[1m]" : "");
        case "opus":
            return GN() + (Y ? "[1m]" : "");
        case "best":
            return mvq();
        default:
    }
    if (QA() === "firstParty" && e_z(z) && IS1()) return GN() + (Y ? "[1m]" : "");
    if (Y) return q.replace(/\[1m\]$/i, "").trim() + "[1m]";
    return q
}

// READABLE (for understanding):
function resolveModelAlias(input) {
    let trimmed = input.trim();
    let lowercased = trimmed.toLowerCase();
    let hasContextMarker = detectContextMarker(lowercased);
    let baseModel = hasContextMarker
        ? lowercased.replace(/\[1m\]$/i, "").trim()
        : lowercased;

    // Handle built-in aliases
    if (isModelAlias(baseModel)) {
        switch (baseModel) {
            case "opusplan":
                return getDefaultSonnetModel() + (hasContextMarker ? "[1m]" : "");
            case "sonnet":
                return getDefaultSonnetModel() + (hasContextMarker ? "[1m]" : "");
            case "haiku":
                return getDefaultHaikuModel() + (hasContextMarker ? "[1m]" : "");
            case "opus":
                return getDefaultOpusModel() + (hasContextMarker ? "[1m]" : "");
            case "best":
                return getBestAvailableModel();
        }
    }

    // Legacy model remap: redirect old opus-4 variants to opus-4-6
    if (getDeploymentType() === "firstParty"
        && isLegacyOpusModel(baseModel)
        && isLegacyRemapEnabled()) {
        return getDefaultOpusModel() + (hasContextMarker ? "[1m]" : "");
    }

    // Preserve context marker for explicit model IDs
    if (hasContextMarker) {
        return trimmed.replace(/\[1m\]$/i, "").trim() + "[1m]";
    }
    return trimmed;
}

// Mapping: H5→resolveModelAlias, Cf→detectContextMarker, zc→isModelAlias,
//          QA→getDeploymentType, e_z→isLegacyOpusModel, IS1→isLegacyRemapEnabled
```

### Of - normalizeModelId

**What it does:** Extracts the canonical model family identifier from any model ID (including partial or date-stamped variants).

**How it works:**

Uses a priority-ordered substring matching cascade:

```javascript
// ============================================
// Of - normalizeModelId - Extracts canonical family from model ID
// Location: chunks.176.mjs:1301-1319
// ============================================

// ORIGINAL (for source lookup):
function Of(A) {
    if (A = A.toLowerCase(), A.includes("claude-opus-4-6")) return "claude-opus-4-6";
    if (A.includes("claude-opus-4-5")) return "claude-opus-4-5";
    if (A.includes("claude-opus-4-1")) return "claude-opus-4-1";
    if (A.includes("claude-opus-4")) return "claude-opus-4";
    if (A.includes("claude-sonnet-4-6")) return "claude-sonnet-4-6";
    if (A.includes("claude-sonnet-4-5")) return "claude-sonnet-4-5";
    if (A.includes("claude-sonnet-4")) return "claude-sonnet-4";
    if (A.includes("claude-haiku-4-5")) return "claude-haiku-4-5";
    if (A.includes("claude-3-7-sonnet")) return "claude-3-7-sonnet";
    if (A.includes("claude-3-5-sonnet")) return "claude-3-5-sonnet";
    if (A.includes("claude-3-5-haiku")) return "claude-3-5-haiku";
    // ... additional patterns
    let q = A.match(/(claude-(\d+-\d+-)?\w+)/);
    if (q && q[1]) return q[1];
    return A
}

// READABLE (for understanding):
function normalizeModelId(modelId) {
    const normalized = modelId.toLowerCase();

    // Priority order: specific versions first, then family
    const MODEL_PATTERNS = [
        "claude-opus-4-6",
        "claude-opus-4-5",
        "claude-opus-4-1",
        "claude-opus-4",
        "claude-sonnet-4-6",
        "claude-sonnet-4-5",
        "claude-sonnet-4",
        "claude-haiku-4-5",
        "claude-3-7-sonnet",
        "claude-3-5-sonnet",
        "claude-3-5-haiku",
        // ...
    ];

    for (const pattern of MODEL_PATTERNS) {
        if (normalized.includes(pattern)) {
            return pattern;
        }
    }

    // Fallback: regex extraction
    const match = normalized.match(/(claude-(\d+-\d+-)?\w+)/);
    if (match?.[1]) return match[1];
    return normalized;
}

// Mapping: Of→normalizeModelId
```

**Why this approach:**
- **Priority order matters**: `claude-opus-4-6` must be checked before `claude-opus-4`
- **Handles date stamps**: `claude-opus-4-6-20250805` → `claude-opus-4-6`
- **Graceful fallback**: Regex catches unknown future models

---

## Stage 3: Default Model Selection

### GN, Ef, hT6 - Default Model Getters

**What they do:** Return the default model ID for each family, respecting environment variables and deployment type.

```javascript
// ============================================
// GN, Ef, hT6 - Default model getters for each family
// Location: chunks.176.mjs:1263-1278
// ============================================

// ORIGINAL (for source lookup):
function GN() {
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (QA() !== "firstParty") return _3().opus46;
    return _3().opus46
}
function Ef() {
    if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    if (QA() !== "firstParty") return _3().sonnet45;
    return _3().sonnet46
}
function hT6() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return _3().haiku45
}

// READABLE (for understanding):
function getDefaultOpusModel() {
    // Environment variable override
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
        return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    }
    // All deployments use opus-4-6 as default Opus
    return getModelRegistry().opus46;
}

function getDefaultSonnetModel() {
    if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) {
        return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    }
    // Non-first-party deployments default to sonnet-4-5
    if (getDeploymentType() !== "firstParty") {
        return getModelRegistry().sonnet45;
    }
    // First-party uses sonnet-4-6
    return getModelRegistry().sonnet46;
}

function getDefaultHaikuModel() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
        return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    }
    return getModelRegistry().haiku45;
}

// Mapping: GN→getDefaultOpusModel, Ef→getDefaultSonnetModel, hT6→getDefaultHaikuModel,
//          QA→getDeploymentType, _3→getModelRegistry
```

### Mv - getDefaultModelWithFlags

**What it does:** Returns the default model considering feature flags and special conditions.

```javascript
// ============================================
// Mv - getDefaultModelWithFlags - Default model with flag considerations
// Location: chunks.176.mjs:1291-1295
// ============================================

// ORIGINAL (for source lookup):
function Mv() {
    if (RL()) return GN() + (pH() ? "[1m]" : "");
    if (t66()) return GN() + (pH() ? "[1m]" : "");
    return Ef()
}

// READABLE (for understanding):
function getDefaultModelWithFlags() {
    // Proactive mode or certain conditions prefer Opus
    if (isProactiveMode()) {
        return getDefaultOpusModel() + (is1MContextEnabled() ? "[1m]" : "");
    }
    if (isSpecialCondition()) {
        return getDefaultOpusModel() + (is1MContextEnabled() ? "[1m]" : "");
    }
    // Default: Sonnet for everyday tasks
    return getDefaultSonnetModel();
}

// Mapping: Mv→getDefaultModelWithFlags, RL→isProactiveMode, t66→isSpecialCondition,
//          pH→is1MContextEnabled
```

---

## Stage 4: Configuration Hierarchy

### uR - getConfiguredModel

**What it does:** Retrieves the model from configuration (environment variable or settings), following a specific priority order.

```javascript
// ============================================
// uR - getConfiguredModel - Gets model from config/env
// Location: chunks.176.mjs:1242-1251
// ============================================

// ORIGINAL (for source lookup):
function uR() {
    let A, q = HS();
    if (q !== void 0) A = q;
    else {
        let K = PA() || {};
        A = process.env.ANTHROPIC_MODEL || K.model || void 0
    }
    if (A && !s66(A)) return;
    return A
}

// READABLE (for understanding):
function getConfiguredModel() {
    let modelId;

    // Priority 1: Per-session override (from command line --model)
    let sessionOverride = getSessionModelOverride();
    if (sessionOverride !== undefined) {
        modelId = sessionOverride;
    } else {
        // Priority 2: Environment variable
        // Priority 3: Settings file
        let settings = readSettings() || {};
        modelId = process.env.ANTHROPIC_MODEL || settings.model || undefined;
    }

    // Validate model exists in registry
    if (modelId && !isValidModelId(modelId)) {
        return;  // Invalid model returns undefined
    }
    return modelId;
}

// Mapping: uR→getConfiguredModel, HS→getSessionModelOverride, PA→readSettings,
//          s66→isValidModelId
```

### cK - getEffectiveModel

**What it does:** Returns the effective model ID to use, falling back to default if not configured.

```javascript
// ============================================
// cK - getEffectiveModel - Returns effective model with fallback
// Location: chunks.176.mjs:1253-1257
// ============================================

// ORIGINAL (for source lookup):
function cK() {
    let A = uR();
    if (A !== void 0 && A !== null) return H5(A);
    return g0()
}

// READABLE (for understanding):
function getEffectiveModel() {
    let configuredModel = getConfiguredModel();
    if (configuredModel !== undefined && configuredModel !== null) {
        return resolveModelAlias(configuredModel);
    }
    // Fallback to default
    return getDefaultModel();
}

// Mapping: cK→getEffectiveModel, uR→getConfiguredModel, H5→resolveModelAlias, g0→getDefaultModel
```

---

## Stage 5: Model Fallback

### R36 - ModelFallbackError

**What it does:** Custom error class that signals when Opus is overloaded and fallback to Sonnet is needed.

```javascript
// ============================================
// R36 - ModelFallbackError - Signals model overload requiring fallback
// Location: chunks.89.mjs:260-266
// ============================================

// ORIGINAL (for source lookup):
class R36 extends Error {
    originalModel;
    fallbackModel;
    constructor(A, q) {
        super(`Model fallback triggered: ${A} -> ${q}`);
        this.originalModel = A;
        this.fallbackModel = q;
    }
}

// READABLE (for understanding):
class ModelFallbackError extends Error {
    originalModel: string;
    fallbackModel: string;

    constructor(originalModel: string, fallbackModel: string) {
        super(`Model fallback triggered: ${originalModel} -> ${fallbackModel}`);
        this.originalModel = originalModel;
        this.fallbackModel = fallbackModel;
    }
}

// Mapping: R36→ModelFallbackError
```

### Fallback Handling in API Layer

```javascript
// ============================================
// Fallback handling in withApiRetry wrapper
// Location: chunks.89.mjs:50-56
// ============================================

// ORIGINAL (for source lookup):
if (iF6(j) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !iA() && V36(K.model))) {
    if (K.fallbackModel) throw d("tengu_api_opus_fallback_triggered", {
        original_model: K.model,
        fallback_model: K.fallbackModel,
        attempt: q
    }), new R36(K.model, K.fallbackModel);
}

// READABLE (for understanding):
if (isOverloaded(response)
    && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS
        || (!isInternalBuild() && isOpusModel(context.model)))) {

    if (context.fallbackModel) {
        logTelemetry("tengu_api_opus_fallback_triggered", {
            original_model: context.model,
            fallback_model: context.fallbackModel,
            attempt: attemptCount
        });
        throw new ModelFallbackError(context.model, context.fallbackModel);
    }
}

// Mapping: iF6→isOverloaded, iA→isInternalBuild, V36→isOpusModel, K→context, q→attemptCount
```

---

## Stage 6: Fast Mode Integration

### Fast Mode Eligibility

**What it does:** Fast mode provides accelerated response using the same Opus 4.6 model. It's only available under specific conditions.

```javascript
// ============================================
// Fast mode eligibility and state management
// Location: chunks.56.mjs:2654-2826
// ============================================

// ORIGINAL (for source lookup):
function Dq() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
}

function yj() {
    if (!Dq()) return !1;
    return ra() === null
}

function FH(A) {
    if (!Dq()) return !1;
    let q = A ?? Mv();
    return H5(q).toLowerCase().includes("opus-4-6")
}

function Jm() {
    return TO8().status === "cooldown"
}

function Mm(A, q) {
    let K = Dq() && yj() && !!q && FH(A);
    if (K && Jm()) return "cooldown";
    if (K) return "on";
    return "off"
}

// READABLE (for understanding):
function isFastModeAvailable(): boolean {
    return !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}

function isFastModeEligible(): boolean {
    if (!isFastModeAvailable()) return false;
    return getFastModeBlockReason() === null;
}

function isOpus46Model(model?: string): boolean {
    if (!isFastModeAvailable()) return false;
    const modelToCheck = model ?? getDefaultModelWithFlags();
    return resolveModelAlias(modelToCheck).toLowerCase().includes("opus-4-6");
}

function isInFastModeCooldown(): boolean {
    return getCooldownState().status === "cooldown";
}

function getFastModeState(model: string | null, fastModeSetting: boolean): FastModeState {
    // All conditions must be true
    const eligible = isFastModeAvailable()
        && isFastModeEligible()
        && !!fastModeSetting
        && isOpus46Model(model);

    if (eligible && isInFastModeCooldown()) {
        return "cooldown";
    }
    if (eligible) {
        return "on";
    }
    return "off";
}

// Mapping: Dq→isFastModeAvailable, yj→isFastModeEligible, ra→getFastModeBlockReason,
//          FH→isOpus46Model, Jm→isInFastModeCooldown, TO8→getCooldownState, Mm→getFastModeState
```

### Fast Mode Blocking Reasons

```javascript
// ============================================
// ra - getFastModeBlockReason - Returns reason fast mode is blocked
// Location: chunks.56.mjs:2678-2696
// ============================================

// ORIGINAL (for source lookup):
function ra() {
    if (!Dq()) return "Fast mode is not available";
    let A = w8("tengu_penguins_off", null);
    if (A !== null) return k(`Fast mode unavailable: ${A}`), A;
    if (!rY() && w8("tengu_marble_sandcastle", !1)) return "Fast mode requires the native binary · Install from: https://claude.com/product/claude-code";
    if (q7() && pk6()) {
        if (!L8("flagSettings")?.fastMode) return k("Fast mode unavailable: Fast mode is not available in the Agent SDK"), "Fast mode is not available in the Agent SDK"
    }
    if (QA() !== "firstParty") return k("Fast mode unavailable: Fast mode is not available on Bedrock, Vertex, or Foundry"), "Fast mode is not available on Bedrock, Vertex, or Foundry";
    if (Jv.status === "disabled") {
        // Handle billing/preference blocks
        // ...
    }
    return null
}

// READABLE (for understanding):
function getFastModeBlockReason(): string | null {
    if (!isFastModeAvailable()) {
        return "Fast mode is not available";
    }

    // Feature flag block
    let featureBlock = getFeatureFlag("tengu_penguins_off", null);
    if (featureBlock !== null) {
        log(`Fast mode unavailable: ${featureBlock}`);
        return featureBlock;
    }

    // Native binary requirement
    if (!isNativeBinary() && getFeatureFlag("tengu_marble_sandcastle", false)) {
        return "Fast mode requires the native binary · Install from: https://claude.com/product/claude-code";
    }

    // Agent SDK restriction
    if (isAgentSdk() && isInAgentSdkMode()) {
        if (!getFlagSettings()?.fastMode) {
            return "Fast mode is not available in the Agent SDK";
        }
    }

    // Deployment type restriction
    if (getDeploymentType() !== "firstParty") {
        return "Fast mode is not available on Bedrock, Vertex, or Foundry";
    }

    // Billing/preference status
    if (fastModeBillingStatus.status === "disabled") {
        // Handle various billing-related blocks
        // ...
    }

    return null;  // No block - fast mode available
}

// Mapping: ra→getFastModeBlockReason, w8→getFeatureFlag, rY→isNativeBinary,
//          q7→isAgentSdk, pk6→isInAgentSdkMode, QA→getDeploymentType
```

### Fast Mode Cooldown (VERIFIED)

> **Source:** `chunks.89.mjs:27-48` (trigger logic in _P1), `chunks.89.mjs:206-231` (constants)
> **Cross-validated:** `chunks.56.mjs:2736-2749` (kf7 state setter)

**What it does:** When fast mode encounters issues (rate limits, errors), it enters a cooldown period to prevent cascading failures. The cooldown logic lives inside the `_P1` (withApiRetry) loop.

### Constants (VERIFIED)

```javascript
// Location: chunks.89.mjs:215-231
Bb9 = 1800000   // DEFAULT_COOLDOWN_MS: 30 minutes (default when no retry-after header)
gb9 = 20000      // SHORT_WAIT_THRESHOLD_MS: 20 seconds (below this → just wait, no cooldown)
Fb9 = 600000     // MIN_COOLDOWN_MS: 10 minutes (minimum floor for any cooldown)
hb9 = 3          // MAX_CONSECUTIVE_529_ERRORS: triggers ModelFallbackError
```

### State Machine

```
┌────────────────────┐
│  Active             │  fastMode = true in retry state
│  (fast mode on)     │
└────────┬───────────┘
         │
         ├── 429/overloaded + retry-after < 20s (gb9)
         │   └── Short wait (uk(retryAfter, signal))
         │       └── Retry with fastMode STILL TRUE
         │
         ├── 429/overloaded + retry-after >= 20s (gb9)
         │   └── kf7: Set cooldown = now + max(retryAfter ?? 30min, 10min)
         │       └── fastMode = false in retry state
         │           └── Continue retrying without fast mode
         │
         ├── 429/overloaded + overage-disabled-reason header present
         │   └── Lf7: Log reason
         │       └── fastMode = false in retry state
         │           └── Continue retrying without fast mode
         │
         ├── HTTP 400 "Fast mode is not enabled"
         │   └── Ef7: Log
         │       └── fastMode = false in retry state
         │           └── Continue retrying without fast mode
         │
         └── 529 overloaded (consecutive >= 3)
             └── Throw ModelFallbackError (R36)
                 └── Agent loop uses fallbackModel (e.g., Opus → Sonnet)
```

### Trigger Logic Inside _P1 (withApiRetry) (VERIFIED)

```javascript
// ============================================
// Fast mode degradation inside _P1
// Location: chunks.89.mjs:27-48
// ============================================

// ORIGINAL:
} catch (j) {
    O = j;
    // Log the error
    k(`API error (attempt ${$}/${Y+1}): ${j instanceof a7?`${j.status} ${j.message}`:_1(j)}`, { level: "error" });

    // FAST MODE DEGRADATION (only when fast mode is active)
    if (H && j instanceof a7 && (j.status === 429 || iF6(j))) {
        // Check for overage-disabled-reason header
        let X = j.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
        if (X !== null && X !== void 0) {
            Lf7(X);           // Log overage reason
            z.fastMode = !1;   // Disable fast mode
            continue;          // Retry immediately
        }
        // Parse retry-after header
        let P = pb9(j);       // Parse retry-after → milliseconds (or null)
        if (P !== null && P < gb9) {   // gb9 = 20000 (20s)
            await uk(P, K.signal);      // Short wait
            continue;                    // Retry with fast mode still on
        }
        // Long cooldown: max(retryAfter ?? 30min, 10min)
        let W = Math.max(P ?? Bb9, Fb9);   // Bb9=1800000, Fb9=600000
        let Z = iF6(j) ? "overloaded" : "rate_limit";
        kf7(Date.now() + W, Z);            // Set cooldown until timestamp
        if (Dq()) z.fastMode = !1;          // Disable fast mode in retry state
        continue;                            // Retry without fast mode
    }
    // Check for "Fast mode is not enabled" error
    if (H && Cb9(j)) {
        Ef7();               // Log fast-mode-not-enabled
        z.fastMode = !1;     // Disable fast mode
        continue;            // Retry without fast mode
    }
    // ... rest of error handling
}

// READABLE:
} catch (error) {
    lastError = error;
    log(`API error (attempt ${attempt}/${maxRetries+1}): ${error instanceof APIError ? `${error.status} ${error.message}` : String(error)}`, { level: "error" });

    // FAST MODE DEGRADATION
    if (isFastModeActive && error instanceof APIError && (error.status === 429 || isOverloaded(error))) {
        // Trigger 1: Overage disabled — provider explicitly disabled fast mode
        let overageReason = error.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
        if (overageReason !== null && overageReason !== undefined) {
            logOverageDisabledReason(overageReason);   // Lf7
            retryState.fastMode = false;
            continue;
        }
        // Trigger 2: Short retry-after — just wait, keep fast mode
        let retryAfterMs = parseRetryAfterHeader(error);   // pb9
        if (retryAfterMs !== null && retryAfterMs < 20000) {   // gb9 = 20s threshold
            await sleep(retryAfterMs, signal);
            continue;   // Fast mode still on
        }
        // Trigger 3: Long cooldown — disable fast mode for duration
        let cooldownDuration = Math.max(retryAfterMs ?? 1800000, 600000);
        //                              Bb9=30min default   Fb9=10min floor
        let reason = isOverloaded(error) ? "overloaded" : "rate_limit";
        setFastModeCooldown(Date.now() + cooldownDuration, reason);   // kf7
        if (isFastModeAvailable()) retryState.fastMode = false;
        continue;   // Retry without fast mode
    }
    // Trigger 4: "Fast mode is not enabled" HTTP 400
    if (isFastModeActive && isFastModeNotEnabledError(error)) {   // Cb9
        logFastModeNotEnabled();   // Ef7
        retryState.fastMode = false;
        continue;
    }
    // ... rest of error handling
}

// Mapping: H→isFastModeActive, a7→APIError, iF6→isOverloaded, Lf7→logOverageDisabledReason,
//   pb9→parseRetryAfterHeader, gb9→SHORT_WAIT_THRESHOLD_MS(20000),
//   Bb9→DEFAULT_COOLDOWN_MS(1800000), Fb9→MIN_COOLDOWN_MS(600000),
//   kf7→setFastModeCooldown, Cb9→isFastModeNotEnabledError, Ef7→logFastModeNotEnabled
```

### Cooldown Formula

```
cooldownUntil = Date.now() + max(retryAfterMs ?? 1_800_000, 600_000)

Examples:
  retry-after: 5s   → below 20s threshold → just wait 5s, fast mode stays on
  retry-after: 30s  → max(30000, 600000) = 600000 → cooldown 10 minutes
  retry-after: null  → max(1800000, 600000) = 1800000 → cooldown 30 minutes
  retry-after: 900s → max(900000, 600000) = 900000 → cooldown 15 minutes
```

### kf7 (setFastModeCooldown) — State Setter

```javascript
// ============================================
// kf7 - setFastModeCooldown - Enters cooldown state
// Location: chunks.56.mjs:2736-2749
// ============================================

// ORIGINAL:
function kf7(A, q) {
    if (!Dq()) return;
    RD6 = {
        status: "cooldown",
        resetAt: A,
        reason: q
    }, ZO8 = !1;
    let K = A - Date.now();
    k(`Fast mode cooldown triggered (${q}), duration ${Math.round(K/1000)}s`), d("tengu_fast_mode_fallback_triggered", {
        cooldown_duration_ms: K,
        cooldown_reason: q
    });
    for (let Y of l21) Y.onCooldownTriggered(A, q)
}

// READABLE:
function setFastModeCooldown(resetAt, reason) {
    if (!isFastModeAvailable()) return;
    cooldownState = { status: "cooldown", resetAt, reason };
    isActiveState = false;
    let duration = resetAt - Date.now();
    log(`Fast mode cooldown triggered (${reason}), duration ${Math.round(duration/1000)}s`);
    emitTelemetry("tengu_fast_mode_fallback_triggered", {
        cooldown_duration_ms: duration,
        cooldown_reason: reason
    });
    for (let listener of cooldownListeners) listener.onCooldownTriggered(resetAt, reason);
}

// Mapping: kf7→setFastModeCooldown, RD6→cooldownState, ZO8→isActiveState,
//          l21→cooldownListeners, d→emitTelemetry
```

### Consecutive 529 → Model Fallback (VERIFIED)

If overloaded errors persist even after disabling fast mode:

```javascript
// Location: chunks.89.mjs:50-58

// ORIGINAL:
if (iF6(j) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !iA() && V36(K.model))) {
    if (w++, w >= hb9) {   // hb9 = 3 consecutive 529s
        if (K.fallbackModel) throw d("tengu_api_opus_fallback_triggered", {
            original_model: K.model, fallback_model: K.fallbackModel, provider: k76()
        }), new R36(K.model, K.fallbackModel);
        if (!process.env.IS_SANDBOX) throw d("tengu_api_custom_529_overloaded_error", {}),
            new RB(Error(Vv8), z)
    }
}

// READABLE:
if (isOverloaded(error) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !isAPIKeyAuth() && isEligibleForFallback(model))) {
    consecutive529Errors++;
    if (consecutive529Errors >= 3) {   // hb9 = 3
        if (fallbackModel)
            throw new ModelFallbackError(model, fallbackModel);  // R36
        if (!process.env.IS_SANDBOX)
            throw new RetryExhaustedError(Error("overloaded"), retryState);  // RB
    }
}
```

### Telemetry Events

| Event | Trigger | Fields |
|-------|---------|--------|
| `tengu_fast_mode_fallback_triggered` | kf7 called (cooldown set) | cooldown_duration_ms, cooldown_reason |
| `tengu_api_opus_fallback_triggered` | 3 consecutive 529s with fallbackModel | original_model, fallback_model, provider |
| `tengu_api_custom_529_overloaded_error` | 3 consecutive 529s without fallbackModel | (none) |

---

## Stage 7: API Request Assembly

### Model ID in API Call

**What it does:** The final model ID sent to the API must have the `[1m]` context marker stripped.

```javascript
// ============================================
// lg - stripContextMarker - Removes [1m] suffix for API
// Location: chunks.176.mjs:1469-1471
// ============================================

// ORIGINAL (for source lookup):
function lg(A) {
    return A.replace(/\[(1|2)m\]/gi, "")
}

// READABLE (for understanding):
function stripContextMarker(modelId: string): string {
    // Remove [1m] or [2m] suffix for API call
    // These are internal markers for context window size
    return modelId.replace(/\[(1|2)m\]/gi, "");
}

// Mapping: lg→stripContextMarker
```

### Full Request Assembly

In the streaming query core, the model ID flows through:

```javascript
// In $6 (buildApiRequest):
return {
    model: lg(_.model),  // Strip context marker
    messages: normalizedMessages,
    system: systemPrompt,
    tools: toolSchemas,
    max_tokens: maxTokens,
    thinking: thinkingConfig,
    ...betas && { betas },
    ...speed && { speed }  // Fast mode speed hint
};
```

---

## Architecture Trade-offs

### Alias Resolution Design

**Why aliases exist:**
- User convenience: "opus" is easier than "claude-opus-4-6-20250805"
- Version agility: Default alias can point to newer model without user changes
- Multi-deployment: Same alias works across Bedrock/Vertex/first-party

### Context Marker Approach

**Why `[1m]` suffix instead of separate field:**
- Simpler configuration: One string to set
- Backward compatible: Unknown suffixes are preserved
- User-visible: Shows in UI/status line

### Deployment-Specific Defaults

**Why different defaults per deployment:**
- Bedrock/Vertex: More conservative (sonnet-4-5 vs sonnet-4-6)
- Availability: Some models not yet on all platforms
- Stability: First-party gets newest models first

---

## Summary

The model selection system provides:

1. **Centralized registry** (`OJ6`) with deployment-specific model IDs
2. **Alias resolution** (`H5`) for user-friendly model selection
3. **Configuration hierarchy**: CLI → env → settings → default
4. **Graceful fallback** from Opus to Sonnet on overload
5. **Fast mode integration** with eligibility checks and cooldown
6. **Context markers** for extended context windows
7. **Multi-deployment support** with platform-specific model IDs

The key insight is that model selection is not a simple lookup but a multi-stage pipeline that considers:
- User intent (alias vs explicit ID)
- Platform capabilities (deployment type)
- Feature flags (fast mode eligibility)
- Error conditions (fallback logic)
- Context requirements (1M context window)

---

## Cross-Feature Linkages

### Integration with System Prompts (03_llm_core/system_prompt_building.md)

Model affects system prompt construction:
- Different models have different capabilities
- Thinking mode availability affects prompt structure
- Fast mode adds beta headers

### Integration with Streaming (03_llm_core/stream_processing.md)

Model selection affects streaming:
- Fast mode adds `speed: "fast"` parameter
- Different models have different token limits
- Betas vary by model

### Integration with Error Recovery (03_llm_core/error_recovery.md)

Model fallback integrates with retry logic:
- `ModelFallbackError` triggers switch to fallback model
- Telemetry tracks fallback events
- Cooldown prevents retry loops

### Integration with UI (03_llm_core/ui_linkage.md)

Model display:
- Status line shows resolved model name
- Fast mode indicator shows when active
- Model picker uses registry for options