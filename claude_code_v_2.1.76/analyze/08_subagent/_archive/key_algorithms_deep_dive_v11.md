# Key Algorithms Deep Dive V11 (Claude Code 2.1.76)

> Complete algorithm analysis for subagent and background agent systems with full source-level restoration, decision rationale, and cross-feature integration. This is the definitive algorithm reference.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v5.md](./cross_validation_unified_v5.md) - Unified symbol verification

---

## Algorithm 1: AgentTool Call Handler (Complete)

### What It Does

The AgentTool call handler is the entry point for all subagent spawning. It handles:
- Teammate spawning (named agents with team context)
- Resume from existing transcript
- Background agent creation
- Synchronous subagent execution
- Worktree isolation
- MCP server requirements validation

### Complete Source Restoration

```javascript
// ============================================
// QW6.call - AgentTool Call Handler
// Location: chunks.136.mjs:1542-1902
// ============================================

// ORIGINAL (for source lookup):
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

    // ... (see detailed sections below)
}

// READABLE (for understanding):
async function call({
    prompt,
    subagent_type,
    description,
    model,
    resume,
    run_in_background,
    name,
    team_name,
    mode,
    isolation,
    cwd
}, toolUseContext, canUseTool, streamingContext, progressCallback) {
    let startTime = Date.now();
    let resolvedModel = isTenguMode() ? undefined : model;
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // STEP 1: Validate team features
    if (team_name && !isTeamModeEnabled()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    let resolvedTeamName = resolveTeamName({ team_name }, appState);

    // STEP 2: Check teammate constraints
    if (isTeammateMode() && resolvedTeamName && name) {
        throw Error("Teammates cannot spawn other teammates — the team roster is flat.");
    }
    if (isInProcessTeammate() && resolvedTeamName && run_in_background === true) {
        throw Error("In-process teammates cannot spawn background agents.");
    }

    // STEP 3: Teammate spawning path
    if (resolvedTeamName && name) {
        let agentDef = subagent_type
            ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
            : undefined;
        if (agentDef?.color) registerAgentColor(subagent_type, agentDef.color);

        let result = await spawnTeammate({
            name,
            prompt,
            description,
            team_name: resolvedTeamName,
            use_splitpane: true,
            plan_mode_required: mode === "plan",
            model: resolvedModel ?? agentDef?.model,
            agent_type: subagent_type
        }, toolUseContext);

        return {
            data: {
                status: "teammate_spawned",
                prompt,
                ...result.data
            }
        };
    }

    // STEP 4: Resume path
    let forkMessages, resumeAgentType, resumeWorktreePath;
    if (resume) {
        let existingTask = appState.tasks[resume];

        // Check if task is still running - queue message to it
        if (isRunningTask(existingTask) && !isTaskComplete(existingTask) && existingTask.status === "running") {
            queueMessageToRunningTask(resume, prompt, toolUseContext.setAppState);
            return {
                data: {
                    status: "queued_to_running",
                    agentId: resume,
                    prompt
                }
            };
        }

        // Load transcript from file
        let transcript = await loadTranscript(getAgentDir(resume));
        if (!transcript) {
            throw Error(`No transcript found for agent ID: ${resume}`);
        }
        forkMessages = parseTranscriptMessages(transcript);

        // Load agent metadata
        let metadata = await loadAgentMetadata(getAgentDir(resume));
        if (!subagent_type) resumeAgentType = metadata?.agentType;

        // Check if worktree still exists
        let worktreePath = metadata?.worktreePath;
        if (worktreePath) {
            try {
                await fs.access(worktreePath);
                resumeWorktreePath = worktreePath;
            } catch (e) {
                if (e.code === "ENOENT" || e.code === "EACCES" || e.code === "EPERM") {
                    log(`Resumed worktree ${worktreePath} no longer exists; falling back to parent cwd`);
                } else {
                    throw e;
                }
            }
        }
    }

    // STEP 5: Resolve agent type
    let agentType = subagent_type
        ?? (resumeAgentType !== undefined && resumeAgentType !== FORK_AGENT.agentType
            ? resumeAgentType
            : isTenguMode() && !resume
                ? undefined
                : DEFAULT_AGENT.agentType);
    let isFork = agentType === undefined;

    let selectedAgent;
    let isResumeOfFork = false;

    if (isFork) {
        // Fork uses parent's tools and context
        if (toolUseContext.options.querySource === `agent:builtin:${FORK_AGENT.agentType}`
            || hasForkAncestor(toolUseContext.messages)) {
            throw Error("Fork is not available inside a forked worker.");
        }
        selectedAgent = FORK_AGENT;
    } else if (resumeAgentType === FORK_AGENT.agentType) {
        selectedAgent = FORK_AGENT;
        isResumeOfFork = true;
    } else {
        // Find agent definition
        let activeAgents = toolUseContext.options.agentDefinitions.activeAgents;
        let allowedTypes = toolUseContext.options.agentDefinitions.allowedAgentTypes;
        let filteredAgents = filterByPermissions(
            allowedTypes ? activeAgents.filter(a => allowedTypes.includes(a.agentType)) : activeAgents,
            appState.toolPermissionContext,
            TOOL_NAME_AGENT
        );
        selectedAgent = filteredAgents.find(a => a.agentType === agentType);

        if (!selectedAgent) {
            if (activeAgents.find(a => a.agentType === agentType)) {
                let rule = findDenyRule(appState.toolPermissionContext, TOOL_NAME_AGENT, agentType);
                throw Error(`Agent type '${agentType}' has been denied by permission rule '${TOOL_NAME_AGENT}(${agentType})' from ${rule?.source ?? "settings"}.`);
            }
            throw Error(`Agent type '${agentType}' not found. Available agents: ${filteredAgents.map(a => a.agentType).join(", ")}`);
        }
    }

    // STEP 6: Validate MCP requirements
    let requiredMcpServers = selectedAgent.requiredMcpServers;
    if (requiredMcpServers?.length) {
        // Wait for pending MCP clients
        let hasPending = appState.mcp.clients.some(
            c => c.type === "pending" && requiredMcpServers.some(
                s => c.name.toLowerCase().includes(s.toLowerCase())
            )
        );

        if (hasPending) {
            let deadline = Date.now() + 30000;
            while (Date.now() < deadline) {
                await new Promise(resolve => setTimeout(resolve, 500));
                let currentState = toolUseContext.getAppState();

                // Check if any required server failed
                if (currentState.mcp.clients.some(
                    c => c.type === "failed" && requiredMcpServers.some(
                        s => c.name.toLowerCase().includes(s.toLowerCase())
                    )
                )) break;

                // Check if all pending servers resolved
                if (!currentState.mcp.clients.some(
                    c => c.type === "pending" && requiredMcpServers.some(
                        s => c.name.toLowerCase().includes(s.toLowerCase())
                    )
                )) break;
            }
        }

        // Collect available MCP server names
        let availableServers = [];
        for (let tool of appState.mcp.tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !availableServers.includes(serverName)) {
                    availableServers.push(serverName);
                }
            }
        }

        if (!hasRequiredMcpServers(selectedAgent, availableServers)) {
            let missing = requiredMcpServers.filter(
                s => !availableServers.some(
                    a => a.toLowerCase().includes(s.toLowerCase())
                )
            );
            throw Error(`Agent '${selectedAgent.agentType}' requires MCP servers matching: ${missing.join(", ")}. MCP servers with tools: ${availableServers.length > 0 ? availableServers.join(", ") : "none"}. Use /mcp to configure.`);
        }
    }

    // STEP 7: Set agent color if defined
    if (selectedAgent.color) {
        registerAgentColor(selectedAgent.agentType, selectedAgent.color);
    }

    // STEP 8: Resolve model
    let resolvedAgentModel = resolveModel(
        selectedAgent.model,
        toolUseContext.options.mainLoopModel,
        isFork || isResumeOfFork ? undefined : resolvedModel,
        permissionMode
    );

    // STEP 9: Send telemetry
    sendTelemetry("tengu_agent_tool_selected", {
        agent_type: selectedAgent.agentType,
        model: resolvedAgentModel,
        source: selectedAgent.source,
        color: selectedAgent.color,
        is_built_in_agent: isBuiltInAgent(selectedAgent),
        is_resume: !!resume,
        is_async: run_in_background === true || selectedAgent.background === true,
        is_fork: isFork
    });

    // STEP 10: Resolve isolation mode
    let isolationMode = isolation ?? selectedAgent.isolation;

    // STEP 11: Build system prompt and messages
    let systemPromptOverride, promptMessages;

    if (isFork || isResumeOfFork) {
        // Fork uses parent's system prompt
        if (toolUseContext.renderedSystemPrompt) {
            systemPromptOverride = toolUseContext.renderedSystemPrompt;
        } else {
            let parentAgent = appState.agent
                ? appState.agentDefinitions.activeAgents.find(a => a.agentType === appState.agent)
                : undefined;
            let workingDirs = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys());
            let defaultPrompt = await buildDefaultSystemPrompt(
                toolUseContext.options.tools,
                toolUseContext.options.mainLoopModel,
                workingDirs,
                toolUseContext.options.mcpClients
            );
            systemPromptOverride = assembleSystemPrompt({
                mainThreadAgentDefinition: parentAgent,
                toolUseContext,
                customSystemPrompt: toolUseContext.options.customSystemPrompt,
                defaultSystemPrompt: defaultPrompt,
                appendSystemPrompt: toolUseContext.options.appendSystemPrompt
            });
        }
        promptMessages = isFork
            ? createForkMessages(prompt, streamingContext)
            : [createUserMessage({ content: prompt })];
    } else {
        // Regular agent gets its own system prompt
        try {
            let workingDirs = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys());
            let agentPrompt = selectedAgent.getSystemPrompt({ toolUseContext });

            if (selectedAgent.memory) {
                sendTelemetry("tengu_agent_memory_loaded", {
                    scope: selectedAgent.memory,
                    source: "subagent"
                });
            }

            systemPromptOverride = await buildAgentSystemPrompt([agentPrompt], resolvedAgentModel, workingDirs);
        } catch (e) {
            log(`Failed to get system prompt for agent ${selectedAgent.agentType}: ${errorToString(e)}`);
        }
        promptMessages = [createUserMessage({ content: prompt })];
    }

    // STEP 12: Determine execution mode
    let telemetryData = {
        prompt,
        resolvedAgentModel,
        isBuiltInAgent: isBuiltInAgent(selectedAgent),
        startTime,
        agentType: selectedAgent.agentType,
        isAsync: run_in_background === true || selectedAgent.background === true
    };

    let forceBackground = false;
    let isTengu = isTenguMode();

    let shouldRunAsync = (
        run_in_background === true
        || selectedAgent.background === true
        || forceBackground
        || isTengu
        || (isProactiveMode?.() ?? false)
    ) && !isPlanMode();

    // STEP 13: Prepare permission context
    let subagentPermissionContext = {
        ...appState.toolPermissionContext,
        mode: selectedAgent.permissionMode ?? "acceptEdits"
    };
    let availableTools = filterToolsByMode(subagentPermissionContext, appState.mcp.tools);

    // STEP 14: Generate agent ID
    let agentId = resume || generateTaskId("local_agent");

    // STEP 15: Create worktree if isolation requested
    let worktreeInfo = null;
    if (isolationMode === "worktree") {
        let worktreeName = `agent-${agentId.slice(0, 8)}`;
        worktreeInfo = await createWorktree(worktreeName);
    }

    // Add worktree path to messages
    if (isFork && worktreeInfo) {
        promptMessages.push(createUserMessage({
            content: formatWorktreeInstructions(getCwd(), worktreeInfo.worktreePath)
        }));
    }

    // STEP 16: Build agent config
    let agentConfig = {
        agentDefinition: selectedAgent,
        promptMessages: forkMessages ? [...forkMessages, ...promptMessages] : promptMessages,
        toolUseContext,
        canUseTool,
        isAsync: shouldRunAsync,
        querySource: toolUseContext.options.querySource ?? getQuerySource(selectedAgent.agentType, isBuiltInAgent(selectedAgent)),
        model: isFork || isResumeOfFork ? undefined : resolvedModel,
        override: isFork || isResumeOfFork
            ? { systemPrompt: systemPromptOverride }
            : systemPromptOverride && !worktreeInfo && !cwd && !resumeWorktreePath
                ? { systemPrompt: buildSystemPrompt(systemPromptOverride) }
                : undefined,
        availableTools: isFork ? toolUseContext.options.tools : availableTools,
        forkContextMessages: forkMessages ? undefined : isFork ? toolUseContext.messages : undefined,
        ...(isFork || isResumeOfFork) && { useExactTools: true },
        worktreePath: worktreeInfo?.worktreePath ?? resumeWorktreePath
    };

    // STEP 17: Execute
    let resolvedCwd = cwd ?? worktreeInfo?.worktreePath ?? resumeWorktreePath;
    let withCwd = (fn) => resolvedCwd ? runInDirectory(resolvedCwd, fn) : fn();

    // Cleanup function for worktree
    let cleanupWorktree = async () => {
        if (!worktreeInfo) return {};
        let { worktreePath, worktreeBranch, headCommit, gitRoot, hookBased } = worktreeInfo;
        worktreeInfo = null; // Prevent double cleanup

        if (hookBased) {
            log(`Hook-based agent worktree kept at: ${worktreePath}`);
            return { worktreePath };
        }

        if (headCommit) {
            if (!await isWorktreeClean(worktreePath, headCommit)) {
                await removeWorktree(worktreePath, worktreeBranch, gitRoot);
                clearWorktreeMetadata(getAgentDir(agentId), { agentType: selectedAgent.agentType }).catch(
                    e => log(`Failed to clear worktree metadata: ${e}`)
                );
                return {};
            }
        }
        log(`Agent worktree has changes, keeping: ${worktreePath}`);
        return { worktreePath, worktreeBranch };
    };

    // BACKGROUND EXECUTION PATH
    if (shouldRunAsync) {
        let taskId = agentId;
        let taskRecord = createBackgroundAgentTask({
            agentId: taskId,
            description,
            prompt,
            selectedAgent,
            setAppState: toolUseContext.setAppState,
            toolUseId: toolUseContext.toolUseId
        });

        // Register name if provided
        if (name) {
            (toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState)((state) => {
                let registry = new Map(state.agentNameRegistry);
                registry.set(name, getAgentDir(taskId));
                return { ...state, agentNameRegistry: registry };
            });
        }

        // Telemetry context
        let telemetryContext = {
            agentId: taskId,
            parentSessionId: getSessionId(),
            agentType: "subagent",
            subagentName: selectedAgent.agentType,
            isBuiltIn: isBuiltInAgent(selectedAgent)
        };

        // Spawn background execution
        withTelemetryContext(telemetryContext, () => withCwd(async () => {
            let stopCacheCallback;
            let eventQueue = [];

            try {
                let progressTracker = createProgressTracker();
                let toolExecutor = createToolExecutor(toolUseContext.options.tools);

                for await (let event of agentLoopRunner({
                    ...agentConfig,
                    override: {
                        ...agentConfig.override,
                        agentId: getAgentDir(taskRecord.agentId),
                        abortController: taskRecord.abortController
                    },
                    onCacheSafeParams: forceBackground || isTengu || isTelemetryEnabled()
                        ? (params) => {
                            let { stop } = startCacheHeartbeat(taskRecord.agentId, getAgentDir(taskRecord.agentId), params, toolUseContext.setAppState);
                            stopCacheCallback = stop;
                        }
                        : undefined
                })) {
                    eventQueue.push(event);
                    renderEvent(progressTracker, event, toolExecutor, toolUseContext.options.tools);
                    updateTaskProgressPreservingSummary(taskRecord.agentId, getProgressStats(progressTracker), toolUseContext.setAppState);

                    let tokenCount = extractTokenCount(event);
                    if (tokenCount) {
                        recordTokenUsage(progressTracker, taskRecord.agentId, toolUseContext.toolUseId, description, startTime, tokenCount);
                    }
                }

                stopCacheCallback?.();

                let result = aggregateResults(eventQueue, taskRecord.agentId, telemetryData);
                let textContent = result.content.filter(c => c.type === "text").map(c => c.text).join("\n");

                // Post-processing hook
                let hookResult = await runPostProcessingHook({
                    agentMessages: eventQueue,
                    tools: toolUseContext.options.tools,
                    toolPermissionContext: toolUseContext.getAppState().toolPermissionContext,
                    abortSignal: taskRecord.abortController.signal,
                    subagentType: selectedAgent.agentType,
                    totalToolUseCount: result.totalToolUseCount
                });
                if (hookResult) {
                    textContent = `${hookResult}\n\n${textContent}`;
                }

                let worktreeResult = await cleanupWorktree();

                markTaskCompleted(result, toolUseContext.setAppState);
                showTaskNotification({
                    taskId: taskRecord.agentId,
                    description,
                    status: "completed",
                    setAppState: toolUseContext.setAppState,
                    finalMessage: textContent,
                    usage: {
                        totalTokens: getTotalTokens(progressTracker),
                        toolUses: result.totalToolUseCount,
                        durationMs: result.totalDurationMs
                    },
                    toolUseId: toolUseContext.toolUseId,
                    ...worktreeResult
                });
                removeTask(taskRecord.agentId, toolUseContext.setAppState);

            } catch (error) {
                stopCacheCallback?.();
                let worktreeResult = await cleanupWorktree();

                if (error instanceof AbortError) {
                    sendTelemetry("tengu_agent_tool_terminated", {
                        agent_type: telemetryData.agentType,
                        model: telemetryData.resolvedAgentModel,
                        duration_ms: Date.now() - telemetryData.startTime,
                        is_async: true,
                        is_built_in_agent: telemetryData.isBuiltInAgent,
                        reason: "user_kill_async"
                    });

                    if (triggerAbortSignal(taskRecord.agentId, toolUseContext.setAppState)) {
                        let partialResult = extractPartialResult(eventQueue);
                        showTaskNotification({
                            taskId: taskRecord.agentId,
                            description,
                            status: "killed",
                            setAppState: toolUseContext.setAppState,
                            toolUseId: toolUseContext.toolUseId,
                            finalMessage: partialResult,
                            ...worktreeResult
                        });
                        setTimeout(() => removeTask(taskRecord.agentId, toolUseContext.setAppState), NOTIFICATION_DISPLAY_TIME);
                    }
                    return;
                }

                let errorMessage = error instanceof Error ? error.message : String(error);
                markTaskFailed(taskRecord.agentId, errorMessage, toolUseContext.setAppState);
                showTaskNotification({
                    taskId: taskRecord.agentId,
                    description,
                    status: "failed",
                    error: errorMessage,
                    setAppState: toolUseContext.setAppState,
                    toolUseId: toolUseContext.toolUseId,
                    ...worktreeResult
                });
                removeTask(taskRecord.agentId, toolUseContext.setAppState);
            } finally {
                clearAgentContext(agentId);
                clearTelemetryContext(agentId);
            }
        }));

        let canReadOutput = toolUseContext.options.tools.some(
            t => matchesTool(t, TOOL_NAME_READ) || matchesTool(t, TOOL_NAME_BASH)
        );

        return {
            data: {
                isAsync: true,
                status: "async_launched",
                agentId: taskRecord.agentId,
                description,
                prompt,
                outputFile: getOutputFilePath(taskRecord.agentId),
                canReadOutputFile: canReadOutput
            }
        };
    }

    // SYNCHRONOUS EXECUTION PATH
    else {
        let syncAgentId = getAgentDir(agentId);
        let telemetryContext = {
            agentId: syncAgentId,
            parentSessionId: getSessionId(),
            agentType: "subagent",
            subagentName: selectedAgent.agentType,
            isBuiltIn: isBuiltInAgent(selectedAgent)
        };

        return withTelemetryContext(telemetryContext, () => withCwd(async () => {
            let eventQueue = [];
            let executionStartTime = Date.now();
            let progressTracker = createProgressTracker();
            let toolExecutor = createToolExecutor(toolUseContext.options.tools);

            // Send initial progress
            if (promptMessages.length > 0) {
                let firstUserMsg = flattenMessages(promptMessages).find(m => m.type === "user");
                if (firstUserMsg && firstUserMsg.type === "user" && progressCallback) {
                    progressCallback({
                        toolUseID: `agent_${streamingContext.message.id}`,
                        data: {
                            message: firstUserMsg,
                            type: "agent_progress",
                            prompt,
                            resume,
                            agentId: syncAgentId
                        }
                    });
                }
            }

            // Create foreground task for status tracking
            let foregroundTask;
            if (!isPlanMode()) {
                foregroundTask = createForegroundAgentTask({
                    agentId: syncAgentId,
                    description,
                    prompt,
                    selectedAgent,
                    setAppState: toolUseContext.setAppState,
                    toolUseId: toolUseContext.toolUseId,
                    autoBackgroundMs: getAutoBackgroundTimeout() || undefined
                });
            }

            // ... continue with sync execution
        }));
    }
}

// Mapping: See cross_validation_unified_v5.md for full symbol mapping
```

### Decision Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENTTOOL CALL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Input: { prompt, subagent_type, description, model, resume, run_in_background, name, team_name, mode, isolation, cwd }
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: Validate Team Features                                               │
│   if (team_name && !isTeamModeEnabled()) throw Error                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Check Teammate Constraints                                           │
│   - Teammates can't spawn other teammates                                    │
│   - In-process teammates can't spawn background agents                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           │                                           │
           ▼                                           ▼
┌───────────────────────┐                   ┌───────────────────────┐
│ Teammate Path         │                   │ Subagent Path         │
│ (name && team_name)   │                   │                       │
│                       │                   │                       │
│ spawnTeammate()       │                   │ Continue to Step 3... │
│ return { status:      │                   │                       │
│   "teammate_spawned"} │                   │                       │
└───────────────────────┘                   └───────────────────────┘
                                                     │
                                                     ▼
                            ┌────────────────────────────────────────────────┐
                            │ Step 3: Resume Check                            │
                            │   if (resume) check if task is still running    │
                            │   - Running: queue message, return              │
                            │   - Not running: load transcript                │
                            └────────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                            ┌────────────────────────────────────────────────┐
                            │ Step 4: Resolve Agent Type                      │
                            │   - Explicit subagent_type? Use it             │
                            │   - No type? Fork (use parent context)          │
                            │   - Validate against allowed agents             │
                            └────────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                            ┌────────────────────────────────────────────────┐
                            │ Step 5: Validate MCP Requirements               │
                            │   - Check required MCP servers are available   │
                            │   - Wait for pending servers (30s timeout)     │
                            │   - Throw if requirements not met              │
                            └────────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                            ┌────────────────────────────────────────────────┐
                            │ Step 6: Build Execution Context                 │
                            │   - Resolve model                              │
                            │   - Build system prompt                        │
                            │   - Prepare prompt messages                    │
                            │   - Create worktree if isolation requested     │
                            └────────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                            ┌────────────────────────────────────────────────┐
                            │ Step 7: Determine Execution Mode                │
                            │   run_in_background || agent.background ||     │
                            │   isTengu || isProactiveMode                    │
                            └────────────────────────┬───────────────────────┘
                                                     │
                         ┌───────────────────────────┴───────────────────┐
                         │                                               │
                         ▼                                               ▼
              ┌─────────────────────┐                         ┌─────────────────────┐
              │ ASYNC PATH          │                         │ SYNC PATH           │
              │                     │                         │                     │
              │ createBackground    │                         │ createForeground    │
              │ AgentTask()         │                         │ AgentTask()         │
              │                     │                         │                     │
              │ Spawn detached      │                         │ Block until         │
              │ execution           │                         │ complete            │
              │                     │                         │                     │
              │ return {            │                         │ return {            │
              │   status:           │                         │   status:           │
              │   "async_launched", │                         │   "completed",      │
              │   agentId,          │                         │   content,          │
              │   outputFile        │                         │   tokens            │
              │ }                   │                         │ }                   │
              └─────────────────────┘                         └─────────────────────┘
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Single entry point | All subagent spawning goes through one validation pipeline |
| Early validation | Fail fast on missing MCP servers, invalid agent types |
| Fork mode | Reuses parent's tools/context for efficiency |
| Worktree isolation | Prevents file conflicts when agent modifies files |
| Resume capability | Can continue from previous execution transcript |

---

## Algorithm 2: Abort Signal Propagation (Enhanced)

### Complete Source Restoration

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort running task
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
    let wasKilled = false;

    // Atomically update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // STEP 1: Abort the AbortController
        // This propagates to:
        // - LLM API stream (cancels token generation)
        // - Tool execution (checks signal.aborted)
        // - Child agents (if any, via inherited signal)
        task.abortController?.abort();

        // STEP 2: Unregister cleanup handler
        // Prevents double cleanup when:
        // - Process exit handler fires
        // - Task completion handler fires
        task.unregisterCleanup?.();

        // STEP 3: Return updated task with killed status
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // STEP 4: Flush output buffer (preserve partial results)
    if (wasKilled) {
        flushOutputBuffer(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Abort Propagation Chain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ABORT PROPAGATION CHAIN                              │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F (or TaskStop called)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ U4q - killAllLocalAgents                                                     │
│   for each task: if (type === "local_agent" && status === "running")         │
│     triggerAbortSignal(taskId, setAppState)                                  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ x66 - triggerAbortSignal                                                     │
│   1. Check status === "running" (atomic update)                              │
│   2. abortController.abort()                                                 │
│   3. unregisterCleanup()                                                     │
│   4. Set status = "killed"                                                   │
│   5. flushOutputBuffer(taskId)                                               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ LLM Stream      │     │ Tool Execution  │     │ Child Agents    │
│                 │     │                 │     │                 │
│ signal.aborted  │     │ if (signal.     │     │ Inherited       │
│ = true          │     │   aborted)      │     │ AbortController │
│                 │     │   throw Abort   │     │ also aborted    │
│ Stream cancels  │     │                 │     │                 │
│ mid-token       │     │ Tool cleans up  │     │ Nested kill     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Algorithm 3: Notification Injection Pipeline

### What It Does

Injects task status notifications into the UI and system reminder attachments for LLM context.

### Source Code

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - System reminder attachment
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

    // Step 2: Poll output files for delta content
    let {
        attachments,          // New attachments to send
        updatedTaskOffsets,   // New read positions
        evictedTaskIds        // Tasks to remove from state
    } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new results
    updateTaskState(
        toolUseContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );

    // Step 4: Return simplified attachments for LLM
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, q→appState, K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds
```

### Notification Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION INJECTION PIPELINE                      │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Running
        │
        ├─ Progress updates → updateTaskProgressWithTelemetry()
        │
        └─ Task completes/fails/killed
                │
                ▼
        $m8 / Hm8 / x66 (markTaskCompleted/Failed/Killed)
                │
                ▼
        $z6 - showTaskNotification()
        {
            taskId,
            description,
            status: "completed" | "failed" | "killed",
            finalMessage,
            usage: { totalTokens, toolUses, durationMs }
        }
                │
                ├──────────────────────────────────────┐
                │                                      │
                ▼                                      ▼
        ┌─────────────────┐                   ┌─────────────────┐
        │ UI Notification │                   │ System Reminder │
        │                 │                   │ Attachment      │
        │ w0({            │                   │                 │
        │   value: text,  │                   │ getUnifiedTasks │
        │   mode: "task-  │                   │ Attachment()    │
        │   notification" │                   │                 │
        │ })              │                   │ → task_status   │
        └─────────────────┘                   │ attachment      │
                                              └─────────────────┘
                                                     │
                                                     ▼
                                              LLM Context Injection
                                              (isMeta: true message)
```

---

## Algorithm 4: Output Buffer Flushing

### What It Does

Manages buffered writes to task output files and ensures data is flushed on completion or termination.

### Source Code

```javascript
// ============================================
// Y91 - OutputBuffer - Buffered output file writer
// Location: chunks.41.mjs:2252
// ============================================

class OutputBuffer {
    constructor(filePath) {
        this.filePath = filePath;
        this.buffer = [];
        this.flushPromise = null;
        this.isFlushing = false;
    }

    // Append content to buffer
    append(content) {
        this.buffer.push(content);
        // Auto-flush if buffer exceeds threshold
        if (this.getBufferSize() > AUTO_FLUSH_THRESHOLD) {
            this.flush();
        }
    }

    // Flush buffer to file
    async flush() {
        if (this.isFlushing || this.buffer.length === 0) return;

        this.isFlushing = true;
        let contentToWrite = this.buffer.join('');
        this.buffer = [];

        try {
            await fs.appendFile(this.filePath, contentToWrite, 'utf-8');
        } catch (error) {
            // Re-add content to buffer on failure
            this.buffer.unshift(contentToWrite);
            throw error;
        } finally {
            this.isFlushing = false;
        }
    }
}

// ============================================
// $O - flushOutputBuffer - Flush specific task's buffer
// Location: chunks.41.mjs:2320
// ============================================

function flushOutputBuffer(taskId) {
    let buffer = outputBuffers.get(taskId);
    if (buffer) {
        buffer.flush();
    }
}

// ============================================
// Z97 - readOutputFileDelta - Read incremental output
// Location: chunks.41.mjs:2325
// ============================================

async function readOutputFileDelta(taskId, currentOffset) {
    let filePath = getOutputFilePath(taskId);

    try {
        let stats = await fs.stat(filePath);
        let fileSize = stats.size;

        if (fileSize <= currentOffset) {
            return { content: null, newOffset: currentOffset };
        }

        let fd = await fs.open(filePath, 'r');
        let buffer = Buffer.alloc(fileSize - currentOffset);
        await fd.read(buffer, 0, buffer.length, currentOffset);
        await fd.close();

        return {
            content: buffer.toString('utf-8'),
            newOffset: fileSize
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { content: null, newOffset: 0 };
        }
        throw error;
    }
}
```

---

## Algorithm 5: Progress Throttling

### What It Does

Updates task progress with telemetry while preventing excessive state updates.

### Source Code

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let telemetryData = null;

    // Atomically update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry
        telemetryData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        // Return updated task
        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if enabled (throttled)
    if (telemetryData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}
```

---

## Cross-Feature Integration Matrix

### Integration with System Reminders

| Hook Point | Function | Data Flow |
|------------|----------|-----------|
| Progress Update | `nl4` | Task progress → State update → Telemetry |
| Output Polling | `wY4` | Output file → Delta content → State update |
| Attachment Build | `suY` | Task state → task_status attachment → LLM context |
| Notification Display | `$z6` | Task status → UI notification → User visible |

### Integration with Hooks

| Hook Type | Trigger | Subagent Behavior |
|-----------|---------|-------------------|
| PreTool | Tool execution | Can allow/deny/ask for tool use |
| PostTool | Tool result | Can modify result or add context |
| Stop | Turn complete | Runs after each agent turn |

### Integration with Compact

| Scenario | Behavior |
|----------|----------|
| Auto-compact triggers | Task messages with `isMeta: true` are preserved |
| Context overflow | Task status attachments kept, old messages summarized |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full source restoration with algorithm analysis and cross-feature integration