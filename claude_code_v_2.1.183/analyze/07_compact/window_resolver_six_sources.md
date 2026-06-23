# Window resolver: 4 → 6 sources + the precompute arm table (v2.1.156 → v2.1.183)

> **Delta scope.** This document covers **DELTA 3** (the auto-compact context-window resolver `getAutoCompactWindow` grew from 4 prioritized sources to 6) and **DELTA 4a** (the scalar-only precompute buffer fraction grew a full `tengu_amber_moleskin` *arm table*). Both land in the v2.1.156 → v2.1.183 delta tree.
>
> Every citation is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless explicitly labelled **v2.1.156** (before-picture, `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`) or **v2.1.88** (named TypeScript).
>
> The *threshold ladder math itself* (`gwn`/`mqr`/`nBi` formulas, the 13000/3000/0.2/20000/100k/1M constants) is **byte-identical** to v2.1.156 modulo rename and is NOT re-derived here — it is linked to the baseline [`threshold_and_window_resolution.md`](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md). The 1M→200k clamp half of `model-default` (`tH`/`ARr`/`N8e`/`tengu_1m_credits_clamp_activated`) gets a dedicated deep-dive in the sibling doc [`one_million_credits_clamp.md`](./one_million_credits_clamp.md); here we document only how that clamp surfaces *as a window source*.

---

## 0. Why this matters

The auto-compact window resolver is the single function whose return value seeds **the entire threshold ladder**. `getAutoCompactWindow` (obf: `z2`, cli_inner_pretty.js:226875) returns `{window, configured, source}`; `window` flows into `getEffectiveContextWindowSize` (`oee`, :226902) → `getAutoCompactThreshold` (`gwn`, :226818) → `precomputeThreshold` (`mqr`, :226824) → `calculateTokenWarningState` (`nBi`, :226827) → the loop predicate. If the resolver picks the wrong window, *every* downstream gate is off by the same factor. So adding two new sources is not a cosmetic change — it re-prioritizes when (and to what size) every session in the affected model families compacts.

In v2.1.156 the resolver had **four** sources with precedence `env > settings > experiment > auto` (baseline [`threshold_and_window_resolution.md`](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md), the "4-source window resolver" section, v2.1.156 `Xl` @423915). v2.1.183 inserts two new sources into the middle of that chain:

| # | Source | New? | Resolves to | Counted as "configured"? |
|---|--------|------|-------------|--------------------------|
| 1 | `env` (`CLAUDE_CODE_AUTO_COMPACT_WINDOW`) | no | validated env int | yes |
| 2 | `settings` (`autoCompactWindow`) | no | saved setting | yes |
| 3 | **`clientdata`** | **NEW** | server-pushed per-model window (`rowan_thicket`) | **yes (new)** |
| 4 | `experiment` (`tengu_amber_redwood2`) | no | Opus-4.8 experiment string | no |
| 5 | **`model-default`** | **NEW** | `jQ`=200000 clamp for 1M models w/o entitlement | **yes (new)** |
| 6 | `auto` (model hard-cap) | no | `tH(model)` hard cap, `rBi` table pass-through | no |

New precedence: **`env > settings > clientdata > experiment > model-default > auto`**.

---

## 1. The 6-source resolver — `getAutoCompactWindow` (`z2`, cli_inner_pretty.js:226875)

### What it does

Resolves the *raw* context-window token count (NOT the threshold) for a model, choosing between six prioritized sources, and returns `{window, configured, source}` so the `/config` UI can render *which* source won and whether a higher-priority override is masking a user setting. `window` is the enforced value (`Math.min`-ed against the model hard cap); `configured` is what the source *asked for*; `source` is the discriminator string.

### How it works (step-by-step, in precedence order)

1. **Header (:226876-226878).** `n = Bo(e)` canonicalizes the model id (`canonicalModelName`). `r = Wb()` fetches the active SDK betas. `o = tH(e, r)` computes the model's **hard cap** — the ceiling every branch `Math.min`s against. Note `tH` (v2.1.156 `Ov`) is now the *clamped* hard cap: it returns `jQ`=200000 instead of `1e6` when the 1M-credits clamp `ARr` is active (see [`one_million_credits_clamp.md`](./one_million_credits_clamp.md)). So `o` is already 200k for a stuck-1M session before any source even runs.
2. **Source 1 — `env` (:226879-226885).** If `CLAUDE_CODE_AUTO_COMPACT_WINDOW` is set, run it through `yae` (the shared env-int validator, v2.1.156 `n$H`) bounded `[hwn=1e5, hqr=1e6]`. If `status !== "invalid"`, take `u = max(1e5, effective)` and return `{window: min(o, u), configured: u, source: "env"}`. **Unchanged from v2.1.156** except the validator/bound symbols renamed.
3. **Source 2 — `settings` (:226886).** If the `t` arg (the saved `autoCompactWindow` setting, already a parsed number) is defined, return `{window: min(o, t), configured: t, source: "settings"}`. **Unchanged.**
4. **Source 3 — `clientdata` (:226887-226888) — NEW.** `s = ywd(n)` reads a server-pushed per-model window. If `s !== null`, return `{window: min(o, s), configured: s, source: "clientdata"}`. This is the headline insertion: a server-side push can set a per-model window *without* the user touching settings or env, and it outranks the GrowthBook experiment below it.
5. **Source 4 — `experiment` (:226889-226890).** `i = _qr(n)` is the Opus-4.8-only `tengu_amber_redwood2` window. If defined → `source: "experiment"`. **Unchanged** (renamed `wX4`→`_qr`).
6. **Source 5 — `model-default` (:226891) — NEW.** `if (o < 1e6 && (hwd.has(n) || ARr(e, r)))` → return `{window: min(o, jQ), configured: jQ, source: "model-default"}`. Two trigger conditions OR'd:
   - `hwd.has(n)` — the model is in the static clamp Set `{"claude-sonnet-4-6", "claude-opus-4-6"}` (`hwd`, initialized @226982). These families default down to the standard 200k window.
   - `ARr(e, r)` — the **1M-credits clamp** is active (1M model, no `MAX_CONTEXT_TOKENS` override, and `N8e()` "credits blocked" flag set). Detailed in [`one_million_credits_clamp.md`](./one_million_credits_clamp.md).
   The guard `o < 1e6` matters: if `tH` already returned `1e6` (the model genuinely *has* a 1M window and is entitled), `model-default` does **not** fire — you only clamp *down*, never claim 200k for an actual 1M session. But note that when `ARr` is the trigger, `tH` has *already* clamped `o` to 200k upstream (:226878 calls `tH` which returns `jQ`), so `o < 1e6` is trivially true and `configured: jQ` is reported as the chosen window.
7. **Source 6 — `auto` (:226892-226893).** `l = (Kw() && Object.hasOwn(rBi, n) ? rBi[n] : void 0) ?? o`. `rBi` (v2.1.156 `ob_`) is the per-model auto-window table, **still initialized to an empty object `{}`** (@226982), so `rBi[n]` is always absent and `l` falls back to `o` (the hard cap). Return `{window: min(o, l), configured: l, source: "auto"}`. **Unchanged** (table still inert).

### Why this approach (trade-offs / alternatives)

- **Why insert `clientdata` between `settings` and `experiment` rather than at the top?** A server-pushed window should be able to tune *most* sessions, but it must still yield to an explicit user override (env/settings). Placing it at position 3 means: a user who typed `/autocompact 500k` or set the env var keeps their value, but everyone else can be steered by the server without a client release. It sits *above* the GrowthBook experiment because `clientdata` is a targeted per-model push and the Opus-4.8 experiment is a broad A/B — the targeted value should win.
- **Why a separate `model-default` source instead of folding the 200k clamp into `auto`?** Two reasons. (a) **UI honesty:** `model-default` is reported with `configured: jQ` and *is* counted as "configured" by `qCe` (:226895), so the `/config` panel and spinner can say "this model defaults to 200k" rather than silently showing "auto". (b) **Predicate routing:** because `model-default` counts as configured, the proactive-autocompact suppression in the loop predicate (`!qCe(...)`) is *lifted* for clamped models — they run proactive autocompact like an explicitly-windowed session instead of deferring to the reactive lane. Folding it into `auto` (which is NOT configured) would have left clamped 1M sessions in the reactive-only regime, which is exactly the "stuck" failure mode the clamp is meant to fix.
- **Alternative considered (inferable):** they could have clamped only inside `tH` (the hard cap) and left the resolver at 4 sources. They did clamp `tH` too — but `tH`'s clamp alone changes the *number* without changing the *source label*, so the session would still report `source: "auto"` and stay in the reactive-only regime. The dedicated source is what flips the routing. This is the key design insight.

### Key insight

The two new sources do different jobs at different layers. **`clientdata`** is a *value* source (server picks the window). **`model-default`** is a *routing* source (its mere existence as a "configured" label changes which compaction lane the session uses, independent of the number 200000 which `tH` already produced). The resolver's `{source}` field is doing double duty as both an explanation string for the UI *and* a routing key for the predicate.

```javascript
// ============================================
// getAutoCompactWindow - 6-source window resolver (env > settings > clientdata > experiment > model-default > auto)
// Location: cli_inner_pretty.js:226875-226894
// ============================================

// ORIGINAL (for source lookup):
function z2(e, t) {
  let n = Bo(e),
    r = Wb(),
    o = tH(e, r);
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    let c = yae("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, hwn, hqr);
    if (c.status !== "invalid") {
      let u = Math.max(hwn, c.effective);
      return { window: Math.min(o, u), configured: u, source: "env" };
    }
  }
  if (t !== void 0) return { window: Math.min(o, t), configured: t, source: "settings" };
  let s = ywd(n);
  if (s !== null) return { window: Math.min(o, s), configured: s, source: "clientdata" };
  let i = _qr(n);
  if (i !== void 0) return { window: Math.min(o, i), configured: i, source: "experiment" };
  if (o < 1e6 && (hwd.has(n) || ARr(e, r))) return { window: Math.min(o, jQ), configured: jQ, source: "model-default" };
  let l = (Kw() && Object.hasOwn(rBi, n) ? rBi[n] : void 0) ?? o;
  return { window: Math.min(o, l), configured: l, source: "auto" };
}

// READABLE (for understanding):
function getAutoCompactWindow(model, settingsWindow) {
  const canonical = getCanonicalModelName(model);          // Bo
  const sdkBetas = getSdkBetas();                           // Wb
  const hardCap = getContextWindowForModel(model, sdkBetas); // tH — already clamped to 200k if ARr active
  // Source 1 — env (highest). Unchanged from v2.1.156.
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    const v = validateEnvInt("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, 100_000, 1_000_000); // yae
    if (v.status !== "invalid") {
      const eff = Math.max(100_000, v.effective);
      return { window: Math.min(hardCap, eff), configured: eff, source: "env" };
    }
  }
  // Source 2 — settings. Unchanged.
  if (settingsWindow !== undefined)
    return { window: Math.min(hardCap, settingsWindow), configured: settingsWindow, source: "settings" };
  // Source 3 — clientdata (NEW). Server-pushed per-model window via rowan_thicket.
  const clientWindow = clientDataWindow(canonical);        // ywd
  if (clientWindow !== null)
    return { window: Math.min(hardCap, clientWindow), configured: clientWindow, source: "clientdata" };
  // Source 4 — experiment (Opus-4.8 / tengu_amber_redwood2). Unchanged.
  const expWindow = opus48ExperimentWindow(canonical);     // _qr
  if (expWindow !== undefined)
    return { window: Math.min(hardCap, expWindow), configured: expWindow, source: "experiment" };
  // Source 5 — model-default (NEW). Clamp 1M-without-entitlement and the static set down to 200k.
  if (hardCap < 1_000_000 && (MODEL_DEFAULT_CLAMP_SET.has(canonical) || is1mClampActive(model, sdkBetas))) // hwd / ARr
    return { window: Math.min(hardCap, 200_000), configured: 200_000, source: "model-default" }; // jQ = 200000
  // Source 6 — auto (model hard cap; rBi table is empty {} so this is a pure pass-through).
  const auto = (isAutoCompactEnabled() && Object.hasOwn(AUTO_WINDOW_TABLE, canonical) ? AUTO_WINDOW_TABLE[canonical] : undefined) ?? hardCap; // rBi
  return { window: Math.min(hardCap, auto), configured: auto, source: "auto" };
}

// Mapping: z2->getAutoCompactWindow, e->model, t->settingsWindow, n->canonical, Bo->getCanonicalModelName,
//   r->sdkBetas, Wb->getSdkBetas, o->hardCap, tH->getContextWindowForModel, yae->validateEnvInt,
//   hwn->100000, hqr->1000000, ywd->clientDataWindow, _qr->opus48ExperimentWindow, hwd->MODEL_DEFAULT_CLAMP_SET,
//   ARr->is1mClampActive, jQ->200000, rBi->AUTO_WINDOW_TABLE(empty {}), Kw->isAutoCompactEnabled
```

### v2.1.156 before-picture (for contrast)

The v2.1.156 resolver `Xl` @423915-423929 had exactly four returns and *no* `clientdata` / `model-default` branches — read directly from the v2.1.156 bundle:

```javascript
// ORIGINAL (v2.1.156 before-picture, cli_inner_pretty.js:423915-423929):
function Xl(H, $) {
  let q = O7(H),
    K = Ov(H, o2());                                    // hard cap — NOT clamped (no ARr branch)
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) { /* ... source: "env" ... */ }
  if ($ !== void 0) return { window: Math.min(K, $), configured: $, source: "settings" };
  let _ = wX4(q);                                       // experiment — directly after settings (no clientdata gap)
  if (_ !== void 0) return { window: Math.min(K, _), configured: _, source: "experiment" };
  let A = (J0() ? ob_[q] : void 0) ?? K;                // auto — directly after experiment (no model-default gap)
  return { window: Math.min(K, A), configured: A, source: "auto" };
}
// 0 occurrences of source:"clientdata", source:"model-default", or rowan_thicket in the v2.1.156 bundle.
```

The two new branches were spliced in *between* `settings`→`experiment` (clientdata) and `experiment`→`auto` (model-default). The hard cap `K=Ov(...)` in v2.1.156 had no `ARr` clamp, so a stuck 1M session resolved to `1e6` forever — the "permanently stuck" before-state.

---

## 2. The `clientdata` source — `clientDataWindow` (`ywd`, cli_inner_pretty.js:226865)

### What it does

Reads a server-pushed per-model auto-compact window from two client-data caches, validates it is an integer in `[100k, 1M]`, and returns it or `null`. This is the value supplier for resolver Source 3.

### How it works (step-by-step)

1. **Kill-switch (:226866).** `if (!Kw()) return null` — if autocompact is disabled (`DISABLE_COMPACT` / `DISABLE_AUTO_COMPACT` / config off), clientdata windows are ignored entirely. Consistent with how the `auto` source also gates on `Kw()`.
2. **Validator closure (:226867).** `t = (r) => (typeof r === "number" && Number.isInteger(r) && r >= hwn && r <= hqr ? r : null)` — accepts only an *integer* in `[1e5, 1e6]`, else `null`. Note this is stricter than the env validator `yae`, which caps/coerces; here a malformed value is simply dropped (no clamp, no default).
3. **Primary cache — `rowan_thicket` (:226868-226872).** `n = hti()?.rowan_thicket` reads `clientDataCache.rowan_thicket` (`hti` @134129 = `wt().clientDataCache ?? null`). If `n` is a plain object (not array/null), look up `n[e]` (per-model key) and return it through the validator if valid.
4. **Fallback cache — `autoCompactWindowsCache` (:226873).** `return t(yti()?.[e])` — `yti` @134132 = `wt().autoCompactWindowsCache ?? null`, a flat per-model map. Validated the same way.

So the lookup order *within* the clientdata source is: `clientDataCache.rowan_thicket[model]` first, then `autoCompactWindowsCache[model]`.

### Why this approach

Two caches give the server two push channels: `rowan_thicket` is a *named blob field* inside the general `clientDataCache` (the same cache that holds `kelp_forest_sonnet`, `heather_vale`, `cedar_lagoon`, etc. — see :134139, :134153), while `autoCompactWindowsCache` is a *dedicated* per-model window map. Checking the named blob first lets a targeted experiment override the dedicated cache. The strict integer validator (vs the lenient env validator) reflects trust level: env vars are user-typed and forgiven; clientdata is server-controlled and must be well-formed or it is silently ignored rather than coerced into a possibly-wrong window.

### Key insight & open-question caveat

**OPEN QUESTION (carried from dossier §4.1) — STILL OPEN, but the EXISTENCE/WIRING half is now upgraded to HIGH.** Re-verified against live source: the read path is fully pinned but the *write* path is not in-bundle. Specifically:

- **HIGH confidence — existence + wiring (verified).** `ywd` exists at :226865-226874, is wired into `z2` at Source 3 (:226887-226888), reads exactly `hti()?.rowan_thicket` then `yti()?.[model]` (`hti`/`yti` @134129-134134 = `wt().clientDataCache` / `wt().autoCompactWindowsCache`), and validates `[1e5,1e6]` integers. The call path `z2(@226887) → ywd → rowan_thicket` is confirmed.
- **MEDIUM confidence — the server-push MECHANISM (still open, now with a negative-grep proof).** `grep -n 'rowan_thicket =' cli_inner_pretty.js` returns **no assignment sites** in the v2.1.183 bundle — the field is purely *read* in the compaction code, never written here. `clientDataCache` is populated externally (inferred: an SDK/server clientdata sync that lives outside this bundle), so `rowan_thicket` is **server-controlled, not client-computed**. Whether it is best described as a feature-gate key versus a clientdata blob field is therefore moot for the in-bundle read path — it is consumed as a per-model-keyed object either way.

The classification as a "window source" is sound. Treat `rowan_thicket` as "a server-pushed, read-only per-model window blob, populated by a clientdata sync that is not present in the client bundle (no write site exists in-bundle)."

```javascript
// ============================================
// clientDataWindow - NEW clientdata window source (rowan_thicket / autoCompactWindowsCache)
// Location: cli_inner_pretty.js:226865-226874
// ============================================

// ORIGINAL (for source lookup):
function ywd(e) {
  if (!Kw()) return null;
  let t = (r) => (typeof r === "number" && Number.isInteger(r) && r >= hwn && r <= hqr ? r : null),
    n = hti()?.rowan_thicket;
  if (typeof n === "object" && n !== null && !Array.isArray(n)) {
    let r = t(n[e]);
    if (r !== null) return r;
  }
  return t(yti()?.[e]);
}

// READABLE (for understanding):
function clientDataWindow(canonicalModel) {
  if (!isAutoCompactEnabled()) return null;                 // Kw gate
  const validInt = (v) =>
    typeof v === "number" && Number.isInteger(v) && v >= 100_000 && v <= 1_000_000 ? v : null;
  // Primary: clientDataCache.rowan_thicket[model]
  const blob = getClientDataCache()?.rowan_thicket;          // hti
  if (typeof blob === "object" && blob !== null && !Array.isArray(blob)) {
    const w = validInt(blob[canonicalModel]);
    if (w !== null) return w;
  }
  // Fallback: autoCompactWindowsCache[model]
  return validInt(getAutoCompactWindowsCache()?.[canonicalModel]); // yti
}

// Mapping: ywd->clientDataWindow, e->canonicalModel, Kw->isAutoCompactEnabled, hwn->100000, hqr->1000000,
//   hti->getClientDataCache (wt().clientDataCache), yti->getAutoCompactWindowsCache (wt().autoCompactWindowsCache),
//   rowan_thicket->per-model window blob field
```

---

## 3. The `model-default` source — and how it relates to `qCe` / the hard cap

The `model-default` branch (:226891) is the *surfacing* of the 200k clamp inside the resolver. Its two halves:

- **Static set `hwd` (`MODEL_DEFAULT_CLAMP_SET`, init @226982):** `new Set(["claude-sonnet-4-6", "claude-opus-4-6"])`. These models *always* default to 200k via this source (they are the "4-6" generation that ship with a 200k standard window). This is a permanent, entitlement-independent clamp.
- **Dynamic `ARr` (`is1mClampActive`, :134118):** `N8e() && Ati() === void 0 && gti(e, t) > jQ`. Fires when the `longContext1mCreditsBlocked` flag is set (a 429 told us 1M context needs credits), there is no `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override, and the model's *raw* window exceeds 200k. This is the dynamic, per-session clamp. Full mechanism in [`one_million_credits_clamp.md`](./one_million_credits_clamp.md).

Both feed the **same** return: `{window: min(o, jQ), configured: jQ, source: "model-default"}`, where `jQ = 200000` (:134192).

### `isConfiguredWindow` (`qCe`, cli_inner_pretty.js:226895) — now 4 sources count as configured

The "is this an explicitly-configured window?" predicate gained two members. v2.1.156 `EH$` returned true only for `env`/`settings`; v2.1.183 `qCe` also returns true for `clientdata` and `model-default`:

```javascript
// ============================================
// isConfiguredWindow - now treats clientdata + model-default as "configured"
// Location: cli_inner_pretty.js:226895-226898
// ============================================

// ORIGINAL (for source lookup):
function qCe(e, t) {
  let { source: n } = z2(e, t);
  return n === "env" || n === "settings" || n === "clientdata" || n === "model-default";
}

// READABLE (for understanding):
function isConfiguredWindow(model, settingsWindow) {
  const { source } = getAutoCompactWindow(model, settingsWindow);
  // v2.1.156 had only: source === "env" || source === "settings"
  return source === "env" || source === "settings" || source === "clientdata" || source === "model-default";
}

// Mapping: qCe->isConfiguredWindow (v2.1.156 EH$), z2->getAutoCompactWindow (v2.1.156 Xl)
```

**v2.1.156 before-picture** — `EH$` @423931-423933: `return q === "env" || q === "settings";` (only two members).

**Why it matters (routing consequence).** `qCe` is consumed by the loop predicate `shouldAutoCompact` (`Xjp`, :461519: `if (S7() && !uG() && !qCe(t,n)) return !1`) and by `isAbovePrecomputeOrCompact` (`iBi`, :226956). When the source is `clientdata` or `model-default`, `qCe` is now `true`, so the `!qCe(...)` suppression is lifted — these sessions run *proactive* autocompact at the autocompact threshold instead of deferring to the reactive lane. A clientdata-windowed session and a 200k-clamped 1M session both behave like an explicit env/settings window for routing purposes. This is the routing half of the design insight in §1.

### `isAbovePrecomputeOrCompact` (`iBi`, :226956) — the `l < jQ` guard

`iBi` is the proactive-work gate. Its branch at :226960-226963:

```javascript
if (!uG() && !qCe(t, n)) return e >= mqr(i, o);   // not redwood3 AND not configured -> precompute gate
let { window: l } = z2(t, s);
if (l < jQ) return !1;                              // configured window below 200k standard -> never precompute
return e >= mqr(i, o);
```

**OPEN QUESTION (dossier §4.4, resolved here).** The dossier flagged the `l < jQ` guard for verification. Read confirms: when the session *is* in the redwood3-reactive or configured-window regime, `iBi` re-reads the resolved window `l` and **refuses to precompute if `l < jQ`=200000**. The intent: precompute (proactive summary work) is only worthwhile when the window is at least the standard 200k; a clamped or small configured window below 200k skips precompute entirely. This ties directly into the 1M-clamp: a freshly-clamped 200k session has `l === jQ` (exactly 200000, NOT `< jQ`), so it *does* precompute — but a sub-200k explicit setting (e.g. `/autocompact 150k`) does not. The guard is the standard-window floor, confirmed not a behavior change to the ladder math.

---

## 4. The precompute arm table — `tengu_amber_moleskin` (DELTA 4a)

### Background: from a scalar to a table

In v2.1.156 the precompute buffer fraction was a single scalar overridable by GrowthBook `tengu_amber_rokovoko`, validated to `[0,1)`, default `0.2` (baseline [`threshold_and_window_resolution.md`](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md), `tb_` @423954). v2.1.183 **keeps that scalar path verbatim** (now `gqr`, :226916) but layers a richer *arm table* on top: a new flag `tengu_amber_moleskin` (`bwd`, :226970) can carry per-window-size, per-surface (repl/sdk) fractions. The resolved fraction now flows through `getPrecomputeBufferFraction(resolved)` (`Ewd`, :226935) which delegates to the table resolver `getPrecomputeArm` (`bqr`, :226920).

The data path is: `Sqr` (thresholdOverrides, :226938) → `Ewd(e,t,n)` (:226943) → `bqr(e,t,n).fraction` → `mqr` precompute math. The third argument `n` ("repl" or "sdk") is the *surface* the session is running on.

### The scalar fallback — `getPrecomputeBufferFraction` (`gqr`, :226916)

Byte-identical to v2.1.156 `tb_` (just renamed): reads `tengu_amber_rokovoko` (default `fqr=0.2`), validates `[0,1)`, else returns `0.2`. This is the value `bqr` falls back to whenever the table is absent, malformed, or has no matching entry.

### The table resolver — `getPrecomputeArm` (`bqr`, cli_inner_pretty.js:226920)

#### What it does

Resolves the precompute buffer fraction from the `tengu_amber_moleskin` arm table for a given (model, settingsWindow, surface), with a graceful scalar fallback at every failure point and a telemetry ping on malformed payloads. Returns `{fraction, source, ...}` where `source` explains which arm won.

#### How it works (step-by-step)

1. **Fetch flag (:226921-226922).** `r = ct(bwd, null)` reads `tengu_amber_moleskin` (default `null`). If `null`/`undefined`, return `{fraction: gqr(), source: "scalar"}` — i.e. fall back to the old scalar path. This is the default state (flag off), so every existing session behaves exactly as v2.1.156.
2. **Parse (:226923).** `o = eBi(r)` parses the raw flag value into a normalized table `{entries, defaultEntry}` (see §4.3 below). 
3. **Malformed guard (:226924).** If `eBi` returns `null` (the payload is not a valid table), fire telemetry and fall back: `return (Swd(Ne(Array.isArray(r) ? "array" : typeof r)), { fraction: gqr(), source: "malformed" })`. `Swd` (:226912) emits `tengu_precompute_arm_table_malformed` (once per process — guarded by the `oBi` latch) with the offending `payloadType`. So a broken server-pushed table never breaks compaction; it logs and degrades to 0.2.
4. **Resolve the session's window (:226925-226926).** `s = Kw() ? t : void 0; { window: i } = z2(e, s)` — runs the *same* 6-source resolver to get the session's actual window `i`, which is the lookup key into the table.
5. **Match window (:226927-226928).** `a = tBi(o, i)` looks for an exact-window entry, then falls back to the table's `default` entry (§4.4). If neither, `a === null` → `{fraction: gqr(), source: "table_no_match"}` (scalar fallback again).
6. **Pick surface fraction (:226929-226933).** `l = (n === "sdk" ? "sdk" : "repl"); c = a.entry[l]` — picks the repl or sdk fraction from the matched arm. Returns `{fraction: c, source: "table_exact", matchedWindowKey: a.entry.windowSize}` for an exact window match, or `{fraction: c, source: "table_default"}` for the default arm.

#### Why this approach

- **Per-window-size tuning.** A 200k session and a 1M session want *different* precompute buffer fractions (20% of 1M = 200k of headroom, which is far more than needed; a smaller fraction is better for large windows). A scalar can't express that; the table keys fractions by `windowSize`. The `default` entry covers any window not explicitly listed.
- **Per-surface (repl/sdk) tuning.** Interactive REPL sessions and headless SDK sessions have different latency/cost trade-offs around proactive precompute, so each window arm carries both a `repl` and `sdk` fraction.
- **Fail-safe at every step.** Every failure mode (flag off, malformed, no window match) returns the *scalar* fraction (`gqr()` = the validated `tengu_amber_rokovoko`/0.2 value), so the worst case is identical to v2.1.156. This is the standard "new feature must never regress the old path" pattern — the table is purely additive.
- **Alternative considered (inferable):** they could have replaced `tengu_amber_rokovoko` with the table outright. Keeping *both* (scalar = `gqr`, table = `bqr` wrapping `gqr`) means the table is a strict superset: the scalar experiment still works standalone, and the table experiment subsumes it. The cost is a second flag and the `source` discriminator, but it makes the rollout reversible per-flag.

#### Key insight

The arm table re-runs the **same `z2` resolver** to get the window key (:226926). So the precompute fraction is now a function of the *resolved* window source — a `clientdata` or `model-default` session that resolves to 200k will look up the `200000` arm (or the `default` arm), getting a fraction tuned for that exact window. The two deltas in this doc compose: DELTA 3's window resolution feeds DELTA 4a's fraction lookup.

```javascript
// ============================================
// getPrecomputeArm - NEW tengu_amber_moleskin arm-table resolver (per-windowSize, repl/sdk fractions)
// Location: cli_inner_pretty.js:226920-226934
// ============================================

// ORIGINAL (for source lookup):
function bqr(e, t, n) {
  let r = ct(bwd, null);
  if (r === null || r === void 0) return { fraction: gqr(), source: "scalar" };
  let o = eBi(r);
  if (o === null) return (Swd(Ne(Array.isArray(r) ? "array" : typeof r)), { fraction: gqr(), source: "malformed" });
  let s = Kw() ? t : void 0,
    { window: i } = z2(e, s),
    a = tBi(o, i);
  if (a === null) return { fraction: gqr(), source: "table_no_match" };
  let l = n === "sdk" ? "sdk" : "repl",
    c = a.entry[l];
  return a.kind === "exact"
    ? { fraction: c, source: "table_exact", matchedWindowKey: a.entry.windowSize }
    : { fraction: c, source: "table_default" };
}

// READABLE (for understanding):
function getPrecomputeArm(model, settingsWindow, surface) {
  const raw = getFeatureValue("tengu_amber_moleskin", null);              // bwd
  if (raw === null || raw === undefined)
    return { fraction: getPrecomputeBufferFraction(), source: "scalar" }; // gqr — old scalar path
  const table = parseArmTable(raw);                                       // eBi
  if (table === null) {                                                   // payload is not a valid table
    reportArmTableMalformed(stringify(Array.isArray(raw) ? "array" : typeof raw)); // Swd -> tengu_precompute_arm_table_malformed
    return { fraction: getPrecomputeBufferFraction(), source: "malformed" };
  }
  const effSettings = isAutoCompactEnabled() ? settingsWindow : undefined;
  const { window } = getAutoCompactWindow(model, effSettings);            // z2 — same 6-source resolver
  const arm = matchArm(table, window);                                    // tBi — exact windowSize, else default
  if (arm === null) return { fraction: getPrecomputeBufferFraction(), source: "table_no_match" };
  const fractionKey = surface === "sdk" ? "sdk" : "repl";
  const fraction = arm.entry[fractionKey];
  return arm.kind === "exact"
    ? { fraction, source: "table_exact", matchedWindowKey: arm.entry.windowSize }
    : { fraction, source: "table_default" };
}

// Mapping: bqr->getPrecomputeArm, e->model, t->settingsWindow, n->surface, ct->getFeatureValue,
//   bwd->"tengu_amber_moleskin", gqr->getPrecomputeBufferFraction(scalar), eBi->parseArmTable,
//   Swd->reportArmTableMalformed, z2->getAutoCompactWindow, tBi->matchArm, Kw->isAutoCompactEnabled
```

### The table parser — `eBi` (cli_inner_pretty.js:226795) and helpers

The arm-table grammar is parsed by three small functions read at :226785-226816:

- **`JNi` (`isValidFraction`, :226785):** `typeof e === "number" && Number.isFinite(e) && e >= 0 && e < 1 ? e : null`. The same `[0,1)` validation the scalar uses, applied per-fraction.
- **`gwd` (`parseArmEntry`, :226788):** an arm value must be an object with numeric `repl` AND `sdk` fractions, each valid per `JNi`; returns `{repl, sdk}` or `null` (rejecting the whole arm if either fraction is bad).
- **`eBi` (`parseArmTable`, :226795):** iterates `Object.entries(rawTable)`. The key `"default"` becomes the `defaultEntry`. Every other key must parse via `Number(...)` to a *safe positive integer* (the window size, e.g. `"200000"`); each entry becomes `{windowSize, repl, sdk}`. If *any* arm fails to parse, the whole table is rejected (`return null`) — strict all-or-nothing. Empty table with no `default` → `null`.
- **`tBi` (`matchArm`, :226813):** find the entry whose `windowSize === target`; if found `{kind:"exact", entry}`; else if a `defaultEntry` exists `{kind:"default", entry}`; else `null`.

```javascript
// ============================================
// parseArmTable - validates the tengu_amber_moleskin payload into {entries, defaultEntry}
// Location: cli_inner_pretty.js:226795-226816
// ============================================

// ORIGINAL (for source lookup):
function eBi(e) {
  if (typeof e !== "object" || e === null || Array.isArray(e)) return null;
  let t = [], n = null;
  for (let [r, o] of Object.entries(e)) {
    let s = gwd(o);
    if (s === null) return null;
    if (r === "default") { n = s; continue; }
    let i = Number(r);
    if (!Number.isSafeInteger(i) || i <= 0) return null;
    t.push({ windowSize: i, ...s });
  }
  if (t.length === 0 && n === null) return null;
  return { entries: t, defaultEntry: n };
}
function tBi(e, t) {
  let n = e.entries.find((r) => r.windowSize === t);
  if (n !== void 0) return { kind: "exact", entry: n };
  return e.defaultEntry === null ? null : { kind: "default", entry: e.defaultEntry };
}

// READABLE (for understanding):
function parseArmTable(raw) {
  // raw shape: { "200000": {repl, sdk}, "1000000": {repl, sdk}, "default": {repl, sdk} }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const entries = [];
  let defaultEntry = null;
  for (const [key, value] of Object.entries(raw)) {
    const arm = parseArmEntry(value);                   // gwd — requires valid repl + sdk fractions
    if (arm === null) return null;                      // strict: one bad arm rejects the whole table
    if (key === "default") { defaultEntry = arm; continue; }
    const windowSize = Number(key);
    if (!Number.isSafeInteger(windowSize) || windowSize <= 0) return null;
    entries.push({ windowSize, ...arm });
  }
  if (entries.length === 0 && defaultEntry === null) return null;
  return { entries, defaultEntry };
}
function matchArm(table, targetWindow) {
  const exact = table.entries.find((a) => a.windowSize === targetWindow);
  if (exact !== undefined) return { kind: "exact", entry: exact };
  return table.defaultEntry === null ? null : { kind: "default", entry: table.defaultEntry };
}

// Mapping: eBi->parseArmTable, gwd->parseArmEntry, JNi->isValidFraction, tBi->matchArm,
//   windowSize-key->integer model window, "default"->fallback arm
```

### Malformed-table telemetry — `Swd` (`reportArmTableMalformed`, :226912)

```javascript
// ============================================
// reportArmTableMalformed - one-shot telemetry on a broken tengu_amber_moleskin payload
// Location: cli_inner_pretty.js:226912-226915
// ============================================

// ORIGINAL (for source lookup):
function Swd(e) {
  if (oBi) return;
  ((oBi = !0), G("tengu_precompute_arm_table_malformed", { payloadType: e }));
}

// READABLE (for understanding):
let armTableMalformedReported = false; // oBi, init false @226971
function reportArmTableMalformed(payloadType) {
  if (armTableMalformedReported) return;            // one-shot latch — fire at most once per process
  armTableMalformedReported = true;
  emitTelemetry("tengu_precompute_arm_table_malformed", { payloadType });
}

// Mapping: Swd->reportArmTableMalformed, oBi->armTableMalformedReported(latch), G->emitTelemetry, e->payloadType
```

The `oBi` latch (init `false` @226971, set `true` here) ensures a server pushing a broken table doesn't spam the event every turn — it fires once per process. The `payloadType` is the *type* of the bad payload ("array"/"object"/"number"/...) not its contents, so the telemetry is privacy-safe.

### v2.1.156 before-picture (arm table)

```
grep "tengu_amber_moleskin"                v2.1.156 bundle → 0
grep "tengu_precompute_arm_table_malformed" v2.1.156 bundle → 0
```

In v2.1.156 there was only the scalar `tengu_amber_rokovoko` path (`tb_` @423954); `bqr`/`eBi`/`gwd`/`JNi`/`tBi`/`Swd` and the `Ewd` wrapper do not exist. The threshold-overrides bundle `jc6` @423958 read `precomputeBufferFraction: tb_()` directly; v2.1.183 `Sqr` @226938 reads `precomputeBufferFraction: Ewd(e,t,n)` — the only edit to that function is swapping the scalar call for the table resolver.

**OPEN QUESTION (dossier §4.2, MEDIUM confidence).** The *consumption* side — how `tengu_precomputed_compact_arm_gated` (@452899) and `tengu_precomputed_compact_rearm_capped` (@452973) change the reactive precompute swap *timing* relative to v2.1.156 — was not traced into the reactive lane in this doc. What is verified here is the *fraction-resolution* path (table parse → window match → repl/sdk fraction). The downstream reactive-lane gating events live in [`reactive_compaction.md`](../../../claude_code_v_2.1.156/analyze/07_compact/reactive_compaction.md)'s territory and are flagged for a focused read during reactive-lane analysis.

---

## 5. The `/config` UI string update (cli_inner_pretty.js:478040-478058)

The auto-compact-window help string `J5p` (the `applyAutoCompactWindow` display, :478040) gained a `clientdata` branch and now appends the cap-suffix to the auto-ish arms:

```javascript
// ============================================
// autoCompactWindowHelpString - /config display; now branches on clientdata + caps the auto arms
// Location: cli_inner_pretty.js:478040-478044
// ============================================

// ORIGINAL (for source lookup):
function J5p(e, t) {
  let { window: n, configured: r, source: o } = z2(e, t),
    s = r > n ? ` \xB7 capped to ${_l(n)} by model` : "",
    a = [
      `Auto-compact window: ${o === "auto" ? "auto" : o === "experiment" || o === "clientdata" ? `auto (${_l(r)} tokens)${s}` : o === "env" ? `${_l(r)} tokens (from CLAUDE_CODE_AUTO_COMPACT_WINDOW)${s}` : `${_l(r)} tokens (from settings)${s}`}`,
    ];
  // ... (disabled note, two explanatory lines, env/settings override warning) ...
}

// READABLE (for understanding):
function autoCompactWindowHelpString(model, settingsWindow) {
  const { window, configured, source } = getAutoCompactWindow(model, settingsWindow);
  const capSuffix = configured > window ? ` · capped to ${fmt(window)} by model` : ""; // _l = formatTokens
  const head =
    source === "auto"
      ? "auto"
      : source === "experiment" || source === "clientdata"            // NEW: clientdata joins experiment as "auto (N tokens)"
        ? `auto (${fmt(configured)} tokens)${capSuffix}`
        : source === "env"
          ? `${fmt(configured)} tokens (from CLAUDE_CODE_AUTO_COMPACT_WINDOW)${capSuffix}`
          : `${fmt(configured)} tokens (from settings)${capSuffix}`;  // settings AND model-default land here
  return [`Auto-compact window: ${head}`, /* ...the rest unchanged... */];
}

// Mapping: J5p->autoCompactWindowHelpString, z2->getAutoCompactWindow, _l->formatTokens, s->capSuffix
```

**Two UI changes vs v2.1.156** (before-picture `Pn_` @458315-458319):

1. **`clientdata` rendering.** v2.1.156: the ternary was `_ === "experiment"` alone. v2.1.183: `o === "experiment" || o === "clientdata"`. A clientdata-windowed session now renders as `auto (N tokens)` — i.e. it presents to the user as an *auto* window with a specific size, NOT as a user-set value (it isn't one).
2. **Cap suffix on the auto-ish arms.** v2.1.156 only appended the cap suffix `${z}` to the env/settings arms (the experiment arm was bare `auto (${s4(K)} tokens)` with no suffix). v2.1.183 appends `${s}` (the `· capped to N by model` note) to the experiment/clientdata arm too. Because `model-default` is not in the experiment/clientdata branch, it falls through to the *settings* arm (`${fmt(configured)} tokens (from settings)`) — a minor labeling quirk: a 200k model-default session displays as "from settings" even though no setting was saved. This is verified behavior, flagged as a low-impact cosmetic edge in the model-default labeling.

The v2.1.156 before-picture (read directly):
```javascript
// ORIGINAL (v2.1.156, cli_inner_pretty.js:458319):
`Auto-compact window: ${_ === "auto" ? "auto" : _ === "experiment" ? `auto (${s4(K)} tokens)` : _ === "env" ? `${s4(K)} tokens (from CLAUDE_CODE_AUTO_COMPACT_WINDOW)${z}` : `${s4(K)} tokens (from settings)${z}`}`
// No "clientdata" branch; the experiment arm has no cap suffix.
```

---

## 6. Unchanged ladder math (LINK — do NOT re-derive)

The threshold ladder that consumes the resolver output is byte-identical to v2.1.156 modulo rename. Verified by reading v2.1.183 :226818-226841 against the baseline; do not re-document — see baseline [`threshold_and_window_resolution.md`](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md):

- **`getAutoCompactThreshold` (`gwn`, :226818):** `eff − 13000`, with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` producing `min(floor(eff·pct/100), base)` (can only lower). Identical to v2.1.156 `Jv$`.
- **`precomputeThreshold` (`mqr`, :226824):** `min(eff − round(eff·precomputeBufferFraction), gwn(eff))`. Identical to v2.1.156 `YX4` — the *only* change is the source of `precomputeBufferFraction` (now the arm table via `Ewd`/`bqr`, §4), not the formula.
- **`calculateTokenWarningState` (`nBi`, :226827):** returns `{level: ok|warn|compact|blocked, pctLeft}`; warn = threshold − 20000, blocked = blockingBase − 3000; `pctLeft` vs threshold; no `pctLeft` on `ok`. Identical to v2.1.156 `fX4`.
- **`parseWindowString` (`yqr`, :226843):** `"auto"`/`Nm`/`Nk`/`N` parsing, `[100,1000]`-as-thousands shorthand, clamp `[hwn=1e5, hqr=1e6]`. Identical to v2.1.156 `Ac6`.
- **Constants:** `QNi`=13000, `ZNi`=3000, `fqr`=0.2, `sBi`=20000, `hwn`=1e5, `hqr`=1e6 (:226839-226841, :226965-226967) — all unchanged values from v2.1.156 (`zX4`/`AX4`/`qc6`/`MX4`/`zc6`/`jX4`).
- **`getEffectiveContextWindowSize` (`oee`, :226902)** = `z2(...).window − min(maxOutputTokens, 20000)` and the raw variant `getEffectiveContextWindowSizeRaw` (`_wd`, :226908) = `tH(model) − min(maxOut, 20000)` — same formulas as v2.1.156 `_qH`/`sb_`, now calling the 6-source `z2` instead of 4-source `Xl`.
- **`opus48ExperimentWindow` (`_qr`, :226856)** and **`isRedwood3Reactive` (`uG`, :226742)** — the two pre-existing GrowthBook gates (`tengu_amber_redwood2`/`redwood3`) — are byte-identical to v2.1.156 `wX4`/`Pc` modulo rename.

The worked numeric examples in the baseline (200k Sonnet, 1M Opus) still hold for any session whose resolver lands on `auto`. A `model-default`-clamped 1M session simply substitutes `window = 200000` and then follows the *200k* worked example.

---

## 7. Confidence summary

| Item | Confidence | Note |
|------|-----------|------|
| `z2` grew to 6 sources, precedence env>settings>clientdata>experiment>model-default>auto | **HIGH** | read :226875-226893; 0-count grep of `clientdata`/`model-default` in v2.1.156 |
| `clientdata` source *exists* and is wired at Source 3, reads `rowan_thicket`/`autoCompactWindowsCache` | **HIGH** | read `ywd` :226865-226874 + `hti`/`yti` :134129-134134 |
| `clientdata` upstream cache-population / `rowan_thicket` server-push mechanism | **MEDIUM** | dossier §4.1 open question, still open — `grep -n 'rowan_thicket ='` = 0 write sites in-bundle (read-only; populated by an external clientdata sync) |
| `model-default` source (static `hwd` set + dynamic `ARr` clamp), `jQ`=200000 | **HIGH** | read :226891, :226982, :134118, :134192 |
| `qCe` now counts clientdata + model-default as configured | **HIGH** | read :226895-226898 vs v2.1.156 `EH$` |
| Arm table `bqr`/`eBi`/parser + malformed telemetry | **HIGH** | read :226920-226934, :226795-226816, :226912 |
| Arm-table *consumption timing* in the reactive lane (gated/rearm-capped events) | **MEDIUM** | dossier §4.2 — fraction resolution verified; reactive-lane swap timing not traced |
| UI string clientdata branch + cap-suffix change | **HIGH** | read :478040-478044 vs v2.1.156 :458319 |
| `iBi` `l < jQ` standard-window precompute floor | **HIGH** | read :226956-226963 — confirmed not a math change |
| Ladder math unchanged (gwn/mqr/nBi/yqr, all constants) | **HIGH** | read :226818-226854 vs baseline |

---

## Related Symbols

> Symbol mappings live in the four overview indexes and the per-feature additions file — not inline here.
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (loop predicate integration)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Compact module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model context window, clientdata cache)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md) — v2.1.183 compact symbol additions

Key functions in this document:

- `getAutoCompactWindow` (obf: `z2`, cli_inner_pretty.js:226875) — the 6-source window resolver; precedence env > settings > clientdata > experiment > model-default > auto; returns `{window, configured, source}`.
- `clientDataWindow` (obf: `ywd`, cli_inner_pretty.js:226865) — NEW clientdata window source; reads `clientDataCache.rowan_thicket[model]` then `autoCompactWindowsCache[model]`, validates `[1e5,1e6]` integer.
- `isConfiguredWindow` (obf: `qCe`, cli_inner_pretty.js:226895) — now returns true for `env`/`settings`/`clientdata`/`model-default` (was env/settings only in v2.1.156 `EH$`).
- `getAutoCompactWindowSource` (obf: `ywn`, cli_inner_pretty.js:226899) — returns just the `.source` field of `z2`.
- `is1mClampActive` (obf: `ARr`, cli_inner_pretty.js:134118) — `N8e() && Ati()===void 0 && gti(e,t) > jQ`; the dynamic half of `model-default` (full detail in `one_million_credits_clamp.md`).
- `getContextWindowForModel` (obf: `tH`, cli_inner_pretty.js:134105) — model hard cap; returns `jQ`=200000 when `ARr` active (the clamp the resolver's `o` is seeded from).
- `getPrecomputeArm` (obf: `bqr`, cli_inner_pretty.js:226920) — NEW `tengu_amber_moleskin` arm-table resolver; per-windowSize, repl/sdk fractions; scalar fallback at every failure.
- `getPrecomputeBufferFractionResolved` (obf: `Ewd`, cli_inner_pretty.js:226935) — wrapper returning `bqr(e,t,n).fraction`, fed into `Sqr` thresholdOverrides.
- `getPrecomputeBufferFraction` (obf: `gqr`, cli_inner_pretty.js:226916) — the scalar `tengu_amber_rokovoko` fraction (v2.1.156 `tb_`), the table's fallback.
- `parseArmTable` (obf: `eBi`, cli_inner_pretty.js:226795) — validates the moleskin payload into `{entries, defaultEntry}`; strict all-or-nothing.
- `parseArmEntry` (obf: `gwd`, cli_inner_pretty.js:226788) — requires valid `repl` + `sdk` fractions per arm.
- `isValidFraction` (obf: `JNi`, cli_inner_pretty.js:226785) — `[0,1)` per-fraction validator.
- `matchArm` (obf: `tBi`, cli_inner_pretty.js:226813) — exact `windowSize` match, else `default` arm, else null.
- `reportArmTableMalformed` (obf: `Swd`, cli_inner_pretty.js:226912) — one-shot `tengu_precompute_arm_table_malformed` telemetry (latch `oBi`).
- `isAbovePrecomputeOrCompact` (obf: `iBi`, cli_inner_pretty.js:226956) — proactive-work gate; `l < jQ` standard-window floor for the configured/redwood3 path.
- `autoCompactWindowHelpString` (obf: `J5p`, cli_inner_pretty.js:478040) — `/config` display; now branches on `clientdata` and caps the auto arms.
- `getThresholdOverrides` (obf: `Sqr`, cli_inner_pretty.js:226938) — now reads `precomputeBufferFraction: Ewd(e,t,n)` (table) instead of the v2.1.156 scalar.

Constants:
- `MODEL_DEFAULT_CLAMP_SET` (obf: `hwd`, cli_inner_pretty.js:226969, init :226982) — `new Set(["claude-sonnet-4-6","claude-opus-4-6"])`.
- `PRECOMPUTE_ARM_FLAG` (obf: `bwd`, cli_inner_pretty.js:226970) — `"tengu_amber_moleskin"`.
- `STANDARD_WINDOW` (obf: `jQ`, cli_inner_pretty.js:134192) — 200000.
- `AUTO_WINDOW_TABLE` (obf: `rBi`, cli_inner_pretty.js:226968, init :226982) — empty `{}`; `auto` source pass-through.
- `WINDOW_MIN` (obf: `hwn`, cli_inner_pretty.js:226966) — 1e5; `WINDOW_MAX` (obf: `hqr`, cli_inner_pretty.js:226967) — 1e6.
- `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (obf: `fqr`, cli_inner_pretty.js:226841) — 0.2.
- `armTableMalformedLatch` (obf: `oBi`, cli_inner_pretty.js:226971) — one-shot guard, init `false`.

v2.1.156 before-picture references:
- `getAutoCompactWindow` (obf: `Xl`, v2.1.156 cli_inner_pretty.js:423915) — the 4-source resolver (env > settings > experiment > auto).
- `isConfiguredWindow` (obf: `EH$`, v2.1.156 cli_inner_pretty.js:423931) — env/settings only.
- `getPrecomputeBufferFraction` (obf: `tb_`, v2.1.156 cli_inner_pretty.js:423954) — scalar `tengu_amber_rokovoko` only (no arm table).
- `autoCompactWindowHelpString` (obf: `Pn_`, v2.1.156 cli_inner_pretty.js:458315) — no clientdata branch; experiment arm without cap suffix.
