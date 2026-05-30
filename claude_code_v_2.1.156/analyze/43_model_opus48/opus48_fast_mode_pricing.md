# Fast Mode on Opus 4.8: 2x Pricing, /fast Command & Override Deprecation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document:
- `selectFastModePricing` (`S0H`) - Picks the fast-mode cost table by model family (cli_inner_pretty.js:98451-98457)
- `resolveModelCost` (`mx1`) - Resolves the effective per-Mtok cost for a model+speed (cli_inner_pretty.js:98467-98480)
- `OPUS_STANDARD_COST` (`BB`) - Standard Opus pricing (5 in / 25 out) (cli_inner_pretty.js:98526-98532)
- `OPUS_LEGACY_FAST_COST` (`Cx1`) - 4.6/4.7 fast pricing (30 in / 150 out) (cli_inner_pretty.js:98533-98539)
- `OPUS_48_FAST_COST` (`bx1`) - Opus 4.8 fast pricing (10 in / 50 out) (cli_inner_pretty.js:98540-98546)
- `FIRST_PARTY_COST_TABLE` (`nr$`) - canonical-id → cost map (cli_inner_pretty.js:98562-98576)
- `isFastModeEnabled` (`I9`) - firstParty + !DISABLE_FAST_MODE gate (cli_inner_pretty.js:98189-98192)
- `isFastModeAvailable` (`jZ`) - enabled AND no unavailable-reason (cli_inner_pretty.js:98196-98199)
- `getFastModeUnavailableReason` (`Ne`) - returns the human reason string or null (cli_inner_pretty.js:98216-98239)
- `disabledReasonMessage` (`yx1`) - reason-code → message switch (cli_inner_pretty.js:98200-98215)
- `isOpus46FastModeOverride` (`ki`) - reads CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE (cli_inner_pretty.js:98240-98242)
- `getFastModeModelLabel` (`uB`) - "Opus 4.6" if override else "Opus 4.8" (cli_inner_pretty.js:98243-98245)
- `getFastModeModelId` (`mUH`) - "claude-opus-4-6" / "opus" (+[1m]) (cli_inner_pretty.js:98246-98248)
- `getInitialFastModeSetting` (`m76`) - per-session-opt-in vs persisted resolution (cli_inner_pretty.js:98249-98256)
- `isFastModeEligibleModel` (`Wj`) - opus-4-6/7/8, narrowed to 4-6 under override (cli_inner_pretty.js:98257-98263)
- `applyFastMode` (`PE8`) - /fast handler: toggles + reports pricing (cli_inner_pretty.js:513683-513695)
- `setFastModeSetting` (`LE8`) - persists fastMode + switches model (cli_inner_pretty.js:513667-513682)
- `fastSlashHandler` (`R5z`) - /fast [on|off] non-interactive call (cli_inner_pretty.js:513925-513935)
- `FAST_SLASH_JSX`/`FAST_SLASH_LOCAL` (`I5z`/`eg4`) - /fast command descriptors (cli_inner_pretty.js:513944-513971)
- `FAST_MODE_BETA_HEADER` (`xUH`) - speed/fast-mode-2026-02-01 beta (cli_inner_pretty.js:98131)
- `EFFORT_BETA_HEADER` (`CUH`) - effort/effort-2025-11-24 beta (cli_inner_pretty.js:98127)
- `OPUS_48_MODEL_CONFIG` (`Xi$`) - per-provider opus-4-8 id map (cli_inner_pretty.js:91825-91834)
- `normalizeModelIdToCanonical` (`HD`) - id → canonical "claude-opus-4-8" (cli_inner_pretty.js:98751-98768)
- `resolveModelCanonicalId` (`O7`) - inference-profile-aware canonicalizer (cli_inner_pretty.js:98770-98778)
- `is1MContextAvailable` (`VP`) - whether the [1m] suffix applies (cli_inner_pretty.js:98806-98810)
- `isThinkingSignatureError` (`B87`) - 400 thinking-signature matcher (cli_inner_pretty.js:186575-186583)
- `stripSignedThinkingBlocks` (`cG4`) - drops signed/redacted thinking blocks (cli_inner_pretty.js:446238-446252)
- `isSignedThinkingBlock` (`gG4`) - predicate for signed/redacted blocks (cli_inner_pretty.js:446086-446090)

---

## TL;DR

In v2.1.156, **fast mode** is Claude Code's "trade money for latency" switch: it tells the API to run the **current Opus model** at a higher *speed* tier in exchange for a higher *price*. The headline change in this release window (2.1.154) is that **Opus 4.8 fast mode is 2x the standard rate for ~2.5x the speed** — dramatically cheaper than the 4.6/4.7 fast tariff, which was **6x** the standard rate.

- **Pricing** is selected by `selectFastModePricing` (`S0H`, cli_inner_pretty.js:98451-98457): if fast mode is on and the model canonicalizes to `claude-opus-4-8`, use `OPUS_48_FAST_COST` (`bx1`, input **10** / output **50**); otherwise use `OPUS_LEGACY_FAST_COST` (`Cx1`, input **30** / output **150**). Standard Opus is `OPUS_STANDARD_COST` (`BB`, input **5** / output **25**). `bx1` is *exactly* 2x `BB`; `Cx1` is 6x `BB`.
- **Availability** is a layered gate: `isFastModeEnabled` (`I9`) requires firstParty provider + `!CLAUDE_CODE_DISABLE_FAST_MODE`; `getFastModeUnavailableReason` (`Ne`) layers org/SDK/network checks on top and yields a human-readable reason string (or `null` = available).
- The **`/fast [on|off]`** slash command (`I5z`/`eg4`, description "Toggle fast mode (Opus 4.8)") flips the `fastMode` setting, switches the model to a fast-eligible Opus if needed, and injects `speed: "fast"` into the request body alongside the `fast-mode-2026-02-01` beta header.
- The legacy **`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`** env var (`ki`) is now **deprecated, removal 06/01**. It pins the fast-mode label/model to Opus 4.6 and narrows fast-mode eligibility to the 4-6 family. The replacement workflow is `/model claude-opus-4-6[1m]` then `/fast on`.

Cross-validation against the 2.1.88 readable source (`src/utils/fastMode.ts`) is **high confidence** for the availability machinery — the structure is nearly 1:1. The **4.8 fast pricing**, the **override branch** (`ki`/`uB`/`mUH`), and the **eligibility expansion to 4-6/4-7/4-8** are all **NEW after 2.1.88** (2.1.88 hard-codes `Opus 4.6` and only matches `opus-4-6`).

---

## 1. Pricing: standard vs Opus-4.8 fast vs legacy fast

### 1.1 The three cost tables

All per-token prices are expressed as **USD per million tokens (Mtok)**. The three Opus cost tables live in the `ye` module init block:

```javascript
// ============================================
// OPUS_STANDARD_COST / OPUS_LEGACY_FAST_COST / OPUS_48_FAST_COST - Opus pricing tables
// Location: cli_inner_pretty.js:98526-98546
// ============================================

// ORIGINAL (for source lookup):
(BB = { inputTokens: 5, outputTokens: 25, promptCacheWriteTokens: 6.25, promptCacheReadTokens: 0.5, webSearchRequests: 0.01 }),
(Cx1 = { inputTokens: 30, outputTokens: 150, promptCacheWriteTokens: 37.5, promptCacheReadTokens: 3, webSearchRequests: 0.01 }),
(bx1 = { inputTokens: 10, outputTokens: 50, promptCacheWriteTokens: 12.5, promptCacheReadTokens: 1, webSearchRequests: 0.01 }),

// READABLE (for understanding):
const OPUS_STANDARD_COST   = { inputTokens: 5,  outputTokens: 25,  promptCacheWriteTokens: 6.25, promptCacheReadTokens: 0.5, webSearchRequests: 0.01 };
const OPUS_LEGACY_FAST_COST = { inputTokens: 30, outputTokens: 150, promptCacheWriteTokens: 37.5, promptCacheReadTokens: 3,   webSearchRequests: 0.01 };  // Opus 4.6/4.7 fast
const OPUS_48_FAST_COST    = { inputTokens: 10, outputTokens: 50,  promptCacheWriteTokens: 12.5, promptCacheReadTokens: 1,   webSearchRequests: 0.01 };  // Opus 4.8 fast

// Mapping: BB→OPUS_STANDARD_COST, Cx1→OPUS_LEGACY_FAST_COST, bx1→OPUS_48_FAST_COST
```

**Quantifying the rate multipliers** (every field of `bx1` is exactly 2× the corresponding field of `BB`; every field of `Cx1` is exactly 6× `BB`):

```
                         input   output   cacheWrite  cacheRead     multiplier vs standard
OPUS_STANDARD_COST (BB)    5       25        6.25        0.5         1x   (baseline)
OPUS_48_FAST_COST  (bx1)   10      50        12.5        1.0         2x   ← Opus 4.8 fast
OPUS_LEGACY_FAST   (Cx1)   30      150       37.5        3.0         6x   ← Opus 4.6/4.7 fast
```

The changelog's claim — *"Fast mode on Opus 4.8 is now available at a fraction of its previous cost: 2x the standard rate for 2.5x the speed"* — maps directly onto the code: the **2x rate** is the `bx1`/`BB` ratio above (verifiable from the bundle); the **2.5x speed** is a model-serving characteristic of the new `speed: "fast"` tier and is **not** encoded in the bundle (it is a server-side throughput property, asserted only in the changelog, cli_inner_pretty.js cannot prove it). The "fraction of its previous cost" is the 6x → 2x drop: switching the *current* Opus from 4.7 to 4.8 changes the fast tariff from `Cx1` (6x) to `bx1` (2x), a **3x cost reduction at the same speed tier**.

### 1.2 `selectFastModePricing` (`S0H`) — pick the fast table by family

```javascript
// ============================================
// selectFastModePricing - Choose the cost table for a model under a given speed
// Location: cli_inner_pretty.js:98451-98457
// ============================================

// ORIGINAL (for source lookup):
function S0H(H, $) {
  if (I9() && H) {
    if (O7($) === "claude-opus-4-8") return bx1;
    return Cx1;
  }
  return BB;
}

// READABLE (for understanding):
function selectFastModePricing(isFastSpeed, modelId) {
  if (isFastModeEnabled() && isFastSpeed) {
    if (resolveModelCanonicalId(modelId) === "claude-opus-4-8") return OPUS_48_FAST_COST;  // 2x
    return OPUS_LEGACY_FAST_COST;                                                          // 6x (4.6/4.7)
  }
  return OPUS_STANDARD_COST;                                                               // 1x
}

// Mapping: S0H→selectFastModePricing, H→isFastSpeed, $→modelId, I9→isFastModeEnabled,
//          O7→resolveModelCanonicalId, bx1→OPUS_48_FAST_COST, Cx1→OPUS_LEGACY_FAST_COST, BB→OPUS_STANDARD_COST
```

The branch logic is deliberately **defaulting to the legacy 6x tariff** for any non-4.8 Opus when fast is on: only `claude-opus-4-8` gets the discounted 2x table. This is the single decision point that ties the discount to the model upgrade.

### 1.3 `resolveModelCost` (`mx1`) — special-case the *current* Opus when speed=fast

`selectFastModePricing` is only consulted from `resolveModelCost` (`mx1`), the function that maps any model id to its effective cost table. The interesting part is *when* it routes into the fast table: only when the requested model is the **currently-active Opus family** (4.8, or 4.6/4.7 when not overridden) **and** the request's `speed` field is `"fast"`.

```javascript
// ============================================
// resolveModelCost - Resolve the per-Mtok cost table for a model + request speed
// Location: cli_inner_pretty.js:98467-98480
// ============================================

// ORIGINAL (for source lookup):
function mx1(H, $) {
  let q = O7(H), K = $.speed === "fast",
    _ = HD(Di$.firstParty), z = HD(Ji$.firstParty), A = HD(Xi$.firstParty);
  if (K && (q === _ || (!ki() && (q === z || q === A)))) return S0H(K, H);
  let Y = nr$[q];
  if (Y) return Y;
  let f = b$().additionalModelCostsCache, O = f?.[H] ?? f?.[q];
  if (O) return O;
  return (Bx1(H, q), nr$[O7(wZ())] ?? xx1);
}

// READABLE (for understanding):
function resolveModelCost(modelId, usage) {
  let canonical = resolveModelCanonicalId(modelId);
  let isFast   = usage.speed === "fast";
  let opus46   = normalizeModelIdToCanonical(OPUS_46_MODEL_CONFIG.firstParty);  // "claude-opus-4-6"
  let opus47   = normalizeModelIdToCanonical(OPUS_47_MODEL_CONFIG.firstParty);  // "claude-opus-4-7"
  let opus48   = normalizeModelIdToCanonical(OPUS_48_MODEL_CONFIG.firstParty);  // "claude-opus-4-8"
  // Fast pricing applies only to 4.6 (always) or 4.7/4.8 (unless the 4.6 override is set):
  if (isFast && (canonical === opus46 || (!isOpus46FastModeOverride() && (canonical === opus47 || canonical === opus48))))
    return selectFastModePricing(isFast, modelId);
  let known = FIRST_PARTY_COST_TABLE[canonical];
  if (known) return known;
  let extra = getCachedConfig().additionalModelCostsCache;
  let custom = extra?.[modelId] ?? extra?.[canonical];
  if (custom) return custom;
  return (reportUnknownModelCost(modelId, canonical), FIRST_PARTY_COST_TABLE[resolveModelCanonicalId(getCurrentModelSetting())] ?? FALLBACK_COST);
}

// Mapping: mx1→resolveModelCost, H→modelId, $→usage, q→canonical, K→isFast,
//          Di$→OPUS_46_MODEL_CONFIG, Ji$→OPUS_47_MODEL_CONFIG, Xi$→OPUS_48_MODEL_CONFIG,
//          ki→isOpus46FastModeOverride, S0H→selectFastModePricing, nr$→FIRST_PARTY_COST_TABLE, xx1→FALLBACK_COST
```

**Why two functions instead of one?** `resolveModelCost` answers "is this request even *eligible* for fast pricing?" (gating on the current-Opus family and the override flag), while `selectFastModePricing` answers "given that it is, *which* fast table?". Splitting the eligibility gate from the table selection lets the same `selectFastModePricing` be reused from the UI pricing previews (`/fast` confirmation, `/model` menu) without re-deriving the family check.

**Edge case — the override narrows the fast set.** When `isOpus46FastModeOverride()` is true, the `!ki()` guard removes 4.7 and 4.8 from the fast branch, so even if a request carries `speed:"fast"` on Opus 4.8 the cost table falls through to `FIRST_PARTY_COST_TABLE[canonical]` (standard `BB`). This is consistent with the override's intent: it pins fast mode to 4.6 only.

### 1.4 Where pricing is *displayed*

`zv` (cli_inner_pretty.js:98501-98503) formats a cost table as `"$X/$Y per Mtok"`. The `/fast` confirmation message (§3) computes its price string as `zv(S0H(true, opusModelId))`, and the model menu uses the same helper. The 2.1.156 changelog bullet *"Fixed the /model picker not showing fast mode pricing on the Default option for API (pay-as-you-go) users when fast mode is on"* is a fix to a caller of this path, not to `S0H` itself.

---

## 2. Availability chain

Fast mode availability is computed as a **3-layer cascade**, each layer strictly narrower than the last:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 1: isFastModeEnabled (I9)                                        │
│   provider === "firstParty"  AND  !CLAUDE_CODE_DISABLE_FAST_MODE       │
│   (a hard kill-switch; false here ⇒ /fast hidden, no pricing)          │
└───────────────┬──────────────────────────────────────────────────────┘
                │ true
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 2: getFastModeUnavailableReason (Ne) === null                    │
│   - tengu_penguins_off statsig kill-switch                             │
│   - Agent SDK (non-interactive + 3rd-party-auth + !kairos) needs       │
│     flagSettings.fastMode                                              │
│   - org status (Ah): disabled ⇒ reason via disabledReasonMessage(yx1)  │
│   isFastModeAvailable (jZ) = I9() && Ne() === null                     │
└───────────────┬──────────────────────────────────────────────────────┘
                │ available
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Layer 3: isFastModeEligibleModel (Wj)                                  │
│   current/given model canonicalizes to opus-4-6/4-7/4-8                │
│   (narrowed to opus-4-6 only when the 4.6 override is set)             │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.1 `isFastModeEnabled` (`I9`) — the firstParty kill-switch

```javascript
// ============================================
// isFastModeEnabled - Provider + env kill-switch for fast mode
// Location: cli_inner_pretty.js:98189-98192
// ============================================

// ORIGINAL (for source lookup):
function I9() {
  if (Zq() !== "firstParty") return !1;
  return !xH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}

// READABLE (for understanding):
function isFastModeEnabled() {
  if (getAPIProvider() !== "firstParty") return false;     // not on Bedrock/Vertex/Foundry/Mantle/Gateway
  return !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}

// Mapping: I9→isFastModeEnabled, Zq→getAPIProvider, xH→parseBoolean
```

This matches 2.1.88's `isFastModeEnabled` (`src/utils/fastMode.ts:38-40`) **except** that 2.1.88 only checks the env var; the firstParty provider check has moved *into* `I9` here, whereas 2.1.88 performed the provider check separately inside `getFastModeUnavailableReason` (lines 113-117). Functionally equivalent, restructured. Confidence: **high**.

### 2.2 `getFastModeUnavailableReason` (`Ne`) and `disabledReasonMessage` (`yx1`)

```javascript
// ============================================
// getFastModeUnavailableReason - Human-readable reason fast mode is off, or null
// Location: cli_inner_pretty.js:98216-98239
// ============================================

// ORIGINAL (for source lookup):
function Ne() {
  if (!I9())
    return Zq() !== "firstParty"
      ? "Fast mode is only available when using the Anthropic API directly"
      : "Fast mode is not available";
  let H = V$("tengu_penguins_off", null);
  if (H !== null) return (N(`Fast mode unavailable: ${H}`), H);
  if (R6() && TxH() && !$b()) {
    if (!S8("flagSettings")?.fastMode)
      return (N("Fast mode unavailable: Fast mode is not available in the Agent SDK"),
        "Fast mode is not available in the Agent SDK");
  }
  if (Ah.status === "disabled" && !u76()) {
    if (Ah.reason === "network_error" || Ah.reason === "unknown") {
      if (xH(process.env.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS)) return null;
    }
    let $ = pK() !== null ? "oauth" : "api-key", q = yx1(Ah.reason, $);
    return (N(`Fast mode unavailable: ${q}`), q);
  }
  return null;
}

// READABLE (for understanding):
function getFastModeUnavailableReason() {
  if (!isFastModeEnabled())
    return getAPIProvider() !== "firstParty"
      ? "Fast mode is only available when using the Anthropic API directly"
      : "Fast mode is not available";
  let statsigReason = getFeatureValue("tengu_penguins_off", null);     // server kill-switch
  if (statsigReason !== null) return (debug(`Fast mode unavailable: ${statsigReason}`), statsigReason);
  if (isNonInteractive() && preferThirdPartyAuth() && !isKairosActive()) {  // Agent SDK guard
    if (!getSettingsForSource("flagSettings")?.fastMode)
      return "Fast mode is not available in the Agent SDK";
  }
  if (orgStatus.status === "disabled" && !skipOrgCheck()) {            // org-level disable
    if (orgStatus.reason === "network_error" || orgStatus.reason === "unknown")
      if (parseBoolean(process.env.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS)) return null;
    let authType = getOAuthTokens() !== null ? "oauth" : "api-key";
    return disabledReasonMessage(orgStatus.reason, authType);
  }
  return null;
}

// Mapping: Ne→getFastModeUnavailableReason, V$→getFeatureValue, Ah→orgStatus, u76→skipOrgCheck,
//          yx1→disabledReasonMessage, pK→getOAuthTokens, S8→getSettingsForSource, $b→isKairosActive
```

`disabledReasonMessage` (`yx1`, cli_inner_pretty.js:98200-98215) maps the org-status `reason` code to a message:

```javascript
// ============================================
// disabledReasonMessage - reason-code → user-facing string (note the 2.1.156 drift)
// Location: cli_inner_pretty.js:98200-98215
// ============================================

// ORIGINAL (for source lookup):
function yx1(H, $) {
  switch (H) {
    case "free": return $ === "oauth" ? "Fast mode requires a paid subscription"
                                      : "Fast mode unavailable during evaluation. Please purchase credits.";
    case "preference": return "Fast mode has been disabled by your organization";
    case "extra_usage_disabled": return "Fast mode requires usage credits \xB7 /usage-credits to turn them on";
    case "network_error": return "Fast mode unavailable due to network connectivity issues";
    case "unknown": return "Fast mode is currently unavailable";
  }
}

// READABLE (for understanding):
function disabledReasonMessage(reason, authType) {
  switch (reason) {
    case "free": return authType === "oauth" ? "Fast mode requires a paid subscription"
                                             : "Fast mode unavailable during evaluation. Please purchase credits.";
    case "preference": return "Fast mode has been disabled by your organization";
    case "extra_usage_disabled": return "Fast mode requires usage credits · /usage-credits to turn them on";
    case "network_error": return "Fast mode unavailable due to network connectivity issues";
    case "unknown": return "Fast mode is currently unavailable";
  }
}

// Mapping: yx1→disabledReasonMessage, H→reason, $→authType
```

**Cross-validation drift (confidence: high).** 2.1.88's `getDisabledReasonMessage` (`src/utils/fastMode.ts:51-70`) is identical in shape, but the `extra_usage_disabled` case has drifted: 2.1.88 says *"Fast mode requires extra usage billing · /extra-usage to enable"*; 2.1.156 says *"Fast mode requires usage credits · /usage-credits to turn them on"*. This is the **"extra usage" → "usage credits"** product rename, and the slash command moved from `/extra-usage` to `/usage-credits`.

### 2.3 `isFastModeAvailable` (`jZ`) and per-session resolution `getInitialFastModeSetting` (`m76`)

`isFastModeAvailable` (`jZ`, cli_inner_pretty.js:98196-98199) is just `isFastModeEnabled() && getFastModeUnavailableReason() === null`. The session-startup resolution layers the eligibility and the per-session-opt-in flag on top:

```javascript
// ============================================
// getInitialFastModeSetting - Decide whether fast mode starts ON for a session
// Location: cli_inner_pretty.js:98249-98256
// ============================================

// ORIGINAL (for source lookup):
function m76(H) {
  if (!I9()) return !1;
  if (!jZ()) return !1;
  if (!Wj(H)) return !1;
  let $ = i6();
  if ($.fastModePerSessionOptIn) return !1;
  return $.fastMode === !0;
}

// READABLE (for understanding):
function getInitialFastModeSetting(modelSetting) {
  if (!isFastModeEnabled()) return false;
  if (!isFastModeAvailable()) return false;
  if (!isFastModeEligibleModel(modelSetting)) return false;
  let settings = getMergedSettings();
  if (settings.fastModePerSessionOptIn) return false;   // opt-in mode: every session starts OFF
  return settings.fastMode === true;                    // persisted mode: honor the saved flag
}

// Mapping: m76→getInitialFastModeSetting, I9→isFastModeEnabled, jZ→isFastModeAvailable,
//          Wj→isFastModeEligibleModel, i6→getMergedSettings
```

**Persisted vs per-session opt-in.** The settings schema (cli_inner_pretty.js:51713-51720) declares two booleans:
- `fastMode` — *"When true, fast mode is enabled. When absent or false, fast mode is off."* (persisted preference)
- `fastModePerSessionOptIn` — *"When true, fast mode does not persist across sessions. Each session starts with fast mode off."*

When `fastModePerSessionOptIn` is set, `getInitialFastModeSetting` short-circuits to `false` regardless of the saved `fastMode`, so the user must re-toggle `/fast on` each session. This is the safety valve for cost-conscious orgs that want fast mode *available* but never *sticky*. This is a 1:1 match with 2.1.88's `getInitialFastModeSetting` (`src/utils/fastMode.ts:149-165`). Confidence: **high**.

### 2.4 `isFastModeEligibleModel` (`Wj`) — the model family gate

```javascript
// ============================================
// isFastModeEligibleModel - Is this Opus model fast-mode eligible (override-aware)
// Location: cli_inner_pretty.js:98257-98263
// ============================================

// ORIGINAL (for source lookup):
function Wj(H) {
  if (!I9()) return !1;
  let $ = H ?? wZ(), K = e7($).toLowerCase();
  if (ki()) return K.includes("opus-4-6");
  return K.includes("opus-4-6") || K.includes("opus-4-7") || K.includes("opus-4-8");
}

// READABLE (for understanding):
function isFastModeEligibleModel(modelSetting) {
  if (!isFastModeEnabled()) return false;
  let setting = modelSetting ?? getCurrentModelSetting();
  let resolved = parseUserSpecifiedModel(setting).toLowerCase();
  if (isOpus46FastModeOverride()) return resolved.includes("opus-4-6");          // override ⇒ 4.6 only
  return resolved.includes("opus-4-6") || resolved.includes("opus-4-7") || resolved.includes("opus-4-8");
}

// Mapping: Wj→isFastModeEligibleModel, H→modelSetting, wZ→getCurrentModelSetting,
//          e7→parseUserSpecifiedModel, ki→isOpus46FastModeOverride
```

**Cross-validation (confidence: high, with a NEW expansion).** 2.1.88's `isFastModeSupportedByModel` (`src/utils/fastMode.ts:167-176`) had **only** the `opus-4-6` substring check — no 4.7, no 4.8, no override branch. The widening of the eligibility set to `opus-4-6/4-7/4-8` plus the override-driven narrowing is **NEW post-2.1.88**, tracking the 4.6 → 4.7 → 4.8 model progression.

---

## 3. The `/fast` slash command

### 3.1 Two command descriptors (local + local-jsx)

`/fast` is registered as **two** variants so it works both in the interactive Ink TUI (a picker dialog) and in non-interactive/headless mode (a plain text reply):

```javascript
// ============================================
// FAST_SLASH_JSX / FAST_SLASH_LOCAL - /fast command descriptors
// Location: cli_inner_pretty.js:513944-513971
// ============================================

// ORIGINAL (for source lookup):
((I5z = {
  type: "local-jsx", name: "fast",
  get description() { return `Toggle fast mode (${uB()})`; },
  get isHidden() { return !I9(); },
  argumentHint: "[on|off]",
  get immediate() { return i8$(); },
  requires: { ink: !0 },
  thinClientDispatch: "control-request",
  load: () => Promise.resolve().then(() => (iHq(), ag4)),
}),
  (eg4 = {
    type: "local", name: "fast", supportsNonInteractive: !0,
    get description() { return `Toggle fast mode (${uB()})`; },
    argumentHint: "[on|off]",
    load: () => Promise.resolve().then(() => (tg4(), sg4)),
  }),
  (rHq = I5z));

// READABLE (for understanding):
const FAST_SLASH_JSX = {
  type: "local-jsx", name: "fast",
  get description() { return `Toggle fast mode (${getFastModeModelLabel()})`; },  // "Toggle fast mode (Opus 4.8)"
  get isHidden() { return !isFastModeEnabled(); },                               // hidden when not firstParty / disabled
  argumentHint: "[on|off]",
  get immediate() { return immediateModelCommands(); },
  requires: { ink: true },
  thinClientDispatch: "control-request",
  load: () => import("./fast-picker.jsx"),
};
const FAST_SLASH_LOCAL = {
  type: "local", name: "fast", supportsNonInteractive: true,
  get description() { return `Toggle fast mode (${getFastModeModelLabel()})`; },
  argumentHint: "[on|off]",
  load: () => import("./fast-handler.js"),
};

// Mapping: I5z→FAST_SLASH_JSX, eg4→FAST_SLASH_LOCAL, uB→getFastModeModelLabel, I9→isFastModeEnabled, i8$→immediateModelCommands
```

The description is a **getter** (`Toggle fast mode (${uB()})`), so it reads "Toggle fast mode (Opus 4.8)" normally and "Toggle fast mode (Opus 4.6)" when the override is set (since `getFastModeModelLabel` returns "Opus 4.6" under the override). `isHidden` ties visibility to `isFastModeEnabled`, so on Bedrock/Vertex/Foundry the command simply disappears.

### 3.2 The non-interactive handler `R5z`

```javascript
// ============================================
// fastSlashHandler - /fast [on|off] argument parsing (non-interactive)
// Location: cli_inner_pretty.js:513925-513935
// ============================================

// ORIGINAL (for source lookup):
async function R5z(H, $) {
  if (!I9()) return { type: "text", value: Ne() ?? "Fast mode is not available" };
  await BUH();
  let q = H.trim().toLowerCase(), K;
  if (q === "on") K = !0;
  else if (q === "off") K = !1;
  else if (q === "") K = !$.options.fastMode;
  else return { type: "text", value: `Unknown argument "${q}". Use: /fast [on|off]` };
  return { type: "text", value: await PE8(K, $.getAppState, $.setAppState, "bridge") };
}

// READABLE (for understanding):
async function fastSlashHandler(argString, ctx) {
  if (!isFastModeEnabled()) return { type: "text", value: getFastModeUnavailableReason() ?? "Fast mode is not available" };
  await prefetchFastModeStatus();
  let arg = argString.trim().toLowerCase(), enable;
  if (arg === "on") enable = true;
  else if (arg === "off") enable = false;
  else if (arg === "") enable = !ctx.options.fastMode;          // bare /fast = toggle
  else return { type: "text", value: `Unknown argument "${arg}". Use: /fast [on|off]` };
  return { type: "text", value: await applyFastMode(enable, ctx.getAppState, ctx.setAppState, "bridge") };
}

// Mapping: R5z→fastSlashHandler, H→argString, $→ctx, I9→isFastModeEnabled, Ne→getFastModeUnavailableReason,
//          BUH→prefetchFastModeStatus, PE8→applyFastMode
```

### 3.3 `applyFastMode` (`PE8`) and `setFastModeSetting` (`LE8`) — toggle + model switch

`applyFastMode` re-checks availability, persists the toggle, emits the `tengu_fast_mode_toggled` telemetry event, and builds the confirmation string with live pricing:

```javascript
// ============================================
// applyFastMode - Apply /fast toggle and build the confirmation message
// Location: cli_inner_pretty.js:513683-513695
// ============================================

// ORIGINAL (for source lookup):
async function PE8(H, $, q, K) {
  let _ = Ne();
  if (_) return `Fast mode unavailable: ${_}`;
  let { mainLoopModel: z } = $();
  if ((LE8(H, q), d("tengu_fast_mode_toggled", { enabled: H, source: K }), H)) {
    let A = zWH(!0), Y = !Wj(z) ? ` \xB7 model set to ${uB()}` : "",
      f = X7(), O = O7(f).includes("opus") ? f : "claude-opus-4-8",
      M = zv(S0H(!0, O));
    return `${A} Fast mode ON${Y} \xB7 ${M}`;
  } else return "Fast mode OFF";
}

// READABLE (for understanding):
async function applyFastMode(enable, getAppState, setAppState, source) {
  let reason = getFastModeUnavailableReason();
  if (reason) return `Fast mode unavailable: ${reason}`;
  let { mainLoopModel } = getAppState();
  setFastModeSetting(enable, setAppState);
  logEvent("tengu_fast_mode_toggled", { enabled: enable, source });
  if (enable) {
    let badge = fastModeBadge(true);
    let modelNote = !isFastModeEligibleModel(mainLoopModel) ? ` · model set to ${getFastModeModelLabel()}` : "";
    let cur = getResolvedModel();
    let opusForPricing = resolveModelCanonicalId(cur).includes("opus") ? cur : "claude-opus-4-8";
    let price = formatCost(selectFastModePricing(true, opusForPricing));
    return `${badge} Fast mode ON${modelNote} · ${price}`;       // e.g. "⚡ Fast mode ON · model set to Opus 4.8 · $10/$50 per Mtok"
  }
  return "Fast mode OFF";
}

// Mapping: PE8→applyFastMode, H→enable, K→source, Ne→getFastModeUnavailableReason, LE8→setFastModeSetting,
//          zWH→fastModeBadge, Wj→isFastModeEligibleModel, uB→getFastModeModelLabel, X7→getResolvedModel,
//          S0H→selectFastModePricing, zv→formatCost
```

`setFastModeSetting` (`LE8`, cli_inner_pretty.js:513667-513682) does the persistence and the **automatic model switch**: it persists `fastMode`, sends an `apply_flag_settings` control request that carries `model: mUH()` when enabling, and — if the current main-loop model is *not* fast-eligible — switches `mainLoopModel` to `getFastModeModelId()` (`mUH`):

```javascript
// ============================================
// setFastModeSetting - Persist fastMode and switch to a fast-eligible model
// Location: cli_inner_pretty.js:513667-513682
// ============================================

// ORIGINAL (for source lookup):
function LE8(H, $) {
  if ((POH(), p6("userSettings", { fastMode: H ? !0 : void 0 }), ph()))
    W3()?.sendControlRequest({ subtype: "apply_flag_settings",
      settings: { fastMode: H ? !0 : null, ...(H && { model: mUH() }) } }).catch(hH);
  if ((AWH({ fastMode: H }, $), H))
    $((q) => {
      if (Wj(q.mainLoopModel)) return q;
      let K = mUH(), _ = e7(K) === e7(wZ());
      return { ...q, mainLoopModel: _ ? null : K, mainLoopModelForSession: null };
    });
}

// READABLE (for understanding):
function setFastModeSetting(enable, setAppState) {
  clearFastModeCooldown();
  updateSettingsForSource("userSettings", { fastMode: enable ? true : undefined });
  if (isThinClient())
    getRemoteBridge()?.sendControlRequest({ subtype: "apply_flag_settings",
      settings: { fastMode: enable ? true : null, ...(enable && { model: getFastModeModelId() }) } });
  applyAppStateDelta({ fastMode: enable }, setAppState);
  if (enable)
    setAppState((s) => {
      if (isFastModeEligibleModel(s.mainLoopModel)) return s;          // already on an eligible Opus → keep it
      let fastModel = getFastModeModelId();                            // "claude-opus-4-6" or "opus" (+[1m])
      let isDefault = parseUserSpecifiedModel(fastModel) === parseUserSpecifiedModel(getCurrentModelSetting());
      return { ...s, mainLoopModel: isDefault ? null : fastModel, mainLoopModelForSession: null };
    });
}

// Mapping: LE8→setFastModeSetting, H→enable, $→setAppState, POH→clearFastModeCooldown, p6→updateSettingsForSource,
//          ph→isThinClient, W3→getRemoteBridge, mUH→getFastModeModelId, AWH→applyAppStateDelta,
//          Wj→isFastModeEligibleModel, e7→parseUserSpecifiedModel, wZ→getCurrentModelSetting
```

This is *why* the model-menu notice (cli_inner_pretty.js:461047-461052) warns *"Fast mode is ON and available with {uB()} (/fast). Switching to other models turns off fast mode."* — turning fast mode on auto-pins an eligible Opus, and switching away makes `isFastModeEligibleModel` false, which in turn makes `getInitialFastModeSetting`/runtime gates return false.

### 3.4 `speed: "fast"` injection and the `fast-mode-2026-02-01` beta

When the query layer builds the API request body, a single computed flag `r` decides whether to opt into fast mode, and that flag drives both the **body `speed` field** and the **beta header**:

```javascript
// ============================================
// Fast-mode request-body opt-in + beta latch
// Location: cli_inner_pretty.js:557064-557067, 557158-557159, 557190
// ============================================

// ORIGINAL (for source lookup):
let r = I9() && jZ() && !Ee() && Wj(z.model) && !!z.fastMode, a = !1;
// ...
if (((a = ub ? oI$(I, ub) : !1), r)) rI$(I, xUH);     // latch the speed beta when fast is on
let o = oI$(I, xUH);
// ... inside the per-attempt request builder:
if (I9() && jZ() && !Ee() && Wj(z.model) && !!BH.fastMode) j8 = "fast";
if (o && !s.includes(xUH)) s.push(xUH);
// ... in the returned request object:
...(j8 !== void 0 && { speed: j8 }),

// READABLE (for understanding):
let fastActive = isFastModeEnabled() && isFastModeAvailable() && !isFastModeCooldown()
                 && isFastModeEligibleModel(opts.model) && !!opts.fastMode;
if (fastActive) sendBeta(betaSet, FAST_MODE_BETA_HEADER);              // anthropic-beta: fast-mode-2026-02-01
let speedBetaSent = betaWasSent(betaSet, FAST_MODE_BETA_HEADER);
// per-attempt:
let speed;
if (isFastModeEnabled() && isFastModeAvailable() && !isFastModeCooldown()
    && isFastModeEligibleModel(opts.model) && !!attempt.fastMode) speed = "fast";
if (speedBetaSent && !betas.includes(FAST_MODE_BETA_HEADER)) betas.push(FAST_MODE_BETA_HEADER);
// request body:
...(speed !== undefined && { speed }),                                // body: { speed: "fast" }

// Mapping: r/fastActive, I9→isFastModeEnabled, jZ→isFastModeAvailable, Ee→isFastModeCooldown,
//          Wj→isFastModeEligibleModel, xUH→FAST_MODE_BETA_HEADER, rI$→sendBeta, oI$→betaWasSent, j8→speed
```

The beta header constant is declared at cli_inner_pretty.js:98131: `xUH = KX("speed", "fast-mode-2026-02-01")`. The telemetry/cost path mirrors this with `...(I9() && $.speed === "fast" && { speed: "fast" })` (cli_inner_pretty.js:239887) and a trace attribute `speed: K ? "fast" : "normal"` (cli_inner_pretty.js:276463). The notable runtime guard is `!Ee()` (`isFastModeCooldown`): after a 429/overload, fast mode enters a **cooldown** state (`B76`/`U3K`, cli_inner_pretty.js:98264-98278) and the request silently falls back to standard speed until `resetAt` passes — so even with `/fast on`, a request may legitimately ship without `speed:"fast"`.

> Note on the sibling effort param: the effort beta `CUH = KX("effort", "effort-2025-11-24")` (cli_inner_pretty.js:98127) is injected by `NLz` (cli_inner_pretty.js:556648-556656), which first calls `A2(model)` (`modelSupportsEffort`); if the model does not support effort it `delete`s the `effort` field. This is the 2.1.156 fix for *"API 400 errors on models that don't support the effort parameter when CLAUDE_CODE_ALWAYS_ENABLE_EFFORT is set"* (changelog) — speed and effort are independent betas gated by their own predicates.

---

## 4. `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` deprecation

### 4.1 The override functions

```javascript
// ============================================
// isOpus46FastModeOverride / getFastModeModelLabel / getFastModeModelId - the 4.6 override trio
// Location: cli_inner_pretty.js:98240-98248
// ============================================

// ORIGINAL (for source lookup):
function ki() { return xH(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE); }
function uB() { return ki() ? "Opus 4.6" : "Opus 4.8"; }
function mUH() { return (ki() ? "claude-opus-4-6" : "opus") + (VP() ? "[1m]" : ""); }

// READABLE (for understanding):
function isOpus46FastModeOverride() { return parseBoolean(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE); }
function getFastModeModelLabel() { return isOpus46FastModeOverride() ? "Opus 4.6" : "Opus 4.8"; }
function getFastModeModelId() {
  return (isOpus46FastModeOverride() ? "claude-opus-4-6" : "opus") + (is1MContextAvailable() ? "[1m]" : "");
}

// Mapping: ki→isOpus46FastModeOverride, uB→getFastModeModelLabel, mUH→getFastModeModelId,
//          xH→parseBoolean, VP→is1MContextAvailable
```

The override flows through three places, pinning the entire fast-mode surface to 4.6:
1. **Label** — `getFastModeModelLabel` returns "Opus 4.6" → `/fast` description, model-menu notice, confirmation messages all say 4.6.
2. **Model id** — `getFastModeModelId` returns `claude-opus-4-6[1m]` → `setFastModeSetting`'s auto-switch pins 4.6, and the `apply_flag_settings` control request carries `model: "claude-opus-4-6[1m]"`.
3. **Eligibility + pricing** — `isFastModeEligibleModel` narrows to `opus-4-6` only, and `resolveModelCost`'s `!ki()` guard removes 4.7/4.8 from the fast branch, so 4.6 keeps using `OPUS_LEGACY_FAST_COST` (`Cx1`, 6x) while non-4.6 Opus reverts to standard.

### 4.2 Deprecation and the replacement workflow

The 2.1.156 changelog (cli_inner_pretty.js:CHANGELOG line 27) states: *"Deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (will be removed on 06/01). To use fast mode on Opus 4.6, switch with `/model claude-opus-4-6[1m]` and then `/fast on`"*. (The 06/01 removal date and the "deprecated" status are changelog assertions; the bundle still wires `ki` through actively — there is no in-code deprecation warning string. Confidence on removal-date: changelog-only.)

The replacement is a clean composition of two existing mechanisms:

```
OLD (deprecated):  CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1  →  fast mode forced to Opus 4.6
NEW (06/01+):      /model claude-opus-4-6[1m]                 →  sets mainLoopModel to 4.6 (an eligible model)
                   /fast on                                   →  isFastModeEligibleModel(4.6)=true, so setFastModeSetting
                                                                  keeps 4.6 (no auto-switch to 4.8) and ships speed:"fast"
                                                                  → Cx1 (6x) pricing on 4.6
```

Because `isFastModeEligibleModel` already accepts `opus-4-6`, explicitly selecting `claude-opus-4-6[1m]` and then enabling fast mode reproduces the override's behavior without the env var: `setFastModeSetting` sees `isFastModeEligibleModel(mainLoopModel) === true` and does **not** override the user's model choice, while `resolveModelCost` routes 4.6 + `speed:"fast"` into `selectFastModePricing` → `Cx1`. The override existed only because, before the eligibility set widened to 4-6/4-7/4-8, there was no way to pin fast mode to an older Opus; now the regular `/model` + `/fast` flow covers it.

**Why deprecate now?** The override predates the 4.7/4.8 expansion. Once fast mode became selectable per-model via the eligibility set, the env-var pin became redundant *and* confusing (it silently downgraded label/model/pricing). Removing it forces the explicit, discoverable `/model … then /fast on` path.

---

## 5. The env-prompt fast-mode sentence

When fast mode is enabled, the system-prompt **Environment** block gains a sentence describing it (appended in two prompt builders — the main env block and the model-banner block):

```javascript
// ============================================
// Env-prompt fast-mode sentence
// Location: cli_inner_pretty.js:555740-555742 (also 555755-555757)
// ============================================

// ORIGINAL (for source lookup):
$ ? null
  : "Fast mode for Claude Code uses Claude Opus with faster output (it does not downgrade to a smaller model). It can be toggled with /fast and is available on Opus 4.8/4.7/4.6.",

// READABLE (for understanding):
fastModeDisabled
  ? null
  : "Fast mode for Claude Code uses Claude Opus with faster output (it does not downgrade to a smaller model). "
    + "It can be toggled with /fast and is available on Opus 4.8/4.7/4.6.",

// Mapping: $→fastModeDisabled (the gate that nulls the sentence out)
```

The sentence is included unless `$` (a "fast mode unavailable" gate, derived from the availability chain in §2) is truthy. It explicitly clarifies the common misconception — fast mode is **not** model downgrade to a cheaper/smaller model (like the small-fast Haiku used for background tasks); it is the *same* Opus served at a faster speed tier. The model list **"Opus 4.8/4.7/4.6"** mirrors the eligibility set of `isFastModeEligibleModel`. This is **NEW post-2.1.88** (no precursor sentence in the 2.1.88 prompt builders).

---

## 6. Companion 2.1.156 hotfix: thinking-signature stripping

The 2.1.156 release is primarily a hotfix: *"Fixed an issue when using Opus 4.8 where thinking blocks were modified, leading to API errors."* It is in-scope here because it lives on the same Opus 4.8 request path and is what makes fast mode robust against signed-thinking-block rejections.

### How it works

When the API returns a 400 indicating a thinking-block signature was modified/invalid, `isThinkingSignatureError` (`B87`) recognizes it and the query loop retries after stripping the offending blocks via `stripSignedThinkingBlocks` (`cG4`):

```javascript
// ============================================
// isThinkingSignatureError - 400 matcher for modified/invalid thinking-block signatures
// Location: cli_inner_pretty.js:186575-186583
// ============================================

// ORIGINAL (for source lookup):
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}

// READABLE (for understanding):
function isThinkingSignatureError(err) {
  if (!(err instanceof ApiError) || err.status !== 400) return false;
  let msg = err.message.toLowerCase();
  if (msg.includes("signature in thinking block")) return true;
  return (
    (msg.includes("thinking block") || msg.includes("`thinking`") || msg.includes("redacted_thinking")) &&
    (msg.includes("cannot be modified") || msg.includes("invalid signature"))
  );
}

// Mapping: B87→isThinkingSignatureError, H→err, rq→ApiError, $→msg
```

The retry handler (cli_inner_pretty.js:557413-557427) calls `cG4(b)` to drop every block where `isSignedThinkingBlock` (`gG4`, cli_inner_pretty.js:446086-446090 — `type === "redacted_thinking"`, or `type === "thinking"` with a non-empty `signature`) is true. If stripping changed the message list, it retries with `"retry:thinking-signature-strip"` and emits `tengu_thinking_signature_strip_retry`. `cG4` is careful not to leave an assistant turn empty: if all content was removed it inserts a `{ type: "text", text: "[Thinking removed]" }` placeholder (cli_inner_pretty.js:446246-446248).

There is a related cross-model variant `stripCrossModelThinkingBlocks` (`dG4`, cli_inner_pretty.js:446235-446236) built on the generic `filterSignedThinkingBlocks` (`HF6`), which strips signed thinking blocks from *other* models' turns (signatures are not portable across models), and `filterTrailingThinkingBlocks` (`pQ_`, cli_inner_pretty.js:446091-446110) which trims trailing thinking blocks. The thinking-type-mismatch sibling `matchThinkingTypeError` (`p87`, cli_inner_pretty.js:186584-186590) handles the adjacent `thinking.type=enabled/adaptive not supported` 400 via the `"retry:thinking-type"` path.

**Key insight:** Signed thinking blocks are cryptographically bound to the request that produced them; once a block is replayed in a context the server considers modified (e.g., after compaction reorders content, or when an Opus 4.8 turn is resent), the server rejects the whole request. Rather than failing the turn, the loop *degrades gracefully* — it removes the un-replayable signed reasoning and retries with the visible content intact. This is **NEW post-2.1.88** (no thinking-signature error matcher exists in the 2.1.88 source).

---

## Cross-validation summary

| Area | 2.1.88 precursor | 2.1.156 status | Confidence |
|------|------------------|----------------|------------|
| Availability cascade (`I9`/`Ne`/`jZ`/`m76`/`yx1`) | `src/utils/fastMode.ts:38-176` — near-1:1 | Restructured (provider check moved into `I9`); reason drift | high |
| `extra_usage_disabled` message | "extra usage billing · /extra-usage" | "usage credits · /usage-credits" | high (drift) |
| Eligibility set (`Wj`) | `opus-4-6` only | `opus-4-6/4-7/4-8` + override-narrowing | high (NEW expansion) |
| Override (`ki`/`uB`/`mUH`) | none — hard-coded "Opus 4.6"/"opus" | env-var override trio, **deprecated 06/01** | NEW post-2.1.88 |
| 4.8 fast pricing (`bx1`, 2x) | none — only standard + one fast table | `bx1` (2x) vs `Cx1` (6x), selected by `S0H` | NEW post-2.1.88 |
| `/fast` command + `speed:"fast"` body | per-session flag existed | full slash command + beta `fast-mode-2026-02-01` | NEW/expanded |
| Thinking-signature strip (`B87`/`cG4`) | none | 2.1.156 hotfix retry path | NEW post-2.1.88 |

(2.1.88 has no `src/constants/models*` fast-pricing tables matching `bx1`/`Cx1`, confirming the dual-tier fast pricing is new in this window.)
