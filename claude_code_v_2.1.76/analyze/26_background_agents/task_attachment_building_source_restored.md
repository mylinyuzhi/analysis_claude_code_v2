# Task Attachment Building - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of how task status attachments are built and injected into the conversation context.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getTaskStatusAttachments` (suY) — `chunks.147.mjs:1033`
- `getUnretrievedTaskStatuses` (Nqq) — `chunks.147.mjs:1923`
- `pollTaskOutputs` (wY4) — `chunks.90.mjs:3058`
- `wrapAttachment` (f4) — `chunks.147.mjs:942`
- `updateTaskOffsets` (OY4) — `chunks.90.mjs:3087`

---

## Overview

Task attachments are the mechanism by which background agent status is communicated to the LLM. When a background agent completes, fails, or is killed, a `task_status` attachment is generated and injected into the conversation as a system reminder.

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop Iteration                                       │
│  (every LLM turn, before processing)                                         │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              getTaskStatusAttachments (suY)                                  │
│                                                                              │
│  1. Get appState.tasks                                                      │
│  2. Call pollTaskOutputs (wY4)                                              │
│     • Read output file deltas                                               │
│     • Check task states                                                     │
│  3. Update outputOffset for each task via OY4                               │
│  4. Return attachments array                                                │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Attachment Injection                                       │
│                                                                              │
│  { type: "attachment", attachment: { type: "task_status", ... } }           │
│                                                                              │
│  Injected into conversation context as system-reminder message              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## wrapAttachment (f4)

### What it does

Wraps an attachment object with metadata (uuid, timestamp) for tracking.

### Source Code

```javascript
// ============================================
// f4 - wrapAttachment - Wrap attachment with metadata
// Location: chunks.147.mjs:942-949
// ============================================

// ORIGINAL (for source lookup):
function f4(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: KuY(),
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function wrapAttachment(attachment) {
    return {
        attachment: attachment,
        type: "attachment",
        uuid: generateUuid(),
        timestamp: new Date().toISOString()
    };
}

// Mapping: f4→wrapAttachment, A→attachment, KuY→generateUuid
```

### Why UUID and Timestamp?

| Field | Purpose |
|-------|---------|
| `uuid` | Unique identifier for deduplication and tracking |
| `timestamp` | When attachment was created, for debugging and ordering |
| `type: "attachment"` | Distinguishes from other message types in the stream |

---

## pollTaskOutputs (wY4)

### What it does

Polls all tasks and returns updated output offsets and task IDs to evict from state.

### Source Code

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll task outputs and update offsets
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
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];

    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Check if task should be evicted (already notified terminal state)
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

        // For running tasks, check for new output
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
// Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

### Key Insight

The function returns **three things**:
1. `attachments` - New attachments to inject (empty in this base function)
2. `updatedTaskOffsets` - New file read positions for running tasks
3. `evictedTaskIds` - Task IDs to remove from state (already notified terminal)

The `attachments` array is empty because this is the base implementation. Subclasses or wrapper functions add attachments based on the poll results.

---

## updateTaskOffsets (OY4)

### What it does

Updates task output offsets and removes evicted tasks from state.

### Source Code

```javascript
// ============================================
// OY4 - updateTaskOffsets - Update task offsets in state
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
function updateTaskOffsets(setAppState, updatedOffsets, evictedTaskIds) {
    let offsetKeys = Object.keys(updatedOffsets);

    // Early exit if nothing to update
    if (offsetKeys.length === 0 && evictedTaskIds.length === 0) return;

    setAppState((state) => {
        let hasChanges = false;
        let newTasks = { ...state.tasks };

        // Update offsets for running tasks
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
        for (let taskId of evictedTaskIds) {
            if (newTasks[taskId]) {
                delete newTasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        return hasChanges
            ? { ...state, tasks: newTasks }
            : state;
    });
}

// Mapping: OY4→updateTaskOffsets, A→setAppState, q→updatedOffsets, K→evictedTaskIds,
// Y→offsetKeys, z→state, _→hasChanges, w→newTasks
```

### Why Conditional State Update?

The `hasChanges` flag prevents unnecessary re-renders when:
- No offsets changed (running tasks didn't produce output)
- No tasks to evict

This optimization is critical for UI performance when polling frequently.

---

## getTaskStatusAttachments (suY)

### What it does

Main entry point for generating task status attachments. Called before each LLM turn.

### Source Code

```javascript
// ============================================
// suY - getTaskStatusAttachments - Main attachment producer
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
async function getTaskStatusAttachments(toolUseContext) {
    let appState = toolUseContext.getAppState();

    // Poll all tasks
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Update state with new offsets and remove evicted tasks
    updateTaskOffsets(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Transform internal attachment format to LLM format
    return attachments.map((att) => ({
        type: "task_status",
        taskId: att.taskId,
        taskType: att.taskType,
        status: att.status,
        description: att.description,
        deltaSummary: att.deltaSummary
    }));
}

// Mapping: suY→getTaskStatusAttachments, A→toolUseContext, q→appState,
// K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds, wY4→pollTaskOutputs,
// OY4→updateTaskOffsets
```

### Attachment Output Format

```javascript
{
    type: "task_status",
    taskId: "a3f4b2",
    taskType: "local_agent",
    status: "completed",     // completed | failed | killed
    description: "Search codebase",
    deltaSummary: "Found 15 occurrences in 8 files..."
}
```

---

## getUnretrievedTaskStatuses (Nqq)

### What it does

Gets task status attachments for local_agent tasks that have not been retrieved yet.

### Source Code

```javascript
// ============================================
// Nqq - getUnretrievedTaskStatuses - Get unretrieved task statuses
// Location: chunks.147.mjs:1923-1940
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
            taskId: Y.agentId,
            taskType: "local_agent",
            description: Y.description,
            status: z,
            deltaSummary: Y.error ?? null
        })];
        return []
    })
}

// READABLE (for understanding):
async function getUnretrievedTaskStatuses(toolUseContext) {
    let appState = toolUseContext.getAppState();

    return Object.values(appState.tasks)
        .filter((task) => task.type === "local_agent")
        .flatMap((task) => {
            // Skip already retrieved tasks
            if (task.retrieved) return [];

            let { status } = task;

            // Only generate attachment for terminal states
            if (status === "completed" ||
                status === "failed" ||
                status === "killed") {
                return [wrapAttachment({
                    type: "task_status",
                    taskId: task.agentId,
                    taskType: "local_agent",
                    description: task.description,
                    status: status,
                    deltaSummary: task.error ?? null
                })];
            }

            return [];
        });
}

// Mapping: Nqq→getUnretrievedTaskStatuses, A→toolUseContext, q→appState,
// Y→task, z→status, f4→wrapAttachment
```

### Key Difference from suY

| Function | Purpose | Filter |
|----------|---------|--------|
| `suY` | General polling | All tasks, uses pollTaskOutputs |
| `Nqq` | Specific retrieval | Only `local_agent` with `retrieved: false` |

The `Nqq` function is used when the caller needs to know about tasks that have completed but haven't been explicitly retrieved yet (e.g., for the TaskOutput tool).

---

## Task Status Rendering

### How LLM Sees Task Status

**Location:** chunks.174.mjs:330-342

```javascript
// ============================================
// Task Status Rendering - Convert attachment to LLM message
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
case "task_status": {
    // Map "killed" to "stopped" for better LLM understanding
    let displayStatus = attachment.status === "killed" ? "stopped" : attachment.status;

    // Special handling for killed tasks - simple message
    if (attachment.status === "killed") {
        return [createUserMessage({
            content: wrapWithSystemReminderTags(
                `Task "${attachment.description}" (${attachment.taskId}) was stopped by the user.`
            ),
            isMeta: true
        })];
    }

    // Build detailed status message
    let parts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${displayStatus})`,
        `(description: ${attachment.description})`
    ];

    // Include delta summary if present
    if (attachment.deltaSummary) {
        parts.push(`Delta: ${attachment.deltaSummary}`);
    }

    // Add hint about checking output
    parts.push("You can check its output using the TaskOutput tool.");

    return [createUserMessage({
        content: wrapWithSystemReminderTags(parts.join(" ")),
        isMeta: true
    })];
}

// Mapping: K→displayStatus, Y→parts, A→attachment, p1→createUserMessage,
// af→wrapWithSystemReminderTags
```

### Output Examples

**For completed task:**
```
Task a3f4b2 (type: local_agent) (status: completed) (description: Find API usages) Delta: Found 15 occurrences in 8 files... You can check its output using the TaskOutput tool.
```

**For killed task:**
```
Task "Find API usages" (a3f4b2) was stopped by the user.
```

---

## Integration with Agent Loop

### When Attachments Are Generated

```javascript
// In the main agent loop (pseudo-code)
async function* mainAgentLoop() {
    while (true) {
        // Before each LLM turn, gather task attachments
        let taskAttachments = await getTaskStatusAttachments(toolUseContext);

        // Inject as system reminders
        for (let att of taskAttachments) {
            yield {
                type: "attachment",
                attachment: att
            };
        }

        // Continue with normal turn processing...
    }
}
```

### Throttling

Progress attachments are throttled to prevent flooding:

```javascript
// From chunks.144.mjs:832 - turn counting
function countTurnsSinceLastProgress(messages) {
    // Count assistant turns since last task_progress attachment
    // Only emit new progress if >= 3 turns since last one
}
```

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `suY` | getTaskStatusAttachments | chunks.147.mjs:1033 | ✓ Verified |
| `Nqq` | getUnretrievedTaskStatuses | chunks.147.mjs:1923 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `f4` | wrapAttachment | chunks.147.mjs:942 | ✓ Verified |
| `OY4` | updateTaskOffsets | chunks.90.mjs:3087 | ✓ Verified |

---

## Related Documents

- [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - System reminder integration
- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - Task state machine
- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task management attachment types
- [../08_subagent/system_reminder_integration_complete.md](../08_subagent/system_reminder_integration_complete.md) - Subagent integration