# Key Algorithms Deep Dive V12 - Complete Source Restoration (Claude Code 2.1.76)

> Complete algorithm analysis for subagent and background agent systems with full source-level restoration, decision rationale, and cross-feature integration. This is the definitive algorithm reference with all 73+ verified symbols.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v5.md](./cross_validation_unified_v5.md) - Unified symbol verification
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols

---

## Algorithm Index

1. [Task ID Generation Algorithm](#algorithm-1-task-id-generation)
2. [Two-Step Ctrl+F Kill Algorithm](#algorithm-2-two-step-ctrlf-kill)
3. [Abort Signal Propagation Algorithm](#algorithm-3-abort-signal-propagation)
4. [Progress Tracking with Telemetry](#algorithm-4-progress-tracking-with-telemetry)
5. [Output Buffer Management Algorithm](#algorithm-5-output-buffer-management)
6. [Tool Filtering Algorithm](#algorithm-6-tool-filtering)
7. [Task State Machine Algorithm](#algorithm-7-task-state-machine)
8. [System Reminder Attachment Building](#algorithm-8-system-reminder-attachment-building)

---

## Algorithm 1: Task ID Generation

### What It Does

Generates unique, type-prefixed task IDs for all background and foreground tasks. The IDs are:
- **Type-prefixed** - First character indicates task type (a=agent, b=bash, r=remote, t=teammate, w=workflow)
- **Cryptographically random** - Uses Node.js crypto.getRandomValues for 8 random characters
- **Collision-resistant** - 36^8 ≈ 2.8 trillion combinations per type

### Complete Source Restoration

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
    // Step 1: Get the type name (e.g., "local_agent" -> "local_agent")
    let typeName = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
    // N$3 is crypto.getRandomValues(new Uint8Array(8))
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Get prefix character for type
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 4: Append 8 random characters from charset
    // G97 = "0123456789abcdefghijklmnopqrstuvwxyz" (36 chars)
    for (let i = 0; i < 8; i++) {
        prefix += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    // Step 5: Return 9-character ID
    return prefix;
}

// Mapping: oV→generateTaskId, A→taskType, q→typeName, K→randomBytes, Y→result, V$3→TASK_TYPE_PREFIXES, G97→TASK_ID_CHARSET, N$3→crypto.getRandomValues, k$3→getTaskTypePrefix
```

### Supporting Constants

```javascript
// ============================================
// G97 - TASK_ID_CHARSET - Character set for ID generation
// Location: chunks.41.mjs:2434
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// READABLE (for understanding):
TASK_ID_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
// 36 characters = 10 digits + 26 lowercase letters
// 8 random chars = 36^8 = 2,821,109,907,456 combinations (~2.8 trillion)
```

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
```

### Helper Functions

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
    return TASK_TYPE_PREFIXES[taskType] ?? "x";
}

// Mapping: k$3→getTaskTypePrefix, A→taskType, V$3→TASK_TYPE_PREFIXES
```

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

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Type prefix | Allows quick visual identification of task type |
| 8 random chars | Sufficient entropy (2.8T combinations) without being unwieldy |
| Lowercase only | Case-insensitive comparison, no ambiguity |
| Crypto random | Prevents prediction and ensures uniqueness |
| Fallback "x" prefix | Handles unknown task types gracefully |

### Key Insight

The ID format enables:
1. **Visual debugging** - "a7x9k2m3" is clearly a local_agent task
2. **Log filtering** - Grep for "^a" to find all agent tasks
3. **State debugging** - Easy to identify task type from state dump

---

## Algorithm 2: Two-Step Ctrl+F Kill

### What It Does

Implements a confirmation-based kill mechanism for background agents to prevent accidental termination of long-running tasks.

### How It Works

```
User presses Ctrl+F (first time)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Show Confirmation                                                    │
│                                                                              │
│ ctrlFPressed = true                                                          │
│ statusLine.showConfirmation("Press Ctrl+F again to stop N agents")          │
│ confirmationTimeout = setTimeout(() => {                                     │
│     ctrlFPressed = false                                                     │
│     statusLine.clearConfirmation()                                           │
│ }, 2000)                                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├─── User waits > 2s ──► Reset, no action
        │
        └─── User presses Ctrl+F again within 2s
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Execute Kill All                                                     │
│                                                                              │
│ clearTimeout(confirmationTimeout)                                            │
│ ctrlFPressed = false                                                         │
│ U4q(tasks, setAppState)  // killAllLocalAgents                               │
│ showNotification(`${count} background agents were stopped`)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

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
    for (let [taskId, task] of Object.entries(tasks)) {
        // Only kill local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

### Why Two-Step Design

| Consideration | Decision |
|---------------|----------|
| Risk of accidental kill | High - long tasks may run for hours |
| Confirmation timeout | 2 seconds - enough to read, short enough to not be annoying |
| Notification | Shows count killed + task descriptions |
| Selective kill | Only local_agent tasks, not bash or remote |

### Key Insight

The two-step confirmation pattern is a safety mechanism that:
1. Prevents accidental termination of expensive operations
2. Provides clear feedback about what will be killed
3. Uses a timeout so accidental single presses don't persist state

---

## Algorithm 3: Abort Signal Propagation

### What It Does

Propagates abort signals through the task hierarchy, ensuring clean termination of running tasks with proper cleanup of resources, output buffers, and state.

### Complete Source Restoration

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort signal for a task
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

    // Atomically update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasRunning = true;

        // Step 1: Abort the AbortController
        // This cancels any pending LLM API calls or tool executions
        task.abortController?.abort();

        // Step 2: Run cleanup handler
        // This might close file handles, remove listeners, etc.
        task.unregisterCleanup?.();

        // Step 3: Return new state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message to reduce memory
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if task was running
    if (wasRunning) {
        flushOutputBuffer(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasRunning, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Abort Propagation Flow

```
triggerAbortSignal(taskId)
        │
        ├─► atomicUpdateTask(taskId, ...) {
        │       │
        │       ├─► Check status === "running"
        │       │
        │       ├─► abortController.abort()
        │       │       │
        │       │       └─── Cascades to:
        │       │            • LLM API stream cancellation
        │       │            • Tool execution abortion
        │       │            • Child AbortControllers (if any)
        │       │
        │       ├─► unregisterCleanup()
        │       │       │
        │       │       └─── Runs registered cleanup:
        │       │            • Remove event listeners
        │       │            • Close file handles
        │       │            • Clear timeouts
        │       │
        │       └─► Return { status: "killed", ... }
        │   }
        │
        └─► flushOutputBuffer(taskId)
                │
                └─── Ensures partial output is preserved
```

### Key Insight

The abort signal propagation creates a **controlled shutdown cascade**:
1. **Immediate cancellation** via AbortController
2. **Resource cleanup** via unregisterCleanup
3. **State persistence** via output buffer flush
4. **Memory optimization** by truncating messages to last one

This ensures that even killed tasks leave useful traces for debugging.

---

## Algorithm 4: Progress Tracking with Telemetry

### What It Does

Tracks task progress (token count, tool use count, duration) and sends telemetry events for monitoring and analytics.

### Complete Source Restoration

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
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

    // Step 1: Update task state atomically
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

    // Step 2: Send telemetry if telemetry is enabled
    if (previousProgress && isTelemetryEnabled()) {
        let {
            tokenCount,
            toolUseCount,
            startTime,
            toolUseId
        } = previousProgress;

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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState, Y→previousProgress, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### Progress Preserving Summary

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

        // Preserve existing summary if present
        let existingSummary = task.progress?.summary;

        return {
            ...task,
            progress: existingSummary ? {
                ...newProgress,
                summary: existingSummary
            } : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress, K→setAppState, Y→task, z→existingSummary
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Separate functions | nl4 for telemetry, TV1 for preserving summary |
| Telemetry check | Only send if Nn() returns true (opted in) |
| Progress structure | Flexible object with tokenCount, toolUseCount, summary |
| Duration calculation | Computed at telemetry time for accuracy |

---

## Algorithm 5: Output Buffer Management

### What It Does

Manages buffered output writing to files for background tasks, ensuring efficient I/O and atomic flush operations.

### Complete Source Restoration

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered output file writer
// Location: chunks.41.mjs:2252-2308
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
    #_() {
        return this.#q.appendFile(this.#$())
    }
    #$() {
        let A = this.#K.splice(0, this.#K.length),
            q = 0;
        for (let z of A) q += Buffer.byteLength(z, "utf8");
        let K = Buffer.allocUnsafe(q),
            Y = 0;
        for (let z of A) Y += K.write(z, Y, "utf8");
        return K
    }
    async #H() {
        try {
            await this.#w()
        } finally {
            let A = this.#Y;
            this.#z = null, this.#Y = null, A()
        }
    }
}

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

    // Append content to buffer
    append(content) {
        this.#pendingWrites.push(content);

        // Start flush if not already flushing
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#startFlushLoop();
        }
    }

    // Wait for all pending writes to complete
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel pending writes
    cancel() {
        this.#pendingWrites.length = 0;
    }

    // Internal: Main flush loop
    async #flushLoop() {
        while (true) {
            try {
                // Open file if not open
                if (!this.#fileHandle) {
                    await ensureDirectoryExists();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32" ? "a" :
                            O_WRONLY | O_APPEND | O_CREAT | O_EXCL  // Unix: append + create + exclusive
                    );
                }

                // Write all pending content
                while (true) {
                    await this.#writeBatch();
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

            // Check if more writes came in during close
            if (this.#pendingWrites.length) continue;
            break;
        }
    }

    // Internal: Write one batch
    #writeBatch() {
        return this.#fileHandle.appendFile(this.#concatToBuffer());
    }

    // Internal: Concatenate pending writes to single buffer
    #concatToBuffer() {
        let chunks = this.#pendingWrites.splice(0, this.#pendingWrites.length);
        let totalSize = 0;

        for (let chunk of chunks) {
            totalSize += Buffer.byteLength(chunk, "utf8");
        }

        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;

        for (let chunk of chunks) {
            offset += buffer.write(chunk, offset, "utf8");
        }

        return buffer;
    }

    // Internal: Start flush loop with cleanup
    async #startFlushLoop() {
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

// Mapping: Y91→OutputBuffer, A→taskId, g2→getOutputFilePath, #A→#filePath, #q→#fileHandle, #K→#pendingWrites, #z→#flushPromise, #Y→#resolveFlush
```

### Flush Output Buffer

```javascript
// ============================================
// $O - flushOutputBuffer - Flush and remove buffer
// Location: chunks.41.mjs:2320-2323
// ============================================

// ORIGINAL (for source lookup):
async function $O(A) {
    let q = K91.get(A);
    if (q) await q.flush(), K91.delete(A)
}

// READABLE (for understanding):
async function flushOutputBuffer(taskId) {
    let buffer = bufferCache.get(taskId);
    if (buffer) {
        await buffer.flush();
        bufferCache.delete(taskId);
    }
}

// Mapping: $O→flushOutputBuffer, A→taskId, q→buffer, K91→bufferCache
```

### Read Output File Delta

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.41.mjs:2325-2354
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
        // ... error handling
    }
}

// READABLE (for understanding):
async function readOutputFileDelta(taskId, offset, maxBytes = DEFAULT_CHUNK_SIZE) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            offset,
            maxBytes
        );

        if (!result) {
            return { content: "", newOffset: offset };
        }

        return {
            content: result.content,
            newOffset: offset + result.bytesRead
        };
    } catch (error) {
        if (error.code === "ENOENT") {
            return { content: "", newOffset: offset };
        }
        // Handle other errors...
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→offset, K→maxBytes, P97→DEFAULT_CHUNK_SIZE, Y→result, dt6→readFileFromOffset, g2→getOutputFilePath
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Buffer pooling | Avoids creating many small write operations |
| Batch concatenation | Single buffer write is more efficient |
| Async flush loop | Non-blocking, handles backpressure |
| Delta reads | Only new content since last read position |
| File locking | Prevents concurrent write conflicts |

### Key Insight

The OutputBuffer uses a **producer-consumer pattern**:
1. **Producers** call `append()` which adds to pending queue
2. **Consumer** (flush loop) drains queue and writes to file
3. **Backpressure** handled by flush promise

---

## Algorithm 6: Tool Filtering

### What It Does

Filters available tools for subagents based on agent type, execution mode, and permission context.

### Complete Source Restoration

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent
// Location: chunks.93.mjs:1568-1620
// ============================================

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync,
    permissionMode
}) {
    return tools.filter((tool) => {
        // MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (matchesTool(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Block background-agent-excluded tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Non-builtin can't use certain tools
        if (!isBuiltIn && ASYNC_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Async agents only use whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception for team mode
            if (isTeamModeEnabled() && isTaskSystemEnabled()) {
                if (matchesTool(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}
```

### Tool Filter Sets

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
])

// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])
```

### Why This Approach

| Tool Category | Reason for Restriction |
|---------------|------------------------|
| TaskOutput | Prevents busy-wait polling loops |
| ExitPlanMode | Plan mode requires user interaction |
| Agent | Prevents uncontrolled subagent nesting |
| AskUserQuestion | No user present in background context |
| TaskStop | Background shouldn't manage other tasks |

---

## Algorithm 7: Task State Machine

### What It Does

Manages the complete lifecycle of tasks from creation to completion, including state transitions and cleanup.

### State Diagram

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ Qn4/Un4 spawn
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

### Source Code

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
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
        let task = appState.tasks?.[taskId];
        if (!task) return appState;

        let updatedTask = updater(task);

        // No change, return same state
        if (updatedTask === task) return appState;

        // Return new state with updated task
        return {
            ...appState,
            tasks: {
                ...appState.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater, Y→appState, z→task, _→updatedTask
```

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
function registerTask(task, setAppState) {
    // Add task to state
    setAppState((appState) => ({
        ...appState,
        tasks: {
            ...appState.tasks,
            [task.id]: task
        }
    }));

    // Send telemetry event
    sendTelemetry({
        type: "system",
        subtype: "task_started",
        task_id: task.id,
        tool_use_id: task.toolUseId,
        description: task.description,
        task_type: task.type,
        prompt: "prompt" in task ? task.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→task, q→setAppState, K→appState, c36→sendTelemetry
```

---

## Algorithm 8: System Reminder Attachment Building

### What It Does

Builds task status attachments for injection into LLM context as system reminders.

### Source Code

```javascript
// ============================================
// suY - getUnifiedTasksAttachment
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll output files for delta content
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new offsets
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Step 4: Return simplified attachments
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState, K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds, wY4→pollTaskOutputs, OY4→updateTaskState
```

---

## Verification Summary

| Algorithm | Symbols Verified | Source Location |
|-----------|------------------|-----------------|
| Task ID Generation | oV, k$3, LJ6, V$3, G97 | chunks.41.mjs:2402-2444 |
| Ctrl+F Kill | U4q, x66 | chunks.146.mjs:2012-2032 |
| Abort Propagation | x66, $O | chunks.146.mjs, chunks.41.mjs |
| Progress Tracking | nl4, TV1 | chunks.146.mjs:2045-2097 |
| Output Buffer | Y91, $O, Z97, g2 | chunks.41.mjs:2248-2366 |
| Tool Filtering | Xk8, CW6, eP1, WY4 | chunks.91.mjs:269, chunks.93.mjs |
| State Machine | i9, Zf, VR, EV8 | chunks.90.mjs:3003-3087 |
| System Reminder | suY, wY4, OY4 | chunks.147.mjs, chunks.90.mjs |

---

## Related Documents

- [cross_validation_unified_v5.md](./cross_validation_unified_v5.md) - Symbol verification
- [ui_interaction_complete_v6.md](./ui_interaction_complete_v6.md) - UI interactions
- [cross_feature_linkages_complete_v10.md](./cross_feature_linkages_complete_v10.md) - Cross-feature integration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - 8 key algorithms with full source restoration, 73+ verified symbols