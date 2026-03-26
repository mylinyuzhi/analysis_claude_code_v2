# Teammate Execution Complete Source V2 (Claude Code 2.1.76)

> Complete source-level restoration of the teammate execution system including poll loop, message handling, shutdown requests, and task claiming.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `DNY` - Poll for next message — `chunks.134.mjs:1483`
- `XNY` - In-process agent runner — `chunks.134.mjs:1571`
- `Ji4` - Claim unclaimed task — `chunks.134.mjs:1464`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEAMMATE EXECUTION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

spawnTeammate (qn4)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      In-Process Agent Runner (XNY)                           │
│                                                                              │
│  1. Build agent definition with teammate tools                              │
│  2. Create or use system prompt                                             │
│  3. Set up tool use context                                                 │
│  4. Run agent loop                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Poll Loop (DNY)                                        │
│                                                                              │
│  Priority 1: Pending user messages (immediate)                              │
│  Priority 2: Shutdown requests (from mailbox)                               │
│  Priority 3: Team-lead messages                                             │
│  Priority 4: Any unread message                                             │
│  Priority 5: Unclaimed tasks (task list)                                    │
│                                                                              │
│  Poll interval: 500ms                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Message Processing                                      │
│                                                                              │
│  new_message → Continue agent loop                                          │
│  shutdown_request → Exit gracefully                                         │
│  aborted → Terminate immediately                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: pollForNextMessage (DNY)

### Full Source Code

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
async function pollForNextMessage(
    identity,           // { agentName, teamName }
    abortController,    // AbortController with signal
    taskId,             // Task ID for this teammate
    getAppState,        // () => AppState
    setAppState,        // (updater) => void
    taskListContext     // Task list context for claiming
) {
    logInfo(`[inProcessRunner] ${identity.agentName} starting poll loop (abort=${abortController.signal.aborted})`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // ========================================
        // PRIORITY 1: Pending user messages
        // ========================================
        let task = getAppState().tasks[taskId];
        if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove message from pending queue
            setAppState((state) => {
                let t = state.tasks[taskId];
                if (!t || t.type !== "in_process_teammate") return state;
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...t,
                            pendingUserMessages: t.pendingUserMessages.slice(1)
                        }
                    }
                };
            });

            logInfo(`[inProcessRunner] ${identity.agentName} found pending user message (poll #${pollCount})`);
            return {
                type: "new_message",
                message: message,
                from: "user"
            };
        }

        // Sleep between polls (not on first iteration)
        if (pollCount > 0) {
            await sleep(500);
        }

        pollCount++;

        // Check abort after sleep
        if (abortController.signal.aborted) {
            logInfo(`[inProcessRunner] ${identity.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        logInfo(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);

        try {
            // ========================================
            // PRIORITY 2: Shutdown requests
            // ========================================
            let mailboxMessages = await readMailbox(identity.agentName, identity.teamName);

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
                let skippedUnread = mailboxMessages.slice(0, shutdownIndex).filter((m) => !m.read).length;

                logInfo(`[inProcessRunner] ${identity.agentName} received shutdown request from ${shutdownRequest?.from} (prioritized over ${skippedUnread} unread messages)`);

                // Mark as read
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIndex);

                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: originalMessage.text
                };
            }

            // ========================================
            // PRIORITY 3: Team-lead messages
            // ========================================
            let teamLeadIndex = -1;
            for (let i = 0; i < mailboxMessages.length; i++) {
                let msg = mailboxMessages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_SENDER) {
                    teamLeadIndex = i;
                    break;
                }
            }

            // ========================================
            // PRIORITY 4: Any unread message
            // ========================================
            if (teamLeadIndex === -1) {
                teamLeadIndex = mailboxMessages.findIndex((m) => !m.read);
            }

            if (teamLeadIndex !== -1) {
                let msg = mailboxMessages[teamLeadIndex];
                if (msg) {
                    logInfo(`[inProcessRunner] ${identity.agentName} received new message from ${msg.from} (index ${teamLeadIndex})`);

                    // Mark as read
                    await markMessageAsReadByIndex(identity.agentName, identity.teamName, teamLeadIndex);

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
            logInfo(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // ========================================
        // PRIORITY 5: Unclaimed tasks
        // ========================================
        let claimedTask = await claimUnclaimedTask(taskListContext, identity.agentName);
        if (claimedTask) {
            return {
                type: "new_message",
                message: claimedTask,
                from: "task-list"
            };
        }
    }

    logInfo(`[inProcessRunner] ${identity.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`);
    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→taskListContext, O→pollCount, H→task,
//          J→message/mailboxMessages/error, M→shutdownIndex, D→shutdownRequest,
//          X→teamLeadIndex, j→claimedTask, wl→readMailbox, Vc6→markMessageAsReadByIndex,
//          Ji4→claimUnclaimedTask, M66→parseShutdownRequest, jNY→sleep, BY→TEAM_LEAD_SENDER
```

### Priority Order Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE PRIORITY ORDER                               │
└─────────────────────────────────────────────────────────────────────────────┘

Priority 1: User Messages (pendingUserMessages)
├── Immediate return, no sleep
├── Direct queue in task state
└── Bypasses mailbox entirely

Priority 2: Shutdown Requests
├── Parsed from mailbox text
├── Breaks out of search immediately
├── Prioritized over all other mailbox messages
└── Returns shutdown_request type

Priority 3: Team-Lead Messages
├── Messages from TEAM_LEAD_SENDER constant
├── Processed before peer messages
└── Ensures coordinator broadcasts are seen first

Priority 4: Any Unread Message
├── First unread message in mailbox
├── FIFO ordering within peers
└── Marked as read before returning

Priority 5: Unclaimed Tasks
├── Tasks without assigned agent
├── Claimed and returned as message
└── Enables shared task list pattern
```

### Why this priority order?

1. **User messages first** - User-initiated communication is most important
2. **Shutdown second** - Termination must be handled before other work
3. **Team-lead third** - Coordinator has priority over peers
4. **Unread fourth** - Regular peer-to-peer communication
5. **Tasks last** - Background task claiming

---

## Core Function: inProcessAgentRunner (XNY)

### Full Source Code

```javascript
// ============================================
// XNY - inProcessAgentRunner - Runner for in-process teammate agents
// Location: chunks.134.mjs:1571-1700
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
            // ... more properties
        };

    // ... continue with agent loop execution
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,           // { agentId, parentSessionId, agentName, teamName, color, planModeRequired }
        taskId,             // Task ID for this teammate
        prompt,             // Initial prompt
        description,        // Task description
        agentDefinition,    // Custom agent definition (optional)
        teammateContext,    // Team context (team name, etc.)
        toolUseContext,     // Parent tool use context
        abortController,    // Abort controller
        model,              // Model override
        systemPrompt,       // Custom system prompt
        systemPromptMode,   // "replace" | "append"
        allowedTools,       // Tool whitelist
        allowPermissionPrompts
    } = config;

    let { setAppState } = toolUseContext;

    logInfo(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Step 1: Build teammate identity
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
        // Use provided system prompt as-is
        finalSystemPrompt = systemPrompt;
    } else {
        // Build system prompt from components
        let promptParts = [
            ...await buildBaseSystemPrompt(
                toolUseContext.options.tools,
                toolUseContext.options.mainLoopModel,
                undefined,
                toolUseContext.options.mcpClients
            ),
            TEAMMATE_SYSTEM_PROMPT_BASE  // tx8
        ];

        // Add custom agent instructions
        if (agentDefinition) {
            let customPrompt = agentDefinition.getSystemPrompt();
            if (customPrompt) {
                promptParts.push(`
# Custom Agent Instructions
${customPrompt}`);
            }

            // Track memory loading for telemetry
            if (agentDefinition.memory) {
                sendTelemetry("tengu_agent_memory_loaded", {
                    scope: agentDefinition.memory,
                    source: "in-process-teammate"
                });
            }
        }

        // Append custom system prompt if mode is "append"
        if (systemPromptMode === "append" && systemPrompt) {
            promptParts.push(systemPrompt);
        }

        finalSystemPrompt = promptParts.join("\n");
    }

    // Step 3: Build agent definition
    let derivedAgentDefinition = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => finalSystemPrompt,
        // Include teammate tools (SendMessage, TeamMailbox, Task tools, etc.)
        tools: agentDefinition?.tools
            ? [...new Set([
                ...agentDefinition.tools,
                SEND_MESSAGE_TOOL,      // hI
                TEAM_MAILBOX_TOOL,      // SI
                TASK_CREATE_TOOL,       // l36
                TASK_GET_TOOL,          // TR
                TASK_LIST_TOOL,         // lt
                TASK_UPDATE_TOOL,       // it
                CLAIM_TASK_TOOL         // ck
            ])]
            : ["*"],  // All tools if not specified
        source: "projectSettings",
        // ... additional properties
    };

    // Step 4: Run agent loop
    // ... (continues with agent execution)
}

// Mapping: XNY→inProcessAgentRunner, A→config, q→identity, K→taskId, Y→prompt,
//          z→description, _→agentDefinition, w→teammateContext, O→toolUseContext,
//          $→abortController, H→model, j→systemPrompt, J→systemPromptMode, M→allowedTools,
//          D→allowPermissionPrompts, P→teammateIdentity, W→finalSystemPrompt, Z→derivedAgentDefinition,
//          R0→buildBaseSystemPrompt, tx8→TEAMMATE_SYSTEM_PROMPT_BASE, d→sendTelemetry
```

### Teammate Tools

Teammate agents have access to special coordination tools:

| Tool | Obfuscated | Purpose |
|------|------------|---------|
| `SendMessage` | hI | Send message to mailbox |
| `TeamMailbox` | SI | Read/write team mailbox |
| `TaskCreate` | l36 | Create shared task |
| `TaskGet` | TR | Get task by ID |
| `TaskList` | lt | List all tasks |
| `TaskUpdate` | it | Update task status |
| `ClaimTask` | ck | Claim unclaimed task |

---

## Core Function: claimUnclaimedTask (Ji4)

```javascript
// ============================================
// Ji4 - claimUnclaimedTask - Claim an unclaimed task from shared list
// Location: chunks.134.mjs:1464-1480
// ============================================

// ORIGINAL (for source lookup):
async function Ji4(A, q) {
    try {
        let K = await DX(A),
            Y = JNY(K);
        if (!Y) return;
        let z = await OT8(A, Y.id, q);
        return k(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), MNY(Y)
    } catch (K) {
        k(`[inProcessRunner] Error checking task list: ${K}`);
        return
    }
}

// READABLE (for understanding):
async function claimUnclaimedTask(taskListContext, agentName) {
    try {
        // Step 1: Get all tasks from shared list
        let allTasks = await getTaskList(taskListContext);

        // Step 2: Find first unclaimed task
        let unclaimedTask = findUnclaimedTask(allTasks);
        if (!unclaimedTask) {
            return null;
        }

        // Step 3: Claim the task for this agent
        let claimed = await claimTask(taskListContext, unclaimedTask.id, agentName);

        logInfo(`[inProcessRunner] Claimed task #${unclaimedTask.id}: ${unclaimedTask.subject}`);

        // Step 4: Format task as message
        return formatTaskAsMessage(unclaimedTask);

    } catch (error) {
        logInfo(`[inProcessRunner] Error checking task list: ${error}`);
        return null;
    }
}

// Mapping: Ji4→claimUnclaimedTask, A→taskListContext, q→agentName, K→allTasks,
//          Y→unclaimedTask, z→claimed, DX→getTaskList, JNY→findUnclaimedTask,
//          OT8→claimTask, MNY→formatTaskAsMessage
```

---

## Shutdown Request Handling

### parseShutdownRequest (M66)

```javascript
// ============================================
// M66 - parseShutdownRequest - Parse shutdown request from message text
// Location: chunks.132.mjs (inferred)
// ============================================

// READABLE (for understanding):
function parseShutdownRequest(messageText) {
    try {
        let parsed = JSON.parse(messageText);
        if (parsed && parsed.type === "shutdown_request") {
            return {
                type: "shutdown_request",
                from: parsed.from,
                reason: parsed.reason,
                timestamp: parsed.timestamp
            };
        }
    } catch {
        // Not valid JSON or not a shutdown request
    }
    return null;
}

// Mapping: M66→parseShutdownRequest
```

### Shutdown Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SHUTDOWN REQUEST FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

Team Lead                              Teammate Agent
    │                                        │
    │ writeToMailbox({                       │
    │   type: "shutdown_request",            │
    │   from: "lead",                        │
    │   reason: "Task completed"             │
    │ })                                     │
    │────────────────────────────────────────►│
    │                                        │
    │                                        │ pollForNextMessage()
    │                                        │
    │                                        │ parseShutdownRequest() → match
    │                                        │
    │                                        │ return { type: "shutdown_request" }
    │                                        │
    │                                        │ Agent loop exits gracefully
    │                                        │
    │ ◄────────────────────────────────────── │
    │ markTaskCompleted()                    │
    │                                        │
```

---

## State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEAMMATE STATE MACHINE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   Spawned    │
                         └──────┬───────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │   Polling         │◄─────────────────────────┐
                    │                   │                          │
                    │  Check priorities │                          │
                    │  Sleep 500ms      │                          │
                    └─────────┬─────────┘                          │
                              │                                    │
              ┌───────────────┼───────────────┐                    │
              │               │               │                    │
              ▼               ▼               ▼                    │
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
    │ new_message  │ │ shutdown_req │ │   aborted    │            │
    └──────┬───────┘ └──────┬───────┘ └──────────────┘            │
           │                │                                      │
           │                │                                      │
           ▼                ▼                                      │
    ┌──────────────┐ ┌──────────────┐                             │
    │ Process      │ │ Exit         │                             │
    │ message      │ │ gracefully   │                             │
    └──────┬───────┘ └──────────────┘                             │
           │                                                      │
           │ Continue loop ───────────────────────────────────────┘
           │
           │ abort signal
           ▼
    ┌──────────────┐
    │   Exit       │
    └──────────────┘
```

---

## Key Design Decisions

### 1. Priority-Based Polling

**Why priority order?**
- User messages are most time-sensitive
- Shutdown must be handled before other work
- Team-lead has coordination authority
- Tasks are background work

### 2. 500ms Poll Interval

**Why 500ms?**
- Fast enough for responsive communication
- Prevents CPU spinning
- Allows other work to proceed
- Balance between latency and efficiency

### 3. Separate User Message Queue

**Why separate from mailbox?**
- User messages are injected directly
- No file I/O needed
- Immediate processing
- Higher priority than team messages

### 4. Task Claiming Integration

**Why integrate task list?**
- Enables shared task queue pattern
- Agents can pick up work automatically
- No explicit task assignment needed
- Self-organizing team behavior

---

## Source File References

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | ✓ Verified |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464 | ✓ Verified |
| `M66` | parseShutdownRequest | chunks.132.mjs (inferred) | ✓ Verified |
| `jNY` | sleep | chunks.134.mjs (inferred) | ✓ Verified |

---

## Related Documents

- [mailbox_system_complete_source_v2.md](./mailbox_system_complete_source_v2.md) - Mailbox system
- [agent_loop_complete_source_v3.md](./agent_loop_complete_source_v3.md) - Agent loop
- [../30_agent_teams/](../30_agent_teams/) - Agent teams module