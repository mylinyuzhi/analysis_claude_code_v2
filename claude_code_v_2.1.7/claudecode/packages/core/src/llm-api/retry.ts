/**
 * @claudecode/core - LLM API Retry Logic
 *
 * Sophisticated retry logic with exponential backoff, overload detection,
 * and context overflow recovery.
 *
 * Reconstructed from chunks.85.mjs:3-68 (retryGenerator / v51)
 */

import { sleep } from '@claudecode/shared';
import type {
  RetryOptions,
  RetryContext,
  AnthropicClientInterface,
  ApiError,
  ContextOverflowError,
} from './types.js';
import {
  FallbackTriggeredError,
  OverloadError,
  AbortError,
} from './types.js';

// ============================================
// Constants
// ============================================

/**
 * Default maximum retry attempts
 */
export const DEFAULT_MAX_RETRIES = 10;

/**
 * Maximum fallback attempts before giving up
 */
export const MAX_FALLBACK_ATTEMPTS = 3;

/**
 * Minimum output tokens floor
 */
export const MIN_OUTPUT_TOKENS = 3000;

/**
 * Base delay for exponential backoff (ms)
 */
export const BASE_RETRY_DELAY = 1000;

/**
 * Maximum retry delay (ms)
 */
export const MAX_RETRY_DELAY = 60000;

// ============================================
// Error Classification
// ============================================

/**
 * Check if error is an API error with status code
 */
export function isApiError(error: unknown): error is ApiError & { status: number } {
  return (
    error != null &&
    typeof error === 'object' &&
    'status' in error &&
    typeof (error as ApiError).status === 'number'
  );
}

/**
 * Check if error is an overload error (529 status)
 * Original: ls8 (isOverloadError) in chunks.85.mjs
 */
export function isOverloadError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.status === 529;
  }

  // Check for "overloaded_error" type in error body
  if (error != null && typeof error === 'object') {
    const errorObj = error as { error?: { type?: string } };
    return errorObj.error?.type === 'overloaded_error';
  }

  return false;
}

/**
 * Check if error is retryable
 * Original: ns8 (isRetryableError) in chunks.85.mjs
 */
export function isRetryableError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  const status = error.status;

  // Retryable status codes
  // 408: Request Timeout
  // 429: Rate Limited
  // 500: Internal Server Error
  // 502: Bad Gateway
  // 503: Service Unavailable
  // 504: Gateway Timeout
  // 529: Overloaded
  return [408, 429, 500, 502, 503, 504, 529].includes(status);
}

/**
 * Check if error is a provider auth error
 * Original: PeB in chunks.85.mjs
 */
export function isProviderAuthError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  // Check for credential refresh needed
  const message = (error as ApiError).message?.toLowerCase() || '';
  return (
    message.includes('credential') ||
    message.includes('token expired') ||
    message.includes('authentication')
  );
}

/**
 * Check if error indicates rate limiting with retry-after header
 * Original: ps8 in chunks.85.mjs
 */
export function getRetryAfter(error: unknown): number | null {
  if (!isApiError(error)) {
    return null;
  }

  const headers = (error as ApiError & { headers?: Record<string, string> }).headers;
  if (!headers) {
    return null;
  }

  const retryAfter = headers['retry-after'];
  if (!retryAfter) {
    return null;
  }

  // Parse as seconds
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) {
    return seconds * 1000; // Convert to ms
  }

  // Parse as date
  const date = new Date(retryAfter);
  if (!isNaN(date.getTime())) {
    return Math.max(0, date.getTime() - Date.now());
  }

  return null;
}

/**
 * Parse context limit error to extract token counts
 * Original: TeB (parseContextLimitError) in chunks.85.mjs
 */
export function parseContextLimitError(error: unknown): ContextOverflowError | null {
  if (!isApiError(error)) {
    return null;
  }

  const message = (error as ApiError).message || '';

  // Pattern: "prompt is too long: X tokens > Y maximum"
  const match = message.match(/(\d+)\s*tokens?\s*>\s*(\d+)/i);
  if (match) {
    const inputTokensStr = match[1];
    const contextLimitStr = match[2];
    if (!inputTokensStr || !contextLimitStr) {
      return null;
    }
    return {
      inputTokens: parseInt(inputTokensStr, 10),
      contextLimit: parseInt(contextLimitStr, 10),
    };
  }

  return null;
}

// ============================================
// Backoff Calculation
// ============================================

/**
 * Calculate exponential backoff delay
 * Original: fSA in chunks.85.mjs
 */
export function calculateBackoffDelay(
  attempt: number,
  retryAfterMs: number | null
): number {
  // Use retry-after if provided
  if (retryAfterMs !== null) {
    return retryAfterMs;
  }

  // Exponential backoff with jitter
  const exponentialDelay = Math.min(
    BASE_RETRY_DELAY * Math.pow(2, attempt - 1),
    MAX_RETRY_DELAY
  );

  // Add random jitter (0-25% of delay)
  const jitter = Math.random() * 0.25 * exponentialDelay;

  return Math.floor(exponentialDelay + jitter);
}

// ============================================
// Retry Generator
// ============================================

/**
 * Retry generator with exponential backoff and error recovery.
 *
 * Original: v51 (retryGenerator) in chunks.85.mjs:3-68
 *
 * Features:
 * - Exponential backoff with jitter
 * - OAuth token refresh on 401
 * - Context overflow recovery (adjusts max_tokens)
 * - Overload fallback (529 status)
 * - Abort signal support
 *
 * @param createClient - Factory function to create/recreate the client
 * @param executeRequest - Function to execute the request
 * @param options - Retry configuration options
 * @yields Retry information for UI updates
 * @returns Final result from executeRequest
 */
export async function* retryGenerator<T>(
  createClient: () => Promise<AnthropicClientInterface>,
  executeRequest: (
    client: AnthropicClientInterface,
    attempt: number,
    context: RetryContext
  ) => Promise<T>,
  options: RetryOptions
): AsyncGenerator<
  { type: 'retry'; attempt: number; maxAttempts: number; delayMs: number; error: unknown },
  T,
  undefined
> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const retryContext: RetryContext = {
    model: options.model,
    maxThinkingTokens: options.maxThinkingTokens,
  };

  let client: AnthropicClientInterface | null = null;
  let overloadCount = 0;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    // Check abort signal
    if (options.signal?.aborted) {
      throw new AbortError();
    }

    try {
      // Recreate client on first attempt, auth errors, or provider auth failures
      if (
        client === null ||
        (isApiError(lastError) && lastError.status === 401) ||
        isProviderAuthError(lastError)
      ) {
        client = await createClient();
      }

      // Execute the request
      return await executeRequest(client, attempt, retryContext);
    } catch (error) {
      lastError = error;

      // OVERLOAD HANDLING (529 status)
      if (isOverloadError(error)) {
        overloadCount++;

        if (overloadCount >= MAX_FALLBACK_ATTEMPTS) {
          if (options.fallbackModel) {
            throw new FallbackTriggeredError(options.model, options.fallbackModel);
          }

          throw new OverloadError(error as Error, {
            model: options.model,
            maxThinkingTokens: options.maxThinkingTokens,
          });
        }
      }

      // Max retries exceeded
      if (attempt > maxRetries) {
        throw new OverloadError(lastError as Error, {
          model: options.model,
          maxThinkingTokens: options.maxThinkingTokens,
        });
      }

      // Non-retryable errors (except known retryable ones)
      if (!isRetryableError(error) && isApiError(error)) {
        // Context limit overflow - adjust max_tokens
        const contextOverflow = parseContextLimitError(error);
        if (contextOverflow) {
          const { inputTokens, contextLimit } = contextOverflow;
          const buffer = 1000;
          const availableTokens = Math.max(0, contextLimit - inputTokens - buffer);

          if (availableTokens < MIN_OUTPUT_TOKENS) {
            // Can't reduce further, throw original error
            throw error;
          }

          // Ensure we have room for thinking tokens
          const thinkingBuffer = (retryContext.maxThinkingTokens || 0) + 1;
          const newMaxTokens = Math.max(MIN_OUTPUT_TOKENS, availableTokens, thinkingBuffer);

          retryContext.maxTokensOverride = newMaxTokens;
          continue; // Retry with adjusted tokens
        }

        // Non-retryable error
        throw error;
      }

      // Calculate delay
      const retryAfterMs = getRetryAfter(error);
      const delayMs = calculateBackoffDelay(attempt, retryAfterMs);

      // Yield retry info for UI
      yield {
        type: 'retry',
        attempt,
        maxAttempts: maxRetries,
        delayMs,
        error,
      };

      // Wait before retry (with abort signal support)
      if (options.signal) {
        await Promise.race([
          sleep(delayMs),
          new Promise<void>((_, reject) => {
            const onAbort = () => reject(new AbortError());
            options.signal!.addEventListener('abort', onAbort, { once: true });
          }),
        ]);
      } else {
        await sleep(delayMs);
      }
    }
  }

  // Should never reach here, but TypeScript needs this
  throw new OverloadError(lastError as Error, {
    model: options.model,
    maxThinkingTokens: options.maxThinkingTokens,
  });
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
