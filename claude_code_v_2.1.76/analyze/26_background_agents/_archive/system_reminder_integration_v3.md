# System Reminder Integration V3 (Claude Code 2.1.76)

> Complete source-level documentation of system reminder integration with background agents, including task status attachments, progress tracking, and notification generation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `Z97` - readOutputFileDelta — `chunks.41.mjs:2325`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

---

## Integration Architecture

### Task Status Attachment Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                TASK STATUS ATTACHMENT PIPELINE                       │
└─────────────────────────────────────────────────────────────────────┘

Background Task Running
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Output File Written                                                  │
│   .claude/tasks/{taskId}.output                                     │
│   Incremental writes as task progresses                             │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ pollTaskOutputs (wY4)                                               │
│   Called each agent turn                                            │
│   Reads delta from each running task's output file                  │
│   Returns: { attachments, updatedTaskOffsets, evictedTaskIds }     │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ updateTaskState (OY4)                                               │
│   Updates outputOffset for running tasks                            │
│   Evicts completed + notified tasks                                 │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ getUnifiedTasksAttachment (suY)                                     │
│   Builds task_status attachments                                    │
│   Returns array for LLM context                                     │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Attachment Normalization                                            │
│   Convert to TenguMessage format                                    │
│   Wrap in <system-reminder> tags                                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ LLM receives task status                                            │
│   Sees background task state alongside conversation                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Source Code

### readOutputFileDelta (Z97)

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output from task file
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
        // Read file from current offset
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),
            currentOffset,
            options
        );

        if (!result) {
            return { content: "", newOffset: currentOffset };
        }

        return {
            content: result.content,
            newOffset: currentOffset + result.bytesRead
        };
    } catch (error) {
        // File doesn't exist - task may not have started
        if (error.code === "ENOENT") {
            return { content: "", newOffset: currentOffset };
        }

        // Log other errors
        logError(error);
        return { content: "", newOffset: currentOffset };
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→currentOffset, K→options,
//          dt6→readFileFromOffset, g2→getOutputFilePath, P97→DEFAULT_OPTIONS,
//          _6→logError
```

### getOutputFilePath (g2)

```javascript
// ============================================
// g2 - getOutputFilePath - Get path to task output file
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

### pollTaskOutputs (wY4)

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all running tasks for output
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
        // Check for eviction: terminal state + notified
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Evict - user has been notified
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    // No polling needed for pending
                    continue;
                case "running":
                    // Continue to poll
                    break;
            }
        }

        // Poll running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

---

## Task Status Attachment Format

### Attachment Object Structure

```javascript
// Task status attachment (returned by suY)
{
    type: "task_status",
    taskId: "a3k7m9p2",
    taskType: "local_agent",      // "local_agent" | "local_bash" | "remote_agent" | "in_process_teammate"
    status: "running",             // "pending" | "running" | "completed" | "failed" | "killed"
    description: "Search codebase for usages",
    deltaSummary: "Running Grep for 'createTaskId'..."
}
```

### Message Format (After Normalization)

```xml
<system-reminder type="task_status">
Task ID: a3k7m9p2
Type: local_agent
Status: running
Description: Search codebase for usages
Summary: Running Grep for 'createTaskId'...
</system-reminder>
```

---

## Progress Telemetry

### updateTaskProgressWithTelemetry (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with metrics
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
    let progressData = null;

    // Update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture metrics for telemetry
        progressData = {
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

    // Emit telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        emitTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: progressData.toolUseId,
            description: summary,
            usage: {
                total_tokens: progressData.tokenCount,
                tool_uses: progressData.toolUseCount,
                duration_ms: Date.now() - progressData.startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary,
//          K→setAppState, i9→atomicUpdateTask, Nn→isTelemetryEnabled,
//          c36→emitTelemetry
```

### Telemetry Event Structure

```javascript
{
    type: "system",
    subtype: "task_progress",
    task_id: "a3k7m9p2",
    tool_use_id: "tooluse_abc123",
    description: "Running Grep for 'createTaskId'...",
    usage: {
        total_tokens: 15000,
        tool_uses: 12,
        duration_ms: 45000
    },
    summary: "Running Grep for 'createTaskId'..."
}
```

---

## Task Eviction Logic

### When Tasks Are Evicted

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK EVICTION CONDITIONS                          │
└─────────────────────────────────────────────────────────────────────┘

Task is evicted when ALL conditions are met:
  1. task.notified === true     (user has been notified)
  2. task.status in ["completed", "failed", "killed"]

Eviction process:
  1. Remove from appState.tasks
  2. Output file preserved on disk
  3. Task ID no longer appears in status attachments

Why this works:
  - User saw the result (notification)
  - Task is truly done (terminal state)
  - No need to keep in active state
```

### State Update Flow

```javascript
// updateTaskState processes three things:
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    // 1. Update offsets for running tasks (incremental read positions)
    // 2. Remove evicted tasks from state
    // 3. Only emit new state if changes occurred
}
```

---

## Key Insights

### Why Incremental Output Reading?

**Problem:** Background task output files can grow large

**Solution:** Track read offset per task
- Only read new content since last poll
- Update offset after each read
- Avoids re-processing entire file

### Why Task Eviction?

**Problem:** Completed tasks accumulate in state

**Solution:** Evict when:
1. Terminal state (done/failed/killed)
2. User notified (saw the result)

**Benefits:**
- State doesn't grow unbounded
- Memory efficient
- Output file preserves history

### Why Telemetry for Progress?

**Benefits:**
1. **Performance analysis** - Track task durations
2. **Cost tracking** - Monitor token usage
3. **Usage patterns** - Understand tool usage
4. **Debugging** - See what tasks were doing

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `04_system_reminder` | Attachment production |
| `08_subagent` | Task creation, status |
| `26_background_agents` | Task state, output files |
| `17_telemetry` | Progress telemetry |
| `05_tools` | TaskOutput tool |

---

## Summary

The system reminder integration with background agents provides:

1. **Incremental output polling** - Read only new content
2. **Task status attachments** - LLM sees background task state
3. **Progress telemetry** - Track usage and performance
4. **Task eviction** - Clean up completed tasks
5. **State management** - Efficient updates with atomic operations

The integration enables seamless monitoring of background tasks without blocking or polling in the traditional sense.