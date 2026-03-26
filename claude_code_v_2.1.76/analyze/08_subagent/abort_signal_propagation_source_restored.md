# Abort Signal Propagation - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the abort signal propagation system for subagent and background task termination.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `triggerAbortSignal` (x66) - Trigger abort for single task — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) - Kill all local_agent tasks — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `atomicUpdateTask` (i9) - Generic task state updater — `chunks.90.mjs:3003`
- `isTerminalTaskStatus` (LJ6) - Check terminal status — `chunks.41.mjs:2402`

---

## Overview

The abort signal propagation system provides graceful termination for running background tasks. It uses JavaScript's native `AbortController` pattern combined with a task-specific cleanup registry to ensure resources are properly released when a task is killed.

### Key Design Decisions

1. **AbortController-based**: Uses native JavaScript AbortController for cancellation
2. **Cleanup registry**: Each task registers cleanup handlers that run on abort
3. **Atomic state updates**: State changes are atomic to prevent race conditions
4. **Notification guard**: `notified` flag prevents duplicate notifications

---

## Abort Signal Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Kill Request                                          │
│  (Ctrl+C, Ctrl+F, TaskStop tool, or killAllLocalAgents)                     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    triggerAbortSignal (x66)                                   │
│                                                                              │
│  1. atomicUpdateTask(taskId, updater)                                        │
│  2. Check: status === "running"?                                             │
│  3. If running:                                                              │
│     a. abortController.abort() → signals all async operations               │
│     b. unregisterCleanup() → runs registered cleanup handlers               │
│     c. Set status = "killed"                                                 │
│     d. Truncate messages to last only                                        │
│  4. If killed: notifyCompletion($O)                                          │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    markTaskKilled (d4q)                                       │
│                                                                              │
│  1. atomicUpdateTask(taskId, updater)                                        │
│  2. Check: task.notified? (skip if already notified)                        │
│  3. Set notified = true                                                      │
│  4. Truncate messages to last only                                           │
│  (Does NOT call abortController - assumes already aborted)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code - Core Functions

### triggerAbortSignal (x66)

**What it does:** Triggers abort for a single task, running cleanup and updating state.

**Location:** chunks.146.mjs:2012-2027

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a running task
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

        // 1. Trigger abort signal (propagates to all async operations)
        task.abortController?.abort();

        // 2. Run cleanup handlers (removes process.exit handlers, etc.)
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // 3. Notify completion if aborted
    if (wasAborted) {
        notifyCompletion(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask,
// $O→notifyCompletion, Y→task
```

### killAllLocalAgents (U4q)

**What it does:** Iterates all tasks and kills running local_agent tasks.

**Location:** chunks.146.mjs:2029-2032

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all local_agent tasks
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
        // Only kill local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal,
// K→taskId, Y→task
```

### markTaskKilled (d4q)

**What it does:** Marks a task as killed without triggering abort. Used when the task is already being killed elsewhere.

**Location:** chunks.146.mjs:2034-2043

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed (notification only)
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
        // Skip if already notified (prevent duplicate notifications)
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task, i9→atomicUpdateTask
```

---

## Atomic Task Update (i9)

**What it does:** Generic atomic task state updater using React-style setState pattern.

**Location:** chunks.90.mjs:3003-3017

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomic task state update
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
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist, no change

        let updatedTask = updater(task);

        // If updater returned same object, no change needed
        if (updatedTask === task) return state;

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater, Y→state, z→task
```

### Key Insight: React-Style Atomic Updates

The `i9` function uses React's setState pattern:
1. Receives current state
2. Applies updater to specific task
3. Returns new state only if changed
4. Identity comparison (`===`) prevents unnecessary re-renders

---

## Terminal Status Check (LJ6)

**What it does:** Checks if a task status is terminal (completed/failed/killed).

**Location:** chunks.41.mjs:2402-2404

```javascript
// ============================================
// LJ6 - isTerminalTaskStatus - Check terminal status
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

---

## Cleanup Handler Registration

Each background task can register cleanup handlers that run when the task is killed:

### Registration Pattern

```javascript
// When creating a background task:
let abortController = new AbortController();

// Register cleanup handler
let unregisterCleanup = registerCleanupHandler(() => {
    // Cleanup actions:
    // 1. Remove process.exit handlers
    // 2. Close file handles
    // 3. Kill child processes
    // 4. Remove temporary files
});

// Store in task record:
task.abortController = abortController;
task.unregisterCleanup = unregisterCleanup;
```

### Cleanup Handler Types

| Task Type | Cleanup Actions |
|-----------|-----------------|
| `local_agent` | Kill agent process, close output file, remove exit handlers |
| `local_bash` | Kill child process, close stdout/stderr, remove exit handlers |
| `remote_agent` | Close remote session, cleanup connection |
| `in_process_teammate` | Stop agent loop, cleanup mailbox listeners |

---

## Abort Propagation in Agent Loop

### Agent Loop Abort Handling

The agent loop (`qh` / `agentLoopRunner`) checks the abort signal at key points:

```javascript
// ============================================
// Agent loop abort check pattern
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner(config) {
    let { abortController } = config;

    while (true) {
        // Check abort before each iteration
        if (abortController.signal.aborted) {
            logDebug("Agent loop aborted");
            break;
        }

        try {
            // Process next message
            let message = await getNextMessage(abortController.signal);

            if (abortController.signal.aborted) {
                break;
            }

            yield message;

        } catch (error) {
            if (error.name === "AbortError") {
                logDebug("Agent loop received abort error");
                break;
            }
            throw error;
        }
    }
}
```

### Abort-Safe Async Operations

All long-running async operations should pass the abort signal:

```javascript
// READABLE (for understanding):
async function fetchData(url, signal) {
    // fetch supports AbortSignal natively
    let response = await fetch(url, { signal });
    return response.json();
}

async function readFileWithAbort(path, signal) {
    // Check before starting
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    let content = await fs.readFile(path);

    // Check after completion
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    return content;
}
```

---

## Kill Flow Scenarios

### Scenario 1: User Presses Ctrl+C with Running Agents

```
1. Key handler detects Ctrl+C
2. Check: hasRunningAgents = tasks.some(t => t.type === "local_agent" && t.status === "running")
3. If true:
   a. telemetry("tengu_cancel", { source: "kill_agents" })
   b. U4q(tasks, setAppState) → kills all local_agent tasks
   c. For each killed task: d4q(taskId, setAppState) → marks as notified
   d. Show notification: "N background agents were stopped by the user"
```

### Scenario 2: TaskStop Tool Call

```
1. TaskStopTool.call({ task_id: "a3f4b2" })
2. getKillHandlerForType(task.type) → returns appropriate handler
3. For local_agent: triggerAbortSignal(taskId, setAppState)
4. Task state updated to "killed"
5. Cleanup handlers run
6. Notification sent via $O(taskId)
```

### Scenario 3: Kill All (Ctrl+F in v2.1.76)

```
1. Key handler detects Ctrl+F
2. killAllLocalAgents(tasks, setAppState)
3. For each local_agent with status === "running":
   a. x66(taskId, setAppState)
   b. abortController.abort() → signals abort
   c. unregisterCleanup() → runs cleanup
   d. State updated to "killed"
4. Notifications generated for each killed task
```

---

## Integration with System Reminder

### Task Status Attachment on Kill

When a task is killed, a `task_status` attachment is generated:

```xml
<system-reminder>
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>killed</status>
  <description>Search codebase</description>
  <delta_summary>Task was stopped by the user. Partial results preserved...</delta_summary>
</task_status>
</system-reminder>
```

### Partial Results Preservation (v2.1.76)

Before marking as killed, the system reads any accumulated output:

```javascript
// READABLE (for understanding):
async function killWithPartialResults(taskId, setAppState) {
    // 1. Read any output written since last progress update
    let { content: partialOutput } = readOutputFileDelta(taskId, task.outputOffset);

    // 2. Trigger abort (runs cleanup)
    triggerAbortSignal(taskId, setAppState);

    // 3. Update task with partial results
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        partialOutput: partialOutput
    }));
}
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | ✓ Verified |
| `$O` | notifyCompletion | chunks.146.mjs | ✓ Verified (called) |

---

## Related Documents

- [kill_handlers_source_restored.md](../26_background_agents/kill_handlers_source_restored.md) - Kill handler implementations
- [task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - State machine
- [../26_background_agents/ui_interaction_complete_source.md](../26_background_agents/ui_interaction_complete_source.md) - UI kill controls