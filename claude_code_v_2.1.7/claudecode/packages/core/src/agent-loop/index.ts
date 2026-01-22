/**
 * @claudecode/core - Agent Loop Module
 *
 * Core execution engine for Claude Code.
 *
 * Key components:
 * - coreMessageLoop (aN) - Main message processing loop
 * - StreamingToolExecutor (_H1) - Parallel tool execution during streaming
 * - runSubagentLoop ($f) - Sub-agent loop generator (placeholder)
 *
 * Reconstructed from chunks.133-134.mjs, chunks.112.mjs
 */

// Re-export types
export * from './types.js';

// Re-export streaming tool executor
export { StreamingToolExecutor } from './streaming-tool-executor.js';

// Re-export core message loop
export { coreMessageLoop } from './core-message-loop.js';

// Re-export subagent loop
export {
  runSubagentLoop,
  isYieldableMessage,
  filterForkContextMessages,
  resolveAgentModel,
  resolveAgentTools,
  getAgentSystemPrompt,
  createChildToolUseContext,
  setupMcpClients,
  loadAgentSkills,
  registerAgentHooks,
  unregisterAgentHooks,
} from './subagent-loop.js';

import { appendToOutputFile } from '@claudecode/platform';

// ============================================
// Task Management
// Reconstructed from chunks.91.mjs, chunks.121.mjs
// ============================================

import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync, existsSync, symlinkSync, writeFileSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';

/**
 * Generate task ID with type prefix.
 * Original: GyA() in chunks.91.mjs
 */
export function generateTaskId(type: 'local_bash' | 'local_agent' | 'remote_agent'): string {
  const prefixes = {
    local_bash: 'b',
    local_agent: 'a',
    remote_agent: 'r',
  };
  const prefix = prefixes[type] || 'x';
  const suffix = randomUUID().replace(/-/g, '').substring(0, 6);
  return `${prefix}${suffix}`;
}

/**
 * Background signal promise resolvers.
 * Original: yZ1 in chunks.91.mjs
 */
const backgroundSignalResolvers = new Map<string, () => void>();

/**
 * Cleanup handlers registered for exit.
 * Original: C6 pattern in chunks.91.mjs
 */
const cleanupHandlers = new Map<string, () => void>();

/**
 * App state type for task management.
 */
export interface AppState {
  tasks: Record<string, LocalAgentTask | LocalBashTask>;
}

/**
 * Local agent task structure.
 * Original: from chunks.91.mjs:1299-1309
 */
export interface LocalAgentTask {
  id: string;
  type: 'local_agent';
  description: string;
  status: 'running' | 'completed' | 'failed' | 'killed';
  startTime: number;
  endTime?: number;
  agentId: string;
  prompt: string;
  selectedAgent: unknown;
  agentType: string;
  abortController?: AbortController;
  unregisterCleanup?: () => void;
  retrieved: boolean;
  lastReportedToolCount: number;
  lastReportedTokenCount: number;
  isBackgrounded: boolean;
  outputPath?: string;
  error?: string;
  notified?: boolean;
}

/**
 * Local bash task structure.
 * Original: from chunks.121.mjs
 */
export interface LocalBashTask {
  id: string;
  type: 'local_bash';
  description: string;
  status: 'running' | 'completed' | 'failed' | 'killed';
  startTime: number;
  endTime?: number;
  command: string;
  shellCommand?: any; // Reference to ShellCommand instance
  unregisterCleanup?: () => void;
  cleanupTimeoutId?: NodeJS.Timeout;
  stdoutLineCount: number;
  stderrLineCount: number;
  lastReportedStdoutLines: number;
  lastReportedStderrLines: number;
  isBackgrounded: boolean;
  outputPath?: string;
  result?: {
    code: number;
    interrupted: boolean;
  };
  notified?: boolean;
}

/**
 * Get agent transcript path.
 * Original: yb() in chunks.148.mjs:692-696
 */
function getAgentTranscriptPath(agentId: string, cwd: string): string {
  const claudeDir = join(homedir(), '.claude');
  const sanitizedCwd = cwd.replace(/[^a-zA-Z0-9]/g, '-');
  const projectDir = join(claudeDir, 'projects', sanitizedCwd);
  const subagentsDir = join(projectDir, 'subagents');

  // Ensure directory exists
  if (!existsSync(subagentsDir)) {
    mkdirSync(subagentsDir, { recursive: true });
  }

  return join(subagentsDir, `agent-${agentId}.jsonl`);
}

/**
 * Get agent output directory.
 * Original: eSA() in chunks.86.mjs:97-104
 */
function getAgentOutputDir(cwd: string): string {
  // Source (eSA / getAgentOutputDir): ~/.claude/projects/<sanitized-cwd>/agents
  const claudeDir = join(homedir(), '.claude');
  const sanitizedCwd = cwd.replace(/[^a-zA-Z0-9]/g, '-');
  const projectDir = join(claudeDir, 'projects', sanitizedCwd);
  const outputDir = join(projectDir, 'agents');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  return outputDir;
}

/**
 * Register output file symlink for agent.
 * Original: OKA() in chunks.86.mjs:174-183
 */
export function registerOutputFile(agentId: string, transcriptPath: string, cwd: string): string {
  const outputDir = getAgentOutputDir(cwd);
  const outputPath = join(outputDir, `${agentId}.output`);

  try {
    // Replace existing file/symlink, then create symlink to transcript
    if (existsSync(outputPath)) {
      unlinkSync(outputPath);
    }
    symlinkSync(transcriptPath, outputPath);
  } catch {
    // If symlink fails, create empty file
    writeFileSync(outputPath, '');
  }

  return outputPath;
}

/**
 * Create base task structure.
 * Original: KO() in chunks.91.mjs:1204-1216
 */
export function createBaseTask(
  id: string,
  type: 'local_agent' | 'local_bash',
  description: string
): Partial<LocalAgentTask | LocalBashTask> {
  return {
    id,
    type,
    description,
    startTime: Date.now(),
    isBackgrounded: false,
  };
}

/**
 * Register cleanup handler for process exit.
 * Original: C6() pattern in chunks.91.mjs
 */
export function registerCleanupHandler(taskId: string, handler: () => void): () => void {
  cleanupHandlers.set(taskId, handler);

  const unregister = () => {
    cleanupHandlers.delete(taskId);
  };

  return unregister;
}

/**
 * Add task to app state.
 * Original: FO() in chunks.91.mjs:1388-1398
 */
export function addTaskToState(
  task: LocalAgentTask | LocalBashTask,
  setAppState: (updater: (state: AppState) => AppState) => void
): void {
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
 * Original: oY() in chunks.121.mjs:269-277
 */
export function updateTask<T extends LocalAgentTask | LocalBashTask>(
  taskId: string,
  setAppState: (updater: (state: AppState) => AppState) => void,
  updater: (task: T) => T
): void {
  setAppState((state) => {
    const task = state.tasks[taskId] as T;
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
 * Kill background task.
 * Original: $4A() in chunks.91.mjs:1242-1251
 */
export function killBackgroundTask(
  taskId: string,
  setAppState: (updater: (state: AppState) => AppState) => void
): void {
  updateTask<LocalAgentTask>(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;

    // Abort the task
    task.abortController?.abort();
    task.unregisterCleanup?.();

    return {
      ...task,
      status: 'killed',
      endTime: Date.now(),
    };
  });
}

/**
 * Kill local bash task.
 * Original: Iq0() in chunks.121.mjs:590-608
 */
export function killLocalBashTask(
  taskId: string,
  setAppState: (updater: (state: AppState) => AppState) => void
): void {
  updateTask<LocalBashTask>(taskId, setAppState, (task) => {
    if (task.status !== 'running') return task;

    try {
      task.shellCommand?.kill();
    } catch (e) {
      // ignore
    }

    task.unregisterCleanup?.();
    if (task.cleanupTimeoutId) {
      clearTimeout(task.cleanupTimeoutId);
    }

    return {
      ...task,
      status: 'killed',
      shellCommand: null,
      unregisterCleanup: undefined,
      cleanupTimeoutId: undefined,
      endTime: Date.now(),
    };
  });
}

/**
 * Notify bash task completion.
 * Original: ibA() in chunks.121.mjs:571-588
 */
export function notifyBashTaskCompletion(
  taskId: string,
  description: string,
  status: 'completed' | 'failed' | 'killed',
  exitCode: number | undefined,
  setAppState: any
): void {
  // Logic to push notification to UI/Agent loop
  // Placeholder for now as pushNotification logic is in @claudecode/ui or similar
  updateTask<LocalBashTask>(taskId, setAppState, (task) => ({
    ...task,
    notified: true,
  }));
}

/**
 * Check if task is a local agent task.
 * Original: Sr() in chunks.91.mjs:1218-1220
 */
export function isLocalAgentTask(task: unknown): task is LocalAgentTask {
  return (
    task !== null &&
    typeof task === 'object' &&
    (task as LocalAgentTask).type === 'local_agent'
  );
}

/**
 * Check if task is a local bash task.
 * Original: It() in chunks.121.mjs
 */
export function isLocalBashTask(task: unknown): task is LocalBashTask {
  return (
    task !== null &&
    typeof task === 'object' &&
    (task as LocalBashTask).type === 'local_bash'
  );
}

/**
 * Create fully backgrounded agent.
 * Original: L32() in chunks.91.mjs:1288-1315
 *
 * Creates an agent that runs entirely in the background from the start.
 * The agent execution happens asynchronously and can be monitored via TaskOutput.
 */
export function createFullyBackgroundedAgent(options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: { agentType?: string };
  setAppState: (updater: (state: AppState) => AppState) => void;
  cwd?: string;
}): LocalAgentTask {
  const { agentId, description, prompt, selectedAgent, setAppState, cwd = process.cwd() } = options;

  // Get transcript path and register output file
  const transcriptPath = getAgentTranscriptPath(agentId, cwd);
  const outputPath = registerOutputFile(agentId, transcriptPath, cwd);

  // Create abort controller
  const abortController = new AbortController();

  // Build task object
  const task: LocalAgentTask = {
    ...createBaseTask(agentId, 'local_agent', description),
    id: agentId,
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
    outputPath,
  } as LocalAgentTask;

  // Register cleanup handler for process exit
  const unregisterCleanup = registerCleanupHandler(agentId, async () => {
    killBackgroundTask(agentId, setAppState);
  });
  task.unregisterCleanup = unregisterCleanup;

  // Add task to state
  addTaskToState(task, setAppState);

  return task;
}

/**
 * Create backgroundable agent.
 * Original: O32() in chunks.91.mjs:1317-1351
 *
 * Creates an agent that starts in foreground but can be backgrounded via Ctrl+B.
 * Returns a backgroundSignal promise that resolves when the user presses Ctrl+B.
 */
export function createBackgroundableAgent(options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: { agentType?: string };
  setAppState: (updater: (state: AppState) => AppState) => void;
  cwd?: string;
}): { taskId: string; backgroundSignal: Promise<void> } {
  const { agentId, description, prompt, selectedAgent, setAppState, cwd = process.cwd() } = options;

  // Get transcript path and register output file
  const transcriptPath = getAgentTranscriptPath(agentId, cwd);
  const outputPath = registerOutputFile(agentId, transcriptPath, cwd);

  // Create abort controller
  const abortController = new AbortController();

  // Register cleanup handler
  const unregisterCleanup = registerCleanupHandler(agentId, async () => {
    killBackgroundTask(agentId, setAppState);
  });

  // Build task object
  const task: LocalAgentTask = {
    ...createBaseTask(agentId, 'local_agent', description),
    id: agentId,
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
    outputPath,
  } as LocalAgentTask;

  // Create background signal promise
  let resolveBackgroundSignal: () => void;
  const backgroundSignal = new Promise<void>((resolve) => {
    resolveBackgroundSignal = resolve;
  });

  // Store resolver for later triggering via Ctrl+B
  backgroundSignalResolvers.set(agentId, resolveBackgroundSignal!);

  // Add task to state
  addTaskToState(task, setAppState);

  return { taskId: agentId, backgroundSignal };
}

/**
 * Trigger background transition for an agent.
 * Original: M32() in chunks.91.mjs:1353-1373
 *
 * Called when user presses Ctrl+B to background a running agent.
 */
export function triggerBackgroundTransition(
  taskId: string,
  getAppState: () => AppState,
  setAppState: (updater: (state: AppState) => AppState) => void
): boolean {
  const task = getAppState().tasks[taskId];

  // Validate task
  if (!isLocalAgentTask(task) || task.isBackgrounded) {
    return false;
  }

  // Update task to backgrounded state
  setAppState((state) => {
    const currentTask = state.tasks[taskId];
    if (!isLocalAgentTask(currentTask)) {
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

  // Resolve background signal promise
  const resolver = backgroundSignalResolvers.get(taskId);
  if (resolver) {
    resolver();
    backgroundSignalResolvers.delete(taskId);
  }

  return true;
}

/**
 * Mark task as completed.
 * Original: _I0() in chunks.91.mjs:1263-1274
 */
export function markTaskCompleted(
  taskId: string,
  success: boolean,
  setAppState: (updater: (state: AppState) => AppState) => void,
  error?: string
): void {
  setAppState((state) => {
    const task = state.tasks[taskId];
    if (!task) {
      return state;
    }

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          status: success ? 'completed' : 'failed',
          endTime: Date.now(),
          ...(error ? { error } : {}),
        },
      },
    };
  });
}

/**
 * Mark task as failed.
 * Original: jI0() in chunks.91.mjs:1276-1286
 */
export function markTaskFailed(
  taskId: string,
  error: string,
  setAppState: (updater: (state: AppState) => AppState) => void
): void {
  markTaskCompleted(taskId, false, setAppState, error);
}

/**
 * Update task progress.
 * Original: RI0() in chunks.91.mjs:1253-1261
 */
export function updateTaskProgress(
  taskId: string,
  toolCount: number,
  tokenCount: number,
  setAppState: (updater: (state: AppState) => AppState) => void
): void {
  setAppState((state) => {
    const task = state.tasks[taskId];
    if (!task) {
      return state;
    }

    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...task,
          lastReportedToolCount: toolCount,
          lastReportedTokenCount: tokenCount,
        },
      },
    };
  });
}

/**
 * Aggregate async agent execution.
 * Original: Im2() in chunks.121.mjs:486-542
 *
 * Runs agent message generator in background, updating task state with progress.
 * Handles completion, failure, and abort signals.
 */
export function aggregateAsyncAgentExecution(
  messageGenerator: AsyncIterator<unknown>,
  taskId: string,
  setAppState: (updater: (state: AppState) => AppState) => void,
  finalCallback: (messages: unknown[]) => void,
  initialMessages: unknown[] = [],
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
          markTaskCompleted(taskId, false, setAppState, 'Aborted');
          return;
        }

        const { done, value } = await messageGenerator.next();
        if (done) break;

        allMessages.push(value);

        // Update progress tracking
        // Source alignment: MI0()/RI0() derives token count from assistant message usage
        if (value && typeof value === 'object') {
          const msg = value as {
            type?: string;
            message?: { content?: unknown[]; usage?: any };
          };
          if (msg.type === 'assistant' && Array.isArray(msg.message?.content)) {
            for (const block of msg.message.content) {
              if ((block as { type?: string }).type === 'tool_use') {
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
