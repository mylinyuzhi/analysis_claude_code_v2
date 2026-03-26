# System Reminder Integration Complete V9 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agent status integrates with the system reminder system for LLM context injection.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `f4` - createTaskStatusAttachment — `chunks.147.mjs:942`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`

---

## Overview

System reminders are the mechanism by which Claude Code injects contextual information into the LLM conversation without it being visible in the chat UI. For subagents and background agents, this integration enables:

1. **Progress visibility** - The LLM knows what background tasks are running
2. **Result delivery** - Completed task results are injected as context
3. **State synchronization** - The LLM's context matches the actual task state

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

### What it does

Orchestrates the polling of task outputs and builds unified task status attachments for the LLM.

### How it works

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

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| Poll on demand | Only reads when LLM needs context |
| Delta-based | Only new content is included |
| Atomic update | State stays consistent |
| Simplified output | Reduces token usage in LLM context |

---

## Helper Function: pollTaskOutputs (wY4)

### What it does

Reads incremental output from all task output files and builds attachments.

### Source Code

```javascript
// ============================================
// wY4 - pollTaskOutputs
// Location: chunks.90.mjs:3058-3085
// ============================================

async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedOffsets = {};
    let evictedTaskIds = [];

    for (let [taskId, task] of Object.entries(appState.tasks)) {
        if (task.type !== "local_agent") continue;
        if (!task.status) continue;

        // Read delta from output file
        let { content, newOffset } = await readOutputFileDelta(
            taskId,
            task.outputOffset ?? 0
        );

        if (content) {
            attachments.push({
                taskId: taskId,
                taskType: task.type,
                status: task.status,
                description: task.description,
                deltaSummary: content.substring(0, 500),  // Truncate
                fullContent: content
            });
        }

        if (newOffset !== task.outputOffset) {
            updatedOffsets[taskId] = newOffset;
        }

        // Check for eviction (terminal + notified)
        if (isTerminalTaskStatus(task.status) && task.notified) {
            evictedTaskIds.push(taskId);
        }
    }

    return { attachments, updatedOffsets, evictedTaskIds };
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
<task_status task_id="a7x9k2m3" type="local_agent" status="running">
<description>Search codebase for authentication patterns</description>
<delta>Found 12 authentication patterns in src/auth/...</delta>
</task_status>
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

### With Hooks Module (11_hooks)

Hooks can trigger on task events:
- `SubagentStart` - When subagent begins
- `SubagentStop` - When subagent ends

Hook results are also delivered as system reminders.

### With UI Module (02_ui)

The UI displays task status:
- Status line shows running count
- Notification toasts for completion
- Task list modal for details

---

## Attachment Types

### Types Used for Background Agents

| Type | Description | Trigger |
|------|-------------|---------|
| `task_status` | Current status of a task | Every LLM turn |
| `task_progress` | Incremental progress update | On progress change |
| `task_reminder` | Periodic reminder of tasks | Every N turns |

### Attachment Content

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

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full system reminder integration documentation