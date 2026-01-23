/**
 * @claudecode/integrations - Background Agents Module
 *
 * Background task management for bash commands and sub-agents.
 *
 * Key features:
 * - Run bash commands asynchronously
 * - Run sub-agents in background
 * - Unified TaskOutput tool for result retrieval
 * - Transcript persistence for agent tasks
 * - Ctrl+B signal handling for backgrounding
 * - Task lifecycle management
 *
 * Storage:
 * - Bash tasks: In-memory (real-time streaming, lost on exit)
 * - Agent tasks: File-based (JSONL transcripts, persistent)
 *
 * Reconstructed from chunks.91.mjs, chunks.121.mjs, chunks.136.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Registry
// ============================================

export {
  BackgroundTaskRegistry,
  generateTaskId,
  generateBashTaskId,
  generateAgentTaskId,
  generateRemoteAgentTaskId,
  isBashTaskId,
  isRemoteAgentTaskId,
  getTaskRegistry,
  resetTaskRegistry,
} from './registry.js';

// ============================================
// Transcript
// ============================================

export {
  sanitizePath,
  getClaudeDir,
  getProjectDir,
  getAgentTranscriptPath,
  getTaskOutputPath,
  ensureDir,
  readTranscript,
  readTranscriptStream,
  readTranscriptMetadata,
  initTranscript,
  appendTranscriptEntry,
  updateTranscriptMetadata,
  readTaskOutput,
  writeTaskOutput,
} from './transcript.js';

// ============================================
// Signal Handling (Ctrl+B)
// ============================================

export {
  isLocalAgentTask,
  isLocalBashTask,
  triggerBackgroundTransition,
  triggerBashBackgroundTransition,
  registerBackgroundableTask,
  removeBackgroundableTaskSignal,
  hasBackgroundSignal,
  clearBackgroundSignals,
  getBackgroundSignalMap,
} from './signal.js';

// ============================================
// Task Handlers
// ============================================

export {
  LocalBashTaskHandler,
  LocalAgentTaskHandler,
  RemoteAgentTaskHandler,
  getTaskHandlers,
  getTaskHandler,
  type TaskHandler,
  type TaskSpawnParams,
  type TaskSpawnContext,
  type TaskSpawnResult,
  type TaskProgress,
  type LocalAgentTaskWithProgress,
  type LocalBashTaskWithProcess,
  type RemoteAgentTaskWithSession,
} from './handlers.js';

// ============================================
// Output File Management
// ============================================

export {
  getAgentOutputDir,
  formatOutputPath,
  ensureOutputDirExists,
  createEmptyOutputFile,
  registerOutputFile,
  appendToOutputFile,
  getTaskOutputContent,
  writeOutputFile,
  outputFileExists,
  deleteOutputFile,
  clearPendingWrite,
  waitForPendingWrites,
} from './output.js';

// ============================================
// TaskOutput Tool Utilities
// ============================================

export {
  TASKOUTPUT_TOOL_NAME,
  KILLSHELL_TOOL_NAME,
  getTaskMaxOutputLength,
  formatTaskOutput,
  truncateTaskOutput,
  getFormattedTaskOutput,
  waitForTaskCompletion,
  waitForTask,
  isTaskRunning,
  isTaskCompleted,
  isTaskFailed,
  isTaskCancelled,
  getTaskDuration,
} from './task-output.js';

// ============================================
// Task Lifecycle
// ============================================

export {
  createFullyBackgroundedAgent,
  createBackgroundableAgent,
  updateTaskProgress,
  markTaskCompleted,
  markTaskFailed,
  markTaskCancelled,
  killBackgroundTask,
  createTaskNotification,
  aggregateAsyncAgentExecution,
  // Note: updateTask, addTaskToState, etc. removed as they were replaced by registry-based approach
} from './lifecycle.js';

// ============================================
// Task Factories
// ============================================

import type { BackgroundBashTask, BackgroundAgentTask } from './types.js';
import { generateBashTaskId, generateAgentTaskId, generateRemoteAgentTaskId } from './registry.js';
import { getAgentTranscriptPath } from './transcript.js';

/**
 * Create a background bash task.
 */
export function createBashTask(command: string, pid?: number): BackgroundBashTask {
  return {
    id: generateBashTaskId(),
    type: 'local_bash',
    status: 'running',
    startTime: Date.now(),
    command,
    stdout: '',
    stderr: '',
    pid,
  };
}

/**
 * Create a background agent task.
 */
export function createAgentTask(
  description: string,
  options?: {
    prompt?: string;
    subagentType?: string;
    model?: string;
    cwd?: string;
  }
): BackgroundAgentTask {
  const id = generateAgentTaskId();
  return {
    id,
    type: 'local_agent',
    status: 'running',
    startTime: Date.now(),
    description,
    transcriptPath: getAgentTranscriptPath(id, options?.cwd),
    prompt: options?.prompt,
    subagentType: options?.subagentType,
    model: options?.model,
  };
}

/**
 * Create a remote agent task.
 */
export function createRemoteAgentTask(
  description: string,
  options?: {
    prompt?: string;
    cwd?: string;
  }
): BackgroundAgentTask {
  const id = generateRemoteAgentTaskId();
  return {
    id,
    type: 'remote_agent',
    status: 'running',
    startTime: Date.now(),
    description,
    transcriptPath: getAgentTranscriptPath(id, options?.cwd),
    prompt: options?.prompt,
  };
}
