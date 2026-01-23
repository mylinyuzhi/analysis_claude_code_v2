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
  getProjectDir,
  getSessionId,
  parseSessionLogFile,
  type SessionLogEntry,
} from '@claudecode/shared';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import {
  type AgentDefinition,
  getBuiltInAgents,
  getAllAgents,
  resolveAgentModel,
  AGENT_TYPES,
  filterAgentsByPermission,
  findDenyRule,
  isBuiltInAgent,
  getQuerySource,
} from './agents.js';
import type { TaskInput, TaskOutput, ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

import {
  type Tool as CoreTool,
  type ToolUseContext as CoreToolUseContext,
  type ToolResult as CoreToolResult,
  ALWAYS_EXCLUDED_TOOLS,
} from '@claudecode/core/tools';
import {
  runSubagentLoop as runCoreSubagentLoop,
} from '@claudecode/core/agent-loop';
import { createUserMessage as createCoreUserMessage } from '@claudecode/core/message';
import {
  aggregateAsyncAgentExecution,
  createBackgroundableAgent,
  createFullyBackgroundedAgent,
  markTaskCompleted as markCoreTaskCompleted,
  markTaskFailed as markCoreTaskFailed,
  updateTaskProgress as updateCoreTaskProgress,
  generateTaskId,
} from '@claudecode/integrations/background-agents';

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
 * Get environment info for subagent.
 * Original: rY9 in chunks.146.mjs:2739-2766
 */
async function getEnvironmentInfo(model: string, additionalWorkingDirs: string[]): Promise<string> {
  const isGit = existsSync(join(process.cwd(), '.git'));
  const platform = process.platform;
  const osVersion = 'unknown'; // Simplified (original calls uname -sr)
  const today = new Date().toLocaleDateString();
  
  const modelInfo = `You are powered by the model ${model}.`;
  const dirsInfo = additionalWorkingDirs.length > 0 
    ? `Additional working directories: ${additionalWorkingDirs.join(', ')}\n` 
    : '';

  let cutoff = '';
  if (model.includes('claude-3-7')) cutoff = '\n\nAssistant knowledge cutoff is May 2025.';
  else if (model.includes('claude-3-5')) cutoff = '\n\nAssistant knowledge cutoff is January 2025.';

  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${process.cwd()}
Is directory a git repo: ${isGit ? 'Yes' : 'No'}
${dirsInfo}Platform: ${platform}
OS Version: ${osVersion}
Today's date: ${today}
</env>
${modelInfo}${cutoff}
`;
}

/**
 * Token estimation helper.
 */
function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Normalize task usage helper.
 */
function normalizeTaskUsage(usage: any): any {
  if (!usage) return { input_tokens: 0, output_tokens: 0 };
  return {
    input_tokens: usage.input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
    cache_creation_input_tokens: usage.cache_creation_input_tokens ?? null,
    cache_read_input_tokens: usage.cache_read_input_tokens ?? null,
  };
}

/**
 * Total tokens from usage helper.
 */
function totalTokensFromUsage(usage: any): number {
  if (!usage) return 0;
  return (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0);
}

/**
 * Process system prompt.
 * Original: pkA in chunks.146.mjs:2781-2791
 */
async function processSystemPrompt(prompt: string, model: string, additionalWorkingDirs: string[]): Promise<string[]> {
  const envInfo = await getEnvironmentInfo(model, additionalWorkingDirs);
  const notes = `

Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication with the user the assistant MUST avoid using emojis.
- Do not use a colon before tool calls. Text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period.`;

  return [prompt, notes, envInfo];
}

// ============================================
// prepareForkMessages
// Original: I52 in chunks.113.mjs:138
// ============================================
function prepareForkMessages(prompt: string, toolUseMessage: any): any[] {
  const metaBlock = createCoreUserMessage({ content: prompt }) as any;
  const toolUseBlock = toolUseMessage.message.content.find((block: any) => {
    if (block.type !== 'tool_use' || block.name !== TOOL_NAMES.TASK) return false;
    return 'prompt' in block.input && block.input.prompt === prompt;
  });

  if (!toolUseBlock) {
    // In original code, k() is used for logging
    return [metaBlock];
  }

  const clonedMessage = {
    ...toolUseMessage,
    uuid: randomUUID(), // Original uses oZ5()
    message: {
      ...toolUseMessage.message,
      content: [toolUseBlock],
    },
  };

  const forkHeader = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE: 
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`;

  const subAgentEnteredResult = {
    status: 'sub_agent_entered',
    description: 'Entered sub-agent context',
    message: forkHeader,
  };

  const toolResultMessage = createCoreUserMessage({
    content: [{
      type: 'tool_result',
      tool_use_id: toolUseBlock.id,
      content: [{
        type: 'text',
        text: forkHeader,
      }],
    }],
    // @ts-ignore
    toolUseResult: subAgentEnteredResult,
  }) as any;

  return [clonedMessage, toolResultMessage, metaBlock];
}

// ============================================
// sanitizeId
// Original: iz in chunks.113.mjs:123
// ============================================
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-]/g, '');
}

// ============================================
// formatAgentResult
// Original: uz0 in chunks.113.mjs:187
// ============================================
function formatAgentResult(messages: any[], agentId: string, metadata: {
  prompt: string;
  resolvedAgentModel: string;
  isBuiltInAgent: boolean;
  startTime: number;
}): any {
  const lastAssistantMessage = messages.slice().reverse().find((m) => m.type === 'assistant');
  if (!lastAssistantMessage) throw new Error("No assistant messages found");

  const content = lastAssistantMessage.message.content.filter((c: any) => c.type === 'text');
  const usage = normalizeTaskUsage(lastAssistantMessage.message.usage);
  const totalTokens = totalTokensFromUsage(usage);
  
  // Count tool uses: Jf5(A)
  let totalToolUses = 0;
  for (const msg of messages) {
    if (msg.type === 'assistant') {
      for (const block of msg.message.content) {
        if (block.type === 'tool_use') totalToolUses++;
      }
    }
  }

  return {
    agentId,
    content,
    totalDurationMs: Date.now() - metadata.startTime,
    totalTokens,
    totalToolUseCount: totalToolUses,
    usage: lastAssistantMessage.message.usage,
  };
}

// ============================================
// generateSessionId
// Original: LS in chunks.113.mjs:162
// ============================================
function generateSessionId(): string {
  // Original: return "a" + hG5(3).toString("hex")
  // hG5(3) is 3 random bytes -> 6 hex chars
  const randomHex = randomUUID().replace(/-/g, '').substring(0, 6);
  return `a${randomHex}`;
}

// ============================================
// getParentSessionId
// Original: gP2 in chunks.113.mjs:172
// ============================================
function getParentSessionId(): string | undefined {
  // Original is an empty function returning undefined
  return undefined;
}

/**
 * Run subagent loop.
 * Original: $f (runSubagentLoop) in chunks.113.mjs:179-187
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

// ============================================
// reconstructChain
// Original: F$A in chunks.148.mjs:1102-1107
// ============================================
function reconstructChain(messages: Map<string, SessionLogEntry>, leaf: SessionLogEntry): SessionLogEntry[] {
  const chain: SessionLogEntry[] = [];
  let current: SessionLogEntry | undefined = leaf;
  while (current) {
    chain.unshift(current);
    current = current.parentUuid ? messages.get(current.parentUuid) : undefined;
  }
  return chain;
}

// ============================================
// getSubagentTranscriptPath
// Original: yb in chunks.148.mjs:692-696
// ============================================
function getSubagentTranscriptPath(agentId: string): string {
  // Original uses getProjectsRoot(), getSessionId(), "subagents", `agent-${agentId}.jsonl`
  // We'll use the shared utility if available, or reproduce it.
  const projectDir = getProjectDir(process.cwd());
  const sessionId = getSessionId();
  return join(projectDir, sessionId, 'subagents', `agent-${agentId}.jsonl`);
}

// ============================================
// loadResumeMessages
// Original: bD1 in chunks.148.mjs:1526-1550
// ============================================
async function loadResumeMessages(agentId: string): Promise<any[]> {
  const transcriptPath = getSubagentTranscriptPath(agentId);
  if (!existsSync(transcriptPath)) {
    return [];
  }

  try {
    const { messages: msgMap } = await parseSessionLogFile(transcriptPath);
    const sidechainMessages = Array.from(msgMap.values()).filter(
      (m) => m.agentId === agentId && m.isSidechain
    );
    
    if (sidechainMessages.length === 0) return [];

    const parentUuids = new Set(sidechainMessages.map((m) => m.parentUuid));
    const leaf = sidechainMessages.filter((m) => !parentUuids.has(m.uuid)).sort((a, b) => 
      new Date(String(b.timestamp)).getTime() - new Date(String(a.timestamp)).getTime()
    )[0];

    if (!leaf) return [];

    return reconstructChain(msgMap, leaf)
      .filter((m) => m.agentId === agentId)
      .map(({ isSidechain, parentUuid, ...rest }) => rest.content);
  } catch {
    return [];
  }
}

// ============================================
// Task Tool
// ============================================

// ============================================
// formatAgentTools
// Original: fG5 in chunks.92.mjs:535-542
// ============================================
function formatAgentTools(agent: any): string {
  const { tools, disallowedTools } = agent;
  const hasTools = tools && tools.length > 0;
  const hasDisallowed = disallowedTools && disallowedTools.length > 0;

  if (hasTools && hasDisallowed) {
    const disallowedSet = new Set(disallowedTools);
    const filtered = tools.filter((t: string) => !disallowedSet.has(t));
    if (filtered.length === 0) return 'None';
    return filtered.join(', ');
  } else if (hasTools) {
    if (tools[0] === '*') return 'All tools';
    return tools.join(', ');
  } else if (hasDisallowed) {
    return `All tools except ${disallowedTools.join(', ')}`;
  }
  return 'All tools';
}

// ============================================
// generateTaskToolPrompt
// Original: O82 in chunks.92.mjs:544-617
// ============================================
async function generateTaskToolPrompt(availableAgents: any[]): Promise<string> {
  const agentDescriptions = availableAgents
    .map((agent) => {
      let properties = '';
      if (agent?.forkContext) {
        properties = 'Properties: access to current context; ';
      }
      const toolsList = formatAgentTools(agent);
      return `- ${agent.agentType}: ${agent.whenToUse} (${properties}Tools: ${toolsList})`;
    })
    .join('\n');

  const disableBackground = process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS === 'true';

  return `Launch a new agent to handle complex, multi-step tasks autonomously. 

The Task tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${agentDescriptions}

When using the Task tool, you must specify a subagent_type parameter to select which agent type to use.

When NOT to use the Task tool:
- If you want to read a specific file path, use the Read or Glob tool instead of the Task tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the Glob tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the Read tool instead of the Task tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above


Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.${
    !disableBackground
      ? '\n- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, the tool result will include an output_file path. To check on the agent\'s progress or retrieve its results, use the Read tool to read the output file, or use Bash with `tail` to see recent output. You can continue working while background agents run.'
      : ''
  }
- Agents can be resumed using the \`resume\` parameter by passing the agent ID from a previous invocation. When resumed, the agent continues with its full previous context preserved. When NOT resuming, each invocation starts fresh and you should provide a detailed task description with all necessary context.
- When the agent is done, it will return a single message back to you along with its agent ID. You can use this ID to resume the agent later if needed for follow-up work.
- Provide clear, detailed prompts so the agent can work autonomously and return exactly the information you need.
- Agents with "access to current context" can see the full conversation history before the tool call. When using these agents, you can write concise prompts that reference earlier context (e.g., "investigate the error discussed above") instead of repeating information. The agent will receive all prior messages and understand the context.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple Task tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.

Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent when to respond to user greetings with a friendly joke
</example_agent_description>

<example>
user: "Please write a function that checks if a number is prime"
assistant: Sure let me write a function that checks if a number is prime
assistant: First let me use the Write tool to write a function that checks if a number is prime
assistant: I'm going to use the Write tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a significant piece of code was written and the task was completed, now use the test-runner agent to run the tests
</commentary>
assistant: Now let me use the test-runner agent to run the tests
assistant: Uses the Task tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the Task tool to launch the greeting-responder agent"
</example>
`;
}

/**
 * Task tool implementation.
 * Original: xVA (TaskTool) in chunks.113.mjs:74-405
 */
export const TaskTool = createTool<TaskInput, TaskOutput>({
  name: TOOL_NAMES.TASK,
  maxResultSizeChars: MAX_RESULT_SIZE,

  async description() {
    return 'Launch a new task';
  },

  async prompt(context) {
    const options = (context as any).options;
    const defs = options?.agentDefinitions as any;
    const activeAgents = defs?.activeAgents ?? [];
    
    // Original: prompt in chunks.113.mjs:75-81
    const appState = await (context as any).getAppState?.() || {};
    const filteredAgents = filterAgentsByPermission(activeAgents, appState.toolPermissionContext || {}, TOOL_NAMES.TASK);
    return await generateTaskToolPrompt(filteredAgents);
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
      // Original: call in chunks.113.mjs:99-111
      const appState = await context.getAppState();
      const permissionMode = appState.toolPermissionContext.mode;
      const agentDefs = (context.options as any)?.agentDefinitions as any;
      const activeAgents = agentDefs?.activeAgents ?? [];
      const filteredAgents = filterAgentsByPermission(activeAgents, appState.toolPermissionContext, TOOL_NAMES.TASK);
      
      let selectedAgent = filteredAgents.find((a) => a.agentType === subagent_type);
      
      if (!selectedAgent) {
        const allAgents = agentDefs?.allAgents ?? activeAgents;
        const existsButDenied = allAgents.some((a: any) => a.agentType === subagent_type);
        if (existsButDenied) {
          const denyRule = findDenyRule(appState.toolPermissionContext, TOOL_NAMES.TASK, subagent_type);
          const source = denyRule?.source ?? 'settings';
          throw new Error(`Agent type '${subagent_type}' has been denied by permission rule '${TOOL_NAMES.TASK}(${subagent_type})' from ${source}.`);
        }
        throw new Error(`Agent type '${subagent_type}' not found. Available agents: ${filteredAgents.map((a) => a.agentType).join(', ')}`);
      }

      // Original: YA1 in chunks.113.mjs:113
      const resolvedModel = resolveAgentModel(selectedAgent.model, (context.options as any).mainLoopModel, model, permissionMode);

      const agentId = resume ? sanitizeId(resume) : generateSessionId();
      const resumeMessages = resume ? await loadResumeMessages(agentId) : undefined;
      
      // Original: forkContext in chunks.113.mjs:127
      const forkContextMessages = selectedAgent.forkContext ? (context as any).messages : undefined;

      const startTime = Date.now();

      // Original: chunks.113.mjs:130-137 (getSystemPrompt + pkA)
      let systemPrompt: string[] | undefined;
      try {
        const additionalWorkingDirs = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys());
        const baseSystemPrompt = selectedAgent.getSystemPrompt({ toolUseContext: context });
        systemPrompt = await processSystemPrompt(baseSystemPrompt, resolvedModel, additionalWorkingDirs);
      } catch (err) {
        // Fallback or log
      }

      // Original: prepareForkMessages in chunks.113.mjs:138
      // Note: we need the message that contains this tool use.
      // Assuming context.messages contains current conversation.
      const currentMessage = (context as any).messages?.find((m: any) => 
        m.type === 'assistant' && m.message?.content?.some((c: any) => c.type === 'tool_use' && c.id === _toolUseId)
      );

      const promptMessages = (selectedAgent.forkContext && currentMessage)
        ? prepareForkMessages(prompt, currentMessage)
        : [createCoreUserMessage({ content: prompt }) as any];

      const metadataObj = {
        prompt,
        resolvedAgentModel: resolvedModel,
        isBuiltInAgent: isBuiltInAgent(selectedAgent),
        startTime,
      };

      const loopOptions = {
        agentDefinition: selectedAgent,
        promptMessages: [
          ...(resumeMessages || []),
          ...promptMessages,
        ],
        toolUseContext: context,
        canUseTool: async (tool: any, input: any, assistantMessage: any) => {
          return canUseToolFromRunner ? await canUseToolFromRunner(tool, input, assistantMessage) : true;
        },
        forkContextMessages,
        querySource: (context.options as any)?.querySource ?? getQuerySource(selectedAgent.agentType, isBuiltInAgent(selectedAgent)),
        model: resolvedModel,
        maxTurns: max_turns ?? DEFAULT_MAX_TURNS,
        isAsync: run_in_background === true && !disableBackground,
        override: systemPrompt ? { systemPrompt } : undefined,
      };

      // run_in_background: true -> immediate async
      // Original: chunks.113.mjs:161-208
      if (run_in_background === true && !disableBackground) {
        const task = createFullyBackgroundedAgent({
          agentId,
          description,
          prompt,
          selectedAgent,
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
              allowedTools: selectedAgent.tools,
              disallowedTools: selectedAgent.disallowedTools,
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
          ...loopOptions,
          toolUseContext: coreToolUseContext,
          isAsync: true,
          override: {
            ...loopOptions.override,
            agentId,
            abortController: (task as any).abortController,
          },
        } as any)[Symbol.asyncIterator]();

        // Aggregate in background
        aggregateAsyncAgentExecution(
          messageGenerator,
          agentId,
          context.setAppState as any,
          () => {},
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

      // Foreground path
      // Original: chunks.113.mjs:210-356
      let backgroundSignal: Promise<void> | undefined;
      let taskId: string | undefined;
      if (!disableBackground) {
        const created = createBackgroundableAgent({
          agentId,
          description,
          prompt,
          selectedAgent,
          setAppState: context.setAppState as any,
          cwd: context.getCwd(),
        });
        taskId = agentId;
        backgroundSignal = created.backgroundSignal;
      }

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
              allowedTools: selectedAgent.tools,
              disallowedTools: selectedAgent.disallowedTools,
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
          ...loopOptions,
          toolUseContext: coreToolUseContext,
          isAsync: false,
          override: {
            ...loopOptions.override,
            agentId,
            abortController: coreToolUseContext.abortController,
          },
        } as any)[Symbol.asyncIterator]();
      })();

      const it = await iterator;
      const collected: any[] = [];
      let toolUseCount = 0;
      let tokenCount = 0;
      let estimatedTokenCount = 0;
      let lastAssistantUsage: unknown | undefined;

      const updateProgress = () => {
        updateCoreTaskProgress(agentId, {
          toolUseCount,
          tokenCount,
          // recentActivities and lastActivity would be calculated here MI0(AA)
        } as any, context.setAppState as any);
      };

      const handleValue = (value: any) => {
        collected.push(value);
        if (value && typeof value === 'object' && value.type === 'assistant') {
          const blocks = value.message?.content;
          if (Array.isArray(blocks)) {
            for (const b of blocks) {
              if (b?.type === 'tool_use') toolUseCount += 1;
              if (b?.type === 'text') {
                estimatedTokenCount += estimateTokensFromText(String(b.text ?? ''));
              }
            }
          }
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

          if (raced.kind === 'background' && taskId) {
            const state = (await context.getAppState()) as any;
            const taskObj = state?.tasks?.[agentId];
            const abortSignal = taskObj?.abortController?.signal;
            aggregateAsyncAgentExecution(
              it,
              agentId,
              context.setAppState as any,
              () => {},
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

        const result = formatAgentResult(collected, agentId, metadataObj);
        markCoreTaskCompleted(agentId, true, context.setAppState as any);

        return toolSuccess({
          status: 'completed',
          prompt,
          ...result,
        } as any);
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
    // Original: mapToolResultToToolResultBlockParam in chunks.113.mjs:375-397
    if ((result as any).status === 'async_launched') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [{
          type: 'text',
          text: `Async agent launched successfully.
agentId: ${(result as any).agentId} (This is an internal ID for your use, do not mention it to the user. You can use this ID to resume the agent later if needed.)
output_file: ${(result as any).outputFile}
The agent is currently working in the background. If you have other tasks you should continue working on them now.
To check on the agent's progress or retrieve its results, use the Read tool to read the output file, or use Bash with \`tail\` to see recent output.`,
        }],
      };
    }

    if ((result as any).status === 'completed') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [...((result as any).content || []), {
          type: 'text',
          text: `agentId: ${(result as any).agentId} (for resuming to continue this agent's work if needed)`,
        }],
      } as any;
    }

    throw new Error(`Unexpected agent tool result status: ${(result as any).status}`);
  },
});

// ============================================
// Export
// ============================================

// NOTE: TaskTool 已在声明处导出；避免重复导出。
