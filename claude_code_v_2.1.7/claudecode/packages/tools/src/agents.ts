/**
 * @claudecode/tools - Agent Definitions and Loader
 *
 * Reconstructed from chunks.93.mjs and chunks.92.mjs.
 *
 * Key symbols:
 * - ED0 → getBuiltInAgents (chunks.93.mjs:458)
 * - O4A → getPluginAgents (chunks.93.mjs:554)
 * - mb → deduplicateAgents (chunks.93.mjs:602)
 * - _52 → getAllAgents (chunks.93.mjs:809)
 * - w52 → loadAgentFromFile (chunks.93.mjs:499)
 * - N52 → loadAgentsFromDirectory (chunks.93.mjs:475)
 * - DY5 → parseAgentFromJSON (chunks.93.mjs:638)
 * - ur → resolveAgentTools (chunks.92.mjs:3188)
 */

import { z } from 'zod';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, basename } from 'path';
import { homedir } from 'os';
import { parseFrontmatter } from '@claudecode/features';
import { getProjectDir, getSessionId } from '@claudecode/shared';
import { TOOL_NAMES } from './types.js';

// ============================================
// Types
// ============================================

export type BuiltInAgentModel = 'inherit' | 'sonnet' | 'opus' | 'haiku' | undefined;

export interface AgentDefinition {
  agentType: string;
  whenToUse: string;
  tools?: string[];
  disallowedTools?: string[];
  source: 'built-in' | 'plugin' | 'userSettings' | 'projectSettings' | 'policySettings' | 'flagSettings';
  baseDir: string;
  model?: BuiltInAgentModel | string;
  color?: string;
  permissionMode?: 'dontAsk' | 'plan' | 'default' | 'bypassPermissions' | string;
  forkContext?: boolean;
  getSystemPrompt: (context?: any) => string;
  criticalSystemReminder_EXPERIMENTAL?: string;
  skills?: string[];
  callback?: () => void;
  filename?: string;
  plugin?: string;
}

export interface AgentDiscoveryResult {
  activeAgents: AgentDefinition[];
  allAgents: AgentDefinition[];
  failedFiles?: Array<{ path: string; error: string }>;
}

// ============================================
// Schemas
// ============================================

const agentSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  tools: z.array(z.string()).optional(),
  disallowedTools: z.array(z.string()).optional(),
  prompt: z.string().min(1, "Prompt cannot be empty"),
  model: z.enum(['sonnet', 'opus', 'haiku']).optional(),
  permissionMode: z.enum(['dontAsk', 'plan', 'default', 'bypassPermissions']).optional(),
  mcpServers: z.array(z.union([z.string(), z.record(z.string(), z.any())])).optional(),
  hooks: z.any().optional()
});

// ============================================
// Built-in System Prompts
// Original: rZ5, sZ5, tZ5, QY5 in chunks.93.mjs
// ============================================

const BASH_SYSTEM_PROMPT = `You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.`;

const GENERAL_PURPOSE_SYSTEM_PROMPT = `You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

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
- For clear communication, avoid using emojis.`;

const EXPLORE_SYSTEM_PROMPT = `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

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

Complete the user's search request efficiently and report your findings clearly.`;

const PLAN_SYSTEM_PROMPT = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

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

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`;

const STATUSLINE_SYSTEM_PROMPT = `You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

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

4. When using ANSI color codes, be sure to use \`printf\`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

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
     },
     "context_window": {
       "total_input_tokens": number,       // Total input tokens used in session (cumulative)
       "total_output_tokens": number,      // Total output tokens used in session (cumulative)
       "context_window_size": number,      // Context window size for current model (e.g., 200000)
       "current_usage": {                   // Token usage from last API call (null if no messages yet)
         "input_tokens": number,           // Input tokens for current context
         "output_tokens": number,          // Output tokens generated
         "cache_creation_input_tokens": number,  // Tokens written to cache
         "cache_read_input_tokens": number       // Tokens read from cache
       } | null,
       "used_percentage": number | null,      // Pre-calculated: % of context used (0-100), null if no messages yet
       "remaining_percentage": number | null  // Pre-calculated: % of context remaining (0-100), null if no messages yet
     },
     "vim": {                     // Optional, only present when vim mode is enabled
       "mode": "INSERT" | "NORMAL"  // Current vim editor mode
     }
   }
   
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

   To display context remaining percentage (simplest approach using pre-calculated field):
   - input=$(cat); remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty'); [ -n "$remaining" ] && echo "Context: $remaining% remaining"

   Or to display context used percentage:
   - input=$(cat); used=$(echo "$input" | jq -r '.context_window.used_percentage // empty'); [ -n "$used" ] && echo "Context: $used% used"

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
`;

const CLAUDE_CODE_GUIDE_SYSTEM_PROMPT_BASE = `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (https://code.claude.com/docs/en/claude_code_docs_map.md): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (https://platform.claude.com/llms.txt): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (https://platform.claude.com/llms.txt): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use WebFetch to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use WebSearch if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using Read, Glob, and Grep

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`;

function getClaudeCodeGuideSystemPrompt(toolUseContext: any): string {
  const options = toolUseContext?.options || {};
  const customContent: string[] = [];

  // Add custom skills
  const commands = options.commands || [];
  const customSkills = commands.filter((c: any) => c.type === 'prompt');
  if (customSkills.length > 0) {
    const list = customSkills.map((k: any) => `- /${k.name}: ${k.description}`).join('\n');
    customContent.push(`**Available custom skills in this project:**\n${list}`);
  }

  // Add custom agents
  const agentDefs = options.agentDefinitions;
  const customAgents = (agentDefs?.activeAgents || []).filter((a: any) => a.source !== 'built-in');
  if (customAgents.length > 0) {
    const list = customAgents.map((a: any) => `- ${a.agentType}: ${a.whenToUse}`).join('\n');
    customContent.push(`**Available custom agents configured:**\n${list}`);
  }

  // Add MCP servers
  const mcpClients = options.mcpClients || [];
  if (mcpClients && mcpClients.length > 0) {
    const list = mcpClients.map((k: any) => `- ${k.name}`).join('\n');
    customContent.push(`**Configured MCP servers:**\n${list}`);
  }

  // Add plugin skills
  const pluginSkills = commands.filter((c: any) => c.type === 'prompt' && c.source === 'plugin');
  if (pluginSkills.length > 0) {
    const list = pluginSkills.map((k: any) => `- /${k.name}: ${k.description}`).join('\n');
    customContent.push(`**Available plugin skills:**\n${list}`);
  }

  // Add user's settings.json
  const userSettings = options.userSettings || {};
  if (Object.keys(userSettings).length > 0) {
    customContent.push(`**User's settings.json:**\n\`\`\`json\n${JSON.stringify(userSettings, null, 2)}\n\`\`\``);
  }

  const parseBool = (v: string | undefined) => v === 'true' || v === '1' || v === 'yes';
  const isExternal = !!(
    parseBool(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    parseBool(process.env.CLAUDE_CODE_USE_VERTEX) ||
    parseBool(process.env.CLAUDE_CODE_USE_FOUNDRY)
  );

  const issueExplainer = isExternal
    ? "- When you cannot find an answer or the feature doesn't exist, direct the user to report the issue at https://github.com/anthropics/claude-code/issues"
    : "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug";

  const basePrompt = `${CLAUDE_CODE_GUIDE_SYSTEM_PROMPT_BASE}\n${issueExplainer}`;

  if (customContent.length > 0) {
    return `${basePrompt}\n\n---\n\n# User's Current Configuration\n\nThe user has the following custom setup in their environment:\n\n${customContent.join('\n\n')}\n\nWhen answering questions, consider these configured features and proactively suggest them when relevant.`;
  }
  return basePrompt;
}

// ============================================
// Built-in Agent Configs
// Original: K52, $Y1, F52, MS, UY1, z52 in chunks.93.mjs
// ============================================

const BASH_AGENT: AgentDefinition = {
  agentType: 'Bash',
  whenToUse: 'Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.',
  tools: [TOOL_NAMES.BASH],
  source: 'built-in',
  baseDir: 'built-in',
  model: 'inherit',
  getSystemPrompt: () => BASH_SYSTEM_PROMPT,
};

const GENERAL_PURPOSE_AGENT: AgentDefinition = {
  agentType: 'general-purpose',
  whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
  tools: ['*'],
  source: 'built-in',
  baseDir: 'built-in',
  getSystemPrompt: () => GENERAL_PURPOSE_SYSTEM_PROMPT,
};

const STATUSLINE_SETUP_AGENT: AgentDefinition = {
  agentType: 'statusline-setup',
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: [TOOL_NAMES.READ, TOOL_NAMES.EDIT],
  source: 'built-in',
  baseDir: 'built-in',
  model: 'sonnet',
  color: 'orange',
  getSystemPrompt: () => STATUSLINE_SYSTEM_PROMPT,
};

const EXPLORE_AGENT: AgentDefinition = {
  agentType: 'Explore',
  whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
  disallowedTools: [TOOL_NAMES.TASK, TOOL_NAMES.EXIT_PLAN_MODE, TOOL_NAMES.EDIT, TOOL_NAMES.WRITE, TOOL_NAMES.NOTEBOOK_EDIT],
  source: 'built-in',
  baseDir: 'built-in',
  model: 'haiku',
  criticalSystemReminder_EXPERIMENTAL: 'CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files.',
  getSystemPrompt: () => EXPLORE_SYSTEM_PROMPT,
};

const PLAN_AGENT: AgentDefinition = {
  agentType: 'Plan',
  whenToUse: 'Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.',
  disallowedTools: [TOOL_NAMES.TASK, TOOL_NAMES.EXIT_PLAN_MODE, TOOL_NAMES.EDIT, TOOL_NAMES.WRITE, TOOL_NAMES.NOTEBOOK_EDIT],
  source: 'built-in',
  tools: ['Glob', 'Grep', 'Read', 'Bash'],
  baseDir: 'built-in',
  model: 'inherit',
  criticalSystemReminder_EXPERIMENTAL: 'CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files.',
  getSystemPrompt: () => PLAN_SYSTEM_PROMPT,
};

/**
 * Generate issues explainer for guide agent.
 * Original: BY5 in chunks.93.mjs:302-305
 */
function generateIssuesExplainer(): string {
  // Simplified: Original checks if external (Bedrock/Vertex/Foundry) via Yk()
  const isExternal = !!(
    process.env.CLAUDE_CODE_USE_BEDROCK === 'true' ||
    process.env.CLAUDE_CODE_USE_VERTEX === 'true' ||
    process.env.CLAUDE_CODE_USE_FOUNDRY === 'true'
  );

  if (isExternal) {
    return "- When you cannot find an answer or the feature doesn't exist, direct the user to report the issue at https://github.com/anthropics/claude-code/issues";
  }
  return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug";
}

const CLAUDE_CODE_GUIDE_AGENT: AgentDefinition = {
  agentType: 'claude-code-guide',
  whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
  tools: [TOOL_NAMES.GLOB, TOOL_NAMES.GREP, TOOL_NAMES.READ, TOOL_NAMES.WEB_FETCH, TOOL_NAMES.WEB_SEARCH],
  source: 'built-in',
  baseDir: 'built-in',
  model: 'haiku',
  permissionMode: 'dontAsk',
  getSystemPrompt: (context: any) => {
    const options = context?.toolUseContext?.options || {};
    const customContent: string[] = [];

    // Add custom skills
    const commands = options.commands || [];
    const customSkills = commands.filter((c: any) => c.type === 'prompt');
    if (customSkills.length > 0) {
      const list = customSkills.map((k: any) => `- /${k.name}: ${k.description}`).join('\n');
      customContent.push(`**Available custom skills in this project:**\n${list}`);
    }

    // Add custom agents
    const agentDefs = options.agentDefinitions;
    const customAgents = (agentDefs?.activeAgents || []).filter((a: any) => a.source !== 'built-in');
    if (customAgents.length > 0) {
      const list = customAgents.map((a: any) => `- ${a.agentType}: ${a.whenToUse}`).join('\n');
      customContent.push(`**Available custom agents configured:**\n${list}`);
    }

    // Add MCP servers
    const mcpClients = options.mcpClients || [];
    if (mcpClients && mcpClients.length > 0) {
      const list = mcpClients.map((k: any) => `- ${k.name}`).join('\n');
      customContent.push(`**Configured MCP servers:**\n${list}`);
    }

    // Add plugin skills
    const pluginSkills = commands.filter((c: any) => c.type === 'prompt' && c.source === 'plugin');
    if (pluginSkills.length > 0) {
      const list = pluginSkills.map((k: any) => `- /${k.name}: ${k.description}`).join('\n');
      customContent.push(`**Available plugin skills:**\n${list}`);
    }

    // Add user's settings.json
    // Original uses jQ() to get settings
    const userSettings = options.userSettings || {};
    if (Object.keys(userSettings).length > 0) {
      customContent.push(`**User's settings.json:**\n\`\`\`json\n${JSON.stringify(userSettings, null, 2)}\n\`\`\``);
    }

    const issuesExplainer = generateIssuesExplainer();
    const basePrompt = `${CLAUDE_CODE_GUIDE_SYSTEM_PROMPT_BASE}\n${issuesExplainer}`;

    if (customContent.length > 0) {
      return `${basePrompt}\n\n---\n\n# User's Current Configuration\n\nThe user has the following custom setup in their environment:\n\n${customContent.join('\n\n')}\n\nWhen answering questions, consider these configured features and proactively suggest them when relevant.`;
    }
    return basePrompt;
  },
};

export const AGENT_CONFIGS: Record<string, AgentDefinition> = {
  Bash: BASH_AGENT,
  'general-purpose': GENERAL_PURPOSE_AGENT,
  'statusline-setup': STATUSLINE_SETUP_AGENT,
  Explore: EXPLORE_AGENT,
  Plan: PLAN_AGENT,
  'claude-code-guide': CLAUDE_CODE_GUIDE_AGENT,
};

export const AGENT_TYPES = new Set(
  Object.keys(AGENT_CONFIGS).filter((k) => {
    const cfg = AGENT_CONFIGS[k]!;
    // Note: isEnabled check would need to be moved here if we want dynamic filtering at definition level
    return true; 
  })
);

// ============================================
// Permission Filtering
// ============================================

/**
 * Find matching deny rule.
 * Original: cz0 in chunks.147.mjs:1507-1509
 */
export function findDenyRule(permissionContext: any, toolName: string, ruleContent: string): any {
  // Original uses _d(A) which likely returns a flat list of deny rules
  const denyRules = permissionContext.alwaysDenyRules || [];
  return denyRules.find((rule: any) => 
    rule.toolName === toolName && rule.ruleContent === ruleContent
  ) || null;
}

/**
 * Filter agents by permission rules.
 * Original: mz0 in chunks.147.mjs:1511-1513
 */
export function filterAgentsByPermission(agents: any[], permissionContext: any, toolName: string): any[] {
  return agents.filter((agent) => findDenyRule(permissionContext, toolName, agent.agentType) === null);
}

// ============================================
// Model Resolution
// ============================================

/**
 * Resolve model with permissions.
 * Original: HQA in chunks.46.mjs:2259-2268
 */
export function resolveModelWithPermissions(args: {
  permissionMode: string;
  mainLoopModel: string;
  exceeds200kTokens?: boolean;
}): string {
  const { permissionMode, mainLoopModel, exceeds200kTokens = false } = args;
  
  // FQA() returns current base model or override
  const baseModel = process.env.ANTHROPIC_MODEL || 'sonnet';

  if (baseModel === 'opusplan' && permissionMode === 'plan' && !exceeds200kTokens) {
    return 'claude-3-opus-20240229';
  }
  
  if (baseModel === 'haiku' && permissionMode === 'plan') {
    return 'claude-3-5-sonnet-20241022';
  }

  return mainLoopModel;
}

/**
 * Resolve agent model based on priority chain.
 * Original: YA1 in chunks.46.mjs:2513-2529
 */
export function resolveAgentModel(
  agentModel: BuiltInAgentModel | string | undefined,
  mainLoopModel: string,
  overrideModel: string | undefined,
  permissionMode: string
): string {
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return process.env.CLAUDE_CODE_SUBAGENT_MODEL;
  
  // Model normalization helper (simplified FX)
  const normalize = (m: string) => {
    const lower = m.toLowerCase();
    if (lower === 'sonnet') return 'claude-3-5-sonnet-20241022';
    if (lower === 'haiku') return 'claude-3-5-haiku-20241022';
    if (lower === 'opus') return 'claude-3-opus-20240229';
    return m;
  };

  // Platform transformation helper (simplified itQ/Y)
  const transform = (m: string) => {
    // Original applies bedrock/vertex/foundry transformation here
    // For claudecode reconstruction, we keep it simple or use the normalized name
    return normalize(m);
  };

  if (overrideModel) return transform(overrideModel);
  
  const model = agentModel ?? 'inherit';
  if (model === 'inherit') {
    return resolveModelWithPermissions({
      permissionMode: permissionMode || 'default',
      mainLoopModel,
    });
  }
  
  return transform(model as string);
}

/**
 * Check if agent is built-in.
 * Original: p_ in chunks.93.mjs:590-592
 */
export function isBuiltInAgent(agent: AgentDefinition): boolean {
  return agent.source === 'built-in';
}

/**
 * Get query source for agent.
 * Original: TP2 in chunks.112.mjs:3117-3119
 */
export function getQuerySource(agentType: string, isBuiltIn: boolean): string {
  if (isBuiltIn) return agentType ? `agent:builtin:${agentType}` : 'agent:default';
  return 'agent:custom';
}

/**
 * Returns all built-in agents.
 * Original: ED0 in chunks.93.mjs:458-462
 */
export function getBuiltInAgents(): AgentDefinition[] {
  const agents = [BASH_AGENT, GENERAL_PURPOSE_AGENT, STATUSLINE_SETUP_AGENT, EXPLORE_AGENT, PLAN_AGENT];
  
  if (
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-ts' &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-py' &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-cli'
  ) {
    agents.push(CLAUDE_CODE_GUIDE_AGENT);
  }
  
  return agents;
}

/**
 * Resolve tools for agent.
 * Original: ur in chunks.92.mjs:3188-3233
 */
export function resolveAgentTools(
  agentDefinition: AgentDefinition,
  parentTools: any[], // Type simplified for tools package
  isAsync: boolean
): { resolvedTools: any[] } {
  // Logic from chunks.92.mjs:3188
  // ... (Already implemented in core/agent-loop/subagent-loop.ts, 
  // but here we might need a simplified version or import it)
  return { resolvedTools: [] }; // Placeholder for tools package version
}

/**
 * Load a single agent markdown file.
 * Reconstructed logic from w52 and WY5 in chunks.93.mjs
 */
export function loadAgentFromFile(
  filePath: string,
  pluginName: string,
  subdirs: string[],
  pluginSource: string,
  seenNames: Set<string>
): AgentDefinition | null {
  try {
    if (!existsSync(filePath)) return null;
    const stats = statSync(filePath);
    if (!stats.isFile()) return null;

    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, content: body } = parseFrontmatter(content);

    // WY5: Validate required fields
    const name = (frontmatter as any).name || basename(filePath).replace(/\.md$/, "");
    const description = (frontmatter as any).description || (frontmatter as any)["when-to-use"];
    
    if (!name || typeof name !== 'string' || !description || typeof description !== 'string') {
      console.error(`Agent file ${filePath} is missing required 'name' or 'description' in frontmatter`);
      return null;
    }

    const agentType = [pluginName, ...subdirs, name].join(":");
    if (seenNames.has(agentType)) return null;
    seenNames.add(agentType);

    const tools = (frontmatter as any).tools;
    const skills = (frontmatter as any).skills;
    const systemPrompt = body.trim();
    let model = (frontmatter as any).model;
    const forkContext = (frontmatter as any).forkContext === true || (frontmatter as any).forkContext === "true";

    // WY5 Rule: If forkContext: true, model must be 'inherit'
    if (forkContext && model !== 'inherit') {
      if (model !== undefined) {
         console.warn(`Agent file ${filePath} has forkContext: true but model is not 'inherit'. Overriding to 'inherit'.`);
      }
      model = 'inherit';
    }

    return {
      agentType,
      whenToUse: description.replace(/\\n/g, '\n'),
      tools: Array.isArray(tools) ? tools : undefined,
      skills: Array.isArray(skills) ? skills : undefined,
      getSystemPrompt: () => systemPrompt,
      source: pluginSource as any,
      color: (frontmatter as any).color,
      model,
      filename: name,
      plugin: pluginSource,
      forkContext,
      permissionMode: (frontmatter as any).permissionMode,
      criticalSystemReminder_EXPERIMENTAL: (frontmatter as any).criticalSystemReminder_EXPERIMENTAL,
      disallowedTools: (frontmatter as any).disallowedTools,
    };
  } catch (error) {
    console.error(`Failed to load agent from ${filePath}:`, error);
    return null;
  }
}

/**
 * Scan a directory for agent markdown files.
 * Original: N52 in chunks.93.mjs:475-497
 */
export function loadAgentsFromDirectory(
  dirPath: string,
  pluginName: string,
  pluginSource: string,
  seenNames: Set<string>
): AgentDefinition[] {
  const agents: AgentDefinition[] = [];

  function scan(currentPath: string, subdirs: string[] = []) {
    try {
      if (!existsSync(currentPath)) return;
      const files = readdirSync(currentPath, { withFileTypes: true });
      for (const file of files) {
        const fullPath = join(currentPath, file.name);
        if (file.isDirectory()) {
          scan(fullPath, [...subdirs, file.name]);
        } else if (file.isFile() && file.name.endsWith(".md")) {
          const agent = loadAgentFromFile(fullPath, pluginName, subdirs, pluginSource, seenNames);
          if (agent) agents.push(agent);
        }
      }
    } catch (error) {
      console.error(`Failed to scan agents directory ${currentPath}:`, error);
    }
  }

  scan(dirPath);
  return agents;
}

/**
 * Deduplicate agents by priority.
 * Original: mb in chunks.93.mjs:602-614
 */
export function deduplicateAgents(allAgents: AgentDefinition[]): AgentDefinition[] {
  const builtIn = allAgents.filter(a => a.source === "built-in");
  const plugin = allAgents.filter(a => a.source === "plugin");
  const userSettings = allAgents.filter(a => a.source === "userSettings");
  const projectSettings = allAgents.filter(a => a.source === "projectSettings");
  const flagSettings = allAgents.filter(a => a.source === "flagSettings");
  const policySettings = allAgents.filter(a => a.source === "policySettings");

  const priorityOrder = [builtIn, plugin, userSettings, projectSettings, flagSettings, policySettings];
  const agentMap = new Map<string, AgentDefinition>();

  for (const sourceAgents of priorityOrder) {
    for (const agent of sourceAgents) {
      agentMap.set(agent.agentType, agent);
    }
  }

  return Array.from(agentMap.values());
}

/**
 * Parse a single agent from JSON settings.
 * Original: DY5 in chunks.93.mjs:638-672
 */
export function parseAgentFromJSON(
  agentName: string,
  config: any,
  source: AgentDefinition['source'] = 'flagSettings'
): AgentDefinition | null {
  try {
    const validated = agentSchema.parse(config);
    return {
      agentType: agentName,
      whenToUse: validated.description,
      tools: validated.tools,
      disallowedTools: validated.disallowedTools,
      getSystemPrompt: () => validated.prompt,
      source,
      baseDir: 'settings',
      model: validated.model,
      permissionMode: validated.permissionMode,
      // MCP servers and hooks would need additional integration
    };
  } catch (error) {
    console.error(`Error parsing agent '${agentName}' from JSON:`, error);
    return null;
  }
}

/**
 * Get all agents from all sources.
 * Original: _52 (getAllAgents) in chunks.93.mjs:809-856
 */
export async function getAllAgents(options?: { cwd?: string }): Promise<AgentDiscoveryResult> {
  const cwd = options?.cwd || process.cwd();
  const projectDir = getProjectDir(cwd);
  const seenNames = new Set<string>();

  try {
    const failedFiles: Array<{ path: string; error: string }> = [];
    
    // 1. Load from project directory
    const projectAgentsDir = join(projectDir, '.claude', 'agents');
    const projectAgents = existsSync(projectAgentsDir) 
      ? loadAgentsFromDirectory(projectAgentsDir, 'project', 'projectSettings', seenNames)
      : [];

    // 2. Load from user directory
    const userAgentsDir = join(homedir(), '.claude', 'agents');
    const userAgents = existsSync(userAgentsDir)
      ? loadAgentsFromDirectory(userAgentsDir, 'user', 'userSettings', seenNames)
      : [];

    // 3. Load from plugins (Placeholder - would call getPluginAgents)
    const pluginAgents: AgentDefinition[] = []; 
    
    // 4. Combine everything
    const allAgents = [...getBuiltInAgents(), ...pluginAgents, ...userAgents, ...projectAgents];
    
    // 5. Deduplicate
    const activeAgents = deduplicateAgents(allAgents);
    
    return {
      activeAgents,
      allAgents,
      failedFiles: failedFiles.length > 0 ? failedFiles : undefined
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error loading agent definitions: ${message}`);
    const builtIn = getBuiltInAgents();
    return {
      activeAgents: builtIn,
      allAgents: builtIn,
      failedFiles: [{ path: "unknown", error: message }]
    };
  }
}
