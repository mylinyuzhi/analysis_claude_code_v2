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
 * App state updater function type.
 */
export type SetAppState = (updater: (state: any) => any) => void;

/**
 * Base background task.
 * Original: KO in chunks.91.mjs
 */
export interface BackgroundTaskBase {
  id: string;
  type: BackgroundTaskType;
  status: BackgroundTaskStatus;
  description: string;
  startTime: number;
  endTime?: number;
  outputFile: string;
  outputOffset: number;
  notified: boolean;
}

/**
 * Background bash task.
 * Stored in-memory for real-time streaming.
 * Original: es in chunks.121.mjs
 */
export interface BackgroundBashTask extends BackgroundTaskBase {
  type: 'local_bash';
  command: string;
  stdoutLineCount: number;
  stderrLineCount: number;
  lastReportedStdoutLines: number;
  lastReportedStderrLines: number;
  isBackgrounded: boolean;
  completionStatusSentInAttachment: boolean;
  shellCommand?: {
    kill: () => void;
    background: (taskId: string) => {
      stdoutStream: NodeJS.ReadableStream;
      stderrStream: NodeJS.ReadableStream;
    } | null;
    result: Promise<{ code: number; interrupted: boolean }>;
  } | null;
  unregisterCleanup?: () => void;
  cleanupTimeoutId?: NodeJS.Timeout;
  result?: { code: number; interrupted: boolean };
}

/**
 * Background agent task.
 * Stored in transcript files for persistence.
 * Original: kZ1 in chunks.91.mjs
 */
export interface BackgroundAgentTask extends BackgroundTaskBase {
  type: 'local_agent' | 'remote_agent';
  agentId: string;
  prompt: string;
  selectedAgent: any;
  agentType: string;
  abortController?: AbortController;
  unregisterCleanup?: () => void;
  retrieved: boolean;
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
  isBackgrounded: boolean;
  progress?: {
    toolUseCount: number;
    tokenCount: number;
    lastActivity?: { toolName: string; input: unknown };
    recentActivities: Array<{ toolName: string; input: unknown }>;
  };
  messages?: any[];
  error?: string;
  result?: any;
}

/**
 * Remote agent task with session tracking.
 * Original: tu2 in chunks.121.mjs
 */
export interface RemoteAgentTask extends BackgroundAgentTask {
  type: 'remote_agent';
  sessionId: string;
  title: string;
  todoList: any[];
  log: any[];
  deltaSummarySinceLastFlushToAttachment: string | null;
  command: string; // The command sent to remote
}

/**
 * Union type for all background tasks.
 */
export type BackgroundTask = BackgroundBashTask | BackgroundAgentTask | RemoteAgentTask;

// ============================================
// Task Registry
// ============================================

/**
 * Task registry entry.
 */
export interface TaskRegistryEntry {
  task: BackgroundTask;
  abortController?: AbortController;
}

/**
 * Task registry state.
 */
export interface TaskRegistry {
  tasks: Map<string, TaskRegistryEntry>;
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
 * Original: YK1 in chunks.119.mjs
 */
export interface TaskOutputResult {
  task_id: string;
  task_type: BackgroundTaskType;
  status: BackgroundTaskStatus;
  description: string;
  output: string;
  exitCode?: number | null;
  prompt?: string;
  result?: any;
  error?: string;
}

// ============================================
// Transcript Types
// ============================================

/**
 * Transcript message entry.
 */
export interface TranscriptEntry {
  type: 'user' | 'assistant' | 'system' | 'tool_result';
  content: any;
  timestamp: number;
  message?: any; // For assistant messages
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
  data?: any;
}

/**
 * Task event handler.
 */
export type TaskEventHandler = (event: TaskEvent) => void;

// ============================================
// XML Notification Tags
// ============================================

/**
 * Constants for XML notification tags.
 * Original: chunks.85.mjs
 */
export const TASK_NOTIFICATION_TAGS = {
  NOTIFICATION: 'task-notification', // zF
  TASK_ID: 'task-id',               // IO
  TASK_TYPE: 'task-type',           // p51
  OUTPUT_FILE: 'output-file',       // Kb
  STATUS: 'status',                 // hz
  SUMMARY: 'summary',               // gz
  RESULT: 'result',
} as const;

// ============================================
// Constants
// ============================================

export const BACKGROUND_AGENT_CONSTANTS = {
  // ID generation
  ID_LENGTH: 6,
  BASH_ID_PREFIX: 'b',
  AGENT_ID_PREFIX: 'a',
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

