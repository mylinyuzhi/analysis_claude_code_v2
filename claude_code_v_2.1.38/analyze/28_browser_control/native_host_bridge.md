# Native Host Bridge - Chrome Browser Control (Claude Code 2.1.38)

> Analysis of the Chrome/browser control architecture, native host bridge protocol (stdio/native-messaging),
> message format, browser automation capabilities, and security model.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getChromeMcpConfig` (HBA) - Builds the MCP server config for the Claude-in-Chrome bridge
- `installNativeHostManifest` (bHq) - Installs the native messaging host manifest to browser-specific directories
- `createNativeHostWrapper` (uHq) - Creates the wrapper shell script that Chrome launches via native messaging
- `detectChromeExtension` (Ec) - Checks if the Claude Code Chrome extension is installed
- `isExtensionInstalled` (WKz) - Cached check for extension presence
- `ChromeOnboarding` (VKz) - React UI component for the Chrome extension setup flow
- `registerWindowsNativeHost` (PKz) - Registers the native host in the Windows registry
- `getNativeHostPaths` (MKz / fn4) - Returns platform-specific paths for native host manifest
- `NATIVE_HOST_NAME` (wBA) - Constant: `"com.anthropic.claude_code_browser_extension"`
- `CHROME_EXTENSION_ID` - The hardcoded Chrome extension ID: `fcoeoabgfenejglbffodgkkbkcdhcgfn`

Bridge client functions (chunks.165.mjs):
- `connect` - Establishes WebSocket connection to the cloud bridge
- `handleMessage` - Routes incoming bridge messages by type
- `callTool` - Sends a tool_call to the Chrome extension and awaits the result
- `handleToolResult` - Resolves pending tool call promises on response
- `handlePermissionRequest` - Forwards extension permission prompts to the MCP permission handler
- `discoverAndSelectExtension` - Auto-selects a Chrome extension when multiple are available
- `switchBrowser` - Switches to a different connected Chrome extension
- `broadcastPairingRequest` - Sends a pairing request to discover extensions

---

## Overview

Claude Code's "Claude in Chrome" feature enables the LLM to control a real web browser through a
multi-layered bridge architecture:

```
┌──────────────┐     stdio/MCP      ┌──────────────┐    WebSocket     ┌──────────────┐
│ Claude Code   │◀──────────────────▶│ MCP Server    │◀────────────────▶│ Cloud Bridge  │
│ (main process)│                    │ (child proc)  │                  │ (relay)       │
└──────────────┘                    └──────────────┘                  └──────┬───────┘
                                                                            │ WebSocket
                                                                     ┌──────▼───────┐
                                                                     │ Chrome Ext.   │
                                                                     │ (browser)     │
                                                                     └──────────────┘
```

The system uses Chrome's **Native Messaging** protocol to bootstrap the connection, then switches
to a **WebSocket-based cloud bridge** for actual tool communication.

---

## Architecture: Three-Layer Communication

### Layer 1: Claude Code to MCP Server (stdio)

Claude Code spawns the Chrome MCP server as a child process using the standard MCP stdio transport:

```javascript
// ============================================
// getChromeMcpConfig - Build MCP config for Chrome bridge
// Location: chunks.166.mjs:1351-1394
// ============================================

// ORIGINAL (for source lookup):
function HBA() {
    let A = D9(), q = Qe.map((z) => `mcp__claude-in-chrome__${z.name}`), K = {};
    if (HQ()) K.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
    let Y = Object.keys(K).length > 0;
    if (A) {
        let z = `"${process.execPath}" --chrome-native-host`;
        return uHq(z).then((w) => bHq(w)), {
            mcpConfig: {
                [qy]: {
                    type: "stdio",
                    command: process.execPath,
                    args: ["--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...Y && { env: K }
                }
            },
            allowedTools: q,
            systemPrompt: YBA()
        }
    } else {
        // Fallback: use cli.js path instead of process.execPath
        let z = DKz(import.meta.url), w = vc(z, ".."), H = vc(w, "cli.js");
        return uHq(`"${process.execPath}" "${H}" --chrome-native-host`).then((O) => bHq(O)), {
            mcpConfig: { [qy]: { type: "stdio", command: process.execPath,
                                   args: [`${H}`, "--claude-in-chrome-mcp"], scope: "dynamic", ...Y && { env: K } } },
            allowedTools: q, systemPrompt: YBA()
        }
    }
}

// READABLE (for understanding):
function getChromeMcpConfig() {
    let isBundled = isBundledBinary();
    let allowedTools = CHROME_TOOLS.map(t => `mcp__claude-in-chrome__${t.name}`);
    let env = {};
    if (isChromePermissionSkipEnabled()) env.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";

    // Side effect: install native host manifest in background
    let nativeHostCommand = `"${process.execPath}" --chrome-native-host`;
    createNativeHostWrapper(nativeHostCommand).then(wrapperPath => installNativeHostManifest(wrapperPath));

    return {
        mcpConfig: {
            "claude-in-chrome": {
                type: "stdio",
                command: process.execPath,
                args: ["--claude-in-chrome-mcp"],
                scope: "dynamic",
                ...(Object.keys(env).length > 0 && { env })
            }
        },
        allowedTools,
        systemPrompt: getChromeSystemPrompt()
    };
}

// Mapping: HBA→getChromeMcpConfig, D9→isBundledBinary, Qe→CHROME_TOOLS,
//   HQ→isChromePermissionSkipEnabled, uHq→createNativeHostWrapper, bHq→installNativeHostManifest,
//   qy→"claude-in-chrome" server name, YBA→getChromeSystemPrompt
```

**How it works:**
1. The MCP config tells Claude Code to spawn itself with `--claude-in-chrome-mcp` flag
2. This starts an MCP server that connects to the cloud bridge via WebSocket
3. The server exposes Chrome automation tools via the standard MCP tool protocol
4. As a side effect, the native host manifest is installed for Chrome's native messaging

**Why spawn itself?** Using `process.execPath` with a special flag means:
- No separate binary needs to be installed
- The MCP server shares the same codebase and dependencies
- Updates are automatic when Claude Code updates

### Layer 2: MCP Server to Cloud Bridge (WebSocket)

The bridge client connects to Anthropic's cloud relay service:

```javascript
// ============================================
// connect - Establish WebSocket connection to cloud bridge
// Location: chunks.165.mjs:2274-2340
// ============================================

// ORIGINAL (for source lookup):
async connect() {
    let { logger: A, serverName: q, bridgeConfig: K, trackEvent: Y } = this.context;
    if (!K) { A.error(`[${q}] No bridge config provided`); return }
    if (this.connecting) return;
    this.connecting = !0; this.authenticated = !1; this.connectionStartTime = Date.now();
    let z, w;
    if (K.devUserId) z = K.devUserId;
    else {
        let $ = await K.getUserId();
        if (!$) { /* handle no user ID */ return }
        z = $;
        w = await K.getOAuthToken();
        if (!w) { /* handle no token */ return }
    }
    let H = `${K.url}/chrome/${z}`;
    this.ws = new mt(H);
    this.ws.on("open", () => {
        let $ = { type: "connect", client_type: this.context.clientTypeId };
        if (K.devUserId) $.dev_user_id = K.devUserId;
        else $.oauth_token = w;
        this.ws?.send(JSON.stringify($))
    });
    // ... message, close, error handlers ...
}

// READABLE (for understanding):
async connect() {
    let { bridgeConfig } = this.context;
    if (this.connecting) return;
    this.connecting = true;

    // Authenticate: get user ID and OAuth token
    let userId = bridgeConfig.devUserId ?? await bridgeConfig.getUserId();
    let oauthToken = bridgeConfig.devUserId ? null : await bridgeConfig.getOAuthToken();

    // Connect WebSocket to bridge URL
    let bridgeUrl = `${bridgeConfig.url}/chrome/${userId}`;
    this.ws = new WebSocket(bridgeUrl);

    this.ws.on("open", () => {
        // Send authentication message
        this.ws.send(JSON.stringify({
            type: "connect",
            client_type: "claude-code",
            oauth_token: oauthToken  // or dev_user_id for dev mode
        }));
    });
}
```

**Authentication flow:**
1. Get user ID from Anthropic account
2. Get OAuth token for bridge authentication
3. Connect WebSocket to `{bridgeUrl}/chrome/{userId}`
4. Send `connect` message with OAuth token on open
5. Bridge responds with `paired` or `waiting` status

### Layer 3: Cloud Bridge to Chrome Extension (WebSocket)

The cloud bridge acts as a relay between the MCP server and the Chrome extension. Both connect to the same bridge URL using their respective credentials. The bridge routes messages between them based on device IDs.

---

## Native Messaging Host Installation

### How Chrome Native Messaging Works

Chrome's native messaging protocol allows extensions to communicate with local applications via stdio:

1. Extension sends a message to a registered native host
2. Chrome looks up the host by name in its native messaging manifest directory
3. Chrome launches the executable specified in the manifest
4. Communication happens over stdin/stdout with length-prefixed JSON messages

### installNativeHostManifest (bHq)

```javascript
// ============================================
// installNativeHostManifest - Install manifest for Chrome native messaging
// Location: chunks.166.mjs:1407-1438
// ============================================

// ORIGINAL (for source lookup):
async function bHq(A) {
    let q = MKz();
    if (q.length === 0) throw Error("Claude in Chrome Native Host not supported on this platform");
    let K = {
        name: wBA,
        description: "Claude Code Browser Extension Native Host",
        path: A,
        type: "stdio",
        allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/", ...[]]
    }, Y = Q1(K, null, 2), z = !1;
    for (let w of q) {
        let H = vc(w, xHq);
        if (await mHq(H, "utf-8").catch(() => null) === Y) continue;
        try {
            await BHq(w, { recursive: !0 }), await FHq(H, Y);
            h(`[Claude in Chrome] Installed native host manifest at: ${H}`);
            z = !0;
        } catch (O) { h(`[Claude in Chrome] Failed to install manifest at ${H}: ${O}`) }
    }
    if (eA() === "windows") { let w = vc(q[0], xHq); PKz(w) }
    if (z) Ec().then((w) => {
        if (w) h("[Claude in Chrome] First-time install detected, opening reconnect page");
        else h("[Claude in Chrome] First-time install detected, but extension not installed");
    })
}

// READABLE (for understanding):
async function installNativeHostManifest(wrapperScriptPath) {
    let manifestDirs = getNativeHostPaths();
    let manifest = {
        name: "com.anthropic.claude_code_browser_extension",
        description: "Claude Code Browser Extension Native Host",
        path: wrapperScriptPath,
        type: "stdio",
        allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/"]
    };
    let manifestJson = JSON.stringify(manifest, null, 2);
    let installed = false;

    for (let dir of manifestDirs) {
        let manifestFile = join(dir, MANIFEST_FILENAME);
        if (await readFile(manifestFile).catch(() => null) === manifestJson) continue;  // Already up to date
        try {
            await mkdir(dir, { recursive: true });
            await writeFile(manifestFile, manifestJson);
            installed = true;
        } catch (err) { /* log and continue */ }
    }

    if (platform() === "windows") registerWindowsNativeHost(join(manifestDirs[0], MANIFEST_FILENAME));
    if (installed) {
        // Trigger reconnect if extension is already installed
        detectChromeExtension().then(extensionExists => {
            if (extensionExists) openBrowser("https://clau.de/chrome/reconnect");
        });
    }
}

// Mapping: bHq→installNativeHostManifest, wBA→NATIVE_HOST_NAME, xHq→MANIFEST_FILENAME,
//   MKz→getNativeHostPaths, PKz→registerWindowsNativeHost, Ec→detectChromeExtension
```

**Platform-specific manifest paths:**
- **macOS**: `~/Library/Application Support/Claude Code/ChromeNativeHost/`
- **Linux**: Standard XDG paths for native messaging hosts
- **Windows**: `%APPDATA%/Claude Code/ChromeNativeHost/` + Windows Registry registration

**Why the wrapper script?** The native host manifest `path` must point to an executable. Instead of pointing directly to the Node.js binary, a wrapper script is created:

```bash
#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec "/path/to/claude" --chrome-native-host
```

This wrapper ensures the correct arguments are passed and allows the path to be updated without re-registering with Chrome.

---

## Bridge Message Protocol

### Message Types (Client to Bridge)

| Type | Purpose | Key Fields |
|------|---------|------------|
| `connect` | Authenticate with bridge | `oauth_token`, `client_type` |
| `tool_call` | Execute a tool on the extension | `tool_use_id`, `tool`, `args`, `target_device_id` |
| `permission_response` | Reply to extension permission request | `request_id`, `allowed` |
| `list_extensions` | Query connected extensions | - |
| `pairing_request` | Request to pair with an extension | `request_id`, `client_type` |
| `pong` | Heartbeat response | - |

### Message Types (Bridge to Client)

| Type | Purpose | Key Fields |
|------|---------|------------|
| `paired` | Authentication succeeded, extension connected | - |
| `waiting` | Authenticated but no extension connected yet | - |
| `peer_connected` | An extension connected to the bridge | `deviceId` |
| `peer_disconnected` | An extension disconnected | `deviceId` |
| `tool_result` | Result of a tool call | `tool_use_id`, `result` or `error`, `content` |
| `permission_request` | Extension requesting user permission | `tool_use_id`, `request_id`, `tool_type`, `url` |
| `extensions_list` | Response to list_extensions | `extensions[]` |
| `pairing_response` | Result of pairing request | `request_id`, `device_id`, `name` |
| `ping` | Heartbeat | - |
| `error` | Bridge-level error | `error` |
| `notification` | Extension notification (e.g., page events) | `method`, `params` |

### Tool Call Flow

```
Claude Code          MCP Server           Bridge              Chrome Ext.
    │                    │                   │                     │
    │  tool_use          │                   │                     │
    │───────────────────▶│                   │                     │
    │                    │  tool_call         │                     │
    │                    │──────────────────▶│                     │
    │                    │                   │  tool_call           │
    │                    │                   │────────────────────▶│
    │                    │                   │                     │ execute
    │                    │                   │  tool_result         │
    │                    │                   │◀────────────────────│
    │                    │  tool_result       │                     │
    │                    │◀──────────────────│                     │
    │  tool_result       │                   │                     │
    │◀───────────────────│                   │                     │
```

**Timeout handling:**
- `tabs_context_mcp` calls have a special (longer) timeout for collecting tab data from multiple extensions
- All other tool calls have a standard timeout (configured on the bridge client)
- On timeout, pending calls are cleaned up and an error is returned

---

## Browser Automation Capabilities

The Chrome MCP server exposes these tools (defined in `Qe`, chunks.166.mjs):

### javascript_tool
Execute arbitrary JavaScript in the page context. Runs in the page's DOM environment.

### read_page
Get an accessibility tree representation of the page. Supports filtering (interactive-only vs. all), depth limits, and focusing on specific elements by reference ID.

### find
Natural language element search. Returns up to 20 matching elements with reference IDs.

### form_input
Set values in form elements using reference IDs from read_page.

### computer
Mouse and keyboard automation: click, type, screenshot, scroll, drag, zoom, hover. This is the primary tool for visual interaction.

### navigate
URL navigation, forward/back history.

### resize_window
Set browser window dimensions for responsive testing.

### gif_creator
Record browser actions and export as animated GIF with visual overlays.

### tabs_context_mcp
Get information about all open tabs. This is the entry point for any tab-based operation.

---

## Security Model

### Permission Modes

The Chrome bridge supports configurable permission modes:

1. **Default**: All tool calls require permission via the MCP permission system
2. **`skip_all_permission_checks`**: Set via `CLAUDE_CHROME_PERMISSION_MODE` env var, bypasses all permission prompts

### Allowed Origins

The native messaging manifest restricts which Chrome extensions can use the native host:

```json
{
    "allowed_origins": ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/"]
}
```

Only the official Claude Code Chrome extension (hardcoded ID) is allowed.

### Domain Restrictions

Tool calls can include `allowed_domains` to restrict which domains the extension operates on:
```javascript
if (X?.length) P.allowed_domains = X;
```

### In-Extension Permission Prompts

The extension can forward permission requests back to Claude Code:

```javascript
// Extension asks: "Can I navigate to evil.com?"
// Bridge forwards: { type: "permission_request", url: "evil.com", ... }
// MCP server decides and responds: { type: "permission_response", allowed: true/false }
```

**Why this bidirectional permission model?** The Chrome extension operates in a sensitive context (user's browser with cookies, session data). Rather than trusting the LLM completely, the extension can require explicit permission for sensitive operations like navigating to new domains. The permission decision is routed back through the MCP permission system, which can consult the user or apply policy rules.

### OAuth Authentication

The bridge connection requires:
1. A valid Anthropic user ID
2. A valid OAuth token from the Anthropic authentication system

This prevents unauthorized access to the bridge relay. Each user connects to their own channel (`/chrome/{userId}`).

---

## Extension Discovery and Pairing

### Auto-Discovery Algorithm

When the bridge client needs to select a Chrome extension:

1. Query bridge for connected extensions via `list_extensions`
2. If no extensions found, wait up to `fHq` ms (configurable) for `peer_connected`
3. After waiting, re-query if a peer connected
4. **Single extension**: Auto-select (with remote extension warning if not local)
5. **Multiple extensions**: Check for persisted device ID from previous session
6. **No persisted match**: Broadcast pairing request and wait for user selection in extension

```javascript
// ============================================
// discoverAndSelectExtension - Auto-select Chrome extension
// Location: chunks.165.mjs:2174-2201
// ============================================

// ORIGINAL (for source lookup):
async discoverAndSelectExtension() {
    this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();
    let K = await this.queryBridgeExtensions();
    if (K.length === 0) {
        if (await this.waitForPeerConnected(fHq)) K = await this.queryBridgeExtensions()
    }
    this.discoveryComplete = !0;
    if (K.length === 0) return;
    if (K.length === 1) {
        let Y = K[0];
        if (!this.isLocalExtension(Y)) this.context.onRemoteExtensionWarning?.(Y);
        this.selectExtension(Y.deviceId); return
    }
    if (this.persistedDeviceId) {
        let Y = K.find((z) => z.deviceId === this.persistedDeviceId);
        if (Y) { this.selectExtension(Y.deviceId); return }
    }
}

// READABLE (for understanding):
async discoverAndSelectExtension() {
    this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();
    let extensions = await this.queryBridgeExtensions();
    if (extensions.length === 0) {
        // Wait for an extension to connect
        if (await this.waitForPeerConnected(WAIT_TIMEOUT)) {
            extensions = await this.queryBridgeExtensions();
        }
    }
    this.discoveryComplete = true;
    if (extensions.length === 0) return;  // No extensions available

    if (extensions.length === 1) {
        if (!this.isLocalExtension(extensions[0]))
            this.context.onRemoteExtensionWarning?.(extensions[0]);
        this.selectExtension(extensions[0].deviceId);
        return;
    }

    // Multiple extensions: try persisted selection
    if (this.persistedDeviceId) {
        let match = extensions.find(e => e.deviceId === this.persistedDeviceId);
        if (match) { this.selectExtension(match.deviceId); return; }
    }
    // Otherwise: broadcast pairing request for user selection
}
```

**Remote extension warning:** If the auto-selected extension is on a different platform (`osPlatform` mismatch), the user is warned. This detects cases where a remote machine's Claude Code accidentally connects to a local browser.

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| Cloud bridge relay (not direct) | Works across network boundaries; Chrome extensions cannot listen on sockets |
| Self-spawning MCP server | No separate installation; automatic updates |
| Native messaging as bootstrap | Reliable cross-platform mechanism for extension-to-host discovery |
| OAuth-authenticated bridge | Prevents unauthorized access to user's browser |
| Bidirectional permission prompts | Extension can request permission for sensitive operations |
| Wrapper script for native host | Decouples binary path from Chrome registration |
| Persisted device ID | Seamless reconnection to previously used extension |
| Platform-based remote detection | Warns about cross-machine browser control |
| Tabs context collection timeout | Allows time for multiple extensions to respond |
