# Task Lifecycle - Background Agents (Claude Code 2.1.76)

> Comprehensive analysis of the background task lifecycle from creation to completion.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` (generateTaskId) - Generate unique task ID — chunks.41.mjs:2410
- `RG` (createTaskRecord) - Create task state object — chunks.41.mjs:2418
- `Qn4` (createBackgroundAgentTask) - Create background agent task — chunks.146.mjs:2133
- `Un4` (createForegroundAgentTask) - Create foreground agent task — chunks.146.mjs:2165
- `Zf` (registerTask) - Register task in state — chunks.90.mjs:3019
- `i9` (atomicUpdateTask) - Update task state atomically — chunks.90.mjs:3003
- `$m8` (markTaskCompleted) - Mark task as completed — chunks.146.mjs:2100
- `Hm8` (markTaskFailed) - Mark task as failed — chunks.146.mjs:2117
- `d4q` (markTaskKilled) - Mark task as killed — chunks.146.mjs:2034
- `VR` (removeTask) - Remove task from state — chunks.90.mjs:3037

---

## Overview

Every background task follows a well-defined lifecycle with distinct states and transitions:

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                        Task Lifecycle                             │
   ├──────────────────────────────────────────────────────────────────┤
   │                                                                   │
   │   createTaskId() ──► createTaskRecord() ──► registerTask()       │
   │         │                   │                    │                │
   │         ▼                   ▼                    ▼                │
   │   ┌─────────┐         ┌─────────┐         ┌─────────┐            │
   │   │ pending │ ──────► │ running │ ──────► │completed│            │
   │   └─────────┘         └────┬────┘         └─────────┘            │
   │                            │                                     │
   │              ┌─────────────┼─────────────┐                       │
   │              ▼             ▼             ▼                       │
   │        ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
   │        │  killed │  │  failed │  │ (more)  │                    │
   │        └─────────┘  └─────────┘  └─────────┘                    │
   │                            │                                     │
   │                            ▼                                     │
   │                     removeTask()                                 │
   └──────────────────────────────────────────────────────────────────┘
```

---

## Task ID Generation

### generateTaskId (oV)

**What it does:** Creates a unique task identifier with a type prefix.

```javascript
// ============================================
// oV - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
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
    // Get type prefix (a=agent, b=bash, r=remote, t=teammate, w=workflow)
    let prefix = getTypePrefix(taskType);

    // Generate 8 random bytes
    let randomBytes = generateRandomBytes(8);

    // Convert to alphanumeric string
    let id = prefix;
    for (let i = 0; i < 8; i++) {
        id += CHARSET[randomBytes[i] % CHARSET.length];
    }

    return id;  // Example: "a3f4b2c1", "b7d9e2f4"
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTypePrefix, N$3→generateRandomBytes,
// G97→CHARSET ("0123456789abcdefghijklmnopqrstuvwxyz")
```

### Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - Task type prefixes
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
const TASK_TYPE_PREFIXES = {
    local_bash: "b",          // Background bash command
    local_agent: "a",         // Background agent
    remote_agent: "r",        // Remote session agent
    in_process_teammate: "t", // In-process teammate
    local_workflow: "w"       // Workflow task
};

// Examples:
// local_agent task: "a3f4b2c1"
// local_bash task: "b7d9e2f4"
// in_process_teammate: "t1a2b3c4"
```

---

## Task Record Creation

### createTaskRecord (RG)

**What it does:** Creates the initial task state object.

```javascript
// ============================================
// RG - Create task record
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
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,                    // Unique task identifier
        type: taskType,                // "local_agent", "local_bash", etc.
        status: "pending",             // Initial status
        description,                   // Human-readable description
        toolUseId,                     // ID of the tool use that spawned this task
        startTime: Date.now(),         // Creation timestamp
        outputFile: getOutputFilePath(taskId),  // ~/.claude/tasks/{id}.output
        outputOffset: 0,               // Current read position in output file
        notified: false                // Has user been notified of completion?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId,
// g2→getOutputFilePath
```

---

## Task Creation Functions

### createBackgroundAgentTask (Qn4)

**What it does:** Creates a task that starts immediately in background mode.

```javascript
// ============================================
// Qn4 - Create background agent task
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
    // Initialize output file
    initOutputFile(getOutputFilePath(agentId));

    // Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? cloneAbortController(parentAbortController)
        : createAbortController();

    // Build task record with background-specific fields
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",           // Immediately running
        agentId,
        prompt,
        selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,        // KEY: Starts as backgrounded
        pendingMessages: []
    };

    // Register cleanup handler for graceful termination
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Register in app state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
// Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
// Co→initOutputFile, Wm→cloneAbortController, sK→createAbortController,
// RG→createTaskRecord, E4→registerCleanupHandler, x66→triggerAbortSignal, Zf→registerTask
```

### createForegroundAgentTask (Un4)

**What it does:** Creates a task that starts in foreground mode with optional auto-backgrounding.

```javascript
// ============================================
// Un4 - Create foreground agent task with auto-backgrounding
// Location: chunks.146.mjs:2165-2219
// ============================================

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,      // Time before auto-backgrounding
    toolUseId
}) {
    // Initialize output file
    initOutputFile(getOutputFilePath(agentId));

    // Create independent abort controller
    let abortController = createAbortController();

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId,
        prompt,
        selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController,
        unregisterCleanup,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: false,       // KEY: Starts as foreground
        pendingMessages: []
    };

    // Set up resolve function for Promise.race backgrounding
    let backgroundResolve;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolve = resolve;
    });
    backgroundResolveMap.set(agentId, backgroundResolve);

    // Set up auto-backgrounding timer if specified
    let cancelAutoBackground;
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timeoutId = setTimeout((setAppState, agentId) => {
            // Update task to backgrounded
            setAppState((state) => {
                let task = state.tasks[agentId];
                if (!isRunning(task) || task.isBackgrounded) return state;
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [agentId]: {
                            ...task,
                            isBackgrounded: true
                        }
                    }
                };
            });

            // Trigger background resolve
            let resolve = backgroundResolveMap.get(agentId);
            if (resolve) resolve(), backgroundResolveMap.delete(agentId);
        }, autoBackgroundMs, setAppState, agentId);

        cancelAutoBackground = () => clearTimeout(timeoutId);
    }

    // Register task in state
    registerTask(taskRecord, setAppState);

    return { taskRecord, backgroundPromise, cancelAutoBackground };
}

// Key insight: Foreground tasks can auto-background after a timeout,
// allowing seamless transition without user intervention.
```

---

## State Transitions

### atomicUpdateTask (i9)

**What it does:** Updates task state atomically with a transformation function.

```javascript
// ============================================
// i9 - Atomically update task state
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
function atomicUpdateTask(taskId, setAppState, transformFn) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task not found, no change

        let newTask = transformFn(task);

        // If transform returned same object, no change
        if (newTask === task) return state;

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: newTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→transformFn
```

### markTaskCompleted ($m8)

**What it does:** Marks a task as completed with result and cleans up resources.

```javascript
// ============================================
// $m8 - Mark task as completed
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
        // Only update if currently running
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: agentResult,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush any pending output
    flushOutputFile(agentId);
}

// Mapping: $m8→markTaskCompleted, A→agentResult, q→setAppState, i9→atomicUpdateTask, $O→flushOutputFile
```

### markTaskFailed (Hm8)

**What it does:** Marks a task as failed with error information.

```javascript
// ============================================
// Hm8 - Mark task as failed
// Location: chunks.146.mjs:2117-2130
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
            unregisterCleanup: void 0
        }
    })
}

// READABLE (for understanding):
function markTaskFailed(taskId, error, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error,
            endTime: Date.now(),
            // Keep only last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined
        };
    });
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState
```

### markTaskKilled (d4q)

**What it does:** Marks a task as killed (user-initiated termination).

```javascript
// ============================================
// d4q - Mark task as killed
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
            // Keep only last message
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Note: The status is updated to "killed" before this is called,
// this function just handles the notification state.

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState
```

---

## Output File Lifecycle

### getOutputFilePath (g2)

```javascript
// ============================================
// g2 - Get output file path for task
// Location: chunks.41.mjs:2248-2250
// ============================================

// ORIGINAL (for source lookup):
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return path.join(getTasksDir(), `${taskId}.output`);
    // Returns: ~/.claude/tasks/{taskId}.output
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→path.join, yJ6→getTasksDir
```

### Output File Operations

```javascript
// Output file lifecycle:

// 1. Creation (during task creation)
initOutputFile(outputFilePath);

// 2. Appending (during task execution)
appendToOutputFile(taskId, content);

// 3. Reading delta (for progress updates)
let { content, newOffset } = await readOutputFileDelta(taskId, currentOffset);

// 4. Reading full output (for completion)
let fullOutput = await readFullOutput(taskId);

// 5. Cleanup (optional, usually kept for history)
// Output files are typically left for debugging/review
```

---

## Complete State Machine

```
                                    ┌─────────────────────────────────────┐
                                    │         Task State Machine          │
                                    └─────────────────────────────────────┘

                                    ┌──────────┐
                                    │ pending  │ ◄── createTaskRecord()
                                    └────┬─────┘
                                         │ registerTask()
                                         ▼
                                    ┌──────────┐
                        ┌──────────►│ running  │◄──────────┐
                        │           └────┬─────┘           │
                        │                │                 │
            (auto-background)    ┌───────┴───────┐   (foreground)
                        │        │               │           │
                        │        ▼               ▼           │
                        │  ┌───────────┐  ┌────────────┐     │
                        │  │background │  │foreground  │─────┘
                        │  │   mode    │  │   mode     │
                        │  └─────┬─────┘  └─────┬──────┘
                        │        │              │
                        │        │   ┌──────────┴──────────┐
                        │        │   │                     │
                        │        ▼   ▼                     ▼
                        │      ┌──────────┐          ┌──────────┐
                        │      │completed │          │  failed  │
                        │      └────┬─────┘          └────┬─────┘
                        │           │                     │
                        │           │    ┌────────────────┘
                        │           │    │
                        │           ▼    ▼
                        │      ┌───────────┐
                        └─────►│  killed   │
                               └─────┬─────┘
                                     │
                                     ▼
                              ┌────────────┐
                              │  notified  │ ◄── markTaskKilled()
                              │  = true    │
                              └─────┬──────┘
                                    │
                                    ▼
                             removeTask()
                         (after notification shown)
```

---

## Progress Tracking

### updateTaskProgressPreservingSummary (TV1)

```javascript
// ============================================
// TV1 - Update progress while keeping summary
// Location: chunks.146.mjs:2045-2056
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

        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary
                ? { ...newProgress, summary: existingSummary }
                : newProgress
        };
    });
}

// Used when updating progress but wanting to preserve any summary that was set
```

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - Update progress with telemetry emission
// Location: chunks.146.mjs:2059-2097
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
                summary
            }
        };
    });

    // Emit telemetry if update succeeded and telemetry is enabled
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;

        emitTelemetry({
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
            summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
// i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→emitTelemetry
```

---

## Notification Integration

When a task reaches a terminal state, the notification system is triggered:

```javascript
// Notification flow:
// 1. Task reaches terminal state (completed/failed/killed)
// 2. notified flag is set to true
// 3. getUnifiedTasksAttachment() picks up the change
// 4. task_status attachment is generated
// 5. Attachment injected into conversation as system-reminder
// 6. User sees notification in UI
// 7. After notification is displayed, removeTask() cleans up
```

---

## Source Code Verification

### Verified Symbol Locations

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |

---

## Related Documents

- [implementation.md](./implementation.md) - Core implementation details
- [kill_handlers.md](./kill_handlers.md) - Kill handler implementations
- [output_capture.md](./output_capture.md) - Output file management
- [system_reminder_producers.md](./system_reminder_producers.md) - Attachment generation
- [../08_subagent/abort_signal_propagation.md](../08_subagent/abort_signal_propagation.md) - Abort signal propagation