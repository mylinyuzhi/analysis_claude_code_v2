# OAuth 2.0 Authentication

## Table of Contents

1. [OAuth Flow Overview](#oauth-flow-overview)
2. [OAuth Endpoints Configuration](#oauth-endpoints-configuration)
3. [OAuth Flow Orchestrator Class](#oauth-flow-orchestrator-class)
4. [Local Callback Server](#local-callback-server)
5. [PKCE Implementation](#pkce-implementation)
6. [Authorization URL Construction](#authorization-url-construction)
7. [Browser Opening Logic](#browser-opening-logic)
8. [Token Exchange](#token-exchange)
9. [Credential Storage](#credential-storage)
10. [Account Information Storage](#account-information-storage)
11. [User Profile and Subscription Detection](#user-profile-and-subscription-detection)
12. [OAuth Scopes](#oauth-scopes)
13. [Complete Login Flow Step-by-Step](#complete-login-flow-step-by-step)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `KRA` (OAuthFlow) - OAuth flow orchestrator class
- `jQ0` (LocalCallbackServer) - HTTP callback server class
- `RY2` (generateCodeVerifier) - PKCE verifier generation
- `TY2` (generateCodeChallenge) - PKCE challenge generation (SHA256)
- `PY2` (generateState) - State parameter generation
- `SQ0` (base64UrlEncode) - Base64 URL-safe encoding
- `oz1` (buildOAuthAuthorizeUrl) - Construct authorization URL
- `cZ` (openBrowserUrl) - Open URL in system browser
- `Lo0` (exchangeCodeForTokens) - Token exchange
- `Mo0` (refreshAccessToken) - Token refresh
- `gzA` (saveOAuthTokens) - Persist tokens
- `M6` (getClaudeAiOAuth) - Retrieve cached tokens
- `tz1` (fetchProfileInfo) - Get subscription type
- `k4A` (fetchOAuthProfile) - Fetch profile from API
- `ez1` (saveAccountInfo) - Save account info to config
- `wv` (hasClaudeAiScope) - Check for inference scope
- `cbA` (parseScopes) - Parse scope string to array
- `Vr0` (OAUTH_CONFIG) - OAuth endpoints configuration

---

## OAuth Flow Overview

Claude Code implements OAuth 2.0 Authorization Code flow with PKCE (Proof Key for Code Exchange) for secure browser-based authentication.

### Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        OAuth 2.0 Authorization Code Flow with PKCE           │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  User initiates │
│   /login CLI    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. Generate PKCE Challenge                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  code_verifier = crypto.randomBytes(32).toString('base64url')          │ │
│  │  code_challenge = SHA256(code_verifier).toString('base64url')          │ │
│  │  state = crypto.randomBytes(16).toString('hex')                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. Build Authorization URL                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Endpoint: claude.ai/oauth/authorize                                   │ │
│  │         OR console.anthropic.com/oauth/authorize                       │ │
│  │  Params:                                                               │ │
│  │    - client_id: 9d1c250a-e61b-44d9-88ed-5944d1962f5e                   │ │
│  │    - response_type: code                                               │ │
│  │    - redirect_uri: http://localhost:{port}/callback                    │ │
│  │    - scope: user:profile user:inference user:sessions:claude_code      │ │
│  │    - code_challenge: {challenge}                                       │ │
│  │    - code_challenge_method: S256                                       │ │
│  │    - state: {random_state}                                             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. User Authorization                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  - Browser opens authorization URL                                     │ │
│  │  - User logs in (if needed)                                            │ │
│  │  - User approves Claude Code access                                    │ │
│  │  - Redirect to: http://localhost:{port}/callback?code={auth_code}      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. Token Exchange (POST /oauth/token)                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Request:                                                              │ │
│  │    grant_type: authorization_code                                      │ │
│  │    code: {auth_code}                                                   │ │
│  │    redirect_uri: http://localhost:{port}/callback                      │ │
│  │    client_id: {client_id}                                              │ │
│  │    code_verifier: {original_verifier}  ← PKCE verification             │ │
│  │                                                                        │ │
│  │  Response:                                                             │ │
│  │    access_token: eyJ...                                                │ │
│  │    refresh_token: rt_...                                               │ │
│  │    expires_in: 31536000 (1 year)                                       │ │
│  │    scope: user:profile user:inference user:sessions:claude_code        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. Fetch Profile & Store Credentials                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  GET /api/oauth/profile → { organization_type, display_name, ... }     │ │
│  │  Map subscription: claude_max→"max", claude_pro→"pro", etc.            │ │
│  │  Store in: macOS Keychain OR ~/.claude/.credentials.json               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### OAuth Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Claude.ai Authorization | `https://claude.ai/oauth/authorize` | Consumer login |
| Console Authorization | `https://console.anthropic.com/oauth/authorize` | API console login |
| Token Exchange | `https://console.anthropic.com/v1/oauth/token` | Code → tokens |
| Profile | `https://api.anthropic.com/api/oauth/profile` | User info |
| Roles | `https://api.anthropic.com/api/oauth/claude_cli/roles` | Organization roles |
| API Key Gen | `https://api.anthropic.com/api/oauth/claude_cli/create_api_key` | Generate API key |

### Client Configuration

```javascript
CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e"
```

---

## OAuth Endpoints Configuration

The OAuth configuration is centralized in a single object for production and development environments.

### Algorithm: `Vr0` (OAUTH_CONFIG)

```javascript
// ============================================
// OAUTH_CONFIG - OAuth endpoints and configuration
// Location: chunks.23.mjs:496-524
// ============================================

// ORIGINAL (for source lookup):
Vr0 = {
  BASE_API_URL: "https://api.anthropic.com",
  CONSOLE_AUTHORIZE_URL: "https://console.anthropic.com/oauth/authorize",
  CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
  TOKEN_URL: "https://console.anthropic.com/v1/oauth/token",
  API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
  ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
  CONSOLE_SUCCESS_URL: "https://console.anthropic.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
  CLAUDEAI_SUCCESS_URL: "https://console.anthropic.com/oauth/code/success?app=claude-code",
  MANUAL_REDIRECT_URL: "https://console.anthropic.com/oauth/code/callback",
  CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
  OAUTH_FILE_SUFFIX: ""
};

// Development/Staging Configuration (for reference):
$W4 = {
  BASE_API_URL: "http://localhost:3000",
  CONSOLE_AUTHORIZE_URL: "http://localhost:3000/oauth/authorize",
  CLAUDE_AI_AUTHORIZE_URL: "http://localhost:4000/oauth/authorize",
  TOKEN_URL: "http://localhost:3000/v1/oauth/token",
  // ... different CLIENT_ID for staging
  CLIENT_ID: "22422756-60c9-4084-8eb7-27705fd5cf9a",
  OAUTH_FILE_SUFFIX: "-local-oauth"
};

// READABLE (for understanding):
const OAUTH_CONFIG = {
  BASE_API_URL: "https://api.anthropic.com",

  // Authorization Endpoints (two options for different user types)
  CONSOLE_AUTHORIZE_URL: "https://console.anthropic.com/oauth/authorize",  // API Console users
  CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",            // Subscription users (Max/Pro)

  // Token Exchange Endpoint
  TOKEN_URL: "https://console.anthropic.com/v1/oauth/token",

  // API Key Generation from OAuth
  API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",

  // User Roles Endpoint
  ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",

  // Success Redirect URLs (shown after browser login)
  CONSOLE_SUCCESS_URL: "https://console.anthropic.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
  CLAUDEAI_SUCCESS_URL: "https://console.anthropic.com/oauth/code/success?app=claude-code",

  // Manual Code Entry URL (when localhost callback fails)
  MANUAL_REDIRECT_URL: "https://console.anthropic.com/oauth/code/callback",

  // Public OAuth Client ID
  CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",

  // File suffix for credentials file
  OAUTH_FILE_SUFFIX: ""
};

// Mapping: Vr0→OAUTH_CONFIG, $W4→STAGING_CONFIG
```

### Endpoint Summary

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Claude.ai Auth | `claude.ai/oauth/authorize` | Login for subscription users (Max, Pro, Team, Enterprise) |
| Console Auth | `console.anthropic.com/oauth/authorize` | Login for API Console users |
| Token Exchange | `console.anthropic.com/v1/oauth/token` | Exchange auth code for tokens |
| Profile API | `api.anthropic.com/api/oauth/profile` | Get user info and subscription type |
| Roles API | `api.anthropic.com/api/oauth/claude_cli/roles` | Get organization roles |
| API Key Gen | `api.anthropic.com/api/oauth/claude_cli/create_api_key` | Generate API key from OAuth token |
| Success Page | `console.anthropic.com/oauth/code/success` | Browser redirect after successful auth |
| Manual Callback | `console.anthropic.com/oauth/code/callback` | Shows auth code for manual entry |

---

## OAuth Flow Orchestrator Class

The `KRA` class orchestrates the entire OAuth flow, managing PKCE generation, local server, browser opening, and token exchange.

### Algorithm: `KRA` (OAuthFlow Class)

```javascript
// ============================================
// OAuthFlow - Main OAuth flow orchestrator
// Location: chunks.118.mjs:823-908
// ============================================

// ORIGINAL (for source lookup):
class KRA {
  codeVerifier;
  authCodeListener = null;
  port = null;
  manualAuthCodeResolver = null;

  constructor() {
    this.codeVerifier = RY2()  // Generate random code verifier on instantiation
  }

  async startOAuthFlow(A, Q) {
    // Step 1: Start local HTTP server for callback
    this.authCodeListener = new jQ0;
    this.port = await this.authCodeListener.start();

    // Step 2: Generate PKCE challenge from verifier
    let B = TY2(this.codeVerifier),
      G = PY2(),  // Generate random state
      Z = {
        codeChallenge: B,
        state: G,
        port: this.port,
        loginWithClaudeAi: Q?.loginWithClaudeAi,
        inferenceOnly: Q?.inferenceOnly,
        orgUUID: Q?.orgUUID
      },
      // Step 3: Build two auth URLs (manual and automatic)
      I = oz1({...Z, isManual: !0}),  // URL for manual code entry
      Y = oz1({...Z, isManual: !1}),  // URL for localhost callback

      // Step 4: Wait for authorization code
      J = await this.waitForAuthorizationCode(G, async () => {
        await A(I);           // Display manual URL to user
        await cZ(Y)           // Open browser with automatic URL
      }),
      W = this.authCodeListener?.hasPendingResponse() ?? !1;

    GA("tengu_oauth_auth_code_received", { automatic: W });

    try {
      // Step 5: Exchange code for tokens with PKCE verification
      let X = await Lo0(J, G, this.codeVerifier, this.port, !W, Q?.expiresIn);

      // Step 6: Clear onboarding state
      await w80({ clearOnboarding: !1 });

      // Step 7: Fetch user profile to get subscription type
      let V = await tz1(X.access_token);

      // Step 8: Save account info if available
      if (X.account) ez1({
        accountUuid: X.account.uuid,
        emailAddress: X.account.email_address,
        organizationUuid: X.organization?.uuid,
        displayName: V.displayName,
        hasExtraUsageEnabled: V.hasExtraUsageEnabled ?? void 0
      });

      // Step 9: Handle success redirect (if automatic callback)
      if (W) {
        let F = cbA(X.scope);
        this.authCodeListener?.handleSuccessRedirect(F)
      }

      // Step 10: Return formatted tokens
      return this.formatTokens(X, V.subscriptionType, V.rateLimitTier)
    } catch (X) {
      if (W) this.authCodeListener?.handleErrorRedirect();
      throw X
    } finally {
      this.authCodeListener?.close()
    }
  }

  async waitForAuthorizationCode(A, Q) {
    return new Promise((B, G) => {
      this.manualAuthCodeResolver = B;
      this.authCodeListener?.waitForAuthorization(A, Q).then((Z) => {
        this.manualAuthCodeResolver = null;
        B(Z)
      }).catch((Z) => {
        this.manualAuthCodeResolver = null;
        G(Z)
      })
    })
  }

  handleManualAuthCodeInput(A) {
    if (this.manualAuthCodeResolver) {
      this.manualAuthCodeResolver(A.authorizationCode);
      this.manualAuthCodeResolver = null;
      this.authCodeListener?.close()
    }
  }

  formatTokens(A, Q, B) {
    return {
      accessToken: A.access_token,
      refreshToken: A.refresh_token,
      expiresAt: Date.now() + A.expires_in * 1000,  // Convert seconds to timestamp
      scopes: cbA(A.scope),                         // Parse scope string to array
      subscriptionType: Q,
      rateLimitTier: B
    }
  }

  cleanup() {
    this.authCodeListener?.close();
    this.manualAuthCodeResolver = null
  }
}

// READABLE (for understanding):
class OAuthFlow {
  codeVerifier;                  // PKCE code verifier (generated once per flow)
  authCodeListener = null;       // Local HTTP server for callback
  port = null;                   // Port number of callback server
  manualAuthCodeResolver = null; // Promise resolver for manual code entry

  constructor() {
    // Generate PKCE code verifier immediately on instantiation
    this.codeVerifier = generateCodeVerifier();
  }

  async startOAuthFlow(displayManualUrl, options) {
    // Step 1: Start local HTTP server on random port
    this.authCodeListener = new LocalCallbackServer();
    this.port = await this.authCodeListener.start();

    // Step 2: Generate PKCE challenge (SHA256 of verifier)
    let codeChallenge = generateCodeChallenge(this.codeVerifier);
    let state = generateState();  // Random state for CSRF protection

    let authParams = {
      codeChallenge,
      state,
      port: this.port,
      loginWithClaudeAi: options?.loginWithClaudeAi,  // true = claude.ai, false = console
      inferenceOnly: options?.inferenceOnly,          // limited scope mode
      orgUUID: options?.orgUUID                       // pre-select organization
    };

    // Step 3: Build two authorization URLs
    let manualUrl = buildOAuthAuthorizeUrl({...authParams, isManual: true});   // For copy-paste
    let automaticUrl = buildOAuthAuthorizeUrl({...authParams, isManual: false}); // For browser

    // Step 4: Wait for authorization code (from either callback or manual entry)
    let authCode = await this.waitForAuthorizationCode(state, async () => {
      await displayManualUrl(manualUrl);  // Show manual URL in CLI
      await openBrowserUrl(automaticUrl); // Open browser automatically
    });

    let wasAutomatic = this.authCodeListener?.hasPendingResponse() ?? false;
    analyticsEvent("tengu_oauth_auth_code_received", { automatic: wasAutomatic });

    try {
      // Step 5: Exchange authorization code for tokens (with PKCE verification)
      let tokenResponse = await exchangeCodeForTokens(
        authCode,
        state,
        this.codeVerifier,  // Server verifies: SHA256(this) === stored challenge
        this.port,
        !wasAutomatic,      // isManual flag
        options?.expiresIn
      );

      // Step 6: Clear onboarding wizard state
      await clearOnboardingState({ clearOnboarding: false });

      // Step 7: Fetch user profile to determine subscription type
      let profileInfo = await fetchProfileInfo(tokenResponse.access_token);

      // Step 8: Save account information to config file
      if (tokenResponse.account) {
        saveAccountInfo({
          accountUuid: tokenResponse.account.uuid,
          emailAddress: tokenResponse.account.email_address,
          organizationUuid: tokenResponse.organization?.uuid,
          displayName: profileInfo.displayName,
          hasExtraUsageEnabled: profileInfo.hasExtraUsageEnabled ?? undefined
        });
      }

      // Step 9: Redirect browser to success page (only for automatic callback)
      if (wasAutomatic) {
        let scopes = parseScopes(tokenResponse.scope);
        this.authCodeListener?.handleSuccessRedirect(scopes);
      }

      // Step 10: Return formatted token object
      return this.formatTokens(tokenResponse, profileInfo.subscriptionType, profileInfo.rateLimitTier);
    } catch (error) {
      if (wasAutomatic) {
        this.authCodeListener?.handleErrorRedirect();
      }
      throw error;
    } finally {
      this.authCodeListener?.close();
    }
  }

  async waitForAuthorizationCode(expectedState, openBrowserCallback) {
    return new Promise((resolve, reject) => {
      // Store resolver for manual code entry
      this.manualAuthCodeResolver = resolve;

      // Wait for either: (1) localhost callback, or (2) manual code entry
      this.authCodeListener?.waitForAuthorization(expectedState, openBrowserCallback)
        .then((code) => {
          this.manualAuthCodeResolver = null;
          resolve(code);
        })
        .catch((error) => {
          this.manualAuthCodeResolver = null;
          reject(error);
        });
    });
  }

  // Called when user pastes authorization code manually
  handleManualAuthCodeInput(input) {
    if (this.manualAuthCodeResolver) {
      this.manualAuthCodeResolver(input.authorizationCode);
      this.manualAuthCodeResolver = null;
      this.authCodeListener?.close();
    }
  }

  formatTokens(tokenResponse, subscriptionType, rateLimitTier) {
    return {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      scopes: parseScopes(tokenResponse.scope),
      subscriptionType,
      rateLimitTier
    };
  }

  cleanup() {
    this.authCodeListener?.close();
    this.manualAuthCodeResolver = null;
  }
}

// Mapping: KRA→OAuthFlow, jQ0→LocalCallbackServer, RY2→generateCodeVerifier,
//          TY2→generateCodeChallenge, PY2→generateState, oz1→buildOAuthAuthorizeUrl,
//          cZ→openBrowserUrl, Lo0→exchangeCodeForTokens, tz1→fetchProfileInfo,
//          ez1→saveAccountInfo, cbA→parseScopes, w80→clearOnboardingState, GA→analyticsEvent
```

### Key Design Decisions

**Dual URL Strategy:**
- `automaticUrl` - Points to `http://localhost:{port}/callback`, browser redirects here after login
- `manualUrl` - Points to `console.anthropic.com/oauth/code/callback`, shows auth code for copy-paste

**Why Two URLs?**
1. Some environments block localhost callbacks (firewalls, corporate proxies)
2. Some browsers have restrictions on localhost redirects
3. Manual entry provides a reliable fallback

**PKCE Verification Flow:**
1. Client generates random `code_verifier` (32 bytes, base64url encoded)
2. Client computes `code_challenge = SHA256(code_verifier)` (base64url encoded)
3. Authorization request includes `code_challenge` and `code_challenge_method=S256`
4. Server stores the challenge
5. Token exchange includes original `code_verifier`
6. Server verifies: `SHA256(code_verifier) === stored_challenge`

**Why This Matters:**
- Attacker who intercepts the authorization code cannot exchange it
- They don't have the `code_verifier` (never transmitted before token exchange)
- The `code_challenge` is one-way hashed, cannot derive `code_verifier`

---

## Local Callback Server

The `jQ0` class creates a local HTTP server to receive the OAuth callback from the browser.

### Algorithm: `jQ0` (LocalCallbackServer Class)

```javascript
// ============================================
// LocalCallbackServer - HTTP server for OAuth callback
// Location: chunks.108.mjs:110-199
// ============================================

// ORIGINAL (for source lookup):
class jQ0 {
  localServer;
  port = 0;
  promiseResolver = null;
  promiseRejecter = null;
  expectedState = null;
  pendingResponse = null;
  callbackPath;

  constructor(A = "/callback") {
    this.localServer = MY2.createServer();  // Node.js http.createServer()
    this.callbackPath = A
  }

  async start(A) {
    return new Promise((Q, B) => {
      this.localServer.once("error", (G) => {
        B(Error(`Failed to start OAuth callback server: ${G.message}`))
      });
      this.localServer.listen(A ?? 0, "localhost", () => {
        let G = this.localServer.address();
        this.port = G.port;
        Q(this.port)
      })
    })
  }

  getPort() {
    return this.port
  }

  hasPendingResponse() {
    return this.pendingResponse !== null
  }

  async waitForAuthorization(A, Q) {
    return new Promise((B, G) => {
      this.promiseResolver = B;
      this.promiseRejecter = G;
      this.expectedState = A;
      this.startLocalListener(Q)
    })
  }

  handleSuccessRedirect(A, Q) {
    if (!this.pendingResponse) return;
    if (Q) {
      Q(this.pendingResponse, A);
      this.pendingResponse = null;
      GA("tengu_oauth_automatic_redirect", { custom_handler: !0 });
      return
    }
    let B = wv(A) ? e9().CLAUDEAI_SUCCESS_URL : e9().CONSOLE_SUCCESS_URL;
    this.pendingResponse.writeHead(302, { Location: B });
    this.pendingResponse.end();
    this.pendingResponse = null;
    GA("tengu_oauth_automatic_redirect", {})
  }

  handleErrorRedirect() {
    if (!this.pendingResponse) return;
    let A = e9().CLAUDEAI_SUCCESS_URL;
    this.pendingResponse.writeHead(302, { Location: A });
    this.pendingResponse.end();
    this.pendingResponse = null;
    GA("tengu_oauth_automatic_redirect_error", {})
  }

  startLocalListener(A) {
    this.localServer.on("request", this.handleRedirect.bind(this));
    this.localServer.on("error", this.handleError.bind(this));
    A()  // Execute callback (opens browser)
  }

  handleRedirect(A, Q) {
    let B = new URL(A.url || "", `http://${A.headers.host||"localhost"}`);
    if (B.pathname !== this.callbackPath) {
      Q.writeHead(404);
      Q.end();
      return
    }
    let G = B.searchParams.get("code") ?? void 0,
      Z = B.searchParams.get("state") ?? void 0;
    this.validateAndRespond(G, Z, Q)
  }

  validateAndRespond(A, Q, B) {
    // Validate authorization code exists
    if (!A) {
      B.writeHead(400);
      B.end("Authorization code not found");
      this.reject(Error("No authorization code received"));
      return
    }
    // Validate state matches (CSRF protection)
    if (Q !== this.expectedState) {
      B.writeHead(400);
      B.end("Invalid state parameter");
      this.reject(Error("Invalid state parameter"));
      return
    }
    // Store response for later redirect, resolve with auth code
    this.pendingResponse = B;
    this.resolve(A)
  }

  handleError(A) {
    AA(A);
    this.close();
    this.reject(A)
  }

  resolve(A) {
    if (this.promiseResolver) {
      this.promiseResolver(A);
      this.promiseResolver = null;
      this.promiseRejecter = null
    }
  }

  reject(A) {
    if (this.promiseRejecter) {
      this.promiseRejecter(A);
      this.promiseResolver = null;
      this.promiseRejecter = null
    }
  }

  close() {
    if (this.pendingResponse) this.handleErrorRedirect();
    if (this.localServer) {
      this.localServer.removeAllListeners();
      this.localServer.close()
    }
  }
}

// READABLE (for understanding):
class LocalCallbackServer {
  localServer;           // Node.js HTTP server instance
  port = 0;              // Assigned port number
  promiseResolver = null; // Promise resolver for auth code
  promiseRejecter = null; // Promise rejecter for errors
  expectedState = null;   // State parameter for CSRF validation
  pendingResponse = null; // HTTP response object (to redirect after token exchange)
  callbackPath;           // URL path to listen on (default: "/callback")

  constructor(callbackPath = "/callback") {
    // Create raw HTTP server (no Express, minimal dependencies)
    this.localServer = http.createServer();
    this.callbackPath = callbackPath;
  }

  async start(port) {
    return new Promise((resolve, reject) => {
      this.localServer.once("error", (error) => {
        reject(Error(`Failed to start OAuth callback server: ${error.message}`));
      });

      // Listen on localhost only (security: not accessible from network)
      // Port 0 = let OS assign random available port
      this.localServer.listen(port ?? 0, "localhost", () => {
        let address = this.localServer.address();
        this.port = address.port;
        resolve(this.port);
      });
    });
  }

  getPort() {
    return this.port;
  }

  hasPendingResponse() {
    return this.pendingResponse !== null;
  }

  async waitForAuthorization(expectedState, onReadyCallback) {
    return new Promise((resolve, reject) => {
      this.promiseResolver = resolve;
      this.promiseRejecter = reject;
      this.expectedState = expectedState;  // Store for validation
      this.startLocalListener(onReadyCallback);
    });
  }

  handleSuccessRedirect(scopes, customHandler) {
    if (!this.pendingResponse) return;

    if (customHandler) {
      customHandler(this.pendingResponse, scopes);
      this.pendingResponse = null;
      analyticsEvent("tengu_oauth_automatic_redirect", { custom_handler: true });
      return;
    }

    // Redirect based on scope: Claude.ai vs Console success page
    let successUrl = hasClaudeAiScope(scopes)
      ? getConfig().CLAUDEAI_SUCCESS_URL
      : getConfig().CONSOLE_SUCCESS_URL;

    this.pendingResponse.writeHead(302, { Location: successUrl });
    this.pendingResponse.end();
    this.pendingResponse = null;
    analyticsEvent("tengu_oauth_automatic_redirect", {});
  }

  handleErrorRedirect() {
    if (!this.pendingResponse) return;

    let errorUrl = getConfig().CLAUDEAI_SUCCESS_URL;
    this.pendingResponse.writeHead(302, { Location: errorUrl });
    this.pendingResponse.end();
    this.pendingResponse = null;
    analyticsEvent("tengu_oauth_automatic_redirect_error", {});
  }

  startLocalListener(onReadyCallback) {
    this.localServer.on("request", this.handleRedirect.bind(this));
    this.localServer.on("error", this.handleError.bind(this));
    onReadyCallback();  // Open browser after server is listening
  }

  handleRedirect(request, response) {
    // Parse the callback URL
    let url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);

    // Only handle the callback path (ignore favicon, etc.)
    if (url.pathname !== this.callbackPath) {
      response.writeHead(404);
      response.end();
      return;
    }

    // Extract authorization code and state from query params
    let code = url.searchParams.get("code") ?? undefined;
    let state = url.searchParams.get("state") ?? undefined;
    this.validateAndRespond(code, state, response);
  }

  validateAndRespond(code, state, response) {
    // Security check 1: Authorization code must exist
    if (!code) {
      response.writeHead(400);
      response.end("Authorization code not found");
      this.reject(Error("No authorization code received"));
      return;
    }

    // Security check 2: State must match (CSRF protection)
    if (state !== this.expectedState) {
      response.writeHead(400);
      response.end("Invalid state parameter");
      this.reject(Error("Invalid state parameter"));
      return;
    }

    // Keep response open - will redirect after token exchange completes
    this.pendingResponse = response;
    this.resolve(code);
  }

  handleError(error) {
    logError(error);
    this.close();
    this.reject(error);
  }

  resolve(code) {
    if (this.promiseResolver) {
      this.promiseResolver(code);
      this.promiseResolver = null;
      this.promiseRejecter = null;
    }
  }

  reject(error) {
    if (this.promiseRejecter) {
      this.promiseRejecter(error);
      this.promiseResolver = null;
      this.promiseRejecter = null;
    }
  }

  close() {
    if (this.pendingResponse) {
      this.handleErrorRedirect();
    }
    if (this.localServer) {
      this.localServer.removeAllListeners();
      this.localServer.close();
    }
  }
}

// Mapping: jQ0→LocalCallbackServer, MY2→http, wv→hasClaudeAiScope, e9→getConfig,
//          GA→analyticsEvent, AA→logError
```

### Security Considerations

**Localhost Binding:**
- Server binds to `localhost` only, not `0.0.0.0`
- Prevents external network access to callback endpoint
- Only local browser can complete the OAuth redirect

**State Parameter Validation:**
- Random `state` generated for each flow
- Validated on callback to prevent CSRF attacks
- Attacker cannot forge a valid callback URL

**Delayed Response:**
- HTTP response is kept open after receiving auth code
- Browser shows "loading" while token exchange happens
- Only redirects to success/error page after completion

---

## PKCE Implementation

PKCE (RFC 7636) prevents authorization code interception attacks.

### How PKCE Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    PKCE Security Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client Side:                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  code_verifier = random(32 bytes) → base64url encode        ││
│  │  code_challenge = SHA256(code_verifier) → base64url encode  ││
│  └─────────────────────────────────────────────────────────────┘│
│                          │                                       │
│                          ▼                                       │
│  Authorization Request:                                          │
│    code_challenge={challenge}&code_challenge_method=S256         │
│                          │                                       │
│                          ▼                                       │
│  Server stores challenge, returns auth_code                      │
│                          │                                       │
│                          ▼                                       │
│  Token Exchange:                                                 │
│    code={auth_code}&code_verifier={original_verifier}            │
│                          │                                       │
│                          ▼                                       │
│  Server verifies: SHA256(code_verifier) === stored_challenge     │
│    ✓ Match → Issue tokens                                        │
│    ✗ Mismatch → Reject (attacker can't recreate verifier)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why S256?**
- SHA256 is one-way: attacker who intercepts the challenge cannot derive the verifier
- More secure than "plain" method where challenge equals verifier

### PKCE Code Implementation

```javascript
// ============================================
// PKCE Functions - Code verifier, challenge, and state generation
// Location: chunks.108.mjs:207-223
// ============================================

// ORIGINAL (for source lookup):

// Base64 URL-safe encoding (RFC 4648)
function SQ0(A) {
  return A.toString("base64")
    .replace(/\+/g, "-")    // '+' → '-'
    .replace(/\//g, "_")    // '/' → '_'
    .replace(/=/g, "")      // Remove padding
}

// Generate code verifier: 32 random bytes → base64url
function RY2() {
  return SQ0(aMA.randomBytes(32))
}

// Generate code challenge: SHA256(verifier) → base64url
function TY2(A) {
  let Q = aMA.createHash("sha256");
  return Q.update(A), SQ0(Q.digest())
}

// Generate state: 32 random bytes → base64url
function PY2() {
  return SQ0(aMA.randomBytes(32))
}

// READABLE (for understanding):

/**
 * Base64 URL-safe encoding (RFC 4648 Section 5)
 * Standard base64 uses +/= which are not URL-safe
 * This converts to URL-safe alphabet: - _ (no padding)
 */
function base64UrlEncode(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")    // Replace + with -
    .replace(/\//g, "_")    // Replace / with _
    .replace(/=/g, "");     // Remove = padding
}

/**
 * Generate PKCE code verifier
 * @returns {string} 43-character random string (32 bytes → base64url)
 */
function generateCodeVerifier() {
  // 32 bytes = 256 bits of entropy
  // After base64url encoding: 32 * 4/3 ≈ 43 characters
  return base64UrlEncode(crypto.randomBytes(32));
}

/**
 * Generate PKCE code challenge from verifier
 * @param {string} codeVerifier - The code verifier to hash
 * @returns {string} SHA256 hash of verifier, base64url encoded
 */
function generateCodeChallenge(codeVerifier) {
  let hash = crypto.createHash("sha256");
  hash.update(codeVerifier);
  return base64UrlEncode(hash.digest());
}

/**
 * Generate random state parameter for CSRF protection
 * @returns {string} 43-character random string
 */
function generateState() {
  return base64UrlEncode(crypto.randomBytes(32));
}

// Mapping: SQ0→base64UrlEncode, RY2→generateCodeVerifier, TY2→generateCodeChallenge,
//          PY2→generateState, aMA→crypto
```

### PKCE Example Values

```
Code Verifier (before encoding):
  [32 random bytes in hex]: a1b2c3d4e5f6...

Code Verifier (base64url):
  dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

Code Challenge (SHA256 of verifier, base64url):
  E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM

State (random):
  xyzABCdefGHI123456789_-0987654321abcdefg
```

### Why 32 Bytes?
- **256 bits of entropy** - Computationally infeasible to brute force
- **RFC 7636 requirement** - Minimum 43 characters (256 bits / 6 bits per base64 char)
- **Same for state** - CSRF protection needs high entropy

---

## Authorization URL Construction

### Algorithm: `oz1()` (buildOAuthAuthorizeUrl)

```javascript
// ============================================
// buildOAuthAuthorizeUrl - Construct OAuth authorization URL
// Location: chunks.24.mjs:1556-1571
// ============================================

// ORIGINAL (for source lookup):
function oz1({
  codeChallenge: A,
  state: Q,
  port: B,
  isManual: G,
  loginWithClaudeAi: Z,
  inferenceOnly: I,
  orgUUID: Y
}) {
  let J = Z ? e9().CLAUDE_AI_AUTHORIZE_URL : e9().CONSOLE_AUTHORIZE_URL,
    W = new URL(J);
  W.searchParams.append("code", "true"),
  W.searchParams.append("client_id", e9().CLIENT_ID),
  W.searchParams.append("response_type", "code"),
  W.searchParams.append("redirect_uri", G ? e9().MANUAL_REDIRECT_URL : `http://localhost:${B}/callback`);
  let X = I ? [wbA] : Dr0;
  if (W.searchParams.append("scope", X.join(" ")),
      W.searchParams.append("code_challenge", A),
      W.searchParams.append("code_challenge_method", "S256"),
      W.searchParams.append("state", Q),
      Y) W.searchParams.append("orgUUID", Y);
  return W.toString()
}

// READABLE (for understanding):
function buildOAuthAuthorizeUrl({
  codeChallenge,
  state,
  port,
  isManual,
  loginWithClaudeAi,
  inferenceOnly,
  orgUUID
}) {
  // Select authorization endpoint based on login type
  let authorizeEndpoint = loginWithClaudeAi
    ? getConfig().CLAUDE_AI_AUTHORIZE_URL      // claude.ai/oauth/authorize
    : getConfig().CONSOLE_AUTHORIZE_URL;        // console.anthropic.com/oauth/authorize

  let url = new URL(authorizeEndpoint);

  // Required OAuth parameters
  url.searchParams.append("code", "true");
  url.searchParams.append("client_id", getConfig().CLIENT_ID);
  url.searchParams.append("response_type", "code");

  // Redirect URI: localhost callback or manual code entry page
  url.searchParams.append(
    "redirect_uri",
    isManual ? getConfig().MANUAL_REDIRECT_URL : `http://localhost:${port}/callback`
  );

  // Scope selection: inference-only or full Claude.ai access
  let scopes = inferenceOnly ? [INFERENCE_ONLY_SCOPE] : FULL_CLAUDE_AI_SCOPES;
  url.searchParams.append("scope", scopes.join(" "));

  // PKCE challenge (always SHA256)
  url.searchParams.append("code_challenge", codeChallenge);
  url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("state", state);

  // Optional: pre-select organization
  if (orgUUID) url.searchParams.append("orgUUID", orgUUID);

  return url.toString();
}

// Mapping: oz1→buildOAuthAuthorizeUrl, e9→getConfig, wbA→INFERENCE_ONLY_SCOPE, Dr0→FULL_CLAUDE_AI_SCOPES
```

### Key Design Decisions

**Two Authorization Endpoints:**
- `claude.ai/oauth/authorize` - For Claude.ai subscription users (Max, Pro, etc.)
- `console.anthropic.com/oauth/authorize` - For API Console users

**Manual Code Entry Fallback:**
When localhost callback fails (firewall, browser restrictions), users can:
1. Copy the authorization URL
2. Complete login in browser
3. Copy the authorization code from the success page
4. Paste into Claude Code CLI

---

## Browser Opening Logic

The `cZ()` function opens URLs in the system default browser, with platform-specific handling.

### Algorithm: `cZ()` (openBrowserUrl)

```javascript
// ============================================
// openBrowserUrl - Open URL in system browser
// Location: chunks.94.mjs:955-981
// ============================================

// ORIGINAL (for source lookup):
async function cZ(A) {
  try {
    F95(A);  // Validate URL format and protocol
    let Q = process.env.BROWSER,    // Custom browser override
      B = process.platform;         // darwin, win32, linux

    if (B === "win32") {
      if (Q) {
        // Use custom browser if specified
        let { code: Z } = await QQ(Q, [`"${A}"`]);
        return Z === 0
      }
      // Default Windows: use rundll32 to open URL
      let { code: G } = await QQ("rundll32", ["url,OpenURL", A], {});
      return G === 0
    } else {
      // macOS: 'open', Linux: 'xdg-open', or custom BROWSER env
      let G = Q || (B === "darwin" ? "open" : "xdg-open"),
        { code: Z } = await QQ(G, [A]);
      return Z === 0
    }
  } catch (Q) {
    return !1  // Silently fail, fallback to manual URL entry
  }
}

// READABLE (for understanding):
async function openBrowserUrl(url) {
  try {
    // Security: Validate URL format (must be http:// or https://)
    validateUrlFormat(url);

    let customBrowser = process.env.BROWSER;  // User can override
    let platform = process.platform;

    if (platform === "win32") {
      if (customBrowser) {
        // User specified custom browser
        let { code } = await execCommand(customBrowser, [`"${url}"`]);
        return code === 0;
      }
      // Windows: Use rundll32 to invoke default URL handler
      // This is more reliable than 'start' for URLs
      let { code } = await execCommand("rundll32", ["url,OpenURL", url], {});
      return code === 0;
    } else {
      // Unix-like systems
      let browserCommand = customBrowser
        || (platform === "darwin" ? "open" : "xdg-open");
      //    macOS: 'open' command        Linux: 'xdg-open' (freedesktop.org standard)

      let { code } = await execCommand(browserCommand, [url]);
      return code === 0;
    }
  } catch (error) {
    // Don't throw - browser opening is optional
    // User can still copy the URL manually
    return false;
  }
}

// Mapping: cZ→openBrowserUrl, F95→validateUrlFormat, QQ→execCommand
```

### URL Validation

```javascript
// ============================================
// validateUrlFormat - Ensure URL is safe to open
// Location: chunks.94.mjs:948-953
// ============================================

// ORIGINAL (for source lookup):
function F95(A) {
  let Q;
  try {
    Q = new URL(A)
  } catch {
    throw Error(`Invalid URL format: ${A}`)
  }
  if (Q.protocol !== "http:" && Q.protocol !== "https:")
    throw Error(`Invalid URL protocol: must use http:// or https://, got ${Q.protocol}`)
}

// READABLE (for understanding):
function validateUrlFormat(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw Error(`Invalid URL format: ${url}`);
  }

  // Security: Only allow HTTP/HTTPS protocols
  // Prevents: file://, javascript:, data:, etc.
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw Error(`Invalid URL protocol: must use http:// or https://, got ${parsedUrl.protocol}`);
  }
}

// Mapping: F95→validateUrlFormat
```

### Platform-Specific Commands

| Platform | Default Command | Alternative |
|----------|-----------------|-------------|
| **macOS** | `open <url>` | Uses Launch Services |
| **Linux** | `xdg-open <url>` | Falls back to `$BROWSER` env |
| **Windows** | `rundll32 url,OpenURL <url>` | Uses URL protocol handler |

### BROWSER Environment Variable

Users can override the default browser:

```bash
# Use Firefox instead of default browser
export BROWSER=/usr/bin/firefox
claude

# Or inline
BROWSER=firefox claude
```

---

## Token Exchange

### Algorithm: `Lo0()` (exchangeCodeForTokens)

```javascript
// ============================================
// exchangeCodeForTokens - OAuth token exchange
// Location: chunks.24.mjs:1573-1590
// ============================================

// ORIGINAL (for source lookup):
async function Lo0(A, Q, B, G, Z = !1, I) {
  let Y = {
    grant_type: "authorization_code",
    code: A,
    redirect_uri: Z ? e9().MANUAL_REDIRECT_URL : `http://localhost:${G}/callback`,
    client_id: e9().CLIENT_ID,
    code_verifier: B,
    state: Q
  };
  if (I !== void 0) Y.expires_in = I;
  let J = await YQ.post(e9().TOKEN_URL, Y, {
    headers: { "Content-Type": "application/json" }
  });
  if (J.status !== 200)
    throw Error(J.status === 401
      ? "Authentication failed: Invalid authorization code"
      : `Token exchange failed (${J.status}): ${J.statusText}`);
  return GA("tengu_oauth_token_exchange_success", {}), J.data
}

// READABLE (for understanding):
async function exchangeCodeForTokens(
  authCode,
  state,
  codeVerifier,
  port,
  isManual = false,
  expiresIn
) {
  let payload = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: isManual
      ? getConfig().MANUAL_REDIRECT_URL
      : `http://localhost:${port}/callback`,
    client_id: getConfig().CLIENT_ID,
    code_verifier: codeVerifier,  // PKCE: server verifies SHA256(this) === challenge
    state: state
  };

  // Optional: request specific token lifetime
  if (expiresIn !== undefined) {
    payload.expires_in = expiresIn;
  }

  let response = await axios.post(getConfig().TOKEN_URL, payload, {
    headers: { "Content-Type": "application/json" }
  });

  if (response.status !== 200) {
    throw Error(response.status === 401
      ? "Authentication failed: Invalid authorization code"
      : `Token exchange failed (${response.status}): ${response.statusText}`);
  }

  analyticsEvent("tengu_oauth_token_exchange_success", {});
  return response.data;
  // Returns: { access_token, refresh_token, expires_in, scope, account }
}

// Mapping: Lo0→exchangeCodeForTokens, YQ→axios, e9→getConfig, GA→analyticsEvent
```

### Token Response Structure

```typescript
interface TokenResponse {
  access_token: string;      // JWT for API authentication
  refresh_token: string;     // For obtaining new access tokens
  expires_in: number;        // Seconds until expiration (typically 31536000 = 1 year)
  scope: string;             // Space-separated scopes
  account?: {
    uuid: string;
    email: string;
    display_name: string;
  };
}
```

---

## Credential Storage

### Algorithm: `gzA()` (saveOAuthTokens)

```javascript
// ============================================
// saveOAuthTokens - Persist OAuth tokens to secure storage
// Location: chunks.56.mjs:1979-2015
// ============================================

// ORIGINAL (for source lookup):
function gzA(A) {
  if (!wv(A.scopes)) return GA("tengu_oauth_tokens_not_claude_ai", {}), { success: !0 };
  if (!A.refreshToken || !A.expiresAt) return GA("tengu_oauth_tokens_inference_only", {}), { success: !0 };

  let Q = Fw(),
    B = Q.name;
  try {
    let G = Q.read() || {};
    G.claudeAiOauth = {
      accessToken: A.accessToken,
      refreshToken: A.refreshToken,
      expiresAt: A.expiresAt,
      scopes: A.scopes,
      subscriptionType: A.subscriptionType,
      rateLimitTier: A.rateLimitTier
    };
    let Z = Q.update(G);
    if (Z.success) GA("tengu_oauth_tokens_saved", { storageBackend: B });
    else GA("tengu_oauth_tokens_save_failed", { storageBackend: B });
    return M6.cache?.clear?.(), x4A(), Z
  } catch (G) {
    return AA(G), GA("tengu_oauth_tokens_save_exception", {
      storageBackend: B,
      error: G.message
    }), { success: !1, warning: "Failed to save OAuth tokens" }
  }
}

// READABLE (for understanding):
function saveOAuthTokens(tokens) {
  // Skip if not Claude.ai scope (e.g., inference-only tokens)
  if (!hasClaudeAiScope(tokens.scopes)) {
    analyticsEvent("tengu_oauth_tokens_not_claude_ai", {});
    return { success: true };
  }

  // Skip if inference-only (no refresh token)
  if (!tokens.refreshToken || !tokens.expiresAt) {
    analyticsEvent("tengu_oauth_tokens_inference_only", {});
    return { success: true };
  }

  let storageBackend = getStorageBackend();  // Keychain or plaintext
  let backendName = storageBackend.name;

  try {
    let credentials = storageBackend.read() || {};

    // Store OAuth tokens under claudeAiOauth key
    credentials.claudeAiOauth = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,           // Timestamp in ms
      scopes: tokens.scopes,                  // Array of scope strings
      subscriptionType: tokens.subscriptionType,  // "max", "pro", "team", etc.
      rateLimitTier: tokens.rateLimitTier
    };

    let result = storageBackend.update(credentials);

    if (result.success) {
      analyticsEvent("tengu_oauth_tokens_saved", { storageBackend: backendName });
    } else {
      analyticsEvent("tengu_oauth_tokens_save_failed", { storageBackend: backendName });
    }

    // Clear token cache to ensure fresh read
    getClaudeAiOAuth.cache?.clear?.();
    clearInternalCache();

    return result;
  } catch (error) {
    logError(error);
    analyticsEvent("tengu_oauth_tokens_save_exception", {
      storageBackend: backendName,
      error: error.message
    });
    return { success: false, warning: "Failed to save OAuth tokens" };
  }
}

// Mapping: gzA→saveOAuthTokens, wv→hasClaudeAiScope, Fw→getStorageBackend,
//          M6→getClaudeAiOAuth, x4A→clearInternalCache, GA→analyticsEvent, AA→logError
```

### Storage Structure

```json
// ~/.claude/.credentials.json (or Keychain)
{
  "claudeAiOauth": {
    "accessToken": "eyJ...",
    "refreshToken": "rt_...",
    "expiresAt": 1735689600000,
    "scopes": ["user:profile", "user:inference", "user:sessions:claude_code"],
    "subscriptionType": "max",
    "rateLimitTier": "tier_1"
  }
}
```

---

## Account Information Storage

After successful OAuth login, account information is stored separately from tokens in the config file.

### Algorithm: `ez1()` (saveAccountInfo)

```javascript
// ============================================
// saveAccountInfo - Save user account info to config
// Location: chunks.24.mjs:1736-1752
// ============================================

// ORIGINAL (for source lookup):
function ez1({
  accountUuid: A,
  emailAddress: Q,
  organizationUuid: B,
  displayName: G,
  hasExtraUsageEnabled: Z
}) {
  let I = {
    accountUuid: A,
    emailAddress: Q,
    organizationUuid: B,
    hasExtraUsageEnabled: Z
  };
  if (G) I.displayName = G;
  let Y = N1();  // Read current config
  Y.oauthAccount = I;
  c0(Y)          // Write updated config
}

// READABLE (for understanding):
function saveAccountInfo({
  accountUuid,
  emailAddress,
  organizationUuid,
  displayName,
  hasExtraUsageEnabled
}) {
  // Build account info object
  let accountInfo = {
    accountUuid,           // User's unique identifier
    emailAddress,          // User's email (for display)
    organizationUuid,      // Organization they belong to
    hasExtraUsageEnabled   // Whether extended usage is enabled
  };

  // Optional: display name may not be set
  if (displayName) {
    accountInfo.displayName = displayName;
  }

  // Read current config file
  let config = readConfig();

  // Store under oauthAccount key (separate from tokens)
  config.oauthAccount = accountInfo;

  // Write back to config file
  writeConfig(config);
}

// Mapping: ez1→saveAccountInfo, N1→readConfig, c0→writeConfig
```

### Config File Structure (with Account Info)

```json
// ~/.claude.json
{
  "oauthAccount": {
    "accountUuid": "user_01H...",
    "emailAddress": "user@example.com",
    "organizationUuid": "org_01H...",
    "displayName": "John Doe",
    "hasExtraUsageEnabled": true,
    "organizationRole": "member",
    "workspaceRole": "developer",
    "organizationName": "Acme Corp"
  }
}
```

### Why Separate from Tokens?

1. **Different update cycles**: Tokens refresh every ~5 minutes when needed, account info is static
2. **Different storage backends**: Tokens in Keychain (secure), account info in config file (readable)
3. **Different purposes**: Tokens for authentication, account info for UI display

### Profile Fetching

```javascript
// ============================================
// fetchOAuthProfile - Get user profile from API
// Location: chunks.24.mjs:1526-1538
// ============================================

// ORIGINAL (for source lookup):
async function k4A(A) {
  let Q = `${e9().BASE_API_URL}/api/oauth/profile`;
  try {
    return (await YQ.get(Q, {
      headers: {
        Authorization: `Bearer ${A}`,
        "Content-Type": "application/json"
      }
    })).data
  } catch (B) {
    AA(B)
  }
}

// READABLE (for understanding):
async function fetchOAuthProfile(accessToken) {
  let profileUrl = `${getConfig().BASE_API_URL}/api/oauth/profile`;

  try {
    let response = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    logError(error);
    return undefined;
  }
}

// Response structure:
// {
//   account: { uuid, email, display_name },
//   organization: {
//     uuid, organization_type, rate_limit_tier,
//     has_extra_usage_enabled
//   }
// }

// Mapping: k4A→fetchOAuthProfile, e9→getConfig, YQ→axios, AA→logError
```

---

## User Profile and Subscription Detection

### Algorithm: `tz1()` (fetchProfileInfo)

```javascript
// ============================================
// fetchProfileInfo - Get subscription type from profile
// Location: chunks.24.mjs:1680-1708
// ============================================

// ORIGINAL (for source lookup):
async function tz1(A) {
  let Q = await k4A(A),
    B = Q?.organization?.organization_type,
    G = null;
  switch (B) {
    case "claude_max":       G = "max"; break;
    case "claude_pro":       G = "pro"; break;
    case "claude_enterprise": G = "enterprise"; break;
    case "claude_team":      G = "team"; break;
    default:                 G = null; break
  }
  let Z = {
    subscriptionType: G,
    rateLimitTier: Q?.organization?.rate_limit_tier ?? null,
    hasExtraUsageEnabled: Q?.organization?.has_extra_usage_enabled ?? null
  };
  if (Q?.account?.display_name) Z.displayName = Q.account.display_name;
  return GA("tengu_oauth_profile_fetch_success", {}), Z
}

// READABLE (for understanding):
async function fetchProfileInfo(accessToken) {
  let profile = await fetchOAuthProfile(accessToken);
  let orgType = profile?.organization?.organization_type;

  // Map organization type to subscription type
  let subscriptionType = null;
  switch (orgType) {
    case "claude_max":       subscriptionType = "max"; break;
    case "claude_pro":       subscriptionType = "pro"; break;
    case "claude_enterprise": subscriptionType = "enterprise"; break;
    case "claude_team":      subscriptionType = "team"; break;
    default:                 subscriptionType = null; break;
  }

  let result = {
    subscriptionType: subscriptionType,
    rateLimitTier: profile?.organization?.rate_limit_tier ?? null,
    hasExtraUsageEnabled: profile?.organization?.has_extra_usage_enabled ?? null
  };

  if (profile?.account?.display_name) {
    result.displayName = profile.account.display_name;
  }

  analyticsEvent("tengu_oauth_profile_fetch_success", {});
  return result;
}

// Mapping: tz1→fetchProfileInfo, k4A→fetchOAuthProfile, GA→analyticsEvent
```

### Subscription Types and Features

| Subscription | `organization_type` | Features |
|--------------|---------------------|----------|
| **Max** | `claude_max` | Full Opus access, highest limits |
| **Pro** | `claude_pro` | Enhanced limits, Opus (conditional) |
| **Team** | `claude_team` | Shared workspace features |
| **Enterprise** | `claude_enterprise` | Custom policies, admin controls |
| **Free/API** | `null` | Basic access |

---

## OAuth Scopes

### Scope Definitions

```javascript
// Full Claude.ai scopes (for subscription users)
FULL_CLAUDE_AI_SCOPES = [
  "user:profile",              // Read user profile
  "user:inference",            // Make API calls
  "user:sessions:claude_code"  // Claude Code session management
]

// Console API scopes
CONSOLE_API_SCOPES = [
  "org:create_api_key",        // Generate API keys
  "user:profile"               // Read user profile
]

// Inference-only scope (limited)
INFERENCE_ONLY_SCOPE = "user:inference"
```

### Scope Validation

```javascript
// ============================================
// hasClaudeAiScope - Check for inference capability
// Location: chunks.24.mjs:1548-1550
// ============================================

// ORIGINAL (for source lookup):
function wv(A) {
  return Boolean(A?.includes(wbA))
}

// READABLE (for understanding):
function hasClaudeAiScope(scopes) {
  // Check if scopes include the inference scope
  return Boolean(scopes?.includes("user:inference"));
}

// Mapping: wv→hasClaudeAiScope, wbA→"user:inference"
```

### Scope Usage

| Scope | Used For |
|-------|----------|
| `user:inference` | Making LLM API calls |
| `user:profile` | Fetching subscription type, display name |
| `user:sessions:claude_code` | Session persistence, cross-device sync |
| `org:create_api_key` | Generating one-time API keys from OAuth |

---

## Complete Login Flow Step-by-Step

This section provides a complete walkthrough of the subscription OAuth login process, showing exactly what happens at each step with code references.

### Step 1: User Initiates Login

```javascript
// User runs: claude /login
// Or clicks "Login" in onboarding wizard

// OAuthFlow class is instantiated
let oauthFlow = new OAuthFlow();  // KRA class

// In constructor, PKCE code verifier is generated immediately
this.codeVerifier = generateCodeVerifier();  // RY2()
// Result: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk" (43 chars)
```

### Step 2: Start Local Callback Server

```javascript
// Create HTTP server for OAuth callback
this.authCodeListener = new LocalCallbackServer();  // jQ0 class

// Start listening on random available port
this.port = await this.authCodeListener.start();
// Result: port = 54321 (example)

// Server now listening at: http://localhost:54321/callback
```

### Step 3: Generate PKCE Challenge and State

```javascript
// SHA256 hash the code verifier
let codeChallenge = generateCodeChallenge(this.codeVerifier);  // TY2()
// Result: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"

// Generate random state for CSRF protection
let state = generateState();  // PY2()
// Result: "xyzABCdefGHI123456789_-0987654321abcdefg"
```

### Step 4: Build Authorization URLs

```javascript
// Parameters for URL building
let authParams = {
  codeChallenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  state: "xyzABCdefGHI123456789_-0987654321abcdefg",
  port: 54321,
  loginWithClaudeAi: true,  // Using claude.ai (subscription login)
  inferenceOnly: false      // Full scopes
};

// Build two URLs
let manualUrl = buildOAuthAuthorizeUrl({...authParams, isManual: true});
let automaticUrl = buildOAuthAuthorizeUrl({...authParams, isManual: false});
```

**Automatic URL (for browser):**
```
https://claude.ai/oauth/authorize?
  code=true&
  client_id=9d1c250a-e61b-44d9-88ed-5944d1962f5e&
  response_type=code&
  redirect_uri=http://localhost:54321/callback&
  scope=user:profile user:inference user:sessions:claude_code&
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
  code_challenge_method=S256&
  state=xyzABCdefGHI123456789_-0987654321abcdefg
```

**Manual URL (for copy-paste):**
```
https://claude.ai/oauth/authorize?
  ...
  redirect_uri=https://console.anthropic.com/oauth/code/callback&
  ...
```

### Step 5: Open Browser and Display Manual URL

```javascript
// Display manual URL in CLI (in case browser fails)
await displayManualUrl(manualUrl);
// CLI shows: "If browser doesn't open, visit: https://claude.ai/oauth/..."

// Open browser with automatic URL
await openBrowserUrl(automaticUrl);  // cZ()
// On macOS: executes "open https://claude.ai/oauth/..."
// On Linux: executes "xdg-open https://claude.ai/oauth/..."
// On Windows: executes "rundll32 url,OpenURL https://claude.ai/oauth/..."
```

### Step 6: User Authenticates in Browser

```
Browser Flow:
1. User sees Claude.ai login page
2. User enters email (e.g., user@gmail.com)
3. Claude.ai sends magic link email
4. User clicks magic link in email
5. Claude.ai shows "Authorize Claude Code?" consent screen
6. User clicks "Authorize"
7. Claude.ai redirects to: http://localhost:54321/callback?code=AUTH_CODE&state=STATE
```

### Step 7: Callback Server Receives Code

```javascript
// LocalCallbackServer receives HTTP request:
// GET /callback?code=abc123def456&state=xyzABCdefGHI...

handleRedirect(request, response) {
  let url = new URL(request.url, "http://localhost");

  // Extract code and state from query params
  let code = url.searchParams.get("code");    // "abc123def456"
  let state = url.searchParams.get("state");  // "xyzABCdefGHI..."

  // Validate state matches (CSRF protection)
  if (state !== this.expectedState) {
    response.writeHead(400);
    response.end("Invalid state parameter");
    return;
  }

  // Keep response open (will redirect later)
  this.pendingResponse = response;

  // Resolve the promise with auth code
  this.resolve(code);  // Returns "abc123def456" to caller
}
```

### Step 8: Exchange Code for Tokens

```javascript
// POST to token endpoint with PKCE verification
let tokenResponse = await exchangeCodeForTokens(
  "abc123def456",                                    // authCode
  "xyzABCdefGHI123456789_-0987654321abcdefg",       // state
  "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",   // codeVerifier (PKCE!)
  54321,                                             // port
  false                                              // isManual
);

// HTTP Request:
// POST https://console.anthropic.com/v1/oauth/token
// Content-Type: application/json
// Body: {
//   grant_type: "authorization_code",
//   code: "abc123def456",
//   redirect_uri: "http://localhost:54321/callback",
//   client_id: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
//   code_verifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
//   state: "xyzABCdefGHI123456789_-0987654321abcdefg"
// }

// Server verifies: SHA256(code_verifier) === stored_code_challenge
// If match: issues tokens
// If mismatch: rejects (attacker can't have code_verifier)

// Response:
// {
//   access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
//   refresh_token: "rt_abc123...",
//   expires_in: 31536000,  // 1 year in seconds
//   scope: "user:profile user:inference user:sessions:claude_code",
//   account: {
//     uuid: "user_01H...",
//     email_address: "user@gmail.com"
//   },
//   organization: {
//     uuid: "org_01H..."
//   }
// }
```

### Step 9: Fetch User Profile

```javascript
// GET profile to determine subscription type
let profileInfo = await fetchProfileInfo(tokenResponse.access_token);

// HTTP Request:
// GET https://api.anthropic.com/api/oauth/profile
// Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

// Response:
// {
//   account: {
//     uuid: "user_01H...",
//     email: "user@gmail.com",
//     display_name: "John Doe"
//   },
//   organization: {
//     uuid: "org_01H...",
//     organization_type: "claude_max",  // or "claude_pro", "claude_team", etc.
//     rate_limit_tier: "tier_1",
//     has_extra_usage_enabled: true
//   }
// }

// Map organization_type to subscription:
// "claude_max" → "max"
// "claude_pro" → "pro"
// "claude_enterprise" → "enterprise"
// "claude_team" → "team"
```

### Step 10: Save Account Information

```javascript
// Save account info to ~/.claude.json
saveAccountInfo({
  accountUuid: "user_01H...",
  emailAddress: "user@gmail.com",
  organizationUuid: "org_01H...",
  displayName: "John Doe",
  hasExtraUsageEnabled: true
});

// Result in ~/.claude.json:
// {
//   "oauthAccount": {
//     "accountUuid": "user_01H...",
//     "emailAddress": "user@gmail.com",
//     "organizationUuid": "org_01H...",
//     "displayName": "John Doe",
//     "hasExtraUsageEnabled": true
//   }
// }
```

### Step 11: Save OAuth Tokens

```javascript
// Save tokens to secure storage (Keychain or credentials file)
saveOAuthTokens({
  accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "rt_abc123...",
  expiresAt: Date.now() + 31536000 * 1000,  // 1 year from now
  scopes: ["user:profile", "user:inference", "user:sessions:claude_code"],
  subscriptionType: "max",
  rateLimitTier: "tier_1"
});

// Result in macOS Keychain (or ~/.claude/.credentials.json):
// {
//   "claudeAiOauth": {
//     "accessToken": "eyJ...",
//     "refreshToken": "rt_abc123...",
//     "expiresAt": 1767225600000,
//     "scopes": [...],
//     "subscriptionType": "max",
//     "rateLimitTier": "tier_1"
//   }
// }
```

### Step 12: Redirect Browser to Success Page

```javascript
// Redirect browser to success page
this.authCodeListener.handleSuccessRedirect(scopes);

// HTTP Response (to the callback request from Step 7):
// HTTP/1.1 302 Found
// Location: https://console.anthropic.com/oauth/code/success?app=claude-code

// Browser shows success page: "You're all set! You can close this tab."
```

### Step 13: Return Formatted Tokens

```javascript
// Return to caller
return {
  accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "rt_abc123...",
  expiresAt: 1767225600000,
  scopes: ["user:profile", "user:inference", "user:sessions:claude_code"],
  subscriptionType: "max",
  rateLimitTier: "tier_1"
};
```

### Step 14: Cleanup

```javascript
// Close local server
this.authCodeListener.close();

// User sees in CLI:
// "Successfully logged in as user@gmail.com (Max subscription)"
```

---

### Complete Sequence Diagram

```
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────┐
│ CLI/User │     │ OAuth     │     │ Local     │     │ claude.ai   │     │ API      │
│          │     │ Flow      │     │ Server    │     │ (Auth)      │     │ Server   │
└────┬─────┘     └─────┬─────┘     └─────┬─────┘     └──────┬──────┘     └────┬─────┘
     │                 │                 │                   │                 │
     │  /login         │                 │                   │                 │
     │────────────────>│                 │                   │                 │
     │                 │                 │                   │                 │
     │                 │ start()         │                   │                 │
     │                 │────────────────>│                   │                 │
     │                 │    port=54321   │                   │                 │
     │                 │<────────────────│                   │                 │
     │                 │                 │                   │                 │
     │                 │ Generate PKCE   │                   │                 │
     │                 │ verifier+challenge                  │                 │
     │                 │                 │                   │                 │
     │ Display URL     │                 │                   │                 │
     │<────────────────│                 │                   │                 │
     │                 │                 │                   │                 │
     │                 │ Open Browser    │                   │                 │
     │                 │─────────────────────────────────────>│                 │
     │                 │                 │                   │                 │
     │                 │                 │  User logs in     │                 │
     │                 │                 │                   │                 │
     │                 │                 │  Redirect         │                 │
     │                 │                 │<──────────────────│                 │
     │                 │                 │  ?code=X&state=Y  │                 │
     │                 │                 │                   │                 │
     │                 │ authCode        │                   │                 │
     │                 │<────────────────│                   │                 │
     │                 │                 │                   │                 │
     │                 │ POST /oauth/token (with code_verifier)                │
     │                 │─────────────────────────────────────────────────────>│
     │                 │                                        tokens        │
     │                 │<─────────────────────────────────────────────────────│
     │                 │                 │                   │                 │
     │                 │ GET /oauth/profile                                    │
     │                 │─────────────────────────────────────────────────────>│
     │                 │                                   profile            │
     │                 │<─────────────────────────────────────────────────────│
     │                 │                 │                   │                 │
     │                 │ 302 Redirect    │                   │                 │
     │                 │────────────────>│                   │                 │
     │                 │                 │                   │                 │
     │ Success!        │                 │                   │                 │
     │<────────────────│                 │                   │                 │
     │                 │                 │                   │                 │
```

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [token_refresh.md](./token_refresh.md) - Automatic token refresh mechanism
- [api_key_auth.md](./api_key_auth.md) - Alternative API key authentication
