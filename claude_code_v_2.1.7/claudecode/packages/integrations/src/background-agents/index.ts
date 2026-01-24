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
 * Reconstructed from chunks.91.mjs, chunks.121.mjs, chunks.136.mjs
 */

// ============================================
// Types & Constants
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
  ensureDir,
  readTranscript,
  readTranscriptStream,
  readTranscriptMetadata,
  initTranscript,
  appendTranscriptEntry,
  updateTranscriptMetadata,
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
  readTaskOutput,
  writeTaskOutput,
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
  waitForTaskCompletion,
  executeTaskOutputTool,
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
  killBackgroundTask,
  createTaskNotification,
  aggregateAsyncAgentExecution,
  addTaskToState,
  updateTask,
  createBaseTask,
  createBashTaskNotification,
  createBackgroundSessionNotification,
  markAgentTaskCompleted,
} from './lifecycle.js';

// ============================================
// Summarization
// ============================================

export {
  extractTodoList,
  generateProgressSummary,
} from './summarize.js';

// ============================================
// Task Factories
// ============================================

import type { BackgroundBashTask, BackgroundAgentTask, RemoteAgentTask, SetAppState } from './types.js';
import { generateBashTaskId, generateAgentTaskId, generateRemoteAgentTaskId } from './registry.js';
import { createBaseTask, addTaskToState } from './lifecycle.js';

/**
 * Create a background bash task and add to state.
 */
export function createBashTask(command: string, setAppState: SetAppState, pid?: number): BackgroundBashTask {
  const id = generateBashTaskId();
  const task: BackgroundBashTask = {
    ...createBaseTask(id, 'local_bash', `Bash: ${command}`),
    type: 'local_bash',
    status: 'running',
    command,
    stdoutLineCount: 0,
    stderrLineCount: 0,
    lastReportedStdoutLines: 0,
    lastReportedStderrLines: 0,
    isBackgrounded: true,
    completionStatusSentInAttachment: false,
    shellCommand: null, // Initial state
  };
  addTaskToState(task, setAppState);
  return task;
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
    ...createBaseTask(id, 'local_agent', description),
    type: 'local_agent',
    status: 'running',
    agentId: id,
    prompt: options?.prompt ?? '',
    subagentType: options?.subagentType ?? 'general-purpose',
    model: options?.model,
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: true,
    selectedAgent: {},
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
): RemoteAgentTask {
  const id = generateRemoteAgentTaskId();
  return {
    ...createBaseTask(id, 'remote_agent', description),
    type: 'remote_agent',
    status: 'running',
    sessionId: '',
    title: description,
    todoList: [],
    log: [],
    deltaSummarySinceLastFlushToAttachment: null,
    agentId: id,
    prompt: options?.prompt ?? '',
    command: options?.prompt ?? '',
    selectedAgent: {},
    agentType: 'remote',
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: true,
  };
}
