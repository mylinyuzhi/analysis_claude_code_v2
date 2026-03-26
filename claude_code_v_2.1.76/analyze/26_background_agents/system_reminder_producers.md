# Background Agents System Reminder Producers (Claude Code 2.1.76)

> Detailed documentation of how background task state is communicated to the LLM through system reminders.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` (getTaskStatusAttachments) - Main attachment producer — chunks.147.mjs:1033
- `wY4` (pollTaskOutputs) - Poll task outputs for attachments — chunks.90.mjs:3058
- `OY4` (updateTaskOffsets) - Update task state after polling — chunks.90.mjs:3087
- `Nqq` (getUnretrievedTaskStatuses) - Get unnotified completed local_agent tasks — chunks.147.mjs:1923
- `f4` (wrapAttachment) - Wrap attachment with metadata — chunks.147.mjs:942

> **Note:** `TIY` is actually `getUniqueOutgoingFileCount` (call graph utility), not a progress throttle function.

---

## Overview

Background agents communicate their state to the LLM through **system reminder attachments**. These are special messages injected into the conversation context that inform the LLM about:

1. **Task status** - Completion, failure, or kill events
2. **Task progress** - Ongoing activity updates
3. **Output summaries** - Incremental output from running tasks

### Why System Reminders?

- **Non-blocking**: LLM can see task status without waiting
- **Context-efficient**: Only includes new information (delta)
- **Throttled**: Progress updates limited to avoid noise

---

## Attachment Production Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LLM Message Preparation                                   │
│  (Before each API call)                                                      │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    assembleAllAttachments()                                  │
│                                                                              │
│  Orchestrates all attachment producers in priority order:                   │
│  1. Plan mode attachments                                                   │
│  2. Auto mode attachments                                                   │
│  3. Token usage attachments                                                 │
│  4. Budget attachments                                                      │
│  5. Team context attachments                                                │
│  6. TASK ATTACHMENTS ← Background agents                                    │
│  7. Memory attachments                                                      │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    getUnifiedTasksAttachment()                               │
│                                                                              │
│  1. Get all tasks from appState.tasks                                       │
│  2. Filter by relevance (running/completed/failed/killed)                   │
│  3. Apply frequency throttle for progress                                   │
│  4. Build attachment objects                                                │
│  5. Update output offsets for delta tracking                                │
│  6. Return array of attachments                                             │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│ task_status Attachment  │    │ task_progress Attachment│
│                         │    │                         │
│ • Terminal states only  │    │ • Running tasks only    │
│ • Includes output delta │    │ • Throttled (3 turns)   │
│ • Marks as notified     │    │ • Brief status message  │
└─────────────────────────┘    └─────────────────────────┘
```

---

## Nqq - Unnotified Completed Tasks

**Location:** chunks.147.mjs:1923-1932

### What it does

Returns attachments for all completed local_agent tasks that haven't been notified yet. This ensures the LLM sees task results even if they completed between turns.

### How it works

```javascript
// ============================================
// Nqq - Get unnotified completed local_agent tasks
// Location: chunks.147.mjs:1923-1932
// ============================================

// ORIGINAL (for source lookup):
async function Nqq(A) {
    let q = A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed") return [f4({
            type: "task_status",
            taskId: Y.id,
            taskType: Y.type,
            status: z,
            description: Y.description,
            deltaSummary: Y.result ?? void 0
        })];
        return []
    });
}

// READABLE (for understanding):
async function getUnnotifiedCompletedTasks(toolUseContext) {
    let appState = toolUseContext.getAppState();

    return Object.values(appState.tasks)
        .filter((task) => task.type === "local_agent")
        .flatMap((task) => {
            // Skip already retrieved tasks
            if (task.retrieved) return [];

            let { status } = task;

            // Only include terminal states
            if (status === "completed" || status === "failed" || status === "killed") {
                return [createAttachment({
                    type: "task_status",
                    taskId: task.id,
                    taskType: task.type,
                    status: status,
                    description: task.description,
                    deltaSummary: task.result ?? undefined
                })];
            }

            return [];
        });
}

// Mapping: Nqq→getUnnotifiedCompletedTasks, A→toolUseContext, Y→task, z→status, f4→createAttachment
```

### Key Insight: `retrieved` Flag

The `retrieved` flag prevents duplicate notifications:
- Set to `true` when `TaskOutput` tool reads the task
- Prevents same completion from appearing multiple times
- Cleared when task is re-queued

---

## Task Status Attachment Structure

### Attachment Type: `task_status`

Generated when a task reaches a terminal state.

```xml
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Find API usages in codebase</description>
  <delta_summary>
    Found 15 occurrences in 8 files:
    - src/api.ts: createTaskId used 5 times
    - src/utils.ts: createTaskId imported and called 3 times
    - ...
  </delta_summary>
</task_status>
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Unique task identifier |
| `task_type` | string | `local_agent`, `local_bash`, etc. |
| `status` | string | `completed`, `failed`, or `killed` |
| `description` | string | Task description from tool call |
| `delta_summary` | string | Output since last notification (optional) |

### Delta Summary

The `delta_summary` contains only new output since the last notification:
- Uses `outputOffset` to track read position
- Calls `readOutputFileDelta()` to get new content
- Truncates if too long

---

## Task Progress Attachment Structure

### Attachment Type: `task_progress`

Generated while a task is running (throttled).

```xml
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId"...</message>
</task_progress>
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Unique task identifier |
| `task_type` | string | Task type |
| `message` | string | Brief progress message |

---

## Progress Throttling

### Why Throttle?

Without throttling, every LLM turn would include progress for all running tasks, creating noise and using context budget.

### Throttle Mechanism

Progress attachments are only generated if **≥3 assistant turns** have passed since the last progress for that task.

### countTurnsSinceLastProgress Algorithm

```javascript
// ============================================
// countTurnsSinceLastProgress - Turn counting for throttle
// Location: chunks.142.mjs (derived from implementation)
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(messages) {
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

    // New tasks (not found) get Infinity, ensuring first progress always shows
    return turnsSinceProgress;
}

// How to use:
// if (turnsSinceProgress.get(taskId) >= 3) {
//     // Generate progress attachment
// }
```

### Why Backwards Iteration?

1. **Efficiency**: Stop after finding last progress (don't scan entire history)
2. **Accuracy**: Get exact turn count since last update
3. **Default**: Missing tasks get `Infinity`, ensuring first progress shows

---

## Attachment Injection Flow

### When Attachments Are Added

```javascript
// Pseudocode of injection flow
async function prepareMessagesForLLM(messages, toolUseContext) {
    // 1. Get all attachments
    let attachments = await assembleAllAttachments(toolUseContext);

    // 2. Convert to user messages
    let attachmentMessages = attachments.map((att) => ({
        type: "user",
        message: {
            content: [normalizeAttachment(att)],
            isMeta: true  // Hidden from UI
        }
    }));

    // 3. Inject before current turn
    return [...messages, ...attachmentMessages];
}
```

### Attachment Normalization

```javascript
// ============================================
// normalizeAttachmentForAPI - Convert to API format
// Location: chunks.174.mjs:3
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    let q = [];
    for (let K of A.content)
        if (K.type === "text") q.push({
            type: "text",
            text: K.text
        });
    // ... handle other content types

    return {
        type: "user",
        content: q,
        isMeta: true
    };
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    let content = [];

    for (let block of attachment.content) {
        if (block.type === "text") {
            content.push({
                type: "text",
                text: block.text
            });
        }
        // Handle other content types...
    }

    return {
        type: "user",
        content: content,
        isMeta: true  // Mark as meta (hidden from UI)
    };
}
```

---

## System Reminder Tag Wrapping

Attachments are wrapped in `<system-reminder>` tags to distinguish them from user messages:

```xml
<system-reminder>
<task_status>
  <task_id>a3f4b2</task_id>
  ...
</task_status>
</system-reminder>
```

### Wrap Function

```javascript
// ============================================
// b5 - Wrap content with system-reminder tags
// Location: chunks.173.mjs:2496
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return `<system-reminder>\n${A}\n</system-reminder>`
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(content) {
    return `<system-reminder>\n${content}\n</system-reminder>`;
}
```

---

## Integration Points

### With 04_system_reminder

Background task attachments are produced by the system reminder infrastructure:
- Called during `assembleAllAttachments()`
- Uses same normalization pipeline
- Wrapped with same tags

### With 08_subagent

Subagent completion triggers attachment production:
- `agentLoopRunner` completion → task status update
- Status change detected → attachment generated

### With 13_task_system

Task system tools use the same attachment mechanism:
- `TaskOutput` retrieves results
- Results formatted as attachments
- Marked as `retrieved: true` to prevent duplicates

---

## Notification vs Attachment

| Aspect | Notification | Attachment |
|--------|-------------|------------|
| Audience | User (UI) | LLM (context) |
| Display | Status line/banner | Hidden message |
| Purpose | Alert user | Inform LLM |
| Timing | Immediate | Before API call |

### Both Are Triggered Together

When a task completes:
1. **Notification** added to UI notification queue
2. **Attachment** added to message context

```javascript
// Example: Both notification and attachment on completion
function onTaskComplete(taskId, setAppState, addNotification) {
    // 1. Update task state
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        status: "completed",
        endTime: Date.now()
    }));

    // 2. Add UI notification
    addNotification({
        value: `Background agent "${task.description}" completed.`,
        mode: "task-notification"
    });

    // 3. Attachment is generated automatically in next turn
    // by getUnnotifiedCompletedTasks()
}
```

---

## Debugging Attachment Production

### Check Attachment Generation

```javascript
// Log attachments before LLM call
let attachments = await assembleAllAttachments(toolUseContext);
console.log("Generated attachments:", attachments.map(a => a.type));
```

### Check Task State

```javascript
// Inspect task state
let tasks = toolUseContext.getAppState().tasks;
for (let [id, task] of Object.entries(tasks)) {
    console.log(`Task ${id}:`, {
        type: task.type,
        status: task.status,
        retrieved: task.retrieved,
        notified: task.notified
    });
}
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Missing attachment | Task already `retrieved` | Check TaskOutput usage |
| Duplicate attachments | `notified` not set | Verify `atomicUpdateTask` |
| No progress updates | Throttle not satisfied | Wait 3 turns |

---

## Related Documents

- [implementation.md](./implementation.md) - Core implementation
- [output_capture.md](./output_capture.md) - Output file management
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview
- [../04_system_reminder/integration_flow.md](../04_system_reminder/integration_flow.md) - Integration details