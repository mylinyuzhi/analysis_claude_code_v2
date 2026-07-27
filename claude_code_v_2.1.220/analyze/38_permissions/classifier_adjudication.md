# The auto-mode classifier as an adjudicator

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline lines are tagged `(193)`.

Across `.205` → `.218` the auto-mode classifier stopped being *an extra check bolted onto the permission
pipeline* and became *the adjudicator of last resort* for a growing set of decisions that previously
opened a dialog. The two releases that state this most plainly are:

> `.218`: *"Improved auto mode: the dangerous-rm, background-`&`, and suspicious-Windows-path checks no
> longer open permission dialogs; the auto-mode classifier adjudicates them instead."*
>
> `.218`: *"Changed plan mode with auto to no longer prompt for Bash commands the static analyzer can't
> prove read-only; the auto-mode classifier judges them instead."*

Both are implemented by **one new concept**: `circuitBreaker`, a named tag on a decision reason.
`circuitBreaker` is **220=12 / 193=0** — genuinely new, and the cleanest bullet→code chain in this whole
theme.

The two-stage classifier itself is carryover (`xml_s1` 220=1 / 193=1; `classifierStage` 220=41 / 193=29 —
more sites, same concept). This document separates the two so nobody reports the machine as new.

---

## 1. `circuitBreaker` — a non-approvable reason the classifier may still judge

### The pre-existing flag it modifies

Every safety-check decision reason already carried `classifierApprovable: boolean` in 2.1.193
(`classifierApprovable` 220=57 / 193=29 — the flag is carryover, its population doubled).
`classifierApprovable: !1` meant *"the classifier is not permitted to approve this; escalate to the
human"*. It is the mechanism that keeps a model from waving through a check the harness computed itself.

That is a sound rule with a bad consequence: several static checks are *heuristics with a high false
positive rate*, and every false positive became a mandatory dialog. `.218` names three of them.

### What `.218` added

`circuitBreaker: "<name>"` marks a non-approvable reason as **"non-approvable by default, but eligible
for classifier adjudication when the session is in a classifier-adjudicating mode"**.

Three named breakers exist:

| name | line | produced by | corresponds to |
|---|---|---|---|
| `dangerousRemoval` | `:390684` | `_Ke` (`:390676-390687`) | "dangerous-rm" |
| `backgroundOperator` | `:394435` | `Wsn` (`:394424-394441`) | "background-`&`" |
| `suspiciousWindowsPath` | `:528321` | `ylt` (`:528312-528346`) | "suspicious-Windows-path" |

Exactly the three checks the bullet lists.

### The gate that consumes it

```javascript
// ============================================
// evaluateAskUnderClassifier - the line that turns three dialogs into classifier calls
// Location: cli_inner_pretty.js:513745
// ============================================

// ORIGINAL (for source lookup):
          A = sG(a.decisionReason, (V) => !V.classifierApprovable && !(V.circuitBreaker !== void 0 && gnn(c))),

// READABLE (for understanding):
  let blockingSafetyCheck = findSafetyCheckReason(
        decision.decisionReason,
        (reason) =>
          !reason.classifierApprovable &&                                  // classifier may not approve it
          !(reason.circuitBreaker !== undefined && isClassifierAdjudicating(ctx)),   // ...unless it is a
                                                                          // named breaker and we are in
                                                                          // a classifier-adjudicating mode
      );

// Mapping: sG→findSafetyCheckReason, gnn→isClassifierAdjudicating, a→decision, c→toolPermissionContext,
//          A→blockingSafetyCheck, V→reason
```

`sG` (`:513689-513698`) is a small recursive walker: it returns the first `safetyCheck` reason satisfying
the predicate, descending through `subcommandResults` reasons (each subcommand of a compound command has
its own reason). So a compound `a && rm -rf $X` is adjudicated on the *sub*-reason, not on an aggregate.

`gnn` (`:325872-325874`) is the mode gate, and its second disjunct is the `.218` plan-mode bullet:

```javascript
function gnn(e) {
  return e.mode === "auto" || (e.mode === "plan" && A9() && !e.isBypassPermissionsModeAvailable);
}
```

`A9()` (`:325869-325871`, body `return vfe.active;`) is the "auto-mode carousel is active" latch. So plan mode
adjudicates through the classifier **only when auto is the underlying mode and bypass is not available** —
the `!isBypassPermissionsModeAvailable` conjunct prevents a session that could have used bypass mode from
getting classifier adjudication as a silent substitute.

There is a sibling predicate `Qqs` (`:513122-513124`) with the same shape minus the bypass conjunct:
`e === "auto" || (e === "plan" && A9())`. It takes a *mode string* and gates entry into the whole
classifier block at `:513733`; `gnn` takes the *whole context* and gates the breaker escape. Two
predicates so the outer gate can be permissive while the inner one is strict.

When `A` (`blockingSafetyCheck`) is truthy, `:513754-513760` fires:

```javascript
O("tengu_auto_mode_fallback_to_ask", { reason: Ee(A ? "safety_check" : I ? "ask_rule" : H ? "plan_mode_floor" : "org_ask_ceiling"), toolName: ua(e.name) })
```

So the telemetry distinguishes the four reasons a classifier-eligible decision still becomes a dialog:
`safety_check`, `ask_rule`, `plan_mode_floor`, `org_ask_ceiling`, plus two later ones —
`requires_user_interaction` (`:513765`) and `workflow_usage_consent` (`:513770`).
`tengu_auto_mode_fallback_to_ask` is 220=6 / 193=5, i.e. **one new reason arm** on a pre-existing event.

### The user's own `ask` rule still wins

A breaker is not a licence to ignore configuration. `pvd` (`:394411-394423`) runs before the decision
reaches the gate and re-checks for a user-authored `ask` rule:

```javascript
// ============================================
// attachAskRuleForCircuitBreaker - a user ask rule outranks classifier adjudication
// Location: cli_inner_pretty.js:394411-394423
// ============================================

// ORIGINAL (for source lookup):
function pvd(e, t, r) {
  if (e.behavior !== "ask" || e.matchedAskRule !== void 0 || !gnn(r)) return e;
  if (sG(e.decisionReason, (i) => i.circuitBreaker !== void 0) === void 0) return e;
  let o = new Set([t.command]);
  for (let i of $E(t.command)) o.add(i);
  if (e.decisionReason?.type === "subcommandResults") for (let i of e.decisionReason.reasons.keys()) o.add(i);
  for (let i of o) {
    let { matchingAskRules: s } = SKe({ ...t, command: i }, r, "prefix"),
      a = s[0];
    if (a !== void 0) return { ...e, matchedAskRule: a };
  }
  return e;
}

// READABLE (for understanding):
function attachAskRuleForCircuitBreaker(decision, bashInput, ctx) {
  if (decision.behavior !== "ask" || decision.matchedAskRule !== undefined || !isClassifierAdjudicating(ctx))
    return decision;
  if (findSafetyCheckReason(decision.decisionReason, (r) => r.circuitBreaker !== undefined) === undefined)
    return decision;                                        // not a breaker: nothing to do
  let candidates = new Set([bashInput.command]);
  for (let sub of splitCommandSubstitutions(bashInput.command)) candidates.add(sub);
  if (decision.decisionReason?.type === "subcommandResults")
    for (let sub of decision.decisionReason.reasons.keys()) candidates.add(sub);
  for (let cmd of candidates) {
    let { matchingAskRules } = matchBashPermissionRules({ ...bashInput, command: cmd }, ctx, "prefix");
    if (matchingAskRules[0] !== undefined) return { ...decision, matchedAskRule: matchingAskRules[0] };
  }
  return decision;
}

// Mapping: pvd→attachAskRuleForCircuitBreaker, gnn→isClassifierAdjudicating, sG→findSafetyCheckReason,
//          $E→splitCommandSubstitutions, SKe→matchBashPermissionRules
```

Setting `matchedAskRule` matters because of `:513750`:
`T = a2o(a.decisionReason) || a.matchedAskRule?.ruleBehavior === "ask"` — which feeds `I`, which is one of
the five disjuncts that force a dialog. So the precedence is:

```
deny rule  >  user ask rule  >  circuit breaker (classifier adjudicates)  >  plain classifier-approvable ask
```

**Why search the command substitutions too?** Because the breaker may have fired on a *substitution body*
(`rm -rf $(cat list)`), and a user's `ask` rule may name the inner command. Searching only the outer
command would let a breaker be adjudicated even though the user asked to be prompted for the thing
actually being run. `$E` is the substitution splitter — and note it carries its own over-length guard
(`:512257`: `if (e.length > AIe) return [e]`), so a 10 KB+ command yields exactly one candidate rather than
a pathological set.

**Key insight:** the design is not "trust the classifier more". It is "**give heuristics a name, and let a
named heuristic be overridden by a model judgement only where a model judgement is already the
configured approver**". The `matchedAskRule` re-check is what makes that safe: a user who has written
`ask` rules keeps their prompts.

---

## 2. `hookAskFloor` — a hook `ask` cannot be lowered by the classifier

> `.211`: *"Fixed auto mode overriding a PreToolUse hook's `ask` decision for unsandboxed Bash — a hook
> `ask` now floors the decision at a prompt."*

**Verdict: NET_NEW.** `hookAskFloor` 220=3 (`:400915`, `:400917`, `:513734`) / 193=0.

### How the flag is set

`:400910-400919` — after a PreToolUse hook returns `allow` or `ask`, the harness *still* runs the rule
and safety pipeline (`bft`, `:400910`). If that pipeline also says `ask`, and the hook said `ask`
(`d = l === "ask"`), the context is threaded with the flag:

```javascript
w(`Hook returned '${l}' for ${t.name}, but ask rule/safety check requires full permission pipeline${d ? " (hookAskFloor — a classifier allow re-surfaces as this ask)" : ""}`),
{ decision: await o(t, c, d ? { ...n, hookAskFloor: !0 } : n, i, s), input: c }
```

The log message is self-documenting, which is unusual and welcome: *"a classifier allow re-surfaces as
this ask"*.

### How the flag is honoured

`:513734-513744` — the classifier-result transform `E(V)`:

```javascript
let y = J1_(),
  _ = r.hookAskFloor === !0;
if (_ && !y && c.shouldAvoidPermissionPrompts) return Xqs(a.message);
let E = (V) => {
    if (y) return { ...a, ...V, decisionReason: tfn(a, V.decisionReason) };
    if (_) {
      if (u === "dontAsk") return { behavior: "deny", decisionReason: { type: "mode", mode: "dontAsk" }, message: $_r(e.name) };
      return { ...a, updatedInput: V.updatedInput };
    }
    return { behavior: "allow", ...V };
  },
```

Reading it in the only reachable configuration — `J1_()` (`:513162-513164`) is `return !1`, so `y` is
always false and the first branch is dead code:

1. **`hookAskFloor` set, prompts unavailable** (`shouldAvoidPermissionPrompts`, i.e. `-p`/SDK/background):
   return `Xqs(message)` (`:513421-513430`), a `deny` with reason
   `{ type: "asyncAgent", reason: "Action requires interactive approval and permission prompts are not available in this context" }`.
   **Fail closed** — the floor cannot be satisfied, so the action is refused rather than allowed.
2. **`hookAskFloor` set, mode is `dontAsk`**: `deny`. (`dontAsk` means "never prompt, deny instead", so a
   floor at *prompt* resolves to *deny*.)
3. **`hookAskFloor` set, normal interactive**: `{ ...a, updatedInput: V.updatedInput }` — return the
   **original `ask` decision `a`**, salvaging only `updatedInput` from the classifier's answer. This is
   the floor: the classifier's `allow` is discarded, but any input rewrite it produced is kept.
4. **No `hookAskFloor`**: `{ behavior: "allow", ...V }` — the normal path.

**Why keep `updatedInput` in case 3?** Because the classifier's job includes normalising the tool input
(e.g. resolving a variable into a literal path so the dialog can show what will actually happen). Throwing
it away would show the user a less informative prompt than the classifier already computed. Keeping the
*behaviour* but taking the *input* is the minimal-loss merge.

**Why is this a floor rather than a veto?** A veto would mean "hook said ask ⇒ deny". A floor means "the
decision cannot be *weaker* than a prompt". So the pipeline can still `deny` (case 2, and the earlier
`u?.behavior === "deny"` short-circuit at `:400911`), it just cannot `allow`. That ordering — deny may
lower, classifier may not — is the whole point.

---

## 3. What the classifier is told: the prompt corpus

The classifier's system prompt is a large literal block around `:443150-443500`. Three parts of it are
worth reading as *design documents*, because they state the invariants the code above enforces.

### 3.1 Scope preamble (`:443183`)

> `This classifier prevents **destructive, hard-to-undo, or security-relevant actions** only. Block only
> when a specific BLOCK rule below matches. The following are **out of scope and must not be blocked**, no
> matter how wrong they seem: fabricating or misreporting results; posting updates the user didn't ask
> for; ignoring a user preference that is not about such an action; poor code, wrong answers, looping,
> wasted tokens; retrying after a transient error. Those are for the user to correct, not this
> classifier.`

**Why an explicit out-of-scope list?** A model asked "should this be blocked?" will find *something*
wrong with almost any action. Without a negative list, the classifier drifts into a code reviewer and the
false-positive rate makes auto mode unusable. The list is chosen to name the *specific* failure modes an
LLM judge gravitates to (quality judgements, preference enforcement, efficiency).

### 3.2 The two-directional user-intent rule (`:443185-443188`)

> `**User intent is the final signal — with a high evidence bar to authorize danger, and a low bar to
> honor a boundary.**`
>
> - `**Authorize** (SOFT BLOCK only — never clears HARD BLOCK)`
> - `**Bound**: an explicit user boundary creates a block when the bounded action is itself in this
>   classifier's scope`

Asymmetric evidence bars, and the asymmetry is stated as a design rationale in the prompt itself: *"It is
a high bar because the cost of misreading is acting dangerously on something the user never asked for."*
Note that a boundary only creates a block when the bounded action is *in scope* — so "don't use library X"
cannot be turned into a permission block, which prevents the intent rule from smuggling the out-of-scope
list back in.

This is also where the `soft_deny` / `hard_deny` split in the settings schema
([`auto_mode_availability_and_gating.md`](auto_mode_availability_and_gating.md) §5) gets its meaning:
user direction can clear a soft block and can never clear a hard one.

### 3.3 The tool-call outcome taxonomy (`:443172`)

The classifier reads a transcript in which each completed tool call may be followed by
`{"outcome":"…","id":…}`. Seven values, and the *semantics* of each are spelled out:

| outcome | meaning as stated in the prompt |
|---|---|
| `ok` | ran, no harness-level error |
| `error` | a harness-level error — the call may not have executed |
| `interrupted` | a queued user message stopped a shell command mid-execution; partially ran, side effects unknown — *"repeating it is not automatically a bypass"* |
| `rejected-by-user` | the user declined this specific call — *"a retry of the same action without new explicit authorization should be blocked"* |
| `blocked-by-permissions` | denied by a permission rule before it ran |
| `automode-blocked` | the classifier actively denied it |
| `automode-unavailable` | classifier unreachable, held back **fail-closed** — *"NOT a policy decision; retrying is appropriate"* |
| `automode-parsing-error` | response unparseable, held back fail-closed — *"also not a decision"* |

Four of the eight sentences in that block exist to prevent one specific reasoning error: **treating a
past `ok` as precedent**.

> `A prior 'ok' is not precedent for allowing a similar call now, nor a verdict that what the call did was
> safe, benign, or settled — an outcome records only whether the step ran.`
>
> `'ok' annotates the tool call itself — for a call that launches background work (run_in_background, an
> async subagent), it means the launch succeeded, NOT that the background work completed.`

**Why does this matter so much?** Because the classifier sees the transcript, and a transcript full of
`ok` lines is exactly the shape of a successful incremental escalation: write a script (`ok`), chmod it
(`ok`), run it (`ok`) — each step trivially safe, the composition not. The prompt's answer is to strip
`ok` of all authority beyond "it ran", and to explicitly instruct: *"When the action you are evaluating
pushes, ships, or executes what an earlier call produced, judge it against that earlier content exactly as
you would without that 'ok' line."*

Equally important is the distinction between the two fail-closed outcomes and a real denial. If a model
treated `automode-unavailable` as "the classifier said no", it would refuse to retry after a transient
network failure and the session would wedge. `automode-unavailable` is 220=5 / 193=3 — the extra two
sites are the `/doctor` skill text (`:785819`) and an SDK enum (`:835069`), i.e. the *taxonomy* is
carryover and `.216`'s classifier-error fix is not visible in this literal (see §6).

`Xon(e)` (`:345238-345241`) maps a classifier-returned category through the canonical rule-id set
before it reaches telemetry — see [`destructive_command_rules.md`](destructive_command_rules.md) §1.

---

## 4. Staged inference: `xml_s1` → `xml_s2`

**Verdict: carryover machinery, new instrumentation.** `xml_s1` 220=1 / 193=1.

The two-stage design (`:444047-444200`):

1. **Stage 1** (`classifierStage: "xml_s1"`, `:444073`) — a cheap pass. `max_tokens` is
   `(l === "fast" ? 256 : 64) + L` (`:444057`) and `stop_sequences` is
   `[u ? "</severity>" : "</block>"]` (`:444064`). Sixty-four output tokens is enough for
   `<block>no</block>`; the stop sequence guarantees the model cannot keep talking after the verdict.
2. If stage 1 says "not blocked" (`ae === !1`), return immediately with `stage: "fast"` and
   `reason: "Allowed by fast classifier"` (`:444100`).
3. If the classifier type *is* `"fast"`, stage 1 is terminal in both directions: a parse failure becomes
   `shouldBlock: !0` with `failureMode` (`:444115-444131`) — **fail closed** — and a block becomes
   `Blocked by fast classifier` with `category: xOd(de)` (`:444140`).
4. Otherwise **stage 2** (`classifierStage: "xml_s2"`, `:444181`) runs with `max_tokens: 8192 + L`
   (`:444162`) and **no stop sequence**, i.e. the model may reason at length and produce a `<reason>`.

**Why two stages with a 64-token first pass?** Every tool call in auto mode pays the classifier latency.
The overwhelming majority are obviously fine, and a 64-token completion with a stop sequence is roughly
the cheapest possible LLM call. Stage 2 — 8192 tokens, free-form — only runs for the small fraction that
stage 1 flags. It is a classic cheap-filter/expensive-adjudicator split, and the cost model is explicit in
the two `max_tokens` values.

### The two output grammars

`RBs` (`:443965-443969`) parses the boolean form:

```javascript
let t = [...FBs(e).matchAll(/<block>(yes|no)\b(<\/block>)?/gi)];
if (t.length === 0) return null;
return t[0][1].toLowerCase() === "yes";
```

Note the optional closing tag — necessary because the stop sequence `</block>` may be consumed by the
API and never appear in the content. `null` (no match) is the parse failure that fails closed.

`kBs` / `kBs` (`:443973`) / `Pi_` (`:443977-443983`) parse the newer **severity** form, which is 220-only
(`</severity>` 220=4 / 193=0; `stage1Severity` 220=9 / 193=0):

```javascript
function kBs(e) {
  if (e.stop_reason !== "stop_sequence" && e.stop_reason !== "end_turn") return null;
  return Pi_(Xc(e.content));
}
function Pi_(e) {
  let t = e.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");
  if (t.includes("<thinking>")) return null;
  let r = [...t.matchAll(/<severity>\s*(\d+(?:\.\d+)?)\s*(<\/severity>)?/g)];
  if (r.length !== 1) return null;
  return Number(r[0][1]);
}
```

Three fail-closed conditions, each defending a specific attack or failure:

- `stop_reason` must be `stop_sequence` or `end_turn` — a `max_tokens` truncation cannot produce a verdict.
- Complete `<thinking>` blocks are stripped, and an *unbalanced* `<thinking>` returns `null`. Without this,
  a severity number that the model wrote while reasoning ("severity 1 would be wrong here") would be read
  as the verdict.
- **Exactly one** `<severity>` match, not the first. If the model emits two, there is no principled way to
  pick, so refuse.

The consumers compare against thresholds carried in `u`: `A > u.t1` at stage 1 (`:444085`) and
`Y > u.t2` at stage 2 (`:444195`). Two thresholds means stage 1 can be *tuned* to a different sensitivity
than stage 2 rather than being a strict prefilter — a numeric score is what makes that possible, and it is
the reason the severity grammar was added alongside the boolean one instead of replacing it.

### New instrumentation

| anchor | 220 | 193 | what it adds |
|---|---|---|---|
| `stage1Severity` | 9 | 0 | the numeric score on every result object |
| `</severity>` | 4 | 0 | the severity grammar |
| `errorKind` | 39 | 22 | 17 new sites |
| `no_retry` | 4 | 1 | `http_${status}_no_retry` classification (`qi_`, `:444707-…`) |
| `queueDepth` / `queueWaitMs` | 2 / 2 | 0 / 0 | serialisation metrics (§5) |
| `classifierStage` | 41 | 29 | 12 new sites |
| `classifierType` | 9 | 9 | carryover |
| `wall_clock_timeout` | 2 | 2 | carryover |

The stall log at `:444344` is byte-identical to 193's (`1/1`) but now carries the token estimate:

```javascript
`[Stall] classifier_request_started reqId=${n} tool=${t.toolName} model=${t.classifierModel} stage=${t.classifierStage}${o}`
```
where `o` is `` ` promptTokensEst=${t.promptTokensEstimate}` `` when present (`:444342`).

Outcome reporting funnels through `uFt` (`:444679-444705`), which maps five outcomes onto the
`permission_auto_mode_classifier` health signal (`success` → `be`, everything else → `pe` with a reason)
and emits `tengu_auto_mode_outcome` with `outcome`, `classifierModel`, `classifierType`, `failureKind`,
optional `errorKind` and `fallbackFrom`. `interrupted` deliberately emits **no** health signal
(`:444694-444695`) — a user interrupt is not a classifier failure, which is the same distinction `.216` #29 made
on the dialog side.

---

## 5. Queueing (`tengu_auto_mode_classifier_queue`)

**Verdict: NET_NEW.** `tengu_auto_mode_classifier_queue` 220=1 (`:442629`) / 193=0;
`CLAUDE_CODE_AUTO_MODE_CLASSIFIER_QUEUE` 220=1 / 193=0.

```javascript
// ============================================
// isClassifierQueueEnabled / runClassifierQueued - per-key serialisation with depth metrics
// Location: cli_inner_pretty.js:442626-442657
// ============================================

// ORIGINAL (for source lookup):
function nOd() {
  let e = Og.CLAUDE_CODE_AUTO_MODE_CLASSIFIER_QUEUE;
  if (e !== void 0) return { value: e, src: "env" };
  return Ke("tengu_auto_mode_classifier_queue", !1) === !0 ? { value: !0, src: "gb" } : { value: !1, src: "default" };
}
function oOd(e, t, r) {
  let n = pcn.get(e) ?? 0;
  pcn.set(e, n + 1);
  let o = Date.now(),
    i = To_.run(e, () => {
      try { r?.({ queueDepth: n, queueWaitMs: Date.now() - o }); } catch {}
      return t();
    });
  return (
    i.then(() => { return; }, () => { return; }).then(() => {
      let s = (pcn.get(e) ?? 1) - 1;
      if (s <= 0) pcn.delete(e);
      else pcn.set(e, s);
    }),
    i
  );
}

// READABLE (for understanding):
function resolveClassifierQueueSetting() {
  let fromEnv = env.CLAUDE_CODE_AUTO_MODE_CLASSIFIER_QUEUE;
  if (fromEnv !== undefined) return { value: fromEnv, src: "env" };            // env wins
  return getFeatureValue("tengu_auto_mode_classifier_queue", false) === true
    ? { value: true, src: "gb" }                                               // then the remote gate
    : { value: false, src: "default" };                                        // default OFF
}

function runClassifierQueued(queueKey, work, onStart) {
  let depthBefore = pendingByKey.get(queueKey) ?? 0;
  pendingByKey.set(queueKey, depthBefore + 1);
  let enqueuedAt = Date.now(),
    promise = serializerByKey.run(queueKey, () => {
      try { onStart?.({ queueDepth: depthBefore, queueWaitMs: Date.now() - enqueuedAt }); } catch {}
      return work();
    });
  promise.then(noop, noop).then(() => {                                        // settle on BOTH outcomes
    let remaining = (pendingByKey.get(queueKey) ?? 1) - 1;
    if (remaining <= 0) pendingByKey.delete(queueKey);                         // free the map entry
    else pendingByKey.set(queueKey, remaining);
  });
  return promise;                                                              // caller sees the ORIGINAL promise
}

// Mapping: nOd→resolveClassifierQueueSetting, oOd→runClassifierQueued, To_→serializerByKey,
//          pcn→pendingByKey, Ke→getFeatureValue, Og→env
```

Four details that are easy to get wrong and are right here:

1. **The returned promise is `i`, not the chained one.** The decrement chain is attached with
   `.then(noop, noop)` so a rejection is absorbed *for the bookkeeping chain only*; the caller still
   receives the original promise and still sees the rejection. Returning the chained promise would have
   swallowed every classifier error.
2. **`queueDepth` is measured before the increment** and reported *when the work starts*, together with
   `queueWaitMs`. That pairing is what makes the metric diagnostic: depth without wait time cannot
   distinguish "deep queue, fast drain" from "shallow queue, slow call".
3. **Map entries are deleted at zero**, not left at `0`. `pendingByKey` is keyed by session/context, so
   in a long-lived process leaving zero entries behind is an unbounded leak.
4. **Default off, env overrides gate.** Serialising classifier calls trades throughput for determinism —
   with a queue, a burst of parallel tool calls is judged in order and each sees the prior ones' outcomes
   in the transcript; without it they are judged concurrently against a shorter transcript. That is a
   *correctness* argument for the queue and a *latency* argument against it, which is exactly the shape of
   a decision you ship behind a default-off remote gate.

### The race the queue creates, and the guard for it

Serialising introduces a new failure mode: the user can press Shift+Tab and change permission mode while a
classifier call sits in the queue. 2.1.220 ships a guard, and it is **220=1 / 193=0** on both anchors:

- `:58348` — the user-facing message
  `Permission mode changed while the auto-mode classifier call was queued — falling back to manual approval under the current mode`
- `:513878` — a `tengu_auto_mode_fallback_to_ask` arm with `reason: Ee("mode_changed_while_queued")`

`mode_changed_while_queued` is 220=1 / 193=0. So `tengu_auto_mode_fallback_to_ask` has **eight** reason
values in 2.1.220, four of them at the primary site (`:513756`) and four at later sites:
`requires_user_interaction` (`:513765`), `workflow_usage_consent` (`:513770`),
`mode_changed_while_queued` (`:513878`), `transcript_too_long` (`:513968`).

**Why fall back to a prompt rather than re-classify?** A re-classification would be judged under the *new*
mode's assumptions while its input transcript was assembled under the old one — and the mode change is
itself a user action expressing intent. Falling back to "manual approval under the current mode" honours
the most recent user instruction, which is the same precedence principle as `hookAskFloor` (§2). The
message says exactly that, which is worth noting: a queued in-flight model call is a piece of state that
mode switching has to invalidate, and the code names the invalidation instead of hiding it.

The gate is cited in the scoping pass as the anchor for both `.210` #27 (classifier model default) and
`.216` #3 (HTTP 401 errors) and `.218` #30. It genuinely relates to all three only in the sense of being
the one net-new symbol in the region; see §6 for why the 401 bullet is not anchorable.

Three sibling resolvers in the same block share the pattern `env → tengu_auto_mode_config.<key> → default`,
all 220-only (`CLAUDE_CODE_AUTO_MODE_GIT_STATUS` 220=3 / 193=0):
`Co_`/`lOd` (`:442672-442680`, `gitStatusType`), `xo_`/`cOd` (`:442681-442689`, `gitStatusUploads`),
`Ho_`/`uOd` (`:442690-442698`, `gitStatusTruncationLimit`, default `ko_`). So the classifier can be given
the repo's git status as context, with a separate switch for whether that status is *uploaded* and a
truncation limit — a privacy-conscious three-way split rather than one boolean.

---

## 6. The classifier model: default and pinning

> `.210`: *"Improved auto mode: the permission classifier now defaults to Sonnet 5 for external sessions,
> validated on the session's first request and pinned for the session."*

`CLAUDE_CODE_AUTO_MODE_MODEL` is **220=1 (`:32698`) / 193=1 (`:43630`)** — the env override is
**carryover**. The env accessor is `idh` (`:32776`, `De.str()`).

What is net-new in the same area is the **beta header and its self-healing latch**:

```
Sji = WA("auto_mode_classifier", "auto-mode-classifier-2026-07-16")    :109221
```

`auto-mode-classifier-2026` is 220=1 / 193=0. So the classifier now sends a dated beta header, which means
the *server* selects the classifier behaviour — and the client needs a story for "server rejects the
beta".

```javascript
// ============================================
// dropClassifierBetaOnRejection / latchClassifierBetaDrop - self-healing beta negotiation
// Location: cli_inner_pretty.js:444409-444427
// ============================================

// ORIGINAL (for source lookup):
function Fi_(e, t) {
  if (zJt === null || !t.extraBetas?.includes(zJt) || !(e instanceof hi) || e.status !== 400 || n1d(e)) return null;
  return { ...t, extraBetas: t.extraBetas.filter((r) => r !== zJt) };
}
function Bi_(e, t) {
  if (IOd) return;
  IOd = !0;
  let r = zJt.name;
  (w(`Auto mode classifier: ${r} beta rejected (HTTP 400) and the retry without it succeeded — dropping the beta for the rest of the session`, { level: "warn" }),
    $e("permission_auto_mode_classifier", `${r}_rejected`));
  let n = e instanceof hi && e.headers?.get("x-should-retry") === "false";
  O("tengu_auto_mode_beta_latch", {
    classifierModel: Bu(t.classifierModel),
    classifierStage: fe(t.classifierStage),
    errorKind: fe(n ? "http_400_no_retry" : "http_400"),
  });
}

// READABLE (for understanding):
function retryOptionsWithoutClassifierBeta(error, opts) {
  if (CLASSIFIER_BETA === null ||                       // no beta configured
      !opts.extraBetas?.includes(CLASSIFIER_BETA) ||    // this request did not send it
      !(error instanceof ApiError) ||
      error.status !== 400 ||                           // only a 400 means "unknown beta"
      isNonBetaBadRequest(error))                       // …and not a 400 we can explain otherwise
    return null;
  return { ...opts, extraBetas: opts.extraBetas.filter((b) => b !== CLASSIFIER_BETA) };
}

function latchClassifierBetaDrop(error, ctx) {
  if (classifierBetaDropped) return;                    // once per process
  classifierBetaDropped = true;
  logWarn(`Auto mode classifier: ${CLASSIFIER_BETA.name} beta rejected (HTTP 400) and the retry without it succeeded — dropping the beta for the rest of the session`);
  reportHealthDegraded("permission_auto_mode_classifier", `${CLASSIFIER_BETA.name}_rejected`);
  emitTelemetry("tengu_auto_mode_beta_latch", {
    classifierModel: redactModel(ctx.classifierModel),
    classifierStage: redact(ctx.classifierStage),
    errorKind: redact(error.headers?.get("x-should-retry") === "false" ? "http_400_no_retry" : "http_400"),
  });
}

// Mapping: Fi_→retryOptionsWithoutClassifierBeta, Bi_→latchClassifierBetaDrop, zJt→CLASSIFIER_BETA,
//          IOd→classifierBetaDropped, hi→ApiError, n1d→isNonBetaBadRequest
```

`tengu_auto_mode_beta_latch` is 220=1 (`:444423`) / 193=0.

**Why HTTP 400 specifically, and why `n1d(e)`?** An unrecognised beta header is a request-validation
error, so it is a `400`. But so are many other things (bad model id, malformed messages). `n1d(e)`
(`:444732`) filters out 400s that have another explanation, so the client does not silently disable a
working beta because of an unrelated validation bug. And the latch is set only *after the retry without
the beta succeeds* — `Bi_(d, r)` is called at `:444446`, inside the branch that already re-issued the
request with the reduced beta set and got a response — so a 400 caused by something transient does not
permanently degrade the classifier.

**Why latch for the rest of the session rather than retry each time?** Every retry costs a full
classifier round-trip on the critical path of a tool call. One probe, then latch, bounds the cost at one
wasted request per process. The health signal `${name}_rejected` and the `errorKind` split
(`http_400_no_retry` vs `http_400`) exist so this is visible in aggregate — if a deployment breaks the
beta, the latch rate spikes.

### ⚠ Finding: in 2.1.220 this self-heal is dead code, because it guards the wrong beta

`Fi_`'s first condition is `zJt === null`, and **`zJt` is never assigned in this build**. Its only
occurrences are:

```
109181   zJt = null,                                              <- declaration, in a var list
109254        zJt,                                                <- membership in the Tig beta registry
444410   if (zJt === null || … ) return null;
444411   return { ...t, extraBetas: t.extraBetas.filter((r) => r !== zJt) };
444416   let r = zJt.name;
```

There is no `zJt = WA(...)` anywhere. The `Tig` registry at `:109223-109257` is built with
`.filter((e) => e !== null)` (`:109256`), which quietly drops the null slot — so `zJt` being unset is
*tolerated* by the registry and produces no startup error.

Consequences, all provable from the four lines above:

1. `Fi_` returns `null` on every call.
2. `DOd`'s retry branch is entered only when `p !== null` (`:444440`: `if (p === null || f <= 0) throw d;`),
   so the beta-drop retry never runs.
3. `Bi_` (`:444413`) is called only at `:444446`, inside that branch — therefore
   **`tengu_auto_mode_beta_latch` can never fire in 2.1.220**, and `:444416` (`zJt.name`) would throw a
   `TypeError` if it somehow did.

Meanwhile the classifier *does* send a beta: `ROd(provider)` (`:444392-444396`) returns `[Sji]` — the
`auto-mode-classifier-2026-07-16` header — and only for `firstParty` with `HP() && Yd()`. `Sji`
(`:109221`) and `zJt` (`:109181`) are **two different slots**.

So the accurate statement is: *2.1.220 ships a dated classifier beta with a self-healing rejection path
that is wired to a different, unassigned beta slot and cannot execute.* Whether that is a wiring bug or a
deliberately disarmed mechanism staged for a future beta, the client behaviour today is: a 400 from the
classifier beta propagates as an ordinary classifier error (`errorKind: "http_400"` via `qi_`, `:444707`)
and the session keeps sending the header. Do not describe this as a working self-heal.

### `.216` #3 — "HTTP 401 classifier errors": UNANCHORED, proposed anchor disproven

> `.216`: *"Fixed auto mode denying commands with "HTTP 401" classifier errors after the OAuth token
> expired or rotated mid-session."*

`HTTP 401` is **220=3 / 193=0**, which is why it was picked as the anchor. All three 2.1.220 sites are
**Claude Design authentication**, not the classifier:

- `:411656` / `:411657` — `Claude Design authentication failed (HTTP 401): …`
- `:412414` — `Claude Design authentication failed (HTTP 401). The claude.ai credential is missing or expired…`

And the OAuth-401 recovery machinery is **byte-count-identical** across the two builds:
`withOAuth401Retry` 1/1, `handleOAuth401Error` 7/7, `CLAUDE_CODE_OAUTH_401_WAIT_MS` 2/2,
`tengu_oauth_401_recovered_from_disk` 1/1, `oauth_401_recovery` 7/7.

So the bullet is not anchorable through a 401 literal. The classifier-side error taxonomy *did* change
(`errorKind` 22→39, `no_retry` 1→4, `qi_`'s `http_${status}_no_retry` classification (`:444707-…`)), and the fix is
plausibly the reclassification of an auth error from "block" to "retryable/unavailable" — the
`automode-unavailable` semantics in §3.3 describe exactly that outcome. But I did not isolate the changed
line, so this is recorded UNANCHORED rather than attributed.

---

## 7. What `.218` moved from dialog to classifier, summarised

| check | reason produced at | previously | in 2.1.220 |
|---|---|---|---|
| dangerous `rm` / catastrophic removal | `_Ke` `:390676-390687` → `circuitBreaker: "dangerousRemoval"` `:390684` | mandatory dialog (`classifierApprovable: !1`) | classifier adjudicates in auto / plan-auto |
| background `&` operator | `Wsn` `:394424-394441` → `circuitBreaker: "backgroundOperator"` `:394435` | mandatory dialog | classifier adjudicates |
| suspicious Windows path (writes) | `ylt` `:528312-528346` → `circuitBreaker: "suspiciousWindowsPath"` `:528321` | mandatory dialog | classifier adjudicates |
| Bash the analyzer cannot prove read-only, under plan mode | `gnn`'s plan disjunct `:325873` | prompt | classifier adjudicates when auto is the plan-underlying mode and bypass is unavailable |
| a `PreToolUse` hook `ask` | `hookAskFloor` `:400917` | classifier could override to allow | **floored at a prompt** (opposite direction) |

The last row is the important counterweight: `.211` and `.218` pull in opposite directions *on purpose*.
`.218` lets the classifier override the **harness's own heuristics**; `.211` forbids it from overriding a
**user-installed hook**. The distinction is provenance: harness heuristics are conservative guesses that a
better judge may relax; a hook is an explicit user instruction that no judge may relax.

Reasons that are still absolute (`classifierApprovable: !1` with **no** breaker) therefore always open a
dialog even in auto mode. The clearest example in this window is `EnterWorktree`
(`a model-supplied worktree outside …`, `:406441`, 220=1 / 193=0) — see
[`../04_tools/`](../04_tools/). That asymmetry is the API: adding a breaker name is an explicit,
reviewable decision to delegate a check to the model.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md).

Key functions in this document:
- `isClassifierAdjudicating` (`gnn`, `:325872`) - `auto || (plan && carouselActive && !bypassAvailable)`
- `isClassifierAdjudicatingMode` (`Qqs`, `:513122`) - mode-string variant, gates the classifier block
- `findSafetyCheckReason` (`sG`, `:513689`) - recursive `safetyCheck` reason walker
- `attachAskRuleForCircuitBreaker` (`pvd`, `:394411`) - a user `ask` rule outranks a breaker
- `makeDangerousRemovalAsk` (`_Ke`, `:390676`) - produces `circuitBreaker: "dangerousRemoval"`
- `checkBackgroundOperator` (`Wsn`, `:394424`) - produces `circuitBreaker: "backgroundOperator"`
- `checkWritePathSafety` (`ylt`, `:528312`) - produces `circuitBreaker: "suspiciousWindowsPath"`
- `isSuspiciousWindowsPath` (`Sht`, `:528296`) - the underlying path heuristic
- `denyBecausePromptsUnavailable` (`Xqs`, `:513421`) - fail-closed `asyncAgent` deny
- `preferCircuitBreakerReason` (`tfn`, `:513274`) - reason merge for display-only decisions
- `isLocalDisplayOnlyClassifier` (`J1_`, `:513162`) - vestigial `return !1`
- `parseBlockVerdict` (`RBs`, `:443965`) - `<block>yes|no</block>`
- `parseSeverityVerdict` (`kBs`, `:443973`) / `parseSeverityFromText` (`Pi_`, `:443977`) - `<severity>N</severity>`
- `resolveClassifierQueueSetting` (`nOd`, `:442626`) / `isClassifierQueueEnabled` (`eDo`, `:442623`)
- `runClassifierQueued` (`oOd`, `:442631`) - per-key serialisation with depth/wait metrics
- `resolveGitStatusType` (`lOd`, `:442675`) / `resolveGitStatusUploads` (`cOd`, `:442684`) / `resolveGitStatusLimit` (`uOd`, `:442693`)
- `runClassifierRequestWithStall` (`$i_`, `:444339`) - the `[Stall]` logger
- `retryOptionsWithoutClassifierBeta` (`Fi_`, `:444409`) - beta-drop retry builder
- `latchClassifierBetaDrop` (`Bi_`, `:444413`) - one-shot latch + `tengu_auto_mode_beta_latch`
- `callClassifierWithRetries` (`DOd`, `:444429`) - stage runner
- `formatClassifierFailureReason` (`OOd`, `:444676`) - user-facing failure text
- `reportClassifierOutcome` (`uFt`, `:444679`) - `tengu_auto_mode_outcome` emitter
- `classifyClassifierErrorKind` (`qi_`, `:444707`) - `wall_clock_timeout` / `http_${status}_no_retry` / …
- `CLASSIFIER_BETA` (`Sji`, `:109221`) - `auto-mode-classifier-2026-07-16`
- `canonicalizeClassifierCategory` (`Xon`, `:345238`) - rule-id allow-list for telemetry
