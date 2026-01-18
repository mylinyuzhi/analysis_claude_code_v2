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

// ============================================
// Constants
// ============================================

const MAX_RESULT_SIZE = 30000;
const BACKGROUND_HINT_DELAY = 3000; // 3 seconds before showing Ctrl+B hint

/**
 * Available agent types with their configurations.
 * Original: chunks.93.mjs - Agent definitions
 */
const AGENT_CONFIGS: Record<string, AgentConfig> = {
  'Bash': {
    agentType: 'Bash',
    whenToUse: 'Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.',
    tools: ['Bash'],
    model: 'inherit',
    forkContext: false,
  },
  'general-purpose': {
    agentType: 'general-purpose',
    whenToUse: 'General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks.',
    tools: ['*'], // All tools
    model: 'inherit',
    forkContext: true,
  },
  'statusline-setup': {
    agentType: 'statusline-setup',
    whenToUse: 'Use this agent to configure the user\'s Claude Code status line setting.',
    tools: ['Read', 'Edit'],
    model: 'haiku',
    forkContext: false,
  },
  'Explore': {
    agentType: 'Explore',
    whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns.',
    tools: ['Glob', 'Grep', 'Read', 'WebFetch', 'WebSearch'],
    model: 'haiku',
    forkContext: true,
  },
  'Plan': {
    agentType: 'Plan',
    whenToUse: 'Software architect agent for designing implementation plans.',
    tools: ['Glob', 'Grep', 'Read', 'WebFetch', 'WebSearch'],
    model: 'inherit',
    forkContext: true,
  },
  'claude-code-guide': {
    agentType: 'claude-code-guide',
    whenToUse: 'Use this agent when the user asks questions about Claude Code features, hooks, MCP servers, or the Agent SDK.',
    tools: ['Glob', 'Grep', 'Read', 'WebFetch', 'WebSearch'],
    model: 'haiku',
    forkContext: false,
  },
  'code-simplifier': {
    agentType: 'code-simplifier',
    whenToUse: 'Simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality.',
    tools: ['*'], // All tools
    model: 'inherit',
    forkContext: true,
  },
};

/**
 * Available agent types.
 */
const AGENT_TYPES = new Set(Object.keys(AGENT_CONFIGS));

/**
 * Agent configuration interface.
 */
interface AgentConfig {
  agentType: string;
  whenToUse: string;
  tools: string[];
  model: 'inherit' | 'sonnet' | 'opus' | 'haiku';
  forkContext: boolean;
}

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
  agentModel: string,
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
 * Original: $f (runAgentLoop) in chunks.113.mjs
 *
 * This is a simplified version that executes the agent's task.
 */
async function runSubagentLoop(params: {
  agentId: string;
  prompt: string;
  agentConfig: AgentConfig;
  model: string;
  maxTurns?: number;
  abortSignal?: AbortSignal;
}): Promise<string> {
  const { agentId, prompt, agentConfig, model, maxTurns = 10, abortSignal } = params;

  try {
    // Import the LLM API dynamically to avoid circular dependencies
    const { streamApiCall } = await import('@claudecode/core/llm-api');

    let result = '';
    let turnCount = 0;

    // Build system prompt based on agent type
    const systemPrompt = buildAgentSystemPrompt(agentConfig);

    // Simple agent loop - make API calls until done or max turns
    while (turnCount < maxTurns) {
      if (abortSignal?.aborted) {
        throw new Error('Agent execution aborted');
      }

      turnCount++;
      updateTaskProgress(agentId, { toolUseCount: turnCount });
      appendToOutputFile(agentId, `\n--- Turn ${turnCount} ---\n`);

      const request = {
        model,
        max_tokens: 8192,
        messages: [{ role: 'user' as const, content: prompt }],
        system: systemPrompt,
      };

      const generator = streamApiCall(request, {
        apiKey: process.env.ANTHROPIC_API_KEY || '',
      });

      for await (const streamResult of generator) {
        if (streamResult.type === 'assistant') {
          const content = streamResult.message.content;
          if (Array.isArray(content)) {
            for (const block of content) {
              if (block.type === 'text') {
                result += block.text;
                appendToOutputFile(agentId, block.text);
              } else if (block.type === 'tool_use') {
                // Log tool use
                appendToOutputFile(agentId, `\n[Tool: ${block.name}]\n`);
              }
            }
          }
        }
      }

      // For now, simple agents complete after one turn
      // A full implementation would continue based on tool_use blocks
      break;
    }

    return result || `Agent "${agentConfig.agentType}" completed task.`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    appendToOutputFile(agentId, `\n[Error: ${errorMessage}]\n`);
    throw error;
  }
}

/**
 * Build system prompt for agent type.
 */
function buildAgentSystemPrompt(config: AgentConfig): string {
  const basePrompt = `You are a specialized ${config.agentType} agent for Claude Code.

Your role: ${config.whenToUse}

Available tools: ${config.tools.join(', ')}

Guidelines:
- Focus on completing the assigned task efficiently
- Use the available tools appropriately
- Report your findings clearly and concisely
- If you encounter errors, explain them and suggest solutions`;

  return basePrompt;
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
- general-purpose: General-purpose agent for researching complex questions
- Explore: Fast agent specialized for exploring codebases
- Plan: Software architect agent for designing implementation plans
- claude-code-guide: Agent for questions about Claude Code features`;
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
        context.options?.model,
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

export { TaskTool };
