# System Reminder Integration Complete (Claude Code 2.1.76)

> Complete documentation of system reminder integration with subagent and background agent systems.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `Nqq` - getUnretrievedTaskStatuses — `chunks.147.mjs:1923`
- `Z97` - readOutputFileDelta — `chunks.41.mjs:2325`
- `f4` - wrapAttachment — `chunks.147.mjs:942`

> **Note:** Previous versions incorrectly mapped `vIY`, `di4`, `TIY` to task attachment functions.
> Correct symbols are: `suY` (getUnifiedTasksAttachment), `Nqq`, `wY4`, `f4`. See symbol_index files for details.
> **Correction (v6):** `TIY` is `countUniqueUris` (NOT countTurnsSinceLastProgress). Source proof: `function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }`.
> **Correction (v6):** `vIY` is NOT `getUnifiedTasksAttachment` — the correct symbol for that is `suY`. References to `vIY` as getUnifiedTasksAttachment below are incorrect and should read `suY`.

---

## Integration Overview

System reminders are the primary mechanism for communicating background task state to the LLM. This integration enables:

1. **Progress visibility** - LLM sees running task progress
2. **Completion awareness** - LLM knows when tasks finish
3. **Context enrichment** - Task results available for reasoning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Architecture                   │
└─────────────────────────────────────────────────────────────────────────────┘

Background Task Execution
        │
        ├── Progress Updates ────────────────────────────────┐
        │   updateTaskProgressWithTelemetry (nl4)            │
        │   • Update task.progress.summary                   │
        │   • Send telemetry event                           │
        │                                                    ▼
        │                                          ┌─────────────────┐
        │                                          │ Task State      │
        │                                          │ (in appState)   │
        │                                          └────────┬────────┘
        │                                                   │
        └── Completion ────────────────────────────────────┤
            markTaskCompleted/Failed/Killed                 │
            • Set terminal status                           │
            • Set notified: false                           │
                                                            │
                                                            ▼
                                            ┌───────────────────────────┐
                                            │ Before Each LLM Turn      │
                                            │                           │
                                            │ getTaskStatusAttachments  │
                                            │ (suY)                     │
                                            │   │                       │
                                            │   ├── Running tasks ──────┤
                                            │   │   (throttled)         │
                                            │   │   task_progress       │
                                            │   │                       │
                                            │   └── Terminal tasks ─────┤
                                            │       (not yet notified)  │
                                            │       task_status         │
                                            └───────────────────────────┘
                                                            │
                                                            ▼
                                            ┌───────────────────────────┐
                                            │ LLM Context               │
                                            │                           │
                                            │ <task_progress>           │
                                            │   <task_id>...            │
                                            │   <message>Running...     │
                                            │ </task_progress>          │
                                            │                           │
                                            │ <task_status>             │
                                            │   <status>completed       │
                                            │   <description>...        │
                                            │ </task_status>            │
                                            └───────────────────────────┘
```

---

## Attachment Types

### 1. task_progress Attachment

**Purpose:** Inform LLM about running background tasks.

**Trigger:** Before each LLM turn (throttled).

**Format:**

```xml
<task_progress>
  <task_id>a3f4b2c1</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId" in 15 files...</message>
</task_progress>
```

**Throttle Rules:**
- New tasks: Always sent (turnsSinceProgress = Infinity)
- Existing tasks: Sent every 3+ turns
- Only sent if progress.summary changed

### 2. task_status Attachment

**Purpose:** Notify LLM of task completion/failure/kill.

**Trigger:** Once when task reaches terminal state.

**Format:**

```xml
<task_status>
  <task_id>a3f4b2c1</task_id>
  <status>completed</status>
  <description>Search codebase for usages</description>
  <delta_summary>Found 15 occurrences in 8 files. Key findings: ...</delta_summary>
</task_status>
```

**Delivery Guarantee:**
- `notified: false` initially
- Set to `true` after attachment built
- Ensures exactly-once delivery

---

## Progress Update Flow

### Update Task Progress (nl4)

```javascript
// ============================================
// nl4 - Update task progress with telemetry
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

    // Update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;  // Only update running tasks

        // Capture progress data for telemetry
        progressData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        // Return updated task
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
//          i9→atomicUpdateTask, z→task, Y→progressData, Nn→isTelemetryEnabled,
//          c36→sendTelemetry
```

### Progress Update Triggers

Progress updates are called at key points during agent execution:

```javascript
// In agent loop (qh), after each tool use:
for await (let message of llmLoop) {
    if (message.type === "tool_result") {
        // Update progress with current activity
        let summary = formatToolActivity(message);
        updateTaskProgressWithTelemetry(taskId, summary, setAppState);
    }

    // Update token count
    if (message.usage) {
        atomicUpdateTask(taskId, setAppState, (task) => ({
            ...task,
            progress: {
                ...task.progress,
                tokenCount: (task.progress?.tokenCount ?? 0) + message.usage.total_tokens
            }
        }));
    }
}
```

---

## Attachment Building

### Get Unified Tasks Attachment (suY)

> **Correction (v6):** Previously attributed to `vIY`. The correct symbol is `suY`. See progress_tracking_complete.md for the verified source code of suY.

```javascript
// ============================================
// suY - getUnifiedTasksAttachment
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState();
    let { attachments: K, updatedTaskOffsets: Y, evictedTaskIds: z } = await wY4(q);
    OY4(A.setAppState, Y, z);
    return K.map((w) => ({
        type: "task_status",
        taskId: w.taskId,
        taskType: w.taskType,
        status: w.status,
        description: w.description,
        deltaSummary: w.deltaSummary
    }));
}

// READABLE (for understanding):
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

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState,
//          K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

### Poll Task Outputs (wY4)

**What it does:** Reads incremental output from all task output files, builds attachments for changed tasks, and identifies tasks ready for eviction.

**How it works:**
1. Iterates over all tasks in appState
2. Skips non-local_agent tasks
3. Reads delta content from each task's output file using the stored offset
4. Builds attachments for tasks with new content (truncated to 500 chars)
5. Tracks updated offsets and identifies terminal+notified tasks for eviction

```javascript
// ============================================
// wY4 - pollTaskOutputs
// Location: chunks.90.mjs:3058-3085
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [], K = {}, Y = [];
    for (let [z, _] of Object.entries(A.tasks)) {
        if (_.type !== "local_agent") continue;
        if (!_.status) continue;
        let { content: w, newOffset: O } = await Z97(z, _.outputOffset ?? 0);
        if (w) q.push({
            taskId: z, taskType: _.type, status: _.status,
            description: _.description,
            deltaSummary: w.substring(0, 500),
            fullContent: w
        });
        if (O !== _.outputOffset) K[z] = O;
        if (m5q(_.status) && _.notified) Y.push(z);
    }
    return { attachments: q, updatedTaskOffsets: K, evictedTaskIds: Y };
}

// READABLE (for understanding):
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

    return { attachments, updatedOffsets, evictedTaskIds };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedOffsets,
//          Y→evictedTaskIds, z→taskId, _→task, Z97→readOutputFileDelta,
//          m5q→isTerminalTaskStatus, w→content, O→newOffset
```

**Key insight:** The for loop processes tasks sequentially (not in parallel) to avoid overwhelming file I/O. The delta-based approach means only new output since the last read is captured, keeping context injection efficient.

---

### Update Task State (OY4)

**What it does:** Updates task state with new file read offsets and removes evicted tasks from the state store.

```javascript
// ============================================
// OY4 - updateTaskState
// Location: chunks.90.mjs:3087-3109
// ============================================

// ORIGINAL (for source lookup):
function OY4(A, q, K) {
    A((Y) => {
        let z = { ...Y.tasks };
        for (let [_, w] of Object.entries(q)) {
            if (z[_]) z[_] = { ...z[_], outputOffset: w };
        }
        for (let _ of K) delete z[_];
        return { ...Y, tasks: z };
    });
}

// READABLE (for understanding):
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

        return { ...state, tasks: newTasks };
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedOffsets,
//          K→evictedTaskIds, Y→state, z→newTasks, _→taskId, w→offset
```

---

### Build Task Progress Attachment

```javascript
// READABLE (for understanding):
function buildTaskProgressAttachment(task) {
    const lines = [];

    lines.push("<task_progress>");
    lines.push(`  <task_id>${task.id}</task_id>`);
    lines.push(`  <task_type>${task.type}</task_type>`);

    if (task.progress?.summary) {
        lines.push(`  <message>${escapeXml(task.progress.summary)}</message>`);
    }

    lines.push("</task_progress>");

    return {
        type: "task_progress",
        content: lines.join("\n"),
        task_id: task.id
    };
}
```

### Build Task Status Attachment (di4)

```javascript
// ============================================
// di4 - Build task status attachment
// Location: chunks.147.mjs (inferred)
// ============================================

// READABLE (for understanding):
async function buildTaskStatusAttachment(task) {
    const lines = [];

    lines.push("<task_status>");
    lines.push(`  <task_id>${task.id}</task_id>`);
    lines.push(`  <status>${task.status}</status>`);
    lines.push(`  <description>${escapeXml(task.description)}</description>`);

    // Get summary from last message
    if (task.result?.summary) {
        lines.push(`  <delta_summary>${escapeXml(task.result.summary)}</delta_summary>`);
    } else if (task.error) {
        lines.push(`  <error>${escapeXml(task.error)}</error>`);
    }

    lines.push("</task_status>");

    return {
        type: "task_status",
        content: lines.join("\n"),
        task_id: task.id
    };
}

// Mapping: di4→buildTaskStatusAttachment
```

---

## Throttle Mechanism

### URI Counting (TIY)

> **Correction (v6):** TIY was previously documented here as `countTurnsSinceLastProgress`. Source code proof shows it is actually `countUniqueUris`: `function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }`. The turn-counting throttle logic uses a different (unidentified) function.

```javascript
// ============================================
// TIY - countUniqueUris - Count unique URIs in array
// Location: chunks.144.mjs:832
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) { let q = A.map((K) => K.uri).filter((K) => K); return new Set(q).size }

// READABLE (for understanding):
function countUniqueUris(items) {
    let uris = items.map((item) => item.uri).filter((uri) => uri);
    return new Set(uris).size;
}

// Mapping: TIY→countUniqueUris, A→items, K→item/uri, q→uris
```

### Throttle Decision Matrix

| Condition | Turns Since Progress | Send Attachment? |
|-----------|---------------------|------------------|
| New task | Infinity | ✓ Always |
| Recently reported | < 3 | ✗ Skip |
| Ready to report | ≥ 3 | ✓ Send |
| Progress changed | Any | ✓ Send |

---

## Complete Integration Flow

### End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Flow                          │
└─────────────────────────────────────────────────────────────────────────────┘

1. TASK EXECUTION
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Agent Loop (qh)                                                       │
   │        │                                                              │
   │        ├── Tool Use ─────────────────────────────────────────────┐    │
   │        │   └── nl4(taskId, "Running Grep...", setAppState)       │    │
   │        │       └── Update task.progress.summary                   │    │
   │        │       └── Send telemetry (if enabled)                    │    │
   │        │                                                          │    │
   │        ├── Token Update ─────────────────────────────────────────┤    │
   │        │   └── atomicUpdateTask(taskId, ...)                     │    │
   │        │       └── Update task.progress.tokenCount               │    │
   │        │                                                          │    │
   │        └── Completion ───────────────────────────────────────────┤    │
   │            └── $m8(taskId, setAppState)                          │    │
   │                └── status: "completed"                            │    │
   │                └── notified: false                                │    │
   └───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼

2. ATTACHMENT BUILDING (Before LLM Turn)
   ┌───────────────────────────────────────────────────────────────────────┐
   │ getUnifiedTasksAttachment(suY)                                        │
   │        │                                                              │
   │        ├── Check each task in appState.tasks                         │
   │        │                                                              │
   │        ├── Running tasks:                                            │
   │        │   ├── Throttle check → turns since progress                 │
   │        │   ├── If turns >= 3 OR Infinity:                            │
   │        │   │   └── Build task_progress attachment                    │
   │        │   └── Mark lastReportedTurn                                  │
   │        │                                                              │
   │        └── Terminal tasks (notified: false):                         │
   │            ├── di4(task) → Build task_status attachment              │
   │            └── Set notified: true                                     │
   └───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼

3. LLM CONTEXT INJECTION
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Messages to LLM                                                       │
   │                                                                       │
   │ [                                                                      │
   │   { type: "user", content: "..." },                                   │
   │   { type: "assistant", content: "..." },                              │
   │   ...                                                                  │
   │   {                                                                    │
   │     type: "user",                                                     │
   │     content: [                                                        │
   │       {                                                                │
   │         type: "task_progress",                                        │
   │         content: "<task_progress>...</task_progress>"                 │
   │       },                                                               │
   │       {                                                                │
   │         type: "task_status",                                          │
   │         content: "<task_status>...</task_status>"                     │
   │       }                                                                │
   │     ]                                                                  │
   │   }                                                                    │
   │ ]                                                                      │
   └───────────────────────────────────────────────────────────────────────┘
```

---

## Telemetry Integration

### Telemetry Events

| Event | Trigger | Data |
|-------|---------|------|
| `task_started` | Task created | task_id, task_type, description |
| `task_progress` | Progress update | task_id, usage, summary |
| `task_completed` | Task finished | task_id, duration, tokens |
| `task_failed` | Task failed | task_id, error |
| `task_killed` | Task killed | task_id, partial_results |

### Telemetry Call (c36)

```javascript
// ============================================
// Telemetry event structure
// ============================================

sendTelemetry({
    type: "system",
    subtype: "task_progress",
    task_id: "a3f4b2c1",
    tool_use_id: "toolu_abc123",
    description: "Running Grep for pattern...",
    usage: {
        total_tokens: 15000,
        tool_uses: 5,
        duration_ms: 45000
    },
    summary: "Running Grep for pattern..."
});
```

---

## Delta Reading Strategy

### Why Delta-Based?

| Approach | Token Usage | Freshness |
|----------|-------------|-----------|
| Full file read | High | Current |
| Last N lines | Medium | Recent |
| **Delta read** | **Optimal** | **New only** |

**How it works:**
1. Track offset per task (`outputOffset` in task state)
2. On each read: seek to last offset, read up to maxBytes
3. Return new content + new offset
4. Update offset in state via `OY4` (updateTaskState)
5. Only new content is injected into the LLM context

**Truncation:** Delta summaries are truncated to 500 characters to prevent context bloat. Full content remains available in the output file.

---

## Injection Timing

### When Attachments Are Added

```
User sends message
        │
        ▼
Agent loop starts processing
        │
        ├─── assembleAllAttachments called
        │    │
        │    └─── getUnifiedTasksAttachment (suY)
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

### assembleAllAttachments Integration Point

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

---

## State Lifecycle with Eviction

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

A task is evicted (deleted from `appState.tasks`) when BOTH conditions are met:
1. Status is terminal (`completed`, `failed`, or `killed`) -- checked via `isTerminalTaskStatus()`
2. User has been notified (`notified: true`) -- ensures the LLM saw the final status at least once

**Why this matters:**
- Completed tasks do not pollute state indefinitely
- Results are preserved in the output file on disk
- Memory is cleaned up after the LLM acknowledges the task
- The exactly-once notification guarantee is maintained via the `notified` flag

---

## Cross-Module Integration

### Integration with 04_system_reminder

```
Background Agents                    System Reminders
        │                                   │
        ├── nl4() ──────────────────────────┤
        │   Progress state update           │
        │                                   │
        ├── suY() ──────────────────────────┤
        │   Build attachments               │
        │                                   │
        └── Telemetry ──────────────────────┤
            Usage tracking                  │
```

### Integration with 05_tools

```
Agent Tool Execution                 System Reminders
        │                                   │
        ├── After each tool ────────────────┤
        │   nl4(taskId, summary)            │
        │                                   │
        └── On completion ──────────────────┤
            Build final attachment          │
```

### Integration with 15_state_management

```
Task State                            System Reminders
        │                                   │
        ├── task.progress.summary ──────────┤
        │   Included in attachment          │
        │                                   │
        └── task.notified ──────────────────┤
            Prevents duplicate notifications
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Corrected (v6: was vIY, correct symbol is suY) |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified (v6: full source with for loop) |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified (v6: full source) |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | ✓ Referenced in wY4 |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `di4` | buildTaskStatusAttachment | chunks.147.mjs | ✓ Inferred |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | ✓ Corrected (v6: was countTurnsSinceLastProgress, source proof shows URI counting) |
| `c36` | sendTelemetry | chunks.89.mjs | ✓ Verified |
| `Nn` | isTelemetryEnabled | chunks.89.mjs | ✓ Inferred |
| `m5q` | isTerminalTaskStatus | chunks.90.mjs | ✓ Referenced in wY4 |

---

## Related Documents

- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Key algorithms
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - Attachment producers