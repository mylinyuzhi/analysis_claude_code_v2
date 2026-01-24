/**
 * @claudecode/features - Thinking Mode Module
 *
 * Extended thinking mode (ultrathink) support.
 *
 * Key features:
 * - Keyword detection ("ultrathink")
 * - Model capability detection
 * - Token budget calculation
 * - API configuration building
 * - Thinking block filtering for compact/restore
 *
 * Design: Binary on/off system (despite level names)
 * - Enabled: 31,999 tokens max budget
 * - Disabled: 0 tokens
 *
 * Reconstructed from chunks.68.mjs, chunks.85.mjs, chunks.147.mjs, chunks.148.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Detection
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
} from './detection.js';

// ============================================
// Calculation
// ============================================

export {
  calculateMaxThinkingTokens,
  buildThinkingConfig,
  getThinkingConfigForCounting,
  buildToolUseOptionsWithThinking,
  applySkillThinkingOverride,
} from './calculation.js';

// ============================================
// Filtering
// ============================================

export {
  isThinkingBlock,
  isThinkingOnlyMessage,
  containsThinkingContent,
  removeTrailingThinkingBlocks,
  filterOrphanedThinkingMessages,
  shouldSkipInTurnCount,
  filterCompactableMessages,
} from './filtering.js';
