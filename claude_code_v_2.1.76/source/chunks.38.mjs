
// @from(Ln 93225, Col 4)
s87 = x((Fa5) => {
    Fa5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Fa5.HttpAuthLocation || (Fa5.HttpAuthLocation = {}));
    Fa5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Fa5.HttpApiKeyAuthLocation || (Fa5.HttpApiKeyAuthLocation = {}));
    Fa5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(Fa5.EndpointURLScheme || (Fa5.EndpointURLScheme = {}));
    Fa5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(Fa5.AlgorithmId || (Fa5.AlgorithmId = {}));
    var xa5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => Fa5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => Fa5.AlgorithmId.MD5,
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
        ua5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        ma5 = (A) => {
            return xa5(A)
        },
        Ba5 = (A) => {
            return ua5(A)
        };
    Fa5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(Fa5.FieldPosition || (Fa5.FieldPosition = {}));
    var ga5 = "__smithy_context";
    Fa5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(Fa5.IniSectionType || (Fa5.IniSectionType = {}));
    Fa5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(Fa5.RequestHandlerProtocol || (Fa5.RequestHandlerProtocol = {}));
    Fa5.SMITHY_CONTEXT_KEY = ga5;
    Fa5.getDefaultClientConfiguration = ma5;
    Fa5.resolveDefaultRuntimeConfig = Ba5
})
// @from(Ln 93290, Col 4)
qA7 = x((ra5) => {
    var da5 = s87(),
        ca5 = (A) => {
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
        la5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class t87 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = da5.FieldPosition.HEADER,
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
    class e87 {
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
    class x51 {
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
            let q = new x51({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = ia5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return x51.clone(this)
        }
    }

    function ia5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class AA7 {
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

    function na5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    ra5.Field = t87;
    ra5.Fields = e87;
    ra5.HttpRequest = x51;
    ra5.HttpResponse = AA7;
    ra5.getHttpHandlerExtensionConfiguration = ca5;
    ra5.isValidHostname = na5;
    ra5.resolveHttpHandlerRuntimeConfig = la5
})
// @from(Ln 93432, Col 4)
OA7 = x((zs5) => {
    var KA7 = qA7();

    function Ks5(A) {
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
    var YA7 = (A) => (q, K) => async (Y) => {
        let {
            request: z
        } = Y;
        if (!KA7.HttpRequest.isInstance(z)) return q(Y);
        return A.eventStreamPayloadHandler.handle(q, Y, K)
    }, zA7 = {
        tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
        name: "eventStreamHandlingMiddleware",
        relation: "after",
        toMiddleware: "awsAuthMiddleware",
        override: !0
    }, _A7 = (A) => async (q) => {
        let {
            request: K
        } = q;
        if (!KA7.HttpRequest.isInstance(K)) return A(q);
        return K.headers = {
            ...K.headers,
            "content-type": "application/vnd.amazon.eventstream",
            "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
        }, A({
            ...q,
            request: K
        })
    }, wA7 = {
        step: "build",
        tags: ["EVENT_STREAM", "HEADER", "CONTENT_TYPE", "CONTENT_SHA256"],
        name: "eventStreamHeaderMiddleware",
        override: !0
    }, Ys5 = (A) => ({
        applyToStack: (q) => {
            q.addRelativeTo(YA7(A), zA7), q.add(_A7, wA7)
        }
    });
    zs5.eventStreamHandlingMiddleware = YA7;
    zs5.eventStreamHandlingMiddlewareOptions = zA7;
    zs5.eventStreamHeaderMiddleware = _A7;
    zs5.eventStreamHeaderMiddlewareOptions = wA7;
    zs5.getEventStreamPlugin = Ys5;
    zs5.resolveEventStreamConfig = Ks5
})
// @from(Ln 93489, Col 4)
jA7 = x((UM_, HA7) => {
    var {
        defineProperty: u51,
        getOwnPropertyDescriptor: Js5,
        getOwnPropertyNames: Ms5
    } = Object, Ds5 = Object.prototype.hasOwnProperty, Xs5 = (A, q) => u51(A, "name", {
        value: q,
        configurable: !0
    }), Ps5 = (A, q) => {
        for (var K in q) u51(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Ws5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Ms5(q))
                if (!Ds5.call(A, z) && z !== K) u51(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Js5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Zs5 = (A) => Ws5(u51({}, "__esModule", {
        value: !0
    }), A), $A7 = {};
    Ps5($A7, {
        isArrayBuffer: () => Gs5
    });
    HA7.exports = Zs5($A7);
    var Gs5 = Xs5((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 93520, Col 4)
V46 = x((dM_, DA7) => {
    var {
        defineProperty: m51,
        getOwnPropertyDescriptor: fs5,
        getOwnPropertyNames: Ts5
    } = Object, vs5 = Object.prototype.hasOwnProperty, JA7 = (A, q) => m51(A, "name", {
        value: q,
        configurable: !0
    }), Ns5 = (A, q) => {
        for (var K in q) m51(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Vs5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Ts5(q))
                if (!vs5.call(A, z) && z !== K) m51(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = fs5(q, z)) || Y.enumerable
                })
        }
        return A
    }, ks5 = (A) => Vs5(m51({}, "__esModule", {
        value: !0
    }), A), MA7 = {};
    Ns5(MA7, {
        fromArrayBuffer: () => ys5,
        fromString: () => Ls5
    });
    DA7.exports = ks5(MA7);
    var Es5 = jA7(),
        Yq8 = x6("buffer"),
        ys5 = JA7((A, q = 0, K = A.byteLength - q) => {
            if (!(0, Es5.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Yq8.Buffer.from(A, q, K)
        }, "fromArrayBuffer"),
        Ls5 = JA7((A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Yq8.Buffer.from(A, q) : Yq8.Buffer.from(A)
        }, "fromString")
})
// @from(Ln 93561, Col 4)
GA7 = x((cM_, ZA7) => {
    var {
        defineProperty: B51,
        getOwnPropertyDescriptor: Rs5,
        getOwnPropertyNames: hs5
    } = Object, Ss5 = Object.prototype.hasOwnProperty, zq8 = (A, q) => B51(A, "name", {
        value: q,
        configurable: !0
    }), Cs5 = (A, q) => {
        for (var K in q) B51(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Is5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of hs5(q))
                if (!Ss5.call(A, z) && z !== K) B51(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Rs5(q, z)) || Y.enumerable
                })
        }
        return A
    }, bs5 = (A) => Is5(B51({}, "__esModule", {
        value: !0
    }), A), XA7 = {};
    Cs5(XA7, {
        fromUtf8: () => WA7,
        toUint8Array: () => xs5,
        toUtf8: () => us5
    });
    ZA7.exports = bs5(XA7);
    var PA7 = V46(),
        WA7 = zq8((A) => {
            let q = (0, PA7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        xs5 = zq8((A) => {
            if (typeof A === "string") return WA7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        us5 = zq8((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, PA7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 93608, Col 4)
vA7 = x((fA7) => {
    Object.defineProperty(fA7, "__esModule", {
        value: !0
    });
    fA7.convertToBuffer = void 0;
    var ms5 = GA7(),
        Bs5 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : ms5.fromUtf8;

    function gs5(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return Bs5(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    fA7.convertToBuffer = gs5
})
// @from(Ln 93626, Col 4)
kA7 = x((NA7) => {
    Object.defineProperty(NA7, "__esModule", {
        value: !0
    });
    NA7.isEmptyData = void 0;

    function Fs5(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    NA7.isEmptyData = Fs5
})
// @from(Ln 93638, Col 4)
LA7 = x((EA7) => {
    Object.defineProperty(EA7, "__esModule", {
        value: !0
    });
    EA7.numToUint8 = void 0;

    function ps5(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    EA7.numToUint8 = ps5
})
// @from(Ln 93649, Col 4)
SA7 = x((RA7) => {
    Object.defineProperty(RA7, "__esModule", {
        value: !0
    });
    RA7.uint32ArrayFrom = void 0;

    function Qs5(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    RA7.uint32ArrayFrom = Qs5
})
// @from(Ln 93666, Col 4)
_q8 = x((tj6) => {
    Object.defineProperty(tj6, "__esModule", {
        value: !0
    });
    tj6.uint32ArrayFrom = tj6.numToUint8 = tj6.isEmptyData = tj6.convertToBuffer = void 0;
    var Us5 = vA7();
    Object.defineProperty(tj6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return Us5.convertToBuffer
        }
    });
    var ds5 = kA7();
    Object.defineProperty(tj6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return ds5.isEmptyData
        }
    });
    var cs5 = LA7();
    Object.defineProperty(tj6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return cs5.numToUint8
        }
    });
    var ls5 = SA7();
    Object.defineProperty(tj6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return ls5.uint32ArrayFrom
        }
    })
})
// @from(Ln 93700, Col 4)
uA7 = x((bA7) => {
    Object.defineProperty(bA7, "__esModule", {
        value: !0
    });
    bA7.AwsCrc32 = void 0;
    var CA7 = _2(),
        wq8 = _q8(),
        IA7 = Oq8(),
        ns5 = function() {
            function A() {
                this.crc32 = new IA7.Crc32
            }
            return A.prototype.update = function(q) {
                if ((0, wq8.isEmptyData)(q)) return;
                this.crc32.update((0, wq8.convertToBuffer)(q))
            }, A.prototype.digest = function() {
                return CA7.__awaiter(this, void 0, void 0, function() {
                    return CA7.__generator(this, function(q) {
                        return [2, (0, wq8.numToUint8)(this.crc32.digest())]
                    })
                })
            }, A.prototype.reset = function() {
                this.crc32 = new IA7.Crc32
            }, A
        }();
    bA7.AwsCrc32 = ns5
})
// @from(Ln 93727, Col 4)
Oq8 = x(($q8) => {
    Object.defineProperty($q8, "__esModule", {
        value: !0
    });
    $q8.AwsCrc32 = $q8.Crc32 = $q8.crc32 = void 0;
    var rs5 = _2(),
        os5 = _q8();

    function as5(A) {
        return new mA7().update(A).digest()
    }
    $q8.crc32 = as5;
    var mA7 = function() {
        function A() {
            this.checksum = 4294967295
        }
        return A.prototype.update = function(q) {
            var K, Y;
            try {
                for (var z = rs5.__values(q), _ = z.next(); !_.done; _ = z.next()) {
                    var w = _.value;
                    this.checksum = this.checksum >>> 8 ^ ts5[(this.checksum ^ w) & 255]
                }
            } catch (O) {
                K = {
                    error: O
                }
            } finally {
                try {
                    if (_ && !_.done && (Y = z.return)) Y.call(z)
                } finally {
                    if (K) throw K.error
                }
            }
            return this
        }, A.prototype.digest = function() {
            return (this.checksum ^ 4294967295) >>> 0
        }, A
    }();
    $q8.Crc32 = mA7;
    var ss5 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        ts5 = (0, os5.uint32ArrayFrom)(ss5),
        es5 = uA7();
    Object.defineProperty($q8, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return es5.AwsCrc32
        }
    })
})
// @from(Ln 93777, Col 4)
gA7 = x((_t5) => {
    var BA7 = {},
        Hq8 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        BA7[A] = q, Hq8[q] = A
    }

    function Yt5(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in Hq8) q[K / 2] = Hq8[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function zt5(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += BA7[A[K]];
        return q
    }
    _t5.fromHex = Yt5;
    _t5.toHex = zt5
})
// @from(Ln 93805, Col 4)
_C6 = x((ft5) => {
    var QA7 = Oq8(),
        k46 = gA7();
    class ej6 {
        bytes;
        constructor(A) {
            if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(A) {
            if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
            let q = new Uint8Array(8);
            for (let K = 7, Y = Math.abs(Math.round(A)); K > -1 && Y > 0; K--, Y /= 256) q[K] = Y;
            if (A < 0) FA7(q);
            return new ej6(q)
        }
        valueOf() {
            let A = this.bytes.slice(0),
                q = A[0] & 128;
            if (q) FA7(A);
            return parseInt(k46.toHex(A), 16) * (q ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function FA7(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    class jq8 {
        toUtf8;
        fromUtf8;
        constructor(A, q) {
            this.toUtf8 = A, this.fromUtf8 = q
        }
        format(A) {
            let q = [];
            for (let z of Object.keys(A)) {
                let _ = this.fromUtf8(z);
                q.push(Uint8Array.from([_.byteLength]), _, this.formatHeaderValue(A[z]))
            }
            let K = new Uint8Array(q.reduce((z, _) => z + _.byteLength, 0)),
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
                    let _ = new Uint8Array(z.buffer);
                    return _.set(A.value, 3), _;
                case "string":
                    let w = this.fromUtf8(A.value),
                        O = new DataView(new ArrayBuffer(3 + w.byteLength));
                    O.setUint8(0, 7), O.setUint16(1, w.byteLength, !1);
                    let $ = new Uint8Array(O.buffer);
                    return $.set(w, 3), $;
                case "timestamp":
                    let H = new Uint8Array(9);
                    return H[0] = 8, H.set(ej6.fromNumber(A.value.valueOf()).bytes, 1), H;
                case "uuid":
                    if (!Wt5.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
                    let j = new Uint8Array(17);
                    return j[0] = 9, j.set(k46.fromHex(A.value.replace(/\-/g, "")), 1), j
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
                            type: pA7,
                            value: !0
                        };
                        break;
                    case 1:
                        q[z] = {
                            type: pA7,
                            value: !1
                        };
                        break;
                    case 2:
                        q[z] = {
                            type: $t5,
                            value: A.getInt8(K++)
                        };
                        break;
                    case 3:
                        q[z] = {
                            type: Ht5,
                            value: A.getInt16(K, !1)
                        }, K += 2;
                        break;
                    case 4:
                        q[z] = {
                            type: jt5,
                            value: A.getInt32(K, !1)
                        }, K += 4;
                        break;
                    case 5:
                        q[z] = {
                            type: Jt5,
                            value: new ej6(new Uint8Array(A.buffer, A.byteOffset + K, 8))
                        }, K += 8;
                        break;
                    case 6:
                        let _ = A.getUint16(K, !1);
                        K += 2, q[z] = {
                            type: Mt5,
                            value: new Uint8Array(A.buffer, A.byteOffset + K, _)
                        }, K += _;
                        break;
                    case 7:
                        let w = A.getUint16(K, !1);
                        K += 2, q[z] = {
                            type: Dt5,
                            value: this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + K, w))
                        }, K += w;
                        break;
                    case 8:
                        q[z] = {
                            type: Xt5,
                            value: new Date(new ej6(new Uint8Array(A.buffer, A.byteOffset + K, 8)).valueOf())
                        }, K += 8;
                        break;
                    case 9:
                        let O = new Uint8Array(A.buffer, A.byteOffset + K, 16);
                        K += 16, q[z] = {
                            type: Pt5,
                            value: `${k46.toHex(O.subarray(0,4))}-${k46.toHex(O.subarray(4,6))}-${k46.toHex(O.subarray(6,8))}-${k46.toHex(O.subarray(8,10))}-${k46.toHex(O.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return q
        }
    }
    var pA7 = "boolean",
        $t5 = "byte",
        Ht5 = "short",
        jt5 = "integer",
        Jt5 = "long",
        Mt5 = "binary",
        Dt5 = "string",
        Xt5 = "timestamp",
        Pt5 = "uuid",
        Wt5 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        UA7 = 4,
        Po = UA7 * 2,
        E46 = 4,
        Zt5 = Po + E46 * 2;

    function Gt5({
        byteLength: A,
        byteOffset: q,
        buffer: K
    }) {
        if (A < Zt5) throw Error("Provided message too short to accommodate event stream message overhead");
        let Y = new DataView(K, q, A),
            z = Y.getUint32(0, !1);
        if (A !== z) throw Error("Reported message length does not match received message length");
        let _ = Y.getUint32(UA7, !1),
            w = Y.getUint32(Po, !1),
            O = Y.getUint32(A - E46, !1),
            $ = new QA7.Crc32().update(new Uint8Array(K, q, Po));
        if (w !== $.digest()) throw Error(`The prelude checksum specified in the message (${w}) does not match the calculated CRC32 checksum (${$.digest()})`);
        if ($.update(new Uint8Array(K, q + Po, A - (Po + E46))), O !== $.digest()) throw Error(`The message checksum (${$.digest()}) did not match the expected value of ${O}`);
        return {
            headers: new DataView(K, q + Po + E46, _),
            body: new Uint8Array(K, q + Po + E46 + _, z - _ - (Po + E46 + E46))
        }
    }
    class dA7 {
        headerMarshaller;
        messageBuffer;
        isEndOfStream;
        constructor(A, q) {
            this.headerMarshaller = new jq8(A, q), this.messageBuffer = [], this.isEndOfStream = !1
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
                _ = new DataView(z.buffer, z.byteOffset, z.byteLength),
                w = new QA7.Crc32;
            return _.setUint32(0, Y, !1), _.setUint32(4, K.byteLength, !1), _.setUint32(8, w.update(z.subarray(0, 8)).digest(), !1), z.set(K, 12), z.set(q, K.byteLength + 12), _.setUint32(Y - 4, w.update(z.subarray(8, Y - 4)).digest(), !1), z
        }
        decode(A) {
            let {
                headers: q,
                body: K
            } = Gt5(A);
            return {
                headers: this.headerMarshaller.parse(q),
                body: K
            }
        }
        formatHeaders(A) {
            return this.headerMarshaller.format(A)
        }
    }
    class cA7 {
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
    class lA7 {
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
    class iA7 {
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
    class nA7 {
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
    ft5.EventStreamCodec = dA7;
    ft5.HeaderMarshaller = jq8;
    ft5.Int64 = ej6;
    ft5.MessageDecoderStream = cA7;
    ft5.MessageEncoderStream = lA7;
    ft5.SmithyMessageDecoderStream = iA7;
    ft5.SmithyMessageEncoderStream = nA7
})
// @from(Ln 94120, Col 4)
oA7 = x((ht5) => {
    var rA7 = {},
        Jq8 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        rA7[A] = q, Jq8[q] = A
    }

    function Lt5(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in Jq8) q[K / 2] = Jq8[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function Rt5(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += rA7[A[K]];
        return q
    }
    ht5.fromHex = Lt5;
    ht5.toHex = Rt5
})
// @from(Ln 94148, Col 4)
aA7 = x((Bt5) => {
    Bt5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Bt5.HttpAuthLocation || (Bt5.HttpAuthLocation = {}));
    Bt5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Bt5.HttpApiKeyAuthLocation || (Bt5.HttpApiKeyAuthLocation = {}));
    Bt5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(Bt5.EndpointURLScheme || (Bt5.EndpointURLScheme = {}));
    Bt5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(Bt5.AlgorithmId || (Bt5.AlgorithmId = {}));
    var It5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => Bt5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => Bt5.AlgorithmId.MD5,
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
        bt5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        xt5 = (A) => {
            return It5(A)
        },
        ut5 = (A) => {
            return bt5(A)
        };
    Bt5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(Bt5.FieldPosition || (Bt5.FieldPosition = {}));
    var mt5 = "__smithy_context";
    Bt5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(Bt5.IniSectionType || (Bt5.IniSectionType = {}));
    Bt5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(Bt5.RequestHandlerProtocol || (Bt5.RequestHandlerProtocol = {}));
    Bt5.SMITHY_CONTEXT_KEY = mt5;
    Bt5.getDefaultClientConfiguration = xt5;
    Bt5.resolveDefaultRuntimeConfig = ut5
})
// @from(Ln 94213, Col 4)
Gq8 = x((it5) => {
    var Qt5 = aA7(),
        Ut5 = (A) => {
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
        dt5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class sA7 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = Qt5.FieldPosition.HEADER,
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
    class tA7 {
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
    class g51 {
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
            let q = new g51({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = ct5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return g51.clone(this)
        }
    }

    function ct5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class eA7 {
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

    function lt5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    it5.Field = sA7;
    it5.Fields = tA7;
    it5.HttpRequest = g51;
    it5.HttpResponse = eA7;
    it5.getHttpHandlerExtensionConfiguration = Ut5;
    it5.isValidHostname = lt5;
    it5.resolveHttpHandlerRuntimeConfig = dt5
})
// @from(Ln 94355, Col 4)
q77 = x((Ke5) => {
    var A77 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, Ae5),
        Ae5 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        qe5 = (A) => A.split("/").map(A77).join("/");
    Ke5.escapeUri = A77;
    Ke5.escapeUriPath = qe5
})
// @from(Ln 94362, Col 4)
K77 = x((we5) => {
    var fq8 = q77();

    function _e5(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = fq8.escapeUri(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${fq8.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${fq8.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    we5.buildQueryString = _e5
})
// @from(Ln 94381, Col 4)
Y77 = x((je5) => {
    var $e5 = K77();

    function He5(A) {
        let {
            port: q,
            query: K
        } = A, {
            protocol: Y,
            path: z,
            hostname: _
        } = A;
        if (Y && Y.slice(-1) !== ":") Y += ":";
        if (q) _ += `:${q}`;
        if (z && z.charAt(0) !== "/") z = `/${z}`;
        let w = K ? $e5.buildQueryString(K) : "";
        if (w && w[0] !== "?") w = `?${w}`;
        let O = "";
        if (A.username != null || A.password != null) {
            let H = A.username ?? "",
                j = A.password ?? "";
            O = `${H}:${j}@`
        }
        let $ = "";
        if (A.fragment) $ = `#${A.fragment}`;
        return `${Y}//${O}${_}${z}${w}${$}`
    }
    je5.formatUrl = He5
})
// @from(Ln 94410, Col 4)
z77 = x((Pe5) => {
    var OC6 = _C6();

    function Me5(A) {
        let q = 0,
            K = 0,
            Y = null,
            z = null,
            _ = (O) => {
                if (typeof O !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + O);
                q = O, K = 4, Y = new Uint8Array(O), new DataView(Y.buffer).setUint32(0, O, !1)
            },
            w = async function*() {
                let O = A[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: $,
                        done: H
                    } = await O.next();
                    if (H) {
                        if (!q) return;
                        else if (q === K) yield Y;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let j = $.length,
                        J = 0;
                    while (J < j) {
                        if (!Y) {
                            let D = j - J;
                            if (!z) z = new Uint8Array(4);
                            let X = Math.min(4 - K, D);
                            if (z.set($.slice(J, J + X), K), K += X, J += X, K < 4) break;
                            _(new DataView(z.buffer).getUint32(0, !1)), z = null
                        }
                        let M = Math.min(q - K, j - J);
                        if (Y.set($.slice(J, J + M), K), K += M, J += M, q && q === K) yield Y, Y = null, q = 0, K = 0
                    }
                }
            };
        return {
            [Symbol.asyncIterator]: w
        }
    }

    function De5(A, q) {
        return async function(K) {
            let {
                value: Y
            } = K.headers[":message-type"];
            if (Y === "error") {
                let z = Error(K.headers[":error-message"].value || "UnknownError");
                throw z.name = K.headers[":error-code"].value, z
            } else if (Y === "exception") {
                let z = K.headers[":exception-type"].value,
                    _ = {
                        [z]: K
                    },
                    w = await A(_);
                if (w.$unknown) {
                    let O = Error(q(K.body));
                    throw O.name = z, O
                }
                throw w[z]
            } else if (Y === "event") {
                let z = {
                        [K.headers[":event-type"].value]: K
                    },
                    _ = await A(z);
                if (_.$unknown) return;
                return _
            } else throw Error(`Unrecognizable event type: ${K.headers[":event-type"].value}`)
        }
    }
    class Tq8 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.eventStreamCodec = new OC6.EventStreamCodec(A, q), this.utfEncoder = A
        }
        deserialize(A, q) {
            let K = Me5(A);
            return new OC6.SmithyMessageDecoderStream({
                messageStream: new OC6.MessageDecoderStream({
                    inputStream: K,
                    decoder: this.eventStreamCodec
                }),
                deserializer: De5(q, this.utfEncoder)
            })
        }
        serialize(A, q) {
            return new OC6.MessageEncoderStream({
                messageStream: new OC6.SmithyMessageEncoderStream({
                    inputStream: A,
                    serializer: q
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var Xe5 = (A) => new Tq8(A);
    Pe5.EventStreamMarshaller = Tq8;
    Pe5.eventStreamSerdeProvider = Xe5
})
// @from(Ln 94518, Col 4)
O77 = x((ve5) => {
    var Ge5 = z77(),
        _77 = (A) => ({
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
        w77 = (A) => {
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
    class vq8 {
        universalMarshaller;
        constructor({
            utf8Encoder: A,
            utf8Decoder: q
        }) {
            this.universalMarshaller = new Ge5.EventStreamMarshaller({
                utf8Decoder: q,
                utf8Encoder: A
            })
        }
        deserialize(A, q) {
            let K = fe5(A) ? _77(A) : A;
            return this.universalMarshaller.deserialize(K, q)
        }
        serialize(A, q) {
            let K = this.universalMarshaller.serialize(A, q);
            return typeof ReadableStream === "function" ? w77(K) : K
        }
    }
    var fe5 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream,
        Te5 = (A) => new vq8(A);
    ve5.EventStreamMarshaller = vq8;
    ve5.eventStreamSerdeProvider = Te5;
    ve5.iterableToReadableStream = w77;
    ve5.readableStreamtoIterable = _77
})
// @from(Ln 94577, Col 4)
H77 = x((Re5) => {
    var $77 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, ye5),
        ye5 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        Le5 = (A) => A.split("/").map($77).join("/");
    Re5.escapeUri = $77;
    Re5.escapeUriPath = Le5
})
// @from(Ln 94584, Col 4)
j77 = x((Ie5) => {
    var Nq8 = H77();

    function Ce5(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = Nq8.escapeUri(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${Nq8.escapeUri(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${Nq8.escapeUri(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    Ie5.buildQueryString = Ce5
})
// @from(Ln 94603, Col 4)
J77 = x((ue5) => {
    var xe5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    ue5.isArrayBuffer = xe5
})
// @from(Ln 94607, Col 4)
kq8 = x((pe5) => {
    var Be5 = J77(),
        Vq8 = x6("buffer"),
        ge5 = (A, q = 0, K = A.byteLength - q) => {
            if (!Be5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Vq8.Buffer.from(A, q, K)
        },
        Fe5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Vq8.Buffer.from(A, q) : Vq8.Buffer.from(A)
        };
    pe5.fromArrayBuffer = ge5;
    pe5.fromString = Fe5
})
// @from(Ln 94621, Col 4)
X77 = x((M77) => {
    Object.defineProperty(M77, "__esModule", {
        value: !0
    });
    M77.fromBase64 = void 0;
    var de5 = kq8(),
        ce5 = /^[A-Za-z0-9+/]*={0,2}$/,
        le5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!ce5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, de5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    M77.fromBase64 = le5
})
// @from(Ln 94636, Col 4)
Z77 = x((P77) => {
    Object.defineProperty(P77, "__esModule", {
        value: !0
    });
    P77.toBase64 = void 0;
    var ie5 = kq8(),
        ne5 = C_(),
        re5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, ne5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, ie5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    P77.toBase64 = re5
})
// @from(Ln 94652, Col 4)
T77 = x(($C6) => {
    var G77 = X77(),
        f77 = Z77();
    Object.keys(G77).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call($C6, A)) Object.defineProperty($C6, A, {
            enumerable: !0,
            get: function() {
                return G77[A]
            }
        })
    });
    Object.keys(f77).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call($C6, A)) Object.defineProperty($C6, A, {
            enumerable: !0,
            get: function() {
                return f77[A]
            }
        })
    })
})
// @from(Ln 94672, Col 4)
V77 = x((K63) => {
    var v77 = Gq8(),
        oe5 = j77(),
        ae5 = T77();

    function N77(A, q) {
        return new Request(A, q)
    }

    function se5(A = 0) {
        return new Promise((q, K) => {
            if (A) setTimeout(() => {
                let Y = Error(`Request did not complete within ${A} ms`);
                Y.name = "TimeoutError", K(Y)
            }, A)
        })
    }
    var F51 = {
        supported: void 0
    };
    class Eq8 {
        config;
        configProvider;
        static create(A) {
            if (typeof A?.handle === "function") return A;
            return new Eq8(A)
        }
        constructor(A) {
            if (typeof A === "function") this.configProvider = A().then((q) => q || {});
            else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
            if (F51.supported === void 0) F51.supported = Boolean(typeof Request < "u" && "keepalive" in N77("https://[::1]"))
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
                O = oe5.buildQueryString(A.query || {});
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
            if (F51.supported) D.keepalive = z;
            if (typeof this.config.requestInit === "function") Object.assign(D, this.config.requestInit(A));
            let X = () => {},
                P = N77(J, D),
                W = [fetch(P).then((Z) => {
                    let G = Z.headers,
                        f = {};
                    for (let N of G.entries()) f[N[0]] = N[1];
                    if (Z.body == null) return Z.blob().then((N) => ({
                        response: new v77.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: N
                        })
                    }));
                    return {
                        response: new v77.HttpResponse({
                            headers: f,
                            reason: Z.statusText,
                            statusCode: Z.status,
                            body: Z.body
                        })
                    }
                }), se5(Y)];
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
    var te5 = async (A) => {
        if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
            if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
            return ee5(A)
        }
        return A63(A)
    };
    async function ee5(A) {
        let q = await q63(A),
            K = ae5.fromBase64(q);
        return new Uint8Array(K)
    }
    async function A63(A) {
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

    function q63(A) {
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
    K63.FetchHttpHandler = Eq8;
    K63.keepAliveSupport = F51;
    K63.streamCollector = te5
})
// @from(Ln 94834, Col 4)
h77 = x((N63) => {
    var w63 = _C6(),
        O63 = oA7(),
        yq8 = Gq8(),
        $63 = Y77(),
        E77 = O77(),
        k77 = V77(),
        H63 = (A, q, K, Y) => {
            let z = A,
                _ = {
                    start() {},
                    async transform(w, O) {
                        try {
                            let $ = new Date(Date.now() + await Y()),
                                H = {
                                    ":date": {
                                        type: "timestamp",
                                        value: $
                                    }
                                },
                                j = await q.sign({
                                    message: {
                                        body: w,
                                        headers: H
                                    },
                                    priorSignature: z
                                }, {
                                    signingDate: $
                                });
                            z = j.signature;
                            let J = K.encode({
                                headers: {
                                    ...H,
                                    ":chunk-signature": {
                                        type: "binary",
                                        value: O63.fromHex(j.signature)
                                    }
                                },
                                body: w
                            });
                            O.enqueue(J)
                        } catch ($) {
                            O.error($)
                        }
                    }
                };
            return new TransformStream({
                ..._
            })
        };
    class y77 {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(A) {
            this.messageSigner = A.messageSigner, this.eventStreamCodec = new w63.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
        }
        async handle(A, q, K = {}) {
            let Y = q.request,
                {
                    body: z,
                    headers: _,
                    query: w
                } = Y;
            if (!(z instanceof ReadableStream)) throw Error("Eventstream payload must be a ReadableStream.");
            let O = new TransformStream;
            Y.body = O.readable;
            let $;
            try {
                $ = await A(q)
            } catch (D) {
                throw Y.body.cancel(), D
            }
            let j = ((_.authorization || "").match(/Signature=([\w]+)$/) || [])[1] || w && w["X-Amz-Signature"] || "",
                J = H63(j, await this.messageSigner(), this.eventStreamCodec, this.systemClockOffsetProvider);
            return z.pipeThrough(J).pipeThrough(O), $
        }
    }
    var j63 = (A) => new y77(A),
        J63 = () => (A) => async (q) => {
            let K = {
                    ...q.input
                },
                Y = await A(q),
                z = Y.output;
            if (K.SessionId && z.SessionId == null) z.SessionId = K.SessionId;
            return Y
        }, M63 = {
            step: "initialize",
            name: "injectSessionIdMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            override: !0
        }, D63 = (A, q) => (K) => (Y) => {
            let {
                request: z
            } = Y;
            if (yq8.HttpRequest.isInstance(z) && A.requestHandler.metadata?.handlerProtocol?.toLowerCase().includes("websocket")) {
                z.protocol = "wss:", z.method = "GET", z.path = `${z.path}-websocket`;
                let {
                    headers: _
                } = z;
                delete _["content-type"], delete _["x-amz-content-sha256"];
                for (let w of Object.keys(_))
                    if (w.indexOf(q.headerPrefix) === 0) {
                        let O = w.replace(q.headerPrefix, "");
                        z.query[O] = _[w]
                    } if (_["x-amz-user-agent"]) z.query["user-agent"] = _["x-amz-user-agent"];
                z.headers = {
                    host: _.host ?? z.hostname
                }
            }
            return K(Y)
        }, X63 = {
            name: "websocketEndpointMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            relation: "after",
            toMiddleware: "eventStreamHeaderMiddleware",
            override: !0
        }, P63 = (A, q) => ({
            applyToStack: (K) => {
                K.addRelativeTo(D63(A, q), X63), K.add(J63(), M63)
            }
        }), L77 = (A) => A.protocol === "ws:" || A.protocol === "wss:";
    class R77 {
        signer;
        constructor(A) {
            this.signer = A.signer
        }
        presign(A, q = {}) {
            return this.signer.presign(A, q)
        }
        async sign(A, q) {
            if (yq8.HttpRequest.isInstance(A) && L77(A)) return {
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
    var W63 = (A) => {
            let {
                signer: q
            } = A;
            return Object.assign(A, {
                signer: async (K) => {
                    let Y = await q(K);
                    if (Z63(Y)) return new R77({
                        signer: Y
                    });
                    throw Error("Expected WebsocketSignatureV4 signer, please check the client constructor.")
                }
            })
        },
        Z63 = (A) => !!A,
        G63 = 2000;
    class Lq8 {
        metadata = {
            handlerProtocol: "websocket/h1.1"
        };
        config;
        configPromise;
        httpHandler;
        sockets = {};
        static create(A, q = new k77.FetchHttpHandler) {
            if (typeof A?.handle === "function") return A;
            return new Lq8(A, q)
        }
        constructor(A, q = new k77.FetchHttpHandler) {
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
            if (!L77(A)) return this.httpHandler.handle(A);
            let q = $63.formatUrl(A),
                K = new WebSocket(q);
            if (!this.sockets[q]) this.sockets[q] = [];
            this.sockets[q].push(K), K.binaryType = "arraybuffer", this.config = await this.configPromise;
            let {
                connectionTimeout: Y = G63
            } = this.config;
            await this.waitForReady(K, Y);
            let {
                body: z
            } = A, _ = f63(z), w = this.connect(K, _), O = T63(w);
            return {
                response: new yq8.HttpResponse({
                    statusCode: 200,
                    body: O
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
                _ = () => {};
            A.onmessage = ($) => {
                _({
                    done: !1,
                    value: new Uint8Array($.data)
                })
            }, A.onerror = ($) => {
                Y = !0, A.close(), z($)
            }, A.onclose = () => {
                if (this.removeNotUsableSockets(A.url), Y) return;
                if (K) z(K);
                else _({
                    done: !0,
                    value: void 0
                })
            };
            let w = {
                [Symbol.asyncIterator]: () => ({
                    next: () => {
                        return new Promise(($, H) => {
                            _ = $, z = H
                        })
                    }
                })
            };
            return (async () => {
                try {
                    for await (let $ of q) A.send($)
                } catch ($) {
                    K = $
                } finally {
                    A.close(1000)
                }
            })(), w
        }
    }
    var f63 = (A) => {
            if (A[Symbol.asyncIterator]) return A;
            if (v63(A)) return E77.readableStreamtoIterable(A);
            return {
                [Symbol.asyncIterator]: async function*() {
                    yield A
                }
            }
        },
        T63 = (A) => typeof ReadableStream === "function" ? E77.iterableToReadableStream(A) : A,
        v63 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
    N63.WebSocketFetchHandler = Lq8;
    N63.eventStreamPayloadHandlerProvider = j63;
    N63.getWebSocketPlugin = P63;
    N63.resolveWebSocketConfig = W63
})
// @from(Ln 95119, Col 4)
S77 = x((R63) => {
    var L63 = (A) => Object.assign(A, {
        eventStreamMarshaller: A.eventStreamSerdeProvider(A)
    });
    R63.resolveEventStreamSerdeConfig = L63
})
// @from(Ln 95125, Col 4)
xq8 = x((u63) => {
    u63.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(u63.HttpAuthLocation || (u63.HttpAuthLocation = {}));
    u63.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(u63.HttpApiKeyAuthLocation || (u63.HttpApiKeyAuthLocation = {}));
    u63.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(u63.EndpointURLScheme || (u63.EndpointURLScheme = {}));
    u63.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(u63.AlgorithmId || (u63.AlgorithmId = {}));
    var S63 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => u63.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => u63.AlgorithmId.MD5,
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
        C63 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        I63 = (A) => {
            return S63(A)
        },
        b63 = (A) => {
            return C63(A)
        };
    u63.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(u63.FieldPosition || (u63.FieldPosition = {}));
    var x63 = "__smithy_context";
    u63.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(u63.IniSectionType || (u63.IniSectionType = {}));
    u63.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(u63.RequestHandlerProtocol || (u63.RequestHandlerProtocol = {}));
    u63.SMITHY_CONTEXT_KEY = x63;
    u63.getDefaultClientConfiguration = I63;
    u63.resolveDefaultRuntimeConfig = b63
})
// @from(Ln 95190, Col 4)
jC6 = x((qJ6) => {
    var b77 = Pu(),
        Fq8 = pT(),
        mq8 = xq8(),
        F63 = dO(),
        C77 = FT();
    class x77 {
        config;
        middlewareStack = b77.constructStack();
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
    var uq8 = "***SensitiveInformation***";

    function Bq8(A, q) {
        if (q == null) return q;
        let K = F63.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return uq8;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return uq8
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return uq8
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = Bq8(w, Y[_]);
            return z
        }
        return q
    }
    class pq8 {
        middlewareStack = b77.constructStack();
        schema;
        static classBuilder() {
            return new u77
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
                    [mq8.SMITHY_CONTEXT_KEY]: {
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
    class u77 {
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
            return q = class extends pq8 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? Bq8.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? Bq8.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var p63 = "***SensitiveInformation***",
        Q63 = (A, q) => {
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
    class AJ6 extends Error {
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
            return AJ6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === AJ6) return AJ6.isInstance(A);
            if (AJ6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var m77 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        B77 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = d63(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw m77(w, q)
        },
        U63 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                B77({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        d63 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        c63 = (A) => {
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
        I77 = !1,
        l63 = (A) => {
            if (A && !I77 && parseInt(A.substring(1, A.indexOf("."))) < 16) I77 = !0
        },
        i63 = (A) => {
            let q = [];
            for (let K in mq8.AlgorithmId) {
                let Y = mq8.AlgorithmId[K];
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
        n63 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        r63 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        o63 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        g77 = (A) => {
            return Object.assign(i63(A), r63(A))
        },
        a63 = g77,
        s63 = (A) => {
            return Object.assign(n63(A), o63(A))
        },
        t63 = (A) => Array.isArray(A) ? A : [A],
        F77 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = F77(A[K]);
            return A
        },
        e63 = (A) => {
            return A != null
        };
    class p77 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function Q77(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, K13(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            U77(Y, null, _, w)
        }
        return Y
    }
    var A13 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        q13 = (A, q) => {
            let K = {};
            for (let Y in q) U77(K, A, q, Y);
            return K
        },
        K13 = (A, q, K) => {
            return Q77(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        U77 = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = Y13, $ = z13, H = Y] = w;
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
        Y13 = (A) => A != null,
        z13 = (A) => A,
        _13 = (A) => {
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
        w13 = (A) => A.toISOString().replace(".000Z", "Z"),
        gq8 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(gq8);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = gq8(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(qJ6, "collectBody", {
        enumerable: !0,
        get: function() {
            return Fq8.collectBody
        }
    });
    Object.defineProperty(qJ6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Fq8.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(qJ6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Fq8.resolvedPath
        }
    });
    qJ6.Client = x77;
    qJ6.Command = pq8;
    qJ6.NoOpLogger = p77;
    qJ6.SENSITIVE_STRING = p63;
    qJ6.ServiceException = AJ6;
    qJ6._json = gq8;
    qJ6.convertMap = A13;
    qJ6.createAggregatedClient = Q63;
    qJ6.decorateServiceException = m77;
    qJ6.emitWarningIfUnsupportedVersion = l63;
    qJ6.getArrayIfSingleItem = t63;
    qJ6.getDefaultClientConfiguration = a63;
    qJ6.getDefaultExtensionConfiguration = g77;
    qJ6.getValueFromTextNode = F77;
    qJ6.isSerializableHeaderValue = e63;
    qJ6.loadConfigsForDefaultMode = c63;
    qJ6.map = Q77;
    qJ6.resolveDefaultRuntimeConfig = s63;
    qJ6.serializeDateTime = w13;
    qJ6.serializeFloat = _13;
    qJ6.take = q13;
    qJ6.throwDefaultError = B77;
    qJ6.withBaseException = U63;
    Object.keys(C77).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(qJ6, A)) Object.defineProperty(qJ6, A, {
            enumerable: !0,
            get: function() {
                return C77[A]
            }
        })
    })
})
// @from(Ln 95660, Col 4)
dq8 = x((d77) => {
    Object.defineProperty(d77, "__esModule", {
        value: !0
    });
    d77.resolveHttpAuthSchemeConfig = d77.defaultBedrockRuntimeHttpAuthSchemeProvider = d77.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = void 0;
    var S13 = Nw(),
        Qq8 = w_(),
        Uq8 = VW(),
        C13 = async (A, q, K) => {
            return {
                operation: (0, Uq8.getSmithyContext)(q).operation,
                region: await (0, Uq8.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    d77.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = C13;

    function I13(A) {
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

    function b13(A) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: q,
                filepath: K,
                configFilepath: Y,
                ignoreCache: z
            }, _) => ({
                identityProperties: {
                    profile: q,
                    filepath: K,
                    configFilepath: Y,
                    ignoreCache: z
                }
            })
        }
    }
    var x13 = (A) => {
        let q = [];
        switch (A.operation) {
            default:
                q.push(I13(A)), q.push(b13(A))
        }
        return q
    };
    d77.defaultBedrockRuntimeHttpAuthSchemeProvider = x13;
    var u13 = (A) => {
        let q = (0, Qq8.memoizeIdentityProvider)(A.token, Qq8.isIdentityExpired, Qq8.doesIdentityRequireRefresh),
            K = (0, S13.resolveAwsSdkSigV4Config)(A);
        return Object.assign(K, {
            authSchemePreference: (0, Uq8.normalizeProvider)(A.authSchemePreference ?? []),
            token: q
        })
    };
    d77.resolveHttpAuthSchemeConfig = u13
})
// @from(Ln 95731, Col 4)
l77 = x((ED_, g13) => {
    g13.exports = {
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
// @from(Ln 95836, Col 4)
r77 = x((U13) => {
    var F13 = _C6(),
        p51 = x6("stream");
    class i77 extends p51.Transform {
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
                    _ = await this.messageSigner.sign({
                        message: {
                            body: A,
                            headers: z
                        },
                        priorSignature: this.priorSignature
                    }, {
                        signingDate: Y
                    });
                this.priorSignature = _.signature;
                let w = this.eventStreamCodec.encode({
                    headers: {
                        ...z,
                        ":chunk-signature": {
                            type: "binary",
                            value: p13(_.signature)
                        }
                    },
                    body: A
                });
                return this.push(w), K()
            } catch (Y) {
                K(Y)
            }
        }
    }

    function p13(A) {
        let q = Buffer.from(A, "hex");
        return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }
    class n77 {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(A) {
            this.messageSigner = A.messageSigner, this.eventStreamCodec = new F13.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
        }
        async handle(A, q, K = {}) {
            let Y = q.request,
                {
                    body: z,
                    query: _
                } = Y;
            if (!(z instanceof p51.Readable)) throw Error("Eventstream payload must be a Readable stream.");
            let w = z;
            Y.body = new p51.PassThrough({
                objectMode: !0
            });
            let $ = Y.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? _?.["X-Amz-Signature"] ?? "",
                H = new i77({
                    priorSignature: $,
                    eventStreamCodec: this.eventStreamCodec,
                    messageSigner: await this.messageSigner(),
                    systemClockOffsetProvider: this.systemClockOffsetProvider
                });
            p51.pipeline(w, H, Y.body, (J) => {
                if (J) throw J
            });
            let j;
            try {
                j = await A(q)
            } catch (J) {
                throw Y.body.end(), J
            }
            return j
        }
    }
    var Q13 = (A) => new n77(A);
    U13.eventStreamPayloadHandlerProvider = Q13
})