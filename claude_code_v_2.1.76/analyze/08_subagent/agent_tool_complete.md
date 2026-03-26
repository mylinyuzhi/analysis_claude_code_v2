# AgentTool Complete Analysis (Claude Code 2.1.76)

> Source-level analysis of the AgentTool (QW6) - the Task/Agent tool entry point
> for spawning subagents with synchronous, asynchronous, and teammate execution modes.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `AgentTool` (QW6) - The Agent/Task tool object — `chunks.136.mjs:1512`
- `spawnTeammate` (qn4) - Spawn teammate agent — `chunks.135.mjs:1116`
- `spawnTeammateDispatcher` (pNY) - Route teammate spawn — `chunks.135.mjs:1110`
- `TOOL_NAME_AGENT` (r4) - Tool name constant "Agent" — `chunks.40.mjs:406`
- `TOOL_NAME_TASK` (I46) - Tool name constant "Task" — `chunks.40.mjs:408`

---

## Overview

The AgentTool is Claude Code's primary mechanism for **task delegation and parallelism**. It allows the main agent to spawn subagents for complex tasks, enabling:

1. **Synchronous execution** - Block until subagent completes
2. **Background execution** - Run asynchronously, notify on completion
3. **Teammate spawning** - Collaborative multi-agent teams

---

## Tool Definition (QW6)

### Source Code

```javascript
// ============================================
// QW6 - AgentTool - The Agent/Task tool object
// Location: chunks.136.mjs:1512-1612
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
        // ... implementation
    }
}

// READABLE (for understanding):
AgentTool = {
    // Generate prompt for tool selection UI
    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        let permissionContext = await getToolPermissionContext();
        let mcpServerNames = [];

        // Collect MCP server names for tool filtering
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }

        // Build agent options and filter by permissions
        let agentOptions = buildAgentOptions(agents, mcpServerNames);
        let filteredOptions = filterToolsByPermission(agentOptions, permissionContext, TOOL_NAME_AGENT);

        // Return formatted prompt for tool selection
        return await formatAgentPrompt(filteredOptions, false, allowedAgentTypes);
    },

    // Tool metadata
    name: "Agent",
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],
    maxResultSizeChars: 100000,

    async description() {
        return "Launch a new agent";
    },

    // Schema getters
    get inputSchema() {
        return getAgentInputSchema();
    },
    get outputSchema() {
        return getAgentOutputSchema();
    },

    // Main call implementation
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
    }, toolUseContext, agentDefinitions, options, querySource) {
        // ... see call() implementation below
    }
};

// Mapping: QW6→AgentTool, r4→TOOL_NAME_AGENT, I46→TOOL_NAME_TASK,
// zE8→buildAgentOptions, jm8→filterToolsByPermission, j_4→formatAgentPrompt,
// xx8→getAgentInputSchema, eVY→getAgentOutputSchema
```

---

## Input Schema

### Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | The task for the agent to accomplish |
| `description` | string | Yes | Short 3-5 word description for UI display |
| `subagent_type` | enum | No | Agent type: "general-purpose", "Explore", "Plan", "statusline-setup" |
| `model` | enum | No | Model override: "sonnet", "opus", "haiku" |
| `run_in_background` | boolean | No | Set true for asynchronous execution |
| `resume` | string | No | Agent ID to resume from previous transcript |
| `name` | string | No | Teammate agent name (for team mode) |
| `team_name` | string | No | Team name (for teammate mode) |
| `mode` | string | No | Execution mode: "plan" for plan-mode required |
| `isolation` | enum | No | Isolation mode: "none", "worktree" |
| `cwd` | string | No | Working directory override |

### Schema Source

```javascript
// ============================================
// getAgentInputSchema (xx8) - Input schema definition
// Location: chunks.136.mjs (inferred)
// ============================================

// READABLE (for understanding):
function getAgentInputSchema() {
    return z.object({
        // Core parameters
        description: z.string()
            .describe("A short (3-5 word) description of what the agent will do"),

        prompt: z.string()
            .describe("The task for the agent to accomplish"),

        subagent_type: z.enum([
            "general-purpose",
            "Explore",
            "Plan",
            "statusline-setup"
        ]).optional().default("general-purpose")
            .describe("Type of subagent to use"),

        // Execution mode
        run_in_background: z.boolean().optional()
            .describe("Set to true to run in background. You will be notified when it completes."),

        resume: z.string().optional()
            .describe("Resume a previous agent by ID"),

        // Model selection (v2.1.76)
        model: z.enum(["sonnet", "opus", "haiku"]).optional()
            .describe("Model to use for this agent"),

        // Teammate mode
        name: z.string().optional()
            .describe("Teammate agent name"),

        team_name: z.string().optional()
            .describe("Team name for teammate mode"),

        mode: z.string().optional()
            .describe("Execution mode hint"),

        // Worktree isolation (v2.1.76)
        isolation: z.enum(["none", "worktree"]).optional()
            .describe("Isolation mode for file operations"),

        cwd: z.string().optional()
            .describe("Working directory override")
    });
}
```

---

## call() Implementation

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AgentTool.call() Entry                               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Determine Execution Mode                                  │
│                                                                              │
│  1. Check team_name + name → Teammate mode                                  │
│  2. Check run_in_background → Background mode                               │
│  3. Check resume → Resume previous agent                                    │
│  4. Default → Synchronous subagent                                          │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ Teammate    │    │ Background  │    │ Sync Agent  │
   │ Mode        │    │ Mode        │    │ (Default)   │
   │             │    │             │    │             │
   │ qn4()       │    │ Qn4()       │    │ qh()        │
   │ spawnAgent  │    │ createTask  │    │ agentLoop   │
   └─────────────┘    └─────────────┘    └─────────────┘
```

### Source Code - call() Method

```javascript
// ============================================
// AgentTool.call() - Main execution method
// Location: chunks.136.mjs:1542-1612
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
    let f = qkY({
        team_name: O
    }, Z);
    if ($Y() && f && w) throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
    if (eP() && f && _ === !0) throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
    if (f && w) {
        // Teammate mode
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
    // ... resume and background handling continues
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
}, toolUseContext, agentDefinitions, options, querySource) {
    let startTime = Date.now();

    // Model override (disabled for cloud sessions)
    let modelOverride = isCloudSession() ? undefined : model;

    let appState = toolUseContext.getAppState();
    let permissionMode = appState.toolPermissionContext.mode;

    // Check Agent Teams availability
    if (team_name && !isAgentTeamsAvailable()) {
        throw Error("Agent Teams is not yet available on your plan.");
    }

    // Resolve team context
    let resolvedTeamName = resolveTeamContext({ team_name }, appState);

    // Validation: Teammates cannot spawn teammates
    if (isTeammateAgent() && resolvedTeamName && name) {
        throw Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
    }

    // Validation: In-process teammates cannot spawn background agents
    if (isInProcessTeammate() && resolvedTeamName && run_in_background === true) {
        throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
    }

    // === TEAMMATE MODE ===
    if (resolvedTeamName && name) {
        // Find agent definition for color inheritance
        let agentDef = subagent_type
            ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
            : undefined;

        if (agentDef?.color) {
            registerAgentColor(subagent_type, agentDef.color);
        }

        // Spawn teammate agent
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

    // === RESUME MODE ===
    let forkMessages, inheritedAgentType, worktreePath;
    if (resume) {
        let existingTask = appState.tasks[resume];

        // Check if resuming running agent (queue message)
        if (isTaskRunning(existingTask) && !isTaskBackgrounded(existingTask) && existingTask.status === "running") {
            queueMessageToRunningAgent(resume, prompt, toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState);
            return {
                data: {
                    status: "queued_to_running",
                    agentId: resume,
                    prompt: prompt
                }
            };
        }

        // Load transcript from previous run
        let transcript = await loadTranscript(getOutputFilePath(resume));
        if (!transcript) {
            throw Error(`No transcript found for agent ID: ${resume}`);
        }

        forkMessages = filterMessagesForFork(extractMessagesFromTranscript(transcript));

        // Restore agent type from transcript
        let savedState = await loadAgentState(getOutputFilePath(resume));
        if (!subagent_type) {
            inheritedAgentType = savedState?.agentType;
        }

        // Restore worktree if exists
        let savedWorktree = savedState?.worktreePath;
        if (savedWorktree) {
            try {
                await fs.access(savedWorktree);
                worktreePath = savedWorktree;
            } catch (error) {
                if (error.code === "ENOENT" || error.code === "EACCES" || error.code === "EPERM") {
                    logger.warn(`Resumed worktree ${savedWorktree} no longer exists; falling back to parent cwd`);
                } else {
                    throw error;
                }
            }
        }
    }

    // Determine agent type
    let agentType = subagent_type ??
        (inheritedAgentType !== undefined && inheritedAgentType !== DEFAULT_AGENT.agentType
            ? inheritedAgentType
            : (shouldAutoSelectType() && !resume
                ? undefined
                : GENERAL_PURPOSE_AGENT.agentType));

    let isAutoType = agentType === undefined;

    // ... continue with agent creation and execution
}

// Mapping: A→prompt, q→subagent_type, K→description, Y→model, z→resume,
// _→run_in_background, w→name, O→team_name, $→mode, H→isolation, j→cwd,
// J→toolUseContext, qn4→spawnTeammate, qkY→resolveTeamContext, $Y→isTeammateAgent,
// eP→isInProcessTeammate, E7→isAgentTeamsAvailable
```

---

## Execution Modes Deep Dive

### Mode 1: Synchronous Subagent

**What it does:** Spawns a subagent that blocks until completion.

**Flow:**
```
1. Determine agent type (subagent_type or default)
2. Create agent loop runner (qh)
3. Execute with streaming via async generator
4. Yield messages in real-time to caller
5. Return final result
```

**Use cases:**
- Quick tasks requiring immediate results
- Tasks where parent needs output to continue
- Controlled execution with progress visibility

### Mode 2: Background Agent

**What it does:** Spawns a subagent that runs independently.

**Flow:**
```
1. Create background task entry (Qn4)
2. Initialize output file
3. Create AbortController
4. Register in appState.tasks
5. Return immediately with { status: "async_launched", agentId }
6. Agent runs in background
7. Notification sent on completion
```

**Use cases:**
- Long-running tasks that shouldn't block
- Parallel execution of multiple tasks
- Fire-and-forget operations

### Mode 3: Teammate Agent

**What it does:** Spawns a collaborative teammate in a team context.

**Flow:**
```
1. Resolve team context
2. Validate teammate constraints
3. Call spawnTeammate (qn4)
4. Route to appropriate backend:
   - In-process (non-interactive sessions)
   - Split-pane (iTerm2/tmux)
   - Tmux-only (fallback)
5. Create mailbox for communication
6. Return { status: "teammate_spawned" }
```

**Use cases:**
- Multi-agent collaboration
- Parallel task distribution
- Long-running specialized tasks

---

## Output Schema

### Result Types

```javascript
// ============================================
// AgentTool output schema definitions
// ============================================

// Synchronous completion
{
    status: "completed",
    agentId: string,
    content: string,         // Final output
    toolUseCount: number,
    tokenCount: number,
    duration_ms: number
}

// Background launched
{
    status: "async_launched",
    agentId: string,
    outputFile: string       // Path to output file
}

// Teammate spawned
{
    status: "teammate_spawned",
    agentId: string,
    agentName: string,
    teamName: string
}

// Queued to running
{
    status: "queued_to_running",
    agentId: string,
    prompt: string
}

// Error
{
    status: "error",
    error: string
}
```

---

## Key Decisions

### Why Multiple Aliases?

The tool has two names: "Agent" and "Task". This dual naming:
1. **User preference** - Some users prefer "Task" for clarity
2. **Backward compatibility** - Original name was "Task"
3. **Semantic clarity** - "Agent" emphasizes the AI nature

### Why run_in_background vs name Parameter?

These parameters are **mutually exclusive** with team_name:
- `run_in_background` - Background subagent (no team context)
- `name` + `team_name` - Teammate agent (team context required)

### Why model Override Per-Invocation?

The `model` parameter enables:
1. **Cost optimization** - Use cheaper models for simple tasks
2. **Quality optimization** - Use better models for complex tasks
3. **Speed optimization** - Use faster models for time-sensitive tasks

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `QW6` | AgentTool | chunks.136.mjs:1512 | ✓ Verified |
| `r4` | TOOL_NAME_AGENT | chunks.40.mjs:406 | ✓ Verified |
| `I46` | TOOL_NAME_TASK | chunks.40.mjs:408 | ✓ Verified |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110 | ✓ Verified |

---

## Related Documents

- [teammate_spawning_source_restored.md](./teammate_spawning_source_restored.md) - Teammate spawning details
- [agent_loop_algorithm.md](./agent_loop_algorithm.md) - Agent loop execution
- [feature_interconnections.md](./feature_interconnections.md) - Cross-module integration
- [../26_background_agents/task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - Task state management