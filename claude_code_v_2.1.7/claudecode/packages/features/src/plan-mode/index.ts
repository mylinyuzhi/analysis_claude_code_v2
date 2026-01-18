/**
 * @claudecode/features - Plan Mode Module
 *
 * Read-only exploration and planning phase for complex tasks.
 *
 * Key components:
 * - EnterPlanMode tool - Enters plan mode
 * - ExitPlanMode tool - Exits plan mode with user approval
 * - Plan file management - Slugs, paths, read/write
 * - State tracking - hasExitedPlanMode, needsPlanModeExitAttachment
 * - System reminders - Full, sparse, and subagent reminders
 *
 * Reconstructed from chunks.86.mjs, chunks.119.mjs, chunks.120.mjs, chunks.147.mjs
 */

// Re-export types
export * from './types.js';

// Re-export slug generator
export { generateSlug, TOTAL_COMBINATIONS } from './slug-generator.js';

// Re-export plan file management
export {
  getSessionId,
  setSessionId,
  getPlanSlugCache,
  cachePlanSlug,
  clearPlanSlugCacheForSession,
  getPlanDir,
  getUniquePlanSlug,
  getPlanFilePath,
  readPlanFile,
  checkPlanExists,
  planFileExists,
  writePlanFile,
  shortenPath,
} from './plan-file.js';

// Re-export state management
export {
  hasExitedPlanMode,
  setHasExitedPlanMode,
  needsPlanModeExitAttachment,
  setNeedsPlanModeExitAttachment,
  onToolPermissionModeChanged,
  resetPlanModeState,
  isInPlanMode,
} from './state.js';

// Re-export EnterPlanMode tool
export {
  ENTER_PLAN_MODE_NAME,
  ENTER_PLAN_MODE_DESCRIPTION,
  EnterPlanModeTool,
  getEnterPlanModeResultMessage,
} from './enter-plan-mode.js';

// Re-export ExitPlanMode tool
export {
  EXIT_PLAN_MODE_NAME,
  EXIT_PLAN_MODE_DESCRIPTION,
  ExitPlanModeTool,
} from './exit-plan-mode.js';

// Re-export system reminders
export {
  buildPlanModeSystemReminder,
  buildFullPlanReminder,
  buildSparsePlanReminder,
  buildSubAgentPlanReminder,
  getMaxPlanAgents,
  getMaxExploreAgents,
  getReminderType,
  ExploreAgentConfig,
  PlanAgentConfig,
} from './system-reminders.js';
export type { PlanModeReminderContext } from './system-reminders.js';

// Re-export attachment generation
export {
  findPlanModeAttachmentInfo,
  countPlanModeAttachments,
  buildPlanModeAttachment,
  buildPlanModeExitAttachment,
} from './attachments.js';
