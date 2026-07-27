# Background agents part 1 — worker respawn, upgrade, revival guards and adoption

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`).
> Every bare `cli_inner_pretty.js:<line>` is a **2.1.220** line I read; baseline lines are
> tagged `(193)`. Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](./README.md).

---

## 0. The object under discussion

`class mme` at `cli_inner_pretty.js:553515-554817` is the **BackgroundWorker** handle: one
instance per background session, owned by the daemon's manager map. It has a five-state phase
machine, four independent respawn triggers, three "do not respawn" guards, and two auth-rekey
paths. Everything in this document lives in or around it.

### 0.1 The phase machine

`phase: { kind: "spawning" | "running" | "upgrading" | "retiring" | "retired" }` (`:553559`),
with a legality table and a rejecting transition function:

```javascript
function Eq_(e, t) {                        // :553500-553513
  if (e.kind === "retired") return !1;      // terminal
  switch (t.kind) {
    case "spawning":  return e.kind === "upgrading" || e.kind === "running";
    case "running":   return e.kind === "spawning";
    case "upgrading": return e.kind === "running";
    case "retiring":  return !0;
    case "retired":   return !0;
  }
}
transitionTo(e) {                           // :553618-553628
  if (!Eq_(this.phase, e)) { w(`[bg] illegal worker-phase transition …`); O("tengu_bg_phase_illegal", {}); return !1; }
  return ((this.phase = e), !0);
}
```

**Why a table plus a boolean return, rather than throwing?** Every caller is a *race* — a sweep
tick, an attach, a control-socket `kill`, a pty exit — and they all legitimately arrive
concurrently. `transitionTo` returning `false` is the concurrency primitive: whoever wins the
transition proceeds, everyone else gets `{ respawned: false, reason: "in-progress" }` and does
nothing. Throwing would require every one of those ~10 call sites to have a catch that did
exactly the same thing. Note that `upgrading` is reachable only from `running` — you cannot
upgrade a worker that is still booting, which is what keeps a crash-loop from colliding with an
upgrade wave.

### 0.2 The constants, and why they are the numbers they are

| Constant | Symbol | Value | Line | Purpose |
|---|---|---|---|---|
| `RESPAWN_BACKOFF_MS` | `uq_` | 10 000 | `:554822` | flat delay before every respawn |
| `MAX_RESPAWN_ATTEMPTS` | `Mhp` | 20 | `:554823` | hard ceiling → `tengu_bg_respawn_exhausted` |
| `RESUME_AFTER_CRASH_PROMPT` | `pq_` | (text) | `:554825-554826` | injected as `CLAUDE_CODE_RESUME_PROMPT` |
| `RESUME_INTERRUPTED_TURN_MAX_AGE_MS` | `fq_` | 3 600 000 | `:554827` | 1 h staleness cut-off for turn replay |
| `MAX_AUTH_REKEYS` | `mq_` | 3 | `:554828` | rekey-respawn ceiling |
| `FAST_CRASH_WINDOW_MS` | `$hp` | 5 000 | `:554829` | "died right after spawn" |
| `LONG_RUN_RESET_MS` | `hq_` | 300 000 | `:554830` | ran 5 min → reset attempt counter |
| `HOST_WAKE_GRACE_MS` | `gq_` | 60 000 | `:554831` | suppress crash accounting after a sleep |
| `PID_POLL_INTERVAL_MS` | `u7s` | 5 000 | `:554833` | liveness poll |
| `SLEEP_DETECT_THRESHOLD_MS` | `Nhp` | `u7s * 3` = 15 000 | `:554834`, `:554885` | poll gap ⇒ host slept |
| `ADOPT_GRACE_MS` | `Fhp` | 120 000 | `:554836` | do not touch a just-adopted worker |
| `EMPTY_IDLE_GRACE_MS` | `_q_` | 300 000 | `:554837` | reap never-used sessions |
| `RECENT_INPUT_WINDOW_MS` | `bq_` | 3 600 000 | `:554839` | "a human typed here recently" |
| `DISPATCH_STRING_CAP` | `Bhp` | 4 096 | `:554840` | roster string truncation |
| `EXTERNAL_STOP_EXIT_CODES` | `dq_` | `{129, 143}` | `:554884` | 128+SIGHUP, 128+SIGTERM |

`FAST_CRASH_WINDOW_MS = 5000` paired with a streak of 3 (`:554544`) means "three deaths inside
five seconds each" — long enough that a genuinely slow-starting worker on a loaded machine is
not condemned, short enough that a config error is caught in ~30 s of wall clock rather than
`20 × 10 s = 200 s`. `LONG_RUN_RESET_MS = 300000` is the counterpart: a worker that survived
five minutes has demonstrably *worked*, so its next crash is a fresh incident and the attempt
counter goes back to 1 (`:554651`). Without that reset, a session alive for a week would
eventually exhaust its 20 attempts on unrelated crashes.

`SLEEP_DETECT_THRESHOLD_MS = 3 × PID_POLL_INTERVAL_MS` is the classic "missed three heartbeats"
rule: one missed tick is scheduler jitter, three is a suspended process.

---

## 1. `respawnIfIdleStale` — in-background upgrade after a CLI update

This is the function that implements `.206` #6 (*"Background agents upgrade in the background
right after an update"*) and `.208` #8 (*"Attach failing permanently after an update replaced the
running binary"*), and it is where the two new refusals live.

```javascript
// ============================================
// respawnIfIdleStale - restart a version-stale worker on the current binary, if it is safe
// Location: cli_inner_pretty.js:553653-553717
// ============================================

// ORIGINAL (for source lookup):
async respawnIfIdleStale(e, t = "sweep") {
  if (this.dispatch.launch.mode === "exec") return { respawned: !1, reason: "not-stale" };
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.record.cliVersion && mhn(this.record.cliVersion, { … VERSION: "2.1.220" … }.VERSION))
    return (this.noteDowngradeRefused(t), { respawned: !1, reason: "not-stale" });
  if (iSr(this.record.cliVersion, { … VERSION: "2.1.220" … }.VERSION)) return { respawned: !1, reason: "not-stale" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (!this.isVersionStale) return { respawned: !1, reason: "not-stale" };
  if (t !== "attach" && this.lastInputAt && Date.now() - this.lastInputAt < bq_) return { respawned: !1, reason: "busy" };
  let r = Date.now(), n = await Da(rc(this.dispatch.short));
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (this.lastInputAt && this.lastInputAt >= r) return { respawned: !1, reason: "busy" };
  if (!n) return { respawned: !1, reason: "no-state" };
  if (t !== "attach" && !dm(n) && this.adoptedAt && Date.now() - this.adoptedAt < Fhp) return { respawned: !1, reason: "busy" };
  if (dm(n) && t === "sweep" && !e?.has(this.dispatch.short)) return { respawned: !1, reason: "settled" };
  if (!dm(n) && n.tempo !== "idle") return { respawned: !1, reason: "busy" };
  if (h7s(n)) return { respawned: !1, reason: "inflight" };
  if (!this.transitionTo({ kind: "upgrading" })) return { respawned: !1, reason: "in-progress" };
  return (this.onState.emit({ pid: this.record.pid }),
    O("tengu_bg_respawn_stale", { short: A6(this.dispatch.short), rvSent: this.shutdownWorker(), trigger: fe(t), worker_cli_version: Nm(this.record.cliVersion) }),
    { respawned: !0 });
}

// READABLE (for understanding):
async respawnIfIdleStale(pinnedShorts, trigger = "sweep") {
  // --- phase A: cheap, synchronous refusals -------------------------------------------
  if (this.dispatch.launch.mode === "exec")   return refuse("not-stale");   // exec workers are never respawned
  if (this.isTransitioning)                   return refuse("in-progress");
  if (this.record.outcome)                    return refuse("no-state");    // already settled
  if (this.record.cliVersion && isNewerBuild(this.record.cliVersion, MY_VERSION)) {
    this.noteDowngradeRefused(trigger);                                      // .208 #40
    return refuse("not-stale");
  }
  if (channelsDiffer(this.record.cliVersion, MY_VERSION)) return refuse("not-stale"); // dev vs engine
  if (this.attachers.size > 0)                return refuse("attached");     // someone is watching
  if (!this.isVersionStale)                   return refuse("not-stale");
  if (trigger !== "attach" && withinRecentInput(this.lastInputAt, RECENT_INPUT_WINDOW_MS))
    return refuse("busy");                                                   // a human typed here in the last hour

  // --- phase B: read the session state from disk (the only await) ----------------------
  const beforeRead = Date.now();
  const state = await readJobState(jobDir(this.dispatch.short));

  // --- phase C: re-check EVERYTHING that could have changed during the await -----------
  if (this.isTransitioning)                   return refuse("in-progress");
  if (this.record.outcome)                    return refuse("no-state");
  if (this.attachers.size > 0)                return refuse("attached");
  if (this.lastInputAt && this.lastInputAt >= beforeRead) return refuse("busy");
  if (!state)                                 return refuse("no-state");
  if (trigger !== "attach" && !isSettled(state) && withinRecentInput(this.adoptedAt, ADOPT_GRACE_MS))
    return refuse("busy");
  if (isSettled(state) && trigger === "sweep" && !pinnedShorts?.has(this.dispatch.short))
    return refuse("settled");                                                // settled + unpinned: leave for the reaper
  if (!isSettled(state) && state.tempo !== "idle")  return refuse("busy");   // mid-turn
  if (hasNonResumableInFlight(state))               return refuse("inflight");

  // --- phase D: commit --------------------------------------------------------------
  if (!this.transitionTo({ kind: "upgrading" }))     return refuse("in-progress");
  this.onState.emit({ pid: this.record.pid });
  emitTelemetry("tengu_bg_respawn_stale", { …, rvSent: this.shutdownWorker(), trigger });
  return { respawned: true };
}

// Mapping: mhn→isNewerBuild, iSr→channelsDiffer, dm→isSettled, h7s→hasNonResumableInFlight,
//          Da→readJobState, rc→jobDir, bq_→RECENT_INPUT_WINDOW_MS, Fhp→ADOPT_GRACE_MS,
//          e→pinnedShorts, t→trigger, n→state, r→beforeRead
```

**How it works, and why the order is what it is:**

1. **Phase A is deliberately await-free.** The sweep calls this once per worker per minute
   (`:869767`, `:869790-869836`); with dozens of workers, doing a disk read before the cheap
   refusals would multiply I/O by the fleet size for no benefit.
2. **`exec` first.** An `exec`-mode worker is a one-shot shell command with no `--resume`
   semantics; restarting it would re-run the command. Nothing else in the function is meaningful
   for it, so it exits immediately.
3. **Downgrade refusal before staleness.** `isVersionStale` is merely "cliVersion !== mine", so
   it is true for *both* newer and older workers. Checking `isNewerBuild` first is what makes the
   difference between "upgrade this worker" and "do not drag it backwards". Getting this order
   wrong is precisely the `.208` #40 bug.
4. **`attachers.size > 0` before the state read.** Restarting a worker somebody is looking at
   blanks their screen. The `trigger !== "attach"` carve-outs exist because the *attach* path
   deliberately wants to upgrade before showing the session — that is `.208` #8.
5. **Phase C re-checks all four racy predicates.** `await readJobState` yields the event loop;
   in that window an attacher can arrive, the user can type, the worker can exit, or another
   trigger can claim the transition. The `lastInputAt >= beforeRead` comparison is the neat one:
   it detects input that arrived *during* the read without needing a lock.
6. **`settled && sweep && !pinned` → leave it alone.** A finished session does not need the new
   binary; `retireIfSettled` will reap it. Pinned sessions are the exception because the user has
   said "keep this", so it is worth upgrading in place.
7. **Commit is `transitionTo` + `shutdownWorker`.** The worker is asked to exit cleanly over the
   rendezvous socket (`rvSent`), and the actual respawn happens in `onExit` (§3.2) — the
   `upgrading` phase is the baton.

**Key insight:** the function never spawns anything. It only moves the worker into `upgrading`
and asks it to die. The respawn is the exit handler's job. That inversion is what makes the
17-guard gauntlet safe to run from four different triggers (`"sweep"`, `"attach"`, `"prewarm"`,
`"burst"`) concurrently.

### 1.1 The downgrade refusal (`.208` #40)

```javascript
noteDowngradeRefused(e) {                      // :553644-553652
  if (this.downgradeRefusalLogged || !this.record.cliVersion) return;
  ((this.downgradeRefusalLogged = !0),
    O("tengu_bg_respawn_downgrade_refused", {
      short: A6(this.dispatch.short), trigger: fe(e), worker_cli_version: Nm(this.record.cliVersion) }));
}
```

`tengu_bg_respawn_downgrade_refused` is **220=2 / 193=0** (`:537419` allow-list, emitter
`:553647`). The `downgradeRefusalLogged` latch means one event per worker lifetime — the sweep
would otherwise emit it every 60 s forever for a permanently-downgraded install.

The same refusal is repeated at the **prewarm** call site (`:869815-869833`) rather than relying
on the one inside `respawnIfIdleStale`, because prewarm wants to `continue` to the next candidate
without consuming a concurrency slot.

### 1.2 The channel-mismatch refusal

`channelsDiffer` (`iSr`) at `:553675` and `:869800`, and again in the adopt path at `:554043`.
A `dev` worker is never restarted onto an `engine` binary or vice versa, even if the timestamps
say the target is newer. See [`daemon_lifecycle.md`](./daemon_lifecycle.md) §2.1 for the
comparator.

---

## 2. Prewarm: per-sweep trickle (carryover) vs post-takeover burst (NET-NEW)

Two distinct mechanisms, and the changelog blurs them.

**Per-sweep trickle — CARRYOVER.** `tengu_bg_prewarm_per_sweep` is **220=1 / 193=1**
(`:869788`). Each sweep tick upgrades at most `3` stale workers and scans at most `12`
candidates:

```javascript
let ne = Ke("tengu_bg_prewarm_per_sweep", 3), ee = 12;    // :869788-869789
for (let te of G.values()) {
  if (ne <= 0 || ee <= 0) break;
  if (oe.has(te.dispatch.short)) continue;     // pinned: handled separately
  if (te.isBooting) { ne--; continue; }        // already coming up: consumes a slot
  if (!te.isVersionStale) continue;
  if (te.dispatch.launch.mode === "exec") continue;
  … channel / downgrade refusals … ;
  if ((await te.respawnIfIdleStale(void 0, "prewarm") …).respawned) ne--; else ee--;
}
```

Note the two-budget design: a *success* spends the concurrency budget `ne`, a *refusal* spends
the scan budget `ee`. So a fleet of 200 workers that are all busy costs at most 12 disk reads per
tick, while a fleet with 3 upgradable workers upgrades all 3.

**Post-takeover burst — NET-NEW.** `tengu_bg_prewarm_burst` **220=4 / 193=0**,
`tengu_bg_prewarm_burst_concurrency` **220=1 / 193=0**,
`tengu_bg_prewarm_burst_delay_ms` **220=1 / 193=0** (`:869844`, `:869846`, `:869898`).
This runs **once**, right after a new binary has adopted the fleet (`F()` is fired at `:869737`):

```javascript
async function F() {                                                 // :869843-869908
  let G = Ke("tengu_bg_prewarm_burst_delay_ms", 15000);
  await vr(G, void 0, { unref: !0 });                                // let the daemon settle first
  let j = Ke("tengu_bg_prewarm_burst_concurrency", 3);
  if (j <= 0 || !r7s() || c) return;                                 // gate off / attach-upgrade off / closing
  let z = await qvl(),                                               // pinned set
    V = new Set([...o.values()].filter((te) =>
      !te.record.outcome && !te.isUnverified && te.isVersionStale &&
      te.dispatch.launch.mode !== "exec" && !z.has(te.dispatch.short)));
  …
  let ee = Y + pSE;                                                  // deadline: 5 min (:870135)
  while (V.size > 0 && Date.now() < ee && !c) {
    if (Date.now() - E > d$n * 2) { ne = !0; break; }                 // sweep anchor stale -> host slept
    if (o7e()) { se = !0; break; }                                    // low memory -> stop
    let te = j - pr([...o.values()], (de) => de.isBooting && !de.isUnverified);
    for (let de of V) { if (te <= 0) break; … }
    if (V.size === 0) break;
    await vr(dSE, void 0, { unref: !0 });                             // 2 s between rounds (:870134)
  }
  O("tengu_bg_prewarm_burst", { candidates, respawned, refused, alreadyBooting, remaining,
                                lowMemStop, sweepStaleStop, durationMs });
}
```

Four things make it a *burst* rather than a flood:

1. **A 15 s opening delay.** The new daemon has just adopted the fleet, rewritten the roster and
   started its control socket. Spawning N workers in that same window would compete with all of
   it. All three tuning knobs are remote gate values so the delay/concurrency can be changed
   without a release.
2. **Concurrency measured, not counted.** `j - (number currently booting)` is recomputed each
   round from the live handle set, so workers that are booting for *other* reasons (a fresh
   dispatch, a crash respawn) also throttle the burst.
3. **Two abort conditions with distinct telemetry.** `lowMemStop` (`isLowMemory()` went true) and
   `sweepStaleStop` (the sweep clock anchor `E` is more than two intervals behind → the host
   slept mid-burst). Both leave `remaining` in the event so the tail is visible; the ordinary
   per-sweep trickle finishes the job.
4. **A 5-minute deadline.** Past that, whatever is left is not worth holding a burst loop open
   for.

The human-readable log at `:869891-869897` is a good example of the codebase's diagnostic style:

> `bg: post-takeover prewarm burst — respawned 7/23 stale workers, 4 refused, stopped on low
> memory (12 left) in 41s`

---

## 3. Crash accounting and the respawn decision

### 3.1 `onExit` — one function, nine outcomes

`onExit(code, signal, stderrTail)` at `:554535-554653`. The computed flags, in order:

```javascript
let n = this.lastSpawnAt ? Date.now() - this.lastSpawnAt : void 0;         // process uptime
if (Date.now() - this.lastCheckPidAt > Nhp) this.hostWokeAt = Date.now();  // :554539 sleep detect
let o = this.hostWokeAt !== void 0 && Date.now() - this.hostWokeAt < gq_,  // in the wake grace
  i = !o && n !== void 0 && n < $hp && e !== 0;                            // a "fast crash"
if (i) this.fastCrashStreak++; else this.fastCrashStreak = 0;
let s = this.fastCrashStreak >= 3,                                         // crash loop
  a = this.workerReady && n !== void 0 && n >= hq_;                        // ran long enough to reset
this.lastExitExternalStop = (t !== void 0 || dq_.has(e ?? -1)) && !o;      // :554546
```

**The `hostWokeAt` interlock is the important design decision.** When a laptop sleeps, every
worker's pty dies at once and they all exit non-zero within milliseconds of resume. Without `o`,
every one of them would register a fast crash, three sleeps would trip the streak, and the whole
fleet would be marked `crashed`. So:

- a pid-poll gap over 15 s sets `hostWokeAt` (both here and in `checkPid`, `:554775-554776`);
- for the next 60 s (`gq_`), fast-crash accounting is **suppressed** (`i` is forced false);
- and `lastExitExternalStop` is also suppressed (`&& !o`), because a sleep-induced SIGHUP is not
  a user pressing `claude stop`.

`EXTERNAL_STOP_EXIT_CODES = {129, 143}` (`:554884`) are `128 + SIGHUP` and `128 + SIGTERM` — the
shell convention for "killed by a signal". Combined with `signal !== undefined`, that is a
complete definition of "someone outside this process asked it to stop".

The outcome ladder (`:554567-554576`) resolves in this priority: reap → grace → upgrading
(no outcome, respawn) → launcher fork-and-exit → clean exit → exec-mode → and only then the
crash conditions `b || (!workerReady && …) || s || _ || (!a && attempt >= 20)`.

### 3.2 The `upgrading` baton

```javascript
if (this.phase.kind === "upgrading") {                       // :554594-554605
  this.transitionTo({ kind: "spawning" });
  this.attempt = 1;                                          // upgrade is not a crash
  this.fastCrashStreak = 0;
  this.lastExitCause = void 0;
  this.patch({ pid: 0, state: "starting", detail: "upgrading" });
  this.procStart = void 0;
  this.buildBridgeReattachEnvFromState().then((R) => this.doSpawn(R, !0)).catch(xe);
  return;
}
```

The counter reset is what makes an upgrade cost-free: a worker that has been upgraded ten times
still has its full 20 crash-respawn budget. `doSpawn(env, true)` — note the `true` — suppresses
the interrupted-turn replay (§4), because an upgrade is an orderly shutdown, not an interruption.
`buildBridgeReattachEnvFromState` (`:554681-554685`) re-derives the bridge/remote reattach env
from the on-disk state so a bridged session survives the restart.

### 3.3 `scheduleRespawn` and the flat 10 s backoff

```javascript
scheduleRespawn(e) {                                        // :554686-554703
  if (this.attempt >= Mhp)                                  // 20
    return (O("tengu_bg_respawn_exhausted", { … }), this.patch({ state: "crashed", detail: e }), this.settle("crashed"));
  if (this.phase.kind === "running") this.transitionTo({ kind: "spawning" });
  this.patch({ pid: 0, state: "crashed", detail: `${e}; respawning` });
  this.procStart = void 0;
  … this.backoffTimer = setTimeout(() => { … this.doSpawnUnlessSettledOnDisk() … }, uq_);   // 10 000
  this.backoffTimer.unref();
}
```

**Why a flat backoff instead of exponential?** The failure modes this recovers from are
environmental (a full disk, a momentarily-missing binary during an upgrade, a transient socket
error), not load-related — there is no thundering herd to spread out. A flat 10 s gives
`20 × 10 s ≈ 3.5 min` of total patience, which is long enough to ride out an `npm install -g`
replacing the binary and short enough that a user watching the agent view sees progress.
Exponential backoff would put the last attempts hours away, long after the user gave up.

The `; respawning` suffix on the detail string is load-bearing: the settle handler strips it
before writing a terminal state (`:869953`, `:330868`), so a crash-detail never leaks the word
"respawning" into a finished session's summary.

### 3.4 Crash-loop diagnostics

Three distinct crash messages, each naming a different cause (`:554637-554650`):

- `${I} before init${E || R}` where `R` = `" — possibly low memory — free some up and retry"`
  when `isLowMemory()` holds and there was no signal (`:554638`). `low memory` is
  **220=6 / 193=3**; this is the `.199` #10 bullet ("Bg sessions on memory-starved machines now
  indicate low memory and suggest freeing resources"), and the delta is the *worker crash*
  surface, not the dispatch-time check which pre-existed.
- `${I} within ${$hp/1000}s of spawn ×${this.fastCrashStreak}` — the crash-loop message, which
  states both the window and the streak so the log is self-explanatory.
- `${I} ×${this.attempt}` when `_` holds (same exit cause repeated) — a *deterministic* failure,
  which is condemned immediately rather than after 20 attempts. `f = sCi(rc(short))` reads an
  exit-cause breadcrumb the worker itself writes; `_ = i && !!f && f === this.lastExitCause`
  (`:554556`).

### 3.5 Working-directory loss

`settleCwdGone` (`:554674-554680`) is reached from four places: `doSpawn`'s ENOENT handler
(`:554412`), a `setcwd` exit cause with a non-directory `cwd` (`:554561-554566`, `:554636`), a
`spare_postclaim:` exit (`:554630-554635`), and a boot-time check. It emits
`tengu_bg_spawn_cwd_gone` with a `via` discriminator and writes a terminal notice ending
*"— this job cannot be respawned"*. `no_root` is **220=2 / 193=0**.

This is `.203` #13 (*"Bg agents crash-looping when their working directory was
deleted/replaced"*): before, a deleted `cwd` produced a generic spawn error and the worker
looped 20 times; now it is a permanent, self-describing settle on the first attempt. The four
`via` values exist because the loss can be discovered at four different lifecycle points and the
telemetry needs to distinguish them.

---

## 4. Respawn suppression: honouring `claude stop` and user kills

`doSpawnUnlessSettledOnDisk` is the last gate before a respawn actually happens, and it is
where `tengu_bg_respawn_suppressed` (**220=2 / 193=0**) fires:

```javascript
// ============================================
// doSpawnUnlessSettledOnDisk - re-read the session state after the backoff and abandon the respawn if it should not happen
// Location: cli_inner_pretty.js:554654-554673
// ============================================

// ORIGINAL (for source lookup):
async doSpawnUnlessSettledOnDisk() {
  let e = Ohp() ? await Da(rc(this.dispatch.short)).catch(() => { return; }) : void 0;
  if (this.record.outcome || this.phase.kind === "retiring" || this.phase.kind === "retired") return;
  if (e && dm(e) && !e.queuedPrompt) {
    O("tengu_bg_respawn_suppressed", { short: A6(this.dispatch.short), reason: Ee("settled_on_disk") });
    let t = oD(e.state);
    return this.settle(t === "success" ? "done" : t === "failure" ? "failed" : "killed");
  }
  if (e?.interactiveLineage && this.lastExitExternalStop)
    return (O("tengu_bg_respawn_suppressed", { short: A6(this.dispatch.short), reason: Ee("no_task_contract") }),
      this.patch({ state: "stopped", detail: "stopped by an external signal" }),
      this.settle("killed"));
  return this.doSpawn();
}

// READABLE (for understanding):
async doSpawnUnlessSettledOnDisk() {
  // the whole check is behind the revival-guard gate; with the gate off, `state` is undefined
  // and both suppressions are skipped -> pre-2.1.199 behaviour.
  const state = isRevivalGuardEnabled()
    ? await readJobState(jobDir(this.dispatch.short)).catch(() => undefined)
    : undefined;
  if (this.record.outcome || this.phase.kind === "retiring" || this.phase.kind === "retired") return;

  // (1) SOMETHING ELSE FINISHED THIS SESSION while we were in the 10 s backoff -
  //     e.g. `claude stop`, or the worker wrote its own terminal state before dying.
  if (state && isSettled(state) && !state.queuedPrompt) {
    emitTelemetry("tengu_bg_respawn_suppressed", { reason: "settled_on_disk" });
    const outcome = stateToOutcome(state.state);
    return this.settle(outcome === "success" ? "done" : outcome === "failure" ? "failed" : "killed");
  }

  // (2) A HUMAN was driving this session (no task contract) and it was killed by an
  //     external signal -> the user killed it on purpose. Do not resurrect it.
  if (state?.interactiveLineage && this.lastExitExternalStop) {
    emitTelemetry("tengu_bg_respawn_suppressed", { reason: "no_task_contract" });
    this.patch({ state: "stopped", detail: "stopped by an external signal" });
    return this.settle("killed");
  }
  return this.doSpawn();
}

// Mapping: Ohp→isRevivalGuardEnabled, Da→readJobState, rc→jobDir, dm→isSettled,
//          oD→stateToOutcome, A6→redactShort, Ee/fe→telemetry value tags
```

**Why re-read the disk at all?** Because `scheduleRespawn` put a 10-second gap between the death
and the respawn, and the *authoritative* record of "is this session finished" lives on disk, not
in the handle. During those 10 s a `claude stop`, a `Ctrl+X`, or the worker's own final state
write can land. This closes `.199` #8 — *"`claude stop` silently undone when it raced a bg
respawn; the respawn now honors the stop"* — and the mechanism is exactly "recheck at the last
possible moment", not a lock.

**Why `!e.queuedPrompt`?** A settled session with a queued prompt is settled *and* has work
waiting: the user replied to a finished agent. That must respawn.

**`interactiveLineage` + `lastExitExternalStop`** is the `.211` #23 half (*"User-killed
background agents auto-respawning"*). The distinction being drawn is contractual: a session with
a *task contract* (dispatched with a prompt, expected to complete) should be resurrected after an
unexpected death; a session whose lineage is *interactive* (a human backgrounded their own
conversation) has no contract, so an external SIGTERM means "the human stopped it".

### 4.1 The revival guard is a kill switch, and it guards more than this

```javascript
function Ohp() { return Ke("tengu_bg_revival_guard", !0); }        // :553349-553350
```

`tengu_bg_revival_guard` is **220=1 / 193=0**. It has exactly two call sites:

- `:554655` — the suppression above.
- `:554379-554382` — the interrupted-turn replay env:

```javascript
if (this.attempt > 1 && l && !t) {                        // respawn, transcript has messages, not post-upgrade
  if (((y.CLAUDE_CODE_RESUME_INTERRUPTED_TURN = "1"), Ohp())) {
    if (((y.CLAUDE_CODE_RESUME_PROMPT ??= pq_), m))       // m = interactiveLineage
      y.CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS ??= String(fq_);   // 1 hour
  }
}
```

So one gate turns off both the "do not revive a stopped session" behaviour **and** the
"tell the resumed worker it was restarted" prompt. That pairing is deliberate: the two together
are the `.199`/`.211` "revival" semantics, and rolling them back independently would produce a
worker that replays a turn for a session the user stopped.

`RESUME_AFTER_CRASH_PROMPT` (`:554825-554826`) is worth reading in full because it is a *prompt*
shipped as a constant:

> "Continue from where you left off. Note: this session was automatically restarted after its
> process exited unexpectedly; the user has not sent a new message since the restart. Re-verify
> anything time-sensitive (branch state, running processes, prior partial work) before
> continuing."

The second sentence is the interesting engineering: it tells the model that the *last user
message it can see is stale*, which is the single most dangerous misreading available to a
resumed agent. And the 1-hour `MAX_AGE_MS` is applied **only** when `interactiveLineage` is true
— a human-driven session resumed after more than an hour should not silently continue a turn the
human has forgotten about, whereas a task-contract session should.

`CLAUDE_CODE_RESUME_INTERRUPTED_TURN` is **220=18 / 193=8** — so the env var pre-existed and the
delta is the guard, the max-age, and the prompt. `tengu_resume_interrupted_turn` (220=2 / 193=0)
and `tengu_resume_stale_turn_suppressed` (220=1 / 193=0) live in the transcript deserialiser at
`:320161` / `:320211`; those two are `.200` #4 and `.200` #5 and belong to the transcript layer
rather than the worker.

---

## 5. Auth rekeying: `pty` / `rv` token mismatch

Every worker generates two 16-byte hex socket tokens at construction (`:553552-553553`) and can
regenerate them (`socketAuth`, `:553966-553972`). Three things can invalidate them: a daemon
handover that lost the roster copy, a schema-skewed daemon that stripped them, and an
`adopt.json` that never had them.

`tengu_bg_pty_auth_mismatch` (**220=1 / 193=0**, `:553821`) and `tengu_bg_rv_auth_mismatch`
(**220=1 / 193=0**, `:554730`) are the two detectors; both funnel into one handler.

```javascript
onPtyAuthRequired() {                                    // :553819-553829
  let e = this.dispatch.launch.mode;
  if ((O("tengu_bg_pty_auth_mismatch", { mode: fe(e) }), e === "exec")) {
    w(`[bg] exec worker ${this.dispatch.short}: ptyHost rejected auth token — roster ptyAuth poisoned; ` +
      `input is dead until re-dispatch (exec workers are never auto-respawned)`, { level: "warn" });
    return;
  }
  this.rekeyForAuthMismatch("pty-auth-required");
}
```

`rekeyForAuthMismatch` (`:553830-553875`) refuses in five cases and then makes a
**state-dependent** decision:

```javascript
if (this.authRekeyFired || this.authRekeyCount >= mq_ || this.phase.kind !== "running" ||
    this.record.outcome || this.dispatch.launch.mode === "exec") { …log and return… }
this.authRekeyFired = !0;
Da(rc(this.dispatch.short)).then((t) => {
  let r = Whp(t, e);                                     // classifyRekeySafety
  if (r === "settled") { this.authRekeyFired = !1; O("tengu_bg_adopt_token_lost_respawn", { deferred:!1, skipped:"settled" }); return; }
  if (r !== null)      { O("tengu_bg_adopt_token_lost_respawn", { deferred:!0, reason:r }); this.pendingAuthRekey = e; return; }
  O("tengu_bg_adopt_token_lost_respawn", { deferred:!1 });
  this.fireAuthRekey();
});
```

`tengu_bg_adopt_token_lost_respawn` is **220=3 / 193=0** (`:553850`, `:553858`, `:553868`) — the
anchor for `.211` #17 (*"Background jobs on gateway auth came back 'Not logged in' after daemon
respawn"*).

The classifier (`Whp`/`Sq_`, `:553485-553496`) returns one of four answers and each has a
distinct response:

| Classification | Meaning | Response |
|---|---|---|
| `"settled"` | the session already finished | do nothing; clear the latch; let `retireIfSettled` reap it |
| `"active"` | mid-turn | **defer** (`pendingAuthRekey`) — *"worker is mid-turn"* |
| `"inflight"` | non-resumable in-flight work | **defer** — *"worker has non-resumable in-flight work"* |
| `null` | idle and safe | respawn now (`--resume` preserves the session) |

**Why defer instead of respawn?** A rekey respawn kills and restarts the worker. Doing that
mid-turn loses the in-flight assistant response; doing it while a `local_bash` task or a
teammate agent is running loses work that cannot be resumed from the transcript. Deferring costs
only the ability to *type* at the worker until it goes idle, which is exactly the damage the
mismatch already caused.

`hasNonResumableInFlight` (`h7s`, `:553480-553484`) is the predicate; `Vhp`
(`["local_bash","in_process_teammate","dream","auto_mode_scan"]`, `:554885`) is the list of task
kinds treated as **detritus** — leftovers that a settled session may legitimately still have and
which therefore do not block reaping. `session_cron` is explicitly *not* detritus (`:553483`,
`:553796`) because a cron-driven session is expected to wake itself up again.

`MAX_AUTH_REKEYS = 3` (`mq_`) bounds the loop: if three respawns have not fixed the mismatch, the
cause is not a lost token and further respawns would be a crash loop with extra steps.

---

## 6. Adoption: taking over a fleet from a previous supervisor

### 6.1 Three constructors, three fidelity levels

| Constructor | Line | `via` | When |
|---|---|---|---|
| `spawn` | `:553923-553935` | `"cold"` | new dispatch |
| `claim` | `:553936-553965` | `"spare"` | a prewarmed spare is claimed for a dispatch |
| `adopt` | `:553981-554075` | `"adopted"` | a new daemon inherits a live worker from the roster |
| `unverified` | `:554076-554111` | `"adopted"` | the pid could not be verified; track via `pty.sock` |

`unverified` is carryover (`tengu_bg_adopt_unverified` 220=1 / **193=1**; the detail string
`adopted (pid unverifiable; tracking via pty.sock)` 220=1 / **193=1**). It replaces pid polling
with a socket-reachability poll every 5 s and settles `crashed` when the socket goes
(`:554096-554107`).

### 6.2 `adopt` re-verifies identity before it will take a worker

```javascript
static async adopt(e, t, r, n) {                      // :553981-...
  if (t.dispatch.env) {
    for (let s of Object.keys(t.dispatch.env))
      if (s.toUpperCase() === "PATH" || s === "CLAUDE_CODE_EXTRA_BODY") delete t.dispatch.env[s];   // :553983-553985
  }
  if (!HT(t.pid)) return null;                       // pid must be alive
  let o = await _L(t.pid, { skipCache: !0 });
  if (o && t.procStart !== o) return null;           // ... and be the SAME process
  …
}
```

Two things happen here that matter elsewhere:

- The env scrub at `:553983-553985` retroactively removes stale `PATH` and
  `CLAUDE_CODE_EXTRA_BODY` from roster rows written by an older build. See
  [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §4 — this is one half of
  the `.203` #8 / `.206` #10 fix.
- The identity check is `skipCache: true` and refuses on *mismatch* but tolerates *unknown*
  (`o &&`). Same fail-open-on-unreadable / fail-closed-on-wrong policy as the daemon lock.

Then it restores everything the roster remembered — `attempt`, `procStart`, sockets, both auth
tokens, dec-mode snapshot, exec tracker — and, at `:554026-554064`, honours a persisted
`pendingRespawn: "upgrade"` **subject to the same two refusals** as `respawnIfIdleStale`
(`isNewerBuild` at `:554029`, `channelsDiffer` at `:554043`). A worker that was mid-upgrade when
the old daemon died is moved to `upgrading` and SIGTERMed after 5 s if it does not exit on its
own — unless the new daemon is older, in which case the pending upgrade is silently dropped.

**And this is the direct evidence for the `.200` #8 "socket auth tokens" bullet** (`:554065-554073`,
`schema-skewed daemon stripped them` **220=1 / 193=0**):

```javascript
if (i.dispatch.launch.mode !== "exec" && t.ptySock && t.cliVersion && (t.rvAuth === void 0 || t.ptyAuth === void 0))
  return (w(`[bg] adopt ${i.dispatch.short}: roster rvAuth/ptyAuth missing for token-era worker — schema-skewed daemon stripped them`,
            { level: "warn" }),
    i.rekeyForAuthMismatch("missing-at-adopt"), i);
```

A worker whose roster row records a `cliVersion` and a `ptySock` (so it is from the token era)
but has **no tokens** can only mean one thing: some daemon in between parsed the roster with a
schema that did not know those fields and dropped them on rewrite. 2.1.193's roster schema was
`A.object` (`:486137 (193)`), which strips unknown keys — so 2.1.193 *was* that daemon. The
recovery is an immediate rekey, and the prevention is `looseObject` +
`extractUnknownRosterFields` (see the session-store doc).

Note `Whp(t, "missing-at-adopt")` is special-cased (`:553494`): a settled worker with in-flight
detritus is reported as `"inflight"` rather than `"settled"` **only** for this source, because at
adopt time a "settled" classification would skip the rekey for a worker that is about to be
re-attached.

### 6.3 `adopt.json` — the cross-restart handoff for in-session work

Distinct from the roster: `adopt.json` in the job dir hands *sub-session* work (background
shells, subagents, workflow runs, cron entries) from a dying session to its replacement.

`writeAdoptFile` (`nEr`, `:564907-564927`) merges with any existing file (size ≤ 1e6, entry
count ≤ 256) and writes. `claimAdoptFile` (`ZSp`, `:564928-564980`) **claims by rename**:

```javascript
let r = DRe.join(e, "adopt.json"), n = `${r}.${process.pid}`;
for (;;) try { i = await Gue(r, n); break; }         // rename(adopt.json -> adopt.json.<pid>)
  catch (l) { … ENOENT: retry until waitMs … }
```

Renaming to a pid-suffixed name is an atomic take-ownership: two concurrent claimants cannot both
succeed, and the winner reads from a path only it knows. The `finally` unlinks it (`:564979`), so
a crash mid-claim loses the handoff rather than replaying it into two sessions.

`tengu_adopt_claim` (**220=6 / 193=0**) carries the outcome taxonomy — and the *set* of outcomes
is the interesting artefact:

| `result` | Line | Meaning |
|---|---|---|
| `enoent` | `:564945` | nothing to adopt after `waitMs` |
| `ebusy_gave_up` | `:564949` | rename kept failing with a busy-class errno |
| `ebusy_retry` | `:564954` | claimed, but only after a retry |
| `ok` | `:564954` | claimed first try |
| `schema_rejected` | `:564961` | file parsed but did not validate |
| `stale` | `:564968` | `origin !== "exit"` and older than `rEr = 120000` ms (`:565196`) |
| `parse_failed` | `:564975` | unreadable/invalid JSON |

**Why is `origin === "exit"` exempt from staleness?** An `exit`-origin file was written by a
session that shut down cleanly and *intends* its work to be adopted whenever the user comes back
— possibly days later. A non-exit file is a live-handoff breadcrumb, and a two-minute-old one
means the handoff failed; adopting it would re-attach to processes that are almost certainly
gone.

`tengu_adopt_exit_handoff` (**220=1 / 193=0**, `:565353`) is the write side: it flushes agent
transcripts first, then records `{ writtenAtMs, origin: "exit", shells, cron, workflows, agents }`
and reports the three counts. `tengu_adopt_link` (**220=1 / 193=0**, `:822056`) is the read side,
per adopted shell, with a `method` discriminator; `adopt_link_failed` /
`adopt_owner_skipped` (`:822043`, `:822050`) are the two ways an entry is dropped — the latter
enforces that a shell whose owning agent did not register is not adopted orphaned.

`tengu_adopt_exit_reap` (**220=1 / 193=0**, `:680724`) is the *other* consumer:
`reapAdoptedShellsFromExitHandoff` (`Dcf`, `:680698-680731`) claims the same file by rename and
**kills** everything in it instead of adopting it, with two plausibility gates
(`:680718-680722`):

```
age > iGb (604800000 = 7 days)  ||  shells.length > sGb (256)   -> "implausible payload", reap nothing
```

Seven days and 256 entries are both "obviously wrong" thresholds rather than tuning knobs: they
exist so that a corrupted or attacker-supplied `adopt.json` cannot be used to make Claude Code
kill an arbitrary list of PIDs. The kill itself is `tEr(pid, startTimeTicks, procStart)` — the
same triple-identity check as everywhere else in this subsystem.

This pair is `.203` #6: *"Returning to `claude agents` stopped running subagents; work now
carries over"* (`so the work carries over` 220=1 / 193=0 at `:413946`). The old behaviour was
the reap path; the new behaviour is the adopt path, and both still exist because the *right*
choice depends on whether a successor session appears.

---

## 7. Attach, probe rescue and resume conflicts

### 7.1 Probe rescue (`.195` #8, `.212` #25)

`tengu_bg_respawn_probe_rescue` (**220=1 / 193=0**) is one line:

```javascript
if (A.via === "projectsScan") O("tengu_bg_respawn_probe_rescue", { via: fe(A.via) });   // :681696
```

`A` comes from `locateSessionTranscript` (`mCe`, `:51513-…`), which searches candidate paths in
priority order: `linkScanPath` → `linkScanDir` → each registered project dir → the computed path
→ (optionally) cross-worktree project dirs. `via` records which candidate won. A
`"projectsScan"` win means the *computed* path was wrong and the transcript was only found by
enumerating project directories — i.e. the session's project dir changed (a `/cd`, a worktree
entry, a moved checkout). Telemetering exactly that case is how the "reopening a crashed
background task shows a blank screen" class of bug is measured.

When no candidate has messages (`:681697-681724`) there are two outcomes:

- a **fork handoff whose own transcript never materialised** is *refused* rather than started
  fresh, with a message that tells the user their data is not lost
  (`:681699-681715`): *"This session has no saved transcript — it was stopped before its first
  response finished. If it was backgrounded from another conversation, **that one is still
  intact**; `claude respawn <id>` starts this one fresh."* Guarded by
  `bgIsolation === "none" && d === n.sessionId && !force`.
- otherwise the empty file is **quarantined** by rename, not deleted:
  `quarantineJobTranscript` (`qrt`, `:51505-51512`) renames `<id>.jsonl` to
  `<id>.orphaned-<ts>-<uuid8>.jsonl`. `.orphaned-` is **220=1 / 193=0**. This is `.196` #5
  (*"Waking a bg job deleting its conversation + re-running the prompt; file now set aside"*) —
  the old path destroyed evidence, the new one preserves it under a name the transcript scanner
  will not pick up.

`qrt` is also called from `doSpawn` at `:554361` on the same "respawn found no messages"
condition, so both the attach-driven and the crash-driven respawn set the file aside.

### 7.2 Resume conflict

`tengu_bg_respawn_resume_conflict` (**220=2 / 193=0**, `:537421` + `:681733`):

```javascript
let ee = await gDe(d),                                        // findLiveSessionOwner(sessionId)
  te = ee?.jobId !== void 0 && (ee.jobId === e || ee.jobId === u);
if (ee && !te)
  return (O("tengu_bg_respawn_resume_conflict", {}), $e("job_respawn", "resume_session_live_elsewhere"),
    { ok:!1, alive:!1, state:c, queued: …,
      error: "This conversation is already open in another running Claude session — use that one, or close it and try again" });
```

`findLiveSessionOwner` (`gDe`, `:680688-680697`) enumerates all live sessions and looks for one
with the same `sessionId`, a different pid, and a non-`interactive` kind. The `te` term is the
subtlety: if the live owner *is* this job (matched by either the long or short id) it is not a
conflict — that is just the session we are respawning. Respawning a session that another process
has open would give two writers to one transcript.

### 7.3 Attach after a reap

`tengu_bg_attach_wake_after_reap` (**220=1 / 193=0**, `:682964`). When attach gets `ENOJOB`, the
state file is consulted (`:682952-682966`):

```javascript
let d = u?.state === "failed" && !JBe(u) && (u.reapedMidWorkAt !== void 0 || u.reapedUnsettledAt !== void 0);
if (u?.state === "failed" && !d)  → "Session <id> can't start — <detail or 'it crashed repeatedly'>"  (exit 1)
if (d)                            → tengu_bg_attach_wake_after_reap; "Session <id> was interrupted while unattended — resuming it…"
else                              → "Waking session <id>…"
```

`reapedMidWorkAt` / `reapedUnsettledAt` are **220=6 / 193=0** each. They are the markers the
sweep writes when it reaps a worker that had *not* finished, and they are what lets attach
distinguish "this crashed and will crash again" from "this was reaped while you were away, and
resuming is the right thing". That distinction is `.211` #14 (*"Reopening a just-stopped
background session started a blank conversation, same id"*) and `.205` #7 (*"`claude attach`
erroring when a bg agent was mid-upgrade restart"*).

The `Session is starting — showing its transcript until it appears` path (**220=1 / 193=0**,
constant `vjb` at `:678954`) is the `.208` #39 companion — cold attach renders the
transcript immediately instead of a blank frame.

### 7.4 `tengu_bg_stdin_unreadable`

**220=1 / 193=0** (`:682705`). `readBgStdin` (`duf`, `:682687-…`) reads piped stdin for
`claude --bg`; if `setEncoding`/`on("data")` throws a recognised errno it warns
*"warning: stdin is unreadable (<errno>), proceeding without piped input"* and returns `""`
rather than failing the dispatch. There is also a byte cap `LIa` with a
*"piped stdin exceeds N bytes, truncated"* warning (`:682713-682715`) and a 3 s read deadline
(`:682711`).

The `.217` #12 bullet (*"Background shells impossible to stop after `/background` or `←`, or on
session exit"*) pairs this gate with `tengu_bg_handoff_settle`; I could not isolate the
stop-path change itself — see [`README.md`](./README.md) "Not covered".

---

## 8. Launcher failures on the worker path

`tengu_bg_launcher_worker_refused` is **220=3 / 193=0** — three emitters, and each one settles
the worker `crashed` **without scheduling a respawn**:

| Emitter | Line | Condition | Detail written to the session |
|---|---|---|---|
| pre-spawn | `:554320` | `PE()` non-null → launcher config invalid | the config error text |
| ENOENT | `:554419` | `spawnPty` threw ENOENT and a launcher is configured | *"launcher `X` was deleted or moved (ENOENT) — fix `CLAUDE_CODE_PROCESS_WRAPPER`, then run your command again"* |
| EACCES/EPERM | `:554429` | launcher present but not executable | *"launcher `X` could not be executed (EACCES)"* |

**Why no respawn?** An unrunnable launcher is an operator-fixable condition that will not resolve
on its own. Twenty respawns at 10 s intervals would produce twenty identical failures, twenty
crash notices in the user's transcript, and no progress. Settling immediately with the exact
remedy in the detail string is strictly better. Contrast the *daemon* upgrade path, which
**defers and re-checks every poll** (`:870713-870719`) — because a daemon has running work to
protect and nothing to lose by waiting.

Note the ENOENT branch's ordering (`:554406-554424`): `cwd` accessibility is checked **before**
the launcher is blamed, so a deleted working directory is reported as a `cwd` problem rather than
a launcher problem. And when *no* launcher is configured, the same ENOENT produces
*"daemon binary was deleted (upgrade in progress) — run your command again to use the new
version"* plus `tengu_bg_spawn_binary_gone` — three different diagnoses from one errno.

`tengu_bg_launcher_fork_and_exit` (**220=1 / 193=0**, `:554609`) is the subtlest of the family:

```javascript
p = !!c && e === 0 && !this.workerReady && n !== void 0 && n < Rut;      // :554551
…
if (p) {
  let R = `the launcher exited before Claude Code started — \`${c}\` must exec, not daemonize${…}`;
  return (O("tengu_bg_launcher_fork_and_exit", { attempt: this.attempt }),
    pe("agent_launcher", "worker_fork_and_exit"), this.patch({ state: "crashed", detail: R }), this.settle("crashed"));
}
```

Exit code **0**, worker never became ready, and it happened within `Rut = 12000` ms
(`:267646`). A launcher that forks a child and returns success looks like a *successful* spawn
followed by an instantly-vanished worker — the most confusing possible failure. The three
conditions together identify it precisely, and the message states the contract:
`must exec, not daemonize` (**220=1 / 193=0**). This is the worker-side counterpart to
`launcher contract #3` in [`daemon_lifecycle.md`](./daemon_lifecycle.md) §3.5.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_background_agents_daemon.md](../00_overview/symbol_additions_v2_1_220_background_agents_daemon.md).

Key functions in this document:

- `BackgroundWorker` (mme) - the per-session worker handle; phase machine, respawn, adopt, rekey
- `isWorkerPhaseTransitionLegal` (Eq_) - the transition table; `transitionTo` returns false as a race primitive
- `respawnIfIdleStale` (method) - 17-guard in-background upgrade with a TOCTOU re-check after the disk read
- `noteDowngradeRefused` (method) - latched `tengu_bg_respawn_downgrade_refused` emitter
- `doSpawnUnlessSettledOnDisk` (method) - the two `tengu_bg_respawn_suppressed` reasons
- `scheduleRespawn` (method) - flat 10 s backoff, 20-attempt ceiling
- `onExit` (method) - crash accounting, sleep interlock, nine outcomes
- `settleCwdGone` (method) - permanent settle when the working directory is gone
- `rekeyForAuthMismatch` / `fireAuthRekey` (methods) - state-dependent socket-token rekey
- `classifySettleState` (Sq_) / `classifyRekeySafety` (Whp) - settled / active / inflight decision
- `hasNonResumableInFlight` (h7s) - detritus-aware in-flight test
- `isRevivalGuardEnabled` (Ohp) - the one gate behind both revival behaviours
- `adopt` / `claim` / `unverified` (static methods) - the three adoption fidelities
- `extractUnknownRosterFields` (dwo) - captures unknown roster keys into `rosterExtras`
- `claimAdoptFile` (ZSp) / `writeAdoptFile` (nEr) - rename-based `adopt.json` ownership
- `reapAdoptedShellsFromExitHandoff` (Dcf) - the kill-instead-of-adopt path with plausibility gates
- `quarantineJobTranscript` (qrt) - rename an empty transcript to `.orphaned-<ts>-<uuid>.jsonl`
- `locateSessionTranscript` (mCe) - multi-candidate transcript search; `via` feeds probe-rescue telemetry
- `findLiveSessionOwner` (gDe) - resume-conflict detector
- `prewarmBurst` (F) - post-takeover upgrade wave with two abort conditions
