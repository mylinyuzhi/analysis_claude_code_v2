# Task Lifecycle Complete V4 (Claude Code 2.1.76)

> Complete source-level restoration of the background agent task lifecycle including ID generation, state management, polling, and eviction.

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
- `LJ6` - Is terminal status — `chunks.41.mjs:2402`
- `k$3` - Get task type prefix — `chunks.41.mjs:2406`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK LIFECYCLE FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Task Creation
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. generateTaskId (oV)                                                       │
│    - Type prefix lookup (k$3)                                               │
│    - 8 random bytes (N$3)                                                   │
│    - Alphanumeric encoding (G97)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. createTaskRecord (RG)                                                     │
│    - Initialize state: pending                                              │
│    - Set startTime, outputFile, outputOffset                                │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. registerTask (Zf)                                                         │
│    - Add to appState.tasks                                                  │
│    - Send telemetry: task_started                                           │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Spawn Execution                                                           │
│    - Create AbortController                                                 │
│    - Start background execution                                             │
│    - Update status: running                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ├──────────────────────────────────────┐
          │                                      │
          ▼                                      ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ Poll Loop (wY4)               │   │ State Transitions             │
│ - Read output delta (Z97)     │   │ - atomicUpdateTask (i9)       │
│ - Update offsets              │   │ - markTaskCompleted ($m8)     │
│ - Evict terminal tasks        │   │ - markTaskFailed (Hm8)        │
└───────────────────────────────┘   │ - markTaskKilled (d4q)        │
                                    └───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. removeTask (VR)                                                           │
│    - Remove from appState.tasks                                             │
│    - Must be terminal + notified                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: generateTaskId (oV)

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
    let prefix = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHABET
```

### Task Type Prefixes

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
    local_bash: "b",              // Shell commands
    local_agent: "a",             // Local subagents
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};
// Unknown types get "x" prefix

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Prefix Lookup Function

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

### Example IDs

| Task Type | Generated ID | Breakdown |
|-----------|--------------|-----------|
| local_agent | `ab3k7m9p2` | a + b3k7m9p2 |
| local_bash | `bx5n8q1w4` | b + x5n8q1w4 |
| in_process_teammate | `tp9m2k5r8` | t + p9m2k5r8 |
| unknown_type | `xq3w7e5t9` | x + q3w7e5t9 |

---

## Core Function: createTaskRecord (RG)

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
    id: string;              // Unique task ID (e.g., "ab3k7m9p2")
    type: TaskType;          // Task type identifier
    status: TaskStatus;      // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;     // Human-readable description
    toolUseId: string;       // Tool use ID that created this task
    startTime: number;       // Unix timestamp (ms)
    outputFile: string;      // Path to output file
    outputOffset: number;    // Current read position in output file
    notified: boolean;       // Has user been notified of completion?

    // Additional fields (added during execution)
    abortController?: AbortController;
    progress?: {
        toolUseCount: number;
        tokenCount: number;
        summary: string;
    };
    result?: any;            // For completed tasks
    error?: string;          // For failed tasks
    endTime?: number;        // For terminal states
}
```

---

## Core Function: atomicUpdateTask (i9)

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

### Why Atomic Updates?

**Design rationale:**
1. **Concurrency safety** - Multiple updates don't conflict
2. **Immutable state** - React-like state updates
3. **Reference equality optimization** - Skip renders if unchanged
4. **Transactional** - All-or-nothing updates

---

## Core Function: registerTask (Zf)

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

---

## Core Function: removeTask (VR)

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

### Removal Conditions

A task can only be removed when:
1. **Terminal state** - status is "completed", "failed", or "killed"
2. **User notified** - `notified` flag is true
3. **Output processed** - All output has been read

---

## Core Function: isTerminalTaskStatus (LJ6)

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

## Core Function: getRunningTasks (EV8)

```javascript
// ============================================
// EV8 - getRunningTasks - Get all currently running tasks
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
    return Object.values(tasks).filter((task) => task.status === "running");
}

// Mapping: EV8→getRunningTasks, A→appState, q→tasks, K→task
```

---

## Core Function: pollTaskOutputs (wY4)

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll output files for all running tasks
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
            let result = await readOutputFileDelta(task.id, task.outputOffset);
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

---

## Core Function: updateTaskState (OY4)

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

## State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   pending    │
                         └──────┬───────┘
                                │ spawn
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [notification]               │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ removeTask
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         └──────────────┘
```

### State Transitions

| From | To | Trigger | Function |
|------|-----|---------|----------|
| pending | running | Spawn execution | `Qn4` / `Un4` |
| running | completed | Success | `$m8` |
| running | failed | Error | `Hm8` |
| running | killed | User kill | `d4q` |
| * | notified | Notification sent | (inline) |
| terminal | removed | After notification | `VR` |

---

## Output File Management

### getOutputFilePath (g2)

```javascript
// ============================================
// g2 - getOutputFilePath - Get output file path for task
// Location: chunks.41.mjs:2248-2250 (inferred)
// ============================================

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Example: /path/to/.claude/tasks/ab3k7m9p2.output

// Mapping: g2→getOutputFilePath
```

### readOutputFileDelta (Z97)

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output from file
// Location: chunks.41.mjs:2325-2346
// ============================================

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            currentOffset
        );

        if (!result) {
            return { content: "", newOffset: currentOffset };
        }

        return {
            content: result.content,
            newOffset: currentOffset + result.bytesRead
        };

    } catch (error) {
        if (error.code === "ENOENT") {
            return { content: "", newOffset: currentOffset };
        }
        return { content: "", newOffset: currentOffset };
    }
}

// Mapping: Z97→readOutputFileDelta
```

---

## Key Design Decisions

### 1. Type-Prefixed IDs

**Why prefix IDs?**
- **Immediate identification** - Know task type from ID alone
- **Debugging aid** - Easy to identify task category in logs
- **Collision prevention** - Different types have different ID spaces

### 2. Atomic State Updates

**Why atomic updates?**
- **Concurrency safety** - Multiple simultaneous updates
- **Immutable state** - Predictable state changes
- **Reference equality optimization** - Skip unnecessary renders

### 3. Eviction After Notification

**Why require notification?**
- **User awareness** - Ensure user knows task completed
- **Output preservation** - Allow reading final output
- **Clean state** - Remove only after all processing done

### 4. Incremental Output Reading

**Why read deltas?**
- **Memory efficiency** - Don't load entire file
- **Progress tracking** - Know what's new since last read
- **Streaming** - Output can grow during execution

---

## Source File References

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
| `G97` | ALPHABET | chunks.41.mjs:2434 | ✓ Verified |

---

## Related Documents

- [progress_tracking_complete_v2.md](./progress_tracking_complete_v2.md) - Progress tracking
- [kill_mechanism_complete_v2.md](./kill_mechanism_complete_v2.md) - Kill mechanism
- [../08_subagent/agent_loop_complete_source_v3.md](../08_subagent/agent_loop_complete_source_v3.md) - Agent loop