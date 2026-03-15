
// @from(Ln 166450, Col 4)
hh7 = x((U92, Rh7) => {
    var {
        defineProperty: m$1,
        getOwnPropertyDescriptor: Ei3,
        getOwnPropertyNames: yi3
    } = Object, Li3 = Object.prototype.hasOwnProperty, zJ8 = (A, q) => m$1(A, "name", {
        value: q,
        configurable: !0
    }), Ri3 = (A, q) => {
        for (var K in q) m$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, hi3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of yi3(q))
                if (!Li3.call(A, z) && z !== K) m$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Ei3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Si3 = (A) => hi3(m$1({}, "__esModule", {
        value: !0
    }), A), yh7 = {};
    Ri3(yh7, {
        escapeUri: () => Lh7,
        escapeUriPath: () => Ii3
    });
    Rh7.exports = Si3(yh7);
    var Lh7 = zJ8((A) => encodeURIComponent(A).replace(/[!'()*]/g, Ci3), "escapeUri"),
        Ci3 = zJ8((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        Ii3 = zJ8((A) => A.split("/").map(Lh7).join("/"), "escapeUriPath")
})
// @from(Ln 166484, Col 4)
bh7 = x((d92, Ih7) => {
    var {
        defineProperty: B$1,
        getOwnPropertyDescriptor: bi3,
        getOwnPropertyNames: xi3
    } = Object, ui3 = Object.prototype.hasOwnProperty, mi3 = (A, q) => B$1(A, "name", {
        value: q,
        configurable: !0
    }), Bi3 = (A, q) => {
        for (var K in q) B$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, gi3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of xi3(q))
                if (!ui3.call(A, z) && z !== K) B$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = bi3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Fi3 = (A) => gi3(B$1({}, "__esModule", {
        value: !0
    }), A), Sh7 = {};
    Bi3(Sh7, {
        buildQueryString: () => Ch7
    });
    Ih7.exports = Fi3(Sh7);
    var _J8 = hh7();

    function Ch7(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = (0, _J8.escapeUri)(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${(0,_J8.escapeUri)(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${(0,_J8.escapeUri)(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    mi3(Ch7, "buildQueryString")
})
// @from(Ln 166531, Col 4)
xh7 = x((Qi3) => {
    var pi3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    Qi3.isArrayBuffer = pi3
})
// @from(Ln 166535, Col 4)
OJ8 = x((ii3) => {
    var di3 = xh7(),
        wJ8 = x6("buffer"),
        ci3 = (A, q = 0, K = A.byteLength - q) => {
            if (!di3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return wJ8.Buffer.from(A, q, K)
        },
        li3 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? wJ8.Buffer.from(A, q) : wJ8.Buffer.from(A)
        };
    ii3.fromArrayBuffer = ci3;
    ii3.fromString = li3
})
// @from(Ln 166549, Col 4)
Bh7 = x((uh7) => {
    Object.defineProperty(uh7, "__esModule", {
        value: !0
    });
    uh7.fromBase64 = void 0;
    var oi3 = OJ8(),
        ai3 = /^[A-Za-z0-9+/]*={0,2}$/,
        si3 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!ai3.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, oi3.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    uh7.fromBase64 = si3
})
// @from(Ln 166564, Col 4)
ph7 = x((gh7) => {
    Object.defineProperty(gh7, "__esModule", {
        value: !0
    });
    gh7.toBase64 = void 0;
    var ti3 = OJ8(),
        ei3 = C_(),
        An3 = (A) => {
            let q;
            if (typeof A === "string") q = (0, ei3.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, ti3.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    gh7.toBase64 = An3
})
// @from(Ln 166580, Col 4)
dh7 = x((r92, g$1) => {
    var {
        defineProperty: Qh7,
        getOwnPropertyDescriptor: qn3,
        getOwnPropertyNames: Kn3
    } = Object, Yn3 = Object.prototype.hasOwnProperty, $J8 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Kn3(q))
                if (!Yn3.call(A, z) && z !== K) Qh7(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = qn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Uh7 = (A, q, K) => ($J8(A, q, "default"), K && $J8(K, q, "default")), zn3 = (A) => $J8(Qh7({}, "__esModule", {
        value: !0
    }), A), HJ8 = {};
    g$1.exports = zn3(HJ8);
    Uh7(HJ8, Bh7(), g$1.exports);
    Uh7(HJ8, ph7(), g$1.exports)
})
// @from(Ln 166601, Col 4)
JJ8 = x((o92, ah7) => {
    var {
        defineProperty: p$1,
        getOwnPropertyDescriptor: _n3,
        getOwnPropertyNames: wn3
    } = Object, On3 = Object.prototype.hasOwnProperty, Sm = (A, q) => p$1(A, "name", {
        value: q,
        configurable: !0
    }), $n3 = (A, q) => {
        for (var K in q) p$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Hn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of wn3(q))
                if (!On3.call(A, z) && z !== K) p$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = _n3(q, z)) || Y.enumerable
                })
        }
        return A
    }, jn3 = (A) => Hn3(p$1({}, "__esModule", {
        value: !0
    }), A), lh7 = {};
    $n3(lh7, {
        FetchHttpHandler: () => Mn3,
        keepAliveSupport: () => F$1,
        streamCollector: () => Xn3
    });
    ah7.exports = jn3(lh7);
    var ch7 = Eh7(),
        Jn3 = bh7();

    function jJ8(A, q) {
        return new Request(A, q)
    }
    Sm(jJ8, "createRequest");

    function ih7(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    Sm(ih7, "requestTimeout");
    var F$1 = {
            supported: void 0
        },
        Mn3 = class A {
            static {
                Sm(this, "FetchHttpHandler")
            }
            static create(q) {
                if (typeof q?.handle === "function") return q;
                return new A(q)
            }
            constructor(q) {
                if (typeof q === "function") this.configProvider = q().then((K) => K || {});
                else this.config = q ?? {}, this.configProvider = Promise.resolve(this.config);
                if (F$1.supported === void 0) F$1.supported = Boolean(typeof Request < "u" && "keepalive" in jJ8("https://[::1]"))
            }
            destroy() {}
            async handle(q, {
                abortSignal: K
            } = {}) {
                if (!this.config) this.config = await this.configProvider;
                let Y = this.config.requestTimeout,
                    z = this.config.keepAlive === !0,
                    _ = this.config.credentials;
                if (K?.aborted) {
                    let Z = Error("Request aborted");
                    return Z.name = "AbortError", Promise.reject(Z)
                }
                let w = q.path,
                    O = (0, Jn3.buildQueryString)(q.query || {});
                if (O) w += `?${O}`;
                if (q.fragment) w += `#${q.fragment}`;
                let $ = "";
                if (q.username != null || q.password != null) {
                    let Z = q.username ?? "",
                        G = q.password ?? "";
                    $ = `${Z}:${G}@`
                }
                let {
                    port: H,
                    method: j
                } = q, J = `${q.protocol}//${$}${q.hostname}${H?`:${H}`:""}${w}`, M = j === "GET" || j === "HEAD" ? void 0 : q.body, D = {
                    body: M,
                    headers: new Headers(q.headers),
                    method: j,
                    credentials: _
                };
                if (this.config?.cache) D.cache = this.config.cache;
                if (M) D.duplex = "half";
                if (typeof AbortController < "u") D.signal = K;
                if (F$1.supported) D.keepalive = z;
                if (typeof this.config.requestInit === "function") Object.assign(D, this.config.requestInit(q));
                let X = Sm(() => {}, "removeSignalEventListener"),
                    P = jJ8(J, D),
                    W = [fetch(P).then((Z) => {
                        let G = Z.headers,
                            f = {};
                        for (let N of G.entries()) f[N[0]] = N[1];
                        if (Z.body == null) return Z.blob().then((N) => ({
                            response: new ch7.HttpResponse({
                                headers: f,
                                reason: Z.statusText,
                                statusCode: Z.status,
                                body: N
                            })
                        }));
                        return {
                            response: new ch7.HttpResponse({
                                headers: f,
                                reason: Z.statusText,
                                statusCode: Z.status,
                                body: Z.body
                            })
                        }
                    }), ih7(Y)];
                if (K) W.push(new Promise((Z, G) => {
                    let f = Sm(() => {
                        let v = Error("Request aborted");
                        v.name = "AbortError", G(v)
                    }, "onAbort");
                    if (typeof K.addEventListener === "function") {
                        let v = K;
                        v.addEventListener("abort", f, {
                            once: !0
                        }), X = Sm(() => v.removeEventListener("abort", f), "removeSignalEventListener")
                    } else K.onabort = f
                }));
                return Promise.race(W).finally(X)
            }
            updateHttpClientConfig(q, K) {
                this.config = void 0, this.configProvider = this.configProvider.then((Y) => {
                    return Y[q] = K, Y
                })
            }
            httpHandlerConfigs() {
                return this.config ?? {}
            }
        },
        Dn3 = dh7(),
        Xn3 = Sm(async (A) => {
            if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
                if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
                return nh7(A)
            }
            return rh7(A)
        }, "streamCollector");
    async function nh7(A) {
        let q = await oh7(A),
            K = (0, Dn3.fromBase64)(q);
        return new Uint8Array(K)
    }
    Sm(nh7, "collectBlob");
    async function rh7(A) {
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
    Sm(rh7, "collectStream");

    function oh7(A) {
        return new Promise((q, K) => {
            let Y = new FileReader;
            Y.onloadend = () => {
                if (Y.readyState !== 2) return K(Error("Reader aborted too early"));
                let z = Y.result ?? "",
                    _ = z.indexOf(","),
                    w = _ > -1 ? _ + 1 : z.length;
                q(z.substring(w))
            }, Y.onabort = () => K(Error("Read aborted")), Y.onerror = () => K(Y.error), Y.readAsDataURL(A)
        })
    }
    Sm(oh7, "readToBase64")
})
// @from(Ln 166795, Col 4)
MJ8 = x((a92, _S7) => {
    var {
        defineProperty: Q$1,
        getOwnPropertyDescriptor: Pn3,
        getOwnPropertyNames: Wn3
    } = Object, Zn3 = Object.prototype.hasOwnProperty, U$1 = (A, q) => Q$1(A, "name", {
        value: q,
        configurable: !0
    }), Gn3 = (A, q) => {
        for (var K in q) Q$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, fn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Wn3(q))
                if (!Zn3.call(A, z) && z !== K) Q$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Pn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Tn3 = (A) => fn3(Q$1({}, "__esModule", {
        value: !0
    }), A), sh7 = {};
    Gn3(sh7, {
        AlgorithmId: () => qS7,
        EndpointURLScheme: () => AS7,
        FieldPosition: () => KS7,
        HttpApiKeyAuthLocation: () => eh7,
        HttpAuthLocation: () => th7,
        IniSectionType: () => YS7,
        RequestHandlerProtocol: () => zS7,
        SMITHY_CONTEXT_KEY: () => En3,
        getDefaultClientConfiguration: () => Vn3,
        resolveDefaultRuntimeConfig: () => kn3
    });
    _S7.exports = Tn3(sh7);
    var th7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(th7 || {}),
        eh7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(eh7 || {}),
        AS7 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(AS7 || {}),
        qS7 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(qS7 || {}),
        vn3 = U$1((A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => "md5",
                checksumConstructor: () => A.md5
            });
            return {
                _checksumAlgorithms: q,
                addChecksumAlgorithm(K) {
                    this._checksumAlgorithms.push(K)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        Nn3 = U$1((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        Vn3 = U$1((A) => {
            return {
                ...vn3(A)
            }
        }, "getDefaultClientConfiguration"),
        kn3 = U$1((A) => {
            return {
                ...Nn3(A)
            }
        }, "resolveDefaultRuntimeConfig"),
        KS7 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(KS7 || {}),
        En3 = "__smithy_context",
        YS7 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(YS7 || {}),
        zS7 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(zS7 || {})
})
// @from(Ln 166892, Col 4)
DJ8 = x((s92, DS7) => {
    var {
        defineProperty: d$1,
        getOwnPropertyDescriptor: yn3,
        getOwnPropertyNames: Ln3
    } = Object, Rn3 = Object.prototype.hasOwnProperty, Gs = (A, q) => d$1(A, "name", {
        value: q,
        configurable: !0
    }), hn3 = (A, q) => {
        for (var K in q) d$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Sn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Ln3(q))
                if (!Rn3.call(A, z) && z !== K) d$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = yn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Cn3 = (A) => Sn3(d$1({}, "__esModule", {
        value: !0
    }), A), wS7 = {};
    hn3(wS7, {
        Field: () => un3,
        Fields: () => mn3,
        HttpRequest: () => Bn3,
        HttpResponse: () => gn3,
        getHttpHandlerExtensionConfiguration: () => In3,
        isValidHostname: () => MS7,
        resolveHttpHandlerRuntimeConfig: () => bn3
    });
    DS7.exports = Cn3(wS7);
    var In3 = Gs((A) => {
            let q = A.httpHandler;
            return {
                setHttpHandler(K) {
                    q = K
                },
                httpHandler() {
                    return q
                },
                updateHttpClientConfig(K, Y) {
                    q.updateHttpClientConfig(K, Y)
                },
                httpHandlerConfigs() {
                    return q.httpHandlerConfigs()
                }
            }
        }, "getHttpHandlerExtensionConfiguration"),
        bn3 = Gs((A) => {
            return {
                httpHandler: A.httpHandler()
            }
        }, "resolveHttpHandlerRuntimeConfig"),
        xn3 = MJ8(),
        OS7 = class {
            constructor({
                name: q,
                kind: K = xn3.FieldPosition.HEADER,
                values: Y = []
            }) {
                this.name = q, this.kind = K, this.values = Y
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
        };
    Gs(OS7, "Field");
    var un3 = OS7,
        $S7 = class {
            constructor({
                fields: q = [],
                encoding: K = "utf-8"
            }) {
                this.entries = {}, q.forEach(this.setField.bind(this)), this.encoding = K
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
        };
    Gs($S7, "Fields");
    var mn3 = $S7,
        HS7 = class A {
            constructor(q) {
                this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
            }
            static isInstance(q) {
                if (!q) return !1;
                let K = q;
                return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
            }
            clone() {
                let q = new A({
                    ...this,
                    headers: {
                        ...this.headers
                    }
                });
                if (q.query) q.query = jS7(q.query);
                return q
            }
        };
    Gs(HS7, "HttpRequest");
    var Bn3 = HS7;

    function jS7(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    Gs(jS7, "cloneQuery");
    var JS7 = class {
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    };
    Gs(JS7, "HttpResponse");
    var gn3 = JS7;

    function MS7(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Gs(MS7, "isValidHostname")
})
// @from(Ln 167049, Col 4)
VS7 = x((t92, NS7) => {
    var {
        defineProperty: c$1,
        getOwnPropertyDescriptor: Fn3,
        getOwnPropertyNames: pn3
    } = Object, Qn3 = Object.prototype.hasOwnProperty, l$1 = (A, q) => c$1(A, "name", {
        value: q,
        configurable: !0
    }), Un3 = (A, q) => {
        for (var K in q) c$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, dn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of pn3(q))
                if (!Qn3.call(A, z) && z !== K) c$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Fn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, cn3 = (A) => dn3(c$1({}, "__esModule", {
        value: !0
    }), A), XS7 = {};
    Un3(XS7, {
        AlgorithmId: () => GS7,
        EndpointURLScheme: () => ZS7,
        FieldPosition: () => fS7,
        HttpApiKeyAuthLocation: () => WS7,
        HttpAuthLocation: () => PS7,
        IniSectionType: () => TS7,
        RequestHandlerProtocol: () => vS7,
        SMITHY_CONTEXT_KEY: () => on3,
        getDefaultClientConfiguration: () => nn3,
        resolveDefaultRuntimeConfig: () => rn3
    });
    NS7.exports = cn3(XS7);
    var PS7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(PS7 || {}),
        WS7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(WS7 || {}),
        ZS7 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(ZS7 || {}),
        GS7 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(GS7 || {}),
        ln3 = l$1((A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => "md5",
                checksumConstructor: () => A.md5
            });
            return {
                _checksumAlgorithms: q,
                addChecksumAlgorithm(K) {
                    this._checksumAlgorithms.push(K)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        in3 = l$1((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        nn3 = l$1((A) => {
            return {
                ...ln3(A)
            }
        }, "getDefaultClientConfiguration"),
        rn3 = l$1((A) => {
            return {
                ...in3(A)
            }
        }, "resolveDefaultRuntimeConfig"),
        fS7 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(fS7 || {}),
        on3 = "__smithy_context",
        TS7 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(TS7 || {}),
        vS7 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(vS7 || {})
})
// @from(Ln 167146, Col 4)
RS7 = x((e92, LS7) => {
    var {
        defineProperty: i$1,
        getOwnPropertyDescriptor: an3,
        getOwnPropertyNames: sn3
    } = Object, tn3 = Object.prototype.hasOwnProperty, ES7 = (A, q) => i$1(A, "name", {
        value: q,
        configurable: !0
    }), en3 = (A, q) => {
        for (var K in q) i$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Ar3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of sn3(q))
                if (!tn3.call(A, z) && z !== K) i$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = an3(q, z)) || Y.enumerable
                })
        }
        return A
    }, qr3 = (A) => Ar3(i$1({}, "__esModule", {
        value: !0
    }), A), yS7 = {};
    en3(yS7, {
        getSmithyContext: () => Kr3,
        normalizeProvider: () => Yr3
    });
    LS7.exports = qr3(yS7);
    var kS7 = VS7(),
        Kr3 = ES7((A) => A[kS7.SMITHY_CONTEXT_KEY] || (A[kS7.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
        Yr3 = ES7((A) => {
            if (typeof A === "function") return A;
            let q = Promise.resolve(A);
            return () => q
        }, "normalizeProvider")
})
// @from(Ln 167184, Col 4)
XJ8 = x((AY2, SS7) => {
    var {
        defineProperty: n$1,
        getOwnPropertyDescriptor: zr3,
        getOwnPropertyNames: _r3
    } = Object, wr3 = Object.prototype.hasOwnProperty, Or3 = (A, q) => n$1(A, "name", {
        value: q,
        configurable: !0
    }), $r3 = (A, q) => {
        for (var K in q) n$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Hr3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of _r3(q))
                if (!wr3.call(A, z) && z !== K) n$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = zr3(q, z)) || Y.enumerable
                })
        }
        return A
    }, jr3 = (A) => Hr3(n$1({}, "__esModule", {
        value: !0
    }), A), hS7 = {};
    $r3(hS7, {
        isArrayBuffer: () => Jr3
    });
    SS7.exports = jr3(hS7);
    var Jr3 = Or3((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 167215, Col 4)
xS7 = x((qY2, bS7) => {
    var {
        defineProperty: r$1,
        getOwnPropertyDescriptor: Mr3,
        getOwnPropertyNames: Dr3
    } = Object, Xr3 = Object.prototype.hasOwnProperty, CS7 = (A, q) => r$1(A, "name", {
        value: q,
        configurable: !0
    }), Pr3 = (A, q) => {
        for (var K in q) r$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Wr3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Dr3(q))
                if (!Xr3.call(A, z) && z !== K) r$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Mr3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Zr3 = (A) => Wr3(r$1({}, "__esModule", {
        value: !0
    }), A), IS7 = {};
    Pr3(IS7, {
        fromArrayBuffer: () => fr3,
        fromString: () => Tr3
    });
    bS7.exports = Zr3(IS7);
    var Gr3 = XJ8(),
        PJ8 = x6("buffer"),
        fr3 = CS7((A, q = 0, K = A.byteLength - q) => {
            if (!(0, Gr3.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return PJ8.Buffer.from(A, q, K)
        }, "fromArrayBuffer"),
        Tr3 = CS7((A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? PJ8.Buffer.from(A, q) : PJ8.Buffer.from(A)
        }, "fromString")
})
// @from(Ln 167256, Col 4)
nu6 = x((KY2, gS7) => {
    var {
        defineProperty: o$1,
        getOwnPropertyDescriptor: vr3,
        getOwnPropertyNames: Nr3
    } = Object, Vr3 = Object.prototype.hasOwnProperty, WJ8 = (A, q) => o$1(A, "name", {
        value: q,
        configurable: !0
    }), kr3 = (A, q) => {
        for (var K in q) o$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Er3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Nr3(q))
                if (!Vr3.call(A, z) && z !== K) o$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = vr3(q, z)) || Y.enumerable
                })
        }
        return A
    }, yr3 = (A) => Er3(o$1({}, "__esModule", {
        value: !0
    }), A), uS7 = {};
    kr3(uS7, {
        fromUtf8: () => BS7,
        toUint8Array: () => Lr3,
        toUtf8: () => Rr3
    });
    gS7.exports = yr3(uS7);
    var mS7 = xS7(),
        BS7 = WJ8((A) => {
            let q = (0, mS7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        Lr3 = WJ8((A) => {
            if (typeof A === "string") return BS7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        Rr3 = WJ8((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, mS7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 167303, Col 4)
lS7 = x((YY2, cS7) => {
    var {
        defineProperty: a$1,
        getOwnPropertyDescriptor: hr3,
        getOwnPropertyNames: Sr3
    } = Object, Cr3 = Object.prototype.hasOwnProperty, FS7 = (A, q) => a$1(A, "name", {
        value: q,
        configurable: !0
    }), Ir3 = (A, q) => {
        for (var K in q) a$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, br3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Sr3(q))
                if (!Cr3.call(A, z) && z !== K) a$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = hr3(q, z)) || Y.enumerable
                })
        }
        return A
    }, xr3 = (A) => br3(a$1({}, "__esModule", {
        value: !0
    }), A), pS7 = {};
    Ir3(pS7, {
        fromHex: () => US7,
        toHex: () => dS7
    });
    cS7.exports = xr3(pS7);
    var QS7 = {},
        ZJ8 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        QS7[A] = q, ZJ8[q] = A
    }

    function US7(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in ZJ8) q[K / 2] = ZJ8[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }
    FS7(US7, "fromHex");

    function dS7(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += QS7[A[K]];
        return q
    }
    FS7(dS7, "toHex")
})
// @from(Ln 167360, Col 4)
oS7 = x((zY2, rS7) => {
    var {
        defineProperty: s$1,
        getOwnPropertyDescriptor: ur3,
        getOwnPropertyNames: mr3
    } = Object, Br3 = Object.prototype.hasOwnProperty, GJ8 = (A, q) => s$1(A, "name", {
        value: q,
        configurable: !0
    }), gr3 = (A, q) => {
        for (var K in q) s$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Fr3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of mr3(q))
                if (!Br3.call(A, z) && z !== K) s$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = ur3(q, z)) || Y.enumerable
                })
        }
        return A
    }, pr3 = (A) => Fr3(s$1({}, "__esModule", {
        value: !0
    }), A), iS7 = {};
    gr3(iS7, {
        escapeUri: () => nS7,
        escapeUriPath: () => Ur3
    });
    rS7.exports = pr3(iS7);
    var nS7 = GJ8((A) => encodeURIComponent(A).replace(/[!'()*]/g, Qr3), "escapeUri"),
        Qr3 = GJ8((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        Ur3 = GJ8((A) => A.split("/").map(nS7).join("/"), "escapeUriPath")
})
// @from(Ln 167394, Col 4)
PC7 = x((_Y2, XC7) => {
    var {
        defineProperty: KH1,
        getOwnPropertyDescriptor: dr3,
        getOwnPropertyNames: cr3
    } = Object, lr3 = Object.prototype.hasOwnProperty, pJ = (A, q) => KH1(A, "name", {
        value: q,
        configurable: !0
    }), ir3 = (A, q) => {
        for (var K in q) KH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, nr3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of cr3(q))
                if (!lr3.call(A, z) && z !== K) KH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = dr3(q, z)) || Y.enumerable
                })
        }
        return A
    }, rr3 = (A) => nr3(KH1({}, "__esModule", {
        value: !0
    }), A), AC7 = {};
    ir3(AC7, {
        SignatureV4: () => vo3,
        clearCredentialCache: () => Jo3,
        createScope: () => AH1,
        getCanonicalHeaders: () => NJ8,
        getCanonicalQuery: () => $C7,
        getPayloadHash: () => qH1,
        getSigningKey: () => OC7,
        moveHeadersToQuery: () => MC7,
        prepareRequest: () => kJ8
    });
    XC7.exports = rr3(AC7);
    var aS7 = RS7(),
        fJ8 = nu6(),
        or3 = "X-Amz-Algorithm",
        ar3 = "X-Amz-Credential",
        qC7 = "X-Amz-Date",
        sr3 = "X-Amz-SignedHeaders",
        tr3 = "X-Amz-Expires",
        KC7 = "X-Amz-Signature",
        YC7 = "X-Amz-Security-Token",
        zC7 = "authorization",
        _C7 = qC7.toLowerCase(),
        er3 = "date",
        Ao3 = [zC7, _C7, er3],
        qo3 = KC7.toLowerCase(),
        vJ8 = "x-amz-content-sha256",
        Ko3 = YC7.toLowerCase(),
        Yo3 = {
            authorization: !0,
            "cache-control": !0,
            connection: !0,
            expect: !0,
            from: !0,
            "keep-alive": !0,
            "max-forwards": !0,
            pragma: !0,
            referer: !0,
            te: !0,
            trailer: !0,
            "transfer-encoding": !0,
            upgrade: !0,
            "user-agent": !0,
            "x-amzn-trace-id": !0
        },
        zo3 = /^proxy-/,
        _o3 = /^sec-/,
        TJ8 = "AWS4-HMAC-SHA256",
        wo3 = "AWS4-HMAC-SHA256-PAYLOAD",
        Oo3 = "UNSIGNED-PAYLOAD",
        $o3 = 50,
        wC7 = "aws4_request",
        Ho3 = 604800,
        fs = lS7(),
        jo3 = nu6(),
        cX6 = {},
        e$1 = [],
        AH1 = pJ((A, q, K) => `${A}/${q}/${K}/${wC7}`, "createScope"),
        OC7 = pJ(async (A, q, K, Y, z) => {
            let _ = await sS7(A, q.secretAccessKey, q.accessKeyId),
                w = `${K}:${Y}:${z}:${(0,fs.toHex)(_)}:${q.sessionToken}`;
            if (w in cX6) return cX6[w];
            e$1.push(w);
            while (e$1.length > $o3) delete cX6[e$1.shift()];
            let O = `AWS4${q.secretAccessKey}`;
            for (let $ of [K, Y, z, wC7]) O = await sS7(A, O, $);
            return cX6[w] = O
        }, "getSigningKey"),
        Jo3 = pJ(() => {
            e$1.length = 0, Object.keys(cX6).forEach((A) => {
                delete cX6[A]
            })
        }, "clearCredentialCache"),
        sS7 = pJ((A, q, K) => {
            let Y = new A(q);
            return Y.update((0, jo3.toUint8Array)(K)), Y.digest()
        }, "hmac"),
        NJ8 = pJ(({
            headers: A
        }, q, K) => {
            let Y = {};
            for (let z of Object.keys(A).sort()) {
                if (A[z] == null) continue;
                let _ = z.toLowerCase();
                if (_ in Yo3 || (q == null ? void 0 : q.has(_)) || zo3.test(_) || _o3.test(_)) {
                    if (!K || K && !K.has(_)) continue
                }
                Y[_] = A[z].trim().replace(/\s+/g, " ")
            }
            return Y
        }, "getCanonicalHeaders"),
        ru6 = oS7(),
        $C7 = pJ(({
            query: A = {}
        }) => {
            let q = [],
                K = {};
            for (let Y of Object.keys(A).sort()) {
                if (Y.toLowerCase() === qo3) continue;
                q.push(Y);
                let z = A[Y];
                if (typeof z === "string") K[Y] = `${(0,ru6.escapeUri)(Y)}=${(0,ru6.escapeUri)(z)}`;
                else if (Array.isArray(z)) K[Y] = z.slice(0).reduce((_, w) => _.concat([`${(0,ru6.escapeUri)(Y)}=${(0,ru6.escapeUri)(w)}`]), []).sort().join("&")
            }
            return q.map((Y) => K[Y]).filter((Y) => Y).join("&")
        }, "getCanonicalQuery"),
        Mo3 = XJ8(),
        Do3 = nu6(),
        qH1 = pJ(async ({
            headers: A,
            body: q
        }, K) => {
            for (let Y of Object.keys(A))
                if (Y.toLowerCase() === vJ8) return A[Y];
            if (q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof q === "string" || ArrayBuffer.isView(q) || (0, Mo3.isArrayBuffer)(q)) {
                let Y = new K;
                return Y.update((0, Do3.toUint8Array)(q)), (0, fs.toHex)(await Y.digest())
            }
            return Oo3
        }, "getPayloadHash"),
        tS7 = nu6(),
        HC7 = class {
            format(q) {
                let K = [];
                for (let _ of Object.keys(q)) {
                    let w = (0, tS7.fromUtf8)(_);
                    K.push(Uint8Array.from([w.byteLength]), w, this.formatHeaderValue(q[_]))
                }
                let Y = new Uint8Array(K.reduce((_, w) => _ + w.byteLength, 0)),
                    z = 0;
                for (let _ of K) Y.set(_, z), z += _.byteLength;
                return Y
            }
            formatHeaderValue(q) {
                switch (q.type) {
                    case "boolean":
                        return Uint8Array.from([q.value ? 0 : 1]);
                    case "byte":
                        return Uint8Array.from([2, q.value]);
                    case "short":
                        let K = new DataView(new ArrayBuffer(3));
                        return K.setUint8(0, 3), K.setInt16(1, q.value, !1), new Uint8Array(K.buffer);
                    case "integer":
                        let Y = new DataView(new ArrayBuffer(5));
                        return Y.setUint8(0, 4), Y.setInt32(1, q.value, !1), new Uint8Array(Y.buffer);
                    case "long":
                        let z = new Uint8Array(9);
                        return z[0] = 5, z.set(q.value.bytes, 1), z;
                    case "binary":
                        let _ = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                        _.setUint8(0, 6), _.setUint16(1, q.value.byteLength, !1);
                        let w = new Uint8Array(_.buffer);
                        return w.set(q.value, 3), w;
                    case "string":
                        let O = (0, tS7.fromUtf8)(q.value),
                            $ = new DataView(new ArrayBuffer(3 + O.byteLength));
                        $.setUint8(0, 7), $.setUint16(1, O.byteLength, !1);
                        let H = new Uint8Array($.buffer);
                        return H.set(O, 3), H;
                    case "timestamp":
                        let j = new Uint8Array(9);
                        return j[0] = 8, j.set(Wo3.fromNumber(q.value.valueOf()).bytes, 1), j;
                    case "uuid":
                        if (!Po3.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                        let J = new Uint8Array(17);
                        return J[0] = 9, J.set((0, fs.fromHex)(q.value.replace(/\-/g, "")), 1), J
                }
            }
        };
    pJ(HC7, "HeaderFormatter");
    var Xo3 = HC7,
        Po3 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        jC7 = class A {
            constructor(q) {
                if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(q) {
                if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
                let K = new Uint8Array(8);
                for (let Y = 7, z = Math.abs(Math.round(q)); Y > -1 && z > 0; Y--, z /= 256) K[Y] = z;
                if (q < 0) VJ8(K);
                return new A(K)
            }
            valueOf() {
                let q = this.bytes.slice(0),
                    K = q[0] & 128;
                if (K) VJ8(q);
                return parseInt((0, fs.toHex)(q), 16) * (K ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    pJ(jC7, "Int64");
    var Wo3 = jC7;

    function VJ8(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    pJ(VJ8, "negate");
    var Zo3 = pJ((A, q) => {
            A = A.toLowerCase();
            for (let K of Object.keys(q))
                if (A === K.toLowerCase()) return !0;
            return !1
        }, "hasHeader"),
        JC7 = pJ(({
            headers: A,
            query: q,
            ...K
        }) => ({
            ...K,
            headers: {
                ...A
            },
            query: q ? Go3(q) : void 0
        }), "cloneRequest"),
        Go3 = pJ((A) => Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {}), "cloneQuery"),
        MC7 = pJ((A, q = {}) => {
            var K;
            let {
                headers: Y,
                query: z = {}
            } = typeof A.clone === "function" ? A.clone() : JC7(A);
            for (let _ of Object.keys(Y)) {
                let w = _.toLowerCase();
                if (w.slice(0, 6) === "x-amz-" && !((K = q.unhoistableHeaders) == null ? void 0 : K.has(w))) z[_] = Y[_], delete Y[_]
            }
            return {
                ...A,
                headers: Y,
                query: z
            }
        }, "moveHeadersToQuery"),
        kJ8 = pJ((A) => {
            A = typeof A.clone === "function" ? A.clone() : JC7(A);
            for (let q of Object.keys(A.headers))
                if (Ao3.indexOf(q.toLowerCase()) > -1) delete A.headers[q];
            return A
        }, "prepareRequest"),
        fo3 = pJ((A) => To3(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
        To3 = pJ((A) => {
            if (typeof A === "number") return new Date(A * 1000);
            if (typeof A === "string") {
                if (Number(A)) return new Date(Number(A) * 1000);
                return new Date(A)
            }
            return A
        }, "toDate"),
        DC7 = class {
            constructor({
                applyChecksum: q,
                credentials: K,
                region: Y,
                service: z,
                sha256: _,
                uriEscapePath: w = !0
            }) {
                this.headerFormatter = new Xo3, this.service = z, this.sha256 = _, this.uriEscapePath = w, this.applyChecksum = typeof q === "boolean" ? q : !0, this.regionProvider = (0, aS7.normalizeProvider)(Y), this.credentialProvider = (0, aS7.normalizeProvider)(K)
            }
            async presign(q, K = {}) {
                let {
                    signingDate: Y = new Date,
                    expiresIn: z = 3600,
                    unsignableHeaders: _,
                    unhoistableHeaders: w,
                    signableHeaders: O,
                    signingRegion: $,
                    signingService: H
                } = K, j = await this.credentialProvider();
                this.validateResolvedCredentials(j);
                let J = $ ?? await this.regionProvider(),
                    {
                        longDate: M,
                        shortDate: D
                    } = t$1(Y);
                if (z > Ho3) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
                let X = AH1(D, J, H ?? this.service),
                    P = MC7(kJ8(q), {
                        unhoistableHeaders: w
                    });
                if (j.sessionToken) P.query[YC7] = j.sessionToken;
                P.query[or3] = TJ8, P.query[ar3] = `${j.accessKeyId}/${X}`, P.query[qC7] = M, P.query[tr3] = z.toString(10);
                let W = NJ8(P, _, O);
                return P.query[sr3] = eS7(W), P.query[KC7] = await this.getSignature(M, X, this.getSigningKey(j, J, D, H), this.createCanonicalRequest(P, W, await qH1(q, this.sha256))), P
            }
            async sign(q, K) {
                if (typeof q === "string") return this.signString(q, K);
                else if (q.headers && q.payload) return this.signEvent(q, K);
                else if (q.message) return this.signMessage(q, K);
                else return this.signRequest(q, K)
            }
            async signEvent({
                headers: q,
                payload: K
            }, {
                signingDate: Y = new Date,
                priorSignature: z,
                signingRegion: _,
                signingService: w
            }) {
                let O = _ ?? await this.regionProvider(),
                    {
                        shortDate: $,
                        longDate: H
                    } = t$1(Y),
                    j = AH1($, O, w ?? this.service),
                    J = await qH1({
                        headers: {},
                        body: K
                    }, this.sha256),
                    M = new this.sha256;
                M.update(q);
                let D = (0, fs.toHex)(await M.digest()),
                    X = [wo3, H, j, z, D, J].join(`
`);
                return this.signString(X, {
                    signingDate: Y,
                    signingRegion: O,
                    signingService: w
                })
            }
            async signMessage(q, {
                signingDate: K = new Date,
                signingRegion: Y,
                signingService: z
            }) {
                return this.signEvent({
                    headers: this.headerFormatter.format(q.message.headers),
                    payload: q.message.body
                }, {
                    signingDate: K,
                    signingRegion: Y,
                    signingService: z,
                    priorSignature: q.priorSignature
                }).then((w) => {
                    return {
                        message: q.message,
                        signature: w
                    }
                })
            }
            async signString(q, {
                signingDate: K = new Date,
                signingRegion: Y,
                signingService: z
            } = {}) {
                let _ = await this.credentialProvider();
                this.validateResolvedCredentials(_);
                let w = Y ?? await this.regionProvider(),
                    {
                        shortDate: O
                    } = t$1(K),
                    $ = new this.sha256(await this.getSigningKey(_, w, O, z));
                return $.update((0, fJ8.toUint8Array)(q)), (0, fs.toHex)(await $.digest())
            }
            async signRequest(q, {
                signingDate: K = new Date,
                signableHeaders: Y,
                unsignableHeaders: z,
                signingRegion: _,
                signingService: w
            } = {}) {
                let O = await this.credentialProvider();
                this.validateResolvedCredentials(O);
                let $ = _ ?? await this.regionProvider(),
                    H = kJ8(q),
                    {
                        longDate: j,
                        shortDate: J
                    } = t$1(K),
                    M = AH1(J, $, w ?? this.service);
                if (H.headers[_C7] = j, O.sessionToken) H.headers[Ko3] = O.sessionToken;
                let D = await qH1(H, this.sha256);
                if (!Zo3(vJ8, H.headers) && this.applyChecksum) H.headers[vJ8] = D;
                let X = NJ8(H, z, Y),
                    P = await this.getSignature(j, M, this.getSigningKey(O, $, J, w), this.createCanonicalRequest(H, X, D));
                return H.headers[zC7] = `${TJ8} Credential=${O.accessKeyId}/${M}, SignedHeaders=${eS7(X)}, Signature=${P}`, H
            }
            createCanonicalRequest(q, K, Y) {
                let z = Object.keys(K).sort();
                return `${q.method}
${this.getCanonicalPath(q)}
${$C7(q)}
${z.map((_)=>`${_}:${K[_]}`).join(`
`)}

${z.join(";")}
${Y}`
            }
            async createStringToSign(q, K, Y) {
                let z = new this.sha256;
                z.update((0, fJ8.toUint8Array)(Y));
                let _ = await z.digest();
                return `${TJ8}
${q}
${K}
${(0,fs.toHex)(_)}`
            }
            getCanonicalPath({
                path: q
            }) {
                if (this.uriEscapePath) {
                    let K = [];
                    for (let _ of q.split("/")) {
                        if ((_ == null ? void 0 : _.length) === 0) continue;
                        if (_ === ".") continue;
                        if (_ === "..") K.pop();
                        else K.push(_)
                    }
                    let Y = `${(q==null?void 0:q.startsWith("/"))?"/":""}${K.join("/")}${K.length>0&&(q==null?void 0:q.endsWith("/"))?"/":""}`;
                    return (0, ru6.escapeUri)(Y).replace(/%2F/g, "/")
                }
                return q
            }
            async getSignature(q, K, Y, z) {
                let _ = await this.createStringToSign(q, K, z),
                    w = new this.sha256(await Y);
                return w.update((0, fJ8.toUint8Array)(_)), (0, fs.toHex)(await w.digest())
            }
            getSigningKey(q, K, Y, z) {
                return OC7(this.sha256, q, Y, K, z || this.service)
            }
            validateResolvedCredentials(q) {
                if (typeof q !== "object" || typeof q.accessKeyId !== "string" || typeof q.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
            }
        };
    pJ(DC7, "SignatureV4");
    var vo3 = DC7,
        t$1 = pJ((A) => {
            let q = fo3(A).replace(/[\-:]/g, "");
            return {
                longDate: q,
                shortDate: q.slice(0, 8)
            }
        }, "formatDate"),
        eS7 = pJ((A) => Object.keys(A).sort().join(";"), "getCanonicalHeaderList")
})
// @from(Ln 167866, Col 4)
ZC7 = x((WC7) => {
    Object.defineProperty(WC7, "__esModule", {
        value: !0
    });
    WC7.propertyProviderChain = WC7.createCredentialChain = void 0;
    var No3 = vJ(),
        Vo3 = (...A) => {
            let q = -1,
                Y = Object.assign(async (z) => {
                    let _ = await WC7.propertyProviderChain(...A)(z);
                    if (!_.expiration && q !== -1) _.expiration = new Date(Date.now() + q);
                    return _
                }, {
                    expireAfter(z) {
                        if (z < 300000) throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
                        return q = z, Y
                    }
                });
            return Y
        };
    WC7.createCredentialChain = Vo3;
    var ko3 = (...A) => async (q) => {
        if (A.length === 0) throw new No3.ProviderError("No providers in chain", {
            tryNextLink: !1
        });
        let K;
        for (let Y of A) try {
            return await Y(q)
        } catch (z) {
            if (K = z, z?.tryNextLink) continue;
            throw z
        }
        throw K
    };
    WC7.propertyProviderChain = ko3
})
// @from(Ln 167902, Col 4)
IJ8 = x((Co3) => {
    Co3.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Co3.HttpAuthLocation || (Co3.HttpAuthLocation = {}));
    Co3.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Co3.HttpApiKeyAuthLocation || (Co3.HttpApiKeyAuthLocation = {}));
    Co3.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(Co3.EndpointURLScheme || (Co3.EndpointURLScheme = {}));
    Co3.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(Co3.AlgorithmId || (Co3.AlgorithmId = {}));
    var yo3 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => Co3.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => Co3.AlgorithmId.MD5,
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
        Lo3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        Ro3 = (A) => {
            return yo3(A)
        },
        ho3 = (A) => {
            return Lo3(A)
        };
    Co3.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(Co3.FieldPosition || (Co3.FieldPosition = {}));
    var So3 = "__smithy_context";
    Co3.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(Co3.IniSectionType || (Co3.IniSectionType = {}));
    Co3.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(Co3.RequestHandlerProtocol || (Co3.RequestHandlerProtocol = {}));
    Co3.SMITHY_CONTEXT_KEY = So3;
    Co3.getDefaultClientConfiguration = Ro3;
    Co3.resolveDefaultRuntimeConfig = ho3
})
// @from(Ln 167967, Col 4)
au6 = x((iX6) => {
    var TC7 = Pu(),
        BJ8 = pT(),
        xJ8 = IJ8(),
        uo3 = dO(),
        GC7 = FT();
    class vC7 {
        config;
        middlewareStack = TC7.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var bJ8 = "***SensitiveInformation***";

    function uJ8(A, q) {
        if (q == null) return q;
        let K = uo3.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return bJ8;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return bJ8
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return bJ8
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = uJ8(w, Y[_]);
            return z
        }
        return q
    }
    class gJ8 {
        middlewareStack = TC7.constructStack();
        schema;
        static classBuilder() {
            return new NC7
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [xJ8.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class NC7 {
        _init = () => {};
        _ep = {};
        _middlewareFn = () => [];
        _commandName = "";
        _clientName = "";
        _additionalContext = {};
        _smithyContext = {};
        _inputFilterSensitiveLog = void 0;
        _outputFilterSensitiveLog = void 0;
        _serializer = null;
        _deserializer = null;
        _operationSchema;
        init(A) {
            this._init = A
        }
        ep(A) {
            return this._ep = A, this
        }
        m(A) {
            return this._middlewareFn = A, this
        }
        s(A, q, K = {}) {
            return this._smithyContext = {
                service: A,
                operation: q,
                ...K
            }, this
        }
        c(A = {}) {
            return this._additionalContext = A, this
        }
        n(A, q) {
            return this._clientName = A, this._commandName = q, this
        }
        f(A = (K) => K, q = (K) => K) {
            return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = q, this
        }
        ser(A) {
            return this._serializer = A, this
        }
        de(A) {
            return this._deserializer = A, this
        }
        sc(A) {
            return this._operationSchema = A, this._smithyContext.operationSchema = A, this
        }
        build() {
            let A = this,
                q;
            return q = class extends gJ8 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? uJ8.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? uJ8.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var mo3 = "***SensitiveInformation***",
        Bo3 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class lX6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(A) {
            super(A.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return lX6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === lX6) return lX6.isInstance(A);
            if (lX6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var VC7 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        kC7 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = Fo3(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw VC7(w, q)
        },
        go3 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                kC7({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        Fo3 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        po3 = (A) => {
            switch (A) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        },
        fC7 = !1,
        Qo3 = (A) => {
            if (A && !fC7 && parseInt(A.substring(1, A.indexOf("."))) < 16) fC7 = !0
        },
        Uo3 = (A) => {
            let q = [];
            for (let K in xJ8.AlgorithmId) {
                let Y = xJ8.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        do3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        co3 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        lo3 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        EC7 = (A) => {
            return Object.assign(Uo3(A), co3(A))
        },
        io3 = EC7,
        no3 = (A) => {
            return Object.assign(do3(A), lo3(A))
        },
        ro3 = (A) => Array.isArray(A) ? A : [A],
        yC7 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = yC7(A[K]);
            return A
        },
        oo3 = (A) => {
            return A != null
        };
    class LC7 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function RC7(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, to3(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            hC7(Y, null, _, w)
        }
        return Y
    }
    var ao3 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        so3 = (A, q) => {
            let K = {};
            for (let Y in q) hC7(K, A, q, Y);
            return K
        },
        to3 = (A, q, K) => {
            return RC7(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        hC7 = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = eo3, $ = Aa3, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        eo3 = (A) => A != null,
        Aa3 = (A) => A,
        qa3 = (A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        },
        Ka3 = (A) => A.toISOString().replace(".000Z", "Z"),
        mJ8 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(mJ8);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = mJ8(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(iX6, "collectBody", {
        enumerable: !0,
        get: function() {
            return BJ8.collectBody
        }
    });
    Object.defineProperty(iX6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return BJ8.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(iX6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return BJ8.resolvedPath
        }
    });
    iX6.Client = vC7;
    iX6.Command = gJ8;
    iX6.NoOpLogger = LC7;
    iX6.SENSITIVE_STRING = mo3;
    iX6.ServiceException = lX6;
    iX6._json = mJ8;
    iX6.convertMap = ao3;
    iX6.createAggregatedClient = Bo3;
    iX6.decorateServiceException = VC7;
    iX6.emitWarningIfUnsupportedVersion = Qo3;
    iX6.getArrayIfSingleItem = ro3;
    iX6.getDefaultClientConfiguration = io3;
    iX6.getDefaultExtensionConfiguration = EC7;
    iX6.getValueFromTextNode = yC7;
    iX6.isSerializableHeaderValue = oo3;
    iX6.loadConfigsForDefaultMode = po3;
    iX6.map = RC7;
    iX6.resolveDefaultRuntimeConfig = no3;
    iX6.serializeDateTime = Ka3;
    iX6.serializeFloat = qa3;
    iX6.take = so3;
    iX6.throwDefaultError = kC7;
    iX6.withBaseException = go3;
    Object.keys(GC7).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(iX6, A)) Object.defineProperty(iX6, A, {
            enumerable: !0,
            get: function() {
                return GC7[A]
            }
        })
    })
})
// @from(Ln 168437, Col 4)
pJ8 = x((SC7) => {
    Object.defineProperty(SC7, "__esModule", {
        value: !0
    });
    SC7.resolveHttpAuthSchemeConfig = SC7.defaultCognitoIdentityHttpAuthSchemeProvider = SC7.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
    var ya3 = Nw(),
        FJ8 = VW(),
        La3 = async (A, q, K) => {
            return {
                operation: (0, FJ8.getSmithyContext)(q).operation,
                region: await (0, FJ8.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    SC7.defaultCognitoIdentityHttpAuthSchemeParametersProvider = La3;

    function Ra3(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "cognito-identity",
                region: A.region
            },
            propertiesExtractor: (q, K) => ({
                signingProperties: {
                    config: q,
                    context: K
                }
            })
        }
    }

    function YH1(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var ha3 = (A) => {
        let q = [];
        switch (A.operation) {
            case "GetCredentialsForIdentity": {
                q.push(YH1(A));
                break
            }
            case "GetId": {
                q.push(YH1(A));
                break
            }
            case "GetOpenIdToken": {
                q.push(YH1(A));
                break
            }
            case "UnlinkIdentity": {
                q.push(YH1(A));
                break
            }
            default:
                q.push(Ra3(A))
        }
        return q
    };
    SC7.defaultCognitoIdentityHttpAuthSchemeProvider = ha3;
    var Sa3 = (A) => {
        let q = (0, ya3.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, FJ8.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    SC7.resolveHttpAuthSchemeConfig = Sa3
})
// @from(Ln 168508, Col 4)
IC7 = x((JY2, ba3) => {
    ba3.exports = {
        name: "@aws-sdk/client-cognito-identity",
        description: "AWS SDK for JavaScript Cognito Identity Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-cognito-identity",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo cognito-identity",
            "test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts --mode development",
            "test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts"
        },
        main: "./dist-cjs/index.js",
        types: "./dist-types/index.d.ts",
        module: "./dist-es/index.js",
        sideEffects: !1,
        dependencies: {
            "@aws-crypto/sha256-browser": "5.2.0",
            "@aws-crypto/sha256-js": "5.2.0",
            "@aws-sdk/core": "3.936.0",
            "@aws-sdk/credential-provider-node": "3.936.0",
            "@aws-sdk/middleware-host-header": "3.936.0",
            "@aws-sdk/middleware-logger": "3.936.0",
            "@aws-sdk/middleware-recursion-detection": "3.936.0",
            "@aws-sdk/middleware-user-agent": "3.936.0",
            "@aws-sdk/region-config-resolver": "3.936.0",
            "@aws-sdk/types": "3.936.0",
            "@aws-sdk/util-endpoints": "3.936.0",
            "@aws-sdk/util-user-agent-browser": "3.936.0",
            "@aws-sdk/util-user-agent-node": "3.936.0",
            "@smithy/config-resolver": "^4.4.3",
            "@smithy/core": "^3.18.5",
            "@smithy/fetch-http-handler": "^5.3.6",
            "@smithy/hash-node": "^4.2.5",
            "@smithy/invalid-dependency": "^4.2.5",
            "@smithy/middleware-content-length": "^4.2.5",
            "@smithy/middleware-endpoint": "^4.3.12",
            "@smithy/middleware-retry": "^4.4.12",
            "@smithy/middleware-serde": "^4.2.6",
            "@smithy/middleware-stack": "^4.2.5",
            "@smithy/node-config-provider": "^4.3.5",
            "@smithy/node-http-handler": "^4.4.5",
            "@smithy/protocol-http": "^5.3.5",
            "@smithy/smithy-client": "^4.9.8",
            "@smithy/types": "^4.9.0",
            "@smithy/url-parser": "^4.2.5",
            "@smithy/util-base64": "^4.3.0",
            "@smithy/util-body-length-browser": "^4.2.0",
            "@smithy/util-body-length-node": "^4.2.1",
            "@smithy/util-defaults-mode-browser": "^4.3.11",
            "@smithy/util-defaults-mode-node": "^4.2.14",
            "@smithy/util-endpoints": "^3.2.5",
            "@smithy/util-middleware": "^4.2.5",
            "@smithy/util-retry": "^4.2.5",
            "@smithy/util-utf8": "^4.2.0",
            tslib: "^2.6.2"
        },
        devDependencies: {
            "@aws-sdk/client-iam": "3.936.0",
            "@tsconfig/node18": "18.2.4",
            "@types/chai": "^4.2.11",
            "@types/node": "^18.19.69",
            concurrently: "7.0.0",
            "downlevel-dts": "0.10.1",
            rimraf: "3.0.2",
            typescript: "~5.8.3"
        },
        engines: {
            node: ">=18.0.0"
        },
        typesVersions: {
            "<4.0": {
                "dist-types/*": ["dist-types/ts3.4/*"]
            }
        },
        files: ["dist-*/**"],
        author: {
            name: "AWS SDK for JavaScript Team",
            url: "https://aws.amazon.com/javascript/"
        },
        license: "Apache-2.0",
        browser: {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
        },
        "react-native": {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
        },
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cognito-identity",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-cognito-identity"
        }
    }
})
// @from(Ln 168609, Col 4)
bC7 = x((ua3) => {
    var xa3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    ua3.isArrayBuffer = xa3
})
// @from(Ln 168613, Col 4)
UJ8 = x((pa3) => {
    var Ba3 = bC7(),
        QJ8 = x6("buffer"),
        ga3 = (A, q = 0, K = A.byteLength - q) => {
            if (!Ba3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return QJ8.Buffer.from(A, q, K)
        },
        Fa3 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? QJ8.Buffer.from(A, q) : QJ8.Buffer.from(A)
        };
    pa3.fromArrayBuffer = ga3;
    pa3.fromString = Fa3
})
// @from(Ln 168627, Col 4)
mC7 = x((xC7) => {
    Object.defineProperty(xC7, "__esModule", {
        value: !0
    });
    xC7.fromBase64 = void 0;
    var da3 = UJ8(),
        ca3 = /^[A-Za-z0-9+/]*={0,2}$/,
        la3 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!ca3.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, da3.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    xC7.fromBase64 = la3
})
// @from(Ln 168642, Col 4)
FC7 = x((BC7) => {
    Object.defineProperty(BC7, "__esModule", {
        value: !0
    });
    BC7.toBase64 = void 0;
    var ia3 = UJ8(),
        na3 = C_(),
        ra3 = (A) => {
            let q;
            if (typeof A === "string") q = (0, na3.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, ia3.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    BC7.toBase64 = ra3
})
// @from(Ln 168658, Col 4)
UC7 = x((su6) => {
    var pC7 = mC7(),
        QC7 = FC7();
    Object.keys(pC7).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(su6, A)) Object.defineProperty(su6, A, {
            enumerable: !0,
            get: function() {
                return pC7[A]
            }
        })
    });
    Object.keys(QC7).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(su6, A)) Object.defineProperty(su6, A, {
            enumerable: !0,
            get: function() {
                return QC7[A]
            }
        })
    })
})
// @from(Ln 168678, Col 4)
_I7 = x((YI7) => {
    Object.defineProperty(YI7, "__esModule", {
        value: !0
    });
    YI7.ruleSet = void 0;
    var eC7 = "required",
        dW = "fn",
        cW = "argv",
        rX6 = "ref",
        dC7 = !0,
        cC7 = "isSet",
        Am6 = "booleanEquals",
        nX6 = "error",
        Cm = "endpoint",
        pU = "tree",
        dJ8 = "PartitionResult",
        cJ8 = "getAttr",
        tu6 = "stringEquals",
        lC7 = {
            [eC7]: !1,
            type: "string"
        },
        iC7 = {
            [eC7]: !0,
            default: !1,
            type: "boolean"
        },
        nC7 = {
            [rX6]: "Endpoint"
        },
        AI7 = {
            [dW]: Am6,
            [cW]: [{
                [rX6]: "UseFIPS"
            }, !0]
        },
        qI7 = {
            [dW]: Am6,
            [cW]: [{
                [rX6]: "UseDualStack"
            }, !0]
        },
        QJ = {},
        eu6 = {
            [rX6]: "Region"
        },
        rC7 = {
            [dW]: cJ8,
            [cW]: [{
                [rX6]: dJ8
            }, "supportsFIPS"]
        },
        KI7 = {
            [rX6]: dJ8
        },
        oC7 = {
            [dW]: Am6,
            [cW]: [!0, {
                [dW]: cJ8,
                [cW]: [KI7, "supportsDualStack"]
            }]
        },
        aC7 = [AI7],
        sC7 = [qI7],
        tC7 = [eu6],
        oa3 = {
            version: "1.0",
            parameters: {
                Region: lC7,
                UseDualStack: iC7,
                UseFIPS: iC7,
                Endpoint: lC7
            },
            rules: [{
                conditions: [{
                    [dW]: cC7,
                    [cW]: [nC7]
                }],
                rules: [{
                    conditions: aC7,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: nX6
                }, {
                    conditions: sC7,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: nX6
                }, {
                    endpoint: {
                        url: nC7,
                        properties: QJ,
                        headers: QJ
                    },
                    type: Cm
                }],
                type: pU
            }, {
                conditions: [{
                    [dW]: cC7,
                    [cW]: tC7
                }],
                rules: [{
                    conditions: [{
                        [dW]: "aws.partition",
                        [cW]: tC7,
                        assign: dJ8
                    }],
                    rules: [{
                        conditions: [AI7, qI7],
                        rules: [{
                            conditions: [{
                                [dW]: Am6,
                                [cW]: [dC7, rC7]
                            }, oC7],
                            rules: [{
                                conditions: [{
                                    [dW]: tu6,
                                    [cW]: [eu6, "us-east-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }, {
                                conditions: [{
                                    [dW]: tu6,
                                    [cW]: [eu6, "us-east-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }, {
                                conditions: [{
                                    [dW]: tu6,
                                    [cW]: [eu6, "us-west-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }, {
                                conditions: [{
                                    [dW]: tu6,
                                    [cW]: [eu6, "us-west-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }],
                            type: pU
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: nX6
                        }],
                        type: pU
                    }, {
                        conditions: aC7,
                        rules: [{
                            conditions: [{
                                [dW]: Am6,
                                [cW]: [rC7, dC7]
                            }],
                            rules: [{
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }],
                            type: pU
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: nX6
                        }],
                        type: pU
                    }, {
                        conditions: sC7,
                        rules: [{
                            conditions: [oC7],
                            rules: [{
                                conditions: [{
                                    [dW]: tu6,
                                    [cW]: ["aws", {
                                        [dW]: cJ8,
                                        [cW]: [KI7, "name"]
                                    }]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.amazonaws.com",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: QJ,
                                    headers: QJ
                                },
                                type: Cm
                            }],
                            type: pU
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: nX6
                        }],
                        type: pU
                    }, {
                        endpoint: {
                            url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
                            properties: QJ,
                            headers: QJ
                        },
                        type: Cm
                    }],
                    type: pU
                }],
                type: pU
            }, {
                error: "Invalid Configuration: Missing Region",
                type: nX6
            }]
        };
    YI7.ruleSet = oa3
})
// @from(Ln 168920, Col 4)
$I7 = x((wI7) => {
    Object.defineProperty(wI7, "__esModule", {
        value: !0
    });
    wI7.defaultEndpointResolver = void 0;
    var aa3 = Zu(),
        lJ8 = nS(),
        sa3 = _I7(),
        ta3 = new lJ8.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        ea3 = (A, q = {}) => {
            return ta3.get(A, () => (0, lJ8.resolveEndpoint)(sa3.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    wI7.defaultEndpointResolver = ea3;
    lJ8.customEndpointFunctions.aws = aa3.awsEndpointFunctions
})
// @from(Ln 168941, Col 4)
DI7 = x((JI7) => {
    Object.defineProperty(JI7, "__esModule", {
        value: !0
    });
    JI7.getRuntimeConfig = void 0;
    var As3 = Nw(),
        qs3 = RQ(),
        Ks3 = w_(),
        Ys3 = au6(),
        zs3 = hy(),
        HI7 = UC7(),
        jI7 = C_(),
        _s3 = pJ8(),
        ws3 = $I7(),
        Os3 = (A) => {
            return {
                apiVersion: "2014-06-30",
                base64Decoder: A?.base64Decoder ?? HI7.fromBase64,
                base64Encoder: A?.base64Encoder ?? HI7.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? ws3.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? _s3.defaultCognitoIdentityHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new As3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new Ks3.NoAuthSigner
                }],
                logger: A?.logger ?? new Ys3.NoOpLogger,
                protocol: A?.protocol ?? new qs3.AwsJson1_1Protocol({
                    defaultNamespace: "com.amazonaws.cognitoidentity",
                    serviceTarget: "AWSCognitoIdentityService",
                    awsQueryCompatible: !1
                }),
                serviceId: A?.serviceId ?? "Cognito Identity",
                urlParser: A?.urlParser ?? zs3.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? jI7.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? jI7.toUtf8
            }
        };
    JI7.getRuntimeConfig = Os3
})
// @from(Ln 168987, Col 4)
TI7 = x((GI7) => {
    Object.defineProperty(GI7, "__esModule", {
        value: !0
    });
    GI7.getRuntimeConfig = void 0;
    var $s3 = _2(),
        Hs3 = $s3.__importDefault(IC7()),
        XI7 = Nw(),
        js3 = P46(),
        PI7 = kQ(),
        zH1 = Nj(),
        Js3 = EQ(),
        WI7 = kP(),
        xK6 = BT(),
        ZI7 = uT(),
        Ms3 = yQ(),
        Ds3 = Tu(),
        Xs3 = DI7(),
        Ps3 = au6(),
        Ws3 = SQ(),
        Zs3 = au6(),
        Gs3 = (A) => {
            (0, Zs3.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, Ws3.resolveDefaultsModeConfig)(A),
                K = () => q().then(Ps3.loadConfigsForDefaultMode),
                Y = (0, Xs3.getRuntimeConfig)(A);
            (0, XI7.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, xK6.loadConfig)(XI7.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? Ms3.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? js3.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, PI7.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: Hs3.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, xK6.loadConfig)(WI7.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, xK6.loadConfig)(zH1.NODE_REGION_CONFIG_OPTIONS, {
                    ...zH1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: ZI7.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, xK6.loadConfig)({
                    ...WI7.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || Ds3.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? Js3.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? ZI7.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, xK6.loadConfig)(zH1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, xK6.loadConfig)(zH1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, xK6.loadConfig)(PI7.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    GI7.getRuntimeConfig = Gs3
})