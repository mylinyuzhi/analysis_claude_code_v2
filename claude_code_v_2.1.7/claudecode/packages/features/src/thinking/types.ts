/**
 * @claudecode/features - Thinking Mode Types
 *
 * Type definitions for extended thinking mode.
 * Reconstructed from chunks.68.mjs, chunks.85.mjs
 */

// ============================================
// Thinking Level
// ============================================

/**
 * Thinking level determines UI styling (not actual thinking intensity).
 * Despite the name, this is a binary on/off system.
 */
export type ThinkingLevel = 'high' | 'none';

/**
 * Thinking metadata attached to messages.
 */
export interface ThinkingMetadata {
  level: ThinkingLevel;
  disabled?: boolean;
  tokens?: number;
}

/**
 * Result of thinking keyword detection.
 */
export interface ThinkingDetectionResult {
  tokens: number;
  level: ThinkingLevel;
}

// ============================================
// Content Blocks
// ============================================

/**
 * Thinking content block types.
 */
export type ThinkingBlockType = 'thinking' | 'redacted_thinking';

/**
 * Thinking content block.
 */
export interface ThinkingBlock {
  type: ThinkingBlockType;
  thinking?: string;
  signature?: string;
}

/**
 * Redacted thinking block (for privacy).
 */
export interface RedactedThinkingBlock {
  type: 'redacted_thinking';
  data?: string;
}

// ============================================
// API Configuration
// ============================================

/**
 * Thinking configuration for API requests.
 */
export interface ThinkingConfig {
  type: 'enabled';
  budget_tokens: number;
}

/**
 * Model thinking capability info.
 */
export interface ModelThinkingInfo {
  supportsThinking: boolean;
  maxThinkingTokens: number;
}

// ============================================
// UI Configuration
// ============================================

/**
 * Thinking level colors for UI styling.
 */
export interface ThinkingLevelColors {
  none: string;
  high: string;
}

/**
 * Thinking shimmer colors for UI animation.
 */
export interface ThinkingShimmerColors {
  none: string;
  high: string;
}

// ============================================
// Constants
// ============================================

/**
 * Thinking mode constants and default values.
 * Reconstructed from chunks.1.mjs, chunks.68.mjs, chunks.85.mjs
 */
export const THINKING_CONSTANTS = {
  // Token levels (binary system)
  // Original: sB0 in chunks.68.mjs:3573-3576
  ULTRATHINK: 31999,
  NONE: 0,

  // Default budget for token counting
  // Original: jZ0 in chunks.85.mjs:856
  DEFAULT_BUDGET: 1024,

  // Keyword detection regex
  // Original: Cz8 in chunks.68.mjs:3576
  ULTRATHINK_REGEX: /\bultrathink\b/gi,

  // Model-specific max tokens
  // Original: o5A in chunks.1.mjs:2240-2252
  MODEL_MAX_TOKENS: {
    '3-5': 8192,
    'claude-3-opus': 4096,
    'claude-3-sonnet': 8192,
    'claude-3-haiku': 4096,
    'opus-4-5': 64000,
    'opus-4': 32000,
    'sonnet-4': 64000,
    'haiku-4': 64000,
  } as Record<string, number>,

  // Default max thinking tokens
  // Original: FT9 in chunks.1.mjs:2258
  DEFAULT_MAX_TOKENS: 32000,

  // UI colors
  // Original: C91 in chunks.68.mjs:3566-3569
  LEVEL_COLORS: {
    none: 'text',
    high: 'claude',
  } as ThinkingLevelColors,

  // UI shimmer effects
  // Original: kRB in chunks.68.mjs:3569-3572
  SHIMMER_COLORS: {
    none: 'promptBorderShimmer',
    high: 'claudeShimmer',
  } as ThinkingShimmerColors,

  // Rainbow colors for keyword highlighting
  // Original: zz8 in chunks.68.mjs:3572
  RAINBOW_COLORS: [
    'rainbow_red',
    'rainbow_orange',
    'rainbow_yellow',
    'rainbow_green',
    'rainbow_blue',
    'rainbow_indigo',
    'rainbow_violet',
  ] as const,

  // Rainbow shimmer variants
  // Original: $z8 in chunks.68.mjs:3572
  RAINBOW_SHIMMER_COLORS: [
    'rainbow_red_shimmer',
    'rainbow_orange_shimmer',
    'rainbow_yellow_shimmer',
    'rainbow_green_shimmer',
    'rainbow_blue_shimmer',
    'rainbow_indigo_shimmer',
    'rainbow_violet_shimmer',
  ] as const,

  // Beta flag for interleaved thinking
  // Original: $b0 in chunks.1.mjs:2207
  INTERLEAVED_THINKING_BETA: 'interleaved-thinking-2025-05-14',
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复导出。
