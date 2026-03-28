# Subagent & Background Agents Integration Analysis (Claude Code 2.1.76)

> Comprehensive analysis of how subagents (08_subagent) and background agents (26_background_agents) share infrastructure and integrate with each other.

---

## Overview

The subagent system and background agents system are deeply interconnected in Claude Code. They share:
- Task ID generation and state management
- Output file system
- Notification queue
- Tool access control
- System reminder attachments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Shared Infrastructure Layer                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Task ID Generation (oV)                          │   │
│   │                                                                      │   │
│   │   Type prefixes: a=agent, b=bash, r=remote, t=teammate, w=workflow  │   │
│   │   Format: {prefix}{8-char-alphanumeric}                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Task State Management (i9, Zf, VR)               │   │
│   │                                                                      │   │
│   │   appState.tasks = { taskId: TaskRecord, ... }                      │   │
│   │   Shared by: AgentTool, BashTool, TaskOutputTool, TaskStopTool      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Output File System (g2)                          │   │
│   │                                                                      │   │
│   │   Path: ~/.claude/tasks/{taskId}.output                             │   │
│   │   Operations: init, append, readDelta, readFull                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Notification Queue (vK1)                         │   │
│   │                                                                      │   │
│   │   Injects task_status attachments into conversation                 │   │
│   │   Shared by: All task completion handlers                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     System Reminder Attachments (vIY, di4)           │   │
│   │                                                                      │   │
│   │   task_progress: Running task updates (throttled)                   │   │
│   │   task_status: Terminal state notifications                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Consumer Systems                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  08_subagent    │   │26_background_   │   │   05_tools      │          │
│   │  AgentTool      │   │    agents       │   │  BashTool       │          │
│   │  Teammate spawn │   │  Task creation  │   │  TaskOutputTool │          │
│   └─────────────────┘   └─────────────────┘   └─────────────────┘          │
│                                                                              │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  01_CLI         │   │ 04_system_      │   │  30_agent_      │          │
│   │  /tasks command │   │   reminder      │   │    teams        │          │
│   │  Ctrl+C kill    │   │  Attachments    │   │  Teammates      │          │
│   └─────────────────┘   └─────────────────┘   └─────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Shared Components

### 1. Task ID Generation

Both subagents and background agents use the same ID generation algorithm:

```javascript
// ============================================
// Task ID Generation - Shared by all task types
// Location: chunks.41.mjs:2410-2416
// ============================================

function generateTaskId(taskType) {
    let prefix = TASK_TYPE_PREFIXES[taskType];  // a, b, r, t, w
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));
    let id = prefix;
    for (let i = 0; i < 8; i++) {
        id += CHARSET[randomBytes[i] % CHARSET.length];
    }
    return id;
}

// Examples:
// AgentTool spawn → "a3f4b2c1"
// BashTool background → "b7d9e2f4"
// Teammate spawn → "t1a2b3c4"
```

### 2. Task Record Structure

All tasks share the same base record structure:

```javascript
// ============================================
// Task Record - Base structure for all task types
// Location: chunks.41.mjs:2418-2429
// ============================================

const baseTaskRecord = {
    id: string,              // Unique task ID
    type: string,            // "local_agent" | "local_bash" | "remote_agent" | "in_process_teammate" | "local_workflow"
    status: string,          // "pending" | "running" | "completed" | "failed" | "killed"
    description: string,     // Human-readable description
    toolUseId: string,       // ID of the spawning tool use
    startTime: number,       // Creation timestamp
    outputFile: string,      // Path to output file
    outputOffset: number,    // Current read position
    notified: boolean        // Has user been notified of terminal state?
};

// Extended fields by task type:
// local_agent: agentId, prompt, selectedAgent, abortController, progress, ...
// local_bash: command, cwd, abortController, ...
// in_process_teammate: teammateName, teamName, ...
```

### 3. Output File System

All tasks write to the same output directory structure:

```
~/.claude/tasks/
├── a3f4b2c1.output     # Agent task output
├── b7d9e2f4.output     # Bash task output
├── t1a2b3c4.output     # Teammate task output
└── ...
```

Operations shared by all task types:

```javascript
// Initialization
initOutputFile(taskId);  // Creates empty file

// Writing (during execution)
appendToOutputFile(taskId, content);  // Incremental append

// Reading (for progress/completion)
let { content, newOffset } = await readOutputFileDelta(taskId, currentOffset);
let fullContent = await readFullOutput(taskId);
```

### 4. Notification Queue

All task completions flow through the same notification system:

```javascript
// ============================================
// Notification flow - Shared by all task types
// ============================================

function notifyTaskCompletion(taskId, description, status, error, output) {
    // 1. Build notification message
    let message = buildCompletionMessage(description, status, error, output);

    // 2. Inject into command queue
    enqueueCommand({
        type: "task-notification",
        value: message
    });

    // 3. Trigger system reminder attachment
    buildTaskAttachments().then(attachments => {
        // Attachments will be picked up on next LLM turn
    });
}
```

---

## Tool Access Control Inheritance

### Tool Filtering Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Tool Filtering Hierarchy                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Level 1: Base Tool Set                                                    │
│   All tools available to parent agent                                       │
│   └── Xk8 (filterToolsForSubagent) filters based on context               │
│                                                                              │
│   Level 2: Agent Type Restrictions                                          │
│   Agent definition may specify excludedTools or allowedTools               │
│   └── _c (resolveToolFilter) applies agent-specific rules                  │
│                                                                              │
│   Level 3: Background Mode Restrictions                                     │
│   CW6 (BACKGROUND_AGENT_EXCLUDED_TOOLS) blocked                            │
│   eP1 (ASYNC_AGENT_ALLOWED_TOOLS) required                                  │
│   └── Applied when isAsync=true or isBackgrounded=true                     │
│                                                                              │
│   Level 4: Teammate Mode Additions                                          │
│   WY4 (TEAM_DELEGATE_TOOLS) added                                           │
│   └── Applied when running as teammate                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tool Set Constants

```javascript
// ============================================
// Tool filtering sets - All at chunks.91.mjs:269
// ============================================

// Tools BLOCKED for background agents:
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage tasks
]);

// Tools ALLOWED for async contexts:
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "Write", "Edit", "Glob", "Grep", "Bash", "NotebookEdit",
    "WebSearch", "WebFetch", "TodoWrite", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

// Tools ADDED for teammate mode:
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
]);
```

---

## System Reminder Integration

### Attachment Types

```javascript
// ============================================
// Task-related system reminder attachments
// ============================================

// task_progress - Generated while task is running
{
    type: "attachment",
    attachment: {
        type: "task_progress",
        taskId: "a3f4b2c1",
        taskType: "local_agent",
        message: "Running Grep for 'createTaskId'...",
        usage: {
            total_tokens: 1234,
            tool_uses: 5,
            duration_ms: 12345
        }
    }
}

// task_status - Generated when task reaches terminal state
{
    type: "attachment",
    attachment: {
        type: "task_status",
        taskId: "a3f4b2c1",
        taskType: "local_agent",
        status: "completed",  // or "failed", "killed"
        description: "Search codebase for API usage",
        deltaSummary: "Found 15 occurrences in 8 files..."
    }
}
```

### Throttle Mechanism

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling.
// Location: chunks.142.mjs:2703-2717
// ============================================

function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
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

// Allow progress if turnsSinceProgress >= 3 or new task (Infinity)
```

---

## Kill Flow Integration

### Kill Handler Dispatch

```javascript
// ============================================
// Kill handler dispatch - Routes to correct handler by task type
// ============================================

function getKillHandlerForType(taskType) {
    switch (taskType) {
        case "local_agent":
            return LocalAgentTaskHandler;  // Fk1
        case "local_bash":
            return LocalBashTaskHandler;   // Lf6
        case "remote_agent":
            return RemoteAgentTaskHandler; // Fn4
        case "in_process_teammate":
            return InProcessTeammateHandler;
        default:
            return null;
    }
}

// Each handler implements:
// - kill(taskId, setAppState) - Terminates the task
// - cleanup(taskId) - Cleans up resources
```

### Kill Flow Sequence

```
User presses Ctrl+C / Ctrl+F
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│  Check hasRunningAgents:                                       │
│  tasks.some(t => t.type === "local_agent" &&                  │
│                    t.status === "running")                     │
└────────────────────────────┬──────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼ false                       ▼ true
     Cancel current stream        Kill All Running Agents
                                        │
                                        ▼
                        ┌───────────────────────────────────┐
                        │ For each running local_agent:     │
                        │                                   │
                        │ 1. getKillHandlerForType(task.type)│
                        │ 2. handler.kill(taskId)            │
                        │    → abortController.abort("killed")│
                        │ 3. markTaskKilled(taskId)          │
                        │ 4. collect description             │
                        └───────────────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────────┐
                        │ Build notification message:        │
                        │                                   │
                        │ Single: "Background agent         │
                        │         '{desc}' was stopped"     │
                        │ Multiple: "{n} background agents   │
                        │           were stopped: ..."      │
                        └───────────────────────────────────┘
```

---

## State Synchronization

### Shared State Access

Both subagents and background agents access the same application state:

```javascript
// ============================================
// Shared state access patterns
// ============================================

// Reading state
let tasks = getAppState().tasks;
let runningTasks = Object.values(tasks).filter(t => t.status === "running");

// Updating state
setAppState((state) => ({
    ...state,
    tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], status: "completed" }
    }
}));

// Atomic task update
atomicUpdateTask(taskId, setAppState, (task) => ({
    ...task,
    progress: { ...task.progress, toolUseCount: count }
}));
```

### Race Condition Handling

```javascript
// ============================================
// Race condition prevention
// ============================================

// Use atomicUpdateTask to prevent race conditions:
atomicUpdateTask(taskId, setAppState, (task) => {
    // Check state before modifying
    if (task.status !== "running") return task;  // No change

    // Return new state
    return { ...task, status: "completed" };
});

// Use notified flag to prevent duplicate notifications:
if (task.notified) return;  // Already notified

markTaskNotified(taskId, setAppState);
showNotification(message);
```

---

## Integration Points Summary

| Component | 08_subagent | 26_background_agents | Shared Symbols |
|-----------|-------------|---------------------|----------------|
| Task ID | AgentTool uses | BashTool uses | `oV`, `V$3`, `G97` |
| Task State | AgentTool creates | BashTool creates | `RG`, `Zf`, `i9`, `VR` |
| Output Files | Agent writes | Bash writes | `g2`, `ZK1`, `WjA` |
| Kill Handling | LocalAgentTaskHandler | LocalBashTaskHandler | `U4q`, `x66`, `d4q` |
| Notifications | Agent completion | Bash completion | `vK1`, `$m8`, `Hm8` |
| System Reminders | task_status | task_status | `suY`, `wY4`, `OY4` |
| Tool Filtering | filterToolsForSubagent | Background tool sets | `Xk8`, `CW6`, `eP1` |

---

## Source Code Verification

### Verified Shared Symbols

| Symbol | Readable | Location | Shared By |
|--------|----------|----------|-----------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | All task types |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | All task types |
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | All task types |
| `Zf` | registerTask | chunks.90.mjs:3019 | All task types |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | All task types |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | Ctrl+C handler |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | Kill handlers |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | Kill flow |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | Completion |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | Error handling |
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | System reminders |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | Output polling |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | State updates |
| `TIY` | countUniqueUris | chunks.144.mjs:832 | LSP call hierarchy |
| `vIY` | countUniqueIncomingFileCount | chunks.144.mjs:837 | LSP call hierarchy |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Tool filtering |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Tool filtering |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Teammate mode |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | Tool filtering |

> **CRITICAL CORRECTIONS (2026-03-27):**
> - `vIY`, `di4`, `TIY` were incorrectly mapped to system reminder functions.
>   Correct symbols for system reminders are `suY`, `wY4`, `OY4`.
> - `TIY` is `countUniqueUris` / `getUniqueOutgoingFileCount` at `chunks.144.mjs:832` - used for LSP call hierarchy, NOT progress throttling.
> - `vIY` is `countUniqueIncomingFileCount` at `chunks.144.mjs:837` - also LSP call hierarchy.
> - `di4` is `createTeammatePaneInSwarmView` at `chunks.135.mjs:292` - teammate UI, not reminders.

---

## Related Documents

- [../08_subagent/README.md](../08_subagent/README.md) - Subagent system overview
- [../08_subagent/abort_signal_propagation.md](../08_subagent/abort_signal_propagation.md) - Abort signals
- [../26_background_agents/README.md](../26_background_agents/README.md) - Background agents overview
- [../26_background_agents/task_lifecycle.md](../26_background_agents/task_lifecycle.md) - Task lifecycle
- [../26_background_agents/kill_handlers.md](../26_background_agents/kill_handlers.md) - Kill handlers
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - Attachments