# System Reminder Producers - Background Tasks (Claude Code 2.1.76)

> Source-level analysis of how background task state is converted to system reminder attachments.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `pollTaskOutputs` (wY4) - Poll task output files — `chunks.90.mjs:3058`
- `updateTaskOffsets` (OY4) - Update task state after polling — `chunks.90.mjs:3087`
- `buildTaskStatusAttachments` - Build task_status attachments — `chunks.147.mjs:1035`
- `normalizeAttachmentForAPI` (Ui8) - Normalize for API — `chunks.174.mjs:3`
- `wrapWithSystemReminderTags` (b5) - Wrap in system-reminder tags — `chunks.173.mjs:2496`
- `createUserMessage` (p1) - Create user message — `chunks.173.mjs:1378`

---

## Attachment Types

### task_status

Generated when a task reaches a terminal state (completed, failed, killed).

**Structure:**
```javascript
{
    type: "task_status",
    taskId: string,       // e.g., "a3f4b2"
    taskType: string,     // "local_agent" | "local_bash" | "remote_agent"
    status: string,       // "completed" | "failed" | "killed"
    description: string,  // Human-readable task description
    deltaSummary: string  // New output since last notification
}
```

### task_progress

Generated periodically while a task is running (throttled).

**Structure:**
```javascript
{
    type: "task_progress",
    taskId: string,
    taskType: string,
    message: string       // Current activity description
}
```

---

## Production Flow

### Integration with Message Assembly

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Main Agent Loop (LLM Turn)                                │
│  Before processing messages                                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              pollTaskOutputs (wY4)                                           │
│                                                                              │
│  1. Get all tasks from appState.tasks                                       │
│  2. For each task:                                                          │
│     - Read output file from last offset                                     │
│     - Build delta summary for terminal tasks                                │
│     - Return attachments array                                               │
│  3. Return: { attachments, updatedTaskOffsets, evictedTaskIds }             │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              updateTaskOffsets (OY4)                                         │
│                                                                              │
│  Update appState.tasks with new offsets and remove evicted tasks            │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              buildTaskStatusAttachments                                      │
│                                                                              │
│  Convert task data to attachment format:                                    │
│  { type: "task_status", taskId, taskType, status, description, deltaSummary }│
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              normalizeAttachmentForAPI (Ui8)                                 │
│                                                                              │
│  Convert attachment to API message format                                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              wrapWithSystemReminderTags (b5)                                 │
│                                                                              │
│  Wrap in <system-reminder> tags for LLM context                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Analysis

### buildTaskStatusAttachments

**Location:** chunks.147.mjs:1035-1048

```javascript
// ============================================
// buildTaskStatusAttachments - Convert task data to attachments
// Location: chunks.147.mjs:1035-1048
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
async function buildTaskStatusAttachments(toolUseContext) {
    // Poll task outputs for all running/terminal tasks
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(toolUseContext);

    // Update app state with new offsets
    updateTaskOffsets(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Convert to attachment format
    return attachments.map((att) => ({
        type: "task_status",
        taskId: att.taskId,
        taskType: att.taskType,
        status: att.status,
        description: att.description,
        deltaSummary: att.deltaSummary
    }));
}

// Mapping: wY4→pollTaskOutputs, OY4→updateTaskOffsets
```

### task_status Message Rendering

**Location:** chunks.174.mjs:330-342

```javascript
// ============================================
// task_status rendering to system reminder
// Location: chunks.174.mjs:330-342
// ============================================

// ORIGINAL (for source lookup):
case "task_status": {
    let K = A.status === "killed" ? "stopped" : A.status;
    if (A.status === "killed") return [p1({
        content: af(`Task "${A.description}" (${A.taskId}) was stopped by the user.`),
        isMeta: !0
    })];
    let Y = [`Task ${A.taskId}`, `(type: ${A.taskType})`, `(status: ${K})`, `(description: ${A.description})`];
    if (A.deltaSummary) Y.push(`Delta: ${A.deltaSummary}`);
    return Y.push("You can check its output using the TaskOutput tool."), [p1({
        content: af(Y.join(" ")),
        isMeta: !0
    })]
}

// READABLE (for understanding):
function renderTaskStatus(attachment) {
    // Special handling for killed tasks
    if (attachment.status === "killed") {
        return [createUserMessage({
            content: wrapWithSystemReminderTags(
                `Task "${attachment.description}" (${attachment.taskId}) was stopped by the user.`
            ),
            isMeta: true
        })];
    }

    // Build status message
    let statusText = attachment.status === "killed" ? "stopped" : attachment.status;
    let parts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${statusText})`,
        `(description: ${attachment.description})`
    ];

    // Include delta summary if available
    if (attachment.deltaSummary) {
        parts.push(`Delta: ${attachment.deltaSummary}`);
    }

    // Add hint for checking output
    parts.push("You can check its output using the TaskOutput tool.");

    return [createUserMessage({
        content: wrapWithSystemReminderTags(parts.join(" ")),
        isMeta: true
    })];
}

// Mapping: K→statusText, A→attachment, p1→createUserMessage, af→wrapWithSystemReminderTags
```

**Output Example:**

```
<system-reminder>
Task a3f4b2 (type: local_agent) (status: completed) (description: Find API usages)
Delta: Found 15 occurrences in 8 files including src/api.js, lib/client.ts...
You can check its output using the TaskOutput tool.
</system-reminder>
```

---

## Progress Throttling

### Turn Counting Algorithm

Progress attachments are throttled to prevent excessive noise:

**Threshold:** 3 assistant turns since last progress report

**Algorithm:**

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling
// Location: chunks.142.mjs:2703-2717
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }

    // Tasks not in map get Infinity (first progress always shown)
    return turnsSinceProgress;
}
```

**Why Backwards Iteration?**
1. **Efficiency** - Stop after finding the most recent progress
2. **Correctness** - Count turns SINCE last progress, not total
3. **Infinity default** - New tasks always get their first progress shown

### Throttle Decision Logic

```javascript
// READABLE (for understanding):
function shouldShowProgress(taskId, turnsSinceProgress, PROGRESS_THRESHOLD = 3) {
    let turns = turnsSinceProgress.get(taskId);
    if (turns === undefined) {
        // New task - always show first progress
        return true;
    }
    return turns >= PROGRESS_THRESHOLD;
}
```

---

## Attachment Normalization

### Ui8 - normalizeAttachmentForAPI

**Location:** chunks.174.mjs:3-50

```javascript
// ============================================
// normalizeAttachmentForAPI - Convert attachment to API format
// Location: chunks.174.mjs:3-50
// ============================================

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    switch (attachment.type) {
        case "task_status":
            return renderTaskStatus(attachment);

        case "task_progress":
            return renderTaskProgress(attachment);

        case "teammate_messages":
            return renderTeammateMessages(attachment);

        // ... other cases

        default:
            return [];
    }
}
```

### b5 - wrapWithSystemReminderTags

**Location:** chunks.173.mjs:2496-2510

```javascript
// ============================================
// wrapWithSystemReminderTags - Add system-reminder wrapper
// Location: chunks.173.mjs:2496-2510
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        let K = q.isMeta ? {
            cache_control: {
                type: "ephemeral"
            }
        } : void 0;
        return {
            ...q,
            content: [{
                type: "text",
                text: `<system-reminder>
${q.content}
</system-reminder>`,
                ...K
            }]
        }
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((msg) => {
        // Add cache_control for meta messages (short-lived context)
        let cacheControl = msg.isMeta ? {
            cache_control: { type: "ephemeral" }
        } : undefined;

        return {
            ...msg,
            content: [{
                type: "text",
                text: `<system-reminder>
${msg.content}
</system-reminder>`,
                ...cacheControl
            }]
        };
    });
}

// Mapping: b5→wrapWithSystemReminderTags, A→messages, q→msg, K→cacheControl
```

**Why ephemeral cache_control?**
- System reminders are short-lived context
- Should not be cached across turns
- Reduces cache pollution

---

## Output Delta Capture

### readOutputFileDelta

When a task completes, the delta summary is captured:

```javascript
// READABLE (for understanding):
async function captureOutputDelta(taskId, currentOffset) {
    let outputFile = getOutputFilePath(taskId);

    // Read from last known offset
    let { content, newOffset } = await readOutputFileDelta(outputFile, currentOffset);

    // Truncate to reasonable summary length
    let summary = content.slice(0, MAX_DELTA_SUMMARY_LENGTH);

    return {
        deltaSummary: summary,
        newOffset: newOffset
    };
}
```

**Delta Summary Truncation:**
- Max length: ~500 characters
- Includes ellipsis (...) if truncated
- Preserves last complete line

---

## Integration with Notification Queue

### notifyTaskCompletion (vK1)

**Location:** chunks.89.mjs:1346

```javascript
// ============================================
// notifyTaskCompletion - Inject completion notification
// Location: chunks.89.mjs:1346-1370
// ============================================

// READABLE (for understanding):
function notifyTaskCompletion(taskId, setAppState) {
    // Use atomic update to set notified flag
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.notified) return task;  // Already notified

        return {
            ...task,
            notified: true
        };
    });

    // Build notification message
    let notification = {
        type: "task-notification",
        taskId: taskId,
        timestamp: Date.now()
    };

    // Enqueue to command queue
    enqueueCommand({
        mode: "task-notification",
        ...notification
    });
}
```

---

## Message Format Examples

### Completed Task

```xml
<system-reminder>
Task a3f4b2 (type: local_agent) (status: completed) (description: Search for API endpoints)
Delta: Found 15 endpoints in 8 files. Main endpoints: /api/users, /api/auth/login...
You can check its output using the TaskOutput tool.
</system-reminder>
```

### Failed Task

```xml
<system-reminder>
Task b7c4e1 (type: local_bash) (status: failed) (description: Run npm install)
Delta: npm ERR! code EACCES
npm ERR! syscall access /usr/local/lib/node_modules
npm ERR! Error: EACCES: permission denied...
You can check its output using the TaskOutput tool.
</system-reminder>
```

### Killed Task

```xml
<system-reminder>
Task "Find deprecated functions" (a3f4b2) was stopped by the user.
</system-reminder>
```

### Progress Update

```xml
<system-reminder>
Task a3f4b2 (local_agent) progress: Running Grep for "createTaskId" across codebase...
Tool use count: 12 | Tokens: 15,432 | Duration: 45s
</system-reminder>
```

---

## Frequency Control Summary

| Attachment Type | Frequency | Throttle Mechanism |
|-----------------|-----------|-------------------|
| `task_status` (completed) | Once per task | `notified` flag |
| `task_status` (failed) | Once per task | `notified` flag |
| `task_status` (killed) | Once per task | `notified` flag |
| `task_progress` | Every ~3 turns | Turn counting |

---

## Related Documents

- [task_state_machine_complete.md](./task_state_machine_complete.md) - State transitions
- [ui_components_complete.md](./ui_components_complete.md) - UI display
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview