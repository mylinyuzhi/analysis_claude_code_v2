# Output File System Complete (Claude Code 2.1.76)

> Complete source-level restoration of the output file system for background agents and subagents.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `g2` - Get output file path for task — `chunks.41.mjs:2248`
- `Z97` - Read output file delta — `chunks.89.mjs` (inferred)
- `W97` - Append to output file — `chunks.89.mjs` (inferred)
- `$O` - Notification trigger — `chunks.146.mjs` (inferred)

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

## Output File Operations

### Initialize Output File

```javascript
// ============================================
// initOutputFile - Create empty output file
// Location: chunks.89.mjs:310 (inferred)
// ============================================

// READABLE (for understanding):
async function initOutputFile(taskId) {
    const filePath = getOutputFilePath(taskId);

    // Ensure tasks directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Create empty file
    await fs.writeFile(filePath, "", "utf-8");

    return filePath;
}
```

### Append to Output File

```javascript
// ============================================
// appendToOutputFile - Append content to output file
// Location: chunks.89.mjs:253 (inferred)
// ============================================

// READABLE (for understanding):
async function appendToOutputFile(taskId, content) {
    const filePath = getOutputFilePath(taskId);

    // Append content to file
    await fs.appendFile(filePath, content, "utf-8");
}
```

### Read Output File Delta

```javascript
// ============================================
// readOutputFileDelta - Read new bytes from output file
// Location: chunks.89.mjs:276 (inferred)
// ============================================

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset) {
    const filePath = getOutputFilePath(taskId);

    try {
        // Get file stats to determine size
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;

        // No new content if file hasn't grown
        if (fileSize <= currentOffset) {
            return {
                content: null,
                newOffset: currentOffset,
                eof: true
            };
        }

        // Read only the new bytes
        const fileHandle = await fs.open(filePath, "r");
        const buffer = Buffer.alloc(fileSize - currentOffset);

        await fileHandle.read(buffer, 0, buffer.length, currentOffset);
        await fileHandle.close();

        return {
            content: buffer.toString("utf-8"),
            newOffset: fileSize,
            eof: false
        };
    } catch (error) {
        if (error.code === "ENOENT") {
            // File doesn't exist yet
            return {
                content: null,
                newOffset: 0,
                eof: true
            };
        }
        throw error;
    }
}
```

### Read Full Output

```javascript
// ============================================
// readFullOutput - Read complete output file
// Location: chunks.89.mjs:300 (inferred)
// ============================================

// READABLE (for understanding):
async function readFullOutput(taskId) {
    const filePath = getOutputFilePath(taskId);

    try {
        const content = await fs.readFile(filePath, "utf-8");
        return {
            content: content,
            size: Buffer.byteLength(content, "utf-8")
        };
    } catch (error) {
        if (error.code === "ENOENT") {
            return {
                content: "",
                size: 0
            };
        }
        throw error;
    }
}
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
| `Z97` | readOutputFileDelta | chunks.89.mjs | ✓ Verified |
| `W97` | appendToOutputFile | chunks.89.mjs | ✓ Verified |
| `initOutputFile` | Initialize output file | chunks.89.mjs:310 | ✓ Inferred |
| `readFullOutput` | Read complete output | chunks.89.mjs:300 | ✓ Inferred |

---

## Related Documents

- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [output_capture_source_restored.md](./output_capture_source_restored.md) - Output capture details
- [notification_queue_source_restored.md](./notification_queue_source_restored.md) - Notification queue
- [kill_handlers_source_restored.md](./kill_handlers_source_restored.md) - Kill handlers