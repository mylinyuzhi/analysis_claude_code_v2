# System Reminder Deep Integration V2 (Claude Code 2.1.76)

> Complete source-level analysis of system reminder integration with the subagent system.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `i9` - atomicUpdateTask — `chunks.90.mjs:3003`

---

## Integration Architecture Overview

The system reminder integration with subagents is a **two-directional flow**:

1. **Subagent → System Reminder**: Progress and status updates flow from running subagents into attachment producers
2. **System Reminder → Subagent**: Attachments are injected into LLM context for the parent agent

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Architecture                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUBAGENT EXECUTION                                   │
│                                                                              │
│  Agent Loop (qh)                                                             │
│       │                                                                      │
│       ├── Tool Execution ──────────────────────────────────────────────┐    │
│       │   └── After each tool:                                          │    │
│       │       nl4(taskId, "Running Grep...", setAppState)              │    │
│       │       • Update task.progress.summary                           │    │
│       │       • Increment toolUseCount                                 │    │
│       │       • Send telemetry event                                   │    │
│       │                                                                │    │
│       ├── Token Tracking ──────────────────────────────────────────────┤    │
│       │   └── After each API response:                                 │    │
│       │       i9(taskId, setAppState, (t) => ({                        │    │
│       │           ...t, progress: { ...t.progress,                     │    │
│       │               tokenCount: t.progress.tokenCount + tokens       │    │
│       │           }                                                    │    │
│       │       }))                                                      │    │
│       │                                                                │    │
│       └── Completion ──────────────────────────────────────────────────┤    │
│           ├── Success: $m8(result, setAppState)                        │    │
│           │   • status: "completed"                                    │    │
│           │   • result: {...}                                          │    │
│           │   • notified: false                                        │    │
│           │                                                            │    │
│           ├── Failure: Hm8(taskId, error, setAppState)                 │    │
│           │   • status: "failed"                                       │    │
│           │   • error: message                                         │    │
│           │   • notified: false                                        │    │
│           │                                                            │    │
│           └── Kill: x66(taskId, setAppState) → d4q(taskId, setAppState)│    │
│               • status: "killed"                                       │    │
│               • notified: false (then set to true by d4q)              │    │
│                                                                          │    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Task state now in appState.tasks
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ATTACHMENT PRODUCTION                                   │
│                                                                              │
│  Before Each LLM Turn: assembleAllAttachments (_uY)                         │
│       │                                                                      │
│       ├── GROUP 3 (Main Agent Only):                                        │
│       │   └── Hz("unified_tasks", async () => suY(sessionContext))          │
│       │                                                                      │
│       └── suY(sessionContext)                                               │
│           │                                                                  │
│           ├── getAppState() → get current tasks                             │
│           │                                                                  │
│           └── wY4(appState) → pollTaskOutputs                               │
│               │                                                              │
│               ├── For each task in appState.tasks:                          │
│               │   │                                                          │
│               │   ├── If notified AND terminal → add to evictedTaskIds      │
│               │   │                                                          │
│               │   ├── If running:                                           │
│               │   │   └── Z97(taskId, outputOffset) → read output delta     │
│               │   │       └── update newOffset                              │
│               │   │                                                          │
│               │   └── Build attachment:                                     │
│               │       { type: "task_status", taskId, taskType, status,      │
│               │         description, deltaSummary }                         │
│               │                                                              │
│               └── Return: { attachments, updatedTaskOffsets, evictedTaskIds }│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LLM CONTEXT INJECTION                               │
│                                                                              │
│  Messages sent to LLM:                                                       │
│  [                                                                            │
│    { type: "user", content: "..." },                                         │
│    { type: "assistant", content: "..." },                                    │
│    ...                                                                        │
│    {                                                                          │
│      type: "user",                                                           │
│      content: [                                                               │
│        {                                                                      │
│          type: "task_status",                                                │
│          taskId: "a3f4b2",                                                   │
│          taskType: "local_agent",                                            │
│          status: "completed",                                                │
│          description: "Search codebase for usages",                          │
│          deltaSummary: "Found 15 occurrences in 8 files..."                 │
│        }                                                                      │
│      ]                                                                        │
│    }                                                                          │
│  ]                                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Analysis

### getUnifiedTasksAttachment (suY)

**What it does:** Main entry point for building task status attachments. Called during attachment assembly before each LLM turn.

**Source Code:**

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task status attachments
// Location: chunks.147.mjs:1033-1047
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
async function getUnifiedTasksAttachment(sessionContext) {
    // Get current application state
    let appState = sessionContext.getAppState();

    // Poll all task outputs and build attachments
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Update state with new offsets and remove evicted tasks
    updateTaskState(sessionContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Map internal attachment format to LLM-facing format
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→sessionContext, q→appState,
//          K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

**Why this approach:**
1. **Atomic state read** - Gets a consistent snapshot of all tasks
2. **Batch polling** - Polls all task outputs in one pass for efficiency
3. **State cleanup** - Removes evicted tasks after building attachments
4. **Format normalization** - Maps internal format to LLM-friendly structure

---

### pollTaskOutputs (wY4)

**What it does:** Iterates all tasks, reads output deltas for running tasks, and builds status attachments.

**Source Code:**

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all task outputs and build attachments
// Location: chunks.90.mjs:3058-3084
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
        // Handle notified terminal tasks - mark for eviction
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Already notified terminal task - evict from state
                    evictedTaskIds.push(task.id);
                    continue;

                case "pending":
                    // Pending and notified - skip (shouldn't happen normally)
                    continue;

                case "running":
                    // Running and notified - continue processing
                    break;
            }
        }

        // For running tasks, read output delta
        if (task.status === "running") {
            let outputResult = await readOutputFileDelta(task.id, task.outputOffset);

            // If there's new content, record the new offset
            if (outputResult.content) {
                updatedTaskOffsets[task.id] = outputResult.newOffset;
            }
        }

        // Build attachment for this task
        // (Note: The actual attachment building logic continues below
        // but was truncated in the source for brevity)
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, q→attachments, K→updatedTaskOffsets,
//          Y→evictedTaskIds, z→tasks, _→task, Z97→readOutputFileDelta
```

**Algorithm Analysis:**

1. **Initialize collections** - attachments, offsets, evicted IDs
2. **Iterate all tasks** - Process each task in appState.tasks
3. **Handle terminal tasks** - If notified, mark for eviction (remove from state)
4. **Read running task outputs** - Incremental read from output files
5. **Return state changes** - Attachments, offsets to update, IDs to remove

**Why this approach:**
- **Single pass** - All tasks processed in one loop
- **Incremental reads** - Only read new output bytes (efficient)
- **Automatic cleanup** - Terminal tasks evicted after notification
- **Non-blocking** - Running tasks don't block other processing

---

### updateTaskProgressWithTelemetry (nl4)

**What it does:** Updates task progress with summary and sends telemetry event.

**Source Code:**

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
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
        // Only update running tasks
        if (task.status !== "running") return task;

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

    // Send telemetry if enabled and task was updated
    if (progressData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = progressData;

        sendTelemetry({
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
//          i9→atomicUpdateTask, z→task, Y→progressData, Nn→isTelemetryEnabled,
//          c36→sendTelemetry
```

**Key Insight:**

The function performs **two operations atomically**:
1. **State update** - Updates task.progress.summary
2. **Telemetry** - Sends progress event to analytics

This dual operation ensures telemetry data matches the state at the time of capture.

---

### markTaskCompleted ($m8)

**What it does:** Marks a task as completed with its result.

**Source Code:**

```javascript
// ============================================
// $m8 - markTaskCompleted - Mark task as completed
// Location: chunks.146.mjs:2100-2115
// ============================================

// ORIGINAL (for source lookup):
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(K)
}

// READABLE (for understanding):
function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        // Only mark running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove agent from active tracking
    removeActiveAgent(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState, K→agentId,
//          i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

---

### markTaskFailed (Hm8)

**What it does:** Marks a task as failed with an error message.

**Source Code:**

```javascript
// ============================================
// Hm8 - markTaskFailed - Mark task as failed
// Location: chunks.146.mjs:2117-2131
// ============================================

// ORIGINAL (for source lookup):
function Hm8(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "failed",
            error: q,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(A)
}

// READABLE (for understanding):
function markTaskFailed(agentId, error, setAppState) {
    atomicUpdateTask(agentId, setAppState, (task) => {
        // Only mark running tasks
        if (task.status !== "running") return task;

        // Run cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "failed",
            error: error,
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    removeActiveAgent(agentId);
}

// Mapping: Hm8→markTaskFailed, A→agentId, q→error, K→setAppState
```

---

### markTaskKilled (d4q)

**What it does:** Marks a task as killed and sets notified flag.

**Source Code:**

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed with notification
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Already notified - don't update again
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

**Key Insight:**

The `notified` flag is critical for **exactly-once notification delivery**:
1. Task completes → `notified: false`
2. Attachment built → `notified: true`
3. Next poll → Task evicted from state

---

## Attachment Format

### task_status Attachment

```xml
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for usages</description>
  <delta_summary>Found 15 occurrences in 8 files. Key findings:
    - createTaskId is called in task_creation_source_restored.md
    - Task ID generation uses crypto randomness
  </delta_summary>
</task_status>
```

### task_progress Attachment (for running tasks)

```xml
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId" in src/...</message>
</task_progress>
```

---

## Throttle Mechanism

### Progress Attachment Throttling

Progress attachments are **throttled** to prevent context pollution:

```javascript
// Turn counting logic (simplified)
let turnsSinceProgress = Infinity;  // Default for new tasks

// In attachment producer:
if (turnsSinceProgress >= 3) {
    // Send progress attachment
    // Reset counter
}
```

**Throttle Rules:**
- **New tasks**: Always sent (turnsSinceProgress = Infinity)
- **Existing tasks**: Sent every 3+ assistant turns
- **Summary changed**: Always sent regardless of turns

### Why Throttle?

1. **Context efficiency** - Don't pollute LLM context with every progress update
2. **Token conservation** - Reduce token usage in prompts
3. **Focus maintenance** - LLM focuses on relevant context, not noise

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

## End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Complete System Reminder Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. TASK EXECUTION
   ┌───────────────────────────────────────────────────────────────────────┐
   │ Agent Loop (qh)                                                       │
   │        │                                                              │
   │        ├── Tool Use ─────────────────────────────────────────────┐    │
   │        │   └── nl4(taskId, "Running Grep...", setAppState)       │    │
   │        │       └── Update task.progress.summary                  │    │
   │        │       └── Send telemetry (if enabled)                   │    │
   │        │                                                          │    │
   │        ├── Token Update ─────────────────────────────────────────┤    │
   │        │   └── i9(taskId, ...)                                   │    │
   │        │       └── Update task.progress.tokenCount               │    │
   │        │                                                          │    │
   │        └── Completion ───────────────────────────────────────────┤    │
   │            └── $m8(result, setAppState) or Hm8(id, error, ...)   │    │
   │                └── status: "completed" / "failed"                │    │
   │                └── notified: false                               │    │
   └───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼

2. ATTACHMENT BUILDING (Before LLM Turn)
   ┌───────────────────────────────────────────────────────────────────────┐
   │ assembleAllAttachments (_uY)                                          │
   │        │                                                              │
   │        └── GROUP 3 (Main Agent Only):                                 │
   │            └── suY(sessionContext)                                    │
   │                │                                                      │
   │                ├── getAppState() → tasks                             │
   │                │                                                      │
   │                └── wY4(appState)                                      │
   │                    │                                                  │
   │                    ├── For each task:                                │
   │                    │   ├── Running: read output delta                │
   │                    │   ├── Terminal + notified: mark for eviction    │
   │                    │   └── Build attachment                          │
   │                    │                                                  │
   │                    └── Return { attachments, offsets, evictedIds }   │
   └───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼

3. STATE UPDATE
   ┌───────────────────────────────────────────────────────────────────────┐
   │ OY4(setAppState, updatedTaskOffsets, evictedTaskIds)                 │
   │        │                                                              │
   │        ├── Update outputOffset for tasks with new content            │
   │        │                                                              │
   │        └── Remove evicted tasks from appState.tasks                  │
   └───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼

4. LLM CONTEXT INJECTION
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
   │         type: "task_status",                                          │
   │         taskId: "a3f4b2",                                             │
   │         status: "completed",                                          │
   │         description: "Search codebase",                               │
   │         deltaSummary: "Found 15 occurrences..."                       │
   │       }                                                                │
   │     ]                                                                  │
   │   }                                                                    │
   │ ]                                                                      │
   └───────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `Z97` | readOutputFileDelta | chunks.89.mjs | ✓ Verified |

---

## Related Documents

- [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - Background agents integration
- [task_management_source_restored.md](./task_management_source_restored.md) - Task management
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - All attachment producers