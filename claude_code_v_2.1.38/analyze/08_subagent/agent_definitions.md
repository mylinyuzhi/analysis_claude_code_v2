# Agent Definitions - Built-in Agents and Merging (Claude Code 2.1.38)

> Deep analysis of built-in agent types, their configurations, and the priority-based merging system

---

## Table of Contents

1. [Overview](#overview)
2. [Agent Definition Schema](#agent-definition-schema)
3. [mergeAgentDefinitions](#mergeagentdefinitions)
4. [Built-in Agent Types](#built-in-agent-types)
5. [MCP Server Requirements](#mcp-server-requirements)
6. [Cross-References](#cross-references)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mergeAgentDefinitions` (hh) - Priority-based merging of agent definitions from multiple sources
- `validateMcpServers` (KPA) - Validates MCP server requirements for an agent
- `filterByMcpServers` (un7) - Filters agents by MCP server availability
- `ZB1` - General-purpose agent definition
- `bv` - Explore agent definition
- `PJ6` - Plan agent definition
- `Tn7` - Bash agent definition
- `Rn7` - claude-code-guide agent definition
- `En7` - statusline-setup agent definition

---

## 1. Overview

Agent definitions define the capabilities, constraints, and behavior of subagent types. Each agent type is configured with:

- **Tool availability** - Which tools the agent can use
- **Model selection** - Which LLM model to use (or inherit from parent)
- **System prompt** - Instructions for the agent's behavior
- **MCP requirements** - Required MCP servers for the agent to function
- **Critical reminders** - Safety reminders injected into the context

The agent definition system supports multiple sources (built-in, plugin, user settings, project settings, policy settings, flag settings) with a priority-based merging mechanism.

---

## 2. Agent Definition Schema

### Full Schema

```typescript
interface AgentDefinition {
    // Required
    agentType: string;           // Unique identifier (e.g., "general-purpose", "Explore")
    whenToUse: string;           // Description shown in Task tool description
    source: "built-in" | "plugin" | "userSettings" | "projectSettings" | "policySettings" | "flagSettings";
    baseDir: string;             // Base directory for the agent definition

    // Tool configuration
    tools: string[] | ["*"];     // ["*"] means all tools, otherwise list of tool names
    disallowedTools?: string[];  // Tools explicitly NOT allowed (overrides tools: ["*"])

    // Model selection
    model: "inherit" | "sonnet" | "opus" | "haiku";  // Model to use

    // System prompt
    getSystemPrompt: () => string;  // Function returning the system prompt

    // Optional features
    criticalSystemReminder_EXPERIMENTAL?: string;  // High-priority reminder
    requiredMcpServers?: string[];                 // Required MCP servers
    hooks?: HookConfig;                            // Agent-specific hooks
    skills?: string[];                             // Skills to preload
    maxTurns?: number;                             // Maximum agentic turns
    color?: string;                                // UI color for the agent

    // Teammate mode
    permissionMode?: PermissionMode;  // Permission mode for teammates
}
```

### Tool Configuration Patterns

| Pattern | Meaning | Example |
|---------|---------|---------|
| `tools: ["*"]` | All tools available | general-purpose agent |
| `tools: ["Bash"]` | Only Bash tool | Bash agent |
| `tools: ["*"], disallowedTools: ["Task", "Edit"]` | All except disallowed | Explore/Plan agents |

### Model Selection Values

| Value | Behavior |
|-------|----------|
| `"inherit"` | Use parent's model resolution logic (default for most agents) |
| `"sonnet"` | Always use Claude Sonnet |
| `"opus"` | Always use Claude Opus |
| `"haiku"` | Always use Claude Haiku (faster, cheaper) |

---

## 3. mergeAgentDefinitions

### `mergeAgentDefinitions` (hh)

**What it does:** Merges agent definitions from multiple sources with priority ordering. Later sources override earlier ones for the same `agentType`.

**How it works:**

```javascript
// ============================================
// mergeAgentDefinitions - Priority-based agent merging
// Location: chunks.91.mjs:3-15
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
function mergeAgentDefinitions(allDefinitions) {
    // Step 1: Separate definitions by source
    let builtIn = allDefinitions.filter((def) => def.source === "built-in");
    let plugin = allDefinitions.filter((def) => def.source === "plugin");
    let userSettings = allDefinitions.filter((def) => def.source === "userSettings");
    let projectSettings = allDefinitions.filter((def) => def.source === "projectSettings");
    let policySettings = allDefinitions.filter((def) => def.source === "policySettings");
    let flagSettings = allDefinitions.filter((def) => def.source === "flagSettings");

    // Step 2: Create priority order array
    // Order matters: later entries override earlier ones
    let priorityOrder = [builtIn, plugin, userSettings, projectSettings, flagSettings, policySettings];

    // Step 3: Build merged map
    let mergedMap = new Map();
    for (let sourceList of priorityOrder) {
        for (let def of sourceList) {
            // Map.set() overwrites existing entries
            // So later sources override earlier ones
            mergedMap.set(def.agentType, def);
        }
    }

    // Step 4: Return merged array
    return Array.from(mergedMap.values());
}

// Mapping: hh→mergeAgentDefinitions, A→allDefinitions,
//          q→builtIn, K→plugin, Y→userSettings, z→projectSettings,
//          w→policySettings, H→flagSettings, $→priorityOrder,
//          O→mergedMap, _→def, J→sourceList
```

### Priority Order

```
Lowest Priority                          Highest Priority
─────────────────────────────────────────────────────────────→
built-in → plugin → userSettings → projectSettings → flagSettings → policySettings
```

**Why this order:**

1. **built-in** - Default definitions shipped with Claude Code
2. **plugin** - Extensions can add or override built-in agents
3. **userSettings** - User's personal configuration (`~/.claude/settings.json`)
4. **projectSettings** - Project-specific configuration (`.claude/settings.json`)
5. **flagSettings** - CLI flag overrides (`--agent-config`)
6. **policySettings** - Enterprise policy enforcement (cannot be overridden)

**Key insight:** `policySettings` has the highest priority, ensuring enterprise policies cannot be circumvented by user or project settings.

### Example Merge Scenario

```javascript
// Scenario: User has customized the "Explore" agent in userSettings

// built-in Explore agent
let builtInExplore = {
    agentType: "Explore",
    model: "haiku",
    source: "built-in",
    // ...
};

// userSettings Explore agent
let userExplore = {
    agentType: "Explore",
    model: "sonnet",  // Override to use sonnet instead
    source: "userSettings",
    // ...
};

// After merging:
// Result: userExplore (sonnet model) wins because userSettings > built-in
```

---

## 4. Built-in Agent Types

### general-purpose (ZB1)

**Purpose:** Default agent for complex multi-step tasks and code searches.

```javascript
// ============================================
// general-purpose agent definition
// Location: chunks.90.mjs:2622-2644
// ============================================

// ORIGINAL (for source lookup):
ZB1 = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],
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
}

// READABLE (for understanding):
GENERAL_PURPOSE_AGENT = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions...",
    tools: ["*"],  // All tools available
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",  // Uses parent's model selection
    getSystemPrompt: () => `...system prompt...`
};
```

**Key characteristics:**
- **Full tool access** - `tools: ["*"]` means all tools
- **No disallowed tools** - Can use any tool including Task, Edit, Write
- **Inherits model** - Uses parent's model selection logic
- **Comprehensive guidelines** - Detailed instructions for file searches and analysis

### Explore (bv)

**Purpose:** Fast agent for codebase exploration and searching. Uses Haiku for speed.

```javascript
// ============================================
// Explore agent definition
// Location: chunks.90.mjs:2808-2817
// ============================================

// ORIGINAL (for source lookup):
bv = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: [fK, eO6, bq, f5, jM],  // Task, NotebookEdit, Edit, Write
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    getSystemPrompt: () => EXPLORE_SYSTEM_PROMPT,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
EXPLORE_AGENT = {
    agentType: "Explore",
    whenToUse: "Fast agent specialized for exploring codebases...",
    disallowedTools: ["Task", "NotebookEdit", "Edit", "Write"],  // Cannot modify files
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",  // Always use Haiku for speed
    getSystemPrompt: () => `...system prompt for exploration...`,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};
```

**Key characteristics:**
- **Read-only** - Cannot use Edit, Write, NotebookEdit, or spawn Task subagents
- **Haiku model** - Always uses Haiku for faster, cheaper exploration
- **Critical reminder** - Injects "READ-ONLY task" reminder into context
- **Thoroughness levels** - Supports "quick", "medium", "very thorough" modes

### Plan (PJ6)

**Purpose:** Software architect agent for designing implementation plans.

```javascript
// ============================================
// Plan agent definition
// Location: chunks.90.mjs:2878-2888
// ============================================

// ORIGINAL (for source lookup):
PJ6 = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: [fK, eO6, bq, f5, jM],  // Task, NotebookEdit, Edit, Write
    source: "built-in",
    tools: bv.tools,  // Same tools as Explore
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => PLAN_SYSTEM_PROMPT,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
PLAN_AGENT = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans...",
    disallowedTools: ["Task", "NotebookEdit", "Edit", "Write"],
    source: "built-in",
    tools: EXPLORE_AGENT.tools,  // Same tools as Explore
    baseDir: "built-in",
    model: "inherit",  // Uses parent's model selection
    getSystemPrompt: () => `...architect system prompt...`,
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};
```

**Key characteristics:**
- **Read-only** - Same disallowed tools as Explore
- **Inherits model** - Can use parent's model (may be Opus for complex planning)
- **Architecture focused** - System prompt emphasizes:
  - Understanding requirements
  - Exploring thoroughly
  - Designing solutions
  - Detailing plans
- **Critical files output** - Must list 3-5 critical files for implementation

### Bash (Tn7)

**Purpose:** Command execution specialist for running bash commands.

```javascript
// ============================================
// Bash agent definition
// Location: chunks.90.mjs:2608-2616
// ============================================

// ORIGINAL (for source lookup):
Tn7 = {
    agentType: "Bash",
    whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
    tools: [h4],  // Only Bash tool
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
}

// READABLE (for understanding):
BASH_AGENT = {
    agentType: "Bash",
    whenToUse: "Command execution specialist...",
    tools: ["Bash"],  // ONLY the Bash tool
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => `...command execution system prompt...`
};
```

**Key characteristics:**
- **Single tool** - Only has access to the Bash tool
- **Command focused** - System prompt emphasizes safe, efficient execution
- **Git safety** - Special handling for git operations
- **No emojis** - Clear communication preference

### claude-code-guide (Rn7)

**Purpose:** Help agent for Claude Code documentation and API questions.

```javascript
// ============================================
// claude-code-guide agent definition
// Location: chunks.90.mjs:2904-2972
// ============================================

// READABLE (for understanding):
CLAUDE_CODE_GUIDE_AGENT = {
    agentType: "claude-code-guide",
    whenToUse: `Use this agent when the user asks questions about:
1. Claude Code (the CLI tool) - features, hooks, skills, MCP servers, settings, IDE integrations
2. Claude Agent SDK - building custom agents
3. Claude API (formerly Anthropic API) - API usage, tool use, integrations`,
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    // Uses WebFetch to fetch documentation
    getSystemPrompt: () => `...documentation fetching system prompt...`,
    // Has access to web tools for fetching docs
};
```

**Key characteristics:**
- **Documentation fetching** - Can fetch from docs URLs
- **Multi-domain expertise** - Claude Code CLI, Agent SDK, and API
- **WebFetch capability** - Can fetch documentation from URLs
- **Resume support** - Can resume previous guide sessions

### statusline-setup (En7)

**Purpose:** Agent for configuring Claude Code status line settings.

```javascript
// ============================================
// statusline-setup agent definition
// Location: chunks.90.mjs:2650-2670
// ============================================

// READABLE (for understanding):
STATUSLINE_SETUP_AGENT = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],  // Only file reading and editing
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",  // Fixed to Sonnet
    color: "orange",
    getSystemPrompt: () => `...status line conversion system prompt...`
};
```

**Key characteristics:**
- **Limited tools** - Only Read and Edit
- **Fixed model** - Always uses Sonnet
- **Shell config parsing** - Can parse PS1 from shell config files
- **PS1 conversion** - Converts shell prompts to status line format

---

## 5. MCP Server Requirements

### `validateMcpServers` (KPA)

**What it does:** Checks whether all MCP servers required by an agent definition are available.

```javascript
// ============================================
// validateMcpServers - Check MCP server availability
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

// Mapping: KPA→validateMcpServers, A→agentDefinition, q→availableMcpServers
```

### `filterByMcpServers` (un7)

**What it does:** Filters agent definitions to only those whose MCP requirements are satisfied.

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

// Mapping: un7→filterByMcpServers, A→agentDefinitions, q→availableMcpServers, K→agentDef
```

### Case-Insensitive Partial Matching

**Why `.includes()` with case-insensitive matching:**

MCP server names in tool identifiers may differ in casing or include prefixes/suffixes:

```javascript
// Example: github MCP server
// Tool names might be: "mcp__github__list_repos", "mcp__github-enterprise__list_repos"
// Requirement: "github"
// Both match because "github-enterprise".toLowerCase().includes("github".toLowerCase())
```

### MCP Validation Flow

```
1. AgentTool.prompt() called
   ↓
2. Extract available MCP servers from tools
   ↓
3. filterByMcpServers(agents, availableMcpServers)
   ↓
4. Return filtered list for tool description
```

```
1. AgentTool.call() with subagent_type
   ↓
2. Resolve agent definition
   ↓
3. validateMcpServers(agent, availableMcpServers)
   ↓
4. If fails: throw error with missing servers
```

**Key insight:** MCP validation happens at two stages:
1. **In `prompt()`** - Agents with unmet requirements are filtered from the description
2. **In `call()`** - Second check catches race conditions where MCP state changed

---

## 6. Cross-References

### Related Documentation

- **[agent_tool.md](./agent_tool.md)** - How agent definitions are resolved in the Task tool
- **[tools_integration.md](./tools_integration.md)** - Tool availability per agent type
- **[context_building.md](./context_building.md)** - Critical system reminders in context

### Symbol References

| Symbol | Location | Description |
|--------|----------|-------------|
| `hh` | chunks.91.mjs:3 | mergeAgentDefinitions |
| `KPA` | chunks.91.mjs:17 | validateMcpServers |
| `un7` | chunks.91.mjs:22 | filterByMcpServers |
| `ZB1` | chunks.90.mjs:2622 | general-purpose agent |
| `bv` | chunks.90.mjs:2808 | Explore agent |
| `PJ6` | chunks.90.mjs:2878 | Plan agent |
| `Tn7` | chunks.90.mjs:2608 | Bash agent |
| `Rn7` | chunks.90.mjs:2904 | claude-code-guide agent |
| `En7` | chunks.90.mjs:2650 | statusline-setup agent |

---

## Summary

Agent definitions in Claude Code 2.1.38 provide:

1. **Flexible configuration** - Each agent type has specific tools, model, and behavior
2. **Priority-based merging** - Multiple sources can define agents with clear override rules
3. **MCP requirements** - Agents can require specific MCP servers
4. **Safety constraints** - Read-only agents have disallowed tools and critical reminders
5. **Model selection** - Each agent can inherit parent model or specify a fixed model

**Built-in agents cover the main use cases:**
- **general-purpose** - Full-featured agent for complex tasks
- **Explore** - Fast, read-only codebase exploration
- **Plan** - Architecture planning without file modification
- **Bash** - Specialized command execution
- **claude-code-guide** - Documentation and API help
- **statusline-setup** - Status line configuration

**Key design decisions:**
- `policySettings` has highest priority for enterprise control
- Explore uses Haiku for speed; Plan inherits model for quality
- MCP validation happens twice (prompt + call) for robustness
- Critical reminders enforce read-only modes for safety-critical agents