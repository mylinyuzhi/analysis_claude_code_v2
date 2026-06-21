# Auto-compact dispatcher delta (v2.1.156 → v2.1.183)

> **Delta scope.** This doc covers DELTA 4b + 4c from the compact scout dossier plus the
> stable-structure rename map (dossier DELTA 5) for the dispatcher/breaker layer. Three
> things actually changed in the dispatcher in this window:
>
> 1. **`S7@226751` remote-reactive gate** — the renamed `isLocal` now lets a remote
>    (`CLAUDE_CODE_REMOTE`) session run reactive/proactive compaction *if* the new
>    `tengu_reactive_compact_remote` feature flag is on. The v2.1.156 `_JH` was a bare
>    "is-not-remote" boolean.
> 2. **`Yjp@461484` prefix-overflow pre-check** — a brand-new dispatcher pre-check that
>    measures the fixed cache-prefix token weight against the threshold and emits
>    `tengu_auto_compact_prefix_overflow` when compaction *physically cannot help*.
> 3. **`vqr@227081` recovery-timeout** — the reactive-routing branch now wraps the
>    precompute-swap callback in a 600 000 ms (`recovery-timeout`) abort timer.
>
> Everything else in the dispatcher — the two circuit breakers, the gate-cascade order, the
> async-generator shape, the reactive-routing fork, the `AutoCompactTrackingState` threading
> — is **byte-identical modulo re-minification** to v2.1.156. For the full mechanics of those
> unchanged parts, read the baseline:
> [../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md](../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md).
> This doc does **not** re-derive them; it diffs them.

---

## 0. The rename map (so you don't mistake renames for new code)

These are pure re-minification renames between v2.1.156 and v2.1.183 (logic verified
identical by reading both bundles). The whole dispatcher/breaker cluster moved from
~423948-424155 (v2.1.156) to ~461478-461688 (v2.1.183).

Dispatcher / predicate / helpers (list format — NO mapping table in a module doc):

- `shouldAutoCompact` (obfuscated: `Xjp`, cli_inner_pretty.js:461519; was `eb_`@423991) — the should-compact predicate / token-band gate.
- `autoCompactIfNeeded` (obfuscated: `Ego`, cli_inner_pretty.js:461531; was `DX4`@424002) — the async-generator dispatcher.
- `computeRapidRefillStreak` (obfuscated: `Igo`, cli_inner_pretty.js:461481; was `fc6`@423948) — the rapid-refill counter.
- `isColdCompact` (obfuscated: `Wgo`, cli_inner_pretty.js:461516; was `Mc6`@423951) — `CLAUDE_CODE_COLD_COMPACT` env read.
- `autoWindowSpinnerHint` (obfuscated: `Jjp`, cli_inner_pretty.js:461655; was `Hx_`@424095) — `/autocompact` spinner hint (now also branches on `clientdata`).
- `isLocal` / reactive-remote gate (obfuscated: `S7`, cli_inner_pretty.js:226751; was `_JH`@423988) — **CHANGED, see §1**.
- `getThresholdSource` (obfuscated: `ywn`, cli_inner_pretty.js:226899; was `ab_`) — `z2(...).source`.
- `isRedwood3Reactive` (obfuscated: `uG`, cli_inner_pretty.js:226742; was `Pc`) — `tengu_amber_redwood3` gate.
- `isAutoCompactEnabled` (obfuscated: `Kw`, cli_inner_pretty.js:226746; was `J0`) — `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT`/setting.
- `isConfiguredWindow` (obfuscated: `qCe`, cli_inner_pretty.js:226895; was `EH$`) — window-source-is-configured guard.
- `getAutoCompactThresholdForModel` (obfuscated: `lMt`, cli_inner_pretty.js:226948; was `DU6`) — threshold for `recompactionInfo` + prefix-overflow.
- `prefixOverflowCheck` (obfuscated: `Yjp`, cli_inner_pretty.js:461484; **NEW**) — see §2.

Circuit-breaker constants (values unchanged at 3/3/3):

- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (obfuscated: `jgo`, cli_inner_pretty.js:461663; was `_c6`@424128) — `= 3`.
- `RAPID_REFILL_TURN_WINDOW` (obfuscated: `Ggo`, cli_inner_pretty.js:461664; was `Yc6`@424129) — `= 3`.
- `RAPID_REFILL_BREAKER_COUNT` (obfuscated: `cWn`, cli_inner_pretty.js:461665; was `Y08`@424130) — `= 3`.
- `RECOVERY_TIMEOUT_MS` (obfuscated: `vqr`, cli_inner_pretty.js:227081; **NEW** in this cluster's use) — `= 600000`.
- `THRASHING_USER_MESSAGE` (obfuscated: `wgo`, cli_inner_pretty.js:461687; was `Oc6`@424155) — same text, now interpolating `Ggo`/`cWn`.

**Why call this out:** the asset-anchors note (`_asset_anchors.md:37-39`) warns that *every*
obfuscated name re-mangles between builds, so a reader diffing 156→183 will see a wall of
unfamiliar identifiers (`DX4`→`Ego`, `eb_`→`Xjp`, `_c6`→`jgo`). Listing the 1:1 map up front
lets the rest of this doc focus on the three places where *behavior* — not just the name —
moved.

**Key insight:** Both circuit breakers (the consecutive-failure breaker and the rapid-refill
"thrashing" breaker) are **unchanged in value and intent**: `jgo = Ggo = cWn = 3`
(cli_inner_pretty.js:461663-461665), exactly the `_c6 = Yc6 = Y08 = 3` of v2.1.156. The
rapid-refill counter `Igo` (cli_inner_pretty.js:461481) is character-for-character the same as
v2.1.156 `fc6`:

```javascript
// ============================================
// computeRapidRefillStreak - rapid-refill (thrashing) counter — UNCHANGED from v2.1.156
// Location: cli_inner_pretty.js:461481-461483
// ============================================

// ORIGINAL (for source lookup):
function Igo(e) {
  return e?.compacted === !0 && e.turnCounter < Ggo ? (e?.consecutiveRapidRefills ?? 0) + 1 : 0;
}

// READABLE (for understanding):
function computeRapidRefillStreak(tracking) {
  // +1 to the carried streak only if the previous turn compacted AND it was <3 turns ago;
  // otherwise (no prior compact, or a healthy >=3-turn gap) reset to 0.
  return tracking?.compacted === true && tracking.turnCounter < RAPID_REFILL_TURN_WINDOW /*Ggo=3*/
    ? (tracking?.consecutiveRapidRefills ?? 0) + 1
    : 0;
}

// Mapping: Igo->computeRapidRefillStreak (was fc6), e->tracking, Ggo->RAPID_REFILL_TURN_WINDOW(3);
//          reads tracking.compacted, tracking.turnCounter, tracking.consecutiveRapidRefills
```

Compare the v2.1.156 source verbatim (read at cli_inner_pretty.js:423948-423950, `fc6`):
`return H?.compacted === !0 && H.turnCounter < Yc6 ? (H?.consecutiveRapidRefills ?? 0) + 1 : 0;`
— identical structure, only `H→e` and `Yc6→Ggo`. The breaker semantics (worked-example,
state machine, the production-incident rationale for the `=3` failure cap) are fully
documented in the baseline and are **not** repeated here. See
[../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md](../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md)
sections (b)/(c).

---

## 1. DELTA 4b — `S7` remote-reactive gate

### What it does

`S7` (cli_inner_pretty.js:226751) is the renamed `isLocal`. In v2.1.156 it was a one-liner that
returned `true` only when the session was *local* (not `CLAUDE_CODE_REMOTE`). In v2.1.183 it
returns `true` for a local session **or** for a remote session when the new
`tengu_reactive_compact_remote` feature flag is enabled. The single boolean it produces gates
two dispatcher decisions: the should-compact predicate's local-mode suppression
(`Xjp`/`shouldAutoCompact`, cli_inner_pretty.js:461523) and the reactive-routing fork
(`Ego`/`autoCompactIfNeeded`, cli_inner_pretty.js:461556).

### How it works

```javascript
// ============================================
// isLocal / reactive-remote gate - now allows remote reactive compaction behind a flag
// Location: cli_inner_pretty.js:226751-226756
// ============================================

// ORIGINAL (for source lookup):
function S7() {
  if (st(process.env.CLAUDE_CODE_REMOTE)) {
    if (((YNi ??= ct("tengu_reactive_compact_remote", !1)), !YNi)) return !1;
  }
  return !0;
}
var YNi, Awd;

// READABLE (for understanding):
let reactiveCompactRemoteFlag;             // YNi — memoized once per process
function isLocalOrRemoteReactiveAllowed() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE)) {       // running in a remote/agent session?
    // Resolve the gate ONCE and cache it. Default false.
    reactiveCompactRemoteFlag ??= getFeatureFlag("tengu_reactive_compact_remote", false);
    if (!reactiveCompactRemoteFlag) return false;          // remote + flag OFF → behave as "non-local" (suppress)
  }
  return true;                                             // local, OR remote with the flag ON
}

// Mapping: S7->isLocalOrRemoteReactiveAllowed (was _JH/isLocal), st->isEnvTruthy,
//          ct->getFeatureFlag, YNi->reactiveCompactRemoteFlag (memo cache)
```

**v2.1.156 before-picture** — `_JH` @423988-423990 (read verbatim):

```javascript
// v2.1.156 ORIGINAL:
function _JH() {
  return !xH(process.env.CLAUDE_CODE_REMOTE);
}
// = isLocal() = "not remote"; a bare negated env check, no flag, no remote escape hatch.
```

**Step-by-step (v2.1.183):**
1. If `CLAUDE_CODE_REMOTE` is **not** truthy → the `if` body is skipped → return `true`. This is
   the identical behavior to v2.1.156 for the local case (`!xH(remote)` was already `true`).
2. If `CLAUDE_CODE_REMOTE` **is** truthy → resolve `tengu_reactive_compact_remote` (default
   `false`), **memoize** it into the module-level `YNi` via `??=`, and:
   - flag **off** → `return false` — identical to old v2.1.156 behavior (remote = "non-local" =
     suppress proactive/reactive compaction).
   - flag **on** → fall through to `return true` — **the new escape hatch**: a remote session is
     now treated as "local enough" to run reactive/proactive compaction.

### Where the boolean is consumed (both call-sites)

`S7()` flows into the *same two* gates it fed in v2.1.156, with the readable names from the
baseline:

- **`Xjp`/`shouldAutoCompact` local-mode suppression** (cli_inner_pretty.js:461523):
  `if (S7() && !uG() && !qCe(t, n)) return !1;` — "if we're local-or-remote-reactive-allowed,
  AND the redwood3 experiment is off, AND the window was not explicitly configured, suppress
  proactive autocompact (defer to reactive)." v2.1.156 was the same shape with `_JH() && !Pc()
  && !EH$($, q)`.
- **`Ego` reactive-routing fork** (cli_inner_pretty.js:461556):
  `if (r !== void 0 && p !== "auto" && S7()) { ... }` — "if there's a real querySource, the
  window source is configured (not `auto`), AND we're local-or-remote-reactive-allowed, route
  through the reactive compactor." v2.1.156 was `if (K !== void 0 && M !== "auto" && _JH())`.

So the *only* change is what `S7()` returns for a remote session with the flag on — and that
flips both gates from "suppress / take the plain path" to "allow reactive compaction." No
call-site code changed.

### Why this approach

- **Trade-off (gate vs new branch):** Anthropic chose to overload the *existing* `isLocal`
  boolean rather than thread a new `allowRemoteCompaction` parameter through `shouldAutoCompact`
  and the routing fork. That keeps both call-sites byte-for-byte structurally identical (only
  the obfuscated name changed), minimizing diff surface and regression risk. The cost is a
  slight loss of semantic clarity — `isLocal()` no longer strictly means "local" — which is why
  the readable name here is `isLocalOrRemoteReactiveAllowed`.
- **Memoization (`??=`):** the flag is resolved at most once per process and cached in `YNi`.
  Feature-flag resolution (`ct`) can hit a network/clientdata-backed evaluator; the dispatcher
  runs `S7()` on *every* turn (it's in the per-turn predicate). Caching avoids re-evaluating a
  flag whose value cannot change mid-process. The trade-off: a flag flip mid-session won't be
  picked up — acceptable because `CLAUDE_CODE_REMOTE`-ness is itself fixed for the process.
- **Default-false:** remote sessions historically did **not** run client-side compaction
  (the server/orchestrator owns context management for remote runs). Defaulting the new flag to
  `false` preserves that contract; the flag is the deliberate opt-in for the new remote-reactive
  experiment.

### Why it matters

Before this change, any remote session (`CLAUDE_CODE_REMOTE` set — e.g. cloud agents, the
`/background` runner, agent-team workers) *never* compacted client-side: `_JH()` returned
`false`, so `shouldAutoCompact`'s suppression gate let it through to the predicate but the
routing fork's `_JH()` was false, and remote sessions deferred entirely. With
`tengu_reactive_compact_remote` on, a remote session with a configured window now reaches the
reactive compactor `TGn`/`reactiveCompact` exactly like a local one. This is the dispatcher-side
enablement for running the reactive engine in remote/agent contexts.

**Verification.** `grep -c "tengu_reactive_compact_remote"` over the v2.1.156 bundle returns
**0**; over v2.1.183 returns **1** (the `ct(...)` call at cli_inner_pretty.js:226753). The
v2.1.156 `_JH` body was read at 423988-423990 and is the bare negated-env one-liner above.
**Confidence: high.**

> **Open caveat (carried from dossier §4 / Q2):** the *downstream* effect of routing a remote
> session through the reactive engine — specifically whether the new precompute arm table and
> `tengu_precomputed_compact_arm_gated` telemetry change the swap timing in remote vs local —
> was not traced end-to-end. This doc asserts only the gate behavior, not the full remote
> reactive lifecycle.

---

## 2. DELTA 4c — `Yjp` prefix-overflow pre-check

### What it does

`Yjp` (cli_inner_pretty.js:461484, readable `prefixOverflowCheck`) is a **new** dispatcher
helper with no v2.1.156 ancestor. It answers a question the old dispatcher never asked: *"is the
fixed, un-compactable cache-prefix of this conversation already over the compact threshold?"* If
so, compaction physically cannot bring the conversation back under the limit — summarizing the
tail does nothing about a prefix that is itself too big — and `Ego` emits a diagnostic event
`tengu_auto_compact_prefix_overflow` *(then proceeds with the normal compaction attempt anyway)*.

### How it works

```javascript
// ============================================
// prefixOverflowCheck - detect when the fixed cache-prefix already exceeds the compact threshold
// Location: cli_inner_pretty.js:461484-461515
// ============================================

// ORIGINAL (for source lookup):
function Yjp(e, t, n, r = 0) {
  let o = Qtt(e);
  if (!o) return null;
  let s = o.input_tokens + o.cache_read_input_tokens + o.cache_creation_input_tokens,
    i = $T(e, ww(t)),
    a = Math.max(0, s - r - i),
    l = lMt(t, n);
  if (a <= l) return null;
  let c = 0,
    u = 0,
    d = (p) => {
      for (let f of p) {
        let m = f;
        if (m.type === "document") c++;
        else if (m.type === "image") u++;
        else if (m.type === "tool_result" && Array.isArray(m.content)) d(m.content);
      }
    };
  for (let p of e) {
    let f = p.message?.content;
    if (Array.isArray(f)) d(f);
  }
  return {
    prefixTokens: a, thresholdTokens: l, totalInputTokens: s, messagesEstimate: i,
    snipTokensFreed: r, documentBlockCount: c, imageBlockCount: u,
  };
}

// READABLE (for understanding):
function prefixOverflowCheck(messages, model, window, snipTokensFreed = 0) {
  // 1. Pull the most recent assistant turn's API usage (the authoritative token ledger).
  const usage = latestAssistantUsage(messages);              // Qtt — scans newest→oldest
  if (!usage) return null;                                   // no usage data → cannot reason

  // 2. Total input the server actually billed = fresh input + cache-read + cache-creation.
  const totalInputTokens =
    usage.input_tokens + usage.cache_read_input_tokens + usage.cache_creation_input_tokens;

  // 3. Estimate the tokens contributed by the *messages themselves* (the compactable tail).
  const messagesEstimate = estimateMessagesTokens(messages, ctxWindowForModel(model)); // $T + ww

  // 4. The FIXED PREFIX = everything billed minus the compactable messages minus what a
  //    pending snip already freed. This is system prompt + tools + cache prefix — the part
  //    that compaction does NOT touch.
  const prefixTokens = Math.max(0, totalInputTokens - snipTokensFreed - messagesEstimate);

  // 5. Compare the fixed prefix against the SAME threshold the dispatcher compacts at.
  const thresholdTokens = getAutoCompactThresholdForModel(model, window); // lMt
  if (prefixTokens <= thresholdTokens) return null;          // prefix fits → compaction CAN help

  // 6. Prefix is over threshold → tally document/image blocks (the usual culprits) for telemetry.
  let documentBlockCount = 0, imageBlockCount = 0;
  const tally = (blocks) => {
    for (const b of blocks) {
      if (b.type === "document") documentBlockCount++;
      else if (b.type === "image") imageBlockCount++;
      else if (b.type === "tool_result" && Array.isArray(b.content)) tally(b.content); // recurse
    }
  };
  for (const m of messages) {
    const content = m.message?.content;
    if (Array.isArray(content)) tally(content);
  }
  return { prefixTokens, thresholdTokens, totalInputTokens, messagesEstimate,
           snipTokensFreed, documentBlockCount, imageBlockCount };
}

// Mapping: Yjp->prefixOverflowCheck (NEW), e->messages, t->model, n->window, r->snipTokensFreed,
//          o->usage, s->totalInputTokens, i->messagesEstimate, a->prefixTokens, l->thresholdTokens,
//          c->documentBlockCount, u->imageBlockCount, d->tally, p/f/m->loop vars;
//          Qtt->latestAssistantUsage, $T->estimateMessagesTokens, ww->ctxWindowForModel,
//          lMt->getAutoCompactThresholdForModel
```

**Supporting helpers (read in v2.1.183 to confirm the math):**
- `Qtt`/`latestAssistantUsage` (cli_inner_pretty.js:227130-227143) walks `messages` newest→oldest,
  returns the first assistant turn's `{input_tokens, output_tokens, cache_creation_input_tokens,
  cache_read_input_tokens}` (the last two `?? 0`). This is the server's authoritative billed
  ledger for the prior request, so step 2's `totalInputTokens` is *real*, not an estimate.
- `$T`/`estimateMessagesTokens` (cli_inner_pretty.js:462778-462782) sums a per-message token
  estimate (`H3p`) over the array — the *estimated* contribution of the conversation content.
- `ww`/`ctxWindowForModel` (cli_inner_pretty.js:102904) supplies the model's context window to the
  estimator (used for the tokenizer choice / estimation tuning).
- `lMt`/`getAutoCompactThresholdForModel` (cli_inner_pretty.js:226948) = `gwn(oee(model,window),
  Sqr(model,window))` — the **same** compact-threshold the dispatcher uses to decide whether to
  compact. Using the identical threshold means "prefix overflow" is defined relative to the exact
  bar compaction is trying to clear.

### How `Ego` uses it (the call-site)

In the dispatcher, immediately after the should-compact predicate passes but **before** the
rapid-refill breaker:

```javascript
// ============================================
// Ego prefix-overflow call-site - emit diagnostic, then continue compacting anyway
// Location: cli_inner_pretty.js:461537-461543
// ============================================

// ORIGINAL (for source lookup):
let u = Yjp(e, a, l, s);
if (u)
  (v(`autocompact: fixed prefix ~${u.prefixTokens} > threshold ${u.thresholdTokens} — compaction cannot help`,
    { level: "warn" }),
    Rt("compact_auto", "compact_auto_prefix_overflow"),
    G("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));

// READABLE (for understanding):
const overflow = prefixOverflowCheck(messages, model, window, snipTokensFreed);
if (overflow) {
  logForDebugging(
    `autocompact: fixed prefix ~${overflow.prefixTokens} > threshold ${overflow.thresholdTokens} — compaction cannot help`,
    { level: "warn" });
  logFeatureSad("compact_auto", "compact_auto_prefix_overflow");          // tengu_feature_sad
  logEvent("tengu_auto_compact_prefix_overflow", { ...overflow, wouldHaveBlocked: true });
}
// NOTE: NO early return — the dispatcher records the diagnostic and falls through to the
// normal rapid-refill-breaker / routing / compaction logic.

// Mapping: u->overflow, e->messages, a->model, l->window, s->snipTokensFreed;
//          v->logForDebugging, Rt->logFeatureSad, G->logEvent
```

`Rt`/`logFeatureSad` (cli_inner_pretty.js:44575) emits `tengu_feature_sad{feature_name:"compact_auto",
error_code:"compact_auto_prefix_overflow"}` — the same telemetry shape the rapid-refill breaker
uses (`logFeatureSad("compact_auto","compact_auto_rapid_refill_breaker")` at
cli_inner_pretty.js:461551). The `tengu_auto_compact_prefix_overflow` event carries the full
diagnostic payload (`prefixTokens`, `thresholdTokens`, `totalInputTokens`, `messagesEstimate`,
`snipTokensFreed`, `documentBlockCount`, `imageBlockCount`) plus `wouldHaveBlocked: true`.

### Why this approach

- **What problem it diagnoses:** When the *fixed prefix* (system prompt + tool schemas + the
  pinned cache prefix) is itself larger than the compact threshold, compaction is doomed — it
  only rewrites the conversation tail into a summary, so even a perfect summary leaves a prefix
  that still overflows. The session would then thrash (compact succeeds, immediately refills) or
  hard-fail on a `prompt_too_long`. The rapid-refill breaker *eventually* catches the thrash, but
  only after 3 wasted compactions. `Yjp` identifies the root cause *proactively* — usually a
  huge `document`/`image` block in a tool result that got cache-pinned — and counts those blocks
  so the telemetry pinpoints the culprit (`documentBlockCount`/`imageBlockCount`).
- **Why fire-and-continue (no early return):** This is the key design choice. `Ego` does **not**
  bail when the prefix overflows; it logs and proceeds with the normal compaction attempt. The
  rationale: the prefix estimate uses a *mix* of authoritative billed tokens (`Qtt`) and an
  *estimated* messages contribution (`$T`), so `prefixTokens` can be slightly off. Treating it as
  an authoritative "abort" would risk *suppressing a compaction that would in fact have helped*.
  Instead the check is purely **observational** — it surfaces the situation (and the `wouldHave
  Blocked` flag lets the server-side analytics quantify how often a prefix-overflow precedes a
  hard block) while still letting the existing breakers handle the actual flow control.
- **Alternative considered (inferable):** they *could* have wired `Yjp` to return early with a
  user-facing message (like the thrashing message `wgo`). They didn't — the conservative
  "diagnose, don't gate" stance is consistent with the estimate-vs-billed uncertainty above, and
  avoids a new failure mode where a mis-estimate blocks legitimate compaction.
- **Reuse of the exact threshold:** by calling the *same* `lMt`/`getAutoCompactThresholdForModel`
  the dispatcher already uses, "overflow" is defined relative to the precise bar compaction
  targets — no second, drifting threshold to maintain.

**Key insight:** This is a **non-blocking observability probe** wedged between the should-compact
gate and the breakers. It does not change control flow (`wouldHaveBlocked: true` is a *label*, not
an action). Its value is the new event `tengu_auto_compact_prefix_overflow`, which lets Anthropic
measure how often the un-compactable prefix is the real cause of a compaction loop — exactly the
class of problem the rapid-refill breaker only treats symptomatically.

**Verification.** `grep -c "tengu_auto_compact_prefix_overflow"` over v2.1.156 → **0**; over
v2.1.183 → **1** (the `G(...)` at 461543). `grep -c "compact_auto_prefix_overflow"` (the
feature-sad error code) v2.1.156 → **0**, v2.1.183 → **1**. `grep -c "wouldHaveBlocked"` v2.1.156
→ **0**. `Yjp`'s body was read at 461484-461515 and the `Qtt`/`$T`/`lMt` helpers at the cited
lines. **Confidence: high.**

---

## 3. DELTA (3rd dispatcher change) — `vqr` reactive recovery-timeout in the routing fork

### What it does

The reactive-routing branch of `Ego` (cli_inner_pretty.js:461556-461618) gained a **new
precompute-swap callback** (`i`, the dispatcher's 7th parameter — `Ego` is
`async function* Ego(e, t, n, r, o, s, i)` vs v2.1.156's 6-param `DX4(H, $, q, K, _, z)`). When
present, that callback is run under a **600 000 ms abort timer** keyed `"recovery-timeout"` so a
hung precompute-swap can't stall the turn indefinitely. The timeout value is the new constant
`vqr` (cli_inner_pretty.js:227081 = `600000`).

### How it works

```javascript
// ============================================
// Ego reactive-routing precompute-swap + recovery-timeout - the new inner callback wrapper
// Location: cli_inner_pretty.js:461559-461595
// ============================================

// ORIGINAL (for source lookup):
let g = performance.now(),
  h = r,
  { result: y, hookBlocked: _ } = yield* Xtt(async (T, C, x) => {
    let I;
    if (i) {
      let L = ZO(T.abortController),
        P = setTimeout((R) => R.abort("recovery-timeout"), vqr, L);
      P.unref?.();
      try {
        I = await i({ toolUseContext: { ...T, abortController: L }, messages: e,
                      querySource: h, trigger: "threshold", detectedAt: g });
      } finally { clearTimeout(P); }
    }
    let k = await TGn({ hasAttempted: !1, querySource: h,
      aborted: T.abortController.signal.aborted, messages: e,
      cacheSafeParams: { ...n, toolUseContext: T },
      precomputed: I?.swap, precomputeOutcome: I?.outcome,
      userWaitStartedAt: g, thresholdSource: p, spinnerHintText: f });
    if (k.result === null && I?.emittedEarlyCompactStart)
      (T.onCompactEvent?.({ type: "compact_progress", event: { type: "compact_end" } }),
        T.onCompactEvent?.({ type: "sdk_status", status: null }));
    return k;
  }, t);

// READABLE (for understanding):
const detectedAt = performance.now();
const querySource = r;
const { result, hookBlocked } = yield* pumpCompactEvents(async (ctx, _notify, _emit) => {
  let precompute;
  if (precomputeSwapCallback /* i */) {
    // Fork a child abort controller and arm a 600s "recovery-timeout" guard.
    const childAbort = forkAbortController(ctx.abortController);              // ZO
    const timer = setTimeout((ac) => ac.abort("recovery-timeout"), RECOVERY_TIMEOUT_MS /*vqr=600000*/, childAbort);
    timer.unref?.();                                                          // don't keep the process alive
    try {
      precompute = await precomputeSwapCallback({
        toolUseContext: { ...ctx, abortController: childAbort },
        messages, querySource, trigger: "threshold", detectedAt,
      });
    } finally { clearTimeout(timer); }                                       // always disarm
  }
  const out = await reactiveCompact({                                        // TGn
    hasAttempted: false, querySource,
    aborted: ctx.abortController.signal.aborted, messages,
    cacheSafeParams: { ...cacheSafeParams, toolUseContext: ctx },
    precomputed: precompute?.swap, precomputeOutcome: precompute?.outcome,
    userWaitStartedAt: detectedAt, thresholdSource, spinnerHintText: spinnerHint,
  });
  // If the swap emitted an early compact-start but the reactive compact produced nothing,
  // close the dangling UI: emit compact_end + clear sdk_status.
  if (out.result === null && precompute?.emittedEarlyCompactStart) {
    ctx.onCompactEvent?.({ type: "compact_progress", event: { type: "compact_end" } });
    ctx.onCompactEvent?.({ type: "sdk_status", status: null });
  }
  return out;
}, toolUseContext);

// Mapping: i->precomputeSwapCallback (NEW 7th param), ZO->forkAbortController, vqr->RECOVERY_TIMEOUT_MS(600000),
//          TGn->reactiveCompact (was lA8), Xtt->pumpCompactEvents (was Xv$), g->detectedAt, h->querySource,
//          y->result, _->hookBlocked, I->precompute, L->childAbort, P->timer
```

**v2.1.156 before-picture** — the reactive branch (read at cli_inner_pretty.js:424023-424035) had
**no** precompute callback, no child abort controller, and no timer. It called `lA8` directly:

```javascript
// v2.1.156 ORIGINAL (reactive branch — no recovery-timeout, no precompute swap):
let { result: J, hookBlocked: X } = yield* Xv$(
  (Z, W, G) => lA8({ hasAttempted: !1, querySource: K,
    aborted: Z.abortController.signal.aborted, messages: H,
    cacheSafeParams: { ...q, toolUseContext: Z },
    thresholdSource: M, spinnerHintText: j }),
  $);
```

A `grep -c "recovery-timeout"` over the v2.1.156 bundle returns **0**; the precompute-swap
arguments (`precomputed`, `precomputeOutcome`, `userWaitStartedAt`, `detectedAt`, `trigger:
"threshold"`) are all absent from the v2.1.156 reactive branch.

### Why this approach

- **What `vqr` guards:** the new `i` precompute-swap callback can do real work — borrow a
  speculatively-precomputed compaction, run pre-compact hooks, hit the model. A bug or a wedged
  hook could leave it pending forever, freezing the user's turn with the "Compacting…" spinner
  up. Arming a 10-minute (`600000` ms) abort timer on a **forked** child controller bounds that
  worst case: after 10 minutes the child aborts with reason `"recovery-timeout"` and the
  callback's awaits reject, so the turn proceeds (falling through to `reactiveCompact` with no
  precompute).
- **Why a forked child controller (`ZO`) and not the parent's:** the timer fires
  `childAbort.abort("recovery-timeout")` — aborting only the *precompute swap*, not the whole
  turn's `toolUseContext.abortController`. That keeps the recovery-timeout scoped to the
  speculative work; a user-initiated cancel on the parent still propagates down (the child is
  derived from the parent), but a precompute timeout does not nuke the parent turn.
- **`timer.unref?.()`:** so an armed recovery-timer never keeps the Node/Bun event loop alive on
  its own — process shutdown isn't blocked waiting on a 10-minute timer.
- **`finally { clearTimeout }`:** the timer is disarmed whether the callback resolves or throws,
  so a fast precompute doesn't leak a pending 10-minute timer.
- **Trade-off:** 600 s is generous — it's a *safety net* for a hung swap, not a tight latency
  budget (the spinner-hint and the normal abort signal handle ordinary cancellation). Choosing a
  large value avoids prematurely aborting a legitimately slow precompute on a huge conversation,
  while still capping the pathological "never returns" case.

**Key insight:** This is part of the broader v2.1.183 reactive-precompute machinery (the
`precomputed`/`precomputeOutcome` swap, the new arm table — see the sibling doc
[window_resolver_six_sources.md](window_resolver_six_sources.md) for the arm table and
[../../../claude_code_v_2.1.156/analyze/07_compact/reactive_compaction.md](../../../claude_code_v_2.1.156/analyze/07_compact/reactive_compaction.md)
for the reactive engine itself). The *dispatcher's* slice of that machinery is exactly this:
a new 7th parameter (`i`/precompute-swap callback) and the `vqr` recovery-timeout that bounds it.
**Confidence: high** on the timeout/abort mechanics (read verbatim); **medium** on the full
precompute-swap lifecycle (the `TGn`/`reactiveCompact` body and how `precompute?.outcome` feeds
the new `tengu_precomputed_compact_arm_gated` telemetry were not traced here — see dossier §4 Q2).

---

## 4. What did NOT change in the dispatcher (link, don't re-derive)

Verified identical to v2.1.156 modulo the §0 renames — read the baseline rather than
re-deriving:

- **Gate-cascade order & early-return structure.** `Ego` is still `async function*` and still:
  `DISABLE_COMPACT → consecutiveFailures >= jgo(3) → Xjp predicate → [NEW prefix-overflow probe]
  → rapid-refill breaker (cWn=3) → thresholdSource routing → local full compact`. The only
  insertion is the §2 prefix-overflow probe; every other gate is in the same position with the
  same logic. → baseline
  [autocompact_dispatcher_and_breakers.md](../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md)
  §(a).
- **Both circuit breakers** (consecutive-failure `jgo=3` and rapid-refill `cWn=3`/`Ggo=3`) —
  values and intent unchanged; the `computeRapidRefillStreak`/`Igo` counter is byte-identical
  (shown in §0). The thrashing user message `wgo` (cli_inner_pretty.js:461687) is the same text,
  now interpolating `Ggo`/`cWn`. → baseline §(b)/(c).
- **`AutoCompactTrackingState` threading** (reset-on-compact, merge-failures-on-catch,
  `consecutiveRapidRefills` carry) — the query-loop side wasn't touched by these deltas. →
  baseline "AutoCompactTrackingState shape" section.
- **`shouldAutoCompact`/`Xjp` predicate logic** — same recursion guard (`r === "compact"`), same
  `WCe(r)` summary-source guard, same `Kw()`/enabled gate, same `_v(...)-snipTokensFreed` token
  count, same `VCe` band classifier. The *only* difference is `_JH→S7` (§1) and the renamed
  band/window helpers. Read at 461519-461530, structurally identical to v2.1.156 `eb_`
  (423991-424001). → baseline §(a) `shouldAutoCompact`.
- **Reactive routing decision** (`querySource !== undefined && source !== "auto" && S7()`),
  result-field shape (`thresholdSource`, `routedThroughReactive`, `consecutiveRapidRefills`),
  and the circuit-breaker increment on the reactive-failure path — unchanged except the §3
  inner callback. → baseline §(d).
- **Cold-compact plumbing.** `Wgo`/`isColdCompact` (cli_inner_pretty.js:461516) =
  `isEnvTruthy(CLAUDE_CODE_COLD_COMPACT)`, threaded as the 8th positional arg into the local
  compact pipeline `zut` (cli_inner_pretty.js:461628). Same as v2.1.156's `Mc6` into `_eH`. →
  baseline §(e).
- **`autoWindowSpinnerHint`/`Jjp`** (cli_inner_pretty.js:461655) — the `/autocompact` spinner
  hint. One small change relevant to the window-resolver delta: it now matches `r !== "experiment"
  && r !== "clientdata"` (cli_inner_pretty.js:461660), adding the new `clientdata` source alongside
  `experiment`. That `clientdata` source is documented in
  [window_resolver_six_sources.md](window_resolver_six_sources.md); the spinner-hint shape is
  otherwise the v2.1.156 `Hx_`.

---

## 5. Caveats / confidence summary

- §1 `S7` remote-reactive gate — **high** (verbatim read both versions + 0/1 grep). Open: the
  remote reactive *lifecycle* downstream of the gate not traced (dossier Q2).
- §2 `Yjp` prefix-overflow — **high** (verbatim read + 0/1 grep on three distinct strings). The
  fire-and-continue (non-blocking) semantics are confirmed by the absence of any `return` in the
  `if (u)` block at 461538-461543.
- §3 `vqr` recovery-timeout — **high** on the timer/abort mechanics (verbatim read); **medium**
  on the surrounding precompute-swap lifecycle (`TGn`/`reactiveCompact` body and the new
  `tengu_precomputed_compact_arm_gated`/`_rearm_capped` telemetry at 452899/452973 were not
  traced — flagged in dossier §4 Q2; worth a focused read of 452899-452990).
- §0 rename map + both breakers unchanged — **high** (the `Igo`/`fc6` counter and `jgo/Ggo/cWn =
  3/3/3` constants read verbatim in both bundles).

---

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md) - This module's new/renamed symbols

Key functions in this document:
- `autoCompactIfNeeded` (`Ego`, cli_inner_pretty.js:461531) — async-generator per-turn dispatcher; gained the §2 prefix-overflow probe and the §3 recovery-timeout precompute-swap callback (7th param). Was `DX4`@424002.
- `shouldAutoCompact` (`Xjp`, cli_inner_pretty.js:461519) — should-compact predicate; only change is `_JH→S7` in its local-mode gate. Was `eb_`@423991.
- `isLocalOrRemoteReactiveAllowed` / isLocal (`S7`, cli_inner_pretty.js:226751) — **CHANGED**: now allows remote reactive compaction behind `tengu_reactive_compact_remote`. Was `_JH`@423988.
- `prefixOverflowCheck` (`Yjp`, cli_inner_pretty.js:461484) — **NEW**: detects fixed-prefix overflow, emits `tengu_auto_compact_prefix_overflow` (non-blocking).
- `computeRapidRefillStreak` (`Igo`, cli_inner_pretty.js:461481) — rapid-refill counter, byte-identical to v2.1.156 `fc6`@423948.
- `isColdCompact` (`Wgo`, cli_inner_pretty.js:461516) — `CLAUDE_CODE_COLD_COMPACT` env read. Was `Mc6`@423951.
- `autoWindowSpinnerHint` (`Jjp`, cli_inner_pretty.js:461655) — `/autocompact` spinner hint; now also matches `clientdata` source. Was `Hx_`@424095.
- `latestAssistantUsage` (`Qtt`, cli_inner_pretty.js:227130) — newest-first scan for the prior request's billed usage; feeds `Yjp`.
- `estimateMessagesTokens` (`$T`, cli_inner_pretty.js:462778) — per-message token-estimate sum; feeds `Yjp`'s prefix computation.
- `getAutoCompactThresholdForModel` (`lMt`, cli_inner_pretty.js:226948) — compact threshold reused by `Yjp`. Was `DU6`.
- `logFeatureSad` (`Rt`, cli_inner_pretty.js:44575) — emits `tengu_feature_sad{feature_name,error_code,...}`; used by `Yjp` and the rapid-refill breaker.
- `reactiveCompact` (`TGn`, cli_inner_pretty.js — reactive engine) — target of the routing fork. Was `lA8`.

Constants:
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`jgo`, cli_inner_pretty.js:461663) — =3; circuit-breaker trip. Was `_c6`@424128. **Unchanged.**
- `RAPID_REFILL_TURN_WINDOW` (`Ggo`, cli_inner_pretty.js:461664) — =3; "rapid" if turnCounter<3. Was `Yc6`@424129. **Unchanged.**
- `RAPID_REFILL_BREAKER_COUNT` (`cWn`, cli_inner_pretty.js:461665) — =3; rapid-refill breaker trip. Was `Y08`@424130. **Unchanged.**
- `RECOVERY_TIMEOUT_MS` (`vqr`, cli_inner_pretty.js:227081) — =600000; **NEW** in the reactive-routing precompute-swap guard.
- `THRASHING_USER_MESSAGE` (`wgo`, cli_inner_pretty.js:461687) — "Autocompact is thrashing…" message; same text, interpolates `Ggo`/`cWn`. Was `Oc6`@424155.
