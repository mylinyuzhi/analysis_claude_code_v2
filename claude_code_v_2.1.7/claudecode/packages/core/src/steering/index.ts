/**
 * @claudecode/core - Steering Module
 *
 * 8-layer steering system for guiding model behavior.
 *
 * Layers:
 * 1. System Reminder Injection - <system-reminder> XML tags
 * 2. isMeta Property - Hidden messages visible to model
 * 3. Context Modifiers - Tool-triggered context updates
 * 4. Append System Prompt - CLI --append-system-prompt
 * 5. Hook-Based Injection - 5 hook events with additionalContext
 * 6. Plan Mode Steering - Tool restrictions during planning
 * 7. Permission Mode Context - Auto-allow based on mode
 * 8. Read File State Tracking - File validation before Write/Edit
 *
 * Reconstructed from chunks.91.mjs, chunks.133.mjs, chunks.134.mjs, chunks.147.mjs
 */

// Types
export * from './types.js';

// Layer implementations
export {
  // Constants
  SYSTEM_REMINDER_REGEX,
  FULL_REMINDER_INTERVAL,
  PLAN_MODE_READONLY_TOOLS,
  PLAN_MODE_BLOCKED_TOOLS,

  // Layer 1: System Reminder
  extractSystemReminder,
  wrapInSystemReminder,
  hasSystemReminder,
  filterSystemReminderMessages,

  // Layer 2: Meta Messages
  createMetaBlock,
  filterMetaMessages,
  getMetaMessages,

  // Layer 3: Context Modifiers
  initExecutionContextFlow,
  serialExecutionContextFlow,
  applyContextUpdates,

  // Layer 4: Append System Prompt
  buildAppendSystemPrompt,

  // Layer 5: Hook Injection
  processHookInjections,

  // Layer 6: Plan Mode
  getPlanModeReminderType,
  buildPlanModeSystemReminder,
  getPlanModeToolRestrictions,
  isToolAllowedInPlanMode,

  // Layer 7: Permission Mode
  shouldAutoAllow,
  getEffectivePermissionMode,

  // Layer 8: Read File State
  buildReadFileStateMapping,
  mergeReadFileState,
  wasFileRead,
  getReadFileContent,

  // Combined
  injectUserContext,
  applySteeringLayers,
} from './layers.js';
