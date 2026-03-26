# System Reminder Integration Complete (Claude Code 2.1.76)

> Complete documentation of system reminder integration with subagent and background agent systems.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - getTaskStatusAttachments — `chunks.147.mjs:1033`
- `Nqq` - getUnretrievedTaskStatuses — `chunks.147.mjs:1923`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `f4` - wrapAttachment — `chunks.147.mjs:942`

> **Note:** Previous versions incorrectly mapped `vIY`, `di4`, `TIY` to task attachment functions.
> Correct symbols are: `suY`, `Nqq`, `wY4`, `f4`. See symbol_index files for details.

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

### Get Unified Tasks Attachment (vIY)

```javascript
// ============================================
// vIY - Build unified task attachments
// Location: chunks.147.mjs (inferred)
// ============================================

// READABLE (for understanding):
function getUnifiedTasksAttachment(appState, turnsSinceProgress) {
    const attachments = [];
    const tasks = appState.tasks ?? {};

    for (const task of Object.values(tasks)) {
        // Handle running tasks (with throttle)
        if (task.status === "running") {
            const turns = turnsSinceProgress[task.id] ?? Infinity;

            // Throttle: only send every 3+ turns
            // New tasks (Infinity) always get sent
            if (turns >= 3 && task.progress?.summary) {
                attachments.push(buildTaskProgressAttachment(task));
            }
        }

        // Handle terminal tasks (not yet notified)
        if (isTerminalTaskStatus(task.status) && !task.notified) {
            attachments.push(buildTaskStatusAttachment(task));

            // Mark as notified
            atomicUpdateTask(task.id, setAppState, (t) => ({
                ...t,
                notified: true
            }));
        }
    }

    return attachments;
}
```

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

### Turn Counting (TIY)

```javascript
// ============================================
// TIY - Count turns since last progress update
// Location: chunks.144.mjs:832 (inferred)
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(appState, taskId) {
    const task = appState.tasks?.[taskId];
    if (!task || task.lastReportedTurn === undefined) {
        return Infinity;  // Never reported, always send
    }

    const currentTurn = appState.turnCount ?? 0;
    return currentTurn - task.lastReportedTurn;
}
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
   │ getUnifiedTasksAttachment(vIY)                                        │
   │        │                                                              │
   │        ├── Check each task in appState.tasks                         │
   │        │                                                              │
   │        ├── Running tasks:                                            │
   │        │   ├── TIY(taskId) → turns since progress                    │
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

## Cross-Module Integration

### Integration with 04_system_reminder

```
Background Agents                    System Reminders
        │                                   │
        ├── nl4() ──────────────────────────┤
        │   Progress state update           │
        │                                   │
        ├── vIY() ──────────────────────────┤
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
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `vIY` | getUnifiedTasksAttachment | chunks.147.mjs | ✓ Inferred |
| `di4` | buildTaskStatusAttachment | chunks.147.mjs | ✓ Inferred |
| `TIY` | countTurnsSinceLastProgress | chunks.144.mjs:832 | ✓ Inferred |
| `c36` | sendTelemetry | chunks.89.mjs | ✓ Verified |
| `Nn` | isTelemetryEnabled | chunks.89.mjs | ✓ Inferred |

---

## Related Documents

- [task_management_source_restored.md](../08_subagent/task_management_source_restored.md) - Task management
- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Key algorithms
- [../04_system_reminder/README.md](../04_system_reminder/README.md) - System reminder overview
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - Attachment producers