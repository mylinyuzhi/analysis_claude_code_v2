# Key Algorithms Deep Dive (Claude Code 2.1.76)

> Complete source-level analysis of all key algorithms in the subagent and background agent systems. Each algorithm includes reasoning, trade-offs, implementation details, and dual-version code snippets. Merged from v6, v9, v12, and current versions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `generateTaskId` (oV) - Generate unique task ID with type prefix
- `killAllLocalAgents` (U4q) - Kill all running local agents
- `triggerAbortSignal` (x66) - Abort a specific task
- `updateTaskProgressWithTelemetry` (nl4) - Progress update with telemetry
- `OutputBuffer` (Y91) - Buffered output file writer
- `filterToolsForSubagent` (Xk8) - Filter tools for subagent
- `atomicUpdateTask` (i9) - Generic task state updater
- `getUnifiedTasksAttachment` (suY) - Build system reminder attachments
- `writeToMailbox` (x3) - File-lock-based mailbox write
- `countUniqueUris` (TIY) - Count unique URIs in array
- `cloneForkContext` (Fx8) - Clone fork context removing orphans
- `resolveSkillByName` (NvY) - Resolve skill name via multi-strategy lookup
- `pollForNextMessage` (DNY) - Priority-based mailbox polling

---

## Algorithm Index

1. [Task ID Generation](#algorithm-1-task-id-generation)
2. [Two-Step Ctrl+F Kill](#algorithm-2-two-step-ctrlf-kill)
3. [Abort Signal Propagation](#algorithm-3-abort-signal-propagation)
4. [Progress Tracking with Telemetry](#algorithm-4-progress-tracking-with-telemetry)
5. [Output Buffer Management](#algorithm-5-output-buffer-management)
6. [Tool Filtering](#algorithm-6-tool-filtering)
7. [Task State Machine](#algorithm-7-task-state-machine)
8. [System Reminder Attachment Building](#algorithm-8-system-reminder-attachment-building)
9. [Mailbox Lock-Based Access](#algorithm-9-mailbox-lock-based-access)
10. [URI Counting / countUniqueUris](#algorithm-10-uri-counting--countuniqueuris)
11. [Fork Context Cloning](#algorithm-11-fork-context-cloning)
12. [Skill Name Resolution](#algorithm-12-skill-name-resolution)

---

## Algorithm 1: Task ID Generation

### What It Does

Generates unique, type-prefixed task IDs for all background and foreground tasks. The IDs are:
- **Type-prefixed** - First character indicates task type (a=agent, b=bash, r=remote, t=teammate, w=workflow)
- **Cryptographically random** - Uses Node.js crypto.getRandomValues for 8 random characters
- **Collision-resistant** - 36^8 = 2,821,109,907,456 combinations per type

### How It Works

```javascript
// ============================================
// generateTaskId - Generate unique task ID with type prefix
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
    // Step 1: Get the type name
    let typeName = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
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
// TASK_ID_CHARSET - Character set for ID generation
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
// TASK_TYPE_PREFIXES - Task type to prefix mapping
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

### Helper Functions

```javascript
// ============================================
// getTaskTypePrefix - Get prefix character from task type
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
// isTerminalTaskStatus - Check if status is terminal
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
| Type prefix | Allows quick visual identification of task type in logs and UI |
| 8 random chars | Sufficient entropy (2.8T combinations) without being unwieldy |
| Lowercase only | Case-insensitive comparison, no ambiguity |
| Crypto random | Prevents prediction and ensures uniqueness |
| Fallback "x" prefix | Handles unknown task types gracefully |

### Key Insight

The ID format enables:
1. **Visual debugging** - "a7x9k2m3" is immediately recognizable as a local_agent task
2. **Log filtering** - Grep for "^a" to find all agent tasks
3. **Collision safety** - Birthday paradox suggests ~50% collision at ~1.7M IDs per type, extremely unlikely in practice

---

## Algorithm 2: Two-Step Ctrl+F Kill

### What It Does

Implements a confirmation-based kill mechanism for background agents to prevent accidental termination of long-running tasks.

### How It Works

```
User presses Ctrl+F (first time)
        |
        v
+-----------------------------------------------------------------------+
| STEP 1: Show Confirmation                                             |
|                                                                       |
| ctrlFPressed = true                                                   |
| statusLine.showConfirmation("Press Ctrl+F again to stop N agents")   |
| confirmationTimeout = setTimeout(() => {                              |
|     ctrlFPressed = false                                              |
|     statusLine.clearConfirmation()                                    |
| }, 2000)                                                              |
+-----------------------------------------------------------------------+
        |
        +--- User waits > 2s ---> Reset, no action
        |
        +--- User presses Ctrl+F again within 2s
                    |
                    v
+-----------------------------------------------------------------------+
| STEP 2: Execute Kill All                                              |
|                                                                       |
| clearTimeout(confirmationTimeout)                                     |
| ctrlFPressed = false                                                  |
| U4q(tasks, setAppState)  // killAllLocalAgents                        |
| showNotification(`${count} background agents were stopped`)           |
+-----------------------------------------------------------------------+
```

### Source Code

```javascript
// ============================================
// killAllLocalAgents - Kill all running local agents
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

### How It Works

```javascript
// ============================================
// triggerAbortSignal - Trigger abort signal for a task
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
        |
        +---> atomicUpdateTask(taskId, ...) {
        |       |
        |       +---> Check status === "running"
        |       |
        |       +---> abortController.abort()
        |       |       |
        |       |       +--- Cascades to:
        |       |            - LLM API stream cancellation
        |       |            - Tool execution abortion
        |       |            - Child AbortControllers (if any)
        |       |
        |       +---> unregisterCleanup()
        |       |       |
        |       |       +--- Runs registered cleanup:
        |       |            - Remove event listeners
        |       |            - Close file handles
        |       |            - Clear timeouts
        |       |
        |       +---> Return { status: "killed", ... }
        |   }
        |
        +---> flushOutputBuffer(taskId)
                |
                +--- Ensures partial output is preserved
```

### Parent-Child Linking

```javascript
// Child abort controller links to parent
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // If parent aborts, child aborts too
    if (parentController) {
        parentController.signal.addEventListener("abort", () => {
            childController.abort(parentController.signal.reason);
        });
    }

    return childController;
}

// Mapping: R61→createChildAbortController (chunks.6.mjs:465)
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

### How It Works

```javascript
// ============================================
// updateTaskProgressWithTelemetry - Progress update with telemetry
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

        // Capture previous progress for telemetry BEFORE update
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
// updateTaskProgressPreservingSummary - Update progress keeping summary
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
| Telemetry check | Only send if isTelemetryEnabled() returns true (opted in) |
| Progress structure | Flexible object with tokenCount, toolUseCount, summary |
| Duration calculation | Computed at telemetry time for accuracy |
| Pre-update capture | Telemetry data captured BEFORE state update for accuracy |

### Key Insight

Progress updates are throttled by the caller (typically on tool use), and telemetry is sent asynchronously. The key design is capturing telemetry data BEFORE the state update to ensure accurate values.

---

## Algorithm 5: Output Buffer Management

### What It Does

Manages buffered output writing to files for background tasks, ensuring efficient I/O and atomic flush operations.

### How It Works

```javascript
// ============================================
// OutputBuffer - Buffered output file writer
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

    // Append content to buffer (non-blocking)
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
                // Open file if not open (lazy)
                if (!this.#fileHandle) {
                    await ensureDirectoryExists();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32" ? "a" :
                            O_WRONLY | O_APPEND | O_CREAT | O_EXCL
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
// flushOutputBuffer - Flush and remove buffer from cache
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
// readOutputFileDelta - Read incremental output since last offset
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
| Batch concatenation | Single buffer write is more efficient than many small writes |
| Async flush loop | Non-blocking, handles backpressure naturally |
| Delta reads | Only new content since last read position |
| Lazy file open | Only opens when first write occurs |
| Platform-specific flags | Windows vs Unix file modes |

### Key Insight

The OutputBuffer uses a **producer-consumer pattern**:
1. **Producers** call `append()` which adds to pending queue (non-blocking)
2. **Consumer** (flush loop) drains queue and writes to file
3. **Backpressure** handled by flush promise
4. **Coalescing** multiple appends into a single write syscall

---

## Algorithm 6: Tool Filtering

### What It Does

Filters available tools for subagents based on agent type, execution mode, and permission context.

### How It Works

```javascript
// ============================================
// filterToolsForSubagent - Filter tools based on subagent type
// Location: chunks.93.mjs:1568-1620
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // RULE 1: MCP tools are always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // RULE 2: Plan mode uses special tools
        if (hasToolPermission(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // RULE 3: Always exclude certain tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // RULE 4: Non-built-in tools have additional restrictions
        if (!isBuiltIn && NON_BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 5: Async/background agents have strict whitelist
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: If async tool override is enabled (teammates)
            if (isTeamModeEnabled() && isTaskSystemEnabled()) {
                // Allow Agent tool + team delegate tools
                if (hasToolPermission(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync,
//          Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS,
//          xV8→NON_BUILTIN_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS
```

### Decision Tree

```
For each tool T:
+-- T.name starts with "mcp__"?
|   +-- YES -> ALLOW
|   +-- NO -> Continue
+-- T.name == "ExitPlanMode" AND mode == "plan"?
|   +-- YES -> ALLOW
|   +-- NO -> Continue
+-- T.name in BACKGROUND_AGENT_EXCLUDED_TOOLS?
|   +-- YES -> DENY
|   +-- NO -> Continue
+-- Not built-in AND T.name in BUILTIN_EXCLUDED_TOOLS?
|   +-- YES -> DENY
|   +-- NO -> Continue
+-- isAsync?
    +-- NO -> ALLOW
    +-- YES -> Continue
        +-- T.name in ASYNC_AGENT_ALLOWED_TOOLS?
        |   +-- YES -> ALLOW
        |   +-- NO -> Continue
        +-- Is teammate (AgentTeams + InProcess)?
            +-- NO -> DENY
            +-- YES -> Continue
                +-- T.name == "Agent" OR T.name in TEAM_DELEGATE_TOOLS?
                    +-- YES -> ALLOW
                    +-- NO -> DENY
```

### Tool Filter Sets

```javascript
// BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6) - chunks.91.mjs:269
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
])

// ASYNC_AGENT_ALLOWED_TOOLS (eP1) - chunks.91.mjs:269
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])

// TEAM_DELEGATE_TOOLS (WY4) - chunks.91.mjs:269
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

### Key Insight

The filtering prevents background agents from doing anything that would block or require user interaction, while allowing teammates special delegation capabilities. The key security principle is **least privilege** - background agents get minimal tools, teammates get delegation tools.

---

## Algorithm 7: Task State Machine

### What It Does

Manages the complete lifecycle of tasks from creation to completion, including state transitions and cleanup.

### State Diagram

```
                         +-------------+
                         |   pending   |
                         |  (created)  |
                         +------+------+
                                | Qn4/Un4 spawn
                                v
                         +-------------+
            +------------|   running   |------------+
            |            +------+------+            |
            |                   |                   |
     [success]            [error]            [user kill]
       $m8                  Hm8                  x66
            |                   |                   |
            v                   v                   v
    +-------------+     +-------------+     +-------------+
    |  completed  |     |   failed    |     |   killed    |
    +------+------+     +------+------+     +------+------+
           |                   |                   |
           |         [d4q: mark notified]          |
           |                   |                   |
           +-------------------+-------------------+
                               |
                               v
                         +-------------+
                         |  notified   |
                         |  = true     |
                         +------+------+
                                | VR (removeTask)
                                v
                         +-------------+
                         |   removed   |
                         | (from state)|
                         +-------------+
```

### Source Code

```javascript
// ============================================
// atomicUpdateTask - Generic task state updater
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

        // No change, return same state (identity check)
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
// registerTask - Register task in state + send telemetry
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

### Key Insight

The state machine uses **immutable state updates** via `setAppState` with an updater function. This ensures:
1. **Atomic transitions** - No partial state visible to observers
2. **Identity-based optimization** - If updater returns same object, no re-render
3. **Predictable state** - Each transition produces a complete new state

---

## Algorithm 8: System Reminder Attachment Building

### What It Does

Builds task status attachments for injection into LLM context as system reminders. This is how the main agent loop stays aware of background task progress.

### How It Works

```javascript
// ============================================
// getUnifiedTasksAttachment - Build system reminder attachments
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

### Key Insight

The system reminder attachment building uses **delta reads** to avoid re-sending entire output files. Only new content since the last read offset is included, keeping context window usage efficient.

---

## Algorithm 9: Mailbox Lock-Based Access

### What It Does

Provides safe concurrent access to mailbox files using file-based locks. Used by teammate agents to exchange messages without data corruption.

### How It Works

```javascript
// ============================================
// writeToMailbox - File-lock-based mailbox write
// Location: chunks.132.mjs:22-55
// ============================================

// READABLE (for understanding):
const LOCK_OPTIONS = {
    stale: 10000,    // Lock considered stale after 10s
    retries: 3,      // Retry 3 times on conflict
    retryWait: 100   // Wait 100ms between retries
};

async function writeToMailbox(recipient, message, teamName) {
    let mailboxPath = getMailboxPath(recipient, teamName);
    let lockPath = `${mailboxPath}.lock`;

    // Step 1: Create file if needed (atomic)
    try {
        await fs.writeFile(mailboxPath, "[]", { flag: "wx" });
    } catch (e) {
        if (e.code !== "EEXIST") throw e;
    }

    // Step 2: Acquire lock
    let releaseLock;
    try {
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        // Step 3: Read-modify-write (atomic under lock)
        let messages = await readMailbox(recipient, teamName);
        messages.push({ ...message, read: false });
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2));

    } finally {
        // Step 4: Always release lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, Vc6→markMessageAsReadByIndex (chunks.132.mjs:57)
```

### Mailbox Polling (DNY)

```javascript
// ============================================
// pollForNextMessage - Priority-based message polling
// Location: chunks.134.mjs:1483-1568
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {...}), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return { type: "aborted" };
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1, D = null;
            // Priority 1: Shutdown requests
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) { M = P; D = Z; break }
                }
            }
            if (M !== -1) {
                await Vc6(A.agentName, A.teamName, M);
                return { type: "shutdown_request", request: D }
            }
            // Priority 2: Messages from team-lead
            // Priority 3: Any unread message
            // ...
        } catch (J) { k(`Error: ${J}`) }
        // Check for unclaimed tasks
        let j = await Ji4(_, A.agentName);
        if (j) return { type: "new_message", message: j, from: "task-list" }
    }
    return { type: "aborted" }
}

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, taskManager) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop`);
    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // PRIORITY 0: Check for pending user messages (fastest path)
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];
            setAppState((state) => ({...}));
            return { type: "new_message", message, from: "user" };
        }

        // Throttle polling (500ms delay after first poll)
        if (pollCount > 0) await sleep(500);
        pollCount++;

        if (abortController.signal.aborted) return { type: "aborted" };

        try {
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // PRIORITY 1: Shutdown requests (highest priority)
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let shutdownReq = parseShutdownRequest(msg.text);
                    if (shutdownReq) {
                        await markMessageAsReadByIndex(identity.agentName, identity.teamName, i);
                        return { type: "shutdown_request", request: shutdownReq };
                    }
                }
            }

            // PRIORITY 2: Messages from team-lead
            let teamLeadMsgIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i] && !messages[i].read && messages[i].from === "team-lead") {
                    teamLeadMsgIndex = i;
                    break;
                }
            }

            // PRIORITY 3: Any unread message
            if (teamLeadMsgIndex === -1) {
                teamLeadMsgIndex = messages.findIndex((msg) => !msg.read);
            }

            if (teamLeadMsgIndex !== -1) {
                let msg = messages[teamLeadMsgIndex];
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, teamLeadMsgIndex);
                return { type: "new_message", message: msg.text, from: msg.from };
            }
        } catch (error) {
            log(`Poll error: ${error}`);
        }

        // PRIORITY 4: Check for unclaimed tasks
        let unclaimedTask = await claimUnclaimedTask(taskManager, identity.agentName);
        if (unclaimedTask) {
            return { type: "new_message", message: unclaimedTask, from: "task-list" };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→taskManager, O→pollCount,
//          wl→readMailbox, Vc6→markMessageAsReadByIndex, M66→parseShutdownRequest,
//          Ji4→claimUnclaimedTask, jNY→sleep, BY→TEAM_LEAD_ID
```

### Priority Order

1. **Pending user messages** - Direct UI input, fastest path (in-memory check)
2. **Shutdown requests** - Coordinated termination (file-based)
3. **Team-lead messages** - Priority over other teammates (file-based)
4. **Any unread message** - General communication (file-based)
5. **Unclaimed tasks** - Auto-claim from shared task list

### Why This Approach

**File-based locks:**
- Works across processes (not just threads)
- Survives process crashes (lock file cleanup via stale detection)
- No external dependencies

**Atomic create (wx flag):**
- `wx` = write exclusive; fails if file exists
- First process wins, prevents race conditions

**Stale lock detection:**
- Locks older than 10s are considered dead
- Prevents permanent deadlock from crashes

**Trade-offs:**
- Positive: Cross-process safety, crash recovery, simple implementation
- Negative: Slightly slower than in-memory, requires filesystem access

---

## Algorithm 10: URI Counting / countUniqueUris

### Location
- `countUniqueUris` (TIY) -- `chunks.144.mjs:832`

> **Correction (v6):** TIY was previously mapped as `countTurnsSinceLastProgress`. Source code proof shows it is actually `countUniqueUris`: `function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }` -- it extracts `.uri` from an array, filters nullish values, and returns the count of unique URIs via `Set.size`. The "Progress Throttling" algorithm previously described here was incorrectly attributed to TIY; TIY is a URI counting utility, not a progress throttling function.

### What It Does

Counts the number of unique URIs in an array of objects. Used for deduplication checks (e.g., how many distinct files/resources are referenced).

### How It Works

```javascript
// ============================================
// countUniqueUris - Count unique URIs in array
// Location: chunks.144.mjs:832-835
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueUris(items) {
    // Extract URI from each item, filter out null/undefined
    let uris = items.map((item) => item.uri).filter((uri) => uri);
    // Return count of unique URIs
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, K→item/uri, q→uris
```

### Related URI Functions

```javascript
// countUniqueSourceUris (vIY) - chunks.144.mjs:837
function countUniqueSourceUris(items) {
    let uris = items.map((item) => item.sourceUri).filter((uri) => uri);
    return new Set(uris).size;
}

// countUniqueTargetUris (NIY) - chunks.144.mjs:842
function countUniqueTargetUris(items) {
    let uris = items.map((item) => item.targetUri).filter((uri) => uri);
    return new Set(uris).size;
}
```

### Why This Approach

**Set-based deduplication:**
- `new Set(uris).size` gives O(n) unique count
- Filters out nullish URIs to avoid false counts
- Simple and efficient one-liner

**Actual usage:**
- File edit tracking: Count files modified
- LSP operation stats: Unique files in operations
- Code intelligence: Track file coverage

**Trade-offs:**
- Positive: O(n) time complexity, handles null/undefined URIs gracefully, simple readable logic
- Negative: Creates intermediate array (map + filter)

---

## Algorithm 11: Fork Context Cloning

### Location
- `cloneForkContext` (Fx8) -- `chunks.133.mjs:1788`

### What It Does

Creates an isolated copy of the message context for a forked subagent, removing orphaned tool calls that lack corresponding tool results.

### How It Works

```javascript
// ============================================
// cloneForkContext - Clone fork context removing orphans
// Location: chunks.133.mjs:1788-1804
// ============================================

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Build set of tool_use IDs that have results
    let toolResultIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        toolResultIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out orphaned tool_use blocks
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if contains orphaned tool_use (no result)
                let hasOrphanedToolUse = content.some(
                    (block) => block.type === "tool_use" &&
                               block.id &&
                               !toolResultIds.has(block.id)
                );
                return !hasOrphanedToolUse;
            }
        }
        return true;
    });
}

// Mapping: Fx8→cloneForkContext
```

### Why This Approach

**Orphan removal:**
- Tool calls without results would confuse the LLM
- Could cause "waiting for result" state indefinitely
- Clean context = better agent behavior

**Two-pass algorithm:**
1. First pass: Collect all tool_result IDs from user messages
2. Second pass: Filter assistant messages with orphaned tool_uses

**Trade-offs:**
- Positive: Prevents orphaned tool_use errors, clean context for fork, O(n) time
- Negative: May remove useful context in edge cases where a tool_use is the last thing before fork

### Key Insight

When forking from a parent context, some tool_uses may have been made but not yet received results. Including these orphaned tool_uses in the subagent context would cause LLM API errors because the model expects results for all tool uses.

---

## Algorithm 12: Skill Name Resolution

### Location
- `resolveSkillByName` (NvY) -- `chunks.133.mjs:1817`

### What It Does

Resolves skill names to full identifiers using multiple lookup strategies, enabling flexible skill referencing from subagents.

### How It Works

```javascript
// ============================================
// resolveSkillByName - Resolve skill name via multi-strategy lookup
// Location: chunks.133.mjs:1817-1828
// ============================================

// READABLE (for understanding):
function resolveSkillByName(skillName, skillRegistry, agentDefinition) {
    // Step 1: Exact match
    if (skillExistsInRegistry(skillName, skillRegistry)) {
        return skillName;
    }

    // Step 2: Namespace prefix
    // Try agentType:skillName (e.g., "my-agent:my-skill")
    let agentNamespace = agentDefinition.agentType.split(":")[0];
    if (agentNamespace) {
        let namespacedName = `${agentNamespace}:${skillName}`;
        if (skillExistsInRegistry(namespacedName, skillRegistry)) {
            return namespacedName;
        }
    }

    // Step 3: Suffix match
    // Try any skill ending with :skillName
    let suffix = `:${skillName}`;
    let matchingSkill = skillRegistry.find(skill => skill.name.endsWith(suffix));
    if (matchingSkill) {
        return matchingSkill.name;
    }

    // Step 4: Not found
    return null;
}

// Mapping: NvY→resolveSkillByName
```

### Three-Tier Lookup Strategy

| Step | Strategy | Example Input | Matches |
|------|----------|---------------|---------|
| 1 | Exact match | `"my-skill"` | `"my-skill"` in registry |
| 2 | Namespace prefix | `"my-skill"` | `"my-agent:my-skill"` in registry |
| 3 | Suffix match | `"my-skill"` | Any `"*:my-skill"` in registry |

### Why This Approach

**Flexible referencing:**
- Users can reference skills by short name without knowing the namespace
- Namespace prefixing allows disambiguation when multiple skills have the same name
- Suffix matching enables cross-namespace skill discovery

**Trade-offs:**
- Positive: User-friendly short names, namespace disambiguation, cross-namespace discovery
- Negative: Suffix matching could return unexpected results if skill names collide

### Key Insight

The three-tier lookup allows flexible skill referencing:
- `"my-skill"` - Direct reference (fastest path)
- `"my-agent:my-skill"` - Namespaced reference (when agent context is known)
- `":my-skill"` - Any skill ending with `:my-skill` (broadest search)

---

## Summary

| # | Algorithm | Key Insight | Complexity |
|---|-----------|-------------|------------|
| 1 | Task ID Generation | Type prefix for visual identification | O(1) |
| 2 | Two-Step Ctrl+F Kill | Confirmation prevents accidental termination | O(k) tasks |
| 3 | Abort Signal Propagation | Controlled shutdown cascade with cleanup | O(1) per task |
| 4 | Progress Tracking | Telemetry capture before state update | O(1) |
| 5 | Output Buffer Management | Producer-consumer with write coalescing | O(n) chunks |
| 6 | Tool Filtering | Least privilege via layered filtering | O(n) tools |
| 7 | Task State Machine | Immutable atomic state transitions | O(1) |
| 8 | System Reminder Attachment | Delta reads for context efficiency | O(k) tasks |
| 9 | Mailbox Lock-Based Access | File-lock for cross-process safety | O(1) + I/O |
| 10 | URI Counting | Set-based unique deduplication | O(n) items |
| 11 | Fork Context Cloning | Two-pass orphan removal for clean context | O(n) messages |
| 12 | Skill Name Resolution | Three-tier lookup for flexible referencing | O(n) skills |

---

## Verification Summary

| Algorithm | Symbols Verified | Source Location |
|-----------|------------------|-----------------|
| Task ID Generation | oV, k$3, LJ6, V$3, G97 | chunks.41.mjs:2402-2444 |
| Ctrl+F Kill | U4q, x66 | chunks.146.mjs:2012-2032 |
| Abort Propagation | x66, $O, R61 | chunks.146.mjs, chunks.41.mjs, chunks.6.mjs |
| Progress Tracking | nl4, TV1 | chunks.146.mjs:2045-2097 |
| Output Buffer | Y91, $O, Z97, g2 | chunks.41.mjs:2248-2366 |
| Tool Filtering | Xk8, CW6, eP1, WY4 | chunks.91.mjs:269, chunks.93.mjs |
| State Machine | i9, Zf, VR, EV8 | chunks.90.mjs:3003-3087 |
| System Reminder | suY, wY4, OY4 | chunks.147.mjs, chunks.90.mjs |
| Mailbox Lock | x3, Vc6 | chunks.132.mjs:22-57 |
| URI Counting | TIY, vIY, NIY | chunks.144.mjs:832-842 |
| Fork Context Cloning | Fx8 | chunks.133.mjs:1788-1804 |
| Skill Name Resolution | NvY | chunks.133.mjs:1817-1828 |

---

## Related Documents

- [task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - State machine details
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox details
- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Agent loop

---

**Last Updated**: 2026-03-28
**Version**: Claude Code 2.1.76
**Status**: Complete - 12 key algorithms with full source restoration, merged from v6/v9/v12/current
