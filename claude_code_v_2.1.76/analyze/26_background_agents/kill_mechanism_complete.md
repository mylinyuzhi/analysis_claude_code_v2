# Kill Mechanism Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level analysis of the kill/abort mechanism for background agents, including signal propagation, cleanup handlers, and keyboard shortcuts.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `triggerAbortSignal` (x66) - Trigger abort signal for task — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) - Kill all running agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `createChildAbortController` (R61) - Create child abort controller — `chunks.6.mjs:465`
- `killLocalBashTask` (wQ6) - Kill local bash task — `chunks.95.mjs:1918`
- `killBashTasksForAgent` (t24) - Kill bash tasks for agent — `chunks.95.mjs:1938`
- `registerCleanupHandler` (E4) - Register process exit handler
- `LocalAgentTaskHandler` (Fk1) - Kill handler for local agents
- `LocalBashTaskHandler` (Lf6) - Kill handler for shell commands
- `RemoteAgentTaskHandler` (Fn4) - Kill handler for remote sessions

---

## Overview

The kill mechanism provides a unified way to terminate background tasks, whether they are agents, shell commands, or remote sessions. It handles:

1. **Abort signal propagation** - Signals flow from parent to child tasks
2. **Cleanup handlers** - Process exit handlers ensure cleanup
3. **Task-type-specific handlers** - Different cleanup for different task types
4. **Keyboard shortcuts** - Ctrl+C and Ctrl+F for killing tasks

---

## Abort Signal Architecture

### Signal Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Abort Signal Flow                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  User Action              AbortController              Task
  ───────────              ──────────────              ────

       Ctrl+C ────────► AbortController.abort()
       or Ctrl+F           │
                           │
                           ▼
       ┌───────────────────────────────────────┐
       │ signal.aborted = true                 │
       └───────────────────────────────────────┘
                           │
                           │
                           ▼
       ┌───────────────────────────────────────┐
       │ triggerAbortSignal (x66)              │
       │ - AbortController.abort()             │
       │ - unregisterCleanup()                 │
       │ - Update status to "killed"           │
       └───────────────────────────────────────┘
                           │
                           │
                           ▼
       ┌───────────────────────────────────────┐
       │ Agent Loop detects abort              │
       │ - Checks signal.aborted               │
       │ - Throws AbortError                   │
       │ - Cleanup in finally block            │
       └───────────────────────────────────────┘
```

---

## Core Kill Functions

### triggerAbortSignal (x66)

**What it does:** Aborts a running task by triggering its abort controller and running cleanup.

**How it works:**
1. Check if task is running
2. Call abort controller's abort() method
3. Call cleanup handler
4. Update state to "killed"
5. Create notification

```javascript
// ============================================
// triggerAbortSignal - Trigger abort signal for task
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
    let wasRunning = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        wasRunning = true;

        // Step 1: Trigger abort
        task.abortController?.abort();

        // Step 2: Run cleanup handler (process exit handler)
        task.unregisterCleanup?.();

        // Step 3: Return updated task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Preserve last message for notification
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Create notification if task was running
    if (wasRunning) {
        createTaskNotification(taskId);
    }

    return wasRunning;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasRunning,
//          i9→atomicUpdateTask, Y→task, $O→createTaskNotification
```

**Key Insight:** The function is synchronous because abort() triggers async cancellation, but the state update is immediate. The actual agent loop will detect the abort on its next iteration.

---

### killAllLocalAgents (U4q)

**What it does:** Kills all running local_agent tasks. Called when user presses Ctrl+C or Ctrl+F.

```javascript
// ============================================
// killAllLocalAgents - Kill all running local_agent tasks
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

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task
```

**Usage in v2.1.76:**
- **Ctrl+C**: Kill all running agents when pressed in TUI
- **Ctrl+F**: New shortcut in v2.1.76 for "force kill all"

---

### markTaskKilled (d4q)

**What it does:** Marks a task as having been notified of kill, preventing duplicate notifications.

```javascript
// ============================================
// markTaskKilled - Mark task as killed with notification
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
            // Preserve last message for notification
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task
```

---

## Abort Controller Hierarchy

### Child Abort Controller

**What it does:** Creates a child abort controller that gets triggered when the parent is aborted.

```javascript
// ============================================
// createChildAbortController - Create child abort controller
// Location: chunks.6.mjs:465
// ============================================

// READABLE (for understanding):
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // If parent is already aborted, abort child immediately
    if (parentController.signal.aborted) {
        childController.abort();
        return childController;
    }

    // Listen for parent abort
    parentController.signal.addEventListener("abort", () => {
        childController.abort();
    });

    return childController;
}

// Mapping: R61→createChildAbortController
```

**Why this matters:**
- Background agents get their own controller but are linked to parent
- If user kills the main session, background agents are also killed
- Allows independent lifecycle while maintaining hierarchy

---

## Cleanup Handlers

### Process Exit Handler Registration

**What it does:** Registers a handler to be called when the process exits or when the task is killed.

```javascript
// ============================================
// registerCleanupHandler - Register process exit handler
// Location: chunks.89.mjs (inferred)
// ============================================

// READABLE (for understanding):
function registerCleanupHandler(cleanupFn) {
    // Add to process exit handlers
    process.on("exit", cleanupFn);
    process.on("SIGINT", cleanupFn);
    process.on("SIGTERM", cleanupFn);

    // Return unregister function
    return function unregister() {
        process.off("exit", cleanupFn);
        process.off("SIGINT", cleanupFn);
        process.off("SIGTERM", cleanupFn);
    };
}

// Mapping: E4→registerCleanupHandler
```

**Usage in task creation:**
```javascript
let unregisterCleanup = registerCleanupHandler(async () => {
    triggerAbortSignal(agentId, setAppState);
});
task.unregisterCleanup = unregisterCleanup;
```

---

## Task-Type-Specific Kill Handlers

### Handler Selection

Different task types require different cleanup strategies:

| Task Type | Handler | Key Actions |
|-----------|---------|-------------|
| `local_agent` | LocalAgentTaskHandler | Abort agent loop, cleanup MCP clients |
| `local_bash` | LocalBashTaskHandler | Kill child process, terminate process group |
| `remote_agent` | RemoteAgentTaskHandler | Terminate remote session, cleanup resources |
| `in_process_teammate` | LocalAgentTaskHandler | Abort loop, cleanup teammate context |

### killLocalBashTask (wQ6)

**What it does:** Kills a local bash task by terminating its child process.

```javascript
// ============================================
// killLocalBashTask - Kill local bash task
// Location: chunks.95.mjs:1918
// ============================================

// READABLE (for understanding):
function killLocalBashTask(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;
        if (task.type !== "local_bash") return task;

        // Kill the child process
        if (task.childProcess) {
            // Use process group kill for all children
            try {
                process.kill(-task.childProcess.pid, "SIGTERM");
            } catch (e) {
                // Process may already be dead
                task.childProcess.kill("SIGTERM");
            }
        }

        return {
            ...task,
            status: "killed",
            endTime: Date.now()
        };
    });
}

// Mapping: wQ6→killLocalBashTask
```

### killBashTasksForAgent (t24)

**What it does:** Kills all bash tasks spawned by a specific agent.

```javascript
// ============================================
// killBashTasksForAgent - Kill bash tasks for agent
// Location: chunks.95.mjs:1938
// ============================================

// READABLE (for understanding):
function killBashTasksForAgent(agentId, getAppState, setAppState) {
    let tasks = getAppState().tasks;

    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_bash" &&
            task.status === "running" &&
            task.agentId === agentId) {
            killLocalBashTask(taskId, setAppState);
        }
    }
}

// Mapping: t24→killBashTasksForAgent
```

**Why this matters:** When an agent is killed, all its spawned bash commands should also be killed to prevent orphaned processes.

---

## Keyboard Shortcut Integration

### Ctrl+C Handler

When user presses Ctrl+C in the TUI:

1. Check if there are running local agents
2. If yes, kill all running local agents
3. Update status line to show kill happened
4. If no running agents, proceed with normal interrupt

### Ctrl+F Handler (New in v2.1.76)

When user presses Ctrl+F:

1. Immediately kill all running local agents
2. No confirmation dialog
3. Fast kill for urgent situations

### UI Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Keyboard Shortcut Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

  User presses Ctrl+C
         │
         ▼
  ┌────────────────────┐
  │ Any running        │──── No ────► Normal Ctrl+C behavior
  │ local agents?      │              (cancel current operation)
  └────────┬───────────┘
           │
          Yes
           │
           ▼
  ┌────────────────────┐
  │ killAllLocalAgents │
  │ (U4q)              │
  └────────┬───────────┘
           │
           ▼
  ┌────────────────────┐
  │ For each agent:    │
  │ triggerAbortSignal │
  │ (x66)              │
  └────────┬───────────┘
           │
           ▼
  ┌────────────────────┐
  │ Update status line │
  │ "Killed N agents"  │
  └────────────────────┘


  User presses Ctrl+F (new in v2.1.76)
         │
         ▼
  ┌────────────────────┐
  │ killAllLocalAgents │───── Immediate kill
  │ (U4q)              │      No confirmation
  └────────────────────┘
```

---

## Kill Handler Classes

### LocalAgentTaskHandler (Fk1)

**What it does:** Kill handler specifically for local_agent task type.

```javascript
// ============================================
// LocalAgentTaskHandler - Kill handler for local agents
// Location: chunks.146.mjs:2292 (inferred)
// ============================================

// READABLE (for understanding):
class LocalAgentTaskHandler {
    canHandle(task) {
        return task.type === "local_agent";
    }

    async kill(taskId, task, setAppState) {
        // Step 1: Trigger abort signal
        triggerAbortSignal(taskId, setAppState);

        // Step 2: Kill any bash tasks spawned by this agent
        killBashTasksForAgent(taskId, getAppState, setAppState);

        // Step 3: Mark as killed
        markTaskKilled(taskId, setAppState);
    }
}

// Mapping: Fk1→LocalAgentTaskHandler
```

### LocalBashTaskHandler (Lf6)

```javascript
// ============================================
// LocalBashTaskHandler - Kill handler for shell commands
// Location: chunks.133.mjs:2542
// ============================================

// READABLE (for understanding):
class LocalBashTaskHandler {
    canHandle(task) {
        return task.type === "local_bash";
    }

    async kill(taskId, task, setAppState) {
        // Kill the process group
        if (task.childProcess?.pid) {
            try {
                // Negative PID kills the process group
                process.kill(-task.childProcess.pid, "SIGTERM");
            } catch (e) {
                // Fallback to killing just the process
                task.childProcess.kill("SIGKILL");
            }
        }

        // Update state
        atomicUpdateTask(taskId, setAppState, (t) => ({
            ...t,
            status: "killed",
            endTime: Date.now()
        }));
    }
}

// Mapping: Lf6→LocalBashTaskHandler
```

### RemoteAgentTaskHandler (Fn4)

```javascript
// ============================================
// RemoteAgentTaskHandler - Kill handler for remote sessions
// Location: chunks.136.mjs:1175
// ============================================

// READABLE (for understanding):
class RemoteAgentTaskHandler {
    canHandle(task) {
        return task.type === "remote_agent";
    }

    async kill(taskId, task, setAppState) {
        // Step 1: Terminate remote session
        if (task.remoteSessionId) {
            await terminateRemoteSession(task.remoteSessionId);
        }

        // Step 2: Update state
        atomicUpdateTask(taskId, setAppState, (t) => ({
            ...t,
            status: "killed",
            endTime: Date.now()
        }));
    }
}

// Mapping: Fn4→RemoteAgentTaskHandler
```

---

## Notification Integration

### createTaskNotification ($O)

**What it does:** Creates a notification for task status changes.

```javascript
// ============================================
// createTaskNotification - Create task notification
// Location: chunks.89.mjs (inferred)
// ============================================

// READABLE (for understanding):
function createTaskNotification(taskId) {
    // Add notification to command queue
    enqueueCommand({
        type: "task-notification",
        taskId: taskId,
        timestamp: Date.now()
    });
}

// Mapping: $O→createTaskNotification
```

**System Reminder Integration:**

The notification appears in the system reminder as a `task_status` attachment:

```xml
<system-reminder>
A background task has finished:
- Task ID: a3f9c2x7
- Description: Search codebase for usages
- Status: killed
- Duration: 45.2 seconds
</system-reminder>
```

---

## Partial Results Preservation

### Output Delta Reading Before Kill

**What it does:** In v2.1.76, before marking a task as killed, any output accumulated since the last progress snapshot is captured.

```javascript
// READABLE (for understanding):
async function killWithPartialResults(taskId, setAppState) {
    // Step 1: Read output delta before kill
    let partialOutput = await readOutputFileDelta(taskId);

    // Step 2: Trigger abort
    triggerAbortSignal(taskId, setAppState);

    // Step 3: Include partial output in notification
    createTaskNotification(taskId, {
        partialOutput: partialOutput
    });
}
```

**Why this matters:** Users can see what the agent accomplished before being killed, rather than losing all results.

---

## Error Handling

### AbortError Detection

```javascript
// READABLE (for understanding):
class AbortError extends Error {
    constructor() {
        super("Agent aborted");
        this.name = "AbortError";
    }
}

// In agent loop:
if (abortController.signal.aborted) {
    throw new AbortError();
}
```

### Cleanup in Finally Block

```javascript
// READABLE (for understanding):
try {
    // Agent loop execution
    for await (let message of llmMessageLoop({...})) {
        // Process message
    }
} finally {
    // Cleanup always runs, even on abort
    await mcpCleanup();
    if (agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }
    toolUseContext.readFileState.clear();
    messages.length = 0;
    cleanupAgentTranscript(agentId);
    cleanupBashTasksForAgent(agentId, getAppState, setAppState);
}
```

---

## Cross-Feature Integration

### System Reminder Integration
- `task_status` attachment shows killed status
- Partial results included in notification

### Hooks Integration
- Cleanup handlers called in finally block
- PostToolUse hooks may fire for incomplete operations

### Compact Integration
- Killed tasks may have partial transcripts
- Output files preserved for review

### UI Integration
- Status line shows kill count
- Task list modal updates immediately
- Ctrl+C/Ctrl+F keybindings