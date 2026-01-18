/**
 * @claudecode/features - Compact Dispatcher
 *
 * Main entry point for automatic compaction.
 * Reconstructed from chunks.132.mjs:1511-1535
 */

import { parseBoolean } from '@claudecode/shared';
import type { ConversationMessage } from '@claudecode/core';
import type {
  AutoCompactResult,
  CompactSessionContext,
  SessionMemoryCompactResult,
  FullCompactResult,
  SessionMemoryType,
} from './types.js';
import {
  shouldTriggerAutoCompact,
  getAutoCompactTarget,
  isAutoCompactEnabled,
} from './thresholds.js';
import { fullCompact } from './full-compact.js';

// ============================================
// Session Memory Compact (Placeholder)
// ============================================

/**
 * Session memory compact state
 */
let lastSummarizedId: string | undefined;

/**
 * Set last summarized message ID.
 * Original: oEA() in chunks.132.mjs
 */
export function setLastSummarizedId(id: string | undefined): void {
  lastSummarizedId = id;
}

/**
 * Get last summarized message ID.
 * Original: Xs2() in chunks.132.mjs
 */
export function getLastSummarizedId(): string | undefined {
  return lastSummarizedId;
}

/**
 * Check if session memory compact is enabled.
 * Original: rF1() in chunks.132.mjs
 */
export function isSessionMemoryCompactEnabled(): boolean {
  // Would check feature flags
  return false;
}

/**
 * Session memory compact.
 * Original: sF1() in chunks.132.mjs:1392-1422
 *
 * Uses cached session summary for fast compaction without LLM call.
 *
 * @param messages - Conversation messages
 * @param agentId - Agent ID
 * @param autoCompactThreshold - Token threshold
 * @returns Session memory compact result or null if not available
 */
export async function sessionMemoryCompact(
  messages: ConversationMessage[],
  agentId: string | undefined,
  autoCompactThreshold?: number
): Promise<SessionMemoryCompactResult | null> {
  // Check if session memory compact feature is enabled
  if (!isSessionMemoryCompactEnabled()) {
    return null;
  }

  // This would integrate with the session memory system
  // Placeholder implementation - returns null to fall through to full compact
  return null;
}

// ============================================
// Error Handling
// ============================================

/**
 * API abort error identifier.
 * Original: vkA in chunks.132.mjs
 */
const API_ABORT_ERROR = 'API_ABORT';

/**
 * Check if error is an expected abort error.
 * Original: sUA() in chunks.132.mjs
 */
function isExpectedError(error: unknown, errorType: string): boolean {
  if (error instanceof Error) {
    return error.message.includes(errorType) || error.name === errorType;
  }
  return false;
}

/**
 * Log error.
 * Original: e() in chunks.132.mjs
 */
function logError(error: Error): void {
  console.error('[Compact Error]', error.message);
}

// ============================================
// Auto-Compact Dispatcher
// ============================================

/**
 * Auto-compact dispatcher.
 * Original: ys2() in chunks.132.mjs:1511-1535
 *
 * Main entry point for automatic compaction. Tries session memory first,
 * then falls back to full LLM-based compaction.
 *
 * @param messages - Conversation messages
 * @param context - Compact session context
 * @param sessionMemoryType - Type of session memory
 * @returns Auto-compact result
 */
export async function autoCompactDispatcher(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  sessionMemoryType?: SessionMemoryType
): Promise<AutoCompactResult> {
  // Check if compaction is completely disabled
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if we should trigger auto-compact (threshold + feature checks)
  if (!(await shouldTriggerAutoCompact(messages, sessionMemoryType))) {
    return { wasCompacted: false };
  }

  // TIER 1: Try Session Memory Compact first (fastest, uses cached summary)
  const sessionMemoryResult = await sessionMemoryCompact(
    messages,
    context.agentId,
    getAutoCompactTarget()
  );

  if (sessionMemoryResult) {
    return {
      wasCompacted: true,
      compactionResult: sessionMemoryResult,
    };
  }

  // TIER 2: Fall back to Full Compact (slow, requires LLM call)
  try {
    const fullCompactResult = await fullCompact(
      messages,
      context,
      true,
      undefined,
      true // isAuto
    );

    // Clear the last summarized message ID after full compact
    setLastSummarizedId(undefined);

    return {
      wasCompacted: true,
      compactionResult: fullCompactResult,
    };
  } catch (error) {
    // Suppress expected "API aborted" errors, log others
    if (!isExpectedError(error, API_ABORT_ERROR)) {
      logError(error instanceof Error ? error : new Error(String(error)));
    }
    return { wasCompacted: false };
  }
}

/**
 * Manual compact dispatcher.
 *
 * Triggers compaction manually with optional custom instructions.
 *
 * @param messages - Conversation messages
 * @param context - Compact session context
 * @param customInstructions - Custom instructions for summary
 * @returns Full compact result
 */
export async function manualCompact(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  customInstructions?: string
): Promise<FullCompactResult> {
  return fullCompact(
    messages,
    context,
    true,
    customInstructions,
    false // isAuto
  );
}

/**
 * Check if auto-compact is available.
 */
export function isAutoCompactAvailable(): boolean {
  return isAutoCompactEnabled() && !parseBoolean(process.env.DISABLE_COMPACT);
}

// ============================================
// Export
// ============================================

export {
  setLastSummarizedId,
  getLastSummarizedId,
  isSessionMemoryCompactEnabled,
  sessionMemoryCompact,
  autoCompactDispatcher,
  manualCompact,
  isAutoCompactAvailable,
  API_ABORT_ERROR,
};
