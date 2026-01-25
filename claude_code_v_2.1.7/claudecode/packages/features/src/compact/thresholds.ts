/**
 * @claudecode/features - Compact Thresholds
 *
 * Threshold calculation for compaction triggers.
 * Original: ic in chunks.132.mjs:1472-1493
 */

import { COMPACT_CONSTANTS, type ThresholdResult } from './types.js';
import { getMainLoopModelOverride, getSdkBetas, parseBoolean } from '@claudecode/shared';
import { getModelMaxThinkingTokens } from '../thinking/detection.js';

// ============================================
// Configuration / Context State
// ============================================

let autoCompactEnabled = true;

/** Optional explicit target override (not present in source; used for tests/debug). */
let autoCompactTargetOverride: number | undefined;

/** Optional explicit context-window override (represents `Jq(model, betas)` in source). */
let contextWindowOverride: number | undefined;

/** Context used to emulate `B5()` + `SM()` in the source `q3A()` calculation. */
let thresholdContext: {
  model?: string;
  sdkBetas?: string[];
} = {};

/**
 * Update threshold computation context.
 *
 * Source: `q3A()` calls `B5()` (model) and `SM()` (sdk betas) implicitly.
 * In this reconstruction we allow callers (core loop / compact dispatcher) to
 * provide the current values so thresholds match the active request context.
 */
export function setThresholdComputationContext(ctx: {
  model?: string;
  sdkBetas?: string[];
}): void {
  thresholdContext = {
    ...thresholdContext,
    ...ctx,
  };
}

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
  autoCompactTargetOverride = target;
}

/**
 * Get auto-compact target threshold.
 * Original: xs2 in chunks.132.mjs:1458
 */
export function getAutoCompactTarget(): number {
  if (typeof autoCompactTargetOverride === 'number' && autoCompactTargetOverride > 0) {
    return autoCompactTargetOverride;
  }

  // Original: xs2() in chunks.132.mjs:1458
  const available = calculateAvailableTokens();
  const defaultTarget = available - COMPACT_CONSTANTS.MIN_TOKENS_TO_PRESERVE; // uL0 = 13000

  const pctOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (pctOverride) {
    const pct = parseFloat(pctOverride);
    if (!isNaN(pct) && pct > 0 && pct <= 100) {
      const calculated = Math.floor(available * (pct / 100));
      return Math.min(calculated, defaultTarget);
    }
  }

  return defaultTarget;
}

/**
 * Set available tokens for current model.
 */
export function setAvailableTokens(tokens: number): void {
  contextWindowOverride = tokens;
}

/**
 * Calculate available tokens for context.
 * Original: q3A in chunks.132.mjs:1452
 */
export function calculateAvailableTokens(): number {
  // ============================================
  // q3A() - Available input tokens
  // Location: chunks.132.mjs:1452-1456
  //   let A = B5(), Q = dL0(A);
  //   return Jq(A, SM()) - Q
  // ============================================

  const model = resolveThresholdModel();
  const betas = resolveThresholdSdkBetas();

  const contextWindow =
    typeof contextWindowOverride === 'number' && contextWindowOverride > 0
      ? contextWindowOverride
      : getModelContextWindow(model, betas);

  const maxOutputTokens = getEffectiveMaxOutputTokens(model);
  return contextWindow - maxOutputTokens;
}

// ============================================
// q3A() helpers (model/context/max_tokens)
// ============================================

const DEFAULT_CONTEXT_WINDOW = 200000; // VT9
const ONE_MILLION_CONTEXT_WINDOW = 1000000;
const CONTEXT_1M_BETA = 'context-1m-2025-08-07'; // n5A

function normalizeModelAlias(model: string): string {
  const trimmed = model.trim();
  const lower = trimmed.toLowerCase();
  const is1m = /\[1m\]$/i.test(lower);
  const base = is1m ? trimmed.replace(/\[1m\]$/i, '').trim() : trimmed;

  const baseLower = base.toLowerCase();
  let resolved = base;
  if (baseLower === 'sonnet') resolved = 'claude-3-5-sonnet-20241022';
  else if (baseLower === 'haiku') resolved = 'claude-3-5-haiku-20241022';
  else if (baseLower === 'opus') resolved = 'claude-3-opus-20240229';
  else if (baseLower === 'opusplan') resolved = 'claude-3-5-sonnet-20241022';

  return is1m ? `${resolved}[1m]` : resolved;
}

function resolveThresholdModel(): string {
  const explicit = thresholdContext.model;
  if (typeof explicit === 'string' && explicit.trim()) return normalizeModelAlias(explicit);

  const override = getMainLoopModelOverride();
  if (typeof override === 'string' && override.trim()) return normalizeModelAlias(override);

  const env = process.env.ANTHROPIC_MODEL;
  if (typeof env === 'string' && env.trim()) return normalizeModelAlias(env);

  return 'claude-3-5-sonnet-20241022';
}

function resolveThresholdSdkBetas(): string[] | undefined {
  const explicit = thresholdContext.sdkBetas;
  if (Array.isArray(explicit)) return explicit;
  return getSdkBetas();
}

function isSonnet4Model(model: string): boolean {
  // Original: HT9(A) => A.toLowerCase().includes('claude-sonnet-4')
  return model.toLowerCase().includes('claude-sonnet-4');
}

function getModelContextWindow(model: string, betas?: string[]): number {
  // Original: Jq(A, SM()) in chunks.1.mjs:2235-2237
  if (model.includes('[1m]') || (betas?.includes(CONTEXT_1M_BETA) && isSonnet4Model(model))) {
    return ONE_MILLION_CONTEXT_WINDOW;
  }
  return DEFAULT_CONTEXT_WINDOW;
}

type ValidatedEnvNumber =
  | { effective: number; status: 'valid' }
  | { effective: number; status: 'invalid'; message: string }
  | { effective: number; status: 'capped'; message: string };

function validateMaxOutputTokensEnvVar(raw: string | undefined): ValidatedEnvNumber {
  // Original: $dA.validate in chunks.1.mjs:2178-2201
  if (!raw) {
    return { effective: 32000, status: 'valid' };
  }
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return {
      effective: 32000,
      status: 'invalid',
      message: `Invalid value "${raw}" (using default: 32000)`,
    };
  }
  if (parsed > 64000) {
    return {
      effective: 64000,
      status: 'capped',
      message: `Capped from ${parsed} to 64000`,
    };
  }
  return { effective: parsed, status: 'valid' };
}

function getEffectiveMaxOutputTokens(model: string): number {
  // Original: dL0(A) in chunks.147.mjs:558-564
  const modelCap = getModelMaxThinkingTokens(model); // o5A(A)
  const validated = validateMaxOutputTokensEnvVar(process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);

  if (validated.status === 'capped' || validated.status === 'invalid') {
    console.warn(`CLAUDE_CODE_MAX_OUTPUT_TOKENS ${validated.message}`);
  }

  return Math.min(validated.effective, modelCap);
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

  // Get current token count (HKA in source)
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
  // Original: l7(text) in chunks.85.mjs / core-message-loop.ts uses Math.round(len/4)
  return Math.round(text.length / 4);
}

/**
 * Estimate tokens for messages.
 * Original: js2 in chunks.132.mjs:1071 (for content)
 */
export function estimateMessageTokens(messages: unknown[]): number {
  // Original: HKA() in chunks.85.mjs (used by l97 in chunks.132.mjs)
  // Strategy:
  // 1) If we can find a recent assistant message that contains `usage`, we treat that as
  //    the ground truth for tokens up to that point.
  // 2) For messages after that point (or for the full list if no usage exists), estimate
  //    tokens by a cheap heuristic.

  const estimateBlock = (block: any): number => {
    if (typeof block === 'string') return countTokens(block);
    if (!block || typeof block !== 'object') return 0;
    if (block.type === 'text') return countTokens(String(block.text ?? ''));
    if (block.type === 'image') return 1334; // HKA image estimate in reconstructed core loop
    if (block.type === 'tool_result') {
      const content = block.content;
      if (typeof content === 'string') return countTokens(content);
      if (Array.isArray(content)) return content.reduce((sum: number, b: any) => sum + estimateBlock(b), 0);
      return 0;
    }
    return 0;
  };

  const estimateMessage = (msg: any): number => {
    if (!msg || (msg.type !== 'assistant' && msg.type !== 'user')) return 0;
    const content = msg.message?.content;
    if (!content) return 0;
    if (typeof content === 'string') return countTokens(content);
    if (Array.isArray(content)) return content.reduce((sum: number, b: any) => sum + estimateBlock(b), 0);
    return 0;
  };

  const arr = Array.isArray(messages) ? (messages as any[]) : [];

  // Find last assistant message with usage (Jd in source)
  for (let i = arr.length - 1; i >= 0; i--) {
    const msg = arr[i];
    if (msg?.type === 'assistant' && msg.message?.usage) {
      const usage = msg.message.usage;
      const totalTokens =
        (usage.input_tokens || 0) +
        (usage.cache_creation_input_tokens || 0) +
        (usage.cache_read_input_tokens || 0) +
        (usage.output_tokens || 0);

      const subsequentTokens = arr.slice(i + 1).reduce((sum: number, m: any) => sum + estimateMessage(m), 0);
      return totalTokens + subsequentTokens;
    }
  }

  return arr.reduce((sum: number, m: any) => sum + estimateMessage(m), 0);
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
