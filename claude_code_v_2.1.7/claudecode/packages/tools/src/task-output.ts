/**
 * @claudecode/tools - TaskOutput Tool
 *
 * Retrieves output from a running or completed task
 * (background shell, agent, or remote session).
 *
 * Reconstructed from chunks.119.mjs:1574-1760
 *
 * Key symbols:
 * - aHA → TASK_OUTPUT (tool name constant)
 * - XK1 → TaskOutputTool (tool object)
 */

import { z } from 'zod';
import {
  createTool,
  validationSuccess,
  validationError,
  permissionAllow,
  toolSuccess,
  toolError,
} from './base.js';
import type { ToolContext } from './types.js';
import { TOOL_NAMES } from './types.js';

// ============================================
// Constants
// ============================================

const MAX_TIMEOUT_MS = 600000; // 10 minutes
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

// ============================================
// Task Types
// ============================================

/**
 * Task type enum.
 */
export type TaskType = 'local_bash' | 'local_agent' | 'remote_agent';

/**
 * Task status.
 */
export type TaskStatus = 'running' | 'completed' | 'failed' | 'cancelled';

// ============================================
// Input Types
// ============================================

/**
 * TaskOutput input.
 */
export interface TaskOutputInput {
  /** The task ID to get output from */
  task_id: string;
  /** Whether to wait for completion (default: true) */
  block?: boolean;
  /** Max wait time in ms (max: 600000, default: 30000) */
  timeout?: number;
}

/**
 * TaskOutput output.
 */
export interface TaskOutputOutput {
  /** The task ID */
  task_id: string;
  /** The type of task */
  task_type: TaskType;
  /** Current status */
  status: TaskStatus;
  /** Task description */
  description: string;
  /** Output content */
  output: string;
  /** Exit code (for local_bash) */
  exitCode?: number;
  /** Original prompt (for agents) */
  prompt?: string;
  /** Final result (for agents) */
  result?: string;
  /** Error message (for agents) */
  error?: string;
}

// ============================================
// Input Schema
// ============================================

/**
 * TaskOutput input schema.
 * Original: ap5 in chunks.119.mjs:1754-1758
 */
const taskOutputInputSchema = z.object({
  task_id: z
    .string()
    .describe('The task ID to get output from'),
  block: z
    .boolean()
    .default(true)
    .describe('Whether to wait for completion'),
  timeout: z
    .number()
    .min(0)
    .max(MAX_TIMEOUT_MS)
    .default(DEFAULT_TIMEOUT_MS)
    .describe('Max wait time in ms'),
});

// ============================================
// Output Schema
// ============================================

const taskOutputOutputSchema = z.object({
  task_id: z.string(),
  task_type: z.enum(['local_bash', 'local_agent', 'remote_agent']),
  status: z.string(),
  description: z.string(),
  output: z.string(),
  exitCode: z.number().optional(),
  prompt: z.string().optional(),
  result: z.string().optional(),
  error: z.string().optional(),
});

// ============================================
// TaskOutput Tool
// ============================================

/**
 * TaskOutput tool implementation.
 * Original: XK1 in chunks.119.mjs:1574-1760
 *
 * This tool retrieves output from background tasks:
 * - local_bash: Background shell commands
 * - local_agent: Background subagents
 * - remote_agent: Remote agent sessions
 */
export const TaskOutputTool = createTool<TaskOutputInput, TaskOutputOutput>({
  name: TOOL_NAMES.TASK_OUTPUT,
  strict: false,

  async description() {
    return `- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`;
  },

  async prompt() {
    return '';
  },

  inputSchema: taskOutputInputSchema,
  outputSchema: taskOutputOutputSchema,

  isEnabled() {
    return true;
  },

  isConcurrencySafe() {
    // Safe for concurrent execution - read-only operation
    return true;
  },

  isReadOnly() {
    return true;
  },

  async checkPermissions(input) {
    // Always allow - user can view their own tasks
    return permissionAllow(input);
  },

  async validateInput(input, context) {
    const { task_id, timeout } = input;

    if (!task_id || task_id.trim().length === 0) {
      return validationError('task_id is required', 1);
    }

    if (timeout !== undefined && (timeout < 0 || timeout > MAX_TIMEOUT_MS)) {
      return validationError(
        `timeout must be between 0 and ${MAX_TIMEOUT_MS}ms`,
        2
      );
    }

    return validationSuccess();
  },

  async call(input, context) {
    const {
      task_id,
      block = true,
      timeout = DEFAULT_TIMEOUT_MS,
    } = input;

    try {
      // Get task manager from context
      const taskManager = (context as any).taskManager;
      const appState = await context.getAppState?.();
      const tasks = (appState as any)?.tasks;

      // Try to find the task
      let task: any = null;

      if (taskManager && typeof taskManager.getTask === 'function') {
        task = await taskManager.getTask(task_id);
      } else if (tasks) {
        task = tasks.get?.(task_id) || tasks[task_id];
      }

      if (!task) {
        return toolError(`Task not found: ${task_id}`);
      }

      // Determine task type
      const taskType: TaskType = task.type || 'local_bash';

      // If blocking, wait for completion
      if (block && task.status === 'running') {
        const waitResult = await waitForTask(task, timeout);
        if (waitResult.timedOut) {
          return toolSuccess({
            task_id,
            task_type: taskType,
            status: 'running',
            description: task.description || '',
            output: task.output || '',
            prompt: task.prompt,
          });
        }
      }

      // Get task output based on type
      switch (taskType) {
        case 'local_bash':
          return toolSuccess({
            task_id,
            task_type: taskType,
            status: task.status || 'completed',
            description: task.description || '',
            output: task.output || task.stdout || '',
            exitCode: task.exitCode,
          });

        case 'local_agent':
        case 'remote_agent':
          return toolSuccess({
            task_id,
            task_type: taskType,
            status: task.status || 'completed',
            description: task.description || '',
            output: task.output || '',
            prompt: task.prompt,
            result: task.result,
            error: task.error,
          });

        default:
          return toolSuccess({
            task_id,
            task_type: taskType,
            status: task.status || 'unknown',
            description: task.description || '',
            output: task.output || '',
          });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolError(`Failed to get task output: ${message}`);
    }
  },

  /**
   * Map tool result to API format.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    const lines: string[] = [
      `Task: ${result.task_id}`,
      `Type: ${result.task_type}`,
      `Status: ${result.status}`,
    ];

    if (result.description) {
      lines.push(`Description: ${result.description}`);
    }

    if (result.exitCode !== undefined) {
      lines.push(`Exit Code: ${result.exitCode}`);
    }

    if (result.output) {
      lines.push('', 'Output:', result.output);
    }

    if (result.result) {
      lines.push('', 'Result:', result.result);
    }

    if (result.error) {
      lines.push('', 'Error:', result.error);
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: lines.join('\n'),
    };
  },
});

// ============================================
// Helper Functions
// ============================================

/**
 * Wait for a task to complete with timeout.
 */
async function waitForTask(
  task: any,
  timeoutMs: number
): Promise<{ timedOut: boolean }> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // Check if task is done
      if (task.status !== 'running') {
        clearInterval(checkInterval);
        resolve({ timedOut: false });
        return;
      }

      // Check for timeout
      if (Date.now() - startTime >= timeoutMs) {
        clearInterval(checkInterval);
        resolve({ timedOut: true });
        return;
      }
    }, 100);

    // Also listen for completion if task has promise
    if (task.promise && typeof task.promise.then === 'function') {
      task.promise.then(() => {
        clearInterval(checkInterval);
        resolve({ timedOut: false });
      }).catch(() => {
        clearInterval(checkInterval);
        resolve({ timedOut: false });
      });
    }
  });
}

// ============================================
// Export
// ============================================

export { TaskOutputTool };
