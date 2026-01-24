/**
 * @claudecode/integrations - Background Signal Handling
 *
 * Handles Ctrl+B backgrounding for running tasks.
 * Reconstructed from chunks.91.mjs and chunks.121.mjs
 */

import type { BackgroundTask, BackgroundAgentTask, BackgroundBashTask } from './types.js';
import { appendToOutputFile } from './output.js';

// ============================================
// Types
// ============================================

/**
 * Background signal resolver function.
 */
export type BackgroundSignalResolver = () => void;

/**
 * App state getter.
 */
export type GetAppState = () => { tasks: Record<string, BackgroundTask> };

/**
 * App state setter.
 */
export type SetAppState = (updater: (state: any) => any) => void;

// ============================================
// Background Signal Map
// ============================================

/**
 * Map of task IDs to their background signal resolvers.
 * When Ctrl+B is pressed, the resolver is called to unblock the caller.
 * Original: yZ1 in chunks.91.mjs
 */
const backgroundSignalMap = new Map<string, BackgroundSignalResolver>();

/**
 * Get the background signal map.
 */
export function getBackgroundSignalMap(): Map<string, BackgroundSignalResolver> {
  return backgroundSignalMap;
}

// ============================================
// Type Guards
// ============================================

/**
 * Check if task is a local agent task.
 * Original: Sr in chunks.91.mjs:1218-1220
 */
export function isLocalAgentTask(task: unknown): task is BackgroundAgentTask {
  return (
    typeof task === 'object' &&
    task !== null &&
    'type' in task &&
    (task as { type: string }).type === 'local_agent'
  );
}

/**
 * Check if task is a local bash task.
 * Original: It in chunks.121.mjs:567-569
 */
export function isLocalBashTask(task: unknown): task is BackgroundBashTask {
  return (
    typeof task === 'object' &&
    task !== null &&
    'type' in task &&
    (task as { type: string }).type === 'local_bash'
  );
}

// ============================================
// Background Transition
// ============================================

/**
 * Trigger background transition for agent task (Ctrl+B handler).
 * Original: M32 in chunks.91.mjs:1353-1373
 */
export function triggerBackgroundTransition(
  taskId: string,
  getAppState: GetAppState,
  setAppState: SetAppState
): boolean {
  const task = getAppState().tasks[taskId];

  // Only transition local_agent tasks that aren't already backgrounded
  if (!isLocalAgentTask(task) || task.isBackgrounded) {
    return false;
  }

  // Update task to backgrounded state
  setAppState((state: any) => {
    const currentTask = state.tasks[taskId];
    if (!isLocalAgentTask(currentTask)) return state;

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...currentTask,
          isBackgrounded: true,
        },
      },
    };
  });

  // Resolve the backgroundSignal Promise to unblock caller
  const resolveSignal = backgroundSignalMap.get(taskId);
  if (resolveSignal) {
    resolveSignal();
    backgroundSignalMap.delete(taskId);
  }

  return true;
}

/**
 * Trigger background transition for bash task (Ctrl+B).
 * Original: Li5 in chunks.121.mjs:637-698
 */
export function triggerBashBackgroundTransition(
  taskId: string,
  getAppState: GetAppState,
  setAppState: SetAppState
): boolean {
  const task = getAppState().tasks[taskId];

  // Validate task can be backgrounded
  if (!isLocalBashTask(task) || task.isBackgrounded || !task.shellCommand) {
    return false;
  }

  const { shellCommand } = task;
  const streams = shellCommand.background(taskId);
  if (!streams) return false;

  // Update task to backgrounded
  setAppState((state: any) => {
    const currentTask = state.tasks[taskId];
    if (!isLocalBashTask(currentTask) || currentTask.isBackgrounded) {
      return state;
    }

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...currentTask,
          isBackgrounded: true,
        },
      },
    };
  });

  // Attach data listeners to streams
  streams.stdoutStream.on('data', (data: Buffer | string) => {
    const content = data.toString();
    appendToOutputFile(taskId, content);
    const lineCount = content.split('\n').filter(l => l.length > 0).length;
    setAppState((state: any) => ({
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          stdoutLineCount: (state.tasks[taskId] as BackgroundBashTask).stdoutLineCount + lineCount,
        },
      },
    }));
  });

  streams.stderrStream.on('data', (data: Buffer | string) => {
    const content = data.toString();
    appendToOutputFile(taskId, `[stderr] ${content}`);
    const lineCount = content.split('\n').filter(l => l.length > 0).length;
    setAppState((state: any) => ({
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...state.tasks[taskId],
          stderrLineCount: (state.tasks[taskId] as BackgroundBashTask).stderrLineCount + lineCount,
        },
      },
    }));
  });

  return true;
}

/**
 * Register a backgroundable task with signal Promise.
 * Original: Part of O32 in chunks.91.mjs
 */
export function registerBackgroundableTask(taskId: string): Promise<void> {
  let resolveBackgroundSignal: BackgroundSignalResolver;

  const backgroundSignal = new Promise<void>((resolve) => {
    resolveBackgroundSignal = resolve;
  });

  backgroundSignalMap.set(taskId, resolveBackgroundSignal!);

  return backgroundSignal;
}

/**
 * Remove backgroundable task signal.
 * Original: R32 in chunks.91.mjs:1375-1390
 */
export function removeBackgroundableTaskSignal(taskId: string, setAppState: SetAppState): void {
  backgroundSignalMap.delete(taskId);

  let unregisterCleanup: (() => void) | undefined;
  setAppState((state: any) => {
    const task = state.tasks[taskId];
    if (!isLocalAgentTask(task) || task.isBackgrounded) return state;

    unregisterCleanup = task.unregisterCleanup;
    const { [taskId]: removed, ...remainingTasks } = state.tasks;
    return {
      ...state,
      tasks: remainingTasks,
    };
  });

  unregisterCleanup?.();
}

/**
 * Remove backgroundable bash task.
 * Original: Km2 in chunks.121.mjs:722-736
 */
export function removeBackgroundableBashTask(taskId: string, setAppState: SetAppState): void {
  let unregisterCleanup: (() => void) | undefined;
  setAppState((state: any) => {
    const task = state.tasks[taskId];
    if (!isLocalBashTask(task) || task.isBackgrounded) return state;

    unregisterCleanup = task.unregisterCleanup;
    const { [taskId]: removed, ...remainingTasks } = state.tasks;
    return {
      ...state,
      tasks: remainingTasks,
    };
  });

  unregisterCleanup?.();
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
