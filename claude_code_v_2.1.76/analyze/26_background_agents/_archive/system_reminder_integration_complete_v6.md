# System Reminder Integration Complete V6 (Claude Code 2.1.76)

> Complete documentation of how background agent status integrates with the system reminder system for LLM context injection.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Background agent symbol verification

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `Z97` - readOutputFileDelta — `chunks.41.mjs:2325`

---

## Integration Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKGROUND AGENT → SYSTEM REMINDER FLOW                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Background      │     │ Output File     │     │ System Reminder │
│ Agent Running   │────►│ .claude/tasks/  │────►│ Injection       │
│                 │     │ {id}.output     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │ Writes                │ Reads                 │ Injects
        │ progress               │ delta                 │ to LLM
        ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PER-TURN FLOW                                        │
│                                                                              │
│ 1. Agent loop prepares LLM request                                          │
│ 2. getUnifiedTasksAttachment called                                         │
│ 3. Output files polled for new content                                      │
│ 4. Task state updated with new offsets                                      │
│ 5. Attachments built for each task                                          │
│ 6. Attachments normalized to user messages                                  │
│ 7. LLM receives task status in context                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: getUnifiedTasksAttachment (suY)

### What it does

Orchestrates the polling of task outputs and builds unified task status attachments.

### Source Code

```javascript
// ============================================
// suY - getUnifiedTasksAttachment
// Location: chunks.147.mjs:1033-1048
// ============================================

async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll output files for all tasks
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
```

---

## Function: pollTaskOutputs (wY4)

### What it does

Reads incremental output from all task output files.

### Algorithm

```
For each task in appState.tasks:
    1. Skip if not local_agent
    2. Read delta from output file
    3. If content changed:
        a. Build attachment with delta summary
        b. Record new offset
    4. If terminal + notified:
        a. Mark for eviction

Return: attachments, offsets, evictions
```

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
        // Only process local_agent tasks
        if (task.type !== "local_agent") continue;
        if (!task.status) continue;

        // Read delta from output file
        let { content, newOffset } = await readOutputFileDelta(
            taskId,
            task.outputOffset ?? 0
        );

        // Build attachment if new content
        if (content) {
            attachments.push({
                taskId: taskId,
                taskType: task.type,
                status: task.status,
                description: task.description,
                deltaSummary: content.substring(0, 500),  // Truncate to 500 chars
                fullContent: content
            });
        }

        // Record offset change
        if (newOffset !== task.outputOffset) {
            updatedOffsets[taskId] = newOffset;
        }

        // Check for eviction (terminal status + user notified)
        if (isTerminalTaskStatus(task.status) && task.notified) {
            evictedTaskIds.push(taskId);
        }
    }

    return {
        attachments,
        updatedOffsets,
        evictedTaskIds
    };
}
```

---

## Function: updateTaskState (OY4)

### What it does

Updates task state with new offsets and removes evicted tasks.

### Source Code

```javascript
// ============================================
// OY4 - updateTaskState
// Location: chunks.90.mjs:3087-3109
// ============================================

function updateTaskState(setAppState, updatedOffsets, evictedTaskIds) {
    setAppState((state) => {
        let newTasks = { ...state.tasks };

        // Update offsets
        for (let [taskId, offset] of Object.entries(updatedOffsets)) {
            if (newTasks[taskId]) {
                newTasks[taskId] = {
                    ...newTasks[taskId],
                    outputOffset: offset
                };
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            delete newTasks[taskId];
        }

        return {
            ...state,
            tasks: newTasks
        };
    });
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

### Normalized to System Reminder

```xml
<task_status task_id="a7x9k2m3" type="local_agent" status="running">
<description>Search codebase for authentication patterns</description>
<delta>Found 12 authentication patterns in src/auth/...</delta>
</task_status>
```

---

## Attachment Types for Background Agents

| Type | Description | When Used |
|------|-------------|-----------|
| `task_status` | Current status of a task | Every LLM turn |
| `task_progress` | Incremental progress update | On progress change |
| `task_reminder` | Periodic reminder of tasks | Every N turns |

---

## Injection Timing

### When Attachments Are Added

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INJECTION TIMING                                     │
└─────────────────────────────────────────────────────────────────────────────┘

User sends message
        │
        ▼
Agent loop starts processing
        │
        ├─── assembleAllAttachments called
        │    │
        │    └─── getUnifiedTasksAttachment
        │         │
        │         ├─── First turn: Initialize offsets
        │         ├─── Running: Poll for delta
        │         └─── Terminal: Include final status
        │
        ▼
LLM request prepared with attachments
        │
        ▼
LLM receives task status in context
        │
        ▼
LLM can reference background work in response
```

---

## Delta Reading Strategy

### Why Delta-Based?

| Approach | Token Usage | Freshness |
|----------|-------------|-----------|
| Full file read | High | Current |
| Last N lines | Medium | Recent |
| **Delta read** | **Optimal** | **New only** |

### Delta Algorithm

```
1. Track offset per task (outputOffset)
2. On each read:
   a. Seek to last offset
   b. Read up to maxBytes
   c. Return new content + new offset
3. Update offset in state
4. Only new content is injected
```

### Truncation

Delta summaries are truncated to 500 characters:
- Prevents context bloat
- Forces meaningful summaries
- Full content available in output file

---

## State Lifecycle

### Task State Transitions

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Task Created    │────►│ Task Running    │────►│ Task Terminal   │
│                 │     │                 │     │ (completed/     │
│ outputOffset: 0 │     │ outputOffset: N │     │  failed/killed) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                       │
                                                       │ notified: true
                                                       │
                                                       ▼
                                                ┌─────────────────┐
                                                │ Task Evicted    │
                                                │ (removed from   │
                                                │  state)         │
                                                └─────────────────┘
```

### Eviction Rules

A task is evicted when:
1. Status is terminal (completed/failed/killed)
2. User has been notified (`notified: true`)

This ensures:
- Completed tasks don't pollute state
- Results are preserved in output file
- Memory is cleaned up

---

## Integration with Main Loop

### Where It's Called

```javascript
// In assembleAllAttachments (chunks.147.mjs:3-18)
async function assembleAllAttachments(toolUseContext, messages) {
    let attachments = [];

    // ... other attachment producers ...

    // Task status attachments
    let taskAttachments = await getUnifiedTasksAttachment(toolUseContext);
    attachments.push(...taskAttachments);

    return attachments;
}
```

### In Agent Loop

```javascript
// In agent loop (simplified)
for await (let event of llmMessageLoop({ ... })) {
    // Attachments are built into the message
    // Task status is included automatically
}
```

---

## Key Insight

The system reminder integration creates a **feedback loop** that makes background agents feel connected to the main conversation:

1. **LLM dispatches** background agent
2. **Agent writes** progress to output file
3. **Next turn**, output is read and injected
4. **LLM sees** progress and can reference it
5. **User experiences** seamless awareness

This design ensures background agents don't feel "disconnected" - the LLM always knows what's happening in the background.

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full system reminder integration documentation