# Task Lifecycle Complete V5 (Claude Code 2.1.76)

> Complete source-level restoration of the background agent task lifecycle including ID generation, state management, polling, eviction, and UI interaction.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - Generate task ID — `chunks.41.mjs:2410`
- `RG` - Create task record — `chunks.41.mjs:2418`
- `i9` - Atomic update task — `chunks.90.mjs:3003`
- `Zf` - Register task — `chunks.90.mjs:3019`
- `VR` - Remove task — `chunks.90.mjs:3037`
- `EV8` - Get running tasks — `chunks.90.mjs:3053`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `$m8` - Mark task completed — `chunks.146.mjs:2100`
- `Hm8` - Mark task failed — `chunks.146.mjs:2117`
- `Qn4` - Create background agent task — `chunks.146.mjs:2133`
- `Un4` - Create foreground agent task — `chunks.146.mjs:2165`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK LIFECYCLE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Task Creation                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  generateTaskId(oV) ───► createTaskRecord(RG) ───► registerTask(Zf)         │
│        │                        │                        │                   │
│        │   Type prefix +        │   Initialize state     │   Add to state   │
│        │   8 random chars       │   + output file        │   + telemetry    │
│        ▼                        ▼                        ▼                   │
│  "ab3k7m9p2"          { id, type, status,            appState.tasks        │
│                        outputFile, ... }              { "ab3k...": task }   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Task Execution                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  createBackgroundAgentTask(Qn4)     createForegroundAgentTask(Un4)          │
│        │                                    │                               │
│        │   isBackgrounded: true            │   isBackgrounded: false        │
│        │   AbortController                 │   autoBackgroundMs             │
│        │   Cleanup handler                 │   Promise for foregrounding    │
│        ▼                                    ▼                               │
│  Spawn detached execution           Spawn with foreground option            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: State Management                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  atomicUpdateTask(i9) ◄─── Updates via updater function                     │
│        │                                                                     │
│        ├──► triggerAbortSignal(x66) ──► status: "killed"                   │
│        │                                                                     │
│        ├──► markTaskCompleted($m8) ──► status: "completed"                  │
│        │                                                                     │
│        ├──► markTaskFailed(Hm8) ──► status: "failed"                        │
│        │                                                                     │
│        └──► updateTaskProgressWithTelemetry(nl4) ──► progress update        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: Polling & Eviction                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  pollTaskOutputs(wY4)                                                        │
│        │                                                                     │
│        ├──► Read output delta (Z97) for running tasks                       │
│        │                                                                     │
│        └──► Identify terminal + notified tasks for eviction                 │
│                                                                              │
│  updateTaskState(OY4)                                                        │
│        │                                                                     │
│        ├──► Update output offsets                                           │
│        │                                                                     │
│        └──► Remove evicted tasks                                            │
│                                                                              │
│  removeTask(VR) ◄─── Final cleanup after notification                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Task ID Generation

### generateTaskId (oV)

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID with type prefix
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
    // Step 1: Get type prefix (single character)
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);  // N$3

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHABET
```

**Design Rationale:**
- **Type identification**: One character prefix immediately identifies task category
- **Cryptographic randomness**: Prevents ID collision even in parallel execution
- **Alphanumeric encoding**: URL-safe, filesystem-safe IDs
- **Fixed length**: 9 characters (1 prefix + 8 random) for consistent display

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
const TASK_TYPE_PREFIXES = {
    local_bash: "b",              // Shell commands (e.g., "bx5n8q1w4")
    local_agent: "a",             // Local subagents (e.g., "ab3k7m9p2")
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};
// Unknown types get "x" prefix

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### getTaskTypePrefix (k$3)

```javascript
// ============================================
// k$3 - getTaskTypePrefix - Get prefix for task type
// Location: chunks.41.mjs:2406-2408
// ============================================

// ORIGINAL (for source lookup):
function k$3(A) {
    return V$3[A] ?? "x"
}

// READABLE (for understanding):
function getTaskTypePrefix(taskType) {
    return TASK_TYPE_PREFIXES[taskType] ?? "x";
}

// Mapping: k$3→getTaskTypePrefix, A→taskType, V$3→TASK_TYPE_PREFIXES
```

---

## Phase 2: Task Record Creation

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
        status: "pending",           // Initial state
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        outputFile: getOutputFilePath(taskId),  // g2
        outputOffset: 0,             // Current read position
        notified: false              // Has user been notified?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId,
//          g2→getOutputFilePath
```

### Task Record Structure

```typescript
interface TaskRecord {
    // Core fields (always present)
    id: string;              // Unique task ID (e.g., "ab3k7m9p2")
    type: TaskType;          // Task type identifier
    status: TaskStatus;      // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;     // Human-readable description
    toolUseId: string;       // Tool use ID that created this task
    startTime: number;       // Unix timestamp (ms)
    outputFile: string;      // Path to output file
    outputOffset: number;    // Current read position in output file
    notified: boolean;       // Has user been notified of completion?

    // Execution fields (added when running)
    abortController?: AbortController;  // For cancellation
    unregisterCleanup?: () => void;     // Cleanup handler
    selectedAgent?: AgentDefinition;    // Agent definition used

    // Progress tracking
    progress?: {
        toolUseCount: number;
        tokenCount: number;
        summary: string;
    };

    // Completion fields
    result?: any;            // For completed tasks
    error?: string;          // For failed tasks
    endTime?: number;        // For terminal states
    messages?: Message[];    // Last message (for resume/debug)

    // Background-specific
    isBackgrounded?: boolean;
    pendingMessages?: Message[];

    // Teammate-specific
    agentId?: string;
    agentType?: string;
    prompt?: string;
    pendingUserMessages?: Message[];
}
```

---

## Phase 3: State Management

### atomicUpdateTask (i9)

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomically update a single task
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
        // Step 1: Check task exists
        let task = state.tasks?.[taskId];
        if (!task) return state;

        // Step 2: Apply updater function
        let updatedTask = updater(task);

        // Step 3: Skip update if unchanged (reference equality)
        if (updatedTask === task) return state;

        // Step 4: Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
//          Y→state, z→task, _→updatedTask
```

**Design Rationale:**
- **Concurrency safety** - Multiple updates don't conflict
- **Immutable state** - React-like state updates
- **Reference equality optimization** - Skip renders if unchanged
- **Transactional** - All-or-nothing updates

### registerTask (Zf)

```javascript
// ============================================
// Zf - registerTask - Register task in state and send telemetry
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
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
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

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState, K→state, c36→sendTelemetry
```

### removeTask (VR)

```javascript
// ============================================
// VR - removeTask - Remove task from state after completion
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
    setAppState((state) => {
        // Step 1: Check task exists
        let task = state.tasks?.[taskId];
        if (!task) return state;

        // Step 2: Must be in terminal state
        if (!isTerminalTaskStatus(task.status)) return state;

        // Step 3: Must have been notified
        if (!task.notified) return state;

        // Step 4: Remove task from state
        let { [taskId]: removed, ...remainingTasks } = state.tasks;
        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask, A→taskId, q→setAppState, K→state, Y→task, z→removed,
//          _→remainingTasks, LJ6→isTerminalTaskStatus
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

---

## Phase 4: Lifecycle Transitions

### triggerAbortSignal (x66)

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
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

        // Step 1: Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message for debugging/resume
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references for GC
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          i9→atomicUpdateTask, Y→task, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    // Iterate all tasks - Object.entries creates snapshot
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter conditions:
        // 1. Must be local_agent type (not local_bash, in_process_teammate, etc.)
        // 2. Must be in running state
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
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
function markTaskCompleted(completionResult, setAppState) {
    let taskId = completionResult.agentId;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only transition running tasks
        if (task.status !== "running") return task;

        // Cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: completionResult,  // Contains final content, tokens, etc.
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush any remaining output
    flushOutputBuffer(taskId);  // $O
}

// Mapping: $m8→markTaskCompleted, A→completionResult, q→setAppState, K→taskId,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
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
        if (task.status !== "running") return task;

        // Cleanup
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,  // Error message or object
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush any remaining output
    flushOutputBuffer(taskId);
}

// Mapping: Hm8→markTaskFailed, A→taskId, q→error, K→setAppState, Y→task
```

---

## Phase 5: Task Creation Functions

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
    initOutputFile(getOutputFilePath(agentId));

    // Step 2: Create abort controller (child or new)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm
        : new AbortController();  // sK

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),  // RG
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
        isBackgrounded: true,
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    let cleanupHandler = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });
    taskRecord.unregisterCleanup = cleanupHandler;

    // Step 5: Register task
    registerTask(taskRecord, setAppState);  // Zf

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          RG→createTaskRecord, Wm→createChildAbortController, sK→newAbortController,
//          x66→triggerAbortSignal, E4→registerCleanupHandler, Zf→registerTask
```

### createForegroundAgentTask (Un4)

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2199
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
    // ... continues with auto-background logic
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
    initOutputFile(getOutputFilePath(agentId));

    // Step 2: Create abort controller
    let abortController = new AbortController();

    // Step 3: Register cleanup handler
    let cleanupHandler = registerCleanupHandler(async () => {
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
        unregisterCleanup: cleanupHandler,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: false,  // Key difference from background task
        pendingMessages: []
    };

    // Step 5: Create foreground resolver promise
    let resolveForeground;
    let foregroundPromise = new Promise((resolve) => {
        resolveForeground = resolve;
    });
    foregroundResolvers.set(agentId, resolveForeground);

    // Step 6: Register task
    registerTask(taskRecord, setAppState);

    // ... continues with auto-background timeout race
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→autoBackgroundMs, w→toolUseId,
//          RG→createTaskRecord, x66→triggerAbortSignal, Zf→registerTask
```

---

## State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ Qn4 / Un4
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
                                │ VR
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

### State Transitions

| From | To | Trigger | Function | Side Effects |
|------|-----|---------|----------|--------------|
| pending | running | Task spawn | `Qn4` / `Un4` | Create AbortController, register cleanup |
| running | completed | Success | `$m8` | Unregister cleanup, flush output |
| running | failed | Error | `Hm8` | Unregister cleanup, flush output |
| running | killed | User kill | `x66` | Abort controller, unregister cleanup |
| terminal | notified | Notification sent | `d4q` | Set notified flag |
| notified | removed | After processing | `VR` | Remove from state |

---

## Polling System

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
    let attachments = [];              // Future: progress attachments
    let updatedTaskOffsets = {};       // Tasks with new output
    let evictedTaskIds = [];           // Tasks to remove
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Check for eviction (terminal + notified)
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;  // Skip to next task
                case "pending":
                    continue;  // Skip pending tasks
                case "running":
                    break;     // Continue processing
            }
        }

        // Read output delta for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, _→task, w→result, Z97→readOutputFileDelta
```

### updateTaskState (OY4)

```javascript
// ============================================
// OY4 - updateTaskState - Apply polling results to state
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
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetTaskIds = Object.keys(updatedTaskOffsets);

    // Skip if nothing to update
    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let hasChanges = false;
        let tasks = { ...state.tasks };

        // Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = tasks[taskId];
            if (task?.status === "running") {
                tasks[taskId] = {
                    ...task,
                    outputOffset: updatedTaskOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (tasks[taskId]) {
                delete tasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        return hasChanges
            ? { ...state, tasks: tasks }
            : state;
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds,
//          Y→offsetTaskIds, z→state, _→hasChanges, w→tasks, O→taskId, $→task
```

---

## UI Integration

### Status Line Display

```
When agents running:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
└──────────────────────────────────────────────────────────────────┘

When no agents running:
┌──────────────────────────────────────────────────────────────────┐
│ (normal status line content - model, cwd, etc.)                  │
└──────────────────────────────────────────────────────────────────┘
```

### Task List Modal

```
┌──────────────────────────────────────────────────────────────────┐
│ Background Tasks                                                  │
├──────────────────────────────────────────────────────────────────┤
│ ◐ running  Search codebase...           [x: stop]               │
│ ◐ running  Analyze patterns...          [x: stop]               │
│ ✓ completed Find usages                 Done                    │
└──────────────────────────────────────────────────────────────────┘
```

### Notification Display

```
Task completion:
┌──────────────────────────────────────────────────────────────────┐
│ Background agent "search codebase" completed                      │
└──────────────────────────────────────────────────────────────────┘

Task failure:
┌──────────────────────────────────────────────────────────────────┐
│ Background agent "analyze patterns" failed: API rate limit       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |

---

## Related Documents

- [../08_subagent/agent_tool_complete_v2.md](../08_subagent/agent_tool_complete_v2.md) - AgentTool
- [../08_subagent/agent_loop_complete_source_v4.md](../08_subagent/agent_loop_complete_source_v4.md) - Agent loop
- [kill_mechanism_complete_v3.md](./kill_mechanism_complete_v3.md) - Kill handlers
- [system_reminder_integration_complete_v5.md](./system_reminder_integration_complete_v5.md) - System reminder