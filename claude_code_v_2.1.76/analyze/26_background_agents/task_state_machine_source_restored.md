# Task State Machine - Complete Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the task lifecycle, state transitions, and state management functions.
> Includes complete ORIGINAL/READABLE code restoration with cross-validated symbols.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `atomicUpdateTask` (i9) - Generic task state updater — `chunks.90.mjs:3003`
- `registerTask` (Zf) - Register task in state — `chunks.90.mjs:3019`
- `removeTask` (VR) - Remove completed task — `chunks.90.mjs:3037`
- `killAllLocalAgents` (U4q) - Kill all local agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `markTaskCompleted` ($m8) - Mark task completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task failed — `chunks.146.mjs:2117`
- `createBackgroundAgentTask` (Qn4) — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) — `chunks.146.mjs:2165`

---

## Task Status Values

### Status Enum

| Status | Description | Terminal |
|--------|-------------|----------|
| `pending` | Task created, not yet started | No |
| `running` | Currently executing | No |
| `completed` | Successfully finished | Yes |
| `failed` | Execution failed with error | Yes |
| `killed` | User terminated | Yes |

### Terminal Status Check

```javascript
// ============================================
// LJ6 - isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402
// ============================================

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}
```

---

## Task Record Structure

### Task Types

| Type | Prefix | Description |
|------|--------|-------------|
| `local_agent` | `a` | Local subagent task |
| `local_bash` | `b` | Local shell command |
| `in_process_teammate` | `t` | In-process teammate |
| `remote_agent` | `r` | Remote session agent |
| `local_workflow` | `w` | Workflow task |

### Task Record Fields

```javascript
// ============================================
// Task Record Structure (inferred from code)
// ============================================

// READABLE (for understanding):
const TaskRecord = {
    // Identity
    id: "a3f4b2",           // Unique task ID with type prefix
    type: "local_agent",     // Task type
    agentId: "a3f4b2",       // Agent ID (same as id for agents)
    toolUseId: "toolu_xxx",  // Tool use ID that spawned this task

    // Description
    description: "Search codebase",  // User-visible description
    prompt: "Search for...",         // Full prompt (for agents)

    // State
    status: "running",       // pending | running | completed | failed | killed
    notified: false,         // Has user been notified of completion?

    // Progress tracking
    progress: {
        toolUseCount: 5,     // Number of tool calls
        tokenCount: 1234,    // Token usage
        summary: "Running Grep..."  // Current activity
    },

    // Timing
    startTime: 1711459200000,
    endTime: null,           // Set on completion

    // Control
    abortController: AbortController,  // Cancellation controller
    unregisterCleanup: Function,       // Cleanup registration

    // Background-specific
    isBackgrounded: true,    // Running in background
    retrieved: false,        // Output retrieved?
    pendingMessages: [],     // Queued messages for this task

    // Output
    messages: [],            // Last message(s) for context
    result: null,            // Final result (on completion)
    error: null,             // Error message (on failure)
    outputOffset: 0,         // File offset for incremental reads
};
```

---

## atomicUpdateTask (i9)

### What it does

The core function for updating task state. All task modifications go through this function.

### How it works

1. Calls `setAppState` with a callback
2. The callback receives the current state
3. Finds the task by ID
4. Applies the updater function to get new task state
5. Returns updated state with modified task

### Why this approach

**Single source of truth**: All task modifications use the same code path, ensuring consistency and enabling logging/telemetry.

### Source Code

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3017
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
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
        // Get current task
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist

        // Apply updater function
        let newTask = updater(task);

        // If unchanged, return same state (optimization)
        if (newTask === task) return state;

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: newTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
// Y→state, z→task, _→newTask
```

### Key Insight

The `if (newTask === task) return state` optimization avoids unnecessary re-renders when the updater doesn't actually change anything.

---

## registerTask (Zf)

### What it does

Registers a new task in the app state and emits a `task_started` system message.

### Source Code

```javascript
// ============================================
// Zf - registerTask - Register task in state
// Location: chunks.90.mjs:3019-3035
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    })), c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        tool_use_id: A.toolUseId,
        description: A.description,
        task_type: A.type,
        prompt: "prompt" in A ? A.prompt : void 0
    })
}

// READABLE (for understanding):
function registerTask(task, setAppState) {
    // Add task to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));

    // Emit system message for UI/notification
    emitSystemMessage({
        type: "system",
        subtype: "task_started",
        task_id: task.id,
        tool_use_id: task.toolUseId,
        description: task.description,
        task_type: task.type,
        prompt: "prompt" in task ? task.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→task, q→setAppState, c36→emitSystemMessage
```

---

## removeTask (VR)

### What it does

Removes a completed task from state. Only removes tasks that are in terminal state AND have been notified.

### Source Code

```javascript
// ============================================
// VR - removeTask - Remove completed task from state
// Location: chunks.90.mjs:3037-3051
// ============================================

// ORIGINAL (for source lookup):
function VR(A, q) {
    q((K) => {
        let Y = K.tasks?.[A];
        if (!Y) return K;
        if (!LJ6(Y.status)) return K;
        if (!Y.notified) return K;
        let {
            [A]: z, ..._
        } = K.tasks;
        return {
            ...K,
            tasks: _
        }
    })
}

// READABLE (for understanding):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Doesn't exist

        // Only remove terminal tasks that have been notified
        if (!isTerminalTaskStatus(task.status)) return state;
        if (!task.notified) return state;

        // Destructure to remove task
        let { [taskId]: removed, ...remainingTasks } = state.tasks;

        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, LJ6→isTerminalTaskStatus
```

### Key Insight

Tasks are **not removed immediately** on completion. They stay in state until:
1. They reach terminal status
2. The user has been notified
3. The next state update occurs

This ensures the UI can display completion notifications.

---

## triggerAbortSignal (x66)

### What it does

Triggers an abort signal for a running task and updates its state to "killed". This is the core function for task cancellation.

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger task abort
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
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Trigger abort controller
        task.abortController?.abort();

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove from active tracking if killed
    if (wasKilled) {
        removeActiveAgent(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled,
// i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

### Key Insight

The `triggerAbortSignal` function does **three things atomically**:
1. **Calls `abortController.abort()`** - Signals the agent loop to stop
2. **Runs `unregisterCleanup()`** - Removes process-level cleanup handlers
3. **Updates state to "killed"** - Updates UI immediately

This atomicity prevents race conditions where the agent might continue executing after the abort signal but before state is updated.

---

## Complete Kill Flow

### User Triggers Kill (Ctrl+C)

```
User presses Ctrl+C
    │
    ▼
killAllLocalAgents (U4q) called
    │
    ├─→ Filter tasks: type === "local_agent" && status === "running"
    │
    └─→ For each matching task:
            │
            ▼
        triggerAbortSignal (x66)
            │
            ├─→ abortController.abort()  → Agent loop receives signal
            │                                between turns
            ├─→ unregisterCleanup()      → Remove process handlers
            │
            └─→ State update:              → UI shows "killed"
                status: "killed"
                endTime: Date.now()
                messages: [lastMessage]
```

### Agent Loop Abort Detection

```javascript
// In agentLoopRunner (qh) - chunks.133.mjs:1780
if (r.signal.aborted) throw new oY;

// The agent loop checks abort signal:
// 1. Before each LLM turn
// 2. After each streaming event
// 3. In the finally block for cleanup
```

### Why Two-Phase Kill?

| Phase | What | Why |
|-------|------|-----|
| **Phase 1** | `abortController.abort()` | Signals agent to stop gracefully between turns |
| **Phase 2** | State update to "killed" | Updates UI immediately, doesn't wait for agent to finish |

If the agent is in the middle of a long-running operation (like a Bash command), it continues until completion, then the abort check fires. The UI shows "killed" immediately regardless.

---

## State Transition Guards

### Running Guard

All state transitions check `task.status !== "running"` before modifying:

```javascript
// In $m8 (markTaskCompleted)
if (task.status !== "running") return task;

// In Hm8 (markTaskFailed)
if (task.status !== "running") return task;

// In x66 (triggerAbortSignal)
if (task.status !== "running") return task;
```

**Why this matters:**
- Prevents double-completion (e.g., task completes, then fails)
- Prevents race conditions between completion and kill
- Idempotent - calling markTaskCompleted twice doesn't corrupt state

### Notified Guard

```javascript
// In d4q (markTaskKilled)
if (task.notified) return task;

// In VR (removeTask)
if (!task.notified) return state;
```

**Why this matters:**
- Ensures UI shows completion notification before removal
- Prevents premature task cleanup
- User always sees final state before it disappears

---

## killAllLocalAgents (U4q)

### What it does

Kills all running `local_agent` tasks. Triggered by Ctrl+C or Ctrl+F when agents are running.

### Source Code

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
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Algorithm: Kill All Flow

```
1. Iterate all tasks in appState.tasks
2. Filter: type === "local_agent" AND status === "running"
3. For each matching task:
   a. Call triggerAbortSignal(taskId, setAppState)
   b. This sets task.abortController.abort("killed")
   c. The agent loop checks signal.aborted between turns
   d. Agent gracefully stops and enters cleanup
```

---

## markTaskKilled (d4q)

### What it does

Updates a task's state to "killed" and marks it as notified. Called after abort signal is triggered.

### Source Code

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed with notification
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
        // Already notified - don't update again
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only the last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

### Key Insight

**Memory efficiency**: When marking as killed, only the last message is retained. This prevents memory buildup from long-running agents that accumulated many messages.

---

## markTaskCompleted ($m8)

### What it does

Updates a running task to "completed" status with the result.

### Source Code

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
function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            // Keep only last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove agent from active tracking
    removeActiveAgent(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId,
// i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

---

## markTaskFailed (Hm8)

### What it does

Updates a running task to "failed" status with the error message.

### Source Code

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
function markTaskFailed(agentId, error, setAppState) {
    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    removeActiveAgent(agentId);
}

// Mapping: Hm8→markTaskFailed, A→agentId, q→error, K→setAppState
```

---

## createBackgroundAgentTask (Qn4)

### What it does

Creates a task record for a background agent with all necessary fields initialized.

### Source Code

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Create background agent task
// Location: chunks.146.mjs:2133-2163
// ============================================

// ORIGINAL (for source lookup):
function Qn4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = _ ? Wm(_) : sK(),
        $ = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: []
        },
        H = E4(async () => {
            x66(A, z)
        });
    return $.unregisterCleanup = H, Zf($, z), $
}

// READABLE (for understanding):
function createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
}) {
    // Create output directory
    ensureOutputDirectory(agentId, getOutputFilePath(agentId));

    // Create abort controller (child of parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Build task record
    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,
        pendingMessages: []
    };

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    task.unregisterCleanup = unregisterCleanup;

    // Register in state
    registerTask(task, setAppState);

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
// Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
// Co→ensureOutputDirectory, L0→getOutputDirectory, X$→getOutputFilePath,
// Wm→createChildAbortController, sK→new AbortController, RG→createTaskRecord,
// E4→registerCleanupHandler, Zf→registerTask
```

---

## State Transition Diagram

```
                    ┌─────────────────────────────────────────────────┐
                    │                                                  │
                    ▼                                                  │
┌──────────┐    ┌──────────┐    ┌────────────┐    ┌───────────────┐  │
│ pending  │───▶│ running  │───▶│ completed  │    │    failed     │  │
└──────────┘    └────┬─────┘    └────────────┘    └───────────────┘  │
                     │                                                   │
                     │ abort (x66)                                       │
                     │                                                   │
                     ▼                                                   │
                ┌──────────┐                                             │
                │  killed  │◀────────────────────────────────────────────┘
                └──────────┘                     (removeTask after notified)
```

### Transition Triggers

| From | To | Trigger | Function |
|------|-----|---------|----------|
| pending | running | Task starts executing | Agent loop init |
| running | completed | Successful completion | `$m8` (markTaskCompleted) |
| running | failed | Error during execution | `Hm8` (markTaskFailed) |
| running | killed | User abort | `x66` → `d4q` |

---

## Progress Update Functions

### updateTaskProgressPreservingSummary (TV1)

```javascript
// ============================================
// TV1 - updateTaskProgressPreservingSummary
// Location: chunks.146.mjs:2045-2057
// ============================================

// ORIGINAL (for source lookup):
function TV1(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        let z = Y.progress?.summary;
        return {
            ...Y,
            progress: z ? {
                ...q,
                summary: z
            } : q
        }
    })
}

// READABLE (for understanding):
function updateTaskProgressPreservingSummary(taskId, progress, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...progress, summary: existingSummary }
                : progress
        };
    });
}
```

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
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

    // Emit telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressData;

        emitSystemMessage({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |

---

## Related Documents

- [output_capture.md](./output_capture.md) - Output file system
- [kill_handlers.md](./kill_handlers.md) - Kill handler details
- [../08_subagent/task_lifecycle_and_state.md](../08_subagent/task_lifecycle_and_state.md) - Subagent task lifecycle