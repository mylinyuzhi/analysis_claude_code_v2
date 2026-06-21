# 1M-context-without-credits auto-compact-back (DELTA 2, 2.1.172)

> **DELTA module / deep dive.** This document analyses ONE change in the v2.1.156 → v2.1.183 compaction subsystem: the new "1M-context-without-credits" auto-compact-back mechanism. Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless it is explicitly labelled a v2.1.156 / v2.1.88 before-picture citation. For the surrounding architecture (threshold ladder, window resolver, dispatcher) that this delta plugs into but does **not** otherwise change, read the v2.1.156 baseline docs in [../../../claude_code_v_2.1.156/analyze/07_compact/](../../../claude_code_v_2.1.156/analyze/07_compact/), and the sibling delta docs [README.md](./README.md) (overview of all four deltas) and [window_resolver_six_sources.md](./window_resolver_six_sources.md) (the `model-default` source this delta also feeds).

---

## TL;DR

A session running a **1M-token context window** depends on the account having usage credits enabled for long context. If those credits run out (or were never enabled), the API answers with a `429` whose message says *"Extra usage is required for long context"* / *"Usage credits are required for long context"*. In v2.1.156 the client recognised that message and told the user to enable credits, but it did **nothing structural** — the model's context window stayed pinned at `1e6` for the rest of the session, so the conversation could never compact under a window it could actually afford. It was **permanently stuck**.

v2.1.183 (changelog 2.1.172) closes the loop. On the first such `429` it **latches a new session flag** `longContext1mCreditsBlocked` and emits a one-shot `tengu_1m_credits_clamp_activated`. From then on the model context-window hard cap (`getContextWindowForModel`, now `tH` @134105) **clamps a 1M model back down to the 200k standard window** (`jQ = 200000`). That single clamp point re-windows the entire threshold ladder, so the session immediately drops into the `compact`/`blocked` band for the smaller window and compacts under it. A second, independent consumer in the **reactive** lane (`DFi` @229611) treats a 1M-credits error encountered *during* a summarization call as a `prompt_too_long` event whose boundary is 200k, and a new telemetry event `tengu_compact_credits_clamp_rescue` reports whether that rescue ultimately succeeded.

This delta is the consumer side of DELTA 3's new `model-default` window source — the same `is1mClampActive` (`ARr`) predicate that flips `tH` to 200k also makes the resolver `z2` report `source: "model-default"`.

> Confidence: **high.** The trip site, the flag accessors, both clamp consumers (`tH` and `z2`), the reactive `DFi` boundary, and the new rescue telemetry were all read line-by-line in v2.1.183; the v2.1.156 before-picture (`Ov` with no clamp, inline-string-only 429 handling, and the 0-count greps for the flag / event / rescue) were verified directly.

---

## 1. The mechanism at a glance

```
                      429 "…required for long context"
                                   │
                  ┌────────────────┴─────────────────┐
                  │  $Cd (rate-limit error mapper)   │  cli_inner_pretty.js:229176
                  │  if Fwn(msg) && !N8e():           │  @229192  (trip, one-shot)
                  │     Wtr(true)                     │  set latch
                  │     emit tengu_1m_credits_         │  new telemetry
                  │           clamp_activated          │
                  └────────────────┬─────────────────┘
                                   │  Ot.longContext1mCreditsBlocked = true   (latched)
                  ┌────────────────┴─────────────────────────────────────────┐
                  ▼                                                            ▼
  ┌───────────────────────────────┐                       ┌──────────────────────────────────────┐
  │ getContextWindowForModel (tH) │  @134105              │ reactive-compact summarize result map  │
  │   if ARr(model,hdrs): return  │                       │   if DFi(msg): reason="prompt_too_long"│ @233039
  │      jQ (=200000)             │  @134108              │      tokenGap = $T(e) - jQ             │ @233040
  └───────────────┬───────────────┘                       │      viaCreditsBoundary = true        │ @233041
                  │ every downstream window consumer       └──────────────────┬───────────────────┘
                  │ reads through tH/z2                                        │
        ┌─────────┴──────────┐                              ┌─────────────────┴─────────────────┐
        ▼                    ▼                              │  if (g.viaCreditsBoundary) d=true  │ @233163
  z2 → source:          oee → effective                     │  on outcome: emit                  │
   "model-default"       window − reserve                   │   tengu_compact_credits_clamp_rescue│ @233110/125/144/173
   (DELTA 3)             → threshold ladder                 └────────────────────────────────────┘
```

There are therefore **two** clamp consumers, and they are deliberately at different altitudes:

- The **window-cap clamp** (`tH`/`ARr`) is *proactive*: once the flag is latched, every future window resolution for that 1M model returns 200k, so the ordinary threshold ladder decides to compact on the next turn.
- The **reactive-lane boundary** (`DFi`) is *reactive*: it handles the case where a summarization request *itself* hits the 1M-credits 429 mid-flight, converting it into a `prompt_too_long` with a 200k anchor so the group-walk can keep slicing toward a window the account can pay for.

---

## 2. Trip the flag — the 429 branch (`$Cd` @229176)

**What it does:** The rate-limit error mapper turns an API `Error` into a user-facing `tc({content, error})` result. v2.1.183 adds, inside its `429` branch, a one-shot latch + telemetry emission the first time it sees a 1M-credits error.

**How it works (step by step):**

1. The branch is entered only for a real API `429` (`e instanceof es && e.status === 429`, @229183).
2. `s = ant(Co())` is the "is this an interactive session" gate (only interactive sessions get the clamp — a non-interactive SDK caller is handled by its own path).
3. **The latch line** (@229192): `if (s && Fwn(e.message) && !N8e()) (Wtr(!0), G("tengu_1m_credits_clamp_activated", {}))`. The `!N8e()` guard makes this fire **exactly once** per session — once the flag is latched, every subsequent 1M-credits 429 skips the emission.
4. The branch then *also* returns a user-facing message (@229199-229207) telling the user to enable credits (`/usage-credits` or `claude.ai/settings/usage`) or `/model` to switch to standard context.

```javascript
// ============================================
// is1mCreditsError trip — latch the clamp flag on the first 1M-credits 429 (delta excerpt)
// Location: cli_inner_pretty.js:229183-229208 (trip @229192)
// ============================================

// ORIGINAL (for source lookup):
if (e instanceof es && e.status === 429) {
  let s = ant(Co()),
    i = AFi(e),
    a = s && pT(t) && e.message.toLowerCase().includes("usage credits are required") && !Fwn(e.message);
  if (s && i && !a) {
    let f = Fqr(i, t);
    if (f) return tc({ content: f, error: "rate_limit" });
    return tc({ content: QQ, error: "rate_limit" });
  }
  if (s && Fwn(e.message) && !N8e()) (Wtr(!0), G("tengu_1m_credits_clamp_activated", {}));   // 229192  TRIP
  if (a) { /* Fable-5 group-zero-credit branch, unrelated to 1M */ }
  if (s && Fwn(e.message)) {
    let f = xr()
      ? "turn on usage credits at claude.ai/settings/usage, or use --model to switch to standard context"
      : "run /usage-credits to turn them on, or /model to switch to standard context";
    return tc({ content: `${oE}: Usage credits required for 1M context \xB7 ${f}`, error: "rate_limit", errorDetails: e.message });
  }
  /* … generic 429 fallback … */
}

// READABLE (for understanding):
if (err instanceof ApiError && err.status === 429) {
  let isInteractive = isInteractiveSession(getConfig()),
    overageInfo = parseOverageHeaders(err),
    isFableGroupZero = isInteractive && modelIsFable(model)
                       && err.message.toLowerCase().includes("usage credits are required")
                       && !is1mCreditsError(err.message);   // Fable path explicitly EXCLUDES the 1M path
  if (isInteractive && overageInfo && !isFableGroupZero) { /* unified-overage branch */ }

  // === DELTA 2 trip ===
  if (isInteractive && is1mCreditsError(err.message) && !get1mCreditsBlocked()) {
    set1mCreditsBlocked(true);                        // latch the session flag (one-way false→true)
    emit("tengu_1m_credits_clamp_activated", {});     // NEW one-shot telemetry
  }

  if (isFableGroupZero) { /* … */ }
  if (isInteractive && is1mCreditsError(err.message)) {
    // user-facing remediation message (present in 156 too — see before-picture)
    let how = isWeb()
      ? "turn on usage credits at claude.ai/settings/usage, or use --model to switch to standard context"
      : "run /usage-credits to turn them on, or /model to switch to standard context";
    return makeResult({ content: `API Error: Usage credits required for 1M context · ${how}`, error: "rate_limit", errorDetails: err.message });
  }
  /* … */
}

// Mapping: $Cd->rateLimitErrorMapper, es->ApiError, ant·Co->isInteractiveSession·getConfig, Fwn->is1mCreditsError,
//   N8e->get1mCreditsBlocked, Wtr->set1mCreditsBlocked, G->emit, oE->"API Error", xr->isWeb
```

**The matcher** — `is1mCreditsError` (`Fwn`, `cli_inner_pretty.js:229606`):

```javascript
// ============================================
// is1mCreditsError - Match the two long-context-credits 429 message shapes
// Location: cli_inner_pretty.js:229606-229610
// ============================================

// ORIGINAL (for source lookup):
function Fwn(e) {
  return (
    e.includes("Extra usage is required for long context") || e.includes("Usage credits are required for long context")
  );
}

// READABLE (for understanding):
function is1mCreditsError(message) {
  return (
    message.includes("Extra usage is required for long context") ||
    message.includes("Usage credits are required for long context")
  );
}

// Mapping: Fwn->is1mCreditsError, e->message
```

**Why this approach (trip-side):**

- **One-shot latch, not per-request re-check.** Once the account is out of long-context credits, it stays out for the lifetime of the session; re-emitting the telemetry and re-clamping on every subsequent 429 would be noise. The `!N8e()` guard makes the *telemetry* one-shot; the latch itself is monotonic (`false → true`, never reset within the session by this path — see §6).
- **Interactive-only (`s`).** The clamp's whole point is to keep an *interactive* conversation alive by shrinking its window. A non-interactive SDK caller has no UI to prompt and a different rate-limit contract, so it is excluded here.
- **The string check is factored into a named function.** This is itself part of the delta: see the before-picture (§5) — v2.1.156 had the identical two-string `includes` test *inlined* in the 429 branch (for the user message only). v2.1.183 extracts it into `Fwn` precisely because it now needs to call the *same* predicate from a second, structural place (`DFi` in the reactive lane, §4) and from `is1mClampActive`'s data path.

**Key insight:** The trip site does two unrelated things in the same branch — it sets a long-lived structural flag (`Wtr(true)`) *and* it returns a transient user-facing error string. The structural effect (everything in §3/§4) outlives this single request; the string is just the immediate feedback. Note the Fable-5 path (`isFableGroupZero`, @229186) explicitly excludes `Fwn(e.message)` so a 1M-credits error is never mis-routed into the Fable group-zero-credit branch — the two credit systems are kept distinct.

### Related telemetry: `tengu_1m_credits_clamp_activated`

This event (emitted with an empty payload `{}` at @229192) is **new in v2.1.183** — `grep -c tengu_1m_credits_clamp_activated` over the v2.1.156 bundle returns **0**. It is the single observability signal that a session crossed from "1M-enabled" to "1M-blocked"; because of the `!N8e()` guard it fires at most once per session.

---

## 3. The session flag and its accessors

**What it does:** A single boolean on the global session-state object `Ot` records whether this session has been blocked from 1M context. Two thin accessors read and write it.

```javascript
// ============================================
// get1mCreditsBlocked / set1mCreditsBlocked - Session credits-clamp flag accessors
// Location: cli_inner_pretty.js:2965-2970 (init @2624)
// ============================================

// ORIGINAL (for source lookup):
function N8e() {
  return Ot.longContext1mCreditsBlocked;
}
function Wtr(e) {
  Ot.longContext1mCreditsBlocked = e;
}
// … and in the Ot session-state initializer:
//   longContext1mCreditsBlocked: !1,        // 2624

// READABLE (for understanding):
function get1mCreditsBlocked() {
  return sessionState.longContext1mCreditsBlocked;   // default false (init @2624)
}
function set1mCreditsBlocked(value) {
  sessionState.longContext1mCreditsBlocked = value;
}

// Mapping: N8e->get1mCreditsBlocked, Wtr->set1mCreditsBlocked, Ot->sessionState
```

**How it works:** `longContext1mCreditsBlocked` is initialized to `!1` (false) in the `Ot` session-state literal at `cli_inner_pretty.js:2624`, alongside the other per-session toggles (`sdkBetas`, `fableCreditsRequired`, the Fable-consent dialog flags). It is read by **three** consumers — `is1mClampActive` (`ARr`, §3a), the reactive boundary check `DFi` (§4), and the trip-site guard `!N8e()` (§2) — and written by exactly one (`Wtr`, called only from the trip site).

**Why a session flag (not, e.g., a header or a per-request computation):** The blocked state is a property of the *account+session*, not of any one request. A header would have to be re-parsed on every call; a per-request computation has nothing to compute from once the offending 429 has been consumed. A latched session flag is the cheapest way to make every downstream window consumer "remember" that this session can no longer use 1M, without threading the fact through every call site.

**Key insight:** Placing the flag on `Ot` (the same object that holds `sdkBetas`, used by `tH`'s second argument) means the clamp travels with the session's other model/context state. The flag is process-/session-scoped: a fresh session, or a session that switches to a model whose raw window is already ≤ 200k, is unaffected (the `gti(...) > jQ` guard in `ARr`, §3a, makes the clamp a no-op for non-1M models even when the flag is set).

### 3a. The clamp gate — `is1mClampActive` (`ARr` @134118)

**What it does:** Decides whether the 1M→200k clamp should fire for a given model+headers, combining the latched flag with two safety guards.

```javascript
// ============================================
// is1mClampActive - Gate for the 1M→200k clamp (flag latched + no override + really a 1M model)
// Location: cli_inner_pretty.js:134118-134120
// ============================================

// ORIGINAL (for source lookup):
function ARr(e, t) {
  return N8e() && Ati() === void 0 && gti(e, t) > jQ;
}

// READABLE (for understanding):
function is1mClampActive(model, headers) {
  return (
    get1mCreditsBlocked()                       // 1. the credits flag has been latched this session
    && getMaxContextTokensOverride() === void 0 // 2. user did NOT set CLAUDE_CODE_MAX_CONTEXT_TOKENS
    && rawModelWindow(model, headers) > jQ       // 3. the raw model window really exceeds 200k (i.e. this is a 1M model)
  );                                            //    jQ = 200000
}

// Mapping: ARr->is1mClampActive, N8e->get1mCreditsBlocked, Ati->getMaxContextTokensOverride,
//   gti->rawModelWindow, jQ->STANDARD_WINDOW (200000)
```

**How it works (the three conjuncts, in order):**
1. `N8e()` — the flag must have been latched by §2's trip. If credits were never exhausted, the clamp never fires.
2. `Ati() === void 0` — there must be **no** explicit `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override (and that override is only honoured when `DISABLE_COMPACT` is set — see §3b). This makes an explicit user-set context size win over the automatic clamp.
3. `gti(e, t) > jQ` — the *raw* model window (before any clamp) must genuinely exceed the 200k standard. This makes the clamp a **no-op for non-1M models**: a `claude-haiku-4-5` session whose flag somehow got latched still resolves to its own 200k window, because `gti(...) > 200000` is false.

**Why all three guards:** Each guard rules out a way the clamp could do the wrong thing. Without guard 2, a user who deliberately pinned a custom window would have it silently overridden. Without guard 3, the clamp would be a confusing no-op for non-1M models (it just returns 200k, but `z2` would mislabel the source as `model-default`). Guard 1 is the trigger. The conjunction is evaluated cheaply on every window resolution, which is acceptable because `gti` is a small switch.

### 3b. The hard cap — `getContextWindowForModel` (`tH` @134105)

**What it does:** Resolves the model's context-window ceiling that *everything* downstream (`z2`, `oee`, the threshold ladder, the UI percentage) is `Math.min`-ed against. v2.1.183 inserts the clamp branch into the middle of it.

```javascript
// ============================================
// getContextWindowForModel - Model hard cap with the NEW 1M→200k clamp branch
// Location: cli_inner_pretty.js:134105-134127
// ============================================

// ORIGINAL (for source lookup):
function tH(e, t) {
  let n = Ati();
  if (n !== void 0) return n;
  if (ARr(e, t)) return jQ;        // 134108  NEW clamp branch
  return gti(e, t);
}
function Ati() {
  if (Ge.DISABLE_COMPACT && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    let e = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(e) && e > 0) return e;
  }
  return;
}
function gti(e, t) {
  if (by(e)) return 1e6;
  if (t?.includes(Oz.header) && Mq(e)) return 1e6;
  if (BN(e)) return 1e6;
  let n = VAn(e);
  if (n !== null) return n;
  return mxt;
}
// var mxt = 200000, jQ = 200000;   // 134191-134192

// READABLE (for understanding):
function getContextWindowForModel(model, headers) {
  let override = getMaxContextTokensOverride();        // Ati: CLAUDE_CODE_MAX_CONTEXT_TOKENS, only when DISABLE_COMPACT
  if (override !== void 0) return override;
  if (is1mClampActive(model, headers)) return jQ;      // NEW: 1M model with credits blocked → 200k standard
  return rawModelWindow(model, headers);
}
function getMaxContextTokensOverride() {
  if (env.DISABLE_COMPACT && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    let n = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(n) && n > 0) return n;
  }
  return undefined;
}
function rawModelWindow(model, headers) {
  if (is1mFamilyModel(model)) return 1e6;                                  // by: [1m]-tagged / 1M family
  if (headers?.includes(BETA_HEADER.header) && supports1m(model)) return 1e6;  // 1m beta header path
  if (isExplicit1m(model)) return 1e6;
  let clientData = clientDataSonnet46Window(model);                       // VAn: kelp_forest_sonnet clientdata override
  if (clientData !== null) return clientData;
  return mxt;                                                              // mxt = 200000 default
}

// Mapping: tH->getContextWindowForModel, Ati->getMaxContextTokensOverride, ARr->is1mClampActive,
//   gti->rawModelWindow, jQ->STANDARD_WINDOW (200000), mxt->DEFAULT_WINDOW (200000),
//   by->is1mFamilyModel, VAn->clientDataSonnet46Window, Oz.header->BETA_HEADER, Mq->supports1m, BN->isExplicit1m
```

**How it works:** The order matters. The explicit `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override (factored out of the inline v2.1.156 body into the dedicated `Ati` helper) is checked **first**, so a user override always wins. Then the **new** `if (ARr(e,t)) return jQ` clamp fires — but only when `ARr`'s three guards all hold (and guard 2 has already established that no override is present, making the ordering self-consistent). Otherwise the raw model window (`gti`) is returned, which yields `1e6` for any 1M model.

**Why clamp at this layer (the key architectural choice):** Every window consumer in the subsystem reads through `tH` (directly or via `z2`): the effective-window computation `oee` (@226902 calls `z2`→`tH`), the threshold ladder (`gwn`/`mqr`/`nBi`), the warning-state UI, the auto-window spinner. By inserting the clamp at the **single hard-cap point** rather than at the dispatcher or at each call site, one branch re-windows the *entire* subsystem consistently — the threshold for "should I compact" drops to the 200k-derived value automatically, so on the very next turn the session is in the `compact` (or `blocked`) band and the dispatcher fires. There are ~16 call-sites of `tH` in the v2.1.183 bundle (`grep -nE '\btH\('` = 16 lines; every window consumer reads through `tH`); clamping at any other altitude would have had to touch all of them.

**Key insight — `mxt` and `jQ` both equal 200000 but mean different things.** `mxt` (@134191) is the *default* model window returned by `gti` for an ordinary model; `jQ` (@134192) is the *named standard-window clamp target* the 1M model is forced down to. They coincide numerically (both 200000) but carry distinct intent — a future build could raise the standard window without touching the 1M-clamp target, or vice-versa. The clamp branch deliberately returns `jQ`, not `mxt`, to express "force to the standard window," and `ARr`'s guard 3 compares the raw window against `jQ` for the same reason.

---

## 4. The second consumer — reactive-lane credits boundary (`DFi` @229611)

The proactive clamp (§3) handles *future* turns. But a session can hit the 1M-credits 429 **while a reactive compaction is already summarizing** — the summarize request itself is rejected. v2.1.183 adds a dedicated boundary check for exactly this case, and a new "rescue" telemetry to report whether the reactive lane managed to recover.

**What it does:** When a reactive summarization call returns a 1M-credits API error, `DFi` recognises it and converts it into a `prompt_too_long` result whose token-gap is computed **against the 200k standard window**, not the (now-unusable) 1M window — and tags the result `viaCreditsBoundary: true` so the group-walk loop knows it is operating against the credits boundary.

```javascript
// ============================================
// is1mCreditsApiError (DFi) + reactive boundary mapping — treat a 1M-credits summarize failure as prompt_too_long @200k
// Location: cli_inner_pretty.js:229611-229613 (predicate), 233039-233041 (boundary mapping)
// ============================================

// ORIGINAL (for source lookup):
function DFi(e) {
  return N8e() && e.isApiErrorMessage === !0 && e.errorDetails !== void 0 && Fwn(e.errorDetails);
}
// … inside the reactive summarize result classifier (sxd):
if (DFi(a)) {
  let d = $T(e) - jQ;                                                                       // 233040
  return { ok: !1, reason: "prompt_too_long", tokenGap: d > 0 ? d : void 0, viaCreditsBoundary: !0 };  // 233041
}

// READABLE (for understanding):
function is1mCreditsApiError(assistantMessage) {
  return (
    get1mCreditsBlocked()                          // flag already latched this session
    && assistantMessage.isApiErrorMessage === true
    && assistantMessage.errorDetails !== undefined
    && is1mCreditsError(assistantMessage.errorDetails)  // same Fwn matcher, on the API error detail
  );
}
// … inside classifySummarizeResult(messages):
if (is1mCreditsApiError(assistantMessage)) {
  // the summarize call hit the credits wall — anchor the gap at the 200k standard window
  let gap = estimateConversationTokens(messages) - jQ;   // jQ = 200000
  return { ok: false, reason: "prompt_too_long", tokenGap: gap > 0 ? gap : undefined, viaCreditsBoundary: true };
}

// Mapping: DFi->is1mCreditsApiError, N8e->get1mCreditsBlocked, Fwn->is1mCreditsError,
//   $T->estimateConversationTokens, jQ->STANDARD_WINDOW (200000)
```

**How it works (step by step):**
1. `DFi` only matches when the flag is **already latched** (`N8e()`), the assistant message *is* an API error, and its `errorDetails` string matches the same `Fwn` 1M-credits pattern. (This is the same predicate `Fwn` reused for the third time — once in the trip, once in `is1mClampActive`'s data path via `VAn`/`gti`, and here.)
2. When it matches, the classifier returns `reason: "prompt_too_long"` with `tokenGap = $T(messages) - jQ` — i.e. "how many tokens are we over the **200k** standard window". `$T` (`estimateConversationTokens`) sums the textual/thinking/tool-use token weights of the messages. The gap is clamped non-negative.
3. The result carries the new field `viaCreditsBoundary: true`.

**How the rescue is observed:** The reactive group-walk loop (the same loop documented in [reactive_compaction.md](../../../claude_code_v_2.1.156/analyze/07_compact/reactive_compaction.md)) consumes that flag at @233163: `if (g.viaCreditsBoundary) d = !0`. The local `d` boolean records "this whole reactive run is operating against the credits boundary". On *every* exit path the loop now reports the outcome:

```javascript
// ============================================
// tengu_compact_credits_clamp_rescue — report whether the reactive lane recovered from the credits boundary
// Location: cli_inner_pretty.js:233110, 233125, 233144, 233173 (emit sites); 233163 (set d)
// ============================================

// ORIGINAL (for source lookup):
if (g.viaCreditsBoundary) d = !0;                                                  // 233163
// success exit:
if (g.ok) { if (d) G("tengu_compact_credits_clamp_rescue", { outcome: Qe("ok"), attempts: a }); /* return ok … */ }   // 233125
// bail / error / exhausted exits each emit outcome:"failed":
if (d) G("tengu_compact_credits_clamp_rescue", { outcome: Qe("failed"), attempts: a - 1 });   // 233110 (no-assistant bail)
if (d) G("tengu_compact_credits_clamp_rescue", { outcome: Qe("failed"), attempts: a });        // 233144 (error)
if (d) G("tengu_compact_credits_clamp_rescue", { outcome: Qe("failed"), attempts: a });        // 233173 (exhausted)

// READABLE (for understanding):
if (summarizeResult.viaCreditsBoundary) operatingAgainstCreditsBoundary = true;
// …on success:
if (operatingAgainstCreditsBoundary)
  emit("tengu_compact_credits_clamp_rescue", { outcome: "ok", attempts });
// …on every failure exit:
if (operatingAgainstCreditsBoundary)
  emit("tengu_compact_credits_clamp_rescue", { outcome: "failed", attempts });

// Mapping: d->operatingAgainstCreditsBoundary, G->emit, Qe->stringTag, a->attempts
```

**Why this second consumer is needed (and why it is separate from `tH`):** The window-cap clamp (§3) fixes the threshold *for the next turn's decision* — but a reactive compaction that is already mid-summarization is using whatever window it started with. If the summarize call gets a 1M-credits 429, the proactive clamp alone would not tell the *reactive group-walk* how far over it is, because the group-walk seeds its step from `tokenGap`. `DFi` supplies that gap **relative to 200k** so the group-walk keeps preserving fewer groups until the surviving conversation fits the affordable window. Without it, a reactive run started before the flag latched would compute its gap against 1M and under-summarize.

**Key insight:** `viaCreditsBoundary` is purely an **observability + step-seeding** signal — it does not change the group-walk algorithm, only (a) the token-gap anchor it slices toward and (b) whether the run reports a `tengu_compact_credits_clamp_rescue` outcome at the end. The `outcome: "ok"` vs `"failed"` split lets Anthropic measure, in the field, how often a credits-blocked session is actually rescued back under 200k by reactive compaction versus exhausting the group-walk. Both `viaCreditsBoundary` and `tengu_compact_credits_clamp_rescue` are **new in v2.1.183** (0 in v2.1.156).

---

## 5. The v2.1.156 before-picture — why the session got permanently stuck

Two things were true in v2.1.156, and together they are exactly the "permanently stuck" bug this delta fixes.

### 5a. The hard cap had no clamp branch (`Ov` @130165, v2.1.156)

```javascript
// ============================================
// getContextWindowForModel (v2.1.156 BEFORE) - no credits clamp; 1M resolves to 1e6 forever
// Location: cli_inner_pretty.js:130165-130176  (v2.1.156 bundle, before-picture)
// ============================================

// ORIGINAL (v2.1.156, for source lookup):
function Ov(H, $) {
  if (xH(process.env.DISABLE_COMPACT) && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    let K = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(K) && K > 0) return K;
  }
  if (DZ(H)) return 1e6;
  if ($?.includes(Jg.header) && pB(H)) return 1e6;
  if (Se(H)) return 1e6;
  let q = OH8(H);
  if (q !== null) return q;
  return P36;                       // P36 = 200000  (v2.1.156 @130223)
}

// READABLE (for understanding):
function getContextWindowForModel_v2_1_156(model, headers) {
  // CLAUDE_CODE_MAX_CONTEXT_TOKENS override (inline, not yet factored into Ati)
  if (isEnvTruthy(process.env.DISABLE_COMPACT) && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    let n = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(n) && n > 0) return n;
  }
  if (is1mFamilyModel(model)) return 1e6;                           // NO credits guard — always 1e6
  if (headers?.includes(BETA_HEADER.header) && supports1m(model)) return 1e6;
  if (isExplicit1m(model)) return 1e6;
  let clientData = clientDataSonnet46Window(model);
  if (clientData !== null) return clientData;
  return 200000;
}

// Mapping (156→183): Ov->tH, DZ->by, Jg.header->Oz.header, pB->Mq, Se->BN, OH8->VAn, P36->jQ/mxt (200000)
//   NOTE: the inline MAX_CONTEXT_TOKENS block was factored out into Ati(); the `if (ARr(...)) return jQ` branch is NEW.
```

The v2.1.156 body goes straight `MAX_CONTEXT_TOKENS → DZ([1m]) → header+pB → Se → OH8 → P36`. There is **no** `N8e()`/`ARr` credits check anywhere. A 1M model resolves to `1e6` unconditionally, every call, forever — so once a session was over its (now-unaffordable) 1M window there was no smaller window to compact under, and it stayed over.

### 5b. The 429 mapper recognised the message but did nothing structural (v2.1.156 @186612)

This is the honest refinement of the dossier's "the matcher is new" note. In v2.1.156 the 429 branch **already contained** the two-string `includes` test — but only to produce the user-facing message; it did not extract a named matcher, latch a flag, emit telemetry, or clamp anything. The excerpt below is a **v2.1.156 before-picture quote** (illustrative, not a dual-version snippet — there is no paired v2.1.183 READABLE because this entire inline block was *replaced* by the named `Fwn` matcher + clamp logic deobfuscated in §3a/§3b above):

```javascript
// v2.1.156 BEFORE-PICTURE (illustrative quote, not a dual-version block) — cli_inner_pretty.js:186612-186621:
if (
  _ &&
  (H.message.includes("Extra usage is required for long context") ||
    H.message.includes("Usage credits are required for long context"))
) {
  let j = R6()
    ? "turn on usage credits at claude.ai/settings/usage, or use --model to switch to standard context"
    : "run /usage-credits to turn them on, or /model to switch to standard context";
  return d1({ content: `${EZ}: Usage credits required for 1M context \xB7 ${j}`, error: "rate_limit" });
}
```

So in v2.1.156: the client **told** the user about the credits wall, then returned a rate-limit error — and the model window stayed at `1e6` (5a). The user could `/model` to switch to a standard-context model manually, but the *current* 1M session never auto-recovered.

### 5c. Grep proof (v2.1.156 = 0 for the new machinery)

```
grep -c "longContext1mCreditsBlocked"          v2.1.156 → 0
grep -c "tengu_1m_credits_clamp_activated"     v2.1.156 → 0
grep -c "tengu_compact_credits_clamp_rescue"   v2.1.156 → 0
grep -c "viaCreditsBoundary"                   v2.1.156 → 0
grep -c "source: \"model-default\""            v2.1.156 → 0
# the raw STRING existed but did nothing structural:
grep -n "is required for long context"         v2.1.156 → 1 (cli_inner_pretty.js:186614, user-message only)
```

The flag, the clamp predicate, the clamp branch in the hard cap, the `model-default` window source, the reactive boundary, and the rescue telemetry are **all new**. Only the user-facing *string* carries over (and it now lives behind the named `Fwn` matcher).

---

## 6. Cross-cutting analysis

**Why latch instead of re-derive each turn?** The credits state is sticky for the session — once you are out of long-context credits, you stay out until you top them up *and* (presumably) start a new request cycle. Re-deriving "are we blocked?" every turn would require re-issuing a 1M request just to get the 429 again. Latching is the only cheap design that lets the *next* turn compact pre-emptively rather than failing first. The one-shot telemetry guard (`!N8e()`) keeps the latch idempotent for observability.

**Interaction with `CLAUDE_CODE_MAX_CONTEXT_TOKENS`.** The override (`Ati`) is checked *before* the clamp in `tH`, and `ARr` independently requires `Ati() === void 0`, so a user who has explicitly pinned a context size via `CLAUDE_CODE_MAX_CONTEXT_TOKENS` (with `DISABLE_COMPACT`) is never auto-clamped. This is intentional: an explicit user choice outranks the automatic safety clamp.

**Interaction with DELTA 3 (`model-default` source).** The very same `ARr` predicate is the second disjunct in `z2`'s `model-default` branch (`cli_inner_pretty.js:226891`: `if (o < 1e6 && (hwd.has(n) || ARr(e, r))) return { …, source: "model-default" }`). Because `tH` has *already* clamped `o` to 200k when `ARr` is true, the `o < 1e6` guard is satisfied and the resolver reports `source: "model-default"` with `configured: jQ` — keeping `z2`'s provenance label consistent with the actual hard cap. So the clamp shows up *both* as a smaller effective window *and* as an honest "model-default" source label in the `/config` UI. The full six-source resolver is documented in [window_resolver_six_sources.md](./window_resolver_six_sources.md); this doc only needs the `ARr` linkage.

**Non-1M models are immune.** Guard 3 (`gti(...) > jQ`) means a session on a 200k model whose flag somehow latched is never clamped (its raw window is already ≤ 200k), and `z2` would not report `model-default` for it via the `ARr` disjunct (though it could still match the static `hwd` Set for `claude-sonnet-4-6`/`claude-opus-4-6` — a separate, pre-existing-model concern unrelated to credits).

---

## 7. Open questions / caveats (carried honestly)

1. **Latch reset semantics (LOW).** `Wtr` is only ever called with `!0` (true) from the trip site; no caller resets it to `false` within a session. So within one session the clamp is monotonic. Whether a credits top-up mid-session can un-clamp without a restart was **not** traced — there is no `set1mCreditsBlocked(false)` path in the compaction subsystem. (If the user enables credits and `/model`-switches, a fresh 1M attempt would simply not 429; but the flag itself stays latched for the session.) This matches the dossier's framing of the flag as session-scoped.

2. **`clientdata`/`rowan_thicket` window-source semantics (MEDIUM).** The `model-default` clamp interacts with the new `clientdata` source (DELTA 3). The exact server-push mechanism behind `clientdata`/`rowan_thicket` was not traced end-to-end; this affects only the *precedence* story (clientdata sits above model-default in `z2`), not the clamp logic itself. See [window_resolver_six_sources.md](./window_resolver_six_sources.md) and the README's Open Question 1.

3. **`$T` token-estimate fidelity in the reactive gap (LOW).** The reactive boundary computes `tokenGap = $T(messages) - jQ` using the client-side token *estimate* `$T` (`estimateConversationTokens`), not the server-reported usage. The estimate may differ slightly from the server's view of the 200k boundary; the group-walk is iterative and self-correcting (it re-seeds the step from the actual next failure), so a small estimate error only costs an extra group-walk iteration, not correctness. Not exhaustively cross-checked against the server usage numbers.

4. **The `iBi` `l < jQ` guard (LOW, shared with README).** `isAbovePrecomputeOrCompact` (`iBi` @226956) gained an `if (l < jQ) return !1` guard referencing the same `jQ`=200000. It appears to be the standard-window floor for treating a configured window as "above precompute," and ties into this clamp because a clamped session's configured window is exactly `jQ`. Carried from the README's Open Question 4 — not exhaustively verified against every call site.

---

## Related Symbols

> Symbol mappings live in the central index files — this module doc uses list format only.
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Loop / dispatcher integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Model context window / rate-limit mapper / telemetry
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI spinner / `/config` window-source labels
> - [symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md) — This module's new/renamed v2.1.183 symbols

Key functions in this document:

- `is1mCreditsError` (`Fwn`, `cli_inner_pretty.js:229606`) — Matches the two long-context-credits 429 message shapes (DELTA 2 trip + reuse)
- `set1mCreditsBlocked` / `get1mCreditsBlocked` (`Wtr` / `N8e`, `cli_inner_pretty.js:2968` / `2965`) — Session credits-clamp flag accessors (init `false` @2624)
- `rateLimitErrorMapper` (`$Cd`, `cli_inner_pretty.js:229176`) — 429 error mapper; latches the flag + emits `tengu_1m_credits_clamp_activated` @229192
- `is1mClampActive` (`ARr`, `cli_inner_pretty.js:134118`) — Three-guard gate for the 1M→200k clamp (`N8e()` + no override + raw > 200k)
- `getContextWindowForModel` (`tH`, `cli_inner_pretty.js:134105`) — Model hard cap; new `if (ARr) return jQ` clamp branch @134108
- `getMaxContextTokensOverride` (`Ati`, `cli_inner_pretty.js:134111`) — `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override (only under `DISABLE_COMPACT`)
- `rawModelWindow` (`gti`, `cli_inner_pretty.js:134121`) — Raw per-model window (`1e6` for 1M models, else `mxt`=200000)
- `is1mCreditsApiError` (`DFi`, `cli_inner_pretty.js:229611`) — Reactive-lane: detect a 1M-credits summarize failure; anchors gap at `jQ` @233040
- `getAutoCompactWindow` (`z2`, `cli_inner_pretty.js:226875`) — Reports `source:"model-default"` / `configured:jQ` when `ARr` fires @226891 (see DELTA 3)
- `STANDARD_WINDOW` (`jQ`, `cli_inner_pretty.js:134192`) — `200000`, the clamp target (renamed from v2.1.156 `P36`)
- `DEFAULT_WINDOW` (`mxt`, `cli_inner_pretty.js:134191`) — `200000`, the default model window (numerically equal to `jQ`, distinct meaning)
