
// @from(Ln 361882, Col 4)
JMK = p((mY) => {
    var I3Y = mY && mY.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        x3Y = mY && mY.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) I3Y(K, q, _)
        };
    Object.defineProperty(mY, "__esModule", {
        value: !0
    });
    mY.createMessageConnection = mY.createServerSocketTransport = mY.createClientSocketTransport = mY.createServerPipeTransport = mY.createClientPipeTransport = mY.generateRandomPipeName = mY.StreamMessageWriter = mY.StreamMessageReader = mY.SocketMessageWriter = mY.SocketMessageReader = mY.PortMessageWriter = mY.PortMessageReader = mY.IPCMessageWriter = mY.IPCMessageReader = void 0;
    var Mb6 = YMK();
    Mb6.default.install();
    var AMK = d6("path"),
        u3Y = d6("os"),
        m3Y = d6("crypto"),
        NU8 = d6("net"),
        MS = VU8();
    x3Y(VU8(), mY);
    class wMK extends MS.AbstractMessageReader {
        constructor(q) {
            super();
            this.process = q;
            let K = this.process;
            K.on("error", (_) => this.fireError(_)), K.on("close", () => this.fireClose())
        }
        listen(q) {
            return this.process.on("message", q), MS.Disposable.create(() => this.process.off("message", q))
        }
    }
    mY.IPCMessageReader = wMK;
    class $MK extends MS.AbstractMessageWriter {
        constructor(q) {
            super();
            this.process = q, this.errorCount = 0;
            let K = this.process;
            K.on("error", (_) => this.fireError(_)), K.on("close", () => this.fireClose)
        }
        write(q) {
            try {
                if (typeof this.process.send === "function") this.process.send(q, void 0, void 0, (K) => {
                    if (K) this.errorCount++, this.handleError(K, q);
                    else this.errorCount = 0
                });
                return Promise.resolve()
            } catch (K) {
                return this.handleError(K, q), Promise.reject(K)
            }
        }
        handleError(q, K) {
            this.errorCount++, this.fireError(q, K, this.errorCount)
        }
        end() {}
    }
    mY.IPCMessageWriter = $MK;
    class jMK extends MS.AbstractMessageReader {
        constructor(q) {
            super();
            this.onData = new MS.Emitter, q.on("close", () => this.fireClose), q.on("error", (K) => this.fireError(K)), q.on("message", (K) => {
                this.onData.fire(K)
            })
        }
        listen(q) {
            return this.onData.event(q)
        }
    }
    mY.PortMessageReader = jMK;
    class HMK extends MS.AbstractMessageWriter {
        constructor(q) {
            super();
            this.port = q, this.errorCount = 0, q.on("close", () => this.fireClose()), q.on("error", (K) => this.fireError(K))
        }
        write(q) {
            try {
                return this.port.postMessage(q), Promise.resolve()
            } catch (K) {
                return this.handleError(K, q), Promise.reject(K)
            }
        }
        handleError(q, K) {
            this.errorCount++, this.fireError(q, K, this.errorCount)
        }
        end() {}
    }
    mY.PortMessageWriter = HMK;
    class Pb6 extends MS.ReadableStreamMessageReader {
        constructor(q, K = "utf-8") {
            super((0, Mb6.default)().stream.asReadableStream(q), K)
        }
    }
    mY.SocketMessageReader = Pb6;
    class Wb6 extends MS.WriteableStreamMessageWriter {
        constructor(q, K) {
            super((0, Mb6.default)().stream.asWritableStream(q), K);
            this.socket = q
        }
        dispose() {
            super.dispose(), this.socket.destroy()
        }
    }
    mY.SocketMessageWriter = Wb6;
    class J47 extends MS.ReadableStreamMessageReader {
        constructor(q, K) {
            super((0, Mb6.default)().stream.asReadableStream(q), K)
        }
    }
    mY.StreamMessageReader = J47;
    class X47 extends MS.WriteableStreamMessageWriter {
        constructor(q, K) {
            super((0, Mb6.default)().stream.asWritableStream(q), K)
        }
    }
    mY.StreamMessageWriter = X47;
    var OMK = process.env.XDG_RUNTIME_DIR,
        B3Y = new Map([
            ["linux", 107],
            ["darwin", 103]
        ]);

    function p3Y() {
        let q = (0, m3Y.randomBytes)(21).toString("hex");
        if (process.platform === "win32") return `\\\\.\\pipe\\vscode-jsonrpc-${q}-sock`;
        let K;
        if (OMK) K = AMK.join(OMK, `vscode-ipc-${q}.sock`);
        else K = AMK.join(u3Y.tmpdir(), `vscode-${q}.sock`);
        let _ = B3Y.get(process.platform);
        if (_ !== void 0 && K.length > _)(0, Mb6.default)().console.warn(`WARNING: IPC handle "${K}" is longer than ${_} characters.`);
        return K
    }
    mY.generateRandomPipeName = p3Y;

    function F3Y(q, K = "utf-8") {
        let _, z = new Promise((Y, A) => {
            _ = Y
        });
        return new Promise((Y, A) => {
            let O = (0, NU8.createServer)((w) => {
                O.close(), _([new Pb6(w, K), new Wb6(w, K)])
            });
            O.on("error", A), O.listen(q, () => {
                O.removeListener("error", A), Y({
                    onConnected: () => {
                        return z
                    }
                })
            })
        })
    }
    mY.createClientPipeTransport = F3Y;

    function g3Y(q, K = "utf-8") {
        let _ = (0, NU8.createConnection)(q);
        return [new Pb6(_, K), new Wb6(_, K)]
    }
    mY.createServerPipeTransport = g3Y;

    function U3Y(q, K = "utf-8") {
        let _, z = new Promise((Y, A) => {
            _ = Y
        });
        return new Promise((Y, A) => {
            let O = (0, NU8.createServer)((w) => {
                O.close(), _([new Pb6(w, K), new Wb6(w, K)])
            });
            O.on("error", A), O.listen(q, "127.0.0.1", () => {
                O.removeListener("error", A), Y({
                    onConnected: () => {
                        return z
                    }
                })
            })
        })
    }
    mY.createClientSocketTransport = U3Y;

    function Q3Y(q, K = "utf-8") {
        let _ = (0, NU8.createConnection)(q, "127.0.0.1");
        return [new Pb6(_, K), new Wb6(_, K)]
    }
    mY.createServerSocketTransport = Q3Y;

    function d3Y(q) {
        let K = q;
        return K.read !== void 0 && K.addListener !== void 0
    }

    function c3Y(q) {
        let K = q;
        return K.write !== void 0 && K.addListener !== void 0
    }

    function l3Y(q, K, _, z) {
        if (!_) _ = MS.NullLogger;
        let Y = d3Y(q) ? new J47(q) : q,
            A = c3Y(K) ? new X47(K) : K;
        if (MS.ConnectionStrategy.is(z)) z = {
            connectionStrategy: z
        };
        return (0, MS.createMessageConnection)(Y, A, _, z)
    }
    mY.createMessageConnection = l3Y
})
// @from(Ln 362096, Col 4)
XMK = {}
// @from(Ln 362104, Col 0)
function i3Y(q, K) {
    let _, z, Y, A = !1,
        O = !1,
        w, $ = !1,
        j = [],
        H = [];

    function J() {
        if (O) throw w || Error(`LSP server ${q} failed to start`)
    }
    return {
        get capabilities() {
            return Y
        },
        get isInitialized() {
            return A
        },
        async start(X, M, P) {
            try {
                if (_ = n3Y(X, M, {
                        stdio: ["pipe", "pipe", "pipe"],
                        env: {
                            ...Dk(),
                            ...P?.env
                        },
                        cwd: P?.cwd,
                        windowsHide: !0
                    }), !_.stdout || !_.stdin) throw Error("LSP server process stdio not available");
                let W = _;
                if (await new Promise((G, f) => {
                        let v = () => {
                                k(), G()
                            },
                            V = (N) => {
                                k(), f(N)
                            },
                            k = () => {
                                W.removeListener("spawn", v), W.removeListener("error", V)
                            };
                        W.once("spawn", v), W.once("error", V)
                    }), _.stderr) _.stderr.on("data", (G) => {
                    let f = G.toString().trim();
                    if (f) E(`[LSP SERVER ${q}] ${f}`)
                });
                _.on("error", (G) => {
                    if (!$) O = !0, w = G, j6(Error(`LSP server ${q} failed to start: ${G.message}`))
                }), _.on("exit", (G, f) => {
                    if (G !== 0 && G !== null && !$) {
                        A = !1, O = !1, w = void 0;
                        let v = Error(`LSP server ${q} crashed with exit code ${G}`);
                        j6(v), K?.(v)
                    }
                }), _.stdin.on("error", (G) => {
                    if (!$) E(`LSP server ${q} stdin error: ${G.message}`)
                });
                let D = new p96.StreamMessageReader(_.stdout),
                    Z = new p96.StreamMessageWriter(_.stdin);
                z = p96.createMessageConnection(D, Z), z.onError(([G, f, v]) => {
                    if (!$) O = !0, w = G, j6(Error(`LSP server ${q} connection error: ${G.message}`))
                }), z.onClose(() => {
                    if (!$) A = !1, E(`LSP server ${q} connection closed`)
                }), z.listen(), z.trace(p96.Trace.Verbose, {
                    log: (G) => {
                        E(`[LSP PROTOCOL ${q}] ${G}`)
                    }
                }).catch((G) => {
                    E(`Failed to enable tracing for ${q}: ${G.message}`)
                });
                for (let {
                        method: G,
                        handler: f
                    }
                    of j) z.onNotification(G, f), E(`Applied queued notification handler for ${q}.${G}`);
                j.length = 0;
                for (let {
                        method: G,
                        handler: f
                    }
                    of H) z.onRequest(G, f), E(`Applied queued request handler for ${q}.${G}`);
                H.length = 0, E(`LSP client started for ${q}`)
            } catch (W) {
                throw j6(Error(`LSP server ${q} failed to start: ${W.message}`)), W
            }
        },
        async initialize(X) {
            if (!z) throw Error("LSP client not started");
            J();
            try {
                let M = await z.sendRequest("initialize", X);
                return Y = M.capabilities, await z.sendNotification("initialized", {}), A = !0, E(`LSP server ${q} initialized`), M
            } catch (M) {
                throw j6(Error(`LSP server ${q} initialize failed: ${M.message}`)), M
            }
        },
        async sendRequest(X, M) {
            if (!z) throw Error("LSP client not started");
            if (J(), !A) throw Error("LSP server not initialized");
            try {
                return await z.sendRequest(X, M)
            } catch (P) {
                throw j6(Error(`LSP server ${q} request ${X} failed: ${P.message}`)), P
            }
        },
        async sendNotification(X, M) {
            if (!z) throw Error("LSP client not started");
            J();
            try {
                await z.sendNotification(X, M)
            } catch (P) {
                j6(Error(`LSP server ${q} notification ${X} failed: ${P.message}`)), E(`Notification ${X} failed but continuing`)
            }
        },
        onNotification(X, M) {
            if (!z) {
                j.push({
                    method: X,
                    handler: M
                }), E(`Queued notification handler for ${q}.${X} (connection not ready)`);
                return
            }
            J(), z.onNotification(X, M)
        },
        onRequest(X, M) {
            if (!z) {
                H.push({
                    method: X,
                    handler: M
                }), E(`Queued request handler for ${q}.${X} (connection not ready)`);
                return
            }
            J(), z.onRequest(X, M)
        },
        async stop() {
            let X;
            $ = !0;
            try {
                if (z) await z.sendRequest("shutdown", {}), await z.sendNotification("exit", {})
            } catch (M) {
                let P = M;
                j6(Error(`LSP server ${q} stop failed: ${P.message}`)), X = P
            } finally {
                if (z) {
                    try {
                        z.dispose()
                    } catch (M) {
                        E(`Connection disposal failed for ${q}: ${b6(M)}`)
                    }
                    z = void 0
                }
                if (_) {
                    if (_.removeAllListeners("error"), _.removeAllListeners("exit"), _.stdin) _.stdin.removeAllListeners("error");
                    if (_.stderr) _.stderr.removeAllListeners("data");
                    try {
                        _.kill()
                    } catch (M) {
                        E(`Process kill failed for ${q} (may already be dead): ${b6(M)}`)
                    }
                    _ = void 0
                }
                if (A = !1, Y = void 0, $ = !1, X) O = !0, w = X;
                E(`LSP client stopped for ${q}`)
            }
            if (X) throw X
        }
    }
}
// @from(Ln 362270, Col 4)
p96
// @from(Ln 362271, Col 4)
MMK = L(() => {
    K8();
    m8();
    U8();
    zy();
    p96 = K6(JMK(), 1)
})
// @from(Ln 362283, Col 0)
function WMK(q, K) {
    if (K.restartOnCrash !== void 0) throw Error(`LSP server '${q}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
    if (K.shutdownTimeout !== void 0) throw Error(`LSP server '${q}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
    let {
        createLSPClient: _
    } = (MMK(), B7(XMK)), z = "stopped", Y, A, O = 0, w = 0, $ = _(q, (Z) => {
        z = "error", A = Z, w++
    });
    async function j() {
        if (z === "running" || z === "starting") return;
        let Z = K.maxRestarts ?? 3;
        if (z === "error" && w > Z) {
            let f = Error(`LSP server '${q}' exceeded max crash recovery attempts (${Z})`);
            throw A = f, j6(f), f
        }
        let G;
        try {
            z = "starting", E(`Starting LSP server instance: ${q}`), await $.start(K.command, K.args || [], {
                env: K.env,
                cwd: K.workspaceFolder
            });
            let f = K.workspaceFolder || b8(),
                v = r3Y(f).href,
                V = {
                    processId: process.pid,
                    clientInfo: {
                        name: "Claude Code",
                        version: {
                            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                            PACKAGE_URL: "@anthropic-ai/claude-code",
                            README_URL: "https://code.claude.com/docs/en/overview",
                            VERSION: "2.1.112",
                            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                            BUILD_TIME: "2026-04-16T18:33:19Z"
                        }.VERSION
                    },
                    initializationOptions: K.initializationOptions ?? {},
                    workspaceFolders: [{
                        uri: v,
                        name: PMK.basename(f)
                    }],
                    rootPath: f,
                    rootUri: v,
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
            if (G = $.initialize(V), K.startupTimeout !== void 0) await s3Y(G, K.startupTimeout, `LSP server '${q}' timed out after ${K.startupTimeout}ms during initialization`);
            else await G;
            z = "running", Y = new Date, w = 0, E(`LSP server instance started: ${q}`)
        } catch (f) {
            throw $.stop().catch(() => {}), G?.catch(() => {}), z = "error", A = f, j6(f), f
        }
    }
    async function H() {
        if (z === "stopped" || z === "stopping") return;
        try {
            z = "stopping", await $.stop(), z = "stopped", E(`LSP server instance stopped: ${q}`)
        } catch (Z) {
            throw z = "error", A = Z, j6(Z), Z
        }
    }
    async function J() {
        try {
            await H()
        } catch (G) {
            let f = Error(`Failed to stop LSP server '${q}' during restart: ${b6(G)}`);
            throw j6(f), f
        }
        O++;
        let Z = K.maxRestarts ?? 3;
        if (O > Z) {
            let G = Error(`Max restart attempts (${Z}) exceeded for server '${q}'`);
            throw j6(G), G
        }
        try {
            await j()
        } catch (G) {
            let f = Error(`Failed to start LSP server '${q}' during restart (attempt ${O}/${Z}): ${b6(G)}`);
            throw j6(f), f
        }
    }

    function X() {
        return z === "running" && $.isInitialized
    }
    async function M(Z, G) {
        if (!X()) {
            let V = Error(`Cannot send request to LSP server '${q}': server is ${z}${A?`, last error: ${A.message}`:""}`);
            throw j6(V), V
        }
        let f;
        for (let V = 0; V <= M47; V++) try {
            return await $.sendRequest(Z, G)
        } catch (k) {
            f = k;
            let N = k.code;
            if (typeof N === "number" && N === o3Y && V < M47) {
                let h = a3Y * Math.pow(2, V);
                E(`LSP request '${Z}' to '${q}' got ContentModified error, retrying in ${h}ms (attempt ${V+1}/${M47})…`), await l7(h);
                continue
            }
            break
        }
        let v = Error(`LSP request '${Z}' failed for server '${q}': ${f?.message??"unknown error"}`);
        throw j6(v), v
    }
    async function P(Z, G) {
        if (!X()) {
            let f = Error(`Cannot send notification to LSP server '${q}': server is ${z}`);
            throw j6(f), f
        }
        try {
            await $.sendNotification(Z, G)
        } catch (f) {
            let v = Error(`LSP notification '${Z}' failed for server '${q}': ${b6(f)}`);
            throw j6(v), v
        }
    }

    function W(Z, G) {
        $.onNotification(Z, G)
    }

    function D(Z, G) {
        $.onRequest(Z, G)
    }
    return {
        name: q,
        config: K,
        get state() {
            return z
        },
        get startTime() {
            return Y
        },
        get lastError() {
            return A
        },
        get restartCount() {
            return O
        },
        start: j,
        stop: H,
        restart: J,
        isHealthy: X,
        sendRequest: M,
        sendNotification: P,
        onNotification: W,
        onRequest: D
    }
}
// @from(Ln 362477, Col 0)
function s3Y(q, K, _) {
    let z, Y = new Promise((A, O) => {
        z = setTimeout((w, $) => w(Error($)), K, O, _)
    });
    return Promise.race([q, Y]).finally(() => clearTimeout(z))
}
// @from(Ln 362483, Col 4)
o3Y = -32801
// @from(Ln 362484, Col 4)
M47 = 3
// @from(Ln 362485, Col 4)
a3Y = 500
// @from(Ln 362486, Col 4)
DMK = L(() => {
    n7();
    K8();
    m8();
    U8()
})
// @from(Ln 362497, Col 0)
function ZMK() {
    let q = new Map,
        K = new Map,
        _ = new Map,
        z = new Map;

    function Y(Z) {
        let G = (z.get(Z) ?? 0) + 1;
        return z.set(Z, G), G
    }
    async function A() {
        let Z;
        try {
            Z = (await GJK()).servers, E(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(Z).length} server(s)`)
        } catch (G) {
            throw j6(Error(`Failed to load LSP server configuration: ${G.message}`)), G
        }
        for (let [G, f] of Object.entries(Z)) try {
            if (!f.command) throw Error(`Server ${G} missing required 'command' field`);
            if (!f.extensionToLanguage || Object.keys(f.extensionToLanguage).length === 0) throw Error(`Server ${G} missing required 'extensionToLanguage' field`);
            let v = Object.keys(f.extensionToLanguage);
            for (let k of v) {
                let N = k.toLowerCase();
                if (!K.has(N)) K.set(N, []);
                let R = K.get(N);
                if (R) R.push(G)
            }
            let V = WMK(G, f);
            q.set(G, V), V.onRequest("workspace/configuration", (k) => {
                return E(`LSP: Received workspace/configuration request from ${G}`), k.items.map(() => null)
            })
        } catch (v) {
            j6(Error(`Failed to initialize LSP server ${G}: ${v.message}`))
        }
        E(`LSP manager initialized with ${q.size} servers`)
    }
    async function O() {
        let Z = Array.from(q.entries()).filter(([, v]) => v.state === "running" || v.state === "error"),
            G = await Promise.allSettled(Z.map(([, v]) => v.stop()));
        q.clear(), K.clear(), _.clear(), z.clear();
        let f = G.map((v, V) => v.status === "rejected" ? `${Z[V][0]}: ${b6(v.reason)}` : null).filter((v) => v !== null);
        if (f.length > 0) {
            let v = Error(`Failed to stop ${f.length} LSP server(s): ${f.join("; ")}`);
            throw j6(v), v
        }
    }

    function w(Z) {
        let G = Ye.extname(Z).toLowerCase(),
            f = K.get(G);
        if (!f || f.length === 0) return;
        let v = f[0];
        if (!v) return;
        return q.get(v)
    }
    async function $(Z) {
        let G = w(Z);
        if (!G) return;
        if (G.state === "stopped" || G.state === "error") try {
            await G.start()
        } catch (f) {
            throw j6(Error(`Failed to start LSP server for file ${Z}: ${f.message}`)), f
        }
        return G
    }
    async function j(Z, G, f) {
        let v = await $(Z);
        if (!v) return;
        try {
            return await v.sendRequest(G, f)
        } catch (V) {
            throw j6(Error(`LSP request failed for file ${Z}, method '${G}': ${V.message}`)), V
        }
    }

    function H() {
        return q
    }
    async function J(Z, G) {
        let f = await $(Z);
        if (!f) return;
        let v = z58(Ye.resolve(Z)).href;
        if (_.get(v) === f.name) {
            E(`LSP: File already open, skipping didOpen for ${Z}`);
            return
        }
        let V = Ye.extname(Z).toLowerCase(),
            k = f.config.extensionToLanguage[V] || "plaintext";
        try {
            let N = Y(v);
            await f.sendNotification("textDocument/didOpen", {
                textDocument: {
                    uri: v,
                    languageId: k,
                    version: N,
                    text: G
                }
            }), _.set(v, f.name), E(`LSP: Sent didOpen for ${Z} (languageId: ${k})`)
        } catch (N) {
            let R = Error(`Failed to sync file open ${Z}: ${b6(N)}`);
            throw j6(R), R
        }
    }
    async function X(Z, G) {
        let f = w(Z);
        if (!f || f.state !== "running") return J(Z, G);
        let v = z58(Ye.resolve(Z)).href;
        if (_.get(v) !== f.name) return J(Z, G);
        try {
            let V = Y(v);
            await f.sendNotification("textDocument/didChange", {
                textDocument: {
                    uri: v,
                    version: V
                },
                contentChanges: [{
                    text: G
                }]
            }), E(`LSP: Sent didChange for ${Z} (v${V})`)
        } catch (V) {
            let k = Error(`Failed to sync file change ${Z}: ${b6(V)}`);
            throw j6(k), k
        }
    }
    async function M(Z) {
        let G = w(Z);
        if (!G || G.state !== "running") return;
        try {
            await G.sendNotification("textDocument/didSave", {
                textDocument: {
                    uri: z58(Ye.resolve(Z)).href
                }
            }), E(`LSP: Sent didSave for ${Z}`)
        } catch (f) {
            let v = Error(`Failed to sync file save ${Z}: ${b6(f)}`);
            throw j6(v), v
        }
    }
    async function P(Z) {
        let G = w(Z);
        if (!G || G.state !== "running") return;
        let f = z58(Ye.resolve(Z)).href;
        try {
            await G.sendNotification("textDocument/didClose", {
                textDocument: {
                    uri: f
                }
            }), _.delete(f), z.delete(f), E(`LSP: Sent didClose for ${Z}`)
        } catch (v) {
            let V = Error(`Failed to sync file close ${Z}: ${b6(v)}`);
            throw j6(V), V
        }
    }

    function W(Z) {
        let G = z58(Ye.resolve(Z)).href;
        return _.has(G)
    }

    function D(Z) {
        return z.get(Z)
    }
    return {
        initialize: A,
        shutdown: O,
        getServerForFile: w,
        ensureServerStarted: $,
        sendRequest: j,
        getAllServers: H,
        openFile: J,
        changeFile: X,
        saveFile: M,
        closeFile: P,
        isFileOpen: W,
        getDocumentVersion: D
    }
}
// @from(Ln 362674, Col 4)
fMK = L(() => {
    K8();
    m8();
    U8();
    vJK();
    DMK()
})
// @from(Ln 362685, Col 0)
function e3Y(q) {
    switch (q) {
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
// @from(Ln 362700, Col 0)
function q9Y(q) {
    let K;
    try {
        K = q.uri.startsWith("file://") ? t3Y(q.uri) : q.uri
    } catch (z) {
        let Y = r1(z);
        j6(Y), E(`Failed to convert URI to file path: ${q.uri}. Error: ${Y.message}. Using original URI as fallback.`), K = q.uri
    }
    let _ = q.diagnostics.map((z) => ({
        message: z.message,
        severity: e3Y(z.severity),
        range: {
            start: {
                line: z.range.start.line,
                character: z.range.start.character
            },
            end: {
                line: z.range.end.line,
                character: z.range.end.character
            }
        },
        source: z.source,
        code: z.code !== void 0 && z.code !== null ? String(z.code) : void 0
    }));
    return [{
        uri: K,
        diagnostics: _
    }]
}
// @from(Ln 362730, Col 0)
function GMK(q) {
    let K = q.getAllServers(),
        _ = [],
        z = 0,
        Y = new Map;
    for (let [O, w] of K.entries()) try {
        if (!w || typeof w.onNotification !== "function") {
            let $ = !w ? "Server instance is null/undefined" : "Server instance has no onNotification method";
            _.push({
                serverName: O,
                error: $
            });
            let j = Error(`${$} for ${O}`);
            j6(j), E(`Skipping handler registration for ${O}: ${$}`);
            continue
        }
        w.onNotification("textDocument/publishDiagnostics", ($) => {
            E(`[PASSIVE DIAGNOSTICS] Handler invoked for ${O}! Params type: ${typeof $}`);
            try {
                if (!$ || typeof $ !== "object" || !("uri" in $) || !("diagnostics" in $)) {
                    let X = Error(`LSP server ${O} sent invalid diagnostic params (missing uri or diagnostics)`);
                    j6(X), E(`Invalid diagnostic params from ${O}: ${I6($)}`);
                    return
                }
                let j = $;
                if (E(`Received diagnostics from ${O}: ${j.diagnostics.length} diagnostic(s) for ${j.uri}`), j.version !== void 0) {
                    let X = q.getDocumentVersion(j.uri);
                    if (X !== void 0 && j.version < X) {
                        E(`LSP Diagnostics: Dropping stale publishDiagnostics from ${O} for ${j.uri} (server v${j.version} < current v${X})`);
                        return
                    }
                }
                let H = q9Y(j),
                    J = H[0];
                if (!J || H.length === 0 || J.diagnostics.length === 0) {
                    E(`Skipping empty diagnostics from ${O} for ${j.uri}`);
                    return
                }
                try {
                    kC4({
                        serverName: O,
                        files: H
                    }), E(`LSP Diagnostics: Registered ${H.length} diagnostic file(s) from ${O} for async delivery`), Y.delete(O)
                } catch (X) {
                    let M = r1(X);
                    j6(M), E(`Error registering LSP diagnostics from ${O}: URI: ${j.uri}, Diagnostic count: ${J.diagnostics.length}, Error: ${M.message}`);
                    let P = Y.get(O) || {
                        count: 0,
                        lastError: ""
                    };
                    if (P.count++, P.lastError = M.message, Y.set(O, P), P.count >= 3) E(`WARNING: LSP diagnostic handler for ${O} has failed ${P.count} times consecutively. Last error: ${P.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
                }
            } catch (j) {
                let H = r1(j);
                j6(H), E(`Unexpected error processing diagnostics from ${O}: ${H.message}`);
                let J = Y.get(O) || {
                    count: 0,
                    lastError: ""
                };
                if (J.count++, J.lastError = H.message, Y.set(O, J), J.count >= 3) E(`WARNING: LSP diagnostic handler for ${O} has failed ${J.count} times consecutively. Last error: ${J.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
            }
        }), E(`Registered diagnostics handler for ${O}`), z++
    } catch ($) {
        let j = r1($);
        _.push({
            serverName: O,
            error: j.message
        }), j6(j), E(`Failed to register diagnostics handler for ${O}: Error: ${j.message}`)
    }
    let A = K.size;
    if (_.length > 0) {
        let O = _.map((w) => `${w.serverName} (${w.error})`).join(", ");
        j6(Error(`Failed to register diagnostics for ${_.length} LSP server(s): ${O}`)), E(`LSP notification handler registration: ${z}/${A} succeeded. Failed servers: ${O}. Diagnostics from failed servers will not be delivered.`)
    } else E(`LSP notification handlers registered successfully for all ${A} server(s)`);
    return {
        totalServers: A,
        successCount: z,
        registrationErrors: _,
        diagnosticFailures: Y
    }
}
// @from(Ln 362811, Col 4)
vMK = L(() => {
    K8();
    m8();
    U8();
    e8();
    uh6()
})
// @from(Ln 362819, Col 0)
function K9Y() {
    let q, K = "not-started",
        _, z = 0,
        Y;

    function A() {
        if (K === "failed") return;
        return q
    }

    function O() {
        if (K === "failed") return {
            status: "failed",
            error: _ || Error("Initialization failed")
        };
        if (K === "not-started") return {
            status: "not-started"
        };
        if (K === "pending") return {
            status: "pending"
        };
        return {
            status: "success"
        }
    }

    function w() {
        if (K === "failed") return !1;
        let X = A();
        if (!X) return !1;
        let M = X.getAllServers();
        if (M.size === 0) return !1;
        for (let P of M.values())
            if (P.state !== "error") return !0;
        return !1
    }
    async function $() {
        if (K === "success" || K === "failed") return;
        if (K === "pending" && Y) await Y
    }

    function j() {
        if (S9()) return;
        if (E("[LSP MANAGER] initializeLspServerManager() called"), q !== void 0 && K !== "failed") {
            E("[LSP MANAGER] Already initialized or initializing, skipping");
            return
        }
        if (K === "failed") q = void 0, _ = void 0;
        q = ZMK(), K = "pending", E("[LSP MANAGER] Created manager instance, state=pending");
        let X = ++z;
        E(`[LSP MANAGER] Starting async initialization (generation ${X})`), Y = q.initialize().then(() => {
            if (X === z) {
                if (K = "success", E("LSP server manager initialized successfully"), q) GMK(q)
            }
        }).catch((M) => {
            if (X === z) K = "failed", _ = M, q = void 0, j6(M), E(`Failed to initialize LSP server manager: ${b6(M)}`)
        })
    }

    function H() {
        if (K === "not-started") return;
        if (E("[LSP MANAGER] reinitializeLspServerManager() called"), q) q.shutdown().catch((X) => {
            E(`[LSP MANAGER] old instance shutdown during reinit failed: ${b6(X)}`)
        });
        q = void 0, K = "not-started", _ = void 0, j()
    }
    async function J() {
        if (q === void 0) return;
        try {
            await q.shutdown(), E("LSP server manager shut down successfully")
        } catch (X) {
            j6(X), E(`Failed to shutdown LSP server manager: ${b6(X)}`)
        } finally {
            q = void 0, K = "not-started", _ = void 0, Y = void 0, z++
        }
    }
    return {
        get: A,
        getStatus: O,
        isConnected: w,
        waitForInitialization: $,
        initialize: j,
        reinitialize: H,
        shutdown: J
    }
}
// @from(Ln 362905, Col 4)
HM6
// @from(Ln 362905, Col 9)
F96
// @from(Ln 362905, Col 14)
Db6
// @from(Ln 362905, Col 19)
TMK
// @from(Ln 362905, Col 24)
VMK
// @from(Ln 362905, Col 29)
kMK
// @from(Ln 362905, Col 34)
EU8
// @from(Ln 362905, Col 39)
NMK
// @from(Ln 362906, Col 4)
nl = L(() => {
    K8();
    Q8();
    m8();
    U8();
    fMK();
    vMK();
    HM6 = K9Y(), F96 = HM6.get, Db6 = HM6.getStatus, TMK = HM6.isConnected, VMK = HM6.waitForInitialization, kMK = HM6.initialize, EU8 = HM6.reinitialize, NMK = HM6.shutdown
})
// @from(Ln 362915, Col 4)
hMK = {}
// @from(Ln 362922, Col 0)
function z9Y() {
    if (P47 === null) P47 = yMK.map((q) => ({
        id: q.id,
        re: new RegExp(q.source, q.flags)
    }));
    return P47
}
// @from(Ln 362930, Col 0)
function LMK(q) {
    let K = {
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
    return q.split("-").map((_) => K[_] ?? zv(_)).join(" ")
}
// @from(Ln 362953, Col 0)
function W47(q) {
    let K = [],
        _ = new Set;
    for (let z of z9Y()) {
        if (_.has(z.id)) continue;
        if (z.re.test(q)) _.add(z.id), K.push({
            ruleId: z.id,
            label: LMK(z.id)
        })
    }
    return K
}
// @from(Ln 362966, Col 0)
function Y9Y(q) {
    return LMK(q)
}
// @from(Ln 362970, Col 0)
function Y58(q) {
    EMK ??= yMK.map((K) => new RegExp(K.source, (K.flags ?? "").replace("g", "") + "g"));
    for (let K of EMK) q = q.replace(K, (_, z) => typeof z === "string" ? _.replace(z, "[REDACTED]") : "[REDACTED]");
    return q
}
// @from(Ln 362975, Col 4)
_9Y
// @from(Ln 362975, Col 9)
yMK
// @from(Ln 362975, Col 14)
P47 = null
// @from(Ln 362976, Col 4)
EMK = null
// @from(Ln 362977, Col 4)
Zb6 = L(() => {
    _9Y = ["sk", "ant", "api"].join("-"), yMK = [{
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
        source: `\\b(${_9Y}03-[a-zA-Z0-9_\\-]{93}AA)(?:[\\x60'"\\s;]|\\\\[nr]|$)`
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
// @from(Ln 363091, Col 0)
function yU8(q, K) {
    {
        let {
            isTeamMemPath: _
        } = (ev(), B7(Tp)), {
            scanForSecrets: z
        } = (Zb6(), B7(hMK));
        if (!_(q)) return null;
        let Y = z(K);
        if (Y.length === 0) return null;
        return `Content contains potential secrets (${Y.map((O)=>O.label).join(", ")}) and cannot be written to team memory. Team memory is shared with all repository collaborators. Remove the sensitive content and try again.`
    }
    return null
}
// @from(Ln 363109, Col 0)
function A9Y(q) {
    return RMK("sha256").update(q).digest("hex").slice(0, 16)
}
// @from(Ln 363113, Col 0)
function O9Y(q) {
    return RMK("sha256").update(q).digest("hex")
}
// @from(Ln 363117, Col 0)
function cF(q) {
    let K = {
        operation: q.operation,
        tool: q.tool,
        filePathHash: A9Y(q.filePath)
    };
    if (q.content !== void 0 && q.content.length <= w9Y) K.contentHash = O9Y(q.content);
    if (q.type !== void 0) K.type = q.type;
    d("tengu_file_operation", K)
}
// @from(Ln 363127, Col 4)
w9Y = 102400
// @from(Ln 363128, Col 4)
LU8 = L(() => {
    C8()
})
// @from(Ln 363141, Col 0)
async function CMK() {
    if (!await qX()) return null;
    if (await IMK()) return null;
    let {
        stdout: K,
        code: _
    } = await w1(D7(), ["--no-optional-locks", "diff", "HEAD", "--shortstat"], {
        timeout: hU8,
        preserveOutputOnError: !1
    });
    if (_ === 0) {
        let $ = G9Y(K);
        if ($ && $.filesCount > W9Y) return {
            stats: $,
            perFileStats: new Map,
            hunks: new Map
        }
    }
    let {
        stdout: z,
        code: Y
    } = await w1(D7(), ["--no-optional-locks", "diff", "HEAD", "--numstat"], {
        timeout: hU8,
        preserveOutputOnError: !1
    });
    if (Y !== 0) return null;
    let {
        stats: A,
        perFileStats: O
    } = D9Y(z), w = Z47 - O.size;
    if (w > 0) {
        let $ = await f9Y(w);
        if ($) {
            A.filesCount += $.size;
            for (let [j, H] of $) O.set(j, H)
        }
    }
    return {
        stats: A,
        perFileStats: O,
        hunks: new Map
    }
}
// @from(Ln 363184, Col 0)
async function bMK() {
    if (!await qX()) return new Map;
    if (await IMK()) return new Map;
    let {
        stdout: K,
        code: _
    } = await w1(D7(), ["--no-optional-locks", "diff", "HEAD"], {
        timeout: hU8,
        preserveOutputOnError: !1
    });
    if (_ !== 0) return new Map;
    return Z9Y(K)
}
// @from(Ln 363198, Col 0)
function D9Y(q) {
    let K = q.trim().split(`
`).filter(Boolean),
        _ = 0,
        z = 0,
        Y = 0,
        A = new Map;
    for (let O of K) {
        let w = O.split("\t");
        if (w.length < 3) continue;
        Y++;
        let $ = w[0],
            j = w[1],
            H = w.slice(2).join("\t"),
            J = $ === "-" || j === "-",
            X = J ? 0 : parseInt($ ?? "0", 10) || 0,
            M = J ? 0 : parseInt(j ?? "0", 10) || 0;
        if (_ += X, z += M, A.size < Z47) A.set(H, {
            added: X,
            removed: M,
            isBinary: J
        })
    }
    return {
        stats: {
            filesCount: Y,
            linesAdded: _,
            linesRemoved: z
        },
        perFileStats: A
    }
}
// @from(Ln 363231, Col 0)
function Z9Y(q) {
    let K = new Map;
    if (!q.trim()) return K;
    let _ = q.split(/^diff --git /m).filter(Boolean);
    for (let z of _) {
        if (K.size >= Z47) break;
        if (z.length > SMK) continue;
        let Y = z.split(`
`),
            A = Y[0]?.match(/^a\/(.+?) b\/(.+)$/);
        if (!A) continue;
        let O = A[2] ?? A[1] ?? "",
            w = [],
            $ = null,
            j = 0;
        for (let H = 1; H < Y.length; H++) {
            let J = Y[H] ?? "",
                X = J.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
            if (X) {
                if ($) w.push($);
                $ = {
                    oldStart: parseInt(X[1] ?? "0", 10),
                    oldLines: parseInt(X[2] ?? "1", 10),
                    newStart: parseInt(X[3] ?? "0", 10),
                    newLines: parseInt(X[4] ?? "1", 10),
                    lines: []
                };
                continue
            }
            if (J.startsWith("index ") || J.startsWith("---") || J.startsWith("+++") || J.startsWith("new file") || J.startsWith("deleted file") || J.startsWith("old mode") || J.startsWith("new mode") || J.startsWith("Binary files")) continue;
            if ($ && (J.startsWith("+") || J.startsWith("-") || J.startsWith(" ") || J === "")) {
                if (j >= P9Y) continue;
                $.lines.push("" + J), j++
            }
        }
        if ($) w.push($);
        if (w.length > 0) K.set(O, w)
    }
    return K
}
// @from(Ln 363271, Col 0)
async function IMK() {
    let q = await vQ6(b8());
    if (!q) return !1;
    return (await Promise.all(["MERGE_HEAD", "REBASE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"].map((z) => $9Y(J9Y(q, z)).then(() => !0).catch(() => !1)))).some(Boolean)
}
// @from(Ln 363276, Col 0)
async function f9Y(q) {
    let {
        stdout: K,
        code: _
    } = await w1(D7(), ["--no-optional-locks", "ls-files", "--others", "--exclude-standard"], {
        timeout: hU8,
        preserveOutputOnError: !1
    });
    if (_ !== 0 || !K.trim()) return null;
    let z = K.trim().split(`
`).filter(Boolean);
    if (z.length === 0) return null;
    let Y = new Map;
    for (let A of z.slice(0, q)) Y.set(A, {
        added: 0,
        removed: 0,
        isBinary: !1,
        isUntracked: !0
    });
    return Y
}
// @from(Ln 363298, Col 0)
function G9Y(q) {
    let K = q.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/);
    if (!K) return null;
    return {
        filesCount: parseInt(K[1] ?? "0", 10),
        linesAdded: parseInt(K[2] ?? "0", 10),
        linesRemoved: parseInt(K[3] ?? "0", 10)
    }
}
// @from(Ln 363307, Col 0)
async function RU8(q) {
    let K = ez(H9Y(q));
    if (!K) return null;
    let _ = X9Y(K, q).split(M9Y).join("/"),
        z = pA1(),
        {
            code: Y
        } = await M7(D7(), ["--no-optional-locks", "ls-files", "--error-unmatch", _], {
            cwd: K,
            timeout: D47
        });
    if (Y === 0) {
        let O = await T9Y(K),
            {
                stdout: w,
                code: $
            } = await M7(D7(), ["--no-optional-locks", "diff", O, "--", _], {
                cwd: K,
                timeout: D47
            });
        if ($ !== 0) return null;
        if (!w) return null;
        return {
            ...v9Y(_, w, "modified"),
            repository: z
        }
    }
    let A = await V9Y(_, q);
    if (!A) return null;
    return {
        ...A,
        repository: z
    }
}
// @from(Ln 363342, Col 0)
function v9Y(q, K, _) {
    let z = K.split(`
`),
        Y = [],
        A = !1,
        O = 0,
        w = 0;
    for (let $ of z) {
        if ($.startsWith("@@")) A = !0;
        if (A) {
            if (Y.push($), $.startsWith("+") && !$.startsWith("+++")) O++;
            else if ($.startsWith("-") && !$.startsWith("---")) w++
        }
    }
    return {
        filename: q,
        status: _,
        additions: O,
        deletions: w,
        changes: O + w,
        patch: Y.join(`
`)
    }
}
// @from(Ln 363366, Col 0)
async function T9Y(q) {
    let K = W44(q),
        _ = (K !== void 0 ? P44().get(K) : void 0) || process.env.CLAUDE_CODE_BASE_REF || await UZ(),
        {
            stdout: z,
            code: Y
        } = await M7(D7(), ["--no-optional-locks", "merge-base", "HEAD", _], {
            cwd: q,
            timeout: D47
        });
    if (Y === 0 && z.trim()) return z.trim();
    return "HEAD"
}
// @from(Ln 363379, Col 0)
async function V9Y(q, K) {
    try {
        if (!TJ8(K, SMK)) return null;
        let z = (await j9Y(K, "utf-8")).split(`
`);
        if (z.length > 0 && z.at(-1) === "") z.pop();
        let Y = z.length,
            A = z.map((w) => `+${w}`).join(`
`),
            O = `@@ -0,0 +1,${Y} @@
${A}`;
        return {
            filename: q,
            status: "added",
            additions: Y,
            deletions: 0,
            changes: Y,
            patch: O
        }
    } catch {
        return null
    }
}
// @from(Ln 363402, Col 4)
hU8 = 5000
// @from(Ln 363403, Col 4)
Z47 = 50
// @from(Ln 363404, Col 4)
SMK = 1e6
// @from(Ln 363405, Col 4)
P9Y = 400
// @from(Ln 363406, Col 4)
W9Y = 500
// @from(Ln 363407, Col 4)
D47 = 3000
// @from(Ln 363408, Col 4)
SU8 = L(() => {
    tk8();
    n7();
    gZ();
    Q4();
    eK();
    pK()
})
// @from(Ln 363417, Col 0)
function _W(q = y.boolean()) {
    return y.preprocess((K) => K === "true" ? !0 : K === "false" ? !1 : K, q)
}
// @from(Ln 363420, Col 4)
g96 = L(() => {
    p7()
})
// @from(Ln 363423, Col 4)
CU8
// @from(Ln 363423, Col 9)
f47
// @from(Ln 363423, Col 14)
G47
// @from(Ln 363423, Col 19)
v47
// @from(Ln 363424, Col 4)
A58 = L(() => {
    p7();
    g96();
    CU8 = C6(() => y.strictObject({
        file_path: y.string().describe("The absolute path to the file to modify"),
        old_string: y.string().describe("The text to replace"),
        new_string: y.string().describe("The text to replace it with (must be different from old_string)"),
        replace_all: _W(y.boolean().default(!1).optional()).describe("Replace all occurrences of old_string (default false)")
    })), f47 = C6(() => y.object({
        oldStart: y.number(),
        oldLines: y.number(),
        newStart: y.number(),
        newLines: y.number(),
        lines: y.array(y.string())
    })), G47 = C6(() => y.object({
        filename: y.string(),
        status: y.enum(["modified", "added"]),
        additions: y.number(),
        deletions: y.number(),
        changes: y.number(),
        patch: y.string(),
        repository: y.string().nullable().optional().describe("GitHub owner/repo when available")
    })), v47 = C6(() => y.object({
        filePath: y.string().describe("The file path that was edited"),
        oldString: y.string().describe("The original string that was replaced"),
        newString: y.string().describe("The new string that replaced it"),
        originalFile: y.string().nullable().describe("The original file contents before editing"),
        structuredPatch: y.array(f47()).describe("Diff patch showing the changes"),
        userModified: y.boolean().describe("Whether the user modified the proposed changes"),
        replaceAll: y.boolean().describe("Whether all occurrences were replaced"),
        gitDiff: G47().optional()
    }))
})
// @from(Ln 363462, Col 0)
function E9Y() {
    return yR6()
}
// @from(Ln 363466, Col 0)
function JK(q, K, _) {
    return {
        r: q,
        g: K,
        b: _,
        a: 255
    }
}
// @from(Ln 363475, Col 0)
function H0(q) {
    return {
        r: q,
        g: 0,
        b: 0,
        a: 0
    }
}
// @from(Ln 363484, Col 0)
function UMK(q) {
    if (q.includes("ansi")) return "ansi";
    let K = process.env.COLORTERM ?? "";
    return K === "truecolor" || K === "24bit" ? "truecolor" : "color256"
}
// @from(Ln 363490, Col 0)
function y9Y(q, K, _) {
    let z = (Z) => Z < 48 ? 0 : Z < 115 ? 1 : Z < 155 ? 2 : Z < 195 ? 3 : Z < 235 ? 4 : 5,
        Y = z(q),
        A = z(K),
        O = z(_),
        w = 16 + 36 * Y + 6 * A + O,
        $ = Math.round((q + K + _) / 3);
    if ($ < 5) return 16;
    if ($ > 244 && Y === A && A === O) return w;
    let j = Math.max(0, Math.min(23, Math.round(($ - 8) / 10))),
        H = 232 + j,
        J = 8 + j * 10,
        X = V47[Y],
        M = V47[A],
        P = V47[O],
        W = (q - X) ** 2 + (K - M) ** 2 + (_ - P) ** 2;
    return (q - J) ** 2 + (K - J) ** 2 + (_ - J) ** 2 < W ? H : w
}
// @from(Ln 363509, Col 0)
function xMK(q, K, _) {
    if (q.a === 0) {
        let Y = q.r;
        if (Y < 8) return `\x1B[${(K?30:40)+Y}m`;
        if (Y < 16) return `\x1B[${(K?90:100)+(Y-8)}m`;
        return `\x1B[${K?38:48};5;${Y}m`
    }
    if (q.a === 1) return K ? "\x1B[39m" : "\x1B[49m";
    let z = K ? 38 : 48;
    if (_ === "truecolor") return `\x1B[${z};2;${q.r};${q.g};${q.b}m`;
    return `\x1B[${z};5;${y9Y(q.r,q.g,q.b)}m`
}
// @from(Ln 363522, Col 0)
function L9Y(q, K, _, z) {
    let Y = z ? T47 + k47 : T47;
    for (let [A, O] of q) {
        if (Y += xMK(A.foreground, !0, K), !_) Y += xMK(A.background, !1, K);
        Y += O
    }
    return Y + T47
}
// @from(Ln 363531, Col 0)
function h9Y(q) {
    if (q.includes("ansi")) return "ansi";
    if (q.includes("dark")) return "Monokai Extended";
    return "GitHub"
}
// @from(Ln 363537, Col 0)
function QMK(q, K) {
    let _ = q.includes("dark"),
        z = q.includes("ansi"),
        Y = q.includes("daltonized"),
        A = K === "truecolor";
    if (z) return {
        addLine: Ae,
        addWord: Ae,
        addDecoration: H0(10),
        deleteLine: Ae,
        deleteWord: Ae,
        deleteDecoration: H0(9),
        foreground: H0(7),
        background: Ae,
        scopes: S9Y
    };
    if (_) {
        let H = JK(248, 248, 242),
            J = JK(61, 1, 0),
            X = JK(92, 2, 0),
            M = JK(220, 90, 90);
        if (Y) return {
            addLine: A ? JK(0, 27, 41) : H0(17),
            addWord: A ? JK(0, 48, 71) : H0(24),
            addDecoration: JK(81, 160, 200),
            deleteLine: J,
            deleteWord: X,
            deleteDecoration: M,
            foreground: H,
            background: Ae,
            scopes: uMK
        };
        return {
            addLine: A ? JK(2, 40, 0) : H0(22),
            addWord: A ? JK(4, 71, 0) : H0(28),
            addDecoration: JK(80, 200, 80),
            deleteLine: J,
            deleteWord: X,
            deleteDecoration: M,
            foreground: H,
            background: Ae,
            scopes: uMK
        }
    }
    let O = JK(51, 51, 51),
        w = JK(255, 220, 220),
        $ = JK(255, 199, 199),
        j = JK(207, 34, 46);
    if (Y) return {
        addLine: JK(219, 237, 255),
        addWord: JK(179, 217, 255),
        addDecoration: JK(36, 87, 138),
        deleteLine: w,
        deleteWord: $,
        deleteDecoration: j,
        foreground: O,
        background: Ae,
        scopes: mMK
    };
    return {
        addLine: JK(220, 255, 220),
        addWord: JK(178, 255, 178),
        addDecoration: JK(36, 138, 61),
        deleteLine: w,
        deleteWord: $,
        deleteDecoration: j,
        foreground: O,
        background: Ae,
        scopes: mMK
    }
}
// @from(Ln 363609, Col 0)
function bU8(q) {
    return {
        foreground: q.foreground,
        background: q.background
    }
}
// @from(Ln 363616, Col 0)
function IU8(q, K) {
    switch (q) {
        case "+":
            return K.addLine;
        case "-":
            return K.deleteLine;
        case " ":
            return K.background
    }
}
// @from(Ln 363627, Col 0)
function C9Y(q, K) {
    switch (q) {
        case "+":
            return K.addWord;
        case "-":
            return K.deleteWord;
        case " ":
            return K.background
    }
}
// @from(Ln 363638, Col 0)
function dMK(q, K) {
    switch (q) {
        case "+":
            return K.addDecoration;
        case "-":
            return K.deleteDecoration;
        case " ":
            return K.foreground
    }
}
// @from(Ln 363649, Col 0)
function cMK(q, K) {
    let _ = k9Y(q),
        z = N9Y(q).slice(1),
        Y = i5(_, "."),
        A = BMK.get(_) ?? BMK.get(Y);
    if (A) {
        let O = ck(A);
        if (O) return O
    }
    if (z) {
        let O = ck(z);
        if (O) return O
    }
    if (K) {
        let O = K.startsWith("\uFEFF") ? K.slice(1) : K;
        if (O.startsWith("#!")) {
            if (O.includes("bash") || O.includes("/sh")) return ck("bash");
            if (O.includes("python")) return ck("python");
            if (O.includes("node")) return ck("javascript");
            if (O.includes("ruby")) return ck("ruby");
            if (O.includes("perl")) return ck("perl")
        }
        if (O.startsWith("<?php")) return ck("php");
        if (O.startsWith("<?xml")) return ck("xml")
    }
    return null
}
// @from(Ln 363677, Col 0)
function b9Y(q, K, _) {
    if (!q) return _.foreground;
    if (q === "keyword" && R9Y.has(K.trim())) return _.scopes._storage ?? _.foreground;
    return _.scopes[q] ?? _.scopes[i5(q, ".")] ?? _.foreground
}
// @from(Ln 363683, Col 0)
function lMK(q, K, _, z) {
    if (typeof q === "string") {
        let A = b9Y(_, q, K);
        z.push([{
            foreground: A,
            background: K.background
        }, q]);
        return
    }
    let Y = q.scope ?? q.kind ?? _;
    for (let A of q.children) lMK(A, K, Y, z)
}
// @from(Ln 363696, Col 0)
function I9Y(q) {
    return typeof q === "object" && q !== null && "rootNode" in q && typeof q.rootNode === "object" && q.rootNode !== null && "children" in q.rootNode
}
// @from(Ln 363700, Col 0)
function nMK(q, K, _) {
    let z = K + `
`;
    if (!q.lang) return [
        [bU8(_), z]
    ];
    let Y;
    try {
        Y = E9Y().highlight(z, {
            language: q.lang,
            ignoreIllegals: !0
        })
    } catch {
        return [
            [bU8(_), z]
        ]
    }
    if (!I9Y(Y.emitter)) {
        if (!pMK) pMK = !0, j6(Error(`color-diff: hljs emitter shape mismatch (keys: ${Object.keys(Y.emitter).join(",")}). Syntax highlighting disabled.`));
        return [
            [bU8(_), z]
        ]
    }
    let A = [];
    return lMK(Y.emitter.rootNode, _, void 0, A), A
}
// @from(Ln 363727, Col 0)
function FMK(q) {
    let K = [],
        _ = 0;
    while (_ < q.length) {
        let z = q[_];
        if (/[\p{L}\p{N}_]/u.test(z)) {
            let Y = _ + 1;
            while (Y < q.length && /[\p{L}\p{N}_]/u.test(q[Y])) Y++;
            K.push(q.slice(_, Y)), _ = Y
        } else if (/\s/.test(z)) {
            let Y = _ + 1;
            while (Y < q.length && /\s/.test(q[Y])) Y++;
            K.push(q.slice(_, Y)), _ = Y
        } else {
            let A = q.codePointAt(_) > 65535 ? 2 : 1;
            K.push(q.slice(_, _ + A)), _ += A
        }
    }
    return K
}
// @from(Ln 363748, Col 0)
function u9Y(q) {
    let K = [],
        _ = 0;
    while (_ < q.length)
        if (q[_] === "-") {
            let z = _,
                Y = _;
            while (Y < q.length && q[Y] === "-") Y++;
            let A = Y;
            while (A < q.length && q[A] === "+") A++;
            let O = Y - z,
                w = A - Y;
            if (O > 0 && w > 0) {
                let $ = Math.min(O, w);
                for (let j = 0; j < $; j++) K.push([z + j, Y + j]);
                _ = A
            } else _ = Y
        } else _++;
    return K
}
// @from(Ln 363769, Col 0)
function m9Y(q, K) {
    let _ = FMK(q),
        z = FMK(K),
        Y = EU1(_, z),
        A = q.length + K.length,
        O = 0,
        w = [],
        $ = [],
        j = 0,
        H = 0;
    for (let J of Y) {
        let X = J.value.reduce((M, P) => M + P.length, 0);
        if (J.removed) O += X, w.push({
            start: j,
            end: j + X
        }), j += X;
        else if (J.added) O += X, $.push({
            start: H,
            end: H + X
        }), H += X;
        else j += X, H += X
    }
    if (A > 0 && O / A > x9Y) return [
        [],
        []
    ];
    return [w, $]
}
// @from(Ln 363798, Col 0)
function iMK(q) {
    q.lines = q.lines.map((K) => K.flatMap(([_, z]) => z.split(`
`).filter((Y) => Y.length > 0).map((Y) => [_, Y])))
}
// @from(Ln 363803, Col 0)
function B9Y(q) {
    return N1(q)
}
// @from(Ln 363807, Col 0)
function rMK(q, K, _) {
    let z = [];
    for (let Y of q.lines) {
        let A = Y.slice(),
            O = [],
            w = 0;
        while (A.length > 0) {
            let [$, j] = A.shift(), H = N1(j);
            if (w + H <= K) O.push([$, j]), w += H;
            else {
                let J = K - w,
                    X = 0,
                    M = 0;
                for (let P of j) {
                    let W = B9Y(P);
                    if (M + W > J) break;
                    M += W, X += P.length
                }
                if (X === 0)
                    if (w === 0) X = j.codePointAt(0) > 65535 ? 2 : 1;
                    else {
                        z.push(O), A.unshift([$, j]), O = [], w = 0;
                        continue
                    } O.push([$, j.slice(0, X)]), z.push(O), A.unshift([$, j.slice(X)]), O = [], w = 0
            }
        }
        z.push(O)
    }
    if (q.lines = z, q.marker && q.marker !== " ") {
        let Y = IU8(q.marker, _),
            A = {
                foreground: _.foreground,
                background: Y
            };
        for (let O of q.lines) {
            let w = O.reduce(($, [, j]) => $ + N1(j), 0);
            if (w < K) O.push([A, " ".repeat(K - w)])
        }
    }
}
// @from(Ln 363848, Col 0)
function oMK(q, K, _, z) {
    let Y = {
            foreground: q.marker ? dMK(q.marker, K) : K.foreground,
            background: q.marker ? IU8(q.marker, K) : K.background
        },
        A = q.marker === null || q.marker === " ";
    for (let O = 0; O < q.lines.length; O++) {
        let w = O === 0 ? ` ${String(q.lineNumber).padStart(_)} ` : " ".repeat(_ + 2),
            $ = A && !z ? `${k47}${w}${gMK}` : w;
        q.lines[O].unshift([Y, $])
    }
}
// @from(Ln 363861, Col 0)
function p9Y(q, K) {
    if (!q.marker) return;
    let _ = {
        foreground: dMK(q.marker, K),
        background: IU8(q.marker, K)
    };
    for (let z of q.lines) z.unshift([_, q.marker])
}
// @from(Ln 363870, Col 0)
function F9Y(q) {
    for (let K of q.lines)
        if (K.length > 0) {
            K[0][1] = k47 + K[0][1];
            let _ = K.length - 1;
            K[_][1] = K[_][1] + gMK
        }
}
// @from(Ln 363879, Col 0)
function g9Y(q, K, _) {
    if (!q.marker) return;
    let z = IU8(q.marker, K),
        Y = C9Y(q.marker, K),
        A = 0,
        O = 0;
    for (let w = 0; w < q.lines.length; w++) {
        let $ = [];
        for (let [j, H] of q.lines[w]) {
            let J = O,
                X = O + H.length;
            while (A < _.length && _[A].end <= J) A++;
            if (A >= _.length) {
                $.push([{
                    ...j,
                    background: z
                }, H]), O = X;
                continue
            }
            let M = H,
                P = J;
            while (M.length > 0 && A < _.length) {
                let W = _[A],
                    D = P >= W.start && P < W.end,
                    Z;
                if (D) Z = Math.min(W.end, X);
                else if (W.start > P && W.start < X) Z = W.start;
                else Z = X;
                let G = Z - P,
                    f = M.slice(0, G);
                if ($.push([{
                        ...j,
                        background: D ? Y : z
                    }, f]), M = M.slice(G), P = Z, P >= W.end) A++
            }
            if (M.length > 0) $.push([{
                ...j,
                background: z
            }, M]);
            O = X
        }
        q.lines[w] = $
    }
}
// @from(Ln 363924, Col 0)
function aMK(q, K, _, z) {
    return q.lines.map((Y) => L9Y(Y, z, _, K))
}
// @from(Ln 363928, Col 0)
function U9Y(q) {
    let K = Math.max(0, q.oldStart + q.oldLines - 1),
        _ = Math.max(0, q.newStart + q.newLines - 1);
    return Math.max(K, _)
}
// @from(Ln 363934, Col 0)
function Q9Y(q) {
    return q === "+" || q === "-" ? q : " "
}
// @from(Ln 363937, Col 0)
class N47 {
    hunk;
    filePath;
    firstLine;
    prefixContent;
    constructor(q, K, _, z) {
        this.hunk = q, this.filePath = _, this.firstLine = K, this.prefixContent = z ?? null
    }
    render(q, K, _) {
        let z = UMK(q),
            Y = QMK(q, z),
            O = {
                lang: cMK(this.filePath, this.firstLine),
                stack: null
            };
        this.prefixContent;
        let w = String(U9Y(this.hunk)).length,
            $ = this.hunk.oldStart,
            j = this.hunk.newStart,
            H = Math.max(1, K - w - 2 - 1),
            J = this.hunk.lines.map((P) => {
                let W = Q9Y(P.slice(0, 1)),
                    D = P.slice(1),
                    Z;
                switch (W) {
                    case "+":
                        Z = j++;
                        break;
                    case "-":
                        Z = $++;
                        break;
                    case " ":
                        Z = j, $++, j++;
                        break
                }
                return {
                    lineNumber: Z,
                    marker: W,
                    code: D
                }
            }),
            X = J.map(() => []);
        if (!_) {
            let P = J.map((W) => W.marker);
            for (let [W, D] of u9Y(P)) {
                let [Z, G] = m9Y(J[W].code, J[D].code);
                X[W] = Z, X[D] = G
            }
        }
        let M = [];
        for (let P = 0; P < J.length; P++) {
            let {
                lineNumber: W,
                marker: D,
                code: Z
            } = J[P], G = D === "-" ? [
                [bU8(Y), Z]
            ] : nMK(O, Z, Y), f = {
                marker: D,
                lineNumber: W,
                lines: [G]
            };
            if (iMK(f), g9Y(f, Y, X[P]), rMK(f, H, Y), z === "ansi" && D === "-") F9Y(f);
            p9Y(f, Y), oMK(f, Y, w, _), M.push(...aMK(f, _, !1, z))
        }
        return M
    }
}
// @from(Ln 364005, Col 0)
class E47 {
    code;
    filePath;
    constructor(q, K) {
        this.code = q, this.filePath = K
    }
    render(q, K, _) {
        let z = UMK(q),
            Y = QMK(q, z),
            A = this.code.split(`
`);
        if (A.at(-1) === "") A.pop();
        let O = A[0] ?? null,
            $ = {
                lang: cMK(this.filePath, O),
                stack: null
            },
            j = String(A.length).length,
            H = Math.max(1, K - j - 2),
            J = [];
        for (let X = 0; X < A.length; X++) {
            let M = nMK($, A[X], Y),
                P = {
                    marker: null,
                    lineNumber: X + 1,
                    lines: [M]
                };
            iMK(P), rMK(P, H, Y), oMK(P, Y, j, _), J.push(...aMK(P, _, !0, z))
        }
        return J
    }
}
// @from(Ln 364038, Col 0)
function sMK(q) {
    let K = process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT ?? process.env.BAT_THEME;
    return {
        theme: h9Y(q),
        source: null
    }
}
// @from(Ln 364045, Col 4)
T47 = "\x1B[0m"
// @from(Ln 364046, Col 4)
k47 = "\x1B[2m"
// @from(Ln 364047, Col 4)
gMK = "\x1B[22m"
// @from(Ln 364048, Col 4)
Ae
// @from(Ln 364048, Col 8)
V47
// @from(Ln 364048, Col 13)
uMK
// @from(Ln 364048, Col 18)
mMK
// @from(Ln 364048, Col 23)
R9Y
// @from(Ln 364048, Col 28)
S9Y
// @from(Ln 364048, Col 33)
BMK
// @from(Ln 364048, Col 38)
pMK = !1
// @from(Ln 364049, Col 4)
x9Y = 0.4
// @from(Ln 364050, Col 4)
tMK = L(() => {
    pK6();
    yo1();
    n5();
    U8();
    Ae = {
        r: 0,
        g: 0,
        b: 0,
        a: 1
    };
    V47 = [0, 95, 135, 175, 215, 255];
    uMK = {
        keyword: JK(249, 38, 114),
        _storage: JK(102, 217, 239),
        built_in: JK(166, 226, 46),
        type: JK(166, 226, 46),
        literal: JK(190, 132, 255),
        number: JK(190, 132, 255),
        string: JK(230, 219, 116),
        title: JK(166, 226, 46),
        "title.function": JK(166, 226, 46),
        "title.class": JK(166, 226, 46),
        "title.class.inherited": JK(166, 226, 46),
        params: JK(253, 151, 31),
        comment: JK(117, 113, 94),
        meta: JK(117, 113, 94),
        attr: JK(166, 226, 46),
        attribute: JK(166, 226, 46),
        variable: JK(255, 255, 255),
        "variable.language": JK(255, 255, 255),
        property: JK(255, 255, 255),
        operator: JK(249, 38, 114),
        punctuation: JK(248, 248, 242),
        symbol: JK(190, 132, 255),
        regexp: JK(230, 219, 116),
        subst: JK(248, 248, 242)
    }, mMK = {
        keyword: JK(167, 29, 93),
        _storage: JK(167, 29, 93),
        built_in: JK(0, 134, 179),
        type: JK(0, 134, 179),
        literal: JK(0, 134, 179),
        number: JK(0, 134, 179),
        string: JK(24, 54, 145),
        title: JK(121, 93, 163),
        "title.function": JK(121, 93, 163),
        "title.class": JK(0, 0, 0),
        "title.class.inherited": JK(0, 0, 0),
        params: JK(0, 134, 179),
        comment: JK(150, 152, 150),
        meta: JK(150, 152, 150),
        attr: JK(0, 134, 179),
        attribute: JK(0, 134, 179),
        variable: JK(0, 134, 179),
        "variable.language": JK(0, 134, 179),
        property: JK(0, 134, 179),
        operator: JK(167, 29, 93),
        punctuation: JK(51, 51, 51),
        symbol: JK(0, 134, 179),
        regexp: JK(24, 54, 145),
        subst: JK(51, 51, 51)
    }, R9Y = new Set(["const", "let", "var", "function", "class", "type", "interface", "enum", "namespace", "module", "def", "fn", "func", "struct", "trait", "impl"]), S9Y = {
        keyword: H0(13),
        _storage: H0(14),
        built_in: H0(14),
        type: H0(14),
        literal: H0(12),
        number: H0(12),
        string: H0(10),
        title: H0(11),
        "title.function": H0(11),
        "title.class": H0(11),
        comment: H0(8),
        meta: H0(8)
    };
    BMK = new Map([
        ["Dockerfile", "dockerfile"],
        ["Makefile", "makefile"],
        ["Rakefile", "ruby"],
        ["Gemfile", "ruby"],
        ["CMakeLists", "cmake"]
    ])
})
// @from(Ln 364135, Col 0)
function O58() {
    if (c5(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) return "env";
    return null
}
// @from(Ln 364140, Col 0)
function eMK() {
    return O58() === null ? N47 : null
}
// @from(Ln 364144, Col 0)
function qPK() {
    return O58() === null ? E47 : null
}
// @from(Ln 364148, Col 0)
function KPK(q) {
    return O58() === null ? sMK(q) : null
}
// @from(Ln 364151, Col 4)
xU8 = L(() => {
    tMK();
    Q8()
})
// @from(Ln 364156, Col 0)
function _PK(q) {
    let K = s(10),
        {
            patch: _,
            dim: z,
            width: Y
        } = q,
        [A] = Zq(),
        O;
    if (K[0] !== z || K[1] !== _.lines || K[2] !== _.oldStart || K[3] !== A || K[4] !== Y) O = o9Y(_.lines, _.oldStart, Y, z, A), K[0] = z, K[1] = _.lines, K[2] = _.oldStart, K[3] = A, K[4] = Y, K[5] = O;
    else O = K[5];
    let w = O,
        $;
    if (K[6] !== w) $ = w.map(c9Y), K[6] = w, K[7] = $;
    else $ = K[7];
    let j;
    if (K[8] !== $) j = xJ.createElement(u, {
        flexDirection: "column",
        flexGrow: 1
    }, $), K[8] = $, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 364180, Col 0)
function c9Y(q, K) {
    return xJ.createElement(u, {
        key: K
    }, q)
}
// @from(Ln 364186, Col 0)
function l9Y(q) {
    return q.map((K) => {
        if (K.startsWith("+")) return {
            code: K.slice(1),
            i: 0,
            type: "add",
            originalCode: K.slice(1)
        };
        if (K.startsWith("-")) return {
            code: K.slice(1),
            i: 0,
            type: "remove",
            originalCode: K.slice(1)
        };
        return {
            code: K.slice(1),
            i: 0,
            type: "nochange",
            originalCode: K.slice(1)
        }
    })
}
// @from(Ln 364209, Col 0)
function n9Y(q) {
    let K = [],
        _ = 0;
    while (_ < q.length) {
        let z = q[_];
        if (!z) {
            _++;
            continue
        }
        if (z.type === "remove") {
            let Y = [z],
                A = _ + 1;
            while (A < q.length && q[A]?.type === "remove") {
                let w = q[A];
                if (w) Y.push(w);
                A++
            }
            let O = [];
            while (A < q.length && q[A]?.type === "add") {
                let w = q[A];
                if (w) O.push(w);
                A++
            }
            if (Y.length > 0 && O.length > 0) {
                let w = Math.min(Y.length, O.length);
                for (let $ = 0; $ < w; $++) {
                    let j = Y[$],
                        H = O[$];
                    if (j && H) j.wordDiff = !0, H.wordDiff = !0, j.matchedLine = H, H.matchedLine = j
                }
                K.push(...Y.filter(Boolean)), K.push(...O.filter(Boolean)), _ = A
            } else K.push(z), _++
        } else K.push(z), _++
    }
    return K
}
// @from(Ln 364246, Col 0)
function i9Y(q, K) {
    return kU1(q, K, {
        ignoreCase: !1
    })
}
// @from(Ln 364252, Col 0)
function r9Y(q, K, _, z, Y) {
    let {
        type: A,
        i: O,
        wordDiff: w,
        matchedLine: $,
        originalCode: j
    } = q;
    if (!w || !$) return null;
    let H = A === "remove" ? j : $.originalCode,
        J = A === "remove" ? $.originalCode : j,
        X = i9Y(H, J),
        M = H.length + J.length;
    if (X.filter((k) => k.added || k.removed).reduce((k, N) => k + N.value.length, 0) / M > d9Y || z) return null;
    let D = A === "add" ? "+" : "-",
        Z = D.length,
        G = Math.max(1, K - _ - 1 - Z),
        f = [],
        v = [],
        V = 0;
    if (X.forEach((k, N) => {
            let R = !1,
                h;
            if (A === "add") {
                if (k.added) R = !0, h = "diffAddedWord";
                else if (!k.removed) R = !0
            } else if (A === "remove") {
                if (k.removed) R = !0, h = "diffRemovedWord";
                else if (!k.added) R = !0
            }
            if (!R) return;
            JR(k.value, G, "wrap").split(`
`).forEach((B, m) => {
                if (!B) return;
                if (m > 0 || V + N1(B) > G) {
                    if (v.length > 0) f.push({
                        content: [...v],
                        contentWidth: V
                    }), v = [], V = 0
                }
                v.push(xJ.createElement(T, {
                    key: `part-${N}-${m}`,
                    backgroundColor: h
                }, B)), V += N1(B)
            })
        }), v.length > 0) f.push({
        content: v,
        contentWidth: V
    });
    return f.map(({
        content: k,
        contentWidth: N
    }, R) => {
        let h = `${A}-${O}-${R}`,
            C = A === "add" ? z ? "diffAddedDimmed" : "diffAdded" : z ? "diffRemovedDimmed" : "diffRemoved",
            x = R === 0 ? O : void 0,
            B = (x !== void 0 ? x.toString().padStart(_) : " ".repeat(_)) + " ",
            m = B.length + Z + N,
            S = Math.max(0, K - m);
        return xJ.createElement(u, {
            key: h,
            flexDirection: "row"
        }, xJ.createElement(PJ, {
            fromLeftEdge: !0
        }, xJ.createElement(T, {
            color: Y ? "text" : void 0,
            backgroundColor: C,
            dimColor: z
        }, B, D)), xJ.createElement(T, {
            color: Y ? "text" : void 0,
            backgroundColor: C,
            dimColor: z
        }, k, " ".repeat(S)))
    })
}
// @from(Ln 364328, Col 0)
function o9Y(q, K, _, z, Y) {
    let A = Math.max(1, Math.floor(_)),
        O = l9Y(q),
        w = n9Y(O),
        $ = a9Y(w, K),
        j = Math.max(...$.map(({
            i: J
        }) => J), 0),
        H = Math.max(j.toString().length + 1, 0);
    return $.flatMap((J) => {
        let {
            type: X,
            code: M,
            i: P,
            wordDiff: W,
            matchedLine: D
        } = J;
        if (W && D) {
            let V = r9Y(J, A, H, z, Y);
            if (V !== null) return V
        }
        let Z = 2,
            G = Math.max(1, A - H - 1 - Z);
        return JR(M, G, "wrap").split(`
`).map((V, k) => {
            let N = `${X}-${P}-${k}`,
                R = k === 0 ? P : void 0,
                h = (R !== void 0 ? R.toString().padStart(H) : " ".repeat(H)) + " ",
                C = X === "add" ? "+" : X === "remove" ? "-" : " ",
                x = h.length + 1 + N1(V),
                B = Math.max(0, A - x),
                m = X === "add" ? z ? "diffAddedDimmed" : "diffAdded" : X === "remove" ? z ? "diffRemovedDimmed" : "diffRemoved" : void 0;
            return xJ.createElement(u, {
                key: N,
                flexDirection: "row"
            }, xJ.createElement(PJ, {
                fromLeftEdge: !0
            }, xJ.createElement(T, {
                color: Y ? "text" : void 0,
                backgroundColor: m,
                dimColor: z || X === "nochange"
            }, h, C)), xJ.createElement(T, {
                color: Y ? "text" : void 0,
                backgroundColor: m,
                dimColor: z
            }, V, " ".repeat(B)))
        })
    })
}
// @from(Ln 364378, Col 0)
function a9Y(q, K) {
    let _ = K,
        z = [],
        Y = [...q];
    while (Y.length > 0) {
        let A = Y.shift(),
            {
                code: O,
                type: w,
                originalCode: $,
                wordDiff: j,
                matchedLine: H
            } = A,
            J = {
                code: O,
                type: w,
                i: _,
                originalCode: $,
                wordDiff: j,
                matchedLine: H
            };
        switch (w) {
            case "nochange":
                _++, z.push(J);
                break;
            case "add":
                _++, z.push(J);
                break;
            case "remove": {
                z.push(J);
                let X = 0;
                while (Y[0]?.type === "remove") {
                    _++;
                    let M = Y.shift(),
                        {
                            code: P,
                            type: W,
                            originalCode: D,
                            wordDiff: Z,
                            matchedLine: G
                        } = M,
                        f = {
                            code: P,
                            type: W,
                            i: _,
                            originalCode: D,
                            wordDiff: Z,
                            matchedLine: G
                        };
                    z.push(f), X++
                }
                _ -= X;
                break
            }
        }
    }
    return z
}
// @from(Ln 364436, Col 4)
xJ
// @from(Ln 364436, Col 8)
d9Y = 0.4
// @from(Ln 364437, Col 4)
zPK = L(() => {
    o6();
    pK6();
    n5();
    g6();
    xJ = K6(P6(), 1)
})
// @from(Ln 364445, Col 0)
function s9Y(q) {
    return Math.max(q.oldStart + q.oldLines - 1, q.newStart + q.newLines - 1, 1).toString().length + 3
}
// @from(Ln 364449, Col 0)
function t9Y(q, K, _, z, Y, A, O, w) {
    let $ = eMK();
    if (!$) return null;
    let j = w ? s9Y(q) : 0,
        H = j > 0 && j < A ? j : 0,
        J = `${Y}|${A}|${O?1:0}|${H}|${K??""}|${_}`,
        X = YPK.get(q),
        M = X?.get(J);
    if (M) return M;
    let P = new $(q, K, _, z).render(Y, A, O);
    if (P === null) return null;
    let W = null,
        D = null;
    if (H > 0) W = P.map((G) => vf(G, 0, H)), D = P.map((G) => vf(G, H));
    let Z = {
        lines: P,
        gutterWidth: H,
        gutters: W,
        contents: D
    };
    if (!X) X = new Map, YPK.set(q, X);
    if (X.size >= 4) X.clear();
    return X.set(J, Z), Z
}
// @from(Ln 364473, Col 4)
wG
// @from(Ln 364473, Col 8)
APK
// @from(Ln 364473, Col 13)
YPK
// @from(Ln 364473, Col 18)
il
// @from(Ln 364474, Col 4)
fb6 = L(() => {
    o6();
    tE();
    g6();
    nO();
    k$6();
    xU8();
    zPK();
    wG = K6(P6(), 1), APK = K6(P6(), 1), YPK = new WeakMap;
    il = APK.memo(function(K) {
        let _ = s(26),
            {
                patch: z,
                dim: Y,
                filePath: A,
                firstLine: O,
                fileContent: w,
                width: $,
                skipHighlighting: j
            } = K,
            H = j === void 0 ? !1 : j,
            [J] = Zq(),
            M = iO().syntaxHighlightingDisabled ?? !1,
            P = Math.max(1, Math.floor($)),
            W;
        if (_[0] !== Y || _[1] !== w || _[2] !== A || _[3] !== O || _[4] !== z || _[5] !== P || _[6] !== H || _[7] !== M || _[8] !== J) {
            let k = lq();
            W = H || M ? null : t9Y(z, O, A, w ?? null, J, P, Y, k), _[0] = Y, _[1] = w, _[2] = A, _[3] = O, _[4] = z, _[5] = P, _[6] = H, _[7] = M, _[8] = J, _[9] = W
        } else W = _[9];
        let D = W;
        if (!D) {
            let k;
            if (_[10] !== Y || _[11] !== z || _[12] !== $) k = wG.createElement(u, null, wG.createElement(_PK, {
                patch: z,
                dim: Y,
                width: $
            })), _[10] = Y, _[11] = z, _[12] = $, _[13] = k;
            else k = _[13];
            return k
        }
        let {
            lines: Z,
            gutterWidth: G,
            gutters: f,
            contents: v
        } = D;
        if (G > 0 && f && v) {
            let k;
            if (_[14] !== G || _[15] !== f) k = wG.createElement(PJ, {
                fromLeftEdge: !0
            }, wG.createElement(nN6, {
                lines: f,
                width: G
            })), _[14] = G, _[15] = f, _[16] = k;
            else k = _[16];
            let N = P - G,
                R;
            if (_[17] !== v || _[18] !== N) R = wG.createElement(nN6, {
                lines: v,
                width: N
            }), _[17] = v, _[18] = N, _[19] = R;
            else R = _[19];
            let h;
            if (_[20] !== k || _[21] !== R) h = wG.createElement(u, {
                flexDirection: "row"
            }, k, R), _[20] = k, _[21] = R, _[22] = h;
            else h = _[22];
            return h
        }
        let V;
        if (_[23] !== Z || _[24] !== P) V = wG.createElement(u, null, wG.createElement(nN6, {
            lines: Z,
            width: P
        })), _[23] = Z, _[24] = P, _[25] = V;
        else V = _[25];
        return V
    })
})
// @from(Ln 364553, Col 0)
function JM6({
    hunks: q,
    dim: K,
    width: _,
    filePath: z,
    firstLine: Y,
    fileContent: A
}) {
    return L16(q.map((O) => Oe.createElement(u, {
        flexDirection: "column",
        key: O.newStart
    }, Oe.createElement(il, {
        patch: O,
        dim: K,
        width: _,
        filePath: z,
        firstLine: Y,
        fileContent: A
    }))), (O) => Oe.createElement(PJ, {
        fromLeftEdge: !0,
        key: `ellipsis-${O}`
    }, Oe.createElement(T, {
        dimColor: !0
    }, "...")))
}
// @from(Ln 364578, Col 4)
Oe
// @from(Ln 364579, Col 4)
w58 = L(() => {
    g6();
    fb6();
    Oe = K6(P6(), 1)
})
// @from(Ln 364585, Col 0)
function uU8(q) {
    let K = s(22),
        {
            filePath: _,
            structuredPatch: z,
            firstLine: Y,
            fileContent: A,
            style: O,
            verbose: w,
            previewHint: $
        } = q,
        {
            columns: j
        } = s1(),
        H = z.reduce(K_Y, 0),
        J = z.reduce(e9Y, 0),
        X;
    if (K[0] !== H) X = H > 0 ? D2.createElement(D2.Fragment, null, "Added ", D2.createElement(T, {
        bold: !0
    }, H), " ", H > 1 ? "lines" : "line") : null, K[0] = H, K[1] = X;
    else X = K[1];
    let M = H > 0 && J > 0 ? ", " : null,
        P;
    if (K[2] !== H || K[3] !== J) P = J > 0 ? D2.createElement(D2.Fragment, null, H === 0 ? "R" : "r", "emoved ", D2.createElement(T, {
        bold: !0
    }, J), " ", J > 1 ? "lines" : "line") : null, K[2] = H, K[3] = J, K[4] = P;
    else P = K[4];
    let W;
    if (K[5] !== X || K[6] !== M || K[7] !== P) W = D2.createElement(T, null, X, M, P), K[5] = X, K[6] = M, K[7] = P, K[8] = W;
    else W = K[8];
    let D = W;
    if ($) {
        if (O !== "condensed" && !w) {
            let V;
            if (K[9] !== $) V = D2.createElement(_1, null, D2.createElement(T, {
                dimColor: !0
            }, $)), K[9] = $, K[10] = V;
            else V = K[10];
            return V
        }
    } else if (O === "condensed" && !w) return D;
    let Z;
    if (K[11] !== D) Z = D2.createElement(T, null, D), K[11] = D, K[12] = Z;
    else Z = K[12];
    let G = j - 12,
        f;
    if (K[13] !== A || K[14] !== _ || K[15] !== Y || K[16] !== z || K[17] !== G) f = D2.createElement(JM6, {
        hunks: z,
        dim: !1,
        width: G,
        filePath: _,
        firstLine: Y,
        fileContent: A
    }), K[13] = A, K[14] = _, K[15] = Y, K[16] = z, K[17] = G, K[18] = f;
    else f = K[18];
    let v;
    if (K[19] !== Z || K[20] !== f) v = D2.createElement(_1, null, D2.createElement(u, {
        flexDirection: "column"
    }, Z, f)), K[19] = Z, K[20] = f, K[21] = v;
    else v = K[21];
    return v
}
// @from(Ln 364648, Col 0)
function e9Y(q, K) {
    return q + w7(K.lines, q_Y)
}
// @from(Ln 364652, Col 0)
function q_Y(q) {
    return q.startsWith("-")
}
// @from(Ln 364656, Col 0)
function K_Y(q, K) {
    return q + w7(K.lines, __Y)
}
// @from(Ln 364660, Col 0)
function __Y(q) {
    return q.startsWith("+")
}
// @from(Ln 364663, Col 4)
D2
// @from(Ln 364664, Col 4)
y47 = L(() => {
    o6();
    I4();
    g6();
    GK();
    w58();
    D2 = K6(P6(), 1)
})
// @from(Ln 364676, Col 0)
function OPK(q, K, _) {
    let z = Bu7(_, K),
        Y = XM6.get(z);
    if (Y !== void 0) return XM6.delete(z), XM6.set(z, Y), Y;
    let A = q.highlight(K, {
        language: _
    });
    if (XM6.size >= Y_Y) {
        let O = XM6.keys().next().value;
        if (O !== void 0) XM6.delete(O)
    }
    return XM6.set(z, A), A
}
// @from(Ln 364690, Col 0)
function wPK(q) {
    let K = s(20),
        {
            code: _,
            filePath: z,
            dim: Y,
            skipColoring: A
        } = q,
        O = Y === void 0 ? !1 : Y,
        w = A === void 0 ? !1 : A,
        $;
    if (K[0] !== _) $ = PU(_), K[0] = _, K[1] = $;
    else $ = K[1];
    let j = $;
    if (w) {
        let D;
        if (K[2] !== j) D = Yu.default.createElement(v5, null, j), K[2] = j, K[3] = D;
        else D = K[3];
        let Z;
        if (K[4] !== O || K[5] !== D) Z = Yu.default.createElement(T, {
            dimColor: O
        }, D), K[4] = O, K[5] = D, K[6] = Z;
        else Z = K[6];
        return Z
    }
    let H;
    if (K[7] !== z) H = z_Y(z).slice(1), K[7] = z, K[8] = H;
    else H = K[8];
    let J = H,
        X;
    if (K[9] !== j) X = Yu.default.createElement(v5, null, j), K[9] = j, K[10] = X;
    else X = K[10];
    let M;
    if (K[11] !== j || K[12] !== J) M = Yu.default.createElement(A_Y, {
        codeWithSpaces: j,
        language: J
    }), K[11] = j, K[12] = J, K[13] = M;
    else M = K[13];
    let P;
    if (K[14] !== X || K[15] !== M) P = Yu.default.createElement(Yu.Suspense, {
        fallback: X
    }, M), K[14] = X, K[15] = M, K[16] = P;
    else P = K[16];
    let W;
    if (K[17] !== O || K[18] !== P) W = Yu.default.createElement(T, {
        dimColor: O
    }, P), K[17] = O, K[18] = P, K[19] = W;
    else W = K[19];
    return W
}
// @from(Ln 364741, Col 0)
function A_Y(q) {
    let K = s(10),
        {
            codeWithSpaces: _,
            language: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = Y36(), K[0] = Y;
    else Y = K[0];
    let A = Yu.use(Y),
        O;
    if (K[1] !== _ || K[2] !== A || K[3] !== z) {
        q: {
            if (!A) {
                O = _;
                break q
            }
            let j = "markdown";
            if (z)
                if (A.supportsLanguage(z)) j = z;
                else E(`Language not supported while highlighting code, falling back to markdown: ${z}`);
            try {
                O = OPK(A, _, j)
            } catch (H) {
                let J = H;
                if (J instanceof Error && J.message.includes("Unknown language")) {
                    E(`Language not supported while highlighting code, falling back to markdown: ${J}`);
                    let X;
                    if (K[5] !== _ || K[6] !== A) X = OPK(A, _, "markdown"), K[5] = _, K[6] = A, K[7] = X;
                    else X = K[7];
                    O = X;
                    break q
                }
                O = _
            }
        }
        K[1] = _,
        K[2] = A,
        K[3] = z,
        K[4] = O
    }
    else O = K[4];
    let w = O,
        $;
    if (K[8] !== w) $ = Yu.default.createElement(v5, null, w), K[8] = w, K[9] = $;
    else $ = K[9];
    return $
}
// @from(Ln 364789, Col 4)
Yu
// @from(Ln 364789, Col 8)
Y_Y = 500
// @from(Ln 364790, Col 4)
XM6
// @from(Ln 364791, Col 4)
$PK = L(() => {
    o6();
    g6();
    fJ6();
    K8();
    eK();
    Yu = K6(P6(), 1), XM6 = new Map
})
// @from(Ln 364800, Col 0)
function w_Y(q) {
    let K = s(13),
        {
            line: _,
            gutterWidth: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) Y = vf(_, 0, z), K[0] = z, K[1] = _, K[2] = Y;
    else Y = K[2];
    let A = Y,
        O;
    if (K[3] !== z || K[4] !== _) O = vf(_, z), K[3] = z, K[4] = _, K[5] = O;
    else O = K[5];
    let w = O,
        $;
    if (K[6] !== A) $ = hj.createElement(PJ, {
        fromLeftEdge: !0
    }, hj.createElement(T, null, hj.createElement(v5, null, A))), K[6] = A, K[7] = $;
    else $ = K[7];
    let j;
    if (K[8] !== w) j = hj.createElement(T, null, hj.createElement(v5, null, w)), K[8] = w, K[9] = j;
    else j = K[9];
    let H;
    if (K[10] !== $ || K[11] !== j) H = hj.createElement(u, {
        flexDirection: "row"
    }, $, j), K[10] = $, K[11] = j, K[12] = H;
    else H = K[12];
    return H
}
// @from(Ln 364829, Col 4)
hj
// @from(Ln 364829, Col 8)
U96
// @from(Ln 364829, Col 13)
O_Y = 80
// @from(Ln 364830, Col 4)
ey
// @from(Ln 364831, Col 4)
MM6 = L(() => {
    o6();
    tE();
    g6();
    nO();
    k$6();
    $PK();
    xU8();
    hj = K6(P6(), 1), U96 = K6(P6(), 1), ey = U96.memo(function(K) {
        let _ = s(21),
            {
                code: z,
                filePath: Y,
                width: A,
                dim: O
            } = K,
            w = O === void 0 ? !1 : O,
            $ = U96.useRef(null),
            [j, H] = U96.useState(A || O_Y),
            [J] = Zq(),
            M = iO().syntaxHighlightingDisabled ?? !1,
            P;
        q: {
            if (M) {
                P = null;
                break q
            }
            let N;
            if (_[0] === Symbol.for("react.memo_cache_sentinel")) N = qPK(),
            _[0] = N;
            else N = _[0];
            let R = N;
            if (!R) {
                P = null;
                break q
            }
            let h;
            if (_[1] !== z || _[2] !== Y) h = new R(z, Y),
            _[1] = z,
            _[2] = Y,
            _[3] = h;
            else h = _[3];P = h
        }
        let W = P,
            D, Z;
        if (_[4] !== A) D = () => {
            if (!A && $.current) {
                let {
                    width: N
                } = qE6($.current);
                if (N > 0) H(N - 2)
            }
        }, Z = [A], _[4] = A, _[5] = D, _[6] = Z;
        else D = _[5], Z = _[6];
        U96.useEffect(D, Z);
        let G;
        q: {
            if (W === null) {
                G = null;
                break q
            }
            let N;
            if (_[7] !== W || _[8] !== w || _[9] !== j || _[10] !== J) N = W.render(J, j, w),
            _[7] = W,
            _[8] = w,
            _[9] = j,
            _[10] = J,
            _[11] = N;
            else N = _[11];G = N
        }
        let f = G,
            v;
        q: {
            if (!lq()) {
                v = 0;
                break q
            }
            let N = tz(z, `
`) + 1,
                R;
            if (_[12] !== N) R = N.toString(),
            _[12] = N,
            _[13] = R;
            else R = _[13];v = R.length + 2
        }
        let V = v,
            k;
        if (_[14] !== z || _[15] !== w || _[16] !== Y || _[17] !== V || _[18] !== f || _[19] !== M) k = hj.createElement(u, {
            ref: $
        }, f ? hj.createElement(u, {
            flexDirection: "column"
        }, f.map((N, R) => V > 0 ? hj.createElement(w_Y, {
            key: R,
            line: N,
            gutterWidth: V
        }) : hj.createElement(T, {
            key: R
        }, hj.createElement(v5, null, N)))) : hj.createElement(wPK, {
            code: z,
            filePath: Y,
            dim: w,
            skipColoring: M
        })), _[14] = z, _[15] = w, _[16] = Y, _[17] = V, _[18] = f, _[19] = M, _[20] = k;
        else k = _[20];
        return k
    })
})
// @from(Ln 364942, Col 0)
function Q96(q) {
    let K = s(38),
        {
            file_path: _,
            operation: z,
            patch: Y,
            firstLine: A,
            fileContent: O,
            content: w,
            style: $,
            verbose: j
        } = q,
        {
            columns: H
        } = s1(),
        J;
    if (K[0] !== z) J = Rj.createElement(T, {
        color: "subtle"
    }, "User rejected ", z, " to "), K[0] = z, K[1] = J;
    else J = K[1];
    let X;
    if (K[2] !== _ || K[3] !== j) X = j ? _ : $_Y(b8(), _), K[2] = _, K[3] = j, K[4] = X;
    else X = K[4];
    let M;
    if (K[5] !== X) M = Rj.createElement(T, {
        bold: !0,
        color: "subtle"
    }, X), K[5] = X, K[6] = M;
    else M = K[6];
    let P;
    if (K[7] !== J || K[8] !== M) P = Rj.createElement(u, {
        flexDirection: "row"
    }, J, M), K[7] = J, K[8] = M, K[9] = P;
    else P = K[9];
    let W = P;
    if ($ === "condensed" && !j) {
        let f;
        if (K[10] !== W) f = Rj.createElement(_1, null, W), K[10] = W, K[11] = f;
        else f = K[11];
        return f
    }
    if (z === "write" && w !== void 0) {
        let f, v;
        if (K[12] !== w || K[13] !== j) {
            let x = w.split(`
`);
            f = x.length - jPK, v = j ? w : x.slice(0, jPK).join(`
`), K[12] = w, K[13] = j, K[14] = f, K[15] = v
        } else f = K[14], v = K[15];
        let k = v || "(No content)",
            N = H - 12,
            R;
        if (K[16] !== _ || K[17] !== k || K[18] !== N) R = Rj.createElement(ey, {
            code: k,
            filePath: _,
            width: N,
            dim: !0
        }), K[16] = _, K[17] = k, K[18] = N, K[19] = R;
        else R = K[19];
        let h;
        if (K[20] !== f || K[21] !== j) h = !j && f > 0 && Rj.createElement(T, {
            dimColor: !0
        }, "… +", f, " lines"), K[20] = f, K[21] = j, K[22] = h;
        else h = K[22];
        let C;
        if (K[23] !== R || K[24] !== h || K[25] !== W) C = Rj.createElement(_1, null, Rj.createElement(u, {
            flexDirection: "column"
        }, W, R, h)), K[23] = R, K[24] = h, K[25] = W, K[26] = C;
        else C = K[26];
        return C
    }
    if (!Y || Y.length === 0) {
        let f;
        if (K[27] !== W) f = Rj.createElement(_1, null, W), K[27] = W, K[28] = f;
        else f = K[28];
        return f
    }
    let D = H - 12,
        Z;
    if (K[29] !== O || K[30] !== _ || K[31] !== A || K[32] !== Y || K[33] !== D) Z = Rj.createElement(JM6, {
        hunks: Y,
        dim: !0,
        width: D,
        filePath: _,
        firstLine: A,
        fileContent: O
    }), K[29] = O, K[30] = _, K[31] = A, K[32] = Y, K[33] = D, K[34] = Z;
    else Z = K[34];
    let G;
    if (K[35] !== Z || K[36] !== W) G = Rj.createElement(_1, null, Rj.createElement(u, {
        flexDirection: "column"
    }, W, Z)), K[35] = Z, K[36] = W, K[37] = G;
    else G = K[37];
    return G
}
// @from(Ln 365037, Col 4)
Rj
// @from(Ln 365037, Col 8)
jPK = 10
// @from(Ln 365038, Col 4)
L47 = L(() => {
    o6();
    I4();
    n7();
    g6();
    MM6();
    GK();
    w58();
    Rj = K6(P6(), 1)
})
// @from(Ln 365051, Col 0)
async function JPK(q, K, _ = 3) {
    let z = await $58(q);
    if (z === null) return null;
    try {
        return await R47(z, K, _)
    } finally {
        await z.close()
    }
}
// @from(Ln 365060, Col 0)
async function $58(q) {
    try {
        return await j_Y(q, "r")
    } catch (K) {
        if (t1(K)) return null;
        throw K
    }
}
// @from(Ln 365068, Col 0)
async function R47(q, K, _) {
    if (K === "") return {
        content: "",
        lineOffset: 1,
        truncated: !1
    };
    let z = Buffer.from(K, "utf8"),
        Y = 0;
    for (let J = 0; J < z.length; J++)
        if (z[J] === BU8) Y++;
    let A, O = z.length + Y - 1,
        w = Buffer.allocUnsafe(d96 + O),
        $ = 0,
        j = 0,
        H = 0;
    while ($ < mU8) {
        let {
            bytesRead: J
        } = await q.read(w, H, d96, $);
        if (J === 0) break;
        let X = H + J,
            M = HPK(w, z, X),
            P = z.length;
        if (M === -1 && Y > 0) A ??= Buffer.from(K.replaceAll(`
`, `\r
`), "utf8"), M = HPK(w, A, X), P = A.length;
        if (M !== -1) {
            let D = $ - H + M;
            return await H_Y(q, w, D, P, _, j + h47(w, 0, M))
        }
        $ += J;
        let W = Math.min(O, X);
        j += h47(w, 0, X - W), H = W, w.copyWithin(0, X - H, X)
    }
    return {
        content: "",
        lineOffset: 1,
        truncated: $ >= mU8
    }
}