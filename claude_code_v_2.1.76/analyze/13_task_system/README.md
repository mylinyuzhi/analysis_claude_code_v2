# Task System (Module 13)

> **Version**: Claude Code v2.1.76
> **Status**: REFACTORED from Todo List (v2.1.7)
> **Purpose**: Structured task tracking with dependency management for multi-agent coordination

## Quick Links

| Document | Description |
|----------|-------------|
| [task_core_functions_source_restoration.md](./task_core_functions_source_restoration.md) | **NEW** - Complete source restoration with ORIGINAL/READABLE code |
| [task_locking_complete.md](./task_locking_complete.md) | **NEW** - File locking, concurrency control, atomic operations |
| [task_dependency_resolution_complete.md](./task_dependency_resolution_complete.md) | Complete dependency graph, high-watermark, and claim logic |
| [task_reminder_integration.md](./task_reminder_integration.md) | Task ↔ System Reminder integration, attachment types |
| [implementation.md](./implementation.md) | Core implementation, tool definitions, data model |
| [workflow.md](./workflow.md) | State machine, transitions, validation, lifecycle |
| [graph_implementation.md](./graph_implementation.md) | Dependency graph, DAG structure, algorithms |
| [dependency_graph_algorithm.md](./dependency_graph_algorithm.md) | Complete dependency graph analysis |
| [high_watermark_algorithm.md](./high_watermark_algorithm.md) | ID auto-increment and watermark tracking |
| [team_integration.md](./team_integration.md) | Multi-agent coordination, claiming, notifications |
| [tools_integration.md](./tools_integration.md) | Hooks, Cron, Compact, UI, Memory integration |
| [task_ui_complete.md](./task_ui_complete.md) | Task list UI rendering and visualization |
| [task_hooks_complete.md](./task_hooks_complete.md) | TaskCompleted hooks for validation |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TASK SYSTEM ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Agent Interface                         │  │
│  │  TaskCreate │ TaskUpdate │ TaskGet │ TaskList             │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │                 Core Functions (Async)                     │  │
│  │  jf=getTaskManager │ aD1=createTask │ DB=loadTask          │  │
│  │  WI=updateTask │ sD1=deleteTask │ DX=loadAllTasks          │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │              Storage Layer (~/.claude/tasks/)              │  │
│  │  ├── {team-name}/           # Team-isolated tasks          │  │
│  │  │   ├── 1.json            # Task file                    │  │
│  │  │   ├── 2.json                                            │  │
│  │  │   ├── .highwatermark    # Max ID tracking               │  │
│  │  │   └── .lock             # Concurrency control           │  │
│  │  └── {agent-id}/           # Solo agent tasks              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Integration Points                         │  │
│  │  • TaskCompleted Hooks (Hi6) - Pre-completion validation  │  │
│  │  • Team Messaging - Assignment notifications               │  │
│  │  • UI State - expandedView: "tasks"                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Functions

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `getTaskManager` | `jf` | Resolve task list ID from team/agent context |
| `createTask` | `aD1` | Atomically create task with auto-increment ID |
| `loadTask` | `DB` | Load and validate task from disk |
| `updateTask` | `WI` | Update task with validation and persistence |
| `deleteTask` | `sD1` | Delete task and clean all dependency references |
| `loadAllTasks` | `DX` | Load all tasks for listing/dependency checks |
| `claimTask` | `OT8` | Async claim with lock and validation |
| `claimTaskWithAgentBusyValidation` | `$N9` | Claim with agent busy check |
| `unassignTeammateTasks` | `ft` | Cleanup tasks when agent shuts down |
| `isTaskSystemEnabled` | `r$` | Check if structured tasks are enabled |

## Task Schema

```javascript
{
  id: string,              // Auto-increment integer as string
  subject: string,         // Brief title (required)
  description: string,     // Detailed requirements (required)
  activeForm?: string,     // Present continuous status for UI spinner
  status: "pending" | "in_progress" | "completed",
  owner?: string,          // Agent name who owns this task
  blocks: string[],        // Task IDs waiting for this task
  blockedBy: string[],     // Task IDs this task is waiting for
  metadata?: Record<string, unknown>  // Arbitrary key-value pairs
}
```

## State Machine

```
┌──────────┐     TaskUpdate(status: "in_progress")     ┌──────────────┐
│ PENDING  │ ─────────────────────────────────────────▶│ IN_PROGRESS  │
└──────────┘                                            └──────┬───────┘
     │                                                         │
     │                    TaskUpdate(status: "completed")      │
     │                   + Hook validation passes              │
     │                                                         │
     │                    ┌──────────┐                         │
     └───────────────────▶│COMPLETED │◀────────────────────────┘
                          └──────────┘

     Any state + TaskUpdate(status: "deleted")
                          ┌──────────┐
                          │ DELETED  │ (File removed, dependencies cleaned)
                          └──────────┘
```

## Related Symbols

> Full symbol mappings: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md#module-task-system)

- Tool names: `TR` (TaskCreate), `ck` (TaskUpdate), `lt` (TaskGet), `it` (TaskList)
- Core async functions: `jf`, `aD1`, `DB`, `WI`, `sD1`, `DX`, `OT8`, `$N9`, `ft`
- Hooks: `Hi6` (executeTaskCompletedHooks), `$i6` (getTaskCompletedHookMessage)
- Lock configuration: `nD1` (lockOptions: retries=10, minTimeout=5ms, maxTimeout=100ms)

## Key Design Decisions

1. **Team-Isolated Storage**: Each team gets its own task directory under `~/.claude/tasks/{team-name}/`
2. **Async I/O with Locking**: File operations use proper locking to prevent race conditions
3. **Hook-Based Validation**: Completion validation is extensible via `TaskCompleted` hooks
4. **Auto-Increment IDs**: Simpler than UUIDs for task ordering and dependency management
5. **Dependency Graph**: `blocks`/`blockedBy` arrays enable DAG-based workflow orchestration

## Usage Example

```javascript
// Create task
const taskId = await createTask(taskManager, {
  subject: "Implement login UI",
  description: "Create React components for login form",
  status: "pending"
});

// Set dependencies
await updateTask(taskManager, taskId, {
  addBlockedBy: ["1"]  // This task depends on task #1
});

// Start working (auto-assigns owner in team mode)
await updateTask(taskManager, taskId, {
  status: "in_progress"
});

// Mark complete (runs TaskCompleted hooks)
await updateTask(taskManager, taskId, {
  status: "completed"
});
```

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code. Key validated symbols:

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| jf (getTaskManager) | chunks.84.mjs:1619 | ✅ Correct |
| aD1 (createTask) | chunks.84.mjs:1669 | ✅ Correct |
| DB (loadTask) | chunks.84.mjs:1687 | ✅ Correct |
| WI (updateTask) | chunks.84.mjs:1701 | ✅ Correct |
| sD1 (deleteTask) | chunks.84.mjs:1713 | ✅ Correct |
| DX (loadAllTasks) | chunks.84.mjs:1742 | ✅ Correct |
| OT8 (claimTask) | chunks.84.mjs:1781 | ✅ Correct |
| P84 (writeHighWaterMark) | chunks.84.mjs:1580 | ✅ Correct |
| zT8 (readHighWaterMarkFile) | chunks.84.mjs:1569 | ✅ Correct |
| W84 (getMaxTaskIdFromFiles) | chunks.84.mjs:1647 | ✅ Correct |
| wN9 (getHighWaterMark) | chunks.84.mjs:1664 | ✅ Correct |
| _N9 (HIGHWATERMARK_FILENAME) | chunks.84.mjs:1914 | ✅ Correct |

---

## Cross-Module Integration

### Task System ↔ System Reminder (04)

Task operations generate the following attachment types:
- `task_status` - Task state changes (create/update/delete)
- `task_claimed` - Task assignment notifications
- `task_completed` - Completion status for dependencies

### Task System ↔ Tools (05)

- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode
- Task operations use file locking for concurrency

### Task System ↔ Hooks (11)

- `TaskCompleted` hooks run before marking complete
- Hook can prevent completion with validation
- `getTaskCompletedHookMessage` generates hook messages

### Task System ↔ Agent Teams (30)

- Team-isolated task storage (`~/.claude/tasks/{team-name}/`)
- `claimTask` with agent busy validation
- `unassignTeammateTasks` on agent shutdown
- Teammate context determines task list ID

### Task System ↔ UI (02)

- Task list visualization in expanded view
- Status indicators (pending/in_progress/completed)
- Dependency graph display
- Owner assignment display