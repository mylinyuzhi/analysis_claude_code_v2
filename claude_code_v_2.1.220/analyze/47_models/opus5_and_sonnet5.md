# Sonnet 5 (`.197`) and Opus 5 (`.219`): entries, 1M context, promo pricing, alias resolution

> **Type/version:** two NEW_FEATURE releases — `2.1.197` (single bullet: Claude Sonnet 5) and
> `2.1.219` bullet 1 (Claude Opus 5). Plus `.201` (a Sonnet-5 hotfix that was **reverted** before
> `.220`) and four `.219` picker bullets that only exist because Opus 5 landed.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). Every `cli_inner_pretty.js:<line>` is a **220** line
> unless tagged **(193)**.

---

## TL;DR

Both launches are, mechanically, *one catalogue entry plus one alias-table edit*. That is the whole
point of the [catalogue rewrite](model_catalogue_rewrite.md) — the `"//"` contract at `:14009` says
"On model launch add one entry to `models` below", and these two releases are the proof it works.

Delta counts: `claude-sonnet-5` **220=35 / 193=0**; `Sonnet 5` **220=15 / 193=0**;
`claude-opus-5` **220=42 / 193=0**; `Opus 5` **220=13 / 193=0**.

Four things the changelog gets *narrower* than the code, all covered below:

1. **"now the default Opus/Sonnet model" is provider-conditional.** Foundry still resolves `opus` to
   Opus 4.6 and the gateway to Opus 4.7 (`:14467`, `:14470`); Bedrock/Vertex/Foundry/Mantle still
   resolve `sonnet` to Sonnet 4.5 (`:14476-14479`).
2. **`.197`'s "$2/$10 promo through August 31" is not a baked price.** The catalogue says
   `pricing: "tier_3_15"` (`:14201`). The promo string is built at runtime from a **server-supplied
   date** in the `cedar_basin` feature-flag payload (`:119958`) and vanishes when that value expires.
3. **`.219`'s "$10/$50 per Mtok in fast mode" against `pricing: "tier_5_25"` reconciles exactly** —
   fast mode has its own cost table, not a multiplier (§4).
4. **`.201` ("Sonnet 5 sessions no longer use the mid-conversation system role") is no longer true in
   the shipped 2.1.220 bundle** (§5). It was reverted somewhere in `.202`…`.220`.

---

## 1. The Sonnet 5 entry (`.197`)

Read verbatim at `:14177-14213`:

| Field | Value | Line |
|---|---|---|
| `id` / `family` / `display_name` | `claude-sonnet-5` / `sonnet` / `Sonnet 5` | `:14177-14179` |
| `knowledge_cutoff` | `"January 2026"` | `:14180` |
| `provider_ids` | all **eight** non-null, incl. `mantle: "anthropic.claude-sonnet-5"` and `anthropic_google_cloud: "claude-sonnet-5"` | `:14181-14190` |
| `eager_input_streaming` | `{ bedrock: !0, vertex: !0 }` | `:14191` |
| `vertex_region_env_var` | `VERTEX_REGION_CLAUDE_5_SONNET` | `:14192` |
| `fallback_3p` | `claude-sonnet-4-6` | `:14193` |
| `context` | `{ window: 1e6, native_1m: !0, native_1m_3p: { bedrock: !0, vertex: !0, foundry: !0 }, supports_1m_beta: !0 }` | `:14194-14199` |
| `max_output_tokens` | `{ default: 64000, upper: 128000 }` | `:14200` |
| `pricing` | `"tier_3_15"` → $3/$15 | `:14201` |
| `capabilities` | `effort`, `max_effort`, `xhigh_effort`, `adaptive_thinking`, `mid_conv_system`, `context_management` | `:14202-14209` |
| `default_effort` | `"high"` | `:14210` |
| `image_limits` | `{ maxWidth: 2000, maxHeight: 2000 }` | `:14211` |
| `advisor_rank` | `3` | `:14212` |

Sonnet 5 is the **first Sonnet with `native_1m: !0`** and — uniquely in the whole catalogue — the only
entry with `native_1m_3p` (`:14197`). Every other 1M model (`claude-opus-4-7` `:14321`,
`claude-opus-4-8` `:14347`, `claude-opus-5` `:14382`, `claude-fable-5` `:14419`, `claude-mythos-5`
`:14453`) has `native_1m` but **no** `native_1m_3p`. §3 explains why that one extra field matters.

Also note Sonnet 5 is the only entry with `native_1m` that does **not** set `supports_1m_suffix`
(compare `:14194-14199` with Opus 5's `:14382`). Consequence, via `Poe()` (`:111210-111216`) and
`mb()` (`:111291-111299`): a `claude-sonnet-5[1m]` id does **not** render as "Sonnet 5 (1M context)"
from the catalogue path — the picker builds that label by hand instead (`CWi()`, `:120166-120175`,
`label: "Sonnet 5 (1M context)"`). Sonnet 5's window is 1M unconditionally, so a suffix-marked
variant is semantically redundant; the picker keeps a separate row purely as a UI affordance.

---

## 2. The Opus 5 entry (`.219`)

Read verbatim at `:14365-14400`:

| Field | Value | Line |
|---|---|---|
| `id` / `family` / `display_name` | `claude-opus-5` / `opus` / `Opus 5` | `:14365-14367` |
| `knowledge_cutoff` | `"May 2026"` | `:14368` |
| `provider_ids` | all **eight** non-null | `:14369-14378` |
| `eager_input_streaming` | `{ bedrock: !0, vertex: !0 }` | `:14379` |
| `vertex_region_env_var` | `VERTEX_REGION_CLAUDE_5_OPUS` | `:14380` |
| `fallback_3p` | `claude-opus-4-8` | `:14381` |
| `context` | `{ window: 1e6, native_1m: !0, supports_1m_beta: !0, supports_1m_suffix: !0 }` | `:14382` |
| `max_output_tokens` | `{ default: 64000, upper: 128000 }` | `:14383` |
| `pricing` | `"tier_5_25"` → $5/$25 base | `:14384` |
| `capabilities` | `effort`, `max_effort`, `xhigh_effort`, `adaptive_thinking`, `mid_conv_system`, `context_management`, **`fast_mode`**, `lean_prompt`, `refusal_fallback`, **`opus_5_prompt_bundle`** | `:14385-14396` |
| `default_effort` | `"high"` | `:14397` |
| `image_limits` | `{ maxWidth: 2000, maxHeight: 2000 }` | `:14398` |
| `advisor_rank` | `4` | `:14399` |

Diff against Opus 4.8 (`:14330-14363`): `knowledge_cutoff` January 2026 → **May 2026**;
`fallback_3p` 4-7 → **4-8**; two new capability tokens, `refusal_fallback` (`:14394`, shared only
with Fable 5 at `:14432`) and `opus_5_prompt_bundle` (`:14395`, unique). Everything else — window,
max output, pricing tier, `default_effort: "high"`, `image_limits`, `advisor_rank: 4` — is identical
to 4.8. So Opus 5 is, in catalogue terms, "Opus 4.8 with a fresher cutoff plus two behaviour flags".

### `opus_5_prompt_bundle`: a capability token that flips six gates at once

**What it does:** one capability token turns on six *separate* prompt-experiment feature gates for
Opus 5 without the server having to enable each one, with a single kill switch to turn the whole
bundle back off.

```javascript
// ============================================
// isOpus5PromptBundleEnabled + gateOrBundle - one token, six gates
// Location: cli_inner_pretty.js:118700-118725
// ============================================

// ORIGINAL (for source lookup):
function ZXn(e) {
  if (e === void 0) return !1;
  if (M$(lo(e), "opus_5_prompt_bundle") !== !0) return !1;
  return !Ke(Qcg, !1);
}
function vQt(e, t, r) {
  return e || ZXn(r) || Jx()?.[t] === !0 || Ke(t, !1);
}
function jFc(e) { return vQt(Z.CLAUDE_CODE_MARL_CORMORANT,   Vcg, e); }
function GFc(e) { return vQt(Z.CLAUDE_CODE_GAULT_KESTREL,    zcg, e); }
function WFc()  { return vQt(Z.CLAUDE_CODE_GORSE_PLOVER,     Kcg, void 0); }
function qFc()  { return vQt(Z.CLAUDE_CODE_AMBER_ASTROLABE,  Ycg, void 0); }
function VFc(e) { return vQt(Z.CLAUDE_CODE_BISON_CAIRN,      Xcg, e); }
function zFc(e) { return vQt(Z.CLAUDE_CODE_LARCH_CISTERN,    Jcg, e); }

// READABLE (for understanding):
function isOpus5PromptBundleEnabled(model) {
  if (model === undefined) return false;
  if (modelHasCapability(normaliseToCatalogueId(model), "opus_5_prompt_bundle") !== true) return false;
  return !getFeatureValue(BUNDLE_KILL_SWITCH_GATE, false);       // "tengu_fennel_godwit"
}

function gateOrBundle(envOverride, gateName, model) {
  return envOverride                                  // 1. per-experiment env override
      || isOpus5PromptBundleEnabled(model)            // 2. the Opus 5 bundle
      || getClientDataCache()?.[gateName] === true    // 3. server-pushed client data
      || getFeatureValue(gateName, false);            // 4. the individual GrowthBook gate
}

// Mapping: ZXn→isOpus5PromptBundleEnabled, vQt→gateOrBundle, M$→modelHasCapability,
//          lo→normaliseToCatalogueId, Ke→getFeatureValue, Jx→getClientDataCache,
//          Qcg→BUNDLE_KILL_SWITCH_GATE
```

The six bundled gate names (`:118744-118749`) and the kill switch (`:118750`):

```
Vcg = "tengu_marl_cormorant"     Ycg = "tengu_amber_astrolabe"
zcg = "tengu_gault_kestrel"      Xcg = "tengu_bison_cairn"
Kcg = "tengu_gorse_plover"       Jcg = "tengu_larch_cistern"
                                 Qcg = "tengu_fennel_godwit"   <- kill switch
```

**All seven names are in the 326 new-gate list** in
[`_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md), and
`opus_5_prompt_bundle` is 220=2 / 193=0.

**Why this approach:**
- **A model launch is a coordinated prompt change, not six independent experiments.** Opus 5 needs a
  particular prompt shape; shipping that shape means six code paths must all agree. Encoding it as a
  *capability of the model* rather than six gate rollouts makes the bundle atomic and makes it
  impossible for a partial rollout to produce a prompt nobody tested.
- **The `!== !0` (strict) test at `:118702`** rather than truthiness: `M$` is tri-state and returns
  `undefined` both for "in the catalogue without the token" and "not in the catalogue at all"
  (see [`model_catalogue_rewrite.md`](model_catalogue_rewrite.md) §6). Strict comparison ensures an
  unknown model never accidentally gets the Opus 5 prompt bundle — the optimistic-default philosophy
  used for *capabilities* is explicitly refused here, because a prompt bundle tuned to one model is
  not a safe default for an unknown one.
- **Ordering inside `gateOrBundle`.** The env override is first so a developer can force one
  experiment without touching the model; the bundle is second so a shipped model beats server
  rollout state; the server paths are last. `Ke(gateName, false)` is the slowest (GrowthBook
  evaluation) and is therefore the final term of the `||` chain — short-circuit as performance.
- **One kill switch (`tengu_fennel_godwit`) covers all six.** If the bundle regresses, Anthropic can
  disable it server-side in one flag flip without a release, and each experiment's individual gate
  still works independently. That is the same "remotely tunable where change is expected" pattern the
  ground truth documents for `tengu_hazel_trellis` and subagent spawn depth.

**Key insight:** this is the catalogue being used as a *prompt-version selector*. `capabilities` is
not only "what the API supports" — it also carries "which harness behaviour this model was tuned
against".

---

## 3.1M context: `native_1m` vs `supports_1m_beta` vs `supports_1m_suffix`

Three separate context fields exist because there are three separate questions, each with its own
predicate.

| Field | Predicate | Meaning |
|---|---|---|
| `native_1m` | `IP(e)` `:150201-150209` | the window *is* 1M with no beta header and no `[1m]` opt-in |
| `native_1m_3p` | `$xg(p, ctx)` `:150210-150222` | which third-party channels have shipped the native window |
| `supports_1m_beta` | `Q8(e)` `:150232-150238` | the 1M window is reachable via a beta header |
| `supports_1m_suffix` | `Poe()` `:111214`, `mb()` `:111298` | an explicit `[1m]` id variant exists and should be *labelled* "(1M context)" |

```javascript
// ============================================
// isNative1mModel / native1mOnThirdParty - is this model's 1M window native on this provider?
// Location: cli_inner_pretty.js:150201-150222
// ============================================

// ORIGINAL (for source lookup):
function IP(e) {
  if (O6e()) return !1;
  let t = lo(Qs(e)),
    r = ww(t)?.context;
  if (!r?.native_1m && t !== "claude-mythos-preview") return !1;
  let n = ny(e);
  if ((n === "firstParty" && Yd()) || iW(n) || n === "mantle") return !0;
  return $xg(n, r);
}
function $xg(e, t) {
  let r = t?.native_1m_3p;
  switch (e) {
    case "bedrock":
    case "vertex":
    case "foundry":
      return r?.[e] === !0;
    case "gateway":
      return r?.bedrock === !0 && r?.vertex === !0 && r?.foundry === !0;
    default:
      return !1;
  }
}

// READABLE (for understanding):
function isNative1mModel(model) {
  if (is1mContextDisabled()) return false;                  // CLAUDE_CODE_DISABLE_1M_CONTEXT, :150194-150196
  const id = normaliseToCatalogueId(strip1mSuffix(model));
  const ctx = lookupById(id)?.context;
  if (!ctx?.native_1m && id !== "claude-mythos-preview") return false;
  const provider = providerForModel(model);
  if ((provider === "firstParty" && isOfficialBaseUrl()) || isClaudePlatformProvider(provider) || provider === "mantle")
    return true;                                            // 1P + both Claude Platform channels + Mantle: always
  return native1mOnThirdParty(provider, ctx);
}

function native1mOnThirdParty(provider, ctx) {
  const per = ctx?.native_1m_3p;
  switch (provider) {
    case "bedrock": case "vertex": case "foundry":
      return per?.[provider] === true;                      // per-channel opt-in
    case "gateway":
      return per?.bedrock === true && per?.vertex === true && per?.foundry === true;   // intersection
    default:
      return false;
  }
}

// Mapping: IP→isNative1mModel, $xg→native1mOnThirdParty, O6e→is1mContextDisabled,
//          lo→normaliseToCatalogueId, Qs→strip1mSuffix, ww→lookupById, ny→providerForModel,
//          Yd→isOfficialBaseUrl, iW→isClaudePlatformProvider
```

**Why the gateway case is an intersection, not a union.** A cloud gateway is a *router*: a request
sent to it may be served by Bedrock, Vertex or Foundry, and the client cannot know which. Claiming a
native 1M window when only two of the three upstreams have it would produce a hard API failure on
the third. Requiring all three (`:150217`) trades some capability for the guarantee that the claim is
always honoured. This is the single clearest example in the module of "the abstraction layer must
assume the worst upstream".

**Why `firstParty` additionally requires `Yd()` (the official base URL).** `ANTHROPIC_BASE_URL`
pointing at a proxy means the request may not reach Anthropic's own 1M-capable stack; `Yd()`
(`:100358-100361`) returns true only when the base URL is unset or resolves to `api.anthropic.com`
(`S1e`, `:100367-100374`). The Claude Platform channels (`iW()`, `:100346-100348`) and Mantle are
trusted unconditionally because their base URLs are provider-fixed.

`Q8()` (the beta path) shows the older, coarser design still in place:

```javascript
// ORIGINAL (:150232-150238):
function Q8(e) {
  if (O6e()) return !1;
  let t = lo(e);
  if (Uot(t)) return !1;                                    // hard exclusion list
  if (ww(t)?.context?.supports_1m_beta) return !0;           // catalogue
  return dj(ny(e));                                         // optimistic provider default
}
```

with `Uot` (`:150223-150231`) = `claude-3-*`, opus-4-0, opus-4-1, opus-4-5, haiku-4-5 — the models
that genuinely cannot do 1M at all. Same three-stage shape as every other capability probe.

**The `.208` bullet "Context window briefly resetting to 200k after an auto-update"** remains
**UNANCHORED**: `cachedContextWindow` is 0/0 in both bundles and the `2e5`/`200000` literals are far
too common to bisect. The plausible mechanism is visible — `Xv()` (`:150238-150242`) resolves the
window through `fZc()` (`DISABLE_COMPACT` + `CLAUDE_CODE_MAX_CONTEXT_TOKENS`) before consulting the
model — but no site in 2.1.220 can be shown to be the fix.

---

## 4. Pricing: reconciling `tier_5_25` with the changelog's "$10/$50 per Mtok"

Ground-truth open question 2. **Answer: fast mode does not multiply the base tier — it substitutes a
different, hard-coded cost table**, and `tier_10_50` is exactly that table.

Three cost records are declared at `:109827-109851`:

```javascript
// ============================================
// Fast-mode and default cost tables
// Location: cli_inner_pretty.js:109827-109851
// ============================================

// ORIGINAL (for source lookup):
((Dig = { inputTokens: 5,  outputTokens: 25,  promptCacheWriteTokens: 6.25, promptCacheWrite1hTokens: 10, promptCacheReadTokens: 0.5, webSearchRequests: 0.01 }),
  (UIc = { inputTokens: 30, outputTokens: 150, promptCacheWriteTokens: 37.5, promptCacheWrite1hTokens: 60, promptCacheReadTokens: 3,   webSearchRequests: 0.01 }),
  (a7n = { inputTokens: 10, outputTokens: 50,  promptCacheWriteTokens: 12.5, promptCacheWrite1hTokens: 20, promptCacheReadTokens: 1,   webSearchRequests: 0.01 }),
  (l7n = Dig));

// READABLE (for understanding):
const BASE_OPUS_COSTS       = { input: 5,  output: 25,  cacheWrite5m: 6.25, cacheWrite1h: 10, cacheRead: 0.5, webSearch: 0.01 };  // == tier_5_25
const FAST_MODE_COSTS_LEGACY= { input: 30, output: 150, cacheWrite5m: 37.5, cacheWrite1h: 60, cacheRead: 3,   webSearch: 0.01 };  // Opus 4.6 / 4.7
const FAST_MODE_COSTS       = { input: 10, output: 50,  cacheWrite5m: 12.5, cacheWrite1h: 20, cacheRead: 1,   webSearch: 0.01 };  // == tier_10_50, Opus 4.8 / 5
const FALLBACK_COSTS        = BASE_OPUS_COSTS;

// Mapping: Dig→BASE_OPUS_COSTS, UIc→FAST_MODE_COSTS_LEGACY, a7n→FAST_MODE_COSTS, l7n→FALLBACK_COSTS
```

and selected by two functions:

```javascript
// ============================================
// getFastModeCostsForDisplay / getModelCostsForUsage
// Location: cli_inner_pretty.js:109713-109717 and :109772-109784
// ============================================

// ORIGINAL (for source lookup):
function zkt(e) {
  if (!vl()) return Fot[e] ?? l7n;
  if (e === "claude-opus-4-8" || e === "claude-opus-5") return a7n;
  return UIc;
}
function Dji(e, t) {
  let r = lo(e);
  if (t.speed === "fast") {
    if (r === "claude-opus-4-8" || r === "claude-opus-5") return a7n;
    if (r === "claude-opus-4-6" || r === "claude-opus-4-7") return UIc;
  }
  let n = Fot[r];
  if (n) return n;
  let o = xt().additionalModelCostsCache,
    i = o?.[e] ?? o?.[r];
  if (i) return i;
  return (Nig(e, r), Fot[lo(Z$())] ?? l7n);
}

// READABLE (for understanding):
function getFastModeCostsForDisplay(catalogueId) {
  if (!isFastModeBuildEnabled()) return ALL_MODEL_COSTS[catalogueId] ?? FALLBACK_COSTS;
  if (catalogueId === "claude-opus-4-8" || catalogueId === "claude-opus-5") return FAST_MODE_COSTS;       // 10/50
  return FAST_MODE_COSTS_LEGACY;                                                                          // 30/150
}

function getModelCostsForUsage(model, usage) {
  const id = normaliseToCatalogueId(model);
  if (usage.speed === "fast") {                                     // the API echoes back speed:"fast"
    if (id === "claude-opus-4-8" || id === "claude-opus-5") return FAST_MODE_COSTS;
    if (id === "claude-opus-4-6" || id === "claude-opus-4-7") return FAST_MODE_COSTS_LEGACY;
  }
  const baked = ALL_MODEL_COSTS[id];
  if (baked) return baked;
  const serverPushed = readConfig().additionalModelCostsCache;      // server-pushed rates for unknown ids
  const override = serverPushed?.[model] ?? serverPushed?.[id];
  if (override) return override;
  reportUnknownModelCost(model, id);                                // tengu_unknown_model_cost, :109786
  return ALL_MODEL_COSTS[normaliseToCatalogueId(getSessionModel())] ?? FALLBACK_COSTS;
}

// Mapping: zkt→getFastModeCostsForDisplay, Dji→getModelCostsForUsage, vl→isFastModeBuildEnabled,
//          Fot→ALL_MODEL_COSTS, a7n→FAST_MODE_COSTS, UIc→FAST_MODE_COSTS_LEGACY,
//          l7n→FALLBACK_COSTS, Nig→reportUnknownModelCost, lo→normaliseToCatalogueId, Z$→getSessionModel
```

**The reconciliation, stated plainly:**

| | base (`pricing` token) | fast mode | ratio |
|---|---|---|---|
| Opus 4.6 / 4.7 | `tier_5_25` → $5/$25 | `UIc` → **$30/$150** | 6× |
| Opus 4.8 / Opus 5 | `tier_5_25` → $5/$25 | `a7n` → **$10/$50** | 2× |

So `.219`'s "$10/$50 per Mtok" is the *fast-mode* rate and `tier_5_25` is the *standard* rate; both
are correct and neither is a multiplier of the other. `a7n`'s six numbers are byte-for-byte the
`tier_10_50` row at `:14022` — the same rates Fable 5 and Mythos 5 pay as their base — but `a7n` is a
**separate hard-coded literal**, not a catalogue lookup. That duplication is the one place the
rewrite did not finish: fast-mode pricing is still imperative.

**Why the 6× → 2× drop matters as a design signal.** Opus 4.6/4.7 fast mode was priced as a premium
capacity tier; Opus 4.8/5 fast mode is priced at only 2× base. Combined with §4 of
[`fast_mode.md`](fast_mode.md) (fast mode moving from opt-in-per-session toward a routine toggle),
the price change reads as fast mode graduating from "expensive escape hatch" to "normal mode of
operation for the flagship".

**`ALL_MODEL_COSTS` (`Fot`, `:109853`)** is where the catalogue and the imperative style collide:

```javascript
// ORIGINAL (:109853):
Fot = { [YO(kot.firstParty)]: a7n, [YO(ybc.firstParty)]: a7n, ...Oig() };
```

It seeds Fable 5 (`kot`) and Mythos 5 (`ybc`) with `a7n` and then spreads the catalogue-derived table
`Oig()` — which, because the spread comes **last**, overwrites both seeds with their catalogue
`tier_10_50` values. Since `tier_10_50 === a7n` numerically, the two seeds are currently dead code
that happens to agree with what replaces it. A latent bug if either value ever diverges.

`getModelCostsForUsage`'s tail is the interesting failure path: an unrecognised model consults
`additionalModelCostsCache` (server-pushed rates), and only if that misses does it emit
`tengu_unknown_model_cost` and fall back to **the session model's** costs. Charging one model's rates
to another is wrong, but it is bounded and observable — the telemetry event is the tripwire.

---

## 5. `.201` and the reverted mid-conversation-system hotfix

`2.1.201` was a single-bullet release: *"Claude Sonnet 5 sessions no longer use the mid-conversation
system role for harness reminders."* In the 2.1.220 bundle that statement is **false**. Three pieces
of evidence, all read in 220:

1. `claude-sonnet-5`'s `capabilities` array **contains `"mid_conv_system"`** at `:14207`, inside the
   entry spanning `:14177-14213`.
2. `Ser` (`supportsMidConversationSystem`, `:150505-150526`) has a hard exclusion list at
   `:150511-150522` naming `claude-3-*`, opus-4-0/4-1/4-5/4-6/4-7, sonnet-4-0/4-5/4-6, haiku-4-5 —
   and **`claude-sonnet-5` is not in it**.
3. Control therefore reaches `:150524`, `if (M$(r, "mid_conv_system") || r === "claude-mythos-5") return !0;`,
   which returns `true` for Sonnet 5.

The `.201` change *was* real. The 2.1.193 predicate is `TAn` at `:135283-135304 (193)` and it is
structurally identical to 220's `Ser` — same hipaa veto, same force-env, same `Uq(e,
"mid_conversation_system")` override, same 10-id exclusion list — except that where 220 consults the
catalogue, 193 hard-coded a *true-list*:

```javascript
// ORIGINAL (:135302 (193)):
if (n === "claude-fable-5" || n === "claude-mythos-5" || n === "claude-opus-4-8") return !0;
```

`claude-fable-5` was the pre-launch id for Sonnet 5, which is why removing this literal was the
`.201` fix. In 220 that line became the capability lookup at `:150524`.

**Careful with the count.** `mid_conv_system` is 220=5 / 193=1, but the single 193 hit is
`tengu_mid_conv_system_fallback_retry` at `:595123 (193)` — a *telemetry gate name* that merely
contains the substring, not a capability token. So the capability token itself is genuinely
**220=4 / 193=0** (`:14207` sonnet-5, `:14355` opus-4-8, `:14390` opus-5, `:14428` fable-5) plus the
one read at `:150524`. Do not read the `193=1` as partial pre-existence.

Two adjacent mechanisms worth recording:

- **`Ede(e, "mid_conversation_system")` at `:150508`** is a per-model settings override that
  short-circuits the entire list — an escape hatch that lets a specific model be flipped without a
  release. Paired with `CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM` at `:150507` (force-on) and the
  hipaa veto at `:150506` it gives three independent ways to override the model-derived answer. All
  three are **carryover** — 193 has them at `:135284-135287 (193)`.
- **`tengu_mid_conv_system_fallback_retry` (`:509912`, 220=1 / 193=1 — carryover)** shows there is a
  *retry* path when a mid-conversation system block is rejected upstream. The log line one line above
  (`:509909`) spells out the behaviour: *"[mid-conv-system] server rejected role:\"system\" — falling
  back to a body with no {role:\"system\"} turn, sticky-rejecting the beta until /clear or /compact"*.
  A model that declares the capability but whose backend refuses it therefore degrades gracefully and
  *stops trying for the rest of the session*. That sticky fallback is what makes it safe to
  re-enable the capability optimistically — which is plausibly why the `.201` hotfix could be
  reverted at all.

**Classification: DELTA-with-reversion.** Recording this as "implemented" would be wrong; recording
it as "never happened" would also be wrong. The `.201` code change shipped, and a later release in
the same window restored the behaviour by a different route.

---

## 6. Promo pricing (`.197`) is a server-controlled string, not a baked rate

```javascript
// ============================================
// buildSonnet5PromoPricing / buildPricingSuffix - the promo path and the normal path
// Location: cli_inner_pretty.js:120043-120054
// ============================================

// ORIGINAL (for source lookup):
function wug() {
  let e = vBc(kBc());
  if (e === void 0) return;
  return { pricing: `$2/$10 per Mtok \xB7 promo through ${e}`, promoListPrice: "$3/$15" };
}
function Goe(e, t) {
  if (!t && uGr()) {
    let r = YO(e) === "claude-sonnet-5" ? wug() : void 0;
    if (r !== void 0) return { pricingSuffix: ` \xB7 ${r.pricing}`, promoListPrice: r.promoListPrice };
  }
  return { pricingSuffix: _5r(t, e) };
}

// READABLE (for understanding):
function buildSonnet5PromoPricing() {
  const endDate = formatPromoDate(getActivePromoEndDateFromFlag());   // "Aug 31" or undefined
  if (endDate === undefined) return undefined;
  return { pricing: `$2/$10 per Mtok · promo through ${endDate}`, promoListPrice: "$3/$15" };
}

function buildPricingSuffix(model, fastMode) {
  if (!fastMode && usesFirstPartyPricing()) {
    const promo = normaliseToCatalogueId(model) === "claude-sonnet-5" ? buildSonnet5PromoPricing() : undefined;
    if (promo !== undefined)
      return { pricingSuffix: ` · ${promo.pricing}`, promoListPrice: promo.promoListPrice };
  }
  return { pricingSuffix: buildRatePricingSuffix(fastMode, model) };   // _5r, :111181-111187
}

// Mapping: wug→buildSonnet5PromoPricing, Goe→buildPricingSuffix, vBc→formatPromoDate,
//          kBc→getActivePromoEndDateFromFlag, uGr→usesFirstPartyPricing,
//          YO→normaliseToCatalogueId, _5r→buildRatePricingSuffix
```

The date comes from the feature-flag payload, and **expires itself**:

```javascript
// ORIGINAL (:119957-119962):
function kBc() {
  let e = Jx()?.cedar_basin;
  if (typeof e !== "string" || e.trim() === "") return;
  let t = bJn(e);
  return Date.now() < t ? e : void 0;
}
```

`cedar_basin` is **220=1 / 193=0** and its only occurrence is this read. `bJn` (`:119786-119791`) is a
lenient ISO parser that inserts the `T` and appends `Z` when a bare `YYYY-MM-DD HH:MM` form arrives —
so the flag can carry a date, a datetime, or a datetime with an offset.

**Design consequences:**
- The changelog's "promotional pricing of $2/$10 per Mtok through August 31, 2026" has **no `August 31`
  literal in the bundle**. `$2/$10 per Mtok` is 220=1 / 193=0 and lives only at `:120046`; the date is
  server data. Every existing scoping pass that marked the promo **SERVER_SIDE** was right about the
  date and slightly wrong about the price — the price *is* baked, the window is not.
- `promoListPrice: "$3/$15"` matches the catalogue's `tier_3_15` (`:14201`), so the strikethrough
  list price is consistent with the standard rate. It is a **hard-coded string**, not derived from the
  tier — another spot where the rewrite left an imperative duplicate.
- `!t && uGr()`: the promo is suppressed in fast mode (`t`) and when the session is not on first-party
  pricing (`uGr()` = `Dc()` = provider is `firstParty`, `:100349-100351`). That is the `.206` bullet
  *"the `/model` picker showed first-party prices on third-party providers"* — every pricing suffix now
  routes through this one guard. `promoListPrice` is **220=20 / 193=0**, so the whole
  list-price/promo-price concept is net-new in this window.

### Where the strikethrough is rendered — and `.219` bullet 20

```javascript
// ORIGINAL (:667096-667100):
let kAk = ((mrf ? (xjt.description ? `${xjt.description} \xB7 ${mrf}` : mrf) : xjt.description) ?? "")
  .replaceAll("Opus 5", to("claude", MYo)("Opus 5"))
  .replace(/\$[\d.]+\/\$[\d.]+ per Mtok/, (MMb) =>
    xjt.promoListPrice && pbn() && wt.level > 0 ? `${wt.dim.strikethrough(xjt.promoListPrice)} ${MMb}` : MMb,
  );
```

Two `.219` bullets land on these five lines:

- **Bullet 20, "the `/model` picker highlights only the newest model's name":**
  `.replaceAll("Opus 5", accent("Opus 5"))` — the accent colour is applied to the literal substring
  `"Opus 5"` only, anywhere it appears in any row description. Highlighting by *string match on the
  newest display name* rather than by a per-row `isNew` flag is why the scoping probe for `isNew` found
  nothing: there is no flag.

  > **Correction (second-pass verification).** An earlier draft of this section called the highlight
  > NET_NEW on the strength of `replaceAll("Opus 5"` being 220=1 / 193=0. That probe is too narrow.
  > 2.1.193 has the **same mechanism with a different target**:
  > `.replaceAll("Fable 5", xo("claude", h)("Fable 5"))` at `cli_inner_pretty.js:490616 (193)`.
  > A model-name-anchored `replaceAll(... , accent(...))` in the picker row mapper is therefore
  > **carryover**, and the true delta is that the highlighted literal moved `Fable 5` -> `Opus 5`,
  > i.e. it now tracks the newest *release* rather than the most expensive family. Verdict:
  > **DELTA (target changed)**, not NET_NEW. The bullet's word "only" implies an intermediate build
  > highlighted more than one name; neither endpoint of this window does (both are exactly one
  > `replaceAll` site), so that half of the claim cannot be confirmed or refuted from `.193`/`.220`
  > alone and is recorded as unverified.
- **The promo render:** the price regex `/\$[\d.]+\/\$[\d.]+ per Mtok/` matches whatever
  `buildPricingSuffix` produced and prefixes a dim strikethrough list price — but only when the row
  carries `promoListPrice`, `pbn()` allows it, and the terminal supports colour (`wt.level > 0`).
  On a no-colour terminal the strikethrough would be invisible, so it is suppressed entirely rather
  than emitted as confusing duplicate prices. Note `.replace` (not `replaceAll`): only the *first*
  price in a description is decorated.

---

## 7. `.219` bullet 10: the merged Opus row label

Bullet: *"`/model` picker showing the merged Opus row as 'Opus' instead of 'Opus (1M context)'."*
Probe: `Opus (1M context)` is **220=3 / 193=4** — the count went **down**, so this is a *removal*, not
an addition.

In 2.1.193 the label was patched after the fact, inside the "selected value is `opus`" branch of the
picker assembly:

```javascript
// ORIGINAL (:236012 (193)):
...t.map((l) => (l.value === "opus[1m]" && l.label === "Opus" ? { ...l, label: "Opus (1M context)" } : l)),
```

In 2.1.220 the equivalent branch (`:120548-120554`) has no such map:

```javascript
// ORIGINAL (:120548-120554):
} else if (i === "opus") {
  if (!rm()) {
    let l = EE();
    return dit(t.map((c) => (c.value === l ? { ...c, value: "opus" } : c)));
  }
  return dit([...t, DWi(!1)]);
} else if (i === "opus[1m]" && rm()) return dit([...t, PWi(!1)]);
```

The three surviving `Opus (1M context)` occurrences are all **row builders** that set the label
directly: `UBc()` `:120205`, `WBc()` `:120261`, `PWi()` `:120270`. So the fix was to delete a
post-hoc label rewrite and make each builder authoritative. **Verdict: DELTA (a removed patch), and
the bullet is accurate about the symptom while understating that the cause was a band-aid.**

---

## 8. `.219` bullet 9: the Fable "Requires usage credits" row

Bullet: *"Fixed the Fable model row showing 'Requires usage credits' for plans that include it."*
Probe: `Requires usage credits` is **220=1 / 193=2** — again *fewer* sites.

In 193 the suffix was appended inline in two unrelated places (`:235655 (193)`
`if (!cF() && yce()) t += " · Requires usage credits";` and `:350738 (193)`). In 220 it is a single
constant and a single idempotent re-computation:

```javascript
// ============================================
// fableCreditsSuffix / normaliseFableRowCreditsSuffix
// Location: cli_inner_pretty.js:120084-120091, constant at :120715
// ============================================

// ORIGINAL (for source lookup):
function YBc() {
  return !aZ() && K1e() ? kWi : "";
}
function Tug(e) {
  if (e.disabled === !0 || typeof e.value !== "string") return e;
  if (!(e.value === "fable" || e.value === "fable[1m]" || QQ(Wu(e.value)) === kot)) return e;
  let r = e.description.endsWith(kWi) ? e.description.slice(0, -kWi.length) : e.description;
  return { ...e, description: `${r}${YBc()}` };
}
…
kWi = " \xB7 Requires usage credits",     // :120715

// READABLE (for understanding):
function fableCreditsSuffix() {
  return !hasUsageCreditsProvisioned() && creditsRequiredForFable() ? CREDITS_SUFFIX : "";
}

function normaliseFableRowCreditsSuffix(row) {
  if (row.disabled === true || typeof row.value !== "string") return row;
  const isFableRow = row.value === "fable" || row.value === "fable[1m]"
                  || lookupLegacyConfigByAnyProviderId(strip1mAnd2m(row.value)) === FABLE_5_CONFIG;
  if (!isFableRow) return row;
  const base = row.description.endsWith(CREDITS_SUFFIX)
             ? row.description.slice(0, -CREDITS_SUFFIX.length)      // strip a server-sent suffix
             : row.description;
  return { ...row, description: `${base}${fableCreditsSuffix()}` };  // re-append only if still true
}

// Mapping: YBc→fableCreditsSuffix, Tug→normaliseFableRowCreditsSuffix, kWi→CREDITS_SUFFIX,
//          QQ→lookupLegacyConfigByAnyProviderId, Wu→strip1mAnd2m, kot→FABLE_5_CONFIG
```

**How the bug arose and how strip-then-re-append fixes it.** Fable rows can come from the *server*
(`$1e()`, the `additionalModelOptionsCache`), and a server row's `description` may already end with
the suffix — computed against the *server's* view of the account. If the local view disagrees
("this plan includes Fable"), the stale suffix would survive. `Tug` is applied to every
server-provided row at its single call site `:120508` and unconditionally recomputes: strip the
suffix if present, then re-append **only if the local predicate still says so**. Idempotent, and
correct in both directions. The identity check is deliberately three-way — the literal aliases
`fable`/`fable[1m]` plus any provider-specific Fable id resolved through the legacy config map — so a
server row naming `us.anthropic.claude-fable-5` is recognised too.

Note the *other* Fable credits path, `Gug()` (`:120656-120664`), which **disables** the row entirely
(`label: "Fable (disabled)"`) with a different string, `" — requires usage credits"` (em dash, no
`·`). Two visually similar strings with different meanings: `kWi` is advisory on an enabled row,
`Gug`'s is terminal on a disabled one. That distinction is why the counts do not simply collapse
to one.

---

## 9. Display names and the `[1m]` label rule

```javascript
// ORIGINAL (:111210-111216):
function Poe(e) {
  let t = lo(e),
    r = ww(t);
  if (!r) return null;
  let n = e.endsWith("[1m]") && r.context?.supports_1m_suffix ? " (1M context)" : "";
  return r.display_name + n;
}
```

`Poe` is the catalogue-driven display name: `display_name` plus " (1M context)" **only** when the id
literally ends in `[1m]` *and* the entry sets `supports_1m_suffix`. Because Sonnet 5 does not set that
flag (§1), `Poe("claude-sonnet-5[1m]")` returns plain `"Sonnet 5"` — which is correct, since Sonnet 5
is 1M natively and the suffix carries no extra meaning.

`mb` (`:111291-111299`) is the picker-facing variant with two extra rules:
`if (Hn() === "foundry") return;` (returns `undefined` on Foundry — Foundry model naming is
provider-controlled, so the client refuses to invent a display name), and an override map `nsg`
consulted before the catalogue. `nm` (`:111217-111226`) is the outermost fallback chain:
server/local row label → `Poe` → the raw id.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_models.md](../00_overview/symbol_additions_v2_1_220_models.md).

Key functions and data in this document:
- Sonnet 5 catalogue entry (`:14177-14213`) / Opus 5 catalogue entry (`:14365-14400`)
- `isOpus5PromptBundleEnabled` (`ZXn`, `:118700-118704`) - capability token + `tengu_fennel_godwit` kill switch
- `gateOrBundle` (`vQt`, `:118705-118707`) - 4-term OR: env → bundle → client data → gate
- `PROMPT_BUNDLE_GATE_NAMES` (`Vcg`/`zcg`/`Kcg`/`Ycg`/`Xcg`/`Jcg`/`Qcg`, `:118744-118750`)
- `isNative1mModel` (`IP`, `:150201-150209`) - `native_1m` + provider gating
- `native1mOnThirdParty` (`$xg`, `:150210-150222`) - per-channel opt-in; gateway is the intersection
- `has1mSuffix` (`Wb`, `:150197-150200`) / `supports1mBeta` (`Q8`, `:150232-150238`)
- `NO_1M_MODEL_IDS` (`Uot`, `:150223-150231`) - the hard 1M exclusion list
- `is1mContextDisabled` (`O6e`, `:150194-150196`) - `CLAUDE_CODE_DISABLE_1M_CONTEXT`
- `is1mAvailableForAccount` (`KO`, `:111188-111192`)
- `BASE_OPUS_COSTS` (`Dig`, `:109827-109834`) / `FAST_MODE_COSTS_LEGACY` (`UIc`, `:109835-109842`) / `FAST_MODE_COSTS` (`a7n`, `:109843-109850`) / `FALLBACK_COSTS` (`l7n`, `:109851`)
- `ALL_MODEL_COSTS` (`Fot`, `:109853`) - seeded then overwritten by `Oig()`
- `getFastModeCostsForDisplay` (`zkt`, `:109713-109717`)
- `getModelCostsForUsage` (`Dji`, `:109772-109784`) - `speed:"fast"` branch, server-pushed override, unknown-model telemetry
- `computeUsageCost` (`Lji`, `:109763-109771`) / `computeCacheWriteCost` (`$ig`, `:109756-109762`)
- `formatRatePair` (`M6e`, `:109807-109809`) / `formatDollars` (`BIc`, `:109803-109806`)
- `reportUnknownModelCost` (`Nig`, `:109785-109787`) - `tengu_unknown_model_cost`
- `supportsMidConversationSystem` (`Ser`, `:150505-150526`) - the `.201` reversion evidence
- `buildSonnet5PromoPricing` (`wug`, `:120043-120047`) / `buildPricingSuffix` (`Goe`, `:120048-120054`)
- `getActivePromoEndDateFromFlag` (`kBc`, `:119957-119962`) - reads `cedar_basin`, self-expiring
- `formatPromoDate` (`vBc`, `:119800-119805`) / `parseLenientDate` (`bJn`, `:119786-119791`)
- `buildRatePricingSuffix` (`_5r`, `:111181-111187`) - the non-promo suffix, with the `↯` glyph (`ECe`, `:58411`)
- `EMPTY_PRICING_SUFFIX` (`RWi`, `:120746`)
- `fableCreditsSuffix` (`YBc`, `:120084-120086`) / `normaliseFableRowCreditsSuffix` (`Tug`, `:120087-120091`) / `CREDITS_SUFFIX` (`kWi`, `:120715`)
- `disableFableRowsWithoutCredits` (`Gug`, `:120656-120664`)
- `getCatalogueDisplayName` (`Poe`, `:111210-111216`) / `getPickerDisplayName` (`mb`, `:111291-111299`) / `getAnyDisplayName` (`nm`, `:111217-111226`)
- Opus 5 picker rows: `XBc` (`:120147-120157`), `UBc` (`:120200-120210`), `WBc` (`:120258-120262`), `PWi` (`:120263-120275`), `DWi` (`:120244-120247`)
- Sonnet 5 picker rows: `AJn` (`:120055-120065`), `CWi` (`:120166-120175`), `QBc` (`:120276-120278`)
