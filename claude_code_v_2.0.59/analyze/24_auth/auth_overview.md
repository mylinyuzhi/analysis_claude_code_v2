# Authentication System Overview

## Table of Contents

1. [Authentication Architecture](#authentication-architecture)
2. [Authentication Methods Summary](#authentication-methods-summary)
3. [Authentication Priority Chain](#authentication-priority-chain)
4. [Provider Mode Selection](#provider-mode-selection)
5. [Key Functions Reference](#key-functions-reference)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `cw` (getApiKeyAndSource) - Main API key resolution function
- `kc` (getOAuthTokenSource) - OAuth token source detection
- `Kq` (createApiClient) - API client factory with provider selection
- `BB` (isClaudeAiOAuth) - Check if using Claude.ai OAuth

---

## Authentication Architecture

Claude Code supports multiple authentication methods with a sophisticated fallback chain:

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
│  │     - CLAUDE_CODE_OAUTH_TOKEN (inference-only)                        │   │
│  │     - ANTHROPIC_AUTH_TOKEN (bearer token)                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. File Descriptor Sources (Secure Secret Injection)                │   │
│  │     - CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR                             │   │
│  │     - CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR                         │   │
│  │     Platform paths:                                                   │   │
│  │       darwin/freebsd: /dev/fd/{fd}                                    │   │
│  │       linux: /proc/self/fd/{fd}                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. apiKeyHelper Script                                               │   │
│  │     - Configured in ~/.claude.json or project settings                │   │
│  │     - Requires workspace trust for project-scoped settings            │   │
│  │     - Supports custom credential retrieval logic                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  4. Stored Credentials                                                │   │
│  │     - macOS Keychain (preferred on darwin)                            │   │
│  │       → Hex-encoded JSON via `security` command                       │   │
│  │     - Plaintext ~/.claude/.credentials.json (fallback)                │   │
│  │     - OAuth tokens in settings.json (claudeAiOauth)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       API Client Creation                                   │
│                                                                             │
│    Provider Detection (via environment variables):                          │
│    ┌────────────────────────────────────────────────────────────────────┐  │
│    │  CLAUDE_CODE_USE_BEDROCK=1  → AnthropicBedrock (AWS)               │  │
│    │  CLAUDE_CODE_USE_VERTEX=1   → AnthropicVertex (GCP)                │  │
│    │  CLAUDE_CODE_USE_FOUNDRY=1  → AnthropicFoundry (Azure)             │  │
│    │  Default                    → Anthropic (First-Party)              │  │
│    └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│    Header Construction:                                                     │
│    ┌────────────────────────────────────────────────────────────────────┐  │
│    │  API Key Auth:   X-Api-Key: {api_key}                              │  │
│    │  OAuth Auth:     Authorization: Bearer {access_token}              │  │
│    │  Common:         anthropic-version: 2023-06-01                     │  │
│    │                  anthropic-beta: {features}                        │  │
│    │                  User-Agent: claude-code/{version}                 │  │
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

## Authentication Priority Chain

### Algorithm: `cw()` (getApiKeyAndSource)

The main API key resolution function follows this priority:

```javascript
// ============================================
// getApiKeyAndSource - Main API key resolution
// Location: chunks.56.mjs:1734-1782
// ============================================

// ORIGINAL (for source lookup):
function cw(A = {}) {
  if (Gz0() && process.env.ANTHROPIC_API_KEY) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  if (Y0(!1)) {
    let G = rz1();
    if (G) return { key: G, source: "ANTHROPIC_API_KEY" };
    if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN &&
        !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR)
      throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (process.env.ANTHROPIC_API_KEY) return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    return { key: null, source: "none" }
  }
  if (process.env.ANTHROPIC_API_KEY && N1().customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY)))
    return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
  let Q = rz1();
  if (Q) return { key: Q, source: "ANTHROPIC_API_KEY" };
  if (A.skipRetrievingKeyFromApiKeyHelper) {
    if (bzA()) return { key: null, source: "apiKeyHelper" }
  } else {
    let G = fzA(N6());
    if (G) return { key: G, source: "apiKeyHelper" }
  }
  let B = hzA();
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

// Mapping: cw→getApiKeyAndSource, Gz0→isSDKMode, Y0→isHostedMode, rz1→readApiKeyFromFileDescriptor,
//          N1→getConfig, dw→maskApiKey, bzA→hasApiKeyHelper, fzA→executeApiKeyHelper,
//          N6→getTrustedContext, hzA→getKeychainKey
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

### Key Design Decisions

**Why this priority order?**

1. **Environment variables first**: Enables container/CI flexibility where secrets are injected at runtime
2. **File descriptors second**: Provides secure secret injection without environment variable exposure
3. **User approval check**: Prevents unauthorized use of API keys from untrusted sources
4. **apiKeyHelper for enterprise**: Allows custom credential management for corporate environments
5. **Stored credentials last**: Interactive fallback for development use

---

## Provider Mode Selection

### Algorithm: Provider Detection in `Kq()` (createApiClient)

```javascript
// ============================================
// createApiClient - Provider selection logic
// Location: chunks.88.mjs:3-105
// ============================================

// ORIGINAL (for source lookup):
async function Kq({ apiKey: A, maxRetries: Q, model: B, fetchOverride: G }) {
  let Z = process.env.CLAUDE_CODE_CONTAINER_ID,
      I = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
      Y = {
        "x-app": "cli",
        "User-Agent": fc(),
        ...jA5(),
        ...Z ? { "x-claude-remote-container-id": Z } : {},
        ...I ? { "x-claude-remote-session-id": I } : {}
      };
  if (Y0(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION))
    Y["x-anthropic-additional-protection"] = "true";
  if (await Qt(), !BB()) PA5(Y, N6());

  // ... provider-specific client creation
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK)) { /* Bedrock */ }
  if (Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) { /* Foundry */ }
  if (Y0(process.env.CLAUDE_CODE_USE_VERTEX))  { /* Vertex */ }
  // Default: Anthropic first-party
}

// READABLE (for understanding):
async function createApiClient({ apiKey, maxRetries, model, fetchOverride }) {
  // 1. Build common headers
  let containerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  let remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  let defaultHeaders = {
    "x-app": "cli",
    "User-Agent": getUserAgent(),
    ...getCustomHeaders(),
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

  // 4. Provider-specific client creation
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return createBedrockClient(/* ... */);
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return createFoundryClient(/* ... */);
  }
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return createVertexClient(/* ... */);
  }

  // 5. Default: Anthropic first-party
  return new AnthropicClient({
    apiKey: isClaudeAiOAuth() ? null : apiKey || getApiKey(),
    authToken: isClaudeAiOAuth() ? getClaudeAiOAuth()?.accessToken : undefined,
    ...commonConfig
  });
}

// Mapping: Kq→createApiClient, fc→getUserAgent, jA5→getCustomHeaders, Y0→parseBoolean,
//          Qt→refreshOAuthTokenIfNeeded, BB→isClaudeAiOAuth, PA5→addAuthorizationHeader,
//          N6→getTrustedContext, Kw→getApiKey, M6→getClaudeAiOAuth
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
│ - AWS SigV4      │    │ - Google OAuth   │    │ - Azure AD Token │
│ - awsAccessKey   │    │ - googleAuth     │    │ - azureADToken   │
│ - awsSecretKey   │    │ - projectId      │    │ - managedIdentity│
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                   │
                                   │ (default)
                                   ▼
                    ┌──────────────────────────────────┐
                    │       Anthropic (First-Party)    │
                    │   - apiKey OR authToken          │
                    │   - X-Api-Key OR Bearer token    │
                    └──────────────────────────────────┘
```

---

## Key Functions Reference

### Authentication Resolution

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `cw` | getApiKeyAndSource | chunks.56.mjs:1734-1782 | Main API key resolution |
| `Kw` | getApiKey | chunks.56.mjs:1717-1722 | Get API key only |
| `kc` | getOAuthTokenSource | chunks.56.mjs:1689-1715 | Detect OAuth source |
| `JU` | shouldUseOAuth | chunks.56.mjs | Check if OAuth available |
| `BB` | isClaudeAiOAuth | chunks.56.mjs:2051-2054 | Check Claude.ai OAuth active |

### Token Management

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `M6` | getClaudeAiOAuth | chunks.56.mjs (memoized) | Get cached OAuth token |
| `Qt` | refreshOAuthTokenIfNeeded | chunks.56.mjs:2017-2049 | Refresh expired tokens |
| `gzA` | saveOAuthTokens | chunks.56.mjs:1979-2015 | Persist OAuth tokens |
| `Ad` | isTokenExpiringSoon | chunks.24.mjs:1674-1678 | Check 5-min expiry buffer |

### Client Creation

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Kq` | createApiClient | chunks.88.mjs:3-105 | Factory for API clients |
| `PA5` | addAuthorizationHeader | chunks.88.mjs:107-110 | Add Bearer token header |
| `jA5` | getCustomHeaders | chunks.88.mjs:112-126 | Parse custom headers |

### Storage Backends

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `Fw` | getStorageBackend | chunks.24.mjs:1438-1441 | Select keychain/plaintext |
| `$o0` | keychainStorage | chunks.24.mjs:1325-1371 | macOS Keychain operations |
| `az1` | plaintextStorage | chunks.24.mjs:1388-1436 | Fallback file storage |

---

## Related Documents

- [api_key_auth.md](./api_key_auth.md) - API key authentication methods
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 with PKCE
- [oauth_implementation_guide.md](./oauth_implementation_guide.md) - OAuth implementation tutorial with Python examples
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
- [provider_modes.md](./provider_modes.md) - Bedrock/Vertex/Foundry auth
- [request_headers.md](./request_headers.md) - HTTP header construction
