
// @from(Ln 65564, Col 4)
a41 = x((LcK) => {
    var kcK = GgA(),
        Xs1 = x6("buffer"),
        EcK = (A, q = 0, K = A.byteLength - q) => {
            if (!kcK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Xs1.Buffer.from(A, q, K)
        },
        ycK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Xs1.Buffer.from(A, q) : Xs1.Buffer.from(A)
        };
    LcK.fromArrayBuffer = EcK;
    LcK.fromString = ycK
})
// @from(Ln 65578, Col 4)
vgA = x((fgA) => {
    Object.defineProperty(fgA, "__esModule", {
        value: !0
    });
    fgA.fromBase64 = void 0;
    var ScK = a41(),
        CcK = /^[A-Za-z0-9+/]*={0,2}$/,
        IcK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!CcK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, ScK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    fgA.fromBase64 = IcK
})
// @from(Ln 65593, Col 4)
NgA = x((xcK) => {
    var bcK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    xcK.isArrayBuffer = bcK
})
// @from(Ln 65597, Col 4)
VgA = x((FcK) => {
    var mcK = NgA(),
        Ps1 = x6("buffer"),
        BcK = (A, q = 0, K = A.byteLength - q) => {
            if (!mcK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Ps1.Buffer.from(A, q, K)
        },
        gcK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Ps1.Buffer.from(A, q) : Ps1.Buffer.from(A)
        };
    FcK.fromArrayBuffer = BcK;
    FcK.fromString = gcK
})
// @from(Ln 65611, Col 4)
C_ = x((ccK) => {
    var kgA = VgA(),
        EgA = (A) => {
            let q = kgA.fromString(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        },
        UcK = (A) => {
            if (typeof A === "string") return EgA(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        },
        dcK = (A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return kgA.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        };
    ccK.fromUtf8 = EgA;
    ccK.toUint8Array = UcK;
    ccK.toUtf8 = dcK
})
// @from(Ln 65631, Col 4)
RgA = x((ygA) => {
    Object.defineProperty(ygA, "__esModule", {
        value: !0
    });
    ygA.toBase64 = void 0;
    var rcK = a41(),
        ocK = C_(),
        acK = (A) => {
            let q;
            if (typeof A === "string") q = (0, ocK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, rcK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    ygA.toBase64 = acK
})
// @from(Ln 65647, Col 4)
_j6 = x((Bh6) => {
    var hgA = vgA(),
        SgA = RgA();
    Object.keys(hgA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Bh6, A)) Object.defineProperty(Bh6, A, {
            enumerable: !0,
            get: function() {
                return hgA[A]
            }
        })
    });
    Object.keys(SgA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Bh6, A)) Object.defineProperty(Bh6, A, {
            enumerable: !0,
            get: function() {
                return SgA[A]
            }
        })
    })
})
// @from(Ln 65667, Col 4)
Ws1 = x((IgA) => {
    Object.defineProperty(IgA, "__esModule", {
        value: !0
    });
    IgA.ChecksumStream = void 0;
    var scK = _j6(),
        tcK = x6("stream");
    class CgA extends tcK.Duplex {
        expectedChecksum;
        checksumSourceLocation;
        checksum;
        source;
        base64Encoder;
        constructor({
            expectedChecksum: A,
            checksum: q,
            source: K,
            checksumSourceLocation: Y,
            base64Encoder: z
        }) {
            super();
            if (typeof K.pipe === "function") this.source = K;
            else throw Error(`@smithy/util-stream: unsupported source type ${K?.constructor?.name??K} in ChecksumStream.`);
            this.base64Encoder = z ?? scK.toBase64, this.expectedChecksum = A, this.checksum = q, this.checksumSourceLocation = Y, this.source.pipe(this)
        }
        _read(A) {}
        _write(A, q, K) {
            try {
                this.checksum.update(A), this.push(A)
            } catch (Y) {
                return K(Y)
            }
            return K()
        }
        async _final(A) {
            try {
                let q = await this.checksum.digest(),
                    K = this.base64Encoder(q);
                if (this.expectedChecksum !== K) return A(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${K}" in response header "${this.checksumSourceLocation}".`))
            } catch (q) {
                return A(q)
            }
            return this.push(null), A()
        }
    }
    IgA.ChecksumStream = CgA
})
// @from(Ln 65714, Col 4)
Qr = x((xgA) => {
    Object.defineProperty(xgA, "__esModule", {
        value: !0
    });
    xgA.isBlob = xgA.isReadableStream = void 0;
    var ecK = (A) => typeof ReadableStream === "function" && (A?.constructor?.name === ReadableStream.name || A instanceof ReadableStream);
    xgA.isReadableStream = ecK;
    var AlK = (A) => {
        return typeof Blob === "function" && (A?.constructor?.name === Blob.name || A instanceof Blob)
    };
    xgA.isBlob = AlK
})
// @from(Ln 65726, Col 4)
FgA = x((BgA) => {
    Object.defineProperty(BgA, "__esModule", {
        value: !0
    });
    BgA.ChecksumStream = void 0;
    var KlK = typeof ReadableStream === "function" ? ReadableStream : function() {};
    class mgA extends KlK {}
    BgA.ChecksumStream = mgA
})
// @from(Ln 65735, Col 4)
UgA = x((pgA) => {
    Object.defineProperty(pgA, "__esModule", {
        value: !0
    });
    pgA.createChecksumStream = void 0;
    var YlK = _j6(),
        zlK = Qr(),
        _lK = FgA(),
        wlK = ({
            expectedChecksum: A,
            checksum: q,
            source: K,
            checksumSourceLocation: Y,
            base64Encoder: z
        }) => {
            if (!(0, zlK.isReadableStream)(K)) throw Error(`@smithy/util-stream: unsupported source type ${K?.constructor?.name??K} in ChecksumStream.`);
            let _ = z ?? YlK.toBase64;
            if (typeof TransformStream !== "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
            let w = new TransformStream({
                start() {},
                async transform($, H) {
                    q.update($), H.enqueue($)
                },
                async flush($) {
                    let H = await q.digest(),
                        j = _(H);
                    if (A !== j) {
                        let J = Error(`Checksum mismatch: expected "${A}" but received "${j}" in response header "${Y}".`);
                        $.error(J)
                    } else $.terminate()
                }
            });
            K.pipeThrough(w);
            let O = w.readable;
            return Object.setPrototypeOf(O, _lK.ChecksumStream.prototype), O
        };
    pgA.createChecksumStream = wlK
})
// @from(Ln 65773, Col 4)
cgA = x((dgA) => {
    Object.defineProperty(dgA, "__esModule", {
        value: !0
    });
    dgA.createChecksumStream = jlK;
    var OlK = Qr(),
        $lK = Ws1(),
        HlK = UgA();

    function jlK(A) {
        if (typeof ReadableStream === "function" && (0, OlK.isReadableStream)(A.source)) return (0, HlK.createChecksumStream)(A);
        return new $lK.ChecksumStream(A)
    }
})
// @from(Ln 65787, Col 4)
Zs1 = x((igA) => {
    Object.defineProperty(igA, "__esModule", {
        value: !0
    });
    igA.ByteArrayCollector = void 0;
    class lgA {
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
    igA.ByteArrayCollector = lgA
})
// @from(Ln 65821, Col 4)
egA = x((sgA) => {
    Object.defineProperty(sgA, "__esModule", {
        value: !0
    });
    sgA.createBufferedReadable = void 0;
    sgA.createBufferedReadableStream = rgA;
    sgA.merge = ogA;
    sgA.flush = s41;
    sgA.sizeOf = wj6;
    sgA.modeOf = agA;
    var MlK = Zs1();

    function rgA(A, q, K) {
        let Y = A.getReader(),
            z = !1,
            _ = 0,
            w = ["", new MlK.ByteArrayCollector((H) => new Uint8Array(H))],
            O = -1,
            $ = async (H) => {
                let {
                    value: j,
                    done: J
                } = await Y.read(), M = j;
                if (J) {
                    if (O !== -1) {
                        let D = s41(w, O);
                        if (wj6(D) > 0) H.enqueue(D)
                    }
                    H.close()
                } else {
                    let D = agA(M, !1);
                    if (O !== D) {
                        if (O >= 0) H.enqueue(s41(w, O));
                        O = D
                    }
                    if (O === -1) {
                        H.enqueue(M);
                        return
                    }
                    let X = wj6(M);
                    _ += X;
                    let P = wj6(w[O]);
                    if (X >= q && P === 0) H.enqueue(M);
                    else {
                        let W = ogA(w, O, M);
                        if (!z && _ > q * 2) z = !0, K?.warn(`@smithy/util-stream - stream chunk size ${X} is below threshold of ${q}, automatically buffering.`);
                        if (W >= q) H.enqueue(s41(w, O));
                        else await $(H)
                    }
                }
            };
        return new ReadableStream({
            pull: $
        })
    }
    sgA.createBufferedReadable = rgA;

    function ogA(A, q, K) {
        switch (q) {
            case 0:
                return A[0] += K, wj6(A[0]);
            case 1:
            case 2:
                return A[q].push(K), wj6(A[q])
        }
    }

    function s41(A, q) {
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

    function wj6(A) {
        return A?.byteLength ?? A?.length ?? 0
    }

    function agA(A, q = !0) {
        if (q && typeof Buffer < "u" && A instanceof Buffer) return 2;
        if (A instanceof Uint8Array) return 1;
        if (typeof A === "string") return 0;
        return -1
    }
})
// @from(Ln 65911, Col 4)
KFA = x((qFA) => {
    Object.defineProperty(qFA, "__esModule", {
        value: !0
    });
    qFA.createBufferedReadable = TlK;
    var GlK = x6("node:stream"),
        AFA = Zs1(),
        JQ = egA(),
        flK = Qr();

    function TlK(A, q, K) {
        if ((0, flK.isReadableStream)(A)) return (0, JQ.createBufferedReadableStream)(A, q, K);
        let Y = new GlK.Readable({
                read() {}
            }),
            z = !1,
            _ = 0,
            w = ["", new AFA.ByteArrayCollector(($) => new Uint8Array($)), new AFA.ByteArrayCollector(($) => Buffer.from(new Uint8Array($)))],
            O = -1;
        return A.on("data", ($) => {
            let H = (0, JQ.modeOf)($, !0);
            if (O !== H) {
                if (O >= 0) Y.push((0, JQ.flush)(w, O));
                O = H
            }
            if (O === -1) {
                Y.push($);
                return
            }
            let j = (0, JQ.sizeOf)($);
            _ += j;
            let J = (0, JQ.sizeOf)(w[O]);
            if (j >= q && J === 0) Y.push($);
            else {
                let M = (0, JQ.merge)(w, O, $);
                if (!z && _ > q * 2) z = !0, K?.warn(`@smithy/util-stream - stream chunk size ${j} is below threshold of ${q}, automatically buffering.`);
                if (M >= q) Y.push((0, JQ.flush)(w, O))
            }
        }), A.on("end", () => {
            if (O !== -1) {
                let $ = (0, JQ.flush)(w, O);
                if ((0, JQ.sizeOf)($) > 0) Y.push($)
            }
            Y.push(null)
        }), Y
    }
})
// @from(Ln 65958, Col 4)
_FA = x((YFA) => {
    Object.defineProperty(YFA, "__esModule", {
        value: !0
    });
    YFA.getAwsChunkedEncodingStream = void 0;
    var NlK = x6("stream"),
        VlK = (A, q) => {
            let {
                base64Encoder: K,
                bodyLengthChecker: Y,
                checksumAlgorithmFn: z,
                checksumLocationName: _,
                streamHasher: w
            } = q, O = K !== void 0 && z !== void 0 && _ !== void 0 && w !== void 0, $ = O ? w(z, A) : void 0, H = new NlK.Readable({
                read: () => {}
            });
            return A.on("data", (j) => {
                let J = Y(j) || 0;
                H.push(`${J.toString(16)}\r
`), H.push(j), H.push(`\r
`)
            }), A.on("end", async () => {
                if (H.push(`0\r
`), O) {
                    let j = K(await $);
                    H.push(`${_}:${j}\r
`), H.push(`\r
`)
                }
                H.push(null)
            }), H
        };
    YFA.getAwsChunkedEncodingStream = VlK
})
// @from(Ln 65992, Col 4)
OFA = x((wFA) => {
    Object.defineProperty(wFA, "__esModule", {
        value: !0
    });
    wFA.headStream = klK;
    async function klK(A, q) {
        let K = 0,
            Y = [],
            z = A.getReader(),
            _ = !1;
        while (!_) {
            let {
                done: $,
                value: H
            } = await z.read();
            if (H) Y.push(H), K += H?.byteLength ?? 0;
            if (K >= q) break;
            _ = $
        }
        z.releaseLock();
        let w = new Uint8Array(Math.min(q, K)),
            O = 0;
        for (let $ of Y) {
            if ($.byteLength > w.byteLength - O) {
                w.set($.subarray(0, w.byteLength - O), O);
                break
            } else w.set($, O);
            O += $.length
        }
        return w
    }
})
// @from(Ln 66024, Col 4)
JFA = x((HFA) => {
    Object.defineProperty(HFA, "__esModule", {
        value: !0
    });
    HFA.headStream = void 0;
    var ylK = x6("stream"),
        LlK = OFA(),
        RlK = Qr(),
        hlK = (A, q) => {
            if ((0, RlK.isReadableStream)(A)) return (0, LlK.headStream)(A, q);
            return new Promise((K, Y) => {
                let z = new $FA;
                z.limit = q, A.pipe(z), A.on("error", (_) => {
                    z.end(), Y(_)
                }), z.on("error", Y), z.on("finish", function() {
                    let _ = new Uint8Array(Buffer.concat(this.buffers));
                    K(_)
                })
            })
        };
    HFA.headStream = hlK;
    class $FA extends ylK.Writable {
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
// @from(Ln 66059, Col 4)
MFA = x((ulK) => {
    ulK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ulK.HttpAuthLocation || (ulK.HttpAuthLocation = {}));
    ulK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ulK.HttpApiKeyAuthLocation || (ulK.HttpApiKeyAuthLocation = {}));
    ulK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ulK.EndpointURLScheme || (ulK.EndpointURLScheme = {}));
    ulK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ulK.AlgorithmId || (ulK.AlgorithmId = {}));
    var SlK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ulK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ulK.AlgorithmId.MD5,
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
        ClK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        IlK = (A) => {
            return SlK(A)
        },
        blK = (A) => {
            return ClK(A)
        };
    ulK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ulK.FieldPosition || (ulK.FieldPosition = {}));
    var xlK = "__smithy_context";
    ulK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ulK.IniSectionType || (ulK.IniSectionType = {}));
    ulK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ulK.RequestHandlerProtocol || (ulK.RequestHandlerProtocol = {}));
    ulK.SMITHY_CONTEXT_KEY = xlK;
    ulK.getDefaultClientConfiguration = IlK;
    ulK.resolveDefaultRuntimeConfig = blK
})
// @from(Ln 66124, Col 4)
WFA = x((clK) => {
    var FlK = MFA(),
        plK = (A) => {
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
        QlK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class DFA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = FlK.FieldPosition.HEADER,
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
    class XFA {
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
    class t41 {
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
            let q = new t41({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = UlK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return t41.clone(this)
        }
    }

    function UlK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class PFA {
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

    function dlK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    clK.Field = DFA;
    clK.Fields = XFA;
    clK.HttpRequest = t41;
    clK.HttpResponse = PFA;
    clK.getHttpHandlerExtensionConfiguration = plK;
    clK.isValidHostname = dlK;
    clK.resolveHttpHandlerRuntimeConfig = QlK
})
// @from(Ln 66266, Col 4)
GFA = x((AiK) => {
    var ZFA = (A) => encodeURIComponent(A).replace(/[!'()*]/g, tlK),
        tlK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        elK = (A) => A.split("/").map(ZFA).join("/");
    AiK.escapeUri = ZFA;
    AiK.escapeUriPath = elK
})
// @from(Ln 66273, Col 4)
fFA = x((ziK) => {
    var ks1 = GFA();

    function YiK(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = ks1.escapeUri(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${ks1.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${ks1.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    ziK.buildQueryString = YiK
})
// @from(Ln 66292, Col 4)
NFA = x((DiK) => {
    var TFA = WFA(),
        wiK = fFA(),
        OiK = _j6();

    function vFA(A, q) {
        return new Request(A, q)
    }

    function $iK(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    var e41 = {
        supported: void 0
    };
    class Es1 {
        config;
        configProvider;
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new Es1(A)
        }
        constructor(A) {
            if (typeof A === "function") this.configProvider = A().then((q) => q || {});
            else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
            if (e41.supported === void 0) e41.supported = Boolean(typeof Request < "u" && "keepalive" in vFA("https://[::1]"))
        }
        destroy() {}
        async handle(A, {
            abortSignal: q,
            requestTimeout: K
        } = {}) {
            if (!this.config) this.config = await this.configProvider;
            let Y = K ?? this.config.requestTimeout,
                z = this.config.keepAlive === !0,
                _ = this.config.credentials;
            if (q?.aborted) {
                let Z = Error("Request aborted");
                return Z.name = "AbortError", Promise.reject(Z)
            }
            let w = A.path,
                O = wiK.buildQueryString(A.query || {});
            if (O) w += `?${O}`;
            if (A.fragment) w += `#${A.fragment}`;
            let $ = "";
            if (A.username != null || A.password != null) {
                let Z = A.username ?? "",
                    G = A.password ?? "";
                $ = `${Z}:${G}@`
            }
            let {
                port: H,
                method: j
            } = A, J = `${A.protocol}//${$}${A.hostname}${H?`:${H}`:""}${w}`, M = j === "GET" || j === "HEAD" ? void 0 : A.body, D = {
                body: M,
                headers: new Headers(A.headers),
                method: j,
                credentials: _
            };
            if (this.config?.cache) D.cache = this.config.cache;
            if (M) D.duplex = "half";
            if (typeof AbortController < "u") D.signal = q;
            if (e41.supported) D.keepalive = z;
            if (typeof this.config.requestInit === "function") Object.assign(D, this.config.requestInit(A));
            let X = () => {},
                P = vFA(J, D),
                W = [fetch(P).then((Z) => {
                    let G = Z.headers,
                        f = {};
                    for (let N of G.entries()) f[N[0]] = N[1];
                    if (Z.body == null) return Z.blob().then((N) => ({
                        response: new TFA.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: N
                        })
                    }));
                    return {
                        response: new TFA.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: Z.body
                        })
                    }
                }), $iK(Y)];
            if (q) W.push(new Promise((Z, G) => {
                let f = () => {
                    let v = Error("Request aborted");
                    v.name = "AbortError", G(v)
                };
                if (typeof q.addEventListener === "function") {
                    let v = q;
                    v.addEventListener("abort", f, {
                        once: !0
                    }), X = () => v.removeEventListener("abort", f)
                } else q.onabort = f
            }));
            return Promise.race(W).finally(X)
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
    var HiK = async (A) => {
        if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
            if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
            return jiK(A)
        }
        return JiK(A)
    };
    async function jiK(A) {
        let q = await MiK(A),
            K = OiK.fromBase64(q);
        return new Uint8Array(K)
    }
    async function JiK(A) {
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

    function MiK(A) {
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
    DiK.FetchHttpHandler = Es1;
    DiK.keepAliveSupport = e41;
    DiK.streamCollector = HiK
})
// @from(Ln 66454, Col 4)
kFA = x((fiK) => {
    var VFA = {},
        ys1 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        VFA[A] = q, ys1[q] = A
    }

    function ZiK(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in ys1) q[K / 2] = ys1[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function GiK(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += VFA[A[K]];
        return q
    }
    fiK.fromHex = ZiK;
    fiK.toHex = GiK
})
// @from(Ln 66482, Col 4)
SFA = x((RFA) => {
    Object.defineProperty(RFA, "__esModule", {
        value: !0
    });
    RFA.sdkStreamMixin = void 0;
    var NiK = NFA(),
        ViK = _j6(),
        kiK = kFA(),
        EiK = C_(),
        EFA = Qr(),
        yFA = "The stream has already been transformed.",
        yiK = (A) => {
            if (!LFA(A) && !(0, EFA.isReadableStream)(A)) {
                let z = A?.__proto__?.constructor?.name || A;
                throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${z}`)
            }
            let q = !1,
                K = async () => {
                    if (q) throw Error(yFA);
                    return q = !0, await (0, NiK.streamCollector)(A)
                }, Y = (z) => {
                    if (typeof z.stream !== "function") throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
                    return z.stream()
                };
            return Object.assign(A, {
                transformToByteArray: K,
                transformToString: async (z) => {
                    let _ = await K();
                    if (z === "base64") return (0, ViK.toBase64)(_);
                    else if (z === "hex") return (0, kiK.toHex)(_);
                    else if (z === void 0 || z === "utf8" || z === "utf-8") return (0, EiK.toUtf8)(_);
                    else if (typeof TextDecoder === "function") return new TextDecoder(z).decode(_);
                    else throw Error("TextDecoder is not available, please make sure polyfill is provided.")
                },
                transformToWebStream: () => {
                    if (q) throw Error(yFA);
                    if (q = !0, LFA(A)) return Y(A);
                    else if ((0, EFA.isReadableStream)(A)) return A;
                    else throw Error(`Cannot transform payload to web stream, got ${A}`)
                }
            })
        };
    RFA.sdkStreamMixin = yiK;
    var LFA = (A) => typeof Blob === "function" && A instanceof Blob
})
// @from(Ln 66528, Col 4)
xFA = x((IFA) => {
    Object.defineProperty(IFA, "__esModule", {
        value: !0
    });
    IFA.sdkStreamMixin = void 0;
    var LiK = uT(),
        RiK = a41(),
        Ls1 = x6("stream"),
        hiK = SFA(),
        CFA = "The stream has already been transformed.",
        SiK = (A) => {
            if (!(A instanceof Ls1.Readable)) try {
                return (0, hiK.sdkStreamMixin)(A)
            } catch (Y) {
                let z = A?.__proto__?.constructor?.name || A;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${z}`)
            }
            let q = !1,
                K = async () => {
                    if (q) throw Error(CFA);
                    return q = !0, await (0, LiK.streamCollector)(A)
                };
            return Object.assign(A, {
                transformToByteArray: K,
                transformToString: async (Y) => {
                    let z = await K();
                    if (Y === void 0 || Buffer.isEncoding(Y)) return (0, RiK.fromArrayBuffer)(z.buffer, z.byteOffset, z.byteLength).toString(Y);
                    else return new TextDecoder(Y).decode(z)
                },
                transformToWebStream: () => {
                    if (q) throw Error(CFA);
                    if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof Ls1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
                    return q = !0, Ls1.Readable.toWeb(A)
                }
            })
        };
    IFA.sdkStreamMixin = SiK
})
// @from(Ln 66567, Col 4)
mFA = x((uFA) => {
    Object.defineProperty(uFA, "__esModule", {
        value: !0
    });
    uFA.splitStream = CiK;
    async function CiK(A) {
        if (typeof A.stream === "function") A = A.stream();
        return A.tee()
    }
})
// @from(Ln 66577, Col 4)
pFA = x((FFA) => {
    Object.defineProperty(FFA, "__esModule", {
        value: !0
    });
    FFA.splitStream = xiK;
    var BFA = x6("stream"),
        biK = mFA(),
        gFA = Qr();
    async function xiK(A) {
        if ((0, gFA.isReadableStream)(A) || (0, gFA.isBlob)(A)) return (0, biK.splitStream)(A);
        let q = new BFA.PassThrough,
            K = new BFA.PassThrough;
        return A.pipe(q), A.pipe(K), [q, K]
    }
})
// @from(Ln 66592, Col 4)
Rs1 = x((NP) => {
    var QFA = _j6(),
        UFA = C_(),
        dFA = Ws1(),
        cFA = cgA(),
        lFA = KFA(),
        iFA = _FA(),
        nFA = JFA(),
        rFA = xFA(),
        oFA = pFA(),
        aFA = Qr();
    class Fh6 extends Uint8Array {
        static fromString(A, q = "utf-8") {
            if (typeof A === "string") {
                if (q === "base64") return Fh6.mutate(QFA.fromBase64(A));
                return Fh6.mutate(UFA.fromUtf8(A))
            }
            throw Error(`Unsupported conversion from ${typeof A} to Uint8ArrayBlobAdapter.`)
        }
        static mutate(A) {
            return Object.setPrototypeOf(A, Fh6.prototype), A
        }
        transformToString(A = "utf-8") {
            if (A === "base64") return QFA.toBase64(this);
            return UFA.toUtf8(this)
        }
    }
    NP.Uint8ArrayBlobAdapter = Fh6;
    Object.keys(dFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return dFA[A]
            }
        })
    });
    Object.keys(cFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return cFA[A]
            }
        })
    });
    Object.keys(lFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return lFA[A]
            }
        })
    });
    Object.keys(iFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return iFA[A]
            }
        })
    });
    Object.keys(nFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return nFA[A]
            }
        })
    });
    Object.keys(rFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return rFA[A]
            }
        })
    });
    Object.keys(oFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return oFA[A]
            }
        })
    });
    Object.keys(aFA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(NP, A)) Object.defineProperty(NP, A, {
            enumerable: !0,
            get: function() {
                return aFA[A]
            }
        })
    })
})
// @from(Ln 66685, Col 4)
us1 = x((UiK) => {
    UiK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(UiK.HttpAuthLocation || (UiK.HttpAuthLocation = {}));
    UiK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(UiK.HttpApiKeyAuthLocation || (UiK.HttpApiKeyAuthLocation = {}));
    UiK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(UiK.EndpointURLScheme || (UiK.EndpointURLScheme = {}));
    UiK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(UiK.AlgorithmId || (UiK.AlgorithmId = {}));
    var BiK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => UiK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => UiK.AlgorithmId.MD5,
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
        giK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        FiK = (A) => {
            return BiK(A)
        },
        piK = (A) => {
            return giK(A)
        };
    UiK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(UiK.FieldPosition || (UiK.FieldPosition = {}));
    var QiK = "__smithy_context";
    UiK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(UiK.IniSectionType || (UiK.IniSectionType = {}));
    UiK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(UiK.RequestHandlerProtocol || (UiK.RequestHandlerProtocol = {}));
    UiK.SMITHY_CONTEXT_KEY = QiK;
    UiK.getDefaultClientConfiguration = FiK;
    UiK.resolveDefaultRuntimeConfig = piK
})
// @from(Ln 66750, Col 4)
Qh6 = x((siK) => {
    var iiK = us1(),
        niK = (A) => {
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
        riK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class sFA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = iiK.FieldPosition.HEADER,
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
    class tFA {
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
    class Aq1 {
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
            let q = new Aq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = oiK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Aq1.clone(this)
        }
    }

    function oiK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class eFA {
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

    function aiK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    siK.Field = sFA;
    siK.Fields = tFA;
    siK.HttpRequest = Aq1;
    siK.HttpResponse = eFA;
    siK.getHttpHandlerExtensionConfiguration = niK;
    siK.isValidHostname = aiK;
    siK.resolveHttpHandlerRuntimeConfig = riK
})
// @from(Ln 66892, Col 4)
ApA = x((jnK) => {
    jnK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(jnK.HttpAuthLocation || (jnK.HttpAuthLocation = {}));
    jnK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(jnK.HttpApiKeyAuthLocation || (jnK.HttpApiKeyAuthLocation = {}));
    jnK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(jnK.EndpointURLScheme || (jnK.EndpointURLScheme = {}));
    jnK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(jnK.AlgorithmId || (jnK.AlgorithmId = {}));
    var _nK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => jnK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => jnK.AlgorithmId.MD5,
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
        wnK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        OnK = (A) => {
            return _nK(A)
        },
        $nK = (A) => {
            return wnK(A)
        };
    jnK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(jnK.FieldPosition || (jnK.FieldPosition = {}));
    var HnK = "__smithy_context";
    jnK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(jnK.IniSectionType || (jnK.IniSectionType = {}));
    jnK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(jnK.RequestHandlerProtocol || (jnK.RequestHandlerProtocol = {}));
    jnK.SMITHY_CONTEXT_KEY = HnK;
    jnK.getDefaultClientConfiguration = OnK;
    jnK.resolveDefaultRuntimeConfig = $nK
})
// @from(Ln 66957, Col 4)
VW = x((WnK) => {
    var qpA = ApA(),
        XnK = (A) => A[qpA.SMITHY_CONTEXT_KEY] || (A[qpA.SMITHY_CONTEXT_KEY] = {}),
        PnK = (A) => {
            if (typeof A === "function") return A;
            let q = Promise.resolve(A);
            return () => q
        };
    WnK.getSmithyContext = XnK;
    WnK.normalizeProvider = PnK
})
// @from(Ln 66968, Col 4)
dO = x((CnK) => {
    var fnK = Qh6(),
        KpA = VW(),
        qq1 = (A) => {
            if (typeof A === "function") return A();
            return A
        },
        cs1 = (A, q, K, Y, z) => ({
            name: q,
            namespace: A,
            traits: K,
            input: Y,
            output: z
        }),
        TnK = (A) => (q, K) => async (Y) => {
            let {
                response: z
            } = await q(Y), {
                operationSchema: _
            } = KpA.getSmithyContext(K), [, w, O, $, H, j] = _ ?? [];
            try {
                let J = await A.protocol.deserializeResponse(cs1(w, O, $, H, j), {
                    ...A,
                    ...K
                }, z);
                return {
                    response: z,
                    output: J
                }
            } catch (J) {
                if (Object.defineProperty(J, "$response", {
                        value: z,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in J)) {
                    try {
                        J.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch (D) {
                        if (!K.logger || K.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else K.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof J.$responseBodyText < "u") {
                        if (J.$response) J.$response.body = J.$responseBodyText
                    }
                    try {
                        if (fnK.HttpResponse.isInstance(z)) {
                            let {
                                headers: D = {}
                            } = z, X = Object.entries(D);
                            J.$metadata = {
                                httpStatusCode: z.statusCode,
                                requestId: Us1(/^x-[\w-]+-request-?id$/, X),
                                extendedRequestId: Us1(/^x-[\w-]+-id-2$/, X),
                                cfId: Us1(/^x-[\w-]+-cf-id$/, X)
                            }
                        }
                    } catch (D) {}
                }
                throw J
            }
        }, Us1 = (A, q) => {
            return (q.find(([K]) => {
                return K.match(A)
            }) || [void 0, void 0])[1]
        }, vnK = (A) => (q, K) => async (Y) => {
            let {
                operationSchema: z
            } = KpA.getSmithyContext(K), [, _, w, O, $, H] = z ?? [], j = K.endpointV2?.url && A.urlParser ? async () => A.urlParser(K.endpointV2.url): A.endpoint, J = await A.protocol.serializeRequest(cs1(_, w, O, $, H), Y.input, {
                ...A,
                ...K,
                endpoint: j
            });
            return q({
                ...Y,
                request: J
            })
        }, YpA = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, zpA = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function NnK(A) {
        return {
            applyToStack: (q) => {
                q.add(vnK(A), zpA), q.add(TnK(A), YpA), A.protocol.setSerdeContext(A)
            }
        }
    }
    class gT {
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
    class Kq1 extends gT {
        static symbol = Symbol.for("@smithy/lis");
        name;
        traits;
        valueSchema;
        symbol = Kq1.symbol
    }
    var VnK = (A, q, K, Y) => gT.assign(new Kq1, {
        name: q,
        namespace: A,
        traits: K,
        valueSchema: Y
    });
    class Yq1 extends gT {
        static symbol = Symbol.for("@smithy/map");
        name;
        traits;
        keySchema;
        valueSchema;
        symbol = Yq1.symbol
    }
    var knK = (A, q, K, Y, z) => gT.assign(new Yq1, {
        name: q,
        namespace: A,
        traits: K,
        keySchema: Y,
        valueSchema: z
    });
    class zq1 extends gT {
        static symbol = Symbol.for("@smithy/ope");
        name;
        traits;
        input;
        output;
        symbol = zq1.symbol
    }
    var EnK = (A, q, K, Y, z) => gT.assign(new zq1, {
        name: q,
        namespace: A,
        traits: K,
        input: Y,
        output: z
    });
    class lh6 extends gT {
        static symbol = Symbol.for("@smithy/str");
        name;
        traits;
        memberNames;
        memberList;
        symbol = lh6.symbol
    }
    var ynK = (A, q, K, Y, z) => gT.assign(new lh6, {
        name: q,
        namespace: A,
        traits: K,
        memberNames: Y,
        memberList: z
    });
    class _q1 extends lh6 {
        static symbol = Symbol.for("@smithy/err");
        ctor;
        symbol = _q1.symbol
    }
    var LnK = (A, q, K, Y, z, _) => gT.assign(new _q1, {
        name: q,
        namespace: A,
        traits: K,
        memberNames: Y,
        memberList: z,
        ctor: null
    });

    function ch6(A) {
        if (typeof A === "object") return A;
        A = A | 0;
        let q = {},
            K = 0;
        for (let Y of ["httpLabel", "idempotent", "idempotencyToken", "sensitive", "httpPayload", "httpResponseCode", "httpQueryParams"])
            if ((A >> K++ & 1) === 1) q[Y] = 1;
        return q
    }
    class DQ {
        ref;
        memberName;
        static symbol = Symbol.for("@smithy/nor");
        symbol = DQ.symbol;
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
            while (ds1(Y)) K.push(Y[1]), Y = Y[0], z = qq1(Y), this._isMemberSchema = !0;
            if (K.length > 0) {
                this.memberTraits = {};
                for (let _ = K.length - 1; _ >= 0; --_) {
                    let w = K[_];
                    Object.assign(this.memberTraits, ch6(w))
                }
            } else this.memberTraits = 0;
            if (z instanceof DQ) {
                let _ = this.memberTraits;
                Object.assign(this, z), this.memberTraits = Object.assign({}, _, z.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = q ?? z.memberName;
                return
            }
            if (this.schema = qq1(z), _pA(this.schema)) this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3];
            else this.name = this.memberName ?? String(z), this.traits = 0;
            if (this._isMemberSchema && !q) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`)
        }
        static[Symbol.hasInstance](A) {
            let q = this.prototype.isPrototypeOf(A);
            if (!q && typeof A === "object" && A !== null) return A.symbol === this.symbol;
            return q
        }
        static of (A) {
            let q = qq1(A);
            if (q instanceof DQ) return q;
            if (ds1(q)) {
                let [K, Y] = q;
                if (K instanceof DQ) return Object.assign(K.getMergedTraits(), ch6(Y)), K;
                throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(A,null,2)}.`)
            }
            return new DQ(q)
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
            return ch6(this.memberTraits)
        }
        getOwnTraits() {
            return ch6(this.traits)
        }
        getKeySchema() {
            let [A, q] = [this.isDocumentSchema(), this.isMapSchema()];
            if (!A && !q) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
            let K = this.getSchema(),
                Y = A ? 15 : K[4] ?? 0;
            return dh6([Y, 0], "key")
        }
        getValueSchema() {
            let A = this.getSchema(),
                [q, K, Y] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()],
                z = typeof A === "number" ? 63 & A : A && typeof A === "object" && (K || Y) ? A[3 + A[0]] : q ? 15 : void 0;
            if (z != null) return dh6([z, 0], K ? "value" : "member");
            throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`)
        }
        getMemberSchema(A) {
            let q = this.getSchema();
            if (this.isStructSchema() && q[4].includes(A)) {
                let K = q[4].indexOf(A),
                    Y = q[5][K];
                return dh6(ds1(Y) ? Y : [Y, 0], A)
            }
            if (this.isDocumentSchema()) return dh6([15, 0], A);
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
            for (let q = 0; q < A[4].length; ++q) yield [A[4][q], dh6([A[5][q], 0], A[4][q])]
        }
    }

    function dh6(A, q) {
        if (A instanceof DQ) return Object.assign(A, {
            memberName: q,
            _isMemberSchema: !0
        });
        return new DQ(A, q)
    }
    var ds1 = (A) => Array.isArray(A) && A.length === 2,
        _pA = (A) => Array.isArray(A) && A.length >= 5;
    class ih6 extends gT {
        static symbol = Symbol.for("@smithy/sim");
        name;
        schemaRef;
        traits;
        symbol = ih6.symbol
    }
    var RnK = (A, q, K, Y) => gT.assign(new ih6, {
            name: q,
            namespace: A,
            traits: Y,
            schemaRef: K
        }),
        hnK = (A, q, K, Y) => gT.assign(new ih6, {
            name: q,
            namespace: A,
            traits: K,
            schemaRef: Y
        }),
        SnK = {
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
    class MQ {
        namespace;
        schemas;
        exceptions;
        static registries = new Map;
        constructor(A, q = new Map, K = new Map) {
            this.namespace = A, this.schemas = q, this.exceptions = K
        }
        static
        for (A) {
            if (!MQ.registries.has(A)) MQ.registries.set(A, new MQ(A));
            return MQ.registries.get(A)
        }
        register(A, q) {
            let K = this.normalizeShapeId(A);
            MQ.for(K.split("#")[0]).schemas.set(K, q)
        }
        getSchema(A) {
            let q = this.normalizeShapeId(A);
            if (!this.schemas.has(q)) throw Error(`@smithy/core/schema - schema not found for ${q}`);
            return this.schemas.get(q)
        }
        registerError(A, q) {
            let K = A,
                Y = MQ.for(K[1]);
            Y.schemas.set(K[1] + "#" + K[2], K), Y.exceptions.set(K, q)
        }
        getErrorCtor(A) {
            let q = A;
            return MQ.for(q[1]).exceptions.get(q)
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
    CnK.ErrorSchema = _q1;
    CnK.ListSchema = Kq1;
    CnK.MapSchema = Yq1;
    CnK.NormalizedSchema = DQ;
    CnK.OperationSchema = zq1;
    CnK.SCHEMA = SnK;
    CnK.Schema = gT;
    CnK.SimpleSchema = ih6;
    CnK.StructureSchema = lh6;
    CnK.TypeRegistry = MQ;
    CnK.deref = qq1;
    CnK.deserializerMiddlewareOption = YpA;
    CnK.error = LnK;
    CnK.getSchemaSerdePlugin = NnK;
    CnK.isStaticSchema = _pA;
    CnK.list = VnK;
    CnK.map = knK;
    CnK.op = EnK;
    CnK.operation = cs1;
    CnK.serializerMiddlewareOption = zpA;
    CnK.sim = RnK;
    CnK.simAdapter = hnK;
    CnK.struct = ynK;
    CnK.translateTraits = ch6
})
// @from(Ln 67459, Col 4)
HpA = x((OpA) => {
    Object.defineProperty(OpA, "__esModule", {
        value: !0
    });
    OpA.randomUUID = void 0;
    var KrK = _2(),
        wpA = KrK.__importDefault(x6("crypto"));
    OpA.randomUUID = wpA.default.randomUUID.bind(wpA.default)
})
// @from(Ln 67468, Col 4)
ls1 = x((zrK) => {
    var jpA = HpA(),
        kW = Array.from({
            length: 256
        }, (A, q) => q.toString(16).padStart(2, "0")),
        YrK = () => {
            if (jpA.randomUUID) return jpA.randomUUID();
            let A = new Uint8Array(16);
            return crypto.getRandomValues(A), A[6] = A[6] & 15 | 64, A[8] = A[8] & 63 | 128, kW[A[0]] + kW[A[1]] + kW[A[2]] + kW[A[3]] + "-" + kW[A[4]] + kW[A[5]] + "-" + kW[A[6]] + kW[A[7]] + "-" + kW[A[8]] + kW[A[9]] + "-" + kW[A[10]] + kW[A[11]] + kW[A[12]] + kW[A[13]] + kW[A[14]] + kW[A[15]]
        };
    zrK.v4 = YrK
})
// @from(Ln 67480, Col 4)
FT = x((fpA) => {
    var wrK = ls1(),
        OrK = (A, q, K = (Y) => Y) => A,
        $rK = (A) => {
            switch (A) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${A}"`)
            }
        },
        HrK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "number") {
                if (A === 0 || A === 1) ah6.warn(Oq1(`Expected boolean, got ${typeof A}: ${A}`));
                if (A === 0) return !1;
                if (A === 1) return !0
            }
            if (typeof A === "string") {
                let q = A.toLowerCase();
                if (q === "false" || q === "true") ah6.warn(Oq1(`Expected boolean, got ${typeof A}: ${A}`));
                if (q === "false") return !1;
                if (q === "true") return !0
            }
            if (typeof A === "boolean") return A;
            throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
        },
        rh6 = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") {
                let q = parseFloat(A);
                if (!Number.isNaN(q)) {
                    if (String(q) !== String(A)) ah6.warn(Oq1(`Expected number but observed string: ${A}`));
                    return q
                }
            }
            if (typeof A === "number") return A;
            throw TypeError(`Expected number, got ${typeof A}: ${A}`)
        },
        jrK = Math.ceil(340282346638528860000000000000000000000),
        wq1 = (A) => {
            let q = rh6(A);
            if (q !== void 0 && !Number.isNaN(q) && q !== 1 / 0 && q !== -1 / 0) {
                if (Math.abs(q) > jrK) throw TypeError(`Expected 32-bit float, got ${A}`)
            }
            return q
        },
        oh6 = (A) => {
            if (A === null || A === void 0) return;
            if (Number.isInteger(A) && !Number.isNaN(A)) return A;
            throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
        },
        JrK = oh6,
        ns1 = (A) => as1(A, 32),
        rs1 = (A) => as1(A, 16),
        os1 = (A) => as1(A, 8),
        as1 = (A, q) => {
            let K = oh6(A);
            if (K !== void 0 && MrK(K, q) !== K) throw TypeError(`Expected ${q}-bit integer, got ${A}`);
            return K
        },
        MrK = (A, q) => {
            switch (q) {
                case 32:
                    return Int32Array.of(A)[0];
                case 16:
                    return Int16Array.of(A)[0];
                case 8:
                    return Int8Array.of(A)[0]
            }
        },
        DrK = (A, q) => {
            if (A === null || A === void 0) {
                if (q) throw TypeError(`Expected a non-null value for ${q}`);
                throw TypeError("Expected a non-null value")
            }
            return A
        },
        MpA = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "object" && !Array.isArray(A)) return A;
            let q = Array.isArray(A) ? "array" : typeof A;
            throw TypeError(`Expected object, got ${q}: ${A}`)
        },
        XrK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") return A;
            if (["boolean", "number", "bigint"].includes(typeof A)) return ah6.warn(Oq1(`Expected string, got ${typeof A}: ${A}`)), String(A);
            throw TypeError(`Expected string, got ${typeof A}: ${A}`)
        },
        PrK = (A) => {
            if (A === null || A === void 0) return;
            let q = MpA(A),
                K = Object.entries(q).filter(([, Y]) => Y != null).map(([Y]) => Y);
            if (K.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (K.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${K} were not null.`);
            return q
        },
        ss1 = (A) => {
            if (typeof A == "string") return rh6(Hj6(A));
            return rh6(A)
        },
        WrK = ss1,
        DpA = (A) => {
            if (typeof A == "string") return wq1(Hj6(A));
            return wq1(A)
        },
        ZrK = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        Hj6 = (A) => {
            let q = A.match(ZrK);
            if (q === null || q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(A)
        },
        ts1 = (A) => {
            if (typeof A == "string") return XpA(A);
            return rh6(A)
        },
        GrK = ts1,
        frK = ts1,
        TrK = (A) => {
            if (typeof A == "string") return XpA(A);
            return wq1(A)
        },
        XpA = (A) => {
            switch (A) {
                case "NaN":
                    return NaN;
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                default:
                    throw Error(`Unable to parse float value: ${A}`)
            }
        },
        PpA = (A) => {
            if (typeof A === "string") return oh6(Hj6(A));
            return oh6(A)
        },
        vrK = PpA,
        NrK = (A) => {
            if (typeof A === "string") return ns1(Hj6(A));
            return ns1(A)
        },
        Oj6 = (A) => {
            if (typeof A === "string") return rs1(Hj6(A));
            return rs1(A)
        },
        WpA = (A) => {
            if (typeof A === "string") return os1(Hj6(A));
            return os1(A)
        },
        Oq1 = (A) => {
            return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((q) => !q.includes("stackTraceWarning")).join(`
`)
        },
        ah6 = {
            warn: console.warn
        },
        VrK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        es1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function krK(A) {
        let q = A.getUTCFullYear(),
            K = A.getUTCMonth(),
            Y = A.getUTCDay(),
            z = A.getUTCDate(),
            _ = A.getUTCHours(),
            w = A.getUTCMinutes(),
            O = A.getUTCSeconds(),
            $ = z < 10 ? `0${z}` : `${z}`,
            H = _ < 10 ? `0${_}` : `${_}`,
            j = w < 10 ? `0${w}` : `${w}`,
            J = O < 10 ? `0${O}` : `${O}`;
        return `${VrK[Y]}, ${$} ${es1[K]} ${q} ${H}:${j}:${J} GMT`
    }
    var ErK = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        yrK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = ErK.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, _, w, O, $, H] = q, j = Oj6($j6(Y)), J = Wu(z, "month", 1, 12), M = Wu(_, "day", 1, 31);
            return nh6(j, J, M, {
                hours: w,
                minutes: O,
                seconds: $,
                fractionalMilliseconds: H
            })
        },
        LrK = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        RrK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = LrK.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, _, w, O, $, H, j] = q, J = Oj6($j6(Y)), M = Wu(z, "month", 1, 12), D = Wu(_, "day", 1, 31), X = nh6(J, M, D, {
                hours: w,
                minutes: O,
                seconds: $,
                fractionalMilliseconds: H
            });
            if (j.toUpperCase() != "Z") X.setTime(X.getTime() - QrK(j));
            return X
        },
        hrK = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        SrK = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        CrK = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        IrK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let q = hrK.exec(A);
            if (q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return nh6(Oj6($j6(_)), is1(z), Wu(Y, "day", 1, 31), {
                    hours: w,
                    minutes: O,
                    seconds: $,
                    fractionalMilliseconds: H
                })
            }
            if (q = SrK.exec(A), q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return mrK(nh6(xrK(_), is1(z), Wu(Y, "day", 1, 31), {
                    hours: w,
                    minutes: O,
                    seconds: $,
                    fractionalMilliseconds: H
                }))
            }
            if (q = CrK.exec(A), q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return nh6(Oj6($j6(H)), is1(Y), Wu(z.trimLeft(), "day", 1, 31), {
                    hours: _,
                    minutes: w,
                    seconds: O,
                    fractionalMilliseconds: $
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        },
        brK = (A) => {
            if (A === null || A === void 0) return;
            let q;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") q = ss1(A);
            else if (typeof A === "object" && A.tag === 1) q = A.value;
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(q) || q === 1 / 0 || q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(q * 1000))
        },
        nh6 = (A, q, K, Y) => {
            let z = q - 1;
            return grK(A, z, K), new Date(Date.UTC(A, z, K, Wu(Y.hours, "hour", 0, 23), Wu(Y.minutes, "minute", 0, 59), Wu(Y.seconds, "seconds", 0, 60), prK(Y.fractionalMilliseconds)))
        },
        xrK = (A) => {
            let q = new Date().getUTCFullYear(),
                K = Math.floor(q / 100) * 100 + Oj6($j6(A));
            if (K < q) return K + 100;
            return K
        },
        urK = 1576800000000,
        mrK = (A) => {
            if (A.getTime() - new Date().getTime() > urK) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
            return A
        },
        is1 = (A) => {
            let q = es1.indexOf(A);
            if (q < 0) throw TypeError(`Invalid month: ${A}`);
            return q + 1
        },
        BrK = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        grK = (A, q, K) => {
            let Y = BrK[q];
            if (q === 1 && FrK(A)) Y = 29;
            if (K > Y) throw TypeError(`Invalid day for ${es1[q]} in ${A}: ${K}`)
        },
        FrK = (A) => {
            return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
        },
        Wu = (A, q, K, Y) => {
            let z = WpA($j6(A));
            if (z < K || z > Y) throw TypeError(`${q} must be between ${K} and ${Y}, inclusive`);
            return z
        },
        prK = (A) => {
            if (A === null || A === void 0) return 0;
            return DpA("0." + A) * 1000
        },
        QrK = (A) => {
            let q = A[0],
                K = 1;
            if (q == "+") K = 1;
            else if (q == "-") K = -1;
            else throw TypeError(`Offset direction, ${q}, must be "+" or "-"`);
            let Y = Number(A.substring(1, 3)),
                z = Number(A.substring(4, 6));
            return K * (Y * 60 + z) * 60 * 1000
        },
        $j6 = (A) => {
            let q = 0;
            while (q < A.length - 1 && A.charAt(q) === "0") q++;
            if (q === 0) return A;
            return A.slice(q)
        },
        s76 = function(q) {
            return Object.assign(new String(q), {
                deserializeJSON() {
                    return JSON.parse(String(q))
                },
                toString() {
                    return String(q)
                },
                toJSON() {
                    return String(q)
                }
            })
        };
    s76.from = (A) => {
        if (A && typeof A === "object" && (A instanceof s76 || ("deserializeJSON" in A))) return A;
        else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return s76(String(A));
        return s76(JSON.stringify(A))
    };
    s76.fromObject = s76.from;

    function UrK(A) {
        if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
        return A
    }
    var At1 = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?",
        qt1 = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)",
        Kt1 = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?",
        ZpA = "(\\d?\\d)",
        GpA = "(\\d{4})",
        drK = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/),
        crK = new RegExp(`^${At1}, ${ZpA} ${qt1} ${GpA} ${Kt1} GMT$`),
        lrK = new RegExp(`^${At1}, ${ZpA}-${qt1}-(\\d\\d) ${Kt1} GMT$`),
        irK = new RegExp(`^${At1} ${qt1} ( [1-9]|\\d\\d) ${Kt1} ${GpA}$`),
        nrK = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        rrK = (A) => {
            if (A == null) return;
            let q = NaN;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") {
                if (!/^-?\d*\.?\d+$/.test(A)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
                q = Number.parseFloat(A)
            } else if (typeof A === "object" && A.tag === 1) q = A.value;
            if (isNaN(q) || Math.abs(q) === 1 / 0) throw TypeError("Epoch timestamps must be valid finite numbers.");
            return new Date(Math.round(q * 1000))
        },
        orK = (A) => {
            if (A == null) return;
            if (typeof A !== "string") throw TypeError("RFC3339 timestamps must be strings");
            let q = drK.exec(A);
            if (!q) throw TypeError(`Invalid RFC3339 timestamp format ${A}`);
            let [, K, Y, z, _, w, O, , $, H] = q;
            XQ(Y, 1, 12), XQ(z, 1, 31), XQ(_, 0, 23), XQ(w, 0, 59), XQ(O, 0, 60);
            let j = new Date(Date.UTC(Number(K), Number(Y) - 1, Number(z), Number(_), Number(w), Number(O), Number($) ? Math.round(parseFloat(`0.${$}`) * 1000) : 0));
            if (j.setUTCFullYear(Number(K)), H.toUpperCase() != "Z") {
                let [, J, M, D] = /([+-])(\d\d):(\d\d)/.exec(H) || [void 0, "+", 0, 0], X = J === "-" ? 1 : -1;
                j.setTime(j.getTime() + X * (Number(M) * 60 * 60 * 1000 + Number(D) * 60 * 1000))
            }
            return j
        },
        arK = (A) => {
            if (A == null) return;
            if (typeof A !== "string") throw TypeError("RFC7231 timestamps must be strings.");
            let q, K, Y, z, _, w, O, $;
            if ($ = crK.exec(A))[, q, K, Y, z, _, w, O] = $;
            else if ($ = lrK.exec(A))[, q, K, Y, z, _, w, O] = $, Y = (Number(Y) + 1900).toString();
            else if ($ = irK.exec(A))[, K, q, z, _, w, O, Y] = $;
            if (Y && w) {
                let H = Date.UTC(Number(Y), nrK.indexOf(K), Number(q), Number(z), Number(_), Number(w), O ? Math.round(parseFloat(`0.${O}`) * 1000) : 0);
                XQ(q, 1, 31), XQ(z, 0, 23), XQ(_, 0, 59), XQ(w, 0, 60);
                let j = new Date(H);
                return j.setUTCFullYear(Number(Y)), j
            }
            throw TypeError(`Invalid RFC7231 date-time value ${A}.`)
        };

    function XQ(A, q, K) {
        let Y = Number(A);
        if (Y < q || Y > K) throw Error(`Value ${Y} out of range [${q}, ${K}]`)
    }

    function srK(A, q, K) {
        if (K <= 0 || !Number.isInteger(K)) throw Error("Invalid number of delimiters (" + K + ") for splitEvery.");
        let Y = A.split(q);
        if (K === 1) return Y;
        let z = [],
            _ = "";
        for (let w = 0; w < Y.length; w++) {
            if (_ === "") _ = Y[w];
            else _ += q + Y[w];
            if ((w + 1) % K === 0) z.push(_), _ = ""
        }
        if (_ !== "") z.push(_);
        return z
    }
    var trK = (A) => {
            let q = A.length,
                K = [],
                Y = !1,
                z = void 0,
                _ = 0;
            for (let w = 0; w < q; ++w) {
                let O = A[w];
                switch (O) {
                    case '"':
                        if (z !== "\\") Y = !Y;
                        break;
                    case ",":
                        if (!Y) K.push(A.slice(_, w)), _ = w + 1;
                        break
                }
                z = O
            }
            return K.push(A.slice(_)), K.map((w) => {
                w = w.trim();
                let O = w.length;
                if (O < 2) return w;
                if (w[0] === '"' && w[O - 1] === '"') w = w.slice(1, O - 1);
                return w.replace(/\\"/g, '"')
            })
        },
        JpA = /^-?\d*(\.\d+)?$/;
    class $q1 {
        string;
        type;
        constructor(A, q) {
            if (this.string = A, this.type = q, !JpA.test(A)) throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".')
        }
        toString() {
            return this.string
        }
        static[Symbol.hasInstance](A) {
            if (!A || typeof A !== "object") return !1;
            let q = A;
            return $q1.prototype.isPrototypeOf(A) || q.type === "bigDecimal" && JpA.test(q.string)
        }
    }

    function erK(A) {
        return new $q1(String(A), "bigDecimal")
    }
    Object.defineProperty(fpA, "generateIdempotencyToken", {
        enumerable: !0,
        get: function() {
            return wrK.v4
        }
    });
    fpA.LazyJsonString = s76;
    fpA.NumericValue = $q1;
    fpA._parseEpochTimestamp = rrK;
    fpA._parseRfc3339DateTimeWithOffset = orK;
    fpA._parseRfc7231DateTime = arK;
    fpA.copyDocumentWithTransform = OrK;
    fpA.dateToUtcString = krK;
    fpA.expectBoolean = HrK;
    fpA.expectByte = os1;
    fpA.expectFloat32 = wq1;
    fpA.expectInt = JrK;
    fpA.expectInt32 = ns1;
    fpA.expectLong = oh6;
    fpA.expectNonNull = DrK;
    fpA.expectNumber = rh6;
    fpA.expectObject = MpA;
    fpA.expectShort = rs1;
    fpA.expectString = XrK;
    fpA.expectUnion = PrK;
    fpA.handleFloat = GrK;
    fpA.limitedParseDouble = ts1;
    fpA.limitedParseFloat = frK;
    fpA.limitedParseFloat32 = TrK;
    fpA.logger = ah6;
    fpA.nv = erK;
    fpA.parseBoolean = $rK;
    fpA.parseEpochTimestamp = brK;
    fpA.parseRfc3339DateTime = yrK;
    fpA.parseRfc3339DateTimeWithOffset = RrK;
    fpA.parseRfc7231DateTime = IrK;
    fpA.quoteHeader = UrK;
    fpA.splitEvery = srK;
    fpA.splitHeader = trK;
    fpA.strictParseByte = WpA;
    fpA.strictParseDouble = ss1;
    fpA.strictParseFloat = WrK;
    fpA.strictParseFloat32 = DpA;
    fpA.strictParseInt = vrK;
    fpA.strictParseInt32 = NrK;
    fpA.strictParseLong = PpA;
    fpA.strictParseShort = Oj6
})
// @from(Ln 67976, Col 4)
TpA = x((UoK) => {
    var QoK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    UoK.isArrayBuffer = QoK
})
// @from(Ln 67980, Col 4)
zt1 = x((noK) => {
    var coK = TpA(),
        Yt1 = x6("buffer"),
        loK = (A, q = 0, K = A.byteLength - q) => {
            if (!coK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Yt1.Buffer.from(A, q, K)
        },
        ioK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Yt1.Buffer.from(A, q) : Yt1.Buffer.from(A)
        };
    noK.fromArrayBuffer = loK;
    noK.fromString = ioK
})
// @from(Ln 67994, Col 4)
VpA = x((vpA) => {
    Object.defineProperty(vpA, "__esModule", {
        value: !0
    });
    vpA.fromBase64 = void 0;
    var aoK = zt1(),
        soK = /^[A-Za-z0-9+/]*={0,2}$/,
        toK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!soK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, aoK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    vpA.fromBase64 = toK
})
// @from(Ln 68009, Col 4)
ypA = x((kpA) => {
    Object.defineProperty(kpA, "__esModule", {
        value: !0
    });
    kpA.toBase64 = void 0;
    var eoK = zt1(),
        AaK = C_(),
        qaK = (A) => {
            let q;
            if (typeof A === "string") q = (0, AaK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, eoK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    kpA.toBase64 = qaK
})
// @from(Ln 68025, Col 4)
_t1 = x((sh6) => {
    var LpA = VpA(),
        RpA = ypA();
    Object.keys(LpA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(sh6, A)) Object.defineProperty(sh6, A, {
            enumerable: !0,
            get: function() {
                return LpA[A]
            }
        })
    });
    Object.keys(RpA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(sh6, A)) Object.defineProperty(sh6, A, {
            enumerable: !0,
            get: function() {
                return RpA[A]
            }
        })
    })
})
// @from(Ln 68045, Col 4)
CpA = x((KaK) => {
    var hpA = C_();
    class SpA {
        marshaller;
        serializer;
        deserializer;
        serdeContext;
        defaultContentType;
        constructor({
            marshaller: A,
            serializer: q,
            deserializer: K,
            serdeContext: Y,
            defaultContentType: z
        }) {
            this.marshaller = A, this.serializer = q, this.deserializer = K, this.serdeContext = Y, this.defaultContentType = z
        }
        async serializeEventStream({
            eventStream: A,
            requestSchema: q,
            initialRequest: K
        }) {
            let Y = this.marshaller,
                z = q.getEventStreamMember(),
                _ = q.getMemberSchema(z),
                w = this.serializer,
                O = this.defaultContentType,
                $ = Symbol("initialRequestMarker"),
                H = {
                    async * [Symbol.asyncIterator]() {
                        if (K) {
                            let j = {
                                ":event-type": {
                                    type: "string",
                                    value: "initial-request"
                                },
                                ":message-type": {
                                    type: "string",
                                    value: "event"
                                },
                                ":content-type": {
                                    type: "string",
                                    value: O
                                }
                            };
                            w.write(q, K);
                            let J = w.flush();
                            yield {
                                [$]: !0, headers: j, body: J
                            }
                        }
                        for await (let j of A) yield j
                    }
                };
            return Y.serialize(H, (j) => {
                if (j[$]) return {
                    headers: j.headers,
                    body: j.body
                };
                let J = Object.keys(j).find((Z) => {
                        return Z !== "__type"
                    }) ?? "",
                    {
                        additionalHeaders: M,
                        body: D,
                        eventType: X,
                        explicitPayloadContentType: P
                    } = this.writeEventBody(J, _, j);
                return {
                    headers: {
                        ":event-type": {
                            type: "string",
                            value: X
                        },
                        ":message-type": {
                            type: "string",
                            value: "event"
                        },
                        ":content-type": {
                            type: "string",
                            value: P ?? O
                        },
                        ...M
                    },
                    body: D
                }
            })
        }
        async deserializeEventStream({
            response: A,
            responseSchema: q,
            initialResponseContainer: K
        }) {
            let Y = this.marshaller,
                z = q.getEventStreamMember(),
                w = q.getMemberSchema(z).getMemberSchemas(),
                O = Symbol("initialResponseMarker"),
                $ = Y.deserialize(A.body, async (J) => {
                    let M = Object.keys(J).find((X) => {
                            return X !== "__type"
                        }) ?? "",
                        D = J[M].body;
                    if (M === "initial-response") {
                        let X = await this.deserializer.read(q, D);
                        return delete X[z], {
                            [O]: !0,
                            ...X
                        }
                    } else if (M in w) {
                        let X = w[M];
                        if (X.isStructSchema()) {
                            let P = {},
                                W = !1;
                            for (let [Z, G] of X.structIterator()) {
                                let {
                                    eventHeader: f,
                                    eventPayload: v
                                } = G.getMergedTraits();
                                if (W = W || Boolean(f || v), v) {
                                    if (G.isBlobSchema()) P[Z] = D;
                                    else if (G.isStringSchema()) P[Z] = (this.serdeContext?.utf8Encoder ?? hpA.toUtf8)(D);
                                    else if (G.isStructSchema()) P[Z] = await this.deserializer.read(G, D)
                                } else if (f) {
                                    let N = J[M].headers[Z]?.value;
                                    if (N != null)
                                        if (G.isNumericSchema())
                                            if (N && typeof N === "object" && "bytes" in N) P[Z] = BigInt(N.toString());
                                            else P[Z] = Number(N);
                                    else P[Z] = N
                                }
                            }
                            if (W) return {
                                [M]: P
                            }
                        }
                        return {
                            [M]: await this.deserializer.read(X, D)
                        }
                    } else return {
                        $unknown: J
                    }
                }),
                H = $[Symbol.asyncIterator](),
                j = await H.next();
            if (j.done) return $;
            if (j.value?.[O]) {
                if (!q) throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
                for (let [J, M] of Object.entries(j.value)) K[J] = M
            }
            return {
                async * [Symbol.asyncIterator]() {
                    if (!j?.value?.[O]) yield j.value;
                    while (!0) {
                        let {
                            done: J,
                            value: M
                        } = await H.next();
                        if (J) break;
                        yield M
                    }
                }
            }
        }
        writeEventBody(A, q, K) {
            let Y = this.serializer,
                z = A,
                _ = null,
                w, O = (() => {
                    return q.getSchema()[4].includes(A)
                })(),
                $ = {};
            if (!O) {
                let [J, M] = K[A];
                z = J, Y.write(15, M)
            } else {
                let J = q.getMemberSchema(A);
                if (J.isStructSchema()) {
                    for (let [M, D] of J.structIterator()) {
                        let {
                            eventHeader: X,
                            eventPayload: P
                        } = D.getMergedTraits();
                        if (P) {
                            _ = M;
                            break
                        } else if (X) {
                            let W = K[A][M],
                                Z = "binary";
                            if (D.isNumericSchema())
                                if (-2147483648 <= W && W <= 2147483647) Z = "integer";
                                else Z = "long";
                            else if (D.isTimestampSchema()) Z = "timestamp";
                            else if (D.isStringSchema()) Z = "string";
                            else if (D.isBooleanSchema()) Z = "boolean";
                            if (W != null) $[M] = {
                                type: Z,
                                value: W
                            }, delete K[A][M]
                        }
                    }
                    if (_ !== null) {
                        let M = J.getMemberSchema(_);
                        if (M.isBlobSchema()) w = "application/octet-stream";
                        else if (M.isStringSchema()) w = "text/plain";
                        Y.write(M, K[A][_])
                    } else Y.write(J, K[A])
                } else throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.")
            }
            let H = Y.flush();
            return {
                body: typeof H === "string" ? (this.serdeContext?.utf8Decoder ?? hpA.fromUtf8)(H) : H,
                eventType: z,
                explicitPayloadContentType: w,
                additionalHeaders: $
            }
        }
    }
    KaK.EventStreamSerde = SpA
})