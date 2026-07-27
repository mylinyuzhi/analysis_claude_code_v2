# Teammate lifecycle: failure attribution, eviction holds, retry wakes, and leader notices

> Bundles per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §1. Every line number below was read in
> `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`; baseline lines are
> tagged `(193)`.

This document covers the **leader ↔ teammate control plane**: how a teammate's turn outcome is
classified, how that decides whether it dies or is held alive, how a message to a stuck teammate cuts
its API backoff short, why the leader used to get idle notifications twice, and why typing `/model`
inside an agent view used to hijack the lead's picker.

The wire it all rides on is documented in
[`mailbox_transport_hardening.md`](mailbox_transport_hardening.md). Background-agent plumbing
(`claude agents`, the daemon, worktrees) belongs to
[`../36_background_agents/`](../36_background_agents/README.md); spawn caps and depth belong to
[`../53_subagent_limits/`](../53_subagent_limits/README.md).

---

## 0. Two teammate execution paths, one notification protocol

This is essential background, and it is the reason two changelog bullets that sound like one bug are
fixed in two different files.

| | **In-process teammate** | **Pane teammate** |
|---|---|---|
| Backend | a task in the same process (`type: "in_process_teammate"`) | a separate `claude` process in a tmux pane / iTerm2 split |
| Driver | `runInProcessTeammate` (`H8y`, `:396406`) + poll loop `k8y` (`:396353`) | its own REPL; coordination via a `Stop` session hook |
| Turn-failure notice | inline at the end of each turn (`:396705-396722`) | `notifyLeaderOfFailedTurn` (`HKf`, `:759398`) after each REPL turn |
| Idle notice | `sendIdleNotificationToLead` (`zvd`, `:396246`) | the `Stop` hook registered by `initializeTeammateSession` (`inl`, `:759343`) |
| Default | **yes** — `teammateMode` default is `"in-process"` (`orn`, `:318739`) | opt-in via `teammateMode: tmux \| iterm2` |

Both paths converge on the same frame: `createIdleNotification` (`ddr`, `:325406`) → `writeToMailbox`
into the leader's inbox.

### `teammateMode` is pure carryover — do not write it up as a delta

The 2.1.193 tree documented `teammateMode`/iterm2 at length. In this window it did **not** change:

| Fact | 2.1.220 | 2.1.193 |
|---|---|---|
| literal `teammateMode` | 17 | 17 |
| enum members | `["auto","tmux","iterm2","in-process"]` (`tWl`, `:58389`) | identical (`uhs`, `:54136 (193)`) |
| default | `"in-process"` (`orn`, `:318739`) | `"in-process"` (`$jt`, `:302920 (193)`) |
| settings description | *"How spawned teammates execute (tmux, iterm2, in-process, auto)"* (`:61499-61503`) | byte-identical (`:56919-56922 (193)`) |
| CLI flag | `--teammate-mode <mode>` (`:851381`) | identical (`:714421 (193)`) |
| iTerm2 diagnostics | `:322742`, `:322749`, `:397726` | `:429197`, `:429204`, `:429968 (193)` |

**The one real change is a removal**, and it is undocumented: 2.1.193's teammate spawn-flag builder
ended with `let l = zRe(); t.push(\`--teammate-mode ${l}\`);` (`:428508 (193)`), forwarding the parent's
resolved mode to the child. The 2.1.220 builder `Zvd` (`:397199-397221`) has **no such push** — the
`--teammate-mode` string appears exactly once in the bundle, in the commander registration. So a pane
teammate now re-resolves its own mode from settings instead of inheriting the parent's snapshot.
`--effort` inheritance, by contrast, **survived** (`:397210`, gated by `pJn()`), as did
`--settings` / `--plugin-dir` / `--plugin-url` / `--chrome` forwarding.

Two further undocumented changes in the same builder pair:

- the provider env-forward list `R8y` (`:397061-397080`) gained the whole
  `anthropic_google_cloud` family (`CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD`,
  `ANTHROPIC_GOOGLE_CLOUD_{PROJECT,LOCATION,WORKSPACE_ID,BASE_URL}`,
  `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH`, `GOOGLE_CLOUD_PROJECT`), matching
  [`_GROUND_TRUTH`](../_GROUND_TRUTH_verified_anchors.md) §7.6's note that this provider is entirely
  changelog-invisible;
- `GMs` (`:397036-397048`) gained a **scrub set**: `let t = new Set(F5n(process.env));
  t.delete("CLAUDE_CODE_HOST_CREDS_FILE"); for (let n of R8y) { if (t.has(n)) continue; … }`
  (`:397038-397044`). 2.1.193 forwarded every entry of the list unconditionally (`:428516-428519 (193)`).
  Host-managed provider variables are now withheld from spawned teammates — the team-side
  counterpart of the `.212` `host-managed` bullet owned by `55_auth_providers`.

---

## 1. Turn-failure attribution (`.198`, first half)

> *Fixed agent teams: a teammate that dies on an API error now reports "failed" to the lead …*

### 1.1 The classifier

```javascript
// ============================================
// classifyTurnApiFailure - decides whether a finished turn ended in a reportable API failure
// Location: cli_inner_pretty.js:530510-530523
// ============================================

// ORIGINAL (for source lookup):
function olp(e) {
  return BMs(e)?.reason;
}
function BMs(e) {
  let t = e.findLast((n) => n.type === "assistant");
  if (!t?.isApiErrorMessage) return;
  let r = ite(t);
  if (r && _mt.has(r)) return;
  return {
    reason: r ?? "API error",
    errorKind: t.error,
    isTransient: t.apiErrorIsTransient === !0 || t.error === "overloaded" || t.error === "server_error",
  };
}

// READABLE (for understanding):
function getTurnFailureReason(messages) {
  return classifyTurnApiFailure(messages)?.reason;
}
function classifyTurnApiFailure(messages) {
  let lastAssistant = messages.findLast((m) => m.type === "assistant");
  if (!lastAssistant?.isApiErrorMessage) return undefined;       // 1. turn ended normally
  let text = extractAssistantText(lastAssistant);
  if (text && USER_INTERRUPT_TEXTS.has(text)) return undefined;  // 2. user-caused, not a failure
  return {
    reason: text ?? "API error",
    errorKind: lastAssistant.error,
    isTransient: lastAssistant.apiErrorIsTransient === true
              || lastAssistant.error === "overloaded"
              || lastAssistant.error === "server_error",
  };
}

// Mapping: olp→getTurnFailureReason, BMs→classifyTurnApiFailure, ite→extractAssistantText (:532102),
//          _mt→USER_INTERRUPT_TEXTS (:534126)
```

**Delta proof:** `apiErrorIsTransient` **220=6 / 193=0**; `hold_evict` **220=1 / 193=0**;
`errorKind` 220=39 / 193=22; `isTransient` 220=6 / 193=4 (partial overlap — the field name existed for
other subsystems, the *message* flag did not).

### How it works, decision by decision

1. **`findLast`, not "any".** Only the *final* assistant message decides. A turn that hit a 529, retried
   successfully, and then produced real output is **not** a failure. This is the whole reason the
   classifier is applied to the message array rather than to a caught exception.
2. **`isApiErrorMessage` is the discriminator**, set by the error-message factory `_u`
   (`:530704-530717`), which stamps `isApiErrorMessage: !0` plus `apiError` / `apiErrorIsTransient` /
   `error` / `errorDetails`. Only messages minted by that factory can ever be classified as failures —
   a model that merely *writes the words* "API error" cannot fake one.
3. **`_mt` is a suppression set of user-caused endings** (`:534126`):
   `SV = "[Request interrupted by user]"` (`:162840`), `jI = "[Request interrupted by user for tool
   use]"` (`:162841`), `MY` (`:162842`), `Mpt`, and `aie = "No response requested."` (`:157403`). Order
   matters: the set is consulted **after** `isApiErrorMessage`, so it only ever suppresses things that
   *were* error-shaped. Without it, pressing Escape in a teammate would tell the leader the teammate
   "failed".
4. **Transience is a three-way OR.** The explicit `apiErrorIsTransient` flag is only stamped on one
   construction site in the whole bundle — the rate-limit message at `:228499` — so the two
   `error` string comparisons (`"overloaded"`, `"server_error"`) carry most of the weight. Reading it
   the other way round: the flag is the *forward-looking* mechanism and the string checks are the
   compatibility floor for error kinds that were never taught to set it.
5. **`reason` falls back to the literal `"API error"`** when the message has no text. Because
   `createIdleNotification` truncates it to 200 chars (see the mailbox doc §4), the leader always gets a
   short, bounded string here.

**Key insight:** the classifier deliberately returns `undefined` (not `false`, not an object with
`failed: false`) for the happy path, so every consumer can write `if (reason !== undefined)` and the
"nothing to report" case costs one property read. Both consumers below rely on that.

### 1.2 Consumer A — the in-process runner

```javascript
// ============================================
// runInProcessTeammate (turn-end tail) - failure attribution, eviction hold, idle notice
// Location: cli_inner_pretty.js:396703-396726
// ============================================

// ORIGINAL (for source lookup):
      let Me = a.getAppState().tasks[r],
        ze = Me?.type === "in_process_teammate" && Me.isIdle,
        nt = !ge && !se.signal.aborted ? BMs(he) : void 0;
      if (((G = nt?.isTransient === !0 && !y && j), nt?.isTransient))
        O("tengu_teammate_transient_turn_failure", { error_kind: fe(nt.errorKind ?? "unknown"), hold_evict: G });
      rve(r, (He) => (
          He.onIdleCallbacks?.forEach((Qe) => Qe()),
          { ...He, isIdle: !0, evictAfter: G ? void 0 : Date.now() + Yse, onIdleCallbacks: [] }
        ), T);
      let at = nt?.reason;
      if (!ze && !y)
        await zvd(t.agentName, t.color, t.teamName, {
          idleReason: ge ? "interrupted" : at !== void 0 ? "failed" : "available",
          summary: gdr(M),
          failureReason: at,
        });
      else w(`[inProcessRunner] Skipping duplicate idle notification for ${t.agentName}`);
      w(`[inProcessRunner] ${t.agentId} finished prompt, waiting for next`);
      let Ze = await k8y(t, l, r, a.getAppState, T, t.parentSessionId, y, G);
      await V(Ze);

// READABLE (for understanding):
      let taskNow = getAppState().tasks[taskId],
        alreadyIdle = taskNow?.type === "in_process_teammate" && taskNow.isIdle,
        failure = !wasInterrupted && !turnAbort.signal.aborted ? classifyTurnApiFailure(turnMessages) : undefined;
      holdEvict = failure?.isTransient === true && !standalone && producedRealContent;
      if (failure?.isTransient)
        logEvent("tengu_teammate_transient_turn_failure",
                 { error_kind: sanitize(failure.errorKind ?? "unknown"), hold_evict: holdEvict });
      updateTeammateTask(taskId, (task) => (
        task.onIdleCallbacks?.forEach((cb) => cb()),
        { ...task, isIdle: true,
          evictAfter: holdEvict ? undefined : Date.now() + TEAMMATE_EVICT_DELAY_MS,   // 30 000
          onIdleCallbacks: [] }
      ), taskRegistry);
      let failureReason = failure?.reason;
      if (!alreadyIdle && !standalone)
        await sendIdleNotificationToLead(identity.agentName, identity.color, identity.teamName, {
          idleReason: wasInterrupted ? "interrupted" : failureReason !== undefined ? "failed" : "available",
          summary: getLastPeerDmSummary(allMessages),
          failureReason,
        });
      else debug(`[inProcessRunner] Skipping duplicate idle notification for ${identity.agentName}`);
      let next = await waitForNextTeammateInput(identity, abortCtl, taskId, getAppState, taskRegistry,
                                                identity.parentSessionId, standalone, holdEvict);
      await applyNextInput(next);

// Mapping: BMs→classifyTurnApiFailure, rve→updateTeammateTask, zvd→sendIdleNotificationToLead,
//          gdr→getLastPeerDmSummary, k8y→waitForNextTeammateInput, Yse→TEAMMATE_EVICT_DELAY_MS (30000, :341922),
//          G→holdEvict, ge→wasInterrupted, y→standalone, j→producedRealContent, O→logEvent
```

The 2.1.193 twin (`:428087-428103 (193)`) is the same code **minus everything above**:

```javascript
      let se = a.getAppState().tasks[n],
        ae = se?.type === "in_process_teammate" && se.isIdle;
      if ((Dde(n, (ye) => (ye.onIdleCallbacks?.forEach((fe) => fe()),
            { ...ye, isIdle: !0, evictAfter: Date.now() + Rde, onIdleCallbacks: [] }), S),
        !ae && !g))
        await Zsl(t.agentName, t.color, t.teamName, { idleReason: ue ? "interrupted" : "available", summary: _5t(R) });
      else T(`[inProcessRunner] Skipping duplicate idle notification for ${t.agentName}`);
```

No classifier, no `"failed"` arm, no `failureReason`, no telemetry, unconditional `evictAfter`
(`Rde = 30000`, `:446879 (193)` — the constant itself is carryover), and `F7p` is called with **seven**
arguments (`:428103 (193)`) where 220 passes **eight** (`:396725`).

So: in 2.1.193 an in-process teammate whose turn ended in an API error told the lead it was
**`"available"`**. The lead saw a healthy idle teammate that had silently produced nothing. That is the
bug, stated precisely.

### The eviction hold

**What it does:** when a teammate's turn failed *transiently* and it had already produced real output,
2.1.220 refuses to arm the 30-second eviction timer.

**How it works:**
1. `G = nt?.isTransient === !0 && !y && j` (`:396706`) — three conjuncts:
   - `isTransient === true` — a 429/529/overloaded/server_error class failure, i.e. one that retrying
     can plausibly fix. A 400 or an auth failure is *not* held: nothing about waiting helps.
   - `!y` (`standalone === false`) — a headless standalone lead has no leader to be held for.
   - `j` — `j ||= he.some((He) => (He.type === "assistant" && !He.isApiErrorMessage) || He.type === "user")`
     (`:396690`): the turn produced at least one non-error assistant message or user message. **A
     teammate that has never said anything useful is allowed to be evicted.** This is the guard that
     stops a permanently-broken teammate from pinning memory forever.
2. `evictAfter: G ? void 0 : Date.now() + Yse` (`:396712`) — `undefined` means "no deadline", so the
   eviction sweeper never picks it up.
3. `G` is also threaded into the poll loop as its 8th argument, where it does two more things
   (`:396373`, `:396380-396381`): it refreshes the activity clock every tick, and it **clears any
   `evictAfter` that was already set** — so a hold applies retroactively to a teammate that was already
   counting down.

**Why this approach:** the alternative is to evict and let the leader respawn. That loses the
teammate's entire conversation, its claimed task, and its worktree state — a very expensive response to
a 529 that would have cleared in seconds. The trade-off accepted is that a teammate stuck behind a
*permanently* overloaded upstream is never reclaimed automatically; the design bets that
`isTransient && producedContent` is rare enough for that to be acceptable, and pairs it with §2's wake
so a human or the lead can always poke it.

**Key insight:** `hold_evict` is emitted as a telemetry *field* rather than a separate event
(`:396707`). That is a deliberate choice: the interesting fleet question is not "how often do teammates
fail transiently" but "how often does the failure mode we chose to protect actually occur", and
answering it requires the two facts in one row.

### 1.3 Consumer B — the pane path (this is the `.198` bullet's true home)

```javascript
// ============================================
// notifyLeaderOfFailedTurn - a pane teammate reports an API-failed turn to its lead
// Location: cli_inner_pretty.js:759398-759414
// ============================================

// ORIGINAL (for source lookup):
async function HKf(e, t, r) {
  if (r || !e || e.isLeader) return;
  let n = e.selfAgentName;
  if (!n) return;
  let o = olp(t);
  if (o === void 0) return;
  tdr(e.teamName, n, !1);
  let s = (await JL(e.teamName))?.members.find((l) => l.agentId === e.leadAgentId)?.name || zf,
    a = ddr(n, { idleReason: "failed", failureReason: o, summary: gdr(t) });
  try {
    await VT(s, { from: n, text: Ie(a), timestamp: new Date().toISOString(), color: bL() });
  } catch (l) {
    w(`[TeammateInit] Failed to send failed idle notification to team leader: ${le(l)}`, { level: "error" });
    return;
  }
  w(`[TeammateInit] Sent failed idle notification to leader ${s}`);
}

// READABLE (for understanding):
async function notifyLeaderOfFailedTurn(teamContext, turnMessages, aborted) {
  if (aborted || !teamContext || teamContext.isLeader) return;      // leads report to nobody
  let selfName = teamContext.selfAgentName;
  if (!selfName) return;
  let reason = getTurnFailureReason(turnMessages);
  if (reason === undefined) return;                                 // turn was fine
  setMemberActive(teamContext.teamName, selfName, false);           // roster: mark self idle
  let leadName = (await readTeamFile(teamContext.teamName))
        ?.members.find((m) => m.agentId === teamContext.leadAgentId)?.name || TEAM_LEAD_NAME,
      frame = createIdleNotification(selfName,
        { idleReason: "failed", failureReason: reason, summary: getLastPeerDmSummary(turnMessages) });
  try {
    await writeToMailbox(leadName, { from: selfName, text: jsonStringify(frame),
                                     timestamp: new Date().toISOString(), color: getMyInkColor() });
  } catch (err) { error(`[TeammateInit] Failed to send failed idle notification to team leader: ${err}`); return; }
  debug(`[TeammateInit] Sent failed idle notification to leader ${leadName}`);
}

// Mapping: HKf→notifyLeaderOfFailedTurn, olp→getTurnFailureReason, tdr→setMemberActive (:324563),
//          JL→readTeamFile, zf→TEAM_LEAD_NAME, ddr→createIdleNotification, VT→writeToMailbox,
//          gdr→getLastPeerDmSummary, Ie→jsonStringify, bL→getMyInkColor
```

**Delta proof:** `failed idle notification` **220=2 / 193=0**; `idleReason: "failed"` 220=2 (`:396804`,
`:759406`) / **193=1** (`:428203 (193)`).

That 2-vs-1 count is the whole story of this bullet, and it is a textbook carryover trap. **2.1.193
already reported `"failed"` — but only from the `catch` block of the in-process runner**
(`:428200-428206 (193)`), i.e. only when the agent loop *threw*. An API error does not throw: the SDK
converts it into an `isApiErrorMessage` assistant message and the loop completes normally. So in 193
the exact scenario the bullet names — *"a teammate that dies on an API error"* — took the
**success** path and reported `"available"`.

The single new site at `:759406` is the pane-teammate reporter, wired into the REPL turn tail at
`:822789` (`HKf(at.getState().teamContext, Nu.current, Nr.signal.aborted)`), immediately after the
turn's engine call returns. `:396804` is the in-process runner's own `catch` arm, the 193 site
re-emitted. The *third* place `"failed"` can now be produced is the ternary at `:396719`, which does
not match the literal grep at all — a reminder that literal counting under-reports this bullet by one.

**Ordering detail worth noting:** `setMemberActive(team, self, false)` runs **before** the mailbox
write and its result is not awaited (`:759404` — no `await`). The roster flag is a UI hint; the mailbox
frame is the real signal. If the write throws, the roster still says idle, so the leader's *view*
recovers even when the *notification* is lost.

---

## 2. Waking a stuck teammate (`.198`, second half)

> *… and messaging a stuck teammate wakes it to retry immediately*

A "stuck" teammate is one sitting inside the API retry backoff. `computeRetryDelay`
(`Z2e`, `:534820-534828`) is `min(500 · 2^(attempt-1), 32000)` plus up to 25 % jitter, honouring
`retry-after`, so a teammate can be unreachable for **32 seconds per attempt** — and with the
`.199` retry-watchdog raising the default attempt count to 300 (see
[`../57_api_reliability/`](../57_api_reliability/)), effectively forever. The mailbox poll loop does not
run during a turn, so a message sent to such a teammate simply waited.

2.1.220 threads a **wake emitter** from the sender all the way into the retry sleep.

```javascript
// ============================================
// sleepUntilRetryOrWake - interruptible backoff sleep; returns true if it was woken early
// Location: cli_inner_pretty.js:534800-534816
// ============================================

// ORIGINAL (for source lookup):
async function Plp(e, t) {
  if (!t.subscribeRetryWake) return (await vr(e, t.signal, { abortError: FUo }), !1);
  if (t.signal?.aborted) throw FUo();
  let r = !1,
    n = new AbortController(),
    o = t.subscribeRetryWake(() => { ((r = !0), n.abort()); }),
    i = () => n.abort();
  t.signal?.addEventListener("abort", i, { once: !0 });
  try {
    if ((await vr(e, n.signal), t.signal?.aborted)) throw FUo();
    return r;
  } finally { (o(), t.signal?.removeEventListener("abort", i)); }
}

// READABLE (for understanding):
async function sleepUntilRetryOrWake(delayMs, ctx) {
  if (!ctx.subscribeRetryWake) { await sleep(delayMs, ctx.signal, { abortError: makeAbortError }); return false; }
  if (ctx.signal?.aborted) throw makeAbortError();
  let woken = false,
    sleepAbort = new AbortController(),
    unsubscribe = ctx.subscribeRetryWake(() => { woken = true; sleepAbort.abort(); }),
    forwardAbort = () => sleepAbort.abort();
  ctx.signal?.addEventListener("abort", forwardAbort, { once: true });
  try {
    await sleep(delayMs, sleepAbort.signal);
    if (ctx.signal?.aborted) throw makeAbortError();     // real cancellation wins over a wake
    return woken;
  } finally { unsubscribe(); ctx.signal?.removeEventListener("abort", forwardAbort); }
}

// Mapping: Plp→sleepUntilRetryOrWake, vr→sleep, FUo→makeAbortError
```

Its caller is the retry countdown (`:534756-534775`):

```javascript
let M = L;                                  // remaining delay
while (M > 0) {
  if (r.signal?.aborted) throw new xy();
  ... r.onRetryStatus?.({ kind: "retrying", attempt: P, maxRetries: n, retryInMs: M, deadline: Date.now() + M }) ...
  let $ = Math.min(M, KU_);                 // KU_ = 30000  (:535004)
  if (await Plp($, r)) break;               // woken -> abandon the remaining delay
  M -= $;
}
```

### The full wake chain, end to end

| # | Site | What happens |
|---|---|---|
| 1 | `:396534` | the runner creates one emitter per teammate run: `re = Is()` (`Is`, `:1968` — a `{subscribe, emit}` Set-backed pub/sub) |
| 2 | `:396538` | each turn stores it on the task: `retryWake: re` |
| 3 | `:396609` | the turn's engine call receives `override.subscribeRetryWake: re.subscribe` |
| 4 | `:344586`, `:337941`, `:509187`, `:510292`, `:511497`, `:511594` | it is copied down through the query/engine layers into the request context |
| 5 | `:534801` | the retry sleep subscribes to it |
| 6 | `:418060` | **the sender**: right after `writeToMailbox`, `SendMessage` calls `wakeRunningTeammate(tasks, recipient, team)` |
| 7 | `:396079-396082` | `OMs` finds the recipient's running task and calls `retryWake?.emit()` |
| 8 | `:396746`, `:396788` | the field is cleared when the task reaches `completed` / `failed` |

```javascript
// ============================================
// wakeRunningTeammate - poke a teammate that is mid-turn so it stops waiting on backoff
// Location: cli_inner_pretty.js:396079-396082
// ============================================

// ORIGINAL (for source lookup):
function OMs(e, t, r) {
  let n = EKe(zCe(t, r), e);
  if (n?.status === "running") n.retryWake?.emit();
}

// READABLE (for understanding):
function wakeRunningTeammate(tasks, recipientName, teamName) {
  let task = findTaskByAgentId(makeAgentId(recipientName, teamName), tasks);   // `${name}@${team}`
  if (task?.status === "running") task.retryWake?.emit();                      // no-op if idle/queued
}

// Mapping: OMs→wakeRunningTeammate, EKe→findTaskByAgentId (:…, prefers a running task),
//          zCe→makeAgentId (`${name}@${team}`)
```

**Delta proof:** `retryWake` **220=6 / 193=0**; `subscribeRetryWake` **220=9 / 193=0**.

### Why the wake is a *sleep interrupt*, not a queue signal

**What it does:** it does not deliver the message; it shortens the wait before the teammate's next API
attempt, after which the normal turn-end mailbox check picks the message up.

**How it works and why:**
1. `sleepUntilRetryOrWake` returns a **boolean**, and the caller uses it only to `break` the countdown
   loop. The wake never skips a retry, never changes the attempt counter, and never bypasses
   `retry-after`. It only says "stop waiting *now*".
2. **The real abort signal still wins.** After the sleep resolves, `if (ctx.signal?.aborted) throw`
   (`:534811`) re-checks the outer signal. Without this, an abort that arrived concurrently with a wake
   would be swallowed and the request retried after cancellation.
3. `if (n?.status === "running")` (`:396081`) means messaging an *idle* teammate does nothing here —
   correctly, because an idle teammate is already in the 500 ms poll loop and will see the message
   within half a second anyway. The wake exists solely for the mid-turn case.
4. The chunking `Math.min(M, KU_)` with `KU_ = 30000` predates the wake and exists so the "retrying in
   N s" UI ticks; the wake reuses it for free, because a wake only has to survive one chunk.
5. `retryWake` is **emitted but never subscribed by the mailbox layer** — there is no subscriber other
   than `sleepUntilRetryOrWake`. So if a teammate is stuck for a reason other than API backoff (a long
   Bash command, a permission prompt), messaging it still does nothing. The bullet's word "stuck" is
   narrower than it sounds.

The same emitter is fired from two more places in the `SendMessage` tool's agent-resume path
(`:418681`, `:418717`), where the message is queued for an already-running agent and the tool reports
*"Teammate "X" is already running; queued your message for its next turn."*

---

## 3. The duplicate idle notification (`.212`) — a one-property fix

> *Fixed agent teams: a stopping teammate could send the leader duplicate idle notifications when team
> initialization re-ran within a session*

Anchor counts first, because this is the trap: `Skipping duplicate idle notification` is
**220=1 / 193=1** and its guard (`ze`/`ae` above) is byte-identical carryover. Anchoring on that string
proves nothing. The real anchor is **`teammate-idle-notification`, 220=1 / 193=0** (`:759395`).

### 3.1 The registration

```javascript
// ============================================
// initializeTeammateSession (tail) - registers the teammate's Stop hook with a STABLE id
// Location: cli_inner_pretty.js:759379-759396
// ============================================

// ORIGINAL (for source lookup):
  (w(`[TeammateInit] Registering Stop hook for teammate ${i} to notify leader ${u}`),
    FCu(
      e, t, "Stop", "",
      async (d, p) => {
        tdr(n, i, !1);
        let f = ddr(i, { idleReason: "available", summary: gdr(d) });
        return (
          await VT(u, { from: i, text: Ie(f), timestamp: new Date().toISOString(), color: bL() }),
          w(`[TeammateInit] Sent idle notification to leader ${u}`),
          !0
        );
      },
      "Failed to send idle notification to team leader",
      { timeout: 1e4, id: "teammate-idle-notification" },
    ));

// READABLE (for understanding):
  debug(`[TeammateInit] Registering Stop hook for teammate ${selfName} to notify leader ${leadName}`);
  addSessionFunctionHook(
    setAppState, sessionId, "Stop", /* matcher */ "",
    async (messages, _ctx) => {
      setMemberActive(teamName, selfName, false);
      let frame = createIdleNotification(selfName,
        { idleReason: "available", summary: getLastPeerDmSummary(messages) });
      await writeToMailbox(leadName, { from: selfName, text: jsonStringify(frame),
                                       timestamp: new Date().toISOString(), color: getMyInkColor() });
      debug(`[TeammateInit] Sent idle notification to leader ${leadName}`);
      return true;
    },
    "Failed to send idle notification to team leader",
    { timeout: 10_000, id: "teammate-idle-notification" },       // <-- the entire fix
  );

// Mapping: FCu→addSessionFunctionHook (:215736), tdr→setMemberActive, ddr→createIdleNotification,
//          VT→writeToMailbox, gdr→getLastPeerDmSummary, Ie→jsonStringify, bL→getMyInkColor
```

The 2.1.193 twin (`:640060-640076 (193)`) is **identical except for the last line**, which reads
`{ timeout: 1e4 }` — no `id`.

### 3.2 Why one missing property duplicated the notification

```javascript
// ============================================
// addSessionFunctionHook / addSessionHook - id-keyed replace, or append
// Location: cli_inner_pretty.js:215736-215760
// ============================================

// ORIGINAL (for source lookup):
function FCu(e, t, r, n, o, i, s) {
  let a = s?.id || `function-hook-${Date.now()}-${Math.random()}`,
    l = { type: "function", id: a, timeout: s?.timeout || 5000, callback: o, errorMessage: i };
  return (BCu(e, t, r, n, l), a);
}
function BCu(e, t, r, n, o, i, s) {
  (e((a) => {
    let l = a.sessionHooks.get(t) ?? { hooks: {} },
      c = l.hooks[r] || [],
      u = c.findIndex((f) => f.matcher === n && f.skillRoot === s),
      d;
    if (u >= 0) {
      d = [...c];
      let f = d[u],
        m = o.type === "function" && o.id
            ? f.hooks.findIndex((y) => y.hook.type === "function" && y.hook.id === o.id) : -1,
        g = m >= 0 ? f.hooks.with(m, { hook: o, onHookSuccess: i }) : [...f.hooks, { hook: o, onHookSuccess: i }];
      d[u] = { matcher: f.matcher, skillRoot: f.skillRoot, hooks: g };
    } else d = [...c, { matcher: n, skillRoot: s, hooks: [{ hook: o, onHookSuccess: i }] }];
    let p = { ...l.hooks, [r]: d };
    return (a.sessionHooks.set(t, { hooks: p }), a);
  }), w(`Added session hook for event ${r} in session ${t}`));
}

// READABLE (for understanding):
function addSessionFunctionHook(setAppState, sessionId, event, matcher, callback, errorMessage, opts) {
  let id = opts?.id || `function-hook-${Date.now()}-${Math.random()}`;      // random => never matches
  let hook = { type: "function", id, timeout: opts?.timeout || 5000, callback, errorMessage };
  addSessionHook(setAppState, sessionId, event, matcher, hook);
  return id;
}
function addSessionHook(setAppState, sessionId, event, matcher, hook, onHookSuccess, skillRoot) {
  setAppState((state) => {
    let bucket = state.sessionHooks.get(sessionId) ?? { hooks: {} },
      groups = bucket.hooks[event] || [],
      gi = groups.findIndex((g) => g.matcher === matcher && g.skillRoot === skillRoot),
      next;
    if (gi >= 0) {
      next = [...groups];
      let group = next[gi],
        hi = hook.type === "function" && hook.id
             ? group.hooks.findIndex((h) => h.hook.type === "function" && h.hook.id === hook.id) : -1;
      next[gi] = { matcher: group.matcher, skillRoot: group.skillRoot,
                   hooks: hi >= 0 ? group.hooks.with(hi, { hook, onHookSuccess })     // REPLACE
                                  : [...group.hooks, { hook, onHookSuccess }] };      // APPEND
    } else next = [...groups, { matcher, skillRoot, hooks: [{ hook, onHookSuccess }] }];
    state.sessionHooks.set(sessionId, { hooks: { ...bucket.hooks, [event]: next } });
    return state;
  });
}

// Mapping: FCu→addSessionFunctionHook, BCu→addSessionHook
```

**`BCu` is byte-equivalent carryover** — 2.1.193's `KQa` (`:397131-397156 (193)`, reached from `zQa`
`:397126 (193)`) has the identical
`.with(hi, …)` replace-by-id branch, and `function-hook-` is **220=1 / 193=1**. The de-duplication
machinery was always there. The teammate hook simply never opted into it, so every registration took
the `Math.random()` id and landed on the **append** arm.

### 3.3 Why initialization re-ran

```javascript
// ============================================
// useTeammateInitialization - the effect that (re-)runs team init
// Location: cli_inner_pretty.js:759430-759449
// ============================================

// ORIGINAL (for source lookup):
function RKf(e, t, { enabled: r = !0 } = {}) {
  IKf.useEffect(() => {
    if (!r) return;
    (async () => {
      if (!mc()) return;
      let n = t?.[0],
        o = n && "teamName" in n ? n.teamName : void 0,
        i = n && "agentName" in n ? n.agentName : void 0;
      if (o && i) {
        await kKf(e, o, i);
        let a = (await JL(o))?.members.find((l) => l.name === i);
        if (a) await inl(e, kt(), { teamName: o, agentId: a.agentId, agentName: i });
      } else {
        let s = V6e?.();
        if (s?.teamName && s?.agentId && s?.agentName)
          await inl(e, kt(), { teamName: s.teamName, agentId: s.agentId, agentName: s.agentName });
      }
    })();
  }, [e, t, r]);
}

// READABLE (for understanding):
function useTeammateInitialization(setAppState, cliArgs, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    (async () => {
      if (!agentTeamsEnabled()) return;
      let arg0 = cliArgs?.[0],
        teamName = arg0 && "teamName" in arg0 ? arg0.teamName : undefined,
        agentName = arg0 && "agentName" in arg0 ? arg0.agentName : undefined;
      if (teamName && agentName) {
        await initTeamContextFromSession(setAppState, teamName, agentName);
        let member = (await readTeamFile(teamName))?.members.find((m) => m.name === agentName);
        if (member) await initializeTeammateSession(setAppState, getSessionId(),
                                                    { teamName, agentId: member.agentId, agentName });
      } else { /* same via the ambient teammate snapshot */ }
    })();
  }, [setAppState, cliArgs, enabled]);          // NO cleanup function
}

// Mapping: RKf→useTeammateInitialization, inl→initializeTeammateSession,
//          kKf→initTeamContextFromSession, JL→readTeamFile, mc→agentTeamsEnabled, kt→getSessionId
```

### The bug, fully stated

**What it does (the bug):** the leader receives N idle notifications for one teammate stop, where N is
the number of times the init effect has run in that session.

**How it works:**
1. The effect's dependency array is `[setAppState, cliArgs, enabled]`. `cliArgs` is an array-typed prop
   compared by reference; any parent re-render that produces a fresh array re-runs the effect.
2. **The effect has no cleanup function.** Nothing ever removes the previously registered `Stop` hook —
   `Tas` (`removeSessionHook`, `:215762`) exists but is not called here.
3. So in 2.1.193 the hook array for `Stop` / matcher `""` grew by one entry per re-run, each with a
   unique random id, each closing over its own `leadName` snapshot.
4. On stop, the hook runner executed **all** of them → N `writeToMailbox` calls → N
   `idle_notification` entries in the lead's inbox → the lead announced the same teammate idle N times.
5. The existing `Skipping duplicate idle notification` guard could not help: it lives in the *in-process
   runner* and de-duplicates against the task's `isIdle` flag; it has no visibility into how many hooks
   the *pane* session registered.

**Why the chosen fix is right:** adding an `id` makes registration **idempotent** at the data-structure
level, so it is correct no matter how many times the effect runs and no matter whether a cleanup ever
lands. Adding a cleanup function instead would have fixed the symptom but introduced a
registration/unregistration race on every re-render — and would have silently regressed if a future
refactor moved the call.

**Key insight:** this is the single cheapest fix in the entire agent-team delta — **one object
property** — and it is invisible to every string-count heuristic except the id literal itself. It is
also the clearest illustration of `_CONVENTIONS.md` trap #7 in this theme: everything *around* it
(`Skipping duplicate idle notification`, `function-hook-`, the whole `.with()` replace path) counts
1/1.

---

## 4. `/model` and `/fast` inside an agent view (`.199`)

> *Fixed typing `/model` or `/fast` while viewing a subagent silently opening the lead's model picker —
> a notice now explains the command applies to the lead*

New gate: **`tengu_agent_view_leader_command_notice`, 220=1 / 193=0** (`:753903`) — it is in the 324
new-gate list of [`../00_overview/_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md).

### 4.1 The routing decision

`getInputRouting` (`lfn`, `:514598-514603`) classifies where typed input should go:

```javascript
function lfn(e) {
  let { teammate: t, localAgent: r } = f2o(e.viewingAgentTaskId, e.tasks);
  if (t) return { type: "viewed", task: t };          // viewing a TEAM teammate
  if (r) return { type: "named_agent", task: r };     // viewing a plain subagent
  return { type: "leader" };                          // normal session
}
```

The submit handler then branches (`:753892-753913`). In **2.1.193** (`:635319-635328 (193)`):

```javascript
let Kn = Z8t(tt.getState());
if (Kn.type !== "leader" && F) {
  let pr = aPe(Ot), Qr = pr && jE(pr.commandName, s);
  if (!(Qr?.type === "local" || Qr?.type === "local-jsx")) {
    (V("tengu_transcript_input_to_teammate", {}),
      await F(Ot, Kn.task, { setCursorOffset: Ne, clearBuffer: $u, resetHistory: () => {} }));
    return;
  }
}
// ...falls through to the NORMAL submit path
await U(Ot, {...}, void 0, zn);
```

Read the negation carefully: *plain text and non-local commands* are forwarded to the viewed agent, but
a `local` / `local-jsx` command **falls through the `if` entirely** and is executed by the *host*
session. `/model` and `/fast` are exactly such commands. So typing `/model` while watching a teammate
opened the **lead's** model picker, with no indication that the teammate was not the target. That is
the bug, and it is a *carve-out working as designed for the wrong case*: the carve-out exists so that
`/help`, `/clear`, `/config` etc. remain usable while an agent view is open.

### 4.2 The fix

```javascript
// ============================================
// buildLeaderCommandNotice - explains that /model and /fast target the lead, not the viewed agent
// Location: cli_inner_pretty.js:748982-748998
// ============================================

// ORIGINAL (for source lookup):
function qWf(e, { isTeammate: t }) {
  let r = t ? "the team lead" : "the main conversation",
    n = t ? "teammate" : "agent",
    o = e.name,
    i;
  switch (o) {
    case "model": i = "model"; break;
    case "fast":  i = "fast mode"; break;
    default: return;
  }
  return `/${o} changes ${r}'s ${i}, not this ${n}'s`;
}

// READABLE (for understanding):
function buildLeaderCommandNotice(command, { isTeammate }) {
  let ownerLabel  = isTeammate ? "the team lead" : "the main conversation",
      subjectLabel = isTeammate ? "teammate" : "agent",
      settingLabel;
  switch (command.name) {
    case "model": settingLabel = "model"; break;
    case "fast":  settingLabel = "fast mode"; break;
    default: return undefined;                        // every other local command still runs
  }
  return `/${command.name} changes ${ownerLabel}'s ${settingLabel}, not this ${subjectLabel}'s`;
}

// Mapping: qWf→buildLeaderCommandNotice
```

and its call site (`:753901-753912`):

```javascript
let qF = w$ && qWf(w$, { isTeammate: Bv.type === "viewed" });
if (qF) {
  (O("tengu_agent_view_leader_command_notice", {}),
    $d({ key: "agent-view-command-notice", kind: "feedback", text: qF,
         priority: "immediate", timeoutMs: 8000 }));
  return;                                            // command is NOT executed
}
```

`agent-view-command-notice` is **220=1 / 193=0**.

### Design notes

1. **It is an allow-list of two, not a block-list.** `default: return` means every other local command
   keeps its 193 behaviour. The maintainers fixed the two commands whose *effect is invisible and
   mis-attributable* (a model change shows up nowhere in the agent view) and left the rest alone. A
   block-list would have needed auditing all ~130 commands.
2. **The wording is computed from the routing type, not hardcoded.** `Bv.type === "viewed"` selects
   "the team lead"/"teammate"; `named_agent` selects "the main conversation"/"agent". One function
   serves both the agent-team case and the plain-subagent case, which is why the same fix silently
   covers subagents that are not teammates at all.
3. **`return` before executing.** The command is *cancelled*, not redirected. Redirecting `/model` to
   the teammate would need per-teammate model state that does not exist (a teammate's model is fixed at
   spawn via `--model`, `:397208`). Explaining is the only honest option.
4. `priority: "immediate"` with `timeoutMs: 8000` puts it in the same notification lane as other
   blocking feedback, so it cannot be scrolled past unseen.

**Related but separate:** `.209`'s `tengu_slash_command_unavailable` with
`reason: "unavailable_in_agent_view"` (`:806776`, `:806788`) is a *different*, later mechanism owned by
[`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md).
`.199` explains; `.209` refuses. Do not conflate the two.

---

## 5. Agent names may not contain `:` (`.218`)

> *Changed agent markdown files to reject agent names containing `:`, which is reserved for plugin
> namespacing*

**Delta proof:** `reserved for plugin namespacing` **220=2 / 193=0**; `plugin namespacing` **220=2 /
193=0**.

> **Correction to the scoping data.** [`../00_overview/_scope_v215_220.md`](../00_overview/_scope_v215_220.md)
> row 33 and the [`_false_delta_ledger`](../00_overview/_false_delta_ledger.md) `agent_team` row both
> record this anchor as **220=3 / 193=1**. Re-measured in both bundles it is **220=2 / 193=0**. The
> 193 hit those agents saw was almost certainly `Marketplace name "skills-dir" is reserved for plugins
> auto-loaded from .claude/skills/` at `:54952 (193)`, a different string. The bullet is therefore a
> *cleaner* net-new than the ledger implies.

The check appears at exactly two of the three name-validation sites:

| Site | Function | Path | Has colon check? |
|---|---|---|---|
| `:269870-269872` | `explainAgentFrontmatterError` (`$hy`) | markdown frontmatter, error explainer | **yes** (`:269872`) |
| `:269888` | `parseJsonAgentDefinition` (`XWu`) | agents supplied via `flagSettings`/JSON | **no** |
| `:269951-269959` | `parseAgentMarkdownFile` (`JWu`) | `.claude/agents/*.md` loader | **yes** (`:269957`) |

```javascript
// ============================================
// parseAgentMarkdownFile (name guard) - rejects ':' in an agent name after NFKC normalisation
// Location: cli_inner_pretty.js:269949-269960
// ============================================

// ORIGINAL (for source lookup):
    if (i.startsWith("-"))
      return (w(`Agent file ${N9e(e)} has invalid name '${N9e(i)}': names must not start with '-'`,
                { level: "error" }), null);
    if (i.normalize("NFKC").includes(":"))
      return (w(`Agent file ${N9e(e)} has invalid name '${N9e(i)}': names must not contain ':' (reserved for plugin namespacing)`,
                { level: "error" }), null);

// READABLE (for understanding):
    if (name.startsWith("-"))                                    // carryover (193: :481302)
      { error(`Agent file ${sanitize(path)} has invalid name '${sanitize(name)}': names must not start with '-'`); return null; }
    if (name.normalize("NFKC").includes(":"))                    // NET-NEW in 2.1.220
      { error(`Agent file ${sanitize(path)} has invalid name '${sanitize(name)}': names must not contain ':' (reserved for plugin namespacing)`); return null; }

// Mapping: JWu→parseAgentMarkdownFile, N9e→sanitizeForLog, w→error
```

### Why `normalize("NFKC")` and not `includes(":")`

**What it does:** normalises the name to NFKC *before* the substring test, so visually-identical
Unicode look-alikes are caught.

**How it works:** NFKC applies compatibility decomposition. `U+FF1A FULLWIDTH COLON` (`：`),
`U+FE55 SMALL COLON` (`﹕`) and `U+2236 RATIO` (`∶`, via its compatibility mapping) all fold onto ASCII
`:`. A bare `includes(":")` would pass all of them.

**Why it matters:** `:` is the plugin-namespace separator (`plugin:agent`). An agent whose name is
`evil：thing` would be stored with a fullwidth colon but could be **rendered indistinguishably** from
`evil:thing` in every UI surface and every prompt, and any downstream code that normalises before
splitting would then attribute it to the `evil` plugin. This is a homoglyph/namespace-confusion guard,
which is why the ledger files it under `agent_team (sec: skills_plugins)`. The `-` check on the line
above is *not* NFKC-normalised — a leading `-` is an argv-injection concern where the byte, not the
glyph, is what matters. The asymmetry is deliberate and correct.

**Note on the JSON path:** `XWu` (`:269885-269889`) validates the leading `-` but **not** the colon.
Agents delivered through `flagSettings` / `policySettings` JSON can therefore still carry a colon in
2.1.220. Whether that is intentional (those sources are already trusted/managed) or an oversight cannot
be settled from the bundle; it is recorded here as an observation, not a claim.

---

## 6. `SendMessage` token reduction (`.212`) — one half proven, one half not

> *Reduced token usage in inter-agent messaging: `SendMessage` bodies are no longer duplicated into
> replayed history and tool results*

### 6.1 Tool results — PROVEN

```javascript
// ============================================
// sendMessageToTeammate (result payload) - the tool result now carries a 50-char preview
// Location: cli_inner_pretty.js:418057-418069
// ============================================

// ORIGINAL (for source lookup):
  let c = FIo(n), u = bL(),
    d = await VT(l, { from: c, text: t, summary: r, timestamp: new Date().toISOString(), color: u }, a);
  OMs(n.getAppState().tasks, l, a);
  let p = J7y(s, l);
  return {
    data: {
      success: !0,
      message: `Message sent to ${e}'s inbox`,
      msg_id: d,
      routing: { sender: c, senderColor: u, target: `@${e}`, targetColor: p, summary: r, content: oa(t, 50) },
    },
  };

// READABLE (for understanding):
  let senderName = getSelfDisplayName(ctx), senderColor = getMyInkColor(),
    msgId = await writeToMailbox(resolvedName,
      { from: senderName, text: body, summary, timestamp: new Date().toISOString(), color: senderColor }, teamName);
  wakeRunningTeammate(ctx.getAppState().tasks, resolvedName, teamName);
  let targetColor = lookupMemberColor(roster, resolvedName);
  return { data: {
      success: true,
      message: `Message sent to ${requestedName}'s inbox`,
      msg_id: msgId,                                          // NET-NEW
      routing: { sender: senderName, senderColor, target: `@${requestedName}`, targetColor,
                 summary, content: truncate(body, 50) },      // 193 sent the FULL body here
  }};

// Mapping: VT→writeToMailbox, OMs→wakeRunningTeammate, oa→truncate (:160403),
//          FIo→getSelfDisplayName, bL→getMyInkColor, J7y→lookupMemberColor
```

The 2.1.193 twin (`:441873-441882 (193)`) ends with
`routing: { sender: i, senderColor: a, target: \`@${e}\`, targetColor: l, summary: n, content: t }` —
**`content: t` is the entire message body**, echoed straight back into the sender's own transcript as a
tool result, immediately after the same body appeared in the `tool_use` block. Every teammate DM cost
roughly twice its tokens on the sender side. `oa(body, 50)` (`:160403`) collapses that to a preview:
it returns the string unchanged when its *display width* is ≤ 50 (`Ft(n) <= t`, `:160413`) and
grapheme-safely truncates otherwise (`gi`, `:160414`) — width, not `String.length`, so CJK and emoji
bodies are cut at the same visual size.

`SendMessage` is 220=47 / 193=38 overall, but that 9-site growth is mostly the new roster-pinning and
peer-address machinery — see [`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md)
for `send_message_pin_guard` (`.199`). The token bullet lives entirely in this one expression.

### 6.2 "Replayed history" — NOT anchored; two plausible anchors ruled out

I could not pin the second half, and both obvious candidates are **carryover**:

- **The resume-replay cap.** `if (_) for (let ee of _.slice(-uAo)) ne = upt(ne, ee)` (`:396528`) with
  `uAo = 50` (`:324398`). 193 has `if (h) for (let X of h.slice(-gWn)) K = iDe(K, X)` (`:427928 (193)`)
  with `gWn = 50` (`:365003 (193)`). Identical cap, identical shape. `resumeMessages` is 220=2 / 193=2.
- **The uuid-dedupe on transcript append.** `vid` (`:324394-324397`) is byte-identical to `EVa`
  (`:364999-365002 (193)`).
- **The `teammate_mailbox` attachment generator.** `nF_` (`:517955-517958`, called at `:516655`) is
  `async function nF_(e) { if (!mc()) return []; return []; }` — a stub. Tempting to read as "the
  duplication was removed by gutting this". It is **not**: 193's `Wuf` (`:474489-474492 (193)`) is the
  *same stub*. Both builds ship a dead attachment path.

Verdict: **implemented-and-anchored for tool results; unanchored for replayed history.** If the
history half shipped, it did so without a literal, a constant change, or a gate.

---

## 7. Undocumented: the headless team-teardown park

No changelog bullet mentions this. New gate `tengu_headless_team_teardown_park_timeout` (`:846516`) and
new env var `CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS` (**220=2 / 193=0**; accessor `:32054`, read
`:844848`).

```javascript
// ============================================
// getTeamTeardownParkTimeoutMs - how long headless mode waits for teammates before tearing down
// Location: cli_inner_pretty.js:844847-844849
// ============================================

// ORIGINAL (for source lookup):
function xkm() { return Z.CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS ?? 1e4; }

// READABLE (for understanding):
function getTeamTeardownParkTimeoutMs() { return env.CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS ?? 10_000; }

// Mapping: xkm→getTeamTeardownParkTimeoutMs, Z→managed env proxy
```

The park loop (`:846498-846522`) waits in 500 ms ticks until every teammate has settled, and on
expiry logs a census before giving up:

```javascript
w(`[print.ts] Team teardown park gave up after ${xkm()}ms (shutdown prompt injected: ${P}) with `
  + `${Object.keys(po.teamContext?.teammates ?? {}).length} roster teammate(s) and `
  + `${pr(Object.values(po.tasks), (fi) => fi.type === "in_process_teammate" && fi.status === "running")} `
  + `in-process teammate task(s) still active; tearing down anyway`);
O("tengu_headless_team_teardown_park_timeout", { prompt_injected: P });
```

Two design points worth recording:

- **The default is 10 s and the override is an env var, not a setting.** Unlike the subagent budget
  caps (which are plain constants) and the spawn-depth cap (which is gate-backed — see
  [`../53_subagent_limits/spawn_depth_gate.md`](../53_subagent_limits/spawn_depth_gate.md)), this one
  is env-only with no gate. That is consistent with it being a CI/automation knob rather than a
  product default anyone expects to tune remotely.
- **The telemetry field is `prompt_injected`, not a duration.** The question being answered is not "how
  long did we wait" but "did we already ask the teammates to shut down before we gave up" — i.e. is
  this a *teammate* bug or a *teardown-ordering* bug. Emitting the census only to the debug log and the
  boolean to telemetry is a deliberate PII/cardinality split, the same discipline as
  `TelemetrySafeError` in the mailbox layer.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [`symbol_additions_v2_1_220_agent_team.md`](../00_overview/symbol_additions_v2_1_220_agent_team.md).

Key functions in this document:
- `classifyTurnApiFailure` (`BMs`, `:530513`) - **net-new**; `{reason, errorKind, isTransient}` or `undefined`
- `getTurnFailureReason` (`olp`, `:530510`) - **net-new**; thin `?.reason` wrapper
- `extractAssistantText` (`ite`, `:532102`) - joins text blocks of an assistant message
- `USER_INTERRUPT_TEXTS` (`_mt`, `:534126`) - 5-member suppression set of user-caused endings
- `makeApiErrorMessage` (`_u`, `:530704`) - stamps `isApiErrorMessage` / `apiErrorIsTransient`
- `runInProcessTeammate` (`H8y`, `:396406`) - the in-process teammate driver
- `waitForNextTeammateInput` (`k8y`, `:396353`) - 500 ms poll loop; 8th arg `holdEvict` is net-new
- `drainMailbox` (`Yvd`, `:396288`) - shutdown-first drain, also called at turn end (`:396694`)
- `sendIdleNotificationToLead` (`zvd`, `:396246`) - wraps `createIdleNotification` + `writeToMailbox`
- `notifyLeaderOfFailedTurn` (`HKf`, `:759398`) - **net-new**; pane-teammate failure reporter
- `initializeTeammateSession` (`inl`, `:759343`) - registers the `Stop` idle hook (now with a stable id)
- `useTeammateInitialization` (`RKf`, `:759430`) - the effect that could re-run init
- `addSessionFunctionHook` (`FCu`, `:215736`) - id-or-random hook registration
- `addSessionHook` (`BCu`, `:215741`) - replace-by-id / append; carryover (193 `KQa` `:397131`)
- `wakeRunningTeammate` (`OMs`, `:396079`) - **net-new**; emits `retryWake` on a running teammate
- `sleepUntilRetryOrWake` (`Plp`, `:534800`) - **net-new**; interruptible backoff sleep
- `computeRetryDelay` (`Z2e`, `:534820`) - `min(500·2^(n-1), 32000)` + jitter, honours `retry-after`
- `createEmitter` (`Is`, `:1968`) - Set-backed `{subscribe, emit}` used for `retryWake`
- `getInputRouting` (`lfn`, `:514598`) - `leader` / `viewed` / `named_agent`
- `buildLeaderCommandNotice` (`qWf`, `:748982`) - **net-new**; the `/model` `/fast` notice text
- `parseAgentMarkdownFile` (`JWu`, `:269945`) - agent `.md` loader; NFKC colon guard at `:269957`
- `explainAgentFrontmatterError` (`$hy`, `:269867`) - frontmatter error explainer; colon arm `:269872`
- `parseJsonAgentDefinition` (`XWu`, `:269885`) - JSON agent path; **no** colon guard
- `buildTeammateSpawnFlags` (`Zvd`, `:397199`) - lost the `--teammate-mode` push
- `buildTeammateSpawnEnv` (`GMs`, `:397036`) - gained a host-managed scrub set
- `setMemberActive` (`tdr`, `:324563`) - writes `isActive` into the team roster file
- `findTaskByAgentId` (`EKe`, `:395949`) - prefers a `running` task for an agent id
- `makeAgentId` (`zCe`, `:111476`) - `` `${name}@${team}` ``
- `teammateMailboxAttachment` (`nF_`, `:517955`) - stub returning `[]`; **carryover stub**, not a removal
- `getTeamTeardownParkTimeoutMs` (`xkm`, `:844847`) - **net-new**; 10 s default
