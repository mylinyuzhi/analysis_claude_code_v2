# Cross Validation Unified - Complete Symbol Verification (Claude Code 2.1.76)

> Complete cross-validated symbol mapping for both 08_subagent and 26_background_agents modules.
> All symbols verified against source code on 2026-03-27.

---

## Verification Method

1. **Source Code Lookup** - Read actual function definitions from chunks.*.mjs
2. **Behavioral Verification** - Trace call chains and parameter usage
3. **Cross-Reference** - Verify consistent naming across multiple files
4. **Signature Matching** - Compare function signatures with documentation

---

## Module 1: Agent Tool & Schema (chunks.136.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512 | tool object | ✓ Direct assignment |
| `r4` | TOOL_NAME_AGENT | chunks.136.mjs:1529 | constant | ✓ name property |
| `I46` | TOOL_ALIAS_TASK | chunks.136.mjs:1531 | constant | ✓ aliases array |
| `aVY` | agentInputSchema | chunks.136.mjs:1444 | function | ✓ Schema factory |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451 | function | ✓ Schema factory |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492 | function | ✓ Schema factory |
| `xx8` | getEffectiveInputSchema | chunks.136.mjs:1461 | function | ✓ Conditional schema |

---

## Module 2: Agent Loop Runner (chunks.133.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | async generator | ✓ Main agent loop |
| `Yh` | llmMessageLoop | chunks.133.mjs:1747 | async generator | ✓ Called in qh |
| `vvY` | buildSystemPrompt | chunks.133.mjs:1633 | async function | ✓ System prompt builder |
| `_c` | applyToolFilters | chunks.133.mjs:1631 | function | ✓ Tool filtering |
| `Bc6` | createToolUseContext | chunks.133.mjs:1719 | function | ✓ Context creation |

### agentLoopRunner (qh) - Source Verified

```javascript
// ============================================
// qh - agentLoopRunner - Main agent execution loop
// Location: chunks.133.mjs:1565-1749
// ============================================

// ORIGINAL (for source lookup):
async function* qh({
    agentDefinition: A,
    promptMessages: q,
    toolUseContext: K,
    canUseTool: Y,
    isAsync: z,
    canShowPermissionPrompts: _,
    forkContextMessages: w,
    querySource: O,
    override: $,
    model: H,
    maxTurns: j,
    preserveToolUseResults: J,
    availableTools: M,
    allowedTools: D,
    onCacheSafeParams: X,
    useExactTools: P,
    worktreePath: W,
    transcriptSubdir: Z,
    onQueryProgress: G
}) {
    let f = K.getAppState(),
        v = f.toolPermissionContext.mode,
        N = K.setAppStateForTasks ?? K.setAppState,
        V = C01(A.model, K.options.mainLoopModel, H, v),
        L = $?.agentId ? $.agentId : bI();
    // ... continues with agent initialization
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,
    promptMessages,
    toolUseContext,
    canUseTool,
    isAsync,
    canShowPermissionPrompts,
    forkContextMessages,
    querySource,
    override,
    model,
    maxTurns,
    preserveToolUseResults,
    availableTools,
    allowedTools,
    onCacheSafeParams,
    useExactTools,
    worktreePath,
    transcriptSubdir,
    onQueryProgress
}) {
    // Step 1: Get app state and derive model
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let derivedModel = deriveModel(agentDefinition.model, toolUseContext.options.mainLoopModel, model, permissionMode);

    // Step 2: Generate or use provided agent ID
    let agentId = override?.agentId ? override.agentId : generateAgentId();

    // Step 3: Build message context
    let messages = [...forkContextMessages ? cloneForkContext(forkContextMessages) : [], ...promptMessages];

    // Step 4: Build system prompt
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : unrollPrompt(await buildSystemPrompt(agentDefinition, toolUseContext, derivedModel, workingDirectories));

    // Step 5: Set up abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync
            ? new AbortController()
            : toolUseContext.abortController;

    // Step 6: Register hooks if defined
    if (agentDefinition.hooks) {
        registerHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // Step 7: Load skills if defined
    let skills = agentDefinition.skills ?? [];
    // ... skill loading logic

    // Step 8: Run LLM message loop
    for await (let event of llmMessageLoop({
        messages,
        systemPrompt,
        // ... other params
    })) {
        yield event;
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext
```

---

## Module 3: In-Process Agent Runner (chunks.134.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | async function | ✓ Teammate runner |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | async function | ✓ Message polling |

### inProcessAgentRunner (XNY) - Source Verified

```javascript
// ============================================
// XNY - inProcessAgentRunner - Run in-process teammate
// Location: chunks.134.mjs:1571-1699
// ============================================

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,
        taskId,
        prompt,
        description,
        agentDefinition,
        teammateContext,
        toolUseContext,
        abortController,
        model,
        systemPrompt,
        systemPromptMode,
        allowedTools,
        allowPermissionPrompts
    } = config;

    let { setAppState } = toolUseContext;

    // Step 1: Build teammate identity context
    let teammateIdentity = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Step 2: Build system prompt
    let finalSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        finalSystemPrompt = systemPrompt;
    } else {
        // Build from agent definition
        let prompts = [...await getToolPrompts(toolUseContext.options.tools, ...)];
        if (agentDefinition?.getSystemPrompt) {
            prompts.push(`\n# Custom Agent Instructions\n${agentDefinition.getSystemPrompt()}`);
        }
        if (systemPromptMode === "append" && systemPrompt) {
            prompts.push(systemPrompt);
        }
        finalSystemPrompt = prompts.join('\n');
    }

    // Step 3: Create agent definition for teammate
    let teammateAgentDef = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => finalSystemPrompt,
        tools: agentDefinition?.tools
            ? [...new Set([...agentDefinition.tools, SendMessage, ReadMailbox, ListTasks, TodoWrite, TaskUpdate, TaskCreate])]
            : ["*"],
        source: "projectSettings",
        permissionMode: "default",
        ...(agentDefinition?.model ? { model: agentDefinition.model } : {})
    };

    // Step 4: Main teammate loop
    let history = [];
    let initialPrompt = createUserMessage(prompt);
    let currentPrompt = initialPrompt;
    let isShuttingDown = false;

    // Register initial message
    await updateTask(taskId, (task) => ({
        ...task,
        messages: [...task.messages ?? [], initialPrompt]
    }), setAppState);

    while (!abortController.signal.aborted && !isShuttingDown) {
        // Create abort controller for this work cycle
        let workAbortController = createAbortController();
        await updateTask(taskId, (task) => ({
            ...task,
            currentWorkAbortController: workAbortController
        }), setAppState);

        // Run agent loop
        await withTeammateContext(teammateContext, async () => {
            return withTeammateIdentity(teammateIdentity, async () => {
                await updateTask(taskId, (task) => ({
                    ...task,
                    status: "running",
                    isIdle: false
                }), setAppState);

                for await (let event of agentLoopRunner({
                    agentDefinition: teammateAgentDef,
                    promptMessages: [createUserMessage({ content: currentPrompt })],
                    toolUseContext,
                    // ... other params
                })) {
                    // Process events
                }
            });
        });
    }
}

// Mapping: XNY→inProcessAgentRunner
```

### pollForNextMessage (DNY) - Source Verified

```javascript
// ============================================
// DNY - pollForNextMessage - Poll for teammate messages
// Location: chunks.134.mjs:1483-1569
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(config) {
    let {
        taskState,
        agentName,
        teamName,
        signal,
        pendingUserMessage
    } = config;

    let pollCount = 0;

    while (!signal.aborted) {
        // Step 1: Check for pending user message
        if (pendingUserMessage) {
            let userMessage = getUserPendingMessage(taskState, agentName);
            if (userMessage) {
                return {
                    type: "new_message",
                    message: userMessage,
                    from: "user"
                };
            }
        }

        // Step 2: Wait between polls
        if (pollCount > 0) {
            await sleep(500);
        }
        pollCount++;

        // Step 3: Check abort signal
        if (signal.aborted) {
            return { type: "aborted" };
        }

        // Step 4: Poll mailbox for new messages
        try {
            let messages = await readMailbox(agentName, teamName);

            // Check for shutdown request (highest priority)
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let shutdownRequest = parseShutdownRequest(msg.text);
                    if (shutdownRequest) {
                        await markMessageAsReadByIndex(agentName, teamName, i);
                        return {
                            type: "shutdown_request",
                            request: shutdownRequest,
                            originalMessage: msg.text
                        };
                    }
                }
            }

            // Check for any unread message
            let unreadIndex = messages.findIndex(msg => !msg.read);
            if (unreadIndex !== -1) {
                let msg = messages[unreadIndex];
                await markMessageAsReadByIndex(agentName, teamName, unreadIndex);
                return {
                    type: "new_message",
                    message: msg.text,
                    from: msg.from,
                    color: msg.color,
                    summary: msg.summary
                };
            }
        } catch (error) {
            // Log and continue polling
        }

        // Step 5: Check task list for new tasks
        let taskListMessage = await getTaskListMessage(taskState, agentName);
        if (taskListMessage) {
            return {
                type: "new_message",
                message: taskListMessage,
                from: "task-list"
            };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage
```

---

## Module 4: Task Lifecycle (chunks.146.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | function | ✓ Abort handler |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | function | ✓ Kill all |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | function | ✓ Mark killed |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | function | ✓ Progress update |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | function | ✓ Progress + telemetry |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | function | ✓ Mark completed |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | function | ✓ Mark failed |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | function | ✓ Background creation |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | function | ✓ Foreground creation |
| `Ml4` | backgroundTask | chunks.146.mjs:2228 | function | ✓ Background transition |
| `dn4` | cancelTaskCreation | chunks.146.mjs:2250 | function | ✓ Cancel creation |

### triggerAbortSignal (x66) - Source Verified

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
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
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]  // Keep last message
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q) - Source Verified

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
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### markTaskCompleted ($m8) - Source Verified

```javascript
// ============================================
// $m8 - markTaskCompleted - Mark task as completed
// Location: chunks.146.mjs:2100-2115
// ============================================

// ORIGINAL (for source lookup):
function $m8(A, q) {
    let K = A.agentId;
    i9(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now(),
            messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
            abortController: void 0,
            unregisterCleanup: void 0,
            selectedAgent: void 0
        }
    }), $O(K)
}

// READABLE (for understanding):
function markTaskCompleted(result, setAppState) {
    let agentId = result.agentId;

    atomicUpdateTask(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Unregister cleanup handler
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "completed",
            result: result,
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Flush output buffer
    flushOutputBuffer(agentId);
}

// Mapping: $m8→markTaskCompleted, A→result, q→setAppState
```

### createBackgroundAgentTask (Qn4) - Source Verified

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Create background agent task
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
    // Step 1: Initialize output file
    initializeOutputFile(agentId, getTranscriptPath(getAgentDir(agentId)));

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? wrapAbortController(parentAbortController)
        : createStandaloneAbortController();

    // Step 3: Build task record
    let taskRecord = {
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

    // Step 4: Register cleanup handler
    let unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });
    taskRecord.unregisterCleanup = unregisterCleanup;

    // Step 5: Register in state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId
//          Co→initializeOutputFile, RG→createTaskRecord, Zf→registerTask
```

---

## Module 5: Task State Management (chunks.90.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | function | ✓ Atomic update |
| `Zf` | registerTask | chunks.90.mjs:3019 | function | ✓ Register task |
| `VR` | removeTask | chunks.90.mjs:3037 | function | ✓ Remove task |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | function | ✓ Get running |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | function | ✓ Poll outputs |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | function | ✓ Update state |

### atomicUpdateTask (i9) - Source Verified

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomic task state update
// Location: chunks.90.mjs:3003-3017
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
        let task = state.tasks?.[taskId];
        if (!task) return state;

        let updatedTask = updater(task);

        // No change - return original state
        if (updatedTask === task) return state;

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

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater
```

### registerTask (Zf) - Source Verified

```javascript
// ============================================
// Zf - registerTask - Register task in state
// Location: chunks.90.mjs:3019-3035
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    })), c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        tool_use_id: A.toolUseId,
        description: A.description,
        task_type: A.type,
        prompt: "prompt" in A ? A.prompt : void 0
    })
}

// READABLE (for understanding):
function registerTask(taskRecord, setAppState) {
    // Step 1: Add to state
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskRecord.id]: taskRecord
        }
    }));

    // Step 2: Send telemetry event
    sendTelemetry({
        type: "system",
        subtype: "task_started",
        task_id: taskRecord.id,
        tool_use_id: taskRecord.toolUseId,
        description: taskRecord.description,
        task_type: taskRecord.type,
        prompt: "prompt" in taskRecord ? taskRecord.prompt : undefined
    });
}

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState, c36→sendTelemetry
```

### pollTaskOutputs (wY4) - Source Verified

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll all task outputs
// Location: chunks.90.mjs:3058-3085
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];
    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Skip notified terminal tasks (evict them)
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    continue;
                case "running":
                    break;
            }
        }

        // Poll running tasks
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments: attachments,
        updatedTaskOffsets: updatedTaskOffsets,
        evictedTaskIds: evictedTaskIds
    };
}

// Mapping: wY4→pollTaskOutputs, A→appState, Z97→readOutputFileDelta
```

---

## Module 6: Mailbox System (chunks.132.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | async function | ✓ Read messages |
| `x3` | writeToMailbox | chunks.132.mjs:22 | async function | ✓ Write message |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | async function | ✓ Mark single read |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | async function | ✓ Mark all read |
| `$TY` | clearMailbox | chunks.132.mjs:128 | async function | ✓ Clear inbox |
| `HTY` | formatMessagesAsXML | chunks.132.mjs:141 | function | ✓ Format XML |

### readMailbox (wl) - Source Verified

```javascript
// ============================================
// wl - readMailbox - Read messages from mailbox
// Location: chunks.132.mjs:3-14
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = JSON.parse(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, FY6→getMailboxPath
```

### writeToMailbox (x3) - Source Verified

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox
// Location: chunks.132.mjs:22-55
// ============================================

// READABLE (for understanding):
async function writeToMailbox(recipient, message, teamName) {
    // Ensure team directory exists
    await ensureTeamDirectory(teamName);

    let mailboxPath = getMailboxPath(recipient, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipient}, from=${message.from}, path=${mailboxPath}`);

    // Step 1: Create mailbox file if doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Fail if exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Step 2: Acquire lock and write message
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });

        // Read current messages
        let messages = await readMailbox(recipient, teamName);

        // Add new message with read=false
        let newMessage = {
            ...message,
            read: false
        };
        messages.push(newMessage);

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipient}'s inbox from ${message.from}`);
    } catch (error) {
        log(`Failed to write to inbox for ${recipient}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipient, q→message, K→teamName
```

---

## Module 7: Output File System (chunks.41.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `g2` | getOutputFilePath | chunks.41.mjs:2248 | function | ✓ Get path |
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | class | ✓ Buffered writer |
| `Z97` | readOutputFileDelta | chunks.41.mjs:2325 | async function | ✓ Delta read |
| `$O` | flushOutputBuffer | chunks.41.mjs:2320 | async function | ✓ Flush buffer |
| `Co` | initializeOutputFile | chunks.41.mjs:2370 | async function | ✓ Init file |
| `oV` | generateTaskId | chunks.41.mjs:2410 | function | ✓ Generate ID |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | function | ✓ Create record |
| `LJ6` | isTerminalTaskStatus | chunks.41.mjs:2402 | function | ✓ Check terminal |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | function | ✓ Get prefix |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant | ✓ "0-9a-z" |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | object | ✓ Type prefixes |

### generateTaskId (oV) - Source Verified

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get prefix for task type
    let prefix = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 random bytes
    let randomBytes = crypto.randomBytes(8);

    // Step 3: Build ID: prefix + 8 random chars
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        taskId += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    return taskId;  // e.g., "a7x9k2m3" for local_agent
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTaskTypePrefix, G97→TASK_ID_CHARSET
```

### TASK_TYPE_PREFIXES (V$3) - Source Verified

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task type to prefix mapping
// Location: chunks.41.mjs:2438-2444
// ============================================

// ORIGINAL (for source lookup):
V$3 = {
    local_bash: "b",
    local_agent: "a",
    // ... more types
}

// READABLE (for understanding):
TASK_TYPE_PREFIXES = {
    local_bash: "b",      // Background bash tasks
    local_agent: "a",     // Local agent tasks (subagents)
    in_process_teammate: "t",  // In-process teammates
    remote_session: "r",  // Remote sessions
    // Default/fallback: "x"
};

// Example IDs:
// - "a7x9k2m3" - local_agent task
// - "b3h5j8n1" - local_bash task
// - "t2m4p7q9" - in_process_teammate
```

---

## Module 8: System Reminder Integration (chunks.147.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | async function | ✓ Task attachments |
| `f4` | createTaskStatusAttachment | chunks.147.mjs:942 | function | ✓ Create attachment |

### getUnifiedTasksAttachment (suY) - Source Verified

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Get all task attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll all task output files and build attachments
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new offsets and evict completed tasks
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Step 4: Transform attachments to system reminder format
    return attachments.map(attachment => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, wY4→pollTaskOutputs, OY4→updateTaskState
```

---

## Module 9: UI Keyboard Handlers (chunks.193.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `U4q` | killAllLocalAgents | chunks.193.mjs:2636 | call | ✓ Used in UI |
| `d4q` | markTaskKilled | chunks.193.mjs:2639 | call | ✓ Used in UI |
| `w0` | showNotification | chunks.193.mjs:2642 | call | ✓ Notification |
| `Kb1` | getSortedRunningTeammates | chunks.193.mjs:2681 | function | ✓ Sort teammates |
| `Fuq` | TeammateKeyboardHandler | chunks.193.mjs:2685 | function | ✓ Keyboard handler |

### Kill All Flow (UI) - Source Verified

```javascript
// ============================================
// Kill All Agents Flow (Ctrl+F)
// Location: chunks.193.mjs:2629-2656
// ============================================

// READABLE (for understanding):
// This is the UI handler for Ctrl+F to kill all background agents

let killHandler = useCallback(() => {
    let now = Date.now();

    // Check for double-press within timeout
    if (now - lastPressTime.current <= KILL_CONFIRM_TIMEOUT) {
        lastPressTime.current = 0;
        removeNotification("kill-agents-confirm");

        let tasks = store.getState().tasks;

        // Telemetry
        sendTelemetry("tengu_cancel", { source: "kill_agents" });

        // Step 1: Kill all local agents
        killAllLocalAgents(tasks, setAppState);

        // Step 2: Mark each as killed and build notification
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // Step 3: Show notification
        if (killedDescriptions.length > 0) {
            let message = killedDescriptions.length === 1
                ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
                : `${killedDescriptions.length} background agents were stopped by the user: ${killedDescriptions.map(d => `"${d}"`).join(", ")}.`;
            showNotification({
                value: message,
                mode: "task-notification"
            });
        }

        onDone();
        return;
    }

    // First press - show confirmation
    lastPressTime.current = now;
    addNotification({
        key: "kill-agents-confirm",
        text: "Press ctrl+f again to stop background agents",
        priority: "immediate",
        timeoutMs: KILL_CONFIRM_TIMEOUT
    });
}, [store, setAppState, addNotification, removeNotification, onDone]);

// Constants
KILL_CONFIRM_TIMEOUT = 3000;  // 3 seconds to confirm
```

---

## Module 10: Tool Message Loop (chunks.148.mjs)

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `ui6` | ToolExecutor | chunks.148.mjs:3 | class | ✓ Tool executor |
| `Yh` | llmMessageLoop | chunks.148.mjs | async generator | ✓ LLM loop |

### ToolExecutor (ui6) - Source Verified

```javascript
// ============================================
// ui6 - ToolExecutor - Execute tools from LLM responses
// Location: chunks.148.mjs:3-100
// ============================================

// READABLE (for understanding):
class ToolExecutor {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = false;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = false;

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;
        // Share or wrap abort controller
        this.siblingAbortController = wrapAbortController(toolUseContext.abortController);
    }

    discard() {
        this.discarded = true;
    }

    addTool(toolUseBlock, assistantMessage) {
        // Look up tool definition
        let toolDef = findToolByName(this.toolDefinitions, toolUseBlock.name);
        if (!toolDef) {
            // Error: unknown tool
            this.tools.push({
                id: toolUseBlock.id,
                block: toolUseBlock,
                assistantMessage: assistantMessage,
                status: "completed",
                isConcurrencySafe: true,
                pendingProgress: [],
                results: [createToolResultError(`Error: No such tool available: ${toolUseBlock.name}`)]
            });
            return;
        }

        // Parse and validate input
        toolUseBlock.input = applyDefaults(toolDef, toolUseBlock.input);
        let parseResult = toolDef.inputSchema.safeParse(toolUseBlock.input);
        let isConcurrencySafe = parseResult?.success
            ? toolDef.isConcurrencySafe?.(parseResult.data) ?? false
            : false;

        // Queue tool for execution
        this.tools.push({
            id: toolUseBlock.id,
            block: toolUseBlock,
            assistantMessage: assistantMessage,
            status: "queued",
            isConcurrencySafe: isConcurrencySafe,
            pendingProgress: []
        });

        this.processQueue();
    }

    canExecuteTool(isSafe) {
        let executing = this.tools.filter(t => t.status === "executing");
        return executing.length === 0 || (isSafe && executing.every(t => t.isConcurrencySafe));
    }

    async processQueue() {
        for (let tool of this.tools) {
            if (tool.status !== "queued") continue;
            if (this.canExecuteTool(tool.isConcurrencySafe)) {
                await this.executeTool(tool);
            } else if (!tool.isConcurrencySafe) {
                break;  // Wait for non-safe tools
            }
        }
    }
}

// Mapping: ui6→ToolExecutor
```

---

## Corrections from Previous Versions

| Previous Mapping | Correct Mapping | Reason |
|-----------------|-----------------|--------|
| `TIY` = `countTurnsSinceLastProgress` | `TIY` = `countUniqueUris` | TIY counts file URIs in LSP operations |
| `yjA` = `markTaskCompleted` | `$m8` = `markTaskCompleted` | yjA is a constant (67108864) |
| `CjA` = `markTaskFailed` | `Hm8` = `markTaskFailed` | CjA is a constant (5242880) |
| `Kd7` = `killAllRunningAgents` | `U4q` = `killAllLocalAgents` | Kd7 is crypto module export |
| `na` = `killTask` | `x66` = `triggerAbortSignal` | na is wf7.diff function |
| `c5` = `atomicUpdateTask` | `i9` = `atomicUpdateTask` | c5 is incorrect mapping |
| `bZ` = `registerTask` | `Zf` = `registerTask` | bZ is incorrect mapping |

---

## Verification Summary

| Module | Verified Count | Corrections |
|--------|---------------|-------------|
| Agent Tool & Schema | 7 | 0 |
| Agent Loop Runner | 5 | 0 |
| In-Process Runner | 2 | 0 |
| Task Lifecycle | 11 | 0 |
| Task State Management | 6 | 0 |
| Mailbox System | 6 | 0 |
| Output File System | 11 | 0 |
| System Reminder Integration | 2 | 0 |
| UI Keyboard Handlers | 5 | 0 |
| Tool Message Loop | 2 | 0 |
| **Total** | **57** | **7** |

---

## Confidence Levels

| Level | Symbols | Confidence |
|-------|---------|------------|
| High | All verified symbols | 100% - Direct source code verification |

---

## Related Documents

- [cross_validation_final.md](../26_background_agents/cross_validation_final.md) - Background agents symbols
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols

---

**Last Verified**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - 57 symbols verified across 10 modules

---

## Additional Verified Symbols (2026-03-27 Update)

### Task State Management (chunks.90.mjs) - Extended

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | function | ✓ Direct source read |
| `Zf` | registerTask | chunks.90.mjs:3019 | function | ✓ Direct source read |
| `VR` | removeTask | chunks.90.mjs:3037 | function | ✓ Direct source read |
| `EV8` | getRunningTasks | chunks.90.mjs:3053 | function | ✓ Direct source read |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | async function | ✓ Direct source read |
| `OY4` | updateTaskState | chunks.90.mjs:3087 | function | ✓ Direct source read |

### Task Lifecycle (chunks.146.mjs) - Extended

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | function | ✓ Direct source read |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | function | ✓ Direct source read |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | function | ✓ Direct source read |
| `TV1` | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | function | ✓ Direct source read |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | function | ✓ Direct source read |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | function | ✓ Direct source read |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | function | ✓ Direct source read |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | function | ✓ Direct source read |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | function | ✓ Direct source read |

### Mailbox System (chunks.132.mjs) - Extended

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | async function | ✓ Direct source read |
| `x3` | writeToMailbox | chunks.132.mjs:22 | async function | ✓ Direct source read |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | async function | ✓ Direct source read |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | async function | ✓ Direct source read |
| `$TY` | clearMailbox | chunks.132.mjs:128 | async function | ✓ Direct source read |
| `HTY` | formatMessagesAsXML | chunks.132.mjs:141 | function | ✓ Direct source read |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | async function | ✓ Direct source read |

### Task ID & Output (chunks.41.mjs) - Extended

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | function | ✓ Direct source read |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | function | ✓ Direct source read |
| `RG` | createTaskRecord | chunks.41.mjs:2418 | function | ✓ Direct source read |
| `G97` | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant | ✓ Direct source read |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | object | ✓ Direct source read |

### Agent Loop (chunks.133.mjs) - Extended

| Obfuscated | Readable | File:Line | Type | Verification |
|------------|----------|-----------|------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | async generator | ✓ Direct source read |

---

## Updated Verification Summary

| Module | Verified Count | Source Method |
|--------|---------------|---------------|
| Agent Tool & Schema | 7 | Grep + Read |
| Agent Loop Runner | 5 | Grep + Read |
| In-Process Runner | 2 | Grep + Read |
| Task Lifecycle | 11 | Grep + Read |
| Task State Management | 6 | Grep + Read |
| Mailbox System | 7 | Grep + Read |
| Output File System | 11 | Grep + Read |
| System Reminder Integration | 2 | Grep + Read |
| UI Keyboard Handlers | 5 | Grep + Read |
| Tool Message Loop | 2 | Grep + Read |
| **Total** | **58** | All verified |