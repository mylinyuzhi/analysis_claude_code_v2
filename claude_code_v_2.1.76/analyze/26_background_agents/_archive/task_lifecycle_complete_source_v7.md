# Task Lifecycle Complete Source V7 (Claude Code 2.1.76)

> Complete source-level documentation for task lifecycle management including creation, state transitions, progress tracking, and kill/completion handling.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final_v2.md](./cross_validation_final_v2.md) - Background agent symbol verification

Key functions in this document:
- `oV` - generateTaskId — `chunks.41.mjs:2410`
- `k$3` - getTaskTypePrefix — `chunks.41.mjs:2406`
- `LJ6` - isTerminalTaskStatus — `chunks.41.mjs:2402`
- `RG` - createTaskRecord — `chunks.41.mjs:2418`
- `i9` - atomicUpdateTask — `chunks.90.mjs:3003`
- `Zf` - registerTask — `chunks.90.mjs:3019`
- `VR` - removeTask — `chunks.90.mjs:3037`
- `EV8` - getRunningTasks — `chunks.90.mjs:3053`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `Qn4` - createBackgroundAgentTask — `chunks.146.mjs:2133`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `TV1` - updateTaskProgressPreservingSummary — `chunks.146.mjs:2045`

---

## Overview

The task lifecycle system manages the entire lifecycle of background and foreground tasks from creation through completion or termination. It provides:

1. **Unique ID generation** - Type-prefixed random IDs
2. **State management** - Atomic state updates with immutability
3. **Progress tracking** - Real-time progress with telemetry
4. **Abort handling** - Graceful termination with cleanup
5. **Output capture** - Buffered file-based output

---

## Task ID Generation

### generateTaskId (oV)

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = V$3[q] ?? "x";
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get type name from task type
    let typeName = getTaskTypePrefix(taskType);

    // Step 2: Get prefix for type (e.g., "a" for local_agent)
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 3: Generate 8 cryptographically random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 4: Map each byte to a character from charset
    // charset = "0123456789abcdefghijklmnopqrstuvwxyz"
    for (let i = 0; i < 8; i++) {
        prefix += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    // Step 5: Return 9-character ID (prefix + 8 random chars)
    return prefix;
}

// Mapping: oV→generateTaskId, A→taskType, q→typeName, K→randomBytes, Y→result, V$3→TASK_TYPE_PREFIXES, G97→TASK_ID_CHARSET, N$3→crypto.getRandomValues, k$3→getTaskTypePrefix
```

### getTaskTypePrefix (k$3)

```javascript
// ============================================
// k$3 - getTaskTypePrefix - Get type name from task type
// Location: chunks.41.mjs:2406-2408
// ============================================

// ORIGINAL (for source lookup):
function k$3(A) {
    return V$3[A] ?? "x"
}

// READABLE (for understanding):
function getTaskTypePrefix(taskType) {
    // TASK_TYPE_PREFIXES maps task types to single-char prefixes
    return TASK_TYPE_PREFIXES[taskType] ?? "x";
}

// Mapping: k$3→getTaskTypePrefix, A→taskType, V$3→TASK_TYPE_PREFIXES
```

### isTerminalTaskStatus (LJ6)

```javascript
// ============================================
// LJ6 - isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}

// Mapping: LJ6→isTerminalTaskStatus, A→status
```

### Task Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task type to prefix mapping
// Location: chunks.41.mjs:2438-2444
// ============================================

// ORIGINAL (for source lookup):
V$3 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
}

// READABLE (for understanding):
TASK_TYPE_PREFIXES = {
    local_bash: "b",           // e.g., "b7x9k2m3"
    local_agent: "a",          // e.g., "a7x9k2m3"
    remote_agent: "r",         // e.g., "r7x9k2m3"
    in_process_teammate: "t",  // e.g., "t7x9k2m3"
    local_workflow: "w"        // e.g., "w7x9k2m3"
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Task ID Charset (G97)

```javascript
// ============================================
// G97 - TASK_ID_CHARSET - Character set for random ID generation
// Location: chunks.41.mjs:2434
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// READABLE (for understanding):
TASK_ID_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";

// 36 characters = 10 digits + 26 lowercase letters
// 8 random chars = 36^8 = ~2.8 trillion combinations
```

---

## Task Record Creation

### createTaskRecord (RG)

```javascript
// ============================================
// RG - createTaskRecord - Create initial task record
// Location: chunks.41.mjs:2418-2430
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
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,
        type: taskType,
        status: "pending",
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        outputFile: getOutputFilePath(taskId),  // .claude/tasks/<id>.output
        outputOffset: 0,                         // Bytes read so far
        notified: false                          // Has user been notified?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId, g2→getOutputFilePath
```

---

## Task State Management

### atomicUpdateTask (i9)

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomically update task state
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
    setAppState((appState) => {
        // Step 1: Get existing task
        let existingTask = appState.tasks?.[taskId];
        if (!existingTask) return appState; // Task doesn't exist, no change

        // Step 2: Apply updater function
        let updatedTask = updater(existingTask);

        // Step 3: If no change, return original state
        if (updatedTask === existingTask) return appState;

        // Step 4: Return new state with updated task
        return {
            ...appState,
            tasks: {
                ...appState.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater, Y→appState, z→existingTask, _→updatedTask
```

### registerTask (Zf)

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
function registerTask(taskRecord, setAppState) {
    // Step 1: Add task to state
    setAppState((appState) => ({
        ...appState,
        tasks: {
            ...appState.tasks,
            [taskRecord.id]: taskRecord
        }
    }));

    // Step 2: Send telemetry event
    sendTelemetry({
        type: "system",
        subtype: "task_started",
        task_id: taskRecord.id,
        tool_use_id: taskRecord.toolUseId,
        description: taskRecord.description,
        task_type: taskRecord.type,
        prompt: "prompt" in taskRecord ? taskRecord.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState, K→appState, c36→sendTelemetry
```

### removeTask (VR)

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
    setAppState((appState) => {
        let task = appState.tasks?.[taskId];
        if (!task) return appState;              // Doesn't exist
        if (!isTerminalTaskStatus(task.status)) return appState;  // Not terminal
        if (!task.notified) return appState;     // Not yet notified

        // Destructure to remove task from tasks object
        let { [taskId]: removed, ...remainingTasks } = appState.tasks;

        return {
            ...appState,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, K→appState, Y→task, LJ6→isTerminalTaskStatus
```

### getRunningTasks (EV8)

```javascript
// ============================================
// EV8 - getRunningTasks - Get all running tasks
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
    return Object.values(tasks).filter(task => task.status === "running");
}

// Mapping: EV8→getRunningTasks, A→appState, q→tasks, K→task
```

### pollTaskOutputs (wY4)

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll output files for all tasks
// Location: chunks.90.mjs:3058-3085
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
        // Skip notified terminal tasks (mark for eviction)
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
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments,          // New attachments to send
        updatedTaskOffsets,   // New read positions
        evictedTaskIds        // Tasks to remove from state
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets, Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

### updateTaskState (OY4)

```javascript
// ============================================
// OY4 - updateTaskState - Apply poll results to state
// Location: chunks.90.mjs:3087-3109
// ============================================

// ORIGINAL (for source lookup):
function OY4(A, q, K) {
    let Y = Object.keys(q);
    if (Y.length === 0 && K.length === 0) return;
    A((z) => {
        let _ = !1,
            w = {
                ...z.tasks
            };
        for (let O of Y) {
            let $ = w[O];
            if ($?.status === "running") w[O] = {
                ...$,
                outputOffset: q[O]
            }, _ = !0
        }
        for (let O of K)
            if (w[O]) delete w[O], _ = !0;
        return _ ? {
            ...z,
            tasks: w
        } : z
    })
}

// READABLE (for understanding):
function updateTaskState(setAppState, updatedOffsets, evictedIds) {
    let offsetKeys = Object.keys(updatedOffsets);

    // Early return if no changes
    if (offsetKeys.length === 0 && evictedIds.length === 0) return;

    setAppState((appState) => {
        let hasChanges = false;
        let newTasks = { ...appState.tasks };

        // Update output offsets for running tasks
        for (let taskId of offsetKeys) {
            let task = newTasks[taskId];
            if (task?.status === "running") {
                newTasks[taskId] = {
                    ...task,
                    outputOffset: updatedOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedIds) {
            if (newTasks[taskId]) {
                delete newTasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        return hasChanges ? { ...appState, tasks: newTasks } : appState;
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedOffsets, K→evictedIds, Y→offsetKeys, z→appState, _→hasChanges, w→newTasks
```

---

## Task Lifecycle Functions

### createBackgroundAgentTask (Qn4)

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
            // ... additional fields
        };
    Zf($, z);
    // ... spawn execution
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
    initOutputFile(agentId, getOutputDir(agentId));

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? createLinkedAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        abortController: abortController,
        startTime: Date.now(),
        progress: {
            tokenCount: 0,
            toolUseCount: 0,
            summary: description
        }
    };

    // Step 4: Register task in state
    registerTask(taskRecord, setAppState);

    // Step 5: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(agentId, () => {
        flushOutputBuffer(agentId);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Step 6: Spawn detached execution
    spawnBackgroundExecution(taskRecord);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId, RG→createTaskRecord, Zf→registerTask, Co→initOutputFile
```

### triggerAbortSignal (x66)

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
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Step 1: Abort the abort controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return updated task with killed status
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer (preserve partial results)
    if (wasKilled) {
        flushOutputBuffer(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q)

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
        // Only kill running local_agent tasks
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

### markTaskKilled (d4q)

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed (set notified flag)
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
        // Already notified, no change
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task, i9→atomicUpdateTask
```

### markTaskCompleted ($m8)

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
        // Only update running tasks
        if (task.status !== "running") return task;

        // Unregister cleanup handler
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

    // Flush output buffer
    flushOutputBuffer(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### markTaskFailed (Hm8)

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
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Unregister cleanup handler
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

    // Flush output buffer
    flushOutputBuffer(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

---

## Progress Tracking

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
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
    let telemetryData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry
        telemetryData = {
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

    // Send telemetry if we got data and telemetry is enabled
    if (telemetryData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        sendTelemetry({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState, Y→telemetryData, z→task, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### updateTaskProgressPreservingSummary (TV1)

```javascript
// ============================================
// TV1 - updateTaskProgressPreservingSummary - Update progress keeping summary
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
        // Only update running tasks
        if (task.status !== "running") return task;

        // Preserve existing summary if present
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

## Task State Machine

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ createBackgroundAgentTask (Qn4) / createForegroundAgentTask (Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

---

## Key Insights

### Insight 1: Atomic State Updates

All task state changes use `i9` (atomicUpdateTask) which ensures:
1. **Immutability** - Never mutates existing state
2. **Conditional updates** - Returns unchanged state if condition not met
3. **Thread safety** - Single atomic operation

### Insight 2: Cleanup on Kill

When killing a task (`x66`):
1. Abort controller aborts LLM stream
2. Cleanup handler unregistered (prevents double cleanup)
3. Output buffer flushed (preserves partial results)
4. Only last message kept (memory efficiency)

### Insight 3: Telemetry Integration

Progress updates (`nl4`) automatically send telemetry with:
- Token count
- Tool use count
- Duration
- Summary

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [output_file_system_complete_source_v2.md](./output_file_system_complete_source_v2.md) - Output files
- [key_algorithms_deep_dive_v9.md](./key_algorithms_deep_dive_v9.md) - Algorithm analysis

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All task lifecycle functions documented with source-level restoration