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

import {
  formatOutputPath,
  getTaskOutputContent,
} from '@claudecode/integrations/background-agents';

// ============================================
// Constants
// ============================================

const MAX_TIMEOUT_MS = 600000; // 10 minutes
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

// Source: np5() reads TASK_MAX_OUTPUT_LENGTH
const DEFAULT_MAX_OUTPUT_LENGTH = 30000;

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
export type TaskStatus = 'running' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'killed';

type RetrievalStatus = 'success' | 'timeout' | 'not_ready';

interface TaskOutputTask {
  task_id: string;
  task_type: TaskType;
  status: string;
  description: string;
  output: string;
  exitCode?: number | null;
  prompt?: string;
  result?: string;
  error?: string;
}

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
  retrieval_status: RetrievalStatus;
  task: TaskOutputTask | null;
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
  retrieval_status: z.enum(['success', 'timeout', 'not_ready']),
  task: z
    .object({
      task_id: z.string(),
      task_type: z.enum(['local_bash', 'local_agent', 'remote_agent']),
      status: z.string(),
      description: z.string(),
      output: z.string(),
      exitCode: z.number().nullable().optional(),
      prompt: z.string().optional(),
      result: z.string().optional(),
      error: z.string().optional(),
    })
    .nullable(),
});

function readTaskMaxOutputLength(): number {
  // Source: Hb0.validate in claude_code_v_2.1.7/source/chunks.1.mjs:2143-2167
  const raw = process.env.TASK_MAX_OUTPUT_LENGTH;
  if (!raw) return DEFAULT_MAX_OUTPUT_LENGTH;

  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) {
    return DEFAULT_MAX_OUTPUT_LENGTH;
  }

  if (n > 150000) {
    // Source np5() logs only on capped
    console.warn(`TASK_MAX_OUTPUT_LENGTH Capped from ${n} to 150000`);
    return 150000;
  }

  return n;
}

function truncateOutput(content: string, taskId: string): { content: string; wasTruncated: boolean } {
  const maxLen = readTaskMaxOutputLength();
  if (content.length <= maxLen) return { content, wasTruncated: false };

  // Source: bbA uses aY(taskId) (output file path) in the header.
  const hint = `[Truncated. Full output: ${formatOutputPath(taskId)}]\n\n`;
  const remaining = Math.max(0, maxLen - hint.length);
  return {
    content: hint + content.slice(-remaining),
    wasTruncated: true,
  };
}

function setTaskNotified(setAppState: any, taskId: string): void {
  if (typeof setAppState !== 'function') return;
  setAppState((state: any) => {
    const t = state?.tasks?.[taskId];
    if (!t) return state;
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...t,
          notified: true,
        },
      },
    };
  });
}

async function waitForTaskCompletion(
  taskId: string,
  getAppState: () => Promise<any>,
  timeoutMs: number,
  abortController?: AbortController
): Promise<any | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (abortController?.signal.aborted) {
      throw new Error('aborted');
    }
    const t = (await getAppState())?.tasks?.[taskId];
    if (!t) return null;
    if (t.status !== 'running' && t.status !== 'pending') return t;
    await new Promise((r) => setTimeout(r, 100));
  }
  return (await getAppState())?.tasks?.[taskId] ?? null;
}

/**
 * Convert in-memory task state to TaskOutput response shape.
 *
 * Source: YK1 in claude_code_v_2.1.7/source/chunks.119.mjs:1605-1632
 */
function formatTaskOutputForTool(task: any, cwd?: string): TaskOutputTask {
  const id: string = task?.id;
  const type: TaskType = task?.type;

  const outputContent = getTaskOutputContent(id, cwd);
  const base = {
    task_id: id,
    task_type: type,
    status: task?.status,
    description: task?.description,
    output: outputContent,
  } as TaskOutputTask;

  if (type === 'local_bash') {
    return {
      ...base,
      exitCode: task?.result?.code ?? null,
    };
  }

  if (type === 'local_agent') {
    return {
      ...base,
      prompt: task?.prompt,
      result: outputContent,
      error: task?.error,
    };
  }

  if (type === 'remote_agent') {
    return {
      ...base,
      prompt: task?.command,
    };
  }

  return base;
}

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
    // Source: chunks.119.mjs:1767-1769
    return 'Retrieves output from a running or completed task';
  },

  async prompt() {
    // Source: chunks.119.mjs:1785-1792
    return `- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`;
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
    // Source: chunks.119.mjs:1794-1811
    const taskId = input.task_id;
    if (!taskId) {
      return validationError('Task ID is required', 1);
    }
    const state = await (context as any).getAppState?.();
    if (!state?.tasks?.[taskId]) {
      return validationError(`No task found with ID: ${taskId}`, 2);
    }
    return validationSuccess();
  },

  async call(input, context, _toolUseId, _metadata, progressCallback) {
    const {
      task_id,
      block = true,
      timeout = DEFAULT_TIMEOUT_MS,
    } = input;

    try {
      // Source: tasks live in appState.tasks, keyed by task_id
      const appState = await (context as any).getAppState?.();
      const task = appState?.tasks?.[task_id];
      if (!task) throw new Error(`No task found with ID: ${task_id}`);

      const cwd = (context as any).getCwd ? (context as any).getCwd() : process.cwd();

      // Non-blocking
      if (!block) {
        if (task.status !== 'running' && task.status !== 'pending') {
          setTaskNotified((context as any).setAppState, task_id);
          return toolSuccess({
            retrieval_status: 'success',
            task: formatTaskOutputForTool(task, cwd),
          });
        }
        return toolSuccess({
          retrieval_status: 'not_ready',
          task: formatTaskOutputForTool(task, cwd),
        });
      }

      // Blocking: emit waiting progress event
      if (typeof progressCallback === 'function') {
        progressCallback({
          toolUseID: `task-output-waiting-${Date.now()}`,
          data: {
            type: 'waiting_for_task',
            taskDescription: task.description,
            taskType: task.type,
          },
        });
      }

      const finished = await waitForTaskCompletion(
        task_id,
        (context as any).getAppState,
        timeout,
        (context as any).abortController
      );

      if (!finished) {
        return toolSuccess({
          retrieval_status: 'timeout',
          task: null,
        });
      }

      if (finished.status === 'running' || finished.status === 'pending') {
        return toolSuccess({
          retrieval_status: 'timeout',
          task: formatTaskOutputForTool(finished, cwd),
        });
      }

      setTaskNotified((context as any).setAppState, task_id);
      return toolSuccess({
        retrieval_status: 'success',
        task: formatTaskOutputForTool(finished, cwd),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolError(`Failed to get task output: ${message}`);
    }
  },

  /**
   * Map tool result to API format.
   */
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // Source: chunks.119.mjs:1868-1888
    const lines: string[] = [];
    lines.push(`<retrieval_status>${result.retrieval_status}</retrieval_status>`);

    if (result.task) {
      const t = result.task;
      lines.push(`<task_id>${t.task_id}</task_id>`);
      lines.push(`<task_type>${t.task_type}</task_type>`);
      lines.push(`<status>${t.status}</status>`);

      if (t.exitCode !== undefined && t.exitCode !== null) {
        lines.push(`<exit_code>${t.exitCode}</exit_code>`);
      }

      if (t.output?.trim()) {
        const { content } = truncateOutput(t.output, t.task_id);
        lines.push(`<output>\n${content.trimEnd()}\n</output>`);
      }

      if (t.error) {
        lines.push(`<error>${t.error}</error>`);
      }
    }

    return {
      tool_use_id: toolUseId,
      type: 'tool_result',
      content: lines.join('\n\n'),
    };
  },
});

// Helper functions are defined above (waitForTaskCompletion, truncateOutput, etc.)

// ============================================
// Export
// ============================================

// NOTE: TaskOutputTool 已在声明处导出；避免重复导出。
