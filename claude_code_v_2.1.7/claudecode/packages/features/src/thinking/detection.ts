/**
 * @claudecode/features - Thinking Detection
 *
 * Thinking mode detection and activation logic.
 * Reconstructed from chunks.68.mjs
 */

import type {
  ThinkingLevel,
  ThinkingDetectionResult,
  ThinkingMetadata,
  ModelThinkingInfo,
} from './types.js';
import { THINKING_CONSTANTS } from './types.js';

// ============================================
// Keyword Detection
// ============================================

/**
 * Detect thinking keyword in message text.
 * Original: CjA (detectThinkingKeyword) in chunks.68.mjs:3513-3518
 *
 * @param messageText - Message text to search
 * @returns Detection result with tokens and level
 */
export function detectThinkingKeyword(messageText: string): ThinkingDetectionResult {
  const hasUltrathink = /\bultrathink\b/i.test(messageText);
  return {
    tokens: hasUltrathink ? THINKING_CONSTANTS.ULTRATHINK : THINKING_CONSTANTS.NONE,
    level: hasUltrathink ? 'high' : 'none',
  };
}

/**
 * Extract keyword positions for highlighting.
 * Original: zDA (extractKeywordPositions) in chunks.68.mjs:3521-3531
 */
export function extractKeywordPositions(
  text: string
): Array<{ start: number; end: number }> {
  const positions: Array<{ start: number; end: number }> = [];
  const regex = /\bultrathink\b/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    positions.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return positions;
}

// ============================================
// Model Capability Detection
// ============================================

/**
 * Check if model supports thinking mode.
 * Original: wz8 (isModelThinkingCapable) in chunks.68.mjs:3533-3538
 *
 * @param modelName - Model name to check
 * @param provider - Optional provider (foundry, firstParty, etc.)
 * @returns True if model supports thinking
 */
export function isModelThinkingCapable(
  modelName: string,
  provider?: string
): boolean {
  // For Foundry/FirstParty: all non-Claude-3 models support thinking
  if (provider === 'foundry' || provider === 'firstParty') {
    return !modelName.toLowerCase().includes('claude-3-');
  }

  // For other providers: only Sonnet-4+ and Opus-4+ support thinking
  const lowerModel = modelName.toLowerCase();
  return lowerModel.includes('sonnet-4') || lowerModel.includes('opus-4');
}

/**
 * Get maximum thinking tokens for a model.
 * Original: o5A (getModelMaxThinkingTokens) in chunks.1.mjs:2240-2252
 *
 * @param modelName - Model name
 * @returns Maximum thinking token budget
 */
export function getModelMaxThinkingTokens(modelName: string): number {
  const model = modelName.toLowerCase();

  if (model.includes('3-5')) return 8192;
  if (model.includes('claude-3-opus')) return 4096;
  if (model.includes('claude-3-sonnet')) return 8192;
  if (model.includes('claude-3-haiku')) return 4096;
  if (model.includes('opus-4-5')) return 64000;
  if (model.includes('opus-4')) return 32000;
  if (model.includes('sonnet-4') || model.includes('haiku-4')) return 64000;

  return THINKING_CONSTANTS.DEFAULT_MAX_TOKENS;
}

/**
 * Get thinking capability info for a model.
 */
export function getModelThinkingInfo(
  modelName: string,
  provider?: string
): ModelThinkingInfo {
  return {
    supportsThinking: isModelThinkingCapable(modelName, provider),
    maxThinkingTokens: getModelMaxThinkingTokens(modelName),
  };
}

// ============================================
// Enabled State Detection
// ============================================

/**
 * Check if thinking is enabled.
 * Original: q91 (isThinkingEnabled) in chunks.68.mjs:3540-3547
 *
 * Priority order:
 * 1. Environment variable (MAX_THINKING_TOKENS)
 * 2. User settings (alwaysThinkingEnabled)
 * 3. Model capability
 */
export function isThinkingEnabled(options: {
  modelName: string;
  provider?: string;
  envMaxThinkingTokens?: string;
  alwaysThinkingEnabled?: boolean;
}): boolean {
  // Priority 1: Environment variable override
  if (options.envMaxThinkingTokens) {
    return parseInt(options.envMaxThinkingTokens, 10) > 0;
  }

  // Priority 2: User settings explicit disable
  if (options.alwaysThinkingEnabled === false) {
    return false;
  }

  // Priority 3: Model capability check
  return isModelThinkingCapable(options.modelName, options.provider);
}

// ============================================
// Message Extraction
// ============================================

/**
 * Get text content from message for keyword detection.
 * Original: Nz8 (getMessageTextContent) in chunks.68.mjs:3508-3511
 */
export function getMessageTextContent(message: {
  content: string | Array<{ type: string; text?: string }>;
}): string {
  if (typeof message.content === 'string') {
    return message.content;
  }
  return message.content
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text)
    .join('\n');
}

/**
 * Convert thinking level to token count.
 * Original: Uz8 (thinkingLevelToTokens) in chunks.68.mjs:3478-3480
 */
export function thinkingLevelToTokens(level: ThinkingLevel): number {
  return level === 'high' ? THINKING_CONSTANTS.ULTRATHINK : THINKING_CONSTANTS.NONE;
}

/**
 * Extract thinking tokens from a message.
 * Original: qz8 (extractThinkingFromMessage) in chunks.68.mjs:3482-3506
 */
export function extractThinkingFromMessage(
  message: {
    isMeta?: boolean;
    thinkingMetadata?: ThinkingMetadata;
    content: string | Array<{ type: string; text?: string }>;
  },
  telemetry?: (event: string, data: Record<string, unknown>) => void
): number {
  // Skip meta messages
  if (message.isMeta) return 0;

  // Check explicit thinking metadata first
  if (message.thinkingMetadata) {
    const { level, disabled } = message.thinkingMetadata;
    if (disabled) return 0;
    const tokens = thinkingLevelToTokens(level);
    if (tokens > 0) {
      telemetry?.('tengu_thinking', { tokenCount: tokens });
    }
    return tokens;
  }

  // Fall back to keyword detection in message content
  const messageText = getMessageTextContent(message);
  const { tokens } = detectThinkingKeyword(messageText);
  if (tokens > 0) {
    telemetry?.('tengu_thinking', { tokenCount: tokens });
  }
  return tokens;
}

// ============================================
// Export
// ============================================

export {
  detectThinkingKeyword,
  extractKeywordPositions,
  isModelThinkingCapable,
  getModelMaxThinkingTokens,
  getModelThinkingInfo,
  isThinkingEnabled,
  getMessageTextContent,
  thinkingLevelToTokens,
  extractThinkingFromMessage,
};
