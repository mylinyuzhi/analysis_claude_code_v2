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

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

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

function normalizeTaskStatus(status: unknown): TaskStatus {
  switch (status) {
    case 'running':
    case 'pending':
    case 'completed':
    case 'failed':
    case 'cancelled':
    case 'killed':
      return status;
    case 'canceled':
      // normalize American spelling
      return 'cancelled';
    case 'backgrounded':
      // Source has local_agent tasks that can become backgrounded (still running)
      return 'running';
    default:
      return 'failed';
  }
}

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

function getTaskOutputPath(taskId: string, cwd?: string): string {
  // Source (aY / formatOutputPath): ~/.claude/projects/<sanitized-cwd>/agents/<taskId>.output
  const workingDir = cwd ?? process.cwd();
  const sanitizedCwd = workingDir.replace(/[^a-zA-Z0-9]/g, '-');
  return join(homedir(), '.claude', 'projects', sanitizedCwd, 'agents', `${taskId}.output`);
}

function getSubagentTranscriptPath(agentId: string, cwd?: string): string {
  const workingDir = cwd ?? process.cwd();
  const sanitizedCwd = workingDir.replace(/[^a-zA-Z0-9]/g, '-');
  return join(homedir(), '.claude', 'projects', sanitizedCwd, 'subagents', `agent-${agentId}.jsonl`);
}

function readTaskMaxOutputLength(): number {
  const raw = process.env.TASK_MAX_OUTPUT_LENGTH;
  if (!raw) return DEFAULT_MAX_OUTPUT_LENGTH;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_OUTPUT_LENGTH;
  return n;
}

function truncateOutput(content: string, taskId: string): { content: string; wasTruncated: boolean } {
  const maxLen = readTaskMaxOutputLength();
  if (content.length <= maxLen) return { content, wasTruncated: false };

  const hint = `[Truncated. Full output: ${getTaskOutputPath(taskId)}]\n\n`;
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

function extractLocalAgentText(taskId: string, cwd?: string): string {
  const outputPath = getTaskOutputPath(taskId, cwd);
  if (existsSync(outputPath)) {
    try {
      const raw = readFileSync(outputPath, 'utf-8');
      if (raw && raw.trim().length > 0) return raw;
    } catch {
      // ignore
    }
  }

  const transcriptPath = getSubagentTranscriptPath(taskId, cwd);
  if (!existsSync(transcriptPath)) return '';

  try {
    const raw = readFileSync(transcriptPath, 'utf-8');
    const out: string[] = [];
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const entry = JSON.parse(trimmed);
        const msg = entry?.content;
        if (!msg || typeof msg !== 'object') continue;
        if (msg.type !== 'assistant') continue;
        const blocks = msg.message?.content;
        if (!Array.isArray(blocks)) continue;
        for (const b of blocks) {
          if (b?.type === 'text' && typeof b.text === 'string') out.push(b.text);
        }
      } catch {
        // ignore
      }
    }
    return out.join('\n');
  } catch {
    return '';
  }
}

function extractLocalBashText(taskId: string, cwd?: string): string {
  const outputPath = getTaskOutputPath(taskId, cwd);
  if (existsSync(outputPath)) {
    try {
      return readFileSync(outputPath, 'utf-8');
    } catch {
      // ignore
    }
  }
  return '';
}

function formatTaskForOutput(task: any, cwd?: string): TaskOutputTask {
  const type: TaskType = task.type;
  const id: string = task.id ?? task.taskId ?? task.agentId;

  if (type === 'local_bash') {
    const output = extractLocalBashText(id, cwd) || String(task.stdout ?? task.output ?? '');
    return {
      task_id: id,
      task_type: 'local_bash',
      status: String(task.status ?? ''),
      description: String(task.description ?? ''),
      output,
      exitCode: task.result?.code ?? task.exitCode ?? null,
    };
  }

  if (type === 'local_agent') {
    const text = extractLocalAgentText(id, cwd);
    return {
      task_id: id,
      task_type: 'local_agent',
      status: String(task.status ?? ''),
      description: String(task.description ?? ''),
      output: text,
      prompt: task.prompt,
      result: text,
      error: task.error,
    };
  }

  return {
    task_id: id,
    task_type: 'remote_agent',
    status: String(task.status ?? ''),
    description: String(task.description ?? ''),
    output: String(task.output ?? ''),
    prompt: String(task.command ?? ''),
  };
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
      // Source: tasks live in appState.tasks (plain object), keyed by task_id.
      const appState = await context.getAppState?.();
      const task = (appState as any)?.tasks?.[task_id];
      if (!task) {
        return toolError(`Task not found: ${task_id}`);
      }

      const cwd = (context as any).getCwd ? (context as any).getCwd() : process.cwd();

      // Non-blocking
      if (!block) {
        if (task.status !== 'running' && task.status !== 'pending') {
          setTaskNotified((context as any).setAppState, task_id);
          return toolSuccess({
            retrieval_status: 'success',
            task: formatTaskForOutput(task, cwd),
          });
        }
        return toolSuccess({
          retrieval_status: 'not_ready',
          task: formatTaskForOutput(task, cwd),
        });
      }

      // Blocking
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
          task: formatTaskForOutput(finished, cwd),
        });
      }

      setTaskNotified((context as any).setAppState, task_id);
      return toolSuccess({
        retrieval_status: 'success',
        task: formatTaskForOutput(finished, cwd),
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
    const lines: string[] = [];
    lines.push(`<retrieval_status>${result.retrieval_status}</retrieval_status>`);

    const t = result.task;
    if (t) {
      lines.push(`<task_id>${t.task_id}</task_id>`);
      lines.push(`<task_type>${t.task_type}</task_type>`);
      lines.push(`<status>${t.status}</status>`);
      if (t.exitCode !== undefined && t.exitCode !== null) {
        lines.push(`<exit_code>${t.exitCode}</exit_code>`);
      }
      const out = t.output ?? '';
      if (out.trim()) {
        const truncated = truncateOutput(out, t.task_id);
        lines.push(`<output>\n${truncated.content.trimEnd()}\n</output>`);
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
