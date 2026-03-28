# Notification Queue System - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the notification queue for background task completion messages.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `pollTaskOutputs` (wY4) - Poll task output files — `chunks.90.mjs:3058`
- `updateTaskOffsets` (OY4) - Update task state after polling — `chunks.90.mjs:3087`
- `getRunningTasks` (EV8) - Get all running tasks — `chunks.90.mjs:3053`
- `buildTaskStatusAttachments` - Build task_status attachments
- `normalizeAttachmentForAPI` (Ui8) - Normalize for API — `chunks.174.mjs:3`

---

## Overview

The notification queue system handles communication between background tasks and the main agent loop. It uses a polling-based architecture combined with attachment generation for system reminders.

### Key Design Decisions

1. **Polling-based**: Main loop polls task outputs rather than push notifications
2. **Offset tracking**: Each task tracks its read offset for incremental updates
3. **Attachment format**: Task status converted to system reminder attachments
4. **Atomic notified guard**: Prevents duplicate notifications

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Main Agent Loop                                       │
│  (processes user messages, calls LLM, runs tools)                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Before each LLM turn
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    pollTaskOutputs (wY4)                                      │
│                                                                              │
│  For each task in appState.tasks:                                           │
│  1. Read output file from task.outputOffset                                 │
│  2. Build delta content (new bytes since last read)                         │
│  3. Generate attachment based on status:                                    │
│     - Running → task_progress (if throttling allows)                        │
│     - Completed → task_status with delta_summary                            │
│     - Failed → task_status with error message                               │
│     - Killed → task_status with partial results                             │
│  4. Return { attachments, updatedTaskOffsets, evictedTaskIds }              │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    updateTaskOffsets (OY4)                                    │
│                                                                              │
│  Update appState.tasks with:                                                 │
│  - New outputOffset values                                                   │
│  - Remove evicted tasks (completed + notified + terminal)                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Attachment Injection                                       │
│                                                                              │
│  Attachments added to LLM context as system reminders:                      │
│  <system-reminder>                                                           │
│  <task_status>...</task_status>                                             │
│  </system-reminder>                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code - Core Functions

### pollTaskOutputs (wY4)

**What it does:** Polls all task output files and generates attachments.

**Location:** chunks.90.mjs:3058-3086

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll task output files
// Location: chunks.90.mjs:3058-3086
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
                continue
        }
        // ... build attachments for each task
    }
    return { attachments: q, updatedTaskOffsets: K, evictedTaskIds: Y }
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
            }
        }

        // Read output delta
        let { content, newOffset } = readOutputFileDelta(task.id, task.outputOffset);

        if (content) {
            updatedTaskOffsets[task.id] = newOffset;
        }

        // Build attachment based on status
        if (task.status === "running") {
            // Throttled progress attachment
            if (shouldShowProgress(task)) {
                attachments.push({
                    type: "task_progress",
                    taskId: task.id,
                    taskType: task.type,
                    message: task.progress?.summary ?? "Running..."
                });
            }
        } else if (isTerminalTaskStatus(task.status)) {
            // Terminal status attachment
            attachments.push({
                type: "task_status",
                taskId: task.id,
                taskType: task.type,
                status: task.status,
                description: task.description,
                deltaSummary: content
            });
        }
    }

    return { attachments, updatedTaskOffsets, evictedTaskIds };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
// Y→evictedTaskIds, z→tasks
```

### getRunningTasks (EV8)

**What it does:** Returns all tasks with status "running".

**Location:** chunks.90.mjs:3053-3056

```javascript
// ============================================
// EV8 - getRunningTasks - Get all running tasks
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

## Task Output File System

### Output File Path

Each task has a dedicated output file:

```
~/.claude/tasks/{taskId}.output
```

**Example paths:**
- `~/.claude/tasks/a3f4b2.output` - local_agent task
- `~/.claude/tasks/b7c4e1.output` - local_bash task
- `~/.claude/tasks/t5d3b9.output` - in_process_teammate task

### Output File Operations

#### readOutputFileDelta (WjA)

```javascript
// ============================================
// WjA - readOutputFileDelta - Incremental output read
// Location: chunks.89.mjs:276
// ============================================

// READABLE (for understanding):
function readOutputFileDelta(taskId, currentOffset) {
    try {
        let filePath = getOutputFilePath(taskId);

        if (!existsSync(filePath)) {
            return { content: "", newOffset: currentOffset };
        }

        let fileSize = statSync(filePath).size;

        if (fileSize <= currentOffset) {
            return { content: "", newOffset: currentOffset };
        }

        // Read only new bytes
        let content = readFileSync(filePath, "utf8").slice(currentOffset);

        return {
            content: content,
            newOffset: fileSize
        };
    } catch (err) {
        logError(err);
        return { content: "", newOffset: currentOffset };
    }
}
```

**Key insight:** The offset pattern enables efficient incremental reads:
- No state on server side
- Offset passed in by caller (pure function)
- New offset returned for next call
- Works like a cursor

---

## Attachment Generation

### Task Status Attachment

Generated when a task reaches terminal state:

```javascript
// READABLE (for understanding):
function buildTaskStatusAttachment(task, deltaContent) {
    let summary = "";
    switch (task.status) {
        case "completed":
            summary = `Agent "${task.description}" completed`;
            break;
        case "failed":
            summary = `Agent "${task.description}" failed: ${task.error ?? "Unknown error"}`;
            break;
        case "killed":
            summary = `Agent "${task.description}" was stopped`;
            break;
    }

    return {
        type: "task_status",
        taskId: task.id,
        taskType: task.type,
        status: task.status,
        description: task.description,
        deltaSummary: deltaContent,
        summary: summary
    };
}
```

### Task Progress Attachment

Generated for running tasks (throttled):

```javascript
// READABLE (for understanding):
function buildTaskProgressAttachment(task) {
    return {
        type: "task_progress",
        taskId: task.id,
        taskType: task.type,
        message: task.progress?.summary ?? "Running...",
        toolUseCount: task.progress?.toolUseCount,
        tokenCount: task.progress?.tokenCount
    };
}
```

---

## System Reminder Integration

### Attachment to System Reminder Conversion

Attachments are wrapped in system-reminder tags:

```javascript
// READABLE (for understanding):
function attachmentToSystemReminder(attachment) {
    let content = "";

    switch (attachment.type) {
        case "task_status":
            content = `<task_status>
<task_id>${attachment.taskId}</task_id>
<task_type>${attachment.taskType}</task_type>
<status>${attachment.status}</status>
<description>${attachment.description}</description>
<delta_summary>${attachment.deltaSummary}</delta_summary>
</task_status>`;
            break;

        case "task_progress":
            content = `<task_progress>
<task_id>${attachment.taskId}</task_id>
<task_type>${attachment.taskType}</task_type>
<message>${attachment.message}</message>
</task_progress>`;
            break;
    }

    return wrapWithSystemReminderTags(content);
}
```

### Result Format

```xml
<system-reminder>
<task_status>
<task_id>a3f4b2</task_id>
<task_type>local_agent</task_type>
<status>completed</status>
<description>Search codebase</description>
<delta_summary>Found 15 occurrences of createTaskId in 8 files...</delta_summary>
</task_status>
</system-reminder>
```

---

## Task Eviction Logic

### When Tasks Are Evicted

Tasks are removed from state when:
1. Status is terminal (completed/failed/killed)
2. Task has been notified
3. Output has been read

```javascript
// READABLE (for understanding):
function shouldEvictTask(task) {
    // Only evict terminal tasks
    if (!isTerminalTaskStatus(task.status)) return false;

    // Must have been notified
    if (!task.notified) return false;

    return true;
}
```

### Eviction Flow

```
1. pollTaskOutputs identifies tasks to evict
2. updateTaskOffsets removes evicted tasks from state
3. Task output file is NOT deleted (preserved for transcript)
```

---

## Notification Flow Examples

### Example 1: Background Agent Completes

```
1. Agent loop finishes execution
2. markTaskCompleted($m8) called:
   - status = "completed"
   - endTime = Date.now()
   - notified = false (initially)
3. Main loop calls pollTaskOutputs:
   - Reads output delta
   - Builds task_status attachment
   - Marks task for eviction
4. Attachment injected into LLM context
5. Task evicted from state after notification
```

### Example 2: Task Killed Mid-Execution

```
1. User presses Ctrl+C
2. killAllLocalAgents(U4q) called:
   - triggerAbortSignal(x66) for each task
   - status = "killed"
   - abortController.abort()
   - unregisterCleanup()
3. markTaskKilled(d4q) called:
   - notified = true
4. pollTaskOutputs reads partial output
5. task_status with "killed" status injected
```

---

## Progress Throttling

### Throttle Mechanism

Progress attachments are throttled to prevent noise:

```javascript
// READABLE (for understanding):
const PROGRESS_THROTTLE_TURNS = 3;

function shouldShowProgress(task) {
    // Always show for new tasks
    if (task.turnsSinceProgress === undefined || task.turnsSinceProgress === Infinity) {
        return true;
    }

    // Throttle based on turn count
    return task.turnsSinceProgress >= PROGRESS_THROTTLE_TURNS;
}
```

### Turn Counting

```javascript
// > **CORRECTION:** `TIY` is actually `countUniqueUris` (counts unique URIs for LSP). The function below describes an INLINE progress throttling mechanism, NOT the TIY function. See `key_algorithms_deep_dive.md` Algorithm 10.

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
    let count = 0;

    // Count backwards from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message.role === "assistant") {
            count++;
        }

        // Stop when we find a message with progress attachment
        if (hasProgressAttachment(message)) {
            return count;
        }
    }

    return Infinity; // No previous progress found
}
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | ✓ Verified |
| `OY4` | updateTaskOffsets | chunks.90.mjs:3087 | ✓ Verified |
| `WjA` | readOutputFileDelta | chunks.89.mjs:276 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |

---

## Related Documents

- [progress_tracking_source_restored.md](./progress_tracking_source_restored.md) - Progress tracking details
- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine
- [../04_system_reminder/](../04_system_reminder/) - System reminder module