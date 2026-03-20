# Task System (Module 13)

> **Version**: Claude Code v2.1.76
> **Status**: REFACTORED from Todo List (v2.1.7)
> **Purpose**: Structured task tracking with dependency management for multi-agent coordination

## Quick Links

| Document | Description |
|----------|-------------|
| [implementation.md](./implementation.md) | Core implementation, tool definitions, data model |
| [workflow.md](./workflow.md) | State machine, transitions, validation, lifecycle |
| [graph_implementation.md](./graph_implementation.md) | Dependency graph, DAG structure, algorithms |
| [team_integration.md](./team_integration.md) | Multi-agent coordination, claiming, notifications |
| [tools_integration.md](./tools_integration.md) | Hooks, Cron, Compact, UI, Memory integration |

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