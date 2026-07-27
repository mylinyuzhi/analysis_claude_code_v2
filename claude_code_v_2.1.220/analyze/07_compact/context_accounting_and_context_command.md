# Context accounting: window resolution, `/context`, and token counting

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Six changelog bullets in this window are about *numbers the client shows or acts on*, not about
compaction itself: `/context` reporting zeros on Bedrock, `/context` reporting stale usage, the context
window snapping to 200k, the context-usage indicator being expensive, and fork lineage across a
compaction break. They all land in one of three layers:

| Layer | Entry point (220) | Answers |
|---|---|---|
| **Raw context window** | `Xv` `:150239` | how many tokens does this model/session actually accept? |
| **Auto-compact window** | `o7` `:236986` | at what number do we start compacting, and *who decided that*? |
| **Breakdown / display** | `jLo` `:441581` | where did the tokens go, and what does `/context` draw? |
| **(measurement)** | `_Mt` `:442363` / `Hhr` `:441299` | how many tokens is this payload? |

The `.217` deletion of the Opus-4.8 conditional touches layers 2 and 3 as well; that half of the story
is in [`dispatcher_and_failure_breakers.md`](dispatcher_and_failure_breakers.md) §3 and is not repeated
here.

---

## 1. Layer 1 — the raw context window, and why it can read 200k

**What it does:** `Xv(model, betas)` returns the hard token capacity of the current model/session.

**How it works:**

```javascript
// ============================================
// getContextWindowTokens - the raw model context window, with a credits-blocked clamp
// Location: cli_inner_pretty.js:150239-150264
// ============================================

// ORIGINAL (for source lookup):
function Xv(e, t) {
  let r = fZc();
  if (r !== void 0) return r;
  if (m7i(e, t)) return gxe;
  return mZc(e, t);
}
function fZc() {
  if (Z.DISABLE_COMPACT) {
    let e = Z.CLAUDE_CODE_MAX_CONTEXT_TOKENS;
    if (e !== void 0 && e > 0) return e;
  }
  return;
}
function m7i(e, t) {
  return H9t() && fZc() === void 0 && mZc(e, t) > gxe;
}
function mZc(e, t) {
  if (Wb(e)) return 1e6;
  if (t?.includes(v_e.header) && Q8(e)) return 1e6;
  if (IP(e)) return 1e6;
  let r = dro(e);
  if (r !== null) return r;
  let n = Z.CLAUDE_CODE_MAX_CONTEXT_TOKENS;
  if (n !== void 0 && n > 0 && !lo(vi(e)).startsWith("claude-")) return n;
  return ber;
}

// READABLE (for understanding):
function getContextWindowTokens(model, betaHeaders) {
  let override = getDisableCompactWindowOverride();
  if (override !== undefined) return override;                       // 1. explicit escape hatch
  if (isLongContextClampedToBaseline(model, betaHeaders)) return LONG_CONTEXT_CLAMP;  // 2. 200000
  return getNativeContextWindow(model, betaHeaders);                 // 3. the real answer
}
function getDisableCompactWindowOverride() {
  if (env.DISABLE_COMPACT) {                                         // ONLY honoured with compaction off
    let max = env.CLAUDE_CODE_MAX_CONTEXT_TOKENS;
    if (max !== undefined && max > 0) return max;
  }
  return undefined;
}
function isLongContextClampedToBaseline(model, betaHeaders) {
  return isLongContext1mCreditsBlocked() &&                          // runtime flag from the API
         getDisableCompactWindowOverride() === undefined &&
         getNativeContextWindow(model, betaHeaders) > LONG_CONTEXT_CLAMP;
}
function getNativeContextWindow(model, betaHeaders) {
  if (isNative1mModel(model)) return 1e6;                            // catalogue `native_1m: !0`
  if (betaHeaders?.includes(CONTEXT_1M_BETA.header) && supports1mBeta(model)) return 1e6;
  if (isForced1mContext(model)) return 1e6;
  let clientDataOverride = getSonnet46WindowOverride(model);         // gate `kelp_forest_sonnet`
  if (clientDataOverride !== null) return clientDataOverride;
  let envMax = env.CLAUDE_CODE_MAX_CONTEXT_TOKENS;
  if (envMax !== undefined && envMax > 0 && !normalizeModelId(resolveModelId(model)).startsWith("claude-"))
    return envMax;                                                   // non-Claude (gateway) models only
  return DEFAULT_CONTEXT_WINDOW;                                     // 200000
}

// Mapping: Xv→getContextWindowTokens, fZc→getDisableCompactWindowOverride,
//          m7i→isLongContextClampedToBaseline, mZc→getNativeContextWindow,
//          H9t→isLongContext1mCreditsBlocked, gxe→LONG_CONTEXT_CLAMP, ber→DEFAULT_CONTEXT_WINDOW,
//          dro→getSonnet46WindowOverride, Wb→isNative1mModel, Q8→supports1mBeta, IP→isForced1mContext
```

Constants at `:150314-150318`: `ber = 200000`, `gxe = 200000`, `Mxg = 32000`, `Oxg = 128000`,
`Nxg = 1e6`. Note `ber` and `gxe` are **two separate constants with the same value** — the default
window and the credits-blocked clamp. They coincide today; the code does not assume they must.

### The `.208` bullet: "context window briefly resetting to 200k after an auto-update"

> `.208`: *"Fixed the context window briefly resetting to 200k after an auto-update, which showed a
> false 100% context used."*

**Verdict: DELTA, mechanism identified, exact fix line NOT isolated.** The scoping pass filed this
UNANCHORED (`cachedContextWindow` 0/0, `2e5|200000` 32/16). I can improve on that but not close it.

The mechanism that produces the symptom is `H9t()` (`:3066-3068`), a plain session-state read:

```javascript
function H9t() { return Ot.longContext1mCreditsBlocked; }        // :3066
function CSi(e) { Ot.longContext1mCreditsBlocked = e; }          // :3069
```

`longContext1mCreditsBlocked` is **220=3 / 193=3** — carryover. It is a **runtime flag written from an
API response**, so its value is *unknown* until the first request of a new process completes. After an
auto-update the process restarts; until the flag is repopulated, `Xv` falls through `m7i` to `mZc`,
and any consumer that reads the window *before* the catalogue/flag state settles gets `ber = 200000`
instead of `1e6` — which, against a 400k-token 1M conversation, renders as "100 % context used".

What *is* new in 220 and points at the fix is the **persisted window cache**:
`autoCompactWindowsCache` is **220=5 / 193=4**, and the new site is `:150270`:

```javascript
function gZc() {                                       // :150268-150271
  if (Hn() !== "firstParty") return null;
  return xt().autoCompactWindowsCache ?? null;
}
```

The other four sites are the cache's writer and invalidator: `:450435`, `:450462`, `:450488` (the
clientdata sync, which only overwrites when `!e || Jg(...)`), and `:495151`
(`s.autoCompactWindowsCache = void 0`, an explicit invalidation). So 220 added a **read of the persisted
cache from the window resolver**, giving a value to use across the restart window. That is exactly the
right shape for this bullet, but I did not find a 193↔220 diff proving the read is what fixed the
symptom, so I record it as the probable mechanism rather than the anchor. Anyone continuing should
diff `:150265-150290` against 193's `:134780-134830 (193)` statement by statement.

**Note for `47_models`:** `gZc` is gated on `Hn() !== "firstParty"` — the cached windows are only
consulted for first-party auth. A Bedrock or Vertex session gets `null` and always recomputes.

---

## 2. Layer 2 — the auto-compact window and its six sources

**What it does:** `o7(model, settingsWindow)` returns `{ window, configured, source }` — the token count
at which auto-compaction starts, and a provenance tag. `source` is the single most load-bearing value in
the compaction subsystem: three different predicates branch on it.

**How it works — a strict six-tier ladder (`:236986-237007`), first match wins:**

| # | `source` | Condition | Line |
|---|---|---|---|
| 1 | `env` | `CLAUDE_CODE_AUTO_COMPACT_WINDOW` parses and is not `invalid` | `:236990-236995` |
| 2 | `settings` | the caller passed a configured window | `:236997` |
| 3 | `clientdata` | remote `rowan_thicket` table or the persisted windows cache | `:236998-236999` |
| 4 | `experiment` | `Bds` — the Opus-4.8 `amber_redwood` gate | `:237000-237001` |
| 5 | `model-default` | `o < 1e6 && ($ny.has(model) \|\| m7i(model, betas))` → clamp to `gxe` | `:237002-237003` |
| 6 | `model-default` | per-model table `Ony` (unless clientdata `replacesDefault`) | `:237004-237005` |
| 7 | `auto` | nothing configured — use the whole window | `:237006` |

Every tier returns `window: Math.min(rawWindow, configured)`, so a configured value can only ever
*lower* the trigger point, never raise it above the model's real capacity. That invariant is repeated
six times rather than factored out — deliberate, because tier 1 and tier 5 use different `configured`
values (`c` vs `gxe`) and factoring would have obscured that.

### The 1M-context arithmetic, and what changed

Tier 5 is where 1M models get special-cased, and it is where this window's model work shows up:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| the model set | `o8d = new Set(["claude-sonnet-4-6", "claude-opus-4-6"])` `:235125 (193)` | `$ny = new Set(["claude-sonnet-4-6", "claude-opus-4-6", "claude-opus-4-8", "claude-opus-5"])` `:237103` |
| the guard | `o < 1e6 && (o8d.has(n) \|\| …)` | `o < 1e6 && ($ny.has(r) \|\| m7i(e, n))` `:237002` |
| the per-model table | `BXi = {}` `:235122 (193)` — **empty** | `nOu = { "claude-sonnet-5": { surfaces: { remote_cowork: { default: 500000 }, "local-agent": { default: 500000 } }, default: 967000 } }` `:237096-237101` |

Two genuine deltas:

1. **The model set doubled**, adding `claude-opus-4-8` and `claude-opus-5`. Combined with the
   `.217` deletion of `P7`, this is the *positive* half of the Opus-4.8 fix: 4.8 now gets a real
   model-default auto-compact window instead of falling to `source: "auto"`.
2. **The per-model table went from empty to one entry.** `967000` is **220=1 / 193=0**.

The `967000` figure deserves a paragraph because it is the clearest statement of the 1M-context
compaction math in the bundle. Sonnet 5's catalogue window is `1e6`
([`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §1). `1e6 - 967000 =
33,000` — the auto-compact trigger sits 33k below the hard ceiling. Compare the generic reserve
`sOu = 20000` (`:237077`) subtracted by `vSe` (`:237014-237019`). So Sonnet 5's effective headroom is
~33k rather than 20k, i.e. **the 1M models are given a larger absolute buffer**, which is the correct
scaling: the tail of a 1M conversation contains proportionally larger tool results, and one more turn
before the ceiling costs more tokens than it does at 200k.

The `surfaces` dimension is the subtler part. `aOu` (`:236956-236968`) resolves a table entry against
**two** axes:

```javascript
// ============================================
// resolveSurfaceScopedWindow - per-entrypoint, per-surface auto-compact window resolution
// Location: cli_inner_pretty.js:236956-236968
// ============================================

// ORIGINAL (for source lookup):
function aOu(e) {
  if (typeof e === "number") return e;
  if (typeof e !== "object" || e === null || Array.isArray(e)) return;
  let { surfaces: t, ...r } = e,
    n = Ca(),
    o = Z.CLAUDE_CODE_ENTRYPOINT,
    i = o && t && Object.hasOwn(t, o) ? t[o] : void 0;
  if (i) {
    let s = oOu(i, n);
    if (s !== void 0) return s;
  }
  return oOu(r, n);
}

// READABLE (for understanding):
function resolveSurfaceScopedWindow(entry) {
  if (typeof entry === "number") return entry;                       // scalar shorthand
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) return undefined;
  let { surfaces, ...byPlatform } = entry,
    platform = getPlatformKey(),                                     // e.g. darwin / win32
    entrypoint = env.CLAUDE_CODE_ENTRYPOINT,                         // e.g. "remote_cowork", "local-agent"
    surfaceEntry = entrypoint && surfaces && Object.hasOwn(surfaces, entrypoint)
      ? surfaces[entrypoint] : undefined;
  if (surfaceEntry) {
    let byPlatformValue = pickPlatformOrDefault(surfaceEntry, platform);
    if (byPlatformValue !== undefined) return byPlatformValue;       // surface wins if it has a value
  }
  return pickPlatformOrDefault(byPlatform, platform);                // else fall back to the top level
}

// Mapping: aOu→resolveSurfaceScopedWindow, oOu→pickPlatformOrDefault, Ca→getPlatformKey,
//          Z.CLAUDE_CODE_ENTRYPOINT→entrypoint
```

So Sonnet 5 auto-compacts at **967,000** in a normal CLI session but at **500,000** under the
`remote_cowork` and `local-agent` entrypoints. **Why?** Those two surfaces run many sessions inside one
host process (see [`../36_background_agents/`](../36_background_agents/)); a 967k live context per
session is a resident-memory problem for the host, not just a cost problem for the turn. Halving the
trigger halves the steady-state footprint at the price of more frequent summarization. This is a
*memory* trade-off expressed as a *token* constant, which is why it is easy to miss.

`Ony` (`:236969-236973`) — the accessor — short-circuits on `!KI()` (auto-compact disabled), so the
whole table is inert when compaction is off.

---

## 3. Layer 3 — the `/context` breakdown

`jLo` (`:441581`) builds the `{ categories, grid }` payload that both `/context` renderings consume. It
is called from exactly two places (both new-shaped in 220, see §3.3):

- `:674075` — the interactive `local-jsx` command (`cUs`, `:452674`, *"Visualize current context usage
  as a colored grid"*).
- `:452654` (`igr` `:452639`) — the non-interactive `local` command (`uUs`, `:452683`, *"Show current context
  usage"*), which renders the markdown table at `:452515-452545`.

The two command objects are mutually exclusive on `yn()` (is-non-interactive): `cUs.isEnabled = () =>
!yn()`, `uUs.isEnabled() { return yn() }` (`:452677`, `:452689`). One name, two implementations,
selected by session type.

### 3.1 The category ladder and the "Messages" clamp

Categories are pushed in a fixed order (`:441629-441636`): System prompt → System tools → MCP tools →
MCP tools (deferred) → System tools (deferred) → Custom agents → Memory files → Skills → *buffer* →
Messages → Free space. Everything except Messages is measured directly. **Messages is derived**, and the
derivation is the interesting part:

```javascript
// :441643-441648
if (T !== null) {
  let Pt = ne.reduce((lr, It) => lr + (It.isDeferred ? 0 : It.tokens), 0),   // sum of fixed categories
    mt = m - Pt - te,                                                        // window - fixed - buffer
    gr = qMd(E, kT(p));                                                      // tokens since last compact anchor
  oe = Math.max(0, Math.min(Math.max(0, T - Pt) + gr, mt));
}
```

`T` is the last real API usage total (`input + cache_creation + cache_read`, via `khr` `:442517`).
So the Messages bucket is *not* a token count of the message array — it is
**(what the API last charged us) − (what we can account for statically) + (tokens added since the last
compaction boundary)**, clamped into `[0, window − fixed − buffer]`.

**Why derive rather than measure?** Measuring means an API `count_tokens` round trip on every render.
Deriving means `/context` is exact for everything the server has already seen and only estimates the
delta since the last request. The clamp is what makes it safe: without it, a stale `T` from before a
compaction would produce a Messages figure larger than the whole window and a negative Free space.

`qMd` (`:442600-442604`) is compaction-aware and is byte-equivalent to 193's `JXi` (`:235375 (193)`):

```javascript
function qMd(e, t) {
  let r = eOd(e),                                    // index of the last compact boundary
    n = r ? e.slice(r.anchorIndex + 1) : [...e];     // everything after it
  return ZL(NN(n), t);
}
```

### 3.2 The grid, and the 1M special case

```javascript
// :441673-441677
let Ae = s && s < 80,          // narrow terminal
  Ce = m >= 1e6,               // 1M-context model
  Ne = Ae ? 5 : Ce ? 20 : 10,  // columns
  ge = Ce ? 10 : Ae ? 5 : 10,  // rows
  Oe = Ne * ge;                // 200 squares at 1M, 100 normally, 25 when narrow
```

**Carryover** — 193 `:470739-470740` has the identical branch (`_e = f >= 1e6 ? (ge ? 5 : 20) : ge ? 5 : 10`).
`m >= 1e6` is 220=2 / 193=1, but the second 220 hit is unrelated. Do not attribute the 1M grid to
`.197`; [`_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md) already flags the whole 1M
plumbing as pre-`.197`.

The square allocation has one asymmetry worth naming (`:441674-441677`, allocation at `:441675`): every category gets
`Math.max(1, round(tokens/window * squares))` — a floor of one square — **except** `Free space`, which
gets a bare `round(...)`. A category with 0.1 % of the window still draws; free space is allowed to
round to zero. That is what makes "the grid is full" visually true at 100 %.

### 3.3 The `originalMessages` refactor is NOT the `.218` fix — a false delta I have to flag

> `.218`: *"Fixed `/context` reporting stale pre-compact token usage after compacting from the message
> picker."*

`originalMessages` greps **220=3 / 193=0**, which reads as a clean net-new anchor. It is not a
behavioural delta. In 2.1.193 `GYn` took **eleven positional parameters** (`:470668 (193)`) and both
callers passed the same normalised list twice — once as `e`, once as the ninth positional argument
(`:499733-499744 (193)`, `:499777-499789 (193)`). 2.1.220 collapsed the tail into an options object,
which gave that ninth argument a *name*:

```javascript
// 220 :452654-452660 (non-interactive) — the same value passed twice, now named
return jLo(c, n, async () => u.toolPermissionContext, o, i, {
  toolUseContext: { … },
  originalMessages: c,        // <- `c` is also the first argument
  configuredWindow: u.autoCompactWindow,
  excludeDynamicSections: l,
});
```

And the slicer both callers use is **byte-identical carryover**:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| slicer | `yy` `:601955-601958 (193)` | `FE` `:533381-533384` |
| body | `let n = aXn(e); return n === -1 ? e : e.slice(n);` | `let r = OUo(e); return r === -1 ? e : e.slice(r);` |
| boundary finder | `aXn` | `OUo` `:533374-533380` — reverse scan for `X0(msg)` |
| interactive wrapper | `F_f(e) { return yy(e); }` `:499708 (193)` | `E2b(e, t = []) { return FE(e); }` `:674050` |

Both builds already sliced the message list from the last compact boundary before computing
`/context`. **So `originalMessages` 3/0 is an argument-shape artefact, and I could not anchor the
`.218` bullet.** I am recording it as UNANCHORED rather than claiming the refactor.

The one thing I can say about where the residual staleness lives: `khr` (`:442517-442530`, identical to
193's `hat` `:235307 (193)`) scans **backwards for the last message carrying a usage record** and is
*not* bounded by the compact boundary. After a picker-driven compaction the post-compact list has no
assistant usage yet, so `khr` walks past the boundary into a pre-compact message and returns its
`input_tokens`. That is precisely the reported symptom, and the fix would be to bound `khr`'s scan the
way `qMd` bounds its own. Neither build does. If the bullet is real client-side, the fix is in the
caller that decides *when* to pass `originalMessages`, not in anything I could isolate by literal.

### 3.4 `analysisOnly` — a real net-new, and it is a side-effect fix

`analysisOnly` is **220=9 / 193=0**, and the `/context` site is `:441593`:

| | 2.1.193 `:470672` | 2.1.220 `:441593` |
|---|---|---|
| | `g = await tL(r, d, void 0, { excludeDynamicSections: u })` | `y = await I4(n, p, void 0, { excludeDynamicSections: d, analysisOnly: !0 })` |

**What it does:** tells the system-prompt builder that this invocation is a *measurement*, not a real
prompt assembly, so it must not mutate session state.

**How it works:** the flag is threaded to the memory-prompt builders `XVr` (`:161743`) and `iou`
(`:161881`), where it guards exactly two things:

1. `if ((await pbe(y), Lxe(y, { memory_type: Ee("auto") }), be("memory_load_prompt"), !r)) Gst(!1);`
   (`:161749`) — `Gst` (`:161289-161291`) is `Jnu = e`, a **module-level assignment** read back by
   `N$e()` (`:161292-161294`). Rendering `/context` used to overwrite the session's memory
   prompt-variant selection.
2. `...(r || Axe() || Z.CLAUDE_COWORK_MEMORY_GUIDELINES?.trim() ? {} : { prompt_variant: Ee("base") })`
   (`:161886`) — the telemetry payload drops `prompt_variant` under `analysisOnly`, so analysis renders
   no longer pollute the memory-variant metric.

**Why this belongs to the `.203` perf bullet, partially.** The `.203` bullet is *"Reduced memory usage
and per-turn CPU: the context-usage indicator was re-analyzing the whole transcript every turn."*
`analysisOnly` does not stop the transcript walk — it stops the walk's **side effects**. The general
per-turn machinery for `.203` is owned by [`../50_performance/`](../50_performance/); what belongs here
is the narrower observation that *the context-usage path was previously not idempotent*, which is a
correctness bug hiding inside a performance bullet. A repeated `/context` in 2.1.193 could change what
the next real prompt contained.

Other `analysisOnly` sites: `:441351`, `:503568`, `:503574`, `:503606`, `:503717`, `:507729`
(`oR(\`memory${s}\`, () => XVr(t, { analysisOnly: n?.analysisOnly }))` — the memoised section builder).

---

## 4. Layer 4 — token counting, and the real `.196` Bedrock fix

> `.196`: *"Fixed `/context` showing 0 tokens for all tool groups on Bedrock."*

**Verdict: NET_NEW, and the anchor is a nine-line field-stripper nobody would grep for.** The scoping
pass filed this UNANCHORED after probing `toolGroups` (0/0), `tool group` (0/0) and `countTokens`
(15/13). None of those is the anchor.

### The counting stack

```
gmt   :441315  countToolDefinitionTokens   — per-group tool token count, logs a warning on 0/null
Hhr   :441299  countTokensWithFallback     — primary, then a create-with-max_tokens:1 estimator
_Mt   :442363  countTokensPrimary          — Bedrock branch, else beta.messages.countTokens
wo_   :442436  countTokensBedrock          — AWS CountTokensCommand
cBs   :442390  countTokensByCreateProbe    — fallback estimator
QMd   :442351  stripNonCountableToolFields — *** NEW ***
```

`gmt` (`:441315-441327`) is the function that produces the "MCP tools" / "System tools" / "Custom
agents" numbers, and it already contains the tell:

```javascript
let i = await Hhr([], o);
if (i === null || i === 0) {
  let s = e.map((a) => a.name).join(", ");
  w(`countToolDefinitionTokens returned ${i} for ${e.length} tools: …`);
}
return i ?? 0;
```

`return i ?? 0` — **a null count renders as 0 tokens.** That is the exact symptom, and it is
carryover (`countToolDefinitionTokens returned` is 220=1 / 193=1). So the bug was upstream: something
made `Hhr` return null on Bedrock *specifically for payloads carrying tools*.

### The fix

```javascript
// ============================================
// stripNonCountableToolFields - removes Claude-API-only tool fields before any token count
// Location: cli_inner_pretty.js:442351-442358
// ============================================

// ORIGINAL (for source lookup):
function QMd(e) {
  if (e.length === 0) return e;
  return e.map((t) => {
    let { eager_input_streaming: r, defer_loading: n, strict: o, ...i } = t;
    if (r === void 0 && n === void 0 && o === void 0) return t;
    return i;
  });
}

// READABLE (for understanding):
function stripNonCountableToolFields(tools) {
  if (tools.length === 0) return tools;
  return tools.map((tool) => {
    let { eager_input_streaming, defer_loading, strict, ...rest } = tool;
    if (eager_input_streaming === undefined && defer_loading === undefined && strict === undefined)
      return tool;            // identity-preserving: unchanged objects keep their reference
    return rest;
  });
}

// Mapping: QMd→stripNonCountableToolFields, e→tools, t→tool, i→rest
```

Called at **both** count entry points — `:442365` (`_Mt`) and `:442392` (`cBs`) — before the tools array
reaches either the cache key or the wire.

**Evidence it is new:** the destructure `eager_input_streaming: r, defer_loading` is **220=1 / 193=0**.
The fields themselves exploded in this window: `eager_input_streaming` **220=17 / 193=3**,
`defer_loading` **220=15 / 193=8**.

**Why it fixes Bedrock and not first-party.** `eager_input_streaming`, `defer_loading` and `strict` are
Claude-API tool-schema extensions. The first-party `beta.messages.countTokens` endpoint tolerates them.
The Bedrock path does not go through that endpoint at all — `wo_` (`:442436-442454`) hand-builds an
InvokeModel body and ships it through the AWS SDK's `CountTokensCommand`:

```javascript
let a = {
    anthropic_version: "bedrock-2023-05-31",
    messages: t.length > 0 ? t : [{ role: "user", content: "foo" }],
    max_tokens: o ? XMd : 1,
    ...(r.length > 0 && { tools: r }),
    ...
  },
  { CountTokensCommand: l } = await Promise.resolve().then(() => (Nzn(), r4i)),
  c = { modelId: s, input: { invokeModel: { body: new TextEncoder().encode(Ie(a)) } } };
return (await i.send(new l(c))).inputTokens ?? null;
```

Bedrock validates the `invokeModel` body against its own schema. An unknown key in a tool definition
rejects the whole request, `wo_`'s `catch` logs `Bedrock CountTokens failed:` (`:442452`) and returns
`null`, `Hhr` returns null, `gmt` coerces to `0` — **every tool group renders 0**, which is the bullet
verbatim. Because the failure is per-*request* and every group's request carries tools, all groups zero
simultaneously rather than one at a time. That "all" is the diagnostic fingerprint.

**Why strip rather than branch on provider?** `QMd` is applied unconditionally, on the first-party path
too. Two reasons visible in the code: (a) it is also applied to the **cache key** (`hBs(e, n, …)`), so
two tool arrays differing only in `defer_loading` share a cached count — correct, since those fields do
not affect token count; (b) a provider branch would have to be repeated at both call sites and updated
for every new provider channel. The identity-preserving fast path (`if all three undefined return t`)
means the common case allocates nothing.

**Carryover in the same cluster, do not present as new:** `countTokensWithFallback` 4/4; the
`haiku fallback` log trio 3/3; the Bedrock *branch itself* (`if (ny(o) === "bedrock")` `:442371`) has a
193 twin at `:471418 (193)`; `cBs` (`:442390`) matches 193's `kSl` (`:471440 (193)`) including the
Bedrock/Vertex model swap. The **only** other new thing here is the catch-block fallback at `:442384-442385`
— `if (… Cy()) return cBs(e, t).catch(() => null);` where `Cy()` (`:3459`) is `Ot.gatewayAuth` — i.e.
a gateway session now falls back to the create-probe estimator instead of returning null. 193's catch
returned null unconditionally.

---

## 5. The `.218` fork-lineage bullet — the recorded anchor is wrong, the real one is a schema comment

> `.218`: *"Fixed fork-session lineage being lost after compaction in headless and SDK sessions."*

**Verdict: NET_NEW. The scoping anchor `:846491` is a mis-anchor.** `lineage` is 220=1 / 193=0 and its
single hit is:

```
"[print.ts] Input closed with active swarm, injected shutdown prompt — teardown handed to its lineage"   :846491
```

— an agent-swarm teardown log. Nothing to do with session forking. Citing it would be wrong.

The real mechanism is `logical_parent_uuid` / `logicalParentUuid`, and the bundle documents itself at
`:837055-837061`:

> `@internal uuid of the last pre-compact message — the backpointer forkSession follows across the
> compaction break. Distinct from the session-file chain parent (which is the post-compact summary).
> Absent from older producers.`

**What it does:** a compaction rewrites the session file so that the message following the boundary has
the *summary* as its parent. A fork taken after a compaction therefore inherits a lineage that stops at
the summary. `logical_parent_uuid` is a second, parallel backpointer to the last message *before* the
boundary, which `forkSession` follows instead.

**The delta is the emitter set, not the field.**

| | 2.1.193 | 2.1.220 |
|---|---|---|
| `logical_parent_uuid` | 3 | **5** |
| `logicalParentUuid` | 6 | **8** |
| schema declaration | `:699674 (193)` | `:837055` |
| wire→internal reader | `:689476 (193)` | `:763399` |
| **emitters** | `:618360 (193)` — one | `:653288` (the 193 twin), **`:841759`**, **`:842259`** |

The two new emitters are the ones the bullet names. Both build a `compact_boundary` event:

```javascript
// :841755-841760  and  :842254-842260 — identical shape, two different streams
yield {
  type: "system",
  subtype: "compact_boundary",
  session_id: kt(),
  uuid: no.uuid,
  compact_metadata: Zvr(no.compactMetadata),
  ...(no.logicalParentUuid !== void 0 && { logical_parent_uuid: no.logicalParentUuid }),
};
```

`:841759` is in the headless/`--print` message stream; `:842259` is in the SDK streaming iterator (whose
surrounding code at `:842250-842252` also splices the preserved-message segment back in). In 2.1.193
both emitted `compact_boundary` **without** the field, so an SDK consumer reconstructing session lineage
from the event stream had no way across the break — exactly "lineage lost after compaction in headless
and SDK sessions".

The conditional spread `...(x !== void 0 && { … })` is why the field is `Absent from older producers`
rather than `null`: consumers must treat absence and null differently, and the schema
(`Xl().nullable().optional()`, `:837055-837056`) allows both.

`tengu_session_fork` is **220=2 / 193=1**, but note
[`_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) flags it as FALSE-new in
the gate list — it exists in 193. Use `logical_parent_uuid` as the anchor, not the gate.
The SDK/headless transport side is [`../51_headless_sdk/`](../51_headless_sdk/)'s.

---

## 6. Two decoys in this area

### 6.1 `tengu_transcript_compact` is not conversation compaction

`tengu_transcript_compact` (220=7 / 193=0) and `tengu_transcript_compact_failed` (220=6 / 193=0) are
genuinely net-new gates, and the scoping pass attached `:523812` to `.215` #35 (*"`/context` warns when
the conversation exceeds the context window; a failed `/compact` now shows as an error"*).
**That is a mis-anchor.** Reading `:523780-523975` shows a **transcript-file garbage collector**: it
opens the `.jsonl` session file, copies the tail past a snapshot offset into a temp file, rewinds to the
last newline (`while (q > 0 && U[q - 1] !== 10) q--;` `:523952`), verifies the inode has not changed,
renames, and emits `O("tengu_transcript_compact", { bytesBefore: s.size, bytesAfter: P })` (`:523965`).
Its failure reasons are `snapshot_mid_line`, `preserved_uuid_missing`, `preserved_walk_broken`,
`source_changed`, `rename_fallback`, `io` — all file-level. It also self-tunes a backstop:
`this.backstopThresholdBytes = s.size - P < s.size * rB_ ? Math.min(this.backstopThresholdBytes * 2, tB_) : tbr`
(`:523963`) — if a compaction freed less than `rB_` of the file, double the threshold before trying
again, capped at `tB_`. That is a **disk** mechanism and belongs with
[`../50_performance/`](../50_performance/), not with `/compact`.

Separately, `exceeds the context window` is **220=0 / 193=0** — the changelog wording for `.215` #35 is
not a source string in either build. That half of the bullet is unanchored.

### 6.2 `compaction summary` proves nothing for the `/branch` bullet

> `.198`: *"Fixed `/branch` deriving its default fork name from the compaction summary instead of the
> first real prompt."*

`compaction summary` is **220=3 / 193=3**, and all three 2.1.220 hits are non-code: the
`autoCompactPrecompute` settings description at `:61472` and two bundled `claude-api` skill snippets
(`:790496`, `:791453`). The scoping pass's alternative anchor `--fork-name` is disqualified by
[`_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) — it is a `gh repo fork`
flag, not a Claude Code flag. **UNANCHORED from the compaction side**; the fork-name derivation belongs
to [`../43_slash_commands/`](../43_slash_commands/).

---

## 7. Verdict table for this document

| Item | Verdict | Anchor (2.1.220) | 220 / 193 |
|---|---|---|---|
| `.196` `/context` 0 tokens on Bedrock | **NET_NEW** | `QMd` `:442351`, applied `:442365`/`:442392` | destructure 1 / 0 |
| `.196` gateway count-tokens catch fallback | **NET_NEW** | `:442384` (`Cy()` `:3459`) | — |
| Bedrock `CountTokens` branch itself | **CARRYOVER** | `:442371`, `wo_` `:442436` | twin `:471418 (193)` |
| `.203` `/context` side-effect suppression | **NET_NEW** | `analysisOnly` `:441593`, `Gst` `:161289` | 9 / 0 |
| `.208` window resetting to 200k | **DELTA (mechanism only)** | `H9t` `:3066`, `gZc` `:150268` | `autoCompactWindowsCache` 5 / 4 |
| Sonnet-5 per-model window table | **NET_NEW** | `nOu` `:237096-237101` | `967000` 1 / 0 |
| model-default set gained 4-8 / opus-5 | **NET_NEW** | `$ny` `:237103` | 4 entries vs 2 |
| `/context` grid 1M branch | **CARRYOVER** | `:441673-441677` | twin `:470739 (193)` |
| `.218` `/context` stale pre-compact usage | **UNANCHORED** | — (`originalMessages` is a refactor) | 3 / 0, artefact |
| `.218` fork lineage after compaction | **NET_NEW** | `:841759`, `:842259`; schema `:837055` | 5 / 3 |
| `.215` `/context` exceeds-window warning | **UNANCHORED** | — (`:523812` is transcript-file GC) | literal 0 / 0 |
| `.198` `/branch` fork name | **UNANCHORED** | — (`compaction summary` is skill text) | 3 / 3 |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_compact.md](../00_overview/symbol_additions_v2_1_220_compact.md).

Key functions in this document:
- `getContextWindowTokens` (`Xv`, `:150239`) - raw window, with the credits-blocked clamp
- `getNativeContextWindow` (`mZc`, `:150255`) - the 1M ladder; falls through to `ber`
- `isLongContextClampedToBaseline` (`m7i`, `:150252`) - clamps to 200k when 1M credits are blocked
- `getDisableCompactWindowOverride` (`fZc`, `:150245`) - `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, only with `DISABLE_COMPACT`
- `isLongContext1mCreditsBlocked` (`H9t`, `:3066`) - runtime flag, unset until the first API response
- `DEFAULT_CONTEXT_WINDOW` (`ber`, `:150314`) - `200000`
- `LONG_CONTEXT_CLAMP` (`gxe`, `:150315`) - `200000`, a distinct constant
- `resolveAutoCompactWindow` (`o7`, `:236986`) - the six-tier `{window, configured, source}` ladder
- `getAutoCompactWindowsCache` (`gZc`, `:150268`) - persisted cache, first-party only
- `resolveModelDefaultWindow` (`Ony`, `:236969`) - reads `nOu`
- `resolveSurfaceScopedWindow` (`aOu`, `:236956`) - entrypoint × platform resolution
- `pickPlatformOrDefault` (`oOu`, `:236952`) - inner platform picker
- `MODEL_AUTO_COMPACT_WINDOWS` (`nOu`, `:237096`) - `{claude-sonnet-5: {default: 967000, surfaces: …}}`
- `MODEL_DEFAULT_WINDOW_MODELS` (`$ny`, `:237103`) - 4-model set (was 2)
- `AUTO_COMPACT_RESERVE_TOKENS` (`sOu`, `:237077`) - `20000`
- `getEffectiveAutoCompactWindow` (`vSe`, `:237014`) - window minus reserve
- `buildContextUsageBreakdown` (`jLo`, `:441581`) - the `/context` payload builder
- `collectContextData` (`igr`, `:452639`) - non-interactive `/context` entry
- `sliceFromLastCompactBoundary` (`FE`, `:533381`) - carryover slicer (193 `yy`)
- `findLastCompactBoundaryIndex` (`OUo`, `:533374`) - reverse scan
- `getLastApiUsage` (`khr`, `:442517`) - unbounded backward scan for the last usage record
- `countTokensSinceCompactAnchor` (`qMd`, `:442600`) - bounded, unlike `khr`
- `countToolDefinitionTokens` (`gmt`, `:441315`) - `return i ?? 0`, the zero-rendering site
- `countTokensWithFallback` (`Hhr`, `:441299`) - primary then create-probe
- `countTokensPrimary` (`_Mt`, `:442363`) - Bedrock branch + gateway catch fallback
- `countTokensBedrock` (`wo_`, `:442436`) - AWS `CountTokensCommand` over an InvokeModel body
- `countTokensByCreateProbe` (`cBs`, `:442390`) - `max_tokens: 1` estimator
- `stripNonCountableToolFields` (`QMd`, `:442351`) - **the `.196` fix**
- `hasGatewayAuth` (`Cy`, `:3459`) - guards the new catch-block fallback
- `setMemoryPromptVariantOverride` (`Gst`, `:161289`) - the side effect `analysisOnly` suppresses
- `buildAutoMemoryPrompt` (`XVr`, `:161743`) / (`iou`, `:161881`) - `analysisOnly` consumers
- `compactTranscriptFile` (`:523780-523975`) - transcript-file GC; **not** conversation compaction
