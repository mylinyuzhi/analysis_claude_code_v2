# Task Management Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of task management tools: TaskStop, TaskOutput, TaskGet, TaskList, TaskCreate, TaskUpdate, TodoWrite.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (TodoWrite)

Key functions in this document:
- `TaskStopTool` (vW6) - Tool object for stopping background tasks - chunks.139.mjs:1537
- `TASK_STOP_TOOL_NAME` (bj1) - Tool name constant "TaskStop" - chunks.89.mjs:553
- `TaskOutputTool` (kW6) - Tool object for retrieving task output - chunks.139.mjs:1922
- `TASK_OUTPUT_TOOL_NAME` (uj1) - Tool name constant "TaskOutput" - chunks.89.mjs:562
- `TaskGetTool` ($l4) - Tool object for getting task by ID - chunks.140.mjs:2954
- `TASK_GET_TOOL_NAME` (NK1) - Tool name constant "TaskGet" - chunks.89.mjs:594
- `TaskListTool` (Ll4) - Tool object for listing all tasks - chunks.141.mjs:300
- `TASK_LIST_TOOL_NAME` (TK1) - Tool name constant "TaskList" - chunks.89.mjs:596
- `TASK_CREATE_TOOL_NAME` (Nh) - Tool name constant "TaskCreate" - chunks.88.mjs:371
- `TASK_UPDATE_TOOL_NAME` (DR) - Tool name constant "TaskUpdate" - chunks.88.mjs:373
- `TodoWriteTool` (bO) - Tool object for simple todo list - chunks.48.mjs:773
- `TODO_WRITE_TOOL_NAME` (cg) - Tool name constant "TodoWrite" - chunks.48.mjs:224

---

## Architecture Overview

```
Task Management System
│
├── Background Task Control
│   ├── TaskStop → Terminates running background tasks (bash, agent, remote)
│   └── TaskOutput → Polls output from running/completed tasks
│
├── Structured Task Management
│   ├── TaskCreate → Creates task in "pending" state
│   ├── TaskUpdate → Transitions: pending → in_progress → completed/deleted
│   ├── TaskGet → Retrieves current task state with dependencies (v2.1.76: confirmed present)
│   └── TaskList → Shows all tasks with status/dependencies (v2.1.76: confirmed present)
│
└── Simple Todo List
    └── TodoWrite → Per-agent todo tracking (auto-clears on completion)
```

---

## Two Task Tracking Systems

Claude Code provides **two different** task tracking mechanisms:

| Feature | TodoWrite | TaskCreate/TaskUpdate/TaskList |
|---------|-----------|-------------------------------|
| **Purpose** | Simple todo list tracking | Structured task management with dependencies |
| **Storage** | `appState.todos[agentId]` | Separate task list store |
| **Dependencies** | No support | Yes — `blockedBy` and `blocks` |
| **Owner Assignment** | No support | Yes — can assign owner |
| **UI Display** | Simple checkbox list in system reminders | Full task panel with status |
| **Auto-Clear** | Clears when all completed | Explicit status management |
| **Visibility** | Always shown as reminder | Expandable task panel |
| **Mutual Exclusion** | Enabled when structured tasks disabled | Enabled when structured tasks enabled |

**Why two systems?**
- `TodoWrite` is the **simpler, legacy** system for basic progress tracking
- `TaskCreate/Update/List` is the **newer, structured** system for complex workflows with dependencies
- They are **mutually exclusive** - only one is active at a time based on `jH()` (isStructuredTasksEnabled)

---

## 1. TaskStop Tool

### TaskStopTool (vW6) - Terminate background tasks

**What it does:** Stops a running background task (shell, agent, or remote session) by its ID.

**How it works:**
1. Validates task exists and is in "running" state
2. Gets the appropriate kill handler for the task type
3. Executes the kill operation via the handler
4. Marks task as notified to prevent duplicate notifications

```javascript
// ============================================
// TaskStopTool - Background task termination
// Location: chunks.139.mjs:1537-1655
// ============================================

// ORIGINAL (for source lookup):
vW6 = {
    name: bj1,  // "TaskStop"
    aliases: ["KillShell"],
    maxResultSizeChars: 1e5,
    userFacingName: () => KY() ? "" : "Stop Task",
    get inputSchema() { return dyY() },
    get outputSchema() { return cyY() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !1 },
    async checkPermissions(A) { return { behavior: "allow", updatedInput: A } },
    async validateInput({ task_id: A, shell_id: q }, { getAppState: K }) {
        let Y = A ?? q;
        if (!Y) return { result: !1, message: "Missing required parameter: task_id", errorCode: 1 };
        let w = (await K()).tasks?.[Y];
        if (!w) return { result: !1, message: `No task found with ID: ${Y}`, errorCode: 1 };
        if (!Vg1(w.type)) return { result: !1, message: `Task ${Y} has unsupported type: ${w.type}`, errorCode: 2 };
        if (w.status !== "running") return { result: !1, message: `Task ${Y} is not running (status: ${w.status})`, errorCode: 3 };
        return { result: !0 }
    },
    async call({ task_id: A, shell_id: q }, { getAppState: K, setAppState: Y, abortController: z }) {
        let w = A ?? q;
        let $ = (await K()).tasks?.[w];
        let O = Vg1($.type);
        await O.kill(w, { abortController: z, getAppState: K, setAppState: Y });
        Y((J) => {
            let X = J.tasks[w];
            if (!X || X.notified) return J;
            return { ...J, tasks: { ...J.tasks, [w]: { ...X, notified: !0 } } }
        });
        let _ = oB($) ? $.command : $.description;
        return { data: { message: `Successfully stopped task: ${w} (${_})`, task_id: w, task_type: $.type, command: _ } }
    }
}

// READABLE (for understanding):
const TaskStopTool = {
    name: "TaskStop",
    aliases: ["KillShell"],  // Legacy alias

    inputSchema: z.strictObject({
        task_id: z.string().optional().describe("The ID of the background task to stop"),
        shell_id: z.string().optional().describe("Deprecated: use task_id instead")
    }),

    isConcurrencySafe() { return true; },  // Safe to call while other tools run
    isReadOnly() { return false; },         // Modifies task state

    async validateInput({ task_id, shell_id }, { getAppState }) {
        let resolvedId = task_id ?? shell_id;

        if (!resolvedId) {
            return { result: false, message: "Missing required parameter: task_id", errorCode: 1 };
        }

        let task = (await getAppState()).tasks?.[resolvedId];

        if (!task) {
            return { result: false, message: `No task found with ID: ${resolvedId}`, errorCode: 1 };
        }

        if (!getKillHandlerForType(task.type)) {
            return { result: false, message: `Task ${resolvedId} has unsupported type: ${task.type}`, errorCode: 2 };
        }

        if (task.status !== "running") {
            return { result: false, message: `Task ${resolvedId} is not running (status: ${task.status})`, errorCode: 3 };
        }

        return { result: true };
    },

    async call({ task_id, shell_id }, { getAppState, setAppState, abortController }) {
        let resolvedId = task_id ?? shell_id;
        let task = (await getAppState()).tasks?.[resolvedId];

        let killHandler = getKillHandlerForType(task.type);
        await killHandler.kill(resolvedId, { abortController, getAppState, setAppState });

        setAppState((state) => {
            let taskEntry = state.tasks[resolvedId];
            if (!taskEntry || taskEntry.notified) return state;
            return { ...state, tasks: { ...state.tasks, [resolvedId]: { ...taskEntry, notified: true } } };
        });

        let description = isBashTask(task) ? task.command : task.description;
        return { data: { message: `Successfully stopped task: ${resolvedId} (${description})`, task_id: resolvedId, task_type: task.type, command: description } };
    }
};

// Mapping: vW6→TaskStopTool, bj1→TASK_STOP_TOOL_NAME, dyY→taskStopInputSchema,
//          Vg1→getKillHandlerForType, oB→isBashTask
```

**Key insight:** Uses a kill handler registry pattern (`Vg1`) to support different task types with type-specific termination logic.

---

### Kill Handler Registry Pattern

```
TaskStop.call(taskId)
    │
    ├─→ getKillHandlerForType(task.type)  // Vg1
    │       └─→ getAllKillHandlers()  // IhY
    │               └─→ [LocalBashTask, LocalAgentTask, RemoteAgentTask]
    │
    └─→ handler.kill(taskId, context)
```

| Task Type | Handler Symbol | Kill Function | Implementation |
|-----------|---------------|---------------|----------------|
| `local_bash` | `gj1` (LocalBashTask) | `hjA(taskId, setAppState)` | Calls `shellCommand.kill()` and `cleanup()` |
| `local_agent` | `B_6` (LocalAgentTask) | `na(taskId, setAppState)` | Aborts agent controller via `abortController.abort()` |
| `remote_agent` | `Qi4` (RemoteAgentTask) | Handler method | Updates status to "killed" (local only) |

---

## 2. TaskOutput Tool

### TaskOutputTool (kW6) - Poll task output

**What it does:** Retrieves the current output from a running or completed background task. Supports blocking until completion with a configurable timeout.

```javascript
// ============================================
// TaskOutputTool - Task output retrieval
// Location: chunks.139.mjs:1922
// ============================================

// READABLE (for understanding):
const TaskOutputTool = {
    name: "TaskOutput",
    aliases: ["AgentOutputTool", "BashOutputTool"],  // Legacy aliases

    inputSchema: z.strictObject({
        task_id: z.string()
            .describe("The ID of the background task to get output from"),
        block: z.boolean()
            .optional()
            .default(true)
            .describe("If true (default), wait for task completion before returning"),
        timeout: z.number()
            .optional()
            .default(30000)
            .describe("Maximum wait time in milliseconds. Default: 30000 (30s), Max: 600000 (10min)")
    }),

    async call({ task_id, block, timeout }, context) {
        // Get initial task state
        let task = (await context.getAppState()).tasks?.[task_id];

        if (!task) {
            return { data: { retrieval_status: "not_found", task_id } };
        }

        // If task is already complete, return immediately
        if (task.status !== "running") {
            return { data: { retrieval_status: "success", task: buildTaskSnapshot(task) } };
        }

        // If not blocking, return current state immediately
        if (!block) {
            return { data: { retrieval_status: "not_ready", task: buildTaskSnapshot(task) } };
        }

        // Poll until done with timeout
        let result = await pollUntilDone(task_id, context, {
            timeoutMs: Math.min(timeout, 600000)  // Cap at 10 minutes
        });

        return result;
    }
};
```

### buildTaskSnapshot (EW6) - Task output builder

**What it does:** Builds a consistent snapshot of a task's current state, regardless of task type.

```javascript
// ============================================
// buildTaskSnapshot (EW6) - Task output normalization
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
function buildTaskSnapshot(task) {
    let base = {
        task_id: task.id,
        task_type: task.type,
        status: task.status,
        description: task.description,
        output: readFullOutput(task.id)  // M_6 — reads task output file
    };

    switch (task.type) {
        case "local_bash":
            return { ...base, exitCode: task.exitCode };

        case "local_agent":
            return { ...base, prompt: task.prompt, error: task.error };

        case "remote_agent":
            return { ...base, prompt: task.description };

        default:
            return base;
    }
}

// Mapping: EW6→buildTaskSnapshot, M_6→readFullOutput
```

---

## 3. TaskGet Tool

### TaskGetTool ($l4) - Get a single structured task

**What it does:** Retrieves the full state of a single structured task (not a background task) by its ID, including dependencies and metadata.

```javascript
// ============================================
// TaskGetTool - Single task retrieval
// Location: chunks.140.mjs:2954
// ============================================

// READABLE (for understanding):
const TaskGetTool = {
    name: "TaskGet",
    isConcurrencySafe: true,
    isReadOnly: true,

    inputSchema: z.strictObject({
        taskId: z.string()
            .describe("The ID of the structured task to retrieve. Use TaskList to find task IDs.")
    }),

    outputSchema: z.object({
        task: z.object({
            id: z.string(),
            subject: z.string(),
            description: z.string(),
            status: z.enum(["pending", "in_progress", "completed", "deleted"]),
            owner: z.string().optional(),
            blockedBy: z.array(z.string()),   // Task IDs that must complete first
            blocks: z.array(z.string()),       // Task IDs waiting on this task
            metadata: z.record(z.any()).optional(),
            createdAt: z.string(),
            updatedAt: z.string()
        }).nullable()
    }),

    async call({ taskId }, context) {
        let taskList = getTaskList(context);
        let task = findTaskById(taskList, taskId);

        return {
            data: {
                task: task ?? null
            }
        };
    }
};

// Mapping: $l4→TaskGetTool, NK1→TASK_GET_TOOL_NAME, WM→getTaskList, lg→findTaskById
```

---

## 4. TaskList Tool

### TaskListTool (Ll4) - List all structured tasks

**What it does:** Returns all structured tasks with their current status, dependencies, and owner assignments.

```javascript
// ============================================
// TaskListTool - All tasks listing
// Location: chunks.141.mjs:300
// ============================================

// READABLE (for understanding):
const TaskListTool = {
    name: "TaskList",
    isConcurrencySafe: true,
    isReadOnly: true,

    inputSchema: z.strictObject({}),  // No parameters

    outputSchema: z.object({
        tasks: z.array(z.object({
            id: z.string(),
            subject: z.string(),
            status: z.enum(["pending", "in_progress", "completed", "deleted"]),
            owner: z.string().optional(),
            blockedBy: z.array(z.string())
        }))
    }),

    async call({}, context) {
        let taskList = getTaskList(context);

        return {
            data: {
                tasks: taskList.tasks
                    .filter(t => t.status !== "deleted")
                    .map(t => ({
                        id: t.id,
                        subject: t.subject,
                        status: t.status,
                        owner: t.owner,
                        blockedBy: t.blockedBy ?? []
                    }))
            }
        };
    }
};

// Mapping: Ll4→TaskListTool, TK1→TASK_LIST_TOOL_NAME
```

---

## 5. TaskCreate Tool

### TaskCreate - Create structured tasks

**What it does:** Creates a new structured task in "pending" state. The task can have dependencies and metadata.

**v2.1.76 update: `activeForm` field is no longer required.**

In earlier versions, `activeForm` (the present continuous description, e.g., "Refactoring authentication") was required for spinner display. In v2.1.76, this field is optional — the system will derive a reasonable display form from `subject` if `activeForm` is not provided.

```javascript
// ============================================
// TaskCreate Input Schema - v2.1.76
// Location: chunks.88.mjs:371
// ============================================

// READABLE (for understanding — note: activeForm is now optional):
const taskCreateInputSchema = z.strictObject({
    subject: z.string()
        .describe("Brief title for the task (required)"),

    description: z.string()
        .describe("Detailed description of what this task involves (required)"),

    // v2.1.76: activeForm is now optional (was required in v2.1.38)
    activeForm: z.string()
        .optional()
        .describe([
            "Present continuous form for spinner display (e.g., 'Refactoring auth module').",
            "If omitted, the system derives this from 'subject' automatically."
        ].join("\n")),

    metadata: z.record(z.any())
        .optional()
        .describe("Arbitrary metadata for tracking additional context")
});

// Output schema:
const taskCreateOutputSchema = z.object({
    task: z.object({
        id: z.string(),
        subject: z.string()
    })
});

// Mapping: Nh→TASK_CREATE_TOOL_NAME
```

**Why activeForm became optional:**
The change reflects that LLMs don't always know the best "active form" phrasing when creating tasks. By making it optional and auto-deriving from `subject`, the system reduces friction without losing UI quality.

---

## 6. TaskUpdate Tool

### TaskUpdate - Update task state and dependencies

**What it does:** Updates a structured task's status, owner, dependencies, and metadata.

```javascript
// ============================================
// TaskUpdate Input Schema
// Location: chunks.88.mjs:373
// ============================================

// READABLE (for understanding):
const taskUpdateInputSchema = z.strictObject({
    taskId: z.string()
        .describe("The ID of the task to update (required)"),

    subject: z.string()
        .optional()
        .describe("New brief title"),

    description: z.string()
        .optional()
        .describe("New detailed description"),

    activeForm: z.string()
        .optional()
        .describe("New present continuous form for spinner display"),

    status: z.enum(["pending", "in_progress", "completed", "deleted"])
        .optional()
        .describe("New status"),

    owner: z.string()
        .optional()
        .describe("Agent ID or name that owns this task"),

    addBlocks: z.array(z.string())
        .optional()
        .describe("Task IDs that should wait for this task to complete"),

    addBlockedBy: z.array(z.string())
        .optional()
        .describe("Task IDs that must complete before this task can start"),

    metadata: z.record(z.any())
        .optional()
        .describe("Metadata to merge into existing metadata")
});
```

### Task Status State Machine

```
pending
  │
  ├─→ in_progress  (task started)
  │         │
  │         ├─→ completed  (task finished successfully)
  │         │
  │         └─→ deleted    (task cancelled)
  │
  └─→ deleted      (task removed before starting)
```

---

## 7. TodoWrite Tool

### TodoWriteTool (bO) - Simple todo list

**What it does:** Maintains a simple, per-agent todo list for tracking progress. Replaces the entire list on each call and auto-clears when all items are completed.

```javascript
// ============================================
// TodoWriteTool - Simple todo tracking
// Location: chunks.48.mjs:773
// ============================================

// READABLE (for understanding):
const TodoWriteTool = {
    name: "TodoWrite",
    isConcurrencySafe: true,
    isReadOnly: false,

    inputSchema: z.strictObject({
        todos: z.array(z.object({
            content: z.string()
                .describe("Task description"),
            status: z.enum(["pending", "in_progress", "completed"])
                .describe("Current status"),
            activeForm: z.string()
                .optional()
                .describe("Present continuous form for spinner display")
        }))
        .describe("The complete todo list (replaces existing list)")
    }),

    async call({ todos }, context) {
        let agentId = context.agentId;
        let oldTodos = (await context.getAppState()).todos?.[agentId] ?? [];

        // Replace the entire todo list
        await context.setAppState(state => ({
            ...state,
            todos: {
                ...state.todos,
                [agentId]: todos
            }
        }));

        // Auto-clear: if all items are completed, clear the list
        if (todos.every(t => t.status === "completed")) {
            await context.setAppState(state => ({
                ...state,
                todos: {
                    ...state.todos,
                    [agentId]: []
                }
            }));
        }

        return {
            data: {
                oldTodos,
                newTodos: todos
            }
        };
    }
};

// Mapping: bO→TodoWriteTool, cg→TODO_WRITE_TOOL_NAME, Sf5→todoWriteInputSchema
```

**Key design: Replacement, not incremental update**
Each `TodoWrite` call replaces the entire list. This:
1. Keeps the schema simple (no complex diff operations)
2. Forces the LLM to always maintain a complete, consistent picture
3. Enables atomic transitions across multiple items

---

## 8. Background Task Lifecycle

### Full lifecycle of a background task

```
1. Agent tool call creates a background task:
   Task({ prompt: "...", run_in_background: true })
   → Returns { taskId: "abc-123", outputFile: "/tmp/tasks/abc-123.json" }

2. Task runs in background process:
   → Writes output to /tmp/tasks/abc-123.json
   → Updates task status in shared state

3. Parent agent monitors:
   TaskOutput({ task_id: "abc-123", block: false })
   → { retrieval_status: "not_ready", task: { status: "running", output: "..." } }

4. Parent agent waits for completion:
   TaskOutput({ task_id: "abc-123", block: true, timeout: 60000 })
   → { retrieval_status: "success", task: { status: "completed", output: "full result" } }

5. OR parent agent stops early:
   TaskStop({ task_id: "abc-123" })
   → { message: "Successfully stopped task: abc-123" }
```

---

## 9. Structured Task Lifecycle

### Full lifecycle for coordinated multi-agent work

```
Leader agent creates task graph:
  TaskCreate({ subject: "Implement auth", description: "..." })  → { id: "T1" }
  TaskCreate({ subject: "Write auth tests", description: "..." }) → { id: "T2" }

Set dependency (T2 waits for T1):
  TaskUpdate({ taskId: "T2", addBlockedBy: ["T1"] })

Assign to agents:
  TaskUpdate({ taskId: "T1", owner: "agent-001", status: "in_progress" })

Agent completes T1:
  TaskUpdate({ taskId: "T1", status: "completed" })

Now T2 can be started (T1 dependency resolved):
  TaskList()
  → [{ id: "T2", blockedBy: [], status: "pending" }]  ← T1 no longer blocking
  TaskUpdate({ taskId: "T2", owner: "agent-002", status: "in_progress" })
```

---

## 10. Related Documents

- [agent_tool.md](./agent_tool.md) - Agent tool (creates background tasks)
- [cron_tools.md](./cron_tools.md) - CronCreate/CronDelete/CronList (scheduled tasks)
- [tool_registry.md](./tool_registry.md) - Complete tool registry
- [team_tools.md](./team_tools.md) - TeamCreate/TeamDelete/SendMessage
