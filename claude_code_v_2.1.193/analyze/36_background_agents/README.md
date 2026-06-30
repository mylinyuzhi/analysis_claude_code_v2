# 36 — Background Agents & Subagent Depth (v2.1.183 → v2.1.193, EXTEND)

> Delta module: documents the **v2.1.183 → v2.1.193** changes to the background-agents subsystem and the nested-subagent depth model.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION `2.1.193`, build `a1938d2a`, 2026-06-25). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged *(183)*.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> **CANONICAL for everything unchanged:** the v2.1.183 tree [`../../../claude_code_v_2.1.183/analyze/36_background_agents/`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md), which itself links the v2.1.156 baseline for the dispatcher seam, shell-exec sessions, the classifier engine, the pty-host watchdog, and the daemon retire/respawn lifecycle. Obfuscated names are **re-mangled every build** — none from 183 are reused here; all 193 obf names were re-derived by line.

---

## TL;DR — two clean NET-NEW mechanisms, one body-change, the rest is carryover

The bg-agents machine is structurally the same as 183. This window's genuine, source-backed deltas are:

1. **NET-NEW (2.1.193): memory-pressure reaping of idle bg shells.** A `process.on("memoryPressure")` listener kills long-idle (≥30 min) top-level backgrounded `local_bash` tasks under OS memory pressure, behind seven guards and a default-on disable env. `memoryPressure` / `task_local_shell_pressure_reap` are **0 in 183**. → [`bg_shell_pressure_reap.md`](./bg_shell_pressure_reap.md)
2. **NET-NEW + body-change (2.1.187): subagent depth tracking.** Resume now restores the persisted `spawnDepth` (183 lost it via a `void 0` fallback), and a net-new spawn-time `subagent_depth_cap` **throw** at the Agent-tool call entry makes **forks count toward** the 5-level cap (183 enforced only by tool-removal). `subagent_depth_cap` is **0 in 183**. → [`subagent_depth_tracking.md`](./subagent_depth_tracking.md)
3. **NET-NEW (2.1.191): stop is permanent.** Stopping a bg agent writes a durable `stoppedByUser` marker; all resume/continue paths refuse to resurrect it unless force-resumed (which clears the marker). `stoppedByUser` is **0 in 183, 9 in 193**. → [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md)
4. **ISOLABLE fixes + honestly-flagged UI items (2.1.193/191):** the carry-over-aware "N tasks would be abandoned" count fix, the "end your response" launch-result drop, the phantom "general-purpose (resumed)" subagent guard, the 193-only bg-job cwd/resume metadata refresh after `/cd` and conversation reset, plus remaining non-isolable UI/channel items. → [`backgrounding_and_panel_fixes.md`](./backgrounding_and_panel_fixes.md)

The 2.1.187 "bg jobs stuck working" finalizer turned out to be **carryover** (byte-equivalent to 183, call site pre-exists) — documented as such in [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md) §2 to prevent false-delta drift.

---

## What changed at a glance

| # | Delta | Kind | 193 anchor | 183 before | Confidence |
|---|-------|------|-----------|-----------|:----------:|
| D1 | idle bg-shell memory-pressure reaper | **NET-NEW** | `Mgl` :454354; `memoryPressure` :454363; `Ldu` :43175 | `memoryPressure`/reap = **0** | HIGH |
| D2 | resume restores persisted `spawnDepth` | body-change | `:441544` `(Kl(_)?_.spawnDepth:b?.spawnDepth)??K3(...)+1` | else-branch was `void 0` :434085 | HIGH |
| D3 | spawn-time depth-cap throw (forks counted) | **NET-NEW** | `:430477-430484`; `FBt=5` :229871 | `subagent_depth_cap` = **0** | HIGH |
| D4 | stop is permanent (`stoppedByUser`) | **NET-NEW** | `Mde` :431808; `CXp` :431816; resume guard :441527 | `stoppedByUser` = **0** | HIGH |
| D5 | carry-over-aware abandoned count | ISOLABLE | `oUo` :578073; `fze` :578006; UI :689578 | "would be abandoned" = **0** | HIGH |
| D6 | bg launch result drops "end your response" | body-change | async_launched :431256-431261 | both branches had it :424285 | HIGH |
| D7 | phantom "general-purpose (resumed)" guard | PARTIAL | `Lgl` :454100; adoption :688699; `main-session` 9→10 | guard count 9 | MED |
| D8 | turn-end "working" finalizer | **CARRYOVER** | `Exo` :464591; call :689760 | `pgo` :456114; call :675899 (byte-equiv) | HIGH (that it's carryover) |
| D9 | bg-job cwd/resume metadata refresh | **NET-NEW metadata fix** | `k3i` :193514 / call :484488; `R3i` :193529 / call :485419; classifier consumes `$Kr` :465236/:465238 | no equivalent between reset and `NW(...)`; classifier wrote stale `T?.cwd`/`T?.originCwd` | MED-HIGH |
| — | pin-specific re-prompt guard / panel rows / channel drop | PARTIAL / UI-BOUNDED / NOT ISOLABLE | `WWn` unchanged; metadata fix isolated; panel frame rows bounded at `dSc`/`Eim` | — | MED for panel render mechanism; LOW for direct UI/channel guard |

---

## Files in this module

```
36_background_agents/   (v2.1.193 — DELTA tree, EXTENDs the 183 tree)
├── README.md                       ← you are here (index + at-a-glance + carryover pointer)
├── bg_shell_pressure_reap.md       ← NET-NEW: process.on("memoryPressure") idle-bg-shell reaper;
│                                       7 guards, 30-min idle floor, default-on disable env.
├── subagent_depth_tracking.md      ← 2.1.187: resume-restore (b?.spawnDepth) + net-new spawn-time
│                                       subagent_depth_cap throw (forks counted). Continues 183 depth work.
├── agent_stop_lifecycle.md         ← 2.1.191 stop-is-permanent (stoppedByUser markers + resume refusal);
│                                       + the 2.1.187 turn-end "working" finalizer shown to be CARRYOVER.
└── backgrounding_and_panel_fixes.md← carry-over-aware "abandoned" count; "end your response" drop;
                                        phantom "(resumed)" guard; honestly-flagged UI/channel items.
```

## Reading order

1. **This README** — the delta index.
2. **`subagent_depth_tracking.md`** — read after the 183 [`nested_subagent_depth_limit.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md), which it directly continues (it re-derives the carryover constant/reader and shows only the two 187 fixes).
3. **`agent_stop_lifecycle.md`** — the durable `stoppedByUser` state machine and the carryover finalizer.
4. **`bg_shell_pressure_reap.md`** — the standalone memory-pressure reaper.
5. **`backgrounding_and_panel_fixes.md`** — the backgrounding/panel UX cluster.

---

## Carryover note — what to read in the 183 tree (do NOT re-derive here)

This module documents **only** the 183→193 delta. For all of the unchanged machinery, the **v2.1.183 tree is canonical** (and it in turn links the v2.1.156 baseline). Specifically, read the 183/156 docs for:

- **The full depth machinery** (constant → `getAgentDepth` reader → the `cio`/`bte` tool-filter gate → `Gz(parent)+1` threading at every spawn surface → `spawnDepth` persistence → `agent_depth` telemetry → the v2.1.156 `uE6` team-only before-picture): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/nested_subagent_depth_limit.md). The 193 doc covers only the resume-restore and the new spawn-time throw on top of it.
- **The `/bg` (`/background`) command surface** (def → call → seed → confirm-UI → fork-over-the-dispatcher), the **unified dispatcher seam**, **shell-exec background sessions**, the **four-state classifier engine + phone push**, the **pty-host orphan watchdog**, the **daemon retire/respawn lifecycle + binary-takeover**, the **worker env-isolation** rework, and the **`agents --json`** surface: all in the 183 README and its companion docs ([`../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md)), which re-base onto the v2.1.156 baseline.
- **The bg-job state machine** (working/blocked/done/failed, startup-wedge, the turn-end `markReplayNoOp` finalizer): the *engine* is carryover; only the `--json` surfacing and the durable `stoppedByUser` marker changed in this window. See [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md) §2 for the byte-equivalence proof of the finalizer.

### Confirmed false-deltas (do not chase these in 193)

- **Turn-end "working" finalizer** (`Exo`/`markReplayNoOp`): byte-equivalent to 183 `pgo`, call site pre-exists — CARRYOVER, only debug logging added. See `agent_stop_lifecycle.md` §2.
- **Leaked locked `.git/worktrees/` cleanup** (`xre`/`k2o` worktree prune): byte-identical to 183's `qte`/`Yko` stale-worktree sweep (prune count 4=4); the 2.1.187 "locked entries from killed agents" item is **not** a net-new mechanism in this window at this layer.
- **Channel-drop EventSource**: the bundle's `EventSource` sites are the feature-gate/StatSig streaming SDK, identical in 183 (count 4=4) and unrelated to the agents channel.
- **Depth limit value `5`**: carryover (`v1i=5`@183 → `FBt=5`@193) — the *value* did not change in 193, only *which spawns are counted* against it.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the depth filter/registry path: `K3`, `Kl`, `FBt`)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Background Agents** is the home module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (telemetry, env getters)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (agents-view CLI/panel)
> - [../00_overview/symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md) — the granular v2.1.193 additions for this module

Headline functions/constants (full per-doc lists live in each companion's `## Related Symbols`):

- `registerBgShellPressureReaper` (obf: `Mgl`, `:454354`) + `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (obf: `Ldu`, `:43175`) + `BG_SHELL_IDLE_REAP_MS` (obf: `eof`, `:454610`) — the memory-pressure reaper.
- `SUBAGENT_DEPTH_LIMIT` (obf: `FBt`, `:229871`) + `getAgentDepth` (obf: `K3`, `:103808`) — depth cap/reader (carryover of 183 `v1i`/`Gz`); the 187 fixes are at `:441544` (resume-restore) and `:430477-430484` (spawn-time throw).
- `markAgentStoppedByUser` (obf: `Mde`, `:431808`) + `persistStopMarker` (obf: `CXp`, `:431816`) — durable stop marker; resume refusal at `:441527`/`:441645`/`:442238`.
- `countAbandonedBgTasks` (obf: `oUo`, `:578073`) + `computeCarryOverMap` (obf: `fze`, `:578006`) — carry-over-aware abandoned count.
- `registerCompletedResumedAgent` (obf: `Lgl`, `:454100`) — phantom "(resumed)" card defaults; `main-session` guard 9→10.
- `refreshBgJobCwdAfterCd` (obf: `k3i`, `:193514`) + `refreshBgJobResumePointers` (obf: `R3i`, `:193529`) + `currentBgCwdOverride` (obf: `$Kr`, `:193511`) — 193-only bg-job metadata refresh consumed by the classifier at `:465236`/`:465238`.
- `markReplayNoOp` (obf: `Exo`, `:464591`; 183 `pgo`@456114) — turn-end finalizer; **CARRYOVER**.
