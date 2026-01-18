/**
 * @claudecode/features - Plan Mode Attachment Generation
 *
 * Generate plan mode attachments for system context.
 * Reconstructed from chunks.131.mjs:3176-3244
 */

import type {
  PlanModeAttachment,
  PlanModeReentryAttachment,
  PlanModeExitAttachment,
  PlanModeAttachmentUnion,
  PlanModeAttachmentInfo,
  AttachmentMessage,
  AttachmentToolUseContext,
  PlanReminderType,
} from './types.js';
import { PLAN_MODE_CONSTANTS } from './types.js';
import { getPlanFilePath, readPlanFile } from './plan-file.js';
import {
  hasExitedPlanMode,
  setHasExitedPlanMode,
  needsPlanModeExitAttachment,
  setNeedsPlanModeExitAttachment,
} from './state.js';

// ============================================
// Helper Functions
// ============================================

/**
 * Check if message is empty (no content).
 * Original: dF1 in chunks.131.mjs
 */
function isEmptyMessage(message: AttachmentMessage): boolean {
  if (message.type !== 'assistant') return false;
  // Consider empty if no meaningful content
  return false; // Simplified - in real impl checks content array
}

// ============================================
// Attachment Throttling
// ============================================

/**
 * Find plan mode attachment info (turns since last attachment).
 * Original: R27 in chunks.131.mjs:3176-3192
 *
 * @param messages - Message array to search
 * @returns Turn count and whether attachment was found
 */
export function findPlanModeAttachmentInfo(
  messages: AttachmentMessage[]
): PlanModeAttachmentInfo {
  let turnCount = 0;
  let foundPlanModeAttachment = false;

  // Search backwards through messages
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];

    if (message?.type === 'assistant') {
      if (isEmptyMessage(message)) continue;
      turnCount++;
    } else if (
      message?.type === 'attachment' &&
      (message.attachment?.type === 'plan_mode' ||
        message.attachment?.type === 'plan_mode_reentry')
    ) {
      foundPlanModeAttachment = true;
      break;
    }
  }

  return { turnCount, foundPlanModeAttachment };
}

/**
 * Count plan_mode attachments since last exit.
 * Original: _27 in chunks.131.mjs:3195-3204
 *
 * @param messages - Message array to search
 * @returns Count of plan_mode attachments
 */
export function countPlanModeAttachments(messages: AttachmentMessage[]): number {
  let count = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];

    if (message?.type === 'attachment') {
      // Stop counting at plan_mode_exit
      if (message.attachment?.type === 'plan_mode_exit') break;

      if (message.attachment?.type === 'plan_mode') {
        count++;
      }
    }
  }

  return count;
}

// ============================================
// Main Attachment Builder
// ============================================

/**
 * Build plan mode attachment for system context.
 * Original: j27 in chunks.131.mjs:3207-3231
 *
 * @param messages - Current message array
 * @param toolUseContext - Tool use context with getAppState
 * @returns Array of plan mode attachments
 */
export async function buildPlanModeAttachment(
  messages: AttachmentMessage[] | undefined,
  toolUseContext: AttachmentToolUseContext
): Promise<PlanModeAttachmentUnion[]> {
  const appState = await toolUseContext.getAppState();

  // Only generate in plan mode
  if (appState.toolPermissionContext.mode !== 'plan') {
    return [];
  }

  // Throttle: Skip if recent plan attachment exists
  if (messages && messages.length > 0) {
    const { turnCount, foundPlanModeAttachment } =
      findPlanModeAttachmentInfo(messages);
    if (
      foundPlanModeAttachment &&
      turnCount < PLAN_MODE_CONSTANTS.TURNS_BETWEEN_ATTACHMENTS
    ) {
      return []; // Too recent
    }
  }

  const planFilePath = getPlanFilePath(toolUseContext.agentId);
  const planContent = readPlanFile(toolUseContext.agentId);
  const attachments: PlanModeAttachmentUnion[] = [];

  // Re-entry detection: exited plan mode before but re-entering with existing plan
  if (hasExitedPlanMode() && planContent !== null) {
    attachments.push({
      type: 'plan_mode_reentry',
      planFilePath: planFilePath,
    } as PlanModeReentryAttachment);
    setHasExitedPlanMode(false); // Reset
  }

  // Determine full vs sparse: full every N attachments, sparse otherwise
  const attachmentCount = countPlanModeAttachments(messages ?? []);
  const reminderType: PlanReminderType =
    (attachmentCount + 1) % PLAN_MODE_CONSTANTS.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
      ? 'full'
      : 'sparse';

  attachments.push({
    type: 'plan_mode',
    reminderType: reminderType,
    isSubAgent: !!toolUseContext.agentId,
    planFilePath: planFilePath,
    planExists: planContent !== null,
  } as PlanModeAttachment);

  return attachments;
}

// ============================================
// Exit Attachment Builder
// ============================================

/**
 * Build plan mode exit attachment.
 * Original: T27 in chunks.131.mjs:3233-3244
 *
 * @param toolUseContext - Tool use context with getAppState
 * @returns Array of exit attachments (0 or 1)
 */
export async function buildPlanModeExitAttachment(
  toolUseContext: AttachmentToolUseContext
): Promise<PlanModeExitAttachment[]> {
  // Only if exit attachment flag is set
  if (!needsPlanModeExitAttachment()) {
    return [];
  }

  const appState = await toolUseContext.getAppState();

  // If still in plan mode, just clear the flag
  if (appState.toolPermissionContext.mode === 'plan') {
    setNeedsPlanModeExitAttachment(false);
    return [];
  }

  // Clear flag
  setNeedsPlanModeExitAttachment(false);

  const planFilePath = getPlanFilePath(toolUseContext.agentId);
  const planExists = readPlanFile(toolUseContext.agentId) !== null;

  return [
    {
      type: 'plan_mode_exit',
      planFilePath: planFilePath,
      planExists: planExists,
    },
  ];
}

// ============================================
// Export
// ============================================

export {
  findPlanModeAttachmentInfo,
  countPlanModeAttachments,
  buildPlanModeAttachment,
  buildPlanModeExitAttachment,
};
