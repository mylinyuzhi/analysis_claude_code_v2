# Task System Cross-Module Integration (Claude Code v2.1.76)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Focus**: Integration with System Reminder, Tools, Hooks, Compact, Agent Teams

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `claimTask` (OT8) - Atomic claim with validation - chunks.84.mjs:1781
- `updateTask` (WI) - Update with persistence - chunks.84.mjs:1701
- `executeTaskCompletedHooks` (Hi6) - Hook execution - chunks.175.mjs:2594
- `writeToMailbox` (x3) - Team communication - chunks.132.mjs:22

---

## Integration Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    TASK SYSTEM CROSS-MODULE INTEGRATION                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│                              ┌─────────────────────┐                          │
│                              │    TASK SYSTEM      │                          │
│                              │     (13_module)     │                          │
│                              └─────────┬───────────┘                          │
│                                        │                                       │
│     ┌──────────────────┬───────────────┼───────────────┬──────────────────┐   │
│     │                  │               │               │                  │   │
│     ▼                  ▼               ▼               ▼                  ▼   │
│ ┌────────┐      ┌──────────┐     ┌────────┐     ┌──────────┐      ┌─────────┐ │
│ │ SYSTEM │      │  TOOLS   │     │ HOOKS  │     │ COMPACT  │      │  AGENT  │ │
│ │REMINDER│      │  (05)    │     │  (11)  │     │   (07)   │      │  TEAMS  │ │
│ │  (04)  │      └──────────┘     └────────┘     └──────────┘      │  (30)   │ │
│ └────────┘                                                        └─────────┘ │
│                                                                                │
│ Integration Types:                                                            │
│ • System Reminder: Attachment injection, task state notifications             │
│ • Tools: TaskCreate/Update/Get/List tool definitions                          │
│ • Hooks: TaskCompleted hooks for pre-completion validation                    │
│ • Compact: Task state preservation during compaction                          │
│ • Agent Teams: Team-isolated storage, claim validation, assignment            │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Task System ↔ System Reminder (04)

### Attachment Types

**What it does:**
System Reminder injects task-related attachments based on task state changes, providing context to the LLM about current task status and dependencies.

```javascript
// ============================================
// Task System Attachment Types
// Location: chunks.1.mjs (attachment generation)
// ============================================

// READABLE (for understanding):
const TASK_ATTACHMENT_TYPES = {
    // Task created
    task_status_created: {
        trigger: (state) => state.lastTaskAction === "created",
        priority: 80,
        content: (state) => ({
            type: "task_status",
            action: "created",
            taskId: state.lastTaskId,
            task: state.lastTask
        })
    },

    // Task updated
    task_status_updated: {
        trigger: (state) => state.lastTaskAction === "updated",
        priority: 80,
        content: (state) => ({
            type: "task_status",
            action: "updated",
            taskId: state.lastTaskId,
            previousStatus: state.previousTaskStatus,
            newStatus: state.newTaskStatus
        })
    },

    // Task deleted
    task_status_deleted: {
        trigger: (state) => state.lastTaskAction === "deleted",
        priority: 80,
        content: (state) => ({
            type: "task_status",
            action: "deleted",
            taskId: state.lastTaskId
        })
    },

    // Task claimed
    task_claimed: {
        trigger: (state) => state.lastTaskAction === "claimed",
        priority: 85,
        content: (state) => ({
            type: "task_claimed",
            taskId: state.lastTaskId,
            owner: state.lastTaskOwner
        })
    },

    // Task completed
    task_completed: {
        trigger: (state) => state.newTaskStatus === "completed",
        priority: 90,
        content: (state) => ({
            type: "task_completed",
            taskId: state.lastTaskId,
            completedBy: state.lastTaskOwner
        })
    },

    // Dependency resolved
    dependency_resolved: {
        trigger: (state) => state.dependencyResolved,
        priority: 75,
        content: (state) => ({
            type: "dependency_resolved",
            taskId: state.dependentTaskId,
            blockingTaskId: state.resolvedTaskId
        })
    }
};
```

### Attachment Content Examples

```javascript
// Task created attachment
{
    type: "attachment",
    attachment: {
        type: "task_status",
        action: "created",
        taskId: "1",
        task: {
            id: "1",
            subject: "Implement login UI",
            description: "Create React components for login form",
            status: "pending",
            blockedBy: [],
            blocks: []
        }
    }
}

// Task claimed attachment
{
    type: "attachment",
    attachment: {
        type: "task_claimed",
        taskId: "1",
        owner: "researcher-1",
        timestamp: "2026-03-27T10:00:00Z"
    }
}

// Dependency resolved attachment
{
    type: "attachment",
    attachment: {
        type: "dependency_resolved",
        taskId: "3",
        blockingTaskId: "1",
        message: "Task [1] completed. Task [3] is now unblocked."
    }
}
```

### State Propagation

```javascript
// ============================================
// Task State to System Reminder
// ============================================

// READABLE (for understanding):
const TASK_STATE_PROPAGATION = {
    // Task list loaded
    onTasksLoaded: (tasks) => {
        updateReminderContext({
            taskCount: tasks.length,
            pendingCount: tasks.filter(t => t.status === "pending").length,
            inProgressCount: tasks.filter(t => t.status === "in_progress").length
        });
    },

    // Task created
    onTaskCreated: (task) => {
        setLastTaskAction("created", task);
        invalidateReminderCache();
    },

    // Task updated
    onTaskUpdated: (taskId, updates, previousStatus) => {
        setLastTaskAction("updated", {
            taskId,
            previousStatus,
            newStatus: updates.status
        });
        invalidateReminderCache();
    },

    // Task completed
    onTaskCompleted: (task) => {
        setLastTaskAction("completed", task);

        // Check if this unblocks any tasks
        const dependentTasks = findDependentTasks(task.id);
        for (const depTask of dependentTasks) {
            if (canStartTask(depTask)) {
                emitDependencyResolved(task.id, depTask.id);
            }
        }
    }
};
```

---

## 2. Task System ↔ Tools (05)

### Tool Definitions

**What it does:**
Task System provides four tools for task management: TaskCreate, TaskUpdate, TaskGet, TaskList. Each tool integrates with the permission system and file locking.

```javascript
// ============================================
// Task Tool Definitions
// Location: chunks.141.mjs (tool definitions)
// ============================================

// READABLE (for understanding):
const TASK_TOOLS = {
    TaskCreate: {
        name: "TaskCreate",
        description: "Create a new task with subject, description, and optional dependencies",

        inputSchema: z.object({
            subject: z.string().describe("Brief task title"),
            description: z.string().describe("Detailed task requirements"),
            activeForm: z.string().optional().describe("Present continuous status for UI"),
            blockedBy: z.array(z.string()).optional().describe("Task IDs this task depends on")
        }),

        async call(input, context) {
            const taskListId = getTaskManager();

            const taskData = {
                subject: input.subject,
                description: input.description,
                status: "pending",
                blockedBy: input.blockedBy || [],
                blocks: []
            };

            if (input.activeForm) {
                taskData.activeForm = input.activeForm;
            }

            const taskId = await createTask(taskListId, taskData);

            // Update blocking tasks' blocks array
            if (input.blockedBy) {
                for (const blockingId of input.blockedBy) {
                    await updateTask(taskListId, blockingId, {
                        addBlocks: [taskId]
                    });
                }
            }

            return {
                taskId,
                task: await loadTask(taskListId, taskId)
            };
        }
    },

    TaskUpdate: {
        name: "TaskUpdate",
        description: "Update task status, owner, or other properties",

        inputSchema: z.object({
            taskId: z.string().describe("Task ID to update"),
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            owner: z.string().optional(),
            activeForm: z.string().optional(),
            addBlockedBy: z.array(z.string()).optional(),
            addBlocks: z.array(z.string()).optional()
        }),

        async call(input, context) {
            const taskListId = getTaskManager();

            const updates = {};
            if (input.status) updates.status = input.status;
            if (input.owner) updates.owner = input.owner;
            if (input.activeForm) updates.activeForm = input.activeForm;
            if (input.addBlockedBy) updates.addBlockedBy = input.addBlockedBy;
            if (input.addBlocks) updates.addBlocks = input.addBlocks;

            const updatedTask = await updateTask(taskListId, input.taskId, updates);

            return { task: updatedTask };
        }
    },

    TaskGet: {
        name: "TaskGet",
        description: "Get a specific task by ID",

        inputSchema: z.object({
            taskId: z.string().describe("Task ID to retrieve")
        }),

        async call(input, context) {
            const taskListId = getTaskManager();
            const task = await loadTask(taskListId, input.taskId);

            if (!task) {
                throw new Error(`Task ${input.taskId} not found`);
            }

            return { task };
        }
    },

    TaskList: {
        name: "TaskList",
        description: "List all tasks with optional status filter",

        inputSchema: z.object({
            status: z.enum(["pending", "in_progress", "completed"]).optional()
        }),

        async call(input, context) {
            const taskListId = getTaskManager();
            let tasks = await loadAllTasks(taskListId);

            if (input.status) {
                tasks = tasks.filter(t => t.status === input.status);
            }

            return { tasks };
        }
    }
};

// Tool name constants
const TOOL_NAMES = {
    TaskCreate: "TR",
    TaskUpdate: "ck",
    TaskGet: "lt",
    TaskList: "it"
};
```

### Tool Permission Integration

```javascript
// ============================================
// Task Tool Permission Checks
// ============================================

// READABLE (for understanding):
const TASK_PERMISSION_CONFIG = {
    TaskCreate: {
        requiresPermission: false,  // Always allowed
        isReadOnly: false,
        isConcurrencySafe: true
    },

    TaskUpdate: {
        requiresPermission: false,
        isReadOnly: false,
        isConcurrencySafe: false,  // Modifies state

        // Additional validation for completion
        async validateCompletion(task, context) {
            // Run TaskCompleted hooks before allowing completion
            if (context.status === "completed") {
                const hookResult = await executeTaskCompletedHooks(task);
                if (!hookResult.success) {
                    return {
                        result: false,
                        message: hookResult.message
                    };
                }
            }
            return { result: true };
        }
    },

    TaskGet: {
        requiresPermission: false,
        isReadOnly: true,
        isConcurrencySafe: true
    },

    TaskList: {
        requiresPermission: false,
        isReadOnly: true,
        isConcurrencySafe: true
    }
};
```

---

## 3. Task System ↔ Hooks (11)

### TaskCompleted Hooks

**What it does:**
Hooks that run before a task can be marked as completed. Allows custom validation logic.

```javascript
// ============================================
// TaskCompleted Hook Execution
// Location: chunks.175.mjs:2594
// ============================================

// ORIGINAL (for source lookup):
async function* Hi6(A) {
    let q = await $i6(A.id);
    if (!q) return;
    for (let K of q.hooks) {
        try {
            let Y = await executeHook(K, {
                task: A,
                taskId: A.id
            });
            if (Y.blockingError) {
                yield {
                    success: !1,
                    message: Y.blockingError
                };
                return;
            }
        } catch (Y) {
            yield {
                success: !1,
                message: `Hook ${K.name} failed: ${Y.message}`
            };
            return;
        }
    }
    yield { success: !0 };
}

// READABLE (for understanding):
async function* executeTaskCompletedHooks(task) {
    // Get hooks configured for this task
    const hookConfig = await getTaskCompletedHookMessage(task.id);
    if (!hookConfig) {
        return;  // No hooks configured
    }

    // Execute each hook
    for (const hook of hookConfig.hooks) {
        try {
            const result = await executeHook(hook, {
                task: task,
                taskId: task.id
            });

            // Hook blocked completion
            if (result.blockingError) {
                yield {
                    success: false,
                    message: result.blockingError
                };
                return;  // Stop on first failure
            }

        } catch (error) {
            // Hook execution failed
            yield {
                success: false,
                message: `Hook ${hook.name} failed: ${error.message}`
            };
            return;
        }
    }

    // All hooks passed
    yield { success: true };
}

// Mapping: Hi6→executeTaskCompletedHooks, $i6→getTaskCompletedHookMessage
```

### Hook Configuration

```javascript
// ============================================
// TaskCompleted Hook Configuration
// ============================================

// READABLE (for understanding):
const TASK_HOOK_CONFIG = {
    // Hook type
    type: "TaskCompleted",

    // When to run
    trigger: "before task status changes to completed",

    // Hook context
    context: {
        task: "The task being completed",
        taskId: "Task ID",
        previousStatus: "Status before completion"
    },

    // Hook result options
    results: {
        success: "Allow completion",
        blockingError: "Block completion with error message"
    }
};

// Hook example
const exampleHook = {
    name: "ValidateCodeChanges",
    type: "TaskCompleted",
    command: "./scripts/validate-task.sh",
    timeout: 30000  // 30 second timeout
};
```

### Hook Integration Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    TASKCOMPLETED HOOK EXECUTION FLOW                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  TaskUpdate(status: "completed")                                              │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Check for TaskCompleted hooks                                         │   │
│  │ hooks = await getTaskCompletedHookMessage(taskId)                    │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ├─── No hooks ──────────────────────────────────┐                       │
│       │                                               │                        │
│       ▼                                               ▼                        │
│  ┌─────────────────────────────────────┐    ┌─────────────────────────────┐  │
│  │ executeTaskCompletedHooks(task)     │    │ Complete task immediately   │  │
│  │                                      │    │ (no validation needed)      │  │
│  │ for (hook of hooks):                │    └─────────────────────────────┘  │
│  │   result = await executeHook(hook)  │                                       │
│  │   if (result.blockingError):        │                                       │
│  │     return { success: false }       │                                       │
│  └─────────────────────────────────────┘                                       │
│       │                                                                        │
│       ├─── Hook failed ────────────────────────────────────┐                  │
│       │                                                    │                   │
│       ▼                                                    ▼                   │
│  ┌─────────────────────────────────────┐    ┌─────────────────────────────┐  │
│  │ Return error:                       │    │ All hooks passed            │  │
│  │ "Cannot complete task:              │    │                             │  │
│  │  Hook validation failed: ..."       │    │ Update task status          │  │
│  │                                     │    │ to "completed"              │  │
│  │ Task remains in current status      │    └─────────────────────────────┘  │
│  └─────────────────────────────────────┘                                       │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Task System ↔ Compact (07)

### Task State Preservation

**What it does:**
When context compaction occurs, task state is preserved and re-injected so the agent maintains awareness of current work.

```javascript
// ============================================
// Task Preservation in Compaction
// Location: chunks.107.mjs (compact), chunks.1.mjs (preservation)
// ============================================

// READABLE (for understanding):
const TASK_COMPACT_CONFIG = {
    // State to preserve during compaction
    preservedState: [
        "tasks",              // Full task list
        "lastTaskAction",     // Last action type
        "lastTaskId"          // Last affected task ID
    ],

    // Attachments to include post-compact
    postCompactAttachments: [
        {
            type: "task_state",
            generator: async (state) => {
                const taskListId = getTaskManager();
                const tasks = await loadAllTasks(taskListId);

                if (tasks.length === 0) return null;

                return {
                    type: "task_state",
                    content: `**Task State (after context compaction)**

Current tasks:
${formatTaskList(tasks)}

${tasks.filter(t => t.status === "in_progress").length > 0
    ? `\nYou have ${tasks.filter(t => t.status === "in_progress").length} task(s) in progress.`
    : ""
}
${tasks.filter(t => t.status === "pending").length > 0
    ? `\n${tasks.filter(t => t.status === "pending").length} task(s) pending.`
    : ""
}`
                };
            }
        }
    ]
};

// Format task list for attachment
function formatTaskList(tasks) {
    return tasks.map(task => {
        const statusIcon = {
            pending: "○",
            in_progress: "●",
            completed: "✓"
        }[task.status];

        const ownerInfo = task.owner ? ` (${task.owner})` : "";
        const blockedInfo = task.blockedBy.length > 0
            ? ` - blocked by: ${task.blockedBy.join(", ")}`
            : "";

        return `${statusIcon} [${task.id}] ${task.subject}${ownerInfo}${blockedInfo}`;
    }).join("\n");
}
```

---

## 5. Task System ↔ Agent Teams (30)

### Team-Isolated Task Storage

**What it does:**
Each team gets its own task directory, enabling isolated task management for multi-agent coordination.

```javascript
// ============================================
// Team Task Storage
// Location: chunks.84.mjs (getTaskManager, storage)
// ============================================

// READABLE (for understanding):
const TEAM_TASK_CONFIG = {
    // Storage paths
    basePath: "~/.claude/tasks/",
    teamPath: (teamName) => `~/.claude/tasks/${teamName}/`,
    soloPath: (agentId) => `~/.claude/tasks/${agentId}/`,

    // Task manager resolution
    resolveTaskManager: (context) => {
        // 1. Environment override
        if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
            return process.env.CLAUDE_CODE_TASK_LIST_ID;
        }

        // 2. Teammate context (team mode)
        const teammateContext = getTeammateContext();
        if (teammateContext) {
            return teammateContext.teamName;
        }

        // 3. Solo mode
        return getSessionId() || generateRandomId();
    }
};

// Directory structure
// ~/.claude/tasks/
// ├── research-team/           # Team "research-team"
// │   ├── 1.json
// │   ├── 2.json
// │   ├── .highwatermark
// │   └── .lock
// ├── dev-team/                # Team "dev-team"
// │   └── ...
// └── session-abc123/          # Solo agent
//     └── ...
```

### Claim Validation for Multi-Agent

```javascript
// ============================================
// Claim Task with Agent Busy Validation
// Location: chunks.84.mjs:1831
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return { success: !1, reason: "task_not_found" };
    if (Y.owner && Y.owner !== K) return {
        success: !1,
        reason: "already_claimed",
        task: Y
    };
    if (Y.status === "completed") return {
        success: !1,
        reason: "already_resolved",
        task: Y
    };

    // Check if agent is busy with another task
    let z = await DX(A),
        _ = z.find((w) => w.owner === K && w.status === "in_progress");
    if (_) return {
        success: !1,
        reason: "agent_busy",
        currentTask: _
    };

    // Proceed with claim
    await WI(A, q, { owner: K, status: "in_progress" });
    return { success: !0, task: await DB(A, q) };
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskListId, taskId, owner) {
    // Load task
    const task = await loadTask(taskListId, taskId);
    if (!task) {
        return { success: false, reason: "task_not_found" };
    }

    // Check already claimed
    if (task.owner && task.owner !== owner) {
        return { success: false, reason: "already_claimed", task };
    }

    // Check already completed
    if (task.status === "completed") {
        return { success: false, reason: "already_resolved", task };
    }

    // Check if agent is busy with another task
    const allTasks = await loadAllTasks(taskListId);
    const currentTask = allTasks.find(
        t => t.owner === owner && t.status === "in_progress"
    );

    if (currentTask) {
        return {
            success: false,
            reason: "agent_busy",
            currentTask,
            message: `Agent ${owner} is already working on task [${currentTask.id}]`
        };
    }

    // Proceed with claim
    await updateTask(taskListId, taskId, {
        owner,
        status: "in_progress"
    });

    return { success: true, task: await loadTask(taskListId, taskId) };
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskListId, q→taskId,
//          K→owner, DB→loadTask, DX→loadAllTasks, WI→updateTask
```

### Teammate Task Assignment

```javascript
// ============================================
// Task Assignment Notification
// ============================================

// READABLE (for understanding):
async function notifyTaskAssignment(task, owner, teamId) {
    // Send notification to assigned agent
    await writeToMailbox(owner, {
        from: "team-lead",
        text: JSON.stringify({
            type: "task_assigned",
            taskId: task.id,
            subject: task.subject,
            description: task.description
        }),
        timestamp: new Date().toISOString()
    }, teamId);
}

// Auto-assign unclaimed task
async function claimUnclaimedTask(agentId, teamId) {
    const taskListId = getTaskManager();
    const tasks = await loadAllTasks(taskListId);

    // Find available task (pending, no owner, dependencies satisfied)
    const availableTask = tasks.find(task =>
        task.status === "pending" &&
        !task.owner &&
        task.blockedBy.every(blockingId => {
            const blockingTask = tasks.find(t => t.id === blockingId);
            return blockingTask?.status === "completed";
        })
    );

    if (!availableTask) {
        return { success: false, reason: "no_available_tasks" };
    }

    // Claim the task
    return claimTask(taskListId, availableTask.id, agentId, {
        checkAgentBusy: true
    });
}
```

### Task Cleanup on Agent Shutdown

```javascript
// ============================================
// Unassign Teammate Tasks
// Location: chunks.84.mjs:1883
// ============================================

// ORIGINAL (for source lookup):
async function ft(A, q) {
    let K = await DX(A);
    for (let Y of K) {
        if (Y.owner === q && Y.status === "in_progress") {
            await WI(A, Y.id, {
                status: "pending",
                owner: null
            })
        }
    }
}

// READABLE (for understanding):
async function unassignTeammateTasks(taskListId, agentName) {
    // Load all tasks
    const tasks = await loadAllTasks(taskListId);

    // Find tasks owned by this agent that are in progress
    for (const task of tasks) {
        if (task.owner === agentName && task.status === "in_progress") {
            // Reset to pending and clear owner
            await updateTask(taskListId, task.id, {
                status: "pending",
                owner: null
            });

            // Log the cleanup
            emitTelemetry("task_unassigned", {
                taskId: task.id,
                previousOwner: agentName,
                reason: "agent_shutdown"
            });
        }
    }
}

// Mapping: ft→unassignTeammateTasks, A→taskListId, q→agentName,
//          DX→loadAllTasks, WI→updateTask
```

---

## 6. Integration Matrix

| Integration Point | Trigger | Data Flow | Side Effects |
|-------------------|---------|-----------|--------------|
| System Reminder Create | TaskCreate call | State → Reminder | task_status attachment |
| System Reminder Update | TaskUpdate call | State → Reminder | task_status attachment |
| System Reminder Claim | claimTask success | State → Reminder | task_claimed attachment |
| Tools Create | Agent call | Tool → Task system | New task file |
| Tools Update | Agent call | Tool → Task system | Updated task file |
| Hooks Completion | status: "completed" | Task → Hooks | Validation result |
| Compact Preserve | Compaction trigger | State → Preservation | Task state attachment |
| Agent Teams Storage | getTaskManager | Context → Path | Team-isolated storage |
| Agent Teams Claim | claimTask | Agent → Task | Owner assignment |
| Agent Teams Cleanup | Agent shutdown | Agent → Tasks | Task unassignment |

---

## 7. Error Handling Integration

### Cross-Module Error Codes

```javascript
// ============================================
// Task System Error Codes
// ============================================

const TASK_ERROR_CODES = {
    // Task errors
    TASK_NOT_FOUND: {
        module: "Task System",
        message: "Task not found",
        recovery: "Check task ID and try again"
    },

    ALREADY_CLAIMED: {
        module: "Task System",
        message: "Task already claimed by another agent",
        recovery: "Wait for task to become available or claim a different task"
    },

    ALREADY_RESOLVED: {
        module: "Task System",
        message: "Task already completed",
        recovery: "No action needed"
    },

    BLOCKED: {
        module: "Task System",
        message: "Task blocked by incomplete dependencies",
        recovery: "Complete blocking tasks first"
    },

    AGENT_BUSY: {
        module: "Task System",
        message: "Agent already working on another task",
        recovery: "Complete current task first or reassign"
    },

    // Hook errors
    HOOK_FAILED: {
        module: "Hooks",
        message: "TaskCompleted hook validation failed",
        recovery: "Fix the issue described in the hook error"
    },

    // Team errors
    NO_AVAILABLE_TASKS: {
        module: "Agent Teams",
        message: "No tasks available to claim",
        recovery: "Wait for new tasks or dependencies to resolve"
    }
};

function handleTaskError(error, context) {
    const errorConfig = TASK_ERROR_CODES[error.code];

    if (!errorConfig) {
        return { handled: false };
    }

    emitTelemetry("task_error", {
        code: error.code,
        module: errorConfig.module,
        context
    });

    return {
        handled: true,
        message: errorConfig.message,
        recovery: errorConfig.recovery
    };
}
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Verified |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Verified |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | ✅ Verified |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Verified |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Verified |
| ft | unassignTeammateTasks | chunks.84.mjs:1883 | ✅ Verified |
| Hi6 | executeTaskCompletedHooks | chunks.175.mjs:2594 | ✅ Verified |
| $i6 | getTaskCompletedHookMessage | chunks.175.mjs:1602 | ✅ Verified |
| x3 | writeToMailbox | chunks.132.mjs:22 | ✅ Verified |

**Total validated**: 9 symbols

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced dependency resolution, hook integration |
| 2.1.32 | Team task isolation, claim validation |
| 2.1.7 | Initial task system (refactored from TodoWrite) |