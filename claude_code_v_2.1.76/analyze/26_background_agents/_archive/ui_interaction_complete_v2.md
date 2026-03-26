# Background Agents UI Interaction Complete (Claude Code 2.1.76)

> Complete source-level documentation of user interface interactions for background agents, including task list modal, status indicators, and notification displays.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

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

```javascript
// ============================================
// hasRunningLocalAgents - State selector for status line
// Location: chunks.192.mjs:475 (inferred)
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
function hasRunningLocalAgents(state) {
    return Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    );
}

function getRunningAgentCount(state) {
    return Object.values(state.tasks).filter(
        (task) => task.type === "local_agent" && task.status === "running"
    ).length;
}
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
        pending: "○",      // Empty circle
        running: "◐",      // Half-filled (animated spinner)
        completed: "✓",    // Checkmark
        failed: "✗",       // X mark
        killed: "○"        // Empty circle
    }[task.status];

    // Action availability
    const canKill = task.status === "running";
    const canForeground = task.type === "in_process_teammate" && task.status === "running";

    // Progress display (for running tasks)
    const progressText = task.progress?.summary
        ? ` - ${task.progress.summary}`
        : "";

    return {
        statusIcon,
        description: task.description,
        progress: progressText,
        actions: {
            canKill,
            canForeground
        }
    };
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
│  ✓ Run tests - All tests passed                                 │
│                                                                   │
│  ✗ Deploy to staging - Connection refused                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
│ [x: stop] [f: foreground] [Esc: close]                          │
└──────────────────────────────────────────────────────────────────┘
```

### Status Icons

```
┌──────────────────────────────────────────────────────────────────┐
│ Status Icons                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ○  Pending     - Task created, not yet started                  │
│  ◐  Running     - Task actively executing (animated)             │
│  ✓  Completed   - Task finished successfully                     │
│  ✗  Failed      - Task encountered error                         │
│  ○  Killed      - Task was manually terminated                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

### Task List Modal Shortcuts

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK LIST KEYBINDINGS                            │
└─────────────────────────────────────────────────────────────────────┘

Key         Action
─────────────────────────────────────────────────────────────────────
x           Stop selected task (if running)
f           Bring task to foreground (if teammate)
Esc         Close task list modal
↑/↓         Navigate task list
Enter       View task details
```

### Global Shortcuts

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GLOBAL KEYBINDINGS                               │
└─────────────────────────────────────────────────────────────────────┘

Key         Action
─────────────────────────────────────────────────────────────────────
Ctrl+C      Kill current foreground task
Ctrl+F      Kill all running background agents (v2.1.76)
/tasks      Open task list modal
```

### Ctrl+F Kill All Handler (v2.1.76)

```javascript
// ============================================
// Ctrl+F Handler - Kill all running agents
// Location: chunks.146.mjs:2029
// ============================================

// READABLE (for understanding):
async function handleKillAll(setAppState) {
    let state = getAppState();
    let runningTasks = Object.values(state.tasks).filter(
        (task) => task.type === "local_agent" && task.status === "running"
    );

    if (runningTasks.length === 0) {
        showNotification("No running agents");
        return;
    }

    // Kill each running agent
    for (let task of runningTasks) {
        triggerAbortSignal(task.id, setAppState);
    }

    showNotification(`Killed ${runningTasks.length} running agents`);
}
```

---

## Notification Display

### Task Notification Types

```javascript
// Task notification format
const TASK_NOTIFICATIONS = {
    completion: {
        icon: "✓",
        color: "green",
        message: (task) => `Task completed: ${task.description}`
    },
    failure: {
        icon: "✗",
        color: "red",
        message: (task) => `Task failed: ${task.description}`
    },
    killed: {
        icon: "○",
        color: "yellow",
        message: (task) => `Task killed: ${task.description}`
    }
};
```

### Notification Injection Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION INJECTION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

Task completes/fails/killed
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ markTaskCompleted/Failed/Killed ($m8/Hm8/d4q)                       │
│   Updates task state                                                │
│   Sets notified: true                                               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Notification created                                                │
│   type: "task-notification"                                         │
│   status: "completed" | "failed" | "killed"                        │
│   description: task.description                                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Notification injected into message queue                            │
│   Appears in MessageArea                                            │
│   User sees result of background task                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Notification Display

```
┌──────────────────────────────────────────────────────────────────┐
│ Task Notification                                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✓ Task completed: Search codebase for usages                    │
│     Result: Found 15 matches                                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Task Failure Notification                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✗ Task failed: Deploy to staging                                │
│     Error: Connection refused after 30s                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Task Killed Notification                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ○ Task killed: Long running search                              │
│     Partial results saved to output file                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Progress Display

### Running Task Progress

```javascript
// Progress information for running tasks
interface TaskProgress {
    toolUseCount: number;    // Number of tools used
    tokenCount: number;      // Tokens consumed
    summary: string;         // Current activity summary
}

// Display format
// ◐ Search codebase - Running Grep for "taskId"... (12 tools, 15000 tokens)
```

### Progress Update Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROGRESS UPDATE FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

Agent makes tool call / processes response
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Check throttle: turnsSinceLastProgress >= THROTTLE_THRESHOLD       │
└─────────────────────────────────────────────────────────────────────┘
  │
  ├──────────────────────────────────────────────────────────┐
  │ YES                                                      │ NO
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ updateTaskProgressWithTelemetry│   │ Skip update                       │
│   Update progress.summary      │    │ (next turn will check again)      │
│   Emit telemetry               │    │                                   │
└───────────────────────────────┘    └───────────────────────────────────┘
  │
  ▼
UI re-renders with new progress
```

---

## Task Actions

### Stop Task

```javascript
// Stop (kill) a running task
async function stopTask(taskId, setAppState) {
    let task = getTask(taskId);

    if (!task || task.status !== "running") {
        return;  // Can only stop running tasks
    }

    // Get appropriate kill handler
    let handler = getKillHandlerForType(task.type);

    // Execute kill
    await handler(task, setAppState);

    // UI will show notification
}
```

### Foreground Task

```javascript
// Bring background task to foreground (teammates only)
async function foregroundTask(taskId, setAppState) {
    let task = getTask(taskId);

    if (task.type !== "in_process_teammate") {
        return;  // Only teammates can be foregrounded
    }

    // Signal the task to become foreground
    // This allows the user to interact with it directly
    signalForegroundRequested(taskId);
}
```

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `01_cli` | Keyboard handlers, status line |
| `02_ui` | Modal rendering, notifications |
| `08_subagent` | Task spawn, status updates |
| `26_background_agents` | Task state, kill handlers |
| `04_system_reminder` | Task notifications |

---

## Summary

The background agents UI interaction provides:

1. **Status line indicator** - Running count with kill hint
2. **Task list modal** - Full task list with actions
3. **Status icons** - Visual state indicators
4. **Keyboard shortcuts** - Quick task management
5. **Notifications** - Completion/failure/killed alerts
6. **Progress display** - Current activity for running tasks

The UI provides comprehensive visibility and control over background tasks while maintaining a clean, non-intrusive interface.