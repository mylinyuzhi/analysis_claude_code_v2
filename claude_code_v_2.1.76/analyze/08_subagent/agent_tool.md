# Agent Tool - Subagent System (Claude Code 2.1.76)

## Overview

`QW6` (AgentTool) is the "Task" tool that the LLM invokes to spawn subagents. It bridges the LLM's tool-calling interface with the subagent spawning system.

**v2.1.76 changes:**
- `model` parameter added to AgentTool input schema for per-invocation model override
- `isolation: worktree` declarative support for git worktree-based subagent isolation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `AgentTool` (QW6) - The Task tool object - chunks.136.mjs:1512
- `agentInputSchema` (aVY) - Base input schema for agent tool - chunks.136.mjs:1444
- `teammateInputSchema` (sVY) - Teammate-mode schema with team fields - chunks.136.mjs:1451
- `agentOutputSchema` (eVY) - Output schema with status variants - chunks.136.mjs:1492
- `agentLoopRunner` (qh) - Core agent execution loop - chunks.133.mjs:1565
- `llmMessageLoop` (Yh) - LLM message processing - chunks.148.mjs:875
- `spawnTeammateDispatcher` (iVY) - Route teammate spawn - chunks.129.mjs:2550
- `loadTranscript` (hf6) - Load prior transcript for resume - chunks.174.mjs:2705
- `stripOrphanedToolResults` (wP6) - Remove orphaned tool results - chunks.173.mjs:344
- `filterThinkingOnlyAssistant` (mQ1) - Filter thinking-only messages - chunks.173.mjs:1435
- `filterWhitespaceAssistant` (BQ1) - Filter whitespace-only messages - chunks.173.mjs:1388
- `runWithAgentIdentity` (X66) - AsyncLocalStorage context binding - chunks.133.mjs:841
- `resolveModelConfig` (C01) - Model resolution cascade - chunks.133.mjs:1589
- `generateAgentId` (bI) - Unique agent ID generator - chunks.133.mjs:1590
- `cloneMap` (DI) - Map cloning utility - chunks.133.mjs:1597
- `cloneForkContext` (Fx8) - Fork context message cloning - chunks.133.mjs:1787
- `buildAgentSystemPrompt` (vvY) - System prompt builder - chunks.133.mjs:1806
- `registerAgentHooks` (r24) - Hook registration for agent - chunks.133.mjs:1647

> **CORRECTION:** The symbol `p01` was incorrectly documented as `runWithAgentIdentity`.
> The actual `p01` (chunks.94.mjs:295) is `isSkillMdFile`. The correct symbol for
> `runWithAgentIdentity` is `X66` (chunks.133.mjs:841).

---

## Input Schema

### Base Schema (aVY)

```javascript
// ============================================
// agentInputSchema - Base input schema for Agent tool
// Location: chunks.136.mjs:1444-1451
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
const agentInputSchema = z.lazy(() => z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().optional().describe("The type of specialized agent to use for this task"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional()
        .describe("Optional model override. Takes precedence over agent definition's model."),
    resume: z.string().optional().describe("Optional agent ID to resume from"),
    run_in_background: z.boolean().optional().describe("Set to true to run in background")
}))

// Mapping: aVY→agentInputSchema, F6→z.lazy, C→z (Zod)
```

### Teammate Schema (sVY)

Additional fields for teammate mode (when spawning as part of a team):

```javascript
// ============================================
// teammateInputSchema - Extended schema for teammate mode
// Location: chunks.136.mjs:1451-1461
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
const teammateInputSchema = z.lazy(() => {
    let teammateFields = z.object({
        name: z.string().optional().describe("Name for the spawned agent"),
        team_name: z.string().optional().describe("Team name for spawning"),
        mode: permissionModeSchema.optional().describe("Permission mode for spawned teammate")
    });
    return agentInputSchema().merge(teammateFields).extend({
        isolation: z.enum(["worktree"]).optional()
            .describe('Isolation mode. "worktree" creates a temporary git worktree'),
        cwd: z.string().optional()
            .describe('Absolute path to run the agent in. Mutually exclusive with isolation.')
    })
})

// Mapping: sVY→teammateInputSchema, X57→permissionModeSchema, aVY→agentInputSchema
```

---

## Output Schema (eVY)

```javascript
// ============================================
// agentOutputSchema - Output schema with status variants
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
    // Completed result - agent finished successfully
    let completedSchema = completedResultSchema().extend({
        status: z.literal("completed"),
        prompt: z.string()
    });

    // Async launched - agent running in background
    let asyncLaunchedSchema = z.object({
        status: z.literal("async_launched"),
        agentId: z.string().describe("The ID of the async agent"),
        description: z.string().describe("The description of the task"),
        prompt: z.string().describe("The prompt for the agent"),
        outputFile: z.string().describe("Path to the output file for checking progress"),
        canReadOutputFile: z.boolean().optional()
    });

    // Queued to running - resumed an existing running agent
    let queuedSchema = z.object({
        status: z.literal("queued_to_running"),
        agentId: z.string().describe("The ID of the running agent"),
        prompt: z.string().describe("The prompt that was queued")
    });

    return z.union([completedSchema, asyncLaunchedSchema, queuedSchema]);
})

// Mapping: eVY→agentOutputSchema, tVY→completedResultSchema
```

---

## AgentTool Object (QW6)

```javascript
// ============================================
// AgentTool - The "Agent" tool object definition
// Location: chunks.136.mjs:1512-1541
// ============================================

// ORIGINAL (for source lookup):
QW6 = {
    async prompt({ agents: A, tools: q, getToolPermissionContext: K, allowedAgentTypes: Y }) {
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
    async description() { return "Launch a new agent" },
    get inputSchema() { return xx8() },
    get outputSchema() { return eVY() },
    async call({ prompt: A, subagent_type: q, description: K, model: Y, resume: z,
                 run_in_background: _, name: w, team_name: O, mode: $, isolation: H, cwd: j },
               J, M, D, X) { /* ... implementation ... */ }
}

// READABLE (for understanding):
const AgentTool = {
    // Dynamic prompt generation based on available agents and tools
    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        let permissionContext = await getToolPermissionContext();
        let mcpServerNames = [];
        // Collect MCP server names from tool names
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServerNames.includes(serverName)) {
                    mcpServerNames.push(serverName);
                }
            }
        }
        let filteredAgents = filterAgentsByMcpRequirements(agents, mcpServerNames);
        let visibleAgents = applyPermissionFilters(filteredAgents, permissionContext, "Agent");
        return await buildAgentToolPrompt(visibleAgents, false, allowedAgentTypes);
    },

    name: "Agent",                // r4
    searchHint: "delegate work to a subagent",
    aliases: ["Task"],            // I46
    maxResultSizeChars: 100000,   // 1e5

    async description() {
        return "Launch a new agent";
    },

    get inputSchema() {
        return getMergedInputSchema();  // xx8 - merges aVY and sVY
    },

    get outputSchema() {
        return agentOutputSchema();     // eVY
    },

    async call(input, toolUseContext, ...args) {
        // Full implementation in call function section below
    }
}

// Mapping: QW6→AgentTool, r4→"Agent", I46→"Task", xx8→getMergedInputSchema,
// jm8→applyPermissionFilters, zE8→filterAgentsByMcpRequirements, j_4→buildAgentToolPrompt
```

---

## Design Rationale

### Why Separate aVY and sVY Schemas?

Standard and teammate modes have different required fields. Using `sVY().merge(aVY())` allows:
1. **Teammate mode** to inherit all base fields plus add `name`, `team_name`, `isolation`, `cwd`
2. **Standard mode** to use just the base schema without unnecessary fields
3. **Validation** to be strict: teammate mode requires additional context

**Key insight:** The `F6` (z.lazy) wrapper enables recursive schema references and deferred evaluation, which is needed because the schemas reference each other in the merge operation.

### Why Per-Invocation model Override? (v2.1.76)

Different tasks within the same session may benefit from different models:
- A simple file search can use `haiku` (faster, cheaper)
- Complex reasoning benefits from `sonnet` or `opus` (more capable)

**Resolution priority (highest to lowest):**
1. Per-invocation `model` parameter in the Task tool call
2. Agent definition `model` field
3. Session-level model configuration
4. System default model

### Why isolation: "worktree"? (v2.1.76)

Without worktree isolation, two parallel subagents editing the same file produce merge conflicts or data corruption. With `isolation: worktree`:
1. Each subagent writes to its own branch/worktree copy
2. Results can be merged after completion
3. Filesystem conflicts are prevented at the git level

---

## Call Function Implementation

The `call` function (QW6.call) handles all subagent invocations:

```javascript
// ============================================
// AgentTool.call - Main entry point for subagent spawning
// Location: chunks.136.mjs:1542-1740 (worktree and async logic)
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
        W = e2() ? void 0 : Y,  // Disable model override in some contexts
        Z = J.getAppState(),
        G = Z.toolPermissionContext.mode;

    // Check for teammate mode (team spawning)
    if (O && !E7()) throw Error("Agent Teams is not yet available on your plan.");
    let f = qkY({ team_name: O }, Z);

    // Validate teammate spawning constraints
    if ($Y() && f && w) throw Error("Teammates cannot spawn other teammates...");
    if (eP() && f && _ === !0) throw Error("In-process teammates cannot spawn background agents...");

    // Handle teammate mode dispatch
    if (f && w) {
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
        return { data: { status: "teammate_spawned", prompt: A, ...o.data } }
    }

    // Handle resume from transcript
    let v, N, V;
    if (z) {
        let n = Z.tasks[z];
        // Check if resuming a running agent
        if (Sf(n) && !Ef6(n) && n.status === "running") {
            return NV1(z, A, J.setAppStateForTasks ?? J.setAppState), {
                data: { status: "queued_to_running", agentId: z, prompt: A }
            };
        }
        // Load transcript from disk
        let o = await hf6(X$(z));
        if (!o) throw Error(`No transcript found for agent ID: ${z}`);
        v = Ol6($l6(_V1(o)));
        let a = await Mm8(X$(z));
        if (!q) N = a?.agentType;
        let i = a?.worktreePath;
        if (i) try { await iVY.access(i); V = i } catch (l) { /* worktree no longer exists */ }
    }

    // Resolve agent definition
    let L = q ?? (N !== void 0 ? N : sH() && !z ? void 0 : q96.agentType);

    // MCP server validation
    let I = R.requiredMcpServers;
    if (I?.length) {
        let n = Z.mcp.clients.some((i) => i.type === "pending" && I.some((l) => i.name.toLowerCase().includes(l.toLowerCase()))),
            o = Z;
        if (n) {
            let q6 = Date.now() + 30000;
            while (Date.now() < q6) {
                if (await new Promise((L6) => setTimeout(L6, 500)), o = J.getAppState(),
                    o.mcp.clients.some((L6) => L6.type === "failed" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break;
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

    // Model resolution
    let g = C01(R.model, J.options.mainLoopModel, h || u ? void 0 : W, G);

    // Worktree isolation (v2.1.76)
    let B = H ?? R.isolation, b, p, Q;
    // ... system prompt construction ...

    let U = {
            prompt: A,
            resolvedAgentModel: g,
            isBuiltInAgent: Qj(R),
            startTime: P,
            agentType: R.agentType,
            isAsync: _ === !0 || R.background === !0
        },
        r = !1,
        e = sH(),
        Y6 = (_ === !0 || R.background === !0 || r || e || (nVY?.isProactiveActive() ?? !1)) && !fV1,
        H6 = {
            ...Z.toolPermissionContext,
            mode: R.permissionMode ?? "acceptEdits"
        },
        J6 = u66(H6, Z.mcp.tools),
        K6 = z || bI(),
        s = null;
    if (B === "worktree") {
        let n = `agent-${K6.slice(0,8)}`;
        s = await zl6(n)
    }
    if (h && s) Q.push(p1({
        content: H_4(G1(), s.worktreePath)
    }));

    // ... execution via agentLoopRunner ...
}

// READABLE (for understanding):
async function call(input, toolUseContext, ...) {
    let startTime = Date.now();
    let modelOverride = isFeatureDisabled() ? undefined : input.model;
    let appState = toolUseContext.getAppState();

    // 1. Teammate mode: spawn as part of a team
    if (input.team_name && input.name) {
        let agentDef = findAgentDefinition(input.subagent_type);
        let result = await spawnTeammate({
            name: input.name,
            prompt: input.prompt,
            team_name: resolveTeamName(input.team_name),
            model: modelOverride ?? agentDef?.model
        }, toolUseContext);
        return { status: "teammate_spawned", ...result };
    }

    // 2. Resume mode: continue from prior transcript
    if (input.resume) {
        let existingTask = appState.tasks[input.resume];
        if (existingTask?.status === "running") {
            // Queue message to running agent
            queueMessageToRunningAgent(input.resume, input.prompt);
            return { status: "queued_to_running", agentId: input.resume };
        }
        let transcript = await loadTranscript(input.resume);
        priorMessages = processTranscriptForResume(transcript);
    }

    // 3. Standard subagent execution
    let agentType = input.subagent_type ?? GENERAL_PURPOSE_AGENT.agentType;
    let agentDef = resolveAgentDefinition(agentType);

    // 4. Execute via agentLoopRunner
    // ... continues with execution ...
}

// Mapping: e2→isFeatureDisabled, qkY→resolveTeamName, qn4→spawnTeammate,
// hf6→loadTranscript, NV1→queueMessageToRunningAgent, q96→GENERAL_PURPOSE_AGENT
```

---

## Resume Pipeline

When a task has a prior transcript (due to interruption or restart):

```
loadTranscript (hf6)
    │
    └── Returns list of prior sidechain messages
         │
         ├── stripOrphanedToolResults (wP6)
         │       └── Remove tool results without matching tool uses
         │
         ├── filterWhitespaceAssistant (BQ1)
         │       └── Remove empty assistant messages
         │
         └── filterThinkingOnlyAssistant (mQ1)
                 └── Remove thinking-only assistant messages
```

The resume pipeline ensures subagents can continue from where they left off without losing prior context.

---

## Model Resolution Cascade (C01)

When a subagent is spawned, the model is resolved through a priority cascade:

```
┌─────────────────────────────────────────┐
│  Per-invocation `model` parameter       │  Highest priority
│  (from AgentTool.call input)            │
└──────────────────┬──────────────────────┘
                   │ Not specified
                   ▼
┌─────────────────────────────────────────┐
│  Agent definition `model` field         │  Agent default
│  (from agentDefinition.model)           │
└──────────────────┬──────────────────────┘
                   │ Not specified or "inherit"
                   ▼
┌─────────────────────────────────────────┐
│  Session model                          │  Session default
│  (from toolUseContext.options.model)    │
└─────────────────────────────────────────┘
```

**Special cases:**
- `"inherit"` in agent definition → Use session model
- `undefined` → Fall through to next level
- Permission mode `"bypassPermissions"` → May override model for internal tasks

```javascript
// ============================================
// resolveModelConfig - Model resolution cascade
// Location: chunks.133.mjs:1589
// ============================================

// READABLE (for understanding):
function resolveModelConfig(agentDefinitionModel, sessionModel, perInvocationModel, permissionMode) {
    // 1. Per-invocation model has highest priority
    if (perInvocationModel) {
        return resolveModelId(perInvocationModel);
    }

    // 2. Agent definition model (unless it's "inherit")
    if (agentDefinitionModel && agentDefinitionModel !== "inherit") {
        return resolveModelId(agentDefinitionModel);
    }

    // 3. Fall back to session model
    return sessionModel;
}

// Mapping: C01→resolveModelConfig
```

**Why this design:** The cascade allows callers to override behavior without modifying agent definitions. An agent author can set a default model (e.g., `haiku` for exploration), but a caller can request a more capable model for a specific complex task.

---

## MCP Server Validation (v2.1.76)

### What it does

When an agent definition includes a `requiredMcpServers` field, the AgentTool validates that the necessary MCP servers are connected and authenticated before spawning the agent.

### How it works

```javascript
// ============================================
// MCP Server Validation in AgentTool.call
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
            if (await new Promise((L6) => setTimeout(L6, 500)), o = J.getAppState(),
                o.mcp.clients.some((L6) => L6.type === "failed" && I.some((y6) => L6.name.toLowerCase().includes(y6.toLowerCase())))) break;
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
async function validateRequiredMcpServers(agentDefinition, toolUseContext) {
    let requiredServers = agentDefinition.requiredMcpServers;
    if (!requiredServers?.length) return;  // No requirements

    let appState = toolUseContext.getAppState();

    // Check if any required servers are still pending (connecting)
    let hasPending = appState.mcp.clients.some(
        client => client.type === "pending" &&
                  requiredServers.some(req =>
                      client.name.toLowerCase().includes(req.toLowerCase())
                  )
    );

    // Wait up to 30 seconds for pending connections
    if (hasPending) {
        let deadline = Date.now() + 30000;
        while (Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 500));
            appState = toolUseContext.getAppState();

            // Break if a required server failed
            if (appState.mcp.clients.some(
                client => client.type === "failed" &&
                          requiredServers.some(req =>
                              client.name.toLowerCase().includes(req.toLowerCase())
                          )
            )) break;

            // Break if no more pending servers
            if (!appState.mcp.clients.some(
                client => client.type === "pending" &&
                          requiredServers.some(req =>
                              client.name.toLowerCase().includes(req.toLowerCase())
                          )
            )) break;
        }
    }

    // Collect available MCP server names from tool names
    let availableServers = [];
    for (let tool of appState.mcp.tools) {
        if (tool.name?.startsWith("mcp__")) {
            let serverName = tool.name.split("__")[1];
            if (serverName && !availableServers.includes(serverName)) {
                availableServers.push(serverName);
            }
        }
    }

    // Validate all required servers are available
    if (!validateServers(agentDefinition, availableServers)) {
        let missing = requiredServers.filter(
            req => !availableServers.some(
                avail => avail.toLowerCase().includes(req.toLowerCase())
            )
        );
        throw new Error(
            `Agent '${agentDefinition.agentType}' requires MCP servers matching: ${missing.join(", ")}. ` +
            `MCP servers with tools: ${availableServers.length > 0 ? availableServers.join(", ") : "none"}. ` +
            `Use /mcp to configure and authenticate the required MCP servers.`
        );
    }
}

// Mapping: I→requiredMcpServers, HW1→validateServers, R→agentDefinition
```

**Key insight:** The validation waits for pending MCP connections to resolve (up to 30 seconds) rather than immediately failing. This handles the case where an agent is spawned while MCP servers are still initializing.

---

## Worktree Isolation (v2.1.76)

### What it does

When `isolation: "worktree"` is specified (either in the agent definition or per-invocation), the subagent runs in an isolated git worktree. This prevents filesystem conflicts between parallel agents.

### How it works

```javascript
// ============================================
// Worktree isolation in AgentTool.call
// Location: chunks.136.mjs:1666-1725
// ============================================

// ORIGINAL (for source lookup):
let B = H ?? R.isolation,  // per-invocation or agent definition
    s = null;
if (B === "worktree") {
    let n = `agent-${K6.slice(0,8)}`;  // agent-{first-8-chars-of-id}
    s = await zl6(n)
}
if (h && s) Q.push(p1({
    content: H_4(G1(), s.worktreePath)
}));

// READABLE (for understanding):
async function setupWorktreeIsolation(isolationMode, agentId, isFork) {
    let isolation = isolationMode.perInvocation ?? isolationMode.agentDefinition;
    let worktreeInfo = null;

    if (isolation === "worktree") {
        // Create a named worktree based on agent ID
        let worktreeName = `agent-${agentId.slice(0, 8)}`;
        worktreeInfo = await allocateWorktree(worktreeName);
    }

    // For forked agents, inject worktree path into prompt
    if (isFork && worktreeInfo) {
        promptMessages.push(createUserMessage({
            content: formatWorktreeContext(getCwd(), worktreeInfo.worktreePath)
        }));
    }

    return worktreeInfo;
}

// Cleanup function (in finally block):
async function cleanupWorktree(worktreeInfo) {
    if (!worktreeInfo) return {};

    let { worktreePath, worktreeBranch, headCommit, gitRoot, hookBased } = worktreeInfo;

    // Hook-based worktrees are kept (user-managed)
    if (hookBased) {
        log(`Hook-based agent worktree kept at: ${worktreePath}`);
        return { worktreePath };
    }

    // If worktree has changes from original commit, keep it
    if (headCommit) {
        if (!await hasWorktreeChanges(worktreePath, headCommit)) {
            // No changes, clean up
            await removeWorktree(worktreePath, worktreeBranch, gitRoot);
            await clearAgentMetadata(agentId);
            return {};
        }
    }

    // Has changes, keep the worktree
    log(`Agent worktree has changes, keeping: ${worktreePath}`);
    return { worktreePath, worktreeBranch };
}

// Mapping: B→isolation, H→isolationParam, R→agentDefinition, zl6→allocateWorktree,
// h→isFork, H_4→formatWorktreeContext, G1→getCwd, K6→agentId
```

**Why this approach:**
1. **True filesystem isolation** - Each agent writes to its own worktree copy
2. **Declarative specification** - Agent definitions state their isolation needs
3. **Automatic cleanup** - Worktrees without changes are cleaned up; those with changes are preserved for review
4. **Branch management** - Each worktree gets its own branch, preventing conflicts

**Key insight:** The worktree cleanup checks if any changes were made. If the agent made no changes (e.g., read-only task), the worktree is removed. If changes exist, the worktree is preserved so the user can review or merge them.

---

## Context Cloning for Subagents

### Why Clone Context?

When spawning a subagent, certain context must be isolated:

1. **readFileState** - Each agent tracks its own file reads independently
2. **forkContextMessages** - Tool uses without results must be filtered
3. **abortController** - Each agent needs its own abort signal chain

### cloneMap (DI)

Shallow clones a Map, used for `readFileState` isolation:

```javascript
// ============================================
// cloneMap - Map cloning utility
// Location: chunks.133.mjs:1597
// ============================================

// READABLE (for understanding):
function cloneMap(originalMap) {
    return new Map(originalMap);
}

// Used in agentLoopRunner:
let clonedReadFileState = cloneMap(toolUseContext.readFileState);

// Mapping: DI→cloneMap
```

### cloneForkContext (Fx8)

Filters fork context messages to remove orphaned tool uses:

```javascript
// ============================================
// cloneForkContext - Fork context message cloning
// Location: chunks.133.mjs:1787-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        }
    return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(forkMessages) {
    // Step 1: Collect all tool_use_ids from tool_result blocks
    let referencedToolUseIds = new Set();
    for (let message of forkMessages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        referencedToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out assistant messages with orphaned tool_uses
    return forkMessages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Reject if any tool_use doesn't have a corresponding tool_result
                return !content.some((block) =>
                    block.type === "tool_use" && block.id && !referencedToolUseIds.has(block.id)
                );
            }
        }
        return true;
    });
}

// Mapping: Fx8→cloneForkContext, A→forkMessages, q→referencedToolUseIds
```

**Why orphan filtering matters:** If a prior conversation had tool uses compacted away, the LLM would wait indefinitely for tool results that will never arrive. Filtering orphaned tool uses ensures the conversation is valid for resumption.

---

## Hook Registration (r24)

When an agent definition includes hooks, they are registered for the duration of the agent's execution:

```javascript
// ============================================
// registerAgentHooks - Hook registration for agent
// Location: chunks.133.mjs:1647
// ============================================

// READABLE (for understanding):
function registerAgentHooks(setAppState, agentId, hooks, agentName, isSubagent) {
    // Register each hook event type
    for (let [eventName, handlers] of Object.entries(hooks)) {
        for (let handler of (Array.isArray(handlers) ? handlers : [handlers])) {
            globalHookRegistry.register(eventName, {
                agentId,
                handler,
                source: agentName,
                isSubagent
            });
        }
    }
}

// Deregistered in finally block via zZ6
// Mapping: r24→registerAgentHooks, zZ6→deregisterSkillHooks
```

---

## System Prompt Building (vvY)

The system prompt for a subagent is built by calling the agent definition's `getSystemPrompt` method:

```javascript
// ============================================
// buildAgentSystemPrompt - System prompt builder
// Location: chunks.133.mjs:1806+
// ============================================

// READABLE (for understanding):
async function buildAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, workingDirectories) {
    try {
        // Call the agent definition's prompt builder
        let basePrompt = await agentDefinition.getSystemPrompt({
            toolUseContext,
            model: resolvedModel
        });

        // Add critical system reminder if present
        if (agentDefinition.criticalSystemReminder_EXPERIMENTAL) {
            return basePrompt + "\n\n" + agentDefinition.criticalSystemReminder_EXPERIMENTAL;
        }

        return basePrompt;
    } catch (err) {
        // Handle prompt building errors gracefully
        return buildFallbackSystemPrompt(agentDefinition);
    }
}

// Mapping: vvY→buildAgentSystemPrompt
```

**Key insight:** The `criticalSystemReminder_EXPERIMENTAL` field in agent definitions allows adding urgent context (e.g., "READ-ONLY task") that shouldn't be missed even in compacted conversations.
