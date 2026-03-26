# System Reminder Integration Complete V8 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agent systems integrate with the system reminder mechanism, including attachment producers, progress injection, and notification delivery.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `f4` - createTaskStatusAttachment — `chunks.147.mjs:942`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│  Background Agent    │         │    System Reminder   │
│  Execution           │         │    Producer          │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │ Progress updates               │ Attachment polling
           ▼                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Task State                                      │
│                                                                              │
│  tasks: {                                                                    │
│    "a7x9k2m3": {                                                             │
│      status: "running",                                                      │
│      progress: { toolUseCount: 5, tokenCount: 12543, summary: "..." }       │
│    }                                                                         │
│  }                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ pollTaskOutputs  │  │ Output File      │  │ Telemetry        │
│ (wY4)            │  │ Delta Read       │  │ Events           │
│                  │  │ (Z97)            │  │ (nl4)            │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    getUnifiedTasksAttachment (suY)                           │
│                                                                              │
│  1. Poll all task output files                                              │
│  2. Build task_status attachments                                           │
│  3. Update task offsets in state                                            │
│  4. Return attachments for system reminder                                   │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         System Reminder Message                              │
│                                                                              │
│  <system-reminder>                                                          │
│    <task_status taskId="a7x9k2m3" status="running">                         │
│      Searching codebase for authentication patterns                         │
│      tools: 5, tokens: 12.5k                                                │
│      Reading src/auth/login.ts...                                           │
│    </task_status>                                                           │
│  </system-reminder>                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Attachment Producers

### getUnifiedTasksAttachment (suY)

**What it does:** Main entry point for getting all task-related attachments for system reminders.

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Get all task attachments
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

    // Step 2: Poll all task output files and build attachments
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new offsets and evict completed tasks
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Step 4: Transform attachments to system reminder format
    return attachments.map(attachment => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState,
//          K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

### createTaskStatusAttachment (f4)

**What it does:** Creates a single task status attachment wrapper.

```javascript
// ============================================
// f4 - createTaskStatusAttachment - Create attachment wrapper
// Location: chunks.147.mjs:942-948
// ============================================

// READABLE (for understanding):
function createTaskStatusAttachment(taskInfo) {
    return {
        type: "task_status",
        taskId: taskInfo.taskId,
        taskType: taskInfo.taskType,
        status: taskInfo.status,
        description: taskInfo.description,
        deltaSummary: taskInfo.deltaSummary,
        startTime: taskInfo.startTime,
        endTime: taskInfo.endTime
    };
}
```

---

## Part 2: Task Output Polling

### pollTaskOutputs (wY4)

**What it does:** Polls all running task output files and builds attachments.

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all task outputs
// Location: chunks.90.mjs:3058-3085
// ============================================

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let tasks = appState.tasks;
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];

    for (let [taskId, task] of Object.entries(tasks)) {
        // Only poll running tasks with output files
        if (task.status !== "running" || !task.isBackgrounded) {
            continue;
        }

        // Read output delta from last offset
        let currentOffset = task.outputOffset ?? 0;
        let { content, newOffset } = await readOutputFileDelta(taskId, currentOffset);

        // Build attachment if there's new content
        if (content.length > 0) {
            attachments.push({
                taskId: taskId,
                taskType: task.type,
                status: task.status,
                description: task.description,
                deltaSummary: extractSummary(content),
                content: content
            });

            updatedTaskOffsets[taskId] = newOffset;
        }

        // Check for eviction conditions (completed + notified)
        if (isTerminalTaskStatus(task.status) && task.notified) {
            evictedTaskIds.push(taskId);
        }
    }

    return { attachments, updatedTaskOffsets, evictedTaskIds };
}

// Mapping: wY4→pollTaskOutputs
```

### updateTaskState (OY4)

**What it does:** Updates task offsets and removes evicted tasks.

```javascript
// ============================================
// OY4 - updateTaskState - Update task state after polling
// Location: chunks.90.mjs:3087-3109
// ============================================

// READABLE (for understanding):
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    setAppState(state => {
        let newTasks = { ...state.tasks };

        // Update offsets for all polled tasks
        for (let [taskId, newOffset] of Object.entries(updatedTaskOffsets)) {
            if (newTasks[taskId]) {
                newTasks[taskId] = {
                    ...newTasks[taskId],
                    outputOffset: newOffset
                };
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            delete newTasks[taskId];
        }

        return { ...state, tasks: newTasks };
    });
}

// Mapping: OY4→updateTaskState
```

---

## Part 3: Progress Tracking Integration

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress and sends telemetry events.

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
// Location: chunks.146.mjs:2059-2098
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

    // Update task progress atomically
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry
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

    // Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        sendTelemetry({
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

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          Y→progressData, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### updateTaskProgressPreservingSummary (TV1)

**What it does:** Updates progress metrics while keeping the user-visible summary.

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
            progress: existingSummary
                ? { ...newProgress, summary: existingSummary }
                : newProgress
        };
    });
}

// Mapping: TV1→updateTaskProgressPreservingSummary, A→taskId, q→newProgress,
//          K→setAppState, Y→task, z→existingSummary
```

---

## Part 4: Notification Delivery

### Task Completion Notification

```javascript
// ============================================
// Task Completion Notification Flow
// ============================================

function sendTaskCompletionNotification(task, setAppState) {
    // Mark task as completed
    markTaskCompleted({
        agentId: task.agentId,
        result: task.result
    }, setAppState);

    // Build notification message
    let notification = {
        type: "task_status",
        taskId: task.agentId,
        status: "completed",
        description: task.description,
        duration: Date.now() - task.startTime,
        tools: task.progress?.toolUseCount,
        tokens: task.progress?.tokenCount
    };

    // This appears in system reminder as:
    // <task_status taskId="a7x9k2m3" status="completed">
    //   Background agent "Search codebase" completed
    //   tools: 5, tokens: 12.5k, duration: 45s
    // </task_status>

    return notification;
}
```

### Task Failure Notification

```javascript
// ============================================
// Task Failure Notification Flow
// ============================================

function sendTaskFailureNotification(task, error, setAppState) {
    // Mark task as failed
    markTaskFailed(task.agentId, error.message, setAppState);

    // Build notification message
    let notification = {
        type: "task_status",
        taskId: task.agentId,
        status: "failed",
        description: task.description,
        error: error.message,
        duration: Date.now() - task.startTime
    };

    // This appears in system reminder as:
    // <task_status taskId="a9w2j7l4" status="failed">
    //   Background agent "Deploy to staging" failed
    //   Error: Connection timeout after 30s
    // </task_status>

    return notification;
}
```

### Task Kill Notification

```javascript
// ============================================
// Task Kill Notification Flow
// ============================================

function sendTaskKillNotification(task, setAppState) {
    // Mark task as killed
    markTaskKilled(task.agentId, setAppState);

    // Build notification message
    let notification = {
        type: "task_status",
        taskId: task.agentId,
        status: "killed",
        description: task.description,
        partialResults: task.progress?.summary
    };

    // This appears in system reminder as:
    // <task_status taskId="a7x9k2m3" status="killed">
    //   Background agent "Search codebase" was stopped by the user
    //   Partial results: Found 5 patterns before stop
    // </task_status>

    return notification;
}
```

---

## Part 5: System Reminder Format

### XML Tag Format

```xml
<!-- Running task progress -->
<task_status taskId="a7x9k2m3" taskType="local_agent" status="running">
  <description>Search codebase for authentication patterns</description>
  <progress tools="5" tokens="12543" />
  <delta>Reading src/auth/login.ts...</delta>
</task_status>

<!-- Completed task -->
<task_status taskId="a2m5k9t3" taskType="local_agent" status="completed">
  <description>Analyze performance</description>
  <summary>Found 3 bottlenecks in database queries</summary>
  <metrics tools="8" tokens="45200" duration="135000" />
</task_status>

<!-- Failed task -->
<task_status taskId="a9w2j7l4" taskType="local_agent" status="failed">
  <description>Deploy to staging</description>
  <error>Connection timeout after 30s</error>
</task_status>

<!-- Killed task -->
<task_status taskId="a7x9k2m3" taskType="local_agent" status="killed">
  <description>Search codebase</description>
  <partial>Found 5 patterns before stop</partial>
</task_status>
```

### Attachment to System Reminder

```javascript
// ============================================
// Attachment Normalization for API
// ============================================

function normalizeTaskAttachment(attachment) {
    let content = [];

    // Always include description
    content.push({
        type: "text",
        text: `Background agent "${attachment.description}" ${attachment.status}`
    });

    // Add status-specific content
    if (attachment.status === "running") {
        content.push({
            type: "text",
            text: `Progress: tools=${attachment.progress?.toolUseCount}, tokens=${attachment.progress?.tokenCount}`
        });
        if (attachment.deltaSummary) {
            content.push({
                type: "text",
                text: `Current: ${attachment.deltaSummary}`
            });
        }
    } else if (attachment.status === "failed") {
        content.push({
            type: "text",
            text: `Error: ${attachment.error}`
        });
    }

    return {
        type: "task_status",
        taskId: attachment.taskId,
        status: attachment.status,
        content: content
    };
}
```

---

## Part 6: Integration Points

### With Main Agent Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAIN AGENT LOOP INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

Main Agent Loop (Yh)
        │
        ├── Before LLM call
        │   └── getUnifiedTasksAttachment(toolUseContext)
        │       └── Returns task_status attachments
        │
        ├── LLM processes
        │   └── System reminder includes task progress
        │
        └── After LLM response
            └── Task attachments injected into next turn
```

### With Subagent Execution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBAGENT EXECUTION INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────────┘

agentLoopRunner (qh)
        │
        ├── Yield stream events
        │   └── Progress updates → nl4()
        │
        ├── Tool execution
        │   └── Update progress in task state
        │
        └── Completion
            ├── $m8() → mark completed
            └── Notification appears in parent's system reminder
```

### With Teammate System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAMMATE INTEGRATION                                      │
└─────────────────────────────────────────────────────────────────────────────┘

pollForNextMessage (DNY)
        │
        ├── Check mailbox
        │   └── readUnreadMessages()
        │
        ├── Process messages
        │   └── Progress updates → teammate context
        │
        └── Idle notification
            └── createIdleNotification() → writeToMailbox()
                └── Appears in team-lead's system reminder
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `c36` | sendTelemetry | chunks.146.mjs | ✓ Verified |
| `Nn` | isTelemetryEnabled | chunks.146.mjs | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - System reminder integration documented