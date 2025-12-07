# Claude Code v2.0.59 - Model Selection and Configuration

## Overview

This document provides a comprehensive analysis of how Claude Code v2.0.59 selects, configures, and manages different Claude models. The system supports multiple model tiers (Opus, Sonnet, Haiku) across different providers (Anthropic API, AWS Bedrock, Google Vertex AI, Azure Foundry) with sophisticated fallback mechanisms.

## Related Symbols

> Complete symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `getProvider` (V6) - Determines which API provider to use
- `getModelIds` (eI) - Gets provider-specific model ID mappings
- `getActiveModel` (Tt) - Main model getter with priority chain
- `normalizeModelName` (UD) - Resolves aliases to actual model IDs
- `selectModelForPermissionMode` (Pt) - Plan mode model selection
- `getSmallFastModel` (MW) - Returns Haiku for internal operations
- `resolveAgentModel` (inA) - Model resolution for sub-agents

## Table of Contents

1. [Model Taxonomy](#model-taxonomy)
2. [Model Selection Logic](#model-selection-logic)
3. [Provider-Specific Model Names](#provider-specific-model-names)
4. [Fallback Model Logic](#fallback-model-logic)
5. [Model Configuration Parameters](#model-configuration-parameters)
6. [Model-Specific Settings](#model-specific-settings)
7. [Flow Diagrams](#flow-diagrams)

---

## Model Taxonomy

### Available Model Tiers

Claude Code supports three primary model tiers, each with multiple versions:

#### 1. Haiku (Fast, Cost-Effective)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Haiku 3.5 | claude-3-5-haiku-20241022 | 2024-10-22 | Legacy Haiku |
| Haiku 4.5 | claude-haiku-4-5-20251001 | 2025-10-01 | Latest Haiku |

**Use Cases**: Quick answers, simple tasks, cost-sensitive operations

**Default Max Tokens**: 4,096 (3.x), 64,000 (4.x)

#### 2. Sonnet (Balanced, Everyday Use)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Sonnet 3.5 | claude-3-5-sonnet-20241022 | 2024-10-22 | Legacy Sonnet |
| Sonnet 3.7 | claude-3-7-sonnet-20250219 | 2025-02-19 | Experimental |
| Sonnet 4.0 | claude-sonnet-4-20250514 | 2025-05-14 | Sonnet 4 |
| Sonnet 4.5 | claude-sonnet-4-5-20250929 | 2025-09-29 | Latest Sonnet |

**Use Cases**: Everyday coding tasks, most recommended for general use

**Default Max Tokens**: 8,192 (3.5), 64,000 (4.x)

**Special Variant**: `sonnet[1m]` - Sonnet 4.5 with 1M context window for long sessions

#### 3. Opus (Powerful, Complex Tasks)

| Version | Model ID | Release Date | Description |
|---------|----------|--------------|-------------|
| Opus 4.0 | claude-opus-4-20250514 | 2025-05-14 | Opus 4 |
| Opus 4.1 | claude-opus-4-1-20250805 | 2025-08-05 | Opus 4.1 |
| Opus 4.5 | claude-opus-4-5-20251101 | 2025-11-01 | Latest Opus |

**Use Cases**: Complex work, challenging problems, high-quality outputs

**Default Max Tokens**: 4,096 (3.x Opus), 32,000 (4.0), 64,000 (4.5)

**Special Modes**:
- `opus` - Standard Opus usage
- `opusplan` - Uses Opus 4.5 in plan mode, Sonnet 4.5 otherwise

### Model Selector Aliases

Claude Code supports convenient model aliases:

```javascript
const MODEL_ALIASES = [
  "sonnet",        // → claude-sonnet-4-5-20250929
  "opus",          // → claude-opus-4-5-20251101 (first-party) or claude-opus-4-1-20250805 (others)
  "haiku",         // → claude-haiku-4-5-20251001 (first-party) or claude-3-5-haiku-20241022 (others)
  "sonnet[1m]",    // → claude-sonnet-4-5-20250929 with 1M context
  "opusplan",      // → Dynamic: Opus in plan mode, Sonnet otherwise
  "inherit"        // → Use parent agent's model
];
```

---

## Model Selection Logic

### Selection Priority Order

Claude Code determines the active model through a cascading priority system:

```
1. Session Override (yE0())
   ↓ (if not set)
2. Environment Variable (ANTHROPIC_MODEL)
   ↓ (if not set)
3. Configuration File (~/.claude/config.json → model)
   ↓ (if not set)
4. Default Model (based on plan and experiment flags)
   ↓
5. Final Fallback (Sonnet 4.5)
```

**Why this priority order:**
- Session override (`/model` command) allows runtime switching without restart
- Environment variable supports CI/CD and automation scenarios
- Config file provides persistent user preference
- Default model adapts to subscription plan and A/B experiments
- Fallback ensures system always has a valid model

### Code Implementation

```javascript
// ============================================
// getActiveModelSource - Get model from priority chain (without defaults)
// Location: chunks.59.mjs:2737-2745
// ============================================

// ORIGINAL (for source lookup):
function mnA() {
  let A, Q = yE0();
  if (Q !== void 0) A = Q;
  else {
    let B = l0() || {};
    A = process.env.ANTHROPIC_MODEL || B.model || void 0
  }
  if (BB() && !pw() && A && KT(A)) return;
  return A
}

// READABLE (for understanding):
function getActiveModelSource() {
  let model;
  let sessionOverride = getSessionOverrideModel();  // yE0()

  if (sessionOverride !== undefined) {
    model = sessionOverride;
  } else {
    let config = readConfigFile() || {};  // l0()
    model = process.env.ANTHROPIC_MODEL || config.model || undefined;
  }

  // Opus not available on Pro plan without paid extras
  if (isClaudePro() && !hasPaidExtras() && model && isOpusModel(model)) {
    return undefined;  // Reset to default
  }

  return model;
}

// Mapping: mnA→getActiveModelSource, yE0→getSessionOverrideModel, l0→readConfigFile,
//          BB→isClaudePro, pw→hasPaidExtras, KT→isOpusModel
```

**Key Design Decision - Opus Plan Restriction:**
When a Pro user (without paid extras) tries to use Opus, the function returns `undefined` instead of throwing an error. This triggers graceful fallback to the default model rather than failing the request.

```javascript
// ============================================
// getActiveModel - Main model getter with fallback to defaults
// Location: chunks.59.mjs:2748-2754
// ============================================

// ORIGINAL (for source lookup):
function Tt(A = {}) {
  let Q = mnA();
  if (Q !== null && Q !== void 0) return Q;
  let { forDisplay: B = !1 } = A;
  return CCB(B)
}

// READABLE (for understanding):
function getActiveModel(options = {}) {
  let model = getActiveModelSource();  // mnA()

  if (model !== null && model !== undefined) {
    return model;
  }

  // No explicit model set - check for experiment overrides
  let { forDisplay = false } = options;
  return getDefaultModelOverride(forDisplay);  // CCB()
}

// Mapping: Tt→getActiveModel, mnA→getActiveModelSource, CCB→getDefaultModelOverride
```

```javascript
// ============================================
// getDefaultModelOverride - Check for experiment-based model override
// Location: chunks.59.mjs:2812-2816
// ============================================

// ORIGINAL (for source lookup):
function CCB(A) {
  let Q = _Y6();
  if (Q !== null && Q.name) return A ? Q.displayName ?? Q.name : Q.name;
  if (Wh1()) return "sonnet[1m]";
  return
}

// READABLE (for understanding):
function getDefaultModelOverride(forDisplay) {
  let experimentOverride = getExperimentModelOverride();  // _Y6()

  if (experimentOverride !== null && experimentOverride.name) {
    return forDisplay
      ? (experimentOverride.displayName ?? experimentOverride.name)
      : experimentOverride.name;
  }

  // Check for 1M context experiment
  if (isSonnet1MExperimentEnabled()) {  // Wh1()
    return "sonnet[1m]";
  }

  return undefined;  // No override, use getFallbackModel
}

// Mapping: CCB→getDefaultModelOverride, _Y6→getExperimentModelOverride, Wh1→isSonnet1MExperimentEnabled
```

```javascript
// ============================================
// getFinalModel - Resolve to provider-specific model ID
// Location: chunks.59.mjs:2757-2760
// ============================================

// ORIGINAL (for source lookup):
function k3() {
  let A = Tt();
  if (A !== void 0 && A !== null) return UD(A);
  return jt()
}

// READABLE (for understanding):
function getFinalModel() {
  let model = getActiveModel();  // Tt()

  if (model !== undefined && model !== null) {
    return normalizeModelName(model);  // UD() - resolve "sonnet" → actual model ID
  }

  return getFallbackModelNormalized();  // jt()
}

// Mapping: k3→getFinalModel, Tt→getActiveModel, UD→normalizeModelName, jt→getFallbackModelNormalized
```

```javascript
// ============================================
// getFallbackModel - Ultimate fallback based on plan type
// Location: chunks.59.mjs:2819-2827
// ============================================

// ORIGINAL (for source lookup):
function cnA(A = {}) {
  let { forDisplay: Q = !1 } = A, B = CCB(Q);
  if (B !== void 0) return B;
  if (BB() && !pw() && dnA()) return X7A();
  if (UUA() || $UA()) return wUA();
  return XU()
}

// READABLE (for understanding):
function getFallbackModel(options = {}) {
  let { forDisplay = false } = options;

  // Check experiment override first
  let override = getDefaultModelOverride(forDisplay);  // CCB()
  if (override !== undefined) return override;

  // Pro plan without paid extras + Haiku experiment enabled
  if (isClaudePro() && !hasPaidExtras() && isHaikuDefaultForPro()) {
    return getDefaultHaikuModel();  // X7A() - cost-saving default
  }

  // Max or Team plan gets Opus by default
  if (isMaxPlan() || isTeamPlan()) {  // UUA() || $UA()
    return getDefaultOpusModel();  // wUA()
  }

  // Standard default: Sonnet
  return getDefaultSonnetModel();  // XU()
}

// Mapping: cnA→getFallbackModel, CCB→getDefaultModelOverride, BB→isClaudePro,
//          pw→hasPaidExtras, dnA→isHaikuDefaultForPro, X7A→getDefaultHaikuModel,
//          UUA→isMaxPlan, $UA→isTeamPlan, wUA→getDefaultOpusModel, XU→getDefaultSonnetModel
```

**Key Insight - Plan-Based Defaults:**
The fallback model logic adapts to subscription plans:
- **Pro plan**: Sonnet (or Haiku if experiment enabled) - balances capability and cost
- **Max/Team plans**: Opus - premium users get the most capable model
- **Default**: Sonnet 4.5 - best balance for most users

### Model Alias Resolution

```javascript
// ============================================
// normalizeModelName - Resolve alias to actual model ID
// Location: chunks.59.mjs:2998-3013
// ============================================

// ORIGINAL (for source lookup):
function UD(A) {
  let Q = A.toLowerCase().trim(),
    B = Q.endsWith("[1m]"),
    G = B ? Q.replace(/\[1m]$/i, "").trim() : Q;
  if (Vh1(G)) switch (G) {
    case "opusplan":
      return XU() + (B ? "[1m]" : "");
    case "sonnet":
      return XU() + (B ? "[1m]" : "");
    case "haiku":
      return X7A() + (B ? "[1m]" : "");
    case "opus":
      return wUA();
    default:
  }
  return Q
}

// READABLE (for understanding):
function normalizeModelName(model) {
  let modelLower = model.toLowerCase().trim();
  let has1MContext = modelLower.endsWith("[1m]");
  let baseModel = has1MContext
    ? modelLower.replace(/\[1m]$/i, "").trim()
    : modelLower;

  // Check if it's a known alias
  if (isKnownAlias(baseModel)) {  // Vh1()
    switch (baseModel) {
      case "opusplan":
        // opusplan resolves to Sonnet (Opus is selected at query time)
        return getDefaultSonnetModel() + (has1MContext ? "[1m]" : "");
      case "sonnet":
        return getDefaultSonnetModel() + (has1MContext ? "[1m]" : "");
      case "haiku":
        return getDefaultHaikuModel() + (has1MContext ? "[1m]" : "");
      case "opus":
        return getDefaultOpusModel();  // Opus doesn't support [1m]
      default:
        // Unknown alias - fall through
    }
  }

  // Direct model ID - return as-is
  return modelLower;
}

// Mapping: UD→normalizeModelName, Vh1→isKnownAlias, XU→getDefaultSonnetModel,
//          X7A→getDefaultHaikuModel, wUA→getDefaultOpusModel
```

**Why opusplan resolves to Sonnet here:**
The `opusplan` alias is special - it should use Opus during plan mode but Sonnet otherwise. However, `normalizeModelName` is called early in the pipeline before permission mode is known. The actual Opus selection happens later in `selectModelForPermissionMode` (Pt).

### Default Model Functions

```javascript
// ============================================
// getDefaultSonnetModel - Returns latest Sonnet model ID
// Location: chunks.59.mjs:2763-2765
// ============================================

// ORIGINAL (for source lookup):
function XU() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  return eI().sonnet45
}

// READABLE (for understanding):
function getDefaultSonnetModel() {
  // Allow environment override for testing/development
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  }
  return getModelIds().sonnet45;  // eI() → claude-sonnet-4-5-20250929
}

// Mapping: XU→getDefaultSonnetModel, eI→getModelIds
```

```javascript
// ============================================
// getDefaultOpusModel - Returns Opus model ID (provider-aware)
// Location: chunks.59.mjs:2776-2779
// ============================================

// ORIGINAL (for source lookup):
function wUA() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (V6() === "firstParty") return eI().opus45;
  return eI().opus41
}

// READABLE (for understanding):
function getDefaultOpusModel() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  }

  // First-party API gets latest Opus 4.5
  if (getProvider() === "firstParty") {  // V6()
    return getModelIds().opus45;  // claude-opus-4-5-20251101
  }

  // Bedrock/Vertex use Opus 4.1 (4.5 not yet available)
  return getModelIds().opus41;  // claude-opus-4-1-20250805
}

// Mapping: wUA→getDefaultOpusModel, V6→getProvider, eI→getModelIds
```

**Why Opus 4.1 for third-party providers:**
Opus 4.5 may not be immediately available on Bedrock/Vertex when released. The code defaults to 4.1 for these providers to ensure compatibility, while first-party API users get the latest version.

```javascript
// ============================================
// getDefaultHaikuModel - Returns Haiku model ID (provider-aware)
// Location: chunks.59.mjs:2782-2785
// ============================================

// ORIGINAL (for source lookup):
function X7A() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  if (V6() === "firstParty" || V6() === "foundry") return eI().haiku45;
  return eI().haiku35
}

// READABLE (for understanding):
function getDefaultHaikuModel() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  }

  // First-party and Foundry get Haiku 4.5
  if (getProvider() === "firstParty" || getProvider() === "foundry") {
    return getModelIds().haiku45;  // claude-haiku-4-5-20251001
  }

  // Bedrock/Vertex use Haiku 3.5 (4.5 not yet available)
  return getModelIds().haiku35;  // claude-3-5-haiku-20241022
}

// Mapping: X7A→getDefaultHaikuModel, V6→getProvider, eI→getModelIds
```

```javascript
// ============================================
// getSmallFastModel - Returns fastest/cheapest model for internal operations
// Location: chunks.59.mjs:2725-2726
// ============================================

// ORIGINAL (for source lookup):
function MW() {
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || X7A()
}

// READABLE (for understanding):
function getSmallFastModel() {
  // Allow override for testing with different models
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultHaikuModel();
}

// Mapping: MW→getSmallFastModel, X7A→getDefaultHaikuModel
```

**Why Haiku for internal operations:**
Claude Code uses Haiku for internal operations like:
- Web content summarization (WebFetch tool)
- Quick code analysis
- Agent subprocess operations

Haiku provides sufficient capability for these tasks at lower cost and latency.

---

## Provider-Specific Model Names

### Model Name Mappings

Different providers use different model naming conventions. Claude Code maintains a mapping table:

```javascript
// ============================================
// Model ID Constants - Provider-specific model identifiers
// Location: chunks.56.mjs:1448-1495
// ============================================

// ORIGINAL (for source lookup):
xzA = L(() => {
  lK();
  TzA = { firstParty: "claude-3-7-sonnet-20250219", bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0", vertex: "claude-3-7-sonnet@20250219", foundry: "claude-3-7-sonnet" },
  PzA = { firstParty: "claude-3-5-sonnet-20241022", bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0", vertex: "claude-3-5-sonnet-v2@20241022", foundry: "claude-3-5-sonnet" },
  jzA = { firstParty: "claude-3-5-haiku-20241022", bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0", vertex: "claude-3-5-haiku@20241022", foundry: "claude-3-5-haiku" },
  SzA = { firstParty: "claude-haiku-4-5-20251001", bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0", vertex: "claude-haiku-4-5@20251001", foundry: "claude-haiku-4-5" },
  At = { firstParty: "claude-sonnet-4-20250514", bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0", vertex: "claude-sonnet-4@20250514", foundry: "claude-sonnet-4" },
  fv1 = { firstParty: "claude-sonnet-4-5-20250929", bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0", vertex: "claude-sonnet-4-5@20250929", foundry: "claude-sonnet-4-5" },
  _zA = { firstParty: "claude-opus-4-20250514", bedrock: "us.anthropic.claude-opus-4-20250514-v1:0", vertex: "claude-opus-4@20250514", foundry: "claude-opus-4" },
  kzA = { firstParty: "claude-opus-4-1-20250805", bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0", vertex: "claude-opus-4-1@20250805", foundry: "claude-opus-4-1" },
  yzA = { firstParty: "claude-opus-4-5-20251101", bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0", vertex: "claude-opus-4-5@20251101", foundry: "claude-opus-4-5" }
})

// READABLE (for understanding):
const MODEL_IDS = {
  SONNET_37: { firstParty: "claude-3-7-sonnet-20250219", bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0", vertex: "claude-3-7-sonnet@20250219", foundry: "claude-3-7-sonnet" },  // TzA
  SONNET_35: { firstParty: "claude-3-5-sonnet-20241022", bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0", vertex: "claude-3-5-sonnet-v2@20241022", foundry: "claude-3-5-sonnet" },  // PzA
  HAIKU_35:  { firstParty: "claude-3-5-haiku-20241022", bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0", vertex: "claude-3-5-haiku@20241022", foundry: "claude-3-5-haiku" },      // jzA
  HAIKU_45:  { firstParty: "claude-haiku-4-5-20251001", bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0", vertex: "claude-haiku-4-5@20251001", foundry: "claude-haiku-4-5" },      // SzA
  SONNET_40: { firstParty: "claude-sonnet-4-20250514", bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0", vertex: "claude-sonnet-4@20250514", foundry: "claude-sonnet-4" },          // At
  SONNET_45: { firstParty: "claude-sonnet-4-5-20250929", bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0", vertex: "claude-sonnet-4-5@20250929", foundry: "claude-sonnet-4-5" },  // fv1
  OPUS_40:   { firstParty: "claude-opus-4-20250514", bedrock: "us.anthropic.claude-opus-4-20250514-v1:0", vertex: "claude-opus-4@20250514", foundry: "claude-opus-4" },                  // _zA
  OPUS_41:   { firstParty: "claude-opus-4-1-20250805", bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0", vertex: "claude-opus-4-1@20250805", foundry: "claude-opus-4-1" },          // kzA
  OPUS_45:   { firstParty: "claude-opus-4-5-20251101", bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0", vertex: "claude-opus-4-5@20251101", foundry: "claude-opus-4-5" }           // yzA
};

// Mapping: TzA→SONNET_37, PzA→SONNET_35, jzA→HAIKU_35, SzA→HAIKU_45,
//          At→SONNET_40, fv1→SONNET_45, _zA→OPUS_40, kzA→OPUS_41, yzA→OPUS_45
```

**Provider Naming Convention Differences:**
| Provider | Pattern | Example |
|----------|---------|---------|
| First-party | `claude-{model}-{version}-{date}` | `claude-sonnet-4-5-20250929` |
| Bedrock | `us.anthropic.{model}-v1:0` | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Vertex | `{model}@{date}` | `claude-sonnet-4-5@20250929` |
| Foundry | `{model}` (no date) | `claude-sonnet-4-5` |

### Model ID Resolution

```javascript
// ============================================
// getProvider - Determine API provider from environment
// Location: chunks.19.mjs:451-452
// ============================================

// ORIGINAL (for source lookup):
function V6() {
  return Y0(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" :
         Y0(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" :
         Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" :
         "firstParty"
}

// READABLE (for understanding):
function getProvider() {
  // Check environment variables in priority order
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) return "bedrock";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) return "vertex";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) return "foundry";
  return "firstParty";  // Default to Anthropic API
}

// Mapping: V6→getProvider, Y0→parseBoolean
```

```javascript
// ============================================
// getProviderModelIds - Get all model IDs for a specific provider
// Location: chunks.56.mjs:1533-1544
// ============================================

// ORIGINAL (for source lookup):
function NiA(A) {
  return {
    haiku35: jzA[A], haiku45: SzA[A],
    sonnet35: PzA[A], sonnet37: TzA[A], sonnet40: At[A], sonnet45: fv1[A],
    opus40: _zA[A], opus41: kzA[A], opus45: yzA[A]
  }
}

// READABLE (for understanding):
function getProviderModelIds(provider) {
  return {
    haiku35: HAIKU_35_IDS[provider],
    haiku45: HAIKU_45_IDS[provider],
    sonnet35: SONNET_35_IDS[provider],
    sonnet37: SONNET_37_IDS[provider],
    sonnet40: SONNET_40_IDS[provider],
    sonnet45: SONNET_45_IDS[provider],
    opus40: OPUS_40_IDS[provider],
    opus41: OPUS_41_IDS[provider],
    opus45: OPUS_45_IDS[provider]
  };
}

// Mapping: NiA→getProviderModelIds
```

```javascript
// ============================================
// getModelIds - Get model IDs for current provider (with caching)
// Location: chunks.56.mjs:1586-1589
// ============================================

// ORIGINAL (for source lookup):
function eI() {
  let A = $kA();
  if (A === null) return Pr8(), NiA(V6());
  return A
}

// READABLE (for understanding):
function getModelIds() {
  let cached = getCachedModelIds();  // $kA()

  if (cached === null) {
    // Initialize cache asynchronously, return default for now
    initializeModelIds();  // Pr8()
    return getProviderModelIds(getProvider());  // NiA(V6())
  }

  return cached;
}

// Mapping: eI→getModelIds, $kA→getCachedModelIds, Pr8→initializeModelIds,
//          NiA→getProviderModelIds, V6→getProvider
```

**Why caching matters:**
For Bedrock, model IDs may need to be fetched dynamically from AWS. The caching pattern ensures:
1. First call returns static defaults immediately (no blocking)
2. Background fetch updates the cache for subsequent calls
3. Fallback to static defaults if dynamic fetch fails

```javascript
// ============================================
// fetchBedrockModelIds - Dynamically fetch available Bedrock models
// Location: chunks.56.mjs:1547-1574
// ============================================

// ORIGINAL (for source lookup):
async function Rr8() {
  let A;
  try { A = await y4B() }
  catch (V) { return AA(V), NiA("bedrock") }
  if (!A?.length) return NiA("bedrock");
  let Q = w_(A, "claude-3-5-haiku-20241022"),
    B = w_(A, "claude-haiku-4-5-20251001"),
    // ... more model lookups
    X = w_(A, "claude-opus-4-5-20251101");
  return {
    haiku35: Q || jzA.bedrock,
    haiku45: B || SzA.bedrock,
    // ... etc
  }
}

// READABLE (for understanding):
async function fetchBedrockModelIds() {
  let availableModels;
  try {
    availableModels = await listBedrockModels();  // y4B()
  } catch (error) {
    logError(error);
    return getProviderModelIds("bedrock");  // Fallback to static
  }

  if (!availableModels?.length) {
    return getProviderModelIds("bedrock");
  }

  // Find actual ARN for each model, fallback to default if not found
  return {
    haiku35: findModel(availableModels, "claude-3-5-haiku-20241022") || HAIKU_35_IDS.bedrock,
    haiku45: findModel(availableModels, "claude-haiku-4-5-20251001") || HAIKU_45_IDS.bedrock,
    sonnet35: findModel(availableModels, "claude-3-5-sonnet-20241022") || SONNET_35_IDS.bedrock,
    sonnet37: findModel(availableModels, "claude-3-7-sonnet-20250219") || SONNET_37_IDS.bedrock,
    sonnet40: findModel(availableModels, "claude-sonnet-4-20250514") || SONNET_40_IDS.bedrock,
    sonnet45: findModel(availableModels, "claude-sonnet-4-5-20250929") || SONNET_45_IDS.bedrock,
    opus40: findModel(availableModels, "claude-opus-4-20250514") || OPUS_40_IDS.bedrock,
    opus41: findModel(availableModels, "claude-opus-4-1-20250805") || OPUS_41_IDS.bedrock,
    opus45: findModel(availableModels, "claude-opus-4-5-20251101") || OPUS_45_IDS.bedrock
  };
}

// Mapping: Rr8→fetchBedrockModelIds, y4B→listBedrockModels, w_→findModel
```

**Why dynamic Bedrock lookup:**
AWS Bedrock model ARNs can vary by region and account. Dynamic lookup ensures:
1. Correct ARN for the user's AWS region
2. Discovery of newly available model versions
3. Graceful fallback if lookup fails

---

## Fallback Model Logic

### Overload Fallback Mechanism

When Opus models are overloaded (HTTP 529 errors), Claude Code automatically falls back to a different model:

```javascript
// In retry logic (t61 function)
async function* withRetry(clientFactory, executeRequest, options) {
  let overloadCount = 0;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      // Execute request
      return await executeRequest(client, attempt, retryContext);
    } catch (error) {
      // Check for overload error (529)
      if (isOverloadError(error) &&
          (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS ||
           !isSandbox() && isOpusModel(options.model))) {

        overloadCount++;

        // Trigger fallback after 3 overload errors
        if (overloadCount >= 3) {
          if (options.fallbackModel) {
            logAnalytics("tengu_api_opus_fallback_triggered", {
              original_model: options.model,
              fallback_model: options.fallbackModel,
              provider: getProvider()
            });

            throw new FallbackTriggeredError(
              options.model,
              options.fallbackModel
            );
          }

          // No fallback configured - show error
          if (!isSandbox()) {
            logAnalytics("tengu_api_custom_529_overloaded_error", {});
            throw new RetryError(
              Error("Opus is experiencing high load, please use /model to switch to Sonnet"),
              retryContext
            );
          }
        }
      }

      // Continue retry logic...
    }
  }
}

// Check if error is overload
function isOverloadError(error) {
  if (!(error instanceof APIError)) {
    return false;
  }

  return error.status === 529 ||
         (error.message?.includes('"type":"overloaded_error"') ?? false);
}

// Check if model is Opus
function isOpusModel(model) {
  let ids = getModelIds();
  return model === ids.opus40 ||
         model === ids.opus41 ||
         model === ids.opus45;
}
```

### Fallback Model Configuration

Users can configure a fallback model via command-line or environment:

```bash
# Command-line option
claude --fallback-model sonnet

# Environment variable
export CLAUDE_CODE_FALLBACK_MODEL=claude-sonnet-4-5-20250929
```

### Fallback Error Messages

```javascript
// Error message for Claude Pro users (Opus not available)
if (isClaudePro() && error instanceof APIError &&
    error.status === 400 &&
    error.message.toLowerCase().includes("invalid model name") &&
    (isOpusModel(model) || model === "opus")) {

  return createSystemMessage({
    content: "Claude Opus is not available with the Claude Pro plan. " +
             "If you have updated your subscription plan recently, " +
             "run /logout and /login for the plan to take effect."
  });
}

// Error message for overload without fallback
if (isOverloadError(error) && !fallbackModel) {
  return createSystemMessage({
    content: "Opus is experiencing high load, please use /model to switch to Sonnet"
  });
}

// Suggestion to switch models on repeated refusals
if (isRefusalError(error)) {
  let suggestion = model !== "claude-sonnet-4-20250514" ?
    " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." :
    "";

  return createSystemMessage({
    content: errorMessage + suggestion
  });
}
```

---

## Model Configuration Parameters

### Max Output Tokens by Model

```javascript
function getDefaultMaxOutputTokens(model) {
  let modelLower = model.toLowerCase();
  let defaultMax;

  // Determine base max tokens
  if (modelLower.includes("3-5")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-opus")) {
    defaultMax = 4096;
  } else if (modelLower.includes("claude-3-sonnet")) {
    defaultMax = 8192;
  } else if (modelLower.includes("claude-3-haiku")) {
    defaultMax = 4096;
  } else if (modelLower.includes("opus-4-5")) {
    defaultMax = 64000;
  } else if (modelLower.includes("opus-4")) {
    defaultMax = 32000;
  } else if (modelLower.includes("sonnet-4") || modelLower.includes("haiku-4")) {
    defaultMax = 64000;
  } else {
    defaultMax = 32000;  // Generic fallback
  }

  // Check environment variable override
  let envValidator = IntegerValidator.validate(
    process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS
  );

  if (envValidator.status === "capped") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidator.message}`);
  } else if (envValidator.status === "invalid") {
    log(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${envValidator.message}`);
  }

  return Math.min(envValidator.effective, defaultMax);
}

// Environment variable validation
const IntegerValidator = {
  validate: (value) => {
    if (!value) {
      return { status: "valid", effective: Infinity };
    }

    let parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
      return {
        status: "invalid",
        message: "must be a valid integer",
        effective: Infinity
      };
    }

    if (parsed < 0) {
      return {
        status: "invalid",
        message: "must be non-negative",
        effective: Infinity
      };
    }

    return { status: "valid", effective: parsed };
  }
};
```

### Prompt Caching Configuration

```javascript
function isPromptCachingEnabled(model) {
  // Prompt caching is available on all Claude 3+ models
  // Enable by default unless explicitly disabled

  if (process.env.CLAUDE_CODE_DISABLE_PROMPT_CACHING === "true") {
    return false;
  }

  // Model-specific logic (all modern models support caching)
  return true;
}

// Apply cache breakpoints to system prompts
function applySystemCacheBreakpoints(systemPrompts, cachingEnabled) {
  return systemPrompts.map((prompt) => ({
    type: "text",
    text: prompt,
    ...(cachingEnabled ? { cache_control: { type: "ephemeral" } } : {})
  }));
}

// Apply cache breakpoints to messages (exclude last 3)
function applyMessageCacheBreakpoints(messages, cachingEnabled) {
  logAnalytics("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled: cachingEnabled
  });

  return messages.map((message, index) => {
    let shouldCache = index <= messages.length - 3 && cachingEnabled;

    if (message.role === "user") {
      return applyUserCacheControl(message, shouldCache, cachingEnabled);
    }

    return applyAssistantCacheControl(message, shouldCache, cachingEnabled);
  });
}
```

### SDK Beta Features

```javascript
function getSdkBetas(model, explicitBetas) {
  // Build list of beta features to enable
  let betas = [];

  // Prompt caching (all models)
  if (isPromptCachingEnabled(model)) {
    betas.push("prompt-caching-2024-07-31");
  }

  // PDF support (all models)
  betas.push("pdfs-2024-09-25");

  // Extended thinking (available on Opus and Sonnet 4+)
  if (supportsExtendedThinking(model)) {
    betas.push("extended-thinking-2025-01-24");
  }

  // Context management (available on models with large context)
  if (supportsContextManagement(model)) {
    betas.push("context-management-2025-01-24");
  }

  // Add explicit betas from caller
  if (explicitBetas) {
    betas.push(...explicitBetas);
  }

  return [...new Set(betas)];  // Remove duplicates
}

function supportsExtendedThinking(model) {
  // Extended thinking available on Claude 4+ models
  let modelLower = model.toLowerCase();
  return modelLower.includes("sonnet-4") ||
         modelLower.includes("opus-4") ||
         modelLower.includes("haiku-4");
}

function supportsContextManagement(model) {
  // Context management for large context windows
  let modelLower = model.toLowerCase();
  return modelLower.includes("-4-") ||
         modelLower.includes("-4.5-") ||
         model.includes("[1m]");
}
```

---

## Model-Specific Settings

### Temperature Configuration

```javascript
// Temperature is typically set to 1.0 for deterministic behavior
function getTemperature(options) {
  // Check explicit override
  if (options.temperatureOverride !== undefined) {
    return options.temperatureOverride;
  }

  // Default temperature
  return 1.0;
}
```

### Context Management

```javascript
function getContextManagementConfig(taskIntensity, model, betas) {
  // Only enable if beta is active
  if (!betas.includes("context-management-2025-01-24")) {
    return undefined;
  }

  // Get base configuration
  let baseConfig = getBaseContextConfig(model);

  // Apply task intensity override
  applyTaskIntensity(taskIntensity, baseConfig, betas);

  return baseConfig ? {
    type: "enabled",
    max_context_tokens: baseConfig.max_context_tokens
  } : undefined;
}

function getBaseContextConfig(model) {
  let modelLower = model.toLowerCase();

  // 1M context models
  if (model.includes("[1m]") || modelLower.includes("sonnet-4-5")) {
    return { max_context_tokens: 800000 };  // 800K tokens (~1M with buffer)
  }

  // Standard large context models
  if (modelLower.includes("-4-") || modelLower.includes("-4.5-")) {
    return { max_context_tokens: 180000 };  // 180K tokens (~200K with buffer)
  }

  return undefined;  // Disable for other models
}
```

### Extended Thinking Budget

```javascript
function getThinkingBudget(maxThinkingTokens, maxOutputTokens) {
  if (maxThinkingTokens <= 0) {
    return undefined;  // Thinking disabled
  }

  // Reserve 1 token for response
  let budgetTokens = Math.min(
    maxThinkingTokens,
    maxOutputTokens - 1
  );

  return {
    type: "enabled",
    budget_tokens: budgetTokens
  };
}

// Default thinking budgets by task type
const THINKING_BUDGETS = {
  simple_query: 0,           // No thinking
  code_review: 5000,         // 5K tokens
  complex_refactor: 10000,   // 10K tokens
  architecture: 15000,       // 15K tokens
  deep_analysis: 20000       // 20K tokens
};
```

### Plan Mode Model Selection

```javascript
function resolvePlanModeModel(options) {
  let { permissionMode, mainLoopModel, exceeds200kTokens = false } = options;

  // "opusplan" special handling
  if (getActiveModel() === "opusplan" &&
      permissionMode === "plan" &&
      !exceeds200kTokens) {
    return getDefaultOpusModel();  // Use Opus for plan mode
  }

  // "haiku" alias with plan mode
  if (getActiveModel() === "haiku" && permissionMode === "plan") {
    return getDefaultSonnetModel();  // Upgrade to Sonnet
  }

  // Default: use main loop model
  return mainLoopModel;
}
```

### Model Display Names

```javascript
const MODEL_DISPLAY_CONFIG = {
  sonnet: {
    value: "sonnet",
    label: "Sonnet",
    description: "Sonnet 4.5 · Best for everyday tasks · $3/MTok in, $15/MTok out",
    descriptionForModel: "Sonnet 4.5 - best for everyday tasks. Generally recommended for most coding tasks"
  },

  "sonnet[1m]": {
    value: "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: "Sonnet 4.5 for long sessions · $3/MTok in, $15/MTok out",
    descriptionForModel: "Sonnet 4.5 with 1M context window - for long sessions with large codebases"
  },

  opus: {
    value: "opus",
    label: (provider === "firstParty") ? "Opus" : "Opus 4.1",
    description: (provider === "firstParty")
      ? "Opus 4.5 · Most capable for complex work · $15/MTok in, $75/MTok out"
      : "Opus 4.1 · Legacy · $15/MTok in, $75/MTok out",
    descriptionForModel: (provider === "firstParty")
      ? "Opus 4.5 - most capable for complex work"
      : "Opus 4.1 - legacy version"
  },

  haiku: {
    value: "haiku",
    label: "Haiku",
    description: "Haiku 4.5 · Fastest for quick answers · $0.80/MTok in, $4/MTok out",
    descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.5."
  },

  opusplan: {
    value: "opusplan",
    label: "Opus Plan Mode",
    description: "Use Opus 4.5 in plan mode, Sonnet 4.5 otherwise"
  }
};
```

---

## Flow Diagrams

### Model Selection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Model Selection Entry                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Check Session Override   │
              │ (yE0() - runtime /model) │
              └──────────────────────────┘
                    ↓ Set?        ↓ Not Set
              ┌─────────┐          │
              │ USE IT  │          │
              └─────────┘          │
                    ↓              ↓
                    │     ┌─────────────────────────┐
                    │     │ Check ANTHROPIC_MODEL   │
                    │     │ environment variable    │
                    │     └─────────────────────────┘
                    │          ↓ Set?      ↓ Not Set
                    │     ┌─────────┐       │
                    │     │ USE IT  │       │
                    │     └─────────┘       │
                    │          ↓            ↓
                    │          │   ┌──────────────────────┐
                    │          │   │ Check config.json    │
                    │          │   │ ~/.claude/config.json│
                    │          │   └──────────────────────┘
                    │          │        ↓ Set?   ↓ Not Set
                    │          │   ┌─────────┐    │
                    │          │   │ USE IT  │    │
                    │          │   └─────────┘    │
                    │          │        ↓         ↓
                    └──────────┴────────┴─────────┘
                                  ↓
                    ┌──────────────────────────────┐
                    │ Is Claude Pro without extras?│
                    │ AND model is Opus?           │
                    └──────────────────────────────┘
                         ↓ Yes          ↓ No
                    ┌─────────┐         │
                    │ RESET   │         │
                    │ model   │         │
                    └─────────┘         │
                         ↓ ←────────────┘
                    ┌──────────────────────────────┐
                    │ Has valid model?             │
                    └──────────────────────────────┘
                         ↓ Yes          ↓ No
                    ┌─────────┐    ┌────────────────┐
                    │ RETURN  │    │ Get Default    │
                    │ model   │    │ Model          │
                    └─────────┘    └────────────────┘
                                        ↓
                              ┌──────────────────────┐
                              │ Check Experiment     │
                              │ Override             │
                              └──────────────────────┘
                                   ↓ Set?   ↓ Not Set
                              ┌─────────┐    │
                              │ USE IT  │    │
                              └─────────┘    │
                                   ↓         ↓
                                   │   ┌──────────────────┐
                                   │   │ Is Sonnet 1M     │
                                   │   │ experiment on?   │
                                   │   └──────────────────┘
                                   │      ↓ Yes    ↓ No
                                   │  ┌──────┐     │
                                   │  │sonnet│     │
                                   │  │[1m]  │     │
                                   │  └──────┘     │
                                   │      ↓        ↓
                                   └──────┴────────┘
                                          ↓
                              ┌──────────────────────┐
                              │ Get Fallback Model   │
                              └──────────────────────┘
                                          ↓
                              ┌──────────────────────┐
                              │ Is Pro + Haiku       │
                              │ default enabled?     │
                              └──────────────────────┘
                                   ↓ Yes      ↓ No
                              ┌──────────┐ ┌──────────┐
                              │  Haiku   │ │  Sonnet  │
                              │  4.5     │ │  4.5     │
                              └──────────┘ └──────────┘
                                   ↓            ↓
                                   └─────┬──────┘
                                         ↓
                              ┌──────────────────────┐
                              │ Resolve to Provider  │
                              │ Specific Model ID    │
                              └──────────────────────┘
                                         ↓
                              ┌──────────────────────┐
                              │ RETURN model ID      │
                              └──────────────────────┘
```

### Fallback Model Trigger Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  API Request Execution                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Execute API Request      │
              │ (attempt N)              │
              └──────────────────────────┘
                    ↓ Success    ↓ Error
              ┌─────────┐        │
              │ RETURN  │        │
              │ response│        │
              └─────────┘        │
                                 ↓
                    ┌──────────────────────────┐
                    │ Is Overload Error (529)? │
                    └──────────────────────────┘
                         ↓ No          ↓ Yes
                    ┌─────────┐        │
                    │ Handle  │        │
                    │ other   │        │
                    │ errors  │        │
                    └─────────┘        │
                                       ↓
                          ┌──────────────────────────────┐
                          │ Is Opus model OR             │
                          │ FALLBACK_FOR_ALL_PRIMARY     │
                          │ _MODELS env var set?         │
                          └──────────────────────────────┘
                               ↓ No          ↓ Yes
                          ┌─────────┐        │
                          │ Regular │        │
                          │ retry   │        │
                          └─────────┘        │
                                             ↓
                                ┌──────────────────────────┐
                                │ overloadCount++          │
                                └──────────────────────────┘
                                             ↓
                                ┌──────────────────────────┐
                                │ overloadCount >= 3?      │
                                └──────────────────────────┘
                                   ↓ No          ↓ Yes
                              ┌─────────┐        │
                              │ Regular │        │
                              │ retry   │        │
                              └─────────┘        │
                                                 ↓
                                    ┌──────────────────────────┐
                                    │ Has fallbackModel?       │
                                    └──────────────────────────┘
                                       ↓ Yes          ↓ No
                          ┌────────────────────────┐  │
                          │ Log analytics:         │  │
                          │ tengu_api_opus_        │  │
                          │   fallback_triggered   │  │
                          └────────────────────────┘  │
                                       ↓              ↓
                          ┌────────────────────────┐  │
                          │ Throw                  │  │
                          │ FallbackTriggeredError │  │
                          │ (original → fallback)  │  │
                          └────────────────────────┘  │
                                       ↓              │
                          ┌────────────────────────┐  │
                          │ Catch in caller,       │  │
                          │ retry with fallback    │  │
                          │ model                  │  │
                          └────────────────────────┘  │
                                                      ↓
                                         ┌──────────────────────┐
                                         │ Is Sandbox?          │
                                         └──────────────────────┘
                                            ↓ Yes      ↓ No
                                       ┌─────────┐     │
                                       │ Throw   │     │
                                       │ generic │     │
                                       │ error   │     │
                                       └─────────┘     │
                                                       ↓
                                          ┌──────────────────────┐
                                          │ Log analytics:       │
                                          │ tengu_api_custom_    │
                                          │   529_overloaded_    │
                                          │   error              │
                                          └──────────────────────┘
                                                       ↓
                                          ┌──────────────────────┐
                                          │ Throw RetryError     │
                                          │ with message:        │
                                          │ "Opus experiencing   │
                                          │  high load, use      │
                                          │  /model to switch"   │
                                          └──────────────────────┘
```

### Provider-Specific Model Resolution

```
┌─────────────────────────────────────────────────────────────┐
│               Get Provider-Specific Model ID                │
│               Input: alias (e.g., "opus")                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Resolve alias to         │
              │ model family             │
              │ (opus → opus45)          │
              └──────────────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Determine active provider│
              └──────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│  First Party  │  │    Bedrock     │  │  Vertex AI    │
│  (claude.ai)  │  │    (AWS)       │  │  (Google)     │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│ Get cached or │  │ Fetch available│  │ Use standard  │
│ default IDs   │  │ models from    │  │ mapping       │
│               │  │ Bedrock API    │  │               │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
┌───────────────┐  ┌────────────────┐  ┌───────────────┐
│ MODEL_IDS     │  │ Match model    │  │ MODEL_IDS     │
│ [opus45]      │  │ names to ARNs  │  │ [opus45]      │
│ [firstParty]  │  │ or use default │  │ [vertex]      │
└───────────────┘  └────────────────┘  └───────────────┘
        ↓                   ↓                   ↓
        └───────────────────┴───────────────────┘
                            ↓
              ┌──────────────────────────┐
              │ Return provider-specific │
              │ model ID                 │
              └──────────────────────────┘
                            ↓
Examples:
• First Party: "claude-opus-4-5-20251101"
• Bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0"
• Vertex: "claude-opus-4-5@20251101"
• Foundry: "claude-opus-4-5"
```

---

## Summary

The Claude Code v2.0.59 model selection system provides:

1. **Flexible Model Selection**:
   - Session overrides (`/model` command)
   - Environment variables
   - Configuration files
   - Intelligent defaults

2. **Multi-Provider Support**:
   - Anthropic API (first-party)
   - AWS Bedrock
   - Google Vertex AI
   - Azure Foundry
   - Automatic model ID translation

3. **Robust Fallback Mechanisms**:
   - Overload detection (529 errors)
   - Automatic fallback after 3 attempts
   - Configurable fallback models
   - Plan-aware model selection

4. **Smart Configuration**:
   - Model-specific token limits
   - Prompt caching (all models)
   - Extended thinking (Claude 4+)
   - Context management (large context models)
   - Beta feature activation

5. **User-Friendly Aliases**:
   - Simple aliases (sonnet, opus, haiku)
   - Special modes (sonnet[1m], opusplan)
   - Environment overrides
   - Display-friendly names

This architecture ensures users always get the right model for their task, with graceful degradation and clear error messages when models are unavailable.
