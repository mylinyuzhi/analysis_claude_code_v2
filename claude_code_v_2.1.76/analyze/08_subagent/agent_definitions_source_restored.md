# Agent Definitions — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of built-in agent definitions and their configuration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `GENERAL_PURPOSE_AGENT` (q96) - Default general-purpose agent — `chunks.93.mjs:1681`
- `EXPLORE_AGENT` (QB) - Read-only codebase exploration — `chunks.93.mjs:1871`
- `PLAN_AGENT` (x01) - Software architect planning — `chunks.93.mjs:1944`
- `STATUSLINE_SETUP_AGENT` (X_4) - Status line configuration — `chunks.93.mjs:1694`
- `CLAUDE_CODE_GUIDE_AGENT` (G_4) - Claude Code help agent — `chunks.93.mjs:2040`
- `filterToolsForSubagent` (Xk8) - Filter tools for subagent context — `chunks.93.mjs:1568`

---

## Agent Definition Structure

### What it does

Agent definitions specify the behavior, tools, and constraints for different types of subagents.

### Structure Definition

```typescript
interface AgentDefinition {
    agentType: string;           // Unique identifier for the agent type
    whenToUse: string;           // Description of when to use this agent
    tools?: string[];            // Allowed tools (["*"] for all)
    disallowedTools?: string[];  // Tools that are explicitly blocked
    source: string;              // "built-in" | "user" | "skill"
    baseDir: string;             // Base directory for the agent
    model?: string;              // "haiku" | "sonnet" | "opus" | "inherit"
    color?: string;              // Display color for UI
    getSystemPrompt: () => string;  // System prompt generator
    criticalSystemReminder_EXPERIMENTAL?: string;  // Critical reminder
}
```

---

## General-Purpose Agent (q96)

### What it does

The default agent for complex multi-step tasks requiring full tool access.

### Source Code

```javascript
// ============================================
// q96 - GENERAL_PURPOSE_AGENT - Default general-purpose agent
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
    whenToUse: `General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.`,
    tools: ["*"],  // All tools available
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: getGeneralPurposeSystemPrompt
};

// Mapping: q96→GENERAL_PURPOSE_AGENT, yF9→getGeneralPurposeSystemPrompt
```

**Key insight:** The `tools: ["*"]` setting gives this agent access to all available tools, making it suitable for any task.

---

## Explore Agent (QB)

### What it does

Fast, read-only agent for codebase exploration without file modification capabilities.

### Source Code

```javascript
// ============================================
// QB - EXPLORE_AGENT - Read-only codebase exploration
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
    whenToUse: `Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.`,
    disallowedTools: [
        "Agent",           // r4 - Cannot spawn subagents
        "TaskOutput",      // Uk - Cannot poll tasks
        "Edit",            // R4 - Cannot edit files
        "Write",           // _K - Cannot write files
        "NotebookEdit"     // bJ - Cannot edit notebooks
    ],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",  // Fast, cheap model
    getSystemPrompt: () => getExploreSystemPrompt(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};

// Mapping: QB→EXPLORE_AGENT, RF9→EXPLORE_WHEN_TO_USE, r4→TOOL_NAME_AGENT,
//          Uk→TOOL_NAME_TASK_OUTPUT, R4→TOOL_NAME_EDIT, _K→TOOL_NAME_WRITE
```

**Why this approach:**
- **Haiku model** - Fast and cost-effective for exploration
- **Read-only restriction** - Prevents accidental file modifications
- **No subagent spawning** - Prevents recursive agent creation
- **Critical reminder** - Enforces read-only behavior

---

## Plan Agent (x01)

### What it does

Software architect agent for designing implementation plans without executing them.

### Source Code

```javascript
// ============================================
// x01 - PLAN_AGENT - Software architect planning
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
    whenToUse: `Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.`,
    disallowedTools: [
        "Agent",           // Cannot spawn subagents
        "TaskOutput",      // Cannot poll tasks
        "Edit",            // Cannot edit files
        "Write",           // Cannot write files
        "NotebookEdit"     // Cannot edit notebooks
    ],
    source: "built-in",
    tools: EXPLORE_AGENT.tools,  // Same tools as Explore
    baseDir: "built-in",
    model: "inherit",  // Uses parent's model
    getSystemPrompt: () => getPlanSystemPrompt(),
    criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
};

// Mapping: x01→PLAN_AGENT, hF9→getPlanSystemPrompt
```

**Key insight:** The `model: "inherit"` setting allows the Plan agent to use the same model as the parent agent, ensuring consistent reasoning quality for complex planning tasks.

---

## Status Line Setup Agent (X_4)

### What it does

Specialized agent for configuring Claude Code status line settings.

### Source Code

```javascript
// ============================================
// X_4 - STATUSLINE_SETUP_AGENT - Status line configuration
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
    tools: ["Read", "Edit"],  // Minimal tool set for config editing
    source: "built-in",
    baseDir: "built-in",
    model: "sonnet",
    color: "orange",  // Visual distinction in UI
    getSystemPrompt: () => `
You are a status line setup agent for Claude Code. Your job is to create or update
the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\\n)\\s*(?:export\\s+)?PS1\\s*=\\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \\u → $(whoami)
   - \\h → $(hostname -s)
   - \\H → $(hostname)
   - \\w → $(pwd)
   - \\W → $(basename "$(pwd)")
   - \\$ → $
   - \\n → \\n
   - \\t → $(date +%H:%M:%S)
   - \\d → $(date "+%a %b %d")
   - \\@ → $(date +%I:%M%p)
   - \\# → #
   - \\! → !

4. When using ANSI color codes, be sure to use \`printf\`.
   Do not remove colors. Note that the status line will be printed in a
   terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output,
   you MUST remove them.

6. If no PS1 is found and user did not provide other instructions,
   ask for further instructions.

...
`
};

// Mapping: X_4→STATUSLINE_SETUP_AGENT
```

**Why this approach:**
- **Minimal tool set** - Only Read and Edit for config files
- **Orange color** - Visual distinction in UI
- **Sonnet model** - Good balance of speed and capability

---

## Claude Code Guide Agent (G_4)

### What it does

Help agent for Claude Code documentation and API usage.

### Source Code

```javascript
// ============================================
// G_4 - CLAUDE_CODE_GUIDE_AGENT - Claude Code help agent
// Location: chunks.93.mjs:2040+
// ============================================

// READABLE (for understanding):
const CLAUDE_CODE_GUIDE_AGENT = {
    agentType: "claude-code-guide",
    whenToUse: `Help agent for Claude Code, Claude Agent SDK, and Claude API documentation.
    Use this when users ask about:
    - Claude Code CLI installation, configuration, hooks, skills, MCP servers
    - Claude Agent SDK for building custom AI agents
    - Claude API (Anthropic API) for direct model interaction`,
    tools: ["Read", "WebFetch", "WebSearch", "Glob", "Grep"],
    source: "built-in",
    baseDir: "built-in",
    model: "inherit",
    getSystemPrompt: () => `
You are the Claude guide agent. Your primary responsibility is helping users
understand and use Claude Code, the Claude Agent SDK, and the Claude API effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills,
   MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on
   Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for
   direct model interaction, tool use, and integrations.

**Approach:**
1. Determine which domain the user's question falls into
2. Use WebFetch to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use WebSearch if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant
`
};
```

---

## Tool Filtering Algorithm

### What it does

Filters available tools based on agent definition, execution mode, and context.

### Source Code

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent context
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Background agent excluded tools - always blocked
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

        // Non-built-in tools can't use certain built-in-only tools
        if (!isBuiltIn && BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Async mode restrictions
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Special case: team mode with experiments
            if (isTeamMode() && hasExperiments()) {
                // Agent tool allowed for team spawning
                if (isToolNamed(tool, "Agent")) return true;
                // Team delegate tools allowed
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync,
//          Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS,
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS
```

---

## Tool Access Constants

### BACKGROUND_AGENT_EXCLUDED_TOOLS (CW6)

Tools that background agents cannot use:

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC])

// READABLE (for understanding):
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",     // $C - Could create polling loops
    "ExitPlanMode",   // aJ - Requires user approval
    "EnterPlanMode",  // dt - Requires user approval
    "Agent",          // r4 - Could spawn nested agents
    "AskUserQuestion",// Fw - Would block indefinitely
    "TaskStop"        // OC - Background shouldn't manage tasks
]);
```

### ASYNC_AGENT_ALLOWED_TOOLS (eP1)

Tools that async/background agents can use:

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1])

// READABLE (for understanding):
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read",           // s7 - File reading
    "WebFetch",       // jv - Network requests
    "TodoWrite",      // MB - Task tracking
    "Grep",           // N9 - Content search
    "WebSearch",      // sO - Web search
    "Glob",           // qz - File patterns
    // ...ZU - Additional file tools
    "Edit",           // R4 - File editing
    "Write",          // _K - File writing
    "NotebookEdit",   // bJ - Jupyter editing
    "Bash",           // oH - Shell commands
    "Skill",          // oM - Skill invocation
    "StructuredOutput",// HZ - Output formatting
    "EnterWorktree",  // sP1 - Worktree isolation
    "ExitWorktree"    // tP1 - Worktree exit
]);
```

### TEAM_DELEGATE_TOOLS (WY4)

Tools available to team delegate mode agents:

```javascript
// ============================================
// WY4 - TEAM_DELEGATE_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
const TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate",     // TR - Create structured tasks
    "TaskGet",        // lt - Get task by ID
    "TaskList",       // it - List all tasks
    "TaskUpdate",     // ck - Update task
    "SendMessage",    // hI - Team communication
    "CronCreate",     // ER - Create scheduled job
    "CronDelete",     // ed - Delete scheduled job
    "CronList"        // SW6 - List scheduled jobs
]);
```

---

## Agent Type Comparison Matrix

| Feature | General-Purpose | Explore | Plan | Statusline-Setup | Guide |
|---------|----------------|---------|------|------------------|-------|
| **Model** | Default | Haiku | Inherit | Sonnet | Inherit |
| **Tools** | All (*) | Read-only | Read-only | Read, Edit | Read, WebFetch, Search |
| **Can Edit Files** | ✓ | ✗ | ✗ | ✓ | ✗ |
| **Can Spawn Agents** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Color** | Default | Default | Default | Orange | Default |
| **Read-Only Reminder** | ✗ | ✓ | ✓ | ✗ | ✗ |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `q96` | GENERAL_PURPOSE_AGENT | chunks.93.mjs:1681 | ✅ Verified |
| `QB` | EXPLORE_AGENT | chunks.93.mjs:1871 | ✅ Verified |
| `x01` | PLAN_AGENT | chunks.93.mjs:1944 | ✅ Verified |
| `X_4` | STATUSLINE_SETUP_AGENT | chunks.93.mjs:1694 | ✅ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✅ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✅ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✅ Verified |
| `WY4` | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | ✅ Verified |