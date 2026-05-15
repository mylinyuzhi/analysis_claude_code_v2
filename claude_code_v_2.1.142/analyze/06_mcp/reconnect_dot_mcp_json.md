# `/mcp` Reconnect Picks Up `.mcp.json` Edits Without Restart

**Versions:** 2.1.139 (added)

## Summary

In v2.1.112, when a user edited `.mcp.json` (e.g. to add an `oauth.scopes` field, update a `headersHelper` path, or change a server's `command`/`args`) and then hit `/mcp` → **Reconnect**, the *in-memory* config from session start was used. The edits sat on disk but had no effect until the user restarted Claude Code entirely.

v2.1.139 changes `Reconnect` to *re-parse `.mcp.json` from disk first*. The reconnect now uses the freshest config available; falling back to the cached in-memory config only if the disk read fails or the file no longer contains the server. The reconnect path also gained a small retry: if the server connects but immediately reports `needs-auth`, the **needs-auth cache** is cleared and a single retry is attempted (this catches the "user just fixed `oauth.clientId`, reconnect, but stale needs-auth cache still drops the request").

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.175.mjs` | 1752-1759 | `reconnectMcpServer` callback — uses `V.config` (in-memory) |
| v2.1.112 | `chunks.175.mjs` | 1772-1781 | `toggleMcpServer` (enable branch) — uses `V.config` (in-memory) |
| v2.1.142 | `cli_inner_pretty.js` | **451527-451538** | `reconnectMcpServer` callback — reads `.mcp.json` via `B4H(H).servers[v]` |
| v2.1.142 | `cli_inner_pretty.js` | **451539-451558** | `toggleMcpServer` (enable branch) — also reads `.mcp.json` |
| v2.1.142 | `cli_inner_pretty.js` | 413440-413471 | `reconnectMcpServer` low-level (`hQ`) — clears `needs-auth` cache before retry |
| v2.1.142 | `cli_inner_pretty.js` | 413442 | `kU()` — invalidates credential-storage cache before reconnect |
| v2.1.142 | `cli_inner_pretty.js` | 413444-413448 | `needs-auth` retry once after cache clear |

## The v2.1.112 path (the bug)

```javascript
// ============================================
// reconnectMcpServer (v2.1.112) — uses in-memory config
// Location: chunks.175.mjs:1752-1759
// ============================================

// ORIGINAL (for source lookup):
let G = wZ.useCallback(async (v) => {
    let V = _.getState().mcp.clients.find((R) => R.name === v);
    if (!V) throw Error(`MCP server ${v} not found`);
    let k = O.current.get(v);
    if (k) clearTimeout(k), O.current.delete(v);
    let N = await _g(v, V.config);   // ← uses cached config, ignores .mcp.json edits
    return D(N), N
}, [_, D]);

// READABLE (for understanding):
const reconnectMcpServer = useCallback(async (serverName) => {
    const clientEntry = mcpStore.getState().mcp.clients.find((c) => c.name === serverName);
    if (!clientEntry) throw new Error(`MCP server ${serverName} not found`);

    // Cancel any pending auto-reconnect timer for this server
    const pendingTimer = pendingReconnects.current.get(serverName);
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingReconnects.current.delete(serverName);
    }

    // BUG: V.config is the in-memory snapshot from session start. Disk edits ignored.
    const newClient = await connectOrReconnectMcpClient(serverName, clientEntry.config);
    return (updateMcpStore(newClient), newClient);
}, [mcpStore, updateMcpStore]);

// Mapping: G→reconnectMcpServer, v→serverName, V→clientEntry, _→mcpStore,
//          O→pendingReconnects, k→pendingTimer, _g→connectOrReconnectMcpClient,
//          N→newClient, D→updateMcpStore
```

## The v2.1.142 path (the fix)

```javascript
// ============================================
// reconnectMcpServer (v2.1.142) — reads .mcp.json from disk first
// Location: cli_inner_pretty.js:451527-451538
// ============================================

// ORIGINAL (for source lookup):
let G = OG.useCallback(
    async (v) => {
        let E = q.getState().mcp.clients.find((R) => R.name === v);
        if (!E) throw Error(`MCP server ${v} not found`);
        let I = Y.current.get(v);
        if (I) (clearTimeout(I), Y.current.delete(v));
        let h = H?.[v] ?? ($ ? void 0 : (await B4H(H)).servers[v]) ?? E.config,
            C = await hQ(v, h);
        return (Z(C), C);
    },
    [q, Z, H, $],
);

// READABLE (for understanding):
const reconnectMcpServer = useCallback(async (serverName) => {
    const clientEntry = mcpStore.getState().mcp.clients.find((c) => c.name === serverName);
    if (!clientEntry) throw new Error(`MCP server ${serverName} not found`);

    // Cancel any pending auto-reconnect timer for this server
    const pendingTimer = pendingReconnects.current.get(serverName);
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingReconnects.current.delete(serverName);
    }

    // NEW: three-tier config resolution.
    const resolvedConfig =
        // (1) An override map provided to the hook (e.g. tests, SDK injection).
        overrideConfigMap?.[serverName]
        // (2) Read .mcp.json from disk (unless reconnect-from-edits is disabled).
        ?? (skipDiskReload
            ? undefined
            : (await loadAllMcpServerConfigs(overrideConfigMap)).servers[serverName])
        // (3) Last resort: the stale in-memory config.
        ?? clientEntry.config;

    const newClient = await reconnectMcpServerInternal(serverName, resolvedConfig);
    return (updateMcpStore(newClient), newClient);
}, [mcpStore, updateMcpStore, overrideConfigMap, skipDiskReload]);

// Mapping: G→reconnectMcpServer, v→serverName, q→mcpStore, E→clientEntry,
//          Y→pendingReconnects, I→pendingTimer, H→overrideConfigMap, $→skipDiskReload,
//          h→resolvedConfig, B4H→loadAllMcpServerConfigs, hQ→reconnectMcpServerInternal,
//          C→newClient, Z→updateMcpStore
```

The three-tier priority is deliberate:
1. **Override map first** — when the host (Agent SDK, tests, future plugin hot-reload) wants to substitute a fresh config without writing to disk, the override map wins. This is the path the SDK uses for `reload_plugins`.
2. **Disk re-read** — when no override is supplied and disk reads are allowed (default), `.mcp.json` (and merged user/project/local config files) get re-parsed. This is the main new path.
3. **In-memory fallback** — if the server isn't found on disk *and* there's no override, the cached in-memory config is used. This handles a server defined in `.claude.json` (user scope) that was removed from `.mcp.json` between session start and now: the user-scope config still applies.

## The low-level reconnect: clears the needs-auth cache

```javascript
// ============================================
// reconnectMcpServerInternal - low-level reconnect with needs-auth retry
// Location: cli_inner_pretty.js:413440-413471
// ============================================

// ORIGINAL (for source lookup):
async function hQ(H, $) {
  try {
    (kU(), await fN(H, $));
    let q = await Ey(H, $);
    if (q.type === "needs-auth") {
      H8(H, "Reconnect returned 'needs-auth'; retrying once after cache clear");
      let M = UrH(H, $);
      (Ey.cache?.delete?.(M), (q = await Ey(H, $)));
    }
    if (q.type !== "connected")
      return (J8("mcp_reconnect", "mcp_reconnect_not_connected"), { client: q, tools: [], commands: [] });
    if ((p$4(H), $.type === "http" || $.type === "sse")) await gI6(H, $);
    if ($.type === "claudeai-proxy") KG6(H);
    let K = !!q.capabilities?.resources,
      [_, A, z, Y] = await Promise.all([WB(q), n9H(q), Promise.resolve([]), K ? Hn(q) : Promise.resolve([])]),
      f = [...A, ...z],
      O = [];
    if (K) {
      if (![j7H, E9H].some((w) => _.some((D) => G1(D, w.name)))) O.push(j7H, E9H);
    }
    return (
      RH("mcp_reconnect"),
      { client: q, tools: [..._, ...O], commands: f, resources: Y.length > 0 ? Y : void 0, resourceTemplates: [] }
    );
  } catch (q) {
    return (
      uH("mcp_reconnect", "mcp_reconnect_failed"),
      $5(H, `Error during reconnection: ${ZH(q)}`),
      { client: { name: H, type: "failed", config: $ }, tools: [], commands: [] }
    );
  }
}

// READABLE (for understanding):
async function reconnectMcpServerInternal(serverName, freshConfig) {
    try {
        // Step 1: invalidate caches that might mask the new config.
        invalidateCredentialStorageCache();              // ← kU() — re-read keychain on next access
        await disconnectMcpClient(serverName, freshConfig);

        // Step 2: attempt a fresh connect with the new config.
        let clientState = await ensureConnectedMcpClient(serverName, freshConfig);

        // Step 3: needs-auth retry — clear the needs-auth cache and try once more.
        // This catches "user just updated oauth config, reconnect, but stale needs-auth
        // cache (from session-start) is still gating us off."
        if (clientState.type === "needs-auth") {
            logMCPDebug(serverName, "Reconnect returned 'needs-auth'; retrying once after cache clear");
            const cacheKey = mcpClientCacheKey(serverName, freshConfig);
            ensureConnectedMcpClient.cache?.delete?.(cacheKey);
            clientState = await ensureConnectedMcpClient(serverName, freshConfig);
        }

        if (clientState.type !== "connected") {
            logTelemetry("mcp_reconnect", "mcp_reconnect_not_connected");
            return { client: clientState, tools: [], commands: [] };
        }

        // Side effects on success: clear needs-auth tracking, schedule SSE reconnect, etc.
        clearNeedsAuthCache(serverName);
        if (freshConfig.type === "http" || freshConfig.type === "sse") {
            await scheduleServerEventStreamReconnect(serverName, freshConfig);
        }
        if (freshConfig.type === "claudeai-proxy") subscribeToClaudeAiServerEvents(serverName);

        // Gather tools, commands, and (if supported) resources.
        const hasResources = !!clientState.capabilities?.resources;
        const [tools, commands, _ignored, resources] = await Promise.all([
            fetchToolsForClient(clientState),
            fetchCommandsForClient(clientState),
            Promise.resolve([]),
            hasResources ? fetchResourcesForClient(clientState) : Promise.resolve([]),
        ]);
        const combinedCommands = [...commands, ..._ignored];

        // If the server advertises resources but didn't include the resource-management
        // tools, inject them so the user can still invoke @-completion etc.
        const supplementalTools = [];
        if (hasResources) {
            const builtinResourceTools = [LIST_RESOURCES_TOOL, GET_RESOURCE_TOOL];
            if (!builtinResourceTools.some((bt) => tools.some((t) => sameToolName(t, bt.name)))) {
                supplementalTools.push(...builtinResourceTools);
            }
        }

        logSuccess("mcp_reconnect");
        return {
            client: clientState,
            tools: [...tools, ...supplementalTools],
            commands: combinedCommands,
            resources: resources.length > 0 ? resources : undefined,
            resourceTemplates: [],
        };
    } catch (error) {
        logTelemetry("mcp_reconnect", "mcp_reconnect_failed");
        logMCPError(serverName, `Error during reconnection: ${errorMessage(error)}`);
        return { client: { name: serverName, type: "failed", config: freshConfig }, tools: [], commands: [] };
    }
}

// Mapping: hQ→reconnectMcpServerInternal, H→serverName, $→freshConfig,
//          kU→invalidateCredentialStorageCache, fN→disconnectMcpClient,
//          Ey→ensureConnectedMcpClient, UrH→mcpClientCacheKey,
//          q→clientState, p$4→clearNeedsAuthCache,
//          gI6→scheduleServerEventStreamReconnect, KG6→subscribeToClaudeAiServerEvents,
//          WB→fetchToolsForClient, n9H→fetchCommandsForClient, Hn→fetchResourcesForClient,
//          j7H/E9H→LIST_RESOURCES_TOOL/GET_RESOURCE_TOOL, G1→sameToolName,
//          ZH→errorMessage, $5→logMCPError, RH→logSuccess, uH→logFailure, J8→logTelemetry
```

## What does "show the HTTP status and URL when reconnecting fails" mean

The changelog mentions a second improvement: when `Reconnect` fails for an HTTP/SSE server, the displayed error now includes the HTTP status and the URL (not just a generic "failed"). This surfaces in the menu via the `formatReconnectResult` (`Nj8`) function at line 451806-451826:

```javascript
case "failed": {
    let K = kj8(H.client);           // ← extract HTTP status / URL from client.error
    return { message: K ? `Failed to reconnect to ${$}: ${K}` : `Failed to reconnect to ${$}.`, success: !1 };
}
```

`kj8` formats the underlying transport error: `"HTTP 401 at https://api.example.com/mcp"` rather than just `"Failed to reconnect to my-server"`.

## Why This Approach

### Why three tiers and not just "always read disk"

The override map matters for tests and SDK injection — they may supply ephemeral configs that are not (yet) persisted to disk. Reading disk would clobber them. The fallback to `clientEntry.config` matters for servers that aren't in any `.mcp.json` file (claude.ai connectors, plugin-supplied servers): the disk read would return undefined for those, and the in-memory copy is still the right thing to use.

### Why clear the needs-auth cache and retry once

The needs-auth cache (`Ey.cache`) is keyed on `(serverName, configHash)`. If the user fixed an OAuth client_id mismatch (the most common reason for a server to be stuck in needs-auth), the *config hash* changes — so the cache miss naturally happens. But if the user fixed a different layer (e.g. their `headersHelper` script now returns valid tokens), the config hash is the same, and the cached `needs-auth` result would otherwise mask the now-working credentials. The explicit cache-delete-and-retry handles that case.

### Why `kU()` (invalidate credential storage)

`kU` invalidates the in-memory cache of the keychain/credential file. If the user's external tooling (a separate `claude oauth login` invocation, a manual `keychain` update) refreshed the token, Claude Code's in-memory copy would still be stale. Calling `kU` before reconnect forces the next keychain access to actually read the file.

### Trade-off: extra disk I/O on every reconnect

Reading `.mcp.json` (potentially several config files merged) costs a few milliseconds and dozens of stat syscalls. Reconnect is user-initiated (rare), so the cost is negligible compared to user-visible value of "config edits take effect now."

### Edge case: the server was removed from `.mcp.json`

If the user deleted the server entry, `(await loadAllMcpServerConfigs(...)).servers[name]` returns `undefined`, the chain falls through to `clientEntry.config`, and the reconnect attempt uses the stale in-memory config. The connect *succeeds* (because the binary/URL is still valid) but the server is now "orphan" — if the user later restarts Claude Code, the server will not appear in the config and won't be loaded. That's a transitional state: the user explicitly removed the entry; not loading it on restart is the desired behavior. Until restart, the user can still use the connected server's tools because the in-memory state survives.

### Key insight

The reconnect path went from "use the cached config" (which makes `Reconnect` semantically identical to "disconnect + connect with the same config") to "load the freshest config you can find before reconnecting" (which makes `Reconnect` semantically "apply config changes now"). That's a meaningful UX shift: `Reconnect` is now the way to apply `.mcp.json` edits.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — Reconnect & Config Reload".

Key entities:
- `reconnectMcpServer` (useCallback at cli_inner_pretty.js:451527-451538) — the high-level reconnect hook
- `toggleMcpServer` (useCallback at cli_inner_pretty.js:451539-451558) — disables/enables, reads disk on re-enable
- `reconnectMcpServerInternal` (`hQ`, cli_inner_pretty.js:413440-413471) — low-level with needs-auth retry
- `loadAllMcpServerConfigs` (`B4H`) — merges `.mcp.json` + user/project/enterprise configs
- `invalidateCredentialStorageCache` (`kU`, cli_inner_pretty.js:91522-91524)
- `disconnectMcpClient` (`fN`, cli_inner_pretty.js:413385-413394)
- `mcpClientCacheKey` (`UrH`)
- `ensureConnectedMcpClient` (`Ey`) — memoized
- `formatReconnectResult` (`Nj8`, cli_inner_pretty.js:451806-451826) — now surfaces HTTP status
- `formatTransportError` (`kj8`, cli_inner_pretty.js:451797-451804) — extracts status + URL
