# Agent View — v2.1.139 Research Preview

## TL;DR

`claude agents` mounts a full-screen Ink dashboard that lists every Claude Code background session **on the local machine**, classifies each by status (`Ready for review` / `Needs input` / `Working` / `Completed`), lets you filter by directory, search, group, attach, dispatch new tasks alongside, and manage them. It is also reachable from a foreground REPL via `←←`. The dashboard is a research preview (see https://code.claude.com/docs/en/agent-view).

The implementation is in cli_inner_pretty.js:567084-569362 (`FleetViewDashboard` + `mountFleetView`).

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions:
- `mountFleetView` (`ao5`) — The render-attach loop. (cli_inner_pretty.js:569079-569208)
- `FleetViewDashboard` (`EQ4`) — Main React component. (cli_inner_pretty.js:567084-…)
- `mountFleetViewFromLeftArrow` (`yQ4`) — The `←←` entry path. (cli_inner_pretty.js:569366-569381)
- `shouldAcceptLeftArrowToAgentView` (`MoH`) — Gate for `←←`. (cli_inner_pretty.js:435227-435228)
- `setHasUsedAgentsFleet` (`$1H`) — Sticky flag set on first use. (cli_inner_pretty.js:435230-435233)
- `STATE_LABELS` (`og4`), `STATE_BUCKET_ORDER` (`rg4`) (cli_inner_pretty.js:569354-569355)
- `JOB_KIND_LABELS` (`So5`) (cli_inner_pretty.js:569361)
- `consumeAgentViewRelaunchMarker` (`Cq6`), `AGENT_VIEW_RELAUNCH_ENV_KEY` (`E5$`) (cli_inner_pretty.js:139921-139925)

---

## Entry Points

### 1. `claude agents` Subcommand

Wired in cli_inner_pretty.js:607796-607844 as a Commander subcommand. The action handler:

1. **TTY gate.** `if (process.stdout.isTTY)` … else `wZH("claude agents")` → exit 1.
2. **Hydrate gates.** `await y5$()` loads settings so the agent-view-disabled check works.
3. **Feature gate.** `if (fF())` — `fF` = `!isAgentViewDisabled()`. Disabled either by env (`CLAUDE_CODE_DISABLE_AGENT_VIEW=1`) or by managed settings (`disableAgentView: true`).
4. **Telemetry.** `d("tengu_fleetview", { viaCommander:!0, relaunch: Cq6() })` — `Cq6` reads and deletes the `CLAUDE_CODE_AGENT_VIEW_RELAUNCH` env var (set when the daemon self-restarts on upgrade and re-execs back into agent view).
5. **Lazy-load.** `Promise.all([mountFleetView module, createRoot module])` — the UI lives in a large lazy chunk to avoid bloating startup of the foreground REPL.
6. **Mount.** Pass `cwdFilter`, `dispatchExtraArgs` (from `hV$(yV$(config))`), and `dispatchDefaults` (from `gg4(rawDefaults)`).
7. **Exit.** `await RK(0, "other", { suppressResumeHint: !0 })` — process exit with telemetry flush and no resume hint.

### 2. `←` from a REPL

When the user is at an empty REPL input and presses `←`, that triggers `mountFleetViewFromLeftArrow` (`yQ4` at cli_inner_pretty.js:569366-569381). The behaviour:

1. `process.env.CLAUDE_AGENTS_SELECT = H` — pre-select a particular job ID. The dashboard reads this off the env var (line 569097) and clears it once consumed.
2. `LO$()` — tear down the foreground process's UI (Ink unmount, raw mode off).
3. `T_.get(process.stdout)?.unmount()` — extra Ink teardown.
4. `hw6()` — reset cursor/screen.
5. Re-create root and load `mountFleetView`. The `enteredViaLeftArrow = !!Y` flag is passed to the dashboard so it can render the onboarding text. Also calls `seedLastJobs` from cached list.
6. `await mountFleetView(...)`.
7. `process.exit(0)` — terminate cleanly.

The `MoH` gate (`shouldAcceptLeftArrowToAgentView`) prevents `←` from bouncing into agent view *until* the user has either set `hasUsedAgentsFleet` (which is sticky — first launch sets it) or has the `tengu_fg_left_arrow_agents` experimental flag enabled. This avoids surprising new users who pressed `←` to navigate text.

### 3. `claude --bg`

The `--bg` flag is parsed by `rC5` (`handleBgFlag`) and `iC5` (`assembleBgSessionDispatch`). This path does **not** mount the agent view. It just dispatches a bg job through the daemon and prints a hint:

> "Detached — N task still running. Run `claude agents` to see your background sessions."

(Source: cli_inner_pretty.js:431077.)

---

## The Mount Loop

```javascript
// ============================================
// mountFleetView - The agent-view render-attach loop
// Location: cli_inner_pretty.js:569079-569208
// ============================================

// ORIGINAL (excerpt):
async function ao5(H, $) {
  (MN4($?.dispatchExtraArgs ?? []), d("tengu_bg_agent_action", { action: "list_open" }));
  ...
  for (;;) {
    let X = await new Promise((G) => {
      z.render(/* <FleetViewDashboard onAction={G} initialJobId={Y} cwdFilter=… /> */);
    });
    if (X.type === "done") break;
    ...
    // attach the user-selected job
    let v = await AN4(W.short ?? X.job.id, { alreadyInAlt: L });
    ...
    if (v.kind === "error" && v.orphaned) {
      // try recovery: force-respawn the orphaned worker
      let I = await AG8(X.job.id, { force: !0, knownState: X.job.state });
      if (I.ok || I.alive) v = await V(I.short ?? X.job.id);
    }
    // remount the dashboard for the next selection
    z = await sA$({ exitOnCtrlC: !1 });
  }
}

// READABLE (for understanding):
async function mountFleetView(rootInk, options) {
  setDispatchExtraArgsForSession(options?.dispatchExtraArgs ?? []);
  emitTelemetry("tengu_bg_agent_action", { action: "list_open" });
  ...
  for (;;) {
    const action = await new Promise((resolveAction) => {
      rootInk.render(<FleetViewDashboard
        onAction={resolveAction}
        initialJobId={preselectedJobId}
        enteredViaLeftArrow={enteredViaLeftArrow}
        initialQuery={searchQuery}
        initialCollapsed={collapsedSet}
        initialError={lastError}
        initialGroupMode={groupMode}
        cwdFilter={resolvedCwdFilter}
        dispatchDefaults={dispatchDefaults}
      />);
    });
    ...
    if (action.type === "done") break;
    // attach to the user-selected job
    const attachResult = await attachJob(action.job.id, …);
    if (attachResult.kind === "error" && attachResult.orphaned) {
      // recovery — force-respawn the worker and try once more
      const respawn = await respawnJob(action.job.id, { force: true, knownState: action.job.state });
      if (respawn.ok || respawn.alive) attachResult = await attachJob(respawn.short);
    }
    // remount the dashboard for the next iteration
    rootInk = await createRoot({ exitOnCtrlC: false });
  }
}

// Mapping: ao5→mountFleetView, H→rootInk, $→options, MN4→setDispatchExtraArgsForSession,
//          X→action, G→resolveAction, EQ4→FleetViewDashboard, Y→preselectedJobId,
//          f→enteredViaLeftArrow, M→searchQuery, w→collapsedSet, D→lastError,
//          j→groupMode, _→resolvedCwdFilter, A→dispatchDefaults, AN4→attachJob,
//          v→attachResult, AG8→respawnJob, sA$→createRoot
```

### Why a Loop?

Agent view is not a one-shot — it's a *modal harness*. The flow is:
1. User sees the list.
2. User selects a job → attach.
3. User detaches (Ctrl+Z) → return to the list.
4. Loop back to (1).

Each loop iteration:
- Renders a fresh `FleetViewDashboard` (because Ink unmount + remount is simpler than keeping the dashboard component mounted across attach/detach, and the dashboard reads global state on mount).
- Persists the current selection/search/collapsed/group state across iterations so the user lands back where they were.
- Recovers from "orphaned" attach errors by force-respawning the worker once.

### Handoff Semantics

When attaching:
- `T_.get(process.stdout)?.handoffAltScreen()` (line 569145) — *transfer* the alt-screen ownership to the attached worker process. The dashboard had been rendering in the alt-screen; on Linux/macOS the worker takes over the same alt-screen so the user's main terminal scrollback is preserved. On Windows, `handoffRawMode` is also called (line 569146) to transfer raw-mode ownership of stdin.

When detaching:
- `process.stdout.write(YfH())` (line 569205) — emit a "back-from-alt-screen" sequence to reassert dashboard control.
- `(z = await sA$({ exitOnCtrlC: !1 }))` (line 569206) — create a new Ink root.

This handoff dance is delicate: any mistake (extra clear, missed flush) causes the visible "background color bleed" issue that v2.1.142 fixed for Apple Terminal (256-color-only terminals).

---

## Dashboard Component (`FleetViewDashboard`)

The component (cli_inner_pretty.js:567084-…) accepts the props:

| Prop | Source | Meaning |
|------|--------|---------|
| `onAction` | from `mountFleetView` | Callback for "done" / "open <job>" / "dispatch <task>". |
| `initialJobId` | from `CLAUDE_AGENTS_SELECT` env var | Pre-select this job ID at mount. Cleared once consumed. |
| `enteredViaLeftArrow` | true iff via `←←` | Drives onboarding text — see below. |
| `initialQuery` | from previous loop iter | Restore search box. |
| `initialCollapsed` | from previous loop iter | Restore which groups were collapsed. |
| `initialError` | from previous attach error | Inline status banner. |
| `initialGroupMode` | from `fleetViewGroupMode` global config or previous loop iter | "state" / "cwd" / "kind" grouping. |
| `cwdFilter` | from `--cwd` (resolved to realpath) | Filter jobs whose `spawnOrigin` is inside this dir. |
| `dispatchDefaults` | from `gg4` validation | Per-session defaults for new dispatches (model/effort/permission). |

The component reads global maps for jobs (`In6`), loop-kicks (`jQ4`), statuses (`JQ4`), PR statuses (`vn6`), and seeds local React state from them. All maps are updated by a background polling loop subscribed to the daemon's control socket. The dashboard auto-rerenders on every received update (debounced via Ink's reconciler).

### Onboarding Text

When `enteredViaLeftArrow=true` and the user has at least one other agent (`e0`), the dashboard shows:

> "Press → to return to your session anytime. Type a task below to dispatch a session alongside it. Sessions keep running even after you close the terminal — run `claude agents` to manage them."

Otherwise (no other agents, came via `←←`), it shows:

> "Type a task below to start a background session. It keeps running even after you close this terminal."

(Source: cli_inner_pretty.js:568509-568517.)

The conditional logic was changed in v2.1.141 — before that, the empty-placeholder bg session left over from `←←` would show even when there were no real other agents. After v2.1.141, `OG8`/`HT$`/`Qj` are tightened to exclude those placeholders, **and** the daemon auto-retires them after 5 min (`pB5 = 300000`).

---

## Status Classification

Each job's display state is one of four buckets, with labels:

```javascript
rg4 = ["review", "blocked", "working", "done"];
og4 = {
  review:  "Ready for review",
  blocked: "Needs input",
  working: "Working",
  done:    "Completed",
};
```

The classifier (`byH`) combines:
- Persistent `state` (`working` / `blocked` / `done` / `failed`) from the worker's last self-report.
- `tempo` (`active` / `idle` / `blocked`) describing whether the agent loop is mid-call or idle between turns.
- `inFlight` task counts (kept across turns for resume).
- PR status — whether there's an associated PR and what state it's in (OPEN/MERGED/CLOSED/needs_review).

`completed_vs_working.md` covers the v2.1.141 refinement where a job that reports `done` **but** has lingering background shells running gets bucketed as `Completed` rather than confusing the user with `Working`.

---

## Status Filtering

The dashboard always shows the four buckets in `rg4` order. Each bucket header is collapsible (`_$` state, persisted to next loop iter as `initialCollapsed`).

The search box (`CH` state) filters by:
- Job name (case-insensitive substring).
- Job description (case-insensitive substring).
- Job's spawn-origin dir basename (`Tn6` parser supports `@name`, `s:name`, `o:name`, `a:name` mentions).

The cwdFilter (from `--cwd`) is **separate** — it's resolved at mount time and applied before bucket grouping:

```javascript
Oj = (L$) => !cwdFilter || jobMatchesCwd(L$.state, cwdFilter)
```

`jobMatchesCwd` (`HG8`) is a simple `path.relative + isAbsolute` check that treats worktree paths (`<repo>/.claude/worktrees/X/...`) as if they came from `<repo>`.

---

## Dispatching New Tasks

The dashboard has a prompt input at the bottom that opens to "dispatch a new bg session." Submitting triggers:

1. Validate (non-empty, not just whitespace).
2. Apply the per-dispatch override chips (model/effort/permission-mode) on top of `dispatchDefaults`.
3. Call `claimSpareOrColdDispatch` (`jN4`) — try to claim a pre-warmed spare; on failure, cold-dispatch.
4. On success, the new job appears in the list (the polling loop picks it up within 500 ms).
5. The dashboard scrolls to it; the per-dispatch override chips reset.

The dispatched job inherits `dispatchExtraArgs` (`--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--strict-mcp-config`) from the `claude agents` invocation that mounted this dashboard, via the module global `OG$`. The per-dispatch defaults are layered via `dispatchDefaultsToArgv` (`qg6`).

The full argv shape for a dispatched worker:
```
claude --bg-internal=… --session-id <new-uuid> [...dispatchExtraArgs] [--agent X] [...dispatchDefaultsArgv]
```

---

## State Persistence

Two layers:

1. **Session-state on disk** — `~/.claude/bg-sessions/<short>/state.json` (written via `gz`, read via `o7`). Each worker writes its own state continuously. The daemon's adopt path reads this on startup to reconstruct the worker registry.
2. **In-memory dashboard state** — the `In6`/`jQ4`/`JQ4`/`vn6` etc. globals are populated by a polling loop that calls `list` against the daemon's control socket. The dashboard renders directly from these and from props.

The dashboard never writes session-state. All writes go through the worker or the daemon supervisor.

---

## Telemetry

| Event | When |
|-------|------|
| `tengu_fleetview` | Agent view mounted. Payload: `{viaCommander, relaunch}`. |
| `tengu_bg_agent_action` | User performed an action (`list_open`, `open`, `dispatch`, `cancel`). |
| `tengu_fleetview_pr_batch` | PR-status batch fetch completed (used for the `Ready for review` bucket). |
| `tengu_fleetview_fold_shown` | Fold-collapse indicator displayed (used to measure how many jobs were hidden by the "(N more …)" fold). |
| `tengu_fleetview_fold_expand` | User expanded a fold. Payload includes `ms_since_mount`. |

---

## Cross-References

| Concern | Document |
|---------|----------|
| Dispatching with flags | `dispatch_flags.md`, also `30_agent_team/v2_1_142_dispatch_flags.md` |
| The daemon process | `daemon_lifecycle.md` |
| `--cwd <path>` filter mechanics | `cwd_filter.md` |
| "Completed" classification when shells are running | `completed_vs_working.md` |
| Pre-warmed worker fallback to cold spawn | `pre_warm_worker.md` |
| Attached-session capability forwarding | `editor_resolution.md`, `chrome_extension_isolation.md` |
| Worktree recognition fix | `worktree_recognition.md` |
| `--bg --dangerously-skip-permissions` persistence | `keep_dangerous_skip.md` |

---

## Validation

| Claim | Source |
|-------|--------|
| `claude agents` requires TTY, else `wZH` exits | cli_inner_pretty.js:607805, 139916-139920 |
| Agent view gate via `fF` (= `!rmH`) checks env + managed settings | cli_inner_pretty.js:139859-139884 |
| `←←` gate `MoH` requires `hasUsedAgentsFleet` or experimental flag | cli_inner_pretty.js:435227-435228 |
| `mountFleetView` consumes `CLAUDE_AGENTS_SELECT` env at line 569099 | cli_inner_pretty.js:569097-569099 |
| Status labels are `{review: "Ready for review", blocked: "Needs input", working: "Working", done: "Completed"}` | cli_inner_pretty.js:569355 |
| `onAction` resolves the render-Promise; loop iterates until `type==="done"` | cli_inner_pretty.js:569107-569148 |
| Alt-screen / raw-mode handoff on Windows + macOS during attach | cli_inner_pretty.js:569145-569146 |
