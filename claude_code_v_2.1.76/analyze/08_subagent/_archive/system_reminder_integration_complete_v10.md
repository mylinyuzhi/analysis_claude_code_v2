# System Reminder Integration Complete V10 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agent status integrates with the system reminder system for LLM context injection, including attachment producers, normalization, and cross-feature coordination.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v4.md](../08_subagent/cross_validation_unified_v4.md) - Unified symbol verification

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `f4` - createTaskStatusAttachment — `chunks.147.mjs:942`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `_uY` - assembleAllAttachments — `chunks.147.mjs:3`

---

## Overview

System reminders are the mechanism by which Claude Code injects contextual information into the LLM conversation without it being visible in the chat UI. For subagents and background agents, this integration enables:

1. **Progress visibility** - The LLM knows what background tasks are running
2. **Result delivery** - Completed task results are injected as context
3. **State synchronization** - The LLM's context matches the actual task state
4. **Notification awareness** - The LLM can reference completed tasks

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION PIPELINE                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Task State     │     │  Output Files   │     │  App State      │
│  (chunks.146)   │     │  (chunks.41)    │     │  (chunks.90)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      getUnifiedTasksAttachment (suY)                         │
│                      chunks.147.mjs:1033-1048                                │
│                                                                              │
│  1. Poll output files for delta content                                      │
│  2. Update task state with new results                                       │
│  3. Build attachments for all tasks                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   normalizeAttachmentForAPI (Ui8)                            │
│                   chunks.174.mjs:3-469                                       │
│                                                                              │
│  Convert attachments to user messages with isMeta: true                      │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LLM API Message Stream                                 │
│                                                                              │
│  User message with task_status attachment injected inline                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: getUnifiedTasksAttachment (suY)

### What It Does

Orchestrates the polling of task outputs and builds unified task status attachments for the LLM.

### How It Works

```
Step 1: Get current app state
Step 2: Poll output files for all tasks
Step 3: Update task state with new results
Step 4: Build attachments for each task
Step 5: Return simplified attachment objects
```

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
        attachments,          // New attachments to send
        updatedTaskOffsets,   // New read positions
        evictedTaskIds        // Tasks to remove from state
    } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new results
    updateTaskState(
        toolUseContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );

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

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState, K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Poll on demand | Only reads when LLM needs context |
| Delta-based | Only new content is included |
| Atomic update | State stays consistent |
| Simplified output | Reduces token usage in LLM context |

---

## Helper Function: pollTaskOutputs (wY4)

### What It Does

Reads incremental output from all task output files and builds attachments.

### Source Code

```javascript
// ============================================
// wY4 - pollTaskOutputs
// Location: chunks.90.mjs:3058-3085
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
    let updatedOffsets = {};
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
                case "pending":
                    continue;
                case "running":
                    break;
            }
        }

        // Poll running tasks for new output
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                updatedOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments,          // New attachments to send
        updatedOffsets,       // New read positions
        evictedTaskIds        // Tasks to remove from state
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedOffsets, Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

---

## Helper Function: updateTaskState (OY4)

### What It Does

Applies poll results to the application state atomically.

### Source Code

```javascript
// ============================================
// OY4 - updateTaskState
// Location: chunks.90.mjs:3087-3109
// ============================================

// ORIGINAL (for source lookup):
function OY4(A, q, K) {
    let Y = Object.keys(q);
    if (Y.length === 0 && K.length === 0) return;
    A((z) => {
        let _ = !1,
            w = {
                ...z.tasks
            };
        for (let O of Y) {
            let $ = w[O];
            if ($?.status === "running") w[O] = {
                ...$,
                outputOffset: q[O]
            }, _ = !0
        }
        for (let O of K)
            if (w[O]) delete w[O], _ = !0;
        return _ ? {
            ...z,
            tasks: w
        } : z
    })
}

// READABLE (for understanding):
function updateTaskState(setAppState, updatedOffsets, evictedIds) {
    let offsetKeys = Object.keys(updatedOffsets);

    // Early return if no changes
    if (offsetKeys.length === 0 && evictedIds.length === 0) return;

    setAppState((appState) => {
        let hasChanges = false;
        let newTasks = { ...appState.tasks };

        // Update output offsets for running tasks
        for (let taskId of offsetKeys) {
            let task = newTasks[taskId];
            if (task?.status === "running") {
                newTasks[taskId] = {
                    ...task,
                    outputOffset: updatedOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedIds) {
            if (newTasks[taskId]) {
                delete newTasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        return hasChanges ? { ...appState, tasks: newTasks } : appState;
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedOffsets, K→evictedIds, Y→offsetKeys, z→appState, _→hasChanges, w→newTasks
```

---

## Attachment Producer Registration

### Where Producers Are Called

```javascript
// ============================================
// Attachment producer orchestration
// Location: chunks.147.mjs:3-100
// ============================================

async function assembleAllAttachments(toolUseContext, sessionContext) {
    let allAttachments = [];

    // 1. Task status attachments
    let taskAttachments = await getUnifiedTasksAttachment(toolUseContext);
    allAttachments.push(...taskAttachments);

    // 2. Todo list attachments
    if (hasTodoList(sessionContext)) {
        let todoAttachment = await getTodoAttachment(sessionContext);
        allAttachments.push(todoAttachment);
    }

    // 3. Timer/reminders
    if (shouldShowReminder(sessionContext)) {
        let reminderAttachment = await getReminderAttachment(sessionContext);
        allAttachments.push(reminderAttachment);
    }

    // 4. Deduplicate by type
    let deduped = deduplicateAttachments(allAttachments);

    return deduped;
}
```

---

## Attachment Format

### Task Status Attachment

The attachment that gets converted to a system reminder:

```javascript
{
    type: "task_status",
    taskId: "a7x9k2m3",
    taskType: "local_agent",
    status: "running",  // or "completed", "failed", "killed"
    description: "Search codebase for authentication patterns",
    deltaSummary: "Found 12 authentication patterns in src/auth/..."
}
```

### Converted System Reminder

After normalization, this becomes a user message:

```xml
<system-reminder>
<task_status task_id="a7x9k2m3" type="local_agent" status="running">
<description>Search codebase for authentication patterns</description>
<delta>Found 12 authentication patterns in src/auth/...</delta>
</task_status>
</system-reminder>
```

---

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PER-TURN INTEGRATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User sends message
        │
        ▼
Agent loop prepares LLM request
        │
        ├─── Call assembleAllAttachments (_uY)
        │    │
        │    ├─── Call getUnifiedTasksAttachment (suY)
        │    │    │
        │    │    ├─── Poll output files (wY4)
        │    │    │    └─── readOutputFileDelta for each task
        │    │    │
        │    │    └─── Update task state (OY4)
        │    │
        │    └─── Return attachments array
        │
        ▼
normalizeAttachmentForAPI (Ui8)
        │
        ├─── For each attachment:
        │    └─── Create user message with isMeta: true
        │
        ▼
LLM receives message with task status embedded
        │
        ▼
LLM can reference background task progress in response
```

---

## Cross-Feature Integration

### With Compact Module (07_compact)

System reminders participate in auto-compact:
- `isMeta: true` messages have special retention rules
- Task status attachments may be preserved longer
- Completed tasks can be summarized

```javascript
// Compact behavior for meta messages
function shouldCompactMessage(message) {
    // Meta messages (system reminders) have different rules
    if (message.isMeta) {
        // Keep task_status for running tasks longer
        if (message.attachment?.status === "running") {
            return false;  // Don't compact running tasks
        }
        // Compact completed tasks earlier
        return true;
    }
    // Normal message compaction rules
    return isOldMessage(message);
}
```

### With Hooks Module (11_hooks)

Hooks can trigger on task events:
- `SubagentStart` - When subagent begins
- `SubagentStop` - When subagent ends

Hook results are also delivered as system reminders.

```javascript
// Hook event types for subagents
const SUBAGENT_HOOK_EVENTS = [
    "PreToolUse:Agent",    // Before agent spawns
    "PostToolUse:Agent",   // After agent completes
    "SubagentStart",       // When subagent begins execution
    "SubagentStop"         // When subagent finishes
];

// Hook result injection
function createHookAttachment(hookResult) {
    return {
        type: "hook_result",
        hookName: hookResult.hookName,
        toolUseId: hookResult.toolUseId,
        content: hookResult.additionalContexts,
        blockingError: hookResult.blockingError
    };
}
```

### With UI Module (02_ui)

The UI displays task status:
- Status line shows running count
- Notification toasts for completion
- Task list modal for details

```javascript
// UI update on task state change
function onTaskStateChange(appState) {
    // Update status line
    let runningCount = getRunningTasks(appState).length;
    statusLine.update({
        backgroundCount: runningCount,
        killHint: runningCount > 0 ? "Ctrl+F stop" : null
    });

    // Check for newly completed tasks
    for (let task of Object.values(appState.tasks)) {
        if (isTerminalStatus(task.status) && !task.notified) {
            // Show notification
            showNotification({
                type: "task_complete",
                taskId: task.id,
                status: task.status,
                description: task.description
            });

            // Mark as notified
            atomicUpdateTask(task.id, setAppState, (t) => ({
                ...t,
                notified: true
            }));
        }
    }
}
```

### With Telemetry (17_telemetry)

Progress updates send telemetry:

```javascript
// Telemetry event for task progress
{
    type: "system",
    subtype: "task_progress",
    task_id: "a7x9k2m3",
    tool_use_id: "toolu_01ABC...",
    description: "Searching auth patterns",
    usage: {
        total_tokens: 12543,
        tool_uses: 5,
        duration_ms: 45000
    }
}
```

---

## Attachment Types

### Types Used for Background Agents

| Type | Description | Trigger |
|------|-------------|---------|
| `task_status` | Current status of a task | Every LLM turn |
| `task_progress` | Incremental progress update | On progress change |
| `task_reminder` | Periodic reminder of tasks | Every N turns |

### Attachment Content Examples

```javascript
// Running task
{
    type: "task_status",
    taskId: "a7x9k2m3",
    status: "running",
    description: "Search codebase...",
    deltaSummary: "Processing src/auth/login.ts..."
}

// Completed task
{
    type: "task_status",
    taskId: "a7x9k2m3",
    status: "completed",
    description: "Search codebase...",
    deltaSummary: "Found 12 patterns, see full results in output file"
}

// Failed task
{
    type: "task_status",
    taskId: "a7x9k2m3",
    status: "failed",
    description: "Search codebase...",
    deltaSummary: "Error: Timeout after 60 seconds"
}

// Killed task
{
    type: "task_status",
    taskId: "a7x9k2m3",
    status: "killed",
    description: "Search codebase...",
    deltaSummary: "Task stopped by user (partial results available)"
}
```

---

## Key Insight

The system reminder integration creates a **feedback loop**:

1. LLM dispatches background agent
2. Agent runs asynchronously, writes to output file
3. Next LLM turn, output is read and injected as system reminder
4. LLM can reference the progress in its response
5. User sees LLM acknowledging background work

This makes background agents feel "connected" to the main conversation even though they run independently.

---

## Performance Considerations

### Delta Reading

Only new content since last read is included:
- Reduces token usage
- Prevents duplicate information
- Keeps LLM context fresh

### Truncation

Delta summaries are truncated to 500 characters:
- Prevents context bloat
- Forces meaningful summaries
- Full content available in output file

### Eviction

Terminal + notified tasks are removed from state:
- Prevents memory leaks
- Keeps state clean
- Results still in output file

---

## Normalization Process

### From Attachment to User Message

```javascript
// ============================================
// normalizeAttachmentForAPI
// Location: chunks.174.mjs:3-469
// ============================================

function normalizeAttachmentForAPI(attachment, sessionId) {
    switch (attachment.type) {
        case "task_status":
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: formatTaskStatusXML(attachment)
                }],
                isMeta: true,  // Important: Marked as meta
                uuid: generateUUID()
            };

        case "task_progress":
            return {
                role: "user",
                content: [{
                    type: "text",
                    text: formatTaskProgressXML(attachment)
                }],
                isMeta: true,
                uuid: generateUUID()
            };

        default:
            // Other attachment types...
    }
}

function formatTaskStatusXML(attachment) {
    return `<system-reminder>
<task_status task_id="${attachment.taskId}" type="${attachment.taskType}" status="${attachment.status}">
<description>${escapeXML(attachment.description)}</description>
${attachment.deltaSummary ? `<delta>${escapeXML(attachment.deltaSummary)}</delta>` : ''}
</task_status>
</system-reminder>`;
}
```

---

## Related Documents

- [key_algorithms_deep_dive_v10.md](../08_subagent/key_algorithms_deep_dive_v10.md) - Algorithm analysis
- [task_lifecycle_complete_source_v7.md](../26_background_agents/task_lifecycle_complete_source_v7.md) - Task lifecycle
- [types_task_management.md](../04_system_reminder/types_task_management.md) - Task management types

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full system reminder integration documentation