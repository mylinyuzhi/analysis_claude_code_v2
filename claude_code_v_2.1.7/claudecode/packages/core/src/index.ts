/**
 * @claudecode/core
 *
 * Core execution engine for Claude Code.
 * Contains agent loop, LLM API, tools framework, state, and message handling.
 */

// ============================================
// LLM API Module
// ============================================

export * from './llm-api/index.js';

// ============================================
// Tools Framework
// ============================================

export * from './tools/index.js';

// ============================================
// Message Module
// ============================================

export * from './message/index.js';

// ============================================
// State Module
// ============================================

export * from './state/index.js';

// ============================================
// Agent Loop Module
// ============================================

export * from './agent-loop/index.js';

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
