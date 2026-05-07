
// @from(Ln 66360, Col 4)
Qm = L(() => {
    U4();
    cQ6();
    K8();
    Yq();
    $b = P1(() => {
        let q = {};
        if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
            q.cert = V8().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
                encoding: "utf8"
            }), E("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
        } catch (K) {
            E(`mTLS: Failed to load client certificate: ${K}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
            q.key = V8().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
                encoding: "utf8"
            }), E("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
        } catch (K) {
            E(`mTLS: Failed to load client key: ${K}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) q.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, E("mTLS: Using client key passphrase");
        if (Object.keys(q).length === 0) return;
        return q
    }), XP8 = P1(() => {
        let q = $b(),
            K = Im();
        if (!q && !K) return;
        let _ = {
            ...q,
            ...K && {
                ca: K
            },
            keepAlive: !0
        };
        return E("mTLS: Creating HTTPS agent with custom certificates"), new C33(_)
    })
})
// @from(Ln 66402, Col 4)
vs7 = p((B33) => {
    B33.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(B33.HttpAuthLocation || (B33.HttpAuthLocation = {}));
    B33.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(B33.HttpApiKeyAuthLocation || (B33.HttpApiKeyAuthLocation = {}));
    B33.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(B33.EndpointURLScheme || (B33.EndpointURLScheme = {}));
    B33.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(B33.AlgorithmId || (B33.AlgorithmId = {}));
    var b33 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => B33.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => B33.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        I33 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        x33 = (q) => {
            return b33(q)
        },
        u33 = (q) => {
            return I33(q)
        };
    B33.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(B33.FieldPosition || (B33.FieldPosition = {}));
    var m33 = "__smithy_context";
    B33.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(B33.IniSectionType || (B33.IniSectionType = {}));
    B33.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(B33.RequestHandlerProtocol || (B33.RequestHandlerProtocol = {}));
    B33.SMITHY_CONTEXT_KEY = m33;
    B33.getDefaultClientConfiguration = x33;
    B33.resolveDefaultRuntimeConfig = u33
})
// @from(Ln 66467, Col 4)
Ns7 = p((n33) => {
    var U33 = vs7(),
        Q33 = (q) => {
            return {
                setHttpHandler(K) {
                    q.httpHandler = K
                },
                httpHandler() {
                    return q.httpHandler
                },
                updateHttpClientConfig(K, _) {
                    q.httpHandler?.updateHttpClientConfig(K, _)
                },
                httpHandlerConfigs() {
                    return q.httpHandler.httpHandlerConfigs()
                }
            }
        },
        d33 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class Ts7 {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = U33.FieldPosition.HEADER,
            values: _ = []
        }) {
            this.name = q, this.kind = K, this.values = _
        }
        add(q) {
            this.values.push(q)
        }
        set(q) {
            this.values = q
        }
        remove(q) {
            this.values = this.values.filter((K) => K !== q)
        }
        toString() {
            return this.values.map((q) => q.includes(",") || q.includes(" ") ? `"${q}"` : q).join(", ")
        }
        get() {
            return this.values
        }
    }
    class Vs7 {
        entries = {};
        encoding;
        constructor({
            fields: q = [],
            encoding: K = "utf-8"
        }) {
            q.forEach(this.setField.bind(this)), this.encoding = K
        }
        setField(q) {
            this.entries[q.name.toLowerCase()] = q
        }
        getField(q) {
            return this.entries[q.toLowerCase()]
        }
        removeField(q) {
            delete this.entries[q.toLowerCase()]
        }
        getByType(q) {
            return Object.values(this.entries).filter((K) => K.kind === q)
        }
    }
    class PP8 {
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
        constructor(q) {
            this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
        }
        static clone(q) {
            let K = new PP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = c33(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return PP8.clone(this)
        }
    }

    function c33(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class ks7 {
        statusCode;
        reason;
        headers;
        body;
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    }

    function l33(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    n33.Field = Ts7;
    n33.Fields = Vs7;
    n33.HttpRequest = PP8;
    n33.HttpResponse = ks7;
    n33.getHttpHandlerExtensionConfiguration = Q33;
    n33.isValidHostname = l33;
    n33.resolveHttpHandlerRuntimeConfig = d33
})
// @from(Ln 66609, Col 4)
ys7 = p((_93) => {
    var Es7 = (q) => encodeURIComponent(q).replace(/[!'()*]/g, q93),
        q93 = (q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`,
        K93 = (q) => q.split("/").map(Es7).join("/");
    _93.escapeUri = Es7;
    _93.escapeUriPath = K93
})
// @from(Ln 66616, Col 4)
WP8 = p((O93) => {
    var V$1 = ys7();

    function A93(q) {
        let K = [];
        for (let _ of Object.keys(q).sort()) {
            let z = q[_];
            if (_ = V$1.escapeUri(_), Array.isArray(z))
                for (let Y = 0, A = z.length; Y < A; Y++) K.push(`${_}=${V$1.escapeUri(z[Y])}`);
            else {
                let Y = _;
                if (z || typeof z === "string") Y += `=${V$1.escapeUri(z)}`;
                K.push(Y)
            }
        }
        return K.join("&")
    }
    O93.buildQueryString = A93
})
// @from(Ln 66635, Col 4)
wE = p((G93) => {
    var Ss7 = Ns7(),
        Cs7 = WP8(),
        DP8 = d6("http"),
        ZP8 = d6("https"),
        bs7 = d6("stream"),
        k$1 = d6("http2"),
        $93 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        Is7 = (q) => {
            let K = {};
            for (let _ of Object.keys(q)) {
                let z = q[_];
                K[_] = Array.isArray(z) ? z.join(",") : z
            }
            return K
        },
        bV = {
            setTimeout: (q, K) => setTimeout(q, K),
            clearTimeout: (q) => clearTimeout(q)
        },
        Ls7 = 1000,
        j93 = (q, K, _ = 0) => {
            if (!_) return -1;
            let z = (Y) => {
                let A = bV.setTimeout(() => {
                        q.destroy(), K(Object.assign(Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${_} ms.`), {
                            name: "TimeoutError"
                        }))
                    }, _ - Y),
                    O = (w) => {
                        if (w?.connecting) w.on("connect", () => {
                            bV.clearTimeout(A)
                        });
                        else bV.clearTimeout(A)
                    };
                if (q.socket) O(q.socket);
                else q.on("socket", O)
            };
            if (_ < 2000) return z(0), 0;
            return bV.setTimeout(z.bind(null, Ls7), Ls7)
        },
        H93 = (q, K, _ = 0, z, Y) => {
            if (_) return bV.setTimeout(() => {
                let A = `@smithy/node-http-handler - [${z?"ERROR":"WARN"}] a request has exceeded the configured ${_} ms requestTimeout.`;
                if (z) {
                    let O = Object.assign(Error(A), {
                        name: "TimeoutError",
                        code: "ETIMEDOUT"
                    });
                    q.destroy(O), K(O)
                } else A += " Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.", Y?.warn?.(A)
            }, _);
            return -1
        },
        J93 = 3000,
        X93 = (q, {
            keepAlive: K,
            keepAliveMsecs: _
        }, z = J93) => {
            if (K !== !0) return -1;
            let Y = () => {
                if (q.socket) q.socket.setKeepAlive(K, _ || 0);
                else q.on("socket", (A) => {
                    A.setKeepAlive(K, _ || 0)
                })
            };
            if (z === 0) return Y(), 0;
            return bV.setTimeout(Y, z)
        },
        hs7 = 3000,
        M93 = (q, K, _ = 0) => {
            let z = (Y) => {
                let A = _ - Y,
                    O = () => {
                        q.destroy(), K(Object.assign(Error(`@smithy/node-http-handler - the request socket timed out after ${_} ms of inactivity (configured by client requestHandler).`), {
                            name: "TimeoutError"
                        }))
                    };
                if (q.socket) q.socket.setTimeout(A, O), q.on("close", () => q.socket?.removeListener("timeout", O));
                else q.setTimeout(A, O)
            };
            if (0 < _ && _ < 6000) return z(0), 0;
            return bV.setTimeout(z.bind(null, _ === 0 ? 0 : hs7), hs7)
        },
        Rs7 = 6000;
    async function xs7(q, K, _ = Rs7, z = !1) {
        let Y = K.headers ?? {},
            A = Y.Expect || Y.expect,
            O = -1,
            w = !0;
        if (!z && A === "100-continue") w = await Promise.race([new Promise(($) => {
            O = Number(bV.setTimeout(() => $(!0), Math.max(Rs7, _)))
        }), new Promise(($) => {
            q.on("continue", () => {
                bV.clearTimeout(O), $(!0)
            }), q.on("response", () => {
                bV.clearTimeout(O), $(!1)
            }), q.on("error", () => {
                bV.clearTimeout(O), $(!1)
            })
        })]);
        if (w) P93(q, K.body)
    }

    function P93(q, K) {
        if (K instanceof bs7.Readable) {
            K.pipe(q);
            return
        }
        if (K) {
            if (Buffer.isBuffer(K) || typeof K === "string") {
                q.end(K);
                return
            }
            let _ = K;
            if (typeof _ === "object" && _.buffer && typeof _.byteOffset === "number" && typeof _.byteLength === "number") {
                q.end(Buffer.from(_.buffer, _.byteOffset, _.byteLength));
                return
            }
            q.end(Buffer.from(K));
            return
        }
        q.end()
    }
    var W93 = 0;
    class fP8 {
        config;
        configProvider;
        socketWarningTimestamp = 0;
        externalAgent = !1;
        metadata = {
            handlerProtocol: "http/1.1"
        };
        static create(q) {
            if (typeof q?.handle === "function") return q;
            return new fP8(q)
        }
        static checkSocketUsage(q, K, _ = console) {
            let {
                sockets: z,
                requests: Y,
                maxSockets: A
            } = q;
            if (typeof A !== "number" || A === 1 / 0) return K;
            let O = 15000;
            if (Date.now() - O < K) return K;
            if (z && Y)
                for (let w in z) {
                    let $ = z[w]?.length ?? 0,
                        j = Y[w]?.length ?? 0;
                    if ($ >= A && j >= 2 * A) return _?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${$} and ${j} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`), Date.now()
                }
            return K
        }
        constructor(q) {
            this.configProvider = new Promise((K, _) => {
                if (typeof q === "function") q().then((z) => {
                    K(this.resolveDefaultConfig(z))
                }).catch(_);
                else K(this.resolveDefaultConfig(q))
            })
        }
        resolveDefaultConfig(q) {
            let {
                requestTimeout: K,
                connectionTimeout: _,
                socketTimeout: z,
                socketAcquisitionWarningTimeout: Y,
                httpAgent: A,
                httpsAgent: O,
                throwOnRequestTimeout: w
            } = q || {}, $ = !0, j = 50;
            return {
                connectionTimeout: _,
                requestTimeout: K,
                socketTimeout: z,
                socketAcquisitionWarningTimeout: Y,
                throwOnRequestTimeout: w,
                httpAgent: (() => {
                    if (A instanceof DP8.Agent || typeof A?.destroy === "function") return this.externalAgent = !0, A;
                    return new DP8.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ...A
                    })
                })(),
                httpsAgent: (() => {
                    if (O instanceof ZP8.Agent || typeof O?.destroy === "function") return this.externalAgent = !0, O;
                    return new ZP8.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ...O
                    })
                })(),
                logger: console
            }
        }
        destroy() {
            this.config?.httpAgent?.destroy(), this.config?.httpsAgent?.destroy()
        }
        async handle(q, {
            abortSignal: K,
            requestTimeout: _
        } = {}) {
            if (!this.config) this.config = await this.configProvider;
            return new Promise((z, Y) => {
                let A = this.config,
                    O = void 0,
                    w = [],
                    $ = async (N) => {
                        await O, w.forEach(bV.clearTimeout), z(N)
                    }, j = async (N) => {
                        await O, w.forEach(bV.clearTimeout), Y(N)
                    };
                if (K?.aborted) {
                    let N = Error("Request aborted");
                    N.name = "AbortError", j(N);
                    return
                }
                let H = q.protocol === "https:",
                    J = q.headers ?? {},
                    X = (J.Expect ?? J.expect) === "100-continue",
                    M = H ? A.httpsAgent : A.httpAgent;
                if (X && !this.externalAgent) M = new(H ? ZP8.Agent : DP8.Agent)({
                    keepAlive: !1,
                    maxSockets: 1 / 0
                });
                w.push(bV.setTimeout(() => {
                    this.socketWarningTimestamp = fP8.checkSocketUsage(M, this.socketWarningTimestamp, A.logger)
                }, A.socketAcquisitionWarningTimeout ?? (A.requestTimeout ?? 2000) + (A.connectionTimeout ?? 1000)));
                let P = Cs7.buildQueryString(q.query || {}),
                    W = void 0;
                if (q.username != null || q.password != null) {
                    let N = q.username ?? "",
                        R = q.password ?? "";
                    W = `${N}:${R}`
                }
                let D = q.path;
                if (P) D += `?${P}`;
                if (q.fragment) D += `#${q.fragment}`;
                let Z = q.hostname ?? "";
                if (Z[0] === "[" && Z.endsWith("]")) Z = q.hostname.slice(1, -1);
                else Z = q.hostname;
                let G = {
                        headers: q.headers,
                        host: Z,
                        method: q.method,
                        path: D,
                        port: q.port,
                        agent: M,
                        auth: W
                    },
                    v = (H ? ZP8.request : DP8.request)(G, (N) => {
                        let R = new Ss7.HttpResponse({
                            statusCode: N.statusCode || -1,
                            reason: N.statusMessage,
                            headers: Is7(N.headers),
                            body: N
                        });
                        $({
                            response: R
                        })
                    });
                if (v.on("error", (N) => {
                        if ($93.includes(N.code)) j(Object.assign(N, {
                            name: "TimeoutError"
                        }));
                        else j(N)
                    }), K) {
                    let N = () => {
                        v.destroy();
                        let R = Error("Request aborted");
                        R.name = "AbortError", j(R)
                    };
                    if (typeof K.addEventListener === "function") {
                        let R = K;
                        R.addEventListener("abort", N, {
                            once: !0
                        }), v.once("close", () => R.removeEventListener("abort", N))
                    } else K.onabort = N
                }
                let V = _ ?? A.requestTimeout;
                w.push(j93(v, j, A.connectionTimeout)), w.push(H93(v, j, V, A.throwOnRequestTimeout, A.logger ?? console)), w.push(M93(v, j, A.socketTimeout));
                let k = G.agent;
                if (typeof k === "object" && "keepAlive" in k) w.push(X93(v, {
                    keepAlive: k.keepAlive,
                    keepAliveMsecs: k.keepAliveMsecs
                }));
                O = xs7(v, q, V, this.externalAgent).catch((N) => {
                    return w.forEach(bV.clearTimeout), Y(N)
                })
            })
        }
        updateHttpClientConfig(q, K) {
            this.config = void 0, this.configProvider = this.configProvider.then((_) => {
                return {
                    ..._,
                    [q]: K
                }
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
    }
    class us7 {
        sessions = [];
        constructor(q) {
            this.sessions = q ?? []
        }
        poll() {
            if (this.sessions.length > 0) return this.sessions.shift()
        }
        offerLast(q) {
            this.sessions.push(q)
        }
        contains(q) {
            return this.sessions.includes(q)
        }
        remove(q) {
            this.sessions = this.sessions.filter((K) => K !== q)
        } [Symbol.iterator]() {
            return this.sessions[Symbol.iterator]()
        }
        destroy(q) {
            for (let K of this.sessions)
                if (K === q) {
                    if (!K.destroyed) K.destroy()
                }
        }
    }
    class ms7 {
        constructor(q) {
            if (this.config = q, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
        }
        config;
        sessionCache = new Map;
        lease(q, K) {
            let _ = this.getUrlString(q),
                z = this.sessionCache.get(_);
            if (z) {
                let w = z.poll();
                if (w && !this.config.disableConcurrency) return w
            }
            let Y = k$1.connect(_);
            if (this.config.maxConcurrency) Y.settings({
                maxConcurrentStreams: this.config.maxConcurrency
            }, (w) => {
                if (w) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + q.destination.toString())
            });
            Y.unref();
            let A = () => {
                Y.destroy(), this.deleteSession(_, Y)
            };
            if (Y.on("goaway", A), Y.on("error", A), Y.on("frameError", A), Y.on("close", () => this.deleteSession(_, Y)), K.requestTimeout) Y.setTimeout(K.requestTimeout, A);
            let O = this.sessionCache.get(_) || new us7;
            return O.offerLast(Y), this.sessionCache.set(_, O), Y
        }
        deleteSession(q, K) {
            let _ = this.sessionCache.get(q);
            if (!_) return;
            if (!_.contains(K)) return;
            _.remove(K), this.sessionCache.set(q, _)
        }
        release(q, K) {
            let _ = this.getUrlString(q);
            this.sessionCache.get(_)?.offerLast(K)
        }
        destroy() {
            for (let [q, K] of this.sessionCache) {
                for (let _ of K) {
                    if (!_.destroyed) _.destroy();
                    K.remove(_)
                }
                this.sessionCache.delete(q)
            }
        }
        setMaxConcurrentStreams(q) {
            if (q && q <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
            this.config.maxConcurrency = q
        }
        setDisableConcurrentStreams(q) {
            this.config.disableConcurrency = q
        }
        getUrlString(q) {
            return q.destination.toString()
        }
    }
    class N$1 {
        config;
        configProvider;
        metadata = {
            handlerProtocol: "h2"
        };
        connectionManager = new ms7({});
        static create(q) {
            if (typeof q?.handle === "function") return q;
            return new N$1(q)
        }
        constructor(q) {
            this.configProvider = new Promise((K, _) => {
                if (typeof q === "function") q().then((z) => {
                    K(z || {})
                }).catch(_);
                else K(q || {})
            })
        }
        destroy() {
            this.connectionManager.destroy()
        }
        async handle(q, {
            abortSignal: K,
            requestTimeout: _
        } = {}) {
            if (!this.config) {
                if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
            }
            let {
                requestTimeout: z,
                disableConcurrentStreams: Y
            } = this.config, A = _ ?? z;
            return new Promise((O, w) => {
                let $ = !1,
                    j = void 0,
                    H = async (h) => {
                        await j, O(h)
                    }, J = async (h) => {
                        await j, w(h)
                    };
                if (K?.aborted) {
                    $ = !0;
                    let h = Error("Request aborted");
                    h.name = "AbortError", J(h);
                    return
                }
                let {
                    hostname: X,
                    method: M,
                    port: P,
                    protocol: W,
                    query: D
                } = q, Z = "";
                if (q.username != null || q.password != null) {
                    let h = q.username ?? "",
                        C = q.password ?? "";
                    Z = `${h}:${C}@`
                }
                let G = `${W}//${Z}${X}${P?`:${P}`:""}`,
                    f = {
                        destination: new URL(G)
                    },
                    v = this.connectionManager.lease(f, {
                        requestTimeout: this.config?.sessionTimeout,
                        disableConcurrentStreams: Y || !1
                    }),
                    V = (h) => {
                        if (Y) this.destroySession(v);
                        $ = !0, J(h)
                    },
                    k = Cs7.buildQueryString(D || {}),
                    N = q.path;
                if (k) N += `?${k}`;
                if (q.fragment) N += `#${q.fragment}`;
                let R = v.request({
                    ...q.headers,
                    [k$1.constants.HTTP2_HEADER_PATH]: N,
                    [k$1.constants.HTTP2_HEADER_METHOD]: M
                });
                if (v.ref(), R.on("response", (h) => {
                        let C = new Ss7.HttpResponse({
                            statusCode: h[":status"] || -1,
                            headers: Is7(h),
                            body: R
                        });
                        if ($ = !0, H({
                                response: C
                            }), Y) v.close(), this.connectionManager.deleteSession(G, v)
                    }), A) R.setTimeout(A, () => {
                    R.close();
                    let h = Error(`Stream timed out because of no activity for ${A} ms`);
                    h.name = "TimeoutError", V(h)
                });
                if (K) {
                    let h = () => {
                        R.close();
                        let C = Error("Request aborted");
                        C.name = "AbortError", V(C)
                    };
                    if (typeof K.addEventListener === "function") {
                        let C = K;
                        C.addEventListener("abort", h, {
                            once: !0
                        }), R.once("close", () => C.removeEventListener("abort", h))
                    } else K.onabort = h
                }
                R.on("frameError", (h, C, x) => {
                    V(Error(`Frame type id ${h} in stream id ${x} has failed with code ${C}.`))
                }), R.on("error", V), R.on("aborted", () => {
                    V(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${R.rstCode}.`))
                }), R.on("close", () => {
                    if (v.unref(), Y) v.destroy();
                    if (!$) V(Error("Unexpected error: http2 request did not get a response"))
                }), j = xs7(R, q, A)
            })
        }
        updateHttpClientConfig(q, K) {
            this.config = void 0, this.configProvider = this.configProvider.then((_) => {
                return {
                    ..._,
                    [q]: K
                }
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
        destroySession(q) {
            if (!q.destroyed) q.destroy()
        }
    }
    class Bs7 extends bs7.Writable {
        bufferedBytes = [];
        _write(q, K, _) {
            this.bufferedBytes.push(q), _()
        }
    }
    var D93 = (q) => {
            if (Z93(q)) return f93(q);
            return new Promise((K, _) => {
                let z = new Bs7;
                q.pipe(z), q.on("error", (Y) => {
                    z.end(), _(Y)
                }), z.on("error", _), z.on("finish", function() {
                    let Y = new Uint8Array(Buffer.concat(this.bufferedBytes));
                    K(Y)
                })
            })
        },
        Z93 = (q) => typeof ReadableStream === "function" && q instanceof ReadableStream;
    async function f93(q) {
        let K = [],
            _ = q.getReader(),
            z = !1,
            Y = 0;
        while (!z) {
            let {
                done: w,
                value: $
            } = await _.read();
            if ($) K.push($), Y += $.length;
            z = w
        }
        let A = new Uint8Array(Y),
            O = 0;
        for (let w of K) A.set(w, O), O += w.length;
        return A
    }
    G93.DEFAULT_REQUEST_TIMEOUT = W93;
    G93.NodeHttp2Handler = N$1;
    G93.NodeHttpHandler = fP8;
    G93.streamCollector = D93
})
// @from(Ln 67199, Col 4)
$E = p((h93) => {
    var E$1 = {
            warningEmitted: !1
        },
        N93 = (q) => {
            if (q && !E$1.warningEmitted && parseInt(q.substring(1, q.indexOf("."))) < 18) E$1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function E93(q, K, _) {
        if (!q.$source) q.$source = {};
        return q.$source[K] = _, q
    }

    function y93(q, K, _) {
        if (!q.__aws_sdk_context) q.__aws_sdk_context = {
            features: {}
        };
        else if (!q.__aws_sdk_context.features) q.__aws_sdk_context.features = {};
        q.__aws_sdk_context.features[K] = _
    }

    function L93(q, K, _) {
        if (!q.$source) q.$source = {};
        return q.$source[K] = _, q
    }
    h93.emitWarningIfUnsupportedVersion = N93;
    h93.setCredentialFeature = E93;
    h93.setFeature = y93;
    h93.setTokenFeature = L93;
    h93.state = E$1
})
// @from(Ln 67236, Col 4)
jP = p((B93) => {
    class wv6 extends Error {
        name = "ProviderError";
        tryNextLink;
        constructor(q, K = !0) {
            let _, z = !0;
            if (typeof K === "boolean") _ = void 0, z = K;
            else if (K != null && typeof K === "object") _ = K.logger, z = K.tryNextLink ?? !0;
            super(q);
            this.tryNextLink = z, Object.setPrototypeOf(this, wv6.prototype), _?.debug?.(`@smithy/property-provider ${z?"->":"(!)"} ${q}`)
        }
        static from(q, K = !0) {
            return Object.assign(new this(q.message, K), q)
        }
    }
    class y$1 extends wv6 {
        name = "CredentialsProviderError";
        constructor(q, K = !0) {
            super(q, K);
            Object.setPrototypeOf(this, y$1.prototype)
        }
    }
    class L$1 extends wv6 {
        name = "TokenProviderError";
        constructor(q, K = !0) {
            super(q, K);
            Object.setPrototypeOf(this, L$1.prototype)
        }
    }
    var x93 = (...q) => async () => {
        if (q.length === 0) throw new wv6("No providers in chain");
        let K;
        for (let _ of q) try {
            return await _()
        } catch (z) {
            if (K = z, z?.tryNextLink) continue;
            throw z
        }
        throw K
    }, u93 = (q) => () => Promise.resolve(q), m93 = (q, K, _) => {
        let z, Y, A, O = !1,
            w = async () => {
                if (!Y) Y = q();
                try {
                    z = await Y, A = !0, O = !1
                } finally {
                    Y = void 0
                }
                return z
            };
        if (K === void 0) return async ($) => {
            if (!A || $?.forceRefresh) z = await w();
            return z
        };
        return async ($) => {
            if (!A || $?.forceRefresh) z = await w();
            if (O) return z;
            if (_ && !_(z)) return O = !0, z;
            if (K(z)) return await w(), z;
            return z
        }
    };
    B93.CredentialsProviderError = y$1;
    B93.ProviderError = wv6;
    B93.TokenProviderError = L$1;
    B93.chain = x93;
    B93.fromStatic = u93;
    B93.memoize = m93
})
// @from(Ln 67305, Col 4)
GP8 = p((i93) => {
    var c93 = $E(),
        l93 = jP(),
        ps7 = "AWS_ACCESS_KEY_ID",
        Fs7 = "AWS_SECRET_ACCESS_KEY",
        gs7 = "AWS_SESSION_TOKEN",
        Us7 = "AWS_CREDENTIAL_EXPIRATION",
        Qs7 = "AWS_CREDENTIAL_SCOPE",
        ds7 = "AWS_ACCOUNT_ID",
        n93 = (q) => async () => {
            q?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
            let K = process.env[ps7],
                _ = process.env[Fs7],
                z = process.env[gs7],
                Y = process.env[Us7],
                A = process.env[Qs7],
                O = process.env[ds7];
            if (K && _) {
                let w = {
                    accessKeyId: K,
                    secretAccessKey: _,
                    ...z && {
                        sessionToken: z
                    },
                    ...Y && {
                        expiration: new Date(Y)
                    },
                    ...A && {
                        credentialScope: A
                    },
                    ...O && {
                        accountId: O
                    }
                };
                return c93.setCredentialFeature(w, "CREDENTIALS_ENV_VARS", "g"), w
            }
            throw new l93.CredentialsProviderError("Unable to find environment variable credentials.", {
                logger: q?.logger
            })
        };
    i93.ENV_ACCOUNT_ID = ds7;
    i93.ENV_CREDENTIAL_SCOPE = Qs7;
    i93.ENV_EXPIRATION = Us7;
    i93.ENV_KEY = ps7;
    i93.ENV_SECRET = Fs7;
    i93.ENV_SESSION = gs7;
    i93.fromEnv = n93
})
// @from(Ln 67353, Col 4)
R$1 = p((cs7) => {
    Object.defineProperty(cs7, "__esModule", {
        value: !0
    });
    cs7.getHomeDir = void 0;
    var K_3 = d6("os"),
        __3 = d6("path"),
        h$1 = {},
        z_3 = () => {
            if (process && process.geteuid) return `${process.geteuid()}`;
            return "DEFAULT"
        },
        Y_3 = () => {
            let {
                HOME: q,
                USERPROFILE: K,
                HOMEPATH: _,
                HOMEDRIVE: z = `C:${__3.sep}`
            } = process.env;
            if (q) return q;
            if (K) return K;
            if (_) return `${z}${_}`;
            let Y = z_3();
            if (!h$1[Y]) h$1[Y] = (0, K_3.homedir)();
            return h$1[Y]
        };
    cs7.getHomeDir = Y_3
})
// @from(Ln 67381, Col 4)
S$1 = p((ns7) => {
    Object.defineProperty(ns7, "__esModule", {
        value: !0
    });
    ns7.getSSOTokenFilepath = void 0;
    var A_3 = d6("crypto"),
        O_3 = d6("path"),
        w_3 = R$1(),
        $_3 = (q) => {
            let _ = (0, A_3.createHash)("sha1").update(q).digest("hex");
            return (0, O_3.join)((0, w_3.getHomeDir)(), ".aws", "sso", "cache", `${_}.json`)
        };
    ns7.getSSOTokenFilepath = $_3
})
// @from(Ln 67395, Col 4)
as7 = p((rs7) => {
    Object.defineProperty(rs7, "__esModule", {
        value: !0
    });
    rs7.getSSOTokenFromFile = rs7.tokenIntercept = void 0;
    var j_3 = d6("fs/promises"),
        H_3 = S$1();
    rs7.tokenIntercept = {};
    var J_3 = async (q) => {
        if (rs7.tokenIntercept[q]) return rs7.tokenIntercept[q];
        let K = (0, H_3.getSSOTokenFilepath)(q),
            _ = await (0, j_3.readFile)(K, "utf8");
        return JSON.parse(_)
    };
    rs7.getSSOTokenFromFile = J_3
})
// @from(Ln 67411, Col 4)
ss7 = p((Z_3) => {
    Z_3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Z_3.HttpAuthLocation || (Z_3.HttpAuthLocation = {}));
    Z_3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Z_3.HttpApiKeyAuthLocation || (Z_3.HttpApiKeyAuthLocation = {}));
    Z_3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(Z_3.EndpointURLScheme || (Z_3.EndpointURLScheme = {}));
    Z_3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(Z_3.AlgorithmId || (Z_3.AlgorithmId = {}));
    var X_3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => Z_3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => Z_3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        M_3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        P_3 = (q) => {
            return X_3(q)
        },
        W_3 = (q) => {
            return M_3(q)
        };
    Z_3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(Z_3.FieldPosition || (Z_3.FieldPosition = {}));
    var D_3 = "__smithy_context";
    Z_3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(Z_3.IniSectionType || (Z_3.IniSectionType = {}));
    Z_3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(Z_3.RequestHandlerProtocol || (Z_3.RequestHandlerProtocol = {}));
    Z_3.SMITHY_CONTEXT_KEY = D_3;
    Z_3.getDefaultClientConfiguration = P_3;
    Z_3.resolveDefaultRuntimeConfig = W_3
})
// @from(Ln 67476, Col 4)
qt7 = p((ts7) => {
    Object.defineProperty(ts7, "__esModule", {
        value: !0
    });
    ts7.readFile = ts7.fileIntercept = ts7.filePromises = void 0;
    var T_3 = d6("node:fs/promises");
    ts7.filePromises = {};
    ts7.fileIntercept = {};
    var V_3 = (q, K) => {
        if (ts7.fileIntercept[q] !== void 0) return ts7.fileIntercept[q];
        if (!ts7.filePromises[q] || K?.ignoreCache) ts7.filePromises[q] = (0, T_3.readFile)(q, "utf8");
        return ts7.filePromises[q]
    };
    ts7.readFile = V_3
})
// @from(Ln 67491, Col 4)
pU = p((MO6) => {
    var rd6 = R$1(),
        Kt7 = S$1(),
        F$1 = as7(),
        TP8 = d6("path"),
        VP8 = ss7(),
        $v6 = qt7(),
        zt7 = "AWS_PROFILE",
        Yt7 = "default",
        k_3 = (q) => q.profile || process.env[zt7] || Yt7,
        XO6 = ".",
        N_3 = (q) => Object.entries(q).filter(([K]) => {
            let _ = K.indexOf(XO6);
            if (_ === -1) return !1;
            return Object.values(VP8.IniSectionType).includes(K.substring(0, _))
        }).reduce((K, [_, z]) => {
            let Y = _.indexOf(XO6),
                A = _.substring(0, Y) === VP8.IniSectionType.PROFILE ? _.substring(Y + 1) : _;
            return K[A] = z, K
        }, {
            ...q.default && {
                default: q.default
            }
        }),
        E_3 = "AWS_CONFIG_FILE",
        At7 = () => process.env[E_3] || TP8.join(rd6.getHomeDir(), ".aws", "config"),
        y_3 = "AWS_SHARED_CREDENTIALS_FILE",
        L_3 = () => process.env[y_3] || TP8.join(rd6.getHomeDir(), ".aws", "credentials"),
        h_3 = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/,
        R_3 = ["__proto__", "profile __proto__"],
        g$1 = (q) => {
            let K = {},
                _, z;
            for (let Y of q.split(/\r?\n/)) {
                let A = Y.split(/(^|\s)[;#]/)[0].trim();
                if (A[0] === "[" && A[A.length - 1] === "]") {
                    _ = void 0, z = void 0;
                    let w = A.substring(1, A.length - 1),
                        $ = h_3.exec(w);
                    if ($) {
                        let [, j, , H] = $;
                        if (Object.values(VP8.IniSectionType).includes(j)) _ = [j, H].join(XO6)
                    } else _ = w;
                    if (R_3.includes(w)) throw Error(`Found invalid profile name "${w}"`)
                } else if (_) {
                    let w = A.indexOf("=");
                    if (![0, -1].includes(w)) {
                        let [$, j] = [A.substring(0, w).trim(), A.substring(w + 1).trim()];
                        if (j === "") z = $;
                        else {
                            if (z && Y.trimStart() === Y) z = void 0;
                            K[_] = K[_] || {};
                            let H = z ? [z, $].join(XO6) : $;
                            K[_][H] = j
                        }
                    }
                }
            }
            return K
        },
        _t7 = () => ({}),
        Ot7 = async (q = {}) => {
            let {
                filepath: K = L_3(),
                configFilepath: _ = At7()
            } = q, z = rd6.getHomeDir(), Y = "~/", A = K;
            if (K.startsWith("~/")) A = TP8.join(z, K.slice(2));
            let O = _;
            if (_.startsWith("~/")) O = TP8.join(z, _.slice(2));
            let w = await Promise.all([$v6.readFile(O, {
                ignoreCache: q.ignoreCache
            }).then(g$1).then(N_3).catch(_t7), $v6.readFile(A, {
                ignoreCache: q.ignoreCache
            }).then(g$1).catch(_t7)]);
            return {
                configFile: w[0],
                credentialsFile: w[1]
            }
        }, S_3 = (q) => Object.entries(q).filter(([K]) => K.startsWith(VP8.IniSectionType.SSO_SESSION + XO6)).reduce((K, [_, z]) => ({
            ...K,
            [_.substring(_.indexOf(XO6) + 1)]: z
        }), {}), C_3 = () => ({}), b_3 = async (q = {}) => $v6.readFile(q.configFilepath ?? At7()).then(g$1).then(S_3).catch(C_3), I_3 = (...q) => {
            let K = {};
            for (let _ of q)
                for (let [z, Y] of Object.entries(_))
                    if (K[z] !== void 0) Object.assign(K[z], Y);
                    else K[z] = Y;
            return K
        }, x_3 = async (q) => {
            let K = await Ot7(q);
            return I_3(K.configFile, K.credentialsFile)
        }, u_3 = {
            getFileRecord() {
                return $v6.fileIntercept
            },
            interceptFile(q, K) {
                $v6.fileIntercept[q] = Promise.resolve(K)
            },
            getTokenRecord() {
                return F$1.tokenIntercept
            },
            interceptToken(q, K) {
                F$1.tokenIntercept[q] = K
            }
        };
    Object.defineProperty(MO6, "getSSOTokenFromFile", {
        enumerable: !0,
        get: function() {
            return F$1.getSSOTokenFromFile
        }
    });
    Object.defineProperty(MO6, "readFile", {
        enumerable: !0,
        get: function() {
            return $v6.readFile
        }
    });
    MO6.CONFIG_PREFIX_SEPARATOR = XO6;
    MO6.DEFAULT_PROFILE = Yt7;
    MO6.ENV_PROFILE = zt7;
    MO6.externalDataInterceptor = u_3;
    MO6.getProfileName = k_3;
    MO6.loadSharedConfigFiles = Ot7;
    MO6.loadSsoSessionData = b_3;
    MO6.parseKnownFiles = x_3;
    Object.keys(rd6).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(MO6, q)) Object.defineProperty(MO6, q, {
            enumerable: !0,
            get: function() {
                return rd6[q]
            }
        })
    });
    Object.keys(Kt7).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(MO6, q)) Object.defineProperty(MO6, q, {
            enumerable: !0,
            get: function() {
                return Kt7[q]
            }
        })
    })
})
// @from(Ln 67633, Col 4)
jE = p((o_3) => {
    var od6 = jP(),
        wt7 = pU();

    function $t7(q) {
        try {
            let K = new Set(Array.from(q.match(/([A-Z_]){3,}/g) ?? []));
            return K.delete("CONFIG"), K.delete("CONFIG_PREFIX_SEPARATOR"), K.delete("ENV"), [...K].join(", ")
        } catch (K) {
            return q
        }
    }
    var c_3 = (q, K) => async () => {
        try {
            let _ = q(process.env, K);
            if (_ === void 0) throw Error();
            return _
        } catch (_) {
            throw new od6.CredentialsProviderError(_.message || `Not found in ENV: ${$t7(q.toString())}`, {
                logger: K?.logger
            })
        }
    }, l_3 = (q, {
        preferredFile: K = "config",
        ..._
    } = {}) => async () => {
        let z = wt7.getProfileName(_),
            {
                configFile: Y,
                credentialsFile: A
            } = await wt7.loadSharedConfigFiles(_),
            O = A[z] || {},
            w = Y[z] || {},
            $ = K === "config" ? {
                ...O,
                ...w
            } : {
                ...w,
                ...O
            };
        try {
            let H = q($, K === "config" ? Y : A);
            if (H === void 0) throw Error();
            return H
        } catch (j) {
            throw new od6.CredentialsProviderError(j.message || `Not found in config files w/ profile [${z}]: ${$t7(q.toString())}`, {
                logger: _.logger
            })
        }
    }, n_3 = (q) => typeof q === "function", i_3 = (q) => n_3(q) ? async () => await q(): od6.fromStatic(q), r_3 = ({
        environmentVariableSelector: q,
        configFileSelector: K,
        default: _
    }, z = {}) => {
        let {
            signingName: Y,
            logger: A
        } = z, O = {
            signingName: Y,
            logger: A
        };
        return od6.memoize(od6.chain(c_3(q, O), l_3(K, z), i_3(_)))
    };
    o_3.loadConfig = r_3
})
// @from(Ln 67698, Col 4)
jt7 = p((t_3) => {
    function s_3(q) {
        let K = {};
        if (q = q.replace(/^\?/, ""), q)
            for (let _ of q.split("&")) {
                let [z, Y = null] = _.split("=");
                if (z = decodeURIComponent(z), Y) Y = decodeURIComponent(Y);
                if (!(z in K)) K[z] = Y;
                else if (Array.isArray(K[z])) K[z].push(Y);
                else K[z] = [K[z], Y]
            }
        return K
    }
    t_3.parseQueryString = s_3
})
// @from(Ln 67713, Col 4)
jb = p((Kz3) => {
    var qz3 = jt7(),
        Ht7 = (q) => {
            if (typeof q === "string") return Ht7(new URL(q));
            let {
                hostname: K,
                pathname: _,
                port: z,
                protocol: Y,
                search: A
            } = q, O;
            if (A) O = qz3.parseQueryString(A);
            return {
                hostname: K,
                port: z ? parseInt(z) : void 0,
                protocol: Y,
                path: _,
                query: O
            }
        };
    Kz3.parseUrl = Ht7
})
// @from(Ln 67735, Col 4)
PO6 = p((Cz3) => {
    var FU = jP(),
        zz3 = d6("url"),
        Yz3 = d6("buffer"),
        Az3 = d6("http"),
        c$1 = jE(),
        Oz3 = jb();

    function sd6(q) {
        return new Promise((K, _) => {
            let z = Az3.request({
                method: "GET",
                ...q,
                hostname: q.hostname?.replace(/^\[(.+)\]$/, "$1")
            });
            z.on("error", (Y) => {
                _(Object.assign(new FU.ProviderError("Unable to connect to instance metadata service"), Y)), z.destroy()
            }), z.on("timeout", () => {
                _(new FU.ProviderError("TimeoutError from instance metadata service")), z.destroy()
            }), z.on("response", (Y) => {
                let {
                    statusCode: A = 400
                } = Y;
                if (A < 200 || 300 <= A) _(Object.assign(new FU.ProviderError("Error response received from instance metadata service"), {
                    statusCode: A
                })), z.destroy();
                let O = [];
                Y.on("data", (w) => {
                    O.push(w)
                }), Y.on("end", () => {
                    K(Yz3.Buffer.concat(O)), z.destroy()
                })
            }), z.end()
        })
    }
    var Pt7 = (q) => Boolean(q) && typeof q === "object" && typeof q.AccessKeyId === "string" && typeof q.SecretAccessKey === "string" && typeof q.Token === "string" && typeof q.Expiration === "string",
        Wt7 = (q) => ({
            accessKeyId: q.AccessKeyId,
            secretAccessKey: q.SecretAccessKey,
            sessionToken: q.Token,
            expiration: new Date(q.Expiration),
            ...q.AccountId && {
                accountId: q.AccountId
            }
        }),
        Dt7 = 1000,
        Zt7 = 0,
        l$1 = ({
            maxRetries: q = Zt7,
            timeout: K = Dt7
        }) => ({
            maxRetries: q,
            timeout: K
        }),
        Q$1 = (q, K) => {
            let _ = q();
            for (let z = 0; z < K; z++) _ = _.catch(q);
            return _
        },
        kP8 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        NP8 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        d$1 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        wz3 = (q = {}) => {
            let {
                timeout: K,
                maxRetries: _
            } = l$1(q);
            return () => Q$1(async () => {
                let z = await Xz3({
                        logger: q.logger
                    }),
                    Y = JSON.parse(await $z3(K, z));
                if (!Pt7(Y)) throw new FU.CredentialsProviderError("Invalid response received from instance metadata service.", {
                    logger: q.logger
                });
                return Wt7(Y)
            }, _)
        },
        $z3 = async (q, K) => {
            if (process.env[d$1]) K.headers = {
                ...K.headers,
                Authorization: process.env[d$1]
            };
            return (await sd6({
                ...K,
                timeout: q
            })).toString()
        }, jz3 = "169.254.170.2", Hz3 = {
            localhost: !0,
            "127.0.0.1": !0
        }, Jz3 = {
            "http:": !0,
            "https:": !0
        }, Xz3 = async ({
            logger: q
        }) => {
            if (process.env[NP8]) return {
                hostname: jz3,
                path: process.env[NP8]
            };
            if (process.env[kP8]) {
                let K = zz3.parse(process.env[kP8]);
                if (!K.hostname || !(K.hostname in Hz3)) throw new FU.CredentialsProviderError(`${K.hostname} is not a valid container metadata service hostname`, {
                    tryNextLink: !1,
                    logger: q
                });
                if (!K.protocol || !(K.protocol in Jz3)) throw new FU.CredentialsProviderError(`${K.protocol} is not a valid container metadata service protocol`, {
                    tryNextLink: !1,
                    logger: q
                });
                return {
                    ...K,
                    port: K.port ? parseInt(K.port, 10) : void 0
                }
            }
            throw new FU.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${NP8} or ${kP8} environment variable is set`, {
                tryNextLink: !1,
                logger: q
            })
        };
    class n$1 extends FU.CredentialsProviderError {
        tryNextLink;
        name = "InstanceMetadataV1FallbackError";
        constructor(q, K = !0) {
            super(q, K);
            this.tryNextLink = K, Object.setPrototypeOf(this, n$1.prototype)
        }
    }
    Cz3.Endpoint = void 0;
    (function(q) {
        q.IPv4 = "http://169.254.169.254", q.IPv6 = "http://[fd00:ec2::254]"
    })(Cz3.Endpoint || (Cz3.Endpoint = {}));
    var Mz3 = "AWS_EC2_METADATA_SERVICE_ENDPOINT",
        Pz3 = "ec2_metadata_service_endpoint",
        Wz3 = {
            environmentVariableSelector: (q) => q[Mz3],
            configFileSelector: (q) => q[Pz3],
            default: void 0
        },
        jv6;
    (function(q) {
        q.IPv4 = "IPv4", q.IPv6 = "IPv6"
    })(jv6 || (jv6 = {}));
    var Dz3 = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE",
        Zz3 = "ec2_metadata_service_endpoint_mode",
        fz3 = {
            environmentVariableSelector: (q) => q[Dz3],
            configFileSelector: (q) => q[Zz3],
            default: jv6.IPv4
        },
        ft7 = async () => Oz3.parseUrl(await Gz3() || await vz3()), Gz3 = async () => c$1.loadConfig(Wz3)(), vz3 = async () => {
            let q = await c$1.loadConfig(fz3)();
            switch (q) {
                case jv6.IPv4:
                    return Cz3.Endpoint.IPv4;
                case jv6.IPv6:
                    return Cz3.Endpoint.IPv6;
                default:
                    throw Error(`Unsupported endpoint mode: ${q}. Select from ${Object.values(jv6)}`)
            }
        }, Tz3 = 300, Vz3 = 300, kz3 = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html", Jt7 = (q, K) => {
            let _ = Tz3 + Math.floor(Math.random() * Vz3),
                z = new Date(Date.now() + _ * 1000);
            K.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(z)}.
For more information, please visit: ` + kz3);
            let Y = q.originalExpiration ?? q.expiration;
            return {
                ...q,
                ...Y ? {
                    originalExpiration: Y
                } : {},
                expiration: z
            }
        }, Nz3 = (q, K = {}) => {
            let _ = K?.logger || console,
                z;
            return async () => {
                let Y;
                try {
                    if (Y = await q(), Y.expiration && Y.expiration.getTime() < Date.now()) Y = Jt7(Y, _)
                } catch (A) {
                    if (z) _.warn("Credential renew failed: ", A), Y = Jt7(z, _);
                    else throw A
                }
                return z = Y, Y
            }
        }, Gt7 = "/latest/meta-data/iam/security-credentials/", Ez3 = "/latest/api/token", U$1 = "AWS_EC2_METADATA_V1_DISABLED", Xt7 = "ec2_metadata_v1_disabled", Mt7 = "x-aws-ec2-metadata-token", yz3 = (q = {}) => Nz3(Lz3(q), {
            logger: q.logger
        }), Lz3 = (q = {}) => {
            let K = !1,
                {
                    logger: _,
                    profile: z
                } = q,
                {
                    timeout: Y,
                    maxRetries: A
                } = l$1(q),
                O = async (w, $) => {
                    if (K || $.headers?.[Mt7] == null) {
                        let J = !1,
                            X = !1,
                            M = await c$1.loadConfig({
                                environmentVariableSelector: (P) => {
                                    let W = P[U$1];
                                    if (X = !!W && W !== "false", W === void 0) throw new FU.CredentialsProviderError(`${U$1} not set in env, checking config file next.`, {
                                        logger: q.logger
                                    });
                                    return X
                                },
                                configFileSelector: (P) => {
                                    let W = P[Xt7];
                                    return J = !!W && W !== "false", J
                                },
                                default: !1
                            }, {
                                profile: z
                            })();
                        if (q.ec2MetadataV1Disabled || M) {
                            let P = [];
                            if (q.ec2MetadataV1Disabled) P.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
                            if (J) P.push(`config file profile (${Xt7})`);
                            if (X) P.push(`process environment variable (${U$1})`);
                            throw new n$1(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${P.join(", ")}].`)
                        }
                    }
                    let H = (await Q$1(async () => {
                        let J;
                        try {
                            J = await Rz3($)
                        } catch (X) {
                            if (X.statusCode === 401) K = !1;
                            throw X
                        }
                        return J
                    }, w)).trim();
                    return Q$1(async () => {
                        let J;
                        try {
                            J = await Sz3(H, $, q)
                        } catch (X) {
                            if (X.statusCode === 401) K = !1;
                            throw X
                        }
                        return J
                    }, w)
                };
            return async () => {
                let w = await ft7();
                if (K) return _?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), O(A, {
                    ...w,
                    timeout: Y
                });
                else {
                    let $;
                    try {
                        $ = (await hz3({
                            ...w,
                            timeout: Y
                        })).toString()
                    } catch (j) {
                        if (j?.statusCode === 400) throw Object.assign(j, {
                            message: "EC2 Metadata token request returned error"
                        });
                        else if (j.message === "TimeoutError" || [403, 404, 405].includes(j.statusCode)) K = !0;
                        return _?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), O(A, {
                            ...w,
                            timeout: Y
                        })
                    }
                    return O(A, {
                        ...w,
                        headers: {
                            [Mt7]: $
                        },
                        timeout: Y
                    })
                }
            }
        }, hz3 = async (q) => sd6({
            ...q,
            path: Ez3,
            method: "PUT",
            headers: {
                "x-aws-ec2-metadata-token-ttl-seconds": "21600"
            }
        }), Rz3 = async (q) => (await sd6({
            ...q,
            path: Gt7
        })).toString(), Sz3 = async (q, K, _) => {
            let z = JSON.parse((await sd6({
                ...K,
                path: Gt7 + q
            })).toString());
            if (!Pt7(z)) throw new FU.CredentialsProviderError("Invalid response received from instance metadata service.", {
                logger: _.logger
            });
            return Wt7(z)
        };
    Cz3.DEFAULT_MAX_RETRIES = Zt7;
    Cz3.DEFAULT_TIMEOUT = Dt7;
    Cz3.ENV_CMDS_AUTH_TOKEN = d$1;
    Cz3.ENV_CMDS_FULL_URI = kP8;
    Cz3.ENV_CMDS_RELATIVE_URI = NP8;
    Cz3.fromContainerMetadata = wz3;
    Cz3.fromInstanceMetadata = yz3;
    Cz3.getInstanceMetadataEndpoint = ft7;
    Cz3.httpRequest = sd6;
    Cz3.providerConfigFromInit = l$1
})
// @from(Ln 68045, Col 4)
IV = p((rzO, LP8) => {
    var vt7, Tt7, Vt7, kt7, Nt7, Et7, yt7, Lt7, ht7, Rt7, St7, Ct7, bt7, EP8, i$1, It7, xt7, ut7, Hv6, mt7, Bt7, pt7, Ft7, gt7, Ut7, Qt7, dt7, ct7, yP8, lt7, nt7, it7;
    (function(q) {
        var K = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(z) {
            q(_(K, _(z)))
        });
        else if (typeof LP8 === "object" && typeof rzO === "object") q(_(K, _(rzO)));
        else q(_(K));

        function _(z, Y) {
            if (z !== K)
                if (typeof Object.create === "function") Object.defineProperty(z, "__esModule", {
                    value: !0
                });
                else z.__esModule = !0;
            return function(A, O) {
                return z[A] = Y ? Y(A, O) : O
            }
        }
    })(function(q) {
        var K = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(A, O) {
            A.__proto__ = O
        } || function(A, O) {
            for (var w in O)
                if (Object.prototype.hasOwnProperty.call(O, w)) A[w] = O[w]
        };
        vt7 = function(A, O) {
            if (typeof O !== "function" && O !== null) throw TypeError("Class extends value " + String(O) + " is not a constructor or null");
            K(A, O);

            function w() {
                this.constructor = A
            }
            A.prototype = O === null ? Object.create(O) : (w.prototype = O.prototype, new w)
        }, Tt7 = Object.assign || function(A) {
            for (var O, w = 1, $ = arguments.length; w < $; w++) {
                O = arguments[w];
                for (var j in O)
                    if (Object.prototype.hasOwnProperty.call(O, j)) A[j] = O[j]
            }
            return A
        }, Vt7 = function(A, O) {
            var w = {};
            for (var $ in A)
                if (Object.prototype.hasOwnProperty.call(A, $) && O.indexOf($) < 0) w[$] = A[$];
            if (A != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var j = 0, $ = Object.getOwnPropertySymbols(A); j < $.length; j++)
                    if (O.indexOf($[j]) < 0 && Object.prototype.propertyIsEnumerable.call(A, $[j])) w[$[j]] = A[$[j]]
            }
            return w
        }, kt7 = function(A, O, w, $) {
            var j = arguments.length,
                H = j < 3 ? O : $ === null ? $ = Object.getOwnPropertyDescriptor(O, w) : $,
                J;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") H = Reflect.decorate(A, O, w, $);
            else
                for (var X = A.length - 1; X >= 0; X--)
                    if (J = A[X]) H = (j < 3 ? J(H) : j > 3 ? J(O, w, H) : J(O, w)) || H;
            return j > 3 && H && Object.defineProperty(O, w, H), H
        }, Nt7 = function(A, O) {
            return function(w, $) {
                O(w, $, A)
            }
        }, Et7 = function(A, O, w, $, j, H) {
            function J(k) {
                if (k !== void 0 && typeof k !== "function") throw TypeError("Function expected");
                return k
            }
            var X = $.kind,
                M = X === "getter" ? "get" : X === "setter" ? "set" : "value",
                P = !O && A ? $.static ? A : A.prototype : null,
                W = O || (P ? Object.getOwnPropertyDescriptor(P, $.name) : {}),
                D, Z = !1;
            for (var G = w.length - 1; G >= 0; G--) {
                var f = {};
                for (var v in $) f[v] = v === "access" ? {} : $[v];
                for (var v in $.access) f.access[v] = $.access[v];
                f.addInitializer = function(k) {
                    if (Z) throw TypeError("Cannot add initializers after decoration has completed");
                    H.push(J(k || null))
                };
                var V = (0, w[G])(X === "accessor" ? {
                    get: W.get,
                    set: W.set
                } : W[M], f);
                if (X === "accessor") {
                    if (V === void 0) continue;
                    if (V === null || typeof V !== "object") throw TypeError("Object expected");
                    if (D = J(V.get)) W.get = D;
                    if (D = J(V.set)) W.set = D;
                    if (D = J(V.init)) j.unshift(D)
                } else if (D = J(V))
                    if (X === "field") j.unshift(D);
                    else W[M] = D
            }
            if (P) Object.defineProperty(P, $.name, W);
            Z = !0
        }, yt7 = function(A, O, w) {
            var $ = arguments.length > 2;
            for (var j = 0; j < O.length; j++) w = $ ? O[j].call(A, w) : O[j].call(A);
            return $ ? w : void 0
        }, Lt7 = function(A) {
            return typeof A === "symbol" ? A : "".concat(A)
        }, ht7 = function(A, O, w) {
            if (typeof O === "symbol") O = O.description ? "[".concat(O.description, "]") : "";
            return Object.defineProperty(A, "name", {
                configurable: !0,
                value: w ? "".concat(w, " ", O) : O
            })
        }, Rt7 = function(A, O) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(A, O)
        }, St7 = function(A, O, w, $) {
            function j(H) {
                return H instanceof w ? H : new w(function(J) {
                    J(H)
                })
            }
            return new(w || (w = Promise))(function(H, J) {
                function X(W) {
                    try {
                        P($.next(W))
                    } catch (D) {
                        J(D)
                    }
                }

                function M(W) {
                    try {
                        P($.throw(W))
                    } catch (D) {
                        J(D)
                    }
                }

                function P(W) {
                    W.done ? H(W.value) : j(W.value).then(X, M)
                }
                P(($ = $.apply(A, O || [])).next())
            })
        }, Ct7 = function(A, O) {
            var w = {
                    label: 0,
                    sent: function() {
                        if (H[0] & 1) throw H[1];
                        return H[1]
                    },
                    trys: [],
                    ops: []
                },
                $, j, H, J = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
            return J.next = X(0), J.throw = X(1), J.return = X(2), typeof Symbol === "function" && (J[Symbol.iterator] = function() {
                return this
            }), J;

            function X(P) {
                return function(W) {
                    return M([P, W])
                }
            }

            function M(P) {
                if ($) throw TypeError("Generator is already executing.");
                while (J && (J = 0, P[0] && (w = 0)), w) try {
                    if ($ = 1, j && (H = P[0] & 2 ? j.return : P[0] ? j.throw || ((H = j.return) && H.call(j), 0) : j.next) && !(H = H.call(j, P[1])).done) return H;
                    if (j = 0, H) P = [P[0] & 2, H.value];
                    switch (P[0]) {
                        case 0:
                        case 1:
                            H = P;
                            break;
                        case 4:
                            return w.label++, {
                                value: P[1],
                                done: !1
                            };
                        case 5:
                            w.label++, j = P[1], P = [0];
                            continue;
                        case 7:
                            P = w.ops.pop(), w.trys.pop();
                            continue;
                        default:
                            if ((H = w.trys, !(H = H.length > 0 && H[H.length - 1])) && (P[0] === 6 || P[0] === 2)) {
                                w = 0;
                                continue
                            }
                            if (P[0] === 3 && (!H || P[1] > H[0] && P[1] < H[3])) {
                                w.label = P[1];
                                break
                            }
                            if (P[0] === 6 && w.label < H[1]) {
                                w.label = H[1], H = P;
                                break
                            }
                            if (H && w.label < H[2]) {
                                w.label = H[2], w.ops.push(P);
                                break
                            }
                            if (H[2]) w.ops.pop();
                            w.trys.pop();
                            continue
                    }
                    P = O.call(A, w)
                } catch (W) {
                    P = [6, W], j = 0
                } finally {
                    $ = H = 0
                }
                if (P[0] & 5) throw P[1];
                return {
                    value: P[0] ? P[1] : void 0,
                    done: !0
                }
            }
        }, bt7 = function(A, O) {
            for (var w in A)
                if (w !== "default" && !Object.prototype.hasOwnProperty.call(O, w)) yP8(O, A, w)
        }, yP8 = Object.create ? function(A, O, w, $) {
            if ($ === void 0) $ = w;
            var j = Object.getOwnPropertyDescriptor(O, w);
            if (!j || ("get" in j ? !O.__esModule : j.writable || j.configurable)) j = {
                enumerable: !0,
                get: function() {
                    return O[w]
                }
            };
            Object.defineProperty(A, $, j)
        } : function(A, O, w, $) {
            if ($ === void 0) $ = w;
            A[$] = O[w]
        }, EP8 = function(A) {
            var O = typeof Symbol === "function" && Symbol.iterator,
                w = O && A[O],
                $ = 0;
            if (w) return w.call(A);
            if (A && typeof A.length === "number") return {
                next: function() {
                    if (A && $ >= A.length) A = void 0;
                    return {
                        value: A && A[$++],
                        done: !A
                    }
                }
            };
            throw TypeError(O ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, i$1 = function(A, O) {
            var w = typeof Symbol === "function" && A[Symbol.iterator];
            if (!w) return A;
            var $ = w.call(A),
                j, H = [],
                J;
            try {
                while ((O === void 0 || O-- > 0) && !(j = $.next()).done) H.push(j.value)
            } catch (X) {
                J = {
                    error: X
                }
            } finally {
                try {
                    if (j && !j.done && (w = $.return)) w.call($)
                } finally {
                    if (J) throw J.error
                }
            }
            return H
        }, It7 = function() {
            for (var A = [], O = 0; O < arguments.length; O++) A = A.concat(i$1(arguments[O]));
            return A
        }, xt7 = function() {
            for (var A = 0, O = 0, w = arguments.length; O < w; O++) A += arguments[O].length;
            for (var $ = Array(A), j = 0, O = 0; O < w; O++)
                for (var H = arguments[O], J = 0, X = H.length; J < X; J++, j++) $[j] = H[J];
            return $
        }, ut7 = function(A, O, w) {
            if (w || arguments.length === 2) {
                for (var $ = 0, j = O.length, H; $ < j; $++)
                    if (H || !($ in O)) {
                        if (!H) H = Array.prototype.slice.call(O, 0, $);
                        H[$] = O[$]
                    }
            }
            return A.concat(H || Array.prototype.slice.call(O))
        }, Hv6 = function(A) {
            return this instanceof Hv6 ? (this.v = A, this) : new Hv6(A)
        }, mt7 = function(A, O, w) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var $ = w.apply(A, O || []),
                j, H = [];
            return j = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), X("next"), X("throw"), X("return", J), j[Symbol.asyncIterator] = function() {
                return this
            }, j;

            function J(G) {
                return function(f) {
                    return Promise.resolve(f).then(G, D)
                }
            }

            function X(G, f) {
                if ($[G]) {
                    if (j[G] = function(v) {
                            return new Promise(function(V, k) {
                                H.push([G, v, V, k]) > 1 || M(G, v)
                            })
                        }, f) j[G] = f(j[G])
                }
            }

            function M(G, f) {
                try {
                    P($[G](f))
                } catch (v) {
                    Z(H[0][3], v)
                }
            }

            function P(G) {
                G.value instanceof Hv6 ? Promise.resolve(G.value.v).then(W, D) : Z(H[0][2], G)
            }

            function W(G) {
                M("next", G)
            }

            function D(G) {
                M("throw", G)
            }

            function Z(G, f) {
                if (G(f), H.shift(), H.length) M(H[0][0], H[0][1])
            }
        }, Bt7 = function(A) {
            var O, w;
            return O = {}, $("next"), $("throw", function(j) {
                throw j
            }), $("return"), O[Symbol.iterator] = function() {
                return this
            }, O;

            function $(j, H) {
                O[j] = A[j] ? function(J) {
                    return (w = !w) ? {
                        value: Hv6(A[j](J)),
                        done: !1
                    } : H ? H(J) : J
                } : H
            }
        }, pt7 = function(A) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var O = A[Symbol.asyncIterator],
                w;
            return O ? O.call(A) : (A = typeof EP8 === "function" ? EP8(A) : A[Symbol.iterator](), w = {}, $("next"), $("throw"), $("return"), w[Symbol.asyncIterator] = function() {
                return this
            }, w);

            function $(H) {
                w[H] = A[H] && function(J) {
                    return new Promise(function(X, M) {
                        J = A[H](J), j(X, M, J.done, J.value)
                    })
                }
            }

            function j(H, J, X, M) {
                Promise.resolve(M).then(function(P) {
                    H({
                        value: P,
                        done: X
                    })
                }, J)
            }
        }, Ft7 = function(A, O) {
            if (Object.defineProperty) Object.defineProperty(A, "raw", {
                value: O
            });
            else A.raw = O;
            return A
        };
        var _ = Object.create ? function(A, O) {
                Object.defineProperty(A, "default", {
                    enumerable: !0,
                    value: O
                })
            } : function(A, O) {
                A.default = O
            },
            z = function(A) {
                return z = Object.getOwnPropertyNames || function(O) {
                    var w = [];
                    for (var $ in O)
                        if (Object.prototype.hasOwnProperty.call(O, $)) w[w.length] = $;
                    return w
                }, z(A)
            };
        gt7 = function(A) {
            if (A && A.__esModule) return A;
            var O = {};
            if (A != null) {
                for (var w = z(A), $ = 0; $ < w.length; $++)
                    if (w[$] !== "default") yP8(O, A, w[$])
            }
            return _(O, A), O
        }, Ut7 = function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        }, Qt7 = function(A, O, w, $) {
            if (w === "a" && !$) throw TypeError("Private accessor was defined without a getter");
            if (typeof O === "function" ? A !== O || !$ : !O.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return w === "m" ? $ : w === "a" ? $.call(A) : $ ? $.value : O.get(A)
        }, dt7 = function(A, O, w, $, j) {
            if ($ === "m") throw TypeError("Private method is not writable");
            if ($ === "a" && !j) throw TypeError("Private accessor was defined without a setter");
            if (typeof O === "function" ? A !== O || !j : !O.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return $ === "a" ? j.call(A, w) : j ? j.value = w : O.set(A, w), w
        }, ct7 = function(A, O) {
            if (O === null || typeof O !== "object" && typeof O !== "function") throw TypeError("Cannot use 'in' operator on non-object");
            return typeof A === "function" ? O === A : A.has(O)
        }, lt7 = function(A, O, w) {
            if (O !== null && O !== void 0) {
                if (typeof O !== "object" && typeof O !== "function") throw TypeError("Object expected.");
                var $, j;
                if (w) {
                    if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
                    $ = O[Symbol.asyncDispose]
                }
                if ($ === void 0) {
                    if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
                    if ($ = O[Symbol.dispose], w) j = $
                }
                if (typeof $ !== "function") throw TypeError("Object not disposable.");
                if (j) $ = function() {
                    try {
                        j.call(this)
                    } catch (H) {
                        return Promise.reject(H)
                    }
                };
                A.stack.push({
                    value: O,
                    dispose: $,
                    async: w
                })
            } else if (w) A.stack.push({
                async: !0
            });
            return O
        };
        var Y = typeof SuppressedError === "function" ? SuppressedError : function(A, O, w) {
            var $ = Error(w);
            return $.name = "SuppressedError", $.error = A, $.suppressed = O, $
        };
        nt7 = function(A) {
            function O(H) {
                A.error = A.hasError ? new Y(H, A.error, "An error was suppressed during disposal.") : H, A.hasError = !0
            }
            var w, $ = 0;

            function j() {
                while (w = A.stack.pop()) try {
                    if (!w.async && $ === 1) return $ = 0, A.stack.push(w), Promise.resolve().then(j);
                    if (w.dispose) {
                        var H = w.dispose.call(w.value);
                        if (w.async) return $ |= 2, Promise.resolve(H).then(j, function(J) {
                            return O(J), j()
                        })
                    } else $ |= 1
                } catch (J) {
                    O(J)
                }
                if ($ === 1) return A.hasError ? Promise.reject(A.error) : Promise.resolve();
                if (A.hasError) throw A.error
            }
            return j()
        }, it7 = function(A, O) {
            if (typeof A === "string" && /^\.\.?\//.test(A)) return A.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(w, $, j, H, J) {
                return $ ? O ? ".jsx" : ".js" : j && (!H || !J) ? w : j + H + "." + J.toLowerCase() + "js"
            });
            return A
        }, q("__extends", vt7), q("__assign", Tt7), q("__rest", Vt7), q("__decorate", kt7), q("__param", Nt7), q("__esDecorate", Et7), q("__runInitializers", yt7), q("__propKey", Lt7), q("__setFunctionName", ht7), q("__metadata", Rt7), q("__awaiter", St7), q("__generator", Ct7), q("__exportStar", bt7), q("__createBinding", yP8), q("__values", EP8), q("__read", i$1), q("__spread", It7), q("__spreadArrays", xt7), q("__spreadArray", ut7), q("__await", Hv6), q("__asyncGenerator", mt7), q("__asyncDelegator", Bt7), q("__asyncValues", pt7), q("__makeTemplateObject", Ft7), q("__importStar", gt7), q("__importDefault", Ut7), q("__classPrivateFieldGet", Qt7), q("__classPrivateFieldSet", dt7), q("__classPrivateFieldIn", ct7), q("__addDisposableResource", lt7), q("__disposeResources", nt7), q("__rewriteRelativeImportExtension", it7)
    })
})
// @from(Ln 68531, Col 4)
at7 = p((rt7) => {
    Object.defineProperty(rt7, "__esModule", {
        value: !0
    });
    rt7.checkUrl = void 0;
    var Qz3 = jP(),
        dz3 = "169.254.170.2",
        cz3 = "169.254.170.23",
        lz3 = "[fd00:ec2::23]",
        nz3 = (q, K) => {
            if (q.protocol === "https:") return;
            if (q.hostname === dz3 || q.hostname === cz3 || q.hostname === lz3) return;
            if (q.hostname.includes("[")) {
                if (q.hostname === "[::1]" || q.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
            } else {
                if (q.hostname === "localhost") return;
                let _ = q.hostname.split("."),
                    z = (Y) => {
                        let A = parseInt(Y, 10);
                        return 0 <= A && A <= 255
                    };
                if (_[0] === "127" && z(_[1]) && z(_[2]) && z(_[3]) && _.length === 4) return
            }
            throw new Qz3.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
                logger: K
            })
        };
    rt7.checkUrl = nz3
})
// @from(Ln 68563, Col 4)
qj1 = p((tz3) => {
    tz3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tz3.HttpAuthLocation || (tz3.HttpAuthLocation = {}));
    tz3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tz3.HttpApiKeyAuthLocation || (tz3.HttpApiKeyAuthLocation = {}));
    tz3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(tz3.EndpointURLScheme || (tz3.EndpointURLScheme = {}));
    tz3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(tz3.AlgorithmId || (tz3.AlgorithmId = {}));
    var iz3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => tz3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => tz3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        rz3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        oz3 = (q) => {
            return iz3(q)
        },
        az3 = (q) => {
            return rz3(q)
        };
    tz3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(tz3.FieldPosition || (tz3.FieldPosition = {}));
    var sz3 = "__smithy_context";
    tz3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(tz3.IniSectionType || (tz3.IniSectionType = {}));
    tz3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(tz3.RequestHandlerProtocol || (tz3.RequestHandlerProtocol = {}));
    tz3.SMITHY_CONTEXT_KEY = sz3;
    tz3.getDefaultClientConfiguration = oz3;
    tz3.resolveDefaultRuntimeConfig = az3
})
// @from(Ln 68628, Col 4)
qe7 = p((wY3) => {
    var _Y3 = qj1(),
        zY3 = (q) => {
            return {
                setHttpHandler(K) {
                    q.httpHandler = K
                },
                httpHandler() {
                    return q.httpHandler
                },
                updateHttpClientConfig(K, _) {
                    q.httpHandler?.updateHttpClientConfig(K, _)
                },
                httpHandlerConfigs() {
                    return q.httpHandler.httpHandlerConfigs()
                }
            }
        },
        YY3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class st7 {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = _Y3.FieldPosition.HEADER,
            values: _ = []
        }) {
            this.name = q, this.kind = K, this.values = _
        }
        add(q) {
            this.values.push(q)
        }
        set(q) {
            this.values = q
        }
        remove(q) {
            this.values = this.values.filter((K) => K !== q)
        }
        toString() {
            return this.values.map((q) => q.includes(",") || q.includes(" ") ? `"${q}"` : q).join(", ")
        }
        get() {
            return this.values
        }
    }
    class tt7 {
        entries = {};
        encoding;
        constructor({
            fields: q = [],
            encoding: K = "utf-8"
        }) {
            q.forEach(this.setField.bind(this)), this.encoding = K
        }
        setField(q) {
            this.entries[q.name.toLowerCase()] = q
        }
        getField(q) {
            return this.entries[q.toLowerCase()]
        }
        removeField(q) {
            delete this.entries[q.toLowerCase()]
        }
        getByType(q) {
            return Object.values(this.entries).filter((K) => K.kind === q)
        }
    }
    class hP8 {
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
        constructor(q) {
            this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
        }
        static clone(q) {
            let K = new hP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = AY3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return hP8.clone(this)
        }
    }

    function AY3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class et7 {
        statusCode;
        reason;
        headers;
        body;
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    }

    function OY3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    wY3.Field = st7;
    wY3.Fields = tt7;
    wY3.HttpRequest = hP8;
    wY3.HttpResponse = et7;
    wY3.getHttpHandlerExtensionConfiguration = zY3;
    wY3.isValidHostname = OY3;
    wY3.resolveHttpHandlerRuntimeConfig = YY3
})
// @from(Ln 68770, Col 4)
gU = p((WY3) => {
    var WO6 = (q, K) => {
            let _ = [];
            if (q) _.push(q);
            if (K)
                for (let z of K) _.push(z);
            return _
        },
        H76 = (q, K) => {
            return `${q||"anonymous"}${K&&K.length>0?` (a.k.a. ${K.join(",")})`:""}`
        },
        Kj1 = () => {
            let q = [],
                K = [],
                _ = !1,
                z = new Set,
                Y = (J) => J.sort((X, M) => Ke7[M.step] - Ke7[X.step] || _e7[M.priority || "normal"] - _e7[X.priority || "normal"]),
                A = (J) => {
                    let X = !1,
                        M = (P) => {
                            let W = WO6(P.name, P.aliases);
                            if (W.includes(J)) {
                                X = !0;
                                for (let D of W) z.delete(D);
                                return !1
                            }
                            return !0
                        };
                    return q = q.filter(M), K = K.filter(M), X
                },
                O = (J) => {
                    let X = !1,
                        M = (P) => {
                            if (P.middleware === J) {
                                X = !0;
                                for (let W of WO6(P.name, P.aliases)) z.delete(W);
                                return !1
                            }
                            return !0
                        };
                    return q = q.filter(M), K = K.filter(M), X
                },
                w = (J) => {
                    return q.forEach((X) => {
                        J.add(X.middleware, {
                            ...X
                        })
                    }), K.forEach((X) => {
                        J.addRelativeTo(X.middleware, {
                            ...X
                        })
                    }), J.identifyOnResolve?.(H.identifyOnResolve()), J
                },
                $ = (J) => {
                    let X = [];
                    return J.before.forEach((M) => {
                        if (M.before.length === 0 && M.after.length === 0) X.push(M);
                        else X.push(...$(M))
                    }), X.push(J), J.after.reverse().forEach((M) => {
                        if (M.before.length === 0 && M.after.length === 0) X.push(M);
                        else X.push(...$(M))
                    }), X
                },
                j = (J = !1) => {
                    let X = [],
                        M = [],
                        P = {};
                    return q.forEach((D) => {
                        let Z = {
                            ...D,
                            before: [],
                            after: []
                        };
                        for (let G of WO6(Z.name, Z.aliases)) P[G] = Z;
                        X.push(Z)
                    }), K.forEach((D) => {
                        let Z = {
                            ...D,
                            before: [],
                            after: []
                        };
                        for (let G of WO6(Z.name, Z.aliases)) P[G] = Z;
                        M.push(Z)
                    }), M.forEach((D) => {
                        if (D.toMiddleware) {
                            let Z = P[D.toMiddleware];
                            if (Z === void 0) {
                                if (J) return;
                                throw Error(`${D.toMiddleware} is not found when adding ${H76(D.name,D.aliases)} middleware ${D.relation} ${D.toMiddleware}`)
                            }
                            if (D.relation === "after") Z.after.push(D);
                            if (D.relation === "before") Z.before.push(D)
                        }
                    }), Y(X).map($).reduce((D, Z) => {
                        return D.push(...Z), D
                    }, [])
                },
                H = {
                    add: (J, X = {}) => {
                        let {
                            name: M,
                            override: P,
                            aliases: W
                        } = X, D = {
                            step: "initialize",
                            priority: "normal",
                            middleware: J,
                            ...X
                        }, Z = WO6(M, W);
                        if (Z.length > 0) {
                            if (Z.some((G) => z.has(G))) {
                                if (!P) throw Error(`Duplicate middleware name '${H76(M,W)}'`);
                                for (let G of Z) {
                                    let f = q.findIndex((V) => V.name === G || V.aliases?.some((k) => k === G));
                                    if (f === -1) continue;
                                    let v = q[f];
                                    if (v.step !== D.step || D.priority !== v.priority) throw Error(`"${H76(v.name,v.aliases)}" middleware with ${v.priority} priority in ${v.step} step cannot be overridden by "${H76(M,W)}" middleware with ${D.priority} priority in ${D.step} step.`);
                                    q.splice(f, 1)
                                }
                            }
                            for (let G of Z) z.add(G)
                        }
                        q.push(D)
                    },
                    addRelativeTo: (J, X) => {
                        let {
                            name: M,
                            override: P,
                            aliases: W
                        } = X, D = {
                            middleware: J,
                            ...X
                        }, Z = WO6(M, W);
                        if (Z.length > 0) {
                            if (Z.some((G) => z.has(G))) {
                                if (!P) throw Error(`Duplicate middleware name '${H76(M,W)}'`);
                                for (let G of Z) {
                                    let f = K.findIndex((V) => V.name === G || V.aliases?.some((k) => k === G));
                                    if (f === -1) continue;
                                    let v = K[f];
                                    if (v.toMiddleware !== D.toMiddleware || v.relation !== D.relation) throw Error(`"${H76(v.name,v.aliases)}" middleware ${v.relation} "${v.toMiddleware}" middleware cannot be overridden by "${H76(M,W)}" middleware ${D.relation} "${D.toMiddleware}" middleware.`);
                                    K.splice(f, 1)
                                }
                            }
                            for (let G of Z) z.add(G)
                        }
                        K.push(D)
                    },
                    clone: () => w(Kj1()),
                    use: (J) => {
                        J.applyToStack(H)
                    },
                    remove: (J) => {
                        if (typeof J === "string") return A(J);
                        else return O(J)
                    },
                    removeByTag: (J) => {
                        let X = !1,
                            M = (P) => {
                                let {
                                    tags: W,
                                    name: D,
                                    aliases: Z
                                } = P;
                                if (W && W.includes(J)) {
                                    let G = WO6(D, Z);
                                    for (let f of G) z.delete(f);
                                    return X = !0, !1
                                }
                                return !0
                            };
                        return q = q.filter(M), K = K.filter(M), X
                    },
                    concat: (J) => {
                        let X = w(Kj1());
                        return X.use(J), X.identifyOnResolve(_ || X.identifyOnResolve() || (J.identifyOnResolve?.() ?? !1)), X
                    },
                    applyToStack: w,
                    identify: () => {
                        return j(!0).map((J) => {
                            let X = J.step ?? J.relation + " " + J.toMiddleware;
                            return H76(J.name, J.aliases) + " - " + X
                        })
                    },
                    identifyOnResolve(J) {
                        if (typeof J === "boolean") _ = J;
                        return _
                    },
                    resolve: (J, X) => {
                        for (let M of j().map((P) => P.middleware).reverse()) J = M(J, X);
                        if (_) console.log(H.identify());
                        return J
                    }
                };
            return H
        },
        Ke7 = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        _e7 = {
            high: 3,
            normal: 2,
            low: 1
        };
    WY3.constructStack = Kj1
})
// @from(Ln 68980, Col 4)
ze7 = p((fY3) => {
    var ZY3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    fY3.isArrayBuffer = ZY3
})