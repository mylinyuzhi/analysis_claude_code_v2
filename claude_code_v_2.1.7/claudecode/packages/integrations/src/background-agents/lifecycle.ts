/**
 * @claudecode/integrations - Background Task Lifecycle
 *
 * Functions for creating and managing the lifecycle of background tasks.
 * Reconstructed from chunks.91.mjs
 */

import { getTaskRegistry, generateAgentTaskId } from './registry.js';
import { getAgentTranscriptPath, initTranscript, updateTranscriptMetadata } from './transcript.js';
import { formatOutputPath } from './output.js';
import type { BackgroundAgentTaskExtended, BackgroundTaskStatus, BackgroundTask } from './types.js';

// ============================================
// Types
// ============================================

export interface AppStateWithTasks {
  tasks: Record<string, BackgroundTask>;
  [key: string]: unknown;
}

export type SetAppState = (updater: (state: AppStateWithTasks) => AppStateWithTasks) => void;

// Define the executor type
type TaskExecutor = (context: {
  agentId: string;
  transcriptPath: string;
}) => Promise<any>;

// ============================================
// State Management Helpers
// ============================================

/**
 * Create base task object.
 * Original: KO in chunks.91.mjs:910-921
 */
export function createBaseTask(
  taskId: string,
  taskType: BackgroundTask['type'],
  description: string
): Pick<BackgroundTask, 'id' | 'type' | 'startTime' | 'status'> & { description: string; outputFile: string; outputOffset: number; notified: boolean } {
  return {
    id: taskId,
    type: taskType,
    status: "pending",
    description,
    startTime: Date.now(),
    outputFile: formatOutputPath(taskId),
    outputOffset: 0,
    notified: false,
  };
}

/**
 * Add task to app state.
 * Original: FO in chunks.121.mjs:283-291
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
 * Update task in app state.
 * Original: oY in chunks.121.mjs:269-281
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
 * Remove task from app state.
 * Original: R32 in chunks.91.mjs:1375-1390
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

// ============================================
// Agent Creation
// ============================================

/**
 * Create a fully backgrounded agent task.
 * The task starts immediately in the background.
 * Original: L32 in chunks.91.mjs:1288-1315
 */
export function createFullyBackgroundedAgent(options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: any;
  setAppState: SetAppState;
  cwd?: string;
}): BackgroundAgentTaskExtended {
  const { agentId, description, prompt, selectedAgent, setAppState, cwd = process.cwd() } = options;
  const registry = getTaskRegistry();
  const transcriptPath = getAgentTranscriptPath(agentId, cwd);
  const startTime = Date.now();

  // OKA(agentId, yb(iz(agentId)));
  
  // Create task entry
  const task: BackgroundAgentTaskExtended = {
    ...createBaseTask(agentId, 'local_agent', description),
    type: 'local_agent',
    status: 'running',
    agentId,
    prompt,
    selectedAgent,
    agentType: selectedAgent.agentType ?? 'general-purpose',
    abortController: new AbortController(),
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: true,
    transcriptPath,
  } as BackgroundAgentTaskExtended;

  const abortController = task.abortController as AbortController;
  
  const unregisterCleanup = () => {
    killBackgroundTask(agentId, setAppState);
  };
  (task as any).unregisterCleanup = unregisterCleanup;

  // Register task with Registry
  registry.register(task, { abortController });

  // Initialize transcript
  initTranscript(transcriptPath, {
    agentId,
    description,
    startTime,
    status: 'running',
    model: selectedAgent.model,
    subagentType: selectedAgent.agentType,
  });

  // Add to AppState
  addTaskToState(task, setAppState);

  return task;
}

/**
 * Create a backgroundable agent task.
 * Returns the agent ID and a promise that resolves when the task completes.
 * Original: O32 in chunks.91.mjs:1317-1351
 */
export function createBackgroundableAgent(options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: any;
  setAppState: SetAppState;
  cwd?: string;
}): { taskId: string; backgroundSignal: Promise<void> } {
  const { agentId, description, prompt, selectedAgent, setAppState, cwd = process.cwd() } = options;
  const registry = getTaskRegistry();
  const transcriptPath = getAgentTranscriptPath(agentId, cwd);
  const startTime = Date.now();

  // OKA(agentId, yb(iz(agentId)));
  const abortController = new AbortController();
  
  const unregisterCleanup = () => {
    killBackgroundTask(agentId, setAppState);
  };

  // Create task entry
  const task: BackgroundAgentTaskExtended = {
    ...createBaseTask(agentId, 'local_agent', description),
    type: 'local_agent',
    status: 'running',
    agentId,
    prompt,
    selectedAgent,
    agentType: selectedAgent.agentType ?? 'general-purpose',
    abortController,
    unregisterCleanup,
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: false, // Starts in foreground
    transcriptPath,
  } as BackgroundAgentTaskExtended;

  let resolveSignal: () => void;
  const backgroundSignal = new Promise<void>((resolve) => {
    resolveSignal = resolve;
  });

  // yZ1.set(agentId, resolveSignal);
  (global as any).backgroundSignalResolvers?.set(agentId, resolveSignal!);

  // Register task with Registry
  registry.register(task, { abortController });

  // Initialize transcript
  initTranscript(transcriptPath, {
    agentId,
    description,
    startTime,
    status: 'running',
    model: selectedAgent.model,
    subagentType: selectedAgent.agentType,
  });

  // Add to AppState
  addTaskToState(task, setAppState);

  return { taskId: agentId, backgroundSignal };
}

// ============================================
// Lifecycle Management
// ============================================

/**
 * Update task progress.
 * Original: RI0 in chunks.91.mjs:1253-1261
 */
export function updateTaskProgress(
  taskId: string,
  toolUseCount: number,
  tokenCount: number,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    return {
      ...task,
      lastReportedToolCount: toolUseCount,
      lastReportedTokenCount: tokenCount,
      progress: {
        ...(task as any).progress,
        toolUseCount,
        tokenCount,
      }
    } as any;
  });
}

/**
 * Mark task as completed.
 * Original: _I0 in chunks.91.mjs:1263-1274
 */
export function markTaskCompleted(
  taskId: string,
  result: any,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    (task as any).unregisterCleanup?.();
    return {
      ...task,
      status: 'completed',
      result,
      endTime: Date.now(),
    } as BackgroundTask;
  });
}

/**
 * Mark task as failed.
 * Original: jI0 in chunks.91.mjs:1276-1286
 */
export function markTaskFailed(
  taskId: string,
  error: string,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    (task as any).unregisterCleanup?.();
    return {
      ...task,
      status: 'failed',
      error,
      endTime: Date.now(),
    } as BackgroundTask;
  });
}

/**
 * Kill a background task.
 * Original: $4A in chunks.91.mjs:1242-1251
 */
export function killBackgroundTask(taskId: string, setAppState: SetAppState): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    (task as any).abortController?.abort();
    (task as any).unregisterCleanup?.();
    return {
      ...task,
      status: 'killed',
      endTime: Date.now(),
    } as BackgroundTask;
  });
}

/**
 * Mark task as cancelled.
 */
export function markTaskCancelled(
  taskId: string,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    (task as any).unregisterCleanup?.();
    return {
      ...task,
      status: 'cancelled',
      endTime: Date.now(),
    } as BackgroundTask;
  });
}

/**
 * Create task notification.
 * Original: C4A in chunks.91.mjs:1222-1240
 */
export function createTaskNotification(
  taskId: string,
  agentName: string,
  status: string,
  error: string | undefined,
  setAppState: SetAppState,
  result?: string
): void {
  // Logic to show system notification and update state
  const message = status === 'completed' 
    ? `Agent "${agentName}" completed` 
    : status === 'failed' 
      ? `Agent "${agentName}" failed: ${error || 'Unknown error'}` 
      : `Agent "${agentName}" was stopped`;
  
  const outputFile = formatOutputPath(taskId);
  const content = `<task-notification>
<id>${taskId}</task-notification>
<status>${status}</status>
<message>${message}</message>${result ? `\n<result>${result}</result>` : ''}
</task-notification>
Full transcript available at: ${outputFile}`;

  // Add to queued commands (wF)
  setAppState((state) => ({
    ...state,
    queuedCommands: [...(state as any).queuedCommands || [], { value: content, mode: 'task-notification' }]
  }));

  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true,
  }));
}

/**
 * Create bash task completion notification.
 */
export function createBashTaskNotification(
  taskId: string,
  description: string,
  status: 'completed' | 'failed' | 'killed',
  exitCode: number | undefined,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true,
  } as BackgroundTask));
}

/**
 * Mark bash task completed.
 */
export function markBashTaskCompleted(
  taskId: string,
  exitCode: number,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running' || task.type !== 'local_bash') return task;
    return {
      ...task,
      status: exitCode === 0 ? 'completed' : 'failed',
      exitCode,
      endTime: Date.now(),
    } as BackgroundTask;
  });
}

// ============================================
// Async Aggregation
// ============================================

/**
 * Aggregate async agent execution.
 * Original: Im2() in chunks.121.mjs:486-542
 */
export function aggregateAsyncAgentExecution(
  messageGenerator: AsyncIterator<any>,
  taskId: string,
  setAppState: SetAppState,
  finalCallback: (messages: any[]) => void,
  initialMessages: any[] = [],
  abortSignal?: AbortSignal
): void {
  // Run aggregation in background
  (async () => {
    const allMessages = [...initialMessages];
    let toolCount = 0;
    let tokenCount = 0;

    try {
      while (true) {
        // Check abort signal
        if (abortSignal?.aborted) {
          finalCallback(allMessages);
          markTaskFailed(taskId, 'Aborted', setAppState);
          return;
        }

        const { done, value } = await messageGenerator.next();
        if (done) break;

        allMessages.push(value);

        // Update progress tracking
        if (value && typeof value === 'object') {
          const msg = value as any;
          if (msg.type === 'assistant' && Array.isArray(msg.message?.content)) {
            for (const block of msg.message.content) {
              if (block.type === 'tool_use') {
                toolCount++;
              }
            }

            const usage = msg.message?.usage;
            if (usage && typeof usage === 'object') {
              const input = typeof usage.input_tokens === 'number' ? usage.input_tokens : 0;
              const output = typeof usage.output_tokens === 'number' ? usage.output_tokens : 0;
              const cacheRead = typeof usage.cache_read_input_tokens === 'number' ? usage.cache_read_input_tokens : 0;
              const cacheCreate =
                typeof usage.cache_creation_input_tokens === 'number' ? usage.cache_creation_input_tokens : 0;
              tokenCount = input + output + cacheRead + cacheCreate;
            }
          }
        }

        // Update progress periodically
        updateTaskProgress(taskId, toolCount, tokenCount, setAppState);
      }

      // Success
      finalCallback(allMessages);
      markTaskCompleted(taskId, true, setAppState);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      finalCallback(allMessages);
      markTaskFailed(taskId, errorMessage, setAppState);
    }
  })();
}
