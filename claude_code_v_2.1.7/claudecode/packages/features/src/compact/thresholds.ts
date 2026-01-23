/**
 * @claudecode/features - Compact Thresholds
 *
 * Threshold calculation for compaction triggers.
 * Original: ic in chunks.132.mjs:1472-1493
 */

import { COMPACT_CONSTANTS, type ThresholdResult } from './types.js';
import { parseBoolean } from '@claudecode/shared';

// ============================================
// Configuration State
// ============================================

let autoCompactEnabled = true;
let autoCompactTarget: number = COMPACT_CONSTANTS.MIN_TOKENS_TO_PRESERVE; // uL0 = 13000
let availableTokens = 100000; // Model context limit

/**
 * Set auto-compact enabled state
 */
export function setAutoCompactEnabled(enabled: boolean): void {
  autoCompactEnabled = enabled;
}

/**
 * Check if auto-compact is enabled.
 * Original: nc in chunks.132.mjs:1495
 */
export function isAutoCompactEnabled(): boolean {
  if (parseBoolean(process.env.DISABLE_COMPACT)) return false;
  if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) return false;
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
 * Original: xs2 in chunks.132.mjs:1458
 */
export function getAutoCompactTarget(): number {
  let tokens = calculateAvailableTokens();
  let defaultTarget = tokens - COMPACT_CONSTANTS.MIN_TOKENS_TO_PRESERVE; // uL0 = 13000
  
  // Handle CLAUDE_AUTOCOMPACT_PCT_OVERRIDE
  const pctOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (pctOverride) {
    const pct = parseFloat(pctOverride);
    if (!isNaN(pct) && pct > 0 && pct <= 100) {
      const calculated = Math.floor(tokens * (pct / 100));
      return Math.min(calculated, defaultTarget);
    }
  }
  
  return defaultTarget;
}

/**
 * Set available tokens for current model.
 */
export function setAvailableTokens(tokens: number): void {
  availableTokens = tokens;
}

/**
 * Calculate available tokens for context.
 * Original: q3A in chunks.132.mjs:1452
 */
export function calculateAvailableTokens(): number {
  // In source, this subtracts some buffers (dL0) from total (SM)
  // For now, return the set available tokens.
  return availableTokens;
}

// ============================================
// Threshold Calculation
// ============================================

/**
 * Calculate compaction thresholds.
 * Original: ic in chunks.132.mjs:1472-1493
 *
 * @param currentTokenCount - Current token count in conversation
 * @returns Threshold calculation result
 */
export function calculateThresholds(currentTokenCount: number): ThresholdResult {
  const target = getAutoCompactTarget();
  const enabled = isAutoCompactEnabled();
  const totalLimit = calculateAvailableTokens();

  // Effective base for percentage and warnings
  // Original: B = nc() ? Q : q3A()
  const effectiveBase = enabled ? target : totalLimit;

  // Calculate percentage of context remaining
  // Original: G = Math.max(0, Math.round((B - A) / B * 100))
  const percentLeft = Math.max(
    0,
    Math.round(((effectiveBase - currentTokenCount) / effectiveBase) * 100)
  );

  // Warning threshold: WARNING_THRESHOLD_OFFSET tokens before limit
  // Original: Z = B - c97
  const warningThreshold = effectiveBase - COMPACT_CONSTANTS.WARNING_THRESHOLD_OFFSET;

  // Error threshold: ERROR_THRESHOLD_OFFSET tokens before limit
  // Original: Y = B - p97
  const errorThreshold = effectiveBase - COMPACT_CONSTANTS.ERROR_THRESHOLD_OFFSET;

  // Check threshold conditions
  const isAboveWarningThreshold = currentTokenCount >= warningThreshold;
  const isAboveErrorThreshold = currentTokenCount >= errorThreshold;

  // Auto-compact triggers when enabled AND above target
  // Original: I = nc() && A >= Q
  const isAboveAutoCompactThreshold = enabled && currentTokenCount >= target;

  // Blocking limit with optional override
  // Original: D = q3A() - mL0
  const defaultBlockingLimit = totalLimit - COMPACT_CONSTANTS.MIN_BLOCKING_OFFSET;
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
 * Original: l97 in chunks.132.mjs:1501
 *
 * @param messages - Current conversation messages
 * @param sessionMemoryType - Type of session memory
 * @returns Whether auto-compact should trigger
 */
export async function shouldTriggerAutoCompact(
  messages: unknown[],
  sessionMemoryType?: string
): Promise<boolean> {
  // Mirrors chunks.132.mjs: l97(A, Q) early-return for session_memory
  if (sessionMemoryType === 'session_memory') {
    return false;
  }

  // Early exit if no messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return false;
  }

  // Mirrors chunks.132.mjs: nc() gating
  if (!isAutoCompactEnabled()) {
    return false;
  }

  // Get current token count
  const currentTokenCount = estimateMessageTokens(messages);

  // Calculate thresholds
  const thresholds = calculateThresholds(currentTokenCount);

  // Trigger if above auto-compact threshold
  return thresholds.isAboveAutoCompactThreshold;
}

/**
 * Simplified character-based token estimation.
 * Original: l7() equivalent
 */
function countTokens(text: string): number {
  // Rough estimate: 4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Estimate tokens for messages.
 * Original: js2 in chunks.132.mjs:1071 (for content)
 */
export function estimateMessageTokens(messages: unknown[]): number {
  let total = 0;

  for (const message of messages) {
    const msg = message as { type?: string; message?: { content?: unknown } };
    if (msg.type !== 'user' && msg.type !== 'assistant') continue;
    
    if (msg.message?.content) {
      if (typeof msg.message.content === 'string') {
        total += countTokens(msg.message.content);
      } else if (Array.isArray(msg.message.content)) {
        for (const block of msg.message.content) {
          if (block.type === 'text' && typeof block.text === 'string') {
            total += countTokens(block.text);
          } else if (block.type === 'tool_result') {
            // Original: js2(G)
            total += estimateToolResultTokens(block);
          } else if (block.type === 'image') {
            total += COMPACT_CONSTANTS.TOKENS_PER_IMAGE; // _s2 = 2000
          } else {
            // Fallback: JSON stringify unknown blocks
            total += countTokens(JSON.stringify(block));
          }
        }
      }
    }
  }

  return total;
}

/**
 * Estimate tokens for tool result block.
 * Original: js2 in chunks.132.mjs:1071
 */
function estimateToolResultTokens(block: any): number {
  if (!block.content) return 0;
  if (typeof block.content === 'string') return countTokens(block.content);
  if (Array.isArray(block.content)) {
    return block.content.reduce((acc: number, item: any) => {
      if (item.type === 'text' && typeof item.text === 'string') return acc + countTokens(item.text);
      if (item.type === 'image') return acc + COMPACT_CONSTANTS.TOKENS_PER_IMAGE;
      return acc;
    }, 0);
  }
  return 0;
}

/**
 * Estimate tokens with safety margin.
 * Original: FhA in chunks.132.mjs:1087
 */
export function estimateTokensWithSafetyMargin(messages: unknown[]): number {
  const baseEstimate = estimateMessageTokens(messages);
  // Source uses a 1.33x safety factor
  // Original: return Math.ceil(Q * 1.3333333333333333)
  return Math.ceil(baseEstimate * 1.3333333333333333);
}
