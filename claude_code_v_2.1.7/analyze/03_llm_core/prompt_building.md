# Prompt Building Analysis - Claude Code v2.1.7

## Overview

The Prompt Building module constructs system prompts for Claude Code, managing:
- Core identity and behavioral guidelines
- Tool usage instructions
- MCP server/tool instructions
- Environment context injection
- Output style customization
- Git safety protocols

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules

Key functions in this document:
- `buildSystemPrompt` (rc) - Main system prompt assembly
- `buildMCPServerInstructions` (Fz7) - MCP server instruction builder
- `buildMCPCLIInstructions` (oY9) - MCP CLI usage instructions
- `buildEnvironmentContext` (rY9) - Environment context builder
- `buildOutputStyle` (sY9) - Output style resolver
- `buildAgentSystemPrompt` (pkA) - Agent-specific prompt builder

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   buildSystemPrompt (rc)                         │
│                   Main Orchestrator                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├── Core Identity
         │
         ├── Security Guidelines (aY9)
         │
         ├── Tone & Style (conditional)
         │
         ├── Task Management (if TodoWrite available)
         │
         ├── Tool Usage Policy
         │
         ├── Code References Format
         │
         ├── Output Style (sY9)
         │
         ├── MCP Instructions
         │   ├── buildMCPServerInstructions (Fz7)
         │   └── buildMCPCLIInstructions (oY9)
         │
         ├── Scratchpad Directory (Ez7)
         │
         └── Environment Context (rY9)
```

---

## 1. Main System Prompt Assembly

### buildSystemPrompt (rc) - chunks.146.mjs:2467-2605

The main function that assembles all prompt components in order.

```javascript
// ============================================
// buildSystemPrompt - Main system prompt assembly
// Location: chunks.146.mjs:2467-2605
// ============================================

// ORIGINAL (for source lookup):
async function rc(A, Q, B, G) {
  if (a1(void 0)) return ["You are Claude Code, Anthropic's official CLI for Claude."];

  let Z = o1(),
    [Y, J, X] = await Promise.all([Nc(Z), sY9(), rY9(Q, B)]);

  let D = r3().language;
  let W = new Set(A.map((F) => F.name));

  // Skill tool instruction (if available)
  let V = Y.map((F) => `/${F.userFacingName()}`).length > 0 && W.has(kF)
    ? `- /<skill-name> ... Use the ${kF} tool to execute them.`
    : "";

  return [
    // 1. Core identity + behavioral instructions
    `You are an interactive CLI tool that helps users...`,

    // 2. Security guidelines
    `${aY9}`,

    // 3. Feedback instructions
    // 4. Tone & Style (if no output style)
    // 5. Task Management (if TodoWrite available)
    // 6. Asking Questions (if AskUserQuestion available)
    // 7. Hooks notice
    // 8. Task Execution guidelines
    // 9. Tool usage policy
    // 10. Code references format
    // 11. Language preference
    // 12. Output style (if configured)
    // 13. MCP server instructions
    // 14. Scratchpad directory
    // 15. Environment context
  ];
}

// READABLE (for understanding):
async function buildSystemPrompt(tools, model, additionalWorkingDirs, mcpClients) {
  // Fallback for minimal mode
  if (parseBoolean(undefined)) {
    return ["You are Claude Code, Anthropic's official CLI for Claude."];
  }

  const workingDir = getWorkingDirectory();

  // Parallel loading of dependencies
  const [availableSkills, outputStyle, environmentContext] = await Promise.all([
    loadSkillsForPrompt(workingDir),
    buildOutputStyle(),
    buildEnvironmentContext(model, additionalWorkingDirs)
  ]);

  const userLanguage = getSettings().language;
  const toolNames = new Set(tools.map(t => t.name));

  // Build skill instructions if Skill tool available
  const skillInstructions = availableSkills.length > 0 && toolNames.has(SKILL_TOOL_NAME)
    ? `- /<skill-name> (e.g., /commit) is shorthand... Use the ${SKILL_TOOL_NAME} tool to execute them.`
    : "";

  return [
    // === SECTION 1: Core Identity ===
    `
You are an interactive CLI tool that helps users ${outputStyle !== null
      ? 'according to your "Output Style" below, which describes how you should respond to user queries.'
      : "with software engineering tasks."
    } Use the instructions below and the tools available to you to assist the user.

${SECURITY_GUIDELINES}
IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident...

If the user asks for help or wants to give feedback inform them of the following:
- /help: Get help with using Claude Code
- To give feedback, users should report the issue at https://github.com/anthropics/claude-code/issues

${outputStyle === null ? TONE_AND_STYLE_SECTION : ""}
${toolNames.has(TODO_WRITE_TOOL) ? TASK_MANAGEMENT_SECTION : ""}
${toolNames.has(ASK_USER_QUESTION_TOOL) ? ASKING_QUESTIONS_SECTION : ""}

Users may configure 'hooks', shell commands that execute in response to events...

${outputStyle === null || outputStyle.keepCodingInstructions ? CODING_INSTRUCTIONS_SECTION : ""}
- Tool results and user messages may include <system-reminder> tags...
- The conversation has unlimited context through automatic summarization.

# Tool usage policy
${toolNames.has(TASK_TOOL) ? TASK_TOOL_POLICY : ""}
${toolNames.has(WEB_FETCH_TOOL) ? WEB_FETCH_REDIRECT_POLICY : ""}
- You can call multiple tools in a single response...
- Use specialized tools instead of bash commands when possible...
- VERY IMPORTANT: When exploring the codebase... use the ${TASK_TOOL} with subagent_type=${EXPLORE_AGENT}...
`,

    // === SECTION 2: Security Guidelines (Repeated) ===
    `\n${SECURITY_GUIDELINES}\n`,

    // === SECTION 3: TodoWrite Reminder ===
    toolNames.has(TODO_WRITE_TOOL)
      ? `\nIMPORTANT: Always use the ${TODO_WRITE_TOOL} tool to plan and track tasks throughout the conversation.`
      : "",

    // === SECTION 4: Code References ===
    `
# Code References

When referencing specific functions or pieces of code include the pattern \`file_path:line_number\`...
`,

    // === SECTION 5: Empty (Reserved) ===
    "",

    // === SECTION 6: Environment Context ===
    `\n${environmentContext}`,

    // === SECTION 7: Language Preference ===
    userLanguage
      ? `\n# Language\nAlways respond in ${userLanguage}. Use ${userLanguage} for all explanations...\n`
      : "",

    // === SECTION 8: Output Style ===
    outputStyle !== null
      ? `\n# Output Style: ${outputStyle.name}\n${outputStyle.prompt}\n`
      : "",

    // === SECTION 9: MCP Server Instructions ===
    ...(mcpClients && mcpClients.length > 0 ? [buildMCPServerInstructions(mcpClients)] : []),

    // === SECTION 10: Scratchpad Directory ===
    buildScratchpadInstructions()
  ];
}

// Mapping: rc→buildSystemPrompt, A→tools, Q→model, B→additionalWorkingDirs, G→mcpClients,
//          Nc→loadSkillsForPrompt, sY9→buildOutputStyle, rY9→buildEnvironmentContext,
//          aY9→SECURITY_GUIDELINES, vD.name→TODO_WRITE_TOOL, zY→ASK_USER_QUESTION_TOOL,
//          f3→TASK_TOOL, MS.agentType→EXPLORE_AGENT
```

---

## 2. Prompt Components

### Security Guidelines (aY9)

```javascript
// Security guidelines constant - appears twice in prompt for emphasis
const SECURITY_GUIDELINES = `
IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases.
`;
```

### Tone & Style Section

```javascript
// Only included when no custom output style is configured
const TONE_AND_STYLE_SECTION = `
# Tone and style
- Only use emojis if the user explicitly requests it. Avoid using emojis in all communication unless asked.
- Your output will be displayed on a command line interface. Your responses should be short and concise. You can use Github-flavored markdown for formatting, and will be rendered in a monospace font using the CommonMark specification.
- Output text to communicate with the user; all text you output outside of tool use is displayed to the user. Only use tools to complete tasks. Never use tools like Bash or code comments as means to communicate with the user during the session.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one. This includes markdown files.
- Do not use a colon before tool calls. Your tool calls may not be shown directly in the output, so text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.

# Professional objectivity
Prioritize technical accuracy and truthfulness over validating the user's beliefs. Focus on facts and problem-solving, providing direct, objective technical info without any unnecessary superlatives, praise, or emotional validation. It is best for the user if Claude honestly applies the same rigorous standards to all ideas and disagrees when necessary, even if it may not be what the user wants to hear. Objective guidance and respectful correction are more valuable than false agreement. Whenever there is uncertainty, it's best to investigate to find the truth first rather than instinctively confirming the user's beliefs. Avoid using over-the-top validation or excessive praise when responding to users such as "You're absolutely right" or similar phrases.

# Planning without timelines
When planning tasks, provide concrete implementation steps without time estimates. Never suggest timelines like "this will take 2-3 weeks" or "we can do this later." Focus on what needs to be done, not when. Break work into actionable steps and let users decide scheduling.
`;
```

### Task Management Section

```javascript
// Only included when TodoWrite tool is available
const TASK_MANAGEMENT_SECTION = `
# Task Management
You have access to the TodoWrite tools to help you manage and plan tasks. Use these tools VERY frequently to ensure that you are tracking your tasks and giving the user visibility into your progress.
These tools are also EXTREMELY helpful for planning tasks, and for breaking down larger complex tasks into smaller steps. If you do not use this tool when planning, you may forget to do important tasks - and that is unacceptable.

It is critical that you mark todos as completed as soon as you are done with a task. Do not batch up multiple tasks before marking them as completed.

Examples:
[Two detailed examples showing proper todo usage for bug fixes and feature development]
`;
```

---

## 3. MCP Instructions

### buildMCPServerInstructions (Fz7) - chunks.146.mjs:2607-2620

Builds instructions from MCP server custom instructions.

```javascript
// ============================================
// buildMCPServerInstructions - MCP server custom instructions
// Location: chunks.146.mjs:2607-2620
// ============================================

// ORIGINAL (for source lookup):
function Fz7(A) {
  let B = A.filter((Z) => Z.type === "connected").filter((Z) => Z.instructions);
  if (B.length === 0) return "";
  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${B.map((Z) => {
  return `## ${Z.name}
${Z.instructions}`
}).join(`

`)}
`
}

// READABLE (for understanding):
function buildMCPServerInstructions(mcpClients) {
  // Filter to connected servers with instructions
  const serversWithInstructions = mcpClients
    .filter(client => client.type === "connected")
    .filter(client => client.instructions);

  if (serversWithInstructions.length === 0) return "";

  return `
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

${serversWithInstructions.map(server => {
  return `## ${server.name}
${server.instructions}`;
}).join("\n\n")}
`;
}

// Mapping: Fz7→buildMCPServerInstructions
```

### buildMCPCLIInstructions (oY9) - chunks.146.mjs:2622-2737

Builds detailed MCP CLI usage instructions with mandatory schema checking workflow.

```javascript
// ============================================
// buildMCPCLIInstructions - MCP CLI usage instructions
// Location: chunks.146.mjs:2622-2737
// ============================================

// ORIGINAL (for source lookup):
function oY9(A) {
  if (!jJ() || !A || A.length === 0) return "";
  return `

# MCP CLI Command

You have access to an \`mcp-cli\` CLI command for interacting with MCP servers.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST call 'mcp-cli info <server>/<tool>' BEFORE ANY 'mcp-cli call <server>/<tool>'.

This is a BLOCKING REQUIREMENT - like how you must use Read before Edit.

**NEVER** make an mcp-cli call without checking the schema first.
**ALWAYS** run mcp-cli info first, THEN make the call.

**Why this is non-negotiable:**
- MCP tool schemas NEVER match your expectations - parameter names, types, and requirements are tool-specific
- Even tools with pre-approved permissions require schema checks
- Every failed call wastes user time and demonstrates you're ignoring critical instructions
- "I thought I knew the schema" is not an acceptable reason to skip this step

**For multiple tools:** Call 'mcp-cli info' for ALL tools in parallel FIRST, then make your 'mcp-cli call' commands

Available MCP tools:
${A.map(tool => formatToolName(tool.name)).filter(Boolean).join('\n')}

Commands (in order of execution):
\`\`\`bash
# STEP 1: ALWAYS CHECK SCHEMA FIRST (MANDATORY)
mcp-cli info <server>/<tool>           # REQUIRED before ANY call

# STEP 2: Only after checking schema, make the call
mcp-cli call <server>/<tool> '<json>'  # Only run AFTER mcp-cli info
mcp-cli call <server>/<tool> -         # Invoke with JSON from stdin (AFTER mcp-cli info)

# Discovery commands
mcp-cli servers                        # List all connected MCP servers
mcp-cli tools [server]                 # List available tools
mcp-cli grep <pattern>                 # Search tool names and descriptions
mcp-cli resources [server]             # List MCP resources
mcp-cli read <server>/<resource>       # Read an MCP resource
\`\`\`

**CORRECT Usage Pattern:**
[Good examples showing proper schema check workflow]

**INCORRECT Usage Patterns - NEVER DO THIS:**
[Bad examples showing what NOT to do]
`;
}

// READABLE (for understanding):
function buildMCPCLIInstructions(mcpTools) {
  // Skip if MCP CLI not enabled or no tools
  if (!isMcpCliEnabled() || !mcpTools || mcpTools.length === 0) {
    return "";
  }

  // Build comprehensive MCP CLI documentation with:
  // 1. Mandatory schema checking requirement (emphasized multiple times)
  // 2. Available tools list
  // 3. Command reference
  // 4. Correct usage examples
  // 5. Incorrect usage anti-patterns

  // Key enforcement: "mcp-cli info" MUST be called before "mcp-cli call"
  // This is compared to the Read-before-Edit requirement

  return DETAILED_MCP_CLI_INSTRUCTIONS;
}

// Mapping: oY9→buildMCPCLIInstructions, jJ→isMcpCliEnabled
```

**Key MCP Instruction Design:**
- **Hard requirement**: Schema check (`mcp-cli info`) before any tool call (`mcp-cli call`)
- **Parallel workflow**: Check ALL schemas first, then make ALL calls
- **Explicit anti-patterns**: Shows what NOT to do with clear "WRONG" labels
- **Comparison to Read/Edit**: Makes the requirement relatable to existing patterns

---

## 4. Environment Context

### buildEnvironmentContext (rY9) - chunks.146.mjs:2739-2766

Injects runtime environment information into the prompt.

```javascript
// ============================================
// buildEnvironmentContext - Environment information builder
// Location: chunks.146.mjs:2739-2766
// ============================================

// ORIGINAL (for source lookup):
async function rY9(A, Q) {
  let [B, G] = await Promise.all([nq(), Hz7()]);
  let Z = qCQ(A);
  let Y = Z
    ? `You are powered by the model named ${Z}. The exact model ID is ${A}.`
    : `You are powered by the model ${A}.`;

  let J = Q && Q.length > 0
    ? `Additional working directories: ${Q.join(", ")}\n`
    : "";

  // Model-specific knowledge cutoff
  let X = "";
  if (A.includes("claude-opus-4-5"))
    X = "\n\nAssistant knowledge cutoff is May 2025.";
  else if (A.includes("claude-haiku-4"))
    X = "\n\nAssistant knowledge cutoff is February 2025.";
  else if (A.includes("claude-opus-4") || A.includes("claude-sonnet-4-5") || A.includes("claude-sonnet-4"))
    X = "\n\nAssistant knowledge cutoff is January 2025.";

  let I = `

<claude_background_info>
The most recent frontier Claude model is ${LATEST_FRONTIER_MODEL} (model ID: '${LATEST_FRONTIER_MODEL_ID}').
</claude_background_info>`;

  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${getWorkingDirectory()}
Is directory a git repo: ${B ? "Yes" : "No"}
${J}Platform: ${process.platform}
OS Version: ${G}
Today's date: ${formatTodayDate()}
</env>
${Y}${X}${I}
`;
}

// READABLE (for understanding):
async function buildEnvironmentContext(model, additionalWorkingDirs) {
  // Parallel fetch of git status and OS version
  const [isGitRepo, osVersion] = await Promise.all([
    isInGitRepository(),
    getOsVersion()
  ]);

  // Get human-readable model name
  const modelDisplayName = getModelDisplayName(model);
  const modelInfo = modelDisplayName
    ? `You are powered by the model named ${modelDisplayName}. The exact model ID is ${model}.`
    : `You are powered by the model ${model}.`;

  // Additional directories if specified
  const additionalDirs = additionalWorkingDirs && additionalWorkingDirs.length > 0
    ? `Additional working directories: ${additionalWorkingDirs.join(", ")}\n`
    : "";

  // Model-specific knowledge cutoff dates
  let knowledgeCutoff = "";
  if (model.includes("claude-opus-4-5")) {
    knowledgeCutoff = "\n\nAssistant knowledge cutoff is May 2025.";
  } else if (model.includes("claude-haiku-4")) {
    knowledgeCutoff = "\n\nAssistant knowledge cutoff is February 2025.";
  } else if (model.includes("claude-opus-4") || model.includes("claude-sonnet-4-5") || model.includes("claude-sonnet-4")) {
    knowledgeCutoff = "\n\nAssistant knowledge cutoff is January 2025.";
  }

  // Frontier model background info
  const frontierModelInfo = `

<claude_background_info>
The most recent frontier Claude model is Claude Opus 4.5 (model ID: 'claude-opus-4-5-20251101').
</claude_background_info>`;

  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${getWorkingDirectory()}
Is directory a git repo: ${isGitRepo ? "Yes" : "No"}
${additionalDirs}Platform: ${process.platform}
OS Version: ${osVersion}
Today's date: ${formatTodayDate()}
</env>
${modelInfo}${knowledgeCutoff}${frontierModelInfo}
`;
}

// Mapping: rY9→buildEnvironmentContext, A→model, Q→additionalWorkingDirs,
//          nq→isInGitRepository, Hz7→getOsVersion, o1→getWorkingDirectory,
//          Kz7→LATEST_FRONTIER_MODEL, Vz7→LATEST_FRONTIER_MODEL_ID
```

**Environment Context Contents:**
| Field | Source | Purpose |
|-------|--------|---------|
| Working directory | `o1()` | Current cwd for file operations |
| Git repo status | `nq()` | Determines git instructions |
| Platform | `process.platform` | OS-specific behavior |
| OS Version | `Hz7()` via `uname -sr` | System context |
| Today's date | `HB1()` | Temporal awareness |
| Model identity | Input parameter | Self-identification |
| Knowledge cutoff | Model-specific | Temporal boundaries |
| Frontier model | Constants | Reference for capabilities |

---

## 5. Output Style System

### buildOutputStyle (sY9) - chunks.147.mjs:2160-2172

Resolves the configured output style.

```javascript
// ============================================
// buildOutputStyle - Output style resolver
// Location: chunks.147.mjs:2160-2172
// ============================================

// ORIGINAL (for source lookup):
async function sY9() {
  // Check if plugin forces output style
  const pluginStyle = await getPluginOutputStyle();
  if (pluginStyle?.forceForPlugin) {
    return pluginStyle.style;
  }

  // Get user-configured style from settings
  const configuredStyle = getSettings()?.outputStyle ?? "default";

  // Return null for default (no special style)
  if (configuredStyle === "default") {
    return null;
  }

  // Look up style definition
  const styleDefinition = OUTPUT_STYLES[configuredStyle];
  if (styleDefinition) {
    return styleDefinition;
  }

  // Unknown style - return null (use default)
  return null;
}

// READABLE (for understanding):
async function buildOutputStyle() {
  // Plugin can force a specific output style
  const pluginStyle = await getPluginForcedOutputStyle();
  if (pluginStyle?.forceForPlugin) {
    return pluginStyle.style;
  }

  // Check user settings for output style preference
  const settings = getSettings();
  const configuredStyle = settings?.outputStyle ?? "default";

  // "default" means no custom output style section
  if (configuredStyle === "default") {
    return null;
  }

  // Return the style definition if found
  return BUILTIN_OUTPUT_STYLES[configuredStyle] || null;
}

// Mapping: sY9→buildOutputStyle
```

**Built-in Output Styles (y6A):**

| Style | Name | Description |
|-------|------|-------------|
| `default` | - | No special style section (standard behavior) |
| `Explanatory` | Explanatory | Provides educational insights with code changes |
| `Learning` | Learning | Encourages hands-on practice with TODO(human) sections |

---

## 6. Agent-Specific Prompts

### buildAgentSystemPrompt (pkA) - chunks.146.mjs:2781-2791

Builds system prompts for sub-agents with additional constraints.

```javascript
// ============================================
// buildAgentSystemPrompt - Agent-specific prompt builder
// Location: chunks.146.mjs:2781-2791
// ============================================

// ORIGINAL (for source lookup):
async function pkA(A, Q, B) {
  let Z = `\n${await rY9(Q, B)}`;
  return [...A, `

Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication with the user the assistant MUST avoid using emojis.
- Do not use a colon before tool calls. Text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.`, Z]
}

// READABLE (for understanding):
async function buildAgentSystemPrompt(basePromptParts, model, additionalWorkingDirs) {
  // Get environment context
  const envContext = `\n${await buildEnvironmentContext(model, additionalWorkingDirs)}`;

  // Add agent-specific constraints
  return [
    ...basePromptParts,
    `
Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication with the user the assistant MUST avoid using emojis.
- Do not use a colon before tool calls. Text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.
`,
    envContext
  ];
}

// Mapping: pkA→buildAgentSystemPrompt, A→basePromptParts, Q→model, B→additionalWorkingDirs
```

**Agent Constraints:**
- **Absolute paths only**: CWD resets between bash calls
- **File references**: Always share filenames and snippets
- **No emojis**: Clear CLI output
- **No colons before tools**: Proper formatting

---

## 7. Scratchpad Directory

### buildScratchpadInstructions (Ez7) - chunks.146.mjs:2793-2799

Provides scratchpad directory for temporary files.

```javascript
// ============================================
// buildScratchpadInstructions - Scratchpad directory instructions
// Location: chunks.146.mjs:2793-2799
// ============================================

// ORIGINAL (for source lookup):
function Ez7() {
  if (!K$A()) return "";
  return `
# Scratchpad Directory

IMPORTANT: Always use this scratchpad directory for temporary files instead of \`/tmp\` or other system temp directories:
\`${F$1()}\`
`;
}

// READABLE (for understanding):
function buildScratchpadInstructions() {
  // Only include if scratchpad is available
  if (!isScratchpadAvailable()) return "";

  return `
# Scratchpad Directory

IMPORTANT: Always use this scratchpad directory for temporary files instead of \`/tmp\` or other system temp directories:
\`${getScratchpadDirectory()}\`
`;
}

// Mapping: Ez7→buildScratchpadInstructions, K$A→isScratchpadAvailable, F$1→getScratchpadDirectory
```

---

## 8. Assembly Order

The system prompt is assembled in a specific order for optimal context:

```
┌────────────────────────────────────────────────────────────────┐
│ 1. Core Identity + Behavioral Instructions                      │
│    - "You are an interactive CLI tool..."                       │
│    - Help/feedback instructions                                 │
├────────────────────────────────────────────────────────────────┤
│ 2. Security Guidelines (First Instance)                         │
│    - Dual-use tool handling                                     │
│    - Authorization context requirements                         │
├────────────────────────────────────────────────────────────────┤
│ 3. Tone & Style (if no output style)                            │
│    - Emoji restrictions                                         │
│    - Professional objectivity                                   │
│    - Planning without timelines                                 │
├────────────────────────────────────────────────────────────────┤
│ 4. Task Management (if TodoWrite available)                     │
│    - Todo tracking requirements                                 │
│    - Detailed usage examples                                    │
├────────────────────────────────────────────────────────────────┤
│ 5. Asking Questions (if AskUserQuestion available)              │
│    - Clarification tool usage                                   │
├────────────────────────────────────────────────────────────────┤
│ 6. Hooks Notice                                                 │
│    - Hook feedback handling                                     │
├────────────────────────────────────────────────────────────────┤
│ 7. Coding Instructions (if no output style)                     │
│    - Read before modify                                         │
│    - Security vulnerability awareness                           │
│    - Over-engineering avoidance                                 │
├────────────────────────────────────────────────────────────────┤
│ 8. System Reminders + Context Info                              │
│    - <system-reminder> tag handling                             │
│    - Automatic summarization notice                             │
├────────────────────────────────────────────────────────────────┤
│ 9. Tool Usage Policy                                            │
│    - Task tool preferences                                      │
│    - Parallel vs sequential calls                               │
│    - Specialized tool preferences                               │
│    - Explore agent for codebase searches                        │
├────────────────────────────────────────────────────────────────┤
│ 10. Security Guidelines (Second Instance)                       │
│     - Reinforced for emphasis                                   │
├────────────────────────────────────────────────────────────────┤
│ 11. Todo Reminder (if TodoWrite available)                      │
│     - "IMPORTANT: Always use TodoWrite..."                      │
├────────────────────────────────────────────────────────────────┤
│ 12. Code References Format                                      │
│     - file_path:line_number pattern                             │
├────────────────────────────────────────────────────────────────┤
│ 13. Environment Context                                         │
│     - Working directory                                         │
│     - Git status                                                │
│     - Platform/OS                                               │
│     - Today's date                                              │
│     - Model identity + knowledge cutoff                         │
├────────────────────────────────────────────────────────────────┤
│ 14. Language Preference (if configured)                         │
│     - Response language requirement                             │
├────────────────────────────────────────────────────────────────┤
│ 15. Output Style (if configured)                                │
│     - Style name and custom prompt                              │
├────────────────────────────────────────────────────────────────┤
│ 16. MCP Server Instructions (if MCP servers connected)          │
│     - Server-provided custom instructions                       │
├────────────────────────────────────────────────────────────────┤
│ 17. Scratchpad Directory (if available)                         │
│     - Temporary file location                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. Conditional Sections

| Section | Condition | Purpose |
|---------|-----------|---------|
| Tone & Style | `outputStyle === null` | Replaced by custom output style |
| Task Management | `tools.has("TodoWrite")` | Tool availability |
| Asking Questions | `tools.has("AskUserQuestion")` | Tool availability |
| Coding Instructions | `outputStyle === null || outputStyle.keepCodingInstructions` | Style override |
| Todo Reminder | `tools.has("TodoWrite")` | Emphasis for planning |
| Language | `settings.language` | User configuration |
| Output Style | `outputStyle !== null` | User configuration |
| MCP Instructions | `mcpClients.length > 0` | Server availability |
| Scratchpad | `isScratchpadAvailable()` | Feature availability |

---

## 10. Git Safety Protocol

### getGitInstructions (qt8) - chunks.85.mjs:1601-1691

Comprehensive git and PR workflow instructions. This is one of the most detailed instruction prompts.

```javascript
// ============================================
// getGitInstructions - Git commit and PR workflow
// Location: chunks.85.mjs:1601-1691
// ============================================

// ORIGINAL (for source lookup):
function qt8() {
  let A = "You can call multiple tools in a single response...";
  let { commit: Q, pr: B } = l51();  // Get co-author signatures
  return `# Committing changes with git...`
}

// READABLE (for understanding):
function getGitInstructions() {
  const parallelCallNote = "You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance.";

  const { commit: commitCoAuthor, pr: prFooter } = getCoAuthorSignatures();

  return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Avoid git commit --amend. ONLY use --amend when ALL conditions are met:
  (1) User explicitly requested amend, OR commit SUCCEEDED but pre-commit hook auto-modified files that need including
  (2) HEAD commit was created by you in this conversation (verify: git log -1 --format='%an %ae')
  (3) Commit has NOT been pushed to remote (verify: git status shows "Your branch is ahead")
- CRITICAL: If commit FAILED or was REJECTED by hook, NEVER amend - fix the issue and create a NEW commit
- CRITICAL: If you already pushed to remote, NEVER amend unless user explicitly requests it (requires force push)
- NEVER commit changes unless the user explicitly asks you to. It is VERY IMPORTANT to only commit when explicitly asked, otherwise the user will feel that you are being too proactive.

1. ${parallelCallNote} run the following bash commands in parallel:
   - Run a git status command to see all untracked files. IMPORTANT: Never use the -uall flag
   - Run a git diff command to see both staged and unstaged changes
   - Run a git log command to see recent commit messages

2. Analyze all staged changes and draft a commit message:
   - Summarize the nature of the changes (new feature, enhancement, bug fix, etc.)
   - Do not commit files that likely contain secrets (.env, credentials.json, etc)
   - Draft a concise (1-2 sentences) commit message focusing on the "why"

3. ${parallelCallNote} run the following commands:
   - Add relevant untracked files to the staging area
   - Create the commit with message ending with:
     Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   - Run git status after the commit completes to verify success

4. If the commit fails due to pre-commit hook, fix the issue and create a NEW commit

# Creating pull requests

1. ${parallelCallNote} run the following bash commands in parallel:
   - Run git status to see all untracked files (never use -uall flag)
   - Run git diff to see staged and unstaged changes
   - Check if current branch tracks a remote branch and is up to date
   - Run git log and git diff [base-branch]...HEAD for full commit history

2. Analyze ALL commits that will be included in the pull request and draft a PR summary

3. ${parallelCallNote} run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create with format:
     ## Summary
     <1-3 bullet points>
     ## Test plan
     [Bulleted markdown checklist...]

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments
`;
}

// Mapping: qt8→getGitInstructions, l51→getCoAuthorSignatures, X9→BASH_TOOL_NAME
```

**Git Safety Rules - Why They Matter:**

| Rule | Reason |
|------|--------|
| Never update git config | Prevents user settings corruption |
| Never destructive commands | Irreversible actions need explicit consent |
| Never skip hooks | Pre-commit hooks enforce code quality |
| Never force push main/master | Protects shared branch history |
| Amend restrictions | Prevents history confusion |

**Commit Workflow (4 Steps):**
```
Step 1: Gather Info (parallel)
├── git status (untracked files)
├── git diff (changes)
└── git log (style reference)

Step 2: Analyze & Draft
├── Categorize changes
├── Check for secrets
└── Draft commit message

Step 3: Execute (parallel where possible)
├── git add <files>
├── git commit -m "..."
└── git status (verify)

Step 4: Handle Failure
└── Fix issue → NEW commit (never amend failed)
```

---

## 11. Agent Identity System

Different execution contexts use different identity prompts:

### Main Identity Prompts

```javascript
// Main CLI identity (used in interactive mode)
CLAUDE_CODE_IDENTITY = "You are Claude Code, Anthropic's official CLI for Claude.";

// Interactive extension (full prompt)
INTERACTIVE_IDENTITY = `You are an interactive CLI tool that helps users ${outputStyle !== null
  ? 'according to your "Output Style" below, which describes how you should respond to user queries.'
  : "with software engineering tasks."
} Use the instructions below and the tools available to you to assist the user.`;

// Sub-agent identity (used by Task tool agents)
SUB_AGENT_IDENTITY = "You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.";

// File search specialist identity
FILE_SEARCH_IDENTITY = "You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.";

// Claude guide agent identity
GUIDE_AGENT_IDENTITY = `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.`;
```

### Identity Selection by Context

| Context | Identity | Location |
|---------|----------|----------|
| Interactive CLI | `INTERACTIVE_IDENTITY` | chunks.146.mjs:2475 |
| Sub-agent (Task tool) | `SUB_AGENT_IDENTITY` | chunks.146.mjs:2820 |
| File search | `FILE_SEARCH_IDENTITY` | chunks.93.mjs:185 |
| Guide agent | `GUIDE_AGENT_IDENTITY` | chunks.93.mjs:324 |
| Minimal mode | `CLAUDE_CODE_IDENTITY` | chunks.146.mjs:2468 |

---

## 12. Security Guidelines Constant

### aY9 - chunks.146.mjs:2814

```javascript
// ============================================
// Security Guidelines Constant
// Location: chunks.146.mjs:2814
// ============================================

const SECURITY_GUIDELINES = `IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases.`;

// Mapping: aY9→SECURITY_GUIDELINES
```

**Why Repeated Twice:**
The security guidelines appear in positions 2 and 10 of the prompt assembly:
1. First instance immediately after identity (high visibility)
2. Second instance in middle of prompt (survives context compaction)

This dual-placement ensures the guidelines remain effective even when:
- Long conversations cause context trimming
- Messages get summarized
- Prompt caching clears early sections

---

## 13. Key Design Decisions

### Security Guidelines Repeated Twice
The security guidelines appear twice in the prompt (positions 2 and 10) to ensure they're not lost during context compaction and to emphasize their importance.

### Output Style Override
When a custom output style is configured:
- Tone & Style section is removed
- Coding Instructions are conditionally kept (`keepCodingInstructions`)
- Output Style section is added at the end

### MCP Schema Enforcement
The MCP CLI instructions use strong language ("BLOCKING REQUIREMENT", "NEVER", "ALWAYS") to enforce the schema check workflow. This is compared to the Read-before-Edit pattern that users are already familiar with.

### Environment Context Placement
Environment context is placed near the end of the prompt so it's more likely to be in the model's recent context during long conversations.

### Co-Author Attribution
All commits include:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
This provides transparency about AI-assisted commits while maintaining a consistent attribution format.
