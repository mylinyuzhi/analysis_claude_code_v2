# Background Agents UI Interaction (Claude Code 2.1.76)

> Documentation of user interface components, interactions, and visual feedback for background task management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - Kill all local agents - chunks.146.mjs:2029
- `d4q` - Mark task as killed with notification - chunks.146.mjs:2034
- `TaskListRow` - Task list UI row component - chunks.162.mjs:836-981
- `hasRunningAgents` selector - State selector for running agents - chunks.193.mjs:2605

---

## Overview

Background agents provide a rich UI experience through:
1. **Task list view** - Interactive list of all tasks with actions
2. **Status line indicators** - Running task count and hints
3. **Kill controls** - Per-task and kill-all functionality
4. **Notification system** - Completion and failure alerts
5. **Output preview** - Incremental output display

---

## Task List Component

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Task List View                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Task List Header                                                     │    │
│  │                                                                      │    │
│  │  "Running Tasks" or "Completed Tasks"                               │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Task Row (each task)                                                 │    │
│  │                                                                      │    │
│  │  ┌─────────┬──────────────────────────────────────┬────────────┐   │    │
│  │  │ Status  │ Description / Progress               │ Actions    │   │    │
│  │  │ Icon    │                                       │ [x] [f]    │   │    │
│  │  └─────────┴──────────────────────────────────────┴────────────┘   │    │
│  │                                                                      │    │
│  │  Status Icons:                                                       │    │
│  │  • Running: ◐ (animated)                                             │    │
│  │  • Completed: ✓                                                      │    │
│  │  • Failed: ✗                                                         │    │
│  │  • Killed: ○                                                         │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Footer Actions                                                       │    │
│  │                                                                      │    │
│  │  [x: stop] [f: foreground] [Ctrl+C: kill all]                       │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task Row Actions

### Keyboard Actions in Task List

**Location:** chunks.162.mjs:836-846

```javascript
// ============================================
// TaskRowActions - Keyboard handlers for task list
// Location: chunks.162.mjs:839-846
// ============================================

// ORIGINAL (for source lookup):
if (Q === "x") {
    if (r.type === "local_bash" && r.status === "running") v(r.id);
    else if (r.type === "local_agent" && r.status === "running") N(r.id);
    else if (r.type === "in_process_teammate" && r.status === "running") V(r.id);
    else if (r.type === "local_workflow" && r.status === "running" && CR1) CR1(r.id, w)
}
if (Q === "f") {
    if (r.type === "in_process_teammate" && r.status === "running") g16(r.id, w), A("Viewing teammate", {
        action: "view"
    });
}

// READABLE (for understanding):
function handleTaskAction(key, task, dispatch) {
    if (key === "x") {  // Kill action
        if (task.type === "local_bash" && task.status === "running") {
            killBashTask(task.id);
        } else if (task.type === "local_agent" && task.status === "running") {
            killAgentTask(task.id);
        } else if (task.type === "in_process_teammate" && task.status === "running") {
            killTeammateTask(task.id);
        } else if (task.type === "local_workflow" && task.status === "running") {
            killWorkflowTask(task.id, setAppState);
        }
    }
    if (key === "f") {  // Foreground action (teammates only)
        if (task.type === "in_process_teammate" && task.status === "running") {
            foregroundTeammate(task.id, setAppState);
            dispatch("Viewing teammate", { action: "view" });
        }
    }
}
```

### Action Availability Matrix

| Task Type | `x` (Kill) | `f` (Foreground) |
|-----------|------------|------------------|
| `local_agent` | ✓ (when running) | ✗ |
| `local_bash` | ✓ (when running) | ✗ |
| `in_process_teammate` | ✓ (when running) | ✓ (when running) |
| `local_workflow` | ✓ (when running) | ✗ |
| `remote_agent` | ✓ (when running) | ✗ |

---

## Kill All Agents Flow

### Trigger: Ctrl+C with Running Agents

**Location:** chunks.193.mjs:2605-2644

```javascript
// ============================================
// killAllRunningAgents - Ctrl+C handler for agent termination
// Location: chunks.193.mjs:2605-2644
// ============================================

// ORIGINAL (for source lookup):
let L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running"));
let h = Ra6.useCallback(() => {
    // ... earlier code
    if (L) {
        d("tengu_cancel", {
            source: "kill_agents"
        }), U4q(H6, W), _Y4();
        let J6 = [];
        for (let [K6, s] of Object.entries(H6))
            if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
        if (J6.length > 0) {
            let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
            w0({
                value: K6,
                mode: "task-notification"
            });
        }
    }
}, [/* deps */]);

// READABLE (for understanding):
// State selector: true if any local_agent is running
let hasRunningAgents = useAppState((state) =>
    Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    )
);

let handleCtrlC = useCallback(() => {
    if (hasRunningAgents) {
        // Telemetry: user cancelled via kill agents
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Send abort signal to all local_agent tasks
        killAllLocalAgents(appState.tasks, setAppState);
        clearActiveTaskState();

        // Collect killed agent descriptions and mark as killed
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(appState.tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // Show notification
        if (killedDescriptions.length > 0) {
            let message = killedDescriptions.length === 1
                ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
                : `${killedDescriptions.length} background agents were stopped by the user: ${killedDescriptions.map(d => `"${d}"`).join(", ")}.`;
            addNotification({
                value: message,
                mode: "task-notification"
            });
        }
    }
}, [hasRunningAgents, appState.tasks, setAppState]);
```

### Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+C                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Check: hasRunningAgents?                                  │
│                                                                              │
│  hasRunningAgents = tasks.some(t => t.type === "local_agent" &&             │
│                                     t.status === "running")                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼ false                       ▼ true
┌─────────────────────────┐    ┌─────────────────────────────────────────────┐
│ Normal Ctrl+C behavior  │    │ Kill All Running Agents                     │
│ (cancel current stream) │    │                                             │
└─────────────────────────┘    │  1. telemetry("tengu_cancel")               │
                               │  2. U4q(tasks, setAppState) // abort all    │
                               │  3. For each running local_agent:           │
                               │     a. d4q(taskId, setAppState) // killed   │
                               │     b. collect description                  │
                               │  4. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

---

## Kill Handler Functions

### U4q - Kill All Local Agents

**Location:** chunks.146.mjs:2029-2032

```javascript
// ============================================
// U4q - Send abort signal to all local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            // x66: Triggers abort signal for the task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### d4q - Mark Task as Killed

**Location:** chunks.146.mjs:2034-2038

```javascript
// ============================================
// d4q - Mark task as killed and record notification
// Location: chunks.146.mjs:2034-2038
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q, K) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            status: "killed",
            endTime: Date.now(),
            notified: !0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Skip if already notified (prevent double notification)
        if (task.notified) return task;

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            notified: true
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

---

## Status Line Indicators

### Running Agent Count

**Location:** chunks.192.mjs:475

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

### Status Line Display

When agents are running, the status line shows:
- Count of running agents
- Hint for killing: "Ctrl+C to cancel"

```
Status Line Example:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task Status Icons

### Visual Representation

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `pending` | ○ | dim | Task created, not yet started |
| `running` | ◐ | yellow | Currently executing |
| `completed` | ✓ | green | Successfully finished |
| `failed` | ✗ | red | Execution failed with error |
| `killed` | ○ | dim | User terminated |

### Animated Running Indicator

Running tasks use an animated spinner (◐) to indicate active execution.

---

## Output Preview

### TaskOutputTool Integration

Users can check background task output using the `TaskOutput` tool or by reading the output file.

**Output file path:** `~/.claude/tasks/{taskId}.output`

### Incremental Output Display

The output is captured incrementally, allowing real-time progress monitoring:

```javascript
// Output capture during execution
appendToOutputFile(taskId, "Starting search...\n");
appendToOutputFile(taskId, "Found 5 matches in file1.js\n");
appendToOutputFile(taskId, "Found 12 matches in file2.js\n");
```

---

## Notification Types

### Task Notification Modes

| Mode | Display | Usage |
|------|---------|-------|
| `task-notification` | Inline message | Kill confirmations, completion notices |
| `error` | Error banner | Task failures |
| `warning` | Warning message | Resource warnings |

### Notification Structure

```javascript
{
    value: "Background agent \"Search codebase\" completed.",
    mode: "task-notification"
}
```

---

## Task List View Mode

### List vs Detail View

The task list supports two modes:
- **List mode** - Shows all tasks with summary
- **Detail mode** - Shows expanded output for selected task

### Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `Enter` | View task details |
| `Escape` | Return to list |
| `x` | Kill selected task |
| `f` | Foreground teammate |

---

## Integration with System Reminders

Background task status is communicated via system reminders:

### task_status Reminder

Generated when a task completes, fails, or is killed.

### task_progress Reminder

Generated periodically while task is running (throttled to every 3 turns).

See [system_reminder_producers.md](./system_reminder_producers.md) for detailed implementation.

---

## Related Documents

- [implementation.md](./implementation.md) - Core implementation details
- [kill_handlers.md](./kill_handlers.md) - Kill handler implementations
- [output_capture.md](./output_capture.md) - Output file management
- [../08_subagent/ui_interaction.md](../08_subagent/ui_interaction.md) - Subagent UI

---

## Source Code Verification

### Verified Symbol Locations

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |

### Additional Verified Source Code

```javascript
// ============================================
// $m8 - Mark task as completed (verified source)
// Location: chunks.146.mjs:2100-2114
// ============================================

// ORIGINAL (for source lookup):
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(K)
}

// READABLE (for understanding):
function markTaskCompleted(agentResult, setAppState) {
    let agentId = agentResult.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: agentResult,
            endTime: Date.now(),
            // Keep only last message for memory
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // $O: notify completion
    notifyCompletion(agentId);
}

// Mapping: $m8→markTaskCompleted, A→agentResult, q→setAppState, i9→atomicUpdateTask
```

```javascript
// ============================================
// Hm8 - Mark task as failed (verified source)
// Location: chunks.146.mjs:2117-2130
// ============================================

// ORIGINAL (for source lookup):
function Hm8(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "failed",
            error: q,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0
        }
    })
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            // Keep only last message for memory
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined
        };
    });
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, i9→atomicUpdateTask
```

---

## v2.1.76 UI Changes

### New Features in v2.1.76

1. **Ctrl+F Kill All** - New keyboard shortcut to kill all running agents at once
2. **Partial Results on Kill** - Preserved output when task is killed
3. **Background Field** - New `background: true` field distinguishes explicit vs. converted background tasks

### Kill All Flow with Partial Results

```
User presses Ctrl+F or Ctrl+C with running agents
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. For each running local_agent:                                           │
│     a. readOutputFileDelta(taskId, offset) // Capture partial output       │
│     b. x66(taskId) // Trigger abort signal                                  │
│     c. d4q(taskId, setAppState) // Mark as killed                          │
│                                                                              │
│  2. Build notification with partial results included                        │
│                                                                              │
│  3. Show user notification: "N background agents were stopped..."           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Status Line Enhancements

```
v2.1.76 Status Line:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│              └─────────────────────┘                              │
│                 Interactive hint - click or press                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task State Machine Complete

```
                     ┌──────────┐
                     │ pending  │ ─── createTaskRecord()
                     └────┬─────┘
                          │ start execution
                          ▼
                     ┌──────────┐
                     │ running  │ ─── updateTaskProgress()
                     └────┬─────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │completed │   │  failed  │   │  killed  │
     └──────────┘   └──────────┘   └──────────┘
          │               │               │
          └───────────────┴───────────────┘
                          │
                          ▼
               notifyTaskCompletion()
               (injects into queue)
```

### State Transition Functions

| From | To | Function | Symbol |
|------|-----|----------|--------|
| running | completed | markTaskCompleted | `$m8` |
| running | failed | markTaskFailed | `Hm8` |
| running | killed | markTaskKilled | `d4q` |
| any | running | (via task creation) | - |

---

## Integration with 04_system_reminder

### Attachment Generation Timeline

```
Background Task Execution:
        │
        │ (each LLM turn)
        ▼
┌─────────────────────────────────────────────┐
│ getUnifiedTasksAttachment (vIY)             │
│                                              │
│ 1. Check all tasks in appState.tasks       │
│ 2. For running: check throttle (3 turns)   │
│ 3. For terminal: check notified flag       │
│ 4. Build appropriate attachments           │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ Attachment Types Generated:                 │
│                                              │
│ • task_progress (running, throttled)        │
│ • task_status (completed/failed/killed)     │
│ • task_notification (injected to queue)     │
└─────────────────────────────────────────────┘
```

### Throttle Mechanism Details

Progress attachments are throttled to prevent noise:
- **Threshold**: 3 assistant turns since last progress
- **New tasks**: Always get first progress (turnsSinceProgress = Infinity)
- **Implementation**: Backwards iteration through message history