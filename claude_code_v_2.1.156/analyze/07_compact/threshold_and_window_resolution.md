# Threshold ladder & context-window resolution

## Overview

v2.1.156's compaction "decide when to summarize" logic is split into three layers that were a single flat file (`autoCompact.ts`) in v2.1.88:

1. **Window resolution** — `getAutoCompactWindow` (`Xl`, cli_inner_pretty.js:423915) picks the *context-window size* from 4 prioritized sources, then `getEffectiveContextWindowSize` (`_qH`, cli_inner_pretty.js:423938) subtracts an output reserve.
2. **Threshold ladder** — `getAutoCompactThreshold` (`Jv$`, cli_inner_pretty.js:423864), `precomputeThreshold` (`YX4`, cli_inner_pretty.js:423870), and `calculateTokenWarningState` (`fX4`, cli_inner_pretty.js:423873) derive 4 numeric gates from the effective window.
3. **Level dispatch** — `fX4` returns a single `{level, pctLeft}` enum that the loop predicate (`eb_`, cli_inner_pretty.js:423991; `tv7`, cli_inner_pretty.js:423976) and the UI consume.

Where this plugs into the agent loop: before each turn the dispatcher `autoCompactIfNeeded` (`DX4`, cli_inner_pretty.js:424002) calls `shouldAutoCompact` (`eb_`), which counts the current message tokens, asks the level dispatcher what state we are in, and — if the level is `compact` or `blocked` — triggers the compaction summary path. The same effective window simultaneously drives 4 different thresholds, 3 GrowthBook experiment gates branch the math, and 6 environment variables override at different layers. This is genuinely the most intricate piece of the subsystem; every value is traced below and the section closes with two complete numeric examples.

---

### The 4-source window resolver — `getAutoCompactWindow` (`Xl`, cli_inner_pretty.js:423915)

**What it does:** Resolves the raw context-window token count (NOT yet the threshold) that all downstream math is built on, choosing between an env var, a saved setting, an Opus-4.8 experiment value, and the model's auto default — and returns `{window, configured, source}` so the UI can explain *which* source won.

**How it works (in precedence order):**
1. `q = O7(H)` normalizes the model id (`canonicalName`); `K = Ov(H, o2())` computes the model's *hard cap* context window (the ceiling everything is `Math.min`-ed against). `o2()` supplies the active SDK betas (cli_inner_pretty.js:423916-423917).
2. **Source 1 — env (`CLAUDE_CODE_AUTO_COMPACT_WINDOW`)**: if set, run it through `n$H` (the shared env validator, cli_inner_pretty.js:220968) with bounds `[zc6=1e5, jX4=1e6]`. If `status !== "invalid"`, take `f = max(1e5, Y.effective)`, and return `{window: min(K, f), configured: f, source: "env"}`. `n$H` caps valid values at 1e6 and substitutes the 1e5 default for absent/invalid inputs, but does NOT floor a valid small value; `Xl` re-floors any valid sub-1e5 value defensively with `Math.max(zc6, Y.effective)` (cli_inner_pretty.js:423918-423923).
3. **Source 2 — settings**: if the `$` arg (the saved `autoCompactWindow` setting, an already-parsed number) is defined, return `{window: min(K, $), configured: $, source: "settings"}` (cli_inner_pretty.js:423925).
4. **Source 3 — experiment (`wX4`, cli_inner_pretty.js:423906)**: Opus-4.8-only. Returns a number iff `J0()` (autocompact enabled) AND `!R6()` (interactive) AND model is exactly `claude-opus-4-8` AND GrowthBook `tengu_amber_redwood2` returns a parseable window string. If so → `{window: min(K, _), configured: _, source: "experiment"}` (cli_inner_pretty.js:423926-423927).
5. **Source 4 — auto (model default)**: `A = (J0() ? ob_[q] : void 0) ?? K`. `ob_` (cli_inner_pretty.js:424154) is the per-model auto-window table — **and in this build it is initialized to an empty object `{}`** (cli_inner_pretty.js:424154), so `ob_[q]` is always `undefined` and `A` falls back to `K` (the model hard cap). Return `{window: min(K, A), configured: A, source: "auto"}` (cli_inner_pretty.js:423928-423929).

**Edge cases:**
- The settings source does NOT re-validate bounds — it trusts that the `/config` setter already validated via `parseWindowString` (`Ac6`) before persisting.
- Every branch `Math.min`s against `K`, so the configured value can exceed the model cap but the *effective* `window` never does. `configured > window` is exactly the "capped to … by model" UI condition.

**Why this approach:** A single `{window, configured, source}` struct lets the `/config` UI render *why* a window was chosen and whether a higher-priority override is masking the user's setting — impossible with v2.1.88's bare `getContextWindowForModel` that returned just a number. The `configured` vs `window` split preserves the user's intent ("I asked for 500k") separately from the enforced reality ("but your model caps at 200k").

**Key insight:** The empty `ob_={}` table means the "auto" source is currently a *pure pass-through to the model hard cap* — there is no per-model tuning baked in yet. The whole `J0() ? ob_[q] : void 0` machinery is scaffolding for future per-model auto windows; today it is inert.

```javascript
// ============================================
// getAutoCompactWindow - 4-source window resolver (env > settings > experiment > auto)
// Location: cli_inner_pretty.js:423915-423930
// ============================================

// ORIGINAL (for source lookup):
function Xl(H, $) {
  let q = O7(H),
    K = Ov(H, o2());
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    let Y = n$H("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, zc6, jX4);
    if (Y.status !== "invalid") {
      let f = Math.max(zc6, Y.effective);
      return { window: Math.min(K, f), configured: f, source: "env" };
    }
  }
  if ($ !== void 0) return { window: Math.min(K, $), configured: $, source: "settings" };
  let _ = wX4(q);
  if (_ !== void 0) return { window: Math.min(K, _), configured: _, source: "experiment" };
  let A = (J0() ? ob_[q] : void 0) ?? K;
  return { window: Math.min(K, A), configured: A, source: "auto" };
}

// READABLE (for understanding):
function getAutoCompactWindow(model, settingsWindow) {
  const canonical = getCanonicalModelName(model);
  const hardCap = getContextWindowForModel(model, getSdkBetas()); // Ov
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    // n$H statuses are "valid" | "invalid" | "capped"; absent->default is "valid"
    const v = validateEnvInt("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, 100_000, 1_000_000);
    if (v.status !== "invalid") {
      const eff = Math.max(100_000, v.effective);
      return { window: Math.min(hardCap, eff), configured: eff, source: "env" };
    }
  }
  if (settingsWindow !== undefined) return { window: Math.min(hardCap, settingsWindow), configured: settingsWindow, source: "settings" };
  const expWindow = opus48ExperimentWindow(canonical); // wX4 / tengu_amber_redwood2
  if (expWindow !== undefined) return { window: Math.min(hardCap, expWindow), configured: expWindow, source: "experiment" };
  const auto = (isAutoCompactEnabled() ? AUTO_WINDOW_TABLE[canonical] : undefined) ?? hardCap; // table is {} -> always hardCap
  return { window: Math.min(hardCap, auto), configured: auto, source: "auto" };
}

// Mapping: Xl->getAutoCompactWindow, H->model, $->settingsWindow, q->canonical, K->hardCap, Ov->getContextWindowForModel, o2->getSdkBetas, n$H->validateEnvInt, zc6->100000, jX4->1000000, wX4->opus48ExperimentWindow, ob_->AUTO_WINDOW_TABLE(empty {}), J0->isAutoCompactEnabled
```

#### The model hard-cap — `getContextWindowForModel` (`Ov`, cli_inner_pretty.js:130165)

`Ov` (= v2.1.88 `getContextWindowForModel`) resolves the ceiling `K`:
1. **`DISABLE_COMPACT` + `CLAUDE_CODE_MAX_CONTEXT_TOKENS`** (cli_inner_pretty.js:130166-130169): if compaction is disabled AND this env var parses to `>0`, return it verbatim. This is the *only* way `MAX_CONTEXT_TOKENS` enters window math, and it short-circuits everything below.
2. `DZ(H)` — `[1m]` model-id suffix → `1e6` (cli_inner_pretty.js:130170).
3. betas include the 1M header AND `pB(H)` (model is 1M-capable) → `1e6` (cli_inner_pretty.js:130171).
4. `Se(H)` — Opus-4.7/4.8 on first-party/AWS/mantle → `1e6` (cli_inner_pretty.js:130172).
5. `OH8(H)` — a Sonnet-4-6 "kelp_forest" client-data override (cli_inner_pretty.js:130173-130174).
6. else `P36 = 200000` (cli_inner_pretty.js:130175, definition at cli_inner_pretty.js:130223).

**Divergence from v2.1.88:** v2.1.88 gated `MAX_CONTEXT_TOKENS` behind `USER_TYPE === 'ant'` (`src/utils/context.ts:51-67`, the `ant`-only override at 59-67); v2.1.156 gates it behind `DISABLE_COMPACT` being truthy instead (cli_inner_pretty.js:130166). v2.1.88's `[1m]` detection used `has1mContext`; here it is `DZ`'s regex `/\[1m\]/i` (`DZ`, cli_inner_pretty.js:130132). The `Se`/`OH8`/`pB` model-family branches are post-2.1.88 additions for the Opus-4.7/4.8 + Sonnet-4-6 generation.

#### The string parser — `parseWindowString` (`Ac6`, cli_inner_pretty.js:423889)

**What it does:** Parses a user-typed window string (`"auto"`, `"500k"`, `"1m"`, `"200000"`, or shorthand `"200"`) into a clamped integer token count or `undefined`.

**How it works:**
1. Lowercase + trim. `"auto"` → `"auto"` sentinel (cli_inner_pretty.js:423891).
2. `…m` suffix → `parseFloat × 1e6`; `…k` suffix → `parseFloat × 1000` (cli_inner_pretty.js:423893-423894).
3. Bare integer: `parseInt`; if `100 ≤ n ≤ 1000` treat as **shorthand thousands** (`n × 1000`), else literal (cli_inner_pretty.js:423896-423897). So `"200"` → 200000, `"200000"` → 200000 too, and `"50"` → 50 (which then fails the clamp).
4. Clamp: reject if not finite or `< zc6 (1e5)` or `> jX4 (1e6)` → `undefined` (cli_inner_pretty.js:423899). Else `round` (cli_inner_pretty.js:423900).

**Why this approach:** The `100..1000`-as-thousands shorthand lets `/autocompact 200` mean 200k while keeping `200000` working, because no legal raw window is in `[100,1000]` tokens anyway (the floor is 100k).

**Key insight:** The shorthand band is exactly the gap below the 100k floor, so it can never collide with a literal legal value — the parser is unambiguous by construction.

---

### Effective window — `getEffectiveContextWindowSize` (`_qH`, cli_inner_pretty.js:423938)

**What it does:** `effectiveWindow = resolvedWindow − min(maxOutputTokens(model), MX4=20000)`.

**How it works:**
1. `q = min(E5H(H), MX4)` — `E5H` (cli_inner_pretty.js:558279) is `getMaxOutputTokensForModel` (model default/upper clamped by `CLAUDE_CODE_MAX_OUTPUT_TOKENS`); `MX4=20000` (cli_inner_pretty.js:424124) is the summary output reserve.
2. `K = J0() ? $ : void 0` — only pass the settings window through to `Xl` *if autocompact is enabled*; otherwise force the "auto" source.
3. `{window: _} = Xl(H, K)`; return `_ − q`.

**Why subtract the output reserve:** The compaction summary itself consumes output tokens; reserving `min(maxOut, 20000)` guarantees the model can emit a full summary (v2.1.88 comment: "Based on p99.99 of compact summary output being 17,387 tokens") without the summary request itself overflowing.

**Variant `getEffectiveContextWindowSizeRaw` (`sb_`, cli_inner_pretty.js:423944):** identical formula but uses `Ov(H, o2())` (the raw hard cap) directly instead of `Xl` — i.e. effective window ignoring env/settings/experiment overrides. Used as the **blocking-limit base** in `WRH` (cli_inner_pretty.js:423971) so that the hard "you cannot send" limit tracks the *true* model cap, not a user-shrunk autocompact window.

```javascript
// ============================================
// getEffectiveContextWindowSize - resolvedWindow minus output reserve
// Location: cli_inner_pretty.js:423938-423943
// ============================================

// ORIGINAL (for source lookup):
function _qH(H, $) {
  let q = Math.min(E5H(H), MX4),
    K = J0() ? $ : void 0,
    { window: _ } = Xl(H, K);
  return _ - q;
}

// READABLE (for understanding):
function getEffectiveContextWindowSize(model, settingsWindow) {
  const reserve = Math.min(getMaxOutputTokensForModel(model), MAX_OUTPUT_TOKENS_FOR_SUMMARY); // 20000
  const effSettings = isAutoCompactEnabled() ? settingsWindow : undefined; // ignore settings if autocompact off
  const { window } = getAutoCompactWindow(model, effSettings);
  return window - reserve;
}

// Mapping: _qH->getEffectiveContextWindowSize, H->model, $->settingsWindow, E5H->getMaxOutputTokensForModel, MX4->MAX_OUTPUT_TOKENS_FOR_SUMMARY(20000), J0->isAutoCompactEnabled, Xl->getAutoCompactWindow
```

---

### The buffer ladder

All four gates derive from the effective window via constant subtraction. From highest token-usage trigger (latest) to lowest (earliest):

| Gate | Formula | Source | Constant |
|------|---------|--------|----------|
| **blocked** | `blockingBase − 3000` (or `BLOCKING_LIMIT_OVERRIDE`) | `fX4`, cli_inner_pretty.js:423877-423878 | `AX4=3000` |
| **compact (autocompact)** | `effectiveWindow − 13000` (or `floor(eff·PCT/100)`) | `Jv$`, cli_inner_pretty.js:423864 | `zX4=13000` |
| **precompute** | `min(eff − round(eff·0.2), autocompactThreshold)` | `YX4`, cli_inner_pretty.js:423870 | `qc6=0.2` |
| **warn** | `threshold − 20000` | `fX4`, cli_inner_pretty.js:423876 | inline 20000 |

#### `getAutoCompactThreshold` (`Jv$`, cli_inner_pretty.js:423864)

```
q = H − 13000               // H = effectiveWindow
if testPctOverride in (0,100]:  return min(floor(H·pct/100), q)
return q
```

The `testPctOverride` (from `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`) lets QA force an *earlier* compaction but never a later one — the `min` with `q` caps it. This matches the v2.1.88 `getAutoCompactThreshold` exactly except the env read is now hoisted into `getThresholdOverrides` (`jc6`, cli_inner_pretty.js:423958) and passed as `overrides.testPctOverride`.

```javascript
// ============================================
// getAutoCompactThreshold - effectiveWindow minus 13000, with PCT override floor
// Location: cli_inner_pretty.js:423864-423869
// ============================================

// ORIGINAL (for source lookup):
function Jv$(H, $) {
  let q = H - 13000,
    K = $.testPctOverride;
  if (K !== void 0 && !isNaN(K) && K > 0 && K <= 100) return Math.min(Math.floor(H * (K / 100)), q);
  return q;
}

// READABLE (for understanding):
function getAutoCompactThreshold(effectiveWindow, overrides) {
  const baseThreshold = effectiveWindow - AUTOCOMPACT_BUFFER_TOKENS; // 13000
  const pct = overrides.testPctOverride; // CLAUDE_AUTOCOMPACT_PCT_OVERRIDE
  if (pct !== undefined && !isNaN(pct) && pct > 0 && pct <= 100)
    return Math.min(Math.floor(effectiveWindow * (pct / 100)), baseThreshold); // can only lower
  return baseThreshold;
}

// Mapping: Jv$->getAutoCompactThreshold, H->effectiveWindow, $->overrides, q->baseThreshold, K->pct, 13000->AUTOCOMPACT_BUFFER_TOKENS(zX4)
```

#### `precomputeThreshold` (`YX4`, cli_inner_pretty.js:423870)

```
return min(H − round(H · precomputeBufferFraction), Jv$(H, $))
```

`precomputeBufferFraction` defaults to `qc6=0.2` (so `eff − 20%`) but is overridable by GrowthBook `tengu_amber_rokovoko` (`tb_`, cli_inner_pretty.js:423954), validated to `[0,1)`. The `min` with the autocompact threshold means precompute can only fire *at or before* autocompact. This is a **new v2.1.156 concept** — there is no precompute threshold in v2.1.88. It is consumed by `isAbovePrecomputeOrCompact` (`tv7`, cli_inner_pretty.js:423976) to start work proactively when NOT in the redwood3-reactive / configured-window regime.

```javascript
// ============================================
// precomputeThreshold - proactive-work gate, min-clamped under autocompact threshold
// Location: cli_inner_pretty.js:423870-423872
// ============================================

// ORIGINAL (for source lookup):
function YX4(H, $) {
  return Math.min(H - Math.round(H * $.precomputeBufferFraction), Jv$(H, $));
}

// READABLE (for understanding):
function precomputeThreshold(effectiveWindow, overrides) {
  return Math.min(
    effectiveWindow - Math.round(effectiveWindow * overrides.precomputeBufferFraction), // default 0.2 -> eff-20%
    getAutoCompactThreshold(effectiveWindow, overrides) // never exceed the autocompact gate
  );
}

// Mapping: YX4->precomputeThreshold, H->effectiveWindow, $.precomputeBufferFraction->precomputeBufferFraction(default qc6=0.2 via tb_), Jv$->getAutoCompactThreshold
```

#### `calculateTokenWarningState` (`fX4`, cli_inner_pretty.js:423873) — the level dispatcher

```
fX4(H=tokenUsage, $=effWindow, q=overrides, K=blockingBase=$):
  _ = Jv$($, q)                          // autocompact threshold
  z = q.enabled ? _ : $                  // "threshold": autocompact if enabled, else raw eff window
  A = z − 20000                          // warn threshold
  Y = q.testBlockingOverride
  f = (Y>0) ? Y : K − 3000               // blocking limit
  O = max(0, round((z−H)/z · 100))       // pctLeft
  if H ≥ f:               return {level:"blocked", pctLeft:O}
  if q.enabled && H ≥ _:  return {level:"compact", pctLeft:O}
  if H ≥ A:               return {level:"warn", pctLeft:O}
  return {level:"ok"}                     // note: no pctLeft on ok
```

The 4th arg `K` (blocking base) defaults to `$` but callers pass `sb_($)` (raw effective window) so blocking uses the *true* model cap even when the autocompact window was shrunk. `pctLeft` is computed against `z` (the autocompact threshold), so "0% left" means "at the autocompact gate", not "at the hard cap". The `ok` level deliberately omits `pctLeft`; only the three non-ok branches include it.

```javascript
// ============================================
// calculateTokenWarningState - collapses v2.1.88's 4 booleans into one ordered enum
// Location: cli_inner_pretty.js:423873-423884
// ============================================

// ORIGINAL (for source lookup):
function fX4(H, $, q, K = $) {
  let _ = Jv$($, q),
    z = q.enabled ? _ : $,
    A = z - 20000,
    Y = q.testBlockingOverride,
    f = Y !== void 0 && !isNaN(Y) && Y > 0 ? Y : K - 3000,
    O = Math.max(0, Math.round(((z - H) / z) * 100));
  if (H >= f) return { level: "blocked", pctLeft: O };
  if (q.enabled && H >= _) return { level: "compact", pctLeft: O };
  if (H >= A) return { level: "warn", pctLeft: O };
  return { level: "ok" };
}

// READABLE (for understanding):
function calculateTokenWarningState(tokenUsage, effectiveWindow, overrides, blockingBase = effectiveWindow) {
  const autocompactThreshold = getAutoCompactThreshold(effectiveWindow, overrides);
  const threshold = overrides.enabled ? autocompactThreshold : effectiveWindow;
  const warnThreshold = threshold - WARNING_THRESHOLD_BUFFER_TOKENS; // 20000
  const blkOverride = overrides.testBlockingOverride; // CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE
  const blockingLimit = (blkOverride !== undefined && !isNaN(blkOverride) && blkOverride > 0)
    ? blkOverride : blockingBase - MANUAL_COMPACT_BUFFER_TOKENS; // 3000
  const pctLeft = Math.max(0, Math.round(((threshold - tokenUsage) / threshold) * 100)); // vs threshold, not hard cap
  if (tokenUsage >= blockingLimit) return { level: "blocked", pctLeft };
  if (overrides.enabled && tokenUsage >= autocompactThreshold) return { level: "compact", pctLeft };
  if (tokenUsage >= warnThreshold) return { level: "warn", pctLeft };
  return { level: "ok" }; // no pctLeft on ok
}

// Mapping: fX4->calculateTokenWarningState, H->tokenUsage, $->effectiveWindow, q->overrides, K->blockingBase, _->autocompactThreshold, z->threshold, A->warnThreshold, Y->testBlockingOverride, f->blockingLimit, O->pctLeft, 20000->WARNING_THRESHOLD_BUFFER_TOKENS, 3000->MANUAL_COMPACT_BUFFER_TOKENS(AX4)
```

---

### The level enum and what each triggers

`fX4` returns exactly one of four levels. Consumers:

- **`ok`** → no action. (Only level with no `pctLeft`.)
- **`warn`** (`tokenUsage ≥ threshold − 20000`) → UI warning banner. The 80%-style "Autocompact is disabled" nudge is gated separately by `gE4=80` (cli_inner_pretty.js:467444) inside `go_` (cli_inner_pretty.js:467432), which surfaces the exact title **"Autocompact is disabled"** (cli_inner_pretty.js:467436) only when autocompact is off and `percentage >= 50 && percentage < 80`.
- **`compact`** (autocompact enabled AND `tokenUsage ≥ autocompactThreshold`) → the loop fires compaction. `shouldAutoCompact` (`eb_`, cli_inner_pretty.js:423991) returns `true` exactly when `level === "compact" || level === "blocked"` (cli_inner_pretty.js:423999), driving `autoCompactIfNeeded` (`DX4`, cli_inner_pretty.js:424002).
- **`blocked`** (`tokenUsage ≥ blockingBase − 3000`) → hard limit; manual `/compact` still blocks the send. Also counted as a compaction trigger by `eb_` (so blocked sessions still attempt autocompact).

`calculateTokenWarningStatePublic` (`WRH`, cli_inner_pretty.js:423971) is the public wrapper: it reads overrides via `jc6`, computes `_qH($, enabled ? q : undefined)` as the effective window, and passes `sb_($)` as the blocking base.

**Loop integration (`eb_`, cli_inner_pretty.js:423991):** Recursion guard `K === "compact"` → `false` (cli_inner_pretty.js:423992). `!J0()` → `false` (cli_inner_pretty.js:423993). `_JH() && !Pc() && !EH$($, q)` → `false` (cli_inner_pretty.js:423994): i.e. when local (NOT `CLAUDE_CODE_REMOTE`), NOT redwood3-reactive, and NOT a configured (env/settings) window, proactive autocompact is **suppressed** (the reactive path owns it). Then `z = jJ(H, …) − snipFreed` (token count), `A = WRH(z, $, q)`, return `A.level ∈ {compact, blocked}`.

`DX4` adds two circuit breakers on top: `consecutiveFailures ≥ _c6=3` (cli_inner_pretty.js:424004) and the **rapid-refill breaker** `computeConsecutiveRapidRefills` (`fc6`, cli_inner_pretty.js:423948) — if the context refilled to the limit within `< Yc6=3` turns, `Y08=3` times in a row, it trips (cli_inner_pretty.js:424009) and emits the thrash message.

```javascript
// ============================================
// shouldAutoCompact - loop predicate; true when level is compact|blocked
// Location: cli_inner_pretty.js:423991-424001
// ============================================

// ORIGINAL (for source lookup):
async function eb_(H, $, q, K, _ = 0) {
  if (K === "compact") return !1;
  if (!J0()) return !1;
  if (_JH() && !Pc() && !EH$($, q)) return !1;
  let z = jJ(H, xG($)) - _,
    A = WRH(z, $, q);
  return (
    N(`autocompact: tokens=${z} level=${A.level} effectiveWindow=${_qH($, q)}`),
    A.level === "compact" || A.level === "blocked"
  );
}

// READABLE (for understanding):
async function shouldAutoCompact(messages, model, settingsWindow, querySource, snipTokensFreed = 0) {
  if (querySource === "compact") return false; // recursion guard
  if (!isAutoCompactEnabled()) return false;
  // local && not redwood3-reactive && not a configured (env/settings) window -> reactive path owns it
  if (isLocal() && !redwood3Reactive() && !isConfiguredWindow(model, settingsWindow)) return false;
  const tokenCount = countTokens(messages, effortFor(model)) - snipTokensFreed;
  const state = calculateTokenWarningStatePublic(tokenCount, model, settingsWindow);
  logForDebugging(`autocompact: tokens=${tokenCount} level=${state.level} effectiveWindow=${getEffectiveContextWindowSize(model, settingsWindow)}`);
  return state.level === "compact" || state.level === "blocked";
}

// Mapping: eb_->shouldAutoCompact, H->messages, $->model, q->settingsWindow, K->querySource, _->snipTokensFreed, _JH->isLocal(=!CLAUDE_CODE_REMOTE), Pc->redwood3Reactive, EH$->isConfiguredWindow(env|settings), jJ->countTokens, WRH->calculateTokenWarningStatePublic, _qH->getEffectiveContextWindowSize
```

---

### All env overrides + precedence

| Env var | Read at | Effect | Precedence note |
|---------|---------|--------|-----------------|
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | `Xl`, cli_inner_pretty.js:423918 | sets resolved window, source="env" | **highest** window source; clamped 1e5..1e6 via `n$H` |
| `autoCompactWindow` setting | `Xl`, cli_inner_pretty.js:423925 | source="settings" | beaten by env |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | `jc6`→`Jv$`, cli_inner_pretty.js:423959 | forces earlier autocompact (`floor(eff·pct/100)`, capped by eff−13k) | only lowers threshold |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | `jc6`→`fX4`, cli_inner_pretty.js:423960 | overrides blocking limit if `>0` | replaces blockingBase−3k |
| `CLAUDE_CODE_COLD_COMPACT` | `Mc6`, cli_inner_pretty.js:423951 | passed into the cold-compact summary path | independent of thresholds |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | `Ov`, cli_inner_pretty.js:130166 | sets hard-cap window, but **only when `DISABLE_COMPACT` truthy** | gated by DISABLE_COMPACT |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | `E5H`, cli_inner_pretty.js:558281 | changes maxOut → changes the `min(maxOut, 20k)` reserve | only matters if maxOut < 20k |
| `DISABLE_COMPACT` | `J0`, cli_inner_pretty.js:423984; `DX4`, cli_inner_pretty.js:424003 | disables ALL compaction; also unlocks `MAX_CONTEXT_TOKENS` in `Ov` | master kill-switch |
| `DISABLE_AUTO_COMPACT` | `J0`, cli_inner_pretty.js:423985 | disables only autocompact (manual `/compact` survives) | |

`isAutoCompactEnabled` (`J0`, cli_inner_pretty.js:423983): `false` if `DISABLE_COMPACT` or `DISABLE_AUTO_COMPACT` truthy, else the `autoCompactEnabled` config value (default `true`). Matches v2.1.88 exactly.

```javascript
// ============================================
// getThresholdOverrides + getPrecomputeBufferFraction - env + experiment override bundle
// Location: cli_inner_pretty.js:423954-423966
// ============================================

// ORIGINAL (for source lookup):
function tb_() {
  let H = V$("tengu_amber_rokovoko", qc6);
  return typeof H === "number" && Number.isFinite(H) && H >= 0 && H < 1 ? H : qc6;
}
function jc6() {
  let H = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE,
    $ = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  return {
    enabled: J0(),
    precomputeBufferFraction: tb_(),
    testPctOverride: H ? parseFloat(H) : void 0,
    testBlockingOverride: $ ? parseInt($, 10) : void 0,
  };
}

// READABLE (for understanding):
function getPrecomputeBufferFraction() {
  const f = getFeatureValue("tengu_amber_rokovoko", 0.2); // GrowthBook override
  return (typeof f === "number" && Number.isFinite(f) && f >= 0 && f < 1) ? f : 0.2; // validate [0,1)
}
function getThresholdOverrides() {
  const pct = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  const blk = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  return {
    enabled: isAutoCompactEnabled(),
    precomputeBufferFraction: getPrecomputeBufferFraction(),
    testPctOverride: pct ? parseFloat(pct) : undefined,
    testBlockingOverride: blk ? parseInt(blk, 10) : undefined,
  };
}

// Mapping: tb_->getPrecomputeBufferFraction, jc6->getThresholdOverrides, V$->getFeatureValue, qc6->0.2, J0->isAutoCompactEnabled
```

---

### The three experiment gates

1. **`tengu_amber_redwood2`** (`wX4`, cli_inner_pretty.js:423906): Opus-4.8-only autocompact *window* override (a token-count string parsed by `Ac6`). Source="experiment". Requires `J0() && !R6() && model === "claude-opus-4-8"`.
2. **`tengu_amber_redwood3`** (`Pc`, cli_inner_pretty.js:423902): a boolean reactive-mode gate. `false` if `R6()` (non-interactive). When true, proactive autocompact is allowed even for auto windows (it flips the `!Pc()` suppression in `eb_`, cli_inner_pretty.js:423994, and the precompute-vs-autocompact choice in `tv7`, cli_inner_pretty.js:423980).
3. **`tengu_amber_rokovoko`** (`tb_`, cli_inner_pretty.js:423954): numeric `precomputeBufferFraction`, default `qc6=0.2`, validated to `[0,1)`. Feeds `YX4`'s precompute math.

All three are **post-2.1.88** — none exist in the v2.1.88 `autoCompact.ts`.

```javascript
// ============================================
// opus48ExperimentWindow - Opus-4.8-only window override via tengu_amber_redwood2
// Location: cli_inner_pretty.js:423906-423914
// ============================================

// ORIGINAL (for source lookup):
function wX4(H) {
  if (!J0()) return;
  if (R6()) return;
  if (H !== "claude-opus-4-8") return;
  let $ = V$("tengu_amber_redwood2", "");
  if (!$) return;
  let q = Ac6($);
  return typeof q === "number" ? q : void 0;
}

// READABLE (for understanding):
function opus48ExperimentWindow(canonicalModel) {
  if (!isAutoCompactEnabled()) return undefined;
  if (isNonInteractive()) return undefined; // experiment is interactive-only
  if (canonicalModel !== "claude-opus-4-8") return undefined;
  const flag = getFeatureValue("tengu_amber_redwood2", "");
  if (!flag) return undefined;
  const parsed = parseWindowString(flag); // Ac6
  return typeof parsed === "number" ? parsed : undefined;
}

// Mapping: wX4->opus48ExperimentWindow, H->canonicalModel, J0->isAutoCompactEnabled, R6->isNonInteractive, V$->getFeatureValue, Ac6->parseWindowString
```

---

## Worked numeric examples

Assume default config (autocompact enabled, no env overrides, no experiments → `precomputeBufferFraction=0.2`).

### 200k model (e.g. Sonnet-4-5, `Ov`→`P36=200000`, maxOut=32000)
- resolvedWindow `Xl` → 200000 (auto; `ob_` empty so falls to cap)
- reserve = `min(32000, 20000)` = 20000
- **effectiveWindow** `_qH` = 200000 − 20000 = **180000**
- **autocompactThreshold** `Jv$` = 180000 − 13000 = **167000**
- **precomputeThreshold** `YX4` = min(180000 − round(180000·0.2), 167000) = min(180000 − 36000, 167000) = min(144000, 167000) = **144000**
- **warn** = threshold(167000) − 20000 = **147000**
- **blocked** = `blockingBase − 3000` where blockingBase via `sb_` = 200000 − 20000 = 180000 → 180000 − 3000 = **177000**
- `pctLeft` at tokenUsage=150000 = round((167000 − 150000)/167000·100) = **10%**
- Ladder by rising usage: ok < 144000 (precompute / work-start) ; warn ≥ 147000 ; compact ≥ 167000 ; blocked ≥ 177000.

### 1M model (e.g. Opus-4.8 `[1m]` / first-party, `Ov`→1e6, maxOut=64000)
- resolvedWindow `Xl` → 1000000
- reserve = `min(64000, 20000)` = 20000
- **effectiveWindow** = 1000000 − 20000 = **980000**
- **autocompactThreshold** = 980000 − 13000 = **967000**
- **precomputeThreshold** = min(980000 − round(980000·0.2), 967000) = min(980000 − 196000, 967000) = min(784000, 967000) = **784000**
- **warn** = 967000 − 20000 = **947000**
- **blocked** = (`sb_` blockingBase 980000) − 3000 = **977000**

Note the blocking base uses `sb_` (raw cap − reserve = 980000), so blocked = 977000, which sits *above* the autocompact threshold 967000 — exactly the intent: autocompact fires first; blocking is the safety net.

---

## Why a single level enum (the big refactor)

v2.1.88's `calculateTokenWarningState` returned **five fields**: `{percentLeft, isAboveWarningThreshold, isAboveErrorThreshold, isAboveAutoCompactThreshold, isAtBlockingLimit}` — four independent booleans plus a percent. v2.1.156's `fX4` collapses these into one `{level, pctLeft}` with an *ordered* enum (`blocked > compact > warn > ok`).

**Why:** the v2.1.88 booleans were not mutually exclusive (you could be above-warning AND above-autocompact AND at-blocking simultaneously), forcing every caller to re-implement the priority order ("if blocking … else if autocompact … else if warning"). Centralizing the priority into one enum eliminates that duplicated branching and folds the `isAboveErrorThreshold`/`isAboveWarningThreshold` pair (which used identical 20000 buffers in 2.1.88 — `WARNING_THRESHOLD_BUFFER_TOKENS == ERROR_THRESHOLD_BUFFER_TOKENS == 20000`) into a single `warn`. The redundant "error" level is *gone* in 2.1.156.

---

## Cross-validation against v2.1.88

**Matched exactly:**
- **`getAutoCompactThreshold` core formula** `effectiveWindow − 13000` with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` producing `min(floor(eff·pct/100), base)`: `Jv$` (cli_inner_pretty.js:423864-423869) is line-for-line the v2.1.88 `getAutoCompactThreshold` (`autoCompact.ts:72-91`); the only difference is the env read is hoisted into `jc6` and passed as `overrides.testPctOverride`.
- **`getEffectiveContextWindowSize` formula** `window − min(maxOutputTokens, 20000)`: `_qH` (cli_inner_pretty.js:423938-423943) matches `autoCompact.ts:33-49` (`MAX_OUTPUT_TOKENS_FOR_SUMMARY == MX4 == 20000`).
- **Buffer constants** all confirmed identical: 13000 (`AUTOCOMPACT_BUFFER_TOKENS == zX4`), 20000 warn (inline in `fX4`), 3000 manual (`MANUAL_COMPACT_BUFFER_TOKENS == AX4`), `MAX_OUTPUT_TOKENS_FOR_SUMMARY == MX4 == 20000`, `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES == _c6 == 3`, default window 200000 (`P36`).
- **`isAutoCompactEnabled`**: `J0` (cli_inner_pretty.js:423983) matches `autoCompact.ts:147-158` byte-for-byte logic (`DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`, then `config.autoCompactEnabled`).
- **The blocking-limit override** `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` (`parseInt`, `>0`) matches `autoCompact.ts:127-134` → `fX4` (cli_inner_pretty.js:423877-423878).

**Diverged:**
- **Return shape**: v2.1.88 four booleans + `percentLeft` vs v2.1.156 single ordered `{level, pctLeft}`. The v2.1.88 `isAboveErrorThreshold` has NO equivalent in 2.1.156 (merged into `warn`).
- **`pctLeft` base**: v2.1.88 computes `percentLeft` against `threshold` (autocompact threshold when enabled). v2.1.156 also uses `z = threshold` (matches), but `ok` level returns no `pctLeft` at all (v2.1.88 always returned `percentLeft`).
- **Blocking base**: v2.1.88 used `getEffectiveContextWindowSize(model)` directly as `actualContextWindow` for the blocking limit (`autoCompact.ts:122-124`). v2.1.156 passes `sb_(model)` (raw-cap-based effective window, ignoring env/settings overrides) so a user-shrunk autocompact window does not lower the hard blocking limit.
- **`CLAUDE_CODE_MAX_CONTEXT_TOKENS` gating** changed from `USER_TYPE === 'ant'` (v2.1.88 `src/utils/context.ts:51-67`, the `ant`-only override at 59-67) to `DISABLE_COMPACT`-truthy (v2.1.156 `Ov`, cli_inner_pretty.js:130166).

**Post-2.1.88 (no equivalent in the 2.1.88 source):**
- Entire `Xl` 4-source resolver with `{window, configured, source}` and the `settings`/`experiment` sources.
- `precomputeThreshold` (`YX4`), `precomputeBufferFraction` (`qc6`/`tb_`), and `tv7`.
- `Ac6` string parser with `[100,1000]`-as-thousands shorthand and `[1e5,1e6]` clamp (`zc6`/`jX4`).
- All three experiments (redwood2 / redwood3 / rokovoko), `Pc`/`wX4`.
- `CLAUDE_CODE_COLD_COMPACT` (`Mc6`), the rapid-refill thrash breaker (`fc6` with `Yc6=3`, `Y08=3`).
- The `/config` auto-compact-window UI and the `gE4=80` percent gate / `go_` nudge.

Note: the v2.1.88 source available for diffing was `autoCompact.ts` + `src/utils/context.ts`; the absence of the above features in that older threshold/window code is the basis for marking them new. The reactive-compact path and session-memory-first ordering exist in both eras (`autoCompact.ts:288` `trySessionMemoryCompaction`), but the routing-through-reactive based on threshold source (`DX4`, cli_inner_pretty.js:424018+) is a 2.1.156 elaboration that could not be fully diffed.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:
- `getAutoCompactThreshold` (`Jv$`) — cli_inner_pretty.js:423864 — `effectiveWindow − 13000`, with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` lowering it via `floor(eff·pct/100)` capped by base
- `precomputeThreshold` (`YX4`) — cli_inner_pretty.js:423870 — `min(eff − round(eff·precomputeBufferFraction[0.2]), autocompactThreshold)`; proactive-work gate, new in 2.1.156
- `calculateTokenWarningState` (`fX4`) — cli_inner_pretty.js:423873 — returns `{level: ok|warn|compact|blocked, pctLeft}`; warn = threshold − 20000, blocked = blockingBase − 3000; replaces v2.1.88's four booleans
- `parseWindowString` (`Ac6`) — cli_inner_pretty.js:423889 — parses `auto`/Nm/Nk/N strings, `[100,1000]`-as-thousands shorthand, clamp `[1e5,1e6]`, else undefined
- `isRedwood3Reactive` (`Pc`) — cli_inner_pretty.js:423902 — GrowthBook `tengu_amber_redwood3` reactive-mode boolean gate; false if non-interactive
- `opus48ExperimentWindow` (`wX4`) — cli_inner_pretty.js:423906 — Opus-4.8-only window override via `tengu_amber_redwood2` (parsed by `Ac6`); requires enabled + interactive
- `getAutoCompactWindow` (`Xl`) — cli_inner_pretty.js:423915 — 4-source window resolver (env > settings > experiment > auto), returns `{window, configured, source}`
- `isConfiguredWindow` (`EH$`) — cli_inner_pretty.js:423931 — true iff `getAutoCompactWindow` source is `env` or `settings`
- `getAutoCompactWindowSource` (`ab_`) — cli_inner_pretty.js:423935 — returns just the `.source` field from `getAutoCompactWindow`
- `getEffectiveContextWindowSize` (`_qH`) — cli_inner_pretty.js:423938 — `resolvedWindow − min(maxOutputTokens, 20000)`; only passes settings window when autocompact enabled
- `getEffectiveContextWindowSizeRaw` (`sb_`) — cli_inner_pretty.js:423944 — effective window using raw model cap `Ov` (ignores env/settings/experiment); blocking-limit base
- `computeConsecutiveRapidRefills` (`fc6`) — cli_inner_pretty.js:423948 — increments rapid-refill counter if compacted && turnCounter < 3, else resets
- `isColdCompact` (`Mc6`) — cli_inner_pretty.js:423951 — reads `CLAUDE_CODE_COLD_COMPACT` truthiness; cold-compact flag
- `getPrecomputeBufferFraction` (`tb_`) — cli_inner_pretty.js:423954 — `tengu_amber_rokovoko` numeric override, validated `[0,1)`, default 0.2
- `getThresholdOverrides` (`jc6`) — cli_inner_pretty.js:423958 — reads `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` + `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE`; returns `{enabled, precomputeBufferFraction, testPctOverride, testBlockingOverride}`
- `getAutoCompactThresholdForModel` (`DU6`) — cli_inner_pretty.js:423968 — `Jv$(_qH(model, settings), jc6())`; public threshold for telemetry/recompaction
- `calculateTokenWarningStatePublic` (`WRH`) — cli_inner_pretty.js:423971 — public wrapper using raw-cap blocking base `sb_`
- `isAbovePrecomputeOrCompact` (`tv7`) — cli_inner_pretty.js:423976 — true if tokens ≥ (precompute when not redwood3/configured, else autocompact threshold)
- `isAutoCompactEnabled` (`J0`) — cli_inner_pretty.js:423983 — false if `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT` truthy, else `config.autoCompactEnabled`
- `shouldAutoCompact` (`eb_`) — cli_inner_pretty.js:423991 — loop predicate: true when level is compact|blocked; suppresses proactive when local & not redwood3 & not configured
- `autoCompactIfNeeded` (`DX4`) — cli_inner_pretty.js:424002 — autocompact dispatcher with consecutive-failure breaker (`_c6=3`) and rapid-refill breaker (`Y08=3`)
- `autoWindowSpinnerHint` (`Hx_`) — cli_inner_pretty.js:424095 — builds "Compacting at auto window (N tokens)" hint when source is experiment below cap
- `autocompactDisabledNudge` (`go_`) — cli_inner_pretty.js:467432 — pushes the "Autocompact is disabled" info banner when off and 50% ≤ percentage < 80%
- `getContextWindowForModel` (`Ov`) — cli_inner_pretty.js:130165 — model hard-cap window; `MAX_CONTEXT_TOKENS` only honored when `DISABLE_COMPACT` truthy; 1M for `[1m]`/Opus-4.7-4.8 first-party
- `has1mContextSuffix` (`DZ`) — cli_inner_pretty.js:130132 — regex `/\[1m\]/i` model-id detection
- `validateEnvInt` (`n$H`) — cli_inner_pretty.js:220968 — validates env int with default/upper bounds; returns `{effective, status: valid|invalid|capped}`
- `getMaxOutputTokensForModel` (`E5H`) — cli_inner_pretty.js:558279 — model output-token default/upper clamped by `CLAUDE_CODE_MAX_OUTPUT_TOKENS`
- `isNonInteractive` (`R6`) — cli_inner_pretty.js:2742 — returns `!isInteractive`; gates redwood2/redwood3 to interactive sessions
- `isEnvTruthy` (`xH`) — cli_inner_pretty.js:1795 — env truthiness check (1/true/yes/on)

Constants:
- `AUTOCOMPACT_BUFFER_TOKENS` (`zX4`) — cli_inner_pretty.js:423885 — 13000
- `MANUAL_COMPACT_BUFFER_TOKENS` (`AX4`) — cli_inner_pretty.js:423886 — 3000
- `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (`qc6`) — cli_inner_pretty.js:423887 — 0.2
- `MAX_OUTPUT_TOKENS_FOR_SUMMARY` (`MX4`) — cli_inner_pretty.js:424124 — 20000
- `WINDOW_MIN` (`zc6`) — cli_inner_pretty.js:424125 — 1e5 (100k)
- `WINDOW_MAX` (`jX4`) — cli_inner_pretty.js:424126 — 1e6 (1M)
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6`) — cli_inner_pretty.js:424128 — 3
- `RAPID_REFILL_TURN_WINDOW` (`Yc6`) — cli_inner_pretty.js:424129 — 3
- `RAPID_REFILL_BREAKER_COUNT` (`Y08`) — cli_inner_pretty.js:424130 — 3
- `AUTO_WINDOW_TABLE` (`ob_`) — cli_inner_pretty.js:424154 — per-model auto-window override table; empty `{}` so "auto" always falls back to model hard cap
- `MODEL_CONTEXT_WINDOW_DEFAULT` (`P36`) — cli_inner_pretty.js:130223 — 200000
- `MAX_COMPACT_OUTPUT_TOKENS` (`NO$`) — cli_inner_pretty.js:130224 — 20000
- `PERCENT_USED_UI_GATE` (`gE4`) — cli_inner_pretty.js:467444 — 80
