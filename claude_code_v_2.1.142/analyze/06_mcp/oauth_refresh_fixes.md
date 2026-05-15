# MCP OAuth Refresh: Defensive Hardening (v2.1.118 → v2.1.142)

**Versions:** 2.1.118 (initial batch), 2.1.121 (UI follow-ups), 2.1.128 (telemetry-related), 2.1.136 (claude.ai connector token-rotation)

## Summary

The v2.1.105 fix in the baseline (`oauth_refresh_fix.md`) addressed *one* OAuth refresh bug — the config URL not being honored on refresh. v2.1.118 then shipped a batch of *five additional* OAuth refresh fixes that together turn the refresh path from "happy-path + best-effort error handling" into "defensive at every layer." This document covers all of them, plus the v2.1.136 claude.ai connector token-rotation fix, in one place because they share the same code paths.

The fixes:

| # | Bug | Fix location | Symptom |
|---|-----|--------------|---------|
| 1 | OAuth response missing `expires_in` → token treated as 1h-valid | `cli_inner_pretty.js:411122` | Hourly re-auth prompts even though token is good for 24h |
| 2 | Step-up auth silently refreshed when scope already present | `cli_inner_pretty.js:210112-210130`, `412912-412925` | User couldn't grant new scopes; refresh loop |
| 3 | OAuth flow timeout/cancel produced unhandled promise rejection | (rejection-shape change at multiple try-catch sites) | Node crashed with "UnhandledPromiseRejection" |
| 4 | Refresh proceeded without cross-process lock under contention | `cli_inner_pretty.js:411394-411399` | Multiple Claude Code instances racing to refresh, mutual invalidation |
| 5 | macOS keychain race: concurrent refresh overwrote fresh token | `cli_inner_pretty.js:411402`, post-`kU()` recheck | "Please run /login" appearing minutes after a successful refresh |
| 6 | claude.ai connector worker session token rotation → 401 cascade | `cli_inner_pretty.js:413307-413344` | All Remote Control MCP connectors failing simultaneously |

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.160.mjs` | 2334 | `expiresAt: Date.now() + (q.expires_in \|\| 3600) * 1000` — 1h default |
| v2.1.112 | `chunks.160.mjs` | 2551-2554 | "proceeding without lock" on ELOCKED exhaustion |
| v2.1.112 | `chunks.160.mjs` | 2624-2640 | `_doRefresh` invalid_grant handling without `kU()` recheck |
| v2.1.142 | `cli_inner_pretty.js` | **411122** | `expiresAt: H.expires_in != null ? Date.now() + H.expires_in * 1000 : void 0` |
| v2.1.142 | `cli_inner_pretty.js` | **411394-411399** | ELOCKED exhaustion → `return` (skip refresh) |
| v2.1.142 | `cli_inner_pretty.js` | 411402 | `kU()` between lock-acquire and read — keychain re-read |
| v2.1.142 | `cli_inner_pretty.js` | 411403-411421 | "Another process refreshed tokens" branch on the *post-lock* read |
| v2.1.142 | `cli_inner_pretty.js` | 410974-410976 | `markStepUpPending(scope)` — tracks an active step-up |
| v2.1.142 | `cli_inner_pretty.js` | 411067-411074 | `tokens()` omits `refresh_token` while step-up pending |
| v2.1.142 | `cli_inner_pretty.js` | 412912-412925 | `markStepUpPendingFromInsufficientScope` — fetch wrapper |
| v2.1.142 | `cli_inner_pretty.js` | 210112-210130 | SSE-side step-up: bounded by `_lastUpscopingHeader` |
| v2.1.142 | `cli_inner_pretty.js` | 413307-413344 | claude.ai proxy: retry once on 401 after token-rotation check |

## Fix 1: `expires_in` missing → no synthetic 1h

```javascript
// ============================================
// saveTokens.expiresAt (v2.1.112) - synthetic 1h fallback (the bug)
// Location: chunks.160.mjs:2334
// ============================================

// ORIGINAL (for source lookup):
expiresAt: Date.now() + (q.expires_in || 3600) * 1000,

// READABLE (for understanding):
// Missing or zero expires_in → invent a 3600 s (1 h) lifetime.
const expiresAt = Date.now() + (tokenResponse.expires_in || 3600) * 1000;

// Mapping: q→tokenResponse
```

```javascript
// ============================================
// saveTokens.expiresAt (v2.1.142) - honest undefined on missing expires_in (the fix)
// Location: cli_inner_pretty.js:411122
// ============================================

// ORIGINAL (for source lookup):
expiresAt: H.expires_in != null ? Date.now() + H.expires_in * 1000 : void 0,

// READABLE (for understanding):
// Missing expires_in → store undefined ("unknown lifetime").
// undefined is interpreted by the tokens() consumer as "no expiration known"
// — the token is used until a 401 is observed, then re-auth.
const expiresAt = tokenResponse.expires_in != null
    ? Date.now() + tokenResponse.expires_in * 1000
    : undefined;

// Mapping: H→tokenResponse
```

**Why this fix:** OAuth 2.0 RFC 6749 §5.1 makes `expires_in` *optional* in the access-token response. Some servers (notably enterprise IdPs with bearer tokens of indefinite life) simply don't emit it. Treating absence as "1 hour" forced re-auth every hour even though the token was valid for much longer. v2.1.142 treats absence as "unknown — use until denied," matching RFC intent.

## Fix 2: Step-up auth needs a separate scope-tracking path

When an MCP server returns `403 insufficient_scope`, the SDK is supposed to:
1. Capture the new scope from the `WWW-Authenticate: Bearer scope="..."` header.
2. Send the user through a fresh authorization flow that requests that scope.
3. Use the new token, which carries the higher scope.

The bug: step 2 used `tokens()` to discover the existing refresh token, then *refreshed silently* with the existing scope — which is `insufficient_scope`, so the server returned 403 again, and the cycle repeated.

The v2.1.118 fix introduces `_pendingStepUpScope` state on the OAuth provider. While that flag is set:
- `tokens()` omits the refresh token (forcing a fresh authorization, not a silent refresh).
- The new scope is captured from the 403 response and sent to the next `redirectToAuthorization` call.
- The SSE-side handler tracks `_lastUpscopingHeader` to prevent infinite step-up loops if the server keeps returning 403 even after re-scoping.

```javascript
// ============================================
// markStepUpPending - set on OAuth provider when 403 insufficient_scope received
// Location: cli_inner_pretty.js:410974-410976
// ============================================

// ORIGINAL (for source lookup):
markStepUpPending(H) {
    ((this._pendingStepUpScope = H), H8(this.serverName, `Marked step-up pending: ${H}`));
}

// READABLE (for understanding):
markStepUpPending(scope) {
    this._pendingStepUpScope = scope;
    logMCPDebug(this.serverName, `Marked step-up pending: ${scope}`);
}

// Mapping: H→scope
```

```javascript
// ============================================
// markStepUpPendingFromInsufficientScope - HTTP fetch wrapper that detects 403
// Location: cli_inner_pretty.js:412912-412925
// ============================================

// ORIGINAL (for source lookup):
function QI6(H, $) {
  return async (q, K) => {
    let _ = await H(q, K);
    if (_.status === 403) {
      let A = _.headers.get("WWW-Authenticate");
      if (A?.includes("insufficient_scope")) {
        let z = A.match(/scope=(?:"([^"]+)"|([^\s,]+))/),
          Y = z?.[1] ?? z?.[2];
        if (Y) $.markStepUpPending(Y);
      }
    }
    return _;
  };
}

// READABLE (for understanding):
function wrapInsufficientScopeDetector(innerFetch, oauthProvider) {
    return async (url, init) => {
        const response = await innerFetch(url, init);
        if (response.status === 403) {
            const wwwAuthenticate = response.headers.get("WWW-Authenticate");
            if (wwwAuthenticate?.includes("insufficient_scope")) {
                // Parse `scope="foo bar"` or `scope=foo` from the WWW-Authenticate header.
                const scopeMatch = wwwAuthenticate.match(/scope=(?:"([^"]+)"|([^\s,]+))/);
                const requestedScope = scopeMatch?.[1] ?? scopeMatch?.[2];
                if (requestedScope) oauthProvider.markStepUpPending(requestedScope);
            }
        }
        return response;
    };
}

// Mapping: QI6→wrapInsufficientScopeDetector, H→innerFetch, $→oauthProvider,
//          q→url, K→init, _→response, A→wwwAuthenticate, z→scopeMatch, Y→requestedScope
```

```javascript
// ============================================
// tokens() — omits refresh_token while step-up pending
// Location: cli_inner_pretty.js:411067-411094
// ============================================

// ORIGINAL (for source lookup, relevant block):
let _ = K.expiresAt != null ? (K.expiresAt - Date.now()) / 1000 : void 0,
    A = this._pendingStepUpScope !== void 0;
if (A) H8(this.serverName, `Step-up pending (${this._pendingStepUpScope}), omitting refresh_token`);
if (_ != null && _ <= 0 && !K.refreshToken) {
    H8(this.serverName, "Token expired without refresh token");
    return;
}
if (_ != null && _ <= 300 && K.refreshToken && !A) {
    // ... proactive refresh path — SKIPPED when step-up pending ...
}
let z = {
    access_token: K.accessToken,
    refresh_token: A ? void 0 : K.refreshToken,   // ← key: omit refresh_token while pending
    expires_in: _,
    scope: K.scope,
    token_type: "Bearer",
};

// READABLE (for understanding):
const expiresInSeconds = storedToken.expiresAt != null
    ? (storedToken.expiresAt - Date.now()) / 1000
    : undefined;
const isStepUpPending = this._pendingStepUpScope !== undefined;

if (isStepUpPending) {
    logMCPDebug(this.serverName, `Step-up pending (${this._pendingStepUpScope}), omitting refresh_token`);
}

// Skip proactive refresh while step-up is pending — we need the user's consent first.
if (
    expiresInSeconds != null && expiresInSeconds <= 300
    && storedToken.refreshToken && !isStepUpPending
) {
    // ...refresh path...
}

return {
    access_token: storedToken.accessToken,
    refresh_token: isStepUpPending ? undefined : storedToken.refreshToken,  // ← guard
    expires_in: expiresInSeconds,
    scope: storedToken.scope,
    token_type: "Bearer",
};

// Mapping: K→storedToken, _→expiresInSeconds, A→isStepUpPending, z→returned tokens
```

When `tokens()` returns without a `refresh_token`, the SDK's auth orchestrator can't silently refresh — it falls through to `redirectToAuthorization`, which goes through the user's consent screen with the new scope. Once `saveTokens()` is called with the new token, it clears `_pendingStepUpScope` (line 411105).

## Fix 3: Unhandled promise rejection on cancelled OAuth flow

The OAuth flow uses `await` and `Promise.race` between a user-action timeout and the actual flow completion. Pre-fix, when the user dismissed the in-progress OAuth panel (or the flow timed out via `AuthenticationCancelledError`), the unfulfilled handler attached to the racing-other-side promise would reject *after* the consumer had already moved on, surfacing as an unhandled promise rejection.

The fix is structural — every `try`/`finally` site now has explicit `.catch(noop)` chains for the cancellation arm, and the `_refreshInProgress` field is cleared in a `.finally()`. The exact change is distributed across the file; representative snippet at `cli_inner_pretty.js:411049-411051`:

```javascript
this._refreshInProgress = this.xaaRefresh().finally(() => {
    this._refreshInProgress = void 0;
});
```

This `.finally()` was an unconditional `.then(noop, noop)` (or absent) pre-fix. The unconditional clear ensures the next refresh attempt isn't accidentally aliased to a settled-with-rejection promise.

## Fix 4: Refusing to refresh without the cross-process lock

```javascript
// ============================================
// refreshAuthorization (v2.1.112) - proceeds without lock on contention (the bug)
// Location: chunks.160.mjs:2551-2554
// ============================================

// ORIGINAL (for source lookup):
if (!A) i8(this.serverName, `Could not acquire refresh lock after ${Sz7} retries, proceeding without lock`);
try {
    TE();
    let $ = t3().read()?.mcpOAuth?.[K];
    // ... reads token, refreshes anyway ...

// READABLE (for understanding):
// Lock contention is logged as a warning, then refresh proceeds without lock.
// Two Claude Code instances refreshing in parallel can each invalidate the other's
// old refresh token (the IdP rotates refresh tokens, returning a new one to the
// "winning" instance; the "losing" instance's saved refresh_token is now invalid).
// User observes random "Please re-authenticate" prompts.
if (!lockHandle) {
    logMCPDebug(this.serverName, `Could not acquire refresh lock after ${MAX_LOCK_RETRIES} retries, proceeding without lock`);
}
try {
    invalidateCredentialStorageCache();
    const storedToken = getSecureStorage().read()?.mcpOAuth?.[serverKey];
    // ... reads token, refreshes anyway ...
}

// Mapping: A→lockHandle, Sz7→MAX_LOCK_RETRIES, K→serverKey,
//          TE→invalidateCredentialStorageCache, t3→getSecureStorage, i8→logMCPDebug
```

```javascript
// ============================================
// refreshAuthorization (v2.1.142) - skip refresh on lock exhaustion (the fix)
// Location: cli_inner_pretty.js:411397-411399
// ============================================

// ORIGINAL (for source lookup):
if (!A) {
    H8(this.serverName, `Could not acquire refresh lock after ${UI6} retries; skipping refresh`);
    return;
}

// READABLE (for understanding):
// Lock contention → give up this refresh attempt, let the other instance win.
// - The "loser" returns undefined from refreshAuthorization, which propagates to tokens().
// - tokens() then returns the existing (about-to-expire) access token, which may
//   still work for ~5 minutes (we only proactively refresh when <300 s left).
// - The next request that gets 401 retries naturally, by which time the lock holder
//   has finished and the keychain has the fresh token.
if (!lockHandle) {
    logMCPDebug(this.serverName, `Could not acquire refresh lock after ${MAX_LOCK_RETRIES} retries; skipping refresh`);
    return;
}

// Mapping: A→lockHandle, UI6→MAX_LOCK_RETRIES, H8→logMCPDebug
```

**Why this is safer:** The lock exists specifically because IdPs use refresh-token rotation (RFC 6749 §6) — each refresh consumes the old refresh_token and issues a new one. Two concurrent refreshes both consume the same old token; only one wins, the other gets `invalid_grant`. Without the lock, the loser's local cache might *also* save its (now-invalid) tokens, overwriting the winner's. The lock prevents this exact race.

## Fix 5: macOS keychain race — re-read after lock acquire

```javascript
// ============================================
// refreshAuthorization - post-lock recheck (v2.1.142)
// Location: cli_inner_pretty.js:411401-411432
// ============================================

// ORIGINAL (for source lookup, relevant section):
try {
    kU();   // ← NEW: invalidate in-memory keychain cache, force re-read from disk/keychain
    let f = (await o9().readAsync())?.mcpOAuth?.[$];
    if (f) {
        let O = f.expiresAt != null ? (f.expiresAt - Date.now()) / 1000 : void 0;
        if (f.accessToken && (O == null || O > 300))
            return (
                H8(
                    this.serverName,
                    O != null
                        ? `Another process already refreshed tokens (expires in ${Math.floor(O)}s)`
                        : "Another process already refreshed tokens (no expiration)",
                ),
                {
                    access_token: f.accessToken,
                    refresh_token: f.refreshToken,
                    expires_in: O,
                    scope: f.scope,
                    token_type: "Bearer",
                }
            );
        if (f.refreshToken) H = f.refreshToken;
    }
    return await this._doRefresh(H);
} finally {
    if (A)
        try {
            (await A(), H8(this.serverName, "Released refresh lock"));
        } catch {
            H8(this.serverName, "Failed to release refresh lock");
        }
}

// READABLE (for understanding):
try {
    // CRITICAL: invalidate the in-memory keychain/credentials cache.
    // The earlier read (before lock acquisition) is stale w.r.t. anything another
    // process wrote while we were blocked. Re-read from disk/keychain.
    invalidateCredentialStorageCache();

    const freshStoredToken = (await getSecureStorage().readAsync())?.mcpOAuth?.[serverKey];
    if (freshStoredToken) {
        const remainingSeconds = freshStoredToken.expiresAt != null
            ? (freshStoredToken.expiresAt - Date.now()) / 1000
            : undefined;

        // If another process already refreshed and the new token has >5 min left,
        // use it as-is instead of triggering our own (now-redundant) refresh.
        if (freshStoredToken.accessToken && (remainingSeconds == null || remainingSeconds > 300)) {
            logMCPDebug(
                this.serverName,
                remainingSeconds != null
                    ? `Another process already refreshed tokens (expires in ${Math.floor(remainingSeconds)}s)`
                    : "Another process already refreshed tokens (no expiration)",
            );
            return {
                access_token: freshStoredToken.accessToken,
                refresh_token: freshStoredToken.refreshToken,
                expires_in: remainingSeconds,
                scope: freshStoredToken.scope,
                token_type: "Bearer",
            };
        }

        // Otherwise, use the freshest refresh_token we have (might've been rotated).
        if (freshStoredToken.refreshToken) refreshToken = freshStoredToken.refreshToken;
    }

    // We're the leader — perform the actual refresh.
    return await this._doRefresh(refreshToken);
} finally {
    if (lockRelease) {
        try {
            await lockRelease();
            logMCPDebug(this.serverName, "Released refresh lock");
        } catch {
            logMCPDebug(this.serverName, "Failed to release refresh lock");
        }
    }
}

// Mapping: kU→invalidateCredentialStorageCache, o9→getSecureStorage,
//          $→serverKey, f→freshStoredToken, O→remainingSeconds, A→lockRelease,
//          H→refreshToken (parameter mutated to latest from storage)
```

**Why `kU()` matters specifically on macOS:** the keychain is *the* source of truth on macOS, and the in-memory cache (`HqH.cache` in this code base) is read on first access. If process B acquired the lock and wrote a fresh token while process A was blocked, process A's cached `mcpOAuth[serverKey]` is stale. Without `kU()`, the post-lock check on line 411403 reads the *cached* value (which is the same stale one A had before blocking) — and decides "no other refresh has happened, I should refresh myself." That double-refresh then races B's already-rotated refresh_token. `kU()` is the explicit cache invalidation; the subsequent `o9().readAsync()` reads from disk/keychain.

## Fix 6: claude.ai proxy 401 retry on token rotation

```javascript
// ============================================
// claudeAiProxyFetch - retry once on 401 after checking for token rotation
// Location: cli_inner_pretty.js:413307-413344
// ============================================

// ORIGINAL (for source lookup):
function q_5(H) {
  return async ($, q) => {
    let K = async () => {
      await wY();
      let O = xq();
      if (!O) throw Error("No claude.ai OAuth token available");
      let M = new Headers(q?.headers);
      return (
        M.set("Authorization", `Bearer ${O.accessToken}`),
        { response: await H($, { ...q, headers: M }), sentToken: O.accessToken }
      );
    };
    async function _(O) {
      if (O.status >= 400 && O.headers.get("content-type")?.includes("text/event-stream")) {
        let M = await O.text(),
          w = M.split("\n").find((D) => D.startsWith("data: "));
        return new Response(w ? w.slice(6) : M, { status: O.status, statusText: O.statusText, headers: O.headers });
      }
      return O;
    }
    let { response: A, sentToken: z } = await K();
    if (A.status !== 401) return _(A);
    let Y = A.headers.get("X-Mcp-Error-Code") ?? void 0;
    if (Y) return (d("tengu_mcp_claudeai_proxy_401", { tokenChanged: !1, proxyErrorCode: Y }), A);
    let f = await fu(z).catch(() => !1);
    if ((d("tengu_mcp_claudeai_proxy_401", { tokenChanged: f }), !f)) {
      let O = xq()?.accessToken;
      if (!O || O === z) return A;
    }
    try {
      return _((await K()).response);
    } catch {
      return A;
    }
  };
}

// READABLE (for understanding):
function wrapClaudeAiProxyFetch(innerFetch) {
    return async (url, init) => {
        // (1) Send the request with the *current* claude.ai access token attached.
        const sendOnce = async () => {
            await waitForClaudeAiAuthReady();
            const token = getClaudeAiOAuthToken();
            if (!token) throw new Error("No claude.ai OAuth token available");
            const headers = new Headers(init?.headers);
            headers.set("Authorization", `Bearer ${token.accessToken}`);
            return {
                response: await innerFetch(url, { ...init, headers }),
                sentToken: token.accessToken,
            };
        };

        // Helper: unwrap an SSE-event error body into a plain response, so the
        // SDK gets a uniform .json()/.text() shape regardless of content-type.
        function maybeUnwrapSseErrorEnvelope(response) {
            if (response.status >= 400 && response.headers.get("content-type")?.includes("text/event-stream")) {
                /* read the body, find the line starting with "data: ", return a new Response from that */
                // ...
            }
            return response;
        }

        const { response, sentToken } = await sendOnce();
        if (response.status !== 401) return maybeUnwrapSseErrorEnvelope(response);

        // (2) 401 path: figure out whether this is a real auth failure or a token-rotation race.
        const proxyErrorCode = response.headers.get("X-Mcp-Error-Code") ?? undefined;
        if (proxyErrorCode) {
            // Server's proxy returned a structured error — not a token-rotation issue.
            logTelemetry("tengu_mcp_claudeai_proxy_401", { tokenChanged: false, proxyErrorCode });
            return response;
        }

        // (3) No proxy error code → could be token rotation. Force a token refresh.
        const tokenChanged = await refreshClaudeAiToken(sentToken).catch(() => false);
        logTelemetry("tengu_mcp_claudeai_proxy_401", { tokenChanged });

        if (!tokenChanged) {
            // Refresh didn't change the token — also check if some *other* path
            // rotated it (e.g. concurrent session). If still the same, return the 401.
            const currentToken = getClaudeAiOAuthToken()?.accessToken;
            if (!currentToken || currentToken === sentToken) return response;
        }

        // (4) Retry once with the new token.
        try {
            return maybeUnwrapSseErrorEnvelope((await sendOnce()).response);
        } catch {
            return response;  // give up gracefully — return original 401
        }
    };
}

// Mapping: q_5→wrapClaudeAiProxyFetch, H→innerFetch, $→url, q→init, K→sendOnce,
//          _→maybeUnwrapSseErrorEnvelope, wY→waitForClaudeAiAuthReady,
//          xq→getClaudeAiOAuthToken, fu→refreshClaudeAiToken, d→logTelemetry,
//          A→response, z→sentToken, Y→proxyErrorCode, f→tokenChanged
```

**Why this fix matters:** Remote Control connectors (`claudeai-proxy` type) authenticate using the user's claude.ai access token. The claude.ai backend can **rotate that token mid-session** when the user logs in on another device, or when the token's TTL is hit. Pre-fix, every claude.ai MCP connector that made a request *after the rotation* would get 401 and surface as "failed" — even though the new token was already in the local keychain. The user would see "all MCP connectors failed simultaneously" and assume the service was down.

The fix is to treat 401-without-`X-Mcp-Error-Code` as a *probable* token-rotation event and silently retry once after a token refresh. The `X-Mcp-Error-Code` header (which the proxy returns for real auth failures like revoked tokens) bypasses the retry.

## Cross-cut: the refresh state machine, post-v2.1.142

```
Token usage (per request)
   │
   ▼
tokens() called
   │
   ├─ no stored token? → return undefined → caller redirects to auth
   ├─ stored token, _pendingStepUpScope set? → return token WITHOUT refresh_token
   │                                            (forces re-auth flow)
   ├─ stored token expires in >300s? → return as-is
   ├─ stored token expires in <300s, refreshToken present, no step-up? → proactive refresh
   │     │
   │     ▼
   │   refreshAuthorization(refreshToken)
   │     │
   │     ▼
   │   Acquire cross-process lockfile
   │     │
   │     ├─ ELOCKED after retries → return undefined (SKIP refresh — Fix 4)
   │     │
   │     ▼
   │   kU() — invalidate keychain cache (Fix 5)
   │     │
   │     ▼
   │   Re-read storage. Did another process write fresher tokens?
   │     │
   │     ├─ YES → return those tokens (avoid double-refresh)
   │     ├─ NO  → continue to _doRefresh
   │     │
   │     ▼
   │   _doRefresh: 3 attempts with exponential backoff
   │     │
   │     ├─ invalid_grant? → kU(), re-read storage one more time
   │     │     │
   │     │     ├─ Another process wrote fresh tokens? → use those
   │     │     └─ No fresh tokens → invalidateCredentials("tokens"), return undefined
   │     │
   │     ├─ transient error? → backoff, retry
   │     ├─ success? → saveTokens (now stores expiresAt as undefined if expires_in missing — Fix 1)
   │     └─ exhausted → return undefined
   │     │
   │     ▼
   │   release lock, return
   │
   └─ stored token expired, no refreshToken? → return undefined → caller redirects to auth
```

## Why This Approach (consolidated)

### Why all five fixes are in the same code path

The five v2.1.118 fixes all sit in `McpOAuthProvider` and its helpers. They share local state (`_pendingStepUpScope`, `_refreshInProgress`, `_metadata`) and the cross-process lockfile. Fixing them piecemeal would have meant testing the same lock/cache pipeline five times. Shipping them together also avoids regression-window risk — a partial fix (e.g. fixing the keychain race but not the lock) would have produced *new* observable bugs.

### Why `kU()` is called twice in `_doRefresh`

Once inside the lock (line 411402) before the post-lock recheck, and once in the `invalid_grant` catch arm (line 411492) before checking if another process wrote fresh tokens after the failed refresh. Both calls solve the same general problem ("our in-memory cache might be stale relative to the keychain"), just at different points in the flow. The duplication is fine — `kU()` is a single Object-assignment, ~zero cost.

### Why omit `refresh_token` (rather than throw) when step-up is pending

The SDK's `eF` orchestrator decides what to do based on what `tokens()` returns:
- Has `access_token` + `refresh_token`? → Try silent refresh first.
- Has `access_token` only? → Use as-is; if 401, do redirect.
- No tokens? → Redirect immediately.

By returning the access_token (still good for non-stepped-up requests) and omitting the refresh_token, we steer the SDK into "use as-is, then redirect on 401 with the new scope." Throwing would force a redirect immediately, which would interrupt the current request for no benefit — the access token can still serve the *current* tool call if it doesn't need the new scope.

### Trade-off: more disk I/O and keychain reads

Every refresh now does at least one extra keychain read (the post-lock recheck) and `kU()` invalidates the cache (meaning the *next* read on any path also hits the keychain). On macOS the keychain has its own auth-prompt subtleties; cumulative keychain access went from "twice per refresh" to "three or four times per refresh." This is invisible to the user under normal conditions, but on a freshly-locked keychain it can mean an extra Touch ID prompt or two. The defensiveness is judged worth it.

### Trade-off: the `X-Mcp-Error-Code` heuristic for claude.ai proxy

The fix's "is this a real error or token rotation?" decision rests on the presence of `X-Mcp-Error-Code` in the 401 response. This header is set by Anthropic's own proxy. Third-party proxies that forward claude.ai connector requests wouldn't set it, and the fix would *always* retry — possibly amplifying load on a backend that's intentionally returning 401. Anthropic's own infrastructure is the only legitimate proxy for `claudeai-proxy` servers, so this isn't a real concern in practice.

### Key insight

The OAuth refresh path is the canonical example of a "feature that mostly works but accumulates bugs when scaled." Each individual fix is small (a few lines). Together they cover the failure modes that emerge when:
- Multiple Claude Code instances run concurrently (Fix 4, 5).
- The IdP behaves marginally non-standardly (Fix 1).
- The MCP server requires step-up auth (Fix 2).
- The user dismisses the auth UI (Fix 3).
- The user's claude.ai session rotates mid-session (Fix 6).

The aggregate effect is that "you should not need to re-authenticate within the access token's lifetime" goes from "almost always true" to "actually true in practice."

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — OAuth Refresh Defense".

Key entities:
- `markStepUpPending` (method on `McpOAuthProvider`, cli_inner_pretty.js:410974-410976)
- `_pendingStepUpScope` (field on `McpOAuthProvider`)
- `tokens` (method, cli_inner_pretty.js:411032-411103) — omits refresh_token while step-up pending
- `saveTokens` (method, cli_inner_pretty.js:411104-411131) — clears `_pendingStepUpScope`; honors null `expires_in`
- `refreshAuthorization` (method, cli_inner_pretty.js:411369-411433) — lock-or-skip, post-lock recheck
- `_doRefresh` (method, cli_inner_pretty.js:411434-411529)
- `invalidateCredentialStorageCache` (`kU`, cli_inner_pretty.js:91522-91524)
- `wrapInsufficientScopeDetector` (`QI6`, cli_inner_pretty.js:412912-412925)
- `wrapClaudeAiProxyFetch` (`q_5`, cli_inner_pretty.js:413307-413344)
- `refreshClaudeAiToken` (`fu`) — defined in earlier session-management chunks
- `getClaudeAiOAuthToken` (`xq`)
- `MAX_LOCK_RETRIES` (`UI6`, = 5, cli_inner_pretty.js:411603)
- `OAUTH_REFRESH_LOCK_STALE_MS` (`q15`, = 30000, cli_inner_pretty.js:411602)
- `TRANSIENT_REFRESH_ERROR_CODES` (`A15`, Set of error codes, cli_inner_pretty.js:411640)
