# Hooks & Telemetry — Agent Teams (v2.1.112)

## Overview

Agent Teams emits two categories of observability signals:

- **Hooks** — user-configurable shell-out points that fire at specific lifecycle moments and can influence behavior. **Three** team-specific hooks (corrected from earlier two-hook draft):
  - `TeammateIdle` — fires when a teammate enters the idle state (handler `W38`).
  - `TaskCreated` — fires when a task is created in the shared task list (handler `e58` at chunks.192.mjs:2829).
  - `TaskCompleted` — fires when a task transitions to `completed` (handler `CM6`).
- **Telemetry** — `tengu_team_*` and `tengu_teammate_*` events emitted at strategic transitions (creation, deletion, model change, memory sync, secret detection, push suppression).

This document covers the hook integration points, the hook input shape, the `preventContinuation` semantics, and the catalog of telemetry events with payloads and trigger sites.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key symbols:
- `runTeammateIdleHook` (`W38`) — chunks.192.mjs:2814
- `runTaskCreatedHook` (`e58`) — chunks.192.mjs:2829
- `runTaskCompletedHook` (`CM6`) — chunks.192.mjs:2848
- `runHookEvent` (`E0`) — generic hook executor (referenced)
- Telemetry sink (`d`) — generic emit function
- `tengu_team_created` — chunks.152.mjs:2544
- `tengu_team_deleted` — chunks.152.mjs:2659
- `tengu_teammate_mode_changed` — chunks.169.mjs:675
- `tengu_teammate_default_model_changed` — chunks.169.mjs:1069
- `tengu_team_mem_sync_pull/push` — chunks.163.mjs:1388/1415
- `tengu_team_mem_entries_capped` — chunks.163.mjs:973
- `tengu_team_mem_file_read/edit/write` — chunks.163.mjs:1781-1791
- `tengu_agent_memory_loaded` — chunks.155.mjs:46

---

## TeammateIdle Hook

### When it fires

The runner fires `TeammateIdle` whenever a teammate transitions to idle (i.e., immediately after `pollForNextMessage` is about to be entered, after `isIdle: true` is set). This is the same edge that triggers an `idle_notification` to the leader.

### Hook input

```typescript
type TeammateIdleHookInput = {
  hook_event_name: "TeammateIdle";
  teammate_name: string;       // sanitized agent name
  team_name: string;
  // session/transcript metadata also included by the hook executor
};
```

The hook executor injects standard session metadata (session_id, transcript_path, cwd, etc.) — these are part of every hook's input, not specific to TeammateIdle.

### Behavior contract

```javascript
// Conceptual hook runner integration
async function runTeammateIdleHook(identity, ctx) {                    // W38
  const hookInput = {
    hook_event_name: "TeammateIdle",
    teammate_name: identity.agentName,
    team_name: identity.teamName,
  };
  const result = await runHookEvent({
    hookInput,
    signal: ctx.abortController.signal,
    timeoutMs: HOOK_TIMEOUT_MS,
  });
  if (result?.preventContinuation) {
    // Mark the teammate to stop polling; the runner exits its loop.
    setTaskFieldShutdownRequested(...);                                // chunks.154.mjs:775,801
  }
}
```

### preventContinuation semantics

If the user's hook returns `{preventContinuation: true}`:
- The runner reads `shutdownRequested` (or equivalent) before its next poll.
- On observing it, the runner exits the while-loop cleanly.
- The teammate transitions to `status: "completed"` via the normal exit path.

This gives an external script a one-shot way to gracefully retire a teammate at an idle boundary — e.g., a script that detects "this teammate has been idle 5 times in a row, stop it".

The hook does NOT fire for `idleReason: "interrupted"` (where the user pressed Escape) or `"failed"` (where the runner is exiting on error). It only fires for `"available"` — i.e., the teammate is genuinely idle and waiting.

### Why a hook here?

External scripts can use `TeammateIdle` to:
- Implement custom auto-retire policies.
- Sync state to external task trackers.
- Trigger additional spawns based on team progress.

Without the hook, these would require monkey-patching the runner. The hook makes them userland-customizable.

---

## TaskCreated Hook

### When it fires

When a task is added to the shared task list — typically when a teammate (or the lead) calls the Task tool to create new work. Fires after the file write commits.

### Hook input

```typescript
type TaskCreatedHookInput = {
  hook_event_name: "TaskCreated";
  task_id: number;
  task_subject: string;
  task_description?: string;
  teammate_name: string;       // who created the task
  team_name: string;
};
```

### Behavior contract

```javascript
async function* runTaskCreatedHook(taskId, subject, description, teammate, team, ctx, signal, timeoutMs, toolUseContext) {
  const hookInput = {
    ...standardSessionMetadata(ctx),
    hook_event_name: "TaskCreated",
    task_id: taskId,
    task_subject: subject,
    task_description: description,
    teammate_name: teammate,
    team_name: team,
  };
  yield* runHookEvent({hookInput, toolUseID: makeToolUseId(), signal, timeoutMs, toolUseContext});
}
```

The handler is an `async function*` (generator) — same signature shape as `CM6`. It yields events from the generic hook executor `E0`.

### Why fire on creation?

Use cases:
- Sync the task to an external tracker (Jira, Linear).
- Notify a Slack channel that new work is queued.
- Log task provenance (who created what, in which team).

`preventContinuation` is technically respected but rarely useful — the task already exists when the hook fires.

---

## TaskCompleted Hook

### When it fires

When a task in the shared `tasks.json` transitions to `completed` status (whether by the teammate or by an external editor of the file). The hook fires after the file write commits.

### Hook input

```typescript
type TaskCompletedHookInput = {
  hook_event_name: "TaskCompleted";
  task_id: number;
  task_subject: string;
  task_description?: string;
  teammate_name: string;       // who completed the task
  team_name: string;
};
```

### Behavior contract

```javascript
async function runTaskCompletedHook(task, identity, ctx) {            // CM6
  const hookInput = {
    hook_event_name: "TaskCompleted",
    task_id: task.id,
    task_subject: task.subject,
    task_description: task.description,
    teammate_name: identity.agentName,
    team_name: identity.teamName,
  };
  const result = await runHookEvent({hookInput, signal, timeoutMs});
  // No preventContinuation handling — task is already complete
}
```

The result is observed for `preventContinuation` but, in practice, it's too late to "prevent" anything — the task is already marked complete on disk. The hook's value is observability and notification (e.g., post a Slack message, write to an audit log).

---

## Hook Configuration

Both hooks are configured in `~/.claude/settings.json` under the standard hook config schema:

```json
{
  "hooks": {
    "TeammateIdle": [
      {
        "matcher": "*",
        "hooks": [
          { "type": "command", "command": "/path/to/script.sh" }
        ]
      }
    ],
    "TaskCompleted": [
      {
        "matcher": "*",
        "hooks": [
          { "type": "command", "command": "/path/to/notify-slack.sh" }
        ]
      }
    ]
  }
}
```

The `matcher` field is a glob over `team_name` (or the teammate name, depending on hook). `*` matches all teams.

---

## Telemetry Events

### tengu_team_created

Fired when `TeamCreate` tool successfully creates a team config.

| Field | Type | Description |
|-------|------|-------------|
| `team_name` | string | The team's name |
| `teammate_count` | number | **Always `1`** (only the lead exists at creation; subsequent additions don't re-fire this event) |
| `lead_agent_type` | string | The lead's agent_type if customized |
| `teammate_mode` | string | `"auto"` / `"in-process"` / `"tmux"` (resolved via `d37()`) |

Trigger: chunks.152.mjs:2544 (TeamCreate handler success path).

### tengu_team_deleted

Fired when a team is removed via the **TeamDelete** tool (`Cc` / `jJY` at chunks.152.mjs:2609) — a separate tool from TeamCreate. The delete tool refuses to run if any active teammates remain.

| Field | Type | Description |
|-------|------|-------------|
| `team_name` | string | The team's name |

Trigger: chunks.152.mjs:2659 (TeamDelete handler success path, after directory removal and color-registry clear).

### tengu_teammate_mode_changed

Fired when a user toggles `teammateMode` (e.g., from `auto` to `in-process` mid-session).

| Field | Type | Description |
|-------|------|-------------|
| `from_mode` | string | Previous value |
| `to_mode` | string | New value |

Trigger: chunks.169.mjs:675 (mode setter).

### tengu_teammate_default_model_changed

Fired when the team's default teammate model is changed.

| Field | Type | Description |
|-------|------|-------------|
| `new_model` | string | Model identifier |

Trigger: chunks.169.mjs:1069.

### tengu_team_mem_sync_started

Fired when team memory sync begins (before the actual pull/push completes).

Trigger: chunks.163.mjs:1614.

### tengu_team_mem_sync_pull / tengu_team_mem_sync_push

Fired when the team memory directory is synchronized.

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Path of the memory dir/file |
| `entries` | number | Count of entries synced |

Triggers: chunks.163.mjs:1388 (pull), chunks.163.mjs:1415 (push).

### tengu_team_mem_push_suppressed

Fired when a memory push is skipped (e.g., no changes to commit, or push gated off).

Trigger: chunks.163.mjs:1511.

### tengu_team_mem_secret_skipped

Fired when the memory writer detects a secret-shaped string and skips the write.

Trigger: chunks.163.mjs:1192.

### tengu_team_mem_entries_capped

Fired when the team memory hits the size cap and entries are pruned.

| Field | Type | Description |
|-------|------|-------------|
| `dropped` | number | Count of entries dropped |

Trigger: chunks.163.mjs:973.

### tengu_team_mem_accessed

Generic fire on any team-memory file touch (read, edit, write). Acts as a coarse umbrella event paired with the per-op events below.

| Field | Type | Description |
|-------|------|-------------|
| `tool` | string | Tool name (`Read`, `Edit`, `Write`) |
| (other context) | various | Standard hook context fields |

Trigger: chunks.163.mjs:1776.

### tengu_team_mem_file_read / tengu_team_mem_file_edit / tengu_team_mem_file_write

Fired for each team memory file operation.

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Memory file path |
| `op` | string | `"read"` / `"edit"` / `"write"` |

Triggers: chunks.163.mjs:1781 (read), 1786 (edit), 1791 (write).

### tengu_agent_memory_loaded

Fired in the runner when a custom agent's `memory` field references a memory scope.

| Field | Type | Description |
|-------|------|-------------|
| `scope` | string | The scope identifier from the agent definition |
| `source` | string | `"in-process-teammate"` (always for runner-fired) |

Trigger: chunks.155.mjs:46 (inside `bXY`'s system-prompt assembly).

---

## Telemetry Cadence

Most events are fired exactly once per state change:
- `tengu_team_created` — once per team.
- `tengu_team_deleted` — once per team.
- `tengu_teammate_mode_changed` — once per change.
- `tengu_teammate_default_model_changed` — once per change.

Memory events fire per file operation:
- `tengu_team_mem_file_read` — every read.
- `tengu_team_mem_file_edit` — every edit.
- `tengu_team_mem_file_write` — every write.

`tengu_team_mem_entries_capped` fires only when the cap is reached, which is rare in normal usage.

---

## Hook Failure Modes

| Failure | Hook | Behavior |
|---------|------|----------|
| Script not executable | both | Logs error; ignored as if no preventContinuation |
| Exit code non-zero | both | Logs; output discarded |
| JSON parse failure on stdout | both | Logs; output discarded |
| Timeout | both | Hook is killed; ignored |
| Returns `preventContinuation: true` | TeammateIdle only | Runner exits at next poll boundary |
| Returns `preventContinuation: true` | TaskCompleted | No-op (task already done) |

The runner is **defensive** about hook failures — a broken hook can't break the team. Worst case, the hook silently does nothing.

---

## Why These Three Hooks?

The three hooks correspond to the three **observable, reversible** state transitions in a teammate's lifecycle:
- **TeammateIdle**: a moment when external policy can decide to retire a teammate (reversible — without the hook, the teammate would just continue).
- **TaskCreated**: a moment when external systems care to track new work coming in (notify-on-creation, sync to external trackers).
- **TaskCompleted**: a moment when external systems care to track work going out (notify-on-completion is the most common automation).

Other states (running, awaiting plan, awaiting permission) aren't reversible from outside without violating safety invariants, so they don't get hooks.

A counter-example: there's no `TeammateSpawned` hook. Spawn is too early — the teammate hasn't done anything yet, so external policy can't make a useful decision. The `Agent` tool already gates spawn via standard tool-permission flow, which is the right surface.

---

## Distinguishing TeamLead from Teammate Hook Fires

The leader's own session can fire generic hooks (PreCompact, PostCompact, SessionStart, etc.) but **not** TeammateIdle or TaskCompleted as the lead. These two are teammate-only:
- `TeammateIdle` requires `teammate_name` ≠ "team-lead" by the runner's wiring.
- `TaskCompleted` includes `teammate_name`, which is set to the completing agent's name (could be the lead if the lead claimed and completed a task itself).

This means a script handling both can safely assume `teammate_name` is meaningful for filtering.

---

## What's Not Telemetry'd

- **Mailbox writes/reads.** The volume would be enormous; the same data is in debug logs (`E(...)`) for diagnostic use.
- **Permission round-trips.** Falls under generic `tengu_canUseTool_*` events.
- **Spawn dispatch.** No `tengu_team_teammate_spawned` event; spawn is observable through team_created (initial members) or absent of any event (later additions).
- **Polling cycles.** Not telemetry'd (would dwarf all other events).

This is a deliberate signal-to-noise choice: only state-change events that matter for product decisions are sent.

---

## Hook + Telemetry Coordination

A hook can read its own state via `hook_event_name` and act, but cannot **emit** telemetry directly to the Claude Code stream. If a script wants to emit, it must do so via its own pipeline (e.g., curl to its own observability endpoint).

This separation is intentional: hooks are user code; telemetry is product-side. Mixing them would let user code spam product telemetry.

---

## Summary

Three hooks (`TeammateIdle`, `TaskCreated`, `TaskCompleted`) provide userland customization at the three reversible/observable state transitions. Telemetry events `tengu_team_*` and `tengu_teammate_*` capture team-level state changes for product analytics. The hook surface is intentionally minimal; failure is defensive (a broken hook never breaks the team).
