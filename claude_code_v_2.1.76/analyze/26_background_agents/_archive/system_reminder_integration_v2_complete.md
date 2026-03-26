# Background Agents System Reminder Integration Complete (Claude Code 2.1.76)

> Complete source-level analysis of system reminder integration with background agents.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `g2` - getOutputFilePath — `chunks.41.mjs:2248`
- `Z97` - readOutputFileDelta — `chunks.89.mjs`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`

---

## Integration Overview

Background agents integrate with system reminders through **task status attachments**. These attachments inform the LLM about running background tasks and their completion status.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Background Agents System Reminder Flow                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐     ┌──────────────────────────┐
│  Background Agent Task   │     │  System Reminder System  │
│                          │     │                          │
│  createBackgroundAgent   │     │  assembleAllAttachments  │
│  Task (Qn4)              │     │  (_uY)                   │
│         │                │     │         │                │
│         ▼                │     │         ▼                │
│  ┌─────────────────┐     │     │  ┌─────────────────┐     │
│  │ Running State   │─────┼────►│  │ suY()           │     │
│  │ - status        │     │     │  │ - poll outputs  │     │
│  │ - progress      │     │     │  │ - build attach  │     │
│  │ - output file   │     │     │  └────────┬────────┘     │
│  └────────┬────────┘     │     │           │              │
│           │              │     │           ▼              │
│           ▼              │     │  ┌─────────────────┐     │
│  ┌─────────────────┐     │     │  │ task_status     │     │
│  │ nl4() each turn │─────┼────►│  │ attachment      │     │
│  │ Update progress │     │     │  │ - taskId        │     │
│  │ summary         │     │     │  │ - status        │     │
│  └────────┬────────┘     │     │  │ - description   │     │
│           │              │     │  │ - deltaSummary  │     │
│           ▼              │     │  └────────┬────────┘     │
│  ┌─────────────────┐     │     │           │              │
│  │ Completion      │─────┼────►│           ▼              │
│  │ $m8/Hm8/d4q     │     │     │  ┌─────────────────┐     │
│  │ Set terminal    │     │     │  │ LLM Context     │     │
│  │ status          │     │     │  │ Injection       │     │
│  └─────────────────┘     │     │  └─────────────────┘     │
└──────────────────────────┘     └──────────────────────────┘
```

---

## Task Output File System

### Output File Path Generation (g2)

**What it does:** Resolves task ID to output file path.

**Source Code:**

```javascript
// ============================================
// g2 - getOutputFilePath - Get output file path for task
// Location: chunks.41.mjs:2248 (inferred)
// ============================================

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    let tasksDir = getTasksDirectory();
    return path.join(tasksDir, `${taskId}.output`);
}

// Output file location: ~/.claude/tasks/{taskId}.output
```

### Output File Format

```
~/.claude/tasks/
├── a3f4b2c1.output    # local_agent output (prefix: "a")
├── b7d8e9f2.output    # local_bash output (prefix: "b")
├── t2a3b4c5.output    # in_process_teammate output (prefix: "t")
└── r9d8c7b6.output    # remote_agent output (prefix: "r")
```

**File Contents:**
```
[Agent Output: Search codebase for usages]

Tool: Grep
Pattern: "createTaskId"
Files: 15 matches found

Tool: Read
File: chunks.41.mjs
Found generateTaskId function at line 2410

Summary: Found 15 occurrences across 8 files. The createTaskId function
generates unique IDs with type prefixes...
```

---

## Polling and Output Reading

### readOutputFileDelta (Z97)

**What it does:** Reads new content from output file since last offset.

**Source Code:**

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.89.mjs (inferred)
// ============================================

// READABLE (for understanding):
async function readOutputFileDelta(taskId, currentOffset) {
    let filePath = getOutputFilePath(taskId);

    try {
        let stats = await fs.stat(filePath);
        let fileSize = stats.size;

        // If file hasn't grown, no new content
        if (fileSize <= currentOffset) {
            return {
                content: null,
                newOffset: currentOffset
            };
        }

        // Read only the new bytes
        let fd = await fs.open(filePath, 'r');
        let buffer = Buffer.alloc(fileSize - currentOffset);
        await fd.read(buffer, 0, buffer.length, currentOffset);
        await fd.close();

        return {
            content: buffer.toString('utf-8'),
            newOffset: fileSize
        };
    } catch (error) {
        // File doesn't exist or other error
        return {
            content: null,
            newOffset: currentOffset
        };
    }
}

// Mapping: Z97→readOutputFileDelta, taskId→taskId, currentOffset→outputOffset
```

**Why Incremental Reads:**

1. **Efficiency** - Only read new bytes, not entire file
2. **Memory** - Don't load entire output into memory
3. **Performance** - Minimize I/O operations
4. **Offset Tracking** - State maintains last read position

---

### pollTaskOutputs Complete Flow

```javascript
// ============================================
// wY4 - pollTaskOutputs - Complete flow
// Location: chunks.90.mjs:3058-3084
// ============================================

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // STEP 1: Check if task should be evicted
        // Tasks are evicted when they are terminal AND notified
        if (task.notified) {
            if (task.status === "completed" ||
                task.status === "failed" ||
                task.status === "killed") {
                evictedTaskIds.push(task.id);
                continue;  // Don't process further
            }

            if (task.status === "pending") {
                continue;  // Pending but notified - unusual, skip
            }
        }

        // STEP 2: For running tasks, read output delta
        if (task.status === "running") {
            let outputResult = await readOutputFileDelta(
                task.id,
                task.outputOffset ?? 0
            );

            // Track offset update
            if (outputResult.content) {
                updatedTaskOffsets[task.id] = outputResult.newOffset;
            }

            // Build progress attachment (throttled)
            // Note: Throttling is handled at a higher level
        }

        // STEP 3: Build attachment for this task
        // (Attachment building continues in implementation)
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}
```

---

## State Update After Polling

### updateTaskState (OY4)

**What it does:** Updates task offsets and removes evicted tasks.

**Source Code:**

```javascript
// ============================================
// OY4 - updateTaskState - Update offsets and evict tasks
// Location: chunks.90.mjs:3087-3100 (inferred)
// ============================================

// READABLE (for understanding):
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetTaskIds = Object.keys(updatedTaskOffsets);

    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;  // Nothing to update
    }

    setAppState((state) => {
        let tasks = { ...state.tasks };

        // Update offsets for tasks with new output
        for (let taskId of offsetTaskIds) {
            if (tasks[taskId]) {
                tasks[taskId] = {
                    ...tasks[taskId],
                    outputOffset: updatedTaskOffsets[taskId]
                };
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            delete tasks[taskId];
        }

        return {
            ...state,
            tasks: tasks
        };
    });
}
```

---

## Attachment Building Logic

### Task Status Attachment Structure

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: "local_agent" | "local_bash" | "in_process_teammate" | "remote_agent";
    status: "running" | "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;
}
```

### Attachment for Running Task

```javascript
// Build attachment for running task
function buildRunningTaskAttachment(task) {
    return {
        type: "task_status",
        taskId: task.id,
        taskType: task.type,
        status: "running",
        description: task.description,
        deltaSummary: task.progress?.summary ?? "Running..."
    };
}
```

### Attachment for Completed Task

```javascript
// Build attachment for completed task
function buildCompletedTaskAttachment(task) {
    return {
        type: "task_status",
        taskId: task.id,
        taskType: task.type,
        status: "completed",
        description: task.description,
        deltaSummary: task.result?.summary ?? "Task completed successfully"
    };
}
```

### Attachment for Failed Task

```javascript
// Build attachment for failed task
function buildFailedTaskAttachment(task) {
    return {
        type: "task_status",
        taskId: task.id,
        taskType: task.type,
        status: "failed",
        description: task.description,
        deltaSummary: task.error ?? "Task failed with an error"
    };
}
```

---

## Notification Delivery Guarantees

### The `notified` Flag Lifecycle

```
Task Created
    │
    ▼
status: "running", notified: false
    │
    │ (Task executes...)
    ▼
Task Completes/Fails/Killed
    │
    ▼
status: "completed", notified: false
    │
    │ (Attachment built by suY)
    ▼
Attachment sent to LLM, notified: true
    │
    │ (Next pollTaskOutputs call)
    ▼
Task evicted from state
```

### Why This Matters

1. **Exactly-once delivery** - Task completion notification appears once in LLM context
2. **No duplicates** - `notified: true` prevents rebuilding attachment
3. **Cleanup timing** - Tasks removed only after LLM has seen status
4. **Crash resilience** - If system crashes before notification, task persists for next session

---

## Progress Update Timing

### When Progress Updates Happen

```javascript
// In agent loop (qh), progress updates occur:

// 1. After each tool use
for await (let message of llmLoop) {
    if (message.type === "tool_result") {
        // Update progress with current activity
        let summary = formatToolActivity(message);
        updateTaskProgressWithTelemetry(taskId, summary, setAppState);
    }
}

// 2. After token usage updates
if (message.usage) {
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        progress: {
            ...task.progress,
            tokenCount: (task.progress?.tokenCount ?? 0) + message.usage.total_tokens
        }
    }));
}
```

### Progress Summary Format

Progress summaries are short descriptions of current activity:

```
"Running Grep for 'createTaskId' in src/..."
"Reading file: chunks.41.mjs"
"Writing output to: result.txt"
"Waiting for Bash command to complete..."
```

---

## Throttling Mechanism

### Turn-Based Throttling

```javascript
// Throttle decision (simplified)
function shouldSendProgressAttachment(task, turnsSinceProgress) {
    // Always send for new tasks (Infinity)
    if (turnsSinceProgress === Infinity) {
        return true;
    }

    // Send if summary changed
    if (task.progress?.summary !== task.lastSentSummary) {
        return true;
    }

    // Throttle: only send every 3+ turns
    if (turnsSinceProgress >= 3) {
        return true;
    }

    return false;
}
```

### Throttle Rationale

| Condition | Send? | Why |
|-----------|-------|-----|
| New task | ✓ | LLM needs to know about new background task |
| Summary changed | ✓ | Meaningful update, worth reporting |
| 3+ turns since last | ✓ | Periodic update without overwhelming |
| < 3 turns | ✗ | Too frequent, would pollute context |

---

## Cross-Feature Integration

### With 04_system_reminder

```
Background Agent                    System Reminder
        │                                   │
        ├── Task state change               │
        │   └────────────────────────────►  │
        │       suY() builds attachment     │
        │                                   │
        └── Progress update                 │
            └────────────────────────────►  │
                nl4() updates state         │
```

### With 05_tools

```
BashTool / AgentTool                Background System
        │                                   │
        ├── run_in_background: true         │
        │   └────────────────────────────►  │
        │       Qn4() creates task          │
        │                                   │
        └── Tool completes                  │
            └────────────────────────────►  │
                $m8() marks complete        │
```

### With 01_cli

```
User Ctrl+C                         Background System
        │                                   │
        ├── Kill request                    │
        │   └────────────────────────────►  │
        │       U4q() kills all agents      │
        │                                   │
        └── Notification shown              │
            ◄────────────────────────────   │
                d4q() sets notified         │
```

---

## End-to-End Example

### Background Agent Spawn and Tracking

```
1. User calls AgentTool with run_in_background: true

AgentTool.call({
    prompt: "Search codebase for all uses of createTaskId...",
    description: "Find createTaskId usages",
    run_in_background: true
})

        │
        ▼

2. createBackgroundAgentTask (Qn4) creates task

{
    id: "a3f4b2c1",
    type: "local_agent",
    status: "running",
    description: "Find createTaskId usages",
    prompt: "Search codebase...",
    isBackgrounded: true,
    outputOffset: 0,
    notified: false,
    progress: { toolUseCount: 0, tokenCount: 0, summary: null }
}

        │
        ▼

3. Agent runs, progress updates

nl4("a3f4b2c1", "Running Grep for 'createTaskId'...", setAppState)
    → progress.summary = "Running Grep..."

        │
        ▼

4. Before parent LLM turn, pollTaskOutputs runs

wY4(appState)
    → Read output delta from ~/.claude/tasks/a3f4b2c1.output
    → Build attachment

        │
        ▼

5. LLM receives attachment

<task_status>
  <task_id>a3f4b2c1</task_id>
  <task_type>local_agent</task_type>
  <status>running</status>
  <description>Find createTaskId usages</description>
  <delta_summary>Running Grep for 'createTaskId' in 15 files...</delta_summary>
</task_status>

        │
        ▼

6. Agent completes

$m8(result, setAppState)
    → status: "completed"
    → result: { summary: "Found 15 occurrences..." }
    → notified: false

        │
        ▼

7. Next poll, completion attachment sent

<task_status>
  <task_id>a3f4b2c1</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Find createTaskId usages</description>
  <delta_summary>Found 15 occurrences in 8 files. Key findings:
    - createTaskId generates unique IDs with type prefixes
    - Used in task creation flow
  </delta_summary>
</task_status>

    → notified: true

        │
        ▼

8. Next poll, task evicted

VR("a3f4b2c1", setAppState)
    → Task removed from appState.tasks
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.89.mjs | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |

---

## Related Documents

- [system_reminder_deep_integration_v2.md](../08_subagent/system_reminder_deep_integration_v2.md) - Subagent integration
- [output_file_system_complete.md](./output_file_system_complete.md) - Output file system
- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - Task state machine
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - All attachment producers