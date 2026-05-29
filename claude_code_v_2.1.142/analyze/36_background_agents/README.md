# Background Agents Module (36_background_agents) — v2.1.142

## TL;DR

v2.1.139 introduced "agent view" (Research Preview): `claude agents` lists every Claude Code background session (running, blocked, completed) on the local machine, lets you attach to any one of them, dispatch new tasks alongside, and drill into status with grouping/filtering/search. The plumbing underneath agent view is a **persistent on-demand daemon** that supervises background workers, adopts orphaned ones across daemon restarts, retires idle ones on a 5-minute timer, and detects its own binary being upgraded mid-flight.

v2.1.140 → v2.1.142 added six points of polish:
1. Pre-existing worktree recognition (no more "blocked while EnterWorktree refuses").
2. Daemon clock-jump detection (the supervisor doesn't treat macOS sleep/wake as elapsed grace time).
3. Daemon self-restart on upgrade (the supervisor exits cleanly when its own binary is rewritten by `brew upgrade`).
4. Chrome-in-Chrome shim isolation in attached agent-view sessions (clicking a link no longer crash-loops).
5. `v` shortcut respects the attaching terminal's `$EDITOR`/`$VISUAL` (instead of the daemon's process-default).
6. `--bg --dangerously-skip-permissions` survives retire/wake.

Plus 8 minor flag/UI fixes from 2.1.141 — see individual documents.

## What "Agent View" Is

The feature has three entry points that all converge on the same UI:

| Entry point | Where | Typical use |
|-------------|-------|-------------|
| `claude agents` (CLI subcommand) | Terminal | "Show me what's running on this machine, attach to one, or dispatch a new task." |
| `← ←` from any REPL prompt | In-REPL | "Background this session and switch over." Tracked by `hasUsedAgentsFleet` sticky flag. |
| `claude --bg [prompt]` | Terminal | "Spawn a background session and don't enter the UI." Dispatches via the daemon but doesn't mount the dashboard. |

All three flow through the **on-demand daemon** (`claude daemon run`) — a persistent supervisor that holds worker handles, adopts orphans across upgrades, and serializes job state to `~/.claude/bg-sessions/<short>/state.json`.

## Architecture

```
                          User
                            │
                            ▼
            ┌────────────────────────────────┐
            │  claude agents [--cwd] ...      │
            │  ←← from REPL                   │
            │  claude --bg [...]              │
            └────────────────────────────────┘
                            │
                            ▼
         ┌───────────── Commander + Go6 ────────────┐
         │ pre-scan for --cwd/--add-dir/--settings/ │
         │ --mcp-config/--plugin-dir/--strict-mcp   │
         └──────────────────────────────────────────┘
                            │
                            ▼
            ┌────────────────────────────────┐
            │   ao5 mountFleetView(root, {   │   ← UI process (Ink, in-band)
            │     cwdFilter,                 │
            │     dispatchExtraArgs,         │
            │     dispatchDefaults           │
            │   })                            │
            └────────────────────────────────┘
                            │
                            │ rv-socket protocol (per-job)
                            ▼
            ┌────────────────────────────────┐
            │  Daemon supervisor (O89)        │   ← ONE process per machine,
            │                                 │     long-lived, listens on
            │  - Adopts workers across restart│     control socket
            │  - Retires idle workers after  │
            │    grace (BB5/pB5/gKA)          │
            │  - shiftGraceClocksForward on  │
            │    detected wall-clock jumps    │
            │  - tKA: detects binary upgrade │
            │    (realpath+mtime), exits     │
            │  - Idle-exit after sKA grace   │
            └─────────────┬───────────────────┘
                          │ Bun.spawn(--bg-pty-host …)
                          ▼
            ┌────────────────────────────────┐
            │  PTY host (Bun, separate proc) │   ← per worker
            │   ─ stdio bridge ─             │
            └────────────────────────────────┘
                          │
                          ▼
            ┌────────────────────────────────┐
            │  bg worker (claude --session-id │   ← THE actual Claude session
            │  --agent … --bg-internal …)    │     running headlessly
            │                                 │
            │  -  Runs Agent Loop normally   │
            │  -  Persists state to          │
            │     ~/.claude/bg-sessions/...  │
            │  -  Exposes rv-protocol for    │
            │     attaching/detaching from   │
            │     agent view                 │
            │  -  Receives "attacher-caps"   │
            │     msg when a foreground term │
            │     attaches, forwarding its   │
            │     hyperlinks/colors/$EDITOR  │
            └────────────────────────────────┘
```

## Lifecycle

```
                         spawn (cold)
        ╔═════════════════════════════════════╗
        ║                                     ║
        ▼                                     ║
   ┌────────────┐  attach  ┌───────────┐      ║
   │ spawning   ├─────────►│ running   │      ║
   └─────┬──────┘          └─────┬─────┘      ║
         │                       │            ║
         │   adopt across upgrade│            ║
         └──┬────────────────────┤            ║
            ▼                    │            ║
       ┌───────────┐             │            ║
       │  adopted  │─────────────┤            ║
       └───────────┘             │            ║
                                 │ retireIfSettled ticks every Ur6=60s
                                 ▼
                          ┌──────────────┐
                          │  retiring    │  ←─── grace check failed
                          └─────┬────────┘
                                │ shutdown sent
                                ▼
                          ┌──────────────┐
                          │  retired     │  ←─── final state, handle removed
                          └──────────────┘

                          ┌──────────────┐
                          │  upgrading   │  ←─── version differs from supervisor's own
                          └──────────────┘       (transition only)
```

States are not free-form — they're an explicit phase machine in `BgWorkerHandle` (`aB`). The `phase.kind` enum is one of: `spawning`, `running`, `retiring`, `retired`, `upgrading`, `claimed`, `adopted`, `unverified`.

## Retire Grace Constants

| Constant | Value | Meaning | Location |
|----------|-------|---------|----------|
| `BB5` (`BG_RECENT_ADOPT_GRACE_MS`) | 120 s | Don't retire workers adopted in the last 2 min. | cli_inner_pretty.js:528605 |
| `pB5` (`BG_EMPTY_IDLE_GRACE_MS`) | **5 min** | Auto-retire empty idle bg sessions (v2.1.141). | cli_inner_pretty.js:528606 |
| `gKA` (`BG_RETIRE_GRACE_DEFAULT_MS`) | 1 h | Default grace for settled (non-routine) workers. | cli_inner_pretty.js:609576 |
| `i$9` (`BG_RETIRE_LOW_MEM_GRACE_MS`) | 60 s | Aggressive grace under memory pressure. | cli_inner_pretty.js:609577 |
| `Ur6` (`BG_RETIRE_TICK_MS`) | 60 s | The retire-loop's setInterval period. | cli_inner_pretty.js:609578 |
| `mB5` (`BG_HEARTBEAT_STALL_MS`) | 120 s | Heartbeat-stall threshold for `tengu_bg_worker_stalled` warning (also serves as reattach budget during daemon restart). | cli_inner_pretty.js:528604 |
| `sKA` (`BG_DAEMON_IDLE_EXIT_MS`) | 5 s | Daemon idle-exit grace (transient daemon only). | cli_inner_pretty.js:610189 |
| `aKA` (`BG_DAEMON_STALE_CHECK_INTERVAL`) | 60 s | How often the daemon polls for binary-identity changes. | cli_inner_pretty.js:610188 |
| `uB5` (`BG_RESPAWN_BACKOFF_MS`) | 10 s | Backoff between worker respawn attempts. | cli_inner_pretty.js:528599 |
| `bI4` (`BG_RESPAWN_MAX_ATTEMPTS`) | 20 | Worker respawn attempt cap. | cli_inner_pretty.js:528600 |
| `xI4` (`BG_FAST_CRASH_THRESHOLD_MS`) | 5 s | Window for fast-crash classification. | cli_inner_pretty.js:528601 |
| `mI4` (`BG_PID_POLL_INTERVAL_MS`) | 5 s | Period of the pid-liveness backstop poll. | cli_inner_pretty.js:528603 |
| `II4` (`BG_RV_CONNECT_MAX_ATTEMPTS`) | 30 | Max rv-socket connect retries before giving up. | cli_inner_pretty.js:527693 |
| `hI4` (`BG_RV_CONNECT_BACKOFF`) | `[100,250,500,1000,2000]` ms | Backoff steps for rv-socket connect. | cli_inner_pretty.js:527700 |

## Why On-Demand Daemon?

The daemon model trades a small persistent footprint for a big UX gain:

- **Cross-process state.** A foreground terminal can dispatch a bg job, exit the terminal, and the job keeps running. The user's next `claude agents` finds it.
- **Crash isolation.** A foreground UI crash doesn't take down running workers.
- **Resource sharing.** Workers share a single supervisor's poll loop, lease tracking, and adopt logic.
- **Upgrade tolerance.** New foreground processes can talk to a daemon running an *older* binary, until the daemon detects its own binary changed and self-restarts (`tKA`).

The cost: one daemon process per machine. To minimize that, the daemon exits itself after `sKA = 5 s` of no clients and no live workers (idle-exit grace, `tengu_daemon_idle_exit`). Re-launches on demand.

## Module Structure

| Document | Purpose |
|----------|---------|
| `README.md` | This file. |
| `agent_view.md` | The v2.1.139 dashboard UI, list rendering, status filtering, search. |
| `daemon_lifecycle.md` | Daemon process model: idle-exit, adopt, retire, sleep/wake, upgrade detection. |
| `worktree_recognition.md` | v2.1.142 pre-existing worktree recognition fix. |
| `dispatch_flags.md` | Dispatch-time configuration via flags (companion to `30_agent_team/v2_1_142_dispatch_flags.md`). |
| `editor_resolution.md` | v2.1.142 `$EDITOR`/`$VISUAL` resolution via attached-client capabilities. |
| `chrome_extension_isolation.md` | v2.1.142 attached-session Chrome shim isolation. |
| `cwd_filter.md` | v2.1.141 `--cwd <path>` directory filter on the session list. |
| `completed_vs_working.md` | v2.1.141 finished-with-shells-running classification. |
| `pre_warm_worker.md` | v2.1.141 pre-warmed worker (spare) claim & cold-dispatch fallback. |
| `keep_dangerous_skip.md` | v2.1.142 `--dangerously-skip-permissions` persistence across retire/wake. |
| [rv_socket_protocol.md](./rv_socket_protocol.md) | The four sockets (control, rv, pty, msg); `createRvClient` (`RI4`) connect + backoff; daemon→worker messages (`shutdown`/`repaint`/`attacher-caps`/`reply`); worker→daemon messages (`heartbeat`/`done`/`state`/`detach-request`/`repaint-done`); control-socket ops (`dispatch`/`attach`/`subscribe`/etc.); PTY-host process and `--bg-pty-host` framing |
| [worker_state_machine.md](./worker_state_machine.md) | `BgWorkerHandle` (`aB`) phase enum (`spawning`/`running`/`upgrading`/`retiring`/`retired`); transition guard `UB5`; `retireIfSettled` precedence cascade; `respawnIfIdleStale` for binary upgrade; `onExit` outcome decision (fast-crash, same-cause, pre-init); static factories `spawn`/`claim`/`adopt`/`unverified`; `shiftGraceClocksForward` sleep/wake adjustment |
| [fleet_view_component_tree.md](./fleet_view_component_tree.md) | `mountFleetView` (`ao5`) outer attach-loop; `FleetViewDashboard` (`EQ4`) state hooks (jobs/peers/PR-batch/loop-kicks); polling loop `p9` with identity-stable setState; sub-component rendering (`JobRow` `Fo5`, `ExpandedJobPanel` `bo5`, `HelpFooter` `co5`); keyboard dispatch (voice→dashboard→input); grouping/sorting; persistence to `~/.claude/fleet-view-state/`; auto-relaunch on upgrade |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) — All v2.1.142 symbols introduced/touched by this module (the comprehensive table, including daemon-lifecycle entries)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents module pointer (delegates to the additions file pending consolidation)

Key functions/types:
- `mountFleetView` (`ao5`) — Agent-view loop; renders + re-attaches (cli_inner_pretty.js:569079-569207). See [fleet_view_component_tree.md](./fleet_view_component_tree.md).
- `FleetViewDashboard` (`EQ4`) — React component for the dashboard (cli_inner_pretty.js:567084-568873). See [fleet_view_component_tree.md](./fleet_view_component_tree.md).
- `runDaemonSupervisor` (`O89`) — Top-level daemon entry; the persistent process (cli_inner_pretty.js:609952-610186). See [daemon_lifecycle.md](./daemon_lifecycle.md).
- `BgWorkerHandle` (`aB`) — Class wrapping a single worker; tracks phase, retire grace, attach count (cli_inner_pretty.js:527781-528596). See [worker_state_machine.md](./worker_state_machine.md).
- `BgWorkerHandle.retireIfSettled` — Per-tick predicate that drives retirement (cli_inner_pretty.js:527901-527964).
- `BgWorkerHandle.shiftGraceClocksForward` — v2.1.142 sleep/wake adjustment (cli_inner_pretty.js:528143-528147).
- `createRvClient` (`RI4`) — Daemon-side socket connector with retry backoff (cli_inner_pretty.js:527606-527689). See [rv_socket_protocol.md](./rv_socket_protocol.md).
- `getBinaryIdentity` (`f89`) — `{ target, mtimeMs }` realpath+stat probe (cli_inner_pretty.js:609938-609947).
- `binaryIdentityChanged` (`tKA`) — Compares identities, skipping mtime on Windows (cli_inner_pretty.js:609948-609951).
- `parseAgentsDispatchFlags` (`Go6`) — Pre-Commander scanner (cli_inner_pretty.js:65-103).
- `coerceDispatchDefaults` (`gg4`) — Validates `--model`/`--effort`/`--permission-mode` (cli_inner_pretty.js:565469-565478).
- `claimSpareOrColdDispatch` (`jN4`) — Pre-warmed worker claim with fallback (cli_inner_pretty.js:509877-509921).
- `attachJob` (`AN4`) — Foreground-terminal attach with reconnect/orphan handling (cli_inner_pretty.js:509564-509634).
- `normalizeAgentTypeSlug` (`Zu7`) — v2.1.140 subagent_type normalization (see also `30_agent_team/v2_1_142_subagent_matching.md`).
- `getAttacherCaps` (`vJ`) / `setAttacherCaps` (`aV8`) — Capability forwarding from attaching terminal (cli_inner_pretty.js:2686-2691).
- `STATE_LABELS` (`og4`) — `{review:"Ready for review", blocked:"Needs input", working:"Working", done:"Completed"}` (cli_inner_pretty.js:569354-569355).
- `STATE_ORDER` (`rg4`) — `["review","blocked","working","done"]` group ordering (cli_inner_pretty.js:569354).
- `classifyState` (`byH`) — Maps job state → bucket; powers grouping and counts (cli_inner_pretty.js:565759).

## Reading Order

Start with **README.md** (this file) and **agent_view.md** for the surface. Then:

1. **Architecture deep-dives** (in order of system layer):
   - [worker_state_machine.md](./worker_state_machine.md) — what one worker's lifecycle looks like
   - [rv_socket_protocol.md](./rv_socket_protocol.md) — how the daemon talks to the worker
   - [daemon_lifecycle.md](./daemon_lifecycle.md) — how the supervisor manages all workers
   - [fleet_view_component_tree.md](./fleet_view_component_tree.md) — how the user-facing dashboard renders

2. **Feature deep-dives** (independent — read whichever you're investigating):
   - [worktree_recognition.md](./worktree_recognition.md), [editor_resolution.md](./editor_resolution.md), [chrome_extension_isolation.md](./chrome_extension_isolation.md), [cwd_filter.md](./cwd_filter.md), [completed_vs_working.md](./completed_vs_working.md), [pre_warm_worker.md](./pre_warm_worker.md), [keep_dangerous_skip.md](./keep_dangerous_skip.md), [dispatch_flags.md](./dispatch_flags.md)
