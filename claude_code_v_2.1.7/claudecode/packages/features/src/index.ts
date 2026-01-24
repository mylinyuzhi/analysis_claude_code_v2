/**
 * @claudecode/features
 *
 * Core feature modules for Claude Code.
 */

// ============================================
// Compact Module
// ============================================

export * as compact from './compact/index.js';

// Re-export compact entry points used by core
export { microCompact, autoCompactDispatcher } from './compact/index.js';

// ============================================
// Hooks Module
// ============================================

export * from './hooks/index.js';

// ============================================
// Plan Mode Module
// ============================================

export * as planMode from './plan-mode/index.js';

// ============================================
// Skills Module
// ============================================

export * from './skills/index.js';

// ============================================
// Slash Commands Module
// ============================================

export * as slashCommands from './slash-commands/index.js';

// ============================================
// Thinking Module
// ============================================

export * as thinking from './thinking/index.js';

// Re-export commonly used Thinking functions at top level
export {
  detectThinkingKeyword,
  isModelThinkingCapable,
  getModelMaxThinkingTokens,
  isThinkingEnabled,
  calculateMaxThinkingTokens,
  buildThinkingConfig,
  isThinkingBlock,
  filterCompactableMessages,
  removeTrailingThinkingBlocks,
  filterOrphanedThinkingMessages,
  THINKING_CONSTANTS,
} from './thinking/index.js';

export type {
  ThinkingLevel,
  ThinkingMetadata,
  ThinkingConfig,
  ThinkingDetectionResult,
} from './thinking/index.js';

// ============================================
// Attachments Module
// ============================================

export * as attachments from './attachments/index.js';

// Re-export commonly used Attachment functions at top level
export {
  generateAllAttachments,
  wrapInSystemReminder,
  extractSystemReminder,
  attachmentToApiMessage,
  attachmentsToApiMessage,
  ATTACHMENT_CONSTANTS,
  ATTACHMENT_TYPES,
} from './attachments/index.js';

export type {
  Attachment,
  AttachmentType,
  AttachmentContext,
  AttachmentMessage,
  AttachmentGenerationResult,
} from './attachments/index.js';
