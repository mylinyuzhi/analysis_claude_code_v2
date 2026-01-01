# Token Refresh Mechanism

## Table of Contents

1. [Refresh Strategy Overview](#refresh-strategy-overview)
2. [Token Expiration Check](#token-expiration-check)
3. [File-Based Locking](#file-based-locking)
4. [Refresh Token API Call](#refresh-token-api-call)
5. [Race Condition Handling](#race-condition-handling)
6. [Error Recovery](#error-recovery)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `Qt` (refreshOAuthTokenIfNeeded) - Main refresh orchestrator
- `Ad` (isTokenExpiringSoon) - Expiration check with 5-min buffer
- `Mo0` (refreshAccessToken) - Actual token refresh API call
- `M6` (getClaudeAiOAuth) - Memoized token retrieval

---

## Refresh Strategy Overview

Claude Code implements automatic OAuth token refresh with:
- **5-minute buffer**: Refresh before actual expiration
- **File-based locking**: Prevent multiple processes from refreshing simultaneously
- **Double-checked locking**: Verify token still needs refresh after acquiring lock
- **Retry with jitter**: Handle lock contention gracefully

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Token Refresh Flow                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Token Access Request (e.g., API call)
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
│  │  M6.cache.clear()  // Clear memoization cache                          │ │
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
│  │  M6.cache.clear()  // Clear cache again                                │ │
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
│  │  POST /v1/oauth/token                                                  │ │
│  │  {                                                                     │ │
│  │    grant_type: "refresh_token",                                        │ │
│  │    refresh_token: current_refresh_token,                               │ │
│  │    client_id: CLIENT_ID,                                               │ │
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
│  │  gzA(newTokens)      // Save to Keychain/file                          │ │
│  │  M6.cache.clear()    // Clear memoization cache                        │ │
│  │  Release file lock                                                     │ │
│  │  return true                                                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Token Expiration Check

### Algorithm: `Ad()` (isTokenExpiringSoon)

```javascript
// ============================================
// isTokenExpiringSoon - Check if token expires within 5 minutes
// Location: chunks.24.mjs:1674-1678
// ============================================

// ORIGINAL (for source lookup):
function Ad(A) {
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

// Mapping: Ad→isTokenExpiringSoon
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

### Algorithm: `Qt()` (refreshOAuthTokenIfNeeded)

This is the core refresh orchestrator with file-based locking:

```javascript
// ============================================
// refreshOAuthTokenIfNeeded - Main refresh function with locking
// Location: chunks.56.mjs:2017-2049
// ============================================

// ORIGINAL (for source lookup):
async function Qt(A = 0) {
  let B = M6();
  if (!B?.refreshToken || !Ad(B.expiresAt)) return !1;
  if (!wv(B.scopes)) return !1;

  // Pre-lock cache clear and re-check
  if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) return !1;

  // Ensure lock directory exists
  let G = MQ();
  RA().mkdirSync(G);

  let I;
  try {
    // Acquire file lock
    I = await h4B.lock(G)
  } catch (Y) {
    if (Y.code === "ELOCKED") {
      // Retry with backoff
      if (A < 5) return GA("tengu_oauth_token_refresh_lock_retry", {
        retryCount: A + 1
      }), await new Promise((J) => setTimeout(J, 1000 + Math.random() * 1000)), Qt(A + 1);

      return GA("tengu_oauth_token_refresh_lock_retry_limit_reached", { maxRetries: 5 }), !1
    }
    return AA(Y), GA("tengu_oauth_token_refresh_lock_error", { error: Y.message }), !1
  }

  try {
    // Post-lock verification (race condition guard)
    if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) {
      return GA("tengu_oauth_token_refresh_race_resolved", {}), !1;
    }

    // Perform refresh
    let Y = await Mo0(B.refreshToken);
    return gzA(Y), M6.cache?.clear?.(), !0
  } catch (Y) {
    return AA(Y instanceof Error ? Y : Error(String(Y))), !1
  } finally {
    await I()  // Always release lock
  }
}

// READABLE (for understanding):
async function refreshOAuthTokenIfNeeded(retryCount = 0) {
  let oauth = getClaudeAiOAuth();

  // Early exit: No refresh token or not expiring
  if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
    return false;
  }

  // Only refresh Claude.ai tokens (not inference-only)
  if (!hasClaudeAiScope(oauth.scopes)) {
    return false;
  }

  // PRE-LOCK CHECK: Clear cache, re-verify (cheap before expensive lock)
  getClaudeAiOAuth.cache?.clear?.();
  oauth = getClaudeAiOAuth();
  if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
    return false;  // Another process may have just refreshed
  }

  // Ensure lock directory exists
  let claudeDir = getClaudeDirectory();  // ~/.claude/
  fs().mkdirSync(claudeDir, { recursive: true });

  let releaseLock;
  try {
    // Acquire exclusive file lock
    releaseLock = await properLockfile.lock(claudeDir);
  } catch (error) {
    if (error.code === "ELOCKED") {
      // Another process has the lock
      if (retryCount < 5) {
        analyticsEvent("tengu_oauth_token_refresh_lock_retry", {
          retryCount: retryCount + 1
        });
        // Wait 1-2 seconds (random jitter to prevent thundering herd)
        await new Promise(resolve =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );
        return refreshOAuthTokenIfNeeded(retryCount + 1);
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
    oauth = getClaudeAiOAuth();

    if (!oauth?.refreshToken || !isTokenExpiringSoon(oauth.expiresAt)) {
      // Another process refreshed while we waited for lock
      analyticsEvent("tengu_oauth_token_refresh_race_resolved", {});
      return false;
    }

    // Perform the actual token refresh
    let newTokens = await refreshAccessToken(oauth.refreshToken);

    // Save new tokens to storage
    saveOAuthTokens(newTokens);

    // Clear cache to ensure next read gets new tokens
    getClaudeAiOAuth.cache?.clear?.();

    return true;
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    return false;
  } finally {
    // ALWAYS release the lock, even on error
    await releaseLock();
  }
}

// Mapping: Qt→refreshOAuthTokenIfNeeded, M6→getClaudeAiOAuth, Ad→isTokenExpiringSoon,
//          wv→hasClaudeAiScope, MQ→getClaudeDirectory, RA→fs, h4B→properLockfile,
//          Mo0→refreshAccessToken, gzA→saveOAuthTokens, AA→logError, GA→analyticsEvent
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

### Algorithm: `Mo0()` (refreshAccessToken)

```javascript
// ============================================
// refreshAccessToken - POST to token endpoint
// Location: chunks.24.mjs:1592-1636
// ============================================

// ORIGINAL (for source lookup):
async function Mo0(A) {
  let Q = {
    grant_type: "refresh_token",
    refresh_token: A,
    client_id: e9().CLIENT_ID,
    scope: Ez1.join(" ")
  };
  try {
    let B = await YQ.post(e9().TOKEN_URL, Q, {
      headers: { "Content-Type": "application/json" }
    });
    if (B.status !== 200) throw Error(`Token refresh failed: ${B.statusText}`);

    let G = B.data,
      { access_token: Z, refresh_token: I = A, expires_in: Y } = G,
      J = Date.now() + Y * 1000,
      W = cbA(G.scope);

    GA("tengu_oauth_token_refresh_success", {});

    // Fetch updated profile info
    let X = await tz1(Z),
      V = N1();

    // Update account info if changed
    if (V.oauthAccount) {
      let F = !1;
      if (X.displayName !== void 0) V.oauthAccount.displayName = X.displayName, F = !0;
      if (typeof X.hasExtraUsageEnabled === "boolean")
        V.oauthAccount.hasExtraUsageEnabled = X.hasExtraUsageEnabled, F = !0;
      if (F) c0(V)
    }

    return {
      accessToken: Z,
      refreshToken: I,
      expiresAt: J,
      scopes: W,
      subscriptionType: X.subscriptionType,
      rateLimitTier: X.rateLimitTier
    }
  } catch (B) {
    throw GA("tengu_oauth_token_refresh_failure", { error: B.message }), B
  }
}

// READABLE (for understanding):
async function refreshAccessToken(currentRefreshToken) {
  let payload = {
    grant_type: "refresh_token",
    refresh_token: currentRefreshToken,
    client_id: getConfig().CLIENT_ID,
    scope: CLAUDE_AI_SCOPES.join(" ")  // Request same scopes
  };

  try {
    let response = await axios.post(getConfig().TOKEN_URL, payload, {
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

// Mapping: Mo0→refreshAccessToken, e9→getConfig, Ez1→CLAUDE_AI_SCOPES,
//          YQ→axios, cbA→parseScopes, tz1→fetchProfileInfo, N1→getConfig,
//          c0→saveConfig, GA→analyticsEvent
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
// In createApiClient (Kq):
await Qt();  // Attempt refresh, ignore failure
// Continue with current token even if refresh failed
```

---

## Analytics Events

| Event | When |
|-------|------|
| `tengu_oauth_token_refresh_success` | Refresh completed successfully |
| `tengu_oauth_token_refresh_failure` | Refresh API call failed |
| `tengu_oauth_token_refresh_lock_retry` | Retrying after lock contention |
| `tengu_oauth_token_refresh_lock_retry_limit_reached` | Max retries exceeded |
| `tengu_oauth_token_refresh_lock_error` | Unexpected lock error |
| `tengu_oauth_token_refresh_race_resolved` | Another process already refreshed |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 flow details
- [api_key_auth.md](./api_key_auth.md) - Alternative authentication (no refresh)
