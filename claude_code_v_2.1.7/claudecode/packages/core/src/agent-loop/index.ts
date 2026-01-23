/**
 * @claudecode/core - Agent Loop Module
 *
 * Core execution engine for Claude Code.
 *
 * Key components:
 * - coreMessageLoop (aN) - Main message processing loop
 * - StreamingToolExecutor (_H1) - Parallel tool execution during streaming
 * - runSubagentLoop ($f) - Sub-agent loop generator
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

// NOTE: Background task management logic has been moved to @claudecode/integrations/background-agents.
// If you need createFullyBackgroundedAgent, createBackgroundableAgent, etc., import them from there.
