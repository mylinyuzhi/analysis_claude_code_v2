# Task Management Source Restored (Claude Code 2.1.76)

> Complete source-level restoration of task management functions for subagent and background agent systems.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - Generate unique task ID — `chunks.41.mjs:2410`
- `RG` - Create task entry object — `chunks.41.mjs:2418`
- `LJ6` - Check if status is terminal — `chunks.41.mjs:2402`
- `i9` - Atomic task state update — `chunks.90.mjs:3003`
- `Zf` - Register task in state — `chunks.90.mjs:3019`
- `VR` - Remove completed task — `chunks.90.mjs:3037`
- `EV8` - Get running tasks — `chunks.90.mjs:3053`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task offsets — `chunks.90.mjs:3087`

---

## Task ID Generation (oV)

### Source Code

```javascript
// ============================================
// oV - Generate unique task ID with type prefix
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
function generateTaskId(taskType) {
    // Get prefix for task type (e.g., "a" for local_agent)
    let prefix = getTaskTypePrefix(taskType);

    // Generate 8 random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Build ID: prefix + 8 random base36 characters
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }
    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.getRandomValues, G97→TASK_ID_CHARSET
```

### Algorithm Deep Dive

**What it does:** Generates a unique, type-prefixed task identifier.

**How it works:**
1. **Type Prefix Lookup** - Maps task type to single character prefix:
   - `local_bash` → `"b"`
   - `local_agent` → `"a"`
   - `remote_agent` → `"r"`
   - `in_process_teammate` → `"t"`
   - `local_workflow` → `"w"`
2. **Random Bytes** - Uses `crypto.getRandomValues()` for cryptographically secure randomness
3. **Base36 Encoding** - Maps each byte to `[0-9a-z]` charset (36 characters)
4. **Final ID** - Format: `{prefix}{8-chars}` (e.g., `a3f4b2c1` for a local_agent)

**Why this approach:**
- **Uniqueness** - Crypto random + 8 chars = 36^8 = ~2.8 trillion combinations
- **Type visibility** - Prefix allows quick identification of task type
- **Collision resistance** - Probabilistically impossible to collide

**Key insight:** The prefix serves both human readability and programmatic filtering (e.g., "kill all local_agent tasks" = "match 'a' prefix").

---

## Task Entry Creation (RG)

### Source Code

```javascript
// ============================================
// RG - Create task entry object
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
function createTaskEntry(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,                    // Unique task identifier
        type: taskType,                // local_agent, local_bash, etc.
        status: "pending",             // Initial status
        description: description,      // Human-readable description
        toolUseId: toolUseId,          // ID of tool_use that created task
        startTime: Date.now(),         // Creation timestamp
        outputFile: getOutputFilePath(taskId),  // Path to output file
        outputOffset: 0,               // Current read position in output
        notified: false                // Has user been notified of completion?
    };
}

// Mapping: RG→createTaskEntry, A→taskId, q→taskType, K→description, Y→toolUseId,
//          g2→getOutputFilePath
```

### Task Record Structure

```typescript
interface TaskRecord {
    id: string;                    // Type-prefixed unique ID
    type: TaskType;                // "local_agent" | "local_bash" | etc.
    status: TaskStatus;            // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;           // Short description for UI
    toolUseId: string;             // Tool use that spawned this task
    startTime: number;             // Unix timestamp (ms)
    outputFile: string;            // Path to .output file
    outputOffset: number;          // Bytes read so far
    notified: boolean;             // Completion notification sent?

    // Extended fields (added during execution):
    prompt?: string;               // Agent prompt (for local_agent)
    agentId?: string;              // Agent ID (for resume)
    agentType?: string;            // Agent type (e.g., "general-purpose")
    abortController?: AbortController;  // Cancellation controller
    progress?: TaskProgress;       // Progress tracking
    isBackgrounded?: boolean;      // Running in background?
    unregisterCleanup?: () => void; // Cleanup function
    endTime?: number;              // Completion timestamp
    result?: any;                  // Completion result
    error?: string;                // Failure error message
    messages?: Message[];          // Message history (for resume)
}
```

---

## Terminal Status Check (LJ6)

### Source Code

```javascript
// ============================================
// LJ6 - Check if task status is terminal
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    return status === "completed" || status === "failed" || status === "killed";
}

// Mapping: LJ6→isTerminalTaskStatus, A→status
```

### State Diagram

```
                 ┌─────────────┐
                 │   pending   │
                 └──────┬──────┘
                        │ spawn()
                        ▼
                 ┌─────────────┐
                 │   running   │ ◄─── Active execution
                 └──────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
 ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 │  completed  │ │   failed    │ │   killed    │
 │  (success)  │ │  (error)    │ │ (user stop) │
 └─────────────┘ └─────────────┘ └─────────────┘
        ▲               ▲               ▲
        │               │               │
        └───────────────┴───────────────┘
                        │
                Terminal states (LJ6 returns true)
```

---

## Atomic Task Update (i9)

### Source Code

```javascript
// ============================================
// i9 - Atomic task state update
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
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        // Get current task
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task doesn't exist

        // Apply updater function
        let updatedTask = updater(task);

        // If updater returned same object, no change
        if (updatedTask === task) return state;

        // Return new state with updated task
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

### Design Rationale

**Why atomic updates?**
1. **Immutability** - State is never mutated, always replaced
2. **Consistency** - Updates are atomic (all-or-nothing)
3. **Reactivity** - React-style state updates trigger re-renders

**Common updater patterns:**

```javascript
// Update status
(task) => ({ ...task, status: "running" })

// Update progress
(task) => ({
    ...task,
    progress: { ...task.progress, toolUseCount: task.progress.toolUseCount + 1 }
})

// Mark as killed (with notification)
(task) => ({
    ...task,
    status: "killed",
    notified: true,
    endTime: Date.now()
})
```

---

## Task Registration (Zf)

### Source Code

```javascript
// ============================================
// Zf - Register task in state with telemetry
// Location: chunks.90.mjs:3019-3034
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
    // Add task to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskRecord.id]: taskRecord
        }
    }));

    // Send telemetry event
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

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState, K→state,
//          c36→sendTelemetry
```

---

## Task Removal (VR)

### Source Code

```javascript
// ============================================
// VR - Remove completed task from state
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
        if (!task) return state;                    // Task doesn't exist
        if (!isTerminalTaskStatus(task.status)) return state;  // Still running
        if (!task.notified) return state;           // User hasn't been notified

        // Destructure to remove task from tasks object
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

### Removal Conditions

A task can only be removed when ALL conditions are met:
1. **Task exists** - Present in state
2. **Terminal status** - `completed`, `failed`, or `killed`
3. **User notified** - `notified: true`

This ensures users always see completion notifications before task cleanup.

---

## Get Running Tasks (EV8)

### Source Code

```javascript
// ============================================
// EV8 - Get all running tasks
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

## Poll Task Outputs (wY4)

### Source Code

```javascript
// ============================================
// wY4 - Poll task output files for new content
// Location: chunks.90.mjs:3058-3084
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
                    continue;  // Skip pending tasks
                case "running":
                    break;     // Process running tasks
            }
        }

        // Read new output for running tasks
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

## Update Task Offsets (OY4)

### Source Code

```javascript
// ============================================
// OY4 - Update task output offsets in state
// Location: chunks.90.mjs:3087-3100
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
            }
        }
        // ... eviction logic
    })
}

// READABLE (for understanding):
function updateTaskOffsets(setAppState, updatedOffsets, evictedTaskIds) {
    let taskIds = Object.keys(updatedOffsets);
    if (taskIds.length === 0 && evictedTaskIds.length === 0) return;

    setAppState((state) => {
        let changed = false;
        let newTasks = { ...state.tasks };

        // Update offsets for running tasks
        for (let taskId of taskIds) {
            let task = newTasks[taskId];
            if (task?.status === "running") {
                newTasks[taskId] = {
                    ...task,
                    outputOffset: updatedOffsets[taskId]
                };
                changed = true;
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (newTasks[taskId]?.notified) {
                delete newTasks[taskId];
                changed = true;
            }
        }

        if (!changed) return state;

        return {
            ...state,
            tasks: newTasks
        };
    });
}

// Mapping: OY4→updateTaskOffsets, A→setAppState, q→updatedOffsets, K→evictedTaskIds,
//          Y→taskIds, z→state, w→newTasks, O→taskId, $→task
```

---

## Task Type Prefixes (V$3)

### Source Code

```javascript
// ============================================
// V$3 - Task type to prefix mapping
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
    local_bash: "b",              // e.g., "b3f4a2c1"
    local_agent: "a",             // e.g., "a3f4b2c1"
    remote_agent: "r",            // e.g., "r9d8c7b6"
    in_process_teammate: "t",     // e.g., "t2a3b4c5"
    local_workflow: "w"           // e.g., "w1e2r3t4"
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Task ID Charset (G97)

```javascript
// ============================================
// G97 - Charset for task ID generation
// Location: chunks.41.mjs:2434
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// READABLE (for understanding):
const TASK_ID_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
// Base36: 0-9 (10 digits) + a-z (26 letters) = 36 characters
```

---

## Cross-Feature Integration

### Integration with 04_system_reminder

```
Task Management                 System Reminder
      │                              │
      ├── registerTask (Zf) ────────┤
      │   sends task_started event   │
      │                              │
      ├── atomicUpdateTask (i9) ─────┤
      │   progress updates           │
      │                              │
      └── pollTaskOutputs (wY4) ─────┤
          generates attachments      │
```

### Integration with 05_tools

```
AgentTool.call()                Task Management
      │                              │
      ├── createTaskEntry (RG) ──────┤
      │   creates task record        │
      │                              │
      ├── registerTask (Zf) ─────────┤
      │   registers in state         │
      │                              │
      └── Execution complete ────────┤
          markTaskCompleted/Failed   │
```

### Integration with 15_state_management

```
Task functions are core state mutations:
- Zf (registerTask) - Add to state
- i9 (atomicUpdateTask) - Update in state
- VR (removeTask) - Remove from state
- EV8 (getRunningTasks) - Query state
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskEntry | chunks.41.mjs:2418 | ✓ Verified |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `VR` | removeTask | chunks.90.mjs:3037 | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskOffsets | chunks.90.mjs:3087 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [task_lifecycle_and_state.md](./task_lifecycle_and_state.md) - Task lifecycle
- [abort_signal_propagation_source_restored.md](./abort_signal_propagation_source_restored.md) - Abort signals
- [../26_background_agents/output_capture_source_restored.md](../26_background_agents/output_capture_source_restored.md) - Output capture