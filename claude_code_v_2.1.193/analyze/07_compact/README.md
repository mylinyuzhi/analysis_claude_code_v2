# 07 — Compaction (v2.1.193): a thin carryover note + one behavior-preserving dispatcher refactor

> Delta module: `07_compact/` for the **v2.1.183 → v2.1.193** window (published sub-versions 2.1.185 / .186 / .187 / .190 / .191 / .193).
> TARGET bundle (every `cli_inner_pretty.js:<line>` below is a **v2.1.193** line unless tagged `(183)`):
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`).
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines, build `9d251abd`).
> **CANONICAL ANALYSIS:** every behavioral lane of compaction was last changed at or before v2.1.183 and is documented in
> [`../../../claude_code_v_2.1.183/analyze/07_compact/`](../../../claude_code_v_2.1.183/analyze/07_compact/README.md) (README + 4 deep docs). Read that tree for the *mechanism*; this doc only records the **193 delta surface**.

---

## TL;DR — compaction is behaviorally UNCHANGED this window

There is **no new compaction *behavior*** in 2.1.183 → 2.1.193. Every behavioral lane — the `--fallback-model`-honoring summarize loop, the 1M-credits-without-credits clamp, the 6-source window resolver, the micro-compact `context_hint` beta, the auto-compact / failure-breaker / rapid-refill thresholds, the `tengu_compact*` telemetry surface, and the prefix-overflow pre-check — is **byte-for-byte carryover** (only the bundler's obf names were re-mangled). The compaction **summary prompt is md5-identical** between the two builds, and the env-var / CLI-flag / feature-gate asset diffs are **0 net-new, 0 removed**.

The **single source-level change** is an internal, **behavior-preserving REFACTOR** of the auto-compact dispatcher's *return shape*: the flat boolean-tagged object `{ wasCompacted, compactionResult, rapidRefillBreakerTripped, … }` (183 `Ego`) became a **discriminated union** `{ kind: "not_needed" | "failure_breaker_open" | "rapid_refill_breaker_tripped" | "compacted" | "hook_blocked" | "failed" }` (193 `Rxo` @`470250`). This is plumbing, not a feature — it appears in **no changelog bullet** (silent refactor). It is provably in-window (`wasCompacted` string-lines 183=10 → 193=0; `rapid_refill_breaker_tripped` 183=0 → 193=2) but cannot be pinned to an exact sub-version (no intermediate bundles).

**Disambiguation:** the "2.1.186 MEMORY.md compact reminder" is an **AUTO-MEMORY** feature, **not** compaction — see [§4](#4-disambiguation--the-2186-memorymd-reminder-is-auto-memory-not-compaction).

**Depth: thin.** One behavior-preserving dispatcher refactor; everything else is carryover. This is the only doc for the module.

### What changed at a glance

| # | Item | Kind | 193 anchor | 183 before | Confidence |
|---|------|------|-----------|------------|:----------:|
| C1 | Auto-compact dispatcher return shape: flat `{wasCompacted}` → discriminated `{kind}` union | **REFINEMENT** (behavior-preserving) | `Rxo` @`470250` | `Ego` @`461531` (183) | high (in-window + behavior-preserving); low on exact sub-version |
| C2 | Two new helpers + 1 consolidated emit site (`CSl` "failed" factory; `VDn` rapid-refill struct; circuit-breaker emit 2→1) | REFINEMENT | `CSl` @`470189`, `VDn` @`235130` | inline in `Ego` (183) | high |
| C3 | Thrash message: template literal → constant-folded static string | REFINEMENT (identical render) | `qZr` @`235138` | `wgo` @`461687` (183) | high |
| — | fallback-model loop, 1M clamp, 6-source resolver, `context_hint` beta, thresholds, prefix-overflow, telemetry, summary prompt | **CARRYOVER** | see [§3](#3-carryover-ledger--the-behavioral-lanes-are-unchanged) | landed ≤ 2.1.183 | high |

---

## 1. The one in-window change — auto-compact dispatcher return-shape refactor

**Type:** REFINEMENT (behavior-preserving internal refactor) · in-window 2.1.183→2.1.193 · not in any changelog bullet.

### 1.1 What it does

**What it does.** The auto-compact dispatcher is the async **generator** that the `query` loop drives each turn (`yield* p.autocompact(...)`) to decide whether to compact and, if so, to run the compaction (reactive or proactive path) and report the outcome. In 183 it returned a **flat object whose truthiness fields the caller had to test**; in 193 it returns a **single discriminated union the caller switches on by `.kind`**. The *decisions* it makes — DISABLE_COMPACT short-circuit, failure-breaker open at ≥3 consecutive failures, `lcf` "is compaction needed" gate, `acf` prefix-overflow probe, rapid-refill breaker, reactive-vs-proactive routing — are **identical**; only the *shape of the answer* changed.

**How it works (step-by-step).** The two control flows are isomorphic. Walk both for the same six exit points:

```javascript
// ============================================
// autoCompactDispatcher - per-turn compaction decision; return shape flat {wasCompacted} -> discriminated {kind}
// Location: cli_inner_pretty.js:470250-470348 (193)  |  before: Ego @461531-461654 (183)
// ============================================

// ORIGINAL (for source lookup) — 193 Rxo (verbatim head + the six return sites):
async function* Rxo(e, t, n, r, o, s, i) {
  if (Be.DISABLE_COMPACT) return { kind: "not_needed" };
  if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= ISl) return { kind: "failure_breaker_open" };
  let a = t.options.mainLoopModel, l = t.options.autoCompactWindow;
  if (!(await lcf(e, a, l, r, s))) return { kind: "not_needed" };          // "is compaction needed?"
  let u = acf(e, a, l, s);                                                 // prefix-overflow probe
  if (u) (T(/*warn*/), Ct("compact_auto", "compact_auto_prefix_overflow"),
          V("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));
  let d = VDn(o), { consecutiveRapidRefills: p } = d;                      // rapid-refill breaker (struct)
  if (d.action === "trip")
    return (T(/*warn*/), Ct("compact_auto", "compact_auto_rapid_refill_breaker"),
            { kind: "rapid_refill_breaker_tripped" });
  let f = WDn(a, l), m = ccf(a, l);                                        // thresholdSource + spinner hint
  if (r !== void 0 && f !== "auto" && M7()) {                             // ── REACTIVE path ──
    /* ...precompute-hook + uat(...) reactive compaction (byte-identical to 183)... */
    if (_) return { kind: "compacted", result: _, consecutiveRapidRefills: p, thresholdSource: f, routedThroughReactive: !0 };
    if (S) return { kind: "hook_blocked", thresholdSource: f, routedThroughReactive: !0 };
    return CSl(o, !0, f);                                                  // reactive failure -> factory
  }
  /* ── PROACTIVE path ── */
  try {
    let y = yield* uat((b, _, S) => Aht(e, b, n, !0, void 0, !0, g, h, m, _, S), t);
    return (Nre(r, t.setAppState, t.agentId, n.stickyBetas),
            { kind: "compacted", result: y, consecutiveRapidRefills: p, thresholdSource: f, routedThroughReactive: !1 });
  } catch (y) {
    if (Ae(y).startsWith(Hht)) return { kind: "hook_blocked", routedThroughReactive: !1 };
    if (!nZ(y, d4)) if (icf(y)) T(`autocompact failed: ${Ae(y)}`, { level: "error" }); else ke(y);
    return CSl(o, !1, void 0);                                            // proactive failure -> factory
  }
}

// ORIGINAL (for source lookup) — 183 Ego (verbatim head + the six return sites):
async function* Ego(e, t, n, r, o, s, i) {
  if (Ge.DISABLE_COMPACT) return { wasCompacted: !1 };
  if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= jgo) return { wasCompacted: !1 };
  let a = t.options.mainLoopModel, l = t.options.autoCompactWindow;
  if (!(await Xjp(e, a, l, r, s))) return { wasCompacted: !1 };
  let u = Yjp(e, a, l, s);
  if (u) (/*warn*/ G("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));
  let d = Igo(o);                                                          // bare count (no struct)
  if (d >= cWn) return (/*warn*/ { wasCompacted: !1, rapidRefillBreakerTripped: !0 });
  let p = ywn(a, l), f = Jjp(a, l);
  if (r !== void 0 && p !== "auto" && S7()) {                             // ── REACTIVE path ──
    if (y) return { wasCompacted: !0, compactionResult: y, consecutiveFailures: 0, consecutiveRapidRefills: d, thresholdSource: p, routedThroughReactive: !0 };
    if (_) return { wasCompacted: !1, thresholdSource: p, routedThroughReactive: !0 };
    let S = (o?.consecutiveFailures ?? 0) + 1;
    if (S >= jgo) (/*warn*/ G("tengu_auto_compact_circuit_breaker", { consecutiveFailures: S, routedThroughReactive: !0, thresholdSource: Ne(p) }));  // emit site #1
    return { wasCompacted: !1, consecutiveFailures: S, thresholdSource: p, routedThroughReactive: !0 };
  }
  try {                                                                    // ── PROACTIVE path ──
    let g = yield* Xtt(...);
    return (Qte(...), { wasCompacted: !0, compactionResult: g, consecutiveFailures: 0, consecutiveRapidRefills: d, thresholdSource: p, routedThroughReactive: !1 });
  } catch (g) {
    if (Se(g).startsWith(Vut)) return { wasCompacted: !1 };
    /*...*/ let y = (o?.consecutiveFailures ?? 0) + 1;
    if (y >= jgo) (/*warn*/ G("tengu_auto_compact_circuit_breaker", { consecutiveFailures: y }));                                                     // emit site #2
    return { wasCompacted: !1, consecutiveFailures: y };
  }
}

// READABLE (for understanding) — 193 control flow:
async function* autoCompactDispatcher(messages, loopCtx, cacheSafeParams, querySource, compactState, snipFreedTokens, precomputeHook) {
  if (env.DISABLE_COMPACT) return { kind: "not_needed" };                              // 183: { wasCompacted: false }
  if (compactState?.consecutiveFailures >= FAILURE_BREAKER_MAX /*3*/) return { kind: "failure_breaker_open" }; // 183: { wasCompacted: false }
  const model = loopCtx.options.mainLoopModel, window = loopCtx.options.autoCompactWindow;
  if (!(await autocompactNeeded(messages, model, window, querySource, snipFreedTokens))) return { kind: "not_needed" };
  const prefix = prefixOverflowProbe(messages, model, window, snipFreedTokens);
  if (prefix) emit("tengu_auto_compact_prefix_overflow", { ...prefix, wouldHaveBlocked: true });
  const rr = rapidRefillBreaker(compactState);          // { action, consecutiveRapidRefills } — 183: bare count
  if (rr.action === "trip") return { kind: "rapid_refill_breaker_tripped" };           // 183: { wasCompacted: false, rapidRefillBreakerTripped: true }
  const thresholdSource = resolveThresholdSource(model, window), spinnerHint = autoWindowSpinnerHint(model, window);
  // reactive path: returns { kind: "compacted" } | { kind: "hook_blocked" } | compactFailedResult(state, /*reactive*/true, thresholdSource)
  // proactive path: returns { kind: "compacted" } | { kind: "hook_blocked" } | compactFailedResult(state, /*reactive*/false, undefined)
}

// Mapping: Ego->Rxo->autoCompactDispatcher, {wasCompacted,...}-flat -> {kind}-union,
//   jgo->ISl (FAILURE_BREAKER_MAX=3), Xjp->lcf (autocompactNeeded), Yjp->acf (prefixOverflowProbe),
//   Igo(count)->u8d(count) wrapped by VDn(struct), `d>=cWn` -> `VDn(...).action==="trip"`,
//   ywn->WDn (resolveThresholdSource), Jjp->ccf (autoWindowSpinnerHint), Ge.DISABLE_COMPACT->Be.DISABLE_COMPACT,
//   reactive/proactive circuit-breaker emit sites -> single CSl factory
```

**The six-way exit mapping** (proving it is a pure shape change, not a behavior change):

| Condition | 183 flat return | 193 union return |
|---|---|---|
| `DISABLE_COMPACT` set | `{ wasCompacted: false }` | `{ kind: "not_needed" }` |
| `consecutiveFailures >= 3` | `{ wasCompacted: false }` | `{ kind: "failure_breaker_open" }` |
| not needed (`lcf`/`Xjp` false) | `{ wasCompacted: false }` | `{ kind: "not_needed" }` |
| rapid-refill trip | `{ wasCompacted: false, rapidRefillBreakerTripped: true }` | `{ kind: "rapid_refill_breaker_tripped" }` |
| success (reactive/proactive) | `{ wasCompacted: true, compactionResult, … }` | `{ kind: "compacted", result, … }` |
| hook blocked | `{ wasCompacted: false, thresholdSource?, … }` | `{ kind: "hook_blocked", thresholdSource?, … }` |
| failed | `{ wasCompacted: false, consecutiveFailures, … }` | `{ kind: "failed", consecutiveFailures, … }` (via `CSl`) |

Note 183 **collapsed three logically-distinct "did not compact" outcomes** — DISABLE_COMPACT, failure-breaker-open, and "not needed" — into the **same** `{ wasCompacted: false }`, leaving the caller unable to tell them apart. 193 gives each its own tag (`not_needed` vs `failure_breaker_open`). This is the only *observable* difference, and it is internal (the union never crosses a process/IPC boundary; the caller is `query` in the same module).

**Why this approach.** A discriminated union is the idiomatic TypeScript replacement for a flat object whose fields are mutually-exclusive flags. The 183 shape forced the caller to test fields in a **fragile order** (`if (de) … else if (se) … else if (le !== void 0) …`) where a missing/extra field could silently mis-route — e.g. the caller had to know that `consecutiveFailures !== undefined` meant "failed" only *after* ruling out `compactionResult`. The union makes the outcomes **exhaustive and exclusive**: one `kind` per terminal state, so the `switch` cannot fall through to the wrong branch, and a future outcome (e.g. a new breaker) is a new `kind` rather than a new ambiguous flag. The trade-off is zero runtime cost (object allocation is identical) for a one-time churn of the call site; the alternative (keep the flat shape) was rejected because the *next* feature would have needed yet another boolean to disambiguate `not_needed` from `failure_breaker_open`.

**Key insight.** This is a **refactor that the changelog never mentions** precisely because it changes nothing a user can observe — same telemetry events, same thresholds, same messages, same compaction output. The only way to detect it is the grep signature (`wasCompacted` 10→0, `rapid_refill_breaker_tripped` 0→2). It is the kind of "rode-along with a broader `query`-loop tidy" cleanup that is invisible from the outside but matters when re-basing symbol citations from 183 onto 193.

### 1.2 The caller (`query` loop) was rewritten to switch on `.kind`

**What it does.** The single consumer of the dispatcher — the `query` async generator — replaced its **six-field destructure + boolean tests** with **one binding + a `kind` switch**. The telemetry it emits (`tengu_auto_compact_rapid_refill_breaker`, `tengu_auto_compact_succeeded` with `compactedMessageCount`) is **byte-identical** field-for-field; only the *guards* changed.

```javascript
// ============================================
// queryLoopAutocompactDispatch - switch on .kind instead of testing flat-object booleans
// Location: cli_inner_pretty.js:466397-466458 (193)  |  before: 457755-457821 (183)
// ============================================

// ORIGINAL (for source lookup) — 193 (single binding, switch on kind):
let ge = yield* p.autocompact(ce, $, { systemPrompt: n, userContext: r, systemContext: o, toolUseContext: $, forkContextMessages: ce, stickyBetas: U }, a, le, pe, jIo);
if ((Op("query_autocompact_end"), ge.kind === "rapid_refill_breaker_tripped")) {
  V("tengu_auto_compact_rapid_refill_breaker", { consecutiveRapidRefills: le?.consecutiveRapidRefills ?? 0, turnsSincePreviousCompact: le?.turnCounter ?? -1, queryChainId: re, queryDepth: ne.depth });
  let Me = Nl({ content: qZr, error: "invalid_request", now: p.now, uuid: p.uuid });
  return (yield Me, Kde($, a, Me), { reason: "rapid_refill_breaker" });
}
if (ge.kind === "compacted") {
  let { result: Me, thresholdSource: rt } = ge, { preCompactTokenCount: _t, postCompactTokenCount: cn, truePostCompactTokenCount: Ke, compactionUsage: Dt } = Me;
  V("tengu_auto_compact_succeeded", { /* …thresholdSource, routedThroughReactive: ge.routedThroughReactive, originalMessageCount, */ compactedMessageCount: Me.summaryMessages.length + Me.attachments.length + Me.hookResults.length /* …token counts… */ });
  le = VZr(p.uuid(), ge.consecutiveRapidRefills);                       // success state via factory
} else if (ge.kind === "failed") le = { ...(le ?? { compacted: !1, turnId: "", turnCounter: 0 }), consecutiveFailures: ge.consecutiveFailures };
let _e = ge.kind === "compacted" || ge.kind === "failed";              // "autocompactRan"

// ORIGINAL (for source lookup) — 183 (destructure flat object, test fields):
let { compactionResult: se, consecutiveFailures: le, consecutiveRapidRefills: pe, rapidRefillBreakerTripped: de, thresholdSource: ye, routedThroughReactive: me } = yield* p.autocompact(...);
if ((lf("query_autocompact_end"), de)) { G("tengu_auto_compact_rapid_refill_breaker", {...}); let xe = tc({ content: wgo, error: "invalid_request", now: p.now, uuid: p.uuid }); return (yield xe, zce(M, a, xe), { reason: "rapid_refill_breaker" }); }
if (se) { G("tengu_auto_compact_succeeded", {... compactedMessageCount: se.summaryMessages.length + se.attachments.length + se.hookResults.length ...}); oe = { compacted: !0, turnId: p.uuid(), turnCounter: 0, consecutiveFailures: 0, consecutiveRapidRefills: pe }; }
else if (le !== void 0) oe = { ...(oe ?? { compacted: !1, turnId: "", turnCounter: 0 }), consecutiveFailures: le };
// 183 then passed PAo({ compactionResult: se, consecutiveFailures: le, ... }) — the autocompactRan signal as TWO raw fields

// READABLE (for understanding):
let outcome = yield* queryDeps.autocompact(...);
markPhase("query_autocompact_end");
if (outcome.kind === "rapid_refill_breaker_tripped") {                 // 183: if (rapidRefillBreakerTripped)
  emit("tengu_auto_compact_rapid_refill_breaker", { ... });
  const thrash = makeAssistantError({ content: THRASH_MESSAGE, error: "invalid_request", ... });
  return (yield thrash, recordTombstone(...), { reason: "rapid_refill_breaker" });
}
if (outcome.kind === "compacted") {                                   // 183: if (compactionResult)
  emit("tengu_auto_compact_succeeded", { ...identical fields..., compactedMessageCount: result.summaryMessages.length + result.attachments.length + result.hookResults.length });
  compactState = makeCompactedState(queryDeps.uuid(), outcome.consecutiveRapidRefills);  // 183: inline literal
} else if (outcome.kind === "failed") {                               // 183: else if (consecutiveFailures !== undefined)
  compactState = { ...(compactState ?? blankState), consecutiveFailures: outcome.consecutiveFailures };
}
const autocompactRan = outcome.kind === "compacted" || outcome.kind === "failed"; // 183: compactionResult || consecutiveFailures!==undefined (computed inside the helper)

// Mapping: se->ge.result, de->ge.kind==="rapid_refill_breaker_tripped", le(state)->compactState,
//   inline success literal -> VZr (makeCompactedState), wgo->qZr (THRASH_MESSAGE),
//   PAo({compactionResult,consecutiveFailures,...}) -> BIo({ autocompactRan: _e, ... })  (autocompactRan now pre-derived from kind)
```

**Key insight.** Two more consolidations ride along here, both behavior-preserving: (a) the success-state object literal `{ compacted: true, turnId, turnCounter: 0, consecutiveFailures: 0, consecutiveRapidRefills }` (183, inline) was **extracted into the factory `VZr`** (`235134`); and (b) the "did autocompact run?" signal — passed to the post-loop helper (`PAo`→`BIo`) as the **two raw fields** `compactionResult`/`consecutiveFailures` in 183 — is now **pre-derived as one boolean `autocompactRan = kind ∈ {compacted, failed}`** (`466458`). Both are the same de-duplication impulse as the union itself: collapse "compute the answer from scattered fields at each use site" into "compute it once."

### 1.3 Two new helpers + circuit-breaker emission consolidated 2→1

**`CSl` — the "failed" factory (`470189-470202`).** 183 inlined the circuit-breaker logic at **two** sites inside `Ego` (reactive-fail @`461606-461617`, proactive-fail @`461645-461652`), each incrementing `consecutiveFailures` and — at `>= 3` — emitting `tengu_auto_compact_circuit_breaker`. 193 factors both into one function:

```javascript
// ============================================
// compactFailedResult - the consolidated "failed" factory; increments + maybe-emits circuit breaker
// Location: cli_inner_pretty.js:470189-470202 (193)  |  before: inline x2 in Ego @461606-461617 / @461645-461652 (183)
// ============================================

// ORIGINAL (for source lookup):
function CSl(e, t, n) {
  let r = (e?.consecutiveFailures ?? 0) + 1;
  if (r >= ISl)
    (T(`autocompact: circuit breaker tripped after ${r} consecutive failures${t ? " (reactive path)" : ""} — skipping future attempts this session`, { level: "warn" }),
      V("tengu_auto_compact_circuit_breaker", { consecutiveFailures: r, ...(t && { routedThroughReactive: t }), ...(n && { thresholdSource: $e(n) }) }));
  return { kind: "failed", consecutiveFailures: r, routedThroughReactive: t, thresholdSource: n };
}

// READABLE (for understanding):
function compactFailedResult(compactState, routedThroughReactive, thresholdSource) {
  const consecutiveFailures = (compactState?.consecutiveFailures ?? 0) + 1;
  if (consecutiveFailures >= FAILURE_BREAKER_MAX /* ISl = 3 */) {
    logWarn(`autocompact: circuit breaker tripped after ${consecutiveFailures} consecutive failures${routedThroughReactive ? " (reactive path)" : ""} — skipping future attempts this session`);
    emit("tengu_auto_compact_circuit_breaker", {
      consecutiveFailures,
      ...(routedThroughReactive && { routedThroughReactive }),  // reactive call CSl(o,true,f) -> includes this (== 183 site #1)
      ...(thresholdSource && { thresholdSource: redact(thresholdSource) }), // == 183 site #1
    });
  }
  return { kind: "failed", consecutiveFailures, routedThroughReactive, thresholdSource };
}

// Mapping: CSl->compactFailedResult, e->compactState, t->routedThroughReactive, n->thresholdSource, ISl->FAILURE_BREAKER_MAX(3)
```

The two call sites are `CSl(o, !0, f)` (reactive, `470325`) and `CSl(o, !1, void 0)` (proactive, `470346`). The conditional spreads exactly reproduce the **two distinct 183 emit shapes**: the reactive site (183 @`461612`) emitted `{ consecutiveFailures, routedThroughReactive: true, thresholdSource: Ne(p) }`; the proactive site (183 @`461651`) emitted only `{ consecutiveFailures }`. `CSl(o,true,f)` → both extra fields present; `CSl(o,false,void 0)` → neither. **Same event, same `>= 3` condition, same payloads** — which is why `tengu_auto_compact_circuit_breaker` drops from **2 source lines (183) to 1 (193)** with zero behavior change.

**`VDn` — rapid-refill breaker now returns a struct (`235130-235133`).** 183's `Igo` (`461481`) returned the **bare count** `d` and the dispatcher tested `if (d >= cWn /*3*/)`. 193 keeps that exact count function (re-mangled to `u8d` @`235127`, **byte-identical** modulo the `Ggo`→`3` constant-fold) and wraps it in `VDn`, which returns `{ action, consecutiveRapidRefills }`:

```javascript
// ============================================
// rapidRefillBreaker - struct-wrapper over the rapid-refill count; same threshold (3)
// Location: cli_inner_pretty.js:235127-235133 (193)  |  before: Igo @461481-461483 + `d>=cWn` test (183)
// ============================================

// ORIGINAL (for source lookup):
function u8d(e) {
  return e?.compacted === !0 && e.turnCounter < 3 ? (e?.consecutiveRapidRefills ?? 0) + 1 : 0;
}
function VDn(e) {
  let t = u8d(e);
  return { action: t >= 3 ? "trip" : "proceed", consecutiveRapidRefills: t };
}
// 183: function Igo(e) { return e?.compacted === !0 && e.turnCounter < Ggo ? (e?.consecutiveRapidRefills ?? 0) + 1 : 0; }
//      ...and the dispatcher inlined the threshold test:  let d = Igo(o); if (d >= cWn) { ...trip... }

// READABLE (for understanding):
function rapidRefillCount(compactState) {                              // == 183 Igo (Ggo folded to 3)
  return compactState?.compacted === true && compactState.turnCounter < 3
    ? (compactState?.consecutiveRapidRefills ?? 0) + 1
    : 0;
}
function rapidRefillBreaker(compactState) {                            // NEW struct wrapper
  const count = rapidRefillCount(compactState);
  return { action: count >= 3 ? "trip" : "proceed", consecutiveRapidRefills: count };
}

// Mapping: Igo->u8d (rapidRefillCount, byte-identical), `d>=cWn` test -> VDn (rapidRefillBreaker) {action,count},
//   Ggo(=3)->literal 3, cWn(=3)->literal 3
```

The threshold is **3 in both**: 183 had `cWn = 3` (`461665`) for the trip test and `Ggo = 3` (`461664`) for the `turnCounter <` window; 193 has the trip `>= 3` inline in `VDn` and the window literal `3` inline in `u8d`, plus the constant `VXi = 3` (`235137`) used only in the warn-log message. Pure struct-wrapping + constant-folding.

### 1.4 Thrash message constant-folded (identical render)

**What it does.** The "Autocompact is thrashing" message shown when the rapid-refill breaker trips. 183 built it from a **template literal** interpolating `Ggo` and `cWn` (both `3`); 193 is the **static string** with the numbers baked in. **Rendered text is byte-identical** — this is the compiler/refactor folding `${3}`/`${3}` into literal `3`s, not a wording change.

```javascript
// ============================================
// THRASH_MESSAGE - rapid-refill thrash warning; template literal -> constant-folded static string
// Location: cli_inner_pretty.js:235138-235139 (193)  |  before: wgo @461687 (183)
// ============================================

// ORIGINAL (for source lookup):
qZr = "Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.";
// 183: wgo = `Autocompact is thrashing: the context refilled to the limit within ${Ggo} turns of the previous compact, ${cWn} times in a row. ...`;  (Ggo=3, cWn=3)

// READABLE (for understanding):
const THRASH_MESSAGE = "Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.";

// Mapping: wgo->qZr (THRASH_MESSAGE), `${Ggo}`->3, `${cWn}`->3  (identical rendered output)
```

### 1.5 Evidence — the refactor is in-window and behavior-preserving

Grep-count diff (193 bundle vs 183 bundle), no readable-name column (evidence-only, allowed in module docs):

| Signal | 193 | 183 | Verdict |
|---|:---:|:---:|---|
| `wasCompacted` (string) | **0** | **10** | flat shape removed in-window |
| `rapid_refill_breaker_tripped` (string) | **2** | **0** | union tag net-new in-window |
| `tengu_auto_compact_circuit_breaker` (string) | 1 | 2 | two emit sites consolidated into `CSl` |
| `"not_needed"` (string) | 5 | — | new union tags present |
| `"failure_breaker_open"` / `"hook_blocked"` | 1 / 2 | — | new union tags present |
| `compactedMessageCount` (string) | 1 | 1 | telemetry payload carryover |
| `tengu_auto_compact_succeeded` (string) | 1 | 1 | telemetry carryover |
| `Autocompact is thrashing` exact text | static "3 / 3" | template `${Ggo}/${cWn}` (=3/3) | constant-folded, identical render |

**Classification: REFINEMENT.** HIGH confidence that it is in-window and behavior-preserving (the six exit points map 1:1, the two `CSl` call sites reproduce both 183 emit shapes, the count function `u8d` is byte-identical to `Igo`, the thrash text renders identically). LOW confidence on *which* sub-version (no intermediate bundles between .183 and .193).

---

## 2. Why no compaction work this window (interpretation)

**What it does (the question):** why does a subsystem that had four real deltas in 2.1.157→2.1.183 (fallback chain, 1M clamp, 6-source resolver, precompute/prefix-overflow) get **zero** behavioral work in 2.1.185→2.1.193?

The window's engineering attention is plainly elsewhere — auto-mode/permissions (2.1.193), background-agents / subagent-depth (2.1.186/.187), MCP reliability (2.1.191), OTEL (2.1.193). Compaction received only the **incidental** discriminated-union cleanup, which most plausibly rode along with a broader `query`-loop tidy (the caller at `466397` is the same function that gained other 193 changes). **Key insight:** nothing here changes a default, a threshold, an env var, a flag, or the summary prompt — so **there is no compaction upgrade-behavior gotcha this window**. An operator upgrading 2.1.183 → 2.1.193 sees identical compaction behavior; only an analyst re-basing obf-name citations needs the `Ego`→`Rxo` map.

---

## 3. Carryover ledger — the behavioral lanes are unchanged

Every lane below matched on **stable strings** with identical before/after counts (or counts whose delta is fully explained by §1's refactor), and was spot-read where load-bearing. **None is a 2.1.193 delta** — each landed at or before 2.1.183 and survives byte-for-byte (obf names re-mangled only). The 183 docs remain canonical; follow the back-link for the mechanism.

| Lane (delta origin) | 193 anchor (obf → readable) | 183 canonical doc | Diff evidence | Verdict |
|---|---|---|---|---|
| **`--fallback-model` honoring in summarize** (2.1.178) | `wSl` streamCompactSummary @`469797`; `query_source: Ve("compact")` @`469978` | [`fallback_model_in_compaction.md`](../../../claude_code_v_2.1.183/analyze/07_compact/fallback_model_in_compaction.md) | `query_source:"compact"` present; loop structure identical (spot-read §3.1) | CARRYOVER |
| **1M-credits-without-credits clamp** (2.1.172) | get `wYe` @`2876` / set `Lpr` @`2878` (`Nt.longContext1mCreditsBlocked`) | [`one_million_credits_clamp.md`](../../../claude_code_v_2.1.183/analyze/07_compact/one_million_credits_clamp.md) | `longContext1mCreditsBlocked` get/set pair present @`2876`/`2879` | CARRYOVER |
| **Window resolver — 6 sources** (env/settings/clientdata/model-default/experiment/auto) | `WDn` resolveThresholdSource @`235039` | [`window_resolver_six_sources.md`](../../../claude_code_v_2.1.183/analyze/07_compact/window_resolver_six_sources.md) | precedence/source-set logic unchanged | CARRYOVER |
| **Micro-compaction `context_hint` beta** | `pE("context_hint","context-hint-2026-04-09")` @`102179` | (183 baseline) | beta string `context-hint-2026-04-09` present (no version bump) | CARRYOVER |
| **Prefix-overflow pre-check** | `acf` prefixOverflowProbe @`470203`; `tengu_auto_compact_prefix_overflow` @`470262`; `compact_auto_prefix_overflow` counter @`470261` | [`dispatcher_delta.md`](../../../claude_code_v_2.1.183/analyze/07_compact/dispatcher_delta.md) | event + counter present (now lives inside `Rxo`) | CARRYOVER |
| **Auto-compact thresholds** | failure breaker `ISl = 3` @`470357`; rapid-refill window `VXi = 3` @`235137`; trip `>= 3` in `VDn` | [`dispatcher_delta.md`](../../../claude_code_v_2.1.183/analyze/07_compact/dispatcher_delta.md) | all three constants = 3 (183 `jgo`/`Ggo`/`cWn` all 3) | CARRYOVER |
| **`tengu_compact*` telemetry surface** | `tengu_auto_compact_succeeded`/`_routed_reactive`/`_prefix_overflow`/`_circuit_breaker`/`_rapid_refill_breaker` | (183 baseline) | feature-gate asset diff: 0 net-new, 0 removed | CARRYOVER |
| **`/compact` + auto-compact env/flags** | `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `CLAUDE_AFTER_LAST_COMPACT`, `CLAUDE_CODE_COLD_COMPACT` (`Xxo` @`470235`), `CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP`, `DISABLE_AUTO_COMPACT` | (183 baseline) | env_vars + cli_flags asset diff: 0 net-new, 0 removed | CARRYOVER |
| **Compaction summary prompt** ("Your task is to create a detailed summary…", 8-section template) | 3 detailed-summary prompt assets | (183 baseline) | "Your task is to create a detailed summary" 3=3; **md5 sets identical** | CARRYOVER |
| **Reactive / precompute / hook-block breakers** | `tengu_auto_compact_routed_reactive` @`470278`; precompute hook in `Rxo` @`470281-470315`; OTEL span `claude_code.compaction` | (183 baseline) | counts identical | CARRYOVER |

### 3.1 Spot-read proof: `--fallback-model` honoring is unchanged

193 `wSl` (`469797`) is the **same** model-fallback summarize loop documented as the 2.1.178 delta in [`fallback_model_in_compaction.md`](../../../claude_code_v_2.1.183/analyze/07_compact/fallback_model_in_compaction.md), only re-mangled: on a `ModelFallbackError` with a remaining chain link it emits `tengu_model_fallback_triggered { …, query_source: Ve("compact"), … }` (`469978`), flips stream mode to "requesting", advances the chain index, and `continue`s; on `reason === "model_blocked"` it throws a user-facing "… is currently unavailable." error; otherwise re-throws. The request-dialog consent substitution is structurally identical to 183. **No structural change** — the `query_source: "compact"` tag and the loop shape are intact.

---

## 4. Disambiguation — the 2.1.186 "MEMORY.md reminder" is AUTO-MEMORY, not compaction

The brief flagged a possible "2.1.186 MEMORY.md compact reminder" landing in compaction. **It does not belong here.** It is the auto-memory index size-limit reminder, fully documented in the sibling module [`../31_auto_memory/memory_reminder_and_dream_carryover.md`](../31_auto_memory/memory_reminder_and_dream_carryover.md).

Adversarial evidence in the **193** bundle:

- **No `MEMORY.md` × compaction co-mention.** `grep -nicE "compact[^a-z]{0,40}(memory\.md)"` = **0**. There is no string in the bundle binding `MEMORY.md` to the compaction pipeline ("persists across compact", "write to memory before compact", etc., all = 0).
- **`MEMORY.md` literal is carryover.** `grep -c "MEMORY.md"` = **4 in 193 = 4 in 183** (equal → carryover). The "compact it" WARNING attached to `MEMORY.md` is the *auto-memory index truncation* warning emitted by `truncateMemoryIndexForPrompt` (193 `v$t` @`152573`, 183 `Zkt`@`151691`, byte-identical) — a **memory-index** size cap (200 lines / 25 KB), **not** the conversation-compaction summary. The word "compact" there is a verb addressed to the *user about their MEMORY.md file*, unrelated to the `Rxo`/`tengu_auto_compact_*` pipeline.

**Conclusion:** do **not** document the MEMORY.md reminder under compaction. Cross-link only. (The dossier originally cited `MEMORY.md` at "10=10"; the live re-verification is **4=4** — equal either way, so the carryover verdict is unaffected; the magnitude is corrected here.)

---

## 5. Confidence & residuals

- **HIGH:** the `Ego`→`Rxo` dispatcher refactor is in-window and behavior-preserving (six exit points map 1:1; `CSl` reproduces both 183 circuit-breaker emit shapes; `u8d` byte-identical to `Igo`; thrash text renders identically; all anchors re-read in the live 193 bundle). All carryover lanes proven by equal grep-counts / identical asset diffs / md5-identical summary prompts.
- **LOW:** exact sub-version of the refactor — no intermediate bundles (.185/.186/.187/.190/.191) were diffed, only the .183 and .193 endpoints.
- **Residual (cosmetic):** `VZr` (success-state factory) and the `autocompactRan` pre-derivation are *plausibly* part of the same refactor commit as the union, but could in principle have landed separately within the window; not separable without intermediate bundles. Behavior-preserving regardless.

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, State; the `query`-loop caller lives here)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Core features (Compact — this module routes here)**
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model, Telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_compact.md](../00_overview/symbol_additions_v2_1_193_compact.md)

Related deltas (this 193 tree): the MEMORY.md reminder lives in [`../31_auto_memory/memory_reminder_and_dream_carryover.md`](../31_auto_memory/memory_reminder_and_dream_carryover.md); the OTEL `claude_code.compaction` span is in [`../44_telemetry/`](../44_telemetry/README.md). Canonical 183 mechanism docs: [`../../../claude_code_v_2.1.183/analyze/07_compact/`](../../../claude_code_v_2.1.183/analyze/07_compact/README.md).

Key functions/constants in this document (list format, per CLAUDE.md):

- `autoCompactDispatcher` (obfuscated: `Rxo`, `cli_inner_pretty.js:470250`) — per-turn compaction decision; async generator now returning a discriminated `{kind}` union; 183 predecessor `Ego` (183 `:461531`, flat `{wasCompacted}`).
- `compactFailedResult` (obfuscated: `CSl`, `cli_inner_pretty.js:470189`) — the consolidated "failed" factory; increments `consecutiveFailures`, emits `tengu_auto_compact_circuit_breaker` at `>= 3`; replaces two inline 183 sites (`:461606`/`:461645`).
- `rapidRefillBreaker` (obfuscated: `VDn`, `cli_inner_pretty.js:235130`) — struct-wrapper `{action, consecutiveRapidRefills}` over the count; 183 dispatcher inlined `if (Igo(o) >= cWn)`.
- `rapidRefillCount` (obfuscated: `u8d`, `cli_inner_pretty.js:235127`) — the bare rapid-refill count; byte-identical to 183 `Igo` (`:461481`) modulo `Ggo`→`3`.
- `autocompactNeeded` (obfuscated: `lcf`, `cli_inner_pretty.js:470238`) — "is compaction needed?" gate; 183 `Xjp`.
- `prefixOverflowProbe` (obfuscated: `acf`, `cli_inner_pretty.js:470203`) — fixed-prefix overflow pre-check; 183 `Yjp`.
- `autoWindowSpinnerHint` (obfuscated: `ccf`, `cli_inner_pretty.js:470349`) — "Compacting at auto window…" spinner hint; 183 `Jjp`.
- `resolveThresholdSource` (obfuscated: `WDn`, `cli_inner_pretty.js:235039`) — 6-source window/threshold resolver; 183 `ywn`.
- `makeCompactedState` (obfuscated: `VZr`, `cli_inner_pretty.js:235134`) — success-state factory `{compacted, turnId, turnCounter:0, consecutiveFailures:0, consecutiveRapidRefills}` extracted from 183's inline literal.
- `streamCompactSummary` (obfuscated: `wSl`, `cli_inner_pretty.js:469797`) — the summarize loop honoring `--fallback-model` (`query_source:"compact"` @`469978`); 183 `del`.
- `FAILURE_BREAKER_MAX` (obfuscated: `ISl`, `cli_inner_pretty.js:470357`) — `3`; consecutive-failure circuit-breaker cap; 183 `jgo`.
- `RAPID_REFILL_WINDOW` (obfuscated: `VXi`, `cli_inner_pretty.js:235137`) — `3`; rapid-refill turn window (warn-log only); 183 `Ggo`.
- `THRASH_MESSAGE` (obfuscated: `qZr`, `cli_inner_pretty.js:235138`) — static thrash warning; 183 template literal `wgo` (`:461687`, identical render).
- `getLongContext1mCreditsBlocked` / `setLongContext1mCreditsBlocked` (obfuscated: `wYe`/`Lpr`, `cli_inner_pretty.js:2876`/`2878`) — the 1M-credits-without-credits clamp flag accessors.
- `isColdCompact` (obfuscated: `Xxo`, `cli_inner_pretty.js:470235`) — `CLAUDE_CODE_COLD_COMPACT` env reader used by the proactive path.
- 183 before-picture: `Ego` (dispatcher, 183 `:461531`), `Igo` (count, 183 `:461481`), `wgo` (thrash template, 183 `:461687`), `jgo`/`Ggo`/`cWn` (all `3`, 183 `:461663-461665`), `PAo` (post-loop helper, → 193 `BIo`).
