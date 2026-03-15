# Native Host Bridge - Chrome Browser Control (Claude Code 2.1.76)

> Note: No functional changes from v2.1.38. Version number updated only.

> Deep analysis of the Chrome/browser control bridge architecture:
> three transport implementations (WebSocket cloud bridge, Unix socket, socket pool),
> native host installation, message protocol, security model, extension discovery.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `WebSocketBridgeClient` (ouA) - Cloud bridge WebSocket client class
- `createWebSocketBridgeClient` (auA) - Factory for `ouA`
- `UnixSocketClient` (ZHq) - Direct Unix socket client class
- `createUnixSocketClient` (FN6) - Factory for `ZHq`
- `SocketPoolClient` (VHq) - Multi-socket pool manager class
- `createSocketPoolClient` (NHq) - Factory for `VHq`
- `SocketConnectionError` (Hf) - Error class for connection failures
- `getChromeMcpConfig` (HBA) - Entry point that installs manifest as side effect
- `installNativeHostManifest` (bHq) - Writes manifest JSON + Windows registry
- `createNativeHostWrapper` (uHq) - Creates platform wrapper script
- `detectChromeExtension` (Ec) - Async check for installed extension
- `isExtensionInstalledCached` (WKz) - Sync cached extension check (updates state)
- `getBrowserDataPaths` (Zn4) - Gets per-browser user data dirs for extension detection
- `getNativeHostPaths` (fn4) - Gets NativeMessagingHosts dirs per browser
- `getWindowsRegistryPaths` (Vn4) - Gets Windows registry paths per browser
- `getChromeMcpSocketPath` (MG6) - Gets the Unix socket path for current user
- `getChromeMcpSocketPaths` (Tn4) - Gets all possible socket paths to scan
- `CHROME_MCP_SERVER_NAME` (qy) - `"claude-in-chrome"`
- `NATIVE_HOST_NAME` (wBA) - `"com.anthropic.claude_code_browser_extension"`
- `CHROME_EXTENSION_ID` (OKz) - `"fcoeoabgfenejglbffodgkkbkcdhcgfn"`
- `MANIFEST_FILENAME` (xHq) - `"com.anthropic.claude_code_browser_extension.json"`
- `RECONNECT_URL` (jKz) - `"https://clau.de/chrome/reconnect"`
- `EXTENSIONS_LIST_TIMEOUT` (KKz) - 5000ms
- `PEER_CONNECTED_WAIT_TIMEOUT` (fHq) - 10000ms (10s)

---

## Overview: Three Transport Implementations

The `selectBridgeClient` (kHq) function selects between three client implementations based on the context:

```
selectBridgeClient(context):
  context.bridgeConfig?   → WebSocketBridgeClient (ouA)  — cloud relay, multi-browser
  context.getSocketPaths? → SocketPoolClient      (VHq)  — pool of local Unix sockets
  else                    → UnixSocketClient      (ZHq)  — single local Unix socket
```

```
┌─────────────────────┬──────────────────────────────────────────┬──────────────┐
│ Client              │ Use Case                                  │ Transport    │
├─────────────────────┼──────────────────────────────────────────┼──────────────┤
│ ouA (WebSocket)     │ Production: cloud bridge relay            │ WebSocket    │
│ ZHq (Unix Socket)   │ Development: direct to native host        │ Unix IPC     │
│ VHq (Socket Pool)   │ Multi-extension: pool of sockets          │ Unix IPC ×N  │
└─────────────────────┴──────────────────────────────────────────┴──────────────┘
```

---

## Implementation 1: WebSocket Bridge Client (ouA)

### Class Overview

`ouA` in `chunks.165.mjs:2050-2604` is the primary production transport.
It connects to Anthropic's cloud relay via WebSocket.

```javascript
class WebSocketBridgeClient {
    // Connection state
    ws = null;
    connected = false;
    authenticated = false;
    connecting = false;
    reconnectAttempts = 0;
    reconnectTimer = null;
    connectionStartTime = null;
    connectionEstablishedTime = null;

    // Extension management
    selectedDeviceId;          // Currently selected extension device ID
    discoveryComplete = false;
    discoveryPromise = null;   // Singleton discovery in-progress
    pendingDiscovery = null;   // Waiting for extensions_list response
    peerConnectedWaiters = []; // Callbacks awaiting peer_connected event
    pendingPairingRequestId;   // Pending pairing handshake
    pairingInProgress = false;
    persistedDeviceId;         // Last-known device ID from storage
    pendingSwitchResolve;      // Resolve fn for switchBrowser()

    // Call management
    pendingCalls = new Map();  // tool_use_id → { resolve, reject, timer, ... }

    // Configuration
    permissionMode = "ask";
    allowedDomains;
    tabsContextCollectionTimeoutMs = 2000;  // 2s for tabs_context_mcp
    toolCallTimeoutMs = 120000;             // 120s for all other tools
}
```

### Connection Flow

```javascript
// ============================================
// WebSocketBridgeClient.connect - Full auth + WS connection
// Location: chunks.165.mjs:2274-2357
// ============================================

// READABLE:
async connect() {
    if (this.connecting) return;
    this.connecting = true;
    this.authenticated = false;
    this.connectionStartTime = Date.now();
    this.closeSocket();

    // Step 1: Get user identity
    let userId = context.bridgeConfig.devUserId ?? await context.bridgeConfig.getUserId();
    if (!userId) {
        trackEvent("chrome_bridge_connection_failed", { error_type: "no_user_id" });
        context.onAuthenticationError?.();
        return;
    }

    // Step 2: Get OAuth token (skipped for dev mode)
    let oauthToken = context.bridgeConfig.devUserId ? null : await context.bridgeConfig.getOAuthToken();
    if (!oauthToken && !context.bridgeConfig.devUserId) {
        trackEvent("chrome_bridge_connection_failed", { error_type: "no_oauth_token" });
        context.onAuthenticationError?.();
        return;
    }

    // Step 3: Open WebSocket to bridge URL
    let bridgeUrl = `${context.bridgeConfig.url}/chrome/${userId}`;
    this.ws = new WebSocket(bridgeUrl);

    // Step 4: On open, send auth message
    this.ws.on("open", () => {
        this.ws.send(JSON.stringify({
            type: "connect",
            client_type: this.context.clientTypeId,
            oauth_token: oauthToken  // or dev_user_id for dev
        }));
    });

    // Step 5: Bridge responds with "paired" or "waiting" → authenticated = true
    this.ws.on("message", (data) => this.handleMessage(JSON.parse(data)));
    this.ws.on("close", () => this.scheduleReconnect());
    this.ws.on("error", () => { this.connected = false; this.authenticated = false; });
}
```

### Message Routing (`handleMessage`)

```javascript
// ============================================
// WebSocketBridgeClient.handleMessage - Route all bridge messages
// Location: chunks.165.mjs:2358-2434
// ============================================

// READABLE:
handleMessage(msg) {
    switch (msg.type) {
        case "paired":
            // Connected AND extension attached to bridge
            this.connected = this.authenticated = true;
            this.connecting = false;
            this.reconnectAttempts = 0;
            trackEvent("chrome_bridge_connection_succeeded", { status: "paired" });
            break;

        case "waiting":
            // Connected but no extension yet attached
            this.connected = this.authenticated = true;  // still authenticated!
            this.connecting = false;
            trackEvent("chrome_bridge_connection_succeeded", { status: "waiting" });
            break;

        case "peer_connected":
            // An extension joined the bridge
            if (!this.selectedDeviceId) this.discoveryComplete = false;
            // If previously selected extension reconnects, auto-reselect
            if (this.previousSelectedDeviceId === msg.deviceId && !this.pendingSwitchResolve)
                this.selectExtension(this.previousSelectedDeviceId);
            // Unblock any waiters
            this.peerConnectedWaiters.forEach(w => w(true));
            this.peerConnectedWaiters = [];
            break;

        case "peer_disconnected":
            // Extension left - clear selection
            if (msg.deviceId === this.selectedDeviceId) {
                this.previousSelectedDeviceId = this.selectedDeviceId;
                this.selectedDeviceId = undefined;
                this.discoveryComplete = false;
            }
            break;

        case "extensions_list":
            // Response to list_extensions query
            if (this.pendingDiscovery) {
                clearTimeout(this.pendingDiscovery.timeout);
                this.pendingDiscovery.resolve(msg.extensions ?? []);
                this.pendingDiscovery = null;
            }
            break;

        case "pairing_response":
            // User clicked "Connect" in extension
            if (this.pendingPairingRequestId === msg.request_id && msg.device_id) {
                this.selectExtension(msg.device_id);
                context.onExtensionPaired?.(msg.device_id, msg.name);
                if (this.pendingSwitchResolve)
                    this.pendingSwitchResolve({ deviceId: msg.device_id, name: msg.name });
            }
            break;

        case "tool_result":     this.handleToolResult(msg);      break;
        case "permission_request": this.handlePermissionRequest(msg); break;
        case "notification":    this.notificationHandler?.({ method: msg.method, params: msg.params }); break;
        case "ping":            this.ws.send(JSON.stringify({ type: "pong" }));    break;
        case "error":
            if (this.selectedDeviceId) { this.selectedDeviceId = undefined; this.discoveryComplete = false; }
            break;
    }
}
```

### Tool Call Protocol

```javascript
// ============================================
// WebSocketBridgeClient.callTool - Send tool_call and await result
// Location: chunks.165.mjs:2099-2161
// ============================================

// READABLE:
async callTool(toolName, args, options) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
        throw new SocketConnectionError("Bridge not connected");

    // Trigger extension discovery if not done
    if (!this.selectedDeviceId && !this.discoveryComplete) {
        this.discoveryPromise ??= this.discoverAndSelectExtension().finally(() => {
            this.discoveryPromise = null;
        });
        await this.discoveryPromise;
    }

    let toolUseId = crypto.randomUUID();
    let isTabsContext = toolName === "tabs_context_mcp";
    let timeout = isTabsContext ? this.tabsContextCollectionTimeoutMs  // 2s
                                : this.toolCallTimeoutMs;              // 120s

    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            let pending = this.pendingCalls.get(toolUseId);
            if (!pending) return;
            this.pendingCalls.delete(toolUseId);

            if (isTabsContext && pending.results.length > 0) {
                resolve(this.mergeTabsResults(pending.results));
            } else {
                reject(new SocketConnectionError(`Tool call timed out: ${toolName}`));
            }
        }, timeout);

        this.pendingCalls.set(toolUseId, {
            resolve, reject, timer,
            results: [],
            isTabsContext,
            onPermissionRequest: options?.onPermissionRequest,
            startTime: Date.now(),
            toolName
        });

        let msg = {
            type: "tool_call",
            tool_use_id: toolUseId,
            client_type: this.context.clientTypeId,
            tool: toolName,
            args,
        };
        if (this.selectedDeviceId)        msg.target_device_id = this.selectedDeviceId;
        if (options?.permissionMode)       msg.permission_mode = options.permissionMode;
        if (options?.allowedDomains?.length) msg.allowed_domains = options.allowedDomains;
        if (options?.onPermissionRequest)  msg.handle_permission_prompts = true;

        this.ws.send(JSON.stringify(msg));
    });
}
```

### Extension Discovery Algorithm

```javascript
// ============================================
// WebSocketBridgeClient.discoverAndSelectExtension
// Location: chunks.165.mjs:2174-2202
// ============================================

// READABLE:
async discoverAndSelectExtension() {
    this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();

    let extensions = await this.queryBridgeExtensions();

    if (extensions.length === 0) {
        if (await this.waitForPeerConnected(PEER_CONNECTED_WAIT_TIMEOUT)) {
            extensions = await this.queryBridgeExtensions();
        }
    }

    this.discoveryComplete = true;

    if (extensions.length === 0) return;

    if (extensions.length === 1) {
        if (!this.isLocalExtension(extensions[0]))
            this.context.onRemoteExtensionWarning?.(extensions[0]);
        this.selectExtension(extensions[0].deviceId);
        return;
    }

    // Multiple extensions: try persisted selection first
    if (this.persistedDeviceId) {
        let match = extensions.find(e => e.deviceId === this.persistedDeviceId);
        if (match) {
            this.selectExtension(match.deviceId);
            return;
        }
    }

    // No match: broadcast pairing request
    this.broadcastPairingRequest();
    this.pairingInProgress = true;
}
```

**Why `tabs_context_mcp` uses `mergeTabsResults`:**
The `tabs_context_mcp` tool is special: when multiple extensions are connected, it collects results from all of them. The 2-second timeout lets all extensions respond, then the results are merged into a unified tab list.

### Reconnection Strategy

- Uses exponential backoff: `2000 * 1.5^(attempt - 1)`, capped at 30s
- Max 100 attempts; logs warning every 10 attempts after attempt 10
- On `closeSocket()`, all pending calls are rejected with `SocketConnectionError`
- On `peer_connected`, if previously selected extension reconnects → auto-reselect

---

## Implementation 2: Unix Socket Client (ZHq)

`ZHq` in `chunks.165.mjs:1822-2029` connects directly to the Claude native host via Unix socket.

### Wire Protocol (Length-Prefixed JSON)

```
Outbound (to native host):
  ┌───────────────────────────────────────────┐
  │ 4 bytes: message length (UInt32LE)         │
  │ N bytes: JSON payload (UTF-8)              │
  └───────────────────────────────────────────┘

Payload format:
  {
    "method": "execute_tool",
    "params": {
      "client_id": "<clientTypeId>",
      "tool": "<toolName>",
      "args": { ... }
    }
  }

Inbound (from native host):
  Same length-prefix format.
  Response types:
  - Tool result:    { "result": ..., "error": ... }
  - Notification:   { "method": ..., "params": ... }
```

### Security Validation (`validateSocketSecurity`)

```javascript
// ============================================
// UnixSocketClient.validateSocketSecurity
// Location: chunks.165.mjs:1995-2028
// ============================================

// READABLE:
async validateSocketSecurity(socketPath) {
    if (platform() === "win32") return;  // No Unix permissions on Windows

    if (socketPath.split("/").pop().startsWith("claude-mcp-browser-bridge-")) {
        let dirStat = await fs.stat(socketPath);
        if (dirStat.isDirectory()) {
            if ((dirStat.mode & 0o777) !== 0o700)
                throw Error("Insecure socket directory permissions (expected 0700)");
            if (process.getuid?.() !== dirStat.uid)
                throw Error("Socket directory not owned by current user");
        }
    }

    let socketStat = await fs.stat(socketPath);
    if (!socketStat.isSocket())
        throw Error("Path exists but it's not a socket");
    if ((socketStat.mode & 0o777) !== 0o600)
        throw Error("Insecure socket permissions (expected 0600)");
    if (process.getuid?.() !== socketStat.uid)
        throw Error("Socket not owned by current user");
}
```

**Why these checks?** The socket is a critical IPC channel. If an attacker created a world-writable socket at the same path, they could intercept or inject tool calls. The ownership + permission checks prevent TOCTOU attacks.

### Reconnection Strategy

- Exponential backoff: `reconnectDelay * 1.5^(attempt - 1)`, capped at 30s
- Base delay: 1000ms, max 100 attempts
- After 100 attempts: resets count, logs "Will retry on next tool call"
- Error codes that trigger reconnect: `ECONNREFUSED`, `ECONNRESET`, `EPIPE`, `ENOENT`, `EOPNOTSUPP`, `ECONNABORTED`

---

## Implementation 3: Socket Pool Client (VHq)

`VHq` in `chunks.166.mjs:791-960` manages a dynamic pool of `ZHq` instances,
one per discovered socket path. Used when `context.getSocketPaths` is provided.

### Tab Routing Algorithm

```javascript
// ============================================
// SocketPoolClient.callTool - Route to correct socket by tab ID
// Location: chunks.166.mjs:817-829
// ============================================

// READABLE:
async callTool(toolName, args) {
    if (toolName === "tabs_context_mcp") return this.callTabsContext(args);

    let tabId = args.tabId;
    if (tabId !== undefined) {
        let socketPath = this.tabRoutes.get(tabId);
        if (socketPath) {
            let client = this.clients.get(socketPath);
            if (client?.isConnected()) return client.callTool(toolName, args);
        }
    }

    let clients = this.getConnectedClients();
    if (clients.length === 0) throw new SocketConnectionError("No connected sockets");
    return clients[0].callTool(toolName, args);
}
```

### `callTabsContext` — Multi-Extension Aggregation

```javascript
// ============================================
// SocketPoolClient.callTabsContext - Collect tabs from all sockets
// Location: chunks.166.mjs:845-904
// ============================================

// READABLE:
async callTabsContext(args) {
    let clients = this.getConnectedClients();
    if (clients.length === 1) {
        let result = await clients[0].callTool("tabs_context_mcp", args);
        this.updateTabRoutes(result, socketPathFor(clients[0]));
        return result;
    }

    let results = await Promise.allSettled(clients.map(async client => {
        let result = await client.callTool("tabs_context_mcp", args);
        return { result, socketPath: socketPathFor(client) };
    }));

    this.tabRoutes.clear();
    let allTabs = [];
    for (let r of results) {
        if (r.status !== "fulfilled") continue;
        this.updateTabRoutes(r.value.result, r.value.socketPath);
        let tabs = this.extractTabs(r.value.result);
        if (tabs) allTabs.push(...tabs);
    }

    if (allTabs.length > 0) return buildTabContextResponse(allTabs);
    return results.find(r => r.status === "fulfilled")?.value.result;
}
```

**`tabRoutes` Map:** Stores `tabId → socketPath` mapping built from `tabs_context_mcp` results.
This enables subsequent tool calls to be routed to the correct extension that "owns" that tab.

---

## Native Host Installation

### `createNativeHostWrapper` (uHq)

```javascript
// ============================================
// createNativeHostWrapper - Create platform wrapper script
// Location: chunks.166.mjs:1455-1473
// ============================================

// READABLE:
async function createNativeHostWrapper(nativeHostCommand) {
    let platform = getPlatform();
    let wrapperDir = join(getConfigDir(), "chrome");
    let wrapperPath = platform === "windows"
        ? join(wrapperDir, "chrome-native-host.bat")
        : join(wrapperDir, "chrome-native-host");

    let scriptContent = platform === "windows"
        ? `@echo off\nREM Chrome native host wrapper\nexec ${nativeHostCommand}\n`
        : `#!/bin/sh\n# Chrome native host wrapper\nexec ${nativeHostCommand}\n`;

    if (await readFile(wrapperPath).catch(() => null) === scriptContent) return wrapperPath;

    await mkdir(wrapperDir, { recursive: true });
    await writeFile(wrapperPath, scriptContent);
    if (platform !== "windows") await chmod(wrapperPath, 0o755);

    return wrapperPath;
}
// Mapping: uHq→createNativeHostWrapper, O8→getConfigDir
```

**Why a wrapper script?** The native host manifest must point to an executable path. Using a wrapper script:
1. Decouples the Chrome registration from the actual binary location
2. Allows the binary path to change (update) without re-registering
3. Ensures the correct arguments (`--chrome-native-host`) are always passed

### `installNativeHostManifest` (bHq)

```javascript
// ============================================
// installNativeHostManifest - Write manifest + Windows registry
// Location: chunks.166.mjs:1407-1438
// ============================================

// READABLE:
async function installNativeHostManifest(wrapperScriptPath) {
    let manifestDirs = getNativeHostPaths();
    if (manifestDirs.length === 0) throw Error("Not supported on this platform");

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
        if (await readFile(manifestFile).catch(() => null) === manifestJson) continue;

        try {
            await mkdir(dir, { recursive: true });
            await writeFile(manifestFile, manifestJson);
            installed = true;
        } catch (err) { /* log and continue */ }
    }

    if (getPlatform() === "windows") {
        registerWindowsNativeHost(join(manifestDirs[0], MANIFEST_FILENAME));
    }

    if (installed) {
        detectChromeExtension().then(isInstalled => {
            if (isInstalled) openBrowser(RECONNECT_URL);
        });
    }
}
// Mapping: bHq→installNativeHostManifest, fn4→getNativeHostPaths,
//   PKz→registerWindowsNativeHost, Ec→detectChromeExtension, jG6→openBrowser
```

### Platform Manifest Directories

| Platform | Directory |
|----------|-----------|
| macOS / Chrome | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/` |
| macOS / Brave | `~/Library/Application Support/BraveSoftware/Brave-Browser/NativeMessagingHosts/` |
| macOS / Arc | `~/Library/Application Support/Arc/User Data/NativeMessagingHosts/` |
| macOS / Edge | `~/Library/Application Support/Microsoft Edge/NativeMessagingHosts/` |
| macOS / Chromium | `~/Library/Application Support/Chromium/NativeMessagingHosts/` |
| macOS / Vivaldi | `~/Library/Application Support/Vivaldi/NativeMessagingHosts/` |
| macOS / Opera | `~/Library/Application Support/com.operasoftware.Opera/NativeMessagingHosts/` |
| Linux / Chrome | `~/.config/google-chrome/NativeMessagingHosts/` |
| Linux / Brave | `~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/` |
| Windows | `%APPDATA%\Claude Code\ChromeNativeHost\` + registry |

---

## Extension Detection

### `detectChromeExtension` (Ec)

```javascript
// ============================================
// detectChromeExtension - Scan all browser profiles
// Location: chunks.166.mjs:1484-1488 → 1287-1325
// ============================================

// READABLE:
async function detectChromeExtension() {
    let browserPaths = getBrowserDataPaths();
    if (browserPaths.length === 0) return false;
    return detectExtensionInPaths(browserPaths, logFn);
}

async function detectExtensionInPaths(browserPaths, logger) {
    const EXTENSION_IDS = ["fcoeoabgfenejglbffodgkkbkcdhcgfn"];
    for (let { browser, path } of browserPaths) {
        let entries;
        try {
            entries = await readdir(path, { withFileTypes: true });
        } catch (err) {
            if (["ENOENT", "EACCES", "EPERM"].includes(err.code)) continue;
            throw err;
        }
        let profiles = entries
            .filter(e => e.isDirectory())
            .filter(e => e.name === "Default" || e.name.startsWith("Profile "))
            .map(e => e.name);

        for (let profile of profiles) {
            for (let extId of EXTENSION_IDS) {
                let extPath = join(path, profile, "Extensions", extId);
                try {
                    await readdir(extPath);
                    return { isInstalled: true, browser };
                } catch {}
            }
        }
    }
    return { isInstalled: false, browser: null };
}
// Mapping: Ec→detectChromeExtension, Zn4→getBrowserDataPaths, SHq→detectExtensionInPaths
```

### `isExtensionInstalledCached` (WKz)

```javascript
// ============================================
// isExtensionInstalledCached - Sync cached check + state update
// Location: chunks.166.mjs:1475-1482
// ============================================

// READABLE:
function isExtensionInstalledCached() {
    // Trigger async refresh (fire-and-forget)
    detectChromeExtension().then(isInstalled => {
        if (getLocalSettings().cachedChromeExtensionInstalled !== isInstalled) {
            updateLocalSettings(prev => ({
                ...prev,
                cachedChromeExtensionInstalled: isInstalled
            }));
        }
    });
    // Return immediately from cache
    return getLocalSettings().cachedChromeExtensionInstalled ?? false;
}
// Mapping: WKz→isExtensionInstalledCached, Ec→detectChromeExtension,
//   f6→getLocalSettings, jA→updateLocalSettings
```

**Design:** Uses stale-while-revalidate. Returns the cached value synchronously, then triggers an async refresh in the background.

---

## Unix Socket Path Generation

### `getChromeMcpSocketPath` (MG6) and `getChromeMcpSocketPaths` (Tn4)

```javascript
// ============================================
// getChromeMcpSocketPath / getChromeMcpSocketPaths
// Location: chunks.143.mjs:1696-1716
// ============================================

// READABLE:
function getChromeMcpSocketPath() {
    if (platform() === "win32") return `\\\\.\\pipe\\claude-mcp-browser-bridge-${getUsername()}`;
    return join(getTempSocketDir(), `${process.pid}.sock`);
}

function getChromeMcpSocketPaths() {
    if (platform() === "win32") return [`\\\\.\\pipe\\claude-mcp-browser-bridge-${getUsername()}`];

    let socketDir = getTempSocketDir();
    let paths = [];

    try {
        let files = readdirSync(socketDir);
        for (let f of files) if (f.endsWith(".sock")) paths.push(join(socketDir, f));
    } catch {}

    let dirName = `claude-mcp-browser-bridge-${getUsername()}`;
    let xdgPath = join(os.tmpdir(), dirName);
    let tmpPath = `/tmp/${dirName}`;
    if (!paths.includes(xdgPath)) paths.push(xdgPath);
    if (xdgPath !== tmpPath && !paths.includes(tmpPath)) paths.push(tmpPath);

    return paths;
}
// Mapping: MG6→getChromeMcpSocketPath, Tn4→getChromeMcpSocketPaths, Fg1→getTempSocketDir
```

**Path format:** `/tmp/claude-mcp-browser-bridge-{username}/{pid}.sock`

This per-PID socket means each running Claude Code process has its own socket, enabling the SocketPoolClient (`VHq`) to connect to multiple simultaneously running Claude instances.

---

## Complete Bridge Message Protocol

### Client → Bridge

| Message Type | Purpose | Key Fields |
|-------------|---------|------------|
| `connect` | Authenticate | `oauth_token`, `client_type`, optional `dev_user_id` |
| `tool_call` | Execute tool | `tool_use_id`, `tool`, `args`, `target_device_id`, `permission_mode`, `allowed_domains`, `handle_permission_prompts` |
| `permission_response` | Reply to permission prompt | `request_id`, `allowed`, `target_device_id` |
| `list_extensions` | Query connected extensions | - |
| `pairing_request` | Broadcast pairing to all extensions | `request_id`, `client_type` |
| `pong` | Heartbeat response | - |

### Bridge → Client

| Message Type | Purpose | Key Fields |
|-------------|---------|------------|
| `paired` | Auth + extension connected | - |
| `waiting` | Auth but no extension yet | - |
| `peer_connected` | Extension joined bridge | `deviceId`, `osPlatform`, `name` |
| `peer_disconnected` | Extension left | `deviceId` |
| `extensions_list` | List of connected extensions | `extensions[]` |
| `pairing_response` | Extension accepted pairing | `request_id`, `device_id`, `name` |
| `tool_result` | Tool execution result | `tool_use_id`, `result` OR `error`, `content`, `is_error` |
| `permission_request` | Extension needs permission | `tool_use_id`, `request_id`, `tool_type`, `url`, `action_data` |
| `notification` | Extension notification | `method`, `params` |
| `ping` | Heartbeat | - |
| `error` | Bridge error | `error` |

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| Three separate transport classes | Allows same MCP server code to work with cloud, dev, and multi-socket scenarios |
| `tabs_context_mcp` 2s timeout vs 120s for others | Enables quick multi-extension collection without blocking agent |
| UInt32LE length-prefix for Unix socket | Simple, efficient framing without delimiter scanning |
| Socket security validation (0600, owner check) | Prevents socket injection attacks in shared temp dirs |
| Per-PID socket path | Isolates multiple running Claude instances; SocketPool connects to all |
| `tabRoutes` Map in SocketPoolClient | Routes subsequent tool calls to correct extension that owns the tab |
| Stale-while-revalidate for extension detection | Fast sync path for hot path, background refresh for accuracy |
| Reconnect URL opened on first manifest install | Automates the "reconnect" step after initial native host setup |
| `allow_origins` restricts to official extension ID | Security: only the official Chrome extension can use the native host |
| `pairing_request` broadcast on multi-extension | User-initiated selection via browser UI when auto-selection fails |
