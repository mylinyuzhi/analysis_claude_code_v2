# Task Lifecycle and State - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the complete lifecycle of subagent tasks, from creation to completion or failure, including state transitions, backgrounding, and cleanup.

**v2.1.76 changes:**
- Task creation no longer requires the `activeForm` field - it has been removed from the required schema

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `createForegroundTask` (wd7) - Create task with backgrounding support - chunks.89.mjs:1477
- `createAsyncTask` (zd7) - Create background task entry - chunks.89.mjs:1447
- `backgroundTask` (Hd7) - Mid-run backgrounding transition - chunks.89.mjs
- `markTaskCompleted` (yjA) - Mark task as completed - chunks.89.mjs:1422
- `markTaskFailed` (CjA) - Mark task as failed - chunks.89.mjs:1435
- `killTask` (na) - Kill a running task - chunks.89.mjs:1376
- `removeTask` ($d7) - Remove task from registry - chunks.89.mjs
- `atomicUpdateTask` (c5) - Generic task state updater - chunks.142.mjs:1662

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
    status: "running" | "completed" | "failed" | "killed" | "backgrounded";
    summary?: string;
    progressMessage?: string;
    createdAt: number;
    completedAt?: number;
    outputFilePath?: string;  // v2.1.76: included in completion state
    abortController: AbortController;
    cleanupFns: Array<() => void>;
}
```

**Note:** In v2.1.76, `activeForm` has been removed from the task state schema. Previously this field was required but is no longer part of task creation.

---

## createForegroundTask (wd7)

### What it does

Creates a foreground task that blocks until completion but can be transitioned to background execution mid-run via a `Promise.race` mechanism.

### How it works

1. **Task Registration:** Allocates a task ID and registers an entry in the global task Map
2. **Abort Controller:** Creates a task-level `AbortController` chained to the session abort signal
3. **Promise Race Setup:** Starts the agent loop in one Promise; sets up a backgrounding signal as the other race candidate
4. **Race Resolution:**
   - If the agent loop completes first → mark task completed, return result
   - If backgrounding signal fires first → transition task to background state
5. **Cleanup Registration:** Registers cleanup functions that run in the `finally` block regardless of outcome

```javascript
// ============================================
// createForegroundTask - Foreground task with mid-run backgrounding
// Location: chunks.89.mjs:1477
// ============================================

// ORIGINAL (for source lookup):
async function wd7(A, q, K, Y, z, w) {
    let H = Hd7(),
        $ = zd7(A, K);
    // ... race between agent loop and background signal ...
}

// READABLE (for understanding):
async function createForegroundTask(agentDefinition, toolUseContext, ...) {
    let backgroundSignal = createBackgroundingSignal();
    let taskEntry = createAsyncTask(agentDefinition, toolUseContext, ...);

    let agentLoopPromise = runAgentLoopToCompletion(agentDefinition, toolUseContext, ...);

    // Race: complete normally or get backgrounded
    let result = await Promise.race([
        agentLoopPromise,
        backgroundSignal
    ]);

    if (result?.type === "background") {
        // Transition to background; agent keeps running
        return {
            status: "async_launched",
            agentId: taskEntry.agentId,
            outputFile: taskEntry.outputFilePath
        };
    }

    // Normal completion
    markTaskCompleted(taskEntry.taskId, result);
    return { status: "completed", content: result.content, tokens: result.tokens };
}

// Mapping: wd7→createForegroundTask, Hd7→backgroundTask, zd7→createAsyncTask
```

---

## createAsyncTask (zd7)

### What it does

Creates a background task entry in the task registry and launches the agent loop as a detached (non-blocking) Promise.

### How it works

1. **Task Entry Creation:** Registers the task with status "running" and an output file path
2. **Detached Launch:** Calls `agentLoopRunner` in a Promise that is NOT awaited by the caller
3. **Output File:** All agent output is written to the output file; the caller polls this file for results
4. **Return Immediately:** Returns `{ status: "async_launched", agentId, outputFile }` to the caller

```javascript
// ============================================
// createAsyncTask - Background task launch
// Location: chunks.89.mjs:1447
// ============================================

// READABLE (for understanding):
function createAsyncTask(agentDefinition, toolUseContext, ...) {
    let taskId = generateTaskId();
    let agentId = generateAgentId();
    let outputFilePath = buildOutputFilePath(agentId);

    // Register in task map
    globalTaskMap.set(taskId, {
        taskId,
        agentId,
        status: "running",
        outputFilePath,
        createdAt: Date.now(),
        abortController: new AbortController()
    });

    // Launch detached - caller does NOT await this
    (async () => {
        try {
            for await (let event of agentLoopRunner({ agentDefinition, toolUseContext, ... })) {
                await appendToOutputFile(outputFilePath, event);
            }
            markTaskCompleted(taskId, { outputFilePath });
        } catch (err) {
            markTaskFailed(taskId, err);
        }
    })();

    return { status: "async_launched", agentId, outputFile: outputFilePath };
}

// Mapping: zd7→createAsyncTask
```

---

## Mid-Run Backgrounding (Hd7)

### What it does

Provides the mechanism for transitioning a foreground task to background execution without restarting the agent.

### How it works

1. The backgrounding signal is a Promise that resolves when the user requests backgrounding
2. When `Promise.race` resolves with the backgrounding signal, the foreground task handler exits
3. The agent loop's Promise continues running in the background (it was never cancelled)
4. The output is redirected from the foreground response stream to the output file

**Key insight:** The agent loop Promise started in `createForegroundTask` is still running after backgrounding. The only change is where its output goes. This is why the transition is "zero-loss" - no state is duplicated or restarted.

```javascript
// ============================================
// backgroundTask - Mid-run backgrounding signal
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
function createBackgroundingSignal(taskId) {
    return new Promise((resolve) => {
        // Listen for user "background this task" action
        registerBackgroundingListener(taskId, () => {
            resolve({ type: "background" });
        });
    });
}
```

---

## Task Completion

### markTaskCompleted (yjA)

**What it does:** Marks a task as completed and notifies listeners.

**v2.1.76 change:** Completion notification now includes `outputFilePath` when the task has an output file.

```javascript
// ============================================
// markTaskCompleted - Mark task as completed
// Location: chunks.89.mjs:1422
// ============================================

// READABLE (for understanding):
function markTaskCompleted(taskId, result) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        status: "completed",
        completedAt: Date.now(),
        // v2.1.76: outputFilePath included when present
        outputFilePath: result.outputFilePath ?? task.outputFilePath,
        summary: result.summary
    }));

    notifyTaskListeners(taskId, { type: "completed", outputFilePath: task.outputFilePath });
    runCleanupFunctions(taskId);
}

// Mapping: yjA→markTaskCompleted, c5→atomicUpdateTask
```

### markTaskFailed (CjA)

**What it does:** Marks a task as failed with an error reason.

```javascript
// ============================================
// markTaskFailed - Mark task as failed
// Location: chunks.89.mjs:1435
// ============================================

// READABLE (for understanding):
function markTaskFailed(taskId, error) {
    atomicUpdateTask(taskId, (task) => ({
        ...task,
        status: "failed",
        completedAt: Date.now(),
        errorMessage: error.message,
        errorCode: error.code
    }));

    notifyTaskListeners(taskId, { type: "failed", error });
    runCleanupFunctions(taskId);
}

// Mapping: CjA→markTaskFailed
```

---

## Task Killing

### killTask (na)

**What it does:** Kills a running task by aborting its AbortController and running cleanup.

### How it works

1. Look up task in global task Map
2. Call `task.abortController.abort()` - propagates to LLM requests and tool executions
3. Wait for the agent loop to finish processing the abort (yield the event loop once)
4. Run cleanup functions
5. Remove from task map via `removeTask`

**Three-layer cleanup:**
1. **Global set** (`vR6`): tracks all active tasks for session-level cleanup
2. **Task-level**: runs cleanup functions registered during task creation
3. **Map-level**: removes the task entry from the global task Map

```javascript
// ============================================
// killTask - Kill a running task
// Location: chunks.89.mjs:1376
// ============================================

// READABLE (for understanding):
async function killTask(taskId) {
    let task = globalTaskMap.get(taskId);
    if (!task) return;

    // Layer 1: Signal abort to agent loop and all sub-operations
    task.abortController.abort();

    // Layer 2: Run task-level cleanup functions
    for (let cleanupFn of task.cleanupFns) {
        try { cleanupFn(); } catch {} // Best-effort cleanup
    }

    // Layer 3: Remove from registry
    globalActiveTaskSet.delete(taskId);
    globalTaskMap.delete(taskId);
}

// Mapping: na→killTask, $d7→removeTask, vR6→globalActiveTaskSet
```

---

## Task Creation Schema Changes (v2.1.76)

### Removed: activeForm Field

In v2.1.38 and earlier, task creation required an `activeForm` field that described the UI state associated with the task. In v2.1.76, this field has been removed from the required schema.

**Before (v2.1.38):**
```typescript
interface CreateTaskInput {
    taskId: string;
    agentId: string;
    activeForm: FormState;  // Required in v2.1.38
    description?: string;
}
```

**After (v2.1.76):**
```typescript
interface CreateTaskInput {
    taskId: string;
    agentId: string;
    // activeForm removed
    description?: string;
}
```

**Why this change:** The `activeForm` field was a UI concern leaking into the task management layer. Removing it decouples task lifecycle from UI state, making task creation simpler and the system easier to use from non-interactive contexts (background agents, programmatic API).

---

## Design Rationale

### Why Promise.race for Backgrounding?

**Alternative:** Poll a flag in the agent loop to check if backgrounding has been requested.

**Chosen approach:** `Promise.race` between the agent loop and a backgrounding signal.

**Why:** Promise.race provides a clean, non-invasive way to interrupt waiting. The agent loop doesn't need to know about backgrounding at all - it continues running regardless. The `createForegroundTask` wrapper is responsible for deciding how to handle the output once backgrounding occurs.

### Why Detached Promises for Background Tasks?

Background tasks are launched as detached Promises (not awaited). This means:
1. The caller returns immediately with `{ status: "async_launched" }`
2. The agent loop runs independently until completion
3. Errors in the agent loop are caught and written to the task state (not propagated to caller)

**Risk:** Unhandled Promise rejections. This is mitigated by the `try/catch` wrapper in `createAsyncTask` that catches all errors and calls `markTaskFailed`.

### Why Three-Layer Cleanup?

The three-layer cleanup (global set → task-level functions → map removal) ensures:
1. **Session teardown** - The global set allows the session to kill all tasks on exit
2. **Resource cleanup** - Task-level functions handle resources allocated during task execution (worktrees, temp files)
3. **Registry hygiene** - Map removal prevents memory leaks from accumulated task entries
