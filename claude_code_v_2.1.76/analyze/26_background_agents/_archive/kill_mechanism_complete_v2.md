# Kill Mechanism Complete V2 - Background Agents (Claude Code 2.1.76)

> Complete source-level documentation of the background agent kill mechanism including abort signal propagation, kill handlers by task type, and UI integration with verified symbol mappings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `wQ6` - killLocalBashTask — `chunks.95.mjs:1918`
- `t24` - killBashTasksForAgent — `chunks.95.mjs:1938`

---

## Kill Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KILL MECHANISM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Action (Ctrl+C / Ctrl+F / TaskStop tool / 'x' in task list)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Kill Dispatcher                                       │
│                                                                              │
│   killAllLocalAgents (U4q)     - Kill all running local_agent tasks        │
│   killLocalBashTask (wQ6)      - Kill specific bash task                   │
│   killBashTasksForAgent (t24)  - Kill all bash tasks for an agent          │
│   triggerAbortSignal (x66)     - Low-level abort trigger                   │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Abort Signal Propagation                              │
│                                                                              │
│   1. abortController.abort()     - Trigger abort signal                    │
│   2. unregisterCleanup()         - Run cleanup handler                     │
│   3. Update task state           - Set status: "killed"                    │
│   4. Flush output file           - Preserve partial results                │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Task-Type-Specific Cleanup                            │
│                                                                              │
│   local_agent        → Abort agent loop, kill child processes              │
│   local_bash         → Terminate process group                              │
│   in_process_teammate → Signal teammate, cleanup mailbox                   │
│   remote_agent       → Send termination request to remote session          │
│   local_workflow     → Cancel workflow steps                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Kill Functions

### triggerAbortSignal (x66)

**What it does:** Low-level function that triggers abort for a single task.

**How it works:**
1. Atomically updates task state to "killed"
2. Calls abortController.abort() to signal cancellation
3. Runs unregisterCleanup() handler
4. Flushes output file to preserve partial results

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Step 1: Trigger the abort signal
        task.abortController?.abort();

        // Step 2: Run cleanup handler
        task.unregisterCleanup?.();

        // Step 3: Update task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output file to preserve partial results
    if (wasKilled) {
        flushOutputFile(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState,
//          i9→atomicUpdateTask, $O→flushOutputFile
```

**Why this approach:**
- **Atomic update** - Ensures consistent state even with concurrent updates
- **Cleanup guarantee** - unregisterCleanup runs before state change
- **Partial preservation** - Output file flushed before task removed
- **Return value** - Indicates whether kill actually happened

---

### killAllLocalAgents (U4q)

**What it does:** Kills all running local_agent tasks in one operation (Ctrl+F handler).

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local_agent tasks
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Kill Flow with Notification

```javascript
// Complete kill flow including UI notification
// Location: chunks.193.mjs (inferred from UI handler)

async function handleKillAllWithNotification(tasks, setAppState) {
    // 1. Send telemetry
    telemetry("tengu_cancel", { source: "kill_agents" });

    // 2. Kill all local agents
    killAllLocalAgents(tasks, setAppState);

    // 3. Mark each as killed and collect descriptions
    let killedDescriptions = [];
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            markTaskKilled(taskId, setAppState);
            killedDescriptions.push(task.description);
        }
    }

    // 4. Show notification
    if (killedDescriptions.length > 0) {
        let message = killedDescriptions.length === 1
            ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
            : `${killedDescriptions.length} background agents were stopped by the user.`;
        addNotification({ value: message, mode: "task-notification" });
    }
}
```

---

### markTaskKilled (d4q)

**What it does:** Sets the notified flag on a killed task, enabling eviction.

```javascript
// ============================================
// d4q - markTaskKilled - Mark task as killed with notification
// Location: chunks.146.mjs:2034-2043
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.notified) return task;  // Already notified

        return {
            ...task,
            notified: true,
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

**Why notified flag matters:**
- Prevents duplicate notifications
- Signals to pollTaskOutputs that task can be evicted
- Compacts message history to last message only

---

## Task-Type-Specific Kill Handlers

### Kill Handler Registry

```javascript
// Handler lookup by task type
// Location: chunks.143.mjs (inferred)

function getKillHandlerForType(taskType) {
    switch (taskType) {
        case "local_agent":
            return LocalAgentTaskHandler;
        case "local_bash":
            return LocalBashTaskHandler;
        case "in_process_teammate":
            return InProcessTeammateHandler;
        case "remote_agent":
            return RemoteAgentTaskHandler;
        case "local_workflow":
            return LocalWorkflowHandler;
        default:
            return null;
    }
}
```

### LocalBashTaskHandler (wQ6)

```javascript
// ============================================
// wQ6 - killLocalBashTask - Kill a background bash task
// Location: chunks.95.mjs:1918-1936
// ============================================

// READABLE (for understanding):
function killLocalBashTask(taskId) {
    let task = getTask(taskId);
    if (!task || task.status !== "running") return;

    // Kill the process group (sends SIGTERM to all child processes)
    if (task.childProcess) {
        process.kill(-task.childProcess.pid, 'SIGTERM');
    }

    // Update task state
    updateTaskState(taskId, {
        status: "killed",
        endTime: Date.now()
    });
}

// Mapping: wQ6→killLocalBashTask
```

### killBashTasksForAgent (t24)

```javascript
// ============================================
// t24 - killBashTasksForAgent - Kill all bash tasks spawned by an agent
// Location: chunks.95.mjs:1938-1955
// ============================================

// READABLE (for understanding):
function killBashTasksForAgent(agentId, getAppState, setAppState) {
    let tasks = getAppState().tasks;

    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_bash" &&
            task.agentId === agentId &&
            task.status === "running") {
            killLocalBashTask(taskId);
        }
    }
}

// Mapping: t24→killBashTasksForAgent
```

**Why this is called:**
- When an agent finishes (normally or killed), all its bash tasks should be killed
- Called from agentLoopRunner's finally block
- Prevents orphaned background processes

---

## Abort Signal Propagation

### Parent-Child Abort Linking (Wm)

```javascript
// ============================================
// Wm - createChildAbortController - Create child abort controller linked to parent
// Location: chunks.6.mjs:465-480
// ============================================

// READABLE (for understanding):
function createChildAbortController(parentAbortController) {
    let childAbortController = new AbortController();

    // If parent already aborted, abort child immediately
    if (parentAbortController.signal.aborted) {
        childAbortController.abort();
        return childAbortController;
    }

    // Register listener to propagate parent abort to child
    parentAbortController.signal.addEventListener("abort", () => {
        childAbortController.abort();
    });

    return childAbortController;
}

// Mapping: Wm→createChildAbortController
```

### Abort Propagation Flow

```
User presses Ctrl+F
        │
        ▼
killAllLocalAgents (U4q)
        │
        ├─── For each local_agent task:
        │     │
        │     ▼
        │   triggerAbortSignal (x66)
        │     │
        │     ├─── abortController.abort()
        │     │         │
        │     │         ▼
        │     │   AbortSignal propagation:
        │     │   • Agent loop receives signal
        │     │   • LLM request is cancelled
        │     │   • Tool execution is interrupted
        │     │
        │     ├─── unregisterCleanup()
        │     │         │
        │     │         ▼
        │     │   Cleanup handlers run:
        │     │   • MCP client disconnect
        │     │   • Deregister hooks
        │     │   • Kill child bash tasks (t24)
        │     │
        │     └─── Update state to "killed"
        │
        └─── markTaskKilled (d4q)
              │
              ▼
        Set notified=true
              │
              ▼
        pollTaskOutputs evicts task
```

---

## UI Integration

### Ctrl+C → Ctrl+F Flow

```
User presses Ctrl+C (with running agents)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 1: Show Confirmation                                                   │
│                                                                              │
│   "Press Ctrl+F to stop background agents"                                  │
│   (Timeout: ~3 seconds)                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├─── Timeout ────────────────────────────────┐
        │                                            ▼
        │                              Revert to normal Ctrl+C behavior
        │                              (cancel current stream)
        │
        └─── Ctrl+F ───────────────────────────────────┐
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Execute Kill All                                                    │
│                                                                              │
│   1. telemetry("tengu_cancel", { source: "kill_agents" })                   │
│   2. killAllLocalAgents(tasks, setAppState)                                 │
│   3. For each killed agent:                                                   │
│      a. markTaskKilled(taskId, setAppState)                                  │
│      b. Collect description                                                   │
│   4. Show notification with killed agent names                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Task List Modal 'x' Key

```javascript
// Single task kill from task list modal
// Location: chunks.162.mjs (inferred)

function handleTaskKillKeyPress(task, setAppState) {
    switch (task.type) {
        case "local_bash":
            killLocalBashTask(task.id);
            break;
        case "local_agent":
            triggerAbortSignal(task.id, setAppState);
            markTaskKilled(task.id, setAppState);
            break;
        case "in_process_teammate":
            killInProcessTeammate(task.id, setAppState);
            break;
        case "local_workflow":
            killWorkflowTask(task.id, setAppState);
            break;
        case "remote_agent":
            killRemoteAgentTask(task.id);
            break;
    }

    // Show notification
    addNotification({
        value: `Task "${task.description}" was stopped.`,
        mode: "task-notification"
    });
}
```

---

## Notification Format

### Kill Notification Messages

| Scenario | Message Format |
|----------|---------------|
| Single agent killed | `Background agent "{description}" was stopped by the user.` |
| Multiple agents killed | `{count} background agents were stopped by the user.` |
| Task killed from modal | `Task "{description}" was stopped.` |
| Agent killed on session end | (Silent - no notification) |

### Notification Mode

```javascript
addNotification({
    value: message,
    mode: "task-notification"  // Special mode for task-related notifications
});
```

---

## Partial Results Preservation

### Output File Flush

```javascript
// $O - flushOutputFile
// Location: chunks.41.mjs:2320

// READABLE (for understanding):
function flushOutputFile(taskId) {
    let outputPath = getOutputFilePath(taskId);

    // Ensure all buffered content is written
    fs.fsyncSync(outputPath);
}

// Mapping: $O→flushOutputFile
```

### Why Flush Before Kill?

1. **Preserve work** - Partial results from completed tools are saved
2. **Debugging** - Can see what the agent was doing when killed
3. **Continuity** - Output file can be read for final status

---

## Verification Status

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |
| `t24` | killBashTasksForAgent | chunks.95.mjs:1938 | ✓ Verified |
| `Wm` | createChildAbortController | chunks.6.mjs:465 | ✓ Verified |
| `$O` | flushOutputFile | chunks.41.mjs:2320 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [task_lifecycle_complete_v3.md](./task_lifecycle_complete_v3.md) - Task lifecycle
- [progress_tracking_complete.md](./progress_tracking_complete.md) - Progress system
- [ui_design_complete.md](./ui_design_complete.md) - UI design