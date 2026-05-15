# MCP OAuth `authServerMetadataUrl` Honored on Refresh — ADFS Fix

**Versions:** 2.1.105 (fix)

## Summary

For MCP servers fronted by an authorization server (AS) whose RFC 8414 metadata lives at a non-standard URL — most notably **ADFS** (Active Directory Federation Services) and other enterprise IdPs — the user pins the metadata URL in config:

```json
{
  "mcpServers": {
    "company-internal": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "oauth": {
        "clientId": "abc123",
        "authServerMetadataUrl": "https://adfs.example.com/adfs/.well-known/openid-configuration"
      }
    }
  }
}
```

Before 2.1.105, this URL was consulted on the *initial* OAuth flow, but on **token refresh after restart** the provider's `discoveryState()` returned the cached state from disk (which might be stale: e.g. ADFS rotated its `token_endpoint`, or the original discovery was from a cache that's now corrupt). Refresh then failed — even though the config had a fresh metadata URL right there.

2.1.105 reorders `discoveryState()` to consult the config URL **first**, with the on-disk cache as a fallback.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.88 | `claude-code-kim/src/services/mcp/types.ts` | 47-53 | `authServerMetadataUrl` field on `McpOAuthConfigSchema` (already present) |
| v2.1.88 | `claude-code-kim/src/services/mcp/auth.ts` | 2060-2061 | first-time path (consults `authServerMetadataUrl`) |
| v2.1.88 | `claude-code-kim/src/services/mcp/auth.ts` | 2037-2088 | `discoveryState()` — **cache-first, URL as last-resort fallback** |
| v2.1.88 | `claude-code-kim/src/services/mcp/auth.ts` | 2246 | refresh path (passes `authServerMetadataUrl` after cache miss) |
| v2.1.112 | `chunks.18.mjs` | 1940-1948 | `McpOAuthConfigSchema` (zod) - `authServerMetadataUrl` + new `scopes` field |
| v2.1.112 | `chunks.160.mjs` | 2502-2527 | `discoveryState()` — **URL-first, cache as fallback** ← FIX |
| v2.1.112 | `chunks.160.mjs` | 2578-2654 | `_doRefresh` — overall refresh state machine |

## The v2.1.88 Order: Cache First (the Bug)

```typescript
// ============================================
// McpOAuthProvider.discoveryState (v2.1.88 — cache-first, the bug)
// Location: claude-code-kim/src/services/mcp/auth.ts:2037-2088
// ============================================

async discoveryState(): Promise<OAuthDiscoveryState | undefined> {
  const storage = getSecureStorage()
  const data = storage.read()
  const serverKey = getServerKey(this.serverName, this.serverConfig)

  // STEP 1: Check cached discovery state first
  const cached = data?.mcpOAuth?.[serverKey]?.discoveryState
  if (cached?.authorizationServerUrl) {
    logMCPDebug(
      this.serverName,
      `Returning cached discovery state (authServer: ${cached.authorizationServerUrl})`,
    )

    return {
      authorizationServerUrl: cached.authorizationServerUrl,
      resourceMetadataUrl: cached.resourceMetadataUrl,
      resourceMetadata:
        cached.resourceMetadata as OAuthDiscoveryState['resourceMetadata'],
      authorizationServerMetadata:
        cached.authorizationServerMetadata as OAuthDiscoveryState['authorizationServerMetadata'],
    }
  }

  // STEP 2: Fall back to config-pinned URL (only if cache empty)
  const metadataUrl = this.serverConfig.oauth?.authServerMetadataUrl
  if (metadataUrl) {
    logMCPDebug(this.serverName, `Fetching metadata from configured URL: ${metadataUrl}`)
    try {
      const metadata = await fetchAuthServerMetadata(
        this.serverName,
        this.serverConfig.url,
        metadataUrl,
      )
      if (metadata) {
        return {
          authorizationServerUrl: metadata.issuer,
          authorizationServerMetadata:
            metadata as OAuthDiscoveryState['authorizationServerMetadata'],
        }
      }
    } catch (error) {
      logMCPDebug(this.serverName, `Failed to fetch from configured metadata URL: ${errorMessage(error)}`)
    }
  }

  return undefined
}
```

**Why this is buggy for ADFS:** On the first OAuth flow, the cache is empty, so the config URL is fetched and the result is persisted to disk. Now the cache is populated. On **every subsequent refresh after a restart**, the cache wins — even if ADFS has rotated its `token_endpoint`, even if the cached metadata is missing required fields, even if the user *changed the config URL* to a new tenant. The config-pinned URL becomes effectively read-only after first contact.

## The v2.1.112 Order: Config-URL First

```javascript
// ============================================
// McpOAuthProvider.discoveryState (v2.1.112 — URL-first, the fix)
// Location: chunks.160.mjs:2502-2527
// ============================================

// ORIGINAL (for source lookup):
async discoveryState() {
    let q = this.serverConfig.oauth?.authServerMetadataUrl;
    if (q) {
        i8(this.serverName, `Fetching metadata from configured URL: ${q}`);
        try {
            let A = await ml8(this.serverName, this.serverConfig.url, q);
            if (A) return {
                authorizationServerUrl: A.issuer,
                authorizationServerMetadata: A
            }
        } catch (A) {
            i8(this.serverName, `Failed to fetch from configured metadata URL: ${b6(A)}`)
        }
        return
    }
    let _ = t3().read(),
        z = IX(this.serverName, this.serverConfig),
        Y = _?.mcpOAuth?.[z]?.discoveryState;
    if (Y?.authorizationServerUrl) return i8(this.serverName, `Returning cached discovery state (authServer: ${Y.authorizationServerUrl})`), {
        authorizationServerUrl: Y.authorizationServerUrl,
        resourceMetadataUrl: Y.resourceMetadataUrl,
        resourceMetadata: Y.resourceMetadata,
        authorizationServerMetadata: Y.authorizationServerMetadata
    };
    return
}

// READABLE (for understanding):
async discoveryState() {
    // STEP 1 — If config pins a URL, fetch live metadata from it. Bypass the cache.
    const configUrl = this.serverConfig.oauth?.authServerMetadataUrl;
    if (configUrl) {
        logMCPDebug(this.serverName, `Fetching metadata from configured URL: ${configUrl}`);
        try {
            const metadata = await fetchAuthServerMetadata(
                this.serverName,
                this.serverConfig.url,
                configUrl,
            );
            if (metadata) {
                return {
                    authorizationServerUrl: metadata.issuer,
                    authorizationServerMetadata: metadata,
                };
            }
        } catch (error) {
            logMCPDebug(this.serverName, `Failed to fetch from configured metadata URL: ${errorMessage(error)}`);
        }
        return;   // ← If config URL fetch failed, do NOT fall back to cache.
                  //   The config URL is the source of truth when present.
    }

    // STEP 2 — No config URL → fall back to cached discovery state.
    const storage = getSecureStorage();
    const serverKey = getServerKey(this.serverName, this.serverConfig);
    const cached = storage.read()?.mcpOAuth?.[serverKey]?.discoveryState;
    if (cached?.authorizationServerUrl) {
        logMCPDebug(this.serverName, `Returning cached discovery state (authServer: ${cached.authorizationServerUrl})`);
        return {
            authorizationServerUrl: cached.authorizationServerUrl,
            resourceMetadataUrl: cached.resourceMetadataUrl,
            resourceMetadata: cached.resourceMetadata,
            authorizationServerMetadata: cached.authorizationServerMetadata,
        };
    }
    return;
}

// Mapping: q→configUrl, ml8→fetchAuthServerMetadata, _→storage.read(),
//          z→serverKey, Y→cached, IX→getServerKey, t3→getSecureStorage,
//          i8→logMCPDebug, b6→errorMessage, A→metadata (or caught error)
```

### What changed

| Behavior | v2.1.88 | v2.1.112 |
|----------|---------|----------|
| First-time auth, no cache, no config URL | Returns `undefined` (forces RFC 9728 discovery) | Same |
| First-time auth, no cache, config URL set | Fetches from config URL | Fetches from config URL |
| Refresh after restart, cache exists, config URL set | **Returns cache** (ignores live config URL) | **Fetches live config URL**, ignores cache |
| Refresh after restart, cache exists, no config URL | Returns cache | Returns cache (unchanged) |
| Config URL fetch fails, cache exists | Falls back to cache | **Does not** fall back — returns `undefined` (forces fresh discovery in `_doRefresh`) |

The critical change is the early `return;` (line 2516) after the config-URL branch. Pre-2.1.105 the code would have fallen through and used the cache. Post-2.1.105 the config URL is **authoritative**: if it's set, the cache is bypassed entirely.

## The `_doRefresh` Cooperation

`discoveryState()` is called from `_doRefresh()` as the first option in a three-tier fallback chain:

```javascript
// ============================================
// McpOAuthProvider._doRefresh — metadata fallback chain
// Location: chunks.160.mjs:2592-2602
// ============================================

// ORIGINAL (for source lookup):
let A = ShK(), O = this._metadata;
if (!O) {
    let j = await this.discoveryState();
    if (j?.authorizationServerMetadata) O = j.authorizationServerMetadata;
    else if (j?.authorizationServerUrl) i8(this.serverName, `Re-discovering metadata from persisted auth server URL: ${j.authorizationServerUrl}`), O = await bj6(j.authorizationServerUrl, { fetchFn: A })
}
if (!O) O = await ml8(this.serverName, this.serverConfig.url, this.serverConfig.oauth?.authServerMetadataUrl, A);

// READABLE (for understanding):
const authFetch = createAuthFetch();
let metadata = this._metadata;            // 1. In-memory (same-process refresh)
if (!metadata) {
    const cached = await this.discoveryState();    // 2. config URL (FIRST) → cache (SECOND)
    if (cached?.authorizationServerMetadata) {
        metadata = cached.authorizationServerMetadata;
    } else if (cached?.authorizationServerUrl) {
        // 3. Re-discover via the cached AS URL (RFC 8414 cold)
        logMCPDebug(this.serverName, `Re-discovering metadata from persisted auth server URL: ${cached.authorizationServerUrl}`);
        metadata = await discoverAuthorizationServerMetadata(cached.authorizationServerUrl, { fetchFn: authFetch });
    }
}
if (!metadata) {
    // 4. Full RFC 9728 → 8414 discovery starting from the server URL
    metadata = await fetchAuthServerMetadata(
        this.serverName,
        this.serverConfig.url,
        this.serverConfig.oauth?.authServerMetadataUrl,   // again honored here
        authFetch,
    );
}

// Mapping: A→authFetch, O→metadata, j→cached, bj6→discoverAuthorizationServerMetadata,
//          ml8→fetchAuthServerMetadata
```

The four-tier priority is:
1. **In-memory** `this._metadata` (cached from a prior refresh in the same session).
2. **`discoveryState()`** — which itself now prefers the config URL over the disk cache.
3. **RFC 8414 cold discovery** from the cached AS URL (only when `authorizationServerUrl` is known but not the full metadata).
4. **Full RFC 9728 + 8414** discovery starting from the MCP server URL (the last-resort path that also honors `authServerMetadataUrl`).

The fix in 2.1.105 was specifically at tier 2 — making `discoveryState()` URL-first.

## Why This Approach

**Why the config URL should be authoritative when present:** The user *explicitly* pinned it. By contrast, the cache is a side effect of a prior session — it can be stale, corrupted, or written by an older Claude Code version with a different schema. When the user takes the trouble to set `authServerMetadataUrl`, they're saying "use this URL, period."

**Why not invalidate the cache instead?** Two reasons:
1. **Concurrent sessions** — clearing the cache from one Claude Code instance racing another would be a footgun. Each instance would re-discover. The new approach is per-call: the active instance bypasses its own cache, no shared state to thrash.
2. **Backward compatibility** — older versions that read the cache wouldn't know to invalidate it. Treating the cache as read-only-fallback (when no config URL) means older caches keep working for non-pinned servers.

**Why an early `return;` instead of `if-else if`:** Subtle. If the config URL fetch *throws* (network blip, ADFS down for maintenance), the code logs and then returns `undefined`. That returns control to `_doRefresh` tier 3 (RFC 8414 cold from cached URL) and tier 4 (full discovery). It does **not** fall back to the cached metadata. Why? Because the user pinned a URL — if it's transiently unreachable, the correct behavior is "let the refresh fail this attempt and retry," not "silently use possibly-stale cached metadata that we just deliberately bypassed."

**Edge case: the `scopes` field (also new):** v2.1.112's `McpOAuthConfigSchema` (chunks.18.mjs:1946) added `scopes: y.string().min(1).optional()`. This is consumed at refresh time (`chunks.160.mjs:2408`) via `ul8(this._metadata)` — `getScopesFromMetadata` — but only when the user hasn't pinned `scopes` themselves. The scope handling stayed cache-friendly because scopes are server-static, not user-configurable.

**Why this matters for ADFS specifically:** ADFS exposes its OpenID Connect metadata at a tenant-specific URL like `https://adfs.corp.example.com/adfs/.well-known/openid-configuration`. When the corporate IT team rotates the signing keys or tenant, the metadata file changes content but the URL stays the same. Pre-2.1.105 Claude Code would happily use the months-old cached metadata (and fail with `invalid_grant`); post-2.1.105 it fetches fresh metadata every refresh, paying ~50 ms of network for correctness.

**Trade-off:** Every refresh now does an extra HTTP fetch (config URL → metadata) when previously a refresh hit only the cache. This adds ~50 ms per refresh in the common case (refresh happens at most every ~50 minutes). The added latency is on a background path the user doesn't see, so the cost is invisible. The savings — not silently breaking refresh for the user — is large.

**Key insight:** The fix is a **two-line semantic change** (move the config-URL block above the cache block, add early `return`) that resolves a class of bugs unique to user-pinned-config scenarios. The same pattern appears across many caches: "consult declarative config first, runtime cache second." Whenever the user has expressed an explicit preference, runtime caching should defer to it.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — OAuth refresh and discovery".

Key entities:
- `McpOAuthProvider.discoveryState` (method on the OAuth provider class) - reordered
- `McpOAuthProvider._doRefresh` (method) - four-tier metadata fallback
- `fetchAuthServerMetadata` (`ml8`) - RFC 8414 fetcher honoring config URL
- `discoverAuthorizationServerMetadata` (`bj6`) - cold RFC 8414 from a known AS URL
- `getScopesFromMetadata` (`ul8`) - scopes from cached metadata (used when config doesn't pin them)
- `getSecureStorage` (`t3`) - on-disk token + discovery state
- `getServerKey` (`IX`) - per-server keychain key (`serverName@url`)
- `InvalidGrantError` (`RK6`) - SDK error class that triggers credential invalidation
