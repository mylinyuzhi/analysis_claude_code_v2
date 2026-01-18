/**
 * @claudecode/features - Attachments Module
 *
 * System reminder/attachment generation system.
 *
 * This module handles:
 * - Type definitions for all 30+ attachment types
 * - Individual attachment generators
 * - Orchestration with timeout handling
 * - Conversion to API message format
 *
 * Reconstructed from chunks.131.mjs, chunks.132.mjs, chunks.148.mjs
 */

// Types
export * from './types.js';

// Generators
export {
  generateTodoAttachment,
  generateTodoReminderAttachment,
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
  generateVerifyPlanReminderAttachment,
  generateDelegateModeAttachment,
  generateMemoryAttachment,
  generateTaskStatusAttachment,
  generateDiagnosticsAttachment,
  generateIdeSelectionAttachment,
  generateOpenedFileInIdeAttachment,
  generateOutputStyleAttachment,
  generateTokenUsageAttachment,
  generateBudgetAttachment,
  generateInvokedSkillsAttachment,
  generateCriticalSystemReminderAttachment,
  generateHookBlockingErrorAttachment,
  generateHookSuccessAttachment,
  generateHookAdditionalContextAttachment,
  generateEditedTextFileAttachment,
  generateCollabNotificationAttachment,
  generateChangedFilesAttachment,
  type GeneratorResult,
} from './generators.js';

// Orchestrator
export {
  generateAllAttachments,
  wrapWithErrorHandling,
  buildGeneratorList,
  wrapAttachmentMessage,
  generateAttachmentsStreaming,
  type AttachmentGenerationResult,
  type GeneratorConfig,
} from './orchestrator.js';

// Conversion
export {
  wrapInSystemReminder,
  extractSystemReminder,
  hasSystemReminder,
  stripSystemReminder,
  attachmentToText,
  filterSystemReminderMessages,
  getSystemReminderMessages,
  attachmentToApiMessage,
  attachmentsToApiMessage,
  type ContentBlock,
  type ApiMessage,
} from './conversion.js';
