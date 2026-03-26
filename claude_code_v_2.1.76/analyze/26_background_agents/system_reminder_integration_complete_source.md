# System Reminder Integration Complete Source (Claude Code 2.1.76)

> Complete source-level restoration of the integration between subagent/background agents and the system reminder system, including attachment generation, polling, notification injection, and cross-feature coordination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`
- `TIY` - Count unique URIs — `chunks.144.mjs:832`
- `vIY` - Count unique source URIs — `chunks.144.mjs:837`

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

**What it does:** Polls all background tasks, builds attachments, and updates state atomically.

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

    // Step 2: Poll all task outputs atomically
    let {
        attachments,           // Task status attachments to add
        updatedTaskOffsets,    // Tasks with new output (offset changed)
        evictedTaskIds        // Tasks to remove (terminal + notified)
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Update task state (offsets and evictions) as side effect
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
- **Efficiency**: Only polls when needed (before LLM turn)

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
                    // Terminal + notified → evict from state
                    evictedTaskIds.push(task.id);
                    continue;  // Skip to next task

                case "pending":
                    // Pending tasks are not processed
                    continue;

                case "running":
                    // Running but notified (edge case) - continue processing
                    break;
            }
        }

        // PHASE 2: Read output for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97

            // If new content, record updated offset
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
//          Y→evictedTaskIds, z→tasks, _→task, w→result, Z97→readOutputFileDelta
```

**Eviction Logic Deep Dive:**

**Why this eviction strategy:**
- **Terminal + notified**: Task has finished AND user has been notified
- **Not just terminal**: Prevents eviction before user sees result
- **Not just notified**: Prevents eviction of running tasks with pending work
- **Clean state**: Removes completed tasks to prevent memory growth

**State transitions leading to eviction:**
```
running → completed/failed/killed (via $m8/Hm8/x66)
        → notified: true (via d4q)
        → evicted (via VR)
```

---

## Core Function: updateTaskState (OY4)

**What it does:** Updates task offsets and removes evicted tasks from state.

**How it works:**

```javascript
// ============================================
// OY4 - updateTaskState - Update task offsets and evict tasks
// Location: chunks.90.mjs:3087-3110
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
            // ... continuation
        }
        // ... eviction logic
    })
}

// READABLE (for understanding):
function updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds) {
    let offsetTaskIds = Object.keys(updatedTaskOffsets);

    // Skip if nothing to update
    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let hasChanges = false;
        let newTasks = { ...state.tasks };

        // PHASE 1: Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = newTasks[taskId];
            if (task?.status === "running") {
                newTasks[taskId] = {
                    ...task,
                    outputOffset: updatedTaskOffsets[taskId]
                };
                hasChanges = true;
            }
        }

        // PHASE 2: Remove evicted tasks
        for (let taskId of evictedTaskIds) {
            if (newTasks[taskId]) {
                let { [taskId]: removed, ...remaining } = newTasks;
                newTasks = remaining;
                hasChanges = true;
            }
        }

        // Only return new state if changes were made
        if (!hasChanges) return state;

        return {
            ...state,
            tasks: newTasks
        };
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets, K→evictedTaskIds,
//          Y→offsetTaskIds, z→state, _→hasChanges, w→newTasks, O→taskId, $→task
```

**Why batch updates:**
- **Single state update**: All changes in one render cycle
- **Conditional return**: No re-render if no changes
- **Efficient eviction**: Bulk removal of completed tasks

---

## URI Tracking Functions (CORRECTION)

### TIY - countUniqueUris (NOT countTurnsSinceLastProgress)

**CRITICAL CORRECTION**: TIY is NOT a progress throttling function. It counts unique URIs.

```javascript
// ============================================
// TIY - countUniqueUris - Count unique URIs from objects
// Location: chunks.144.mjs:832-835
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueUris(items) {
    // Extract URI from each item, filter out null/undefined
    let uris = items.map((item) => item.uri).filter((uri) => uri);

    // Return count of unique URIs
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, K→item/uri, q→uris
```

**What it's actually used for:**
- Counting unique source files referenced
- Tracking file coverage in edits
- LSP operation statistics

### vIY - countUniqueSourceUris

```javascript
// ============================================
// vIY - countUniqueSourceUris - Count unique source URIs
// Location: chunks.144.mjs:837-840
// ============================================

// ORIGINAL (for source lookup):
function vIY(A) {
    let q = A.map((K) => K.from?.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueSourceUris(items) {
    // Extract source URI (from.uri) from each item
    let uris = items.map((item) => item.from?.uri).filter((uri) => uri);

    return new Set(uris).size;
}

// Mapping: vIY→countUniqueSourceUris, A→items, K→item
```

### NIY - countUniqueTargetUris

```javascript
// ============================================
// NIY - countUniqueTargetUris - Count unique target URIs
// Location: chunks.144.mjs:842-845
// ============================================

// ORIGINAL (for source lookup):
function NIY(A) {
    let q = A.map((K) => K.to?.uri).filter((K) => K);
    return new Set(q).size
}

// READABLE (for understanding):
function countUniqueTargetUris(items) {
    // Extract target URI (to.uri) from each item
    let uris = items.map((item) => item.to?.uri).filter((uri) => uri);

    return new Set(uris).size;
}

// Mapping: NIY→countUniqueTargetUris, A→items, K→item
```

---

## Progress Update Flow

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress and sends telemetry event.

**How it works:**

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
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

    // Step 1: Update task progress atomically
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
                summary: summary  // New summary from caller
            }
        };
    });

    // Step 2: Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {  // Nn
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressData;

        sendTelemetry({  // c36
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          Y→progressData, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

**Progress Throttling Clarification:**

**IMPORTANT**: There is NO separate progress throttling function. The throttling is implicit:

1. **Agent loop calls nl4 when it wants to update progress**
2. **The agent loop controls update frequency** based on turn count or time
3. **No throttle logic in nl4 itself**

The `TIY` function was incorrectly documented as `countTurnsSinceLastProgress`. It is actually `countUniqueUris` for file tracking.

---

## Attachment Types

### task_status Attachment

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: "local_agent" | "local_bash" | "in_process_teammate" | "remote_agent";
    status: "pending" | "running" | "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;
}
```

### task_progress Telemetry Event

```typescript
interface TaskProgressTelemetry {
    type: "system";
    subtype: "task_progress";
    task_id: string;
    tool_use_id: string;
    description: string;
    usage: {
        total_tokens: number;
        tool_uses: number;
        duration_ms: number;
    };
    summary: string;
}
```

---

## Integration with Other Modules

### Integration with 04_system_reminder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              System Reminder Attachment Producers                            │
└─────────────────────────────────────────────────────────────────────────────┘

Before each LLM turn, assembleAllAttachments calls:

1. getUnifiedTasksAttachment (suY)
   └─ task_status attachments for all background tasks

2. getTaskReminderAttachment
   └─ task_reminder attachments for pending tasks

3. getAsyncHookResponseAttachments
   └─ async_hook_response for completed hooks

4. getTeamContextAttachment
   └─ team_context for teammate agents

5. getTokenUsageAttachment
   └─ token_usage for budget tracking
```

### Integration with 05_tools

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Tool Integration Points                                  │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool (QW6)
├─ run_in_background parameter triggers background execution
├─ Creates task via Qn4 (background) or Un4 (foreground)
└─ Returns { status: "async_launched", agentId, outputFile }

TaskOutputTool (kW6)
├─ Polls background task output
├─ Uses Z97 (readOutputFileDelta) for incremental reads
└─ Returns { output, status, ... }

TaskStopTool (vW6)
├─ Kills running background task
├─ Uses x66 (triggerAbortSignal)
└─ Returns confirmation
```

### Integration with 30_agent_teams

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Teammate Integration                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Teammate Communication:
├─ Mailbox system (wl, x3, Vc6)
│  └─ File-based message queues
├─ Poll loop (DNY)
│  └─ Priority-based message handling
└─ In-process runner (XNY)
   └─ AsyncLocalStorage identity

Team Context Attachment:
├─ team_name, agent_id
├─ team_config_path, task_list_path
└─ Injected as system reminder
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | ✓ Corrected |
| `vIY` | countUniqueSourceUris | chunks.144.mjs:837 | ✓ Verified |
| `NIY` | countUniqueTargetUris | chunks.144.mjs:842 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |

---

## Related Documents

- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task reminder types
- [../08_subagent/system_reminder_integration_v6.md](../08_subagent/system_reminder_integration_v6.md) - Subagent integration
- [task_lifecycle_complete_v4.md](./task_lifecycle_complete_v4.md) - Task lifecycle
- [progress_tracking_complete_v2.md](./progress_tracking_complete_v2.md) - Progress tracking
- [cross_feature_linkages_complete_v3.md](./cross_feature_linkages_complete_v3.md) - Feature integrations