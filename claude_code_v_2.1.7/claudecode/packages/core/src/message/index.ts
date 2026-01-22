/**
 * @claudecode/core - Message Module
 *
 * Message abstraction layer for Claude Code.
 * Provides factory functions, type guards, and normalization utilities.
 *
 * Key components:
 * - Message types (AssistantMessage, UserMessage, etc.)
 * - Factory functions (createAssistantMessage, createUserMessage, etc.)
 * - Type guards (hasToolUse, hasToolResult, etc.)
 * - Normalization (normalizeMessagesToAPI)
 * - Utilities (extractXmlTagContent, splitMessagesToBlocks, etc.)
 */

// Re-export types
export * from './types.js';

// Re-export factory functions
export {
  EMPTY_CONTENT_PLACEHOLDER,
  createAssistantMessage,
  createTextAssistantMessage,
  createErrorMessage,
  createUserMessage,
  createUserMessageWithPrecedingBlocks,
  createContinuationPrompt,
  createLocalCommandCaveat,
  createProgressMessage,
  createSystemMessage,
  createCancelledToolResult,
  setCurrentModel,
  getCurrentModel,
} from './factory.js';

// Re-export type guards
export {
  isAssistantMessage,
  isUserMessage,
  isProgressMessage,
  isAttachmentMessage,
  isSystemMessage,
  hasToolUse,
  hasToolResult,
  hasToolResultBlocks,
  isHookAttachment,
  isLocalCommandMessage,
  isApiErrorMessage,
  hasSubstantiveContent,
  isFilteredMessage,
  isToolReference,
  isTextBlock,
  isToolUseBlock,
  isToolResultBlock,
  isThinkingBlock,
  isImageBlock,
} from './type-guards.js';

// Re-export normalization
export {
  reorderAttachments,
  mergeUserMessages,
  mergeAssistantMessages,
  mergeUserWithAttachment,
  normalizeContentToArray,
  reorderToolResultsFirst,
  mergeToolResultWithText,
  normalizeToolInput,
  filterToolReferences,
  removeAllToolReferences,
  stripToolUseCaller,
  normalizeMessagesToAPI,
  setToolSearchEnabled,
  isToolSearchEnabled,
  convertAttachmentToSystemMessage,
} from './normalization.js';

// Re-export utilities
export {
  extractXmlTagContent,
  splitMessagesToBlocks,
  getToolUseId,
  getAllToolUseIds,
  getToolResultErrors,
  getPendingToolUseIds,
  getFailedToolUseIds,
  reorderByToolUseGroups,
  buildMessageAnalysisCache,
  getSiblingToolUseIds,
  getProgressMessages,
  isHookInProgress,
  getTextContent,
  wrapSystemReminderText,
  wrapInSystemReminder,
} from './utils.js';

// Re-export plan instructions
export {
  generatePlanModeInstructions,
  generateFullPlanModeInstructions,
  generateSparsePlanModeInstructions,
  generateSubAgentPlanModeInstructions,
} from './plan-instructions.js';
