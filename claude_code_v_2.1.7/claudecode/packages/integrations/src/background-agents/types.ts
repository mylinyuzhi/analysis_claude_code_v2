/**
 * @claudecode/integrations - Background Agents Types
 *
 * Type definitions for background task management.
 * Reconstructed from chunks.91.mjs, chunks.121.mjs, chunks.136.mjs
 */

// ============================================
// Task Types
// ============================================

/**
 * Background task type.
 */
export type BackgroundTaskType = 'local_bash' | 'local_agent' | 'remote_agent';

/**
 * Background task status.
 */
export type BackgroundTaskStatus = 'running' | 'completed' | 'failed' | 'cancelled' | 'killed' | 'pending';

/**
 * Base background task.
 */
export interface BackgroundTaskBase {
  id: string;
  type: BackgroundTaskType;
  status: BackgroundTaskStatus;
  startTime: number;
  endTime?: number;
  // 运行时附加字段（用于通知/进度追踪；在重建源码中可选存在）
  notified?: boolean;
  progress?: unknown;
}

/**
 * Background bash task.
 * Stored in-memory for real-time streaming.
 */
export interface BackgroundBashTask extends BackgroundTaskBase {
  type: 'local_bash';
  command: string;
  stdout: string;
  stderr: string;
  exitCode?: number;
  pid?: number;
}

/**
 * Background agent task.
 * Stored in transcript files for persistence.
 */
export interface BackgroundAgentTask extends BackgroundTaskBase {
  type: 'local_agent' | 'remote_agent';
  description: string;
  transcriptPath: string;
  outputPath?: string;
  prompt?: string;
  subagentType?: string;
  model?: string;
  result?: unknown;
  error?: string;
}

/**
 * Union type for all background tasks.
 */
export type BackgroundTask = BackgroundBashTask | BackgroundAgentTask;

// ============================================
// Task Registry
// ============================================

/**
 * Task registry entry.
 */
export interface TaskRegistryEntry {
  task: BackgroundTask;
  abortController?: AbortController;
  process?: unknown; // ChildProcess for bash tasks
}

/**
 * Task registry state.
 */
export interface TaskRegistry {
  tasks: Map<string, TaskRegistryEntry>;
  outputFiles: Map<string, string>; // taskId -> outputPath
}

// ============================================
// Task Output
// ============================================

/**
 * TaskOutput tool input.
 */
export interface TaskOutputInput {
  task_id: string;
  block?: boolean;
  timeout?: number;
}

/**
 * TaskOutput tool result.
 */
export interface TaskOutputResult {
  task_id: string;
  type: BackgroundTaskType;
  status: BackgroundTaskStatus;
  output?: string;
  error?: string;
  exitCode?: number;
  duration?: number;
}

// ============================================
// Transcript Types
// ============================================

/**
 * Transcript message entry.
 */
export interface TranscriptEntry {
  type: 'user' | 'assistant' | 'system' | 'tool_result';
  content: unknown;
  timestamp: number;
}

/**
 * Transcript metadata.
 */
export interface TranscriptMetadata {
  agentId: string;
  description: string;
  startTime: number;
  endTime?: number;
  status: BackgroundTaskStatus;
  model?: string;
  subagentType?: string;
}

// ============================================
// Task Events
// ============================================

/**
 * Task event types.
 */
export type TaskEventType =
  | 'task_started'
  | 'task_output'
  | 'task_completed'
  | 'task_failed'
  | 'task_cancelled';

/**
 * Task event.
 */
export interface TaskEvent {
  type: TaskEventType;
  taskId: string;
  timestamp: number;
  data?: unknown;
}

/**
 * Task event handler.
 */
export type TaskEventHandler = (event: TaskEvent) => void;

// ============================================
// Constants
// ============================================

export const BACKGROUND_AGENT_CONSTANTS = {
  // ID generation
  ID_LENGTH: 6,
  BASH_ID_PREFIX: 's',
  REMOTE_ID_PREFIX: 'r',

  // Directories
  SUBAGENTS_DIR: 'subagents',
  TASKS_DIR: 'tasks',
  OUTPUT_EXTENSION: '.output',
  TRANSCRIPT_EXTENSION: '.jsonl',

  // Timeouts
  DEFAULT_TASK_TIMEOUT_MS: 30000,
  MAX_TASK_TIMEOUT_MS: 600000, // 10 minutes
  OUTPUT_POLL_INTERVAL_MS: 100,

  // Limits
  MAX_OUTPUT_SIZE: 1024 * 1024, // 1MB
  MAX_CONCURRENT_TASKS: 10,
} as const;

// ============================================
// Extended Task Types (with tracking fields)
// ============================================

/**
 * Extended background bash task with process tracking.
 * Used for Ctrl+B backgrounding support.
 */
export interface BackgroundBashTaskExtended extends BackgroundBashTask {
  isBackgrounded: boolean;
  notified?: boolean;
  completionStatusSentInAttachment: boolean;
  stdoutLineCount: number;
  stderrLineCount: number;
  lastReportedStdoutLines: number;
  lastReportedStderrLines: number;
}

/**
 * Extended background agent task with progress tracking.
 * Used for local_agent and remote_agent types.
 */
export interface BackgroundAgentTaskExtended extends BackgroundAgentTask {
  isBackgrounded: boolean;
  notified?: boolean;
  abortController?: AbortController;
  progress?: {
    toolUseCount: number;
    tokenCount: number;
    lastActivity?: { toolName: string; input: unknown };
    recentActivities: Array<{ toolName: string; input: unknown }>;
  };
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
  result?: unknown;
  error?: string;
}

/**
 * Remote agent task with session tracking.
 */
export interface RemoteAgentTask extends BackgroundAgentTaskExtended {
  type: 'remote_agent';
  sessionId: string;
  title: string;
  todoList: unknown[];
  log: unknown[];
  deltaSummarySinceLastFlushToAttachment: string | null;
}

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
