# UI Interaction Complete V5 (Claude Code 2.1.76)

> Complete source-level restoration of subagent UI interaction including component hierarchy, keyboard shortcuts, status line integration, task list modal implementation, and notification system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`
- `d4q` - Mark task killed — `chunks.146.mjs:2034`
- `$m8` - Mark task completed — `chunks.146.mjs:2100`
- `Hm8` - Mark task failed — `chunks.146.mjs:2117`
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`
- `w0` - Show notification — `Multiple files`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBAGENT UI ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent (type: "tool_use", name: "Agent")            ││    │
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge (color from agentDefinition)         ││    │
│  │  │          ├─ Description (from AgentTool call)                   ││    │
│  │  │          ├─ Stats (toolUseCount, tokens)                        ││    │
│  │  │          └─ StatusIndicator (running/completed/failed)          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine (Footer)                           │    │
│  │                                                                       │    │
│  │  BackgroundAgentIndicator:                                           │    │
│  │  • Running agent count: "2 running"                                  │    │
│  │  • Kill hint: "Ctrl+C to cancel"                                     │    │
│  │  • Interactive: triggers kill confirmation                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TaskListModal (on /tasks)                     │    │
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
│  │                        NotificationArea                              │    │
│  │                                                                       │    │
│  │  Task completion/failure/kill notifications                         │    │
│  │  Mode: "task-notification"                                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts Complete

### Global Shortcuts

| Shortcut | Action | Context | Source |
|----------|--------|---------|--------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running | Key handler |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C | Key handler |
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

## Kill Flow Complete

### Kill Confirmation Flow Diagram

```
User presses Ctrl+C with running agents
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Check: Any local_agent running?                                            │
│   Code: Object.values(tasks).some(t => t.type === "local_agent" &&         │
│                                      t.status === "running")               │
└─────────────────────────────┬─────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼ No                        ▼ Yes
    ┌───────────────────┐         ┌─────────────────────────────────────────┐
    │ Cancel stream     │         │ Show confirmation:                      │
    │ (normal Ctrl+C)   │         │ "Press Ctrl+F to stop agents"           │
    └───────────────────┘         └───────────────────┬─────────────────────┘
                                                        │
                                          ┌─────────────┴─────────────┐
                                          │                           │
                                          ▼ Timeout                   ▼ Ctrl+F
                                  ┌───────────────────┐         ┌─────────────────────────┐
                                  │ Revert to         │         │ Execute killAll:        │
                                  │ normal behavior   │         │ 1. U4q(tasks, setState) │
                                  └───────────────────┘         │ 2. For each killed:     │
                                                                │    d4q(taskId, setState)│
                                                                │ 3. Show notification    │
                                                                └─────────────────────────┘
```

### Kill Functions Source Code

#### triggerAbortSignal (x66)

**What it does:** Triggers abort for a single task with proper cleanup.

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]  // Keep last message
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          i9→atomicUpdateTask, Y→task, $O→flushOutputBuffer
```

**Why flush output buffer:**
- **Partial results preserved**: User can see what was accomplished before kill
- **Debugging aid**: Helps understand what the agent was doing
- **Transparency**: No silent loss of work

#### killAllLocalAgents (U4q)

**What it does:** Kills all running local_agent tasks in one operation.

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    // Iterate all tasks - Object.entries creates snapshot
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter conditions:
        // 1. Must be local_agent type (not local_bash, in_process_teammate, etc.)
        // 2. Must be in running state
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

**Why type filtering:**
- **local_agent only**: Doesn't kill bash tasks (those have their own kill logic)
- **running only**: Doesn't attempt to abort completed/failed tasks
- **Safe iteration**: Object.entries creates snapshot before mutation

---

## Task State Transitions

### State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

### State Transition Functions

#### markTaskCompleted ($m8)

```javascript
// ============================================
// $m8 - markTaskCompleted - Mark task as completed
// Location: chunks.146.mjs:2100-2115
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
function markTaskCompleted(completionResult, setAppState) {
    let taskId = completionResult.agentId;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only transition running tasks
        if (task.status !== "running") return task;

        // Cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: completionResult,  // Contains final content, tokens, etc.
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush any remaining output
    flushOutputBuffer(taskId);  // $O
}

// Mapping: $m8→markTaskCompleted, A→completionResult, q→setAppState, K→taskId,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

#### markTaskFailed (Hm8)

```javascript
// ============================================
// Hm8 - markTaskFailed - Mark task as failed
// Location: chunks.146.mjs:2117-2131
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
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,  // Error message or object
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush any remaining output
    flushOutputBuffer(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task
```

#### markTaskKilled (d4q)

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as notified after kill
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Already notified - skip
        if (task.notified) return task;

        return {
            ...task,
            notified: true,  // Mark as notified for eviction
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
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

### Notification Display Format

```
┌──────────────────────────────────────────────────────────────────┐
│ Background agent "search codebase" was stopped by the user.      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 3 background agents were stopped by the user.                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task List Modal

### Display States

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo \|\| "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo \|\| "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription \|\| "Running in background"` |

### Status Icons

| Status | Icon | Animation | Color | Description |
|--------|------|-----------|-------|-------------|
| `pending` | ○ | None | Dim | Task created, not started |
| `running` | ◐ | Spinner | Yellow | Currently executing |
| `completed` | ✓ | None | Green | Successfully finished |
| `failed` | ✗ | None | Red | Execution failed |
| `killed` | ○ | None | Dim | User terminated |

### Action Availability by Task Type

| Task Type | Kill (`x`) | Foreground (`f`) |
|-----------|------------|------------------|
| `local_agent` | ✓ running | ✗ |
| `local_bash` | ✓ running | ✗ |
| `in_process_teammate` | ✓ running | ✓ running |
| `remote_agent` | ✓ running | ✗ |
| `local_workflow` | ✓ running | ✗ |

---

## Status Line Integration

### Background Agent Indicator

**What it does:** Shows count of running background agents and kill hint in the footer.

### Display Logic

```javascript
// State selector for showing background agent indicator
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);
```

### Visual Specifications

```
Running Count:
  Color: Yellow (warning)
  Format: "{count} running"
  Animation: None

Separator:
  Text: " • "
  Color: Dim

Kill Hint:
  Text: "Ctrl+C to cancel"
  Color: Dim
  Interactive: Click/press triggers kill confirmation
```

### Display Format

```
When agents running:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│ └──────┘   └─────────────────────┘                               │
│   count        interactive hint                                   │
└──────────────────────────────────────────────────────────────────┘

When no agents running:
┌──────────────────────────────────────────────────────────────────┐
│ (normal status line content - model, cwd, etc.)                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Progress Tracking

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
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

    // Update task progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry
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
//          Y→progressData, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |

---

## Related Documents

- [key_algorithms_deep_dive_v5.md](./key_algorithms_deep_dive_v5.md) - Algorithm analysis
- [system_reminder_integration_v6.md](./system_reminder_integration_v6.md) - System reminder integration
- [cross_feature_linkages_complete_v4.md](./cross_feature_linkages_complete_v4.md) - Feature integrations
- [cross_validation_report_v2.md](./cross_validation_report_v2.md) - Symbol verification
- [../26_background_agents/ui_interaction_complete_v4.md](../26_background_agents/ui_interaction_complete_v4.md) - Background agents UI