# Memory-Pressure Reaping of Idle Background Shells

> **Type:** NET-NEW behavioral mechanism · **Version:** 2.1.193 · **Module:** `36_background_agents/` (EXTEND)
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` below is a **193** line unless tagged *(183)*.

## TL;DR

2.1.193 adds an **OS-memory-pressure-triggered reaper** for *idle, top-level, backgrounded local shell commands*. When the runtime emits a `memoryPressure` event, a per-shell listener checks seven guards and, if all pass, kills a backgrounded `local_bash` task that has been idle for ≥ 30 minutes. The whole mechanism — the `process.on("memoryPressure", …)` listener, the `task_local_shell_pressure_reap` telemetry event, and the dedicated disable env var `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` — is **absent in 183** (`grep -c memoryPressure` = **0** in 183, **1** in 193). It is **on by default** after upgrade.

---

## What it does

**What it does:** Frees memory under pressure by killing long-idle backgrounded shell commands the user has almost certainly forgotten about, *without* touching shells that are still doing useful work, that belong to a live subagent, or that the user has interacted with recently.

The unit it reaps is a single backgrounded **local bash** task (`type:"local_bash"`, registered by `launchBackgroundLocalBash` (`xPe`, `:454369`) / `backgroundRunningShellTask` (`Kzn`, `:454527`)). It does **not** reap subagents, remote agents, workflows, or foreground shells — those are explicitly protected by the guards below.

---

## How it works

The reaper is registered per backgrounded shell by `registerBgShellPressureReaper` (`Mgl`, `:454354`). The function does three things: (1) registers a keepalive for the shell, (2) — only when all up-front gates pass — installs a `memoryPressure` listener that performs the guarded kill, and (3) returns a cleanup closure that detaches the listener and deregisters the keepalive.

```javascript
// ============================================
// registerBgShellPressureReaper - arm an OS-memory-pressure reaper for one idle bg shell
// Location: cli_inner_pretty.js:454354-454368
// ============================================

// ORIGINAL (for source lookup):
function Mgl(e, t, n, r, o, s) {
  g9e(s, `bash:${e}`, n);
  let i;
  if (s === void 0 && !Tr() && !Be.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP) {
    let a = () => {
      let l = n.get(e);
      if (l?.status !== "running" || l.notified || Date.now() - VI() < eof || umr() || e8e(n.all())) return;
      (Ie("task_local_shell_pressure_reap"), o8t(e, t, "killed", void 0, n, r, o, s), BSe(e, n));
    };
    (process.on("memoryPressure", a), (i = () => process.off("memoryPressure", a)));
  }
  return () => {
    (i?.(), h9e(s, `bash:${e}`, n));
  };
}

// READABLE (for understanding):
function registerBgShellPressureReaper(taskId, description, taskRegistry, toolUseId, kind, agentId) {
  registerKeepalive(agentId, `bash:${taskId}`, taskRegistry);          // g9e — keep the task alive while backgrounded
  let detach;
  // Arm the reaper ONLY for top-level shells, not remote sessions, not when explicitly disabled:
  if (agentId === undefined && !isRemoteMode() && !env.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP) {
    let onMemoryPressure = () => {
      let task = taskRegistry.get(taskId);
      if (
        task?.status !== "running" ||                              // (4) already finished
        task.notified ||                                           // (4) user already saw a result
        Date.now() - getLastInteractionTime() < BG_SHELL_IDLE_REAP_MS || // (5) < 30 min since last interaction
        isMainLoopBusy() ||                                        // (6) we are mid-turn
        hasActiveAgentTasks(taskRegistry.all())                    // (7) real agent work is in flight
      ) return;                                                    // ...do NOT reap
      logEvent("task_local_shell_pressure_reap");                  // Ie — the reap signal/telemetry
      notifyAndFinalizeShellTask(taskId, description, "killed", undefined, taskRegistry, toolUseId, kind, agentId); // o8t
      killLocalShellTask(taskId, taskRegistry);                    // BSe — actually kill the OS process
    };
    process.on("memoryPressure", onMemoryPressure);
    detach = () => process.off("memoryPressure", onMemoryPressure);
  }
  return () => { detach?.(); deregisterKeepalive(agentId, `bash:${taskId}`, taskRegistry); };
}

// Mapping: Mgl→registerBgShellPressureReaper, e→taskId, t→description, n→taskRegistry, r→toolUseId, o→kind, s→agentId,
//          g9e→registerKeepalive, h9e→deregisterKeepalive, Tr→isRemoteMode, VI→getLastInteractionTime,
//          eof→BG_SHELL_IDLE_REAP_MS, umr→isMainLoopBusy, e8e→hasActiveAgentTasks, Ie→logEvent,
//          o8t→notifyAndFinalizeShellTask, BSe→killLocalShellTask
```

### What "memory pressure" is

The trigger is the process-level **`process.on("memoryPressure", …)`** runtime event (`:454363`) — a signal the JS runtime emits when the OS/heap reports it is under memory pressure. The reaper does not poll, does not run a timer, and does not estimate memory itself: it simply piggybacks on the runtime's own pressure notification and uses that as the cue to consider shedding idle work. This event listener is the single net-new line that makes the whole feature observable in a grep (`memoryPressure` count 0 → 1).

### The two arming gates (up-front, set once per shell)

The listener is **only installed** when, at registration time:

1. **`agentId === undefined`** (`s === void 0`, `:454357`) — the shell is **top-level**. A subagent's backgrounded shells (`agentId` set) never arm the reaper, so reaping can never silently kill out from under live nested work. Both registration call-sites (`:454388` in `launchBackgroundLocalBash`, `:454536` in `backgroundRunningShellTask`) pass the task's `agentId`, so the same top-level-only rule holds regardless of entry path.
2. **not remote** (`!isRemoteMode()`, `Tr`, `:3061`) and **not disabled** (`!env.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP`).

### The five per-event guards (re-checked on every `memoryPressure` fire)

When pressure fires, the listener re-reads the *current* task state and bails unless **all** hold (`:454360`):

| # | Guard | Obf | Meaning |
|---|-------|-----|---------|
| 4a | `task.status === "running"` | `l?.status !== "running"` | the shell hasn't already finished/been killed |
| 4b | `!task.notified` | `l.notified` | the user hasn't already been shown a result for it |
| 5 | `now − lastInteractionTime ≥ 30 min` | `Date.now() - VI() < eof` | idle threshold — recent interaction protects the shell |
| 6 | `!isMainLoopBusy()` | `umr()` | not mid-turn — never reap while the agent is actively working |
| 7 | `!hasActiveAgentTasks(all)` | `e8e(n.all())` | no live subagent/remote-agent/workflow that might depend on this shell |

Only when every guard passes does it (a) emit `task_local_shell_pressure_reap` telemetry, (b) call `notifyAndFinalizeShellTask(…,"killed",…)` (`o8t`, `:454302`) to mark the task `killed`/`notified` and surface a notification, and (c) call `killLocalShellTask` (`BSe`, `:382320`) to actually kill the OS shell process.

### The idle threshold

```javascript
// ============================================
// BG_SHELL_IDLE_REAP_MS - idle window before a bg shell becomes reap-eligible (30 min)
// Location: cli_inner_pretty.js:454610
// ============================================

// ORIGINAL (for source lookup):
  eof = 1800000,

// READABLE (for understanding):
  BG_SHELL_IDLE_REAP_MS = 1800000,   // 30 * 60 * 1000 = 30 minutes since last interaction

// Mapping: eof→BG_SHELL_IDLE_REAP_MS
```

`getLastInteractionTime` (`VI`, `:2784`) reads `Nt.lastInteractionTime` — the timestamp of the last user interaction (not the last shell output). So a shell is "idle" from the *user's* perspective, not the process's: a chatty background `tail -f` is still reapable if the user hasn't touched the session in 30 minutes.

### `hasActiveAgentTasks` — the in-flight-work guard

```javascript
// ============================================
// hasActiveAgentTasks / ACTIVE_AGENT_TASK_TYPES - is any real agent work in flight?
// Location: cli_inner_pretty.js:587048 (fn), 587093 (set)
// ============================================

// ORIGINAL (for source lookup):
function e8e(e) {
  for (let t of Object.values(e))
    if ( /* ...t.type ∈ R4f && t.status active... */ ) return !0;
  // ...
}
  R4f = new Set(["local_agent", "remote_agent", "in_process_teammate", "local_workflow"]);

// READABLE (for understanding):
function hasActiveAgentTasks(allTasks) {
  for (let task of Object.values(allTasks))
    if (ACTIVE_AGENT_TASK_TYPES.has(task.type) && /* task is in an active status */) return true;
  return false;
}
ACTIVE_AGENT_TASK_TYPES = new Set(["local_agent", "remote_agent", "in_process_teammate", "local_workflow"]);

// Mapping: e8e→hasActiveAgentTasks, R4f→ACTIVE_AGENT_TASK_TYPES
```

This is the guard that makes reaping safe in a nested/multi-agent world: even a *top-level* idle shell is spared while any subagent, remote agent, teammate, or workflow is alive, because that live work might be about to consume the shell's output.

---

## Why this approach

**Why piggyback on `memoryPressure` instead of a timer/threshold of its own?**
A fixed-interval sweep would either reap too eagerly (killing idle shells the user still wanted, on a machine with plenty of RAM) or too late (after the process already OOM'd). By hooking the runtime's own pressure signal, the reaper does nothing on a healthy machine and only sheds idle work *when the OS says memory is tight* — the cost is paid exactly when there is a benefit. The 30-minute idle floor is then a second-order safety: even under pressure, a shell the user touched recently is never killed.

**Why enforce via seven guards rather than one "is it old?" check?**
Each guard rules out a distinct way the kill could be wrong: status/notified (it's already done), idle threshold (the user cares about it), main-loop-busy (we're mid-turn and might use it), active-agent-tasks (a subagent might use it), agentId/remote/disable (it's not ours to reap). The reaper is deliberately conservative — the failure mode of *not* reaping is "memory stays high a bit longer," whereas the failure mode of a wrong reap is "the user's long-running background command silently dies." The guard stack is biased hard toward the cheaper failure.

**Why a dedicated disable env var (default-off)?**
`Ldu = Fe.bool()` (`:43538`) parses `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` as a boolean defaulting to **false** → the reaper is **ON by default** after upgrading to 2.1.193. Users who deliberately detach long-running background shells and expect them to survive idle periods (CI babysitters, long builds, `tail -f` watchers) must set `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`. The env var exists so the behavior is escapable without a code change, while keeping the memory-saving default for the common case.

---

## Key insight

The reaper is **policy in a listener, not a daemon**: there is no central reaper loop scanning all shells. Each backgrounded top-level shell *arms its own* `memoryPressure` listener at launch and *disarms it* via the returned cleanup closure when the shell ends. The OS pressure event fans out to every armed shell, each independently re-evaluates the guard stack against *current* state, and the first one(s) that qualify get killed. This makes the feature self-cleaning (a finished shell's listener is gone), correct under concurrency (each listener reads live registry state at fire time, not a stale snapshot), and trivially scoped (only top-level shells ever arm, because the `agentId === undefined` gate is checked once at arm time).

---

## Evidence note (NET-NEW vs 183)

| Signal | 183 | 193 |
|--------|-----|-----|
| `grep -c "memoryPressure"` | **0** | **1** (`:454363`) |
| `grep -c "task_local_shell_pressure_reap"` | **0** | **1** (`:454361`) |
| `grep -c "CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP"` | **0** | 2 (`:43175` getter, `:454357` gate) |

Three independent net-new surfaces (event listener + telemetry + disable env) with **zero** presence in 183 ⇒ this is unambiguously a 2.1.193 NET-NEW mechanism, not a re-mangle. **Confidence: HIGH.**

---

## Cross-links

- Sibling 193 docs: [`subagent_depth_tracking.md`](./subagent_depth_tracking.md) (the `agentId`/depth model the `agentId === undefined` gate relies on), [`agent_stop_lifecycle.md`](./agent_stop_lifecycle.md) (the other lifecycle-finalization path), [`backgrounding_and_panel_fixes.md`](./backgrounding_and_panel_fixes.md), [`README.md`](./README.md).
- 183 tree (canonical for the unchanged bg-shell/dispatcher machinery): [`../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md`](../../../claude_code_v_2.1.183/analyze/36_background_agents/README.md); shell-exec sessions baseline [`../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md).

## Related Symbols

> Symbol mappings live in the symbol index files (this doc uses list format, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_background_agents.md](../00_overview/symbol_additions_v2_1_193_background_agents.md)

Key functions/constants in this document:

- `registerBgShellPressureReaper` (obf: `Mgl`, `:454354`) — arms a `memoryPressure` reaper for one idle top-level bg shell.
- `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (obf: `Ldu`, getter `:43175`, parse `:43538`) — default-false disable env; reaper is on by default.
- `BG_SHELL_IDLE_REAP_MS` (obf: `eof`, `:454610`) — `1800000` (30 min) idle floor.
- `getLastInteractionTime` (obf: `VI`, `:2784`) / `isMainLoopBusy` (obf: `umr`, `:3647`) / `isRemoteMode` (obf: `Tr`, `:3061`) — the three live-state probes.
- `hasActiveAgentTasks` (obf: `e8e`, `:587048`) / `ACTIVE_AGENT_TASK_TYPES` (obf: `R4f`, `:587093`) — the in-flight-agent-work guard.
- `notifyAndFinalizeShellTask` (obf: `o8t`, `:454302`) / `killLocalShellTask` (obf: `BSe`, `:382320`) — finalize + kill on reap.
- `registerKeepalive` (obf: `g9e`, `:453737`) / `deregisterKeepalive` (obf: `h9e`, `:453744`) — keepalive bracket around the backgrounded shell.
- `launchBackgroundLocalBash` (obf: `xPe`, `:454369`) / `backgroundRunningShellTask` (obf: `Kzn`, `:454527`) — the two arm sites.
