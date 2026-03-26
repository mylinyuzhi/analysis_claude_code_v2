# Abort Mechanism — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of the abort signal and cancellation system for subagents and background tasks.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `triggerAbortSignal` (x66) - Trigger abort signal for task — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) - Kill all running local_agent tasks — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed with notification — `chunks.146.mjs:2034`
- `createChildAbortController` (Wm) - Create child abort controller — `chunks.58.mjs:1775`
- `createAbortController` (sK) - Create new abort controller — chunks.58.mjs
- `atomicUpdateTask` (i9) - Generic task state updater — `chunks.90.mjs:3003`

---

## Overview

The abort mechanism provides **cooperative cancellation** for background tasks and subagents. It uses JavaScript's native `AbortController` and `AbortSignal` APIs to propagate cancellation signals through the task hierarchy.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Abort Signal Propagation Flow                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User Ctrl+C / Ctrl+F                                                       │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────┐                                                        │
│   │ killAllLocalAgents │                                                    │
│   │ (U4q)            │                                                      │
│   └────────┬────────┘                                                        │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │ For each running local_agent:                                 │           │
│   │   triggerAbortSignal(taskId, setAppState)                    │           │
│   └────────┬────────────────────────────────────────────────────┘           │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │ Agent Loop detects abort:                                     │           │
│   │   if (abortController.signal.aborted) {                      │           │
│   │       // Clean up and exit                                    │           │
│   │   }                                                           │           │
│   └────────┬────────────────────────────────────────────────────┘           │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │ markTaskKilled(taskId, setAppState)                          │           │
│   │   - Update status to "killed"                                │           │
│   │   - Set notified: true                                       │           │
│   │   - Trigger notification                                     │           │
│   └─────────────────────────────────────────────────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Abort Functions

### triggerAbortSignal (x66)

**What it does:** Triggers the abort signal for a specific task, causing it to stop execution gracefully.

**How it works:**

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort signal for task
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
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasRunning = true;

        // Trigger the abort controller
        task.abortController?.abort();

        // Run cleanup handler
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

    // Flush output file if task was running
    if (wasRunning) {
        flushOutputFile(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasRunning,
//          i9→atomicUpdateTask, Y→task, $O→flushOutputFile
```

**Key insight:** The function returns a boolean indicating whether the task was actually running. This is used by callers to determine if a kill operation was successful.

---

### killAllLocalAgents (U4q)

**What it does:** Sends abort signals to all running local_agent tasks simultaneously.

**How it works:**

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local_agent tasks
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

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

**Why this approach:**
- **Batch operation** - Kills all matching tasks in one call
- **Type filtering** - Only affects `local_agent` type tasks
- **Status check** - Only kills running tasks, not completed/failed

---

### markTaskKilled (d4q)

**What it does:** Marks a task as killed and ensures notification is sent to the user.

**How it works:**

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

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

**Key insight:** The `notified` flag prevents duplicate notifications when a task is killed. This is important because the kill flow may be triggered from multiple sources (Ctrl+C, TaskStop tool, timeout).

---

## Child Abort Controller Creation

### createChildAbortController (Wm)

**What it does:** Creates an AbortController that is automatically aborted when a parent controller is aborted.

**How it works:**

```javascript
// ============================================
// Wm - createChildAbortController - Create child abort controller
// Location: chunks.58.mjs:1775-1786
// ============================================

// ORIGINAL (for source lookup):
function Wm(A, q) {
    let K = sK(q);
    if (A.signal.aborted) return K.abort(A.signal.reason), K;
    let Y = new WeakRef(K),
        z = new WeakRef(A),
        _ = pp3.bind(z, Y);
    return A.signal.addEventListener("abort", _, {
        once: !0
    }), K.signal.addEventListener("abort", Qp3.bind(z, new WeakRef(_)), {
        once: !0
    }), K
}

// READABLE (for understanding):
function createChildAbortController(parentController, options) {
    // Create new controller
    let childController = createAbortController(options);

    // If parent already aborted, abort child immediately
    if (parentController.signal.aborted) {
        childController.abort(parentController.signal.reason);
        return childController;
    }

    // Set up propagation: when parent aborts, child aborts
    let childRef = new WeakRef(childController);
    let parentRef = new WeakRef(parentController);

    let abortHandler = function(childRef, parentRef) {
        let child = childRef.deref();
        let parent = parentRef.deref();
        if (child && parent) {
            child.abort(parent.signal.reason);
        }
    }.bind(null, childRef, parentRef);

    // Add listener to parent
    parentController.signal.addEventListener("abort", abortHandler, {
        once: true
    });

    // Clean up listener when child aborts
    childController.signal.addEventListener("abort", function(parentRef, handlerRef) {
        let parent = parentRef.deref();
        let handler = handlerRef.deref();
        if (parent && handler) {
            parent.signal.removeEventListener("abort", handler);
        }
    }.bind(null, parentRef, new WeakRef(abortHandler)), {
        once: true
    });

    return childController;
}

// Mapping: Wm→createChildAbortController, A→parentController, q→options,
//          K→childController, sK→createAbortController
```

**Why WeakRefs:**
- **Memory safety** - Prevents memory leaks if controllers are garbage collected
- **Automatic cleanup** - References don't prevent GC
- **Safe dereferencing** - Can handle null cases gracefully

---

## Abort Signal Propagation Chain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Parent-Child Abort Chain                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Parent Session AbortController
        │
        │ abort()
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Background Agent AbortController                          │
│                    (created via Wm)                                          │
│                                                                              │
│  • Inherits abort signal from parent                                         │
│  • Can be aborted independently                                              │
│  • Automatically aborts when parent aborts                                   │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        │ abort()
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop Checks                                         │
│                                                                              │
│  while (!abortController.signal.aborted) {                                  │
│      // Process messages...                                                  │
│  }                                                                           │
│                                                                              │
│  if (abortController.signal.aborted) {                                      │
│      // Clean up resources                                                   │
│      // Exit gracefully                                                      │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cooperative Cancellation Pattern

### What it does

The agent loop checks the abort signal between operations, allowing in-progress work to complete before stopping.

### Implementation Pattern

```javascript
// ============================================
// Cooperative Cancellation Pattern in Agent Loop
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner(context) {
    let abortController = context.abortController;

    while (!abortController.signal.aborted) {
        try {
            // Get next message
            let message = await getNextMessage(context);

            // Check abort before processing
            if (abortController.signal.aborted) {
                break;
            }

            // Process message
            yield message;

        } catch (error) {
            // Check if error was caused by abort
            if (abortController.signal.aborted) {
                yield {
                    type: "aborted",
                    reason: abortController.signal.reason
                };
                break;
            }
            throw error;
        }
    }

    // Cleanup on exit
    yield {
        type: "finished",
        reason: abortController.signal.aborted ? "aborted" : "complete"
    };
}
```

**Why this approach:**
- **Graceful termination** - In-progress tool calls complete
- **No data loss** - Output is preserved
- **Clean state** - Resources are properly released

---

## Kill Flow Integration

### Ctrl+C / Ctrl+F Handler Flow

```
User presses Ctrl+C or Ctrl+F
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Check: hasRunningAgents?                                  │
│                                                                              │
│  hasRunningAgents = tasks.some(t =>                                         │
│      t.type === "local_agent" && t.status === "running"                     │
│  )                                                                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │ false                       │ true
              ▼                             ▼
┌─────────────────────────┐    ┌─────────────────────────────────────────────┐
│ Normal Ctrl+C behavior  │    │ Kill All Running Agents                     │
│ (cancel current stream) │    │                                             │
└─────────────────────────┘    │  1. telemetry("tengu_cancel")               │
                               │  2. U4q(tasks, setAppState)                 │
                               │     for each running local_agent:           │
                               │       x66(taskId, setAppState)              │
                               │  3. For each killed agent:                  │
                               │       d4q(taskId, setAppState)              │
                               │  4. Show notification                       │
                               └─────────────────────────────────────────────┘
```

### Source Code for UI Handler

```javascript
// ============================================
// Kill all agents handler (UI component)
// Location: chunks.193.mjs:2605-2644
// ============================================

// READABLE (for understanding):
let hasRunningAgents = useAppState((state) =>
    Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    )
);

let handleCtrlC = useCallback(() => {
    if (hasRunningAgents) {
        // Log telemetry
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Kill all local agents
        killAllLocalAgents(tasks, setAppState);
        clearActiveTaskState();

        // Mark as killed and collect descriptions
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // Show user notification
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
}, [hasRunningAgents, tasks, setAppState]);
```

---

## Partial Results Preservation

### What it does

When a task is killed, any partial results written to the output file are preserved and included in the notification.

### Implementation

```javascript
// ============================================
// Partial results preservation on kill
// ============================================

// READABLE (for understanding):
async function killWithPartialResults(taskId, setAppState) {
    let task = getTask(taskId);

    // Read any new output before killing
    let partialOutput = await readOutputFileDelta(taskId, task.outputOffset);

    // Abort the task
    triggerAbortSignal(taskId, setAppState);

    // Update task with partial results
    atomicUpdateTask(taskId, setAppState, (t) => ({
        ...t,
        status: "killed",
        partialOutput: partialOutput,
        endTime: Date.now()
    }));

    // Include partial output in notification
    notifyTaskCompletion(taskId, task.description, "killed", partialOutput);
}
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✅ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✅ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✅ Verified |
| `Wm` | createChildAbortController | chunks.58.mjs:1775 | ✅ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✅ Verified |
| `$O` | flushOutputFile | chunks.41.mjs:2320 | ✅ Verified |

---

## Related Documents

- [task_creation_source_restored.md](./task_creation_source_restored.md) - Task creation with abort controller setup
- [kill_handlers.md](./kill_handlers.md) - Kill handler implementations
- [output_capture.md](./output_capture.md) - Output file management