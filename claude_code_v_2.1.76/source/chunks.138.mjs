
// @from(Ln 342183, Col 4)
do4 = x((MY) => {
    var BEY = MY && MY.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        gEY = MY && MY.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) BEY(q, A, K)
        };
    Object.defineProperty(MY, "__esModule", {
        value: !0
    });
    MY.createMessageConnection = MY.createServerSocketTransport = MY.createClientSocketTransport = MY.createServerPipeTransport = MY.createClientPipeTransport = MY.generateRandomPipeName = MY.StreamMessageWriter = MY.StreamMessageReader = MY.SocketMessageWriter = MY.SocketMessageReader = MY.PortMessageWriter = MY.PortMessageReader = MY.IPCMessageWriter = MY.IPCMessageReader = void 0;
    var sf6 = mo4();
    sf6.default.install();
    var Bo4 = x6("path"),
        FEY = x6("os"),
        pEY = x6("crypto"),
        BV1 = x6("net"),
        PE = uV1();
    gEY(uV1(), MY);
    class Fo4 extends PE.AbstractMessageReader {
        constructor(A) {
            super();
            this.process = A;
            let q = this.process;
            q.on("error", (K) => this.fireError(K)), q.on("close", () => this.fireClose())
        }
        listen(A) {
            return this.process.on("message", A), PE.Disposable.create(() => this.process.off("message", A))
        }
    }
    MY.IPCMessageReader = Fo4;
    class po4 extends PE.AbstractMessageWriter {
        constructor(A) {
            super();
            this.process = A, this.errorCount = 0;
            let q = this.process;
            q.on("error", (K) => this.fireError(K)), q.on("close", () => this.fireClose)
        }
        write(A) {
            try {
                if (typeof this.process.send === "function") this.process.send(A, void 0, void 0, (q) => {
                    if (q) this.errorCount++, this.handleError(q, A);
                    else this.errorCount = 0
                });
                return Promise.resolve()
            } catch (q) {
                return this.handleError(q, A), Promise.reject(q)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {}
    }
    MY.IPCMessageWriter = po4;
    class Qo4 extends PE.AbstractMessageReader {
        constructor(A) {
            super();
            this.onData = new PE.Emitter, A.on("close", () => this.fireClose), A.on("error", (q) => this.fireError(q)), A.on("message", (q) => {
                this.onData.fire(q)
            })
        }
        listen(A) {
            return this.onData.event(A)
        }
    }
    MY.PortMessageReader = Qo4;
    class Uo4 extends PE.AbstractMessageWriter {
        constructor(A) {
            super();
            this.port = A, this.errorCount = 0, A.on("close", () => this.fireClose()), A.on("error", (q) => this.fireError(q))
        }
        write(A) {
            try {
                return this.port.postMessage(A), Promise.resolve()
            } catch (q) {
                return this.handleError(q, A), Promise.reject(q)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {}
    }
    MY.PortMessageWriter = Uo4;
    class tf6 extends PE.ReadableStreamMessageReader {
        constructor(A, q = "utf-8") {
            super((0, sf6.default)().stream.asReadableStream(A), q)
        }
    }
    MY.SocketMessageReader = tf6;
    class ef6 extends PE.WriteableStreamMessageWriter {
        constructor(A, q) {
            super((0, sf6.default)().stream.asWritableStream(A), q);
            this.socket = A
        }
        dispose() {
            super.dispose(), this.socket.destroy()
        }
    }
    MY.SocketMessageWriter = ef6;
    class Fm8 extends PE.ReadableStreamMessageReader {
        constructor(A, q) {
            super((0, sf6.default)().stream.asReadableStream(A), q)
        }
    }
    MY.StreamMessageReader = Fm8;
    class pm8 extends PE.WriteableStreamMessageWriter {
        constructor(A, q) {
            super((0, sf6.default)().stream.asWritableStream(A), q)
        }
    }
    MY.StreamMessageWriter = pm8;
    var go4 = process.env.XDG_RUNTIME_DIR,
        QEY = new Map([
            ["linux", 107],
            ["darwin", 103]
        ]);

    function UEY() {
        let A = (0, pEY.randomBytes)(21).toString("hex");
        if (process.platform === "win32") return `\\\\.\\pipe\\vscode-jsonrpc-${A}-sock`;
        let q;
        if (go4) q = Bo4.join(go4, `vscode-ipc-${A}.sock`);
        else q = Bo4.join(FEY.tmpdir(), `vscode-${A}.sock`);
        let K = QEY.get(process.platform);
        if (K !== void 0 && q.length > K)(0, sf6.default)().console.warn(`WARNING: IPC handle "${q}" is longer than ${K} characters.`);
        return q
    }
    MY.generateRandomPipeName = UEY;

    function dEY(A, q = "utf-8") {
        let K, Y = new Promise((z, _) => {
            K = z
        });
        return new Promise((z, _) => {
            let w = (0, BV1.createServer)((O) => {
                w.close(), K([new tf6(O, q), new ef6(O, q)])
            });
            w.on("error", _), w.listen(A, () => {
                w.removeListener("error", _), z({
                    onConnected: () => {
                        return Y
                    }
                })
            })
        })
    }
    MY.createClientPipeTransport = dEY;

    function cEY(A, q = "utf-8") {
        let K = (0, BV1.createConnection)(A);
        return [new tf6(K, q), new ef6(K, q)]
    }
    MY.createServerPipeTransport = cEY;

    function lEY(A, q = "utf-8") {
        let K, Y = new Promise((z, _) => {
            K = z
        });
        return new Promise((z, _) => {
            let w = (0, BV1.createServer)((O) => {
                w.close(), K([new tf6(O, q), new ef6(O, q)])
            });
            w.on("error", _), w.listen(A, "127.0.0.1", () => {
                w.removeListener("error", _), z({
                    onConnected: () => {
                        return Y
                    }
                })
            })
        })
    }
    MY.createClientSocketTransport = lEY;

    function iEY(A, q = "utf-8") {
        let K = (0, BV1.createConnection)(A, "127.0.0.1");
        return [new tf6(K, q), new ef6(K, q)]
    }
    MY.createServerSocketTransport = iEY;

    function nEY(A) {
        let q = A;
        return q.read !== void 0 && q.addListener !== void 0
    }

    function rEY(A) {
        let q = A;
        return q.write !== void 0 && q.addListener !== void 0
    }

    function oEY(A, q, K, Y) {
        if (!K) K = PE.NullLogger;
        let z = nEY(A) ? new Fm8(A) : A,
            _ = rEY(q) ? new pm8(q) : q;
        if (PE.ConnectionStrategy.is(Y)) Y = {
            connectionStrategy: Y
        };
        return (0, PE.createMessageConnection)(z, _, K, Y)
    }
    MY.createMessageConnection = oEY
})
// @from(Ln 342401, Col 0)
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
// @from(Ln 342563, Col 4)
g66
// @from(Ln 342564, Col 4)
lo4 = E(() => {
    k1();
    H1();
    g66 = t(do4(), 1)
})
// @from(Ln 342574, Col 0)
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
// @from(Ln 342750, Col 0)
function AyY(A, q, K) {
    let Y, z = new Promise((_, w) => {
        Y = setTimeout((O, $) => O(Error($)), q, w, K)
    });
    return Promise.race([A, z]).finally(() => clearTimeout(Y))
}
// @from(Ln 342756, Col 4)
tEY = -32801
// @from(Ln 342757, Col 4)
Qm8 = 3
// @from(Ln 342758, Col 4)
eEY = 500
// @from(Ln 342759, Col 4)
ro4 = E(() => {
    lo4();
    k1();
    H1();
    lA()
})
// @from(Ln 342774, Col 0)
function YyY(A, q) {
    let K = Um8(A),
        Y = Um8(A, q),
        z = KyY(K, Y);
    if (z.startsWith("..") || Um8(z) === z) return null;
    return Y
}
// @from(Ln 342781, Col 0)
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
            let _ = z instanceof Error ? `Failed to read/parse .lsp.json in plugin ${A.name}: ${z.message}` : `Failed to read/parse .lsp.json file in plugin ${A.name}`;
            _6(z instanceof Error ? z : Error(_)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: z instanceof Error ? `Failed to parse JSON: ${z.message}` : "Failed to parse JSON file",
                source: "plugin"
            })
        }
    }
    if (A.manifest.lspServers) {
        let z = await zyY(A.manifest.lspServers, A.path, A.name, q);
        if (z) Object.assign(K, z)
    }
    return Object.keys(K).length > 0 ? K : void 0
}
// @from(Ln 342817, Col 0)
async function zyY(A, q, K, Y) {
    let z = {},
        _ = Array.isArray(A) ? A : [A];
    for (let w of _)
        if (typeof w === "string") {
            let O = YyY(q, w);
            if (!O) {
                let $ = `Security: Path traversal attempt blocked in plugin ${K}: ${w}`;
                _6(Error($)), k($, {
                    level: "warn"
                }), Y.push({
                    type: "lsp-config-invalid",
                    plugin: K,
                    serverName: w,
                    validationError: "Invalid path: must be relative and within plugin directory",
                    source: "plugin"
                });
                continue
            }
            try {
                let $ = await oo4(O, "utf-8"),
                    H = i1($),
                    j = C.record(C.string(), DJ6()).safeParse(H);
                if (j.success) Object.assign(z, j.data);
                else {
                    let J = `LSP config validation failed for ${w} in plugin ${K}: ${j.error.message}`;
                    _6(Error(J)), Y.push({
                        type: "lsp-config-invalid",
                        plugin: K,
                        serverName: w,
                        validationError: j.error.message,
                        source: "plugin"
                    })
                }
            } catch ($) {
                let H = $ instanceof Error ? `Failed to read/parse LSP config from ${w} in plugin ${K}: ${$.message}` : `Failed to read/parse LSP config file ${w} in plugin ${K}`;
                _6($ instanceof Error ? $ : Error(H)), Y.push({
                    type: "lsp-config-invalid",
                    plugin: K,
                    serverName: w,
                    validationError: $ instanceof Error ? `Failed to parse JSON: ${$.message}` : "Failed to parse JSON file",
                    source: "plugin"
                })
            }
        } else
            for (let [O, $] of Object.entries(w)) {
                let H = DJ6().safeParse($);
                if (H.success) z[O] = H.data;
                else {
                    let j = `LSP config validation failed for inline server "${O}" in plugin ${K}: ${H.error.message}`;
                    _6(Error(j)), Y.push({
                        type: "lsp-config-invalid",
                        plugin: K,
                        serverName: O,
                        validationError: H.error.message,
                        source: "plugin"
                    })
                }
            }
    return Object.keys(z).length > 0 ? z : void 0
}
// @from(Ln 342879, Col 0)
function _yY(A, q, K, Y) {
    let z = [],
        _ = ($) => {
            let H = ZL($, q);
            if (K) H = zz1(H, K);
            let {
                expanded: j,
                missingVars: J
            } = _Z6(H);
            return z.push(...J), j
        },
        w = {
            ...A
        };
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
        _6(Error(H)), k(H, {
            level: "warn"
        })
    }
    return w
}
// @from(Ln 342911, Col 0)
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
// @from(Ln 342923, Col 0)
async function ao4(A, q = []) {
    if (!A.enabled) return;
    let K = A.lspServers || await Nl6(A, q);
    if (!K) return;
    let Y = void 0,
        z = {};
    for (let [_, w] of Object.entries(K)) z[_] = _yY(w, A.path, Y, q);
    return wyY(z, A.name)
}
// @from(Ln 342932, Col 4)
gV1 = E(() => {
    IW();
    K7();
    H1();
    k1();
    eu();
    g1()
})
// @from(Ln 342940, Col 0)
async function so4() {
    let A = {};
    try {
        let {
            enabled: q
        } = await _z(), K = await Promise.all(q.map(async (Y) => {
            let z = [];
            try {
                let _ = await ao4(Y, z);
                return {
                    plugin: Y,
                    scopedServers: _,
                    errors: z
                }
            } catch (_) {
                return k(`Failed to load LSP servers for plugin ${Y.name}: ${_}`, {
                    level: "error"
                }), {
                    plugin: Y,
                    scopedServers: void 0,
                    errors: z
                }
            }
        }));
        for (let {
                plugin: Y,
                scopedServers: z,
                errors: _
            }
            of K) {
            if (z && Object.keys(z).length > 0) Object.assign(A, z), k(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${Y.name}`);
            if (_.length > 0) k(`${_.length} error(s) loading LSP servers from plugin: ${Y.name}`)
        }
        k(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        _6(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), k(`Error loading LSP servers: ${_1(q)}`)
    }
    return {
        servers: A
    }
}
// @from(Ln 342981, Col 4)
to4 = E(() => {
    tH();
    gV1();
    H1();
    k1();
    s8()
})
// @from(Ln 342993, Col 0)
function eo4() {
    let A = new Map,
        q = new Map,
        K = new Map;
    async function Y() {
        let X;
        try {
            X = (await so4()).servers, k(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(X).length} server(s)`)
        } catch (P) {
            throw _6(Error(`Failed to load LSP server configuration: ${P.message}`)), P
        }
        for (let [P, W] of Object.entries(X)) try {
            if (!W.command) throw Error(`Server ${P} missing required 'command' field`);
            if (!W.extensionToLanguage || Object.keys(W.extensionToLanguage).length === 0) throw Error(`Server ${P} missing required 'extensionToLanguage' field`);
            let Z = Object.keys(W.extensionToLanguage);
            for (let f of Z) {
                let v = f.toLowerCase();
                if (!q.has(v)) q.set(v, []);
                let N = q.get(v);
                if (N) N.push(P)
            }
            let G = no4(P, W);
            A.set(P, G), G.onRequest("workspace/configuration", (f) => {
                return k(`LSP: Received workspace/configuration request from ${P}`), f.items.map(() => null)
            })
        } catch (Z) {
            _6(Error(`Failed to initialize LSP server ${P}: ${Z.message}`))
        }
        k(`LSP manager initialized with ${A.size} servers`)
    }
    async function z() {
        let X = Array.from(A.entries()).filter(([, Z]) => Z.state === "running" || Z.state === "error"),
            P = await Promise.allSettled(X.map(([, Z]) => Z.stop()));
        A.clear(), q.clear(), K.clear();
        let W = P.map((Z, G) => Z.status === "rejected" ? `${X[G][0]}: ${Z.reason.message}` : null).filter((Z) => Z !== null);
        if (W.length > 0) {
            let Z = Error(`Failed to stop ${W.length} LSP server(s): ${W.join("; ")}`);
            throw _6(Z), Z
        }
    }

    function _(X) {
        let P = fl.extname(X).toLowerCase(),
            W = q.get(P);
        if (!W || W.length === 0) return;
        let Z = W[0];
        if (!Z) return;
        return A.get(Z)
    }
    async function w(X) {
        let P = _(X);
        if (!P) return;
        if (P.state === "stopped") try {
            await P.start()
        } catch (W) {
            throw _6(Error(`Failed to start LSP server for file ${X}: ${W.message}`)), W
        }
        return P
    }
    async function O(X, P, W) {
        let Z = await w(X);
        if (!Z) return;
        try {
            return await Z.sendRequest(P, W)
        } catch (G) {
            throw _6(Error(`LSP request failed for file ${X}, method '${P}': ${G.message}`)), G
        }
    }

    function $() {
        return A
    }
    async function H(X, P) {
        let W = await w(X);
        if (!W) return;
        let Z = Vl6(fl.resolve(X)).href;
        if (K.get(Z) === W.name) {
            k(`LSP: File already open, skipping didOpen for ${X}`);
            return
        }
        let G = fl.extname(X).toLowerCase(),
            f = W.config.extensionToLanguage[G] || "plaintext";
        try {
            await W.sendNotification("textDocument/didOpen", {
                textDocument: {
                    uri: Z,
                    languageId: f,
                    version: 1,
                    text: P
                }
            }), K.set(Z, W.name), k(`LSP: Sent didOpen for ${X} (languageId: ${f})`)
        } catch (v) {
            let N = Error(`Failed to sync file open ${X}: ${v.message}`);
            throw _6(N), N
        }
    }
    async function j(X, P) {
        let W = _(X);
        if (!W || W.state !== "running") return H(X, P);
        let Z = Vl6(fl.resolve(X)).href;
        if (K.get(Z) !== W.name) return H(X, P);
        try {
            await W.sendNotification("textDocument/didChange", {
                textDocument: {
                    uri: Z,
                    version: 1
                },
                contentChanges: [{
                    text: P
                }]
            }), k(`LSP: Sent didChange for ${X}`)
        } catch (G) {
            let f = Error(`Failed to sync file change ${X}: ${G.message}`);
            throw _6(f), f
        }
    }
    async function J(X) {
        let P = _(X);
        if (!P || P.state !== "running") return;
        try {
            await P.sendNotification("textDocument/didSave", {
                textDocument: {
                    uri: Vl6(fl.resolve(X)).href
                }
            }), k(`LSP: Sent didSave for ${X}`)
        } catch (W) {
            let Z = Error(`Failed to sync file save ${X}: ${W.message}`);
            throw _6(Z), Z
        }
    }
    async function M(X) {
        let P = _(X);
        if (!P || P.state !== "running") return;
        let W = Vl6(fl.resolve(X)).href;
        try {
            await P.sendNotification("textDocument/didClose", {
                textDocument: {
                    uri: W
                }
            }), K.delete(W), k(`LSP: Sent didClose for ${X}`)
        } catch (Z) {
            let G = Error(`Failed to sync file close ${X}: ${Z.message}`);
            throw _6(G), G
        }
    }

    function D(X) {
        let P = Vl6(fl.resolve(X)).href;
        return K.has(P)
    }
    return {
        initialize: Y,
        shutdown: z,
        getServerForFile: _,
        ensureServerStarted: w,
        sendRequest: O,
        getAllServers: $,
        openFile: H,
        changeFile: j,
        saveFile: J,
        closeFile: M,
        isFileOpen: D
    }
}
// @from(Ln 343157, Col 4)
Aa4 = E(() => {
    ro4();
    to4();
    H1();
    k1()
})
// @from(Ln 343167, Col 0)
function Ya4({
    serverName: A,
    files: q
}) {
    let K = OyY();
    k(`LSP Diagnostics: Registering ${q.length} diagnostic file(s) from ${A} (ID: ${K})`), Tl.set(K, {
        serverName: A,
        files: q,
        timestamp: Date.now(),
        attachmentSent: !1
    })
}
// @from(Ln 343180, Col 0)
function Ka4(A) {
    switch (A) {
        case "Error":
            return 1;
        case "Warning":
            return 2;
        case "Info":
            return 3;
        case "Hint":
            return 4;
        default:
            return 4
    }
}
// @from(Ln 343195, Col 0)
function za4(A) {
    return B6({
        message: A.message,
        severity: A.severity,
        range: A.range,
        source: A.source || null,
        code: A.code || null
    })
}
// @from(Ln 343205, Col 0)
function HyY(A) {
    let q = new Map,
        K = [];
    for (let Y of A) {
        if (!q.has(Y.uri)) q.set(Y.uri, new Set), K.push({
            uri: Y.uri,
            diagnostics: []
        });
        let z = q.get(Y.uri),
            _ = K.find((O) => O.uri === Y.uri),
            w = F66.get(Y.uri) || new Set;
        for (let O of Y.diagnostics) try {
            let $ = za4(O);
            if (z.has($) || w.has($)) continue;
            z.add($), _.diagnostics.push(O)
        } catch ($) {
            let H = $ instanceof Error ? $ : Error(String($)),
                j = O.message?.substring(0, 100) || "<no message>";
            _6(Error(`Failed to deduplicate diagnostic in ${Y.uri}: ${H.message}. Diagnostic message: ${j}`)), _.diagnostics.push(O)
        }
    }
    return K.filter((Y) => Y.diagnostics.length > 0)
}
// @from(Ln 343229, Col 0)
function _a4() {
    k(`LSP Diagnostics: Checking registry - ${Tl.size} pending`);
    let A = [],
        q = new Set,
        K = [];
    for (let H of Tl.values())
        if (!H.attachmentSent) A.push(...H.files), q.add(H.serverName), K.push(H);
    if (A.length === 0) return [];
    let Y;
    try {
        Y = HyY(A)
    } catch (H) {
        let j = H instanceof Error ? H : Error(String(H));
        _6(Error(`Failed to deduplicate LSP diagnostics: ${j.message}`)), Y = A
    }
    for (let H of K) H.attachmentSent = !0;
    for (let [H, j] of Tl)
        if (j.attachmentSent) Tl.delete(H);
    let z = A.reduce((H, j) => H + j.diagnostics.length, 0),
        _ = Y.reduce((H, j) => H + j.diagnostics.length, 0);
    if (z > _) k(`LSP Diagnostics: Deduplication removed ${z-_} duplicate diagnostic(s)`);
    let w = 0,
        O = 0;
    for (let H of Y) {
        if (H.diagnostics.sort((J, M) => Ka4(J.severity) - Ka4(M.severity)), H.diagnostics.length > FV1) O += H.diagnostics.length - FV1, H.diagnostics = H.diagnostics.slice(0, FV1);
        let j = qa4 - w;
        if (H.diagnostics.length > j) O += H.diagnostics.length - j, H.diagnostics = H.diagnostics.slice(0, j);
        w += H.diagnostics.length
    }
    if (Y = Y.filter((H) => H.diagnostics.length > 0), O > 0) k(`LSP Diagnostics: Volume limiting removed ${O} diagnostic(s) (max ${FV1}/file, ${qa4} total)`);
    for (let H of Y) {
        if (!F66.has(H.uri)) F66.set(H.uri, new Set);
        let j = F66.get(H.uri);
        for (let J of H.diagnostics) try {
            j.add(za4(J))
        } catch (M) {
            let D = M instanceof Error ? M : Error(String(M)),
                X = J.message?.substring(0, 100) || "<no message>";
            _6(Error(`Failed to track delivered diagnostic in ${H.uri}: ${D.message}. Diagnostic message: ${X}`))
        }
    }
    let $ = Y.reduce((H, j) => H + j.diagnostics.length, 0);
    if ($ === 0) return k("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
    return k(`LSP Diagnostics: Delivering ${Y.length} file(s) with ${$} diagnostic(s) from ${q.size} server(s)`), [{
        serverName: Array.from(q).join(", "),
        files: Y
    }]
}
// @from(Ln 343278, Col 0)
function wa4() {
    k(`LSP Diagnostics: Clearing ${Tl.size} pending diagnostic(s)`), Tl.clear()
}
// @from(Ln 343282, Col 0)
function Oa4() {
    k(`LSP Diagnostics: Resetting all state (${Tl.size} pending, ${F66.size} files tracked)`), Tl.clear(), F66.clear()
}
// @from(Ln 343286, Col 0)
function pV1(A) {
    if (F66.has(A)) k(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), F66.delete(A)
}
// @from(Ln 343289, Col 4)
FV1 = 10
// @from(Ln 343290, Col 4)
qa4 = 30
// @from(Ln 343291, Col 4)
$yY = 500
// @from(Ln 343292, Col 4)
Tl
// @from(Ln 343292, Col 8)
F66
// @from(Ln 343293, Col 4)
AT6 = E(() => {
    H1();
    k1();
    I$6();
    g1();
    Tl = new Map, F66 = new kT({
        max: $yY
    })
})
// @from(Ln 343306, Col 0)
function JyY(A) {
    switch (A) {
        case 1:
            return "Error";
        case 2:
            return "Warning";
        case 3:
            return "Info";
        case 4:
            return "Hint";
        default:
            return "Error"
    }
}
// @from(Ln 343321, Col 0)
function MyY(A) {
    let q;
    try {
        q = A.uri.startsWith("file://") ? jyY(A.uri) : A.uri
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        _6(z), k(`Failed to convert URI to file path: ${A.uri}. Error: ${z.message}. Using original URI as fallback.`), q = A.uri
    }
    let K = A.diagnostics.map((Y) => ({
        message: Y.message,
        severity: JyY(Y.severity),
        range: {
            start: {
                line: Y.range.start.line,
                character: Y.range.start.character
            },
            end: {
                line: Y.range.end.line,
                character: Y.range.end.character
            }
        },
        source: Y.source,
        code: Y.code !== void 0 && Y.code !== null ? String(Y.code) : void 0
    }));
    return [{
        uri: q,
        diagnostics: K
    }]
}
// @from(Ln 343351, Col 0)
function $a4(A) {
    let q = A.getAllServers(),
        K = [],
        Y = 0,
        z = new Map;
    for (let [w, O] of q.entries()) try {
        if (!O || typeof O.onNotification !== "function") {
            let $ = !O ? "Server instance is null/undefined" : "Server instance has no onNotification method";
            K.push({
                serverName: w,
                error: $
            });
            let H = Error(`${$} for ${w}`);
            _6(H), k(`Skipping handler registration for ${w}: ${$}`);
            continue
        }
        O.onNotification("textDocument/publishDiagnostics", async ($) => {
            k(`[PASSIVE DIAGNOSTICS] Handler invoked for ${w}! Params type: ${typeof $}`);
            try {
                if (!$ || typeof $ !== "object" || !("uri" in $) || !("diagnostics" in $)) {
                    let M = Error(`LSP server ${w} sent invalid diagnostic params (missing uri or diagnostics)`);
                    _6(M), k(`Invalid diagnostic params from ${w}: ${B6($)}`);
                    return
                }
                let H = $;
                k(`Received diagnostics from ${w}: ${H.diagnostics.length} diagnostic(s) for ${H.uri}`);
                let j = MyY(H),
                    J = j[0];
                if (!J || j.length === 0 || J.diagnostics.length === 0) {
                    k(`Skipping empty diagnostics from ${w} for ${H.uri}`);
                    return
                }
                try {
                    Ya4({
                        serverName: w,
                        files: j
                    }), k(`LSP Diagnostics: Registered ${j.length} diagnostic file(s) from ${w} for async delivery`), z.delete(w)
                } catch (M) {
                    let D = M instanceof Error ? M : Error(`Failed to register LSP diagnostics: ${String(M)}`);
                    _6(D), k(`Error registering LSP diagnostics from ${w}: URI: ${H.uri}, Diagnostic count: ${J.diagnostics.length}, Error: ${D.message}`);
                    let X = z.get(w) || {
                        count: 0,
                        lastError: ""
                    };
                    if (X.count++, X.lastError = D.message, z.set(w, X), X.count >= 3) k(`WARNING: LSP diagnostic handler for ${w} has failed ${X.count} times consecutively. Last error: ${X.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
                }
            } catch (H) {
                let j = H instanceof Error ? H : Error(`Unexpected error in diagnostic handler: ${String(H)}`);
                _6(j), k(`Unexpected error processing diagnostics from ${w}: ${j.message}`);
                let J = z.get(w) || {
                    count: 0,
                    lastError: ""
                };
                if (J.count++, J.lastError = j.message, z.set(w, J), J.count >= 3) k(`WARNING: LSP diagnostic handler for ${w} has failed ${J.count} times consecutively. Last error: ${J.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
            }
        }), k(`Registered diagnostics handler for ${w}`), Y++
    } catch ($) {
        let H = $ instanceof Error ? $ : Error(`Handler registration failed: ${String($)}`);
        K.push({
            serverName: w,
            error: H.message
        }), _6(H), k(`Failed to register diagnostics handler for ${w}: Error: ${H.message}`)
    }
    let _ = q.size;
    if (K.length > 0) {
        let w = K.map((O) => `${O.serverName} (${O.error})`).join(", ");
        _6(Error(`Failed to register diagnostics for ${K.length} LSP server(s): ${w}`)), k(`LSP notification handler registration: ${Y}/${_} succeeded. Failed servers: ${w}. Diagnostics from failed servers will not be delivered.`)
    } else k(`LSP notification handlers registered successfully for all ${_} server(s)`);
    return {
        totalServers: _,
        successCount: Y,
        registrationErrors: K,
        diagnosticFailures: z
    }
}
// @from(Ln 343426, Col 4)
Ha4 = E(() => {
    g1();
    AT6();
    H1();
    k1()
})
// @from(Ln 343433, Col 0)
function vl() {
    if (IZ === "failed") return;
    return MN
}
// @from(Ln 343438, Col 0)
function qT6() {
    if (IZ === "failed") return {
        status: "failed",
        error: kl6 || Error("Initialization failed")
    };
    if (IZ === "not-started") return {
        status: "not-started"
    };
    if (IZ === "pending") return {
        status: "pending"
    };
    return {
        status: "success"
    }
}
// @from(Ln 343454, Col 0)
function ja4() {
    if (IZ === "failed") return !1;
    let A = vl();
    if (!A) return !1;
    let q = A.getAllServers();
    if (q.size === 0) return !1;
    for (let K of q.values())
        if (K.state !== "error") return !0;
    return !1
}
// @from(Ln 343464, Col 0)
async function Ja4() {
    if (IZ === "success" || IZ === "failed") return;
    if (IZ === "pending" && UV1) await UV1
}
// @from(Ln 343469, Col 0)
function dm8() {
    if (k("[LSP MANAGER] initializeLspServerManager() called"), MN !== void 0 && IZ !== "failed") {
        k("[LSP MANAGER] Already initialized or initializing, skipping");
        return
    }
    if (IZ === "failed") MN = void 0, kl6 = void 0;
    MN = eo4(), IZ = "pending", k("[LSP MANAGER] Created manager instance, state=pending");
    let A = ++QV1;
    k(`[LSP MANAGER] Starting async initialization (generation ${A})`), UV1 = MN.initialize().then(() => {
        if (A === QV1) {
            if (IZ = "success", k("LSP server manager initialized successfully"), MN) $a4(MN)
        }
    }).catch((q) => {
        if (A === QV1) IZ = "failed", kl6 = q, MN = void 0, _6(q), k(`Failed to initialize LSP server manager: ${_1(q)}`)
    })
}
// @from(Ln 343486, Col 0)
function dV1() {
    if (IZ === "not-started") return;
    if (k("[LSP MANAGER] reinitializeLspServerManager() called"), MN) MN.shutdown().catch((A) => {
        k(`[LSP MANAGER] old instance shutdown during reinit failed: ${_1(A)}`)
    });
    MN = void 0, IZ = "not-started", kl6 = void 0, dm8()
}
// @from(Ln 343493, Col 0)
async function Ma4() {
    if (MN === void 0) return;
    try {
        await MN.shutdown(), k("LSP server manager shut down successfully")
    } catch (A) {
        _6(A), k(`Failed to shutdown LSP server manager: ${_1(A)}`)
    } finally {
        MN = void 0, IZ = "not-started", kl6 = void 0, UV1 = void 0, QV1++
    }
}
// @from(Ln 343503, Col 4)
MN
// @from(Ln 343503, Col 8)
IZ = "not-started"
// @from(Ln 343504, Col 4)
kl6
// @from(Ln 343504, Col 9)
QV1 = 0
// @from(Ln 343505, Col 4)
UV1
// @from(Ln 343506, Col 4)
Ib = E(() => {
    Aa4();
    Ha4();
    H1();
    k1();
    s8()
})
// @from(Ln 343513, Col 4)
Xa4 = {}
// @from(Ln 343519, Col 0)
function PyY() {
    if (cm8 === null) cm8 = XyY.map((A) => ({
        id: A.id,
        re: new RegExp(A.source, A.flags)
    }));
    return cm8
}
// @from(Ln 343527, Col 0)
function Da4(A) {
    let q = {
        aws: "AWS",
        gcp: "GCP",
        api: "API",
        pat: "PAT",
        ad: "AD",
        tf: "TF",
        oauth: "OAuth",
        npm: "NPM",
        pypi: "PyPI",
        jwt: "JWT",
        github: "GitHub",
        gitlab: "GitLab",
        openai: "OpenAI",
        digitalocean: "DigitalOcean",
        huggingface: "HuggingFace",
        hashicorp: "HashiCorp",
        sendgrid: "SendGrid"
    };
    return A.split("-").map((K) => q[K] ?? K.charAt(0).toUpperCase() + K.slice(1)).join(" ")
}
// @from(Ln 343550, Col 0)
function lm8(A) {
    let q = [],
        K = new Set;
    for (let Y of PyY()) {
        if (K.has(Y.id)) continue;
        if (Y.re.test(A)) K.add(Y.id), q.push({
            ruleId: Y.id,
            label: Da4(Y.id)
        })
    }
    return q
}
// @from(Ln 343563, Col 0)
function WyY(A) {
    return Da4(A)
}
// @from(Ln 343566, Col 4)
DyY
// @from(Ln 343566, Col 9)
XyY
// @from(Ln 343566, Col 14)
cm8 = null
// @from(Ln 343567, Col 4)
im8 = E(() => {
    DyY = ["sk", "ant", "api"].join("-"), XyY = [{
        id: "aws-access-token",
        source: "\\b((?:A3T[A-Z0-9]|AKIA|ASIA|ABIA|ACCA)[A-Z2-7]{16})\\b"
    }, {
        id: "gcp-api-key",
        source: `\\b(AIza[\\w-]{35})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "azure-ad-client-secret",
        source: `(?:^|[\\\\'"\\x60\\s>=:(,)])([a-zA-Z0-9_~.]{3}\\dQ~[a-zA-Z0-9_~.-]{31,34})(?:$|[\\\\'"\\x60\\s<),])`
    }, {
        id: "digitalocean-pat",
        source: `\\b(dop_v1_[a-f0-9]{64})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "digitalocean-access-token",
        source: `\\b(doo_v1_[a-f0-9]{64})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "anthropic-api-key",
        source: `\\b(${DyY}03-[a-zA-Z0-9_\\-]{93}AA)(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "anthropic-admin-api-key",
        source: `\\b(sk-ant-admin01-[a-zA-Z0-9_\\-]{93}AA)(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "openai-api-key",
        source: `\\b(sk-(?:proj|svcacct|admin)-(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})T3BlbkFJ(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})\\b|sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "huggingface-access-token",
        source: `\\b(hf_[a-zA-Z]{34})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "github-pat",
        source: "ghp_[0-9a-zA-Z]{36}"
    }, {
        id: "github-fine-grained-pat",
        source: "github_pat_\\w{82}"
    }, {
        id: "github-app-token",
        source: "(?:ghu|ghs)_[0-9a-zA-Z]{36}"
    }, {
        id: "github-oauth",
        source: "gho_[0-9a-zA-Z]{36}"
    }, {
        id: "github-refresh-token",
        source: "ghr_[0-9a-zA-Z]{36}"
    }, {
        id: "gitlab-pat",
        source: "glpat-[\\w-]{20}"
    }, {
        id: "gitlab-deploy-token",
        source: "gldt-[0-9a-zA-Z_\\-]{20}"
    }, {
        id: "slack-bot-token",
        source: "xoxb-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*"
    }, {
        id: "slack-user-token",
        source: "xox[pe](?:-[0-9]{10,13}){3}-[a-zA-Z0-9-]{28,34}"
    }, {
        id: "slack-app-token",
        source: "xapp-\\d-[A-Z0-9]+-\\d+-[a-z0-9]+",
        flags: "i"
    }, {
        id: "twilio-api-key",
        source: "SK[0-9a-fA-F]{32}"
    }, {
        id: "sendgrid-api-token",
        source: `\\b(SG\\.[a-zA-Z0-9=_\\-.]{66})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "npm-access-token",
        source: `\\b(npm_[a-zA-Z0-9]{36})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "pypi-upload-token",
        source: "pypi-AgEIcHlwaS5vcmc[\\w-]{50,1000}"
    }, {
        id: "databricks-api-token",
        source: `\\b(dapi[a-f0-9]{32}(?:-\\d)?)(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "hashicorp-tf-api-token",
        source: "[a-zA-Z0-9]{14}\\.atlasv1\\.[a-zA-Z0-9\\-_=]{60,70}"
    }, {
        id: "pulumi-api-token",
        source: `\\b(pul-[a-f0-9]{40})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "postman-api-token",
        source: `\\b(PMAK-[a-fA-F0-9]{24}-[a-fA-F0-9]{34})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "grafana-api-key",
        source: `\\b(eyJrIjoi[A-Za-z0-9+/]{70,400}={0,3})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "grafana-cloud-api-token",
        source: `\\b(glc_[A-Za-z0-9+/]{32,400}={0,3})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "grafana-service-account-token",
        source: `\\b(glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "sentry-user-token",
        source: `\\b(sntryu_[a-f0-9]{64})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "sentry-org-token",
        source: "\\bsntrys_eyJpYXQiO[a-zA-Z0-9+/]{10,200}(?:LCJyZWdpb25fdXJs|InJlZ2lvbl91cmwi|cmVnaW9uX3VybCI6)[a-zA-Z0-9+/]{10,200}={0,2}_[a-zA-Z0-9+/]{43}"
    }, {
        id: "stripe-access-token",
        source: `\\b((?:sk|rk)_(?:test|live|prod)_[a-zA-Z0-9]{10,99})(?:[\\x60'"\\s;]|\\\\[nr]|$)`
    }, {
        id: "shopify-access-token",
        source: "shpat_[a-fA-F0-9]{32}"
    }, {
        id: "shopify-shared-secret",
        source: "shpss_[a-fA-F0-9]{32}"
    }, {
        id: "private-key",
        source: "-----BEGIN[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----[\\s\\S-]{64,}?-----END[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----",
        flags: "i"
    }]
})
// @from(Ln 343681, Col 0)
function cV1(A, q) {
    {
        let {
            isTeamMemPath: K
        } = (Rk(), k4(Ld)), {
            scanForSecrets: Y
        } = (im8(), k4(Xa4));
        if (!K(A)) return null;
        let z = Y(q);
        if (z.length === 0) return null;
        return `Content contains potential secrets (${z.map((w)=>w.label).join(", ")}) and cannot be written to team memory. Team memory is shared with all repository collaborators. Remove the sensitive content and try again.`
    }
    return null
}
// @from(Ln 343695, Col 4)
lV1
// @from(Ln 343695, Col 9)
nm8
// @from(Ln 343695, Col 14)
Pa4
// @from(Ln 343695, Col 19)
Wa4
// @from(Ln 343696, Col 4)
El6 = E(() => {
    K7();
    dq6();
    lV1 = F6(() => C.strictObject({
        file_path: C.string().describe("The absolute path to the file to modify"),
        old_string: C.string().describe("The text to replace"),
        new_string: C.string().describe("The text to replace it with (must be different from old_string)"),
        replace_all: YX(C.boolean().default(!1).optional()).describe("Replace all occurrences of old_string (default false)")
    })), nm8 = F6(() => C.object({
        oldStart: C.number(),
        oldLines: C.number(),
        newStart: C.number(),
        newLines: C.number(),
        lines: C.array(C.string())
    })), Pa4 = F6(() => C.object({
        filePath: C.string().describe("The file path that was edited"),
        oldString: C.string().describe("The original string that was replaced"),
        newString: C.string().describe("The new string that replaced it"),
        originalFile: C.string().describe("The original file contents before editing"),
        structuredPatch: C.array(nm8()).describe("Diff patch showing the changes"),
        userModified: C.boolean().describe("Whether the user modified the proposed changes"),
        replaceAll: C.boolean().describe("Whether all occurrences were replaced"),
        gitDiff: C.object({
            filename: C.string(),
            status: C.enum(["modified", "added"]),
            additions: C.number(),
            deletions: C.number(),
            changes: C.number(),
            patch: C.string(),
            repository: C.string().nullable().optional().describe("GitHub owner/repo when available")
        }).optional()
    })), Wa4 = F6(() => C.object({
        file_path: C.string().describe("The absolute path to the file to modify"),
        edits: C.array(C.union([C.object({
            set: C.object({
                ref: C.string().describe('Line reference "LINE#HASH"'),
                body: C.array(C.string()).describe("Replacement lines (empty array to delete the line)")
            })
        }), C.object({
            set_range: C.object({
                beg: C.string().describe('Start line reference "LINE#HASH"'),
                end: C.string().describe('End line reference "LINE#HASH"'),
                body: C.array(C.string()).describe("Replacement lines (empty array to delete the range)")
            })
        }), C.object({
            insert: C.object({
                before: C.string().optional().describe('Insert before this line "LINE#HASH"'),
                after: C.string().optional().describe('Insert after this line "LINE#HASH"'),
                body: C.array(C.string()).describe("Lines to insert (must be non-empty)")
            })
        }), C.object({
            replace: C.object({
                old_text: C.string().describe("Text to find"),
                new_text: C.string().describe("Replacement text"),
                all: YX(C.boolean().optional()).describe("Replace all occurrences")
            })
        })])).describe("Array of edit operations")
    }))
})
// @from(Ln 343756, Col 0)
function jh(A, q) {
    return A.flatMap((K, Y) => Y ? [q(Y), K] : [K])
}
// @from(Ln 343760, Col 0)
function Za4(A) {
    let q = A6(10),
        {
            patch: K,
            dim: Y,
            width: z
        } = A,
        [_] = z7(),
        w;
    if (q[0] !== Y || q[1] !== K.lines || q[2] !== K.oldStart || q[3] !== _ || q[4] !== z) w = VyY(K.lines, K.oldStart, z, Y, _), q[0] = Y, q[1] = K.lines, q[2] = K.oldStart, q[3] = _, q[4] = z, q[5] = w;
    else w = q[5];
    let O = w,
        $;
    if (q[6] !== O) $ = O.map(GyY), q[6] = O, q[7] = $;
    else $ = q[7];
    let H;
    if (q[8] !== $) H = YH.createElement(m, {
        flexDirection: "column",
        flexGrow: 1
    }, $), q[8] = $, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 343784, Col 0)
function GyY(A, q) {
    return YH.createElement(m, {
        key: q
    }, A)
}
// @from(Ln 343790, Col 0)
function fyY(A) {
    return A.map((q) => {
        if (q.startsWith("+")) return {
            code: q.slice(1),
            i: 0,
            type: "add",
            originalCode: q.slice(1)
        };
        if (q.startsWith("-")) return {
            code: q.slice(1),
            i: 0,
            type: "remove",
            originalCode: q.slice(1)
        };
        return {
            code: q.slice(1),
            i: 0,
            type: "nochange",
            originalCode: q.slice(1)
        }
    })
}
// @from(Ln 343813, Col 0)
function TyY(A) {
    let q = [],
        K = 0;
    while (K < A.length) {
        let Y = A[K];
        if (!Y) {
            K++;
            continue
        }
        if (Y.type === "remove") {
            let z = [Y],
                _ = K + 1;
            while (_ < A.length && A[_]?.type === "remove") {
                let O = A[_];
                if (O) z.push(O);
                _++
            }
            let w = [];
            while (_ < A.length && A[_]?.type === "add") {
                let O = A[_];
                if (O) w.push(O);
                _++
            }
            if (z.length > 0 && w.length > 0) {
                let O = Math.min(z.length, w.length);
                for (let $ = 0; $ < O; $++) {
                    let H = z[$],
                        j = w[$];
                    if (H && j) H.wordDiff = !0, j.wordDiff = !0, H.matchedLine = j, j.matchedLine = H
                }
                q.push(...z.filter(Boolean)), q.push(...w.filter(Boolean)), K = _
            } else q.push(Y), K++
        } else q.push(Y), K++
    }
    return q
}
// @from(Ln 343850, Col 0)
function vyY(A, q) {
    return jO8(A, q, {
        ignoreCase: !1
    })
}
// @from(Ln 343856, Col 0)
function NyY(A, q, K, Y, z) {
    let {
        type: _,
        i: w,
        wordDiff: O,
        matchedLine: $,
        originalCode: H
    } = A;
    if (!O || !$) return null;
    let j = _ === "remove" ? H : $.originalCode,
        J = _ === "remove" ? $.originalCode : H,
        M = vyY(j, J),
        D = j.length + J.length;
    if (M.filter((V) => V.added || V.removed).reduce((V, L) => V + L.value.length, 0) / D > ZyY || Y) return null;
    let W = _ === "add" ? "+" : "-",
        Z = W.length,
        G = Math.max(1, q - K - 1 - Z),
        f = [],
        v = [],
        N = 0;
    if (M.forEach((V, L) => {
            let h = !1,
                R;
            if (_ === "add") {
                if (V.added) h = !0, R = "diffAddedWord";
                else if (!V.removed) h = !0
            } else if (_ === "remove") {
                if (V.removed) h = !0, R = "diffRemovedWord";
                else if (!V.added) h = !0
            }
            if (!h) return;
            jk(V.value, G, "wrap").split(`
`).forEach((g, B) => {
                if (!g) return;
                if (B > 0 || N + f8(g) > G) {
                    if (v.length > 0) f.push({
                        content: [...v],
                        contentWidth: N
                    }), v = [], N = 0
                }
                v.push(YH.createElement(T, {
                    key: `part-${L}-${B}`,
                    backgroundColor: R
                }, g)), N += f8(g)
            })
        }), v.length > 0) f.push({
        content: v,
        contentWidth: N
    });
    return f.map(({
        content: V,
        contentWidth: L
    }, h) => {
        let R = `${_}-${w}-${h}`,
            u = _ === "add" ? Y ? "diffAddedDimmed" : "diffAdded" : Y ? "diffRemovedDimmed" : "diffRemoved",
            I = h === 0 ? w : void 0,
            g = (I !== void 0 ? I.toString().padStart(K) : " ".repeat(K)) + " ",
            B = g.length + Z + L,
            b = Math.max(0, q - B);
        return YH.createElement(m, {
            key: R,
            flexDirection: "row"
        }, YH.createElement(BU, {
            fromLeftEdge: !0
        }, YH.createElement(T, {
            color: z ? "text" : void 0,
            backgroundColor: u,
            dimColor: Y
        }, g, W)), YH.createElement(T, {
            color: z ? "text" : void 0,
            backgroundColor: u,
            dimColor: Y
        }, V, " ".repeat(b)))
    })
}
// @from(Ln 343932, Col 0)
function VyY(A, q, K, Y, z) {
    let _ = Math.max(1, Math.floor(K)),
        w = fyY(A),
        O = TyY(w),
        $ = kyY(O, q),
        H = Math.max(...$.map(({
            i: J
        }) => J), 0),
        j = Math.max(H.toString().length + 1, 0);
    return $.flatMap((J) => {
        let {
            type: M,
            code: D,
            i: X,
            wordDiff: P,
            matchedLine: W
        } = J;
        if (P && W) {
            let N = NyY(J, _, j, Y, z);
            if (N !== null) return N
        }
        let Z = 2,
            G = Math.max(1, _ - j - 1 - Z);
        return jk(D, G, "wrap").split(`
`).map((N, V) => {
            let L = `${M}-${X}-${V}`,
                h = V === 0 ? X : void 0,
                R = (h !== void 0 ? h.toString().padStart(j) : " ".repeat(j)) + " ",
                u = M === "add" ? "+" : M === "remove" ? "-" : " ",
                I = R.length + 1 + f8(N),
                g = Math.max(0, _ - I),
                B = M === "add" ? Y ? "diffAddedDimmed" : "diffAdded" : M === "remove" ? Y ? "diffRemovedDimmed" : "diffRemoved" : void 0;
            return YH.createElement(m, {
                key: L,
                flexDirection: "row"
            }, YH.createElement(BU, {
                fromLeftEdge: !0
            }, YH.createElement(T, {
                color: z ? "text" : void 0,
                backgroundColor: B,
                dimColor: Y || M === "nochange"
            }, R, u)), YH.createElement(T, {
                color: z ? "text" : void 0,
                backgroundColor: B,
                dimColor: Y
            }, N, " ".repeat(g)))
        })
    })
}
// @from(Ln 343982, Col 0)
function kyY(A, q) {
    let K = q,
        Y = [],
        z = [...A];
    while (z.length > 0) {
        let _ = z.shift(),
            {
                code: w,
                type: O,
                originalCode: $,
                wordDiff: H,
                matchedLine: j
            } = _,
            J = {
                code: w,
                type: O,
                i: K,
                originalCode: $,
                wordDiff: H,
                matchedLine: j
            };
        switch (O) {
            case "nochange":
                K++, Y.push(J);
                break;
            case "add":
                K++, Y.push(J);
                break;
            case "remove": {
                Y.push(J);
                let M = 0;
                while (z[0]?.type === "remove") {
                    K++;
                    let D = z.shift(),
                        {
                            code: X,
                            type: P,
                            originalCode: W,
                            wordDiff: Z,
                            matchedLine: G
                        } = D,
                        f = {
                            code: X,
                            type: P,
                            i: K,
                            originalCode: W,
                            wordDiff: Z,
                            matchedLine: G
                        };
                    Y.push(f), M++
                }
                K -= M;
                break
            }
        }
    }
    return Y
}
// @from(Ln 344040, Col 4)
YH
// @from(Ln 344040, Col 8)
ZyY = 0.4
// @from(Ln 344041, Col 4)
Ga4 = E(() => {
    e6();
    i6();
    ED6();
    q3();
    YH = t(P6(), 1)
})
// @from(Ln 344049, Col 0)
function Ta4() {
    if (fa4) return iV1;
    fa4 = !0;
    try {
        iV1 = (() => {
            throw new Error("Cannot require module " + "../../color-diff.node");
        })()
    } catch {
        iV1 = null
    }
    return iV1
}
// @from(Ln 344061, Col 4)
iV1 = null
// @from(Ln 344062, Col 4)
fa4 = !1
// @from(Ln 344064, Col 0)
function rm8() {
    if (xz(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) return "env";
    if (!rY()) return "build";
    return null
}
// @from(Ln 344070, Col 0)
function nV1() {
    if (va4) return;
    if (va4 = !0, rm8() !== null) return;
    let A = Ta4();
    if (A) Na4 = A.ColorDiff, Va4 = A.ColorFile, ka4 = A.getSyntaxTheme
}
// @from(Ln 344076, Col 0)
async function Jz6() {
    nV1()
}
// @from(Ln 344080, Col 0)
function Ea4() {
    return nV1(), Na4
}
// @from(Ln 344084, Col 0)
function ya4() {
    return nV1(), Va4
}
// @from(Ln 344088, Col 0)
function La4(A) {
    return nV1(), ka4?.(A) ?? null
}
// @from(Ln 344092, Col 0)
function om8(A) {
    return A.some((q) => q.type === "assistant" && q.message.content.some((K) => K.type === "tool_use" && EyY.has(K.name ?? "")))
}
// @from(Ln 344095, Col 4)
Na4 = null
// @from(Ln 344096, Col 4)
Va4 = null
// @from(Ln 344097, Col 4)
ka4 = null
// @from(Ln 344098, Col 4)
va4 = !1
// @from(Ln 344099, Col 4)
EyY
// @from(Ln 344100, Col 4)
Mz6 = E(() => {
    A8();
    Q$();
    EyY = new Set([R4, _K, bJ])
})
// @from(Ln 344106, Col 0)
function yyY(A, q, K, Y, z, _, w) {
    let O = Ea4();
    if (!O) return null;
    let $ = `${z}|${_}|${w?1:0}|${q??""}|${K}`,
        H = Ra4.get(A),
        j = H?.get($);
    if (j) return j;
    let J = new O(A, q, K, Y).render(z, _, w);
    if (J === null) return null;
    if (!H) H = new Map, Ra4.set(A, H);
    return H.set($, J), J
}
// @from(Ln 344119, Col 0)
function LyY(A) {
    let q = A6(13),
        {
            line: K,
            gutterWidth: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = Xk(K, 0, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let _ = z,
        w;
    if (q[3] !== Y || q[4] !== K) w = Xk(K, Y), q[3] = Y, q[4] = K, q[5] = w;
    else w = q[5];
    let O = w,
        $;
    if (q[6] !== _) $ = zH.createElement(BU, {
        fromLeftEdge: !0
    }, zH.createElement(T, null, zH.createElement(wK, null, _))), q[6] = _, q[7] = $;
    else $ = q[7];
    let H;
    if (q[8] !== O) H = zH.createElement(T, null, zH.createElement(wK, null, O)), q[8] = O, q[9] = H;
    else H = q[9];
    let j;
    if (q[10] !== $ || q[11] !== H) j = zH.createElement(m, {
        flexDirection: "row"
    }, $, H), q[10] = $, q[11] = H, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 344148, Col 4)
zH
// @from(Ln 344148, Col 8)
ha4
// @from(Ln 344148, Col 13)
Ra4
// @from(Ln 344148, Col 18)
DN
// @from(Ln 344149, Col 4)
p66 = E(() => {
    e6();
    i6();
    XX6();
    Ga4();
    Mz6();
    nI();
    Tb();
    zH = t(P6(), 1), ha4 = t(P6(), 1), Ra4 = new WeakMap;
    DN = ha4.memo(function(q) {
        let K = A6(13),
            {
                patch: Y,
                dim: z,
                filePath: _,
                firstLine: w,
                fileContent: O,
                width: $,
                skipHighlighting: H
            } = q,
            j = H === void 0 ? !1 : H,
            [J] = z7(),
            D = Kj().syntaxHighlightingDisabled ?? !1,
            X = Math.max(1, Math.floor($)),
            P;
        if (K[0] !== z || K[1] !== O || K[2] !== _ || K[3] !== w || K[4] !== Y || K[5] !== X || K[6] !== j || K[7] !== D || K[8] !== J || K[9] !== $) {
            let W = j || D ? null : yyY(Y, w, _, O ?? null, J, X, z),
                Z;
            A: {
                Z = 0;
                break A
            }
            let G = Z;
            P = zH.createElement(m, null, W ? G > 0 ? zH.createElement(m, {
                flexDirection: "column"
            }, W.map((f, v) => zH.createElement(LyY, {
                key: v,
                line: f,
                gutterWidth: G
            }))) : zH.createElement($$1, {
                lines: W,
                width: X
            }) : zH.createElement(Za4, {
                patch: Y,
                dim: z,
                width: $
            })), K[0] = z, K[1] = O, K[2] = _, K[3] = w, K[4] = Y, K[5] = X, K[6] = j, K[7] = D, K[8] = J, K[9] = $, K[10] = P
        } else P = K[10];
        return P
    })
})
// @from(Ln 344201, Col 0)
function rV1(A) {
    let q = A6(27),
        {
            filePath: K,
            structuredPatch: Y,
            firstLine: z,
            fileContent: _,
            style: w,
            verbose: O,
            previewHint: $
        } = A,
        {
            columns: H
        } = KA(),
        j = Y.reduce(CyY, 0),
        J = Y.reduce(hyY, 0),
        M;
    if (q[0] !== j) M = j > 0 ? gY.createElement(gY.Fragment, null, "Added ", gY.createElement(T, {
        bold: !0
    }, j), " ", j > 1 ? "lines" : "line") : null, q[0] = j, q[1] = M;
    else M = q[1];
    let D = j > 0 && J > 0 ? ", " : null,
        X;
    if (q[2] !== j || q[3] !== J) X = J > 0 ? gY.createElement(gY.Fragment, null, j === 0 ? "R" : "r", "emoved ", gY.createElement(T, {
        bold: !0
    }, J), " ", J > 1 ? "lines" : "line") : null, q[2] = j, q[3] = J, q[4] = X;
    else X = q[4];
    let P;
    if (q[5] !== M || q[6] !== D || q[7] !== X) P = gY.createElement(T, null, M, D, X), q[5] = M, q[6] = D, q[7] = X, q[8] = P;
    else P = q[8];
    let W = P;
    if ($) {
        if (w !== "condensed" && !O) {
            let v;
            if (q[9] !== $) v = gY.createElement(t1, null, gY.createElement(T, {
                dimColor: !0
            }, $)), q[9] = $, q[10] = v;
            else v = q[10];
            return v
        }
    } else if (w === "condensed" && !O) return W;
    let Z;
    if (q[11] !== W) Z = gY.createElement(T, null, W), q[11] = W, q[12] = Z;
    else Z = q[12];
    let G;
    if (q[13] !== H || q[14] !== _ || q[15] !== K || q[16] !== z || q[17] !== Y) {
        let v;
        if (q[19] !== H || q[20] !== _ || q[21] !== K || q[22] !== z) v = (N) => gY.createElement(m, {
            flexDirection: "column",
            key: N.newStart
        }, gY.createElement(DN, {
            patch: N,
            dim: !1,
            width: H - 12,
            filePath: K,
            firstLine: z,
            fileContent: _
        })), q[19] = H, q[20] = _, q[21] = K, q[22] = z, q[23] = v;
        else v = q[23];
        G = jh(Y.map(v), RyY), q[13] = H, q[14] = _, q[15] = K, q[16] = z, q[17] = Y, q[18] = G
    } else G = q[18];
    let f;
    if (q[24] !== Z || q[25] !== G) f = gY.createElement(t1, null, gY.createElement(m, {
        flexDirection: "column"
    }, Z, G)), q[24] = Z, q[25] = G, q[26] = f;
    else f = q[26];
    return f
}
// @from(Ln 344270, Col 0)
function RyY(A) {
    return gY.createElement(m, {
        key: `ellipsis-${A}`
    }, gY.createElement(T, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 344278, Col 0)
function hyY(A, q) {
    return A + q.lines.filter(SyY).length
}
// @from(Ln 344282, Col 0)
function SyY(A) {
    return A.startsWith("-")
}
// @from(Ln 344286, Col 0)
function CyY(A, q) {
    return A + q.lines.filter(IyY).length
}
// @from(Ln 344290, Col 0)
function IyY(A) {
    return A.startsWith("+")
}
// @from(Ln 344293, Col 4)
gY
// @from(Ln 344294, Col 4)
am8 = E(() => {
    e6();
    i6();
    p66();
    _q();
    iq();
    gY = t(P6(), 1)
})
// @from(Ln 344306, Col 0)
function Ca4(A) {
    let q = A6(11),
        {
            code: K,
            filePath: Y,
            dim: z,
            skipColoring: _
        } = A,
        w = z === void 0 ? !1 : z,
        O = _ === void 0 ? !1 : _,
        $;
    if (q[0] !== Y) $ = byY(Y).slice(1), q[0] = Y, q[1] = $;
    else $ = q[1];
    let H = $,
        j;
    if (q[2] !== K || q[3] !== H || q[4] !== O) {
        A: {
            let P = vU(K);
            if (O || !oV1) {
                j = P;
                break A
            }
            let W = "markdown";
            if (H)
                if (Sa4?.(H)) W = H;
                else k(`Language not supported while highlighting code, falling back to markdown: ${H}`);
            try {
                j = oV1(P, {
                    language: W
                });
                break A
            } catch (Z) {
                let G = Z;
                if (G instanceof Error && G.message.includes("Unknown language")) {
                    k(`Language not supported while highlighting code, falling back to markdown: ${G}`), j = oV1(P, {
                        language: "markdown"
                    });
                    break A
                }
            }
            j = void 0
        }
        q[2] = K,
        q[3] = H,
        q[4] = O,
        q[5] = j
    }
    else j = q[5];
    let M = j ?? "",
        D;
    if (q[6] !== M) D = sm8.default.createElement(wK, null, M), q[6] = M, q[7] = D;
    else D = q[7];
    let X;
    if (q[8] !== w || q[9] !== D) X = sm8.default.createElement(T, {
        dimColor: w
    }, D), q[8] = w, q[9] = D, q[10] = X;
    else X = q[10];
    return X
}
// @from(Ln 344365, Col 4)
sm8
// @from(Ln 344365, Col 9)
oV1
// @from(Ln 344365, Col 14)
Sa4
// @from(Ln 344366, Col 4)
Ia4 = E(() => {
    e6();
    i6();
    H1();
    Z7();
    sm8 = t(P6(), 1);
    Promise.resolve().then(() => t(ky8(), 1)).then((A) => {
        oV1 = A.highlight, Sa4 = A.supportsLanguage
    })
})
// @from(Ln 344377, Col 0)
function uyY(A) {
    let q = A6(13),
        {
            line: K,
            gutterWidth: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = Xk(K, 0, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let _ = z,
        w;
    if (q[3] !== Y || q[4] !== K) w = Xk(K, Y), q[3] = Y, q[4] = K, q[5] = w;
    else w = q[5];
    let O = w,
        $;
    if (q[6] !== _) $ = SO.createElement(BU, {
        fromLeftEdge: !0
    }, SO.createElement(T, null, SO.createElement(wK, null, _))), q[6] = _, q[7] = $;
    else $ = q[7];
    let H;
    if (q[8] !== O) H = SO.createElement(T, null, SO.createElement(wK, null, O)), q[8] = O, q[9] = H;
    else H = q[9];
    let j;
    if (q[10] !== $ || q[11] !== H) j = SO.createElement(m, {
        flexDirection: "row"
    }, $, H), q[10] = $, q[11] = H, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 344406, Col 4)
SO
// @from(Ln 344406, Col 8)
Q66
// @from(Ln 344406, Col 13)
xyY = 80
// @from(Ln 344407, Col 4)
bf
// @from(Ln 344408, Col 4)
U66 = E(() => {
    e6();
    i6();
    XX6();
    Ia4();
    Mz6();
    nI();
    Tb();
    SO = t(P6(), 1), Q66 = t(P6(), 1), bf = Q66.memo(function(q) {
        let K = A6(23),
            {
                code: Y,
                filePath: z,
                width: _,
                dim: w
            } = q,
            O = w === void 0 ? !1 : w,
            $ = Q66.useRef(null),
            [H, j] = Q66.useState(_ || xyY),
            [J] = z7(),
            D = Kj().syntaxHighlightingDisabled ?? !1,
            X;
        A: {
            if (D) {
                X = null;
                break A
            }
            let L;
            if (K[0] === Symbol.for("react.memo_cache_sentinel")) L = ya4(),
            K[0] = L;
            else L = K[0];
            let h = L;
            if (!h) {
                X = null;
                break A
            }
            let R;
            if (K[1] !== Y || K[2] !== z) R = new h(Y, z),
            K[1] = Y,
            K[2] = z,
            K[3] = R;
            else R = K[3];X = R
        }
        let P = X,
            W, Z;
        if (K[4] !== _) W = () => {
            if (!_ && $.current) {
                let {
                    width: L
                } = bX6($.current);
                if (L > 0) j(L - 2)
            }
        }, Z = [_], K[4] = _, K[5] = W, K[6] = Z;
        else W = K[5], Z = K[6];
        Q66.useEffect(W, Z);
        let G;
        A: {
            if (P === null) {
                G = null;
                break A
            }
            let L;
            if (K[7] !== P || K[8] !== O || K[9] !== H || K[10] !== J) L = P.render(J, H, O),
            K[7] = P,
            K[8] = O,
            K[9] = H,
            K[10] = J,
            K[11] = L;
            else L = K[11];G = L
        }
        let f = G,
            v;
        A: {
            v = 0;
            break A
        }
        let N = v,
            V;
        if (K[16] !== Y || K[17] !== O || K[18] !== z || K[19] !== N || K[20] !== f || K[21] !== D) V = SO.createElement(m, {
            ref: $
        }, f ? SO.createElement(m, {
            flexDirection: "column"
        }, f.map((L, h) => N > 0 ? SO.createElement(uyY, {
            key: h,
            line: L,
            gutterWidth: N
        }) : SO.createElement(T, {
            key: h
        }, SO.createElement(wK, null, L)))) : SO.createElement(Ca4, {
            code: Y,
            filePath: z,
            dim: O,
            skipColoring: D
        })), K[16] = Y, K[17] = O, K[18] = z, K[19] = N, K[20] = f, K[21] = D, K[22] = V;
        else V = K[22];
        return V
    })
})
// @from(Ln 344510, Col 0)
function Dz6(A) {
    let q = A6(43),
        {
            file_path: K,
            operation: Y,
            patch: z,
            firstLine: _,
            fileContent: w,
            content: O,
            style: $,
            verbose: H
        } = A,
        {
            columns: j
        } = KA(),
        J;
    if (q[0] !== Y) J = rz.createElement(T, {
        color: "subtle"
    }, "User rejected ", Y, " to "), q[0] = Y, q[1] = J;
    else J = q[1];
    let M;
    if (q[2] !== K || q[3] !== H) M = H ? K : myY(G1(), K), q[2] = K, q[3] = H, q[4] = M;
    else M = q[4];
    let D;
    if (q[5] !== M) D = rz.createElement(T, {
        bold: !0,
        color: "subtle"
    }, M), q[5] = M, q[6] = D;
    else D = q[6];
    let X;
    if (q[7] !== J || q[8] !== D) X = rz.createElement(m, {
        flexDirection: "row"
    }, J, D), q[7] = J, q[8] = D, q[9] = X;
    else X = q[9];
    let P = X;
    if ($ === "condensed" && !H) {
        let G;
        if (q[10] !== P) G = rz.createElement(t1, null, P), q[10] = P, q[11] = G;
        else G = q[11];
        return G
    }
    if (Y === "write" && O !== void 0) {
        let G, f;
        if (q[12] !== O || q[13] !== H) {
            let u = O.split(`
`);
            G = u.length - ba4, f = H ? O : u.slice(0, ba4).join(`
`), q[12] = O, q[13] = H, q[14] = G, q[15] = f
        } else G = q[14], f = q[15];
        let N = f || "(No content)",
            V = j - 12,
            L;
        if (q[16] !== K || q[17] !== N || q[18] !== V) L = rz.createElement(bf, {
            code: N,
            filePath: K,
            width: V,
            dim: !0
        }), q[16] = K, q[17] = N, q[18] = V, q[19] = L;
        else L = q[19];
        let h;
        if (q[20] !== G || q[21] !== H) h = !H && G > 0 && rz.createElement(T, {
            dimColor: !0
        }, "… +", G, " lines"), q[20] = G, q[21] = H, q[22] = h;
        else h = q[22];
        let R;
        if (q[23] !== L || q[24] !== h || q[25] !== P) R = rz.createElement(t1, null, rz.createElement(m, {
            flexDirection: "column"
        }, P, L, h)), q[23] = L, q[24] = h, q[25] = P, q[26] = R;
        else R = q[26];
        return R
    }
    if (!z || z.length === 0) {
        let G;
        if (q[27] !== P) G = rz.createElement(t1, null, P), q[27] = P, q[28] = G;
        else G = q[28];
        return G
    }
    let W;
    if (q[29] !== j || q[30] !== w || q[31] !== K || q[32] !== _ || q[33] !== z) {
        let G;
        if (q[35] !== j || q[36] !== w || q[37] !== K || q[38] !== _) G = (f) => rz.createElement(m, {
            flexDirection: "column",
            key: f.newStart
        }, rz.createElement(DN, {
            patch: f,
            dim: !0,
            width: j - 12,
            filePath: K,
            firstLine: _,
            fileContent: w
        })), q[35] = j, q[36] = w, q[37] = K, q[38] = _, q[39] = G;
        else G = q[39];
        W = jh(z.map(G), ByY), q[29] = j, q[30] = w, q[31] = K, q[32] = _, q[33] = z, q[34] = W
    } else W = q[34];
    let Z;
    if (q[40] !== W || q[41] !== P) Z = rz.createElement(t1, null, rz.createElement(m, {
        flexDirection: "column"
    }, P, W)), q[40] = W, q[41] = P, q[42] = Z;
    else Z = q[42];
    return Z
}
// @from(Ln 344612, Col 0)
function ByY(A) {
    return rz.createElement(m, {
        key: `ellipsis-${A}`
    }, rz.createElement(T, {
        dimColor: !0
    }, "..."))
}
// @from(Ln 344619, Col 4)
rz
// @from(Ln 344619, Col 8)
ba4 = 10
// @from(Ln 344620, Col 4)
tm8 = E(() => {
    e6();
    i6();
    lA();
    p66();
    U66();
    _q();
    iq();
    rz = t(P6(), 1)
})
// @from(Ln 344636, Col 0)
function Ba4(A) {
    let q = A.split(ua4);
    return A.endsWith(ua4) ? q.length - 1 : q.length
}
// @from(Ln 344641, Col 0)
function pyY(A) {
    let q = A6(25),
        {
            filePath: K,
            content: Y,
            verbose: z
        } = A,
        {
            columns: _
        } = KA(),
        w = Y || "(No content)",
        O = Ba4(Y),
        $ = O - xa4,
        H;
    if (q[0] !== O) H = gK.createElement(T, {
        bold: !0
    }, O), q[0] = O, q[1] = H;
    else H = q[1];
    let j;
    if (q[2] !== K || q[3] !== z) j = z ? K : ma4(G1(), K), q[2] = K, q[3] = z, q[4] = j;
    else j = q[4];
    let J;
    if (q[5] !== j) J = gK.createElement(T, {
        bold: !0
    }, j), q[5] = j, q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== H || q[8] !== J) M = gK.createElement(T, null, "Wrote ", H, " lines to", " ", J), q[7] = H, q[8] = J, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== w || q[11] !== z) D = z ? w : w.split(`
`).slice(0, xa4).join(`
`), q[10] = w, q[11] = z, q[12] = D;
    else D = q[12];
    let X = _ - 12,
        P;
    if (q[13] !== K || q[14] !== D || q[15] !== X) P = gK.createElement(m, {
        flexDirection: "column"
    }, gK.createElement(bf, {
        code: D,
        filePath: K,
        width: X
    })), q[13] = K, q[14] = D, q[15] = X, q[16] = P;
    else P = q[16];
    let W;
    if (q[17] !== O || q[18] !== $ || q[19] !== z) W = !z && $ > 0 && gK.createElement(T, {
        dimColor: !0
    }, "… +", $, " ", $ === 1 ? "line" : "lines", " ", O > 0 && gK.createElement(oJ, null)), q[17] = O, q[18] = $, q[19] = z, q[20] = W;
    else W = q[20];
    let Z;
    if (q[21] !== M || q[22] !== P || q[23] !== W) Z = gK.createElement(t1, null, gK.createElement(m, {
        flexDirection: "column"
    }, M, P, W)), q[21] = M, q[22] = P, q[23] = W, q[24] = Z;
    else Z = q[24];
    return Z
}
// @from(Ln 344698, Col 0)
function ga4(A) {
    if (A?.file_path?.startsWith(t2())) return "Updated plan";
    return "Write"
}
// @from(Ln 344703, Col 0)
function em8(A) {
    if (!A?.file_path) return null;
    return $K(A.file_path)
}
// @from(Ln 344708, Col 0)
function Fa4(A, {
    verbose: q
}) {
    if (!A.file_path) return null;
    if (A.file_path.startsWith(t2())) return "";
    return gK.createElement(Qk, {
        filePath: A.file_path
    }, q ? A.file_path : $K(A.file_path))
}
// @from(Ln 344718, Col 0)
function pa4({
    file_path: A,
    content: q
}, {
    style: K,
    verbose: Y
}) {
    try {
        let z = $1(),
            _ = gyY(A) ? A : FyY(G1(), A);
        if (!z.existsSync(_)) return gK.createElement(Dz6, {
            file_path: A,
            operation: "write",
            content: q,
            firstLine: q.split(`
`)[0] ?? null,
            verbose: Y
        });
        let O = d66(_),
            $ = z.readFileSync(_, {
                encoding: O
            }),
            H = SL({
                filePath: A,
                fileContents: $,
                edits: [{
                    old_string: $,
                    new_string: q,
                    replace_all: !1
                }]
            }),
            j = q.split(`
`)[0] ?? null;
        return gK.createElement(Dz6, {
            file_path: A,
            operation: "update",
            patch: H,
            firstLine: j,
            fileContent: $,
            style: K,
            verbose: Y
        })
    } catch (z) {
        return _6(z), gK.createElement(t1, null, gK.createElement(T, null, "(No changes)"))
    }
}
// @from(Ln 344765, Col 0)
function Qa4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && d4(A, "tool_use_error")) return gK.createElement(t1, null, gK.createElement(T, {
        color: "error"
    }, "Error writing file"));
    return gK.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 344777, Col 0)
function Ua4() {
    return null
}
// @from(Ln 344781, Col 0)
function da4({
    filePath: A,
    content: q,
    structuredPatch: K,
    type: Y,
    originalFile: z
}, _, {
    style: w,
    verbose: O
}) {
    switch (Y) {
        case "create": {
            if (A.startsWith(t2()) && !O) {
                if (w !== "condensed") return gK.createElement(t1, null, gK.createElement(T, {
                    dimColor: !0
                }, "/plan to preview"))
            } else if (w === "condensed" && !O) {
                let H = Ba4(q);
                return gK.createElement(T, null, "Wrote ", gK.createElement(T, {
                    bold: !0
                }, H), " lines to", " ", gK.createElement(T, {
                    bold: !0
                }, ma4(G1(), A)))
            }
            return gK.createElement(pyY, {
                filePath: A,
                content: q,
                verbose: O
            })
        }
        case "update": {
            let $ = A.startsWith(t2());
            return gK.createElement(rV1, {
                filePath: A,
                structuredPatch: K,
                firstLine: q.split(`
`)[0] ?? null,
                fileContent: z ?? void 0,
                style: w,
                verbose: O,
                previewHint: $ ? "/plan to preview" : void 0
            })
        }
    }
}
// @from(Ln 344826, Col 4)
gK
// @from(Ln 344826, Col 8)
xa4 = 10
// @from(Ln 344827, Col 4)
ua4 = `
`
// @from(Ln 344829, Col 4)
ca4 = E(() => {
    e6();
    i6();
    am8();
    tm8();
    ZW6();
    U66();
    iq();
    kO();
    GR();
    Z7();
    lA();
    NU();
    SA();
    k1();
    JA();
    rH();
    _q();
    gK = t(P6(), 1)
})
// @from(Ln 344859, Col 0)
async function la4() {
    if (!await IH()) return null;
    if (await na4()) return null;
    let {
        stdout: q,
        code: K
    } = await z8(hA(), ["--no-optional-locks", "diff", "HEAD", "--shortstat"], {
        timeout: aV1,
        preserveOutputOnError: !1
    });
    if (K === 0) {
        let $ = eyY(q);
        if ($ && $.filesCount > oyY) return {
            stats: $,
            perFileStats: new Map,
            hunks: new Map
        }
    }
    let {
        stdout: Y,
        code: z
    } = await z8(hA(), ["--no-optional-locks", "diff", "HEAD", "--numstat"], {
        timeout: aV1,
        preserveOutputOnError: !1
    });
    if (z !== 0) return null;
    let {
        stats: _,
        perFileStats: w
    } = ayY(Y), O = qB8 - w.size;
    if (O > 0) {
        let $ = await tyY(O);
        if ($) {
            _.filesCount += $.size;
            for (let [H, j] of $) w.set(H, j)
        }
    }
    return {
        stats: _,
        perFileStats: w,
        hunks: new Map
    }
}
// @from(Ln 344902, Col 0)
async function ia4() {
    if (!await IH()) return new Map;
    if (await na4()) return new Map;
    let {
        stdout: q,
        code: K
    } = await z8(hA(), ["--no-optional-locks", "diff", "HEAD"], {
        timeout: aV1,
        preserveOutputOnError: !1
    });
    if (K !== 0) return new Map;
    return syY(q)
}
// @from(Ln 344916, Col 0)
function ayY(A) {
    let q = A.trim().split(`
`).filter(Boolean),
        K = 0,
        Y = 0,
        z = 0,
        _ = new Map;
    for (let w of q) {
        let O = w.split("\t");
        if (O.length < 3) continue;
        z++;
        let $ = O[0],
            H = O[1],
            j = O.slice(2).join("\t"),
            J = $ === "-" || H === "-",
            M = J ? 0 : parseInt($ ?? "0", 10) || 0,
            D = J ? 0 : parseInt(H ?? "0", 10) || 0;
        if (K += M, Y += D, _.size < qB8) _.set(j, {
            added: M,
            removed: D,
            isBinary: J
        })
    }
    return {
        stats: {
            filesCount: z,
            linesAdded: K,
            linesRemoved: Y
        },
        perFileStats: _
    }
}
// @from(Ln 344949, Col 0)
function syY(A) {
    let q = new Map;
    if (!A.trim()) return q;
    let K = A.split(/^diff --git /m).filter(Boolean);
    for (let Y of K) {
        if (q.size >= qB8) break;
        if (Y.length > nyY) continue;
        let z = Y.split(`
`),
            _ = z[0]?.match(/^a\/(.+?) b\/(.+)$/);
        if (!_) continue;
        let w = _[2] ?? _[1] ?? "",
            O = [],
            $ = null,
            H = 0;
        for (let j = 1; j < z.length; j++) {
            let J = z[j] ?? "",
                M = J.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
            if (M) {
                if ($) O.push($);
                $ = {
                    oldStart: parseInt(M[1] ?? "0", 10),
                    oldLines: parseInt(M[2] ?? "1", 10),
                    newStart: parseInt(M[3] ?? "0", 10),
                    newLines: parseInt(M[4] ?? "1", 10),
                    lines: []
                };
                continue
            }
            if (J.startsWith("index ") || J.startsWith("---") || J.startsWith("+++") || J.startsWith("new file") || J.startsWith("deleted file") || J.startsWith("old mode") || J.startsWith("new mode") || J.startsWith("Binary files")) continue;
            if ($ && (J.startsWith("+") || J.startsWith("-") || J.startsWith(" ") || J === "")) {
                if (H >= ryY) continue;
                $.lines.push("" + J), H++
            }
        }
        if ($) O.push($);
        if (O.length > 0) q.set(w, O)
    }
    return q
}
// @from(Ln 344989, Col 0)
async function na4() {
    let A = await V58(G1());
    if (!A) return !1;
    return (await Promise.all(["MERGE_HEAD", "REBASE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"].map((Y) => QyY(cyY(A, Y)).then(() => !0).catch(() => !1)))).some(Boolean)
}
// @from(Ln 344994, Col 0)
async function tyY(A) {
    let {
        stdout: q,
        code: K
    } = await z8(hA(), ["--no-optional-locks", "ls-files", "--others", "--exclude-standard"], {
        timeout: aV1,
        preserveOutputOnError: !1
    });
    if (K !== 0 || !q.trim()) return null;
    let Y = q.trim().split(`
`).filter(Boolean);
    if (Y.length === 0) return null;
    let z = new Map;
    for (let _ of Y.slice(0, A)) z.set(_, {
        added: 0,
        removed: 0,
        isBinary: !1,
        isUntracked: !0
    });
    return z
}
// @from(Ln 345016, Col 0)
function eyY(A) {
    let q = A.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/);
    if (!q) return null;
    return {
        filesCount: parseInt(q[1] ?? "0", 10),
        linesAdded: parseInt(q[2] ?? "0", 10),
        linesRemoved: parseInt(q[3] ?? "0", 10)
    }
}
// @from(Ln 345025, Col 0)
async function sV1(A) {
    let q = H_(dyY(A));
    if (!q) return null;
    let K = lyY(q, A).split(iyY).join("/"),
        Y = mC6(),
        {
            code: z
        } = await RA(hA(), ["--no-optional-locks", "ls-files", "--error-unmatch", K], {
            cwd: q,
            timeout: AB8
        });
    if (z === 0) {
        let w = await qLY(q),
            {
                stdout: O,
                code: $
            } = await RA(hA(), ["--no-optional-locks", "diff", w, "--", K], {
                cwd: q,
                timeout: AB8
            });
        if ($ !== 0) return null;
        if (!O) return null;
        return {
            ...ALY(K, O, "modified"),
            repository: Y
        }
    }
    let _ = await KLY(K, A);
    if (!_) return null;
    return {
        ..._,
        repository: Y
    }
}
// @from(Ln 345060, Col 0)
function ALY(A, q, K) {
    let Y = q.split(`
`),
        z = [],
        _ = !1,
        w = 0,
        O = 0;
    for (let $ of Y) {
        if ($.startsWith("@@")) _ = !0;
        if (_) {
            if (z.push($), $.startsWith("+") && !$.startsWith("+++")) w++;
            else if ($.startsWith("-") && !$.startsWith("---")) O++
        }
    }
    return {
        filename: A,
        status: K,
        additions: w,
        deletions: O,
        changes: w + O,
        patch: z.join(`
`)
    }
}
// @from(Ln 345084, Col 0)
async function qLY(A) {
    let q = process.env.CLAUDE_CODE_BASE_REF || await oT(),
        {
            stdout: K,
            code: Y
        } = await RA(hA(), ["--no-optional-locks", "merge-base", "HEAD", q], {
            cwd: A,
            timeout: AB8
        });
    if (Y === 0 && K.trim()) return K.trim();
    return "HEAD"
}
// @from(Ln 345096, Col 0)
async function KLY(A, q) {
    try {
        let Y = (await UyY(q, "utf-8")).split(`
`);
        if (Y.length > 0 && Y[Y.length - 1] === "") Y.pop();
        let z = Y.length,
            _ = Y.map((O) => `+${O}`).join(`
`),
            w = `@@ -0,0 +1,${z} @@
${_}`;
        return {
            filename: A,
            status: "added",
            additions: z,
            deletions: 0,
            changes: z,
            patch: w
        }
    } catch {
        return null
    }
}
// @from(Ln 345118, Col 4)
aV1 = 5000
// @from(Ln 345119, Col 4)
qB8 = 50
// @from(Ln 345120, Col 4)
nyY = 1e6
// @from(Ln 345121, Col 4)
ryY = 400
// @from(Ln 345122, Col 4)
oyY = 500
// @from(Ln 345123, Col 4)
AB8 = 3000
// @from(Ln 345124, Col 4)
tV1 = E(() => {
    lA();
    Eq();
    $5();
    yG()
})
// @from(Ln 345134, Col 4)
_LY
// @from(Ln 345134, Col 9)
wLY
// @from(Ln 345134, Col 14)
xX