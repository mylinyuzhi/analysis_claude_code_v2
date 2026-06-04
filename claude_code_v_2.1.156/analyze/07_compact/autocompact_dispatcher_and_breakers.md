# Auto-compact dispatcher & the two breakers

## Overview

Auto-compaction in v2.1.156 is driven by an async-generator dispatcher `autoCompactIfNeeded` (`DX4`, cli_inner_pretty.js:424002-424093). The deobfuscated v2.1.88 name for this same function is `autoCompactIfNeeded`. It is invoked once per query-loop iteration (cli_inner_pretty.js:451292, `w.autocompact(...)`) **before** the model call, with the running messages, the `ToolUseContext`, the cache-safe params, the `querySource`, the carried `AutoCompactTrackingState`, and a `snipTokensFreed` delta. It `yield`s compaction progress events and *returns* (the generator's final value) a result object whose fields are destructured by the caller at cli_inner_pretty.js:451285-451299.

Where it plugs into the agent loop: each turn, before sending the conversation to the model, the loop asks the dispatcher "do we need to compact, and how?" The dispatcher counts tokens, consults the threshold ladder (see `threshold_and_window_resolution.md`), runs two cheap guards, and then either skips, routes to the reactive compactor, or performs a local full compaction. Whatever it decides, it returns an updated `AutoCompactTrackingState` fragment that the loop merges back so breaker state survives across turns.

The whole subsystem is a small state machine. Two distinct **breakers** sit in front of the expensive compaction work:

1. **Circuit breaker** (`consecutiveFailures >= _c6` where `_c6`=3) — the v2.1.88-era guard, motivated by a documented production incident.
2. **Rapid-refill ("thrashing") breaker** (`consecutiveRapidRefills >= Y08` where `Y08`=3, computed via `fc6`) — a NEW v2.1.156 guard that detects the context refilling to threshold within `<Yc6` (3) turns of a previous compact, repeatedly.

Plus two routing decisions:

3. **Reactive routing** — when the auto-compact window's `thresholdSource` (`ab_`) is something other than `"auto"` (i.e. env/settings/experiment configured a smaller window) and we are local and have a `querySource`, the dispatcher delegates to the reactive compactor `lA8` instead of doing a local full compact, and stamps `routedThroughReactive: true` + `thresholdSource` onto the result.
4. **Cold-compact flag** (`Mc6` reading `CLAUDE_CODE_COLD_COMPACT`) — passed through into the local compaction routine `_eH`.

---

## The `AutoCompactTrackingState` shape

The v2.1.88 readable type (`autoCompact.ts:51-60`) is:

```ts
type AutoCompactTrackingState = {
  compacted: boolean
  turnCounter: number
  turnId: string            // unique id per turn
  consecutiveFailures?: number   // reset to 0 on success; circuit breaker
}
```

In v2.1.156 the same object is constructed in the query loop with one **new field**, `consecutiveRapidRefills` (cli_inner_pretty.js:451346):

```js
Q = { compacted: !0, turnId: w.uuid(), turnCounter: 0, consecutiveFailures: 0, consecutiveRapidRefills: $H };
```

How the state evolves each turn (all in the query loop; the v2.1.156 `Q` variable is `tracking`):

- **On successful compact** (cli_inner_pretty.js:451346, and the reactive/precomputed retry path cli_inner_pretty.js:451781-451787): the state is *reset* to a fresh turn — `{compacted:true, turnId:newUuid, turnCounter:0, consecutiveFailures:0, consecutiveRapidRefills:$H}`. Note `$H` is the *rapid-refill count that `DX4` computed this turn* (`O` inside `DX4`), so a refill streak survives a successful compact — that is the whole point of the breaker: counting consecutive *quick* refills.
- **On failure** (cli_inner_pretty.js:451349): only `consecutiveFailures` is merged in: `Q = {...(Q ?? {compacted:false,turnId:"",turnCounter:0}), consecutiveFailures: o}`.
- **Each subsequent turn after a compact** (cli_inner_pretty.js:452021-452028): if `Q?.compacted`, `Q.turnCounter++` and a `tengu_post_autocompact_turn` event fires. This is the counter `fc6` reads to decide whether a refill was "rapid".

This matches v2.1.88's `query.ts:521-542` threading exactly (reset-on-compact, merge-failures-otherwise), with the added `consecutiveRapidRefills` carry.

---

## (a) The `eb_` / `DX4` gate cascade

### shouldAutoCompact predicate `eb_` (cli_inner_pretty.js:423991-424001)

`eb_` is the deobfuscated `shouldAutoCompact`. Its gate order:

1. `if (K === "compact") return false` — `K` is `querySource`; this is the recursion guard (compact is itself a forked agent; v2.1.88 also guarded `session_memory`/`marble_origami` here — see Cross-validation).
2. `if (!J0()) return false` — `J0` is `isAutoCompactEnabled` (gates `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`, and the `autoCompactEnabled` setting).
3. `if (_JH() && !Pc() && !EH$($, q)) return false` — **local-mode gate**. `_JH` = "is local (not remote)" = `!isEnvTruthy(CLAUDE_CODE_REMOTE)` (cli_inner_pretty.js:423988-423990). `Pc` = `tengu_amber_redwood3` experiment gate (cli_inner_pretty.js:423902-423905). `EH$` = "threshold source is env or settings" (cli_inner_pretty.js:423931-423934). Reading: *when running locally, AND the redwood3 experiment is off, AND the window was NOT explicitly configured by env/settings, suppress proactive autocompact* — i.e. local non-configured sessions defer to the reactive path. (In v2.1.88 this gate was instead a `feature()`-wrapped `REACTIVE_COMPACT`/`CONTEXT_COLLAPSE` suppression — see Cross-validation.)
4. Compute `z = jJ(H, xG($)) - _` (token count minus `snipTokensFreed`), `A = WRH(z, $, q)` (the level classifier `fX4` wrapped, cli_inner_pretty.js:423971-423975), log, then `return A.level === "compact" || A.level === "blocked"`.

So `eb_` is true only when the live token count reaches the **compact** or **blocked** band of the threshold classifier.

### The level classifier `fX4` (cli_inner_pretty.js:423873-423884)

Given current tokens `H`, effective window `$`, options `q` (`{enabled, precomputeBufferFraction, testPctOverride, testBlockingOverride}`), and a blocking-window `K`:
- compact threshold `_ = Jv$($,q)` = `effectiveWindow - 13000` (or a test-pct override, cli_inner_pretty.js:423864-423868)
- blocking threshold `f = K - 3000` (or a test override)
- returns `blocked` if `H >= f`, else `compact` if enabled && `H >= _`, else `warn` if `H >= effective-20000`, else `ok`.

This is the v2.1.88 `calculateTokenWarningState` logic (buffers `AUTOCOMPACT_BUFFER_TOKENS=13_000`, `WARNING/ERROR=20_000`, `MANUAL_COMPACT=3_000`) refactored into a single banded function returning a `level`.

### The dispatcher `DX4` gate cascade (cli_inner_pretty.js:424002-424093)

**What it does:** A per-turn decision generator that decides whether/how to auto-compact, threading `AutoCompactTrackingState` back to the query loop.

**How it works (strict early-return order, each gate returning early):**
1. **cli_inner_pretty.js:424003** — `if (isEnvTruthy(DISABLE_COMPACT)) return {wasCompacted:false}`.
2. **cli_inner_pretty.js:424004** — **CIRCUIT BREAKER**: `if (tracking?.consecutiveFailures !== undefined && tracking.consecutiveFailures >= _c6(3)) return {wasCompacted:false}`.
3. **cli_inner_pretty.js:424007** — `if (!(await eb_(...))) return {wasCompacted:false}` — the should-compact predicate above (which itself carries the `DISABLE_AUTO_COMPACT`/`isAutoCompactEnabled`/remote/redwood3/source/level gates).
4. **cli_inner_pretty.js:424008-424017** — **RAPID-REFILL BREAKER**: `O = fc6(tracking)`; `if (O >= Y08(3))` log a warning, emit `t$("compact_auto","compact_auto_rapid_refill_breaker")` (i.e. `tengu_feature_sad{feature_name:"compact_auto", error_code:"compact_auto_rapid_refill_breaker"}`, see cli_inner_pretty.js:41596-41598), and `return {wasCompacted:false, rapidRefillBreakerTripped:true}`.
5. **cli_inner_pretty.js:424018-424058** — **REACTIVE ROUTING** decision: `M = ab_(model,window)` (threshold source), `j = Hx_(...)` (spinner hint). `if (querySource !== undefined && M !== "auto" && _JH())` → route to `lA8` via `Xv$`.
6. **cli_inner_pretty.js:424059-424093** — otherwise **LOCAL FULL COMPACT** via `_eH`, with cold-compact flag `D = Mc6()`, wrapped in try/catch that increments `consecutiveFailures` on error.

**Why this approach:** Cheapest gates first. The env check and then the circuit breaker (which requires no token counting) come before the expensive `eb_` token count and the even more expensive compaction call. A disabled or tripped session therefore costs nearly nothing per turn. Returning the updated tracking object (rather than mutating a module global) keeps breaker state scoped to the query chain.

**Key insight:** It is an async **generator**: it `yield`s live compaction progress events (via the `Xv$` event pump) but its **return** value is the result object the caller destructures at cli_inner_pretty.js:451285. Both breakers live in front of any model call, so they bound API waste.

```javascript
// ============================================
// autoCompactIfNeeded (dispatcher generator) - gate cascade + both breakers + reactive routing
// Location: cli_inner_pretty.js:424002-424093
// ============================================

// ORIGINAL (for source lookup):
async function* DX4(H, $, q, K, _, z) {
  if (xH(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  if (_?.consecutiveFailures !== void 0 && _.consecutiveFailures >= _c6) return { wasCompacted: !1 };
  let A = $.options.mainLoopModel, Y = $.options.autoCompactWindow;
  if (!(await eb_(H, A, Y, K, z))) return { wasCompacted: !1 };
  let O = fc6(_);
  if (O >= Y08)
    return (N(`autocompact: rapid-refill breaker tripped — ${O} consecutive refills within <${Yc6} turns each (last was ${_?.turnCounter} turns)`, { level: "warn" }), t$("compact_auto", "compact_auto_rapid_refill_breaker"), { wasCompacted: !1, rapidRefillBreakerTripped: !0 });
  let M = ab_(A, Y), j = Hx_(A, Y);
  if (K !== void 0 && M !== "auto" && _JH()) {
    (N(`autocompact: routing through reactive (thresholdSource=${M})`), d("tengu_auto_compact_routed_reactive", { thresholdSource: M }));
    let { result: J, hookBlocked: X } = yield* Xv$((Z, W, G) => lA8({ hasAttempted: !1, querySource: K, aborted: Z.abortController.signal.aborted, messages: H, cacheSafeParams: { ...q, toolUseContext: Z }, thresholdSource: M, spinnerHintText: j }), $);
    if (J) return { wasCompacted: !0, compactionResult: J, consecutiveFailures: 0, consecutiveRapidRefills: O, thresholdSource: M, routedThroughReactive: !0 };
    if (X) return { wasCompacted: !1, thresholdSource: M, routedThroughReactive: !0 };
    let P = (_?.consecutiveFailures ?? 0) + 1;
    if (P >= _c6) (N(`...circuit breaker tripped after ${P} consecutive failures (reactive path)...`, { level: "warn" }), d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: P, routedThroughReactive: !0, thresholdSource: M }));
    return { wasCompacted: !1, consecutiveFailures: P, thresholdSource: M, routedThroughReactive: !0 };
  }
  let w = { isRecompactionInChain: _?.compacted === !0, turnsSincePreviousCompact: _?.turnCounter ?? -1, previousCompactTurnId: _?.turnId, autoCompactThreshold: DU6(A, Y), querySource: K }, D = Mc6();
  try {
    let J = yield* Xv$((X, L, P) => _eH(H, X, q, !0, void 0, !0, w, D, j, L, P), $);
    return (Uo(K, $.setAppState, $.agentId), { wasCompacted: !0, compactionResult: J, consecutiveFailures: 0, consecutiveRapidRefills: O, thresholdSource: M, routedThroughReactive: !1 });
  } catch (J) {
    if (TH(J).startsWith(KeH)) return { wasCompacted: !1 };
    if (!yn(J, GC)) if (lN(TH(J)) || yn(J, z08) || yn(J, NH$)) N(`autocompact failed: ${TH(J)}`, { level: "error" }); else hH(J);
    let L = (_?.consecutiveFailures ?? 0) + 1;
    if (L >= _c6) (N(`...circuit breaker tripped after ${L} consecutive failures...`, { level: "warn" }), d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: L }));
    return { wasCompacted: !1, consecutiveFailures: L };
  }
}

// READABLE (for understanding):
async function* autoCompactIfNeeded(messages, toolUseContext, cacheSafeParams, querySource, tracking, snipTokensFreed) {
  if (isEnvTruthy(process.env.DISABLE_COMPACT)) return { wasCompacted: false };
  // CIRCUIT BREAKER — second check, before any token counting
  if (tracking?.consecutiveFailures !== undefined && tracking.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES /*3*/) return { wasCompacted: false };
  const model = toolUseContext.options.mainLoopModel, window = toolUseContext.options.autoCompactWindow;
  if (!(await shouldAutoCompact(messages, model, window, querySource, snipTokensFreed))) return { wasCompacted: false };
  // RAPID-REFILL BREAKER — only advances once eb_ confirms we are back at threshold
  const refills = computeRapidRefillCount(tracking);
  if (refills >= RAPID_REFILL_TRIP /*3*/) {
    logForDebugging(`rapid-refill breaker tripped — ${refills} refills within <${RAPID_REFILL_TURN_WINDOW} turns`, { level: 'warn' });
    logFeatureSad('compact_auto', 'compact_auto_rapid_refill_breaker');
    return { wasCompacted: false, rapidRefillBreakerTripped: true };
  }
  const thresholdSource = getThresholdSource(model, window);
  const spinnerHint = getSpinnerHintText(model, window);
  // REACTIVE ROUTING — configured window + local + real querySource
  if (querySource !== undefined && thresholdSource !== 'auto' && isLocal()) {
    logEvent('tengu_auto_compact_routed_reactive', { thresholdSource });
    const { result, hookBlocked } = yield* pumpCompactEvents(
      (ctx) => reactiveCompact({ hasAttempted: false, querySource, aborted: ctx.abortController.signal.aborted, messages, cacheSafeParams: { ...cacheSafeParams, toolUseContext: ctx }, thresholdSource, spinnerHintText: spinnerHint }),
      toolUseContext);
    if (result) return { wasCompacted: true, compactionResult: result, consecutiveFailures: 0, consecutiveRapidRefills: refills, thresholdSource, routedThroughReactive: true };
    if (hookBlocked) return { wasCompacted: false, thresholdSource, routedThroughReactive: true }; // hook blocked — NOT a failure
    const nextFailures = (tracking?.consecutiveFailures ?? 0) + 1;
    if (nextFailures >= 3) logEvent('tengu_auto_compact_circuit_breaker', { consecutiveFailures: nextFailures, routedThroughReactive: true, thresholdSource });
    return { wasCompacted: false, consecutiveFailures: nextFailures, thresholdSource, routedThroughReactive: true };
  }
  // LOCAL FULL COMPACT
  const recompactionInfo = { isRecompactionInChain: tracking?.compacted === true, turnsSincePreviousCompact: tracking?.turnCounter ?? -1, previousCompactTurnId: tracking?.turnId, autoCompactThreshold: getAutoCompactThreshold(model, window), querySource };
  const coldCompact = isColdCompact();
  try {
    const result = yield* pumpCompactEvents((ctx, notify, emit) => compactConversationLocal(messages, ctx, cacheSafeParams, true, undefined, true, recompactionInfo, coldCompact, spinnerHint, notify, emit), toolUseContext);
    runPostCompactCleanup(querySource, toolUseContext.setAppState, toolUseContext.agentId);
    return { wasCompacted: true, compactionResult: result, consecutiveFailures: 0, consecutiveRapidRefills: refills, thresholdSource, routedThroughReactive: false };
  } catch (err) {
    if (errMsg(err).startsWith(USER_ABORT)) return { wasCompacted: false };
    if (!isAbort(err)) { if (isPromptTooLong(errMsg(err)) || isKnownCompactError(err)) logForDebugging(`autocompact failed: ${errMsg(err)}`, { level: 'error' }); else reportError(err); }
    const nextFailures = (tracking?.consecutiveFailures ?? 0) + 1;
    if (nextFailures >= 3) logEvent('tengu_auto_compact_circuit_breaker', { consecutiveFailures: nextFailures });
    return { wasCompacted: false, consecutiveFailures: nextFailures };
  }
}

// Mapping: DX4->autoCompactIfNeeded, H->messages, $->toolUseContext, q->cacheSafeParams, K->querySource, _->tracking, z->snipTokensFreed, A->model, Y->autoCompactWindow, O->refills, M->thresholdSource, j->spinnerHint, w->recompactionInfo, D->coldCompact, J->compactionResult/result, X->hookBlocked, P/L->nextFailures; xH->isEnvTruthy, eb_->shouldAutoCompact, fc6->computeRapidRefillCount, ab_->getThresholdSource, Hx_->getSpinnerHintText, _JH->isLocal, lA8->reactiveCompact, _eH->compactConversationLocal, Xv$->pumpCompactEvents, Mc6->isColdCompact, t$->logFeatureSad, d->logEvent, N->logForDebugging, DU6->getAutoCompactThreshold, Uo->runPostCompactCleanup, _c6=3, Y08=3, Yc6=3
```

```javascript
// ============================================
// shouldAutoCompact - eb_ predicate (gate order incl. local-mode gate)
// Location: cli_inner_pretty.js:423991-424001
// ============================================

// ORIGINAL (for source lookup):
async function eb_(H, $, q, K, _ = 0) {
  if (K === "compact") return !1;
  if (!J0()) return !1;
  if (_JH() && !Pc() && !EH$($, q)) return !1;
  let z = jJ(H, xG($)) - _,
    A = WRH(z, $, q);
  return (N(`autocompact: tokens=${z} level=${A.level} effectiveWindow=${_qH($, q)}`), A.level === "compact" || A.level === "blocked");
}

// READABLE (for understanding):
async function shouldAutoCompact(messages, model, window, querySource, snipTokensFreed = 0) {
  if (querySource === 'compact') return false;            // recursion guard (compact is a forked agent)
  if (!isAutoCompactEnabled()) return false;              // J0: DISABLE_COMPACT / DISABLE_AUTO_COMPACT / setting
  if (isLocal() && !redwood3Enabled() && !isWindowConfiguredByEnvOrSettings(model, window)) return false; // local non-configured → defer to reactive
  const tokens = tokenCountWithEstimation(messages, ctxWindowForModel(model)) - snipTokensFreed;
  const band = classifyTokenLevel(tokens, model, window);
  logForDebugging(`autocompact: tokens=${tokens} level=${band.level} effectiveWindow=${effectiveWindow(model, window)}`);
  return band.level === 'compact' || band.level === 'blocked';
}

// Mapping: eb_->shouldAutoCompact, H->messages, $->model, q->window, K->querySource, _->snipTokensFreed, z->tokens, A->band; J0->isAutoCompactEnabled, _JH->isLocal, Pc->redwood3Enabled, EH$->isWindowConfiguredByEnvOrSettings, jJ->tokenCountWithEstimation, xG->ctxWindowForModel, WRH->classifyTokenLevel(fX4 wrapper), _qH->effectiveWindow, N->logForDebugging
```

---

## (b) Circuit breaker — state machine + WHY

**What it does:** Stops attempting autocompaction after `_c6`=3 consecutive failures within a session.

**How it works (state machine):**
- *Closed* (failures 0..2): each failed compact (cli_inner_pretty.js:424080-424092 local catch, or cli_inner_pretty.js:424046-424057 reactive hook-failure path) does `nextFailures = (tracking?.consecutiveFailures ?? 0) + 1` and returns `{wasCompacted:false, consecutiveFailures: nextFailures}`. The query loop merges this into `tracking` (cli_inner_pretty.js:451349).
- *Tripping edge* (`nextFailures >= 3`): logs `autocompact: circuit breaker tripped after N consecutive failures` and emits `tengu_auto_compact_circuit_breaker` (cli_inner_pretty.js:424086-424091 local; cli_inner_pretty.js:424047-424056 reactive, with extra `routedThroughReactive:true, thresholdSource` props).
- *Open* (failures >= 3): the **gate at cli_inner_pretty.js:424004** short-circuits the entire dispatcher on the next turn — no further attempts this session.
- *Reset to Closed:* on any **success** the result carries `consecutiveFailures: 0` (cli_inner_pretty.js:424040 reactive, cli_inner_pretty.js:424074 local), which the query loop writes back (cli_inner_pretty.js:451346).

**Why this approach (production-motivated):** The v2.1.88 source documents the incident verbatim (`autoCompact.ts:67-70`):

> "Stop trying autocompact after this many consecutive failures. BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272) in a single session, wasting ~250K API calls/day globally."

The failure mode: when context is *irrecoverably* over the limit (e.g. a `prompt_too_long` that compaction itself can't fix because even the summarize call overflows), every turn would re-attempt a doomed compaction, hammering the API. The breaker bounds the damage to 3 attempts per session.

**Key insight:** The breaker state lives in the *carried tracking object*, not a module global — so it is naturally per-session/per-query-chain and resets when a fresh chain starts, while a success anywhere resets it mid-session. The gate is checked *first thing* (right after `DISABLE_COMPACT`), so a tripped breaker costs essentially nothing per turn.

---

## (c) Rapid-refill ("thrashing") breaker — NEW in v2.1.156

**What it does:** Detects and stops *thrashing* — compaction succeeding but the context refilling back to the compact threshold within `<Yc6`=3 turns, repeatedly (`Y08`=3 times in a row). This is a *different* pathology from the circuit breaker: here compaction *succeeds* each time but accomplishes nothing durable (usually because a single tool output / file read is larger than the post-compact headroom).

**How it works — the counter `fc6` (cli_inner_pretty.js:423948-423950):**

```javascript
// ============================================
// computeRapidRefillCount - the rapid-refill (thrashing) counter
// Location: cli_inner_pretty.js:423948-423950
// ============================================

// ORIGINAL (for source lookup):
function fc6(H) {
  return H?.compacted === !0 && H.turnCounter < Yc6 ? (H?.consecutiveRapidRefills ?? 0) + 1 : 0;
}

// READABLE (for understanding):
function computeRapidRefillCount(tracking) {
  // If the previous turn compacted AND it happened <3 turns ago, this is a 'rapid refill' → bump the streak.
  // Otherwise (no prior compact, or the refill took >=3 turns = healthy) reset to 0.
  return tracking?.compacted === true && tracking.turnCounter < RAPID_REFILL_TURN_WINDOW /*Yc6=3*/
    ? (tracking?.consecutiveRapidRefills ?? 0) + 1
    : 0;
}

// Mapping: fc6->computeRapidRefillCount, H->tracking, Yc6->RAPID_REFILL_TURN_WINDOW(3); reads tracking.compacted, tracking.turnCounter, tracking.consecutiveRapidRefills
```

- If the previous turn *did* compact (`compacted===true`) AND fewer than 3 turns have elapsed since (`turnCounter < 3`), then this is a "rapid refill" → increment the carried streak.
- Otherwise (either no prior compact, or the refill took >=3 turns, which is "healthy") → reset the streak to 0.

**State machine:**
- `DX4` computes `O = fc6(tracking)` *after* `eb_` confirms we are at threshold again (cli_inner_pretty.js:424008). So `O` only advances when we're genuinely back at the compact band quickly.
- *Trip* at `O >= Y08(3)` (cli_inner_pretty.js:424009): return `{wasCompacted:false, rapidRefillBreakerTripped:true}` and emit `compact_auto_rapid_refill_breaker` via `t$`.
- The query loop sees `rapidRefillBreakerTripped` (`HH` at cli_inner_pretty.js:451289/451300), emits a richer `tengu_auto_compact_rapid_refill_breaker` event (cli_inner_pretty.js:451301-451306) with `consecutiveRapidRefills`/`turnsSincePreviousCompact`/`queryChainId`/`queryDepth`, then yields a hard error message to the user (`Oc6`) and ends the turn with `{reason:"rapid_refill_breaker"}` (cli_inner_pretty.js:451307-451308).
- The user-facing message `Oc6` (cli_inner_pretty.js:424155): *"Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh."*
- There is a **second trip site** in the reactive/413 retry branch (cli_inner_pretty.js:451722-451733) with `reactive:true` in the telemetry — so the breaker also fires on the reactive-recovery path.
- *Carry/propagation:* when a compact succeeds, the current streak is written into the new tracking state — as `consecutiveRapidRefills: $H` at 451346 (where `$H` = the dispatcher's `O`), and as `consecutiveRapidRefills: I$` at 451786 (where `I$` = `fc6(Q)` recomputed locally in the 413 retry path) — both represent the current rapid-refill streak, so the streak persists across successful compacts. It only resets when `fc6` returns 0 (refill took >=3 turns or no prior compact).

**Why this approach:** The circuit breaker only catches *failed* compactions. A session can be just as broken with *successful* compactions that immediately refill — the user gets an endless "Compacting…" cycle making no progress and burning summary-call tokens every few turns. The rapid-refill breaker catches that "infinite progress-free loop" and surfaces an actionable message (smaller reads / `/clear`) instead of silently thrashing.

**Key insight:** The discriminator is `turnCounter < Yc6`. A compact followed by many turns of useful work (turnCounter climbs past 3) then a later refill is *normal* and resets the streak. Only *back-to-back quick* refills count, which is exactly the signature of "one oversized artifact keeps blowing the window." The two constants reused (`Yc6` for the turn-window and `Y08` for the streak, both 3) make the heuristic symmetric and the user message readable.

---

## (d) Reactive routing

**What it does:** Instead of always doing a *local* full compaction, when the auto-compact window was *configured* (not the default `"auto"` source) and we have a real `querySource` and are local, `DX4` delegates to the **reactive** compactor `lA8`.

**How it works (cli_inner_pretty.js:424018-424058):**
1. `M = ab_(model, window)` = `Xl(...).source` — one of `"env" | "settings" | "experiment" | "auto"` (cli_inner_pretty.js:423915-423936). `"auto"` means nobody overrode the window (default heuristic table `ob_`); the others mean an explicit smaller window.
2. Gate: `if (querySource !== undefined && M !== "auto" && _JH())`.
3. Telemetry `tengu_auto_compact_routed_reactive {thresholdSource:M}` (cli_inner_pretty.js:424021-424022).
4. Run `lA8` through the event-pump `Xv$`, which produces `{result, hookBlocked}`:
   - `result` truthy → `{wasCompacted:true, compactionResult, consecutiveFailures:0, consecutiveRapidRefills:O, thresholdSource:M, routedThroughReactive:true}` (cli_inner_pretty.js:424036-424044).
   - `hookBlocked` → `{wasCompacted:false, thresholdSource:M, routedThroughReactive:true}` (cli_inner_pretty.js:424045) — a pre-compact hook blocked it; *not* counted as a failure.
   - neither (failure) → increment `consecutiveFailures` (cli_inner_pretty.js:424046), trip-check the circuit breaker (cli_inner_pretty.js:424047-424056, emits `tengu_auto_compact_circuit_breaker {routedThroughReactive:true, thresholdSource:M}`), return `{wasCompacted:false, consecutiveFailures:P, thresholdSource:M, routedThroughReactive:true}`.
5. The `thresholdSource` + `routedThroughReactive` flags are carried all the way to `tengu_auto_compact_succeeded` (cli_inner_pretty.js:451319-451321).

**Why this approach:** `lA8` (cli_inner_pretty.js:272213+) is the reactive compactor that can consume a *precomputed* compaction (the speculative "borrow" computed before a 413) and supports prompt-cache-aware paths. When the window is explicitly narrowed, proactive compaction would fire much earlier and more often; routing through the reactive engine reuses its precompute/hook/telemetry machinery and unifies the "configured-window" path with the API-413 recovery path (which also calls `lA8`, cli_inner_pretty.js:451753-451773). `_JH()` ensures this only happens locally (remote sessions take the plain path).

**Key insight:** `thresholdSource !== "auto"` is the *signal of intent* — someone deliberately set a window via `CLAUDE_CODE_AUTO_COMPACT_WINDOW` env, settings, or the `tengu_amber_redwood2` experiment (`wX4`, cli_inner_pretty.js:423906-423914, opus-4-8 only). The dispatcher treats "user/experiment configured a tighter window" as a request to use the smarter reactive engine.

---

## (e) Cold-compact `Mc6`

`Mc6()` (cli_inner_pretty.js:423951-423953) = `isEnvTruthy(CLAUDE_CODE_COLD_COMPACT)`. In the local compact path it is read as `D = Mc6()` (cli_inner_pretty.js:424066) and passed as the 8th positional arg of `_eH(H, X, q, true, undefined, true, w, D, j, L, P)` (cli_inner_pretty.js:424068). `_eH` is the local compaction generator (cli_inner_pretty.js:423130+). "Cold" almost certainly toggles a no-cache / fresh-context compaction request; the dispatcher's only job is to plumb the env flag through to `_eH`. (The internal effect of the flag inside `_eH` was not fully traced, so no assertion is made about its precise behavior.)

---

## Worked example: a thrashing session

1. Turn N: tokens hit the compact band → `DX4` compacts successfully → returns `consecutiveRapidRefills:0` → tracking becomes `{compacted:true, turnCounter:0, consecutiveRapidRefills:0}`.
2. Turn N+1: a huge file read pushes tokens back to the band. `Q.turnCounter` was bumped to 1 (cli_inner_pretty.js:452022). `eb_` is true. `fc6` sees `compacted && turnCounter(1)<3` → `O=1`. `1<3`, so compact again, success, carry `consecutiveRapidRefills:1`.
3. Turn N+2: same again → `O = 1+1 = 2` (carried+1). `2<3` → compact, carry 2.
4. Turn N+3: same → `O = 2+1 = 3`. `3 >= Y08(3)` → **trip**: `{wasCompacted:false, rapidRefillBreakerTripped:true}` → query loop emits `tengu_auto_compact_rapid_refill_breaker` and shows `Oc6` to the user, ending the turn.

If instead at any step the refill took >=3 turns (`turnCounter>=3`), `fc6` returns 0 and the streak resets — normal long-running sessions never trip.

---

## Telemetry helper

```javascript
// ============================================
// logFeatureSad (t$) - telemetry helper used by the rapid-refill breaker
// Location: cli_inner_pretty.js:41596-41598
// ============================================

// ORIGINAL (for source lookup):
function t$(H, $, q) {
  d("tengu_feature_sad", { feature_name: H, error_code: $, ...q });
}

// READABLE (for understanding):
function logFeatureSad(featureName, errorCode, extra) {
  logEvent('tengu_feature_sad', { feature_name: featureName, error_code: errorCode, ...extra });
}
// rapid-refill breaker calls: logFeatureSad('compact_auto', 'compact_auto_rapid_refill_breaker')

// Mapping: t$->logFeatureSad, H->featureName, $->errorCode, q->extra, d->logEvent
```

---

## Constants

```javascript
// ============================================
// Constants block - both breaker thresholds + cold-compact + thrashing message
// Location: cli_inner_pretty.js:424124-424155
// ============================================

// ORIGINAL (for source lookup):
var MX4 = 20000, zc6 = 1e5, jX4 = 1e6, ob_, _c6 = 3, Yc6 = 3, Y08 = 3, Oc6;
// ...
Oc6 = `Autocompact is thrashing: the context refilled to the limit within ${Yc6} turns of the previous compact, ${Y08} times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.`;

// READABLE (for understanding):
const MAX_OUTPUT_TOKENS_FOR_SUMMARY = 20000;     // MX4 — output reserve for compaction summary
const MIN_CONFIG_WINDOW = 100_000;               // zc6 — window override floor
const MAX_CONFIG_WINDOW = 1_000_000;             // jX4 — window override ceiling
const MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3;  // _c6 — circuit breaker trip
const RAPID_REFILL_TURN_WINDOW = 3;              // Yc6 — refill 'quick' if <3 turns since compact
const RAPID_REFILL_TRIP = 3;                     // Y08 — trip after 3 consecutive rapid refills
const THRASHING_USER_MESSAGE = `Autocompact is thrashing: the context refilled to the limit within ${RAPID_REFILL_TURN_WINDOW} turns of the previous compact, ${RAPID_REFILL_TRIP} times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.`; // Oc6

// Mapping: MX4->MAX_OUTPUT_TOKENS_FOR_SUMMARY, zc6->MIN_CONFIG_WINDOW, jX4->MAX_CONFIG_WINDOW, ob_->defaultWindowTable, _c6->MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES, Yc6->RAPID_REFILL_TURN_WINDOW, Y08->RAPID_REFILL_TRIP, Oc6->THRASHING_USER_MESSAGE
```

---

## Cross-validation against v2.1.88

**MATCHED v2.1.88:**
- **`AutoCompactTrackingState` core shape** `{compacted, turnCounter, turnId, consecutiveFailures?}` — the v2.1.156 construction at cli_inner_pretty.js:451346 is identical, plus the new `consecutiveRapidRefills` field.
- **Circuit breaker** — constant value 3 (`_c6` == `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` at `autoCompact.ts:70`), the gate-after-`DISABLE_COMPACT` ordering, increment-on-catch, reset-to-0-on-success, and the exact debug string `autocompact: circuit breaker tripped after N consecutive failures — skipping future attempts this session` (`DX4` cli_inner_pretty.js:424088 vs `autoCompact.ts:345`).
- **The motivating production comment** (`BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures … wasting ~250K API calls/day`) is the documented rationale for the breaker (`autoCompact.ts:67-70`).
- **Per-turn threading** — v2.1.88 `query.ts:521-542` resets `{compacted:true,turnId,turnCounter:0,consecutiveFailures:0}` on compact and merges `{...tracking, consecutiveFailures}` on failure; v2.1.156 query loop (cli_inner_pretty.js:451346/451349) does exactly this, with `consecutiveRapidRefills` added.
- **`isAutoCompactEnabled`** (`J0`, cli_inner_pretty.js:423983) matches `autoCompact.ts:147-158` (`DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`, `autoCompactEnabled` setting).
- **Banded thresholds** — v2.1.156 `fX4` buffers (−13000 compact / −20000 warn / −3000 blocking) match v2.1.88 `AUTOCOMPACT_BUFFER_TOKENS=13_000`, `WARNING/ERROR=20_000`, `MANUAL_COMPACT=3_000`.

**Note on the v2.1.88 dispatcher body:** The gate-level comparison (v2.1.88 `autoCompactIfNeeded` had only `DISABLE_COMPACT` + circuit-breaker gates, with no rapid-refill / reactive routing / threshold-source / cold-compact) is accurate. But the v2.1.88 function was not otherwise bare: it already contained a `trySessionMemoryCompaction` experiment branch (`autoCompact.ts:288-310`) that ran before `compactConversation`. In v2.1.156 that session-memory-first logic is no longer inline in the dispatcher body here — it moved into the reactive/local routines.

**DIVERGED / POST-2.1.88 (confirmed absent in v2.1.88 `src/` via grep):**
- **The entire rapid-refill ("thrashing") breaker** — counter `fc6`/`computeRapidRefillCount` (cli_inner_pretty.js:423948), constants `Yc6`=`RAPID_REFILL_TURN_WINDOW`(3) and `Y08`=`RAPID_REFILL_TRIP`(3) (cli_inner_pretty.js:424129-424130), tracking field `consecutiveRapidRefills`, result field `rapidRefillBreakerTripped`, telemetry `t$('compact_auto','compact_auto_rapid_refill_breaker')` + `tengu_auto_compact_rapid_refill_breaker`, and user message `Oc6`/`THRASHING_USER_MESSAGE` (cli_inner_pretty.js:424155). None of these exist in v2.1.88 (grep of `src/` for `rapidRefill`/`consecutiveRapidRefills` returns nothing).
- **Reactive routing** — `thresholdSource` resolver `ab_`/`getThresholdSource` + `Xl` provenance machinery (`env|settings|experiment|auto`), the `M!='auto' && isLocal()` routing branch to `lA8`/`reactiveCompact` (cli_inner_pretty.js:424018-424058), and result fields `thresholdSource` + `routedThroughReactive` carried into `tengu_auto_compact_succeeded`. reactiveCompact existed in v2.1.88 as a `feature('REACTIVE_COMPACT')`-gated, ant-only module (require at query.ts:15-16, used as the 413/PTL fallback at query.ts:1120; name-referenced in autoCompact.ts:207 and compact.ts:686), compiled OUT of external builds — so no reactiveCompact.ts file is present on disk in the external v2.1.88 tree (it is DCE'd). What is genuinely NEW in v2.1.156 is the dispatcher-level reactive ROUTING fork (the `thresholdSource !== "auto"` branch), `getThresholdSource`/`ab_`, and the `routedThroughReactive` result field — none of which exist in v2.1.88.
- **The `isLocal` gate** `_JH`=`!isEnvTruthy(CLAUDE_CODE_REMOTE)` (cli_inner_pretty.js:423988) plus the redwood3 (`Pc`) / configured-window (`EH$`) local-mode suppression inside `eb_` — v2.1.88's equivalent suppression was instead `feature()`-gated `REACTIVE_COMPACT`/`CONTEXT_COLLAPSE`/`session_memory`/`marble_origami` guards in `shouldAutoCompact`.
- **Cold-compact** `Mc6`/`CLAUDE_CODE_COLD_COMPACT` (cli_inner_pretty.js:423951) threaded as the 8th arg into `_eH`.
- **Precompute machinery** — `precomputeBufferFraction` (`qc6`=0.2 via `tengu_amber_rokovoko`), `getPrecomputeThreshold` `YX4` (cli_inner_pretty.js:423870), experiment window `wX4` via `tengu_amber_redwood2` (cli_inner_pretty.js:423906).
- **`DX4`/`autoCompactIfNeeded` is now an ASYNC GENERATOR** that `yield*`-pumps compact events via `Xv$` and returns the result (v2.1.88's `autoCompactIfNeeded` was a plain async function returning `{wasCompacted, compactionResult, consecutiveFailures}`).

**NOT CONFIRMED:** The precise internal effect of the cold-compact flag inside `_eH` (its body was not fully traced), so this doc states only that `DX4` plumbs the env flag through.

Telemetry event names verified verbatim: `tengu_feature_sad`, `compact_auto_rapid_refill_breaker`, `tengu_auto_compact_routed_reactive`, `tengu_auto_compact_circuit_breaker`, `tengu_auto_compact_rapid_refill_breaker`, `tengu_post_autocompact_turn`, `tengu_auto_compact_succeeded`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:
- `autoCompactIfNeeded` (`DX4`) — cli_inner_pretty.js:424002-424093 — async-generator per-turn dispatcher; runs both breakers, reactive routing, and local full compact; returns the result object the loop destructures at 451285
- `shouldAutoCompact` (`eb_`) — cli_inner_pretty.js:423991-424001 — predicate true only at compact|blocked band, after recursion/enabled/local-mode gates
- `computeRapidRefillCount` (`fc6`) — cli_inner_pretty.js:423948-423950 — rapid-refill counter: +1 if prev turn compacted and turnCounter<Yc6, else 0 (NEW in v2.1.156)
- `isColdCompact` (`Mc6`) — cli_inner_pretty.js:423951-423953 — `isEnvTruthy(CLAUDE_CODE_COLD_COMPACT)`; plumbed into `_eH` (NEW in v2.1.156)
- `isAutoCompactEnabled` (`J0`) — cli_inner_pretty.js:423983-423987 — gates `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`, and the `autoCompactEnabled` setting
- `isLocal` (`_JH`) — cli_inner_pretty.js:423988-423990 — `!isEnvTruthy(CLAUDE_CODE_REMOTE)` (NEW gate in v2.1.156)
- `getThresholdSource` (`ab_`) — cli_inner_pretty.js:423935-423937 — returns `Xl().source` ∈ {env,settings,experiment,auto}; drives reactive routing (NEW in v2.1.156)
- `resolveAutoCompactWindow` (`Xl`) — cli_inner_pretty.js:423915-423930 — resolves the window from env/settings/experiment/default table; returns `{window, configured, source}`
- `isWindowConfiguredByEnvOrSettings` (`EH$`) — cli_inner_pretty.js:423931-423934 — true when `Xl().source` is `env` or `settings`; used in `eb_`'s local-mode gate
- `isRedwood3Enabled` (`Pc`) — cli_inner_pretty.js:423902-423905 — `tengu_amber_redwood3` experiment gate; part of `eb_`'s local-mode gate
- `getExperimentWindowForModel` (`wX4`) — cli_inner_pretty.js:423906-423914 — `tengu_amber_redwood2` experiment window, opus-4-8 only; source `experiment` in `Xl`
- `classifyTokenLevel` (`fX4`) — cli_inner_pretty.js:423873-423884 — banded token-level classifier returning `{level: ok|warn|compact|blocked, pctLeft}`
- `classifyTokenLevelForWindow` (`WRH`) — cli_inner_pretty.js:423971-423975 — wrapper that builds the options object and calls `fX4` with the effective + blocking windows
- `getCompactThreshold` (`Jv$`) — cli_inner_pretty.js:423864-423868 — `effectiveWindow − 13000` (or testPctOverride); the compact-band boundary
- `getPrecomputeThreshold` (`YX4`) — cli_inner_pretty.js:423870-423872 — `min(window − round(window·precomputeBufferFraction), compactThreshold)`; speculative-precompute trigger
- `getAutoCompactThreshold` (`DU6`) — cli_inner_pretty.js:423968-423970 — `Jv$(_qH(model,window), options)`; threshold stamped into recompactionInfo
- `getEffectiveWindow` (`_qH`) — cli_inner_pretty.js:423938-423943 — `resolvedWindow − min(reservedOutput, 20000)`
- `getSpinnerHintText` (`Hx_`) — cli_inner_pretty.js:424095-424102 — `/autocompact` spinner hint when the window came from an experiment below the model default; else null (NEW in v2.1.156)
- `pumpCompactEvents` (`Xv$`) — cli_inner_pretty.js:424103-424123 — adapts callback-style compaction into an async-generator stream the dispatcher can `yield*` while still capturing the final return value
- `reactiveCompact` (`lA8`) — cli_inner_pretty.js:272213+ — reactive compaction engine (precomputed/borrowed compaction, pre-compact hooks, prompt-cache); target of reactive routing and the 413 recovery path. reactiveCompact existed in v2.1.88 as a `feature('REACTIVE_COMPACT')`-gated, ant-only module (require at query.ts:15-16, used as the 413/PTL fallback at query.ts:1120; name-referenced in autoCompact.ts:207 and compact.ts:686), compiled OUT of external builds (so no reactiveCompact.ts is on disk in the external v2.1.88 tree). What is genuinely NEW in v2.1.156 is the dispatcher-level reactive ROUTING fork (the `thresholdSource !== "auto"` branch), `getThresholdSource`/`ab_`, and the `routedThroughReactive` result field — none of which exist in v2.1.88.
- `compactConversationLocal` (`_eH`) — cli_inner_pretty.js:423130+ — local full-compaction generator; receives recompactionInfo, coldCompact flag, spinnerHint
- `logFeatureSad` (`t$`) — cli_inner_pretty.js:41596-41598 — emits `tengu_feature_sad{feature_name,error_code,...}`; used by the rapid-refill breaker
- `logEvent` (`d`) — cli_inner_pretty.js:3374+ — telemetry sink for the auto-compact events
- `isEnvTruthy` (`xH`) — cli_inner_pretty.js:1795-1800 — env truthiness check (1/true/yes/on)
- `logForDebugging` (`N`) — cli_inner_pretty.js:10156+ — debug/warn logger
- `getConfigValue` (`Q1`) — cli_inner_pretty.js:148182+ — layered config reader used by `isAutoCompactEnabled`

Constants:
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6`) — cli_inner_pretty.js:424128 — =3; circuit-breaker trip threshold
- `RAPID_REFILL_TURN_WINDOW` (`Yc6`) — cli_inner_pretty.js:424129 — =3; a refill counts as "rapid" if turnCounter < 3 since the prior compact (NEW in v2.1.156)
- `RAPID_REFILL_TRIP` (`Y08`) — cli_inner_pretty.js:424130 — =3; rapid-refill breaker trips after 3 consecutive rapid refills (NEW in v2.1.156)
- `THRASHING_USER_MESSAGE` (`Oc6`) — cli_inner_pretty.js:424155 — user-facing "Autocompact is thrashing…" message (NEW in v2.1.156)
- `MAX_OUTPUT_TOKENS_FOR_SUMMARY` (`MX4`) — cli_inner_pretty.js:424124 — =20000; output reserve for the compaction summary
- `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (`qc6`) — cli_inner_pretty.js:423887 — =0.2; default precompute buffer fraction (`tengu_amber_rokovoko` override) (NEW vs v2.1.88)
- `MIN_CONFIG_WINDOW` / `MAX_CONFIG_WINDOW` (`zc6` / `jX4`) — cli_inner_pretty.js:424125-424126 — =1e5 / =1e6; valid range for a configured auto-compact window override
