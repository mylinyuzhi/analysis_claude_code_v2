# System Reminder Integration V5 (Claude Code 2.1.76)

> Complete documentation of the integration between subagent/background agent systems and the system reminder attachment system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `suY` - Get unified tasks attachment — `chunks.147.mjs:1033`
- `wY4` - Poll task outputs — `chunks.90.mjs:3058`
- `OY4` - Update task state — `chunks.90.mjs:3087`
- `nl4` - Update progress with telemetry — `chunks.146.mjs:2059`
- `TIY` - Count turns since last progress — `chunks.144.mjs:832`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Execution
          │
          ├── Each turn ────────────────────────────────────────┐
          │                                                      ▼
          │                           updateTaskProgressWithTelemetry (nl4)
          │                           • Update progress state
          │                           • Send telemetry event
          │
          └── On completion ───────────────────────────────────┐
                                                                 ▼
                                           markTaskCompleted/Failed/Killed
                                           • Set terminal status
                                           • Set notified = false

Parent Session (before LLM turn)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ assembleAllAttachments (_uY)                                                  │
│                                                                              │
│  For each attachment type:                                                   │
│  ├── task_status (terminal tasks)                                            │
│  ├── task_progress (running tasks, throttled)                                │
│  └── ... other types                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ getUnifiedTasksAttachment (suY)                                              │
│                                                                              │
│  1. pollTaskOutputs (wY4)                                                    │
│     - Read output deltas                                                     │
│     - Identify eviction candidates                                           │
│                                                                              │
│  2. updateTaskState (OY4)                                                    │
│     - Update offsets                                                         │
│     - Remove evicted tasks                                                   │
│                                                                              │
│  3. Build attachments for:                                                   │
│     - Terminal tasks (not yet notified) → task_status                        │
│     - Running tasks (throttled) → task_progress                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ normalizeAttachmentForAPI (Ui8)                                              │
│                                                                              │
│  Convert attachment to user message:                                         │
│  • type: "user"                                                              │
│  • isMeta: true                                                              │
│  • content: [text blocks]                                                    │
│  • wrapped in <system-reminder> XML                                          │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM Context                                                                  │
│                                                                              │
│  <task_status>                                                               │
│    <task_id>ab3k7m9p2</task_id>                                              │
│    <status>completed</status>                                                │
│    <description>Search codebase</description>                                │
│    <delta_summary>Found 15 files...</delta_summary>                          │
│  </task_status>                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: getUnifiedTasksAttachment (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments for LLM context
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
    // Step 1: Get current state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll output files for all tasks
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Step 3: Update state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

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

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState, K→attachments,
//          Y→updatedTaskOffsets, z→evictedTaskIds, _→attachment,
//          wY4→pollTaskOutputs, OY4→updateTaskState
```

---

## Attachment Types

### task_status (Terminal State Notification)

**When included:**
- Task status is "completed", "failed", or "killed"
- Task has NOT been notified yet
- Sent ONCE per task

**Format:**

```xml
<system-reminder>
<task_status>
  <task_id>ab3k7m9p2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for createTaskId usages</description>
  <delta_summary>
    Found 15 files containing createTaskId:
    - chunks.41.mjs (definition)
    - chunks.90.mjs (usage)
    - chunks.146.mjs (usage)
  </delta_summary>
</task_status>
</system-reminder>
```

**Purpose:**
- Notify LLM that a background task completed
- Provide summary of results
- Allow LLM to use results in next response

### task_progress (Running Task Update)

**When included:**
- Task status is "running"
- At least 3 turns since last progress attachment
- OR task is new (no previous progress)

**Format:**

```xml
<system-reminder>
<task_progress>
  <task_id>ab3k7m9p2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId" in 5 files...</message>
</task_progress>
</system-reminder>
```

**Purpose:**
- Keep LLM informed of running tasks
- Prevent "what's happening?" questions
- Enable context-aware decisions

---

## Throttling Mechanism

### Turn-Based Throttling

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Throttle progress attachments
// Location: chunks.144.mjs:832
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(state) {
    let turns = 0;

    // Walk backwards through messages
    for (let i = state.messages.length - 1; i >= 0; i--) {
        let message = state.messages[i];

        // Count user turns (not meta messages)
        if (message?.type === "user" && !message.isMeta) {
            turns++;
        }

        // Stop if we find a task_progress attachment
        if (message?.type === "attachment" &&
            message.attachment?.type === "task_progress") {
            return turns;
        }
    }

    // No progress found = Infinity (always include)
    return Infinity;
}
```

### Throttle Decision Matrix

| Condition | turnsSinceProgress | Include Progress? |
|-----------|-------------------|-------------------|
| New task | Infinity | ✓ Always |
| First turn after progress | 1 | ✗ Skip |
| Second turn | 2 | ✗ Skip |
| Third turn | 3 | ✓ Include |
| Fourth turn | 1 | ✗ Skip |
| ... | ... | ... |

### Why Throttle?

**Design rationale:**
1. **Context efficiency** - Each attachment adds tokens
2. **Signal-to-noise** - Too frequent updates are noise
3. **Decision alignment** - Updates at turn boundaries
4. **Performance** - Fewer attachments = faster processing

---

## Integration Points

### 1. With Tools System (05_tools)

```
AgentTool.call({ run_in_background: true })
          │
          ▼
createBackgroundAgentTask (Qn4)
          │
          ├── Create task record
          ├── Initialize output file
          ├── Register in appState.tasks
          │
          └── Spawn detached execution
                    │
                    ▼
              Agent loop runs...
                    │
                    ├── Each turn: nl4(summary)
                    │
                    └── On complete: $m8(result)
                              │
                              ▼
                        Task status: "completed"
                        notified: false
                              │
                              ▼
              Next LLM turn: suY() includes task_status
```

### 2. With Hooks System (17_hooks)

```
SubagentStart Hook
          │
          ├── Pre-tool execution hook
          ├── Can inject additional context
          │
          └── Returned in Ux8() during agent loop init

SubagentEnd Hook
          │
          ├── Post-execution hook
          ├── Can process final results
          │
          └── Triggered by agent loop completion
```

### 3. With Compact System (07_compact)

```
Auto-Compact triggered
          │
          ▼
Check message types
          │
          ├── isMeta: true → Special handling
          │   ├── task_status → Keep if relevant
          │   └── task_progress → Often compacted
          │
          └── isMeta: false → Normal compaction
```

### 4. With Agent Teams (30_agent_teams)

```
Teammate spawned
          │
          ├── type: "in_process_teammate"
          ├── pendingUserMessages: []
          │
          └── Mailbox-based communication
                    │
                    ├── writeToMailbox (x3)
                    ├── readMailbox (wl)
                    │
                    └── pollForNextMessage (DNY)
                              │
                              └── Returns messages as new_message type
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK ATTACHMENT DATA FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ Background     │     │ Output File    │     │ Parent Session │
│ Agent          │     │ System         │     │                │
└───────┬────────┘     └───────┬────────┘     └───────┬────────┘
        │                      │                      │
        │ Write output         │                      │
        │─────────────────────►│                      │
        │                      │                      │
        │                      │                      │
        │                      │                      │
        │ nl4(summary)         │                      │
        │──────────────────────┼──────────────────────┤
        │                      │                      │
        │                      │                      │ pollTaskOutputs()
        │                      │◄─────────────────────┤
        │                      │                      │
        │                      │ Read delta           │
        │                      │─────────────────────►│
        │                      │                      │
        │                      │                      │ updateTaskState()
        │                      │                      │
        │                      │                      │ build attachments
        │                      │                      │
        │ $m8(result)          │                      │
        │──────────────────────┼──────────────────────┤
        │                      │                      │
        │                      │                      │ suY() includes
        │                      │                      │ task_status attachment
        │                      │                      │
        │                      │                      │──────────► LLM Context
```

---

## Notification Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────────────────┘

Task Created
    │
    ▼
┌──────────────────┐
│ status: pending  │
│ notified: false  │
└────────┬─────────┘
         │
         │ spawn
         ▼
┌──────────────────┐
│ status: running  │
│ notified: false  │
└────────┬─────────┘
         │
         │ Each turn: nl4(summary)
         │
         │ Parent: suY() may include task_progress
         │         (if turns >= 3)
         │
         │ complete / fail / kill
         ▼
┌──────────────────┐
│ status: terminal │
│ notified: false  │
└────────┬─────────┘
         │
         │ Next suY() call
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│ Build attachment │─────►│ Include in LLM   │
│ task_status      │      │ context          │
└──────────────────┘      └────────┬─────────┘
                                   │
                                   │ After inclusion
                                   ▼
                          ┌──────────────────┐
                          │ notified: true   │
                          └────────┬─────────┘
                                   │
                                   │ Subsequent suY() call
                                   │
                                   ▼
                          ┌──────────────────┐
                          │ removeTask()     │
                          │ (if terminal +   │
                          │  notified)       │
                          └──────────────────┘
```

---

## Key Design Decisions

### 1. Single Notification Per Task

**Why notify once?**
- Avoid duplicate notifications
- LLM only needs to know once
- After notification, task can be removed

### 2. Throttled Progress Updates

**Why 3-turn throttle?**
- Balance visibility vs noise
- Reduce context bloat
- Align with decision points

### 3. Output File Delta Reading

**Why incremental reads?**
- Memory efficiency
- Track read position
- Handle growing files

### 4. Separation of Progress and Status

**Why different attachment types?**
- Different timing (ongoing vs terminal)
- Different content (summary vs results)
- Different throttling rules

---

## Source File References

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `TIY` | countTurnsSinceLastProgress | chunks.144.mjs:832 | ✓ Verified |

---

## Related Documents

- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task reminder types
- [task_lifecycle_complete_v4.md](../26_background_agents/task_lifecycle_complete_v4.md) - Task lifecycle
- [progress_tracking_complete_v2.md](../26_background_agents/progress_tracking_complete_v2.md) - Progress tracking