/**
 * @claudecode/features - Compact Module
 *
 * Conversation compaction system for context window optimization.
 *
 * Key components:
 * - Threshold calculation (calculateThresholds)
 * - Session memory compact (fast, cached)
 * - Full compact (LLM-based)
 * - Micro-compact (tool results only)
 * - Auto-compact dispatcher
 */

// Re-export types
export * from './types.js';

// Re-export threshold functions
export {
  setAutoCompactEnabled,
  isAutoCompactEnabled,
  setAutoCompactTarget,
  getAutoCompactTarget,
  setAvailableTokens,
  calculateAvailableTokens,
  calculateThresholds,
  shouldTriggerAutoCompact,
  estimateMessageTokens,
  estimateTokensWithSafetyMargin,
} from './thresholds.js';

// Re-export context restoration
export {
  restoreRecentFilesAfterCompact,
  getTodoItems,
  createTodoAttachment,
  getCurrentPlanFilePath,
  readPlanFile,
  createPlanFileReferenceAttachment,
  getInvokedSkills,
  createInvokedSkillsAttachment,
  getActiveTaskStatuses,
  createTaskStatusAttachments,
  createBoundaryMarker,
  generateConversationId,
  formatSummaryContent,
  collectContextAttachments,
} from './context-restore.js';

// Re-export micro-compact
export {
  microCompact,
  CLEARED_MARKER,
} from './micro-compact.js';

// Re-export full compact
export {
  executePreCompactHooks,
  executePluginHooksForEvent,
  buildCompactInstructions,
  extractTextContent,
  extractUsageStats,
  generateConversationSummary,
  fullCompact,
} from './full-compact.js';

// Re-export dispatcher
export {
  setLastSummarizedId,
  getLastSummarizedId,
  isSessionMemoryCompactEnabled,
  sessionMemoryCompact,
  autoCompactDispatcher,
  manualCompact,
  isAutoCompactAvailable,
} from './dispatcher.js';
