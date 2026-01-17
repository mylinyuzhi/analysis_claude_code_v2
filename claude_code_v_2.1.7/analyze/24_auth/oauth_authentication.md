# OAuth 2.0 Authentication (Claude Code 2.1.7)

## Table of Contents

1. [OAuth Configuration](#oauth-configuration)
2. [OAuth Flow Overview](#oauth-flow-overview)
3. [Authorization Request](#authorization-request)
4. [Token Exchange](#token-exchange)
5. [Scope Management](#scope-management)
6. [OAuth Token Storage](#oauth-token-storage)
7. [Integration with Tools and System](#integration-with-tools-and-system)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `b5Q` (OAUTH_CONFIG) - OAuth endpoint configuration
- `qB` (isClaudeAiOAuth) - Check if using Claude.ai OAuth
- `g4` (getClaudeAiOAuth) - Get cached OAuth token
- `xg` (hasClaudeAiScope) - Validate OAuth scopes
- `iq` (shouldUseOAuth) - Determine OAuth requirement

---

## OAuth Configuration

### OAUTH_CONFIG Object (b5Q)

```javascript
// ============================================
// OAUTH_CONFIG - OAuth 2.0 endpoint configuration
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
  // API endpoints
  BASE_API_URL: "https://api.anthropic.com",

  // Authorization endpoints (2.1.7: platform.claude.com)
  CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
  CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",

  // Token endpoint
  TOKEN_URL: "https://platform.claude.com/v1/oauth/token",

  // API key creation endpoint
  API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",

  // Role management endpoint
  ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",

  // Success redirect URLs
  CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
  CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",

  // Manual code entry URL
  MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",

  // OAuth client identifier
  CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",

  // File suffix for OAuth storage (empty for production)
  OAUTH_FILE_SUFFIX: "",

  // MCP proxy configuration
  MCP_PROXY_URL: undefined,
  MCP_PROXY_PATH: undefined
}

// Mapping: b5Q→OAUTH_CONFIG
```

### OAuth Scopes

```javascript
// ============================================
// Claude.ai OAuth Scopes
// Location: chunks.20.mjs (derived from token exchange)
// ============================================

// READABLE (for understanding):
CLAUDE_AI_SCOPES = [
  "user:profile",                    // Access user profile info
  "user:inference",                  // Make API inference calls
  "user:sessions:claude_code"        // Claude Code session management
]
```

### URL Migration (2.0.x → 2.1.7)

| Component | Old URL | New URL (2.1.7) |
|-----------|---------|-----------------|
| Authorize | `console.anthropic.com/oauth/authorize` | `platform.claude.com/oauth/authorize` |
| Token | `console.anthropic.com/v1/oauth/token` | `platform.claude.com/v1/oauth/token` |
| Success | `console.anthropic.com/oauth/code/success` | `platform.claude.com/oauth/code/success` |
| Manual Entry | `console.anthropic.com/oauth/code/callback` | `platform.claude.com/oauth/code/callback` |

---

## OAuth Flow Overview

### Complete OAuth 2.0 + PKCE Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OAuth 2.0 + PKCE Flow                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    User runs `claude` or `/login`
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. Generate PKCE Challenge                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  code_verifier = random 128 bytes → base64url encoded                  │ │
│  │  code_challenge = SHA256(code_verifier) → base64url encoded            │ │
│  │  state = random UUID for CSRF protection                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. Start Local HTTP Server (if browser auto-open available)                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Server listens on localhost for authorization callback                │ │
│  │  Redirect URI: http://localhost:{port}/                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. Build Authorization URL                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  https://platform.claude.com/oauth/authorize?                          │ │
│  │    client_id=9d1c250a-e61b-44d9-88ed-5944d1962f5e                       │ │
│  │    &response_type=code                                                 │ │
│  │    &redirect_uri=http://localhost:{port}/                              │ │
│  │    &scope=user:profile user:inference user:sessions:claude_code        │ │
│  │    &state={random_state}                                               │ │
│  │    &code_challenge={challenge}                                         │ │
│  │    &code_challenge_method=S256                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. User Authentication in Browser                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  • User enters credentials on platform.claude.com                       │ │
│  │  • User grants permissions for requested scopes                        │ │
│  │  • Server redirects to callback URL with authorization code            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. Authorization Code Callback                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Local server receives:                                                │ │
│  │    http://localhost:{port}/?code={auth_code}&state={state}             │ │
│  │                                                                        │ │
│  │  Validate state matches original → Prevents CSRF attacks               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. Token Exchange                                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  POST https://platform.claude.com/v1/oauth/token                        │ │
│  │  {                                                                     │ │
│  │    grant_type: "authorization_code",                                   │ │
│  │    code: {auth_code},                                                  │ │
│  │    redirect_uri: "http://localhost:{port}/",                           │ │
│  │    client_id: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",                   │ │
│  │    code_verifier: {original_verifier}                                  │ │
│  │  }                                                                     │ │
│  │                                                                        │ │
│  │  Response:                                                             │ │
│  │  {                                                                     │ │
│  │    access_token: "eyJ...",                                             │ │
│  │    refresh_token: "eyJ...",                                            │ │
│  │    expires_in: 3600,                                                   │ │
│  │    token_type: "Bearer",                                               │ │
│  │    scope: "user:profile user:inference user:sessions:claude_code"      │ │
│  │  }                                                                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  7. Fetch User Profile                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  GET https://api.anthropic.com/api/oauth/claude_cli/userinfo            │ │
│  │  Authorization: Bearer {access_token}                                  │ │
│  │                                                                        │ │
│  │  Response includes:                                                    │ │
│  │    - subscriptionType (max, pro, team, enterprise)                     │ │
│  │    - rateLimitTier                                                     │ │
│  │    - displayName                                                       │ │
│  │    - emailAddress                                                      │ │
│  │    - organizationName                                                  │ │
│  │    - hasExtraUsageEnabled                                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  8. Store Tokens & Profile                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Storage location (priority):                                          │ │
│  │    1. macOS Keychain (darwin) → hex-encoded JSON                       │ │
│  │    2. ~/.claude/settings.json (fallback)                               │ │
│  │                                                                        │ │
│  │  Stored data:                                                          │ │
│  │    - accessToken                                                       │ │
│  │    - refreshToken                                                      │ │
│  │    - expiresAt (timestamp)                                             │ │
│  │    - scopes                                                            │ │
│  │    - subscriptionType                                                  │ │
│  │    - rateLimitTier                                                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Authorization Request

### Building Authorization URL

```javascript
// ============================================
// Build OAuth Authorization URL
// Location: chunks.20.mjs (derived from OAuth flow)
// ============================================

// READABLE (for understanding):
function buildAuthorizationUrl(pkceChallenge, state, redirectUri, useClaudeAi = false) {
  const baseUrl = useClaudeAi
    ? OAUTH_CONFIG.CLAUDE_AI_AUTHORIZE_URL
    : OAUTH_CONFIG.CONSOLE_AUTHORIZE_URL;

  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: CLAUDE_AI_SCOPES.join(" "),
    state: state,
    code_challenge: pkceChallenge,
    code_challenge_method: "S256"
  });

  return `${baseUrl}?${params.toString()}`;
}
```

### PKCE Challenge Generation

```javascript
// ============================================
// PKCE Challenge Generation
// Location: chunks.20.mjs (crypto utilities)
// ============================================

// READABLE (for understanding):
function generatePKCEChallenge() {
  // Generate 128 random bytes for verifier
  const verifier = crypto.randomBytes(128);
  const codeVerifier = base64url.encode(verifier);

  // SHA256 hash for challenge
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = base64url.encode(hash);

  return { codeVerifier, codeChallenge };
}
```

---

## Token Exchange

### Exchange Authorization Code for Tokens

```javascript
// ============================================
// Token Exchange Request
// Location: chunks.20.mjs (token exchange)
// ============================================

// READABLE (for understanding):
async function exchangeCodeForTokens(authCode, redirectUri, codeVerifier) {
  const payload = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: redirectUri,
    client_id: OAUTH_CONFIG.CLIENT_ID,
    code_verifier: codeVerifier
  };

  const response = await fetch(OAUTH_CONFIG.TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
    scope: data.scope
  };
}
```

---

## Scope Management

### Check OAuth Availability

```javascript
// ============================================
// shouldUseOAuth - Determine if OAuth should be used
// Location: chunks.48.mjs:1723-1733
// ============================================

// ORIGINAL (for source lookup):
function iq() {
  let A = a1(process.env.CLAUDE_CODE_USE_BEDROCK) ||
          a1(process.env.CLAUDE_CODE_USE_VERTEX) ||
          a1(process.env.CLAUDE_CODE_USE_FOUNDRY),
    B = (jQ() || {}).apiKeyHelper,
    G = process.env.ANTHROPIC_AUTH_TOKEN || B ||
        process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
    { source: Z } = Oz({ skipRetrievingKeyFromApiKeyHelper: !0 });
  return !(A || G || (Z === "ANTHROPIC_API_KEY" || Z === "apiKeyHelper") &&
           !a1(process.env.CLAUDE_CODE_REMOTE))
}

// READABLE (for understanding):
function shouldUseOAuth() {
  // Don't use OAuth if using external cloud provider
  let isExternalProvider =
    parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY);

  // Don't use OAuth if apiKeyHelper is configured
  let apiKeyHelper = (getSettings() || {}).apiKeyHelper;

  // Don't use OAuth if explicit auth token provided
  let hasExplicitAuth =
    process.env.ANTHROPIC_AUTH_TOKEN ||
    apiKeyHelper ||
    process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;

  // Get current API key source
  let { source } = getApiKeyAndSource({ skipRetrievingKeyFromApiKeyHelper: true });

  // Use OAuth if:
  // - Not external provider
  // - No explicit auth
  // - No API key from environment (unless in remote mode)
  return !(
    isExternalProvider ||
    hasExplicitAuth ||
    ((source === "ANTHROPIC_API_KEY" || source === "apiKeyHelper") &&
     !parseBoolean(process.env.CLAUDE_CODE_REMOTE))
  );
}

// Mapping: iq→shouldUseOAuth, a1→parseBoolean, jQ→getSettings,
//          Oz→getApiKeyAndSource
```

### Validate OAuth Scopes

```javascript
// ============================================
// hasClaudeAiScope - Validate OAuth scopes
// Location: chunks.48.mjs (scope validation)
// ============================================

// ORIGINAL (for source lookup):
function xg(A) {
  return A?.includes("user:inference") && A?.includes("user:sessions:claude_code")
}

// READABLE (for understanding):
function hasClaudeAiScope(scopes) {
  // Must have both inference and session scopes for Claude Code
  return scopes?.includes("user:inference") &&
         scopes?.includes("user:sessions:claude_code");
}

// Mapping: xg→hasClaudeAiScope
```

### Check Active OAuth Session

```javascript
// ============================================
// isClaudeAiOAuth - Check if OAuth is active
// Location: chunks.48.mjs:2125-2128
// ============================================

// ORIGINAL (for source lookup):
function qB() {
  if (!iq()) return !1;
  return xg(g4()?.scopes)
}

// READABLE (for understanding):
function isClaudeAiOAuth() {
  // First check if OAuth should be used
  if (!shouldUseOAuth()) return false;

  // Then verify we have valid OAuth token with correct scopes
  return hasClaudeAiScope(getClaudeAiOAuth()?.scopes);
}

// Mapping: qB→isClaudeAiOAuth, iq→shouldUseOAuth, xg→hasClaudeAiScope, g4→getClaudeAiOAuth
```

---

## OAuth Token Storage

### Token Storage Structure

```javascript
// ============================================
// OAuth Token Storage Format
// Location: ~/.claude/settings.json
// ============================================

// READABLE (for understanding):
{
  "claudeAiOauth": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresAt": 1706025600000,  // Unix timestamp in ms
    "scopes": ["user:profile", "user:inference", "user:sessions:claude_code"],
    "subscriptionType": "pro",   // max, pro, team, enterprise
    "rateLimitTier": "tier_2"
  },
  "oauthAccount": {
    "displayName": "User Name",
    "emailAddress": "user@example.com",
    "organizationName": "Org Name",
    "organizationUuid": "uuid-string",
    "hasExtraUsageEnabled": false,
    "billingType": "stripe_subscription"
  }
}
```

### Get Cached OAuth Token

```javascript
// ============================================
// getClaudeAiOAuth - Memoized token retrieval
// Location: chunks.48.mjs (memoized)
// ============================================

// READABLE (for understanding):
const getClaudeAiOAuth = memoize(() => {
  // Check environment variables first
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
    return parseOAuthToken(process.env.CLAUDE_CODE_OAUTH_TOKEN);
  }

  // Check file descriptor
  if (hasOAuthTokenFileDescriptor()) {
    return readOAuthFromFileDescriptor();
  }

  // Read from settings
  let config = getConfig();
  let oauth = config.claudeAiOauth;

  if (!oauth) return null;

  return {
    accessToken: oauth.accessToken,
    refreshToken: oauth.refreshToken,
    expiresAt: oauth.expiresAt,
    scopes: oauth.scopes,
    subscriptionType: oauth.subscriptionType,
    rateLimitTier: oauth.rateLimitTier
  };
});

// Mapping: g4→getClaudeAiOAuth
```

---

## Integration with Tools and System

### OAuth and Plan Mode

When using Plan Mode with OAuth authentication:

```javascript
// ============================================
// Plan Mode OAuth Integration
// Location: plan mode entry points
// ============================================

// Before entering plan mode, OAuth token is refreshed if needed
async function enterPlanMode() {
  // Ensure fresh token for plan creation
  await refreshOAuthTokenIfNeeded();

  // Plan mode uses same auth context as main loop
  const client = await createApiClient({
    maxRetries: 0,
    model: selectedModel
  });

  // ...plan mode execution
}
```

### OAuth and Tool Execution

Tools use the same authentication context:

```javascript
// ============================================
// Tool Execution with OAuth
// Location: tool execution flow
// ============================================

// Tools inherit auth from session context
async function executeToolWithAuth(tool, params) {
  // Refresh token if needed before tool API calls
  await refreshOAuthTokenIfNeeded();

  // Tool uses authenticated client
  const client = await createApiClient({
    maxRetries: 2,
    model: currentModel
  });

  return tool.execute(params, { client });
}
```

### OAuth and System Reminders

System reminders do not affect OAuth state, but may include:
- Rate limit warnings based on subscription type
- Usage limit notifications
- Account status information

```javascript
// ============================================
// Subscription-based System Reminders
// Location: chunks.82.mjs (rate limit handling)
// ============================================

function generateUsageWarning(accessInfo, model) {
  // OAuth users get subscription-specific warnings
  if (isClaudeAiOAuth()) {
    const subscription = getSubscriptionName();  // "Claude Pro", "Claude Max", etc.
    if (accessInfo.status === "allowed_warning") {
      return `You're approaching your ${subscription} usage limit`;
    }
  }
  return null;
}
```

### OAuth Token in API Headers

```javascript
// ============================================
// OAuth Token Header Construction
// Location: chunks.82.mjs:2727-2736
// ============================================

// ORIGINAL (for source lookup):
let W = {
  apiKey: qB() ? null : A || YL(),
  authToken: qB() ? g4()?.accessToken : void 0,
  ...D
};
return new hP(W)

// READABLE (for understanding):
// When creating Anthropic client:
let clientConfig = {
  // If OAuth: no API key, use auth token
  apiKey: isClaudeAiOAuth() ? null : apiKey || getApiKey(),

  // If OAuth: include access token
  authToken: isClaudeAiOAuth() ? getClaudeAiOAuth()?.accessToken : undefined,

  ...commonConfig
};

// This results in Authorization: Bearer {token} header
```

---

## Subscription Types and Capabilities

### Subscription Hierarchy

```javascript
// ============================================
// getSubscriptionType - Get user's subscription
// Location: chunks.48.mjs:2152-2158
// ============================================

// ORIGINAL (for source lookup):
function N6() {
  if (vEQ()) return yEQ();
  if (!iq()) return null;
  let A = g4();
  if (!A) return null;
  return A.subscriptionType ?? null
}

// READABLE (for understanding):
function getSubscriptionType() {
  // Check for override from managed settings
  if (hasManagedSubscriptionType()) {
    return getManagedSubscriptionType();
  }

  // Only check for OAuth users
  if (!shouldUseOAuth()) return null;

  // Get from OAuth token
  let oauth = getClaudeAiOAuth();
  if (!oauth) return null;

  return oauth.subscriptionType ?? null;  // max, pro, team, enterprise
}

// Mapping: N6→getSubscriptionType, vEQ→hasManagedSubscriptionType,
//          yEQ→getManagedSubscriptionType, iq→shouldUseOAuth, g4→getClaudeAiOAuth
```

### Subscription Features

| Subscription | Rate Limit | Extra Usage | Model Access |
|--------------|------------|-------------|--------------|
| `max` | Highest | Yes | All models |
| `enterprise` | Custom | Custom | All models |
| `team` | High | Configurable | All models |
| `pro` | Standard+ | Optional | All models |
| API Key | Standard | N/A | Per API key |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
- [api_key_auth.md](./api_key_auth.md) - API key authentication
- [provider_modes.md](./provider_modes.md) - Provider authentication
