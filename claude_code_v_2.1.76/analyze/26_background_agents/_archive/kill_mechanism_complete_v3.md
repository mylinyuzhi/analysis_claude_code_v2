# Kill Mechanism Complete V3 (Claude Code 2.1.76)

> Complete documentation of the kill mechanism for background agents including abort signal propagation, cleanup handlers, and Ctrl+F keyboard shortcut.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Background agent symbol verification

Key functions in this document:
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `E4` - registerCleanupHandler — `chunks.41.mjs`
- `wQ6` - killLocalBashTask — `chunks.95.mjs:1918`
- `t24` - killBashTasksForAgent — `chunks.95.mjs:1938`

---

## Kill Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KILL MECHANISM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Triggers
    │
    ├─── Ctrl+F ──────────────────► killAllLocalAgents (U4q)
    │                                       │
    ├─── TaskStop tool ──────────► triggerAbortSignal (x66)
    │                                       │
    └─── Process exit ──────────► Cleanup handlers (E4)
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │ Abort Signal    │
                                    │ Propagation     │
                                    └────────┬────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│ LLM API Stream  │                │  Bash Tasks     │                │  Cleanup        │
│                 │                │                 │                │  Handlers       │
│ • Abort stream  │                │ • Kill process  │                │ • Unregister    │
│ • Stop tokens   │                │ • Clean up      │                │ • Flush output  │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

---

## Core Function: triggerAbortSignal (x66)

### What it does

Gracefully aborts a running task with proper cleanup and partial result preservation.

### How it works

```
Step 1: Check if task is running
Step 2: Abort the AbortController (cancels LLM stream)
Step 3: Unregister cleanup handler (prevent double cleanup)
Step 4: Set status to "killed"
Step 5: Keep last message (for debugging)
Step 6: Clear sensitive references
Step 7: Flush output buffer (preserve partial results)
```

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal
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
        // Step 1: Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 2: Abort the AbortController
        // This propagates to:
        // - LLM API stream (stops token generation)
        // - Any child operations using the signal
        task.abortController?.abort();

        // Step 3: Unregister cleanup handler
        // Prevents cleanup from running twice:
        // 1. Here (explicit abort)
        // 2. On process exit (cleanup handler)
        task.unregisterCleanup?.();

        // Step 4: Update task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),

            // Step 5: Keep last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,

            // Step 6: Clear sensitive references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 7: Flush output buffer
    // This preserves any partial results written so far
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted, Y→task
```

### Why These Steps

| Step | Reason |
|------|--------|
| Check running | Only running tasks can be aborted |
| Abort controller | Cancels LLM API stream immediately |
| Unregister cleanup | Prevents double-cleanup on process exit |
| Keep last message | Useful for debugging interrupted tasks |
| Clear references | Memory management and security |
| Flush buffer | Preserves partial results for user |

---

## Function: killAllLocalAgents (U4q)

### What it does

Kills all running local_agent tasks. This is triggered by the Ctrl+F keyboard shortcut.

### Source Code

```javascript
// ============================================
// U4q - killAllLocalAgents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    let killCount = 0;

    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
            killCount++;
        }
    }

    return killCount;
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

### Ctrl+F Flow

```
User presses Ctrl+F
        │
        ▼
Check: Are there running background agents?
        │
        ├─── NO → Ignore keypress
        │
        └─── YES
             │
             ▼
        Show confirmation:
        "Press Ctrl+F to stop N agents"
             │
             ├─── User presses Ctrl+F again (within 2s)
             │        │
             │        ▼
             │    Call killAllLocalAgents(tasks, setAppState)
             │        │
             │        ▼
             │    For each running task:
             │        triggerAbortSignal(taskId, setAppState)
             │
             └─── Timeout (2s) → Hide confirmation
```

---

## Function: markTaskKilled (d4q)

### What it does

Sets the `notified` flag on a task to indicate the user has been notified of its status.

### Source Code

```javascript
// ============================================
// d4q - markTaskKilled
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
        // Already notified, skip
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

---

## Cleanup Handler Registration

### registerCleanupHandler (E4)

Cleanup handlers ensure tasks are killed if the process exits unexpectedly:

```javascript
// ============================================
// E4 - registerCleanupHandler
// Location: chunks.41.mjs
// ============================================

function registerCleanupHandler(cleanupFn) {
    // Register with process exit handlers
    process.on("exit", cleanupFn);
    process.on("SIGINT", cleanupFn);
    process.on("SIGTERM", cleanupFn);

    // Return unregister function
    return () => {
        process.off("exit", cleanupFn);
        process.off("SIGINT", cleanupFn);
        process.off("SIGTERM", cleanupFn);
    };
}
```

### Usage in Task Creation

```javascript
// In createBackgroundAgentTask (Qn4)
let unregisterCleanup = registerCleanupHandler(async () => {
    triggerAbortSignal(taskId, setAppState);
});

taskRecord.unregisterCleanup = unregisterCleanup;
```

---

## Bash Task Killing

### killLocalBashTask (wQ6)

For background bash commands:

```javascript
// ============================================
// wQ6 - killLocalBashTask
// Location: chunks.95.mjs:1918
// ============================================

function killLocalBashTask(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Kill the child process
        task.childProcess?.kill("SIGTERM");

        return {
            ...task,
            status: "killed",
            endTime: Date.now()
        };
    });
}
```

### killBashTasksForAgent (t24)

Kill all bash tasks associated with an agent:

```javascript
// ============================================
// t24 - killBashTasksForAgent
// Location: chunks.95.mjs:1938
// ============================================

function killBashTasksForAgent(agentId, setAppState) {
    let tasks = getAppState().tasks;

    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "bash" && task.parentAgentId === agentId) {
            killLocalBashTask(taskId, setAppState);
        }
    }
}
```

---

## Abort Signal Propagation

### How Signals Propagate

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ABORT SIGNAL PROPAGATION                             │
└─────────────────────────────────────────────────────────────────────────────┘

AbortController.abort()
        │
        ├─── LLM API Stream
        │    │
        │    └─── Stops token generation
        │         Returns partial response
        │
        ├─── Tool Execution
        │    │
        │    ├─── Bash: SIGTERM to child process
        │    ├─── File operations: Cancel pending
        │    └─── Network: Abort fetch requests
        │
        └─── Child Tasks
             │
             └─── Cascades to nested AbortControllers
```

### In Agent Loop

```javascript
// In agentLoopRunner (qh)
let abortController = isAsync
    ? new AbortController()
    : toolUseContext.abortController;

// Check for abort in message loop
for await (let event of llmMessageLoop({ ... })) {
    // Check if aborted
    if (abortController.signal.aborted) {
        throw new AbortError();
    }

    // ... process event
}
```

---

## Partial Result Preservation

### Why It Matters

When a task is killed, any partial results should be preserved:
- Tool call results already received
- Tokens already generated
- Progress made before interruption

### How It Works

```javascript
// In triggerAbortSignal
if (wasAborted) {
    flushOutputBuffer(taskId);  // Write any pending output
}

// In readOutputFileDelta
// Partial output is still readable from the file
```

---

## Key Insight

The kill mechanism is designed for **graceful degradation**:

1. **Immediate stop** - AbortController cancels LLM stream instantly
2. **Clean state** - Task status updated before returning
3. **No leaks** - Cleanup handlers properly unregistered
4. **Partial results** - Output buffer flushed for preservation
5. **Idempotent** - Safe to call multiple times

This ensures that killing a background agent never leaves the system in an inconsistent state.

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full kill mechanism documentation