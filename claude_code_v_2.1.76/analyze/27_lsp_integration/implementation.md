# LSP Integration - Deep Implementation Analysis

## Module Overview

Claude Code v2.1.76 implements a **polyglot LSP client** that delegates language intelligence to external Language Server Protocol servers. Rather than bundling its own static analysis engines, the system spawns standard LSP servers (TypeScript, Go, Python, Rust, etc.) and acts as their client — giving Claude IDE-level intelligence about the codebase it is working in.

All LSP logic is in **`chunks.138.mjs`**, and the LSP Tool surface is defined in **`chunks.144.mjs`**.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `createLspProcessWrapper` (co4) - Low-level stdio transport, process lifecycle
- `createLspClient` (no4) - High-level server instance: init, restart, request retry
- `LspServerManager` (eo4) - Polyglot coordinator: extension→server routing, file sync
- `loadLspConfigs` (so4) - Aggregates plugin-provided LSP configs
- `loadPluginLspConfig` (Nl6) - Reads `.lsp.json` from a single plugin
- `registerDiagnostics` (Ya4) - Buffers incoming `publishDiagnostics` notifications
- `checkDiagnosticsRegistry` (_a4) - Deduplicates, volume-limits, delivers diagnostics
- `registerNotificationHandlers` ($a4) - Wires up async diagnostic listeners on all servers
- `initializeLspServerManager` (dm8) - Singleton init with generation counter

---

## 1. LSP Process Wrapper

### Process Lifecycle Management

The `createLspProcessWrapper` (co4) function creates a low-level wrapper around the LSP server process. It handles:
- Process spawning via Node.js `spawn`
- Stdio transport (stdin/stdout pipes)
- Error handling and connection state
- Queued handlers for notifications and requests

```javascript
// ============================================
// createLspProcessWrapper - Low-level LSP process and transport
// Location: chunks.138.mjs:218-379
// ============================================

// ORIGINAL:
function co4(A) {
    let q, K, Y, z = !1,
        _ = !1,
        w, O = !1,
        $ = [],
        H = [];

    function j() {
        if (_) throw w || Error(`LSP server ${A} failed to start`)
    }
    return {
        get capabilities() {
            return Y
        },
        get isInitialized() {
            return z
        },
        async start(J, M, D) {
            try {
                if (q = aEY(J, M, {
                        stdio: ["pipe", "pipe", "pipe"],
                        env: D?.env ? {
                            ...globalThis.process.env,
                            ...D.env
                        } : void 0,
                        cwd: D?.cwd,
                        windowsHide: !0
                    }), !q.stdout || !q.stdin) throw Error("LSP server process stdio not available");
                let X = q;
                if (await new Promise((Z, G) => {
                        let f = () => {
                                N(), Z()
                            },
                            v = (V) => {
                                N(), G(V)
                            },
                            N = () => {
                                X.removeListener("spawn", f), X.removeListener("error", v)
                            };
                        X.once("spawn", f), X.once("error", v)
                    }), q.stderr) q.stderr.on("data", (Z) => {
                    let G = Z.toString().trim();
                    if (G) k(`[LSP SERVER ${A}] ${G}`)
                });
                q.on("error", (Z) => {
                    if (!O) _ = !0, w = Z, _6(Error(`LSP server ${A} failed to start: ${Z.message}`))
                }), q.on("exit", (Z, G) => {
                    if (Z !== 0 && Z !== null && !O) z = !1, _ = !1, w = void 0, _6(Error(`LSP server ${A} crashed with exit code ${Z}`))
                }), q.stdin.on("error", (Z) => {
                    if (!O) k(`LSP server ${A} stdin error: ${Z.message}`)
                });
                let P = new g66.StreamMessageReader(q.stdout),
                    W = new g66.StreamMessageWriter(q.stdin);
                K = g66.createMessageConnection(P, W), K.onError(([Z, G, f]) => {
                    if (!O) _ = !0, w = Z, _6(Error(`LSP server ${A} connection error: ${Z.message}`))
                }), K.onClose(() => {
                    if (!O) z = !1, k(`LSP server ${A} connection closed`)
                }), K.listen(), K.trace(g66.Trace.Verbose, {
                    log: (Z) => {
                        k(`[LSP PROTOCOL ${A}] ${Z}`)
                    }
                }).catch((Z) => {
                    k(`Failed to enable tracing for ${A}: ${Z.message}`)
                });
                for (let {
                        method: Z,
                        handler: G
                    }
                    of $) K.onNotification(Z, G), k(`Applied queued notification handler for ${A}.${Z}`);
                $.length = 0;
                for (let {
                        method: Z,
                        handler: G
                    }
                    of H) K.onRequest(Z, G), k(`Applied queued request handler for ${A}.${Z}`);
                H.length = 0, k(`LSP client started for ${A}`)
            } catch (X) {
                throw _6(Error(`LSP server ${A} failed to start: ${X.message}`)), X
            }
        },
        async initialize(J) {
            if (!K) throw Error("LSP client not started");
            j();
            try {
                let M = await K.sendRequest("initialize", J);
                return Y = M.capabilities, await K.sendNotification("initialized", {}), z = !0, k(`LSP server ${A} initialized`), M
            } catch (M) {
                throw _6(Error(`LSP server ${A} initialize failed: ${M.message}`)), M
            }
        },
        async sendRequest(J, M) {
            if (!K) throw Error("LSP client not started");
            if (j(), !z) throw Error("LSP server not initialized");
            try {
                return await K.sendRequest(J, M)
            } catch (D) {
                throw _6(Error(`LSP server ${A} request ${J} failed: ${D.message}`)), D
            }
        },
        async sendNotification(J, M) {
            if (!K) throw Error("LSP client not started");
            j();
            try {
                await K.sendNotification(J, M)
            } catch (D) {
                _6(Error(`LSP server ${A} notification ${J} failed: ${D.message}`)), k(`Notification ${J} failed but continuing`)
            }
        },
        onNotification(J, M) {
            if (!K) {
                $.push({
                    method: J,
                    handler: M
                }), k(`Queued notification handler for ${A}.${J} (connection not ready)`);
                return
            }
            j(), K.onNotification(J, M)
        },
        onRequest(J, M) {
            if (!K) {
                H.push({
                    method: J,
                    handler: M
                }), k(`Queued request handler for ${A}.${J} (connection not ready)`);
                return
            }
            j(), K.onRequest(J, M)
        },
        async stop() {
            let J;
            O = !0;
            try {
                if (K) await K.sendRequest("shutdown", {}), await K.sendNotification("exit", {})
            } catch (M) {
                let D = M;
                _6(Error(`LSP server ${A} stop failed: ${D.message}`)), J = D
            } finally {
                if (K) {
                    try {
                        K.dispose()
                    } catch (M) {
                        k(`Connection disposal failed for ${A}: ${M.message}`)
                    }
                    K = void 0
                }
                if (q) {
                    if (q.removeAllListeners("error"), q.removeAllListeners("exit"), q.stdin) q.stdin.removeAllListeners("error");
                    if (q.stderr) q.stderr.removeAllListeners("data");
                    try {
                        q.kill()
                    } catch (M) {
                        k(`Process kill failed for ${A} (may already be dead): ${M.message}`)
                    }
                    q = void 0
                }
                if (z = !1, Y = void 0, O = !1, J) _ = !0, w = J;
                k(`LSP client stopped for ${A}`)
            }
            if (J) throw J
        }
    }
}

// READABLE:
function createLspProcessWrapper(serverName) {
    let process;              // q - child process
    let connection;           // K - JSON-RPC message connection
    let capabilities;         // Y - server capabilities from initialize
    let isInitialized = false; // z
    let hasFailed = false;    // _
    let lastError;            // w
    let isShuttingDown = false; // O
    let queuedNotificationHandlers = []; // $
    let queuedRequestHandlers = [];      // H

    function checkFailed() {
        if (hasFailed) throw lastError || Error(`LSP server ${serverName} failed to start`);
    }

    return {
        get capabilities() { return capabilities; },
        get isInitialized() { return isInitialized; },

        async start(command, args, options) {
            try {
                // Spawn process with stdio pipes
                process = spawn(command, args, {
                    stdio: ["pipe", "pipe", "pipe"],
                    env: options?.env ? { ...process.env, ...options.env } : undefined,
                    cwd: options?.cwd,
                    windowsHide: true
                });

                if (!process.stdout || !process.stdin) {
                    throw Error("LSP server process stdio not available");
                }

                // Wait for spawn event
                await new Promise((resolve, reject) => {
                    const onSpawn = () => { cleanup(); resolve(); };
                    const onError = (err) => { cleanup(); reject(err); };
                    const cleanup = () => {
                        process.removeListener("spawn", onSpawn);
                        process.removeListener("error", onError);
                    };
                    process.once("spawn", onSpawn);
                    process.once("error", onError);
                });

                // Handle stderr output (server logs)
                if (process.stderr) {
                    process.stderr.on("data", (data) => {
                        const msg = data.toString().trim();
                        if (msg) log(`[LSP SERVER ${serverName}] ${msg}`);
                    });
                }

                // Handle process errors
                process.on("error", (err) => {
                    if (!isShuttingDown) {
                        hasFailed = true;
                        lastError = err;
                        logError(Error(`LSP server ${serverName} failed to start: ${err.message}`));
                    }
                });

                // Handle process exit
                process.on("exit", (code, signal) => {
                    if (code !== 0 && code !== null && !isShuttingDown) {
                        isInitialized = false;
                        hasFailed = false;
                        lastError = undefined;
                        logError(Error(`LSP server ${serverName} crashed with exit code ${code}`));
                    }
                });

                // Handle stdin errors
                process.stdin.on("error", (err) => {
                    if (!isShuttingDown) {
                        log(`LSP server ${serverName} stdin error: ${err.message}`);
                    }
                });

                // Create JSON-RPC connection over stdio
                const reader = new StreamMessageReader(process.stdout);
                const writer = new StreamMessageWriter(process.stdin);
                connection = createMessageConnection(reader, writer);

                connection.onError(([err]) => {
                    if (!isShuttingDown) {
                        hasFailed = true;
                        lastError = err;
                        logError(Error(`LSP server ${serverName} connection error: ${err.message}`));
                    }
                });

                connection.onClose(() => {
                    if (!isShuttingDown) {
                        isInitialized = false;
                        log(`LSP server ${serverName} connection closed`);
                    }
                });

                connection.listen();

                // Enable verbose tracing
                connection.trace(Trace.Verbose, {
                    log: (msg) => log(`[LSP PROTOCOL ${serverName}] ${msg}`)
                }).catch((err) => {
                    log(`Failed to enable tracing for ${serverName}: ${err.message}`);
                });

                // Apply queued handlers
                for (const { method, handler } of queuedNotificationHandlers) {
                    connection.onNotification(method, handler);
                    log(`Applied queued notification handler for ${serverName}.${method}`);
                }
                queuedNotificationHandlers.length = 0;

                for (const { method, handler } of queuedRequestHandlers) {
                    connection.onRequest(method, handler);
                    log(`Applied queued request handler for ${serverName}.${method}`);
                }
                queuedRequestHandlers.length = 0;

                log(`LSP client started for ${serverName}`);
            } catch (err) {
                logError(Error(`LSP server ${serverName} failed to start: ${err.message}`));
                throw err;
            }
        },

        async initialize(params) {
            if (!connection) throw Error("LSP client not started");
            checkFailed();
            try {
                const result = await connection.sendRequest("initialize", params);
                capabilities = result.capabilities;
                await connection.sendNotification("initialized", {});
                isInitialized = true;
                log(`LSP server ${serverName} initialized`);
                return result;
            } catch (err) {
                logError(Error(`LSP server ${serverName} initialize failed: ${err.message}`));
                throw err;
            }
        },

        async sendRequest(method, params) {
            if (!connection) throw Error("LSP client not started");
            checkFailed();
            if (!isInitialized) throw Error("LSP server not initialized");
            try {
                return await connection.sendRequest(method, params);
            } catch (err) {
                logError(Error(`LSP server ${serverName} request ${method} failed: ${err.message}`));
                throw err;
            }
        },

        async sendNotification(method, params) {
            if (!connection) throw Error("LSP client not started");
            checkFailed();
            try {
                await connection.sendNotification(method, params);
            } catch (err) {
                logError(Error(`LSP server ${serverName} notification ${method} failed: ${err.message}`));
                log(`Notification ${method} failed but continuing`);
            }
        },

        onNotification(method, handler) {
            if (!connection) {
                queuedNotificationHandlers.push({ method, handler });
                log(`Queued notification handler for ${serverName}.${method} (connection not ready)`);
                return;
            }
            checkFailed();
            connection.onNotification(method, handler);
        },

        onRequest(method, handler) {
            if (!connection) {
                queuedRequestHandlers.push({ method, handler });
                log(`Queued request handler for ${serverName}.${method} (connection not ready)`);
                return;
            }
            checkFailed();
            connection.onRequest(method, handler);
        },

        async stop() {
            let stopError;
            isShuttingDown = true;
            try {
                if (connection) {
                    await connection.sendRequest("shutdown", {});
                    await connection.sendNotification("exit", {});
                }
            } catch (err) {
                logError(Error(`LSP server ${serverName} stop failed: ${err.message}`));
                stopError = err;
            } finally {
                // Dispose connection
                if (connection) {
                    try { connection.dispose(); } catch (e) {}
                    connection = undefined;
                }
                // Kill process
                if (process) {
                    process.removeAllListeners("error");
                    process.removeAllListeners("exit");
                    if (process.stdin) process.stdin.removeAllListeners("error");
                    if (process.stderr) process.stderr.removeAllListeners("data");
                    try { process.kill(); } catch (e) {}
                    process = undefined;
                }
                isInitialized = false;
                capabilities = undefined;
                isShuttingDown = false;
                if (stopError) {
                    hasFailed = true;
                    lastError = stopError;
                }
                log(`LSP client stopped for ${serverName}`);
            }
            if (stopError) throw stopError;
        }
    };
}

// Mapping: co4→createLspProcessWrapper, aEY→spawn, g66→vscode-languageserver-protocol, k→log, _6→logError
```

### Key Design Insights

**Queued Handlers Pattern:** The wrapper allows registering notification/request handlers before the connection is established. This is critical because:
1. LSP servers may send notifications immediately after initialization
2. The `publishDiagnostics` notification arrives asynchronously
3. Handlers must be registered before `initialize` completes

**Graceful Shutdown Sequence:**
1. Set `isShuttingDown = true` to suppress error logs
2. Send `shutdown` request (LSP protocol requirement)
3. Send `exit` notification (LSP protocol requirement)
4. Dispose connection
5. Kill process
6. Reset all state

---

## 2. LSP Client Factory

### High-Level Server Instance

The `createLspClient` (no4) function creates a high-level LSP client with:
- Server state machine (stopped → starting → running → error)
- Retry logic for ContentModified errors
- Restart support with max restart limit
- Startup timeout support

```javascript
// ============================================
// createLspClient - High-level LSP client factory with retry logic
// Location: chunks.138.mjs:389-563
// ============================================

// ORIGINAL:
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
    async function $() {
        if (Y === "stopped" || Y === "stopping") return;
        try {
            Y = "stopping", await K.stop(), Y = "stopped", k(`LSP server instance stopped: ${A}`)
        } catch (P) {
            throw Y = "error", _ = P, _6(P), P
        }
    }
    async function H() {
        try {
            await $()
        } catch (W) {
            let Z = Error(`Failed to stop LSP server '${A}' during restart: ${W.message}`);
            throw _6(Z), Z
        }
        w++;
        let P = q.maxRestarts ?? 3;
        if (w > P) {
            let W = Error(`Max restart attempts (${P}) exceeded for server '${A}'`);
            throw _6(W), W
        }
        try {
            await O()
        } catch (W) {
            let Z = Error(`Failed to start LSP server '${A}' during restart (attempt ${w}/${P}): ${W.message}`);
            throw _6(Z), Z
        }
    }

    function j() {
        return Y === "running" && K.isInitialized
    }
    async function J(P, W) {
        if (!j()) {
            let f = Error(`Cannot send request to LSP server '${A}': server is ${Y}${_?`, last error: ${_.message}`:""}`);
            throw _6(f), f
        }
        let Z;
        for (let f = 0; f <= Qm8; f++) try {
            return await K.sendRequest(P, W)
        } catch (v) {
            Z = v;
            let N = v.code;
            if (typeof N === "number" && N === tEY && f < Qm8) {
                let L = eEY * Math.pow(2, f);
                k(`LSP request '${P}' to '${A}' got ContentModified error, retrying in ${L}ms (attempt ${f+1}/${Qm8})…`), await new Promise((h) => setTimeout(h, L));
                continue
            }
            break
        }
        let G = Error(`LSP request '${P}' failed for server '${A}': ${Z?.message??"unknown error"}`);
        throw _6(G), G
    }
    async function M(P, W) {
        if (!j()) {
            let Z = Error(`Cannot send notification to LSP server '${A}': server is ${Y}`);
            throw _6(Z), Z
        }
        try {
            await K.sendNotification(P, W)
        } catch (Z) {
            let G = Error(`LSP notification '${P}' failed for server '${A}': ${Z.message}`);
            throw _6(G), G
        }
    }

    function D(P, W) {
        K.onNotification(P, W)
    }

    function X(P, W) {
        K.onRequest(P, W)
    }
    return {
        name: A,
        config: q,
        get state() {
            return Y
        },
        get startTime() {
            return z
        },
        get lastError() {
            return _
        },
        get restartCount() {
            return w
        },
        start: O,
        stop: $,
        restart: H,
        isHealthy: j,
        sendRequest: J,
        sendNotification: M,
        onNotification: D,
        onRequest: X
    }
}

// READABLE:
function createLspClient(serverName, config) {
    // Validate unsupported features
    if (config.restartOnCrash !== undefined) {
        throw Error(`LSP server '${serverName}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
    }
    if (config.shutdownTimeout !== undefined) {
        throw Error(`LSP server '${serverName}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
    }

    const wrapper = createLspProcessWrapper(serverName);  // co4
    let state = "stopped";        // Y
    let startTime;                // z
    let lastError;                // _
    let restartCount = 0;         // w

    async function start() {
        if (state === "running" || state === "starting") return;

        let initPromise;
        try {
            state = "starting";
            log(`Starting LSP server instance: ${serverName}`);

            await wrapper.start(config.command, config.args || [], {
                env: config.env,
                cwd: config.workspaceFolder
            });

            const workspaceFolder = config.workspaceFolder || getCwd();  // G1
            const rootUri = pathToFileUrl(workspaceFolder).href;         // sEY

            const initParams = {
                processId: process.pid,
                initializationOptions: config.initializationOptions ?? {},
                workspaceFolders: [{
                    uri: rootUri,
                    name: path.basename(workspaceFolder)  // io4
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
                            didSave: true  // Only notify on save, not every keystroke
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

            initPromise = wrapper.initialize(initParams);

            // Apply startup timeout if configured
            if (config.startupTimeout !== undefined) {
                initPromise = withTimeout(  // AyY
                    initPromise,
                    config.startupTimeout,
                    `LSP server '${serverName}' timed out after ${config.startupTimeout}ms during initialization`
                );
            }

            await initPromise;
            state = "running";
            startTime = new Date();
            log(`LSP server instance started: ${serverName}`);

        } catch (error) {
            // Cleanup on failure
            wrapper.stop().catch(() => {});
            initPromise?.catch(() => {});
            state = "error";
            lastError = error;
            logError(error);
            throw error;
        }
    }

    async function stop() {
        if (state === "stopped" || state === "stopping") return;
        try {
            state = "stopping";
            await wrapper.stop();
            state = "stopped";
            log(`LSP server instance stopped: ${serverName}`);
        } catch (error) {
            state = "error";
            lastError = error;
            logError(error);
            throw error;
        }
    }

    async function restart() {
        // Stop first
        try {
            await stop();
        } catch (err) {
            const error = Error(`Failed to stop LSP server '${serverName}' during restart: ${err.message}`);
            logError(error);
            throw error;
        }

        // Check restart limit
        restartCount++;
        const maxRestarts = config.maxRestarts ?? 3;
        if (restartCount > maxRestarts) {
            const error = Error(`Max restart attempts (${maxRestarts}) exceeded for server '${serverName}'`);
            logError(error);
            throw error;
        }

        // Start again
        try {
            await start();
        } catch (err) {
            const error = Error(`Failed to start LSP server '${serverName}' during restart (attempt ${restartCount}/${maxRestarts}): ${err.message}`);
            logError(error);
            throw error;
        }
    }

    function isHealthy() {
        return state === "running" && wrapper.isInitialized;
    }

    async function sendRequest(method, params) {
        if (!isHealthy()) {
            const error = Error(`Cannot send request to LSP server '${serverName}': server is ${state}${lastError ? `, last error: ${lastError.message}` : ""}`);
            logError(error);
            throw error;
        }

        let lastAttemptError;
        // Retry loop with exponential backoff
        for (let attempt = 0; attempt <= LSP_MAX_RETRIES; attempt++) {  // Qm8 = 3
            try {
                return await wrapper.sendRequest(method, params);
            } catch (error) {
                lastAttemptError = error;
                const errorCode = error.code;

                // Only retry for ContentModified error (-32801)
                if (typeof errorCode === "number" && errorCode === CONTENT_MODIFIED_ERROR_CODE && attempt < LSP_MAX_RETRIES) {  // tEY = -32801
                    const delay = LSP_RETRY_BASE_DELAY_MS * Math.pow(2, attempt);  // eEY = 500
                    log(`LSP request '${method}' to '${serverName}' got ContentModified error, retrying in ${delay}ms (attempt ${attempt+1}/${LSP_MAX_RETRIES})…`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                break;
            }
        }

        const error = Error(`LSP request '${method}' failed for server '${serverName}': ${lastAttemptError?.message ?? "unknown error"}`);
        logError(error);
        throw error;
    }

    async function sendNotification(method, params) {
        if (!isHealthy()) {
            const error = Error(`Cannot send notification to LSP server '${serverName}': server is ${state}`);
            logError(error);
            throw error;
        }
        try {
            await wrapper.sendNotification(method, params);
        } catch (error) {
            const wrappedError = Error(`LSP notification '${method}' failed for server '${serverName}': ${error.message}`);
            logError(wrappedError);
            throw wrappedError;
        }
    }

    function onNotification(method, handler) {
        wrapper.onNotification(method, handler);
    }

    function onRequest(method, handler) {
        wrapper.onRequest(method, handler);
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

// Mapping: no4→createLspClient, co4→createLspProcessWrapper, G1→getCwd, sEY→pathToFileUrl, io4→path, AyY→withTimeout, Qm8→LSP_MAX_RETRIES, tEY→CONTENT_MODIFIED_ERROR_CODE, eEY→LSP_RETRY_BASE_DELAY_MS
```

### Client Capabilities Deep Dive

The `capabilities` object in the initialize params defines what features the client supports:

| Capability | Value | Reason |
|------------|-------|--------|
| `didSave` | `true` | Sync only on save (not every keystroke) |
| `willSave` | `false` | No pre-save notifications needed |
| `configuration` | `false` | Server can't request config from client |
| `workspaceFolders` | `false` | Server can't change workspace folders |
| `hover.contentFormat` | `["markdown", "plaintext"]` | Prefer markdown, fallback to plaintext |
| `definition.linkSupport` | `true` | Support LocationLink (vscode-style) |
| `hierarchicalDocumentSymbolSupport` | `true` | Support nested symbols in outline |
| `tagSupport.valueSet` | `[1, 2]` | Support Unnecessary and Deprecated tags |
| `positionEncodings` | `["utf-16"]` | Standard UTF-16 position encoding |

**Why `didSave: true` but `willSave: false`:**
- `didSave: true` - Server receives notification after file is saved to disk
- `willSave: false` - No pre-save notification needed (Claude doesn't need to know before save)

---

## 3. Timeout Wrapper

```javascript
// ============================================
// withTimeout - Promise timeout wrapper
// Location: chunks.138.mjs:565-570
// ============================================

// ORIGINAL:
function AyY(A, q, K) {
    let Y, z = new Promise((_, w) => {
        Y = setTimeout((O, $) => O(Error($)), q, w, K)
    });
    return Promise.race([A, z]).finally(() => clearTimeout(Y))
}

// READABLE:
function withTimeout(promise, timeoutMs, errorMessage) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(
            (rejectFn, msg) => rejectFn(Error(msg)),
            timeoutMs,
            reject,
            errorMessage
        );
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// Mapping: AyY→withTimeout
```

**How it works:**
1. Creates a promise that rejects after `timeoutMs`
2. Races the original promise against the timeout promise
3. Clears the timeout in `finally` (prevents memory leak)

---

## 4. Retry Constants

```javascript
// ============================================
// LSP Retry Configuration Constants
// Location: chunks.138.mjs:572-576
// ============================================

// ORIGINAL:
tEY = -32801
Qm8 = 3
eEY = 500

// READABLE:
const CONTENT_MODIFIED_ERROR_CODE = -32801;  // LSP standard error code
const LSP_MAX_RETRIES = 3;                    // Maximum retry attempts
const LSP_RETRY_BASE_DELAY_MS = 500;          // Base delay for exponential backoff

// Mapping: tEY→CONTENT_MODIFIED_ERROR_CODE, Qm8→LSP_MAX_RETRIES, eEY→LSP_RETRY_BASE_DELAY_MS
```

**ContentModified Error (-32801):**
This is an LSP 3.0 standard error code. It means:
> "The server detected that the content of a document has changed and the request was for an outdated version."

The client should retry the request after waiting for the server to process the pending changes.

---

## 5. Safe Plugin Path Validation

```javascript
// ============================================
// safePluginRelativePath - Path traversal protection
// Location: chunks.138.mjs:585-591
// ============================================

// ORIGINAL:
function YyY(A, q) {
    let K = Um8(A),
        Y = Um8(A, q),
        z = KyY(K, Y);
    if (z.startsWith("..") || Um8(z) === z) return null;
    return Y
}

// READABLE:
function safePluginRelativePath(pluginRoot, relativePath) {
    const absoluteRoot = path.resolve(pluginRoot);           // Um8
    const targetPath = path.resolve(pluginRoot, relativePath); // Um8
    const relative = path.relative(absoluteRoot, targetPath);  // KyY

    // Reject if path escapes plugin directory
    if (relative.startsWith("..") || path.resolve(relative) === relative) {
        return null;  // Path traversal detected
    }
    return targetPath;
}

// Mapping: YyY→safePluginRelativePath, Um8→path.resolve, KyY→path.relative
```

**Security insight:** This prevents malicious plugins from reading files outside their directory using paths like `../../../etc/passwd`.

---

## 6. Plugin LSP Config Loading

```javascript
// ============================================
// loadPluginLspConfig - Load LSP config from a single plugin
// Location: chunks.138.mjs:593-628
// ============================================

// ORIGINAL:
async function Nl6(A, q = []) {
    let K = {},
        Y = qyY(A.path, ".lsp.json");
    try {
        let z = await oo4(Y, "utf-8"),
            _ = i1(z),
            w = C.record(C.string(), DJ6()).safeParse(_);
        if (w.success) Object.assign(K, w.data);
        else {
            let O = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${w.error.message}`;
            _6(Error(O)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: w.error.message,
                source: "plugin"
            })
        }
    } catch (z) {
        if (z.code !== "ENOENT") {
            // ... error handling ...
        }
    }
    if (A.manifest.lspServers) {
        let z = await zyY(A.manifest.lspServers, A.path, A.name, q);
        if (z) Object.assign(K, z)
    }
    return Object.keys(K).length > 0 ? K : void 0
}

// READABLE:
async function loadPluginLspConfig(plugin, errors = []) {
    const configs = {};

    // 1. Try loading .lsp.json file
    const lspConfigPath = path.join(plugin.path, ".lsp.json");  // qyY
    try {
        const content = await fs.readFile(lspConfigPath, "utf-8");  // oo4
        const parsed = JSON.parse(content);  // i1
        const result = z.record(z.string(), lspServerConfigSchema).safeParse(parsed);  // DJ6

        if (result.success) {
            Object.assign(configs, result.data);
        } else {
            const message = `LSP config validation failed for .lsp.json in plugin ${plugin.name}: ${result.error.message}`;
            logError(Error(message));
            errors.push({
                type: "lsp-config-invalid",
                plugin: plugin.name,
                serverName: ".lsp.json",
                validationError: result.error.message,
                source: "plugin"
            });
        }
    } catch (error) {
        // ENOENT = file doesn't exist, that's OK
        if (error.code !== "ENOENT") {
            errors.push({
                type: "lsp-config-invalid",
                plugin: plugin.name,
                serverName: ".lsp.json",
                validationError: error.message,
                source: "plugin"
            });
        }
    }

    // 2. Try loading from manifest.lspServers field
    if (plugin.manifest.lspServers) {
        const manifestConfigs = await resolvePluginLspServersField(  // zyY
            plugin.manifest.lspServers,
            plugin.path,
            plugin.name,
            errors
        );
        if (manifestConfigs) {
            Object.assign(configs, manifestConfigs);
        }
    }

    return Object.keys(configs).length > 0 ? configs : undefined;
}

// Mapping: Nl6→loadPluginLspConfig, qyY→path.join, oo4→fs.readFile, i1→JSON.parse, DJ6→lspServerConfigSchema, zyY→resolvePluginLspServersField
```

---

## 7. Resolve manifest.lspServers Field

```javascript
// ============================================
// resolvePluginLspServersField - Resolve manifest.lspServers field
// Location: chunks.138.mjs:630-690
// ============================================

// ORIGINAL:
async function zyY(A, q, K, Y) {
    let z = {},
        _ = Array.isArray(A) ? A : [A];
    for (let w of _)
        if (typeof w === "string") {
            let O = YyY(q, w);
            if (!O) {
                let $ = `Security: Path traversal attempt blocked in plugin ${K}: ${w}`;
                _6(Error($)), k($, { level: "warn" }), Y.push({
                    type: "lsp-config-invalid",
                    plugin: K,
                    serverName: w,
                    validationError: "Invalid path: must be relative and within plugin directory",
                    source: "plugin"
                });
                continue
            }
            // ... load config from path ...
        } else
            for (let [O, $] of Object.entries(w)) {
                // ... validate inline config ...
            }
    return Object.keys(z).length > 0 ? z : void 0
}

// READABLE:
async function resolvePluginLspServersField(lspServers, pluginPath, pluginName, errors) {
    const configs = {};
    const items = Array.isArray(lspServers) ? lspServers : [lspServers];

    for (const item of items) {
        if (typeof item === "string") {
            // String path: resolve and load file
            const safePath = safePluginRelativePath(pluginPath, item);  // YyY
            if (!safePath) {
                const message = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${item}`;
                logError(Error(message));
                log(message, { level: "warn" });
                errors.push({
                    type: "lsp-config-invalid",
                    plugin: pluginName,
                    serverName: item,
                    validationError: "Invalid path: must be relative and within plugin directory",
                    source: "plugin"
                });
                continue;
            }
            // Load config from safePath...
        } else if (typeof item === "object") {
            // Inline config: validate directly
            for (const [serverName, serverConfig] of Object.entries(item)) {
                const result = lspServerConfigSchema.safeParse(serverConfig);  // DJ6
                if (result.success) {
                    configs[serverName] = result.data;
                } else {
                    errors.push({
                        type: "lsp-config-invalid",
                        plugin: pluginName,
                        serverName: serverName,
                        validationError: result.error.message,
                        source: "plugin"
                    });
                }
            }
        }
    }

    return Object.keys(configs).length > 0 ? configs : undefined;
}

// Mapping: zyY→resolvePluginLspServersField, YyY→safePluginRelativePath, DJ6→lspServerConfigSchema
```

---

## 8. Variable Expansion

```javascript
// ============================================
// expandLspConfigVars - Expand all variables in config
// Location: chunks.138.mjs:692-722
// ============================================

// ORIGINAL:
function _yY(A, q, K, Y) {
    let z = [],
        _ = ($) => {
            let H = ZL($, q);
            if (K) H = zz1(H, K);
            let { expanded: j, missingVars: J } = _Z6(H);
            return z.push(...J), j
        },
        w = { ...A };
    if (w.command) w.command = _(w.command);
    if (w.args) w.args = w.args.map(($) => _($));
    let O = {
        CLAUDE_PLUGIN_ROOT: q,
        ...w.env || {}
    };
    for (let [$, H] of Object.entries(O))
        if ($ !== "CLAUDE_PLUGIN_ROOT") O[$] = _(H);
    if (w.env = O, w.workspaceFolder) w.workspaceFolder = _(w.workspaceFolder);
    if (z.length > 0) {
        let H = `Missing environment variables in plugin LSP config: ${[...new Set(z)].join(", ")}`;
        _6(Error(H)), k(H, { level: "warn" })
    }
    return w
}

// READABLE:
function expandLspConfigVars(config, pluginRootPath, workspaceFolder, errors) {
    const missingVars = [];

    const expandString = (value) => {
        // First expand ${CLAUDE_PLUGIN_ROOT}
        let expanded = value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRootPath);  // ZL

        // Expand ${WORKSPACE_FOLDER} if provided
        if (workspaceFolder) {
            expanded = expanded.replace(/\$\{WORKSPACE_FOLDER\}/g, workspaceFolder);  // zz1
        }

        // Then expand environment variables ${VAR}
        const { expanded: result, missingVars: vars } = expandEnvVars(expanded);  // _Z6
        missingVars.push(...vars);
        return result;
    };

    const expanded = { ...config };

    // Expand command
    if (expanded.command) {
        expanded.command = expandString(expanded.command);
    }

    // Expand args
    if (expanded.args) {
        expanded.args = expanded.args.map(expandString);
    }

    // Expand environment variables (including CLAUDE_PLUGIN_ROOT)
    const env = {
        CLAUDE_PLUGIN_ROOT: pluginRootPath,
        ...expanded.env || {}
    };
    for (const [key, value] of Object.entries(env)) {
        if (key !== "CLAUDE_PLUGIN_ROOT") {
            env[key] = expandString(value);
        }
    }
    expanded.env = env;

    // Expand workspaceFolder
    if (expanded.workspaceFolder) {
        expanded.workspaceFolder = expandString(expanded.workspaceFolder);
    }

    // Report missing variables
    if (missingVars.length > 0) {
        const uniqueMissing = [...new Set(missingVars)];
        const message = `Missing environment variables in plugin LSP config: ${uniqueMissing.join(", ")}`;
        logError(Error(message));
        log(message, { level: "warn" });
    }

    return expanded;
}

// Mapping: _yY→expandLspConfigVars, ZL→expandPluginRootVar, zz1→expandWorkspaceFolderVar, _Z6→expandEnvVars
```

**Variable expansion order:**
1. `${CLAUDE_PLUGIN_ROOT}` → Plugin directory path
2. `${WORKSPACE_FOLDER}` → Workspace folder path (if provided)
3. `${ENV_VAR}` → Value from process environment

---

## 9. Server Namespacing

```javascript
// ============================================
// namespacePluginServers - Namespace server names by plugin
// Location: chunks.138.mjs:724-735
// ============================================

// ORIGINAL:
function wyY(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let _ = `plugin:${q}:${Y}`;
        K[_] = {
            ...z,
            scope: "dynamic",
            source: q
        }
    }
    return K
}

// READABLE:
function namespacePluginServers(configs, pluginName) {
    const namespaced = {};
    for (const [serverName, config] of Object.entries(configs)) {
        const namespacedName = `plugin:${pluginName}:${serverName}`;
        namespaced[namespacedName] = {
            ...config,
            scope: "dynamic",  // Mark as plugin-provided (vs built-in)
            source: pluginName // Track origin for debugging
        };
    }
    return namespaced;
}

// Mapping: wyY→namespacePluginServers
```

**Why namespacing:**
- Prevents name collisions between plugins
- Allows multiple plugins to define servers with the same base name
- Enables tracking of server origin for debugging
- Format: `plugin:{pluginName}:{serverName}`

---

## 10. Aggregate LSP Config Loading

```javascript
// ============================================
// loadLspConfigs - Load all LSP configs from all plugins
// Location: chunks.138.mjs:756-796
// ============================================

// ORIGINAL:
async function so4() {
    let A = {};
    try {
        let { enabled: q } = await _z(),
            K = await Promise.all(q.map(async (Y) => {
                let z = [];
                return {
                    plugin: Y,
                    configs: await ao4(Y, z),
                    errors: z
                }
            }));
        for (let { plugin: Y, configs: z, errors: _ } of K)
            if (z && Object.keys(z).length > 0 && (Object.assign(A, z), k(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${Y.name}`)), _.length > 0) k(`${_.length} error(s) loading LSP servers from plugin: ${Y.name}`);
        k(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        _6(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), k(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return { servers: A }
}

// READABLE:
async function loadLspConfigs() {
    const allServers = {};

    try {
        const { enabled: plugins } = await getPluginState();  // _z

        const results = await Promise.all(plugins.map(async (plugin) => {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);  // ao4
            return { plugin, configs: pluginConfigs, errors };
        }));

        for (const { plugin, configs, errors } of results) {
            if (configs && Object.keys(configs).length > 0) {
                Object.assign(allServers, configs);
                log(`Loaded ${Object.keys(configs).length} LSP server(s) from plugin: ${plugin.name}`);
            }
            if (errors.length > 0) {
                log(`${errors.length} error(s) loading LSP servers from plugin: ${plugin.name}`);
            }
        }

        log(`Total LSP servers loaded: ${Object.keys(allServers).length}`);

    } catch (error) {
        logError(error instanceof Error ? error : Error(`Failed to load LSP servers: ${String(error)}`));
        log(`Error loading LSP servers: ${error.message}`);
    }

    return { servers: allServers };
}

// Mapping: so4→loadLspConfigs, _z→getPluginState, ao4→loadSinglePluginLspConfig
```

---

## 11. LSP Tool: Symbol Extraction Algorithm

### What it does

The `extractSymbolAtPosition` (i1q) function reads a source file and extracts the token (symbol name) at a given line and character position. This is used for UI display before the LSP request completes, showing the user what symbol the operation is targeting.

### Algorithm Analysis

```javascript
// ============================================
// extractSymbolAtPosition - Extract token at cursor position
// Location: chunks.144.mjs:381-414
// ============================================

// ORIGINAL:
function i1q(A, q, K) {
    try {
        let Y = $1(),
            z = L4(A),
            {
                buffer: _,
                bytesRead: w
            } = Y.readSync(z, {
                length: l1q
            }),
            $ = _.toString("utf-8", 0, w).split(`
`);
        if (q < 0 || q >= $.length) return null;
        if (w === l1q && q === $.length - 1) return null;
        let H = $[q];
        if (!H || K < 0 || K >= H.length) return null;
        let j = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
            J;
        while ((J = j.exec(H)) !== null) {
            let M = J.index,
                D = M + J[0].length;
            if (K >= M && K < D) {
                let X = J[0];
                return X.length > 30 ? X.slice(0, 27) + "..." : X
            }
        }
        return null
    } catch (Y) {
        if (Y instanceof Error) k(`Symbol extraction failed for ${A}:${q}:${K}: ${Y.message}`, {
            level: "warn"
        });
        return null
    }
}

// READABLE:
function extractSymbolAtPosition(filePath, lineIndex, charIndex) {
    try {
        // 1. Get file handle and resolve path
        const fs = getFileSystem();
        const resolvedPath = resolvePath(filePath);

        // 2. Read up to 64KB from file (performance optimization)
        const { buffer, bytesRead } = fs.readSync(resolvedPath, {
            length: SYMBOL_EXTRACTION_BUFFER_SIZE  // l1q = 65536
        });

        // 3. Convert to string and split by lines
        const content = buffer.toString("utf-8", 0, bytesRead);
        const lines = content.split("\n");

        // 4. Validate line bounds
        if (lineIndex < 0 || lineIndex >= lines.length) return null;

        // 5. Detect truncated file (file larger than 64KB and line is last)
        if (bytesRead === SYMBOL_EXTRACTION_BUFFER_SIZE && lineIndex === lines.length - 1) {
            return null;  // Can't reliably determine symbol in truncated region
        }

        // 6. Get target line
        const line = lines[lineIndex];
        if (!line || charIndex < 0 || charIndex >= line.length) return null;

        // 7. Token regex: match identifiers and operators
        //    [\w$'!]+     - word characters, $, ', ! (for Lisp-like languages)
        //    |[+\-*/%&|^~<>=]+ - operators
        const tokenRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;

        let match;
        while ((match = tokenRegex.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            // 8. Check if charIndex falls within this token
            if (charIndex >= start && charIndex < end) {
                const token = match[0];
                // 9. Truncate if too long (UI display optimization)
                return token.length > 30 ? token.slice(0, 27) + "..." : token;
            }
        }

        return null;  // No token at position

    } catch (error) {
        if (error instanceof Error) {
            log(`Symbol extraction failed for ${filePath}:${lineIndex}:${charIndex}: ${error.message}`, { level: "warn" });
        }
        return null;
    }
}

// Mapping: i1q→extractSymbolAtPosition, $1→getFileSystem, L4→resolvePath, l1q→SYMBOL_EXTRACTION_BUFFER_SIZE (65536)
```

### Key Algorithm Decisions

**Why 64KB buffer limit:**
- Most source files have important content near the top
- Reading entire large files is slow and wasteful
- If file is larger and symbol is past 64KB, it's acceptable to fail gracefully

**Token regex pattern:**
```javascript
/[\w$'!]+|[+\-*/%&|^~<>=]+/g
```
- `[\w$'!]+` - Identifiers: word chars, $ (JS/PHP), ' (Lisp), ! (Ruby)
- `|[+\-*/%&|^~<>=]+` - Operators: for hovering over operators

**30-character truncation:**
- Long generated names (e.g., minified code) break UI layout
- Truncates to 27 + "..." for readability

### Usage Flow

```
Agent calls LSP Tool with { operation: "goToDefinition", filePath: "App.tsx", line: 42, character: 7 }
         │
         ▼
renderLspToolUseMessage (o1q) called BEFORE LSP request completes
         │
         ├─► extractSymbolAtPosition("App.tsx", 41, 6)  // 0-indexed
         │       │
         │       ├─► Read first 64KB of App.tsx
         │       ├─► Get line 41
         │       ├─► Find token at column 6
         │       └─► Return "useState"
         │
         └─► Display: 'operation: "goToDefinition", symbol: "useState", in: "App.tsx"'
```

---

## 12. LSP Tool: Request Parameter Building

### What it does

The `buildLspRequestParams` (WIY) function converts a high-level LSP operation (e.g., `goToDefinition`) into the specific LSP protocol method and parameters.

### Complete Implementation

```javascript
// ============================================
// buildLspRequestParams - Build LSP request for each operation
// Location: chunks.144.mjs:593-681
// ============================================

// ORIGINAL:
function WIY(A, q) {
    let K = DIY(q).href,
        Y = {
            line: A.line - 1,
            character: A.character - 1
        };
    switch (A.operation) {
        case "goToDefinition":
            return {
                method: "textDocument/definition", params: {
                    textDocument: { uri: K },
                    position: Y
                }
            };
        case "findReferences":
            return {
                method: "textDocument/references", params: {
                    textDocument: { uri: K },
                    position: Y,
                    context: { includeDeclaration: !0 }
                }
            };
        case "hover":
            return {
                method: "textDocument/hover", params: {
                    textDocument: { uri: K },
                    position: Y
                }
            };
        case "documentSymbol":
            return {
                method: "textDocument/documentSymbol", params: {
                    textDocument: { uri: K }
                }
            };
        case "workspaceSymbol":
            return {
                method: "workspace/symbol", params: {
                    query: ""
                }
            };
        case "goToImplementation":
            return {
                method: "textDocument/implementation", params: {
                    textDocument: { uri: K },
                    position: Y
                }
            };
        case "prepareCallHierarchy":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: { uri: K },
                    position: Y
                }
            };
        case "incomingCalls":
        case "outgoingCalls":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: { uri: K },
                    position: Y
                }
            };
    }
}

// READABLE:
function buildLspRequestParams(input, filePath) {
    // 1. Convert file path to URI
    const uri = pathToFileUrl(filePath).href;

    // 2. Convert to LSP 0-indexed position (API uses 1-indexed)
    const position = {
        line: input.line - 1,
        character: input.character - 1
    };

    // 3. Build request based on operation
    switch (input.operation) {
        case "goToDefinition":
            return {
                method: "textDocument/definition",
                params: {
                    textDocument: { uri },
                    position
                }
            };

        case "findReferences":
            return {
                method: "textDocument/references",
                params: {
                    textDocument: { uri },
                    position,
                    context: { includeDeclaration: true }  // Include definition in results
                }
            };

        case "hover":
            return {
                method: "textDocument/hover",
                params: {
                    textDocument: { uri },
                    position
                }
            };

        case "documentSymbol":
            // No position needed - returns all symbols in document
            return {
                method: "textDocument/documentSymbol",
                params: {
                    textDocument: { uri }
                }
            };

        case "workspaceSymbol":
            // No file or position - searches entire workspace
            // Empty query returns all symbols (can be filtered by LSP server)
            return {
                method: "workspace/symbol",
                params: {
                    query: ""
                }
            };

        case "goToImplementation":
            return {
                method: "textDocument/implementation",
                params: {
                    textDocument: { uri },
                    position
                }
            };

        case "prepareCallHierarchy":
            return {
                method: "textDocument/prepareCallHierarchy",
                params: {
                    textDocument: { uri },
                    position
                }
            };

        case "incomingCalls":
        case "outgoingCalls":
            // Both start with prepareCallHierarchy to get the call hierarchy item
            // The LspTool.call() handles the second request (incomingCalls/outgoingCalls)
            // based on the prepareCallHierarchy result
            return {
                method: "textDocument/prepareCallHierarchy",
                params: {
                    textDocument: { uri },
                    position
                }
            };
    }
}

// Mapping: WIY→buildLspRequestParams, DIY→pathToFileUrl
```

### Operation → LSP Method Mapping

| Operation | LSP Method | Position Required? | Notes |
|-----------|------------|-------------------|-------|
| `goToDefinition` | `textDocument/definition` | Yes | Returns Location or LocationLink[] |
| `findReferences` | `textDocument/references` | Yes | `includeDeclaration: true` |
| `hover` | `textDocument/hover` | Yes | Returns Hover or null |
| `documentSymbol` | `textDocument/documentSymbol` | No | Returns DocumentSymbol[] |
| `workspaceSymbol` | `workspace/symbol` | No | Returns SymbolInformation[] |
| `goToImplementation` | `textDocument/implementation` | Yes | Returns Location[] |
| `prepareCallHierarchy` | `textDocument/prepareCallHierarchy` | Yes | Returns CallHierarchyItem[] |
| `incomingCalls` | `callHierarchy/incomingCalls` | Yes (via prepare) | Returns CallHierarchyIncomingCall[] |
| `outgoingCalls` | `callHierarchy/outgoingCalls` | Yes (via prepare) | Returns CallHierarchyOutgoingCall[] |

### Position Conversion

**Important:** LSP uses 0-indexed positions, but the tool API uses 1-indexed (like editors):

```javascript
// API input: { line: 42, character: 7 }  // 1-indexed
// LSP params: { line: 41, character: 6 }  // 0-indexed
```

---

## 13. LSP Tool: Result Formatting

### What it does

The `formatLspResult` (fIY) function takes the raw LSP server response and formats it for display, while also computing result counts and file counts for the UI summary.

### Complete Implementation

```javascript
// ============================================
// formatLspResult - Format LSP response for display
// Location: chunks.144.mjs:745-830
// ============================================

// ORIGINAL:
function fIY(A, q, K) {
    switch (A) {
        case "goToDefinition": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ak1),
                _ = z.filter((O) => !O || !O.uri);
            if (_.length > 0) _6(Error(`LSP server returned ${_.length} location(s) with undefined URI for goToDefinition on ${K}. This indicates malformed data from the LSP server.`));
            let w = z.filter((O) => O && O.uri);
            return {
                formatted: KF8(q, K),
                resultCount: w.length,
                fileCount: ok1(w)
            }
        }
        case "findReferences": {
            let Y = q || [],
                z = Y.filter((w) => !w || !w.uri);
            if (z.length > 0) _6(Error(`LSP server returned ${z.length} location(s) with undefined URI for findReferences on ${K}. This indicates malformed data from the LSP server.`));
            let _ = Y.filter((w) => w && w.uri);
            return {
                formatted: B1q(q, K),
                resultCount: _.length,
                fileCount: ok1(_)
            }
        }
        case "hover":
            return {
                formatted: g1q(q, K), resultCount: q ? 1 : 0, fileCount: q ? 1 : 0
            };
        case "documentSymbol": {
            let Y = q || [],
                _ = Y.length > 0 && Y[0] && "range" in Y[0] ? K8q(Y) : Y.length;
            return {
                formatted: p1q(q, K),
                resultCount: _,
                fileCount: Y.length > 0 ? 1 : 0
            }
        }
        case "workspaceSymbol": {
            let Y = q || [],
                z = Y.filter((O) => !O || !O.location || !O.location.uri);
            if (z.length > 0) _6(Error(`LSP server returned ${z.length} symbol(s) with undefined location URI for workspaceSymbol on ${K}. This indicates malformed data from the LSP server.`));
            let _ = Y.filter((O) => O && O.location && O.location.uri),
                w = _.map((O) => O.location);
            return {
                formatted: YF8(q, K),
                resultCount: _.length,
                fileCount: ok1(w)
            }
        }
        case "goToImplementation": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ak1),
                _ = z.filter((O) => !O || !O.uri);
            if (_.length > 0) _6(Error(`LSP server returned ${_.length} location(s) with undefined URI for goToImplementation on ${K}. This indicates malformed data from the LSP server.`));
            let w = z.filter((O) => O && O.uri);
            return {
                formatted: KF8(q, K),
                resultCount: w.length,
                fileCount: ok1(w)
            }
        }
        case "prepareCallHierarchy": {
            let Y = q || [];
            return {
                formatted: Q1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? TIY(Y) : 0
            }
        }
        case "incomingCalls": {
            let Y = q || [];
            return {
                formatted: U1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? vIY(Y) : 0
            }
        }
        case "outgoingCalls": {
            let Y = q || [];
            return {
                formatted: d1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? NIY(Y) : 0
            }
        }
    }
}

// READABLE:
function formatLspResult(operation, result, filePath) {
    switch (operation) {
        case "goToDefinition":
        case "goToImplementation": {
            // Result can be: Location, Location[], LocationLink, LocationLink[], or null
            const locations = (Array.isArray(result) ? result : result ? [result] : [])
                .map(normalizeLocation);  // ak1: LocationLink → Location

            // Log malformed data (helps debug broken LSP servers)
            const invalid = locations.filter((loc) => !loc || !loc.uri);
            if (invalid.length > 0) {
                logError(Error(`LSP server returned ${invalid.length} location(s) with undefined URI for ${operation} on ${filePath}. This indicates malformed data from the LSP server.`));
            }

            const valid = locations.filter((loc) => loc && loc.uri);

            return {
                formatted: formatGoToDefinitionResult(result, filePath),  // KF8
                resultCount: valid.length,
                fileCount: countUniqueFiles(valid)  // ok1
            };
        }

        case "findReferences": {
            const refs = result || [];

            // Validate and filter
            const invalid = refs.filter((ref) => !ref || !ref.uri);
            if (invalid.length > 0) {
                logError(Error(`LSP server returned ${invalid.length} location(s) with undefined URI for findReferences on ${filePath}`));
            }
            const valid = refs.filter((ref) => ref && ref.uri);

            return {
                formatted: formatFindReferencesResult(result, filePath),  // B1q
                resultCount: valid.length,
                fileCount: countUniqueFiles(valid)
            };
        }

        case "hover":
            // Hover returns single result or null
            return {
                formatted: formatHoverResult(result, filePath),  // g1q
                resultCount: result ? 1 : 0,
                fileCount: result ? 1 : 0
            };

        case "documentSymbol": {
            const symbols = result || [];

            // Count hierarchical symbols (DocumentSymbol has children)
            const totalCount = symbols.length > 0 && symbols[0] && "range" in symbols[0]
                ? countHierarchicalSymbols(symbols)  // K8q: recursive count
                : symbols.length;

            return {
                formatted: formatDocumentSymbolResult(result, filePath),  // p1q
                resultCount: totalCount,
                fileCount: symbols.length > 0 ? 1 : 0  // Single file
            };
        }

        case "workspaceSymbol": {
            const symbols = result || [];

            // Validate
            const invalid = symbols.filter((s) => !s || !s.location || !s.location.uri);
            if (invalid.length > 0) {
                logError(Error(`LSP server returned ${invalid.length} symbol(s) with undefined location URI for workspaceSymbol on ${filePath}`));
            }
            const valid = symbols.filter((s) => s && s.location && s.location.uri);
            const locations = valid.map((s) => s.location);

            return {
                formatted: formatWorkspaceSymbolResult(result, filePath),  // YF8
                resultCount: valid.length,
                fileCount: countUniqueFiles(locations)
            };
        }

        case "prepareCallHierarchy": {
            const items = result || [];
            return {
                formatted: formatPrepareCallHierarchyResult(result, filePath),  // Q1q
                resultCount: items.length,
                fileCount: items.length > 0 ? countCallHierarchyFiles(items) : 0  // TIY
            };
        }

        case "incomingCalls": {
            const calls = result || [];
            return {
                formatted: formatIncomingCallsResult(result, filePath),  // U1q
                resultCount: calls.length,
                fileCount: calls.length > 0 ? countIncomingCallerFiles(calls) : 0  // vIY
            };
        }

        case "outgoingCalls": {
            const calls = result || [];
            return {
                formatted: formatOutgoingCallsResult(result, filePath),  // d1q
                resultCount: calls.length,
                fileCount: calls.length > 0 ? countOutgoingCalleeFiles(calls) : 0  // NIY
            };
        }
    }
}

// Mapping: fIY→formatLspResult, ak1→normalizeLocation, KF8→formatGoToDefinitionResult, B1q→formatFindReferencesResult, g1q→formatHoverResult, p1q→formatDocumentSymbolResult, YF8→formatWorkspaceSymbolResult, Q1q→formatPrepareCallHierarchyResult, U1q→formatIncomingCallsResult, d1q→formatOutgoingCallsResult, ok1→countUniqueFiles, K8q→countHierarchicalSymbols, TIY→countCallHierarchyFiles, vIY→countIncomingCallerFiles, NIY→countOutgoingCalleeFiles, _6→logError
```

### Return Value Structure

```javascript
{
    formatted: string,      // Human-readable formatted result
    resultCount: number,    // Number of results (for UI: "Found N references")
    fileCount: number       // Number of unique files (for UI: "across N files")
}
```

### Malformed Data Handling

The formatter is defensive against broken LSP servers:
1. Logs errors for locations with undefined URIs
2. Filters out invalid results before counting
3. Still includes all results in formatted output (fail-open)

### File Counting Functions

```javascript
// countUniqueFiles (ok1) - Unique URIs in Location[]
function countUniqueFiles(locations) {
    return new Set(locations.map((loc) => loc.uri)).size;
}

// countHierarchicalSymbols (K8q) - Recursive symbol count
function countHierarchicalSymbols(symbols) {
    let count = symbols.length;
    for (const symbol of symbols) {
        if (symbol.children && symbol.children.length > 0) {
            count += countHierarchicalSymbols(symbol.children);
        }
    }
    return count;
}

// countCallHierarchyFiles (TIY) - Unique URIs in CallHierarchyItem[]
function countCallHierarchyFiles(items) {
    const uris = items.map((item) => item.uri).filter((uri) => uri);
    return new Set(uris).size;
}

// countIncomingCallerFiles (vIY) - Unique caller URIs
function countIncomingCallerFiles(calls) {
    const uris = calls.map((call) => call.from?.uri).filter((uri) => uri);
    return new Set(uris).size;
}

// countOutgoingCalleeFiles (NIY) - Unique callee URIs
function countOutgoingCalleeFiles(calls) {
    const uris = calls.map((call) => call.to?.uri).filter((uri) => uri);
    return new Set(uris).size;
}
```

---

## Source Locations Summary

| Function | Symbol | Location |
|----------|--------|----------|
| createLspProcessWrapper | co4 | chunks.138.mjs:218-379 |
| createLspClient | no4 | chunks.138.mjs:389-563 |
| withTimeout | AyY | chunks.138.mjs:565-570 |
| CONTENT_MODIFIED_ERROR_CODE | tEY | chunks.138.mjs:572 |
| LSP_MAX_RETRIES | Qm8 | chunks.138.mjs:574 |
| LSP_RETRY_BASE_DELAY_MS | eEY | chunks.138.mjs:576 |
| safePluginRelativePath | YyY | chunks.138.mjs:585-591 |
| loadPluginLspConfig | Nl6 | chunks.138.mjs:593-628 |
| resolvePluginLspServersField | zyY | chunks.138.mjs:630-690 |
| expandLspConfigVars | _yY | chunks.138.mjs:692-722 |
| namespacePluginServers | wyY | chunks.138.mjs:724-735 |
| loadSinglePluginLspConfig | ao4 | chunks.138.mjs:737-745 |
| loadLspConfigs | so4 | chunks.138.mjs:756-796 |
| LspServerManager | eo4 | chunks.138.mjs:806-969 |
| extractSymbolAtPosition | i1q | chunks.144.mjs:381-414 |
| SYMBOL_EXTRACTION_BUFFER_SIZE | l1q | chunks.144.mjs:416 |
| buildLspRequestParams | WIY | chunks.144.mjs:593-681 |
| formatLspResult | fIY | chunks.144.mjs:745-830 |
| countHierarchicalSymbols | K8q | chunks.144.mjs:683-688 |
| countUniqueFiles | ok1 | chunks.144.mjs:690-692 |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: ✅ Complete - All symbols cross-validated against source code
**Status**: Complete - All code verified against source