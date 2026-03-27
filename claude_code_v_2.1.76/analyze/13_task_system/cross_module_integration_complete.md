# Task System Cross-Module Integration - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete integration documentation with source-level restoration

---

## Overview

This document provides comprehensive documentation of all cross-module integration points between the Task System (13) and other modules in Claude Code, including System Reminder (04), Tools (05), Hooks (11), and Agent Teams (30).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Create with auto-increment - chunks.84.mjs:1669
- `getHighWaterMark` (wN9) - Auto-increment ID - chunks.84.mjs:1664
- `claimTask` (OT8) - Atomic claim with validation - chunks.84.mjs:1781
- `updateTask` (WI) - Update with persistence - chunks.84.mjs:1701

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TASK SYSTEM INTEGRATION ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      TASK SYSTEM CORE (13)                             │  │
│  │                                                                        │  │
│  │   Task Operations            Storage Layer             Hooks           │  │
│  │   ├─ createTask (aD1)        ├─ ~/.claude/tasks/       ├─ TaskCompleted│  │
│  │   ├─ updateTask (WI)         ├─ {team}/1.json          └─ Hi6          │  │
│  │   ├─ deleteTask (sD1)        ├─ .highwatermark                        │  │
│  │   ├─ claimTask (OT8)         └─ .lock                                 │  │
│  │   └─ loadAllTasks (DX)                                                 │  │
│  │                                                                        │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
│                                  │                                          │
│     ┌────────────────────────────┼────────────────────────────┐             │
│     │                            │                            │             │
│     ▼                            ▼                            ▼             │
│ ┌───────────┐            ┌───────────────┐            ┌───────────┐        │
│ │  SYSTEM   │            │    TOOLS      │            │   HOOKS   │        │
│ │ REMINDER  │◄───────────│    (05)       │───────────►│   (11)    │        │
│ │   (04)    │            │               │            │           │        │
│ └───────────┘            └───────────────┘            └───────────┘        │
│        │                                                                     │
│        │                     ┌───────────────┐                              │
│        └────────────────────►│ AGENT TEAMS   │                              │
│                              │    (30)       │                              │
│                              └───────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Task System ↔ System Reminder (04)

### Integration Points

**Task operations generate the following attachment types:**

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `task_status` | Task state changes | Create/update/delete notifications |
| `task_claimed` | Task assignment | Owner assignment notifications |
| `task_completed` | Completion status | Dependency notifications |
| `task_progress` | During execution | Progress messages |

### Trigger Conditions

| Action | Attachment | Fields |
|--------|------------|--------|
| Task created | `task_status` | `action: "created"`, task data |
| Task updated | `task_status` | `action: "updated"`, changed fields |
| Task deleted | `task_status` | `action: "deleted"`, task ID |
| Task claimed | `task_claimed` | owner info, task data |
| Task completed | `task_completed` | For dependent task notifications |

### Source Code: Task Status Attachment

```javascript
// ============================================
// Task status attachment generation
// Location: chunks.84.mjs (in task operation functions)
// ============================================

// READABLE (for understanding):
function createTaskStatusAttachment(action, task) {
    return {
        type: "task_status",
        action,  // "created" | "updated" | "deleted"
        task: {
            id: task.id,
            subject: task.subject,
            status: task.status,
            owner: task.owner,
            blockedBy: task.blockedBy,
            blocks: task.blocks
        },
        timestamp: Date.now()
    };
}

function createTaskClaimedAttachment(task, owner) {
    return {
        type: "task_claimed",
        taskId: task.id,
        owner,
        claimedAt: Date.now()
    };
}
```

---

## 2. Task System ↔ Tools (05)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Task tools | TaskCreate, TaskGet, TaskList, TaskUpdate |
| TodoWrite | Simple todo mode when structured tasks disabled |
| File locking | Task operations use proper locking |
| Permission checks | Tasks go through `canUseTool` |

### Tool Name Constants

```javascript
// Tool name constants
const TASK_TOOL_NAMES = {
    TaskCreate: 'TR',
    TaskUpdate: 'ck',
    TaskGet: 'lt',
    TaskList: 'it',
    TodoWrite: 'MB'
};
```

### Task Tool Schemas

```javascript
// TaskCreate input schema
const TaskCreateSchema = z.object({
    subject: z.string().min(1).describe("Brief title"),
    description: z.string().min(1).describe("Detailed requirements"),
    activeForm: z.string().optional().describe("Present continuous status"),
    blocks: z.array(z.string()).optional().describe("Task IDs this blocks"),
    blockedBy: z.array(z.string()).optional().describe("Task IDs blocking this"),
    metadata: z.record(z.unknown()).optional()
});

// TaskUpdate input schema
const TaskUpdateSchema = z.object({
    taskId: z.string().describe("Task ID to update"),
    status: z.enum(["pending", "in_progress", "completed"]).optional(),
    owner: z.string().optional(),
    subject: z.string().optional(),
    description: z.string().optional(),
    activeForm: z.string().optional(),
    addBlocks: z.array(z.string()).optional(),
    removeBlocks: z.array(z.string()).optional(),
    addBlockedBy: z.array(z.string()).optional(),
    removeBlockedBy: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional()
});
```

---

## 3. Task System ↔ Hooks (11)

### Integration Points

| Hook Type | When Called | Purpose |
|-----------|-------------|---------|
| `TaskCompleted` | Before marking complete | Validation, side effects |

### Source Code: TaskCompleted Hooks

```javascript
// ============================================
// executeTaskCompletedHooks - Run TaskCompleted hooks
// Location: chunks.175.mjs:2594
// ============================================

// ORIGINAL (for source lookup):
async function* Hi6(A, q) {
    let K = await Bb(YK.TaskCompleted, {
        task: A
    });
    for (let Y of K) {
        if (Y.output?.block === !0) {
            yield {
                blocked: !0,
                reason: Y.output.message ?? "Task completion blocked by hook"
            };
            return
        }
        if (Y.output?.message) {
            yield {
                message: Y.output.message
            }
        }
    }
    yield {
        blocked: !1
    }
}

// READABLE (for understanding):
async function* executeTaskCompletedHooks(task, sessionContext) {
    // Run all TaskCompleted hooks
    const hookResults = await runHooks(HookType.TaskCompleted, {
        task
    });

    for (const result of hookResults) {
        // If hook blocks completion
        if (result.output?.block === true) {
            yield {
                blocked: true,
                reason: result.output.message ?? "Task completion blocked by hook"
            };
            return;
        }

        // Yield any messages from hooks
        if (result.output?.message) {
            yield {
                message: result.output.message
            };
        }
    }

    // All hooks passed, allow completion
    yield {
        blocked: false
    };
}

// Mapping: Hi6→executeTaskCompletedHooks, A→task, q→sessionContext,
//          Bb→runHooks, YK→HookType
```

### Hook Flow

```
Task update(status: "completed")
    │
    ▼
executeTaskCompletedHooks(task)
    │ For each hook
    ├─→ Hook returns block: true → Block completion
    └─→ Hook returns message → Yield message
    │
    ▼
If all hooks pass:
    Mark task as completed
    Notify dependent tasks
```

---

## 4. Task System ↔ Agent Teams (30)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Team-isolated storage | `~/.claude/tasks/{team-name}/` |
| Task claiming | `claimTask` with agent busy validation |
| Task unassignment | `unassignTeammateTasks` on agent shutdown |
| Teammate context | Task list ID from `getTeammateContext()` |
| Auto-task assignment | `claimUnclaimedTask` |

### Source Code: Task Claiming with Validation

```javascript
// ============================================
// claimTask - Atomic task claiming with validation
// Location: chunks.84.mjs:1781-1830
// ============================================

// ORIGINAL (for source lookup):
async function OT8(A, q, K, Y = {}) {
    // Step 1: Verify task exists
    if (!await DB(A, q)) {
        return { success: !1, reason: "task_not_found" };
    }

    // Step 2: Delegate to agent-busy validation if requested
    if (Y.checkAgentBusy) {
        return $N9(A, q, K);
    }

    // Step 3: Acquire lock on task file
    let z;
    try {
        z = await EF6.lock(wT8(A), nD1);

        // Step 4: Re-verify task after lock
        let _ = await DB(A, q);
        if (!_) {
            return { success: !1, reason: "task_not_found" };
        }

        // Step 5: Check already claimed
        if (_.owner && _.owner !== K) {
            return { success: !1, reason: "already_claimed", task: _ };
        }

        // Step 6: Check already completed
        if (_.status === "completed") {
            return { success: !1, reason: "already_resolved", task: _ };
        }

        // Step 7: Check dependencies
        let w = await DX(A),
            O = new Set(w.filter(M => M.status !== "completed").map(M => M.id)),
            $ = _.blockedBy.filter(M => O.has(M));
        if ($.length > 0) {
            return {
                success: !1,
                reason: "blocked",
                blockedBy: $,
                task: _
            };
        }

        // Step 8: Set owner and status
        await WI(A, q, {
            owner: K,
            status: "in_progress"
        });

        return { success: !0, task: await DB(A, q) };

    } finally {
        if (z) await z();
    }
}

// READABLE (for understanding):
async function claimTask(taskListId, taskId, owner, options = {}) {
    // Step 1: Verify task exists
    if (!await loadTask(taskListId, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Step 2: Delegate to agent-busy validation if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskListId, taskId, owner);
    }

    // Step 3: Acquire lock on task file
    let releaseLock;
    try {
        releaseLock = await lockfile.lock(getLockPath(taskListId), lockOptions);

        // Step 4: Re-verify task after lock (could have changed)
        const task = await loadTask(taskListId, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Step 5: Check already claimed by different owner
        if (task.owner && task.owner !== owner) {
            return { success: false, reason: "already_claimed", task };
        }

        // Step 6: Check already completed
        if (task.status === "completed") {
            return { success: false, reason: "already_resolved", task };
        }

        // Step 7: Check dependencies are completed
        const allTasks = await loadAllTasks(taskListId);
        const incompleteTaskIds = new Set(
            allTasks.filter(t => t.status !== "completed").map(t => t.id)
        );
        const blockedByIncomplete = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (blockedByIncomplete.length > 0) {
            return {
                success: false,
                reason: "blocked",
                blockedBy: blockedByIncomplete,
                task
            };
        }

        // Step 8: Set owner and status
        await updateTask(taskListId, taskId, {
            owner,
            status: "in_progress"
        });

        return { success: true, task: await loadTask(taskListId, taskId) };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          DB→loadTask, $N9→claimTaskWithAgentBusyValidation, EF6→lockfile,
//          wT8→getLockPath, nD1→lockOptions, WI→updateTask, DX→loadAllTasks
```

### Unassign Teammate Tasks

```javascript
// ============================================
// unassignTeammateTasks - Cleanup when agent shuts down
// Location: chunks.84.mjs:1883
// ============================================

// READABLE (for understanding):
async function unassignTeammateTasks(taskListId, agentName) {
    const tasks = await loadAllTasks(taskListId);

    for (const task of tasks) {
        if (task.owner === agentName && task.status === "in_progress") {
            // Reset to pending, clear owner
            await updateTask(taskListId, task.id, {
                owner: null,
                status: "pending"
            });
        }
    }
}
```

---

## 5. Task System ↔ UI (02)

### UI Components

| Component | Purpose |
|-----------|---------|
| `TaskListView` | Main task list container |
| `TaskItem` | Individual task row |
| `TaskListHeader` | Statistics summary |
| `TaskListFooter` | Help and shortcuts |

### UI State

```javascript
// UI state field
expandedView: "tasks"  // Shows task panel

// Task status colors
const STATUS_COLORS = {
    pending: "yellow",
    in_progress: "cyan",
    completed: "green"
};

// Selection state
selectedTaskId: string | null
```

### Task Item Rendering

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
        >
            <Box>
                {/* Status indicator */}
                <Text color={statusConfig.color}>
                    {statusConfig.icon}
                </Text>

                {/* Task ID and subject */}
                <Text bold={isSelected}>
                    #{task.id}: {task.subject}
                </Text>

                {/* Owner badge */}
                {task.owner && (
                    <Text dimColor> [@{task.owner}]</Text>
                )}
            </Box>

            {/* Blocked warning */}
            {isBlocked && (
                <Box marginLeft={2}>
                    <Text color="red">
                        ⚠ Blocked by: {dependencyInfo.blockedByIncomplete.join(", ")}
                    </Text>
                </Box>
            )}

            {/* Active form spinner */}
            {task.status === "in_progress" && task.activeForm && (
                <Box marginLeft={2}>
                    <Text dimColor>{task.activeForm}</Text>
                </Box>
            )}
        </Box>
    );
}

function getStatusConfig(status) {
    switch (status) {
        case "pending":
            return { icon: "○", color: "yellow" };
        case "in_progress":
            return { icon: "●", color: "cyan" };
        case "completed":
            return { icon: "✓", color: "green" };
    }
}
```

---

## Key Algorithms

### High Watermark Algorithm

```javascript
// ============================================
// getHighWaterMark - Get maximum task ID
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskListId) {
    // Run both lookups in parallel for efficiency
    const [maxFromFiles, maxFromWatermarkFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),   // Scan directory
        readHighWaterMarkFile(taskListId)    // Read persisted value
    ]);

    // Return the maximum of both sources
    return Math.max(maxFromFiles, maxFromWatermarkFile);
}

// Mapping: wN9→getHighWaterMark, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile
```

### Dependency Graph

```
Task Dependency DAG (Directed Acyclic Graph):
┌──────────┐     blocks      ┌──────────┐
│ Task #1  │ ─────────────────│ Task #3  │
└──────────┘                  └──────────┘
     │
     │ blocks
     ▼
┌──────────┐     blocks      ┌──────────┐
│ Task #2  │ ─────────────────│ Task #4  │
└──────────┘                  └──────────┘

Task #3.blockedBy = ["1"]
Task #4.blockedBy = ["2"]
Task #1.blocks = ["3"]
Task #2.blocks = ["4"]
```

---

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

---

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

---

## Summary

The Task System module provides structured task tracking with these key integrations:

1. **System Reminder (04)** - Task status attachments, progress notifications
2. **Tools (05)** - Task tools, permission integration
3. **Hooks (11)** - TaskCompleted hooks for validation
4. **Agent Teams (30)** - Team-isolated storage, claiming, unassignment
5. **UI (02)** - Task list visualization, status indicators

The system uses file locking for concurrency, auto-increment IDs for simplicity, and a dependency graph for workflow orchestration.