/**
 * @claudecode/features
 *
 * Core feature modules for Claude Code.
 */

// ============================================
// Compact Module
// ============================================

export * from './compact/index.js';

// ============================================
// Hooks Module
// ============================================

export * from './hooks/index.js';

// ============================================
// Plan Mode Module
// ============================================

export * from './plan-mode/index.js';

// ============================================
// Skills Module
// ============================================

export * from './skills/index.js';

// ============================================
// Slash Commands Module
// ============================================

export * from './slash-commands/index.js';

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
