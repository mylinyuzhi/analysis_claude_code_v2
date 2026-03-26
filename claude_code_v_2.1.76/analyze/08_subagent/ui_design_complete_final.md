# UI Design Complete - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI interaction documentation with React-style component mockups, keyboard shortcuts, state management, and system reminder integration for subagent and background agent systems.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [key_algorithms_source_restored_complete.md](./key_algorithms_source_restored_complete.md) - Algorithm source code
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`

---

## UI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI ROOT (APP)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MESSAGE AREA                                  │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent (type: "tool_use", name: "Agent")            ││    │
│  │  │      └─ AgentStatusComponent                                     ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge (color from agentDefinition)         ││    │
│  │  │          ├─ Description (from AgentTool call)                   ││    │
│  │  │          ├─ Stats (toolUseCount, tokens)                        ││    │
│  │  │          └─ StatusIndicator (running/completed/failed)          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        STATUS LINE (Footer)                          │    │
│  │                                                                       │    │
│  │  BackgroundAgentIndicator:                                           │    │
│  │  • Running agent count: "2 running"                                  │    │
│  │  • Kill hint: "Ctrl+C to cancel"                                     │    │
│  │  • Interactive: triggers kill confirmation                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TASK LIST MODAL (on /tasks)                   │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Header: "Background Tasks"                                       ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  TaskListRow[]:                                                       │    │
│  │  ├─ StatusIcon (◐ ✓ ✗ ○)                                             │    │
│  │  ├─ Description                                                      │    │
│  │  ├─ Progress summary (if running)                                    │    │
│  │  └─ Actions: [x: stop] [f: foreground]                              │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        NOTIFICATION AREA                             │    │
│  │                                                                       │    │
│  │  Task completion/failure/kill notifications                         │    │
│  │  Mode: "task-notification"                                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Status Line Indicator

### States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATUS LINE STATES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Idle (no tasks):
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ $                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1 running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 1 running ● Ctrl+C stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+C stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Ctrl+F confirmation:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Press Ctrl+F to stop 3 agents │ $                      │
└─────────────────────────────────────────────────────────────────────────────┘

Killing:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Stopping 3 agents... │ $                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts Complete

### Global Shortcuts

| Shortcut | Action | Context | Implementation |
|----------|--------|---------|----------------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running | Key handler checks tasks |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C | Calls `U4q` (killAllLocalAgents) |
| `/tasks` | Open task list modal | Always | Slash command |
| `Ctrl+B` | Background running command | During Bash | Key handler |

### Task List Modal Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move up | In list |
| `↓` / `j` | Move down | In list |
| `x` | Kill selected | Running task |
| `f` | Foreground | Teammate task |
| `Enter` | View details | Any task |
| `Esc` | Close modal | Modal open |

---

## Visual Mockups

### Status Line - No Agents Running

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [Model: claude-3-5-sonnet] [CWD: /home/user/project] [Turn: 5]         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Status Line - Agents Running

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [Model: claude-3-5-sonnet] │ 2 running • Ctrl+C to cancel               │
│                               └──────┘   └─────────────────────┘        │
│                                 count        interactive hint            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**

| Element | Color | Animation | Notes |
|---------|-------|-----------|-------|
| Running count | Yellow (warning) | None | Bold text |
| Separator " • " | Dim | None | Muted color |
| Kill hint | Dim | None | Clickable/interactive |

### Task List Modal

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Background Tasks                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ◐  general-purpose    "Search codebase for..."    3 tools, 1.2k tokens │
│  ◐  Explore            "Find all uses of..."       5 tools, 2.5k tokens │
│  ✓  Plan               "Design implementation..."  completed            │
│  ✗  general-purpose    "Fix the bug in..."         failed: timeout     │
│  ○  general-purpose    "Search for patterns..."    stopped by user      │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ [x: stop] [f: foreground] [Enter: details] [Esc: close]                 │
└──────────────────────────────────────────────────────────────────────────┘
```

**Status Icons:**

| Status | Icon | Animation | Color | Description |
|--------|------|-----------|-------|-------------|
| `pending` | ○ | None | Dim | Task created, not started |
| `running` | ◐ | Spinner | Yellow | Currently executing |
| `completed` | ✓ | None | Green | Successfully finished |
| `failed` | ✗ | None | Red | Execution failed |
| `killed` | ○ | None | Dim | User terminated |

### Agent Status Component (In Message)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ├─ [Explore] "Search codebase for API endpoints"                        │
│  │    Tool calls: 12    Tokens: 3.5k    Status: running ◐               │
│  │                                                                       │
│  └─ [Plan] "Design implementation for user auth"                        │
│       Tool calls: 5     Tokens: 1.2k    Status: completed ✓             │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Agent Type Badge Colors:**

| Agent Type | Badge Color | Example |
|------------|-------------|---------|
| `general-purpose` | Blue | [general-purpose] |
| `Explore` | Cyan | [Explore] |
| `Plan` | Magenta | [Plan] |
| `statusline-setup` | Green | [statusline-setup] |
| Custom | Yellow | [custom-agent] |

### Kill Confirmation Flow

```
Step 1: User presses Ctrl+C with running agents
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  [Model: claude-3-5-sonnet] │ ⚠️  Press Ctrl+F to stop 2 agents          │
│                               └─────────────────────────────────┘        │
│                                         warning message                  │
└──────────────────────────────────────────────────────────────────────────┘

Step 2a: User presses Ctrl+F (confirm kill)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  [Model: claude-3-5-sonnet] │ Stopping 2 agents...                       │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
→ Calls U4q (killAllLocalAgents)
→ For each agent: x66 (triggerAbortSignal)

Step 2b: Timeout without Ctrl+F (revert)
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  [Model: claude-3-5-sonnet] │ 2 running • Ctrl+C to cancel               │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
→ Normal operation continues
```

---

## Notification System

### Notification Types

```typescript
interface TaskNotification {
    value: string;
    mode: "task-notification" | "error" | "warning";
}
```

### Notification Display

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ✓ Background agent "search codebase" completed                          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ✗ Background agent "fix bug" failed: timeout                            │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ○ Background agent "search patterns" was stopped by the user            │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ○ 3 background agents were stopped by the user                          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Notification Scenarios

| Event | Mode | Message Format |
|-------|------|----------------|
| Single Kill | task-notification | `Background agent "{desc}" was stopped by the user.` |
| Multiple Kill | task-notification | `{count} background agents were stopped by the user.` |
| Completion | task-notification | `Agent "{desc}" completed` |
| Failure | task-notification | `Agent "{desc}" failed: {error}` |

---

## Interaction Flows

### Flow 1: Spawning a Background Agent

```
User: "Search the codebase for all uses of createTaskId and analyze them"

Assistant processes message
        │
        ▼
Assistant determines to use Agent tool with run_in_background: true
        │
        ▼
AgentTool.call({
    prompt: "Search...",
    subagent_type: "Explore",
    run_in_background: true,
    description: "Find createTaskId usages"
})
        │
        ▼
createBackgroundAgentTask (Qn4)
        │
        ├─ Generate task ID (oV)
        ├─ Create AbortController
        ├─ Initialize output file (g2)
        ├─ Register task (Zf)
        └─ Spawn detached execution
        │
        ▼
UI displays in message: "Launched Explore agent 'Find createTaskId usages'"
        │
        ▼
Status line shows: "1 running • Ctrl+C to cancel"
```

### Flow 2: Killing All Agents

```
User presses Ctrl+C
        │
        ▼
Key handler checks: Any local_agent running?
        │
        ├─ No ──► Normal cancel (stop streaming)
        │
        └─ Yes ──► Show confirmation
                        │
                        ▼
                "Press Ctrl+F to stop N agents"
                        │
                        ├─ Timeout ──► Revert to normal
                        │
                        └─ Ctrl+F ──► killAllLocalAgents (U4q)
                                            │
                                            ▼
                                    For each running agent:
                                    triggerAbortSignal (x66)
                                            │
                                            ├─ abortController.abort()
                                            ├─ unregisterCleanup()
                                            └─ Update status to "killed"
                                            │
                                            ▼
                                    markTaskKilled (d4q)
                                            │
                                            ▼
                                    Show notification:
                                    "N background agents were stopped"
```

### Flow 3: Task Completion

```
Agent execution completes successfully
        │
        ▼
markTaskCompleted ($m8)
        │
        ├─ Update status to "completed"
        ├─ Store result
        ├─ Flush output buffer ($O)
        └─ Set endTime
        │
        ▼
Next polling cycle
        │
        ▼
pollTaskOutputs (wY4)
        │
        ├─ Read output delta (Z97)
        └─ Identify task for attachment
        │
        ▼
createTaskStatusAttachment (f4)
        │
        ▼
Inject into LLM context as system reminder
        │
        ▼
UI displays notification: "Agent '...' completed"
```

---

## Action Availability by Task Type

| Task Type | Kill (`x`) | Foreground (`f`) | Status Icon |
|-----------|------------|------------------|-------------|
| `local_agent` | ✓ running | ✗ | ◐ running |
| `local_bash` | ✓ running | ✗ | ◐ running |
| `in_process_teammate` | ✓ running | ✓ running | ◐ running |
| `remote_agent` | ✓ running | ✗ | ◐ running |
| `local_workflow` | ✓ running | ✗ | ◐ running |

---

## Display States

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo || "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo || "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription || "Running in background"` |

---

## Color Palette

### Status Colors

| Status | Foreground | Background | Notes |
|--------|------------|------------|-------|
| Running | Yellow | None | Warning color |
| Completed | Green | None | Success color |
| Failed | Red | None | Error color |
| Killed | Dim | None | Muted color |
| Pending | Dim | None | Muted color |

### UI Element Colors

| Element | Color | Notes |
|---------|-------|-------|
| Agent Type Badge | Varies by type | See badge colors above |
| Kill Hint | Dim | Interactive |
| Running Count | Yellow | Bold |
| Notification Icon | Matches status | ✓ ◐ ✗ ○ |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `Lf6` | LocalBashTask (kill handler) | chunks.133.mjs:2542 | ✓ Verified |
| `Fk1` | LocalAgentTask (kill handler) | chunks.146.mjs:2292 | ✓ Verified |

---

## Keyboard Shortcut Handling (Source Code)

### Task List Modal Keyboard Handler

From `chunks.162.mjs:836-853`:

```javascript
// Keyboard handler for task list modal
// 'x' key - Kill selected task
// 'f' key - Bring teammate to foreground

if (key === "x") {
    if (task.type === "local_bash" && task.status === "running") killBashTask(task.id);      // v()
    else if (task.type === "local_agent" && task.status === "running") killAgentTask(task.id); // N()
    else if (task.type === "in_process_teammate" && task.status === "running") killTeammate(task.id); // V()
    else if (task.type === "local_workflow" && task.status === "running") killWorkflow(task.id);
}

if (key === "f") {
    if (task.type === "in_process_teammate" && task.status === "running") {
        bringTeammateToForeground(task.id);  // g16()
        logAnalytics("Viewing teammate", { display: "system" });
    }
    else if (task.type === "leader") {
        viewLeader();  // ib()
        logAnalytics("Viewing leader", { display: "system" });
    }
}
```

### Kill Handler Dispatch

Each task type has a dedicated kill handler:

| Task Type | Kill Handler | Symbol | Location |
|-----------|--------------|--------|----------|
| `local_bash` | LocalBashTask.kill | `Lf6` | chunks.133.mjs:2542 |
| `local_agent` | LocalAgentTask.kill | `Fk1` | chunks.146.mjs:2292 |
| `in_process_teammate` | InProcessTeammateTask.kill | `sQ6` | chunks.162.mjs:869 |
| `remote_agent` | RemoteAgentTask.kill | `Fn4` | chunks.136.mjs:1175 |

---

## Notification System Integration

### Task Notification Mode

From `chunks.14.mjs:641`:

```javascript
const TASK_NOTIFICATION_MODE = "task-notification";
```

Notifications use a special `task-notification` mode that:
1. Filters out from prompt commands (`wuY` Set)
2. Gets special handling in message loop
3. Auto-dismisses after display

### Notification Types

| Event | Subtype | Content |
|-------|---------|---------|
| Task completed | `task_notification` | Description, duration, token count |
| Task failed | `task_notification` | Error message, partial results |
| Task killed | `task_notification` | Stopped status, partial results |

---

## Related Documents

- [key_algorithms_source_restored_complete.md](./key_algorithms_source_restored_complete.md) - Algorithm source code
- [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - System reminder integration
- [cross_feature_integration_complete.md](./cross_feature_integration_complete.md) - Feature integrations
- [cross_validation_unified.md](./cross_validation_unified.md) - Symbol verification
- [../26_background_agents/ui_interaction_complete.md](../26_background_agents/ui_interaction_complete.md) - Background agents UI

---

**Last Updated**: 2026-03-27 (re-verified)
**Version**: Claude Code 2.1.76
**Status**: Complete - Added keyboard shortcut handling and notification system integration