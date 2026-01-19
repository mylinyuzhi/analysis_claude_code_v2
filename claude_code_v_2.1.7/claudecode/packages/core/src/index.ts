/**
 * @claudecode/core
 *
 * Core execution engine for Claude Code.
 * Contains agent loop, LLM API, tools framework, state, and message handling.
 */

// ============================================
// LLM API Module
// ============================================

// NOTE: 避免与 ./message、./tools、./state、./agent-loop 的同名导出产生冲突（TS2308）。
// 这些模块在 package.json 中也提供了子路径导出（如 @claudecode/core/llm-api）。
export * as llmApi from './llm-api/index.js';

// 兼容内部依赖（@claudecode/features）对顶层导出的引用。
export { streamApiCall } from './llm-api/index.js';
export type {
  MessagesRequest,
  StreamApiCallOptions,
  StreamingQueryResult,
} from './llm-api/index.js';

// ============================================
// Tools Framework
// ============================================

export * as tools from './tools/index.js';

// ============================================
// Message Module
// ============================================

export * from './message/index.js';

// ============================================
// State Module
// ============================================

export * as state from './state/index.js';

// ============================================
// Agent Loop Module
// ============================================

export * as agentLoop from './agent-loop/index.js';

// ============================================
// Steering Module
// ============================================

export * as steering from './steering/index.js';

// Re-export commonly used Steering functions at top level
export {
  extractSystemReminder,
  wrapInSystemReminder,
  filterSystemReminderMessages,
  createMetaBlock,
  filterMetaMessages,
  buildPlanModeSystemReminder,
  isToolAllowedInPlanMode,
  wasFileRead,
  applySteeringLayers,
  STEERING_LAYER_PRIORITY,
} from './steering/index.js';

export type {
  SteeringContext,
  SteeringMessage,
  UserContext,
  PlanModeState,
  ReadFileState,
  PermissionModeContext,
} from './steering/index.js';
