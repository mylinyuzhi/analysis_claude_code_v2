# Task System UI Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of task list UI rendering, status indicators, dependency visualization, and React component hierarchy.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `expandedView: "tasks"` - UI state for task view
- Task status rendering with React components

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TASK SYSTEM UI ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Task Tools Interface                        │  │
│  │  TaskCreate | TaskUpdate | TaskGet | TaskList | TodoWrite     │  │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                           │                                          │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │                  Core Async Functions                          │  │
│  │  jf=getTaskManager | aD1=createTask | DB=loadTask             │  │
│  │  WI=updateTask | sD1=deleteTask | DX=loadAllTasks             │  │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                           │                                          │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │                    UI Rendering Layer                          │  │
│  │                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │ TaskListView                                             │   │  │
│  │  │ ├─ TaskHeader (count, add button)                       │   │  │
│  │  │ ├─ TaskList                                              │   │  │
│  │  │ │   ├─ TaskItem (each task)                             │   │  │
│  │  │ │   │   ├─ StatusIndicator (○ ● ✓)                      │   │  │
│  │  │ │   │   ├─ TaskSubject (title)                          │   │  │
│  │  │ │   │   ├─ TaskOwner (agent badge)                      │   │  │
│  │  │ │   │   └─ DependencyList (blocked by)                  │   │  │
│  │  │ │   └─ ...                                              │   │  │
│  │  │ └─ TaskFooter (summary)                                 │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## UI Components

### Task List View

```
┌─────────────────────────────────────────────────────────────────────┐
│ TASKS (4 total, 1 in progress)                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ✓ [1] Design database schema                                         │
│    └─ Owner: agent-1 | Completed                                     │
│                                                                       │
│ ● [2] Implement API endpoints                                        │
│    └─ Owner: agent-2 | In Progress                                   │
│    └─ Was blocked by: [1] ✓                                          │
│                                                                       │
│ ○ [3] Write unit tests                                               │
│    └─ Status: Pending                                                │
│    └─ Blocked by: [1] ✓, [2] ● (in progress)                         │
│                                                                       │
│ ○ [4] Integration testing                                            │
│    └─ Status: Pending                                                │
│    └─ Blocked by: [2], [3]                                           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Status Indicators

| Symbol | Status | Description | Color |
|--------|--------|-------------|-------|
| ○ | pending | Not yet started | gray |
| ● | in_progress | Currently being worked on | blue (animated) |
| ✓ | completed | Successfully finished | green |
| ✗ | error/deleted | Failed or removed | red |

---

## React Component Hierarchy

### TaskListView Component

```javascript
// ============================================
// TaskListView - Main task list container
// Location: chunks.193.mjs (REPL component integration)
// ============================================

// READABLE (for understanding):
function TaskListView({ tasks, expandedView, selectedTaskId, onSelectTask }) {
    const theme = useTheme();

    // Count by status
    const pendingCount = tasks.filter(t => t.status === "pending").length;
    const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
    const completedCount = tasks.filter(t => t.status === "completed").length;

    if (expandedView !== "tasks") return null;

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="cyan">
            {/* Header */}
            <Box>
                <Text bold color="cyan">TASKS</Text>
                <Text dimColor>
                    {" "}({tasks.length} total, {inProgressCount} in progress)
                </Text>
            </Box>

            {/* Task list */}
            <Box flexDirection="column">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        allTasks={tasks}
                        isSelected={selectedTaskId === task.id}
                        onSelect={() => onSelectTask(task.id)}
                    />
                ))}
            </Box>

            {/* Footer summary */}
            <Box>
                <Text dimColor>
                    ✓ {completedCount} completed | ● {inProgressCount} active | ○ {pendingCount} pending
                </Text>
            </Box>
        </Box>
    );
}
```

### TaskItem Component

```javascript
// ============================================
// TaskItem - Individual task rendering
// ============================================

// READABLE (for understanding):
function TaskItem({ task, allTasks, isSelected, onSelect }) {
    const theme = useTheme();

    // Get status icon and color
    const statusConfig = getStatusConfig(task.status);

    // Get blocking tasks
    const blockingTasks = task.blockedBy.map(id =>
        allTasks.find(t => t.id === id)
    ).filter(Boolean);

    return (
        <Box
            flexDirection="column"
            borderStyle={isSelected ? "bold" : undefined}
            borderColor={isSelected ? "yellow" : undefined}
            onClick={onSelect}
        >
            {/* Main row: status + id + subject */}
            <Box flexDirection="row">
                <Text color={statusConfig.color}>
                    {statusConfig.icon}
                </Text>
                <Text> [{task.id}] </Text>
                <Text bold={task.status === "in_progress"}>
                    {task.subject}
                </Text>
            </Box>

            {/* Details row */}
            <Box marginLeft={3}>
                {/* Owner */}
                {task.owner && (
                    <Text dimColor>
                        Owner: <Text color="magenta">{task.owner}</Text>
                        {" | "}
                    </Text>
                )}

                {/* Status */}
                <Text dimColor>
                    Status: <Text color={statusConfig.color}>{task.status}</Text>
                </Text>
            </Box>

            {/* Dependencies row */}
            {blockingTasks.length > 0 && (
                <Box marginLeft={3}>
                    <Text dimColor>
                        Blocked by: {blockingTasks.map(t => (
                            <Text key={t.id}>
                                [{t.id}]
                                <Text color={getStatusConfig(t.status).color}>
                                    {getStatusConfig(t.status).icon}
                                </Text>
                                {" "}
                            </Text>
                        ))}
                    </Text>
                </Box>
            )}

            {/* Active form (spinner text) */}
            {task.status === "in_progress" && task.activeForm && (
                <Box marginLeft={3}>
                    <Text dimColor>
                        <Spinner /> {task.activeForm}
                    </Text>
                </Box>
            )}
        </Box>
    );
}

function getStatusConfig(status) {
    switch (status) {
        case "pending":
            return { icon: "○", color: "gray" };
        case "in_progress":
            return { icon: "●", color: "blue" };
        case "completed":
            return { icon: "✓", color: "green" };
        default:
            return { icon: "?", color: "yellow" };
    }
}
```

---

## State Management

### UI State Slice

```javascript
// Task UI state in REPL component
{
    tasks: {
        tasks: Task[],             // Loaded task list
        expandedView: "tasks" | null,  // Current expanded view
        selectedTaskId: string | null, // Focused task
        isLoading: boolean,        // Loading state
        error: string | null       // Error message
    }
}
```

### Task Schema (Full)

```javascript
// ============================================
// Task schema with UI-relevant fields
// Location: chunks.84.mjs
// ============================================

const taskSchema = z.object({
    id: z.string(),              // Auto-increment integer as string
    subject: z.string(),         // Brief title (required)
    description: z.string(),     // Detailed requirements (required)
    activeForm: z.string().optional(),  // Present continuous status for UI spinner
    status: z.enum(["pending", "in_progress", "completed"]),
    owner: z.string().optional(),  // Agent name who owns this task
    blocks: z.array(z.string()),   // Task IDs waiting for this task
    blockedBy: z.array(z.string()), // Task IDs this task is waiting for
    metadata: z.record(z.unknown()).optional()  // Arbitrary key-value pairs
});
```

---

## Dependency Graph Visualization

### Dependency Status Rendering

```javascript
// ============================================
// Dependency status display logic
// ============================================

// READABLE (for understanding):
function renderDependencyStatus(blockedByIds, allTasks) {
    return blockedByIds.map(id => {
        const task = allTasks.find(t => t.id === id);
        if (!task) return { id, status: "unknown", icon: "?" };

        const config = getStatusConfig(task.status);
        return {
            id,
            status: task.status,
            icon: config.icon,
            color: config.color,
            isBlocking: task.status !== "completed"
        };
    });
}

// Check if task can be started
function canStartTask(task, allTasks) {
    return task.blockedBy.every(blockingId => {
        const blockingTask = allTasks.find(t => t.id === blockingId);
        return blockingTask?.status === "completed";
    });
}

// Render blocked indicator
function renderBlockedIndicator(task, allTasks) {
    const dependencies = renderDependencyStatus(task.blockedBy, allTasks);
    const incompleteDeps = dependencies.filter(d => d.isBlocking);

    if (incompleteDeps.length === 0) {
        return <Text color="green">All dependencies complete</Text>;
    }

    return (
        <Box>
            <Text color="yellow">Blocked by: </Text>
            {incompleteDeps.map(d => (
                <Text key={d.id} color={d.color}>
                    [{d.id}]{d.icon}{" "}
                </Text>
            ))}
        </Box>
    );
}
```

### Dependency Graph (ASCII Visualization)

```
Task Dependency Graph:

[1] Design schema ──────────────────┐
    Status: ✓                        │
                                     │ blocks
                                     ▼
[2] Implement APIs ─────────────────┼──┐
    Status: ● (in progress)          │  │
                                     │  │ blocks
                                     │  ▼
[3] Unit tests ─────────────────────┘  │
    Status: ○                           │
    Blocked by: [1]✓, [2]●             │
                                        │ blocks
                                        ▼
[4] Integration tests ─────────────────┘
    Status: ○
    Blocked by: [2], [3]
```

---

## Task Tool Output Rendering

### TaskCreate Result

```javascript
// ============================================
// TaskCreate tool result rendering
// Location: chunks.141.mjs
// ============================================

// READABLE (for understanding):
function renderTaskCreateResult(taskId, task) {
    return (
        <Box flexDirection="column">
            <Text color="green">✓ Task created: [{taskId}]</Text>
            <Box marginLeft={2}>
                <Text bold>{task.subject}</Text>
            </Box>
            {task.blockedBy.length > 0 && (
                <Box marginLeft={2}>
                    <Text dimColor>
                        Dependencies: {task.blockedBy.join(", ")}
                    </Text>
                </Box>
            )}
        </Box>
    );
}
```

### TaskUpdate Result

```javascript
// ============================================
// TaskUpdate tool result rendering
// ============================================

function renderTaskUpdateResult(taskId, updates) {
    const statusChange = updates.status ? (
        <Text>
            Status: <Text dimColor>{updates.status}</Text>
        </Text>
    ) : null;

    return (
        <Box flexDirection="column">
            <Text color="blue">↻ Task updated: [{taskId}]</Text>
            {statusChange && <Box marginLeft={2}>{statusChange}</Box>}
        </Box>
    );
}
```

---

## Integration Points

### Task System ↔ REPL (02)

- Task list displayed in expanded view
- Real-time updates via state subscription
- Keyboard navigation between tasks

### Task System ↔ Tools (05)

- Task tools: TaskCreate, TaskUpdate, TaskGet, TaskList
- Tool output renders task status changes

### Task System ↔ System Reminder (04)

- Task status changes generate `task_status` attachments
- Dependency resolution updates in context
- Owner assignment shows agent association

### Task System ↔ Hooks (11)

- `TaskCompleted` hooks run before task can be marked complete
- `executeTaskCompletedHooks` (Hi6) validates completion

### Task System ↔ Agent Teams (30)

- Team-isolated task storage
- Claim validation for multi-agent coordination
- Owner assignment from teammate context

---

## Cross-Feature Integration with System Reminder

### Task Status Attachment Types

```javascript
// Task status change attachment
{
    type: "attachment",
    attachment: {
        type: "task_status",
        taskId: "1",
        previousStatus: "pending",
        newStatus: "in_progress",
        owner: "agent-1",
        timestamp: "2024-01-15T10:30:00Z"
    }
}

// Dependency resolved attachment
{
    type: "attachment",
    attachment: {
        type: "dependency_resolved",
        taskId: "3",
        blockingTaskId: "1",
        timestamp: "2024-01-15T11:00:00Z"
    }
}
```

---

## Quick Reference

### Status Colors

| Status | Icon | Color | ANSI Code |
|--------|------|-------|-----------|
| pending | ○ | gray | `\x1b[90m` |
| in_progress | ● | blue | `\x1b[34m` |
| completed | ✓ | green | `\x1b[32m` |

### UI State Flags

```javascript
expandedView: "tasks"  // Show task list
selectedTaskId: "1"    // Focused task
isLoading: false       // Loading state
```

### Key Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| jf | getTaskManager | Resolve task list ID |
| DX | loadAllTasks | Load all tasks for UI |
| Hi6 | executeTaskCompletedHooks | Validate completion |
| OT8 | claimTask | Claim task with validation |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Dependency visualization, active form spinner |
| 2.1.32 | Team task display, owner badges |
| 2.1.7 | Initial task UI with status indicators |