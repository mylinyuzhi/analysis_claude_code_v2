# LSP Integration Architecture

## Overview

Claude Code (`v2.1.76`) acts as a **polyglot Language Server Protocol (LSP) Client**. It does not implement its own static analysis engines but instead leverages existing LSP servers (like `typescript-language-server`, `gopls`, `pyright`, etc.) to provide "IDE-like" intelligence to the model. This allows Claude to "jump to definition," "find references," and "hover" over symbols during its investigation.

## Core Architecture

The LSP implementation is in **`chunks.138.mjs`** (core logic) and **`chunks.144.mjs`** (tool surface). The module includes bundled `vscode-jsonrpc` and `vscode-languageserver-protocol` libraries from the VS Code ecosystem.

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LSP INTEGRATION LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    LspServerManager (eo4)                     │  │
│  │                    Polyglot Server Coordinator                │  │
│  │                                                               │  │
│  │  • Extension → Server routing                                 │  │
│  │  • File sync orchestration (didOpen/didChange/didSave)       │  │
│  │  • Server lifecycle management                                │  │
│  │  • Request dispatching to appropriate server                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    createLspClient (no4)                      │  │
│  │                    Per-Server Instance Manager                │  │
│  │                                                               │  │
│  │  • Server state machine (stopped → starting → running)       │  │
│  │  • Request retry with exponential backoff                     │  │
│  │  • Restart handling (with maxRestarts limit)                 │  │
│  │  • Notification routing                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              createLspProcessWrapper (co4)                    │  │
│  │              Low-Level Process & Transport                    │  │
│  │                                                               │  │
│  │  • Process spawning via Node.js spawn()                       │  │
│  │  • Stdio transport (stdin/stdout pipes)                       │  │
│  │  • JSON-RPC message framing                                   │  │
│  │  • Error/crash detection                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### The LSP Client (`no4`)

The central component is a factory function that creates an LSP client instance. It manages:
1. **Process Management**: Spawning the LSP server executable
2. **Transport**: Connecting via Stdio (Pipes)
3. **Protocol**: Handling JSON-RPC messages
4. **Lifecycle**: `initialize`, `shutdown`, `exit`
5. **Retry Logic**: Exponential backoff for `ContentModified` errors

### Configuration (`.lsp.json`)

LSP servers are configured via `.lsp.json` files found in plugins or the workspace. This configuration defines:
- `command`: The executable to run (e.g., `typescript-language-server`)
- `args`: Command-line arguments
- `env`: Environment variables
- `workspaceFolder`: The root to index
- `extensionToLanguage`: File extension → language ID mapping

## Client Capabilities

When connecting to a server, Claude Code advertises the following capabilities in the `initialize` handshake:

| Feature | Support | Note |
|---------|---------|------|
| **Synchronization** | `didSave` only | Does NOT sync every keystroke (`didChange`), only saves |
| **Publish Diagnostics** | Related info, tag support | Receives diagnostics from server |
| **Hover** | Markdown/Plaintext | Used for reading docstrings |
| **Definition** | Link Support | Used for "Go to Definition" |
| **References** | Supported | Used for "Find References" |
| **DocumentSymbol** | Hierarchical | Used for "Outline" / "Structure" |
| **CallHierarchy** | Supported | Used for caller/callee navigation |
| **Workspace** | Folders | Basic workspace folder support |

### Code Snippet: LSP Client Initialization

```javascript
// ============================================
// createLspClient - Factory for LSP client instances
// Location: chunks.138.mjs:389-563
// ============================================

// ORIGINAL (for source lookup):
function no4(A, q) {
    if (q.restartOnCrash !== void 0) throw Error(`LSP server '${A}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
    if (q.shutdownTimeout !== void 0) throw Error(`LSP server '${A}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
    let K = co4(A),
        Y = "stopped",
        z, _, w = 0;
    async function O() {
        if (Y === "running" || Y === "starting") return;
        let P;
        try {
            Y = "starting", k(`Starting LSP server instance: ${A}`), await K.start(q.command, q.args || [], {
                env: q.env,
                cwd: q.workspaceFolder
            });
            let W = q.workspaceFolder || G1(),
                Z = sEY(W).href,
                G = {
                    processId: process.pid,
                    initializationOptions: q.initializationOptions ?? {},
                    workspaceFolders: [{
                        uri: Z,
                        name: io4.basename(W)
                    }],
                    rootPath: W,
                    rootUri: Z,
                    capabilities: {
                        workspace: {
                            configuration: !1,
                            workspaceFolders: !1
                        },
                        textDocument: {
                            synchronization: {
                                dynamicRegistration: !1,
                                willSave: !1,
                                willSaveWaitUntil: !1,
                                didSave: !0
                            },
                            publishDiagnostics: {
                                relatedInformation: !0,
                                tagSupport: {
                                    valueSet: [1, 2]
                                },
                                versionSupport: !1,
                                codeDescriptionSupport: !0,
                                dataSupport: !1
                            },
                            hover: {
                                dynamicRegistration: !1,
                                contentFormat: ["markdown", "plaintext"]
                            },
                            definition: {
                                dynamicRegistration: !1,
                                linkSupport: !0
                            },
                            references: {
                                dynamicRegistration: !1
                            },
                            documentSymbol: {
                                dynamicRegistration: !1,
                                hierarchicalDocumentSymbolSupport: !0
                            },
                            callHierarchy: {
                                dynamicRegistration: !1
                            }
                        },
                        general: {
                            positionEncodings: ["utf-16"]
                        }
                    }
                };
            if (P = K.initialize(G), q.startupTimeout !== void 0) await AyY(P, q.startupTimeout, `LSP server '${A}' timed out after ${q.startupTimeout}ms during initialization`);
            else await P;
            Y = "running", z = new Date, k(`LSP server instance started: ${A}`)
        } catch (W) {
            throw K.stop().catch(() => {}), P?.catch(() => {}), Y = "error", _ = W, _6(W), W
        }
    }
    // ... rest of implementation
}

// READABLE (for understanding):
function createLspClient(serverName, config) {
    // Validation for unsupported features
    if (config.restartOnCrash !== undefined) {
        throw Error(`LSP server '${serverName}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
    }

    let connection = createLspProcessWrapper(serverName);  // co4
    let state = "stopped";
    let startTime = undefined;
    let lastError = undefined;
    let restartCount = 0;

    async function start() {
        if (state === "running" || state === "starting") return;

        state = "starting";
        log(`Starting LSP server instance: ${serverName}`);

        await connection.start(config.command, config.args || [], {
            env: config.env,
            cwd: config.workspaceFolder
        });

        const workspaceFolder = config.workspaceFolder || getCwd();
        const rootUri = pathToFileUrl(workspaceFolder).href;

        const initParams = {
            processId: process.pid,
            initializationOptions: config.initializationOptions ?? {},
            workspaceFolders: [{
                uri: rootUri,
                name: path.basename(workspaceFolder)
            }],
            rootPath: workspaceFolder,
            rootUri: rootUri,
            capabilities: {
                workspace: {
                    configuration: false,
                    workspaceFolders: false
                },
                textDocument: {
                    synchronization: {
                        dynamicRegistration: false,
                        willSave: false,
                        willSaveWaitUntil: false,
                        didSave: true  // We only notify on file save
                    },
                    publishDiagnostics: {
                        relatedInformation: true,
                        tagSupport: { valueSet: [1, 2] },
                        versionSupport: false,
                        codeDescriptionSupport: true,
                        dataSupport: false
                    },
                    hover: {
                        dynamicRegistration: false,
                        contentFormat: ["markdown", "plaintext"]
                    },
                    definition: {
                        dynamicRegistration: false,
                        linkSupport: true
                    },
                    references: { dynamicRegistration: false },
                    documentSymbol: {
                        dynamicRegistration: false,
                        hierarchicalDocumentSymbolSupport: true
                    },
                    callHierarchy: { dynamicRegistration: false }
                },
                general: {
                    positionEncodings: ["utf-16"]
                }
            }
        };

        let initPromise = connection.initialize(initParams);

        // Apply startup timeout if configured
        if (config.startupTimeout !== undefined) {
            initPromise = withTimeout(
                initPromise,
                config.startupTimeout,
                `LSP server '${serverName}' timed out after ${config.startupTimeout}ms during initialization`
            );
        }

        await initPromise;
        state = "running";
        startTime = new Date();
        log(`LSP server instance started: ${serverName}`);
    }

    return {
        name: serverName,
        config: config,
        get state() { return state; },
        get startTime() { return startTime; },
        get lastError() { return lastError; },
        get restartCount() { return restartCount; },
        start,
        stop,
        restart,
        isHealthy,
        sendRequest,
        sendNotification,
        onNotification,
        onRequest
    };
}

// Mapping: no4→createLspClient, co4→createLspProcessWrapper, AyY→withTimeout, sEY→pathToFileUrl, G1→getCwd, io4→path
```

## Transport Layer

The system uses `vscode-jsonrpc` over Node.js streams. The `createLspProcessWrapper` (co4) handles:

### Process Management

```javascript
// ============================================
// createLspProcessWrapper - Low-level process & transport
// Location: chunks.138.mjs:218-379
// ============================================

// READABLE (conceptual):
function createLspProcessWrapper(serverName) {
    let process = null;
    let connection = null;
    let capabilities = null;
    let isInitialized = false;
    let isShuttingDown = false;
    let queuedNotificationHandlers = [];
    let queuedRequestHandlers = [];

    async function start(command, args, options) {
        // Spawn process with stdio pipes
        process = spawn(command, args, {
            stdio: ["pipe", "pipe", "pipe"],
            env: options?.env ? { ...process.env, ...options.env } : undefined,
            cwd: options?.cwd,
            windowsHide: true
        });

        // Handle stderr output (server logs)
        if (process.stderr) {
            process.stderr.on("data", (data) => {
                log(`[LSP SERVER ${serverName}] ${data.toString().trim()}`);
            });
        }

        // Handle process crashes
        process.on("exit", (code, signal) => {
            if (code !== 0 && code !== null && !isShuttingDown) {
                logError(`LSP server ${serverName} crashed with exit code ${code}`);
                isInitialized = false;
            }
        });

        // Create JSON-RPC connection over stdio
        const reader = new StreamMessageReader(process.stdout);
        const writer = new StreamMessageWriter(process.stdin);
        connection = createMessageConnection(reader, writer);

        connection.listen();
    }

    async function initialize(params) {
        const result = await connection.sendRequest("initialize", params);
        capabilities = result.capabilities;
        await connection.sendNotification("initialized", {});
        isInitialized = true;
        return result;
    }

    async function sendRequest(method, params) {
        if (!isInitialized) throw Error("LSP server not initialized");
        return connection.sendRequest(method, params);
    }

    async function stop() {
        isShuttingDown = true;
        try {
            if (connection) {
                await connection.sendRequest("shutdown", {});
                await connection.sendNotification("exit", {});
            }
        } finally {
            if (process) process.kill();
            if (connection) connection.dispose();
        }
    }

    return {
        get capabilities() { return capabilities; },
        get isInitialized() { return isInitialized; },
        start,
        initialize,
        sendRequest,
        sendNotification,
        onNotification,
        onRequest,
        stop
    };
}

// Mapping: co4→createLspProcessWrapper
```

### Transport Methods Supported

| Method | Description | Usage |
|--------|-------------|-------|
| **Stdio** | Direct process attachment | Standard method, used by most LSP servers |
| **Pipes** | `createClientPipeTransport` | Named pipes for IPC |
| **Sockets** | `createClientSocketTransport` | TCP socket communication |

## Server Lifecycle States

```
┌────────────┐      start()      ┌───────────┐      success      ┌─────────┐
│  stopped   │ ─────────────────► │  starting │ ────────────────► │ running │
└────────────┘                    └───────────┘                   └────┬────┘
      ▲                                 │                              │
      │                                 │ error                        │
      │                                 ▼                              │
      │                           ┌───────────┐                        │
      │                           │   error   │◄───────────────────────┤
      │                           └───────────┘        crash/error     │
      │                                 │                              │
      └─────────────────────────────────┴──────────────────────────────┘
                              stop() / restart()
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `createLspProcessWrapper` (co4) - Low-level process & transport setup
- `createLspClient` (no4) - Main client factory with retry logic
- `LspServerManager` (eo4) - Polyglot server coordinator
- `loadLspConfigs` (so4) - Configuration aggregation from plugins
- `loadPluginLspConfig` (Nl6) - Loads `.lsp.json` from a plugin
- `withTimeout` (AyY) - Promise timeout wrapper

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| createLspProcessWrapper | co4 | chunks.138.mjs:218-379 |
| createLspClient | no4 | chunks.138.mjs:389-563 |
| withTimeout | AyY | chunks.138.mjs:565-570 |
| LspServerManager | eo4 | chunks.138.mjs:806-969 |
| loadPluginLspConfig | Nl6 | chunks.138.mjs:593-628 |
| loadLspConfigs | so4 | chunks.138.mjs:756-796 |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Verified - All symbols cross-validated against source code in chunks.138.mjs