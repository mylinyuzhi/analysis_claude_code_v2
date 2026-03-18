# Task Lifecycle and State - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the complete lifecycle of subagent tasks, from creation to completion or failure, including state transitions, backgrounding, and cleanup.

**v2.1.76 changes:**
- Task creation no longer requires the `activeForm` field - it has been removed from the required schema

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `generateTaskId` (oV) - Generate unique task ID - chunks.41.mjs:2410
- `createTaskEntry` (RG) - Create task entry object - chunks.41.mjs:2418
- `registerTask` (Zf) - Register task in state - chunks.90.mjs:3019
- `atomicUpdateTask` (i9) - Generic task state updater - chunks.90.mjs:3003
- `removeTask` (VR) - Remove completed task - chunks.90.mjs:3037
- `getRunningTasks` (EV8) - Get all running tasks - chunks.90.mjs:3053
- `pollTaskOutputs` (wY4) - Poll task output files - chunks.90.mjs:3058
- `isTerminalTaskStatus` (LJ6) - Check if status is terminal - chunks.41.mjs:2402
- `killLocalBashTask` (wQ6) - Kill local bash task - chunks.95.mjs:1918
- `killBashTasksForAgent` (t24) - Kill bash tasks for agent - chunks.95.mjs:1938

> **CORRECTIONS:**
> - `wd7` and `zd7` were incorrectly documented as `createForegroundTask` and `createAsyncTask`.
>   These symbols are actually crypto module exports (chunks.72.mjs).
> - `yjA` and `CjA` were incorrectly documented as `markTaskCompleted` and `markTaskFailed`.
>   These symbols are actually constants: 67108864 and 5242880 (chunks.15.mjs).
> - `na` was incorrectly documented as `killTask`. Task killing is handled by `wQ6` for bash tasks.

---

## Task State Machine

### States

```
┌──────────────────────────────────────────────────────────────────┐
│                         Task States                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CREATED (foreground)          CREATED (background)              │
│       │                               │                          │
│       │ [User requests background]    │ [Agent runs]             │
│       ↓                               ↓                          │
│  BACKGROUNDED ─────────────────▶ RUNNING                        │
│                                       │                          │
│                      ┌────────────────┼────────────────┐         │
│                      ↓                ↓                ↓         │
│                 COMPLETED          FAILED            KILLED      │
│                      │                │                │         │
│                      └────────────────┴────────────────┘         │
│                                       ↓                          │
│                               REMOVED (cleaned up)               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### State Data Structure

```typescript
interface TaskState {
    taskId: string;
    agentId: string;
    status: "pending" | "running" | "completed" | "failed" | "killed" | "backgrounded";
    description: string;
    toolUseId: string;
    startTime: number;
    outputFile: string;
    outputOffset: number;
    notified: boolean;
    // For bash tasks:
    type: "local_bash" | "local_agent" | "remote_agent" | "in_process_teammate" | "local_workflow";
    shellCommand?: ShellCommand;
    cleanupTimeoutId?: number;
    unregisterCleanup?: () => void;
    // For agent tasks:
    prompt?: string;
    worktreePath?: string;
}
```

**Note:** In v2.1.76, `activeForm` has been removed from the task state schema. Previously this field was required but is no longer part of task creation.

---

## generateTaskId (oV)

### What it does

Generates a unique identifier for a task, prefixed based on task type to make IDs more identifiable.

### How it works

```javascript
// ============================================
// generateTaskId - Generate unique task ID with type prefix
// Location: chunks.41.mjs:2410-2415
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Get prefix for task type (b=bash, a=agent, r=remote, t=teammate, w=workflow)
    let prefix = getTaskTypePrefix(taskType);  // k$3
    // Generate 8 random bytes
    let randomBytes = crypto.randomBytes(8);    // N$3
    // Build ID: prefix + 8 alphanumeric chars
    let id = prefix;
    for (let i = 0; i < 8; i++) {
        id += ALPHANUMERIC[randomBytes[i] % ALPHANUMERIC.length];  // G97 = "0123456789abcdefghijklmnopqrstuvwxyz"
    }
    return id;
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHANUMERIC
```

### ID Prefixes

| Task Type | Prefix | Example ID |
|-----------|--------|------------|
| local_bash | b | b3f8c2e1 |
| local_agent | a | a4d5e6f7 |
| remote_agent | r | r1a2b3c4 |
| in_process_teammate | t | t5e6d7c8 |
| local_workflow | w | w9f8e7d6 |

---

## createTaskEntry (RG)

### What it does

Creates a new task entry object with initial state set to "pending".

### How it works

```javascript
// ============================================
// createTaskEntry - Create new task entry with initial state
// Location: chunks.41.mjs:2418-2429
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        status: "pending",
        description: K,
        toolUseId: Y,
        startTime: Date.now(),
        outputFile: g2(A),
        outputOffset: 0,
        notified: !1
    }
}

// READABLE (for understanding):
function createTaskEntry(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,
        type: taskType,
        status: "pending",
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        outputFile: buildOutputFilePath(taskId),  // g2
        outputOffset: 0,
        notified: false
    };
}

// Mapping: RG→createTaskEntry, A→taskId, q→taskType, K→description, Y→toolUseId, g2→buildOutputFilePath
```

---

## registerTask (Zf)

### What it does

Registers a task in the application state and emits a task_started system reminder.

### How it works

```javascript
// ============================================
// registerTask - Register task in state and emit notification
// Location: chunks.90.mjs:3019-3034
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
function registerTask(taskEntry, setAppState) {
    // Add task to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskEntry.id]: taskEntry
        }
    }));

    // Emit system reminder for task started
    emitSystemReminder({
        type: "system",
        subtype: "task_started",
        task_id: taskEntry.id,
        tool_use_id: taskEntry.toolUseId,
        description: taskEntry.description,
        task_type: taskEntry.type,
        prompt: "prompt" in taskEntry ? taskEntry.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→taskEntry, q→setAppState, c36→emitSystemReminder
```

**Key insight:** Task registration is a two-step process: first update the state, then emit a system reminder. This ensures the UI can react to the new task immediately.

---

## atomicUpdateTask (i9)

### What it does

Atomically updates a specific task's state using a transformer function. This is the core function for all task state modifications.

### How it works

```javascript
// ============================================
// atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3016
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
function atomicUpdateTask(taskId, setAppState, transformer) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task not found, no change

        let updatedTask = transformer(task);
        if (updatedTask === task) return state;  // No actual change

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→transformer
```

### Usage Patterns

```javascript
// Mark task as running
atomicUpdateTask(taskId, setAppState, (task) => ({
    ...task,
    status: "running"
}));

// Mark task as completed
atomicUpdateTask(taskId, setAppState, (task) => ({
    ...task,
    status: "completed",
    endTime: Date.now()
}));

// Update progress message
atomicUpdateTask(taskId, setAppState, (task) => ({
    ...task,
    progressMessage: "Processing file 5/10"
}));
```

**Why this approach:** The atomic update pattern ensures:
1. **Immutability** - State is never mutated directly
2. **Optimization** - Returns unchanged state if transformer returns same object
3. **Safety** - Missing tasks don't cause errors
4. **Consistency** - All task updates go through the same path

---

## removeTask (VR)

### What it does

Removes a completed task from the state registry. Only removes tasks that are in a terminal state and have been notified.

### How it works

```javascript
// ============================================
// removeTask - Remove completed task from registry
// Location: chunks.90.mjs:3037-3050
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
        if (!task) return state;

        // Only remove terminal tasks that have been notified
        if (!isTerminalTaskStatus(task.status)) return state;  // LJ6
        if (!task.notified) return state;

        // Destructure to remove task from tasks object
        let { [taskId]: removed, ...remainingTasks } = state.tasks;
        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, LJ6→isTerminalTaskStatus
```

**Why the guards:** Tasks can only be removed if:
1. They exist in the registry
2. They are in a terminal state (completed, failed, killed)
3. They have been notified (user has seen the result)

This prevents premature removal of running tasks or hiding results the user hasn't seen.

---

## isTerminalTaskStatus (LJ6)

### What it does

Checks if a task status represents a terminal (final) state.

### How it works

```javascript
// ============================================
// isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" || status === "failed" || status === "killed";
}

// Mapping: LJ6→isTerminalTaskStatus, A→status
```

**Terminal states:**
- `completed` - Task finished successfully
- `failed` - Task encountered an error
- `killed` - Task was manually terminated

Non-terminal states (`pending`, `running`, `backgrounded`) are not terminal.

---

## getRunningTasks (EV8)

### What it does

Returns all tasks currently in the "running" state.

### How it works

```javascript
// ============================================
// getRunningTasks - Get all running tasks
// Location: chunks.90.mjs:3053-3056
// ============================================

// ORIGINAL (for source lookup):
function EV8(A) {
    let q = A.tasks ?? {};
    return Object.values(q).filter((K) => K.status === "running")
}

// READABLE (for understanding):
function getRunningTasks(appState) {
    let tasks = appState.tasks ?? {};
    return Object.values(tasks).filter((task) => task.status === "running");
}

// Mapping: EV8→getRunningTasks, A→appState
```

**Use case:** Used to determine which tasks need progress polling, and to check if any tasks need cleanup on session exit.

---

## pollTaskOutputs (wY4)

### What it does

Polls all running tasks' output files and returns attachments, updated offsets, and IDs of tasks that should be evicted.

### How it works

```javascript
// ============================================
// pollTaskOutputs - Poll task output files
// Location: chunks.90.mjs:3058-3084
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Skip tasks that have been notified and are in terminal state
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    continue;
                case "running":
                    break;
            }
        }

        // Poll running tasks for new output
        if (task.status === "running") {
            let result = await readTaskOutput(task.id, task.outputOffset);  // Z97
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, Z97→readTaskOutput
```

**Key insight:** This function is called periodically to:
1. Check for new output from running tasks
2. Identify completed tasks that can be evicted from the registry
3. Track output file offsets for incremental reads

---

## killLocalBashTask (wQ6)

### What it does

Kills a local bash task by terminating its shell process and marking it as killed.

### How it works

```javascript
// ============================================
// killLocalBashTask - Kill local bash task
// Location: chunks.95.mjs:1918-1936
// ============================================

// ORIGINAL (for source lookup):
function wQ6(A, q) {
    i9(A, q, (K) => {
        if (K.status !== "running" || !Gf(K)) return K;
        try {
            k(`LocalBashTask ${A} kill requested`), K.shellCommand?.kill(), K.shellCommand?.cleanup()
        } catch (Y) {
            _6(Y)
        }
        if (K.unregisterCleanup?.(), K.cleanupTimeoutId) clearTimeout(K.cleanupTimeoutId);
        return {
            ...K,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: void 0,
            cleanupTimeoutId: void 0,
            endTime: Date.now()
        }
    }), $O(A)
}

// READABLE (for understanding):
function killLocalBashTask(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running bash tasks
        if (task.status !== "running" || !isBashTask(task)) return task;

        try {
            log(`LocalBashTask ${taskId} kill requested`);
            task.shellCommand?.kill();
            task.shellCommand?.cleanup();
        } catch (err) {
            reportError(err);  // _6
        }

        // Run cleanup functions
        task.unregisterCleanup?.();
        if (task.cleanupTimeoutId) clearTimeout(task.cleanupTimeoutId);

        return {
            ...task,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: undefined,
            cleanupTimeoutId: undefined,
            endTime: Date.now()
        };
    });

    // Flush output file
    flushOutputFile(taskId);  // $O
}

// Mapping: wQ6→killLocalBashTask, i9→atomicUpdateTask, Gf→isBashTask, k→log, _6→reportError, $O→flushOutputFile
```

**Cleanup steps:**
1. Kill the shell process
2. Run shell cleanup handlers
3. Clear cleanup timeout
4. Flush output file
5. Update task status to "killed"

---

## killBashTasksForAgent (t24)

### What it does

Kills all bash tasks belonging to a specific agent. Used when an agent exits to clean up orphaned bash tasks.

### How it works

```javascript
// ============================================
// killBashTasksForAgent - Kill all bash tasks for an agent
// Location: chunks.95.mjs:1938-1941
// ============================================

// ORIGINAL (for source lookup):
function t24(A, q, K) {
    let Y = q().tasks ?? {};
    for (let [z, _] of Object.entries(Y))
        if (Gf(_) && _.agentId === A && _.status === "running") k(`killBashTasksForAgent: killing orphaned bash task ${z} (agent ${A} exiting)`), wQ6(z, K)
}

// READABLE (for understanding):
function killBashTasksForAgent(agentId, getAppState, setAppState) {
    let tasks = getAppState().tasks ?? {};

    for (let [taskId, task] of Object.entries(tasks)) {
        // Find running bash tasks for this agent
        if (isBashTask(task) && task.agentId === agentId && task.status === "running") {
            log(`killBashTasksForAgent: killing orphaned bash task ${taskId} (agent ${agentId} exiting)`);
            killLocalBashTask(taskId, setAppState);  // wQ6
        }
    }
}

// Mapping: t24→killBashTasksForAgent, A→agentId, q→getAppState, K→setAppState, Gf→isBashTask, wQ6→killLocalBashTask
```

**Use case:** When an agent loop exits (normally or abnormally), any bash tasks it spawned should be terminated to prevent orphaned processes.

---

## Task Creation Flow

The complete flow for creating a new task:

```
1. generateTaskId(taskType)
   └── Returns prefixed unique ID (e.g., "b3f8c2e1")

2. createTaskEntry(taskId, taskType, description, toolUseId)
   └── Returns task object with status="pending"

3. registerTask(taskEntry, setAppState)
   └── Adds to state.tasks
   └── Emits "task_started" system reminder

4. atomicUpdateTask(taskId, setAppState, (task) => ({...task, status: "running"}))
   └── Changes status to running when task starts execution
```

---

## Task Completion Flow

When a task completes:

```
1. atomicUpdateTask(taskId, setAppState, (task) => ({
       ...task,
       status: "completed",  // or "failed"
       endTime: Date.now(),
       summary: result.summary
   }))

2. Set task.notified = true after user sees result

3. removeTask(taskId, setAppState)
   └── Removes from registry (only if terminal + notified)
```

---

## Design Rationale

### Why Atomic Updates?

The atomic update pattern (`i9`) provides:
1. **Immutability** - State never mutated directly
2. **Optimization** - Early return if no change
3. **Safety** - Missing tasks don't cause errors
4. **Consistency** - All updates go through one path

### Why Type-Prefixed Task IDs?

Task IDs like `b3f8c2e1` or `a4d5e6f7` make debugging easier:
- Logs show task type at a glance
- Easier to correlate with agent vs bash operations
- Visual distinction in output files

### Why Notified Guard on Removal?

Tasks must be both terminal AND notified before removal:
- Prevents hiding results the user hasn't seen
- Ensures completion messages reach the UI
- Allows re-polling for attachments after notification

---

## Related Documentation

- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Agent loop execution
- [communication_and_coordination.md](./communication_and_coordination.md) - Mailbox system
- [transcript_and_resume_system.md](./transcript_and_resume_system.md) - Transcript persistence