# API Key Resolution Chain (Claude Code 2.1.38)

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
        let Y = JR1(w4());
        if (Y) return { key: Y, source: "apiKeyHelper" }
    }
    let K = XR1();
    if (K) return K;
    return { key: null, source: "none" }
}

// READABLE (for understanding):
function resolveApiKeyAndSource(options = {}) {
    // ===== BRANCH 1: SDK/headless mode =====
    // In SDK mode, ANTHROPIC_API_KEY env var takes absolute priority
    if (isSdkMode() && process.env.ANTHROPIC_API_KEY) {
        return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    }

    // ===== BRANCH 2: Non-interactive/headless mode =====
    // (parseBoolean(false) is always false, so this branch is dead code in production)
    // When headless, try: FD key > env var > throw error
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

    // ===== BRANCH 3: Interactive mode (normal CLI usage) =====

    // Step 1: Check ANTHROPIC_API_KEY env var (only if user approved this key)
    if (process.env.ANTHROPIC_API_KEY
        && getConfig().customApiKeyResponses?.approved?.includes(hashKey(process.env.ANTHROPIC_API_KEY))) {
        return { key: process.env.ANTHROPIC_API_KEY, source: "ANTHROPIC_API_KEY" };
    }

    // Step 2: Check API key from file descriptor
    let fdKey = getApiKeyFromFd();
    if (fdKey) return { key: fdKey, source: "ANTHROPIC_API_KEY" };

    // Step 3: Check apiKeyHelper (external command)
    if (options.skipRetrievingKeyFromApiKeyHelper) {
        // Just check if helper is configured (don't execute it)
        if (getApiKeyHelperConfig()) return { key: null, source: "apiKeyHelper" };
    } else {
        // Execute the helper command
        let helperKey = getApiKeyHelper(isWorkspaceTrusted());
        if (helperKey) return { key: helperKey, source: "apiKeyHelper" };
    }

    // Step 4: Check /login managed key (Keychain or config)
    let loginKey = getOAuthLoginKey();
    if (loginKey) return loginKey;  // { key, source: "/login managed key" }

    // Step 5: No key found
    return { key: null, source: "none" };
}

// Mapping: yO->resolveApiKeyAndSource, A->options, _N1->isSdkMode, J6->parseBoolean, BF6->getApiKeyFromFd, f6->getConfig, cT->hashKey, _R1->getApiKeyHelperConfig, JR1->getApiKeyHelper, w4->isWorkspaceTrusted, XR1->getOAuthLoginKey
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
// Location: chunks.40.mjs:~580-613 (partial, memoized)
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
        // ... error handling ...
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
}, getApiKeyHelperTtl());  // Cache for TTL (default from CLAUDE_CODE_API_KEY_HELPER_TTL_MS)

// Mapping: JR1->getApiKeyHelper, aI6->memoizeWithTtl, _R1->getApiKeyHelperConfig, al8->isApiKeyHelperFromProjectSettings, $H->checkWorkspaceTrust, B95->getApiKeyHelperTtl, Qf->execSync
```

**Key insight:** The helper result is cached with a configurable TTL via `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`. This means the external command (which might call a slow vault API) is not executed on every API request. The default TTL (`u95`) prevents excessive command executions while ensuring key rotation is respected.

### Return Value: Space Character

When the helper command fails, the function returns a single space `" "`. This is intentional: a space is truthy (so the `if (Y)` check in the resolution chain passes), but it will fail API authentication. This prevents the resolution chain from falling through to other sources (like OAuth) when the helper is configured but broken -- forcing the user to fix their helper configuration.

---

## OAuth Token Resolution

### Token Data Retrieval

Separate from the API key resolution, OAuth tokens are resolved through `getOAuthTokenData` (a4):

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
            refreshToken: null,      // No refresh possible for env var tokens
            expiresAt: null,          // Assumed non-expiring
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

// Mapping: a4->getOAuthTokenData, KA->memoize, rs1->getOAuthTokenFromFd, T0->getCredentialStore
```

**Key insight:** The `CLAUDE_CODE_OAUTH_TOKEN` env var path sets `refreshToken: null` and `expiresAt: null`. This means tokens provided via env var cannot be refreshed and are assumed to be valid for the session's lifetime. This is appropriate for CI/CD scenarios where tokens are short-lived and injected fresh each time.

---

## File Descriptor Key Passing

### API Key from FD

```javascript
// ============================================
// getApiKeyFromFd - Reads API key from file descriptor
// Location: chunks.16.mjs:1183-1207 (Ln 50684)
// ============================================

// ORIGINAL (for source lookup):
function BF6() {
    let A = QL6();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
    if (!q) return H61(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return h(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`), H61(null), null;
    try {
        let Y = b1(),
            z = process.platform === "darwin" || process.platform === "freebsd"
                ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            w = Y.readFileSync(z, { encoding: "utf8" }).trim();
        if (!w) return h("File descriptor contained empty API key"), H61(null), null;
        return h(`Successfully read API key from file descriptor ${K}`), H61(w), w
    } catch (Y) {
        return h(`Failed to read API key from file descriptor ${K}: ${Y instanceof Error?Y.message:String(Y)}`), H61(null), null
    }
}

// READABLE (for understanding):
function getApiKeyFromFd() {
    // Return cached value if already read
    let cached = getCachedApiKeyFromFd();
    if (cached !== undefined) return cached;

    let fdEnvVar = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
    if (!fdEnvVar) {
        setCachedApiKeyFromFd(null);
        return null;
    }

    let fd = parseInt(fdEnvVar, 10);
    if (Number.isNaN(fd)) {
        log(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${fdEnvVar}`);
        setCachedApiKeyFromFd(null);
        return null;
    }

    try {
        let fs = getFs();
        // Platform-specific path to read from file descriptor:
        //   macOS/FreeBSD: /dev/fd/<n>
        //   Linux: /proc/self/fd/<n>
        let fdPath = (process.platform === "darwin" || process.platform === "freebsd")
            ? `/dev/fd/${fd}`
            : `/proc/self/fd/${fd}`;

        let key = fs.readFileSync(fdPath, { encoding: "utf8" }).trim();
        if (!key) {
            log("File descriptor contained empty API key");
            setCachedApiKeyFromFd(null);
            return null;
        }

        log(`Successfully read API key from file descriptor ${fd}`);
        setCachedApiKeyFromFd(key);
        return key;
    } catch (error) {
        log(`Failed to read API key from file descriptor ${fd}: ${error.message}`);
        setCachedApiKeyFromFd(null);
        return null;
    }
}

// Mapping: BF6->getApiKeyFromFd, QL6->getCachedApiKeyFromFd, H61->setCachedApiKeyFromFd
```

**What it does:** Reads an API key from a file descriptor number provided via the `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` environment variable.

**Why this approach:**
- File descriptors are process-local and cannot be read by other processes
- The key never appears in the process environment (which can be read via `/proc/<pid>/environ`)
- The key never exists as a file on disk
- This is the most secure way for a parent process to pass a secret to a child process

**Key insight:** The platform-specific paths (`/dev/fd/N` vs `/proc/self/fd/N`) are necessary because macOS and Linux handle file descriptor filesystem paths differently. Both resolve to the same kernel file descriptor, but through different filesystem abstractions.

---

## Provider-Specific Authentication

### AWS Bedrock

When `CLAUDE_CODE_USE_BEDROCK` is set, the key resolution still runs, but the resulting key is used differently. Bedrock uses AWS SigV4 signing, which requires AWS credentials (access key, secret key, session token). The `awsAuthRefresh` and `awsCredentialExport` settings allow custom authentication flows:

```javascript
// ============================================
// runAwsAuthRefresh - Executes configured AWS auth refresh command
// Location: chunks.40.mjs:175-198 (Ln 105820)
// ============================================

// ORIGINAL (for source lookup):
function Q95(A) {
    h("Running AWS auth refresh command");
    let q = lT.getInstance();
    return q.startAuthentication(), new Promise((K) => {
        let Y = b95(A);
        Y.stdout.on("data", (z) => { /* log output */ });
        Y.stderr.on("data", (z) => { /* log errors */ });
        Y.on("close", (z) => {
            if (z === 0) h("AWS auth refresh completed successfully"), q.endAuthentication(!0), K(!0);
            else console.error(chalk.red("Error running awsAuthRefresh ...")), q.endAuthentication(!1), K(!1)
        })
    })
}

// READABLE (for understanding):
function runAwsAuthRefresh(command) {
    log("Running AWS auth refresh command");
    let authTracker = AuthenticationTracker.getInstance();
    authTracker.startAuthentication();

    return new Promise((resolve) => {
        let childProcess = spawnCommand(command);
        childProcess.stdout.on("data", (data) => {
            let output = data.toString().trim();
            if (output) authTracker.addOutput(output);
        });
        childProcess.stderr.on("data", (data) => {
            let error = data.toString().trim();
            if (error) authTracker.setError(error);
        });
        childProcess.on("close", (exitCode) => {
            if (exitCode === 0) {
                log("AWS auth refresh completed successfully");
                authTracker.endAuthentication(true);
                resolve(true);
            } else {
                console.error(chalk.red("Error running awsAuthRefresh ..."));
                authTracker.endAuthentication(false);
                resolve(false);
            }
        });
    });
}

// Mapping: Q95->runAwsAuthRefresh, A->command, lT->AuthenticationTracker, b95->spawnCommand
```

**What it does:** Executes a user-configured command (like `aws sso login` or a custom script) to refresh AWS credentials before making Bedrock API calls.

**How it works:**
1. First tries to call `aws sts get-caller-identity` to check if credentials are already valid
2. If that fails (credentials expired), runs the configured `awsAuthRefresh` command
3. The command's output is streamed to an `AuthenticationTracker` for UI display
4. After refresh, the `awsCredentialExport` command (if configured) can export credentials to environment variables

**Security check:** Both `awsAuthRefresh` and `awsCredentialExport` have the same project settings security gate as `apiKeyHelper` -- they require workspace trust if configured in project-level settings.

### Google Vertex AI

When `CLAUDE_CODE_USE_VERTEX` is set, authentication uses Google Cloud's default credential mechanisms (application default credentials, service account keys, etc.). The Vertex integration uses Google's standard SDK authentication rather than custom key resolution.

### Anthropic Foundry

When `CLAUDE_CODE_USE_FOUNDRY` is set, authentication uses the standard API key mechanism but may target a different endpoint. Foundry supports all the same model features as first-party but may have different model availability.

---

## Summary: Complete Resolution Flow

```
resolveApiKeyAndSource()
  |
  +-- SDK mode? --> ANTHROPIC_API_KEY env var (direct, no checks)
  |
  +-- Interactive mode:
       |
       +-- ANTHROPIC_API_KEY env var (if user-approved hash in config)
       |
       +-- CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR (file descriptor)
       |
       +-- apiKeyHelper command (if configured, with trust gate)
       |
       +-- /login managed key:
       |     +-- macOS Keychain (primary)
       |     +-- ~/.config/claude/.credentials.json (fallback)
       |
       +-- null (no key found)

getOAuthTokenData()  [separate path for OAuth]
  |
  +-- CLAUDE_CODE_OAUTH_TOKEN env var
  |
  +-- CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR
  |
  +-- Stored claudeAiOauth in credential store
  |
  +-- null (no token)
```

The LLM API layer then decides whether to use the API key (from resolveApiKeyAndSource) or the OAuth token (from getOAuthTokenData) based on which is available and the provider type.
