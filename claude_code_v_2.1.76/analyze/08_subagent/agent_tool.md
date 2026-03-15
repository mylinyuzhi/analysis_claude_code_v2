# Agent Tool (Task Tool) - Detailed Analysis (Claude Code 2.1.38)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `AgentTool` (rj1) - The tool definition object for the "Task" tool
- `filterDeniedAgents` (pEA) - Filters agent list by permission deny rules
- `getDenialSource` (cEA) - Finds which permission rule denied a specific agent type
- `filterByMcpServers` (un7) - Filters agents by MCP server availability
- `validateMcpServers` (KPA) - Checks if required MCP servers are present
- `buildAgentDescription` (Gn7) - Dynamically builds the tool description listing available agents
- `spawnTeammate` (Iu4) - Entry point for teammate spawning (delegates to backend-specific handlers)
- `createAsyncTask` (zd7) - Creates a background task entry with AbortController
- `createSyncTask` (wd7) - Creates a foreground task entry with backgrounding signal
- `runWithAgentIdentity` (p01) - Binds agent identity to AsyncLocalStorage for the callback
- `loadTranscript` (sP1) - Loads a saved transcript from disk for resume support
- `filterWhitespaceAssistant` (BQ1) - Filters out whitespace-only assistant messages from transcript
- `filterThinkingOnlyAssistant` (mQ1) - Removes assistant messages containing only thinking blocks
- `stripOrphanedToolResults` (wP6) - Removes tool_results with no matching tool_use
- `buildAgentResult` (UEA) - Assembles final result from agent messages
- `resolveAvailableTools` (YP6) - Determines which tools are available for the subagent
- `resolveTeamName` (KNY) - Resolves team name from input or parent context
- `isInProcessTeammate` (MM) - Checks if current execution is inside an in-process teammate
- `isBuiltInAgent` (iD) - Checks if agent definition source is "built-in"
- `buildSubagentSystemPrompt` (NQ1) - Appends subagent-specific notes to system prompt
- `buildForkContextMessages` (Nn7) - Creates context-aware prompt messages from parent history
- `inProcessCanUseTool` (XVY) - Permission checker for in-process teammates with abort awareness
- `runInTeammateContext` (nq6) - Runs callback in teammate AsyncLocalStorage context

---

## 1. Tool Schema

### Input Schema

The `Task` tool accepts the following input parameters, defined as a Zod schema (`xu4`):

```javascript
// ============================================
// AgentTool Input Schema - Combined base + teammate schemas
// Location: chunks.132.mjs:37-49
// ============================================

// ORIGINAL (for source lookup):
oVY = u.object({
    description: u.string().describe("A short (3-5 word) description of the task"),
    prompt: u.string().describe("The task for the agent to perform"),
    subagent_type: u.string().describe("The type of specialized agent to use for this task"),
    model: u.enum(["sonnet", "opus", "haiku"]).optional().describe(rVY),
    resume: u.string().optional().describe("Optional agent ID to resume from..."),
    run_in_background: u.boolean().optional().describe(`Set to true to run this agent in the background...`),
    max_turns: u.number().int().positive().optional().describe("Maximum number of agentic turns...")
}), aVY = u.object({
    name: u.string().optional().describe("Name for the spawned agent"),
    team_name: u.string().optional().describe("Team name for spawning..."),
    mode: Ew8.optional().describe('Permission mode for spawned teammate...')
}), xu4 = oVY.merge(aVY)

// READABLE (for understanding):
baseSchema = z.object({
    description: z.string(),       // Short task description (3-5 words)
    prompt: z.string(),            // The full task instruction
    subagent_type: z.string(),     // Agent type to use (e.g., "code", "research")
    model: z.enum(["sonnet", "opus", "haiku"]).optional(),  // Model override
    resume: z.string().optional(), // Agent ID to resume from saved transcript
    run_in_background: z.boolean().optional(), // Launch as background task
    max_turns: z.number().int().positive().optional() // Max API round-trips
});
teammateSchema = z.object({
    name: z.string().optional(),       // Teammate name (triggers teammate mode)
    team_name: z.string().optional(),  // Team to spawn into
    mode: permissionModeEnum.optional() // e.g., "plan" for plan approval
});
fullSchema = baseSchema.merge(teammateSchema);

// Mapping: oVY->baseSchema, aVY->teammateSchema, xu4->fullSchema, u->z (Zod)
```

**Key insight:** The schema is lazily evaluated via `avA()` (a `z7` lazy wrapper). When `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` is set, the `run_in_background` field is omitted from the schema entirely, making it invisible to the model.

### Output Schema

The output is a discriminated union with three possible shapes:

| Status | Schema | When |
|--------|--------|------|
| `completed` | `tVY` -- agentId, content[], totalToolUseCount, totalDurationMs, totalTokens, usage, prompt | Synchronous completion |
| `async_launched` | `eVY` -- agentId, description, prompt, outputFile | Background launch |
| `teammate_spawned` | `Vn7` -- teammate_id, name, team_name | Teammate creation |

---

## 2. Permission Filtering

### `filterDeniedAgents` (pEA)

**What it does:** Given a list of agent definitions, removes any whose `agentType` has been explicitly denied by a permission rule targeting the `"Task"` tool.

**How it works:**

```javascript
// ============================================
// filterDeniedAgents - Remove permission-denied agent types
// Location: chunks.172.mjs:1900-1902
// ============================================

// ORIGINAL (for source lookup):
function pEA(A, q, K) {
    return A.filter((Y) => cEA(q, K, Y.agentType) === null)
}

// READABLE (for understanding):
function filterDeniedAgents(agentDefinitions, toolPermissionContext, toolName) {
    return agentDefinitions.filter(
        (agentDef) => getDenialSource(toolPermissionContext, toolName, agentDef.agentType) === null
    );
}

// Mapping: pEA->filterDeniedAgents, A->agentDefinitions, q->toolPermissionContext,
//          K->toolName, Y->agentDef, cEA->getDenialSource
```

### `getDenialSource` (cEA)

**What it does:** Searches the tool permission context's deny rules for one matching the specified tool name and agent type. Returns the matching rule (with its `.source` property indicating where it came from), or `null` if no denial exists.

```javascript
// ============================================
// getDenialSource - Find which rule denied an agent type
// Location: chunks.172.mjs:1896-1898
// ============================================

// ORIGINAL (for source lookup):
function cEA(A, q, K) {
    return tU(A).find((Y) => Y.ruleValue.toolName === q && Y.ruleValue.ruleContent === K) || null
}

// READABLE (for understanding):
function getDenialSource(toolPermissionContext, toolName, agentType) {
    return getDenyRules(toolPermissionContext).find(
        (rule) => rule.ruleValue.toolName === toolName && rule.ruleValue.ruleContent === agentType
    ) || null;
}

// Mapping: cEA->getDenialSource, A->toolPermissionContext, q->toolName, K->agentType,
//          tU->getDenyRules, Y->rule
```

**Why this approach:** Permission rules are stored as structured objects with `source` metadata (e.g., "settings", "project", "cli"). By looking up the specific denial rule, the error message can tell the user *which* configuration file or flag caused the denial, making debugging straightforward.

### Permission Flow in `AgentTool.prompt()`

The `prompt()` method is called before the tool is presented to the model. It filters the available agent types to build the tool description:

```javascript
// ============================================
// AgentTool.prompt - Build description with permission-filtered agents
// Location: chunks.132.mjs:86-101
// ============================================

// ORIGINAL (for source lookup):
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
}

// READABLE (for understanding):
async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
    let permissionContext = await getToolPermissionContext();

    // Extract available MCP server names from tools (e.g., "mcp__github__list_repos" -> "github")
    let availableMcpServers = [];
    for (let tool of tools)
        if (tool.name?.startsWith("mcp__")) {
            let serverName = tool.name.split("__")[1];
            if (serverName && !availableMcpServers.includes(serverName))
                availableMcpServers.push(serverName);
        }

    // Filter by MCP requirements, then by permission denials
    let mcpFilteredAgents = filterByMcpServers(agents, availableMcpServers);
    let permittedAgents = filterDeniedAgents(mcpFilteredAgents, permissionContext, AGENT_TOOL_NAME);

    // Build the dynamic description showing available agent types
    return await buildAgentDescription(permittedAgents, false, allowedAgentTypes);
}

// Mapping: A->agents, q->tools, K->getToolPermissionContext, Y->allowedAgentTypes,
//          z->permissionContext, w->availableMcpServers, H->mcpFilteredAgents,
//          $->permittedAgents, un7->filterByMcpServers, pEA->filterDeniedAgents,
//          Gn7->buildAgentDescription, fK->AGENT_TOOL_NAME
```

**Key insight:** The `prompt()` method runs *before* the model sees the tool. By filtering the agent list at this stage, agents that lack MCP requirements or are permission-denied are never even shown to the model, preventing it from attempting to use unavailable agent types.

---

## 3. Teammate Mode

### When Teammate Mode Activates

Teammate mode is triggered when `name` (and optionally `team_name`) is provided in the tool input AND the Agent Teams feature is available (`l8()` returns true). The flow bypasses the normal subagent loop entirely and delegates to `spawnTeammate` (Iu4).

```javascript
// ============================================
// Teammate spawn path - Delegation to Iu4
// Location: chunks.132.mjs:128-158
// ============================================

// ORIGINAL (for source lookup):
if (O && !l8()) throw Error("Agent Teams is not yet available on your plan.");
let G = KNY({ team_name: O }, P);
if (MM() && G) {
    if ($) throw Error("In-process teammates cannot spawn other teammates...");
    if (w === !0) throw Error("In-process teammates cannot spawn background agents...")
}
if (G && $) {
    if (q) {
        let O1 = J.options.agentDefinitions.activeAgents.find((T1) => T1.agentType === q);
        if (O1?.color) xK1(q, O1.color)
    }
    let r = await Iu4({
        name: $, prompt: A, description: K, team_name: G,
        use_splitpane: !0, plan_mode_required: _ === "plan",
        model: Y, agent_type: q
    }, J);
    return { data: { status: "teammate_spawned", prompt: A, ...r.data } }
}

// READABLE (for understanding):
if (teamName && !isAgentTeamsAvailable())
    throw Error("Agent Teams is not yet available on your plan.");

let resolvedTeamName = resolveTeamName({ team_name: teamName }, appState);

// In-process restrictions: nested teammates cannot spawn further teammates or background agents
if (isInProcessTeammate() && resolvedTeamName) {
    if (name) throw Error("In-process teammates cannot spawn other teammates.");
    if (run_in_background === true)
        throw Error("In-process teammates cannot spawn background agents.");
}

// If we have both a team name AND a teammate name, enter teammate mode
if (resolvedTeamName && name) {
    // Optionally register agent color
    if (subagent_type) {
        let agentDef = toolUseContext.options.agentDefinitions.activeAgents
            .find(d => d.agentType === subagent_type);
        if (agentDef?.color) registerAgentColor(subagent_type, agentDef.color);
    }

    let result = await spawnTeammate({
        name, prompt, description, team_name: resolvedTeamName,
        use_splitpane: true, plan_mode_required: mode === "plan",
        model, agent_type: subagent_type
    }, toolUseContext);

    return { data: { status: "teammate_spawned", prompt, ...result.data } };
}

// Mapping: O->teamName, $->name, G->resolvedTeamName, A->prompt, K->description,
//          w->run_in_background, _->mode, Y->model, q->subagent_type, J->toolUseContext,
//          P->appState, MM->isInProcessTeammate, KNY->resolveTeamName, Iu4->spawnTeammate,
//          l8->isAgentTeamsAvailable, xK1->registerAgentColor
```

### `spawnTeammate` (Iu4) Backend Dispatch

`Iu4` delegates to `iVY`, which selects the appropriate backend:

```javascript
// ============================================
// spawnTeammateDispatch - Select backend for teammate spawning
// Location: chunks.131.mjs:2467-2475
// ============================================

// ORIGINAL (for source lookup):
async function iVY(A, q) {
    if (Rm()) return lVY(A, q);        // In-process (non-interactive/remote)
    if (A.use_splitpane !== !1) return dVY(A, q);  // Split-pane (iTerm2/tmux)
    return cVY(A, q)                    // Tmux-only
}
async function Iu4(A, q) {
    return iVY(A, q)
}

// READABLE (for understanding):
async function spawnTeammateDispatch(spawnConfig, toolUseContext) {
    if (isNonInteractiveOrRemote())
        return handleSpawnInProcess(spawnConfig, toolUseContext);
    if (spawnConfig.use_splitpane !== false)
        return handleSpawnSplitPane(spawnConfig, toolUseContext);
    return handleSpawnTmux(spawnConfig, toolUseContext);
}
async function spawnTeammate(spawnConfig, toolUseContext) {
    return spawnTeammateDispatch(spawnConfig, toolUseContext);
}

// Mapping: iVY->spawnTeammateDispatch, Iu4->spawnTeammate,
//          Rm->isNonInteractiveOrRemote, lVY->handleSpawnInProcess,
//          dVY->handleSpawnSplitPane, cVY->handleSpawnTmux
```

**Why this approach:** Different environments need different spawning strategies:
- **Non-interactive / remote sessions** cannot open new terminal panes, so they run the teammate in-process (same Node.js process, using AsyncLocalStorage for isolation)
- **iTerm2 with split-pane** provides the best UX: each teammate gets its own visible pane
- **Tmux fallback** works on any terminal that has tmux installed

---

## 4. In-Process Restrictions

When the current code is already running inside an in-process teammate (detected via `isInProcessTeammate()` / `MM()`), two hard restrictions are enforced:

1. **Cannot spawn other teammates** -- "In-process teammates cannot spawn other teammates. Only the team leader can spawn teammates."
2. **Cannot launch background agents** -- "In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents."

**Why these restrictions:**
- **No nested teammates:** In-process teammates share the same Node.js process. Spawning nested teammates would create deeply nested AsyncLocalStorage contexts and conflicting mailbox subscriptions. Only the team leader maintains the coordination graph.
- **No background agents:** In-process teammates already run as async tasks within the parent process. Background agents from within a teammate would create orphaned tasks with unclear lifecycle ownership. Synchronous subagents within a teammate are fine because they block the teammate's loop naturally.

---

## 5. Resume Support

### Transcript Loading Pipeline

When `resume` is provided (an agent ID from a previous run), the tool loads the saved transcript and converts it back into usable messages:

```javascript
// ============================================
// Resume pipeline - Load transcript and convert to messages
// Location: chunks.132.mjs:193-199
// ============================================

// ORIGINAL (for source lookup):
if (z) {
    let r = P.tasks[z];
    if (r && r.status === "running")
        throw Error(`Cannot resume agent ${z}: it is still running...`);
    let s = await sP1(xZ(z));
    if (!s) throw Error(`No transcript found for agent ID: ${z}`);
    y = BQ1(mQ1(wP6(s)))
}

// READABLE (for understanding):
if (resumeAgentId) {
    let task = appState.tasks[resumeAgentId];
    if (task && task.status === "running")
        throw Error(`Cannot resume agent ${resumeAgentId}: it is still running...`);

    // Load saved transcript from disk
    let transcript = await loadTranscript(getSessionPath(resumeAgentId));
    if (!transcript)
        throw Error(`No transcript found for agent ID: ${resumeAgentId}`);

    // Three-stage cleanup pipeline:
    // 1. stripOrphanedToolResults: Remove tool_results whose tool_use IDs don't exist
    // 2. filterThinkingOnlyAssistant: Remove assistant messages that contain only thinking blocks
    // 3. filterWhitespaceAssistant: Remove assistant messages with only whitespace text
    resumeMessages = filterWhitespaceAssistant(
        filterThinkingOnlyAssistant(
            stripOrphanedToolResults(transcript)
        )
    );
}

// Mapping: z->resumeAgentId, r->task, s->transcript, y->resumeMessages, P->appState,
//          sP1->loadTranscript, xZ->getSessionPath, BQ1->filterWhitespaceAssistant,
//          mQ1->filterThinkingOnlyAssistant, wP6->stripOrphanedToolResults
```

### Three-Stage Transcript Cleanup

**Stage 1: `stripOrphanedToolResults` (wP6)**

Scans all messages, collecting tool_use IDs and tool_result IDs. Removes any tool_result blocks whose `tool_use_id` does not appear in any tool_use block. This handles cases where the transcript was truncated mid-conversation.

**Stage 2: `filterThinkingOnlyAssistant` (mQ1)**

Removes assistant messages where every content block is either `"thinking"` or `"redacted_thinking"`. These messages have no actionable content and would waste tokens when resumed.

**Stage 3: `filterWhitespaceAssistant` (BQ1)**

Removes assistant messages where all text blocks contain only whitespace. Logs a telemetry event (`tengu_filtered_whitespace_only_assistant`) for monitoring.

**Why this pipeline:** Transcripts can contain artifacts from interrupted runs: orphaned tool results from incomplete tool calls, empty thinking blocks, whitespace-only responses. Feeding these to the LLM on resume would confuse the model and waste tokens. The pipeline ensures the resumed conversation is clean and coherent.

---

## 6. Async Execution

### `createAsyncTask` (zd7)

**What it does:** Registers a background task in the state management system and sets up transcript recording.

```javascript
// ============================================
// createAsyncTask - Background task setup with abort controller
// Location: chunks.89.mjs:1447-1475
// ============================================

// ORIGINAL (for source lookup):
function zd7({
    agentId: A, description: q, prompt: K,
    selectedAgent: Y, setAppState: z, parentAbortController: w
}) {
    Ij1(A, kh(xZ(A)));
    let H = w ? R61(w) : Aq(),
        $ = { /* task registration object */ };
    // ...registers task in state
}

// READABLE (for understanding):
function createAsyncTask({
    agentId, description, prompt,
    selectedAgent, setAppState, parentAbortController
}) {
    // Initialize transcript recording for this agent
    initTranscriptRecorder(agentId, getTranscriptPath(getSessionPath(agentId)));

    // Create abort controller: child of parent's if available, otherwise standalone
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : createAbortController();

    // Register the task in app state
    // Returns { agentId, abortController }
}

// Mapping: zd7->createAsyncTask, A->agentId, q->description, K->prompt,
//          Y->selectedAgent, z->setAppState, w->parentAbortController,
//          Ij1->initTranscriptRecorder, kh->getTranscriptPath, xZ->getSessionPath,
//          R61->createChildAbortController, Aq->createAbortController, H->abortController
```

### `runWithAgentIdentity` (p01)

**What it does:** Runs an async callback within a Node.js `AsyncLocalStorage` context bound to a specific agent identity. This allows any code in the call stack to identify which agent is currently executing.

```javascript
// ============================================
// runWithAgentIdentity - AsyncLocalStorage context binding
// Location: chunks.80.mjs:2353-2355
// ============================================

// ORIGINAL (for source lookup):
function p01(A, q) {
    return ix7.run(A, q)
}

// READABLE (for understanding):
function runWithAgentIdentity(agentIdentity, callback) {
    return agentIdentityStore.run(agentIdentity, callback);
}

// Mapping: p01->runWithAgentIdentity, A->agentIdentity, q->callback,
//          ix7->agentIdentityStore (AsyncLocalStorage instance)
```

The agent identity object contains:
```
{
    agentId: string,
    parentSessionId: string,
    agentType: "subagent",
    subagentName: string,  // e.g., "code", "research"
    isBuiltIn: boolean
}
```

### Async Completion Flow

After the async agent loop completes:

1. `buildAgentResult` (UEA) extracts the final response text, usage stats, and token counts
2. `yjA` records the result in app state
3. `vK1` marks the task as completed/failed/killed with optional summary and stats
4. If an error occurs, `CjA` records the error in state before marking as failed
5. If the agent was aborted (`dz` error class), it checks via `na()` if the task should be marked as "killed"

---

## 7. MCP Server Requirements

### `validateMcpServers` (KPA)

**What it does:** Checks whether all MCP servers required by an agent definition are available in the current environment.

```javascript
// ============================================
// validateMcpServers - Check MCP server availability for agent
// Location: chunks.91.mjs:17-20
// ============================================

// ORIGINAL (for source lookup):
function KPA(A, q) {
    if (!A.requiredMcpServers || A.requiredMcpServers.length === 0) return !0;
    return A.requiredMcpServers.every((K) => q.some((Y) => Y.toLowerCase().includes(K.toLowerCase())))
}

// READABLE (for understanding):
function validateMcpServers(agentDefinition, availableMcpServers) {
    // No requirements = always valid
    if (!agentDefinition.requiredMcpServers || agentDefinition.requiredMcpServers.length === 0)
        return true;

    // Every required server must have a case-insensitive partial match in available servers
    return agentDefinition.requiredMcpServers.every(
        (required) => availableMcpServers.some(
            (available) => available.toLowerCase().includes(required.toLowerCase())
        )
    );
}

// Mapping: KPA->validateMcpServers, A->agentDefinition, q->availableMcpServers
```

### `filterByMcpServers` (un7)

```javascript
// ============================================
// filterByMcpServers - Remove agents with unmet MCP requirements
// Location: chunks.91.mjs:22-24
// ============================================

// ORIGINAL (for source lookup):
function un7(A, q) {
    return A.filter((K) => KPA(K, q))
}

// READABLE (for understanding):
function filterByMcpServers(agentDefinitions, availableMcpServers) {
    return agentDefinitions.filter(
        (agentDef) => validateMcpServers(agentDef, availableMcpServers)
    );
}

// Mapping: un7->filterByMcpServers, A->agentDefinitions, q->availableMcpServers, K->agentDef
```

### MCP Validation in `AgentTool.call()`

After the agent definition is resolved, the tool validates MCP requirements:

```javascript
// ============================================
// MCP validation in call() - Check and report missing servers
// Location: chunks.132.mjs:172-182
// ============================================

// ORIGINAL (for source lookup):
if (T.requiredMcpServers?.length) {
    let r = [];
    for (let s of P.mcp.tools)
        if (s.name?.startsWith("mcp__")) {
            let T1 = s.name.split("__")[1];
            if (T1 && !r.includes(T1)) r.push(T1)
        }
    if (!KPA(T, r)) {
        let s = T.requiredMcpServers.filter((O1) => !r.some((T1) => T1.toLowerCase().includes(O1.toLowerCase())));
        throw Error(`Agent '${q}' requires MCP servers matching: ${s.join(", ")}. ...`)
    }
}

// READABLE (for understanding):
if (selectedAgent.requiredMcpServers?.length) {
    // Extract available MCP server names from current MCP tools
    let availableServers = [];
    for (let tool of appState.mcp.tools)
        if (tool.name?.startsWith("mcp__")) {
            let serverName = tool.name.split("__")[1];
            if (serverName && !availableServers.includes(serverName))
                availableServers.push(serverName);
        }

    if (!validateMcpServers(selectedAgent, availableServers)) {
        // Report exactly which servers are missing
        let missingServers = selectedAgent.requiredMcpServers.filter(
            (required) => !availableServers.some(
                (available) => available.toLowerCase().includes(required.toLowerCase())
            )
        );
        throw Error(
            `Agent '${subagentType}' requires MCP servers matching: ${missingServers.join(", ")}. ` +
            `MCP servers with tools: ${availableServers.length > 0 ? availableServers.join(", ") : "none"}. ` +
            `Use /mcp to configure and authenticate the required MCP servers.`
        );
    }
}

// Mapping: T->selectedAgent, r->availableServers, s->missingServers,
//          P->appState, q->subagentType, KPA->validateMcpServers
```

**Why case-insensitive partial matching:** MCP server names in tool identifiers may differ in casing or include prefixes/suffixes (e.g., `github-enterprise` should match a requirement of `github`). The `.includes()` check allows flexible matching while being case-insensitive.

**Key insight:** MCP validation happens at two stages:
1. **In `prompt()`** -- agents with unmet MCP requirements are filtered OUT of the description, so the model never sees them
2. **In `call()`** -- a second check catches race conditions where MCP state changed between prompt generation and tool invocation, providing a clear error message directing the user to `/mcp` configuration

---

## 8. In-Process Teammate Permission Handling

### `inProcessCanUseTool` (XVY)

**What it does:** Creates a permission checker for in-process teammates that is aware of both the agent's abort controller and the team's permission request system.

```javascript
// ============================================
// inProcessCanUseTool - Permission checker with abort and team awareness
// Location: chunks.131.mjs:3-179
// ============================================

// ORIGINAL (for source lookup):
function XVY(A, q) {
    return async (K, Y, z, w, H) => {
        let $ = await uX(K, Y, z, w, H);
        if ($.behavior !== "ask") return $;
        if (q.signal.aborted) return { behavior: "ask", message: $I };
        // ... complex permission delegation logic
    }
}

// READABLE (for understanding):
function inProcessCanUseTool(agentIdentity, workAbortController) {
    return async (tool, input, toolUseContext, assistantMessage, toolUseId) => {
        // First, check standard permissions
        let result = await standardCanUseTool(tool, input, toolUseContext, assistantMessage, toolUseId);

        // If already allowed or denied, return immediately
        if (result.behavior !== "ask") return result;

        // If abort was triggered, deny with standard rejection message
        if (workAbortController.signal.aborted)
            return { behavior: "ask", message: USER_REJECTION_MESSAGE };

        // Otherwise, delegate to the team's permission request system:
        // - If there's a shared permission prompt UI (iM6), add to the queue
        // - Otherwise, send a permission request via the team mailbox
        // - Poll mailbox for approval/rejection responses
        // ...
    }
}

// Mapping: XVY->inProcessCanUseTool, A->agentIdentity, q->workAbortController,
//          uX->standardCanUseTool, $I->USER_REJECTION_MESSAGE, iM6->getSharedPermissionUI
```

**Why this approach:** In-process teammates cannot directly prompt the user for permission (they don't own the terminal). Instead, they either:
1. **Use the shared UI** (if available in the parent process) -- adding their permission request to the parent's queue
2. **Use the mailbox** -- sending a structured permission request message to the team leader, then polling for the response

This design ensures permission prompts are always visible and responsive, even when the teammate is running in a different "lane" of execution.

---

## 9. Tool Configuration Summary

The `AgentTool` object (rj1) exposes several metadata properties:

| Property | Value | Purpose |
|----------|-------|---------|
| `name` | `"Task"` (fK) | The tool name seen by the model |
| `maxResultSizeChars` | `100000` (1e5) | Maximum result text length |
| `isReadOnly()` | `true` | Tool does not modify files directly (the subagent does) |
| `isConcurrencySafe()` | `true` | Multiple Task calls can run simultaneously |
| `isEnabled()` | `true` | Always available |
| `userFacingName` | rvA | Display name for the UI |
| `userFacingNameBackgroundColor` | ovA | UI styling |
| `getActivityDescription(input)` | `input?.description ?? "Running task"` | Shown in progress indicators |

### `mapToolResultToToolResultBlockParam`

This method customizes how the tool result is formatted when sent back to the LLM as a `tool_result` block. It handles three cases:

1. **Teammate spawned** -- Returns a confirmation with agent_id, name, team_name and instructions about mailbox communication
2. **Async launched** -- Returns the agentId (marked as internal), output file path, and instructions to continue with other tasks
3. **Completed** -- Uses default formatting (the actual result content)

**Key insight:** The async result message deliberately tells the model "Continue with other tasks" and "You will be notified automatically when it completes." This steers the parent model away from busy-waiting on background agents.
