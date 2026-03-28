# System Reminder Integration - Final (Claude Code 2.1.76)

> Complete source-level analysis of system reminder integration with subagent and background agent systems, including task_status, task_progress attachment types, notification flow, and cross-feature linkages.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Verified symbols

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `f4` - Create task status attachment — `chunks.147.mjs:942`
- `nl4` - Update task progress with telemetry — `chunks.146.mjs:2059`
- `Ui8` - Normalize attachment for API — `chunks.174.mjs:3-469`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Layer 1: Attachment Production                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  getUnifiedTasksAttachment(suY)                                              │
│        │                                                                     │
│        ├──► pollTaskOutputs(wY4)                                            │
│        │         │                                                           │
│        │         └──► readOutputFileDelta(Z97)                              │
│        │                                                                     │
│        └──► createTaskStatusAttachment(f4)                                  │
│                │                                                             │
│                └──► For each task:                                          │
│                     - task_status                                            │
│                     - task_progress                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Layer 2: Attachment Normalization                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  normalizeAttachmentForAPI(Ui8)                                              │
│        │                                                                     │
│        ├──► case "task_status":                                             │
│        │        └──► Create meta user message with task info               │
│        │                                                                     │
│        └──► case "task_progress":                                           │
│                 └──► Silent (internal use only)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Layer 3: Message Injection                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  attachmentGenerator(Vf6)                                                    │
│        │                                                                     │
│        └──► Yields messages to LLM context                                  │
│                                                                              │
│  Display in UI:                                                              │
│        - Status line: "2 running • Ctrl+C to cancel"                        │
│        - Task list modal: /tasks                                            │
│        - Notifications: completion/failure/kill                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Attachment Types

### task_status

**Purpose:** Notify LLM of background task state changes.

**Structure:**
```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: "local_agent" | "local_bash" | "remote_agent" | "in_process_teammate";
    status: "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;
    result?: CompletionResult;
    error?: string;
}
```

**Trigger Conditions:**
- Task completes successfully (`$m8`)
- Task fails with error (`Hm8`)
- Task is killed by user (`x66`)

### task_progress

**Purpose:** Internal progress tracking with telemetry.

**Structure:**
```typescript
interface TaskProgressAttachment {
    type: "task_progress";
    taskId: string;
    toolUseId?: string;
    description: string;
    usage: {
        total_tokens: number;
        tool_uses: number;
        duration_ms: number;
    };
    summary: string;
}
```

**Trigger Conditions:**
- Progress update called during execution (`nl4`)
- Telemetry event sent to analytics

---

## Key Functions - Source Restoration

### getUnifiedTasksAttachment (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Get all task attachments
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
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);  // OY4

    // Step 4: Map to attachment format
    return attachments.map((task) => ({
        type: "task_status",
        taskId: task.taskId,
        taskType: task.taskType,
        status: task.status,
        description: task.description,
        deltaSummary: task.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState,
//          K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

**Why this design:**
- **Polling-based**: Tasks run independently, output is polled
- **State update**: Offsets track read position, evictions clean up completed tasks
- **Simple mapping**: Task data maps directly to attachment format

### createTaskStatusAttachment (f4)

```javascript
// ============================================
// f4 - createTaskStatusAttachment - Create attachment wrapper
// Location: chunks.147.mjs:942-948
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
function createTaskStatusAttachment(attachment) {
    return {
        attachment: attachment,
        type: "attachment",
        uuid: generateUUID(),  // KuY
        timestamp: new Date().toISOString()
    };
}

// Mapping: f4→createTaskStatusAttachment, A→attachment, KuY→generateUUID
```

**Why wrapper format:**
- **UUID**: Unique identifier for tracking
- **Timestamp**: When attachment was created
- **Type field**: Distinguishes from other message types

### pollTaskOutputs (wY4)

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all task output files
// Location: chunks.90.mjs:3058-3085
// ============================================

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];

    // Iterate all tasks in state
    for (let [taskId, task] of Object.entries(appState.tasks)) {
        // Skip non-running, non-terminal tasks
        if (task.status === "running") {
            // Read output delta from last offset
            let { content, newOffset } = await readOutputFileDelta(
                taskId,
                task.outputOffset ?? 0
            );  // Z97

            if (content) {
                // Create attachment for running task
                attachments.push({
                    taskId: taskId,
                    taskType: task.type,
                    status: "running",
                    description: task.description,
                    deltaSummary: content.slice(0, 500)  // Truncate
                });

                // Track offset update
                updatedTaskOffsets[taskId] = newOffset;
            }
        } else if (isTerminalTaskStatus(task.status) && !task.notified) {
            // Create attachment for terminal task not yet notified
            attachments.push({
                taskId: taskId,
                taskType: task.type,
                status: task.status,
                description: task.description,
                error: task.error
            });
        }

        // Check for eviction (terminal + notified)
        if (isTerminalTaskStatus(task.status) && task.notified) {
            evictedTaskIds.push(taskId);
        }
    }

    return { attachments, updatedTaskOffsets, evictedTaskIds };
}

// Mapping: wY4→pollTaskOutputs, Z97→readOutputFileDelta
```

---

## Notification Flow

### Task Completion Notification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TASK COMPLETION NOTIFICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

Agent execution completes
        │
        ▼
markTaskCompleted($m8)
        │
        ├─── Update task status to "completed"
        │
        ├─── Flush output buffer ($O)
        │
        └─── Task now has status: "completed", notified: false
                │
                ▼
        Next polling cycle
                │
                ▼
        pollTaskOutputs(wY4)
                │
                ├─── Read output delta (Z97)
                │
                └─── Identify task for attachment
                        │
                        ▼
                createTaskStatusAttachment(f4)
                        │
                        └─── Returns: { type: "task_status", status: "completed", ... }
                                │
                                ▼
                        normalizeAttachmentForAPI(Ui8)
                                │
                                └─── Creates meta user message
                                        │
                                        ▼
                                Injected into LLM context
                                        │
                                        ▼
                                UI displays: "Task completed..."
```

### Task Kill Notification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TASK KILL NOTIFICATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F (kill all)
        │
        ▼
killAllLocalAgents(U4q)
        │
        └─── For each running local_agent:
                │
                ▼
        triggerAbortSignal(x66)
                │
                ├─── Abort controller.abort()
                │
                ├─── Unregister cleanup handler
                │
                └─── Update status to "killed"
                        │
                        ▼
                flushOutputBuffer($O)
                        │
                        └─── Preserve partial results
                                │
                                ▼
                        markTaskKilled(d4q)
                                │
                                └─── Set notified: true
                                        │
                                        ▼
                                Next polling cycle
                                        │
                                        ▼
                                Notification injected to context
                                        │
                                        ▼
                                UI displays: "Task was stopped by the user"
```

---

## Progress Telemetry

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
    let progressData = null;

    // Update task progress atomically
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
//          Y→progressData, z→task, i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

---

## Cross-Feature Integration

### With 04_system_reminder

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Integration Points with 04_system_reminder                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Attachment Producers (chunks.147.mjs):                                      │
│        - suY → Called during attachment assembly                            │
│        - f4 → Creates task_status attachment                                │
│                                                                              │
│  Normalization (chunks.174.mjs):                                             │
│        - Ui8 → Handles task_status, task_progress types                     │
│                                                                              │
│  Silent Types:                                                               │
│        - task_progress → Used for telemetry only                            │
│        - background_task_status → Internal state tracking                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### With 05_tools

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Integration Points with 05_tools                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AgentTool (QW6):                                                            │
│        - Creates background/foreground tasks                                │
│        - Uses createBackgroundAgentTask(Qn4)                                │
│        - Uses createForegroundAgentTask(Un4)                                │
│                                                                              │
│  TaskOutputTool:                                                             │
│        - Polls output files (Z97)                                           │
│        - Returns task progress/results                                      │
│                                                                              │
│  TaskStopTool:                                                               │
│        - Calls triggerAbortSignal(x66)                                      │
│        - Kills specified task                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### With 08_subagent

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Integration Points with 08_subagent                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Agent Loop (qh):                                                            │
│        - Calls nl4 for progress updates                                     │
│        - Calls $m8/Hm8 on completion/failure                                │
│                                                                              │
│  Teammate Execution (XNY):                                                   │
│        - Uses mailbox for message passing                                   │
│        - Updates task progress                                              │
│                                                                              │
│  Hook Integration (r24):                                                     │
│        - SubagentStart hooks can inject context                             │
│        - Progress tracked via task system                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3-469 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |

---

## Related Documents

- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Symbol mappings
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview
- [cross_validation_final.md](./cross_validation_final.md) - Verified symbols
- [../26_background_agents/system_reminder_integration_complete_source.md](../26_background_agents/system_reminder_integration_complete_source.md) - Background agents integration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete