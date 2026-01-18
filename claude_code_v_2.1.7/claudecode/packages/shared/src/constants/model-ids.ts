/**
 * @claudecode/shared - Model ID Constants
 *
 * Model identifier constants used throughout Claude Code.
 * Reconstructed from chunks.1.mjs model configurations.
 */

// ============================================
// Claude 4.5 Models (Latest)
// ============================================

/**
 * Claude Opus 4.5 - Most capable model
 */
export const MODEL_CLAUDE_OPUS_4_5 = 'claude-opus-4-5-20251101';

/**
 * Claude Sonnet 4.5 - Balanced performance
 */
export const MODEL_CLAUDE_SONNET_4_5 = 'claude-sonnet-4-5-20250514';

/**
 * Claude Haiku 4.5 - Fast and efficient
 */
export const MODEL_CLAUDE_HAIKU_4_5 = 'claude-haiku-4-5-20250514';

// ============================================
// Claude 4.0 Models
// ============================================

/**
 * Claude Opus 4 - Most capable Claude 4 model
 */
export const MODEL_CLAUDE_OPUS_4 = 'claude-opus-4-20250514';

/**
 * Claude Sonnet 4 - Balanced Claude 4 model
 */
export const MODEL_CLAUDE_SONNET_4 = 'claude-sonnet-4-20250514';

/**
 * Claude Haiku 4 - Fast Claude 4 model
 */
export const MODEL_CLAUDE_HAIKU_4 = 'claude-haiku-4-20250514';

// ============================================
// Claude 3.5 Models (Legacy)
// ============================================

/**
 * Claude 3.5 Opus - Legacy most capable
 */
export const MODEL_CLAUDE_3_5_OPUS = 'claude-3-5-opus-20241022';

/**
 * Claude 3.5 Sonnet - Legacy balanced
 */
export const MODEL_CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20241022';

/**
 * Claude 3.5 Haiku - Legacy fast
 */
export const MODEL_CLAUDE_3_5_HAIKU = 'claude-3-5-haiku-20241022';

// ============================================
// Model Aliases
// ============================================

/**
 * Model alias mappings
 * Maps short names to full model IDs
 */
export const MODEL_ALIASES: Record<string, string> = {
  // Latest (4.5)
  'opus': MODEL_CLAUDE_OPUS_4_5,
  'opus-4-5': MODEL_CLAUDE_OPUS_4_5,
  'sonnet': MODEL_CLAUDE_SONNET_4_5,
  'sonnet-4-5': MODEL_CLAUDE_SONNET_4_5,
  'haiku': MODEL_CLAUDE_HAIKU_4_5,
  'haiku-4-5': MODEL_CLAUDE_HAIKU_4_5,

  // 4.0
  'opus-4': MODEL_CLAUDE_OPUS_4,
  'sonnet-4': MODEL_CLAUDE_SONNET_4,
  'haiku-4': MODEL_CLAUDE_HAIKU_4,

  // 3.5 (legacy)
  'opus-3-5': MODEL_CLAUDE_3_5_OPUS,
  'sonnet-3-5': MODEL_CLAUDE_3_5_SONNET,
  'haiku-3-5': MODEL_CLAUDE_3_5_HAIKU,
};

// ============================================
// Model Tiers
// ============================================

/**
 * Model tier for capability classification
 */
export type ModelTier = 'opus' | 'sonnet' | 'haiku';

/**
 * Model tier sets
 */
export const OPUS_MODELS = new Set([
  MODEL_CLAUDE_OPUS_4_5,
  MODEL_CLAUDE_OPUS_4,
  MODEL_CLAUDE_3_5_OPUS,
]);

export const SONNET_MODELS = new Set([
  MODEL_CLAUDE_SONNET_4_5,
  MODEL_CLAUDE_SONNET_4,
  MODEL_CLAUDE_3_5_SONNET,
]);

export const HAIKU_MODELS = new Set([
  MODEL_CLAUDE_HAIKU_4_5,
  MODEL_CLAUDE_HAIKU_4,
  MODEL_CLAUDE_3_5_HAIKU,
]);

// ============================================
// Model Feature Support
// ============================================

/**
 * Models that support extended thinking
 */
export const EXTENDED_THINKING_MODELS = new Set([
  MODEL_CLAUDE_OPUS_4_5,
  MODEL_CLAUDE_OPUS_4,
  MODEL_CLAUDE_SONNET_4_5,
  MODEL_CLAUDE_SONNET_4,
]);

/**
 * Models that support 1M context window
 */
export const CONTEXT_1M_MODELS = new Set([
  MODEL_CLAUDE_SONNET_4_5,
  MODEL_CLAUDE_SONNET_4,
]);

// ============================================
// Model Utility Functions
// ============================================

/**
 * Check if a model ID is an Opus model
 */
export function isOpusModel(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return lower.includes('opus');
}

/**
 * Check if a model ID is a Sonnet model
 */
export function isSonnetModel(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return lower.includes('sonnet');
}

/**
 * Check if a model ID is a Haiku model
 */
export function isHaikuModel(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return lower.includes('haiku');
}

/**
 * Get the tier for a model ID
 */
export function getModelTier(modelId: string): ModelTier {
  if (isOpusModel(modelId)) return 'opus';
  if (isSonnetModel(modelId)) return 'sonnet';
  return 'haiku';
}

/**
 * Resolve a model alias to its full ID
 */
export function resolveModelAlias(aliasOrId: string): string {
  return MODEL_ALIASES[aliasOrId.toLowerCase()] ?? aliasOrId;
}

