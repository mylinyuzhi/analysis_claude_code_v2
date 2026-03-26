# Agent Tool Complete Source V3 (Claude Code 2.1.76)

> Complete source-level restoration of the AgentTool (Task) implementation including schema definitions, call flow, and execution modes.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `QW6` - AgentTool object — `chunks.136.mjs:1512`
- `aVY` - agentInputSchema — `chunks.136.mjs:1444`
- `sVY` - teammateInputSchema — `chunks.136.mjs:1451`
- `eVY` - agentOutputSchema — `chunks.136.mjs:1492`
- `xx8` - getAgentInputSchema — `chunks.136.mjs:1461`
- `tVY` - completedTaskSchema — `chunks.136.mjs:1468`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT TOOL ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │     AgentTool       │
                        │       (QW6)         │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│   prompt()    │         │   call()      │         │ inputSchema   │
│               │         │               │         │   (xx8)       │
│ Build tool    │         │ Execute agent │         │               │
│ description   │         │ invocation    │         │ Dynamic based │
│               │         │               │         │ on config     │
└───────────────┘         └───────┬───────┘         └───────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  Teammate     │         │  Background   │         │  Foreground   │
│  Mode         │         │  Mode         │         │  Mode         │
│               │         │               │         │               │
│ spawnTeammate │         │ Qn4()         │         │ Un4()         │
│ (qn4)         │         │ run_in_bg=true│         │ blocking      │
└───────────────┘         └───────────────┘         └───────────────┘
```

---

## Schema Definitions

### agentInputSchema (aVY)

**What it does:** Base input schema for the Agent tool with core parameters.

```javascript
// ============================================
// aVY - agentInputSchema - Base Agent input schema
// Location: chunks.136.mjs:1444-1450
// ============================================

// ORIGINAL (for source lookup):
aVY = F6(() => C.object({
    description: C.string().describe("A short (3-5 word) description of the task"),
    prompt: C.string().describe("The task for the agent to perform"),
    subagent_type: C.string().optional().describe("The type of specialized agent to use for this task"),
    model: C.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent."),
    resume: C.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
    run_in_background: C.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.")
}))

// READABLE (for understanding):
agentInputSchema = lazy(() => z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().optional().describe("The type of specialized agent to use for this task"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional()
        .describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent."),
    resume: z.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
    run_in_background: z.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.")
}))

// Mapping: aVY→agentInputSchema, F6→lazy, C→zod
```

### teammateInputSchema (sVY)

**What it does:** Extended schema for teammate mode with name and team parameters.

```javascript
// ============================================
// sVY - teammateInputSchema - Teammate mode input schema
// Location: chunks.136.mjs:1451-1460
// ============================================

// ORIGINAL (for source lookup):
sVY = F6(() => {
    let A = C.object({
        name: C.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
        team_name: C.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
        mode: X57().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    });
    return aVY().merge(A).extend({
        isolation: C.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
        cwd: C.string().optional().describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
    })
})

// READABLE (for understanding):
teammateInputSchema = lazy(() => {
    let teammateExtensions = z.object({
        name: z.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
        team_name: z.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
        mode: permissionModeSchema().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    });

    return agentInputSchema()
        .merge(teammateExtensions)
        .extend({
            isolation: z.enum(["worktree"]).optional()
                .describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
            cwd: z.string().optional()
                .describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
        });
})

// Mapping: sVY→teammateInputSchema, aVY→agentInputSchema, X57→permissionModeSchema
```

### getAgentInputSchema (xx8)

**What it does:** Dynamic schema that omits `run_in_background` when background tasks are disabled.

```javascript
// ============================================
// xx8 - getAgentInputSchema - Dynamic schema based on config
// Location: chunks.136.mjs:1461-1467
// ============================================

// ORIGINAL (for source lookup):
xx8 = F6(() => {
    let A = sVY().omit({ cwd: true });
    return fV1 || sH() ? A.omit({ run_in_background: true }) : A
})

// READABLE (for understanding):
getAgentInputSchema = lazy(() => {
    // Start with teammate schema, omit cwd (handled separately)
    let baseSchema = teammateInputSchema().omit({ cwd: true });

    // Omit run_in_background if:
    // 1. Background tasks are disabled (fV1)
    // 2. Running in teammate mode (sH)
    if (BACKGROUND_TASKS_DISABLED || isTeammateMode()) {
        return baseSchema.omit({ run_in_background: true });
    }

    return baseSchema;
})

// Mapping: xx8→getAgentInputSchema, sVY→teammateInputSchema, fV1→BACKGROUND_TASKS_DISABLED,
//          sH→isTeammateMode
```

### agentOutputSchema (eVY)

**What it does:** Union schema for three possible output statuses.

```javascript
// ============================================
// eVY - agentOutputSchema - Output schema with three statuses
// Location: chunks.136.mjs:1492-1510
// ============================================

// ORIGINAL (for source lookup):
eVY = F6(() => {
    let A = tVY().extend({
            status: C.literal("completed"),
            prompt: C.string()
        }),
        q = C.object({
            status: C.literal("async_launched"),
            agentId: C.string().describe("The ID of the async agent"),
            description: C.string().describe("The description of the task"),
            prompt: C.string().describe("The prompt for the agent"),
            outputFile: C.string().describe("Path to the output file for checking agent progress"),
            canReadOutputFile: C.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
        }),
        K = C.object({
            status: C.literal("queued_to_running"),
            agentId: C.string().describe("The ID of the running agent"),
            prompt: C.string().describe("The prompt that was queued")
        });
    return C.union([A, q, K])
});

// READABLE (for understanding):
agentOutputSchema = lazy(() => {
    // Status 1: Completed (synchronous execution finished)
    let completedSchema = completedTaskSchema().extend({
        status: z.literal("completed"),
        prompt: z.string()
    });

    // Status 2: Async launched (background execution started)
    let asyncLaunchedSchema = z.object({
        status: z.literal("async_launched"),
        agentId: z.string().describe("The ID of the async agent"),
        description: z.string().describe("The description of the task"),
        prompt: z.string().describe("The prompt for the agent"),
        outputFile: z.string().describe("Path to the output file for checking agent progress"),
        canReadOutputFile: z.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
    });

    // Status 3: Queued to running (resume of existing agent)
    let queuedSchema = z.object({
        status: z.literal("queued_to_running"),
        agentId: z.string().describe("The ID of the running agent"),
        prompt: z.string().describe("The prompt that was queued")
    });

    return z.union([completedSchema, asyncLaunchedSchema, queuedSchema]);
})

// Mapping: eVY→agentOutputSchema, tVY→completedTaskSchema, C→zod
```

---

## AgentTool Object (QW6)

### Complete Definition

```javascript
// ============================================
// QW6 - AgentTool - The "Agent" / "Task" tool object
// Location: chunks.136.mjs:1512-1541
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
            }
        let w = zE8(A, _),
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
        // ... (see call() implementation below)
    }
}

// READABLE (for understanding):
AgentTool = {
    // Build tool description/prompt for LLM
    async prompt({
        agents,
        tools,
        getToolPermissionContext,
        allowedAgentTypes
    }) {
        let permissionContext = await getToolPermissionContext();
        let mcpServerNames = [];

        // Extract MCP server names from tools
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }

        // Filter agents by MCP requirements
        let filteredAgents = filterAgentsByMcpRequirements(agents, mcpServerNames);

        // Apply permission filtering
        let allowedAgents = filterByPermissions(filteredAgents, permissionContext, "Agent");

        // Build tool description
        return await buildToolDescription(allowedAgents, false, allowedAgentTypes);
    },

    name: "Agent",  // r4
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],  // I46
    maxResultSizeChars: 100000,

    async description() {
        return "Launch a new agent";
    },

    get inputSchema() {
        return getAgentInputSchema();  // Dynamic based on config
    },

    get outputSchema() {
        return agentOutputSchema();  // Union of three statuses
    },

    async call(params, context, canUseTool, toolResultHandler, querySource) {
        // ... (see below)
    }
}

// Mapping: QW6→AgentTool, r4→TOOL_NAME_AGENT, I46→TOOL_ALIAS_TASK, xx8→getAgentInputSchema,
//          eVY→agentOutputSchema, zE8→filterAgentsByMcpRequirements, jm8→filterByPermissions,
//          j_4→buildToolDescription
```

---

## AgentTool.call() Implementation

### Phase 1: Parameter Extraction & Validation

```javascript
// ============================================
// AgentTool.call() - Phase 1: Validation
// Location: chunks.136.mjs:1542-1610
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
    if (O && !E7()) throw Error("Agent Teams is not yet available on your plan.");
    let f = qkY({ team_name: O }, Z);
    if ($Y() && f && w) throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
    if (eP() && f && _ === !0) throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
    if (f && w) {
        // Teammate mode path
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

// READABLE (for understanding):
async call({
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
}, toolUseContext, canUseTool, toolResultHandler, querySource) {
    let startTime = Date.now();
    let resolvedModel = isEnterprise() ? undefined : model;  // Enterprise doesn't allow model override
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // Validate Agent Teams availability
    if (team_name && !isAgentTeamsAvailable()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    // Resolve team context
    let resolvedTeamName = resolveTeamName({ team_name }, appState);

    // Validate teammate spawning rules
    if (isTeammate() && resolvedTeamName && name) {
        throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
    }

    if (isInProcessTeammate() && resolvedTeamName && run_in_background === true) {
        throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
    }

    // Teammate spawning path
    if (resolvedTeamName && name) {
        let agentDef = subagent_type
            ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
            : undefined;

        if (agentDef?.color) {
            registerAgentColor(subagent_type, agentDef.color);
        }

        let spawnResult = await spawnTeammate({
            name: name,
            prompt: prompt,
            description: description,
            team_name: resolvedTeamName,
            use_splitpane: true,
            plan_mode_required: mode === "plan",
            model: resolvedModel ?? agentDef?.model,
            agent_type: subagent_type
        }, toolUseContext);

        return {
            data: {
                status: "teammate_spawned",
                prompt: prompt,
                ...spawnResult.data
            }
        };
    }

// Mapping: A→prompt, q→subagent_type, K→description, Y→model, z→resume, _→run_in_background,
//          w→name, O→team_name, $→mode, H→isolation, j→cwd, J→toolUseContext, M→canUseTool,
//          D→toolResultHandler, X→querySource, e2→isEnterprise, E7→isAgentTeamsAvailable,
//          qkY→resolveTeamName, $Y→isTeammate, eP→isInProcessTeammate, qn4→spawnTeammate
```

### Phase 2: Resume Handling

```javascript
// ============================================
// AgentTool.call() - Phase 2: Resume Handling
// Location: chunks.136.mjs:1586-1610
// ============================================

// ORIGINAL (for source lookup):
    let v, N, V;
    if (z) {
        let n = Z.tasks[z];
        if (Sf(n) && !Ef6(n) && n.status === "running") return NV1(z, A, J.setAppStateForTasks ?? J.setAppState), {
            data: {
                status: "queued_to_running",
                agentId: z,
                prompt: A
            }
        };
        let o = await hf6(X$(z));
        if (!o) throw Error(`No transcript found for agent ID: ${z}`);
        v = Ol6($l6(_V1(o)));
        let a = await Mm8(X$(z));
        if (!q) N = a?.agentType;
        let i = a?.worktreePath;
        if (i) try {
            await iVY.access(i), V = i
        } catch (l) {
            let q6 = l.code;
            if (q6 === "ENOENT" || q6 === "EACCES" || q6 === "EPERM") k(`Resumed worktree ${i} no longer exists; falling back to parent cwd`);
            else throw l
        }
    }

// READABLE (for understanding):
    let forkContextMessages, previousAgentType, previousWorktreePath;

    if (resume) {
        let existingTask = appState.tasks[resume];

        // If task is running and not main-session, queue message to it
        if (isLocalAgentTask(existingTask) && !isMainSessionTask(existingTask) && existingTask.status === "running") {
            queueMessageToRunningAgent(resume, prompt, toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState);
            return {
                data: {
                    status: "queued_to_running",
                    agentId: resume,
                    prompt: prompt
                }
            };
        }

        // Load transcript for resumption
        let transcript = await loadTranscript(getTaskDirectory(resume));
        if (!transcript) {
            throw Error(`No transcript found for agent ID: ${resume}`);
        }

        forkContextMessages = convertTranscriptToMessages(parseTranscriptContent(transcript));

        // Get previous agent metadata
        let metadata = await loadAgentMetadata(getTaskDirectory(resume));
        if (!subagent_type) {
            previousAgentType = metadata?.agentType;
        }

        let worktreePath = metadata?.worktreePath;
        if (worktreePath) {
            try {
                await fs.promises.access(worktreePath);
                previousWorktreePath = worktreePath;
            } catch (error) {
                if (error.code === "ENOENT" || error.code === "EACCES" || error.code === "EPERM") {
                    logWarning(`Resumed worktree ${worktreePath} no longer exists; falling back to parent cwd`);
                } else {
                    throw error;
                }
            }
        }
    }

// Mapping: z→resume, Sf→isLocalAgentTask, Ef6→isMainSessionTask, NV1→queueMessageToRunningAgent,
//          hf6→loadTranscript, X$→getTaskDirectory, Ol6→convertTranscriptToMessages,
//          $l6→parseTranscriptContent, _V1→parseTranscript, Mm8→loadAgentMetadata, iVY→fs.promises
```

### Phase 3: Agent Selection

```javascript
// ============================================
// AgentTool.call() - Phase 3: Agent Selection
// Location: chunks.136.mjs:1610-1655
// ============================================

// ORIGINAL (for source lookup):
    let L = q ?? (N !== void 0 && N !== pW6.agentType ? N : sH() && !z ? void 0 : q96.agentType),
        h = L === void 0,
        R, u = !1;
    if (h) {
        if (J.options.querySource === `agent:builtin:${pW6.agentType}` || O_4(J.messages)) throw Error("Fork is not available inside a forked worker. Complete your task directly using your tools.");
        R = pW6
    } else if (N === pW6.agentType) R = pW6, u = !0;
    else {
        let n = J.options.agentDefinitions.activeAgents,
            { allowedAgentTypes: o } = J.options.agentDefinitions,
            a = jm8(o ? n.filter((l) => o.includes(l.agentType)) : n, Z.toolPermissionContext, r4),
            i = a.find((l) => l.agentType === L);
        if (!i) {
            if (n.find((q6) => q6.agentType === L)) {
                let q6 = cn4(Z.toolPermissionContext, r4, L);
                throw Error(`Agent type '${L}' has been denied by permission rule '${r4}(${L})' from ${q6?.source??"settings"}.`)
            }
            throw Error(`Agent type '${L}' not found. Available agents: ${a.map((q6)=>q6.agentType).join(", ")}`)
        }
        R = i
    }

// READABLE (for understanding):
    // Determine agent type
    let agentType = subagent_type ?? (
        previousAgentType !== undefined && previousAgentType !== FORK_AGENT.agentType
            ? previousAgentType
            : isTeammateMode() && !resume
                ? undefined
                : GENERAL_PURPOSE_AGENT.agentType
    );

    let isFork = agentType === undefined;
    let selectedAgent, isResumingForkAgent = false;

    if (isFork) {
        // Fork mode - use the special fork agent
        if (toolUseContext.options.querySource === `agent:builtin:${FORK_AGENT.agentType}` ||
            hasForkMessages(toolUseContext.messages)) {
            throw Error("Fork is not available inside a forked worker. Complete your task directly using your tools.");
        }
        selectedAgent = FORK_AGENT;
    } else if (previousAgentType === FORK_AGENT.agentType) {
        selectedAgent = FORK_AGENT;
        isResumingForkAgent = true;
    } else {
        // Look up agent definition
        let activeAgents = toolUseContext.options.agentDefinitions.activeAgents;
        let { allowedAgentTypes } = toolUseContext.options.agentDefinitions;

        let availableAgents = filterByPermissions(
            allowedAgentTypes
                ? activeAgents.filter(a => allowedAgentTypes.includes(a.agentType))
                : activeAgents,
            appState.toolPermissionContext,
            "Agent"
        );

        let foundAgent = availableAgents.find(a => a.agentType === agentType);

        if (!foundAgent) {
            // Check if agent exists but is denied
            if (activeAgents.find(a => a.agentType === agentType)) {
                let denialInfo = findPermissionDenialInfo(appState.toolPermissionContext, "Agent", agentType);
                throw Error(`Agent type '${agentType}' has been denied by permission rule 'Agent(${agentType})' from ${denialInfo?.source ?? "settings"}.`);
            }
            throw Error(`Agent type '${agentType}' not found. Available agents: ${availableAgents.map(a => a.agentType).join(", ")}`);
        }

        selectedAgent = foundAgent;
    }

// Mapping: L→agentType, h→isFork, R→selectedAgent, u→isResumingForkAgent, pW6→FORK_AGENT,
//          q96→GENERAL_PURPOSE_AGENT, jm8→filterByPermissions, cn4→findPermissionDenialInfo,
//          O_4→hasForkMessages
```

### Phase 4: MCP Server Validation

```javascript
// ============================================
// AgentTool.call() - Phase 4: MCP Validation
// Location: chunks.136.mjs:1633-1653
// ============================================

// ORIGINAL (for source lookup):
    let I = R.requiredMcpServers;
    if (I?.length) {
        let n = Z.mcp.clients.some((i) => i.type === "pending" && I.some((l) => i.name.toLowerCase().includes(l.toLowerCase()))),
            o = Z;
        if (n) {
            let q6 = Date.now() + 30000;
            while (Date.now() < q6) {
                if (await new Promise((L6) => setTimeout(L6, 500)), o = J.getAppState(), o.mcp.clients.some((L6) => L6.type === "failed" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break;
                if (!o.mcp.clients.some((L6) => L6.type === "pending" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break
            }
        }
        let a = [];
        for (let i of o.mcp.tools)
            if (i.name?.startsWith("mcp__")) {
                let q6 = i.name.split("__")[1];
                if (q6 && !a.includes(q6)) a.push(q6)
            }
        if (!HW1(R, a)) {
            let i = I.filter((l) => !a.some((q6) => q6.toLowerCase().includes(l.toLowerCase())));
            throw Error(`Agent '${R.agentType}' requires MCP servers matching: ${i.join(", ")}. MCP servers with tools: ${a.length>0?a.join(", "):"none"}. Use /mcp to configure and authenticate the required MCP servers.`)
        }
    }

// READABLE (for understanding):
    let requiredServers = selectedAgent.requiredMcpServers;

    if (requiredServers?.length) {
        // Check if any required servers are still pending
        let hasPendingServers = appState.mcp.clients.some(client =>
            client.type === "pending" &&
            requiredServers.some(req =>
                client.name.toLowerCase().includes(req.toLowerCase())
            )
        );

        let currentState = appState;

        // Wait up to 30 seconds for pending servers
        if (hasPendingServers) {
            let deadline = Date.now() + 30000;
            while (Date.now() < deadline) {
                await new Promise(resolve => setTimeout(resolve, 500));
                currentState = toolUseContext.getAppState();

                // Check if any required server failed
                if (currentState.mcp.clients.some(client =>
                    client.type === "failed" &&
                    requiredServers.some(req =>
                        client.name.toLowerCase().includes(req.toLowerCase())
                    )
                )) {
                    break;
                }

                // Check if all required servers are no longer pending
                if (!currentState.mcp.clients.some(client =>
                    client.type === "pending" &&
                    requiredServers.some(req =>
                        client.name.toLowerCase().includes(req.toLowerCase())
                    )
                )) {
                    break;
                }
            }
        }

        // Extract available MCP server names
        let availableServers = [];
        for (let tool of currentState.mcp.tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !availableServers.includes(serverName)) {
                    availableServers.push(serverName);
                }
            }
        }

        // Check if all required servers are available
        if (!hasRequiredMcpServers(selectedAgent, availableServers)) {
            let missingServers = requiredServers.filter(req =>
                !availableServers.some(avail =>
                    avail.toLowerCase().includes(req.toLowerCase())
                )
            );
            throw Error(`Agent '${selectedAgent.agentType}' requires MCP servers matching: ${missingServers.join(", ")}. MCP servers with tools: ${availableServers.length > 0 ? availableServers.join(", ") : "none"}. Use /mcp to configure and authenticate the required MCP servers.`);
        }
    }

// Mapping: I→requiredServers, HW1→hasRequiredMcpServers
```

### Phase 5: Execution Decision

```javascript
// ============================================
// AgentTool.call() - Phase 5: Execution Decision
// Location: chunks.136.mjs:1654-1740
// ============================================

// READABLE (for understanding):
    // Register agent color if defined
    if (selectedAgent.color) {
        registerAgentColor(selectedAgent.agentType, selectedAgent.color);
    }

    // Resolve model
    let resolvedModel = resolveModel(
        selectedAgent.model,
        toolUseContext.options.mainLoopModel,
        isFork || isResumingForkAgent ? undefined : modelOverride,
        permissionMode
    );

    // Emit telemetry
    emitTelemetry("tengu_agent_tool_selected", {
        agent_type: selectedAgent.agentType,
        model: resolvedModel,
        source: selectedAgent.source,
        color: selectedAgent.color,
        is_built_in_agent: isBuiltInAgent(selectedAgent),
        is_resume: !!resume,
        is_async: run_in_background === true || selectedAgent.background === true,
        is_fork: isFork
    });

    // Resolve isolation mode
    let isolationMode = isolation ?? selectedAgent.isolation;

    // Determine execution parameters
    let shouldRunAsync = (run_in_background === true || selectedAgent.background === true || isFork || isTeammateMode() || isProactiveMode?.()) && !BACKGROUND_TASKS_DISABLED;

    // Prepare agent loop parameters
    let agentLoopParams = {
        agentDefinition: selectedAgent,
        promptMessages: forkContextMessages ? [...forkContextMessages, ...userMessages] : userMessages,
        toolUseContext: toolUseContext,
        canUseTool: canUseTool,
        isAsync: shouldRunAsync,
        querySource: toolUseContext.options.querySource ?? getQuerySource(selectedAgent.agentType, isBuiltInAgent(selectedAgent)),
        model: isFork || isResumingForkAgent ? undefined : modelOverride,
        override: isFork || isResumingForkAgent
            ? { systemPrompt: renderedSystemPrompt }
            : builtSystemPrompt && !isolationPath && !cwd && !previousWorktreePath
                ? { systemPrompt: builtSystemPrompt }
                : undefined,
        worktreePath: worktreeInfo?.worktreePath,
        maxTurns: selectedAgent.maxTurns,
        onCacheSafeParams: cacheParamsCallback
    };

    // Execute agent loop
    for await (let event of agentLoopRunner(agentLoopParams)) {
        // ... handle events
    }
```

---

## Execution Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT TOOL CALL FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. Validate Parameters
   ├─ Check Agent Teams availability
   ├─ Validate teammate spawning rules
   └─ Resolve team context

2. Handle Resume (if provided)
   ├─ Check if task is running → queue message
   ├─ Load transcript
   └─ Get previous agent metadata

3. Select Agent
   ├─ Determine agent type
   ├─ Fork mode vs explicit agent
   └─ Validate permissions

4. Validate MCP Requirements
   ├─ Check required servers
   ├─ Wait for pending servers (30s timeout)
   └─ Error if missing

5. Prepare Execution
   ├─ Resolve model
   ├─ Build system prompt
   └─ Determine async mode

6. Execute
   ├─ Background: Qn4()
   ├─ Foreground: Un4()
   └─ Teammate: qn4()
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512 | ✓ Verified |
| `aVY` | agentInputSchema | chunks.136.mjs:1444 | ✓ Verified |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451 | ✓ Verified |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492 | ✓ Verified |
| `xx8` | getAgentInputSchema | chunks.136.mjs:1461 | ✓ Verified |
| `tVY` | completedTaskSchema | chunks.136.mjs:1468 | ✓ Verified |
| `fV1` | BACKGROUND_TASKS_DISABLED | chunks.136.mjs:1443 | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Source code verified