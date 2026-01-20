/**
 * @claudecode/integrations - TaskOutput Tool Utilities
 *
 * Utilities for the TaskOutput tool.
 * Reconstructed from chunks.119.mjs
 *
 * Key symbols:
 * - YK1 → formatTaskOutput
 * - bbA → truncateTaskOutput
 * - op5 → waitForTaskCompletion
 * - np5 → getTaskMaxOutputLength
 * - aHA → TASKOUTPUT_TOOL_NAME
 * - ap5 → taskOutputInputSchema
 */

import type {
  BackgroundTask,
  BackgroundBashTask,
  BackgroundAgentTask,
  BackgroundTaskStatus,
  TaskOutputInput,
  TaskOutputResult,
} from './types.js';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';
import { getTaskOutputContent, formatOutputPath } from './output.js';

// ============================================
// Constants
// ============================================

/**
 * TaskOutput tool name.
 * Original: aHA in chunks.119.mjs
 */
export const TASKOUTPUT_TOOL_NAME = 'TaskOutput';

/**
 * KillShell tool name.
 * Original: GK1 in chunks.119.mjs
 */
export const KILLSHELL_TOOL_NAME = 'KillShell';

/**
 * Default max output length.
 */
const DEFAULT_MAX_OUTPUT_LENGTH = 100000; // 100KB

// ============================================
// Configuration
// ============================================

/**
 * Get maximum task output length.
 * Original: np5 in chunks.119.mjs
 *
 * Controlled by TASK_MAX_OUTPUT_LENGTH env var.
 */
export function getTaskMaxOutputLength(): number {
  const envValue = process.env.TASK_MAX_OUTPUT_LENGTH;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_MAX_OUTPUT_LENGTH;
}

// ============================================
// Output Formatting
// ============================================

/**
 * Format task output for different task types.
 * Original: YK1 in chunks.119.mjs:1605-1632
 *
 * @param task - The background task
 * @returns Formatted output object
 */
export function formatTaskOutput(task: BackgroundTask): TaskOutputResult {
  const outputContent = getTaskOutputContent(task.id);

  const baseOutput: TaskOutputResult = {
    task_id: task.id,
    type: task.type,
    status: task.status,
    output: outputContent,
  };

  if (task.type === 'local_bash') {
    const bashTask = task as BackgroundBashTask;
    return {
      ...baseOutput,
      exitCode: bashTask.exitCode,
    };
  }

  if (task.type === 'local_agent') {
    const agentTask = task as BackgroundAgentTask & { error?: string };
    return {
      ...baseOutput,
      output: outputContent,
      error: agentTask.error,
    };
  }

  if (task.type === 'remote_agent') {
    return {
      ...baseOutput,
    };
  }

  return baseOutput;
}

/**
 * Truncate task output with reference to full file.
 * Original: bbA in chunks.119.mjs:1582-1597
 *
 * Key insight: Keeps the END of the output (most recent), not the beginning.
 *
 * @param content - The output content
 * @param outputFilePath - Path to full output file
 * @returns Truncated content info
 */
export function truncateTaskOutput(
  content: string,
  outputFilePath: string
): { content: string; wasTruncated: boolean } {
  const maxLength = getTaskMaxOutputLength();

  if (content.length <= maxLength) {
    return {
      content,
      wasTruncated: false,
    };
  }

  const truncationHeader = `[Truncated. Full output: ${outputFilePath}]\n\n`;
  const remainingSpace = maxLength - truncationHeader.length;
  const tailContent = content.slice(-remainingSpace); // Keep END of output

  return {
    content: truncationHeader + tailContent,
    wasTruncated: true,
  };
}

/**
 * Get formatted and truncated task output.
 */
export function getFormattedTaskOutput(task: BackgroundTask): TaskOutputResult {
  const result = formatTaskOutput(task);

  if (result.output) {
    const outputPath = formatOutputPath(task.id);
    const { content, wasTruncated } = truncateTaskOutput(result.output, outputPath);
    result.output = content;
    if (wasTruncated) {
      (result as TaskOutputResult & { wasTruncated: boolean }).wasTruncated = true;
    }
  }

  return result;
}

// ============================================
// Task Waiting
// ============================================

/**
 * App state getter type.
 */
type GetAppState = () => Promise<{ tasks?: Record<string, BackgroundTask> }>;

/**
 * Abort context type.
 */
interface AbortContext {
  signal: AbortSignal;
}

/**
 * Wait for task completion with polling.
 * Original: op5 in chunks.119.mjs:1634-1644
 *
 * @param taskId - Task ID to wait for
 * @param getAppState - Function to get current app state
 * @param timeoutMs - Timeout in milliseconds
 * @param abortContext - Optional abort context
 * @returns The completed task or null
 */
export async function waitForTaskCompletion(
  taskId: string,
  getAppState: GetAppState,
  timeoutMs: number = BACKGROUND_AGENT_CONSTANTS.DEFAULT_TASK_TIMEOUT_MS,
  abortContext?: AbortContext
): Promise<BackgroundTask | null> {
  const startTime = Date.now();
  const pollInterval = BACKGROUND_AGENT_CONSTANTS.OUTPUT_POLL_INTERVAL_MS;

  while (Date.now() - startTime < timeoutMs) {
    // Check for abort signal
    if (abortContext?.signal.aborted) {
      throw new Error('Task wait aborted');
    }

    // Get current task state
    const state = await getAppState();
    const task = state.tasks?.[taskId];

    // Task not found
    if (!task) return null;

    // Task completed (success or failure)
    if (task.status !== 'running') {
      return task;
    }

    // Poll every 100ms
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  // Timeout - return current state
  const finalState = await getAppState();
  return finalState.tasks?.[taskId] ?? null;
}

/**
 * Wait for task with blocking option.
 */
export async function waitForTask(
  input: TaskOutputInput,
  getAppState: GetAppState,
  abortContext?: AbortContext
): Promise<BackgroundTask | null> {
  const state = await getAppState();
  const task = state.tasks?.[input.task_id];

  if (!task) {
    return null;
  }

  // If not blocking or already completed, return immediately
  if (!input.block || task.status !== 'running') {
    return task;
  }

  // Wait for completion
  const timeout = Math.min(
    input.timeout ?? BACKGROUND_AGENT_CONSTANTS.DEFAULT_TASK_TIMEOUT_MS,
    BACKGROUND_AGENT_CONSTANTS.MAX_TASK_TIMEOUT_MS
  );

  return waitForTaskCompletion(input.task_id, getAppState, timeout, abortContext);
}

// ============================================
// Task Status Helpers
// ============================================

/**
 * Check if task is still running.
 */
export function isTaskRunning(task: BackgroundTask): boolean {
  return task.status === 'running';
}

/**
 * Check if task completed successfully.
 */
export function isTaskCompleted(task: BackgroundTask): boolean {
  return task.status === 'completed';
}

/**
 * Check if task failed.
 */
export function isTaskFailed(task: BackgroundTask): boolean {
  return task.status === 'failed';
}

/**
 * Check if task was cancelled.
 */
export function isTaskCancelled(task: BackgroundTask): boolean {
  return task.status === 'cancelled';
}

/**
 * Get task duration in milliseconds.
 */
export function getTaskDuration(task: BackgroundTask): number | undefined {
  if (task.endTime) {
    return task.endTime - task.startTime;
  }
  return undefined;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
