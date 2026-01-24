/**
 * @claudecode/shared - Constants
 *
 * Global constants used throughout Claude Code.
 * Reconstructed from chunks.1.mjs
 */

// Re-export tool names
export * from './tool-names.js';

// Re-export model IDs
export * from './model-ids.js';

// ============================================
// Model Constants
// ============================================

/**
 * Default context window size (200k tokens)
 * Original: VT9 in chunks.1.mjs:1768
 */
export const DEFAULT_CONTEXT_WINDOW = 200_000;

/**
 * Extended context window size (1M tokens)
 */
export const EXTENDED_CONTEXT_WINDOW = 1_000_000;

/**
 * Default max output tokens
 * Original: FT9 in chunks.1.mjs:1770
 */
export const DEFAULT_MAX_OUTPUT_TOKENS = 32_000;

/**
 * Model-specific max output tokens
 */
export const MODEL_MAX_OUTPUT_TOKENS = {
  'claude-3-5': 8192,
  'claude-3-opus': 4096,
  'claude-3-sonnet': 8192,
  'claude-3-haiku': 4096,
  'opus-4-5': 64_000,
  'opus-4': 32_000,
  'sonnet-4': 64_000,
  'haiku-4': 64_000,
} as const;

/**
 * Compact buffer size for token management
 * Original: nU1 in chunks.1.mjs:1769
 */
export const COMPACT_BUFFER_TOKENS = 20_000;

// ============================================
// Beta Feature Flags
// ============================================

/**
 * Claude Code beta flag
 * Original: zb0 in chunks.1.mjs:1732
 */
export const BETA_CLAUDE_CODE = 'claude-code-20250219';

/**
 * Interleaved thinking beta flag
 * Original: $b0 in chunks.1.mjs:1733
 */
export const BETA_INTERLEAVED_THINKING = 'interleaved-thinking-2025-05-14';

/**
 * Extended context (1M) beta flag
 * Original: n5A in chunks.1.mjs:1734
 */
export const BETA_CONTEXT_1M = 'context-1m-2025-08-07';

/**
 * Context management beta flag
 * Original: CdA in chunks.1.mjs:1735
 */
export const BETA_CONTEXT_MANAGEMENT = 'context-management-2025-06-27';

/**
 * Structured outputs beta flag
 * Original: Cb0 in chunks.1.mjs:1736
 */
export const BETA_STRUCTURED_OUTPUTS = 'structured-outputs-2025-09-17';

/**
 * Web search beta flag
 * Original: pU1 in chunks.1.mjs:1737
 */
export const BETA_WEB_SEARCH = 'web-search-2025-03-05';

/**
 * Tool examples beta flag
 * Original: UdA in chunks.1.mjs:1738
 */
export const BETA_TOOL_EXAMPLES = 'tool-examples-2025-10-29';

/**
 * Advanced tool use beta flag
 * Original: Ub0 in chunks.1.mjs:1739
 */
export const BETA_ADVANCED_TOOL_USE = 'advanced-tool-use-2025-11-20';

/**
 * Tool search beta flag
 * Original: qb0 in chunks.1.mjs:1740
 */
export const BETA_TOOL_SEARCH = 'tool-search-tool-2025-10-19';

/**
 * All beta flags that are opus-only
 * Original: lU1 in chunks.1.mjs:1742
 */
export const OPUS_ONLY_BETAS = new Set([
  BETA_INTERLEAVED_THINKING,
  BETA_CONTEXT_1M,
  BETA_TOOL_SEARCH,
  BETA_TOOL_EXAMPLES,
]);

/**
 * All beta flags that are always enabled
 * Original: iU1 in chunks.1.mjs:1742
 */
export const ALWAYS_ENABLED_BETAS = new Set([
  BETA_CLAUDE_CODE,
  BETA_INTERLEAVED_THINKING,
  'fine-grained-tool-streaming-2025-05-14',
  BETA_CONTEXT_MANAGEMENT,
]);

// ============================================
// Turn & Loop Constants
// ============================================

/**
 * Maximum turns before loop termination
 * Original: q82 in chunks.113.mjs:39
 */
export const MAX_TURNS = 500;

/**
 * Progress yield interval for streaming
 * Original: L2 in chunks.112.mjs:2946
 */
export const PROGRESS_YIELD_INTERVAL = 3;

/**
 * Maximum recent activities to track
 * Original: FG5 in chunks.91.mjs:1394
 */
export const MAX_RECENT_ACTIVITIES = 5;

/**
 * Maximum output token recovery attempts
 * Original: j77 in chunks.134.mjs:155
 */
export const MAX_OUTPUT_TOKEN_RECOVERY = 3;

/**
 * Maximum recent tools to display
 * Original: wi5 in chunks.121.mjs:490
 */
export const MAX_RECENT_TOOLS = 5;

// ============================================
// Timeout Constants (milliseconds)
// ============================================

/**
 * Default API call timeout
 */
export const DEFAULT_API_TIMEOUT = 120_000;

/**
 * Default tool execution timeout
 */
export const DEFAULT_TOOL_TIMEOUT = 120_000;

/**
 * Maximum tool execution timeout
 */
export const MAX_TOOL_TIMEOUT = 600_000;

/**
 * Hook execution timeout
 */
export const HOOK_TIMEOUT = 600_000;

/**
 * MCP tool timeout (essentially unlimited)
 */
export const MCP_TOOL_TIMEOUT = 100_000_000;

// ============================================
// Size Limits
// ============================================

/**
 * Maximum concurrent tool executions
 */
export const MAX_CONCURRENT_TOOLS = 10;

/**
 * Maximum tool output size in bytes
 */
export const MAX_TOOL_OUTPUT_BYTES = 262_144;

/**
 * Maximum tokens per file read
 */
export const MAX_FILE_READ_TOKENS = 25_000;

/**
 * Maximum thinking tokens
 */
export const MAX_THINKING_TOKENS = 31_999;

// ============================================
// Session Constants
// ============================================

/**
 * Session index version
 * Original: zP0 in chunks.148.mjs
 */
export const SESSION_INDEX_VERSION = 2;

/**
 * Maximum retry attempts for session persistence
 * Original: wK1 in chunks.120.mjs
 */
export const MAX_PERSISTENCE_RETRIES = 10;

/**
 * Base delay for retry backoff
 * Original: Ai5 in chunks.120.mjs
 */
export const PERSISTENCE_BASE_DELAY_MS = 500;

// ============================================
// Notification Constants
// ============================================

/**
 * Default notification timeout
 * Original: l19 in chunks.135.mjs
 */
export const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

// ============================================
// Compact Constants
// ============================================

/**
 * Auto-compact trigger threshold (percentage of context limit)
 */
export const AUTO_COMPACT_THRESHOLD = 0.8;

/**
 * Micro-compact turn window
 */
export const MICRO_COMPACT_TURN_WINDOW = 3;

// ============================================
// Pricing Models (per Million Tokens)
// ============================================

export interface PricingModel {
  inputTokens: number;
  outputTokens: number;
  promptCacheWriteTokens: number;
  promptCacheReadTokens: number;
  webSearchRequests: number;
}

// Sonnet 4.5 (KQA)
export const SONNET_4_5_PRICING: PricingModel = {
  inputTokens: 3,
  outputTokens: 15,
  promptCacheWriteTokens: 3.75,
  promptCacheReadTokens: 0.3,
  webSearchRequests: 0.01,
};

// Opus 4.5 (seA)
export const OPUS_4_5_PRICING: PricingModel = {
  inputTokens: 15,
  outputTokens: 75,
  promptCacheWriteTokens: 18.75,
  promptCacheReadTokens: 1.5,
  webSearchRequests: 0.01,
};

// Sonnet 4 (teA)
export const SONNET_4_PRICING: PricingModel = {
  inputTokens: 5,
  outputTokens: 25,
  promptCacheWriteTokens: 6.25,
  promptCacheReadTokens: 0.5,
  webSearchRequests: 0.01,
};

// Sonnet 4.5 > 200k (yp1)
export const SONNET_4_5_EXTENDED_PRICING: PricingModel = {
  inputTokens: 6,
  outputTokens: 22.5,
  promptCacheWriteTokens: 7.5,
  promptCacheReadTokens: 0.6,
  webSearchRequests: 0.01,
};

// Haiku 4.5 (vp1)
export const HAIKU_4_5_PRICING: PricingModel = {
  inputTokens: 0.8,
  outputTokens: 4,
  promptCacheWriteTokens: 1,
  promptCacheReadTokens: 0.08,
  webSearchRequests: 0.01,
};

// Haiku 3.5 (kp1)
export const HAIKU_3_5_PRICING: PricingModel = {
  inputTokens: 1,
  outputTokens: 5,
  promptCacheWriteTokens: 1.25,
  promptCacheReadTokens: 0.1,
  webSearchRequests: 0.01,
};

// ============================================
// Identity Headers
// ============================================

export const CLI_IDENTITY_HEADER = 'x-anthropic-cli-identity';
export const SDK_CLI_IDENTITY_HEADER = 'x-anthropic-sdk-cli-identity';
export const SDK_AGENT_IDENTITY_HEADER = 'x-anthropic-sdk-agent-identity';

export const IDENTITY_HEADERS = new Set([
  CLI_IDENTITY_HEADER,
  SDK_CLI_IDENTITY_HEADER,
  SDK_AGENT_IDENTITY_HEADER,
]);

// ============================================
// Type Tags (for runtime type checking)
// ============================================

export const TYPE_TAGS = {
  NULL: '[object Null]',
  UNDEFINED: '[object Undefined]',
  ASYNC_FUNCTION: '[object AsyncFunction]',
  FUNCTION: '[object Function]',
  GENERATOR_FUNCTION: '[object GeneratorFunction]',
  PROXY: '[object Proxy]',
} as const;
