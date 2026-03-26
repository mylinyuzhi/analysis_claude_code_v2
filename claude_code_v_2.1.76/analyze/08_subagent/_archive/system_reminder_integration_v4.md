# System Reminder Integration Complete V4 (Claude Code 2.1.76)

> Comprehensive documentation of system reminder integration with subagents and background agents, covering all attachment types, notification flows, and cross-feature communication.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `OY4` - updateTaskState — `chunks.90.mjs:3087`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `f4` - createAttachmentMessage — `chunks.142.mjs:1638`
- `c36` - emitSystemEvent — `chunks.90.mjs:2979`
- `TIY` - countTurnsSinceLastProgress — `chunks.144.mjs:832`

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                SYSTEM REMINDER INTEGRATION ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │  Agent Loop     │
                          │  (Main/Child)   │
                          └────────┬────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCTION                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ getUnifiedTasksAttachment (suY)                                      │   │
│  │   1. Get current app state                                          │   │
│  │   2. Poll task outputs (wY4)                                        │   │
│  │   3. Build task_status attachments                                  │   │
│  │   4. Update task offsets and evict completed (OY4)                 │   │
│  │   5. Return array for LLM context                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Hook Additional Context (f4)                                         │   │
│  │   SubagentStart hook → Inject context                               │   │
│  │   SubagentEnd hook → Capture results                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Progress Updates (nl4)                                               │   │
│  │   Each agent turn → Update progress                                 │   │
│  │   Throttled to every 3 turns (TIY)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT NORMALIZATION                                  │
│                                                                              │
│  • Convert to TenguMessage format                                           │
│  • Wrap in <system-reminder> tags                                           │
│  • Inject into message array                                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM API CALL                                         │
│                                                                              │
│  Messages with system-reminder attachments                                  │
│  LLM processes meta-context alongside conversation                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Task Status Attachments

### getUnifiedTasksAttachment (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task status attachments
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
    // Step 1: Get current application state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll all running tasks for output updates
    let {
        attachments,           // Task status attachments
        updatedTaskOffsets,    // New read positions for output files
        evictedTaskIds        // Tasks to remove from state
    } = await pollTaskOutputs(appState);

    // Step 3: Update state with new offsets and remove completed tasks
    updateTaskState(
        toolUseContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );

    // Step 4: Format attachments for LLM context
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
//          wY4→pollTaskOutputs, OY4→updateTaskState, K→attachments,
//          Y→updatedTaskOffsets, z→evictedTaskIds
```

### pollTaskOutputs (wY4)

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll running tasks for output
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

    // Iterate through all tasks
    for (let task of Object.values(tasks)) {
        // Check if task should be evicted (terminal state + notified)
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    // Task is done and user notified - evict from state
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    // Pending tasks don't need polling
                    continue;
                case "running":
                    // Running tasks continue to be polled
                    break;
            }
        }

        // Poll output for running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                // Record new offset for state update
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
//          Y→evictedTaskIds, z→tasks, Z97→readOutputFileDelta
```

### updateTaskState (OY4)

```javascript
// ============================================
// OY4 - updateTaskState - Update task offsets and evict completed
// Location: chunks.90.mjs:3087-3108
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

    // Nothing to update
    if (offsetTaskIds.length === 0 && evictedTaskIds.length === 0) {
        return;
    }

    setAppState((state) => {
        let hasChanges = false;
        let tasks = { ...state.tasks };

        // Update offsets for running tasks
        for (let taskId of offsetTaskIds) {
            let task = tasks[taskId];
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

        // Return new state only if changes were made
        return hasChanges
            ? { ...state, tasks: tasks }
            : state;
    });
}

// Mapping: OY4→updateTaskState, A→setAppState, q→updatedTaskOffsets,
//          K→evictedTaskIds, Y→offsetTaskIds, z→state, _→hasChanges, w→tasks
```

---

## Attachment Types

### Task Status Attachment

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;           // e.g., "ab3k7m9p2"
    taskType: string;         // e.g., "local_agent"
    status: string;           // "pending" | "running" | "completed" | "failed" | "killed"
    description: string;      // Human-readable description
    deltaSummary?: string;    // Progress summary
}
```

### Task Progress Attachment

```typescript
interface TaskProgressAttachment {
    type: "task_progress";
    taskId: string;
    toolUseId: string;
    description: string;
    usage: {
        total_tokens: number;
        tool_uses: number;
        duration_ms: number;
    };
    summary: string;
}
```

### Hook Additional Context Attachment

```typescript
interface HookAdditionalContextAttachment {
    type: "hook_additional_context";
    content: Array<{
        type: "text";
        text: string;
    }>;
    hookName: string;         // e.g., "SubagentStart"
    toolUseID: string;
    hookEvent: string;
}
```

---

## Progress Updates

### updateTaskProgressWithTelemetry (nl4)

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
    let telemetryData = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture telemetry data
        telemetryData = {
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
                summary: summary
            }
        };
    });

    // Emit telemetry event if update happened
    if (telemetryData && shouldSendTelemetry()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        emitSystemEvent({
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
//          i9→atomicUpdateTask, Nn→shouldSendTelemetry, c36→emitSystemEvent
```

### Progress Throttling (TIY)

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Turn counting for throttle
// Location: chunks.144.mjs:832
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(state) {
    // Count user turns since last progress attachment
    let turns = 0;

    for (let i = state.messages.length - 1; i >= 0; i--) {
        let message = state.messages[i];

        // Count user messages (not meta/system)
        if (message?.type === "user" && !message.isMeta) {
            turns++;
        }

        // Stop if we hit a progress attachment
        if (message?.type === "attachment" && message.attachment.type === "task_progress") {
            return turns;
        }
    }

    return turns;
}

// The throttling constant
const TURNS_BETWEEN_PROGRESS = 3;  // Only show progress every 3 turns
```

---

## Notification System

### emitSystemEvent (c36)

```javascript
// ============================================
// c36 - emitSystemEvent - Queue system event for notifications
// Location: chunks.90.mjs:2979-2992
// ============================================

// ORIGINAL (for source lookup):
function c36(A) {
    if (!q7()) return;
    if (Np6.length >= VB9) Np6.shift();
    Np6.push(A)
}

// READABLE (for understanding):
function emitSystemEvent(event) {
    // Check if system is ready for events
    if (!isSystemReady()) return;

    // Enforce queue size limit
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
        eventQueue.shift();  // Remove oldest
    }

    // Add event to queue
    eventQueue.push(event);
}

// Mapping: c36→emitSystemEvent, A→event, q7→isSystemReady, Np6→eventQueue,
//          VB9→MAX_QUEUE_SIZE
```

### Event Types

```typescript
// Task started event
{
    type: "system",
    subtype: "task_started",
    task_id: string,
    tool_use_id: string,
    description: string,
    task_type: string,
    prompt?: string
}

// Task progress event
{
    type: "system",
    subtype: "task_progress",
    task_id: string,
    tool_use_id: string,
    description: string,
    usage: {
        total_tokens: number,
        tool_uses: number,
        duration_ms: number
    },
    summary: string
}

// Task completion event
{
    type: "system",
    subtype: "task_completed",
    task_id: string,
    status: "completed" | "failed" | "killed",
    result?: any,
    error?: string
}
```

---

## Hook Integration

### SubagentStart Hook

```javascript
// ============================================
// SubagentStart hook integration
// Location: chunks.133.mjs:1636-1646
// ============================================

// In agentLoopRunner:

// Process SubagentStart hooks for additional context
let additionalContexts = [];
for await (let hookEvent of runAgentHooks(agentId, agentDefinition.agentType, abortController.signal)) {
    if (hookEvent.additionalContexts && hookEvent.additionalContexts.length > 0) {
        additionalContexts.push(...hookEvent.additionalContexts);
    }
}

// Inject as attachment message
if (additionalContexts.length > 0) {
    let attachmentMessage = createAttachmentMessage({
        type: "hook_additional_context",
        content: additionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(attachmentMessage);
}
```

### createAttachmentMessage (f4)

```javascript
// ============================================
// f4 - createAttachmentMessage - Create attachment from hook context
// Location: chunks.142.mjs:1638-1646
// ============================================

// READABLE (for understanding):
function createAttachmentMessage(params) {
    return {
        type: "attachment",
        attachment: {
            type: params.type,
            content: params.content,
            hookName: params.hookName,
            toolUseID: params.toolUseID,
            hookEvent: params.hookEvent
        }
    };
}

// Mapping: f4→createAttachmentMessage
```

---

## Integration Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              COMPLETE SYSTEM REMINDER FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent spawned (AgentTool invoked)
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SubagentStart hooks fire                                                    │
│   • Pre-tool-use hooks                                                      │
│   • Additional context injection (f4)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent loop runs (qh)                                                        │
│   • Each turn checks for attachments                                        │
│   • getUnifiedTasksAttachment (suY) called                                  │
│   • Progress updates throttled (TIY - every 3 turns)                        │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task attachments built                                                      │
│   • pollTaskOutputs (wY4) reads output files                                │
│   • Status determined from task state                                       │
│   • Attachments normalized to message format                                │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Attachments injected into LLM context                                       │
│   • Wrapped in <system-reminder> tags                                       │
│   • LLM sees task status alongside conversation                             │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task completes/fails/killed                                                 │
│   • markTaskCompleted/Failed/Killed ($m8/Hm8/d4q)                          │
│   • Updates task.status                                                     │
│   • Sets notified: true                                                     │
│   • Trims message history                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task evicted from state                                                     │
│   • Task in terminal state + notified                                       │
│   • Removed from appState.tasks                                             │
│   • Notification shown to user                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Insights

### Why Attachment-Based Design?

1. **Lazy evaluation** - Only compute when needed
2. **Consistency** - Single source of truth (appState)
3. **Throttle-friendly** - Easy to rate-limit
4. **Extensible** - Easy to add new attachment types

### Why Task Eviction?

**Problem:** Completed tasks would accumulate forever

**Solution:** Evict tasks that are:
1. In terminal state (completed/failed/killed)
2. Already notified to user

**Benefits:**
- State doesn't grow unbounded
- User sees notification once
- Task history preserved in output files

### Why Progress Throttling?

**Problem:** Frequent progress updates would overwhelm LLM context

**Solution:** Only include progress attachments every 3 turns

**Benefits:**
- LLM has visibility without noise
- Context stays manageable
- Still responsive for long-running tasks

---

## Related Documents

- [README.md](./README.md) - Module overview
- [../08_subagent/system_reminder_integration_v3.md](../08_subagent/system_reminder_integration_v3.md) - Subagent integration
- [../26_background_agents/system_reminder_integration_v3.md](../26_background_agents/system_reminder_integration_v3.md) - Background agents integration