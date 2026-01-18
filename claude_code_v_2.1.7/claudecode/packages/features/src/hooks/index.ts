/**
 * @claudecode/features - Hooks Module
 *
 * Event-driven hook system for Claude Code extensibility.
 *
 * Key components:
 * - executeHooksInREPL (At) - REPL hook execution generator
 * - executeHooksOutsideREPL (pU0) - Non-REPL hook execution
 * - Event triggers for all 12 hook event types
 * - Skill-level hook registration
 *
 * Reconstructed from chunks.90.mjs, chunks.92.mjs, chunks.120.mjs, chunks.112.mjs
 */

// Re-export types
export * from './types.js';

// Re-export context utilities
export {
  getCurrentSessionId,
  setCurrentSessionId,
  getSessionTranscriptPath,
  getAgentTranscriptPath,
  getCurrentWorkingDirectory,
  getProjectDirectory,
  createHookEnvironmentContext,
  getEnvFilePath,
} from './context.js';

// Re-export output parser
export {
  parseHookOutput,
  substituteArguments,
  extractTextFromOutput,
  isBlockingOutput,
  shouldSuppressOutput,
  isValidPromptHookResponse,
  parsePromptHookResponse,
} from './output-parser.js';

// Re-export command hook execution
export { executeCommandHook, executeCommandHookWithResult } from './command-hook.js';

// Re-export state management
export {
  isHookEqual,
  addSessionHook,
  removeHookFromState,
  getSessionHooks,
  getSessionFunctionHooks,
  findSessionHook,
  clearSessionHooks,
} from './state.js';

// Re-export aggregation and matching
export {
  getPolicyHooks,
  setPolicyHooks,
  setPluginHooks,
  getPluginHooks,
  clearPluginHooks,
  isAllowManagedHooksOnly,
  isHooksDisabled,
  aggregateHooksFromAllSources,
  matchHookPattern,
  getMatchingHooks,
} from './aggregation.js';

// Re-export main execution
export { executeHooksInREPL, executeHooksOutsideREPL } from './execution.js';

// Re-export event triggers
export {
  executePreToolHooks,
  executePostToolHooks,
  executePostToolFailureHooks,
  executeNotificationHooks,
  executeStopHooks,
  executeUserPromptSubmitHooks,
  executeSessionStartHooks,
  executeSessionEndHooks,
  executeSubagentStartHooks,
  executePreCompactHooks,
  executePermissionRequestHooks,
} from './triggers.js';

// Re-export skill hooks
export { registerSkillFrontmatterHooks, unregisterSkillHooks } from './skill-hooks.js';
