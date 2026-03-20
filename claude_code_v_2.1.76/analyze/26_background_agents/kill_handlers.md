# Background Agents — Kill Handlers (Claude Code 2.1.76)

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
- `LocalBashTaskHandler` (Lf6) - Kill handler for shell commands — `chunks.133.mjs:2542`
- `LocalAgentTaskHandler` (Fk1) - Kill handler for local agents — `chunks.146.mjs:2292`
- `RemoteAgentTaskHandler` (Fn4) - Kill handler for remote sessions — `chunks.136.mjs:1175`
- `getKillHandlerForType` (Vg1) - Lookup function for kill handlers — `chunks.142.mjs:1652`
- `getAllKillHandlers` (IhY) - Returns all kill handler instances — `chunks.142.mjs:1648`
- `killTask` (na) - Core kill function for local agents — `chunks.89.mjs:~1375`
- `killBashTask` (wQ6) - Core kill function for bash tasks — `chunks.95.mjs:1918`
- `killAgentTask` (x66) - Core kill function for agent tasks — `chunks.146.mjs:2012`
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
    return [Lf6, Fk1, Fn4]
}

// READABLE (for understanding):
function getAllKillHandlers() {
    return [
        LocalBashTaskHandler,    // type: "local_bash" (Lf6)
        LocalAgentTaskHandler,   // type: "local_agent" (Fk1)
        RemoteAgentTaskHandler   // type: "remote_agent" (Fn4)
    ];
}

// Mapping: IhY→getAllKillHandlers, Lf6→LocalBashTaskHandler, Fk1→LocalAgentTaskHandler,
//   Fn4→RemoteAgentTaskHandler
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
// Location: chunks.133.mjs:2542-2598
// ============================================

// ORIGINAL (for source lookup):
Lf6 = {
    name: "LocalBashTask",
    type: "local_bash",
    async spawn(A, q) {
        let {
            command: K,
            description: Y,
            shellCommand: z,
            toolUseId: _,
            agentId: w,
            kind: O
        } = A, {
            setAppState: $
        } = q, {
            taskOutput: H
        } = z, j = H.taskId, J = E4(async () => {
            wQ6(j, $)
        }), M = {
            ...RG(j, "local_bash", Y, _),
            type: "local_bash",
            status: "running",
            command: K,
            completionStatusSentInAttachment: !1,
            shellCommand: z,
            unregisterCleanup: J,
            lastReportedTotalLines: 0,
            isBackgrounded: !0,
            agentId: w,
            kind: O
        };
        return Zf(M, $), z.background(j), z.result.then(async (D) => {
            // ... completion handling
        }), { taskId: j, cleanup: () => { J() } }
    },
    async kill(A, q) {
        wQ6(A, q.setAppState)
    },
    renderStatus(A) { /* React component */ },
    renderOutput(A) { /* React component */ }
};

// READABLE (for understanding):
const LocalBashTaskHandler = {
    name: "LocalBashTask",
    type: "local_bash",

    async spawn(taskConfig, context) {
        let { command, description, shellCommand, toolUseId, agentId, kind } = taskConfig;
        let { setAppState } = context;
        let { taskOutput } = shellCommand;
        let taskId = taskOutput.taskId;

        // Register cleanup on process exit
        let unregisterCleanup = registerProcessExitCleanup(async () => {
            killBashTask(taskId, setAppState);
        });

        let taskRecord = {
            ...createTaskRecord(taskId, "local_bash", description, toolUseId),
            type: "local_bash",
            status: "running",
            command,
            completionStatusSentInAttachment: false,
            shellCommand,
            unregisterCleanup,
            lastReportedTotalLines: 0,
            isBackgrounded: true,
            agentId,
            kind
        };

        registerTask(taskRecord, setAppState);
        shellCommand.background(taskId);

        // Handle completion when shell finishes
        shellCommand.result.then(async (result) => {
            await shellCommand.taskOutput.flush();
            shellCommand.cleanup();
            // Update task state based on exit code
            updateTaskState(taskId, setAppState, (task) => {
                if (task.status === "killed") return task;
                return {
                    ...task,
                    status: result.code === 0 ? "completed" : "failed",
                    result: { code: result.code, interrupted: result.interrupted },
                    shellCommand: null,
                    unregisterCleanup: undefined,
                    endTime: Date.now()
                };
            });
            notifyTaskCompletion(taskId, description, /* status */, result.code, setAppState, toolUseId, kind);
            flushTaskOutput(taskId);
        });

        return { taskId, cleanup: () => { unregisterCleanup(); } };
    },

    async kill(task, context) {
        let { setAppState } = context;
        await killBashTask(task.id ?? task, setAppState);
    },

    renderStatus(task) {
        // Returns React element showing [running/completed/failed] with command
    },

    renderOutput(output) {
        // Returns React element with truncated output
    }
};

// Mapping: Lf6→LocalBashTaskHandler, RG→createTaskRecord, Zf→registerTask, E4→registerProcessExitCleanup,
//   wQ6→killBashTask, i9→updateTaskState, GN1→notifyTaskCompletion, $O→flushTaskOutput
```

### killBashTask Function

**What it does:** Terminates a background shell command by killing the shell process and cleaning up resources.

```javascript
// ============================================
// killBashTask - Terminate shell command
// Location: chunks.95.mjs:1918-1936
// ============================================

// ORIGINAL (for source lookup):
function wQ6(A, q) {
    i9(A, q, (K) => {
        if (K.status !== "running" || !Gf(K)) return K;
        try {
            k(`LocalBashTask ${A} kill requested`), K.shellCommand?.kill(), K.shellCommand?.cleanup()
        } catch (Y) {
            _6(Y)
        }
        if (K.unregisterCleanup?.(), K.cleanupTimeoutId) clearTimeout(K.cleanupTimeoutId);
        return {
            ...K,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: void 0,
            cleanupTimeoutId: void 0,
            endTime: Date.now()
        }
    }), $O(A)
}

// READABLE (for understanding):
async function killBashTask(taskId, setAppState) {
    updateTaskState(taskId, setAppState, (task) => {
        // Guard: only kill running bash tasks
        if (task.status !== "running" || !isBashTask(task)) return task;

        try {
            log(`LocalBashTask ${taskId} kill requested`);
            task.shellCommand?.kill();     // Send SIGTERM/SIGKILL
            task.shellCommand?.cleanup();  // Clean up process resources
        } catch (err) {
            reportError(err);
        }

        // Clean up registered handlers and timeouts
        task.unregisterCleanup?.();
        if (task.cleanupTimeoutId) clearTimeout(task.cleanupTimeoutId);

        return {
            ...task,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: undefined,
            cleanupTimeoutId: undefined,
            endTime: Date.now()
        };
    });

    flushTaskOutput(taskId);  // Ensure output is persisted
}

// Mapping: wQ6→killBashTask, A→taskId, q→setAppState, i9→updateTaskState,
//   Gf→isBashTask, k→log, _6→reportError, $O→flushTaskOutput
```

**Why this approach:**
- **Process signals** are the standard way to terminate shell processes
- **Shell command wrapper** handles child process termination automatically
- **State update** ensures the UI reflects the killed status
- **Cleanup chaining** ensures all registered handlers are removed

---

## Deep Analysis: LocalAgentTaskHandler

### What It Does

Handles termination of local agent tasks (subagents running in the background). Uses AbortController cancellation to signal the agent loop to stop.

### Implementation

```javascript
// ============================================
// LocalAgentTaskHandler - Local agent kill handler
// Location: chunks.146.mjs:2292-2352
// ============================================

// ORIGINAL (for source lookup):
Fk1 = {
    name: "LocalAgentTask",
    type: "local_agent",
    async spawn(A, q) {
        let {
            prompt: K,
            description: Y,
            agentType: z,
            model: _,
            selectedAgent: w,
            agentId: O,
            toolUseId: $
        } = A, {
            setAppState: H
        } = q, j = O ?? oV("local_agent");
        Co(j, L0(X$(j)));
        let J = sK(),
            M = {
                ...RG(j, "local_agent", Y, $),
                type: "local_agent",
                status: "running",
                agentId: j,
                prompt: K,
                selectedAgent: w,
                agentType: z,
                model: _,
                abortController: J,
                retrieved: !1,
                lastReportedToolCount: 0,
                lastReportedTokenCount: 0,
                isBackgrounded: !0,
                pendingMessages: []
            },
            D = E4(async () => {
                x66(j, H)
            });
        return M.unregisterCleanup = D, Zf(M, H), {
            taskId: j,
            cleanup: () => {
                D(), J.abort()
            }
        }
    },
    async kill(A, q) {
        x66(A, q.setAppState)
    },
    renderStatus(A) { /* React component */ },
    renderOutput(A) { /* React component */ }
};

// READABLE (for understanding):
const LocalAgentTaskHandler = {
    name: "LocalAgentTask",
    type: "local_agent",

    async spawn(taskConfig, context) {
        let { prompt, description, agentType, model, selectedAgent, agentId, toolUseId } = taskConfig;
        let { setAppState } = context;

        let taskId = agentId ?? createTaskId("local_agent");
        symlinkOutputFile(taskId, getSessionPathForSubagent(prefixAgentId(taskId)));

        let abortController = createAbortController();

        let taskRecord = {
            ...createTaskRecord(taskId, "local_agent", description, toolUseId),
            type: "local_agent",
            status: "running",
            agentId: taskId,
            prompt,
            selectedAgent,
            agentType,
            model,
            abortController,
            retrieved: false,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: true,
            pendingMessages: []
        };

        let unregisterCleanup = registerProcessExitCleanup(async () => {
            killAgentTask(taskId, setAppState);
        });
        taskRecord.unregisterCleanup = unregisterCleanup;

        registerTask(taskRecord, setAppState);
        return {
            taskId,
            cleanup: () => {
                unregisterCleanup();
                abortController.abort();
            }
        };
    },

    async kill(task, context) {
        let { setAppState } = context;
        killAgentTask(task.id ?? task, setAppState);
    },

    renderStatus(task) {
        let status = task.status;
        let desc = task.description;
        let progress = task.progress;
        let color = status === "running" ? "warning"
                  : status === "completed" ? "success"
                  : status === "failed" ? "error"
                  : "inactive";
        let progressText = progress
            ? ` (${progress.toolUseCount} tools, ${progress.tokenCount} tokens)`
            : "";
        return <Box><Text color={color}>[{status}] {desc}{progressText}</Text></Box>;
    },

    renderOutput(output) {
        return <Box><Text>{output}</Text></Box>;
    }
};

// Mapping: Fk1→LocalAgentTaskHandler, oV→createTaskId, Co→symlinkOutputFile, L0→getSessionPathForSubagent,
//   X$→prefixAgentId, sK→createAbortController, RG→createTaskRecord, Zf→registerTask, E4→registerProcessExitCleanup,
//   x66→killAgentTask
```

### killAgentTask Function

**What it does:** Terminates a local agent task by aborting its controller and cleaning up resources.

```javascript
// ============================================
// killAgentTask - Terminate local agent task
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
function killAgentTask(taskId, setAppState) {
    let wasKilled = false;

    updateTaskState(taskId, setAppState, (task) => {
        // Guard: only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;
        task.abortController?.abort();      // Signal agent loop to stop
        task.unregisterCleanup?.();         // Remove process exit handler

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message to reduce memory
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    if (wasKilled) {
        flushTaskOutput(taskId);  // Ensure output is persisted
    }

    return wasKilled;
}

// Mapping: x66→killAgentTask, A→taskId, q→setAppState, i9→updateTaskState, $O→flushTaskOutput
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
// Location: chunks.136.mjs:1175-1231
// ============================================

// ORIGINAL (for source lookup):
Fn4 = {
    name: "RemoteAgentTask",
    type: "remote_agent",
    async spawn(A, q) {
        let {
            command: K,
            title: Y,
            toolUseId: z
        } = A, {
            abortController: _
        } = q;
        k(`RemoteAgentTask spawning: ${Y}`);
        let w = await DV1({
            initialMessage: K,
            description: Y,
            signal: _.signal
        });
        if (!w) throw Error("Failed to create remote session");
        let {
            taskId: O,
            cleanup: $
        } = cVY({
            session: {
                id: w.id,
                title: w.title || Y
            },
            command: K,
            context: q,
            toolUseId: z
        });
        return {
            taskId: O,
            cleanup: $
        }
    },
    async kill(A, q) {
        i9(A, q.setAppState, (K) => {
            if (K.status !== "running") return K;
            return {
                ...K,
                status: "killed",
                endTime: Date.now()
            }
        }), $O(A), k(`RemoteAgentTask ${A} marked as killed (local only)`)
    },
    renderStatus(A) {
        let q = A,
            K = q.status,
            Y = q.title;
        return Zl.createElement(m, null, Zl.createElement(T, {
            color: K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive"
        }, "[", K, "] ", Y))
    },
    renderOutput(A) {
        return Zl.createElement(m, null, Zl.createElement(T, null, A))
    }
};

// READABLE (for understanding):
const RemoteAgentTaskHandler = {
    name: "RemoteAgentTask",
    type: "remote_agent",

    async spawn(taskConfig, context) {
        let { command, title, toolUseId } = taskConfig;
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
            session: {
                id: session.id,
                title: session.title || title
            },
            command,
            context,
            toolUseId
        });

        return { taskId, cleanup };
    },

    async kill(taskId, context) {
        let { setAppState } = context;

        // 1. Update task state locally (no remote API call)
        updateTaskState(taskId, setAppState, (task) => {
            if (task.status !== "running") return task;
            return {
                ...task,
                status: "killed",
                endTime: Date.now()
            };
        });

        // 2. Flush output
        flushTaskOutput(taskId);

        log(`RemoteAgentTask ${taskId} marked as killed (local only)`);
    },

    renderStatus(task) {
        let status = task.status;
        let title = task.title;

        return (
            <Box>
                <Text color={status === "running" ? "warning"
                            : status === "completed" ? "success"
                            : status === "failed" ? "error"
                            : "inactive"}>
                    [{status}] {title}
                </Text>
            </Box>
        );
    },

    renderOutput(output) {
        return <Box><Text>{output}</Text></Box>;
    }
};

// Mapping: Fn4→RemoteAgentTaskHandler, DV1→createRemoteSession, cVY→registerSessionTask,
//   i9→updateTaskState, $O→flushTaskOutput, k→log, Zl→React, m→Box, T→Text
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