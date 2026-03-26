# System Reminder Integration V6 (Claude Code 2.1.76)

> Complete source-level restoration of subagent integration with the system reminder system, including attachment generation, polling, and notification injection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `Bc6` - Derive tool use context — `chunks.148.mjs:1978`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         Subagent Execution (qh)                              │
│                                                                              │
│  Each turn:                                                                  │
│  └─ llmMessageLoop (Yh)                                                     │
│     └─ For each message:                                                    │
│        └─ nl4 (updateTaskProgressWithTelemetry)                             │
│           • Update progress.summary                                          │
│           • Send telemetry event                                             │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Parent Session (before each LLM turn)                     │
│                                                                              │
│  assembleAllAttachments (_uY)                                               │
│  └─ getUnifiedTasksAttachment (suY)                                         │
│     ├─ pollTaskOutputs (wY4)                                                │
│     │  ├─ For each running task:                                            │
│     │  │  └─ readOutputFileDelta (Z97)                                      │
│     │  └─ For each terminal+notified task:                                  │
│     │     └─ Add to evictedTaskIds                                          │
│     └─ updateTaskState (OY4)                                                │
│        ├─ Update output offsets                                              │
│        └─ Remove evicted tasks                                               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         System Reminder Injection                            │
│                                                                              │
│  Attachment Types:                                                           │
│  ├─ task_status (terminal states, once)                                     │
│  │  • taskId, taskType, status                                               │
│  │  • description, deltaSummary                                              │
│  └─ task_progress (running tasks, throttled)                                │
│     • taskId, taskType                                                       │
│     • message (progress summary)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: getUnifiedTasksAttachment (suY)

**What it does:** Polls all background tasks, builds attachments, and updates state.

**How it works:**

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
        attachments,           // Task status attachments to add
        updatedTaskOffsets,    // Tasks with new output (offset changed)
        evictedTaskIds        // Tasks to remove (terminal + notified)
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);  // OY4

    // Step 4: Map attachments to LLM-friendly format
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

**Why this approach:**
- **Single poll operation**: Reads all task outputs in one pass
- **State update side effect**: Updates offsets and evictions atomically
- **Attachment transformation**: Converts internal format to LLM-friendly format

---

## Core Function: pollTaskOutputs (wY4)

**What it does:** Reads output deltas for all running tasks and identifies tasks to evict.

**How it works:**

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll output files for all running tasks
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
    let attachments = [];              // Status attachments (currently unused here)
    let updatedTaskOffsets = {};       // Tasks with new output
    let evictedTaskIds = [];           // Tasks to remove from state
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // PHASE 1: Check for eviction candidates
        // A task is evictable if: notified AND terminal status
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Terminal + notified → evict
                    evictedTaskIds.push(task.id);
                    continue;  // Skip to next task
                case "pending":
                    // Pending tasks are not processed
                    continue;
                case "running":
                    // Running tasks continue to output reading
                    break;
            }
        }

        // PHASE 2: Read output delta for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97

            // Only record if there's new content
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
- **Single pass**: Processes all tasks in one iteration
- **Eviction detection**: Identifies tasks ready for removal
- **Incremental reading**: Only reads new output since last offset

---

## Core Function: updateTaskState (OY4)

**What it does:** Applies polling results to state atomically.

**How it works:**

```javascript
// ============================================
// OY4 - updateTaskState - Apply polling results to state
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
        let tasks = { ...state.tasks };  // Shallow copy

        // PHASE 1: Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = tasks[taskId];
            // Double-check task is still running (could have changed during poll)
            if (task?.status === "running") {
                tasks[taskId] = {
                    ...task,
                    outputOffset: updatedTaskOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // PHASE 2: Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (tasks[taskId]) {
                delete tasks[taskId];
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        return hasChanges
            ? { ...state, tasks: tasks }
            : state;  // Same reference = no re-render
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds,
//          Y→offsetTaskIds, z→state, _→hasChanges, w→tasks, O→taskId, $→task
```

**Why this approach:**
- **Reference equality optimization**: Returns same state if no changes
- **Double-check status**: Verifies task is still running before updating offset
- **Atomic updates**: All changes applied in single state update

---

## Attachment Types

### task_status

**When injected:** When a task reaches terminal state (completed, failed, killed).

**Structure:**
```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;        // Unique task ID (e.g., "ab3k7m9p2")
    taskType: string;      // "local_agent", "local_bash", etc.
    status: string;        // "completed" | "failed" | "killed"
    description: string;   // Human-readable description
    deltaSummary?: string; // Summary of what was accomplished
}
```

**Example:**
```xml
<task_status>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <status>completed</status>
    <description>Search codebase for createTaskId usages</description>
    <delta_summary>Found 15 files with createTaskId references, including core ID generation in chunks.41.mjs</delta_summary>
</task_status>
```

### task_progress

**When injected:** Periodically for running tasks, throttled by turn count.

**Structure:**
```typescript
interface TaskProgressAttachment {
    type: "task_progress";
    taskId: string;        // Unique task ID
    taskType: string;      // "local_agent", "local_bash", etc.
    message: string;       // Current progress summary
}
```

**Example:**
```xml
<task_progress>
    <task_id>ab3k7m9p2</task_id>
    <task_type>local_agent</task_type>
    <message>Running Grep for "createTaskId" in 5 files...</message>
</task_progress>
```

---

## Throttle Mechanism

### Progress Throttling

**Why throttle?**
- Progress attachments can clutter LLM context
- Frequent updates don't provide additional value
- Throttling reduces token usage

**How it works:**

```javascript
// ============================================
// Progress throttle logic (conceptual)
// ============================================

const PROGRESS_THROTTLE_TURNS = 3;

function shouldSendProgress(taskId, messages) {
    // New tasks always get progress (turnsSinceProgress = Infinity)
    if (isNewTask(taskId)) return true;

    // Count turns since last progress attachment
    let turnsSinceProgress = countTurnsSinceLastProgress(messages);

    return turnsSinceProgress >= PROGRESS_THROTTLE_TURNS;
}

function countTurnsSinceLastProgress(messages) {
    let count = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type === "attachment" &&
            messages[i].attachment?.type === "task_progress") {
            break;  // Found last progress
        }

        if (messages[i].type === "assistant") {
            count++;
        }
    }

    return count;
}
```

### Status Notification (Not Throttled)

**task_status attachments are always sent:**
- Terminal states (completed, failed, killed) are important
- Only sent once per task
- Must be delivered to ensure user awareness

---

## Integration with Derive Tool Use Context

### Context Isolation for Subagents

```javascript
// ============================================
// Bc6 - deriveToolUseContext - Subagent context derivation
// Location: chunks.148.mjs:1978-2024
// ============================================

// The key parts affecting system reminders:

function deriveToolUseContext(parentContext, overrides) {
    return {
        // Cloned state (isolated)
        readFileState: cloneReadFileState(overrides?.readFileState ?? parentContext.readFileState),

        // Nested memory triggers (new set for each subagent)
        nestedMemoryAttachmentTriggers: new Set(),
        dynamicSkillDirTriggers: new Set(),

        // State access
        getAppState: overrides?.getAppState ?? (() => {
            // By default, subagents avoid permission prompts
            let state = parentContext.getAppState();
            return {
                ...state,
                toolPermissionContext: {
                    ...state.toolPermissionContext,
                    shouldAvoidPermissionPrompts: true
                }
            };
        }),

        // State mutation
        setAppState: overrides?.shareSetAppState
            ? parentContext.setAppState
            : () => {},  // No-op if not shared

        // Query tracking for nested agents
        queryTracking: {
            chainId: generateChainId(),
            depth: (parentContext.queryTracking?.depth ?? -1) + 1
        }
    };
}
```

**Why this matters for system reminders:**
- **Nested triggers**: Each subagent gets its own attachment trigger sets
- **Isolated state**: readFileState is cloned, preventing contamination
- **Depth tracking**: Enables visualization of agent nesting

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent Execution (qh)
        │
        ├── each turn ────────────────────────────────┐
        │                                              ▼
        │                               nl4 (updateTaskProgressWithTelemetry)
        │                               • Update task.progress.summary
        │                               • Send telemetry event
        │                                              │
        └── on completion ────────────────────────────┤
                                                       ▼
                               $m8 (markTaskCompleted) / Hm8 (markTaskFailed)
                               • Set status: "completed" / "failed"
                               • Set endTime
                               • Trigger notification

Parent Session (before each LLM turn)
        │
        ▼
getUnifiedTasksAttachment (suY)
        │
        ├── pollTaskOutputs (wY4) ────────────────────┐
        │                                              │
        │   For running tasks:                         │
        │   └─ readOutputFileDelta (Z97)              │
        │       → updatedTaskOffsets                  │
        │                                              │
        │   For terminal + notified tasks:             │
        │   └─ evictedTaskIds                         │
        │                                              │
        └── updateTaskState (OY4) ────────────────────┘
            • Update outputOffset for running
            • Remove evicted tasks

Result: task_status / task_progress attachments
        │
        ▼
Injected into LLM context as system reminder
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `Bc6` | deriveToolUseContext | chunks.148.mjs:1978 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v4.md](./ui_interaction_complete_v4.md) - UI interaction
- [key_algorithms_deep_dive_v4.md](./key_algorithms_deep_dive_v4.md) - Algorithm analysis
- [cross_feature_linkages_complete_v4.md](./cross_feature_linkages_complete_v4.md) - Feature integrations
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - Attachment producers