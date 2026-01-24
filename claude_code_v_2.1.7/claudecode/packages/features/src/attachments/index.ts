/**
 * @claudecode/features - Attachments Module
 *
 * System reminder/attachment generation system.
 *
 * This module handles:
 * - Type definitions for all 30+ attachment types
 * - Individual attachment generator functions
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
  generateTodoRemindersAttachment,
  generatePlanModeAttachment,
  generatePlanModeExitAttachment,
  generateVerifyPlanReminderAttachment,
  generateDelegateModeAttachment,
  generateDelegateModeExitAttachment,
  generateMemoryAttachment,
  generateTaskStatusAttachment,
  generateDiagnosticsAttachment,
  generateLspDiagnosticsAttachment,
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
  wrapAttachmentMessage,
  generateAttachmentsStreaming,
} from './orchestrator.js';

// Conversion
export {
  convertAttachmentToMessages,
  filterMetaMessages,
  getMetaMessages,
} from './conversion.js';
