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
import { generateBashTaskId, generateAgentTaskId } from './registry.js';
import { 
  createBaseTask, 
  addTaskToState, 
  updateTask, 
  killBackgroundTask, 
  createBashTaskNotification,
  createBackgroundSessionNotification,
} from './lifecycle.js';
import { appendToOutputFile, createEmptyOutputFile, registerOutputFile } from './output.js';
import { isLocalBashTask, isLocalAgentTask } from './signal.js';
import { getAgentTranscriptPath } from './transcript.js';
import { extractTodoList, generateProgressSummary } from './summarize.js';
import { createRemoteSession, fetchRemoteSessionLogs } from './teleport.js';
import { streamApiCall } from '@claudecode/core';
import type {
  BackgroundTask,
  BackgroundBashTask,
  BackgroundAgentTask,
  RemoteAgentTask,
} from './types.js';

// ============================================
// Types
// ============================================

/**
 * Task spawn parameters.
 */
export interface TaskSpawnParams {
  description: string;
  prompt?: string;
  command?: string;
  title?: string;
  agentType?: string;
  model?: string;
  selectedAgent?: any;
  agentId?: string;
  shellCommand?: any;
}

/**
 * Task spawn context.
 */
export interface TaskSpawnContext {
  setAppState: (updater: (state: any) => any) => void;
  getAppState: () => any;
  abortController: AbortController;
}

/**
 * Task spawn result.
 */
export interface TaskSpawnResult {
  taskId: string;
  cleanup?: () => void;
}

/**
 * Task handler interface.
 */
export interface TaskHandler<T extends BackgroundTask = BackgroundTask> {
  name: string;
  type: T['type'];
  spawn(params: TaskSpawnParams, context: TaskSpawnContext): Promise<TaskSpawnResult>;
  kill(taskId: string, context: TaskSpawnContext): Promise<void>;
  renderStatus(task: T): React.ReactElement | null;
  renderOutput(output: unknown): React.ReactElement | null;
  getProgressMessage(task: T): string | null;
}

// ============================================
// Local Bash Task Handler
// ============================================

/**
 * Handler for local_bash tasks.
 * Original: es in chunks.121.mjs:755
 */
export const LocalBashTaskHandler: TaskHandler<BackgroundBashTask> = {
  name: 'LocalBashTask',
  type: 'local_bash',

  async spawn(params, context) {
    const { command, description, shellCommand } = params;
    const { setAppState } = context;
    const taskId = generateBashTaskId();

    createEmptyOutputFile(taskId);

    const cleanup = () => {
      // In source, this calls Iq0
      killBackgroundTask(taskId, setAppState);
    };

    const task: BackgroundBashTask = {
      ...createBaseTask(taskId, 'local_bash', description!),
      type: 'local_bash',
      status: 'running',
      command: command!,
      completionStatusSentInAttachment: false,
      shellCommand,
      unregisterCleanup: cleanup,
      stdoutLineCount: 0,
      stderrLineCount: 0,
      lastReportedStdoutLines: 0,
      lastReportedStderrLines: 0,
      isBackgrounded: true,
    };

    addTaskToState(task, setAppState);

    const streams = shellCommand.background(taskId);
    if (!streams) {
      shellCommand.result.then((res: any) => {
        const status = res.code === 0 ? 'completed' : 'failed';
        updateTask(taskId, setAppState, (t) => ({
          ...t,
          status,
          result: res,
          endTime: Date.now(),
        }));
        createBashTaskNotification(taskId, description!, status, res.code, setAppState);
      });
      return { taskId };
    }

    streams.stdoutStream.on('data', (data: any) => {
      const content = data.toString();
      appendToOutputFile(taskId, content);
      const lines = content.split('\n').filter((l: string) => l.length > 0).length;
      updateTask(taskId, setAppState, (t) => ({
        ...t,
        stdoutLineCount: (t as BackgroundBashTask).stdoutLineCount + lines,
      }));
    });

    streams.stderrStream.on('data', (data: any) => {
      const content = data.toString();
      appendToOutputFile(taskId, `[stderr] ${content}`);
      const lines = content.split('\n').filter((l: string) => l.length > 0).length;
      updateTask(taskId, setAppState, (t) => ({
        ...t,
        stderrLineCount: (t as BackgroundBashTask).stderrLineCount + lines,
      }));
    });

    shellCommand.result.then((res: any) => {
      let wasKilled = false;
      updateTask(taskId, setAppState, (t) => {
        if (t.status === 'killed') {
          wasKilled = true;
          return t;
        }
        return {
          ...t,
          status: res.code === 0 ? 'completed' : 'failed',
          result: res,
          shellCommand: null,
          unregisterCleanup: undefined,
          endTime: Date.now(),
        };
      });

      if (wasKilled) {
        createBashTaskNotification(taskId, description!, 'killed', res.code, setAppState);
      } else {
        const status = res.code === 0 ? 'completed' : 'failed';
        createBashTaskNotification(taskId, description!, status, res.code, setAppState);
      }
    });

    return {
      taskId,
      cleanup: () => {
        cleanup();
      }
    };
  },

  async kill(taskId, context) {
    killBackgroundTask(taskId, context.setAppState);
  },

  renderStatus(task) {
    if (!isLocalBashTask(task)) return null;
    const { status, command } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    return (
      <Box>
        <Text color={color}>[{status}] {command}</Text>
      </Box>
    );
  },

  renderOutput(output) {
    return (
      <Box>
        <Text>{String(output)}</Text>
      </Box>
    );
  },

  getProgressMessage(task) {
    if (!isLocalBashTask(task)) return null;
    const newStdoutLines = task.stdoutLineCount - task.lastReportedStdoutLines;
    const newStderrLines = task.stderrLineCount - task.lastReportedStderrLines;

    if (newStdoutLines === 0 && newStderrLines === 0) return null;

    const updates: string[] = [];
    if (newStdoutLines > 0) updates.push(`${newStdoutLines} line${newStdoutLines > 1 ? 's' : ''} of stdout`);
    if (newStderrLines > 0) updates.push(`${newStderrLines} line${newStderrLines > 1 ? 's' : ''} of stderr`);

    return `Background bash ${task.id} has new output: ${updates.join(', ')}. Read ${task.outputFile} to see output.`;
  },
};

// ============================================
// Local Agent Task Handler
// ============================================

/**
 * Handler for local_agent tasks.
 * Original: kZ1 in chunks.91.mjs:1412-1482
 */
export const LocalAgentTaskHandler: TaskHandler<BackgroundAgentTask> = {
  name: 'LocalAgentTask',
  type: 'local_agent',

  async spawn(params, context) {
    const { prompt, description, agentType, model, selectedAgent, agentId: X } = params;
    const { setAppState } = context;
    const agentId = X ?? generateAgentTaskId();

    registerOutputFile(agentId, getAgentTranscriptPath(agentId));
    const abortController = new AbortController();

    const task: BackgroundAgentTask = {
      ...createBaseTask(agentId, 'local_agent', description!),
      type: 'local_agent',
      status: 'running',
      agentId,
      prompt: prompt!,
      selectedAgent,
      agentType: agentType!,
      model: model!,
      abortController,
      retrieved: false,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: true,
    };

    const cleanup = () => {
      killBackgroundTask(agentId, setAppState);
    };
    task.unregisterCleanup = cleanup;

    addTaskToState(task, setAppState);

    return {
      taskId: agentId,
      cleanup: () => {
        cleanup();
        abortController.abort();
      }
    };
  },

  async kill(taskId, context) {
    killBackgroundTask(taskId, context.setAppState);
  },

  renderStatus(task) {
    if (!isLocalAgentTask(task)) return null;
    const { status, description, progress } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    const progressText = progress ? ` (${progress.toolUseCount} tools, ${progress.tokenCount} tokens)` : '';
    return (
      <Box>
        <Text color={color}>[{status}] {description}{progressText}</Text>
      </Box>
    );
  },

  renderOutput(output) {
    return (
      <Box>
        <Text>{String(output)}</Text>
      </Box>
    );
  },

  getProgressMessage(task) {
    if (!isLocalAgentTask(task)) return null;
    const progress = task.progress;
    if (!progress) return null;

    const newTools = progress.toolUseCount - task.lastReportedToolCount;
    const newTokens = progress.tokenCount - task.lastReportedTokenCount;

    if (newTools === 0 && newTokens === 0) return null;

    const updates: string[] = [];
    if (newTools > 0) updates.push(`${newTools} new tool${newTools > 1 ? 's' : ''} used`);
    if (newTokens > 0) updates.push(`${newTokens} new tokens`);

    return `Agent ${task.id} progress: ${updates.join(', ')}. The agent is still running. You usually do not need to read ${task.outputFile} unless you need specific details right away. You will receive a notification when the agent is done.`;
  },
};

// ============================================
// Remote Agent Task Handler
// ============================================

/**
 * Handler for remote_agent tasks (teleport feature).
 * Original: tu2 in chunks.121.mjs:185-252
 */
export const RemoteAgentTaskHandler: TaskHandler<RemoteAgentTask> = {
  name: 'RemoteAgentTask',
  type: 'remote_agent',

  async spawn(params, context) {
    const { command, title } = params;
    const { setAppState, abortController } = context;

    // Create remote session via API
    // Original: J = await cbA(...)
    const session = await createRemoteSession({
      initialMessage: command!,
      description: title!,
      signal: abortController.signal
    });

    if (!session) throw new Error('Failed to create remote session');

    const taskId = `r${session.id.substring(0, 6)}`;
    createEmptyOutputFile(taskId);

    const task: RemoteAgentTask = {
      ...createBaseTask(taskId, 'remote_agent', title!),
      type: 'remote_agent',
      status: 'running',
      sessionId: session.id,
      command: command!,
      title: session.title || title!,
      todoList: [],
      log: [],
      deltaSummarySinceLastFlushToAttachment: null,
      agentId: taskId,
      prompt: command!,
      selectedAgent: {}, // Remote
      agentType: 'remote',
      retrieved: false,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: true,
    };

    addTaskToState(task, setAppState);

    const stopPolling = startPollingRemoteSession(taskId, context);

    return {
      taskId,
      cleanup: () => {
        stopPolling();
      }
    };
  },

  async kill(taskId, context) {
    updateTask(taskId, context.setAppState, (t) => {
      if (t.status !== 'running') return t;
      return {
        ...t,
        status: 'killed',
        endTime: Date.now()
      };
    });
  },

  renderStatus(task) {
    const { status, title } = task;
    const color = status === 'running' ? 'yellow' : status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'gray';
    return (
      <Box>
        <Text color={color}>[{status}] {title}</Text>
      </Box>
    );
  },

  renderOutput(output) {
    return (
      <Box>
        <Text>{String(output)}</Text>
      </Box>
    );
  },

  getProgressMessage(task) {
    const deltaSummary = task.deltaSummarySinceLastFlushToAttachment;
    if (!deltaSummary) return null;

    return `Remote task ${task.id} progress: ${deltaSummary}. Read ${task.outputFile} to see full output.`;
  },
};

// ============================================
// Remote Polling
// ============================================

/**
 * Start polling remote session for updates.
 * Original: zi5 in chunks.121.mjs:110-155
 */
function startPollingRemoteSession(taskId: string, context: TaskSpawnContext): () => void {
  let isPolling = true;
  const pollIntervalMs = 1000;

  const poll = async () => {
    if (!isPolling) return;

    try {
      const task = (await context.getAppState()).tasks?.[taskId] as RemoteAgentTask;
      if (!task || task.status !== 'running') return;

      const sessionData = await fetchRemoteSessionLogs(task.sessionId);

      const resultEntry = sessionData.log.find((entry: any) => entry.type === 'result');
      const status = resultEntry
        ? (resultEntry.subtype === 'success' ? 'completed' : 'failed')
        : (sessionData.log.length > 0 ? 'running' : 'starting');

      const newEntries = sessionData.log.slice(task.log.length);
      let deltaSummary = task.deltaSummarySinceLastFlushToAttachment;

      if (newEntries.length > 0) {
        // Use streamApiCall from core for summarization
        const callLLM = async (params: any) => {
          const generator = streamApiCall({
            ...params,
            model: (task as any).model || 'claude-3-5-sonnet-20241022',
          });
          let finalResult = null;
          for await (const chunk of generator) {
            if (chunk.type === 'assistant') {
              finalResult = chunk;
            }
          }
          return finalResult;
        };
        
        deltaSummary = await generateProgressSummary(newEntries, deltaSummary, { callLLM });

        const formattedContent = newEntries.map((entry: any) => {
          if (entry.type === 'assistant') {
            return entry.message.content
              .filter((c: any) => c.type === 'text')
              .map((c: any) => c.text)
              .join('\n');
          }
          // Assuming eA is some formatting util
          return JSON.stringify(entry);
        }).join('\n');

        if (formattedContent) {
          appendToOutputFile(taskId, formattedContent + '\n');
        }
      }

      updateTask(taskId, context.setAppState, (t) => {
        const remoteT = t as RemoteAgentTask;
        return {
          ...remoteT,
          status: status === 'starting' ? 'running' : status,
          log: sessionData.log,
          todoList: extractTodoList(sessionData.log),
          deltaSummarySinceLastFlushToAttachment: deltaSummary,
          endTime: resultEntry ? Date.now() : undefined
        };
      });

      if (resultEntry) {
        const finalStatus = resultEntry.subtype === 'success' ? 'completed' : 'failed';
        notifyRemoteTaskCompletion(taskId, task.title, finalStatus, context.setAppState);
        return;
      }
    } catch (error) {
      console.error('[Background] Remote polling failed:', error);
    }

    if (isPolling) {
      setTimeout(poll, pollIntervalMs);
    }
  };

  poll();
  return () => { isPolling = false; };
}

/**
 * Notify remote task completion.
 * Original: Fi5 in chunks.121.mjs:56-74
 */
function notifyRemoteTaskCompletion(taskId: string, title: string, status: string, setAppState: any): void {
  createBackgroundSessionNotification(taskId, title, status as any, setAppState);
}

// ============================================
// Handler Registry
// ============================================

/**
 * Get all task type handlers.
 * Original: $i5 in chunks.121.mjs:255-257
 */
export function getTaskHandlers(): TaskHandler[] {
  return [LocalBashTaskHandler as any, LocalAgentTaskHandler as any, RemoteAgentTaskHandler as any];
}

/**
 * Get handler by task type.
 */
export function getTaskHandler(type: BackgroundTask['type']): TaskHandler | undefined {
  return getTaskHandlers().find((h) => h.type === type);
}
