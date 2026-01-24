/**
 * @claudecode/features - Thinking Calculation
 *
 * Token budget calculation and API configuration.
 * Reconstructed from chunks.68.mjs, chunks.147.mjs
 */

import type { ThinkingConfig, ThinkingMetadata } from './types.js';
import { THINKING_CONSTANTS } from './types.js';
import { extractThinkingFromMessage } from './detection.js';

// ============================================
// Token Budget Calculation
// ============================================

/**
 * Message interface for thinking calculation.
 */
interface ThinkingMessage {
  type?: string;
  role?: string;
  isMeta?: boolean;
  thinkingMetadata?: ThinkingMetadata;
  message: {
    content: string | Array<{ type: string; text?: string }>;
  };
}

/**
 * Calculate max thinking tokens for an API call.
 * Original: Hm (calculateMaxThinkingTokens) in chunks.68.mjs:3466-3476
 *
 * @param messages - Messages to analyze
 * @param defaultTokens - Default token count if none found
 * @param envMaxThinkingTokens - Environment variable override
 * @param provider - Optional provider for telemetry
 * @param telemetry - Optional telemetry callback
 * @returns Maximum thinking token budget
 */
export function calculateMaxThinkingTokens(
  messages: ThinkingMessage[],
  defaultTokens?: number,
  envMaxThinkingTokens?: string,
  provider?: string,
  telemetry?: (event: string, data: Record<string, unknown>) => void
): number {
  // Priority 1: Environment variable override
  if (envMaxThinkingTokens) {
    const budget = parseInt(envMaxThinkingTokens, 10);
    if (budget > 0) {
      telemetry?.('tengu_thinking', {
        provider,
        tokenCount: budget,
      });
    }
    return budget;
  }

  // Priority 2: Extract max from message metadata
  // Filter to non-meta user messages, extract thinking tokens from each
  const messageTokens = messages
    .filter((msg) => (msg.type === 'user' || msg.role === 'user') && !msg.isMeta)
    .map((msg) => extractThinkingFromMessage(msg as any, telemetry));

  return Math.max(...messageTokens, defaultTokens ?? 0);
}

// ============================================
// API Configuration Building
// ============================================

/**
 * Build thinking configuration for API request.
 * Original: Part of chunks.147.mjs:95-98
 *
 * @param maxThinkingTokens - Maximum thinking budget
 * @param maxTokensOverride - Optional cap from model limits
 * @returns Thinking config or undefined if disabled
 */
export function buildThinkingConfig(
  maxThinkingTokens: number,
  maxTokensOverride?: number
): ThinkingConfig | undefined {
  if (maxThinkingTokens <= 0) {
    return undefined;
  }

  const effectiveBudget =
    maxTokensOverride !== undefined
      ? Math.min(maxThinkingTokens, maxTokensOverride)
      : maxThinkingTokens;

  return {
    type: 'enabled',
    budget_tokens: effectiveBudget,
  };
}

/**
 * Get thinking config for token counting API.
 * Uses a smaller default budget for estimation.
 */
export function getThinkingConfigForCounting(
  containsThinkingContent: boolean
): ThinkingConfig | undefined {
  if (!containsThinkingContent) {
    return undefined;
  }

  return {
    type: 'enabled',
    budget_tokens: THINKING_CONSTANTS.DEFAULT_BUDGET,
  };
}

// ============================================
// Context Options Building
// ============================================

/**
 * Build options with thinking for tool use context.
 */
export function buildToolUseOptionsWithThinking(
  options: {
    thinkingEnabled?: boolean;
    maxThinkingTokens?: number;
  },
  messages: ThinkingMessage[],
  explicitMaxThinkingTokens?: number
): number {
  // Explicit override takes precedence
  if (explicitMaxThinkingTokens !== undefined) {
    return explicitMaxThinkingTokens;
  }

  // Calculate from messages if thinking is enabled
  if (options.thinkingEnabled) {
    return calculateMaxThinkingTokens(messages, undefined);
  }

  return 0;
}

// ============================================
// Skill Override Support
// ============================================

/**
 * Apply skill thinking token override to context.
 * Skills can specify custom thinking budgets.
 */
export function applySkillThinkingOverride<T extends { options: { maxThinkingTokens?: number } }>(
  context: T,
  skillMaxThinkingTokens: number | undefined
): T {
  if (skillMaxThinkingTokens === undefined) {
    return context;
  }

  return {
    ...context,
    options: {
      ...context.options,
      maxThinkingTokens: skillMaxThinkingTokens,
    },
  };
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
