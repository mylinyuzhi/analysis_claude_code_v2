# AgentTool Complete V2 (Claude Code 2.1.76)

> Complete source-level analysis of the Agent/Task tool (QW6) including input/output schemas, execution modes, and UI integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `QW6` - AgentTool object — `chunks.136.mjs:1512`
- `aVY` - Agent input schema — `chunks.136.mjs:1444`
- `sVY` - Teammate input schema — `chunks.136.mjs:1451`
- `eVY` - Agent output schema — `chunks.136.mjs:1492`
- `xx8` - Get agent input schema — `chunks.136.mjs:1461`
- `r4` - Tool name constant — `chunks.40.mjs:406`

---

## Tool Overview

AgentTool is the primary mechanism for spawning subagents. It supports three execution modes:
1. **Synchronous (blocking)** - Waits for completion
2. **Asynchronous (background)** - Returns immediately, runs in background
3. **Teammate (collaborative)** - Spawns as team member with mailbox communication

---

## Tool Definition (QW6)

```javascript
// ============================================
// QW6 - AgentTool - The "Agent"/"Task" tool object
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
    }, J, M, D, X) { /* ... execution logic ... */ }
}

// READABLE (for understanding):
const AgentTool = {
    // Generate prompt for LLM to understand tool usage
    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
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

        // Filter agents by available MCP servers
        let filteredAgents = filterAgentsByMcpServers(agents, mcpServerNames);
        let permittedAgents = filterByPermissions(filteredAgents, permissionContext, "Agent");

        return await buildAgentSelectionPrompt(permittedAgents, false, allowedAgentTypes);
    },

    name: "Agent",
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],  // I46
    maxResultSizeChars: 100000,

    async description() {
        return "Launch a new agent";
    },

    // Dynamic input schema based on configuration
    get inputSchema() {
        return getAgentInputSchema();
    },

    // Output schema for result validation
    get outputSchema() {
        return agentOutputSchema();
    },

    // Main execution function
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
    }, toolUseContext, ...args) { /* ... */ }
};

// Mapping: QW6→AgentTool, r4→TOOL_NAME_AGENT, I46→TOOL_ALIAS_TASK,
//          xx8→getAgentInputSchema, eVY→agentOutputSchema, jm8→filterByPermissions
```

---

## Input Schemas

### Base Input Schema (aVY)

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
    model: C.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent..."),
    resume: C.string().optional().describe("Optional agent ID to resume from..."),
    run_in_background: C.boolean().optional().describe("Set to true to run this agent in the background...")
}))

// READABLE (for understanding):
const agentInputSchema = z.lazy(() => z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().optional().describe("The type of specialized agent to use for this task"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional()
        .describe("Optional model override. Takes precedence over agent definition's model frontmatter."),
    resume: z.string().optional()
        .describe("Optional agent ID to resume from. If provided, continues from previous transcript."),
    run_in_background: z.boolean().optional()
        .describe("Set to true to run this agent in the background. You will be notified when it completes.")
}));

// Mapping: aVY→agentInputSchema, C→z (zod), F6→z.lazy
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
        name: C.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage..."),
        team_name: C.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
        mode: X57().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    });
    return aVY().merge(A).extend({
        isolation: C.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree...'),
        cwd: C.string().optional().describe('Absolute path to run the agent in...')
    })
})

// READABLE (for understanding):
const teammateInputSchema = z.lazy(() => {
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
            .describe('Absolute path to run the agent in. Overrides the working directory for all filesystem operations. Mutually exclusive with isolation: "worktree".')
    });
});

// Mapping: sVY→teammateInputSchema, aVY→agentInputSchema, X57→permissionModeSchema
```

### Dynamic Input Schema (xx8)

```javascript
// ============================================
// xx8 - getAgentInputSchema - Dynamic schema based on configuration
// Location: chunks.136.mjs:1461-1467
// ============================================

// ORIGINAL (for source lookup):
xx8 = F6(() => {
    let A = sVY().omit({ cwd: !0 });
    return fV1 || sH() ? A.omit({ run_in_background: !0 }) : A
})

// READABLE (for understanding):
const getAgentInputSchema = z.lazy(() => {
    // Start with teammate schema, remove cwd
    let schema = teammateInputSchema().omit({ cwd: true });

    // If background tasks disabled OR in fork mode, remove run_in_background
    if (isBackgroundTasksDisabled() || isInForkMode()) {
        return schema.omit({ run_in_background: true });
    }

    return schema;
});

// Mapping: xx8→getAgentInputSchema, fV1→isBackgroundTasksDisabled, sH→isInForkMode
```

---

## Output Schema (eVY)

```javascript
// ============================================
// eVY - agentOutputSchema - Output schema for Agent tool
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
})

// READABLE (for understanding):
const agentOutputSchema = z.lazy(() => {
    // Case 1: Synchronous completion
    let completedSchema = agentCompletionResultSchema().extend({
        status: z.literal("completed"),
        prompt: z.string()
    });

    // Case 2: Background launch
    let asyncLaunchedSchema = z.object({
        status: z.literal("async_launched"),
        agentId: z.string().describe("The ID of the async agent"),
        description: z.string().describe("The description of the task"),
        prompt: z.string().describe("The prompt for the agent"),
        outputFile: z.string().describe("Path to the output file for checking agent progress"),
        canReadOutputFile: z.boolean().optional()
            .describe("Whether the calling agent has Read/Bash tools to check progress")
    });

    // Case 3: Queued to running (resume scenario)
    let queuedToRunningSchema = z.object({
        status: z.literal("queued_to_running"),
        agentId: z.string().describe("The ID of the running agent"),
        prompt: z.string().describe("The prompt that was queued")
    });

    return z.union([completedSchema, asyncLaunchedSchema, queuedToRunningSchema]);
});

// Mapping: eVY→agentOutputSchema, tVY→agentCompletionResultSchema
```

### Completion Result Schema (tVY)

```javascript
// ============================================
// tVY - agentCompletionResultSchema - Result from completed agent
// Location: chunks.136.mjs:1468-1491
// ============================================

// ORIGINAL (for source lookup):
tVY = F6(() => C.object({
    agentId: C.string(),
    content: C.array(C.object({
        type: C.literal("text"),
        text: C.string()
    })),
    totalToolUseCount: C.number(),
    totalDurationMs: C.number(),
    totalTokens: C.number(),
    usage: C.object({
        input_tokens: C.number(),
        output_tokens: C.number(),
        cache_creation_input_tokens: C.number().nullable(),
        cache_read_input_tokens: C.number().nullable(),
        server_tool_use: C.object({
            web_search_requests: C.number(),
            web_fetch_requests: C.number()
        }).nullable(),
        service_tier: C.enum(["standard", "priority", "batch"]).nullable(),
        cache_creation: C.object({
            ephemeral_1h_input_tokens: C.number(),
            ephemeral_5m_input_tokens: C.number()
        }).nullable()
    })
}))

// READABLE (for understanding):
const agentCompletionResultSchema = z.lazy(() => z.object({
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
            web_fetch_requests: z.number()
        }).nullable(),
        service_tier: z.enum(["standard", "priority", "batch"]).nullable(),
        cache_creation: z.object({
            ephemeral_1h_input_tokens: z.number(),
            ephemeral_5m_input_tokens: z.number()
        }).nullable()
    })
}));

// Mapping: tVY→agentCompletionResultSchema
```

---

## Execution Flow

### Call Function Entry Point

```javascript
// ============================================
// AgentTool.call - Main execution entry point
// Location: chunks.136.mjs:1542-1700+
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
}, toolUseContext, ...args) {

    // Step 1: Determine model override
    let effectiveModel = isNonInteractiveSession() ? undefined : model;
    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // Step 2: Check team mode availability
    if (team_name && !isTeamModeAvailable()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    // Step 3: Resolve team name
    let resolvedTeamName = resolveTeamName({ team_name }, appState);

    // Step 4: Validate teammate spawning rules
    if (isInProcessTeammate() && resolvedTeamName && name) {
        throw Error("Teammates cannot spawn other teammates — the team roster is flat.");
    }

    if (isInProcessTeammate() && resolvedTeamName && run_in_background === true) {
        throw Error("In-process teammates cannot spawn background agents.");
    }

    // Step 5: Handle teammate spawning
    if (resolvedTeamName && name) {
        let agentDef = subagent_type
            ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
            : undefined;

        if (agentDef?.color) {
            registerAgentColor(subagent_type, agentDef.color);
        }

        let result = await spawnTeammate({
            name,
            prompt,
            description,
            team_name: resolvedTeamName,
            use_splitpane: true,
            plan_mode_required: mode === "plan",
            model: effectiveModel ?? agentDef?.model,
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

    // Step 6: Handle resume scenario
    if (resume) {
        let existingTask = appState.tasks[resume];

        // Check if task is running and can accept more messages
        if (isValidRunningTask(existingTask) && existingTask.status === "running") {
            queueMessageForTask(resume, prompt, toolUseContext.setAppStateForTasks);
            return {
                data: {
                    status: "queued_to_running",
                    agentId: resume,
                    prompt
                }
            };
        }

        // Load transcript for resume
        let transcript = await loadTranscript(getTranscriptPath(resume));
        if (!transcript) {
            throw Error(`No transcript found for agent ID: ${resume}`);
        }

        // ... continue with resume logic
    }

    // Step 7: Resolve agent definition
    let agentType = subagent_type ?? determineDefaultAgentType();
    let isFork = agentType === undefined;
    let selectedAgent;

    if (isFork) {
        // Fork uses parent's context
        if (isInsideForkWorker(toolUseContext)) {
            throw Error("Fork is not available inside a forked worker.");
        }
        selectedAgent = FORK_AGENT_DEFINITION;
    } else {
        // Find agent definition
        let availableAgents = filterByPermissions(
            toolUseContext.options.agentDefinitions.activeAgents,
            appState.toolPermissionContext,
            "Agent"
        );

        selectedAgent = availableAgents.find(a => a.agentType === agentType);

        if (!selectedAgent) {
            throw Error(`Agent type '${agentType}' not found.`);
        }
    }

    // Step 8: Check required MCP servers
    if (selectedAgent.requiredMcpServers?.length) {
        // Wait for MCP servers to connect
        await waitForMcpServers(selectedAgent.requiredMcpServers, toolUseContext);
    }

    // Step 9: Send telemetry
    sendTelemetry("tengu_agent_tool_selected", {
        agent_type: selectedAgent.agentType,
        model: effectiveModel,
        source: selectedAgent.source,
        color: selectedAgent.color,
        is_built_in_agent: isBuiltInAgent(selectedAgent),
        is_resume: !!resume,
        is_async: run_in_background === true || selectedAgent.background === true,
        is_fork: isFork
    });

    // Step 10: Execute agent
    // ... continues with agent execution
}
```

---

## UI Integration

### Status Display Components

**When subagent is running:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Use: Agent                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ ├─ [Explore] Search codebase for task ID patterns                   │
│ │   Tools: 12  Tokens: 4,521  Status: ◐ running                     │
│ └─ Description: "Search codebase"                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**When subagent completes:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Use: Agent ✓ completed                                         │
├─────────────────────────────────────────────────────────────────────┤
│ Result: Found 15 uses of generateTaskId across 8 files...           │
│ Duration: 12.3s  Tokens: 4,521                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` once | Show kill confirmation | Agent running |
| `Ctrl+F` confirm | Kill all running agents | After Ctrl+C |
| `x` in modal | Kill selected task | Task list modal |

---

## Design Rationale

### Why Three Execution Modes?

1. **Synchronous** - For quick tasks requiring immediate results
2. **Background** - For long-running tasks that shouldn't block
3. **Teammate** - For collaborative multi-agent work

### Why Dynamic Input Schema?

- Background mode may be disabled by environment variable
- Fork mode has different constraints
- Team mode adds additional parameters

### Why Union Output Schema?

- Different execution paths produce different results
- Type-safe handling of each scenario
- Clear contract for callers

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `QW6` | AgentTool | chunks.136.mjs:1512 | ✓ Verified |
| `aVY` | agentInputSchema | chunks.136.mjs:1444 | ✓ Verified |
| `sVY` | teammateInputSchema | chunks.136.mjs:1451 | ✓ Verified |
| `eVY` | agentOutputSchema | chunks.136.mjs:1492 | ✓ Verified |
| `tVY` | agentCompletionResultSchema | chunks.136.mjs:1468 | ✓ Verified |
| `xx8` | getAgentInputSchema | chunks.136.mjs:1461 | ✓ Verified |
| `r4` | TOOL_NAME_AGENT | chunks.40.mjs:406 | ✓ Verified |

---

## Related Documents

- [cross_validation_report_v3.md](./cross_validation_report_v3.md) - Symbol verification
- [agent_loop_complete_source_v4.md](./agent_loop_complete_source_v4.md) - Agent loop execution
- [teammate_execution_complete_source_v3.md](./teammate_execution_complete_source_v3.md) - Teammate spawning
- [../26_background_agents/task_lifecycle_complete_v5.md](../26_background_agents/task_lifecycle_complete_v5.md) - Task lifecycle