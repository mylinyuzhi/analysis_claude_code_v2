# Claude Code v2.1.7 - Built-in Agents

## Overview

Claude Code v2.1.7 ships with **6 built-in agents**, each specialized for different types of tasks. All built-in agents are defined in `chunks.93.mjs`.

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key agent variables:
- `bashAgent` (K52) - Command execution specialist **(NEW in 2.1.x)**
- `generalPurposeAgent` ($Y1) - Full capabilities agent
- `statuslineSetupAgent` (F52) - Status line specialist
- `exploreAgent` (MS) - Read-only explorer
- `planAgent` (UY1) - Architecture planner
- `claudeCodeGuideAgent` (z52) - Documentation helper

---

## Changes from v2.0.59

| Change | v2.0.59 | v2.1.7 |
|--------|---------|--------|
| Agent count | 5 | **6** (added Bash) |
| File location | chunks.125.mjs | chunks.93.mjs |
| claude-code-guide scope | Claude Code + SDK | **Claude Code + SDK + Claude API** |
| Bash agent | N/A | **NEW** - Command execution specialist |

---

## Tool Restriction Summary

All agents are subject to the **system-wide blocked tools** which blocks:
- `Task` (f3) - No subagent recursion
- `AskUserQuestion` (BY) - No direct user interaction
- `EnterPlanMode` (I8) - No plan mode control
- `ExitPlanMode` (CY1) - No plan mode control
- `KillShell` (tq) - No shell management

| Agent | tools | disallowedTools | Effective Tools |
|-------|-------|-----------------|-----------------|
| Bash | `[Bash]` | `[]` | Bash only |
| general-purpose | `["*"]` | `[]` | All tools (minus system blocks) |
| statusline-setup | `["Read", "Edit"]` | `[]` | Read, Edit only |
| Explore | (default) | `[Task, ExitPlanMode, EnterPlanMode, AskUserQuestion, KillShell]` | Read-only tools |
| Plan | Same as Explore | Same as Explore | Read-only tools |
| claude-code-guide | `[Glob, Grep, Read, WebFetch, WebSearch]` | `[]` | Specified 5 tools |

> See [tool_restrictions.md](tool_restrictions.md) for detailed filtering logic.

---

## Complete Agent List

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
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli")
    A.push(z52);
  return A
}

// READABLE (for understanding):
function getBuiltInAgents() {
  let agents = [bashAgent, generalPurposeAgent, statuslineSetupAgent, exploreAgent, planAgent];
  // Conditionally add claude-code-guide (not for SDK entrypoints)
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
    agents.push(claudeCodeGuideAgent);
  }
  return agents;
}

// Mapping: ED0→getBuiltInAgents, K52→bashAgent, $Y1→generalPurposeAgent, F52→statuslineSetupAgent,
//          MS→exploreAgent, UY1→planAgent, z52→claudeCodeGuideAgent
```

---

## 1. Bash (NEW in 2.1.x)

**Location**: `chunks.93.mjs` lines 19-27

### Configuration

```javascript
// ============================================
// bashAgent - Command execution specialist
// Location: chunks.93.mjs:19-27
// ============================================

// ORIGINAL (for source lookup):
K52 = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [X9],
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",
  getSystemPrompt: () => rZ5
}

// READABLE (for understanding):
bashAgent = {
  agentType: "Bash",
  whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
  tools: [BASH_TOOL_NAME],  // Only Bash tool
  source: "built-in",
  baseDir: "built-in",
  model: "inherit",         // Uses parent's model
  getSystemPrompt: () => bashSystemPrompt
}

// Mapping: K52→bashAgent, X9→BASH_TOOL_NAME, rZ5→bashSystemPrompt
```

### System Prompt

```
You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.
```

### Characteristics

- **NEW in 2.1.x**: First addition to built-in agents since launch
- **Highly focused**: Only has access to Bash tool
- **Model inheritance**: Uses parent's model (saves cost, matches capability)
- **Autonomous execution**: Handles multi-step command sequences
- **Error handling**: Explains failures and suggests solutions

### Use Cases

- Git operations (commit, push, branch management)
- Build and test commands
- System administration tasks
- Multi-step command sequences
- When main agent wants to offload shell work

### Why Bash Agent vs Bash Tool?

| Aspect | Bash Tool | Bash Agent |
|--------|-----------|------------|
| Scope | Single command | Multi-step sequences |
| Decision making | None | LLM decides next command |
| Error handling | Returns error | Agent handles autonomously |
| Context usage | Main agent context | Isolated context |

---

## 2. general-purpose

**Location**: `chunks.93.mjs` lines 33-56

### Configuration

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
  getSystemPrompt: () => `...`
}

// READABLE (for understanding):
generalPurposeAgent = {
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions...",
  tools: ["*"],           // All tools available
  source: "built-in",
  baseDir: "built-in",
  // Note: No model specified - uses default
  getSystemPrompt: () => generalPurposeSystemPrompt
}

// Mapping: $Y1→generalPurposeAgent
```

### System Prompt

```
You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

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
- For clear communication, avoid using emojis.
```

### Characteristics

- **Most versatile agent**: Has access to all tools
- **Multi-step capable**: Can perform complex research workflows
- **Thorough**: Designed to check multiple locations and approaches
- **Default research agent**: When general investigation is needed

### Use Cases

- Complex codebase exploration
- Multi-step research tasks
- When you're not sure where to find something
- Architecture analysis across multiple files
- Pattern discovery in large codebases

---

## 3. statusline-setup

**Location**: `chunks.93.mjs` lines 61-170

### Configuration

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
  getSystemPrompt: () => `...`
}

// READABLE (for understanding):
statuslineSetupAgent = {
  agentType: "statusline-setup",
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: ["Read", "Edit"],  // Limited to Read and Edit only
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",          // Uses Sonnet for reliability
  color: "orange",          // UI distinction
  getSystemPrompt: () => statuslineSetupSystemPrompt
}

// Mapping: F52→statuslineSetupAgent
```

### System Prompt (Summary)

The statusline-setup agent has a comprehensive system prompt that covers:
1. Reading shell configuration files (~/.zshrc, ~/.bashrc, etc.)
2. Extracting and converting PS1 escape sequences
3. JSON input structure for statusLine command (session_id, model, workspace, context_window, vim mode)
4. Writing to ~/.claude/settings.json
5. Creating custom scripts in ~/.claude/

### Characteristics

- **Specialized**: Only for status line configuration
- **Limited tools**: Read and Edit only (no file creation risks)
- **Shell expert**: Understands PS1 and shell configuration
- **Stateful awareness**: Instructs parent to use same agent for future changes
- **Color**: Orange (for UI distinction)

### Use Cases

- Converting shell PS1 to Claude Code status line
- Setting up custom status line commands
- Modifying status line configuration
- Shell configuration extraction

---

## 4. Explore

**Location**: `chunks.93.mjs` lines 219-228

### Configuration

```javascript
// ============================================
// exploreAgent - Fast read-only explorer
// Location: chunks.93.mjs:219-228
// ============================================

// ORIGINAL (for source lookup):
MS = {
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
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
  whenToUse: "Fast agent specialized for exploring codebases...",
  disallowedTools: [TASK_TOOL_NAME, EXIT_PLAN_MODE_NAME, ENTER_PLAN_MODE_NAME, ASKUSER_NAME, KILLSHELL_NAME],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",           // Fast model for quick responses
  getSystemPrompt: () => exploreSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: MS→exploreAgent, sZ5→exploreSystemPrompt
```

### System Prompt (Key Points)

```
=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files
- Modifying existing files
- Deleting files
- Running ANY commands that change system state

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

NOTE: You are meant to be a fast agent that returns output as quickly as possible.
- Make efficient use of the tools
- Spawn multiple parallel tool calls for grepping and reading files
```

### Characteristics

- **READ-ONLY**: Cannot modify any files (enforced by disallowedTools + criticalSystemReminder)
- **FAST**: Uses Haiku model for quick responses
- **Search specialist**: Optimized for file and code searches
- **Parallel**: Encourages parallel tool calls for speed
- **Thoroughness levels**: Supports quick/medium/thorough modes

### Disallowed Tools

```javascript
disallowedTools: [
  Task,              // No subagent spawning
  ExitPlanMode,      // No plan mode control
  EnterPlanMode,     // No plan mode control
  AskUserQuestion,   // No user interaction
  KillShell          // No shell management
]
```

### Use Cases

- Quick file pattern searches ("find all .tsx files in components/")
- Code keyword searches ("find all API endpoint definitions")
- Codebase exploration questions ("how does authentication work?")
- Rapid information gathering
- When you need fast, read-only access

---

## 5. Plan

**Location**: `chunks.93.mjs` lines 289-299

### Configuration

```javascript
// ============================================
// planAgent - Software architecture planner
// Location: chunks.93.mjs:289-299
// ============================================

// ORIGINAL (for source lookup):
UY1 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
  disallowedTools: [f3, CY1, I8, BY, tq],
  source: "built-in",
  tools: MS.tools,
  baseDir: "built-in",
  model: "inherit",
  getSystemPrompt: () => tZ5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// READABLE (for understanding):
planAgent = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [TASK_TOOL_NAME, EXIT_PLAN_MODE_NAME, ENTER_PLAN_MODE_NAME, ASKUSER_NAME, KILLSHELL_NAME],
  source: "built-in",
  tools: exploreAgent.tools,  // Same tools as Explore
  baseDir: "built-in",
  model: "inherit",           // Uses parent's model for complex planning
  getSystemPrompt: () => planSystemPrompt,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}

// Mapping: UY1→planAgent, tZ5→planSystemPrompt
```

### System Prompt (Key Points)

```
You are a software architect and planning specialist for Claude Code.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===

## Your Process
1. Understand Requirements
2. Explore Thoroughly (using Glob, Grep, Read, Bash for read-only ops)
3. Design Solution
4. Detail the Plan

## Required Output
End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason]
- path/to/file2.ts - [Brief reason]
```

### Characteristics

- **READ-ONLY**: Cannot modify files (same restrictions as Explore)
- **Architect**: Focuses on design and planning, not implementation
- **Model inheritance**: Uses same model as parent (Sonnet/Opus for complex planning)
- **Structured output**: Required to list critical files
- **Perspective-aware**: Can be given different architectural perspectives

### Model: "inherit"

Unique property - inherits the parent agent's model:
- If parent uses Sonnet, Plan uses Sonnet
- If parent uses Opus, Plan uses Opus
- Allows matching planning sophistication to parent's capabilities

### Required Output Format

Must end response with:
```
### Critical Files for Implementation
- path/to/file1.ts - [reason]
- path/to/file2.ts - [reason]
- path/to/file3.ts - [reason]
```

### Use Cases

- Designing implementation strategies
- Architecture planning
- Refactoring design
- Feature planning before implementation
- Understanding dependencies and sequencing

---

## 6. claude-code-guide

**Location**: `chunks.93.mjs` lines 382-449

### Configuration

```javascript
// ============================================
// claudeCodeGuideAgent - Documentation helper
// Location: chunks.93.mjs:382-449
// ============================================

// ORIGINAL (for source lookup):
z52 = {
  agentType: AY5,  // "claude-code-guide"
  whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
  tools: [lI, DI, z3, cI, aR],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  permissionMode: "dontAsk",
  getSystemPrompt({ toolUseContext: A }) { ... }
}

// READABLE (for understanding):
claudeCodeGuideAgent = {
  agentType: "claude-code-guide",
  whenToUse: "Use this agent when the user asks questions about Claude Code, Agent SDK, or Claude API...",
  tools: [GLOB_TOOL_NAME, GREP_TOOL_NAME, READ_TOOL_NAME, WEBFETCH_TOOL_NAME, WEBSEARCH_TOOL_NAME],
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",              // Fast for doc lookups
  permissionMode: "dontAsk",   // No permission prompts
  getSystemPrompt({ toolUseContext }) { ... }  // Dynamic!
}

// Mapping: z52→claudeCodeGuideAgent, AY5→CLAUDE_CODE_GUIDE_NAME, lI→GLOB_TOOL_NAME,
//          DI→GREP_TOOL_NAME, z3→READ_TOOL_NAME, cI→WEBFETCH_TOOL_NAME, aR→WEBSEARCH_TOOL_NAME
```

### System Prompt (v2.1.7 - Three Domains)

```
You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**
- Claude Code docs: https://code.claude.com/docs/en/claude_code_docs_map.md
- Claude Agent SDK docs: https://platform.claude.com/llms.txt
- Claude API docs: https://platform.claude.com/llms.txt
```

### Dynamic System Prompt

The system prompt is dynamically generated to include user's configuration:

```javascript
getSystemPrompt({ toolUseContext }) {
  let customContent = [];

  // Add custom skills
  const customSkills = commands.filter(c => c.type === "prompt");
  if (customSkills.length > 0) {
    customContent.push(`**Available custom skills in this project:**\n${...}`);
  }

  // Add custom agents
  const customAgents = agentDefinitions.activeAgents.filter(a => a.source !== "built-in");
  if (customAgents.length > 0) {
    customContent.push(`**Available custom agents configured:**\n${...}`);
  }

  // Add MCP servers
  if (mcpClients?.length > 0) {
    customContent.push(`**Configured MCP servers:**\n${...}`);
  }

  // Add user's settings.json
  const settings = getUserSettings();
  if (Object.keys(settings).length > 0) {
    customContent.push(`**User's settings.json:**\n${JSON.stringify(settings, null, 2)}`);
  }

  // Combine base prompt with user configuration
  return customContent.length > 0
    ? `${basePrompt}\n\n---\n\n# User's Current Configuration\n\n${customContent.join("\n\n")}`
    : basePrompt;
}
```

### Characteristics

- **Documentation expert**: Specialized in Claude Code, SDK, and API docs
- **Three domains** (v2.1.7 expansion): Claude Code + Agent SDK + Claude API
- **Resume support**: Explicitly encourages reusing agent instances
- **Permission mode**: "dontAsk" - no permission prompts for speed
- **Dynamic context**: System prompt includes user's custom configuration
- **Web-enabled**: Can fetch docs and search web
- **Haiku model**: Fast responses for documentation lookups

### Conditional Loading

This agent is conditionally enabled:

```javascript
// Only load if NOT using SDK entrypoints
if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
  agents.push(claudeCodeGuideAgent);
}
```

### Use Cases

- Questions about Claude Code features
- How to use hooks, slash commands, MCP
- SDK architecture questions
- **Claude API usage** (NEW in v2.1.7)
- Configuration help
- Feature discovery
- Best practices

---

## Agent Comparison Matrix

| Agent | Model | Tools | Read-Only | Speed | Primary Use |
|-------|-------|-------|-----------|-------|-------------|
| **Bash** | Inherit | Bash only | No | Varies | Command execution |
| general-purpose | Default | All (*) | No | Medium | Complex research, multi-step tasks |
| statusline-setup | Sonnet | Read, Edit | No | Medium | Status line configuration |
| Explore | **Haiku** | Read-only | **Yes** | **Fast** | Quick searches, exploration |
| Plan | Inherit | Read-only | **Yes** | Varies | Architecture planning |
| claude-code-guide | **Haiku** | Web+Files | **Yes** | **Fast** | Documentation help |

---

## Advanced Configuration Properties

### forkContext

Controls whether the agent sees conversation history before the Task tool call.

| Agent | forkContext | Behavior |
|-------|-------------|----------|
| Bash | `undefined` (false) | Only sees prompt parameter |
| general-purpose | `undefined` (false) | Only sees prompt parameter |
| statusline-setup | `undefined` (false) | Only sees prompt parameter |
| Explore | `undefined` (false) | Only sees prompt parameter |
| Plan | `undefined` (false) | Only sees prompt parameter |
| claude-code-guide | `undefined` (false) | Only sees prompt parameter |

**Note**: None of the built-in agents use `forkContext: true`. This feature is primarily for custom agents that need conversation context.

### criticalSystemReminder_EXPERIMENTAL

An extra safety reminder injected into the system prompt for read-only agents.

| Agent | criticalSystemReminder_EXPERIMENTAL | Purpose |
|-------|-------------------------------------|---------|
| Bash | `undefined` | N/A (can execute commands) |
| general-purpose | `undefined` | N/A (can modify) |
| statusline-setup | `undefined` | N/A (can modify via Edit) |
| Explore | **Set** | Reinforce read-only restriction |
| Plan | **Set** | Reinforce read-only restriction |
| claude-code-guide | `undefined` | N/A (tools naturally read-only) |

### permissionMode

Controls how the agent handles permission prompts.

| Agent | permissionMode | Behavior |
|-------|---------------|----------|
| Bash | `undefined` | Default permission handling |
| general-purpose | `undefined` | Default permission handling |
| statusline-setup | `undefined` | Default permission handling |
| Explore | `undefined` | Default permission handling |
| Plan | `undefined` | Default permission handling |
| claude-code-guide | **`"dontAsk"`** | Never prompt for permissions |

### model

| Agent | model | Actual Model Used |
|-------|-------|-------------------|
| **Bash** | `"inherit"` | **Same as parent agent** |
| general-purpose | (undefined) | Default model |
| statusline-setup | `"sonnet"` | Claude Sonnet |
| Explore | `"haiku"` | Claude Haiku (fast) |
| Plan | `"inherit"` | Same as parent agent |
| claude-code-guide | `"haiku"` | Claude Haiku (fast) |

---

## Common Patterns

### Read-Only Agents

Three agents are strictly read-only (Explore, Plan, claude-code-guide):
- Disallow: Write, Edit, NotebookEdit, Bash (write ops), TodoWrite (some)
- Critical system reminder for extra safety
- Use Haiku or inherit model for efficiency
- Focus on analysis/planning, not modification

### Fast Agents

Two agents use Haiku for speed (Explore, claude-code-guide):
- Optimized for quick lookups and searches
- Parallel tool calls encouraged
- Return results rapidly
- Lower cost

### Model Inheritance Agents

Two agents inherit parent model (Bash, Plan):
- Match capability to task complexity
- Consistent quality with main agent
- Efficient resource usage

### Special Purpose Agents

Three agents have very specific purposes (Bash, statusline-setup, claude-code-guide):
- Narrow tool access
- Specialized prompts
- Handle specific user requests
- Optional/conditional loading

---

## Summary

Claude Code v2.1.7's 6 built-in agents provide:

1. **Bash** (NEW) - Command execution specialist, inherits model
2. **general-purpose** - Swiss Army knife for complex tasks
3. **statusline-setup** - Shell configuration specialist
4. **Explore** - Fast read-only code explorer
5. **Plan** - Software architect for planning
6. **claude-code-guide** - Documentation helper (now covers API too)

This set covers:
- ✅ Command execution (Bash - NEW)
- ✅ General research (general-purpose)
- ✅ Quick exploration (Explore)
- ✅ Planning without modification (Plan)
- ✅ Specialized configuration (statusline-setup)
- ✅ User support (claude-code-guide)
- ✅ Read-only safety (Explore, Plan, claude-code-guide)
- ✅ Speed optimization (Haiku agents)
- ✅ Model flexibility (inherit)

---

## Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md)

Key symbols in this document:
- `ED0` (getBuiltInAgents) - Returns all built-in agents
- `K52` (bashAgent) - Bash agent definition
- `$Y1` (generalPurposeAgent) - General-purpose agent definition
- `F52` (statuslineSetupAgent) - Status line agent definition
- `MS` (exploreAgent) - Explore agent definition
- `UY1` (planAgent) - Plan agent definition
- `z52` (claudeCodeGuideAgent) - Claude Code guide agent definition
- `rZ5` (bashSystemPrompt) - Bash agent system prompt
- `sZ5` (exploreSystemPrompt) - Explore agent system prompt
- `tZ5` (planSystemPrompt) - Plan agent system prompt
- `QY5` (claudeCodeGuideSystemPrompt) - Claude Code guide system prompt

---

## See Also

- [architecture.md](./architecture.md) - Agent system architecture
- [execution.md](./execution.md) - Execution flow and patterns
- [tool_restrictions.md](./tool_restrictions.md) - Tool filtering system
- [communication.md](./communication.md) - Communication patterns
