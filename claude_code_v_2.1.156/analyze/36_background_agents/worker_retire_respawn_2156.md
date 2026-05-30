# Worker Retire/Respawn Fixes — pinned guard, settled-state, low-memory shed, sleep/wake (v2.1.156)

> **Scope:** the v2.1.156 reliability fixes inside the renamed worker handle `BgWorkerHandle` (`SF`,
> cli_inner_pretty.js:559938 — the successor to v2.1.142's `aB`) and the supervisor tick. This is a **delta**
> document: it assumes the v2.1.142 reference
> [`../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md`](../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md)
> for the phase enum, the transition guard, `onExit`, `settle`, and the four static factories. Those are
> structurally **unchanged** in 2.1.156. Here we document only what moved.
>
> **Confidence: HIGH** — every claim is grounded in lines read directly from
> `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`. The whole worker-handle
> phase machine remains **NEW post-2.1.88** (the readable 2.1.88 tree has no `BgWorkerHandle`,
> `retireIfSettled`, `respawnIfIdleStale`, `shiftGraceClocksForward`, or `pins.json`; background sessions there
> use `utils/concurrentSessions.ts`). Cross-validation notes are inline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Background Agents lives here)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations

Key symbols in this document:
- `BgWorkerHandle` (`SF`) — worker-handle class, renamed from `aB` (cli_inner_pretty.js:559938)
- `BgWorkerHandle.respawnIfIdleStale` (`respawnIfIdleStale`) — upgrade-driven respawn (cli_inner_pretty.js:560029-560061)
- `BgWorkerHandle.retireIfSettled` (`retireIfSettled`) — per-tick retire predicate (cli_inner_pretty.js:560062-560135)
- `BgWorkerHandle.transitionTo` (`transitionTo`) — guarded phase mutation (cli_inner_pretty.js:560003-560013)
- `BgWorkerHandle.shutdownWorker` (`shutdownWorker`) — rv-shutdown + SIGTERM fallback (cli_inner_pretty.js:560014-560028)
- `BgWorkerHandle.shiftGraceClocksForward` (`shiftGraceClocksForward`) — sleep/wake clock shim (cli_inner_pretty.js:560318-560322)
- `isLegalPhaseTransition` (`VPz`) — transition guard, renamed from `UB5` (cli_inner_pretty.js:559923-559937)
- `formatPhase` (`yq9`) — phase→log string, renamed from `FI4` (cli_inner_pretty.js:559920-559922)
- `isSettledState` (`_J`) — settled-state predicate (cli_inner_pretty.js:184283-184285)
- `isTerminalState` (`Nv`) — terminal-state predicate (cli_inner_pretty.js:184280-184282)
- `terminalStateToOutcome` (`evH`) — done/failed/stopped → outcome (cli_inner_pretty.js:184274-184278)
- `loadPinnedSet` (`Qw$`) — reads `pins.json` into a Set each tick (cli_inner_pretty.js:184012-184022)
- `pinsFilePath` (`gL6`) — `<bgDir>/pins.json` path (cli_inner_pretty.js:184009-184011)
- `rebuildPinnedFromMarkers` (`LL5`) — fallback: scan per-dir `pinned` marker files (cli_inner_pretty.js:184023-184047)
- `isLowMemory` (`By$`) — free-memory under threshold predicate (cli_inner_pretty.js:540459-540462)
- `lowMemThresholdBytes` (`iy8`) — `tengu_bg_low_mem_mb` (1024) gate, 0 on macOS (cli_inner_pretty.js:540455-540458)
- `bridgedRetireGraceMs` (`Ve4`) — `tengu_bg_retire_grace_bridged_min` (480 min) (cli_inner_pretty.js:540463-540465)
- `runDaemonSupervisor` tick `setInterval` (cli_inner_pretty.js:647980-648023)
- `POST_ADOPT_GRACE_MS` (`GPz`) = 120000 (cli_inner_pretty.js:560836)
- `EMPTY_IDLE_GRACE_MS` (`TPz`) = 300000 (cli_inner_pretty.js:560837)
- `TICK_INTERVAL_MS` (`vzq`) = 60000 (cli_inner_pretty.js:648201)
- `LOW_MEM_GRACE_MS` (`Vzq`) = 60000 (cli_inner_pretty.js:648200)
- `NORMAL_RETIRE_GRACE_MS` (`mpz`) = 3600000 (cli_inner_pretty.js:648199)
- `EMPTY_PIN_SET` (`Bpz`) = `new Set()` (cli_inner_pretty.js:648202, 648221)

---

## TL;DR

v2.1.156 ships a focused reliability pass on background-worker lifetime, all inside the renamed worker handle
`BgWorkerHandle` (`SF`, cli_inner_pretty.js:559938) and the supervisor tick (cli_inner_pretty.js:647980). Four
distinct bugs are fixed:

1. **Pinned bg sessions respawning every minute after an update.** The old respawn path only refused on "settled
   OR current-version OR busy". 2.1.156 adds a **pinned-set parameter** so `respawnIfIdleStale` will respawn a
   *settled* worker only when it is pinned (cli_inner_pretty.js:560053), and `retireIfSettled` now **refuses to
   retire any pinned worker** outright (cli_inner_pretty.js:560066). The combination means a pinned session that
   has finished its job stays alive, gets respawned exactly once when the binary changes, and then stops
   thrashing.

2. **Sessions stuck at blocked/running/working not retiring after the idle grace.** The "settled" predicate used
   to be just `isSettledState` (`_J`). 2.1.156 **broadens** it: a non-`exec` worker also counts as retire-eligible
   when `tempo === "idle"` **or** when it is `state === "blocked" && tempo === "blocked"`
   (cli_inner_pretty.js:560110-560117). That unsticks sessions that report a non-terminal `state` but have clearly
   gone quiet.

3. **Exec (shell) sessions being respawned/retired like agent sessions.** A `claude --bg --exec` worker has
   `dispatch.launch.mode === "exec"`. `respawnIfIdleStale` short-circuits as `"not-stale"` for exec workers
   (cli_inner_pretty.js:560030), and exec is excluded from the broadened retire predicate
   (cli_inner_pretty.js:560113). A shell command is run-to-completion; the supervisor must not "upgrade" it
   mid-run or treat its idle moments as "done".

4. **Low-memory pressure with no graceful relief.** The supervisor tick gains a **low-memory escalation**
   (cli_inner_pretty.js:647991-648016): under memory pressure it shortens the retire grace to 60s; if that sheds
   *nothing* and memory is still low, it retires even **pinned, settled** workers as a last resort, emitting
   `tengu_bg_retire_pinned_low_mem` (cli_inner_pretty.js:648011-648014).

A fifth, pre-existing concern — **sleep/wake clock drift** — is reinforced: when the tick observes a wall-clock
jump it calls `shiftGraceClocksForward` on every worker and skips the retire pass for that tick
(cli_inner_pretty.js:647984-647990).

Two new grace inputs round it out: a **bridge-session extended grace** (`Math.max(H, q)` when the state carries a
`bridgeSessionId`, cli_inner_pretty.js:560121) and the build `VERSION` literal `"2.1.156"` inlined into the
staleness comparison (cli_inner_pretty.js:560041).

---

## 0. The rename: `aB` → `SF`, and what stayed identical

In v2.1.142 the worker-handle class was `aB` / `BgWorkerHandle`. In v2.1.156 it is `class SF`
(cli_inner_pretty.js:559938). The field layout and the helper methods are essentially the same — same phase enum
(`phase = { kind: "spawning" }` default at cli_inner_pretty.js:559971), same `attachers` map, ring buffer,
`fastCrashStreak`, `adoptedAt`, `lastInputAt`, etc.

The **transition guard is byte-for-byte the same logic**, just renamed:

```javascript
// ============================================
// isLegalPhaseTransition - guard for transitionTo (unchanged vs 2.1.142, renamed UB5→VPz)
// Location: cli_inner_pretty.js:559923-559937
// ============================================

// ORIGINAL (for source lookup):
function VPz(H, $) {
  if (H.kind === "retired") return !1;
  switch ($.kind) {
    case "spawning": return H.kind === "upgrading" || H.kind === "running";
    case "running":  return H.kind === "spawning";
    case "upgrading":return H.kind === "running";
    case "retiring": return !0;
    case "retired":  return !0;
  }
}

// READABLE (for understanding):
function isLegalPhaseTransition(from, to) {
  if (from.kind === "retired") return false;       // terminal — nothing leaves
  switch (to.kind) {
    case "spawning":  return from.kind === "upgrading" || from.kind === "running"; // respawn / upgrade-respawn
    case "running":   return from.kind === "spawning";
    case "upgrading": return from.kind === "running";
    case "retiring":  return true;                 // can retire from anywhere
    case "retired":   return true;
  }
}

// Mapping: VPz→isLegalPhaseTransition (was UB5), H→from, $→to
```

`transitionTo` (cli_inner_pretty.js:560003-560013) is also unchanged in shape — it calls the guard, logs
`tengu_bg_phase_illegal` and returns `false` on an illegal transition, otherwise assigns `this.phase`. The phase
diagram, `onExit` outcome decision, and the four static factories (`spawn`/`claim`/`adopt`/`unverified`) are all
documented in the 2.1.142 reference and are **not repeated here**.

> **Why a rename matters to us:** the minifier reassigned identifiers between builds. If you grep 2.1.156 for `aB`
> you will land on an unrelated symbol. The current handle is `SF`; the current guard is `VPz`; the current
> phase-formatter is `yq9` (was `FI4`). This document uses those.

---

## 1. The settled / terminal predicates (`_J`, `Nv`, `evH`)

Everything in this document keys off three tiny predicates (cli_inner_pretty.js:184274-184285). They are the
vocabulary the retire/respawn logic speaks in.

```javascript
// ============================================
// terminalStateToOutcome / isTerminalState / isSettledState - the state vocabulary
// Location: cli_inner_pretty.js:184274-184285
// ============================================

// ORIGINAL (for source lookup):
function evH(H) {
  if (H === "done") return "success";
  if (H === "failed") return "failure";
  if (H === "stopped") return "stopped";
  return null;
}
function Nv(H) { return evH(H) !== null; }
function _J(H) { return Nv(H.state) && H.tempo !== "active"; }

// READABLE (for understanding):
function terminalStateToOutcome(jobState) {        // a "state" string → outcome label, or null
  if (jobState === "done")    return "success";
  if (jobState === "failed")  return "failure";
  if (jobState === "stopped") return "stopped";
  return null;                                     // not a terminal state string
}
function isTerminalState(jobState) {               // is this state string one of done/failed/stopped?
  return terminalStateToOutcome(jobState) !== null;
}
function isSettledState(rec) {                     // the job is FINISHED and not actively churning
  return isTerminalState(rec.state) && rec.tempo !== "active";
}

// Mapping: evH→terminalStateToOutcome, Nv→isTerminalState, _J→isSettledState, H→jobState/rec
```

**Key distinction (the crux of fix #2):**

- `isTerminalState` (`Nv`) examines a **single state string**: it is `done`, `failed`, or `stopped`.
- `isSettledState` (`_J`) examines a **job record**: it is terminal **and** its `tempo` is not `"active"`.

So a worker whose `state` is `blocked`, `running`, or `working` is **not** `isSettledState`, no matter how quiet
it is. Before 2.1.156, the *only* retire-eligibility test (after the cheap refusals) was `isSettledState(K)` —
which meant a worker that finished its work but never wrote a terminal `state` (it parked at `blocked`/`working`
with `tempo: idle`) would **never** retire. It would sit forever, holding a PTY and memory. That is exactly the
"stuck at blocked/running/working not retiring after idle grace" bug. Fix #2 below broadens the predicate to
catch these.

---

## 2. `retireIfSettled(H, $, q = H)` — the new signature, pinned guard, broadened predicate

This is the per-tick retire decision. Its **signature changed** in 2.1.156:

```
retireIfSettled(graceMs, pinnedSet, bridgedGraceMs = graceMs)
                 ^^^^^^^  ^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^
                 H        $          q (defaults to H)
```

- `H` (`graceMs`) — the base idle grace. Normally `mpz` = **1 hour** (cli_inner_pretty.js:648199); under memory
  pressure the tick passes `Vzq` = **60s** (cli_inner_pretty.js:648200).
- `$` (`pinnedSet`) — the set of pinned `short` ids, freshly loaded each tick. **NEW in 2.1.156.**
- `q` (`bridgedGraceMs`, default `= H`) — a longer grace for bridge-attached sessions. Normally `Ve4()`
  ≈ **480 min** (cli_inner_pretty.js:540464). **NEW in 2.1.156.**

```javascript
// ============================================
// BgWorkerHandle.retireIfSettled - per-tick retire decision (pinned guard + broadened predicate + bridge grace)
// Location: cli_inner_pretty.js:560062-560135
// ============================================

// ORIGINAL (for source lookup):
async retireIfSettled(H, $, q = H) {
  if (this.isTransitioning) return { retired: !1, reason: "in-progress" };
  if (this.record.outcome) return { retired: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { retired: !1, reason: "attached" };
  if ($?.has(this.dispatch.short)) return { retired: !1, reason: "pinned" };
  if (this.adoptedAt && Date.now() - this.adoptedAt < GPz) return { retired: !1, reason: "recent-adopt" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < H) return { retired: !1, reason: "recent-input" };
  let K = await a7(m9(this.dispatch.short));
  if (this.isTransitioning || this.attachers.size > 0) return { retired: !1, reason: "in-progress" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < H) return { retired: !1, reason: "recent-input" };
  if (!K) {
    if (this.dispatch.source === "spare" && Date.now() - this.dispatch.createdAt > H) {
      if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: !1, reason: "in-progress" };
      return (d("tengu_bg_retired", { short: this.dispatch.short, rvSent: this.shutdownWorker(),
        settledForMs: Date.now() - this.dispatch.createdAt, state: "stale-spare" }), { retired: !0 });
    }
    return { retired: !1, reason: "no-state" };
  }
  if (this.dispatch.source !== "shell" && !K.name && !K.intent && !K.worktreePath &&
      K.template === "bg" && K.state === "working" && K.tempo === "blocked") {
    let Y = Date.now() - Date.parse(K.createdAt);
    if (Y < TPz) return { retired: !1, reason: "empty-idle-grace" };
    if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: !1, reason: "in-progress" };
    return ((this.deleteJobDirOnSettle = !0), d("tengu_bg_retired", { short: this.dispatch.short,
      rvSent: this.shutdownWorker(), settledForMs: Y, state: "empty-idle" }), { retired: !0 });
  }
  if (!(_J(K) || (this.dispatch.launch.mode !== "exec" &&
        (K.tempo === "idle" || (K.state === "blocked" && K.tempo === "blocked")))))
    return { retired: !1, reason: "not-settled" };
  if ((K.inFlight?.tasks ?? 1) > 0 || (K.inFlight?.queued ?? 1) > 0) return { retired: !1, reason: "inflight" };
  if (K.inFlight?.kinds.includes("session_cron")) return { retired: !1, reason: "session-cron" };
  if (K.routine) return { retired: !1, reason: "routine" };
  let z = K.bridgeSessionId ? Math.max(H, q) : H,
    A = K.updatedAt && Date.now() - Date.parse(K.updatedAt);
  if (!A || A < z) return { retired: !1, reason: "grace" };
  if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: !1, reason: "in-progress" };
  return (d("tengu_bg_retired", { short: this.dispatch.short, rvSent: this.shutdownWorker(),
    settledForMs: A, bridged: !!K.bridgeSessionId, state: K.state }), { retired: !0 });
}

// READABLE (for understanding):
async retireIfSettled(graceMs, pinnedSet, bridgedGraceMs = graceMs) {
  // ---- cheap refusals (no disk read) ----
  if (this.isTransitioning) return { retired: false, reason: "in-progress" };
  if (this.record.outcome) return { retired: false, reason: "no-state" };       // already settled
  if (this.attachers.size > 0) return { retired: false, reason: "attached" };    // a user is watching
  if (pinnedSet?.has(this.dispatch.short)) return { retired: false, reason: "pinned" }; // NEW: never retire a pin
  if (this.adoptedAt && Date.now() - this.adoptedAt < POST_ADOPT_GRACE_MS)       // GPz = 120s
    return { retired: false, reason: "recent-adopt" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < graceMs)
    return { retired: false, reason: "recent-input" };

  // ---- read on-disk job state, then RE-CHECK the racy refusals ----
  let job = await readJobState(jobDir(this.dispatch.short));
  if (this.isTransitioning || this.attachers.size > 0) return { retired: false, reason: "in-progress" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < graceMs) return { retired: false, reason: "recent-input" };

  if (!job) {                                                                    // no state file
    if (this.dispatch.source === "spare" && Date.now() - this.dispatch.createdAt > graceMs) {
      if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: false, reason: "in-progress" };
      emit("tengu_bg_retired", { short, rvSent: this.shutdownWorker(),
        settledForMs: Date.now() - this.dispatch.createdAt, state: "stale-spare" });
      return { retired: true };                                                  // age out stale pre-warm spare
    }
    return { retired: false, reason: "no-state" };
  }

  // ---- empty-idle abandoned bg session heuristic (from v2.1.141) ----
  if (this.dispatch.source !== "shell" && !job.name && !job.intent && !job.worktreePath &&
      job.template === "bg" && job.state === "working" && job.tempo === "blocked") {
    let age = Date.now() - Date.parse(job.createdAt);
    if (age < EMPTY_IDLE_GRACE_MS) return { retired: false, reason: "empty-idle-grace" }; // TPz = 5 min
    if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: false, reason: "in-progress" };
    this.deleteJobDirOnSettle = true;                                            // also delete the dir
    emit("tengu_bg_retired", { short, rvSent: this.shutdownWorker(), settledForMs: age, state: "empty-idle" });
    return { retired: true };
  }

  // ---- BROADENED settled predicate (fix #2 + exec exclusion fix #3) ----
  let retireEligible =
    isSettledState(job) ||                                                       // done/failed/stopped & not active
    (this.dispatch.launch.mode !== "exec" &&                                     // exec workers are NEVER "idle-done"
      (job.tempo === "idle" || (job.state === "blocked" && job.tempo === "blocked")));
  if (!retireEligible) return { retired: false, reason: "not-settled" };

  if ((job.inFlight?.tasks ?? 1) > 0 || (job.inFlight?.queued ?? 1) > 0) return { retired: false, reason: "inflight" };
  if (job.inFlight?.kinds.includes("session_cron")) return { retired: false, reason: "session-cron" };
  if (job.routine) return { retired: false, reason: "routine" };

  // ---- bridge-session extended grace (fix: longer idle window when REPL-bridged) ----
  let effectiveGrace = job.bridgeSessionId ? Math.max(graceMs, bridgedGraceMs) : graceMs;
  let idleMs = job.updatedAt && Date.now() - Date.parse(job.updatedAt);
  if (!idleMs || idleMs < effectiveGrace) return { retired: false, reason: "grace" };

  if (!this.transitionTo({ kind: "retiring", reason: "grace" })) return { retired: false, reason: "in-progress" };
  emit("tengu_bg_retired", { short, rvSent: this.shutdownWorker(),
    settledForMs: idleMs, bridged: !!job.bridgeSessionId, state: job.state });
  return { retired: true };
}

// Mapping: H→graceMs, $→pinnedSet, q→bridgedGraceMs, K→job, z→effectiveGrace, A→idleMs, Y→age,
//          a7→readJobState, m9→jobDir, d→emit, _J→isSettledState, GPz→POST_ADOPT_GRACE_MS,
//          TPz→EMPTY_IDLE_GRACE_MS
```

### 2a. The pinned refusal (cli_inner_pretty.js:560066)

**What it does:** before any disk read, if the worker's `short` id is in the pinned set, refuse with
`reason: "pinned"`.

**How it works:**
1. The supervisor passes `R` — the fresh pinned set loaded by `loadPinnedSet` (`Qw$`) this tick
   (cli_inner_pretty.js:647994) — as `$`.
2. `$?.has(this.dispatch.short)` is checked at cli_inner_pretty.js:560066, *fourth* in the refusal ladder (right
   after `attached`).
3. Because it precedes the disk read and the age math, a pinned worker is **never** subject to the idle-grace
   retire path at all.

**Why this approach:** a pin is a user's explicit "keep this session around" signal (stored in
`<bgDir>/pins.json`, cli_inner_pretty.js:184010). A pinned session that finished its task is exactly the case that
should *not* be reaped by idle grace. Placing the check high in the ladder (before the `await`) also makes it
cheap and race-free — there is no point reading state for a worker we will keep regardless.

**Key insight:** pinned ≠ exempt-from-everything. The supervisor's low-memory escalation (Section 4) deliberately
**bypasses** this guard by passing an *empty* pinned set, so a pin is honored under normal pressure but yields as a
last resort under sustained memory pressure.

### 2b. The broadened not-settled predicate (cli_inner_pretty.js:560110-560117)

**What it does:** decides whether a worker with a live state file is eligible to begin retiring.

**How it works — the boolean, unpacked:**
```
retireEligible =
    isSettledState(job)                                  // (A) done/failed/stopped AND tempo != active
 OR ( launch.mode != "exec"                              // (B) only for non-shell workers …
      AND ( job.tempo === "idle"                         //     … the worker has gone idle …
            OR (job.state === "blocked" && job.tempo === "blocked") ) ) // … or it is doubly-blocked
```
- **(A)** is the old behaviour — a properly terminal job.
- **(B)** is the **2.1.156 broadening**. It catches the two stuck shapes the changelog calls out:
  - `tempo === "idle"` while `state` is still `running`/`working`/`blocked` — the worker reported it is doing
    nothing but never flipped `state` to a terminal value.
  - `state === "blocked" && tempo === "blocked"` — a session that blocked (e.g. waiting on a permission/input that
    never came) and parked there.

Note the **subsequent guards still apply**: `inFlight.tasks/queued > 0`, `session_cron`, `routine`, and the
idle-grace age check at cli_inner_pretty.js:560121-560123. So branch (B) does not retire a busy worker — it only
*qualifies* a quiet one to enter the grace-age comparison.

**Why this approach:** the previous `isSettledState`-only gate was too strict. It demanded a terminal `state`
string, which a worker that wedged on a never-resolving block would never write. The fix keeps the strict terminal
case as the fast path and adds a "looks-idle-or-stuck" fallback gated behind the *same* grace-age and in-flight
checks. Alternatives the authors avoided: (1) retire purely on `tempo === idle` regardless of `state` — too
aggressive, would reap workers mid-pause; (2) a watchdog timer per worker — more state, more races. The
broadened predicate reuses the existing once-a-minute tick and the existing grace math.

**Key insight:** the **exec exclusion** is baked *into* branch (B) via `launch.mode !== "exec"`. A
`claude --bg --exec` worker only ever retires through branch (A) — i.e. when the shell command genuinely finishes
and writes a terminal `state`. Its momentary idleness (e.g. a long-running command that produces no output for a
minute) must never be mistaken for "done". This is fix #3 on the retire side.

### 2c. Bridge-session extended grace (cli_inner_pretty.js:560121)

**What it does:** when the job state carries a `bridgeSessionId`, use the **larger** of the base grace and the
bridged grace as the idle window:
```javascript
let effectiveGrace = job.bridgeSessionId ? Math.max(graceMs, bridgedGraceMs) : graceMs;
```

**How it works:**
1. `bridgeSessionId` is an optional field on the job-state schema (cli_inner_pretty.js:184381). It is set when a
   bg worker is bridged to a live REPL session (the `/bg`-while-responding handoff; the bridge-session identity
   itself predates 2.1.156 — see `src/bridge/replBridge.ts` in 2.1.88).
2. The supervisor passes `B = Ve4()` (cli_inner_pretty.js:647993, normal path) as `bridgedGraceMs`. `Ve4` reads
   the `tengu_bg_retire_grace_bridged_min` gate, default **480 minutes** (cli_inner_pretty.js:540464).
3. `Math.max(graceMs, bridgedGraceMs)` ensures the bridged window can only *extend*, never shorten, the base
   grace — important because under low memory the base grace is 60s, and we still want the larger bridged window
   for a bridged session under normal pressure but the *smaller* of the two under pressure (since the low-mem path
   passes the short grace for both arguments, see Section 4).

**Why this approach:** a bridged session is conceptually "owned" by an interactive REPL that may go quiet for a
long time (the user is thinking, or the foreground turn is paused). Reaping it at the normal 1-hour idle grace
would yank a session the user still considers live. The default 480-minute window (8 hours) is generous enough to
survive a workday of intermittent activity, and the telemetry `tengu_bg_retired` payload records `bridged: true`
(cli_inner_pretty.js:560130) so the longer-lived bridged retirements are observable.

---

## 3. `respawnIfIdleStale(H)` — exec short-circuit, version compare, pinned-respawn

This is the gentle upgrade path: when the daemon's own binary has changed, idle workers are asked to gracefully
shut down so they respawn under the new binary. v2.1.156 makes three changes.

```javascript
// ============================================
// BgWorkerHandle.respawnIfIdleStale - upgrade-driven respawn (exec exclusion, VERSION compare, pinned-settled respawn)
// Location: cli_inner_pretty.js:560029-560061
// ============================================

// ORIGINAL (for source lookup):
async respawnIfIdleStale(H) {
  if (this.dispatch.launch.mode === "exec") return { respawned: !1, reason: "not-stale" };
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (!this.record.cliVersion ||
      this.record.cliVersion === { /* build metadata */ VERSION: "2.1.156", /* … */ }.VERSION)
    return { respawned: !1, reason: "not-stale" };
  let $ = await a7(m9(this.dispatch.short));
  if (this.isTransitioning) return { respawned: !1, reason: "in-progress" };
  if (this.record.outcome) return { respawned: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: !1, reason: "attached" };
  if (!$) return { respawned: !1, reason: "no-state" };
  if (_J($) && !H?.has(this.dispatch.short)) return { respawned: !1, reason: "settled" };
  if (!_J($) && $.tempo !== "idle") return { respawned: !1, reason: "busy" };
  if (!this.transitionTo({ kind: "upgrading" })) return { respawned: !1, reason: "in-progress" };
  return (this.onState.emit({ pid: this.record.pid }),
    d("tengu_bg_respawn_stale", { short: this.dispatch.short, rvSent: this.shutdownWorker() }),
    { respawned: !0 });
}

// READABLE (for understanding):
async respawnIfIdleStale(pinnedSet) {
  if (this.dispatch.launch.mode === "exec") return { respawned: false, reason: "not-stale" }; // FIX #3: never respawn a shell run
  if (this.isTransitioning) return { respawned: false, reason: "in-progress" };
  if (this.record.outcome) return { respawned: false, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: false, reason: "attached" };

  // version compare against the build's own VERSION literal ("2.1.156")
  if (!this.record.cliVersion || this.record.cliVersion === CURRENT_BUILD_VERSION /* "2.1.156" */)
    return { respawned: false, reason: "not-stale" };

  let job = await readJobState(jobDir(this.dispatch.short));
  if (this.isTransitioning) return { respawned: false, reason: "in-progress" };
  if (this.record.outcome) return { respawned: false, reason: "no-state" };
  if (this.attachers.size > 0) return { respawned: false, reason: "attached" };
  if (!job) return { respawned: false, reason: "no-state" };

  // FIX #1: a SETTLED worker is normally left alone — UNLESS it is pinned, in which case respawn it once.
  if (isSettledState(job) && !pinnedSet?.has(this.dispatch.short)) return { respawned: false, reason: "settled" };
  // a non-settled worker must be idle to be respawned (never interrupt active work)
  if (!isSettledState(job) && job.tempo !== "idle") return { respawned: false, reason: "busy" };

  if (!this.transitionTo({ kind: "upgrading" })) return { respawned: false, reason: "in-progress" };
  this.onState.emit({ pid: this.record.pid });
  emit("tengu_bg_respawn_stale", { short: this.dispatch.short, rvSent: this.shutdownWorker() });
  return { respawned: true };
}

// Mapping: H→pinnedSet, $→job, a7→readJobState, m9→jobDir, d→emit, _J→isSettledState,
//          VERSION:"2.1.156"→CURRENT_BUILD_VERSION
```

### 3a. Exec short-circuit (cli_inner_pretty.js:560030)

The **very first** statement now returns `{ respawned: false, reason: "not-stale" }` for an exec worker. A shell
command launched via `claude --bg --exec` must run to completion under the binary it started with — restarting it
under a new binary mid-run would either re-run the command or lose its output. This is the respawn half of fix #3.
(The retire half is the `launch.mode !== "exec"` guard in §2b.)

### 3b. Version compare against the inlined build `VERSION` (cli_inner_pretty.js:560035-560047)

**What it does:** treats a worker as "stale" only when its recorded `cliVersion` differs from the build's own
version string.

**How it works:** the bundle inlines the entire build-metadata object literal and immediately projects `.VERSION`
off it (cli_inner_pretty.js:560041 — `VERSION: "2.1.156"`). So the comparison is effectively
`this.record.cliVersion !== "2.1.156"`. If `cliVersion` is missing or already equals `"2.1.156"`, the worker is
**not** stale → `reason: "not-stale"`. The same metadata literal is written into `record.cliVersion` at
construction (cli_inner_pretty.js:560168), so a freshly spawned 2.1.156 worker compares equal and is never
flagged.

**Why this approach:** comparing against a *compile-time constant* (the literal baked into this build) rather than
a runtime lookup means a stale worker is precisely "any worker not started by this exact binary". There is no
ambiguity about which version "current" is — it is the version of the process running the supervisor.

### 3c. Settled-and-pinned workers DO respawn (cli_inner_pretty.js:560053)

**What it does:** the settled refusal now has an escape hatch for pins:
```javascript
if (isSettledState(job) && !pinnedSet?.has(this.dispatch.short)) return { respawned: false, reason: "settled" };
```

**How it works:**
1. For a **non-pinned** settled worker the condition is `true → false-respawn` — unchanged from before; a finished
   worker stays finished.
2. For a **pinned** settled worker `!pinnedSet.has(...)` is `false`, so the whole condition is `false` and we
   **fall through** — the worker is allowed to respawn under the new binary.
3. The next line (`!isSettledState(job) && job.tempo !== "idle"`) is also `false` for a settled worker (because
   `isSettledState` is true), so we reach the `transitionTo({ kind: "upgrading" })` and emit
   `tengu_bg_respawn_stale` (cli_inner_pretty.js:560058).

**Why this approach — the "respawning every minute" bug, dissected:**

Consider a pinned bg session that finished its task (settled) on the old binary, then the user upgrades. The
supervisor tick runs every 60s. Walk the two functions per tick:

```
                    OLD behaviour (pre-2.1.156)            2.1.156 behaviour
                    ───────────────────────────            ─────────────────
respawnIfIdleStale: settled → REFUSE "settled"             pinned+settled → RESPAWN once
                    (so it was NEVER respawned… but)        (transitions to "upgrading")
retireIfSettled:    settled, idle-grace elapsed →           pinned → REFUSE "pinned"
                    RETIRE … then the supervisor            (never retired)
                    would re-create / the pin would
                    re-add it → respawn → settle → retire …
```

The instability came from the interaction: a pinned session was getting retired by the idle-grace path
(`retireIfSettled` had **no pinned guard**), and the pin machinery would bring it back, only for it to settle and
be retired again — a one-minute respawn cycle. v2.1.156 closes both halves:

- `retireIfSettled` refuses pinned workers outright (§2a) — so the pin is never reaped by idle grace.
- `respawnIfIdleStale` respawns a pinned settled worker **exactly once** — after the respawn the worker is running
  the new binary, its `cliVersion` now equals `"2.1.156"`, so the next tick's version compare returns
  `"not-stale"`. No more respawns.

**Key insight:** the fix is *symmetric*. Neither half alone is sufficient — adding the pinned guard to retire
without the pinned-respawn escape would leave pinned sessions stuck on the old binary forever; adding pinned
respawn without the retire guard would keep the thrash. Together they give the intended "respawn once on upgrade,
then leave it alone" behaviour.

---

## 4. The supervisor tick — `setInterval(…, vzq=60000)` (cli_inner_pretty.js:647980-648023)

The supervisor runs one tick a minute. v2.1.156's reliability fixes are orchestrated here.

```javascript
// ============================================
// runDaemonSupervisor tick - sleep/wake guard, pinned respawn, retire pass, low-mem escalation
// Location: cli_inner_pretty.js:647980-648023
// ============================================

// ORIGINAL (for source lookup):
let V = Date.now(),
  v = setInterval(async (E, S) => {
    let h = Date.now(), I = h - V - vzq;
    if (((V = h), I > vzq)) {                                // wall-clock jumped (sleep/wake)
      for (let Q of E.values()) Q.shiftGraceClocksForward(I);
      S(); return;
    }
    let C = By$(),                                           // low memory?
      b = C ? Vzq : mpz,                                     // retire grace: 60s vs 1h
      B = C ? Vzq : Ve4(),                                   // bridged grace: 60s vs ~480min
      R = await Qw$().catch((Q) => { return (hH(Q), new Set()); }); // fresh pinned set
    for (let Q of E.values()) if (R.has(Q.dispatch.short)) Q.respawnIfIdleStale(R).catch((g) => hH(g));
    let x = await Promise.all([...E.values()].map((Q) =>
        Q.retireIfSettled(b, R, B).then((g) => g.retired).catch((g) => { return (hH(g), !1); }))),
      U = H6(x, (Q) => Q);                                   // count retired this tick
    if (C && U === 0 && By$()) {                             // low-mem persists, nothing shed
      let Q = [...E.values()].filter((g) => R.has(g.dispatch.short));   // the pinned ones
      if (Q.length > 0) {
        (H("bg: low memory persists after shedding non-pinned — retiring pinned settled workers as a last resort"),
          d("tengu_bg_retire_pinned_low_mem", {}));
        for (let g of Q) g.retireIfSettled(b, Bpz, B).catch((l) => hH(l));     // Bpz = EMPTY pin set
      }
    }
    S();
  }, vzq, q, w);

// READABLE (for understanding):
let lastTickAt = Date.now();
let timer = setInterval(async (handles, scheduleSweep) => {
  let now = Date.now();
  let overshoot = now - lastTickAt - TICK_INTERVAL_MS;          // expected ~0; large ⇒ wall-clock jumped
  lastTickAt = now;
  if (overshoot > TICK_INTERVAL_MS) {                            // slept/woke between ticks
    for (let h of handles.values()) h.shiftGraceClocksForward(overshoot);
    scheduleSweep();
    return;                                                      // skip retire/respawn THIS tick
  }

  let lowMem = isLowMemory();                                    // By$()
  let retireGrace  = lowMem ? LOW_MEM_GRACE_MS  : NORMAL_RETIRE_GRACE_MS; // 60s : 1h
  let bridgedGrace = lowMem ? LOW_MEM_GRACE_MS  : bridgedRetireGraceMs(); // 60s : ~480min
  let pinned = await loadPinnedSet().catch((e) => { logError(e); return new Set(); });

  // upgrade-respawn ONLY pinned workers (non-pinned settled workers just retire normally)
  for (let h of handles.values())
    if (pinned.has(h.dispatch.short)) h.respawnIfIdleStale(pinned).catch(logError);

  // retire pass — pinned workers refuse (reason "pinned")
  let retiredFlags = await Promise.all([...handles.values()].map((h) =>
    h.retireIfSettled(retireGrace, pinned, bridgedGrace).then((r) => r.retired).catch((e) => { logError(e); return false; })));
  let retiredCount = countTrue(retiredFlags);

  // LOW-MEM ESCALATION: pressure persists AND we shed nothing ⇒ retire pinned settled as last resort
  if (lowMem && retiredCount === 0 && isLowMemory()) {
    let pinnedHandles = [...handles.values()].filter((h) => pinned.has(h.dispatch.short));
    if (pinnedHandles.length > 0) {
      logWarn("bg: low memory persists after shedding non-pinned — retiring pinned settled workers as a last resort");
      emit("tengu_bg_retire_pinned_low_mem", {});
      for (let h of pinnedHandles)
        h.retireIfSettled(retireGrace, EMPTY_PIN_SET /* Bpz */, bridgedGrace).catch(logError); // EMPTY set ⇒ pinned guard bypassed
    }
  }
  scheduleSweep();
}, TICK_INTERVAL_MS, handles, scheduleSweep);

// Mapping: V→lastTickAt, I→overshoot, vzq→TICK_INTERVAL_MS, C→lowMem, By$→isLowMemory,
//          b→retireGrace, mpz→NORMAL_RETIRE_GRACE_MS, Vzq→LOW_MEM_GRACE_MS,
//          B→bridgedGrace, Ve4→bridgedRetireGraceMs, R→pinned, Qw$→loadPinnedSet,
//          x→retiredFlags, U→retiredCount, H6→countTrue, Bpz→EMPTY_PIN_SET, d→emit, hH→logError
```

### 4a. Sleep/wake guard (cli_inner_pretty.js:647984-647990)

**What it does:** detects that the host slept between ticks and compensates the grace clocks instead of running
the retire pass.

**How it works:**
1. Each tick computes `overshoot = now - lastTickAt - TICK_INTERVAL_MS`. On a healthy 60s cadence this is ≈ 0.
2. If `overshoot > TICK_INTERVAL_MS` (i.e. more than one whole extra interval elapsed — the host was asleep), it
   calls `shiftGraceClocksForward(overshoot)` on every worker and **returns early**, skipping retire/respawn for
   this tick.
3. `shiftGraceClocksForward` (cli_inner_pretty.js:560318-560322) pushes `adoptedAt` and `lastInputAt` forward by
   `overshoot` so the post-adopt grace (`GPz` = 120s) and recent-input grace are not seen as "expired" merely
   because wall-clock time advanced during sleep.

```javascript
// ============================================
// BgWorkerHandle.shiftGraceClocksForward - move grace clocks forward across a sleep/wake gap
// Location: cli_inner_pretty.js:560318-560322
// ============================================

// ORIGINAL (for source lookup):
shiftGraceClocksForward(H) {
  if (H <= 0) return;
  if (this.adoptedAt !== void 0) this.adoptedAt += H;
  if (this.lastInputAt !== void 0) this.lastInputAt += H;
}

// READABLE (for understanding):
shiftGraceClocksForward(deltaMs) {
  if (deltaMs <= 0) return;
  if (this.adoptedAt !== undefined) this.adoptedAt += deltaMs;     // post-adopt grace stays "fresh"
  if (this.lastInputAt !== undefined) this.lastInputAt += deltaMs; // recent-input grace stays "fresh"
}

// Mapping: H→deltaMs
```

**Why this approach:** without the shim, every macOS sleep longer than the grace would immediately retire all
adopted / recently-active workers on wake. Shifting the clocks forward (rather than storing a monotonic reference)
is the minimal change because the rest of the handle compares against `Date.now()` everywhere. **Skipping the
retire pass on a jump tick** is also deliberate: the disk state read during the jump tick could reflect a moment
long past, so the supervisor waits one clean tick before judging idleness again. (The method itself is from
v2.1.142; the tick wiring that calls it on overshoot is the relevant 2.1.156 surface here.)

### 4b. Pinned-only respawn, all-worker retire (cli_inner_pretty.js:647997-648006)

The respawn loop only calls `respawnIfIdleStale` for workers whose `short` is in the pinned set
(cli_inner_pretty.js:647997). Non-pinned workers are never *upgrade-respawned* — if a non-pinned worker is stale
and settled it will simply be retired by the retire pass and (if needed) re-dispatched fresh later. Passing the
pinned set `R` into `respawnIfIdleStale(R)` is what lets §3c's pinned-settled escape fire.

The retire loop calls `retireIfSettled(b, R, B)` on **every** worker concurrently
(cli_inner_pretty.js:647998-648006). `b` is the (possibly shortened) grace, `R` the pinned set (pinned workers
self-refuse), `B` the bridged grace.

### 4c. Low-memory escalation → `tengu_bg_retire_pinned_low_mem` (cli_inner_pretty.js:648008-648016)

**What it does:** as a last resort under sustained memory pressure, retires even pinned, settled workers.

**How it works — the triple condition (cli_inner_pretty.js:648008):**
```
if (lowMem && retiredCount === 0 && isLowMemory())
```
1. `lowMem` — this tick *started* under memory pressure (`By$()` at tick top, cli_inner_pretty.js:647991).
2. `retiredCount === 0` — the normal retire pass (with 60s grace) shed **nothing**. So all retire candidates were
   either busy, attached, in-flight, or *pinned*.
3. `isLowMemory()` again — re-checks pressure *after* the retire pass; if the pass had freed memory we would skip
   escalation. (The double check guards against acting on stale pressure.)

When all three hold, it gathers the pinned handles (cli_inner_pretty.js:648009), logs the warning, emits
`tengu_bg_retire_pinned_low_mem` (cli_inner_pretty.js:648011-648014), and calls
`retireIfSettled(b, Bpz, B)` on each — crucially passing `Bpz` (an **empty** Set, cli_inner_pretty.js:648202,
648221) as the pinned set. With an empty pinned set, the `$?.has(...)` guard in `retireIfSettled`
(cli_inner_pretty.js:560066) is `false`, so the pinned guard is bypassed and the worker is judged on the ordinary
settled / grace rules. A *pinned but still-busy* worker remains protected by the in-flight / `tempo` checks — only
genuinely settled pinned workers are shed.

**Memory threshold (cli_inner_pretty.js:540455-540462):**
```javascript
function iy8() {                                   // lowMemThresholdBytes
  if (n$() === "macos") return 0;                  // disabled on macOS (freemem() is misleading there)
  return V$("tengu_bg_low_mem_mb", 1024) * 1024 * 1024;   // default 1 GiB
}
function By$() {                                    // isLowMemory
  let H = iy8();
  return H > 0 && Te4.freemem() < H;               // H==0 ⇒ always false ⇒ macOS never escalates
}
```
On macOS the threshold is `0`, so `By$()` is always `false` — the entire low-memory escalation (and the shortened
grace) is **a no-op on macOS**, where `os.freemem()` does not reflect real pressure. On Linux/Windows the default
trips when free memory drops below 1 GiB, configurable via the `tengu_bg_low_mem_mb` gate.

**Why this approach:** memory pressure is a global, host-level emergency — if the daemon's workers are about to
get OOM-killed, retiring a pinned-but-finished session is far better than the kernel reaping a random process. The
design honors the user's pin under normal conditions but treats it as a *soft* preference that yields to hard
system limits. The ordering — shed non-pinned first (normal pass), only escalate to pinned when that shed nothing
*and* pressure persists — guarantees pins are the **last** thing sacrificed, and the dedicated telemetry event
makes these rare last-resort retirements auditable.

**Key insight:** the empty-Set trick (`Bpz`) is an elegant reuse: rather than add a `force` boolean parameter to
`retireIfSettled`, the supervisor simply lies about the pinned set on the escalation pass. The same function, same
in-flight/grace safety checks, just without the pin exemption.

---

## 5. The pinned set: `loadPinnedSet` (`Qw$`) and its fallback

The pinned set is reloaded **from disk every tick** (cli_inner_pretty.js:647994), so pin/unpin changes take effect
within one minute without restarting the daemon.

```javascript
// ============================================
// loadPinnedSet - read pins.json into a Set, falling back to per-dir markers
// Location: cli_inner_pretty.js:184009-184047
// ============================================

// ORIGINAL (for source lookup):
function gL6() { return QP.join($0(), "pins.json"); }
async function Qw$() {
  try {
    let H = await FP.readFile(gL6(), "utf-8"), $ = B$(H);
    if (!Array.isArray($)) return new Set();
    return new Set($.filter((q) => typeof q === "string"));
  } catch (H) {
    if (P8(H)) return LL5();          // ENOENT ⇒ rebuild from per-dir markers
    return new Set();
  }
}
async function LL5() { /* scan each bg dir for a `pinned` marker file, then persist pins.json */ }

// READABLE (for understanding):
function pinsFilePath() { return path.join(bgDir(), "pins.json"); }
async function loadPinnedSet() {
  try {
    let raw = await fs.readFile(pinsFilePath(), "utf-8");
    let arr = parseJson(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((id) => typeof id === "string"));
  } catch (e) {
    if (isENOENT(e)) return rebuildPinnedFromMarkers();   // legacy fallback + self-heal pins.json
    return new Set();                                     // any other error ⇒ treat as no pins
  }
}

// Mapping: gL6→pinsFilePath, Qw$→loadPinnedSet, LL5→rebuildPinnedFromMarkers, $0→bgDir,
//          B$→parseJson, P8→isENOENT, FP→fs
```

If `pins.json` is missing, `rebuildPinnedFromMarkers` (`LL5`, cli_inner_pretty.js:184023-184047) scans each bg
session directory for a `pinned` marker file, builds the set, and writes a consolidated `pins.json`
(`u$7`/`writePins` at cli_inner_pretty.js:184048-184051) — a one-time migration from the older per-dir marker
scheme to the consolidated file. Any other read/parse error yields an empty set, which is the **safe default**: if
we cannot tell what is pinned, we treat nothing as pinned and let the ordinary retire rules apply (worst case a
finished session is reaped a bit early — recoverable — rather than leaking workers forever).

---

## 6. Grace constants and gates (one place)

The supervisor's grace/tick constants (list format per project rules; full mapping table in the
[symbol_additions_v2_1_156_background_agents.md](../00_overview/symbol_additions_v2_1_156_background_agents.md)
and the central [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)):

- `TICK_INTERVAL_MS` (`vzq`) — `60000`; supervisor tick cadence (cli_inner_pretty.js:648201)
- `LOW_MEM_GRACE_MS` (`Vzq`) — `60000`; retire/bridged grace under memory pressure (cli_inner_pretty.js:648200)
- `NORMAL_RETIRE_GRACE_MS` (`mpz`) — `3600000`; retire grace, normal (cli_inner_pretty.js:648199)
- `POST_ADOPT_GRACE_MS` (`GPz`) — `120000`; adopted-worker settle grace (cli_inner_pretty.js:560836)
- `EMPTY_IDLE_GRACE_MS` (`TPz`) — `300000`; abandoned empty-bg-session grace (cli_inner_pretty.js:560837)
- `EMPTY_PIN_SET` (`Bpz`) — `new Set()`; empty pin set ⇒ low-mem pinned shed (cli_inner_pretty.js:648202, 648221)

`bridgedRetireGraceMs` (`Ve4`, cli_inner_pretty.js:540463-540465) is a *gate read*, not a constant:
`V$("tengu_bg_retire_grace_bridged_min", 480) * 60000` → default 28,800,000 ms (8 h).

---

## 7. Putting it together — one supervisor tick, annotated

```
                         ┌───────────────────────────────────────────────┐
                         │  setInterval every vzq = 60_000 ms             │
                         └───────────────────────────────────────────────┘
                                            │
                 overshoot = now - lastTickAt - 60_000
                                            │
              ┌──────── overshoot > 60_000 (slept) ────────┐
              ▼                                             ▼ (normal)
   shiftGraceClocksForward(overshoot)              lowMem = isLowMemory()  (always false on macOS)
   on every worker; RETURN (skip pass)             grace  = lowMem ? 60s : 1h
                                                    bridged= lowMem ? 60s : ~480min
                                                    pinned = loadPinnedSet()      ← from pins.json each tick
                                                            │
                                   ┌─────────── respawn loop (pinned workers only) ───────────┐
                                   │  respawnIfIdleStale(pinned):                              │
                                   │   • exec? → not-stale                                     │
                                   │   • cliVersion == "2.1.156"? → not-stale                  │
                                   │   • settled & NOT pinned? → settled  (skip)               │
                                   │   • settled & pinned?      → RESPAWN once (→ upgrading)    │
                                   │   • !settled & tempo!=idle? → busy                        │
                                   └───────────────────────────────────────────────────────────┘
                                                            │
                                   ┌─────────── retire pass (ALL workers) ─────────────────────┐
                                   │  retireIfSettled(grace, pinned, bridged):                 │
                                   │   • pinned? → REFUSE "pinned"                             │
                                   │   • settled OR (non-exec & idle/doubly-blocked)?          │
                                   │       AND no in-flight/cron/routine                       │
                                   │       AND idle ≥ (bridge? max(grace,bridged):grace)       │
                                   │     → retire(grace) → tengu_bg_retired                    │
                                   └───────────────────────────────────────────────────────────┘
                                                            │
                          lowMem && retiredCount==0 && isLowMemory()?
                                                            │ yes
                                   ┌─────────── LOW-MEM ESCALATION ───────────────────────────┐
                                   │  log warning; emit tengu_bg_retire_pinned_low_mem        │
                                   │  for each pinned worker:                                 │
                                   │    retireIfSettled(grace, EMPTY_SET, bridged)            │
                                   │      ↳ pinned guard bypassed (empty set)                 │
                                   │      ↳ still protected by in-flight/tempo checks         │
                                   └───────────────────────────────────────────────────────────┘
```

---

## 8. Cross-validation with v2.1.88 (confidence: HIGH)

- **No precursor for the handle/phase machine.** Grepping `/lyz/codespace/3rd/claude-code/src` for
  `retireIfSettled`, `respawnIfIdleStale`, `BgWorkerHandle`, `shiftGraceClocksForward`, and `pins.json` returns
  nothing. v2.1.88 background sessions are managed by `src/utils/concurrentSessions.ts` with implicit boolean state
  — there is no formal retire/respawn predicate. The entire worker-handle phase machine (and therefore everything
  in this document) is **NEW post-2.1.88**, consistent with the v2.1.142 reference's conclusion.
- **`bridgeSessionId` has a partial precursor.** The REPL-bridge session concept exists in v2.1.88
  (`src/bridge/replBridge.ts`, `src/bridge/replBridgeHandle.ts`), so the *identity* a bridged bg session carries is
  not new. But the **bridge-grace retire logic** (`Math.max(grace, bridgedGrace)` keyed off `job.bridgeSessionId`,
  cli_inner_pretty.js:560121) is new to the daemon supervisor and has no 2.1.88 analog.
- **Pinning, low-memory shedding, and the broadened settled predicate are all NEW** with no 2.1.88 counterpart.

## 9. Deltas vs the v2.1.142 worker_state_machine.md

| Aspect | v2.1.142 | v2.1.156 | Line |
|--------|----------|----------|------|
| Handle class id | `aB` | `SF` | 559938 |
| Guard / formatter ids | `UB5` / `FI4` | `VPz` / `yq9` (logic identical) | 559920-559937 |
| `retireIfSettled` signature | `(graceMs)` | `(grace, pinnedSet, bridgedGrace=grace)` | 560062 |
| Pinned retire refusal | — | `reason: "pinned"` | 560066 |
| Settled predicate | `isSettledState` only | + non-exec idle / doubly-blocked branch | 560110-560117 |
| Exec exclusion (retire) | — | `launch.mode !== "exec"` in predicate | 560113 |
| Bridge grace | — | `Math.max(grace, bridgedGrace)` when bridged | 560121 |
| `respawnIfIdleStale` exec exclusion | — | first-line `"not-stale"` for exec | 560030 |
| Version compare | `state.cliVersion === CURRENT` | inlined `VERSION:"2.1.156"` literal | 560035-560047 |
| Settled-and-pinned respawn | refused all settled | respawn settled **if pinned** | 560053 |
| Supervisor tick low-mem shed | — | `tengu_bg_retire_pinned_low_mem` + empty-set bypass | 647991-648016 |
| Pinned set source | — | `pins.json` reloaded per tick (`Qw$`) | 184012, 647994 |

Everything else — phase enum, transition matrix, `onExit`, `settle`, `scheduleRespawn`, the four static factories,
and the `shiftGraceClocksForward` method body — is unchanged from v2.1.142; see that document for the full
treatment.

---

## Appendix — telemetry events touched here

- `tengu_bg_respawn_stale` — emitted on upgrade-respawn (cli_inner_pretty.js:560058).
- `tengu_bg_retired` — emitted on each retire, with `state`/`settledForMs`/`bridged` (cli_inner_pretty.js:560076,
  560101, 560126).
- `tengu_bg_retire_pinned_low_mem` — emitted once per low-mem escalation (cli_inner_pretty.js:648014).
- `tengu_bg_phase_illegal` — emitted on a refused transition (cli_inner_pretty.js:560009).
