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

// ============================================
// Placeholder: Task Management
// ============================================

/**
 * Create background task (placeholder).
 * Original: L32() in chunks.121.mjs
 */
export function createFullyBackgroundedAgent(_options: {
  agentId: string;
  description: string;
  prompt: string;
  selectedAgent: unknown;
  setAppState: unknown;
}): { taskId: string; outputFile: string } {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const outputFile = `/tmp/claude-agent-${taskId}.jsonl`;

  console.log(`[TaskManagement] Created background agent: ${taskId}`);

  return { taskId, outputFile };
}

/**
 * Create backgroundable agent (placeholder).
 * Original: O32() in chunks.121.mjs
 */
export function createBackgroundableAgent(_options: {
  agentId: string;
  description: string;
  setAppState: unknown;
}): { taskId: string; backgroundSignal: Promise<void> | undefined } {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  console.log(`[TaskManagement] Created backgroundable agent: ${taskId}`);

  // backgroundSignal would be a promise that resolves when Ctrl+B is pressed
  return { taskId, backgroundSignal: undefined };
}

/**
 * Mark task as completed (placeholder).
 * Original: Zm2() in chunks.121.mjs
 */
export function markTaskCompleted(
  taskId: string,
  success: boolean,
  _setAppState: unknown
): void {
  console.log(
    `[TaskManagement] Marked task ${taskId} as ${success ? 'completed' : 'failed'}`
  );
}

/**
 * Aggregate async agent execution (placeholder).
 * Original: Im2() in chunks.121.mjs:486-542
 */
export function aggregateAsyncAgentExecution(
  messageGenerator: AsyncIterator<unknown>,
  taskId: string,
  setAppState: unknown,
  finalCallback: (messages: unknown[]) => void,
  initialMessages: unknown[] = [],
  abortSignal?: AbortSignal
): void {
  console.log(`[TaskManagement] Started aggregating agent ${taskId}`);

  // Placeholder - would run in background and update task state
  (async () => {
    try {
      const allMessages = [...initialMessages];

      while (true) {
        if (abortSignal?.aborted) {
          finalCallback(allMessages);
          return;
        }

        const { done, value } = await messageGenerator.next();
        if (done) break;

        allMessages.push(value);
      }

      finalCallback(allMessages);
      markTaskCompleted(taskId, true, setAppState);
    } catch (error) {
      console.error(`[TaskManagement] Agent ${taskId} failed:`, error);
      markTaskCompleted(taskId, false, setAppState);
    }
  })();
}
