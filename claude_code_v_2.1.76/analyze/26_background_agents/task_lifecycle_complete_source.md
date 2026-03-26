# Task Lifecycle Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level analysis of the task lifecycle system for background agents, including task creation, state management, progress tracking, and termination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createTaskId` (oV) - Generate unique task ID with type prefix — `chunks.41.mjs:2410`
- `createTaskRecord` (RG) - Create task entry object — `chunks.41.mjs:2418`
- `createBackgroundAgentTask` (Qn4) - Create background agent task — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) - Create foreground agent task — `chunks.146.mjs:2165`
- `atomicUpdateTask` (i9) - Generic task state updater — `chunks.90.mjs:3003`
- `registerTask` (Zf) - Register task in state — `chunks.90.mjs:3019`
- `removeTask` (VR) - Remove completed task — `chunks.90.mjs:3037`
- `triggerAbortSignal` (x66) - Trigger abort signal for task — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) - Kill all running agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `markTaskCompleted` ($m8) - Mark task completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task failed — `chunks.146.mjs:2117`
- `updateTaskProgressWithTelemetry` (nl4) - Update progress with telemetry — `chunks.146.mjs:2059`

---

## Task ID Generation

### Algorithm: createTaskId (oV)

**What it does:** Creates unique, type-prefixed identifiers for all background tasks.

**How it works:**
1. `getTypePrefix(taskType)` looks up the prefix from `TASK_TYPE_PREFIXES` map
2. `generateRandomBytes(8)` creates 8 cryptographically random bytes
3. For each byte, select a character from the charset "0123456789abcdefghijklmnopqrstuvwxyz"
4. Combine: `{prefix}{8-random-chars}` (e.g., "a3f4b2x9")

### Source Code

```javascript
// ============================================
// createTaskId - Generates prefixed task identifier
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
function createTaskId(taskType) {
    let prefix = getTypePrefix(taskType);  // "a", "b", "r", "t", "w"
    let randomBytes = generateRandomBytes(8);
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }
    return taskId;  // e.g. "a3f9c2x7" for a local_agent
}

// Mapping: oV→createTaskId, k$3→getTypePrefix, N$3→generateRandomBytes, G97→CHARSET
```

### Type Prefix Map

| taskType | prefix | Example ID |
|----------|--------|-----------|
| `local_agent` | `a` | `a3f9c2x7` |
| `local_bash` | `b` | `b7c4e1m2` |
| `remote_agent` | `r` | `r2a8f0k5` |
| `in_process_teammate` | `t` | `t5d3b9n4` |
| `local_workflow` | `w` | `w1x2y3z4` |

**Why this approach:**
- **Visual identification:** Single-character prefix enables quick identification in logs and UI
- **Collision resistance:** 36^8 = ~2.8 trillion combinations per prefix
- **File-friendly:** Alphanumeric IDs work as filename components

---

## Task Record Creation

### createTaskRecord (RG)

```javascript
// ============================================
// createTaskRecord - Constructs the initial task state object
// Location: chunks.41.mjs:2418-2429
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A, type: q, status: "pending", description: K,
        toolUseId: Y, startTime: Date.now(),
        outputFile: g2(A), outputOffset: 0, notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id:           taskId,
        type:         taskType,
        status:       "pending",          // initial state
        description:  description,
        toolUseId:    toolUseId,          // links to tool use that spawned this
        startTime:    Date.now(),
        outputFile:   getOutputFilePath(taskId),  // ~/.claude/tasks/{taskId}.output
        outputOffset: 0,                  // byte cursor for incremental reads
        notified:     false               // guard: ensures notification fires only once
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId, g2→getOutputFilePath
```

### Extended Task Record Fields

Additional fields added by spawn handlers:

| Field | Type | Description |
|-------|------|-------------|
| `agentId` | string | Unique agent identifier for local agents |
| `prompt` | string | The task prompt for agents |
| `selectedAgent` | object | Agent type definition |
| `agentType` | string | Agent type name (e.g., "general-purpose") |
| `abortController` | AbortController | Controller for kill/abort |
| `unregisterCleanup` | function | Removes the process-exit handler |
| `isBackgrounded` | boolean | `true` if running as background task |
| `background` | boolean | `true` if explicitly started with `run_in_background=true` (v2.1.76) |
| `retrieved` | boolean | Whether TaskOutput has retrieved this task |
| `lastReportedToolCount` | number | Last reported tool use count |
| `lastReportedTokenCount` | number | Last reported token count |
| `progress` | object | `{ toolUseCount, tokenCount, lastActivity, recentActivities }` |
| `result` | object | Set on completion |
| `error` | string | Set on failure |
| `endTime` | number | Timestamp when task ended |
| `pendingMessages` | array | Messages queued for background agents |

---

## Background Agent Task Creation

### createBackgroundAgentTask (Qn4)

**What it does:** Creates a task record for a background agent that runs asynchronously from the start.

**How it works:**
1. Initialize output file
2. Create child AbortController (linked to parent if provided)
3. Build task record with `isBackgrounded: true`
4. Register cleanup handler for process exit
5. Register task in app state

### Source Code

```javascript
// ============================================
// createBackgroundAgentTask - Create background agent task
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
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create AbortController (linked to parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
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
        isBackgrounded: true,  // Key difference from foreground
        pendingMessages: []
    };

    // Step 4: Register cleanup handler (kills task on process exit)
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    task.unregisterCleanup = unregisterCleanup;

    // Step 5: Register task in app state
    registerTask(task, setAppState);

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          Co→initOutputFile, L0→getOutputFilePath, X$→getTasksDir, Wm→createChildAbortController,
//          sK→new AbortController, RG→createTaskRecord, E4→registerCleanupHandler,
//          x66→triggerAbortSignal, Zf→registerTask
```

---

## Foreground Agent Task Creation

### createForegroundAgentTask (Un4)

**What it does:** Creates a task record for a foreground agent that can transition to background mid-execution.

**How it works:**
1. Initialize output file
2. Create new AbortController (not linked to parent)
3. Build task record with `isBackgrounded: false`
4. Register cleanup handler
5. Set up auto-background timer if specified
6. Create background signal promise for mid-run backgrounding
7. Register task in app state
8. Return task info with background signal

### Source Code

```javascript
// ============================================
// createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2226
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
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create new AbortController (independent)
    let abortController = new AbortController();

    // Step 3: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 4: Build task record with isBackgrounded: false
    let task = {
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
        isBackgrounded: false,  // Key difference from background
        pendingMessages: []
    };

    // Step 5: Create background signal promise
    let resolveBackgroundSignal;
    let backgroundSignal = new Promise((resolve) => {
        resolveBackgroundSignal = resolve;
    });

    // Store resolver for mid-run backgrounding
    backgroundSignalResolvers.set(agentId, resolveBackgroundSignal);

    // Step 6: Register task in app state
    registerTask(task, setAppState);

    // Step 7: Set up auto-background timer if specified
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timeoutId = setTimeout((setAppState, taskId) => {
            // Auto-background the task
            setAppState((state) => {
                let task = state.tasks[taskId];
                if (!isTaskRunning(task) || task.isBackgrounded) return state;
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
            if (resolver) {
                resolver();
                backgroundSignalResolvers.delete(taskId);
            }
        }, autoBackgroundMs, setAppState, agentId);

        cancelAutoBackground = () => clearTimeout(timeoutId);
    }

    // Step 8: Return task info with background signal
    return {
        taskId: agentId,
        backgroundSignal: backgroundSignal,
        cancelAutoBackground: cancelAutoBackground
    };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId,
//          sK→new AbortController, lT6→backgroundSignalResolvers, Sf→isTaskRunning
```

---

## Atomic Task State Updates

### atomicUpdateTask (i9)

**What it does:** Generic function to atomically update task state through the app state setter.

**How it works:**
1. Calls setAppState with a function that receives current state
2. Finds the task by ID
3. Applies the update function to the task
4. Returns updated state (or original if task not found or unchanged)

### Source Code

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
function atomicUpdateTask(taskId, setAppState, updateFn) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;

        let updatedTask = updateFn(task);
        if (updatedTask === task) return state;  // No change

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updateFn, Y→state, z→task, _→updatedTask
```

**Why this approach:**
- **Atomicity:** All state updates happen in a single transaction
- **Immutability:** State is never mutated directly
- **Efficiency:** Returns original state if no change

---

## Task Registration

### registerTask (Zf)

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

// Mapping: Zf→registerTask, A→task, q→setAppState, K→state
```

---

## Task Removal

### removeTask (VR)

**What it does:** Removes a completed task from state, with safety checks.

**Safety checks:**
1. Task must exist
2. Task must be in terminal state
3. Task must have been notified

### Source Code

```javascript
// ============================================
// removeTask - Remove completed task
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

        // Safety: only remove terminal tasks that have been notified
        if (!isTerminalTaskStatus(task.status)) return state;
        if (!task.notified) return state;

        // Destructure to remove task from map
        let { [taskId]: removed, ...remainingTasks } = state.tasks;

        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, K→state, Y→task,
//          LJ6→isTerminalTaskStatus, z→removed, _→remainingTasks
```

---

## Abort Signal Triggering

### triggerAbortSignal (x66)

**What it does:** Aborts a running task, calling abort controller and cleanup handlers.

**How it works:**
1. Check if task is running
2. Call abort controller's abort()
3. Call cleanup handler
4. Update state to "killed"
5. Trigger notification

### Source Code

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
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        wasRunning = true;

        // Trigger abort
        task.abortController?.abort();

        // Run cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Preserve last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Create notification if task was running
    if (wasRunning) {
        createTaskNotification(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasRunning,
//          i9→atomicUpdateTask, Y→task, $O→createTaskNotification
```

---

## Kill All Agents

### killAllLocalAgents (U4q)

```javascript
// ============================================
// killAllLocalAgents - Kill all running local_agent tasks
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

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

**Usage:** Called when user presses Ctrl+C or Ctrl+F in the TUI.

---

## Mark Task Killed

### markTaskKilled (d4q)

**What it does:** Marks a task as having been notified of kill, preventing duplicate notifications.

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
        if (task.notified) return task;  // Already notified

        return {
            ...task,
            notified: true,
            // Preserve last message for notification
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

---

## Task Completion

### markTaskCompleted ($m8)

**What it does:** Transitions a running task to completed state with result.

### Source Code

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
function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Create notification
    createTaskNotification(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId, Y→task
```

---

## Task Failure

### markTaskFailed (Hm8)

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
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup
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

    // Create notification
    createTaskNotification(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task
```

---

## Progress Tracking

### updateTaskProgressPreservingSummary (TV1)

**What it does:** Updates progress data while preserving the summary text.

```javascript
// ============================================
// updateTaskProgressPreservingSummary - Update progress preserving summary
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
function updateTaskProgressPreservingSummary(taskId, progressData, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...progressData, summary: existingSummary }
                : progressData
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→progressData, K→setAppState
```

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates progress data and emits telemetry event.

```javascript
// ============================================
// updateTaskProgressWithTelemetry - Update progress with telemetry
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
    let previousData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture previous data for telemetry
        previousData = {
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

    // Emit telemetry if update succeeded and telemetry is enabled
    if (previousData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousData;

        emitTelemetryEvent({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          Nn→isTelemetryEnabled, c36→emitTelemetryEvent
```

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Task State Machine                                    │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌───────────┐
                              │  Created  │
                              │ (pending) │
                              └─────┬─────┘
                                    │ registerTask (Zf)
                                    ▼
                              ┌───────────┐
                 ┌────────────│  Running  │────────────┐
                 │            │           │            │
                 │            └─────┬─────┘            │
                 │                  │                  │
        mid-run  │                  │                  │  completion
        bg       │                  │                  │
                 │                  │                  │
                 ▼                  │                  ▼
        ┌─────────────┐             │           ┌───────────┐
        │ Backgrounded│             │           │ Completed │
        │ isBackground│             │           │  ($m8)    │
        │ = true      │             │           └───────────┘
        └──────┬──────┘             │
               │                    │
               │            ┌───────┴───────┐
               │            │               │
               │            ▼               ▼
               │     ┌───────────┐   ┌───────────┐
               │     │  Killed   │   │  Failed   │
               │     │   (x66)   │   │  (Hm8)    │
               │     └───────────┘   └───────────┘
               │            │               │
               │            │               │
               └────────────┴───────────────┘
                            │
                            │ removeTask (VR)
                            │ (after notified)
                            ▼
                      ┌───────────┐
                      │  Removed  │
                      └───────────┘
```

---

## Cross-Feature Integration

### System Reminder Integration
- `task_status` attachments generated from task state
- `task_progress` attachments with frequency throttling
- Notification queue for completion/failure events

### UI Integration
- Status line shows running task count
- Task list modal displays all tasks with actions
- Ctrl+C/Ctrl+F triggers kill operations

### Hooks Integration
- Cleanup handlers called on kill/complete/fail
- Process exit handlers trigger abort

### Telemetry Integration
- Progress events emitted during execution
- Duration and token usage tracked