# API Calling Analysis - Claude Code v2.1.7

## Overview

The API Calling module handles all communication with Anthropic's Messages API, including:
- Multi-provider client creation (Anthropic, Bedrock, Vertex, Foundry)
- Streaming response handling with parallel content block processing
- Intelligent retry logic with exponential backoff
- Context overflow recovery and model fallback mechanisms
- Token counting and usage tracking

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createAnthropicClient` (XS) - Multi-provider client factory
- `retryGenerator` (v51) - Retry logic with exponential backoff
- `streamApiCall` (oHA) - Main streaming API entry point
- `isOverloadError` (ls8) - 529 overload detection
- `isRetryableError` (ns8) - Retryable error classification
- `parseContextLimitError` (TeB) - Context overflow parser

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    streamApiCall (oHA)                           │
│  Entry point: builds request, manages streaming lifecycle        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    retryGenerator (v51)                          │
│  Retry wrapper: exponential backoff, error classification        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 createAnthropicClient (XS)                       │
│  Provider detection → Client creation                            │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┬───────────────┐
              │               │               │               │
              ▼               ▼               ▼               ▼
        ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
        │ Anthropic│     │ Bedrock │     │ Vertex  │     │ Foundry │
        │  (hP)   │     │  (b41)  │     │  (v61)  │     │  (u41)  │
        └─────────┘     └─────────┘     └─────────┘     └─────────┘
```

---

## 1. Client Creation

### createAnthropicClient (XS) - chunks.82.mjs:2634-2737

Creates the appropriate API client based on environment configuration.

```javascript
// ============================================
// createAnthropicClient - Multi-provider client factory
// Location: chunks.82.mjs:2634-2737
// ============================================

// ORIGINAL (for source lookup):
async function XS({
  apiKey: A,
  maxRetries: Q,
  model: B,
  fetchOverride: G
}) {
  let Z = process.env.CLAUDE_CODE_CONTAINER_ID,
    Y = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
    J = In8(),
    X = {
      "x-app": "cli",
      "User-Agent": gn(),
      ...J,
      ...Z ? { "x-claude-remote-container-id": Z } : {},
      ...Y ? { "x-claude-remote-session-id": Y } : {}
    };

  if (a1(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION))
    X["x-anthropic-additional-protection"] = "true";

  await xR(); // OAuth token check
  if (!qB()) Xn8(X, p2()); // Add auth header if not browser

  let D = {
    defaultHeaders: X,
    maxRetries: Q,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
    dangerouslyAllowBrowser: !0,
    fetchOptions: pJA(),
    ...G && { fetch: G }
  };

  // Bedrock client
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    let K = B === SD() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
      ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : lAA();
    let V = { ...D, awsRegion: K, ... };
    // AWS credentials handling...
    return new b41(V)
  }

  // Foundry client
  if (a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    let K = fG0(new Q51, "https://cognitiveservices.azure.com/.default");
    return new u41({ ...D, azureADTokenProvider: K, ... })
  }

  // Vertex client
  if (a1(process.env.CLAUDE_CODE_USE_VERTEX)) {
    let K = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || ...;
    let F = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"], ... });
    return new v61({ ...D, region: SdA(B), googleAuth: F, ... })
  }

  // Default: First-party Anthropic client
  let W = {
    apiKey: qB() ? null : A || YL(),
    authToken: qB() ? g4()?.accessToken : void 0,
    ...D
  };
  return new hP(W)
}

// READABLE (for understanding):
async function createAnthropicClient({
  apiKey,
  maxRetries,
  model,
  fetchOverride
}) {
  const containerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  const remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  const customHeaders = parseCustomHeaders(); // ANTHROPIC_CUSTOM_HEADERS

  // Build default headers
  const defaultHeaders = {
    "x-app": "cli",
    "User-Agent": getUserAgent(),
    ...customHeaders,
    ...(containerId && { "x-claude-remote-container-id": containerId }),
    ...(remoteSessionId && { "x-claude-remote-session-id": remoteSessionId })
  };

  if (parseBoolean(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) {
    defaultHeaders["x-anthropic-additional-protection"] = "true";
  }

  // OAuth token refresh check
  await refreshOAuthTokenIfNeeded();

  // Add auth header if not in browser mode
  if (!isBrowserMode()) {
    addAuthHeader(defaultHeaders, getAuthConfig());
  }

  // Common client options
  const baseOptions = {
    defaultHeaders,
    maxRetries,
    timeout: parseInt(process.env.API_TIMEOUT_MS || "600000", 10), // 10 minutes default
    dangerouslyAllowBrowser: true,
    fetchOptions: getFetchOptions(),
    ...(fetchOverride && { fetch: fetchOverride })
  };

  // PROVIDER SELECTION

  // 1. AWS Bedrock
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    const awsRegion = model === getSmallFastModel() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
      ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
      : getDefaultAwsRegion();

    const bedrockOptions = {
      ...baseOptions,
      awsRegion,
      ...(parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && { skipAuth: true }),
      ...(isDebugMode() && { logger: createSdkLogger() })
    };

    // Handle AWS credentials
    if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
      bedrockOptions.skipAuth = true;
      bedrockOptions.defaultHeaders.Authorization = `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`;
    } else if (!parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
      const credentials = await getAwsCredentials();
      if (credentials) {
        bedrockOptions.awsAccessKey = credentials.accessKeyId;
        bedrockOptions.awsSecretKey = credentials.secretAccessKey;
        bedrockOptions.awsSessionToken = credentials.sessionToken;
      }
    }

    return new BedrockClient(bedrockOptions);
  }

  // 2. Azure Foundry
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    const tokenProvider = !process.env.ANTHROPIC_FOUNDRY_API_KEY
      ? createAzureTokenProvider("https://cognitiveservices.azure.com/.default")
      : undefined;

    return new FoundryClient({
      ...baseOptions,
      ...(tokenProvider && { azureADTokenProvider: tokenProvider }),
      ...(isDebugMode() && { logger: createSdkLogger() })
    });
  }

  // 3. Google Vertex AI
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || ...;
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    const googleAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)
      ? { getClient: () => ({ getRequestHeaders: () => ({}) }) }
      : new GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          ...(!projectId && !credentials && { projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID })
        });

    return new VertexClient({
      ...baseOptions,
      region: getVertexRegion(model), // Model-specific region
      googleAuth,
      ...(isDebugMode() && { logger: createSdkLogger() })
    });
  }

  // 4. Default: First-party Anthropic API
  return new AnthropicClient({
    apiKey: isBrowserMode() ? null : (apiKey || getApiKey()),
    authToken: isBrowserMode() ? getOAuthToken()?.accessToken : undefined,
    ...baseOptions,
    ...(isDebugMode() && { logger: createSdkLogger() })
  });
}

// Mapping: XS→createAnthropicClient, A→apiKey, Q→maxRetries, B→model, G→fetchOverride,
//          hP→AnthropicClient, b41→BedrockClient, v61→VertexClient, u41→FoundryClient,
//          In8→parseCustomHeaders, gn→getUserAgent, SdA→getVertexRegion
```

**Provider Selection Logic:**

| Provider | Environment Variable | Client Class |
|----------|---------------------|--------------|
| Bedrock | `CLAUDE_CODE_USE_BEDROCK` | `b41` (BedrockClient) |
| Foundry | `CLAUDE_CODE_USE_FOUNDRY` | `u41` (FoundryClient) |
| Vertex | `CLAUDE_CODE_USE_VERTEX` | `v61` (VertexClient) |
| First-party | Default | `hP` (AnthropicClient) |

**Key Configuration:**
- Default timeout: 600,000ms (10 minutes)
- Browser mode enabled (`dangerouslyAllowBrowser: true`)
- Custom headers parsed from `ANTHROPIC_CUSTOM_HEADERS`

---

## 2. Retry Logic

### retryGenerator (v51) - chunks.85.mjs:3-68

Implements sophisticated retry logic with exponential backoff, overload detection, and context overflow recovery.

```javascript
// ============================================
// retryGenerator - Retry logic with exponential backoff
// Location: chunks.85.mjs:3-68
// ============================================

// ORIGINAL (for source lookup):
async function* v51(A, Q, B) {
  let G = as8(B),  // Get max retries (default: 10)
    Z = { model: B.model, maxThinkingTokens: B.maxThinkingTokens },
    Y = null,      // Client instance
    J = 0,         // Overload counter
    X;             // Last error

  for (let I = 1; I <= G + 1; I++) {
    if (B.signal?.aborted) throw new II;  // AbortError

    try {
      // Recreate client on auth errors or first attempt
      if (Y === null || X instanceof D9 && X.status === 401 || PeB(X)) {
        if (X instanceof D9 && X.status === 401) {
          let D = g4()?.accessToken;
          if (D) await mA1(D)  // Refresh token
        }
        Y = await A()  // Create client
      }
      return await Q(Y, I, Z)  // Execute request
    } catch (D) {
      X = D;

      // Overload handling (529 status)
      if (ls8(D) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !qB() && oJA(B.model))) {
        J++;
        if (J >= ds8) {  // ds8 = 3 (max fallback attempts)
          if (B.fallbackModel) {
            throw new y51(B.model, B.fallbackModel);  // FallbackTriggeredError
          }
          if (!process.env.IS_SANDBOX) {
            throw new Qr(Error(CZ0), Z);  // Overload error message
          }
        }
      }

      // Max retries exceeded
      if (I > G) throw new Qr(D, Z);

      // Non-retryable errors
      if (!is8(D) && (!(D instanceof D9) || !ns8(D))) throw new Qr(D, Z);

      // Context limit overflow - adjust max_tokens
      if (D instanceof D9) {
        let F = TeB(D);  // Parse context limit error
        if (F) {
          let { inputTokens: H, contextLimit: E } = F;
          let z = 1000;  // Buffer
          let $ = Math.max(0, E - H - 1000);
          if ($ < qZ0) throw D;  // qZ0 = 3000 (floor output tokens)
          let O = (Z.maxThinkingTokens || 0) + 1;
          let L = Math.max(qZ0, $, O);
          Z.maxTokensOverride = L;
          continue  // Retry with adjusted tokens
        }
      }

      // Calculate delay
      let K = ps8(D),  // Check retry-after header
        V = fSA(I, K);  // Exponential backoff

      // Yield retry info for UI
      if (D instanceof D9) yield SeB(D, V, I, G);

      // Wait before retry
      await QKA(V, B.signal)
    }
  }
  throw new Qr(X, Z)
}

// READABLE (for understanding):
async function* retryGenerator(
  createClient,    // Client factory function
  executeRequest,  // Request execution function
  options          // { model, fallbackModel, maxThinkingTokens, signal }
) {
  const maxRetries = getMaxRetries(options); // Default: 10
  const retryContext = {
    model: options.model,
    maxThinkingTokens: options.maxThinkingTokens
  };

  let client = null;
  let overloadCount = 0;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    // Check abort signal
    if (options.signal?.aborted) throw new AbortError();

    try {
      // Recreate client on first attempt, auth errors, or provider auth failures
      if (client === null || (lastError instanceof APIError && lastError.status === 401) || isProviderAuthError(lastError)) {
        // Refresh OAuth token on 401
        if (lastError instanceof APIError && lastError.status === 401) {
          const accessToken = getOAuthToken()?.accessToken;
          if (accessToken) await refreshAccessToken(accessToken);
        }
        client = await createClient();
      }

      // Execute the request
      return await executeRequest(client, attempt, retryContext);

    } catch (error) {
      lastError = error;

      // OVERLOAD HANDLING (529 status or "overloaded_error" type)
      if (isOverloadError(error) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !isBrowserMode() && isPrimaryModel(options.model))) {
        overloadCount++;

        if (overloadCount >= MAX_FALLBACK_ATTEMPTS) { // 3
          if (options.fallbackModel) {
            logTelemetry("tengu_api_opus_fallback_triggered", {
              original_model: options.model,
              fallback_model: options.fallbackModel,
              provider: getProvider()
            });
            throw new FallbackTriggeredError(options.model, options.fallbackModel);
          }
          if (!process.env.IS_SANDBOX) {
            logTelemetry("tengu_api_custom_529_overloaded_error", {});
            throw new RetryError(Error(OVERLOAD_ERROR_MESSAGE), retryContext);
          }
        }
      }

      // MAX RETRIES EXCEEDED
      if (attempt > maxRetries) {
        throw new RetryError(error, retryContext);
      }

      // NON-RETRYABLE ERROR
      if (!isProviderAuthRefreshNeeded(error) && (!(error instanceof APIError) || !isRetryableError(error))) {
        throw new RetryError(error, retryContext);
      }

      // CONTEXT LIMIT OVERFLOW - DYNAMIC TOKEN ADJUSTMENT
      if (error instanceof APIError) {
        const contextError = parseContextLimitError(error);
        if (contextError) {
          const { inputTokens, contextLimit } = contextError;
          const buffer = 1000;
          const availableContext = Math.max(0, contextLimit - inputTokens - buffer);

          // Ensure minimum output tokens
          if (availableContext < FLOOR_OUTPUT_TOKENS) { // 3000
            logError(Error(`availableContext ${availableContext} < FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`));
            throw error;
          }

          // Adjust max_tokens to fit within context
          const minThinkingTokens = (retryContext.maxThinkingTokens || 0) + 1;
          const adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, minThinkingTokens);
          retryContext.maxTokensOverride = adjustedMaxTokens;

          logTelemetry("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens,
            contextLimit,
            adjustedMaxTokens,
            attempt
          });

          continue; // Retry with adjusted tokens
        }
      }

      // CALCULATE RETRY DELAY
      const retryAfter = getRetryAfterHeader(error);
      const delay = calculateBackoffDelay(attempt, retryAfter);

      // Yield retry info for UI feedback
      if (error instanceof APIError) {
        yield createRetrySystemMessage(error, delay, attempt, maxRetries);
      }

      logTelemetry("tengu_api_retry", {
        attempt,
        delayMs: delay,
        error: error.message,
        status: error.status,
        provider: getProvider()
      });

      // Wait before next attempt
      await sleep(delay, options.signal);
    }
  }

  throw new RetryError(lastError, retryContext);
}

// Mapping: v51→retryGenerator, A→createClient, Q→executeRequest, B→options,
//          G→maxRetries, Y→client, J→overloadCount, X→lastError, I→attempt,
//          ls8→isOverloadError, ns8→isRetryableError, TeB→parseContextLimitError,
//          ds8→MAX_FALLBACK_ATTEMPTS (3), qZ0→FLOOR_OUTPUT_TOKENS (3000)
```

**Key Constants:**

| Constant | Value | Purpose |
|----------|-------|---------|
| `ms8` | 10 | Default max retries |
| `ds8` | 3 | Max fallback attempts on overload |
| `qZ0` | 3000 | Floor for output tokens |
| `cs8` | 500 | Initial backoff delay (ms) |

---

## 3. Error Classification

### isOverloadError (ls8) - chunks.85.mjs:105-108

```javascript
// ============================================
// isOverloadError - Detects 529 overload errors
// Location: chunks.85.mjs:105-108
// ============================================

// ORIGINAL (for source lookup):
function ls8(A) {
  if (!(A instanceof D9)) return !1;
  return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}

// READABLE (for understanding):
function isOverloadError(error) {
  if (!(error instanceof APIError)) return false;
  return error.status === 529 || (error.message?.includes('"type":"overloaded_error"') ?? false);
}

// Mapping: ls8→isOverloadError, D9→APIError
```

### isRetryableError (ns8) - chunks.85.mjs:122-137

```javascript
// ============================================
// isRetryableError - Classifies retryable API errors
// Location: chunks.85.mjs:122-137
// ============================================

// ORIGINAL (for source lookup):
function ns8(A) {
  if (mrB(A)) return !1;  // Don't retry OAuth rate limit
  if (A.message?.includes('"type":"overloaded_error"')) return !0;
  if (TeB(A)) return !0;  // Context limit errors are retryable
  let Q = A.headers?.get("x-should-retry");
  if (Q === "true" && !qB()) return !0;
  if (Q === "false") return !1;
  if (A instanceof zC) return !0;  // Connection errors
  if (!A.status) return !1;
  if (A.status === 408) return !0;  // Request Timeout
  if (A.status === 409) return !0;  // Conflict
  if (A.status === 429) return !qB();  // Rate Limited (not in browser)
  if (A.status === 401) return gA1(), !0;  // Unauthorized (refresh token)
  if (A.status && A.status >= 500) return !0;  // Server errors
  return !1
}

// READABLE (for understanding):
function isRetryableError(error) {
  // Don't retry OAuth rate limit errors
  if (isOAuthRateLimitError(error)) return false;

  // Overload errors are retryable
  if (error.message?.includes('"type":"overloaded_error"')) return true;

  // Context limit errors are retryable (with token adjustment)
  if (parseContextLimitError(error)) return true;

  // Check x-should-retry header
  const shouldRetryHeader = error.headers?.get("x-should-retry");
  if (shouldRetryHeader === "true" && !isBrowserMode()) return true;
  if (shouldRetryHeader === "false") return false;

  // Connection errors are retryable
  if (error instanceof ConnectionError) return true;

  // Check status code
  if (!error.status) return false;

  switch (error.status) {
    case 408: return true;  // Request Timeout
    case 409: return true;  // Conflict
    case 429: return !isBrowserMode();  // Rate Limited
    case 401:
      clearAuthState();  // Clear auth for re-authentication
      return true;
    default:
      if (error.status >= 500) return true;  // Server errors
      return false;
  }
}

// Mapping: ns8→isRetryableError, mrB→isOAuthRateLimitError, TeB→parseContextLimitError,
//          zC→ConnectionError, gA1→clearAuthState
```

**Retryable Status Codes:**
| Status | Description | Retryable |
|--------|-------------|-----------|
| 401 | Unauthorized | Yes (with token refresh) |
| 408 | Request Timeout | Yes |
| 409 | Conflict | Yes |
| 429 | Rate Limited | Yes (not in browser mode) |
| 500+ | Server Errors | Yes |
| 529 | Overloaded | Yes (with fallback) |

---

## 4. Exponential Backoff

### calculateBackoffDelay (fSA) - chunks.85.mjs:74-82

```javascript
// ============================================
// calculateBackoffDelay - Exponential backoff with jitter
// Location: chunks.85.mjs:74-82
// ============================================

// ORIGINAL (for source lookup):
function fSA(A, Q) {
  if (Q) {
    let Z = parseInt(Q, 10);
    if (!isNaN(Z)) return Z * 1000  // retry-after in seconds
  }
  let B = Math.min(cs8 * Math.pow(2, A - 1), 32000),
    G = Math.random() * 0.25 * B;
  return B + G
}

// READABLE (for understanding):
function calculateBackoffDelay(attempt, retryAfterHeader) {
  // Use retry-after header if provided
  if (retryAfterHeader) {
    const seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds)) return seconds * 1000;
  }

  // Exponential backoff: 500ms * 2^(attempt-1), max 32s
  const baseDelay = Math.min(INITIAL_DELAY * Math.pow(2, attempt - 1), 32000);

  // Add 0-25% random jitter
  const jitter = Math.random() * 0.25 * baseDelay;

  return baseDelay + jitter;
}

// Mapping: fSA→calculateBackoffDelay, cs8→INITIAL_DELAY (500)
```

**Backoff Schedule:**
| Attempt | Base Delay | With Jitter (max) |
|---------|------------|-------------------|
| 1 | 500ms | 625ms |
| 2 | 1000ms | 1250ms |
| 3 | 2000ms | 2500ms |
| 4 | 4000ms | 5000ms |
| 5 | 8000ms | 10000ms |
| 6 | 16000ms | 20000ms |
| 7+ | 32000ms | 40000ms |

---

## 5. Context Limit Recovery

### Context Overflow Recovery Algorithm

**What it does:** Automatically adjusts `max_tokens` when the API returns a context limit error, allowing the request to succeed with a smaller response window.

**How it works:**

1.  **Detection**: The `retryGenerator` (`v51`) catches an `APIError` and uses `parseContextLimitError` (`TeB`) to extract `inputTokens` ($H$) and `contextLimit` ($E$) from the error message using a regex.
2.  **Space Calculation**:
    -   Calculate buffer: $1000$ tokens.
    -   Calculate available space: $S = \max(0, E - H - 1000)$.
3.  **Feasibility Check**: If $S < 3000$ (`qZ0` - floor output tokens), the recovery is deemed impossible as the resulting output window would be too small for meaningful work. The original error is thrown.
4.  **Token Adjustment**:
    -   Calculate minimum tokens for thinking: $T = (\text{maxThinkingTokens} || 0) + 1$.
    -   Set adjusted limit: $L = \max(3000, S, T)$.
5.  **Retry**: The algorithm sets `maxTokensOverride = L` in the retry context and performs an immediate retry (by calling `continue` in the retry loop).

**Why this approach:**
-   **Resilience**: Instead of failing the entire task when the context is tight, it tries to squeeze in a smaller response.
-   **Safety**: The $1000$ token buffer accounts for potential estimation errors or minor changes in prompt building between retries.
-   **Feature Preservation**: Ensuring at least one token more than `maxThinkingTokens` prevents the thinking feature from being disabled entirely during recovery.

**Key insight:**
This algorithm transforms a terminal "Context Window Exceeded" error into a recoverable state by sacrificing output length for task continuity. It's particularly effective when the user has provided a very large context (e.g., via `@` mentions) that almost fills the window.

---

### parseContextLimitError (TeB) - chunks.85.mjs:84-103

```javascript
// ============================================
// parseContextLimitError - Parses context overflow errors
// Location: chunks.85.mjs:84-103
// ============================================

// ORIGINAL (for source lookup):
function TeB(A) {
  if (A.status !== 400 || !A.message) return;
  if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
  let Q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
    B = A.message.match(Q);
  if (!B || B.length !== 4) return;
  let G = parseInt(B[1], 10),  // inputTokens
    Z = parseInt(B[2], 10),    // maxTokens
    Y = parseInt(B[3], 10);    // contextLimit
  if (isNaN(G) || isNaN(Z) || isNaN(Y)) return;
  return { inputTokens: G, maxTokens: Z, contextLimit: Y }
}

// READABLE (for understanding):
function parseContextLimitError(error) {
  if (error.status !== 400 || !error.message) return undefined;

  // Check for context limit error message
  if (!error.message.includes("input length and `max_tokens` exceed context limit")) {
    return undefined;
  }

  // Parse: "input length and `max_tokens` exceed context limit: 150000 + 16000 > 163840"
  const regex = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/;
  const match = error.message.match(regex);

  if (!match || match.length !== 4) return undefined;

  const inputTokens = parseInt(match[1], 10);
  const maxTokens = parseInt(match[2], 10);
  const contextLimit = parseInt(match[3], 10);

  if (isNaN(inputTokens) || isNaN(maxTokens) || isNaN(contextLimit)) {
    return undefined;
  }

  return { inputTokens, maxTokens, contextLimit };
}

// Mapping: TeB→parseContextLimitError
```

**Recovery Algorithm:**
1. Parse error message for input tokens and context limit
2. Calculate available space: `contextLimit - inputTokens - 1000` (buffer)
3. Ensure minimum: `max(3000, availableSpace, maxThinkingTokens + 1)`
4. Set `maxTokensOverride` and retry

---

## 6. Streaming Response Processing

### streamApiCall (oHA) - chunks.146.mjs:3018-3029

The streaming API call handles real-time response processing with parallel content block handling. It is a wrapper around the main execution function `BJ9`.

```javascript
// ============================================
// streamApiCall - Main streaming API entry point
// Location: chunks.146.mjs:3018-3029
// ============================================

// ORIGINAL (for source lookup):
async function* oHA({
  messages: A,
  systemPrompt: Q,
  maxThinkingTokens: B,
  tools: G,
  signal: Z,
  options: Y
}) {
  return yield* LZ0(A, async function* () {
    yield* BJ9(A, Q, B, G, Z, Y)
  })
}

// READABLE (for understanding):
async function* streamApiCall({
  messages,
  systemPrompt,
  maxThinkingTokens,
  tools,
  signal,
  options
}) {
  // LZ0 handles message preparation and streaming aggregation
  return yield* streamAggregateWrapper(messages, async function* () {
    // BJ9 is the core queryWithStreaming function
    yield* queryWithStreaming(messages, systemPrompt, maxThinkingTokens, tools, signal, options)
  })
}

// Mapping: oHA→streamApiCall, BJ9→queryWithStreaming, LZ0→streamAggregateWrapper,
//          A→messages, Q→systemPrompt, B→maxThinkingTokens, G→tools, Z→signal, Y→options
```

### queryWithStreaming (BJ9) - chunks.147.mjs:3-350

This is the core engine for processing SSE events from the Anthropic API and aggregating them into messages.

// message_start - Initialize message and usage
case "message_start":
  partialMessage = event.message;
  timeToFirstChunk = Date.now() - requestStartTime;
  usage = mergeUsage(usage, event.message.usage);
  break;

// content_block_start - Initialize content blocks
case "content_block_start":
  switch (event.content_block.type) {
    case "tool_use":
    case "server_tool_use":
      contentBlocks[event.index] = { ...event.content_block, input: "" };
      break;
    case "text":
      contentBlocks[event.index] = { ...event.content_block, text: "" };
      break;
    case "thinking":
      contentBlocks[event.index] = { ...event.content_block, thinking: "" };
      break;
  }
  break;

// content_block_delta - Accumulate content
case "content_block_delta":
  switch (event.delta.type) {
    case "input_json_delta":
      contentBlocks[event.index].input += event.delta.partial_json;
      break;
    case "text_delta":
      contentBlocks[event.index].text += event.delta.text;
      break;
    case "thinking_delta":
      contentBlocks[event.index].thinking += event.delta.thinking;
      break;
    case "signature_delta":
      contentBlocks[event.index].signature = event.delta.signature;
      break;
  }
  break;

// content_block_stop - Yield completed block
case "content_block_stop":
  const block = contentBlocks[event.index];
  const message = {
    message: { ...partialMessage, content: processContentBlocks([block], ...) },
    type: "assistant",
    uuid: generateUUID(),
    timestamp: new Date().toISOString()
  };
  assistantMessages.push(message);
  yield message;
  break;

// message_delta - Final usage and stop reason
case "message_delta":
  usage = mergeUsage(usage, event.usage);
  stopReason = event.delta.stop_reason;

  if (stopReason === "max_tokens") {
    logTelemetry("tengu_max_tokens_reached", { max_tokens: maxTokens });
    yield createErrorAttachment({ content: MAX_TOKENS_ERROR, apiError: "max_output_tokens" });
  }
  break;

// Stall detection (30s gap between events)
const stallThreshold = 30000;
if (lastEventTime !== null) {
  const gap = currentTime - lastEventTime;
  if (gap > stallThreshold) {
    stallCount++;
    totalStallTime += gap;
    logTelemetry("tengu_streaming_stall", {
      stall_duration_ms: gap,
      stall_count: stallCount,
      total_stall_time_ms: totalStallTime,
      event_type: event.type,
      model: options.model
    });
  }
}
```

**Stream Event Types:**

| Event Type | Purpose |
|------------|---------|
| `message_start` | Initialize message, get initial usage |
| `content_block_start` | Start new content block (text/tool_use/thinking) |
| `content_block_delta` | Accumulate partial content |
| `content_block_stop` | Finalize and yield content block |
| `message_delta` | Final usage stats, stop reason |
| `message_stop` | Stream complete |

**Content Block Types:**
- `text` - Regular text output
- `tool_use` - Tool call with JSON input
- `server_tool_use` - Server-side tool execution
- `thinking` - Extended thinking output (with signature)

---

## 7. Non-Streaming Fallback

When streaming fails, the system falls back to non-streaming mode:

```javascript
// Non-streaming fallback (chunks.147.mjs:349-381)
const MAX_NON_STREAMING_TOKENS = 21333; // wz7

// Triggered when:
// - Streaming times out (SDK abort, not user abort)
// - Streaming encounters an error

// Process:
// 1. Log fallback event
// 2. Create new request with stream: false
// 3. Cap max_tokens to 21,333
// 4. Execute synchronous request
// 5. Yield single complete message
```

---

## 8. Extended Thinking Support

### Thinking Configuration - chunks.147.mjs:95-98

Extended thinking is enabled when `maxThinkingTokens > 0`:

```javascript
// ============================================
// Thinking Configuration Builder
// Location: chunks.147.mjs:95-98
// ============================================

// ORIGINAL (for source lookup):
let ZA = B > 0 ? {
  budget_tokens: OA,
  type: "enabled"
} : void 0;

// READABLE (for understanding):
const thinkingConfig = maxThinkingTokens > 0 ? {
  budget_tokens: adjustedThinkingTokens,  // Min of maxThinkingTokens and (maxTokensOverride - 1)
  type: "enabled"
} : undefined;

// When enabled, thinking blocks appear in the streaming response
```

### Thinking Content Block Processing

```javascript
// ============================================
// Thinking Block Handling - chunks.147.mjs:206-211, 257-264
// ============================================

// content_block_start - Initialize thinking block
case "thinking":
  contentBlocks[event.index] = {
    ...event.content_block,
    thinking: ""  // Will accumulate thinking text
  };
  break;

// content_block_delta - Accumulate thinking content
case "thinking_delta":
  if (contentBlock.type !== "thinking") {
    throw logTelemetry("tengu_streaming_error", {
      error_type: "content_block_type_mismatch_thinking_delta",
      expected_type: "thinking",
      actual_type: contentBlock.type
    }), Error("Content block is not a thinking block");
  }
  contentBlock.thinking += event.delta.thinking;
  break;

// signature_delta - Capture thinking signature (for verification)
case "signature_delta":
  if (contentBlock.type !== "thinking") {
    throw Error("Content block is not a thinking block");
  }
  contentBlock.signature = event.delta.signature;
  break;
```

**Thinking Block Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"thinking"` | Block type identifier |
| `thinking` | `string` | Accumulated thinking text |
| `signature` | `string` | Cryptographic signature for verification |

**Thinking Token Budget Adjustment:**

When context overflow recovery triggers (`maxTokensOverride`), the thinking budget is adjusted:

```javascript
// chunks.85.mjs:44
const minThinkingTokens = (retryContext.maxThinkingTokens || 0) + 1;
const adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, minThinkingTokens);
```

This ensures thinking always has at least 1 token available, preserving the feature even under tight context constraints.

---

## 9. Request Payload Structure

```javascript
// ============================================
// Request Payload Builder
// Location: chunks.147.mjs:105-122
// ============================================

// READABLE (for understanding):
function buildRequestPayload(retryContext) {
  // Adjust thinking budget if maxTokensOverride is set
  const adjustedThinkingBudget = retryContext.maxTokensOverride
    ? Math.min(maxThinkingTokens, retryContext.maxTokensOverride - 1)
    : maxThinkingTokens;

  // Build thinking config (only if enabled)
  const thinkingConfig = maxThinkingTokens > 0 ? {
    budget_tokens: adjustedThinkingBudget,
    type: "enabled"
  } : undefined;

  // Bedrock-specific betas
  const bedrockBetas = getActiveProvider() === "bedrock"
    ? [...getBedrockModelBetas(retryContext.model), ...(additionalBeta ? [additionalBeta] : [])]
    : [];
  const combinedBetaConfig = mergeBetaConfigs(bedrockBetas);

  // Calculate max output tokens
  const maxOutputTokens = retryContext.maxTokensOverride
    || options.maxOutputTokensOverride
    || Math.max(maxThinkingTokens + 1, getDefaultMaxTokens(options.model));

  // Enable prompt caching
  const enableCaching = options.enablePromptCaching ?? isPromptCachingSupported(retryContext.model);

  // Build final payload
  return {
    model: normalizeModelId(options.model),
    messages: applyMessageCacheBreakpoints(conversationMessages, enableCaching),
    system: systemPromptWithContext,
    tools: [...resolvedTools, ...options.extraToolSchemas ?? []],
    tool_choice: options.toolChoice,
    ...(useBetas ? { betas: enabledBetas } : {}),
    metadata: getRequestMetadata(),
    max_tokens: maxOutputTokens,
    thinking: thinkingConfig,
    ...(contextManagement && useBetas && enabledBetas.includes(CONTEXT_MANAGEMENT_BETA)
      ? { context_management: contextManagement }
      : {}),
    ...combinedBetaConfig
  };
}

// Mapping: B→maxThinkingTokens, OA→adjustedThinkingBudget, ZA→thinkingConfig,
//          _A→maxOutputTokens, s→enableCaching
```

**Key Payload Fields:**

| Field | Value | Notes |
|-------|-------|-------|
| `model` | `string` | Normalized model ID via `Lu()` |
| `messages` | `array` | Conversation with cache breakpoints |
| `system` | `string` | System prompt with context |
| `tools` | `array` | Available tools + extra schemas |
| `tool_choice` | `object?` | Tool selection strategy |

---

## 10. Prompt Caching Strategy

### Cache Control Function - chunks.146.mjs:2889-2895

```javascript
// ============================================
// getCacheControl - Generate cache_control object
// Location: chunks.146.mjs:2889-2895
// ============================================

// ORIGINAL (for source lookup):
function wuA() {
  return HX("prompt_cache_1h_experiment", "use_1h_cache", !1) ? {
    type: "ephemeral",
    ttl: "1h"
  } : {
    type: "ephemeral"
  }
}

// READABLE (for understanding):
function getCacheControl() {
  // Check if 1-hour cache experiment is enabled
  const use1HourCache = getFeatureFlag("prompt_cache_1h_experiment", "use_1h_cache", false);

  if (use1HourCache) {
    return {
      type: "ephemeral",
      ttl: "1h"  // 1-hour cache TTL
    };
  }

  return {
    type: "ephemeral"  // Default 5-minute cache
  };
}

// Mapping: wuA→getCacheControl, HX→getFeatureFlag
```

### Message Cache Breakpoint Application - chunks.147.mjs:483-490

```javascript
// ============================================
// applyMessageCacheBreakpoints - Add cache breakpoints to messages
// Location: chunks.147.mjs:483-490
// ============================================

// ORIGINAL (for source lookup):
function qz7(A, Q) {
  return l("tengu_api_cache_breakpoints", {
    totalMessageCount: A.length,
    cachingEnabled: Q
  }), A.map((B, G) => {
    return B.type === "user" ? $z7(B, G > A.length - 3, Q) : Cz7(B, G > A.length - 3, Q)
  })
}

// READABLE (for understanding):
function applyMessageCacheBreakpoints(messages, cachingEnabled) {
  // Log telemetry about cache breakpoints
  logTelemetry("tengu_api_cache_breakpoints", {
    totalMessageCount: messages.length,
    cachingEnabled
  });

  return messages.map((message, index) => {
    // Determine if this is a recent message (last 3 messages)
    const isRecentMessage = index > messages.length - 3;

    if (message.type === "user") {
      return applyUserMessageCacheBreakpoint(message, isRecentMessage, cachingEnabled);
    } else {
      return applyAssistantMessageCacheBreakpoint(message, isRecentMessage, cachingEnabled);
    }
  });
}

// Mapping: qz7→applyMessageCacheBreakpoints, $z7→applyUserMessageCacheBreakpoint,
//          Cz7→applyAssistantMessageCacheBreakpoint
```

### Cache Breakpoint Placement Strategy

**What it does:** Optimizes API performance and cost by placing `cache_control` markers on stable parts of the conversation history.

**How it works:**
1.  **Stable vs. Volatile**: The algorithm identifies "stable" messages (older history) and "volatile" messages (recent turns).
2.  **Skipping Recents**: The last 3 messages are always skipped for caching. This is because the immediate conversation context is most likely to change in the next turn, causing a cache miss.
3.  **User Message Strategy**: For user messages that are eligible for caching, the breakpoint is applied to the *first* content block.
4.  **Assistant Message Strategy**: For eligible assistant messages, the breakpoint is applied to the *last* content block. This ensures that the entire reasoning and tool output are cached.
5.  **System Prompt**: The system prompt is considered highly stable and is always cached (with its own internal breakpoint).

**Why this approach:**
-   **Hit Rate Optimization**: By skipping the most recent turns, it avoids wasting cache writes on context that will immediately be invalidated by the next user reply.
-   **Cost Efficiency**: Cache hits are significantly cheaper than processing raw tokens. This strategy maximizes hits on long conversations where the "tail" of the history is fixed.
-   **Latency Reduction**: Cached tokens are processed much faster by the Anthropic inference engine, improving "Time to First Token" (TTFT) for subsequent turns.

**Key insight:**
The choice of "3 messages" as the volatile buffer is a heuristic that balances the overhead of cache management against the likelihood of context re-use. It ensures that once a turn is "buried" by newer turns, it becomes part of the long-term cacheable state.

---

### Models Supporting Prompt Caching

**The following model families support prompt caching:**
- Claude Opus 4.5
- Claude Sonnet 4.5
- Claude Haiku 4.5
- Claude Opus 4
- Claude Sonnet 4
- Claude Haiku 4
- Claude 3.5 family

### Request Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `model` | `string` | Normalized model ID |
| `messages` | `array` | Conversation with cache breakpoints |
| `system` | `string` | System prompt with context |
| `tools` | `array` | Available tools + extra schemas |
| `tool_choice` | `object?` | Tool selection strategy |
| `betas` | `array?` | Enabled beta features |
| `max_tokens` | `number` | Max output tokens (includes thinking budget) |
| `thinking` | `object?` | `{ type: "enabled", budget_tokens: N }` |
| `context_management` | `object?` | Context management beta config |

---

## 9. Telemetry Events

| Event | When |
|-------|------|
| `tengu_api_retry` | On each retry attempt |
| `tengu_api_opus_fallback_triggered` | Model fallback activated |
| `tengu_max_tokens_context_overflow_adjustment` | Dynamic token adjustment |
| `tengu_streaming_fallback_to_non_streaming` | Streaming fallback |
| `tengu_streaming_stall` | >30s gap detected |
| `tengu_streaming_stall_summary` | End of stream with stalls |
| `tengu_streaming_error` | Stream processing error |
| `tengu_max_tokens_reached` | Output exceeded limit |
| `tengu_context_window_exceeded` | Context window full |

---

## 10. Flow Diagram

```
streamApiCall(messages, systemPrompt, options)
     │
     ▼
┌─────────────────────────────────────────┐
│ Build Request Payload                    │
│ - Normalize model ID                     │
│ - Apply cache breakpoints                │
│ - Calculate max_tokens                   │
│ - Configure thinking/betas               │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ retryGenerator (v51)                     │
│ - Create client via XS()                 │
│ - Execute: client.beta.messages.stream() │
└─────────────────────────────────────────┘
     │
     ├── Success ──────────────────────────┐
     │                                      ▼
     │                      ┌───────────────────────────┐
     │                      │ Stream Events Loop         │
     │                      │ - message_start            │
     │                      │ - content_block_start      │
     │                      │ - content_block_delta      │
     │                      │ - content_block_stop       │
     │                      │ - message_delta            │
     │                      │ - message_stop             │
     │                      └───────────────────────────┘
     │
     ├── Retryable Error ─────────────────┐
     │                                     ▼
     │                      ┌───────────────────────────┐
     │                      │ Wait (exponential backoff) │
     │                      │ Retry (up to 10 attempts)  │
     │                      └───────────────────────────┘
     │
     ├── Context Overflow ────────────────┐
     │                                     ▼
     │                      ┌───────────────────────────┐
     │                      │ Parse error               │
     │                      │ Adjust max_tokens         │
     │                      │ Retry immediately         │
     │                      └───────────────────────────┘
     │
     ├── Overload (529) ──────────────────┐
     │                                     ▼
     │                      ┌───────────────────────────┐
     │                      │ Increment overload counter │
     │                      │ If >= 3: Trigger fallback │
     │                      │ Else: Retry               │
     │                      └───────────────────────────┘
     │
     └── Streaming Error ─────────────────┐
                                          ▼
                           ┌───────────────────────────┐
                           │ Non-streaming fallback    │
                           │ - Cap tokens to 21,333    │
                           │ - Synchronous request     │
                           └───────────────────────────┘
```
