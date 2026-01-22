/**
 * @claudecode/integrations - Task Type Handlers
 *
 * Handlers for different background task types.
 * Reconstructed from chunks.91.mjs, chunks.121.mjs
 *
 * Key symbols:
 * - es → LocalBashTaskHandler
 * - kZ1 → LocalAgentTaskHandler
 * - tu2 → RemoteAgentTaskHandler
 * - $i5 → getTaskHandlers
 */

import React from 'react';
import { Box, Text } from 'ink';
import type {
  BackgroundTask,
  BackgroundBashTask,
  BackgroundAgentTask,
  BackgroundTaskStatus,
} from './types.js';

// ============================================
// Types
// ============================================

/**
 * Task progress information.
 */
export interface TaskProgress {
  toolUseCount: number;
  tokenCount: number;
  lastActivity?: {
    toolName: string;
    input: unknown;
  };
  recentActivities: Array<{
    toolName: string;
    input: unknown;
  }>;
}

/**
 * Local agent task with progress tracking.
 */
export interface LocalAgentTaskWithProgress extends BackgroundAgentTask {
  type: 'local_agent';
  progress?: TaskProgress;
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
  isBackgrounded: boolean;
  notified?: boolean;
  abortController?: AbortController;
  unregisterCleanup?: () => void;
  result?: unknown;
  error?: string;
}

/**
 * Local bash task with process tracking.
 */
export interface LocalBashTaskWithProcess extends BackgroundBashTask {
  type: 'local_bash';
  isBackgrounded: boolean;
  notified?: boolean;
  completionStatusSentInAttachment: boolean;
  shellCommand?: {
    kill: () => void;
    background: (taskId: string) => {
      stdoutStream: NodeJS.ReadableStream;
      stderrStream: NodeJS.ReadableStream;
    } | null;
  };
  unregisterCleanup?: () => void;
  cleanupTimeoutId?: NodeJS.Timeout;
  stdoutLineCount: number;
  stderrLineCount: number;
  lastReportedStdoutLines: number;
  lastReportedStderrLines: number;
}

/**
 * Remote agent task with polling.
 */
export interface RemoteAgentTaskWithSession extends BackgroundAgentTask {
  type: 'remote_agent';
  sessionId: string;
  title: string;
  todoList: unknown[];
  log: unknown[];
  deltaSummarySinceLastFlushToAttachment: string | null;
  notified?: boolean;
}

/**
 * Task spawn parameters.
 */
export interface TaskSpawnParams {
  description: string;
  prompt?: string;
  command?: string;
  title?: string;
}

/**
 * Task spawn context.
 */
export interface TaskSpawnContext {
  setAppState: (updater: (state: unknown) => unknown) => void;
  getAppState: () => unknown;
  abortController: AbortController;
}

/**
 * Task spawn result.
 */
export interface TaskSpawnResult {
  taskId: string;
  cleanup: () => void;
}

/**
 * Task handler interface.
 */
export interface TaskHandler<T extends BackgroundTask = BackgroundTask> {
  name: string;
  type: T['type'];
  spawn(params: TaskSpawnParams, context: TaskSpawnContext): Promise<TaskSpawnResult>;
  kill(taskId: string, context: TaskSpawnContext): Promise<void>;
  renderStatus(task: T): unknown; // React component
  renderOutput(output: unknown): unknown; // React component
  getProgressMessage(task: T): string | null;
}

// ============================================
// Local Bash Task Handler
// ============================================

/**
 * Handler for local_bash tasks.
 * Original: es in chunks.121.mjs
 */
export const LocalBashTaskHandler: TaskHandler<LocalBashTaskWithProcess> = {
  name: 'LocalBashTask',
  type: 'local_bash',

  async spawn(params, context) {
    // Implementation would spawn shell command
    throw new Error('LocalBashTaskHandler.spawn not implemented in stub');
  },

  async kill(taskId, context) {
    // Implementation would kill the shell process
    // Original: Iq0 in chunks.121.mjs
  },

  renderStatus(task) {
    const { status, command } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    return React.createElement(Box, null,
      React.createElement(Text, { color }, `[${status}] ${command}`)
    );
  },

  renderOutput(output) {
    return React.createElement(Box, null,
      React.createElement(Text, null, String(output))
    );
  },

  getProgressMessage(task) {
    const newStdoutLines = task.stdoutLineCount - task.lastReportedStdoutLines;
    const newStderrLines = task.stderrLineCount - task.lastReportedStderrLines;

    if (newStdoutLines === 0 && newStderrLines === 0) return null;

    const updates: string[] = [];
    if (newStdoutLines > 0) updates.push(`${newStdoutLines} new stdout line${newStdoutLines > 1 ? 's' : ''}`);
    if (newStderrLines > 0) updates.push(`${newStderrLines} new stderr line${newStderrLines > 1 ? 's' : ''}`);

    return `Background shell ${task.id} progress: ${updates.join(', ')}.`;
  },
};

// ============================================
// Local Agent Task Handler
// ============================================

/**
 * Handler for local_agent tasks.
 * Original: kZ1 in chunks.91.mjs:1412-1482
 */
export const LocalAgentTaskHandler: TaskHandler<LocalAgentTaskWithProgress> = {
  name: 'LocalAgentTask',
  type: 'local_agent',

  async spawn(params, context) {
    // Implementation would spawn sub-agent
    throw new Error('LocalAgentTaskHandler.spawn not implemented in stub');
  },

  async kill(taskId, context) {
    // Implementation would abort the agent
    // Original: $4A (killBackgroundTask) in chunks.91.mjs
  },

  renderStatus(task) {
    const { status, description, progress } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    const progressText = progress ? ` (${progress.toolUseCount} tools, ${progress.tokenCount} tokens)` : '';
    return React.createElement(Box, null,
      React.createElement(Text, { color }, `[${status}] ${description}${progressText}`)
    );
  },

  renderOutput(output) {
    return React.createElement(Box, null,
      React.createElement(Text, null, String(output))
    );
  },

  getProgressMessage(task) {
    const progress = task.progress;
    if (!progress) return null;

    const newTools = progress.toolUseCount - task.lastReportedToolCount;
    const newTokens = progress.tokenCount - task.lastReportedTokenCount;

    if (newTools === 0 && newTokens === 0) return null;

    const updates: string[] = [];
    if (newTools > 0) updates.push(`${newTools} new tool${newTools > 1 ? 's' : ''} used`);
    if (newTokens > 0) updates.push(`${newTokens} new tokens`);

    return `Agent ${task.id} progress: ${updates.join(', ')}. The agent is still running. You usually do not need to read ${task.outputPath} unless you need specific details right away. You will receive a notification when the agent is done.`;
  },
};

// ============================================
// Remote Agent Task Handler
// ============================================

/**
 * Handler for remote_agent tasks (teleport feature).
 * Original: tu2 in chunks.121.mjs:185-252
 */
export const RemoteAgentTaskHandler: TaskHandler<RemoteAgentTaskWithSession> = {
  name: 'RemoteAgentTask',
  type: 'remote_agent',

  async spawn(params, context) {
    // Implementation would create remote session via API
    throw new Error('RemoteAgentTaskHandler.spawn not implemented in stub');
  },

  async kill(taskId, context) {
    // Implementation would mark as killed locally
  },

  renderStatus(task) {
    const { status, title, deltaSummarySinceLastFlushToAttachment } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    const summaryText = deltaSummarySinceLastFlushToAttachment ? ` (${deltaSummarySinceLastFlushToAttachment})` : '';
    return React.createElement(Box, null,
      React.createElement(Text, { color }, `[${status}] ${title}${summaryText}`)
    );
  },

  renderOutput(output) {
    return React.createElement(Box, null,
      React.createElement(Text, null, String(output))
    );
  },

  getProgressMessage(task) {
    const deltaSummary = task.deltaSummarySinceLastFlushToAttachment;
    if (!deltaSummary) return null;

    return `Remote task ${task.id} progress: ${deltaSummary}. Read ${task.outputPath} to see full output.`;
  },
};

// ============================================
// Handler Registry
// ============================================

/**
 * Get all task type handlers.
 * Original: $i5 in chunks.121.mjs:255-257
 */
export function getTaskHandlers(): TaskHandler[] {
  return [LocalBashTaskHandler, LocalAgentTaskHandler, RemoteAgentTaskHandler];
}

/**
 * Get handler by task type.
 */
export function getTaskHandler(type: BackgroundTask['type']): TaskHandler | undefined {
  return getTaskHandlers().find((h) => h.type === type);
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
