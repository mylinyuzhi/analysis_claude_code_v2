# Agent Definitions - Subagent System (Claude Code 2.1.76)

## Overview

Agent definitions specify the configuration and behavior of subagent instances. Each definition includes the system prompt, allowed tools, model selection, and lifecycle hooks. In v2.1.76, two new fields were added: `background: true` flag for background-optimized agents, and per-invocation `model` override via the AgentTool call.

**v2.1.76 additions:**
- `background: true` agent definition flag for background-optimized agent behavior
- Per-invocation `model` parameter in AgentTool allows overriding the agent's default model at call time
- `isolation: "worktree"` declarative support for git worktree isolation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `GENERAL_PURPOSE_AGENT` (q96) - Default general-purpose agent definition - chunks.93.mjs:1681
- `EXPLORE_AGENT` (QB) - Read-only exploration agent - chunks.93.mjs:1871
- `PLAN_AGENT` (x01) - Planning/architecture agent - chunks.93.mjs:1944
- `STATUSLINE_SETUP_AGENT` (X_4) - Status line configuration agent - chunks.93.mjs:1694
- `CLAUDE_CODE_GUIDE_AGENT` (G_4) - Claude Code help agent - chunks.93.mjs:2018 (function CF9)

> **Verified Source:** All agent definitions below have been cross-verified against actual source code in chunks.93.mjs.

---

## Built-In Agent Types

### General-Purpose Agent (q96)

The default agent used for most subagent invocations. Has access to the full tool set and uses the session's configured model.

```javascript
// ============================================
// GENERAL_PURPOSE_AGENT - Default general-purpose agent definition
// Location: chunks.93.mjs:1681-1688
// ============================================

// ORIGINAL (for source lookup):
q96 = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: yF9
}

// READABLE (for understanding):
const GENERAL_PURPOSE_AGENT = {
    agentType: "general-purpose",
    whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ["*"],  // All tools available
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: buildGeneralPurposePrompt  // yF9
}

// Mapping: q96→GENERAL_PURPOSE_AGENT, yF9→buildGeneralPurposePrompt
```

**Key characteristics:**
- `tools: ["*"]` grants access to all available tools
- No model override - inherits from session or per-invocation parameter
- Suitable for complex, multi-step tasks requiring diverse tool combinations

### buildGeneralPurposePrompt (yF9)

The system prompt builder for the general-purpose agent:

```javascript
// ============================================
// buildGeneralPurposePrompt - System prompt for general-purpose agent
// Location: chunks.93.mjs:1653-1660
// ============================================

// ORIGINAL (for source lookup):
function yF9() {
    let A = w8("tengu_tight_weave", !0);
    return `${kF9} ${A?"When you complete the task, respond with a concise report...":"When you complete the task simply respond with a detailed writeup."}
${EF9}
${A?"- In your final response, share file paths...":"- In your final response always share relevant file names..."}
- For clear communication, avoid using emojis.`
}

// READABLE (for understanding):
function buildGeneralPurposePrompt() {
    let tightWeave = getFeatureFlag("tengu_tight_weave", true);
    return `${BASE_AGENT_PROMPT} ${tightWeave
        ? "When you complete the task, respond with a concise report covering what was done and any key findings..."
        : "When you complete the task simply respond with a detailed writeup."}

${STRENGTHS_PROMPT}
${tightWeave
    ? "- In your final response, share file paths (always absolute, never relative)..."
    : "- In your final response always share relevant file names and code snippets..."}
- For clear communication, avoid using emojis.`;
}

// Supporting constants:
// kF9 (BASE_AGENT_PROMPT): "You are an agent for Claude Code, Anthropic's official CLI for Claude..."
// EF9 (STRENGTHS_PROMPT): "Your strengths:\n- Searching for code, configurations..."

// Mapping: yF9→buildGeneralPurposePrompt, w8→getFeatureFlag, kF9→BASE_AGENT_PROMPT, EF9→STRENGTHS_PROMPT
```

**Why tight_weave mode:** The `tengu_tight_weave` feature flag controls response verbosity:
- **Enabled:** Concise reports with absolute paths only, no code recaps
- **Disabled:** Detailed writeups with code snippets included

### Explore Agent (QB)

Optimized for read-only exploration. Limited to reading tools to prevent accidental modifications. Uses `haiku` model for faster, cheaper exploration.

```javascript
// ============================================
// EXPLORE_AGENT - Read-only codebase exploration agent
// Location: chunks.93.mjs:1871-1880
// ============================================

// ORIGINAL (for source lookup):
QB = {
    agentType: "Explore",
    whenToUse: RF9,
    disallowedTools: [r4, Uk, R4, _K, bJ],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    getSystemPrompt: () => LF9(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const EXPLORE_AGENT = {
    agentType: "Explore",
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
    disallowedTools: ["Agent", "WebSearch", "Edit", "Write", "NotebookEdit"],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",  // Use faster/cheaper model for exploration
    getSystemPrompt: () => buildExploreSystemPrompt(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: QB→EXPLORE_AGENT, RF9→EXPLORE_WHEN_TO_USE, LF9→buildExploreSystemPrompt
// Disallowed tools: r4="Agent", Uk="WebSearch", R4="Edit", _K="Write", bJ="NotebookEdit"
```

**Key characteristics:**
- `disallowedTools` blocks all write operations plus `Agent` (no subagent nesting) and `WebSearch`
- `model: "haiku"` optimizes for speed and cost on typical exploration tasks
- `criticalSystemReminder_EXPERIMENTAL` adds an extra safety reminder in the system prompt
- `getSystemPrompt` (LF9) generates detailed exploration instructions based on headless mode

### Plan Agent (x01)

Used for generating structured plans. Focuses on analysis and planning rather than execution. Inherits model from parent session.

```javascript
// ============================================
// PLAN_AGENT - Software architect planning agent
// Location: chunks.93.mjs:1944-1954
// ============================================

// ORIGINAL (for source lookup):
x01 = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: [r4, Uk, R4, _K, bJ],
    source: "built-in",
    tools: QB.tools,
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => hF9(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
const PLAN_AGENT = {
    agentType: "Plan",
    whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
    disallowedTools: ["Agent", "WebSearch", "Edit", "Write", "NotebookEdit"],
    source: "built-in",
    tools: EXPLORE_AGENT.tools,  // Shares tools config with Explore
    baseDir: "built-in",
    model: "inherit",  // Inherit from session/parent, not fixed model
    getSystemPrompt: () => buildPlanSystemPrompt(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: x01→PLAN_AGENT, hF9→buildPlanSystemPrompt, QB→EXPLORE_AGENT
```

**Key characteristics:**
- `model: "inherit"` - Uses parent's model for consistency in planning context
- `tools: QB.tools` - Shares tool configuration with Explore agent
- `getSystemPrompt` (hF9) generates structured planning instructions with output format requirements

**Plan Agent System Prompt Structure (hF9):**
1. **READ-ONLY constraints** - Cannot modify any files
2. **Process phases** - Understand → Explore → Design → Detail
3. **Required output format** - Must end with "Critical Files for Implementation" section

### statusline-setup Agent (X_4)

Used during initial setup for terminal status line configuration. Has minimal tools (Read, Edit) for config file modifications.

```javascript
// ============================================
// STATUSLINE_SETUP_AGENT - Status line configuration agent
// Location: chunks.93.mjs:1694-1816
// ============================================

// ORIGINAL (for source lookup):
X_4 = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",
    getSystemPrompt: () => `You are a status line setup agent for Claude Code...`
}

// READABLE (for understanding):
const STATUSLINE_SETUP_AGENT = {
    agentType: "statusline-setup",
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ["Read", "Edit"],  // Minimal tools for config editing
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",         // Fixed model for consistent behavior
    color: "orange",         // UI color indicator for task display
    getSystemPrompt: () => STATUSLINE_SETUP_SYSTEM_PROMPT  // Long prompt
}

// Mapping: X_4→STATUSLINE_SETUP_AGENT
```

**Key characteristics:**
- `tools: ["Read", "Edit"]` - Minimal set for reading and modifying config files
- `model: "sonnet"` - Fixed model, not inherited
- `color: "orange"` - Visual identifier in the UI
- System prompt includes:
  - Shell PS1 parsing regex patterns
  - PS1 escape sequence conversion rules
  - StatusLine JSON input schema
  - Guidelines for updating `~/.claude/settings.json`

**System Prompt Highlights (excerpt):**

The status line setup agent's system prompt includes detailed instructions for:

1. **PS1 Import**: Reading shell config files and extracting PS1 values
2. **Escape Sequence Conversion**: `\u` → `$(whoami)`, `\w` → `$(pwd)`, etc.
3. **JSON Input Schema**: The statusLine command receives session metadata via stdin
4. **Settings Update**: Instructions for updating `~/.claude/settings.json`

### claude-code-guide Agent (CF9/G_4)

A meta-agent that provides guidance on using Claude Code itself. Dynamically selects tools based on headless mode.

```javascript
// ============================================
// CLAUDE_CODE_GUIDE_AGENT - Claude Code help/documentation agent
// Location: chunks.93.mjs:1957-2040 (CF9), agent definition G_4 follows
// ============================================

// ORIGINAL (for source lookup) - System Prompt Function:
function CF9() {
    let A = n$() ? `${s7}, \`find\`, and \`grep\`` : `${s7}, ${qz}, and ${N9}`;
    return `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${SF9}): Fetch this for questions about the Claude Code CLI tool...
- **Claude Agent SDK docs** (${Z_4}): Fetch this for questions about building agents with the SDK...
- **Claude API docs** (${Z_4}): Fetch this for questions about the Claude API...

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${sO} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${jv} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${A}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands...`
}

// READABLE (for understanding):
function buildClaudeCodeGuidePrompt() {
    let toolReference = isHeadless()
        ? "Read, `find`, and `grep`"
        : "Read, Glob, and Grep";
    return `You are the Claude guide agent...

**Your expertise spans three domains:**
1. Claude Code (the CLI tool)
2. Claude Agent SDK
3. Claude API

**Documentation sources:**
- Claude Code docs: https://docs.anthropic.com/en/docs/claude-code
- Claude API docs: https://docs.anthropic.com

**Approach:**
1. Determine which domain the user's question falls into
2. Use WebFetch to fetch the appropriate docs map
3. Identify relevant documentation URLs
4. Fetch specific documentation pages
5. Provide clear, actionable guidance
6. Use WebSearch if docs don't cover the topic
7. Reference local project files when relevant

**Guidelines:**
- Prioritize official documentation
- Keep responses concise
- Include code snippets when helpful
- Reference exact documentation URLs`;
}

// Mapping: CF9→buildClaudeCodeGuidePrompt, SF9→CLAUDE_CODE_DOCS_URL, Z_4→CLAUDE_API_DOCS_URL,
// sO→WebFetch, jv→WebSearch, s7→Read, qz→Glob, N9→Grep, n$→isHeadless
```

**Key characteristics:**
- `model: "haiku"` - Uses cheaper model for documentation lookup tasks
- `permissionMode: "dontAsk"` - Skips permission prompts for read-only docs access
- Tools vary by mode: headless uses Bash with find/grep, interactive uses Glob/Grep
- Dynamically fetches documentation from official sources

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

## Agent Definition Merging

> **Note:** The symbol `hh` was previously documented as `mergeAgentDefinitions`, but this is incorrect.
> The actual `hh` function (chunks.162.mjs:360) is `hasOnlyInProcessTeammates` - a UI utility that checks
> if all running tasks are in-process teammates.
>
> Agent definition merging functionality exists in the codebase but has a different symbol that needs
> to be identified through further analysis.

### How Agent Definition Merging Works

When multiple sources provide agent definitions (built-in, user config, MCP servers), they are merged with the following priority:

1. **Scalar fields** (model, maxTurns, color): later overrides earlier
2. **Array fields** (tools, disallowedTools): later is appended/merged
3. **Function fields** (getSystemPrompt): later replaces earlier

```javascript
// ============================================
// Agent Definition Merge Logic (conceptual)
// Location: Various - needs symbol identification
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

## MCP Server Validation

> **Note:** The previously documented symbol `KPA` = `validateRequiredMcpServers` was incorrect.
> The actual MCP validation functionality exists but has a different symbol that needs identification.

### MCP Server Validation Logic

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
