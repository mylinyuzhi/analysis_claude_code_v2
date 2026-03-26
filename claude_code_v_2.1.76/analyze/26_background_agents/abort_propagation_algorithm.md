# Abort Signal Propagation Algorithm (Claude Code 2.1.76)

> Complete source-level analysis of how Claude Code handles task termination through abort signals, including kill handlers and cleanup mechanisms.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `Wm` - createChildAbortController — `chunks.6.mjs:465`
- `R61` - createChildAbortController — `chunks.6.mjs:465`
- `Fk1` - LocalAgentTaskHandler — `chunks.146.mjs:2292`
- `wQ6` - killLocalBashTask — `chunks.95.mjs:1918`

---

## Algorithm Overview

The abort signal propagation algorithm provides graceful task termination:

1. **Signal creation** - AbortController chain from parent to child
2. **Signal propagation** - Abort event flows to all listeners
3. **Cleanup execution** - Registered handlers run on abort
4. **State update** - Task marked as killed with notification

### Design Goals

1. **Immediate response** - Tasks stop quickly on abort
2. **Resource cleanup** - Child processes, files cleaned up
3. **State consistency** - Task state properly updated
4. **User notification** - User informed of killed tasks

---

## Source Code

### triggerAbortSignal (x66)

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a specific task
// Location: chunks.146.mjs:2012 (inferred from context)
// ============================================

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    // Get the task's abort controller
    let task = getTask(taskId);

    if (task?.abortController) {
        // Trigger the abort
        task.abortController.abort();

        // The abort will propagate to:
        // 1. Any child AbortControllers
        // 2. Any registered abort listeners
        // 3. Any running async operations
    }
}

// Mapping: x66→triggerAbortSignal
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    // Iterate through all tasks
    for (let [taskId, task] of Object.entries(tasks)) {
        // Only kill local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId,
//          Y→task, x66→triggerAbortSignal
```

### markTaskKilled (d4q)

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
        // Already notified - don't update again
        if (task.notified) {
            return task;
        }

        // Mark as notified and trim message history
        return {
            ...task,
            notified: true,
            // Keep only the last message for context
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, K→task,
//          i9→atomicUpdateTask
```

### atomicUpdateTask (i9)

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3016
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        // Get the current task
        let task = state.tasks?.[taskId];
        if (!task) {
            return state;  // Task doesn't exist
        }

        // Apply the updater function
        let updatedTask = updater(task);

        // No change - return original state
        if (updatedTask === task) {
            return state;
        }

        // Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
//          Y→state, z→task, _→updatedTask
```

### createChildAbortController (Wm / R61)

```javascript
// ============================================
// Wm/R61 - createChildAbortController - Create child abort controller
// Location: chunks.6.mjs:465
// ============================================

// ORIGINAL (for source lookup):
function R61(A) {
    let q = new AbortController;
    return A.signal.addEventListener("abort", () => {
        q.abort()
    }), q
}

// READABLE (for understanding):
function createChildAbortController(parentController) {
    // Create new child controller
    let childController = new AbortController();

    // Link to parent - when parent aborts, child also aborts
    parentController.signal.addEventListener("abort", () => {
        childController.abort();
    });

    return childController;
}

// Mapping: R61→createChildAbortController, A→parentController, q→childController
```

### killLocalBashTask (wQ6)

```javascript
// ============================================
// wQ6 - killLocalBashTask - Kill a running bash command
// Location: chunks.95.mjs:1918
// ============================================

// READABLE (for understanding):
function killLocalBashTask(taskId, setAppState) {
    // 1. Get the task
    let task = getTask(taskId);

    if (!task || task.type !== "local_bash") {
        return;
    }

    // 2. Kill the child process
    if (task.childProcess) {
        // On Unix: kill process group
        if (process.platform !== "win32") {
            process.kill(-task.childProcess.pid, "SIGTERM");
        } else {
            // On Windows: use taskkill
            task.childProcess.kill();
        }
    }

    // 3. Update task state
    markTaskKilled(taskId, setAppState);
}

// Mapping: wQ6→killLocalBashTask
```

### killBashTasksForAgent (t24)

```javascript
// ============================================
// t24 - killBashTasksForAgent - Kill all bash tasks for an agent
// Location: chunks.95.mjs:1938
// ============================================

// READABLE (for understanding):
function killBashTasksForAgent(agentId, setAppState) {
    // Get all bash tasks for this agent
    let tasks = getTasksByAgent(agentId, "local_bash");

    // Kill each one
    for (let task of tasks) {
        if (task.status === "running") {
            killLocalBashTask(task.id, setAppState);
        }
    }
}

// Mapping: t24→killBashTasksForAgent
```

---

## Abort Signal Flow

### Signal Propagation Chain

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ABORT SIGNAL PROPAGATION                          │
└─────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C or Ctrl+F
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ killAllLocalAgents (U4q)                                            │
│   Iterates all running local_agent tasks                            │
│   Calls triggerAbortSignal for each                                │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ triggerAbortSignal (x66)                                            │
│   Gets task.abortController                                         │
│   Calls abort() on it                                               │
└─────────────────────────────────────────────────────────────────────┘
  │
  ├──────────────────────────────────────────────────────────┐
  │                                                          │
  ▼                                                          ▼
┌───────────────────────────────┐    ┌───────────────────────────────────┐
│ Child AbortControllers        │    │ Registered abort listeners         │
│   Created via R61             │    │   Registered via signal.addEventListener │
│   Automatically abort         │    │   Execute cleanup handlers         │
└───────────────────────────────┘    └───────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Abort listeners execute                                             │
│   - Cancel HTTP requests                                            │
│   - Stop streaming                                                  │
│   - Clean up resources                                              │
│   - Kill child processes                                            │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Agent loop catches abort                                            │
│   - Exits async generator                                           │
│   - Runs finally blocks                                             │
│   - Calls unregisterCleanup                                         │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ markTaskKilled (d4q)                                                │
│   Updates task status                                               │
│   Sets notified: true                                               │
│   Trims message history                                             │
└─────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Task notification created                                           │
│   Type: "task-notification"                                         │
│   Status: "killed"                                                  │
│   Injected into message queue                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Kill Handler Types

### Handler Registry

```javascript
// Kill handler lookup by task type
const killHandlers = {
    local_agent: LocalAgentTaskHandler,
    local_bash: LocalBashTaskHandler,
    remote_agent: RemoteAgentTaskHandler,
    in_process_teammate: InProcessTeammateHandler
};
```

### LocalAgentTaskHandler (Fk1)

```javascript
// ============================================
// Fk1 - LocalAgentTaskHandler - Kill handler for local agents
// Location: chunks.146.mjs:2292
// ============================================

// READABLE (for understanding):
async function LocalAgentTaskHandler(task, setAppState) {
    // 1. Trigger abort signal
    if (task.abortController) {
        task.abortController.abort();
    }

    // 2. Kill any bash tasks spawned by this agent
    killBashTasksForAgent(task.agentId, setAppState);

    // 3. Mark as killed
    markTaskKilled(task.id, setAppState);

    // 4. Run any registered cleanup
    if (task.unregisterCleanup) {
        task.unregisterCleanup();
    }
}

// Mapping: Fk1→LocalAgentTaskHandler
```

### LocalBashTaskHandler (Lf6)

```javascript
// ============================================
// Lf6 - LocalBashTaskHandler - Kill handler for bash commands
// Location: chunks.133.mjs:2542
// ============================================

// READABLE (for understanding):
async function LocalBashTaskHandler(task, setAppState) {
    // 1. Kill the child process
    if (task.childProcess) {
        // Send SIGTERM to process group
        try {
            process.kill(-task.childProcess.pid, "SIGTERM");
        } catch (e) {
            // Process may already be dead
        }
    }

    // 2. Mark as killed
    markTaskKilled(task.id, setAppState);
}

// Mapping: Lf6→LocalBashTaskHandler
```

### RemoteAgentTaskHandler (Fn4)

```javascript
// ============================================
// Fn4 - RemoteAgentTaskHandler - Kill handler for remote agents
// Location: chunks.143.mjs:1510
// ============================================

// READABLE (for understanding):
async function RemoteAgentTaskHandler(task, setAppState, context) {
    // 1. Send kill message to remote session
    if (context.mcpClient) {
        await context.mcpClient.sendKillRequest(task.id);
    }

    // 2. Mark as killed
    markTaskKilled(task.id, setAppState);
}

// Mapping: Fn4→RemoteAgentTaskHandler
```

---

## AbortController Chain Architecture

### Parent-Child Relationship

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ABORT CONTROLLER CHAIN                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Parent AbortController (session)        │
│   - Created at session start             │
│   - Aborted on session end               │
└─────────────────────┬───────────────────┘
                      │ createChildAbortController (R61)
                      ▼
┌─────────────────────────────────────────┐
│ Agent AbortController                   │
│   - Created for each subagent            │
│   - Linked to parent                     │
└─────────────────────┬───────────────────┘
                      │ createChildAbortController
                      ▼
┌─────────────────────────────────────────┐
│ Tool AbortController                    │
│   - Created for each tool call           │
│   - Linked to agent controller           │
└─────────────────────────────────────────┘

When parent aborts → all children abort automatically
```

### Task Creation with AbortController

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask
// Location: chunks.146.mjs:2133-2163
// ============================================

// ORIGINAL (for source lookup):
function Qn4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = _ ? Wm(_) : sK(),
        $ = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: []
        },
        H = E4(async () => {
            x66(A, z)
        });
    return $.unregisterCleanup = H, Zf($, z), $
}

// READABLE (for understanding):
function createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
}) {
    // Initialize output file
    initOutputFile(agentId);

    // Create abort controller linked to parent (or new one)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Create task record
    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,
        pendingMessages: []
    };

    // Register cleanup handler (called on abort)
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    task.unregisterCleanup = unregisterCleanup;

    // Register task in state
    registerTask(task, setAppState);

    return task;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description,
//          K→prompt, Y→selectedAgent, z→setAppState, _→parentAbortController,
//          w→toolUseId, O→abortController, Wm→createChildAbortController,
//          RG→createTaskRecord, Zf→registerTask, x66→triggerAbortSignal
```

---

## Key Insights

### Why AbortController Chains?

**Problem:** A session may have multiple levels of nested operations:
- Session → Agent → Tool → Sub-tool

**Solution:** AbortController chains ensure that when the parent aborts, all children abort automatically.

**Benefits:**
1. No manual propagation needed
2. Guaranteed cleanup at all levels
3. Race condition safe

### Why Kill Handlers?

**Problem:** Different task types require different cleanup:

| Task Type | Resources to Clean Up |
|-----------|----------------------|
| local_agent | AbortController, child bash tasks |
| local_bash | Child process, file handles |
| remote_agent | Remote session, MCP connection |
| in_process_teammate | Mailbox, pending messages |

**Solution:** Kill handlers provide type-specific cleanup logic.

### Graceful vs Immediate Termination

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TERMINATION TYPES                                 │
└─────────────────────────────────────────────────────────────────────┘

Graceful (SIGTERM):
  - Process can finish current operation
  - Runs finally blocks
  - Cleans up resources
  - Default for most cases

Immediate (SIGKILL):
  - Process terminated immediately
  - No cleanup possible
  - Used as fallback

For Claude Code:
  - First attempt: Abort signal (graceful)
  - Timeout: SIGKILL (immediate)
  - This ensures eventual termination
```

---

## Integration Points

| Module | Integration |
|--------|-------------|
| `08_subagent` | Agent abort handling, cleanup |
| `26_background_agents` | Kill all, task state updates |
| `04_system_reminder` | Kill notifications |
| `01_cli` | Ctrl+C, Ctrl+F handlers |
| `05_tools` | Tool abort handling |

---

## Summary

The abort signal propagation algorithm provides:

1. **Cascade termination** - Parent aborts propagate to children
2. **Type-specific cleanup** - Kill handlers for each task type
3. **State consistency** - Atomic task state updates
4. **User notification** - Killed tasks appear in notifications

The algorithm ensures that task termination is:
- Immediate (signal propagation)
- Clean (resource cleanup)
- Consistent (state updates)
- Visible (user notifications)