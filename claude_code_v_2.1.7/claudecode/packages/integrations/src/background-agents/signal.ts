/**
 * @claudecode/integrations - Background Signal Handling
 *
 * Handles Ctrl+B backgrounding for running tasks.
 * Reconstructed from chunks.91.mjs:1317-1390
 *
 * Key symbols:
 * - yZ1 → backgroundSignalMap
 * - O32 → createBackgroundableAgent
 * - M32 → triggerBackgroundTransition
 * - R32 → removeBackgroundableTask
 */

import type { BackgroundTask, BackgroundAgentTask, BackgroundTaskStatus } from './types.js';

// ============================================
// Types
// ============================================

/**
 * Background signal resolver function.
 */
export type BackgroundSignalResolver = () => void;

/**
 * Backgroundable task result.
 */
export interface BackgroundableTaskResult {
  taskId: string;
  backgroundSignal: Promise<void>;
}

/**
 * App state getter.
 */
export type GetAppState = () => { tasks: Record<string, BackgroundTask> };

/**
 * App state setter.
 */
export type SetAppState = (updater: (state: { tasks: Record<string, BackgroundTask> }) => { tasks: Record<string, BackgroundTask> }) => void;

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
 * Get the background signal map (for testing).
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
export function isLocalAgentTask(task: unknown): task is BackgroundAgentTask & { type: 'local_agent' } {
  return (
    typeof task === 'object' &&
    task !== null &&
    'type' in task &&
    (task as { type: string }).type === 'local_agent'
  );
}

/**
 * Check if task is a local bash task.
 * Original: It in chunks.121.mjs
 */
export function isLocalBashTask(task: unknown): task is BackgroundTask & { type: 'local_bash' } {
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
 * Trigger background transition (Ctrl+B handler).
 * Transitions a foreground task to background mode.
 * Original: M32 in chunks.91.mjs:1353-1373
 *
 * @param taskId - The task ID to background
 * @param getAppState - Function to get current app state
 * @param setAppState - Function to update app state
 * @returns true if task was backgrounded, false otherwise
 */
export function triggerBackgroundTransition(
  taskId: string,
  getAppState: GetAppState,
  setAppState: SetAppState
): boolean {
  const task = getAppState().tasks[taskId];

  // Only transition local_agent tasks that aren't already backgrounded
  if (!isLocalAgentTask(task) || (task as { isBackgrounded?: boolean }).isBackgrounded) {
    return false;
  }

  // Update task to backgrounded state
  setAppState((state) => {
    const currentTask = state.tasks[taskId];
    if (!isLocalAgentTask(currentTask)) return state;

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...currentTask,
          isBackgrounded: true,
        } as BackgroundTask,
      },
    };
  });

  // Resolve the backgroundSignal Promise to unblock caller
  const resolveSignal = backgroundSignalMap.get(taskId);
  if (resolveSignal) {
    resolveSignal(); // This causes the awaited Promise to resolve
    backgroundSignalMap.delete(taskId);
  }

  return true;
}

/**
 * Trigger background transition for bash task (Ctrl+B).
 * Original: Li5 in chunks.121.mjs:637-667
 */
export function triggerBashBackgroundTransition(
  taskId: string,
  getAppState: GetAppState,
  setAppState: SetAppState
): boolean {
  const task = getAppState().tasks[taskId];

  // Validate task can be backgrounded
  if (!isLocalBashTask(task) || (task as { isBackgrounded?: boolean }).isBackgrounded) {
    return false;
  }

  // Update task to backgrounded
  setAppState((state) => {
    const currentTask = state.tasks[taskId];
    if (!isLocalBashTask(currentTask) || (currentTask as { isBackgrounded?: boolean }).isBackgrounded) {
      return state;
    }

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...currentTask,
          isBackgrounded: true,
        } as BackgroundTask,
      },
    };
  });

  return true;
}

/**
 * Register a backgroundable task with signal Promise.
 * Creates a Promise that resolves when Ctrl+B is pressed.
 * Original: Part of O32 in chunks.91.mjs:1317-1351
 */
export function registerBackgroundableTask(taskId: string): Promise<void> {
  let resolveBackgroundSignal: BackgroundSignalResolver;

  const backgroundSignal = new Promise<void>((resolve) => {
    resolveBackgroundSignal = resolve;
  });

  // Store resolver in backgroundSignalMap for Ctrl+B to trigger
  backgroundSignalMap.set(taskId, resolveBackgroundSignal!);

  return backgroundSignal;
}

/**
 * Remove backgroundable task signal.
 * Original: R32 in chunks.91.mjs:1375-1390
 */
export function removeBackgroundableTaskSignal(taskId: string): void {
  backgroundSignalMap.delete(taskId);
}

/**
 * Check if a task has a pending background signal.
 */
export function hasBackgroundSignal(taskId: string): boolean {
  return backgroundSignalMap.has(taskId);
}

/**
 * Clear all background signals (for cleanup).
 */
export function clearBackgroundSignals(): void {
  backgroundSignalMap.clear();
}

// ============================================
// Export
// ============================================

export {
  backgroundSignalMap,
  isLocalAgentTask,
  isLocalBashTask,
  triggerBackgroundTransition,
  triggerBashBackgroundTransition,
  registerBackgroundableTask,
  removeBackgroundableTaskSignal,
  hasBackgroundSignal,
  clearBackgroundSignals,
};
