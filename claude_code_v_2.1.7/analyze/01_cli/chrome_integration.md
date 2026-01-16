# Chrome Integration CLI Modes

## Overview

Claude Code v2.1.7 (introduced in v2.0.72) provides deep integration with the Claude Chrome extension through two dedicated CLI execution modes. This document covers the CLI aspects of Chrome integration including the MCP server mode and native messaging host mode.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `claudeInChromeMcp` (oX9) - Chrome MCP server startup
- `chromeNativeHostMain` (AI9) - Chrome native host main entry
- `ChromeNativeHostServer` (QI9) - Native host server class
- `NativeMessageReader` (BI9) - Native message reader class
- `getChromeIntegrationConfig` (oz1) - Get Chrome integration configuration
- `isChromePlatformSupported` (qB) - Check platform support

---

## Chrome Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Chrome Extension                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │   Browser Context ──────────────► Native Messaging ─────────────────►│   │
│  │   (Page access,                   (JSON protocol,                     │   │
│  │    screenshots)                    socket comm)                       │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         │ Native Messaging Host
                                         │ (--chrome-native-host)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ChromeNativeHostServer (QI9)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  - Reads length-prefixed JSON from stdin                             │   │
│  │  - Writes length-prefixed JSON to stdout                             │   │
│  │  - Creates Unix domain socket server                                 │   │
│  │  - Routes messages between extension and CLI                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         │ Unix Domain Socket
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Claude Code CLI (--chrome / --claude-in-chrome-mcp)      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  MCP Server Mode:                                                     │   │
│  │  - Provides Claude in Chrome tools via MCP protocol                  │   │
│  │  - Enables browser page access in Claude conversations               │   │
│  │  - Screenshot capture and page content extraction                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## CLI Execution Modes

### Mode 1: Chrome MCP Server (`--claude-in-chrome-mcp`)

**Entry Point:** `oX9()` (claudeInChromeMcp)

**Purpose:** Starts a dedicated MCP server that communicates with the Chrome extension via Unix domain socket.

**When Used:** Started automatically by the Chrome extension when needed for MCP tool access.

```javascript
// ============================================
// claudeInChromeMcp - Chrome MCP server startup
// Location: chunks.157.mjs:1599-1616
// ============================================

// ORIGINAL (for source lookup):
async function oX9() {
  let A = new rX9,  // ChromeLogger
    Q = {
      serverName: "Claude in Chrome",
      logger: A,
      socketPath: sfA(),  // getChromeMcpSocketPath
      clientTypeId: "claude-code",
      onAuthenticationError: () => {
        A.warn("Authentication error occurred...")
      },
      onToolCallDisconnected: () => {
        return `Browser extension is not connected...`
      }
    },
    B = PT0(Q),     // createMcpServer
    G = new kuA;    // StdioTransport
  k("[Claude in Chrome] Starting MCP server");  // debug
  await B.connect(G);
  k("[Claude in Chrome] MCP server started")
}

// READABLE (for understanding):
async function claudeInChromeMcp() {
  const logger = new ChromeLogger();

  const config = {
    serverName: "Claude in Chrome",
    logger: logger,
    socketPath: getChromeMcpSocketPath(),
    clientTypeId: "claude-code",
    onAuthenticationError: () => {
      logger.warn("Authentication error occurred...");
    },
    onToolCallDisconnected: () => {
      return `Browser extension is not connected...`;
    }
  };

  const mcpServer = createMcpServer(config);
  const transport = new StdioTransport();

  debug("[Claude in Chrome] Starting MCP server");
  await mcpServer.connect(transport);
  debug("[Claude in Chrome] MCP server started");
}

// Mapping: oX9→claudeInChromeMcp, rX9→ChromeLogger, sfA→getChromeMcpSocketPath,
//          PT0→createMcpServer, kuA→StdioTransport, k→debug
```

### Mode 2: Chrome Native Host (`--chrome-native-host`)

**Entry Point:** `AI9()` (chromeNativeHostMain)

**Purpose:** Runs as a Chrome Native Messaging host, receiving messages from the extension via stdin and responding via stdout using the native messaging protocol.

**When Used:** Launched by Chrome when the extension needs to communicate with Claude Code.

```javascript
// ============================================
// chromeNativeHostMain - Chrome native host entry
// Location: chunks.157.mjs:1666-1677
// ============================================

// ORIGINAL (for source lookup):
async function AI9() {
  FW("Initializing...");  // logNativeHost
  let A = new QI9,        // ChromeNativeHostServer
    Q = new BI9;          // NativeMessageReader
  await A.start();
  while (!0) {
    let B = await Q.read();
    if (B === null) break;
    await A.handleMessage(B)
  }
  await A.stop()
}

// READABLE (for understanding):
async function chromeNativeHostMain() {
  logNativeHost("Initializing...");

  const server = new ChromeNativeHostServer();
  const reader = new NativeMessageReader();

  await server.start();

  // Main message loop - read until stdin closes
  while (true) {
    const message = await reader.read();
    if (message === null) break;  // stdin closed
    await server.handleMessage(message);
  }

  await server.stop();
}

// Mapping: AI9→chromeNativeHostMain, FW→logNativeHost,
//          QI9→ChromeNativeHostServer, BI9→NativeMessageReader
```

---

## Chrome Native Messaging Protocol

### Message Format

Chrome native messaging uses length-prefixed JSON:

```
┌──────────────────────────────────────────────────────────────────┐
│  4 bytes     │            Variable length                        │
│  (uint32 LE) │            (JSON payload)                         │
│  Length      │            Message                                │
└──────────────────────────────────────────────────────────────────┘
```

### NativeMessageReader

```javascript
// ============================================
// NativeMessageReader - Read native messages from stdin
// Location: chunks.157.mjs:1818-1857
// ============================================

// ORIGINAL (for source lookup):
class BI9 {
  constructor() {
    this.buffer = Buffer.alloc(0);
    this.pendingResolve = null;
    this.closed = !1;
    process.stdin.on("data", (A) => {
      this.buffer = Buffer.concat([this.buffer, A]);
      this.tryReadMessage()
    });
    process.stdin.on("end", () => {
      this.closed = !0;
      if (this.pendingResolve) this.pendingResolve(null)
    })
  }
  async read() {
    if (this.closed && this.buffer.length < 4) return null;
    let A = this.tryReadMessage();
    if (A) return A;
    return new Promise((Q) => {
      this.pendingResolve = Q
    })
  }
  tryReadMessage() {
    if (this.buffer.length < 4) return null;
    let A = this.buffer.readUInt32LE(0);  // Read 4-byte length
    if (this.buffer.length < 4 + A) return null;
    let Q = this.buffer.subarray(4, 4 + A).toString("utf8"),  // Extract JSON
      B = AQ(Q);  // Parse JSON
    this.buffer = this.buffer.subarray(4 + A);  // Remove from buffer
    if (this.pendingResolve) {
      let G = this.pendingResolve;
      this.pendingResolve = null;
      G(B)
    }
    return B
  }
}

// READABLE (for understanding):
class NativeMessageReader {
  constructor() {
    this.buffer = Buffer.alloc(0);
    this.pendingResolve = null;
    this.closed = false;

    // Collect data from stdin
    process.stdin.on("data", (data) => {
      this.buffer = Buffer.concat([this.buffer, data]);
      this.tryReadMessage();
    });

    // Handle stdin close
    process.stdin.on("end", () => {
      this.closed = true;
      if (this.pendingResolve) this.pendingResolve(null);
    });
  }

  async read() {
    if (this.closed && this.buffer.length < 4) return null;

    // Try to read a complete message
    const message = this.tryReadMessage();
    if (message) return message;

    // Wait for more data
    return new Promise((resolve) => {
      this.pendingResolve = resolve;
    });
  }

  tryReadMessage() {
    // Need at least 4 bytes for length prefix
    if (this.buffer.length < 4) return null;

    // Read message length (little-endian uint32)
    const length = this.buffer.readUInt32LE(0);

    // Check if full message received
    if (this.buffer.length < 4 + length) return null;

    // Extract and parse JSON message
    const jsonStr = this.buffer.subarray(4, 4 + length).toString("utf8");
    const message = JSON.parse(jsonStr);

    // Remove processed bytes from buffer
    this.buffer = this.buffer.subarray(4 + length);

    // Resolve pending read if any
    if (this.pendingResolve) {
      const resolve = this.pendingResolve;
      this.pendingResolve = null;
      resolve(message);
    }

    return message;
  }
}

// Mapping: BI9→NativeMessageReader, AQ→JSON.parse
```

### ChromeNativeHostServer

```javascript
// ============================================
// ChromeNativeHostServer - Native host server
// Location: chunks.157.mjs:1679-1816
// ============================================

// ORIGINAL (for source lookup):
class QI9 {
  constructor() {
    this.socketPath = rX();  // getNativeHostSocketPath
    this.server = null;
    this.connections = [];
    this.messageId = 0
  }

  async start() {
    // Remove existing socket file
    if (sX9(this.socketPath)) tX9(this.socketPath);

    // Create Unix domain socket server
    this.server = OU7((A) => {
      FW("Client connected");
      this.connections.push(A);
      A.on("data", (Q) => {
        // Forward data from socket to stdout as native message
        this.sendNativeMessage(AQ(Q.toString()))
      });
      A.on("close", () => {
        FW("Client disconnected");
        this.connections = this.connections.filter((Q) => Q !== A)
      })
    });

    await new Promise((A, Q) => {
      this.server.listen(this.socketPath, () => {
        FW(`Server listening on ${this.socketPath}`);
        // Set socket permissions
        MU7(this.socketPath, 448);  // 0700
        A()
      });
      this.server.on("error", Q)
    })
  }

  async handleMessage(A) {
    // Route message from extension to all connected clients
    for (let Q of this.connections)
      Q.write(eA(A))  // JSON.stringify
  }

  sendNativeMessage(A) {
    // Write length-prefixed JSON to stdout
    let Q = Buffer.from(eA(A)),
      B = Buffer.alloc(4);
    B.writeUInt32LE(Q.length, 0);
    process.stdout.write(Buffer.concat([B, Q]))
  }

  async stop() {
    for (let A of this.connections) A.destroy();
    if (this.server) await new Promise((A) => this.server.close(A))
  }
}

// READABLE (for understanding):
class ChromeNativeHostServer {
  constructor() {
    this.socketPath = getNativeHostSocketPath();
    this.server = null;
    this.connections = [];
    this.messageId = 0;
  }

  async start() {
    // Clean up existing socket
    if (existsSync(this.socketPath)) {
      unlinkSync(this.socketPath);
    }

    // Create Unix domain socket server
    this.server = createServer((socket) => {
      logNativeHost("Client connected");
      this.connections.push(socket);

      // Forward socket data to Chrome extension
      socket.on("data", (data) => {
        this.sendNativeMessage(JSON.parse(data.toString()));
      });

      socket.on("close", () => {
        logNativeHost("Client disconnected");
        this.connections = this.connections.filter((s) => s !== socket);
      });
    });

    await new Promise((resolve, reject) => {
      this.server.listen(this.socketPath, () => {
        logNativeHost(`Server listening on ${this.socketPath}`);
        // Set secure permissions (owner only)
        chmodSync(this.socketPath, 0o700);
        resolve();
      });
      this.server.on("error", reject);
    });
  }

  async handleMessage(message) {
    // Forward message from Chrome to all CLI connections
    for (const connection of this.connections) {
      connection.write(JSON.stringify(message));
    }
  }

  sendNativeMessage(message) {
    // Write length-prefixed JSON to stdout (Chrome native messaging format)
    const jsonBuffer = Buffer.from(JSON.stringify(message));
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);
    process.stdout.write(Buffer.concat([lengthBuffer, jsonBuffer]));
  }

  async stop() {
    // Close all connections
    for (const connection of this.connections) {
      connection.destroy();
    }
    // Close server
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }
  }
}

// Mapping: QI9→ChromeNativeHostServer, rX→getNativeHostSocketPath,
//          OU7→createServer, sX9→existsSync, tX9→unlinkSync, MU7→chmodSync,
//          eA→JSON.stringify, FW→logNativeHost
```

---

## Chrome CLI Flags

### --chrome / --no-chrome

Enable or disable Chrome integration in interactive mode.

```javascript
// ============================================
// chromeFlags - Chrome integration toggle
// Location: chunks.157.mjs:21
// ============================================

// ORIGINAL (for source lookup):
.option("--chrome", "Enable Claude in Chrome integration")
.option("--no-chrome", "Disable Claude in Chrome integration")

// These flags control whether the Chrome MCP server is initialized
// when starting Claude Code in interactive mode
```

### Integration Setup

```javascript
// ============================================
// chromeIntegrationSetup - Setup Chrome in main handler
// Location: chunks.157.mjs:208-244
// ============================================

// ORIGINAL (for source lookup):
let A1 = az1(I.chrome) && qB(),  // parseBoolean && isChromePlatformSupported
  n1 = !A1 && I$A();             // shouldAutoEnableChrome

if (A1) {
  // Explicit --chrome flag
  let PQ = $Q();  // getPlatform
  try {
    l("tengu_claude_in_chrome_setup", { platform: PQ });
    let { mcpConfig: z2, allowedTools: w4, systemPrompt: Y6 } = oz1();  // getChromeIntegrationConfig
    // Merge Chrome MCP config
    J1 = { ...J1, ...z2 };
    // Add Chrome-allowed tools
    H.push(...w4);
    // Prepend Chrome system prompt
    if (Y6) xA = xA ? `${Y6}\n\n${xA}` : Y6
  } catch (z2) {
    l("tengu_claude_in_chrome_setup_failed", { platform: PQ });
    k(`[Claude in Chrome] Error: ${z2}`);
    e(z2 instanceof Error ? z2 : Error(String(z2)));
    console.error("Error: Failed to run with Claude in Chrome.");
    process.exit(1)
  }
} else if (n1) {
  // Auto-enable (no explicit flag, but conditions met)
  try {
    let { mcpConfig: PQ } = oz1();
    J1 = { ...J1, ...PQ };
    xA = xA ? `${xA}\n\n${xT0}` : xT0  // CHROME_AUTO_PROMPT
  } catch (PQ) {
    k(`[Claude in Chrome] Error (auto-enable): ${PQ}`)
  }
}

// READABLE (for understanding):
const chromeExplicitlyEnabled = parseBoolean(parsedOptions.chrome) && isChromePlatformSupported();
const chromeAutoEnabled = !chromeExplicitlyEnabled && shouldAutoEnableChrome();

if (chromeExplicitlyEnabled) {
  // User explicitly requested Chrome integration
  const platform = getPlatform();
  try {
    trackEvent("tengu_claude_in_chrome_setup", { platform });
    const { mcpConfig, allowedTools, systemPrompt } = getChromeIntegrationConfig();

    // Merge Chrome MCP configuration
    dynamicMcpConfig = { ...dynamicMcpConfig, ...mcpConfig };

    // Add Chrome-specific allowed tools
    allowedToolsList.push(...allowedTools);

    // Add Chrome system prompt
    if (systemPrompt) {
      appendSystemPrompt = appendSystemPrompt
        ? `${systemPrompt}\n\n${appendSystemPrompt}`
        : systemPrompt;
    }
  } catch (error) {
    trackEvent("tengu_claude_in_chrome_setup_failed", { platform });
    debug(`[Claude in Chrome] Error: ${error}`);
    logError(error instanceof Error ? error : Error(String(error)));
    console.error("Error: Failed to run with Claude in Chrome.");
    process.exit(1);
  }
} else if (chromeAutoEnabled) {
  // Auto-enable Chrome when conditions are met
  try {
    const { mcpConfig } = getChromeIntegrationConfig();
    dynamicMcpConfig = { ...dynamicMcpConfig, ...mcpConfig };
    appendSystemPrompt = appendSystemPrompt
      ? `${appendSystemPrompt}\n\n${CHROME_AUTO_PROMPT}`
      : CHROME_AUTO_PROMPT;
  } catch (error) {
    debug(`[Claude in Chrome] Error (auto-enable): ${error}`);
    // Silently fail for auto-enable
  }
}

// Mapping: az1→parseBoolean, qB→isChromePlatformSupported, I$A→shouldAutoEnableChrome,
//          oz1→getChromeIntegrationConfig, xT0→CHROME_AUTO_PROMPT
```

---

## Platform Support

Chrome integration is only available on supported platforms:

```javascript
// Platform support check (qB/isChromePlatformSupported)
// - macOS: Supported
// - Windows: Supported (via WSL detection)
// - Linux: Limited support

function isChromePlatformSupported() {
  const platform = process.platform;
  return platform === "darwin" || platform === "win32";
}
```

---

## Socket Paths

### MCP Socket Path

```javascript
// ============================================
// getChromeMcpSocketPath - Get socket path for MCP server
// Location: chunks.157.mjs (sfA)
// ============================================

function getChromeMcpSocketPath() {
  // Returns path like: ~/.claude/chrome-mcp.sock
  // or appropriate path for platform
  return join(getClaudeDataDir(), "chrome-mcp.sock");
}
```

### Native Host Socket Path

```javascript
// ============================================
// getNativeHostSocketPath - Get socket path for native host
// Location: chunks.157.mjs (rX)
// ============================================

function getNativeHostSocketPath() {
  // Returns path like: ~/.claude/native-host.sock
  return join(getClaudeDataDir(), "native-host.sock");
}
```

---

## Chrome Integration Configuration

The Chrome integration configuration includes:

```javascript
// ============================================
// getChromeIntegrationConfig - Get Chrome config
// Location: chunks.157.mjs (oz1)
// ============================================

// Returns:
// {
//   mcpConfig: {
//     "claude-in-chrome": {
//       type: "stdio",
//       command: "claude",
//       args: ["--claude-in-chrome-mcp"],
//       scope: "dynamic"
//     }
//   },
//   allowedTools: ["mcp__claude-in-chrome__*"],
//   systemPrompt: "... instructions for browser interaction ..."
// }
```

---

## Telemetry Events

| Event | Trigger |
|-------|---------|
| `cli_claude_in_chrome_mcp_path` | `--claude-in-chrome-mcp` mode starts |
| `cli_chrome_native_host_path` | `--chrome-native-host` mode starts |
| `tengu_claude_in_chrome_setup` | Chrome integration setup begins |
| `tengu_claude_in_chrome_setup_failed` | Chrome setup fails |

---

## Error Handling

### MCP Server Errors

```javascript
// MCP server configuration includes error callbacks:
{
  onAuthenticationError: () => {
    logger.warn("Authentication error occurred...");
  },
  onToolCallDisconnected: () => {
    return `Browser extension is not connected...`;
  }
}
```

### Native Host Errors

```javascript
// Native host logs errors and continues:
server.on("error", (error) => {
  logNativeHost(`Server error: ${error}`);
});
```

---

## Security Considerations

1. **Socket Permissions:** Socket files are created with 0700 permissions (owner only)
2. **Local Only:** Communication is via Unix domain sockets, not network sockets
3. **Process Isolation:** Native host runs as separate process from main CLI
4. **Authentication:** MCP server validates client type ID

---

## Summary

| Mode | Flag | Purpose |
|------|------|---------|
| Chrome MCP | `--claude-in-chrome-mcp` | MCP server for extension tools |
| Native Host | `--chrome-native-host` | Native messaging bridge |
| Enable | `--chrome` | Enable Chrome in interactive mode |
| Disable | `--no-chrome` | Disable Chrome integration |

The Chrome integration enables Claude Code to interact with browser pages, capture screenshots, and access page content through the Claude Chrome extension.
