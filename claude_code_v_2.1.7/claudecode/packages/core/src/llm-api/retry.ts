/**
 * @claudecode/core - LLM API Retry Logic
 *
 * Sophisticated retry logic with exponential backoff, overload detection,
 * and context overflow recovery.
 *
 * Reconstructed from chunks.85.mjs:3-68 (retryGenerator / v51)
 */

import { sleep } from '@claudecode/shared';
import { analyticsEvent } from '@claudecode/platform';
import {
  clearApiKeyHelperCache,
  getClaudeAiOAuth,
  isClaudeAiOAuth,
  refreshOAuthTokenIfNeeded,
} from '@claudecode/platform/auth';
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
// Original: cs8 = 500 in chunks.85.mjs:151
export const BASE_RETRY_DELAY = 500;

/**
 * Maximum retry delay (ms)
 */
// Original caps backoff at 32000ms in chunks.85.mjs:79
export const MAX_RETRY_DELAY = 32000;

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

  // Source also treats embedded overloaded_error bodies as overload signals.
  // Original: ls8 in chunks.85.mjs:105-108
  if (error instanceof Error) {
    return error.message?.includes('"type":"overloaded_error"') ?? false;
  }

  return false;
}

/**
 * Check if error is retryable
 * Original: ns8 (isRetryableError) in chunks.85.mjs
 */
export function isRetryableError(error: unknown): boolean {
  // Original: ns8 in chunks.85.mjs:121-136
  if (!isApiError(error)) {
    return false;
  }

  // Explicit overloaded_error body (even if status is not 529).
  if (error.message?.includes('"type":"overloaded_error"')) {
    return true;
  }

  // Context overflow recovery is treated as retryable.
  if (parseContextLimitError(error)) {
    return true;
  }

  // Server-side override header.
  const headersAny = (error as ApiError & { headers?: any }).headers;
  const shouldRetryHeader: string | undefined =
    typeof headersAny?.get === 'function'
      ? headersAny.get('x-should-retry')
      : headersAny?.['x-should-retry'];

  if (shouldRetryHeader === 'true' && !isClaudeAiOAuth()) {
    return true;
  }
  if (shouldRetryHeader === 'false') {
    return false;
  }

  const status = error.status;
  if (!status) {
    return false;
  }

  if (status === 408) return true;
  if (status === 409) return true;

  // Rate limiting: in source, OAuth sessions do not retry 429.
  if (status === 429) return !isClaudeAiOAuth();

  // 401: clear cached apiKeyHelper result and allow the outer loop to recreate the client.
  if (status === 401) {
    clearApiKeyHelperCache();
    return true;
  }

  if (status >= 500) return true;
  if (status === 529) return true;

  return false;
}

/**
 * Check if error is a provider auth error
 * Original: PeB in chunks.85.mjs
 */
export function isProviderAuthError(error: unknown): boolean {
  // Original: PeB in chunks.85.mjs:110-115
  // Only Bedrock uses this provider-specific auth refresh path.
  if (process.env.CLAUDE_CODE_USE_BEDROCK !== 'true') {
    return false;
  }

  // Credentials provider failures are surfaced as this error name upstream.
  if (error != null && typeof error === 'object' && 'name' in error) {
    if ((error as { name?: unknown }).name === 'CredentialsProviderError') {
      return true;
    }
  }

  // Bedrock can also surface auth failures as 403 API errors.
  if (isApiError(error) && error.status === 403) {
    return true;
  }

  return false;
}

/**
 * Check if error indicates rate limiting with retry-after header
 * Original: ps8 in chunks.85.mjs
 */
export function getRetryAfterHeader(error: unknown): string | null {
  // Original: ps8 in chunks.85.mjs:70-72
  if (!isApiError(error)) {
    return null;
  }

  const headersAny = (error as ApiError & { headers?: any }).headers;
  const value: string | undefined =
    typeof headersAny?.get === 'function'
      ? headersAny.get('retry-after')
      : headersAny?.['retry-after'];
  return value ?? null;
}

// Backward-compat export name (internal semantics now match source: returns header value string).
export const getRetryAfter = getRetryAfterHeader;

/**
 * Parse context limit error to extract token counts
 * Original: TeB (parseContextLimitError) in chunks.85.mjs
 */
export function parseContextLimitError(error: unknown): ContextOverflowError | null {
  // Original: TeB in chunks.85.mjs:84-103
  if (!isApiError(error)) {
    return null;
  }

  if (error.status !== 400 || !error.message) {
    return null;
  }

  if (!error.message.includes('input length and `max_tokens` exceed context limit')) {
    return null;
  }

  const pattern =
    /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
  const match = error.message.match(pattern);
  if (!match || match.length !== 4) {
    return null;
  }

  const inputTokensStr = match[1];
  const maxTokensStr = match[2];
  const contextLimitStr = match[3];
  if (!inputTokensStr || !maxTokensStr || !contextLimitStr) {
    // Source logs but returns undefined; we return null.
    return null;
  }

  const inputTokens = parseInt(inputTokensStr, 10);
  const maxTokens = parseInt(maxTokensStr, 10);
  const contextLimit = parseInt(contextLimitStr, 10);
  if (Number.isNaN(inputTokens) || Number.isNaN(maxTokens) || Number.isNaN(contextLimit)) {
    return null;
  }

  return { inputTokens, maxTokens, contextLimit };
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
  retryAfterHeader: string | null
): number {
  // Original: fSA in chunks.85.mjs:74-82
  if (retryAfterHeader) {
    const seconds = parseInt(retryAfterHeader, 10);
    if (!Number.isNaN(seconds)) {
      return seconds * 1000;
    }
  }

  const base = Math.min(BASE_RETRY_DELAY * Math.pow(2, attempt - 1), MAX_RETRY_DELAY);
  const jitter = Math.random() * 0.25 * base;
  return Math.floor(base + jitter);
}

/**
 * OAuth 401 recovery.
 *
 * Mirrors `mA1` in chunks.48.mjs:2076-2082:
 * - If cached access token mismatches, treat as recovered.
 * - Otherwise force-refresh via refreshOAuthTokenIfNeeded(..., true).
 */
async function recoverFromOAuth401(previousAccessToken: string | undefined): Promise<void> {
  // Clear in-memory token cache, so `getClaudeAiOAuth()` reflects latest storage.
  // In our reconstructed platform auth, this is implicitly handled by refresh; we keep
  // it best-effort by re-reading.
  const current = getClaudeAiOAuth();
  if (!current?.refreshToken) return;

  if (previousAccessToken && current.accessToken && current.accessToken !== previousAccessToken) {
    return;
  }

  await refreshOAuthTokenIfNeeded(0, true);
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
  const maxRetries =
    options.maxRetries ??
    (process.env.CLAUDE_CODE_MAX_RETRIES
      ? parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10)
      : DEFAULT_MAX_RETRIES);
  const retryContext: RetryContext = {
    model: options.model,
    maxThinkingTokens: options.maxThinkingTokens,
  };

  let client: AnthropicClientInterface | null = null;
  let overloadCount = 0;
  let lastError: unknown;
  let lastOauthAccessToken: string | undefined;

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
        // OAuth 401 recovery before recreating the client.
        // Original: chunks.85.mjs:15-20 + chunks.48.mjs:2076-2082
        if (isApiError(lastError) && lastError.status === 401 && isClaudeAiOAuth()) {
          await recoverFromOAuth401(lastOauthAccessToken);
        }
        client = await createClient();
        lastOauthAccessToken = isClaudeAiOAuth() ? getClaudeAiOAuth()?.accessToken ?? undefined : undefined;
      }

      // Execute the request
      return await executeRequest(client, attempt, retryContext);
    } catch (error) {
      lastError = error;

      // OVERLOAD HANDLING (529 status)
      // Original: ls8(D) && (FALLBACK_FOR_ALL_PRIMARY_MODELS || (!qB() && oJA(model)))
      // We conservatively gate overload fallback for OAuth sessions unless explicitly opted in.
      const overloadShouldCount =
        isOverloadError(error) &&
        (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !isClaudeAiOAuth());

      if (overloadShouldCount) {
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
      // Context limit overflow - adjust max_tokens (this path is considered retryable in source).
      if (isApiError(error)) {
        const contextOverflow = parseContextLimitError(error);
        if (contextOverflow) {
          const { inputTokens, contextLimit } = contextOverflow;
          const availableTokens = Math.max(0, contextLimit - inputTokens - 1000);

          if (availableTokens < MIN_OUTPUT_TOKENS) {
            throw error;
          }

          const thinkingFloor = (retryContext.maxThinkingTokens || 0) + 1;
          const newMaxTokens = Math.max(MIN_OUTPUT_TOKENS, availableTokens, thinkingFloor);
          retryContext.maxTokensOverride = newMaxTokens;
          analyticsEvent('tengu_max_tokens_context_overflow_adjustment', {
            inputTokens,
            contextLimit,
            adjustedMaxTokens: newMaxTokens,
            attempt,
          });
          continue;
        }
      }

      // Non-retryable ApiErrors are thrown immediately.
      if (isApiError(error) && !isRetryableError(error) && !isProviderAuthError(error)) {
        throw error;
      }

      // Calculate delay
      const retryAfterHeader = getRetryAfterHeader(error);
      const delayMs = calculateBackoffDelay(attempt, retryAfterHeader);

      // Yield retry info for UI (source only yields structured retry info for API errors).
      if (isApiError(error)) {
        yield {
          type: 'retry',
          attempt,
          maxAttempts: maxRetries,
          delayMs,
          error,
        };
      }

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
