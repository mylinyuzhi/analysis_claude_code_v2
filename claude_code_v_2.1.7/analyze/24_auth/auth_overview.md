# Authentication System Overview (Claude Code 2.1.7)

## Table of Contents

1. [Authentication Architecture](#authentication-architecture)
2. [Authentication Methods Summary](#authentication-methods-summary)
3. [Key Changes in 2.1.7](#key-changes-in-217)
4. [Authentication Priority Chain](#authentication-priority-chain)
5. [Provider Mode Selection](#provider-mode-selection)
6. [Streaming Support](#streaming-support)
7. [Key Functions Reference](#key-functions-reference)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `Oz` (getApiKeyAndSource) - Main API key resolution function
- `an` (getOAuthTokenSource) - OAuth token source detection
- `XS` (createApiClient) - API client factory with provider selection
- `qB` (isClaudeAiOAuth) - Check if using Claude.ai OAuth
- `g4` (getClaudeAiOAuth) - Get cached OAuth token (memoized)

---

## Authentication Architecture

Claude Code 2.1.7 supports multiple authentication methods with a sophisticated fallback chain:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION RESOLUTION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       Authentication Resolver                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Environment Variables Check                                      │   │
│  │     - ANTHROPIC_API_KEY (SDK mode → direct use)                      │   │
│  │     - CLAUDE_CODE_OAUTH_TOKEN (inference-only)                       │   │
│  │     - ANTHROPIC_AUTH_TOKEN (bearer token)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. File Descriptor Sources (Secure Secret Injection)                │   │
│  │     - CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR                            │   │
│  │     - CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR                        │   │
│  │     Platform paths:                                                  │   │
│  │       darwin/freebsd: /dev/fd/{fd}                                   │   │
│  │       linux: /proc/self/fd/{fd}                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. apiKeyHelper Script                                              │   │
│  │     - Configured in ~/.claude.json or project settings               │   │
│  │     - Requires workspace trust for project-scoped settings           │   │
│  │     - TTL: CLAUDE_CODE_API_KEY_HELPER_TTL_MS (default: 300000ms)     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  4. Stored Credentials                                               │   │
│  │     - macOS Keychain (preferred on darwin)                           │   │
│  │       → Hex-encoded JSON via `security` command                      │   │
│  │     - Plaintext ~/.claude/.credentials.json (fallback)               │   │
│  │     - OAuth tokens in settings.json (claudeAiOauth)                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       API Client Creation (XS)                              │
│                                                                             │
│    Provider Detection (via environment variables):                          │
│    ┌────────────────────────────────────────────────────────────────────┐  │
│    │  CLAUDE_CODE_USE_BEDROCK=1  → AnthropicBedrock (AWS) - b41         │  │
│    │  CLAUDE_CODE_USE_VERTEX=1   → AnthropicVertex (GCP) - v61          │  │
│    │  CLAUDE_CODE_USE_FOUNDRY=1  → AnthropicFoundry (Azure) - u41       │  │
│    │  Default                    → Anthropic (First-Party) - hP         │  │
│    └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│    Header Construction:                                                     │
│    ┌────────────────────────────────────────────────────────────────────┐  │
│    │  API Key Auth:   X-Api-Key: {api_key}                              │  │
│    │  OAuth Auth:     Authorization: Bearer {access_token}              │  │
│    │  Common:         anthropic-version: 2023-06-01                     │  │
│    │                  anthropic-beta: {features}                        │  │
│    │                  User-Agent: claude-code/{version}                 │  │
│    │                  x-app: cli                                        │  │
│    └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Methods Summary

| Method | Header | Use Case | Refresh |
|--------|--------|----------|---------|
| **API Key** | `X-Api-Key: sk-ant-...` | Direct API access | No |
| **Claude.ai OAuth** | `Authorization: Bearer ...` | Subscription users | Yes (automatic) |
| **Inference Token** | `Authorization: Bearer ...` | Environment-based | No |
| **Bedrock** | AWS SigV4 | AWS integration | Via AWS credentials |
| **Vertex** | GCP OAuth | Google Cloud | Via google-auth |
| **Foundry** | Azure AD | Azure integration | Via Azure identity |

---

## Key Changes in 2.1.7

### OAuth URL Migration

**Major change**: All OAuth URLs migrated from `console.anthropic.com` to `platform.claude.com`.

| URL Type | Old (2.0.x) | New (2.1.7) |
|----------|-------------|-------------|
| Authorize | `console.anthropic.com/oauth/authorize` | `platform.claude.com/oauth/authorize` |
| Token | `console.anthropic.com/v1/oauth/token` | `platform.claude.com/v1/oauth/token` |
| Success | `console.anthropic.com/oauth/code/success` | `platform.claude.com/oauth/code/success` |
| Manual Redirect | `console.anthropic.com/oauth/code/callback` | `platform.claude.com/oauth/code/callback` |
| Buy Credits | `console.anthropic.com/buy_credits` | `platform.claude.com/buy_credits` |

### OAuth Configuration Object (b5Q)

```javascript
// ============================================
// OAUTH_CONFIG - OAuth endpoint configuration
// Location: chunks.20.mjs:543-554
// ============================================

// ORIGINAL (for source lookup):
b5Q = {
  BASE_API_URL: "https://api.anthropic.com",
  CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
  CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
  TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
  API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
  ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
  CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
  CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",
  MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",
  CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
  OAUTH_FILE_SUFFIX: "",
  MCP_PROXY_URL: void 0,
  MCP_PROXY_PATH: void 0
}

// READABLE (for understanding):
OAUTH_CONFIG = {
  BASE_API_URL: "https://api.anthropic.com",
  CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
  CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
  TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
  API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
  ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
  CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
  CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",
  MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",
  CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
  OAUTH_FILE_SUFFIX: "",      // Empty for production
  MCP_PROXY_URL: undefined,   // MCP proxy (if configured)
  MCP_PROXY_PATH: undefined
}

// Mapping: b5Q→OAUTH_CONFIG
```

### New/Updated Environment Variables

| Variable | Purpose | New in 2.1.7 |
|----------|---------|--------------|
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | TTL for apiKeyHelper cache (default: 300000ms) | Updated |
| `VERTEX_REGION_CLAUDE_4_1_OPUS` | Vertex region for Claude 4.1 Opus | New |
| `VERTEX_REGION_CLAUDE_HAIKU_4_5` | Vertex region for Claude Haiku 4.5 | New |

---

## Authentication Priority Chain

### Algorithm: `Oz()` (getApiKeyAndSource)

The main API key resolution function follows this priority:

```javascript
// ============================================
// getApiKeyAndSource - Main API key resolution
// Location: chunks.48.mjs:1780-1828
// ============================================

// ORIGINAL (for source lookup):
function Oz(A = {}) {
  if (eb0() && process.env.ANTHROPIC_API_KEY) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  if (a1(!1)) {
    let G = aT1();
    if (G) return { key: G, source: "ANTHROPIC_API_KEY" };
    if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN &&
        !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR)
      throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (process.env.ANTHROPIC_API_KEY) return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    return { key: null, source: "none" }
  }
  if (process.env.ANTHROPIC_API_KEY && L1().customApiKeyResponses?.approved?.includes(TL(process.env.ANTHROPIC_API_KEY)))
    return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
  let Q = aT1();
  if (Q) return { key: Q, source: "ANTHROPIC_API_KEY" };
  if (A.skipRetrievingKeyFromApiKeyHelper) {
    if (uOA()) return { key: null, source: "apiKeyHelper" }
  } else {
    let G = mOA(p2());
    if (G) return { key: G, source: "apiKeyHelper" }
  }
  let B = dOA();
  if (B) return B;
  return { key: null, source: "none" }
}

// READABLE (for understanding):
function getApiKeyAndSource(options = {}) {
  // 1. SDK mode: Use env var directly
  if (isSDKMode() && process.env.ANTHROPIC_API_KEY) {
    return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
  }

  // 2. Hosted mode: Require explicit auth
  if (isHostedMode(false)) {
    let keyFromFd = readApiKeyFromFileDescriptor();
    if (keyFromFd) return { key: keyFromFd, source: "ANTHROPIC_API_KEY" };

    if (!process.env.ANTHROPIC_API_KEY &&
        !process.env.CLAUDE_CODE_OAUTH_TOKEN &&
        !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) {
      throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    }

    if (process.env.ANTHROPIC_API_KEY) {
      return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    }
    return { key: null, source: "none" };
  }

  // 3. Normal mode: Check user-approved API key
  if (process.env.ANTHROPIC_API_KEY &&
      getConfig().customApiKeyResponses?.approved?.includes(maskApiKey(process.env.ANTHROPIC_API_KEY))) {
    return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
  }

  // 4. Try file descriptor
  let apiKeyFromFd = readApiKeyFromFileDescriptor();
  if (apiKeyFromFd) return { key: apiKeyFromFd, source: "ANTHROPIC_API_KEY" };

  // 5. Try apiKeyHelper script
  if (!options.skipRetrievingKeyFromApiKeyHelper) {
    let helperKey = executeApiKeyHelper(getTrustedContext());
    if (helperKey) return { key: helperKey, source: "apiKeyHelper" };
  } else if (hasApiKeyHelper()) {
    return { key: null, source: "apiKeyHelper" };
  }

  // 6. Try keychain/stored credentials
  let storedKey = getKeychainKey();
  if (storedKey) return storedKey;

  return { key: null, source: "none" };
}

// Mapping: Oz→getApiKeyAndSource, eb0→isSDKMode, a1→isHostedMode/parseBoolean,
//          aT1→readApiKeyFromFileDescriptor, L1→getConfig, TL→maskApiKey,
//          uOA→hasApiKeyHelper, mOA→executeApiKeyHelper, p2→getTrustedContext, dOA→getKeychainKey
```

### Priority Order Summary

| Priority | Source | Condition |
|----------|--------|-----------|
| 1 | `ANTHROPIC_API_KEY` | SDK mode enabled |
| 2 | File Descriptor | `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` set |
| 3 | `ANTHROPIC_API_KEY` | User approved (hash in config) |
| 4 | apiKeyHelper | Script configured and trusted |
| 5 | Keychain/Config | macOS Keychain or `~/.claude.json` |
| 6 | OAuth Token | Claude.ai authentication |

---

## Provider Mode Selection

### Algorithm: Provider Detection in `XS()` (createApiClient)

```javascript
// ============================================
// createApiClient - Provider selection logic
// Location: chunks.82.mjs:2630-2737
// ============================================

// ORIGINAL (for source lookup):
async function XS({ apiKey: A, maxRetries: Q, model: B, fetchOverride: G }) {
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
  if (k("[API:auth] OAuth token check starting"), await xR(), k("[API:auth] OAuth token check complete"), !qB())
    Xn8(X, p2());

  let D = {
    defaultHeaders: X,
    maxRetries: Q,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
    dangerouslyAllowBrowser: !0,
    fetchOptions: pJA(),
    ...G && { fetch: G }
  };

  // Provider selection
  if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) { /* Bedrock client */ }
  if (a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) { /* Foundry client */ }
  if (a1(process.env.CLAUDE_CODE_USE_VERTEX))  { /* Vertex client */ }

  // Default: Anthropic first-party
  let W = {
    apiKey: qB() ? null : A || YL(),
    authToken: qB() ? g4()?.accessToken : void 0,
    ...D
  };
  return new hP(W)
}

// READABLE (for understanding):
async function createApiClient({ apiKey, maxRetries, model, fetchOverride }) {
  // 1. Build common headers
  let containerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  let remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  let customHeaders = parseCustomHeaders();

  let defaultHeaders = {
    "x-app": "cli",
    "User-Agent": getUserAgent(),
    ...customHeaders,
    ...containerId ? { "x-claude-remote-container-id": containerId } : {},
    ...remoteSessionId ? { "x-claude-remote-session-id": remoteSessionId } : {}
  };

  // 2. Add protection header if enabled
  if (parseBoolean(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION)) {
    defaultHeaders["x-anthropic-additional-protection"] = "true";
  }

  // 3. Refresh OAuth token if needed, add auth header if not OAuth
  await refreshOAuthTokenIfNeeded();
  if (!isClaudeAiOAuth()) {
    addAuthorizationHeader(defaultHeaders, getTrustedContext());
  }

  // 4. Common client config
  let commonConfig = {
    defaultHeaders,
    maxRetries,
    timeout: parseInt(process.env.API_TIMEOUT_MS || "600000", 10),
    dangerouslyAllowBrowser: true,
    fetchOptions: getFetchOptions(),
    ...fetchOverride && { fetch: fetchOverride }
  };

  // 5. Provider-specific client creation
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return createBedrockClient(commonConfig, model);
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return createFoundryClient(commonConfig);
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return createVertexClient(commonConfig, model);
  }

  // 6. Default: Anthropic first-party
  return new AnthropicClient({
    apiKey: isClaudeAiOAuth() ? null : apiKey || getApiKey(),
    authToken: isClaudeAiOAuth() ? getClaudeAiOAuth()?.accessToken : undefined,
    ...commonConfig
  });
}

// Mapping: XS→createApiClient, In8→parseCustomHeaders, gn→getUserAgent,
//          a1→parseBoolean, xR→refreshOAuthTokenIfNeeded, qB→isClaudeAiOAuth,
//          Xn8→addAuthorizationHeader, p2→getTrustedContext, pJA→getFetchOptions,
//          YL→getApiKey, g4→getClaudeAiOAuth, hP→AnthropicClient
```

### Provider Selection Flow

```
                    ┌──────────────────────────────────┐
                    │      Check Provider Mode         │
                    └──────────────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ CLAUDE_CODE_USE_ │    │ CLAUDE_CODE_USE_ │    │ CLAUDE_CODE_USE_ │
│ BEDROCK=1        │    │ VERTEX=1         │    │ FOUNDRY=1        │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ AnthropicBedrock │    │ AnthropicVertex  │    │ AnthropicFoundry │
│ (b41)            │    │ (v61)            │    │ (u41)            │
│ - AWS SigV4      │    │ - Google OAuth   │    │ - Azure AD Token │
│ - awsAccessKey   │    │ - googleAuth     │    │ - azureADToken   │
│ - awsSecretKey   │    │ - projectId      │    │ - managedIdentity│
│ - awsRegion      │    │ - region         │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                   │
                                   │ (default)
                                   ▼
                    ┌──────────────────────────────────┐
                    │       Anthropic (First-Party)    │
                    │       (hP)                       │
                    │   - apiKey OR authToken          │
                    │   - X-Api-Key OR Bearer token    │
                    └──────────────────────────────────┘
```

---

## Streaming Support

Claude Code 2.1.7 uses **streaming by default** for all API requests. The streaming implementation is built into the API client.

### Streaming Architecture

```javascript
// ============================================
// Streaming Messages Call
// Location: chunks.147.mjs:143
// ============================================

// ORIGINAL (for source lookup):
IA.beta.messages.stream(zA, { signal: Z })

// READABLE (for understanding):
client.beta.messages.stream(requestParams, { signal: abortSignal })
```

### Key Streaming Features

1. **SSE-based streaming**: Uses Server-Sent Events for real-time response chunks
2. **Abort signal support**: Allows cancellation of in-flight requests
3. **Event types handled**:
   - `message_start`: Initial message metadata
   - `content_block_start`: Start of text/tool_use blocks
   - `content_block_delta`: Incremental content
   - `message_delta`: Final usage/stop_reason
   - `message_stop`: Stream complete

### Streaming Stall Detection

```javascript
// ============================================
// Streaming stall detection
// Location: chunks.147.mjs:162-175
// ============================================

// READABLE (for understanding):
let stallThreshold = 30000;  // 30 seconds
let lastEventTime = Date.now();

for await (let event of stream) {
  let now = Date.now();
  let gap = now - lastEventTime;

  if (gap > stallThreshold) {
    stallCount++;
    totalStallTime += gap;
    logWarning(`Streaming stall detected: ${gap/1000}s gap`);
    analyticsEvent("tengu_streaming_stall", {
      stall_duration_ms: gap,
      stall_count: stallCount,
      model: model,
      request_id: stream.request_id
    });
  }

  lastEventTime = now;
  // Process event...
}
```

### Model Streaming Capabilities

| Provider | Streaming | Notes |
|----------|-----------|-------|
| Anthropic First-Party | Yes | Full streaming support |
| AWS Bedrock | Yes | Via Bedrock streaming API |
| Google Vertex | Yes | Via Vertex streaming API |
| Azure Foundry | Yes | Via Foundry streaming API |

---

## Key Functions Reference

### Authentication Resolution

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Oz` | getApiKeyAndSource | chunks.48.mjs:1780-1828 | Main API key resolution |
| `YL` | getApiKey | chunks.48.mjs:1763-1768 | Get API key only |
| `an` | getOAuthTokenSource | chunks.48.mjs:1735-1761 | Detect OAuth source |
| `iq` | shouldUseOAuth | chunks.48.mjs:1723-1733 | Check if OAuth available |
| `qB` | isClaudeAiOAuth | chunks.48.mjs:2125-2128 | Check Claude.ai OAuth active |

### Token Management

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `g4` | getClaudeAiOAuth | chunks.48.mjs (memoized) | Get cached OAuth token |
| `xR` | refreshOAuthTokenIfNeeded | chunks.48.mjs:2056-2123 | Refresh expired tokens |
| `XXA` | saveOAuthTokens | chunks.48.mjs | Persist OAuth tokens |
| `yg` | isTokenExpiringSoon | chunks.48.mjs | Check 5-min expiry buffer |

### Client Creation

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `XS` | createApiClient | chunks.82.mjs:2630-2737 | Factory for API clients |
| `Xn8` | addAuthorizationHeader | chunks.82.mjs:2739-2742 | Add Bearer token header |
| `In8` | parseCustomHeaders | chunks.82.mjs:2744-2758 | Parse ANTHROPIC_CUSTOM_HEADERS |

### Provider Clients

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `hP` | AnthropicClient | chunks.69.mjs | First-party API client |
| `b41` | AnthropicBedrock | chunks.70.mjs | AWS Bedrock client |
| `v61` | AnthropicVertex | chunks.82.mjs | Google Vertex client |
| `u41` | AnthropicFoundry | chunks.82.mjs | Azure Foundry client |

### Subscription Types

| Type | Description | Rate Limit |
|------|-------------|------------|
| `max` | Claude Max subscription | Highest |
| `pro` | Claude Pro subscription | High |
| `enterprise` | Claude Enterprise | Custom |
| `team` | Claude Team | Custom |
| `null` | API Key user | Standard |

---

## Related Documents

- [api_key_auth.md](./api_key_auth.md) - API key authentication methods
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 with PKCE
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
- [provider_modes.md](./provider_modes.md) - Bedrock/Vertex/Foundry auth
- [model_switching.md](./model_switching.md) - Model selection and switching
