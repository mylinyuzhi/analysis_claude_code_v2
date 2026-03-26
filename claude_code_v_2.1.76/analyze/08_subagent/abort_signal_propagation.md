# Abort Signal Propagation - Subagent System (Claude Code 2.1.76)

> Deep analysis of how abort signals propagate through the subagent hierarchy for graceful termination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` (killAllLocalAgents) - Kill all running local agents — chunks.146.mjs:2029
- `x66` (triggerAbortSignal) - Trigger abort signal for task — chunks.146.mjs:2012
- `d4q` (markTaskKilled) - Mark task as killed — chunks.146.mjs:2034
- `Wm` (cloneAbortController) - Create sibling abort controller — chunks.148.mjs:16
- `R61` (createChildAbortController) - Create child abort controller — chunks.6.mjs:465

---

## Overview

The abort signal system enables graceful termination of subagents when:
1. User presses Ctrl+C to kill running agents
2. User presses Ctrl+F to kill all running agents (v2.1.76)
3. TaskStop tool is called to stop a specific task
4. Parent agent's abort signal is triggered

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Main Agent AbortController                           │
│  (session-level abort, created at session start)                            │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Subagent AbortController Creation                         │
│                                                                              │
│  Synchronous subagent:                                                       │
│  abortController = toolUseContext.abortController  (shared)                 │
│                                                                              │
│  Background subagent:                                                        │
│  abortController = new AbortController()  (independent)                     │
│                                                                              │
│  Teammate subagent:                                                          │
│  abortController = cloneAbortController(parentAbortController)  (linked)    │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Abort Signal Listeners                                    │
│                                                                              │
│  Each subagent registers listeners on abortController.signal:               │
│  1. LLM stream abort (stop receiving tokens)                                │
│  2. Tool execution abort (interrupt running tools)                          │
│  3. Cleanup handlers (deregister hooks, close files)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AbortController Creation Patterns

### Pattern 1: Shared Controller (Synchronous Subagent)

```javascript
// ============================================
// Shared AbortController - Synchronous subagent
// Location: chunks.133.mjs:1634
// ============================================

// ORIGINAL (for source lookup):
r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController

// READABLE (for understanding):
let abortController = override?.abortController
    ? override.abortController
    : isAsync
        ? new AbortController()  // Background: independent
        : toolUseContext.abortController;  // Sync: shared with parent

// Mapping: r→abortController, $→override, z→isAsync, K→toolUseContext
```

**Why shared:** Synchronous subagents should abort when their parent aborts because they're blocking the parent's execution.

### Pattern 2: Independent Controller (Background Subagent)

```javascript
// ============================================
// Independent AbortController - Background subagent
// Location: chunks.146.mjs:2133-2162
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
    // Initialize output file
    initOutputFile(getOutputFilePath(agentId));

    // Create abort controller - linked to parent if provided
    let abortController = parentAbortController
        ? cloneAbortController(parentAbortController)
        : createAbortController();

    // Create task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId,
        prompt,
        selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,  // Key: starts as backgrounded
        pendingMessages: []
    };

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Register task in state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
// Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
// O→abortController, Wm→cloneAbortController, sK→createAbortController,
// E4→registerCleanupHandler, x66→triggerAbortSignal, Zf→registerTask, RG→createTaskRecord
```

---

## Kill Flow Implementation

### Kill All Local Agents (U4q)

```javascript
// ============================================
// U4q - Kill all running local_agent tasks
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
            // Trigger abort signal for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Trigger Abort Signal (x66)

```javascript
// ============================================
// x66 - Trigger abort signal for a task
// Location: chunks.146.mjs:2012-2028
// ============================================

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let task = setAppState.getState().tasks[taskId];
    if (!task?.abortController) return;

    // Abort the controller
    task.abortController.abort("killed");

    // Run any registered cleanup
    task.unregisterCleanup?.();
}

// The abort() call triggers all listeners registered on abortController.signal
```

### Mark Task Killed (d4q)

```javascript
// ============================================
// d4q - Mark task as killed with notification
// Location: chunks.146.mjs:2034-2042
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
        // Skip if already notified (prevent double notification)
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

---

## Complete Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+C                                  │
│                    (or Ctrl+F in v2.1.76)                                    │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Check: hasRunningAgents?                                        │
│                                                                              │
│  hasRunningAgents = tasks.some(t =>                                         │
│      t.type === "local_agent" && t.status === "running")                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼ false                       ▼ true
┌─────────────────────────┐    ┌─────────────────────────────────────────────┐
│ Normal Ctrl+C behavior  │    │ Kill All Running Agents                     │
│ (cancel current stream) │    │                                             │
└─────────────────────────┘    │  1. telemetry("tengu_cancel")               │
                               │  2. U4q(tasks, setAppState)                  │
                               │     └── for each running local_agent:       │
                               │         x66(taskId) // trigger abort        │
                               │         abortController.abort("killed")     │
                               │  3. For each killed task:                   │
                               │     a. d4q(taskId, setAppState) // killed   │
                               │     b. collect description                  │
                               │  4. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

---

## AbortController Cloning (Wm)

When a subagent needs to be aborted when its parent aborts (but can also be aborted independently), the `cloneAbortController` function creates a linked controller:

```javascript
// ============================================
// Wm - Clone abort controller for linked abort
// Location: chunks.148.mjs:16
// ============================================

// READABLE (for understanding):
function cloneAbortController(parentController) {
    let childController = new AbortController();

    // If parent aborts, child aborts too
    parentController.signal.addEventListener('abort', () => {
        childController.abort(parentController.signal.reason);
    });

    return childController;
}

// This creates a one-way link: parent abort → child abort
// But child can be aborted independently without affecting parent
```

---

## Cleanup Handler Registration (E4)

Each task can register a cleanup handler that runs when the task is killed:

```javascript
// ============================================
// Cleanup handler registration pattern
// Location: chunks.146.mjs:2159-2161
// ============================================

// ORIGINAL (for source lookup):
H = E4(async () => {
    x66(A, z)
});
$.unregisterCleanup = H;

// READABLE (for understanding):
let cleanupHandler = registerCleanupHandler(async () => {
    triggerAbortSignal(agentId, setAppState);
});
taskRecord.unregisterCleanup = cleanupHandler;

// When task is killed or completes:
taskRecord.unregisterCleanup?.();  // Runs the cleanup handler
```

---

## Abort Reason Handling

When an abort is triggered, a reason can be provided:

```javascript
// Abort reasons used in the codebase:
abortController.abort("killed");       // User killed the task
abortController.abort("timeout");      // Task exceeded timeout
abortController.abort("error");        // Unrecoverable error
abortController.abort();               // Generic abort (no reason)
```

The abort reason can be checked in abort handlers:

```javascript
abortController.signal.addEventListener('abort', () => {
    let reason = abortController.signal.reason;
    if (reason === "killed") {
        // User-initiated kill - show notification
    } else if (reason === "timeout") {
        // Timeout - may want to retry
    }
});
```

---

## Integration with Tool Execution

Tools check the abort signal during long-running operations:

```javascript
// ============================================
// Tool execution abort check pattern
// ============================================

// READABLE (for understanding):
async function executeTool(tool, input, abortSignal) {
    // Check before starting
    if (abortSignal?.aborted) {
        throw new AbortError("Tool execution cancelled");
    }

    // For long-running tools, check periodically
    let result = await someLongOperation({
        signal: abortSignal,
        onProgress: (progress) => {
            if (abortSignal?.aborted) {
                throw new AbortError("Tool execution cancelled");
            }
        }
    });

    return result;
}
```

---

## Partial Results on Kill (v2.1.76)

When a background agent is killed, partial results are preserved:

```javascript
// ============================================
// Partial results capture on kill
// ============================================

// READABLE (for understanding):
async function killWithPartialResults(taskId, setAppState) {
    let task = setAppState.getState().tasks[taskId];

    // 1. Read partial output before aborting
    let partialOutput = await readOutputFileDelta(taskId, task.outputOffset);

    // 2. Trigger abort
    triggerAbortSignal(taskId, setAppState);

    // 3. Mark as killed with partial results
    markTaskKilled(taskId, setAppState);

    // 4. Build notification with partial results
    let notification = {
        type: "task_status",
        taskId,
        status: "killed",
        deltaSummary: partialOutput || "Task was stopped before completion"
    };

    return notification;
}
```

---

## State Transitions on Abort

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Task State Machine                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   pending ──(start)──► running ──(abort)──► killed                       │
│                             │                                             │
│                             ├──(success)──► completed                     │
│                             │                                             │
│                             └──(error)───► failed                        │
│                                                                           │
│   On abort:                                                               │
│   1. abortController.abort(reason)                                       │
│   2. Cleanup handlers run                                                │
│   3. State → killed                                                      │
│   4. Partial output captured                                             │
│   5. notified = true                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

### Verified Symbol Locations

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `Wm` | cloneAbortController | chunks.148.mjs:16 | ✓ Verified |
| `R61` | createChildAbortController | chunks.6.mjs:465 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |

---

## Related Documents

- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Agent loop execution details
- [task_lifecycle_and_state.md](./task_lifecycle_and_state.md) - Task state management
- [../26_background_agents/kill_handlers.md](../26_background_agents/kill_handlers.md) - Kill handler implementations
- [../26_background_agents/task_lifecycle.md](../26_background_agents/task_lifecycle.md) - Background task lifecycle