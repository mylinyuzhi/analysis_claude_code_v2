# Agent Definitions - Subagent System (Claude Code 2.1.76)

## Overview

Agent definitions specify the configuration and behavior of subagent instances. Each definition includes the system prompt, allowed tools, model selection, and lifecycle hooks. In v2.1.76, two new fields were added: `background: true` flag for background-optimized agents, and per-invocation `model` override via the AgentTool call.

**v2.1.76 additions:**
- `background: true` agent definition flag for background-optimized agent behavior
- Per-invocation `model` parameter in AgentTool allows overriding the agent's default model at call time

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `BUILT_IN_AGENT_DEFINITIONS` (ZB1) - Array of built-in agent definitions - chunks.89.mjs
- `mergeAgentDefinitions` (hh) - Priority merging of agent definitions - chunks.89.mjs
- `resolveAgentDefinition` (PJ6) - Resolve agent name to definition - chunks.89.mjs
- `validateRequiredMcpServers` (KPA) - Validate MCP server requirements - chunks.89.mjs
- `buildAgentSystemPrompt` (bv) - Build system prompt for agent - chunks.89.mjs

---

## Built-In Agent Types

### General-Purpose Agent

The default agent used for most subagent invocations. Has access to the full tool set and uses the session's configured model.

```javascript
{
    agentType: "general-purpose",
    getSystemPrompt: (ctx) => buildDefaultSystemPrompt(ctx),
    tools: [],  // Uses full tool set
    disallowedTools: [],
    model: undefined,  // Uses session model
    maxTurns: undefined,  // No limit
    color: "blue"
}
```

### Explore Agent

Optimized for read-only exploration. Limited to reading tools to prevent accidental modifications.

```javascript
{
    agentType: "Explore",
    getSystemPrompt: (ctx) => buildExploreSystemPrompt(ctx),
    tools: ["Read", "Glob", "Grep", "Bash"],
    disallowedTools: ["Write", "Edit", "MultiEdit"],
    model: undefined,
    maxTurns: 20
}
```

### Plan Agent

Used for generating structured plans. Focuses on analysis and planning rather than execution.

```javascript
{
    agentType: "Plan",
    getSystemPrompt: (ctx) => buildPlanSystemPrompt(ctx),
    tools: ["Read", "Glob", "Grep"],
    disallowedTools: ["Bash", "Write", "Edit"],
    model: undefined,
    maxTurns: 15
}
```

### Bash Agent

Optimized for shell scripting and command execution.

```javascript
{
    agentType: "Bash",
    getSystemPrompt: (ctx) => buildBashSystemPrompt(ctx),
    tools: ["Bash", "Read"],
    disallowedTools: [],
    model: undefined,
    maxTurns: 30
}
```

### claude-code-guide Agent

A meta-agent that provides guidance on using Claude Code itself.

```javascript
{
    agentType: "claude-code-guide",
    getSystemPrompt: (ctx) => buildGuideSystemPrompt(ctx),
    tools: ["Read"],
    disallowedTools: [],
    model: undefined,
    maxTurns: 5
}
```

### statusline-setup Agent

Used during initial setup for terminal status line configuration.

```javascript
{
    agentType: "statusline-setup",
    getSystemPrompt: (ctx) => buildStatuslineSystemPrompt(ctx),
    tools: ["Bash", "Read", "Write"],
    disallowedTools: [],
    model: undefined,
    maxTurns: 10
}
```

---

## New v2.1.76 Fields

### background: true Flag

The `background: true` flag marks an agent definition as optimized for background execution. Background-flagged agents:

1. Skip interactive confirmation prompts where possible
2. Use more conservative tool permissions (prefer read-only by default)
3. Emit structured output suitable for programmatic consumption
4. Set `isAsync: true` in the agent loop runner call

**Why this approach:**
- Background agents are not watched by users in real-time; their behavior should be conservative and predictable
- Marking agents as `background` explicitly allows the runner to apply appropriate policies without the caller needing to configure each individually

```javascript
// ============================================
// background flag in agent definition (v2.1.76)
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
const backgroundWorkerAgentDef = {
    agentType: "background-worker",
    background: true,  // NEW in v2.1.76
    getSystemPrompt: (ctx) => buildBackgroundWorkerPrompt(ctx),
    tools: ["Read", "Glob", "Grep", "Bash"],
    disallowedTools: ["Write", "Edit"],
    maxTurns: 50
};
```

### Per-Invocation model Override

In v2.1.76, the `model` parameter can be specified in each AgentTool invocation, overriding both the session default and the agent definition's configured model.

**Resolution priority (highest to lowest):**
1. Per-invocation `model` parameter in the Task tool call
2. Agent definition `model` field
3. Session-level model configuration
4. System default model

```javascript
// ============================================
// model resolution hierarchy (v2.1.76)
// Location: chunks.132.mjs (AgentTool.call)
// ============================================

// READABLE (for understanding):
function resolveModelForSubagent(taskInput, agentDef, sessionContext) {
    // Per-invocation model has highest priority (NEW in v2.1.76)
    if (taskInput.model) {
        return resolveModelConfig(taskInput.model);
    }

    // Agent definition model next
    if (agentDef.model) {
        return resolveModelConfig(agentDef.model);
    }

    // Fall back to session model
    return sessionContext.options.mainLoopModel;
}
```

**Why this approach:**
- Callers can switch models for specific delegated tasks (e.g., use a cheaper model for simple file analysis, a more capable model for complex reasoning)
- Per-invocation override avoids needing to define a separate agent definition for each model variant
- The priority order follows the principle of least surprise: more specific overrides more general

---

## mergeAgentDefinitions (hh)

### What it does

Merges multiple agent definition objects into a single definition, with later definitions taking priority over earlier ones for non-array fields, and array fields being unioned.

### How it works

1. Start with the base definition
2. For each subsequent definition:
   - Scalar fields (model, maxTurns, color): later overrides earlier
   - Array fields (tools, disallowedTools): later is appended/merged
   - Function fields (getSystemPrompt): later replaces earlier
3. Return merged definition

```javascript
// ============================================
// mergeAgentDefinitions - Priority merge of agent definitions
// Location: chunks.89.mjs
// ============================================

// READABLE (for understanding):
function mergeAgentDefinitions(base, ...overrides) {
    let result = { ...base };

    for (let override of overrides) {
        // Scalar fields: override replaces base
        if (override.model !== undefined) result.model = override.model;
        if (override.maxTurns !== undefined) result.maxTurns = override.maxTurns;
        if (override.color !== undefined) result.color = override.color;
        if (override.background !== undefined) result.background = override.background;

        // Function fields: override replaces base
        if (override.getSystemPrompt) result.getSystemPrompt = override.getSystemPrompt;

        // Array fields: union
        if (override.tools) result.tools = [...(result.tools || []), ...override.tools];
        if (override.disallowedTools) {
            result.disallowedTools = [...(result.disallowedTools || []), ...override.disallowedTools];
        }

        // Hook merging: union of hook arrays
        if (override.hooks) result.hooks = mergeHooks(result.hooks, override.hooks);
    }

    return result;
}

// Mapping: hh→mergeAgentDefinitions
```

---

## Agent Definition Schema

The complete schema for agent definitions in v2.1.76:

```typescript
interface AgentDefinition {
    // Required
    agentType: string;
    getSystemPrompt: (ctx: ToolUseContext) => Promise<string>;

    // Tool configuration
    tools?: string[];              // Allowed tool names (whitelist)
    disallowedTools?: string[];    // Disallowed tool names (blacklist)

    // Model configuration
    model?: string;                // Default model override

    // Execution configuration
    maxTurns?: number;             // Maximum LLM turns
    background?: boolean;          // NEW in v2.1.76: background mode flag
    isolation?: "worktree";        // NEW in v2.1.76: isolation strategy

    // System prompt additions
    criticalSystemReminder_EXPERIMENTAL?: string;  // Injected into system prompt

    // MCP requirements
    requiredMcpServers?: string[]; // MCP servers that must be available

    // Hook configuration
    hooks?: SkillHooks;            // Lifecycle hooks

    // Skill configuration
    skills?: string[];             // Required skill names

    // UI configuration
    color?: string;                // Color for UI display
    permissionMode?: string;       // Permission mode override
}
```

---

## MCP Server Validation (KPA)

### validateRequiredMcpServers (KPA)

**What it does:** Verifies that all MCP servers required by the agent definition are available and connected before the subagent starts.

**How it works:**
1. Check `agentDefinition.requiredMcpServers` array
2. For each required server, check if it appears in the active MCP connections
3. If any required server is missing, return an error with details
4. If all present, return success

**Why this approach:**
- Fail-fast validation prevents the subagent from starting and then failing mid-execution when a required tool is unavailable
- Error message names the missing server, making diagnosis straightforward

---

## Design Rationale

### Why Separate Agent Definitions from Tool Sets?

**Agent definitions** describe the intent and policy (what the agent should do, which model to use, maximum turns). **Tool sets** describe the capability (which concrete tool implementations are available).

Keeping these separate allows:
1. **Reuse** - The same tool set can serve multiple agent types
2. **Override** - Per-invocation model override (v2.1.76) works without redefining the entire agent
3. **Validation** - Tool whitelists are applied at assembly time, not definition time

### Why background: true as a Separate Flag?

**Alternative:** Detect background mode from the task creation context.

**Chosen approach:** Explicit flag in agent definition.

The explicit flag is more transparent - it documents that the agent is designed for background use. This matters because background agents may behave differently (fewer interactive prompts, more conservative permissions), and users reading the agent definition should be able to see this immediately.
