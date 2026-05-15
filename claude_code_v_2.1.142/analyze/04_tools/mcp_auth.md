# McpAuth — MCP OAuth Pseudo-Tool for `needs-auth` Servers

> **Tool name:** `mcp__<server>__authenticate` (one per needs-auth server)
> **Source:** factory `createMcpAuthTool` (2.1.88 TypeScript: `src/tools/McpAuthTool/McpAuthTool.ts`); v2.1.142 bundle inlines the factory
> **Search hint:** *start OAuth flow for an unauthenticated MCP server*
> **Concurrency-safe:** false · **Read-only:** false

---

## Overview

`McpAuth` is a **pseudo-tool**: it's not a static built-in; it's *dynamically* generated for each MCP server that's installed but in `needs-auth` state. When the runtime detects a server that authenticates via OAuth (HTTP/SSE transport) and has no valid token, it surfaces this pseudo-tool *in place of the server's real tools*, named `mcp__<server>__authenticate`.

The model sees the pseudo-tool, calls it, and receives back an authorization URL it can share with the user. Once the user completes OAuth in their browser, the OAuth callback fires, the server reconnects, and the **real** tools swap in (the pseudo-tool is removed automatically because it shares the `mcp__<server>__` prefix).

---

## Schema

```javascript
// ============================================
// mcpAuthInputSchema - empty object
// Location: McpAuthTool factory (lazySchema z.object({}))
// ============================================

// ORIGINAL (for source lookup):
const inputSchema = lazySchema(() => z.object({}));

// READABLE (for understanding):
const mcpAuthInputSchema = lazySchema(() => z.object({}));

// Mapping: inputSchema→mcpAuthInputSchema (already in canonical form)
```

Empty input — the tool name itself (`mcp__<server>__authenticate`) is enough context; no arguments are needed.

---

## Key Behavior

### Per-server description carries the server identity

```typescript
// Built at factory time:
const description =
  `The \`${serverName}\` MCP server (${location}) is installed but requires authentication. ` +
  `Call this tool to start the OAuth flow — you'll receive an authorization URL to share with the user. ` +
  `Once the user completes authorization in their browser, the server's real tools will become available automatically.`;
```

The model sees a distinct description per server (`location` = `${transport} at ${url}` for HTTP/SSE), making it clear which server it's authenticating.

### Three transport branches

```typescript
// claude.ai connectors — refer user to /mcp.
if (config.type === "claudeai-proxy") {
  return { data: { status: "unsupported", message: `This is a claude.ai MCP connector. Ask the user to run /mcp and select "${serverName}" to authenticate.` } };
}

// Non-OAuth transports — refer to /mcp.
if (config.type !== "sse" && config.type !== "http") {
  return { data: { status: "unsupported", message: `Server "${serverName}" uses ${transport} transport which does not support OAuth from this tool. ...` } };
}

// HTTP/SSE — actually run performMCPOAuthFlow with skipBrowserOpen.
```

### Race between authUrlPromise and oauthPromise

```typescript
const oauthPromise = performMCPOAuthFlow(
  serverName,
  config,
  (url) => resolveAuthUrl?.(url),     // callback fires when AS replies with auth URL
  controller.signal,
  { skipBrowserOpen: true },           // tool doesn't open a browser — model shares the URL
);

// Race: get the URL, or the flow completes without needing one (cached IdP token → silent auth).
const authUrl = await Promise.race([
  authUrlPromise,
  oauthPromise.then(() => null),
]);
```

If the AS returns an auth URL, the tool returns it to the model immediately and the OAuth flow continues in the background. If the AS handles the request silently (e.g., cached IdP token), the tool returns "Authentication completed silently" with no URL.

### Background continuation rewires `appState.mcp`

```typescript
void oauthPromise.then(async () => {
  clearMcpAuthCache();
  const result = await reconnectMcpServerImpl(serverName, config);
  const prefix = getMcpPrefix(serverName);
  setAppState((prev) => ({
    ...prev,
    mcp: {
      ...prev.mcp,
      clients: prev.mcp.clients.map((c) => c.name === serverName ? result.client : c),
      tools: [
        ...reject(prev.mcp.tools, (t) => t.name?.startsWith(prefix)),   // removes pseudo-tool
        ...result.tools,                                                  // adds real tools
      ],
      commands: [...reject(prev.mcp.commands, (c) => c.name?.startsWith(prefix)), ...result.commands],
      resources: result.resources ? { ...prev.mcp.resources, [serverName]: result.resources } : prev.mcp.resources,
    },
  }));
});
```

### v2.1.121 `redirectUri` extension

The SDK API path adds optional `redirectUri`:

```javascript
// ============================================
// SDK mcpAuthenticate - v2.1.121 added redirectUri parameter
// Location: cli_inner_pretty.js:499132-499134
// ============================================

// ORIGINAL (for source lookup):
async mcpAuthenticate(H, $) {
  return (await this.request({ subtype: "mcp_authenticate", serverName: H, redirectUri: $ })).response;
}

// READABLE (for understanding):
async mcpAuthenticate(serverName, redirectUri) {
  // v2.1.121: redirectUri can be a custom scheme (e.g. "myapp://callback") for
  // claude.ai connectors and apps that handle browser callbacks via URL schemes.
  // If the AS rejects the custom URI, the runtime logs "AS rejected custom
  // redirectUri ... falling back to localhost" and retries with the default.
  const { response } = await this.request({
    subtype: "mcp_authenticate",
    serverName,
    redirectUri,
  });
  return response;
}
```

The bundled handler (cli_inner_pretty.js:602774) logs:
```
[mcp_authenticate] AS rejected custom redirectUri for ${s}; falling back to localhost: ${error}
```

so the SDK caller knows when their custom URI was rejected and the fallback was used.

---

## Key Insights

**Why a pseudo-tool instead of a permission prompt?**
- Permission prompts interrupt the model's flow with a UX modal.
- A tool lets the model decide: it can call the auth tool when needed (and *only* when it actually wants to use the server) instead of consuming a permission grant up front.
- Pseudo-tools are also visible in the tool list, making auth status discoverable just by looking at what tools are available.

**Why share the `mcp__<server>__` prefix with real tools?**
- The reconnect step blindly strips everything starting with that prefix and re-adds the new set. No special-case "remove pseudo-tool, then add real tools" code is needed.
- The prefix is also load-bearing for tool name validation across the wire: all MCP-served tools have the same prefix shape.

**`skipBrowserOpen: true`** is the critical flag for this tool path. The default OAuth flow opens the user's browser via `xdg-open`/`open` — that's wrong when the model is the one initiating: the user may not even be at the device. Skipping the browser open lets the model surface the URL in chat (or via PushNotification) where the user can click it from any device.

**Why `isConcurrencySafe: false`?** Two concurrent auth flows on the same server would race on token storage. Serializing through the registry ensures one flow finishes (success or fail) before another starts.

**Background reconnect uses lodash `reject`** because the tool list is an array, not a Set — filtering by prefix is the natural operation. The `mcp` slice update is a single immutable rewrite.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.121:** SDK `mcp_authenticate` now supports `redirectUri` for custom-scheme completion and claude.ai connectors. The handler logs the AS rejection and falls back to localhost so the SDK caller can recover.
- **v2.1.137:** Fixed MCP HTTP/SSE servers returning 403 on connect showing as "failed" instead of "needs auth" — so the McpAuth pseudo-tool now surfaces correctly for 403-rejected servers.
- **v2.1.118:** MCP step-up auth fixes; OAuth refresh proceeding without cross-process lock under contention.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — MCP*

Key functions in this document:
- `createMcpAuthTool` — factory that builds the per-server pseudo-tool
- `sdkMcpAuthenticate` — SDK API entry (v2.1.121 added `redirectUri`)
- `performMCPOAuthFlow` — OAuth runner; supports `skipBrowserOpen`
- `clearMcpAuthCache` — invalidate auth-state cache after token grant
- `reconnectMcpServerImpl` — rebuilds the MCP client with the new token
- `buildMcpToolName` — `mcp__<server>__<tool>` constructor
- `getMcpPrefix` — `mcp__<server>__` prefix builder
- `OAUTH_REDIRECT_URI_KEY` (`Gc9` and `Chq` in distinct namespaces) — the canonical redirect-URI parameter name in OAuth requests
