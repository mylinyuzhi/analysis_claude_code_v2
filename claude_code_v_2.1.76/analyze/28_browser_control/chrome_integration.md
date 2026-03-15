# Browser Control (Claude in Chrome) - Full Integration Analysis

> Note: No functional changes from v2.1.38. Version number updated only.

## Module Overview

Claude Code v2.1.76 "Claude in Chrome" integrates with Chromium-family browsers via a Chrome extension
and native messaging bridge, enabling the agent to perform real web automation.
This document covers the **full architecture**, **tool catalog**, **permission system**, **feature flags**,
**browser registry**, and **transport selection logic**.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getChromeMcpConfig` (HBA) - Builds MCP config + side-effect installs native host manifest
- `createChromeMcpServer` (KBA) - Creates the MCP Server object with tool handlers
- `handleToolCall` (vHq) - Tool call dispatcher: routes to bridge or handles locally
- `getChromeSystemPrompt` (YBA) - Returns the full system prompt injected when chrome enabled
- `CHROME_MCP_SERVER_NAME` (qy) - Constant: `"claude-in-chrome"`
- `CHROME_TOOLS` (Qe) - The complete 17-tool catalog
- `isClaudeInChromeEnabled` (UN6) - Feature flag evaluation function
- `isAutoEnableEnabled` (cZ1) - Auto-enable check via feature gate
- `BROWSER_CONFIG` (mg1) - Complete browser profile config (7 browsers)
- `SUPPORTED_BROWSERS` (DG6) - `["chrome", "brave", "arc", "edge", "chromium", "vivaldi", "opera"]`
- `openBrowserToUrl` (jG6) - Platform-aware browser launch
- `detectInstalledBrowser` (DxY) - Detects first available Chromium browser
- `isChromeMcpServer` (KG1) - Checks if MCP server is the chrome integration

---

## Architecture: Four-Layer System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  User (Terminal)                                                              │
└──────────────┬───────────────────────────────────────────────────────────────┘
               │ stdin/stdout
┌──────────────▼───────────────────────────────────────────────────────────────┐
│  Claude Code CLI (main process)                                               │
│  - Loads HBA() to get MCP config                                              │
│  - Injects YBA() system prompt when chrome enabled                            │
│  - Spawns chrome MCP server as child process                                  │
└──────────────┬───────────────────────────────────────────────────────────────┘
               │ stdio (MCP protocol)
┌──────────────▼───────────────────────────────────────────────────────────────┐
│  Chrome MCP Server (child proc, same binary, --claude-in-chrome-mcp flag)    │
│  - 17 tools exposed via MCP                                                   │
│  - vHq dispatcher: routes to bridge client                                    │
│  - KBA() creates the MCP Server object                                        │
└──────────────┬───────────────────────────────────────────────────────────────┘
               │ (one of three transport strategies)
   ┌───────────┼──────────────┐
   │           │              │
   ▼           ▼              ▼
WebSocket   Unix Socket   Socket Pool
(ouA)       (ZHq/FN6)    (VHq/NHq)
Cloud Bridge  Local bridge  Multi-ext
   │
   │ WebSocket
┌──▼──────────────────────────────┐
│  Cloud Bridge (Anthropic relay)  │
│  URL: {bridgeUrl}/chrome/{userId}│
└──────────────┬──────────────────┘
               │ WebSocket
┌──────────────▼──────────────────┐
│  Chrome Extension                │
│  (fcoeoabgfenejglbffodgkkbkcdhcgfn)│
│  - Executes browser actions       │
│  - DOM interaction, screenshots   │
└─────────────────────────────────┘
```

---

## Transport Selection Algorithm

### `createChromeMcpServer` (KBA) — MCP Server with Transport Selection

```javascript
// ============================================
// createChromeMcpServer - Create MCP server with transport selection
// Location: chunks.166.mjs:1127-1157
// ============================================

// ORIGINAL (for source lookup):
function KBA(A, q) {
    let { serverName: K, logger: Y } = A, z = q ?? kHq(A), w = new Zd1(...);
    w.setRequestHandler(qb1, async () => {
        if (A.isDisabled?.()) return { tools: [] };
        return { tools: A.bridgeConfig ? Qe : Qe.filter((H) => H.name !== "switch_browser") }
    });
    w.setRequestHandler(Tq1, async (H) => vHq(A, z, H.params.name, H.params.arguments || {}));
    z.setNotificationHandler((H) => { w.notification({method: H.method, params: H.params}).catch(...) });
    return w
}

// READABLE (for understanding):
function createChromeMcpServer(context, providedClient) {
    let bridgeClient = providedClient ?? selectBridgeClient(context);
    let mcpServer = new McpServer({ name: context.serverName, version: "1.0.0" }, {
        capabilities: { tools: {}, logging: {} }
    });

    // List tools handler - hide switch_browser for non-bridge connections
    mcpServer.setRequestHandler(ListToolsRequest, async () => {
        if (context.isDisabled?.()) return { tools: [] };
        return {
            tools: context.bridgeConfig
                ? CHROME_TOOLS                                    // all 17 tools
                : CHROME_TOOLS.filter(t => t.name !== "switch_browser")  // 16 tools
        };
    });

    // Call tool handler
    mcpServer.setRequestHandler(CallToolRequest, async (req) =>
        handleToolCall(context, bridgeClient, req.params.name, req.params.arguments || {})
    );

    // Forward MCP notifications from bridge to Claude Code
    bridgeClient.setNotificationHandler((notification) => {
        mcpServer.notification(notification).catch(() => {});
    });

    return mcpServer;
}

// Mapping: KBA→createChromeMcpServer, kHq→selectBridgeClient, Zd1→McpServer,
//   qb1→ListToolsRequest, Tq1→CallToolRequest, vHq→handleToolCall
```

### `selectBridgeClient` (kHq) — Transport Strategy

```javascript
// ============================================
// selectBridgeClient - Choose between 3 bridge implementations
// Location: chunks.166.mjs:1123-1125
// ============================================

// ORIGINAL:
function kHq(A) {
    return A.bridgeConfig ? auA(A) : A.getSocketPaths ? NHq(A) : FN6(A)
}

// READABLE:
function selectBridgeClient(context) {
    if (context.bridgeConfig)   return createWebSocketBridgeClient(context);   // Cloud relay
    if (context.getSocketPaths) return createSocketPoolClient(context);         // Multi-socket
    return createUnixSocketClient(context);                                      // Single socket
}

// Mapping: kHq→selectBridgeClient, auA→createWebSocketBridgeClient,
//   NHq→createSocketPoolClient, FN6→createUnixSocketClient
```

---

## Tool Call Dispatcher

### `handleToolCall` (vHq)

```javascript
// ============================================
// handleToolCall - Route tool calls to correct handler
// Location: chunks.166.mjs:1100-1117
// ============================================

// ORIGINAL:
vHq = async (A, q, K, Y, z) => {
    if (K === "set_permission_mode") return zKz(q, Y);
    if (K === "switch_browser") return wKz(A, q);
    try {
        let w = await q.ensureConnected();
        if (w) return await YKz(A, q, K, Y, z);
        return qBA(A)
    } catch (w) { ... }
}

// READABLE:
async function handleToolCall(context, bridgeClient, toolName, args, meta) {
    // Local-only tools (no bridge needed)
    if (toolName === "set_permission_mode") return setPermissionMode(bridgeClient, args);
    if (toolName === "switch_browser")      return switchBrowser(context, bridgeClient);

    // Bridge tools: ensure connection first
    try {
        let connected = await bridgeClient.ensureConnected();
        if (connected) return await executeBridgeTool(context, bridgeClient, toolName, args, meta);
        return buildDisconnectedResponse(context);     // "Please reconnect" message
    } catch (err) {
        if (err instanceof SocketConnectionError) return buildDisconnectedResponse(context);
        return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
}

// Mapping: vHq→handleToolCall, zKz→setPermissionMode, wKz→switchBrowser,
//   YKz→executeBridgeTool, qBA→buildDisconnectedResponse, Hf→SocketConnectionError
```

---

## Complete Tool Catalog (17 Tools)

The `CHROME_TOOLS` constant (`Qe`) in `chunks.166.mjs:3-457` defines all 17 tools:

### Observation Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `computer` | Mouse/keyboard/screenshot automation | action, coordinate, text, tabId |
| `read_page` | Accessibility tree of page elements | tabId, filter, depth, ref_id, max_chars |
| `find` | Natural language element search | query, tabId |
| `get_page_text` | Extract raw text from page | tabId |
| `read_console_messages` | Browser console log reader | tabId, onlyErrors, clear, pattern, limit |
| `read_network_requests` | HTTP request monitor | tabId, urlPattern, clear, limit |

### Interaction Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `javascript_tool` | Execute JS in page context | action="javascript_exec", text, tabId |
| `form_input` | Set form element values via ref ID | ref, value, tabId |
| `navigate` | URL navigation / forward / back | url, tabId |
| `resize_window` | Set window dimensions | width, height, tabId |
| `upload_image` | Upload screenshot or image to file input | imageId, ref OR coordinate, tabId |

### Tab Management Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `tabs_context_mcp` | Get current tab group info | createIfEmpty |
| `tabs_create_mcp` | Create new empty tab | (none) |

### Recording Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `gif_creator` | GIF recording management | action, tabId, options |

### Automation Workflow Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `shortcuts_list` | List available shortcuts/workflows | tabId |
| `shortcuts_execute` | Execute a shortcut by ID or command | tabId, shortcutId OR command |
| `update_plan` | Present plan to user for domain approval | domains, approach |

### Session Control Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `switch_browser` | Connect to a different Chrome browser | (none) |

**`computer` action sub-types:** `left_click`, `right_click`, `double_click`, `triple_click`, `type`, `screenshot`, `wait`, `scroll`, `key`, `left_click_drag`, `zoom`, `scroll_to`, `hover`

---

## Feature Flag Evaluation

### `isClaudeInChromeEnabled` (UN6)

```javascript
// ============================================
// isClaudeInChromeEnabled - Feature flag gate
// Location: chunks.166.mjs:1335-1344
// ============================================

// ORIGINAL:
function UN6(A) {
    if (w4() && A !== !0) return !1;
    if (A === !0) return !0;
    if (A === !1) return !1;
    if (J6(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
    if (FY(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
    let q = f6();
    if (q.claudeInChromeDefaultEnabled !== void 0) return q.claudeInChromeDefaultEnabled;
    return !1
}

// READABLE:
function isClaudeInChromeEnabled(forcedValue) {
    if (isWSL() && forcedValue !== true) return false;   // WSL not supported
    if (forcedValue === true)  return true;               // CLI --chrome flag
    if (forcedValue === false) return false;              // CLI --no-chrome flag
    if (parseBooleanTrue(process.env.CLAUDE_CODE_ENABLE_CFC))  return true;  // env override
    if (parseBooleanFalse(process.env.CLAUDE_CODE_ENABLE_CFC)) return false; // env override
    let settings = getLocalSettings();
    if (settings.claudeInChromeDefaultEnabled !== undefined)
        return settings.claudeInChromeDefaultEnabled;   // saved setting
    return false;  // default: disabled
}

// Mapping: UN6→isClaudeInChromeEnabled, w4→isWSL, J6→parseBooleanTrue,
//   FY→parseBooleanFalse, f6→getLocalSettings
```

**Priority order (high to low):**
1. WSL environment → always false
2. Explicit `forcedValue` (from `--chrome` / `--no-chrome` flag)
3. `CLAUDE_CODE_ENABLE_CFC` env var
4. `claudeInChromeDefaultEnabled` in local settings
5. Default: false

### `isAutoEnableEnabled` (cZ1)

```javascript
// ============================================
// isAutoEnableEnabled - Auto-enable via feature gate
// Location: chunks.166.mjs:1346-1349
// ============================================

// ORIGINAL:
function cZ1() {
    if (gN6 !== void 0) return gN6;
    return gN6 = wQ() && WKz() && x8("tengu_chrome_auto_enable", !1), gN6
}

// READABLE:
function isAutoEnableEnabled() {
    if (autoEnableCache !== undefined) return autoEnableCache;
    // Auto-enable only if:
    // 1. isSubscriber() - user has claude.ai subscription
    // 2. isExtensionInstalledCached() - extension is installed
    // 3. feature gate "tengu_chrome_auto_enable" is enabled
    autoEnableCache = isSubscriber() && isExtensionInstalledCached() && checkFeatureGate("tengu_chrome_auto_enable", false);
    return autoEnableCache;
}

// Mapping: cZ1→isAutoEnableEnabled, gN6→autoEnableCache, wQ→isSubscriber,
//   WKz→isExtensionInstalledCached, x8→checkFeatureGate
```

**Key insight:** Auto-enable requires all three conditions. The feature gate `tengu_chrome_auto_enable` acts as a controlled rollout mechanism. Even when the gate is enabled, the user must have an active subscription AND the extension installed.

---

## Browser Registry

### `BROWSER_CONFIG` (mg1) — All 7 Supported Browsers

Defined in `chunks.143.mjs:1743-1864`. Each browser entry contains macOS/Linux/Windows paths:

```javascript
// ============================================
// BROWSER_CONFIG - Multi-browser support registry
// Location: chunks.143.mjs:1743-1864
// ============================================

// ORIGINAL: mg1 = { chrome: {...}, brave: {...}, arc: {...}, ... }

// READABLE:
BROWSER_CONFIG = {
    chrome:   { name: "Google Chrome",   macOS: ["Library","Application Support","Google","Chrome"],     ... },
    brave:    { name: "Brave",            macOS: ["Library","Application Support","BraveSoftware","Brave-Browser"], ... },
    arc:      { name: "Arc",              macOS: ["Library","Application Support","Arc","User Data"],     ... },
    edge:     { name: "Microsoft Edge",   macOS: ["Library","Application Support","Microsoft Edge"],     ... },
    chromium: { name: "Chromium",         macOS: ["Library","Application Support","Chromium"],           ... },
    vivaldi:  { name: "Vivaldi",          macOS: ["Library","Application Support","Vivaldi"],             ... },
    opera:    { name: "Opera",            macOS: ["Library","Application Support","com.operasoftware.Opera"], ... }
}

SUPPORTED_BROWSERS = ["chrome", "brave", "arc", "edge", "chromium", "vivaldi", "opera"]
```

**Windows Registry Keys:**

| Browser | Registry Key |
|---------|-------------|
| Chrome | `HKCU\Software\Google\Chrome\NativeMessagingHosts` |
| Brave | `HKCU\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts` |
| Arc | `HKCU\Software\ArcBrowser\Arc\NativeMessagingHosts` |
| Edge | `HKCU\Software\Microsoft\Edge\NativeMessagingHosts` |
| Chromium | `HKCU\Software\Chromium\NativeMessagingHosts` |
| Vivaldi | `HKCU\Software\Vivaldi\NativeMessagingHosts` |
| Opera | `HKCU\Software\Opera Software\Opera Stable\NativeMessagingHosts` |

---

## Platform-Aware Browser Launch

### `openBrowserToUrl` (jG6)

```javascript
// ============================================
// openBrowserToUrl - Platform-aware URL opening
// Location: chunks.143.mjs:1660-1690
// ============================================

// READABLE:
async function openBrowserToUrl(url) {
    let browser = await detectInstalledBrowser(); // scans BROWSER_CONFIG in order
    if (!browser) return false;
    let config = BROWSER_CONFIG[browser];
    switch (getPlatform()) {
        case "macos":   return exec("open", ["-a", config.macos.appName, url]).code === 0;
        case "windows": return exec("rundll32", ["url,OpenURL", url]).code === 0;
        case "linux":
            for (let binary of config.linux.binaries) {
                let result = exec(binary, [url]);
                if (result.code === 0) return true;
            }
            return false;
    }
}
// Mapping: jG6→openBrowserToUrl, DxY→detectInstalledBrowser, mg1→BROWSER_CONFIG
```

---

## Permission System

### Permission Modes

Controlled via `set_permission_mode` tool or `CLAUDE_CHROME_PERMISSION_MODE` env var:

```javascript
// ============================================
// setPermissionMode - Update bridge permission mode
// Location: chunks.166.mjs:1047-1058
// ============================================

// READABLE:
async function setPermissionMode(bridgeClient, args) {
    const VALID_MODES = ["ask", "skip_all_permission_checks", "follow_a_plan"];
    let mode = args.mode && VALID_MODES.includes(args.mode) ? args.mode : "ask";
    if (bridgeClient.setPermissionMode) {
        await bridgeClient.setPermissionMode(mode, args.allowed_domains);
    }
    return { content: [{ type: "text", text: `Permission mode set to: ${mode}` }] };
}
// Mapping: zKz→setPermissionMode
```

| Mode | Behavior |
|------|----------|
| `ask` (default) | All actions require extension permission prompt |
| `skip_all_permission_checks` | Bypass all prompts (used in CI/automated testing) |
| `follow_a_plan` | Domains approved via `update_plan` tool are pre-approved |

### `update_plan` Tool Flow

The `update_plan` tool enables a "plan and execute" workflow:
1. Claude calls `update_plan` with `domains` and `approach`
2. User sees the planned actions and approves
3. Approved domains are added to `allowed_domains`
4. Subsequent actions on those domains skip permission prompts

---

## `getChromeMcpConfig` (HBA) — Entry Point

```javascript
// ============================================
// getChromeMcpConfig - Build MCP config for Claude-in-Chrome
// Location: chunks.166.mjs:1351-1394
// ============================================

// READABLE:
function getChromeMcpConfig() {
    let isBundled = isBundledBinary();
    let allowedTools = CHROME_TOOLS.map(t => `mcp__claude-in-chrome__${t.name}`);
    let env = {};
    if (isChromePermissionSkipEnabled()) {
        env.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
    }

    // Side effect: install native host manifest in background (fire and forget)
    let nativeHostCmd = isBundled
        ? `"${process.execPath}" --chrome-native-host`
        : `"${process.execPath}" "${cliJsPath}" --chrome-native-host`;
    createNativeHostWrapper(nativeHostCmd).then(wrapperPath => installNativeHostManifest(wrapperPath));

    return {
        mcpConfig: {
            "claude-in-chrome": {
                type: "stdio",
                command: process.execPath,
                args: isBundled ? ["--claude-in-chrome-mcp"] : [cliJsPath, "--claude-in-chrome-mcp"],
                scope: "dynamic",
                ...(Object.keys(env).length > 0 && { env })
            }
        },
        allowedTools,
        systemPrompt: getChromeSystemPrompt()   // YBA()
    };
}
// Mapping: HBA→getChromeMcpConfig, D9→isBundledBinary, HQ→isChromePermissionSkipEnabled,
//   Qe→CHROME_TOOLS, uHq→createNativeHostWrapper, bHq→installNativeHostManifest,
//   qy→"claude-in-chrome", YBA→getChromeSystemPrompt
```

**Two path modes (bundled vs. unbundled):**
- **Bundled** (production): `process.execPath --claude-in-chrome-mcp` — cleaner, uses the binary directly
- **Unbundled** (development): `process.execPath cli.js --claude-in-chrome-mcp` — requires finding `cli.js` via `import.meta.url`

**Critical side effect:** The native host manifest is installed on every config load (fire-and-forget). This means every time the chrome integration starts, it silently ensures Chrome is registered with the native host. If the path changed (binary updated), the manifest is re-written.

---

## Authentication Error Handling

```javascript
// ============================================
// isAuthenticationError - Detect re-auth required
// Location: chunks.166.mjs:1092-1098
// ============================================

// ORIGINAL:
function HKz(A) {
    return (Array.isArray(A) ? A.map(...).join(" ") : String(A)).toLowerCase().includes("re-authenticated")
}

// READABLE:
function isAuthenticationError(content) {
    let text = Array.isArray(content)
        ? content.map(c => typeof c === "string" ? c : c?.text ?? "").join(" ")
        : String(content);
    return text.toLowerCase().includes("re-authenticated");
}
```

When the bridge returns an error containing `"re-authenticated"`, `context.onAuthenticationError()` is called, triggering the auth refresh flow.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Self-spawning MCP server (same binary + flag) | No separate binary; auto-updates with Claude Code |
| `scope: "dynamic"` in MCP config | Server started on demand, not persisted to settings |
| Side-effect manifest install in `getChromeMcpConfig` | Ensures Chrome registration without separate setup step |
| `switch_browser` hidden in non-bridge mode | Only cloud bridge supports multi-browser switching |
| `tabs_context_mcp` has 2s timeout (vs 120s for others) | Collects from all extensions quickly without blocking |
| 7-browser registry with per-platform paths | Single source of truth for all Chromium-family browsers |
| `update_plan` + `follow_a_plan` mode | Enables pre-authorization workflow without per-action prompts |
| Auto-enable gated behind subscriber + extension + gate | Controls rollout and prevents premature activation |
