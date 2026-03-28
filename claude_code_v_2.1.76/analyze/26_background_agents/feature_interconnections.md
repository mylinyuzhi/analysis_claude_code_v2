# Background Agents — Feature Interconnections (Claude Code 2.1.76)

> Comprehensive analysis of how background agents integrate with other Claude Code systems:
> System Reminders, Subagent Execution, Tools, Task System, Hooks, Compact, and Agent Teams.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getUnifiedTasksAttachment` (vIY) - Main attachment producer for system reminders — `chunks.142.mjs:2719`
- `buildTaskAttachments` (di4) - Builds task_status and task_progress attachments — `chunks.142.mjs:1711`
- `AgentTool` (rj1) - The Agent/Task tool with run_in_background support — `chunks.132.mjs:85`
- `LocalAgentTaskHandler` (Fk1) - Kill handler for local agents — `chunks.146.mjs:2292`
- `LocalBashTaskHandler` (Lf6) - Kill handler for shell commands — `chunks.133.mjs:2542`
- `filterToolsForContext` - Tool filtering for background contexts — `chunks.90.mjs`

---

## Overview

Background agents are deeply integrated with multiple Claude Code subsystems. This document maps all integration points and analyzes the data flow between systems.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Integration Architecture                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │ 04_system_   │    │ 08_subagent  │    │ 05_tools     │                 │
│   │ reminder     │◀───│ Execution    │◀───│ AgentTool    │                 │
│   │              │    │              │    │ BashTool     │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                   │                          │
│          ▼                   ▼                   ▼                          │
│   ┌──────────────────────────────────────────────────────────┐             │
│   │                    26_background_agents                    │             │
│   │                                                            │             │
│   │  • Task State Management (appState.tasks)                 │             │
│   │  • Output File System (~/.claude/tasks/*.output)          │             │
│   │  • Kill Handlers (LocalAgent, LocalBash, Remote)          │             │
│   │  • Progress Tracking (updateTaskProgress)                 │             │
│   │  • Notification Queue (notifyTaskCompletion)              │             │
│   └──────────────────────────┬───────────────────────────────┘             │
│                             │                                                │
│          ┌──────────────────┼──────────────────┐                            │
│          ▼                  ▼                  ▼                            │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │ 13_task_     │   │ 11_hooks     │   │ 07_compact   │                   │
│   │ system       │   │ PreToolUse   │   │ Transcript   │                   │
│   │ Structured   │   │ PostToolUse  │   │ Filtering    │                   │
│   │ Tasks        │   │              │   │              │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                                                              │
│   ┌──────────────┐   ┌──────────────┐                                       │
│   │ 30_agent_    │   │ CLI          │                                       │
│   │ teams        │   │ /tasks       │                                       │
│   │ Teammates    │   │ Ctrl+F kill  │                                       │
│   └──────────────┘   └──────────────┘                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 1: System Reminder System (04_system_reminder)

### Overview

Background tasks surface their state to the conversation through the system reminder system. Two specialized reminder types keep users informed without blocking.

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Agent Loop Iteration                                  │
│  (every LLM turn, before processing)                                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              getUnifiedTasksAttachment (vIY)                             │
│                                                                          │
│  1. Get appState.tasks                                                  │
│  2. Call buildTaskAttachments(di4)                                      │
│     • Check all task states                                             │
│     • For running tasks: generate task_progress                         │
│     • For completed/failed/killed: generate task_status                 │
│  3. Apply frequency throttle (3 turns)                                  │
│  4. Update outputOffset for each task                                   │
│  5. Return attachments array                                             │
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

### task_status Attachment

**When generated:** Task status changes from "running" to "completed", "failed", or "killed".

**Structure:**
```javascript
{
    type: "task_status",
    taskId: "a3f4b2",
    taskType: "local_agent",
    status: "completed",
    description: "Search codebase for API usage",
    deltaSummary: "Found 15 occurrences in 8 files..."
}
```

**Key insight:** The `deltaSummary` contains only new output since the last notification, using `readOutputFileDelta(task.id, task.outputOffset)`.

### task_progress Attachment

**When generated:** Task is running and frequency throttle is satisfied (≥3 turns since last progress).

**Structure:**
```javascript
{
    type: "task_progress",
    taskId: "a3f4b2",
    taskType: "local_agent",
    message: "Running npm install..."
}
```

**Throttle mechanism:**

```javascript
// ============================================
// countTurnsSinceLastProgressInline - Progress frequency calculator
// Location: chunks.142.mjs:2703-2717
// ============================================

// > **CORRECTION:** `TIY` is actually `countUniqueUris` (counts unique URIs for LSP). The function below describes an INLINE progress throttling mechanism, NOT the TIY function. See `key_algorithms_deep_dive.md` Algorithm 10.

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
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
```

**Why this approach:**
- **Backwards iteration** efficiently finds the most recent progress without scanning entire history
- **Infinity default** for new tasks ensures first progress is always shown
- **3-turn threshold** balances informativeness with noise reduction

---

## Integration 2: Subagent Execution System (08_subagent)

### Overview

The AgentTool (`rj1`) is the primary entry point for spawning background agents. When `run_in_background=true`, it creates a detached execution context.

### Spawn Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AgentTool.call()                                     │
│                    run_in_background=true                               │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Task Creation (createAsyncTask)                            │
│                                                                          │
│  1. Generate unique taskId (createTaskId)                               │
│     • Type prefix: "a" for local_agent                                  │
│     • 8 random alphanumeric chars                                       │
│  2. Create AbortController for cancellation                             │
│  3. Initialize output file (~/.claude/tasks/{taskId}.output)            │
│  4. Register task in appState.tasks with status "running"               │
│  5. Set background: true (v2.1.76)                                      │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Detached Execution Context                                  │
│                                                                          │
│  p01() wrapper (session context)                                        │
│  └── dR() agent loop (async generator)                                  │
│      └── For each message:                                              │
│          • updateTaskProgress() - Record turn progress                  │
│          • appendToOutputFile() - Write to .output file                 │
│          • Check abortController.signal.aborted                         │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Completion Handling                                         │
│                                                                          │
│  On success:                                                             │
│  • markTaskCompleted(agentId, result, usage)                            │
│  • notifyTaskCompletion(agentId, desc, "completed", ...)                │
│                                                                          │
│  On failure:                                                             │
│  • markTaskFailed(agentId, error)                                       │
│  • notifyTaskCompletion(agentId, desc, "failed", error, ...)            │
│                                                                          │
│  On abort:                                                               │
│  • abortController.abort("killed")                                      │
│  • notifyTaskCompletion(agentId, desc, "killed", ...)                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tool Access Control Inheritance

Background agents inherit tool access control from their parent context:

```javascript
// ============================================
// Tool filtering for background agents
// ============================================

// READABLE (for understanding):
function filterToolsForBackground({ tools, isBuiltIn, permissionMode }) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (tool.name === "ExitPlanMode" && permissionMode === "plan") return true;

        // Block interactive/blocked tools
        if (BACKGROUND_AGENT_BLOCKED_TOOLS.has(tool.name)) return false;

        // For async contexts, only allow explicitly compatible tools
        if (!ASYNC_COMPATIBLE_TOOLS.has(tool.name)) return false;

        return true;
    });
}
```

**Blocked tools:**
| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval flow |
| `EnterPlanMode` | Requires user approval flow |
| `Task` | Could spawn nested background agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background agents shouldn't manage other tasks |

**Allowed tools:**
| Tool | Why Safe |
|------|----------|
| `Read`, `Write`, `Edit` | File operations - core capability |
| `Bash` | Shell commands - core capability |
| `Grep`, `Glob` | Search - non-blocking |
| `WebFetch`, `WebSearch` | Network - async-safe |
| `TodoWrite` | Task management - useful for tracking |
| `Skill` | Skill invocation - controlled execution |

### AbortController Cancellation

Background agents use `AbortController` for graceful termination:

```javascript
// ============================================
// AbortController pattern for background agents
// ============================================

// Creation
let abortController = createAbortController();
task.abortController = abortController;

// Agent loop checks signal
while (!abortController.signal.aborted) {
    // Process next message
}

// On kill
abortController.abort("killed");
```

**Cooperative cancellation:** The agent loop checks `signal.aborted` between turns, allowing in-progress tool calls to complete gracefully.

---

## Integration 3: Tools System (05_tools)

### AgentTool Integration

The AgentTool (`rj1`) provides the `run_in_background` parameter:

```javascript
// ============================================
// AgentTool schema with run_in_background
// Location: chunks.136.mjs:1450
// ============================================

// READABLE (for understanding):
const agentInputSchema = z.object({
    description: z.string().describe("A short (3-5 word) description"),
    prompt: z.string().describe("The task for the agent"),
    subagent_type: z.string().describe("Agent type to use"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional(),
    resume: z.string().optional(),
    run_in_background: z.boolean().optional().describe(
        "Set to true to run in background. Notified on completion."
    ),
    max_turns: z.number().int().positive().optional()
});
```

### BashTool Integration

BashTool provides three backgrounding modes:

```javascript
// ============================================
// BashTool background modes
// ============================================

// MODE 1: Explicit background
if (run_in_background === true && !BACKGROUND_TASKS_DISABLED) {
    let taskId = await LocalBashTaskHandler.spawn({ command, ... });
    return { stdout: "", stderr: "", code: 0, backgroundTaskId: taskId };
}

// MODE 2: Timeout background (2 seconds)
let deadline = Date.now() + 2000;
while (true) {
    let result = await Promise.race([
        shellPromise,
        sleepUntil(deadline)
    ]);
    if (result) return result;
    // Show "Background this command?" UI hint
}

// MODE 3: User interrupt background
if (abortController.signal.aborted && abortController.signal.reason === "interrupt") {
    return { stdout: "", backgroundTaskId, backgroundedByUser: true };
}
```

### TaskOutputTool Integration

```javascript
// ============================================
// TaskOutputTool - Poll background task output
// ============================================

const TaskOutputTool = {
    name: "TaskOutput",
    inputSchema: z.object({
        task_id: z.string(),
        block: z.boolean().default(true),
        timeout: z.number().default(30000)
    }),

    async call({ task_id, block, timeout }, context) {
        let appState = await context.getAppState();
        let task = appState.tasks[task_id];

        if (block && task.status === "running") {
            // Wait for completion with timeout
            await waitForTaskCompletion(task_id, timeout);
        }

        let output = await readFullOutput(task_id);
        return { output, status: task.status };
    }
};
```

### TaskStopTool Integration

```javascript
// ============================================
// TaskStopTool - Kill background task
// ============================================

const TaskStopTool = {
    name: "TaskStop",
    inputSchema: z.object({
        task_id: z.string()
    }),

    async call({ task_id }, context) {
        let appState = await context.getAppState();
        let task = appState.tasks[task_id];

        if (task.status !== "running") {
            throw Error(`Task ${task_id} is not running`);
        }

        // Dispatch to appropriate kill handler
        let handler = getKillHandlerForType(task.type);
        await handler.kill(task, { setAppState: context.setAppState });

        return { success: true, taskId: task_id };
    }
};
```

---

## Integration 4: Task System (13_task_system)

### Relationship Between Systems

The **structured task system** and **background task system** are separate but complementary:

| Aspect | Structured Tasks | Background Tasks |
|--------|-----------------|------------------|
| Purpose | Project planning & tracking | Async execution |
| Storage | `.claude/tasks/` JSON files | `appState.tasks` in memory |
| Lifecycle | Manual create/update/delete | Automatic spawn/complete |
| Visibility | TodoWrite tool | TaskOutput tool |
| Persistence | Survives sessions | Session-only |

### Dependency Tracking

Structured tasks can have dependencies (`addDependency`). Background tasks do not have explicit dependencies but can be chained via the conversation:

```
LLM: "I'll run this in background, then start the next task when it completes"
      ↓
Agent runs Task A with run_in_background=true
      ↓
... continues other work ...
      ↓
task_notification arrives with A's results
      ↓
LLM: "Now I'll run Task B using A's output"
```

### Shared Infrastructure

Both systems share some infrastructure:

```javascript
// Shared from chunks.41.mjs
createTaskId(type);  // Used for both structured and background tasks
```

---

## Integration 5: Hooks System (11_hooks)

### PreToolUse Hook Integration

Background agents still execute hooks, but with restrictions:

```javascript
// ============================================
// PreToolUse hook execution in background context
// ============================================

async function* executePreToolHooksForBackground(toolName, input, context) {
    // Background agents can't block on user input
    // Hooks that require user confirmation are auto-approved or skipped

    let hooks = resolveHooksForEvent("PreToolUse", context);

    for (let hook of hooks) {
        let result = await executeHook(hook, { toolName, input });

        if (result.block) {
            // For background agents, log the block but don't throw
            log(`Background agent blocked by hook: ${hook.name}`);
            yield { blocked: true, reason: result.reason };
            return;
        }

        yield result;
    }
}
```

### PostToolUse Hook Integration

```javascript
// ============================================
// PostToolUse captures output for background tasks
// ============================================

async function* executePostToolHooksForBackground(toolName, input, output, context) {
    // Write tool output to background task's output file
    if (context.isBackgroundTask && output.stdout) {
        appendToOutputFile(context.taskId, output.stdout);
    }

    // Execute normal hooks
    let hooks = resolveHooksForEvent("PostToolUse", context);
    for (let hook of hooks) {
        yield await executeHook(hook, { toolName, input, output });
    }
}
```

### SubagentStart Hook

When a background agent spawns:

```javascript
// ============================================
// SubagentStart hook for background agents
// ============================================

async function executeSubagentStartHooks(agentId, prompt, context) {
    let hooks = resolveHooksForEvent("SubagentStart", context);

    for (let hook of hooks) {
        let result = await executeHook(hook, { agentId, prompt, isBackground: true });

        if (result.block) {
            throw Error(`Background agent blocked by hook: ${result.reason}`);
        }
    }
}
```

---

## Integration 6: Compact System (07_compact)

### Transcript Filtering

Background agent messages are handled specially during compaction:

```javascript
// ============================================
// Transcript filtering for background tasks
// ============================================

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

### State Preservation

Task state is preserved across compactions:

```javascript
// ============================================
// Task state preservation during compact
// ============================================

function collectTasksToKeep(appState) {
    // Keep all task records in state
    let tasks = Object.values(appState.tasks);

    // For running tasks, include current progress
    return tasks.map((task) => ({
        id: task.id,
        type: task.type,
        status: task.status,
        description: task.description,
        progress: task.progress
    }));
}
```

### Output File Handling

Output files are NOT compacted - they persist independently:

```
~/.claude/tasks/
├── a3f4b2.output    ← Persists across compactions
├── b7c4e1.output    ← Can be read at any time
└── ...
```

---

## Integration 7: Agent Teams (30_agent_teams)

### In-Process Teammate Tasks

Teammate agents use the background task infrastructure with type `in_process_teammate`:

```javascript
// ============================================
// Teammate task creation
// ============================================

async function spawnInProcessTeammate(config) {
    let taskId = createTaskId("in_process_teammate");  // Prefix "t"

    let task = {
        ...createTaskRecord(taskId, "in_process_teammate", config.description),
        type: "in_process_teammate",
        status: "running",
        agentId: taskId,
        teamContext: config.teamContext,
        abortController: createAbortController()
    };

    registerTask(task, setAppState);
    return { taskId, agentId: taskId };
}
```

### Team Mailbox Communication

Teammates communicate via file-based mailboxes:

```javascript
// ============================================
// Team mailbox for background teammates
// ============================================

// Write message to teammate's inbox
writeToMailbox({
    teamName: "my-team",
    agentName: "worker-1",
    message: {
        type: "plan_approval_request",
        plan: "..."
    }
});

// Teammate polls inbox
let messages = readMailbox({
    teamName: "my-team",
    agentName: "worker-1"
});
```

### Plan Approval Flow

Background teammates can request plan approval from the team leader:

```
Background Teammate                    Team Leader
       │                                    │
       │  writeToMailbox(plan_request)      │
       │────────────────────────────────────▶│
       │                                    │
       │                                    │ Review plan
       │                                    │
       │  readMailbox()                     │
       │◀────────────────────────────────────│
       │  { approval: true }                │
       │                                    │
       │  Continue execution                │
```

---

## Integration 8: CLI System

### /tasks Command

The `/tasks` slash command lists and manages background tasks:

```javascript
// ============================================
// /tasks command integration
// ============================================

const tasksCommand = {
    name: "tasks",
    description: "List and manage background tasks",

    async execute(context) {
        let appState = await context.getAppState();
        let tasks = Object.values(appState.tasks);

        // Group by status
        let running = tasks.filter(t => t.status === "running");
        let completed = tasks.filter(t => t.status === "completed");
        let failed = tasks.filter(t => t.status === "failed");

        return {
            output: formatTaskList({ running, completed, failed })
        };
    }
};
```

### Ctrl+F Kill All (v2.1.76)

```javascript
// ============================================
// Ctrl+F kills all running background agents
// ============================================

function handleCtrlF(context) {
    let appState = context.getAppState();
    let runningAgents = Object.values(appState.tasks).filter(
        t => t.type === "local_agent" && t.status === "running"
    );

    for (let agent of runningAgents) {
        killTask(agent.id, context.setAppState);
    }

    // Partial results preserved in output files
    showNotification(`Killed ${runningAgents.length} agents`);
}
```

---

## Design Decisions Summary

| Integration | Key Decision | Rationale |
|-------------|--------------|-----------|
| System Reminder | Two attachment types (status/progress) | Status needs immediate notification; progress can be throttled |
| Subagent | AbortController for cancellation | Cooperative cancellation allows graceful tool completion |
| Tools | Blocklist + allowlist | Prevent interactive tools from hanging background agents |
| Task System | Separate from structured tasks | Different lifecycle and persistence requirements |
| Hooks | Background-compatible execution | Hooks must not block indefinitely in background context |
| Compact | Preserve task state and output files | Output files are independent communication channel |
| Agent Teams | in_process_teammate type | Same infrastructure, different semantics |
| CLI | Ctrl+F kill all | Efficient bulk cleanup without per-task UI |

---

## Cross-System Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Complete Event Flow                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User: "Run tests in background"
        │
        ▼
┌─────────────────────┐
│ LLM generates:       │
│ BashTool.call({      │
│   command: "npm test",│
│   run_in_background: true│
│ })                   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BashTool checks BACKGROUND_TASKS_DISABLED                                    │
│ └── If disabled: run synchronously (no background)                          │
│ └── If enabled: createAsyncTask                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task Creation                                                                │
│ • createTaskId("local_bash") → "b7c4e1"                                     │
│ • createTaskRecord()                                                         │
│ • registerTask() in appState.tasks                                          │
│ • initOutputFile()                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LocalBashTaskHandler.spawn()                                                 │
│ • Create shell process                                                       │
│ • Register cleanup handler                                                   │
│ • Return { taskId: "b7c4e1" }                                               │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tool returns immediately:                                                    │
│ { status: "async_launched", backgroundTaskId: "b7c4e1", outputFile: "..." } │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (background execution continues)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background Execution Loop                                                    │
│ • Shell writes stdout to output file                                         │
│ • Progress tracked via outputOffset                                          │
│ • Periodic updateTaskProgress() calls                                        │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (each LLM turn)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ System Reminder Integration                                                  │
│ • getUnifiedTasksAttachment() called                                         │
│ • buildTaskAttachments() checks all tasks                                    │
│ • task_progress generated (if throttle satisfied)                           │
│ • Injected into conversation as system-reminder                             │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (task completes)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Completion Handling                                                          │
│ • Shell process exits                                                        │
│ • markTaskCompleted() / markTaskFailed()                                     │
│ • notifyTaskCompletion()                                                     │
│   - Sets notified: true                                                      │
│   - Builds XML notification                                                  │
│   - Enqueues with mode: "task-notification"                                 │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Main Loop Receives Notification                                              │
│ • task_notification message in queue                                         │
│ • Displayed to user                                                          │
│ • LLM can process result                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

Background agents form a central hub connecting multiple Claude Code subsystems:

1. **System Reminders** - Surface task state to conversation
2. **Subagent Execution** - Spawn and manage async agents
3. **Tools** - AgentTool, BashTool, TaskOutput, TaskStop
4. **Task System** - Complementary structured task tracking
5. **Hooks** - Background-compatible hook execution
6. **Compact** - State preservation and transcript filtering
7. **Agent Teams** - In-process teammate infrastructure
8. **CLI** - /tasks command and Ctrl+F kill

This deep integration enables powerful async workflows while maintaining safety through tool access control and graceful cancellation.

---

## Source Code Verification

### Verified Symbol Locations (2026-03-26)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `vIY` | getUnifiedTasksAttachment | chunks.142.mjs:2719 | ✓ Verified |
| `di4` | buildTaskAttachments | chunks.142.mjs:1711 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `Fk1` | LocalAgentTaskHandler | chunks.146.mjs:2292 | ✓ Verified |
| `Lf6` | LocalBashTaskHandler | chunks.133.mjs:2542 | ✓ Verified |

### Key Integration Symbol Summary

| Integration | Key Symbols |
|-------------|-------------|
| System Reminders | `vIY`, `di4`, `TIY`, `Nqq` |
| Subagent Execution | `U4q`, `d4q`, `$m8`, `Hm8` |
| Tools | `QW6`, `J4`, `kW6`, `vW6` |
| Task System | `oV`, `RG`, `Zf`, `i9` |
| Hooks | `r24`, `zZ6` |
| CLI | `U4q`, `d4q`, keyboard handlers |

### Incorrect Mappings Corrected

| Symbol | Wrong Mapping | Correct Mapping |
|--------|---------------|-----------------|
| `Kd7` | killAllRunningAgents | Crypto module - Use `U4q` instead |
| `yjA` | markTaskCompleted | Constant - Use `$m8` instead |
| `CjA` | markTaskFailed | Constant - Use `Hm8` instead |