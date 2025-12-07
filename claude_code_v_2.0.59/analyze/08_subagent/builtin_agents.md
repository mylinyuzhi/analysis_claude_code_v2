# Claude Code v2.0.59 - Built-in Agents

## Overview

Claude Code v2.0.59 ships with **5 built-in agents**, each specialized for different types of tasks. All built-in agents are defined in `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.0.59/source/chunks.125.mjs` except claude-code-guide which is in `chunks.60.mjs`.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key agent variables:
- `generalPurposeAgent` (o51) - Full capabilities agent
- `statuslineSetupAgent` (Gf2) - Status line specialist
- `exploreAgent` (xq) - Read-only explorer
- `planAgent` (kWA) - Architecture planner
- `claudeCodeGuideAgent` (iCB) - Documentation helper

---

## Tool Restriction Summary

All agents are subject to the **CTA (ALWAYS_BLOCKED_TOOLS)** set which blocks:
- `Task` - No subagent recursion
- `AskUserQuestion` - No direct user interaction
- `EnterPlanMode` - No plan mode control
- `ExitPlanMode` - No plan mode control
- `KillShell` - No shell management

| Agent | tools | disallowedTools | Effective Tools |
|-------|-------|-----------------|-----------------|
| general-purpose | `["*"]` | `[]` | All tools (minus CTA) |
| statusline-setup | `["Read", "Edit"]` | `[]` | Read, Edit only |
| Explore | `["*"]` | `[Write, Edit, NotebookEdit, Bash, TodoWrite]` | Read-only tools |
| Plan | `["*"]` | `[TodoWrite]` | All except TodoWrite |
| claude-code-guide | `["Glob", "Grep", "Read", "WebFetch", "WebSearch"]` | `[]` | Specified 5 tools |

> See [tool_restrictions.md](tool_restrictions.md) for detailed filtering logic.

---

## Complete Agent List

```javascript
// From chunks.125.mjs lines 1489-1493
function N70() {
  let A = [o51, Gf2, xq, kWA];  // Base agents
  if (Y0(process.env.ENABLE_CODE_GUIDE_SUBAGENT) ||
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
      process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli")
    A.push(iCB);  // Conditionally add claude-code-guide
  return A
}
```

**Agent Variables**:
- `o51` → general-purpose
- `Gf2` → statusline-setup
- `xq` → Explore
- `kWA` → Plan
- `iCB` → claude-code-guide

---

## 1. general-purpose

**Location**: `chunks.125.mjs` lines 1243-1267

### Configuration

```javascript
{
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
  tools: ["*"],              // All tools available
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",          // Claude Sonnet
  getSystemPrompt: () => `...`
}
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

## 2. statusline-setup

**Location**: `chunks.125.mjs` lines 1272-1360

### Configuration

```javascript
{
  agentType: "statusline-setup",
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: ["Read", "Edit"],   // Limited to Read and Edit only
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",
  color: "orange",
  getSystemPrompt: () => `...`
}
```

### System Prompt

```
You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\n)\s*(?:export\s+)?PS1\s*=\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \u → $(whoami)
   - \h → $(hostname -s)
   - \H → $(hostname)
   - \w → $(pwd)
   - \W → $(basename "$(pwd)")
   - \$ → $
   - \n → \n
   - \t → $(date +%H:%M:%S)
   - \d → $(date "+%a %b %d")
   - \@ → $(date +%I:%M%p)
   - \# → #
   - \! → !

4. When using ANSI color codes, be sure to use `printf`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string"   // Project root directory path
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     }
   }

   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command",
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
```

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

## 3. Explore

**Location**: `chunks.125.mjs` lines 1366-1413

### Configuration

```javascript
{
  agentType: "Explore",
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
  disallowedTools: [Write, Edit, NotebookEdit, Bash, TodoWrite],  // Read-only!
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",  // Fast model
  getSystemPrompt: () => li5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

### System Prompt (stored in `li5`)

```
You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use Glob for broad file pattern matching
- Use Grep for searching file contents with regex
- Use Read when you know the specific file path you need to read
- Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.
```

### Characteristics

- **READ-ONLY**: Cannot modify any files (enforced by disallowedTools)
- **FAST**: Uses Haiku model for quick responses
- **Search specialist**: Optimized for file and code searches
- **Parallel**: Encourages parallel tool calls for speed
- **Thoroughness levels**: Supports quick/medium/thorough modes
- **Critical reminder**: Extra safety layer against modifications

### Disallowed Tools

```javascript
disallowedTools: [
  Write,          // Cannot create files
  Edit,           // Cannot modify files
  NotebookEdit,   // Cannot edit notebooks
  Bash,           // Cannot run shell commands (READ-ONLY bash via other means)
  TodoWrite       // Cannot modify todo list
]
```

### Use Cases

- Quick file pattern searches ("find all .tsx files in components/")
- Code keyword searches ("find all API endpoint definitions")
- Codebase exploration questions ("how does authentication work?")
- Rapid information gathering
- When you need fast, read-only access

---

## 4. Plan

**Location**: `chunks.125.mjs` lines 1420-1484

### Configuration

```javascript
{
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
  disallowedTools: [Write, Edit, NotebookEdit, Bash, TodoWrite],  // Read-only!
  tools: xq.tools,  // Same tools as Explore agent
  baseDir: "built-in",
  model: "inherit",  // Uses same model as parent agent
  getSystemPrompt: () => ii5,
  criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
}
```

### System Prompt (stored in `ii5`)

```
You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using Glob, Grep, and Read
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.
```

### Characteristics

- **READ-ONLY**: Cannot modify files (same restrictions as Explore)
- **Architect**: Focuses on design and planning, not implementation
- **Model inheritance**: Uses same model as parent (Sonnet/Opus for complex planning)
- **Structured output**: Required to list critical files
- **Perspective-aware**: Can be given different architectural perspectives

### Model: "inherit"

Unique among built-in agents - inherits the parent agent's model:
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

## 5. claude-code-guide

**Location**: `chunks.60.mjs` lines 783-897

### Configuration

```javascript
{
  agentType: "claude-code-guide",
  whenToUse: 'Use this agent when the user asks questions about Claude Code or the Claude Agent SDK. This includes questions about Claude Code features ("can Claude Code...", "does Claude Code have..."), how to use specific features (hooks, slash commands, MCP servers), and Claude Agent SDK architecture or development. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter. Reusing an existing agent is more efficient and maintains context from previous documentation lookups.',
  tools: ["Glob", "Grep", "Read", "WebFetch", "WebSearch"],  // Specific tools
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",  // Fast model
  permissionMode: "dontAsk",  // No permission prompts
  getSystemPrompt({ toolUseContext }) { ... }  // Dynamic system prompt
}
```

### System Prompt (stored in `GJ6`)

```
You are the Claude Code guide agent. Your primary responsibility is helping users understand and use Claude Code and the Claude Agent SDK effectively.

**Your expertise:**
- Claude Code features and capabilities
- How to implement and use hooks
- Creating and using slash commands
- Installing and configuring MCP servers
- Claude Agent SDK architecture and development
- Best practices for using Claude Code
- Keyboard shortcuts and hotkeys
- Available slash commands (built-in and custom)
- Configuration options and settings

**Approach:**
1. Use WebFetch to access the documentation maps:
   - Claude Code: [documentation map URL]
   - Agent SDK: [documentation map URL]
2. From the docs maps, identify the most relevant documentation URLs for the user's question:
   - **Getting Started**: Installation, setup, and basic usage
   - **Features**: Core capabilities like modes (Plan, Build, Deploy), REPL, terminal integration, and interactive features
   - **Built-in slash commands**: Commands like /context, /usage, /model, /help, /todos, etc. that let the user access more information or perform actions
   - **Customization**: Creating custom slash commands, hooks (pre/post command execution), and agents
   - **MCP Integration**: Installing and configuring Model Context Protocol servers for extended capabilities
   - **Configuration**: Settings files, environment variables, and project-specific setup
   - **Agent SDK**: Architecture, building agents, available tools, and SDK development patterns
3. Fetch the specific documentation pages using WebFetch
4. Provide clear, actionable guidance based on the official documentation
5. Use WebSearch if you need additional context or the docs don't cover the topic
6. Reference local project files (CLAUDE.md, .claude/ directory, etc.) when relevant using Read, Glob, and Grep

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets (for the agent SDK) when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.
```

### Dynamic System Prompt

The system prompt is dynamically generated based on the user's current configuration:

```javascript
getSystemPrompt({ toolUseContext: A }) {
  let Q = A.options.commands,
    B = [],
    // Collect custom slash commands
    G = Q.filter((V) => V.type === "prompt");
  if (G.length > 0) {
    let V = G.map((F) => `- /${F.name}: ${F.description}`).join("\n");
    B.push(`**Available custom slash commands in this project:**\n${V}`)
  }

  // Collect custom agents
  let Z = A.options.agentDefinitions.activeAgents.filter((V) => V.source !== "built-in");
  if (Z.length > 0) {
    let V = Z.map((F) => `- ${F.agentType}: ${F.whenToUse}`).join("\n");
    B.push(`**Available custom agents configured:**\n${V}`)
  }

  // Collect MCP servers
  let I = A.options.mcpClients;
  if (I && I.length > 0) {
    let V = I.map((F) => `- ${F.name}`).join("\n");
    B.push(`**Configured MCP servers:**\n${V}`)
  }

  // Include user settings
  let J = l0();  // Get settings.json
  if (Object.keys(J).length > 0) {
    let V = JSON.stringify(J, null, 2);
    B.push(`**User's settings.json:**\n\`\`\`json\n${V}\n\`\`\``)
  }

  // Combine base prompt with user configuration
  let X = `${GJ6}\n${W}`;
  if (B.length > 0) return `${X}\n\n---\n\n# User's Current Configuration\n\nThe user has the following custom setup in their environment:\n\n${B.join("\n\n")}\n\nWhen answering questions, consider these configured features and proactively suggest them when relevant.`;
  return X
}
```

### Characteristics

- **Documentation expert**: Specialized in Claude Code and SDK docs
- **Resume support**: Explicitly encourages reusing agent instances
- **Permission mode**: "dontAsk" - no permission prompts for speed
- **Dynamic context**: System prompt includes user's custom configuration
- **Web-enabled**: Can fetch docs and search web
- **Haiku model**: Fast responses for documentation lookups

### Conditional Loading

This agent is conditionally enabled:

```javascript
// Only load if NOT using SDK entrypoints OR if explicitly enabled
if (Y0(process.env.ENABLE_CODE_GUIDE_SUBAGENT) ||
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
  A.push(iCB);  // Add claude-code-guide
}
```

### Use Cases

- Questions about Claude Code features
- How to use hooks, slash commands, MCP
- SDK architecture questions
- Configuration help
- Feature discovery
- Best practices

---

## Agent Comparison Matrix

| Agent | Model | Tools | Read-Only | Speed | Primary Use |
|-------|-------|-------|-----------|-------|-------------|
| general-purpose | Sonnet | All (*) | No | Medium | Complex research, multi-step tasks |
| statusline-setup | Sonnet | Read, Edit | No | Medium | Status line configuration |
| Explore | **Haiku** | Limited | **Yes** | **Fast** | Quick searches, exploration |
| Plan | Inherit | Limited | **Yes** | Varies | Architecture planning |
| claude-code-guide | **Haiku** | Web+Files | **Yes** | **Fast** | Documentation help |

---

## Advanced Configuration Properties

### forkContext

Controls whether the agent sees conversation history before the Task tool call.

| Agent | forkContext | Behavior |
|-------|-------------|----------|
| general-purpose | `undefined` (false) | Only sees prompt parameter |
| statusline-setup | `undefined` (false) | Only sees prompt parameter |
| Explore | `undefined` (false) | Only sees prompt parameter |
| Plan | `undefined` (false) | Only sees prompt parameter |
| claude-code-guide | `undefined` (false) | Only sees prompt parameter |

**Note**: None of the built-in agents use `forkContext: true`. This feature is primarily for custom agents that need conversation context.

### criticalSystemReminder_EXPERIMENTAL

An extra safety reminder injected into the system prompt for read-only agents.

```javascript
// Explore agent (chunks.125.mjs:1412)
criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."

// Plan agent (chunks.125.mjs:1483)
criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
```

| Agent | criticalSystemReminder_EXPERIMENTAL | Purpose |
|-------|-------------------------------------|---------|
| general-purpose | `undefined` | N/A (can modify) |
| statusline-setup | `undefined` | N/A (can modify via Edit) |
| Explore | **Set** | Reinforce read-only restriction |
| Plan | **Set** | Reinforce read-only restriction |
| claude-code-guide | `undefined` | N/A (tools naturally read-only) |

**How It Works:**
1. Stored in subagent context during BSA (createSubAgentContext)
2. Injected into system prompt during execution
3. Acts as additional safety layer beyond disallowedTools

### permissionMode

Controls how the agent handles permission prompts.

| Agent | permissionMode | Behavior |
|-------|---------------|----------|
| general-purpose | `undefined` | Default permission handling |
| statusline-setup | `undefined` | Default permission handling |
| Explore | `undefined` | Default permission handling |
| Plan | `undefined` | Default permission handling |
| claude-code-guide | **`"dontAsk"`** | Never prompt for permissions |

**Note**: The `"dontAsk"` mode is used by claude-code-guide because:
1. It only uses read-only tools (Glob, Grep, Read, WebFetch, WebSearch)
2. These tools don't require user permission confirmation
3. Speeds up documentation lookups

### model

| Agent | model | Actual Model Used |
|-------|-------|-------------------|
| general-purpose | `"sonnet"` | Claude Sonnet |
| statusline-setup | `"sonnet"` | Claude Sonnet |
| Explore | `"haiku"` | Claude Haiku (fast) |
| Plan | `"inherit"` | Same as parent agent |
| claude-code-guide | `"haiku"` | Claude Haiku (fast) |

**Model Selection Logic** (`resolveAgentModel` in chunks.59.mjs:3028):
1. Agent definition model (if specified and not "inherit")
2. Parent's main loop model
3. Override from Task tool call
4. Permission mode considerations

---

## Common Patterns

### Read-Only Agents

Three agents are strictly read-only (Explore, Plan, claude-code-guide):
- Disallow: Write, Edit, NotebookEdit, Bash (write ops), TodoWrite
- Critical system reminder for extra safety
- Use Haiku or inherit model for efficiency
- Focus on analysis/planning, not modification

### Fast Agents

Two agents use Haiku for speed (Explore, claude-code-guide):
- Optimized for quick lookups and searches
- Parallel tool calls encouraged
- Return results rapidly
- Lower cost

### Special Purpose Agents

Two agents have very specific purposes (statusline-setup, claude-code-guide):
- Narrow tool access
- Specialized prompts
- Handle specific user requests
- Optional/conditional loading

## Summary

Claude Code's 5 built-in agents provide:

1. **general-purpose** - Swiss Army knife for complex tasks
2. **statusline-setup** - Shell configuration specialist
3. **Explore** - Fast read-only code explorer
4. **Plan** - Software architect for planning
5. **claude-code-guide** - Documentation and help specialist

This set covers:
- ✅ General research (general-purpose)
- ✅ Quick exploration (Explore)
- ✅ Planning without modification (Plan)
- ✅ Specialized configuration (statusline-setup)
- ✅ User support (claude-code-guide)
- ✅ Read-only safety (Explore, Plan, claude-code-guide)
- ✅ Speed optimization (Haiku agents)
- ✅ Model flexibility (inherit)

The built-in agents demonstrate the subagent system's flexibility and the thoughtful design choices in Claude Code's architecture.
