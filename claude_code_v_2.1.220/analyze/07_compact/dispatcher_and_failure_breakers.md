# The auto-compaction dispatcher, its two circuit breakers, and the Opus-4.8 conditional that was deleted

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This document covers the auto-compaction dispatcher `FHs` (`:441115`), the discriminated `{kind}` union
it returns, and the two independent circuit breakers that can stop compaction from ever being attempted
again in a session.

**It opens with a correction.** The orchestration pass
([`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.6) recorded that the
`{kind}` union "gained a member the 193 union did not have" — `failure_breaker_open` — and asked this
module to treat it as the headline undocumented delta. **That is wrong.** The member, the threshold
constant, the counter, the telemetry gate and the log string are all present in 2.1.193, byte-for-byte.
The evidence is in §1. The *real* 2.1.220 deltas in this function are elsewhere, and §3-§5 locate them.

---

## 0. The machine

`FHs` is an **async generator** — it `yield*`s into the query pipeline so that a compaction can stream
progress events back to the UI while it runs, and it `return`s a discriminated union describing what
happened. Its callers switch on `.kind`.

| `kind` | Meaning | Where produced (220) |
|---|---|---|
| `not_needed` | kill switch on, or the token estimate is below threshold | `:441116`, `:441120` |
| `failure_breaker_open` | ≥ `GMd` consecutive compaction failures already this session | `:441117` |
| `rapid_refill_breaker_tripped` | context refilled to the limit within 3 turns, 3 times running | `:441137` |
| `compacted` | success (two producers: reactive path `:441183`, direct path `:441215`) | `:441183`, `:441215` |
| `hook_blocked` | a `PreCompact` hook refused | `:441189`, `:441218` |
| `failed` | the attempt threw; carries the incremented failure count | via `jMd` `:441066` |

Seven arms, six of which are failure or refusal states. That ratio is the design statement: compaction
is a best-effort background repair, and every path out of it must be nameable by the caller.

The order of the first three checks matters and is worth stating explicitly:

1. `Z.DISABLE_COMPACT` — the kill switch, checked before anything is read from session state.
2. the **failure breaker** — checked before the token estimate.
3. the **threshold predicate** `Xn_` (`:441103`, called at `:441120`) — the only expensive check (it
   walks messages and may call the token-count API).

So both breakers short-circuit *before* the cost. A session that has already failed three compactions
does not pay the token-estimation cost on every subsequent turn — which matters because `FHs` is invoked
once per turn for the life of the session.

---

## 1. `failure_breaker_open` and `GMd` — CARRYOVER, and the count proves it

### The counts

```
grep -c 'failure_breaker_open'              220=1   193=1
grep -c 'rapid_refill_breaker_tripped'      220=2   193=2
grep -c 'tengu_auto_compact_circuit_breaker' 220=1  193=1
grep -c 'Autocompact is thrashing'          220=1   193=1
```

### The two sites, read side by side

| | 2.1.220 | 2.1.193 |
|---|---|---|
| guard | `:441117` | `:470252 (193)` |
| guard text | `if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= GMd) return { kind: "failure_breaker_open" };` | `if (o?.consecutiveFailures !== void 0 && o.consecutiveFailures >= ISl) return { kind: "failure_breaker_open" };` |
| threshold constant | `var GMd = 3;` `:441233` | `var ISl = 3;` `:470357 (193)` |
| incrementer | `jMd` `:441054-441067` | `CSl` `:470189-470202 (193)` |
| telemetry | `tengu_auto_compact_circuit_breaker` `:441061` | same gate `:470196 (193)` |
| reset | `Gds` `:237112` | `qYn`-equivalent `:235135 (193)` |

The bodies are the same statements in the same order with re-mangled identifiers. `GMd` is not a new
constant; it is `ISl` renamed by the minifier. **`_CONVENTIONS.md` §4.1 trap, exactly:** a symbol id that
looks unfamiliar because the previous build called it something else.

### Why the ledger got it wrong, and the lesson

`consecutiveFailures` greps **220=11 / 193=6** — a +5 delta that looks like the counter grew new
plumbing. It did not. The five extra 2.1.220 sites are at `:420177`, `:420185`, `:420186`, `:420187`,
`:420192`, and they belong to a completely different subsystem: the **artifact live-watch reconnect
backoff** `MHd` (`:420181-420195`), whose config object `eRo` carries `minUptimeMs`,
`maxConsecutiveFailures`, `baseMs` and `capMs`, and whose give-up message is
`the live connection kept failing and reconnecting has stopped` (`:420188`). It is a different feature
that reuses an obvious field name.

**Rule this establishes:** a field-name count delta is only evidence if every new site is in the same
call graph. Here, filtering the 11 sites to the compaction module gives 6, matching 193's 6 exactly.

### The mechanism itself (undocumented in either build, and worth recording)

**What it does:** After three consecutive failed auto-compaction attempts, the session stops attempting
auto-compaction entirely, for the rest of the session, with no user-visible message.

**How it works:**

1. Every completed turn stores a compaction-state record. On success `Gds(turnId, rapidRefills)`
   (`:237112-237114`) writes `{ compacted: !0, turnId, turnCounter: 0, consecutiveFailures: 0,
   consecutiveRapidRefills }` — note `consecutiveFailures: 0`. **A single success resets the counter.**
2. On failure the dispatcher's `catch` calls `jMd(state, routedThroughReactive, thresholdSource)`
   (`:441222`), which computes `n = (state?.consecutiveFailures ?? 0) + 1` and returns
   `{ kind: "failed", consecutiveFailures: n, … }`.
3. The caller persists that count. At `:337532` the agent loop merges it forward:
   `Ce = { ...(Ce ?? { compacted: !1, turnId: "", turnCounter: 0 }), consecutiveFailures: Me.consecutiveFailures }`
   — the count survives even when there is no prior compaction record, which is the case that matters
   (a session whose *first* compaction fails still needs to accumulate failures).
4. On the third failure `jMd` logs at `warn` and fires the gate; on the *next* turn the guard at
   `:441117` sees `3 >= 3` and returns `failure_breaker_open` before any work is done.

```javascript
// ============================================
// recordCompactionFailure - increments the consecutive-failure count and trips the breaker at 3
// Location: cli_inner_pretty.js:441054-441067
// ============================================

// ORIGINAL (for source lookup):
function jMd(e, t, r) {
  let n = (e?.consecutiveFailures ?? 0) + 1;
  if (n >= GMd)
    (w(
      `autocompact: circuit breaker tripped after ${n} consecutive failures${t ? " (reactive path)" : ""} — skipping future attempts this session`,
      { level: "warn" },
    ),
      O("tengu_auto_compact_circuit_breaker", {
        consecutiveFailures: n,
        ...(t && { routedThroughReactive: t }),
        ...(r && { thresholdSource: fe(r) }),
      }));
  return { kind: "failed", consecutiveFailures: n, routedThroughReactive: t, thresholdSource: r };
}

// READABLE (for understanding):
function recordCompactionFailure(previousState, routedThroughReactive, thresholdSource) {
  let failures = (previousState?.consecutiveFailures ?? 0) + 1;
  if (failures >= COMPACT_FAILURE_BREAKER_THRESHOLD)          // 3
    (debugLog(
      `autocompact: circuit breaker tripped after ${failures} consecutive failures` +
        `${routedThroughReactive ? " (reactive path)" : ""} — skipping future attempts this session`,
      { level: "warn" },
    ),
      emitTelemetry("tengu_auto_compact_circuit_breaker", {
        consecutiveFailures: failures,
        ...(routedThroughReactive && { routedThroughReactive }),
        ...(thresholdSource && { thresholdSource: sanitizeEnumForTelemetry(thresholdSource) }),
      }));
  return { kind: "failed", consecutiveFailures: failures, routedThroughReactive, thresholdSource };
}

// Mapping: jMd→recordCompactionFailure, GMd→COMPACT_FAILURE_BREAKER_THRESHOLD, w→debugLog,
//          O→emitTelemetry, fe→sanitizeEnumForTelemetry, e→previousState, t→routedThroughReactive,
//          r→thresholdSource
```

**Why three?** The number has to be large enough to absorb the two *transient* failure classes the
`catch` block itself enumerates at `:441219-441221` — an abort (`yye(_, EV)`, swallowed silently) and a
recognised transient (`zn_(_)`, logged at `error`) — and small enough that a session with a genuinely
un-compactable transcript stops burning a summarization request per turn. A summarization call is a full
LLM round-trip over the entire conversation; at 200k+ tokens that is the single most expensive operation
the client performs. Three attempts caps the waste at three such calls. `1` would misfire on one
network blip; `10` would cost ten full-context requests before giving up. Note the asymmetry with the
reset: **one success clears three failures**, so the breaker only fires on a genuinely sticky condition.

**What the user sees when it is open: nothing.** This is the most important behavioural fact in this
document and it is not documented anywhere. `failure_breaker_open` is produced at `:441117` before any
`w()` log, before any `$e()` metric, before any `onCompactEvent`. Compare with the sibling
`rapid_refill_breaker_tripped` (`:441137`), which logs a `warn` and emits
`$e("compact_auto", "compact_auto_rapid_refill_breaker")` before returning, and whose thrash message
`Wds` (`:237116-237117`) is surfaced to the user as a synthetic `invalid_request` assistant message by
the two agent-loop call sites `:337487` and `:338715`:

> `Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3
> times in a row. A file being read or a tool output is likely too large for the context window. Try
> reading in smaller chunks, or use /clear to start fresh.`

There is **no `Wds` equivalent for `failure_breaker_open`.** The consequence is a real, silent failure
mode: a session whose three compaction attempts failed will keep growing until it hits the hard context
limit, and the only symptom is the eventual `Prompt is too long` (`zW`, `:228935`). The user is never
told that auto-compaction has been switched off. Both builds behave this way — this is a standing
design gap, not a regression.

**Key insight:** the two breakers are deliberately asymmetric in *observability*, and the asymmetry maps
to blame. The rapid-refill breaker fires when *the user's workload* is pathological (a huge file read),
so it explains itself and suggests a remedy. The failure breaker fires when *the client's own
summarization* keeps failing, which the user cannot act on — so it stays silent and merely stops
wasting money. Defensible, but it means the loudest signal of a broken compaction pipeline is its
absence.

### The second breaker, for completeness

`vfo` (`:237108-237111`) and its counter `Gny` (`:237105-237107`) are also byte-equivalent carryover
(193: `VDn` `:235131`, `u8d` `:235128`). `Gny` increments `consecutiveRapidRefills` only when
`e?.compacted === !0 && e.turnCounter < 3` — i.e. the previous turn compacted *and* fewer than
`cOu = 3` (`:237115`) turns have elapsed since. Three such refills in a row trips it. The same literal
`3` appears three times here with three different meanings (turns-since-compact window, refill count,
failure count) and they are three separate constants, which is why grepping `3` is useless and grepping
`cOu` / `GMd` is not.

---

## 2. Does the `{kind}` union shape survive from the 2.1.193 tree? Yes, unchanged

The 2.1.193 analysis tree documented this dispatcher's discriminated union. **The shape is identical in
2.1.220**: same seven arms, same field names (`result`, `consecutiveRapidRefills`, `thresholdSource`,
`routedThroughReactive`, `consecutiveFailures`), same producers. A reader of the 2.1.193 `07_compact`
doc can carry their mental model forward without amendment. The changes in this window are all *inside*
the arms, not to the union.

---

## 3. THE REAL `.217` DELTA — an Opus-4.8 conditional was deleted from three predicates

> `.217`: *"Fixed auto-compact never triggering for Opus 4.8 on Bedrock, and `/compact` failing once the
> conversation was already over the limit."*

**Verdict: NET_NEW, and it is a deletion, in three places at once.** This is the most consequential
compaction change in the window and the changelog describes only its symptom.

### The 2.1.193 predicate

```javascript
// 193 :234849-234853
function P7(e) {
  if (Tr()) return !1;
  if (e !== PZr) return !1;          // PZr = "claude-opus-4-8"   :234872 (193)
  return !!aFt();                    // aFt() = gate tengu_amber_redwood2 || tengu_amber_redwood3
}
```

`P7(modelId)` answers *"is this session running Opus 4.8 with the `amber_redwood` compaction experiment
enabled?"* — a model-pinned experiment gate. It appears as a **negated conjunct** in three different
places in 2.1.193:

| site (193) | what it guards |
|---|---|
| `:470242` inside `lcf` | the auto-compact **trigger** predicate |
| `:235100` inside `WXi` | the **blocking-limit** predicate (has the context hard-stopped?) |
| `:470718` inside `GYn` | the `/context` **buffer-row** decision |

### The 2.1.220 predicates — the conjunct is gone from all three

| | 2.1.193 | 2.1.220 |
|---|---|---|
| trigger | `if (M7() && !P7(to(t)) && !p0e(t, n)) return !1;` `:470242 (193)` | `if (ESe() && !zVe(t, r)) return !1;` `:441107` |
| blocking | `if (!P7(to(t)) && !p0e(t, n)) return e >= $Zr(i, o);` `:235100 (193)` | `if (!zVe(t, r)) return e >= Mds(s, o);` `:237072` |
| `/context` buffer | `if (!(Z && !P7(to(t)) && m !== "env" && m !== "settings" && m !== "clientdata" && m !== "model-default"))` `:470718 (193)` | `if (!(ce && g === "auto"))` `:441639` |

And the *supporting* predicate was rewritten at the same time:

```javascript
// 193 :235035-235038
function p0e(e, t) {
  let { source: n } = xj(e, t);
  return n === "env" || n === "settings" || n === "clientdata" || n === "model-default";
}

// 220 :237008-237010
function zVe(e, t) {
  return o7(e, t).source !== "auto";
}
```

Grep corroboration: `model-default` **220=2 / 193=4**, `clientdata` **220=6 / 193=8** — the literal
counts went *down*, because the source enumeration was replaced by its complement. `cedar_lagoon`-style
model-pinned tables shrink the same way; see §4.

### How this produced the bug

**What it does:** `Xn_` (`:441103`) decides whether auto-compaction should fire this turn.

**How it works (2.1.193, the buggy shape):**

1. `to(t)` normalises the session model id to a canonical short id.
2. `P7` compares it with the literal string `"claude-opus-4-8"`.
3. On **Bedrock** the session model is a provider-qualified id (`us.anthropic.claude-opus-4-8`) or an
   application-inference-profile ARN. The 2.1.220 catalogue documents this shape explicitly —
   `provider_ids.bedrock` for Opus 4.8 lives in the entry at `:14330`.
4. If the normaliser did not reduce that provider id to the bare `claude-opus-4-8`, `P7` returned
   `!1`, so `!P7(...)` was **true**.
5. With `M7()` true (the common case) and `p0e(...)` false (the common case — `source: "auto"`, i.e. the
   user configured nothing), the whole conjunction was true and the function **returned `!1`: do not
   auto-compact**. Every turn. Forever.
6. Worse, the *same* conjunct sat in `WXi`, the blocking-limit predicate, so the client also failed to
   recognise that the conversation had passed the hard limit — which is the second half of the bullet,
   `/compact` failing once already over the limit.

**Why the fix is a deletion rather than a normaliser repair:** repairing `to()` to canonicalise every
Bedrock/Vertex/Foundry spelling of every model would have to be re-done for every new provider channel
(`anthropic_google_cloud` is new in this very window). Deleting the model-pinned conjunct removes the
class of bug instead of the instance. The experiment itself was not deleted — `gfo()` (`:236841`) still
reads `tengu_amber_redwood2 || tengu_amber_redwood3`, and `XMu = "claude-opus-4-8"` (`:236862`) still
exists — but its only remaining consumer is `Bds` (`:236943-236951`), where it supplies a *window value*
rather than a *veto*:

```javascript
// ============================================
// resolveExperimentAutoCompactWindow - the surviving Opus-4.8 experiment, demoted to a window source
// Location: cli_inner_pretty.js:236943-236951
// ============================================

// ORIGINAL (for source lookup):
function Bds(e) {
  if (!KI()) return;
  if (yn()) return;
  if (e !== XMu) return;
  let t = gfo();
  if (!t) return;
  let r = Fds(t);
  return typeof r === "number" ? r : void 0;
}

// READABLE (for understanding):
function resolveExperimentAutoCompactWindow(normalizedModelId) {
  if (!isAutoCompactEnabled()) return undefined;
  if (isNonInteractiveSession()) return undefined;
  if (normalizedModelId !== OPUS_4_8_ID) return undefined;      // "claude-opus-4-8"
  let gateValue = readAmberRedwoodGate();                       // tengu_amber_redwood2 || …redwood3
  if (!gateValue) return undefined;
  let parsed = parseWindowValue(gateValue);
  return typeof parsed === "number" ? parsed : undefined;
}

// Mapping: Bds→resolveExperimentAutoCompactWindow, XMu→OPUS_4_8_ID, gfo→readAmberRedwoodGate,
//          KI→isAutoCompactEnabled, yn→isNonInteractiveSession, Fds→parseWindowValue
```

Consumed at `:237000` as `{ window: Math.min(o, s), configured: s, source: "experiment" }`.

**Key insight — and the reason `zVe` had to change too:** 193's `p0e` enumerated four source names and
**omitted `"experiment"`**. So on the redwood experiment path `p0e` returned false, and the *only* thing
keeping auto-compaction alive for those sessions was the `!P7(...)` conjunct that was about to be
deleted. Removing `P7` without rewriting `p0e` would have broken the experiment cohort. Rewriting it as
`source !== "auto"` closes that hole and makes the predicate total: any explicitly-sourced window (env,
settings, clientdata, model-default **or experiment**) now counts. The two edits are one change.

---

## 4. THE REAL `.198` DELTA — the extended-thinking allow-table was deleted

> `.198`: *"Subagents and compaction now inherit the session's extended thinking configuration."*

**Verdict: NET_NEW.** The scoping pass recorded `thinkingConfig:` at **220=50 / 193=46** and pointed at
the call site `:344538`. That instruction was right: **the literals are carryover and the call site is
the delta.** Both halves of the bullet are one deletion, and it is provable by a single literal:

```
grep -c 'cedar_lagoon'    220=0   193=1
```

`cedar_lagoon` (`:382222 (193)`, inside `oVn` `:382221-382226 (193)`) was a **remote clientdata allow-table** keyed by model-id substring:

```javascript
// 193 :382221-382226
function oVn(e) {
  let t = Xk()?.cedar_lagoon;
  if (typeof t !== "object" || t === null) return !1;
  let n = to(e);
  return Object.entries(t).some(([r, o]) => o === !0 && n.includes(r));
}
```

It gated thinking in exactly the two places the bullet names.

### 4a. The compaction half

| | 2.1.193 `:469909` | 2.1.220 `:440739` |
|---|---|---|
| | `thinkingConfig: oVn(S) ? r.options.thinkingConfig : { type: "disabled" },` | `thinkingConfig: SXr(n),` |

Both sit inside the summarization request whose system prompt is
`"You are a helpful AI assistant tasked with summarizing conversations."`
(220 `:440738`, 193 `:469908`) — the same anchor in both builds, so the comparison is exact.

```javascript
// ============================================
// resolveEffectiveThinkingConfig - session thinking config, overridable by a permission layer
// Location: cli_inner_pretty.js:237866-237873
// ============================================

// ORIGINAL (for source lookup):
function SXr(e) {
  let t = e.options.thinkingConfig;
  for (let r of e.permissionLayers ?? []) if (r.kind === "max_thinking_tokens") t = jOu(r.maxThinkingTokens);
  return t;
}
function jOu(e) {
  return e === 0 ? { type: "disabled" } : { type: "enabled", budgetTokens: e };
}

// READABLE (for understanding):
function resolveEffectiveThinkingConfig(toolUseContext) {
  let config = toolUseContext.options.thinkingConfig;                    // inherit the session's
  for (let layer of toolUseContext.permissionLayers ?? [])
    if (layer.kind === "max_thinking_tokens")
      config = thinkingConfigFromBudget(layer.maxThinkingTokens);        // last layer wins
  return config;
}
function thinkingConfigFromBudget(budget) {
  return budget === 0 ? { type: "disabled" } : { type: "enabled", budgetTokens: budget };
}

// Mapping: SXr→resolveEffectiveThinkingConfig, jOu→thinkingConfigFromBudget, e→toolUseContext
```

Note the loop has no `break`: the **last** matching permission layer wins, not the most restrictive. A
layer that raises the budget can therefore undo an earlier layer that lowered it, which is a real
ordering dependency and the sort of thing a reader should not assume works the safe way.

### 4b. The subagent half

| | 2.1.193 `:398740` | 2.1.220 `:344538` |
|---|---|---|
| | `thinkingConfig: b \|\| !1 \|\| oVn(q) ? n.options.thinkingConfig : { type: "disabled" },` | `thinkingConfig: yBc(r.options.thinkingConfig, { useExactTools: A ?? !1, forwardSubagentText: …, isAsync: o, isNonInteractiveSession: yn(), sessionDisplayExplicit: ZSi() }),` |

The `|| !1 ||` in the 193 expression is a minifier residue of a dropped middle condition — evidence that
this ternary had already been whittled down once before it was removed.

```javascript
// ============================================
// resolveSubagentThinkingDisplay - subagents inherit thinking; only its DISPLAY is suppressed
// Location: cli_inner_pretty.js:119662-119668
// ============================================

// ORIGINAL (for source lookup):
function yBc(
  e,
  { useExactTools: t, forwardSubagentText: r, isAsync: n, isNonInteractiveSession: o, sessionDisplayExplicit: i },
) {
  if (i || !o || t || r || n || e.type === "disabled" || e.display === "omitted") return e;
  return { ...e, display: "omitted" };
}

// READABLE (for understanding):
function resolveSubagentThinkingDisplay(
  sessionThinkingConfig,
  { useExactTools, forwardSubagentText, isAsync, isNonInteractiveSession, sessionDisplayExplicit },
) {
  if (
    sessionDisplayExplicit ||                        // user asked for a display mode -> honour it
    !isNonInteractiveSession ||                      // interactive -> the UI renders thinking anyway
    useExactTools ||                                 // structured-tool mode -> caller reads raw output
    forwardSubagentText ||                           // --forward-subagent-text -> text must survive
    isAsync ||                                       // background agent -> transcript is consumed later
    sessionThinkingConfig.type === "disabled" ||     // nothing to hide
    sessionThinkingConfig.display === "omitted"      // already omitted
  )
    return sessionThinkingConfig;                    // pass the SESSION config through untouched
  return { ...sessionThinkingConfig, display: "omitted" };
}

// Mapping: yBc→resolveSubagentThinkingDisplay, e→sessionThinkingConfig, t→useExactTools,
//          r→forwardSubagentText, n→isAsync, o→isNonInteractiveSession, i→sessionDisplayExplicit
```

**Why this shape:** the two builds answer different questions. 193 asked *"is this model allowed to
think inside a subagent?"* and answered from a remote table, so an unlisted model silently lost thinking
entirely. 220 asks *"should the subagent's thinking be **shown**?"* and never touches `type` or
`budgetTokens`. Thinking is now always inherited; only `display` is normalised, and only in the one case
where nobody is going to read it — a non-interactive session with no explicit display request and no
consumer that needs the raw text. Every one of the six escape hatches names a consumer.

**Trap for anyone re-deriving this:** the false-delta ledger's original row for this bullet cited `yBc`
at 220=2 / 193=2 and called it carryover; that row is **RETRACTED in the ledger itself** because 193's
`yBc` is an unrelated vendored helper at `:9245 (193)`. Two different functions, one re-mangled name.
The ledger's correction is right, and `cedar_lagoon` 1→0 is the clean anchor to use instead.

---

## 5. Smaller, undocumented dispatcher changes

### 5.1 The compaction failure log gained a description (220=1 / 193=0)

```javascript
// 193 :469923-469925          catch (y) { … else ke(y); }
// 220 :441219-441221          catch (_) { … else xe(oi(_n(_), "autocompact: unexpected compactConversation failure")); }
```

`autocompact: unexpected compactConversation failure` (`:441221`) is **220=1 / 193=0**. In 193 an unrecognised
compaction exception was reported to the error sink bare; in 220 it is wrapped with a description
string first. Small, but it is the difference between a triaged and an untriaged crash report — and it
is the *only* new string in the entire dispatcher.

The recognised-transient predicate around it is otherwise carryover:
`zn_` (`:441051-441053`) = `e instanceof V7 || KW(le(e)) || yye(e, DLo) || yye(e, nBs)` matches
193's `icf` (`:470186-470188`) = `e instanceof w5 || g1(Ae(e)) || nZ(e, BYn) || nZ(e, Vyt)`
statement-for-statement.

### 5.2 The summarization call moved from 11 positional arguments to an options object

| | 2.1.193 `:470336` | 2.1.220 `:441203` |
|---|---|---|
| | `Aht(e, b, n, !0, void 0, !0, g, h, m, _, S)` | `Pko(e, E, r, !0, { isAutoCompact: !0, recompactionInfo: g, stripNonEssential: y, spinnerHintText: m, onNotification: A, onResponseLength: b })` |

`stripNonEssential` is **220=5 / 193=3**, consistent with a positional flag becoming a named field with
extra call sites. This is a readability refactor with one behavioural consequence worth noting: the 193
call passed `maxOutputTokensOverride: Math.min(thi, fat(S))` (`:469921 (193)`) and the 220 call does
**not** — the summarization request no longer clamps its own output budget, and instead carries
`effortValue: Sb(n)` and `promptTooLongIsHandled: !0` (`:440755-440758`). `maxOutputTokensOverride` is
220=14 / 193=15, i.e. exactly this one site was dropped.

### 5.3 `agentContext` is threaded through the compaction path

`Xn_` gained a sixth parameter that 193's `lcf` did not have:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| signature | `async function lcf(e, t, n, r, o = 0)` `:470238 (193)` | `async function Xn_(e, t, r, n, o = 0, i)` `:441103` |
| call | `lcf(e, a, l, r, s)` `:470254 (193)` | `Xn_(e, a, l, n, i, t.agentContext)` `:441120` |
| post-compact notify | `Nre(r, t.setAppState, t.agentId, n.stickyBetas)` `:469937 (193)` | `BBe(n, t.setAppState, t.agentId, r.stickyBetas, t.agentContext)` `:441212` |

`agentContext` overall is 220=134 / 193=83. Compaction is now agent-aware at both ends — the threshold
decision and the post-compaction notification. This matters for the agent-team and background-agent work
in this window, where several sessions share one process; see
[`../30_agent_team/`](../30_agent_team/) and [`../36_background_agents/`](../36_background_agents/).

### 5.4 Precomputed compaction has a much larger telemetry surface

Three gates from the new-gate list live here, all **220=1 / 193=0**:
`tengu_precomputed_compact_persisted` (`:328553`),
`tengu_precomputed_compact_rehydrated` (`:328512`),
`tengu_precomputed_compact_rehydrate_rejected` (`:328523`).

They belong to the **precompute-then-swap** path: while the user types, a compaction summary is computed
in the background, persisted, and swapped in when the threshold is crossed. The settings description at
`:61472` states the contract:

> `Precompute the compaction summary in the background before it is needed. Only applies when auto-compact is on.`

The `_persisted` / `_rehydrated` / `_rehydrate_rejected` triple is the new part: the precomputed swap now
**survives a session restart** and is validated on reload — `:328490-328492` checks
`c = Y0(r) - s.preCompactTokens; if (c < -(s.preCompactTokens / 2)) return l("shrank_too_much")`, i.e. a
rehydrated precompute is rejected if the live transcript has shrunk to less than half the size it had
when the summary was computed. That is a cheap staleness test that catches the case that actually
matters (the user rewound or cleared between sessions) without re-counting tokens. The full
precompute state machine (`:328400-328900`) is larger than this document's scope; it is flagged in
"Not covered" in the [README](README.md).

---

## 6. Verdict table for this document

| Item | Verdict | Anchor (2.1.220) | 220 / 193 |
|---|---|---|---|
| `failure_breaker_open` union member | **CARRYOVER** | `:441117` (193 `:470252`) | 1 / 1 |
| `GMd = 3` failure threshold | **CARRYOVER** (`ISl = 3` renamed) | `:441233` (193 `:470357`) | — |
| `tengu_auto_compact_circuit_breaker` | **CARRYOVER** | `:441061` | 1 / 1 |
| `consecutiveFailures` +5 sites | **DECOY** — artifact live-watch backoff | `:420181-420195` | 11 / 6 |
| `rapid_refill_breaker_tripped` + `cOu` | **CARRYOVER** | `:441137`, `:237115` | 2 / 2 |
| `.217` Opus-4.8 conjunct deleted (3 sites) | **NET_NEW (deletion)** | `:441107`, `:237072`, `:441639` | `P7`/`PZr` gone |
| `.217` `p0e` → `zVe` source-predicate rewrite | **NET_NEW** | `:237008` | `model-default` 2 / 4 |
| `.198` compaction thinking inheritance | **NET_NEW (deletion)** | `:440739` w/ `SXr` `:237866` | `cedar_lagoon` 0 / 1 |
| `.198` subagent thinking inheritance | **NET_NEW** | `:344538` w/ `yBc` `:119662` | `cedar_lagoon` 0 / 1 |
| unexpected-failure log description | **NET_NEW** | `:441221` | 1 / 0 |
| summarization call options-object refactor | **NET_NEW (refactor)** | `:441203` | `stripNonEssential` 5 / 3 |
| `agentContext` threaded into compaction | **NET_NEW** | `:441120`, `:441212` | 134 / 83 |
| precompute persist/rehydrate telemetry | **NET_NEW** | `:328512`, `:328523`, `:328553` | 1 / 0 each |

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
- `autoCompactDispatcher` (`FHs`, `:441115`) - async generator returning the `{kind}` union
- `shouldAutoCompact` (`Xn_`, `:441103`) - threshold predicate; lost the Opus-4.8 conjunct
- `recordCompactionFailure` (`jMd`, `:441054`) - increments `consecutiveFailures`, trips the breaker
- `COMPACT_FAILURE_BREAKER_THRESHOLD` (`GMd`, `:441233`) - `3`; 193's `ISl` renamed
- `computeRapidRefillCount` (`Gny`, `:237105`) - refill counter feeding the second breaker
- `evaluateRapidRefillBreaker` (`vfo`, `:237108`) - returns `{ action: "trip" | "proceed", … }`
- `RAPID_REFILL_TURN_WINDOW` (`cOu`, `:237115`) - `3` turns
- `RAPID_REFILL_THRASH_MESSAGE` (`Wds`, `:237116`) - the user-facing thrash explanation
- `makeCompactedTurnState` (`Gds`, `:237112`) - resets `consecutiveFailures` to 0 on success
- `isRecognisedCompactionFailure` (`zn_`, `:441051`) - transient-error predicate
- `compactConversation` (`Pko`, `:440219`) - the summarization driver
- `resolveEffectiveThinkingConfig` (`SXr`, `:237866`) - compaction-side thinking inheritance
- `thinkingConfigFromBudget` (`jOu`, `:237872`) - `0` → disabled, else enabled+budget
- `resolveSubagentThinkingDisplay` (`yBc`, `:119662`) - subagent-side inheritance, display-only override
- `hasExplicitAutoCompactWindow` (`zVe`, `:237008`) - `source !== "auto"`; replaced 193's 4-name enum
- `resolveExperimentAutoCompactWindow` (`Bds`, `:236943`) - the demoted Opus-4.8 redwood experiment
- `readAmberRedwoodGate` (`gfo`, `:236841`) - `tengu_amber_redwood2 \|\| tengu_amber_redwood3`
- `OPUS_4_8_ID` (`XMu`, `:236862`) - `"claude-opus-4-8"`
- `isAutoCompactEnabled` (`KI`, `:236844`) - kill-switch chain
- `isReactiveCompactAllowed` (`ESe`, `:236849`) - remote-session gate `tengu_reactive_compact_remote`
- `rewatchArtifactWithBackoff` (`MHd`, `:420181`) - the unrelated `consecutiveFailures` decoy
