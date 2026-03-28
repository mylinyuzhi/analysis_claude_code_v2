# Teammate Execution Complete Source (Claude Code 2.1.76)

> Complete source-level documentation for teammate execution with dual-version format.
> Cross-validated against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `pollForNextMessage` (DNY) - Priority poll loop for teammate messages — `chunks.134.mjs:1483`
- `inProcessAgentRunner` (XNY) - Runner for in-process teammates — `chunks.134.mjs:1571`
- `claimUnclaimedTask` (Ji4) - Claim unclaimed task for teammate — `chunks.134.mjs:1464`
- `spawnTeammate` (qn4) - Spawn teammate agent — `chunks.135.mjs:1116`
- `spawnTeammateDispatcher` (pNY) - Route teammate spawn to backend — `chunks.135.mjs:1110`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Teammate Execution Architecture                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │  AgentTool      │  Task tool with name + team_name                       │
│  │  (QW6)          │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ spawnTeammate   │  Route to appropriate backend                          │
│  │ Dispatcher(pNY) │  ├─ in-process (non-interactive)                       │
│  └────────┬────────┘  ├─ split-pane (iTerm2/tmux)                           │
│           │           └─ tmux-only (fallback)                               │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ inProcessAgent  │  Main execution loop for in-process teammates          │
│  │ Runner (XNY)    │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├──────────────────────────────────────┐                          │
│           │                                      │                          │
│           ▼                                      ▼                          │
│  ┌─────────────────┐                    ┌─────────────────┐                │
│  │ agentLoopRunner │                    │ pollForNextMsg  │                │
│  │ (qh)            │                    │ (DNY)           │                │
│  │                 │                    │                 │                │
│  │ LLM execution   │                    │ Mailbox polling │                │
│  │ with tools      │                    │ Task claiming   │                │
│  └─────────────────┘                    └─────────────────┘                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Mailbox System                               │    │
│  │                                                                       │    │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐          │    │
│  │  │wl: read  │   │x3: write │   │Vc6: mark │   │kc6: mark │          │    │
│  │  │mailbox   │   │to mailbox│   │as read   │   │all read  │          │    │
│  │  └──────────┘   └──────────┘   └──────────┘   └──────────┘          │    │
│  │                                                                       │    │
│  │  File: ~/.claude/teams/{team_name}/mailboxes/{agent_name}.json       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithm: Poll For Next Message (DNY)

### What It Does

The `pollForNextMessage` function is the heartbeat of teammate communication. It:
1. Checks for pending user messages in task state
2. Polls the mailbox for new messages from other agents
3. Prioritizes shutdown requests over regular messages
4. Claims unclaimed tasks from the shared task list
5. Returns the first available message or waits

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Poll For Next Message (DNY)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  while (!abortController.signal.aborted) {                                  │
│                                                                              │
│      1. CHECK PENDING USER MESSAGES (highest priority)                      │
│         └─ Check task.pendingUserMessages                                   │
│         └─ Return first message immediately if found                        │
│                                                                              │
│      2. SLEEP 500ms (if not first iteration)                                │
│                                                                              │
│      3. READ MAILBOX                                                        │
│         └─ wl(agentName, teamName)                                          │
│                                                                              │
│      4. CHECK FOR SHUTDOWN REQUESTS (priority over regular messages)        │
│         └─ Parse message for shutdown_request                               │
│         └─ If found: mark as read, return shutdown_request                  │
│                                                                              │
│      5. FIND TEAM-LEAD MESSAGES                                             │
│         └─ Messages with from === "team-lead"                               │
│         └─ If found: mark as read, return new_message                       │
│                                                                              │
│      6. FIND ANY UNREAD MESSAGE                                             │
│         └─ First unread message in mailbox                                  │
│         └─ Mark as read, return new_message                                 │
│                                                                              │
│      7. CHECK UNCLAIMED TASKS                                               │
│         └─ Ji4(parentSessionId, agentName)                                  │
│         └─ If found: return new_message from task-list                      │
│                                                                              │
│  }                                                                          │
│                                                                              │
│  return { type: "aborted" }                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// DNY - pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1569
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {
                let D = M.tasks[K];
                if (!D || D.type !== "in_process_teammate") return M;
                return {
                    ...M,
                    tasks: {
                        ...M.tasks,
                        [K]: {
                            ...D,
                            pendingUserMessages: D.pendingUserMessages.slice(1)
                        }
                    }
                }
            }), k(`[inProcessRunner] ${A.agentName} found pending user message (poll #${O})`), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return k(`[inProcessRunner] ${A.agentName} aborted while waiting (poll #${O})`), {
            type: "aborted"
        };
        k(`[inProcessRunner] ${A.agentName} poll #${O}: checking mailbox`);
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1,
                D = null;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) {
                        M = P, D = Z;
                        break
                    }
                }
            }
            if (M !== -1) {
                let P = J[M],
                    W = J.slice(0, M).filter((Z) => !Z.read).length;
                return k(`[inProcessRunner] ${A.agentName} received shutdown request from ${D?.from} (prioritized over ${W} unread messages)`), await Vc6(A.agentName, A.teamName, M), {
                    type: "shutdown_request",
                    request: D,
                    originalMessage: P.text
                }
            }
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) {
                    X = P;
                    break
                }
            }
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                if (P) return k(`[inProcessRunner] ${A.agentName} received new message from ${P.from} (index ${X})`), await Vc6(A.agentName, A.teamName, X), {
                    type: "new_message",
                    message: P.text,
                    from: P.from,
                    color: P.color,
                    summary: P.summary
                }
            }
        } catch (J) {
            k(`[inProcessRunner] ${A.agentName} poll error: ${J}`)
        }
        let j = await Ji4(_, A.agentName);
        if (j) return {
            type: "new_message",
            message: j,
            from: "task-list"
        }
    }
    return k(`[inProcessRunner] ${A.agentName} exiting poll loop (abort=${q.signal.aborted}, polls=${O})`), {
        type: "aborted"
    }
}

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, parentSessionId) {
    log(`[inProcessRunner] ${identity.agentName} starting poll loop (abort=${abortController.signal.aborted})`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // ========================================
        // PRIORITY 1: Check pending user messages
        // ========================================
        let task = getAppState().tasks[taskId];
        if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let userMessage = task.pendingUserMessages[0];

            // Remove the message from pending queue
            setAppState((state) => {
                let currentTask = state.tasks[taskId];
                if (!currentTask || currentTask.type !== "in_process_teammate") {
                    return state;
                }
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...currentTask,
                            pendingUserMessages: currentTask.pendingUserMessages.slice(1)
                        }
                    }
                };
            });

            log(`[inProcessRunner] ${identity.agentName} found pending user message (poll #${pollCount})`);

            return {
                type: "new_message",
                message: userMessage,
                from: "user"
            };
        }

        // ========================================
        // SLEEP between polls (500ms)
        // ========================================
        if (pollCount > 0) {
            await sleep(500);
        }

        pollCount++;

        // Check for abort after sleep
        if (abortController.signal.aborted) {
            log(`[inProcessRunner] ${identity.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);

        // ========================================
        // PRIORITY 2-5: Check mailbox
        // ========================================
        try {
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // PRIORITY 2: Check for shutdown requests
            let shutdownIndex = -1;
            let shutdownRequest = null;

            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let parsed = parseShutdownRequest(msg.text);
                    if (parsed) {
                        shutdownIndex = i;
                        shutdownRequest = parsed;
                        break;
                    }
                }
            }

            if (shutdownIndex !== -1) {
                let originalMessage = messages[shutdownIndex];
                let priorUnreadCount = messages.slice(0, shutdownIndex).filter((m) => !m.read).length;

                log(`[inProcessRunner] ${identity.agentName} received shutdown request from ${shutdownRequest?.from} (prioritized over ${priorUnreadCount} unread messages)`);

                // Mark as read
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIndex);

                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: originalMessage.text
                };
            }

            // PRIORITY 3: Check for team-lead messages
            let teamLeadIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_NAME) {
                    teamLeadIndex = i;
                    break;
                }
            }

            // PRIORITY 4: Find any unread message
            if (teamLeadIndex === -1) {
                teamLeadIndex = messages.findIndex((m) => !m.read);
            }

            if (teamLeadIndex !== -1) {
                let message = messages[teamLeadIndex];
                if (message) {
                    log(`[inProcessRunner] ${identity.agentName} received new message from ${message.from} (index ${teamLeadIndex})`);

                    // Mark as read
                    await markMessageAsReadByIndex(identity.agentName, identity.teamName, teamLeadIndex);

                    return {
                        type: "new_message",
                        message: message.text,
                        from: message.from,
                        color: message.color,
                        summary: message.summary
                    };
                }
            }

        } catch (error) {
            log(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // ========================================
        // PRIORITY 5: Check unclaimed tasks
        // ========================================
        let taskMessage = await claimUnclaimedTask(parentSessionId, identity.agentName);
        if (taskMessage) {
            return {
                type: "new_message",
                message: taskMessage,
                from: "task-list"
            };
        }
    }

    log(`[inProcessRunner] ${identity.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`);
    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId, Y→getAppState,
//          z→setAppState, _→parentSessionId, wl→readMailbox, Vc6→markMessageAsReadByIndex,
//          Ji4→claimUnclaimedTask, jNY→sleep, M66→parseShutdownRequest, BY→TEAM_LEAD_NAME
```

### Key Design Decisions

**Why 500ms poll interval?**
- Balance between responsiveness and CPU usage
- Fast enough for interactive collaboration
- Prevents tight polling loops

**Why shutdown requests have priority?**
- Allows team-lead to coordinate termination
- Prevents wasted work on cancelled tasks
- Ensures clean shutdown flow

**Why team-lead messages are prioritized?**
- Team-lead coordinates agent activities
- Ensures prompt response to assignments
- Maintains hierarchy for team coordination

---

## Core Algorithm: In-Process Agent Runner (XNY)

### What It Does

The `inProcessAgentRunner` is the main execution loop for teammates running in the same process. It:
1. Builds the agent definition with teammate-specific tools
2. Runs the agent loop runner (qh) for each prompt
3. Handles compaction when history grows too large
4. Sends idle notifications when waiting for messages
5. Processes incoming messages from the poll loop

### Source Code

```javascript
// ============================================
// XNY - inProcessAgentRunner - Runner for in-process teammates
// Location: chunks.134.mjs:1571-1850
// ============================================

// ORIGINAL (for source lookup):
async function XNY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: _,
        teammateContext: w,
        toolUseContext: O,
        abortController: $,
        model: H,
        systemPrompt: j,
        systemPromptMode: J,
        allowedTools: M,
        allowPermissionPrompts: D
    } = A, {
        setAppState: X
    } = O;
    k(`[inProcessRunner] Starting agent loop for ${q.agentId}`);

    // Build agent identity
    let P = {
        agentId: q.agentId,
        parentSessionId: q.parentSessionId,
        agentName: q.agentName,
        teamName: q.teamName,
        agentColor: q.color,
        planModeRequired: q.planModeRequired,
        isTeamLead: !1,
        agentType: "teammate"
    };

    // Build system prompt
    let W;
    if (J === "replace" && j) {
        W = j;
    } else {
        let L = [...await getBaseTools(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`
# Custom Agent Instructions
${h}`);
            if (_.memory) {
                recordTelemetry("tengu_agent_memory_loaded", {
                    scope: _.memory,
                    source: "in-process-teammate"
                });
            }
        }
        if (J === "append" && j) L.push(j);
        W = L.join(`
`);
    }

    // Build agent definition
    let Z = {
        agentType: q.agentName,
        whenToUse: `In-process teammate: ${q.agentName}`,
        getSystemPrompt: () => W,
        tools: _?.tools ? [...new Set([..._.tools, "SendMessage", "TaskCreate", "TaskUpdate", "TaskGet", "TaskList", "CronCreate"])] : ["*"],
        source: "projectSettings",
        permissionMode: "default",
        ..._?.model ? { model: _.model } : {}
    };

    let G = [];  // Message history
    let f = formatPrompt("team-lead", Y, void 0, z);
    let v = f;   // Current prompt
    let N = !1;  // Done flag

    // Check for unclaimed tasks
    await claimUnclaimedTask(q.parentSessionId, q.agentName);

    try {
        // Add initial message to task
        atomicUpdateTask(K, (task) => ({
            ...task,
            messages: [...task.messages ?? [], createUserMessage({ content: f })]
        }), X);

        // Main execution loop
        while (!$.signal.aborted && !N) {
            log(`[inProcessRunner] ${q.agentId} processing prompt: ${v.substring(0,50)}...`);

            // Create abort controller for current work
            let workAbortController = createAbortController();
            atomicUpdateTask(K, (task) => ({
                ...task,
                currentWorkAbortController: workAbortController
            }), X);

            let userMessage = createUserMessage({ content: v });
            let currentMessages = [userMessage];
            let history = G;
            let historyTokens = countTokens(G);

            // Compaction check
            if (historyTokens > getMaxTokensForModel(O.options.mainLoopModel)) {
                log(`[inProcessRunner] ${q.agentId} compacting history (${historyTokens} tokens)`);

                let compactContext = {
                    ...O,
                    readFileState: cloneReadFileState(O.readFileState),
                    onCompactProgress: void 0,
                    setStreamMode: void 0
                };

                let compacted = await compactMessages(G, compactContext, {
                    systemPrompt: formatSystemPrompt([]),
                    userContext: {},
                    systemContext: {},
                    toolUseContext: compactContext,
                    forkContextMessages: []
                }, true, void 0, true);

                history = compacted.messages;
                clearCompactionState();
                G.length = 0;
                G.push(...history);

                atomicUpdateTask(K, (task) => ({
                    ...task,
                    messages: [...history, userMessage]
                }), X);
            }

            let forkMessages = history.length > 0 ? [...history] : void 0;
            G.push(userMessage);

            // Build progress tracker
            let progressTracker = createProgressTracker();
            let toolsSnapshot = snapshotTools(O.options.tools);
            let turnMessages = [];

            // Get permission mode from task
            let task = O.getAppState().tasks[K];
            let taskPermissionMode = task && task.type === "in_process_teammate"
                ? task.permissionMode
                : "default";

            let agentDef = {
                ...Z,
                permissionMode: taskPermissionMode
            };

            let wasInterrupted = false;

            // Run with teammate context
            await runWithTeammateContext(w, async () => {
                return runWithAgentIdentity(P, async () => {
                    // Update task status to running
                    atomicUpdateTask(K, (task) => ({
                        ...task,
                        status: "running",
                        isIdle: false
                    }), X);

                    // Run agent loop
                    for await (let message of agentLoopRunner({
                        agentDefinition: agentDef,
                        promptMessages: currentMessages,
                        toolUseContext: O,
                        canUseTool: createCanUseToolCallback(q, workAbortController, (pausedMs) => {
                            atomicUpdateTask(K, (task) => ({
                                ...task,
                                totalPausedMs: (task.totalPausedMs ?? 0) + pausedMs
                            }), X);
                        }),
                        isAsync: true,
                        canShowPermissionPrompts: D ?? true,
                        forkContextMessages: forkMessages,
                        querySource: "agent:custom",
                        override: {
                            abortController: workAbortController
                        },
                        model: H,
                        preserveToolUseResults: true,
                        availableTools: O.options.tools,
                        allowedTools: M
                    })) {
                        // Check for lifecycle abort
                        if ($.signal.aborted) {
                            log(`[inProcessRunner] ${q.agentId} lifecycle aborted`);
                            break;
                        }

                        // Check for work abort (Escape pressed)
                        if (workAbortController.signal.aborted) {
                            log(`[inProcessRunner] ${q.agentId} current work aborted (Escape pressed)`);
                            wasInterrupted = true;
                            break;
                        }

                        turnMessages.push(message);
                        G.push(message);

                        // Update progress
                        updateProgressTracker(progressTracker, message, toolsSnapshot, O.options.tools);
                        let progressText = getProgressText(progressTracker);

                        // Update task state with message and progress
                        atomicUpdateTask(K, (task) => {
                            let inProgressTools = task.inProgressToolUseIDs;

                            if (message.type === "assistant") {
                                for (let content of message.message.content) {
                                    if (content.type === "tool_use") {
                                        inProgressTools = new Set([...inProgressTools ?? [], content.id]);
                                    }
                                }
                            } else if (message.type === "user") {
                                let contents = message.message.content;
                                if (Array.isArray(contents)) {
                                    for (let item of contents) {
                                        if (typeof item === "object" && "type" in item && item.type === "tool_result") {
                                            if (inProgressTools) {
                                                inProgressTools = new Set(inProgressTools);
                                                inProgressTools.delete(item.tool_use_id);
                                            }
                                        }
                                    }
                                }
                            }

                            return {
                                ...task,
                                progress: progressText,
                                messages: [...task.messages ?? [], message],
                                inProgressToolUseIDs: inProgressTools
                            };
                        }, X);
                    }

                    return { success: true, messages: turnMessages };
                });
            });

            // Clear current work abort controller
            atomicUpdateTask(K, (task) => ({
                ...task,
                currentWorkAbortController: void 0
            }), X);

            // Check for lifecycle abort
            if ($.signal.aborted) break;

            // Handle interruption
            if (wasInterrupted) {
                log(`[inProcessRunner] ${q.agentId} work interrupted, returning to idle`);
                let interruptMessage = createAssistantMessage({ content: INTERRUPTED_MESSAGE });
                atomicUpdateTask(K, (task) => ({
                    ...task,
                    messages: [...task.messages ?? [], interruptMessage]
                }), X);
            }

            // Check if already idle (prevent duplicate notifications)
            let currentTask = O.getAppState().tasks[K];
            let wasAlreadyIdle = currentTask?.type === "in_process_teammate" && currentTask.isIdle;

            // Run idle callbacks and set isIdle
            atomicUpdateTask(K, (task) => {
                task.onIdleCallbacks?.forEach((cb) => cb());
                return {
                    ...task,
                    isIdle: true,
                    onIdleCallbacks: []
                };
            }, X);

            // Send idle notification
            if (!wasAlreadyIdle) {
                await sendIdleNotification(q.agentName, q.color, q.teamName, {
                    idleReason: wasInterrupted ? "interrupted" : "available",
                    summary: generateSummary(G)
                });
            } else {
                log(`[inProcessRunner] Skipping duplicate idle notification for ${q.agentName}`);
            }

            log(`[inProcessRunner] ${q.agentId} finished prompt, waiting for next`);

            // Poll for next message
            let nextMessage = await pollForNextMessage(q, $, K, O.getAppState, X, q.parentSessionId);

            switch (nextMessage.type) {
                case "shutdown_request":
                    log(`[inProcessRunner] ${q.agentId} received shutdown request - passing to model`);
                    v = formatPrompt(nextMessage.request?.from || "team-lead", nextMessage.originalMessage);
                    appendToTaskMessages(K, createUserMessage({ content: v }), X);
                    break;

                case "new_message":
                    log(`[inProcessRunner] ${q.agentId} received new message from ${nextMessage.from}`);
                    if (nextMessage.from === "user") {
                        v = nextMessage.message;
                    } else {
                        v = formatPrompt(nextMessage.from, nextMessage.message, nextMessage.color, nextMessage.summary);
                    }
                    appendToTaskMessages(K, createUserMessage({ content: v }), X);
                    break;

                case "aborted":
                    log(`[inProcessRunner] ${q.agentId} poll aborted, exiting`);
                    N = true;
                    break;
            }
        }
    } finally {
        // Cleanup
        if ($.signal.aborted) {
            markTaskKilled(K, X);
        } else {
            markTaskCompleted(K, X);
        }
    }
}

// Mapping: XNY→inProcessAgentRunner, A→config, q→identity, K→taskId, Y→prompt, z→description,
//          _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController, H→model,
//          j→systemPrompt, J→systemPromptMode, M→allowedTools, D→allowPermissionPrompts
```

---

## Helper Functions

### claimUnclaimedTask (Ji4)

```javascript
// ============================================
// Ji4 - claimUnclaimedTask - Claim unclaimed task for teammate
// Location: chunks.134.mjs:1464-1481
// ============================================

// ORIGINAL (for source lookup):
async function Ji4(A, q) {
    try {
        let K = await DX(A),
            Y = JNY(K);
        if (!Y) return;
        let z = await OT8(A, Y.id, q);
        if (!z.success) {
            k(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`);
            return
        }
        return await WI(A, Y.id, {
            status: "in_progress"
        }), k(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), MNY(Y)
    } catch (K) {
        k(`[inProcessRunner] Error checking task list: ${K}`);
        return
    }
}

// READABLE (for understanding):
async function claimUnclaimedTask(parentSessionId, agentName) {
    try {
        // Get all tasks for this session
        let tasks = await loadTaskList(parentSessionId);

        // Find the next available (unclaimed) task
        let unclaimedTask = findNextUnclaimedTask(tasks);
        if (!unclaimedTask) {
            return;  // No tasks to claim
        }

        // Try to claim the task
        let claimResult = await claimTask(parentSessionId, unclaimedTask.id, agentName);
        if (!claimResult.success) {
            log(`[inProcessRunner] Failed to claim task #${unclaimedTask.id}: ${claimResult.reason}`);
            return;
        }

        // Update task status to in_progress
        await updateTaskStatus(parentSessionId, unclaimedTask.id, {
            status: "in_progress"
        });

        log(`[inProcessRunner] Claimed task #${unclaimedTask.id}: ${unclaimedTask.subject}`);

        // Return formatted prompt for this task
        return formatTaskPrompt(unclaimedTask);

    } catch (error) {
        log(`[inProcessRunner] Error checking task list: ${error}`);
        return;
    }
}

// Mapping: Ji4→claimUnclaimedTask, A→parentSessionId, q→agentName, K→tasks, Y→unclaimedTask,
//          DX→loadTaskList, JNY→findNextUnclaimedTask, OT8→claimTask, WI→updateTaskStatus,
//          MNY→formatTaskPrompt
```

---

### spawnTeammateDispatcher (pNY) and spawnTeammate (qn4)

```javascript
// ============================================
// pNY - spawnTeammateDispatcher - Route teammate spawn to backend
// qn4 - spawnTeammate - Spawn teammate agent
// Location: chunks.135.mjs:1110-1118
// ============================================

// ORIGINAL (for source lookup):
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}

async function qn4(A, q) {
    return pNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(config, context) {
    // Route to appropriate backend:

    // 1. Check for tmux session mode (external terminal)
    if (isExternalTmuxSession()) {
        return spawnInTmuxSession(config, context);  // FNY
    }

    // 2. Check for split-pane support (iTerm2/tmux)
    if (config.use_splitpane !== false) {
        return spawnInSplitPane(config, context);  // BNY
    }

    // 3. Fallback to tmux-only
    return spawnInTmuxOnly(config, context);  // gNY
}

async function spawnTeammate(config, context) {
    // Alias for spawnTeammateDispatcher
    return spawnTeammateDispatcher(config, context);
}

// Mapping: pNY→spawnTeammateDispatcher, qn4→spawnTeammate, Rb→isExternalTmuxSession,
//          FNY→spawnInTmuxSession, BNY→spawnInSplitPane, gNY→spawnInTmuxOnly
```

**Why three backends?**
1. **In-process**: No external terminal needed, shares process memory
2. **Split-pane**: Visual separation, uses iTerm2 or tmux split
3. **Tmux-only**: Works in any terminal with tmux installed

---

## Message Priority Algorithm

```
Priority Order for pollForNextMessage:

1. PENDING USER MESSAGES    (immediate)
   └─ User directly sent message via UI

2. SHUTDOWN REQUESTS        (high priority)
   └─ Team-lead requesting termination
   └─ Parse: M66(message) checks for shutdown_request type

3. TEAM-LEAD MESSAGES       (elevated priority)
   └─ From: "team-lead"
   └─ Coordinated task assignments

4. ANY UNREAD MESSAGE       (normal priority)
   └─ First unread in mailbox
   └─ From any teammate

5. UNCLAIMED TASKS          (lowest priority)
   └─ Tasks in shared task list without assignee
   └─ Agent claims and processes
```

---

## Integration with Mailbox System

The teammate execution system heavily integrates with the mailbox system:

| Function | Purpose | Location |
|----------|---------|----------|
| `wl` | Read all messages | chunks.132.mjs:3 |
| `x3` | Write new message | chunks.132.mjs:22 |
| `Vc6` | Mark single message as read | chunks.132.mjs:57 |
| `kc6` | Mark all messages as read | chunks.132.mjs:92 |

See [mailbox_system_complete_source.md](./mailbox_system_complete_source.md) for full details.

---

## Verification Status

| Symbol | Location | Verification |
|--------|----------|--------------|
| `DNY` | chunks.134.mjs:1483 | ✓ Direct source match |
| `XNY` | chunks.134.mjs:1571 | ✓ Direct source match |
| `Ji4` | chunks.134.mjs:1464 | ✓ Direct source match |
| `pNY` | chunks.135.mjs:1110 | ✓ Direct source match |
| `qn4` | chunks.135.mjs:1116 | ✓ Direct source match |

---

## Related Documents

- [mailbox_system_complete_source.md](./mailbox_system_complete_source.md) - Mailbox system
- [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop runner
- [communication_and_coordination.md](./communication_and_coordination.md) - Communication overview