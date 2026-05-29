# Worker Phase State Machine (`BgWorkerHandle` / `aB`) — v2.1.142

## Why a Formal Phase Machine

The supervisor (`runDaemonSupervisor` / `O89`) holds one `BgWorkerHandle` (`aB`) per background worker. Each handle tracks:
- **PTY plumbing** (the spawned terminal process and its sockets)
- **Stream/state/settle event emitters** (subscribers consume these)
- **Retire and respawn timers**
- **A discriminated-union `phase` field** that tracks what the worker is *currently doing*

The phase field is the source of truth for "can the worker accept input / be retired / be respawned right now?" Without it, the supervisor would have to inspect a half-dozen booleans (pty present? rv connected? exit reported? respawning?) — and would get races where two code paths concurrently transition to incompatible states.

The phase enum is **closed** (5 reachable kinds + 1 terminal) and **transitions are guarded** by `UB5(from, to)`. Any illegal transition is logged as `tengu_bg_phase_illegal` and *refused* (no mutation happens).

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

Key symbols:
- `BgWorkerHandle` (`aB`) — the worker-handle class (cli_inner_pretty.js:527781-528596)
- `BgWorkerHandle.transitionTo` — guarded mutation (cli_inner_pretty.js:527843-527853)
- `isLegalPhaseTransition` (`UB5`) — the guard function (cli_inner_pretty.js:527766-527780)
- `formatPhase` (`FI4`) — for log strings (cli_inner_pretty.js:527763-527765)
- `BgWorkerHandle.retireIfSettled` — per-tick retire predicate (cli_inner_pretty.js:527901-527964)
- `BgWorkerHandle.respawnIfIdleStale` — upgrade-driven respawn (cli_inner_pretty.js:527869-527900)
- `BgWorkerHandle.onExit` — exit-code → outcome decision (cli_inner_pretty.js:528423-528481)
- `BgWorkerHandle.scheduleRespawn` — backoff respawn (cli_inner_pretty.js:528487-528506)
- `BgWorkerHandle.settle` — terminal transition (cli_inner_pretty.js:528507-528519)
- `BgWorkerHandle.shiftGraceClocksForward` — sleep/wake adjustment (cli_inner_pretty.js:528143-528147)

Static factory functions:
- `BgWorkerHandle.spawn` — cold spawn (cli_inner_pretty.js:528010-528014)
- `BgWorkerHandle.claim` — claim a pre-warmed spare (cli_inner_pretty.js:528015-528044)
- `BgWorkerHandle.adopt` — adopt an orphan worker from previous daemon (cli_inner_pretty.js:528052-528092)
- `BgWorkerHandle.unverified` — adopt without pid verification (cli_inner_pretty.js:528093-528125)

## Phase Enum

| `phase.kind` | Meaning | Set when |
|--------------|---------|----------|
| `spawning` | Worker process being started or respawned | constructor (default), `doSpawn` (cold/respawn), `scheduleRespawn` |
| `running` | Worker is alive and rv-connected | `wirePty` after PTY successfully spawns and is wired |
| `upgrading` | Binary upgrade detected; worker is being asked to gracefully shut down so a respawn under the new binary occurs | `respawnIfIdleStale` (rv `shutdown` sent), `adopt` if previous supervisor flagged `pendingRespawn: "upgrade"` |
| `retiring` | Worker is being retired; subtypes by `reason` | `retireIfSettled` (grace), `stop()` (orderly stop), `kill()` (reap) |
| `retired` | **Terminal state**; record's `outcome` is fixed | `settle()` |

### `retiring` subtypes (`reason`)

```typescript
phase = { kind: "retiring", reason: "grace" }   // settled-grace-elapsed retire
phase = { kind: "retiring", reason: "stop"  }   // detach, no kill
phase = { kind: "retiring", reason: "reap"  }   // kill() — SIGTERM/SIGKILL
```

The `reason` is consulted by `onExit` to choose the right outcome label and by `stop()` to decide whether to short-circuit settle.

### `retired` outcome

```typescript
phase = { kind: "retired", outcome: "done" | "crashed" | "killed" }
```

Once `retired`, no further transitions are legal — `UB5(retired, anything) === false`.

## Transition Diagram

```
                                          ┌─────────────────────────┐
                                          │   spawning              │
                                          │   (initial / respawn)   │
                                          └──────────┬──────────────┘
                                                     │ wirePty()
                                                     ▼
       ┌──────── doSpawn() ─────────┐   ┌─────────────────────────┐
       │  (after wirePty crash)     │   │   running               │
       │                            │   │   (PTY alive, RV up)    │
       │                            ├──►└──────┬──────────────────┘
       │                            │          │
       │                            │  upgrading detected
       │                            │  (respawnIfIdleStale or
       │                            │   adopt pendingRespawn)
       │                            │          │
       │                            │          ▼
       │                            │   ┌─────────────────────────┐
       │                            │   │   upgrading             │
       │                            │   │   (rv shutdown sent)    │
       │                            │   └──────┬──────────────────┘
       │                            │          │ onExit (any code)
       │                            │          ▼
       │                            ├──►(spawning, attempt=1)
       │                            │
       │                            │  retireIfSettled (grace) │  stop()       │  kill()
       │                            │          │               │               │
       │                            │          ▼               ▼               ▼
       │                            │   ┌──────────────┐  ┌──────────────┐ ┌──────────────┐
       │                            │   │ retiring     │  │ retiring     │ │ retiring     │
       │                            │   │ reason=grace │  │ reason=stop  │ │ reason=reap  │
       │                            │   └──────┬───────┘  └──────┬───────┘ └──────┬───────┘
       │                            │          │ onExit          │ onExit         │ pty.kill
       │                            │          ▼                 ▼                ▼
       └────────────────────────────┴──►┌─────────────────────────┐
                                        │   retired (terminal)    │
                                        │   outcome: done/crashed │
                                        │             /killed     │
                                        └─────────────────────────┘
```

## Guard: `isLegalPhaseTransition` (`UB5`)

```javascript
// ============================================
// isLegalPhaseTransition — guard for transitionTo
// Location: cli_inner_pretty.js:527766-527780
// ============================================

// ORIGINAL:
function UB5(H, $) {
  if (H.kind === "retired") return !1;
  switch ($.kind) {
    case "spawning": return H.kind === "upgrading" || H.kind === "running";
    case "running":  return H.kind === "spawning";
    case "upgrading":return H.kind === "running";
    case "retiring": return !0;
    case "retired":  return !0;
  }
}

// READABLE:
function isLegalPhaseTransition(from, to) {
  if (from.kind === "retired") return false;       // terminal
  switch (to.kind) {
    case "spawning":  return from.kind === "upgrading" || from.kind === "running";
    case "running":   return from.kind === "spawning";
    case "upgrading": return from.kind === "running";
    case "retiring":  return true;                 // can retire from anywhere
    case "retired":   return true;
  }
}

// Mapping: UB5→isLegalPhaseTransition, H→from, $→to
```

The matrix this encodes:

| from \ to | spawning | running | upgrading | retiring | retired |
|-----------|----------|---------|-----------|----------|---------|
| spawning  | ✗        | ✓       | ✗         | ✓        | ✓       |
| running   | ✓        | ✗       | ✓         | ✓        | ✓       |
| upgrading | ✓        | ✗       | ✗         | ✓        | ✓       |
| retiring  | ✗        | ✗       | ✗         | ✓        | ✓       |
| retired   | ✗        | ✗       | ✗         | ✗        | ✗       |

**Surprises in this matrix:**
- `spawning → running` only — you cannot go directly to `upgrading` (must finish spawn first).
- `running → spawning` is the **respawn path**. The worker died and we're starting it over.
- `upgrading → spawning` is the **upgrade-respawn path**. The graceful shutdown completed; we respawn under the new binary.
- `retiring → retiring` is legal because `reason` can change (e.g. grace → reap if user clicks kill).
- `retired → retired` is the only "no-op" — settle() calls transition first to ensure phase is terminal.

## Retire Decision (`retireIfSettled`)

Called per-tick (`Ur6 = 60_000ms` interval). Returns `{ retired: true }` or `{ retired: false, reason: "..." }`:

```javascript
async retireIfSettled(graceMs) {
  if (this.isTransitioning) return { retired: false, reason: "in-progress" };
  if (this.record.outcome) return { retired: false, reason: "no-state" };
  if (this.attachers.size > 0) return { retired: false, reason: "attached" };
  if (this.adoptedAt && Date.now() - this.adoptedAt < BB5)  // 120s post-adopt grace
    return { retired: false, reason: "recent-adopt" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < graceMs)
    return { retired: false, reason: "recent-input" };

  let state = await readJobState(this.dispatch.short);
  // [re-check in-progress and recent-input after the await — possible race]
  if (!state) {
    if (this.dispatch.source === "spare" && Date.now() - this.dispatch.createdAt > graceMs) {
      // Stale spare: retire it
      if (!this.transitionTo({ kind: "retiring", reason: "grace" }))
        return { retired: false, reason: "in-progress" };
      emit("tengu_bg_retired", { state: "stale-spare", ... });
      return { retired: true };
    }
    return { retired: false, reason: "no-state" };
  }

  // Empty-idle bg session (v2.1.141): no name, no intent, no worktree, default template,
  // working+blocked — looks abandoned. Retire after 5 min (pB5).
  if (this.dispatch.source !== "shell" && !state.name && !state.intent && !state.worktreePath
      && state.template === "bg" && state.state === "working" && state.tempo === "blocked") {
    let age = Date.now() - Date.parse(state.createdAt);
    if (age < pB5) return { retired: false, reason: "empty-idle-grace" };
    if (!this.transitionTo({ kind: "retiring", reason: "grace" }))
      return { retired: false, reason: "in-progress" };
    this.deleteJobDirOnSettle = true;  // also delete the job dir
    emit("tengu_bg_retired", { state: "empty-idle", ... });
    return { retired: true };
  }

  if (!isSettledState(state)) return { retired: false, reason: "not-settled" };
  if ((state.inFlight?.tasks ?? 1) > 0 || (state.inFlight?.queued ?? 1) > 0)
    return { retired: false, reason: "inflight" };
  if (state.inFlight?.kinds.includes("session_cron"))
    return { retired: false, reason: "session-cron" };
  if (state.routine) return { retired: false, reason: "routine" };
  let idleMs = state.updatedAt && Date.now() - Date.parse(state.updatedAt);
  if (!idleMs || idleMs < graceMs) return { retired: false, reason: "grace" };

  if (!this.transitionTo({ kind: "retiring", reason: "grace" }))
    return { retired: false, reason: "in-progress" };
  emit("tengu_bg_retired", { state: state.state, settledForMs: idleMs, ... });
  return { retired: true };
}
```

### Decision precedence

The ordering of refusal conditions matters:
1. **Transitioning/outcome** — first, because retire would race a respawn.
2. **Attached** — never retire while a user is watching.
3. **Recent adopt (120s)** — give adopted workers time to settle their state.
4. **Recent input** — explicit user input is a strong "keep alive" signal.
5. **No state file** — `spare` workers age out; everyone else stays.
6. **Empty-idle** (v2.1.141) — heuristic for abandoned bg session that never received a prompt.
7. **In-flight tasks** — never retire mid-task.
8. **`session_cron` kind** — these are scheduled tasks; let them complete.
9. **Routine** — routines own their lifetime.
10. **Update-age** — fallback time-based retire.

The `inFlight` array's `kinds` field is what powers the v2.1.141 "completed_vs_working" classification (see [completed_vs_working.md](./completed_vs_working.md)). The presence of `session_cron` extends grace because cron-scheduled jobs naturally idle between fires.

## Idle-Stale Respawn (`respawnIfIdleStale`)

When the supervisor detects its own binary has changed (`tKA`/`binaryIdentityChanged`), it calls `onNudge` on all workers. Each worker:

```javascript
async respawnIfIdleStale() {
  // Refuse if: transitioning, settled, attached, no state, settled, or current version, or busy
  if (this.isTransitioning || this.record.outcome || this.attachers.size > 0)
    return { respawned: false };
  let state = await readJobState(this.dispatch.short);
  if (!state || isSettledState(state)) return { respawned: false };
  if (state.cliVersion === CURRENT_VERSION) return { respawned: false, reason: "not-stale" };
  if (state.tempo !== "idle") return { respawned: false, reason: "busy" };
  if (!this.transitionTo({ kind: "upgrading" })) return { respawned: false };
  this.shutdownWorker();   // rv shutdown → SIGTERM fallback in 5s
  emit("tengu_bg_respawn_stale", { short, rvSent });
  return { respawned: true };
}
```

This is the **gentle upgrade path**. The worker is asked to gracefully shut down via `rv.send({type:"shutdown"})`. When the worker process exits, `onExit` sees `phase.kind === "upgrading"` and transitions back to `spawning` with `attempt=1`, then re-spawns. The user sees a brief "upgrading…" interlude in any attached terminal.

Crucially, this only fires when:
- The worker's recorded `cliVersion` differs from the supervisor's (cli_inner_pretty.js:527880).
- The worker is `tempo: "idle"` — never mid-task.
- No user is attached.

So upgrades are *opportunistic*: only idle, unattended, version-mismatched workers respawn. Busy workers keep running their old binary until they finish their current task and idle out.

## Exit-Code → Outcome Decision (`onExit`)

When the PTY exits:

```javascript
onExit(code, signal) {
  if (this.isDetached) return;
  if (this.phase.kind === "retired") return;
  let uptimeMs = this.lastSpawnAt ? Date.now() - this.lastSpawnAt : undefined;
  let fastCrash = uptimeMs !== undefined && uptimeMs < xI4 /* 5000 */ && code !== 0;
  if (fastCrash) this.fastCrashStreak++;
  else this.fastCrashStreak = 0;
  let tooManyFastCrashes = this.fastCrashStreak >= 3;
  let preInitError = this.workerReady ? undefined : this.preInitErrorTail();
  let exitCause = code !== 0 ? readExitCause(jobDir) : undefined;
  let sameExitCause = fastCrash && !!exitCause && exitCause === this.lastExitCause;
  this.lastExitCause = fastCrash ? exitCause : undefined;

  let outcome;
  if (this.phase.kind === "retiring" && this.phase.reason === "reap")  outcome = this.killOutcome;
  else if (this.phase.kind === "retiring" && this.phase.reason === "grace") outcome = "done";
  else if (this.phase.kind === "upgrading") outcome = undefined;
  else if (code === 0)                                                 outcome = "done";
  else if ((!this.workerReady && (this.attempt >= 2 || preInitError))
           || tooManyFastCrashes
           || sameExitCause
           || this.attempt >= bI4 /* 20 */)                            outcome = "crashed";

  emit("tengu_bg_worker_exit", { ... });
  if (this.phase.kind === "retiring") return this.settle(outcome);
  if (this.phase.kind === "upgrading") { /* respawn under new binary */ return; }
  if (code === 0) return this.settle("done");
  // ... else respawn
}
```

### Crash-vs-respawn heuristics

Three decisions in this code matter:

1. **Fast-crash detection.** If the worker exited within 5s of spawn with non-zero code, increment `fastCrashStreak`. If we hit 3 in a row, give up — `outcome = "crashed"`. This prevents an infinite respawn loop on a worker that's broken at startup.

2. **Pre-init error tail.** If the worker died before reporting `workerReady` *and* we've already retried once, capture the last ~200 chars of stderr (`preInitErrorTail()`) and pin them to the record's `detail`. Helps the user diagnose. The "attempt ≥ 2" gate avoids surfacing tail on the first crash.

3. **Same-cause repeat.** If two consecutive crashes have identical exit-cause strings (read from a `crash_cause.txt` file the worker can drop on death), treat it as deterministic and stop respawning. This is for cases like "OAuth token expired" — respawning won't fix it.

If none of these crash-classifying conditions trip, we call `scheduleRespawn` with a `uB5 = 10s` backoff, capping respawn attempts at `bI4 = 20`. The 10s backoff prevents thrashing while leaving headroom for transient network issues.

## Settle (`settle`)

The terminal transition. Idempotent (checks `this.record.outcome` first):

```javascript
settle(outcome) {
  if (this.record.outcome) return;
  emit("tengu_bg_settle", { short, outcome, uptimeMs, attempt });
  this.transitionTo({ kind: "retired", outcome });
  this.clearLiveness();                                     // closes rv, clears pid-poll
  this.patch({ outcome, settledAt: Date.now(), tempo: "idle" });
  this.onSettle.emit(outcome);                              // notifies all subscribers
}
```

After settle:
- The handle is still in the supervisor's worker map, but marked `retired`.
- `retireIfSettled` short-circuits (`this.record.outcome → "no-state"`).
- Subscribers see a final `settled` frame and the control-socket connection ends.
- The dashboard renders the worker in the "Completed" bucket.

The handle is removed from the supervisor's map by a separate sweep — settled handles are kept around for a few minutes so the dashboard can show "just finished" status.

## Clock Drift / Sleep-Wake (`shiftGraceClocksForward`)

v2.1.142 added a sleep/wake handler. When the supervisor detects a wall-clock jump (via a periodic timer that should fire every X seconds but observed elapsed time is X+Δ), it calls `shiftGraceClocksForward(Δ)` on every worker:

```javascript
shiftGraceClocksForward(deltaMs) {
  if (deltaMs <= 0) return;
  if (this.adoptedAt !== undefined) this.adoptedAt += deltaMs;
  if (this.lastInputAt !== undefined) this.lastInputAt += deltaMs;
}
```

This **moves the grace clocks forward** so they look "fresher." If you adopted a worker at T=0, then the laptop slept for 30 minutes, on wake `adoptedAt += 30min` so the post-adopt grace (`BB5 = 120s`) isn't immediately expired.

Without this, every macOS sleep > 2 minutes would immediately retire all adopted workers on wake. The clocks-forward design was chosen over "store wall-clock at adoption, compare deltas to monotonic clock" because the codebase already used `Date.now()` consistently — the shim is a smaller change.

The detection logic is in [daemon_lifecycle.md](./daemon_lifecycle.md).

## Static Factories

`BgWorkerHandle` has **four** static factories, each modeling a different entry path:

| Factory | Caller | Initial phase | `record.state` |
|---------|--------|---------------|----------------|
| `spawn(H, $, q, K)` | Cold dispatch | `spawning` | `starting` |
| `claim(H, $)` | Spare-claim or cold-fallback (`jN4`) | `running` | `running` |
| `adopt(H, $, q, K)` | Daemon restart sees an orphan PTY | `running` (or `upgrading` if `pendingRespawn`) | `adopted` |
| `unverified(H, $)` | Adopt without a verifiable pid (pty.sock only) | `spawning` | `adopted` |

### `claim` vs `spawn`

`claim` is the **spare-worker** path. A pre-warmed worker exists at the daemon-level — when the user dispatches a new bg task, instead of spawning fresh (and paying the cold-start cost), the daemon hands them a ready-to-go worker. The factory transitions straight to `running` and skips PTY spawn. The spare's pre-existing `procStart` is preserved so pid-recycle detection still works. See [pre_warm_worker.md](./pre_warm_worker.md).

### `adopt` vs `unverified`

When a new daemon starts, it scans the on-disk roster (left by the previous daemon at exit). For each entry, it tries to verify the pid is still alive **and** its procStart matches. If verification succeeds → `adopt`. If verification fails (pid permission-denied, e.g. ran under another UID, or no `procStart` in roster), but the pty.sock still exists, it falls back to `unverified` — the worker is tracked via the socket only, with a slower pid-poll (`mI4 = 5s`) checking pty.sock liveness.

## Cross-Validation with v2.1.88

v2.1.88 **has no equivalent class**. Background sessions in v2.1.88 use `tmux`-based or `concurrentSessions.ts`-managed processes, with state tracked via `SessionKind` and metadata files but **no formal phase machine**. The state transitions in v2.1.88 are implicit (boolean flags scattered across code paths).

The phase enum, transition guard, and outcome decision are all new in v2.1.142 — they materialized between v2.1.115 and v2.1.139 alongside the daemon rollout.

The closest v2.1.88 analog is `RemoteAgentTask`'s status field (`'queued' | 'running' | 'completed' | 'failed'`), but it lacks the guard/legality check — transitions are direct assignments. This is one of the **most significant refactors** in the v2.1.139+ background-agents subsystem.

## Failure Modes

| Failure | Phase impact | Detection |
|---------|--------------|-----------|
| PTY spawn throws (binary missing) | `spawning → retired (crashed)` | `doSpawn` catch with binary-gone detail (cli_inner_pretty.js:528358) |
| `cwd` doesn't exist | `spawning → retired (crashed)` | `doSpawn` cwd-gone check (cli_inner_pretty.js:528348) |
| Worker exits with code 0 | `running → retired (done)` | `onExit` (cli_inner_pretty.js:528466) |
| Worker crashes fast (3x in 5s each) | `running → retired (crashed)` | `fastCrashStreak ≥ 3` |
| Worker exits with same cause twice | `running → retired (crashed)` | `sameExitCause` |
| 20 respawn attempts exhausted | `running → retired (crashed)` | `tengu_bg_respawn_exhausted` |
| Upgrade detected but worker busy | no transition | `respawnIfIdleStale` returns `reason: "busy"` |
| User kills worker | `running → retiring(reap) → retired(killed)` | `kill()` |
| User clicks stop | `running → retiring(stop) → retired(done)` | `stop()` |
| Idle-grace elapsed | `running → retiring(grace) → retired(done)` | `retireIfSettled` |
| Pid recycled (other process got our pid) | `running → retired (crashed)` | `pidRecycled()` returns true |
