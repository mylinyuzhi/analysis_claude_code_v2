# System Reminder Integration V3 (Claude Code 2.1.76)

> Complete source-level documentation of system reminder integration with subagents and background agents, including attachment producers, notification injection, and cross-feature communication.

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

---

## Integration Architecture

### System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                SYSTEM REMINDER INTEGRATION ARCHITECTURE              │
└─────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │  Agent Loop     │
                          │  (Main/Child)   │
                          └────────┬────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PRODUCTION                            │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ getUnifiedTasksAttachment (suY)                              │   │
│  │   1. Get current app state                                   │   │
│  │   2. Poll task outputs (wY4)                                 │   │
│  │   3. Build task_status attachments                          │   │
│  │   4. Return array for LLM context                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Hook Additional Context (f4)                                 │   │
│  │   SubagentStart hook → Inject context                       │   │
│  │   SubagentEnd hook → Capture results                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT NORMALIZATION                         │
│                                                                      │
│  • Convert to TenguMessage format                                   │
│  • Wrap in <system-reminder> tags                                   │
│  • Inject into message array                                        │
│                                                                      │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         LLM API CALL                                 │
│                                                                      │
│  Messages with system-reminder attachments                          │
│  LLM processes meta-context alongside conversation                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Source Code

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

### createAttachmentMessage (f4)

```javascript
// ============================================
// f4 - createAttachmentMessage - Create attachment from hook context
// Location: chunks.142.mjs:1638-1646
// ============================================

// ORIGINAL (for source lookup):
// In agent loop, hook additional contexts are pushed:
if (e.length > 0) {
    let $6 = f4({
        type: "hook_additional_context",
        content: e,
        hookName: "SubagentStart",
        toolUseID: GvY(),
        hookEvent: "SubagentStart"
    });
    R.push($6)
}

// READABLE (for understanding):
// When SubagentStart hook provides additional context
function injectHookContext(additionalContexts, messages) {
    if (additionalContexts.length > 0) {
        let attachmentMessage = createAttachmentMessage({
            type: "hook_additional_context",
            content: additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        });

        // Push to message array - will be processed by LLM
        messages.push(attachmentMessage);
    }
}

// Mapping: f4→createAttachmentMessage, e→additionalContexts, R→messages,
//          GvY→generateToolUseId
```

---

## Attachment Types

### Task Status Attachment

```javascript
// Task status attachment format
{
    type: "task_status",
    taskId: "a3k7m9p2",
    taskType: "local_agent",
    status: "running",  // "pending" | "running" | "completed" | "failed" | "killed"
    description: "Search codebase for usages",
    deltaSummary: "Found 15 matches in 3 files"
}
```

### Hook Additional Context Attachment

```javascript
// Hook additional context format
{
    type: "hook_additional_context",
    content: [
        {
            type: "text",
            text: "Additional context from SubagentStart hook"
        }
    ],
    hookName: "SubagentStart",
    toolUseID: "tooluse_abc123",
    hookEvent: "SubagentStart"
}
```

### Progress Attachment

```javascript
// Progress attachment format (from updateTaskProgressWithTelemetry)
{
    type: "system",
    subtype: "task_progress",
    task_id: "a3k7m9p2",
    tool_use_id: "tooluse_abc123",
    description: "Running Grep for createTaskId...",
    usage: {
        total_tokens: 15000,
        tool_uses: 12,
        duration_ms: 45000
    },
    summary: "Running Grep for createTaskId..."
}
```

---

## Integration Flow Diagrams

### Subagent System Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              SUBAGENT SYSTEM REMINDER FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

Subagent spawned (AgentTool invoked)
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ SubagentStart hooks fire                                            │
│   • Pre-tool-use hooks                                              │
│   • Additional context injection                                    │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Agent loop runs (qh)                                                │
│   • Each turn checks for attachments                                │
│   • getUnifiedTasksAttachment called                                │
│   • Progress updates throttled                                      │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Task attachments built                                              │
│   • pollTaskOutputs reads output files                              │
│   • Status determined from task state                               │
│   • Attachments normalized to message format                        │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Attachments injected into LLM context                               │
│   • Wrapped in <system-reminder> tags                               │
│   • LLM sees task status alongside conversation                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Background Agent Notification Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              BACKGROUND AGENT NOTIFICATION FLOW                      │
└─────────────────────────────────────────────────────────────────────┘

Background task completes/fails/killed
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ markTaskCompleted/Failed/Killed ($m8/Hm8/d4q)                       │
│   • Updates task.status                                             │
│   • Sets notified: true                                             │
│   • Trims message history                                           │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Next agent turn                                                     │
│   • getUnifiedTasksAttachment called                                │
│   • Task status attachment created                                  │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Task evicted from state                                             │
│   • Task in terminal state + notified                               │
│   • Removed from appState.tasks                                     │
│   • Notification shown to user                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Feature Integration

### With Tools System (05_tools)

```javascript
// AgentTool creates task entries
AgentTool.call({
    prompt: "...",
    run_in_background: true
})
    ↓
createBackgroundAgentTask (Qn4)
    ↓
registerTask (Zf)
    ↓
Task appears in state for system reminders
```

### With Hooks (17_hooks)

```javascript
// SubagentStart hook provides additional context
hooks.onSubagentStart((context) => {
    return {
        additionalContext: "Project-specific context..."
    };
})
    ↓
Hook context injected via f4
    ↓
Subagent receives context in system reminder
```

### With Compact (07_compact)

```javascript
// Background agent transcripts handled in compaction
compact( messages )
    ↓
Background task messages preserved
    ↓
Task state not affected by compaction
```

### With CLI (01_cli)

```javascript
// /tasks command shows all background tasks
CLI.parseCommand("/tasks")
    ↓
Display TaskListModal
    ↓
Show all tasks from appState.tasks
```

---

## Key Insights

### Why Attachment-Based Design?

**Benefits:**
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

### Why Output File Polling?

**Problem:** Background tasks run independently

**Solution:** Poll output files for new content
- Track read offset per task
- Incremental reads avoid re-reading entire file
- Output files persist across restarts

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `04_system_reminder` | Attachment production, normalization |
| `08_subagent` | Task creation, status updates |
| `26_background_agents` | Task state, output polling |
| `05_tools` | AgentTool, TaskOutput, TaskStop |
| `17_hooks` | SubagentStart, SubagentEnd |
| `01_cli` | /tasks command, notifications |

---

## Summary

The system reminder integration with subagents and background agents provides:

1. **Task status attachments** - LLM sees background task state
2. **Hook context injection** - Subagents receive additional context
3. **Progress updates** - Throttled progress information
4. **Notification system** - User sees task completion/failure
5. **Task eviction** - Completed tasks cleaned from state
6. **Output polling** - Incremental output file reading

The integration enables seamless awareness of background tasks without requiring explicit polling or blocking operations.