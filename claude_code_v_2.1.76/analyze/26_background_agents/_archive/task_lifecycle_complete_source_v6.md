# Task Lifecycle Complete Source V6 (Claude Code 2.1.76)

> Complete source-level documentation of background agent task lifecycle including all state transitions, error handling, and cleanup mechanisms.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `Un4` - createForegroundAgentTask — `chunks.146.mjs:2165`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `TV1` - updateTaskProgressPreservingSummary — `chunks.146.mjs:2045`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

---

## Task State Machine

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
   │ Qn4          │     │ Un4          │     │ (external)   │
   │ background   │     │ foreground   │     │ queued       │
   └──────┬───────┘     └──────┬───────┘     └──────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
                         ┌──────────────┐
                         │   running    │
                         └──────┬───────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
   │ $m8          │     │ Hm8          │     │ x66          │
   │ completed    │     │ failed       │     │ killed       │
   └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
          │                     │                     │
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ d4q          │
                         │ notified     │
                         │ = true       │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ VR           │
                         │ removed      │
                         └──────────────┘
```

---

## Task Creation

### createBackgroundAgentTask (Qn4)

**What it does**: Creates a task record for a background agent that runs asynchronously without blocking the main conversation.

**How it works**:
1. Initialize output file path
2. Create AbortController for cancellation
3. Build task record with isBackgrounded=true
4. Register cleanup handler for process exit
5. Register task in app state

**Source Code**:

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask
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
    // Step 1: Initialize output file
    // Creates directory and opens file handle
    initializeOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create AbortController
    // If parent controller provided, link to it
    // Otherwise, create standalone controller
    let abortController = parentAbortController
        ? createLinkedAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        // From base record
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),

        // Task type
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",

        // Control
        abortController: abortController,
        retrieved: false,

        // Progress tracking
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,

        // Background-specific
        isBackgrounded: true,
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    // Ensures task is killed if process exits
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Step 5: Register in state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId, O→abortController, $→taskRecord, H→unregisterCleanup
```

### createForegroundAgentTask (Un4)

**What it does**: Creates a task record for a foreground agent that may transition to background after a timeout.

**How it works**:
1. Create task record with isBackgrounded=false
2. Set up auto-background timer if specified
3. Return task record and background signal promise

**Source Code**:

```javascript
// ============================================
// Un4 - createForegroundAgentTask
// Location: chunks.146.mjs:2165-2224
// ============================================

// ORIGINAL (for source lookup):
function Un4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    autoBackgroundMs: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = sK(),
        $ = E4(async () => {
            x66(A, z)
        }),
        H = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            unregisterCleanup: $,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !1,
            pendingMessages: []
        },
        j, J = new Promise((D) => {
            j = D
        });
    lT6.set(A, j), Zf(H, z);
    let M;
    if (_ !== void 0 && _ > 0) {
        let D = setTimeout((X, P) => {
            X((Z) => {
                let G = Z.tasks[P];
                if (!Sf(G) || G.isBackgrounded) return Z;
                return {
                    ...Z,
                    tasks: {
                        ...Z.tasks,
                        [P]: {
                            ...G,
                            isBackgrounded: !0
                        }
                    }
                }
            });
            let W = lT6.get(P);
            if (W) W(), lT6.delete(P)
        }, _, z, A);
        M = () => clearTimeout(D)
    }
    return {
        taskId: A,
        backgroundSignal: J,
        cancelAutoBackground: M
    }
}

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,
    toolUseId
}) {
    // Step 1: Initialize output file
    initializeOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create AbortController
    let abortController = new AbortController();

    // Step 3: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 4: Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        unregisterCleanup: unregisterCleanup,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: false,  // Note: FALSE for foreground
        pendingMessages: []
    };

    // Step 5: Create background signal promise
    // This resolves when the task transitions to background
    let resolveBackgroundSignal;
    let backgroundSignal = new Promise((resolve) => {
        resolveBackgroundSignal = resolve;
    });
    backgroundSignalResolvers.set(agentId, resolveBackgroundSignal);

    // Step 6: Register in state
    registerTask(taskRecord, setAppState);

    // Step 7: Set up auto-background timer
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timeoutId = setTimeout((setAppState, taskId) => {
            // Transition to background
            setAppState((state) => {
                let task = state.tasks[taskId];
                if (!isLocalAgentTask(task) || task.isBackgrounded) return state;
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...task,
                            isBackgrounded: true
                        }
                    }
                };
            });

            // Resolve background signal
            let resolver = backgroundSignalResolvers.get(taskId);
            if (resolver) resolver();
            backgroundSignalResolvers.delete(taskId);
        }, autoBackgroundMs, setAppState, agentId);

        cancelAutoBackground = () => clearTimeout(timeoutId);
    }

    return {
        taskId: agentId,
        backgroundSignal: backgroundSignal,
        cancelAutoBackground: cancelAutoBackground
    };
}

// Mapping: Un4→createForegroundAgentTask, j→resolveBackgroundSignal, J→backgroundSignal, M→cancelAutoBackground
```

---

## Task Completion

### markTaskCompleted ($m8)

**What it does**: Transitions a running task to completed status with the result.

**Source Code**:

```javascript
// ============================================
// $m8 - markTaskCompleted
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
function markTaskCompleted(agentResult, setAppState) {
    let agentId = agentResult.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        // Only transition running tasks
        if (task.status !== "running") return task;

        // Unregister cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: agentResult,
            endTime: Date.now(),

            // Keep only last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,

            // Clear sensitive references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output buffer
    flushOutputBuffer(agentId);
}

// Mapping: $m8→markTaskCompleted, A→agentResult, q→setAppState, K→agentId, Y→task
```

### markTaskFailed (Hm8)

**What it does**: Transitions a running task to failed status with error details.

**Source Code**:

```javascript
// ============================================
// Hm8 - markTaskFailed
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

    flushOutputBuffer(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task
```

---

## Task Termination

### triggerAbortSignal (x66)

**What it does**: Gracefully aborts a running task with cleanup and partial result preservation.

**How it works**:
1. Check if task is running
2. Abort the AbortController (cancels LLM stream)
3. Unregister cleanup handler
4. Set status to "killed"
5. Flush output buffer

**Source Code**:

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
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller
        // This propagates to LLM API and any child operations
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler
        // Prevents cleanup on process exit from double-handling
        task.unregisterCleanup?.();

        // Step 3: Update task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),

            // Keep last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,

            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer
    // Preserves partial results
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted, Y→task
```

### killAllLocalAgents (U4q)

**What it does**: Kills all running local_agent tasks (triggered by Ctrl+F shortcut).

**Source Code**:

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
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

### markTaskKilled (d4q)

**What it does**: Sets the notified flag on a task to prevent duplicate notifications.

**Source Code**:

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
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

---

## Progress Tracking

### updateTaskProgressWithTelemetry (nl4)

**What it does**: Updates task progress and sends telemetry event.

**Source Code**:

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
    let previousProgress = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture previous progress for telemetry
        previousProgress = {
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

    // Send telemetry if task was updated
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;

        sendTelemetryEvent({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState, Y→previousProgress, z→tokenCount, _→toolUseCount, w→startTime, O→toolUseId
```

### updateTaskProgressPreservingSummary (TV1)

**What it does**: Updates progress while keeping existing summary (for incremental updates).

**Source Code**:

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
function updateTaskProgressPreservingSummary(taskId, newProgress, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Preserve existing summary
        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...newProgress, summary: existingSummary }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress, K→setAppState, Y→task, z→existingSummary
```

---

## Key Insight

The task lifecycle is designed with **idempotency** in mind:

1. **State checks**: Each transition function checks if the task is in the correct state before making changes
2. **Cleanup handlers**: Properly registered and unregistered to prevent memory leaks
3. **Output preservation**: Output buffers are flushed on any terminal state
4. **Reference cleanup**: Sensitive references (AbortController, selectedAgent) are cleared on completion

This ensures that:
- Double-completion is safe (no-op)
- Process exit doesn't leave dangling tasks
- Partial results are always available
- Memory is properly released

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Source-level documentation with algorithm analysis