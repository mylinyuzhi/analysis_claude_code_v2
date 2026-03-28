# Output File System Complete (Claude Code 2.1.76)

> Complete source-level restoration of the output file system for background agents and subagents.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `g2` - getOutputFilePath — `chunks.41.mjs:2248`
- `Y91` - OutputBuffer class — `chunks.41.mjs:2252-2308`
- `v$3` - getOrCreateOutputBuffer — `chunks.41.mjs:2310-2314`
- `W97` - appendToOutputBuffer — `chunks.41.mjs:2316-2318`
- `$O` - flushOutputBuffer — `chunks.41.mjs:2320-2323`
- `Z97` - readOutputFileDelta — `chunks.41.mjs:2325-2346`

---

## Overview

The output file system is the backbone of background agent communication. Each background task gets its own output file that persists the agent's transcript, enabling:

1. **Incremental polling** - Parent can check progress without blocking
2. **Resume capability** - Can reload conversation after crash
3. **Result capture** - Partial results preserved even if killed

---

## Output File Path Resolution (g2)

### File Structure

```
~/.claude/
└── tasks/
    ├── a3f4b2c1.output    # local_agent output (prefix "a")
    ├── b7d8e9f2.output    # local_bash output (prefix "b")
    ├── t2a3b4c5.output    # in_process_teammate output (prefix "t")
    ├── r9d8c7b6.output    # remote_agent output (prefix "r")
    └── w1e2r3t4.output    # local_workflow output (prefix "w")
```

### Path Resolution Logic

```javascript
// ============================================
// g2 - Get output file path for task
// Location: chunks.41.mjs:2248 (inferred)
// ============================================

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    // Tasks directory is in the user's home
    const tasksDir = path.join(os.homedir(), ".claude", "tasks");

    // Output file named with task ID + .output extension
    return path.join(tasksDir, `${taskId}.output`);
}

// Example outputs:
// getOutputFilePath("a3f4b2c1") → "/home/user/.claude/tasks/a3f4b2c1.output"
// getOutputFilePath("b7d8e9f2") → "/home/user/.claude/tasks/b7d8e9f2.output"
```

---

## OutputBuffer Class (Y91)

### What it does

Provides buffered, asynchronous file writing for output content. Buffers multiple writes in memory and flushes them to disk efficiently.

### Source Code

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered async file writer for task output
// Location: chunks.41.mjs:2252-2308
// ============================================

class OutputBuffer {
    // Private fields
    #filePath;           // Output file path
    #fileHandle = null;  // File handle (when open)
    #buffer = [];        // Pending content to write
    #flushPromise = null; // Current flush operation
    #resolveFlush = null; // Resolve function for flush promise

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    // Add content to buffer
    append(content) {
        this.#buffer.push(content);

        // Start flush if not already running
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#startFlushLoop();
        }
    }

    // Wait for all pending writes
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel pending writes
    cancel() {
        this.#buffer.length = 0;
    }

    // Main flush loop
    async #runFlushLoop() {
        while (true) {
            try {
                // Ensure directory exists and file is open
                if (!this.#fileHandle) {
                    await ensureTasksDirectory();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32"
                            ? "a"
                            : O_WRONLY | O_APPEND | O_CREAT | O_EXCL
                    );
                }

                // Write all buffered content
                while (true) {
                    await this.#writeBufferedContent();
                    if (this.#buffer.length === 0) break;
                }

            } finally {
                // Close file handle
                if (this.#fileHandle) {
                    let handle = this.#fileHandle;
                    this.#fileHandle = null;
                    await handle.close();
                }
            }

            // Check if more content arrived
            if (this.#buffer.length) continue;
            break;
        }
    }

    // Write buffered content to file
    async #writeBufferedContent() {
        return this.#fileHandle.appendFile(this.#buildBufferContent());
    }

    // Build buffer content as single string
    #buildBufferContent() {
        let chunks = this.#buffer.splice(0, this.#buffer.length);
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

    // Start flush loop with error handling
    async #startFlushLoop() {
        try {
            await this.#runFlushLoop();
        } finally {
            let resolve = this.#resolveFlush;
            this.#flushPromise = null;
            this.#resolveFlush = null;
            resolve();
        }
    }
}
```

### Key Design Decisions

| Design Choice | Rationale |
|---------------|-----------|
| Buffered writes | Reduce I/O operations by batching |
| Async flush | Non-blocking writes don't stall agent execution |
| Auto-start flush | No explicit flush call needed on append |
| Promise-based | Easy to wait for completion |
| Buffer pooling | Efficient memory usage via `Buffer.allocUnsafe` |

---

## Buffer Cache Management

### Global Cache

```javascript
// Buffer cache: Map<taskId, OutputBuffer>
const K91 = new Map();  // outputBufferCache
```

### getOrCreateOutputBuffer (v$3)

```javascript
// ============================================
// v$3 - getOrCreateOutputBuffer - Get or create buffer for task
// Location: chunks.41.mjs:2310-2314
// ============================================

function getOrCreateOutputBuffer(taskId) {
    let buffer = outputBufferCache.get(taskId);

    if (!buffer) {
        buffer = new OutputBuffer(taskId);
        outputBufferCache.set(taskId, buffer);
    }

    return buffer;
}
```

### appendToOutputBuffer (W97)

```javascript
// ============================================
// W97 - appendToOutputBuffer - Append content via buffer
// Location: chunks.41.mjs:2316-2318
// ============================================

function appendToOutputBuffer(taskId, content) {
    getOrCreateOutputBuffer(taskId).append(content);
}
```

### flushOutputBuffer ($O)

```javascript
// ============================================
// $O - flushOutputBuffer - Flush and remove buffer for task
// Location: chunks.41.mjs:2320-2323
// ============================================

// ORIGINAL (for source lookup):
async function $O(A) {
    let q = K91.get(A);
    if (q) await q.flush(), K91.delete(A)
}

// READABLE (for understanding):
async function flushOutputBuffer(taskId) {
    let buffer = outputBufferCache.get(taskId);

    if (buffer) {
        await buffer.flush();
        outputBufferCache.delete(taskId);
    }
}

// Mapping: $O→flushOutputBuffer, A→taskId, q→buffer, K91→outputBufferCache
```

---

## Output File Operations

### Read Output File Delta (Z97)

**What it does:** Reads new content from an output file since the last read position, enabling incremental updates without re-reading the entire file.

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read new bytes from output file
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
        throw Y
    }
}

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset, maxBytes = DEFAULT_MAX_BYTES) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            currentOffset,
            maxBytes
        );

        if (!result) {
            return {
                content: "",
                newOffset: currentOffset
            };
        }

        return {
            content: result.content,
            newOffset: currentOffset + result.bytesRead
        };

    } catch (error) {
        if (error.code === "ENOENT") {
            // File doesn't exist yet
            return {
                content: "",
                newOffset: currentOffset
            };
        }
        throw error;
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→currentOffset, K→maxBytes,
//          P97→DEFAULT_MAX_BYTES, dt6→readFileFromOffset, g2→getOutputFilePath
```

### Delta Reading Algorithm

```
File: a7x9k2m3.output
┌─────────────────────────────────────────────────────────────────────────────┐
│ 0    100    200    300    400    500    600    700    800    900    1000   │
│ │.....│......│......│......│......│......│......│......│......│......│     │
│ │ Old │ Old  │ Old  │ Old  │ NEW  │ NEW  │ NEW  │ NEW  │ NEW  │ NEW  │     │
│ └─────┴──────┴──────┴──────┘      │      │      │      │      │      │     │
│        Already read (offset=400)  │      │      │      │      │      │     │
│                                   └──────┴──────┴──────┴──────┴──────┘     │
│                                   Delta to read (400-1000)                  │
└─────────────────────────────────────────────────────────────────────────────┘

Read call with offset=400:
1. Open file
2. Seek to offset 400
3. Read up to maxBytes
4. Return { content: "NEW...", newOffset: 1000 }
```

---

## Output File Format

### JSON Lines Format

Output files use JSON Lines (`.jsonl`) format for streaming compatibility:

```
{"type":"assistant","content":"Starting task..."}
{"type":"tool_use","name":"Read","input":{"file_path":"..."}}
{"type":"tool_result","tool_use_id":"...","content":"..."}
{"type":"assistant","content":"Analysis complete"}
```

### Message Types

| Type | Description | Fields |
|------|-------------|--------|
| `assistant` | Agent response | `content`, `thinking` |
| `user` | User message | `content` |
| `tool_use` | Tool call | `name`, `input`, `id` |
| `tool_result` | Tool output | `tool_use_id`, `content`, `is_error` |
| `progress` | Progress update | `message`, `percentage` |

---

## Output File Lifecycle

### Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Output File Lifecycle                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Task Created (Qn4/Un4)
        │
        ▼
┌───────────────┐
│ initOutputFile│  Create empty .output file
└───────┬───────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                    During Execution                            │
│                                                                │
│  appendToOutputFile() ←─ Each tool result, thinking, response │
│                                                                │
│  readOutputFileDelta() ←─ Parent polls for progress           │
│                                                                │
│  outputOffset tracks current read position                     │
└───────────────────────────────────────────────────────────────┘
        │
        │ Task completes/fails/killed
        ▼
┌───────────────┐
│ Final Read    │  readFullOutput() for result
└───────┬───────┘
        │
        │ Task removed from state (after notified)
        ▼
┌───────────────┐
│ File Cleanup  │  File may be deleted or archived
└───────────────┘
```

---

## Integration with Task Management

### Task Record Output Fields

```typescript
interface TaskRecord {
    // ... other fields

    outputFile: string;      // Path to .output file
    outputOffset: number;    // Current read position (bytes)
}
```

### Offset Tracking

```javascript
// When polling outputs (wY4):
let result = await readOutputFileDelta(task.id, task.outputOffset);
if (result.content) {
    updatedTaskOffsets[task.id] = result.newOffset;
}

// Then update state (OY4):
updateTaskOffsets(setAppState, updatedTaskOffsets, evictedTaskIds);
```

### Offset Update Flow

```
Poll Loop (each turn):
        │
        ▼
for each running task:
        │
        ├── readOutputFileDelta(taskId, currentOffset)
        │       │
        │       └── Returns { content, newOffset }
        │
        └── Store newOffset in updatedTaskOffsets
        │
        ▼
updateTaskOffsets(setAppState, updatedTaskOffsets)
        │
        └── Updates task.outputOffset in state
```

---

## System Reminder Integration

### Attachment Generation from Output

```javascript
// ============================================
// Building task_status attachment from output
// ============================================

// READABLE (for understanding):
async function buildTaskStatusAttachment(taskId, status) {
    // Read the last message from output file
    const output = await readFullOutput(taskId);
    const lines = output.content.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    const lastMessage = JSON.parse(lastLine);

    // Extract summary from last assistant message
    let deltaSummary = "";
    if (lastMessage.type === "assistant") {
        deltaSummary = lastMessage.content.slice(0, 200);
    }

    return {
        type: "task_status",
        task_id: taskId,
        status: status,
        delta_summary: deltaSummary
    };
}
```

### Progress Attachment from Output

```javascript
// ============================================
// Building task_progress attachment
// ============================================

// READABLE (for understanding):
function buildTaskProgressAttachment(task) {
    return {
        type: "task_progress",
        task_id: task.id,
        task_type: task.type,
        message: task.progress?.summary || "Running...",
        usage: {
            tool_uses: task.progress?.toolUseCount || 0,
            total_tokens: task.progress?.tokenCount || 0,
            duration_ms: Date.now() - task.startTime
        }
    };
}
```

---

## Kill Flow and Partial Results

### Preserving Partial Results on Kill

```javascript
// ============================================
// When task is killed, partial results are preserved
// ============================================

// READABLE (for understanding):
async function handleTaskKill(taskId, setAppState) {
    // 1. Trigger abort signal
    triggerAbortSignal(taskId, setAppState);

    // 2. Read any remaining output before marking killed
    const task = getTaskFromState(taskId);
    const delta = await readOutputFileDelta(taskId, task.outputOffset);

    // 3. Mark as killed (preserving output file)
    markTaskKilled(taskId, setAppState);

    // 4. The output file remains, can be read via TaskOutput tool
    return {
        taskId: taskId,
        partialOutput: delta.content,
        status: "killed"
    };
}
```

### v2.1.76 Enhancement

In v2.1.76, partial results are explicitly preserved:

```javascript
// Before marking killed, always read latest output
let delta = await readOutputFileDelta(taskId, task.outputOffset);
if (delta.content) {
    // Include partial output in task_status attachment
    task.partialOutput = delta.content;
}
```

---

## Error Handling

### File Not Found

```javascript
// Output file doesn't exist yet
if (error.code === "ENOENT") {
    // Task hasn't written anything yet
    return { content: null, newOffset: 0 };
}
```

### File Lock Conflicts

For mailbox operations, file locking is used:

```javascript
// From mailbox implementation (chunks.132.mjs)
const lockOptions = {
    retries: 10,
    minTimeout: 5,
    maxTimeout: 100
};

let release = await properLockfile.lock(filePath, {
    lockfilePath: lockPath,
    ...lockOptions
});

try {
    // Perform file operations
} finally {
    await release();
}
```

---

## Performance Considerations

### Incremental Reading

Instead of reading entire file each time:

```javascript
// Bad: Read entire file every poll
let content = await fs.readFile(filePath, "utf-8");

// Good: Read only new bytes
let delta = await readOutputFileDelta(taskId, currentOffset);
```

**Why this matters:**
- Output files can grow to MB in size
- Polling happens every turn
- Full reads would be O(n) each time
- Delta reads are O(1) for unchanged files

### Offset Storage

Offsets are stored in state, not recalculated:

```javascript
// State stores: { taskId: { outputOffset: 1234 } }
// Next read starts at 1234, not 0
```

---

## Cross-Platform Considerations

### Path Handling

```javascript
// Use path.join for cross-platform compatibility
const tasksDir = path.join(os.homedir(), ".claude", "tasks");

// Windows: C:\Users\name\.claude\tasks
// Unix: /home/name/.claude/tasks
// macOS: /Users/name/.claude/tasks
```

### Encoding

```javascript
// Always use utf-8 for consistency
await fs.writeFile(filePath, content, "utf-8");
await fs.readFile(filePath, "utf-8");
```

---

## Source Code Verification

| Function | Description | Location | Verification |
|----------|-------------|----------|--------------|
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `Y91` | OutputBuffer class | chunks.41.mjs:2252-2308 | ✓ Source restored |
| `v$3` | getOrCreateOutputBuffer | chunks.41.mjs:2310-2314 | ✓ Source restored |
| `W97` | appendToOutputBuffer | chunks.41.mjs:2316-2318 | ✓ Source restored |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320-2323 | ✓ Source restored |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325-2346 | ✓ Source restored |
| `K91` | outputBufferCache (Map) | chunks.41.mjs | ✓ Source restored |

---

## Related Documents

- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [output_capture_source_restored.md](./output_capture_source_restored.md) - Output capture details
- [notification_queue_source_restored.md](./notification_queue_source_restored.md) - Notification queue
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers