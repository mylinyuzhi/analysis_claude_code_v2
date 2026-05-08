# TUI Integration — Agent Teams (v2.1.112)

## Overview

The Agent Teams TUI surface lets a user observe and interact with a team of agents from a single terminal session. It comprises:

1. **Team status renderer** — a tree view of the lead and all teammates with status spinners, colors, and one-line summaries.
2. **Agent tab** (introduced in v2.1.76, retained in v2.1.112) — a dedicated tab in the TUI's tab bar listing all agents with filter (Ctrl+F) and kill (Ctrl+K) shortcuts.
3. **Per-teammate chat panel** — embedded in the same TUI when teammates are in-process, lets the user send messages directly into a teammate's `pendingUserMessages`.
4. **Spinner verbs** — animated past-tense / present-participle verb display per teammate (e.g., "Architecting", "Verifying").
5. **Plan approval modal** — surfaces incoming `plan_approval_request` from teammates.
6. **Permission prompt inline** — when a teammate is in-process and the leader can show a foreground prompt, the prompt inlines into the teammate's row.

This document covers the React component structure, the state plumbing from the runner to the TUI, color management, spinner mechanics, and tmux/iTerm2 swarm-view integration.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key components and helpers:
- `formatTeammateStatusVerb` (`$u6`) — chunks.183.mjs:2733
- `allTeammatesAreInProcess` (`ju6`) — chunks.183.mjs:2740
- `AgentStatusComponent` (`_nK`) — chunks.183.mjs:2756
- `getSpinnerVerbs` (`AJ6`) — chunks.100.mjs:624
- `pickRandomSpinnerVerb` (`LJ`) — chunks.100.mjs:621
- `DEFAULT_SPINNER_VERBS` (`Si1`) — chunks.100.mjs:633
- `mutateInProcessTeammateTask` (`sF`) — chunks.154.mjs:2394
- `wrapMessageForTeammate` (`k97`) — chunks.154.mjs:2386
- `formatTeammateXmlBlocks` (`cWz`) — chunks.100.mjs:122
- Constants: `Mz` ("team-lead"), `Ny` ("claude-swarm"), `Fh6` ("swarm-view")

---

## Team Status Renderer Tree

Conceptual layout:

```
┌──── claude-swarm ──────────────────────────────────────┐
│  ◆ team-lead         (active)            [purple]     │
│      ├─ Last: "Reviewed PR #123"                       │
│      └─ Tools: 12                                      │
│                                                        │
│  ◇ alpha             (Verifying)         [blue]       │
│      ├─ Last: "Running test suite"                     │
│      ├─ awaiting plan approval ◀── flag from task     │
│      └─ Tools: 4                                       │
│                                                        │
│  ◇ beta              (idle)              [yellow]     │
│      └─ Last: "Done with my piece"                     │
│                                                        │
│  ◇ gamma             (Architecting)      [green]      │
│      └─ Last: "Drafting refactor"                      │
└────────────────────────────────────────────────────────┘
```

The tree is rendered by `_nK` (AgentStatusComponent) per row, and a wrapping component aggregates rows from `AppState.teamContext.teammates`.

---

## State Flow: Runner → AppState → React

```
bXY (runner)                             React TUI
─────────────                            ─────────
  per agent-loop event:
    sF(taskId, mutator, setAppState)
       │
       ▼
  AppState.tasks[taskId] mutates
       │
       │  React subscribes via useAppState() (or similar)
       │
       ▼
  StatusRow re-renders: spinner verb, status, last message
```

Every event (assistant turn, tool_use, tool_result) causes a `sF` mutation, which updates `progress`, `inProgressToolUseIDs`, and `messages` on the task record. The TUI reads these and re-renders the corresponding row.

### Why per-event, not per-turn?

Per-event updates give live progress: you see the spinner update as tools complete, not just when the whole turn ends. The cost is more re-renders, but React's keyed list reconciliation makes this cheap as long as the row component only depends on its own task record.

### sF skip-on-no-op

```javascript
function mutateInProcessTeammateTask(taskId, mutator, setAppState) {
  setAppState(state => {
    const task = state.tasks[taskId];
    if (!task || task.type !== "in_process_teammate") return state;
    const next = mutator(task);
    if (next === task) return state;             // <- skip
    return { ...state, tasks: { ...state.tasks, [taskId]: next } };
  });
}
```

The `next === task` skip is a micro-optimization that prevents React from re-rendering when the mutator returned the same reference (e.g., tried to mark idle but the task was already idle). Without it, idle-twice would trigger a no-op re-render of every row.

---

## Spinner Verbs

The **team status panel** (chunks.135.mjs row component) displays a present-participle verb per teammate row while the teammate is working. The agent tab uses activity-driven verbs instead (see "Status Verb Logic — Two Surfaces" above).

The verb pool is in chunks.100.mjs (`Si1`):

```javascript
const DEFAULT_SPINNER_VERBS = [
  "Accomplishing", "Acting", "Actioning", "Activating", "Adapting",
  "Animating", "Architecting", "Asking", "Authoring", "Baking",
  // ... 175+ verbs total
];

const getSpinnerVerbs = () => DEFAULT_SPINNER_VERBS;       // AJ6

function pickRandomSpinnerVerb(pool) { return pool[Math.floor(Math.random() * pool.length)]; }
```

When `cI8` creates a task record, it picks a verb at spawn time:

```javascript
const taskRecord = {
  ...
  spinnerVerb: pickRandomSpinnerVerb(getSpinnerVerbs()),     // LJ(AJ6()) — alias of q0z
  pastTenseVerb: pickRandomSpinnerVerb(IDLE_VERBS),          // nh6 — only 8 entries
  ...
};
```

`LJ` is an **alias** for `q0z` (the actual random-pick implementation at chunks.100.mjs:610), set at chunks.100.mjs:621.

The `IDLE_VERBS` pool (`nh6`) has only **8 entries**: `["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]`. Compare to the 175+ entries of `Si1`. The asymmetry is intentional: idle states are short-lived between turns, so a small pool is acceptable.

The `spinnerVerb` is shown while the agent is running on the team status panel; the `pastTenseVerb` is shown while idle on the same panel.

### Why a random pool?

Visual variety. Five teammates all showing "Working…" is hard to scan; "Architecting / Verifying / Drafting / Refactoring / Investigating" gives each a distinct identity at a glance.

The verbs are deliberately content-agnostic — they're picked at spawn time and don't reflect what the teammate is actually doing. This avoids LLM-driven verb selection (which would add latency) while still giving the visual distinctness benefit.

---

## Color Management

Each teammate gets a color picked from a small palette (typically 8-10 colors). The `teammateColors` registry is on `ToolUseContext`:

```typescript
type TeammateColorRegistry = {
  assign(agentId: string): string;        // returns hex; reuses a free color
  release(agentId: string): void;         // returns the color to the pool
};
```

`teammateColors.assign(teammateId)` is called in spawn dispatchers; `release` is called on teardown.

### Why a registry vs hashing?

Hashing the agent name to a color would give consistent colors across spawns but might collide. The registry guarantees uniqueness within a session. Across sessions, the same teammate might get a different color — acceptable, since color is a TUI cue, not a stable identifier.

### Color usage

- Status row's left-margin marker.
- Teammate XML tag in `<teammate color="…">` blocks (so the leader's transcript shows colored tags).
- Pane border in tmux (when supported).
- Inline message indicators in the leader's chat.

---

## Agent Tab

The Agent Tab (introduced v2.1.76) is a dedicated TUI tab listing all agents with filter and kill shortcuts. In v2.1.112 it remains the primary "team management" surface.

Features:
- **Filter** (Ctrl+F): substring match on agent name.
- **Kill** (Ctrl+K when row selected): triggers `W18` (updateTaskWithResult / killInProcessTeammate path), aborting the runner and (in pane modes) tearing down the pane.
- **Toggle message preview** (Ctrl+Shift+O): expand or collapse the last-message preview per row.
- **Sort**: by spawn time (default), can toggle to status (idle first / running first).

The component wraps `_nK` rows for each entry in `AppState.teamContext.teammates`.

### killInProcessTeammate flow

```javascript
function killInProcessTeammate(taskId, taskRegistry, setAppState) {
  return updateTaskWithResult(taskId, taskRegistry, setAppState);   // W18
}

// W18: marks the task killed, calls abortController.abort(), unregisters cleanup
```

Result: the runner's `await CXY(...)` returns `{type: "aborted"}` because `abortController.signal.aborted` is true; the runner exits cleanly.

---

## Spawn-View Tmux Integration

When a teammate is spawned in pane mode and the host is **outside** any tmux session, `c7Y`/`l7Y` create a fresh tmux session named `claude-swarm` (`Ny`) and put the swarm view there. The `swarm-view` window (`Fh6`) is a special pane that shows the leader's live status.

```
tmux session: claude-swarm
├── window: swarm-view   (the leader; shows team status renderer)
├── window: teammate-alpha
├── window: teammate-beta
└── window: teammate-gamma
```

When the user spawns the first teammate from a non-tmux terminal, the leader's tmux session is created and the user's terminal attaches into `swarm-view`. From there, Ctrl+B + 0/1/2 switches between teammates.

When the host is **inside** an existing tmux session, the spawning happens in the current session as splits. No new session is created.

### Hidden control pane

`Gi1` (`"claude-hidden"`) is a hidden pane name used for tmux control commands that need a long-lived target. It's spawned alongside the swarm-view but kept off-screen (size 1×1 in tmux's window arrangement).

---

## iTerm2 Native Splits

iTerm2 supports native split panes via the `it2` CLI. When detected, `c7Y` uses `ITermBackend` (`y97`) to create splits without invoking tmux.

The setup component (`ewK`, displayed via `setToolJSX` during spawn) detects when `it2` isn't installed and offers:
- Install it2 (runs the install command, retries spawn).
- Use tmux instead (downgrades the spawn to tmux backend).
- Cancel.

Once the user picks one, the spawn dispatch retries with the new backend.

### Why offer iTerm2 native at all?

Tmux works everywhere but adds latency (every command shell-out to `tmux send-keys`) and visual quirks (tmux's status bar, key prefix). iTerm2 native splits feel like first-class panes and react to mouse and OS-level shortcuts. For Mac users, native splits are the better default when available.

---

## Message Preview

Each row can show a preview of the last message in the teammate's history:

```
◇ alpha            (Verifying)        [blue]
    └─ "Running test suite. Found 3 failures…"
```

The preview is the last assistant text from `task.messages` (truncated to one line). It's computed lazily in the renderer to avoid scanning long histories.

Toggle (Ctrl+Shift+O) collapses to:
```
◇ alpha            (Verifying)        [blue]
```

This is useful when the team has many teammates and only a top-level overview is wanted.

---

## Plan Approval Modal

When the leader's poll picks up a `plan_approval_request`, the TUI surfaces a modal:

```
┌────────────── Plan from teammate alpha ────────────────┐
│                                                        │
│  ## Plan                                               │
│                                                        │
│  1. Read the failing test                              │
│  2. Identify the root cause                            │
│  3. Update the test fixture                            │
│  4. Re-run                                             │
│                                                        │
│  [Approve]   [Reject + feedback]   [View teammate]     │
└────────────────────────────────────────────────────────┘
```

Approve sends `plan_approval_response{approve: true}` via SendMessage; Reject prompts for feedback then sends `plan_approval_response{approve: false, feedback}`.

"View teammate" navigates to the teammate's tab so the user can see context before deciding.

---

## Inline Permission Prompt

When a permission decision is needed for an in-process teammate AND the leader has the foreground:

```
◇ alpha            (Architecting)      [blue]
    ├─ Last: "Drafting refactor"
    └─ ◀ Awaiting permission for Bash:
         "rm -rf ./build"
         [Allow once]  [Always allow]  [Deny]
```

This avoids opening a separate modal — the prompt inlines into the row, lets the user decide quickly, and the row returns to its spinner state.

For pane teammates (or in-process teammates when the leader can't show a prompt), the request goes through the mailbox path; the TUI shows "Permission queued (request_id: …)" instead.

---

## Status Verb Logic — Two Surfaces

There are **two distinct TUI surfaces** with different status-verb formatters. Earlier drafts of this doc conflated them.

### Surface 1: Agent Tab (`$u6` — chunks.183.mjs:2733)

```javascript
function $u6(task) {
  if (task.shutdownRequested) return "stopping";
  if (task.awaitingPlanApproval) return "awaiting approval";
  if (task.isIdle) return "idle";
  return (task.progress?.recentActivities && summarizeRecentActivities(task.progress.recentActivities))
       ?? task.progress?.lastActivity?.activityDescription
       ?? "working";
}
```

Used by the agent tab row component (`_nK` at chunks.183.mjs:2756). The verb is **activity-driven** — it reflects the actual tool the teammate is currently invoking (e.g., "Reading foo.ts", "Editing bar.py"), not a random spinner verb.

### Surface 2: Team Status Panel (`nAK`/`k8Y` — chunks.135.mjs:3 / 413)

```javascript
// chunks.135.mjs:472 (excerpt from k8Y)
g = (k && !k.isIdle ? k.spinnerVerb ?? S : F) + "…";
```

Used by the team status panel that the leader renders in its main view. This surface **does** use the random `spinnerVerb` (picked at spawn from `Si1`'s 175-verb pool by `LJ(AJ6())`). When idle, it shows a different element `F` (likely the `pastTenseVerb` from `nh6`'s 8-verb idle pool).

### Why two surfaces?

- **Agent tab** is a global registry view across all sessions/teams; users open it to triage agents and need to know "what's this one literally doing right now". Activity-driven verbs answer that.
- **Team status panel** is the leader's at-a-glance team rundown; many teammates may be running simultaneously and each needs a distinguishing verb. Random verbs ("Architecting / Verifying / Drafting / Refactoring") give visual variety.

This split is why the random verb fields (`spinnerVerb`, `pastTenseVerb`) on the task record are populated at spawn but not used by `$u6`.

---

## allTeammatesAreInProcess (ju6)

```javascript
function allTeammatesAreInProcess(tasks) {
  // Iterates the active team tasks; returns true iff every running task
  // has tmuxPaneId === "in-process"
}
```

This predicate is used to decide:
- Whether to show the "swarm view" tmux integration (skip if no panes exist).
- Whether to enable iTerm2-only features.

When all teammates are in-process, the TUI is entirely embedded; no external pane management UI is shown.

---

## Re-render Performance

The team status panel can have 5-10 rows updating per teammate per second (during heavy tool use). To keep this performant:

- Each row component uses `React.memo` (or equivalent) keyed on the task record's identity.
- The renderer reads only `tasks[taskId]` for its row, not the whole `AppState` (so unrelated state changes don't re-render rows).
- `sF`'s no-op skip prevents redundant `setAppState` calls.

For 10 teammates each doing 10 events/second, this works out to ~100 row re-renders/second. Profile time is dominated by the React diff/commit, not the runner's mutations.

---

## When the Leader Is Plain Claude (no team)

If `AppState.teamContext` is undefined or has no teammates, the TUI hides the agent tab and the team status panel entirely. The leader sees the regular Claude Code UI. Spawning the first teammate via `Agent({name, team_name, ...})` lights up the team UI in one step.

---

## Summary

The TUI integration translates the runner's per-event task mutations into a live multi-teammate dashboard. Components: `_nK` for individual rows, `$u6` for status verbs, agent tab for filter/kill, plan approval and inline permission modals for cross-process collaboration. Color and verb assignments are per-spawn for visual distinctness. tmux/iTerm2 swarm view handles pane-based teammates; the in-process case keeps everything embedded.
