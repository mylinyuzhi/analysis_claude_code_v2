# Task System - Tools Integration

## Module Overview

This document analyzes how the Task System integrates with other Claude Code components: Hooks, Cron/Loop system, Compact, and UI state management.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task system symbols
> - [11_hooks/](../11_hooks/) - Full hooks system analysis

Key functions in this document:
- `executeTaskCompletedHooks` (Hi6) - Run hooks before task completion
- `getTaskCompletedHookMessage` ($i6) - Format hook error messages
- `CronCreate` (ER) - Create scheduled prompts (can create tasks)
- `TaskList` (it) - List tasks for UI and agent

---

## 1. TaskCompleted Hook Integration

### 1.1 Hook Execution Flow

The `TaskCompleted` hook is the primary integration point between the task system and external validation logic.

```
┌─────────────────────────────────────────────────────────────────┐
│              TASKCOMPLETED HOOK EXECUTION FLOW                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TaskUpdate({ status: "completed" })                            │
│           │                                                      │
│           ▼                                                      │
│  ┌────────────────────────────────────────┐                     │
│  │ Hi6 = executeTaskCompletedHooks()      │                     │
│  │ - Build hook event payload             │                     │
│  │ - Execute all registered hooks         │                     │
│  │ - Collect blockingError results        │                     │
│  └─────────────────┬──────────────────────┘                     │
│                    │                                             │
│           ┌───────▼───────┐                                      │
│           │ Any errors?   │                                      │
│           └───────┬───────┘                                      │
│                   │                                              │
│        ┌──────────┴──────────┐                                   │
│        │                     │                                   │
│     YES │                     │ NO                               │
│        ▼                     ▼                                   │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │ Return error │    │ Update status│                           │
│  │ Task stays   │    │ to completed │                           │
│  │ in_progress  │    │ Persist to   │                           │
│  └──────────────┘    │ disk         │                           │
│                      └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Hook Event Payload

// ============================================
// executeTaskCompletedHooks - Run validation before completion
// Location: chunks.175.mjs:2594-2608
// ============================================

// ORIGINAL (for source lookup):
async function* Hi6(A, q, K, Y, z, _, w, O = T$, $) {
    let H = {
        ...$w(_),
        hook_event_name: "TaskCompleted",
        task_id: A,
        task_subject: q,
        task_description: K,
        teammate_name: Y,
        team_name: z,
        // ... additional context
    };
    // Execute hooks and yield results
    for (const hook of registeredHooks) {
        const result = await executeHook(hook, H);
        yield result;
    }
}

// READABLE (for understanding):
async function* executeTaskCompletedHooks(
    taskId,
    taskSubject,
    taskDescription,
    teammateName,
    teamName,
    // ... additional context
) {
    // Build hook event payload
    const hookEvent = {
        ...getBaseHookContext(),
        hook_event_name: "TaskCompleted",
        task_id: taskId,
        task_subject: taskSubject,
        task_description: taskDescription,
        teammate_name: teammateName,
        team_name: teamName
    };

    // Execute all registered TaskCompleted hooks
    for (const hook of getRegisteredHooks("TaskCompleted")) {
        const result = await executeHook(hook, hookEvent);
        yield result;  // Can contain: { blockingError: string } or {}
    }
}

// Mapping: Hi6→executeTaskCompletedHooks, A→taskId, q→taskSubject, K→taskDescription,
//          Y→teammateName, z→teamName, $w→getBaseHookContext

### 1.3 Hook Schema Definition

**Location**: chunks.131.mjs:2419

```javascript
// TaskCompleted hook event schema
const TaskCompletedHookSchema = zod.object({
    hook_event_name: zod.literal("TaskCompleted"),
    task_id: zod.string(),
    task_subject: zod.string(),
    task_description: zod.string().optional(),
    teammate_name: zod.string(),
    team_name: zod.string()
});
```

### 1.4 Hook Result Handling

// ============================================
// getTaskCompletedHookMessage - Format error for display
// Location: chunks.175.mjs:1602-1604
// ============================================

// ORIGINAL (for source lookup):
function $i6(A) {
    return `TaskCompleted hook feedback:
${A.blockingError}`
}

// READABLE (for understanding):
function getTaskCompletedHookMessage(errorResult) {
    return `TaskCompleted hook feedback:
${errorResult.blockingError}`;
}

// Mapping: $i6→getTaskCompletedHookMessage, A→errorResult

---

## 2. Cron/Loop System Integration

### 2.1 Relationship Overview

The Cron/Loop system (added in v2.1.71) provides scheduled prompt execution. While not directly part of the task system, it can trigger task creation.

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `CronCreate` | ER | Create recurring or one-shot scheduled prompt |
| `CronDelete` | ed | Cancel a scheduled job |
| `CronList` | SW6 | List all active cron jobs |

**Location**: chunks.91.mjs:192-196

```javascript
// Cron tool name constants
ER = "CronCreate"   // Create scheduled job
ed = "CronDelete"   // Delete scheduled job
SW6 = "CronList"    // List all jobs
```

### 2.2 Task Creation via Scheduled Prompts

A scheduled prompt can include instructions to create tasks:

```javascript
// Example: Daily task creation via cron
await CronCreate({
    cron: "0 9 * * 1-5",  // 9am on weekdays
    prompt: "Review the project's open issues and create tasks for any critical bugs found."
});
```

**Key insight**: The Cron system is session-only (jobs don't persist across Claude sessions) and fires when the REPL is idle. This makes it suitable for periodic task creation prompts.

---

## 3. Compact System Integration

### 3.1 Task Persistence Across Compaction

The task system stores data in `~/.claude/tasks/` which is separate from the conversation transcript. This means:

1. **Tasks survive compaction**: Task files are not affected by transcript compaction
2. **Task context is preserved**: Dependencies and ownership remain intact
3. **Task state is persistent**: Status changes are immediately written to disk

### 3.2 Memory Considerations

When the conversation is compacted:
- Task IDs and summaries may be included in the compaction summary
- The agent should use `TaskList` to re-discover tasks after compaction
- Task metadata can store context that would otherwise be lost

**Best practice**: Include task status updates in the compaction summary so the agent knows which tasks are active.

---

## 4. UI State Management

### 4.1 Expanded View Trigger

When certain tools are called, the UI can expand to show relevant content.

```javascript
// Task tool calls trigger UI expansion
const taskTools = ["TaskCreate", "TaskGet", "TaskList", "TaskUpdate"];

// UI behavior
if (taskTools.includes(toolName)) {
    // Optionally expand task view
    setExpandedView("tasks");
}
```

### 4.2 Task List in UI

The `TaskList` tool provides a summary view that's displayed in the UI:

```javascript
// TaskList output schema
{
    tasks: [{
        id: string,
        subject: string,
        status: "pending" | "in_progress" | "completed",
        owner: string | undefined,
        blockedBy: string[]  // Only non-completed blockers
    }]
}
```

**Key feature**: The `blockedBy` array is filtered to only show non-completed tasks, making the UI cleaner.

---

## 5. Memory System Integration

### 5.1 Task Metadata

Tasks can store arbitrary metadata that integrates with the memory system:

```javascript
// Create task with memory-related metadata
await TaskCreate({
    subject: "Implement feature X",
    description: "...",
    metadata: {
        relatedMemory: "memory://user-preferences/theme",
        contextId: "session-123",
        priority: "high"
    }
});
```

### 5.2 Cross-Session Context

The task directory structure supports team-based isolation:

```
~/.claude/tasks/
├── {team-name}/          # Team tasks
│   ├── 1.json
│   ├── 2.json
│   └── .highwatermark
├── {agent-id}/           # Solo agent tasks
│   └── 1.json
└── {memory-context-id}/  # Memory-linked tasks
    └── 1.json
```

---

## 6. Hook Event Catalog Integration

The TaskCompleted hook is registered in the hook events catalog:

| Event Name | Trigger | Can Block | Payload Fields |
|------------|---------|-----------|----------------|
| `TaskCompleted` | TaskUpdate(status: "completed") | Yes | task_id, task_subject, task_description, teammate_name, team_name |

**Hook configuration example**:

```json
{
    "hooks": {
        "TaskCompleted": [
            {
                "command": "run-tests.sh",
                "timeout": 30000
            }
        ]
    }
}
```

---

## Summary

The Task System integrates with multiple Claude Code subsystems:

| Integration | Purpose | Key Functions |
|-------------|---------|---------------|
| **Hooks** | Pre-completion validation | `Hi6`, `$i6` |
| **Cron** | Scheduled task creation | `ER`, `ed`, `SW6` |
| **Compact** | Task persistence | File-based storage |
| **UI** | Task visualization | `TaskList` output |
| **Memory** | Metadata storage | `metadata` field |

**Key architectural decisions**:
1. **Hook-based validation** allows custom completion checks without modifying core code
2. **File-based storage** ensures task data survives compaction
3. **Team-isolated directories** support multi-agent coordination
4. **Metadata field** provides extensibility for integrations