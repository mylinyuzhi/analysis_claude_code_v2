/**
 * @claudecode/features - Plan Mode Attachments
 *
 * Logic for building plan mode attachments in the context window.
 * Reconstructed from chunks.131.mjs
 */

import type {
  AttachmentMessage,
  AttachmentToolUseContext,
  PlanModeAttachment,
  PlanModeAttachmentInfo,
  PlanModeAttachmentUnion,
  PlanModeExitAttachment,
  PlanModeReentryAttachment,
} from './types.js';
import { PLAN_MODE_CONSTANTS } from './types.js';
import { getPlanFilePath, checkPlanExists, planFileExists, readPlanFile, shortenPath } from './plan-file.js';
import { hasExitedPlanMode, needsPlanModeExitAttachment, setHasExitedPlanMode, setNeedsPlanModeExitAttachment } from './state.js';
import { getReminderType } from './system-reminders.js';

// ============================================
// Attachment Search
// ============================================

/**
 * Find information about previous plan mode attachments.
 * Original: R27 in chunks.131.mjs
 *
 * @param messages - Conversation history
 * @returns Info about last attachment and total count
 */
export function findPlanModeAttachmentInfo(
  messages: AttachmentMessage[]
): PlanModeAttachmentInfo {
  let turnCount = 0;
  let foundPlanModeAttachment = false;

  // Iterate backwards to find last plan mode attachment
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.attachment?.type === 'plan_mode' || msg?.attachment?.type === 'plan_mode_reentry') {
      foundPlanModeAttachment = true;
      break;
    }
    // Only count assistant messages (approximation of turns) or skip?
    // Original R27: checks if message type is assistant and not empty, then increments.
    // Assuming messages pass filter.
    if (msg?.type === 'assistant') {
        turnCount++;
    }
  }

  return { turnCount, foundPlanModeAttachment };
}

/**
 * Count plan mode attachments since last exit.
 * Original: _27 in chunks.131.mjs
 */
function countPlanModeAttachments(messages: AttachmentMessage[]): number {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.type === 'attachment' && msg.attachment) {
      if (msg.attachment.type === 'plan_mode_exit') {
        break; // Stop at exit
      }
      if (msg.attachment.type === 'plan_mode') {
        count++;
      }
    }
  }
  return count;
}

// ============================================
// Attachment Builders
// ============================================

/**
 * Build plan mode attachment if needed.
 * Original: j27 in chunks.131.mjs
 */
export async function buildPlanModeAttachment(
  messages: AttachmentMessage[],
  context: AttachmentToolUseContext
): Promise<PlanModeAttachmentUnion | undefined> {
  const { toolPermissionContext } = await context.getAppState();

  // Case 1: Active Plan Mode
  if (toolPermissionContext.mode === 'plan') {
    const { turnCount, foundPlanModeAttachment } = findPlanModeAttachmentInfo(messages);
    
    // Throttle: Don't send if recent attachment exists
    if (messages && messages.length > 0) {
      if (foundPlanModeAttachment && turnCount < PLAN_MODE_CONSTANTS.TURNS_BETWEEN_ATTACHMENTS) {
        return undefined; // Too recent
      }
    }

    // Determine reminder type: full every N attachments, sparse otherwise
    // Note: count is 1-based index of the *next* attachment effectively
    // Original logic: (_27(A) + 1) % N === 1 ? 'full' : 'sparse'
    const attachmentCount = countPlanModeAttachments(messages);
    const reminderType = getReminderType(attachmentCount); // getReminderType handles the +0 logic? 
    // Wait, getReminderType logic in system-reminders.ts:
    // if (count === 0 || count % 3 === 0) -> full.
    // If I pass `attachmentCount` (previous ones), then for the 0th (first one), count is 0. -> full.
    // For 1st (second one), count is 1. -> sparse.
    // For 2nd (third one), count is 2. -> sparse.
    // For 3rd (fourth one), count is 3. -> full.
    // This matches: 1st(full), 2nd(sparse), 3rd(sparse), 4th(full).
    // Original code: (_27(...) + 1) % 3 === 1.
    // If _27 returns 0 (0 prev), (0+1)%3 = 1 -> full.
    // If _27 returns 1 (1 prev), (1+1)%3 = 2 -> sparse.
    // If _27 returns 2 (2 prev), (2+1)%3 = 0 -> sparse.
    // If _27 returns 3 (3 prev), (3+1)%3 = 1 -> full.
    // My getReminderType(count) logic: count=0 -> full. count=1 -> sparse. count=3 -> full.
    // It seems consistent.

    return {
      type: 'plan_mode',
      reminderType: reminderType,
      isSubAgent: !!context.agentId,
      planFilePath: shortenPath(getPlanFilePath(context.agentId)),
      planExists: planFileExists(context.agentId),
    };
  }

  // Case 2: Re-entry Detection
  // If we have exited plan mode, but we see a plan slug in the history that implies
  // we were in plan mode for this session.
  if (hasExitedPlanMode()) {
    const planExists = checkPlanExists({ messages: messages as any });
    const planContent = readPlanFile(context.agentId);

    if (planExists && planContent !== null) {
      setHasExitedPlanMode(false); // Reset flag
      return {
        type: 'plan_mode_reentry',
        planFilePath: shortenPath(getPlanFilePath(context.agentId)),
      };
    }
  }

  // Case 3: Exit Attachment
  if (needsPlanModeExitAttachment()) {
    return buildPlanModeExitAttachment(context);
  }

  return undefined;
}

/**
 * Build plan mode exit attachment.
 * Original: T27 in chunks.131.mjs
 */
export async function buildPlanModeExitAttachment(
  context: AttachmentToolUseContext
): Promise<PlanModeExitAttachment | undefined> {
  if (needsPlanModeExitAttachment()) {
    const { toolPermissionContext } = await context.getAppState();
    
    // If still in plan mode, just clear flag (shouldn't happen if logic is correct but safe guard)
    if (toolPermissionContext.mode === 'plan') {
       setNeedsPlanModeExitAttachment(false);
       return undefined;
    }

    setNeedsPlanModeExitAttachment(false);

    return {
      type: 'plan_mode_exit',
      planFilePath: shortenPath(getPlanFilePath(context.agentId)),
      planExists: planFileExists(context.agentId),
    };
  }
  return undefined;
}
