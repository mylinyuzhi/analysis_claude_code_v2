# Teammate Execution Complete Source (Claude Code 2.1.76)

> Complete source-level documentation of the teammate execution system including in-process agent runner, priority message polling, and mailbox communication with verified symbol mappings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `DNY` - pollForNextMessage — `chunks.134.mjs:1483`
- `XNY` - inProcessAgentRunner — `chunks.134.mjs:1571`
- `wl` - readMailbox — `chunks.132.mjs:3`
- `x3` - writeToMailbox — `chunks.132.mjs:22`
- `Vc6` - markMessageAsReadByIndex — `chunks.132.mjs:57`
- `Ji4` - claimUnclaimedTask — `chunks.134.mjs:1464`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEAMMATE EXECUTION ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │   AgentTool     │
                          │   (QW6)         │
                          │   with name     │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ spawnTeammate   │
                          │ (qn4)           │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ In-Process  │          │ Split-Pane  │          │ Tmux        │
   │ (XNY)       │          │ (BNY)       │          │ (gNY)       │
   └──────┬──────┘          └─────────────┘          └─────────────┘
          │
          ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                      pollForNextMessage (DNY)                        │
   │                                                                      │
   │  Priority Queue:                                                     │
   │  1. pendingUserMessages (immediate)                                 │
   │  2. shutdown_request (mailbox, prioritized)                         │
   │  3. new_message (mailbox, FIFO)                                     │
   │  4. claimUnclaimedTask (task list)                                  │
   └─────────────────────────────────────────────────────────────────────┘
```

---

## In-Process Agent Runner (XNY)

### Complete Source Code

```javascript
// ============================================
// XNY - inProcessAgentRunner - Runner for in-process teammates
// Location: chunks.134.mjs:1571-1849
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
    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;
    if (J === "replace" && j) W = j;
    else {
        let L = [...await R0(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`
# Custom Agent Instructions
${h}`);
            if (_.memory) d("tengu_agent_memory_loaded", {
                ...{},
                scope: _.memory,
                source: "in-process-teammate"
            })
        }
        if (J === "append" && j) L.push(j);
        W = L.join(`
`)
    }
    let Z = {
            agentType: q.agentName,
            whenToUse: `In-process teammate: ${q.agentName}`,
            getSystemPrompt: () => W,
            tools: _?.tools ? [...new Set([..._.tools, hI, SI, l36, TR, lt, it, ck])] : ["*"],
            source: "projectSettings",
            permissionMode: "default",
            ..._?.model ? {
                model: _.model
            } : {}
        },
        G = [],
        f = Ku8("team-lead", Y, void 0, z),
        v = f,
        N = !1;
    await Ji4(q.parentSessionId, q.agentName);
    // ... main execution loop
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,           // Agent identity (agentId, agentName, teamName, etc.)
        taskId,             // Task ID for this teammate
        prompt,             // Initial prompt
        description,        // Task description
        agentDefinition,    // Custom agent definition (if any)
        teammateContext,    // Team context
        toolUseContext,     // Context for tool usage
        abortController,    // Abort controller for cancellation
        model,              // Model override
        systemPrompt,       // Custom system prompt
        systemPromptMode,   // "replace" or "append"
        allowedTools,       // Tools allowed for this teammate
        allowPermissionPrompts  // Whether to show permission prompts
    } = config;

    let { setAppState } = toolUseContext;

    log(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Step 1: Build teammate context object
    let teammateInfo = {
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
        let promptParts = [
            ...await buildDefaultSystemPrompt(
                toolUseContext.options.tools,
                toolUseContext.options.mainLoopModel,
                undefined,
                toolUseContext.options.mcpClients
            ),
            teamContextPrompt  // tx8 - adds team awareness
        ];

        if (agentDefinition) {
            let customPrompt = agentDefinition.getSystemPrompt();
            if (customPrompt) {
                promptParts.push(`\n# Custom Agent Instructions\n${customPrompt}`);
            }
            if (agentDefinition.memory) {
                telemetry("tengu_agent_memory_loaded", {
                    scope: agentDefinition.memory,
                    source: "in-process-teammate"
                });
            }
        }

        if (systemPromptMode === "append" && systemPrompt) {
            promptParts.push(systemPrompt);
        }

        finalSystemPrompt = promptParts.join("\n");
    }

    // Step 3: Build agent definition for this teammate
    let teammateAgentDef = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => finalSystemPrompt,
        tools: agentDefinition?.tools
            ? [...new Set([
                ...agentDefinition.tools,
                "SendMessage",      // hI - Team communication
                "TaskList",         // SI - View task list
                "TaskUpdate",       // l36 - Update task status
                "TaskCreate",       // TR - Create new tasks
                "CronCreate",       // lt - Create cron jobs
                "CronDelete",       // it - Delete cron jobs
                "CronList"          // ck - List cron jobs
              ])]
            : ["*"],  // Wildcard = all tools
        source: "projectSettings",
        permissionMode: "default",
        ...(agentDefinition?.model && { model: agentDefinition.model })
    };

    // Step 4: Initialize message history
    let messageHistory = [];
    let initialMessage = createUserMessage({ content: prompt });
    let currentPrompt = initialMessage;
    let hasCompleted = false;

    // Step 5: Try to claim any unclaimed tasks
    await claimUnclaimedTask(identity.parentSessionId, identity.agentName);

    // Step 6: Main execution loop
    try {
        // Record initial message in task
        updateTaskMessages(taskId, (task) => ({
            ...task,
            messages: [...(task.messages ?? []), initialMessage]
        }), setAppState);

        while (!abortController.signal.aborted && !hasCompleted) {
            log(`[inProcessRunner] ${identity.agentId} processing prompt: ${currentPrompt.substring(0,50)}...`);

            // Create new abort controller for this iteration
            let iterationAbortController = new AbortController();
            updateTask(taskId, (task) => ({
                ...task,
                currentWorkAbortController: iterationAbortController
            }), setAppState);

            let userMessage = createUserMessage({ content: currentPrompt });
            let messagesToProcess = [userMessage];
            let historyMessages = messageHistory;
            let historyTokens = countTokens(messageHistory);

            // Step 7: Check if compaction needed
            if (historyTokens > getMaxContextTokens(toolUseContext.options.mainLoopModel)) {
                log(`[inProcessRunner] ${identity.agentId} compacting history (${historyTokens} tokens)`);

                let compactContext = {
                    ...toolUseContext,
                    readFileState: cloneReadFileState(toolUseContext.readFileState),
                    onCompactProgress: undefined,
                    setStreamMode: undefined
                };

                let compactedMessages = await compactMessages(
                    messageHistory,
                    compactContext,
                    {
                        systemPrompt: formatSystemPrompt([]),
                        userContext: {},
                        systemContext: {},
                        toolUseContext: compactContext,
                        forkContextMessages: []
                    },
                    true,
                    undefined,
                    true
                );

                historyMessages = compactedMessages;
                clearReadFileTracking();
                messageHistory.length = 0;
                messageHistory.push(...historyMessages);

                updateTask(taskId, (task) => ({
                    ...task,
                    messages: [...historyMessages, userMessage]
                }), setAppState);
            }

            // Step 8: Run agent loop for this iteration
            let iterationMessages = [...historyMessages, ...messagesToProcess];
            let iterationResult = null;

            for await (let event of agentLoopRunner({
                agentDefinition: teammateAgentDef,
                promptMessages: messagesToProcess,
                toolUseContext: deriveToolUseContext(toolUseContext, {
                    options: {
                        isNonInteractiveSession: true,
                        tools: toolUseContext.options.tools,
                        mainLoopModel: model ?? toolUseContext.options.mainLoopModel
                    },
                    agentId: identity.agentId,
                    agentType: identity.agentName,
                    messages: iterationMessages,
                    readFileState: toolUseContext.readFileState,
                    abortController: iterationAbortController,
                    getAppState: () => toolUseContext.getAppState()
                }),
                isAsync: false,
                querySource: `agent:teammate:${identity.agentName}`,
                model: model
            })) {
                if (event.type === "assistant" || event.type === "user") {
                    messageHistory.push(event);
                }
            }

            // Step 9: Poll for next message
            let pollResult = await pollForNextMessage(
                teammateInfo,
                abortController,
                taskId,
                toolUseContext.getAppState,
                setAppState,
                identity.parentSessionId
            );

            if (pollResult.type === "aborted") {
                hasCompleted = true;
            } else if (pollResult.type === "new_message") {
                currentPrompt = pollResult.message;
            } else if (pollResult.type === "shutdown_request") {
                // Handle graceful shutdown
                hasCompleted = true;
            }
        }
    } finally {
        // Cleanup
        cleanupTask(taskId, setAppState);
    }
}

// Mapping: XNY→inProcessAgentRunner, q→identity, K→taskId, Y→prompt, z→description,
//          _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController,
//          H→model, j→systemPrompt, J→systemPromptMode, M→allowedTools, D→allowPermissionPrompts
//          Ji4→claimUnclaimedTask, DNY→pollForNextMessage, qh→agentLoopRunner
```

### Key Algorithm: Message Flow

**What it does:** Processes messages in a continuous loop until shutdown or abort.

**How it works:**
1. Initialize teammate context and system prompt
2. Run agent loop iteration
3. Poll for next message (priority queue)
4. Handle compaction when context fills
5. Repeat until shutdown

**Why this approach:**
- **In-process efficiency** - No separate process overhead
- **State sharing** - Can share app state with parent
- **Seamless compaction** - Uses same compaction as main agent
- **Priority messaging** - Urgent messages processed first

---

## Priority Poll Loop (DNY)

### Complete Source Code

```javascript
// ============================================
// DNY - pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1568
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
async function pollForNextMessage(
    teammateInfo,      // Agent name, team name
    abortController,   // For cancellation
    taskId,            // Task ID
    getAppState,       // State getter
    setAppState,       // State setter
    parentSessionId    // Parent session ID
) {
    log(`[inProcessRunner] ${teammateInfo.agentName} starting poll loop (abort=${abortController.signal.aborted})`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Priority 1: Check for pending user messages (immediate, no delay)
        let task = getAppState().tasks[taskId];

        if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove from pending queue
            setAppState((state) => {
                let currentTask = state.tasks[taskId];
                if (!currentTask || currentTask.type !== "in_process_teammate") return state;

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

            log(`[inProcessRunner] ${teammateInfo.agentName} found pending user message (poll #${pollCount})`);

            return {
                type: "new_message",
                message: message,
                from: "user"
            };
        }

        // Add delay after first poll (500ms)
        if (pollCount > 0) {
            await sleep(500);
        }

        pollCount++;

        // Check abort after delay
        if (abortController.signal.aborted) {
            log(`[inProcessRunner] ${teammateInfo.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${teammateInfo.agentName} poll #${pollCount}: checking mailbox`);

        try {
            // Priority 2: Check mailbox for messages
            let mailboxMessages = await readMailbox(teammateInfo.agentName, teammateInfo.teamName);

            // Priority 2a: Check for shutdown request (highest priority in mailbox)
            let shutdownIndex = -1;
            let shutdownRequest = null;

            for (let i = 0; i < mailboxMessages.length; i++) {
                let msg = mailboxMessages[i];
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
                let originalMessage = mailboxMessages[shutdownIndex];
                let skippedUnread = mailboxMessages.slice(0, shutdownIndex)
                    .filter((m) => !m.read).length;

                log(`[inProcessRunner] ${teammateInfo.agentName} received shutdown request from ${shutdownRequest?.from} (prioritized over ${skippedUnread} unread messages)`);

                // Mark as read
                await markMessageAsReadByIndex(teammateInfo.agentName, teammateInfo.teamName, shutdownIndex);

                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: originalMessage.text
                };
            }

            // Priority 2b: Check for team lead message (second highest)
            let teamLeadIndex = -1;
            for (let i = 0; i < mailboxMessages.length; i++) {
                let msg = mailboxMessages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_SENDER) {
                    teamLeadIndex = i;
                    break;
                }
            }

            // Priority 2c: Fall back to first unread message
            if (teamLeadIndex === -1) {
                teamLeadIndex = mailboxMessages.findIndex((m) => !m.read);
            }

            if (teamLeadIndex !== -1) {
                let msg = mailboxMessages[teamLeadIndex];
                if (msg) {
                    log(`[inProcessRunner] ${teammateInfo.agentName} received new message from ${msg.from} (index ${teamLeadIndex})`);

                    // Mark as read
                    await markMessageAsReadByIndex(teammateInfo.agentName, teammateInfo.teamName, teamLeadIndex);

                    return {
                        type: "new_message",
                        message: msg.text,
                        from: msg.from,
                        color: msg.color,
                        summary: msg.summary
                    };
                }
            }
        } catch (error) {
            log(`[inProcessRunner] ${teammateInfo.agentName} poll error: ${error}`);
        }

        // Priority 3: Check for unclaimed tasks
        let claimedTask = await claimUnclaimedTask(parentSessionId, teammateInfo.agentName);
        if (claimedTask) {
            return {
                type: "new_message",
                message: claimedTask,
                from: "task-list"
            };
        }
    }

    log(`[inProcessRunner] ${teammateInfo.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`);
    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→teammateInfo, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→parentSessionId
//          wl→readMailbox, Vc6→markMessageAsReadByIndex, Ji4→claimUnclaimedTask
//          M66→parseShutdownRequest, jNY→sleep, BY→TEAM_LEAD_SENDER
```

### Priority Queue Algorithm

**What it does:** Polls for messages in priority order to ensure important messages are processed first.

**How it works:**

```
Priority Order:
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. pendingUserMessages (state)                                               │
│    - Direct user input injected via setAppState                             │
│    - No mailbox delay, immediate processing                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. shutdown_request (mailbox)                                                │
│    - Parsed from mailbox messages                                           │
│    - Highest priority in mailbox                                            │
│    - Triggers graceful shutdown                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. team_lead_message (mailbox)                                               │
│    - Messages from team lead (BY constant)                                  │
│    - Takes precedence over regular teammate messages                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. first_unread_message (mailbox, FIFO)                                      │
│    - Any unread message from any sender                                     │
│    - Processed in order received                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. unclaimed_task (task list)                                                │
│    - Tasks without owner in team task list                                  │
│    - Claimed and processed as work item                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this approach:**

1. **User responsiveness** - Direct user messages processed immediately
2. **Graceful shutdown** - Shutdown requests can interrupt normal processing
3. **Team hierarchy** - Team lead messages prioritized over peer messages
4. **Work distribution** - Unclaimed tasks allow dynamic work assignment

**Key insight:** The 500ms polling delay only applies after the first poll, ensuring immediate responsiveness for initial messages while preventing CPU spin during idle periods.

---

## Mailbox System Functions

### readMailbox (wl)

```javascript
// ============================================
// wl - readMailbox - Read all messages from mailbox
// Location: chunks.132.mjs:3-15
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(q, A);
    try {
        let Y = await dt6(K);
        return Y ? JSON.parse(Y.content.toString()) : []
    } catch (Y) {
        return []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let mailboxPath = getMailboxPath(teamName, agentName);

    try {
        let result = await readFileFromOffset(mailboxPath);
        return result ? JSON.parse(result.content.toString()) : [];
    } catch (error) {
        return [];  // Return empty array on error
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath,
//          FY6→getMailboxPath, dt6→readFileFromOffset
```

### writeToMailbox (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    let Y = FY6(q.teamName, q.agentName),
        z = {
            from: A,
            text: K.text,
            color: K.color,
            summary: K.summary,
            read: !1,
            timestamp: Date.now()
        };
    await U$(Y, JSON.stringify(z) + "\n", {
        flag: "a"
    })
}

// READABLE (for understanding):
async function writeToMailbox(fromAgent, recipientInfo, message) {
    let mailboxPath = getMailboxPath(recipientInfo.teamName, recipientInfo.agentName);

    let mailboxEntry = {
        from: fromAgent,
        text: message.text,
        color: message.color,
        summary: message.summary,
        read: false,
        timestamp: Date.now()
    };

    // Append to mailbox file
    await appendFile(mailboxPath, JSON.stringify(mailboxEntry) + "\n", {
        flag: "a"  // Append mode
    });
}

// Mapping: x3→writeToMailbox, A→fromAgent, q→recipientInfo, K→message,
//          FY6→getMailboxPath, U$→appendFile
```

### markMessageAsReadByIndex (Vc6)

```javascript
// ============================================
// Vc6 - markMessageAsReadByIndex - Mark single message as read
// Location: chunks.132.mjs:57-90
// ============================================

// ORIGINAL (for source lookup):
async function Vc6(A, q, K) {
    let Y = FY6(q, A);
    try {
        let z = await dt6(Y);
        if (!z) return;
        let _ = z.content.toString().split("\n").filter((w) => w.trim());
        if (K < 0 || K >= _.length) return;
        let w = JSON.parse(_[K]);
        w.read = !0, _[K] = JSON.stringify(w), await uW(Y, _.join("\n") + "\n")
    } catch (z) {}
}

// READABLE (for understanding):
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
    let mailboxPath = getMailboxPath(teamName, agentName);

    try {
        let result = await readFileFromOffset(mailboxPath);
        if (!result) return;

        // Parse lines
        let lines = result.content.toString().split("\n").filter((line) => line.trim());

        // Validate index
        if (messageIndex < 0 || messageIndex >= lines.length) return;

        // Mark message as read
        let message = JSON.parse(lines[messageIndex]);
        message.read = true;
        lines[messageIndex] = JSON.stringify(message);

        // Write back
        await writeFile(mailboxPath, lines.join("\n") + "\n");
    } catch (error) {
        // Silent failure
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex,
//          FY6→getMailboxPath, dt6→readFileFromOffset, uW→writeFile
```

### claimUnclaimedTask (Ji4)

```javascript
// ============================================
// Ji4 - claimUnclaimedTask - Claim unclaimed task for teammate
// Location: chunks.134.mjs:1464-1481
// ============================================

// ORIGINAL (for source lookup):
async function Ji4(A, q) {
    try {
        let K = await BY6(),
            Y = K.find((z) => !z.assignee);
        if (Y) return await x3(q, {
            agentName: q,
            teamName: A
        }, {
            text: Y.description,
            summary: Y.subject
        }), await XY6(Y.id, q), Y.description
    } catch (K) {}
}

// READABLE (for understanding):
async function claimUnclaimedTask(teamName, agentName) {
    try {
        // Get all tasks in team
        let tasks = await getTeamTasks(teamName);

        // Find first unassigned task
        let unclaimedTask = tasks.find((task) => !task.assignee);

        if (unclaimedTask) {
            // Send message to self about the task
            await writeToMailbox(agentName, {
                agentName: agentName,
                teamName: teamName
            }, {
                text: unclaimedTask.description,
                summary: unclaimedTask.subject
            });

            // Mark task as assigned to this agent
            await assignTask(unclaimedTask.id, agentName);

            return unclaimedTask.description;
        }
    } catch (error) {
        // Silent failure
    }
}

// Mapping: Ji4→claimUnclaimedTask, A→teamName, q→agentName,
//          BY6→getTeamTasks, x3→writeToMailbox, XY6→assignTask
```

---

## System Reminder Integration

### Task Attachments

Teammates generate system reminder attachments for status updates:

```javascript
// getUnifiedTasksAttachment (suY) processes teammate tasks
// Location: chunks.147.mjs:1033

async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Update state
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Map to attachment format
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,  // "in_process_teammate"
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}
```

---

## Cross-Feature Integration

### With 04_system_reminder
- `getUnifiedTasksAttachment` (suY) - Task status attachments
- `task_status` attachment type - Status notifications
- `task_progress` attachment type - Progress updates

### With 05_tools
- Tool filtering for teammate tools
- `SendMessage` tool for mailbox communication
- `TaskList`, `TaskUpdate`, `TaskCreate` tools for task management

### With 30_agent_teams
- Team identity (teamName, agentName)
- Mailbox-based communication
- Task claiming and assignment

---

## Verification Status

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop source
- [mailbox_communication_complete.md](./mailbox_communication_complete.md) - Mailbox system
- [../30_agent_teams/](../30_agent_teams/) - Agent teams module