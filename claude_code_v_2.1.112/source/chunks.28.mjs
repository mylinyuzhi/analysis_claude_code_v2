
// @from(Ln 68984, Col 4)
RP8 = p((kY3) => {
    var vY3 = ze7(),
        _j1 = d6("buffer"),
        TY3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!vY3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return _j1.Buffer.from(q, K, _)
        },
        VY3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? _j1.Buffer.from(q, K) : _j1.Buffer.from(q)
        };
    kY3.fromArrayBuffer = TY3;
    kY3.fromString = VY3
})
// @from(Ln 68998, Col 4)
Oe7 = p((Ye7) => {
    Object.defineProperty(Ye7, "__esModule", {
        value: !0
    });
    Ye7.fromBase64 = void 0;
    var yY3 = RP8(),
        LY3 = /^[A-Za-z0-9+/]*={0,2}$/,
        hY3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!LY3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, yY3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    Ye7.fromBase64 = hY3
})
// @from(Ln 69013, Col 4)
we7 = p((SY3) => {
    var RY3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    SY3.isArrayBuffer = RY3
})
// @from(Ln 69017, Col 4)
$e7 = p((uY3) => {
    var bY3 = we7(),
        zj1 = d6("buffer"),
        IY3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!bY3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return zj1.Buffer.from(q, K, _)
        },
        xY3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? zj1.Buffer.from(q, K) : zj1.Buffer.from(q)
        };
    uY3.fromArrayBuffer = IY3;
    uY3.fromString = xY3
})
// @from(Ln 69031, Col 4)
nw = p((gY3) => {
    var je7 = $e7(),
        He7 = (q) => {
            let K = je7.fromString(q, "utf8");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        },
        pY3 = (q) => {
            if (typeof q === "string") return He7(q);
            if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(q)
        },
        FY3 = (q) => {
            if (typeof q === "string") return q;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return je7.fromArrayBuffer(q.buffer, q.byteOffset, q.byteLength).toString("utf8")
        };
    gY3.fromUtf8 = He7;
    gY3.toUint8Array = pY3;
    gY3.toUtf8 = FY3
})
// @from(Ln 69051, Col 4)
Me7 = p((Je7) => {
    Object.defineProperty(Je7, "__esModule", {
        value: !0
    });
    Je7.toBase64 = void 0;
    var cY3 = RP8(),
        lY3 = nw(),
        nY3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, lY3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, cY3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    Je7.toBase64 = nY3
})
// @from(Ln 69067, Col 4)
qc6 = p((ed6) => {
    var Pe7 = Oe7(),
        We7 = Me7();
    Object.keys(Pe7).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ed6, q)) Object.defineProperty(ed6, q, {
            enumerable: !0,
            get: function() {
                return Pe7[q]
            }
        })
    });
    Object.keys(We7).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ed6, q)) Object.defineProperty(ed6, q, {
            enumerable: !0,
            get: function() {
                return We7[q]
            }
        })
    })
})
// @from(Ln 69087, Col 4)
Yj1 = p((Ze7) => {
    Object.defineProperty(Ze7, "__esModule", {
        value: !0
    });
    Ze7.ChecksumStream = void 0;
    var iY3 = qc6(),
        rY3 = d6("stream");
    class De7 extends rY3.Duplex {
        expectedChecksum;
        checksumSourceLocation;
        checksum;
        source;
        base64Encoder;
        constructor({
            expectedChecksum: q,
            checksum: K,
            source: _,
            checksumSourceLocation: z,
            base64Encoder: Y
        }) {
            super();
            if (typeof _.pipe === "function") this.source = _;
            else throw Error(`@smithy/util-stream: unsupported source type ${_?.constructor?.name??_} in ChecksumStream.`);
            this.base64Encoder = Y ?? iY3.toBase64, this.expectedChecksum = q, this.checksum = K, this.checksumSourceLocation = z, this.source.pipe(this)
        }
        _read(q) {}
        _write(q, K, _) {
            try {
                this.checksum.update(q), this.push(q)
            } catch (z) {
                return _(z)
            }
            return _()
        }
        async _final(q) {
            try {
                let K = await this.checksum.digest(),
                    _ = this.base64Encoder(K);
                if (this.expectedChecksum !== _) return q(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${_}" in response header "${this.checksumSourceLocation}".`))
            } catch (K) {
                return q(K)
            }
            return this.push(null), q()
        }
    }
    Ze7.ChecksumStream = De7
})
// @from(Ln 69134, Col 4)
J76 = p((Ge7) => {
    Object.defineProperty(Ge7, "__esModule", {
        value: !0
    });
    Ge7.isBlob = Ge7.isReadableStream = void 0;
    var oY3 = (q) => typeof ReadableStream === "function" && (q?.constructor?.name === ReadableStream.name || q instanceof ReadableStream);
    Ge7.isReadableStream = oY3;
    var aY3 = (q) => {
        return typeof Blob === "function" && (q?.constructor?.name === Blob.name || q instanceof Blob)
    };
    Ge7.isBlob = aY3
})
// @from(Ln 69146, Col 4)
Ne7 = p((Ve7) => {
    Object.defineProperty(Ve7, "__esModule", {
        value: !0
    });
    Ve7.ChecksumStream = void 0;
    var tY3 = typeof ReadableStream === "function" ? ReadableStream : function() {};
    class Te7 extends tY3 {}
    Ve7.ChecksumStream = Te7
})
// @from(Ln 69155, Col 4)
Le7 = p((Ee7) => {
    Object.defineProperty(Ee7, "__esModule", {
        value: !0
    });
    Ee7.createChecksumStream = void 0;
    var eY3 = qc6(),
        qA3 = J76(),
        KA3 = Ne7(),
        _A3 = ({
            expectedChecksum: q,
            checksum: K,
            source: _,
            checksumSourceLocation: z,
            base64Encoder: Y
        }) => {
            if (!(0, qA3.isReadableStream)(_)) throw Error(`@smithy/util-stream: unsupported source type ${_?.constructor?.name??_} in ChecksumStream.`);
            let A = Y ?? eY3.toBase64;
            if (typeof TransformStream !== "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
            let O = new TransformStream({
                start() {},
                async transform($, j) {
                    K.update($), j.enqueue($)
                },
                async flush($) {
                    let j = await K.digest(),
                        H = A(j);
                    if (q !== H) {
                        let J = Error(`Checksum mismatch: expected "${q}" but received "${H}" in response header "${z}".`);
                        $.error(J)
                    } else $.terminate()
                }
            });
            _.pipeThrough(O);
            let w = O.readable;
            return Object.setPrototypeOf(w, KA3.ChecksumStream.prototype), w
        };
    Ee7.createChecksumStream = _A3
})
// @from(Ln 69193, Col 4)
Re7 = p((he7) => {
    Object.defineProperty(he7, "__esModule", {
        value: !0
    });
    he7.createChecksumStream = OA3;
    var zA3 = J76(),
        YA3 = Yj1(),
        AA3 = Le7();

    function OA3(q) {
        if (typeof ReadableStream === "function" && (0, zA3.isReadableStream)(q.source)) return (0, AA3.createChecksumStream)(q);
        return new YA3.ChecksumStream(q)
    }
})
// @from(Ln 69207, Col 4)
Aj1 = p((Ce7) => {
    Object.defineProperty(Ce7, "__esModule", {
        value: !0
    });
    Ce7.ByteArrayCollector = void 0;
    class Se7 {
        allocByteArray;
        byteLength = 0;
        byteArrays = [];
        constructor(q) {
            this.allocByteArray = q
        }
        push(q) {
            this.byteArrays.push(q), this.byteLength += q.byteLength
        }
        flush() {
            if (this.byteArrays.length === 1) {
                let _ = this.byteArrays[0];
                return this.reset(), _
            }
            let q = this.allocByteArray(this.byteLength),
                K = 0;
            for (let _ = 0; _ < this.byteArrays.length; ++_) {
                let z = this.byteArrays[_];
                q.set(z, K), K += z.byteLength
            }
            return this.reset(), q
        }
        reset() {
            this.byteArrays = [], this.byteLength = 0
        }
    }
    Ce7.ByteArrayCollector = Se7
})
// @from(Ln 69241, Col 4)
pe7 = p((me7) => {
    Object.defineProperty(me7, "__esModule", {
        value: !0
    });
    me7.createBufferedReadable = void 0;
    me7.createBufferedReadableStream = Ie7;
    me7.merge = xe7;
    me7.flush = SP8;
    me7.sizeOf = Jv6;
    me7.modeOf = ue7;
    var $A3 = Aj1();

    function Ie7(q, K, _) {
        let z = q.getReader(),
            Y = !1,
            A = 0,
            O = ["", new $A3.ByteArrayCollector((j) => new Uint8Array(j))],
            w = -1,
            $ = async (j) => {
                let {
                    value: H,
                    done: J
                } = await z.read(), X = H;
                if (J) {
                    if (w !== -1) {
                        let M = SP8(O, w);
                        if (Jv6(M) > 0) j.enqueue(M)
                    }
                    j.close()
                } else {
                    let M = ue7(X, !1);
                    if (w !== M) {
                        if (w >= 0) j.enqueue(SP8(O, w));
                        w = M
                    }
                    if (w === -1) {
                        j.enqueue(X);
                        return
                    }
                    let P = Jv6(X);
                    A += P;
                    let W = Jv6(O[w]);
                    if (P >= K && W === 0) j.enqueue(X);
                    else {
                        let D = xe7(O, w, X);
                        if (!Y && A > K * 2) Y = !0, _?.warn(`@smithy/util-stream - stream chunk size ${P} is below threshold of ${K}, automatically buffering.`);
                        if (D >= K) j.enqueue(SP8(O, w));
                        else await $(j)
                    }
                }
            };
        return new ReadableStream({
            pull: $
        })
    }
    me7.createBufferedReadable = Ie7;

    function xe7(q, K, _) {
        switch (K) {
            case 0:
                return q[0] += _, Jv6(q[0]);
            case 1:
            case 2:
                return q[K].push(_), Jv6(q[K])
        }
    }

    function SP8(q, K) {
        switch (K) {
            case 0:
                let _ = q[0];
                return q[0] = "", _;
            case 1:
            case 2:
                return q[K].flush()
        }
        throw Error(`@smithy/util-stream - invalid index ${K} given to flush()`)
    }

    function Jv6(q) {
        return q?.byteLength ?? q?.length ?? 0
    }

    function ue7(q, K = !0) {
        if (K && typeof Buffer < "u" && q instanceof Buffer) return 2;
        if (q instanceof Uint8Array) return 1;
        if (typeof q === "string") return 0;
        return -1
    }
})
// @from(Ln 69331, Col 4)
Ue7 = p((ge7) => {
    Object.defineProperty(ge7, "__esModule", {
        value: !0
    });
    ge7.createBufferedReadable = DA3;
    var PA3 = d6("node:stream"),
        Fe7 = Aj1(),
        Qr = pe7(),
        WA3 = J76();

    function DA3(q, K, _) {
        if ((0, WA3.isReadableStream)(q)) return (0, Qr.createBufferedReadableStream)(q, K, _);
        let z = new PA3.Readable({
                read() {}
            }),
            Y = !1,
            A = 0,
            O = ["", new Fe7.ByteArrayCollector(($) => new Uint8Array($)), new Fe7.ByteArrayCollector(($) => Buffer.from(new Uint8Array($)))],
            w = -1;
        return q.on("data", ($) => {
            let j = (0, Qr.modeOf)($, !0);
            if (w !== j) {
                if (w >= 0) z.push((0, Qr.flush)(O, w));
                w = j
            }
            if (w === -1) {
                z.push($);
                return
            }
            let H = (0, Qr.sizeOf)($);
            A += H;
            let J = (0, Qr.sizeOf)(O[w]);
            if (H >= K && J === 0) z.push($);
            else {
                let X = (0, Qr.merge)(O, w, $);
                if (!Y && A > K * 2) Y = !0, _?.warn(`@smithy/util-stream - stream chunk size ${H} is below threshold of ${K}, automatically buffering.`);
                if (X >= K) z.push((0, Qr.flush)(O, w))
            }
        }), q.on("end", () => {
            if (w !== -1) {
                let $ = (0, Qr.flush)(O, w);
                if ((0, Qr.sizeOf)($) > 0) z.push($)
            }
            z.push(null)
        }), z
    }
})
// @from(Ln 69378, Col 4)
ce7 = p((Qe7) => {
    Object.defineProperty(Qe7, "__esModule", {
        value: !0
    });
    Qe7.getAwsChunkedEncodingStream = void 0;
    var fA3 = d6("stream"),
        GA3 = (q, K) => {
            let {
                base64Encoder: _,
                bodyLengthChecker: z,
                checksumAlgorithmFn: Y,
                checksumLocationName: A,
                streamHasher: O
            } = K, w = _ !== void 0 && Y !== void 0 && A !== void 0 && O !== void 0, $ = w ? O(Y, q) : void 0, j = new fA3.Readable({
                read: () => {}
            });
            return q.on("data", (H) => {
                let J = z(H) || 0;
                j.push(`${J.toString(16)}\r
`), j.push(H), j.push(`\r
`)
            }), q.on("end", async () => {
                if (j.push(`0\r
`), w) {
                    let H = _(await $);
                    j.push(`${A}:${H}\r
`), j.push(`\r
`)
                }
                j.push(null)
            }), j
        };
    Qe7.getAwsChunkedEncodingStream = GA3
})
// @from(Ln 69412, Col 4)
ne7 = p((le7) => {
    Object.defineProperty(le7, "__esModule", {
        value: !0
    });
    le7.headStream = vA3;
    async function vA3(q, K) {
        let _ = 0,
            z = [],
            Y = q.getReader(),
            A = !1;
        while (!A) {
            let {
                done: $,
                value: j
            } = await Y.read();
            if (j) z.push(j), _ += j?.byteLength ?? 0;
            if (_ >= K) break;
            A = $
        }
        Y.releaseLock();
        let O = new Uint8Array(Math.min(K, _)),
            w = 0;
        for (let $ of z) {
            if ($.byteLength > O.byteLength - w) {
                O.set($.subarray(0, O.byteLength - w), w);
                break
            } else O.set($, w);
            w += $.length
        }
        return O
    }
})
// @from(Ln 69444, Col 4)
ae7 = p((re7) => {
    Object.defineProperty(re7, "__esModule", {
        value: !0
    });
    re7.headStream = void 0;
    var VA3 = d6("stream"),
        kA3 = ne7(),
        NA3 = J76(),
        EA3 = (q, K) => {
            if ((0, NA3.isReadableStream)(q)) return (0, kA3.headStream)(q, K);
            return new Promise((_, z) => {
                let Y = new ie7;
                Y.limit = K, q.pipe(Y), q.on("error", (A) => {
                    Y.end(), z(A)
                }), Y.on("error", z), Y.on("finish", function() {
                    let A = new Uint8Array(Buffer.concat(this.buffers));
                    _(A)
                })
            })
        };
    re7.headStream = EA3;
    class ie7 extends VA3.Writable {
        buffers = [];
        limit = 1 / 0;
        bytesBuffered = 0;
        _write(q, K, _) {
            if (this.buffers.push(q), this.bytesBuffered += q.byteLength ?? 0, this.bytesBuffered >= this.limit) {
                let z = this.bytesBuffered - this.limit,
                    Y = this.buffers[this.buffers.length - 1];
                this.buffers[this.buffers.length - 1] = Y.subarray(0, Y.byteLength - z), this.emit("finish")
            }
            _()
        }
    }
})
// @from(Ln 69479, Col 4)
se7 = p((CA3) => {
    CA3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(CA3.HttpAuthLocation || (CA3.HttpAuthLocation = {}));
    CA3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(CA3.HttpApiKeyAuthLocation || (CA3.HttpApiKeyAuthLocation = {}));
    CA3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(CA3.EndpointURLScheme || (CA3.EndpointURLScheme = {}));
    CA3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(CA3.AlgorithmId || (CA3.AlgorithmId = {}));
    var yA3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => CA3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => CA3.AlgorithmId.MD5,
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
        LA3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        hA3 = (q) => {
            return yA3(q)
        },
        RA3 = (q) => {
            return LA3(q)
        };
    CA3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(CA3.FieldPosition || (CA3.FieldPosition = {}));
    var SA3 = "__smithy_context";
    CA3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(CA3.IniSectionType || (CA3.IniSectionType = {}));
    CA3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(CA3.RequestHandlerProtocol || (CA3.RequestHandlerProtocol = {}));
    CA3.SMITHY_CONTEXT_KEY = SA3;
    CA3.getDefaultClientConfiguration = hA3;
    CA3.resolveDefaultRuntimeConfig = RA3
})
// @from(Ln 69544, Col 4)
K6q = p((gA3) => {
    var uA3 = se7(),
        mA3 = (q) => {
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
        BA3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class te7 {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = uA3.FieldPosition.HEADER,
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
    class ee7 {
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
    class CP8 {
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
            let K = new CP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = pA3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return CP8.clone(this)
        }
    }

    function pA3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class q6q {
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

    function FA3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    gA3.Field = te7;
    gA3.Fields = ee7;
    gA3.HttpRequest = CP8;
    gA3.HttpResponse = q6q;
    gA3.getHttpHandlerExtensionConfiguration = mA3;
    gA3.isValidHostname = FA3;
    gA3.resolveHttpHandlerRuntimeConfig = BA3
})
// @from(Ln 69686, Col 4)
_6q = p((oA3) => {
    var rA3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    oA3.isArrayBuffer = rA3
})
// @from(Ln 69690, Col 4)
Mj1 = p((qO3) => {
    var sA3 = _6q(),
        Xj1 = d6("buffer"),
        tA3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!sA3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return Xj1.Buffer.from(q, K, _)
        },
        eA3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? Xj1.Buffer.from(q, K) : Xj1.Buffer.from(q)
        };
    qO3.fromArrayBuffer = tA3;
    qO3.fromString = eA3
})
// @from(Ln 69704, Col 4)
A6q = p((z6q) => {
    Object.defineProperty(z6q, "__esModule", {
        value: !0
    });
    z6q.fromBase64 = void 0;
    var zO3 = Mj1(),
        YO3 = /^[A-Za-z0-9+/]*={0,2}$/,
        AO3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!YO3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, zO3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    z6q.fromBase64 = AO3
})
// @from(Ln 69719, Col 4)
$6q = p((O6q) => {
    Object.defineProperty(O6q, "__esModule", {
        value: !0
    });
    O6q.toBase64 = void 0;
    var OO3 = Mj1(),
        wO3 = nw(),
        $O3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, wO3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, OO3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    O6q.toBase64 = $O3
})
// @from(Ln 69735, Col 4)
J6q = p((_c6) => {
    var j6q = A6q(),
        H6q = $6q();
    Object.keys(j6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(_c6, q)) Object.defineProperty(_c6, q, {
            enumerable: !0,
            get: function() {
                return j6q[q]
            }
        })
    });
    Object.keys(H6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(_c6, q)) Object.defineProperty(_c6, q, {
            enumerable: !0,
            get: function() {
                return H6q[q]
            }
        })
    })
})
// @from(Ln 69755, Col 4)
DO6 = p((DO3) => {
    var X6q = K6q(),
        jO3 = WP8(),
        HO3 = J6q();

    function M6q(q, K) {
        return new Request(q, K)
    }

    function JO3(q = 0) {
        return new Promise((K, _) => {
            if (q) setTimeout(() => {
                let z = Error(`Request did not complete within ${q} ms`);
                z.name = "TimeoutError", _(z)
            }, q)
        })
    }
    var bP8 = {
        supported: void 0
    };
    class Pj1 {
        config;
        configProvider;
        static create(q) {
            if (typeof q?.handle === "function") return q;
            return new Pj1(q)
        }
        constructor(q) {
            if (typeof q === "function") this.configProvider = q().then((K) => K || {});
            else this.config = q ?? {}, this.configProvider = Promise.resolve(this.config);
            if (bP8.supported === void 0) bP8.supported = Boolean(typeof Request < "u" && "keepalive" in M6q("https://[::1]"))
        }
        destroy() {}
        async handle(q, {
            abortSignal: K,
            requestTimeout: _
        } = {}) {
            if (!this.config) this.config = await this.configProvider;
            let z = _ ?? this.config.requestTimeout,
                Y = this.config.keepAlive === !0,
                A = this.config.credentials;
            if (K?.aborted) {
                let Z = Error("Request aborted");
                return Z.name = "AbortError", Promise.reject(Z)
            }
            let O = q.path,
                w = jO3.buildQueryString(q.query || {});
            if (w) O += `?${w}`;
            if (q.fragment) O += `#${q.fragment}`;
            let $ = "";
            if (q.username != null || q.password != null) {
                let Z = q.username ?? "",
                    G = q.password ?? "";
                $ = `${Z}:${G}@`
            }
            let {
                port: j,
                method: H
            } = q, J = `${q.protocol}//${$}${q.hostname}${j?`:${j}`:""}${O}`, X = H === "GET" || H === "HEAD" ? void 0 : q.body, M = {
                body: X,
                headers: new Headers(q.headers),
                method: H,
                credentials: A
            };
            if (this.config?.cache) M.cache = this.config.cache;
            if (X) M.duplex = "half";
            if (typeof AbortController < "u") M.signal = K;
            if (bP8.supported) M.keepalive = Y;
            if (typeof this.config.requestInit === "function") Object.assign(M, this.config.requestInit(q));
            let P = () => {},
                W = M6q(J, M),
                D = [fetch(W).then((Z) => {
                    let G = Z.headers,
                        f = {};
                    for (let V of G.entries()) f[V[0]] = V[1];
                    if (Z.body == null) return Z.blob().then((V) => ({
                        response: new X6q.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: V
                        })
                    }));
                    return {
                        response: new X6q.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: Z.body
                        })
                    }
                }), JO3(z)];
            if (K) D.push(new Promise((Z, G) => {
                let f = () => {
                    let v = Error("Request aborted");
                    v.name = "AbortError", G(v)
                };
                if (typeof K.addEventListener === "function") {
                    let v = K;
                    v.addEventListener("abort", f, {
                        once: !0
                    }), P = () => v.removeEventListener("abort", f)
                } else K.onabort = f
            }));
            return Promise.race(D).finally(P)
        }
        updateHttpClientConfig(q, K) {
            this.config = void 0, this.configProvider = this.configProvider.then((_) => {
                return _[q] = K, _
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
    }
    var XO3 = async (q) => {
        if (typeof Blob === "function" && q instanceof Blob || q.constructor?.name === "Blob") {
            if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await q.arrayBuffer());
            return MO3(q)
        }
        return PO3(q)
    };
    async function MO3(q) {
        let K = await WO3(q),
            _ = HO3.fromBase64(K);
        return new Uint8Array(_)
    }
    async function PO3(q) {
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

    function WO3(q) {
        return new Promise((K, _) => {
            let z = new FileReader;
            z.onloadend = () => {
                if (z.readyState !== 2) return _(Error("Reader aborted too early"));
                let Y = z.result ?? "",
                    A = Y.indexOf(","),
                    O = A > -1 ? A + 1 : Y.length;
                K(Y.substring(O))
            }, z.onabort = () => _(Error("Read aborted")), z.onerror = () => _(z.error), z.readAsDataURL(q)
        })
    }
    DO3.FetchHttpHandler = Pj1;
    DO3.keepAliveSupport = bP8;
    DO3.streamCollector = XO3
})
// @from(Ln 69917, Col 4)
W6q = p((VO3) => {
    var P6q = {},
        Wj1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        P6q[q] = K, Wj1[K] = q
    }

    function vO3(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in Wj1) K[_ / 2] = Wj1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }

    function TO3(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += P6q[q[_]];
        return K
    }
    VO3.fromHex = vO3;
    VO3.toHex = TO3
})
// @from(Ln 69945, Col 4)
T6q = p((G6q) => {
    Object.defineProperty(G6q, "__esModule", {
        value: !0
    });
    G6q.sdkStreamMixin = void 0;
    var EO3 = DO6(),
        yO3 = qc6(),
        LO3 = W6q(),
        hO3 = nw(),
        D6q = J76(),
        Z6q = "The stream has already been transformed.",
        RO3 = (q) => {
            if (!f6q(q) && !(0, D6q.isReadableStream)(q)) {
                let Y = q?.__proto__?.constructor?.name || q;
                throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${Y}`)
            }
            let K = !1,
                _ = async () => {
                    if (K) throw Error(Z6q);
                    return K = !0, await (0, EO3.streamCollector)(q)
                }, z = (Y) => {
                    if (typeof Y.stream !== "function") throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
                    return Y.stream()
                };
            return Object.assign(q, {
                transformToByteArray: _,
                transformToString: async (Y) => {
                    let A = await _();
                    if (Y === "base64") return (0, yO3.toBase64)(A);
                    else if (Y === "hex") return (0, LO3.toHex)(A);
                    else if (Y === void 0 || Y === "utf8" || Y === "utf-8") return (0, hO3.toUtf8)(A);
                    else if (typeof TextDecoder === "function") return new TextDecoder(Y).decode(A);
                    else throw Error("TextDecoder is not available, please make sure polyfill is provided.")
                },
                transformToWebStream: () => {
                    if (K) throw Error(Z6q);
                    if (K = !0, f6q(q)) return z(q);
                    else if ((0, D6q.isReadableStream)(q)) return q;
                    else throw Error(`Cannot transform payload to web stream, got ${q}`)
                }
            })
        };
    G6q.sdkStreamMixin = RO3;
    var f6q = (q) => typeof Blob === "function" && q instanceof Blob
})
// @from(Ln 69991, Col 4)
E6q = p((k6q) => {
    Object.defineProperty(k6q, "__esModule", {
        value: !0
    });
    k6q.sdkStreamMixin = void 0;
    var SO3 = wE(),
        CO3 = RP8(),
        Dj1 = d6("stream"),
        bO3 = T6q(),
        V6q = "The stream has already been transformed.",
        IO3 = (q) => {
            if (!(q instanceof Dj1.Readable)) try {
                return (0, bO3.sdkStreamMixin)(q)
            } catch (z) {
                let Y = q?.__proto__?.constructor?.name || q;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${Y}`)
            }
            let K = !1,
                _ = async () => {
                    if (K) throw Error(V6q);
                    return K = !0, await (0, SO3.streamCollector)(q)
                };
            return Object.assign(q, {
                transformToByteArray: _,
                transformToString: async (z) => {
                    let Y = await _();
                    if (z === void 0 || Buffer.isEncoding(z)) return (0, CO3.fromArrayBuffer)(Y.buffer, Y.byteOffset, Y.byteLength).toString(z);
                    else return new TextDecoder(z).decode(Y)
                },
                transformToWebStream: () => {
                    if (K) throw Error(V6q);
                    if (q.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof Dj1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
                    return K = !0, Dj1.Readable.toWeb(q)
                }
            })
        };
    k6q.sdkStreamMixin = IO3
})
// @from(Ln 70030, Col 4)
L6q = p((y6q) => {
    Object.defineProperty(y6q, "__esModule", {
        value: !0
    });
    y6q.splitStream = xO3;
    async function xO3(q) {
        if (typeof q.stream === "function") q = q.stream();
        return q.tee()
    }
})
// @from(Ln 70040, Col 4)
C6q = p((S6q) => {
    Object.defineProperty(S6q, "__esModule", {
        value: !0
    });
    S6q.splitStream = BO3;
    var h6q = d6("stream"),
        mO3 = L6q(),
        R6q = J76();
    async function BO3(q) {
        if ((0, R6q.isReadableStream)(q) || (0, R6q.isBlob)(q)) return (0, mO3.splitStream)(q);
        let K = new h6q.PassThrough,
            _ = new h6q.PassThrough;
        return q.pipe(K), q.pipe(_), [K, _]
    }
})
// @from(Ln 70055, Col 4)
Zj1 = p((nZ) => {
    var b6q = qc6(),
        I6q = nw(),
        x6q = Yj1(),
        u6q = Re7(),
        m6q = Ue7(),
        B6q = ce7(),
        p6q = ae7(),
        F6q = E6q(),
        g6q = C6q(),
        U6q = J76();
    class zc6 extends Uint8Array {
        static fromString(q, K = "utf-8") {
            if (typeof q === "string") {
                if (K === "base64") return zc6.mutate(b6q.fromBase64(q));
                return zc6.mutate(I6q.fromUtf8(q))
            }
            throw Error(`Unsupported conversion from ${typeof q} to Uint8ArrayBlobAdapter.`)
        }
        static mutate(q) {
            return Object.setPrototypeOf(q, zc6.prototype), q
        }
        transformToString(q = "utf-8") {
            if (q === "base64") return b6q.toBase64(this);
            return I6q.toUtf8(this)
        }
    }
    nZ.Uint8ArrayBlobAdapter = zc6;
    Object.keys(x6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return x6q[q]
            }
        })
    });
    Object.keys(u6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return u6q[q]
            }
        })
    });
    Object.keys(m6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return m6q[q]
            }
        })
    });
    Object.keys(B6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return B6q[q]
            }
        })
    });
    Object.keys(p6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return p6q[q]
            }
        })
    });
    Object.keys(F6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return F6q[q]
            }
        })
    });
    Object.keys(g6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return g6q[q]
            }
        })
    });
    Object.keys(U6q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(nZ, q)) Object.defineProperty(nZ, q, {
            enumerable: !0,
            get: function() {
                return U6q[q]
            }
        })
    })
})
// @from(Ln 70148, Col 4)
Nj1 = p((lO3) => {
    lO3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(lO3.HttpAuthLocation || (lO3.HttpAuthLocation = {}));
    lO3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(lO3.HttpApiKeyAuthLocation || (lO3.HttpApiKeyAuthLocation = {}));
    lO3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(lO3.EndpointURLScheme || (lO3.EndpointURLScheme = {}));
    lO3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(lO3.AlgorithmId || (lO3.AlgorithmId = {}));
    var gO3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => lO3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => lO3.AlgorithmId.MD5,
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
        UO3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        QO3 = (q) => {
            return gO3(q)
        },
        dO3 = (q) => {
            return UO3(q)
        };
    lO3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(lO3.FieldPosition || (lO3.FieldPosition = {}));
    var cO3 = "__smithy_context";
    lO3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(lO3.IniSectionType || (lO3.IniSectionType = {}));
    lO3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(lO3.RequestHandlerProtocol || (lO3.RequestHandlerProtocol = {}));
    lO3.SMITHY_CONTEXT_KEY = cO3;
    lO3.getDefaultClientConfiguration = QO3;
    lO3.resolveDefaultRuntimeConfig = dO3
})
// @from(Ln 70213, Col 4)
Ac6 = p((qw3) => {
    var oO3 = Nj1(),
        aO3 = (q) => {
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
        sO3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class Q6q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = oO3.FieldPosition.HEADER,
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
    class d6q {
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
    class IP8 {
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
            let K = new IP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = tO3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return IP8.clone(this)
        }
    }

    function tO3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class c6q {
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

    function eO3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    qw3.Field = Q6q;
    qw3.Fields = d6q;
    qw3.HttpRequest = IP8;
    qw3.HttpResponse = c6q;
    qw3.getHttpHandlerExtensionConfiguration = aO3;
    qw3.isValidHostname = eO3;
    qw3.resolveHttpHandlerRuntimeConfig = sO3
})
// @from(Ln 70355, Col 4)
l6q = p((Mw3) => {
    Mw3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Mw3.HttpAuthLocation || (Mw3.HttpAuthLocation = {}));
    Mw3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Mw3.HttpApiKeyAuthLocation || (Mw3.HttpApiKeyAuthLocation = {}));
    Mw3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(Mw3.EndpointURLScheme || (Mw3.EndpointURLScheme = {}));
    Mw3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(Mw3.AlgorithmId || (Mw3.AlgorithmId = {}));
    var $w3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => Mw3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => Mw3.AlgorithmId.MD5,
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
        jw3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        Hw3 = (q) => {
            return $w3(q)
        },
        Jw3 = (q) => {
            return jw3(q)
        };
    Mw3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(Mw3.FieldPosition || (Mw3.FieldPosition = {}));
    var Xw3 = "__smithy_context";
    Mw3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(Mw3.IniSectionType || (Mw3.IniSectionType = {}));
    Mw3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(Mw3.RequestHandlerProtocol || (Mw3.RequestHandlerProtocol = {}));
    Mw3.SMITHY_CONTEXT_KEY = Xw3;
    Mw3.getDefaultClientConfiguration = Hw3;
    Mw3.resolveDefaultRuntimeConfig = Jw3
})
// @from(Ln 70420, Col 4)
Dv = p((Gw3) => {
    var n6q = l6q(),
        Zw3 = (q) => q[n6q.SMITHY_CONTEXT_KEY] || (q[n6q.SMITHY_CONTEXT_KEY] = {}),
        fw3 = (q) => {
            if (typeof q === "function") return q;
            let K = Promise.resolve(q);
            return () => K
        };
    Gw3.getSmithyContext = Zw3;
    Gw3.normalizeProvider = fw3
})
// @from(Ln 70431, Col 4)
sj = p((xw3) => {
    var Vw3 = Ac6(),
        i6q = Dv(),
        xP8 = (q) => {
            if (typeof q === "function") return q();
            return q
        },
        Ij1 = (q, K, _, z, Y) => ({
            name: K,
            namespace: q,
            traits: _,
            input: z,
            output: Y
        }),
        kw3 = (q) => (K, _) => async (z) => {
            let {
                response: Y
            } = await K(z), {
                operationSchema: A
            } = i6q.getSmithyContext(_), [, O, w, $, j, H] = A ?? [];
            try {
                let J = await q.protocol.deserializeResponse(Ij1(O, w, $, j, H), {
                    ...q,
                    ..._
                }, Y);
                return {
                    response: Y,
                    output: J
                }
            } catch (J) {
                if (Object.defineProperty(J, "$response", {
                        value: Y,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in J)) {
                    try {
                        J.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch (M) {
                        if (!_.logger || _.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else _.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof J.$responseBodyText < "u") {
                        if (J.$response) J.$response.body = J.$responseBodyText
                    }
                    try {
                        if (Vw3.HttpResponse.isInstance(Y)) {
                            let {
                                headers: M = {}
                            } = Y, P = Object.entries(M);
                            J.$metadata = {
                                httpStatusCode: Y.statusCode,
                                requestId: Cj1(/^x-[\w-]+-request-?id$/, P),
                                extendedRequestId: Cj1(/^x-[\w-]+-id-2$/, P),
                                cfId: Cj1(/^x-[\w-]+-cf-id$/, P)
                            }
                        }
                    } catch (M) {}
                }
                throw J
            }
        }, Cj1 = (q, K) => {
            return (K.find(([_]) => {
                return _.match(q)
            }) || [void 0, void 0])[1]
        }, Nw3 = (q) => (K, _) => async (z) => {
            let {
                operationSchema: Y
            } = i6q.getSmithyContext(_), [, A, O, w, $, j] = Y ?? [], H = _.endpointV2?.url && q.urlParser ? async () => q.urlParser(_.endpointV2.url): q.endpoint, J = await q.protocol.serializeRequest(Ij1(A, O, w, $, j), z.input, {
                ...q,
                ..._,
                endpoint: H
            });
            return K({
                ...z,
                request: J
            })
        }, r6q = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, o6q = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function Ew3(q) {
        return {
            applyToStack: (K) => {
                K.add(Nw3(q), o6q), K.add(kw3(q), r6q), q.protocol.setSerdeContext(q)
            }
        }
    }
    class HE {
        name;
        namespace;
        traits;
        static assign(q, K) {
            return Object.assign(q, K)
        }
        static[Symbol.hasInstance](q) {
            let K = this.prototype.isPrototypeOf(q);
            if (!K && typeof q === "object" && q !== null) return q.symbol === this.symbol;
            return K
        }
        getName() {
            return this.namespace + "#" + this.name
        }
    }
    class uP8 extends HE {
        static symbol = Symbol.for("@smithy/lis");
        name;
        traits;
        valueSchema;
        symbol = uP8.symbol
    }
    var yw3 = (q, K, _, z) => HE.assign(new uP8, {
        name: K,
        namespace: q,
        traits: _,
        valueSchema: z
    });
    class mP8 extends HE {
        static symbol = Symbol.for("@smithy/map");
        name;
        traits;
        keySchema;
        valueSchema;
        symbol = mP8.symbol
    }
    var Lw3 = (q, K, _, z, Y) => HE.assign(new mP8, {
        name: K,
        namespace: q,
        traits: _,
        keySchema: z,
        valueSchema: Y
    });
    class BP8 extends HE {
        static symbol = Symbol.for("@smithy/ope");
        name;
        traits;
        input;
        output;
        symbol = BP8.symbol
    }
    var hw3 = (q, K, _, z, Y) => HE.assign(new BP8, {
        name: K,
        namespace: q,
        traits: _,
        input: z,
        output: Y
    });
    class jc6 extends HE {
        static symbol = Symbol.for("@smithy/str");
        name;
        traits;
        memberNames;
        memberList;
        symbol = jc6.symbol
    }
    var Rw3 = (q, K, _, z, Y) => HE.assign(new jc6, {
        name: K,
        namespace: q,
        traits: _,
        memberNames: z,
        memberList: Y
    });
    class pP8 extends jc6 {
        static symbol = Symbol.for("@smithy/err");
        ctor;
        symbol = pP8.symbol
    }
    var Sw3 = (q, K, _, z, Y, A) => HE.assign(new pP8, {
        name: K,
        namespace: q,
        traits: _,
        memberNames: z,
        memberList: Y,
        ctor: null
    });

    function $c6(q) {
        if (typeof q === "object") return q;
        q = q | 0;
        let K = {},
            _ = 0;
        for (let z of ["httpLabel", "idempotent", "idempotencyToken", "sensitive", "httpPayload", "httpResponseCode", "httpQueryParams"])
            if ((q >> _++ & 1) === 1) K[z] = 1;
        return K
    }
    class cr {
        ref;
        memberName;
        static symbol = Symbol.for("@smithy/nor");
        symbol = cr.symbol;
        name;
        schema;
        _isMemberSchema;
        traits;
        memberTraits;
        normalizedTraits;
        constructor(q, K) {
            this.ref = q, this.memberName = K;
            let _ = [],
                z = q,
                Y = q;
            this._isMemberSchema = !1;
            while (bj1(z)) _.push(z[1]), z = z[0], Y = xP8(z), this._isMemberSchema = !0;
            if (_.length > 0) {
                this.memberTraits = {};
                for (let A = _.length - 1; A >= 0; --A) {
                    let O = _[A];
                    Object.assign(this.memberTraits, $c6(O))
                }
            } else this.memberTraits = 0;
            if (Y instanceof cr) {
                let A = this.memberTraits;
                Object.assign(this, Y), this.memberTraits = Object.assign({}, A, Y.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = K ?? Y.memberName;
                return
            }
            if (this.schema = xP8(Y), a6q(this.schema)) this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3];
            else this.name = this.memberName ?? String(Y), this.traits = 0;
            if (this._isMemberSchema && !K) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`)
        }
        static[Symbol.hasInstance](q) {
            let K = this.prototype.isPrototypeOf(q);
            if (!K && typeof q === "object" && q !== null) return q.symbol === this.symbol;
            return K
        }
        static of (q) {
            let K = xP8(q);
            if (K instanceof cr) return K;
            if (bj1(K)) {
                let [_, z] = K;
                if (_ instanceof cr) return Object.assign(_.getMergedTraits(), $c6(z)), _;
                throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(q,null,2)}.`)
            }
            return new cr(K)
        }
        getSchema() {
            let q = this.schema;
            if (q[0] === 0) return q[4];
            return q
        }
        getName(q = !1) {
            let {
                name: K
            } = this;
            return !q && K && K.includes("#") ? K.split("#")[1] : K || void 0
        }
        getMemberName() {
            return this.memberName
        }
        isMemberSchema() {
            return this._isMemberSchema
        }
        isListSchema() {
            let q = this.getSchema();
            return typeof q === "number" ? q >= 64 && q < 128 : q[0] === 1
        }
        isMapSchema() {
            let q = this.getSchema();
            return typeof q === "number" ? q >= 128 && q <= 255 : q[0] === 2
        }
        isStructSchema() {
            let q = this.getSchema();
            return q[0] === 3 || q[0] === -3
        }
        isBlobSchema() {
            let q = this.getSchema();
            return q === 21 || q === 42
        }
        isTimestampSchema() {
            let q = this.getSchema();
            return typeof q === "number" && q >= 4 && q <= 7
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
                streaming: q
            } = this.getMergedTraits();
            return !!q || this.getSchema() === 42
        }
        isIdempotencyToken() {
            let q = (Y) => (Y & 4) === 4 || !!Y?.idempotencyToken,
                {
                    normalizedTraits: K,
                    traits: _,
                    memberTraits: z
                } = this;
            return q(K) || q(_) || q(z)
        }
        getMergedTraits() {
            return this.normalizedTraits ?? (this.normalizedTraits = {
                ...this.getOwnTraits(),
                ...this.getMemberTraits()
            })
        }
        getMemberTraits() {
            return $c6(this.memberTraits)
        }
        getOwnTraits() {
            return $c6(this.traits)
        }
        getKeySchema() {
            let [q, K] = [this.isDocumentSchema(), this.isMapSchema()];
            if (!q && !K) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
            let _ = this.getSchema(),
                z = q ? 15 : _[4] ?? 0;
            return wc6([z, 0], "key")
        }
        getValueSchema() {
            let q = this.getSchema(),
                [K, _, z] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()],
                Y = typeof q === "number" ? 63 & q : q && typeof q === "object" && (_ || z) ? q[3 + q[0]] : K ? 15 : void 0;
            if (Y != null) return wc6([Y, 0], _ ? "value" : "member");
            throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`)
        }
        getMemberSchema(q) {
            let K = this.getSchema();
            if (this.isStructSchema() && K[4].includes(q)) {
                let _ = K[4].indexOf(q),
                    z = K[5][_];
                return wc6(bj1(z) ? z : [z, 0], q)
            }
            if (this.isDocumentSchema()) return wc6([15, 0], q);
            throw Error(`@smithy/core/schema - ${this.getName(!0)} has no no member=${q}.`)
        }
        getMemberSchemas() {
            let q = {};
            try {
                for (let [K, _] of this.structIterator()) q[K] = _
            } catch (K) {}
            return q
        }
        getEventStreamMember() {
            if (this.isStructSchema()) {
                for (let [q, K] of this.structIterator())
                    if (K.isStreaming() && K.isStructSchema()) return q
            }
            return ""
        }* structIterator() {
            if (this.isUnitSchema()) return;
            if (!this.isStructSchema()) throw Error("@smithy/core/schema - cannot iterate non-struct schema.");
            let q = this.getSchema();
            for (let K = 0; K < q[4].length; ++K) yield [q[4][K], wc6([q[5][K], 0], q[4][K])]
        }
    }

    function wc6(q, K) {
        if (q instanceof cr) return Object.assign(q, {
            memberName: K,
            _isMemberSchema: !0
        });
        return new cr(q, K)
    }
    var bj1 = (q) => Array.isArray(q) && q.length === 2,
        a6q = (q) => Array.isArray(q) && q.length >= 5;
    class Hc6 extends HE {
        static symbol = Symbol.for("@smithy/sim");
        name;
        schemaRef;
        traits;
        symbol = Hc6.symbol
    }
    var Cw3 = (q, K, _, z) => HE.assign(new Hc6, {
            name: K,
            namespace: q,
            traits: z,
            schemaRef: _
        }),
        bw3 = (q, K, _, z) => HE.assign(new Hc6, {
            name: K,
            namespace: q,
            traits: _,
            schemaRef: z
        }),
        Iw3 = {
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
    class dr {
        namespace;
        schemas;
        exceptions;
        static registries = new Map;
        constructor(q, K = new Map, _ = new Map) {
            this.namespace = q, this.schemas = K, this.exceptions = _
        }
        static
        for (q) {
            if (!dr.registries.has(q)) dr.registries.set(q, new dr(q));
            return dr.registries.get(q)
        }
        register(q, K) {
            let _ = this.normalizeShapeId(q);
            dr.for(_.split("#")[0]).schemas.set(_, K)
        }
        getSchema(q) {
            let K = this.normalizeShapeId(q);
            if (!this.schemas.has(K)) throw Error(`@smithy/core/schema - schema not found for ${K}`);
            return this.schemas.get(K)
        }
        registerError(q, K) {
            let _ = q,
                z = dr.for(_[1]);
            z.schemas.set(_[1] + "#" + _[2], _), z.exceptions.set(_, K)
        }
        getErrorCtor(q) {
            let K = q;
            return dr.for(K[1]).exceptions.get(K)
        }
        getBaseException() {
            for (let q of this.exceptions.keys())
                if (Array.isArray(q)) {
                    let [, K, _] = q, z = K + "#" + _;
                    if (z.startsWith("smithy.ts.sdk.synthetic.") && z.endsWith("ServiceException")) return q
                } return
        }
        find(q) {
            return [...this.schemas.values()].find(q)
        }
        clear() {
            this.schemas.clear(), this.exceptions.clear()
        }
        normalizeShapeId(q) {
            if (q.includes("#")) return q;
            return this.namespace + "#" + q
        }
    }
    xw3.ErrorSchema = pP8;
    xw3.ListSchema = uP8;
    xw3.MapSchema = mP8;
    xw3.NormalizedSchema = cr;
    xw3.OperationSchema = BP8;
    xw3.SCHEMA = Iw3;
    xw3.Schema = HE;
    xw3.SimpleSchema = Hc6;
    xw3.StructureSchema = jc6;
    xw3.TypeRegistry = dr;
    xw3.deref = xP8;
    xw3.deserializerMiddlewareOption = r6q;
    xw3.error = Sw3;
    xw3.getSchemaSerdePlugin = Ew3;
    xw3.isStaticSchema = a6q;
    xw3.list = yw3;
    xw3.map = Lw3;
    xw3.op = hw3;
    xw3.operation = Ij1;
    xw3.serializerMiddlewareOption = o6q;
    xw3.sim = Cw3;
    xw3.simAdapter = bw3;
    xw3.struct = Rw3;
    xw3.translateTraits = $c6
})
// @from(Ln 70922, Col 4)
q8q = p((t6q) => {
    Object.defineProperty(t6q, "__esModule", {
        value: !0
    });
    t6q.randomUUID = void 0;
    var A23 = IV(),
        s6q = A23.__importDefault(d6("crypto"));
    t6q.randomUUID = s6q.default.randomUUID.bind(s6q.default)
})
// @from(Ln 70931, Col 4)
xj1 = p((w23) => {
    var K8q = q8q(),
        Zv = Array.from({
            length: 256
        }, (q, K) => K.toString(16).padStart(2, "0")),
        O23 = () => {
            if (K8q.randomUUID) return K8q.randomUUID();
            let q = new Uint8Array(16);
            return crypto.getRandomValues(q), q[6] = q[6] & 15 | 64, q[8] = q[8] & 63 | 128, Zv[q[0]] + Zv[q[1]] + Zv[q[2]] + Zv[q[3]] + "-" + Zv[q[4]] + Zv[q[5]] + "-" + Zv[q[6]] + Zv[q[7]] + "-" + Zv[q[8]] + Zv[q[9]] + "-" + Zv[q[10]] + Zv[q[11]] + Zv[q[12]] + Zv[q[13]] + Zv[q[14]] + Zv[q[15]]
        };
    w23.v4 = O23
})
// @from(Ln 70943, Col 4)
JE = p((H8q) => {
    var j23 = xj1(),
        H23 = (q, K, _ = (z) => z) => q,
        J23 = (q) => {
            switch (q) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${q}"`)
            }
        },
        X23 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "number") {
                if (q === 0 || q === 1) Pc6.warn(gP8(`Expected boolean, got ${typeof q}: ${q}`));
                if (q === 0) return !1;
                if (q === 1) return !0
            }
            if (typeof q === "string") {
                let K = q.toLowerCase();
                if (K === "false" || K === "true") Pc6.warn(gP8(`Expected boolean, got ${typeof q}: ${q}`));
                if (K === "false") return !1;
                if (K === "true") return !0
            }
            if (typeof q === "boolean") return q;
            throw TypeError(`Expected boolean, got ${typeof q}: ${q}`)
        },
        Xc6 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "string") {
                let K = parseFloat(q);
                if (!Number.isNaN(K)) {
                    if (String(K) !== String(q)) Pc6.warn(gP8(`Expected number but observed string: ${q}`));
                    return K
                }
            }
            if (typeof q === "number") return q;
            throw TypeError(`Expected number, got ${typeof q}: ${q}`)
        },
        M23 = Math.ceil(340282346638528860000000000000000000000),
        FP8 = (q) => {
            let K = Xc6(q);
            if (K !== void 0 && !Number.isNaN(K) && K !== 1 / 0 && K !== -1 / 0) {
                if (Math.abs(K) > M23) throw TypeError(`Expected 32-bit float, got ${q}`)
            }
            return K
        },
        Mc6 = (q) => {
            if (q === null || q === void 0) return;
            if (Number.isInteger(q) && !Number.isNaN(q)) return q;
            throw TypeError(`Expected integer, got ${typeof q}: ${q}`)
        },
        P23 = Mc6,
        mj1 = (q) => Fj1(q, 32),
        Bj1 = (q) => Fj1(q, 16),
        pj1 = (q) => Fj1(q, 8),
        Fj1 = (q, K) => {
            let _ = Mc6(q);
            if (_ !== void 0 && W23(_, K) !== _) throw TypeError(`Expected ${K}-bit integer, got ${q}`);
            return _
        },
        W23 = (q, K) => {
            switch (K) {
                case 32:
                    return Int32Array.of(q)[0];
                case 16:
                    return Int16Array.of(q)[0];
                case 8:
                    return Int8Array.of(q)[0]
            }
        },
        D23 = (q, K) => {
            if (q === null || q === void 0) {
                if (K) throw TypeError(`Expected a non-null value for ${K}`);
                throw TypeError("Expected a non-null value")
            }
            return q
        },
        z8q = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "object" && !Array.isArray(q)) return q;
            let K = Array.isArray(q) ? "array" : typeof q;
            throw TypeError(`Expected object, got ${K}: ${q}`)
        },
        Z23 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "string") return q;
            if (["boolean", "number", "bigint"].includes(typeof q)) return Pc6.warn(gP8(`Expected string, got ${typeof q}: ${q}`)), String(q);
            throw TypeError(`Expected string, got ${typeof q}: ${q}`)
        },
        f23 = (q) => {
            if (q === null || q === void 0) return;
            let K = z8q(q),
                _ = Object.entries(K).filter(([, z]) => z != null).map(([z]) => z);
            if (_.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (_.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${_} were not null.`);
            return K
        },
        gj1 = (q) => {
            if (typeof q == "string") return Xc6(Pv6(q));
            return Xc6(q)
        },
        G23 = gj1,
        Y8q = (q) => {
            if (typeof q == "string") return FP8(Pv6(q));
            return FP8(q)
        },
        v23 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        Pv6 = (q) => {
            let K = q.match(v23);
            if (K === null || K[0].length !== q.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(q)
        },
        Uj1 = (q) => {
            if (typeof q == "string") return A8q(q);
            return Xc6(q)
        },
        T23 = Uj1,
        V23 = Uj1,
        k23 = (q) => {
            if (typeof q == "string") return A8q(q);
            return FP8(q)
        },
        A8q = (q) => {
            switch (q) {
                case "NaN":
                    return NaN;
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                default:
                    throw Error(`Unable to parse float value: ${q}`)
            }
        },
        O8q = (q) => {
            if (typeof q === "string") return Mc6(Pv6(q));
            return Mc6(q)
        },
        N23 = O8q,
        E23 = (q) => {
            if (typeof q === "string") return mj1(Pv6(q));
            return mj1(q)
        },
        Xv6 = (q) => {
            if (typeof q === "string") return Bj1(Pv6(q));
            return Bj1(q)
        },
        w8q = (q) => {
            if (typeof q === "string") return pj1(Pv6(q));
            return pj1(q)
        },
        gP8 = (q) => {
            return String(TypeError(q).stack || q).split(`
`).slice(0, 5).filter((K) => !K.includes("stackTraceWarning")).join(`
`)
        },
        Pc6 = {
            warn: console.warn
        },
        y23 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        Qj1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function L23(q) {
        let K = q.getUTCFullYear(),
            _ = q.getUTCMonth(),
            z = q.getUTCDay(),
            Y = q.getUTCDate(),
            A = q.getUTCHours(),
            O = q.getUTCMinutes(),
            w = q.getUTCSeconds(),
            $ = Y < 10 ? `0${Y}` : `${Y}`,
            j = A < 10 ? `0${A}` : `${A}`,
            H = O < 10 ? `0${O}` : `${O}`,
            J = w < 10 ? `0${w}` : `${w}`;
        return `${y23[z]}, ${$} ${Qj1[_]} ${K} ${j}:${H}:${J} GMT`
    }
    var h23 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        R23 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let K = h23.exec(q);
            if (!K) throw TypeError("Invalid RFC-3339 date-time value");
            let [_, z, Y, A, O, w, $, j] = K, H = Xv6(Mv6(z)), J = UU(Y, "month", 1, 12), X = UU(A, "day", 1, 31);
            return Jc6(H, J, X, {
                hours: O,
                minutes: w,
                seconds: $,
                fractionalMilliseconds: j
            })
        },
        S23 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        C23 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let K = S23.exec(q);
            if (!K) throw TypeError("Invalid RFC-3339 date-time value");
            let [_, z, Y, A, O, w, $, j, H] = K, J = Xv6(Mv6(z)), X = UU(Y, "month", 1, 12), M = UU(A, "day", 1, 31), P = Jc6(J, X, M, {
                hours: O,
                minutes: w,
                seconds: $,
                fractionalMilliseconds: j
            });
            if (H.toUpperCase() != "Z") P.setTime(P.getTime() - c23(H));
            return P
        },
        b23 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        I23 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        x23 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        u23 = (q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let K = b23.exec(q);
            if (K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return Jc6(Xv6(Mv6(A)), uj1(Y), UU(z, "day", 1, 31), {
                    hours: O,
                    minutes: w,
                    seconds: $,
                    fractionalMilliseconds: j
                })
            }
            if (K = I23.exec(q), K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return F23(Jc6(B23(A), uj1(Y), UU(z, "day", 1, 31), {
                    hours: O,
                    minutes: w,
                    seconds: $,
                    fractionalMilliseconds: j
                }))
            }
            if (K = x23.exec(q), K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return Jc6(Xv6(Mv6(j)), uj1(z), UU(Y.trimLeft(), "day", 1, 31), {
                    hours: A,
                    minutes: O,
                    seconds: w,
                    fractionalMilliseconds: $
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        },
        m23 = (q) => {
            if (q === null || q === void 0) return;
            let K;
            if (typeof q === "number") K = q;
            else if (typeof q === "string") K = gj1(q);
            else if (typeof q === "object" && q.tag === 1) K = q.value;
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(K) || K === 1 / 0 || K === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(K * 1000))
        },
        Jc6 = (q, K, _, z) => {
            let Y = K - 1;
            return U23(q, Y, _), new Date(Date.UTC(q, Y, _, UU(z.hours, "hour", 0, 23), UU(z.minutes, "minute", 0, 59), UU(z.seconds, "seconds", 0, 60), d23(z.fractionalMilliseconds)))
        },
        B23 = (q) => {
            let K = new Date().getUTCFullYear(),
                _ = Math.floor(K / 100) * 100 + Xv6(Mv6(q));
            if (_ < K) return _ + 100;
            return _
        },
        p23 = 1576800000000,
        F23 = (q) => {
            if (q.getTime() - new Date().getTime() > p23) return new Date(Date.UTC(q.getUTCFullYear() - 100, q.getUTCMonth(), q.getUTCDate(), q.getUTCHours(), q.getUTCMinutes(), q.getUTCSeconds(), q.getUTCMilliseconds()));
            return q
        },
        uj1 = (q) => {
            let K = Qj1.indexOf(q);
            if (K < 0) throw TypeError(`Invalid month: ${q}`);
            return K + 1
        },
        g23 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        U23 = (q, K, _) => {
            let z = g23[K];
            if (K === 1 && Q23(q)) z = 29;
            if (_ > z) throw TypeError(`Invalid day for ${Qj1[K]} in ${q}: ${_}`)
        },
        Q23 = (q) => {
            return q % 4 === 0 && (q % 100 !== 0 || q % 400 === 0)
        },
        UU = (q, K, _, z) => {
            let Y = w8q(Mv6(q));
            if (Y < _ || Y > z) throw TypeError(`${K} must be between ${_} and ${z}, inclusive`);
            return Y
        },
        d23 = (q) => {
            if (q === null || q === void 0) return 0;
            return Y8q("0." + q) * 1000
        },
        c23 = (q) => {
            let K = q[0],
                _ = 1;
            if (K == "+") _ = 1;
            else if (K == "-") _ = -1;
            else throw TypeError(`Offset direction, ${K}, must be "+" or "-"`);
            let z = Number(q.substring(1, 3)),
                Y = Number(q.substring(4, 6));
            return _ * (z * 60 + Y) * 60 * 1000
        },
        Mv6 = (q) => {
            let K = 0;
            while (K < q.length - 1 && q.charAt(K) === "0") K++;
            if (K === 0) return q;
            return q.slice(K)
        },
        ZO6 = function(K) {
            return Object.assign(new String(K), {
                deserializeJSON() {
                    return JSON.parse(String(K))
                },
                toString() {
                    return String(K)
                },
                toJSON() {
                    return String(K)
                }
            })
        };
    ZO6.from = (q) => {
        if (q && typeof q === "object" && (q instanceof ZO6 || ("deserializeJSON" in q))) return q;
        else if (typeof q === "string" || Object.getPrototypeOf(q) === String.prototype) return ZO6(String(q));
        return ZO6(JSON.stringify(q))
    };
    ZO6.fromObject = ZO6.from;

    function l23(q) {
        if (q.includes(",") || q.includes('"')) q = `"${q.replace(/"/g,"\\\"")}"`;
        return q
    }
    var dj1 = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?",
        cj1 = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)",
        lj1 = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?",
        $8q = "(\\d?\\d)",
        j8q = "(\\d{4})",
        n23 = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/),
        i23 = new RegExp(`^${dj1}, ${$8q} ${cj1} ${j8q} ${lj1} GMT$`),
        r23 = new RegExp(`^${dj1}, ${$8q}-${cj1}-(\\d\\d) ${lj1} GMT$`),
        o23 = new RegExp(`^${dj1} ${cj1} ( [1-9]|\\d\\d) ${lj1} ${j8q}$`),
        a23 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        s23 = (q) => {
            if (q == null) return;
            let K = NaN;
            if (typeof q === "number") K = q;
            else if (typeof q === "string") {
                if (!/^-?\d*\.?\d+$/.test(q)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
                K = Number.parseFloat(q)
            } else if (typeof q === "object" && q.tag === 1) K = q.value;
            if (isNaN(K) || Math.abs(K) === 1 / 0) throw TypeError("Epoch timestamps must be valid finite numbers.");
            return new Date(Math.round(K * 1000))
        },
        t23 = (q) => {
            if (q == null) return;
            if (typeof q !== "string") throw TypeError("RFC3339 timestamps must be strings");
            let K = n23.exec(q);
            if (!K) throw TypeError(`Invalid RFC3339 timestamp format ${q}`);
            let [, _, z, Y, A, O, w, , $, j] = K;
            lr(z, 1, 12), lr(Y, 1, 31), lr(A, 0, 23), lr(O, 0, 59), lr(w, 0, 60);
            let H = new Date(Date.UTC(Number(_), Number(z) - 1, Number(Y), Number(A), Number(O), Number(w), Number($) ? Math.round(parseFloat(`0.${$}`) * 1000) : 0));
            if (H.setUTCFullYear(Number(_)), j.toUpperCase() != "Z") {
                let [, J, X, M] = /([+-])(\d\d):(\d\d)/.exec(j) || [void 0, "+", 0, 0], P = J === "-" ? 1 : -1;
                H.setTime(H.getTime() + P * (Number(X) * 60 * 60 * 1000 + Number(M) * 60 * 1000))
            }
            return H
        },
        e23 = (q) => {
            if (q == null) return;
            if (typeof q !== "string") throw TypeError("RFC7231 timestamps must be strings.");
            let K, _, z, Y, A, O, w, $;
            if ($ = i23.exec(q))[, K, _, z, Y, A, O, w] = $;
            else if ($ = r23.exec(q))[, K, _, z, Y, A, O, w] = $, z = (Number(z) + 1900).toString();
            else if ($ = o23.exec(q))[, _, K, Y, A, O, w, z] = $;
            if (z && O) {
                let j = Date.UTC(Number(z), a23.indexOf(_), Number(K), Number(Y), Number(A), Number(O), w ? Math.round(parseFloat(`0.${w}`) * 1000) : 0);
                lr(K, 1, 31), lr(Y, 0, 23), lr(A, 0, 59), lr(O, 0, 60);
                let H = new Date(j);
                return H.setUTCFullYear(Number(z)), H
            }
            throw TypeError(`Invalid RFC7231 date-time value ${q}.`)
        };

    function lr(q, K, _) {
        let z = Number(q);
        if (z < K || z > _) throw Error(`Value ${z} out of range [${K}, ${_}]`)
    }

    function q$3(q, K, _) {
        if (_ <= 0 || !Number.isInteger(_)) throw Error("Invalid number of delimiters (" + _ + ") for splitEvery.");
        let z = q.split(K);
        if (_ === 1) return z;
        let Y = [],
            A = "";
        for (let O = 0; O < z.length; O++) {
            if (A === "") A = z[O];
            else A += K + z[O];
            if ((O + 1) % _ === 0) Y.push(A), A = ""
        }
        if (A !== "") Y.push(A);
        return Y
    }
    var K$3 = (q) => {
            let K = q.length,
                _ = [],
                z = !1,
                Y = void 0,
                A = 0;
            for (let O = 0; O < K; ++O) {
                let w = q[O];
                switch (w) {
                    case '"':
                        if (Y !== "\\") z = !z;
                        break;
                    case ",":
                        if (!z) _.push(q.slice(A, O)), A = O + 1;
                        break
                }
                Y = w
            }
            return _.push(q.slice(A)), _.map((O) => {
                O = O.trim();
                let w = O.length;
                if (w < 2) return O;
                if (O[0] === '"' && O[w - 1] === '"') O = O.slice(1, w - 1);
                return O.replace(/\\"/g, '"')
            })
        },
        _8q = /^-?\d*(\.\d+)?$/;
    class UP8 {
        string;
        type;
        constructor(q, K) {
            if (this.string = q, this.type = K, !_8q.test(q)) throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".')
        }
        toString() {
            return this.string
        }
        static[Symbol.hasInstance](q) {
            if (!q || typeof q !== "object") return !1;
            let K = q;
            return UP8.prototype.isPrototypeOf(q) || K.type === "bigDecimal" && _8q.test(K.string)
        }
    }

    function _$3(q) {
        return new UP8(String(q), "bigDecimal")
    }
    Object.defineProperty(H8q, "generateIdempotencyToken", {
        enumerable: !0,
        get: function() {
            return j23.v4
        }
    });
    H8q.LazyJsonString = ZO6;
    H8q.NumericValue = UP8;
    H8q._parseEpochTimestamp = s23;
    H8q._parseRfc3339DateTimeWithOffset = t23;
    H8q._parseRfc7231DateTime = e23;
    H8q.copyDocumentWithTransform = H23;
    H8q.dateToUtcString = L23;
    H8q.expectBoolean = X23;
    H8q.expectByte = pj1;
    H8q.expectFloat32 = FP8;
    H8q.expectInt = P23;
    H8q.expectInt32 = mj1;
    H8q.expectLong = Mc6;
    H8q.expectNonNull = D23;
    H8q.expectNumber = Xc6;
    H8q.expectObject = z8q;
    H8q.expectShort = Bj1;
    H8q.expectString = Z23;
    H8q.expectUnion = f23;
    H8q.handleFloat = T23;
    H8q.limitedParseDouble = Uj1;
    H8q.limitedParseFloat = V23;
    H8q.limitedParseFloat32 = k23;
    H8q.logger = Pc6;
    H8q.nv = _$3;
    H8q.parseBoolean = J23;
    H8q.parseEpochTimestamp = m23;
    H8q.parseRfc3339DateTime = R23;
    H8q.parseRfc3339DateTimeWithOffset = C23;
    H8q.parseRfc7231DateTime = u23;
    H8q.quoteHeader = l23;
    H8q.splitEvery = q$3;
    H8q.splitHeader = K$3;
    H8q.strictParseByte = w8q;
    H8q.strictParseDouble = gj1;
    H8q.strictParseFloat = G23;
    H8q.strictParseFloat32 = Y8q;
    H8q.strictParseInt = N23;
    H8q.strictParseInt32 = E23;
    H8q.strictParseLong = O8q;
    H8q.strictParseShort = Xv6
})
// @from(Ln 71439, Col 4)
J8q = p((l$3) => {
    var c$3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    l$3.isArrayBuffer = c$3
})
// @from(Ln 71443, Col 4)
ij1 = p((a$3) => {
    var i$3 = J8q(),
        nj1 = d6("buffer"),
        r$3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!i$3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return nj1.Buffer.from(q, K, _)
        },
        o$3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? nj1.Buffer.from(q, K) : nj1.Buffer.from(q)
        };
    a$3.fromArrayBuffer = r$3;
    a$3.fromString = o$3
})
// @from(Ln 71457, Col 4)
P8q = p((X8q) => {
    Object.defineProperty(X8q, "__esModule", {
        value: !0
    });
    X8q.fromBase64 = void 0;
    var e$3 = ij1(),
        qj3 = /^[A-Za-z0-9+/]*={0,2}$/,
        Kj3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!qj3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, e$3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    X8q.fromBase64 = Kj3
})
// @from(Ln 71472, Col 4)
Z8q = p((W8q) => {
    Object.defineProperty(W8q, "__esModule", {
        value: !0
    });
    W8q.toBase64 = void 0;
    var _j3 = ij1(),
        zj3 = nw(),
        Yj3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, zj3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, _j3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    W8q.toBase64 = Yj3
})
// @from(Ln 71488, Col 4)
rj1 = p((Wc6) => {
    var f8q = P8q(),
        G8q = Z8q();
    Object.keys(f8q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Wc6, q)) Object.defineProperty(Wc6, q, {
            enumerable: !0,
            get: function() {
                return f8q[q]
            }
        })
    });
    Object.keys(G8q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Wc6, q)) Object.defineProperty(Wc6, q, {
            enumerable: !0,
            get: function() {
                return G8q[q]
            }
        })
    })
})
// @from(Ln 71508, Col 4)
V8q = p((Aj3) => {
    var v8q = nw();
    class T8q {
        marshaller;
        serializer;
        deserializer;
        serdeContext;
        defaultContentType;
        constructor({
            marshaller: q,
            serializer: K,
            deserializer: _,
            serdeContext: z,
            defaultContentType: Y
        }) {
            this.marshaller = q, this.serializer = K, this.deserializer = _, this.serdeContext = z, this.defaultContentType = Y
        }
        async serializeEventStream({
            eventStream: q,
            requestSchema: K,
            initialRequest: _
        }) {
            let z = this.marshaller,
                Y = K.getEventStreamMember(),
                A = K.getMemberSchema(Y),
                O = this.serializer,
                w = this.defaultContentType,
                $ = Symbol("initialRequestMarker"),
                j = {
                    async * [Symbol.asyncIterator]() {
                        if (_) {
                            let H = {
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
                                    value: w
                                }
                            };
                            O.write(K, _);
                            let J = O.flush();
                            yield {
                                [$]: !0, headers: H, body: J
                            }
                        }
                        for await (let H of q) yield H
                    }
                };
            return z.serialize(j, (H) => {
                if (H[$]) return {
                    headers: H.headers,
                    body: H.body
                };
                let J = Object.keys(H).find((Z) => {
                        return Z !== "__type"
                    }) ?? "",
                    {
                        additionalHeaders: X,
                        body: M,
                        eventType: P,
                        explicitPayloadContentType: W
                    } = this.writeEventBody(J, A, H);
                return {
                    headers: {
                        ":event-type": {
                            type: "string",
                            value: P
                        },
                        ":message-type": {
                            type: "string",
                            value: "event"
                        },
                        ":content-type": {
                            type: "string",
                            value: W ?? w
                        },
                        ...X
                    },
                    body: M
                }
            })
        }
        async deserializeEventStream({
            response: q,
            responseSchema: K,
            initialResponseContainer: _
        }) {
            let z = this.marshaller,
                Y = K.getEventStreamMember(),
                O = K.getMemberSchema(Y).getMemberSchemas(),
                w = Symbol("initialResponseMarker"),
                $ = z.deserialize(q.body, async (J) => {
                    let X = Object.keys(J).find((P) => {
                            return P !== "__type"
                        }) ?? "",
                        M = J[X].body;
                    if (X === "initial-response") {
                        let P = await this.deserializer.read(K, M);
                        return delete P[Y], {
                            [w]: !0,
                            ...P
                        }
                    } else if (X in O) {
                        let P = O[X];
                        if (P.isStructSchema()) {
                            let W = {},
                                D = !1;
                            for (let [Z, G] of P.structIterator()) {
                                let {
                                    eventHeader: f,
                                    eventPayload: v
                                } = G.getMergedTraits();
                                if (D = D || Boolean(f || v), v) {
                                    if (G.isBlobSchema()) W[Z] = M;
                                    else if (G.isStringSchema()) W[Z] = (this.serdeContext?.utf8Encoder ?? v8q.toUtf8)(M);
                                    else if (G.isStructSchema()) W[Z] = await this.deserializer.read(G, M)
                                } else if (f) {
                                    let V = J[X].headers[Z]?.value;
                                    if (V != null)
                                        if (G.isNumericSchema())
                                            if (V && typeof V === "object" && "bytes" in V) W[Z] = BigInt(V.toString());
                                            else W[Z] = Number(V);
                                    else W[Z] = V
                                }
                            }
                            if (D) return {
                                [X]: W
                            }
                        }
                        return {
                            [X]: await this.deserializer.read(P, M)
                        }
                    } else return {
                        $unknown: J
                    }
                }),
                j = $[Symbol.asyncIterator](),
                H = await j.next();
            if (H.done) return $;
            if (H.value?.[w]) {
                if (!K) throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
                for (let [J, X] of Object.entries(H.value)) _[J] = X
            }
            return {
                async * [Symbol.asyncIterator]() {
                    if (!H?.value?.[w]) yield H.value;
                    while (!0) {
                        let {
                            done: J,
                            value: X
                        } = await j.next();
                        if (J) break;
                        yield X
                    }
                }
            }
        }
        writeEventBody(q, K, _) {
            let z = this.serializer,
                Y = q,
                A = null,
                O, w = (() => {
                    return K.getSchema()[4].includes(q)
                })(),
                $ = {};
            if (!w) {
                let [J, X] = _[q];
                Y = J, z.write(15, X)
            } else {
                let J = K.getMemberSchema(q);
                if (J.isStructSchema()) {
                    for (let [X, M] of J.structIterator()) {
                        let {
                            eventHeader: P,
                            eventPayload: W
                        } = M.getMergedTraits();
                        if (W) {
                            A = X;
                            break
                        } else if (P) {
                            let D = _[q][X],
                                Z = "binary";
                            if (M.isNumericSchema())
                                if (-2147483648 <= D && D <= 2147483647) Z = "integer";
                                else Z = "long";
                            else if (M.isTimestampSchema()) Z = "timestamp";
                            else if (M.isStringSchema()) Z = "string";
                            else if (M.isBooleanSchema()) Z = "boolean";
                            if (D != null) $[X] = {
                                type: Z,
                                value: D
                            }, delete _[q][X]
                        }
                    }
                    if (A !== null) {
                        let X = J.getMemberSchema(A);
                        if (X.isBlobSchema()) O = "application/octet-stream";
                        else if (X.isStringSchema()) O = "text/plain";
                        z.write(X, _[q][A])
                    } else z.write(J, _[q])
                } else throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.")
            }
            let j = z.flush();
            return {
                body: typeof j === "string" ? (this.serdeContext?.utf8Decoder ?? v8q.fromUtf8)(j) : j,
                eventType: Y,
                explicitPayloadContentType: O,
                additionalHeaders: $
            }
        }
    }
    Aj3.EventStreamSerde = T8q
})