# Subagent Architecture (Claude Code 2.1.7)

> **Related:** [execution.md](./execution.md) | [tool_restrictions.md](./tool_restrictions.md) | [Background Agents](../26_background_agents/background_agents.md)

---

## Overview

Claude Code implements a **subagent system** that allows the main agent to delegate complex, multi-step tasks to specialized sub-agents. This architecture enables:

1. **Parallel task execution** - Multiple agents running concurrently
2. **Specialized expertise** - Different agents for different task types
3. **Efficient context usage** - Each agent has its own context window
4. **Background processing** - Agents can run asynchronously

### Core Design Principles

- **Stateless**: Subagents cannot receive additional messages after spawning
- **One-shot**: Each agent returns a single final report
- **Isolated**: Subagents have their own context and cannot modify parent state
- **Resumable**: Agents can be resumed from previous execution transcripts

---

## Task Tool

The subagent system is accessed through the **Task tool** (`f3 = "Task"`).

**Location:** `chunks.113.mjs:83`

### Input Schema

```javascript
// ============================================
// taskInputSchema - Task tool input validation
// Location: chunks.113.mjs:30-38
// ============================================

// ORIGINAL (for source lookup):
uP2 = m.object({
  description: m.string().describe("A short (3-5 word) description of the task"),
  prompt: m.string().describe("The task for the agent to perform"),
  subagent_type: m.string().describe("The type of specialized agent to use for this task"),
  model: m.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model to use for this agent. If not specified, inherits from parent. Prefer haiku for quick, straightforward tasks to minimize cost and latency."),
  resume: m.string().optional().describe("Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript."),
  run_in_background: m.boolean().optional().describe(`Set to true to run this agent in the background. The tool result will include an output_file path...`),
  max_turns: m.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping. Used internally for warmup.")
})

// READABLE (for understanding):
taskInputSchema = zod.object({
  description: zod.string().describe("A short (3-5 word) description of the task"),
  prompt: zod.string().describe("The task for the agent to perform"),
  subagent_type: zod.string().describe("The type of specialized agent to use for this task"),
  model: zod.enum(["sonnet", "opus", "haiku"]).optional(),
  resume: zod.string().optional(),
  run_in_background: zod.boolean().optional(),
  max_turns: zod.number().int().positive().optional()  // NEW in 2.1.x
})

// Mapping: uP2→taskInputSchema, m→zod
```

### Output Schema

```javascript
// ============================================
// taskOutputSchema - Task tool output types
// Location: chunks.113.mjs:64-73
// ============================================

// ORIGINAL (for source lookup):
Gf5 = Bf5.extend({
  status: m.literal("completed"),
  prompt: m.string()
}), Zf5 = m.object({
  status: m.literal("async_launched"),
  agentId: m.string(),
  description: m.string(),
  prompt: m.string(),
  outputFile: m.string()
}), Yf5 = m.union([Gf5, Zf5, X52])

// READABLE (for understanding):
completedOutputSchema = baseOutputSchema.extend({
  status: zod.literal("completed"),
  prompt: zod.string()
})

asyncLaunchedOutputSchema = zod.object({
  status: zod.literal("async_launched"),
  agentId: zod.string(),
  description: zod.string(),
  prompt: zod.string(),
  outputFile: zod.string()
})

taskOutputSchema = zod.union([completedOutputSchema, asyncLaunchedOutputSchema, subAgentEnteredSchema])

// Mapping: Gf5→completedOutputSchema, Zf5→asyncLaunchedOutputSchema, Yf5→taskOutputSchema, Bf5→baseOutputSchema
```

**Output Types:**
- `completed` - Agent finished synchronously, includes content and usage
- `async_launched` - Agent running in background, includes outputFile path
- `sub_agent_entered` - Special status for fork context entry

---

## Agent Definition Schema

Each agent is defined with the following properties:

```javascript
// ============================================
// Agent Definition Structure (inferred from usage)
// ============================================

{
  agentType: string,           // Unique identifier (e.g., "general-purpose", "Explore")
  whenToUse: string,           // Description shown to main agent for selection
  tools: Array<string>,        // Tools available to agent (["*"] = all tools)
  disallowedTools: Array,      // Tools explicitly blocked (optional)
  source: string,              // "built-in", "plugin", "userSettings", etc.
  baseDir: string,             // Base directory for the agent
  model: string,               // "sonnet", "haiku", "opus", or "inherit"
  color: string,               // UI color for the agent (optional)
  permissionMode: string,      // "dontAsk" or default (optional)
  forkContext: boolean,        // Whether agent can access conversation history (optional)
  getSystemPrompt: function,   // Function that returns the system prompt
  criticalSystemReminder_EXPERIMENTAL: string,  // Critical reminder (optional)
  skills: Array<string>,       // Skill names to preload (optional)
  callback: function           // Callback after agent completes (optional)
}
```

### Key Properties

| Property | Description |
|----------|-------------|
| `agentType` | Unique identifier for selection via `subagent_type` parameter |
| `whenToUse` | Natural language description shown to main agent |
| `tools` | `["*"]` grants all tools, specific array limits access |
| `disallowedTools` | Explicit tool blocks (used for read-only agents) |
| `model` | `"inherit"` uses parent model, others specify fixed model |
| `forkContext` | When `true`, agent receives conversation history |

---

## Built-in Agents (6 in v2.1.7)

> **Change from v2.0.59:** Added new `Bash` agent (total: 6 vs 5)

### 1. Bash Agent (NEW in 2.1.x)

**Location:** `chunks.93.mjs:19-27`

```javascript
// ============================================
// bashAgent - Command execution specialist
// Location: chunks.93.mjs:19-27
// ============================================

// ORIGINAL (for source lookup):
K52 = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [X9],  // Only Bash tool
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",
  getSystemPrompt: () => rZ5
}

// READABLE (for understanding):
bashAgent = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [BASH_TOOL_NAME],
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",  // Uses parent model
  getSystemPrompt: () => bashSystemPrompt
}

// Mapping: K52→bashAgent, X9→BASH_TOOL_NAME, rZ5→bashSystemPrompt
```

**Key characteristics:**
- Only has access to Bash tool
- Uses `inherit` model (same as parent)
- For git operations and command execution

---

### 2. general-purpose Agent

**Location:** `chunks.93.mjs:33-56`

```javascript
// ============================================
// generalPurposeAgent - Full capabilities agent
// Location: chunks.93.mjs:33-56
// ============================================

// ORIGINAL (for source lookup):
$Y1 = {
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
  tools: ["*"],
  source: "built-in",
  baseDir: "built-in",
  getSystemPrompt: () => `You are an agent for Claude Code...`
}

// READABLE (for understanding):
generalPurposeAgent = {
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions...",
  tools: ["*"],  // All tools available
  source: "built-in",
  baseDir: "built-in",
  // No model specified → uses default (sonnet)
  getSystemPrompt: () => generalPurposeSystemPrompt
}

// Mapping: $Y1→generalPurposeAgent
```

**Key characteristics:**
- Access to ALL tools (`["*"]`)
- Default model (no explicit specification)
- For complex research and multi-step tasks

---

### 3. statusline-setup Agent

**Location:** `chunks.93.mjs:61-170`

```javascript
// ============================================
// statuslineSetupAgent - Status line configuration
// Location: chunks.93.mjs:61-170
// ============================================

// ORIGINAL (for source lookup):
F52 = {
  agentType: "statusline-setup",
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: ["Read", "Edit"],
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",
  color: "orange",
  getSystemPrompt: () => `You are a status line setup agent...`
}

// READABLE (for understanding):
statuslineSetupAgent = {
  agentType: "statusline-setup",
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: ["Read", "Edit"],  // Very limited toolset
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",  // Fixed to sonnet
  color: "orange",
  getSystemPrompt: () => statuslineSystemPrompt
}

// Mapping: F52→statuslineSetupAgent
```

**Key characteristics:**
- Only Read and Edit tools
- Fixed to sonnet model
- Orange UI color
- Specialized for PS1 → statusLine conversion

---

### 4. Explore Agent

**Location:** `chunks.93.mjs:219-228`

```javascript
// ============================================
// exploreAgent - Fast codebase explorer
// Location: chunks.93.mjs:219-228
// ============================================

// ORIGINAL (for source lookup):
MS = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns...',
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  getSystemPrompt: () => sZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
exploreAgent = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases...',
  disallowedTools: [TASK_TOOL_NAME, EXIT_PLAN_MODE_NAME, ENTER_PLAN_MODE_NAME, ASKUSER_NAME, KILLSHELL_NAME],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",  // Fast, cheap
  getSystemPrompt: () => exploreSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task..."
}

// Mapping: MS→exploreAgent, f3→TASK_TOOL_NAME, CY1→EXIT_PLAN_MODE_NAME, I8→ENTER_PLAN_MODE_NAME, BY→ASKUSER_NAME, tq→KILLSHELL_NAME
```

**Key characteristics:**
- Uses haiku for speed
- Read-only (critical reminder enforced)
- Blocks: Task, EnterPlanMode, ExitPlanMode, AskUserQuestion, KillShell
- For fast file searches and codebase exploration

---

### 5. Plan Agent

**Location:** `chunks.93.mjs:289-299`

```javascript
// ============================================
// planAgent - Software architect planner
// Location: chunks.93.mjs:289-299
// ============================================

// ORIGINAL (for source lookup):
UY1 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  tools: MS.tools,  // Same as Explore
  baseDir: "built-in",
  model: "inherit",
  getSystemPrompt: () => tZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task..."
}

// READABLE (for understanding):
planAgent = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [TASK_TOOL_NAME, EXIT_PLAN_MODE_NAME, ENTER_PLAN_MODE_NAME, ASKUSER_NAME, KILLSHELL_NAME],
  source: "built-in",
  tools: exploreAgent.tools,  // Inherits Explore's tools
  baseDir: "built-in",
  model: "inherit",  // Uses parent model
  getSystemPrompt: () => planSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task..."
}

// Mapping: UY1→planAgent, tZ5→planSystemPrompt
```

**Key characteristics:**
- Uses `inherit` model (same as parent)
- Same tool restrictions as Explore
- Read-only (critical reminder enforced)
- For architectural planning and design

---

### 6. claude-code-guide Agent

**Location:** `chunks.93.mjs:382-449`

```javascript
// ============================================
// claudeCodeGuideAgent - Documentation helper
// Location: chunks.93.mjs:382-449
// ============================================

// ORIGINAL (for source lookup):
AY5 = "claude-code-guide"
z52 = {
  agentType: AY5,
  whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool)...; (2) Claude Agent SDK...; (3) Claude API...',
  tools: [lI, DI, z3, cI, aR],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  permissionMode: "dontAsk",
  getSystemPrompt({toolUseContext: A}) { ... }
}

// READABLE (for understanding):
CLAUDE_CODE_GUIDE_NAME = "claude-code-guide"
claudeCodeGuideAgent = {
  agentType: CLAUDE_CODE_GUIDE_NAME,
  whenToUse: 'Use this agent when the user asks questions about: (1) Claude Code; (2) Claude Agent SDK; (3) Claude API...',
  tools: [GLOB_NAME, GREP_NAME, READ_NAME, WEBFETCH_NAME, WEBSEARCH_NAME],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  permissionMode: "dontAsk",  // No permission prompts
  getSystemPrompt(context) { /* Dynamic based on user config */ }
}

// Mapping: AY5→CLAUDE_CODE_GUIDE_NAME, z52→claudeCodeGuideAgent, lI→GLOB_NAME, DI→GREP_NAME, z3→READ_NAME, cI→WEBFETCH_NAME, aR→WEBSEARCH_NAME
```

**Key characteristics:**
- Uses haiku for speed
- `permissionMode: "dontAsk"` - No permission prompts
- **NEW in 2.1.x:** Covers 3 domains (Claude Code, Agent SDK, Claude API)
- Dynamic system prompt based on user's configuration
- **SDK excluded:** Not loaded when `CLAUDE_CODE_ENTRYPOINT` is sdk-ts/sdk-py/sdk-cli

---

## Built-in Agents Summary

```javascript
// ============================================
// getBuiltInAgents - Returns all built-in agents
// Location: chunks.93.mjs:458-462
// ============================================

// ORIGINAL (for source lookup):
function ED0() {
  let A = [K52, $Y1, F52, MS, UY1];
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(z52);
  return A
}

// READABLE (for understanding):
function getBuiltInAgents() {
  let agents = [bashAgent, generalPurposeAgent, statuslineSetupAgent, exploreAgent, planAgent];
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
    agents.push(claudeCodeGuideAgent);
  }
  return agents;
}

// Mapping: ED0→getBuiltInAgents
```

| Agent | Model | Tools | Key Use Case |
|-------|-------|-------|--------------|
| Bash | inherit | Bash only | Git, commands |
| general-purpose | (default) | All | Research, multi-step |
| statusline-setup | sonnet | Read, Edit | Status line config |
| Explore | haiku | Read-only | Fast code search |
| Plan | inherit | Read-only | Architecture planning |
| claude-code-guide | haiku | Read + Web | Documentation help |

---

## Agent Loading & Priority

Agents are loaded from multiple sources with priority-based deduplication:

### Source Priority (lowest to highest)

1. `built-in` - Default agents
2. `plugin` - From plugins
3. `userSettings` - From user's settings.json
4. `projectSettings` - From project's .claude/settings.json
5. `flagSettings` - From command-line flags
6. `policySettings` - From managed policy (highest priority)

**Key insight:** Higher priority sources override lower ones. If `projectSettings` defines an agent with the same `agentType` as a built-in, the project version is used.

---

## Agent Filtering by Permission Rules

When the Task tool is called, available agents are filtered by permission rules:

```javascript
// ============================================
// filterAgentsByPermission - Filters agents by deny rules
// Location: chunks.147.mjs:1511-1513
// ============================================

// ORIGINAL (for source lookup):
function mz0(A, Q, B) {
  return A.filter((G) => cz0(Q, B, G.agentType) === null)
}

// Where cz0 finds matching deny rules:
function cz0(A, Q, B) {
  return _d(A).find((G) => G.ruleValue.toolName === Q && G.ruleValue.ruleContent === B) || null
}

// READABLE (for understanding):
function filterAgentsByPermission(agents, permissionContext, toolName) {
  return agents.filter((agent) => {
    // Check if there's a deny rule for this agent type
    let denyRule = findDenyRule(permissionContext, toolName, agent.agentType);
    return denyRule === null;  // Keep agent if no deny rule
  });
}

// Mapping: mz0→filterAgentsByPermission, cz0→findDenyRule, _d→getDenyRules
```

**How it works:**
1. Permission context contains rules from settings and policies
2. `Task(agentType)` can be explicitly denied via permission rules
3. Denied agents are filtered out before being shown to the main agent

**Example deny rule in settings.json:**
```json
{
  "permissions": {
    "deny": [
      {"tool": "Task", "args": "Explore"}
    ]
  }
}
```

This would prevent the main agent from spawning the Explore agent.

---

## Task Tool Prompt Generation

The Task tool's prompt (shown to the main agent) is dynamically generated based on available agents:

```javascript
// ============================================
// generateTaskToolPrompt - Builds Task tool description
// Location: chunks.92.mjs:544-617
// ============================================

// ORIGINAL (for source lookup):
async function O82(A) {
  let Q = A.map((B) => {
    let G = "";
    if (B?.forkContext) G = "Properties: " + (B?.forkContext ? "access to current context; " : "");
    let Z = fG5(B);  // Format tools list
    return `- ${B.agentType}: ${B.whenToUse} (${G}Tools: ${Z})`
  }).join(`\n`);
  return `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${f3} tool launches specialized agents...

Available agent types and the tools they have access to:
${Q}

When using the ${f3} tool, you must specify a subagent_type parameter...
...
`
}

// READABLE (for understanding):
async function generateTaskToolPrompt(availableAgents) {
  // Build agent list with properties
  let agentDescriptions = availableAgents.map((agent) => {
    let properties = "";
    if (agent?.forkContext) {
      properties = "Properties: access to current context; ";
    }
    let toolsList = formatAgentTools(agent);
    return `- ${agent.agentType}: ${agent.whenToUse} (${properties}Tools: ${toolsList})`;
  }).join("\n");

  return `Launch a new agent to handle complex, multi-step tasks autonomously.

The Task tool launches specialized agents (subprocesses) that autonomously handle complex tasks...

Available agent types and the tools they have access to:
${agentDescriptions}

When using the Task tool, you must specify a subagent_type parameter...

Usage notes:
- Always include a short description (3-5 words)
- Launch multiple agents concurrently when possible (single message with multiple tool uses)
- Agents can be resumed using the \`resume\` parameter
- Agents with "access to current context" can see conversation history
...`;
}

// Mapping: O82→generateTaskToolPrompt, f3→TASK_TOOL_NAME, fG5→formatAgentTools
```

### Agent Tools Formatting

```javascript
// ============================================
// formatAgentTools - Formats agent's tools for display
// Location: chunks.92.mjs:535-542
// ============================================

// ORIGINAL (for source lookup):
function fG5(A) {
  let Q = A.tools,
    B = A.disallowedTools ?? [];
  if (Q && Q.length > 0 && Q[0] !== "*") return Q.join(", ");
  else if (Z) return `All tools except ${B.join(", ")}`;
  return "All tools"
}

// READABLE (for understanding):
function formatAgentTools(agent) {
  let tools = agent.tools;
  let disallowedTools = agent.disallowedTools ?? [];

  // Explicit tool list
  if (tools && tools.length > 0 && tools[0] !== "*") {
    return tools.join(", ");
  }

  // All tools with exclusions
  if (disallowedTools.length > 0) {
    return `All tools except ${disallowedTools.join(", ")}`;
  }

  // All tools
  return "All tools";
}

// Mapping: fG5→formatAgentTools
```

**Example output shown to main agent:**
```
Available agent types and the tools they have access to:
- Bash: Command execution specialist... (Tools: Bash)
- general-purpose: General-purpose agent... (Tools: All tools)
- Explore: Fast codebase explorer... (Tools: All tools except Task, ExitPlanMode, EnterPlanMode, AskUserQuestion, KillShell)
- Plan: Software architect... (Properties: access to current context; Tools: All tools except Task, ExitPlanMode, EnterPlanMode, AskUserQuestion, KillShell)
```

### Dynamic Content

The prompt includes conditional sections based on environment:

| Condition | Content Added |
|-----------|---------------|
| `plan !== "pro"` | "Launch multiple agents concurrently" instruction |
| `!DISABLE_BACKGROUND_TASKS` | `run_in_background` parameter documentation |
| Agent has `forkContext: true` | "Properties: access to current context" |

---

## Plugin Agent Integration

Claude Code supports defining custom agents in plugins. This section covers how plugins define agents and how they integrate with the subagent system.

### Plugin Loading Flow

```javascript
// ============================================
// loadPlugins (DG) - Loads all plugins
// Location: chunks.130.mjs:3246-3263
// ============================================

// ORIGINAL (for source lookup):
DG = W0(async () => {
  let A = await OB7(),
    Q = [...A.plugins],
    B = [...A.errors],
    G = Qf0();
  if (G.length > 0) {
    let Y = await RB7(G);
    Q.push(...Y.plugins), B.push(...Y.errors)
  }
  k(`Found ${Q.length} plugins (${Q.filter((Y)=>Y.enabled).length} enabled, ${Q.filter((Y)=>!Y.enabled).length} disabled)`);
  let Z = Q.filter((Y) => Y.enabled);
  if (Z.length > 0) T9("plugins");
  return {
    enabled: Z,
    disabled: Q.filter((Y) => !Y.enabled),
    errors: B
  }
})

// READABLE (for understanding):
loadPlugins = memoize(async () => {
  // Load plugins from various sources
  let result = await loadPluginsFromPaths();
  let plugins = [...result.plugins];
  let errors = [...result.errors];

  // Load additional plugins from settings
  let additionalPaths = getAdditionalPluginPaths();
  if (additionalPaths.length > 0) {
    let additional = await loadPluginsFromAdditionalPaths(additionalPaths);
    plugins.push(...additional.plugins);
    errors.push(...additional.errors);
  }

  log(`Found ${plugins.length} plugins (${plugins.filter(p=>p.enabled).length} enabled, ${plugins.filter(p=>!p.enabled).length} disabled)`);

  let enabledPlugins = plugins.filter(p => p.enabled);
  if (enabledPlugins.length > 0) trackFeatureUsage("plugins");

  return {
    enabled: enabledPlugins,
    disabled: plugins.filter(p => !p.enabled),
    errors: errors
  };
});

// Mapping: DG→loadPlugins, OB7→loadPluginsFromPaths, Qf0→getAdditionalPluginPaths, RB7→loadPluginsFromAdditionalPaths, W0→memoize
```

### Plugin Agent Loading (O4A)

Plugins can define agents in two ways:
1. **Default directory**: `{plugin-root}/agents/` - all .md files are loaded
2. **Custom paths**: Via `agents` field in plugin.json

```javascript
// ============================================
// getPluginAgents (O4A) - Loads agents from all enabled plugins
// Location: chunks.93.mjs:554-587
// ============================================

// ORIGINAL (for source lookup):
O4A = W0(async () => {
  let {
    enabled: A,
    errors: Q
  } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  for (let G of A) {
    let Z = new Set;
    if (G.agentsPath) try {
      let Y = N52(G.agentsPath, G.name, G.source, Z);
      if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} agents from plugin ${G.name} default directory`)
    } catch (Y) {
      k(`Failed to load agents from plugin ${G.name} default directory: ${Y}`, {
        level: "error"
      })
    }
    if (G.agentsPaths)
      for (let Y of G.agentsPaths) try {
        let X = vA().statSync(Y);
        if (X.isDirectory()) {
          let I = N52(Y, G.name, G.source, Z);
          if (B.push(...I), I.length > 0) k(`Loaded ${I.length} agents from plugin ${G.name} custom path: ${Y}`)
        } else if (X.isFile() && Y.endsWith(".md")) {
          let I = w52(Y, G.name, [], G.source, Z);
          if (I) B.push(I), k(`Loaded agent from plugin ${G.name} custom file: ${Y}`)
        }
      } catch (J) {
        k(`Failed to load agents from plugin ${G.name} custom path ${Y}: ${J}`, {
          level: "error"
        })
      }
  }
  return k(`Total plugin agents loaded: ${B.length}`), B
})

// READABLE (for understanding):
getPluginAgents = memoize(async () => {
  let { enabled: enabledPlugins, errors: loadErrors } = await loadPlugins();
  let agents = [];

  if (loadErrors.length > 0) {
    log(`Plugin loading errors: ${loadErrors.map(e => formatError(e)).join(", ")}`);
  }

  for (let plugin of enabledPlugins) {
    let seenAgentNames = new Set();  // For deduplication within plugin

    // 1. Load from default agents/ directory
    if (plugin.agentsPath) {
      try {
        let loadedAgents = loadAgentsFromDirectory(plugin.agentsPath, plugin.name, plugin.source, seenAgentNames);
        agents.push(...loadedAgents);
        if (loadedAgents.length > 0) {
          log(`Loaded ${loadedAgents.length} agents from plugin ${plugin.name} default directory`);
        }
      } catch (error) {
        log(`Failed to load agents from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // 2. Load from custom paths (via plugin.json agents field)
    if (plugin.agentsPaths) {
      for (let customPath of plugin.agentsPaths) {
        try {
          let stats = fs.statSync(customPath);
          if (stats.isDirectory()) {
            let loadedAgents = loadAgentsFromDirectory(customPath, plugin.name, plugin.source, seenAgentNames);
            agents.push(...loadedAgents);
          } else if (stats.isFile() && customPath.endsWith(".md")) {
            let agent = loadAgentFromFile(customPath, plugin.name, [], plugin.source, seenAgentNames);
            if (agent) agents.push(agent);
          }
        } catch (error) {
          log(`Failed to load agents from plugin ${plugin.name} custom path ${customPath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin agents loaded: ${agents.length}`);
  return agents;
});

// Mapping: O4A→getPluginAgents, DG→loadPlugins, N52→loadAgentsFromDirectory, w52→loadAgentFromFile
```

### Plugin Agent Definition Format

Plugin agents are defined as Markdown files with YAML frontmatter:

```markdown
---
name: my-custom-agent
description: "Description shown to main agent for selection"
model: haiku           # Optional: sonnet, haiku, opus, or inherit
tools:                 # Optional: specific tools allowed
  - Read
  - Glob
  - Grep
disallowedTools:       # Optional: tools to block
  - Edit
  - Write
color: blue            # Optional: UI color
forkContext: true      # Optional: receive conversation history
permissionMode: dontAsk  # Optional: skip permission prompts
mcpServers:            # Optional: MCP server connections
  - name: myserver
    transport: stdio
    command: npx
    args: ["-y", "@mcp/myserver"]
hooks:                 # Optional: event hooks
  Stop:
    - matcher: ""
      hooks:
        - type: command
          command: echo "Agent completed"
---

Your agent's system prompt goes here.

This is the full markdown content that becomes the agent's system prompt.
```

**Agent Type Naming:**
- For plugin agents, the `agentType` is automatically constructed as: `{plugin-name}:{agent-name}`
- Example: Plugin `my-tools` with agent file `helper.md` → agentType `my-tools:helper`

```javascript
// ============================================
// loadAgentFromFile (w52) - Parses single agent file
// Location: chunks.93.mjs:499-539
// ============================================

// ORIGINAL (for source lookup):
function w52(A, Q, B, G, Z) {
  let Y = vA();
  if (Py(Y, A, Z)) return null;  // Skip if already seen
  try {
    let J = Y.readFileSync(A, { encoding: "utf-8" }),
      { frontmatter: X, content: I } = lK(J),
      D = X.name || ZY5(A).replace(/\.md$/, ""),
      K = [Q, ...B, D].join(":"),  // plugin:subdir:name
      V = X.description || X["when-to-use"] || `Agent from ${Q} plugin`,
      F = M4A(X.tools),
      H = RS(X.skills),
      E = X.color,
      z = X.model,
      $ = X.forkContext,
      O = I.trim();
    return {
      agentType: K,
      whenToUse: V,
      tools: F,
      ...H !== void 0 ? { skills: H } : {},
      getSystemPrompt: () => O,
      source: "plugin",
      color: E,
      model: z,
      filename: D,
      plugin: G,
      ...{}
    }
  } catch (J) {
    return k(`Failed to load agent from ${A}: ${J}`, { level: "error" }), null
  }
}

// READABLE (for understanding):
function loadAgentFromFile(filePath, pluginName, subdirs, pluginSource, seenNames) {
  let fs = getFs();
  if (alreadySeen(fs, filePath, seenNames)) return null;

  try {
    let content = fs.readFileSync(filePath, { encoding: "utf-8" });
    let { frontmatter, content: body } = parseFrontmatter(content);

    // Agent name from frontmatter or filename
    let name = frontmatter.name || getBasename(filePath).replace(/\.md$/, "");

    // Construct agentType: plugin:subdir:name
    let agentType = [pluginName, ...subdirs, name].join(":");

    let description = frontmatter.description || frontmatter["when-to-use"] || `Agent from ${pluginName} plugin`;
    let tools = parseToolsArray(frontmatter.tools);
    let skills = parseSkillsArray(frontmatter.skills);
    let systemPrompt = body.trim();

    return {
      agentType: agentType,
      whenToUse: description,
      tools: tools,
      ...(skills !== undefined ? { skills: skills } : {}),
      getSystemPrompt: () => systemPrompt,
      source: "plugin",
      color: frontmatter.color,
      model: frontmatter.model,
      filename: name,
      plugin: pluginSource,
    };
  } catch (error) {
    log(`Failed to load agent from ${filePath}: ${error}`, { level: "error" });
    return null;
  }
}

// Mapping: w52→loadAgentFromFile, lK→parseFrontmatter, M4A→parseToolsArray, RS→parseSkillsArray
```

### Agent Merging & Priority

All agents from different sources are merged with priority-based deduplication:

```javascript
// ============================================
// deduplicateAgents (mb) - Merges agents by priority
// Location: chunks.93.mjs:602-614
// ============================================

// ORIGINAL (for source lookup):
function mb(A) {
  let Q = A.filter((D) => D.source === "built-in"),
    B = A.filter((D) => D.source === "plugin"),
    G = A.filter((D) => D.source === "userSettings"),
    Z = A.filter((D) => D.source === "projectSettings"),
    Y = A.filter((D) => D.source === "policySettings"),
    J = A.filter((D) => D.source === "flagSettings"),
    X = [Q, B, G, Z, J, Y],  // Priority order: lowest to highest
    I = new Map;
  for (let D of X)
    for (let W of D) I.set(W.agentType, W);
  return Array.from(I.values())
}

// READABLE (for understanding):
function deduplicateAgents(allAgents) {
  // Group by source
  let builtIn = allAgents.filter(a => a.source === "built-in");
  let plugin = allAgents.filter(a => a.source === "plugin");
  let userSettings = allAgents.filter(a => a.source === "userSettings");
  let projectSettings = allAgents.filter(a => a.source === "projectSettings");
  let policySettings = allAgents.filter(a => a.source === "policySettings");
  let flagSettings = allAgents.filter(a => a.source === "flagSettings");

  // Priority order: lowest first, highest last
  // Later sources override earlier ones
  let priorityOrder = [builtIn, plugin, userSettings, projectSettings, flagSettings, policySettings];

  let agentMap = new Map();
  for (let sourceAgents of priorityOrder) {
    for (let agent of sourceAgents) {
      agentMap.set(agent.agentType, agent);  // Later overwrites earlier
    }
  }

  return Array.from(agentMap.values());
}

// Mapping: mb→deduplicateAgents
```

**Priority Implications:**
- A plugin can override a built-in agent by using the same `agentType`
- Project settings can override plugin agents
- Policy settings (managed) have highest priority and cannot be overridden

### Settings-based Agent Definition

Agents can also be defined in settings JSON files:

```json
// In .claude/settings.json
{
  "agents": {
    "my-agent": {
      "description": "Custom agent for special tasks",
      "prompt": "You are a specialized agent...",
      "tools": ["Read", "Glob"],
      "model": "haiku",
      "permissionMode": "dontAsk"
    }
  }
}
```

```javascript
// ============================================
// parseAgentFromJSON (DY5) - Parses single agent from JSON settings
// Location: chunks.93.mjs:638-672
// ============================================

// ORIGINAL (for source lookup):
function DY5(A, Q, B = "flagSettings") {
  try {
    let G = M52.parse(Q),
      Z = M4A(G.tools),
      Y = G.disallowedTools !== void 0 ? M4A(G.disallowedTools) : void 0,
      J = G.prompt;
    return {
      agentType: A,
      whenToUse: G.description,
      ...Z !== void 0 ? { tools: Z } : {},
      ...Y !== void 0 ? { disallowedTools: Y } : {},
      getSystemPrompt: () => J,
      source: B,
      ...G.model ? { model: G.model } : {},
      ...G.permissionMode ? { permissionMode: G.permissionMode } : {},
      ...G.mcpServers && G.mcpServers.length > 0 ? { mcpServers: G.mcpServers } : {},
      ...G.hooks ? { hooks: G.hooks } : {}
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    return k(`Error parsing agent '${A}' from JSON: ${Z}`), e(G instanceof Error ? G : Error(String(G))), null
  }
}

// READABLE (for understanding):
function parseAgentFromJSON(agentName, config, source = "flagSettings") {
  try {
    let validated = agentSchema.parse(config);
    let tools = parseToolsArray(validated.tools);
    let disallowedTools = validated.disallowedTools !== undefined ? parseToolsArray(validated.disallowedTools) : undefined;
    let systemPrompt = validated.prompt;

    return {
      agentType: agentName,
      whenToUse: validated.description,
      ...(tools !== undefined ? { tools: tools } : {}),
      ...(disallowedTools !== undefined ? { disallowedTools: disallowedTools } : {}),
      getSystemPrompt: () => systemPrompt,
      source: source,
      ...(validated.model ? { model: validated.model } : {}),
      ...(validated.permissionMode ? { permissionMode: validated.permissionMode } : {}),
      ...(validated.mcpServers?.length > 0 ? { mcpServers: validated.mcpServers } : {}),
      ...(validated.hooks ? { hooks: validated.hooks } : {}),
    };
  } catch (error) {
    let message = error instanceof Error ? error.message : String(error);
    log(`Error parsing agent '${agentName}' from JSON: ${message}`);
    return null;
  }
}

// Mapping: DY5→parseAgentFromJSON, M52→agentSchema
```

### Full Agent Loading Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    getAllAgents (kG5)                           │
│                    Location: chunks.93.mjs:780-856              │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ getBuiltInAgents│  │ getPluginAgents │  │ getSettingsAgents│
│     (ED0)       │  │     (O4A)       │  │ (from settings)  │
│ Returns: 5-6    │  │ Returns: [...]  │  │ Returns: [...]   │
│ built-in agents │  │ plugin agents   │  │ user/project     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Merge: [...getBuiltInAgents(), ...getPluginAgents(), ...G]      │
│ Where G = agents from settings (user, project, flag, policy)    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ deduplicateAgents (mb)                                          │
│ Priority: built-in < plugin < user < project < flag < policy    │
│ Later sources override earlier ones with same agentType         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Result: { activeAgents, allAgents, failedFiles }               │
│ - activeAgents: Deduplicated agents for use                    │
│ - allAgents: All agents before deduplication                   │
│ - failedFiles: Any agent files that failed to parse            │
└─────────────────────────────────────────────────────────────────┘
```

### Plugin Hook: SubagentStop Conversion

When agents from plugins define hooks for `Stop` event, they are automatically converted to `SubagentStop`:

```javascript
// ============================================
// registerFrontmatterHooks (j52) - Registers hooks from agent frontmatter
// Location: chunks.93.mjs:859-875
// ============================================

// ORIGINAL (for source lookup):
function j52(A, Q, B, G, Z = !1) {
  if (!B || Object.keys(B).length === 0) return;
  let Y = 0;
  for (let J of _b) {
    let X = B[J];
    if (!X || X.length === 0) continue;
    let I = J;
    if (Z && J === "Stop") I = "SubagentStop", k(`Converting Stop hook to SubagentStop for ${G} (subagents trigger SubagentStop)`);
    for (let D of X) {
      let W = D.matcher ?? "",
        K = D.hooks;
      if (!K || K.length === 0) continue;
      for (let V of K) pZ1(A, Q, I, W, V), Y++
    }
  }
  if (Y > 0) k(`Registered ${Y} frontmatter hook(s) from ${G} for session ${Q}`)
}

// READABLE (for understanding):
function registerFrontmatterHooks(hookContext, sessionId, hooksConfig, agentName, isSubagent = false) {
  if (!hooksConfig || Object.keys(hooksConfig).length === 0) return;

  let hookCount = 0;
  for (let hookType of HOOK_TYPES) {
    let hookEntries = hooksConfig[hookType];
    if (!hookEntries || hookEntries.length === 0) continue;

    let eventName = hookType;
    // Convert "Stop" to "SubagentStop" for subagent hooks
    if (isSubagent && hookType === "Stop") {
      eventName = "SubagentStop";
      log(`Converting Stop hook to SubagentStop for ${agentName} (subagents trigger SubagentStop)`);
    }

    for (let entry of hookEntries) {
      let matcher = entry.matcher ?? "";
      let hooks = entry.hooks;
      if (!hooks || hooks.length === 0) continue;

      for (let hook of hooks) {
        registerHook(hookContext, sessionId, eventName, matcher, hook);
        hookCount++;
      }
    }
  }

  if (hookCount > 0) {
    log(`Registered ${hookCount} frontmatter hook(s) from ${agentName} for session ${sessionId}`);
  }
}

// Mapping: j52→registerFrontmatterHooks, pZ1→registerHook, _b→HOOK_TYPES
```

**Why SubagentStop conversion?**
- When a plugin agent runs as a subagent, its "Stop" hook should fire on `SubagentStop` event
- This ensures the hook runs when the subagent completes, not when the main session ends

### Source Type Helpers

```javascript
// ============================================
// Source Type Helpers
// Location: chunks.93.mjs:590-600
// ============================================

// ORIGINAL (for source lookup):
function p_(A) { return A.source === "built-in" }
function R52(A) { return A.source !== "built-in" && A.source !== "plugin" }
function qY1(A) { return A.source === "plugin" }

// READABLE (for understanding):
function isBuiltInAgent(agent) { return agent.source === "built-in"; }
function isSettingsAgent(agent) { return agent.source !== "built-in" && agent.source !== "plugin"; }
function isPluginAgent(agent) { return agent.source === "plugin"; }

// Mapping: p_→isBuiltInAgent, R52→isSettingsAgent, qY1→isPluginAgent
```

### Plugin Agent Example

**Example: Creating a plugin agent**

1. Create plugin directory structure:
```
my-plugin/
├── plugin.json
└── agents/
    └── code-reviewer.md
```

2. Define plugin.json:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom plugin"
}
```

3. Create agent file (agents/code-reviewer.md):
```markdown
---
name: code-reviewer
description: "Specialized agent for reviewing code quality and suggesting improvements"
model: sonnet
tools:
  - Read
  - Glob
  - Grep
color: green
---

You are a code review specialist. Your job is to:

1. Analyze the code provided to you
2. Identify potential issues, bugs, or improvements
3. Suggest concrete fixes with code examples
4. Focus on readability, maintainability, and best practices

When reviewing code:
- Check for error handling
- Look for potential security issues
- Verify naming conventions
- Assess code organization
```

The agent will be available as `my-plugin:code-reviewer`.

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key symbols in this document:

**Task Tool:**
- `TaskTool` (xVA) - Task tool definition
- `taskInputSchema` (uP2) - Input validation schema
- `taskOutputSchema` (Yf5) - Output type union

**Built-in Agents:**
- `getBuiltInAgents` (ED0) - Built-in agents loader
- `bashAgent` (K52) - Bash agent definition
- `generalPurposeAgent` ($Y1) - General-purpose agent
- `statuslineSetupAgent` (F52) - Status line agent
- `exploreAgent` (MS) - Explore agent
- `planAgent` (UY1) - Plan agent
- `claudeCodeGuideAgent` (z52) - Guide agent
- `CLAUDE_CODE_GUIDE_NAME` (AY5) - Guide agent name constant

**Plugin Integration:**
- `loadPlugins` (DG) - Loads all plugins
- `getPluginAgents` (O4A) - Loads agents from plugins
- `loadAgentsFromDirectory` (N52) - Scans directory for agent files
- `loadAgentFromFile` (w52) - Parses single agent markdown file
- `deduplicateAgents` (mb) - Merges agents by priority
- `parseAgentFromJSON` (DY5) - Parses agent from JSON settings
- `parseAgentsFromJSON` (NY1) - Parses multiple agents from settings
- `isBuiltInAgent` (p_) - Checks if agent is built-in
- `isPluginAgent` (qY1) - Checks if agent is from plugin
- `isSettingsAgent` (R52) - Checks if agent is from settings
- `registerFrontmatterHooks` (j52) - Registers hooks from agent frontmatter

---

## See Also

- [execution.md](./execution.md) - Execution flow and patterns
- [tool_restrictions.md](./tool_restrictions.md) - Tool filtering system
- [builtin_agents.md](./builtin_agents.md) - Detailed built-in agents documentation
- [communication.md](./communication.md) - Communication patterns
- [error_handling.md](./error_handling.md) - Error handling patterns
- [integration.md](./integration.md) - System integration (Compact, Plan Mode, TodoWrite)
- [Background Agents](../26_background_agents/background_agents.md) - Async execution
- [Skill System](../10_skill/) - Skill-based execution (fork context)
