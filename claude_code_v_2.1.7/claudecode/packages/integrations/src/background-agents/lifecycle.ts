/**
 * @claudecode/integrations - Task Lifecycle Management
 *
 * Functions for managing task lifecycle (create, update, complete, fail).
 * Reconstructed from chunks.91.mjs
 *
 * Key symbols:
 * - C4A → createTaskNotification
 * - $4A → killBackgroundTask
 * - RI0 → updateTaskProgress
 * - _I0 → markTaskCompleted
 * - jI0 → markTaskFailed
 * - KO → createBaseTask
 * - FO → addTaskToState
 * - oY → updateTask
 */

import type {
  BackgroundTask,
  BackgroundAgentTask,
  BackgroundBashTask,
  BackgroundTaskStatus,
} from './types.js';
import { formatOutputPath } from './output.js';

// ============================================
// Types
// ============================================

/**
 * App state with tasks.
 */
export interface AppStateWithTasks {
  tasks: Record<string, BackgroundTask>;
  [key: string]: unknown;
}

/**
 * App state setter.
 */
export type SetAppState = (updater: (state: AppStateWithTasks) => AppStateWithTasks) => void;

/**
 * Task progress info.
 */
export interface TaskProgressInfo {
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
 * Agent result.
 */
export interface AgentResult {
  agentId: string;
  result?: unknown;
  [key: string]: unknown;
}

/**
 * Notification value.
 */
export interface NotificationValue {
  value: string;
  mode: 'task-notification';
}

/**
 * Push notification function.
 */
export type PushNotification = (notification: NotificationValue, setAppState: SetAppState) => void;

// ============================================
// XML Tag Constants
// ============================================

const XML_TAGS = {
  TASK_NOTIFICATION: 'task-notification',
  TASK_ID: 'task-id',
  STATUS: 'status',
  MESSAGE: 'message',
  OUTPUT_FILE: 'output-file',
  RESULT: 'result',
} as const;

// ============================================
// State Management
// ============================================

/**
 * Update task in app state.
 * Original: oY in chunks.91.mjs
 */
export function updateTask(
  taskId: string,
  setAppState: SetAppState,
  updater: (task: BackgroundTask) => BackgroundTask
): void {
  setAppState((state) => {
    const task = state.tasks?.[taskId];
    if (!task) return state;

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: updater(task),
      },
    };
  });
}

/**
 * Add task to app state.
 * Original: FO in chunks.91.mjs
 */
export function addTaskToState(task: BackgroundTask, setAppState: SetAppState): void {
  setAppState((state) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [task.id]: task,
    },
  }));
}

/**
 * Remove task from app state.
 */
export function removeTaskFromState(taskId: string, setAppState: SetAppState): void {
  setAppState((state) => {
    const { [taskId]: removed, ...remainingTasks } = state.tasks;
    return {
      ...state,
      tasks: remainingTasks,
    };
  });
}

/**
 * Create base task object with common fields.
 * Original: KO in chunks.91.mjs
 */
export function createBaseTask(
  taskId: string,
  taskType: BackgroundTask['type'],
  description: string
): Pick<BackgroundTask, 'id' | 'type' | 'startTime'> & { description: string; outputFile: string } {
  return {
    id: taskId,
    type: taskType,
    description,
    startTime: Date.now(),
    outputFile: formatOutputPath(taskId),
  };
}

// ============================================
// Task Lifecycle
// ============================================

/**
 * Create task completion notification.
 * Original: C4A in chunks.91.mjs:1222-1240
 *
 * Creates XML-formatted notification for the main agent.
 */
export function createTaskNotification(
  taskId: string,
  description: string,
  status: BackgroundTaskStatus,
  errorMsg: string | undefined,
  setAppState: SetAppState,
  result?: string,
  pushNotification?: PushNotification
): void {
  let message: string;
  if (status === 'completed') {
    message = `Agent "${description}" completed`;
  } else if (status === 'failed') {
    message = `Agent "${description}" failed: ${errorMsg || 'Unknown error'}`;
  } else {
    message = `Agent "${description}" was stopped`;
  }

  const transcriptPath = formatOutputPath(taskId);
  const resultXml = result ? `\n<${XML_TAGS.RESULT}>${result}</${XML_TAGS.RESULT}>` : '';

  const notification = `<${XML_TAGS.TASK_NOTIFICATION}>
<${XML_TAGS.TASK_ID}>${taskId}</${XML_TAGS.TASK_ID}>
<${XML_TAGS.STATUS}>${status}</${XML_TAGS.STATUS}>
<${XML_TAGS.MESSAGE}>${message}</${XML_TAGS.MESSAGE}>${resultXml}
</${XML_TAGS.TASK_NOTIFICATION}>
Full transcript available at: ${transcriptPath}`;

  // Push notification to main agent
  if (pushNotification) {
    pushNotification(
      {
        value: notification,
        mode: 'task-notification',
      },
      setAppState
    );
  }

  // Mark task as notified
  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true,
  } as BackgroundTask));
}

/**
 * Create bash task completion notification.
 * Original: ibA in chunks.121.mjs:571-588
 */
export function createBashTaskNotification(
  taskId: string,
  description: string,
  status: BackgroundTaskStatus,
  exitCode: number | undefined,
  setAppState: SetAppState,
  pushNotification?: PushNotification
): void {
  let statusMessage: string;
  if (status === 'completed') {
    statusMessage = `completed${exitCode !== undefined ? ` (exit code ${exitCode})` : ''}`;
  } else if (status === 'failed') {
    statusMessage = `failed${exitCode !== undefined ? ` with exit code ${exitCode}` : ''}`;
  } else {
    statusMessage = 'was killed';
  }

  const outputPath = formatOutputPath(taskId);

  const notification = `<${XML_TAGS.TASK_NOTIFICATION}>
<${XML_TAGS.TASK_ID}>${taskId}</${XML_TAGS.TASK_ID}>
<${XML_TAGS.OUTPUT_FILE}>${outputPath}</${XML_TAGS.OUTPUT_FILE}>
<${XML_TAGS.STATUS}>${status}</${XML_TAGS.STATUS}>
<${XML_TAGS.MESSAGE}>Background command "${description}" ${statusMessage}</${XML_TAGS.MESSAGE}>
</${XML_TAGS.TASK_NOTIFICATION}>
Read the output file to retrieve the result: ${outputPath}`;

  if (pushNotification) {
    pushNotification(
      {
        value: notification,
        mode: 'task-notification',
      },
      setAppState
    );
  }

  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true,
  } as BackgroundTask));
}

/**
 * Kill background task.
 * Original: $4A in chunks.91.mjs:1242-1251
 */
export function killBackgroundTask(taskId: string, setAppState: SetAppState): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;

    // Abort the task
    const taskWithAbort = task as BackgroundTask & {
      abortController?: AbortController;
      unregisterCleanup?: () => void;
    };
    taskWithAbort.abortController?.abort();
    taskWithAbort.unregisterCleanup?.();

    return {
      ...task,
      status: 'killed' as BackgroundTaskStatus,
      endTime: Date.now(),
    };
  });
}

/**
 * Update task progress.
 * Original: RI0 in chunks.91.mjs:1253-1261
 */
export function updateTaskProgress(
  taskId: string,
  progress: TaskProgressInfo,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    return {
      ...task,
      progress,
    } as BackgroundTask;
  });
}

/**
 * Mark task as completed.
 * Original: _I0 in chunks.91.mjs:1263-1274
 */
export function markTaskCompleted(agentResult: AgentResult, setAppState: SetAppState): void {
  const taskId = agentResult.agentId;

  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;

    // Unregister cleanup handler
    const taskWithCleanup = task as BackgroundTask & { unregisterCleanup?: () => void };
    taskWithCleanup.unregisterCleanup?.();

    return {
      ...task,
      status: 'completed' as BackgroundTaskStatus,
      result: agentResult,
      endTime: Date.now(),
    };
  });
}

/**
 * Mark task as failed.
 * Original: jI0 in chunks.91.mjs:1276-1286
 */
export function markTaskFailed(
  taskId: string,
  errorMessage: string,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;

    // Unregister cleanup handler
    const taskWithCleanup = task as BackgroundTask & { unregisterCleanup?: () => void };
    taskWithCleanup.unregisterCleanup?.();

    return {
      ...task,
      status: 'failed' as BackgroundTaskStatus,
      error: errorMessage,
      endTime: Date.now(),
    };
  });
}

/**
 * Mark bash task completed with exit code.
 */
export function markBashTaskCompleted(
  taskId: string,
  exitCode: number,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running' || task.type !== 'local_bash') return task;

    const bashTask = task as BackgroundBashTask & { unregisterCleanup?: () => void };
    bashTask.unregisterCleanup?.();

    return {
      ...task,
      status: (exitCode === 0 ? 'completed' : 'failed') as BackgroundTaskStatus,
      exitCode,
      endTime: Date.now(),
    };
  });
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
