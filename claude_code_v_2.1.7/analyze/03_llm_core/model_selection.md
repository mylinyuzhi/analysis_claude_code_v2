# Model Selection Analysis - Claude Code v2.1.7

## Overview

The Model Selection module manages:
- Model tier definitions with provider-specific naming
- Model selection priority chain (user override → config → subscription defaults)
- Provider detection (Anthropic, Bedrock, Vertex, Foundry)
- Model alias resolution (sonnet, opus, haiku, opusplan, inherit)
- Dynamic Bedrock model discovery

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getActiveProvider` (R4) - Provider detection
- `getDefaultModel` (B5) - Main model getter
- `getModelConfig` (AI) - Get model tier configuration
- `loadBedrockModels` (Cw3) - Bedrock model discovery
- `normalizeModelName` (Uz) - Extract semantic model name
- `getDefaultOpusModel` (sJA) - Get Opus model by provider
- `getDefaultSonnetModel` (OR) - Get Sonnet model
- `getDefaultHaikuModel` (fp1) - Get Haiku model

---

## 1. Model Taxonomy

### 9 Model Tiers

Claude Code v2.1.7 supports 9 model tiers with 4 provider variants each:

| Tier | Obfuscated | First-Party | Release Date |
|------|------------|-------------|--------------|
| Haiku 3.5 | `$NA` | `claude-3-5-haiku-20241022` | Oct 2024 |
| Haiku 4.5 | `CNA` | `claude-haiku-4-5-20251001` | Oct 2025 |
| Sonnet 3.5 | `zNA` | `claude-3-5-sonnet-20241022` | Oct 2024 |
| Sonnet 3.7 | `ENA` | `claude-3-7-sonnet-20250219` | Feb 2025 |
| Sonnet 4.0 | `Z0A` | `claude-sonnet-4-20250514` | May 2025 |
| Sonnet 4.5 | `fP1` | `claude-sonnet-4-5-20250929` | Sep 2025 |
| Opus 4.0 | `UNA` | `claude-opus-4-20250514` | May 2025 |
| Opus 4.1 | `qNA` | `claude-opus-4-1-20250805` | Aug 2025 |
| Opus 4.5 | `NNA` | `claude-opus-4-5-20251101` | Nov 2025 |

### Model Tier Definitions - chunks.28.mjs:1912-1960

```javascript
// ============================================
// Model Tier Definitions - Provider-specific model IDs
// Location: chunks.28.mjs:1912-1960
// ============================================

// ORIGINAL (for source lookup):
ENA = {
  firstParty: "claude-3-7-sonnet-20250219",
  bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  vertex: "claude-3-7-sonnet@20250219",
  foundry: "claude-3-7-sonnet"
};

zNA = {
  firstParty: "claude-3-5-sonnet-20241022",
  bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  vertex: "claude-3-5-sonnet-v2@20241022",
  foundry: "claude-3-5-sonnet"
};

$NA = {
  firstParty: "claude-3-5-haiku-20241022",
  bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
  vertex: "claude-3-5-haiku@20241022",
  foundry: "claude-3-5-haiku"
};

CNA = {
  firstParty: "claude-haiku-4-5-20251001",
  bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
  vertex: "claude-haiku-4-5@20251001",
  foundry: "claude-haiku-4-5"
};

Z0A = {
  firstParty: "claude-sonnet-4-20250514",
  bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
  vertex: "claude-sonnet-4@20250514",
  foundry: "claude-sonnet-4"
};

fP1 = {
  firstParty: "claude-sonnet-4-5-20250929",
  bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
  vertex: "claude-sonnet-4-5@20250929",
  foundry: "claude-sonnet-4-5"
};

UNA = {
  firstParty: "claude-opus-4-20250514",
  bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
  vertex: "claude-opus-4@20250514",
  foundry: "claude-opus-4"
};

qNA = {
  firstParty: "claude-opus-4-1-20250805",
  bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
  vertex: "claude-opus-4-1@20250805",
  foundry: "claude-opus-4-1"
};

NNA = {
  firstParty: "claude-opus-4-5-20251101",
  bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
  vertex: "claude-opus-4-5@20251101",
  foundry: "claude-opus-4-5"
};

// Mapping: ENA→sonnet37, zNA→sonnet35, $NA→haiku35, CNA→haiku45,
//          Z0A→sonnet40, fP1→sonnet45, UNA→opus40, qNA→opus41, NNA→opus45
```

### Provider-Specific Naming Patterns

| Provider | Pattern | Example |
|----------|---------|---------|
| First-party | `claude-{model}-{date}` | `claude-sonnet-4-5-20250929` |
| Bedrock | `us.anthropic.{model}-v1:0` | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Vertex | `{model}@{date}` | `claude-sonnet-4-5@20250929` |
| Foundry | `{model}` (no date) | `claude-sonnet-4-5` |

---

## 2. Provider Detection

### getActiveProvider (R4) - chunks.27.mjs:2062-2063

```javascript
// ============================================
// getActiveProvider - Determines active API provider
// Location: chunks.27.mjs:2062-2063
// ============================================

// ORIGINAL (for source lookup):
function R4() {
  return a1(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" :
         a1(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" :
         a1(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" :
         "firstParty"
}

// READABLE (for understanding):
function getActiveProvider() {
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) return "bedrock";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) return "vertex";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) return "foundry";
  return "firstParty";
}

// Mapping: R4→getActiveProvider, a1→parseBoolean
```

**Provider Priority:**
1. Bedrock (AWS) - `CLAUDE_CODE_USE_BEDROCK=true`
2. Vertex (Google) - `CLAUDE_CODE_USE_VERTEX=true`
3. Foundry (Azure) - `CLAUDE_CODE_USE_FOUNDRY=true`
4. First-party (Default) - Direct Anthropic API

---

## 3. Model Selection Priority Chain

### getDefaultModel (B5) - chunks.46.mjs:2225-2228

```javascript
// ============================================
// getDefaultModel - Main model getter with priority chain
// Location: chunks.46.mjs:2225-2228
// ============================================

// ORIGINAL (for source lookup):
function B5() {
  let A = FQA();
  if (A !== void 0 && A !== null) return FX(A);
  return wu()
}

// READABLE (for understanding):
function getDefaultModel() {
  // 1. Try user's active model selection
  const userModel = getActiveModelSelection();

  if (userModel !== undefined && userModel !== null) {
    // 2. Convert alias to full model ID
    return convertModelAliasToFullName(userModel);
  }

  // 3. Fall back to subscription-based default
  return getModelBySubscription();
}

// Mapping: B5→getDefaultModel, FQA→getActiveModelSelection, FX→convertModelAliasToFullName, wu→getModelBySubscription
```

### getActiveModelSelection (FQA) - chunks.46.mjs:2216-2223

```javascript
// ============================================
// getActiveModelSelection - Get user's model preference
// Location: chunks.46.mjs:2216-2223
// ============================================

// ORIGINAL (for source lookup):
function FQA(A = {}) {
  let Q = ZA1();
  if (Q !== null && Q !== void 0) return Q;
  let { forDisplay: B = !1 } = A;
  return GeQ(B)
}

function ZA1() {
  let A, Q = yb0();  // Session model override (/model command)
  if (Q !== void 0) A = Q;
  else {
    let B = jQ() || {};  // Config
    A = process.env.ANTHROPIC_MODEL || B.model || void 0
  }
  // Block Opus in browser without paid access
  if (qB() && !MR() && A && GA1(A)) return;
  return A
}

// READABLE (for understanding):
function getActiveModelSelection(options = {}) {
  // Check direct model selection sources
  const directModel = getDirectModelSelection();
  if (directModel !== null && directModel !== undefined) return directModel;

  // Check for experiment/default overrides
  const { forDisplay = false } = options;
  return getDefaultModelOverride(forDisplay);
}

function getDirectModelSelection() {
  let model;

  // 1. Session override (from /model command)
  const sessionModel = getSessionModelOverride();
  if (sessionModel !== undefined) {
    model = sessionModel;
  } else {
    // 2. Environment variable or config file
    const config = getSettings() || {};
    model = process.env.ANTHROPIC_MODEL || config.model || undefined;
  }

  // Block Opus in browser mode without paid access
  if (isBrowserMode() && !hasPaidAccess() && model && isOpusModel(model)) {
    return undefined;
  }

  return model;
}

// Mapping: FQA→getActiveModelSelection, ZA1→getDirectModelSelection, yb0→getSessionModelOverride,
//          jQ→getSettings, qB→isBrowserMode, MR→hasPaidAccess, GA1→isOpusModel
```

### Model Selection Priority Chain

```
┌─────────────────────────────────────────────────────────────────┐
│                   Model Selection Priority                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. Session Override (yb0)     ← /model command in session       │
│         ↓                                                        │
│ 2. Environment Variable       ← ANTHROPIC_MODEL env var          │
│         ↓                                                        │
│ 3. Config File                ← ~/.claude/settings.json          │
│         ↓                                                        │
│ 4. Default Model Override     ← Experiment flags (GeQ)           │
│         ↓                                                        │
│ 5. Sonnet 1M Experiment       ← isSonnet1MExperimentEnabled()    │
│         ↓                                                        │
│ 6. Subscription Fallback      ← Based on plan (max/team/pro)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Subscription-Based Defaults

### getModelBySubscription (EQA/wu) - chunks.46.mjs:2286-2297

```javascript
// ============================================
// getModelBySubscription - Get model based on subscription tier
// Location: chunks.46.mjs:2286-2297
// ============================================

// ORIGINAL (for source lookup):
function EQA(A = {}) {
  let { forDisplay: Q = !1 } = A, B = GeQ(Q);
  if (B !== void 0) return B;
  if (OOA() || MOA() || rJA()) return sJA();  // Max/Team/Pro → Opus
  return OR()  // Default → Sonnet
}

function wu(A = {}) {
  return FX(EQA(A))
}

// READABLE (for understanding):
function getModelBySubscription(options = {}) {
  const { forDisplay = false } = options;

  // Check for experiment/default override
  const override = getDefaultModelOverride(forDisplay);
  if (override !== undefined) return override;

  // Subscription-based selection
  if (isMaxPlan() || isTeamPlan() || isProPlan()) {
    return getDefaultOpusModel();  // Opus for premium plans
  }

  return getDefaultSonnetModel();  // Sonnet for free/default
}

function getDefaultModelWithConversion(options = {}) {
  return convertModelAliasToFullName(getModelBySubscription(options));
}

// Mapping: EQA→getModelBySubscription, wu→getDefaultModelWithConversion,
//          OOA→isMaxPlan, MOA→isTeamPlan, rJA→isProPlan
```

### Subscription Tier Functions - chunks.46.mjs:2236-2246

```javascript
// ============================================
// Subscription tier checks
// Location: chunks.46.mjs:2236-2246
// ============================================

// ORIGINAL:
function OOA() { return N6() === "max" }   // isMaxPlan
function MOA() { return N6() === "team" }  // isTeamPlan
function rJA() { return N6() === "pro" }   // isProPlan

// N6() returns: "max" | "team" | "pro" | "free" | undefined
```

**Subscription-Based Model Defaults:**

| Plan | Default Model | Rationale |
|------|--------------|-----------|
| Max | Opus 4.5 | Full access to most capable model |
| Team | Opus 4.5 | Enterprise features |
| Pro | Opus 4.5 | Premium access |
| Free/Default | Sonnet 4.5 | Balance of capability and cost |

---

## 5. Provider-Specific Default Models

### getDefaultOpusModel (sJA) - chunks.46.mjs:2248-2252

```javascript
// ============================================
// getDefaultOpusModel - Get Opus model by provider
// Location: chunks.46.mjs:2248-2252
// ============================================

// ORIGINAL (for source lookup):
function sJA() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (R4() === "firstParty") return AI().opus45;
  return AI().opus41
}

// READABLE (for understanding):
function getDefaultOpusModel() {
  // Environment override
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  }

  // First-party API gets latest Opus 4.5
  if (getActiveProvider() === "firstParty") {
    return getModelConfig().opus45;
  }

  // Other providers (Bedrock, Vertex, Foundry) get Opus 4.1
  // (wider availability, more stable)
  return getModelConfig().opus41;
}

// Mapping: sJA→getDefaultOpusModel, R4→getActiveProvider, AI→getModelConfig
```

**Why Opus 4.1 for non-first-party providers?**
- Opus 4.5 may not be available on all regions/accounts
- Opus 4.1 provides broader compatibility
- Can be overridden via `ANTHROPIC_DEFAULT_OPUS_MODEL`

### getDefaultSonnetModel (OR) - chunks.46.mjs:2231-2234

```javascript
// ============================================
// getDefaultSonnetModel - Get Sonnet model
// Location: chunks.46.mjs:2231-2234
// ============================================

// ORIGINAL (for source lookup):
function OR() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  return AI().sonnet45
}

// READABLE (for understanding):
function getDefaultSonnetModel() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  }
  return getModelConfig().sonnet45; // Default: Sonnet 4.5
}

// Mapping: OR→getDefaultSonnetModel, AI→getModelConfig
```

### getDefaultHaikuModel (fp1) - chunks.46.mjs:2254-2257

```javascript
// ============================================
// getDefaultHaikuModel - Get Haiku model
// Location: chunks.46.mjs:2254-2257
// ============================================

// ORIGINAL (for source lookup):
function fp1() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  return AI().haiku45
}

// READABLE (for understanding):
function getDefaultHaikuModel() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  }
  return getModelConfig().haiku45; // Default: Haiku 4.5
}

// Mapping: fp1→getDefaultHaikuModel
```

---

## 6. Model Configuration Loader

### getModelConfig (AI) - chunks.46.mjs:1575-1579

```javascript
// ============================================
// getModelConfig - Get model tier configuration
// Location: chunks.46.mjs:1575-1579
// ============================================

// ORIGINAL (for source lookup):
function AI() {
  let A = MdA();  // Get cached config
  if (A === null) return qw3(), neA(R4());  // Initialize and return defaults
  return A
}

// READABLE (for understanding):
function getModelConfig() {
  const cachedConfig = getCachedModelConfig();

  if (cachedConfig === null) {
    // Initialize async loading (for Bedrock)
    initializeModelConfigLoading();
    // Return defaults based on current provider
    return getDefaultModelConfig(getActiveProvider());
  }

  return cachedConfig;
}

// Mapping: AI→getModelConfig, MdA→getCachedModelConfig, qw3→initializeModelConfigLoading, neA→getDefaultModelConfig
```

### getDefaultModelConfig (neA) - chunks.46.mjs:1522-1534

```javascript
// ============================================
// getDefaultModelConfig - Default model IDs by provider
// Location: chunks.46.mjs:1522-1534
// ============================================

// ORIGINAL (for source lookup):
function neA(A) {
  return {
    haiku35: $NA[A],
    haiku45: CNA[A],
    sonnet35: zNA[A],
    sonnet37: ENA[A],
    sonnet40: Z0A[A],
    sonnet45: fP1[A],
    opus40: UNA[A],
    opus41: qNA[A],
    opus45: NNA[A]
  }
}

// READABLE (for understanding):
function getDefaultModelConfig(provider) {
  return {
    haiku35: MODEL_TIERS.haiku35[provider],
    haiku45: MODEL_TIERS.haiku45[provider],
    sonnet35: MODEL_TIERS.sonnet35[provider],
    sonnet37: MODEL_TIERS.sonnet37[provider],
    sonnet40: MODEL_TIERS.sonnet40[provider],
    sonnet45: MODEL_TIERS.sonnet45[provider],
    opus40: MODEL_TIERS.opus40[provider],
    opus41: MODEL_TIERS.opus41[provider],
    opus45: MODEL_TIERS.opus45[provider]
  };
}

// Mapping: neA→getDefaultModelConfig, provider = "firstParty" | "bedrock" | "vertex" | "foundry"
```

---

## 7. Bedrock Model Discovery

### loadBedrockModels (Cw3) - chunks.46.mjs:1536-1564

For Bedrock, models are discovered dynamically from AWS:

```javascript
// ============================================
// loadBedrockModels - Discover available Bedrock models
// Location: chunks.46.mjs:1536-1564
// ============================================

// ORIGINAL (for source lookup):
async function Cw3() {
  let A;
  try {
    A = await ctQ()  // Fetch inference profiles from AWS
  } catch (W) {
    return e(W), neA("bedrock")  // Fall back to defaults
  }
  if (!A?.length) return neA("bedrock");

  // Search for each model in available profiles
  let Q = tv(A, "claude-3-5-haiku-20241022"),
    B = tv(A, "claude-haiku-4-5-20251001"),
    G = tv(A, "claude-3-5-sonnet-20241022"),
    Z = tv(A, "claude-3-7-sonnet-20250219"),
    Y = tv(A, "claude-sonnet-4-20250514"),
    J = tv(A, "claude-sonnet-4-5-20250929"),
    X = tv(A, "claude-opus-4-20250514"),
    I = tv(A, "claude-opus-4-1-20250805"),
    D = tv(A, "claude-opus-4-5-20251101");

  return {
    haiku35: Q || $NA.bedrock,
    haiku45: B || CNA.bedrock,
    sonnet35: G || zNA.bedrock,
    sonnet37: Z || ENA.bedrock,
    sonnet40: Y || Z0A.bedrock,
    sonnet45: J || fP1.bedrock,
    opus40: X || UNA.bedrock,
    opus41: I || qNA.bedrock,
    opus45: D || NNA.bedrock
  }
}

// READABLE (for understanding):
async function loadBedrockModels() {
  let availableModels;

  try {
    // Fetch available inference profiles from AWS Bedrock
    availableModels = await fetchBedrockInferenceProfiles();
  } catch (error) {
    logError(error);
    // Return default Bedrock model IDs
    return getDefaultModelConfig("bedrock");
  }

  if (!availableModels?.length) {
    return getDefaultModelConfig("bedrock");
  }

  // Search for each model in the available profiles
  // Use found model ID or fall back to default
  const findModel = (searchString) => findInList(availableModels, searchString);

  return {
    haiku35: findModel("claude-3-5-haiku-20241022") || MODEL_TIERS.haiku35.bedrock,
    haiku45: findModel("claude-haiku-4-5-20251001") || MODEL_TIERS.haiku45.bedrock,
    sonnet35: findModel("claude-3-5-sonnet-20241022") || MODEL_TIERS.sonnet35.bedrock,
    sonnet37: findModel("claude-3-7-sonnet-20250219") || MODEL_TIERS.sonnet37.bedrock,
    sonnet40: findModel("claude-sonnet-4-20250514") || MODEL_TIERS.sonnet40.bedrock,
    sonnet45: findModel("claude-sonnet-4-5-20250929") || MODEL_TIERS.sonnet45.bedrock,
    opus40: findModel("claude-opus-4-20250514") || MODEL_TIERS.opus40.bedrock,
    opus41: findModel("claude-opus-4-1-20250805") || MODEL_TIERS.opus41.bedrock,
    opus45: findModel("claude-opus-4-5-20251101") || MODEL_TIERS.opus45.bedrock
  };
}

// Mapping: Cw3→loadBedrockModels, ctQ→fetchBedrockInferenceProfiles, tv→findInList
```

**Why dynamic discovery for Bedrock?**
- Different AWS accounts/regions have different model availability
- Cross-region inference profiles may have different IDs
- Graceful fallback ensures functionality even without all models

---

## 8. Model Name Normalization

### normalizeModelName (Uz) - chunks.46.mjs:2299-2306

```javascript
// ============================================
// normalizeModelName - Extract semantic model name from full ID
// Location: chunks.46.mjs:2299-2306
// ============================================

// ORIGINAL (for source lookup):
function Uz(A) {
  if (A.includes("claude-opus-4-5")) return "claude-opus-4-5";
  if (A.includes("claude-opus-4-1")) return "claude-opus-4-1";
  if (A.includes("claude-opus-4")) return "claude-opus-4";
  let Q = A.match(/(claude-(\d+-\d+-)?\w+)/);
  if (Q && Q[1]) return Q[1];
  return A
}

// READABLE (for understanding):
function normalizeModelName(fullModelId) {
  // Special handling for Opus variants (order matters!)
  if (fullModelId.includes("claude-opus-4-5")) return "claude-opus-4-5";
  if (fullModelId.includes("claude-opus-4-1")) return "claude-opus-4-1";
  if (fullModelId.includes("claude-opus-4")) return "claude-opus-4";

  // Generic pattern: claude-{version-}name
  // Examples: claude-sonnet-4-5, claude-3-7-sonnet, claude-haiku-4-5
  const match = fullModelId.match(/(claude-(\d+-\d+-)?\w+)/);
  if (match && match[1]) return match[1];

  return fullModelId;
}

// Mapping: Uz→normalizeModelName
```

**Examples:**
| Input | Output |
|-------|--------|
| `us.anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5` |
| `claude-sonnet-4-5@20250929` | `claude-sonnet-4-5` |
| `claude-3-7-sonnet-20250219` | `claude-3-7-sonnet` |
| `anthropic.claude-3-5-sonnet-20241022-v2:0` | `claude-3-5-sonnet` |

---

## 9. Model Alias System

### Supported Aliases

| Alias | Resolves To | Description |
|-------|-------------|-------------|
| `sonnet` | Sonnet 4.5 | Latest Sonnet model |
| `opus` | Opus 4.5/4.1 | Latest Opus (provider-dependent) |
| `haiku` | Haiku 4.5 | Latest Haiku model |
| `opusplan` | Opus 4.5 (plan) / Sonnet 4.5 (else) | Opus only in plan mode |
| `sonnet[1m]` | Sonnet 4.5 with 1M context | Extended context variant |
| `inherit` | Parent model | Inherit from parent agent |

### resolveModelWithPermissions (HQA) - chunks.46.mjs:2259-2268

```javascript
// ============================================
// resolveModelWithPermissions - Resolve model based on permission mode
// Location: chunks.46.mjs:2259-2268
// ============================================

// ORIGINAL (for source lookup):
function HQA(A) {
  let {
    permissionMode: Q,
    mainLoopModel: B,
    exceeds200kTokens: G = !1
  } = A;
  // opusplan: use Opus in plan mode (unless context > 200k)
  if (FQA() === "opusplan" && Q === "plan" && !G) return sJA();
  // haiku: upgrade to Sonnet in plan mode
  if (FQA() === "haiku" && Q === "plan") return OR();
  return B
}

// READABLE (for understanding):
function resolveModelWithPermissions({
  permissionMode,
  mainLoopModel,
  exceeds200kTokens = false
}) {
  const selectedAlias = getActiveModelSelection();

  // Special handling for "opusplan" alias
  // Use Opus in plan mode (unless context exceeds 200k)
  if (selectedAlias === "opusplan" && permissionMode === "plan" && !exceeds200kTokens) {
    return getDefaultOpusModel();
  }

  // Upgrade Haiku to Sonnet in plan mode (for better planning)
  if (selectedAlias === "haiku" && permissionMode === "plan") {
    return getDefaultSonnetModel();
  }

  return mainLoopModel;
}

// Mapping: HQA→resolveModelWithPermissions, FQA→getActiveModelSelection, sJA→getDefaultOpusModel, OR→getDefaultSonnetModel
```

---

## 10. Model Display Names

### getModelDisplayName (KC/JeQ) - chunks.46.mjs:2356-2389

```javascript
// ============================================
// getModelDisplayName - Human-readable model names
// Location: chunks.46.mjs:2356-2389
// ============================================

// ORIGINAL (for source lookup):
function JeQ(A) {
  switch (A) {
    case AI().opus45: return "Opus 4.5";
    case AI().opus41: return "Opus 4.1";
    case AI().opus40: return "Opus 4";
    case AI().sonnet45 + "[1m]": return "Sonnet 4.5 (1M context)";
    case AI().sonnet45: return "Sonnet 4.5";
    case AI().sonnet40: return "Sonnet 4";
    case AI().sonnet40 + "[1m]": return "Sonnet 4 (1M context)";
    case AI().sonnet37: return "Sonnet 3.7";
    case AI().sonnet35: return "Sonnet 3.5";
    case AI().haiku45: return "Haiku 4.5";
    case AI().haiku35: return "Haiku 3.5";
    default: return null
  }
}

function KC(A) {
  let Q = JeQ(A);
  if (Q) return Q;
  return A
}

// READABLE (for understanding):
function getModelDisplayName(modelId) {
  const config = getModelConfig();

  const displayNames = {
    [config.opus45]: "Opus 4.5",
    [config.opus41]: "Opus 4.1",
    [config.opus40]: "Opus 4",
    [config.sonnet45 + "[1m]"]: "Sonnet 4.5 (1M context)",
    [config.sonnet45]: "Sonnet 4.5",
    [config.sonnet40]: "Sonnet 4",
    [config.sonnet40 + "[1m]"]: "Sonnet 4 (1M context)",
    [config.sonnet37]: "Sonnet 3.7",
    [config.sonnet35]: "Sonnet 3.5",
    [config.haiku45]: "Haiku 4.5",
    [config.haiku35]: "Haiku 3.5"
  };

  return displayNames[modelId] || modelId;
}

// Mapping: JeQ→getModelDisplayNameInternal, KC→getModelDisplayName
```

---

## 11. Flow Diagram

```
User Request (model selection)
         │
         ▼
┌─────────────────────────────────────────┐
│ getDefaultModel (B5)                     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ getActiveModelSelection (FQA)            │
│  1. Session override (/model command)    │
│  2. ANTHROPIC_MODEL env var              │
│  3. Config file (settings.json)          │
│  4. Experiment/default override          │
└─────────────────────────────────────────┘
         │
         ├── User selected model ────────────────┐
         │                                        ▼
         │                        ┌───────────────────────────┐
         │                        │ convertModelAliasToFullName │
         │                        │ (FX)                       │
         │                        └───────────────────────────┘
         │
         └── No selection (null) ────────────────┐
                                                  ▼
                                  ┌───────────────────────────┐
                                  │ getModelBySubscription     │
                                  │ (EQA/wu)                   │
                                  ├───────────────────────────┤
                                  │ Max/Team/Pro → Opus 4.5   │
                                  │ Default → Sonnet 4.5      │
                                  └───────────────────────────┘
                                                  │
                                                  ▼
                                  ┌───────────────────────────┐
                                  │ getModelConfig (AI)        │
                                  │ - Cached config OR         │
                                  │ - Default by provider      │
                                  │ - Bedrock: async discovery │
                                  └───────────────────────────┘
                                                  │
                                                  ▼
                                  ┌───────────────────────────┐
                                  │ Provider-specific model ID │
                                  │ (firstParty/bedrock/vertex/│
                                  │  foundry format)           │
                                  └───────────────────────────┘
```

---

## 12. Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_MODEL` | Override default model | `claude-opus-4-5-20251101` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Override Opus default | `claude-opus-4-1-20250805` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Override Sonnet default | `claude-sonnet-4-20250514` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Override Haiku default | `claude-3-5-haiku-20241022` |
| `CLAUDE_CODE_USE_BEDROCK` | Enable Bedrock provider | `true` |
| `CLAUDE_CODE_USE_VERTEX` | Enable Vertex provider | `true` |
| `CLAUDE_CODE_USE_FOUNDRY` | Enable Foundry provider | `true` |
