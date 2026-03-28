# Task System UI Components Complete v2 (Claude Code v2.1.76)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Focus**: React component hierarchy, task list visualization, status indicators, dependency graph

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `isTaskSystemEnabled` (r$) - Check feature flag - chunks.84.mjs
- `expandedView: "tasks"` - UI state for task view

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TASK SYSTEM UI ARCHITECTURE                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                          REPL Shell Integration                          │  │
│  │                                                                          │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │                     Main Message Area                            │    │  │
│  │  │                                                                  │    │  │
│  │  │  [Conversation messages...]                                      │    │  │
│  │  │                                                                  │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                          │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │            Expanded View Panel (when expandedView="tasks")       │    │  │
│  │  │                                                                  │    │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐   │    │  │
│  │  │  │ TaskListView                                               │   │    │  │
│  │  │  │ ├─ TaskHeader (count, status summary)                     │   │    │  │
│  │  │  │ ├─ TaskList                                                │   │    │  │
│  │  │  │ │   ├─ TaskItem[0] (pending)                              │   │    │  │
│  │  │  │ │   ├─ TaskItem[1] (in_progress) ◄── selected             │   │    │  │
│  │  │  │ │   └─ TaskItem[2] (completed)                            │   │    │  │
│  │  │  │ └─ TaskFooter (summary, help)                             │   │    │  │
│  │  │  └───────────────────────────────────────────────────────────┘   │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                          │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │                     Input Area                                   │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Task List View Component

### Main Container

```javascript
// ============================================
// TaskListView - Main task list container
// Location: chunks.193.mjs (REPL component integration)
// ============================================

// READABLE (for understanding):
function TaskListView({
    tasks,
    expandedView,
    selectedTaskId,
    onSelectTask,
    onToggleExpand
}) {
    const theme = useTheme();

    // Don't render if not in tasks view
    if (expandedView !== "tasks") {
        return null;
    }

    // Calculate statistics
    const stats = useMemo(() => {
        const pending = tasks.filter(t => t.status === "pending");
        const inProgress = tasks.filter(t => t.status === "in_progress");
        const completed = tasks.filter(t => t.status === "completed");

        return {
            total: tasks.length,
            pending: pending.length,
            inProgress: inProgress.length,
            completed: completed.length,
            blocked: pending.filter(t => t.blockedBy.length > 0).length
        };
    }, [tasks]);

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="cyan"
            paddingX={1}
        >
            {/* Header */}
            <TaskListHeader
                stats={stats}
                onCollapse={() => onToggleExpand(null)}
            />

            {/* Task List */}
            <Box flexDirection="column" marginY={1}>
                {tasks.length === 0 ? (
                    <EmptyTaskList />
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            allTasks={tasks}
                            isSelected={selectedTaskId === task.id}
                            onSelect={() => onSelectTask(task.id)}
                        />
                    ))
                )}
            </Box>

            {/* Footer */}
            <TaskListFooter stats={stats} />
        </Box>
    );
}
```

### Task Header Component

```javascript
// ============================================
// TaskListHeader - Header with statistics
// ============================================

// READABLE (for understanding):
function TaskListHeader({ stats, onCollapse }) {
    return (
        <Box justifyContent="space-between">
            <Box>
                <Text bold color="cyan">TASKS</Text>
                <Text dimColor>
                    {" "}({stats.total} total
                    {stats.inProgress > 0 && `, ${stats.inProgress} in progress`})
                </Text>
            </Box>
            <Box>
                <Text dimColor>
                    [Tab] to focus │ [Esc] to collapse
                </Text>
            </Box>
        </Box>
    );
}
```

---

## 2. Task Item Component

### Individual Task Rendering

```javascript
// ============================================
// TaskItem - Individual task row
// ============================================

// READABLE (for understanding):
function TaskItem({ task, allTasks, isSelected, onSelect }) {
    const theme = useTheme();

    // Get status configuration
    const statusConfig = getStatusConfig(task.status);

    // Get dependency information
    const dependencyInfo = getDependencyInfo(task, allTasks);

    // Check if task is blocked
    const isBlocked = dependencyInfo.blockedByIncomplete.length > 0;

    // Determine border style for selection
    const borderStyle = isSelected ? "bold" : undefined;
    const borderColor = isSelected ? "yellow" : undefined;

    return (
        <Box
            flexDirection="column"
            borderStyle={borderStyle}
            borderColor={borderColor}
            paddingX={1}
            onClick={onSelect}
        >
            {/* Main Row: Status + ID + Subject */}
            <Box>
                {/* Status Icon */}
                <Text color={statusConfig.color}>
                    {statusConfig.icon}
                </Text>

                {/* Task ID */}
                <Text dimColor> [{task.id}] </Text>

                {/* Subject */}
                <Text
                    bold={task.status === "in_progress"}
                    strikethrough={task.status === "completed"}
                    color={task.status === "completed" ? "gray" : undefined}
                >
                    {task.subject}
                </Text>

                {/* Blocked indicator */}
                {isBlocked && task.status === "pending" && (
                    <Text color="yellow"> ⚠</Text>
                )}
            </Box>

            {/* Details Row */}
            <Box marginLeft={3} flexDirection="column">
                {/* Owner */}
                {task.owner && (
                    <Box>
                        <Text dimColor>Owner: </Text>
                        <Text color="magenta">{task.owner}</Text>
                    </Box>
                )}

                {/* Status */}
                <Box>
                    <Text dimColor>Status: </Text>
                    <Text color={statusConfig.color}>
                        {formatStatus(task.status)}
                    </Text>
                </Box>

                {/* Active Form (for in-progress tasks) */}
                {task.status === "in_progress" && task.activeForm && (
                    <Box>
                        <Text dimColor>
                            <Spinner type="dots" /> {task.activeForm}
                        </Text>
                    </Box>
                )}

                {/* Dependencies */}
                {task.blockedBy.length > 0 && (
                    <DependencyList
                        blockedBy={task.blockedBy}
                        allTasks={allTasks}
                    />
                )}
            </Box>
        </Box>
    );
}

// Status configuration
function getStatusConfig(status) {
    switch (status) {
        case "pending":
            return {
                icon: "○",
                color: "gray",
                label: "Pending"
            };
        case "in_progress":
            return {
                icon: "●",
                color: "blue",
                label: "In Progress",
                animate: true
            };
        case "completed":
            return {
                icon: "✓",
                color: "green",
                label: "Completed"
            };
        default:
            return {
                icon: "?",
                color: "yellow",
                label: "Unknown"
            };
    }
}

// Format status for display
function formatStatus(status) {
    switch (status) {
        case "in_progress": return "In Progress";
        case "pending": return "Pending";
        case "completed": return "Completed";
        default: return status;
    }
}
```

---

## 3. Dependency List Component

### Dependency Visualization

```javascript
// ============================================
// DependencyList - Show task dependencies
// ============================================

// READABLE (for understanding):
function DependencyList({ blockedBy, allTasks }) {
    // Get info for each blocking task
    const dependencyStatuses = blockedBy.map(id => {
        const task = allTasks.find(t => t.id === id);
        if (!task) {
            return { id, status: "unknown", icon: "?", color: "yellow" };
        }

        const config = getStatusConfig(task.status);
        return {
            id,
            status: task.status,
            icon: config.icon,
            color: config.color,
            isComplete: task.status === "completed"
        };
    });

    // Check if any dependencies are incomplete
    const hasIncomplete = dependencyStatuses.some(d => !d.isComplete);

    return (
        <Box flexDirection="column">
            <Text dimColor>
                {hasIncomplete ? "Blocked by: " : "Dependencies: "}
            </Text>

            <Box marginLeft={2}>
                {dependencyStatuses.map(dep => (
                    <Box key={dep.id}>
                        <Text dimColor>[{dep.id}]</Text>
                        <Text color={dep.color}>{dep.icon}</Text>
                        <Text> </Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// Get dependency info for task
function getDependencyInfo(task, allTasks) {
    const blockedByTasks = task.blockedBy.map(id =>
        allTasks.find(t => t.id === id)
    ).filter(Boolean);

    const blockedByIncomplete = blockedByTasks.filter(
        t => t.status !== "completed"
    );

    const blockedByComplete = blockedByTasks.filter(
        t => t.status === "completed"
    );

    return {
        blockedByTasks,
        blockedByIncomplete,
        blockedByComplete,
        isBlocked: blockedByIncomplete.length > 0
    };
}
```

---

## 4. Status Indicators

### Visual Status System

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TASK STATUS INDICATORS                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Status: pending                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ○ [1] Design database schema                                            │  │
│  │     Status: Pending                                                       │  │
│  │     Blocked by: [2]●                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Status: in_progress                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ● [2] Implement API endpoints                                           │  │
│  │     Owner: researcher-1                                                  │  │
│  │     Status: In Progress                                                  │  │
│  │     ⠋ Writing API handlers                                               │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Status: completed                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ✓ [3] Write unit tests                                                  │  │
│  │     Owner: researcher-2                                                  │  │
│  │     Status: Completed                                                    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Status Color Mapping

| Status | Icon | Color | ANSI Code | Description |
|--------|------|-------|-----------|-------------|
| pending | ○ | gray | `\x1b[90m` | Not yet started |
| in_progress | ● | blue | `\x1b[34m` | Currently being worked on |
| completed | ✓ | green | `\x1b[32m` | Successfully finished |
| blocked | ⚠ | yellow | `\x1b[33m` | Dependencies not satisfied |

---

## 5. Task Tool Output Rendering

### TaskCreate Result

```javascript
// ============================================
// TaskCreate tool result rendering
// Location: chunks.141.mjs
// ============================================

// READABLE (for understanding):
function renderTaskCreateResult(result, toolUseId) {
    const { taskId, task } = result;

    return {
        type: "tool_result",
        content: `✓ Task created: [${taskId}]

${task.subject}

${task.description}

${task.blockedBy.length > 0
    ? `Dependencies: ${task.blockedBy.map(id => `[${id}]`).join(", ")}\n`
    : ""
}${task.status === "pending" && task.blockedBy.length > 0
    ? "\n⚠ This task is blocked until dependencies complete."
    : ""}`,
        tool_use_id: toolUseId
    };
}
```

### TaskUpdate Result

```javascript
// ============================================
// TaskUpdate tool result rendering
// ============================================

// READABLE (for understanding):
function renderTaskUpdateResult(result, toolUseId) {
    const { taskId, previousStatus, newStatus, owner } = result;

    const statusChange = previousStatus !== newStatus
        ? `${previousStatus} → ${newStatus}`
        : newStatus;

    let content = `↻ Task updated: [${taskId}]\n\nStatus: ${statusChange}`;

    if (owner) {
        content += `\nOwner: ${owner}`;
    }

    if (newStatus === "completed") {
        content += "\n\n✓ Task completed successfully.";
    }

    return {
        type: "tool_result",
        content,
        tool_use_id: toolUseId
    };
}
```

### TaskList Result

```javascript
// ============================================
// TaskList tool result rendering
// ============================================

// READABLE (for understanding):
function renderTaskListResult(tasks, toolUseId) {
    if (tasks.length === 0) {
        return {
            type: "tool_result",
            content: "No tasks found.",
            tool_use_id: toolUseId
        };
    }

    const grouped = {
        pending: tasks.filter(t => t.status === "pending"),
        inProgress: tasks.filter(t => t.status === "in_progress"),
        completed: tasks.filter(t => t.status === "completed")
    };

    let content = `Task List (${tasks.length} total)\n\n`;

    if (grouped.inProgress.length > 0) {
        content += "In Progress:\n";
        for (const task of grouped.inProgress) {
            content += `  ● [${task.id}] ${task.subject}`;
            if (task.owner) content += ` (${task.owner})`;
            content += "\n";
        }
        content += "\n";
    }

    if (grouped.pending.length > 0) {
        content += "Pending:\n";
        for (const task of grouped.pending) {
            const blocked = task.blockedBy.length > 0 ? " ⚠" : "";
            content += `  ○ [${task.id}] ${task.subject}${blocked}\n`;
        }
        content += "\n";
    }

    if (grouped.completed.length > 0) {
        content += "Completed:\n";
        for (const task of grouped.completed) {
            content += `  ✓ [${task.id}] ${task.subject}\n`;
        }
    }

    return {
        type: "tool_result",
        content,
        tool_use_id: toolUseId
    };
}
```

---

## 6. Dependency Graph Visualization

### ASCII Dependency Graph

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        DEPENDENCY GRAPH VISUALIZATION                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Task Dependency Graph:                                                       │
│                                                                                │
│  [1] Design schema                                                            │
│      ✓ Completed                                                              │
│      │                                                                        │
│      │ blocks                                                                 │
│      ▼                                                                        │
│  [2] Implement APIs                                                           │
│      ● In Progress (agent-1)                                                  │
│      │                                                                        │
│      ├─────────────────────┐                                                  │
│      │ blocks              │ blocks                                          │
│      ▼                     ▼                                                  │
│  [3] Unit tests          [4] Integration tests                                │
│      ○ Pending               ○ Pending                                        │
│      Blocked by: [1]✓        Blocked by: [2]●, [3]○                          │
│                                                                                │
│  Legend:                                                                      │
│    ○ Pending   ● In Progress   ✓ Completed                                    │
│    → blocks    ⚠ blocked                                                      │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Dependency Rendering Logic

```javascript
// ============================================
// Dependency Graph Rendering
// ============================================

// READABLE (for understanding):
function renderDependencyGraph(tasks) {
    // Build adjacency list
    const graph = new Map();
    for (const task of tasks) {
        graph.set(task.id, {
            task,
            blockedBy: task.blockedBy,
            blocks: task.blocks
        });
    }

    // Find root tasks (no dependencies)
    const rootTasks = tasks.filter(t => t.blockedBy.length === 0);

    // BFS traversal for rendering
    const visited = new Set();
    const lines = [];

    function renderTask(taskId, indent = 0) {
        if (visited.has(taskId)) return;
        visited.add(taskId);

        const node = graph.get(taskId);
        if (!node) return;

        const { task } = node;
        const prefix = "  ".repeat(indent);
        const statusIcon = getStatusConfig(task.status).icon;

        lines.push(`${prefix}[${task.id}] ${task.subject}`);
        lines.push(`${prefix}    ${statusIcon} ${formatStatus(task.status)}`);

        if (task.owner) {
            lines.push(`${prefix}    Owner: ${task.owner}`);
        }

        // Render blocking tasks
        for (const blockedId of task.blocks) {
            const blockedTask = tasks.find(t => t.id === blockedId);
            if (blockedTask) {
                lines.push(`${prefix}    │`);
                lines.push(`${prefix}    │ blocks`);
                renderTask(blockedId, indent + 1);
            }
        }
    }

    // Render from roots
    for (const rootTask of rootTasks) {
        renderTask(rootTask.id);
        lines.push("");
    }

    return lines.join("\n");
}
```

---

## 7. UI State Management

### State Slice

```javascript
// ============================================
// Task UI State
// Location: REPL component state
// ============================================

const taskUIState = {
    // Task data
    tasks: [],                    // Array of Task objects
    isLoading: false,             // Loading state
    error: null,                  // Error message

    // UI state
    expandedView: null,           // "tasks" | null
    selectedTaskId: null,         // Focused task ID
    filter: "all",                // "all" | "pending" | "in_progress" | "completed"

    // Actions
    loadTasks: async () => { /* ... */ },
    selectTask: (id) => { /* ... */ },
    toggleExpand: () => { /* ... */ },
    updateFilter: (filter) => { /* ... */ }
};
```

### State Transitions

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TASK UI STATE TRANSITIONS                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Initial State                                                                │
│  {                                                                            │
│    tasks: [],                                                                 │
│    expandedView: null,                                                        │
│    selectedTaskId: null,                                                      │
│    isLoading: false                                                           │
│  }                                                                            │
│       │                                                                        │
│       │ TaskList tool called                                                  │
│       ▼                                                                        │
│  Loading State                                                                │
│  {                                                                            │
│    tasks: [],                                                                 │
│    expandedView: null,                                                        │
│    selectedTaskId: null,                                                      │
│    isLoading: true                                                            │
│  }                                                                            │
│       │                                                                        │
│       │ Tasks loaded                                                          │
│       ▼                                                                        │
│  Loaded State                                                                 │
│  {                                                                            │
│    tasks: [Task1, Task2, ...],                                                │
│    expandedView: null,                                                        │
│    selectedTaskId: null,                                                      │
│    isLoading: false                                                           │
│  }                                                                            │
│       │                                                                        │
│       │ User expands view (Tab key or TaskList)                              │
│       ▼                                                                        │
│  Expanded State                                                               │
│  {                                                                            │
│    tasks: [Task1, Task2, ...],                                                │
│    expandedView: "tasks",                                                     │
│    selectedTaskId: "1",                                                       │
│    isLoading: false                                                           │
│  }                                                                            │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Keyboard Navigation

### Navigation Keys

| Key | Action |
|-----|--------|
| `Tab` | Focus/expand task list |
| `↑` / `k` | Select previous task |
| `↓` / `j` | Select next task |
| `Enter` | View task details |
| `Esc` | Collapse task list |
| `f` | Toggle filter |

### Navigation Handler

```javascript
// ============================================
// Task List Keyboard Navigation
// ============================================

// READABLE (for understanding):
function useTaskNavigation(tasks, selectedTaskId, onSelectTask) {
    useEffect(() => {
        const handleKey = (key) => {
            if (tasks.length === 0) return;

            const currentIndex = tasks.findIndex(t => t.id === selectedTaskId);

            switch (key) {
                case "up":
                case "k":
                    if (currentIndex > 0) {
                        onSelectTask(tasks[currentIndex - 1].id);
                    }
                    break;

                case "down":
                case "j":
                    if (currentIndex < tasks.length - 1) {
                        onSelectTask(tasks[currentIndex + 1].id);
                    }
                    break;

                case "home":
                    onSelectTask(tasks[0].id);
                    break;

                case "end":
                    onSelectTask(tasks[tasks.length - 1].id);
                    break;
            }
        };

        // Subscribe to key events
        return subscribeToKeys(handleKey);
    }, [tasks, selectedTaskId, onSelectTask]);
}
```

---

## 9. Empty States

### No Tasks State

```javascript
// ============================================
// EmptyTaskList - Display when no tasks
// ============================================

// READABLE (for understanding):
function EmptyTaskList() {
    return (
        <Box
            flexDirection="column"
            alignItems="center"
            paddingY={2}
        >
            <Text dimColor>No tasks yet.</Text>
            <Text dimColor>
                Use TaskCreate to add a new task.
            </Text>
        </Box>
    );
}
```

### No Matching Tasks State

```javascript
// ============================================
// NoMatchingTasks - Display when filter has no results
// ============================================

// READABLE (for understanding):
function NoMatchingTasks({ filter }) {
    return (
        <Box
            flexDirection="column"
            alignItems="center"
            paddingY={2}
        >
            <Text dimColor>
                No {filter === "all" ? "" : filter} tasks found.
            </Text>
            <Text dimColor>
                Press 'f' to change filter.
            </Text>
        </Box>
    );
}
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Verified |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Verified |
| r$ | isTaskSystemEnabled | chunks.84.mjs | ✅ Verified |
| TR | TOOL_NAME_TASK_CREATE | chunks.90.mjs | ✅ Verified |
| ck | TOOL_NAME_TASK_UPDATE | chunks.90.mjs | ✅ Verified |
| lt | TOOL_NAME_TASK_GET | chunks.90.mjs | ✅ Verified |
| it | TOOL_NAME_TASK_LIST | chunks.90.mjs | ✅ Verified |

**Total validated**: 7 symbols

---

## Cross-Module Integration

### Task System ↔ REPL (02)
- Task list in expanded view panel
- Keyboard navigation support
- Real-time state updates

### Task System ↔ Tools (05)
- TaskCreate, TaskUpdate, TaskGet, TaskList tools
- Tool output renders task status changes

### Task System ↔ System Reminder (04)
- `task_status` attachments for state changes
- Dependency resolution notifications
- Owner assignment tracking

### Task System ↔ Hooks (11)
- TaskCompleted hooks for validation
- Pre-completion validation support

### Task System ↔ Agent Teams (30)
- Team-isolated task storage
- Owner assignment from teammate context
- Claim validation for multi-agent coordination