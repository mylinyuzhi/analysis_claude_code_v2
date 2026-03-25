# IDE Connection Lifecycle (Claude Code 2.1.76)

## Overview

The IDE integration uses MCP (Model Context Protocol) as its communication backbone. The IDE extension/plugin starts an MCP server, and Claude Code connects as a client. This document details the complete connection lifecycle from discovery through disconnection, including authentication, reconnection, and error handling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Protocol

Key functions in this document:
- `findConnectedIdeClient` (iV) - Locates connected IDE client from mcpClients list
- `sendIdeConnectedNotification` (hx7) - Notifies IDE of successful connection
- `getIdeConnectionStatus` (Rf1) - React hook returning connection state
- `useIdeSelection` (fVq) - Hook subscribing to selection_changed notifications
- `parseToolIdentifier` (iV) - Parses `mcp__server__tool` format

---

## Connection Architecture

### Bidirectional MCP Connection

```
┌──────────────────────────────────────────────────────────────────┐
│                    IDE Extension Process                          │
│                                                                   │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐  │
│  │   MCP Server        │    │   Extension UI                  │  │
│  │   (localhost:PORT)  │◄──►│   - Status bar spark icon      │  │
│  │                     │    │   - Diff preview sidebar        │  │
│  │   Exposes:          │    │   - Selection change events     │  │
│  │   - Tools           │    └─────────────────────────────────┘  │
│  │   - Resources       │                                        │
│  │   - Notifications   │                                        │
│  └─────────┬───────────┘                                        │
│            │                                                     │
└────────────│─────────────────────────────────────────────────────┘
             │
             │  SSE or WebSocket Transport
             │  Auth: x-claude-code-ide-authorization: TOKEN
             │
┌────────────▼─────────────────────────────────────────────────────┐
│                    Claude Code Process                            │
│                                                                   │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐  │
│  │   MCP Client        │    │   React UI                      │  │
│  │   (name: "ide")     │───►│   - Selection indicator        │  │
│  │                     │    │   - Diff handler               │  │
│  │   Consumes:         │    │   - Status notifications       │  │
│  │   - Tools           │    └─────────────────────────────────┘  │
│  │   - Notifications   │                                        │
│  └─────────────────────┘                                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Transport Selection

**SSE (Server-Sent Events) - Default:**
- URL format: `http://localhost:{port}/sse`
- Unidirectional server push with HTTP POST for client messages
- Works through most corporate firewalls

**WebSocket - Alternative:**
- URL format: `ws://localhost:{port}`
- Full-duplex communication
- Lower latency for high-frequency operations
- Header: `x-claude-code-ide-authorization: {token}`

### Transport Selection Decision Tree

```
IDE Extension Configuration
        │
        ├─ Has transport: "websocket" or url starts with "ws://"?
        │       │
        │       └─ YES → Use WebSocketClientTransport (VG6)
        │                 - Full-duplex, lower latency
        │                 - Custom auth header support
        │
        └─ NO (default) → Use SSEClientTransport
                          - HTTP-based, firewall-friendly
                          - Bearer token in Authorization header
```

### Transport Implementation Details

**SSE Transport Configuration:**
```javascript
// ============================================
// SSEClientTransport configuration for IDE
// Location: chunks.57.mjs (transport layer)
// ============================================

// READABLE (for understanding):
let sseTransport = new SSEClientTransport({
    url: `http://localhost:${ideConfig.port}/sse`,
    requestInit: {
        headers: {
            "Authorization": `Bearer ${ideConfig.authToken}`
        }
    },
    // Reconnection options for transient disconnects
    reconnectionOptions: {
        initialReconnectionDelay: 1000,  // 1 second
        reconnectionDelayGrowFactor: 2,   // Exponential backoff
        maxReconnectionDelay: 30000,      // Max 30 seconds
        maxRetries: 10                    // Try 10 times before giving up
    }
});
```

**WebSocket Transport Configuration:**
```javascript
// ============================================
// WebSocketClientTransport configuration for IDE
// Location: chunks.144.mjs
// ============================================

// READABLE (for understanding):
let wsTransport = new WebSocketClientTransport({
    url: `ws://localhost:${ideConfig.port}`,
    headers: {
        // Custom header format required by IDE extension
        "x-claude-code-ide-authorization": ideConfig.authToken
    }
});

// WebSocket frame handling:
// - Incoming text frames → JSON.parse() → onMessage()
// - Outgoing messages → JSON.stringify() → ws.send()
// - Binary frames: ignored (MCP uses text/JSON only)
```

**Why different auth header formats:**
- SSE uses standard `Authorization: Bearer` (HTTP convention)
- WebSocket uses custom `x-claude-code-ide-authorization` because some WebSocket implementations don't support standard Authorization headers during handshake

---

## Connection Lifecycle States

### State Machine

```
                    ┌──────────────┐
                    │   DISCOVER   │
                    │  (checking)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ NOT_     │ │ FOUND_   │ │ ERROR_   │
        │ FOUND    │ │ IDE      │ │ DEPS     │
        └──────────┘ └────┬─────┘ └──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  CONNECTING  │
                    │ (handshake)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ CONNECTED│ │ AUTH_    │ │ CONN_    │
        │ (active) │ │ REQUIRED │ │ FAILED   │
        └────┬─────┘ └────┬─────┘ └──────────┘
             │            │
             │            ▼
             │     ┌──────────┐
             │     │ AUTH_    │
             │     │ IN_PROGRESS
             │     └────┬─────┘
             │          │
             └──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │DISCONNECTED  │
                    │ (cleanup)    │
                    └──────────────┘
```

---

## Phase 1: IDE Discovery

### Detecting Available IDEs

Claude Code discovers IDEs through multiple mechanisms:

1. **MCP Configuration**: User explicitly configures an "ide" MCP server in `.mcp.json` or settings
2. **Environment Detection**: Checks for IDE-specific environment variables
3. **Auto-Installation**: If no IDE is configured but one is detected, prompts for installation

### IDE Detection Function

```javascript
// ============================================
// detectAvailableIDEs - Scan for installed IDE extensions
// Location: chunks.182.mjs (approx)
// ============================================

// READABLE (for understanding):
async function detectAvailableIDEs(checkInstallation = false) {
    let availableIDEs = [];

    // Check for VS Code family (VS Code, Cursor, Windsurf)
    let vsCodePath = findVSCodeExtensionPath();
    if (vsCodePath) {
        let extensionInstalled = await checkExtensionInstalled(vsCodePath, "anthropic.claude-code");
        availableIDEs.push({
            name: "VS Code",
            type: "vscode",
            path: vsCodePath,
            extensionInstalled
        });
    }

    // Check for Cursor
    let cursorPath = findCursorExtensionPath();
    if (cursorPath) {
        availableIDEs.push({
            name: "Cursor",
            type: "cursor",
            path: cursorPath,
            extensionInstalled: await checkExtensionInstalled(cursorPath, "anthropic.claude-code")
        });
    }

    // Check for JetBrains IDEs
    let jetBrainsPath = findJetBrainsPluginPath();
    if (jetBrainsPath) {
        availableIDEs.push({
            name: "JetBrains",
            type: "jetbrains",
            path: jetBrainsPath,
            extensionInstalled: await checkPluginInstalled(jetBrainsPath)
        });
    }

    return availableIDEs;
}
```

### IDE Configuration Map

The `IDE_CONFIG_MAP` (U01) contains configurations for 18 supported IDEs:

```javascript
// ============================================
// IDE_CONFIG_MAP - Configuration for all supported IDEs
// Location: chunks.80.mjs (approx)
// ============================================

// READABLE (for understanding):
const IDE_CONFIG_MAP = {
    vscode: {
        name: "VS Code",
        type: "vscode",
        extensionId: "anthropic.claude-code",
        configPath: "~/.vscode/extensions",
        spawnArgs: ["--extensionDevelopmentPath"]
    },
    cursor: {
        name: "Cursor",
        type: "vscode",  // Uses same extension system
        extensionId: "anthropic.claude-code",
        configPath: "~/.cursor/extensions"
    },
    windsurf: {
        name: "Windsurf",
        type: "vscode",
        extensionId: "anthropic.claude-code",
        configPath: "~/.windsurf/extensions"
    },
    intellij: {
        name: "IntelliJ IDEA",
        type: "jetbrains",
        pluginId: "com.anthropic.claude-code",
        configPath: "~/.IntelliJIdea*/plugins"
    },
    pycharm: {
        name: "PyCharm",
        type: "jetbrains",
        pluginId: "com.anthropic.claude-code",
        configPath: "~/.PyCharm*/plugins"
    },
    webstorm: {
        name: "WebStorm",
        type: "jetbrains",
        pluginId: "com.anthropic.claude-code",
        configPath: "~/.WebStorm*/plugins"
    },
    // ... 12 more IDEs
};
```

---

## Phase 2: MCP Connection Establishment

### Transport Initialization

```javascript
// ============================================
// connectToIde - Establish MCP connection to IDE
// Location: chunks.145.mjs (approx)
// ============================================

// READABLE (for understanding):
async function connectToIde(ideConfig) {
    let transport;

    // Determine transport type from config
    if (ideConfig.transport === "websocket" || ideConfig.url?.startsWith("ws://")) {
        transport = new WebSocketClientTransport({
            url: ideConfig.url,
            headers: {
                "x-claude-code-ide-authorization": ideConfig.authToken
            }
        });
    } else {
        // Default to SSE
        transport = new SSEClientTransport({
            url: ideConfig.url,
            requestInit: {
                headers: {
                    "Authorization": `Bearer ${ideConfig.authToken}`
                }
            }
        });
    }

    // Create MCP client with "ide" server name
    let client = new McpClient({
        name: "ide",
        type: ideConfig.type,
        config: ideConfig
    });

    // Connect with capability negotiation
    await client.connect(transport);

    // Subscribe to IDE notifications
    setupIdeNotificationHandlers(client);

    return client;
}
```

### MCP Handshake for IDE

```
Claude Code                        IDE Extension
    │                                   │
    │──── initialize request ──────────►│
    │     {                             │
    │       protocolVersion: "2024-11-05",
    │       capabilities: {             │
    │         roots: {},                │
    │         elicitation: {            │
    │           form: {}, url: {}       │
    │         }                         │
    │       },                          │
    │       clientInfo: {               │
    │         name: "claude-code",      │
    │         version: "2.1.76"         │
    │       }                           │
    │     }                             │
    │                                   │
    │◄─── initialize response ─────────│
    │     {                             │
    │       protocolVersion: "2024-11-05",
    │       capabilities: {             │
    │         tools: {},                │
    │         resources: {},            │
    │         prompts: {}               │
    │       },                          │
    │       serverInfo: {               │
    │         name: "claude-code-ide", │
    │         version: "1.x.x"          │
    │       }                           │
    │     }                             │
    │                                   │
    │──── notifications/initialized ──►│
    │                                   │
    │     Connection ESTABLISHED        │
    │                                   │
```

---

## Phase 3: Post-Connection Setup

### Sending `ide_connected` Notification

After the MCP handshake completes, Claude Code notifies the IDE that the connection is active:

```javascript
// ============================================
// sendIdeConnectedNotification - Notify IDE of successful connection
// Location: chunks.80.mjs (approx)
// ============================================

// READABLE (for understanding):
async function sendIdeConnectedNotification(ideClient) {
    // Send notification that triggers IDE to:
    // 1. Show spark icon in status bar
    // 2. Enable context menu items
    // 3. Start sending selection_changed notifications

    await ideClient.notification({
        method: "notifications/ide_connected",
        params: {
            sessionId: getCurrentSessionId(),
            timestamp: Date.now(),
            capabilities: {
                supportsDiff: true,
                supportsSelection: true,
                supportsDiagnostics: true
            }
        }
    });
}
```

### Subscribing to IDE Notifications

```javascript
// ============================================
// useIdeSelection - React hook for IDE selection tracking
// Location: chunks.186.mjs:410
// ============================================

// ORIGINAL (for source lookup):
function fVq(A, q) {
    let K = A?.find((Y) => Y.name === "ide");
    if (!K) return;
    let Y = K.subscribeToNotification("selection_changed", (z) => {
        let w = oMz.parse(z.params);
        q(w)
    });
    return () => Y?.unsubscribe()
}

// READABLE (for understanding):
function useIdeSelection(mcpClients, onSelectionChange) {
    // Find the IDE client from the MCP clients list
    let ideClient = mcpClients?.find((client) => client.name === "ide");
    if (!ideClient) return;

    // Subscribe to selection_changed notifications
    let subscription = ideClient.subscribeToNotification("selection_changed", (notification) => {
        let selection = selectionChangedSchema.parse(notification.params);
        onSelectionChange(selection);
    });

    // Return cleanup function
    return () => subscription?.unsubscribe();
}

// Mapping: fVq→useIdeSelection, A→mcpClients, q→onSelectionChange, K→ideClient,
//          Y→subscription, z→notification, w→selection, oMz→selectionChangedSchema
```

### Selection State Schema

```javascript
// ============================================
// selectionChangedSchema - Zod schema for IDE selection notifications
// Location: chunks.76.mjs (approx)
// ============================================

// READABLE (for understanding):
const selectionChangedSchema = z.object({
    lineCount: z.number().default(0),       // 0 when no selection
    lineStart: z.number().optional(),       // 0-based line number
    text: z.string().optional(),            // Selected text content
    filePath: z.string().optional(),        // Absolute file path
    language: z.string().optional(),        // File language (e.g., "typescript")
    projectName: z.string().optional()      // Project/workspace name
});
```

---

## Phase 4: Connection Status Management

### `getIdeConnectionStatus` Hook

```javascript
// ============================================
// getIdeConnectionStatus - React hook returning IDE connection state
// Location: chunks.182.mjs:1500-1506
// ============================================

// ORIGINAL (for source lookup):
function Rf1(A) {
    return mWq.useMemo(() => {
        let q = A?.find((K) => K.name === "ide");
        if (!q) return null;
        return q.type === "connected" ? "connected" : "disconnected"
    }, [A])
}

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return useMemo(() => {
        let ideClient = mcpClients?.find((client) => client.name === "ide");
        if (!ideClient) return null;  // IDE not configured

        return ideClient.type === "connected" ? "connected" : "disconnected";
    }, [mcpClients]);
}

// Mapping: Rf1→getIdeConnectionStatus, A→mcpClients, q→ideClient, mWq→React
```

### Connection Status Interpretation

| Status | Meaning | UI Behavior |
|--------|---------|-------------|
| `null` | IDE not configured in MCP | No status indicator shown |
| `"connected"` | Active MCP connection | Selection indicator visible, diff tools available |
| `"disconnected"` | Was connected, now lost | Notification shown, reconnection attempted |

---

## Phase 5: Reconnection and Error Recovery

### Automatic Reconnection

When the IDE disconnects unexpectedly, Claude Code attempts automatic reconnection:

```javascript
// ============================================
// handleIdeDisconnect - Automatic reconnection logic
// Location: chunks.176.mjs (approx)
// ============================================

// READABLE (for understanding):
async function handleIdeDisconnect(ideConfig, updateState) {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 1000;  // Start with 1 second

    updateState({ ideStatus: "disconnected" });

    while (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;

        try {
            let client = await connectToIde(ideConfig);
            updateState({
                ideStatus: "connected",
                mcpClients: (prev) => [...prev.filter(c => c.name !== "ide"), client]
            });
            return;  // Success
        } catch (error) {
            // Exponential backoff
            await sleep(reconnectDelay * Math.pow(2, reconnectAttempts - 1));
        }
    }

    // Failed to reconnect after max attempts
    updateState({
        ideStatus: null,  // Treat as not configured
        notification: {
            key: "ide-disconnected",
            text: "IDE disconnected. Run /ide to reconnect.",
            color: "error"
        }
    });
}
```

### Error Handling Matrix

| Error Type | Behavior | User Action |
|------------|----------|-------------|
| `ENOENT` (IDE not running) | Set status to `null`, show hint | User starts IDE |
| `ECONNREFUSED` | Attempt reconnection with backoff | Wait for IDE restart |
| `401 Unauthorized` | Show "auth required" notification | User re-authenticates |
| `Protocol version mismatch` | Show error, no reconnection | Update extension |
| `Timeout` | Retry with increased timeout | Check network |

---

## Phase 6: Disconnection Cleanup

### Graceful Disconnect

When the session ends or IDE is explicitly disconnected:

```javascript
// ============================================
// disconnectFromIde - Clean disconnection
// Location: chunks.176.mjs (approx)
// ============================================

// READABLE (for understanding):
async function disconnectFromIde(ideClient) {
    // 1. Unsubscribe from all notifications
    ideClient.unsubscribeAll();

    // 2. Close any open diff tabs
    await closeAllDiffTabs(ideClient);

    // 3. Send disconnect notification
    await ideClient.notification({
        method: "notifications/ide_disconnected",
        params: { reason: "session_end" }
    });

    // 4. Close transport
    await ideClient.close();
}
```

---

## UI Integration Points

### Status Bar Integration

The IDE connection status affects several UI elements:

1. **Selection Indicator** (`IdeSelectionIndicator` - FWq):
   - Shows "⧉ N lines selected" when text is selected
   - Shows "⧉ In filename.ts" when cursor is in a file
   - Only rendered when `ideStatus === "connected"`

2. **Status Notifications** (`useIdeStatusMonitoring` - dLq):
   - Shows "/ide for {IDE Name}" hint when IDE detected but not connected
   - Shows "IDE disconnected" when connection is lost
   - Shows "IDE plugin not connected" for JetBrains-specific issues

3. **Diff Handler** (`IDEDiffHandler` - MPq):
   - Routes Edit tool diffs to IDE when connected
   - Falls back to terminal diff when disconnected

### Modal Priority

The IDE onboarding dialog is shown with medium priority in the modal stack:

```javascript
// Modal priority order (highest first):
// 1. sandbox-permission
// 2. tool-permission
// 3. worker-sandbox-permission
// 4. elicitation
// 5. ide-onboarding  <-- IDE dialogs here
```

---

## Cross-Module Integration

### With System Reminder

IDE diagnostics are included in system reminders:

```javascript
// IDE diagnostics become system reminder attachments
// when the LLM needs context about code errors

async function createDiagnosticAttachmentProducer() {
    let ideClient = findConnectedIdeClient(mcpClients);
    if (!ideClient) return null;

    let diagnostics = await ideClient.callTool("getAllDiagnostics", {});

    return {
        type: "ide_diagnostics",
        content: diagnostics,
        priority: "high"
    };
}
```

### With Permissions

Permission mode changes are synced to the IDE:

```javascript
// syncPermissionModeToIde - Send mode change to IDE
async function syncPermissionModeToIde(mode) {
    let ideClient = findConnectedIdeClient(mcpClients);
    if (!ideClient) return;

    await ideClient.callTool("setPermissionMode", { mode });
}
```

---

## Related Documents

- [overview.md](./overview.md) - High-level IDE integration architecture
- [ui_linkage.md](./ui_linkage.md) - UI components and React hooks
- [ide_tools.md](./ide_tools.md) - MCP tools exposed by IDE
- [../06_mcp/transport_layer.md](../06_mcp/transport_layer.md) - MCP transport implementations