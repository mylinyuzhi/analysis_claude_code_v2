# Background Agents System Reminder Integration V4 (Claude Code 2.1.76)

> Complete source-level restoration of background agent integration with the system reminder system including task attachments, polling, and notification injection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `Z97` - Read output file delta — `chunks.41.mjs:2325`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Execution
        │
        ├── Each turn
        │   └── nl4 (updateTaskProgressWithTelemetry)
        │       • Update progress.summary
        │       • Send telemetry event
        │
        └── On completion
            └── $m8/Hm8 (markTaskCompleted/markTaskFailed)
                • Set terminal status
                • Set endTime

Parent Session (before each LLM turn)
        │
        ▼
getUnifiedTasksAttachment (suY)
        │
        ├── pollTaskOutputs (wY4)
        │   │
        │   ├── For running tasks:
        │   │   └── readOutputFileDelta (Z97)
        │   │       → updatedTaskOffsets
        │   │
        │   └── For terminal + notified:
        │       └── evictedTaskIds
        │
        └── updateTaskState (OY4)
            • Update outputOffset
            • Remove evicted tasks

Result: task_status / task_progress attachments
        │
        ▼
Injected into LLM context
```

---

## Core Function: getUnifiedTasksAttachment (suY)

**What it does:** Orchestrates task polling and attachment generation.

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments
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

    // Step 2: Poll all task outputs
    let {
        attachments,           // Task status attachments
        updatedTaskOffsets,    // Tasks with new output
        evictedTaskIds        // Tasks to remove
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);  // OY4

    // Step 4: Transform to LLM-friendly format
    return attachments.map((attachment) => ({
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

---

## Core Function: pollTaskOutputs (wY4)

**What it does:** Reads output deltas and identifies eviction candidates.

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all task outputs
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
        // Check for eviction: terminal + notified
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;  // Skip to next task

                case "pending":
                    continue;  // Skip pending tasks

                case "running":
                    break;  // Continue processing
            }
        }

        // Read output delta for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97

            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, _→task, w→result, Z97→readOutputFileDelta
```

**Why this approach:**
- **Single pass**: Processes all tasks efficiently
- **Eviction detection**: Identifies tasks ready for removal
- **Incremental reading**: Only reads new output

---

## Core Function: updateTaskState (OY4)

**What it does:** Applies polling results to state atomically.

```javascript
// ============================================
// OY4 - updateTaskState - Apply polling results
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
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetTaskIds = Object.keys(updatedTaskOffsets);

    // Early exit if nothing to update
    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let hasChanges = false;
        let tasks = { ...state.tasks };

        // Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = tasks[taskId];

            // Double-check still running (could have changed during poll)
            if (task?.status === "running") {
                tasks[taskId] = {
                    ...task,
                    outputOffset: updatedTaskOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (tasks[taskId]) {
                delete tasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes made
        return hasChanges
            ? { ...state, tasks: tasks }
            : state;  // Same reference = no re-render
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds,
//          Y→offsetTaskIds, z→state, _→hasChanges, w→tasks, O→taskId, $→task
```

---

## Core Function: readOutputFileDelta (Z97)

**What it does:** Reads incremental output from task's output file.

```javascript
// ============================================
// Z97 - readOutputFileDelta - Read incremental output
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
        let result = await readFileFromOffset(
            getOutputFilePath(taskId),  // g2
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
        // File doesn't exist yet
        if (error.code === "ENOENT") {
            return { content: "", newOffset: currentOffset };
        }

        logError(error);  // _6
        return { content: "", newOffset: currentOffset };
    }
}

// Mapping: Z97→readOutputFileDelta, A→taskId, q→currentOffset, K→options,
//          Y→result/error, dt6→readFileFromOffset, g2→getOutputFilePath,
//          P97→DEFAULT_OPTIONS, _6→logError
```

---

## Attachment Types

### task_status

**When injected:** Task reaches terminal state.

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: string;
    status: "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;
}
```

**Example:**
```xml
<task_status>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <status>completed</status>
    <description>Search codebase for createTaskId</description>
    <delta_summary>Found 15 files with references</delta_summary>
</task_status>
```

### task_progress

**When injected:** Running tasks, throttled by turn count.

```typescript
interface TaskProgressAttachment {
    type: "task_progress";
    taskId: string;
    taskType: string;
    message: string;
}
```

**Example:**
```xml
<task_progress>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <message>Running Grep for "taskId" in 5 files...</message>
</task_progress>
```

---

## Throttle Mechanism

```javascript
const PROGRESS_THROTTLE_TURNS = 3;

// Progress is sent when:
// 1. New task (never sent progress before)
// 2. 3+ assistant turns since last progress

function shouldSendProgress(task, messages) {
    // New tasks always get progress
    if (task.lastProgressTurn === undefined) return true;

    let turnsSince = countTurnsSince(task.lastProgressTurn, messages);
    return turnsSince >= PROGRESS_THROTTLE_TURNS;
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW DIAGRAM                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Execution
        │
        ├── Turn 1: nl4("Running Grep...")
        │   └── task.progress.summary = "Running Grep..."
        │
        ├── Turn 2: nl4("Found 5 files...")
        │   └── task.progress.summary = "Found 5 files..."
        │
        └── Turn 3: $m8(completionResult)
            └── task.status = "completed"

Parent Session (before next LLM turn)
        │
        ▼
suY (getUnifiedTasksAttachment)
        │
        ├── wY4 (pollTaskOutputs)
        │   │
        │   ├── task.status === "running"?
        │   │   └── Z97(task.id, task.outputOffset)
        │   │       → updatedTaskOffsets
        │   │
        │   └── task.notified && terminal?
        │       └── evictedTaskIds.push(task.id)
        │
        └── OY4 (updateTaskState)
            • Update outputOffset
            • Delete evicted tasks

Result:
├── task_progress attachment (if throttle allows)
└── task_status attachment (if terminal)
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v3.md](./ui_interaction_complete_v3.md) - UI interaction
- [key_algorithms_deep_dive_v2.md](./key_algorithms_deep_dive_v2.md) - Algorithm analysis
- [cross_feature_linkages_complete_v2.md](./cross_feature_linkages_complete_v2.md) - Feature integrations
- [../08_subagent/system_reminder_integration_v6.md](../08_subagent/system_reminder_integration_v6.md) - Subagent integration