# Task State Machine (Claude Code 2.1.76)

> Deep analysis of task lifecycle, state transitions, and the state machine governing background agent execution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `atomicUpdateTask` (i9) — Generic state updater — chunks.90.mjs:3003 ✓
- `registerTask` (Zf) — Register new task — chunks.90.mjs:3019 ✓
- `removeTask` (VR) — Remove completed task — chunks.90.mjs:3037 ✓
- `markTaskCompleted` ($m8) — Mark completed — chunks.146.mjs:2100 ✓
- `markTaskFailed` (Hm8) — Mark failed — chunks.146.mjs:2117 ✓
- `markTaskKilled` (d4q) — Mark killed — chunks.146.mjs:2034 ✓
- `triggerAbortSignal` (x66) — Trigger abort — chunks.146.mjs:2012 ✓

---

## State Overview

### Possible States

| State | Description | Transitions From |
|-------|-------------|------------------|
| `pending` | Initial state, task created but not started | — |
| `running` | Task is actively executing | `pending` |
| `completed` | Task finished successfully | `running` |
| `failed` | Task encountered an error | `running` |
| `killed` | Task was terminated by user | `running` |

### State Diagram

```
                                    ┌──────────────┐
                                    │   pending    │
                                    └──────┬───────┘
                                           │
                        spawn handler      │
                        starts execution   │
                                           ▼
                                    ┌──────────────┐
                                    │   running    │
                                    └──────┬───────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              │ normal                     │ error                      │ user/ctrl+c
              │ completion                 │ thrown                     │ abort
              ▼                            ▼                            ▼
       ┌──────────────┐           ┌──────────────┐            ┌──────────────┐
       │  completed   │           │   failed     │            │   killed     │
       └──────────────┘           └──────────────┘            └──────────────┘
```

### Terminal States

The states `completed`, `failed`, and `killed` are **terminal** - no further transitions occur.

```javascript
// ============================================
// isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402-2406
// ============================================

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}
```

---

## State Transitions

### Transition: pending → running

**Trigger:** Task spawn handlers call `registerTask` with `status: "running"`

**Location:** chunks.146.mjs:2133 (createBackgroundAgentTask), chunks.146.mjs:2165 (createForegroundAgentTask)

```javascript
// In createBackgroundAgentTask (Qn4)
let task = {
    ...createTaskRecord(taskId, "local_agent", description, toolUseId),
    status: "running",  // Immediately set to running
    agentId: agentId,
    // ... other fields
};
registerTask(task, setAppState);  // Zf
```

### Transition: running → completed

**Trigger:** `markTaskCompleted` ($m8) called after successful execution

**Location:** chunks.146.mjs:2100-2115

```javascript
// ============================================
// markTaskCompleted - Mark task as completed
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
function markTaskCompletion(result, setAppState) {
    let taskId = result.agentId;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only transition from running state
        if (task.status !== "running") return task;

        // Cleanup: run unregister handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,  // Contains content, tokens, etc.
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear execution resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // $O: Notify task state change
    notifyTaskStateChange(taskId);
}

// Mapping: $m8→markTaskCompletion, A→result, q→setAppState, i9→atomicUpdateTask, $O→notifyTaskStateChange
```

### Transition: running → failed

**Trigger:** `markTaskFailed` (Hm8) called when an error occurs

**Location:** chunks.146.mjs:2117-2131

```javascript
// ============================================
// markTaskFailed - Mark task as failed
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
function markTaskFailed(taskId, errorMessage, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only transition from running state
        if (task.status !== "running") return task;

        // Cleanup: run unregister handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: errorMessage,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear execution resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    notifyTaskStateChange(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→errorMessage, K→setAppState
```

### Transition: running → killed

**Trigger:** `markTaskKilled` (d4q) called after user abort

**Location:** chunks.146.mjs:2034-2043

```javascript
// ============================================
// markTaskKilled - Mark task as killed with notification
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
        // Prevent double notification
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState
```

**Note:** `markTaskKilled` only sets `notified: true`. The actual `status: "killed"` is set by `triggerAbortSignal`.

### Abort Signal Trigger

**Location:** chunks.146.mjs:2012-2027

```javascript
// ============================================
// triggerAbortSignal - Trigger abort signal for task
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

        // Trigger abort controller
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear execution resources
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    if (wasAborted) {
        notifyTaskStateChange(taskId);
    }

    return wasAborted;  // Indicates if abort actually happened
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, $O→notifyTaskStateChange
```

---

## State Machine Guards

### Guard: status !== "running"

Most transitions guard on `status === "running"`:

```javascript
if (task.status !== "running") return task;
```

**Why:** Prevents:
1. Double completion - Task can't complete twice
2. Invalid transitions - Can't kill a completed task
3. Race conditions - Concurrent updates handled correctly

### Guard: notified === false

The `markTaskKilled` function guards on `!notified`:

```javascript
if (task.notified) return task;
```

**Why:** Prevents duplicate kill notifications. When `triggerAbortSignal` sets `status: "killed"`, `markTaskKilled` is then called to set `notified: true`.

---

## Resource Cleanup

### Resources Cleaned on Terminal State

| Resource | Field | Cleanup |
|----------|-------|---------|
| AbortController | `abortController` | `abort()` then set to `undefined` |
| Process exit handler | `unregisterCleanup` | Called then set to `undefined` |
| Agent reference | `selectedAgent` | Set to `undefined` |
| Message history | `messages` | Trimmed to last message only |

### Why Cleanup Matters

1. **Memory** - Prevents memory leaks from retained references
2. **Resources** - AbortController must be aborted to stop async operations
3. **Process** - Exit handlers must be removed to prevent stale cleanup

---

## State Update Pattern

### atomicUpdateTask (i9)

**Location:** chunks.90.mjs:3003-3017

**What it does:** Safely updates task state using immutable pattern.

```javascript
// ============================================
// atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3017
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        return _ === z ? Y : {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        // Get task by ID
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task not found, no change

        // Apply updater function
        let updatedTask = updater(task);

        // Reference equality check - if same object, no update needed
        if (updatedTask === task) return state;

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater
```

### Key Insight: Atomicity

1. **Single update** - All state changes happen in one `setAppState` call
2. **Consistency** - State is always internally consistent
3. **No races** - React's batch updates prevent race conditions

---

## Task Registration

### registerTask (Zf)

**Location:** chunks.90.mjs:3019-3025

```javascript
// ============================================
// registerTask - Register task in state
// Location: chunks.90.mjs:3019-3025
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    }))
}

// READABLE (for understanding):
function registerTask(task, setAppState) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));
}

// Mapping: Zf→registerTask, A→task, q→setAppState
```

---

## Task Removal

### removeTask (VR)

**Location:** chunks.90.mjs:3037-3045

```javascript
// ============================================
// removeTask - Remove completed task from state
// Location: chunks.90.mjs:3037-3045
// ============================================

// ORIGINAL (for source lookup):
function VR(A, q) {
    q((K) => {
        let {
            [A]: Y,
            ...z
        } = K.tasks;
        return {
            ...K,
            tasks: z
        }
    })
}

// READABLE (for understanding):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        // Destructure to remove task by ID
        let {
            [taskId]: removed,
            ...remainingTasks
        } = state.tasks;

        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState
```

### When Removal Happens

Tasks are removed after:
1. Completion notification shown
2. User acknowledges the notification
3. Short delay for UI animation

```javascript
// In AgentTool handler after completion
$m8(result, setAppState);  // Mark completed
$z6({...});                // Notify user
setTimeout(() => VR(taskId, setAppState), NOTIFICATION_DELAY);  // Remove later
```

---

## Kill All Flow

### killAllLocalAgents (U4q)

**Location:** chunks.146.mjs:2029-2032

```javascript
// ============================================
// killAllLocalAgents - Kill all local_agent tasks
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
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Kill All Flow Diagram

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
└─────────────────────────┘    │  1. U4q(tasks, setAppState)                 │
                               │     → for each running local_agent:         │
                               │     → x66(taskId, setAppState)              │
                               │                                             │
                               │  2. For each killed task:                   │
                               │     → d4q(taskId, setAppState)              │
                               │     → collect description for notification  │
                               │                                             │
                               │  3. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

---

## Design Rationale

### Why Terminal States?

1. **Clarity** - No ambiguity about task outcome
2. **Simplicity** - No need for complex state charts
3. **Safety** - Prevents invalid operations on completed tasks

### Why Atomic Updates?

1. **Consistency** - State is always valid
2. **Race-free** - Concurrent updates handled correctly
3. **React integration** - Works with React's state model

### Why Message Trimming?

1. **Memory** - Prevents unbounded message accumulation
2. **Performance** - Smaller state is faster to process
3. **Sufficiency** - Last message is enough for debugging

### Why Separate Kill and Notified?

1. **Timing** - Kill happens immediately, notification later
2. **Idempotency** - Multiple kill attempts don't duplicate notifications
3. **Separation of concerns** - State vs. notification are separate