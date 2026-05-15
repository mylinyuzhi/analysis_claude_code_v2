# Daemon Lifecycle — v2.1.142

## TL;DR

The on-demand daemon is a long-lived supervisor process that owns the registry of background `claude` workers on a machine. v2.1.142 hardens its lifecycle in three places:

1. **Clock-jump detection.** The retire-loop fires every `Ur6 = 60s`. If the actual wall-clock delta between ticks exceeds the configured interval by more than `Ur6` (i.e., the OS slept and a single tick swallowed more than a minute), the supervisor calls `shiftGraceClocksForward` on every worker, advancing `lastInputAt` and `adoptedAt` by the gap. This avoids the previous bug where macOS sleep/wake looked like an hour of idle time and caused workers to be retired immediately upon wake.
2. **Binary upgrade detection.** Every 60 s (`aKA`), the supervisor compares its starting binary's `realpath + mtime` to the current one (`f89` → `tKA`). If the binary was rewritten (e.g., `brew upgrade`) or its mtime moved, the supervisor exits cleanly via the same path as a normal shutdown — emitting `tengu_daemon_self_restart_on_upgrade` — so dispatched workers can be re-attached by the next-launched daemon on the new binary. Before v2.1.142, the old daemon kept running on a deleted/replaced binary path, causing fresh dispatches to crash-loop.
3. **Idle-exit grace.** With no clients and no live workers, the daemon exits after `sKA = 5s`. This minimizes resident footprint between user sessions while keeping the daemon present long enough to avoid thrash.

Plus several smaller pieces: pre-warmed spares, low-memory eager-retire, recent-adopt grace (`BB5 = 120 s`), empty-idle grace (`pB5 = 300 s` — v2.1.141), routine-protected (`/loop` jobs never auto-retire), and a yield-takeover protocol for service vs transient daemons.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions and constants:
- `runDaemonSupervisor` (`O89`) — Entry point. (cli_inner_pretty.js:609952-610186)
- `getBinaryIdentity` (`f89`), `binaryIdentityChanged` (`tKA`) — Upgrade detection. (cli_inner_pretty.js:609938-609951)
- `BgWorkerHandle.retireIfSettled` (`aB.retireIfSettled`) — Per-worker retire predicate. (cli_inner_pretty.js:527901-527964)
- `BgWorkerHandle.shiftGraceClocksForward` (`aB.shiftGraceClocksForward`) — Wall-clock-jump adjustment. (cli_inner_pretty.js:528143-528147)
- Constants: `aKA = 60000`, `sKA = 5000`, `gKA = 3600000`, `Ur6 = 60000`, `i$9 = 60000`, `BB5 = 120000`, `pB5 = 300000`, `mB5 = 120000`

---

## Daemon Process Model

```
┌─────────────────────────────────────────────────────────────┐
│ runDaemonSupervisor(opts) — entry                            │
│                                                              │
│  1. Acquire single-machine lock (file lock on a json path)  │
│  2. Try to take over existing transient daemon (yield ack)  │
│  3. Record self in lock file (pid, version, startedAt)      │
│  4. Capture binary identity P = getBinaryIdentity(execpath) │
│  5. Open control socket (unix domain / windows named pipe)  │
│  6. Adopt previously-running workers from saved roster      │
│  7. Spawn pre-warmed spare (if enabled)                     │
│  8. Start retire-loop (setInterval Ur6=60s)                 │
│  9. Start binary-upgrade poll (setInterval aKA=60s)         │
│ 10. Start idle-exit timer (setTimeout sKA=5s on quiet)      │
│                                                              │
│  Loop body: blocks on the abort signal.                     │
│                                                              │
│  Exit conditions:                                            │
│    G=true  → binary changed (tKA)  → "upgrade"              │
│    v=true  → service recalled (Rq6) → "service-recall"      │
│    u=true  → idle (S()=0 for sKA)   → "idle-exit"           │
│    V=true  → shutdown via control socket → "shutdown"       │
│    E=true  → yielded to a service daemon → "yield"          │
└─────────────────────────────────────────────────────────────┘
```

The daemon is single-instance per machine. If a transient daemon is running and a service daemon starts (with `--origin=service`), the new daemon asks the transient one to yield (`op:"yield"`). The transient daemon acks (`yielding:true`), shuts down its lease loop, and the workers it was supervising get adopted by the service daemon. Telemetry: `tengu_daemon_yield_takeover`.

---

## Binary Upgrade Detection

```javascript
// ============================================
// getBinaryIdentity - Capture realpath + mtime of the daemon's own binary
// Location: cli_inner_pretty.js:609938-609947
// ============================================

// ORIGINAL (for source lookup):
async function f89(H) {
  try {
    let $ = await g08.realpath(H),
      q = await g08.stat($);
    return { target: $, mtimeMs: q.mtimeMs };
  } catch ($) {
    if (f8($)) return null;
    throw $;
  }
}

// READABLE (for understanding):
async function getBinaryIdentity(execPath) {
  try {
    const realpath = await fsPromises.realpath(execPath);
    const stat = await fsPromises.stat(realpath);
    return { target: realpath, mtimeMs: stat.mtimeMs };
  } catch (err) {
    if (isFsEnoentLikeError(err)) return null;
    throw err;
  }
}

// Mapping: f89→getBinaryIdentity, H→execPath, $→realpath, q→stat,
//          g08→fsPromises, f8→isFsEnoentLikeError
```

```javascript
// ============================================
// binaryIdentityChanged - Compare two identity snapshots
// Location: cli_inner_pretty.js:609948-609951
// ============================================

// ORIGINAL (for source lookup):
function tKA(H, $) {
  if (H.target !== $.target) return !0;
  return !PA8() && H.mtimeMs !== $.mtimeMs;
}

// READABLE (for understanding):
function binaryIdentityChanged(prev, cur) {
  if (prev.target !== cur.target) return true;
  // On systems with stable mtime semantics, also check mtime
  return !isMtimeUnreliable() && prev.mtimeMs !== cur.mtimeMs;
}

// Mapping: tKA→binaryIdentityChanged, H→prev, $→cur, PA8→isMtimeUnreliable
```

### Why both `realpath` and `mtime`?

- **`realpath`** catches the common `brew upgrade` case: the symlinked-binary at `/opt/homebrew/bin/claude` now resolves to a different `Cellar/.../bin/claude` than it did at daemon start.
- **`mtime`** catches *in-place* rewrites where the path is the same but the bytes changed (e.g., a homebrew formula that re-installs the same versioned bottle with a new build). On filesystems where mtime is unreliable (some network mounts), `PA8()` is true and this check is suppressed.

### The Polling Logic

```javascript
// Excerpt from cli_inner_pretty.js around 610079-610095
let C = async () => {
  if (G || !P) return G;
  let c;
  try {
    c = await f89(L);
  } catch (l) { return (EH(l), !1); }
  if (A.aborted || v) return !1;
  if (c !== null && !tKA(P, c)) return !1;
  if (((G = !0), c === null))
    M.write("supervisor", `binary at ${L} was deleted (was ${P.target}) — exiting for upgrade`);
  else {
    let l = P.target === c.target ? "mtime changed" : `${P.target} → ${c.target}`;
    M.write("supervisor", `binary at ${L} changed (${l}) — self-restarting for upgrade`);
  }
  return (I?.(), !0);
};
```

`C` (the upgrade check) is called inside the supervisor's `setInterval(C, aKA=60s)`. `P` is the *starting* identity. On a real change, `G` is set true, log message written, and `I?.()` resolves the supervisor's main loop's promise (`new Promise((c) => { I = c; ... })`) — that resolution exits the main loop, drains workers, and the process exits.

The crucial difference from pre-v2.1.142 behavior: **the daemon exits**. Before, the daemon kept running on the deleted path, so any subsequent worker spawn (`Bun.spawn(execPath, …)`) would fail with ENOENT and crash-loop. Now, the next `claude agents` or `claude --bg` finds no daemon, spawns a fresh one on the new path, which adopts the surviving workers (their PIDs are still alive — the daemon exit didn't kill them).

### Adopt-Across-Upgrade

When the new daemon starts, it reads the persisted roster (`xB`, returns workers from disk) and calls `aB.adopt` on each entry. Adopt does:

1. `process.kill(worker.pid, 0)` — does the pid exist?
2. `bh(worker.pid)` — does its start-time match what we saved? (Anti-pid-reuse.)
3. If yes: re-wire rv-socket, set state `adopted`, mark `adoptedAt = Date.now()`, return new handle.
4. If no: write `failed` outcome and clean up the rendezvous socket / pty socket files.

The `BB5 = 120s` "recent-adopt" grace gives the adopted worker time to re-establish its rv-socket connection before the supervisor considers it for retirement. This is what makes upgrades non-disruptive.

---

## Sleep/Wake Clock-Jump Detection

```javascript
// Excerpt from runDaemonSupervisor — the retire-loop setup
// Location: cli_inner_pretty.js:609402-609419

let G = Date.now(),
  V = setInterval(
    (v, E) => {
      let I = Date.now(),
        h = I - G - Ur6;       // expected delta is Ur6 (60s); h = excess
      if (((G = I), h > Ur6)) {
        // Wall-clock jumped — we slept. Don't treat the gap as elapsed grace.
        for (let B of v.values()) B.shiftGraceClocksForward(h);
        E();
        return;
      }
      let C = _G$(),
        R = C > 0 && U08.freemem() < C ? i$9 : gKA;
      for (let B of v.values()) B.retireIfSettled(R).catch((u) => EH(u));
      E();
    },
    Ur6,
    q,    // handles map
    D,    // notify callback
  );
```

```javascript
// ============================================
// shiftGraceClocksForward - Bump per-worker grace timestamps past the gap
// Location: cli_inner_pretty.js:528143-528147
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
  if (this.adoptedAt !== undefined)  this.adoptedAt  += deltaMs;
  if (this.lastInputAt !== undefined) this.lastInputAt += deltaMs;
}
```

### Why This Algorithm

The retire predicate (`retireIfSettled`) is built on relative-time differences:
- `Date.now() - this.adoptedAt < BB5` ⇒ recent adopt; don't retire
- `Date.now() - this.lastInputAt < graceWindow` ⇒ recent activity; don't retire

If the OS slept for an hour, `Date.now()` jumps forward an hour while `adoptedAt`/`lastInputAt` (set before the sleep) don't. The differences look enormous, and every worker fails the grace check. **All workers retire immediately on wake.**

The fix: when the interval-tick is significantly later than expected, infer a wall-clock jump and bump those reference timestamps forward by the gap. After shifting, `Date.now() - this.adoptedAt` is back to the value it would have been if no sleep had occurred.

### Why `h > Ur6` and not `h > 0`?

The condition uses `h > Ur6` (gap exceeds one full tick interval) rather than `h > 0` (gap exceeds zero). Three reasons:

1. **Tick jitter**. JavaScript timers are not exact; `setInterval(60000)` can fire 60010 ms or 59900 ms later. Treating each as a wall-clock jump would constantly shift timestamps for no reason.
2. **Garbage collection pauses**. A 200 ms GC stall isn't a sleep event.
3. **The threshold is conservative**. A 60-second gap is large enough that *something* unusual happened (sleep, debugger break, severe load). Below that, treat it as normal jitter.

Even with `h > Ur6`, the check skips this tick's retire pass entirely — better to wait one full interval (60 s) than to spuriously retire workers because the laptop briefly froze.

### Cross-Reference: Event-Loop Stall Detector

A separate (`B6A` `startEventLoopStallDetector`) instrument tracks shorter stalls (≥500 ms). It runs in the foreground process *and* in workers, and emits `tengu_event_loop_stall { likely_sleep: gap>5s, ... }`. The daemon's retire-loop is the *consumer* of the lesson learned: a stall > Ur6 should be treated as sleep, not as actual elapsed time.

---

## Retire Logic

`retireIfSettled(graceWindow)` is the heart of the supervisor's resource management. Per worker, per 60s tick:

```javascript
// cli_inner_pretty.js:527901-527964

async retireIfSettled(graceWindow) {
  // Fast-path rejections
  if (this.isTransitioning)              return { retired: false, reason: "in-progress" };
  if (this.record.outcome)               return { retired: false, reason: "no-state" };
  if (this.attachers.size > 0)           return { retired: false, reason: "attached" };
  if (this.adoptedAt && Date.now() - this.adoptedAt < BB5)      // 2 min recent-adopt
                                          return { retired: false, reason: "recent-adopt" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < graceWindow)
                                          return { retired: false, reason: "recent-input" };

  // Read worker's saved state from disk
  let state = await readJobState(jobStateDir(this.dispatch.short));

  // Recheck after async — attach may have happened
  if (this.isTransitioning || this.attachers.size > 0)
                                          return { retired: false, reason: "in-progress" };
  if (this.lastInputAt && Date.now() - this.lastInputAt < graceWindow)
                                          return { retired: false, reason: "recent-input" };

  // Stale-spare bypass: spare worker that's been sitting unconsumed past graceWindow
  if (!state) {
    if (this.dispatch.source === "spare" && Date.now() - this.dispatch.createdAt > graceWindow) {
      if (!this.transitionTo({ kind: "retiring", reason: "grace" }))
                                          return { retired: false, reason: "in-progress" };
      tlm("tengu_bg_retired", { state: "stale-spare", … });
      return { retired: true };
    }
    return { retired: false, reason: "no-state" };
  }

  // v2.1.141 empty-idle-grace fast-path
  if (this.dispatch.source !== "shell"
      && !state.name && !state.intent && !state.worktreePath
      && state.template === "bg"
      && state.state === "working" && state.tempo === "blocked") {
    let ageMs = Date.now() - Date.parse(state.createdAt);
    if (ageMs < pB5) return { retired: false, reason: "empty-idle-grace" };     // 5 min
    this.transitionTo({ kind: "retiring", reason: "grace" });
    this.deleteJobDirOnSettle = true;     // also blow away the state file
    tlm("tengu_bg_retired", { state: "empty-idle", … });
    return { retired: true };
  }

  // Settled (terminal) state, no in-flight tasks, no routine
  if (!isJobSettled(state))                return { retired: false, reason: "not-settled" };
  if ((state.inFlight?.tasks ?? 1) > 0 || (state.inFlight?.queued ?? 1) > 0)
                                          return { retired: false, reason: "inflight" };
  if (state.inFlight?.kinds.includes("session_cron"))
                                          return { retired: false, reason: "session-cron" };
  if (state.routine)                       return { retired: false, reason: "routine" };

  let sinceUpdate = state.updatedAt && Date.now() - Date.parse(state.updatedAt);
  if (!sinceUpdate || sinceUpdate < graceWindow)
                                          return { retired: false, reason: "grace" };

  this.transitionTo({ kind: "retiring", reason: "grace" });
  tlm("tengu_bg_retired", { state: state.state, … });
  return { retired: true };
}
```

The cascade has three "tracks":

1. **Stale spare track** — pre-warmed worker that was never claimed. Retire if older than `graceWindow`.
2. **Empty-idle track** (v2.1.141) — bg session left over from a `←←` exit with no real task. Retire after `pB5 = 5 minutes`. Crucially: `deleteJobDirOnSettle = true`, removing the persisted state file so the next list won't show a ghost.
3. **Settled track** — normal job that completed (or errored, or was cancelled) and has been quiet for `graceWindow` (default 1 h).

### Grace Window Selection

```javascript
let C = memThresholdBytes(),
  R = C > 0 && U08.freemem() < C ? i$9 : gKA;
for (let B of handles.values()) B.retireIfSettled(R)...
```

If the system is under memory pressure (free memory below configured threshold), use `i$9 = 60s` instead of `gKA = 1h`. Aggressive retire reclaims worker RSS in roughly 5 ticks of the retire loop. There's also a separate fast-path that triggers a one-shot eager-retire pass before *any* new dispatch when memory is low (`tengu_bg_dispatch_low_mem`).

---

## Idle-Exit

```javascript
// cli_inner_pretty.js:610100-610122 (extracted)
let x = () => {                  // keep-alive-change callback
  if (origin !== "transient") return;
  if (upgrading || aborting || idle-exit-already-scheduled) return;
  if (liveCount() > 0) { clearTimeout(B); B = null; return; }
  if (B) return;                  // already scheduled
  B = setTimeout(() => {
    if (B = null; aborting || liveCount() > 0) return;
    idleExitFlag = true;
    let count = configWorkerCount();
    M.write("supervisor", `idle ${Math.round(O / 1000)}s with no clients — exiting` +
      (count > 0 ? ` (stopping ${count} configured workers)` : ""));
    d("tengu_daemon_idle_exit", { grace_ms: O, cfg_workers: count });
    I?.();
  }, O);  // O = sKA = 5000ms default
  B.unref();
};
```

- The idle-exit is **only** active for transient daemons (`origin === "transient"`). Service-installed daemons stay up indefinitely (the user *wants* the daemon to be there).
- `S()` = `leaseCount() + liveHandleCount()`. Both leases (open control-socket clients) and live workers count.
- The grace `O = sKA = 5s` is very short — minutes would be too long for "let the next launch find a daemon" UX, and seconds are fine because dispatches always re-spawn the daemon if needed (`bh`/`ensureDaemonRunning`).
- `B.unref()` ensures the timer doesn't keep the process alive on its own.

---

## Lease Tracking

Every foreground client (a `claude agents` UI, a `claude --bg` invocation in dispatch, the dashboard's polling loop) opens a lease on the daemon's control socket. Leases keep the daemon alive (the `x` callback above counts them).

When a lease is dropped (client disconnected, process exited), `onLeaseChange` fires, the daemon re-evaluates `S()`, and if `S() === 0` it schedules the 5s idle-exit timer. If a new client connects before the timer fires, `clearTimeout(B)` cancels it.

This means: opening `claude agents` keeps the daemon alive. Closing it (with no other workers active) starts a 5s countdown. Closing+reopening within 5s is free.

---

## Yield-Takeover Protocol

When a service daemon starts and a transient one is already running:

```
service daemon                transient daemon
──────────────                 ────────────────
acquire lock — sees existing lock
op:"yield" via control sock  ─→
                              ←─  ok=true, op="yield", yielding=true
                              (transient daemon's main loop resolves with E=true)
poll until lock is released
                              transient: workers stay alive (no kill),
                              transient: process exits cleanly
acquire lock (success)
op:"adopt" on each saved worker entry
```

Telemetry: `tengu_daemon_yield_takeover { ok, new_origin }`. The "ok" flag is whether the transient daemon released the lock within 5 s.

If the existing daemon refuses to yield (e.g., it's a `service` daemon and a `transient` is trying to start), the new one fails fast with a clear message: `"only a transient daemon can be displaced"` (cli_inner_pretty.js:609996-609997).

---

## Memory Pressure Eager-Retire (v2.1.142)

```javascript
// cli_inner_pretty.js:609255-609262
let C = U08.freemem(),  R = memThresholdBytes();
if (R > 0 && C < R && handles.size > 0) {
  let mb = Math.round(C / 1024 / 1024);
  H(`bg: low memory (${mb}MB free) — retiring settled workers before spawning ${v.short}`),
  d("tengu_bg_dispatch_low_mem", { free_mb: mb, handles: handles.size });
  for (let h of handles.values()) h.retireIfSettled(i$9).catch((x) => EH(x));   // i$9 = 60s
}
```

Before spawning a new worker, if free memory is below threshold (and we have handles), trigger an immediate eager-retire pass with the *short* grace (60 s instead of 1 h). This frees up RSS just in time for the new spawn, reducing memory-induced spawn failures.

The threshold (`_G$`) is configured via `tengu_bg_dispatch_low_mem_threshold` flag (defaults to 0 = disabled). When set, the supervisor also picks the `i$9` grace in the regular retire loop instead of `gKA`.

---

## Event Loop Stall Detector

A separate instrument that runs *inside every Claude process* (not just the daemon):

```javascript
// cli_inner_pretty.js:598358-598407
function startEventLoopStallDetector() {
  if (Mr6 !== null) return;
  wr6 = Date.now();
  Mr6 = setInterval(() => {
    let now = Date.now();
    let actualInterval = now - wr6;
    let stall = actualInterval - RT$;  // RT$ = 200ms
    if (stall > ue4) {                  // ue4 = 500ms
      Dr6++; jr6 += stall;
      let likelySleep = stall > x6A;    // x6A = 5000ms
      let mem = m6A();                  // {rss_mb, heap_used_mb, ext_mb}
      d("tengu_event_loop_stall", { ...mem, stall_duration_ms: stall, likely_sleep: likelySleep });
      if (likelySleep) T_.get(process.stdout)?.reassertTerminalModes();
    }
    wr6 = now;
  }, RT$).unref();
}
```

This is what catches transient process freezes (GC, large sync IO, debugger breakpoints) and emits diagnostic telemetry. The `likely_sleep` flag uses a 5-second threshold (separate from the daemon's `Ur6 = 60s` clock-jump threshold) because:

- The event-loop detector lives in every Claude process and can't share state with the daemon's retire loop.
- It runs every 200 ms, not every 60 s, so a 5 s gap is already significantly large.
- On `likely_sleep`, it calls `reassertTerminalModes()` — this is what fixes terminal-state corruption after sleep (raw mode lost, alt-screen confusion). This is a *direct* user-visible fix.

The daemon's retire loop *additionally* uses the wall-clock-jump observation for retire-grace adjustment, but the two instruments serve different purposes:
- Event-loop detector → recover terminal state, emit telemetry.
- Daemon retire loop → don't retire workers due to inferred sleep.

---

## What v2.1.142 Changed

| Area | v2.1.141 | v2.1.142 |
|------|----------|----------|
| Sleep/wake detection in retire loop | Missing — gap between ticks was treated as elapsed grace | New: `shiftGraceClocksForward` shifts every worker's `adoptedAt`/`lastInputAt` forward by the gap |
| Binary-upgrade detection | Missing — daemon kept running on deleted/upgraded binary path | New: 60s `realpath+mtime` poll; daemon exits cleanly on detected upgrade |
| Empty-idle auto-retire | New in 2.1.141: 5 min grace via `pB5`; deletes job dir | (Unchanged in 2.1.142) |
| Recent-adopt grace | 120 s | 120 s (unchanged) |
| Idle-exit grace (no clients) | 5 s | 5 s (unchanged) |

---

## Validation

| Claim | Source |
|-------|--------|
| Retire-loop interval is 60 s | cli_inner_pretty.js:609416 `Ur6` constant + setInterval period |
| Clock-jump check is `h > Ur6` (i.e., > 60 s gap) | cli_inner_pretty.js:609406 |
| `shiftGraceClocksForward` adjusts `adoptedAt` and `lastInputAt` | cli_inner_pretty.js:528143-528147 |
| Binary identity uses realpath + mtime | cli_inner_pretty.js:609938-609947 |
| Binary-upgrade poll interval is 60 s (`aKA`) | cli_inner_pretty.js:610188 |
| Empty-idle grace is 5 min (`pB5 = 300000`) | cli_inner_pretty.js:528606, 527935 |
| Recent-adopt grace is 2 min (`BB5 = 120000`) | cli_inner_pretty.js:528605, 527905 |
| Idle-exit grace is 5 s (`sKA = 5000`) | cli_inner_pretty.js:610189 |
| Telemetry `tengu_daemon_self_restart_on_upgrade` | cli_inner_pretty.js:610170 |
| Telemetry `tengu_event_loop_stall` with `likely_sleep` | cli_inner_pretty.js:598383, 598389 |
