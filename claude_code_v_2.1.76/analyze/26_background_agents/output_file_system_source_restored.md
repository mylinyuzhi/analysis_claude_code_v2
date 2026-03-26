# Output File System — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of the output file management system for background tasks.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getOutputFilePath` (g2) - Get output file path for task — `chunks.41.mjs:2248`
- `appendToOutputFile` (W97) - Append content to output file — `chunks.41.mjs:2316`
- `flushOutputFile` ($O) - Flush pending writes to disk — `chunks.41.mjs:2320`
- `readOutputFileDelta` (Z97) - Read incremental output — `chunks.41.mjs:2325`
- `readFullOutput` (z38) - Read complete output file — `chunks.41.mjs:2348`
- `OutputFileWriter` (Y91) - Buffered output file writer class — `chunks.41.mjs:2252`
- `getWriterForTask` (v$3) - Get or create writer for task — `chunks.41.mjs:2310`

---

## Overview

Background tasks write their output to persistent files in the `~/.claude/tasks/` directory. This enables:
- **Incremental reads** - LLM can check progress without blocking
- **Persistence** - Output survives crashes/restarts
- **Simple API** - Standard file operations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Output File System Architecture                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ~/.claude/tasks/                                                          │
│   ├── a3f8b2c1.output    ← Agent task output                               │
│   ├── b7e4d9f2.output    ← Bash task output                                │
│   └── t1a3c5e7.output    ← Teammate task output                            │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    OutputFileWriter (Y91)                           │  │
│   │                                                                      │  │
│   │  • Buffered writes for performance                                  │  │
│   │  • Async flush to disk                                              │  │
│   │  • Per-task writer instances                                        │  │
│   │  • Automatic cleanup on flush                                       │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Output File Path Generation

### getOutputFilePath (g2)

**What it does:** Generates the file path for a task's output file.

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
    // yJ6() returns ~/.claude/tasks/
    // D97 is path.join
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Example: /home/user/.claude/tasks/a3f8b2c1.output
```

---

## Buffered Output File Writer

### OutputFileWriter Class (Y91)

**What it does:** A buffered writer that batches writes for performance and handles async file operations.

```javascript
// ============================================
// Y91 - OutputFileWriter - Buffered output file writer class
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
class OutputFileWriter {
    #filePath;
    #fileHandle = null;
    #pendingWrites = [];
    #flushPromise = null;
    #resolveFlush = null;

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    /**
     * Append content to the output file.
     * Content is buffered and written asynchronously.
     */
    append(content) {
        this.#pendingWrites.push(content);

        // Start write loop if not already running
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#startWriteLoop();
        }
    }

    /**
     * Wait for all pending writes to complete.
     */
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    /**
     * Cancel pending writes (e.g., on abort).
     */
    cancel() {
        this.#pendingWrites.length = 0;
    }

    async #writeLoop() {
        while (true) {
            try {
                // Open file if not open
                if (!this.#fileHandle) {
                    await ensureDirectoryExists();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32" ? "a" : O_WRONLY | O_APPEND | O_CREAT | O_DIRECT
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

            // Check if more writes arrived during cleanup
            if (this.#pendingWrites.length) continue;
            break;
        }
    }

    #writeBatch() {
        return this.#fileHandle.appendFile(this.#buildBuffer());
    }

    #buildBuffer() {
        let items = this.#pendingWrites.splice(0, this.#pendingWrites.length);
        let totalSize = 0;

        // Calculate total buffer size
        for (let item of items) {
            totalSize += Buffer.byteLength(item, "utf8");
        }

        // Build single buffer for efficient write
        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;

        for (let item of items) {
            offset += buffer.write(item, offset, "utf8");
        }

        return buffer;
    }

    async #startWriteLoop() {
        try {
            await this.#writeLoop();
        } finally {
            let resolve = this.#resolveFlush;
            this.#flushPromise = null;
            this.#resolveFlush = null;
            resolve();
        }
    }
}

// Mapping: Y91→OutputFileWriter, #A→#filePath, #q→#fileHandle, #K→#pendingWrites,
//          #z→#flushPromise, #Y→#resolveFlush
```

**Why this approach:**
- **Buffered writes** - Batches multiple appends into single disk I/O
- **Async-friendly** - Non-blocking writes with flush promise
- **Resource management** - Automatic file handle cleanup
- **Direct I/O** - Uses O_DIRECT on Unix for better performance

---

## Writer Management

### getWriterForTask (v$3)

**What it does:** Gets or creates a writer instance for a specific task.

```javascript
// ============================================
// v$3 - getWriterForTask - Get or create writer for task
// Location: chunks.41.mjs:2310-2314
// ============================================

// ORIGINAL (for source lookup):
function v$3(A) {
    let q = K91.get(A);
    if (!q) q = new Y91(A), K91.set(A, q);
    return q
}

// READABLE (for understanding):
// K91 is a Map: taskId -> OutputFileWriter
const taskWriters = new Map();

function getWriterForTask(taskId) {
    let writer = taskWriters.get(taskId);
    if (!writer) {
        writer = new OutputFileWriter(taskId);
        taskWriters.set(taskId, writer);
    }
    return writer;
}

// Mapping: v$3→getWriterForTask, A→taskId, q→writer, K91→taskWriters
```

---

## High-Level API Functions

### appendToOutputFile (W97)

**What it does:** Appends content to a task's output file.

```javascript
// ============================================
// W97 - appendToOutputFile - Append content to output file
// Location: chunks.41.mjs:2316-2318
// ============================================

// ORIGINAL (for source lookup):
function W97(A, q) {
    v$3(A).append(q)
}

// READABLE (for understanding):
function appendToOutputFile(taskId, content) {
    getWriterForTask(taskId).append(content);
}

// Mapping: W97→appendToOutputFile, A→taskId, q→content
```

### flushOutputFile ($O)

**What it does:** Flushes all pending writes for a task and cleans up the writer.

```javascript
// ============================================
// $O - flushOutputFile - Flush pending writes to disk
// Location: chunks.41.mjs:2320-2323
// ============================================

// ORIGINAL (for source lookup):
async function $O(A) {
    let q = K91.get(A);
    if (q) await q.flush(), K91.delete(A)
}

// READABLE (for understanding):
async function flushOutputFile(taskId) {
    let writer = taskWriters.get(taskId);
    if (writer) {
        await writer.flush();
        taskWriters.delete(taskId);
    }
}

// Mapping: $O→flushOutputFile, A→taskId, q→writer, K91→taskWriters
```

---

## Incremental Output Reading

### readOutputFileDelta (Z97)

**What it does:** Reads output from a specific offset, returning new content and updated offset.

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
const DEFAULT_CHUNK_SIZE = 64 * 1024;  // 64KB

async function readOutputFileDelta(taskId, offset, chunkSize = DEFAULT_CHUNK_SIZE) {
    try {
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            offset,
            chunkSize
        );

        if (!result) {
            return {
                content: "",
                newOffset: offset
            };
        }

        return {
            content: result.content,
            newOffset: offset + result.bytesRead
        };
    } catch (error) {
        // File doesn't exist yet
        if (error.code === "ENOENT") {
            return {
                content: "",
                newOffset: offset
            };
        }

        // Log other errors
        logError(error);
        return {
            content: "",
            newOffset: offset
        };
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→offset, K→chunkSize, P97→DEFAULT_CHUNK_SIZE
```

### readFullOutput (z38)

**What it does:** Reads the complete output file, with truncation for large files.

```javascript
// ============================================
// z38 - readFullOutput - Read complete output file
// Location: chunks.41.mjs:2348-2362
// ============================================

// ORIGINAL (for source lookup):
async function z38(A, q = P97) {
    try {
        let {
            content: K,
            bytesTotal: Y,
            bytesRead: z
        } = await ow6(g2(A), q);
        if (Y > z) return `[${Math.round((Y-z)/1024)}KB of earlier output omitted]
${K}`;
        return K
    } catch (K) {
        if (K.code === "ENOENT") return "";
        return _6(K), ""
    }
}

// READABLE (for understanding):
async function readFullOutput(taskId, maxBytes = DEFAULT_CHUNK_SIZE) {
    try {
        let { content, bytesTotal, bytesRead } = await readFileWithSize(
            getOutputFilePath(taskId),
            maxBytes
        );

        // If file is larger than what we read, add truncation notice
        if (bytesTotal > bytesRead) {
            let omittedKB = Math.round((bytesTotal - bytesRead) / 1024);
            return `[${omittedKB}KB of earlier output omitted]\n${content}`;
        }

        return content;
    } catch (error) {
        if (error.code === "ENOENT") return "";
        logError(error);
        return "";
    }
}

// Mapping: z38→readFullOutput, A→taskId, q→maxBytes, P97→DEFAULT_CHUNK_SIZE
```

---

## Output File Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Output File Lifecycle                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Task Creation
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  initOutputFile(taskId)                                                      │
│  • Creates ~/.claude/tasks/ directory if needed                             │
│  • OutputFileWriter instance created on first append                        │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  During Execution:                                                           │
│                                                                              │
│  appendToOutputFile(taskId, content)                                         │
│      │                                                                       │
│      └──► getWriterForTask(taskId)                                          │
│              │                                                               │
│              └──► writer.append(content)                                     │
│                      │                                                       │
│                      └──► Buffer in memory                                  │
│                              │                                               │
│                              └──► Async write to disk                       │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Progress Tracking:                                                          │
│                                                                              │
│  readOutputFileDelta(taskId, offset)                                         │
│      │                                                                       │
│      └──► Returns new content + updated offset                              │
│                                                                              │
│  updateTaskOffsets(taskId, newOffset)                                        │
│      │                                                                       │
│      └──► Stores offset for next read                                       │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Task Completion:                                                            │
│                                                                              │
│  flushOutputFile(taskId)                                                     │
│      │                                                                       │
│      └──► Ensures all writes are on disk                                    │
│      └──► Cleans up writer instance                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Buffered Writing

The `OutputFileWriter` batches multiple `append()` calls into single disk writes:

```
append("Line 1")  ─┐
append("Line 2")  ─┼──► Single buffer ──► Single write()
append("Line 3")  ─┘
```

**Benefits:**
- **Fewer syscalls** - Amortizes I/O overhead
- **Better disk utilization** - Larger sequential writes
- **Non-blocking** - Appends return immediately

### Direct I/O

On Unix systems, files are opened with `O_DIRECT` flag:
- **Bypasses page cache** - Reduces memory pressure
- **Predictable latency** - No cache thrashing
- **Better for sequential writes** - Output files are append-only

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✅ Verified |
| `Y91` | OutputFileWriter | chunks.41.mjs:2252 | ✅ Verified |
| `v$3` | getWriterForTask | chunks.41.mjs:2310 | ✅ Verified |
| `W97` | appendToOutputFile | chunks.41.mjs:2316 | ✅ Verified |
| `$O` | flushOutputFile | chunks.41.mjs:2320 | ✅ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✅ Verified |
| `z38` | readFullOutput | chunks.41.mjs:2348 | ✅ Verified |
| `P97` | DEFAULT_CHUNK_SIZE | chunks.41.mjs | ✅ Verified |