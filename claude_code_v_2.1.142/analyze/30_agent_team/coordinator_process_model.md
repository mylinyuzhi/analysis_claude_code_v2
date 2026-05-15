# Coordinator Process Model — v2.1.142

## TL;DR

In v2.1.112 the "coordinator" for Agent Teams was effectively a single Node.js process: the team-lead REPL that spawned in-process teammates inside its own event loop, or tmux child processes that talked back over the mailbox. In v2.1.142 the picture for *background agents* (the `claude agents` view, `--bg`, `←←`) is fundamentally different: there is a **dedicated `claude daemon` supervisor process** running a long-lived event loop that owns a worker-pool, refills a pre-warmed spare, retires idle empty sessions after 5 minutes, and — new in 2.1.142 — detects wall-clock jumps (macOS sleep/wake) and gracefully exits when the binary on disk is replaced (`brew upgrade`).

The daemon's process model is:

```
            ┌────────────────────────────────────────────────────┐
            │            claude daemon (supervisor PID)         │
            │ ─────────────────────────────────────────────────  │
            │  • workersRoster                                   │
            │  • leaseCount + liveHandleCount                    │
            │  • pre-warmed spare (host PID, ptySock)            │
            │  • 60 s tick:                                      │
            │      - clock-jump detection                        │
            │      - retireIfSettled(workers)                    │
            │      - binary identity probe (`brew upgrade`)      │
            │  • idleGraceMs after last lease → exit             │
            └─────┬─────────────────────────────────┬────────────┘
                  │ ↓ Unix domain sockets          │
                  ▼                                ▼
       ┌────────────────────┐           ┌─────────────────────┐
       │ Background worker  │           │ Pre-warmed *spare*  │
       │ (bg PTY host)      │           │ (`runBgSpare`)      │
       │  • short id        │           │ • idle, claim sock  │
       │  • roster entry    │           │ • adopted on demand │
       │  • lastInputAt     │           │ • TTL = idleGraceMs │
       └────────────────────┘           └─────────────────────┘
```

This document covers the daemon supervisor's process model, the workers it spawns, the pre-warm spare it keeps ready, the v2.1.141 retire-on-idle policy, the v2.1.142 clock-jump fix, and the v2.1.142 brew-upgrade self-restart.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md) — v2.1.142 agent-team architecture additions
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) — Background agents (unit 08)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Daemon infrastructure

Key functions in this document:
- `daemonSupervisorMain` (`O89`) — the daemon supervisor's main loop (cli_inner_pretty.js:609938+)
- `getBinaryFingerprint` (`f89`) — realpath + mtime of the daemon's own executable
- `binaryFingerprintChanged` (`tKA`) — compares two fingerprints, gates self-restart
- `bgWorkerManager` (`o$9`) — worker-pool manager: spawn, claim spare, tick, retire
- `spawnSpareWorker` (`br6`) — fork a pre-warmed PTY host + claim socket
- `runBgSpare` (`vKA`) — entry point of a spare process; idles on claim socket
- `claimSpareWorker` (`xr6`) — adopt a live spare as a real worker
- `reapOrphanSpares` (`ur6`) — sweep stale `*.pty.sock` files on startup
- `shiftGraceClocksForward` (PTY-host method) — v2.1.142 wall-clock jump compensation
- `retireIfSettled` (PTY-host method) — apply per-worker retire policy
- `DAEMON_TICK_MS` (`Ur6`) — 60,000 ms (1-minute supervisor tick)
- `DEFAULT_GRACE_MS` (`gKA`) — 3,600,000 ms (1-hour idle-worker grace)
- `LOW_MEM_GRACE_MS` (`i$9`) — 60,000 ms (memory-pressure shorter grace)
- `EMPTY_IDLE_GRACE_MS` (`pB5`) — 300,000 ms = 5 minutes (v2.1.141 retire-on-idle for "empty REPL")
- `RECENT_ADOPT_GRACE_MS` (`BB5`) — 120,000 ms (don't retire if just adopted)
- `IDLE_EXIT_GRACE_MS` (`sKA`) — 5,000 ms (no-client grace before supervisor itself exits)

---

## Process Hierarchy

A fully populated v2.1.142 background-agents installation has three classes of process under the daemon umbrella:

```
launchctl/systemd or `claude daemon start` ─► claude daemon (origin=transient|service|foreground)
                                                    │
                                                    ├─ spawnPty()        spawned per dispatch
                                                    │      ├─ pty host process (Bun spawn)
                                                    │      └─ inside it: `claude` REPL agent
                                                    │
                                                    └─ br6 spawnSpare()  one pre-warmed extra
                                                           ├─ pty host (`--bg-pty-host`)
                                                           └─ spare claimant (`--bg-spare`)
```

The daemon supervisor itself does **not** run a Claude turn loop. It is a tiny event-loop process whose only jobs are: keep the registry, route dispatches, run the 60-second supervisor tick, and tear down gracefully when the binary changes underfoot.

Two roles exist for spare processes:

1. **PTY host** (`--bg-pty-host <ptySock> <rows> <cols>`) — runs the actual PTY; the inner agent only attaches via `aB.claim`. The host is durable across claim/release.
2. **Spare claimant** (`--bg-spare <claimSock>`) — listens on the claim socket; once a *real* dispatch arrives over UDS, the inner argv is mutated to match the dispatch and the agent boots.

These two roles correspond to the two argv tails inside `br6` (`spawnSpare`):

```javascript
// ============================================
// spawnSpareWorker - Fork a pre-warmed PTY host + spare claimant
// Location: cli_inner_pretty.js:608328-608376
// ============================================

// ORIGINAL (for source lookup):
async function br6(H) {
  if (c$() === "windows") return null;
  return U7("daemon_bg_spare_refill", async () => {
    let $ = R$9.randomBytes(4).toString("hex"),
      q = g_4($), K = Q_4($);
    /* ... cleanup leftover sockets ... */
    let [_, ...A] = hKA(),
      z = Bun.spawn([_, ...A, "--bg-pty-host", q, "200", "50", "--", _, ...A, "--bg-spare", K], {
        cwd: dQ(), env: kKA(), stdio: ["ignore","ignore","ignore"], detached: !0, windowsHide: !0
      });
    z.unref();
    let Y = { hostPid: z.pid, ptySock: q, claimSock: K, startedAt: Date.now(), cliVersion: "2.1.142", dispose() { try{ z.kill("SIGTERM"); }catch{} } };
    return (z.exited.then(() => { H.onExit(); }), Y);
  });
}

// READABLE (for understanding):
async function spawnSpareWorker(callbacks) {
  if (osKind() === "windows") return null;
  return wrapTelemetry("daemon_bg_spare_refill", async () => {
    const seed = crypto.randomBytes(4).toString("hex");
    const ptySockPath = buildPtySocketPath(seed);
    const claimSockPath = buildClaimSocketPath(seed);
    await fs.mkdir(daemonSocketDir(), { recursive: true, mode: 0o700 }).catch(() => {});
    await fs.unlink(ptySockPath).catch(() => {});
    await fs.unlink(claimSockPath).catch(() => {});

    const [execPath, ...preArgs] = currentInvocation();      // [`bun`, "claude"] or [`claude`]
    const child = Bun.spawn(
      [execPath, ...preArgs, "--bg-pty-host", ptySockPath, "200", "50",
       "--", execPath, ...preArgs, "--bg-spare", claimSockPath],
      { cwd: daemonSocketDir(), env: cleanSpareEnv(), stdio: ["ignore","ignore","ignore"],
        detached: true, windowsHide: true });
    child.unref();                                            // daemon does NOT wait on spare

    const handle = {
      hostPid: child.pid,
      ptySock: ptySockPath,
      claimSock: claimSockPath,
      startedAt: Date.now(),
      cliVersion: VERSION,                                    // "2.1.142"
      dispose() { try { child.kill("SIGTERM"); } catch {} },
    };
    child.exited.then(() => {
      fs.unlink(ptySockPath).catch(() => {});
      fs.unlink(claimSockPath).catch(() => {});
      fs.unlink(removeMarker(ptySockPath)).catch(() => {});
      callbacks.onExit();
    });
    callbacks.log(`bg spare spawned host pid=${child.pid}`);
    return handle;
  });
}

// Mapping: br6→spawnSpareWorker, H→callbacks, U7→wrapTelemetry, kKA→cleanSpareEnv,
//          hKA→currentInvocation, dQ→daemonSocketDir, g_4→buildPtySocketPath, Q_4→buildClaimSocketPath
```

### Why `child.unref()` matters

Bun's `spawn` with `detached: true` plus `child.unref()` makes the spawned process invisible to Node's event-loop reference counting. The supervisor process can therefore exit *without waiting* on the spare to finish: the spare is just another process that the OS keeps alive. The daemon-spare relationship is solely tracked via PID stored in the registry, the claim socket, and the PTY socket.

This is also why the SIGTERM in `dispose()` is wrapped in a try/catch: by the time the daemon disposes of the spare, the OS may already have reaped it for unrelated reasons (memory pressure, manual kill, OOM).

---

## The 60-Second Supervisor Tick

Every minute, the daemon's worker manager wakes up, computes the wall-clock delta since the last tick, and **either** compensates for a clock jump (sleep/wake) **or** retires settled workers. The relevant block lives in `o$9` (`bgWorkerManager`):

```javascript
// ============================================
// supervisorTick - 60s tick that detects clock-jumps and retires idle workers
// Location: cli_inner_pretty.js:609398-609420 (inside bgWorkerManager / o$9)
// ============================================

// ORIGINAL (for source lookup):
let G = Date.now(),
  V = setInterval((v, E) => {
    let I = Date.now(), h = I - G - Ur6;
    if (((G = I), h > Ur6)) {
      for (let B of v.values()) B.shiftGraceClocksForward(h);
      E();
      return;
    }
    let C = _G$(), R = C > 0 && U08.freemem() < C ? i$9 : gKA;
    for (let B of v.values()) B.retireIfSettled(R).catch((u) => EH(u));
    E();
  }, Ur6, q, D);
V.unref();

// READABLE (for understanding):
let lastTickAt = Date.now();
const tickHandle = setInterval(
  (workers, onChange) => {
    const now = Date.now();
    const overshoot = now - lastTickAt - DAEMON_TICK_MS;   // expected: ≈0
    lastTickAt = now;

    if (overshoot > DAEMON_TICK_MS) {
      // The wall clock moved forward by MORE than one tick interval beyond what
      // we asked for. This usually means the host slept (macOS sleep/wake).
      // Don't retire workers that just "look" idle — they're not really idle.
      // Push their "last input at" / "adopted at" forward by exactly `overshoot`.
      for (const worker of workers.values()) worker.shiftGraceClocksForward(overshoot);
      onChange();
      return;
    }

    // Normal tick: pick the grace window (1 min if memory-pressed, else 1 hour),
    // try to retire each worker.
    const lowMemThreshold = getLowMemThreshold();
    const grace = (lowMemThreshold > 0 && os.freemem() < lowMemThreshold)
      ? LOW_MEM_GRACE_MS                                   // 1 min
      : DEFAULT_GRACE_MS;                                  // 1 hour
    for (const worker of workers.values()) {
      worker.retireIfSettled(grace).catch(EH);
    }
    onChange();
  },
  DAEMON_TICK_MS, q, D,
);
tickHandle.unref();

// Mapping: G→lastTickAt, V→tickHandle, I→now, h→overshoot, Ur6→DAEMON_TICK_MS,
//          _G$→getLowMemThreshold, i$9→LOW_MEM_GRACE_MS, gKA→DEFAULT_GRACE_MS,
//          shiftGraceClocksForward→ (kept as is, see PTY-host method below),
//          retireIfSettled→ (kept as is)
```

### Clock-Jump Detection (v2.1.142)

**What it does:** Detects when the wall clock has jumped forward by more than one tick interval (60 s) — typically because the machine was asleep — and compensates the per-worker "lastInputAt" / "adoptedAt" timestamps so that the next `retireIfSettled` call doesn't treat the sleep period as user-idle.

**How it works:**
1. Before the first tick, record `G = Date.now()`.
2. On each tick, compute `h = nowMs - lastTickMs - 60_000`. If the tick fired roughly on schedule, `h` is near 0 (negative or single-digit ms). If the host slept for, say, 30 minutes, the next tick to fire after wake will see `h ≈ 30 * 60_000 - 60_000 = 29 * 60_000 ms`.
3. If `h > 60_000` (more than one full tick overshot), the daemon assumes a clock jump.
4. For each worker, call `worker.shiftGraceClocksForward(h)` — which adds `h` to `lastInputAt` and `adoptedAt`. This is functionally equivalent to "those timestamps were never that far in the past — they really happened at `originalValue + h`".
5. Skip the retire pass entirely on this tick (no worker truly is idle right now — the registry is just stale-feeling).

**Why this approach:**
- The naive approach (rely on `Date.now()` alone) treats the sleep period as elapsed idle time. With a 1-hour default grace and a laptop sleep > 1 hour, every background worker gets retired the moment the user wakes the machine — even ones the user just kicked off. The 2.1.142 changelog explicitly calls out this fix: *"Fixed background sessions disappearing and daemon reconnect failing after macOS sleep/wake."*
- Alternatives considered:
  - **Use `process.hrtime`/monotonic clock** — would require rewriting every timestamp comparison. The codebase already uses wall-clock `Date.now()` throughout (workers' `lastInputAt`, the registry's `updatedAt`, etc.).
  - **Listen for OS sleep/wake notifications** — only practical on macOS via private APIs; Bun does not surface them; the cross-platform fallback would still be needed.
- The chosen approach is minimal: a single 3-line `if` block in the tick callback, plus a single per-worker method to shift two timestamps.

**Key insight:** The fix exploits a property of `setInterval`: when the host is asleep, the interval simply does not fire. When the host wakes, `setInterval` fires once "owing" the missed period in a single callback. By measuring the gap *at the moment of that single late callback*, we get the exact sleep duration for free.

```javascript
// ============================================
// shiftGraceClocksForward - Compensate for wall-clock jumps on each PTY host
// Location: cli_inner_pretty.js:528143-528147 (PTY-host class)
// ============================================

// ORIGINAL (for source lookup):
shiftGraceClocksForward(H) {
  if (H <= 0) return;
  if (this.adoptedAt !== void 0) this.adoptedAt += H;
  if (this.lastInputAt !== void 0) this.lastInputAt += H;
}

// READABLE (for understanding):
shiftGraceClocksForward(deltaMs) {
  if (deltaMs <= 0) return;                       // never shift backwards
  if (this.adoptedAt !== undefined) this.adoptedAt += deltaMs;
  if (this.lastInputAt !== undefined) this.lastInputAt += deltaMs;
}

// Mapping: H→deltaMs (no other params)
```

Only two fields are shifted because they're the only two consulted by `retireIfSettled`:
- `adoptedAt` gates the "recent-adopt" reason (don't retire a worker the daemon just took over).
- `lastInputAt` gates the "recent-input" reason (don't retire a worker that just received keystrokes).

Other timestamps (`startedAt`, `record.createdAt`) are not shifted — they record creation-time facts, not idleness windows.

---

## Retire-on-Idle Policy (v2.1.141 + v2.1.142)

`retireIfSettled(graceMs)` is called once per tick per worker. It returns `{retired:true}` or `{retired:false, reason:string}`. The reasons form an ordered checklist:

| Order | Reason | Decision |
|------|--------|----------|
| 1 | `in-progress` | A transition is mid-flight; abort this tick. |
| 2 | `no-state` | The worker has an `outcome` (already terminated); nothing to do. |
| 3 | `attached` | The TUI is currently attached; never retire under user. |
| 4 | `recent-adopt` | Adopted < `BB5 = 2 min` ago; let it settle. |
| 5 | `recent-input` | `lastInputAt` < `graceMs` ago; user is still typing. |
| 6 | (re-check after state fetch) | The above checks repeat after IO since IO can race. |
| 7 | `empty-idle-grace` (v2.1.141) | "Empty bg REPL" detected; only retire if > `pB5 = 5 min` old. |
| 8 | `stale-spare` | A `spare` worker that aged out before being claimed. |
| 9 | `not-settled` / `inflight` / `routine` | Active task or routine still owns the worker. |
| 10 | `grace` (default) | All checks passed; retire. |

The `empty-idle-grace` branch is the v2.1.141 fix for **"empty idle background sessions left over from `←` are now automatically retired by the daemon after 5 minutes"**:

```javascript
// ============================================
// retireEmptyIdleSession - v2.1.141 retire-after-5-min branch
// Location: cli_inner_pretty.js:527924-527947 (excerpt from retireIfSettled)
// ============================================

// ORIGINAL (for source lookup):
if (
  this.dispatch.source !== "shell" &&
  !$.name && !$.intent && !$.worktreePath &&
  $.template === "bg" && $.state === "working" && $.tempo === "blocked"
) {
  let K = Date.now() - Date.parse($.createdAt);
  if (K < pB5) return { retired: !1, reason: "empty-idle-grace" };
  if (!this.transitionTo({ kind: "retiring", reason: "grace" }))
    return { retired: !1, reason: "in-progress" };
  return (
    (this.deleteJobDirOnSettle = !0),
    d("tengu_bg_retired", { short: this.dispatch.short, rvSent: this.shutdownWorker(),
                            settledForMs: K, state: "empty-idle" }),
    { retired: !0 }
  );
}

// READABLE (for understanding):
const isEmptyDispatch =
  this.dispatch.source !== "shell" &&    // not a shell command
  !state.name && !state.intent &&        // user never named it or stated intent
  !state.worktreePath &&                 // no worktree was attached
  state.template === "bg" &&             // came from `--bg` / `←←`
  state.state === "working" &&           // model has not yet emitted anything
  state.tempo === "blocked";             // and is waiting for a user message

if (isEmptyDispatch) {
  const ageMs = Date.now() - Date.parse(state.createdAt);
  if (ageMs < EMPTY_IDLE_GRACE_MS /* 5 min */) {
    return { retired: false, reason: "empty-idle-grace" };
  }
  if (!this.transitionTo({ kind: "retiring", reason: "grace" })) {
    return { retired: false, reason: "in-progress" };
  }
  this.deleteJobDirOnSettle = true;        // also wipe the .job dir on exit
  emit("tengu_bg_retired", {
    short: this.dispatch.short,
    rvSent: this.shutdownWorker(),
    settledForMs: ageMs,
    state: "empty-idle",
  });
  return { retired: true };
}

// Mapping: pB5→EMPTY_IDLE_GRACE_MS, K→ageMs, $→state, d→emit
```

### Why 5 Minutes?

The 5-minute grace window for empty REPLs is shorter than the default 1-hour grace for *non-empty* workers because:

1. **No state to preserve.** An "empty" worker has never accepted a user message — there's no transcript to keep around.
2. **Fast accumulation.** Users tend to bounce through `←←` repeatedly when exploring agent view, leaving stale skeletons behind. A 1-hour TTL would keep dozens of these resident on a typical day.
3. **Re-creation is cheap.** Empty bg sessions cost ~5 ms to recreate (no model invocation has happened yet); there's nothing to lose by retiring eagerly.

Compare to a *non-empty* worker (one that has accepted at least one user message): it has a transcript file, possibly a worktree, and likely model-side cache state. Retiring it eagerly throws all of that away. So that one is gated on the 1-hour grace.

The dual-threshold design (5 min for empty, 1 hour for non-empty) is the whole point of the v2.1.141 patch — before this, both classes shared a single threshold (1 h), so empty stubs accumulated.

---

## Brew-Upgrade Self-Restart (v2.1.142)

**What it does:** Detects that the daemon's own executable has been replaced on disk (most commonly by `brew upgrade @anthropic-ai/claude-code` or an `npm i -g` re-install) and triggers a clean self-restart.

**How it works:**

1. On startup, the daemon records its own binary fingerprint: `{ target: realpath, mtimeMs }`.
2. On each tick *and* on every dispatch nudge, it re-fingerprints and compares.
3. If `target` differs (the symlink moved) or `mtimeMs` differs (the file was rewritten in place), set the `binaryChanged` flag.
4. On the next pass, the supervisor logs `"binary at <path> changed (mtime changed | foo → bar) — self-restarting for upgrade"`, fires `tengu_daemon_self_restart_on_upgrade`, and resolves the main promise to exit.
5. Workers are *not* killed; on the next `claude` invocation, the new daemon will re-adopt them via `aB.adopt`.

```javascript
// ============================================
// getBinaryFingerprint - Daemon's own executable identity
// Location: cli_inner_pretty.js:609938-609946
// ============================================

// ORIGINAL (for source lookup):
async function f89(H) {
  try {
    let $ = await g08.realpath(H),
      q = await g08.stat($);
    return { target: $, mtimeMs: q.mtimeMs };
  } catch ($) {
    if (f8($)) return null;             // ENOENT
    throw $;
  }
}

// READABLE (for understanding):
async function getBinaryFingerprint(path) {
  try {
    const resolved = await fs.realpath(path);   // chase symlinks (`/usr/local/bin/claude`)
    const stat = await fs.stat(resolved);
    return { target: resolved, mtimeMs: stat.mtimeMs };
  } catch (e) {
    if (isENOENT(e)) return null;               // binary was deleted, not just changed
    throw e;
  }
}

// Mapping: f89→getBinaryFingerprint, $→resolved, q→stat, f8→isENOENT
```

```javascript
// ============================================
// binaryFingerprintChanged - Gate self-restart
// Location: cli_inner_pretty.js:609948-609951
// ============================================

// ORIGINAL (for source lookup):
function tKA(H, $) {
  if (H.target !== $.target) return !0;
  return !PA8() && H.mtimeMs !== $.mtimeMs;
}

// READABLE (for understanding):
function binaryFingerprintChanged(oldFp, newFp) {
  if (oldFp.target !== newFp.target) return true;  // symlink moved
  // On macOS App Translocation, mtime doesn't update reliably — skip mtime check.
  return !isMacAppTranslocated() && oldFp.mtimeMs !== newFp.mtimeMs;
}

// Mapping: tKA→binaryFingerprintChanged, H→oldFp, $→newFp, PA8→isMacAppTranslocated
```

The supervisor's main loop wires this up:

```javascript
// In daemonSupervisorMain (O89) main loop:
let P = await f89(L);                    // initial fingerprint
let G = !1;                              // hasBinaryChanged flag

let C = async () => {
  if (G || !P) return G;
  let c = await f89(L).catch(EH);
  if (signal.aborted || v) return false;
  if (c !== null && !tKA(P, c)) return false;   // unchanged
  G = true;                                     // mark changed
  if (c === null)
    log(`binary at ${L} was deleted (was ${P.target}) — exiting for upgrade`);
  else {
    let l = P.target === c.target ? "mtime changed" : `${P.target} → ${c.target}`;
    log(`binary at ${L} changed (${l}) — self-restarting for upgrade`);
  }
  resolveMain();                                // trigger main-loop exit
  return true;
};
```

### Why a Re-Probe Loop Instead of `fs.watch`?

Three reasons:
1. **`fs.watch` semantics differ by OS.** On macOS, `fs.watch` against a single file has had longstanding bugs (especially with `realpath`-resolved paths through Homebrew Cellar). The poll approach is identical across platforms.
2. **`brew upgrade` writes the new binary atomically.** Older binaries are unlinked, new ones linked — by the time the daemon "sees" the event, the old inode is gone. `realpath` would refuse, but `mtime` on the resolved path tells the same story cheaper.
3. **The 60-second tick is already running.** Reusing it costs nothing extra; adding a watcher would add a second file descriptor and a second teardown path.

**Key insight:** The daemon does not try to *prevent* the upgrade from happening or wait for it to finish. It exits cleanly, leaving workers in their own processes still owning their PTYs. On the next `claude` invocation, `bgWorkerManager` re-adopts them via the worker-roster file. This is why the v2.1.141 changelog item *"Fixed `claude daemon status` and `/doctor` on Windows throwing when the daemon pipe key file is locked or unreadable"* matters: by leaving the workers running while the daemon exits, the next `claude` startup must be able to read the lock/roster files even before its daemon is alive.

---

## Worker Pool Lifecycle

```
                ┌──────────────────────────────────────────────────────┐
                │            bgWorkerManager (o$9)                    │
                │                                                       │
                │  workers: Map<short, BgWorkerHandle>                  │
                │  killing: Set<short>                                  │
                │  spare:   BgSpareHandle | null                        │
                │  spawnPty: fn                                         │
                │                                                       │
                │  dispatch(d) ──► claim spare if version matches ──►   │
                │                  else aB.spawn(d) ──►                 │
                │                  workers.set(d.short, handle)         │
                │                  + refillSpare()                      │
                │                                                       │
                │  every tick (Ur6 = 60s):                              │
                │    if clockJump → shiftGraceClocksForward             │
                │    else          → retireIfSettled(graceMs)           │
                │                                                       │
                │  workers.size === 0 && no leases → idle exit          │
                └───────────────────────────────────────────────────────┘
```

### Pre-Warm Spare Refill

After every successful dispatch (whether via spare claim or cold spawn), the manager calls `D()` (its `refillSpare` closure), which:
1. Checks `tengu_bg_spare_enable` gate; if disabled, abort.
2. Checks for memory pressure: if `freemem < threshold`, skip the refill (better to wait than provoke OOM).
3. Ensures no refill is already in flight (`O` flag), and that there's no live spare already, and the daemon hasn't been told to shut down.
4. Calls `br6(callbacks)` (`spawnSpareWorker`). On exit-before-claim, attempts another refill if the spare lived ≥ 2 seconds (suggests it wasn't immediately reaped for a real reason).
5. On success, stores the handle in `f` and fires `tengu_bg_spare_spawn` telemetry.

The refill is *single-flight* (only one spare at a time, no parallel pre-warms) because every spare costs an entire `claude` Bun runtime resident — roughly 60 MB. Keeping more than one pre-warmed wastes RAM with no latency benefit.

### Spare-Version Gating

Critically, **a spare is only claimed if its `cliVersion` matches the daemon's `cliVersion`** (line 609278). If the user did `brew upgrade` mid-session and the daemon hasn't yet self-restarted, the old spare is unsafe to claim because it ran the old binary. In that case, the daemon falls through to a cold `aB.spawn(...)` and discards the stale spare via `f.dispose()`.

### Orphan-Spare Reap on Startup

```javascript
// ============================================
// reapOrphanSpares - Sweep stale spare sockets on daemon startup
// Location: cli_inner_pretty.js:608441-608478
// ============================================

// ORIGINAL (for source lookup):
async function ur6(H, $) {
  if (c$() === "windows") return;
  let q = new Set();
  for (let A of H.values()) {
    let z = A.rosterEntry().ptySock;
    if (z) q.add(z);
  }
  let K = await Yp.readdir(dQ()).catch(() => []), _ = 0;
  for (let A of K) {
    if (!A.endsWith(".pty.sock")) continue;
    let z = u08.join(dQ(), A);
    if (q.has(z)) continue;
    _++;
    let Y = m08.connect(z);
    Y.on("error", () => Yp.unlink(z).catch(() => {}));
    Y.once("connect", () => {
      Y.resume(); Y.write(hB({ t: "kill", sig: "SIGTERM" })); Y.end();
      setTimeout((f) => f.destroy(), 2000, Y).unref();
    });
  }
  // also sweep dangling .err and .claim.sock files for missing peers
  for (let A of K) {
    if (A.endsWith(".pty.sock.err")) {
      let z = A.slice(0, -4);
      if (!K.includes(z)) Yp.unlink(u08.join(dQ(), A)).catch(() => {});
    }
    if (A.endsWith(".claim.sock")) Yp.unlink(u08.join(dQ(), A)).catch(() => {});
  }
  if (_) $(`bg orphan-spare reap: ${_}`);
}

// READABLE (for understanding):
async function reapOrphanSpares(adoptedWorkers, log) {
  if (osKind() === "windows") return;          // Windows uses named pipes, different code path
  const liveSocks = new Set();
  for (const worker of adoptedWorkers.values()) {
    const sock = worker.rosterEntry().ptySock;
    if (sock) liveSocks.add(sock);
  }
  const entries = await fs.readdir(daemonSocketDir()).catch(() => []);
  let reaped = 0;
  for (const entry of entries) {
    if (!entry.endsWith(".pty.sock")) continue;
    const path = pathJoin(daemonSocketDir(), entry);
    if (liveSocks.has(path)) continue;          // matched a roster entry — leave alone
    reaped++;
    const client = net.connect(path);
    client.on("error", () => fs.unlink(path).catch(() => {}));
    client.once("connect", () => {
      client.resume();
      client.write(serializeMsg({ t: "kill", sig: "SIGTERM" }));
      client.end();
      setTimeout((c) => c.destroy(), 2000, client).unref();   // hard close after 2 s
    });
  }
  /* also remove stranded .err and .claim.sock files */
  if (reaped) log(`bg orphan-spare reap: ${reaped}`);
}

// Mapping: ur6→reapOrphanSpares, H→adoptedWorkers, $→log, q→liveSocks, _→reaped,
//          dQ→daemonSocketDir, u08→path, m08→net, hB→serializeMsg
```

This runs **once** at daemon startup, after worker adoption is complete. Its purpose: find PTY sockets on disk that the new daemon doesn't recognize, send them a SIGTERM via the control protocol (graceful), and unlink the socket file. The "kill via socket message" is preferred over `kill(pid)` because the PID is unknown (the socket was orphaned), and the connect-then-send-kill protocol is the worker's documented self-destruct.

---

## Idle Exit Path

The daemon supervisor itself is *transient* by default — it exits when no clients have been attached for `sKA = 5000 ms` (5 seconds) **and** no workers remain. The shutdown sequence:

```javascript
let x = () => {
  if (origin !== "transient") return;                 // only transient daemons auto-exit
  if (shuttingDown || binaryChanged || yielded || serviceRecalled || signal.aborted) return;
  if (R.manager?.leaseCount() + R.manager?.liveHandleCount() > 0) {
    if (B) (clearTimeout(B), (B = null));             // cancel any pending exit
    return;
  }
  if (B) return;                                       // already scheduled
  B = setTimeout(() => {
    if (R.manager?.leaseCount() + R.manager?.liveHandleCount() > 0) return;
    log(`idle ${Math.round(sKA / 1000)}s with no clients — exiting`);
    emit("tengu_daemon_idle_exit", { grace_ms: sKA, cfg_workers });
    resolveMain();
  }, sKA);
  B.unref();
};
```

`leaseCount` counts open control connections (CLIs attached to the daemon for read-only queries). `liveHandleCount` counts non-retired workers. If both are zero for 5 seconds, the supervisor exits.

The `transient` gate matters: a daemon installed as a systemd or launchd service has `origin: "service"` and never auto-exits — it stays up to handle future dispatches.

---

## Origin Modes

| `origin` | Trigger | Auto-exit | Notes |
|---------|---------|-----------|-------|
| `transient` | `claude` CLI invokes `claude daemon` lazily | yes, after `sKA = 5 s` idle | The default; one daemon per user, on-demand. |
| `service` | `launchctl bootstrap` / `systemctl --user start` | no | Pinned by the user; survives reboots. |
| `foreground` | `claude daemon start` interactively | no, until SIGINT | Explicit for debugging. |
| `daemon-worker` | inside the worker (not the supervisor) | n/a | The worker child has the same binary but a different code path; the kind enum is set via `CLAUDE_CODE_SESSION_KIND`. |

`yieldToOrigin` is the protocol for upgrading: a `transient` daemon will *yield* to any non-transient daemon that comes online. This is how `claude daemon install` works without forcing a restart of all background workers: the new service daemon takes over the lock, the old transient supervisor exits, the workers re-register their roster entries against the new lock-holder.

---

## Pre-Warm Spare ≠ Worker Pool

It's worth stressing that the "pre-warm spare" is *not* a traditional worker pool. There is at most **one** spare. Its job is purely to absorb the 1–2 second `claude` Bun startup cost on the next dispatch. After it's claimed, dispatches that arrive before the spare is refilled simply pay the cold-spawn cost again.

This design choice prioritizes **memory frugality over throughput**:
- A typical user dispatches a background agent every several minutes at most.
- Holding even one extra Bun process resident already costs ~60 MB.
- Holding two or three would noticeably impact users on 8 GB-RAM Macs.

The alternative (a real pool of size N) would only help workflows where the user dispatches *back-to-back* — e.g., `claude agents` then immediately another. For the latency-sensitive case (mid-typing in agent view), one spare is enough.

---

## See Also

- [permission_inheritance.md](./permission_inheritance.md) — how the daemon's `--permission-mode` flag is preserved across retire/wake
- [mailbox_protocol.md](./mailbox_protocol.md) — the IPC primitive (file-based) used by spawned teammates
- [worktree_isolation.md](./worktree_isolation.md) — `CLAUDE_BG_ISOLATION=worktree` env var set when a daemon dispatches into a worktree
- v2.1.142 unit 08 worktree: `v2_1_142_dispatch_flags.md` for how the agent-view UI's flags reach this daemon
