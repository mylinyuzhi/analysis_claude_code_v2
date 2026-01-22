/**
 * @claudecode/tools - Task Tool
 *
 * Launch a new agent to handle complex, multi-step tasks autonomously.
 * Supports different agent types and background execution.
 *
 * Reconstructed from chunks.91.mjs, chunks.113.mjs
 *
 * Key symbols:
 * - V$ → TaskTool
 * - L32 → createFullyBackgroundedAgent
 * - O32 → createBackgroundableAgent
 * - $f → runAgentLoop
 * - XA1 → executeInAgentContext
 * - RI0 → updateTaskProgress
 * - MI0 → getProgressSnapshot
 * - YA1 → resolveAgentModel
 */

import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { homedir } from 'os';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { TaskInput, TaskOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

import {
  type Tool as CoreTool,
  type ToolUseContext as CoreToolUseContext,
  type ToolResult as CoreToolResult,
  ALWAYS_EXCLUDED_TOOLS,
} from '@claudecode/core/tools';
import {
  aggregateAsyncAgentExecution,
  createBackgroundableAgent,
  createFullyBackgroundedAgent,
  markTaskCompleted as markCoreTaskCompleted,
  markTaskFailed as markCoreTaskFailed,
  runSubagentLoop as runCoreSubagentLoop,
  updateTaskProgress as updateCoreTaskProgress,
  generateTaskId,
} from '@claudecode/core/agent-loop';
import { createUserMessage as createCoreUserMessage } from '@claudecode/core/message';

import { ReadTool } from './read.js';
import { WriteTool } from './write.js';
import { EditTool } from './edit.js';
import { GlobTool } from './glob.js';
import { GrepTool } from './grep.js';
import { BashTool } from './bash.js';
import { WebFetchTool } from './web-fetch.js';
import { WebSearchTool } from './web-search.js';
import { TodoWriteTool } from './todo-write.js';
import { SkillTool } from './skill.js';
import { AskUserQuestionTool } from './ask-user-question.js';
import { NotebookEditTool } from './notebook-edit.js';
import { KillShellTool } from './kill-shell.js';
import { TaskOutputTool } from './task-output.js';

// ============================================
// Constants
// ============================================

// Source: chunks.113.mjs sets maxResultSizeChars to 1e5.
const MAX_RESULT_SIZE = 100000;

// Source: q82 (MAX_TURNS) in chunks.113.mjs
const DEFAULT_MAX_TURNS = 500;

/**
 * Built-in agent configs.
 *
 * Source of truth: `claude_code_v_2.1.7/source/chunks.93.mjs`.
 */
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
1. Understand Requirements
2. Explore Thoroughly (use Glob/Grep/Read; Bash only for read-only ops)
3. Design Solution
4. Detail the Plan

## Required Output
End your response with:

### Critical Files for Implementation
- path/to/file1.ts - [Brief reason]
- path/to/file2.ts - [Brief reason]
- path/to/file3.ts - [Brief reason]

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

function getClaudeCodeGuideSystemPrompt(toolUseContext: CoreToolUseContext): string {
  const options = (toolUseContext as any).options;
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
  if (mcpClients.length > 0) {
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
  if (options.userSettings && Object.keys(options.userSettings).length > 0) {
    customContent.push(`**User's settings.json:**\n\`\`\`json\n${JSON.stringify(options.userSettings, null, 2)}\n\`\`\``);
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

type BuiltInAgentModel = 'inherit' | 'sonnet' | 'opus' | 'haiku' | undefined;

interface AgentConfig {
  agentType: string;
  whenToUse: string;
  tools?: string[];
  disallowedTools?: string[];
  model?: BuiltInAgentModel;
  permissionMode?: 'dontAsk' | undefined;
  color?: string;
  criticalSystemReminder_EXPERIMENTAL?: string;
  isEnabled?: () => boolean;
  getSystemPrompt: (toolUseContext?: any) => string;
}

function shouldEnableClaudeCodeGuideAgent(): boolean {
  return (
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-ts' &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-py' &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== 'sdk-cli'
  );
}

/**
 * Built-in agents available to Task tool.
 */
const AGENT_CONFIGS: Record<string, AgentConfig> = {
  Bash: {
    agentType: 'Bash',
    whenToUse:
      'Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.',
    tools: ['Bash'],
    model: 'inherit',
    getSystemPrompt: () => BASH_SYSTEM_PROMPT,
  },
  'general-purpose': {
    agentType: 'general-purpose',
    whenToUse:
      "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
    tools: ['*'],
    // NOTE: source does not set model here; it uses the caller's model / defaults.
    model: undefined,
    getSystemPrompt: () => GENERAL_PURPOSE_SYSTEM_PROMPT,
  },
  'statusline-setup': {
    agentType: 'statusline-setup',
    whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
    tools: ['Read', 'Edit'],
    model: 'sonnet',
    color: 'orange',
    getSystemPrompt: () => STATUSLINE_SYSTEM_PROMPT,
  },
  Explore: {
    agentType: 'Explore',
    whenToUse:
      'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns, search code for keywords, or answer questions about the codebase. When calling this agent, specify a thoroughness level.',
    // Source relies on the underlying agent toolset; keep tool list minimal and enforce via disallowedTools.
    tools: undefined,
    // Keep consistent with source/chunks.93.mjs (disallow self-spawn + any write/edit + user-interactive tool).
    disallowedTools: [
      TOOL_NAMES.TASK,
      TOOL_NAMES.EXIT_PLAN_MODE,
      TOOL_NAMES.EDIT,
      TOOL_NAMES.WRITE,
      TOOL_NAMES.NOTEBOOK_EDIT,
    ],
    model: 'haiku',
    criticalSystemReminder_EXPERIMENTAL:
      'CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files.',
    getSystemPrompt: () => EXPLORE_SYSTEM_PROMPT,
  },
  Plan: {
    agentType: 'Plan',
    whenToUse:
      'Software architect agent for designing implementation plans. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.',
    tools: undefined,
    // Keep consistent with source/chunks.93.mjs (disallow self-spawn + any write/edit + user-interactive tool).
    disallowedTools: [
      TOOL_NAMES.TASK,
      TOOL_NAMES.EXIT_PLAN_MODE,
      TOOL_NAMES.EDIT,
      TOOL_NAMES.WRITE,
      TOOL_NAMES.NOTEBOOK_EDIT,
    ],
    model: 'inherit',
    criticalSystemReminder_EXPERIMENTAL:
      'CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files.',
    getSystemPrompt: () => PLAN_SYSTEM_PROMPT,
  },
  'claude-code-guide': {
    agentType: 'claude-code-guide',
    whenToUse:
      'Use this agent when the user asks questions about Claude Code, the Claude Agent SDK, or the Claude API. Prefer resuming an existing claude-code-guide instance when possible.',
    tools: ['Glob', 'Grep', 'Read', 'WebFetch', 'WebSearch'],
    model: 'haiku',
    permissionMode: 'dontAsk',
    isEnabled: shouldEnableClaudeCodeGuideAgent,
    getSystemPrompt: (toolUseContext: any) => getClaudeCodeGuideSystemPrompt(toolUseContext),
  },
};

const AGENT_TYPES = new Set(
  Object.keys(AGENT_CONFIGS).filter((k) => {
    const cfg = AGENT_CONFIGS[k]!;
    return cfg.isEnabled?.() !== false;
  })
);

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Task tool input schema.
 */
const baseTaskInputSchema = z.object({
  prompt: z.string().describe('The task for the agent to perform'),
  description: z.string().describe('A short (3-5 word) description of the task'),
  subagent_type: z.string().describe('The type of specialized agent to use for this task'),
  model: z
    .enum(['sonnet', 'opus', 'haiku'])
    .optional()
    .describe('Optional model to use for this agent'),
  max_turns: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Maximum number of agentic turns (API round-trips) before stopping'),
  run_in_background: z.boolean().optional().describe('Set to true to run this agent in the background'),
  resume: z.string().optional().describe('Optional agent ID to resume from'),
});

// Source behavior: when background tasks are disabled, omit run_in_background from the schema.
const taskInputSchema =
  process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS === 'true'
    ? baseTaskInputSchema.omit({ run_in_background: true })
    : baseTaskInputSchema;

const taskUsageSchema = z.object({
  input_tokens: z.number(),
  output_tokens: z.number(),
  cache_creation_input_tokens: z.number().nullable(),
  cache_read_input_tokens: z.number().nullable(),
  server_tool_use: z
    .object({
      web_search_requests: z.number(),
      web_fetch_requests: z.number(),
    })
    .nullable(),
  service_tier: z.enum(['standard', 'priority', 'batch']).nullable(),
  cache_creation: z
    .object({
      ephemeral_1h_input_tokens: z.number(),
      ephemeral_5m_input_tokens: z.number(),
    })
    .nullable(),
});

/**
 * Task tool output schema.
 */
const completedOutputSchema = z.object({
  status: z.literal('completed'),
  agentId: z.string(),
  prompt: z.string(),
  content: z.array(
    z.object({
      type: z.literal('text'),
      text: z.string(),
    })
  ),
  totalToolUseCount: z.number(),
  totalDurationMs: z.number(),
  totalTokens: z.number(),
  usage: taskUsageSchema,
});

const asyncLaunchedOutputSchema = z.object({
  status: z.literal('async_launched'),
  agentId: z.string().describe('The ID of the async agent'),
  description: z.string().describe('The description of the task'),
  prompt: z.string().describe('The prompt for the agent'),
  outputFile: z.string().describe('Path to the output file for checking agent progress'),
  // Source returns isAsync in practice (schema appears permissive); keep optional for compatibility.
  isAsync: z.boolean().optional(),
});

const subAgentEnteredOutputSchema = z.object({
  status: z.literal('sub_agent_entered'),
  description: z.string(),
  message: z.string(),
});

const taskOutputSchema = z.union([
  completedOutputSchema,
  asyncLaunchedOutputSchema,
  subAgentEnteredOutputSchema,
]);

// ============================================
// Helper Functions
// ============================================

/**
 * Sanitize agent ID.
 * Original: iz (sanitizeId) in chunks.113.mjs
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-]/g, '');
}

function estimateTokensFromText(text: string): number {
  // Rough heuristic, same strategy used in core aggregateAsyncAgentExecution.
  return Math.ceil(text.length / 4);
}

type TaskUsage = z.infer<typeof taskUsageSchema>;

/**
 * Source alignment: Task tool returns the last assistant message's `usage`.
 * Original: uz0() returns `usage: X.message.usage` (chunks.112.mjs:3459+)
 */
function normalizeTaskUsage(raw: unknown): TaskUsage {
  const u = raw && typeof raw === 'object' ? (raw as any) : {};

  const serverToolUse =
    u.server_tool_use && typeof u.server_tool_use === 'object' ? (u.server_tool_use as any) : null;
  const cacheCreation =
    u.cache_creation && typeof u.cache_creation === 'object' ? (u.cache_creation as any) : null;

  const serviceTier: TaskUsage['service_tier'] =
    u.service_tier === 'standard' || u.service_tier === 'priority' || u.service_tier === 'batch'
      ? u.service_tier
      : null;

  return {
    input_tokens: typeof u.input_tokens === 'number' ? u.input_tokens : 0,
    output_tokens: typeof u.output_tokens === 'number' ? u.output_tokens : 0,
    cache_creation_input_tokens:
      typeof u.cache_creation_input_tokens === 'number' ? u.cache_creation_input_tokens : null,
    cache_read_input_tokens:
      typeof u.cache_read_input_tokens === 'number' ? u.cache_read_input_tokens : null,
    server_tool_use: serverToolUse
      ? {
          web_search_requests:
            typeof serverToolUse.web_search_requests === 'number' ? serverToolUse.web_search_requests : 0,
          web_fetch_requests:
            typeof serverToolUse.web_fetch_requests === 'number' ? serverToolUse.web_fetch_requests : 0,
        }
      : null,
    service_tier: serviceTier,
    cache_creation: cacheCreation
      ? {
          ephemeral_1h_input_tokens:
            typeof cacheCreation.ephemeral_1h_input_tokens === 'number'
              ? cacheCreation.ephemeral_1h_input_tokens
              : 0,
          ephemeral_5m_input_tokens:
            typeof cacheCreation.ephemeral_5m_input_tokens === 'number'
              ? cacheCreation.ephemeral_5m_input_tokens
              : 0,
        }
      : null,
  };
}

/**
 * Source alignment: uSA(usage) in chunks.112.mjs:3468
 * totalTokens = input + output + cache_creation_input + cache_read_input
 */
function totalTokensFromUsage(usage: TaskUsage): number {
  return (
    usage.input_tokens +
    usage.output_tokens +
    (usage.cache_creation_input_tokens ?? 0) +
    (usage.cache_read_input_tokens ?? 0)
  );
}

/**
 * Run subagent loop.
 * Original: $f (runSubagentLoop) in chunks.113.mjs
 *
 * 使用 @claudecode/core 的 subagent loop，确保与 source 的执行链路一致：
 * - 走 coreMessageLoop（支持 tools / hooks / compact / MCP 等）
 * - 通过 ToolUseContext 适配层复用当前进程内的 built-in tools
 */
function getBuiltinToolsForSubagents() {
  return [
    ReadTool,
    WriteTool,
    EditTool,
    GlobTool,
    GrepTool,
    BashTool,
    WebFetchTool,
    WebSearchTool,
    TodoWriteTool,
    SkillTool,
    AskUserQuestionTool,
    NotebookEditTool,
    KillShellTool,
    TaskOutputTool,
    // 允许子代理再次调用 Task（与 source 行为一致；具体是否允许由 tools/disallowedTools 决定）
    TaskTool,
  ];
}

function filterToolsByAllowDeny<T extends { name: string }>(
  tools: T[],
  allowedTools?: string[],
  disallowedTools?: string[]
): T[] {
  const denied = new Set(disallowedTools || []);
  const allowed = allowedTools && allowedTools.length > 0 && !allowedTools.includes('*')
    ? new Set(allowedTools)
    : null;

  return tools.filter((t) => {
    // Layer 1: System-wide blocked tools
    if (ALWAYS_EXCLUDED_TOOLS.has(t.name)) return false;

    // Layer 2: Agent-specific disallowedTools
    if (denied.has(t.name)) return false;

    // Layer 3: Agent-specific tools Allowlist
    if (allowed && !allowed.has(t.name)) return false;

    return true;
  });
}

function adaptToolsForCore(options: {
  allowedTools?: string[];
  disallowedTools?: string[];
  getAppState: () => Promise<any>;
  setAppState: (updater: (state: any) => any) => void;
  readFileState: Map<string, any>;
  agentId?: string;
  sessionId?: string;
  abortController?: AbortController;
}): CoreTool[] {
  const filtered = filterToolsByAllowDeny(getBuiltinToolsForSubagents() as any, options.allowedTools, options.disallowedTools);

  return (filtered as any[]).map((tool) => {
    const adapted: CoreTool = {
      name: tool.name,
      maxResultSizeChars: tool.maxResultSizeChars ?? 30000,
      strict: tool.strict,
      input_examples: tool.input_examples,
      description: tool.description,
      prompt: tool.prompt,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      userFacingName: tool.userFacingName,
      isEnabled: tool.isEnabled,
      isConcurrencySafe: tool.isConcurrencySafe,
      isReadOnly: tool.isReadOnly,
      requiresUserInteraction: tool.requiresUserInteraction,
      isSearchOrReadCommand: tool.isSearchOrReadCommand,
      getPath: tool.getPath,
      checkPermissions: async (input: unknown, ctx: CoreToolUseContext) => {
        if (!tool.checkPermissions) return { result: true };
        const toolCtx: ToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          options: (ctx as any).options,
        };

        const res = await tool.checkPermissions(input, toolCtx);
        if (res?.behavior === 'deny') return { result: false, behavior: 'deny', message: res.message };
        if (res?.behavior === 'ask') return { result: false, behavior: 'ask', message: res.message };
        return { result: true };
      },
      validateInput: async (input: unknown, ctx: CoreToolUseContext) => {
        if (!tool.validateInput) return { result: true };
        const toolCtx: ToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          options: (ctx as any).options,
        };
        const res = await tool.validateInput(input, toolCtx);
        return { result: !!res?.result, message: res?.message, errorCode: res?.errorCode };
      },
      call: async (
        input: unknown,
        ctx: CoreToolUseContext,
        toolUseId: string,
        metadata: unknown,
        progressCallback?: (progress: any) => void
      ): Promise<CoreToolResult> => {
        const toolCtx: ToolContext = {
          getCwd: () => process.cwd(),
          getAppState: options.getAppState,
          setAppState: options.setAppState,
          readFileState: options.readFileState,
          agentId: options.agentId ?? ctx.agentId,
          sessionId: options.sessionId,
          abortSignal: options.abortController?.signal ?? ctx.abortController?.signal,
          options: (ctx as any).options,
        };
        const res: any = await tool.call(input, toolCtx, toolUseId, metadata, progressCallback as any);
        return { data: res?.data, error: res?.error } as any;
      },
      mapToolResultToToolResultBlockParam: (result: CoreToolResult, toolUseId: string) => {
        const data = (result as any)?.data;
        const raw = tool.mapToolResultToToolResultBlockParam
          ? tool.mapToolResultToToolResultBlockParam(data, toolUseId)
          : ({ tool_use_id: toolUseId, type: 'tool_result', content: JSON.stringify(data) } as any);
        return {
          type: 'tool_result',
          tool_use_id: raw.tool_use_id,
          content: raw.content,
          is_error: Boolean((result as any)?.error) || raw.is_error,
        } as any;
      },
    };
    return adapted;
  });
}

function getSubagentTranscriptPath(agentId: string, cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const sanitizedCwd = workingDir.replace(/[^a-zA-Z0-9]/g, '-');
  return join(homedir(), '.claude', 'projects', sanitizedCwd, 'subagents', `agent-${agentId}.jsonl`);
}

function loadResumeMessages(agentId: string, cwd?: string): any[] {
  const transcriptPath = getSubagentTranscriptPath(agentId, cwd);
  if (!existsSync(transcriptPath)) {
    throw new Error(`No transcript found for agent ID: ${agentId}`);
  }

  const raw = readFileSync(transcriptPath, 'utf-8');
  const messages: any[] = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const entry = JSON.parse(trimmed);
      // recordSidechainTranscript writes SessionLogEntry lines with `content` holding the ConversationMessage
      const content = entry?.content;
      if (content && typeof content === 'object' && typeof content.type === 'string') {
        messages.push(content);
      }
    } catch {
      // ignore invalid lines
    }
  }

  return messages;
}

// ============================================
// Task Tool
// ============================================

/**
 * Task tool implementation.
 * Original: V$ (TaskTool) in chunks.91.mjs, chunks.113.mjs
 */
export const TaskTool = createTool<TaskInput, TaskOutput>({
  name: TOOL_NAMES.TASK,
  maxResultSizeChars: MAX_RESULT_SIZE,

  async description() {
    return `Launch a new agent to handle complex, multi-step tasks autonomously.

The Task tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types:
- Bash: Command execution specialist for running bash commands
- general-purpose: General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks
- statusline-setup: Configure Claude Code status line settings (Read/Edit only)
- Explore: Fast read-only exploration agent
- Plan: Read-only planning agent
- claude-code-guide: Documentation agent for Claude Code / Agent SDK / Claude API (disabled for SDK entrypoints)`;
  },

  async prompt() {
    return `When using the Task tool:
- Always include a short description (3-5 words) summarizing what the agent will do
- Launch multiple agents concurrently whenever possible
- Agents can be resumed using the resume parameter
- When the agent is done, it will return a single message back to you
- Provide clear, detailed prompts so the agent can work autonomously

When NOT to use the Task tool:
- If you want to read a specific file path, use the Read or Glob tool instead
- If you are searching for a specific class definition, use the Glob tool instead
- For tasks that are not related to the agent descriptions above`;
  },

  inputSchema: taskInputSchema,
  outputSchema: taskOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    return true;
  },

  isReadOnly() {
    return true; // Task spawning doesn't directly modify files
  },

  async checkPermissions(input) {
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    // If runtime provided agent definitions, validate against them (matches source).
    const defs = (context.options as any)?.agentDefinitions as
      | { activeAgents?: Array<{ agentType: string }>; allAgents?: Array<{ agentType: string }> }
      | undefined;
    const active = defs?.activeAgents ?? [];
    const all = defs?.allAgents ?? active;
    if (active.length > 0 || all.length > 0) {
      const allowed = active.some((a) => a?.agentType === input.subagent_type);
      const exists = all.some((a) => a?.agentType === input.subagent_type);
      if (!allowed && exists) {
        return validationError(
          `Agent type '${input.subagent_type}' has been denied by permission rule '${TOOL_NAMES.TASK}(${input.subagent_type})'.`,
          1
        );
      }
      if (!allowed && !exists) {
        return validationError(
          `Agent type '${input.subagent_type}' not found. Available agents: ${active.map((a) => a.agentType).join(', ')}`,
          1
        );
      }
    } else if (!AGENT_TYPES.has(input.subagent_type)) {
      return validationError(
        `Unknown agent type: ${input.subagent_type}. Available types: ${Array.from(AGENT_TYPES).join(', ')}`,
        1
      );
    }

    // Check description is short enough
    const words = input.description.split(/\s+/).length;
    if (words > 7) {
      return validationError(
        `Description too long (${words} words). Keep it to 3-5 words.`,
        2
      );
    }

    return validationSuccess();
  },

  async call(input, context, _toolUseId, metadata, _progressCallback) {
    const { prompt, description, subagent_type, model, max_turns, run_in_background, resume } = input;

    const md = metadata && typeof metadata === 'object' ? (metadata as any) : {};
    const canUseToolFromRunner = typeof md.canUseTool === 'function' ? (md.canUseTool as any) : undefined;

    const disableBackground = process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS === 'true';

    try {
      // Prefer runtime-provided agent definitions.
      const defs = (context.options as any)?.agentDefinitions as
        | { activeAgents?: any[]; allAgents?: any[] }
        | undefined;
      const activeAgents = Array.isArray(defs?.activeAgents) ? defs!.activeAgents : [];
      const allAgents = Array.isArray(defs?.allAgents) ? defs!.allAgents : activeAgents;
      const selectedFromActive = activeAgents.find((a: any) => a && typeof a === 'object' && a.agentType === subagent_type);

      const agentConfig = AGENT_CONFIGS[subagent_type];
      if (!selectedFromActive && !agentConfig) {
        // Source-specific: if agent exists but is denied, report denial.
        const existsButDenied = allAgents.some((a: any) => a && typeof a === 'object' && a.agentType === subagent_type);
        if (existsButDenied) {
          const denyRule = (context.options as any)?.findDenyRule?.(context, subagent_type);
          const source = (denyRule as any)?.source ?? 'settings';
          return toolError(
            `Agent type '${subagent_type}' has been denied by permission rule '${TOOL_NAMES.TASK}(${subagent_type})' from ${source}.`
          );
        }

        const available = activeAgents.length > 0
          ? activeAgents.map((a: any) => a?.agentType).filter((x: any) => typeof x === 'string')
          : Object.keys(AGENT_CONFIGS);
        return toolError(
          `Agent type '${subagent_type}' not found. Available agents: ${available.join(', ')}`
        );
      }

      const agentDefinition: any = selectedFromActive
        ? selectedFromActive
        : ({
            agentType: agentConfig!.agentType,
            whenToUse: agentConfig!.whenToUse,
            tools: agentConfig!.tools,
            disallowedTools: agentConfig!.disallowedTools,
            model: agentConfig!.model,
            permissionMode: agentConfig!.permissionMode,
            criticalSystemReminder_EXPERIMENTAL: agentConfig!.criticalSystemReminder_EXPERIMENTAL,
            color: agentConfig!.color,
            getSystemPrompt: (args: any) => agentConfig!.getSystemPrompt(args.toolUseContext),
          } as any);

      const agentId = resume ? sanitizeId(resume) : generateTaskId('local_agent');
      const resumeMessages = resume ? loadResumeMessages(agentId, context.getCwd()) : undefined;
      const forkContextMessages = (agentDefinition as any)?.forkContext
        ? ((context.options as any)?.__messages as any[] | undefined)
        : undefined;

      const startTime = Date.now();

      // run_in_background: true -> immediate async
      if (run_in_background === true && !disableBackground) {
        const task = createFullyBackgroundedAgent({
          agentId,
          description,
          prompt,
          selectedAgent: agentDefinition,
          setAppState: context.setAppState as any,
          cwd: context.getCwd(),
        });

        const conversation: any[] = [];
        const coreToolUseContext: any = {
          getAppState: context.getAppState,
          setAppState: context.setAppState,
          readFileState: context.readFileState,
          abortController: (task as any).abortController,
          agentId,
          messages: conversation,
          setToolJSX: (context as any).setToolJSX,
          options: {
            ...(context.options as any),
            tools: adaptToolsForCore({
              allowedTools: (agentDefinition as any)?.tools,
              disallowedTools: (agentDefinition as any)?.disallowedTools,
              getAppState: context.getAppState,
              setAppState: context.setAppState,
              readFileState: context.readFileState,
              agentId,
              sessionId: context.sessionId,
              abortController: (task as any).abortController,
            }),
          },
        };

        const messageGenerator = runCoreSubagentLoop({
          agentDefinition,
          promptMessages: [
            ...((resumeMessages && Array.isArray(resumeMessages)) ? resumeMessages : []),
            createCoreUserMessage({ content: prompt }) as any,
          ],
          toolUseContext: coreToolUseContext,
          canUseTool: async (tool: any, input: any, assistantMessage: any) => {
            return canUseToolFromRunner ? await canUseToolFromRunner(tool, input, assistantMessage) : true;
          },
          forkContextMessages,
          querySource: (context.options as any)?.querySource ?? 'background',
          model,
          maxTurns: max_turns ?? DEFAULT_MAX_TURNS,
          isAsync: true,
          override: {
            agentId,
            abortController: (task as any).abortController,
          },
        } as any)[Symbol.asyncIterator]();

        // Aggregate in background and keep appState.tasks up-to-date.
        aggregateAsyncAgentExecution(
          messageGenerator,
          agentId,
          context.setAppState as any,
          () => {
            // Best-effort: mark task completed is handled inside aggregator.
          },
          [],
          (task as any).abortController?.signal
        );

        return toolSuccess({
          status: 'async_launched',
          isAsync: true,
          agentId,
          description,
          prompt,
          outputFile: (task as any).outputPath ?? '',
        } as any);
      }

      // Foreground path (can be backgrounded via Ctrl+B if enabled)
      let backgroundSignal: Promise<void> | undefined;
      if (!disableBackground) {
        const created = createBackgroundableAgent({
          agentId,
          description,
          prompt,
          selectedAgent: agentDefinition,
          setAppState: context.setAppState as any,
          cwd: context.getCwd(),
        });
        backgroundSignal = created.backgroundSignal;
      }

      // Run loop and allow Ctrl+B background.
      const iterator = (async () => {
        const conversation: any[] = [];
        const coreToolUseContext: any = {
          getAppState: context.getAppState,
          setAppState: context.setAppState,
          readFileState: context.readFileState,
          abortController: new AbortController(),
          agentId,
          messages: conversation,
          setToolJSX: (context as any).setToolJSX,
          options: {
            ...(context.options as any),
            tools: adaptToolsForCore({
              allowedTools: (agentDefinition as any)?.tools,
              disallowedTools: (agentDefinition as any)?.disallowedTools,
              getAppState: context.getAppState,
              setAppState: context.setAppState,
              readFileState: context.readFileState,
              agentId,
              sessionId: context.sessionId,
              abortController: new AbortController(),
            }),
          },
        };

        return runCoreSubagentLoop({
          agentDefinition,
          promptMessages: [
            ...((resumeMessages && Array.isArray(resumeMessages)) ? resumeMessages : []),
            createCoreUserMessage({ content: prompt }) as any,
          ],
          toolUseContext: coreToolUseContext,
          canUseTool: async (tool: any, input: any, assistantMessage: any) => {
            return canUseToolFromRunner ? await canUseToolFromRunner(tool, input, assistantMessage) : true;
          },
          forkContextMessages,
          querySource: (context.options as any)?.querySource ?? 'subagent',
          model,
          maxTurns: max_turns ?? DEFAULT_MAX_TURNS,
          isAsync: false,
          override: {
            agentId,
            abortController: coreToolUseContext.abortController,
          },
        } as any)[Symbol.asyncIterator]();
      })();

      const it = await iterator;
      const collected: unknown[] = [];
      let toolUseCount = 0;
      let tokenCount = 0;
      let estimatedTokenCount = 0;
      let resultText = '';
      let lastAssistantUsage: unknown | undefined;

      const updateProgress = () => {
        updateCoreTaskProgress(agentId, toolUseCount, tokenCount, context.setAppState as any);
      };

      const handleValue = (value: any) => {
        collected.push(value);
        if (value && typeof value === 'object' && value.type === 'assistant') {
          const blocks = value.message?.content;
          if (Array.isArray(blocks)) {
            for (const b of blocks) {
              if (b?.type === 'tool_use') toolUseCount += 1;
              if (b?.type === 'text') {
                const t = String(b.text ?? '');
                resultText += t;
                estimatedTokenCount += estimateTokensFromText(t);
              }
            }
          }

          // Keep last assistant usage (source returns last assistant usage).
          lastAssistantUsage = value.message?.usage;
          if (lastAssistantUsage) {
            tokenCount = totalTokensFromUsage(normalizeTaskUsage(lastAssistantUsage));
          } else {
            tokenCount = estimatedTokenCount;
          }
        }
      };

      try {
        while (true) {
          const nextPromise = it.next();
          const raced = backgroundSignal
            ? await Promise.race([
                nextPromise.then((r) => ({ kind: 'next' as const, r })),
                backgroundSignal.then(() => ({ kind: 'background' as const })),
              ])
            : ({ kind: 'next' as const, r: await nextPromise });

          if (raced.kind === 'background') {
            // Continue consuming in background
            const state = (await context.getAppState()) as any;
            const taskObj = state?.tasks?.[agentId];
            const abortSignal = taskObj?.abortController?.signal;
            aggregateAsyncAgentExecution(
              it,
              agentId,
              context.setAppState as any,
              () => {
                // no-op
              },
              collected,
              abortSignal
            );

            updateProgress();
            return toolSuccess({
              status: 'async_launched',
              isAsync: true,
              agentId,
              description,
              prompt,
              outputFile: taskObj?.outputPath ?? '',
            } as any);
          }

          const { done, value } = raced.r;
          if (done) break;
          handleValue(value);
          updateProgress();
        }

        // Completed
        markCoreTaskCompleted(agentId, true, context.setAppState as any);

        const durationMs = Date.now() - startTime;
        const text = resultText.trim();

        const usage = lastAssistantUsage
          ? normalizeTaskUsage(lastAssistantUsage)
          : normalizeTaskUsage(undefined);
        const totalTokens = lastAssistantUsage ? totalTokensFromUsage(usage) : tokenCount;

        const completed = {
          status: 'completed',
          agentId,
          prompt,
          content: [{ type: 'text', text: text.length > 0 ? text : `Agent "${subagent_type}" completed task.` }],
          totalToolUseCount: toolUseCount,
          totalDurationMs: durationMs,
          totalTokens,
          usage,
        };
        return toolSuccess(completed as any);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        markCoreTaskFailed(agentId, msg, context.setAppState as any);
        return toolError(`Agent execution failed: ${msg}`);
      }
    } catch (error) {
      return toolError(`Failed to launch agent: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // Async launched - return immediately with output file info
    if ((result as any).status === 'async_launched') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [{
          type: 'text',
          text: `Async agent launched successfully.
agentId: ${(result as any).agentId} (This is an internal ID for your use, do not mention it to the user. You can use this ID to resume the agent later if needed.)
output_file: ${(result as any).outputFile || 'N/A'}

The agent is currently working in the background. You can continue with other tasks.
To check the agent's progress or retrieve its results, use the Read tool to read the output file, or use Bash with \`tail\` to see recent output.`,
        }],
      };
    }

    // Completed (or other) – return content blocks as-is.
    if ((result as any)?.content) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: (result as any).content,
      } as any;
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: [{ type: 'text', text: 'Agent completed.' }],
    } as any;
  },
});

// ============================================
// Export
// ============================================

// NOTE: TaskTool 已在声明处导出；避免重复导出。
