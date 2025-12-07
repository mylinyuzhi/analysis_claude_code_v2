# Prompt Building in Claude Code v2.0.59

This document analyzes how system prompts are constructed and assembled in Claude Code v2.0.59.

## Related Symbols

> Complete symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key functions in this document:
- `buildCompleteSystemPrompt` (Tn) - Main system prompt assembly function
- `getSessionTypeIdentity` (rnA) - Select identity based on context
- `getEnvironmentContext` (CE9) - Add environment information to prompt
- `getAgentSpecificContext` (GSA) - Add agent-specific instructions
- `getMCPToolsPrompt` (HE9) - Generate MCP CLI usage instructions
- `getMCPServerInstructions` (bv3) - Add MCP server custom instructions
- `getGitInstructions` (cU6) - Comprehensive git workflow instructions

## Overview

Claude Code uses a modular approach to construct system prompts, combining multiple components based on the context, available tools, configuration, and user settings. The main prompt construction happens in the `buildCompleteSystemPrompt` (Tn) function located in `chunks.152.mjs`.

## Core Prompt Construction Flow

### 1. Main System Prompt Assembly Function: `buildCompleteSystemPrompt`

```javascript
// ============================================
// buildCompleteSystemPrompt - Main entry point for system prompt construction
// Location: chunks.152.mjs:2307-2448
// ============================================

// ORIGINAL (for source lookup):
async function Tn(A, Q, B, G, Z) {
  // A = available tools, Q = model, B = additionalDirs, G = mcpClients, Z = permissions
  // ... complex prompt assembly logic
}

// READABLE (for understanding):
async function buildCompleteSystemPrompt(
  availableTools,      // A: Set of tool names available for this session
  modelName,           // Q: Current model (e.g., "claude-sonnet-4-5")
  additionalDirs,      // B: Additional working directories
  mcpClients,          // G: Connected MCP server clients
  permissionSettings   // Z: Permission configuration object
) {
  // 1. Fetch supporting context
  let [slashCommands, outputStyle, envContext] = await Promise.all([
    getSlashCommands(),
    getOutputStyleConfig(),
    getEnvironmentContext(modelName, additionalDirs)
  ]);

  // 2. Determine available tools Set
  let toolSet = new Set(availableTools.map(t => t.name));

  // 3. Build prompt array (order matters!)
  return [
    // Core identity and behavior instructions
    buildBaseIdentityPrompt(outputStyle),

    // Tool-specific policies
    buildToolUsagePolicy(toolSet),

    // Git workflow instructions (if Bash available)
    toolSet.has("Bash") ? getGitInstructions() : "",

    // Security guidelines
    SECURITY_GUIDELINES,  // DE9

    // Task management (if TodoWrite available)
    toolSet.has("TodoWrite") ? TASK_MANAGEMENT_PROMPT : "",

    // MCP integration (if servers connected)
    ...(mcpClients?.length > 0 ? [getMCPServerInstructions(mcpClients)] : []),

    // Environment context (working dir, platform, date, model)
    envContext
  ];
}

// Mapping: Tn→buildCompleteSystemPrompt, A→availableTools, Q→modelName,
//          B→additionalDirs, G→mcpClients, Z→permissionSettings
```

**Prompt Assembly Order** (critical for behavior):

| Order | Component | Condition | Source |
|-------|-----------|-----------|--------|
| 1 | Base Identity | Always | Inline template |
| 2 | Tool Usage Policy | Always | `buildToolUsagePolicy()` |
| 3 | Git/PR Instructions | If Bash available | `cU6()` |
| 4 | Security Guidelines | Always | `DE9` constant |
| 5 | Task Management | If TodoWrite available | `TASK_MANAGEMENT_PROMPT` |
| 6 | MCP Instructions | If MCP servers connected | `bv3()`, `HE9()` |
| 7 | Environment Context | Always | `CE9()` |
| 8 | Output Style | If user configured | Inline template |

**Why this order matters:**
- Core identity establishes the persona and base behavior
- Tool policies come early to guide tool selection decisions
- Git instructions are prominent because commits/PRs are common operations
- Security guidelines prevent dangerous actions
- Task management helps organize complex work
- MCP extends capabilities when available
- Environment context provides grounding in current state

### 2. Identity Prompts

```javascript
// ============================================
// getSessionTypeIdentity - Select identity based on execution context
// Location: chunks.60.mjs:465-472
// ============================================

// ORIGINAL (for source lookup):
function rnA(A) {
  if (V6() === "vertex") return hCB;
  if (A?.isNonInteractive) {
    if (A.hasAppendSystemPrompt) return sY6;
    return rY6
  }
  return hCB
}

// Identity constants (chunks.60.mjs:478-482):
// hCB = "You are Claude Code, Anthropic's official CLI for Claude."
// sY6 = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// rY6 = "You are a Claude agent, built on Anthropic's Claude Agent SDK."

// READABLE (for understanding):
function getSessionTypeIdentity(options) {
  // Vertex AI: Always use standard identity (compatibility)
  if (getProvider() === "vertex") {
    return CLAUDE_CODE_IDENTITY;  // hCB
  }

  // Non-interactive mode (SDK or programmatic usage)
  if (options?.isNonInteractive) {
    // Has custom system prompt appended? Use SDK identity
    if (options.hasAppendSystemPrompt) {
      return CLAUDE_CODE_SDK_IDENTITY;  // sY6
    }
    // Pure agent mode - no CLI branding
    return CLAUDE_AGENT_IDENTITY;  // rY6
  }

  // Default: Interactive CLI mode
  return CLAUDE_CODE_IDENTITY;  // hCB
}

// Mapping: rnA→getSessionTypeIdentity, V6→getProvider, hCB→CLAUDE_CODE_IDENTITY,
//          sY6→CLAUDE_CODE_SDK_IDENTITY, rY6→CLAUDE_AGENT_IDENTITY
```

**Identity Selection Decision Tree:**

```
┌─────────────────────────────────────┐
│ getSessionTypeIdentity(options)     │
└─────────────────────────────────────┘
                  ↓
    ┌─────────────────────────────┐
    │ Provider === "vertex"?       │
    └─────────────────────────────┘
           ↓ Yes            ↓ No
    ┌─────────────┐         │
    │ CLAUDE_CODE │         │
    │ _IDENTITY   │         │
    └─────────────┘         ↓
                  ┌─────────────────────────────┐
                  │ options.isNonInteractive?   │
                  └─────────────────────────────┘
                       ↓ Yes            ↓ No
              ┌─────────────────┐    ┌─────────────┐
              │ hasAppendSystem │    │ CLAUDE_CODE │
              │ Prompt?         │    │ _IDENTITY   │
              └─────────────────┘    └─────────────┘
               ↓ Yes      ↓ No
        ┌────────────┐ ┌────────────┐
        │ CLAUDE_CODE│ │ CLAUDE_    │
        │ _SDK_      │ │ AGENT_     │
        │ IDENTITY   │ │ IDENTITY   │
        └────────────┘ └────────────┘
```

**Why three different identities:**
1. **CLAUDE_CODE_IDENTITY**: Standard CLI branding for interactive users
2. **CLAUDE_CODE_SDK_IDENTITY**: Acknowledges SDK context when user adds custom prompts
3. **CLAUDE_AGENT_IDENTITY**: Pure agent mode - removes CLI branding for programmatic use

**Why Vertex AI always uses standard identity:**
Google Vertex AI has specific model behavior expectations. Using a consistent identity ensures predictable behavior across providers.

### 3. Environment Context: `CE9` Function

**Location**: `chunks.152.mjs` lines 2582-2601

Adds environment information to the prompt:

```javascript
async function CE9(A, Q) {
  // Returns formatted environment info including:
  // - Working directory
  // - Git repo status
  // - Additional working directories
  // - Platform and OS version
  // - Current date
  // - Model information
  // - Claude background info
}
```

Output format:
```
Here is useful information about the environment you are running in:
<env>
Working directory: /path/to/dir
Is directory a git repo: Yes/No
Platform: darwin/linux/win32
OS Version: ...
Today's date: YYYY-MM-DD
</env>
You are powered by the model named ...
```

### 4. Agent-Specific Context: `GSA` Function

**Location**: `chunks.152.mjs` lines 2616-2625

Adds agent-specific instructions when running as a sub-agent:

```javascript
async function GSA(A, Q, B) {
  // Returns additional notes for agent execution:
  // - Use absolute file paths (cwd resets between bash calls)
  // - Return absolute paths in responses
  // - Avoid emojis
}
```

### 5. MCP Tool Instructions (Extracted from Source)

**Location**: `chunks.152.mjs:2465-2580`

When MCP (Model Context Protocol) servers are configured, this generates comprehensive instructions for using `mcp-cli`. This is one of the most detailed instruction prompts in Claude Code.

```javascript
// ============================================
// getMCPToolsPrompt - Generate MCP CLI usage instructions
// Location: chunks.152.mjs:2465-2580
// Original function: HE9(A)
// Parameter: A = mcpTools array
// ============================================
function getMCPToolsPrompt(mcpTools) {
  // If MCP is not enabled or no tools available, return empty
  if (!isMCPEnabled() || !mcpTools || mcpTools.length === 0) {
    return "";
  }

  // Build list of available MCP tools
  let availableToolsList = mcpTools
    .map(tool => {
      let formattedName = formatMCPToolName(tool.name);
      return formattedName ? `- ${formattedName}` : null;
    })
    .filter(Boolean)
    .join('\n');

  // Return comprehensive MCP CLI instructions
  return `

# MCP CLI Command

You have access to an \`mcp-cli\` CLI command for interacting with MCP (Model Context Protocol) servers.

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
(Remember: Call 'mcp-cli info <server>/<tool>' before using any of these)
${availableToolsList}

Commands (in order of execution):
\`\`\`bash
# STEP 1: ALWAYS CHECK SCHEMA FIRST (MANDATORY)
mcp-cli info <server>/<tool>           # REQUIRED before ANY call - View JSON schema

# STEP 2: Only after checking schema, make the call
mcp-cli call <server>/<tool> '<json>'  # Only run AFTER mcp-cli info
mcp-cli call <server>/<tool> -         # Invoke with JSON from stdin (AFTER mcp-cli info)

# Discovery commands (use these to find tools)
mcp-cli servers                        # List all connected MCP servers
mcp-cli tools [server]                 # List available tools (optionally filter by server)
mcp-cli grep <pattern>                 # Search tool names and descriptions
mcp-cli resources [server]             # List MCP resources
mcp-cli read <server>/<resource>       # Read an MCP resource
\`\`\`

**CORRECT Usage Pattern:**

<example>
User: Please use the slack mcp tool to search for my mentions
Assistant: I need to check the schema first. Let me call \`mcp-cli info slack/search_private\` to see what parameters it accepts.
[Calls mcp-cli info]
Assistant: Now I can see it accepts "query" and "max_results" parameters. Let me make the call.
[Calls mcp-cli call slack/search_private with correct schema]
</example>

<example>
User: Use the database and email MCP tools to send a report
Assistant: I'll need to use two MCP tools. Let me check both schemas first.
[Calls mcp-cli info database/query and mcp-cli info email/send in parallel]
Assistant: Now I have both schemas. Let me execute the calls.
[Makes both mcp-cli call commands with correct parameters]
</example>

**INCORRECT Usage Patterns - NEVER DO THIS:**

<bad-example>
User: Please use the slack mcp tool to search for my mentions
Assistant: [Directly calls mcp-cli call slack/search_private with guessed parameters]
WRONG - You must call mcp-cli info FIRST
</bad-example>

<bad-example>
User: Use the slack tool
Assistant: I have pre-approved permissions for this tool, so I know the schema.
[Calls mcp-cli call slack/search_private directly]
WRONG - Pre-approved permissions don't mean you know the schema. ALWAYS call mcp-cli info first.
</bad-example>

<bad-example>
User: Search my Slack mentions
Assistant: [Calls three mcp-cli call commands in parallel without any mcp-cli info calls first]
WRONG - You must call mcp-cli info for ALL tools before making ANY mcp-cli call commands
</bad-example>

Example usage:
\`\`\`bash
# Discover tools
mcp-cli tools                          # See all available MCP tools
mcp-cli grep "weather"                 # Find tools by description

# Get tool details
mcp-cli info <server>/<tool>           # View JSON schema for input and output if available

# Simple tool call (no parameters)
mcp-cli call weather/get_location '{}'

# Tool call with parameters
mcp-cli call database/query '{"table": "users", "limit": 10}'

# Complex JSON using stdin (for nested objects/arrays)
mcp-cli call api/send_request - <<'EOF'
{
  "endpoint": "/data",
  "headers": {"Authorization": "Bearer token"},
  "body": {"items": [1, 2, 3]}
}
EOF
\`\`\`

Use this command via Bash when you need to discover, inspect, or invoke MCP tools.

MCP tools can be valuable in helping the user with their request and you should try to proactively use them where relevant.
`;
}
```

**Key Enforcement Mechanisms**:
1. **MANDATORY prerequisite**: Must call `mcp-cli info` before `mcp-cli call`
2. **Multiple examples**: Shows both correct and incorrect usage patterns
3. **Hard requirement language**: "BLOCKING REQUIREMENT", "NEVER", "ALWAYS"
4. **Analogies**: Compares to "Read before Edit" requirement
5. **Anti-patterns**: Explicitly shows what NOT to do with `<bad-example>` tags
6. **Parallel workflow**: Instructs to check ALL schemas first, then make ALL calls

### 6. MCP Server Instructions: `bv3` Function

**Location**: `chunks.152.mjs` lines 2450-2463

Adds custom instructions provided by MCP servers:

```javascript
function bv3(A) {
  // Filters connected MCP servers that have instructions
  // Returns formatted section with server-specific guidance
}
```

### 7. Git and PR Instructions: `cU6` Function

**Location**: `chunks.71.mjs` lines 787-875

Comprehensive git workflow instructions including:

**Git Safety Protocol**:
- NEVER update git config
- NEVER run destructive commands (push --force, hard reset)
- NEVER skip hooks
- NEVER force push to main/master
- Only commit when explicitly requested
- Only amend in specific circumstances

**Commit Workflow** (4 steps):
1. Run git status, diff, and log in parallel
2. Analyze changes and draft commit message
3. Stage files and create commit
4. Handle pre-commit hook failures

**PR Workflow** (3 steps):
1. Run git commands to understand branch state
2. Analyze all commits and draft PR summary
3. Create branch if needed, push, and create PR

## Prompt Components by Category

### A. Core Instructions (Always Included)

1. **Base Identity** - From `rnA()` function
2. **Security Guidelines** - `DE9` constant (security testing authorization context)
3. **Environment Context** - From `CE9()` function
4. **Professional Objectivity** - Technical accuracy over validation
5. **Code References** - Use `file_path:line_number` pattern

### B. Conditional Components

1. **Output Style** - Added if user has configured custom output style
2. **Task Management** - TodoWrite tool instructions (if enabled)
3. **Question Asking** - AskUser tool guidance (if enabled)
4. **Agent Tool** - Subagent usage instructions (if enabled)
5. **MCP Instructions** - mcp-cli usage (if MCP servers configured)
6. **Plan Mode** - Read-only restrictions (if in plan mode)

### C. Tool-Specific Instructions

Located in individual tool definition files:

1. **Bash Tool** - `chunks.71.mjs:736-785` (EOB function)
   - Terminal operations vs file operations distinction
   - Proper path quoting
   - Parallel vs sequential command execution
   - Avoid using bash for file operations (use specialized tools)
   - Git commit and PR workflows

2. **TodoWrite Tool** - `chunks.60.mjs:903-1086` (nCB variable)
   - When to use vs not use
   - Extensive examples
   - Task state management
   - Two-form task descriptions (content + activeForm)

3. **WebFetch Tool** - MCP-aware URL fetching
   - Redirect handling instructions

## Prompt Normalization

While not explicitly shown in the extracted code, prompts go through normalization via the `WZ` function (referenced but not fully extracted). This likely handles:
- Whitespace normalization
- Template variable substitution
- Prompt caching markers
- Length optimization

## Key Patterns and Conventions

### 1. Template Literal Construction

All prompts use template literals with variable interpolation:
```javascript
`Some instruction text ${toolName} more text`
```

### 2. Tool Name References

Tools are referenced by their name variables (e.g., `${C9}`, `${d5}`, `${$5}`) which get substituted with actual tool names like "Bash", "Read", "Edit".

### 3. Conditional Sections

Major sections check if tools are available before adding instructions:
```javascript
${W.has(BY.name) ? `# Task Management ...` : ""}
${W.has(A6) ? `# Agent Tool ...` : ""}
```

### 4. Hierarchical Structure

Prompts use markdown headers to organize content:
- `#` for major sections (e.g., "# Tool usage policy")
- `##` for subsections (e.g., "## Git Safety Protocol")
- Lists and examples within sections

### 5. Examples Format

Instructions include `<example>` and `<bad-example>` blocks:
```markdown
<example>
user: ...
assistant: ...
</example>

<bad-example>
...
WRONG - explanation
</bad-example>
```

## Prompt Caching Strategy

Based on the `bCB` function (chunks.60.mjs lines 392-445), Claude Code uses:

1. **clear_tool_uses_20250919** edit type:
   - Triggers when input tokens exceed threshold (default: 180000)
   - Clears at least enough to reach target (default: 40000 below max)
   - Can exclude specific tools (Glob, Grep, Read, Edit, Write, TodoWrite)
   - Can clear tool inputs for certain tools (Bash, AskUser, Agent, etc.)

2. **clear_thinking_20251015** edit type:
   - Preserves thinking blocks (keep: "all")
   - Only active when thinking is present

## Summary

Claude Code's prompt construction is highly modular and context-aware:

1. **Base layer**: Identity + security + environment
2. **Tool layer**: Instructions for each enabled tool
3. **Feature layer**: Task management, agents, MCP integration
4. **Context layer**: Output style, plan mode, working directories
5. **Meta layer**: Caching, normalization, length optimization

The system allows for:
- Dynamic prompt assembly based on available tools
- Context-specific instructions (agent mode, plan mode, etc.)
- Extensibility through MCP server instructions
- User customization via output styles
- Efficient prompt caching to manage token usage
