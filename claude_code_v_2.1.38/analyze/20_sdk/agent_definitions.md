# SDK Agent Definitions

## Overview

Claude Code includes a set of built-in agents that can be dispatched as subagents via the Task tool. These agents are specialized for different tasks and can be extended with custom agent definitions. In SDK mode, certain built-in agents are filtered out to provide a cleaner programmatic experience.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent definition symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `getBuiltinAgents` (APA) - Returns list of built-in agents (filters "guide" for SDK)
- `mergeAgentDefinitions` (hh) - Merges agents from multiple sources with priority
- `validateMcpServers` (KPA) - Validates agent's required MCP servers
- `filterByMcpServers` (un7) - Filters agents by available MCP servers
- `parseAgentFromJson` (tL9) - Parses agent definition from JSON
- `loadAgentDefinitions` (TB1) - Loads all agent definitions from files

---

## Built-in Agent Definitions

### Agent Definition Schema

Each agent definition follows this structure:

```typescript
interface AgentDefinition {
  agentType: string;           // Unique identifier (e.g., "general-purpose", "Bash")
  whenToUse: string;           // Description for the LLM to decide when to use
  tools?: string[];            // Allowed tools (["*"] for all)
  disallowedTools?: string[];  // Explicitly denied tools
  source: "built-in" | "userSettings" | "projectSettings" | "plugin" | "flagSettings";
  baseDir: string;             // Base directory for relative paths
  model?: string;              // Model override ("inherit", "haiku", "sonnet", "opus")
  getSystemPrompt: () => string;  // System prompt generator
  color?: string;              // UI color for agent indicator
  permissionMode?: string;     // Permission mode override
  mcpServers?: McpServerConfig[]; // Required MCP servers
  hooks?: HookConfig;          // Agent-specific hooks
  maxTurns?: number;           // Maximum turns for this agent
  skills?: string[];           // Associated skills
  memory?: "user" | "project" | "local"; // Memory scope
  forkContext?: boolean;       // Whether to fork context
  criticalSystemReminder_EXPERIMENTAL?: string; // Extra reminder injected as system reminder
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `agentType` | string | Unique identifier used to reference this agent |
| `whenToUse` | string | Description shown to main agent for dispatch decisions |
| `tools` | string[] | Whitelist of tool names. `["*"]` = all tools |
| `disallowedTools` | string[] | Blacklist of tool names (mutually exclusive with `tools`) |
| `source` | enum | Where agent was defined (determines override priority) |
| `baseDir` | string | Base directory for relative paths in hooks, prompts |
| `model` | enum | Model override: `"inherit"` (parent), `"haiku"`, `"sonnet"`, `"opus"` |
| `getSystemPrompt` | function | Returns system prompt string for this agent |
| `color` | string | UI indicator color (e.g., "orange", "blue") |
| `permissionMode` | enum | Permission mode: `"default"`, `"acceptEdits"`, `"bypassPermissions"` |
| `mcpServers` | array | Required MCP server configurations |
| `hooks` | object | Agent-specific hook configurations |
| `maxTurns` | number | Maximum turns this agent can take |
| `skills` | string[] | Skills associated with this agent |
| `memory` | enum | Memory scope: `"user"`, `"project"`, `"local"` |
| `forkContext` | boolean | Whether to fork conversation context |
| `criticalSystemReminder_EXPERIMENTAL` | string | Extra reminder text injected as a `<criticalSystemReminder>` tag. Used for read-only enforcement, safety constraints, etc. |

---

### BASH_AGENT (Tn7)

**What it does:** Command execution specialist for running bash commands. Used for git operations, command execution, and terminal tasks.

```javascript
// ============================================
// BASH_AGENT - Command execution specialist
// Location: chunks.90.mjs:2605-2617
// ============================================

// ORIGINAL (for source lookup):
Tn7 = {
    agentType: "Bash",
    whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
    tools: [h4],
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => UL9
}

// READABLE (for understanding):
const BASH_AGENT = {
    agentType: "Bash",
    whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
    tools: ["Bash"],
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => `You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.`
};

// Mapping: Tn7→BASH_AGENT, h4→TOOL_NAME_BASH, UL9→BASH_SYSTEM_PROMPT
```

**Key characteristics:**
- Only has access to the `Bash` tool
- Inherits model from parent session
- Designed for safe, focused command execution

---

### GENERAL_PURPOSE_AGENT (ZB1)

**What it does:** General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. This is the most versatile built-in agent.

```javascript
// ============================================
// GENERAL_PURPOSE_AGENT - Versatile multi-tool agent
// Location: chunks.90.mjs:2619-2645
// ============================================

// ORIGINAL (for source lookup):
ZB1 = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => `You are an agent for Claude Code...`
}

// READABLE (for understanding):
const GENERAL_PURPOSE_AGENT = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],  // All tools available
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => `You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: Use Grep or Glob when you need to search broadly. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication, avoid using emojis.`
};

// Mapping: ZB1→GENERAL_PURPOSE_AGENT
```

**Key characteristics:**
- Has access to ALL tools (`tools: ["*"]`)
- No model override (inherits from parent)
- Designed for open-ended research and multi-step tasks
- Emphasizes absolute paths in responses

---

### EXPLORE_AGENT (bv)

**What it does:** Fast agent specialized for exploring codebases. Used for file pattern matching, code searching, and answering questions about the codebase. Runs on Haiku model for speed.

```javascript
// ============================================
// EXPLORE_AGENT - Fast codebase exploration agent
// Location: chunks.90.mjs:2768-2818
// ============================================

// ORIGINAL (for source lookup):
bv = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: [fK, eO6, bq, f5, jM],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    getSystemPrompt: () => pL9,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const EXPLORE_AGENT = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: ["Task", "WebSearch", "Edit", "Write", "NotebookEdit"],  // READ-ONLY
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",  // Fast model
    getSystemPrompt: () => EXPLORE_SYSTEM_PROMPT,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};

// Mapping: bv→EXPLORE_AGENT, fK→TOOL_NAME_TASK, eO6→TOOL_NAME_WEB_SEARCH, bq→TOOL_NAME_EDIT, f5→TOOL_NAME_WRITE, jM→TOOL_NAME_NOTEBOOK_EDIT
```

**Key characteristics:**
- **READ-ONLY**: Cannot use Edit, Write, NotebookEdit, Task, or WebSearch tools
- Uses **Haiku model** for speed
- Supports thoroughness levels: "quick", "medium", "very thorough"
- Has `criticalSystemReminder_EXPERIMENTAL` field for extra safety reminder

**Why Haiku model:** The Explore agent is designed for fast, parallel searches. Using Haiku reduces latency and cost while still providing accurate file/code discovery.

---

### PLAN_AGENT (PJ6)

**What it does:** Software architect agent for designing implementation plans. Explores the codebase and creates step-by-step implementation strategies.

```javascript
// ============================================
// PLAN_AGENT - Software architect planning agent
// Location: chunks.90.mjs:2820-2889
// ============================================

// ORIGINAL (for source lookup):
PJ6 = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: [fK, eO6, bq, f5, jM],
    source: "built-in",
    tools: bv.tools,
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => dL9,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const PLAN_AGENT = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: ["Task", "WebSearch", "Edit", "Write", "NotebookEdit"],  // READ-ONLY
    source: "built-in",
    tools: EXPLORE_AGENT.tools,  // Same tools as Explore
    baseDir: "built-in",
    model: "inherit",  // Uses parent session's model
    getSystemPrompt: () => PLAN_SYSTEM_PROMPT,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};

// Mapping: PJ6→PLAN_AGENT, bv→EXPLORE_AGENT, dL9→PLAN_SYSTEM_PROMPT
```

**Key characteristics:**
- **READ-ONLY**: Same restrictions as Explore agent
- Inherits model from parent (unlike Explore which uses Haiku)
- Designed for architectural planning, not execution
- Returns "Critical Files for Implementation" section

**Why inherit model:** Planning requires deeper reasoning than exploration, so it uses the parent session's model (typically Sonnet or Opus) rather than forcing Haiku.

---

### STATUSLINE_SETUP_AGENT (En7)

**What it does:** Configures the user's Claude Code status line setting. Can import PS1 from shell config files.

```javascript
// ============================================
// STATUSLINE_SETUP_AGENT - Status line configuration agent
// Location: chunks.90.mjs:2647-2764
// ============================================

// ORIGINAL (for source lookup):
En7 = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",
    getSystemPrompt: () => STATUSLINE_SETUP_PROMPT
}

// READABLE (for understanding):
const STATUSLINE_SETUP_AGENT = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],  // Minimal tool set
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",  // Fixed model
    color: "orange",  // UI indicator color
    getSystemPrompt: () => `You are a status line setup agent for Claude Code...`
};

// Mapping: En7→STATUSLINE_SETUP_AGENT
```

**Key characteristics:**
- Minimal tool set: only Read and Edit
- Fixed to **Sonnet model**
- Has custom **orange color** for UI indicator
- Specialized for PS1 import and statusLine command configuration

---

### CLAUDE_CODE_GUIDE_AGENT (Rn7)

**What it does:** Help agent for Claude Code, Claude Agent SDK, and Claude API questions. Fetches documentation and provides guidance.

**Important:** This agent is **EXCLUDED in SDK mode** (sdk-ts, sdk-py, sdk-cli entrypoints).

```javascript
// ============================================
// CLAUDE_CODE_GUIDE_AGENT - Documentation help agent
// Location: chunks.90.mjs:2904-3039
// ============================================

// ORIGINAL (for source lookup):
Rn7 = {
    agentType: "claude-code-guide",
    whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
    tools: [Jz, s9, Jq, xO, JL],  // Glob, Grep, Read, WebFetch, WebSearch
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    permissionMode: "dontAsk",
    getSystemPrompt: ({ toolUseContext }) => { ... }
}

// READABLE (for understanding):
const CLAUDE_CODE_GUIDE_AGENT = {
    agentType: "claude-code-guide",
    whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
    tools: ["Glob", "Grep", "Read", "WebFetch", "WebSearch"],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    permissionMode: "dontAsk",  // No permission prompts
    getSystemPrompt: ({ toolUseContext }) => {
        // Dynamic prompt that includes user's current configuration
        // Lists custom skills, agents, MCP servers, plugins, settings
        return GUIDE_SYSTEM_PROMPT + userConfigSection;
    }
};

// Mapping: Rn7→CLAUDE_CODE_GUIDE_AGENT, Jz→TOOL_NAME_GLOB, s9→TOOL_NAME_GREP, Jq→TOOL_NAME_READ, xO→TOOL_NAME_WEB_FETCH, JL→TOOL_NAME_WEB_SEARCH
```

**Key characteristics:**
- Uses **Haiku model** for fast responses
- Has `permissionMode: "dontAsk"` - no permission prompts
- Dynamic system prompt includes user's current configuration
- **EXCLUDED in SDK mode** (see `getBuiltinAgents`)

**Why excluded in SDK mode:** The guide agent fetches documentation interactively and is designed for human users asking "how do I..." questions. In SDK mode, the developer is building their own agent and controls the system prompt - the guide agent would be noise.

---

## Built-in Agents Summary Table

| Agent | Model | Permission Mode | Tools | criticalSystemReminder | SDK Available |
|---|---|---|---|---|---|
| **Bash** | inherit | default | Bash only | - | ✅ |
| **general-purpose** | inherit | default | All (`["*"]`) | - | ✅ |
| **statusline-setup** | sonnet | default | Read, Edit | - | ✅ |
| **Explore** | haiku | default | Read-only (no Edit/Write/Task/WebSearch) | `"CRITICAL: This is a READ-ONLY task."` | ✅ |
| **Plan** | inherit | default | Read-only (same as Explore) | `"CRITICAL: This is a READ-ONLY task."` | ✅ |
| **claude-code-guide** | haiku | dontAsk | Glob, Grep, Read, WebFetch, WebSearch | - | ❌ Excluded |

### Model Selection Rationale

| Model | When Used | Why |
|---|---|---|
| `inherit` | Bash, general-purpose, Plan | Use parent session's model for consistency |
| `haiku` | Explore, claude-code-guide | Fast responses for search/exploration tasks |
| `sonnet` | statusline-setup | Balanced capability for configuration tasks |

### Permission Mode Reference

| Mode | Behavior |
|---|---|
| `default` | Normal permission prompts via control_request or MCP tool |
| `dontAsk` | No permission prompts - agent can use tools freely |
| `acceptEdits` | Auto-approve Edit/Write operations |
| `bypassPermissions` | Skip all permission checks |

---

## getBuiltinAgents (APA) - SDK-Aware Filtering

**What it does:** Returns the list of built-in agents available for subagent dispatch. In SDK mode, the "guide" agent is excluded.

```javascript
// ============================================
// getBuiltinAgents - Return available built-in agents (SDK-filtered)
// Location: chunks.90.mjs:3049-3054
// ============================================

// ORIGINAL (for source lookup):
function APA() {
    if (J6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && w4()) return [];
    let A = [Tn7, ZB1, En7, bv, PJ6];
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(Rn7);
    return A
}

// READABLE (for understanding):
function getBuiltinAgents() {
    // Allow SDK users to completely disable built-in agents
    if (parseBool(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && isNonInteractive()) {
        return [];
    }
    let agents = [
        BASH_AGENT,
        GENERAL_PURPOSE_AGENT,
        STATUSLINE_SETUP_AGENT,
        EXPLORE_AGENT,
        PLAN_AGENT
    ];
    // Guide agent excluded in SDK mode (it fetches docs interactively)
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
        agents.push(CLAUDE_CODE_GUIDE_AGENT);
    }
    return agents;
}

// Mapping: APA→getBuiltinAgents, J6→parseBool, w4→isNonInteractive, Tn7→BASH_AGENT, ZB1→GENERAL_PURPOSE_AGENT, En7→STATUSLINE_SETUP_AGENT, bv→EXPLORE_AGENT, PJ6→PLAN_AGENT, Rn7→CLAUDE_CODE_GUIDE_AGENT
```

**Why this approach:**
1. **`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`**: Gives SDK developers full control to remove all built-in agents, leaving only their custom-defined ones
2. **Guide agent exclusion**: The guide agent is designed for interactive "how do I use Claude Code?" queries. In SDK mode, the developer controls the system prompt and doesn't need this agent

---

## Agent Merging and Priority

### mergeAgentDefinitions (hh)

**What it does:** Merges agent definitions from multiple sources with priority ordering. Later sources override earlier ones for the same `agentType`.

```javascript
// ============================================
// mergeAgentDefinitions - Merge agents with priority
// Location: chunks.91.mjs:2-14
// ============================================

// ORIGINAL (for source lookup):
function hh(A) {
    let q = A.filter((_) => _.source === "built-in"),
        K = A.filter((_) => _.source === "plugin"),
        Y = A.filter((_) => _.source === "userSettings"),
        z = A.filter((_) => _.source === "projectSettings"),
        w = A.filter((_) => _.source === "policySettings"),
        H = A.filter((_) => _.source === "flagSettings"),
        $ = [q, K, Y, z, H, w],
        O = new Map;
    for (let _ of $)
        for (let J of _) O.set(J.agentType, J);
    return Array.from(O.values())
}

// READABLE (for understanding):
function mergeAgentDefinitions(allAgents) {
    // Group by source (priority order: lowest to highest)
    let builtIn = allAgents.filter((a) => a.source === "built-in");
    let plugin = allAgents.filter((a) => a.source === "plugin");
    let userSettings = allAgents.filter((a) => a.source === "userSettings");
    let projectSettings = allAgents.filter((a) => a.source === "projectSettings");
    let policySettings = allAgents.filter((a) => a.source === "policySettings");
    let flagSettings = allAgents.filter((a) => a.source === "flagSettings");

    // Priority order: built-in < plugin < userSettings < projectSettings < policySettings < flagSettings
    let sourceGroups = [builtIn, plugin, userSettings, projectSettings, policySettings, flagSettings];

    // Later sources override earlier ones for same agentType
    let agentMap = new Map();
    for (let group of sourceGroups) {
        for (let agent of group) {
            agentMap.set(agent.agentType, agent);
        }
    }
    return Array.from(agentMap.values());
}

// Mapping: hh→mergeAgentDefinitions, A→allAgents, q→builtIn, K→plugin, Y→userSettings, z→projectSettings, w→policySettings, H→flagSettings, O→agentMap
```

**Priority order (lowest to highest):**
1. `built-in` - Default agents shipped with Claude Code
2. `plugin` - Agents from installed plugins
3. `userSettings` - User-level custom agents (~/.claude/settings.json)
4. `projectSettings` - Project-level custom agents (.claude/settings.json)
5. `policySettings` - Organization policy agents
6. `flagSettings` - CLI flag agents (--agents JSON)

**Why this priority:** This allows organizations to enforce policies while still allowing CLI flags to override for specific invocations. User settings provide personalization, project settings provide team consistency.

---

### validateMcpServers (KPA) and filterByMcpServers (un7)

**What they do:** Filter agents based on required MCP server availability.

```javascript
// ============================================
// validateMcpServers - Check if agent's MCP requirements are met
// Location: chunks.91.mjs:16-19
// ============================================

// ORIGINAL (for source lookup):
function KPA(A, q) {
    if (!A.requiredMcpServers || A.requiredMcpServers.length === 0) return !0;
    return A.requiredMcpServers.every((K) => q.some((Y) => Y.toLowerCase().includes(K.toLowerCase())))
}

// READABLE (for understanding):
function validateMcpServers(agent, availableMcpServerNames) {
    // No requirements = always valid
    if (!agent.requiredMcpServers || agent.requiredMcpServers.length === 0) {
        return true;
    }
    // All required servers must be in available list (case-insensitive match)
    return agent.requiredMcpServers.every((required) =>
        availableMcpServerNames.some((available) =>
            available.toLowerCase().includes(required.toLowerCase())
        )
    );
}

// Mapping: KPA→validateMcpServers, A→agent, q→availableMcpServerNames, K→required
```

```javascript
// ============================================
// filterByMcpServers - Filter agents by MCP availability
// Location: chunks.91.mjs:21-23
// ============================================

// ORIGINAL (for source lookup):
function un7(A, q) {
    return A.filter((K) => KPA(K, q))
}

// READABLE (for understanding):
function filterByMcpServers(agents, availableMcpServerNames) {
    return agents.filter((agent) => validateMcpServers(agent, availableMcpServerNames));
}

// Mapping: un7→filterByMcpServers, A→agents, q→availableMcpServerNames, KPA→validateMcpServers
```

**Why MCP filtering:** An agent that requires specific MCP tools (e.g., a "slack-messenger" agent that needs the Slack MCP server) should not be offered if those servers aren't configured.

---

## Custom Agent Loading

### Agent File Format

Custom agents are defined in `.md` files with YAML frontmatter:

```markdown
---
name: my-custom-agent
description: Agent for specific task
model: sonnet
tools:
  - Read
  - Write
  - Bash
disallowedTools:
  - WebSearch
color: blue
permissionMode: acceptEdits
mcpServers:
  - name: my-mcp-server
memory: project
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "echo 'About to run bash'"
maxTurns: 10
skills:
  - my-skill
---

You are a custom agent for [specific purpose].

[Detailed system prompt instructions...]
```

### loadAgentDefinitions (TB1)

**What it does:** Loads all agent definitions from files and merges with built-in agents.

```javascript
// ============================================
// loadAgentDefinitions - Load all agents from files
// Location: chunks.91.mjs:285-332
// ============================================

// ORIGINAL (for source lookup):
TB1 = KA(async (A) => {
    try {
        let q = await Qp("agents", A),
            K = [],
            Y = q.map(({
                filePath: O,
                baseDir: _,
                frontmatter: J,
                content: X,
                source: D
            }) => {
                let j = eL9(O, _, J, X, D);
                if (!j) {
                    let M = aL9(J);
                    return K.push({
                        path: O,
                        error: M
                    }), h(`Failed to parse agent from ${O}: ${M}`), c("tengu_agent_parse_error", {
                        error: M,
                        location: D
                    }), null
                }
                return j
            }).filter((O) => O !== null),
            z = await wK1(),
            H = [...APA(), ...z, ...Y],
            $ = hh(H);
        for (let O of $)
            if (O.color) xK1(O.agentType, O.color);
        return {
            activeAgents: $,
            allAgents: H,
            failedFiles: K.length > 0 ? K : void 0
        }
    } catch (q) { ... }
})

// READABLE (for understanding):
const loadAgentDefinitions = memoize(async (options) => {
    try {
        // Load agent files from all config directories
        let agentFiles = await loadConfigFiles("agents", options);
        let failedFiles = [];

        // Parse each agent file
        let customAgents = agentFiles.map(({
            filePath,
            baseDir,
            frontmatter,
            content,
            source
        }) => {
            let agent = parseAgentFromFrontmatter(filePath, baseDir, frontmatter, content, source);
            if (!agent) {
                let error = getFrontmatterError(frontmatter);
                failedFiles.push({ path: filePath, error });
                logError(`Failed to parse agent from ${filePath}: ${error}`);
                telemetry("tengu_agent_parse_error", { error, location: source });
                return null;
            }
            return agent;
        }).filter((a) => a !== null);

        // Load plugin agents
        let pluginAgents = await loadPluginAgents();

        // Combine: built-in + plugin + custom
        let allAgents = [...getBuiltinAgents(), ...pluginAgents, ...customAgents];

        // Merge by priority
        let activeAgents = mergeAgentDefinitions(allAgents);

        // Register agent colors
        for (let agent of activeAgents) {
            if (agent.color) {
                registerAgentColor(agent.agentType, agent.color);
            }
        }

        return {
            activeAgents,
            allAgents,
            failedFiles: failedFiles.length > 0 ? failedFiles : undefined
        };
    } catch (error) { ... }
});

// Mapping: TB1→loadAgentDefinitions, KA→memoize, Qp→loadConfigFiles, eL9→parseAgentFromFrontmatter, aL9→getFrontmatterError, APA→getBuiltinAgents, wK1→loadPluginAgents, hh→mergeAgentDefinitions, xK1→registerAgentColor
```

---

## Agent Definition Zod Schemas

```javascript
// ============================================
// Agent Definition Zod Schemas
// Location: chunks.91.mjs:271-284
// ============================================

// ORIGINAL (for source lookup):
xn7 = u.union([u.string(), u.record(u.string(), sx)]),
bn7 = u.object({
    description: u.string().min(1, "Description cannot be empty"),
    tools: u.array(u.string()).optional(),
    disallowedTools: u.array(u.string()).optional(),
    prompt: u.string().min(1, "Prompt cannot be empty"),
    model: u.enum(U_1).optional(),
    effort: u.union([u.enum(WJ6), u.number().int()]).optional(),
    permissionMode: u.enum(ox).optional(),
    mcpServers: u.array(xn7).optional(),
    hooks: u.lazy(() => Xk).optional(),
    maxTurns: u.number().int().positive().optional(),
    skills: u.array(u.string()).optional(),
    memory: u.enum(["user", "project", "local"]).optional()
}),
oL9 = u.record(u.string(), bn7);

// READABLE (for understanding):
const McpServerConfigSchema = z.union([
    z.string(),  // Just server name
    z.record(z.string(), z.any())  // Full config object
]);

const AgentDefinitionSchema = z.object({
    description: z.string().min(1, "Description cannot be empty"),
    tools: z.array(z.string()).optional(),
    disallowedTools: z.array(z.string()).optional(),
    prompt: z.string().min(1, "Prompt cannot be empty"),
    model: z.enum(["inherit", "haiku", "sonnet", "opus"]).optional(),
    effort: z.union([
        z.enum(["low", "medium", "high"]),
        z.number().int()
    ]).optional(),
    permissionMode: z.enum(["default", "acceptEdits", "bypassPermissions", "plan"]).optional(),
    mcpServers: z.array(McpServerConfigSchema).optional(),
    hooks: z.lazy(() => HooksSchema).optional(),
    maxTurns: z.number().int().positive().optional(),
    skills: z.array(z.string()).optional(),
    memory: z.enum(["user", "project", "local"]).optional()
});

const AgentsMapSchema = z.record(z.string(), AgentDefinitionSchema);

// Mapping: xn7→McpServerConfigSchema, bn7→AgentDefinitionSchema, oL9→AgentsMapSchema, u→z, U_1→MODEL_OPTIONS, WJ6→EFFORT_LEVELS, ox→PERMISSION_MODES, Xk→HooksSchema
```

---

## Summary: Agent Selection Flow

```
User invokes Task tool with subagent_type
           │
           ▼
    loadAgentDefinitions()
           │
           ├── Load built-in agents (getBuiltinAgents)
           │   └── Filter out guide agent if SDK mode
           │
           ├── Load plugin agents
           │
           ├── Load custom agents from files
           │   ├── ~/.claude/agents/*.md (userSettings)
           │   ├── .claude/agents/*.md (projectSettings)
           │   └── --agents JSON (flagSettings)
           │
           ▼
    mergeAgentDefinitions()
           │
           ├── Group by source priority
           └── Later sources override earlier for same agentType
           │
           ▼
    filterByMcpServers()
           │
           └── Remove agents whose requiredMcpServers aren't available
           │
           ▼
    Find agent by agentType
           │
           ▼
    Spawn subagent with agent's configuration
```