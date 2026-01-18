/**
 * @claudecode/features - Compact Thresholds
 *
 * Threshold calculation for compaction triggers.
 * Reconstructed from chunks.132.mjs:1472-1493
 */

import { COMPACT_CONSTANTS, type ThresholdResult } from './types.js';

// ============================================
// Configuration State
// ============================================

let autoCompactEnabled = true;
let autoCompactTarget = 80000; // Default target
let availableTokens = 100000; // Model context limit

/**
 * Set auto-compact enabled state
 */
export function setAutoCompactEnabled(enabled: boolean): void {
  autoCompactEnabled = enabled;
}

/**
 * Check if auto-compact is enabled.
 * Original: nc() in chunks.132.mjs
 */
export function isAutoCompactEnabled(): boolean {
  return autoCompactEnabled;
}

/**
 * Set auto-compact target threshold.
 */
export function setAutoCompactTarget(target: number): void {
  autoCompactTarget = target;
}

/**
 * Get auto-compact target threshold.
 * Original: xs2() in chunks.132.mjs
 */
export function getAutoCompactTarget(): number {
  return autoCompactTarget;
}

/**
 * Set available tokens for current model.
 */
export function setAvailableTokens(tokens: number): void {
  availableTokens = tokens;
}

/**
 * Calculate available tokens for context.
 * Original: q3A() in chunks.132.mjs
 */
export function calculateAvailableTokens(): number {
  return availableTokens;
}

// ============================================
// Threshold Calculation
// ============================================

/**
 * Calculate compaction thresholds.
 * Original: ic() in chunks.132.mjs:1472-1493
 *
 * @param currentTokenCount - Current token count in conversation
 * @returns Threshold calculation result
 */
export function calculateThresholds(currentTokenCount: number): ThresholdResult {
  const autoTarget = getAutoCompactTarget();

  // Effective limit depends on whether auto-compact is enabled
  const effectiveLimit = isAutoCompactEnabled()
    ? autoTarget
    : calculateAvailableTokens();

  // Calculate percentage of context remaining
  const percentLeft = Math.max(
    0,
    Math.round(((effectiveLimit - currentTokenCount) / effectiveLimit) * 100)
  );

  // Warning threshold: WARNING_THRESHOLD_OFFSET tokens before limit
  const warningThreshold = effectiveLimit - COMPACT_CONSTANTS.WARNING_THRESHOLD_OFFSET;

  // Error threshold: ERROR_THRESHOLD_OFFSET tokens before limit
  const errorThreshold = effectiveLimit - COMPACT_CONSTANTS.ERROR_THRESHOLD_OFFSET;

  // Check threshold conditions
  const isAboveWarningThreshold = currentTokenCount >= warningThreshold;
  const isAboveErrorThreshold = currentTokenCount >= errorThreshold;

  // Auto-compact triggers when enabled AND above target
  const isAboveAutoCompactThreshold =
    isAutoCompactEnabled() && currentTokenCount >= autoTarget;

  // Blocking limit with optional override
  const defaultBlockingLimit =
    calculateAvailableTokens() - COMPACT_CONSTANTS.MIN_BLOCKING_OFFSET;
  const overrideValue = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  const parsedOverride = overrideValue ? parseInt(overrideValue, 10) : NaN;
  const blockingLimit =
    !isNaN(parsedOverride) && parsedOverride > 0 ? parsedOverride : defaultBlockingLimit;
  const isAtBlockingLimit = currentTokenCount >= blockingLimit;

  return {
    percentLeft,
    isAboveWarningThreshold,
    isAboveErrorThreshold,
    isAboveAutoCompactThreshold,
    isAtBlockingLimit,
  };
}

/**
 * Check if compaction should be triggered.
 * Original: l97() in chunks.132.mjs
 *
 * @param messages - Current conversation messages
 * @param sessionMemoryType - Type of session memory
 * @returns Whether auto-compact should trigger
 */
export async function shouldTriggerAutoCompact(
  messages: unknown[],
  sessionMemoryType?: string
): Promise<boolean> {
  // Early exit if no messages
  if (messages.length === 0) {
    return false;
  }

  // Get current token count (would need actual implementation)
  const currentTokenCount = estimateMessageTokens(messages);

  // Calculate thresholds
  const thresholds = calculateThresholds(currentTokenCount);

  // Trigger if above auto-compact threshold
  return thresholds.isAboveAutoCompactThreshold;
}

/**
 * Estimate tokens for messages.
 * Simplified implementation - would need actual tokenizer.
 */
export function estimateMessageTokens(messages: unknown[]): number {
  let total = 0;

  for (const message of messages) {
    const msg = message as { message?: { content?: unknown } };
    if (msg.message?.content) {
      if (typeof msg.message.content === 'string') {
        // Rough estimate: 4 characters per token
        total += Math.ceil(msg.message.content.length / 4);
      } else if (Array.isArray(msg.message.content)) {
        for (const block of msg.message.content) {
          const b = block as { type: string; text?: string; input?: unknown };
          if (b.type === 'text' && b.text) {
            total += Math.ceil(b.text.length / 4);
          } else if (b.type === 'tool_use' && b.input) {
            total += Math.ceil(JSON.stringify(b.input).length / 4);
          } else if (b.type === 'image') {
            total += COMPACT_CONSTANTS.TOKENS_PER_IMAGE;
          }
        }
      }
    }
  }

  return total;
}

/**
 * Estimate tokens with safety margin.
 * Original: FhA() in chunks.132.mjs
 */
export function estimateTokensWithSafetyMargin(messages: unknown[]): number {
  const baseEstimate = estimateMessageTokens(messages);
  // Add 10% safety margin
  return Math.ceil(baseEstimate * 1.1);
}

// ============================================
// Export
// ============================================

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
};
