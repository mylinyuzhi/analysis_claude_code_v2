# Background Agents Module (36_background_agents) — v2.1.156

## TL;DR

The v2.1.142 reference module documented the *foundation* of background agents: the `claude agents` dashboard,
the on-demand daemon, the rv-socket protocol, the worker phase machine, and the agent-view component tree. This
v2.1.156 module is a **delta** on top of that — it covers the new shell-exec capability and the reliability
hardening shipped across v2.1.143 → 2.1.156. It deliberately does **not** re-document the unchanged foundation;
read the v2.1.142 docs first, then these for what moved.

Three things define this delta:

1. **Shell-exec background sessions (NEW in 2.1.154).** You can now run a raw shell command as a first-class
   background session — `claude --bg --exec '<cmd>'` from the CLI, or `! <command>` typed in the `claude agents`
   view. There is **no LLM in the loop**: the bg worker `exec`s `$SHELL -c "<cmd>"` directly. Both front doors
   converge on a single new option (`exec`) threaded through the **unified dispatcher** `ol`/`ywz`, which builds a
   `{ mode: "exec", ... }` launch descriptor instead of a Claude-session launch.

2. **The unified dispatcher `ol` (`unifiedBgDispatch`).** In 2.1.156 *every* bg dispatch — `--bg`, `--bg --exec`,
   the `!` bang, the `/bg` REPL handoff, daemon-side fleet respawn, and pre-warmed spare claim — funnels through
   one async seam. `ol` runs the permission gate and allocates identity; its worker `ywz` chooses the launch mode
   (`exec` / `resume` / `prompt`), seeds the on-disk job state, sends the dispatch, and runs an ack-timeout rescue.

3. **A focused reliability pass (2.1.143–156).** The four-state background-session classifier that drives phone
   notifications; the worker retire/respawn fixes (pinned guard, broadened settled predicate, low-memory
   pinned-shed, sleep/wake clock shift); the subagent worktree-isolation fix and the `--bg-pty-host` orphan
   watchdog; and the daemon stale-exec fallback, binary-takeover, and `/bg`-while-responding live-turn handoff.

**Confidence: high.** Every claim in the deep-dive docs is cited to a `cli_inner_pretty.js:<line>` read directly
in the 2.1.156 bundle. The entire shell-exec capability, the `ol`/`ywz` launch-mode abstraction, the four-state
classifier, the goal snapshot, pinning, and the pty-host are all **NEW post-2.1.88** (the v2.1.88 background
subsystem only handed *sessions* to a daemon). One medium-confidence gap is noted in §Gaps.

## What's New vs v2.1.142

| Capability | Status | Where it lives |
|------------|--------|----------------|
| `claude --bg --exec '<cmd>'` / `! <command>` shell sessions | NEW (2.1.154) | `shell_exec_sessions.md` |
| Unified dispatcher `ol`/`ywz` with `exec`/`resume`/`prompt` launch modes | NEW | `unified_dispatcher_ol.md` |
| Four-state bg-session classifier (working/blocked/done/failed) + phone push | NEW | `bg_session_classifier.md` |
| Pinned-session guard, broadened settled predicate, low-mem pinned-shed, bridge grace | NEW (2.1.156) | `worker_retire_respawn_2156.md` |
| Subagent worktree-isolation guard + `--bg-pty-host` orphan watchdog (macOS) | NEW (2.1.156) | `worktree_isolation_and_pty_orphan.md` |
| Daemon stale-exec fallback / binary-takeover / `/bg` live-turn handoff | NEW (2.1.144–153) | `daemon_binary_takeover_and_bg_handoff.md` |
| `/background` (`/bg`) slash command — full surface (def → call → seed → confirm-UI → fork) + `/stop`, `/fork` siblings | NEW (post-2.1.88; handoff layer 2.1.144+) | `background_slash_command.md` |

## Architecture

```
   CLI:  claude --bg --exec "npm test"        Agents view:  user types "! npm test"      REPL:  /bg (mid-turn)
                  │                                          │                                   │
                  ▼                                          ▼                                   ▼
        bgFlagExecHandler (hwz)                    parseFleetDispatchInput (q5q)        backgroundCurrentSession
        541956                                     614290 → {template, exec}            (zh8) 542680
                  │ {intent, exec, name?}                    │ fleetDispatchExec (pe4)            │ --resume <id>
   CLI:  claude --bg "fix the bug"                          │ 541031 (seeds Xwz first)           │ --fork-session
                  │ ol(fullArgv)                             │ ol([], id, "fleet", …)             │ ol(.., "repl", ..)
                  ▼                                          ▼                                   ▼
        ┌──────────────────────────────────────────────────────────────────────────────────────────┐
        │                       unifiedBgDispatch  ol(argv, sid, source, cwd, opts)   541769         │
        │   1. bgDispatchGate (Bwz)  → blocked? return gate_blocked                                   │
        │   2. sessionId = sid ?? randomUUID();  short = id[0:8];  mkdir <jobDir>/tmp                 │
        │   3. dispatchWorker (ywz) 541789 →  launch-mode cascade:                                    │
        │        opts.exec      → { mode:"exec",  ...resolveShellLaunch(cmd) }   ← shell, no LLM      │
        │        resume flags   → { mode:"resume", sessionId, fork, flagArgs }                        │
        │        else (default) → { mode:"prompt", args }                        ← Claude bg session  │
        │      seed job state · sendDispatch (Tqq) · ack-timeout/enoconn rescue                       │
        └───────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                     │ daemon dispatch
                                                     ▼
        ┌──────────────────────────────────────────────────────────────────────────────────────────┐
        │  Daemon supervisor (tick every 60s)  +  BgWorkerHandle (SF, was aB)                         │
        │    · respawnIfIdleStale  (pinned-only upgrade respawn; exec excluded)                       │
        │    · retireIfSettled     (pinned guard; broadened settled predicate; bridge grace)          │
        │    · low-mem escalation  (shed pinned settled as last resort → tengu_bg_retire_pinned_low_mem)│
        │    · sleep/wake          (shiftGraceClocksForward, skip retire pass on a clock jump)         │
        └───────────────────────────────────────────┬──────────────────────────────────────────────┘
                  │ spawn worker (Bun.spawn --bg-pty-host …)                       ▲ classifier writes
                  ▼                                                                │ state/detail/tempo
        ┌──────────────────────────────────────┐         ┌────────────────────────────────────────────┐
        │  PTY host (jPz, --bg-pty-host)        │         │  After each assistant turn:                  │
        │   · Bun.Terminal + REPL child         │         │  classifyState (JT4) reads ONLY the message  │
        │   · orphan watchdog: re-parented &    │         │  tail → fast-path (i04) | LLM (r04 prompt)   │
        │     clientless ~60s → SIGTERM/SIGKILL │         │  → working/blocked/done/failed               │
        │   · macOS TCC-disclaim re-exec (a69)  │         │  blocked → phone push notification           │
        └──────────────────────────────────────┘         └────────────────────────────────────────────┘
                  │ (exec sessions only)
                  ▼
        $SHELL -c "<cmd>"  |  %COMSPEC% /d /s /c  |  /bin/sh -c   ← resolveShellLaunch (Ewz)
```

## The Exec Convergence — One Field, Two Front Doors

The whole shell-exec feature is expressed as a single `exec` option on the dispatch seed:

```
claude --bg "fix the flaky test"     →  ol(fullArgv)             →  launch.mode = "prompt"  (Claude agent)
claude --bg --exec 'pytest -x'       →  ol([], …, {exec})        →  launch.mode = "exec"     (raw shell)
! pytest -x   (in agents view)       →  pe4 → ol([], …, {exec})  →  launch.mode = "exec"     (raw shell)
```

When `exec` is set, `ywz` (a) stamps the job's template name to `"exec"`, and (b) builds
`{ mode:"exec", ...resolveShellLaunch(cmd) }` — so the daemon spawns a plain shell, no `claude` re-invocation, no
model, no system prompt. That is why `--exec` ignores every agent flag except `--name`, and why exec sessions get
two special respawn treatments: re-run the command on **explicit** respawn, but **exclude** exec sessions from
version-upgrade respawn (you must never silently re-run `npm publish` because the daemon upgraded).

## Module Structure

| Document | Purpose |
|----------|---------|
| `README.md` | This file — module index, architecture, reading order. |
| [shell_exec_sessions.md](./shell_exec_sessions.md) | The NEW (2.1.154) shell background-session capability: the two entry points (CLI `--exec` handler `hwz`; agents-view `! <command>` parser `q5q` + `fleetDispatchExec` `pe4`) converging on `ol`; command capture, the `--name`-only compose rule, the always-on gate `gy$`, `resolveShellLaunch` (`Ewz`), the exec template `Xwz`, and `cli_bg_dispatch_exec` / `fleet_view_dispatch_exec` telemetry. No v2.1.88 precursor. |
| [unified_dispatcher_ol.md](./unified_dispatcher_ol.md) | The v2.1.156 unified dispatcher `ol` (`unifiedBgDispatch`) and worker `ywz` (`dispatchWorker`) — the single seam every bg dispatch flows through: the source discriminator (`shell`/`fleet`/`repl`/`spare`), the exec/resume/prompt launch-mode cascade, the `bgDispatchGate` (`Bwz`) permission check, idle-placeholder seeding, the ack-timeout/enoconn dispatch-rescue path (`tengu_bg_dispatch_rescued`), and the two exec-respawn special cases. |
| [bg_session_classifier.md](./bg_session_classifier.md) | The four-state background-session classifier: the writer prompt `IV6` (built-in `claude` agent that emits `result:`/`needs input:`/`failed:` markers) and reader prompt `r04`; the regex fast-path battery `i04` + state maps; the LLM dispatcher `JT4` and tool-use summary generators; and the goal-snapshot tracker `nS$` underlying the 2.1.156 "classifier losing the user goal when a scheduled `/command` fires" fix. |
| [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md) | The v2.1.156 worker-reliability fixes inside the renamed handle `BgWorkerHandle` (`SF`, was `aB`) and the supervisor tick: pinned-set guard in `retireIfSettled`, broadened non-exec settled predicate, settled-and-pinned respawn, bridge grace, sleep/wake clock shift, and low-memory pinned-shed escalation (`tengu_bg_retire_pinned_low_mem`). |
| [worktree_isolation_and_pty_orphan.md](./worktree_isolation_and_pty_orphan.md) | Two independent 2.1.156 process-safety fixes: the worktree-isolation guard `esH` gaining a `$.agentId` subagent branch (`f6` vs `C$` cwd selection) so subagents in bg sessions stop bypassing isolation; and the `--bg-pty-host` orphan watchdog that SIGTERM/SIGKILLs a re-parented, clientless REPL child after ~60s, plus the macOS TCC-disclaim respawn (`a69`) and process-group signal forwarding. |
| [daemon_binary_takeover_and_bg_handoff.md](./daemon_binary_takeover_and_bg_handoff.md) | Three daemon/lifecycle deltas: the 2.1.144/145 service stale-exec fallback in `ensureDaemonRunning` (`EF`); the 2.1.153 client-side binary-takeover of a stale transient daemon (`Mwz`/`Owz`, SIGKILL + `tengu_bg_daemon_binary_takeover`); and the `/bg`-while-responding live-turn handoff (`zh8`) that resumes the session in a bg worker via `--resume --fork-session --reply-on-resume` with conditional worktree handoff. |
| [background_slash_command.md](./background_slash_command.md) | The **full `/background` (`/bg`) slash-command surface** end-to-end: the `local-jsx` command def (`owz`/`awz`) + lazy-load split (`MH9`/`OH9`/`Sqq`); the `call` handler `Fwz` and its three guards (already-bg `v7`/`bzH`, persistence-off `NWH`, empty-seed); the reverse-scan seed deriver `Ah8` (`deriveBackgroundSeed` → `{intent,name,nameSource,detail}`); the `BackgroundForkPrompt` `gwz` confirm UI (auto-confirm-when-idle vs "Background anyway" when busy, inflight counter `hV8`, once-only effect, decline telemetry, banner `ny$`); the argv builder `zh8` (`spawnBackgroundFork`) with `--resume --fork-session [--reply-on-resume]`, worktree handoff, async auto-naming over `ol`; the sibling `/stop` (`Yh8`) and `/fork` (`Wr6`) lifecycle commands; the full `tengu_background*` telemetry family; and 2.1.88 cross-validation (the handoff layer is NEW atop the pre-existing `--fork-session` primitive). This is the dedicated command analysis; `daemon_binary_takeover_and_bg_handoff.md` §3 keeps `/bg` only as the daemon-handoff delta. |

> **Foundation (unchanged, see v2.1.142):** the agent-view dashboard UI, the rv-socket protocol, the daemon's
> adopt/idle-exit, and the worker phase enum / transition guard / `onExit` / static factories are documented in
> `../../../claude_code_v_2.1.142/analyze/36_background_agents/` and are not repeated here. The
> `worker_retire_respawn_2156.md` and `daemon_binary_takeover_and_bg_handoff.md` docs are explicit deltas on
> `worker_state_machine.md` and `daemon_lifecycle.md` respectively.

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-module additions file (never as tables in the
> deep-dive docs):
> - [symbol_additions_v2_1_156_background_agents.md](../00_overview/symbol_additions_v2_1_156_background_agents.md) — the consolidated table of every v2.1.156 symbol introduced/touched by this module
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Background Agents is a core feature; canonical home for the dispatcher/classifier/worker symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (agent/state: `Ce4`, `IV6`)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform (the telemetry helpers, `bgDispatchGate`)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (the agents-view input parser `q5q`)

Key functions/objects (list format, per project rules):

- `bgFlagExecHandler` (`hwz`) — `claude --bg --exec` CLI handler (cli_inner_pretty.js:541956-542006). See [shell_exec_sessions.md](./shell_exec_sessions.md).
- `parseFleetDispatchInput` (`q5q`) — agents-view input parser; leading `!` → shell-exec (cli_inner_pretty.js:614290-614318). See [shell_exec_sessions.md](./shell_exec_sessions.md).
- `fleetDispatchExec` (`pe4`) — agents-view shell-exec dispatch; pre-seeds state, then `ol` (cli_inner_pretty.js:541031-541059). See [shell_exec_sessions.md](./shell_exec_sessions.md).
- `resolveShellLaunch` (`Ewz`) — `$SHELL -c` / `COMSPEC /d /s /c` / `/bin/sh -c` launch resolver (cli_inner_pretty.js:541727-541736). See [shell_exec_sessions.md](./shell_exec_sessions.md).
- `unifiedBgDispatch` (`ol`) — the single bg-dispatch seam: gate, identity, delegate (cli_inner_pretty.js:541769-541788). See [unified_dispatcher_ol.md](./unified_dispatcher_ol.md).
- `dispatchWorker` (`ywz`) — launch-mode select, seed state, send, rescue (cli_inner_pretty.js:541789-541955). See [unified_dispatcher_ol.md](./unified_dispatcher_ol.md).
- `bgDispatchGate` (`Bwz`) — pre-dispatch bypass/auto permission gate (cli_inner_pretty.js:542514-542529). See [unified_dispatcher_ol.md](./unified_dispatcher_ol.md).
- `isExecSession` (`ujH`) — `template==="exec" && respawnFlags.length===0` (cli_inner_pretty.js:184286-184288). See [unified_dispatcher_ol.md](./unified_dispatcher_ol.md).
- `classifyState` (`JT4`) — fast-path → heuristic → LLM classifier dispatcher (cli_inner_pretty.js:450335-450419). See [bg_session_classifier.md](./bg_session_classifier.md).
- `classifierPrompt` (`r04`) / `CLAUDE_AGENT_DEF` (`IV6`) — the reader/writer prompt pair (cli_inner_pretty.js:449361 / 236184). See [bg_session_classifier.md](./bg_session_classifier.md).
- `SessionStateTracker` (`nS$`) — session state + goal snapshot; goal-clear-on-running (cli_inner_pretty.js:623957-623995). See [bg_session_classifier.md](./bg_session_classifier.md).
- `BgWorkerHandle` (`SF`) — worker-handle class, renamed from `aB` (cli_inner_pretty.js:559938). See [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md).
- `BgWorkerHandle.retireIfSettled` — per-tick retire decision; pinned guard + broadened predicate (cli_inner_pretty.js:560062-560135). See [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md).
- `BgWorkerHandle.respawnIfIdleStale` — upgrade-driven respawn; exec exclusion + pinned-settled respawn (cli_inner_pretty.js:560029-560061). See [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md).
- `loadPinnedSet` (`Qw$`) — read `pins.json` into a Set each tick (cli_inner_pretty.js:184012-184022). See [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md).
- `worktreeIsolationGuard` (`esH`) — path-block predicate run before writes; 2.1.156 subagent branch (cli_inner_pretty.js:346660-346684). See [worktree_isolation_and_pty_orphan.md](./worktree_isolation_and_pty_orphan.md).
- `runPtyHost` (`jPz`) — `--bg-pty-host` entry + orphan watchdog (cli_inner_pretty.js:559067-559275). See [worktree_isolation_and_pty_orphan.md](./worktree_isolation_and_pty_orphan.md).
- `ensureDaemonRunning` (`EF`) — daemon reachability; stale-exec transient fallback (cli_inner_pretty.js:540124-540208). See [daemon_binary_takeover_and_bg_handoff.md](./daemon_binary_takeover_and_bg_handoff.md).
- `takeoverStaleDaemon` (`Mwz`) / `isDaemonStaleVsClient` (`Owz`) — client-side binary-takeover (cli_inner_pretty.js:540233-540291 / 540220-540232). See [daemon_binary_takeover_and_bg_handoff.md](./daemon_binary_takeover_and_bg_handoff.md).
- `backgroundCurrentSession` / `spawnBackgroundFork` (`zh8`) — `/bg` live-turn handoff via `--resume --fork-session` (cli_inner_pretty.js:542680-542731). Bundler export name is `spawnBackgroundFork`. See [background_slash_command.md](./background_slash_command.md) §5 and [daemon_binary_takeover_and_bg_handoff.md](./daemon_binary_takeover_and_bg_handoff.md).
- `formatBgHints` (`ny$`) — "backgrounded · <short>" banner with attach/logs/stop hints (cli_inner_pretty.js:542079-542089). Shared by `hwz` and `gwz`.
- `backgroundCommandDef` (`owz`/`awz`) — the `/background` (`/bg`) `local-jsx` command def; `immediate:(H)=>!H.trim()` (cli_inner_pretty.js:542938-542951). See [background_slash_command.md](./background_slash_command.md) §1.
- `backgroundCall` (`Fwz`) — the command's `call` handler: already-bg (`v7`/`bzH`), persistence-off (`NWH`), empty-seed guards → `BackgroundForkPrompt` (cli_inner_pretty.js:542895-542912). See [background_slash_command.md](./background_slash_command.md) §2.
- `deriveBackgroundSeed` (`Ah8`) — reverse-scan transcript → `{intent,name,nameSource,detail}` (cli_inner_pretty.js:542733-542762). See [background_slash_command.md](./background_slash_command.md) §3.
- `BackgroundForkPrompt` (`gwz`) — confirm UI; auto-confirm-when-idle vs "Background anyway" when `hV8` count > 0; once-only fork effect (cli_inner_pretty.js:542763-542873). See [background_slash_command.md](./background_slash_command.md) §4.
- `stopSelfSession` (`Yh8`) / `forkConversation` (`Wr6`) — the `/stop` and `/fork` sibling lifecycle commands (cli_inner_pretty.js:542955 / 454216). See [background_slash_command.md](./background_slash_command.md) §6.

## Reading Order

Start here (**README.md**), then read in this order:

1. **The new launch surface** (read these two as a pair — they explain how a shell command becomes a bg session):
   - [shell_exec_sessions.md](./shell_exec_sessions.md) — the two front doors and the `exec` field
   - [unified_dispatcher_ol.md](./unified_dispatcher_ol.md) — the single seam `ol`/`ywz` and the launch-mode cascade
   - [background_slash_command.md](./background_slash_command.md) — the third front door: the in-REPL `/background` (`/bg`) command that hands the *current* session to a bg worker (def → call → seed → confirm UI → `zh8` fork over `ol`)

2. **The notification engine** (independent — read when investigating phone push / job-list state):
   - [bg_session_classifier.md](./bg_session_classifier.md) — how a worker's state is derived from message text

3. **The reliability deltas** (each is a delta on a v2.1.142 doc — read whichever bug you're chasing):
   - [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md) — pinned/settled/low-mem/sleep-wake (delta on `worker_state_machine.md`)
   - [worktree_isolation_and_pty_orphan.md](./worktree_isolation_and_pty_orphan.md) — subagent isolation + pty-host orphan
   - [daemon_binary_takeover_and_bg_handoff.md](./daemon_binary_takeover_and_bg_handoff.md) — daemon staleness + `/bg` handoff (delta on `daemon_lifecycle.md`)

For the unchanged foundation (dashboard UI, rv-socket protocol, daemon adopt/idle-exit, worker phase machine),
consult `../../../claude_code_v_2.1.142/analyze/36_background_agents/`.

## Gaps / For the Next Pass

- **Cron-goal-loss patch site (medium confidence).** `bg_session_classifier.md` §6.3 pinpoints the *mechanism*
  of the 2.1.156 "classifier losing the user's goal when a scheduled `/command` fires" fix — the
  `notifyStateChanged("running")` → `{goal:null}` clear at cli_inner_pretty.js:623973-623975, armed only by a
  `met===true` goal at 623983, with `activeGoal.condition` as the durable join key — but the *exact* code that
  distinguishes a cron-injected command turn from a user turn (to preserve the goal across the scheduled fire)
  could not be isolated to a single line. Four candidate touch points are enumerated there. (unverified)
- **2.1.154 UI-routing gates — RESOLVED (high confidence).** The `/logout`-signs-out and `←←`-agents-view-on-
  Bedrock/Vertex/Foundry behaviors are now pinned to source in `daemon_binary_takeover_and_bg_handoff.md`
  §"2.1.154 UI-Routing": `/logout` routes through the FleetView submit handler's `fleetHostCall` short-circuit
  (cli_inner_pretty.js:616719-616734) — its command def `cS4` carries `fleetHostCall`→`fleetHostLogout`
  (cli_inner_pretty.js:475334-475344); the `←←` gate is `S$$()` = `Ap() && !d6()` (cli_inner_pretty.js:461739-461741),
  which has NO provider/telemetry condition (only env/setting kill-switches via `JgH`/`jM6` + not-remote-workspace),
  exactly why the fix made `←←` work on all providers. Note the *old* provider-gated predicate is no longer in the
  bundle, so only the current clean gate is verifiable.
- **Single-letter regex constants — RESOLVED.** Each classifier regex constant is now cited to its own
  declaration line in the additions file and in `bg_session_classifier.md` (verified by grep over the block):
  `Dd_`@449563, `Jd_`@449564, `Xd_`@449565, `Ld_`@449566, `Wd_`@449567 (body 449568), `Zd_`@449569 (body 449570),
  `Gd_`@449571, `Td_`@449573, `Vd_`@449575, `vd_`@449576, `kd_`@449577, `Nd_`@449579, `Ed_`@449580, `yd_`@449581,
  `hd_`@449583.
