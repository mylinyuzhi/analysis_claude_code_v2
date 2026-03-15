# Background Agents — Kill Handlers (Claude Code 2.1.38)

> Analysis of the kill handler system for background tasks: different termination strategies
> for bash commands, local agents, and remote sessions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `LocalBashTaskHandler` (gj1) - Kill handler for shell commands — `chunks.89.mjs:2012`
- `LocalAgentTaskHandler` (B_6) - Kill handler for local agents — `chunks.89.mjs:1574`
- `RemoteAgentTaskHandler` (Qi4) - Kill handler for remote sessions — `chunks.142.mjs:1586`
- `getKillHandlerForType` (Vg1) - Lookup function for kill handlers — `chunks.142.mjs:1652`
- `getAllKillHandlers` (IhY) - Returns all kill handler instances — `chunks.142.mjs:1648`
- `killTask` (na) - Core kill function for local agents — `chunks.89.mjs:~1375`
- `killBashTask` (hjA) - Core kill function for bash tasks — `chunks.89.mjs:~1846`
- `atomicUpdateTask` (c5) - Atomically updates task state — `chunks.142.mjs:1662`

---

## Overview

Each background task type requires different termination strategies:

1. **local_bash** - Kill the shell process and child processes
2. **local_agent** - Signal the AbortController to cancel the agent loop
3. **remote_agent** - Terminate the remote session via API

Kill handlers provide a unified interface for the `TaskStop` tool while implementing type-specific termination logic.

---

## Deep Analysis: Kill Handler Architecture

### Handler Interface

**What it defines:** Each kill handler must implement these methods:

```javascript
interface KillHandler {
    name: string;                    // Human-readable name
    type: string;                    // Task type identifier

    spawn(taskConfig, context): Promise<{ backgroundTaskId: string }>;
    kill(task, context): Promise<void>;
    getProgressMessage?(task): string | null;
    renderStatus?(task): ReactElement;
    renderOutput?(output): ReactElement;
}
```

### Handler Registration

```javascript
// ============================================
// getAllKillHandlers - Returns all registered handlers
// Location: chunks.142.mjs:1648-1650
// ============================================

// ORIGINAL (for source lookup):
function IhY() {
    return [gj1, B_6, Qi4]
}

// READABLE (for understanding):
function getAllKillHandlers() {
    return [
        LocalBashTaskHandler,    // type: "local_bash"
        LocalAgentTaskHandler,   // type: "local_agent"
        RemoteAgentTaskHandler   // type: "remote_agent"
    ];
}

// Mapping: IhY→getAllKillHandlers, gj1→LocalBashTaskHandler, B_6→LocalAgentTaskHandler,
//   Qi4→RemoteAgentTaskHandler
```

### Handler Lookup

```javascript
// ============================================
// getKillHandlerForType - Find handler by task type
// Location: chunks.142.mjs:1652-1654
// ============================================

// ORIGINAL (for source lookup):
function Vg1(A) {
    return IhY().find((q) => q.type === A)
}

// READABLE (for understanding):
function getKillHandlerForType(taskType) {
    return getAllKillHandlers().find((handler) => handler.type === taskType);
}

// Mapping: Vg1→getKillHandlerForType, IhY→getAllKillHandlers
```

---

## Deep Analysis: LocalBashTaskHandler

### What It Does

Handles termination of shell commands running in the background. Uses process signals (SIGTERM/SIGKILL) to terminate the shell process and its children.

### Implementation

```javascript
// ============================================
// LocalBashTaskHandler - Shell command kill handler
// Location: chunks.89.mjs:2012-~2060
// ============================================

// ORIGINAL (for source lookup):
gj1 = {
    name: "LocalBashTask",
    type: "local_bash",
    async spawn(A, q) {
        let {
            command: K,
            description: Y,
            shellCommand: z
        } = A, {
            setAppState: w
        } = q, H = hp("local_bash");
        hj1(H);
        let $ = Tq(async () => {
                hjA(H, w)
            }),
            O = {
                ...IZ(H, "local_bash", Y),
                type: "local_bash",
                status: "running",
                command: K,
                completionStatusSentInAttachment: !1,
                unregisterCleanup: $,
                shellCommand: z,
                abortController: new AbortController
            };
        return bZ(O, w), {
            backgroundTaskId: H
        }
    },
    async kill(A, q) {
        let {
            setAppState: K
        } = q;
        hjA(A.id, K)
    },
    // ... renderStatus, renderOutput, getProgressMessage ...
};

// READABLE (for understanding):
const LocalBashTaskHandler = {
    name: "LocalBashTask",
    type: "local_bash",

    async spawn(taskConfig, context) {
        let { command, description, shellCommand } = taskConfig;
        let { setAppState } = context;

        let taskId = createTaskId("local_bash");
        initOutputFile(taskId);

        // Register cleanup on process exit
        let unregisterCleanup = registerProcessExitCleanup(async () => {
            cleanupOutputFile(taskId, setAppState);
        });

        let taskRecord = {
            ...createTaskRecord(taskId, "local_bash", description),
            type: "local_bash",
            status: "running",
            command,
            completionStatusSentInAttachment: false,
            unregisterCleanup,
            shellCommand,
            abortController: new AbortController()
        };

        registerTaskInState(taskRecord, setAppState);
        return { backgroundTaskId: taskId };
    },

    async kill(task, context) {
        let { setAppState } = context;
        await killBashTask(task.id, setAppState);
    },

    renderStatus(task) {
        // Returns React element showing [running/completed/failed] with command
    },

    renderOutput(output) {
        // Returns React element with truncated output
    },

    getProgressMessage(task) {
        if (!task.command) return null;
        return `Running: ${task.command}`;
    }
};

// Mapping: gj1→LocalBashTaskHandler, hp→createTaskId, hj1→initOutputFile, Tq→registerProcessExitCleanup,
//   hjA→killBashTask, IZ→createTaskRecord, bZ→registerTaskInState
```

### killBashTask Function

**What it does:** Terminates a background shell command by aborting the shell process.

```javascript
// ============================================
// killBashTask - Terminate shell command
// Location: chunks.89.mjs:~1846
// ============================================

// READABLE (for understanding):
async function killBashTask(taskId, setAppState) {
    // 1. Get the shellCommand reference from task
    let shellCommand = getShellCommandFromTask(taskId, setAppState);

    // 2. Kill the shell process
    if (shellCommand) {
        shellCommand.kill();  // Sends SIGTERM, then SIGKILL after timeout
    }

    // 3. Update task state to "killed"
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        status: "killed",
        endTime: Date.now()
    }));

    // 4. Trigger notification
    notifyTaskCompletion(taskId, task.description, "killed", null, setAppState);
}

// Mapping: hjA→killBashTask
```

**Why this approach:**
- **Process signals** are the standard way to terminate shell processes
- **Shell command wrapper** handles child process termination automatically
- **State update** ensures the UI reflects the killed status

---

## Deep Analysis: LocalAgentTaskHandler

### What It Does

Handles termination of local agent tasks (subagents running in the background). Uses AbortController cancellation to signal the agent loop to stop.

### Implementation

```javascript
// ============================================
// LocalAgentTaskHandler - Local agent kill handler
// Location: chunks.89.mjs:1574-~1650
// ============================================

// ORIGINAL (for source lookup):
B_6 = {
    name: "LocalAgentTask",
    type: "local_agent",
    async spawn(A, q) {
        let {
            prompt: K,
            description: Y,
            agentType: z,
            model: w,
            selectedAgent: H,
            agentId: $
        } = A, {
            setAppState: O
        } = q, _ = $ ?? hp("local_agent");
        Ij1(_, kh(xZ(_)));
        let J = Aq(),
            X = {
                ...IZ(_, "local_agent", Y),
                type: "local_agent",
                status: "running",
                prompt: K,
                agentType: z,
                model: w,
                selectedAgent: H,
                abortController: J,
                unregisterCleanup: () => {
                    J.abort()
                }
            };
        return bZ(X, O), {
            backgroundTaskId: _
        }
    },
    async kill(A, q) {
        let {
            setAppState: K
        } = q;
        na(A.id, K)
    },
    // ... renderStatus, renderOutput, getProgressMessage ...
};

// READABLE (for understanding):
const LocalAgentTaskHandler = {
    name: "LocalAgentTask",
    type: "local_agent",

    async spawn(taskConfig, context) {
        let { prompt, description, agentType, model, selectedAgent, agentId } = taskConfig;
        let { setAppState } = context;

        let taskId = agentId ?? createTaskId("local_agent");
        symlinkOutputFile(taskId, getSessionPathForSubagent(prefixAgentId(taskId)));

        let abortController = createAbortController();

        let taskRecord = {
            ...createTaskRecord(taskId, "local_agent", description),
            type: "local_agent",
            status: "running",
            prompt,
            agentType,
            model,
            selectedAgent,
            abortController,
            unregisterCleanup: () => {
                abortController.abort();
            }
        };

        registerTaskInState(taskRecord, setAppState);
        return { backgroundTaskId: taskId };
    },

    async kill(task, context) {
        let { setAppState } = context;
        killTask(task.id, setAppState);
    },

    renderStatus(task) {
        // Returns React element with agent type and status
    },

    renderOutput(output) {
        // Returns React element with agent output
    },

    getProgressMessage(task) {
        if (!task.agentType) return null;
        return `Agent ${task.agentType}: ${task.description}`;
    }
};

// Mapping: B_6→LocalAgentTaskHandler, hp→createTaskId, Ij1→symlinkOutputFile, kh→getSessionPathForSubagent,
//   xZ→prefixAgentId, Aq→createAbortController, IZ→createTaskRecord, bZ→registerTaskInState, na→killTask
```

### killTask Function

**What it does:** Terminates a local agent task by aborting its controller.

```javascript
// ============================================
// killTask - Terminate local agent task
// Location: chunks.89.mjs:~1375
// ============================================

// READABLE (for understanding):
function killTask(taskId, setAppState) {
    let task = getTaskFromState(taskId, setAppState);

    if (!task) return false;
    if (task.status !== "running") return false;

    // 1. Abort the agent loop
    if (task.abortController) {
        task.abortController.abort("killed");
    }

    // 2. Update task state
    atomicUpdateTask(taskId, setAppState, (t) => ({
        ...t,
        status: "killed",
        endTime: Date.now()
    }));

    // 3. Trigger notification
    notifyTaskCompletion(taskId, task.description, "killed", null, setAppState);

    return true;
}

// Mapping: na→killTask
```

**Why this approach:**
- **AbortController** is the standard JavaScript cancellation mechanism
- **Cooperative cancellation** - the agent loop checks `signal.aborted` between iterations
- **Clean shutdown** - agents can finish their current tool call before stopping

### Cooperative Cancellation Pattern

**How agent loops respond to abort:**

```javascript
// Agent loop checks abort signal between iterations
async function* agentLoopRunner(config) {
    let { abortController, ... } = config;

    while (!abortController.signal.aborted) {
        // Process next message
        let message = await getNextMessage();

        if (abortController.signal.aborted) {
            // Clean up and exit
            yield { type: "aborted", reason: abortController.signal.reason };
            return;
        }

        yield message;
    }
}
```

**Key insight:** This cooperative model ensures agents don't leave tool operations half-completed. The abort signal is checked between turns, allowing in-progress tool calls to finish gracefully.

---

## Deep Analysis: RemoteAgentTaskHandler

### What It Does

Handles termination of remote session agents running on cloud infrastructure. Uses the remote session API to terminate the session.

### Implementation

```javascript
// ============================================
// RemoteAgentTaskHandler - Remote session kill handler
// Location: chunks.142.mjs:1586-1645
// ============================================

// ORIGINAL (for source lookup):
Qi4 = {
    name: "RemoteAgentTask",
    type: "remote_agent",
    async spawn(A, q) {
        let {
            command: K,
            title: Y
        } = A, {
            abortController: z
        } = q;
        h(`RemoteAgentTask spawning: ${Y}`);
        let w = await b51({
            initialMessage: K,
            description: Y,
            signal: z.signal
        });
        if (!w) throw Error("Failed to create remote session");
        let {
            taskId: H,
            cleanup: $
        } = vg1({
            // ... session config ...
        });
        // ... register task ...
        return { backgroundTaskId: H };
    },
    async kill(A, q) {
        let {
            setAppState: K
        } = q;
        // Terminate remote session via API
        await terminateRemoteSession(A.sessionId);
        // Update task state
        atomicUpdateTask(A.id, K, (task) => ({
            ...task,
            status: "killed",
            endTime: Date.now()
        }));
    },
    renderStatus(A) {
        let q = A,
            K = q.status,
            Y = q.title;
        return nd.createElement(I, null,
            nd.createElement(V, {
                color: K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive"
            }, "[", K, "] ", Y)
        )
    },
    renderOutput(A) {
        return nd.createElement(I, null, nd.createElement(V, null, A))
    },
    getProgressMessage(A) {
        let K = A.deltaSummarySinceLastFlushToAttachment;
        if (!K) return null;
        return `Remote task ${A.id} progress: ${K}. Read ${A.outputFile} to see full output.`
    }
};

// READABLE (for understanding):
const RemoteAgentTaskHandler = {
    name: "RemoteAgentTask",
    type: "remote_agent",

    async spawn(taskConfig, context) {
        let { command, title } = taskConfig;
        let { abortController } = context;

        log(`RemoteAgentTask spawning: ${title}`);

        // Create remote session via API
        let session = await createRemoteSession({
            initialMessage: command,
            description: title,
            signal: abortController.signal
        });

        if (!session) throw Error("Failed to create remote session");

        let { taskId, cleanup } = registerSessionTask({
            // ... session config ...
        });

        return { backgroundTaskId: taskId };
    },

    async kill(task, context) {
        let { setAppState } = context;

        // 1. Terminate remote session via API
        await terminateRemoteSession(task.sessionId);

        // 2. Update task state
        atomicUpdateTask(task.id, setAppState, (t) => ({
            ...t,
            status: "killed",
            endTime: Date.now()
        }));

        // 3. Trigger notification
        notifyTaskCompletion(task.id, task.description, "killed", null, setAppState);
    },

    renderStatus(task) {
        let statusColor = {
            running: "warning",
            completed: "success",
            failed: "error",
            killed: "inactive"
        }[task.status];

        return (
            <Box>
                <Text color={statusColor}>[{task.status}] {task.title}</Text>
            </Box>
        );
    },

    renderOutput(output) {
        return <Box><Text>{output}</Text></Box>;
    },

    getProgressMessage(task) {
        if (!task.deltaSummarySinceLastFlushToAttachment) return null;
        return `Remote task ${task.id} progress: ${task.deltaSummarySinceLastFlushToAttachment}. Read ${task.outputFile} to see full output.`;
    }
};

// Mapping: Qi4→RemoteAgentTaskHandler, b51→createRemoteSession, vg1→registerSessionTask,
//   nd→React, I→Box, V→Text
```

**Why this approach:**
- **API-based termination** is the only way to stop remote sessions
- **Session cleanup** happens server-side
- **Progress message** points to output file for reading full output

---

## Kill Propagation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User/LLM requests TaskStop                   │
│                    TaskStopTool.call({ task_id })               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              getKillHandlerForType(task.type)                   │
│                                                                 │
│  Switches based on task.type:                                  │
│  - "local_bash"  → LocalBashTaskHandler                        │
│  - "local_agent" → LocalAgentTaskHandler                       │
│  - "remote_agent" → RemoteAgentTaskHandler                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ LocalBash     │   │ LocalAgent    │   │ RemoteAgent   │
│ TaskHandler   │   │ TaskHandler   │   │ TaskHandler   │
│ .kill()       │   │ .kill()       │   │ .kill()       │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ shellCommand  │   │ abortController│  │ Remote API    │
│ .kill()       │   │ .abort()       │   │ terminate()   │
│               │   │               │   │               │
│ SIGTERM →     │   │ Signal agent  │   │ HTTP request  │
│ SIGKILL       │   │ loop to stop  │   │ to server     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              atomicUpdateTask(taskId, setAppState, ...)         │
│                                                                 │
│  Update task.status = "killed"                                 │
│  Set task.endTime = Date.now()                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              notifyTaskCompletion(taskId, ..., "killed")        │
│                                                                 │
│  Inject task-notification into command queue                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## atomicUpdateTask Function

**What it does:** Atomically updates a task's state within the app state, ensuring thread-safe modifications.

```javascript
// ============================================
// atomicUpdateTask - Thread-safe task state update
// Location: chunks.142.mjs:1662-1670
// ============================================

// ORIGINAL (for source lookup):
function c5(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: K(z)
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updateFn) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;  // Task not found, no change

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updateFn(task)
            }
        };
    });
}

// Mapping: c5→atomicUpdateTask, A→taskId, q→setAppState, K→updateFn
```

**Why this approach:**
- **Atomic update** - The entire state update happens in a single function call
- **Immutable pattern** - Uses spread operator to create new state object
- **Conditional guard** - Returns unchanged state if task doesn't exist

---

## Summary: Kill Strategies Comparison

| Task Type | Handler | Kill Mechanism | Child Process Handling |
|-----------|---------|----------------|------------------------|
| `local_bash` | LocalBashTaskHandler | Process signals (SIGTERM/SIGKILL) | Shell wrapper terminates children |
| `local_agent` | LocalAgentTaskHandler | AbortController.abort() | Agent loop checks signal cooperatively |
| `remote_agent` | RemoteAgentTaskHandler | HTTP API terminate call | Server-side cleanup |

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Handler pattern | Different task types need different kill strategies |
| AbortController for agents | Cooperative cancellation allows clean tool completion |
| Process signals for bash | Standard Unix process termination |
| API for remote | Only way to affect server-side sessions |
| Atomic state updates | Prevent race conditions in concurrent modifications |
| Progress message per handler | Task-type-specific progress information |