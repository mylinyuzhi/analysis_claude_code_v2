# API Key Resolution Chain (Claude Code 2.1.76)

## Overview

When Claude Code needs to make an API request, it must resolve an API key (or OAuth token) through a well-defined priority chain. The resolution logic differs between headless/SDK mode, interactive mode, and provider-specific modes (Bedrock, Vertex). This document traces the complete resolution algorithm, explains why each source has its priority, and details the provider-specific handling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Auth section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (LLM API)

Key functions in this document:
- `resolveApiKeyAndSource` (yO) - Main key resolution function returning `{ key, source }`
- `getApiKeyFromFd` (BF6) - Reads API key from file descriptor
- `getOAuthTokenFromFd` (rs1) - Reads OAuth token from file descriptor
- `getApiKeyHelper` (JR1) - Executes apiKeyHelper command to retrieve key
- `getApiKeyHelperConfig` (_R1) - Reads apiKeyHelper setting from merged config
- `getOAuthLoginKey` (XR1) - Retrieves key from Keychain/config stored by `/login`
- `getOAuthTokenData` (a4) - Retrieves OAuth token from env var, FD, or stored credentials
- `hasApiKey` (function at Ln 105690) - Quick check if any key source is available
- `getApiKeyHelperTtl` (B95) - Gets TTL for apiKeyHelper cache
- `clearApiKeyHelperCache` (i86) - Clears memoized apiKeyHelper result
- `refreshApiKeyHelper` (el8) - Re-runs apiKeyHelper if trust is established
- `isApiKeyHelperFromProjectSettings` (al8) - Checks if apiKeyHelper comes from project settings (security check)
- `isAwsAuthRefreshFromProjectSettings` (sl8) - Checks if awsAuthRefresh comes from project settings
- `runAwsAuthRefresh` (Q95) - Executes AWS auth refresh command
- `runAwsCredentialExport` (g95) - Exports AWS credentials via configured command

---

## Resolution Priority Chain

### The Core Algorithm

```javascript
// ============================================
// resolveApiKeyAndSource - Main API key resolution chain
// Location: chunks.40.mjs:48-96 (Ln 105694)
// ============================================

// ORIGINAL (for source lookup):
function yO(A = {}) {
    if (_N1() && process.env.ANTHROPIC_API_KEY) return {
        key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY"
    };
    if (J6(!1)) {
        let Y = BF6();
        if (Y) return { key: Y, source: "ANTHROPIC_API_KEY" };
        if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN
            && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR)
            throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
        if (process.env.ANTHROPIC_API_KEY) return {
            key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY"
        };
        return { key: null, source: "none" }
    }
    if (process.env.ANTHROPIC_API_KEY
        && f6().customApiKeyResponses?.approved?.includes(cT(process.env.ANTHROPIC_API_KEY)))
        return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    let q = BF6();
    if (q) return { key: q, source: "ANTHROPIC_API_KEY" };
    if (A.skipRetrievingKeyFromApiKeyHelper) {
        if (_R1()) return { key: null, source: "apiKeyHelper" }
    } else {
        let Y = v06(q7());
        if (Y) return { key: Y, source: "apiKeyHelper" }
    }
    let K = XR1();
    if (K) return K;
    return { key: null, source: "none" }
}

// READABLE (for understanding):
function resolveApiKeyAndSource(options = {}) {
    // BRANCH 1: SDK/headless mode - env var takes absolute priority
    if (isSdkMode() && process.env.ANTHROPIC_API_KEY) {
        return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    }

    // BRANCH 2: Non-interactive mode (dead code in production - parseBoolean(false) is always false)
    if (parseBoolean(false)) {
        let fdKey = getApiKeyFromFd();
        if (fdKey) return { key: fdKey, source: "ANTHROPIC_API_KEY" };
        if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN
            && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) {
            throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
        }
        if (process.env.ANTHROPIC_API_KEY) {
            return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
        }
        return { key: null, source: "none" };
    }

    // BRANCH 3: Interactive mode (normal CLI usage)

    // Step 1: ANTHROPIC_API_KEY env var (only if user previously approved)
    if (process.env.ANTHROPIC_API_KEY
        && getConfig().customApiKeyResponses?.approved?.includes(hashKey(process.env.ANTHROPIC_API_KEY))) {
        return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    }

    // Step 2: API key from file descriptor
    let fdKey = getApiKeyFromFd();
    if (fdKey) return { key: fdKey, source: "ANTHROPIC_API_KEY" };

    // Step 3: apiKeyHelper command
    if (options.skipRetrievingKeyFromApiKeyHelper) {
        if (getApiKeyHelperConfig()) return { key: null, source: "apiKeyHelper" };
    } else {
        let helperKey = getApiKeyHelper(isWorkspaceTrusted());
        if (helperKey) return { key: helperKey, source: "apiKeyHelper" };
    }

    // Step 4: /login managed key (Keychain or config)
    let loginKey = getOAuthLoginKey();
    if (loginKey) return loginKey;

    // Step 5: No key found
    return { key: null, source: "none" };
}

// Mapping: yO->resolveApiKeyAndSource, _N1->isSdkMode, J6->parseBoolean, BF6->getApiKeyFromFd,
//   f6->getConfig, cT->hashKey, _R1->getApiKeyHelperConfig, JR1->getApiKeyHelper,
//   w4->isWorkspaceTrusted, XR1->getOAuthLoginKey
```

### Priority Order Explained

| Priority | Source | When Used | Security Check |
|----------|--------|-----------|----------------|
| 1 (highest) | `ANTHROPIC_API_KEY` env var (SDK mode) | SDK/programmatic usage | None -- SDK mode trusts the caller |
| 2 | `ANTHROPIC_API_KEY` env var (approved) | Interactive, user approved via prompt | Hash must be in `customApiKeyResponses.approved` |
| 3 | File descriptor (`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR`) | Secure key passing from parent process | FD is process-scoped, inherently secure |
| 4 | `apiKeyHelper` command | Enterprise deployments with key vaults | Workspace trust check if from project settings |
| 5 | `/login` managed key (Keychain/config) | OAuth users who ran `/login` | Stored securely in Keychain |
| 6 (lowest) | None | No key configured | Returns `{ key: null, source: "none" }` |

### Why This Priority Order

**SDK mode bypasses all checks:**
When running as an SDK (embedded in another tool), the calling process is responsible for providing credentials. The env var is the simplest and most reliable delivery mechanism.

**Env var requires user approval in interactive mode:**
This is a critical security decision. In interactive mode, a malicious `.env` file in a project directory could set `ANTHROPIC_API_KEY` to an attacker's key, causing all API calls to go to the attacker's account (leaking conversation content). The `customApiKeyResponses.approved` check ensures the user has explicitly acknowledged using this key.

**File descriptor is preferred over apiKeyHelper:**
File descriptors are inherently secure (process-local, no file on disk, no command execution). They are used by parent processes that want to securely pass keys to Claude Code without environment variable exposure.

**apiKeyHelper before /login key:**
Enterprise deployments need their custom key management (vault integration, temporary keys) to take priority over any previously cached OAuth key.

---

## API Key Helper System

### Configuration

The `apiKeyHelper` is a command string configured in settings (user, project, or local):

```json
{
    "apiKeyHelper": "vault read -field=api_key secret/anthropic"
}
```

### Security: Workspace Trust Gate

**What it does:** If `apiKeyHelper` comes from project-level settings (`.claude/settings.json`), it requires workspace trust before execution. This prevents a malicious project from configuring an arbitrary command as the key helper.

**How it works:**
1. `isApiKeyHelperFromProjectSettings` (al8) checks if the helper setting originates from project or local settings
2. If so, `isWorkspaceTrusted` (w4) must return true before the command is executed
3. If trust is not established, the helper is skipped silently

```javascript
// ============================================
// getApiKeyHelper - Executes apiKeyHelper command with caching
// Location: chunks.40.mjs:~580-613 (memoized)
// ============================================

// ORIGINAL (for source lookup):
JR1 = aI6((A) => {
    let q = _R1();
    if (!q) return null;
    if (al8()) { if (!$H(A)) return null }
    try {
        let K = Qf(q)?.toString().trim();
        if (!K) throw Error("apiKeyHelper did not return a valid value");
        return K
    } catch (K) {
        let Y = H6.red("Error getting API key from apiKeyHelper ...");
        return " "
    }
}, B95());

// READABLE (for understanding):
getApiKeyHelper = memoizeWithTtl((isWorkspaceTrusted) => {
    let helperCommand = getApiKeyHelperConfig();
    if (!helperCommand) return null;

    // Security gate: if from project settings, require trust
    if (isApiKeyHelperFromProjectSettings()) {
        if (!checkWorkspaceTrust(isWorkspaceTrusted)) return null;
    }

    try {
        let result = execSync(helperCommand)?.toString().trim();
        if (!result) throw Error("apiKeyHelper did not return a valid value");
        return result;
    } catch (error) {
        console.error(chalk.red("Error getting API key from apiKeyHelper ..."));
        return " ";  // Return space (truthy but invalid) to prevent re-execution
    }
}, getApiKeyHelperTtl());

// Mapping: JR1->getApiKeyHelper, aI6->memoizeWithTtl, _R1->getApiKeyHelperConfig,
//   al8->isApiKeyHelperFromProjectSettings, $H->checkWorkspaceTrust, B95->getApiKeyHelperTtl, Qf->execSync
```

**Key insight:** The helper result is cached with a configurable TTL via `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`. This means the external command (which might call a slow vault API) is not executed on every API request. The default TTL prevents excessive command executions while ensuring key rotation is respected.

### Return Value: Space Character

When the helper command fails, the function returns a single space `" "`. This is intentional: a space is truthy (so the `if (Y)` check in the resolution chain passes), but it will fail API authentication. This prevents the resolution chain from falling through to other sources (like OAuth) when the helper is configured but broken — forcing the user to fix their helper configuration.

---

## OAuth Token Resolution

### Token Data Retrieval

```javascript
// ============================================
// getOAuthTokenData - Retrieves current OAuth token data
// Location: chunks.40.mjs:640-665 (Ln ~106228)
// ============================================

// ORIGINAL (for source lookup):
a4 = KA(() => {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
        accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
        refreshToken: null, expiresAt: null,
        scopes: ["user:inference"], subscriptionType: null, rateLimitTier: null
    };
    let A = rs1();
    if (A) return {
        accessToken: A, refreshToken: null, expiresAt: null,
        scopes: ["user:inference"], subscriptionType: null, rateLimitTier: null
    };
    try {
        let Y = T0().read()?.claudeAiOauth;
        if (!Y?.accessToken) return null;
        return Y
    } catch (q) { return K1(q), null }
})

// READABLE (for understanding):
getOAuthTokenData = memoize(() => {
    // Priority 1: Direct token from environment variable
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
        return {
            accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
            refreshToken: null,       // No refresh possible for env var tokens
            expiresAt: null,           // Assumed non-expiring
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
    }

    // Priority 2: Token from file descriptor
    let fdToken = getOAuthTokenFromFd();
    if (fdToken) {
        return {
            accessToken: fdToken,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
    }

    // Priority 3: Stored token from /login (Keychain or plaintext)
    try {
        let storedOAuth = getCredentialStore().read()?.claudeAiOauth;
        if (!storedOAuth?.accessToken) return null;
        return storedOAuth;  // Full object with refreshToken, expiresAt, scopes, etc.
    } catch (error) {
        reportError(error);
        return null;
    }
});

// Mapping: a4->getOAuthTokenData, KA->memoize, rs1->getOAuthTokenFromFd,
//   T0->getCredentialStore, K1->reportError
```

### Token Refresh Lifecycle

```
Request starts
    │
    ├─ getOAuthTokenData() - Get current token
    │
    ├─ isOAuthTokenExpiring(token) - Check if expires within 5 minutes
    │      │
    │      └─ YES: refreshOAuthToken(j$8) called
    │                 │
    │                 ├─ POST /oauth/token with grant_type=refresh_token
    │                 ├─ Store new token in Keychain
    │                 └─ Update in-memory memoized token
    │
    └─ Make API request with current (refreshed) access token
```

**Why 5-minute window:** Network calls take ~0.1-2 seconds. A 5-minute buffer ensures the token is valid throughout the API call even if the network is slow or there's clock skew between the client and server.

---

## Bedrock and Vertex Authentication

### AWS Bedrock (SigV4)

When `CLAUDE_CODE_USE_BEDROCK=1`, the standard API key resolution is bypassed. Instead:
1. AWS credentials are resolved via the standard AWS SDK chain (`~/.aws/credentials`, env vars, EC2 instance role, etc.)
2. Optionally, `awsAuthRefresh` command in settings can be executed to refresh short-lived credentials
3. Requests are signed using AWS SigV4 signature algorithm

### Google Vertex AI

When `CLAUDE_CODE_USE_VERTEX=1`:
1. Google Application Default Credentials are used
2. `CLAUDE_CODE_VERTEX_PROJECT` and `CLAUDE_CODE_VERTEX_REGION` env vars configure the endpoint
3. Requests go to the Vertex AI API endpoint rather than `api.anthropic.com`
