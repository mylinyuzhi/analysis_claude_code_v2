# Agent Tool - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the Agent tool: subagent spawning, background execution, worktree isolation, resume capability, and model selection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agents, Subagent sections)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents section)

Key functions in this document:
- `AgentTool` (QW6) - Agent tool definition object - chunks.136.mjs:1512
- `TOOL_NAME_AGENT` (r4) - Tool name constant "Agent" - chunks.40.mjs:406
- `TOOL_NAME_TASK` (I46) - Alias name constant "Task" - chunks.40.mjs:408
- `agentToolCall` - Core execution logic for running subagents
- `DELEGATE_ALLOWED_TOOLS` (R_6) - Tool allowlist for delegate agents
- `BACKGROUND_AGENT_ALLOWED_TOOLS` (Bj1) - Tool allowlist for background agents
- `resolveAgentModel` - Model resolution logic for per-invocation model selection

---

## Architecture Overview

```
LLM generates Agent tool_use
    { description, prompt, subagent_type, model?, run_in_background?, isolation? }
         │
         ▼
 AgentTool.validateInput()
 ├── subagent_type validation
 ├── model parameter validation (v2.1.72+)
 └── isolation: worktree validation
         │
         ▼
 AgentTool.checkPermissions()
 └── auto-approved (no user prompt)
         │
         ▼
 AgentTool.call()
 ├── [run_in_background=false] → foreground subagent
 │     ├── Build system prompt
 │     ├── Run agent loop inline
 │     └── Return result synchronously
 │
 └── [run_in_background=true] → background subagent
       ├── Allocate output file
       ├── Spawn background process
       └── Return { taskId, outputFile } immediately
```

---

## 1. Tool Definition Object

### AgentTool (QW6) - Main entry point for subagent execution

**What it does:** Provides the Agent tool interface that allows the LLM to spawn subagents — child Claude instances that run with their own conversation history, system prompt, and (optionally) their own isolated worktree.

**How it works:**

```javascript
// ============================================
// AgentTool - Agent spawning tool definition
// Location: chunks.136.mjs:1512-1630
// ============================================

// ORIGINAL (for source lookup):
QW6 = {
    async prompt({ agents: A, tools: q, getToolPermissionContext: K, allowedAgentTypes: Y }) { ... },
    name: r4,              // "Agent"
    searchHint: "delegate work to a subagent",
    aliases: [I46],        // ["Task"]
    maxResultSizeChars: 1e5,
    async description() { return "Launch a new agent" },
    get inputSchema() { return xx8() },
    get outputSchema() { return eVY() },
    async call({ prompt: A, subagent_type: q, description: K, model: Y, resume: z, run_in_background: _, name: w, team_name: O, mode: $, isolation: H, cwd: j }, J, M, D, X) { ... }
}

// READABLE (for understanding):
const AgentTool = {
    name: "Agent",
    aliases: ["Task"],      // "Task" is an alias for backward compatibility
    searchHint: "delegate work to a subagent",
    maxResultSizeChars: 100000,

    async prompt({ agents, tools, getToolPermissionContext, allowedAgentTypes }) {
        // Build agent prompt with available tools and agent definitions
        let toolPermissionContext = await getToolPermissionContext();
        let mcpServers = [];
        for (let tool of tools) {
            if (tool.name?.startsWith("mcp__")) {
                let serverName = tool.name.split("__")[1];
                if (serverName && !mcpServers.includes(serverName)) {
                    mcpServers.push(serverName);
                }
            }
        }
        let agentDefinitions = filterAgentsByMcpServers(agents, mcpServers);
        let toolFilteredDefinitions = filterToolsByRules(agentDefinitions, toolPermissionContext, "Agent");
        return await buildAgentPrompt(toolFilteredDefinitions, false, allowedAgentTypes);
    },

    async description() {
        return "Launch a new agent";
    },

    get inputSchema() {
        return agentInputSchema();  // xx8
    },

    get outputSchema() {
        return agentOutputSchema();  // eVY
    },

    async call(input, context, toolContext, invocationContext, sessionContext) {
        // ... (full implementation in Execution section)
    }
}

// Mapping: QW6→AgentTool, r4→TOOL_NAME_AGENT, I46→TOOL_NAME_TASK, xx8→agentInputSchema,
//          eVY→agentOutputSchema
```

---

## 2. Input Schema

### Agent Tool Input Schema (v2.1.76)

**What it does:** Defines the parameters the LLM can pass to the Agent tool, including the new `model`, `run_in_background`, and `isolation` parameters added in recent versions.

```javascript
// ============================================
// agentInputSchema - Agent tool input validation
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
const agentInputSchema = z.strictObject({
    description: z.string()
        .describe("A brief description of what this agent will do. Used for display in the UI."),

    prompt: z.string()
        .describe("The task or instructions to send to the subagent."),

    subagent_type: z.enum(["general", "code", "research", "data"])
        .optional()
        .describe("The type of subagent to spawn. Controls the system prompt template."),

    // v2.1.72+: Per-invocation model selection (restored after being removed)
    model: z.string()
        .optional()
        .describe("The model ID to use for this agent invocation. If not specified, inherits from parent session."),

    resume: z.string()
        .optional()
        .describe("Session ID to resume. If provided, the agent continues from a previous session."),

    // v2.1.76: Explicit background execution mode
    run_in_background: z.boolean()
        .optional()
        .default(false)
        .describe("If true, the agent runs asynchronously in the background. Returns immediately with a taskId."),

    max_turns: z.number()
        .optional()
        .describe("Maximum number of agent turns before forcing completion."),

    name: z.string()
        .optional()
        .describe("Optional display name for this agent in the UI."),

    team_name: z.string()
        .optional()
        .describe("If set, assigns this agent to a named team for coordination."),

    mode: z.enum(["normal", "plan", "auto"])
        .optional()
        .describe("Execution mode: normal (default), plan (plan-first), or auto."),

    // v2.1.76: Declarative worktree isolation
    isolation: z.enum(["none", "worktree"])
        .optional()
        .default("none")
        .describe("Isolation mode. 'worktree' creates a dedicated git worktree for this agent.")
});
```

**Key changes in v2.1.76:**
1. `model` parameter: Restored in v2.1.72. Allows per-invocation model selection, overriding the parent session's model
2. `run_in_background: true`: Explicit flag for background execution instead of a separate tool
3. `isolation: "worktree"`: New declarative support — the Agent tool creates the worktree automatically rather than requiring manual `EnterWorktree` calls

---

## 3. Execution Modes

### Mode 1: Foreground Execution (run_in_background=false)

**What it does:** Runs the subagent inline within the current session. The parent agent waits for the subagent to complete before continuing.

**How it works:**

```javascript
// ============================================
// Foreground Subagent Execution
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
async function foregroundAgentExecution(input, context) {
    // Build subagent context
    let systemPrompt = await buildSubagentSystemPrompt(input.subagent_type);
    let toolSet = getToolSetForAgent(input.subagent_type);

    // Resolve model: use input.model if specified, else inherit from parent
    let model = input.model
        ? resolveModelById(input.model)
        : context.sessionConfig.model;

    // Apply worktree isolation if requested
    let executionCwd = context.cwd;
    if (input.isolation === "worktree") {
        executionCwd = await createAgentWorktree(context.cwd);
    }

    // Run agent loop synchronously
    let result = await runAgentLoop({
        messages: [{ role: "user", content: input.prompt }],
        systemPrompt,
        tools: toolSet,
        model,
        maxTurns: input.max_turns ?? DEFAULT_MAX_TURNS,
        cwd: executionCwd,
        sessionId: input.resume,
        mode: input.mode ?? "normal"
    });

    // Cleanup worktree if created
    if (input.isolation === "worktree") {
        await cleanupAgentWorktree(executionCwd);
    }

    return {
        data: {
            result: result.finalMessage,
            sessionId: result.sessionId,
            turns: result.turnsUsed
        }
    };
}
```

**Why foreground:**
- Simpler execution model — result is directly available
- Enables parent agent to use subagent results immediately
- Works naturally with the agent loop's sequential message handling

---

### Mode 2: Background Execution (run_in_background=true)

**What it does:** Spawns the subagent asynchronously. Returns a `taskId` and `outputFile` path immediately, allowing the parent agent to continue while the subagent works independently.

**How it works:**

```javascript
// ============================================
// Background Subagent Execution
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
async function backgroundAgentExecution(input, context) {
    // Generate unique task ID
    let taskId = generateUUID();

    // Allocate output file path
    let outputDir = getTaskOutputDir();
    let outputFile = path.join(outputDir, `${taskId}.json`);

    // Spawn background process with restricted tool set
    let backgroundProcess = spawnBackgroundAgent({
        taskId,
        prompt: input.prompt,
        subagent_type: input.subagent_type,
        model: input.model,
        outputFile,
        allowedTools: BACKGROUND_AGENT_ALLOWED_TOOLS,  // Bj1
        cwd: context.cwd,
        isolation: input.isolation  // Passed through for worktree isolation
    });

    // Register task in task registry
    registerBackgroundTask(taskId, backgroundProcess, outputFile);

    // Return immediately — parent continues
    return {
        data: {
            taskId,
            outputFile,
            status: "running"
        }
    };
}
```

**Background agent tool restrictions:**
Background agents use `BACKGROUND_AGENT_ALLOWED_TOOLS` (Bj1) — a more restricted set than foreground agents — to prevent runaway background agents from taking dangerous actions without supervision.

**Pattern:**
```
Parent agent:
  1. Calls Agent(prompt="...", run_in_background=true)
  2. Receives { taskId: "abc-123", outputFile: "/tmp/tasks/abc-123.json" }
  3. Continues other work
  4. Later: checks TaskGet("abc-123") or reads outputFile to get result
```

---

## 4. Model Parameter (v2.1.72+)

### Per-Invocation Model Selection

**What it does:** Allows the LLM to select a specific model for a subagent, independent of the parent session's model.

**Why this matters:**
- Use a faster/cheaper model for simple research tasks: `model: "claude-haiku-3-5"`
- Use the most capable model for complex coding tasks: `model: "claude-opus-4-5"`
- The parent agent (possibly running claude-sonnet) can spawn specialized subagents

**How model resolution works:**

```javascript
// ============================================
// resolveAgentModel - Per-invocation model resolution
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
function resolveAgentModel(inputModel, parentSessionModel) {
    if (!inputModel) {
        // No model specified → inherit parent
        return parentSessionModel;
    }

    // Validate model ID exists in available models
    let availableModels = getAvailableModels();
    let matchedModel = availableModels.find(m =>
        m.id === inputModel ||
        m.aliases?.includes(inputModel)
    );

    if (!matchedModel) {
        throw new Error(`Unknown model: ${inputModel}. Available: ${availableModels.map(m => m.id).join(", ")}`);
    }

    return matchedModel;
}
```

**History note:** The `model` parameter was in an earlier version, removed in an intermediate release, then restored in v2.1.72. This restoration enables the hierarchical multi-model patterns common in agent swarms.

---

## 5. Worktree Isolation (isolation: "worktree")

### Declarative Worktree Support

**What it does:** When `isolation: "worktree"` is specified, the Agent tool automatically creates a new git worktree for the subagent, isolating its file modifications from the parent workspace. Previously this required manual `EnterWorktree` calls.

**How it works:**

```javascript
// ============================================
// createAgentWorktree - Worktree creation for isolated agents
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
async function createAgentWorktree(parentCwd) {
    // Generate unique branch name for this agent
    let branchName = `agent/task-${Date.now()}`;

    // Create worktree in temp directory
    let worktreePath = path.join(os.tmpdir(), `claude-worktree-${generateShortId()}`);

    // Create worktree from current HEAD
    await execGit(['worktree', 'add', '-b', branchName, worktreePath, 'HEAD'], {
        cwd: parentCwd
    });

    return worktreePath;
}

async function cleanupAgentWorktree(worktreePath) {
    // Remove worktree when agent completes
    await execGit(['worktree', 'remove', '--force', worktreePath]);
}
```

**Use cases:**
1. **Parallel file modification**: Multiple agents can edit the same files concurrently without conflicts (each in their own worktree)
2. **Experimental changes**: Subagent can try an approach; parent decides whether to merge results
3. **Safe code generation**: Generated code runs in isolation, preventing accidental overwrites

**vs. Manual EnterWorktree:**
- `isolation: "worktree"` is fully automatic — worktree is created before the agent starts and cleaned up after
- Manual `EnterWorktree` gives more control but requires explicit management
- For most cases, `isolation: "worktree"` is preferred

---

## 6. Tool Sets for Agents

### DELEGATE_ALLOWED_TOOLS (R_6) — Foreground agents

**What it does:** Defines which tools foreground subagents can use.

```javascript
// READABLE (for understanding):
const DELEGATE_ALLOWED_TOOLS = new Set([
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Grep",
    "Glob",
    "Agent",           // Can spawn sub-subagents
    "WebFetch",
    "WebSearch",
    "NotebookEdit",
    "TodoWrite",
    "TodoRead",
    "LS",
    // ... LSP tools, MCP tools (dynamic)
]);
```

### BACKGROUND_AGENT_ALLOWED_TOOLS (Bj1) — Background agents

**What it does:** More restricted tool set for background agents.

```javascript
// READABLE (for understanding):
const BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Grep",
    "Glob",
    "WebFetch",
    "WebSearch",
    "TodoWrite",
    "TaskOutput",  // Required: report results
    // Note: No "Agent" — background agents cannot spawn sub-agents
    // Note: No team coordination tools
]);
```

**Why background agents are more restricted:**
1. They run unattended — no user to approve dangerous actions
2. Preventing agent proliferation — background agents spawning their own background agents would be uncontrollable
3. TaskOutput is required — background agents must write results somewhere the parent can read

---

## 7. Resume Capability

### Continuing Previous Sessions

**What it does:** The `resume` parameter allows spawning an agent that continues from a previous session, preserving conversation history and file state.

```javascript
// ============================================
// Session Resume Logic
// Location: chunks.149.mjs
// ============================================

// READABLE (for understanding):
async function resumeAgentSession(sessionId, newPrompt) {
    // Load previous session messages
    let previousMessages = await loadSessionTranscript(sessionId);

    // Append new user message
    let messages = [
        ...previousMessages,
        { role: "user", content: newPrompt }
    ];

    // Continue with same context
    return runAgentLoop({
        messages,
        // ... other config from saved session
    });
}
```

**Use cases:**
- Multi-turn agent workflows where each turn is a separate invocation
- Retry a failed agent task from its last known good state
- Human-in-the-loop patterns: agent pauses, human reviews, agent continues

---

## 8. UI Rendering

### renderToolUseMessage — Compact header

```javascript
// Display while agent is running:
// ⠋ Agent (Researching codebase architecture)
//     ↑ description field used as display text
```

### renderToolResultMessage — Completed result

```javascript
// Display after agent completes:
// ✓ Agent (Researching codebase architecture)
//   Agent completed in 12 turns.
//   Result: Found 3 key architectural patterns...
```

---

## 9. Key Design Decisions

### Why Agent tool is auto-approved (no permission prompt)

**Rationale:** The Agent tool spawns a child process that runs with the same permission level as the parent. The child uses its own tool permission checks for any destructive operations. Showing a permission prompt for `Agent` would be confusing and redundant — the user already approved the parent session's permissions.

**Key insight:** Security comes from the child's tool permissions, not from blocking agent spawning itself.

### Why run_in_background is a parameter (not a separate tool)

**Rationale:** In earlier versions, foreground and background agent spawning were separate code paths. Consolidating into one tool with a `run_in_background` boolean:
1. Simplifies the LLM's decision — same tool, same schema
2. Allows the same `description`, `prompt`, `model`, `isolation` parameters to work for both modes
3. Makes migration between modes trivial (just change one flag)

---

## 10. Related Documents

- [worktree_tools.md](./worktree_tools.md) - EnterWorktree/ExitWorktree manual worktree management
- [cron_tools.md](./cron_tools.md) - CronCreate/CronDelete/CronList for scheduled background agents
- [task_management_tools.md](./task_management_tools.md) - TaskGet/TaskList for monitoring background agents
- [tool_registry.md](./tool_registry.md) - Complete tool registry
- [tool_execution_pipeline.md](./tool_execution_pipeline.md) - Execution pipeline
