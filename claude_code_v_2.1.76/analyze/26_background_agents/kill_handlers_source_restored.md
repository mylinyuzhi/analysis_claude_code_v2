# Kill Handlers - Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the kill handler implementations for different task types.
> Includes LocalAgentTaskHandler, LocalBashTaskHandler, and RemoteAgentTaskHandler.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `LocalAgentTaskHandler` (Fk1) - Kill handler for local agents — `chunks.146.mjs:2292`
- `LocalBashTaskHandler` (Lf6) - Kill handler for shell commands — `chunks.133.mjs:2542`
- `RemoteAgentTaskHandler` (Fn4) - Kill handler for remote sessions — `chunks.136.mjs:1175`
- `triggerAbortSignal` (x66) - Trigger abort for task — `chunks.146.mjs:2012`
- `killLocalBashTask` (wQ6) - Kill local bash task — `chunks.95.mjs:1918`

---

## Overview

Kill handlers are task-type-specific handlers that manage the lifecycle and termination of background tasks. Each task type has a dedicated handler that implements:

1. **spawn** - Create and start the task
2. **kill** - Terminate the task gracefully
3. **renderStatus** - Display task status in UI
4. **renderOutput** - Display task output in UI

---

## Kill Handler Registry

### Handler Lookup

```javascript
// ============================================
// getKillHandlerForType - Handler lookup by task type
// Location: chunks.142.mjs (inferred)
// ============================================

// READABLE (for understanding):
const TASK_HANDLERS = {
    "local_agent": LocalAgentTaskHandler,
    "local_bash": LocalBashTaskHandler,
    "remote_agent": RemoteAgentTaskHandler,
    "in_process_teammate": InProcessTeammateHandler
};

function getKillHandlerForType(taskType) {
    return TASK_HANDLERS[taskType];
}
```

---

## LocalAgentTaskHandler (Fk1)

**What it does:** Handles local agent (subagent) tasks - creates, kills, and renders agent tasks.

### Source Code

```javascript
// ============================================
// Fk1 - LocalAgentTaskHandler - Kill handler for local agents
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
    renderStatus(A) {
        let q = A,
            K = q.status,
            Y = q.description,
            z = q.progress,
            _ = K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive",
            w = z ? ` (${z.toolUseCount} tools, ${z.tokenCount} tokens)` : "";
        return ml.createElement(m, null, ml.createElement(T, {
            color: _
        }, "[", K, "] ", Y, w))
    },
    renderOutput(A) {
        return ml.createElement(m, null, ml.createElement(T, null, A))
    }
};

// READABLE (for understanding):
LocalAgentTaskHandler = {
    name: "LocalAgentTask",
    type: "local_agent",

    // Create and start a local agent task
    async spawn(taskConfig, toolUseContext) {
        let {
            prompt,
            description,
            agentType,
            model,
            selectedAgent,
            agentId,
            toolUseId
        } = taskConfig;

        let { setAppState } = toolUseContext;

        // Generate task ID if not provided
        let taskId = agentId ?? createTaskId("local_agent");

        // Ensure output directory exists
        ensureOutputDirectory(taskId, getOutputDirectory(getOutputFilePath(taskId)));

        // Create abort controller for cancellation
        let abortController = new AbortController();

        // Build task record
        let task = {
            ...createTaskRecord(taskId, "local_agent", description, toolUseId),
            type: "local_agent",
            status: "running",
            agentId: taskId,
            prompt: prompt,
            selectedAgent: selectedAgent,
            agentType: agentType,
            model: model,
            abortController: abortController,
            retrieved: false,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: true,
            pendingMessages: []
        };

        // Register cleanup handler
        let unregisterCleanup = registerCleanupHandler(async () => {
            triggerAbortSignal(taskId, setAppState);
        });

        task.unregisterCleanup = unregisterCleanup;

        // Register task in state
        registerTask(task, setAppState);

        return {
            taskId: taskId,
            cleanup: () => {
                unregisterCleanup();
                abortController.abort();
            }
        };
    },

    // Kill a running local agent
    async kill(taskId, toolUseContext) {
        triggerAbortSignal(taskId, toolUseContext.setAppState);
    },

    // Render task status in UI
    renderStatus(task) {
        let { status, description, progress } = task;

        let color = status === "running" ? "warning"
                  : status === "completed" ? "success"
                  : status === "failed" ? "error"
                  : "inactive";

        let progressText = progress
            ? ` (${progress.toolUseCount} tools, ${progress.tokenCount} tokens)`
            : "";

        return React.createElement(
            View,
            null,
            React.createElement(Text, { color: color },
                "[", status, "] ", description, progressText
            )
        );
    },

    // Render task output in UI
    renderOutput(output) {
        return React.createElement(
            View,
            null,
            React.createElement(Text, null, output)
        );
    }
};

// Mapping: Fk1→LocalAgentTaskHandler, oV→createTaskId, Co→ensureOutputDirectory,
// L0→getOutputDirectory, X$→getOutputFilePath, sK→new AbortController,
// RG→createTaskRecord, E4→registerCleanupHandler, x66→triggerAbortSignal,
// Zf→registerTask
```

### Kill Flow for Local Agent

```
User triggers kill (Ctrl+C, TaskStop, etc.)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LocalAgentTaskHandler.kill(taskId, toolUseContext)                         │
│                                                                              │
│  1. Call triggerAbortSignal(taskId, setAppState)                           │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  triggerAbortSignal (x66)                                                   │
│                                                                              │
│  1. Check task status === "running"                                         │
│  2. Call task.abortController.abort()                                       │
│  3. Call task.unregisterCleanup()                                           │
│  4. Update state: status → "killed"                                         │
│  5. Keep only last message for memory efficiency                            │
│  6. Remove from active agents                                               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Agent Loop (in process)                                                    │
│                                                                              │
│  1. Detects abortController.signal.aborted === true                        │
│  2. Exits current iteration                                                  │
│  3. Runs finally block cleanup                                              │
│  4. Agent stops gracefully                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## LocalBashTaskHandler (Lf6)

**What it does:** Handles local bash (shell command) tasks - creates, kills, and renders shell tasks.

### Source Code

```javascript
// ============================================
// Lf6 - LocalBashTaskHandler - Kill handler for shell commands
// Location: chunks.133.mjs:2542-2610
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
            await z.taskOutput.flush(), z.cleanup();
            let X = !1;
            i9(j, $, (P) => {
                if (P.status === "killed") return X = !0, P;
                return {
                    ...P,
                    status: D.code === 0 ? "completed" : "failed",
                    result: {
                        code: D.code,
                        interrupted: D.interrupted
                    },
                    shellCommand: null,
                    unregisterCleanup: void 0,
                    endTime: Date.now()
                }
            }), GN1(j, Y, X ? "killed" : D.code === 0 ? "completed" : "failed", D.code, $, _, O), $O(j)
        }), {
            taskId: j,
            cleanup: () => {
                J()
            }
        }
    },
    async kill(A, q) {
        wQ6(A, q.setAppState)
    },
    renderStatus(A) {
        // ... render implementation
    }
};

// READABLE (for understanding):
LocalBashTaskHandler = {
    name: "LocalBashTask",
    type: "local_bash",

    // Create and start a local bash task
    async spawn(taskConfig, toolUseContext) {
        let {
            command,
            description,
            shellCommand,  // The running shell command object
            toolUseId,
            agentId,
            kind            // "background", "timeout", "interrupt"
        } = taskConfig;

        let { setAppState } = toolUseContext;
        let { taskOutput } = shellCommand;

        // Get task ID from shell command
        let taskId = taskOutput.taskId;

        // Register cleanup handler
        let unregisterCleanup = registerCleanupHandler(async () => {
            killLocalBashTask(taskId, setAppState);
        });

        // Build task record
        let task = {
            ...createTaskRecord(taskId, "local_bash", description, toolUseId),
            type: "local_bash",
            status: "running",
            command: command,
            completionStatusSentInAttachment: false,
            shellCommand: shellCommand,
            unregisterCleanup: unregisterCleanup,
            lastReportedTotalLines: 0,
            isBackgrounded: true,
            agentId: agentId,
            kind: kind
        };

        // Register task in state
        registerTask(task, setAppState);

        // Start background execution
        shellCommand.background(taskId);

        // Wait for completion
        shellCommand.result.then(async (result) => {
            // Flush output file
            await shellCommand.taskOutput.flush();
            shellCommand.cleanup();

            let wasKilled = false;

            // Update task state
            atomicUpdateTask(taskId, setAppState, (t) => {
                if (t.status === "killed") {
                    wasKilled = true;
                    return t;
                }

                return {
                    ...t,
                    status: result.code === 0 ? "completed" : "failed",
                    result: {
                        code: result.code,
                        interrupted: result.interrupted
                    },
                    shellCommand: null,
                    unregisterCleanup: undefined,
                    endTime: Date.now()
                };
            });

            // Send completion notification
            sendTaskCompletionNotification(
                taskId,
                description,
                wasKilled ? "killed" : (result.code === 0 ? "completed" : "failed"),
                result.code,
                setAppState,
                toolUseId,
                kind
            );

            // Remove from active agents
            removeActiveAgent(taskId);
        });

        return {
            taskId: taskId,
            cleanup: () => {
                unregisterCleanup();
            }
        };
    },

    // Kill a running local bash task
    async kill(taskId, toolUseContext) {
        killLocalBashTask(taskId, toolUseContext.setAppState);
    },

    // Render task status in UI
    renderStatus(task) {
        if (!isTaskVisible(task)) return null;

        let { status, command } = task;

        // ... render implementation
    }
};

// Mapping: Lf6→LocalBashTaskHandler, wQ6→killLocalBashTask, RG→createTaskRecord,
// Zf→registerTask, i9→atomicUpdateTask, GN1→sendTaskCompletionNotification,
// $O→removeActiveAgent, E4→registerCleanupHandler
```

### Kill Flow for Local Bash

```
User triggers kill (Ctrl+C, TaskStop, etc.)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LocalBashTaskHandler.kill(taskId, toolUseContext)                          │
│                                                                              │
│  1. Call killLocalBashTask(taskId, setAppState)                            │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  killLocalBashTask (wQ6)                                                    │
│                                                                              │
│  1. Find shell command object from task                                     │
│  2. Kill child process (process group)                                      │
│  3. Mark task as killed                                                     │
│  4. Flush output file                                                       │
│  5. Cleanup resources                                                        │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Child Process (in background)                                              │
│                                                                              │
│  1. Receives SIGTERM/SIGKILL                                                │
│  2. Process terminates                                                       │
│  3. Promise resolves with exit code                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## RemoteAgentTaskHandler (Fn4)

**What it does:** Handles remote agent tasks (remote sessions) - creates, kills, and renders remote tasks.

### Source Code

```javascript
// ============================================
// Fn4 - RemoteAgentTaskHandler - Kill handler for remote sessions
// Location: chunks.136.mjs:1175-1230
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
    }
};

// READABLE (for understanding):
RemoteAgentTaskHandler = {
    name: "RemoteAgentTask",
    type: "remote_agent",

    // Create and start a remote agent task
    async spawn(taskConfig, toolUseContext) {
        let {
            command,
            title,
            toolUseId
        } = taskConfig;

        let { abortController } = toolUseContext;

        logDebug(`RemoteAgentTask spawning: ${title}`);

        // Create remote session
        let session = await createRemoteSession({
            initialMessage: command,
            description: title,
            signal: abortController.signal
        });

        if (!session) {
            throw Error("Failed to create remote session");
        }

        // Create task record for tracking
        let { taskId, cleanup } = createRemoteTaskRecord({
            session: {
                id: session.id,
                title: session.title || title
            },
            command: command,
            context: toolUseContext,
            toolUseId: toolUseId
        });

        return {
            taskId: taskId,
            cleanup: cleanup
        };
    },

    // Kill a running remote agent task
    async kill(taskId, toolUseContext) {
        // Update local state only - remote session continues
        atomicUpdateTask(taskId, toolUseContext.setAppState, (task) => {
            if (task.status !== "running") return task;

            return {
                ...task,
                status: "killed",
                endTime: Date.now()
            };
        });

        removeActiveAgent(taskId);

        logDebug(`RemoteAgentTask ${taskId} marked as killed (local only)`);
    },

    // Render task status in UI
    renderStatus(task) {
        let { status, title } = task;

        let color = status === "running" ? "warning"
                  : status === "completed" ? "success"
                  : status === "failed" ? "error"
                  : "inactive";

        return React.createElement(
            View,
            null,
            React.createElement(Text, { color: color },
                "[", status, "] ", title
            )
        );
    }
};

// Mapping: Fn4→RemoteAgentTaskHandler, DV1→createRemoteSession, cVY→createRemoteTaskRecord,
// i9→atomicUpdateTask, $O→removeActiveAgent
```

### Key Insight: Remote Kill is Local-Only

**Why this design?**

Remote agent tasks run in separate processes or machines. When killed:
1. Local state is updated immediately
2. Remote session continues running
3. No attempt to terminate remote process

This is intentional because:
- Remote sessions may be shared resources
- Network failures shouldn't block local operations
- User can reconnect to remote session later

---

## Comparison Table

| Handler | Task Type | Kill Mechanism | Process Control |
|---------|-----------|----------------|-----------------|
| LocalAgentTaskHandler | local_agent | AbortController + cleanup | In-process abort |
| LocalBashTaskHandler | local_bash | Process group kill | Child process termination |
| RemoteAgentTaskHandler | remote_agent | Local state update | None (remote continues) |

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `Fk1` | LocalAgentTaskHandler | chunks.146.mjs:2292 | ✓ Verified |
| `Lf6` | LocalBashTaskHandler | chunks.133.mjs:2542 | ✓ Verified |
| `Fn4` | RemoteAgentTaskHandler | chunks.136.mjs:1175 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `wQ6` | killLocalBashTask | chunks.95.mjs:1918 | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine
- [output_capture_source_restored.md](./output_capture_source_restored.md) - Output files
- [../08_subagent/abort_signal_propagation.md](../08_subagent/abort_signal_propagation.md) - Abort propagation