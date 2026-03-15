# Authentication Architecture (Claude Code 2.1.38)

## Overview

Claude Code supports three authentication methods for accessing the Anthropic API: direct API keys, OAuth tokens (via `/login`), and external API key helpers. The authentication system also handles provider-specific authentication for Amazon Bedrock (AWS SigV4), Google Vertex AI, and Anthropic Foundry. Credentials are stored securely using macOS Keychain (preferred) with a plaintext fallback, and OAuth tokens are automatically refreshed before expiration.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Auth section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `getApiProvider` (E4) - Determines provider: firstParty, bedrock, vertex, or foundry
- `resolveApiKeyAndSource` (yO) - Main key resolution chain returning `{ key, source }`
- `getOAuthTokenData` (a4) - Retrieves current OAuth token data (access token, refresh, expiry)
- `getOAuthLoginKey` (XR1) - Retrieves API key from `/login` managed credentials
- `refreshOAuthToken` (j$8) - Refreshes expired OAuth token using refresh_token grant
- `exchangeCodeForToken` (D$8) - Exchanges OAuth authorization code for tokens
- `fetchOAuthProfile` (FF6) - Fetches user profile (subscription type, billing, rate limits)
- `fetchUserRoles` (M$8) - Fetches organization and workspace roles
- `generateApiKeyFromOAuth` (P$8) - Converts OAuth token to API key via server endpoint
- `getCredentialStore` (T0) - Returns the credential store (keychain with plaintext fallback)
- `keychainStore` (O$8) - macOS Keychain credential storage backend
- `plaintextStore` (uF6) - Plaintext file credential storage backend
- `buildOAuthAuthorizeUrl` (mF6) - Constructs OAuth authorization URL with PKCE
- `isOAuthTokenExpiring` (uQ) - Checks if token expires within 5 minutes
- `getApiKeyFromFd` (BF6) - Reads API key from a file descriptor
- `getOAuthTokenFromFd` (rs1) - Reads OAuth token from a file descriptor
- `storeOAuthAccountInfo` (QF6) - Stores OAuth account details in config
- `getApiKeyHelperConfig` (_R1) - Gets apiKeyHelper command from settings
- `runAwsAuthRefresh` (Q95) - Executes configured AWS auth refresh command
- `runAwsCredentialExport` (g95) - Exports AWS credentials for Bedrock
- `isFirstPartyDirectConnect` (OH1) - Checks if connecting to api.anthropic.com directly

---

## Architecture Diagram

```
                      Authentication Resolution
                      =========================

  +---------+     +----------+     +---------+     +-----------+
  | Env Var |     | File     |     | API Key |     | OAuth     |
  | API Key |     | Descr.   |     | Helper  |     | /login    |
  +---------+     +----------+     +---------+     +-----------+
       |               |               |                |
       v               v               v                v
  +-----------------------------------------------------+
  |        resolveApiKeyAndSource (yO)                   |
  |  Priority: env var > FD > apiKeyHelper > /login key  |
  +-----------------------------------------------------+
                        |
                        v
                +----------------+
                | API Provider   |
                | Detection (E4) |
                +----------------+
                   |    |    |
          +--------+    |    +--------+
          v             v             v
    +-----------+  +--------+  +----------+
    | Anthropic |  | AWS    |  | Google   |
    | First-    |  | Bedrock|  | Vertex   |
    | Party     |  | SigV4  |  | AI       |
    +-----------+  +--------+  +----------+
          |             |             |
          v             v             v
    +--------------------------------------------+
    |         LLM API Request Layer              |
    +--------------------------------------------+


  Credential Storage
  ==================

  macOS:
    Keychain (primary) -> Plaintext file (fallback)

  Linux:
    Plaintext file (~/.config/claude/.credentials.json)
```

---

## Provider Detection

### API Provider Resolution

```javascript
// ============================================
// getApiProvider - Determines which API provider to use
// Location: chunks.16.mjs:447-449 (Ln 49998)
// ============================================

// ORIGINAL (for source lookup):
function E4() {
    return J6(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock"
         : J6(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex"
         : J6(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry"
         : "firstParty"
}

// READABLE (for understanding):
function getApiProvider() {
    if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) return "bedrock";
    if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) return "vertex";
    if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) return "foundry";
    return "firstParty";
}

// Mapping: E4->getApiProvider, J6->parseBoolean
```

**What it does:** Determines the API provider based on environment variables. The provider affects which authentication mechanism is used, which API endpoint is called, and which model IDs are available.

**How it works:**
1. Checks `CLAUDE_CODE_USE_BEDROCK` first -- if truthy, uses AWS Bedrock
2. Then `CLAUDE_CODE_USE_VERTEX` -- if truthy, uses Google Vertex AI
3. Then `CLAUDE_CODE_USE_FOUNDRY` -- if truthy, uses Anthropic Foundry
4. Falls back to `"firstParty"` -- direct Anthropic API

**Why this approach:**
- Environment variable-based provider selection is simple and works everywhere (CI, Docker, shell scripts)
- The priority order (bedrock > vertex > foundry > firstParty) means only one can be active
- Provider-specific authentication (AWS SigV4, Google OAuth) is handled downstream

---

## OAuth Flow

### OAuth Authorization URL Construction

```javascript
// ============================================
// buildOAuthAuthorizeUrl - Constructs OAuth PKCE authorization URL
// Location: chunks.16.mjs:1265-1280 (Ln 50762)
// ============================================

// ORIGINAL (for source lookup):
function mF6({ codeChallenge: A, state: q, port: K, isManual: Y, loginWithClaudeAi: z, inferenceOnly: w, orgUUID: H }) {
    let $ = z ? P4().CLAUDE_AI_AUTHORIZE_URL : P4().CONSOLE_AUTHORIZE_URL,
        O = new URL($);
    O.searchParams.append("code", "true");
    O.searchParams.append("client_id", P4().CLIENT_ID);
    O.searchParams.append("response_type", "code");
    O.searchParams.append("redirect_uri", Y ? P4().MANUAL_REDIRECT_URL : `http://localhost:${K}/callback`);
    let _ = w ? [Fx] : H48;
    O.searchParams.append("scope", _.join(" "));
    O.searchParams.append("code_challenge", A);
    O.searchParams.append("code_challenge_method", "S256");
    O.searchParams.append("state", q);
    if (H) O.searchParams.append("orgUUID", H);
    return O.toString()
}

// READABLE (for understanding):
function buildOAuthAuthorizeUrl({
    codeChallenge, state, port, isManual, loginWithClaudeAi, inferenceOnly, orgUUID
}) {
    // Choose authorize endpoint: claude.ai or console.anthropic.com
    let baseUrl = loginWithClaudeAi
        ? constants.CLAUDE_AI_AUTHORIZE_URL
        : constants.CONSOLE_AUTHORIZE_URL;

    let url = new URL(baseUrl);
    url.searchParams.append("code", "true");
    url.searchParams.append("client_id", constants.CLIENT_ID);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", isManual
        ? constants.MANUAL_REDIRECT_URL
        : `http://localhost:${port}/callback`);

    // Scope: inference-only (user:inference) or full scopes
    let scopes = inferenceOnly ? [INFERENCE_SCOPE] : FULL_SCOPES;
    url.searchParams.append("scope", scopes.join(" "));

    // PKCE parameters
    url.searchParams.append("code_challenge", codeChallenge);
    url.searchParams.append("code_challenge_method", "S256");
    url.searchParams.append("state", state);

    // Optional: pre-select organization
    if (orgUUID) url.searchParams.append("orgUUID", orgUUID);

    return url.toString();
}

// Mapping: mF6->buildOAuthAuthorizeUrl, A->codeChallenge, q->state, K->port, Y->isManual, z->loginWithClaudeAi, w->inferenceOnly, H->orgUUID, P4->constants, Fx->INFERENCE_SCOPE, H48->FULL_SCOPES
```

**What it does:** Constructs the OAuth authorization URL that the user's browser will be directed to. Uses PKCE (Proof Key for Code Exchange) with S256 challenge method for security.

**Key insight:** There are two OAuth flows:
1. **Automatic** (`isManual: false`): A local HTTP server on `localhost:<port>/callback` receives the auth code
2. **Manual** (`isManual: true`): User copies the auth code from the browser and pastes it into the CLI

### Token Exchange

```javascript
// ============================================
// exchangeCodeForToken - Exchanges OAuth auth code for access/refresh tokens
// Location: chunks.16.mjs:1282-1299 (Ln 50778)
// ============================================

// ORIGINAL (for source lookup):
async function D$8(A, q, K, Y, z = !1, w) {
    let H = {
        grant_type: "authorization_code", code: A,
        redirect_uri: z ? P4().MANUAL_REDIRECT_URL : `http://localhost:${Y}/callback`,
        client_id: P4().CLIENT_ID, code_verifier: K, state: q
    };
    if (w !== void 0) H.expires_in = w;
    let $ = await sA.post(P4().TOKEN_URL, H, { headers: { "Content-Type": "application/json" } });
    if ($.status !== 200) throw Error($.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${$.status}): ${$.statusText}`);
    return c("tengu_oauth_token_exchange_success", {}), $.data
}

// READABLE (for understanding):
async function exchangeCodeForToken(code, state, codeVerifier, port, isManual = false, expiresIn) {
    let body = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: isManual ? constants.MANUAL_REDIRECT_URL : `http://localhost:${port}/callback`,
        client_id: constants.CLIENT_ID,
        code_verifier: codeVerifier,   // PKCE verifier
        state: state
    };
    if (expiresIn !== undefined) body.expires_in = expiresIn;

    let response = await axios.post(constants.TOKEN_URL, body, {
        headers: { "Content-Type": "application/json" }
    });

    if (response.status !== 200) {
        throw Error(response.status === 401
            ? "Authentication failed: Invalid authorization code"
            : `Token exchange failed (${response.status}): ${response.statusText}`);
    }

    logEvent("tengu_oauth_token_exchange_success", {});
    return response.data;  // { access_token, refresh_token, expires_in, scope }
}

// Mapping: D$8->exchangeCodeForToken, A->code, q->state, K->codeVerifier, Y->port, z->isManual, w->expiresIn
```

### Token Refresh

```javascript
// ============================================
// refreshOAuthToken - Refreshes expired OAuth access token
// Location: chunks.16.mjs:1301-1353 (Ln 50796)
// ============================================

// ORIGINAL (for source lookup):
async function j$8(A) {
    let q = { grant_type: "refresh_token", refresh_token: A, client_id: P4().CLIENT_ID, scope: QS6.join(" ") };
    try {
        let K = await sA.post(P4().TOKEN_URL, q, { headers: { "Content-Type": "application/json" } });
        if (K.status !== 200) throw Error(`Token refresh failed: ${K.statusText}`);
        let Y = K.data,
            { access_token: z, refresh_token: w = A, expires_in: H } = Y,
            $ = Date.now() + H * 1000,
            O = as1(Y.scope);
        c("tengu_oauth_token_refresh_success", {});
        let _ = await FF6(z);
        // Update profile info in config if changed
        if (f6().oauthAccount) {
            let X = {};
            if (_.displayName !== void 0) X.displayName = _.displayName;
            // ... merge other profile fields ...
            if (Object.keys(X).length > 0) jA((D) => ({ ...D, oauthAccount: { ...D.oauthAccount, ...X } }))
        }
        return { accessToken: z, refreshToken: w, expiresAt: $, scopes: O,
                 subscriptionType: _.subscriptionType, rateLimitTier: _.rateLimitTier }
    } catch (K) {
        throw c("tengu_oauth_token_refresh_failure", { error: K.message }), K
    }
}

// READABLE (for understanding):
async function refreshOAuthToken(refreshToken) {
    let body = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: constants.CLIENT_ID,
        scope: REFRESH_SCOPES.join(" ")
    };

    try {
        let response = await axios.post(constants.TOKEN_URL, body, {
            headers: { "Content-Type": "application/json" }
        });
        if (response.status !== 200) throw Error(`Token refresh failed: ${response.statusText}`);

        let data = response.data;
        let { access_token: accessToken, refresh_token: newRefreshToken = refreshToken, expires_in: expiresIn } = data;
        let expiresAt = Date.now() + expiresIn * 1000;
        let scopes = parseScopes(data.scope);

        logEvent("tengu_oauth_token_refresh_success", {});

        // Fetch updated profile info with new token
        let profile = await fetchOAuthProfile(accessToken);

        // Update stored profile if fields changed
        if (getConfig().oauthAccount) {
            let updates = {};
            if (profile.displayName !== undefined) updates.displayName = profile.displayName;
            if (typeof profile.hasExtraUsageEnabled === "boolean") updates.hasExtraUsageEnabled = profile.hasExtraUsageEnabled;
            if (profile.billingType !== null) updates.billingType = profile.billingType;
            // ... more fields ...
            if (Object.keys(updates).length > 0) {
                updateConfig((config) => ({
                    ...config,
                    oauthAccount: { ...config.oauthAccount, ...updates }
                }));
            }
        }

        return {
            accessToken, refreshToken: newRefreshToken, expiresAt,
            scopes, subscriptionType: profile.subscriptionType, rateLimitTier: profile.rateLimitTier
        };
    } catch (error) {
        throw logEvent("tengu_oauth_token_refresh_failure", { error: error.message }), error;
    }
}

// Mapping: j$8->refreshOAuthToken, A->refreshToken, sA->axios, P4->constants, QS6->REFRESH_SCOPES, FF6->fetchOAuthProfile, f6->getConfig, jA->updateConfig
```

**What it does:** Refreshes an expired OAuth access token using the refresh_token grant type.

**How it works:**
1. POSTs to the token endpoint with `grant_type: "refresh_token"`
2. Receives new access token (and optionally a rotated refresh token)
3. Calculates absolute expiry time (`Date.now() + expires_in * 1000`)
4. Fetches updated user profile with the new access token
5. Updates locally stored profile information if anything changed (display name, billing, etc.)
6. Returns the full token data for the caller to store

**Why this approach:**
- Refresh tokens are long-lived, access tokens are short-lived (security best practice)
- Profile fetching on every refresh ensures locally cached data stays current
- The refresh token itself may be rotated (new one returned), supporting token rotation policies

**Key insight:** The expiry check in `isOAuthTokenExpiring` (uQ) uses a 5-minute buffer (`300000ms`). This means tokens are refreshed 5 minutes before they actually expire, preventing mid-request expiration. The formula: `Date.now() + 300000 >= expiresAt`.

---

## Organization and Workspace Roles

### Subscription Types

The OAuth profile fetch returns the organization type which maps to subscription types:

| Organization Type | Subscription Type |
|------------------|-------------------|
| `claude_max` | `"max"` |
| `claude_pro` | `"pro"` |
| `claude_enterprise` | `"enterprise"` |
| `claude_team` | `"team"` |
| (other) | `null` |

### Role Storage

After OAuth login, roles are fetched and stored in the config:

```javascript
// ============================================
// fetchUserRoles - Fetches and stores organization/workspace roles
// Location: chunks.16.mjs:1355-1375 (Ln 50849)
// ============================================

// ORIGINAL (for source lookup):
async function M$8(A) {
    let q = await sA.get(P4().ROLES_URL, { headers: { Authorization: `Bearer ${A}` } });
    if (q.status !== 200) throw Error(`Failed to fetch user roles: ${q.statusText}`);
    let K = q.data;
    if (!f6().oauthAccount) throw Error("OAuth account information not found in config");
    jA((z) => ({
        ...z,
        oauthAccount: z.oauthAccount ? {
            ...z.oauthAccount,
            organizationRole: K.organization_role,
            workspaceRole: K.workspace_role,
            organizationName: K.organization_name
        } : z.oauthAccount
    }))
}

// READABLE (for understanding):
async function fetchUserRoles(accessToken) {
    let response = await axios.get(constants.ROLES_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (response.status !== 200) throw Error(`Failed to fetch user roles: ${response.statusText}`);

    let roleData = response.data;
    if (!getConfig().oauthAccount) throw Error("OAuth account information not found in config");

    updateConfig((config) => ({
        ...config,
        oauthAccount: config.oauthAccount ? {
            ...config.oauthAccount,
            organizationRole: roleData.organization_role,   // e.g., "admin", "member"
            workspaceRole: roleData.workspace_role,          // e.g., "owner", "editor"
            organizationName: roleData.organization_name     // Human-readable org name
        } : config.oauthAccount
    }));
}

// Mapping: M$8->fetchUserRoles, A->accessToken, P4->constants, f6->getConfig, jA->updateConfig
```

---

## Credential Storage

### macOS Keychain Backend

```javascript
// ============================================
// keychainStore - macOS Keychain credential storage
// Location: chunks.16.mjs:986-1075 (Ln 50473)
// ============================================

// ORIGINAL (for source lookup):
O$8 = {
    name: "keychain",
    read() {
        if (WC.valid) return WC.data;  // Cache hit
        try {
            let A = xQ("-credentials"), q = XH1();
            let K = Qf(`security find-generic-password -a "${q}" -w -s "${A}"`);
            if (K) { let Y = _A(K); return WC = { data: Y, valid: !0 }, Y }
        } catch (A) { return WC = { data: null, valid: !0 }, null }
        return WC = { data: null, valid: !0 }, null
    },
    update(A) {
        Ri();  // Invalidate cache
        try {
            let q = xQ("-credentials"), K = XH1();
            let Y = Q1(A), z = Buffer.from(Y, "utf-8").toString("hex");
            let w = `add-generic-password -U -a "${K}" -s "${q}" -X "${z}"\n`;
            if (Aw1("security", ["-i"], { input: w, stdio: [...], reject: !1 }).exitCode !== 0) return { success: !1 };
            return WC = { data: A, valid: !0 }, { success: !0 }
        } catch (q) { return { success: !1 } }
    },
    delete() {
        Ri();
        try {
            let A = xQ("-credentials"), q = XH1();
            return Qf(`security delete-generic-password -a "${q}" -s "${A}"`), !0
        } catch (A) { return !1 }
    }
}

// READABLE (for understanding):
keychainStore = {
    name: "keychain",
    read() {
        if (credentialCache.valid) return credentialCache.data;
        try {
            let serviceName = getOAuthServiceName("-credentials");
            let accountName = getCurrentUsername();
            // macOS security command to read from Keychain
            let rawValue = execSync(`security find-generic-password -a "${accountName}" -w -s "${serviceName}"`);
            if (rawValue) {
                let parsed = JSON.parse(rawValue);
                credentialCache = { data: parsed, valid: true };
                return parsed;
            }
        } catch (error) {
            credentialCache = { data: null, valid: true };
            return null;
        }
    },
    update(data) {
        invalidateCache();
        try {
            let serviceName = getOAuthServiceName("-credentials");
            let accountName = getCurrentUsername();
            let jsonStr = JSON.stringify(data);
            let hexEncoded = Buffer.from(jsonStr, "utf-8").toString("hex");
            // -U flag: update existing or create new; -X: hex-encoded value
            let cmd = `add-generic-password -U -a "${accountName}" -s "${serviceName}" -X "${hexEncoded}"`;
            execFileSync("security", ["-i"], { input: cmd });
            credentialCache = { data, valid: true };
            return { success: true };
        } catch { return { success: false }; }
    },
    delete() { /* security delete-generic-password ... */ }
}

// Mapping: O$8->keychainStore, WC->credentialCache, Ri->invalidateCache, xQ->getOAuthServiceName, XH1->getCurrentUsername
```

**What it does:** Stores OAuth credentials in the macOS Keychain, which provides OS-level encryption and access control.

**Why this approach:**
- Keychain is the standard secure credential store on macOS
- Credentials survive application updates and reinstalls
- Access is tied to the user's login session
- Hex encoding of the JSON prevents issues with special characters in the Keychain

**Key insight:** The service name includes an OAuth file suffix and a hash of the config directory path. This means credentials are scoped to the specific Claude Code installation, preventing conflicts when multiple versions or configurations coexist.

### Plaintext Fallback

On Linux (and macOS when Keychain is unavailable), credentials fall back to a plaintext JSON file at `~/.config/claude/.credentials.json` with restrictive file permissions (mode 0600).

### Store Selection

```javascript
// ============================================
// getCredentialStore - Returns platform-appropriate credential store
// Location: chunks.16.mjs:1147-1150 (Ln 50649)
// ============================================

// ORIGINAL (for source lookup):
function T0() {
    if (process.platform === "darwin") return $$8(O$8, uF6);
    return uF6
}

// READABLE (for understanding):
function getCredentialStore() {
    if (process.platform === "darwin") {
        return createStorageWithFallback(keychainStore, plaintextStore);
    }
    return plaintextStore;  // Linux: plaintext only
}

// Mapping: T0->getCredentialStore, $$8->createStorageWithFallback, O$8->keychainStore, uF6->plaintextStore
```

The `createStorageWithFallback` ($$8) creates a composite store that tries the primary (Keychain) first, and falls back to plaintext if Keychain operations fail. On successful migration to Keychain, it deletes the plaintext copy.
