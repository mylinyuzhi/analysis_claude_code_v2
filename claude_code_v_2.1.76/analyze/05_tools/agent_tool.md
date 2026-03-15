# Agent/Task Tool - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of the Agent tool for spawning sub-agents: execution modes, background tasks, team spawning, and result handling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)

Key functions in this document:
- `AgentTool` (rj1) - Agent tool definition object - chunks.132.mjs:85
- `TOOL_NAME_AGENT` (fK) - Tool name constant "Task" - chunks.132.mjs
- `agentInputSchema` (oVY) - Input schema definition - chunks.132.mjs:37
- `agentOutputSchema` (ANY) - Output schema definition - chunks.132.mjs:84
- `generateAgentId` (NR) - Task ID generation - chunks.89.mjs
- `createAsyncTask` (zd7) - Background task creation - chunks.132.mjs
- `agentLoopRunner` (dR) - Agent loop execution - chunks.107.mjs
- `loadTranscript` (sP1) - Resume transcript loading - chunks.89.mjs
- `buildAgentResult` (UEA) - Result builder - chunks.132.mjs
- `getOutputFilePath` (ww) - Output file path - chunks.89.mjs

---

## Architecture Overview

```
LLM generates Task tool_use { prompt, subagent_type, run_in_background?, model?, resume? }
         │
         ▼
 validateInput()
 ├── Agent type validation
 ├── MCP server requirements check
 └── Background task availability check
         │
         ▼
 Branch decision
 ├── run_in_background=true → Background execution
 │   ├── Create task record (zd7)
 │   ├── Create abort controller
 │   └── Launch async agentLoopRunner (dR)
 │
 ├── team_name provided → Teammate spawn
 │   └── spawnSplitPaneTeammate
 │
 └── run_in_background=false → Foreground execution
     ├── Create foreground task
     ├── Run agentLoopRunner (dR)
     └── Return completed result
         │
         ▼
 Return { data: { status, ... } }
```

---

## 1. Tool Definition Object

### AgentTool (rj1) - Sub-agent spawning tool

**What it does:** Provides the primary interface for spawning specialized sub-agents to perform complex tasks, with support for background execution, teammate spawning, and resume capabilities.

```javascript
// ============================================
// AgentTool - Main sub-agent spawning tool definition
// Location: chunks.132.mjs:85-315
// ============================================

// ORIGINAL (for source lookup):
rj1 = {
    name: fK,  // "Task"
    maxResultSizeChars: 1e5,
    async prompt({ agents: A, tools: q, getToolPermissionContext: K, allowedAgentTypes: Y }) {
        let z = await K(),
            w = [];
        for (let _ of q)
            if (_.name?.startsWith("mcp__")) {
                let X = _.name.split("__")[1];
                if (X && !w.includes(X)) w.push(X)
            }
        let H = un7(A, w),
            $ = pEA(H, z, fK);
        return await Gn7($, !1, Y)
    },
    async description() { return "Launch a new task" },
    get inputSchema() { return avA() },
    get outputSchema() { return ANY() },
    async call({
        prompt: A,
        subagent_type: q,
        description: K,
        model: Y,
        resume: z,
        run_in_background: w,
        max_turns: H,
        name: $,
        team_name: O,
        mode: _
    }, J, X, D, j) { ... }
}

// READABLE (for understanding):
const AgentTool = {
    name: "Task",
    maxResultSizeChars: 100000,

    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        // Get permission context
        let permissionContext = await getToolPermissionContext();

        // Collect MCP server names from tools
        let mcpServerNames = [];
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }

        // Build agent list with MCP requirements
        let availableAgents = buildAgentList(agents, mcpServerNames);

        // Filter by permissions
        let filteredAgents = filterAgentsByPermission(availableAgents, permissionContext, "Task");

        // Generate prompt with agent descriptions
        return await generateAgentSelectionPrompt(filteredAgents, false, allowedAgentTypes);
    },

    isConcurrencySafe() { return false; },  // Sub-agent state affects parent
    isReadOnly() { return false; },          // Can modify filesystem

    async call(input, toolUseContext, canUseTool, invocationContext, onProgress) {
        let { prompt, subagent_type, description, model, resume, run_in_background, max_turns, name, team_name, mode } = input;

        let startTime = Date.now();
        let appState = await toolUseContext.getAppState();
        let permissionMode = appState.toolPermissionContext.mode;

        // Check if agent teams is available
        if (team_name && !isAgentTeamsEnabled()) {
            throw Error("Agent Teams is not yet available on your plan.");
        }

        // Resolve team name
        let resolvedTeamName = resolveTeamName({ team_name }, appState);

        // Handle in-process teammate spawning
        if (isInProcessTeammate() && resolvedTeamName) {
            if (name) {
                throw Error("In-process teammates cannot spawn other teammates.");
            }
            if (run_in_background === true) {
                throw Error("In-process teammates cannot spawn background agents.");
            }
        }

        // Handle teammate spawning
        if (resolvedTeamName && name) {
            let result = await spawnTeammate({
                name,
                prompt,
                description,
                team_name: resolvedTeamName,
                use_splitpane: true,
                plan_mode_required: mode === "plan",
                model,
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

        // Get available agents
        let activeAgents = toolUseContext.options.agentDefinitions.activeAgents;
        let allowedAgentTypes = toolUseContext.options.agentDefinitions.allowedAgentTypes;
        let availableAgents = filterAgentsByPermission(
            allowedAgentTypes ? activeAgents.filter(a => allowedAgentTypes.includes(a.agentType)) : activeAgents,
            appState.toolPermissionContext,
            "Task"
        );

        // Find the requested agent
        let selectedAgent = availableAgents.find(a => a.agentType === subagent_type);
        if (!selectedAgent) {
            if (activeAgents.find(a => a.agentType === subagent_type)) {
                let denyRule = findDenyRule(appState.toolPermissionContext, "Task", subagent_type);
                throw Error(`Agent type '${subagent_type}' has been denied by permission rule 'Task(${subagent_type})' from ${denyRule?.source ?? "settings"}.`);
            }
            throw Error(`Agent type '${subagent_type}' not found. Available agents: ${availableAgents.map(a => a.agentType).join(", ")}`);
        }

        // Check MCP requirements
        if (selectedAgent.requiredMcpServers?.length) {
            checkMcpRequirements(selectedAgent, appState.mcp.tools);
        }

        // Resolve model
        let resolvedModel = resolveAgentModel(selectedAgent.model, toolUseContext.options.mainLoopModel, model, permissionMode, selectedAgent.agentType);

        // Track agent selection
        telemetry("tengu_agent_tool_selected", {
            agent_type: selectedAgent.agentType,
            model: resolvedModel,
            source: selectedAgent.source,
            color: selectedAgent.color,
            is_built_in_agent: isBuiltInAgent(selectedAgent)
        });

        // Handle resume
        let promptMessages;
        if (resume) {
            let task = appState.tasks[resume];
            if (task && task.status === "running") {
                throw Error(`Cannot resume agent ${resume}: it is still running. Use TaskStop to stop it first.`);
            }
            let transcript = await loadTranscript(prefixAgentId(resume));
            if (!transcript) {
                throw Error(`No transcript found for agent ID: ${resume}`);
            }
            promptMessages = prepareResumeMessages(transcript);
        }

        // Build system prompt override
        let systemPromptOverride;
        if (selectedAgent.forkContext) {
            // Include parent context
            systemPromptOverride = await buildForkedSystemPrompt(selectedAgent, toolUseContext);
        }

        // Prepare execution context
        let executionContext = {
            agentDefinition: selectedAgent,
            promptMessages: promptMessages ?? [createUserMessage({ content: prompt })],
            toolUseContext: toolUseContext,
            canUseTool: canUseTool,
            forkContextMessages: selectedAgent.forkContext ? toolUseContext.messages : undefined,
            isAsync: run_in_background === true,
            querySource: toolUseContext.options.querySource ?? getQuerySource(selectedAgent),
            model: model,
            maxTurns: max_turns,
            override: systemPromptOverride ? { systemPrompt: systemPromptOverride } : undefined,
            availableTools: filterToolsForPermission(appState.toolPermissionContext, appState.mcp.tools)
        };

        // Execute agent
        if (executionContext.isAsync) {
            return executeBackgroundAgent(executionContext, {
                resumeId: resume,
                description,
                prompt,
                selectedAgent,
                startTime,
                toolUseContext
            });
        } else {
            return executeForegroundAgent(executionContext, {
                resumeId: resume,
                description,
                prompt,
                selectedAgent,
                startTime,
                toolUseContext,
                onProgress
            });
        }
    }
};

// Mapping: rj1→AgentTool, fK→TOOL_NAME_AGENT, oVY→agentInputSchema, ANY→agentOutputSchema,
//          A→prompt, q→subagent_type, K→description, Y→model, z→resume, w→run_in_background,
//          H→max_turns, $→name, O→team_name, _→mode, J→toolUseContext, NR→generateAgentId,
//          dR→agentLoopRunner, zd7→createAsyncTask, sP1→loadTranscript, UEA→buildAgentResult
```

**Why multiple execution modes:**
- **Foreground:** For short tasks that need immediate results
- **Background:** For long-running tasks that shouldn't block the conversation
- **Teammate:** For parallel work in team-based workflows

---

## 2. Input Schema Definition

### agentInputSchema (oVY) - Complete parameter set

```javascript
// ============================================
// agentInputSchema - Zod input schema for Agent tool
// Location: chunks.132.mjs:37-45
// ============================================

// ORIGINAL (for source lookup):
oVY = u.object({
    description: u.string().describe("A short (3-5 word) description of the task"),
    prompt: u.string().describe("The task for the agent to perform"),
    subagent_type: u.string().describe("The type of specialized agent to use for this task"),
    model: u.enum(["sonnet", "opus", "haiku"]).optional().describe(rVY),
    resume: u.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
    run_in_background: u.boolean().optional().describe(`Set to true to run this agent in the background. The tool result will include an output_file path - use Read tool or Bash tail to check on output.`),
    max_turns: u.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
})

// READABLE (for understanding):
const agentInputSchema = z.object({
    description: z.string()
        .describe("A short (3-5 word) description of the task"),

    prompt: z.string()
        .describe("The task for the agent to perform"),

    subagent_type: z.string()
        .describe("The type of specialized agent to use for this task"),

    model: z.enum(["sonnet", "opus", "haiku"]).optional()
        .describe("Optional model to use for this agent. If not specified, inherits from parent."),

    resume: z.string().optional()
        .describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),

    run_in_background: z.boolean().optional()
        .describe("Set to true to run this agent in the background. The tool result will include an output_file path - use Read tool or Bash tail to check on output."),

    max_turns: z.number().int().positive().optional()
        .describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
});

// Team spawning extension (aVY)
const teamSpawnSchema = z.object({
    name: z.string().optional()
        .describe("Name for the spawned agent"),

    team_name: z.string().optional()
        .describe("Team name for spawning. Uses current team context if omitted."),

    mode: z.enum(["plan", "acceptEdits", ...]).optional()
        .describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
});

// Full input: oVY.merge(aVY) = avA

// Mapping: oVY→agentInputSchema, aVY→teamSpawnSchema, avA→fullAgentInputSchema
```

---

## 3. Output Schema Definition

### agentOutputSchema (ANY) - Union of result types

```javascript
// ============================================
// agentOutputSchema - Zod output schema for Agent tool
// Location: chunks.132.mjs:75-84
// ============================================

// ORIGINAL (for source lookup):
sVY = u.object({
    agentId: u.string(),
    content: u.array(u.object({
        type: u.literal("text"),
        text: u.string()
    })),
    totalToolUseCount: u.number(),
    totalDurationMs: u.number(),
    totalTokens: u.number(),
    usage: u.object({
        input_tokens: u.number(),
        output_tokens: u.number(),
        cache_creation_input_tokens: u.number().nullable(),
        cache_read_input_tokens: u.number().nullable(),
        server_tool_use: u.object({
            web_search_requests: u.number(),
            web_fetch_requests: u.number()
        }).nullable(),
        service_tier: u.enum(["standard", "priority", "batch"]).nullable(),
        cache_creation: u.object({
            ephemeral_1h_input_tokens: u.number(),
            ephemeral_5m_input_tokens: u.number()
        }).nullable()
    })
})
tVY = sVY.extend({
    status: u.literal("completed"),
    prompt: u.string()
})
eVY = u.object({
    status: u.literal("async_launched"),
    agentId: u.string().describe("The ID of the async agent"),
    description: u.string().describe("The description of the task"),
    prompt: u.string().describe("The prompt for the agent"),
    outputFile: u.string().describe("Path to the output file for checking agent progress")
})
ANY = z7(() => u.union([tVY, eVY, Vn7]))  // Vn7 = error type

// READABLE (for understanding):
// Base result schema
const agentResultBase = z.object({
    agentId: z.string(),
    content: z.array(z.object({
        type: z.literal("text"),
        text: z.string()
    })),
    totalToolUseCount: z.number(),
    totalDurationMs: z.number(),
    totalTokens: z.number(),
    usage: z.object({
        input_tokens: z.number(),
        output_tokens: z.number(),
        cache_creation_input_tokens: z.number().nullable(),
        cache_read_input_tokens: z.number().nullable(),
        server_tool_use: z.object({
            web_search_requests: z.number(),
            web_fetch_requests: u.number()
        }).nullable(),
        service_tier: z.enum(["standard", "priority", "batch"]).nullable(),
        cache_creation: z.object({
            ephemeral_1h_input_tokens: z.number(),
            ephemeral_5m_input_tokens: z.number()
        }).nullable()
    })
});

// Completed result
const completedResult = agentResultBase.extend({
    status: z.literal("completed"),
    prompt: z.string()
});

// Background launched result
const asyncLaunchedResult = z.object({
    status: z.literal("async_launched"),
    agentId: z.string().describe("The ID of the async agent"),
    description: z.string().describe("The description of the task"),
    prompt: z.string().describe("The prompt for the agent"),
    outputFile: z.string().describe("Path to the output file for checking agent progress")
});

// Full output schema is union
const agentOutputSchema = z.union([
    completedResult,
    asyncLaunchedResult,
    errorResult
]);

// Mapping: sVY→agentResultBase, tVY→completedResult, eVY→asyncLaunchedResult, ANY→agentOutputSchema
```

---

## 4. Background Execution Flow

### executeBackgroundAgent - Non-blocking agent launch

**What it does:** Creates a background task record, launches the agent loop asynchronously, and returns immediately with a task ID.

```javascript
// ============================================
// executeBackgroundAgent - Background task launch
// Location: chunks.132.mjs:251-314
// ============================================

// READABLE (for understanding):
async function executeBackgroundAgent(executionContext, meta) {
    let { resumeId, description, prompt, selectedAgent, startTime, toolUseContext } = meta;

    // Generate or reuse agent ID
    let agentId = resumeId || generateAgentId();

    // Create async task record with abort controller
    let taskRecord = createAsyncTask({
        agentId: agentId,
        description: description,
        prompt: prompt,
        selectedAgent: selectedAgent,
        setAppState: toolUseContext.setAppState,
        parentAbortController: toolUseContext.abortController
    });

    // Telemetry context
    let telemetryContext = {
        agentId: agentId,
        parentSessionId: getSessionId(),
        agentType: "subagent",
        subagentName: selectedAgent.agentType,
        isBuiltIn: isBuiltInAgent(selectedAgent)
    };

    // Launch in telemetry span (non-blocking)
    withTelemetrySpan(telemetryContext, async () => {
        let progressTracker = createProgressTracker();
        let activityResolver = createActivityDescriptionResolver(toolUseContext.options.tools);
        let cleanupFn;

        try {
            let results = [];

            // Run agent loop
            for await (let message of agentLoopRunner({
                ...executionContext,
                override: {
                    ...executionContext.override,
                    agentId: prefixAgentId(agentId),
                    abortController: taskRecord.abortController
                },
                onCacheSafeParams: executionContext.isAsync ? (params) => {
                    let { stop } = setupBackgroundAbort(agentId, prefixAgentId(agentId), params, toolUseContext.setAppState);
                    cleanupFn = stop;
                } : undefined
            })) {
                results.push(message);
                trackProgress(progressTracker, message, activityResolver, toolUseContext.options.tools);
                updateTaskProgress(agentId, getProgressSnapshot(progressTracker), toolUseContext.setAppState);
            }

            // Cleanup
            cleanupFn?.();

            // Build final result
            let result = buildAgentResult(results, agentId, {
                prompt,
                resolvedAgentModel: executionContext.model,
                isBuiltInAgent: isBuiltInAgent(selectedAgent),
                startTime,
                agentType: selectedAgent.agentType
            });

            // Extract text content for summary
            let textContent = result.content
                .filter(c => c.type === "text")
                .map(c => c.text)
                .join("\n");

            // Mark completed
            markTaskCompleted(result, toolUseContext.setAppState);
            notifyTaskCompletion(agentId, description, "completed", undefined, toolUseContext.setAppState, textContent, {
                totalTokens: result.totalTokens,
                toolUses: result.totalToolUseCount,
                durationMs: result.totalDurationMs
            });

        } catch (error) {
            cleanupFn?.();

            if (error instanceof AbortError) {
                // User killed the task
                if (killTask(agentId, toolUseContext.setAppState)) {
                    notifyTaskCompletion(agentId, description, "killed", undefined, toolUseContext.setAppState);
                }
                return;
            }

            // Mark failed
            let errorMessage = error instanceof Error ? error.message : String(error);
            markTaskFailed(agentId, errorMessage, toolUseContext.setAppState);
            notifyTaskCompletion(agentId, description, "failed", errorMessage, toolUseContext.setAppState);
        }
    });

    // Return immediately with async status
    return {
        data: {
            isAsync: true,
            status: "async_launched",
            agentId: taskRecord.agentId,
            description: description,
            prompt: prompt,
            outputFile: getOutputFilePath(agentId)
        }
    };
}

// Mapping: zd7→createAsyncTask, NR→generateAgentId, dR→agentLoopRunner,
//          xZ→prefixAgentId, yjA→markTaskCompleted, CjA→markTaskFailed,
//          vK1→notifyTaskCompletion, ww→getOutputFilePath, UEA→buildAgentResult
```

---

## 5. Foreground Execution Flow

### executeForegroundAgent - Blocking agent run

**What it does:** Runs the agent loop synchronously, blocking until completion.

```javascript
// ============================================
// executeForegroundAgent - Foreground execution
// Location: chunks.132.mjs:315-450
// ============================================

// READABLE (for understanding):
async function executeForegroundAgent(executionContext, meta) {
    let { resumeId, description, prompt, selectedAgent, startTime, toolUseContext, onProgress } = meta;

    let agentId = resumeId ? prefixAgentId(resumeId) : generateAgentId();

    let telemetryContext = {
        agentId: agentId,
        parentSessionId: getSessionId(),
        agentType: "subagent",
        subagentName: selectedAgent.agentType,
        isBuiltIn: isBuiltInAgent(selectedAgent)
    };

    return withTelemetrySpan(telemetryContext, async () => {
        let results = [];
        let foregroundTask;
        let backgroundSignal;

        // Create foreground task record if not disabled
        if (!BACKGROUND_TASKS_DISABLED) {
            let taskInfo = createForegroundTask({
                agentId: agentId,
                description: description,
                prompt: prompt,
                selectedAgent: selectedAgent,
                setAppState: toolUseContext.setAppState
            });
            foregroundTask = taskInfo.taskId;
            backgroundSignal = taskInfo.backgroundSignal;
        }

        let showBackgroundHint = false;
        let iterator = agentLoopRunner({
            ...executionContext,
            override: {
                ...executionContext.override,
                agentId: agentId
            }
        })[Symbol.asyncIterator]();

        try {
            while (true) {
                let elapsed = Date.now() - startTime;

                // Show "running in background" hint after threshold
                if (!BACKGROUND_TASKS_DISABLED && !showBackgroundHint && elapsed >= BACKGROUND_HINT_THRESHOLD) {
                    showBackgroundHint = true;
                    if (toolUseContext.setToolJSX) {
                        toolUseContext.setToolJSX({
                            jsx: createBackgroundHintComponent(),
                            shouldHidePromptInput: false,
                            shouldContinueAnimation: true,
                            showSpinner: true
                        });
                    }
                }

                // Race between next result and background signal
                let nextPromise = iterator.next();
                let result = backgroundSignal
                    ? await Promise.race([
                        nextPromise.then(r => ({ type: "message", result: r })),
                        backgroundSignal.then(() => ({ type: "background" }))
                    ])
                    : await nextPromise.then(r => ({ type: "message", result: r }));

                // Handle background promotion
                if (result.type === "background" && foregroundTask) {
                    // Promote to background
                    return handleBackgroundPromotion(foregroundTask, results, executionContext, meta);
                }

                if (result.result.done) break;

                results.push(result.result.value);

                // Send progress update
                if (onProgress && results[0]?.type === "user") {
                    onProgress({
                        toolUseID: `agent_${invocationId}`,
                        data: {
                            message: results[0],
                            normalizedMessages: results,
                            type: "agent_progress",
                            prompt,
                            resume: resumeId,
                            agentId
                        }
                    });
                }
            }

            // Build final result
            let agentResult = buildAgentResult(results, agentId, {
                prompt,
                resolvedAgentModel: executionContext.model,
                isBuiltInAgent: isBuiltInAgent(selectedAgent),
                startTime,
                agentType: selectedAgent.agentType
            });

            return {
                data: {
                    status: "completed",
                    prompt,
                    ...agentResult
                }
            };

        } catch (error) {
            throw error;
        }
    });
}

// Mapping: wd7→createForegroundTask, nVY→BACKGROUND_HINT_THRESHOLD
```

---

## 6. Resume Capability

### loadTranscript - Load previous execution

**What it does:** Loads and prepares a transcript from a previous agent execution for resumption.

```javascript
// ============================================
// loadTranscript - Resume transcript loading
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
async function loadTranscript(prefixedAgentId) {
    let transcriptPath = getTranscriptPath(prefixedAgentId);

    if (!await fs.exists(transcriptPath)) {
        return null;
    }

    let rawTranscript = await fs.readFile(transcriptPath, 'utf-8');
    let transcript = JSON.parse(rawTranscript);

    return transcript;
}

function prepareResumeMessages(transcript) {
    // Filter out whitespace-only assistant messages
    let filtered = filterWhitespaceAssistant(
        // Filter out thinking-only assistant messages
        filterThinkingOnlyAssistant(
            // Remove orphaned tool results
            stripOrphanedToolResults(transcript)
        )
    );

    return filtered;
}

// Mapping: sP1→loadTranscript, BQ1→filterWhitespaceAssistant,
//          mQ1→filterThinkingOnlyAssistant, wP6→stripOrphanedToolResults
```

---

## 7. Output File Management

### Background Task Output

**What it does:** Manages the output file for background task progress and results.

```javascript
// ============================================
// Output File Management
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
function getOutputFilePath(agentId) {
    let tasksDir = getTasksDir();
    return path.join(tasksDir, `${agentId}.output`);
}

async function initOutputFile(agentId) {
    let filePath = getOutputFilePath(agentId);
    await fs.writeFile(filePath, '');
    return filePath;
}

async function appendToOutputFile(agentId, content) {
    let filePath = getOutputFilePath(agentId);
    await fs.appendFile(filePath, content);
}

async function readOutputFile(agentId) {
    let filePath = getOutputFilePath(agentId);
    if (await fs.exists(filePath)) {
        return await fs.readFile(filePath, 'utf-8');
    }
    return null;
}

// Mapping: ww→getOutputFilePath, eu1→getTasksDir, hj1→initOutputFile
```

---

## 8. Complete Execution Timeline

### Background Agent Timeline

```
T+0ms    LLM produces tool_use { type: "Task", prompt: "...", subagent_type: "explore", run_in_background: true }
T+0ms    validateInput() begins
T+1ms    Agent type validation (find in activeAgents)
T+1ms    MCP requirements check
T+2ms    Permission check (user approval or auto-allow)
T+?ms    [User approves if needed]
T+?ms    call() begins
T+?ms    generateAgentId() - creates unique ID
T+?ms    createAsyncTask() - creates task record with abort controller
T+?ms    Return immediately: { status: "async_launched", agentId, outputFile }
         (Parent conversation continues)
T+?ms    [Background] agentLoopRunner starts
T+?ms    [Background] LLM calls, tool uses, progress updates
T+?ms    [Background] Output written to file
T+?ms    [Background] Completion: markTaskCompleted()
T+?ms    [Background] notifyTaskCompletion() sent
```

### Foreground Agent Timeline

```
T+0ms    LLM produces tool_use { type: "Task", prompt: "...", subagent_type: "explore" }
T+0ms    validateInput() begins
T+1ms    Agent type validation
T+1ms    Permission check
T+?ms    [User approves if needed]
T+?ms    call() begins
T+?ms    createForegroundTask() - creates task record
T+?ms    agentLoopRunner starts (blocking)
T+?ms    LLM calls, tool uses
T+?ms    Progress updates sent to UI
T+?ms    (User waiting for completion)
T+?ms    Completion: buildAgentResult()
T+?ms    Return: { status: "completed", content, ... }
```

---

## 9. Key Properties

| Property | Foreground | Background |
|----------|------------|------------|
| Blocking | Yes | No |
| Result timing | Immediate return | Poll via TaskOutput |
| Output file | No | Yes |
| Progress tracking | Real-time UI | State-based |
| Abort support | Via parent abort | Via TaskStop |
| Resume support | Yes | Yes |
| Max turns | Configurable | Configurable |

---

## 10. Available Agent Types

Built-in agent types (from system prompt):

| Type | Purpose |
|------|---------|
| `general-purpose` | Default for complex, multi-step tasks |
| `explore` | Fast codebase exploration agent |
| `plan` | Software architect for implementation planning |
| `code-simplifier` | Code cleanup and refinement |
| `claude-code-guide` | Help with Claude Code usage |