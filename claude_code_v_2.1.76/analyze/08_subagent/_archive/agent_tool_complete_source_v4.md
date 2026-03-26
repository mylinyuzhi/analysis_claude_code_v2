# AgentTool Complete Source V4 (Claude Code 2.1.76)

> Complete source-level documentation for the AgentTool (QW6), also known as the Task tool. This is the primary mechanism for spawning subagents in Claude Code.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](./cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `QW6` - AgentTool — `chunks.136.mjs:1512`
- `aVY` - agentInputSchema — `chunks.136.mjs:1444`
- `sVY` - teammateInputSchema — `chunks.136.mjs:1451`
- `eVY` - agentOutputSchema — `chunks.136.mjs:1492`
- `xx8` - getEffectiveInputSchema — `chunks.136.mjs:1461`
- `r4` - TOOL_NAME_AGENT — `chunks.136.mjs:1529`
- `I46` - TOOL_ALIAS_TASK — `chunks.136.mjs:1531`

---

## Overview

AgentTool is the primary mechanism for **parallelism and task decomposition** in Claude Code. When the parent agent determines a task is complex enough to warrant delegation, it invokes this tool to spawn a subagent.

### Key Capabilities

- **Three execution modes**: Synchronous (blocking), Asynchronous (background), Teammate (collaborative)
- **Isolated context**: Each subagent has its own message history, tool permissions, and model selection
- **AsyncLocalStorage identity**: Transparent context propagation without parameter threading
- **Mid-run backgrounding**: Seamless sync→async transition via `Promise.race`
- **Worktree isolation**: Declarative `isolation: "worktree"` support for git worktree-based isolation
- **Per-invocation model override**: `model` parameter can be specified per AgentTool call

---

## Tool Definition

### Complete Tool Object (QW6)

```javascript
// ============================================
// QW6 - AgentTool - Primary subagent spawning tool
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
    async call({...}, J, M, D, X) {...}
}

// READABLE (for understanding):
AgentTool = {
    // Generate tool prompt for LLM
    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        let permissionContext = await getToolPermissionContext();
        let mcpServerNames = [];

        // Collect MCP server names from tools
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }

        // Filter agents by MCP availability
        let filteredAgents = filterAgentsByMcpServers(agents, mcpServerNames);
        let allowedAgents = filterByPermissions(filteredAgents, permissionContext, TOOL_NAME_AGENT);

        return await generateAgentPrompt(allowedAgents, false, allowedAgentTypes);
    },

    name: "Agent",
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],
    maxResultSizeChars: 100000,

    async description() {
        return "Launch a new agent";
    },

    get inputSchema() {
        return getEffectiveInputSchema();
    },

    get outputSchema() {
        return agentOutputSchema();
    },

    async call(params, toolUseContext, ...args) {
        // See detailed call handler below
    }
};

// Mapping: QW6→AgentTool, A→agents, q→tools, K→getToolPermissionContext, Y→allowedAgentTypes, r4→TOOL_NAME_AGENT, I46→TOOL_ALIAS_TASK
```

---

## Input Schemas

### Base Agent Input Schema (aVY)

```javascript
// ============================================
// aVY - agentInputSchema - Base input schema for Agent tool
// Location: chunks.136.mjs:1444-1450
// ============================================

// ORIGINAL (for source lookup):
aVY = F6(() => C.object({
    description: C.string().describe("A short (3-5 word) description of the task"),
    prompt: C.string().describe("The task for the agent to perform"),
    subagent_type: C.string().optional().describe("The type of specialized agent to use for this task"),
    model: C.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override..."),
    resume: C.string().optional().describe("Optional agent ID to resume from..."),
    run_in_background: C.boolean().optional().describe("Set to true to run this agent in the background...")
}))

// READABLE (for understanding):
agentInputSchema = () => z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().optional().describe("The type of specialized agent to use for this task"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional()
        .describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter."),
    resume: z.string().optional()
        .describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
    run_in_background: z.boolean().optional()
        .describe("Set to true to run this agent in the background. You will be notified when it completes.")
});

// Mapping: aVY→agentInputSchema, C→z (zod), F6→schemaFactory
```

### Teammate Input Schema (sVY)

```javascript
// ============================================
// sVY - teammateInputSchema - Extended schema for teammate spawning
// Location: chunks.136.mjs:1451-1460
// ============================================

// ORIGINAL (for source lookup):
sVY = F6(() => {
    let A = C.object({
        name: C.string().optional().describe("Name for the spawned agent..."),
        team_name: C.string().optional().describe("Team name for spawning..."),
        mode: X57().optional().describe('Permission mode for spawned teammate...')
    });
    return aVY().merge(A).extend({
        isolation: C.enum(["worktree"]).optional().describe('Isolation mode...'),
        cwd: C.string().optional().describe('Absolute path to run the agent in...')
    })
})

// READABLE (for understanding):
teammateInputSchema = () => {
    let teammateFields = z.object({
        name: z.string().optional()
            .describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
        team_name: z.string().optional()
            .describe("Team name for spawning. Uses current team context if omitted."),
        mode: permissionModeSchema().optional()
            .describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    });

    return agentInputSchema().merge(teammateFields).extend({
        isolation: z.enum(["worktree"]).optional()
            .describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
        cwd: z.string().optional()
            .describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
    });
};

// Mapping: sVY→teammateInputSchema, aVY→agentInputSchema, X57→permissionModeSchema
```

### Effective Input Schema (xx8)

```javascript
// ============================================
// xx8 - getEffectiveInputSchema - Conditional schema based on context
// Location: chunks.136.mjs:1461-1468
// ============================================

// ORIGINAL (for source lookup):
xx8 = F6(() => {
    let A = sVY().omit({ cwd: !0 });
    return fV1 || sH() ? A.omit({ run_in_background: !0 }) : A
})

// READABLE (for understanding):
getEffectiveInputSchema = () => {
    // Start with teammate schema, omit cwd
    let baseSchema = teammateInputSchema().omit({ cwd: true });

    // If background tasks disabled or in fork mode, omit run_in_background
    if (isBackgroundTasksDisabled() || isInForkMode()) {
        return baseSchema.omit({ run_in_background: true });
    }

    return baseSchema;
};

// Mapping: xx8→getEffectiveInputSchema, sVY→teammateInputSchema, fV1→isBackgroundTasksDisabled, sH→isInForkMode
```

### Key Insight: Schema Omission Logic

The `xx8` function demonstrates conditional schema modification:
1. **Base schema** = teammate schema without `cwd` option
2. **Background disabled?** → Remove `run_in_background` option
3. **Fork mode?** → Remove `run_in_background` (forks must be synchronous)

This prevents the LLM from attempting background operations in contexts where they're not supported.

---

## Output Schema (eVY)

```javascript
// ============================================
// eVY - agentOutputSchema - Output schema for Agent tool
// Location: chunks.136.mjs:1492-1511
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
        outputFile: C.string().describe("Path to the output file..."),
        canReadOutputFile: C.boolean().optional().describe("Whether the calling agent...")
    }),
    K = C.object({
        status: C.literal("queued_to_running"),
        agentId: C.string().describe("The ID of the running agent"),
        prompt: C.string().describe("The prompt that was queued")
    });
    return C.union([A, q, K])
})

// READABLE (for understanding):
agentOutputSchema = () => {
    // Completed result (synchronous execution)
    let completedSchema = agentResultSchema().extend({
        status: z.literal("completed"),
        prompt: z.string()
    });

    // Async launched result (background execution)
    let asyncLaunchedSchema = z.object({
        status: z.literal("async_launched"),
        agentId: z.string().describe("The ID of the async agent"),
        description: z.string().describe("The description of the task"),
        prompt: z.string().describe("The prompt for the agent"),
        outputFile: z.string().describe("Path to the output file for checking agent progress"),
        canReadOutputFile: z.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
    });

    // Queued to running (resumed task)
    let queuedToRunningSchema = z.object({
        status: z.literal("queued_to_running"),
        agentId: z.string().describe("The ID of the running agent"),
        prompt: z.string().describe("The prompt that was queued")
    });

    // Union of all possible output types
    return z.union([completedSchema, asyncLaunchedSchema, queuedToRunningSchema]);
};

// Mapping: eVY→agentOutputSchema, tVY→agentResultSchema, C→z
```

---

## Call Handler

### Complete Call Function

```javascript
// ============================================
// QW6.call - AgentTool call handler
// Location: chunks.136.mjs:1542-1863
// ============================================

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
}, toolUseContext, messagesState, agentDefinitions, callContext) {

    let startTime = Date.now();
    let effectiveModel = isHeadlessMode() ? undefined : model;
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // ========================================
    // PHASE 1: TEAMMATE SPAWNING CHECK
    // ========================================

    // Check if Agent Teams is enabled
    if (team_name && !isAgentTeamsEnabled()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    // Resolve team name from context
    let resolvedTeamName = resolveTeamName({ team_name }, appState);

    // Validate teammate constraints
    if (isTeammateContext() && resolvedTeamName && name) {
        throw Error("Teammates cannot spawn other teammates — the team roster is flat.");
    }

    if (isInProcessEnabled() && resolvedTeamName && run_in_background === true) {
        throw Error("In-process teammates cannot spawn background agents.");
    }

    // If spawning a teammate with name, use teammate spawning path
    if (resolvedTeamName && name) {
        let agentDefinition = subagent_type
            ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
            : undefined;

        if (agentDefinition?.color) {
            setAgentColor(subagent_type, agentDefinition.color);
        }

        let spawnResult = await spawnTeammate({
            name,
            prompt,
            description,
            team_name: resolvedTeamName,
            use_splitpane: true,
            plan_mode_required: mode === "plan",
            model: effectiveModel ?? agentDefinition?.model,
            agent_type: subagent_type
        }, toolUseContext);

        return {
            data: {
                status: "teammate_spawned",
                prompt,
                ...spawnResult.data
            }
        };
    }

    // ========================================
    // PHASE 2: RESUME LOGIC
    // ========================================

    let forkMessages, previousAgentType, worktreePath;

    if (resume) {
        let existingTask = appState.tasks[resume];

        // Check if resuming into a running task
        if (isQueuedTask(existingTask) && !isBlockedTask(existingTask) && existingTask.status === "running") {
            queueAdditionalPrompt(resume, prompt, toolUseContext.setAppStateForTasks);
            return {
                data: {
                    status: "queued_to_running",
                    agentId: resume,
                    prompt
                }
            };
        }

        // Load transcript for resume
        let transcript = await loadTranscript(getAgentDir(resume));
        if (!transcript) {
            throw Error(`No transcript found for agent ID: ${resume}`);
        }

        forkMessages = parseTranscriptMessages(transcript);

        // Get previous agent type
        let metadata = await loadAgentMetadata(getAgentDir(resume));
        if (!subagent_type) {
            previousAgentType = metadata?.agentType;
        }

        // Check worktree path
        worktreePath = metadata?.worktreePath;
        if (worktreePath) {
            try {
                await fs.access(worktreePath);
            } catch (e) {
                if (e.code === "ENOENT" || e.code === "EACCES" || e.code === "EPERM") {
                    log(`Resumed worktree ${worktreePath} no longer exists; falling back to parent cwd`);
                } else {
                    throw e;
                }
            }
        }
    }

    // ========================================
    // PHASE 3: AGENT DEFINITION RESOLUTION
    // ========================================

    let resolvedAgentType = subagent_type ??
        (previousAgentType !== undefined && previousAgentType !== FORK_AGENT_TYPE ? previousAgentType :
            isInForkMode() && !resume ? undefined : DEFAULT_AGENT_TYPE);

    let isImplicitFork = resolvedAgentType === undefined;
    let agentDefinition, isResumingFork = false;

    if (isImplicitFork) {
        // Fork mode - use fork agent definition
        if (toolUseContext.options.querySource === `agent:builtin:${FORK_AGENT_TYPE}` ||
            hasToolUseInMessages(toolUseContext.messages)) {
            throw Error("Fork is not available inside a forked worker.");
        }
        agentDefinition = FORK_AGENT_DEFINITION;
    } else if (previousAgentType === FORK_AGENT_TYPE) {
        agentDefinition = FORK_AGENT_DEFINITION;
        isResumingFork = true;
    } else {
        // Look up agent definition
        let allAgents = toolUseContext.options.agentDefinitions.activeAgents;
        let allowedTypes = toolUseContext.options.agentDefinitions.allowedAgentTypes;

        let visibleAgents = filterByPermissions(
            allowedTypes ? allAgents.filter(a => allowedTypes.includes(a.agentType)) : allAgents,
            appState.toolPermissionContext,
            TOOL_NAME_AGENT
        );

        let found = visibleAgents.find(a => a.agentType === resolvedAgentType);

        if (!found) {
            // Check if agent exists but is denied
            if (allAgents.find(a => a.agentType === resolvedAgentType)) {
                let denialInfo = getDenialInfo(appState.toolPermissionContext, TOOL_NAME_AGENT, resolvedAgentType);
                throw Error(`Agent type '${resolvedAgentType}' has been denied by permission rule '${TOOL_NAME_AGENT}(${resolvedAgentType})' from ${denialInfo?.source ?? "settings"}.`);
            }
            throw Error(`Agent type '${resolvedAgentType}' not found. Available agents: ${visibleAgents.map(a => a.agentType).join(", ")}`);
        }

        agentDefinition = found;
    }

    // ========================================
    // PHASE 4: MCP SERVER REQUIREMENTS CHECK
    // ========================================

    let requiredMcpServers = agentDefinition.requiredMcpServers;

    if (requiredMcpServers?.length) {
        // Check if any required servers are pending
        let hasPending = appState.mcp.clients.some(c =>
            c.type === "pending" &&
            requiredMcpServers.some(s => c.name.toLowerCase().includes(s.toLowerCase()))
        );

        let currentState = appState;

        // Wait up to 30 seconds for pending servers
        if (hasPending) {
            let deadline = Date.now() + 30000;
            while (Date.now() < deadline) {
                await new Promise(r => setTimeout(r, 500));
                currentState = toolUseContext.getAppState();

                // Check if any required server failed
                let hasFailed = currentState.mcp.clients.some(c =>
                    c.type === "failed" &&
                    requiredMcpServers.some(s => c.name.toLowerCase().includes(s.toLowerCase()))
                );
                if (hasFailed) break;

                // Check if no more pending
                let stillPending = currentState.mcp.clients.some(c =>
                    c.type === "pending" &&
                    requiredMcpServers.some(s => c.name.toLowerCase().includes(s.toLowerCase()))
                );
                if (!stillPending) break;
            }
        }

        // Collect available MCP servers from tools
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
        if (!hasAllRequiredServers(agentDefinition, availableServers)) {
            let missing = requiredMcpServers.filter(s =>
                !availableServers.some(a => a.toLowerCase().includes(s.toLowerCase()))
            );
            throw Error(`Agent '${agentDefinition.agentType}' requires MCP servers that are not connected: ${missing.join(", ")}`);
        }
    }

    // ========================================
    // PHASE 5: BACKGROUND AGENT SPAWNING
    // ========================================

    if (run_in_background === true) {
        // ... see detailed background spawning logic in task_lifecycle_complete_source_v7.md
        return await createBackgroundAgentTask({...});
    }

    // ========================================
    // PHASE 6: FOREGROUND AGENT SPAWNING
    // ========================================

    return await createForegroundAgentTask({...});
}
```

---

## Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENTTOOL CALL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

LLM calls Agent tool with parameters
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. VALIDATION PHASE                                                          │
│    • Check Agent Teams availability                                          │
│    • Resolve team name from context                                          │
│    • Validate teammate constraints                                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Teammate?     │      │ Resume?         │      │ New Agent       │
│ (name+team)   │      │ (resume param)  │      │                 │
└───────┬───────┘      └────────┬────────┘      └────────┬────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ spawnTeammate │      │ Load transcript │      │ Resolve agent   │
│ Dispatcher    │      │ Get metadata    │      │ definition      │
└───────────────┘      └────────┬────────┘      └────────┬────────┘
                                │                        │
                                └────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. AGENT DEFINITION RESOLUTION                                               │
│    • Look up agent type from definitions                                     │
│    • Check permission rules                                                  │
│    • Validate MCP server requirements                                        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Background?   │      │ Foreground      │      │ Resume Running? │
│ run_in_bg=true│      │ (default)       │      │ queue prompt    │
└───────┬───────┘      └────────┬────────┘      └────────┬────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Return async  │      │ Run agentLoop   │      │ Return queued   │
│ status        │      │ Runner (qh)     │      │ status          │
└───────────────┘      └─────────────────┘      └─────────────────┘
```

---

## Key Decision Points

### Decision 1: Teammate vs Subagent

```javascript
// Condition for teammate spawning
let isTeammateSpawn = resolvedTeamName && name;

// Why: Teammates require both team context and a name for addressing
// Teammates use mailbox communication and can be messaged via SendMessage
```

### Decision 2: Background vs Foreground

```javascript
// Condition for background execution
let isBackground = run_in_background === true;

// Why: Background agents:
// - Return immediately with async_launched status
// - Run independently without blocking the main conversation
// - Have restricted tool access (no blocking tools)
```

### Decision 3: Resume vs New

```javascript
// Condition for resume
let isResume = resume !== undefined;

// Why: Resume allows:
// - Continuing from previous execution transcript
// - Preserving worktree context
// - Using the same agent type
```

---

## Error Conditions

| Error | Condition | Resolution |
|-------|-----------|------------|
| "Agent Teams is not yet available" | `team_name` provided but feature disabled | Remove team_name or enable feature |
| "Teammates cannot spawn other teammates" | Teammate trying to spawn with name | Remove name parameter |
| "In-process teammates cannot spawn background agents" | In-process teammate with `run_in_background=true` | Set run_in_background=false |
| "No transcript found for agent ID" | Resume with invalid ID | Provide valid agent ID |
| "Agent type not found" | Invalid subagent_type | Use valid agent type |
| "Agent type denied by permission rule" | Permission rule blocks type | Remove rule or use different type |
| "Requires MCP servers that are not connected" | Required MCP server not available | Connect required MCP server |
| "Fork is not available inside a forked worker" | Nested fork attempt | Complete task directly |

---

## Related Documents

- [agent_loop_complete_source_v5.md](./agent_loop_complete_source_v5.md) - Agent loop runner
- [task_lifecycle_complete_source_v7.md](./task_lifecycle_complete_source_v7.md) - Task creation
- [tool_filtering_complete_source_v2.md](./tool_filtering_complete_source_v2.md) - Tool filtering
- [cross_feature_linkages_complete_v9.md](./cross_feature_linkages_complete_v9.md) - Cross-feature integration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All key functions documented with source-level restoration