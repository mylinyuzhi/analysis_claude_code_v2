
// @from(Ln 62939, Col 4)
Mu = E(() => {
    U4();
    La1();
    H1();
    SA();
    hh6();
    Ry = e1(() => {
        let A = {};
        if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
            A.cert = $1().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
                encoding: "utf8"
            }), k("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
        } catch (q) {
            k(`mTLS: Failed to load client certificate: ${q}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
            A.key = $1().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
                encoding: "utf8"
            }), k("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
        } catch (q) {
            k(`mTLS: Failed to load client key: ${q}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) A.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, k("mTLS: Using client key passphrase");
        if (Object.keys(A).length === 0) return;
        return A
    }), x41 = e1(() => {
        let A = Ry(),
            q = lS();
        if (!A && !q) return;
        let K = {
            ...A,
            ...q && {
                ca: q
            },
            keepAlive: !0
        };
        return k("mTLS: Creating HTTPS agent with custom certificates"), new upK(K)
    })
})
// @from(Ln 62982, Col 4)
xmA = x((QpK) => {
    QpK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(QpK.HttpAuthLocation || (QpK.HttpAuthLocation = {}));
    QpK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(QpK.HttpApiKeyAuthLocation || (QpK.HttpApiKeyAuthLocation = {}));
    QpK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(QpK.EndpointURLScheme || (QpK.EndpointURLScheme = {}));
    QpK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(QpK.AlgorithmId || (QpK.AlgorithmId = {}));
    var mpK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => QpK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => QpK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        BpK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        gpK = (A) => {
            return mpK(A)
        },
        FpK = (A) => {
            return BpK(A)
        };
    QpK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(QpK.FieldPosition || (QpK.FieldPosition = {}));
    var ppK = "__smithy_context";
    QpK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(QpK.IniSectionType || (QpK.IniSectionType = {}));
    QpK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(QpK.RequestHandlerProtocol || (QpK.RequestHandlerProtocol = {}));
    QpK.SMITHY_CONTEXT_KEY = ppK;
    QpK.getDefaultClientConfiguration = gpK;
    QpK.resolveDefaultRuntimeConfig = FpK
})
// @from(Ln 63047, Col 4)
gmA = x((apK) => {
    var lpK = xmA(),
        ipK = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        npK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class umA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = lpK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class mmA {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class m41 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new m41({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = rpK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return m41.clone(this)
        }
    }

    function rpK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class BmA {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function opK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    apK.Field = umA;
    apK.Fields = mmA;
    apK.HttpRequest = m41;
    apK.HttpResponse = BmA;
    apK.getHttpHandlerExtensionConfiguration = ipK;
    apK.isValidHostname = opK;
    apK.resolveHttpHandlerRuntimeConfig = npK
})
// @from(Ln 63189, Col 4)
pmA = x((wQK) => {
    var FmA = (A) => encodeURIComponent(A).replace(/[!'()*]/g, zQK),
        zQK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        _QK = (A) => A.split("/").map(FmA).join("/");
    wQK.escapeUri = FmA;
    wQK.escapeUriPath = _QK
})
// @from(Ln 63196, Col 4)
QmA = x((jQK) => {
    var xa1 = pmA();

    function HQK(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = xa1.escapeUri(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${xa1.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${xa1.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    jQK.buildQueryString = HQK
})
// @from(Ln 63215, Col 4)
uT = x((VQK) => {
    var lmA = gmA(),
        imA = QmA(),
        B41 = x6("http"),
        g41 = x6("https"),
        nmA = x6("stream"),
        ua1 = x6("http2"),
        MQK = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        rmA = (A) => {
            let q = {};
            for (let K of Object.keys(A)) {
                let Y = A[K];
                q[K] = Array.isArray(Y) ? Y.join(",") : Y
            }
            return q
        },
        ZG = {
            setTimeout: (A, q) => setTimeout(A, q),
            clearTimeout: (A) => clearTimeout(A)
        },
        UmA = 1000,
        DQK = (A, q, K = 0) => {
            if (!K) return -1;
            let Y = (z) => {
                let _ = ZG.setTimeout(() => {
                        A.destroy(), q(Object.assign(Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${K} ms.`), {
                            name: "TimeoutError"
                        }))
                    }, K - z),
                    w = (O) => {
                        if (O?.connecting) O.on("connect", () => {
                            ZG.clearTimeout(_)
                        });
                        else ZG.clearTimeout(_)
                    };
                if (A.socket) w(A.socket);
                else A.on("socket", w)
            };
            if (K < 2000) return Y(0), 0;
            return ZG.setTimeout(Y.bind(null, UmA), UmA)
        },
        XQK = (A, q, K = 0, Y, z) => {
            if (K) return ZG.setTimeout(() => {
                let _ = `@smithy/node-http-handler - [${Y?"ERROR":"WARN"}] a request has exceeded the configured ${K} ms requestTimeout.`;
                if (Y) {
                    let w = Object.assign(Error(_), {
                        name: "TimeoutError",
                        code: "ETIMEDOUT"
                    });
                    A.destroy(w), q(w)
                } else _ += " Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.", z?.warn?.(_)
            }, K);
            return -1
        },
        PQK = 3000,
        WQK = (A, {
            keepAlive: q,
            keepAliveMsecs: K
        }, Y = PQK) => {
            if (q !== !0) return -1;
            let z = () => {
                if (A.socket) A.socket.setKeepAlive(q, K || 0);
                else A.on("socket", (_) => {
                    _.setKeepAlive(q, K || 0)
                })
            };
            if (Y === 0) return z(), 0;
            return ZG.setTimeout(z, Y)
        },
        dmA = 3000,
        ZQK = (A, q, K = 0) => {
            let Y = (z) => {
                let _ = K - z,
                    w = () => {
                        A.destroy(), q(Object.assign(Error(`@smithy/node-http-handler - the request socket timed out after ${K} ms of inactivity (configured by client requestHandler).`), {
                            name: "TimeoutError"
                        }))
                    };
                if (A.socket) A.socket.setTimeout(_, w), A.on("close", () => A.socket?.removeListener("timeout", w));
                else A.setTimeout(_, w)
            };
            if (0 < K && K < 6000) return Y(0), 0;
            return ZG.setTimeout(Y.bind(null, K === 0 ? 0 : dmA), dmA)
        },
        cmA = 6000;
    async function omA(A, q, K = cmA, Y = !1) {
        let z = q.headers ?? {},
            _ = z.Expect || z.expect,
            w = -1,
            O = !0;
        if (!Y && _ === "100-continue") O = await Promise.race([new Promise(($) => {
            w = Number(ZG.setTimeout(() => $(!0), Math.max(cmA, K)))
        }), new Promise(($) => {
            A.on("continue", () => {
                ZG.clearTimeout(w), $(!0)
            }), A.on("response", () => {
                ZG.clearTimeout(w), $(!1)
            }), A.on("error", () => {
                ZG.clearTimeout(w), $(!1)
            })
        })]);
        if (O) GQK(A, q.body)
    }

    function GQK(A, q) {
        if (q instanceof nmA.Readable) {
            q.pipe(A);
            return
        }
        if (q) {
            if (Buffer.isBuffer(q) || typeof q === "string") {
                A.end(q);
                return
            }
            let K = q;
            if (typeof K === "object" && K.buffer && typeof K.byteOffset === "number" && typeof K.byteLength === "number") {
                A.end(Buffer.from(K.buffer, K.byteOffset, K.byteLength));
                return
            }
            A.end(Buffer.from(q));
            return
        }
        A.end()
    }
    var fQK = 0;
    class F41 {
        config;
        configProvider;
        socketWarningTimestamp = 0;
        externalAgent = !1;
        metadata = {
            handlerProtocol: "http/1.1"
        };
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new F41(A)
        }
        static checkSocketUsage(A, q, K = console) {
            let {
                sockets: Y,
                requests: z,
                maxSockets: _
            } = A;
            if (typeof _ !== "number" || _ === 1 / 0) return q;
            let w = 15000;
            if (Date.now() - w < q) return q;
            if (Y && z)
                for (let O in Y) {
                    let $ = Y[O]?.length ?? 0,
                        H = z[O]?.length ?? 0;
                    if ($ >= _ && H >= 2 * _) return K?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${$} and ${H} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`), Date.now()
                }
            return q
        }
        constructor(A) {
            this.configProvider = new Promise((q, K) => {
                if (typeof A === "function") A().then((Y) => {
                    q(this.resolveDefaultConfig(Y))
                }).catch(K);
                else q(this.resolveDefaultConfig(A))
            })
        }
        resolveDefaultConfig(A) {
            let {
                requestTimeout: q,
                connectionTimeout: K,
                socketTimeout: Y,
                socketAcquisitionWarningTimeout: z,
                httpAgent: _,
                httpsAgent: w,
                throwOnRequestTimeout: O
            } = A || {}, $ = !0, H = 50;
            return {
                connectionTimeout: K,
                requestTimeout: q,
                socketTimeout: Y,
                socketAcquisitionWarningTimeout: z,
                throwOnRequestTimeout: O,
                httpAgent: (() => {
                    if (_ instanceof B41.Agent || typeof _?.destroy === "function") return this.externalAgent = !0, _;
                    return new B41.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ..._
                    })
                })(),
                httpsAgent: (() => {
                    if (w instanceof g41.Agent || typeof w?.destroy === "function") return this.externalAgent = !0, w;
                    return new g41.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ...w
                    })
                })(),
                logger: console
            }
        }
        destroy() {
            this.config?.httpAgent?.destroy(), this.config?.httpsAgent?.destroy()
        }
        async handle(A, {
            abortSignal: q,
            requestTimeout: K
        } = {}) {
            if (!this.config) this.config = await this.configProvider;
            return new Promise((Y, z) => {
                let _ = this.config,
                    w = void 0,
                    O = [],
                    $ = async (L) => {
                        await w, O.forEach(ZG.clearTimeout), Y(L)
                    }, H = async (L) => {
                        await w, O.forEach(ZG.clearTimeout), z(L)
                    };
                if (q?.aborted) {
                    let L = Error("Request aborted");
                    L.name = "AbortError", H(L);
                    return
                }
                let j = A.protocol === "https:",
                    J = A.headers ?? {},
                    M = (J.Expect ?? J.expect) === "100-continue",
                    D = j ? _.httpsAgent : _.httpAgent;
                if (M && !this.externalAgent) D = new(j ? g41.Agent : B41.Agent)({
                    keepAlive: !1,
                    maxSockets: 1 / 0
                });
                O.push(ZG.setTimeout(() => {
                    this.socketWarningTimestamp = F41.checkSocketUsage(D, this.socketWarningTimestamp, _.logger)
                }, _.socketAcquisitionWarningTimeout ?? (_.requestTimeout ?? 2000) + (_.connectionTimeout ?? 1000)));
                let X = imA.buildQueryString(A.query || {}),
                    P = void 0;
                if (A.username != null || A.password != null) {
                    let L = A.username ?? "",
                        h = A.password ?? "";
                    P = `${L}:${h}`
                }
                let W = A.path;
                if (X) W += `?${X}`;
                if (A.fragment) W += `#${A.fragment}`;
                let Z = A.hostname ?? "";
                if (Z[0] === "[" && Z.endsWith("]")) Z = A.hostname.slice(1, -1);
                else Z = A.hostname;
                let G = {
                        headers: A.headers,
                        host: Z,
                        method: A.method,
                        path: W,
                        port: A.port,
                        agent: D,
                        auth: P
                    },
                    v = (j ? g41.request : B41.request)(G, (L) => {
                        let h = new lmA.HttpResponse({
                            statusCode: L.statusCode || -1,
                            reason: L.statusMessage,
                            headers: rmA(L.headers),
                            body: L
                        });
                        $({
                            response: h
                        })
                    });
                if (v.on("error", (L) => {
                        if (MQK.includes(L.code)) H(Object.assign(L, {
                            name: "TimeoutError"
                        }));
                        else H(L)
                    }), q) {
                    let L = () => {
                        v.destroy();
                        let h = Error("Request aborted");
                        h.name = "AbortError", H(h)
                    };
                    if (typeof q.addEventListener === "function") {
                        let h = q;
                        h.addEventListener("abort", L, {
                            once: !0
                        }), v.once("close", () => h.removeEventListener("abort", L))
                    } else q.onabort = L
                }
                let N = K ?? _.requestTimeout;
                O.push(DQK(v, H, _.connectionTimeout)), O.push(XQK(v, H, N, _.throwOnRequestTimeout, _.logger ?? console)), O.push(ZQK(v, H, _.socketTimeout));
                let V = G.agent;
                if (typeof V === "object" && "keepAlive" in V) O.push(WQK(v, {
                    keepAlive: V.keepAlive,
                    keepAliveMsecs: V.keepAliveMsecs
                }));
                w = omA(v, A, N, this.externalAgent).catch((L) => {
                    return O.forEach(ZG.clearTimeout), z(L)
                })
            })
        }
        updateHttpClientConfig(A, q) {
            this.config = void 0, this.configProvider = this.configProvider.then((K) => {
                return {
                    ...K,
                    [A]: q
                }
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
    }
    class amA {
        sessions = [];
        constructor(A) {
            this.sessions = A ?? []
        }
        poll() {
            if (this.sessions.length > 0) return this.sessions.shift()
        }
        offerLast(A) {
            this.sessions.push(A)
        }
        contains(A) {
            return this.sessions.includes(A)
        }
        remove(A) {
            this.sessions = this.sessions.filter((q) => q !== A)
        } [Symbol.iterator]() {
            return this.sessions[Symbol.iterator]()
        }
        destroy(A) {
            for (let q of this.sessions)
                if (q === A) {
                    if (!q.destroyed) q.destroy()
                }
        }
    }
    class smA {
        constructor(A) {
            if (this.config = A, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
        }
        config;
        sessionCache = new Map;
        lease(A, q) {
            let K = this.getUrlString(A),
                Y = this.sessionCache.get(K);
            if (Y) {
                let O = Y.poll();
                if (O && !this.config.disableConcurrency) return O
            }
            let z = ua1.connect(K);
            if (this.config.maxConcurrency) z.settings({
                maxConcurrentStreams: this.config.maxConcurrency
            }, (O) => {
                if (O) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + A.destination.toString())
            });
            z.unref();
            let _ = () => {
                z.destroy(), this.deleteSession(K, z)
            };
            if (z.on("goaway", _), z.on("error", _), z.on("frameError", _), z.on("close", () => this.deleteSession(K, z)), q.requestTimeout) z.setTimeout(q.requestTimeout, _);
            let w = this.sessionCache.get(K) || new amA;
            return w.offerLast(z), this.sessionCache.set(K, w), z
        }
        deleteSession(A, q) {
            let K = this.sessionCache.get(A);
            if (!K) return;
            if (!K.contains(q)) return;
            K.remove(q), this.sessionCache.set(A, K)
        }
        release(A, q) {
            let K = this.getUrlString(A);
            this.sessionCache.get(K)?.offerLast(q)
        }
        destroy() {
            for (let [A, q] of this.sessionCache) {
                for (let K of q) {
                    if (!K.destroyed) K.destroy();
                    q.remove(K)
                }
                this.sessionCache.delete(A)
            }
        }
        setMaxConcurrentStreams(A) {
            if (A && A <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
            this.config.maxConcurrency = A
        }
        setDisableConcurrentStreams(A) {
            this.config.disableConcurrency = A
        }
        getUrlString(A) {
            return A.destination.toString()
        }
    }
    class ma1 {
        config;
        configProvider;
        metadata = {
            handlerProtocol: "h2"
        };
        connectionManager = new smA({});
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new ma1(A)
        }
        constructor(A) {
            this.configProvider = new Promise((q, K) => {
                if (typeof A === "function") A().then((Y) => {
                    q(Y || {})
                }).catch(K);
                else q(A || {})
            })
        }
        destroy() {
            this.connectionManager.destroy()
        }
        async handle(A, {
            abortSignal: q,
            requestTimeout: K
        } = {}) {
            if (!this.config) {
                if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
            }
            let {
                requestTimeout: Y,
                disableConcurrentStreams: z
            } = this.config, _ = K ?? Y;
            return new Promise((w, O) => {
                let $ = !1,
                    H = void 0,
                    j = async (R) => {
                        await H, w(R)
                    }, J = async (R) => {
                        await H, O(R)
                    };
                if (q?.aborted) {
                    $ = !0;
                    let R = Error("Request aborted");
                    R.name = "AbortError", J(R);
                    return
                }
                let {
                    hostname: M,
                    method: D,
                    port: X,
                    protocol: P,
                    query: W
                } = A, Z = "";
                if (A.username != null || A.password != null) {
                    let R = A.username ?? "",
                        u = A.password ?? "";
                    Z = `${R}:${u}@`
                }
                let G = `${P}//${Z}${M}${X?`:${X}`:""}`,
                    f = {
                        destination: new URL(G)
                    },
                    v = this.connectionManager.lease(f, {
                        requestTimeout: this.config?.sessionTimeout,
                        disableConcurrentStreams: z || !1
                    }),
                    N = (R) => {
                        if (z) this.destroySession(v);
                        $ = !0, J(R)
                    },
                    V = imA.buildQueryString(W || {}),
                    L = A.path;
                if (V) L += `?${V}`;
                if (A.fragment) L += `#${A.fragment}`;
                let h = v.request({
                    ...A.headers,
                    [ua1.constants.HTTP2_HEADER_PATH]: L,
                    [ua1.constants.HTTP2_HEADER_METHOD]: D
                });
                if (v.ref(), h.on("response", (R) => {
                        let u = new lmA.HttpResponse({
                            statusCode: R[":status"] || -1,
                            headers: rmA(R),
                            body: h
                        });
                        if ($ = !0, j({
                                response: u
                            }), z) v.close(), this.connectionManager.deleteSession(G, v)
                    }), _) h.setTimeout(_, () => {
                    h.close();
                    let R = Error(`Stream timed out because of no activity for ${_} ms`);
                    R.name = "TimeoutError", N(R)
                });
                if (q) {
                    let R = () => {
                        h.close();
                        let u = Error("Request aborted");
                        u.name = "AbortError", N(u)
                    };
                    if (typeof q.addEventListener === "function") {
                        let u = q;
                        u.addEventListener("abort", R, {
                            once: !0
                        }), h.once("close", () => u.removeEventListener("abort", R))
                    } else q.onabort = R
                }
                h.on("frameError", (R, u, I) => {
                    N(Error(`Frame type id ${R} in stream id ${I} has failed with code ${u}.`))
                }), h.on("error", N), h.on("aborted", () => {
                    N(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${h.rstCode}.`))
                }), h.on("close", () => {
                    if (v.unref(), z) v.destroy();
                    if (!$) N(Error("Unexpected error: http2 request did not get a response"))
                }), H = omA(h, A, _)
            })
        }
        updateHttpClientConfig(A, q) {
            this.config = void 0, this.configProvider = this.configProvider.then((K) => {
                return {
                    ...K,
                    [A]: q
                }
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
        destroySession(A) {
            if (!A.destroyed) A.destroy()
        }
    }
    class tmA extends nmA.Writable {
        bufferedBytes = [];
        _write(A, q, K) {
            this.bufferedBytes.push(A), K()
        }
    }
    var TQK = (A) => {
            if (vQK(A)) return NQK(A);
            return new Promise((q, K) => {
                let Y = new tmA;
                A.pipe(Y), A.on("error", (z) => {
                    Y.end(), K(z)
                }), Y.on("error", K), Y.on("finish", function() {
                    let z = new Uint8Array(Buffer.concat(this.bufferedBytes));
                    q(z)
                })
            })
        },
        vQK = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
    async function NQK(A) {
        let q = [],
            K = A.getReader(),
            Y = !1,
            z = 0;
        while (!Y) {
            let {
                done: O,
                value: $
            } = await K.read();
            if ($) q.push($), z += $.length;
            Y = O
        }
        let _ = new Uint8Array(z),
            w = 0;
        for (let O of q) _.set(O, w), w += O.length;
        return _
    }
    VQK.DEFAULT_REQUEST_TIMEOUT = fQK;
    VQK.NodeHttp2Handler = ma1;
    VQK.NodeHttpHandler = F41;
    VQK.streamCollector = TQK
})
// @from(Ln 63779, Col 4)
mT = x((IQK) => {
    var Ba1 = {
            warningEmitted: !1
        },
        RQK = (A) => {
            if (A && !Ba1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) Ba1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function hQK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }

    function SQK(A, q, K) {
        if (!A.__aws_sdk_context) A.__aws_sdk_context = {
            features: {}
        };
        else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
        A.__aws_sdk_context.features[q] = K
    }

    function CQK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }
    IQK.emitWarningIfUnsupportedVersion = RQK;
    IQK.setCredentialFeature = hQK;
    IQK.setFeature = SQK;
    IQK.setTokenFeature = CQK;
    IQK.state = Ba1
})
// @from(Ln 63816, Col 4)
vJ = x((QQK) => {
    class qj6 extends Error {
        name = "ProviderError";
        tryNextLink;
        constructor(A, q = !0) {
            let K, Y = !0;
            if (typeof q === "boolean") K = void 0, Y = q;
            else if (q != null && typeof q === "object") K = q.logger, Y = q.tryNextLink ?? !0;
            super(A);
            this.tryNextLink = Y, Object.setPrototypeOf(this, qj6.prototype), K?.debug?.(`@smithy/property-provider ${Y?"->":"(!)"} ${A}`)
        }
        static from(A, q = !0) {
            return Object.assign(new this(A.message, q), A)
        }
    }
    class ga1 extends qj6 {
        name = "CredentialsProviderError";
        constructor(A, q = !0) {
            super(A, q);
            Object.setPrototypeOf(this, ga1.prototype)
        }
    }
    class Fa1 extends qj6 {
        name = "TokenProviderError";
        constructor(A, q = !0) {
            super(A, q);
            Object.setPrototypeOf(this, Fa1.prototype)
        }
    }
    var gQK = (...A) => async () => {
        if (A.length === 0) throw new qj6("No providers in chain");
        let q;
        for (let K of A) try {
            return await K()
        } catch (Y) {
            if (q = Y, Y?.tryNextLink) continue;
            throw Y
        }
        throw q
    }, FQK = (A) => () => Promise.resolve(A), pQK = (A, q, K) => {
        let Y, z, _, w = !1,
            O = async () => {
                if (!z) z = A();
                try {
                    Y = await z, _ = !0, w = !1
                } finally {
                    z = void 0
                }
                return Y
            };
        if (q === void 0) return async ($) => {
            if (!_ || $?.forceRefresh) Y = await O();
            return Y
        };
        return async ($) => {
            if (!_ || $?.forceRefresh) Y = await O();
            if (w) return Y;
            if (K && !K(Y)) return w = !0, Y;
            if (q(Y)) return await O(), Y;
            return Y
        }
    };
    QQK.CredentialsProviderError = ga1;
    QQK.ProviderError = qj6;
    QQK.TokenProviderError = Fa1;
    QQK.chain = gQK;
    QQK.fromStatic = FQK;
    QQK.memoize = pQK
})
// @from(Ln 63885, Col 4)
p41 = x((sQK) => {
    var rQK = mT(),
        oQK = vJ(),
        emA = "AWS_ACCESS_KEY_ID",
        ABA = "AWS_SECRET_ACCESS_KEY",
        qBA = "AWS_SESSION_TOKEN",
        KBA = "AWS_CREDENTIAL_EXPIRATION",
        YBA = "AWS_CREDENTIAL_SCOPE",
        zBA = "AWS_ACCOUNT_ID",
        aQK = (A) => async () => {
            A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
            let q = process.env[emA],
                K = process.env[ABA],
                Y = process.env[qBA],
                z = process.env[KBA],
                _ = process.env[YBA],
                w = process.env[zBA];
            if (q && K) {
                let O = {
                    accessKeyId: q,
                    secretAccessKey: K,
                    ...Y && {
                        sessionToken: Y
                    },
                    ...z && {
                        expiration: new Date(z)
                    },
                    ..._ && {
                        credentialScope: _
                    },
                    ...w && {
                        accountId: w
                    }
                };
                return rQK.setCredentialFeature(O, "CREDENTIALS_ENV_VARS", "g"), O
            }
            throw new oQK.CredentialsProviderError("Unable to find environment variable credentials.", {
                logger: A?.logger
            })
        };
    sQK.ENV_ACCOUNT_ID = zBA;
    sQK.ENV_CREDENTIAL_SCOPE = YBA;
    sQK.ENV_EXPIRATION = KBA;
    sQK.ENV_KEY = emA;
    sQK.ENV_SECRET = ABA;
    sQK.ENV_SESSION = qBA;
    sQK.fromEnv = aQK
})
// @from(Ln 63933, Col 4)
Qa1 = x((_BA) => {
    Object.defineProperty(_BA, "__esModule", {
        value: !0
    });
    _BA.getHomeDir = void 0;
    var _UK = x6("os"),
        wUK = x6("path"),
        pa1 = {},
        OUK = () => {
            if (process && process.geteuid) return `${process.geteuid()}`;
            return "DEFAULT"
        },
        $UK = () => {
            let {
                HOME: A,
                USERPROFILE: q,
                HOMEPATH: K,
                HOMEDRIVE: Y = `C:${wUK.sep}`
            } = process.env;
            if (A) return A;
            if (q) return q;
            if (K) return `${Y}${K}`;
            let z = OUK();
            if (!pa1[z]) pa1[z] = (0, _UK.homedir)();
            return pa1[z]
        };
    _BA.getHomeDir = $UK
})
// @from(Ln 63961, Col 4)
Ua1 = x((OBA) => {
    Object.defineProperty(OBA, "__esModule", {
        value: !0
    });
    OBA.getSSOTokenFilepath = void 0;
    var HUK = x6("crypto"),
        jUK = x6("path"),
        JUK = Qa1(),
        MUK = (A) => {
            let K = (0, HUK.createHash)("sha1").update(A).digest("hex");
            return (0, jUK.join)((0, JUK.getHomeDir)(), ".aws", "sso", "cache", `${K}.json`)
        };
    OBA.getSSOTokenFilepath = MUK
})
// @from(Ln 63975, Col 4)
JBA = x((HBA) => {
    Object.defineProperty(HBA, "__esModule", {
        value: !0
    });
    HBA.getSSOTokenFromFile = HBA.tokenIntercept = void 0;
    var DUK = x6("fs/promises"),
        XUK = Ua1();
    HBA.tokenIntercept = {};
    var PUK = async (A) => {
        if (HBA.tokenIntercept[A]) return HBA.tokenIntercept[A];
        let q = (0, XUK.getSSOTokenFilepath)(A),
            K = await (0, DUK.readFile)(q, "utf8");
        return JSON.parse(K)
    };
    HBA.getSSOTokenFromFile = PUK
})
// @from(Ln 63991, Col 4)
MBA = x((vUK) => {
    vUK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(vUK.HttpAuthLocation || (vUK.HttpAuthLocation = {}));
    vUK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(vUK.HttpApiKeyAuthLocation || (vUK.HttpApiKeyAuthLocation = {}));
    vUK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(vUK.EndpointURLScheme || (vUK.EndpointURLScheme = {}));
    vUK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(vUK.AlgorithmId || (vUK.AlgorithmId = {}));
    var WUK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => vUK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => vUK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        ZUK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        GUK = (A) => {
            return WUK(A)
        },
        fUK = (A) => {
            return ZUK(A)
        };
    vUK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(vUK.FieldPosition || (vUK.FieldPosition = {}));
    var TUK = "__smithy_context";
    vUK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(vUK.IniSectionType || (vUK.IniSectionType = {}));
    vUK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(vUK.RequestHandlerProtocol || (vUK.RequestHandlerProtocol = {}));
    vUK.SMITHY_CONTEXT_KEY = TUK;
    vUK.getDefaultClientConfiguration = GUK;
    vUK.resolveDefaultRuntimeConfig = fUK
})
// @from(Ln 64056, Col 4)
PBA = x((DBA) => {
    Object.defineProperty(DBA, "__esModule", {
        value: !0
    });
    DBA.readFile = DBA.fileIntercept = DBA.filePromises = void 0;
    var EUK = x6("node:fs/promises");
    DBA.filePromises = {};
    DBA.fileIntercept = {};
    var yUK = (A, q) => {
        if (DBA.fileIntercept[A] !== void 0) return DBA.fileIntercept[A];
        if (!DBA.filePromises[A] || q?.ignoreCache) DBA.filePromises[A] = (0, EUK.readFile)(A, "utf8");
        return DBA.filePromises[A]
    };
    DBA.readFile = yUK
})
// @from(Ln 64071, Col 4)
Du = x((r76) => {
    var Ih6 = Qa1(),
        WBA = Ua1(),
        sa1 = JBA(),
        U41 = x6("path"),
        d41 = MBA(),
        Kj6 = PBA(),
        GBA = "AWS_PROFILE",
        fBA = "default",
        LUK = (A) => A.profile || process.env[GBA] || fBA,
        n76 = ".",
        RUK = (A) => Object.entries(A).filter(([q]) => {
            let K = q.indexOf(n76);
            if (K === -1) return !1;
            return Object.values(d41.IniSectionType).includes(q.substring(0, K))
        }).reduce((q, [K, Y]) => {
            let z = K.indexOf(n76),
                _ = K.substring(0, z) === d41.IniSectionType.PROFILE ? K.substring(z + 1) : K;
            return q[_] = Y, q
        }, {
            ...A.default && {
                default: A.default
            }
        }),
        hUK = "AWS_CONFIG_FILE",
        TBA = () => process.env[hUK] || U41.join(Ih6.getHomeDir(), ".aws", "config"),
        SUK = "AWS_SHARED_CREDENTIALS_FILE",
        CUK = () => process.env[SUK] || U41.join(Ih6.getHomeDir(), ".aws", "credentials"),
        IUK = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/,
        bUK = ["__proto__", "profile __proto__"],
        ta1 = (A) => {
            let q = {},
                K, Y;
            for (let z of A.split(/\r?\n/)) {
                let _ = z.split(/(^|\s)[;#]/)[0].trim();
                if (_[0] === "[" && _[_.length - 1] === "]") {
                    K = void 0, Y = void 0;
                    let O = _.substring(1, _.length - 1),
                        $ = IUK.exec(O);
                    if ($) {
                        let [, H, , j] = $;
                        if (Object.values(d41.IniSectionType).includes(H)) K = [H, j].join(n76)
                    } else K = O;
                    if (bUK.includes(O)) throw Error(`Found invalid profile name "${O}"`)
                } else if (K) {
                    let O = _.indexOf("=");
                    if (![0, -1].includes(O)) {
                        let [$, H] = [_.substring(0, O).trim(), _.substring(O + 1).trim()];
                        if (H === "") Y = $;
                        else {
                            if (Y && z.trimStart() === z) Y = void 0;
                            q[K] = q[K] || {};
                            let j = Y ? [Y, $].join(n76) : $;
                            q[K][j] = H
                        }
                    }
                }
            }
            return q
        },
        ZBA = () => ({}),
        vBA = async (A = {}) => {
            let {
                filepath: q = CUK(),
                configFilepath: K = TBA()
            } = A, Y = Ih6.getHomeDir(), z = "~/", _ = q;
            if (q.startsWith("~/")) _ = U41.join(Y, q.slice(2));
            let w = K;
            if (K.startsWith("~/")) w = U41.join(Y, K.slice(2));
            let O = await Promise.all([Kj6.readFile(w, {
                ignoreCache: A.ignoreCache
            }).then(ta1).then(RUK).catch(ZBA), Kj6.readFile(_, {
                ignoreCache: A.ignoreCache
            }).then(ta1).catch(ZBA)]);
            return {
                configFile: O[0],
                credentialsFile: O[1]
            }
        }, xUK = (A) => Object.entries(A).filter(([q]) => q.startsWith(d41.IniSectionType.SSO_SESSION + n76)).reduce((q, [K, Y]) => ({
            ...q,
            [K.substring(K.indexOf(n76) + 1)]: Y
        }), {}), uUK = () => ({}), mUK = async (A = {}) => Kj6.readFile(A.configFilepath ?? TBA()).then(ta1).then(xUK).catch(uUK), BUK = (...A) => {
            let q = {};
            for (let K of A)
                for (let [Y, z] of Object.entries(K))
                    if (q[Y] !== void 0) Object.assign(q[Y], z);
                    else q[Y] = z;
            return q
        }, gUK = async (A) => {
            let q = await vBA(A);
            return BUK(q.configFile, q.credentialsFile)
        }, FUK = {
            getFileRecord() {
                return Kj6.fileIntercept
            },
            interceptFile(A, q) {
                Kj6.fileIntercept[A] = Promise.resolve(q)
            },
            getTokenRecord() {
                return sa1.tokenIntercept
            },
            interceptToken(A, q) {
                sa1.tokenIntercept[A] = q
            }
        };
    Object.defineProperty(r76, "getSSOTokenFromFile", {
        enumerable: !0,
        get: function() {
            return sa1.getSSOTokenFromFile
        }
    });
    Object.defineProperty(r76, "readFile", {
        enumerable: !0,
        get: function() {
            return Kj6.readFile
        }
    });
    r76.CONFIG_PREFIX_SEPARATOR = n76;
    r76.DEFAULT_PROFILE = fBA;
    r76.ENV_PROFILE = GBA;
    r76.externalDataInterceptor = FUK;
    r76.getProfileName = LUK;
    r76.loadSharedConfigFiles = vBA;
    r76.loadSsoSessionData = mUK;
    r76.parseKnownFiles = gUK;
    Object.keys(Ih6).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(r76, A)) Object.defineProperty(r76, A, {
            enumerable: !0,
            get: function() {
                return Ih6[A]
            }
        })
    });
    Object.keys(WBA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(r76, A)) Object.defineProperty(r76, A, {
            enumerable: !0,
            get: function() {
                return WBA[A]
            }
        })
    })
})
// @from(Ln 64213, Col 4)
BT = x((eUK) => {
    var bh6 = vJ(),
        NBA = Du();

    function VBA(A) {
        try {
            let q = new Set(Array.from(A.match(/([A-Z_]){3,}/g) ?? []));
            return q.delete("CONFIG"), q.delete("CONFIG_PREFIX_SEPARATOR"), q.delete("ENV"), [...q].join(", ")
        } catch (q) {
            return A
        }
    }
    var rUK = (A, q) => async () => {
        try {
            let K = A(process.env, q);
            if (K === void 0) throw Error();
            return K
        } catch (K) {
            throw new bh6.CredentialsProviderError(K.message || `Not found in ENV: ${VBA(A.toString())}`, {
                logger: q?.logger
            })
        }
    }, oUK = (A, {
        preferredFile: q = "config",
        ...K
    } = {}) => async () => {
        let Y = NBA.getProfileName(K),
            {
                configFile: z,
                credentialsFile: _
            } = await NBA.loadSharedConfigFiles(K),
            w = _[Y] || {},
            O = z[Y] || {},
            $ = q === "config" ? {
                ...w,
                ...O
            } : {
                ...O,
                ...w
            };
        try {
            let j = A($, q === "config" ? z : _);
            if (j === void 0) throw Error();
            return j
        } catch (H) {
            throw new bh6.CredentialsProviderError(H.message || `Not found in config files w/ profile [${Y}]: ${VBA(A.toString())}`, {
                logger: K.logger
            })
        }
    }, aUK = (A) => typeof A === "function", sUK = (A) => aUK(A) ? async () => await A(): bh6.fromStatic(A), tUK = ({
        environmentVariableSelector: A,
        configFileSelector: q,
        default: K
    }, Y = {}) => {
        let {
            signingName: z,
            logger: _
        } = Y, w = {
            signingName: z,
            logger: _
        };
        return bh6.memoize(bh6.chain(rUK(A, w), oUK(q, Y), sUK(K)))
    };
    eUK.loadConfig = tUK
})
// @from(Ln 64278, Col 4)
kBA = x((KdK) => {
    function qdK(A) {
        let q = {};
        if (A = A.replace(/^\?/, ""), A)
            for (let K of A.split("&")) {
                let [Y, z = null] = K.split("=");
                if (Y = decodeURIComponent(Y), z) z = decodeURIComponent(z);
                if (!(Y in q)) q[Y] = z;
                else if (Array.isArray(q[Y])) q[Y].push(z);
                else q[Y] = [q[Y], z]
            }
        return q
    }
    KdK.parseQueryString = qdK
})
// @from(Ln 64293, Col 4)
hy = x((_dK) => {
    var zdK = kBA(),
        EBA = (A) => {
            if (typeof A === "string") return EBA(new URL(A));
            let {
                hostname: q,
                pathname: K,
                port: Y,
                protocol: z,
                search: _
            } = A, w;
            if (_) w = zdK.parseQueryString(_);
            return {
                hostname: q,
                port: Y ? parseInt(Y) : void 0,
                protocol: z,
                path: K,
                query: w
            }
        };
    _dK.parseUrl = EBA
})
// @from(Ln 64315, Col 4)
o76 = x((udK) => {
    var Xu = vJ(),
        OdK = x6("url"),
        $dK = x6("buffer"),
        HdK = x6("http"),
        Ks1 = BT(),
        jdK = hy();

    function uh6(A) {
        return new Promise((q, K) => {
            let Y = HdK.request({
                method: "GET",
                ...A,
                hostname: A.hostname?.replace(/^\[(.+)\]$/, "$1")
            });
            Y.on("error", (z) => {
                K(Object.assign(new Xu.ProviderError("Unable to connect to instance metadata service"), z)), Y.destroy()
            }), Y.on("timeout", () => {
                K(new Xu.ProviderError("TimeoutError from instance metadata service")), Y.destroy()
            }), Y.on("response", (z) => {
                let {
                    statusCode: _ = 400
                } = z;
                if (_ < 200 || 300 <= _) K(Object.assign(new Xu.ProviderError("Error response received from instance metadata service"), {
                    statusCode: _
                })), Y.destroy();
                let w = [];
                z.on("data", (O) => {
                    w.push(O)
                }), z.on("end", () => {
                    q($dK.Buffer.concat(w)), Y.destroy()
                })
            }), Y.end()
        })
    }
    var hBA = (A) => Boolean(A) && typeof A === "object" && typeof A.AccessKeyId === "string" && typeof A.SecretAccessKey === "string" && typeof A.Token === "string" && typeof A.Expiration === "string",
        SBA = (A) => ({
            accessKeyId: A.AccessKeyId,
            secretAccessKey: A.SecretAccessKey,
            sessionToken: A.Token,
            expiration: new Date(A.Expiration),
            ...A.AccountId && {
                accountId: A.AccountId
            }
        }),
        CBA = 1000,
        IBA = 0,
        Ys1 = ({
            maxRetries: A = IBA,
            timeout: q = CBA
        }) => ({
            maxRetries: A,
            timeout: q
        }),
        As1 = (A, q) => {
            let K = A();
            for (let Y = 0; Y < q; Y++) K = K.catch(A);
            return K
        },
        c41 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        l41 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        qs1 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        JdK = (A = {}) => {
            let {
                timeout: q,
                maxRetries: K
            } = Ys1(A);
            return () => As1(async () => {
                let Y = await WdK({
                        logger: A.logger
                    }),
                    z = JSON.parse(await MdK(q, Y));
                if (!hBA(z)) throw new Xu.CredentialsProviderError("Invalid response received from instance metadata service.", {
                    logger: A.logger
                });
                return SBA(z)
            }, K)
        },
        MdK = async (A, q) => {
            if (process.env[qs1]) q.headers = {
                ...q.headers,
                Authorization: process.env[qs1]
            };
            return (await uh6({
                ...q,
                timeout: A
            })).toString()
        }, DdK = "169.254.170.2", XdK = {
            localhost: !0,
            "127.0.0.1": !0
        }, PdK = {
            "http:": !0,
            "https:": !0
        }, WdK = async ({
            logger: A
        }) => {
            if (process.env[l41]) return {
                hostname: DdK,
                path: process.env[l41]
            };
            if (process.env[c41]) {
                let q = OdK.parse(process.env[c41]);
                if (!q.hostname || !(q.hostname in XdK)) throw new Xu.CredentialsProviderError(`${q.hostname} is not a valid container metadata service hostname`, {
                    tryNextLink: !1,
                    logger: A
                });
                if (!q.protocol || !(q.protocol in PdK)) throw new Xu.CredentialsProviderError(`${q.protocol} is not a valid container metadata service protocol`, {
                    tryNextLink: !1,
                    logger: A
                });
                return {
                    ...q,
                    port: q.port ? parseInt(q.port, 10) : void 0
                }
            }
            throw new Xu.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${l41} or ${c41} environment variable is set`, {
                tryNextLink: !1,
                logger: A
            })
        };
    class zs1 extends Xu.CredentialsProviderError {
        tryNextLink;
        name = "InstanceMetadataV1FallbackError";
        constructor(A, q = !0) {
            super(A, q);
            this.tryNextLink = q, Object.setPrototypeOf(this, zs1.prototype)
        }
    }
    udK.Endpoint = void 0;
    (function(A) {
        A.IPv4 = "http://169.254.169.254", A.IPv6 = "http://[fd00:ec2::254]"
    })(udK.Endpoint || (udK.Endpoint = {}));
    var ZdK = "AWS_EC2_METADATA_SERVICE_ENDPOINT",
        GdK = "ec2_metadata_service_endpoint",
        fdK = {
            environmentVariableSelector: (A) => A[ZdK],
            configFileSelector: (A) => A[GdK],
            default: void 0
        },
        Yj6;
    (function(A) {
        A.IPv4 = "IPv4", A.IPv6 = "IPv6"
    })(Yj6 || (Yj6 = {}));
    var TdK = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE",
        vdK = "ec2_metadata_service_endpoint_mode",
        NdK = {
            environmentVariableSelector: (A) => A[TdK],
            configFileSelector: (A) => A[vdK],
            default: Yj6.IPv4
        },
        bBA = async () => jdK.parseUrl(await VdK() || await kdK()), VdK = async () => Ks1.loadConfig(fdK)(), kdK = async () => {
            let A = await Ks1.loadConfig(NdK)();
            switch (A) {
                case Yj6.IPv4:
                    return udK.Endpoint.IPv4;
                case Yj6.IPv6:
                    return udK.Endpoint.IPv6;
                default:
                    throw Error(`Unsupported endpoint mode: ${A}. Select from ${Object.values(Yj6)}`)
            }
        }, EdK = 300, ydK = 300, LdK = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html", yBA = (A, q) => {
            let K = EdK + Math.floor(Math.random() * ydK),
                Y = new Date(Date.now() + K * 1000);
            q.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(Y)}.
For more information, please visit: ` + LdK);
            let z = A.originalExpiration ?? A.expiration;
            return {
                ...A,
                ...z ? {
                    originalExpiration: z
                } : {},
                expiration: Y
            }
        }, RdK = (A, q = {}) => {
            let K = q?.logger || console,
                Y;
            return async () => {
                let z;
                try {
                    if (z = await A(), z.expiration && z.expiration.getTime() < Date.now()) z = yBA(z, K)
                } catch (_) {
                    if (Y) K.warn("Credential renew failed: ", _), z = yBA(Y, K);
                    else throw _
                }
                return Y = z, z
            }
        }, xBA = "/latest/meta-data/iam/security-credentials/", hdK = "/latest/api/token", ea1 = "AWS_EC2_METADATA_V1_DISABLED", LBA = "ec2_metadata_v1_disabled", RBA = "x-aws-ec2-metadata-token", SdK = (A = {}) => RdK(CdK(A), {
            logger: A.logger
        }), CdK = (A = {}) => {
            let q = !1,
                {
                    logger: K,
                    profile: Y
                } = A,
                {
                    timeout: z,
                    maxRetries: _
                } = Ys1(A),
                w = async (O, $) => {
                    if (q || $.headers?.[RBA] == null) {
                        let J = !1,
                            M = !1,
                            D = await Ks1.loadConfig({
                                environmentVariableSelector: (X) => {
                                    let P = X[ea1];
                                    if (M = !!P && P !== "false", P === void 0) throw new Xu.CredentialsProviderError(`${ea1} not set in env, checking config file next.`, {
                                        logger: A.logger
                                    });
                                    return M
                                },
                                configFileSelector: (X) => {
                                    let P = X[LBA];
                                    return J = !!P && P !== "false", J
                                },
                                default: !1
                            }, {
                                profile: Y
                            })();
                        if (A.ec2MetadataV1Disabled || D) {
                            let X = [];
                            if (A.ec2MetadataV1Disabled) X.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
                            if (J) X.push(`config file profile (${LBA})`);
                            if (M) X.push(`process environment variable (${ea1})`);
                            throw new zs1(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${X.join(", ")}].`)
                        }
                    }
                    let j = (await As1(async () => {
                        let J;
                        try {
                            J = await bdK($)
                        } catch (M) {
                            if (M.statusCode === 401) q = !1;
                            throw M
                        }
                        return J
                    }, O)).trim();
                    return As1(async () => {
                        let J;
                        try {
                            J = await xdK(j, $, A)
                        } catch (M) {
                            if (M.statusCode === 401) q = !1;
                            throw M
                        }
                        return J
                    }, O)
                };
            return async () => {
                let O = await bBA();
                if (q) return K?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), w(_, {
                    ...O,
                    timeout: z
                });
                else {
                    let $;
                    try {
                        $ = (await IdK({
                            ...O,
                            timeout: z
                        })).toString()
                    } catch (H) {
                        if (H?.statusCode === 400) throw Object.assign(H, {
                            message: "EC2 Metadata token request returned error"
                        });
                        else if (H.message === "TimeoutError" || [403, 404, 405].includes(H.statusCode)) q = !0;
                        return K?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), w(_, {
                            ...O,
                            timeout: z
                        })
                    }
                    return w(_, {
                        ...O,
                        headers: {
                            [RBA]: $
                        },
                        timeout: z
                    })
                }
            }
        }, IdK = async (A) => uh6({
            ...A,
            path: hdK,
            method: "PUT",
            headers: {
                "x-aws-ec2-metadata-token-ttl-seconds": "21600"
            }
        }), bdK = async (A) => (await uh6({
            ...A,
            path: xBA
        })).toString(), xdK = async (A, q, K) => {
            let Y = JSON.parse((await uh6({
                ...q,
                path: xBA + A
            })).toString());
            if (!hBA(Y)) throw new Xu.CredentialsProviderError("Invalid response received from instance metadata service.", {
                logger: K.logger
            });
            return SBA(Y)
        };
    udK.DEFAULT_MAX_RETRIES = IBA;
    udK.DEFAULT_TIMEOUT = CBA;
    udK.ENV_CMDS_AUTH_TOKEN = qs1;
    udK.ENV_CMDS_FULL_URI = c41;
    udK.ENV_CMDS_RELATIVE_URI = l41;
    udK.fromContainerMetadata = JdK;
    udK.fromInstanceMetadata = SdK;
    udK.getInstanceMetadataEndpoint = bBA;
    udK.httpRequest = uh6;
    udK.providerConfigFromInit = Ys1
})
// @from(Ln 64625, Col 4)
_2 = x((s$_, r41) => {
    var uBA, mBA, BBA, gBA, FBA, pBA, QBA, UBA, dBA, cBA, lBA, iBA, nBA, i41, _s1, rBA, oBA, aBA, zj6, sBA, tBA, eBA, AgA, qgA, KgA, YgA, zgA, _gA, n41, wgA, OgA, $gA;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof r41 === "object" && typeof s$_ === "object") A(K(q, K(s$_)));
        else A(K(q));

        function K(Y, z) {
            if (Y !== q)
                if (typeof Object.create === "function") Object.defineProperty(Y, "__esModule", {
                    value: !0
                });
                else Y.__esModule = !0;
            return function(_, w) {
                return Y[_] = z ? z(_, w) : w
            }
        }
    })(function(A) {
        var q = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(_, w) {
            _.__proto__ = w
        } || function(_, w) {
            for (var O in w)
                if (Object.prototype.hasOwnProperty.call(w, O)) _[O] = w[O]
        };
        uBA = function(_, w) {
            if (typeof w !== "function" && w !== null) throw TypeError("Class extends value " + String(w) + " is not a constructor or null");
            q(_, w);

            function O() {
                this.constructor = _
            }
            _.prototype = w === null ? Object.create(w) : (O.prototype = w.prototype, new O)
        }, mBA = Object.assign || function(_) {
            for (var w, O = 1, $ = arguments.length; O < $; O++) {
                w = arguments[O];
                for (var H in w)
                    if (Object.prototype.hasOwnProperty.call(w, H)) _[H] = w[H]
            }
            return _
        }, BBA = function(_, w) {
            var O = {};
            for (var $ in _)
                if (Object.prototype.hasOwnProperty.call(_, $) && w.indexOf($) < 0) O[$] = _[$];
            if (_ != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var H = 0, $ = Object.getOwnPropertySymbols(_); H < $.length; H++)
                    if (w.indexOf($[H]) < 0 && Object.prototype.propertyIsEnumerable.call(_, $[H])) O[$[H]] = _[$[H]]
            }
            return O
        }, gBA = function(_, w, O, $) {
            var H = arguments.length,
                j = H < 3 ? w : $ === null ? $ = Object.getOwnPropertyDescriptor(w, O) : $,
                J;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") j = Reflect.decorate(_, w, O, $);
            else
                for (var M = _.length - 1; M >= 0; M--)
                    if (J = _[M]) j = (H < 3 ? J(j) : H > 3 ? J(w, O, j) : J(w, O)) || j;
            return H > 3 && j && Object.defineProperty(w, O, j), j
        }, FBA = function(_, w) {
            return function(O, $) {
                w(O, $, _)
            }
        }, pBA = function(_, w, O, $, H, j) {
            function J(V) {
                if (V !== void 0 && typeof V !== "function") throw TypeError("Function expected");
                return V
            }
            var M = $.kind,
                D = M === "getter" ? "get" : M === "setter" ? "set" : "value",
                X = !w && _ ? $.static ? _ : _.prototype : null,
                P = w || (X ? Object.getOwnPropertyDescriptor(X, $.name) : {}),
                W, Z = !1;
            for (var G = O.length - 1; G >= 0; G--) {
                var f = {};
                for (var v in $) f[v] = v === "access" ? {} : $[v];
                for (var v in $.access) f.access[v] = $.access[v];
                f.addInitializer = function(V) {
                    if (Z) throw TypeError("Cannot add initializers after decoration has completed");
                    j.push(J(V || null))
                };
                var N = (0, O[G])(M === "accessor" ? {
                    get: P.get,
                    set: P.set
                } : P[D], f);
                if (M === "accessor") {
                    if (N === void 0) continue;
                    if (N === null || typeof N !== "object") throw TypeError("Object expected");
                    if (W = J(N.get)) P.get = W;
                    if (W = J(N.set)) P.set = W;
                    if (W = J(N.init)) H.unshift(W)
                } else if (W = J(N))
                    if (M === "field") H.unshift(W);
                    else P[D] = W
            }
            if (X) Object.defineProperty(X, $.name, P);
            Z = !0
        }, QBA = function(_, w, O) {
            var $ = arguments.length > 2;
            for (var H = 0; H < w.length; H++) O = $ ? w[H].call(_, O) : w[H].call(_);
            return $ ? O : void 0
        }, UBA = function(_) {
            return typeof _ === "symbol" ? _ : "".concat(_)
        }, dBA = function(_, w, O) {
            if (typeof w === "symbol") w = w.description ? "[".concat(w.description, "]") : "";
            return Object.defineProperty(_, "name", {
                configurable: !0,
                value: O ? "".concat(O, " ", w) : w
            })
        }, cBA = function(_, w) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(_, w)
        }, lBA = function(_, w, O, $) {
            function H(j) {
                return j instanceof O ? j : new O(function(J) {
                    J(j)
                })
            }
            return new(O || (O = Promise))(function(j, J) {
                function M(P) {
                    try {
                        X($.next(P))
                    } catch (W) {
                        J(W)
                    }
                }

                function D(P) {
                    try {
                        X($.throw(P))
                    } catch (W) {
                        J(W)
                    }
                }

                function X(P) {
                    P.done ? j(P.value) : H(P.value).then(M, D)
                }
                X(($ = $.apply(_, w || [])).next())
            })
        }, iBA = function(_, w) {
            var O = {
                    label: 0,
                    sent: function() {
                        if (j[0] & 1) throw j[1];
                        return j[1]
                    },
                    trys: [],
                    ops: []
                },
                $, H, j, J = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
            return J.next = M(0), J.throw = M(1), J.return = M(2), typeof Symbol === "function" && (J[Symbol.iterator] = function() {
                return this
            }), J;

            function M(X) {
                return function(P) {
                    return D([X, P])
                }
            }

            function D(X) {
                if ($) throw TypeError("Generator is already executing.");
                while (J && (J = 0, X[0] && (O = 0)), O) try {
                    if ($ = 1, H && (j = X[0] & 2 ? H.return : X[0] ? H.throw || ((j = H.return) && j.call(H), 0) : H.next) && !(j = j.call(H, X[1])).done) return j;
                    if (H = 0, j) X = [X[0] & 2, j.value];
                    switch (X[0]) {
                        case 0:
                        case 1:
                            j = X;
                            break;
                        case 4:
                            return O.label++, {
                                value: X[1],
                                done: !1
                            };
                        case 5:
                            O.label++, H = X[1], X = [0];
                            continue;
                        case 7:
                            X = O.ops.pop(), O.trys.pop();
                            continue;
                        default:
                            if ((j = O.trys, !(j = j.length > 0 && j[j.length - 1])) && (X[0] === 6 || X[0] === 2)) {
                                O = 0;
                                continue
                            }
                            if (X[0] === 3 && (!j || X[1] > j[0] && X[1] < j[3])) {
                                O.label = X[1];
                                break
                            }
                            if (X[0] === 6 && O.label < j[1]) {
                                O.label = j[1], j = X;
                                break
                            }
                            if (j && O.label < j[2]) {
                                O.label = j[2], O.ops.push(X);
                                break
                            }
                            if (j[2]) O.ops.pop();
                            O.trys.pop();
                            continue
                    }
                    X = w.call(_, O)
                } catch (P) {
                    X = [6, P], H = 0
                } finally {
                    $ = j = 0
                }
                if (X[0] & 5) throw X[1];
                return {
                    value: X[0] ? X[1] : void 0,
                    done: !0
                }
            }
        }, nBA = function(_, w) {
            for (var O in _)
                if (O !== "default" && !Object.prototype.hasOwnProperty.call(w, O)) n41(w, _, O)
        }, n41 = Object.create ? function(_, w, O, $) {
            if ($ === void 0) $ = O;
            var H = Object.getOwnPropertyDescriptor(w, O);
            if (!H || ("get" in H ? !w.__esModule : H.writable || H.configurable)) H = {
                enumerable: !0,
                get: function() {
                    return w[O]
                }
            };
            Object.defineProperty(_, $, H)
        } : function(_, w, O, $) {
            if ($ === void 0) $ = O;
            _[$] = w[O]
        }, i41 = function(_) {
            var w = typeof Symbol === "function" && Symbol.iterator,
                O = w && _[w],
                $ = 0;
            if (O) return O.call(_);
            if (_ && typeof _.length === "number") return {
                next: function() {
                    if (_ && $ >= _.length) _ = void 0;
                    return {
                        value: _ && _[$++],
                        done: !_
                    }
                }
            };
            throw TypeError(w ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, _s1 = function(_, w) {
            var O = typeof Symbol === "function" && _[Symbol.iterator];
            if (!O) return _;
            var $ = O.call(_),
                H, j = [],
                J;
            try {
                while ((w === void 0 || w-- > 0) && !(H = $.next()).done) j.push(H.value)
            } catch (M) {
                J = {
                    error: M
                }
            } finally {
                try {
                    if (H && !H.done && (O = $.return)) O.call($)
                } finally {
                    if (J) throw J.error
                }
            }
            return j
        }, rBA = function() {
            for (var _ = [], w = 0; w < arguments.length; w++) _ = _.concat(_s1(arguments[w]));
            return _
        }, oBA = function() {
            for (var _ = 0, w = 0, O = arguments.length; w < O; w++) _ += arguments[w].length;
            for (var $ = Array(_), H = 0, w = 0; w < O; w++)
                for (var j = arguments[w], J = 0, M = j.length; J < M; J++, H++) $[H] = j[J];
            return $
        }, aBA = function(_, w, O) {
            if (O || arguments.length === 2) {
                for (var $ = 0, H = w.length, j; $ < H; $++)
                    if (j || !($ in w)) {
                        if (!j) j = Array.prototype.slice.call(w, 0, $);
                        j[$] = w[$]
                    }
            }
            return _.concat(j || Array.prototype.slice.call(w))
        }, zj6 = function(_) {
            return this instanceof zj6 ? (this.v = _, this) : new zj6(_)
        }, sBA = function(_, w, O) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var $ = O.apply(_, w || []),
                H, j = [];
            return H = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), M("next"), M("throw"), M("return", J), H[Symbol.asyncIterator] = function() {
                return this
            }, H;

            function J(G) {
                return function(f) {
                    return Promise.resolve(f).then(G, W)
                }
            }

            function M(G, f) {
                if ($[G]) {
                    if (H[G] = function(v) {
                            return new Promise(function(N, V) {
                                j.push([G, v, N, V]) > 1 || D(G, v)
                            })
                        }, f) H[G] = f(H[G])
                }
            }

            function D(G, f) {
                try {
                    X($[G](f))
                } catch (v) {
                    Z(j[0][3], v)
                }
            }

            function X(G) {
                G.value instanceof zj6 ? Promise.resolve(G.value.v).then(P, W) : Z(j[0][2], G)
            }

            function P(G) {
                D("next", G)
            }

            function W(G) {
                D("throw", G)
            }

            function Z(G, f) {
                if (G(f), j.shift(), j.length) D(j[0][0], j[0][1])
            }
        }, tBA = function(_) {
            var w, O;
            return w = {}, $("next"), $("throw", function(H) {
                throw H
            }), $("return"), w[Symbol.iterator] = function() {
                return this
            }, w;

            function $(H, j) {
                w[H] = _[H] ? function(J) {
                    return (O = !O) ? {
                        value: zj6(_[H](J)),
                        done: !1
                    } : j ? j(J) : J
                } : j
            }
        }, eBA = function(_) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var w = _[Symbol.asyncIterator],
                O;
            return w ? w.call(_) : (_ = typeof i41 === "function" ? i41(_) : _[Symbol.iterator](), O = {}, $("next"), $("throw"), $("return"), O[Symbol.asyncIterator] = function() {
                return this
            }, O);

            function $(j) {
                O[j] = _[j] && function(J) {
                    return new Promise(function(M, D) {
                        J = _[j](J), H(M, D, J.done, J.value)
                    })
                }
            }

            function H(j, J, M, D) {
                Promise.resolve(D).then(function(X) {
                    j({
                        value: X,
                        done: M
                    })
                }, J)
            }
        }, AgA = function(_, w) {
            if (Object.defineProperty) Object.defineProperty(_, "raw", {
                value: w
            });
            else _.raw = w;
            return _
        };
        var K = Object.create ? function(_, w) {
                Object.defineProperty(_, "default", {
                    enumerable: !0,
                    value: w
                })
            } : function(_, w) {
                _.default = w
            },
            Y = function(_) {
                return Y = Object.getOwnPropertyNames || function(w) {
                    var O = [];
                    for (var $ in w)
                        if (Object.prototype.hasOwnProperty.call(w, $)) O[O.length] = $;
                    return O
                }, Y(_)
            };
        qgA = function(_) {
            if (_ && _.__esModule) return _;
            var w = {};
            if (_ != null) {
                for (var O = Y(_), $ = 0; $ < O.length; $++)
                    if (O[$] !== "default") n41(w, _, O[$])
            }
            return K(w, _), w
        }, KgA = function(_) {
            return _ && _.__esModule ? _ : {
                default: _
            }
        }, YgA = function(_, w, O, $) {
            if (O === "a" && !$) throw TypeError("Private accessor was defined without a getter");
            if (typeof w === "function" ? _ !== w || !$ : !w.has(_)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return O === "m" ? $ : O === "a" ? $.call(_) : $ ? $.value : w.get(_)
        }, zgA = function(_, w, O, $, H) {
            if ($ === "m") throw TypeError("Private method is not writable");
            if ($ === "a" && !H) throw TypeError("Private accessor was defined without a setter");
            if (typeof w === "function" ? _ !== w || !H : !w.has(_)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return $ === "a" ? H.call(_, O) : H ? H.value = O : w.set(_, O), O
        }, _gA = function(_, w) {
            if (w === null || typeof w !== "object" && typeof w !== "function") throw TypeError("Cannot use 'in' operator on non-object");
            return typeof _ === "function" ? w === _ : _.has(w)
        }, wgA = function(_, w, O) {
            if (w !== null && w !== void 0) {
                if (typeof w !== "object" && typeof w !== "function") throw TypeError("Object expected.");
                var $, H;
                if (O) {
                    if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
                    $ = w[Symbol.asyncDispose]
                }
                if ($ === void 0) {
                    if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
                    if ($ = w[Symbol.dispose], O) H = $
                }
                if (typeof $ !== "function") throw TypeError("Object not disposable.");
                if (H) $ = function() {
                    try {
                        H.call(this)
                    } catch (j) {
                        return Promise.reject(j)
                    }
                };
                _.stack.push({
                    value: w,
                    dispose: $,
                    async: O
                })
            } else if (O) _.stack.push({
                async: !0
            });
            return w
        };
        var z = typeof SuppressedError === "function" ? SuppressedError : function(_, w, O) {
            var $ = Error(O);
            return $.name = "SuppressedError", $.error = _, $.suppressed = w, $
        };
        OgA = function(_) {
            function w(j) {
                _.error = _.hasError ? new z(j, _.error, "An error was suppressed during disposal.") : j, _.hasError = !0
            }
            var O, $ = 0;

            function H() {
                while (O = _.stack.pop()) try {
                    if (!O.async && $ === 1) return $ = 0, _.stack.push(O), Promise.resolve().then(H);
                    if (O.dispose) {
                        var j = O.dispose.call(O.value);
                        if (O.async) return $ |= 2, Promise.resolve(j).then(H, function(J) {
                            return w(J), H()
                        })
                    } else $ |= 1
                } catch (J) {
                    w(J)
                }
                if ($ === 1) return _.hasError ? Promise.reject(_.error) : Promise.resolve();
                if (_.hasError) throw _.error
            }
            return H()
        }, $gA = function(_, w) {
            if (typeof _ === "string" && /^\.\.?\//.test(_)) return _.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(O, $, H, j, J) {
                return $ ? w ? ".jsx" : ".js" : H && (!j || !J) ? O : H + j + "." + J.toLowerCase() + "js"
            });
            return _
        }, A("__extends", uBA), A("__assign", mBA), A("__rest", BBA), A("__decorate", gBA), A("__param", FBA), A("__esDecorate", pBA), A("__runInitializers", QBA), A("__propKey", UBA), A("__setFunctionName", dBA), A("__metadata", cBA), A("__awaiter", lBA), A("__generator", iBA), A("__exportStar", nBA), A("__createBinding", n41), A("__values", i41), A("__read", _s1), A("__spread", rBA), A("__spreadArrays", oBA), A("__spreadArray", aBA), A("__await", zj6), A("__asyncGenerator", sBA), A("__asyncDelegator", tBA), A("__asyncValues", eBA), A("__makeTemplateObject", AgA), A("__importStar", qgA), A("__importDefault", KgA), A("__classPrivateFieldGet", YgA), A("__classPrivateFieldSet", zgA), A("__classPrivateFieldIn", _gA), A("__addDisposableResource", wgA), A("__disposeResources", OgA), A("__rewriteRelativeImportExtension", $gA)
    })
})
// @from(Ln 65111, Col 4)
JgA = x((HgA) => {
    Object.defineProperty(HgA, "__esModule", {
        value: !0
    });
    HgA.checkUrl = void 0;
    var idK = vJ(),
        ndK = "169.254.170.2",
        rdK = "169.254.170.23",
        odK = "[fd00:ec2::23]",
        adK = (A, q) => {
            if (A.protocol === "https:") return;
            if (A.hostname === ndK || A.hostname === rdK || A.hostname === odK) return;
            if (A.hostname.includes("[")) {
                if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
            } else {
                if (A.hostname === "localhost") return;
                let K = A.hostname.split("."),
                    Y = (z) => {
                        let _ = parseInt(z, 10);
                        return 0 <= _ && _ <= 255
                    };
                if (K[0] === "127" && Y(K[1]) && Y(K[2]) && Y(K[3]) && K.length === 4) return
            }
            throw new idK.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
                logger: q
            })
        };
    HgA.checkUrl = adK
})
// @from(Ln 65143, Col 4)
Ms1 = x((KcK) => {
    KcK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(KcK.HttpAuthLocation || (KcK.HttpAuthLocation = {}));
    KcK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(KcK.HttpApiKeyAuthLocation || (KcK.HttpApiKeyAuthLocation = {}));
    KcK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(KcK.EndpointURLScheme || (KcK.EndpointURLScheme = {}));
    KcK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(KcK.AlgorithmId || (KcK.AlgorithmId = {}));
    var sdK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => KcK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => KcK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        tdK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        edK = (A) => {
            return sdK(A)
        },
        AcK = (A) => {
            return tdK(A)
        };
    KcK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(KcK.FieldPosition || (KcK.FieldPosition = {}));
    var qcK = "__smithy_context";
    KcK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(KcK.IniSectionType || (KcK.IniSectionType = {}));
    KcK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(KcK.RequestHandlerProtocol || (KcK.RequestHandlerProtocol = {}));
    KcK.SMITHY_CONTEXT_KEY = qcK;
    KcK.getDefaultClientConfiguration = edK;
    KcK.resolveDefaultRuntimeConfig = AcK
})
// @from(Ln 65208, Col 4)
PgA = x((JcK) => {
    var wcK = Ms1(),
        OcK = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        $cK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class MgA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = wcK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class DgA {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class o41 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new o41({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = HcK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return o41.clone(this)
        }
    }

    function HcK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class XgA {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function jcK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    JcK.Field = MgA;
    JcK.Fields = DgA;
    JcK.HttpRequest = o41;
    JcK.HttpResponse = XgA;
    JcK.getHttpHandlerExtensionConfiguration = OcK;
    JcK.isValidHostname = jcK;
    JcK.resolveHttpHandlerRuntimeConfig = $cK
})
// @from(Ln 65350, Col 4)
Pu = x((fcK) => {
    var a76 = (A, q) => {
            let K = [];
            if (A) K.push(A);
            if (q)
                for (let Y of q) K.push(Y);
            return K
        },
        pr = (A, q) => {
            return `${A||"anonymous"}${q&&q.length>0?` (a.k.a. ${q.join(",")})`:""}`
        },
        Ds1 = () => {
            let A = [],
                q = [],
                K = !1,
                Y = new Set,
                z = (J) => J.sort((M, D) => WgA[D.step] - WgA[M.step] || ZgA[D.priority || "normal"] - ZgA[M.priority || "normal"]),
                _ = (J) => {
                    let M = !1,
                        D = (X) => {
                            let P = a76(X.name, X.aliases);
                            if (P.includes(J)) {
                                M = !0;
                                for (let W of P) Y.delete(W);
                                return !1
                            }
                            return !0
                        };
                    return A = A.filter(D), q = q.filter(D), M
                },
                w = (J) => {
                    let M = !1,
                        D = (X) => {
                            if (X.middleware === J) {
                                M = !0;
                                for (let P of a76(X.name, X.aliases)) Y.delete(P);
                                return !1
                            }
                            return !0
                        };
                    return A = A.filter(D), q = q.filter(D), M
                },
                O = (J) => {
                    return A.forEach((M) => {
                        J.add(M.middleware, {
                            ...M
                        })
                    }), q.forEach((M) => {
                        J.addRelativeTo(M.middleware, {
                            ...M
                        })
                    }), J.identifyOnResolve?.(j.identifyOnResolve()), J
                },
                $ = (J) => {
                    let M = [];
                    return J.before.forEach((D) => {
                        if (D.before.length === 0 && D.after.length === 0) M.push(D);
                        else M.push(...$(D))
                    }), M.push(J), J.after.reverse().forEach((D) => {
                        if (D.before.length === 0 && D.after.length === 0) M.push(D);
                        else M.push(...$(D))
                    }), M
                },
                H = (J = !1) => {
                    let M = [],
                        D = [],
                        X = {};
                    return A.forEach((W) => {
                        let Z = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let G of a76(Z.name, Z.aliases)) X[G] = Z;
                        M.push(Z)
                    }), q.forEach((W) => {
                        let Z = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let G of a76(Z.name, Z.aliases)) X[G] = Z;
                        D.push(Z)
                    }), D.forEach((W) => {
                        if (W.toMiddleware) {
                            let Z = X[W.toMiddleware];
                            if (Z === void 0) {
                                if (J) return;
                                throw Error(`${W.toMiddleware} is not found when adding ${pr(W.name,W.aliases)} middleware ${W.relation} ${W.toMiddleware}`)
                            }
                            if (W.relation === "after") Z.after.push(W);
                            if (W.relation === "before") Z.before.push(W)
                        }
                    }), z(M).map($).reduce((W, Z) => {
                        return W.push(...Z), W
                    }, [])
                },
                j = {
                    add: (J, M = {}) => {
                        let {
                            name: D,
                            override: X,
                            aliases: P
                        } = M, W = {
                            step: "initialize",
                            priority: "normal",
                            middleware: J,
                            ...M
                        }, Z = a76(D, P);
                        if (Z.length > 0) {
                            if (Z.some((G) => Y.has(G))) {
                                if (!X) throw Error(`Duplicate middleware name '${pr(D,P)}'`);
                                for (let G of Z) {
                                    let f = A.findIndex((N) => N.name === G || N.aliases?.some((V) => V === G));
                                    if (f === -1) continue;
                                    let v = A[f];
                                    if (v.step !== W.step || W.priority !== v.priority) throw Error(`"${pr(v.name,v.aliases)}" middleware with ${v.priority} priority in ${v.step} step cannot be overridden by "${pr(D,P)}" middleware with ${W.priority} priority in ${W.step} step.`);
                                    A.splice(f, 1)
                                }
                            }
                            for (let G of Z) Y.add(G)
                        }
                        A.push(W)
                    },
                    addRelativeTo: (J, M) => {
                        let {
                            name: D,
                            override: X,
                            aliases: P
                        } = M, W = {
                            middleware: J,
                            ...M
                        }, Z = a76(D, P);
                        if (Z.length > 0) {
                            if (Z.some((G) => Y.has(G))) {
                                if (!X) throw Error(`Duplicate middleware name '${pr(D,P)}'`);
                                for (let G of Z) {
                                    let f = q.findIndex((N) => N.name === G || N.aliases?.some((V) => V === G));
                                    if (f === -1) continue;
                                    let v = q[f];
                                    if (v.toMiddleware !== W.toMiddleware || v.relation !== W.relation) throw Error(`"${pr(v.name,v.aliases)}" middleware ${v.relation} "${v.toMiddleware}" middleware cannot be overridden by "${pr(D,P)}" middleware ${W.relation} "${W.toMiddleware}" middleware.`);
                                    q.splice(f, 1)
                                }
                            }
                            for (let G of Z) Y.add(G)
                        }
                        q.push(W)
                    },
                    clone: () => O(Ds1()),
                    use: (J) => {
                        J.applyToStack(j)
                    },
                    remove: (J) => {
                        if (typeof J === "string") return _(J);
                        else return w(J)
                    },
                    removeByTag: (J) => {
                        let M = !1,
                            D = (X) => {
                                let {
                                    tags: P,
                                    name: W,
                                    aliases: Z
                                } = X;
                                if (P && P.includes(J)) {
                                    let G = a76(W, Z);
                                    for (let f of G) Y.delete(f);
                                    return M = !0, !1
                                }
                                return !0
                            };
                        return A = A.filter(D), q = q.filter(D), M
                    },
                    concat: (J) => {
                        let M = O(Ds1());
                        return M.use(J), M.identifyOnResolve(K || M.identifyOnResolve() || (J.identifyOnResolve?.() ?? !1)), M
                    },
                    applyToStack: O,
                    identify: () => {
                        return H(!0).map((J) => {
                            let M = J.step ?? J.relation + " " + J.toMiddleware;
                            return pr(J.name, J.aliases) + " - " + M
                        })
                    },
                    identifyOnResolve(J) {
                        if (typeof J === "boolean") K = J;
                        return K
                    },
                    resolve: (J, M) => {
                        for (let D of H().map((X) => X.middleware).reverse()) J = D(J, M);
                        if (K) console.log(j.identify());
                        return J
                    }
                };
            return j
        },
        WgA = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        ZgA = {
            high: 3,
            normal: 2,
            low: 1
        };
    fcK.constructStack = Ds1
})
// @from(Ln 65560, Col 4)
GgA = x((NcK) => {
    var vcK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    NcK.isArrayBuffer = vcK
})