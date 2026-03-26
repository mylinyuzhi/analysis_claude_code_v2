# Task Creation Complete Source (Claude Code 2.1.76)

> Complete source-level documentation for background agent task creation.
> Cross-validated against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `generateTaskId` (oV) - Generate unique task ID — `chunks.41.mjs:2410`
- `createTaskRecord` (RG) - Create task record object — `chunks.41.mjs:2418`
- `createBackgroundAgentTask` (Qn4) — `chunks.146.mjs:2133`
- `createForegroundAgentTask` (Un4) — `chunks.146.mjs:2165`
- `getOutputFilePath` (g2) - Get output file path — `chunks.41.mjs:2248`
- `readOutputFileDelta` (Z97) - Read incremental output — `chunks.41.mjs:2325`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Task Creation Architecture                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                        AgentTool.call()                              │     │
│  └───────────────────────────────┬────────────────────────────────────┘     │
│                                  │                                          │
│              ┌───────────────────┼───────────────────┐                     │
│              │                   │                   │                     │
│              ▼                   ▼                   ▼                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│   │ run_in_background│  │ Foreground with  │  │ Teammate mode    │        │
│   │ = true           │  │ autoBackgroundMs │  │ (name+team_name) │        │
│   └────────┬─────────┘  └────────┬─────────┘  └──────────────────┘        │
│            │                     │                                          │
│            ▼                     ▼                                          │
│   ┌──────────────────┐  ┌──────────────────┐                               │
│   │createBackground  │  │createForeground  │                               │
│   │AgentTask (Qn4)   │  │AgentTask (Un4)   │                               │
│   └────────┬─────────┘  └────────┬─────────┘                               │
│            │                     │                                          │
│            └──────────┬──────────┘                                          │
│                       │                                                     │
│                       ▼                                                     │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                    Task Creation Pipeline                          │    │
│   │                                                                     │    │
│   │  1. generateTaskId() → "local_agent_abc123..."                     │    │
│   │  2. createTaskRecord() → { id, type, description, ... }           │    │
│   │  3. initOutputFile() → ~/.claude/tasks/{id}.output                │    │
│   │  4. createAbortController() → for cancellation                    │    │
│   │  5. registerTask() → add to appState.tasks                        │    │
│   │  6. registerCleanupHandler() → cleanup on process exit            │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task ID Generation (oV)

### What It Does

Generates a unique task ID with a type prefix for easy identification.

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID with type prefix
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = V$3[A] ?? A;
    return `${q}_${k$3()}`
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Get prefix for task type, or use taskType directly
    let prefix = TASK_TYPE_PREFIXES[taskType] ?? taskType;

    // Generate unique ID: "{prefix}_{uuid}"
    return `${prefix}_${crypto.randomUUID()}`;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, V$3→TASK_TYPE_PREFIXES, k$3→crypto.randomUUID
```

### Task Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task ID prefix mapping
// Location: chunks.41.mjs:2438-2444
// ============================================

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = {
    "local_agent": "agent",
    "local_bash": "bash",
    "in_process_teammate": "teammate",
    "local_workflow": "workflow",
    "remote_agent": "remote"
};

// Examples:
// generateTaskId("local_agent") → "agent_a1b2c3d4-e5f6-7890-abcd-ef1234567890"
// generateTaskId("local_bash") → "bash_f1e2d3c4-b5a6-0987-6543-210fedcba987"
```

---

## Task Record Creation (RG)

### Source Code

```javascript
// ============================================
// RG - createTaskRecord - Create task record object
// Location: chunks.41.mjs:2418-2436
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        description: K,
        toolUseId: Y,
        status: "pending",
        startTime: Date.now(),
        outputOffset: 0,
        notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,
        type: taskType,
        description: description,
        toolUseId: toolUseId,

        // Initial state
        status: "pending",      // pending → running → completed/failed/killed
        startTime: Date.now(),
        outputOffset: 0,        // Byte offset for incremental reads
        notified: false         // Has completion been notified?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId
```

---

## Background Agent Task Creation (Qn4)

### What It Does

Creates a background agent task that runs asynchronously without blocking the main conversation.

### Source Code

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
    // Initialize output file
    initOutputFile(agentId, getAgentOutputPath(agentId));

    // Create abort controller (child of parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : createAbortController();

    // Build task record
    let task = {
        // From base record
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),

        // Override/add background-specific fields
        type: "local_agent",
        status: "running",        // Immediately running (not pending)
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,

        // Background-specific tracking
        retrieved: false,         // Has output been retrieved?
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,     // Explicitly backgrounded
        pendingMessages: []       // Messages waiting to be processed
    };

    // Register cleanup handler (kills agent on process exit)
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    task.unregisterCleanup = unregisterCleanup;

    // Register task in state
    registerTask(task, setAppState);

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent,
//          z→setAppState, _→parentAbortController, w→toolUseId, O→abortController, $→task,
//          H→unregisterCleanup, Co→initOutputFile, Wm→createChildAbortController, sK→createAbortController,
//          RG→createTaskRecord, E4→registerCleanupHandler, x66→triggerAbortSignal, Zf→registerTask
```

### Key Design Decisions

**Why isBackgrounded = true?**
- Distinguishes explicitly-backgrounded tasks from mid-run backgrounded tasks
- Used by UI to show different status indicators
- Affects which tools are available to the agent

**Why create child abort controller?**
- Allows parent to abort all children
- Maintains abort hierarchy for coordinated cancellation
- Child aborts when parent aborts

---

## Foreground Agent Task Creation (Un4)

### What It Does

Creates a foreground agent task that blocks until completion, with optional auto-backgrounding after a timeout.

### Source Code

```javascript
// ============================================
// Un4 - createForegroundAgentTask - Create foreground agent task
// Location: chunks.146.mjs:2165-2210
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

    // ... mid-run backgrounding logic ...

    return {
        task: H,
        backgroundSignal: J
    };
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
    // Initialize output file
    initOutputFile(agentId, getAgentOutputPath(agentId));

    // Create abort controller
    let abortController = createAbortController();

    // Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Build task record
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
        isBackgrounded: false,    // Foreground (may be backgrounded later)
        pendingMessages: []
    };

    // Create background signal Promise for mid-run backgrounding
    let resolveBackgroundSignal;
    let backgroundSignal = new Promise((resolve) => {
        resolveBackgroundSignal = resolve;
    });

    // Store resolver for later use (by mid-run backgrounding)
    backgroundSignalResolvers.set(agentId, resolveBackgroundSignal);

    // Register task in state
    registerTask(task, setAppState);

    // ... mid-run backgrounding logic continues ...

    return {
        task: task,
        backgroundSignal: backgroundSignal  // Resolved when backgrounded
    };
}

// Mapping: Un4→createForegroundAgentTask, A→agentId, q→description, K→prompt, Y→selectedAgent,
//          z→setAppState, _→autoBackgroundMs, w→toolUseId, O→abortController, $→unregisterCleanup,
//          H→task, j→resolveBackgroundSignal, J→backgroundSignal, lT6→backgroundSignalResolvers
```

### Mid-Run Backgrounding

Foreground tasks can be converted to background tasks mid-execution:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Mid-Run Backgrounding Flow                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. User presses Ctrl+B (or autoBackgroundMs timeout)                      │
│                                                                              │
│   2. backgroundSignal Promise resolves                                       │
│      └─ resolveBackgroundSignal({ type: "background" })                     │
│                                                                              │
│   3. Agent execution continues in background                                │
│      └─ task.isBackgrounded = true                                          │
│      └─ UI updates to show background status                                │
│                                                                              │
│   4. Main conversation unblocks                                              │
│      └─ AgentTool returns { status: "async_launched" }                      │
│                                                                              │
│   5. Background agent continues until completion                            │
│      └─ markTaskCompleted($m8) or markTaskFailed(Hm8)                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Output File System

### getOutputFilePath (g2)

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
    // ~/.claude/tasks/{taskId}.output
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→path.join, yJ6→getTasksDirectory
```

### readOutputFileDelta (Z97)

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.41.mjs:2325-2346
// ============================================

// ORIGINAL (for source lookup):
async function Z97(A, q, K = P97) {
    try {
        let Y = await dt6(g2(A), q, K);
        if (!Y) return {
            content: "",
            newOffset: q
        };
        return {
            content: Y.content,
            newOffset: q + Y.bytesRead
        }
    } catch (Y) {
        if (Y.code === "ENOENT") return {
            content: "",
            newOffset: q
        };
        return _6(Y), {
            content: "",
            newOffset: q
        }
    }
}

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset, options = DEFAULT_OPTIONS) {
    try {
        // Read from current offset
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            currentOffset,
            options  // { maxBytes: 8MB }
        );

        if (!result) {
            return { content: "", newOffset: currentOffset };
        }

        return {
            content: result.content,
            newOffset: currentOffset + result.bytesRead
        };

    } catch (error) {
        // Handle file not found
        if (error.code === "ENOENT") {
            return { content: "", newOffset: currentOffset };
        }

        // Log and return empty on other errors
        logError(error);
        return { content: "", newOffset: currentOffset };
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→currentOffset, K→options,
//          dt6→readFileFromOffset, g2→getOutputFilePath, P97→DEFAULT_OPTIONS (8MB)
```

### Output Buffer Class (Y91)

```javascript
// ============================================
// Y91 - OutputBuffer - Async output buffer class
// Location: chunks.41.mjs:2252-2308
// ============================================

// READABLE (for understanding):
class OutputBuffer {
    #filePath;
    #fileHandle = null;
    #pendingWrites = [];
    #flushPromise = null;
    #resolveFlush = null;

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    // Add content to pending writes
    append(content) {
        this.#pendingWrites.push(content);

        // Start flush if not already running
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#doFlush();
        }
    }

    // Wait for all pending writes to complete
    async flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel pending writes
    cancel() {
        this.#pendingWrites.length = 0;
    }

    // Internal flush loop
    async #flushLoop() {
        while (true) {
            try {
                // Ensure tasks directory exists
                if (!this.#fileHandle) {
                    await ensureTasksDirectory();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32" ? "a" : O_WRONLY | O_APPEND | O_CREAT | O_NOCTTY
                    );
                }

                // Write all pending content
                while (true) {
                    await this.#writePending();
                    if (this.#pendingWrites.length === 0) break;
                }

            } finally {
                if (this.#fileHandle) {
                    let handle = this.#fileHandle;
                    this.#fileHandle = null;
                    await handle.close();
                }
            }

            // Check if more writes arrived
            if (this.#pendingWrites.length) continue;
            break;
        }
    }

    // Write pending content to file
    async #writePending() {
        return this.#fileHandle.appendFile(this.#buildBuffer());
    }

    // Build buffer from pending writes
    #buildBuffer() {
        let pending = this.#pendingWrites.splice(0, this.#pendingWrites.length);
        let totalBytes = 0;
        for (let content of pending) {
            totalBytes += Buffer.byteLength(content, "utf8");
        }

        let buffer = Buffer.allocUnsafe(totalBytes);
        let offset = 0;
        for (let content of pending) {
            offset += buffer.write(content, offset, "utf8");
        }

        return buffer;
    }

    // Complete flush promise
    async #completeFlush() {
        try {
            await this.#flushLoop();
        } finally {
            let resolve = this.#resolveFlush;
            this.#flushPromise = null;
            this.#resolveFlush = null;
            resolve();
        }
    }
}

// Mapping: Y91→OutputBuffer, g2→getOutputFilePath
```

---

## Task State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Task State Machine                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌──────────┐                                   │
│                              │ pending  │                                   │
│                              └────┬─────┘                                   │
│                                   │ start()                                 │
│                                   ▼                                         │
│                            ┌──────────────┐                                 │
│                   ┌────────│   running    │────────┐                        │
│                   │        └──────────────┘        │                        │
│                   │               │                │                        │
│         complete │               │ kill           │ fail                   │
│                   ▼               ▼                ▼                        │
│            ┌───────────┐   ┌───────────┐   ┌───────────┐                   │
│            │ completed │   │  killed   │   │  failed   │                   │
│            └───────────┘   └───────────┘   └───────────┘                   │
│                                                                              │
│  State Transitions:                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  pending → running   : Task started execution                               │
│  running → completed : Task finished successfully ($m8)                     │
│  running → failed    : Task threw error (Hm8)                               │
│  running → killed    : Task was aborted (d4q)                               │
│                                                                              │
│  Terminal States: completed, failed, killed                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Terminal tasks are evicted after notification                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration with System Reminders

Tasks integrate with the system reminder system via:

| Function | Integration |
|----------|-------------|
| `suY` | `getUnifiedTasksAttachment` - Builds task_status attachments |
| `nl4` | `updateTaskProgressWithTelemetry` - Updates progress, sends telemetry |
| `wY4` | `pollTaskOutputs` - Polls output files for system reminder |
| `OY4` | `updateTaskState` - Updates state after polling |

---

## Verification Status

| Symbol | Location | Verification |
|--------|----------|--------------|
| `oV` | chunks.41.mjs:2410 | ✓ Direct source match |
| `RG` | chunks.41.mjs:2418 | ✓ Direct source match |
| `Qn4` | chunks.146.mjs:2133 | ✓ Direct source match |
| `Un4` | chunks.146.mjs:2165 | ✓ Direct source match |
| `g2` | chunks.41.mjs:2248 | ✓ Direct source match |
| `Z97` | chunks.41.mjs:2325 | ✓ Direct source match |

---

## Related Documents

- [kill_mechanism_complete_v2.md](./kill_mechanism_complete_v2.md) - Kill mechanism
- [progress_tracking_complete.md](./progress_tracking_complete.md) - Progress tracking
- [task_lifecycle_complete_v3.md](./task_lifecycle_complete_v3.md) - Task lifecycle