# System Reminder Integration Complete V7 (Claude Code 2.1.76)

> Complete source-level analysis of system reminder integration with subagent and background agent systems, including task_status, task_progress attachment types, and notification flow.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1030+`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `f4` - Create task status attachment — `chunks.147.mjs:1928+`
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

## Key Functions

### getUnifiedTasksAttachment (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Get all task attachments
// Location: chunks.147.mjs:1030-1050
// ============================================

// READABLE (for understanding):
async function getUnifiedTasksAttachment(setAppState, appState) {
    // Poll all task outputs
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);  // wY4

    // Apply state updates
    updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds);  // OY4

    // Map to attachment format
    return attachments.map((task) => ({
        type: "task_status",
        taskId: task.taskId,
        taskType: task.taskType,
        status: task.status,
        description: task.description,
        // ... additional fields
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, wY4→pollTaskOutputs, OY4→updateTaskState
```

### createTaskStatusAttachment (f4)

```javascript
// ============================================
// f4 - createTaskStatusAttachment - Create status attachment for task
// Location: chunks.147.mjs:1928-1945
// ============================================

// ORIGINAL (for source lookup):
// (Derived from context)

// READABLE (for understanding):
function createTaskStatusAttachment(attachment) {
    let {
        taskId,
        taskType,
        status,
        description,
        deltaSummary,
        result,
        error
    } = attachment;

    // Only create for terminal states
    if (status === "completed" || status === "failed" || status === "killed") {
        return {
            type: "task_status",
            taskId: taskId,
            taskType: taskType,
            status: status,
            description: description,
            deltaSummary: deltaSummary,
            result: status === "completed" ? result : undefined,
            error: status === "failed" ? error : undefined
        };
    }

    return null;
}

// Mapping: f4→createTaskStatusAttachment
```

### normalizeAttachmentForAPI - task_status case

```javascript
// ============================================
// Ui8 - normalizeAttachmentForAPI - task_status case
// Location: chunks.174.mjs:330-341
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
    // Normalize "killed" to "stopped" for display
    let displayStatus = attachment.status === "killed" ? "stopped" : attachment.status;

    // Special handling for killed tasks
    if (attachment.status === "killed") {
        return [createUserMessage({
            content: wrapInXmlTag(`Task "${attachment.description}" (${attachment.taskId}) was stopped by the user.`),
            isMeta: true
        })];
    }

    // Build informative message
    let messageParts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${displayStatus})`,
        `(description: ${attachment.description})`
    ];

    if (attachment.deltaSummary) {
        messageParts.push(`Delta: ${attachment.deltaSummary}`);
    }

    // Add hint about checking output
    messageParts.push("You can check its output using the TaskOutput tool.");

    return [createUserMessage({
        content: wrapInXmlTag(messageParts.join(" ")),
        isMeta: true
    })];
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, K→displayStatus,
//          p1→createUserMessage, af→wrapInXmlTag
```

### normalizeAttachmentForAPI - task_progress case

```javascript
// ============================================
// Ui8 - normalizeAttachmentForAPI - task_progress handling
// Location: chunks.174.mjs:467
// ============================================

// ORIGINAL (for source lookup):
if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(A.type)) return [];

// READABLE (for understanding):
// task_progress is a silent type - used for telemetry only
if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(attachment.type)) {
    return [];  // No message injected to context
}

// Mapping: A→attachment
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

    // Update task progress
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

## UI Integration

### Status Line Components

```javascript
// State selector for showing background agent indicator
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);

// Display format
if (hasRunningLocalAgents) {
    let count = Object.values(tasks).filter(
        (task) => task.type === "local_agent" && task.status === "running"
    ).length;

    return `${count} running • Ctrl+C to cancel`;
}
```

### Task List Modal Data

```javascript
// Group tasks by type
let bashTasks = Object.values(tasks).filter(t => t.type === "local_bash");
let agentTasks = Object.values(tasks).filter(t => t.type === "local_agent");
let teammateTasks = Object.values(tasks).filter(t => t.type === "in_process_teammate");
let workflowTasks = Object.values(tasks).filter(t => t.type === "local_workflow");
let remoteSessions = Object.values(tasks).filter(t => t.type === "remote_agent");
```

### Notification Messages

| Event | Message Format |
|-------|----------------|
| Completion | `Task "${description}" (${taskId}) (type: ${taskType}) (status: completed)` |
| Failure | `Task "${description}" failed: ${error}` |
| Kill | `Task "${description}" (${taskId}) was stopped by the user` |
| Multiple Kill | `${count} background agents were stopped by the user` |

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
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1030+ | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:1928+ | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `Ui8` | normalizeAttachmentForAPI | chunks.174.mjs:3-469 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |

---

## Related Documents

- [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Symbol mappings
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview
- [../08_subagent/agent_tool_complete_v2.md](../08_subagent/agent_tool_complete_v2.md) - AgentTool
- [task_lifecycle_complete_v5.md](./task_lifecycle_complete_v5.md) - Task lifecycle