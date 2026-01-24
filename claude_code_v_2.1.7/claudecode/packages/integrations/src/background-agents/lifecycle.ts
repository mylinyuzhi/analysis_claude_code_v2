/**
 * @claudecode/integrations - Background Task Lifecycle
 *
 * Functions for creating and managing the lifecycle of background tasks.
 * Reconstructed from chunks.91.mjs and chunks.121.mjs
 */

import { getAgentTranscriptPath } from './transcript.js';
import { formatOutputPath, registerOutputFile } from './output.js';
import type { 
  BackgroundAgentTask, 
  BackgroundBashTask, 
  RemoteAgentTask, 
  BackgroundTask, 
  SetAppState
} from './types.js';
import { TASK_NOTIFICATION_TAGS } from './types.js';
import { getBackgroundSignalMap, isLocalAgentTask, isLocalBashTask } from './signal.js';

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
): any {
  return {
    id: taskId,
    type: taskType,
    status: 'pending',
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
  setAppState((state: any) => ({
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
  setAppState((state: any) => {
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

// ============================================
// Agent Creation
// ============================================

/**
 * Create a fully backgrounded agent task.
 * Original: L32 in chunks.91.mjs:1288-1315
 */
export function createFullyBackgroundedAgent(options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: any;
  setAppState: SetAppState;
  cwd?: string;
}): BackgroundAgentTask {
  const { agentId, description, prompt, selectedAgent, setAppState } = options;

  // Register output file symlink to transcript path
  registerOutputFile(agentId, getAgentTranscriptPath(agentId, options.cwd));

  const abortController = new AbortController();

  const task: BackgroundAgentTask = {
    ...createBaseTask(agentId, 'local_agent', description),
    type: 'local_agent',
    status: 'running',
    agentId,
    prompt,
    selectedAgent,
    agentType: selectedAgent.agentType ?? 'general-purpose',
    abortController,
    retrieved: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: true,
  };

  const unregisterCleanup = () => {
    killBackgroundTask(agentId, setAppState);
  };
  task.unregisterCleanup = unregisterCleanup;

  addTaskToState(task, setAppState);

  return task;
}

/**
 * Create a backgroundable agent task.
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
  const { agentId, description, prompt, selectedAgent, setAppState } = options;

  registerOutputFile(agentId, getAgentTranscriptPath(agentId, options.cwd));

  const abortController = new AbortController();

  const unregisterCleanup = () => {
    killBackgroundTask(agentId, setAppState);
  };

  const task: BackgroundAgentTask = {
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
    isBackgrounded: false,
  };

  let resolveSignal: () => void;
  const backgroundSignal = new Promise<void>((resolve) => {
    resolveSignal = resolve;
  });

  // Store resolver in global/shared map for Ctrl+B
  getBackgroundSignalMap().set(agentId, resolveSignal!);

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
  progress: any,
  setAppState: SetAppState
): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    return {
      ...task,
      progress,
    };
  });
}

/**
 * Mark task as completed.
 * Original: _I0 in chunks.91.mjs:1263-1274
 */
export function markTaskCompleted(
  agentResult: { agentId: string; [key: string]: any },
  setAppState: SetAppState
): void {
  const taskId = agentResult.agentId;
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    task.unregisterCleanup?.();
    
    if (task.type === 'local_bash') {
      return {
        ...task,
        status: 'completed',
        result: { code: agentResult.code ?? 0, interrupted: agentResult.interrupted ?? false },
        endTime: Date.now(),
      };
    }
    
    return {
      ...task,
      status: 'completed',
      result: agentResult,
      endTime: Date.now(),
    } as BackgroundAgentTask;
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
    task.unregisterCleanup?.();
    return {
      ...task,
      status: 'failed',
      error,
      endTime: Date.now(),
    };
  });
}

/**
 * Kill a background task.
 * Original: $4A in chunks.91.mjs:1242-1251
 */
export function killBackgroundTask(taskId: string, setAppState: SetAppState): void {
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    
    if (task.type === 'local_bash') {
      task.shellCommand?.kill();
    } else {
      (task as BackgroundAgentTask).abortController?.abort();
    }
    
    task.unregisterCleanup?.();
    return {
      ...task,
      status: 'killed',
      endTime: Date.now(),
    };
  });
}

/**
 * Create agent task notification.
 * Original: C4A in chunks.91.mjs:1222-1240
 */
export function createTaskNotification(
  taskId: string,
  description: string,
  status: string,
  errorMsg: string | undefined,
  setAppState: SetAppState,
  result?: string
): void {
  const summary = status === 'completed'
    ? `Agent "${description}" completed`
    : status === 'failed'
      ? `Agent "${description}" failed: ${errorMsg || 'Unknown error'}`
      : `Agent "${description}" was stopped`;

  const transcriptPath = formatOutputPath(taskId);
  const resultXml = result ? `\n<${TASK_NOTIFICATION_TAGS.RESULT}>${result}</${TASK_NOTIFICATION_TAGS.RESULT}>` : '';

  const notification = `<${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
<${TASK_NOTIFICATION_TAGS.TASK_ID}>${taskId}</${TASK_NOTIFICATION_TAGS.TASK_ID}>
<${TASK_NOTIFICATION_TAGS.STATUS}>${status}</${TASK_NOTIFICATION_TAGS.STATUS}>
<${TASK_NOTIFICATION_TAGS.SUMMARY}>${summary}</${TASK_NOTIFICATION_TAGS.SUMMARY}>${resultXml}
</${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
Full transcript available at: ${transcriptPath}`;

  // Push notification to state
  setAppState((state: any) => ({
    ...state,
    queuedCommands: [...(state.queuedCommands || []), { value: notification, mode: 'task-notification' }]
  }));

  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true
  }));
}

/**
 * Create bash task completion notification.
 * Original: ibA in chunks.121.mjs:571-588
 */
export function createBashTaskNotification(
  taskId: string,
  description: string,
  status: 'completed' | 'failed' | 'killed',
  exitCode: number | undefined,
  setAppState: SetAppState
): void {
  const statusMessage = status === 'completed'
    ? `completed${exitCode !== undefined ? ` (exit code ${exitCode})` : ''}`
    : status === 'failed'
      ? `failed${exitCode !== undefined ? ` with exit code ${exitCode}` : ''}`
      : 'was killed';

  const outputPath = formatOutputPath(taskId);

  const notification = `<${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
<${TASK_NOTIFICATION_TAGS.TASK_ID}>${taskId}</${TASK_NOTIFICATION_TAGS.TASK_ID}>
<${TASK_NOTIFICATION_TAGS.OUTPUT_FILE}>${outputPath}</${TASK_NOTIFICATION_TAGS.OUTPUT_FILE}>
<${TASK_NOTIFICATION_TAGS.STATUS}>${status}</${TASK_NOTIFICATION_TAGS.STATUS}>
<${TASK_NOTIFICATION_TAGS.SUMMARY}>Background command "${description}" ${statusMessage}</${TASK_NOTIFICATION_TAGS.SUMMARY}>
</${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
Read the output file to retrieve the result: ${outputPath}`;

  setAppState((state: any) => ({
    ...state,
    queuedCommands: [...(state.queuedCommands || []), { value: notification, mode: 'task-notification' }]
  }));

  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true
  }));
}

/**
 * Create background session notification.
 * Original: Ni5 in chunks.121.mjs:433-450
 */
export function createBackgroundSessionNotification(
  taskId: string,
  title: string,
  status: 'completed' | 'failed',
  setAppState: SetAppState
): void {
  const summary = status === 'completed'
    ? `Background session "${title}" completed`
    : `Background session "${title}" failed`;

  const outputPath = formatOutputPath(taskId);

  const notification = `<${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
<${TASK_NOTIFICATION_TAGS.TASK_ID}>${taskId}</${TASK_NOTIFICATION_TAGS.TASK_ID}>
<${TASK_NOTIFICATION_TAGS.OUTPUT_FILE}>${outputPath}</${TASK_NOTIFICATION_TAGS.OUTPUT_FILE}>
<${TASK_NOTIFICATION_TAGS.STATUS}>${status}</${TASK_NOTIFICATION_TAGS.STATUS}>
<${TASK_NOTIFICATION_TAGS.SUMMARY}>${summary}</${TASK_NOTIFICATION_TAGS.SUMMARY}>
</${TASK_NOTIFICATION_TAGS.NOTIFICATION}>
Read the output file to retrieve the result: ${outputPath}`;

  setAppState((state: any) => ({
    ...state,
    queuedCommands: [...(state.queuedCommands || []), { value: notification, mode: 'task-notification' }]
  }));

  updateTask(taskId, setAppState, (task) => ({
    ...task,
    notified: true
  }));
}

/**
 * Mark agent task completed (handles background notification).
 * Original: Zm2 in chunks.121.mjs:421-431
 */
export function markAgentTaskCompleted(
  taskId: string,
  success: boolean,
  setAppState: SetAppState
): void {
  let wasBackgrounded = true;
  updateTask(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;
    wasBackgrounded = (task as any).isBackgrounded ?? true;
    task.unregisterCleanup?.();
    return {
      ...task,
      status: success ? 'completed' : 'failed',
      endTime: Date.now()
    };
  });

  if (wasBackgrounded) {
    createBackgroundSessionNotification(taskId, 'Background session', success ? 'completed' : 'failed', setAppState);
  }
}

// ============================================
// Async Aggregation
// ============================================

/**
 * Aggregate async agent execution.
 * Original: Im2 in chunks.121.mjs:486-542
 */
export function aggregateAsyncAgentExecution(
  messageGenerator: AsyncIterator<any>,
  taskId: string,
  setAppState: SetAppState,
  finalCallback: (messages: any[]) => void,
  initialMessages: any[] = [],
  abortSignal?: AbortSignal
): void {
  (async () => {
    try {
      const allMessages = [...initialMessages];
      const recentActivities: any[] = [];
      let toolUseCount = 0;
      let tokenCount = 0;

      while (true) {
        if (abortSignal?.aborted) {
          finalCallback(allMessages);
          return;
        }

        const { done, value } = await messageGenerator.next();
        if (done) break;

        if (value.type === 'user' || value.type === 'assistant' || value.type === 'system') {
          allMessages.push(value);
          if (value.type === 'assistant') {
            for (const content of value.message.content) {
              if (content.type === 'text') {
                tokenCount += Math.round(content.text.length / 4);
              } else if (content.type === 'tool_use') {
                toolUseCount++;
                recentActivities.push({
                  toolName: content.name,
                  input: content.input
                });
                if (recentActivities.length > 5) recentActivities.shift();
              }
            }
          }

          setAppState((state: any) => {
            const task = state.tasks[taskId];
            if (!task || task.type !== 'local_agent') return state;
            return {
              ...state,
              tasks: {
                ...state.tasks,
                [taskId]: {
                  ...task,
                  progress: {
                    tokenCount,
                    toolUseCount,
                    recentActivities: [...recentActivities]
                  },
                  messages: allMessages
                }
              }
            };
          });
        }
      }

      finalCallback(allMessages);
      markAgentTaskCompleted(taskId, true, setAppState);
    } catch (error) {
      console.error('[Background] Aggregation failed:', error);
      markAgentTaskCompleted(taskId, false, setAppState);
    }
  })();
}
