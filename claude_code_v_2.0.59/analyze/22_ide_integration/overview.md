# IDE Integration

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code supports deep integration with IDEs through a bidirectional communication channel. The integration enables:
1. **Real-time file synchronization** - IDE notifies Claude of file changes
2. **LSP diagnostics** - Receives compiler errors, warnings, type errors
3. **Multiple transport protocols** - WebSocket or SSE (Server-Sent Events)
4. **Multi-IDE support** - VSCode-based and JetBrains IDEs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IDE Integration Layer                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  IDE Detection (wIA Config)                 │   │
│  │  Cursor, Windsurf, VSCode, IntelliJ, PyCharm, WebStorm...  │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│                             ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Lock File Parser (QB2)                         │   │
│  │  Reads ~/.claude/ide/*.lock files                          │   │
│  │  Extracts: port, pid, workspaceFolders, transport type     │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│              ┌──────────────┴──────────────┐                       │
│              ▼                              ▼                       │
│  ┌───────────────────┐          ┌───────────────────┐              │
│  │  WebSocket (bQ1)  │          │    SSE (NQ1)      │              │
│  │  ws://host:port   │          │  http://host/sse  │              │
│  │  Full-duplex      │          │  + HTTP POST      │              │
│  └─────────┬─────────┘          └─────────┬─────────┘              │
│            │                              │                         │
│            └──────────────┬───────────────┘                        │
│                           ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              MCP Protocol Communication                     │   │
│  │  - ide_connected notification                               │   │
│  │  - textDocument/publishDiagnostics                         │   │
│  │  - File change/save notifications                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Supported IDEs

### IDE Configuration Map (wIA)

The system maintains a configuration map for 18+ supported IDEs:

| IDE | Type | Extension |
|-----|------|-----------|
| Cursor | vscode | anthropic.claude-code |
| Windsurf | vscode | anthropic.claude-code |
| VS Code | vscode | anthropic.claude-code |
| IntelliJ IDEA | jetbrains | claude-code-jetbrains-plugin |
| PyCharm | jetbrains | claude-code-jetbrains-plugin |
| WebStorm | jetbrains | claude-code-jetbrains-plugin |
| PhpStorm | jetbrains | claude-code-jetbrains-plugin |
| RubyMine | jetbrains | claude-code-jetbrains-plugin |
| CLion | jetbrains | claude-code-jetbrains-plugin |
| GoLand | jetbrains | claude-code-jetbrains-plugin |
| Rider | jetbrains | claude-code-jetbrains-plugin |
| DataGrip | jetbrains | claude-code-jetbrains-plugin |
| AppCode | jetbrains | claude-code-jetbrains-plugin |
| DataSpell | jetbrains | claude-code-jetbrains-plugin |
| Aqua | jetbrains | claude-code-jetbrains-plugin |
| Gateway | jetbrains | claude-code-jetbrains-plugin |
| Fleet | jetbrains | claude-code-jetbrains-plugin |
| Android Studio | jetbrains | claude-code-jetbrains-plugin |

### IDE Type Check Functions

```javascript
// ============================================
// isVSCodeIDE - Check if IDE is VSCode-based
// Location: chunks.93.mjs:2615-2619
// ============================================

// ORIGINAL (for source lookup):
function PQ1(A) {
  if (!A) return !1;
  let Q = wIA[A];
  return Q && Q.ideKind === "vscode"
}

// READABLE (for understanding):
function isVSCodeIDE(ideName) {
  if (!ideName) return false;
  let ideConfig = IDE_CONFIG_MAP[ideName];
  return ideConfig && ideConfig.ideKind === "vscode";
}

// Mapping: PQ1→isVSCodeIDE, A→ideName, wIA→IDE_CONFIG_MAP
```

```javascript
// ============================================
// isJetBrainsIDE - Check if IDE is JetBrains-based
// Location: chunks.93.mjs:2621-2625
// ============================================

// ORIGINAL (for source lookup):
function oT(A) {
  if (!A) return !1;
  let Q = wIA[A];
  return Q && Q.ideKind === "jetbrains"
}

// READABLE (for understanding):
function isJetBrainsIDE(ideName) {
  if (!ideName) return false;
  let ideConfig = IDE_CONFIG_MAP[ideName];
  return ideConfig && ideConfig.ideKind === "jetbrains";
}

// Mapping: oT→isJetBrainsIDE, A→ideName, wIA→IDE_CONFIG_MAP
```

---

## 2. IDE Detection

### Lock File Discovery

IDEs write lock files to `~/.claude/ide/` directory. Each lock file contains connection information.

```javascript
// ============================================
// getIDELockFiles - Discover IDE lock files
// Location: chunks.93.mjs:2632-2650
// ============================================

// ORIGINAL (for source lookup):
function jQ1() {
  try {
    return m25().flatMap((B) => {
      try {
        return RA().readdirSync(B).filter((G) => G.name.endsWith(".lock")).map((G) => {
          let Z = He1(B, G.name);
          return {
            path: Z,
            mtime: RA().statSync(Z).mtime
          }
        })
      } catch (G) {
        return AA(G), []
      }
    }).sort((B, G) => G.mtime.getTime() - B.mtime.getTime()).map((B) => B.path)
  } catch (A) {
    return AA(A), []
  }
}

// READABLE (for understanding):
function getIDELockFiles() {
  try {
    return getIDEDirectories().flatMap((ideDir) => {
      try {
        return fs.readdirSync(ideDir)
          .filter((entry) => entry.name.endsWith(".lock"))
          .map((entry) => {
            let fullPath = pathJoin(ideDir, entry.name);
            return {
              path: fullPath,
              mtime: fs.statSync(fullPath).mtime
            };
          });
      } catch (error) {
        logError(error);
        return [];
      }
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())  // Most recent first
    .map((entry) => entry.path);
  } catch (error) {
    logError(error);
    return [];
  }
}

// Mapping: jQ1→getIDELockFiles, m25→getIDEDirectories, RA→fs, He1→pathJoin
```

### Lock File Parser

```javascript
// ============================================
// parseLockFile - Parse IDE lock file content
// Location: chunks.93.mjs:2652-2684
// ============================================

// ORIGINAL (for source lookup):
function QB2(A) {
  try {
    let Q = RA().readFileSync(A, { encoding: "utf-8" }),
      B = [], G, Z, I = !1, Y = !1, J;
    try {
      let V = JSON.parse(Q);
      if (V.workspaceFolders) B = V.workspaceFolders;
      G = V.pid, Z = V.ideName, I = V.transport === "ws",
      Y = V.runningInWindows === !0, J = V.authToken
    } catch (V) {
      B = Q.split(`\n`).map((F) => F.trim())
    }
    let W = A.split(RQ1).pop();
    if (!W) return null;
    let X = W.replace(".lock", "");
    return {
      workspaceFolders: B,
      port: parseInt(X),
      pid: G,
      ideName: Z,
      useWebSocket: I,
      runningInWindows: Y,
      authToken: J
    }
  } catch (Q) {
    return AA(Q), null
  }
}

// READABLE (for understanding):
function parseLockFile(lockFilePath) {
  try {
    let content = fs.readFileSync(lockFilePath, { encoding: "utf-8" });
    let workspaceFolders = [];
    let pid, ideName;
    let useWebSocket = false;
    let runningInWindows = false;
    let authToken;

    try {
      // Try parsing as JSON (modern format)
      let parsed = JSON.parse(content);
      if (parsed.workspaceFolders) workspaceFolders = parsed.workspaceFolders;
      pid = parsed.pid;
      ideName = parsed.ideName;
      useWebSocket = parsed.transport === "ws";
      runningInWindows = parsed.runningInWindows === true;
      authToken = parsed.authToken;
    } catch (parseError) {
      // Fallback: legacy format (line-separated paths)
      workspaceFolders = content.split('\n').map((line) => line.trim());
    }

    // Extract port from filename (e.g., "12345.lock" -> 12345)
    let filename = lockFilePath.split(PATH_SEPARATOR).pop();
    if (!filename) return null;
    let port = parseInt(filename.replace(".lock", ""));

    return {
      workspaceFolders,
      port,
      pid,
      ideName,
      useWebSocket,
      runningInWindows,
      authToken
    };
  } catch (error) {
    logError(error);
    return null;
  }
}

// Mapping: QB2→parseLockFile, A→lockFilePath, RQ1→PATH_SEPARATOR
```

**Lock File Structure (JSON format):**
```json
{
  "workspaceFolders": ["/path/to/project1", "/path/to/project2"],
  "pid": 12345,
  "ideName": "vscode",
  "transport": "ws",
  "runningInWindows": false,
  "authToken": "optional-bearer-token"
}
```

---

## 3. Transport Protocols

### WebSocket Transport (bQ1)

Full-duplex bidirectional communication.

```javascript
// ============================================
// WebSocketTransport - WebSocket-based MCP transport
// Location: chunks.94.mjs:410-466
// ============================================

// ORIGINAL (for source lookup):
class bQ1 {
  ws;
  started = !1;
  opened;
  constructor(A) {
    this.ws = A;
    this.opened = new Promise((Q, B) => {
      if (this.ws.readyState === __.OPEN) Q();
      else this.ws.on("open", () => { Q() }),
           this.ws.on("error", (G) => {
             k6("error", "mcp_websocket_connect_fail"), B(G)
           })
    });
    this.ws.on("message", this.onMessageHandler);
    this.ws.on("error", this.onErrorHandler);
    this.ws.on("close", this.onCloseHandler);
  }

  onMessageHandler = (A) => {
    try {
      let Q = JSON.parse(A.toString("utf-8")),
        B = Mk.parse(Q);
      this.onmessage?.(B)
    } catch (Q) {
      this.onErrorHandler(Q)
    }
  };

  onErrorHandler = (A) => {
    k6("error", "mcp_websocket_message_fail");
    this.onerror?.(A instanceof Error ? A : Error("Failed to process message"))
  };

  onCloseHandler = () => {
    this.onclose?.();
    this.ws.off("message", this.onMessageHandler);
    this.ws.off("error", this.onErrorHandler);
    this.ws.off("close", this.onCloseHandler);
  };

  async start() {
    if (this.started) throw Error("Start can only be called once per transport.");
    if (await this.opened, this.ws.readyState !== __.OPEN) {
      k6("error", "mcp_websocket_start_not_opened");
      throw Error("WebSocket is not open. Cannot start transport.");
    }
    this.started = !0
  }

  async close() {
    if (this.ws.readyState === __.OPEN || this.ws.readyState === __.CONNECTING) {
      this.ws.close();
    }
    this.onCloseHandler()
  }

  async send(A) {
    if (this.ws.readyState !== __.OPEN) {
      k6("error", "mcp_websocket_send_not_opened");
      throw Error("WebSocket is not open. Cannot send message.");
    }
    let Q = JSON.stringify(A);
    await new Promise((B, G) => {
      this.ws.send(Q, (Z) => {
        if (Z) G(Z);
        else B()
      })
    })
  }
}

// READABLE (for understanding):
class WebSocketTransport {
  constructor(ws) {
    this.ws = ws;
    this.started = false;
    this.opened = new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.ws.on("open", () => resolve());
        this.ws.on("error", (error) => {
          trackTelemetry("error", "mcp_websocket_connect_fail");
          reject(error);
        });
      }
    });

    this.ws.on("message", this.onMessageHandler);
    this.ws.on("error", this.onErrorHandler);
    this.ws.on("close", this.onCloseHandler);
  }

  onMessageHandler = (data) => {
    try {
      let jsonData = JSON.parse(data.toString("utf-8"));
      let validated = MCPMessageSchema.parse(jsonData);
      this.onmessage?.(validated);
    } catch (error) {
      this.onErrorHandler(error);
    }
  };

  async send(message) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw Error("WebSocket is not open. Cannot send message.");
    }
    let jsonMessage = JSON.stringify(message);
    await new Promise((resolve, reject) => {
      this.ws.send(jsonMessage, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

// Mapping: bQ1→WebSocketTransport, k6→trackTelemetry, Mk→MCPMessageSchema
```

### SSE Transport (NQ1)

Server-Sent Events for server→client, HTTP POST for client→server.

```javascript
// ============================================
// SSETransport - SSE-based MCP transport
// Location: chunks.93.mjs:1932-2062
// ============================================

// READABLE pseudocode:
class SSETransport {
  constructor(url, options) {
    this._url = url;
    this._eventSourceInit = options?.eventSourceInit;
    this._requestInit = options?.requestInit;
    this._authProvider = options?.authProvider;
    this._fetch = options?.fetch;
  }

  async _commonHeaders() {
    let headers = {};
    if (this._authProvider) {
      let tokens = await this._authProvider.tokens();
      if (tokens) {
        headers.Authorization = `Bearer ${tokens.access_token}`;
      }
    }
    if (this._protocolVersion) {
      headers["mcp-protocol-version"] = this._protocolVersion;
    }
    return new Headers(headers);
  }

  _startOrAuth() {
    return new Promise((resolve, reject) => {
      // Create EventSource for receiving server events
      this._eventSource = new EventSource(this._url.href, {
        ...this._eventSourceInit,
        fetch: async (url, init) => {
          let headers = await this._commonHeaders();
          headers.set("Accept", "text/event-stream");
          let response = await fetch(url, { ...init, headers });

          // Handle 401 authentication required
          if (response.status === 401 && response.headers.has("www-authenticate")) {
            this._resourceMetadataUrl = extractResourceMetadata(response);
          }
          return response;
        }
      });

      // Handle endpoint event (provides POST endpoint URL)
      this._eventSource.addEventListener("endpoint", (event) => {
        try {
          this._endpoint = new URL(event.data, this._url);
          if (this._endpoint.origin !== this._url.origin) {
            throw Error(`Endpoint origin mismatch: ${this._endpoint.origin}`);
          }
          resolve();
        } catch (error) {
          reject(error);
          this.close();
        }
      });

      // Handle incoming messages
      this._eventSource.onmessage = (event) => {
        let validated = MCPMessageSchema.parse(JSON.parse(event.data));
        this.onmessage?.(validated);
      };
    });
  }

  async send(message) {
    if (!this._endpoint) throw Error("Not connected");

    let headers = await this._commonHeaders();
    headers.set("content-type", "application/json");

    let response = await fetch(this._endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw Error(`Error POSTing to endpoint (HTTP ${response.status})`);
    }
  }
}

// Mapping: NQ1→SSETransport
```

---

## 4. Connection Lifecycle

### Get Available IDE Connections

```javascript
// ============================================
// getAvailableIDEConnections - Find valid IDE connections
// Location: chunks.93.mjs:2815-2870
// ============================================

// READABLE pseudocode:
async function getAvailableIDEConnections(includeInvalid = false) {
  let connections = [];

  try {
    let forcedPort = process.env.CLAUDE_CODE_SSE_PORT;
    let currentWorkingDir = getCwd();
    let lockFiles = getIDELockFiles();

    for (let lockPath of lockFiles) {
      let lockInfo = parseLockFile(lockPath);
      if (!lockInfo) continue;

      // Skip if IDE process not running (on non-WSL systems)
      if (getOS() !== "wsl" && isTerminal() && (!lockInfo.pid || !isProcessRunning(lockInfo.pid))) {
        continue;
      }

      // Check if workspace matches current directory
      let isValid = false;
      if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") {
        isValid = true;
      } else if (lockInfo.port === parseInt(forcedPort)) {
        isValid = true;
      } else {
        isValid = lockInfo.workspaceFolders.some((folder) => {
          let normalizedFolder = normalizePath(folder);
          return currentWorkingDir === normalizedFolder ||
                 currentWorkingDir.startsWith(normalizedFolder + PATH_SEPARATOR);
        });
      }

      if (!isValid && !includeInvalid) continue;

      // Determine connection URL based on transport type
      let host = await getIDEHost(lockInfo.runningInWindows, lockInfo.port);
      let url;
      if (lockInfo.useWebSocket) {
        url = `ws://${host}:${lockInfo.port}`;
      } else {
        url = `http://${host}:${lockInfo.port}/sse`;
      }

      connections.push({
        url,
        name: lockInfo.ideName ?? "IDE",
        workspaceFolders: lockInfo.workspaceFolders,
        port: lockInfo.port,
        isValid,
        authToken: lockInfo.authToken,
        ideRunningInWindows: lockInfo.runningInWindows
      });
    }
  } catch (error) {
    logError(error);
  }

  return connections;
}

// Mapping: HLA→getAvailableIDEConnections
```

### IDE Connected Notification

```javascript
// ============================================
// notifyIDEConnected - Send connection notification to IDE
// Location: chunks.93.mjs:2872-2879
// ============================================

// ORIGINAL (for source lookup):
async function BB2(A) {
  await A.notification({
    method: "ide_connected",
    params: {
      pid: process.pid
    }
  })
}

// READABLE (for understanding):
async function notifyIDEConnected(mcpClient) {
  await mcpClient.notification({
    method: "ide_connected",
    params: {
      pid: process.pid
    }
  });
}

// Mapping: BB2→notifyIDEConnected, A→mcpClient
```

---

## 5. LSP Diagnostics

### Diagnostics Handler Registration

```javascript
// ============================================
// registerDiagnosticsHandler - Handle LSP diagnostic notifications
// Location: chunks.122.mjs:2344-2383
// ============================================

// ORIGINAL (for source lookup):
J.onNotification("textDocument/publishDiagnostics", async (W) => {
  g(`[PASSIVE DIAGNOSTICS] Handler invoked for ${Y}! Params type: ${typeof W}`);
  try {
    if (!W || typeof W !== "object" || !("uri" in W) || !("diagnostics" in W)) {
      let K = Error(`LSP server ${Y} sent invalid diagnostic params`);
      AA(K);
      return
    }
    let X = W;
    g(`Received diagnostics from ${Y}: ${X.diagnostics.length} diagnostic(s) for ${X.uri}`);
    let V = Eu5(X), F = V[0];
    if (!F || V.length === 0 || F.diagnostics.length === 0) {
      g(`Skipping empty diagnostics from ${Y} for ${X.uri}`);
      return
    }
    try {
      wI2({
        serverName: Y,
        files: V
      });
      g(`LSP Diagnostics: Registered ${V.length} diagnostic file(s) from ${Y}`);
      Z.delete(Y)
    } catch (K) {
      // Handle error with 3-strikes retry tracking
      let H = Z.get(Y) || { count: 0, lastError: "" };
      H.count++;
      H.lastError = K.message;
      Z.set(Y, H);
      if (H.count >= 3) {
        g(`WARNING: LSP diagnostic handler for ${Y} has failed ${H.count} times`);
      }
    }
  } catch (X) {
    // Track consecutive failures
  }
})

// READABLE (for understanding):
lspServer.onNotification("textDocument/publishDiagnostics", async (params) => {
  logger(`[PASSIVE DIAGNOSTICS] Handler invoked for ${serverName}!`);

  try {
    // Validate params structure
    if (!params || typeof params !== "object" || !("uri" in params) || !("diagnostics" in params)) {
      logError(Error(`LSP server ${serverName} sent invalid diagnostic params`));
      return;
    }

    logger(`Received diagnostics from ${serverName}: ${params.diagnostics.length} for ${params.uri}`);

    // Parse and filter diagnostics
    let parsedFiles = parseDiagnostics(params);
    let firstFile = parsedFiles[0];

    // Skip empty diagnostics
    if (!firstFile || parsedFiles.length === 0 || firstFile.diagnostics.length === 0) {
      logger(`Skipping empty diagnostics from ${serverName}`);
      return;
    }

    try {
      // Register diagnostics for async delivery to model
      registerDiagnostics({
        serverName: serverName,
        files: parsedFiles
      });
      logger(`Registered ${parsedFiles.length} diagnostic file(s) from ${serverName}`);

      // Clear error counter on success
      errorCounters.delete(serverName);
    } catch (error) {
      // Track consecutive failures (3-strikes rule)
      let counter = errorCounters.get(serverName) || { count: 0, lastError: "" };
      counter.count++;
      counter.lastError = error.message;
      errorCounters.set(serverName, counter);

      if (counter.count >= 3) {
        logger(`WARNING: LSP handler for ${serverName} failed ${counter.count} times`);
      }
    }
  } catch (error) {
    // Handle unexpected errors
  }
});

// Mapping: J→lspServer, Y→serverName, W→params, Eu5→parseDiagnostics,
// wI2→registerDiagnostics, Z→errorCounters
```

**Key insight:** The 3-strikes rule allows temporary LSP failures without disrupting the system. After 3 consecutive failures, a warning is logged but the handler continues trying.

---

## 6. Extension Installation

### VSCode Extension Installation

```javascript
// ============================================
// installVSCodeExtension - Install Claude Code extension
// Location: chunks.93.mjs:2897-2916
// ============================================

// ORIGINAL (for source lookup):
async function i25(A) {
  if (PQ1(A)) {
    let Q = GB2(A);
    if (Q) {
      let B = await n25(Q);
      if (!B || eQ2.lt(B, oQ2())) {
        await new Promise((Z) => { setTimeout(Z, 500) });
        let G = await A3(Q, ["--force", "--install-extension", "anthropic.claude-code"], {
          env: Ee1()
        });
        if (G.code !== 0) throw Error(`${G.code}: ${G.error} ${G.stderr}`);
        B = oQ2()
      }
      return B
    }
  }
  return null
}

// READABLE (for understanding):
async function installVSCodeExtension(ideName) {
  if (isVSCodeIDE(ideName)) {
    let cliPath = getVSCodeCLIPath(ideName);
    if (cliPath) {
      let currentVersion = await getInstalledExtensionVersion(cliPath);

      // Install if not installed or outdated
      if (!currentVersion || semver.lt(currentVersion, getMinRequiredVersion())) {
        await delay(500);

        let result = await execCommand(cliPath, [
          "--force",
          "--install-extension",
          "anthropic.claude-code"
        ], { env: getCleanEnv() });

        if (result.code !== 0) {
          throw Error(`${result.code}: ${result.error} ${result.stderr}`);
        }
        currentVersion = getMinRequiredVersion();
      }
      return currentVersion;
    }
  }
  return null;
}

// Mapping: i25→installVSCodeExtension, PQ1→isVSCodeIDE, GB2→getVSCodeCLIPath,
// n25→getInstalledExtensionVersion, eQ2→semver, oQ2→getMinRequiredVersion,
// A3→execCommand, Ee1→getCleanEnv
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| isVSCodeIDE | PQ1 | chunks.93.mjs:2615-2619 | Check if IDE is VSCode-based |
| isJetBrainsIDE | oT | chunks.93.mjs:2621-2625 | Check if IDE is JetBrains-based |
| getIDELockFiles | jQ1 | chunks.93.mjs:2632-2650 | Discover IDE lock files |
| parseLockFile | QB2 | chunks.93.mjs:2652-2684 | Parse lock file content |
| getAvailableIDEConnections | HLA | chunks.93.mjs:2815-2870 | Find valid IDE connections |
| waitForIDEConnection | sQ2 | chunks.93.mjs:2800-2813 | Poll for IDE with 30s timeout |
| notifyIDEConnected | BB2 | chunks.93.mjs:2872-2879 | Send connection notification |
| installVSCodeExtension | i25 | chunks.93.mjs:2897-2916 | Install Claude Code extension |
| WebSocketTransport | bQ1 | chunks.94.mjs:410-466 | WebSocket transport class |
| SSETransport | NQ1 | chunks.93.mjs:1932-2062 | SSE transport class |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_SSE_PORT` | Force specific IDE port |
| `CLAUDE_CODE_IDE_SKIP_VALID_CHECK` | Skip workspace validation |
| `WSL_DISTRO_NAME` | WSL distribution name for path translation |
