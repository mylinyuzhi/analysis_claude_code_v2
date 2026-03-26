# Subagent System Reminder Integration - Complete Analysis (Claude Code 2.1.76)

> Source-level analysis of how subagent state is surfaced through system reminders.
> Cross-validated against source on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getTaskStatusAttachments` (suY) - Main attachment producer — `chunks.147.mjs:1033`
- `getUnretrievedTaskStatuses` (Nqq) - Get unnotified completed tasks — `chunks.147.mjs:1923`
- `pollTaskOutputs` (wY4) - Poll task outputs for attachments — `chunks.90.mjs:3058`
- `wrapAttachment` (f4) - Wrap attachment with metadata — `chunks.147.mjs:942`
- `emitSystemMessage` (c36) - Emit system message — various

> **Note:** Previous versions incorrectly mapped `vIY`, `di4`, `TIY` to these functions.
> Correct symbols are: `suY`, `Nqq`, `wY4`, `f4`.

---

## Overview

Subagent state is surfaced to the conversation context through the **system reminder** system. This allows the main LLM to stay informed about background task progress without blocking.

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop Iteration                                  │
│  (every LLM turn, before processing)                                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              getTaskStatusAttachments (suY)                             │
│                                                                          │
│  1. Get appState.tasks                                                  │
│  2. Call pollTaskOutputs (wY4)                                          │
│     • Read output file deltas                                           │
│     • Check task states                                                 │
│  3. Call getUnretrievedTaskStatuses (Nqq)                               │
│     • For completed/failed/killed: generate task_status                 │
│  4. Apply frequency throttle (3 turns)                                  │
│  5. Update outputOffset for each task (OY4)                             │
│  6. Return attachments array wrapped by f4                              │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Attachment Injection                                  │
│                                                                          │
│  { type: "attachment", attachment: { type: "task_status" |              │
│    "task_progress", taskId, ... } }                                     │
│                                                                          │
│  Injected into conversation context as system-reminder message          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Attachment Types

### task_status Attachment

**When generated:** Task status changes from "running" to "completed", "failed", or "killed".

**Structure:**
```xml
<system-reminder>
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase for API usage</description>
  <delta_summary>Found 15 occurrences in 8 files...</delta_summary>
</task_status>
</system-reminder>
```

**Key insight:** The `delta_summary` contains only new output since the last notification, using `readOutputFileDelta(task.id, task.outputOffset)`.

### task_progress Attachment

**When generated:** Task is running and frequency throttle is satisfied (≥3 turns since last progress).

**Structure:**
```xml
<system-reminder>
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running npm install...</message>
</task_progress>
</system-reminder>
```

---

## Progress Throttling Algorithm

### What it does

Limits the frequency of progress notifications to avoid noise while keeping users informed.

### Implementation

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Progress frequency calculator
// Location: chunks.144.mjs:832
// ============================================

// READABLE (for understanding):
const PROGRESS_THROTTLE_TURNS = 3;

function countTurnsSinceLastProgress(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }

    return turnsSinceProgress;
}

function shouldShowProgress(taskId, messages) {
    let turnsMap = countTurnsSinceLastProgress(messages);
    let turnsSinceProgress = turnsMap.get(taskId);

    // If never shown before (infinity), always show
    if (turnsSinceProgress === undefined) return true;

    // Show if >= PROGRESS_THROTTLE_TURNS since last progress
    return turnsSinceProgress >= PROGRESS_THROTTLE_TURNS;
}
```

### Why this approach

**Backwards iteration:**
- Efficiently finds most recent progress
- No need to scan entire history
- O(n) where n = messages since last progress

**3-turn threshold:**
- Balances informativeness with noise
- 3 turns ≈ 15-30 seconds typical
- Prevents notification spam

**Per-task tracking:**
- Each task has independent throttle
- Fast task doesn't block slow task's updates

---

## System Message Emission

### emitSystemMessage (c36)

```javascript
// ============================================
// c36 - emitSystemMessage - Emit system message for events
// Location: various files
// ============================================

// READABLE (for understanding):
function emitSystemMessage(message) {
    // Message structure:
    // {
    //     type: "system",
    //     subtype: "task_started" | "task_progress" | "task_notification",
    //     task_id: "...",
    //     ...
    // }

    // Inject into message queue
    messageQueue.push(message);
}
```

### Task Event Types

| Subtype | When Emitted | Fields |
|---------|--------------|--------|
| `task_started` | Task created | task_id, tool_use_id, description, task_type, prompt |
| `task_progress` | Progress update | task_id, tool_use_id, description, usage (tokens, tool_uses, duration) |
| `task_notification` | Completion/kill | task_id, status, description |

---

## Integration with Task State

### State Update Flow

```
Task created (Zf)
    │
    ├── emitSystemMessage({ type: "system", subtype: "task_started", ... })
    │
    ▼
Task running
    │
    ├── Each turn: updateTaskProgress (nl4)
    │       │
    │       └── emitSystemMessage({ type: "system", subtype: "task_progress", ... })
    │
    ▼
Task completes ($m8 / Hm8 / x66)
    │
    ├── Update state: status → "completed" | "failed" | "killed"
    │
    └── notifyTaskCompletion
            │
            └── addNotification({ mode: "task-notification", value: "..." })
```

### registerTask (Zf)

```javascript
// ============================================
// Zf - registerTask - Register task in state
// Location: chunks.90.mjs:3019-3035
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    })), c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        tool_use_id: A.toolUseId,
        description: A.description,
        task_type: A.type,
        prompt: "prompt" in A ? A.prompt : void 0
    })
}

// READABLE (for understanding):
function registerTask(task, setAppState) {
    // Add task to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [task.id]: task
        }
    }));

    // Emit system message for UI/notification
    emitSystemMessage({
        type: "system",
        subtype: "task_started",
        task_id: task.id,
        tool_use_id: task.toolUseId,
        description: task.description,
        task_type: task.type,
        prompt: "prompt" in task ? task.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→task, q→setAppState, c36→emitSystemMessage
```

---

## Cross-Feature Integration

### With Hooks (11_hooks)

Subagent execution triggers hooks at key lifecycle points:

| Hook Event | When Triggered | Parameters |
|------------|----------------|------------|
| `SubagentStart` | Agent spawned | agentId, prompt, isBackground |
| `SubagentEnd` | Agent completes | agentId, result, status |
| `PreToolUse` | Before tool call | toolName, input, context |
| `PostToolUse` | After tool call | toolName, input, output |

### With Compact (07_compact)

Task state is preserved across compactions:

```javascript
// ============================================
// Transcript filtering for background tasks
// ============================================

// READABLE (for understanding):
function filterMessagesForCompaction(messages, tasks) {
    return messages.filter((message) => {
        // Keep task_notification messages - they're important state
        if (message.type === "system" && message.subtype === "task_notification") {
            return true;
        }

        // Keep task_status/task_progress attachments
        if (message.type === "attachment" &&
            (message.attachment.type === "task_status" ||
             message.attachment.type === "task_progress")) {
            return true;
        }

        // Normal filtering for other messages
        return shouldKeepMessage(message);
    });
}
```

**Output files are NOT compacted:**
- Persist independently in `~/.claude/tasks/*.output`
- Can be read at any time via `TaskOutput` tool

### With Agent Teams (30_agent_teams)

Teammate agents use same task infrastructure:

```javascript
// Teammate task creation
let task = {
    ...createTaskRecord(taskId, "in_process_teammate", config.description),
    type: "in_process_teammate",
    status: "running",
    teamContext: config.teamContext,
    abortController: createAbortController()
};
```

**Teammate-specific attachments:**
- Team context mailbox messages
- Plan approval requests/responses
- Idle notifications

---

## Notification Queue Processing

### Main Loop Handling

```javascript
// In main agent loop (Yh)

// Read pending task notifications
let pendingNotifications = readPendingNotifications();

for (let notification of pendingNotifications) {
    if (notification.mode === "task-notification") {
        // Display to user
        displayNotification(notification.value);
    }
}
```

### Notification Modes

| Mode | Display Behavior |
|------|-----------------|
| `task-notification` | Inline in message stream |
| `error` | Error banner overlay |
| `warning` | Warning message overlay |
| `prompt` | User input required |

---

## Design Decisions

### Why Separate task_status and task_progress?

**task_status (terminal states):**
- Always shown immediately
- Includes output delta
- Marks task as notified

**task_progress (running states):**
- Throttled to prevent noise
- Brief status message only
- Does not mark task as notified

**Rationale:** Users need immediate feedback when tasks complete, but don't want to see every incremental progress update. The 3-turn throttle balances informativeness with noise.

### Why File-Based Output?

1. **Persistence:** Output survives crashes/restarts
2. **Incremental reads:** LLM can check progress without blocking
3. **Simple API:** Standard file operations, no special protocols

### Why AbortController for Cancellation?

1. **Cooperative:** Agent checks signal between turns
2. **Graceful:** In-progress tool calls complete
3. **Hierarchical:** Parent abort triggers child abort
4. **Standard:** Uses web-standard API

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `c36` | emitSystemMessage | various | ✓ Verified |
| `TIY` | countTurnsSinceLastProgress | chunks.144.mjs:832 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - State machine
- [system_reminder_producers_complete.md](../26_background_agents/system_reminder_producers_complete.md) - Attachment producers
- [feature_interconnections.md](./feature_interconnections.md) - Full integration analysis
- [../04_system_reminder/](../04_system_reminder/) - System reminder module