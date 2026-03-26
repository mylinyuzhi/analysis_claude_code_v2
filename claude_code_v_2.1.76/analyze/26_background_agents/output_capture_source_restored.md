# Output Capture System - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the output file system for background tasks.
> Includes task ID generation, output file paths, and incremental read/write operations.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getOutputFilePath` (g2) - Get output file path for task — `chunks.41.mjs:2248`
- `createTaskId` (oV) - Generate unique task ID — `chunks.41.mjs:2410`
- `createTaskRecord` (RG) - Create task state object — `chunks.41.mjs:2418`
- `pollTaskOutputs` (wY4) - Poll task output files — `chunks.90.mjs:3058`
- `updateTaskOffsets` (OY4) - Update task state after polling — `chunks.90.mjs:3087`
- `TASK_TYPE_PREFIXES` (V$3) - Task ID prefix mapping — `chunks.41.mjs:2438`
- `TASK_ID_CHARSET` (G97) - Character set for IDs — `chunks.41.mjs:2434`

---

## Overview

The output capture system provides persistent, file-based storage for background task output. This enables:

1. **Persistence** - Output survives crashes and restarts
2. **Incremental reads** - LLM can check progress without blocking
3. **Simple API** - Standard file operations

---

## Task ID Generation

### createTaskId (oV)

**What it does:** Generates a unique task ID with a type prefix for human readability.

**Algorithm:**
1. Get the single-character prefix for the task type
2. Generate 8 random alphanumeric characters
3. Combine into `{prefix}{random}`

```javascript
// ============================================
// oV - createTaskId - Generate unique task ID with type prefix
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
    // Get prefix for task type
    let prefix = TASK_TYPE_PREFIXES[taskType];

    // Generate 8 random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Build ID from prefix + random characters
    let taskId = prefix;

    for (let i = 0; i < 8; i++) {
        taskId += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    return taskId;
}

// Mapping: oV→createTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
// k$3→getTaskTypePrefix, N$3→crypto.getRandomValues, G97→TASK_ID_CHARSET
```

### TASK_TYPE_PREFIXES (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task ID prefix mapping
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
    local_bash: "b",              // Shell command tasks
    local_agent: "a",             // Local subagent tasks
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### TASK_ID_CHARSET (G97)

```javascript
// ============================================
// G97 - TASK_ID_CHARSET - Character set for task IDs
// Location: chunks.41.mjs:2434
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// READABLE (for understanding):
const TASK_ID_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";

// Mapping: G97→TASK_ID_CHARSET
```

**ID Format Examples:**
- `a3f4b2c1` - local_agent task
- `b7d9e2f4` - local_bash task
- `t1a2b3c4` - in_process_teammate task

---

## Output File Path

### getOutputFilePath (g2)

**What it does:** Returns the path to the output file for a given task ID.

```javascript
// ============================================
// g2 - getOutputFilePath - Get output file path for task
// Location: chunks.41.mjs:2248-2250
// ============================================

// ORIGINAL (for source lookup):
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→path.join, yJ6→getTasksDirectory
```

**Path Structure:**
```
~/.claude/tasks/{taskId}.output
```

**Examples:**
- `~/.claude/tasks/a3f4b2c1.output` - Output for agent task
- `~/.claude/tasks/b7d9e2f4.output` - Output for bash task

---

## Task Record Creation

### createTaskRecord (RG)

**What it does:** Creates a task state object with all required fields.

```javascript
// ============================================
// RG - createTaskRecord - Create task state object
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
        id: taskId,
        type: taskType,
        status: "pending",
        description: description,
        toolUseId: toolUseId,
        startTime: Date.now(),
        outputFile: getOutputFilePath(taskId),
        outputOffset: 0,
        notified: false
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId,
// g2→getOutputFilePath
```

---

## Output File Class (Y91)

**What it does:** Async buffered writer for output files with flush support.

### Source Code

```javascript
// ============================================
// Y91 - OutputFileWriter - Async buffered output writer
// Location: chunks.41.mjs:2252-2300
// ============================================

// ORIGINAL (for source lookup):
class Y91 {
    #A;
    #q = null;
    #K = [];
    #z = null;
    #Y = null;
    constructor(A) {
        this.#A = g2(A)
    }
    append(A) {
        if (this.#K.push(A), !this.#z) this.#z = new Promise((q) => {
            this.#Y = q
        }), this.#H()
    }
    flush() {
        return this.#z ?? Promise.resolve()
    }
    cancel() {
        this.#K.length = 0
    }
    async #w() {
        while (!0) {
            try {
                if (!this.#q) await Y38(), this.#q = await M97(this.#A, process.platform === "win32" ? "a" : U46.O_WRONLY | U46.O_APPEND | U46.O_CREAT | X97);
                while (!0)
                    if (await this.#_(), this.#K.length === 0) break
            } finally {
                if (this.#q) {
                    let A = this.#q;
                    this.#q = null, await A.close()
                }
            }
            if (this.#K.length) continue;
            break
        }
    }
}

// READABLE (for understanding):
class OutputFileWriter {
    #filePath;
    #fileHandle = null;
    #pendingWrites = [];
    #flushPromise = null;
    #resolveFlush = null;

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    // Add content to write queue
    append(content) {
        this.#pendingWrites.push(content);

        // Start write loop if not already running
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#writeLoop();
        }
    }

    // Wait for all pending writes to complete
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel all pending writes
    cancel() {
        this.#pendingWrites.length = 0;
    }

    // Main write loop
    async #writeLoop() {
        while (true) {
            try {
                // Open file if not open
                if (!this.#fileHandle) {
                    await ensureDirectoryExists();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32"
                            ? "a"  // Windows: simple append
                            : fs.constants.O_WRONLY | fs.constants.O_APPEND |
                              fs.constants.O_CREAT | fs.constants.O_EXCL
                    );
                }

                // Process all pending writes
                while (true) {
                    await this.#processBatch();
                    if (this.#pendingWrites.length === 0) break;
                }
            } finally {
                // Close file handle
                if (this.#fileHandle) {
                    let handle = this.#fileHandle;
                    this.#fileHandle = null;
                    await handle.close();
                }
            }

            // Check if more writes came in while closing
            if (this.#pendingWrites.length) continue;
            break;
        }
    }
}

// Mapping: Y91→OutputFileWriter, #A→#filePath, #q→#fileHandle, #K→#pendingWrites,
// g2→getOutputFilePath, M97→fs.open, Y38→ensureDirectoryExists
```

### Key Design Decisions

**Buffered Writes:**
- Content is queued in `#pendingWrites` array
- Writes are batched for efficiency
- Flush promise allows waiting for completion

**Async Write Loop:**
- Non-blocking - doesn't block the main thread
- Automatic retry if writes come in during close
- Clean file handle management

**Platform-Specific Flags:**
- Windows: Simple append mode ("a")
- Unix: O_WRONLY | O_APPEND | O_CREAT | O_EXCL for atomic creation

---

## Polling Task Outputs

### pollTaskOutputs (wY4)

**What it does:** Iterates through all tasks and polls their output files for updates.

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll task output files
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
        // Handle terminal tasks that have been notified
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Remove from state
                    evictedTaskIds.push(task.id);
                    continue;

                case "pending":
                    // Skip pending tasks
                    continue;

                case "running":
                    // Continue to poll
                    break;
            }
        }

        // Poll running tasks for output
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
// Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

### updateTaskOffsets (OY4)

**What it does:** Updates task state with new offsets and removes evicted tasks.

```javascript
// ============================================
// OY4 - updateTaskOffsets - Update task state after polling
// Location: chunks.90.mjs:3087-3100
// ============================================

// ORIGINAL (for source lookup):
function OY4(A, q, K) {
    let Y = Object.keys(q);
    if (Y.length === 0 && K.length === 0) return;
    A((z) => {
        let _ = {
            ...z.tasks
        };
        for (let w of Y) _[w] = {
            ..._[w],
            outputOffset: q[w]
        };
        for (let w of K) {
            let {
                [w]: O, ...$
            } = _;
            _ = $
        }
        return {
            ...z,
            tasks: _
        }
    })
}

// READABLE (for understanding):
function updateTaskOffsets(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetKeys = Object.keys(updatedTaskOffsets);

    // Early return if nothing to update
    if (offsetKeys.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let tasks = { ...state.tasks };

        // Update offsets for tasks with new output
        for (let taskId of offsetKeys) {
            tasks[taskId] = {
                ...tasks[taskId],
                outputOffset: updatedTaskOffsets[taskId]
            };
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            let { [taskId]: removed, ...remaining } = tasks;
            tasks = remaining;
        }

        return {
            ...state,
            tasks: tasks
        };
    });
}

// Mapping: OY4→updateTaskOffsets, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Task Output Flow                                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   Task Created      │
                    │   createTaskRecord  │
                    │   (RG)              │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Task ID Generated │
                    │   createTaskId      │
                    │   (oV)              │
                    │                     │
                    │   e.g., "a3f4b2c1"  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Output File Path  │
                    │   getOutputFilePath │
                    │   (g2)              │
                    │                     │
                    │   ~/.claude/tasks/  │
                    │   a3f4b2c1.output   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Task Running      │
                    │                     │
                    │   OutputFileWriter  │
                    │   (Y91)             │
                    │   • append()        │
                    │   • flush()         │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
   ┌─────────────────────┐         ┌─────────────────────┐
   │  Incremental Reads  │         │   Task Completes    │
   │                     │         │                     │
   │  pollTaskOutputs    │         │   markTaskCompleted │
   │  (wY4)              │         │   ($m8)             │
   │                     │         │                     │
   │  • Read from offset │         │   • Final flush     │
   │  • Update offset    │         │   • Close file      │
   └──────────┬──────────┘         └──────────┬──────────┘
              │                                 │
              ▼                                 ▼
   ┌─────────────────────┐         ┌─────────────────────┐
   │  updateTaskOffsets  │         │   Task Evicted      │
   │  (OY4)              │         │                     │
   │                     │         │   removeTask        │
   │  • Update state     │         │   (VR)              │
   │  • Evict completed  │         │                     │
   └─────────────────────┘         └─────────────────────┘
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `oV` | createTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskOffsets | chunks.90.mjs:3087 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | ✓ Verified |
| `Y91` | OutputFileWriter | chunks.41.mjs:2252 | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers
- [system_reminder_producers_complete.md](./system_reminder_producers_complete.md) - Attachment producers
- [../08_subagent/task_id_generation.md](../08_subagent/task_id_generation.md) - Task ID algorithm