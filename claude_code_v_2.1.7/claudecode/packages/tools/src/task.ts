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
import { writeFileSync, mkdirSync, appendFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';
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

import type {
  Tool as CoreTool,
  ToolUseContext as CoreToolUseContext,
  ToolResult as CoreToolResult,
} from '@claudecode/core/tools';
import { runSubagentLoop as runCoreSubagentLoop } from '@claudecode/core/agent-loop';
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

const MAX_RESULT_SIZE = 30000;
const BACKGROUND_HINT_DELAY = 3000; // 3 seconds before showing Ctrl+B hint

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

const CLAUDE_CODE_GUIDE_SYSTEM_PROMPT = `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

Your expertise spans three domains:
1. Claude Code (the CLI tool)
2. Claude Agent SDK
3. Claude API

Approach:
1. Determine which domain the user's question falls into
2. Fetch the appropriate docs map
3. Identify the most relevant documentation URLs
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation.`;

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
  getSystemPrompt: () => string;
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
    getSystemPrompt: () =>
      // Source prompt is very long; keep it in the source bundle as the canonical version.
      'You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user\'s Claude Code settings.',
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
      TOOL_NAMES.ASK_USER_QUESTION,
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
      TOOL_NAMES.ASK_USER_QUESTION,
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
    getSystemPrompt: () => CLAUDE_CODE_GUIDE_SYSTEM_PROMPT,
  },
};

const AGENT_TYPES = new Set(
  Object.keys(AGENT_CONFIGS).filter((k) => {
    const cfg = AGENT_CONFIGS[k]!;
    return cfg.isEnabled?.() !== false;
  })
);

/**
 * Task state for background execution.
 */
interface TaskState {
  taskId: string;
  status: 'running' | 'completed' | 'error' | 'backgrounded';
  agentType: string;
  prompt: string;
  description: string;
  isBackgrounded: boolean;
  startTime: number;
  toolUseCount: number;
  tokenCount: number;
  outputFile: string;
  abortController: AbortController;
}

/**
 * Background signal map for Ctrl+B handling.
 * Original: yZ1 (backgroundSignalMap) in chunks.91.mjs
 */
const backgroundSignalMap = new Map<string, () => void>();

/**
 * Active task states.
 */
const activeTasks = new Map<string, TaskState>();

/**
 * Output file registry.
 * Original: OKA (registerOutputFile) in chunks.91.mjs
 */
const outputFileRegistry = new Map<string, string>();

// ============================================
// Input/Output Schemas
// ============================================

/**
 * Task tool input schema.
 */
const taskInputSchema = z.object({
  prompt: z.string().describe('The task for the agent to perform'),
  description: z.string().describe('A short (3-5 word) description of the task'),
  subagent_type: z.string().describe('The type of specialized agent to use for this task'),
  model: z
    .enum(['sonnet', 'opus', 'haiku'])
    .optional()
    .describe('Optional model to use for this agent'),
  max_turns: z
    .number()
    .positive()
    .optional()
    .describe('Maximum number of agentic turns (API round-trips) before stopping'),
  run_in_background: z.boolean().optional().describe('Set to true to run this agent in the background'),
  resume: z.string().optional().describe('Optional agent ID to resume from'),
});

/**
 * Task tool output schema.
 */
const taskOutputSchema = z.object({
  taskId: z.string(),
  status: z.enum(['running', 'completed', 'error']),
  result: z.string().optional(),
  error: z.string().optional(),
  outputFile: z.string().optional(),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a task/agent ID.
 * Original: LS (generateSessionId) in chunks.86.mjs
 */
function generateAgentId(): string {
  return randomUUID();
}

/**
 * Sanitize agent ID.
 * Original: iz (sanitizeId) in chunks.113.mjs
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Get output file path for an agent.
 * Original: yb/aY (getOutputPath/formatOutputPath) in chunks.91.mjs
 */
function getOutputPath(agentId: string): string {
  const baseDir = process.env.CLAUDE_CODE_DATA_DIR || join(process.env.HOME || '/tmp', '.claude');
  const outputDir = join(baseDir, 'agents', 'output');

  // Ensure directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  return join(outputDir, `${agentId}.txt`);
}

/**
 * Register output file for an agent.
 * Original: OKA (registerOutputFile) in chunks.91.mjs
 */
function registerOutputFile(agentId: string, outputPath: string): void {
  outputFileRegistry.set(agentId, outputPath);

  // Create empty file
  writeFileSync(outputPath, '');
}

/**
 * Append to output file.
 * Original: g9A (appendToOutputFile) in chunks.121.mjs
 */
function appendToOutputFile(agentId: string, content: string): void {
  const outputPath = outputFileRegistry.get(agentId);
  if (outputPath) {
    appendFileSync(outputPath, content);
  }
}

/**
 * Resolve agent model.
 * Original: YA1 (resolveAgentModel) in chunks.113.mjs
 *
 * Priority:
 * 1. CLAUDE_CODE_SUBAGENT_MODEL env var
 * 2. Task tool model parameter
 * 3. Agent definition model
 * 4. "inherit" → parent model
 * 5. Default (sonnet)
 */
function resolveAgentModel(
  agentModel: BuiltInAgentModel,
  parentModel: string | undefined,
  taskModel: string | undefined
): string {
  // Environment override
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) {
    return process.env.CLAUDE_CODE_SUBAGENT_MODEL;
  }

  // Task tool parameter
  if (taskModel) {
    switch (taskModel) {
      case 'sonnet':
        return 'claude-sonnet-4-20250514';
      case 'opus':
        return 'claude-opus-4-20250514';
      case 'haiku':
        return 'claude-3-5-haiku-20241022';
      default:
        return taskModel;
    }
  }

  // Agent definition model
  if (agentModel && agentModel !== 'inherit') {
    switch (agentModel) {
      case 'sonnet':
        return 'claude-sonnet-4-20250514';
      case 'opus':
        return 'claude-opus-4-20250514';
      case 'haiku':
        return 'claude-3-5-haiku-20241022';
      default:
        return agentModel;
    }
  }

  // Inherit from parent or default
  return parentModel || 'claude-sonnet-4-20250514';
}

/**
 * Create fully backgrounded agent.
 * Original: L32 (createFullyBackgroundedAgent) in chunks.91.mjs
 *
 * For run_in_background: true - immediately backgrounded.
 */
function createFullyBackgroundedAgent(params: {
  agentId: string;
  description: string;
  prompt: string;
  agentType: string;
}): TaskState {
  const { agentId, description, prompt, agentType } = params;
  const outputPath = getOutputPath(sanitizeId(agentId));

  registerOutputFile(agentId, outputPath);

  const task: TaskState = {
    taskId: agentId,
    status: 'running',
    agentType,
    prompt,
    description,
    isBackgrounded: true, // Key: immediately backgrounded
    startTime: Date.now(),
    toolUseCount: 0,
    tokenCount: 0,
    outputFile: outputPath,
    abortController: new AbortController(),
  };

  activeTasks.set(agentId, task);
  return task;
}

/**
 * Create backgroundable agent (sync with Ctrl+B support).
 * Original: O32 (createBackgroundableAgent) in chunks.91.mjs
 *
 * For run_in_background: false - can be backgrounded via Ctrl+B.
 */
function createBackgroundableAgent(params: {
  agentId: string;
  description: string;
  prompt: string;
  agentType: string;
}): { taskId: string; backgroundSignal: Promise<void> } {
  const { agentId, description, prompt, agentType } = params;
  const outputPath = getOutputPath(sanitizeId(agentId));

  registerOutputFile(agentId, outputPath);

  const task: TaskState = {
    taskId: agentId,
    status: 'running',
    agentType,
    prompt,
    description,
    isBackgrounded: false, // Key: NOT backgrounded initially
    startTime: Date.now(),
    toolUseCount: 0,
    tokenCount: 0,
    outputFile: outputPath,
    abortController: new AbortController(),
  };

  activeTasks.set(agentId, task);

  // Create background signal promise
  let resolveBackground: () => void;
  const backgroundSignal = new Promise<void>((resolve) => {
    resolveBackground = resolve;
  });

  // Store resolver for Ctrl+B handler
  backgroundSignalMap.set(agentId, resolveBackground!);

  return {
    taskId: agentId,
    backgroundSignal,
  };
}

/**
 * Trigger background transition.
 * Original: M32 (triggerBackgroundTransition) in chunks.91.mjs
 *
 * Called when user presses Ctrl+B.
 */
function triggerBackgroundTransition(taskId: string): boolean {
  const task = activeTasks.get(taskId);
  if (!task || task.isBackgrounded) {
    return false;
  }

  // Mark as backgrounded
  task.isBackgrounded = true;
  task.status = 'backgrounded';

  // Resolve the background signal promise
  const resolveBackground = backgroundSignalMap.get(taskId);
  if (resolveBackground) {
    resolveBackground();
    backgroundSignalMap.delete(taskId);
  }

  return true;
}

/**
 * Update task progress.
 * Original: RI0 (updateTaskProgress) in chunks.91.mjs
 */
function updateTaskProgress(
  taskId: string,
  progress: { toolUseCount?: number; tokenCount?: number }
): void {
  const task = activeTasks.get(taskId);
  if (task && task.status === 'running') {
    if (progress.toolUseCount !== undefined) {
      task.toolUseCount = progress.toolUseCount;
    }
    if (progress.tokenCount !== undefined) {
      task.tokenCount = progress.tokenCount;
    }
  }
}

/**
 * Mark task as completed.
 * Original: oY + status update in chunks.91.mjs
 */
function markTaskCompleted(taskId: string, result: string): void {
  const task = activeTasks.get(taskId);
  if (task) {
    task.status = 'completed';
    appendToOutputFile(taskId, `\n\n=== Task Completed ===\n${result}`);
  }
}

/**
 * Mark task as error.
 */
function markTaskError(taskId: string, error: string): void {
  const task = activeTasks.get(taskId);
  if (task) {
    task.status = 'error';
    appendToOutputFile(taskId, `\n\n=== Task Error ===\n${error}`);
  }
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
    if (denied.has(t.name)) return false;
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

function extractTextFromContentBlocks(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  let out = '';
  for (const block of content) {
    if (block && typeof block === 'object' && (block as any).type === 'text') {
      out += String((block as any).text ?? '');
    }
  }
  return out;
}

async function runSubagentLoop(params: {
  agentId: string;
  prompt: string;
  agentConfig: AgentConfig;
  model: string;
  maxTurns?: number;
  abortSignal?: AbortSignal;
  toolContext: ToolContext;
  isAsync?: boolean;
}): Promise<string> {
  const {
    agentId,
    prompt,
    agentConfig,
    model,
    maxTurns = 10,
    abortSignal,
    toolContext,
    isAsync,
  } = params;

  const linkAbort = (signal: AbortSignal | undefined, controller: AbortController) => {
    if (!signal) return;
    if (signal.aborted) {
      controller.abort();
      return;
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  };

  const abortController = new AbortController();
  linkAbort(abortSignal, abortController);
  linkAbort(toolContext.abortSignal, abortController);

  const getAppState = toolContext.getAppState;
  const setAppState = toolContext.setAppState;
  const readFileState = toolContext.readFileState;

  const coreTools = adaptToolsForCore({
    allowedTools: agentConfig.tools,
    disallowedTools: agentConfig.disallowedTools,
    getAppState,
    setAppState,
    readFileState,
    agentId,
    sessionId: toolContext.sessionId,
    abortController,
  });

  const conversation: any[] = [];
  const coreToolUseContext: any = {
    getAppState,
    setAppState,
    readFileState,
    abortController,
    agentId,
    messages: conversation,
    options: {
      tools: coreTools,
      mainLoopModel: typeof toolContext.options?.model === 'string' ? (toolContext.options as any).model : undefined,
      debug: Boolean((toolContext.options as any)?.debug),
      verbose: Boolean((toolContext.options as any)?.verbose),
      isNonInteractiveSession: Boolean((toolContext.options as any)?.isNonInteractiveSession),
    },
  };

  const allowed = agentConfig.tools && agentConfig.tools.length > 0 && !agentConfig.tools.includes('*')
    ? new Set(agentConfig.tools)
    : null;
  const denied = new Set(agentConfig.disallowedTools || []);

  const canUseTool = async (tool: { name: string }) => {
    if (denied.has(tool.name)) return false;
    if (allowed && !allowed.has(tool.name)) return false;
    return true;
  };

  let resultText = '';
  let toolUseCount = 0;

  // 记录开头
  appendToOutputFile(agentId, `\n--- Subagent Started (${agentConfig.agentType}) ---\n`);

  for await (const ev of runCoreSubagentLoop({
    agentDefinition: {
      agentType: agentConfig.agentType,
      whenToUse: agentConfig.whenToUse,
      tools: agentConfig.tools,
      disallowedTools: agentConfig.disallowedTools,
      model: agentConfig.model,
      permissionMode: agentConfig.permissionMode,
      criticalSystemReminder_EXPERIMENTAL: agentConfig.criticalSystemReminder_EXPERIMENTAL,
      getSystemPrompt: () => agentConfig.getSystemPrompt(),
    } as any,
    promptMessages: [createCoreUserMessage({ content: prompt }) as any],
    toolUseContext: coreToolUseContext,
    canUseTool: async (tool: any, _input: any, _assistantMessage: any) => canUseTool(tool),
    querySource: isAsync ? 'background' : 'subagent',
    model,
    maxTurns,
    isAsync,
  } as any)) {
    if (!ev || typeof ev !== 'object') continue;

    // 持久化到 conversation（便于后续工具/上下文引用）
    conversation.push(ev as any);

    if ((ev as any).type === 'assistant') {
      const content = (ev as any).message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block?.type === 'text') {
            const t = String(block.text ?? '');
            resultText += t;
            appendToOutputFile(agentId, t);
          } else if (block?.type === 'tool_use') {
            toolUseCount += 1;
            updateTaskProgress(agentId, { toolUseCount });
            appendToOutputFile(agentId, `\n[Tool: ${String(block.name ?? 'unknown')}]\n`);
          }
        }
      } else {
        const t = extractTextFromContentBlocks(content);
        if (t) {
          resultText += t;
          appendToOutputFile(agentId, t);
        }
      }
    } else if ((ev as any).type === 'user') {
      // 将 tool_result 也写入输出，便于 debug（source 里也会记录 transcript）
      const blocks = (ev as any).message?.content;
      if (Array.isArray(blocks)) {
        for (const b of blocks) {
          if (b?.type === 'tool_result') {
            const text = extractTextFromContentBlocks(b.content);
            if (text) {
              appendToOutputFile(agentId, `\n[Tool Result]\n${text}\n`);
            }
          }
        }
      }
    } else if ((ev as any).type === 'attachment') {
      const att = (ev as any).attachment;
      if (att?.type === 'error' && att?.content) {
        appendToOutputFile(agentId, `\n[Attachment Error]\n${String(att.content)}\n`);
      }
    } else if ((ev as any).type === 'progress') {
      // 可选：将进度写入
      const p = (ev as any).progress;
      if (p && typeof p === 'object') {
        appendToOutputFile(agentId, `\n[Progress] ${JSON.stringify(p)}\n`);
      }
    }
  }

  updateTaskProgress(agentId, { toolUseCount });
  appendToOutputFile(agentId, `\n--- Subagent Finished (${agentConfig.agentType}) ---\n`);

  const final = resultText.trim();
  return final || `Agent "${agentConfig.agentType}" completed task.`;
}

// Export for Ctrl+B handling
export { triggerBackgroundTransition, activeTasks, backgroundSignalMap };

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
    // Check agent type is valid
    if (!AGENT_TYPES.has(input.subagent_type)) {
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

  async call(input, context) {
    const { prompt, description, subagent_type, model, max_turns, run_in_background, resume } =
      input;

    // Check if background tasks are disabled
    const disableBackground = process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS === 'true';

    try {
      // Get agent configuration
      const agentConfig = AGENT_CONFIGS[subagent_type];
      if (!agentConfig) {
        return toolError(`Unknown agent type: ${subagent_type}`);
      }

      // Generate or use provided agent ID
      const agentId = resume ? sanitizeId(resume) : generateAgentId();

      // Resolve model
      const resolvedModel = resolveAgentModel(
        agentConfig.model,
        typeof context.options?.model === 'string' ? context.options.model : undefined,
        model
      );

      // Handle resume case - load previous transcript
      if (resume) {
        // In a full implementation, this would load previous messages
        // For now, we just continue with the provided prompt
      }

      // Async execution path (run_in_background: true)
      if (run_in_background && !disableBackground) {
        const task = createFullyBackgroundedAgent({
          agentId,
          description,
          prompt,
          agentType: subagent_type,
        });

        // Start agent execution in background (non-blocking)
        runSubagentLoop({
          agentId,
          prompt,
          agentConfig,
          model: resolvedModel,
          maxTurns: max_turns,
          abortSignal: task.abortController.signal,
          toolContext: context,
          isAsync: true,
        })
          .then((result) => {
            markTaskCompleted(agentId, result);
          })
          .catch((error) => {
            markTaskError(agentId, error instanceof Error ? error.message : String(error));
          });

        // Return immediately with async_launched status
        const result: TaskOutput = {
          taskId: task.taskId,
          status: 'running',
          outputFile: task.outputFile,
        };

        return toolSuccess(result);
      }

      // Sync execution path (run_in_background: false)
      const { taskId, backgroundSignal } = createBackgroundableAgent({
        agentId,
        description,
        prompt,
        agentType: subagent_type,
      });

      const task = activeTasks.get(taskId)!;

      // Run agent loop with background detection
      try {
        // Use Promise.race to allow Ctrl+B interruption
        const agentPromise = runSubagentLoop({
          agentId: taskId,
          prompt,
          agentConfig,
          model: resolvedModel,
          maxTurns: max_turns,
          abortSignal: task.abortController.signal,
          toolContext: context,
          isAsync: false,
        });

        // Race between completion and background signal
        const raceResult = await Promise.race([
          agentPromise.then((result) => ({ type: 'completed' as const, result })),
          backgroundSignal.then(() => ({ type: 'background' as const })),
        ]);

        if (raceResult.type === 'background') {
          // User pressed Ctrl+B - switch to background execution
          // The agent continues running in the background

          const result: TaskOutput = {
            taskId,
            status: 'running',
            outputFile: task.outputFile,
          };

          return toolSuccess(result);
        }

        // Agent completed normally
        markTaskCompleted(taskId, raceResult.result);

        const result: TaskOutput = {
          taskId,
          status: 'completed',
          result: raceResult.result,
        };

        return toolSuccess(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        markTaskError(taskId, errorMessage);

        return toolError(`Agent execution failed: ${errorMessage}`);
      }
    } catch (error) {
      return toolError(`Failed to launch agent: ${(error as Error).message}`);
    }
  },

  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // Async launched - return immediately with output file info
    if (result.status === 'running') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [{
          type: 'text',
          text: `Async agent launched successfully.
agentId: ${result.taskId} (This is an internal ID for your use, do not mention it to the user unless they ask for it.)
output_file: ${result.outputFile || 'N/A'}

The agent is currently working in the background. You can continue with other tasks.
To check the agent's progress or retrieve its results, use the Read tool to read the output file, or use Bash with \`tail\` to see recent output.`,
        }],
      };
    }

    // Error case
    if (result.error) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: `Agent error: ${result.error}`,
        is_error: true,
      };
    }

    // Completed successfully
    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: [{
        type: 'text',
        text: result.result || 'Agent completed with no output.',
      }, {
        type: 'text',
        text: `\nagentId: ${result.taskId} (for resuming to continue this agent's work if needed)`,
      }],
    };
  },
});

// ============================================
// Export
// ============================================

// NOTE: TaskTool 已在声明处导出；避免重复导出。
