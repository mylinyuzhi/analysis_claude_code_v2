# Background Agents — Slash Commands Integration (Claude Code 2.1.38)

> Analysis of how background tasks integrate with slash commands: `/tasks` command implementation,
> task list display, and CLI flags for task management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getTaskList` (WM) - Returns list of tasks for display — `chunks.140.mjs`
- `findTaskById` (lg) - Looks up a specific task — `chunks.140.mjs`
- `deleteTask` (sq6) - Removes a task from the list — `chunks.141.mjs`
- `TOOL_NAME_TASK_LIST` (TK1) - Constant "TaskList" — `chunks.89.mjs:596`
- `TOOL_NAME_TASK_GET` (NK1) - Constant "TaskGet" — `chunks.89.mjs:594`
- `TOOL_NAME_TASK_CREATE` (Nh) - Constant "TaskCreate" — `chunks.88.mjs:371`
- `TOOL_NAME_TASK_UPDATE` (DR) - Constant "TaskUpdate" — `chunks.88.mjs:373`

---

## Overview

Background tasks are managed through several interfaces:

1. **`/tasks` slash command** - CLI command to list and manage tasks
2. **TaskList tool** - Programmatic task listing for LLMs
3. **TaskGet tool** - Retrieve specific task details
4. **CLI flags** - `--resume` for resuming sessions with tasks

---

## Deep Analysis: Task List Tools

### TaskList Tool

**What it does:** Returns a summary of all tasks in the current session for the LLM to review.

```javascript
// ============================================
// TaskList tool - Lists all tasks
// Location: chunks.140.mjs
// ============================================

// TaskList tool returns structured task information:
const TaskListTool = {
    name: "TaskList",
    description: "Returns a list of all tasks in the current session. Use this to see what tasks exist.",

    async call({}, toolUseContext) {
        let appState = await toolUseContext.getAppState();
        let tasks = appState.tasks ?? {};

        let taskList = Object.values(tasks).map(task => ({
            id: task.id,
            type: task.type,
            status: task.status,
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime,
            outputFile: task.outputFile
        }));

        return {
            tasks: taskList,
            totalCount: taskList.length,
            runningCount: taskList.filter(t => t.status === "running").length,
            completedCount: taskList.filter(t => t.status === "completed").length
        };
    }
};
```

### TaskGet Tool

**What it does:** Retrieves detailed information about a specific task.

```javascript
// ============================================
// TaskGet tool - Get task details
// Location: chunks.140.mjs
// ============================================

const TaskGetTool = {
    name: "TaskGet",
    inputSchema: z.object({
        taskId: z.string().describe("The ID of the task to retrieve")
    }),

    async call({ taskId }, toolUseContext) {
        let appState = await toolUseContext.getAppState();
        let task = appState.tasks?.[taskId];

        if (!task) {
            throw Error(`Task not found: ${taskId}`);
        }

        // Read current output from file
        let output = readFullOutput(taskId);

        return {
            id: task.id,
            type: task.type,
            status: task.status,
            description: task.description,
            prompt: task.prompt,
            startTime: task.startTime,
            endTime: task.endTime,
            outputFile: task.outputFile,
            progress: task.progress,
            output: output,
            usage: task.usage
        };
    }
};
```

### TaskCreate Tool

**What it does:** Creates a structured task entry for the todo list system (distinct from background tasks).

```javascript
// ============================================
// TaskCreate tool - Create a task
// Location: chunks.88.mjs:371
// ============================================

// ORIGINAL (for source lookup):
Nh = "TaskCreate"

// READABLE (for understanding):
const TOOL_NAME_TASK_CREATE = "TaskCreate";

// Note: TaskCreate is for the todo list system, not background agents.
// Background agents are created via the Agent tool with run_in_background=true.

// Mapping: Nh→TOOL_NAME_TASK_CREATE
```

---

## Deep Analysis: CLI Integration

### Task-Related CLI Flags

```javascript
// CLI flags for task management:
// --resume <sessionId>   Resume a session with its background tasks
// --tasks                 List tasks (if implemented as direct command)

// Resume flow:
// 1. Load session transcript from ~/.claude/sessions/<sessionId>.jsonl
// 2. Reconstruct appState.tasks from transcript
// 3. Check status of each task (running tasks may need to be marked as failed)
// 4. Resume main loop with restored task state
```

### Session Resume with Tasks

**What happens when resuming a session with running background tasks:**

```javascript
// ============================================
// resumeSession - Session restoration
// Location: chunks.142.mjs:379
// ============================================

// ORIGINAL (for source lookup):
async function yt(A, q) {
    try {
        let K = null,
            Y = null,
            z;
        if (A === void 0) K = await jyA(0);
        else if (q) {
            Y = [];
            for (let H of await ZQ(q)) {
                if (H.type === "assistant" || H.type === "user") {
                    let $ = PhY(H);
                    if ($) Y.push($)
                }
                z = H.session_id
            }
        } else if (typeof A === "string") K = await DyA(A), z = A;
        else K = A;
        // ...
    } catch (K) {
        throw K1(K), K
    }
}

// READABLE (for understanding):
async function resumeSession(sessionId, remoteSessionPath) {
    try {
        let transcript = null;
        let messages = null;

        if (sessionId === undefined) {
            // Resume most recent local session
            transcript = await loadMostRecentSession();
        } else if (remoteSessionPath) {
            // Resume from remote session file
            messages = [];
            for (let entry of await readRemoteSessionFile(remoteSessionPath)) {
                if (entry.type === "assistant" || entry.type === "user") {
                    let converted = convertToMessageFormat(entry);
                    if (converted) messages.push(converted);
                }
            }
        } else if (typeof sessionId === "string") {
            // Resume specific local session
            transcript = await loadSessionFile(sessionId);
        } else {
            // Already a transcript object
            transcript = sessionId;
        }

        // ... process transcript and restore state ...

        // Tasks are restored from transcript.appState.tasks
        // Running tasks from previous session are marked as "interrupted"
    } catch (error) {
        logError(error);
        throw error;
    }
}

// Mapping: yt→resumeSession, jyA→loadMostRecentSession, ZQ→readRemoteSessionFile,
//   PhY→convertToMessageFormat, DyA→loadSessionFile
```

**Key insight:** When a session is resumed, background tasks that were "running" at the time of the previous session's end are typically marked as "interrupted" or "failed" since the parent process was terminated.

---

## Task List Display UI

### Task Status Indicators

```
[running]   - Task is currently executing
[completed] - Task finished successfully
[failed]    - Task encountered an error
[killed]    - Task was manually stopped
[pending]   - Task is queued but not started
```

### Task List Component

```javascript
// Task list rendering shows:
// - Task ID (short form)
// - Status indicator
// - Description
// - Duration
// - Output file path for background tasks

// Example output:
// ┌─ Background Tasks ─────────────────────────────┐
// │ [running] a3f4b2 - Search for X (2m 30s)       │
// │   Output: ~/.claude/tasks/a3f4b2.output        │
// │                                                │
// │ [completed] b7e8c1 - Run tests (45s)           │
// │   Output: ~/.claude/tasks/b7e8c1.output        │
// └────────────────────────────────────────────────┘
```

---

## Task Management Actions

### Stop Task

**How users stop background tasks:**

1. **Via TaskStop tool** - LLM uses the TaskStop tool with task_id
2. **Via /tasks UI** - User selects a task and chooses "Stop"
3. **Via keyboard shortcut** - Interrupt key during task display

```javascript
// TaskStop flow from CLI:
// 1. User invokes TaskStop or selects "Stop" in UI
// 2. getKillHandlerForType(task.type) returns appropriate handler
// 3. handler.kill(task, context) executes
// 4. Task status updated to "killed"
// 5. Notification sent to conversation
```

### View Output

**How users view task output:**

1. **Via TaskOutput tool** - LLM uses the tool with task_id and block=false
2. **Via Read tool** - LLM reads the output file directly
3. **Via Bash tail** - LLM uses `tail -f` for streaming output

```javascript
// Output viewing options:
// - TaskOutput({ task_id: "a3f4b2", block: false })
//   → Returns current output snapshot

// - Read({ file_path: "~/.claude/tasks/a3f4b2.output" })
//   → Returns full output

// - Bash({ command: "tail -f ~/.claude/tasks/a3f4b2.output" })
//   → Streams output in real-time
```

---

## Integration Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI Entry Point                              │
│                                                                 │
│  claude --resume <sessionId>                                   │
│  claude (interactive) → /tasks command                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Session Resume / Task State Restoration            │
│                                                                 │
│  1. Load transcript from ~/.claude/sessions/                   │
│  2. Restore appState.tasks                                     │
│  3. Mark stale "running" tasks as "interrupted"               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Task List Display                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [running] a3f4b2 - Search for X (2m 30s)               │   │
│  │   Output: ~/.claude/tasks/a3f4b2.output                │   │
│  │                                                         │   │
│  │ [completed] b7e8c1 - Run tests (45s)                   │   │
│  │   Output: ~/.claude/tasks/b7e8c1.output                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Actions: [Stop] [View Output] [Refresh]                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ TaskStopTool  │   │ TaskOutputTool│   │ Read/Bash     │
│               │   │               │   │               │
│ Kill handler  │   │ Get current   │   │ Read output   │
│ dispatch      │   │ output        │   │ file directly │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## Structured Task Tools vs Background Tasks

### Distinction

| Feature | Structured Tasks (Todo) | Background Tasks (Agents) |
|---------|------------------------|---------------------------|
| Purpose | Planning and tracking | Parallel execution |
| Creation | TaskCreate tool | Agent tool with run_in_background |
| State | pending/in_progress/completed | running/completed/failed/killed |
| Output | Not applicable | Output file with streaming |
| Management | TaskUpdate tool | TaskOutput/TaskStop tools |

### Tool Names

```javascript
// Structured Task Tools (Todo List):
TOOL_NAME_TASK_CREATE = "TaskCreate"  // Create a task entry
TOOL_NAME_TASK_GET = "TaskGet"        // Get task details
TOOL_NAME_TASK_LIST = "TaskList"      // List all tasks
TOOL_NAME_TASK_UPDATE = "TaskUpdate"  // Update task status

// Background Task Tools:
TOOL_NAME_TASK_OUTPUT = "TaskOutput"  // Get background task output
TOOL_NAME_TASK_STOP = "TaskStop"      // Stop background task

// The Agent tool creates background tasks:
TOOL_NAME_AGENT = "Task"  // The Agent tool itself
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Separate tool namespaces | Structured tasks and background tasks serve different purposes |
| Output file exposure | LLM can use existing Read/Bash tools to check progress |
| Session resume marks running as interrupted | Can't trust stale "running" state after restart |
| Task ID prefixes | Quick visual identification of task type |
| Task list in system reminder | Keeps user informed without blocking |