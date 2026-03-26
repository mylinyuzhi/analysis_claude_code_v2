# Background Agents UI Design Complete (Claude Code 2.1.76)

> Complete UI design documentation for background agent interaction including component hierarchy, visual specifications, and user interaction flows.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `d4q` - Mark task as killed — `chunks.146.mjs:2034`
- `$m8` - Mark task completed — `chunks.146.mjs:2100`
- `Hm8` - Mark task failed — `chunks.146.mjs:2117`
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`

---

## UI Component Architecture

### High-Level Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  Normal message display with tool_use results                        │    │
│  │  Background agent spawn messages: { status: "async_launched" }      │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     StatusLine (Footer)                              │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ BackgroundAgentIndicator                                         ││    │
│  │  │  • Running agent count: "2 running"                             ││    │
│  │  │  • Kill hint: "Ctrl+C to cancel"                                ││    │
│  │  │  • Interactive - click or press to trigger kill                 ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     TaskListModal (on /tasks)                        │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Header: "Background Tasks"                                       ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ TaskListRow[]                                                   ││    │
│  │  │  ├─ StatusIcon ◐ ✓ ✗ ○                                          ││    │
│  │  │  ├─ Description                                                 ││    │
│  │  │  ├─ Progress (if running)                                       ││    │
│  │  │  └─ Actions [x: stop] [f: foreground]                          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Footer: "[x: stop] [f: foreground] [Esc: close]"               ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     NotificationArea                                 │    │
│  │                                                                       │    │
│  │  Task completion/failure/kill notifications                         │    │
│  │  Mode: "task-notification"                                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Line Component

### Background Agent Indicator

**Purpose:** Shows count of running background agents and kill hint.

**Source Code:**

```javascript
// ============================================
// hasRunningLocalAgents - State selector
// Location: chunks.192.mjs:475
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);
```

### Display Format

```
┌──────────────────────────────────────────────────────────────────┐
│ Status Line (with running agents)                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  2 running • Ctrl+C to cancel                                     │
│  └──────┘   └─────────────────────┘                              │
│   count        interactive hint                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Status Line (no running agents)                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  (normal status content - model, cwd, etc.)                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Visual Specifications

```
Running Count:
  Color: Yellow (warning)
  Format: "{count} running"

Separator:
  Text: " • "
  Color: Dim

Kill Hint:
  Text: "Ctrl+C to cancel"
  Color: Dim
  Interactive: Click/press triggers kill confirmation
```

---

## Task List Modal

### Task List Row Component

```javascript
// ============================================
// TaskListRow - Individual task row rendering
// Location: chunks.162.mjs:836-981 (inferred)
// ============================================

// READABLE (for understanding):
function TaskListRow({ task, dispatch, setAppState }) {
    // Status icon based on task state
    const statusIcon = {
        pending: "○",
        running: "◐",  // Animated spinner
        completed: "✓",
        failed: "✗",
        killed: "○"
    }[task.status];

    // Action availability
    const canKill = task.status === "running";
    const canForeground = task.type === "in_process_teammate" && task.status === "running";

    // Progress display (for running tasks)
    const progressText = task.progress?.summary
        ? ` - ${task.progress.summary}`
        : "";

    return (
        <Row>
            <StatusIcon>{statusIcon}</StatusIcon>
            <Description>{task.description}{progressText}</Description>
            <Actions>
                {canKill && <Hint>[x: stop]</Hint>}
                {canForeground && <Hint>[f: foreground]</Hint>}
            </Actions>
        </Row>
    );
}
```

### Task List Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Background Tasks                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ◐ Search codebase for usages - Running Grep for "taskId"...    │
│     [x: stop]                                                    │
│                                                                   │
│  ◐ Write implementation file - Writing src/main.ts              │
│     [x: stop]                                                    │
│                                                                   │
│  ✓ Find API endpoints - Done                                     │
│                                                                   │
│  ✗ Run tests - Failed: timeout                                   │
│                                                                   │
│  ○ Analyze performance - Stopped by user                         │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│ [x: stop] [f: foreground] [Esc: close]                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task Status Icons

### Icon Definitions

| Status | Icon | Animation | Color | Description |
|--------|------|-----------|-------|-------------|
| `pending` | ○ | None | Dim | Task created, not started |
| `running` | ◐ | Spinner | Yellow | Currently executing |
| `completed` | ✓ | None | Green | Successfully finished |
| `failed` | ✗ | None | Red | Execution failed |
| `killed` | ○ | None | Dim | User terminated |

### Animation Cycle for Running

```
Running spinner animation:
◐ → ◑ → ◒ → ◓ → ◐ (loops)

Frame duration: ~200ms
```

---

## Kill Mechanism

### Kill All Flow (Ctrl+C → Ctrl+F)

**Two-stage confirmation for safety:**

```javascript
// ============================================
// Kill confirmation handler
// Location: chunks.193.mjs:2605-2656
// ============================================

// READABLE (for understanding):
function handleCtrlCWithRunningAgents(hasRunningAgents, tasks, setAppState) {
    if (!hasRunningAgents) {
        // Normal Ctrl+C behavior - cancel current stream
        cancelCurrentStream();
        return;
    }

    // Stage 1: Show confirmation
    showConfirmation({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: CONFIRMATION_TIMEOUT
    });

    // Stage 2: If user presses Ctrl+F within timeout
    // (handled by separate listener)
}

function executeKillAll(tasks, setAppState) {
    // 1. Send telemetry
    telemetry("tengu_cancel", { source: "kill_agents" });

    // 2. Kill all local_agent tasks
    killAllLocalAgents(tasks, setAppState);

    // 3. Mark each as killed and collect descriptions
    let killedDescriptions = [];
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            markTaskKilled(taskId, setAppState);
            killedDescriptions.push(task.description);
        }
    }

    // 4. Show notification
    if (killedDescriptions.length > 0) {
        let message = killedDescriptions.length === 1
            ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
            : `${killedDescriptions.length} background agents were stopped by the user.`;
        addNotification({ value: message, mode: "task-notification" });
    }
}
```

### Kill Flow Diagram

```
User presses Ctrl+C
        │
        ▼
┌───────────────────────────────────────────┐
│ Check: Any local_agent running?           │
└───────────────────┬───────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼ No                    ▼ Yes
┌───────────────┐       ┌───────────────────────────────────┐
│ Cancel stream │       │ Show confirmation:                │
│ (normal Ctrl) │       │ "Press Ctrl+F to stop agents"    │
└───────────────┘       └───────────────┬───────────────────┘
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                            ▼ Timeout               ▼ Ctrl+F
                    ┌───────────────┐       ┌───────────────────┐
                    │ Revert to     │       │ Execute killAll:  │
                    │ normal        │       │ 1. U4q()          │
                    └───────────────┘       │ 2. d4q() each     │
                                            │ 3. notify user    │
                                            └───────────────────┘
```

### Kill Single Task (Task List 'x' key)

```javascript
// ============================================
// Single task kill routing
// Location: chunks.162.mjs:839-846
// ============================================

// READABLE (for understanding):
function handleTaskKill(task, setAppState) {
    switch (task.type) {
        case "local_bash":
            killBashTask(task.id);  // wQ6 - chunks.95.mjs:1918
            break;
        case "local_agent":
            killAgentTask(task.id);  // via x66
            break;
        case "in_process_teammate":
            killTeammateTask(task.id);  // bZ1 - chunks.113.mjs:1272
            break;
        case "local_workflow":
            killWorkflowTask(task.id, setAppState);
            break;
        case "remote_agent":
            killRemoteAgentTask(task.id);
            break;
    }
}
```

---

## Progress Tracking UI

### Progress Update Flow

```javascript
// ============================================
// nl4 - Update task progress with telemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// ORIGINAL (for source lookup):
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        progressData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: progressData.toolUseId,
            description: summary,
            usage: {
                total_tokens: progressData.tokenCount,
                tool_uses: progressData.toolUseCount,
                duration_ms: Date.now() - progressData.startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### Progress Display

```
In Task List:
┌──────────────────────────────────────────────────────────────────┐
│ ◐ Search codebase - Running Grep for "taskId" in 5 files...     │
└──────────────────────────────────────────────────────────────────┘

Progress fields displayed:
- Status icon (animated)
- Description
- Current summary (from progress.summary)
- Action hints
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

### Notification Scenarios

| Event | Mode | Message Format |
|-------|------|---------------|
| Single Kill | task-notification | `Background agent "{desc}" was stopped by the user.` |
| Multiple Kill | task-notification | `{count} background agents were stopped by the user.` |
| Completion | task-notification | `Agent "{desc}" completed` |
| Failure | task-notification | `Agent "{desc}" failed: {error}` |

### Notification Display

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Background agent "Search codebase" completed.                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  2 background agents were stopped by the user.                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task State Machine UI

### State Transitions with UI Effects

```
                    ┌──────────┐
                    │ pending  │ ── UI: ○ (dim)
                    └────┬─────┘
                         │ spawn
                         ▼
                    ┌──────────┐
                    │ running  │ ── UI: ◐ (animated)
                    └────┬─────┘     Status line shows count
                         │           Task list shows progress
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │completed │   │  failed  │   │  killed  │
    └──────────┘   └──────────┘   └──────────┘
    UI: ✓          UI: ✗          UI: ○
    Green          Red            Dim
    Notification   Notification   Notification
```

### State Transition Functions

| From | To | Function | Symbol |
|------|-----|----------|--------|
| running | completed | markTaskCompleted | `$m8` |
| running | failed | markTaskFailed | `Hm8` |
| running | killed | markTaskKilled | `d4q` |

---

## Keyboard Shortcuts Matrix

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C |
| `/tasks` | Open task list modal | Always |

### Task List Modal

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move up | In list |
| `↓` / `j` | Move down | In list |
| `x` | Kill selected | Running task |
| `f` | Foreground | Teammate task |
| `Enter` | View details | Any task |
| `Esc` | Close modal | Modal open |

### Action Availability by Task Type

| Task Type | Kill (`x`) | Foreground (`f`) |
|-----------|------------|------------------|
| `local_agent` | ✓ running | ✗ |
| `local_bash` | ✓ running | ✗ |
| `in_process_teammate` | ✓ running | ✓ running |
| `remote_agent` | ✓ running | ✗ |
| `local_workflow` | ✓ running | ✗ |

---

## Integration with System Reminders

### Attachment Types

```
Background Task → System Reminder Attachments:

1. task_progress (running tasks, throttled)
   ┌─────────────────────────────────────────┐
   │ <task_progress>                         │
   │   <task_id>a3f4b2</task_id>            │
   │   <task_type>local_agent</task_type>   │
   │   <message>Running Grep...</message>   │
   │ </task_progress>                       │
   └─────────────────────────────────────────┘

2. task_status (terminal states, once)
   ┌─────────────────────────────────────────┐
   │ <task_status>                           │
   │   <task_id>a3f4b2</task_id>            │
   │   <status>completed</status>           │
   │   <description>Search codebase</description>
   │   <delta_summary>Found 15 files...</delta_summary>
   │ </task_status>                         │
   └─────────────────────────────────────────┘
```

### Throttle Mechanism

- **Progress attachments**: Throttled to every 3+ assistant turns
- **Status attachments**: Sent once on terminal state
- **New tasks**: Always get first progress (turnsSinceProgress = Infinity)

---

## Design Rationale

### Why Status Line Indicator?

1. **Visibility** - Background agents run silently, need visual indicator
2. **Discoverability** - Shows Ctrl+C action availability
3. **Quick reference** - Running count at a glance

### Why Two-Stage Kill?

1. **Safety** - Prevents accidental termination
2. **Clear intent** - Second keypress confirms
3. **Timeout** - Reverts to normal behavior if not confirmed

### Why Task List Modal?

1. **Detailed view** - Shows all tasks with status
2. **Per-task control** - Kill individual tasks
3. **Progress visibility** - See what each agent is doing

---

## v2.1.76 UI Enhancements

### New Features

1. **Ctrl+F Kill All** - Explicit shortcut for killing all background agents
2. **Partial Results on Kill** - Output preserved when task killed
3. **Background Field** - Distinguishes explicit vs converted background tasks
4. **Improved Notifications** - Better messaging for kill/completion events

### Status Line Enhancement

```
v2.1.76:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│              └─────────────────────┘                              │
│                 Interactive hint                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `bZ1` | killInProcessTeammate | chunks.113.mjs:1272 | ✓ Verified |

---

## Related Documents

- [ui_interaction.md](./ui_interaction.md) - UI interaction details
- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [system_reminder_producers_complete.md](./system_reminder_producers_complete.md) - System reminders
- [../08_subagent/ui_design_complete.md](../08_subagent/ui_design_complete.md) - Subagent UI