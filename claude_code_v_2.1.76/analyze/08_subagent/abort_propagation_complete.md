# Abort Propagation Algorithm Complete (Claude Code 2.1.76)

> Deep dive into the abort signal propagation mechanism for subagents and background agents, including signal chaining, cleanup sequences, and graceful vs immediate termination.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key functions:
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `i9` - atomicUpdateTask — `chunks.90.mjs:3003`
- `$O` - flushOutputBuffer — `chunks.41.mjs:2320`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ABORT SIGNAL PROPAGATION                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   User Action       │
                    │   (Ctrl+F / UI)     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ killAllLocalAgents  │
                    │       (U4q)         │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ Task 1      │     │ Task 2      │     │ Task N      │
    │ triggerAbort│     │ triggerAbort│     │ triggerAbort│
    │   (x66)     │     │   (x66)     │     │   (x66)     │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ AbortSignal │     │ AbortSignal │     │ AbortSignal │
    │   .abort()  │     │   .abort()  │     │   .abort()  │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ LLM Stream  │     │ LLM Stream  │     │ LLM Stream  │
    │   Cancel    │     │   Cancel    │     │   Cancel    │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ Cleanup     │     │ Cleanup     │     │ Cleanup     │
    │ Handler     │     │ Handler     │     │ Handler     │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ flushOutputBuffer   │
                    │       ($O)          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ markTaskKilled      │
                    │       (d4q)         │
                    └─────────────────────┘
```

---

## Part 1: Abort Signal Creation

### Types of Abort Controllers

```javascript
// ============================================
// Abort Controller Creation Patterns
// ============================================

// Pattern 1: Standalone (for background agents)
function createStandaloneAbortController() {
    return new AbortController();
}

// Pattern 2: Linked to parent (for nested agents)
function wrapAbortController(parentController) {
    // Create child controller that aborts when parent aborts
    let childController = new AbortController();

    if (parentController) {
        // Propagate parent abort to child
        parentController.signal.addEventListener('abort', () => {
            childController.abort(parentController.signal.reason);
        });
    }

    return childController;
}

// Pattern 3: Shared (for foreground agents sharing main loop)
function shareAbortController(mainController) {
    // Return wrapper that can be independently aborted
    // but also respects main controller
    return {
        abort: (reason) => mainController.abort(reason),
        signal: mainController.signal,
        _wrapped: mainController
    };
}
```

### In Source Code

```javascript
// ============================================
// Abort Controller Creation in Qn4
// Location: chunks.146.mjs:2143
// ============================================

// ORIGINAL (for source lookup):
let O = _ ? Wm(_) : sK(),

// READABLE (for understanding):
let abortController = parentAbortController
    ? wrapAbortController(parentAbortController)
    : createStandaloneAbortController();
```

---

## Part 2: Trigger Abort Signal Algorithm

### The Algorithm

```javascript
// ============================================
// x66 - triggerAbortSignal - Complete Algorithm
// Location: chunks.146.mjs:2012-2027
// ============================================

function triggerAbortSignal(taskId, setAppState) {
    // ==========================================
    // PHASE 1: ATOMIC STATE UPDATE
    // ==========================================
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Step 1.1: Only abort running tasks
        if (task.status !== "running") {
            return task;  // No change
        }

        wasAborted = true;

        // Step 1.2: Trigger the abort signal
        // This cancels any in-flight LLM API call
        task.abortController?.abort();

        // Step 1.3: Unregister cleanup handler
        // Prevents double-cleanup when process exits
        task.unregisterCleanup?.();

        // Step 1.4: Return updated state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),

            // Keep only last message for context
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,

            // Clear runtime references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // ==========================================
    // PHASE 2: FLUSH OUTPUT BUFFER
    // ==========================================
    if (wasAborted) {
        // Ensure any pending output is written before cleanup
        flushOutputBuffer(taskId);
    }

    // ==========================================
    // PHASE 3: RETURN RESULT
    // ==========================================
    return wasAborted;
}
```

### Why This Design?

**Question: Why abort before unregistering cleanup?**

**Answer**: The order is critical for preventing race conditions:

1. **Abort first** → Signals LLM stream to stop
2. **Then unregister cleanup** → Prevents cleanup from running twice
3. **Then flush output** → Ensures partial results are preserved

If cleanup were unregistered first, a concurrent process exit could leave the output buffer unflushed.

---

## Part 3: Kill All Local Agents Algorithm

### The Algorithm

```javascript
// ============================================
// U4q - killAllLocalAgents - Complete Algorithm
// Location: chunks.146.mjs:2029-2032
// ============================================

function killAllLocalAgents(tasks, setAppState) {
    // ==========================================
    // ITERATE AND KILL
    // ==========================================
    for (let [taskId, task] of Object.entries(tasks)) {
        // Step 1: Filter for local_agent + running
        if (task.type === "local_agent" && task.status === "running") {
            // Step 2: Trigger abort for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }

    // Note: This is synchronous - all aborts happen immediately
    // The actual cleanup (flushOutputBuffer) happens inside triggerAbortSignal
}
```

### Why Not Parallel?

**Question: Why sequential iteration instead of Promise.all?**

**Answer**: The abort operations are intentionally synchronous:

1. **Atomic state updates** — `setAppState` is a synchronous state setter
2. **No async work needed** — `abort()` is synchronous
3. **Deterministic order** — Tasks are killed in consistent order
4. **Simpler error handling** — No partial failure states

---

## Part 4: Cleanup Sequence

### Cleanup Handler Registration

```javascript
// ============================================
// Cleanup Handler Registration (in Qn4)
// Location: chunks.146.mjs:2159-2161
// ============================================

// ORIGINAL:
let H = E4(async () => {
    x66(A, z)
});
return $.unregisterCleanup = H, Zf($, z), $

// READABLE:
let cleanupHandler = registerCleanupHandler(async () => {
    triggerAbortSignal(agentId, setAppState);
});
taskRecord.unregisterCleanup = cleanupHandler;
registerTask(taskRecord, setAppState);
return taskRecord;
```

### When Cleanup Fires

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLEANUP TRIGGERS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. User-initiated kill (Ctrl+F)
   ┌───────────────────────────────────────────────────────────────────────┐
   │ killAllLocalAgents()                                                  │
   │   → triggerAbortSignal()                                              │
   │     → unregisterCleanup() ← Cleanup handler skipped (already killing) │
   │     → flushOutputBuffer()                                             │
   └───────────────────────────────────────────────────────────────────────┘

2. Process exit (SIGINT/SIGTERM)
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Process signal handler                                                │
   │   → All registered cleanup handlers fire                              │
   │   → triggerAbortSignal() called for each task                         │
   │   → Output flushed before exit                                        │
   └───────────────────────────────────────────────────────────────────────┘

3. Task completion (natural)
   ┌───────────────────────────────────────────────────────────────────────┐
   │ markTaskCompleted() / markTaskFailed()                                │
   │   → unregisterCleanup() ← Remove handler (no longer needed)           │
   │   → flushOutputBuffer()                                               │
   └───────────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Abort Signal Propagation Through LLM Loop

### LLM Message Loop Abort Handling

```javascript
// ============================================
// Abort Handling in LLM Loop
// Location: chunks.133.mjs:1747+
// ============================================

async function* llmMessageLoop({ messages, systemPrompt, abortSignal, ... }) {
    // Check abort at loop entry
    if (abortSignal?.aborted) {
        return;  // Exit immediately
    }

    // Stream from LLM API
    for await (let event of streamMessages({ ... })) {
        // Check abort before each event
        if (abortSignal?.aborted) {
            // Clean up stream
            await cancelStream();
            return;
        }

        yield event;
    }
}
```

### Tool Executor Abort Handling

```javascript
// ============================================
// ui6 - ToolExecutor - Abort Handling
// Location: chunks.148.mjs:160+
// ============================================

class ToolExecutor {
    // ...

    async executeTool(tool) {
        // Check sibling abort (parallel tool error)
        if (this.siblingAbortController.signal.aborted) {
            // Create synthetic error result
            tool.results = [this.createSyntheticErrorMessage(
                tool.block.id,
                "sibling_error",
                tool.assistantMessage
            )];
            tool.status = "completed";
            return;
        }

        // Execute tool
        try {
            let result = await this.canUseTool(tool.block, async () => {
                return await toolDef.call(toolInput, this.toolUseContext, ...);
            });

            // ... handle result
        } catch (error) {
            if (error.name === "AbortError") {
                // Tool was aborted
                tool.results = [this.createSyntheticErrorMessage(
                    tool.block.id,
                    "user_interrupted",
                    tool.assistantMessage
                )];
            }
            // ...
        }
    }
}
```

---

## Part 6: Graceful vs Immediate Termination

### Graceful Termination (Default)

```javascript
// Graceful: Allow current tool to complete, then stop
// Used when: Background agent, normal cancellation

async function gracefulAbort(taskId) {
    // 1. Signal abort (stops new tool starts)
    task.abortController.abort();

    // 2. Let current tool finish
    // (Tool execution checks abort before starting)

    // 3. Wait for flush
    await flushOutputBuffer(taskId);

    // 4. Update state
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        status: "killed"
    }));
}
```

### Immediate Termination (Force Kill)

```javascript
// Immediate: Stop everything now
// Used when: Process exit, critical error

async function immediateAbort(taskId) {
    // 1. Signal abort
    task.abortController.abort("force");

    // 2. Cancel any in-flight operations
    if (task.currentWorkAbortController) {
        task.currentWorkAbortController.abort("force");
    }

    // 3. Kill any child processes
    for (let child of task.childProcesses || []) {
        child.kill("SIGKILL");
    }

    // 4. Update state immediately
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        status: "killed",
        forceKilled: true
    }));
}
```

---

## Part 7: Parent-Child Abort Propagation

### Nested Agent Abort Chaining

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PARENT-CHILD ABORT CHAIN                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Parent Agent (abortController: parentCtrl)
        │
        │ spawn child with parentAbortController: parentCtrl
        ▼
Child Agent (abortController: childCtrl)
        │
        │  childCtrl wraps parentCtrl
        │  - When parentCtrl.abort() fires → childCtrl.abort() fires
        │  - When childCtrl.abort() fires → parent unaffected
        ▼
Grandchild Agent (abortController: grandchildCtrl)
        │
        │  grandchildCtrl wraps childCtrl
        │  - When childCtrl.abort() fires → grandchildCtrl.abort() fires
        │  - When parentCtrl.abort() fires → propagates down
        ▼
Tool Execution
```

### Implementation

```javascript
// ============================================
// Parent-Child Abort Linking
// Location: chunks.146.mjs:2143
// ============================================

// In createBackgroundAgentTask (Qn4):
let abortController = parentAbortController
    ? wrapAbortController(parentAbortController)  // Linked
    : createStandaloneAbortController();          // Independent

// wrapAbortController implementation:
function wrapAbortController(parent) {
    let child = new AbortController();

    // Forward parent abort to child
    parent.signal.addEventListener('abort', () => {
        child.abort(parent.signal.reason);
    });

    // Child abort does NOT affect parent
    return child;
}
```

---

## Part 8: Edge Cases and Error Recovery

### Case 1: Abort During Tool Execution

```
Tool is executing
        │
        ▼ Abort signal received
┌───────────────────────────────────────────┐
│ Check: Is tool concurrency-safe?          │
└─────────────────────┬─────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼ Safe                      ▼ Not Safe
┌─────────────────┐         ┌─────────────────────────────────┐
│ Let tool finish │         │ Create synthetic error result   │
│ Mark as killed  │         │ Return to agent loop            │
│ after complete  │         │ Agent sees "user_interrupted"   │
└─────────────────┘         └─────────────────────────────────┘
```

### Case 2: Double Abort

```javascript
// Problem: What if abort is called twice?

// Solution: Atomic update checks status first
function triggerAbortSignal(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") {
            return task;  // Already terminal, no-op
        }
        // ... proceed with abort
    });
}

// Result: Second abort is safe, just no-ops
```

### Case 3: Abort During LLM Stream

```
LLM API streaming response
        │
        ▼ Abort signal received
┌───────────────────────────────────────────┐
│ API client catches AbortError             │
│                                           │
│ try {                                     │
│   for await (let chunk of stream) {       │
│     if (signal.aborted) throw AbortError; │
│     // ...                                │
│   }                                       │
│ } catch (e) {                             │
│   if (e.name === "AbortError") {          │
│     // Clean up                           │
│     await cancelRequest();                │
│   }                                       │
│ }                                         │
└───────────────────────────────────────────┘
```

---

## Verification Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Signal creation | ✓ | Standalone and linked patterns |
| Trigger abort | ✓ | Atomic state update + cleanup |
| Kill all | ✓ | Sequential iteration |
| Cleanup sequence | ✓ | Registered handlers fire correctly |
| LLM loop handling | ✓ | Checks abort between events |
| Tool executor | ✓ | Synthetic errors for interrupted tools |
| Parent-child chaining | ✓ | Forward propagation only |
| Edge cases | ✓ | Double-abort, stream abort handled |

---

## Related Documents

- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Key algorithms
- [kill_mechanism_complete.md](../26_background_agents/kill_mechanism_complete.md) - Kill mechanism
- [abort_signal_propagation_source_restored.md](./abort_signal_propagation_source_restored.md) - Source restoration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Algorithm fully documented