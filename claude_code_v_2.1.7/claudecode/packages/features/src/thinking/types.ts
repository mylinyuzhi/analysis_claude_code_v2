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

export const THINKING_CONSTANTS = {
  // Token levels (binary system)
  ULTRATHINK: 31999,
  NONE: 0,

  // Default budget for token counting
  DEFAULT_BUDGET: 1024,

  // Keyword detection
  ULTRATHINK_REGEX: /\bultrathink\b/gi,

  // Model-specific max tokens
  MODEL_MAX_TOKENS: {
    'claude-3-haiku': 4096,
    'claude-3-opus': 4096,
    'claude-3-sonnet': 8192,
    'claude-3.5': 8192,
    'opus-4': 32000,
    'opus-4-5': 64000,
    'sonnet-4': 64000,
    'haiku-4': 64000,
  } as Record<string, number>,

  // Default max thinking tokens
  DEFAULT_MAX_TOKENS: 32000,

  // UI colors
  LEVEL_COLORS: {
    none: 'promptBorder',
    high: 'claude',
  } as ThinkingLevelColors,

  SHIMMER_COLORS: {
    none: 'promptBorderShimmer',
    high: 'claudeShimmer',
  } as ThinkingShimmerColors,

  // Rainbow colors for keyword highlighting
  RAINBOW_COLORS: [
    'rainbow_red',
    'rainbow_orange',
    'rainbow_yellow',
    'rainbow_green',
    'rainbow_blue',
    'rainbow_indigo',
    'rainbow_violet',
  ] as const,

  // Beta flags
  INTERLEAVED_THINKING_BETA: 'interleaved-thinking-2025-05-14',
} as const;

// ============================================
// Export
// ============================================

export type {
  ThinkingLevel,
  ThinkingMetadata,
  ThinkingDetectionResult,
  ThinkingBlockType,
  ThinkingBlock,
  RedactedThinkingBlock,
  ThinkingConfig,
  ModelThinkingInfo,
  ThinkingLevelColors,
  ThinkingShimmerColors,
};
