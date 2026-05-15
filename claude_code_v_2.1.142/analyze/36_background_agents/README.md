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

| Constant | Value | Meaning |
|----------|-------|---------|
| `BB5` (`BG_RECENT_ADOPT_GRACE_MS`) | 120 s | Don't retire workers adopted in the last 2 min. |
| `pB5` (`BG_EMPTY_IDLE_GRACE_MS`) | **5 min** | Auto-retire empty idle bg sessions (v2.1.141). |
| `gKA` (`BG_RETIRE_GRACE_DEFAULT_MS`) | 1 h | Default grace for settled (non-routine) workers. |
| `i$9` (`BG_RETIRE_LOW_MEM_GRACE_MS`) | 60 s | Aggressive grace under memory pressure. |
| `Ur6` (`BG_RETIRE_TICK_MS`) | 60 s | The retire-loop's setInterval period. |
| `mB5` (`BG_REATTACH_TIMEOUT_MS`) | 120 s | How long the supervisor waits during a daemon restart for workers to re-attach. |

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

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) — All v2.1.142 symbols introduced/touched by this module
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Background Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform (Daemon, Permissions)

Key functions/types:
- `mountFleetView` (`ao5`) — Agent-view loop; renders + re-attaches.
- `FleetViewDashboard` (`EQ4`) — React component for the dashboard.
- `runDaemonSupervisor` (`O89`) — Top-level daemon entry; the persistent process.
- `BgWorkerHandle` (`aB`) — Class wrapping a single worker; tracks phase, retire grace, attach count.
- `BgWorkerHandle.retireIfSettled` — Per-tick predicate that drives retirement.
- `BgWorkerHandle.shiftGraceClocksForward` — v2.1.142 sleep/wake adjustment.
- `getBinaryIdentity` (`f89`) / `binaryIdentityChanged` (`tKA`) — Upgrade detection.
- `parseAgentsDispatchFlags` (`Go6`) — Pre-Commander scanner.
- `coerceDispatchDefaults` (`gg4`) — Validates `--model`/`--effort`/`--permission-mode`.
- `claimSpareOrColdDispatch` (`jN4`) — Pre-warmed worker claim with fallback.
- `normalizeAgentTypeSlug` (`Zu7`) — v2.1.140 subagent_type normalization (see also `30_agent_team/v2_1_142_subagent_matching.md`).
- `getAttacherCaps` (`vJ`) / `setAttacherCaps` (`aV8`) — Capability forwarding from attaching terminal.
- `STATE_LABELS` (`og4`) — `{review:"Ready for review", blocked:"Needs input", working:"Working", done:"Completed"}`.

## Reading Order

Start with **README.md** (this file) and **agent_view.md** for the surface. Then read **daemon_lifecycle.md** to understand the supervisor. The remaining documents are independent feature deep-dives — read whichever you're investigating.
