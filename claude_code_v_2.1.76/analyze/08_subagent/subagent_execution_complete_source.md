# Subagent Execution Complete Source (Claude Code 2.1.76)

> Complete source-level documentation of the subagent execution system including agent loop runner, task creation, and execution flow with verified symbol mappings.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `qh` - agentLoopRunner — `chunks.133.mjs:1565`
- `QW6` - AgentTool — `chunks.136.mjs:1512`
- `XNY` - inProcessAgentRunner — `chunks.134.mjs:1571`
- `DNY` - pollForNextMessage — `chunks.134.mjs:1483`
- `qn4` - spawnTeammate — `chunks.135.mjs:1116`
- `pNY` - spawnTeammateDispatcher — `chunks.135.mjs:1110`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBAGENT EXECUTION ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │   AgentTool     │
                          │   (QW6)         │
                          │   chunks.136    │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ Synchronous │          │ Background  │          │ Teammate    │
   │ (blocking)  │          │ (async)     │          │ (collab)    │
   └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          │                        ▼                        ▼
          │                 ┌─────────────┐          ┌─────────────┐
          │                 │ createBack  │          │ spawnTeam   │
          │                 │ AgentTask   │          │ mate        │
          │                 │ (Qn4)       │          │ (qn4)       │
          │                 └──────┬──────┘          └──────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ agentLoopRunner │
                          │ (qh)            │
                          │ chunks.133:1565 │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ llmMessage  │          │ Tool        │          │ Progress    │
   │ Loop (Yh)   │          │ Execution   │          │ Tracking    │
   └─────────────┘          └─────────────┘          └─────────────┘
```

---

## Agent Loop Runner (qh)

### Complete Source Code

```javascript
// ============================================
// qh - agentLoopRunner - Core async generator for agent execution
// Location: chunks.133.mjs:1565-1786
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
    if (Z) px8(L, Z);
    if (qc()) {
        let $6 = K.agentId ?? R1();
        R01(L, A.agentType, $6)
    }
    let R = [...w ? Fx8(w) : [], ...q],
        u = w !== void 0 ? DI(K.readFileState) : yd(Ed),
        [I, g] = await Promise.all([$?.userContext ?? a2(), $?.systemContext ?? mw()]),
        B = A.permissionMode,
        b = () => {
            let $6 = K.getAppState(),
                n = $6.toolPermissionContext;
            if (B && $6.toolPermissionContext.mode !== "bypassPermissions" && $6.toolPermissionContext.mode !== "acceptEdits" && $6.toolPermissionContext.mode !== "auto") n = {
                ...n,
                mode: B
            };
            let o = _ !== void 0 ? !_ : B === "bubble" ? !1 : z;
            if (o) n = {
                ...n,
                shouldAvoidPermissionPrompts: !0
            };
            if (z && !o) n = {
                ...n,
                awaitAutomatedChecksBeforeDialog: !0
            };
            if (D !== void 0) n = {
                ...n,
                alwaysAllowRules: {
                    cliArg: $6.toolPermissionContext.alwaysAllowRules.cliArg,
                    session: [...D]
                }
            };
            let a = A.effort !== void 0 ? A.effort : $6.effortValue;
            if (n === $6.toolPermissionContext && a === $6.effortValue) return $6;
            return {
                ...$6,
                toolPermissionContext: n,
                effortValue: a
            }
        },
        p = P ? M : _c(A, M, z).resolvedTools,
        Q = Array.from(f.toolPermissionContext.additionalWorkingDirectories.keys()),
        U = $?.systemPrompt ? $.systemPrompt : uq(await vvY(A, K, V, Q)),
        r = $?.abortController ? $.abortController : z ? new AbortController : K.abortController,
        e = [];
    for await (let $6 of Ux8(L, A.agentType, r.signal)) if ($6.additionalContexts && $6.additionalContexts.length > 0) e.push(...$6.additionalContexts);
    if (e.length > 0) {
        let $6 = f4({
            type: "hook_additional_context",
            content: e,
            hookName: "SubagentStart",
            toolUseID: GvY(),
            hookEvent: "SubagentStart"
        });
        R.push($6)
    }
    if (A.hooks) r24(N, L, A.hooks, `agent '${A.agentType}'`, !0);
    // ... skill loading and MCP connection logic ...
    try {
        for await (let $6 of Yh({
            messages: R,
            systemPrompt: U,
            userContext: I,
            systemContext: g,
            canUseTool: Y,
            toolUseContext: z6,
            querySource: O,
            maxTurns: j ?? A.maxTurns
        })) {
            if (G?.(), $6.type === "stream_event" && $6.event.type === "message_start" && $6.ttftMs != null) {
                K.pushApiMetricsEntry?.($6.ttftMs);
                continue
            }
            if ($6.type === "attachment") {
                if ($6.attachment.type === "max_turns_reached") {
                    k(`[Agent: ${A.agentType}] Reached max turns limit`);
                    break
                }
                yield $6;
                continue
            }
            if (TvY($6)) await dg([$6], L, N6).catch((n) => k(`Failed to record sidechain transcript: ${n}`)), N6 = $6.uuid, yield $6
        }
        if (r.signal.aborted) throw new oY;
        if (Qj(A) && A.callback) A.callback()
    } finally {
        if (await K6(), A.hooks) zZ6(N, L);
        z6.readFileState.clear(), R.length = 0, a36(L), Qx8(L), t24(L, K.getAppState, N)
    }
}

// READABLE (for understanding):
async function* agentLoopRunner({
    agentDefinition,        // Agent type definition with tools, prompts, etc.
    promptMessages,         // Initial messages to process
    toolUseContext,         // Context for tool usage (state, permissions, etc.)
    canUseTool,             // Function to check if tool is usable
    isAsync,                // Whether running asynchronously (background)
    canShowPermissionPrompts, // Whether to show permission dialogs
    forkContextMessages,    // Messages from forked context
    querySource,            // Source of the query
    override,               // Override options (agentId, systemPrompt, etc.)
    model,                  // Model override
    maxTurns,               // Maximum turns before stopping
    preserveToolUseResults, // Keep tool results in transcript
    availableTools,         // Tools available to this agent
    allowedTools,           // Subset of tools allowed for this session
    onCacheSafeParams,      // Callback for cache-safe parameters
    useExactTools,          // Use exact tool set without filtering
    worktreePath,           // Git worktree path for isolation
    transcriptSubdir,       // Subdirectory for transcript storage
    onQueryProgress        // Progress callback
}) {
    // Step 1: Initialize execution context
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;
    let setAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;

    // Step 2: Resolve model (agent definition > parameter > main loop model)
    let resolvedModel = resolveModel(
        agentDefinition.model,
        toolUseContext.options.mainLoopModel,
        model,
        permissionMode
    );

    // Step 3: Generate or use provided agent ID
    let agentId = override?.agentId ? override.agentId : generateAgentId();

    // Step 4: Build message array from fork context + prompt messages
    let messages = [
        ...(forkContextMessages ? cloneForkContext(forkContextMessages) : []),
        ...promptMessages
    ];

    // Step 5: Build permission context
    let derivedPermissionMode = agentDefinition.permissionMode;
    let getDerivedAppState = () => {
        let state = toolUseContext.getAppState();
        let perms = state.toolPermissionContext;

        // Apply agent's permission mode if specified
        if (derivedPermissionMode && !["bypassPermissions", "acceptEdits", "auto"].includes(state.toolPermissionContext.mode)) {
            perms = { ...perms, mode: derivedPermissionMode };
        }

        // Determine if permission prompts should be avoided
        let avoidPrompts = canShowPermissionPrompts !== undefined
            ? !canShowPermissionPrompts
            : derivedPermissionMode === "bubble" ? false : isAsync;

        if (avoidPrompts) {
            perms = { ...perms, shouldAvoidPermissionPrompts: true };
        }

        // For async agents, await automated checks before showing dialogs
        if (isAsync && !avoidPrompts) {
            perms = { ...perms, awaitAutomatedChecksBeforeDialog: true };
        }

        return { ...state, toolPermissionContext: perms };
    };

    // Step 6: Resolve available tools
    let resolvedTools = useExactTools
        ? availableTools
        : applyToolFilters(agentDefinition, availableTools, isAsync).resolvedTools;

    // Step 7: Build system prompt
    let systemPrompt = override?.systemPrompt
        ? override.systemPrompt
        : formatSystemPrompt(await buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel));

    // Step 8: Setup abort controller
    let abortController = override?.abortController
        ? override.abortController
        : isAsync ? new AbortController() : toolUseContext.abortController;

    // Step 9: Process SubagentStart hooks for additional context
    let additionalContexts = [];
    for await (let hookEvent of runAgentHooks(agentId, agentDefinition.agentType, abortController.signal)) {
        if (hookEvent.additionalContexts && hookEvent.additionalContexts.length > 0) {
            additionalContexts.push(...hookEvent.additionalContexts);
        }
    }

    // Inject hook additional contexts as attachment message
    if (additionalContexts.length > 0) {
        let attachmentMessage = createAttachmentMessage({
            type: "hook_additional_context",
            content: additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        });
        messages.push(attachmentMessage);
    }

    // Step 10: Register agent hooks if specified in definition
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // Step 11: Load skills if specified
    let skills = agentDefinition.skills ?? [];
    if (skills.length > 0) {
        let skillRegistry = await loadSkillRegistry();
        for (let skillName of skills) {
            let skill = resolveSkillByName(skillName, skillRegistry, agentDefinition);
            if (!skill) {
                log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`, { level: "warn" });
                continue;
            }
            // Preload skill prompt into messages
            let skillContent = await skill.getPromptForCommand("", toolUseContext);
            messages.push(createUserMessage({ content: skillContent }));
        }
    }

    // Step 12: Connect MCP servers specified in agent definition
    let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } = await connectAgentMcpServers(agentDefinition, toolUseContext.options.mcpClients);

    // Step 13: Merge all tools
    let allTools = mcpTools.length > 0 ? mergeToolArrays([...resolvedTools, ...mcpTools], "name") : resolvedTools;

    // Step 14: Derive tool use context for subagent
    let derivedToolUseContext = deriveToolUseContext(toolUseContext, {
        options: {
            isNonInteractiveSession: useExactTools ? toolUseContext.options.isNonInteractiveSession : isAsync ? true : toolUseContext.options.isNonInteractiveSession ?? false,
            tools: allTools,
            mainLoopModel: resolvedModel,
            thinkingConfig: useExactTools ? toolUseContext.options.thinkingConfig : { type: "disabled" },
            mcpClients: mcpClients,
            // ... other options
        },
        agentId: agentId,
        agentType: agentDefinition.agentType,
        messages: messages,
        abortController: abortController,
        getAppState: getDerivedAppState,
    });

    // Step 15: Run the LLM message loop
    try {
        for await (let event of llmMessageLoop({
            messages: messages,
            systemPrompt: systemPrompt,
            userContext: userContext,
            systemContext: systemContext,
            canUseTool: canUseTool,
            toolUseContext: derivedToolUseContext,
            querySource: querySource,
            maxTurns: maxTurns ?? agentDefinition.maxTurns
        })) {
            // Handle progress callback
            onQueryProgress?.();

            // Handle stream events (TTFT metrics)
            if (event.type === "stream_event" && event.event.type === "message_start" && event.ttftMs != null) {
                toolUseContext.pushApiMetricsEntry?.(event.ttftMs);
                continue;
            }

            // Handle attachments (max_turns_reached, etc.)
            if (event.type === "attachment") {
                if (event.attachment.type === "max_turns_reached") {
                    log(`[Agent: ${agentDefinition.agentType}] Reached max turns limit`);
                    break;
                }
                yield event;
                continue;
            }

            // Yield recordable messages
            if (isMessageRecordable(event)) {
                await recordSidechainTranscript([event], agentId, lastMessageUuid).catch((err) =>
                    log(`Failed to record sidechain transcript: ${err}`)
                );
                lastMessageUuid = event.uuid;
                yield event;
            }
        }

        // Check for abort
        if (abortController.signal.aborted) {
            throw new AgentAbortedError();
        }

        // Run callback if agent is callback-based
        if (isCallbackAgent(agentDefinition) && agentDefinition.callback) {
            agentDefinition.callback();
        }
    } finally {
        // Cleanup: disconnect MCP servers
        await mcpCleanup();

        // Cleanup: deregister agent hooks
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }

        // Cleanup: clear read file state, messages, agent metadata
        derivedToolUseContext.readFileState.clear();
        messages.length = 0;
        cleanupAgentMetadata(agentId);
        cleanupAgentTranscript(agentId);
        killBashTasksForAgent(agentId, toolUseContext.getAppState, setAppState);
    }
}

// Mapping: qh→agentLoopRunner, A→agentDefinition, q→promptMessages, K→toolUseContext,
//          Y→canUseTool, z→isAsync, _→canShowPermissionPrompts, w→forkContextMessages,
//          O→querySource, $→override, H→model, j→maxTurns, J→preserveToolUseResults,
//          M→availableTools, D→allowedTools, X→onCacheSafeParams, P→useExactTools,
//          W→worktreePath, Z→transcriptSubdir, G→onQueryProgress
//          Fx8→cloneForkContext, vvY→buildAgentSystemPrompt, TvY→isMessageRecordable,
//          Yh→llmMessageLoop, r24→registerAgentHooks, zZ6→deregisterAgentHooks,
//          t24→killBashTasksForAgent, f4→createAttachmentMessage
```

### Key Algorithm: Generator-Based Streaming

**What it does:** The agent loop uses an async generator to stream results back to the caller in real-time.

**How it works:**
1. **Generator function** - `async function*` allows yielding values incrementally
2. **Message streaming** - Each message from the LLM is yielded immediately
3. **Backpressure handling** - Consumer controls flow by how fast they iterate
4. **Cleanup guarantee** - `finally` block ensures cleanup even on early termination

**Why this approach:**
- **Real-time UI updates** - UI can show progress as messages arrive
- **Memory efficiency** - Don't need to buffer entire response
- **Cancellability** - Consumer can stop iterating at any time
- **Composability** - Generators can be chained and transformed

**Key insight:** The generator pattern enables seamless mid-run backgrounding. When a task is backgrounded, the generator continues running but yields to a different consumer (the background task system).

---

## AgentTool (QW6)

### Complete Source Code

```javascript
// ============================================
// QW6 - AgentTool - The "Task"/"Agent" tool object
// Location: chunks.136.mjs:1512-1700
// ============================================

// ORIGINAL (for source lookup):
QW6 = {
    async prompt({
        agents: A,
        tools: q,
        getToolPermissionContext: K,
        allowedAgentTypes: Y
    }) {
        let z = await K(),
            _ = [];
        for (let H of q)
            if (H.name?.startsWith("mcp__")) {
                let J = H.name.split("__")[1];
                if (J && !_.includes(J)) _.push(J)
            } let w = zE8(A, _),
            O = jm8(w, z, r4);
        return await j_4(O, !1, Y)
    },
    name: r4,
    searchHint: "delegate work to a subagent",
    aliases: [I46],
    maxResultSizeChars: 1e5,
    async description() {
        return "Launch a new agent"
    },
    get inputSchema() {
        return xx8()
    },
    get outputSchema() {
        return eVY()
    },
    async call({
        prompt: A,
        subagent_type: q,
        description: K,
        model: Y,
        resume: z,
        run_in_background: _,
        name: w,
        team_name: O,
        mode: $,
        isolation: H,
        cwd: j
    }, J, M, D, X) {
        let P = Date.now(),
            W = e2() ? void 0 : Y,
            Z = J.getAppState(),
            G = Z.toolPermissionContext.mode;
        if (O && !E7()) throw Error("Agent Teams is not yet available on your plan.");
        let f = qkY({
            team_name: O
        }, Z);
        if ($Y() && f && w) throw Error("Teammates cannot spawn other teammates — the team roster is flat.");
        if (eP() && f && _ === !0) throw Error("In-process teammates cannot spawn background agents.");
        if (f && w) {
            // Teammate spawn path
            let n = q ? J.options.agentDefinitions.activeAgents.find((i) => i.agentType === q) : void 0;
            if (n?.color) t36(q, n.color);
            let o = await qn4({
                name: w,
                prompt: A,
                description: K,
                team_name: f,
                use_splitpane: !0,
                plan_mode_required: $ === "plan",
                model: W ?? n?.model,
                agent_type: q
            }, J);
            return {
                data: {
                    status: "teammate_spawned",
                    prompt: A,
                    ...o.data
                }
            }
        }
        // ... resume handling and agent type resolution ...
        let R = resolveAgentType(q, resume, agentDefinitions);
        let u = getAgentDefinition(R, agentDefinitions, toolPermissionContext);

        // Determine execution mode
        if (_ === true) {
            // Background execution
            let task = createBackgroundAgentTask({
                agentId,
                description: K,
                prompt: A,
                selectedAgent: u,
                setAppState: J.setAppState,
                parentAbortController: J.abortController,
                toolUseId
            });
            // Spawn agent in background
            runBackgroundAgent(task, J);
            return {
                data: {
                    status: "async_launched",
                    agentId: task.agentId,
                    description: K,
                    prompt: A,
                    outputFile: task.outputFile,
                    canReadOutputFile: hasReadTool(J)
                }
            };
        } else {
            // Synchronous execution
            let result = await runAgentSynchronously({
                agentDefinition: u,
                prompt: A,
                toolUseContext: J,
                model: W
            });
            return {
                data: {
                    status: "completed",
                    content: result.content,
                    totalToolUseCount: result.toolUseCount,
                    totalTokens: result.tokenCount,
                    usage: result.usage
                }
            };
        }
    }
}

// READABLE (for understanding):
const AgentTool = {
    name: "Agent",  // r4 = "Agent"
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],  // I46 = "Task"
    maxResultSizeChars: 100000,

    async description() {
        return "Launch a new agent";
    },

    get inputSchema() {
        return buildAgentInputSchema();  // xx8
    },

    get outputSchema() {
        return buildAgentOutputSchema();  // eVY
    },

    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        // Build prompt for tool selection
        let permContext = await getToolPermissionContext();
        let mcpServerNames = [];
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }
        let availableAgents = filterAgentsWithMcp(agents, mcpServerNames);
        let permittedAgents = filterByPermissions(availableAgents, permContext, "Agent");
        return await formatAgentSelectionPrompt(permittedAgents, false, allowedAgentTypes);
    },

    async call({
        prompt,           // The task for the agent to perform
        subagent_type,    // Agent type (general-purpose, Explore, Plan, etc.)
        description,      // Short 3-5 word description
        model,            // Model override (sonnet, opus, haiku)
        resume,           // Agent ID to resume from
        run_in_background, // Whether to run asynchronously
        name,             // Name for teammate
        team_name,        // Team name for spawning
        mode,             // Permission mode for teammate
        isolation,        // Isolation mode ("worktree")
        cwd              // Working directory override
    }, toolUseContext, ...otherArgs) {
        let startTime = Date.now();
        let modelOverride = isNonInteractiveMode() ? undefined : model;
        let appState = toolUseContext.getAppState();
        let permissionMode = appState.toolPermissionContext.mode;

        // Step 1: Check Agent Teams availability
        if (team_name && !isAgentTeamsAvailable()) {
            throw Error("Agent Teams is not yet available on your plan.");
        }

        // Step 2: Resolve team context
        let resolvedTeamName = resolveTeamContext({ team_name }, appState);

        // Step 3: Validate teammate spawning rules
        if (isTeammate() && resolvedTeamName && name) {
            throw Error("Teammates cannot spawn other teammates — the team roster is flat.");
        }
        if (isInProcessTeammate() && resolvedTeamName && run_in_background === true) {
            throw Error("In-process teammates cannot spawn background agents.");
        }

        // Step 4: Handle teammate spawning
        if (resolvedTeamName && name) {
            let agentDef = subagent_type
                ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
                : undefined;

            if (agentDef?.color) {
                setAgentColor(subagent_type, agentDef.color);
            }

            let result = await spawnTeammate({
                name: name,
                prompt: prompt,
                description: description,
                team_name: resolvedTeamName,
                use_splitpane: true,
                plan_mode_required: mode === "plan",
                model: modelOverride ?? agentDef?.model,
                agent_type: subagent_type
            }, toolUseContext);

            return {
                data: {
                    status: "teammate_spawned",
                    prompt: prompt,
                    ...result.data
                }
            };
        }

        // Step 5: Handle resume (queued message to running agent)
        if (resume) {
            let existingTask = appState.tasks[resume];
            if (isForegroundTask(existingTask) && !isBackgrounded(existingTask) && existingTask.status === "running") {
                // Queue message to running agent
                queueMessageToRunningAgent(resume, prompt, toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState);
                return {
                    data: {
                        status: "queued_to_running",
                        agentId: resume,
                        prompt: prompt
                    }
                };
            }
            // Load transcript for resume
            let transcript = await loadTranscript(getAgentDirectory(resume));
            // ... continue with resume logic
        }

        // Step 6: Resolve agent type and definition
        let resolvedAgentType = subagent_type ?? getDefaultAgentType();
        let agentDefinition = resolveAgentDefinition(resolvedAgentType, toolUseContext);

        // Step 7: Check required MCP servers
        let requiredMcpServers = agentDefinition.requiredMcpServers;
        if (requiredMcpServers?.length) {
            // Wait for MCP servers to connect
            await waitForMcpServers(requiredMcpServers, toolUseContext);
        }

        // Step 8: Create task and run agent
        if (run_in_background === true) {
            // Background execution
            let agentId = generateTaskId("local_agent");
            let task = createBackgroundAgentTask({
                agentId: agentId,
                description: description,
                prompt: prompt,
                selectedAgent: agentDefinition,
                setAppState: toolUseContext.setAppState,
                parentAbortController: toolUseContext.abortController,
                toolUseId: generateToolUseId()
            });

            // Spawn background agent
            spawnBackgroundAgent(task, toolUseContext);

            return {
                data: {
                    status: "async_launched",
                    agentId: agentId,
                    description: description,
                    prompt: prompt,
                    outputFile: task.outputFile,
                    canReadOutputFile: hasReadOrBashTools(toolUseContext)
                }
            };
        } else {
            // Synchronous execution
            let result = await runSynchronousAgent({
                agentDefinition: agentDefinition,
                prompt: prompt,
                toolUseContext: toolUseContext,
                model: modelOverride,
                description: description
            });

            return {
                data: {
                    status: "completed",
                    agentId: result.agentId,
                    content: result.content,
                    prompt: prompt,
                    totalToolUseCount: result.toolUseCount,
                    totalTokens: result.tokenCount,
                    totalDurationMs: Date.now() - startTime,
                    usage: result.usage
                }
            };
        }
    }
};

// Mapping: QW6→AgentTool, r4→"Agent", I46→"Task", xx8→buildAgentInputSchema, eVY→buildAgentOutputSchema,
//          qn4→spawnTeammate, Qn4→createBackgroundAgentTask, oV→generateTaskId
```

---

## Teammate Spawning (qn4, pNY)

### spawnTeammateDispatcher (pNY)

```javascript
// ============================================
// pNY - spawnTeammateDispatcher - Route teammate spawn to appropriate backend
// Location: chunks.135.mjs:1110-1114
// ============================================

// ORIGINAL (for source lookup):
async function pNY(A, q) {
    if (Rb()) return FNY(A, q);
    if (A.use_splitpane !== !1) return BNY(A, q);
    return gNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(teammateConfig, toolUseContext) {
    // Route to appropriate backend based on environment

    // Option 1: In-process runner (for non-interactive/headless sessions)
    if (isNonInteractiveSession()) {
        return spawnInProcessTeammate(teammateConfig, toolUseContext);
    }

    // Option 2: Split-pane runner (iTerm2/tmux with split support)
    if (teammateConfig.use_splitpane !== false) {
        return spawnSplitPaneTeammate(teammateConfig, toolUseContext);
    }

    // Option 3: Tmux-only runner (fallback)
    return spawnTmuxTeammate(teammateConfig, toolUseContext);
}

// Mapping: pNY→spawnTeammateDispatcher, Rb→isNonInteractiveSession, FNY→spawnInProcessTeammate,
//          BNY→spawnSplitPaneTeammate, gNY→spawnTmuxTeammate
```

### spawnTeammate (qn4)

```javascript
// ============================================
// qn4 - spawnTeammate - Spawn teammate agent
// Location: chunks.135.mjs:1116-1118
// ============================================

// ORIGINAL (for source lookup):
async function qn4(A, q) {
    return pNY(A, q)
}

// READABLE (for understanding):
async function spawnTeammate(teammateConfig, toolUseContext) {
    // Delegates to dispatcher which routes to appropriate backend
    return spawnTeammateDispatcher(teammateConfig, toolUseContext);
}

// Mapping: qn4→spawnTeammate, pNY→spawnTeammateDispatcher
```

---

## In-Process Agent Runner (XNY)

### Complete Source Code

```javascript
// ============================================
// XNY - inProcessAgentRunner - Runner for in-process teammates
// Location: chunks.134.mjs:1571-1750
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
    try {
        kb(K, (V) => ({
            ...V,
            messages: [...V.messages ?? [], p1({
                content: f
            })]
        }), X);
        while (!$.signal.aborted && !N) {
            k(`[inProcessRunner] ${q.agentId} processing prompt: ${v.substring(0,50)}...`);
            let V = sK();
            kb(K, (s) => ({
                ...s,
                currentWorkAbortController: V
            }), X);
            let L = p1({
                    content: v
                }),
                h = [L],
                R = G,
                u = eW(G);
            // ... agent loop continues ...
        }
    } finally {
        // Cleanup
    }
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,           // Agent identity (agentId, agentName, teamName, color)
        taskId,             // Task ID for this agent
        prompt,             // Initial prompt
        description,        // Task description
        agentDefinition,    // Agent type definition
        teammateContext,    // Team context
        toolUseContext,     // Tool use context
        abortController,    // Abort controller for cancellation
        model,              // Model override
        systemPrompt,       // Custom system prompt
        systemPromptMode,   // "replace" or "append"
        allowedTools,       // Allowed tools for this agent
        allowPermissionPrompts  // Whether to show permission prompts
    } = config;

    let { setAppState } = toolUseContext;

    log(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Build teammate context
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

    // Build system prompt
    let resolvedSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        resolvedSystemPrompt = systemPrompt;
    } else {
        let promptParts = [
            ...await buildDefaultSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel),
            teamContextPrompt  // tx8
        ];

        if (agentDefinition) {
            let customPrompt = agentDefinition.getSystemPrompt();
            if (customPrompt) {
                promptParts.push(`\n# Custom Agent Instructions\n${customPrompt}`);
            }
        }

        if (systemPromptMode === "append" && systemPrompt) {
            promptParts.push(systemPrompt);
        }

        resolvedSystemPrompt = promptParts.join("\n");
    }

    // Create synthetic agent definition for teammate
    let syntheticAgentDef = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => resolvedSystemPrompt,
        tools: agentDefinition?.tools
            ? [...new Set([...agentDefinition.tools, ...TEAMMATE_TOOLS])]
            : ["*"],
        source: "projectSettings",
        permissionMode: "default",
        ...(agentDefinition?.model ? { model: agentDefinition.model } : {})
    };

    // Claim any unclaimed tasks
    await claimUnclaimedTask(identity.parentSessionId, identity.agentName);

    try {
        // Record initial message
        atomicUpdateTask(taskId, (task) => ({
            ...task,
            messages: [...(task.messages ?? []), createUserMessage({ content: prompt })]
        }), setAppState);

        // Main agent loop
        while (!abortController.signal.aborted && !isComplete) {
            log(`[inProcessRunner] ${identity.agentId} processing prompt...`);

            // Create abort controller for this turn
            let turnAbortController = new AbortController();
            atomicUpdateTask(taskId, (task) => ({
                ...task,
                currentWorkAbortController: turnAbortController
            }), setAppState);

            // Check for compaction needed
            let tokenCount = countTokens(messageHistory);
            if (tokenCount > getMaxContextTokens(toolUseContext.options.mainLoopModel)) {
                log(`[inProcessRunner] ${identity.agentId} compacting history`);
                // Compact message history
                messageHistory = await compactHistory(messageHistory, toolUseContext);
            }

            // Run agent loop for this turn
            for await (let event of agentLoopRunner({
                agentDefinition: syntheticAgentDef,
                promptMessages: [createUserMessage({ content: currentPrompt })],
                toolUseContext: derivedToolUseContext,
                isAsync: false,
                canShowPermissionPrompts: allowPermissionPrompts,
                abortController: turnAbortController,
                model: model
            })) {
                // Handle events
                if (event.type === "attachment") {
                    // Handle attachments
                }
                if (event.type === "assistant") {
                    // Accumulate assistant message
                    messageHistory.push(event);
                }
            }

            // Poll for next message
            let nextMessage = await pollForNextMessage(
                teammateInfo,
                abortController,
                taskId,
                getAppState,
                setAppState,
                parentSessionId
            );

            if (nextMessage.type === "aborted") {
                break;
            }

            if (nextMessage.type === "shutdown_request") {
                // Handle shutdown request from another teammate
                await handleShutdownRequest(nextMessage);
                break;
            }

            if (nextMessage.type === "new_message") {
                currentPrompt = nextMessage.message;
            }
        }

    } finally {
        // Cleanup
        cleanupAgentResources(agentId);
    }
}

// Mapping: XNY→inProcessAgentRunner, q→identity, K→taskId, Y→prompt, z→description,
//          _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController,
//          H→model, j→systemPrompt, J→systemPromptMode, M→allowedTools, D→allowPermissionPrompts,
//          p1→createUserMessage, kb→atomicUpdateTask, sK→newAbortController, Ji4→claimUnclaimedTask
```

---

## Poll For Next Message (DNY)

### Complete Source Code

```javascript
// ============================================
// DNY - pollForNextMessage - Poll loop for teammate messages
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
    teammateInfo,      // Agent name, team name, etc.
    abortController,   // Abort controller for cancellation
    taskId,            // Task ID for this agent
    getAppState,       // Function to get app state
    setAppState,       // Function to set app state
    parentSessionId    // Parent session ID for task claiming
) {
    log(`[inProcessRunner] ${teammateInfo.agentName} starting poll loop`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Priority 1: Check for pending user messages (queued directly to this agent)
        let task = getAppState().tasks[taskId];
        if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove from pending list
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

            log(`[inProcessRunner] ${teammateInfo.agentName} found pending user message (poll #${pollCount})`);
            return {
                type: "new_message",
                message: message,
                from: "user"
            };
        }

        // Throttle polling (500ms delay after first poll)
        if (pollCount > 0) {
            await sleep(500);
        }

        pollCount++;

        if (abortController.signal.aborted) {
            log(`[inProcessRunner] ${teammateInfo.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${teammateInfo.agentName} poll #${pollCount}: checking mailbox`);

        try {
            // Priority 2: Check mailbox for messages
            let messages = await readMailbox(teammateInfo.agentName, teammateInfo.teamName);

            // Check for shutdown requests (highest priority mailbox message)
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
                let unreadBeforeCount = messages.slice(0, shutdownIndex).filter(m => !m.read).length;

                log(`[inProcessRunner] ${teammateInfo.agentName} received shutdown request (prioritized over ${unreadBeforeCount} unread)`);

                // Mark as read
                await markMessageAsReadByIndex(teammateInfo.agentName, teammateInfo.teamName, shutdownIndex);

                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: originalMessage.text
                };
            }

            // Priority 3: Check for team-lead messages (broadcasts from lead)
            let teamLeadIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_SENDER) {
                    teamLeadIndex = i;
                    break;
                }
            }

            // Priority 4: Any unread message
            if (teamLeadIndex === -1) {
                teamLeadIndex = messages.findIndex(m => !m.read);
            }

            if (teamLeadIndex !== -1) {
                let message = messages[teamLeadIndex];
                if (message) {
                    log(`[inProcessRunner] ${teammateInfo.agentName} received new message from ${message.from}`);

                    // Mark as read
                    await markMessageAsReadByIndex(teammateInfo.agentName, teammateInfo.teamName, teamLeadIndex);

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
            log(`[inProcessRunner] ${teammateInfo.agentName} poll error: ${error}`);
        }

        // Priority 5: Check for unclaimed tasks
        let unclaimedTask = await claimUnclaimedTask(parentSessionId, teammateInfo.agentName);
        if (unclaimedTask) {
            return {
                type: "new_message",
                message: unclaimedTask,
                from: "task-list"
            };
        }
    }

    log(`[inProcessRunner] ${teammateInfo.agentName} exiting poll loop (polls=${pollCount})`);
    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→teammateInfo, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→parentSessionId,
//          wl→readMailbox, Vc6→markMessageAsReadByIndex, Ji4→claimUnclaimedTask,
//          M66→parseShutdownRequest, jNY→sleep, BY→TEAM_LEAD_SENDER
```

### Key Algorithm: Priority-Based Message Polling

**What it does:** Polls for incoming messages with a priority ordering that ensures important messages are processed first.

**How it works:**
1. **Priority 1: Pending user messages** - Direct messages queued to this agent
2. **Priority 2: Shutdown requests** - Messages requesting agent termination
3. **Priority 3: Team-lead messages** - Broadcasts from the lead agent
4. **Priority 4: Any unread message** - General messages from teammates
5. **Priority 5: Unclaimed tasks** - Tasks from the shared task list

**Why this approach:**
- **Responsiveness** - User messages get immediate attention
- **Graceful shutdown** - Shutdown requests processed before regular messages
- **Coordination** - Team-lead broadcasts have priority over peer messages
- **Task sharing** - Agents can claim work from shared task list

**Key insight:** The 500ms polling delay after the first check balances responsiveness with resource efficiency. Shutdown requests are detected by parsing message content, allowing special handling.

---

## Task State Machine

### State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────┐
                          │   pending   │
                          │  (created)  │
                          └──────┬──────┘
                                 │ spawn()
                                 ▼
                          ┌─────────────┐
                 ┌────────│   running   │────────┐
                 │        │  (active)   │        │
                 │        └──────┬──────┘        │
                 │               │               │
        kill()  │               │ complete      │ error
        abort   │               │               │
                 │               ▼               ▼
                 │        ┌─────────────┐ ┌─────────────┐
                 │        │  completed  │ │   failed    │
                 │        │  (success)  │ │  (error)    │
                 │        └─────────────┘ └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │   killed    │
          │ (terminated)│
          └─────────────┘
```

### State Properties

| State | `status` | `notified` | Terminal | Actions Available |
|-------|----------|------------|----------|-------------------|
| pending | `"pending"` | `false` | No | spawn, cancel |
| running | `"running"` | `false` | No | kill, background, monitor |
| completed | `"completed"` | `true` after notification | Yes | read output |
| failed | `"failed"` | `true` after notification | Yes | read error |
| killed | `"killed"` | `true` after notification | Yes | read partial output |

---

## Execution Modes Comparison

### Synchronous (Blocking)

```javascript
// Flow: AgentTool.call() → runSynchronously() → await result
// Returns: { status: "completed", content, tokens, toolUseCount }
```

**Characteristics:**
- Blocks until agent completes
- Real-time progress updates in UI
- Immediate result returned
- Used for quick, bounded tasks

### Asynchronous (Background)

```javascript
// Flow: AgentTool.call({ run_in_background: true }) → createBackgroundAgentTask() → spawnBackgroundAgent()
// Returns: { status: "async_launched", agentId, outputFile }
```

**Characteristics:**
- Returns immediately with task ID
- Runs independently of main conversation
- Output written to file for polling
- User notified on completion

### Teammate (Collaborative)

```javascript
// Flow: AgentTool.call({ name, team_name }) → spawnTeammate() → inProcessAgentRunner()
// Returns: { status: "teammate_spawned", agentId, ... }
```

**Characteristics:**
- Runs as parallel agent with mailbox communication
- Can send/receive messages with other teammates
- Polls for incoming messages between turns
- Shares task list with team

---

## Related Documents

- [README.md](./README.md) - Module overview
- [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop detailed source
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system
- [teammate_protocol_complete.md](./teammate_protocol_complete.md) - Teammate protocol
- [../26_background_agents/task_lifecycle_complete_source.md](../26_background_agents/task_lifecycle_complete_source.md) - Task lifecycle