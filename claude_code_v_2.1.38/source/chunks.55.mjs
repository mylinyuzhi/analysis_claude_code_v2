
// @from(Ln 143997, Col 4)
eK7 = R((GV2, tK7) => {
    var {
        defineProperty: L36,
        getOwnPropertyDescriptor: TL5,
        getOwnPropertyNames: vL5
    } = Object, EL5 = Object.prototype.hasOwnProperty, kL5 = (A, q) => L36(A, "name", {
        value: q,
        configurable: !0
    }), LL5 = (A, q) => {
        for (var K in q) L36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, RL5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of vL5(q))
                if (!EL5.call(A, z) && z !== K) L36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = TL5(q, z)) || Y.enumerable
                })
        }
        return A
    }, yL5 = (A) => RL5(L36({}, "__esModule", {
        value: !0
    }), A), aK7 = {};
    LL5(aK7, {
        buildQueryString: () => sK7
    });
    tK7.exports = yL5(aK7);
    var $KA = oK7();

    function sK7(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = (0, $KA.escapeUri)(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${(0,$KA.escapeUri)(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${(0,$KA.escapeUri)(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    kL5(sK7, "buildQueryString")
})
// @from(Ln 144044, Col 4)
A37 = R((SL5) => {
    var CL5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    SL5.isArrayBuffer = CL5
})
// @from(Ln 144048, Col 4)
_KA = R((uL5) => {
    var IL5 = A37(),
        OKA = h1("buffer"),
        xL5 = (A, q = 0, K = A.byteLength - q) => {
            if (!IL5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return OKA.Buffer.from(A, q, K)
        },
        bL5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? OKA.Buffer.from(A, q) : OKA.Buffer.from(A)
        };
    uL5.fromArrayBuffer = xL5;
    uL5.fromString = bL5
})
// @from(Ln 144062, Col 4)
Y37 = R((q37) => {
    Object.defineProperty(q37, "__esModule", {
        value: !0
    });
    q37.fromBase64 = void 0;
    var FL5 = _KA(),
        QL5 = /^[A-Za-z0-9+/]*={0,2}$/,
        gL5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!QL5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, FL5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    q37.fromBase64 = gL5
})
// @from(Ln 144077, Col 4)
H37 = R((z37) => {
    Object.defineProperty(z37, "__esModule", {
        value: !0
    });
    z37.toBase64 = void 0;
    var UL5 = _KA(),
        pL5 = Z2(),
        dL5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, pL5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, UL5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    z37.toBase64 = dL5
})
// @from(Ln 144093, Col 4)
_37 = R((TV2, R36) => {
    var {
        defineProperty: $37,
        getOwnPropertyDescriptor: cL5,
        getOwnPropertyNames: lL5
    } = Object, iL5 = Object.prototype.hasOwnProperty, JKA = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of lL5(q))
                if (!iL5.call(A, z) && z !== K) $37(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = cL5(q, z)) || Y.enumerable
                })
        }
        return A
    }, O37 = (A, q, K) => (JKA(A, q, "default"), K && JKA(K, q, "default")), nL5 = (A) => JKA($37({}, "__esModule", {
        value: !0
    }), A), XKA = {};
    R36.exports = nL5(XKA);
    O37(XKA, Y37(), R36.exports);
    O37(XKA, H37(), R36.exports)
})
// @from(Ln 144114, Col 4)
jKA = R((vV2, W37) => {
    var {
        defineProperty: C36,
        getOwnPropertyDescriptor: rL5,
        getOwnPropertyNames: oL5
    } = Object, aL5 = Object.prototype.hasOwnProperty, fu = (A, q) => C36(A, "name", {
        value: q,
        configurable: !0
    }), sL5 = (A, q) => {
        for (var K in q) C36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, tL5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of oL5(q))
                if (!aL5.call(A, z) && z !== K) C36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = rL5(q, z)) || Y.enumerable
                })
        }
        return A
    }, eL5 = (A) => tL5(C36({}, "__esModule", {
        value: !0
    }), A), X37 = {};
    sL5(X37, {
        FetchHttpHandler: () => qR5,
        keepAliveSupport: () => y36,
        streamCollector: () => YR5
    });
    W37.exports = eL5(X37);
    var J37 = lK7(),
        AR5 = eK7();

    function DKA(A, q) {
        return new Request(A, q)
    }
    fu(DKA, "createRequest");

    function D37(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    fu(D37, "requestTimeout");
    var y36 = {
            supported: void 0
        },
        qR5 = class A {
            static {
                fu(this, "FetchHttpHandler")
            }
            static create(q) {
                if (typeof q?.handle === "function") return q;
                return new A(q)
            }
            constructor(q) {
                if (typeof q === "function") this.configProvider = q().then((K) => K || {});
                else this.config = q ?? {}, this.configProvider = Promise.resolve(this.config);
                if (y36.supported === void 0) y36.supported = Boolean(typeof Request < "u" && "keepalive" in DKA("https://[::1]"))
            }
            destroy() {}
            async handle(q, {
                abortSignal: K
            } = {}) {
                if (!this.config) this.config = await this.configProvider;
                let Y = this.config.requestTimeout,
                    z = this.config.keepAlive === !0,
                    w = this.config.credentials;
                if (K?.aborted) {
                    let G = Error("Request aborted");
                    return G.name = "AbortError", Promise.reject(G)
                }
                let H = q.path,
                    $ = (0, AR5.buildQueryString)(q.query || {});
                if ($) H += `?${$}`;
                if (q.fragment) H += `#${q.fragment}`;
                let O = "";
                if (q.username != null || q.password != null) {
                    let G = q.username ?? "",
                        f = q.password ?? "";
                    O = `${G}:${f}@`
                }
                let {
                    port: _,
                    method: J
                } = q, X = `${q.protocol}//${O}${q.hostname}${_?`:${_}`:""}${H}`, D = J === "GET" || J === "HEAD" ? void 0 : q.body, j = {
                    body: D,
                    headers: new Headers(q.headers),
                    method: J,
                    credentials: w
                };
                if (this.config?.cache) j.cache = this.config.cache;
                if (D) j.duplex = "half";
                if (typeof AbortController < "u") j.signal = K;
                if (y36.supported) j.keepalive = z;
                if (typeof this.config.requestInit === "function") Object.assign(j, this.config.requestInit(q));
                let M = fu(() => {}, "removeSignalEventListener"),
                    P = DKA(X, j),
                    W = [fetch(P).then((G) => {
                        let f = G.headers,
                            Z = {};
                        for (let T of f.entries()) Z[T[0]] = T[1];
                        if (G.body == null) return G.blob().then((T) => ({
                            response: new J37.HttpResponse({
                                headers: Z,
                                reason: G.statusText,
                                statusCode: G.status,
                                body: T
                            })
                        }));
                        return {
                            response: new J37.HttpResponse({
                                headers: Z,
                                reason: G.statusText,
                                statusCode: G.status,
                                body: G.body
                            })
                        }
                    }), D37(Y)];
                if (K) W.push(new Promise((G, f) => {
                    let Z = fu(() => {
                        let N = Error("Request aborted");
                        N.name = "AbortError", f(N)
                    }, "onAbort");
                    if (typeof K.addEventListener === "function") {
                        let N = K;
                        N.addEventListener("abort", Z, {
                            once: !0
                        }), M = fu(() => N.removeEventListener("abort", Z), "removeSignalEventListener")
                    } else K.onabort = Z
                }));
                return Promise.race(W).finally(M)
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
        KR5 = _37(),
        YR5 = fu(async (A) => {
            if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
                if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
                return j37(A)
            }
            return M37(A)
        }, "streamCollector");
    async function j37(A) {
        let q = await P37(A),
            K = (0, KR5.fromBase64)(q);
        return new Uint8Array(K)
    }
    fu(j37, "collectBlob");
    async function M37(A) {
        let q = [],
            K = A.getReader(),
            Y = !1,
            z = 0;
        while (!Y) {
            let {
                done: $,
                value: O
            } = await K.read();
            if (O) q.push(O), z += O.length;
            Y = $
        }
        let w = new Uint8Array(z),
            H = 0;
        for (let $ of q) w.set($, H), H += $.length;
        return w
    }
    fu(M37, "collectStream");

    function P37(A) {
        return new Promise((q, K) => {
            let Y = new FileReader;
            Y.onloadend = () => {
                if (Y.readyState !== 2) return K(Error("Reader aborted too early"));
                let z = Y.result ?? "",
                    w = z.indexOf(","),
                    H = w > -1 ? w + 1 : z.length;
                q(z.substring(H))
            }, Y.onabort = () => K(Error("Read aborted")), Y.onerror = () => K(Y.error), Y.readAsDataURL(A)
        })
    }
    fu(P37, "readToBase64")
})
// @from(Ln 144308, Col 4)
MKA = R((EV2, k37) => {
    var {
        defineProperty: S36,
        getOwnPropertyDescriptor: zR5,
        getOwnPropertyNames: wR5
    } = Object, HR5 = Object.prototype.hasOwnProperty, h36 = (A, q) => S36(A, "name", {
        value: q,
        configurable: !0
    }), $R5 = (A, q) => {
        for (var K in q) S36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, OR5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of wR5(q))
                if (!HR5.call(A, z) && z !== K) S36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = zR5(q, z)) || Y.enumerable
                })
        }
        return A
    }, _R5 = (A) => OR5(S36({}, "__esModule", {
        value: !0
    }), A), G37 = {};
    $R5(G37, {
        AlgorithmId: () => N37,
        EndpointURLScheme: () => V37,
        FieldPosition: () => T37,
        HttpApiKeyAuthLocation: () => f37,
        HttpAuthLocation: () => Z37,
        IniSectionType: () => v37,
        RequestHandlerProtocol: () => E37,
        SMITHY_CONTEXT_KEY: () => MR5,
        getDefaultClientConfiguration: () => DR5,
        resolveDefaultRuntimeConfig: () => jR5
    });
    k37.exports = _R5(G37);
    var Z37 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(Z37 || {}),
        f37 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(f37 || {}),
        V37 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(V37 || {}),
        N37 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(N37 || {}),
        JR5 = h36((A) => {
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
        XR5 = h36((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        DR5 = h36((A) => {
            return {
                ...JR5(A)
            }
        }, "getDefaultClientConfiguration"),
        jR5 = h36((A) => {
            return {
                ...XR5(A)
            }
        }, "resolveDefaultRuntimeConfig"),
        T37 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(T37 || {}),
        MR5 = "__smithy_context",
        v37 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(v37 || {}),
        E37 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(E37 || {})
})
// @from(Ln 144405, Col 4)
PKA = R((kV2, x37) => {
    var {
        defineProperty: I36,
        getOwnPropertyDescriptor: PR5,
        getOwnPropertyNames: WR5
    } = Object, GR5 = Object.prototype.hasOwnProperty, Sr = (A, q) => I36(A, "name", {
        value: q,
        configurable: !0
    }), ZR5 = (A, q) => {
        for (var K in q) I36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, fR5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of WR5(q))
                if (!GR5.call(A, z) && z !== K) I36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = PR5(q, z)) || Y.enumerable
                })
        }
        return A
    }, VR5 = (A) => fR5(I36({}, "__esModule", {
        value: !0
    }), A), L37 = {};
    ZR5(L37, {
        Field: () => ER5,
        Fields: () => kR5,
        HttpRequest: () => LR5,
        HttpResponse: () => RR5,
        getHttpHandlerExtensionConfiguration: () => NR5,
        isValidHostname: () => I37,
        resolveHttpHandlerRuntimeConfig: () => TR5
    });
    x37.exports = VR5(L37);
    var NR5 = Sr((A) => {
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
        TR5 = Sr((A) => {
            return {
                httpHandler: A.httpHandler()
            }
        }, "resolveHttpHandlerRuntimeConfig"),
        vR5 = MKA(),
        R37 = class {
            constructor({
                name: q,
                kind: K = vR5.FieldPosition.HEADER,
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
    Sr(R37, "Field");
    var ER5 = R37,
        y37 = class {
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
    Sr(y37, "Fields");
    var kR5 = y37,
        C37 = class A {
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
                if (q.query) q.query = S37(q.query);
                return q
            }
        };
    Sr(C37, "HttpRequest");
    var LR5 = C37;

    function S37(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    Sr(S37, "cloneQuery");
    var h37 = class {
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    };
    Sr(h37, "HttpResponse");
    var RR5 = h37;

    function I37(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Sr(I37, "isValidHostname")
})
// @from(Ln 144562, Col 4)
d37 = R((LV2, p37) => {
    var {
        defineProperty: x36,
        getOwnPropertyDescriptor: yR5,
        getOwnPropertyNames: CR5
    } = Object, SR5 = Object.prototype.hasOwnProperty, b36 = (A, q) => x36(A, "name", {
        value: q,
        configurable: !0
    }), hR5 = (A, q) => {
        for (var K in q) x36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, IR5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of CR5(q))
                if (!SR5.call(A, z) && z !== K) x36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = yR5(q, z)) || Y.enumerable
                })
        }
        return A
    }, xR5 = (A) => IR5(x36({}, "__esModule", {
        value: !0
    }), A), b37 = {};
    hR5(b37, {
        AlgorithmId: () => F37,
        EndpointURLScheme: () => m37,
        FieldPosition: () => Q37,
        HttpApiKeyAuthLocation: () => B37,
        HttpAuthLocation: () => u37,
        IniSectionType: () => g37,
        RequestHandlerProtocol: () => U37,
        SMITHY_CONTEXT_KEY: () => FR5,
        getDefaultClientConfiguration: () => BR5,
        resolveDefaultRuntimeConfig: () => mR5
    });
    p37.exports = xR5(b37);
    var u37 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(u37 || {}),
        B37 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(B37 || {}),
        m37 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(m37 || {}),
        F37 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(F37 || {}),
        bR5 = b36((A) => {
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
        uR5 = b36((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        BR5 = b36((A) => {
            return {
                ...bR5(A)
            }
        }, "getDefaultClientConfiguration"),
        mR5 = b36((A) => {
            return {
                ...uR5(A)
            }
        }, "resolveDefaultRuntimeConfig"),
        Q37 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(Q37 || {}),
        FR5 = "__smithy_context",
        g37 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(g37 || {}),
        U37 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(U37 || {})
})
// @from(Ln 144659, Col 4)
r37 = R((RV2, n37) => {
    var {
        defineProperty: u36,
        getOwnPropertyDescriptor: QR5,
        getOwnPropertyNames: gR5
    } = Object, UR5 = Object.prototype.hasOwnProperty, l37 = (A, q) => u36(A, "name", {
        value: q,
        configurable: !0
    }), pR5 = (A, q) => {
        for (var K in q) u36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, dR5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of gR5(q))
                if (!UR5.call(A, z) && z !== K) u36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = QR5(q, z)) || Y.enumerable
                })
        }
        return A
    }, cR5 = (A) => dR5(u36({}, "__esModule", {
        value: !0
    }), A), i37 = {};
    pR5(i37, {
        getSmithyContext: () => lR5,
        normalizeProvider: () => iR5
    });
    n37.exports = cR5(i37);
    var c37 = d37(),
        lR5 = l37((A) => A[c37.SMITHY_CONTEXT_KEY] || (A[c37.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
        iR5 = l37((A) => {
            if (typeof A === "function") return A;
            let q = Promise.resolve(A);
            return () => q
        }, "normalizeProvider")
})
// @from(Ln 144697, Col 4)
WKA = R((yV2, a37) => {
    var {
        defineProperty: B36,
        getOwnPropertyDescriptor: nR5,
        getOwnPropertyNames: rR5
    } = Object, oR5 = Object.prototype.hasOwnProperty, aR5 = (A, q) => B36(A, "name", {
        value: q,
        configurable: !0
    }), sR5 = (A, q) => {
        for (var K in q) B36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, tR5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of rR5(q))
                if (!oR5.call(A, z) && z !== K) B36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = nR5(q, z)) || Y.enumerable
                })
        }
        return A
    }, eR5 = (A) => tR5(B36({}, "__esModule", {
        value: !0
    }), A), o37 = {};
    sR5(o37, {
        isArrayBuffer: () => Ay5
    });
    a37.exports = eR5(o37);
    var Ay5 = aR5((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 144728, Col 4)
A57 = R((CV2, e37) => {
    var {
        defineProperty: m36,
        getOwnPropertyDescriptor: qy5,
        getOwnPropertyNames: Ky5
    } = Object, Yy5 = Object.prototype.hasOwnProperty, s37 = (A, q) => m36(A, "name", {
        value: q,
        configurable: !0
    }), zy5 = (A, q) => {
        for (var K in q) m36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, wy5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Ky5(q))
                if (!Yy5.call(A, z) && z !== K) m36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = qy5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Hy5 = (A) => wy5(m36({}, "__esModule", {
        value: !0
    }), A), t37 = {};
    zy5(t37, {
        fromArrayBuffer: () => Oy5,
        fromString: () => _y5
    });
    e37.exports = Hy5(t37);
    var $y5 = WKA(),
        GKA = h1("buffer"),
        Oy5 = s37((A, q = 0, K = A.byteLength - q) => {
            if (!(0, $y5.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return GKA.Buffer.from(A, q, K)
        }, "fromArrayBuffer"),
        _y5 = s37((A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? GKA.Buffer.from(A, q) : GKA.Buffer.from(A)
        }, "fromString")
})
// @from(Ln 144769, Col 4)
zS1 = R((SV2, z57) => {
    var {
        defineProperty: F36,
        getOwnPropertyDescriptor: Jy5,
        getOwnPropertyNames: Xy5
    } = Object, Dy5 = Object.prototype.hasOwnProperty, ZKA = (A, q) => F36(A, "name", {
        value: q,
        configurable: !0
    }), jy5 = (A, q) => {
        for (var K in q) F36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, My5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Xy5(q))
                if (!Dy5.call(A, z) && z !== K) F36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Jy5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Py5 = (A) => My5(F36({}, "__esModule", {
        value: !0
    }), A), q57 = {};
    jy5(q57, {
        fromUtf8: () => Y57,
        toUint8Array: () => Wy5,
        toUtf8: () => Gy5
    });
    z57.exports = Py5(q57);
    var K57 = A57(),
        Y57 = ZKA((A) => {
            let q = (0, K57.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        Wy5 = ZKA((A) => {
            if (typeof A === "string") return Y57(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        Gy5 = ZKA((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, K57.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 144816, Col 4)
X57 = R((hV2, J57) => {
    var {
        defineProperty: Q36,
        getOwnPropertyDescriptor: Zy5,
        getOwnPropertyNames: fy5
    } = Object, Vy5 = Object.prototype.hasOwnProperty, w57 = (A, q) => Q36(A, "name", {
        value: q,
        configurable: !0
    }), Ny5 = (A, q) => {
        for (var K in q) Q36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Ty5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of fy5(q))
                if (!Vy5.call(A, z) && z !== K) Q36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Zy5(q, z)) || Y.enumerable
                })
        }
        return A
    }, vy5 = (A) => Ty5(Q36({}, "__esModule", {
        value: !0
    }), A), H57 = {};
    Ny5(H57, {
        fromHex: () => O57,
        toHex: () => _57
    });
    J57.exports = vy5(H57);
    var $57 = {},
        fKA = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        $57[A] = q, fKA[q] = A
    }

    function O57(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in fKA) q[K / 2] = fKA[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }
    w57(O57, "fromHex");

    function _57(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += $57[A[K]];
        return q
    }
    w57(_57, "toHex")
})
// @from(Ln 144873, Col 4)
P57 = R((IV2, M57) => {
    var {
        defineProperty: g36,
        getOwnPropertyDescriptor: Ey5,
        getOwnPropertyNames: ky5
    } = Object, Ly5 = Object.prototype.hasOwnProperty, VKA = (A, q) => g36(A, "name", {
        value: q,
        configurable: !0
    }), Ry5 = (A, q) => {
        for (var K in q) g36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, yy5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of ky5(q))
                if (!Ly5.call(A, z) && z !== K) g36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Ey5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Cy5 = (A) => yy5(g36({}, "__esModule", {
        value: !0
    }), A), D57 = {};
    Ry5(D57, {
        escapeUri: () => j57,
        escapeUriPath: () => hy5
    });
    M57.exports = Cy5(D57);
    var j57 = VKA((A) => encodeURIComponent(A).replace(/[!'()*]/g, Sy5), "escapeUri"),
        Sy5 = VKA((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        hy5 = VKA((A) => A.split("/").map(j57).join("/"), "escapeUriPath")
})
// @from(Ln 144907, Col 4)
u57 = R((xV2, b57) => {
    var {
        defineProperty: l36,
        getOwnPropertyDescriptor: Iy5,
        getOwnPropertyNames: xy5
    } = Object, by5 = Object.prototype.hasOwnProperty, fX = (A, q) => l36(A, "name", {
        value: q,
        configurable: !0
    }), uy5 = (A, q) => {
        for (var K in q) l36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, By5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of xy5(q))
                if (!by5.call(A, z) && z !== K) l36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Iy5(q, z)) || Y.enumerable
                })
        }
        return A
    }, my5 = (A) => By5(l36({}, "__esModule", {
        value: !0
    }), A), V57 = {};
    uy5(V57, {
        SignatureV4: () => JC5,
        clearCredentialCache: () => AC5,
        createScope: () => d36,
        getCanonicalHeaders: () => EKA,
        getCanonicalQuery: () => y57,
        getPayloadHash: () => c36,
        getSigningKey: () => R57,
        moveHeadersToQuery: () => I57,
        prepareRequest: () => LKA
    });
    b57.exports = my5(V57);
    var W57 = r37(),
        NKA = zS1(),
        Fy5 = "X-Amz-Algorithm",
        Qy5 = "X-Amz-Credential",
        N57 = "X-Amz-Date",
        gy5 = "X-Amz-SignedHeaders",
        Uy5 = "X-Amz-Expires",
        T57 = "X-Amz-Signature",
        v57 = "X-Amz-Security-Token",
        E57 = "authorization",
        k57 = N57.toLowerCase(),
        py5 = "date",
        dy5 = [E57, k57, py5],
        cy5 = T57.toLowerCase(),
        vKA = "x-amz-content-sha256",
        ly5 = v57.toLowerCase(),
        iy5 = {
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
        ny5 = /^proxy-/,
        ry5 = /^sec-/,
        TKA = "AWS4-HMAC-SHA256",
        oy5 = "AWS4-HMAC-SHA256-PAYLOAD",
        ay5 = "UNSIGNED-PAYLOAD",
        sy5 = 50,
        L57 = "aws4_request",
        ty5 = 604800,
        hr = X57(),
        ey5 = zS1(),
        yJ1 = {},
        p36 = [],
        d36 = fX((A, q, K) => `${A}/${q}/${K}/${L57}`, "createScope"),
        R57 = fX(async (A, q, K, Y, z) => {
            let w = await G57(A, q.secretAccessKey, q.accessKeyId),
                H = `${K}:${Y}:${z}:${(0,hr.toHex)(w)}:${q.sessionToken}`;
            if (H in yJ1) return yJ1[H];
            p36.push(H);
            while (p36.length > sy5) delete yJ1[p36.shift()];
            let $ = `AWS4${q.secretAccessKey}`;
            for (let O of [K, Y, z, L57]) $ = await G57(A, $, O);
            return yJ1[H] = $
        }, "getSigningKey"),
        AC5 = fX(() => {
            p36.length = 0, Object.keys(yJ1).forEach((A) => {
                delete yJ1[A]
            })
        }, "clearCredentialCache"),
        G57 = fX((A, q, K) => {
            let Y = new A(q);
            return Y.update((0, ey5.toUint8Array)(K)), Y.digest()
        }, "hmac"),
        EKA = fX(({
            headers: A
        }, q, K) => {
            let Y = {};
            for (let z of Object.keys(A).sort()) {
                if (A[z] == null) continue;
                let w = z.toLowerCase();
                if (w in iy5 || (q == null ? void 0 : q.has(w)) || ny5.test(w) || ry5.test(w)) {
                    if (!K || K && !K.has(w)) continue
                }
                Y[w] = A[z].trim().replace(/\s+/g, " ")
            }
            return Y
        }, "getCanonicalHeaders"),
        wS1 = P57(),
        y57 = fX(({
            query: A = {}
        }) => {
            let q = [],
                K = {};
            for (let Y of Object.keys(A).sort()) {
                if (Y.toLowerCase() === cy5) continue;
                q.push(Y);
                let z = A[Y];
                if (typeof z === "string") K[Y] = `${(0,wS1.escapeUri)(Y)}=${(0,wS1.escapeUri)(z)}`;
                else if (Array.isArray(z)) K[Y] = z.slice(0).reduce((w, H) => w.concat([`${(0,wS1.escapeUri)(Y)}=${(0,wS1.escapeUri)(H)}`]), []).sort().join("&")
            }
            return q.map((Y) => K[Y]).filter((Y) => Y).join("&")
        }, "getCanonicalQuery"),
        qC5 = WKA(),
        KC5 = zS1(),
        c36 = fX(async ({
            headers: A,
            body: q
        }, K) => {
            for (let Y of Object.keys(A))
                if (Y.toLowerCase() === vKA) return A[Y];
            if (q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof q === "string" || ArrayBuffer.isView(q) || (0, qC5.isArrayBuffer)(q)) {
                let Y = new K;
                return Y.update((0, KC5.toUint8Array)(q)), (0, hr.toHex)(await Y.digest())
            }
            return ay5
        }, "getPayloadHash"),
        Z57 = zS1(),
        C57 = class {
            format(q) {
                let K = [];
                for (let w of Object.keys(q)) {
                    let H = (0, Z57.fromUtf8)(w);
                    K.push(Uint8Array.from([H.byteLength]), H, this.formatHeaderValue(q[w]))
                }
                let Y = new Uint8Array(K.reduce((w, H) => w + H.byteLength, 0)),
                    z = 0;
                for (let w of K) Y.set(w, z), z += w.byteLength;
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
                        let w = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                        w.setUint8(0, 6), w.setUint16(1, q.value.byteLength, !1);
                        let H = new Uint8Array(w.buffer);
                        return H.set(q.value, 3), H;
                    case "string":
                        let $ = (0, Z57.fromUtf8)(q.value),
                            O = new DataView(new ArrayBuffer(3 + $.byteLength));
                        O.setUint8(0, 7), O.setUint16(1, $.byteLength, !1);
                        let _ = new Uint8Array(O.buffer);
                        return _.set($, 3), _;
                    case "timestamp":
                        let J = new Uint8Array(9);
                        return J[0] = 8, J.set(wC5.fromNumber(q.value.valueOf()).bytes, 1), J;
                    case "uuid":
                        if (!zC5.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                        let X = new Uint8Array(17);
                        return X[0] = 9, X.set((0, hr.fromHex)(q.value.replace(/\-/g, "")), 1), X
                }
            }
        };
    fX(C57, "HeaderFormatter");
    var YC5 = C57,
        zC5 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        S57 = class A {
            constructor(q) {
                if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(q) {
                if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
                let K = new Uint8Array(8);
                for (let Y = 7, z = Math.abs(Math.round(q)); Y > -1 && z > 0; Y--, z /= 256) K[Y] = z;
                if (q < 0) kKA(K);
                return new A(K)
            }
            valueOf() {
                let q = this.bytes.slice(0),
                    K = q[0] & 128;
                if (K) kKA(q);
                return parseInt((0, hr.toHex)(q), 16) * (K ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    fX(S57, "Int64");
    var wC5 = S57;

    function kKA(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    fX(kKA, "negate");
    var HC5 = fX((A, q) => {
            A = A.toLowerCase();
            for (let K of Object.keys(q))
                if (A === K.toLowerCase()) return !0;
            return !1
        }, "hasHeader"),
        h57 = fX(({
            headers: A,
            query: q,
            ...K
        }) => ({
            ...K,
            headers: {
                ...A
            },
            query: q ? $C5(q) : void 0
        }), "cloneRequest"),
        $C5 = fX((A) => Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {}), "cloneQuery"),
        I57 = fX((A, q = {}) => {
            var K;
            let {
                headers: Y,
                query: z = {}
            } = typeof A.clone === "function" ? A.clone() : h57(A);
            for (let w of Object.keys(Y)) {
                let H = w.toLowerCase();
                if (H.slice(0, 6) === "x-amz-" && !((K = q.unhoistableHeaders) == null ? void 0 : K.has(H))) z[w] = Y[w], delete Y[w]
            }
            return {
                ...A,
                headers: Y,
                query: z
            }
        }, "moveHeadersToQuery"),
        LKA = fX((A) => {
            A = typeof A.clone === "function" ? A.clone() : h57(A);
            for (let q of Object.keys(A.headers))
                if (dy5.indexOf(q.toLowerCase()) > -1) delete A.headers[q];
            return A
        }, "prepareRequest"),
        OC5 = fX((A) => _C5(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
        _C5 = fX((A) => {
            if (typeof A === "number") return new Date(A * 1000);
            if (typeof A === "string") {
                if (Number(A)) return new Date(Number(A) * 1000);
                return new Date(A)
            }
            return A
        }, "toDate"),
        x57 = class {
            constructor({
                applyChecksum: q,
                credentials: K,
                region: Y,
                service: z,
                sha256: w,
                uriEscapePath: H = !0
            }) {
                this.headerFormatter = new YC5, this.service = z, this.sha256 = w, this.uriEscapePath = H, this.applyChecksum = typeof q === "boolean" ? q : !0, this.regionProvider = (0, W57.normalizeProvider)(Y), this.credentialProvider = (0, W57.normalizeProvider)(K)
            }
            async presign(q, K = {}) {
                let {
                    signingDate: Y = new Date,
                    expiresIn: z = 3600,
                    unsignableHeaders: w,
                    unhoistableHeaders: H,
                    signableHeaders: $,
                    signingRegion: O,
                    signingService: _
                } = K, J = await this.credentialProvider();
                this.validateResolvedCredentials(J);
                let X = O ?? await this.regionProvider(),
                    {
                        longDate: D,
                        shortDate: j
                    } = U36(Y);
                if (z > ty5) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
                let M = d36(j, X, _ ?? this.service),
                    P = I57(LKA(q), {
                        unhoistableHeaders: H
                    });
                if (J.sessionToken) P.query[v57] = J.sessionToken;
                P.query[Fy5] = TKA, P.query[Qy5] = `${J.accessKeyId}/${M}`, P.query[N57] = D, P.query[Uy5] = z.toString(10);
                let W = EKA(P, w, $);
                return P.query[gy5] = f57(W), P.query[T57] = await this.getSignature(D, M, this.getSigningKey(J, X, j, _), this.createCanonicalRequest(P, W, await c36(q, this.sha256))), P
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
                signingRegion: w,
                signingService: H
            }) {
                let $ = w ?? await this.regionProvider(),
                    {
                        shortDate: O,
                        longDate: _
                    } = U36(Y),
                    J = d36(O, $, H ?? this.service),
                    X = await c36({
                        headers: {},
                        body: K
                    }, this.sha256),
                    D = new this.sha256;
                D.update(q);
                let j = (0, hr.toHex)(await D.digest()),
                    M = [oy5, _, J, z, j, X].join(`
`);
                return this.signString(M, {
                    signingDate: Y,
                    signingRegion: $,
                    signingService: H
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
                }).then((H) => {
                    return {
                        message: q.message,
                        signature: H
                    }
                })
            }
            async signString(q, {
                signingDate: K = new Date,
                signingRegion: Y,
                signingService: z
            } = {}) {
                let w = await this.credentialProvider();
                this.validateResolvedCredentials(w);
                let H = Y ?? await this.regionProvider(),
                    {
                        shortDate: $
                    } = U36(K),
                    O = new this.sha256(await this.getSigningKey(w, H, $, z));
                return O.update((0, NKA.toUint8Array)(q)), (0, hr.toHex)(await O.digest())
            }
            async signRequest(q, {
                signingDate: K = new Date,
                signableHeaders: Y,
                unsignableHeaders: z,
                signingRegion: w,
                signingService: H
            } = {}) {
                let $ = await this.credentialProvider();
                this.validateResolvedCredentials($);
                let O = w ?? await this.regionProvider(),
                    _ = LKA(q),
                    {
                        longDate: J,
                        shortDate: X
                    } = U36(K),
                    D = d36(X, O, H ?? this.service);
                if (_.headers[k57] = J, $.sessionToken) _.headers[ly5] = $.sessionToken;
                let j = await c36(_, this.sha256);
                if (!HC5(vKA, _.headers) && this.applyChecksum) _.headers[vKA] = j;
                let M = EKA(_, z, Y),
                    P = await this.getSignature(J, D, this.getSigningKey($, O, X, H), this.createCanonicalRequest(_, M, j));
                return _.headers[E57] = `${TKA} Credential=${$.accessKeyId}/${D}, SignedHeaders=${f57(M)}, Signature=${P}`, _
            }
            createCanonicalRequest(q, K, Y) {
                let z = Object.keys(K).sort();
                return `${q.method}
${this.getCanonicalPath(q)}
${y57(q)}
${z.map((w)=>`${w}:${K[w]}`).join(`
`)}

${z.join(";")}
${Y}`
            }
            async createStringToSign(q, K, Y) {
                let z = new this.sha256;
                z.update((0, NKA.toUint8Array)(Y));
                let w = await z.digest();
                return `${TKA}
${q}
${K}
${(0,hr.toHex)(w)}`
            }
            getCanonicalPath({
                path: q
            }) {
                if (this.uriEscapePath) {
                    let K = [];
                    for (let w of q.split("/")) {
                        if ((w == null ? void 0 : w.length) === 0) continue;
                        if (w === ".") continue;
                        if (w === "..") K.pop();
                        else K.push(w)
                    }
                    let Y = `${(q==null?void 0:q.startsWith("/"))?"/":""}${K.join("/")}${K.length>0&&(q==null?void 0:q.endsWith("/"))?"/":""}`;
                    return (0, wS1.escapeUri)(Y).replace(/%2F/g, "/")
                }
                return q
            }
            async getSignature(q, K, Y, z) {
                let w = await this.createStringToSign(q, K, z),
                    H = new this.sha256(await Y);
                return H.update((0, NKA.toUint8Array)(w)), (0, hr.toHex)(await H.digest())
            }
            getSigningKey(q, K, Y, z) {
                return R57(this.sha256, q, Y, K, z || this.service)
            }
            validateResolvedCredentials(q) {
                if (typeof q !== "object" || typeof q.accessKeyId !== "string" || typeof q.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
            }
        };
    fX(x57, "SignatureV4");
    var JC5 = x57,
        U36 = fX((A) => {
            let q = OC5(A).replace(/[\-:]/g, "");
            return {
                longDate: q,
                shortDate: q.slice(0, 8)
            }
        }, "formatDate"),
        f57 = fX((A) => Object.keys(A).sort().join(";"), "getCanonicalHeaderList")
})
// @from(Ln 145380, Col 4)
B57
// @from(Ln 145380, Col 9)
m57
// @from(Ln 145380, Col 14)
F57
// @from(Ln 145380, Col 19)
Q57
// @from(Ln 145380, Col 24)
DC5 = () => Promise.resolve().then(() => o(Kn6(), 1)).then(({
        fromNodeProviderChain: A
    }) => A({
        clientConfig: {
            requestHandler: new m57.FetchHttpHandler({
                requestInit: (q) => {
                    return {
                        ...q
                    }
                }
            })
        }
    })).catch((A) => {
        throw Error(`Failed to import '@aws-sdk/credential-providers'.You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicBedrock({ providerChainResolver })\` Original error: ${A.message}`)
    })
// @from(Ln 145395, Col 4)
g57 = async (A, q) => {
        XC5(A.method, "Expected request method property to be set");
        let K = await (q.providerChainResolver ? q.providerChainResolver() : DC5()),
            Y = await jC5(() => {
                if (q.awsAccessKey) process.env.AWS_ACCESS_KEY_ID = q.awsAccessKey;
                if (q.awsSecretKey) process.env.AWS_SECRET_ACCESS_KEY = q.awsSecretKey;
                if (q.awsSessionToken) process.env.AWS_SESSION_TOKEN = q.awsSessionToken
            }, () => K()),
            z = new Q57.SignatureV4({
                service: "bedrock",
                region: q.regionName,
                credentials: Y,
                sha256: B57.Sha256
            }),
            w = new URL(q.url),
            H = !A.headers ? {} : (Symbol.iterator in A.headers) ? Object.fromEntries(Array.from(A.headers).map((_) => [..._])) : {
                ...A.headers
            };
        delete H.connection, H.host = w.hostname;
        let $ = new F57.HttpRequest({
            method: A.method.toUpperCase(),
            protocol: w.protocol,
            path: w.pathname,
            headers: H,
            body: A.body
        });
        return (await z.sign($)).headers
    }
// @from(Ln 145422, Col 7)
jC5 = async (A, q) => {
        let K = {
            ...process.env
        };
        try {
            return A(), await q()
        } finally {
            process.env = K
        }
    }
// @from(Ln 145432, Col 4)
U57 = v(() => {
    B57 = o(CK7(), 1), m57 = o(jKA(), 1), F57 = o(PKA(), 1), Q57 = o(u57(), 1)
})
// @from(Ln 145435, Col 4)
yKA = R((BV2, n36) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var p57, d57, c57, l57, i57, n57, r57, o57, a57, i36, RKA, s57, t57, CJ1, e57, A97, q97, K97, Y97, z97, w97, H97, $97;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof n36 === "object" && typeof BV2 === "object") A(K(q, K(BV2)));
        else A(K(q));

        function K(Y, z) {
            if (Y !== q)
                if (typeof Object.create === "function") Object.defineProperty(Y, "__esModule", {
                    value: !0
                });
                else Y.__esModule = !0;
            return function(w, H) {
                return Y[w] = z ? z(w, H) : H
            }
        }
    })(function(A) {
        var q = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(K, Y) {
            K.__proto__ = Y
        } || function(K, Y) {
            for (var z in Y)
                if (Y.hasOwnProperty(z)) K[z] = Y[z]
        };
        p57 = function(K, Y) {
            q(K, Y);

            function z() {
                this.constructor = K
            }
            K.prototype = Y === null ? Object.create(Y) : (z.prototype = Y.prototype, new z)
        }, d57 = Object.assign || function(K) {
            for (var Y, z = 1, w = arguments.length; z < w; z++) {
                Y = arguments[z];
                for (var H in Y)
                    if (Object.prototype.hasOwnProperty.call(Y, H)) K[H] = Y[H]
            }
            return K
        }, c57 = function(K, Y) {
            var z = {};
            for (var w in K)
                if (Object.prototype.hasOwnProperty.call(K, w) && Y.indexOf(w) < 0) z[w] = K[w];
            if (K != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var H = 0, w = Object.getOwnPropertySymbols(K); H < w.length; H++)
                    if (Y.indexOf(w[H]) < 0 && Object.prototype.propertyIsEnumerable.call(K, w[H])) z[w[H]] = K[w[H]]
            }
            return z
        }, l57 = function(K, Y, z, w) {
            var H = arguments.length,
                $ = H < 3 ? Y : w === null ? w = Object.getOwnPropertyDescriptor(Y, z) : w,
                O;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") $ = Reflect.decorate(K, Y, z, w);
            else
                for (var _ = K.length - 1; _ >= 0; _--)
                    if (O = K[_]) $ = (H < 3 ? O($) : H > 3 ? O(Y, z, $) : O(Y, z)) || $;
            return H > 3 && $ && Object.defineProperty(Y, z, $), $
        }, i57 = function(K, Y) {
            return function(z, w) {
                Y(z, w, K)
            }
        }, n57 = function(K, Y) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(K, Y)
        }, r57 = function(K, Y, z, w) {
            function H($) {
                return $ instanceof z ? $ : new z(function(O) {
                    O($)
                })
            }
            return new(z || (z = Promise))(function($, O) {
                function _(D) {
                    try {
                        X(w.next(D))
                    } catch (j) {
                        O(j)
                    }
                }

                function J(D) {
                    try {
                        X(w.throw(D))
                    } catch (j) {
                        O(j)
                    }
                }

                function X(D) {
                    D.done ? $(D.value) : H(D.value).then(_, J)
                }
                X((w = w.apply(K, Y || [])).next())
            })
        }, o57 = function(K, Y) {
            var z = {
                    label: 0,
                    sent: function() {
                        if ($[0] & 1) throw $[1];
                        return $[1]
                    },
                    trys: [],
                    ops: []
                },
                w, H, $, O;
            return O = {
                next: _(0),
                throw: _(1),
                return: _(2)
            }, typeof Symbol === "function" && (O[Symbol.iterator] = function() {
                return this
            }), O;

            function _(X) {
                return function(D) {
                    return J([X, D])
                }
            }

            function J(X) {
                if (w) throw TypeError("Generator is already executing.");
                while (z) try {
                    if (w = 1, H && ($ = X[0] & 2 ? H.return : X[0] ? H.throw || (($ = H.return) && $.call(H), 0) : H.next) && !($ = $.call(H, X[1])).done) return $;
                    if (H = 0, $) X = [X[0] & 2, $.value];
                    switch (X[0]) {
                        case 0:
                        case 1:
                            $ = X;
                            break;
                        case 4:
                            return z.label++, {
                                value: X[1],
                                done: !1
                            };
                        case 5:
                            z.label++, H = X[1], X = [0];
                            continue;
                        case 7:
                            X = z.ops.pop(), z.trys.pop();
                            continue;
                        default:
                            if (($ = z.trys, !($ = $.length > 0 && $[$.length - 1])) && (X[0] === 6 || X[0] === 2)) {
                                z = 0;
                                continue
                            }
                            if (X[0] === 3 && (!$ || X[1] > $[0] && X[1] < $[3])) {
                                z.label = X[1];
                                break
                            }
                            if (X[0] === 6 && z.label < $[1]) {
                                z.label = $[1], $ = X;
                                break
                            }
                            if ($ && z.label < $[2]) {
                                z.label = $[2], z.ops.push(X);
                                break
                            }
                            if ($[2]) z.ops.pop();
                            z.trys.pop();
                            continue
                    }
                    X = Y.call(K, z)
                } catch (D) {
                    X = [6, D], H = 0
                } finally {
                    w = $ = 0
                }
                if (X[0] & 5) throw X[1];
                return {
                    value: X[0] ? X[1] : void 0,
                    done: !0
                }
            }
        }, $97 = function(K, Y, z, w) {
            if (w === void 0) w = z;
            K[w] = Y[z]
        }, a57 = function(K, Y) {
            for (var z in K)
                if (z !== "default" && !Y.hasOwnProperty(z)) Y[z] = K[z]
        }, i36 = function(K) {
            var Y = typeof Symbol === "function" && Symbol.iterator,
                z = Y && K[Y],
                w = 0;
            if (z) return z.call(K);
            if (K && typeof K.length === "number") return {
                next: function() {
                    if (K && w >= K.length) K = void 0;
                    return {
                        value: K && K[w++],
                        done: !K
                    }
                }
            };
            throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, RKA = function(K, Y) {
            var z = typeof Symbol === "function" && K[Symbol.iterator];
            if (!z) return K;
            var w = z.call(K),
                H, $ = [],
                O;
            try {
                while ((Y === void 0 || Y-- > 0) && !(H = w.next()).done) $.push(H.value)
            } catch (_) {
                O = {
                    error: _
                }
            } finally {
                try {
                    if (H && !H.done && (z = w.return)) z.call(w)
                } finally {
                    if (O) throw O.error
                }
            }
            return $
        }, s57 = function() {
            for (var K = [], Y = 0; Y < arguments.length; Y++) K = K.concat(RKA(arguments[Y]));
            return K
        }, t57 = function() {
            for (var K = 0, Y = 0, z = arguments.length; Y < z; Y++) K += arguments[Y].length;
            for (var w = Array(K), H = 0, Y = 0; Y < z; Y++)
                for (var $ = arguments[Y], O = 0, _ = $.length; O < _; O++, H++) w[H] = $[O];
            return w
        }, CJ1 = function(K) {
            return this instanceof CJ1 ? (this.v = K, this) : new CJ1(K)
        }, e57 = function(K, Y, z) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var w = z.apply(K, Y || []),
                H, $ = [];
            return H = {}, O("next"), O("throw"), O("return"), H[Symbol.asyncIterator] = function() {
                return this
            }, H;

            function O(M) {
                if (w[M]) H[M] = function(P) {
                    return new Promise(function(W, G) {
                        $.push([M, P, W, G]) > 1 || _(M, P)
                    })
                }
            }

            function _(M, P) {
                try {
                    J(w[M](P))
                } catch (W) {
                    j($[0][3], W)
                }
            }

            function J(M) {
                M.value instanceof CJ1 ? Promise.resolve(M.value.v).then(X, D) : j($[0][2], M)
            }

            function X(M) {
                _("next", M)
            }

            function D(M) {
                _("throw", M)
            }

            function j(M, P) {
                if (M(P), $.shift(), $.length) _($[0][0], $[0][1])
            }
        }, A97 = function(K) {
            var Y, z;
            return Y = {}, w("next"), w("throw", function(H) {
                throw H
            }), w("return"), Y[Symbol.iterator] = function() {
                return this
            }, Y;

            function w(H, $) {
                Y[H] = K[H] ? function(O) {
                    return (z = !z) ? {
                        value: CJ1(K[H](O)),
                        done: H === "return"
                    } : $ ? $(O) : O
                } : $
            }
        }, q97 = function(K) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var Y = K[Symbol.asyncIterator],
                z;
            return Y ? Y.call(K) : (K = typeof i36 === "function" ? i36(K) : K[Symbol.iterator](), z = {}, w("next"), w("throw"), w("return"), z[Symbol.asyncIterator] = function() {
                return this
            }, z);

            function w($) {
                z[$] = K[$] && function(O) {
                    return new Promise(function(_, J) {
                        O = K[$](O), H(_, J, O.done, O.value)
                    })
                }
            }

            function H($, O, _, J) {
                Promise.resolve(J).then(function(X) {
                    $({
                        value: X,
                        done: _
                    })
                }, O)
            }
        }, K97 = function(K, Y) {
            if (Object.defineProperty) Object.defineProperty(K, "raw", {
                value: Y
            });
            else K.raw = Y;
            return K
        }, Y97 = function(K) {
            if (K && K.__esModule) return K;
            var Y = {};
            if (K != null) {
                for (var z in K)
                    if (Object.hasOwnProperty.call(K, z)) Y[z] = K[z]
            }
            return Y.default = K, Y
        }, z97 = function(K) {
            return K && K.__esModule ? K : {
                default: K
            }
        }, w97 = function(K, Y) {
            if (!Y.has(K)) throw TypeError("attempted to get private field on non-instance");
            return Y.get(K)
        }, H97 = function(K, Y, z) {
            if (!Y.has(K)) throw TypeError("attempted to set private field on non-instance");
            return Y.set(K, z), z
        }, A("__extends", p57), A("__assign", d57), A("__rest", c57), A("__decorate", l57), A("__param", i57), A("__metadata", n57), A("__awaiter", r57), A("__generator", o57), A("__exportStar", a57), A("__createBinding", $97), A("__values", i36), A("__read", RKA), A("__spread", s57), A("__spreadArrays", t57), A("__await", CJ1), A("__asyncGenerator", e57), A("__asyncDelegator", A97), A("__asyncValues", q97), A("__makeTemplateObject", K97), A("__importStar", Y97), A("__importDefault", z97), A("__classPrivateFieldGet", w97), A("__classPrivateFieldSet", H97)
    })
})
// @from(Ln 145781, Col 4)
J97 = R((O97) => {
    Object.defineProperty(O97, "__esModule", {
        value: !0
    });
    O97.convertToBuffer = void 0;
    var MC5 = YKA(),
        PC5 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : MC5.fromUtf8;

    function WC5(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return PC5(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    O97.convertToBuffer = WC5
})
// @from(Ln 145799, Col 4)
j97 = R((X97) => {
    Object.defineProperty(X97, "__esModule", {
        value: !0
    });
    X97.isEmptyData = void 0;

    function GC5(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    X97.isEmptyData = GC5
})
// @from(Ln 145811, Col 4)
W97 = R((M97) => {
    Object.defineProperty(M97, "__esModule", {
        value: !0
    });
    M97.numToUint8 = void 0;

    function ZC5(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    M97.numToUint8 = ZC5
})
// @from(Ln 145822, Col 4)
f97 = R((G97) => {
    Object.defineProperty(G97, "__esModule", {
        value: !0
    });
    G97.uint32ArrayFrom = void 0;

    function fC5(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    G97.uint32ArrayFrom = fC5
})
// @from(Ln 145839, Col 4)
CKA = R((SJ1) => {
    Object.defineProperty(SJ1, "__esModule", {
        value: !0
    });
    SJ1.uint32ArrayFrom = SJ1.numToUint8 = SJ1.isEmptyData = SJ1.convertToBuffer = void 0;
    var VC5 = J97();
    Object.defineProperty(SJ1, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return VC5.convertToBuffer
        }
    });
    var NC5 = j97();
    Object.defineProperty(SJ1, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return NC5.isEmptyData
        }
    });
    var TC5 = W97();
    Object.defineProperty(SJ1, "numToUint8", {
        enumerable: !0,
        get: function() {
            return TC5.numToUint8
        }
    });
    var vC5 = f97();
    Object.defineProperty(SJ1, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return vC5.uint32ArrayFrom
        }
    })
})
// @from(Ln 145873, Col 4)
E97 = R((T97) => {
    Object.defineProperty(T97, "__esModule", {
        value: !0
    });
    T97.AwsCrc32 = void 0;
    var V97 = yKA(),
        SKA = CKA(),
        N97 = r36(),
        kC5 = function() {
            function A() {
                this.crc32 = new N97.Crc32
            }
            return A.prototype.update = function(q) {
                if ((0, SKA.isEmptyData)(q)) return;
                this.crc32.update((0, SKA.convertToBuffer)(q))
            }, A.prototype.digest = function() {
                return V97.__awaiter(this, void 0, void 0, function() {
                    return V97.__generator(this, function(q) {
                        return [2, (0, SKA.numToUint8)(this.crc32.digest())]
                    })
                })
            }, A.prototype.reset = function() {
                this.crc32 = new N97.Crc32
            }, A
        }();
    T97.AwsCrc32 = kC5
})
// @from(Ln 145900, Col 4)
r36 = R((hKA) => {
    Object.defineProperty(hKA, "__esModule", {
        value: !0
    });
    hKA.AwsCrc32 = hKA.Crc32 = hKA.crc32 = void 0;
    var LC5 = yKA(),
        RC5 = CKA();

    function yC5(A) {
        return new k97().update(A).digest()
    }
    hKA.crc32 = yC5;
    var k97 = function() {
        function A() {
            this.checksum = 4294967295
        }
        return A.prototype.update = function(q) {
            var K, Y;
            try {
                for (var z = LC5.__values(q), w = z.next(); !w.done; w = z.next()) {
                    var H = w.value;
                    this.checksum = this.checksum >>> 8 ^ SC5[(this.checksum ^ H) & 255]
                }
            } catch ($) {
                K = {
                    error: $
                }
            } finally {
                try {
                    if (w && !w.done && (Y = z.return)) Y.call(z)
                } finally {
                    if (K) throw K.error
                }
            }
            return this
        }, A.prototype.digest = function() {
            return (this.checksum ^ 4294967295) >>> 0
        }, A
    }();
    hKA.Crc32 = k97;
    var CC5 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        SC5 = (0, RC5.uint32ArrayFrom)(CC5),
        hC5 = E97();
    Object.defineProperty(hKA, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return hC5.AwsCrc32
        }
    })
})
// @from(Ln 145950, Col 4)
I97 = R((nV2, h97) => {
    var {
        defineProperty: o36,
        getOwnPropertyDescriptor: uC5,
        getOwnPropertyNames: BC5
    } = Object, mC5 = Object.prototype.hasOwnProperty, L97 = (A, q) => o36(A, "name", {
        value: q,
        configurable: !0
    }), FC5 = (A, q) => {
        for (var K in q) o36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, QC5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of BC5(q))
                if (!mC5.call(A, z) && z !== K) o36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = uC5(q, z)) || Y.enumerable
                })
        }
        return A
    }, gC5 = (A) => QC5(o36({}, "__esModule", {
        value: !0
    }), A), R97 = {};
    FC5(R97, {
        fromHex: () => C97,
        toHex: () => S97
    });
    h97.exports = gC5(R97);
    var y97 = {},
        IKA = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        y97[A] = q, IKA[q] = A
    }

    function C97(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in IKA) q[K / 2] = IKA[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }
    L97(C97, "fromHex");

    function S97(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += y97[A[K]];
        return q
    }
    L97(S97, "toHex")
})
// @from(Ln 146007, Col 4)
i97 = R((rV2, l97) => {
    var {
        defineProperty: s36,
        getOwnPropertyDescriptor: UC5,
        getOwnPropertyNames: pC5
    } = Object, dC5 = Object.prototype.hasOwnProperty, qU = (A, q) => s36(A, "name", {
        value: q,
        configurable: !0
    }), cC5 = (A, q) => {
        for (var K in q) s36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, lC5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of pC5(q))
                if (!dC5.call(A, z) && z !== K) s36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = UC5(q, z)) || Y.enumerable
                })
        }
        return A
    }, iC5 = (A) => lC5(s36({}, "__esModule", {
        value: !0
    }), A), b97 = {};
    cC5(b97, {
        EventStreamCodec: () => wS5,
        HeaderMarshaller: () => m97,
        Int64: () => a36,
        MessageDecoderStream: () => HS5,
        MessageEncoderStream: () => $S5,
        SmithyMessageDecoderStream: () => OS5,
        SmithyMessageEncoderStream: () => _S5
    });
    l97.exports = iC5(b97);
    var nC5 = r36(),
        y71 = I97(),
        u97 = class A {
            constructor(q) {
                if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(q) {
                if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
                let K = new Uint8Array(8);
                for (let Y = 7, z = Math.abs(Math.round(q)); Y > -1 && z > 0; Y--, z /= 256) K[Y] = z;
                if (q < 0) xKA(K);
                return new A(K)
            }
            valueOf() {
                let q = this.bytes.slice(0),
                    K = q[0] & 128;
                if (K) xKA(q);
                return parseInt((0, y71.toHex)(q), 16) * (K ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    qU(u97, "Int64");
    var a36 = u97;

    function xKA(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    qU(xKA, "negate");
    var B97 = class {
        constructor(q, K) {
            this.toUtf8 = q, this.fromUtf8 = K
        }
        format(q) {
            let K = [];
            for (let w of Object.keys(q)) {
                let H = this.fromUtf8(w);
                K.push(Uint8Array.from([H.byteLength]), H, this.formatHeaderValue(q[w]))
            }
            let Y = new Uint8Array(K.reduce((w, H) => w + H.byteLength, 0)),
                z = 0;
            for (let w of K) Y.set(w, z), z += w.byteLength;
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
                    let w = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                    w.setUint8(0, 6), w.setUint16(1, q.value.byteLength, !1);
                    let H = new Uint8Array(w.buffer);
                    return H.set(q.value, 3), H;
                case "string":
                    let $ = this.fromUtf8(q.value),
                        O = new DataView(new ArrayBuffer(3 + $.byteLength));
                    O.setUint8(0, 7), O.setUint16(1, $.byteLength, !1);
                    let _ = new Uint8Array(O.buffer);
                    return _.set($, 3), _;
                case "timestamp":
                    let J = new Uint8Array(9);
                    return J[0] = 8, J.set(a36.fromNumber(q.value.valueOf()).bytes, 1), J;
                case "uuid":
                    if (!KS5.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                    let X = new Uint8Array(17);
                    return X[0] = 9, X.set((0, y71.fromHex)(q.value.replace(/\-/g, "")), 1), X
            }
        }
        parse(q) {
            let K = {},
                Y = 0;
            while (Y < q.byteLength) {
                let z = q.getUint8(Y++),
                    w = this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + Y, z));
                switch (Y += z, q.getUint8(Y++)) {
                    case 0:
                        K[w] = {
                            type: x97,
                            value: !0
                        };
                        break;
                    case 1:
                        K[w] = {
                            type: x97,
                            value: !1
                        };
                        break;
                    case 2:
                        K[w] = {
                            type: rC5,
                            value: q.getInt8(Y++)
                        };
                        break;
                    case 3:
                        K[w] = {
                            type: oC5,
                            value: q.getInt16(Y, !1)
                        }, Y += 2;
                        break;
                    case 4:
                        K[w] = {
                            type: aC5,
                            value: q.getInt32(Y, !1)
                        }, Y += 4;
                        break;
                    case 5:
                        K[w] = {
                            type: sC5,
                            value: new a36(new Uint8Array(q.buffer, q.byteOffset + Y, 8))
                        }, Y += 8;
                        break;
                    case 6:
                        let H = q.getUint16(Y, !1);
                        Y += 2, K[w] = {
                            type: tC5,
                            value: new Uint8Array(q.buffer, q.byteOffset + Y, H)
                        }, Y += H;
                        break;
                    case 7:
                        let $ = q.getUint16(Y, !1);
                        Y += 2, K[w] = {
                            type: eC5,
                            value: this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + Y, $))
                        }, Y += $;
                        break;
                    case 8:
                        K[w] = {
                            type: AS5,
                            value: new Date(new a36(new Uint8Array(q.buffer, q.byteOffset + Y, 8)).valueOf())
                        }, Y += 8;
                        break;
                    case 9:
                        let O = new Uint8Array(q.buffer, q.byteOffset + Y, 16);
                        Y += 16, K[w] = {
                            type: qS5,
                            value: `${(0,y71.toHex)(O.subarray(0,4))}-${(0,y71.toHex)(O.subarray(4,6))}-${(0,y71.toHex)(O.subarray(6,8))}-${(0,y71.toHex)(O.subarray(8,10))}-${(0,y71.toHex)(O.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return K
        }
    };
    qU(B97, "HeaderMarshaller");
    var m97 = B97,
        x97 = "boolean",
        rC5 = "byte",
        oC5 = "short",
        aC5 = "integer",
        sC5 = "long",
        tC5 = "binary",
        eC5 = "string",
        AS5 = "timestamp",
        qS5 = "uuid",
        KS5 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        YS5 = r36(),
        F97 = 4,
        Ir = F97 * 2,
        C71 = 4,
        zS5 = Ir + C71 * 2;

    function Q97({
        byteLength: A,
        byteOffset: q,
        buffer: K
    }) {
        if (A < zS5) throw Error("Provided message too short to accommodate event stream message overhead");
        let Y = new DataView(K, q, A),
            z = Y.getUint32(0, !1);
        if (A !== z) throw Error("Reported message length does not match received message length");
        let w = Y.getUint32(F97, !1),
            H = Y.getUint32(Ir, !1),
            $ = Y.getUint32(A - C71, !1),
            O = new YS5.Crc32().update(new Uint8Array(K, q, Ir));
        if (H !== O.digest()) throw Error(`The prelude checksum specified in the message (${H}) does not match the calculated CRC32 checksum (${O.digest()})`);
        if (O.update(new Uint8Array(K, q + Ir, A - (Ir + C71))), $ !== O.digest()) throw Error(`The message checksum (${O.digest()}) did not match the expected value of ${$}`);
        return {
            headers: new DataView(K, q + Ir + C71, w),
            body: new Uint8Array(K, q + Ir + C71 + w, z - w - (Ir + C71 + C71))
        }
    }
    qU(Q97, "splitMessage");
    var g97 = class {
        constructor(q, K) {
            this.headerMarshaller = new m97(q, K), this.messageBuffer = [], this.isEndOfStream = !1
        }
        feed(q) {
            this.messageBuffer.push(this.decode(q))
        }
        endOfStream() {
            this.isEndOfStream = !0
        }
        getMessage() {
            let q = this.messageBuffer.pop(),
                K = this.isEndOfStream;
            return {
                getMessage() {
                    return q
                },
                isEndOfStream() {
                    return K
                }
            }
        }
        getAvailableMessages() {
            let q = this.messageBuffer;
            this.messageBuffer = [];
            let K = this.isEndOfStream;
            return {
                getMessages() {
                    return q
                },
                isEndOfStream() {
                    return K
                }
            }
        }
        encode({
            headers: q,
            body: K
        }) {
            let Y = this.headerMarshaller.format(q),
                z = Y.byteLength + K.byteLength + 16,
                w = new Uint8Array(z),
                H = new DataView(w.buffer, w.byteOffset, w.byteLength),
                $ = new nC5.Crc32;
            return H.setUint32(0, z, !1), H.setUint32(4, Y.byteLength, !1), H.setUint32(8, $.update(w.subarray(0, 8)).digest(), !1), w.set(Y, 12), w.set(K, Y.byteLength + 12), H.setUint32(z - 4, $.update(w.subarray(8, z - 4)).digest(), !1), w
        }
        decode(q) {
            let {
                headers: K,
                body: Y
            } = Q97(q);
            return {
                headers: this.headerMarshaller.parse(K),
                body: Y
            }
        }
        formatHeaders(q) {
            return this.headerMarshaller.format(q)
        }
    };
    qU(g97, "EventStreamCodec");
    var wS5 = g97,
        U97 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.inputStream) yield this.options.decoder.decode(q)
            }
        };
    qU(U97, "MessageDecoderStream");
    var HS5 = U97,
        p97 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.messageStream) yield this.options.encoder.encode(q);
                if (this.options.includeEndFrame) yield new Uint8Array(0)
            }
        };
    qU(p97, "MessageEncoderStream");
    var $S5 = p97,
        d97 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.messageStream) {
                    let K = await this.options.deserializer(q);
                    if (K === void 0) continue;
                    yield K
                }
            }
        };
    qU(d97, "SmithyMessageDecoderStream");
    var OS5 = d97,
        c97 = class {
            constructor(q) {
                this.options = q
            } [Symbol.asyncIterator]() {
                return this.asyncIterator()
            }
            async * asyncIterator() {
                for await (let q of this.options.inputStream) yield this.options.serializer(q)
            }
        };
    qU(c97, "SmithyMessageEncoderStream");
    var _S5 = c97
})
// @from(Ln 146356, Col 4)
e97 = R((oV2, t97) => {
    var {
        defineProperty: t36,
        getOwnPropertyDescriptor: JS5,
        getOwnPropertyNames: XS5
    } = Object, DS5 = Object.prototype.hasOwnProperty, hJ1 = (A, q) => t36(A, "name", {
        value: q,
        configurable: !0
    }), jS5 = (A, q) => {
        for (var K in q) t36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, MS5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of XS5(q))
                if (!DS5.call(A, z) && z !== K) t36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = JS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, PS5 = (A) => MS5(t36({}, "__esModule", {
        value: !0
    }), A), n97 = {};
    jS5(n97, {
        EventStreamMarshaller: () => s97,
        eventStreamSerdeProvider: () => WS5
    });
    t97.exports = PS5(n97);
    var HS1 = i97();

    function r97(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            w = hJ1(($) => {
                if (typeof $ !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + $);
                q = $, K = 4, Y = new Uint8Array($), new DataView(Y.buffer).setUint32(0, $, !1)
            }, "allocateMessage"),
            H = hJ1(async function*() {
                let $ = A[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: O,
                        done: _
                    } = await $.next();
                    if (_) {
                        if (!q) return;
                        else if (q === K) yield Y;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let J = O.length,
                        X = 0;
                    while (X < J) {
                        if (!Y) {
                            let j = J - X;
                            if (!z) z = new Uint8Array(4);
                            let M = Math.min(4 - K, j);
                            if (z.set(O.slice(X, X + M), K), K += M, X += M, K < 4) break;
                            w(new DataView(z.buffer).getUint32(0, !1)), z = null
                        }
                        let D = Math.min(q - K, J - X);
                        if (Y.set(O.slice(X, X + D), K), K += D, X += D, q && q === K) yield Y, Y = null, q = 0, K = 0
                    }
                }
            }, "iterator");
        return {
            [Symbol.asyncIterator]: H
        }
    }
    hJ1(r97, "getChunkedStream");

    function o97(A, q) {
        return async function(K) {
            let {
                value: Y
            } = K.headers[":message-type"];
            if (Y === "error") {
                let z = Error(K.headers[":error-message"].value || "UnknownError");
                throw z.name = K.headers[":error-code"].value, z
            } else if (Y === "exception") {
                let z = K.headers[":exception-type"].value,
                    w = {
                        [z]: K
                    },
                    H = await A(w);
                if (H.$unknown) {
                    let $ = Error(q(K.body));
                    throw $.name = z, $
                }
                throw H[z]
            } else if (Y === "event") {
                let z = {
                        [K.headers[":event-type"].value]: K
                    },
                    w = await A(z);
                if (w.$unknown) return;
                return w
            } else throw Error(`Unrecognizable event type: ${K.headers[":event-type"].value}`)
        }
    }
    hJ1(o97, "getMessageUnmarshaller");
    var a97 = class {
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.eventStreamCodec = new HS1.EventStreamCodec(q, K), this.utfEncoder = q
        }
        deserialize(q, K) {
            let Y = r97(q);
            return new HS1.SmithyMessageDecoderStream({
                messageStream: new HS1.MessageDecoderStream({
                    inputStream: Y,
                    decoder: this.eventStreamCodec
                }),
                deserializer: o97(K, this.utfEncoder)
            })
        }
        serialize(q, K) {
            return new HS1.MessageEncoderStream({
                messageStream: new HS1.SmithyMessageEncoderStream({
                    inputStream: q,
                    serializer: K
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    };
    hJ1(a97, "EventStreamMarshaller");
    var s97 = a97,
        WS5 = hJ1((A) => new s97(A), "eventStreamSerdeProvider")
})
// @from(Ln 146493, Col 4)
wY7 = R((aV2, zY7) => {
    var {
        defineProperty: e36,
        getOwnPropertyDescriptor: GS5,
        getOwnPropertyNames: ZS5
    } = Object, fS5 = Object.prototype.hasOwnProperty, bKA = (A, q) => e36(A, "name", {
        value: q,
        configurable: !0
    }), VS5 = (A, q) => {
        for (var K in q) e36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, NS5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of ZS5(q))
                if (!fS5.call(A, z) && z !== K) e36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = GS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, TS5 = (A) => NS5(e36({}, "__esModule", {
        value: !0
    }), A), AY7 = {};
    VS5(AY7, {
        EventStreamMarshaller: () => YY7,
        eventStreamSerdeProvider: () => kS5
    });
    zY7.exports = TS5(AY7);
    var vS5 = e97(),
        ES5 = h1("stream");
    async function* qY7(A) {
        let q = !1,
            K = !1,
            Y = [];
        A.on("error", (z) => {
            if (!q) q = !0;
            if (z) throw z
        }), A.on("data", (z) => {
            Y.push(z)
        }), A.on("end", () => {
            q = !0
        });
        while (!K) {
            let z = await new Promise((w) => setTimeout(() => w(Y.shift()), 0));
            if (z) yield z;
            K = q && Y.length === 0
        }
    }
    bKA(qY7, "readabletoIterable");
    var KY7 = class {
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.universalMarshaller = new vS5.EventStreamMarshaller({
                utf8Decoder: K,
                utf8Encoder: q
            })
        }
        deserialize(q, K) {
            let Y = typeof q[Symbol.asyncIterator] === "function" ? q : qY7(q);
            return this.universalMarshaller.deserialize(Y, K)
        }
        serialize(q, K) {
            return ES5.Readable.from(this.universalMarshaller.serialize(q, K))
        }
    };
    bKA(KY7, "EventStreamMarshaller");
    var YY7 = KY7,
        kS5 = bKA((A) => new YY7(A), "eventStreamSerdeProvider")
})
// @from(Ln 146566, Col 4)
OY7 = R((HY7) => {
    Object.defineProperty(HY7, "__esModule", {
        value: !0
    });
    HY7.fromBase64 = void 0;
    var LS5 = M81(),
        RS5 = /^[A-Za-z0-9+/]*={0,2}$/,
        yS5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!RS5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, LS5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    HY7.fromBase64 = yS5
})