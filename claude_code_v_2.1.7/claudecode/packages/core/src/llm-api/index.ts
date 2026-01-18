/**
 * @claudecode/core - LLM API Module
 *
 * Multi-provider API client with streaming support and retry logic.
 *
 * Key components:
 * - Client factory (createAnthropicClient)
 * - Retry generator with exponential backoff
 * - Streaming response aggregation
 */

// Re-export types
export * from './types.js';

// Re-export client factory
export {
  createAnthropicClient,
  detectProvider,
  buildDefaultHeaders,
  getUserAgent,
  parseCustomHeaders,
  DEFAULT_API_TIMEOUT,
  DEFAULT_MAX_RETRIES,
} from './client.js';

// Re-export retry logic
export {
  retryGenerator,
  isApiError,
  isOverloadError,
  isRetryableError,
  isProviderAuthError,
  getRetryAfter,
  parseContextLimitError,
  calculateBackoffDelay,
  MAX_FALLBACK_ATTEMPTS,
  MIN_OUTPUT_TOKENS,
  BASE_RETRY_DELAY,
  MAX_RETRY_DELAY,
} from './retry.js';

// Re-export streaming
export {
  queryWithStreaming,
  streamApiCall,
  STALL_THRESHOLD_MS,
} from './streaming.js';
