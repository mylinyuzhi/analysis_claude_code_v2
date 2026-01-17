# Token Refresh Mechanism (Claude Code 2.1.7)

## Table of Contents

1. [Refresh Strategy Overview](#refresh-strategy-overview)
2. [Token Expiration Check](#token-expiration-check)
3. [File-Based Locking](#file-based-locking)
4. [Refresh Token API Call](#refresh-token-api-call)
5. [Race Condition Handling](#race-condition-handling)
6. [Error Recovery](#error-recovery)
7. [Integration Points](#integration-points)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `xR` (refreshOAuthTokenIfNeeded) - Main refresh orchestrator
- `yg` (isTokenExpiringSoon) - Expiration check with 5-min buffer
- `rT1` (refreshAccessToken) - Actual token refresh API call
- `g4` (getClaudeAiOAuth) - Memoized token retrieval
- `vi` (clearOAuthCache) - Clear memoization cache

---

## Refresh Strategy Overview

Claude Code 2.1.7 implements automatic OAuth token refresh with:
- **5-minute buffer**: Refresh before actual expiration
- **File-based locking**: Prevent multiple processes from refreshing simultaneously
- **Double-checked locking**: Verify token still needs refresh after acquiring lock
- **Retry with jitter**: Handle lock contention gracefully

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Token Refresh Flow (2.1.7)                              │
└─────────────────────────────────────────────────────────────────────────────┘

Token Access Request (e.g., API call via createApiClient)
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. Pre-Lock Check: Is Token Expiring Soon?                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  if (currentTime + 5_MINUTES >= expiresAt)                             │ │
│  │      → YES: Token expiring within 5 minutes                            │ │
│  │      → NO:  Token valid, return immediately                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Token expiring
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. Clear Cache & Re-verify (Cheap Pre-Lock Check)                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  g4.cache.clear()  // Clear memoization cache                          │ │
│  │  vi()              // Clear OAuth cache function                        │ │
│  │  Re-read token from storage                                            │ │
│  │  If no longer expiring → Another process just refreshed                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Still needs refresh
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. Acquire File Lock                                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Lock target: ~/.claude/ directory                                     │ │
│  │  Using: proper-lockfile library                                        │ │
│  │                                                                        │ │
│  │  On ELOCKED error:                                                     │ │
│  │    - Wait 1-2 seconds (random jitter)                                  │ │
│  │    - Retry up to 5 times                                               │ │
│  │    - If max retries reached → Abort refresh, use current token         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Lock acquired
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. Post-Lock Verification (Race Condition Guard)                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  g4.cache.clear()  // Clear cache again                                │ │
│  │  vi()              // Ensure fresh read                                │ │
│  │  Re-read token from storage                                            │ │
│  │                                                                        │ │
│  │  if (!refreshToken || !isExpiringSoon(expiresAt))                      │ │
│  │      → Another process refreshed while we waited                       │ │
│  │      → Release lock, return false                                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ Still needs refresh
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. Call Refresh Token API                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  POST https://platform.claude.com/v1/oauth/token  (NEW in 2.1.7)        │ │
│  │  {                                                                     │ │
│  │    grant_type: "refresh_token",                                        │ │
│  │    refresh_token: current_refresh_token,                               │ │
│  │    client_id: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",                   │ │
│  │    scope: "user:profile user:inference user:sessions:claude_code"      │ │
│  │  }                                                                     │ │
│  │                                                                        │ │
│  │  Response:                                                             │ │
│  │    - new access_token                                                  │ │
│  │    - new refresh_token (optional rotation)                             │ │
│  │    - new expires_in                                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. Save New Tokens & Cleanup                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  XXA(newTokens)       // Save to Keychain/settings                     │ │
│  │  g4.cache.clear()     // Clear memoization cache                       │ │
│  │  vi()                 // Clear OAuth cache                             │ │
│  │  Release file lock                                                     │ │
│  │  return true                                                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Token Expiration Check

### Algorithm: `yg()` (isTokenExpiringSoon)

```javascript
// ============================================
// isTokenExpiringSoon - Check if token expires within 5 minutes
// Location: chunks.48.mjs (expiration check)
// ============================================

// ORIGINAL (for source lookup):
function yg(A) {
  if (A === null) return !1;
  let Q = 300000;  // 5 minutes in milliseconds
  return Date.now() + Q >= A
}

// READABLE (for understanding):
function isTokenExpiringSoon(expiresAt) {
  if (expiresAt === null) return false;

  const FIVE_MINUTES_MS = 300000;  // 5 * 60 * 1000
  return Date.now() + FIVE_MINUTES_MS >= expiresAt;
}

// Mapping: yg→isTokenExpiringSoon
```

### Why 5-Minute Buffer?

**Design Rationale:**

1. **Clock Skew Tolerance**: Client and server clocks may differ by seconds/minutes
2. **Request Duration**: Long-running API calls need valid tokens throughout
3. **Network Latency**: Refresh call itself takes time
4. **Safety Margin**: Prevents edge cases where token expires mid-request

```
Timeline Example:
─────────────────────────────────────────────────────────────────────
Token expires at:     12:00:00
5-min buffer starts:  11:55:00  ← Refresh triggered here
                                   (Token still has 5 min validity)
API call starts:      11:55:30
Refresh completes:    11:55:35
API call continues:   11:55:35 - 11:58:00
                                   (Uses old token until response,
                                    then uses new token)
─────────────────────────────────────────────────────────────────────
```

---

## File-Based Locking

### Algorithm: `xR()` (refreshOAuthTokenIfNeeded)

This is the core refresh orchestrator with file-based locking:

```javascript
// ============================================
// refreshOAuthTokenIfNeeded - Main refresh function with locking
// Location: chunks.48.mjs:2056-2123
// ============================================

// ORIGINAL (for source lookup):
async function xR(A = 0, Q) {
  let B = g4();
  if (!B?.refreshToken || !yg(B.expiresAt)) return !1;
  if (!xg(B.scopes)) return !1;

  // Pre-lock cache clear and re-check
  if (g4.cache?.clear?.(), vi(), B = g4(), !B?.refreshToken || !yg(B.expiresAt)) {
    return l("tengu_oauth_token_refresh_race_resolved", {}), !1
  }

  // Ensure lock directory exists
  let G = YK();
  kA().mkdirSync(G, { recursive: !0 });

  let Z, Y, J;
  try {
    // Acquire file lock
    l("tengu_oauth_token_refresh_lock_acquiring", {}),
    J = await Q_A.lock(G),
    l("tengu_oauth_token_refresh_lock_acquired", {})
  } catch (X) {
    if (X.code === "ELOCKED") {
      // Retry with backoff
      if (A < 5) return l("tengu_oauth_token_refresh_lock_retry", {
        retryCount: A + 1
      }), await new Promise((I) => setTimeout(I, 1000 + Math.random() * 1000)), xR(A + 1, Q);

      return l("tengu_oauth_token_refresh_lock_retry_limit_reached", { maxRetries: 5 }), !1
    }
    return e(X), l("tengu_oauth_token_refresh_lock_error", { error: X.message }), !1
  }

  try {
    // Post-lock verification
    if (g4.cache?.clear?.(), vi(), G = g4(), !G?.refreshToken || !yg(G.expiresAt)) {
      return l("tengu_oauth_token_refresh_race_resolved", {}), !1;
    }

    l("tengu_oauth_token_refresh_starting", {});
    let X = await rT1(G.refreshToken);
    return XXA(X), g4.cache?.clear?.(), vi(), !0
  } catch (X) {
    e(X instanceof Error ? X : Error(String(X))), g4.cache?.clear?.(), vi();
    // Check if another process succeeded during our failure
    let I = g4();
    if (I && !yg(I.expiresAt)) return l("tengu_oauth_token_refresh_race_recovered", {}), !0;
    return !1
  } finally {
    l("tengu_oauth_token_refresh_lock_releasing", {}),
    await J(),
    l("tengu_oauth_token_refresh_lock_released", {})
  }
}

// READABLE (for understanding):
async function refreshOAuthTokenIfNeeded(retryCount = 0, options) {
  let oauth = getClaudeAiOAuth();

  // Early exit: No refresh token or not expiring
  if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
    return false;
  }

  // Only refresh Claude.ai tokens (not inference-only)
  if (!hasClaudeAiScope(oauth.scopes)) {
    return false;
  }

  // PRE-LOCK CHECK: Clear cache, re-verify
  getClaudeAiOAuth.cache?.clear?.();
  clearOAuthCache();
  oauth = getClaudeAiOAuth();
  if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
    analyticsEvent("tengu_oauth_token_refresh_race_resolved", {});
    return false;
  }

  // Ensure lock directory exists
  let claudeDir = getClaudeDirectory();  // ~/.claude/
  fs().mkdirSync(claudeDir, { recursive: true });

  let releaseLock;
  try {
    // Acquire exclusive file lock
    analyticsEvent("tengu_oauth_token_refresh_lock_acquiring", {});
    releaseLock = await properLockfile.lock(claudeDir);
    analyticsEvent("tengu_oauth_token_refresh_lock_acquired", {});
  } catch (error) {
    if (error.code === "ELOCKED") {
      // Another process has the lock
      if (retryCount < 5) {
        analyticsEvent("tengu_oauth_token_refresh_lock_retry", {
          retryCount: retryCount + 1
        });
        // Wait 1-2 seconds (random jitter)
        await new Promise(resolve =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );
        return refreshOAuthTokenIfNeeded(retryCount + 1, options);
      }

      // Max retries reached
      analyticsEvent("tengu_oauth_token_refresh_lock_retry_limit_reached", {
        maxRetries: 5
      });
      return false;
    }

    // Unexpected lock error
    logError(error);
    analyticsEvent("tengu_oauth_token_refresh_lock_error", {
      error: error.message
    });
    return false;
  }

  try {
    // POST-LOCK VERIFICATION (Critical for race condition handling)
    getClaudeAiOAuth.cache?.clear?.();
    clearOAuthCache();
    oauth = getClaudeAiOAuth();

    if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
      // Another process refreshed while we waited for lock
      analyticsEvent("tengu_oauth_token_refresh_race_resolved", {});
      return false;
    }

    // Perform the actual token refresh
    analyticsEvent("tengu_oauth_token_refresh_starting", {});
    let newTokens = await refreshAccessToken(oauth.refreshToken);

    // Save new tokens to storage
    saveOAuthTokens(newTokens);

    // Clear cache to ensure next read gets new tokens
    getClaudeAiOAuth.cache?.clear?.();
    clearOAuthCache();

    return true;
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));

    // Clear cache and check if another process succeeded
    getClaudeAiOAuth.cache?.clear?.();
    clearOAuthCache();
    let currentOAuth = getClaudeAiOAuth();
    if (currentOAuth && !isTokenExpiringSoon(currentOAuth.expiresAt)) {
      analyticsEvent("tengu_oauth_token_refresh_race_recovered", {});
      return true;
    }

    return false;
  } finally {
    // ALWAYS release the lock
    analyticsEvent("tengu_oauth_token_refresh_lock_releasing", {});
    await releaseLock();
    analyticsEvent("tengu_oauth_token_refresh_lock_released", {});
  }
}

// Mapping: xR→refreshOAuthTokenIfNeeded, g4→getClaudeAiOAuth, yg→isTokenExpiringSoon,
//          xg→hasClaudeAiScope, YK→getClaudeDirectory, kA→fs, Q_A→properLockfile,
//          rT1→refreshAccessToken, XXA→saveOAuthTokens, vi→clearOAuthCache,
//          e→logError, l→analyticsEvent
```

### Lock Retry Strategy

| Attempt | Wait Time | Cumulative Max Wait |
|---------|-----------|---------------------|
| 1 | 1-2 seconds | 2 seconds |
| 2 | 1-2 seconds | 4 seconds |
| 3 | 1-2 seconds | 6 seconds |
| 4 | 1-2 seconds | 8 seconds |
| 5 | 1-2 seconds | 10 seconds |
| 6+ | Abort | N/A |

**Why Random Jitter (1-2s)?**
- Prevents **thundering herd**: Multiple processes waking up at the same time
- Spreads retry attempts over time
- Reduces lock contention probability

---

## Refresh Token API Call

### Algorithm: `rT1()` (refreshAccessToken)

```javascript
// ============================================
// refreshAccessToken - POST to token endpoint
// Location: chunks.48.mjs (token refresh)
// ============================================

// READABLE (for understanding):
async function refreshAccessToken(currentRefreshToken) {
  let payload = {
    grant_type: "refresh_token",
    refresh_token: currentRefreshToken,
    client_id: getOAuthConfig().CLIENT_ID,
    scope: CLAUDE_AI_SCOPES.join(" ")  // Request same scopes
  };

  try {
    // NEW in 2.1.7: platform.claude.com instead of console.anthropic.com
    let response = await axios.post(getOAuthConfig().TOKEN_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.status !== 200) {
      throw Error(`Token refresh failed: ${response.statusText}`);
    }

    let data = response.data;
    let {
      access_token: newAccessToken,
      refresh_token: newRefreshToken = currentRefreshToken,  // May rotate
      expires_in: expiresInSeconds
    } = data;

    // Calculate absolute expiration timestamp
    let expiresAt = Date.now() + expiresInSeconds * 1000;

    // Parse scopes from response
    let scopes = parseScopes(data.scope);

    analyticsEvent("tengu_oauth_token_refresh_success", {});

    // Fetch updated profile (subscription may have changed)
    let profileInfo = await fetchProfileInfo(newAccessToken);
    let config = getConfig();

    // Update stored account info if changed
    if (config.oauthAccount) {
      let needsSave = false;

      if (profileInfo.displayName !== undefined) {
        config.oauthAccount.displayName = profileInfo.displayName;
        needsSave = true;
      }

      if (typeof profileInfo.hasExtraUsageEnabled === "boolean") {
        config.oauthAccount.hasExtraUsageEnabled = profileInfo.hasExtraUsageEnabled;
        needsSave = true;
      }

      if (needsSave) saveConfig(config);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresAt,
      scopes: scopes,
      subscriptionType: profileInfo.subscriptionType,
      rateLimitTier: profileInfo.rateLimitTier
    };
  } catch (error) {
    analyticsEvent("tengu_oauth_token_refresh_failure", {
      error: error.message
    });
    throw error;
  }
}

// Mapping: rT1→refreshAccessToken
```

### Token Rotation

The server may optionally return a new `refresh_token`:
- If provided: Use the new refresh token for future refreshes
- If not provided: Continue using the current refresh token

This supports **refresh token rotation** for enhanced security.

---

## Race Condition Handling

### Double-Checked Locking Pattern

```
Process A                           Process B
─────────────────────────────────────────────────────────────────────
1. Check token expiring → YES       1. Check token expiring → YES
2. Clear cache, re-check → YES      2. Clear cache, re-check → YES
3. Acquire lock → SUCCESS           3. Acquire lock → ELOCKED (wait)
4. Post-lock check → YES            │
5. Call refresh API                 │ (waiting 1-2 seconds)
6. Save new tokens                  │
7. Release lock                     │
                                    3. Retry → Acquire lock → SUCCESS
                                    4. Post-lock check → NO (fresh token!)
                                    5. Release lock, return false
─────────────────────────────────────────────────────────────────────
Result: Only ONE refresh API call made
```

**Key Insight:** The post-lock verification prevents redundant API calls when multiple processes detect expiring tokens simultaneously.

### Cache Invalidation Points

| Point | Purpose |
|-------|---------|
| Pre-lock clear | Catch recent refresh by another process |
| Post-lock clear | Definitive check before API call |
| Post-save clear | Ensure next read gets new tokens |
| On-error clear | Allow recovery check |

---

## Error Recovery

### Error Scenarios and Handling

| Error | Handling | User Impact |
|-------|----------|-------------|
| `ELOCKED` (lock held) | Retry up to 5 times with jitter | Transparent delay |
| Lock error (other) | Log and return false | Uses current token |
| API 401 | Likely refresh token revoked | User must re-login |
| API 5xx | Server error, return false | Uses current token |
| Network error | Return false | Uses current token |

### Graceful Degradation

When refresh fails:
1. Current token continues to be used
2. User may experience API errors when token actually expires
3. Next request will trigger another refresh attempt

```javascript
// In createApiClient (XS):
await xR();  // Attempt refresh, ignore failure
// Continue with current token even if refresh failed
```

### Race Recovery

```javascript
// After refresh failure, check if another process succeeded
catch (error) {
  logError(error);
  clearOAuthCache();
  let currentOAuth = getClaudeAiOAuth();
  if (currentOAuth && !isTokenExpiringSoon(currentOAuth.expiresAt)) {
    // Another process succeeded, we can use their token
    analyticsEvent("tengu_oauth_token_refresh_race_recovered", {});
    return true;
  }
  return false;
}
```

---

## Integration Points

### With createApiClient

Token refresh is called automatically before API client creation:

```javascript
// ============================================
// Token refresh in createApiClient
// Location: chunks.82.mjs:2655
// ============================================

// ORIGINAL (for source lookup):
k("[API:auth] OAuth token check starting"),
await xR(),
k("[API:auth] OAuth token check complete"),
!qB() && Xn8(X, p2())

// READABLE (for understanding):
log("[API:auth] OAuth token check starting");
await refreshOAuthTokenIfNeeded();
log("[API:auth] OAuth token check complete");
if (!isClaudeAiOAuth()) {
  addAuthorizationHeader(headers, getTrustedContext());
}
```

### With Plan Mode

Plan mode triggers token refresh before entering planning:

```javascript
// Token is refreshed when plan mode creates API client
async function enterPlanMode() {
  // This internally calls refreshOAuthTokenIfNeeded
  const client = await createApiClient({ model: planModel });
  // ...
}
```

### With Tool Execution

Tools inherit the refreshed auth context from the session.

---

## Analytics Events

| Event | When |
|-------|------|
| `tengu_oauth_token_refresh_lock_acquiring` | About to acquire lock |
| `tengu_oauth_token_refresh_lock_acquired` | Lock acquired successfully |
| `tengu_oauth_token_refresh_starting` | Starting refresh API call |
| `tengu_oauth_token_refresh_success` | Refresh completed successfully |
| `tengu_oauth_token_refresh_failure` | Refresh API call failed |
| `tengu_oauth_token_refresh_lock_retry` | Retrying after lock contention |
| `tengu_oauth_token_refresh_lock_retry_limit_reached` | Max retries exceeded |
| `tengu_oauth_token_refresh_lock_error` | Unexpected lock error |
| `tengu_oauth_token_refresh_lock_releasing` | About to release lock |
| `tengu_oauth_token_refresh_lock_released` | Lock released |
| `tengu_oauth_token_refresh_race_resolved` | Another process already refreshed |
| `tengu_oauth_token_refresh_race_recovered` | Recovered from another process's refresh |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 flow details
- [api_key_auth.md](./api_key_auth.md) - Alternative authentication (no refresh)
