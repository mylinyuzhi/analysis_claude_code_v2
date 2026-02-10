
// @from(Ln 99939, Col 4)
OU8 = R((_n3) => {
    _n3.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(_n3.HttpAuthLocation || (_n3.HttpAuthLocation = {}));
    _n3.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(_n3.HttpApiKeyAuthLocation || (_n3.HttpApiKeyAuthLocation = {}));
    _n3.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(_n3.EndpointURLScheme || (_n3.EndpointURLScheme = {}));
    _n3.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(_n3.AlgorithmId || (_n3.AlgorithmId = {}));
    var zn3 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => _n3.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => _n3.AlgorithmId.MD5,
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
        wn3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        Hn3 = (A) => {
            return zn3(A)
        },
        $n3 = (A) => {
            return wn3(A)
        };
    _n3.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(_n3.FieldPosition || (_n3.FieldPosition = {}));
    var On3 = "__smithy_context";
    _n3.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(_n3.IniSectionType || (_n3.IniSectionType = {}));
    _n3.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(_n3.RequestHandlerProtocol || (_n3.RequestHandlerProtocol = {}));
    _n3.SMITHY_CONTEXT_KEY = On3;
    _n3.getDefaultClientConfiguration = Hn3;
    _n3.resolveDefaultRuntimeConfig = $n3
})
// @from(Ln 100004, Col 4)
DU8 = R((Zn3) => {
    var jn3 = OU8(),
        Mn3 = (A) => {
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
        Pn3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class _U8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = jn3.FieldPosition.HEADER,
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
    class JU8 {
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
    class w86 {
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
            let q = new w86({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = Wn3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return w86.clone(this)
        }
    }

    function Wn3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class XU8 {
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

    function Gn3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Zn3.Field = _U8;
    Zn3.Fields = JU8;
    Zn3.HttpRequest = w86;
    Zn3.HttpResponse = XU8;
    Zn3.getHttpHandlerExtensionConfiguration = Mn3;
    Zn3.isValidHostname = Gn3;
    Zn3.resolveHttpHandlerRuntimeConfig = Pn3
})
// @from(Ln 100146, Col 4)
ZU8 = R((yn3) => {
    var jU8 = DU8();

    function Ln3(A) {
        let {
            signer: q,
            signer: K
        } = A, Y = Object.assign(A, {
            eventSigner: q,
            messageSigner: K
        }), z = Y.eventStreamPayloadHandlerProvider(Y);
        return Object.assign(Y, {
            eventStreamPayloadHandler: z
        })
    }
    var MU8 = (A) => (q, K) => async (Y) => {
        let {
            request: z
        } = Y;
        if (!jU8.HttpRequest.isInstance(z)) return q(Y);
        return A.eventStreamPayloadHandler.handle(q, Y, K)
    }, PU8 = {
        tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
        name: "eventStreamHandlingMiddleware",
        relation: "after",
        toMiddleware: "awsAuthMiddleware",
        override: !0
    }, WU8 = (A) => async (q) => {
        let {
            request: K
        } = q;
        if (!jU8.HttpRequest.isInstance(K)) return A(q);
        return K.headers = {
            ...K.headers,
            "content-type": "application/vnd.amazon.eventstream",
            "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
        }, A({
            ...q,
            request: K
        })
    }, GU8 = {
        step: "build",
        tags: ["EVENT_STREAM", "HEADER", "CONTENT_TYPE", "CONTENT_SHA256"],
        name: "eventStreamHeaderMiddleware",
        override: !0
    }, Rn3 = (A) => ({
        applyToStack: (q) => {
            q.addRelativeTo(MU8(A), PU8), q.add(WU8, GU8)
        }
    });
    yn3.eventStreamHandlingMiddleware = MU8;
    yn3.eventStreamHandlingMiddlewareOptions = PU8;
    yn3.eventStreamHeaderMiddleware = WU8;
    yn3.eventStreamHeaderMiddlewareOptions = GU8;
    yn3.getEventStreamPlugin = Rn3;
    yn3.resolveEventStreamConfig = Ln3
})
// @from(Ln 100203, Col 4)
NU8 = R((jq2, VU8) => {
    var {
        defineProperty: H86,
        getOwnPropertyDescriptor: un3,
        getOwnPropertyNames: Bn3
    } = Object, mn3 = Object.prototype.hasOwnProperty, Fn3 = (A, q) => H86(A, "name", {
        value: q,
        configurable: !0
    }), Qn3 = (A, q) => {
        for (var K in q) H86(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, gn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Bn3(q))
                if (!mn3.call(A, z) && z !== K) H86(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = un3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Un3 = (A) => gn3(H86({}, "__esModule", {
        value: !0
    }), A), fU8 = {};
    Qn3(fU8, {
        isArrayBuffer: () => pn3
    });
    VU8.exports = Un3(fU8);
    var pn3 = Fn3((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 100234, Col 4)
M81 = R((Mq2, EU8) => {
    var {
        defineProperty: $86,
        getOwnPropertyDescriptor: dn3,
        getOwnPropertyNames: cn3
    } = Object, ln3 = Object.prototype.hasOwnProperty, TU8 = (A, q) => $86(A, "name", {
        value: q,
        configurable: !0
    }), in3 = (A, q) => {
        for (var K in q) $86(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, nn3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of cn3(q))
                if (!ln3.call(A, z) && z !== K) $86(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = dn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, rn3 = (A) => nn3($86({}, "__esModule", {
        value: !0
    }), A), vU8 = {};
    in3(vU8, {
        fromArrayBuffer: () => an3,
        fromString: () => sn3
    });
    EU8.exports = rn3(vU8);
    var on3 = NU8(),
        gt6 = h1("buffer"),
        an3 = TU8((A, q = 0, K = A.byteLength - q) => {
            if (!(0, on3.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return gt6.Buffer.from(A, q, K)
        }, "fromArrayBuffer"),
        sn3 = TU8((A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? gt6.Buffer.from(A, q) : gt6.Buffer.from(A)
        }, "fromString")
})
// @from(Ln 100275, Col 4)
CU8 = R((Pq2, yU8) => {
    var {
        defineProperty: O86,
        getOwnPropertyDescriptor: tn3,
        getOwnPropertyNames: en3
    } = Object, Ar3 = Object.prototype.hasOwnProperty, Ut6 = (A, q) => O86(A, "name", {
        value: q,
        configurable: !0
    }), qr3 = (A, q) => {
        for (var K in q) O86(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Kr3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of en3(q))
                if (!Ar3.call(A, z) && z !== K) O86(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = tn3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Yr3 = (A) => Kr3(O86({}, "__esModule", {
        value: !0
    }), A), kU8 = {};
    qr3(kU8, {
        fromUtf8: () => RU8,
        toUint8Array: () => zr3,
        toUtf8: () => wr3
    });
    yU8.exports = Yr3(kU8);
    var LU8 = M81(),
        RU8 = Ut6((A) => {
            let q = (0, LU8.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        zr3 = Ut6((A) => {
            if (typeof A === "string") return RU8(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        wr3 = Ut6((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, LU8.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 100322, Col 4)
IU8 = R((SU8) => {
    Object.defineProperty(SU8, "__esModule", {
        value: !0
    });
    SU8.convertToBuffer = void 0;
    var Hr3 = CU8(),
        $r3 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : Hr3.fromUtf8;

    function Or3(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return $r3(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    SU8.convertToBuffer = Or3
})
// @from(Ln 100340, Col 4)
uU8 = R((xU8) => {
    Object.defineProperty(xU8, "__esModule", {
        value: !0
    });
    xU8.isEmptyData = void 0;

    function _r3(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    xU8.isEmptyData = _r3
})
// @from(Ln 100352, Col 4)
FU8 = R((BU8) => {
    Object.defineProperty(BU8, "__esModule", {
        value: !0
    });
    BU8.numToUint8 = void 0;

    function Jr3(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    BU8.numToUint8 = Jr3
})
// @from(Ln 100363, Col 4)
UU8 = R((QU8) => {
    Object.defineProperty(QU8, "__esModule", {
        value: !0
    });
    QU8.uint32ArrayFrom = void 0;

    function Xr3(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    QU8.uint32ArrayFrom = Xr3
})
// @from(Ln 100380, Col 4)
pt6 = R((PO1) => {
    Object.defineProperty(PO1, "__esModule", {
        value: !0
    });
    PO1.uint32ArrayFrom = PO1.numToUint8 = PO1.isEmptyData = PO1.convertToBuffer = void 0;
    var Dr3 = IU8();
    Object.defineProperty(PO1, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return Dr3.convertToBuffer
        }
    });
    var jr3 = uU8();
    Object.defineProperty(PO1, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return jr3.isEmptyData
        }
    });
    var Mr3 = FU8();
    Object.defineProperty(PO1, "numToUint8", {
        enumerable: !0,
        get: function() {
            return Mr3.numToUint8
        }
    });
    var Pr3 = UU8();
    Object.defineProperty(PO1, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return Pr3.uint32ArrayFrom
        }
    })
})
// @from(Ln 100414, Col 4)
iU8 = R((cU8) => {
    Object.defineProperty(cU8, "__esModule", {
        value: !0
    });
    cU8.AwsCrc32 = void 0;
    var pU8 = n2(),
        dt6 = pt6(),
        dU8 = ct6(),
        Gr3 = function() {
            function A() {
                this.crc32 = new dU8.Crc32
            }
            return A.prototype.update = function(q) {
                if ((0, dt6.isEmptyData)(q)) return;
                this.crc32.update((0, dt6.convertToBuffer)(q))
            }, A.prototype.digest = function() {
                return pU8.__awaiter(this, void 0, void 0, function() {
                    return pU8.__generator(this, function(q) {
                        return [2, (0, dt6.numToUint8)(this.crc32.digest())]
                    })
                })
            }, A.prototype.reset = function() {
                this.crc32 = new dU8.Crc32
            }, A
        }();
    cU8.AwsCrc32 = Gr3
})
// @from(Ln 100441, Col 4)
ct6 = R((lt6) => {
    Object.defineProperty(lt6, "__esModule", {
        value: !0
    });
    lt6.AwsCrc32 = lt6.Crc32 = lt6.crc32 = void 0;
    var Zr3 = n2(),
        fr3 = pt6();

    function Vr3(A) {
        return new nU8().update(A).digest()
    }
    lt6.crc32 = Vr3;
    var nU8 = function() {
        function A() {
            this.checksum = 4294967295
        }
        return A.prototype.update = function(q) {
            var K, Y;
            try {
                for (var z = Zr3.__values(q), w = z.next(); !w.done; w = z.next()) {
                    var H = w.value;
                    this.checksum = this.checksum >>> 8 ^ Tr3[(this.checksum ^ H) & 255]
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
    lt6.Crc32 = nU8;
    var Nr3 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        Tr3 = (0, fr3.uint32ArrayFrom)(Nr3),
        vr3 = iU8();
    Object.defineProperty(lt6, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return vr3.AwsCrc32
        }
    })
})
// @from(Ln 100491, Col 4)
oU8 = R((Cr3) => {
    var rU8 = {},
        it6 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        rU8[A] = q, it6[q] = A
    }

    function Rr3(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in it6) q[K / 2] = it6[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function yr3(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += rU8[A[K]];
        return q
    }
    Cr3.fromHex = Rr3;
    Cr3.toHex = yr3
})
// @from(Ln 100519, Col 4)
uL1 = R((dr3) => {
    var tU8 = ct6(),
        P81 = oU8();
    class WO1 {
        bytes;
        constructor(A) {
            if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(A) {
            if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
            let q = new Uint8Array(8);
            for (let K = 7, Y = Math.abs(Math.round(A)); K > -1 && Y > 0; K--, Y /= 256) q[K] = Y;
            if (A < 0) aU8(q);
            return new WO1(q)
        }
        valueOf() {
            let A = this.bytes.slice(0),
                q = A[0] & 128;
            if (q) aU8(A);
            return parseInt(P81.toHex(A), 16) * (q ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function aU8(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    class nt6 {
        toUtf8;
        fromUtf8;
        constructor(A, q) {
            this.toUtf8 = A, this.fromUtf8 = q
        }
        format(A) {
            let q = [];
            for (let z of Object.keys(A)) {
                let w = this.fromUtf8(z);
                q.push(Uint8Array.from([w.byteLength]), w, this.formatHeaderValue(A[z]))
            }
            let K = new Uint8Array(q.reduce((z, w) => z + w.byteLength, 0)),
                Y = 0;
            for (let z of q) K.set(z, Y), Y += z.byteLength;
            return K
        }
        formatHeaderValue(A) {
            switch (A.type) {
                case "boolean":
                    return Uint8Array.from([A.value ? 0 : 1]);
                case "byte":
                    return Uint8Array.from([2, A.value]);
                case "short":
                    let q = new DataView(new ArrayBuffer(3));
                    return q.setUint8(0, 3), q.setInt16(1, A.value, !1), new Uint8Array(q.buffer);
                case "integer":
                    let K = new DataView(new ArrayBuffer(5));
                    return K.setUint8(0, 4), K.setInt32(1, A.value, !1), new Uint8Array(K.buffer);
                case "long":
                    let Y = new Uint8Array(9);
                    return Y[0] = 5, Y.set(A.value.bytes, 1), Y;
                case "binary":
                    let z = new DataView(new ArrayBuffer(3 + A.value.byteLength));
                    z.setUint8(0, 6), z.setUint16(1, A.value.byteLength, !1);
                    let w = new Uint8Array(z.buffer);
                    return w.set(A.value, 3), w;
                case "string":
                    let H = this.fromUtf8(A.value),
                        $ = new DataView(new ArrayBuffer(3 + H.byteLength));
                    $.setUint8(0, 7), $.setUint16(1, H.byteLength, !1);
                    let O = new Uint8Array($.buffer);
                    return O.set(H, 3), O;
                case "timestamp":
                    let _ = new Uint8Array(9);
                    return _[0] = 8, _.set(WO1.fromNumber(A.value.valueOf()).bytes, 1), _;
                case "uuid":
                    if (!gr3.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
                    let J = new Uint8Array(17);
                    return J[0] = 9, J.set(P81.fromHex(A.value.replace(/\-/g, "")), 1), J
            }
        }
        parse(A) {
            let q = {},
                K = 0;
            while (K < A.byteLength) {
                let Y = A.getUint8(K++),
                    z = this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + K, Y));
                switch (K += Y, A.getUint8(K++)) {
                    case 0:
                        q[z] = {
                            type: sU8,
                            value: !0
                        };
                        break;
                    case 1:
                        q[z] = {
                            type: sU8,
                            value: !1
                        };
                        break;
                    case 2:
                        q[z] = {
                            type: Ir3,
                            value: A.getInt8(K++)
                        };
                        break;
                    case 3:
                        q[z] = {
                            type: xr3,
                            value: A.getInt16(K, !1)
                        }, K += 2;
                        break;
                    case 4:
                        q[z] = {
                            type: br3,
                            value: A.getInt32(K, !1)
                        }, K += 4;
                        break;
                    case 5:
                        q[z] = {
                            type: ur3,
                            value: new WO1(new Uint8Array(A.buffer, A.byteOffset + K, 8))
                        }, K += 8;
                        break;
                    case 6:
                        let w = A.getUint16(K, !1);
                        K += 2, q[z] = {
                            type: Br3,
                            value: new Uint8Array(A.buffer, A.byteOffset + K, w)
                        }, K += w;
                        break;
                    case 7:
                        let H = A.getUint16(K, !1);
                        K += 2, q[z] = {
                            type: mr3,
                            value: this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + K, H))
                        }, K += H;
                        break;
                    case 8:
                        q[z] = {
                            type: Fr3,
                            value: new Date(new WO1(new Uint8Array(A.buffer, A.byteOffset + K, 8)).valueOf())
                        }, K += 8;
                        break;
                    case 9:
                        let $ = new Uint8Array(A.buffer, A.byteOffset + K, 16);
                        K += 16, q[z] = {
                            type: Qr3,
                            value: `${P81.toHex($.subarray(0,4))}-${P81.toHex($.subarray(4,6))}-${P81.toHex($.subarray(6,8))}-${P81.toHex($.subarray(8,10))}-${P81.toHex($.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return q
        }
    }
    var sU8 = "boolean",
        Ir3 = "byte",
        xr3 = "short",
        br3 = "integer",
        ur3 = "long",
        Br3 = "binary",
        mr3 = "string",
        Fr3 = "timestamp",
        Qr3 = "uuid",
        gr3 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        eU8 = 4,
        vn = eU8 * 2,
        W81 = 4,
        Ur3 = vn + W81 * 2;

    function pr3({
        byteLength: A,
        byteOffset: q,
        buffer: K
    }) {
        if (A < Ur3) throw Error("Provided message too short to accommodate event stream message overhead");
        let Y = new DataView(K, q, A),
            z = Y.getUint32(0, !1);
        if (A !== z) throw Error("Reported message length does not match received message length");
        let w = Y.getUint32(eU8, !1),
            H = Y.getUint32(vn, !1),
            $ = Y.getUint32(A - W81, !1),
            O = new tU8.Crc32().update(new Uint8Array(K, q, vn));
        if (H !== O.digest()) throw Error(`The prelude checksum specified in the message (${H}) does not match the calculated CRC32 checksum (${O.digest()})`);
        if (O.update(new Uint8Array(K, q + vn, A - (vn + W81))), $ !== O.digest()) throw Error(`The message checksum (${O.digest()}) did not match the expected value of ${$}`);
        return {
            headers: new DataView(K, q + vn + W81, w),
            body: new Uint8Array(K, q + vn + W81 + w, z - w - (vn + W81 + W81))
        }
    }
    class Ap8 {
        headerMarshaller;
        messageBuffer;
        isEndOfStream;
        constructor(A, q) {
            this.headerMarshaller = new nt6(A, q), this.messageBuffer = [], this.isEndOfStream = !1
        }
        feed(A) {
            this.messageBuffer.push(this.decode(A))
        }
        endOfStream() {
            this.isEndOfStream = !0
        }
        getMessage() {
            let A = this.messageBuffer.pop(),
                q = this.isEndOfStream;
            return {
                getMessage() {
                    return A
                },
                isEndOfStream() {
                    return q
                }
            }
        }
        getAvailableMessages() {
            let A = this.messageBuffer;
            this.messageBuffer = [];
            let q = this.isEndOfStream;
            return {
                getMessages() {
                    return A
                },
                isEndOfStream() {
                    return q
                }
            }
        }
        encode({
            headers: A,
            body: q
        }) {
            let K = this.headerMarshaller.format(A),
                Y = K.byteLength + q.byteLength + 16,
                z = new Uint8Array(Y),
                w = new DataView(z.buffer, z.byteOffset, z.byteLength),
                H = new tU8.Crc32;
            return w.setUint32(0, Y, !1), w.setUint32(4, K.byteLength, !1), w.setUint32(8, H.update(z.subarray(0, 8)).digest(), !1), z.set(K, 12), z.set(q, K.byteLength + 12), w.setUint32(Y - 4, H.update(z.subarray(8, Y - 4)).digest(), !1), z
        }
        decode(A) {
            let {
                headers: q,
                body: K
            } = pr3(A);
            return {
                headers: this.headerMarshaller.parse(q),
                body: K
            }
        }
        formatHeaders(A) {
            return this.headerMarshaller.format(A)
        }
    }
    class qp8 {
        options;
        constructor(A) {
            this.options = A
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let A of this.options.inputStream) yield this.options.decoder.decode(A)
        }
    }
    class Kp8 {
        options;
        constructor(A) {
            this.options = A
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let A of this.options.messageStream) yield this.options.encoder.encode(A);
            if (this.options.includeEndFrame) yield new Uint8Array(0)
        }
    }
    class Yp8 {
        options;
        constructor(A) {
            this.options = A
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let A of this.options.messageStream) {
                let q = await this.options.deserializer(A);
                if (q === void 0) continue;
                yield q
            }
        }
    }
    class zp8 {
        options;
        constructor(A) {
            this.options = A
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let A of this.options.inputStream) yield this.options.serializer(A)
        }
    }
    dr3.EventStreamCodec = Ap8;
    dr3.HeaderMarshaller = nt6;
    dr3.Int64 = WO1;
    dr3.MessageDecoderStream = qp8;
    dr3.MessageEncoderStream = Kp8;
    dr3.SmithyMessageDecoderStream = Yp8;
    dr3.SmithyMessageEncoderStream = zp8
})
// @from(Ln 100834, Col 4)
Hp8 = R((er3) => {
    var wp8 = {},
        rt6 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        wp8[A] = q, rt6[q] = A
    }

    function sr3(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in rt6) q[K / 2] = rt6[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function tr3(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += wp8[A[K]];
        return q
    }
    er3.fromHex = sr3;
    er3.toHex = tr3
})
// @from(Ln 100862, Col 4)
$p8 = R(($o3) => {
    $o3.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })($o3.HttpAuthLocation || ($o3.HttpAuthLocation = {}));
    $o3.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })($o3.HttpApiKeyAuthLocation || ($o3.HttpApiKeyAuthLocation = {}));
    $o3.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })($o3.EndpointURLScheme || ($o3.EndpointURLScheme = {}));
    $o3.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })($o3.AlgorithmId || ($o3.AlgorithmId = {}));
    var Ko3 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => $o3.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => $o3.AlgorithmId.MD5,
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
        Yo3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        zo3 = (A) => {
            return Ko3(A)
        },
        wo3 = (A) => {
            return Yo3(A)
        };
    $o3.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })($o3.FieldPosition || ($o3.FieldPosition = {}));
    var Ho3 = "__smithy_context";
    $o3.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })($o3.IniSectionType || ($o3.IniSectionType = {}));
    $o3.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })($o3.RequestHandlerProtocol || ($o3.RequestHandlerProtocol = {}));
    $o3.SMITHY_CONTEXT_KEY = Ho3;
    $o3.getDefaultClientConfiguration = zo3;
    $o3.resolveDefaultRuntimeConfig = wo3
})
// @from(Ln 100927, Col 4)
qe6 = R((Wo3) => {
    var Xo3 = $p8(),
        Do3 = (A) => {
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
        jo3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class Op8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = Xo3.FieldPosition.HEADER,
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
    class _p8 {
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
    class _86 {
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
            let q = new _86({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = Mo3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return _86.clone(this)
        }
    }

    function Mo3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class Jp8 {
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

    function Po3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Wo3.Field = Op8;
    Wo3.Fields = _p8;
    Wo3.HttpRequest = _86;
    Wo3.HttpResponse = Jp8;
    Wo3.getHttpHandlerExtensionConfiguration = Do3;
    Wo3.isValidHostname = Po3;
    Wo3.resolveHttpHandlerRuntimeConfig = jo3
})
// @from(Ln 101069, Col 4)
Dp8 = R((Lo3) => {
    var Xp8 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, Eo3),
        Eo3 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        ko3 = (A) => A.split("/").map(Xp8).join("/");
    Lo3.escapeUri = Xp8;
    Lo3.escapeUriPath = ko3
})
// @from(Ln 101076, Col 4)
jp8 = R((So3) => {
    var Ke6 = Dp8();

    function Co3(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = Ke6.escapeUri(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${Ke6.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${Ke6.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    So3.buildQueryString = Co3
})
// @from(Ln 101095, Col 4)
Mp8 = R((bo3) => {
    var Io3 = jp8();

    function xo3(A) {
        let {
            port: q,
            query: K
        } = A, {
            protocol: Y,
            path: z,
            hostname: w
        } = A;
        if (Y && Y.slice(-1) !== ":") Y += ":";
        if (q) w += `:${q}`;
        if (z && z.charAt(0) !== "/") z = `/${z}`;
        let H = K ? Io3.buildQueryString(K) : "";
        if (H && H[0] !== "?") H = `?${H}`;
        let $ = "";
        if (A.username != null || A.password != null) {
            let _ = A.username ?? "",
                J = A.password ?? "";
            $ = `${_}:${J}@`
        }
        let O = "";
        if (A.fragment) O = `#${A.fragment}`;
        return `${Y}//${$}${w}${z}${H}${O}`
    }
    bo3.formatUrl = xo3
})
// @from(Ln 101124, Col 4)
Pp8 = R((Qo3) => {
    var mL1 = uL1();

    function Bo3(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            w = ($) => {
                if (typeof $ !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + $);
                q = $, K = 4, Y = new Uint8Array($), new DataView(Y.buffer).setUint32(0, $, !1)
            },
            H = async function*() {
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
            };
        return {
            [Symbol.asyncIterator]: H
        }
    }

    function mo3(A, q) {
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
    class Ye6 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.eventStreamCodec = new mL1.EventStreamCodec(A, q), this.utfEncoder = A
        }
        deserialize(A, q) {
            let K = Bo3(A);
            return new mL1.SmithyMessageDecoderStream({
                messageStream: new mL1.MessageDecoderStream({
                    inputStream: K,
                    decoder: this.eventStreamCodec
                }),
                deserializer: mo3(q, this.utfEncoder)
            })
        }
        serialize(A, q) {
            return new mL1.MessageEncoderStream({
                messageStream: new mL1.SmithyMessageEncoderStream({
                    inputStream: A,
                    serializer: q
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var Fo3 = (A) => new Ye6(A);
    Qo3.EventStreamMarshaller = Ye6;
    Qo3.eventStreamSerdeProvider = Fo3
})
// @from(Ln 101232, Col 4)
Zp8 = R((lo3) => {
    var po3 = Pp8(),
        Wp8 = (A) => ({
            [Symbol.asyncIterator]: async function*() {
                let q = A.getReader();
                try {
                    while (!0) {
                        let {
                            done: K,
                            value: Y
                        } = await q.read();
                        if (K) return;
                        yield Y
                    }
                } finally {
                    q.releaseLock()
                }
            }
        }),
        Gp8 = (A) => {
            let q = A[Symbol.asyncIterator]();
            return new ReadableStream({
                async pull(K) {
                    let {
                        done: Y,
                        value: z
                    } = await q.next();
                    if (Y) return K.close();
                    K.enqueue(z)
                }
            })
        };
    class ze6 {
        universalMarshaller;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.universalMarshaller = new po3.EventStreamMarshaller({
                utf8Decoder: q,
                utf8Encoder: A
            })
        }
        deserialize(A, q) {
            let K = do3(A) ? Wp8(A) : A;
            return this.universalMarshaller.deserialize(K, q)
        }
        serialize(A, q) {
            let K = this.universalMarshaller.serialize(A, q);
            return typeof ReadableStream === "function" ? Gp8(K) : K
        }
    }
    var do3 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream,
        co3 = (A) => new ze6(A);
    lo3.EventStreamMarshaller = ze6;
    lo3.eventStreamSerdeProvider = co3;
    lo3.iterableToReadableStream = Gp8;
    lo3.readableStreamtoIterable = Wp8
})
// @from(Ln 101291, Col 4)
Vp8 = R((to3) => {
    var fp8 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, ao3),
        ao3 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        so3 = (A) => A.split("/").map(fp8).join("/");
    to3.escapeUri = fp8;
    to3.escapeUriPath = so3
})
// @from(Ln 101298, Col 4)
Np8 = R((Ka3) => {
    var we6 = Vp8();

    function qa3(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = we6.escapeUri(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${we6.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${we6.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    Ka3.buildQueryString = qa3
})
// @from(Ln 101317, Col 4)
Tp8 = R((wa3) => {
    var za3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    wa3.isArrayBuffer = za3
})
// @from(Ln 101321, Col 4)
$e6 = R((Ja3) => {
    var $a3 = Tp8(),
        He6 = h1("buffer"),
        Oa3 = (A, q = 0, K = A.byteLength - q) => {
            if (!$a3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return He6.Buffer.from(A, q, K)
        },
        _a3 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? He6.Buffer.from(A, q) : He6.Buffer.from(A)
        };
    Ja3.fromArrayBuffer = Oa3;
    Ja3.fromString = _a3
})
// @from(Ln 101335, Col 4)
kp8 = R((vp8) => {
    Object.defineProperty(vp8, "__esModule", {
        value: !0
    });
    vp8.fromBase64 = void 0;
    var ja3 = $e6(),
        Ma3 = /^[A-Za-z0-9+/]*={0,2}$/,
        Pa3 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!Ma3.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, ja3.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    vp8.fromBase64 = Pa3
})
// @from(Ln 101350, Col 4)
yp8 = R((Lp8) => {
    Object.defineProperty(Lp8, "__esModule", {
        value: !0
    });
    Lp8.toBase64 = void 0;
    var Wa3 = $e6(),
        Ga3 = Z2(),
        Za3 = (A) => {
            let q;
            if (typeof A === "string") q = (0, Ga3.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, Wa3.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    Lp8.toBase64 = Za3
})
// @from(Ln 101366, Col 4)
hp8 = R((FL1) => {
    var Cp8 = kp8(),
        Sp8 = yp8();
    Object.keys(Cp8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(FL1, A)) Object.defineProperty(FL1, A, {
            enumerable: !0,
            get: function() {
                return Cp8[A]
            }
        })
    });
    Object.keys(Sp8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(FL1, A)) Object.defineProperty(FL1, A, {
            enumerable: !0,
            get: function() {
                return Sp8[A]
            }
        })
    })
})
// @from(Ln 101386, Col 4)
bp8 = R((La3) => {
    var Ip8 = qe6(),
        fa3 = Np8(),
        Va3 = hp8();

    function xp8(A, q) {
        return new Request(A, q)
    }

    function Na3(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    var J86 = {
        supported: void 0
    };
    class Oe6 {
        config;
        configProvider;
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new Oe6(A)
        }
        constructor(A) {
            if (typeof A === "function") this.configProvider = A().then((q) => q || {});
            else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
            if (J86.supported === void 0) J86.supported = Boolean(typeof Request < "u" && "keepalive" in xp8("https://[::1]"))
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
                $ = fa3.buildQueryString(A.query || {});
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
            if (J86.supported) j.keepalive = z;
            if (typeof this.config.requestInit === "function") Object.assign(j, this.config.requestInit(A));
            let M = () => {},
                P = xp8(X, j),
                W = [fetch(P).then((G) => {
                    let f = G.headers,
                        Z = {};
                    for (let T of f.entries()) Z[T[0]] = T[1];
                    if (G.body == null) return G.blob().then((T) => ({
                        response: new Ip8.HttpResponse({
                            headers: Z,
                            reason: G.statusText,
                            statusCode: G.status,
                            body: T
                        })
                    }));
                    return {
                        response: new Ip8.HttpResponse({
                            headers: Z,
                            reason: G.statusText,
                            statusCode: G.status,
                            body: G.body
                        })
                    }
                }), Na3(Y)];
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
    var Ta3 = async (A) => {
        if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
            if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
            return va3(A)
        }
        return Ea3(A)
    };
    async function va3(A) {
        let q = await ka3(A),
            K = Va3.fromBase64(q);
        return new Uint8Array(K)
    }
    async function Ea3(A) {
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

    function ka3(A) {
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
    La3.FetchHttpHandler = Oe6;
    La3.keepAliveSupport = J86;
    La3.streamCollector = Ta3
})
// @from(Ln 101548, Col 4)
gp8 = R((ia3) => {
    var Sa3 = uL1(),
        ha3 = Hp8(),
        _e6 = qe6(),
        Ia3 = Mp8(),
        Bp8 = Zp8(),
        up8 = bp8(),
        xa3 = (A, q, K, Y) => {
            let z = A,
                w = {
                    start() {},
                    async transform(H, $) {
                        try {
                            let O = new Date(Date.now() + await Y()),
                                _ = {
                                    ":date": {
                                        type: "timestamp",
                                        value: O
                                    }
                                },
                                J = await q.sign({
                                    message: {
                                        body: H,
                                        headers: _
                                    },
                                    priorSignature: z
                                }, {
                                    signingDate: O
                                });
                            z = J.signature;
                            let X = K.encode({
                                headers: {
                                    ..._,
                                    ":chunk-signature": {
                                        type: "binary",
                                        value: ha3.fromHex(J.signature)
                                    }
                                },
                                body: H
                            });
                            $.enqueue(X)
                        } catch (O) {
                            $.error(O)
                        }
                    }
                };
            return new TransformStream({
                ...w
            })
        };
    class mp8 {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(A) {
            this.messageSigner = A.messageSigner, this.eventStreamCodec = new Sa3.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
        }
        async handle(A, q, K = {}) {
            let Y = q.request,
                {
                    body: z,
                    headers: w,
                    query: H
                } = Y;
            if (!(z instanceof ReadableStream)) throw Error("Eventstream payload must be a ReadableStream.");
            let $ = new TransformStream;
            Y.body = $.readable;
            let O;
            try {
                O = await A(q)
            } catch (j) {
                throw Y.body.cancel(), j
            }
            let J = ((w.authorization || "").match(/Signature=([\w]+)$/) || [])[1] || H && H["X-Amz-Signature"] || "",
                X = xa3(J, await this.messageSigner(), this.eventStreamCodec, this.systemClockOffsetProvider);
            return z.pipeThrough(X).pipeThrough($), O
        }
    }
    var ba3 = (A) => new mp8(A),
        ua3 = () => (A) => async (q) => {
            let K = {
                    ...q.input
                },
                Y = await A(q),
                z = Y.output;
            if (K.SessionId && z.SessionId == null) z.SessionId = K.SessionId;
            return Y
        }, Ba3 = {
            step: "initialize",
            name: "injectSessionIdMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            override: !0
        }, ma3 = (A, q) => (K) => (Y) => {
            let {
                request: z
            } = Y;
            if (_e6.HttpRequest.isInstance(z) && A.requestHandler.metadata?.handlerProtocol?.toLowerCase().includes("websocket")) {
                z.protocol = "wss:", z.method = "GET", z.path = `${z.path}-websocket`;
                let {
                    headers: w
                } = z;
                delete w["content-type"], delete w["x-amz-content-sha256"];
                for (let H of Object.keys(w))
                    if (H.indexOf(q.headerPrefix) === 0) {
                        let $ = H.replace(q.headerPrefix, "");
                        z.query[$] = w[H]
                    } if (w["x-amz-user-agent"]) z.query["user-agent"] = w["x-amz-user-agent"];
                z.headers = {
                    host: w.host ?? z.hostname
                }
            }
            return K(Y)
        }, Fa3 = {
            name: "websocketEndpointMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            relation: "after",
            toMiddleware: "eventStreamHeaderMiddleware",
            override: !0
        }, Qa3 = (A, q) => ({
            applyToStack: (K) => {
                K.addRelativeTo(ma3(A, q), Fa3), K.add(ua3(), Ba3)
            }
        }), Fp8 = (A) => A.protocol === "ws:" || A.protocol === "wss:";
    class Qp8 {
        signer;
        constructor(A) {
            this.signer = A.signer
        }
        presign(A, q = {}) {
            return this.signer.presign(A, q)
        }
        async sign(A, q) {
            if (_e6.HttpRequest.isInstance(A) && Fp8(A)) return {
                ...await this.signer.presign({
                    ...A,
                    body: ""
                }, {
                    ...q,
                    expiresIn: 60,
                    unsignableHeaders: new Set(Object.keys(A.headers).filter((Y) => Y !== "host"))
                }),
                body: A.body
            };
            else return this.signer.sign(A, q)
        }
    }
    var ga3 = (A) => {
            let {
                signer: q
            } = A;
            return Object.assign(A, {
                signer: async (K) => {
                    let Y = await q(K);
                    if (Ua3(Y)) return new Qp8({
                        signer: Y
                    });
                    throw Error("Expected WebsocketSignatureV4 signer, please check the client constructor.")
                }
            })
        },
        Ua3 = (A) => !!A,
        pa3 = 2000;
    class Je6 {
        metadata = {
            handlerProtocol: "websocket/h1.1"
        };
        config;
        configPromise;
        httpHandler;
        sockets = {};
        static create(A, q = new up8.FetchHttpHandler) {
            if (typeof A?.handle === "function") return A;
            return new Je6(A, q)
        }
        constructor(A, q = new up8.FetchHttpHandler) {
            if (this.httpHandler = q, typeof A === "function") this.config = {}, this.configPromise = A().then((K) => this.config = K ?? {});
            else this.config = A ?? {}, this.configPromise = Promise.resolve(this.config)
        }
        destroy() {
            for (let [A, q] of Object.entries(this.sockets)) {
                for (let K of q) K.close(1000, "Socket closed through destroy() call");
                delete this.sockets[A]
            }
        }
        async handle(A) {
            if (!Fp8(A)) return this.httpHandler.handle(A);
            let q = Ia3.formatUrl(A),
                K = new WebSocket(q);
            if (!this.sockets[q]) this.sockets[q] = [];
            this.sockets[q].push(K), K.binaryType = "arraybuffer", this.config = await this.configPromise;
            let {
                connectionTimeout: Y = pa3
            } = this.config;
            await this.waitForReady(K, Y);
            let {
                body: z
            } = A, w = da3(z), H = this.connect(K, w), $ = ca3(H);
            return {
                response: new _e6.HttpResponse({
                    statusCode: 200,
                    body: $
                })
            }
        }
        updateHttpClientConfig(A, q) {
            this.configPromise = this.configPromise.then((K) => {
                return K[A] = q, K
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
        removeNotUsableSockets(A) {
            this.sockets[A] = (this.sockets[A] ?? []).filter((q) => ![WebSocket.CLOSING, WebSocket.CLOSED].includes(q.readyState))
        }
        waitForReady(A, q) {
            return new Promise((K, Y) => {
                let z = setTimeout(() => {
                    this.removeNotUsableSockets(A.url), Y({
                        $metadata: {
                            httpStatusCode: 500
                        }
                    })
                }, q);
                A.onopen = () => {
                    clearTimeout(z), K()
                }
            })
        }
        connect(A, q) {
            let K = void 0,
                Y = !1,
                z = () => {},
                w = () => {};
            A.onmessage = (O) => {
                w({
                    done: !1,
                    value: new Uint8Array(O.data)
                })
            }, A.onerror = (O) => {
                Y = !0, A.close(), z(O)
            }, A.onclose = () => {
                if (this.removeNotUsableSockets(A.url), Y) return;
                if (K) z(K);
                else w({
                    done: !0,
                    value: void 0
                })
            };
            let H = {
                [Symbol.asyncIterator]: () => ({
                    next: () => {
                        return new Promise((O, _) => {
                            w = O, z = _
                        })
                    }
                })
            };
            return (async () => {
                try {
                    for await (let O of q) A.send(O)
                } catch (O) {
                    K = O
                } finally {
                    A.close(1000)
                }
            })(), H
        }
    }
    var da3 = (A) => {
            if (A[Symbol.asyncIterator]) return A;
            if (la3(A)) return Bp8.readableStreamtoIterable(A);
            return {
                [Symbol.asyncIterator]: async function*() {
                    yield A
                }
            }
        },
        ca3 = (A) => typeof ReadableStream === "function" ? Bp8.iterableToReadableStream(A) : A,
        la3 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
    ia3.WebSocketFetchHandler = Je6;
    ia3.eventStreamPayloadHandlerProvider = ba3;
    ia3.getWebSocketPlugin = Qa3;
    ia3.resolveWebSocketConfig = ga3
})
// @from(Ln 101833, Col 4)
Up8 = R((ta3) => {
    var sa3 = (A) => Object.assign(A, {
        eventStreamMarshaller: A.eventStreamSerdeProvider(A)
    });
    ta3.resolveEventStreamSerdeConfig = sa3
})
// @from(Ln 101839, Col 4)
Ge6 = R((ws3) => {
    ws3.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ws3.HttpAuthLocation || (ws3.HttpAuthLocation = {}));
    ws3.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ws3.HttpApiKeyAuthLocation || (ws3.HttpApiKeyAuthLocation = {}));
    ws3.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ws3.EndpointURLScheme || (ws3.EndpointURLScheme = {}));
    ws3.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ws3.AlgorithmId || (ws3.AlgorithmId = {}));
    var As3 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ws3.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ws3.AlgorithmId.MD5,
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
        qs3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        Ks3 = (A) => {
            return As3(A)
        },
        Ys3 = (A) => {
            return qs3(A)
        };
    ws3.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ws3.FieldPosition || (ws3.FieldPosition = {}));
    var zs3 = "__smithy_context";
    ws3.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ws3.IniSectionType || (ws3.IniSectionType = {}));
    ws3.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ws3.RequestHandlerProtocol || (ws3.RequestHandlerProtocol = {}));
    ws3.SMITHY_CONTEXT_KEY = zs3;
    ws3.getDefaultClientConfiguration = Ks3;
    ws3.resolveDefaultRuntimeConfig = Ys3
})
// @from(Ln 101904, Col 4)
gL1 = R((ZO1) => {
    var cp8 = wb(),
        Te6 = rf(),
        fe6 = Ge6(),
        _s3 = R$(),
        pp8 = nf();
    class lp8 {
        config;
        middlewareStack = cp8.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                w = Y === void 0 && this.config.cacheMiddleware === !0,
                H;
            if (w) {
                if (!this.handlers) this.handlers = new WeakMap;
                let $ = this.handlers;
                if ($.has(A.constructor)) H = $.get(A.constructor);
                else H = A.resolveMiddleware(this.middlewareStack, this.config, Y), $.set(A.constructor, H)
            } else delete this.handlers, H = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) H(A).then(($) => z(null, $.output), ($) => z($)).catch(() => {});
            else return H(A).then(($) => $.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var Ze6 = "***SensitiveInformation***";

    function Ve6(A, q) {
        if (q == null) return q;
        let K = _s3.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Ze6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Ze6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Ze6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = Ve6(H, Y[w]);
            return z
        }
        return q
    }
    class ve6 {
        middlewareStack = cp8.constructStack();
        schema;
        static classBuilder() {
            return new ip8
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: w,
            inputFilterSensitiveLog: H,
            outputFilterSensitiveLog: $,
            smithyContext: O,
            additionalContext: _,
            CommandCtor: J
        }) {
            for (let P of Y.bind(this)(J, A, q, K)) this.middlewareStack.use(P);
            let X = A.concat(this.middlewareStack),
                {
                    logger: D
                } = q,
                j = {
                    logger: D,
                    clientName: z,
                    commandName: w,
                    inputFilterSensitiveLog: H,
                    outputFilterSensitiveLog: $,
                    [fe6.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...O
                    },
                    ..._
                },
                {
                    requestHandler: M
                } = q;
            return X.resolve((P) => M.handle(P.request, K || {}), j)
        }
    }
    class ip8 {
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
            return q = class extends ve6 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let w = A._operationSchema,
                        H = w?.[4] ?? w?.input,
                        $ = w?.[5] ?? w?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? Ve6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? Ve6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var Js3 = "***SensitiveInformation***",
        Xs3 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(H, $, O) {
                        let _ = new Y(H);
                        if (typeof $ === "function") this.send(_, $);
                        else if (typeof O === "function") {
                            if (typeof $ !== "object") throw Error(`Expected http options but got ${typeof $}`);
                            this.send(_, $ || {}, O)
                        } else return this.send(_, $)
                    }, w = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[w] = z
            }
        };
    class GO1 extends Error {
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
            return GO1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === GO1) return GO1.isInstance(A);
            if (GO1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var np8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        rp8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = js3(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw np8(H, q)
        },
        Ds3 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                rp8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        js3 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        Ms3 = (A) => {
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
        dp8 = !1,
        Ps3 = (A) => {
            if (A && !dp8 && parseInt(A.substring(1, A.indexOf("."))) < 16) dp8 = !0
        },
        Ws3 = (A) => {
            let q = [];
            for (let K in fe6.AlgorithmId) {
                let Y = fe6.AlgorithmId[K];
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
        Gs3 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        Zs3 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        fs3 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        op8 = (A) => {
            return Object.assign(Ws3(A), Zs3(A))
        },
        Vs3 = op8,
        Ns3 = (A) => {
            return Object.assign(Gs3(A), fs3(A))
        },
        Ts3 = (A) => Array.isArray(A) ? A : [A],
        ap8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = ap8(A[K]);
            return A
        },
        vs3 = (A) => {
            return A != null
        };
    class sp8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function tp8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, Ls3(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            ep8(Y, null, w, H)
        }
        return Y
    }
    var Es3 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        ks3 = (A, q) => {
            let K = {};
            for (let Y in q) ep8(K, A, q, Y);
            return K
        },
        Ls3 = (A, q, K) => {
            return tp8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        ep8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = Rs3, O = ys3, _ = Y] = H;
                if (typeof $ === "function" && $(q[_]) || typeof $ !== "function" && !!$) A[Y] = O(q[_]);
                return
            }
            let [z, w] = K[Y];
            if (typeof w === "function") {
                let H, $ = z === void 0 && (H = w()) != null,
                    O = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if ($) A[Y] = H;
                else if (O) A[Y] = w()
            } else {
                let H = z === void 0 && w != null,
                    $ = typeof z === "function" && !!z(w) || typeof z !== "function" && !!z;
                if (H || $) A[Y] = w
            }
        },
        Rs3 = (A) => A != null,
        ys3 = (A) => A,
        Cs3 = (A) => {
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
        Ss3 = (A) => A.toISOString().replace(".000Z", "Z"),
        Ne6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Ne6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Ne6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(ZO1, "collectBody", {
        enumerable: !0,
        get: function() {
            return Te6.collectBody
        }
    });
    Object.defineProperty(ZO1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Te6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(ZO1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Te6.resolvedPath
        }
    });
    ZO1.Client = lp8;
    ZO1.Command = ve6;
    ZO1.NoOpLogger = sp8;
    ZO1.SENSITIVE_STRING = Js3;
    ZO1.ServiceException = GO1;
    ZO1._json = Ne6;
    ZO1.convertMap = Es3;
    ZO1.createAggregatedClient = Xs3;
    ZO1.decorateServiceException = np8;
    ZO1.emitWarningIfUnsupportedVersion = Ps3;
    ZO1.getArrayIfSingleItem = Ts3;
    ZO1.getDefaultClientConfiguration = Vs3;
    ZO1.getDefaultExtensionConfiguration = op8;
    ZO1.getValueFromTextNode = ap8;
    ZO1.isSerializableHeaderValue = vs3;
    ZO1.loadConfigsForDefaultMode = Ms3;
    ZO1.map = tp8;
    ZO1.resolveDefaultRuntimeConfig = Ns3;
    ZO1.serializeDateTime = Ss3;
    ZO1.serializeFloat = Cs3;
    ZO1.take = ks3;
    ZO1.throwDefaultError = rp8;
    ZO1.withBaseException = Ds3;
    Object.keys(pp8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZO1, A)) Object.defineProperty(ZO1, A, {
            enumerable: !0,
            get: function() {
                return pp8[A]
            }
        })
    })
})
// @from(Ln 102374, Col 4)
Le6 = R((Ad8) => {
    Object.defineProperty(Ad8, "__esModule", {
        value: !0
    });
    Ad8.resolveHttpAuthSchemeConfig = Ad8.defaultBedrockRuntimeHttpAuthSchemeProvider = Ad8.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = void 0;
    var At3 = YH(),
        Ee6 = lz(),
        ke6 = iP(),
        qt3 = async (A, q, K) => {
            return {
                operation: (0, ke6.getSmithyContext)(q).operation,
                region: await (0, ke6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    Ad8.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = qt3;

    function Kt3(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "bedrock",
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

    function Yt3(A) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: q,
                filepath: K,
                configFilepath: Y,
                ignoreCache: z
            }, w) => ({
                identityProperties: {
                    profile: q,
                    filepath: K,
                    configFilepath: Y,
                    ignoreCache: z
                }
            })
        }
    }
    var zt3 = (A) => {
        let q = [];
        switch (A.operation) {
            default:
                q.push(Kt3(A)), q.push(Yt3(A))
        }
        return q
    };
    Ad8.defaultBedrockRuntimeHttpAuthSchemeProvider = zt3;
    var wt3 = (A) => {
        let q = (0, Ee6.memoizeIdentityProvider)(A.token, Ee6.isIdentityExpired, Ee6.doesIdentityRequireRefresh),
            K = (0, At3.resolveAwsSdkSigV4Config)(A);
        return Object.assign(K, {
            authSchemePreference: (0, ke6.normalizeProvider)(A.authSchemePreference ?? []),
            token: q
        })
    };
    Ad8.resolveHttpAuthSchemeConfig = wt3
})
// @from(Ln 102445, Col 4)
Kd8 = R((aq2, Ot3) => {
    Ot3.exports = {
        name: "@aws-sdk/client-bedrock-runtime",
        description: "AWS SDK for JavaScript Bedrock Runtime Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-bedrock-runtime",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock-runtime"
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
            "@aws-sdk/eventstream-handler-node": "3.936.0",
            "@aws-sdk/middleware-eventstream": "3.936.0",
            "@aws-sdk/middleware-host-header": "3.936.0",
            "@aws-sdk/middleware-logger": "3.936.0",
            "@aws-sdk/middleware-recursion-detection": "3.936.0",
            "@aws-sdk/middleware-user-agent": "3.936.0",
            "@aws-sdk/middleware-websocket": "3.936.0",
            "@aws-sdk/region-config-resolver": "3.936.0",
            "@aws-sdk/token-providers": "3.936.0",
            "@aws-sdk/types": "3.936.0",
            "@aws-sdk/util-endpoints": "3.936.0",
            "@aws-sdk/util-user-agent-browser": "3.936.0",
            "@aws-sdk/util-user-agent-node": "3.936.0",
            "@smithy/config-resolver": "^4.4.3",
            "@smithy/core": "^3.18.5",
            "@smithy/eventstream-serde-browser": "^4.2.5",
            "@smithy/eventstream-serde-config-resolver": "^4.3.5",
            "@smithy/eventstream-serde-node": "^4.2.5",
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
            "@smithy/util-stream": "^4.5.6",
            "@smithy/util-utf8": "^4.2.0",
            tslib: "^2.6.2"
        },
        devDependencies: {
            "@tsconfig/node18": "18.2.4",
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
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock-runtime",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-bedrock-runtime"
        }
    }
})
// @from(Ln 102550, Col 4)
wd8 = R((Dt3) => {
    var _t3 = uL1(),
        X86 = h1("stream");
    class Yd8 extends X86.Transform {
        priorSignature;
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(A) {
            super({
                autoDestroy: !0,
                readableObjectMode: !0,
                writableObjectMode: !0,
                ...A
            });
            this.priorSignature = A.priorSignature, this.eventStreamCodec = A.eventStreamCodec, this.messageSigner = A.messageSigner, this.systemClockOffsetProvider = A.systemClockOffsetProvider
        }
        async _transform(A, q, K) {
            try {
                let Y = new Date(Date.now() + await this.systemClockOffsetProvider()),
                    z = {
                        ":date": {
                            type: "timestamp",
                            value: Y
                        }
                    },
                    w = await this.messageSigner.sign({
                        message: {
                            body: A,
                            headers: z
                        },
                        priorSignature: this.priorSignature
                    }, {
                        signingDate: Y
                    });
                this.priorSignature = w.signature;
                let H = this.eventStreamCodec.encode({
                    headers: {
                        ...z,
                        ":chunk-signature": {
                            type: "binary",
                            value: Jt3(w.signature)
                        }
                    },
                    body: A
                });
                return this.push(H), K()
            } catch (Y) {
                K(Y)
            }
        }
    }

    function Jt3(A) {
        let q = Buffer.from(A, "hex");
        return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }
    class zd8 {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(A) {
            this.messageSigner = A.messageSigner, this.eventStreamCodec = new _t3.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
        }
        async handle(A, q, K = {}) {
            let Y = q.request,
                {
                    body: z,
                    query: w
                } = Y;
            if (!(z instanceof X86.Readable)) throw Error("Eventstream payload must be a Readable stream.");
            let H = z;
            Y.body = new X86.PassThrough({
                objectMode: !0
            });
            let O = Y.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? w?.["X-Amz-Signature"] ?? "",
                _ = new Yd8({
                    priorSignature: O,
                    eventStreamCodec: this.eventStreamCodec,
                    messageSigner: await this.messageSigner(),
                    systemClockOffsetProvider: this.systemClockOffsetProvider
                });
            X86.pipeline(H, _, Y.body, (X) => {
                if (X) throw X
            });
            let J;
            try {
                J = await A(q)
            } catch (X) {
                throw Y.body.end(), X
            }
            return J
        }
    }
    var Xt3 = (A) => new zd8(A);
    Dt3.eventStreamPayloadHandlerProvider = Xt3
})