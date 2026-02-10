
// @from(Ln 52543, Col 4)
CO8 = R((RO8) => {
    Object.defineProperty(RO8, "__esModule", {
        value: !0
    });
    RO8.createChecksumStream = void 0;
    var r0K = MH1(),
        o0K = yi(),
        a0K = LO8(),
        s0K = ({
            expectedChecksum: A,
            checksum: q,
            source: K,
            checksumSourceLocation: Y,
            base64Encoder: z
        }) => {
            if (!(0, o0K.isReadableStream)(K)) throw Error(`@smithy/util-stream: unsupported source type ${K?.constructor?.name??K} in ChecksumStream.`);
            let w = z ?? r0K.toBase64;
            if (typeof TransformStream !== "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
            let H = new TransformStream({
                start() {},
                async transform(O, _) {
                    q.update(O), _.enqueue(O)
                },
                async flush(O) {
                    let _ = await q.digest(),
                        J = w(_);
                    if (A !== J) {
                        let X = Error(`Checksum mismatch: expected "${A}" but received "${J}" in response header "${Y}".`);
                        O.error(X)
                    } else O.terminate()
                }
            });
            K.pipeThrough(H);
            let $ = H.readable;
            return Object.setPrototypeOf($, a0K.ChecksumStream.prototype), $
        };
    RO8.createChecksumStream = s0K
})
// @from(Ln 52581, Col 4)
hO8 = R((SO8) => {
    Object.defineProperty(SO8, "__esModule", {
        value: !0
    });
    SO8.createChecksumStream = qjK;
    var t0K = yi(),
        e0K = hQ6(),
        AjK = CO8();

    function qjK(A) {
        if (typeof ReadableStream === "function" && (0, t0K.isReadableStream)(A.source)) return (0, AjK.createChecksumStream)(A);
        return new e0K.ChecksumStream(A)
    }
})
// @from(Ln 52595, Col 4)
IQ6 = R((xO8) => {
    Object.defineProperty(xO8, "__esModule", {
        value: !0
    });
    xO8.ByteArrayCollector = void 0;
    class IO8 {
        allocByteArray;
        byteLength = 0;
        byteArrays = [];
        constructor(A) {
            this.allocByteArray = A
        }
        push(A) {
            this.byteArrays.push(A), this.byteLength += A.byteLength
        }
        flush() {
            if (this.byteArrays.length === 1) {
                let K = this.byteArrays[0];
                return this.reset(), K
            }
            let A = this.allocByteArray(this.byteLength),
                q = 0;
            for (let K = 0; K < this.byteArrays.length; ++K) {
                let Y = this.byteArrays[K];
                A.set(Y, q), q += Y.byteLength
            }
            return this.reset(), A
        }
        reset() {
            this.byteArrays = [], this.byteLength = 0
        }
    }
    xO8.ByteArrayCollector = IO8
})
// @from(Ln 52629, Col 4)
gO8 = R((FO8) => {
    Object.defineProperty(FO8, "__esModule", {
        value: !0
    });
    FO8.createBufferedReadable = void 0;
    FO8.createBufferedReadableStream = uO8;
    FO8.merge = BO8;
    FO8.flush = $t1;
    FO8.sizeOf = PH1;
    FO8.modeOf = mO8;
    var YjK = IQ6();

    function uO8(A, q, K) {
        let Y = A.getReader(),
            z = !1,
            w = 0,
            H = ["", new YjK.ByteArrayCollector((_) => new Uint8Array(_))],
            $ = -1,
            O = async (_) => {
                let {
                    value: J,
                    done: X
                } = await Y.read(), D = J;
                if (X) {
                    if ($ !== -1) {
                        let j = $t1(H, $);
                        if (PH1(j) > 0) _.enqueue(j)
                    }
                    _.close()
                } else {
                    let j = mO8(D, !1);
                    if ($ !== j) {
                        if ($ >= 0) _.enqueue($t1(H, $));
                        $ = j
                    }
                    if ($ === -1) {
                        _.enqueue(D);
                        return
                    }
                    let M = PH1(D);
                    w += M;
                    let P = PH1(H[$]);
                    if (M >= q && P === 0) _.enqueue(D);
                    else {
                        let W = BO8(H, $, D);
                        if (!z && w > q * 2) z = !0, K?.warn(`@smithy/util-stream - stream chunk size ${M} is below threshold of ${q}, automatically buffering.`);
                        if (W >= q) _.enqueue($t1(H, $));
                        else await O(_)
                    }
                }
            };
        return new ReadableStream({
            pull: O
        })
    }
    FO8.createBufferedReadable = uO8;

    function BO8(A, q, K) {
        switch (q) {
            case 0:
                return A[0] += K, PH1(A[0]);
            case 1:
            case 2:
                return A[q].push(K), PH1(A[q])
        }
    }

    function $t1(A, q) {
        switch (q) {
            case 0:
                let K = A[0];
                return A[0] = "", K;
            case 1:
            case 2:
                return A[q].flush()
        }
        throw Error(`@smithy/util-stream - invalid index ${q} given to flush()`)
    }

    function PH1(A) {
        return A?.byteLength ?? A?.length ?? 0
    }

    function mO8(A, q = !0) {
        if (q && typeof Buffer < "u" && A instanceof Buffer) return 2;
        if (A instanceof Uint8Array) return 1;
        if (typeof A === "string") return 0;
        return -1
    }
})
// @from(Ln 52719, Col 4)
dO8 = R((pO8) => {
    Object.defineProperty(pO8, "__esModule", {
        value: !0
    });
    pO8.createBufferedReadable = XjK;
    var _jK = h1("node:stream"),
        UO8 = IQ6(),
        QQ = gO8(),
        JjK = yi();

    function XjK(A, q, K) {
        if ((0, JjK.isReadableStream)(A)) return (0, QQ.createBufferedReadableStream)(A, q, K);
        let Y = new _jK.Readable({
                read() {}
            }),
            z = !1,
            w = 0,
            H = ["", new UO8.ByteArrayCollector((O) => new Uint8Array(O)), new UO8.ByteArrayCollector((O) => Buffer.from(new Uint8Array(O)))],
            $ = -1;
        return A.on("data", (O) => {
            let _ = (0, QQ.modeOf)(O, !0);
            if ($ !== _) {
                if ($ >= 0) Y.push((0, QQ.flush)(H, $));
                $ = _
            }
            if ($ === -1) {
                Y.push(O);
                return
            }
            let J = (0, QQ.sizeOf)(O);
            w += J;
            let X = (0, QQ.sizeOf)(H[$]);
            if (J >= q && X === 0) Y.push(O);
            else {
                let D = (0, QQ.merge)(H, $, O);
                if (!z && w > q * 2) z = !0, K?.warn(`@smithy/util-stream - stream chunk size ${J} is below threshold of ${q}, automatically buffering.`);
                if (D >= q) Y.push((0, QQ.flush)(H, $))
            }
        }), A.on("end", () => {
            if ($ !== -1) {
                let O = (0, QQ.flush)(H, $);
                if ((0, QQ.sizeOf)(O) > 0) Y.push(O)
            }
            Y.push(null)
        }), Y
    }
})
// @from(Ln 52766, Col 4)
iO8 = R((cO8) => {
    Object.defineProperty(cO8, "__esModule", {
        value: !0
    });
    cO8.getAwsChunkedEncodingStream = void 0;
    var jjK = h1("stream"),
        MjK = (A, q) => {
            let {
                base64Encoder: K,
                bodyLengthChecker: Y,
                checksumAlgorithmFn: z,
                checksumLocationName: w,
                streamHasher: H
            } = q, $ = K !== void 0 && z !== void 0 && w !== void 0 && H !== void 0, O = $ ? H(z, A) : void 0, _ = new jjK.Readable({
                read: () => {}
            });
            return A.on("data", (J) => {
                let X = Y(J) || 0;
                _.push(`${X.toString(16)}\r
`), _.push(J), _.push(`\r
`)
            }), A.on("end", async () => {
                if (_.push(`0\r
`), $) {
                    let J = K(await O);
                    _.push(`${w}:${J}\r
`), _.push(`\r
`)
                }
                _.push(null)
            }), _
        };
    cO8.getAwsChunkedEncodingStream = MjK
})
// @from(Ln 52800, Col 4)
rO8 = R((nO8) => {
    Object.defineProperty(nO8, "__esModule", {
        value: !0
    });
    nO8.headStream = PjK;
    async function PjK(A, q) {
        let K = 0,
            Y = [],
            z = A.getReader(),
            w = !1;
        while (!w) {
            let {
                done: O,
                value: _
            } = await z.read();
            if (_) Y.push(_), K += _?.byteLength ?? 0;
            if (K >= q) break;
            w = O
        }
        z.releaseLock();
        let H = new Uint8Array(Math.min(q, K)),
            $ = 0;
        for (let O of Y) {
            if (O.byteLength > H.byteLength - $) {
                H.set(O.subarray(0, H.byteLength - $), $);
                break
            } else H.set(O, $);
            $ += O.length
        }
        return H
    }
})
// @from(Ln 52832, Col 4)
tO8 = R((aO8) => {
    Object.defineProperty(aO8, "__esModule", {
        value: !0
    });
    aO8.headStream = void 0;
    var GjK = h1("stream"),
        ZjK = rO8(),
        fjK = yi(),
        VjK = (A, q) => {
            if ((0, fjK.isReadableStream)(A)) return (0, ZjK.headStream)(A, q);
            return new Promise((K, Y) => {
                let z = new oO8;
                z.limit = q, A.pipe(z), A.on("error", (w) => {
                    z.end(), Y(w)
                }), z.on("error", Y), z.on("finish", function() {
                    let w = new Uint8Array(Buffer.concat(this.buffers));
                    K(w)
                })
            })
        };
    aO8.headStream = VjK;
    class oO8 extends GjK.Writable {
        buffers = [];
        limit = 1 / 0;
        bytesBuffered = 0;
        _write(A, q, K) {
            if (this.buffers.push(A), this.bytesBuffered += A.byteLength ?? 0, this.bytesBuffered >= this.limit) {
                let Y = this.bytesBuffered - this.limit,
                    z = this.buffers[this.buffers.length - 1];
                this.buffers[this.buffers.length - 1] = z.subarray(0, z.byteLength - Y), this.emit("finish")
            }
            K()
        }
    }
})
// @from(Ln 52867, Col 4)
eO8 = R((LjK) => {
    LjK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LjK.HttpAuthLocation || (LjK.HttpAuthLocation = {}));
    LjK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LjK.HttpApiKeyAuthLocation || (LjK.HttpApiKeyAuthLocation = {}));
    LjK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(LjK.EndpointURLScheme || (LjK.EndpointURLScheme = {}));
    LjK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(LjK.AlgorithmId || (LjK.AlgorithmId = {}));
    var NjK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => LjK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => LjK.AlgorithmId.MD5,
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
        TjK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        vjK = (A) => {
            return NjK(A)
        },
        EjK = (A) => {
            return TjK(A)
        };
    LjK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(LjK.FieldPosition || (LjK.FieldPosition = {}));
    var kjK = "__smithy_context";
    LjK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(LjK.IniSectionType || (LjK.IniSectionType = {}));
    LjK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(LjK.RequestHandlerProtocol || (LjK.RequestHandlerProtocol = {}));
    LjK.SMITHY_CONTEXT_KEY = kjK;
    LjK.getDefaultClientConfiguration = vjK;
    LjK.resolveDefaultRuntimeConfig = EjK
})
// @from(Ln 52932, Col 4)
Y_8 = R((ujK) => {
    var SjK = eO8(),
        hjK = (A) => {
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
        IjK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class A_8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = SjK.FieldPosition.HEADER,
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
    class q_8 {
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
    class Ot1 {
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
            let q = new Ot1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = xjK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Ot1.clone(this)
        }
    }

    function xjK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class K_8 {
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

    function bjK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    ujK.Field = A_8;
    ujK.Fields = q_8;
    ujK.HttpRequest = Ot1;
    ujK.HttpResponse = K_8;
    ujK.getHttpHandlerExtensionConfiguration = hjK;
    ujK.isValidHostname = bjK;
    ujK.resolveHttpHandlerRuntimeConfig = IjK
})
// @from(Ln 53074, Col 4)
w_8 = R((ljK) => {
    var z_8 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, djK),
        djK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        cjK = (A) => A.split("/").map(z_8).join("/");
    ljK.escapeUri = z_8;
    ljK.escapeUriPath = cjK
})
// @from(Ln 53081, Col 4)
H_8 = R((ojK) => {
    var QQ6 = w_8();

    function rjK(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = QQ6.escapeUri(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${QQ6.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${QQ6.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    ojK.buildQueryString = rjK
})
// @from(Ln 53100, Col 4)
cf = R((OMK) => {
    var J_8 = Y_8(),
        X_8 = H_8(),
        _t1 = h1("http"),
        Jt1 = h1("https"),
        D_8 = h1("stream"),
        gQ6 = h1("http2"),
        sjK = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        j_8 = (A) => {
            let q = {};
            for (let K of Object.keys(A)) {
                let Y = A[K];
                q[K] = Array.isArray(Y) ? Y.join(",") : Y
            }
            return q
        },
        xG = {
            setTimeout: (A, q) => setTimeout(A, q),
            clearTimeout: (A) => clearTimeout(A)
        },
        $_8 = 1000,
        tjK = (A, q, K = 0) => {
            if (!K) return -1;
            let Y = (z) => {
                let w = xG.setTimeout(() => {
                        A.destroy(), q(Object.assign(Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${K} ms.`), {
                            name: "TimeoutError"
                        }))
                    }, K - z),
                    H = ($) => {
                        if ($?.connecting) $.on("connect", () => {
                            xG.clearTimeout(w)
                        });
                        else xG.clearTimeout(w)
                    };
                if (A.socket) H(A.socket);
                else A.on("socket", H)
            };
            if (K < 2000) return Y(0), 0;
            return xG.setTimeout(Y.bind(null, $_8), $_8)
        },
        ejK = (A, q, K = 0, Y, z) => {
            if (K) return xG.setTimeout(() => {
                let w = `@smithy/node-http-handler - [${Y?"ERROR":"WARN"}] a request has exceeded the configured ${K} ms requestTimeout.`;
                if (Y) {
                    let H = Object.assign(Error(w), {
                        name: "TimeoutError",
                        code: "ETIMEDOUT"
                    });
                    A.destroy(H), q(H)
                } else w += " Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.", z?.warn?.(w)
            }, K);
            return -1
        },
        AMK = 3000,
        qMK = (A, {
            keepAlive: q,
            keepAliveMsecs: K
        }, Y = AMK) => {
            if (q !== !0) return -1;
            let z = () => {
                if (A.socket) A.socket.setKeepAlive(q, K || 0);
                else A.on("socket", (w) => {
                    w.setKeepAlive(q, K || 0)
                })
            };
            if (Y === 0) return z(), 0;
            return xG.setTimeout(z, Y)
        },
        O_8 = 3000,
        KMK = (A, q, K = 0) => {
            let Y = (z) => {
                let w = K - z,
                    H = () => {
                        A.destroy(), q(Object.assign(Error(`@smithy/node-http-handler - the request socket timed out after ${K} ms of inactivity (configured by client requestHandler).`), {
                            name: "TimeoutError"
                        }))
                    };
                if (A.socket) A.socket.setTimeout(w, H), A.on("close", () => A.socket?.removeListener("timeout", H));
                else A.setTimeout(w, H)
            };
            if (0 < K && K < 6000) return Y(0), 0;
            return xG.setTimeout(Y.bind(null, K === 0 ? 0 : O_8), O_8)
        },
        __8 = 6000;
    async function M_8(A, q, K = __8, Y = !1) {
        let z = q.headers ?? {},
            w = z.Expect || z.expect,
            H = -1,
            $ = !0;
        if (!Y && w === "100-continue") $ = await Promise.race([new Promise((O) => {
            H = Number(xG.setTimeout(() => O(!0), Math.max(__8, K)))
        }), new Promise((O) => {
            A.on("continue", () => {
                xG.clearTimeout(H), O(!0)
            }), A.on("response", () => {
                xG.clearTimeout(H), O(!1)
            }), A.on("error", () => {
                xG.clearTimeout(H), O(!1)
            })
        })]);
        if ($) YMK(A, q.body)
    }

    function YMK(A, q) {
        if (q instanceof D_8.Readable) {
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
    var zMK = 0;
    class Xt1 {
        config;
        configProvider;
        socketWarningTimestamp = 0;
        externalAgent = !1;
        metadata = {
            handlerProtocol: "http/1.1"
        };
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new Xt1(A)
        }
        static checkSocketUsage(A, q, K = console) {
            let {
                sockets: Y,
                requests: z,
                maxSockets: w
            } = A;
            if (typeof w !== "number" || w === 1 / 0) return q;
            let H = 15000;
            if (Date.now() - H < q) return q;
            if (Y && z)
                for (let $ in Y) {
                    let O = Y[$]?.length ?? 0,
                        _ = z[$]?.length ?? 0;
                    if (O >= w && _ >= 2 * w) return K?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${O} and ${_} additional requests are enqueued.
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
                httpAgent: w,
                httpsAgent: H,
                throwOnRequestTimeout: $
            } = A || {}, O = !0, _ = 50;
            return {
                connectionTimeout: K,
                requestTimeout: q,
                socketTimeout: Y,
                socketAcquisitionWarningTimeout: z,
                throwOnRequestTimeout: $,
                httpAgent: (() => {
                    if (w instanceof _t1.Agent || typeof w?.destroy === "function") return this.externalAgent = !0, w;
                    return new _t1.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ...w
                    })
                })(),
                httpsAgent: (() => {
                    if (H instanceof Jt1.Agent || typeof H?.destroy === "function") return this.externalAgent = !0, H;
                    return new Jt1.Agent({
                        keepAlive: !0,
                        maxSockets: 50,
                        ...H
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
                let w = this.config,
                    H = void 0,
                    $ = [],
                    O = async (y) => {
                        await H, $.forEach(xG.clearTimeout), Y(y)
                    }, _ = async (y) => {
                        await H, $.forEach(xG.clearTimeout), z(y)
                    };
                if (q?.aborted) {
                    let y = Error("Request aborted");
                    y.name = "AbortError", _(y);
                    return
                }
                let J = A.protocol === "https:",
                    X = A.headers ?? {},
                    D = (X.Expect ?? X.expect) === "100-continue",
                    j = J ? w.httpsAgent : w.httpAgent;
                if (D && !this.externalAgent) j = new(J ? Jt1.Agent : _t1.Agent)({
                    keepAlive: !1,
                    maxSockets: 1 / 0
                });
                $.push(xG.setTimeout(() => {
                    this.socketWarningTimestamp = Xt1.checkSocketUsage(j, this.socketWarningTimestamp, w.logger)
                }, w.socketAcquisitionWarningTimeout ?? (w.requestTimeout ?? 2000) + (w.connectionTimeout ?? 1000)));
                let M = X_8.buildQueryString(A.query || {}),
                    P = void 0;
                if (A.username != null || A.password != null) {
                    let y = A.username ?? "",
                        B = A.password ?? "";
                    P = `${y}:${B}`
                }
                let W = A.path;
                if (M) W += `?${M}`;
                if (A.fragment) W += `#${A.fragment}`;
                let G = A.hostname ?? "";
                if (G[0] === "[" && G.endsWith("]")) G = A.hostname.slice(1, -1);
                else G = A.hostname;
                let f = {
                        headers: A.headers,
                        host: G,
                        method: A.method,
                        path: W,
                        port: A.port,
                        agent: j,
                        auth: P
                    },
                    N = (J ? Jt1.request : _t1.request)(f, (y) => {
                        let B = new J_8.HttpResponse({
                            statusCode: y.statusCode || -1,
                            reason: y.statusMessage,
                            headers: j_8(y.headers),
                            body: y
                        });
                        O({
                            response: B
                        })
                    });
                if (N.on("error", (y) => {
                        if (sjK.includes(y.code)) _(Object.assign(y, {
                            name: "TimeoutError"
                        }));
                        else _(y)
                    }), q) {
                    let y = () => {
                        N.destroy();
                        let B = Error("Request aborted");
                        B.name = "AbortError", _(B)
                    };
                    if (typeof q.addEventListener === "function") {
                        let B = q;
                        B.addEventListener("abort", y, {
                            once: !0
                        }), N.once("close", () => B.removeEventListener("abort", y))
                    } else q.onabort = y
                }
                let T = K ?? w.requestTimeout;
                $.push(tjK(N, _, w.connectionTimeout)), $.push(ejK(N, _, T, w.throwOnRequestTimeout, w.logger ?? console)), $.push(KMK(N, _, w.socketTimeout));
                let k = f.agent;
                if (typeof k === "object" && "keepAlive" in k) $.push(qMK(N, {
                    keepAlive: k.keepAlive,
                    keepAliveMsecs: k.keepAliveMsecs
                }));
                H = M_8(N, A, T, this.externalAgent).catch((y) => {
                    return $.forEach(xG.clearTimeout), z(y)
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
    class P_8 {
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
    class W_8 {
        constructor(A) {
            if (this.config = A, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
        }
        config;
        sessionCache = new Map;
        lease(A, q) {
            let K = this.getUrlString(A),
                Y = this.sessionCache.get(K);
            if (Y) {
                let $ = Y.poll();
                if ($ && !this.config.disableConcurrency) return $
            }
            let z = gQ6.connect(K);
            if (this.config.maxConcurrency) z.settings({
                maxConcurrentStreams: this.config.maxConcurrency
            }, ($) => {
                if ($) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + A.destination.toString())
            });
            z.unref();
            let w = () => {
                z.destroy(), this.deleteSession(K, z)
            };
            if (z.on("goaway", w), z.on("error", w), z.on("frameError", w), z.on("close", () => this.deleteSession(K, z)), q.requestTimeout) z.setTimeout(q.requestTimeout, w);
            let H = this.sessionCache.get(K) || new P_8;
            return H.offerLast(z), this.sessionCache.set(K, H), z
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
    class UQ6 {
        config;
        configProvider;
        metadata = {
            handlerProtocol: "h2"
        };
        connectionManager = new W_8({});
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new UQ6(A)
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
            } = this.config, w = K ?? Y;
            return new Promise((H, $) => {
                let O = !1,
                    _ = void 0,
                    J = async (S) => {
                        await _, H(S)
                    }, X = async (S) => {
                        await _, $(S)
                    };
                if (q?.aborted) {
                    O = !0;
                    let S = Error("Request aborted");
                    S.name = "AbortError", X(S);
                    return
                }
                let {
                    hostname: D,
                    method: j,
                    port: M,
                    protocol: P,
                    query: W
                } = A, G = "";
                if (A.username != null || A.password != null) {
                    let S = A.username ?? "",
                        m = A.password ?? "";
                    G = `${S}:${m}@`
                }
                let f = `${P}//${G}${D}${M?`:${M}`:""}`,
                    Z = {
                        destination: new URL(f)
                    },
                    N = this.connectionManager.lease(Z, {
                        requestTimeout: this.config?.sessionTimeout,
                        disableConcurrentStreams: z || !1
                    }),
                    T = (S) => {
                        if (z) this.destroySession(N);
                        O = !0, X(S)
                    },
                    k = X_8.buildQueryString(W || {}),
                    y = A.path;
                if (k) y += `?${k}`;
                if (A.fragment) y += `#${A.fragment}`;
                let B = N.request({
                    ...A.headers,
                    [gQ6.constants.HTTP2_HEADER_PATH]: y,
                    [gQ6.constants.HTTP2_HEADER_METHOD]: j
                });
                if (N.ref(), B.on("response", (S) => {
                        let m = new J_8.HttpResponse({
                            statusCode: S[":status"] || -1,
                            headers: j_8(S),
                            body: B
                        });
                        if (O = !0, J({
                                response: m
                            }), z) N.close(), this.connectionManager.deleteSession(f, N)
                    }), w) B.setTimeout(w, () => {
                    B.close();
                    let S = Error(`Stream timed out because of no activity for ${w} ms`);
                    S.name = "TimeoutError", T(S)
                });
                if (q) {
                    let S = () => {
                        B.close();
                        let m = Error("Request aborted");
                        m.name = "AbortError", T(m)
                    };
                    if (typeof q.addEventListener === "function") {
                        let m = q;
                        m.addEventListener("abort", S, {
                            once: !0
                        }), B.once("close", () => m.removeEventListener("abort", S))
                    } else q.onabort = S
                }
                B.on("frameError", (S, m, b) => {
                    T(Error(`Frame type id ${S} in stream id ${b} has failed with code ${m}.`))
                }), B.on("error", T), B.on("aborted", () => {
                    T(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${B.rstCode}.`))
                }), B.on("close", () => {
                    if (N.unref(), z) N.destroy();
                    if (!O) T(Error("Unexpected error: http2 request did not get a response"))
                }), _ = M_8(B, A, w)
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
    class G_8 extends D_8.Writable {
        bufferedBytes = [];
        _write(A, q, K) {
            this.bufferedBytes.push(A), K()
        }
    }
    var wMK = (A) => {
            if (HMK(A)) return $MK(A);
            return new Promise((q, K) => {
                let Y = new G_8;
                A.pipe(Y), A.on("error", (z) => {
                    Y.end(), K(z)
                }), Y.on("error", K), Y.on("finish", function() {
                    let z = new Uint8Array(Buffer.concat(this.bufferedBytes));
                    q(z)
                })
            })
        },
        HMK = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
    async function $MK(A) {
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
    OMK.DEFAULT_REQUEST_TIMEOUT = zMK;
    OMK.NodeHttp2Handler = UQ6;
    OMK.NodeHttpHandler = Xt1;
    OMK.streamCollector = wMK
})
// @from(Ln 53664, Col 4)
Z_8 = R((ZMK) => {
    ZMK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ZMK.HttpAuthLocation || (ZMK.HttpAuthLocation = {}));
    ZMK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ZMK.HttpApiKeyAuthLocation || (ZMK.HttpApiKeyAuthLocation = {}));
    ZMK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ZMK.EndpointURLScheme || (ZMK.EndpointURLScheme = {}));
    ZMK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ZMK.AlgorithmId || (ZMK.AlgorithmId = {}));
    var jMK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ZMK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ZMK.AlgorithmId.MD5,
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
        MMK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        PMK = (A) => {
            return jMK(A)
        },
        WMK = (A) => {
            return MMK(A)
        };
    ZMK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ZMK.FieldPosition || (ZMK.FieldPosition = {}));
    var GMK = "__smithy_context";
    ZMK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ZMK.IniSectionType || (ZMK.IniSectionType = {}));
    ZMK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ZMK.RequestHandlerProtocol || (ZMK.RequestHandlerProtocol = {}));
    ZMK.SMITHY_CONTEXT_KEY = GMK;
    ZMK.getDefaultClientConfiguration = PMK;
    ZMK.resolveDefaultRuntimeConfig = WMK
})
// @from(Ln 53729, Col 4)
T_8 = R((RMK) => {
    var TMK = Z_8(),
        vMK = (A) => {
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
        EMK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class f_8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = TMK.FieldPosition.HEADER,
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
    class V_8 {
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
    class Dt1 {
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
            let q = new Dt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = kMK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Dt1.clone(this)
        }
    }

    function kMK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class N_8 {
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

    function LMK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    RMK.Field = f_8;
    RMK.Fields = V_8;
    RMK.HttpRequest = Dt1;
    RMK.HttpResponse = N_8;
    RMK.getHttpHandlerExtensionConfiguration = vMK;
    RMK.isValidHostname = LMK;
    RMK.resolveHttpHandlerRuntimeConfig = EMK
})
// @from(Ln 53871, Col 4)
E_8 = R((mMK) => {
    var v_8 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, uMK),
        uMK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        BMK = (A) => A.split("/").map(v_8).join("/");
    mMK.escapeUri = v_8;
    mMK.escapeUriPath = BMK
})
// @from(Ln 53878, Col 4)
k_8 = R((UMK) => {
    var rQ6 = E_8();

    function gMK(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = rQ6.escapeUri(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${rQ6.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${rQ6.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    UMK.buildQueryString = gMK
})
// @from(Ln 53897, Col 4)
y_8 = R((aMK) => {
    var L_8 = T_8(),
        dMK = k_8(),
        cMK = MH1();

    function R_8(A, q) {
        return new Request(A, q)
    }

    function lMK(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    var jt1 = {
        supported: void 0
    };
    class oQ6 {
        config;
        configProvider;
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new oQ6(A)
        }
        constructor(A) {
            if (typeof A === "function") this.configProvider = A().then((q) => q || {});
            else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
            if (jt1.supported === void 0) jt1.supported = Boolean(typeof Request < "u" && "keepalive" in R_8("https://[::1]"))
        }
        destroy() {}
        async handle(A, {
            abortSignal: q,
            requestTimeout: K
        } = {}) {
            if (!this.config) this.config = await this.configProvider;
            let Y = K ?? this.config.requestTimeout,
                z = this.config.keepAlive === !0,
                w = this.config.credentials;
            if (q?.aborted) {
                let G = Error("Request aborted");
                return G.name = "AbortError", Promise.reject(G)
            }
            let H = A.path,
                $ = dMK.buildQueryString(A.query || {});
            if ($) H += `?${$}`;
            if (A.fragment) H += `#${A.fragment}`;
            let O = "";
            if (A.username != null || A.password != null) {
                let G = A.username ?? "",
                    f = A.password ?? "";
                O = `${G}:${f}@`
            }
            let {
                port: _,
                method: J
            } = A, X = `${A.protocol}//${O}${A.hostname}${_?`:${_}`:""}${H}`, D = J === "GET" || J === "HEAD" ? void 0 : A.body, j = {
                body: D,
                headers: new Headers(A.headers),
                method: J,
                credentials: w
            };
            if (this.config?.cache) j.cache = this.config.cache;
            if (D) j.duplex = "half";
            if (typeof AbortController < "u") j.signal = q;
            if (jt1.supported) j.keepalive = z;
            if (typeof this.config.requestInit === "function") Object.assign(j, this.config.requestInit(A));
            let M = () => {},
                P = R_8(X, j),
                W = [fetch(P).then((G) => {
                    let f = G.headers,
                        Z = {};
                    for (let T of f.entries()) Z[T[0]] = T[1];
                    if (G.body == null) return G.blob().then((T) => ({
                        response: new L_8.HttpResponse({
                            headers: Z,
                            reason: G.statusText,
                            statusCode: G.status,
                            body: T
                        })
                    }));
                    return {
                        response: new L_8.HttpResponse({
                            headers: Z,
                            reason: G.statusText,
                            statusCode: G.status,
                            body: G.body
                        })
                    }
                }), lMK(Y)];
            if (q) W.push(new Promise((G, f) => {
                let Z = () => {
                    let N = Error("Request aborted");
                    N.name = "AbortError", f(N)
                };
                if (typeof q.addEventListener === "function") {
                    let N = q;
                    N.addEventListener("abort", Z, {
                        once: !0
                    }), M = () => N.removeEventListener("abort", Z)
                } else q.onabort = Z
            }));
            return Promise.race(W).finally(M)
        }
        updateHttpClientConfig(A, q) {
            this.config = void 0, this.configProvider = this.configProvider.then((K) => {
                return K[A] = q, K
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
    }
    var iMK = async (A) => {
        if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
            if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
            return nMK(A)
        }
        return rMK(A)
    };
    async function nMK(A) {
        let q = await oMK(A),
            K = cMK.fromBase64(q);
        return new Uint8Array(K)
    }
    async function rMK(A) {
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

    function oMK(A) {
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
    aMK.FetchHttpHandler = oQ6;
    aMK.keepAliveSupport = jt1;
    aMK.streamCollector = iMK
})
// @from(Ln 54059, Col 4)
S_8 = R((KPK) => {
    var C_8 = {},
        aQ6 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        C_8[A] = q, aQ6[q] = A
    }

    function APK(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in aQ6) q[K / 2] = aQ6[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function qPK(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += C_8[A[K]];
        return q
    }
    KPK.fromHex = APK;
    KPK.toHex = qPK
})
// @from(Ln 54087, Col 4)
B_8 = R((b_8) => {
    Object.defineProperty(b_8, "__esModule", {
        value: !0
    });
    b_8.sdkStreamMixin = void 0;
    var wPK = y_8(),
        HPK = MH1(),
        $PK = S_8(),
        OPK = Z2(),
        h_8 = yi(),
        I_8 = "The stream has already been transformed.",
        _PK = (A) => {
            if (!x_8(A) && !(0, h_8.isReadableStream)(A)) {
                let z = A?.__proto__?.constructor?.name || A;
                throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${z}`)
            }
            let q = !1,
                K = async () => {
                    if (q) throw Error(I_8);
                    return q = !0, await (0, wPK.streamCollector)(A)
                }, Y = (z) => {
                    if (typeof z.stream !== "function") throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
                    return z.stream()
                };
            return Object.assign(A, {
                transformToByteArray: K,
                transformToString: async (z) => {
                    let w = await K();
                    if (z === "base64") return (0, HPK.toBase64)(w);
                    else if (z === "hex") return (0, $PK.toHex)(w);
                    else if (z === void 0 || z === "utf8" || z === "utf-8") return (0, OPK.toUtf8)(w);
                    else if (typeof TextDecoder === "function") return new TextDecoder(z).decode(w);
                    else throw Error("TextDecoder is not available, please make sure polyfill is provided.")
                },
                transformToWebStream: () => {
                    if (q) throw Error(I_8);
                    if (q = !0, x_8(A)) return Y(A);
                    else if ((0, h_8.isReadableStream)(A)) return A;
                    else throw Error(`Cannot transform payload to web stream, got ${A}`)
                }
            })
        };
    b_8.sdkStreamMixin = _PK;
    var x_8 = (A) => typeof Blob === "function" && A instanceof Blob
})
// @from(Ln 54133, Col 4)
g_8 = R((F_8) => {
    Object.defineProperty(F_8, "__esModule", {
        value: !0
    });
    F_8.sdkStreamMixin = void 0;
    var JPK = cf(),
        XPK = Ht1(),
        sQ6 = h1("stream"),
        DPK = B_8(),
        m_8 = "The stream has already been transformed.",
        jPK = (A) => {
            if (!(A instanceof sQ6.Readable)) try {
                return (0, DPK.sdkStreamMixin)(A)
            } catch (Y) {
                let z = A?.__proto__?.constructor?.name || A;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${z}`)
            }
            let q = !1,
                K = async () => {
                    if (q) throw Error(m_8);
                    return q = !0, await (0, JPK.streamCollector)(A)
                };
            return Object.assign(A, {
                transformToByteArray: K,
                transformToString: async (Y) => {
                    let z = await K();
                    if (Y === void 0 || Buffer.isEncoding(Y)) return (0, XPK.fromArrayBuffer)(z.buffer, z.byteOffset, z.byteLength).toString(Y);
                    else return new TextDecoder(Y).decode(z)
                },
                transformToWebStream: () => {
                    if (q) throw Error(m_8);
                    if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof sQ6.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
                    return q = !0, sQ6.Readable.toWeb(A)
                }
            })
        };
    F_8.sdkStreamMixin = jPK
})
// @from(Ln 54172, Col 4)
p_8 = R((U_8) => {
    Object.defineProperty(U_8, "__esModule", {
        value: !0
    });
    U_8.splitStream = MPK;
    async function MPK(A) {
        if (typeof A.stream === "function") A = A.stream();
        return A.tee()
    }
})
// @from(Ln 54182, Col 4)
i_8 = R((l_8) => {
    Object.defineProperty(l_8, "__esModule", {
        value: !0
    });
    l_8.splitStream = GPK;
    var d_8 = h1("stream"),
        WPK = p_8(),
        c_8 = yi();
    async function GPK(A) {
        if ((0, c_8.isReadableStream)(A) || (0, c_8.isBlob)(A)) return (0, WPK.splitStream)(A);
        let q = new d_8.PassThrough,
            K = new d_8.PassThrough;
        return A.pipe(q), A.pipe(K), [q, K]
    }
})
// @from(Ln 54197, Col 4)
tQ6 = R((ej) => {
    var n_8 = MH1(),
        r_8 = Z2(),
        o_8 = hQ6(),
        a_8 = hO8(),
        s_8 = dO8(),
        t_8 = iO8(),
        e_8 = tO8(),
        AJ8 = g_8(),
        qJ8 = i_8(),
        KJ8 = yi();
    class ev1 extends Uint8Array {
        static fromString(A, q = "utf-8") {
            if (typeof A === "string") {
                if (q === "base64") return ev1.mutate(n_8.fromBase64(A));
                return ev1.mutate(r_8.fromUtf8(A))
            }
            throw Error(`Unsupported conversion from ${typeof A} to Uint8ArrayBlobAdapter.`)
        }
        static mutate(A) {
            return Object.setPrototypeOf(A, ev1.prototype), A
        }
        transformToString(A = "utf-8") {
            if (A === "base64") return n_8.toBase64(this);
            return r_8.toUtf8(this)
        }
    }
    ej.Uint8ArrayBlobAdapter = ev1;
    Object.keys(o_8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return o_8[A]
            }
        })
    });
    Object.keys(a_8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return a_8[A]
            }
        })
    });
    Object.keys(s_8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return s_8[A]
            }
        })
    });
    Object.keys(t_8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return t_8[A]
            }
        })
    });
    Object.keys(e_8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return e_8[A]
            }
        })
    });
    Object.keys(AJ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return AJ8[A]
            }
        })
    });
    Object.keys(qJ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return qJ8[A]
            }
        })
    });
    Object.keys(KJ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ej, A)) Object.defineProperty(ej, A, {
            enumerable: !0,
            get: function() {
                return KJ8[A]
            }
        })
    })
})
// @from(Ln 54290, Col 4)
R$ = R((IPK) => {
    var VPK = ov1(),
        YJ8 = iP(),
        Mt1 = (A) => {
            if (typeof A === "function") return A();
            return A
        },
        qg6 = (A, q, K, Y, z) => ({
            name: q,
            namespace: A,
            traits: K,
            input: Y,
            output: z
        }),
        NPK = (A) => (q, K) => async (Y) => {
            let {
                response: z
            } = await q(Y), {
                operationSchema: w
            } = YJ8.getSmithyContext(K), [, H, $, O, _, J] = w ?? [];
            try {
                let X = await A.protocol.deserializeResponse(qg6(H, $, O, _, J), {
                    ...A,
                    ...K
                }, z);
                return {
                    response: z,
                    output: X
                }
            } catch (X) {
                if (Object.defineProperty(X, "$response", {
                        value: z,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in X)) {
                    try {
                        X.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch (j) {
                        if (!K.logger || K.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else K.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof X.$responseBodyText < "u") {
                        if (X.$response) X.$response.body = X.$responseBodyText
                    }
                    try {
                        if (VPK.HttpResponse.isInstance(z)) {
                            let {
                                headers: j = {}
                            } = z, M = Object.entries(j);
                            X.$metadata = {
                                httpStatusCode: z.statusCode,
                                requestId: eQ6(/^x-[\w-]+-request-?id$/, M),
                                extendedRequestId: eQ6(/^x-[\w-]+-id-2$/, M),
                                cfId: eQ6(/^x-[\w-]+-cf-id$/, M)
                            }
                        }
                    } catch (j) {}
                }
                throw X
            }
        }, eQ6 = (A, q) => {
            return (q.find(([K]) => {
                return K.match(A)
            }) || [void 0, void 0])[1]
        }, TPK = (A) => (q, K) => async (Y) => {
            let {
                operationSchema: z
            } = YJ8.getSmithyContext(K), [, w, H, $, O, _] = z ?? [], J = K.endpointV2?.url && A.urlParser ? async () => A.urlParser(K.endpointV2.url): A.endpoint, X = await A.protocol.serializeRequest(qg6(w, H, $, O, _), Y.input, {
                ...A,
                ...K,
                endpoint: J
            });
            return q({
                ...Y,
                request: X
            })
        }, zJ8 = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, wJ8 = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function vPK(A) {
        return {
            applyToStack: (q) => {
                q.add(TPK(A), wJ8), q.add(NPK(A), zJ8), A.protocol.setSerdeContext(A)
            }
        }
    }
    class lf {
        name;
        namespace;
        traits;
        static assign(A, q) {
            return Object.assign(A, q)
        }
        static[Symbol.hasInstance](A) {
            let q = this.prototype.isPrototypeOf(A);
            if (!q && typeof A === "object" && A !== null) return A.symbol === this.symbol;
            return q
        }
        getName() {
            return this.namespace + "#" + this.name
        }
    }
    class Pt1 extends lf {
        static symbol = Symbol.for("@smithy/lis");
        name;
        traits;
        valueSchema;
        symbol = Pt1.symbol
    }
    var EPK = (A, q, K, Y) => lf.assign(new Pt1, {
        name: q,
        namespace: A,
        traits: K,
        valueSchema: Y
    });
    class Wt1 extends lf {
        static symbol = Symbol.for("@smithy/map");
        name;
        traits;
        keySchema;
        valueSchema;
        symbol = Wt1.symbol
    }
    var kPK = (A, q, K, Y, z) => lf.assign(new Wt1, {
        name: q,
        namespace: A,
        traits: K,
        keySchema: Y,
        valueSchema: z
    });
    class Gt1 extends lf {
        static symbol = Symbol.for("@smithy/ope");
        name;
        traits;
        input;
        output;
        symbol = Gt1.symbol
    }
    var LPK = (A, q, K, Y, z) => lf.assign(new Gt1, {
        name: q,
        namespace: A,
        traits: K,
        input: Y,
        output: z
    });
    class KE1 extends lf {
        static symbol = Symbol.for("@smithy/str");
        name;
        traits;
        memberNames;
        memberList;
        symbol = KE1.symbol
    }
    var RPK = (A, q, K, Y, z) => lf.assign(new KE1, {
        name: q,
        namespace: A,
        traits: K,
        memberNames: Y,
        memberList: z
    });
    class Zt1 extends KE1 {
        static symbol = Symbol.for("@smithy/err");
        ctor;
        symbol = Zt1.symbol
    }
    var yPK = (A, q, K, Y, z, w) => lf.assign(new Zt1, {
        name: q,
        namespace: A,
        traits: K,
        memberNames: Y,
        memberList: z,
        ctor: null
    });

    function qE1(A) {
        if (typeof A === "object") return A;
        A = A | 0;
        let q = {},
            K = 0;
        for (let Y of ["httpLabel", "idempotent", "idempotencyToken", "sensitive", "httpPayload", "httpResponseCode", "httpQueryParams"])
            if ((A >> K++ & 1) === 1) q[Y] = 1;
        return q
    }
    class UQ {
        ref;
        memberName;
        static symbol = Symbol.for("@smithy/nor");
        symbol = UQ.symbol;
        name;
        schema;
        _isMemberSchema;
        traits;
        memberTraits;
        normalizedTraits;
        constructor(A, q) {
            this.ref = A, this.memberName = q;
            let K = [],
                Y = A,
                z = A;
            this._isMemberSchema = !1;
            while (Ag6(Y)) K.push(Y[1]), Y = Y[0], z = Mt1(Y), this._isMemberSchema = !0;
            if (K.length > 0) {
                this.memberTraits = {};
                for (let w = K.length - 1; w >= 0; --w) {
                    let H = K[w];
                    Object.assign(this.memberTraits, qE1(H))
                }
            } else this.memberTraits = 0;
            if (z instanceof UQ) {
                let w = this.memberTraits;
                Object.assign(this, z), this.memberTraits = Object.assign({}, w, z.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = q ?? z.memberName;
                return
            }
            if (this.schema = Mt1(z), HJ8(this.schema)) this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3];
            else this.name = this.memberName ?? String(z), this.traits = 0;
            if (this._isMemberSchema && !q) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`)
        }
        static[Symbol.hasInstance](A) {
            let q = this.prototype.isPrototypeOf(A);
            if (!q && typeof A === "object" && A !== null) return A.symbol === this.symbol;
            return q
        }
        static of (A) {
            let q = Mt1(A);
            if (q instanceof UQ) return q;
            if (Ag6(q)) {
                let [K, Y] = q;
                if (K instanceof UQ) return Object.assign(K.getMergedTraits(), qE1(Y)), K;
                throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(A,null,2)}.`)
            }
            return new UQ(q)
        }
        getSchema() {
            let A = this.schema;
            if (A[0] === 0) return A[4];
            return A
        }
        getName(A = !1) {
            let {
                name: q
            } = this;
            return !A && q && q.includes("#") ? q.split("#")[1] : q || void 0
        }
        getMemberName() {
            return this.memberName
        }
        isMemberSchema() {
            return this._isMemberSchema
        }
        isListSchema() {
            let A = this.getSchema();
            return typeof A === "number" ? A >= 64 && A < 128 : A[0] === 1
        }
        isMapSchema() {
            let A = this.getSchema();
            return typeof A === "number" ? A >= 128 && A <= 255 : A[0] === 2
        }
        isStructSchema() {
            let A = this.getSchema();
            return A[0] === 3 || A[0] === -3
        }
        isBlobSchema() {
            let A = this.getSchema();
            return A === 21 || A === 42
        }
        isTimestampSchema() {
            let A = this.getSchema();
            return typeof A === "number" && A >= 4 && A <= 7
        }
        isUnitSchema() {
            return this.getSchema() === "unit"
        }
        isDocumentSchema() {
            return this.getSchema() === 15
        }
        isStringSchema() {
            return this.getSchema() === 0
        }
        isBooleanSchema() {
            return this.getSchema() === 2
        }
        isNumericSchema() {
            return this.getSchema() === 1
        }
        isBigIntegerSchema() {
            return this.getSchema() === 17
        }
        isBigDecimalSchema() {
            return this.getSchema() === 19
        }
        isStreaming() {
            let {
                streaming: A
            } = this.getMergedTraits();
            return !!A || this.getSchema() === 42
        }
        isIdempotencyToken() {
            let A = (z) => (z & 4) === 4 || !!z?.idempotencyToken,
                {
                    normalizedTraits: q,
                    traits: K,
                    memberTraits: Y
                } = this;
            return A(q) || A(K) || A(Y)
        }
        getMergedTraits() {
            return this.normalizedTraits ?? (this.normalizedTraits = {
                ...this.getOwnTraits(),
                ...this.getMemberTraits()
            })
        }
        getMemberTraits() {
            return qE1(this.memberTraits)
        }
        getOwnTraits() {
            return qE1(this.traits)
        }
        getKeySchema() {
            let [A, q] = [this.isDocumentSchema(), this.isMapSchema()];
            if (!A && !q) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
            let K = this.getSchema(),
                Y = A ? 15 : K[4] ?? 0;
            return AE1([Y, 0], "key")
        }
        getValueSchema() {
            let A = this.getSchema(),
                [q, K, Y] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()],
                z = typeof A === "number" ? 63 & A : A && typeof A === "object" && (K || Y) ? A[3 + A[0]] : q ? 15 : void 0;
            if (z != null) return AE1([z, 0], K ? "value" : "member");
            throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`)
        }
        getMemberSchema(A) {
            let q = this.getSchema();
            if (this.isStructSchema() && q[4].includes(A)) {
                let K = q[4].indexOf(A),
                    Y = q[5][K];
                return AE1(Ag6(Y) ? Y : [Y, 0], A)
            }
            if (this.isDocumentSchema()) return AE1([15, 0], A);
            throw Error(`@smithy/core/schema - ${this.getName(!0)} has no no member=${A}.`)
        }
        getMemberSchemas() {
            let A = {};
            try {
                for (let [q, K] of this.structIterator()) A[q] = K
            } catch (q) {}
            return A
        }
        getEventStreamMember() {
            if (this.isStructSchema()) {
                for (let [A, q] of this.structIterator())
                    if (q.isStreaming() && q.isStructSchema()) return A
            }
            return ""
        }* structIterator() {
            if (this.isUnitSchema()) return;
            if (!this.isStructSchema()) throw Error("@smithy/core/schema - cannot iterate non-struct schema.");
            let A = this.getSchema();
            for (let q = 0; q < A[4].length; ++q) yield [A[4][q], AE1([A[5][q], 0], A[4][q])]
        }
    }

    function AE1(A, q) {
        if (A instanceof UQ) return Object.assign(A, {
            memberName: q,
            _isMemberSchema: !0
        });
        return new UQ(A, q)
    }
    var Ag6 = (A) => Array.isArray(A) && A.length === 2,
        HJ8 = (A) => Array.isArray(A) && A.length >= 5;
    class YE1 extends lf {
        static symbol = Symbol.for("@smithy/sim");
        name;
        schemaRef;
        traits;
        symbol = YE1.symbol
    }
    var CPK = (A, q, K, Y) => lf.assign(new YE1, {
            name: q,
            namespace: A,
            traits: Y,
            schemaRef: K
        }),
        SPK = (A, q, K, Y) => lf.assign(new YE1, {
            name: q,
            namespace: A,
            traits: K,
            schemaRef: Y
        }),
        hPK = {
            BLOB: 21,
            STREAMING_BLOB: 42,
            BOOLEAN: 2,
            STRING: 0,
            NUMERIC: 1,
            BIG_INTEGER: 17,
            BIG_DECIMAL: 19,
            DOCUMENT: 15,
            TIMESTAMP_DEFAULT: 4,
            TIMESTAMP_DATE_TIME: 5,
            TIMESTAMP_HTTP_DATE: 6,
            TIMESTAMP_EPOCH_SECONDS: 7,
            LIST_MODIFIER: 64,
            MAP_MODIFIER: 128
        };
    class gQ {
        namespace;
        schemas;
        exceptions;
        static registries = new Map;
        constructor(A, q = new Map, K = new Map) {
            this.namespace = A, this.schemas = q, this.exceptions = K
        }
        static
        for (A) {
            if (!gQ.registries.has(A)) gQ.registries.set(A, new gQ(A));
            return gQ.registries.get(A)
        }
        register(A, q) {
            let K = this.normalizeShapeId(A);
            gQ.for(K.split("#")[0]).schemas.set(K, q)
        }
        getSchema(A) {
            let q = this.normalizeShapeId(A);
            if (!this.schemas.has(q)) throw Error(`@smithy/core/schema - schema not found for ${q}`);
            return this.schemas.get(q)
        }
        registerError(A, q) {
            let K = A,
                Y = gQ.for(K[1]);
            Y.schemas.set(K[1] + "#" + K[2], K), Y.exceptions.set(K, q)
        }
        getErrorCtor(A) {
            let q = A;
            return gQ.for(q[1]).exceptions.get(q)
        }
        getBaseException() {
            for (let A of this.exceptions.keys())
                if (Array.isArray(A)) {
                    let [, q, K] = A, Y = q + "#" + K;
                    if (Y.startsWith("smithy.ts.sdk.synthetic.") && Y.endsWith("ServiceException")) return A
                } return
        }
        find(A) {
            return [...this.schemas.values()].find(A)
        }
        clear() {
            this.schemas.clear(), this.exceptions.clear()
        }
        normalizeShapeId(A) {
            if (A.includes("#")) return A;
            return this.namespace + "#" + A
        }
    }
    IPK.ErrorSchema = Zt1;
    IPK.ListSchema = Pt1;
    IPK.MapSchema = Wt1;
    IPK.NormalizedSchema = UQ;
    IPK.OperationSchema = Gt1;
    IPK.SCHEMA = hPK;
    IPK.Schema = lf;
    IPK.SimpleSchema = YE1;
    IPK.StructureSchema = KE1;
    IPK.TypeRegistry = gQ;
    IPK.deref = Mt1;
    IPK.deserializerMiddlewareOption = zJ8;
    IPK.error = yPK;
    IPK.getSchemaSerdePlugin = vPK;
    IPK.isStaticSchema = HJ8;
    IPK.list = EPK;
    IPK.map = kPK;
    IPK.op = LPK;
    IPK.operation = qg6;
    IPK.serializerMiddlewareOption = wJ8;
    IPK.sim = CPK;
    IPK.simAdapter = SPK;
    IPK.struct = RPK;
    IPK.translateTraits = qE1
})
// @from(Ln 54781, Col 4)
n2 = R((Iez, Nt1) => {
    var $J8, OJ8, _J8, JJ8, XJ8, DJ8, jJ8, MJ8, PJ8, WJ8, GJ8, ZJ8, fJ8, ft1, Kg6, VJ8, NJ8, TJ8, WH1, vJ8, EJ8, kJ8, LJ8, RJ8, yJ8, CJ8, SJ8, hJ8, Vt1, IJ8, xJ8, bJ8;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof Nt1 === "object" && typeof Iez === "object") A(K(q, K(Iez)));
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
        instanceof Array && function(w, H) {
            w.__proto__ = H
        } || function(w, H) {
            for (var $ in H)
                if (Object.prototype.hasOwnProperty.call(H, $)) w[$] = H[$]
        };
        $J8 = function(w, H) {
            if (typeof H !== "function" && H !== null) throw TypeError("Class extends value " + String(H) + " is not a constructor or null");
            q(w, H);

            function $() {
                this.constructor = w
            }
            w.prototype = H === null ? Object.create(H) : ($.prototype = H.prototype, new $)
        }, OJ8 = Object.assign || function(w) {
            for (var H, $ = 1, O = arguments.length; $ < O; $++) {
                H = arguments[$];
                for (var _ in H)
                    if (Object.prototype.hasOwnProperty.call(H, _)) w[_] = H[_]
            }
            return w
        }, _J8 = function(w, H) {
            var $ = {};
            for (var O in w)
                if (Object.prototype.hasOwnProperty.call(w, O) && H.indexOf(O) < 0) $[O] = w[O];
            if (w != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var _ = 0, O = Object.getOwnPropertySymbols(w); _ < O.length; _++)
                    if (H.indexOf(O[_]) < 0 && Object.prototype.propertyIsEnumerable.call(w, O[_])) $[O[_]] = w[O[_]]
            }
            return $
        }, JJ8 = function(w, H, $, O) {
            var _ = arguments.length,
                J = _ < 3 ? H : O === null ? O = Object.getOwnPropertyDescriptor(H, $) : O,
                X;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") J = Reflect.decorate(w, H, $, O);
            else
                for (var D = w.length - 1; D >= 0; D--)
                    if (X = w[D]) J = (_ < 3 ? X(J) : _ > 3 ? X(H, $, J) : X(H, $)) || J;
            return _ > 3 && J && Object.defineProperty(H, $, J), J
        }, XJ8 = function(w, H) {
            return function($, O) {
                H($, O, w)
            }
        }, DJ8 = function(w, H, $, O, _, J) {
            function X(k) {
                if (k !== void 0 && typeof k !== "function") throw TypeError("Function expected");
                return k
            }
            var D = O.kind,
                j = D === "getter" ? "get" : D === "setter" ? "set" : "value",
                M = !H && w ? O.static ? w : w.prototype : null,
                P = H || (M ? Object.getOwnPropertyDescriptor(M, O.name) : {}),
                W, G = !1;
            for (var f = $.length - 1; f >= 0; f--) {
                var Z = {};
                for (var N in O) Z[N] = N === "access" ? {} : O[N];
                for (var N in O.access) Z.access[N] = O.access[N];
                Z.addInitializer = function(k) {
                    if (G) throw TypeError("Cannot add initializers after decoration has completed");
                    J.push(X(k || null))
                };
                var T = (0, $[f])(D === "accessor" ? {
                    get: P.get,
                    set: P.set
                } : P[j], Z);
                if (D === "accessor") {
                    if (T === void 0) continue;
                    if (T === null || typeof T !== "object") throw TypeError("Object expected");
                    if (W = X(T.get)) P.get = W;
                    if (W = X(T.set)) P.set = W;
                    if (W = X(T.init)) _.unshift(W)
                } else if (W = X(T))
                    if (D === "field") _.unshift(W);
                    else P[j] = W
            }
            if (M) Object.defineProperty(M, O.name, P);
            G = !0
        }, jJ8 = function(w, H, $) {
            var O = arguments.length > 2;
            for (var _ = 0; _ < H.length; _++) $ = O ? H[_].call(w, $) : H[_].call(w);
            return O ? $ : void 0
        }, MJ8 = function(w) {
            return typeof w === "symbol" ? w : "".concat(w)
        }, PJ8 = function(w, H, $) {
            if (typeof H === "symbol") H = H.description ? "[".concat(H.description, "]") : "";
            return Object.defineProperty(w, "name", {
                configurable: !0,
                value: $ ? "".concat($, " ", H) : H
            })
        }, WJ8 = function(w, H) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(w, H)
        }, GJ8 = function(w, H, $, O) {
            function _(J) {
                return J instanceof $ ? J : new $(function(X) {
                    X(J)
                })
            }
            return new($ || ($ = Promise))(function(J, X) {
                function D(P) {
                    try {
                        M(O.next(P))
                    } catch (W) {
                        X(W)
                    }
                }

                function j(P) {
                    try {
                        M(O.throw(P))
                    } catch (W) {
                        X(W)
                    }
                }

                function M(P) {
                    P.done ? J(P.value) : _(P.value).then(D, j)
                }
                M((O = O.apply(w, H || [])).next())
            })
        }, ZJ8 = function(w, H) {
            var $ = {
                    label: 0,
                    sent: function() {
                        if (J[0] & 1) throw J[1];
                        return J[1]
                    },
                    trys: [],
                    ops: []
                },
                O, _, J, X = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
            return X.next = D(0), X.throw = D(1), X.return = D(2), typeof Symbol === "function" && (X[Symbol.iterator] = function() {
                return this
            }), X;

            function D(M) {
                return function(P) {
                    return j([M, P])
                }
            }

            function j(M) {
                if (O) throw TypeError("Generator is already executing.");
                while (X && (X = 0, M[0] && ($ = 0)), $) try {
                    if (O = 1, _ && (J = M[0] & 2 ? _.return : M[0] ? _.throw || ((J = _.return) && J.call(_), 0) : _.next) && !(J = J.call(_, M[1])).done) return J;
                    if (_ = 0, J) M = [M[0] & 2, J.value];
                    switch (M[0]) {
                        case 0:
                        case 1:
                            J = M;
                            break;
                        case 4:
                            return $.label++, {
                                value: M[1],
                                done: !1
                            };
                        case 5:
                            $.label++, _ = M[1], M = [0];
                            continue;
                        case 7:
                            M = $.ops.pop(), $.trys.pop();
                            continue;
                        default:
                            if ((J = $.trys, !(J = J.length > 0 && J[J.length - 1])) && (M[0] === 6 || M[0] === 2)) {
                                $ = 0;
                                continue
                            }
                            if (M[0] === 3 && (!J || M[1] > J[0] && M[1] < J[3])) {
                                $.label = M[1];
                                break
                            }
                            if (M[0] === 6 && $.label < J[1]) {
                                $.label = J[1], J = M;
                                break
                            }
                            if (J && $.label < J[2]) {
                                $.label = J[2], $.ops.push(M);
                                break
                            }
                            if (J[2]) $.ops.pop();
                            $.trys.pop();
                            continue
                    }
                    M = H.call(w, $)
                } catch (P) {
                    M = [6, P], _ = 0
                } finally {
                    O = J = 0
                }
                if (M[0] & 5) throw M[1];
                return {
                    value: M[0] ? M[1] : void 0,
                    done: !0
                }
            }
        }, fJ8 = function(w, H) {
            for (var $ in w)
                if ($ !== "default" && !Object.prototype.hasOwnProperty.call(H, $)) Vt1(H, w, $)
        }, Vt1 = Object.create ? function(w, H, $, O) {
            if (O === void 0) O = $;
            var _ = Object.getOwnPropertyDescriptor(H, $);
            if (!_ || ("get" in _ ? !H.__esModule : _.writable || _.configurable)) _ = {
                enumerable: !0,
                get: function() {
                    return H[$]
                }
            };
            Object.defineProperty(w, O, _)
        } : function(w, H, $, O) {
            if (O === void 0) O = $;
            w[O] = H[$]
        }, ft1 = function(w) {
            var H = typeof Symbol === "function" && Symbol.iterator,
                $ = H && w[H],
                O = 0;
            if ($) return $.call(w);
            if (w && typeof w.length === "number") return {
                next: function() {
                    if (w && O >= w.length) w = void 0;
                    return {
                        value: w && w[O++],
                        done: !w
                    }
                }
            };
            throw TypeError(H ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, Kg6 = function(w, H) {
            var $ = typeof Symbol === "function" && w[Symbol.iterator];
            if (!$) return w;
            var O = $.call(w),
                _, J = [],
                X;
            try {
                while ((H === void 0 || H-- > 0) && !(_ = O.next()).done) J.push(_.value)
            } catch (D) {
                X = {
                    error: D
                }
            } finally {
                try {
                    if (_ && !_.done && ($ = O.return)) $.call(O)
                } finally {
                    if (X) throw X.error
                }
            }
            return J
        }, VJ8 = function() {
            for (var w = [], H = 0; H < arguments.length; H++) w = w.concat(Kg6(arguments[H]));
            return w
        }, NJ8 = function() {
            for (var w = 0, H = 0, $ = arguments.length; H < $; H++) w += arguments[H].length;
            for (var O = Array(w), _ = 0, H = 0; H < $; H++)
                for (var J = arguments[H], X = 0, D = J.length; X < D; X++, _++) O[_] = J[X];
            return O
        }, TJ8 = function(w, H, $) {
            if ($ || arguments.length === 2) {
                for (var O = 0, _ = H.length, J; O < _; O++)
                    if (J || !(O in H)) {
                        if (!J) J = Array.prototype.slice.call(H, 0, O);
                        J[O] = H[O]
                    }
            }
            return w.concat(J || Array.prototype.slice.call(H))
        }, WH1 = function(w) {
            return this instanceof WH1 ? (this.v = w, this) : new WH1(w)
        }, vJ8 = function(w, H, $) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var O = $.apply(w, H || []),
                _, J = [];
            return _ = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), D("next"), D("throw"), D("return", X), _[Symbol.asyncIterator] = function() {
                return this
            }, _;

            function X(f) {
                return function(Z) {
                    return Promise.resolve(Z).then(f, W)
                }
            }

            function D(f, Z) {
                if (O[f]) {
                    if (_[f] = function(N) {
                            return new Promise(function(T, k) {
                                J.push([f, N, T, k]) > 1 || j(f, N)
                            })
                        }, Z) _[f] = Z(_[f])
                }
            }

            function j(f, Z) {
                try {
                    M(O[f](Z))
                } catch (N) {
                    G(J[0][3], N)
                }
            }

            function M(f) {
                f.value instanceof WH1 ? Promise.resolve(f.value.v).then(P, W) : G(J[0][2], f)
            }

            function P(f) {
                j("next", f)
            }

            function W(f) {
                j("throw", f)
            }

            function G(f, Z) {
                if (f(Z), J.shift(), J.length) j(J[0][0], J[0][1])
            }
        }, EJ8 = function(w) {
            var H, $;
            return H = {}, O("next"), O("throw", function(_) {
                throw _
            }), O("return"), H[Symbol.iterator] = function() {
                return this
            }, H;

            function O(_, J) {
                H[_] = w[_] ? function(X) {
                    return ($ = !$) ? {
                        value: WH1(w[_](X)),
                        done: !1
                    } : J ? J(X) : X
                } : J
            }
        }, kJ8 = function(w) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var H = w[Symbol.asyncIterator],
                $;
            return H ? H.call(w) : (w = typeof ft1 === "function" ? ft1(w) : w[Symbol.iterator](), $ = {}, O("next"), O("throw"), O("return"), $[Symbol.asyncIterator] = function() {
                return this
            }, $);

            function O(J) {
                $[J] = w[J] && function(X) {
                    return new Promise(function(D, j) {
                        X = w[J](X), _(D, j, X.done, X.value)
                    })
                }
            }

            function _(J, X, D, j) {
                Promise.resolve(j).then(function(M) {
                    J({
                        value: M,
                        done: D
                    })
                }, X)
            }
        }, LJ8 = function(w, H) {
            if (Object.defineProperty) Object.defineProperty(w, "raw", {
                value: H
            });
            else w.raw = H;
            return w
        };
        var K = Object.create ? function(w, H) {
                Object.defineProperty(w, "default", {
                    enumerable: !0,
                    value: H
                })
            } : function(w, H) {
                w.default = H
            },
            Y = function(w) {
                return Y = Object.getOwnPropertyNames || function(H) {
                    var $ = [];
                    for (var O in H)
                        if (Object.prototype.hasOwnProperty.call(H, O)) $[$.length] = O;
                    return $
                }, Y(w)
            };
        RJ8 = function(w) {
            if (w && w.__esModule) return w;
            var H = {};
            if (w != null) {
                for (var $ = Y(w), O = 0; O < $.length; O++)
                    if ($[O] !== "default") Vt1(H, w, $[O])
            }
            return K(H, w), H
        }, yJ8 = function(w) {
            return w && w.__esModule ? w : {
                default: w
            }
        }, CJ8 = function(w, H, $, O) {
            if ($ === "a" && !O) throw TypeError("Private accessor was defined without a getter");
            if (typeof H === "function" ? w !== H || !O : !H.has(w)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return $ === "m" ? O : $ === "a" ? O.call(w) : O ? O.value : H.get(w)
        }, SJ8 = function(w, H, $, O, _) {
            if (O === "m") throw TypeError("Private method is not writable");
            if (O === "a" && !_) throw TypeError("Private accessor was defined without a setter");
            if (typeof H === "function" ? w !== H || !_ : !H.has(w)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return O === "a" ? _.call(w, $) : _ ? _.value = $ : H.set(w, $), $
        }, hJ8 = function(w, H) {
            if (H === null || typeof H !== "object" && typeof H !== "function") throw TypeError("Cannot use 'in' operator on non-object");
            return typeof w === "function" ? H === w : w.has(H)
        }, IJ8 = function(w, H, $) {
            if (H !== null && H !== void 0) {
                if (typeof H !== "object" && typeof H !== "function") throw TypeError("Object expected.");
                var O, _;
                if ($) {
                    if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
                    O = H[Symbol.asyncDispose]
                }
                if (O === void 0) {
                    if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
                    if (O = H[Symbol.dispose], $) _ = O
                }
                if (typeof O !== "function") throw TypeError("Object not disposable.");
                if (_) O = function() {
                    try {
                        _.call(this)
                    } catch (J) {
                        return Promise.reject(J)
                    }
                };
                w.stack.push({
                    value: H,
                    dispose: O,
                    async: $
                })
            } else if ($) w.stack.push({
                async: !0
            });
            return H
        };
        var z = typeof SuppressedError === "function" ? SuppressedError : function(w, H, $) {
            var O = Error($);
            return O.name = "SuppressedError", O.error = w, O.suppressed = H, O
        };
        xJ8 = function(w) {
            function H(J) {
                w.error = w.hasError ? new z(J, w.error, "An error was suppressed during disposal.") : J, w.hasError = !0
            }
            var $, O = 0;

            function _() {
                while ($ = w.stack.pop()) try {
                    if (!$.async && O === 1) return O = 0, w.stack.push($), Promise.resolve().then(_);
                    if ($.dispose) {
                        var J = $.dispose.call($.value);
                        if ($.async) return O |= 2, Promise.resolve(J).then(_, function(X) {
                            return H(X), _()
                        })
                    } else O |= 1
                } catch (X) {
                    H(X)
                }
                if (O === 1) return w.hasError ? Promise.reject(w.error) : Promise.resolve();
                if (w.hasError) throw w.error
            }
            return _()
        }, bJ8 = function(w, H) {
            if (typeof w === "string" && /^\.\.?\//.test(w)) return w.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function($, O, _, J, X) {
                return O ? H ? ".jsx" : ".js" : _ && (!J || !X) ? $ : _ + J + "." + X.toLowerCase() + "js"
            });
            return w
        }, A("__extends", $J8), A("__assign", OJ8), A("__rest", _J8), A("__decorate", JJ8), A("__param", XJ8), A("__esDecorate", DJ8), A("__runInitializers", jJ8), A("__propKey", MJ8), A("__setFunctionName", PJ8), A("__metadata", WJ8), A("__awaiter", GJ8), A("__generator", ZJ8), A("__exportStar", fJ8), A("__createBinding", Vt1), A("__values", ft1), A("__read", Kg6), A("__spread", VJ8), A("__spreadArrays", NJ8), A("__spreadArray", TJ8), A("__await", WH1), A("__asyncGenerator", vJ8), A("__asyncDelegator", EJ8), A("__asyncValues", kJ8), A("__makeTemplateObject", LJ8), A("__importStar", RJ8), A("__importDefault", yJ8), A("__classPrivateFieldGet", CJ8), A("__classPrivateFieldSet", SJ8), A("__classPrivateFieldIn", hJ8), A("__addDisposableResource", IJ8), A("__disposeResources", xJ8), A("__rewriteRelativeImportExtension", bJ8)
    })
})
// @from(Ln 55267, Col 4)
FJ8 = R((BJ8) => {
    Object.defineProperty(BJ8, "__esModule", {
        value: !0
    });
    BJ8.randomUUID = void 0;
    var YWK = n2(),
        uJ8 = YWK.__importDefault(h1("crypto"));
    BJ8.randomUUID = uJ8.default.randomUUID.bind(uJ8.default)
})
// @from(Ln 55276, Col 4)
Yg6 = R((wWK) => {
    var QJ8 = FJ8(),
        nP = Array.from({
            length: 256
        }, (A, q) => q.toString(16).padStart(2, "0")),
        zWK = () => {
            if (QJ8.randomUUID) return QJ8.randomUUID();
            let A = new Uint8Array(16);
            return crypto.getRandomValues(A), A[6] = A[6] & 15 | 64, A[8] = A[8] & 63 | 128, nP[A[0]] + nP[A[1]] + nP[A[2]] + nP[A[3]] + "-" + nP[A[4]] + nP[A[5]] + "-" + nP[A[6]] + nP[A[7]] + "-" + nP[A[8]] + nP[A[9]] + "-" + nP[A[10]] + nP[A[11]] + nP[A[12]] + nP[A[13]] + nP[A[14]] + nP[A[15]]
        };
    wWK.v4 = zWK
})