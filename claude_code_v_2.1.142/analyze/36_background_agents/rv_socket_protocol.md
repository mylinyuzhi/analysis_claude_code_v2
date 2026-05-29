# RV-Socket Protocol & Control-Socket IPC — v2.1.142

## What "RV" Means and Why It Exists

`RV` is the daemon-internal abbreviation for **"rendezvous socket"** — the per-worker Unix-domain socket that the daemon's supervisor maintains with each background worker. There are **three** distinct sockets per worker, each serving a different role. This document covers all three plus the control socket that the daemon owns globally.

Without RV the daemon would have no way to inject messages into a long-running worker (e.g. "shutdown please," "repaint your screen," "your attacher caps changed"). The PTY itself is for terminal data, not control. The split was made so that a stuck/unresponsive PTY doesn't block control messages.

## The Four Sockets

| Socket | Type | Per | Used for |
|--------|------|-----|----------|
| **Control socket** | UDS (`~/.claude/daemon/control.sock`) | one per daemon | foreground client → daemon (dispatch, subscribe, attach, list, yield, shutdown) |
| **RV socket** | UDS (`~/.claude/bg-sessions/<short>/rv.sock`) | one per worker | daemon → worker (control msgs); worker → daemon (status, heartbeat) |
| **PTY socket** | UDS (`~/.claude/bg-sessions/<short>/pty.sock`) | one per worker | the PTY host process bridges terminal bytes between daemon and worker |
| **Messaging socket** | UDS (`~/.claude/bg-sessions/<short>/msg.sock`) | one per worker | persisted-message channel from agent-teams (`SendMessage`); see [30_agent_team/team_lifecycle_tools.md](../30_agent_team/team_lifecycle_tools.md) |

The `<short>` is the worker's identifier (a short hash, e.g. `9f8a`). All four files live in the user's `~/.claude/` tree so a peer process can attach by knowing the short id alone.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

Key functions / classes / constants:
- `createRvClient` (`RI4`) — daemon-side socket connector with retry backoff (cli_inner_pretty.js:527606-527689)
- `BgWorkerHandle.connectRv` (`aB.connectRv`) — wires `RI4` callbacks to `BgWorkerHandle` events (cli_inner_pretty.js:528520-528542)
- `BgWorkerHandle.shutdownWorker` — sends `{type:"shutdown"}` then SIGTERM-fallback (cli_inner_pretty.js:527854-527868)
- Worker-side rv server `startBgRvServer` (`K85`) — listens on `CLAUDE_BG_RENDEZVOUS_SOCK` env path (cli_inner_pretty.js:390600-390634)
- Worker-side rv message dispatcher (`A85`) — handles `shutdown`, `repaint`, `attacher-caps`, `reply` (cli_inner_pretty.js:390655-390705)
- Worker-side heartbeat sender `xi({type:"heartbeat"})` — every 30s while connected (cli_inner_pretty.js:390640-390654)
- Backoff steps `hI4` — `[100, 250, 500, 1000, 2000]` ms (cli_inner_pretty.js:527700)
- Max attempts `II4` — `30` (cli_inner_pretty.js:527693)
- Heartbeat stall threshold `mB5` — `120_000` ms (cli_inner_pretty.js:528604)

## RV Socket — Daemon → Worker

### Connection lifecycle

```javascript
// ============================================
// createRvClient — supervisor-side rendezvous client
// Location: cli_inner_pretty.js:527606-527689
// ============================================

// ORIGINAL (abridged):
function RI4(H, $, q, K) {
  let _, A = !1, z = 0, Y = !1, f;
  function O() {
    if (A) return;
    let w = new SI4.Socket(), D = !1;
    w.on("error", () => M());
    w.once("close", () => { if (_ === w) _ = void 0; if (A) return; if (D) q(); M(); });
    w.once("connect", () => {
      D = !0; z = 0; Y = !1; _ = w;
      K?.();                                           // onReady
      w.write(SH({ proto: r1, role: "supervisor", supervisorPid: process.pid }) + "\n");
      Hj8(w, (line) => { let parsed; try { parsed = x$(line); } catch { return; }
        if (parsed && typeof parsed === "object" && "type" in parsed) $(parsed); });  // onMessage
    });
    w.connect(H);
  }
  function M() {
    if (A || f || Y) return;
    if (z >= II4) { Y = !0; emit("tengu_bg_rv_connect_exhausted", { attempts: z }); return; }
    let w = hI4[Math.min(z, hI4.length - 1)];
    z++;
    f = setTimeout(() => { f = void 0; O(); }, w); f.unref();
  }
  return (O(), {
    send(w) { if (!_ || _.destroyed) { if (z >= II4) { z = 0; Y = !1; M(); } return false; }
              try { _.write(SH(w) + "\n"); return true; } catch { return false; } },
    close() { A = true; if (f) clearTimeout(f); _?.destroy(); _ = undefined; }
  });
}

// READABLE:
function createRvClient(sockPath, onMessage, onClose, onReady) {
  let socket, closed = false, attempt = 0, exhausted = false, retryTimer;
  function connect() {
    if (closed) return;
    let s = new net.Socket(), connected = false;
    s.on("error", () => scheduleRetry());
    s.once("close", () => { if (socket === s) socket = undefined; if (closed) return;
                           if (connected) onClose(); scheduleRetry(); });
    s.once("connect", () => {
      connected = true; attempt = 0; exhausted = false; socket = s;
      onReady?.();
      s.write(JSON.stringify({ proto: RV_PROTO, role: "supervisor", supervisorPid: process.pid }) + "\n");
      readLineByLine(s, line => {                  // Hj8
        let msg; try { msg = JSON.parse(line); } catch { return; }
        if (msg && typeof msg === "object" && "type" in msg) onMessage(msg);
      });
    });
    s.connect(sockPath);
  }
  function scheduleRetry() {
    if (closed || retryTimer || exhausted) return;
    if (attempt >= MAX_ATTEMPTS) { exhausted = true; emit("rv_connect_exhausted"); return; }
    let delay = BACKOFF_STEPS[Math.min(attempt, BACKOFF_STEPS.length - 1)];
    attempt++;
    retryTimer = setTimeout(() => { retryTimer = undefined; connect(); }, delay).unref();
  }
  return { send(msg) { /* ... */ }, close() { /* ... */ } };
}

// Mapping: RI4→createRvClient, SI4→net, hI4→BACKOFF_STEPS, II4→MAX_ATTEMPTS, Hj8→readLineByLine,
//          SH→JSON.stringify, x$→JSON.parse, r1→RV_PROTO
```

The retry policy is **5 backoff steps** (100ms, 250ms, 500ms, 1s, 2s) then capped at 2s, up to **30 total attempts**. After 30 fails the supervisor logs `tengu_bg_rv_connect_exhausted` and relies on the **pid-poll liveness backstop** — `BgWorkerHandle.startPidPoll` polls every `mI4 = 5s` and settles the worker if the pid disappears (cli_inner_pretty.js:528543-528546).

The handshake message the supervisor sends as the first frame:

```json
{ "proto": "<RV_PROTO_VERSION>", "role": "supervisor", "supervisorPid": <pid> }
```

The worker uses this to know which supervisor is talking (and to detect a supervisor swap during upgrade — see [daemon_lifecycle.md](./daemon_lifecycle.md)).

### Framing

**Newline-delimited JSON.** Every message is `JSON.stringify(msg) + "\n"`. The reader (`Hj8` = `readLineByLine`) accumulates partial bytes and flushes on `\n`. The 1 MB cap (`q.length > 1048576` at cli_inner_pretty.js:390627) on the worker side guards against malformed peers blowing memory.

### Message types: daemon → worker

Handled at cli_inner_pretty.js:390655-390705. Switched on `q.type`:

| `type` | Payload | Effect on worker |
|--------|---------|------------------|
| `shutdown` | `{}` | Worker: respond with `shutting-down`, teardown CCR session, flush metadata sequence (`M85`), then `process.exit(0)`. 5s timeout to coordinate. |
| `repaint` | `{}` | Worker: call `forceRedraw()` on its Ink renderer; if not in alt-screen, write a "Session can't redraw — Ctrl+Z to detach" message; respond with `repaint-done`. |
| `attacher-caps` | `{ caps: { editor?, visual?, colorLevel?, hyperlinks?, ... } \| null }` | Worker: call `setAttacherCaps(caps)` + `GNK(caps?.colorLevel)` so subsequent renders use the attaching terminal's capabilities. `null` means no attacher. |
| `reply` | `{ text: string }` | Worker: if the text matches a pending UI question (`fo7`), answer it directly; otherwise enqueue as user input (`NO({mode, value, priority:"next"})`). |

### Message types: worker → daemon

Handled at cli_inner_pretty.js:528520-528542 in `BgWorkerHandle.connectRv`:

| `type` | Payload | Supervisor reaction |
|--------|---------|---------------------|
| `heartbeat` | `{}` (every 30s, `xL$ = setInterval(...)`) | Updates `lastRvHeartbeat`. If no heartbeat in 120s (`mB5`) **and** state says `tempo:"active"`, logs `tengu_bg_worker_stalled` once. |
| `done` | `{ outcome: "done" \| "crashed" \| "killed" }` | Supervisor calls `BgWorkerHandle.settle(outcome)` — transitions worker to `retired`. |
| `state` | `{ patch: { state?, tempo?, detail?, needs?, ... } }` | Supervisor calls `BgWorkerHandle.patch(patch)` — updates the record on disk and fans out to subscribers (the fleet-view dashboard, mostly). |
| `detach-request` | `{ msg: string }` | Supervisor sends the msg through the *PTY* stream so the attaching terminal sees it (e.g. "Session opened in another window"). This is how `EKICKED` style detaches work — see [fleet_view_component_tree.md](./fleet_view_component_tree.md). |
| `repaint-done` | `{}` | Supervisor emits `BgWorkerHandle.onRepaintDone` so the resize-for-repaint helper can chain. |
| `shutting-down` | `{}` (response to `shutdown`) | Logged by supervisor for diagnosis. |

### Stall detection vs liveness

Two independent signals tell the supervisor "the worker is gone":
1. **`heartbeat` stale > 120s** — only logged when `tempo === "active"` (so an idle blocked job isn't flagged). This is a soft warning; doesn't kill the worker.
2. **pid-poll** — `checkPid()` runs every 5s when the rv connection is alive, and also runs once on each rv socket close event. If `process.kill(pid, 0)` fails (`ESRCH`/`EPERM`), the worker is settled. PID-recycling is detected by comparing `bh(pid)` (procStart timestamp) against the saved `procStart`.

Both signals are necessary: a worker can become unresponsive (no heartbeat, pid alive) — gets a stalled warning. Or it can die without sending `done` — pid-poll catches it.

## Worker-Side RV Server

The worker creates the rv server in `startBgRvServer` (`K85`, cli_inner_pretty.js:390600-390634):

```javascript
async function startBgRvServer() {
  let sockPath = process.env.CLAUDE_BG_RENDEZVOUS_SOCK;
  if (!sockPath || rvServer) return;
  delete process.env.CLAUDE_BG_RENDEZVOUS_SOCK;     // hide from any child process
  await fs.unlink(sockPath).catch(() => {});         // stale path from previous run
  rvServer = net.createServer(socket => {
    rvClientSocket?.destroy();
    rvClientSocket = socket;
    onSupervisorConnected().catch(N);                // z85
    socket.on("error", () => socket.destroy());
    socket.once("close", () => { if (rvClientSocket === socket) rvClientSocket = undefined; });
    let buf = "", decoder = new StringDecoder("utf8");
    socket.on("data", chunk => {
      buf += decoder.write(chunk);
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        let line = buf.slice(0, i); buf = buf.slice(i + 1);
        if (line) dispatchRvMessage(line);           // A85
      }
      if (buf.length > 1048576) { buf = ""; socket.destroy(); }
    });
  });
  rvServer.on("error", e => N(`[bg-rv] server error: ${String(e)}`, { level: "warn" }));
  rvServer.listen(sockPath);
  rvServer.unref();
  heartbeatTimer = setInterval(() => sendRvMessage({ type: "heartbeat" }), 30000);
  heartbeatTimer.unref();
}
```

Worker behavior on supervisor reconnect: the worker keeps state in its own process, but **drops** the previous socket. There's no resume of an in-flight message — the new supervisor gets a fresh connection. If the worker was mid-stream, the supervisor sees it via the snapshot subscribe API (control socket, see below).

The `unref()` calls ensure the rv server and heartbeat timer **don't keep the worker process alive on their own**. The worker exits when its main agent loop exits; the rv server is purely auxiliary.

## Control Socket — Foreground → Daemon

The daemon's single control socket (`~/.claude/daemon/control.sock`) accepts foreground-client connections. Its op dispatcher is at cli_inner_pretty.js:608990-609050. The ops:

| `op` | Args | Returns | Purpose |
|------|------|---------|---------|
| `dispatch` | `{ launch, cwd, agent?, routine?, isolation?, ... }` | `{ ok, short, sessionId, ... }` | Spawn a new worker. |
| `claim-spare` | `{ short, dispatch }` | `{ ok, short, sessionId }` | Adopt a pre-warmed spare worker into a real dispatch. |
| `attach` | `{ short, cols, rows, caps }` | streamed: PTY data inline + control frames | Connect a foreground terminal to the worker. Multiple attaches *kick* prior attacher. |
| `subscribe` | `{ short, tail?: number }` | streamed: `snapshot`, `stream`, `state`, `settled` | Read-only feed for the dashboard. |
| `ensure-spare` | `{}` | `{ ok }` | Trigger spare-worker warmup. |
| `permission-response` | `{ sessionId, answer, ... }` | `{ ok }` | Bridge for permission dialog answers from foreground UI. |
| `yield` | `{}` | `{ ok, yielding }` | Ask a transient daemon to yield to a service daemon. |
| `shutdown` | `{}` | `{ ok }` | Daemon shutdown request. |
| `keep-alive-change` | `{ delta }` | `{ ok }` | Foreground clients update their lease count (controls idle-exit). |
| `list` / `roster` | `{}` | `{ workers: [...] }` | List all known workers. |

### Attach flow detail

When the user clicks "Open" on a fleet-view session, `mountFleetView` (`ao5`) calls `attachJob` (`AN4`, cli_inner_pretty.js:509564-509634). The handler:

1. Writes a `recap.trigger` file so the worker emits a transcript-recap on next idle.
2. Calls `_d(short, { holdScreenOnDisconnect: true, alreadyInAlt: false })` which opens a control-socket connection with `op: "attach"`.
3. Streams PTY bytes inline; control frames arrive interleaved.
4. On connection error `ENOENT`/`ECONNREFUSED`, force-starts a transient daemon and retries.
5. On `disconnected` outcome, retries up to ~30 times with `Reconnecting…` banner.
6. On `ENOJOB`, returns `{ kind: "error", orphaned: true, msg: "Session crashed — press Enter to respawn" }` — fleet view handles this by offering to respawn.

### Subscribe streaming

The `subscribe` op fans out three streams from the worker handle:

```javascript
// At cli_inner_pretty.js:609036-609042
let unsubscribers = [
  worker.onStream.subscribe(line => sendFrame(socket, { type: "stream", line })),
  worker.onState.subscribe(patch => sendFrame(socket, { type: "state", patch })),
  worker.onSettle.subscribe(outcome => {
    sendFrame(socket, { type: "settled", outcome });
    socket.end();
  }),
];
socket.on("close", () => unsubscribers.forEach(u => u()));
```

The subscriber gets an initial `snapshot` frame with the current record + the last 200 bytes of the stream ring (`L.tail(X.tail ?? 200)`). After that, every state/stream change is pushed. If the worker has already settled, only `settled` is sent and the connection ends immediately.

This is what the fleet-view dashboard's per-worker activity ticker reads from. The dashboard doesn't poll the worker directly — it subscribes via the daemon, which means even orphan-adopted workers (with no live PTY) can still report state changes.

## PTY Socket and the `--bg-pty-host` Process

The PTY host is a **separate process** spawned by the daemon as `claude --bg-pty-host <ptySockPath> <cols> <rows> -- <cmd> <args...>` (cli_inner_pretty.js:527702-527714):

```javascript
function spawnPtyHost() {
  return (cmd, args, opts) => {
    let { cmd: claudeBin, prefixArgs } = invokerCmd({ pinToCurrentBinary: true });
    let proc = Bun.spawn([claudeBin, ...prefixArgs, "--bg-pty-host", opts.ptySock,
                          String(opts.cols), String(opts.rows), "--", cmd, ...args], {
      cwd: opts.cwd, env: opts.env,
      stdio: ["ignore", "ignore", "ignore"], detached: true, windowsHide: true,
    });
    proc.unref();
    return openPtyClient(opts.ptySock, proc.pid, undefined, opts.short);  // xW8
  };
}
```

The pty-host process:
- Opens a pseudo-tty using the platform's tty layer.
- Spawns the actual worker (`claude --session-id ... --bg-internal ...`) on the slave fd.
- Listens on `<ptySockPath>` for terminal-bytes/resize messages from the daemon.
- When the daemon-side client connects, terminal output is forwarded to the daemon (which fans out to attachers/subscribers).

Why a separate process? Two reasons:
1. **Bun vs Node interop.** The PTY library used (`Bun.Terminal`) requires Bun runtime. The supervisor itself runs on whatever runtime the user has; spawning a child binds the PTY library to a known process boundary.
2. **Daemon crash isolation.** If the daemon crashes/upgrades, the pty-host keeps the worker's terminal alive. The new daemon adopts the pty-host via its socket path (in the roster) without restarting the worker.

The pty-host's spawn arguments (cli_inner_pretty.js:528333) plus the env (cli_inner_pretty.js:527726-527748) construct the worker's launch:

```
claude --bg-internal --resume <sessionId> [--fork-session]
   env: CLAUDE_CODE_SESSION_KIND=bg
        CLAUDE_BG_BACKEND=daemon
        CLAUDE_JOB_DIR=~/.claude/bg-sessions/<short>
        CLAUDE_BG_RENDEZVOUS_SOCK=~/.claude/bg-sessions/<short>/rv.sock
        CLAUDE_BG_SOURCE=<dispatch source>
        CLAUDE_CODE_SESSION_NAME=<seed name or intent or short>
        FORCE_COLOR=3, COLORTERM=truecolor, BROWSER=true
```

The worker reads `CLAUDE_BG_RENDEZVOUS_SOCK`, opens its rv server, and starts the regular agent loop. The "headless" framing here is exactly the same agent loop that a foreground REPL runs — the only difference is that interactive prompts go through the rv `reply` protocol instead of stdin.

## Cross-Validation with v2.1.88

v2.1.88 **does not have a daemon yet** — `src/daemon/` directory is absent. The remote-agent system in v2.1.88 (`src/tasks/RemoteAgentTask/`) uses a different model: ssh/tmux for actual session hosting, with metadata persisted to disk and polled.

The rv-socket model is **new in v2.1.142** (rolled out between v2.1.115–v2.1.139). Specifically:
- v2.1.139 introduced the daemon supervisor and `claude agents` UI.
- v2.1.140 added `shiftGraceClocksForward` to handle macOS sleep/wake.
- v2.1.141 added `BG_EMPTY_IDLE_GRACE_MS = 5 min` for empty-idle retire.
- v2.1.142 added binary-identity upgrade detection (`f89`/`tKA`) and clean self-restart.

The v2.1.88 `RemoteAgentTask` model is the spiritual predecessor: the "remote session" concept (persisted metadata, polling, cross-process readers) is preserved, but the IPC went from filesystem-polling to socket-based for latency.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Worker crashes (uncaught throw) | PTY exits with code≠0 | `onExit` schedules respawn unless `fastCrashStreak ≥ 3` or attempt ≥ `bI4 = 20` |
| Worker hangs (no heartbeat) | `lastRvHeartbeat` stale > 120s during `tempo: active` | Logged only; pid-poll handles real death |
| RV socket connect fails 30x | `tengu_bg_rv_connect_exhausted` | Falls back to pid-poll-only liveness |
| Worker pid recycled | `bh(pid)` returns a different procStart | `settle("crashed")` |
| Daemon upgrades | `binaryIdentityChanged` (`tKA`) | Daemon exits cleanly; new daemon adopts worker via roster |
| Daemon dies hard | Worker keeps running; control socket goes 404 | Foreground client starts a transient daemon and reconnects |
| Worker's binary changes (`onNudge`) | `respawnIfIdleStale` checks `cliVersion` ≠ supervisor's | Worker transitioned to `upgrading`; SIGTERM after 5s if no graceful shutdown |
