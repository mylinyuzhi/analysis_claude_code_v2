
// @from(Ln 97471, Col 4)
c$q = p((cj9) => {
    cj9.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(cj9.HttpAuthLocation || (cj9.HttpAuthLocation = {}));
    cj9.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(cj9.HttpApiKeyAuthLocation || (cj9.HttpApiKeyAuthLocation = {}));
    cj9.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(cj9.EndpointURLScheme || (cj9.EndpointURLScheme = {}));
    cj9.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(cj9.AlgorithmId || (cj9.AlgorithmId = {}));
    var Fj9 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => cj9.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => cj9.AlgorithmId.MD5,
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
        gj9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        Uj9 = (q) => {
            return Fj9(q)
        },
        Qj9 = (q) => {
            return gj9(q)
        };
    cj9.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(cj9.FieldPosition || (cj9.FieldPosition = {}));
    var dj9 = "__smithy_context";
    cj9.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(cj9.IniSectionType || (cj9.IniSectionType = {}));
    cj9.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(cj9.RequestHandlerProtocol || (cj9.RequestHandlerProtocol = {}));
    cj9.SMITHY_CONTEXT_KEY = dj9;
    cj9.getDefaultClientConfiguration = Uj9;
    cj9.resolveDefaultRuntimeConfig = Qj9
})
// @from(Ln 97536, Col 4)
r$q = p((ej9) => {
    var rj9 = c$q(),
        oj9 = (q) => {
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
        aj9 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class l$q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = rj9.FieldPosition.HEADER,
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
    class n$q {
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
    class PD8 {
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
            let K = new PD8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = sj9(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return PD8.clone(this)
        }
    }

    function sj9(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class i$q {
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

    function tj9(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    ej9.Field = l$q;
    ej9.Fields = n$q;
    ej9.HttpRequest = PD8;
    ej9.HttpResponse = i$q;
    ej9.getHttpHandlerExtensionConfiguration = oj9;
    ej9.isValidHostname = tj9;
    ej9.resolveHttpHandlerRuntimeConfig = aj9
})
// @from(Ln 97678, Col 4)
qjq = p((jH9) => {
    var o$q = r$q();

    function wH9(q) {
        let {
            signer: K,
            signer: _
        } = q, z = Object.assign(q, {
            eventSigner: K,
            messageSigner: _
        }), Y = z.eventStreamPayloadHandlerProvider(z);
        return Object.assign(z, {
            eventStreamPayloadHandler: Y
        })
    }
    var a$q = (q) => (K, _) => async (z) => {
        let {
            request: Y
        } = z;
        if (!o$q.HttpRequest.isInstance(Y)) return K(z);
        return q.eventStreamPayloadHandler.handle(K, z, _)
    }, s$q = {
        tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
        name: "eventStreamHandlingMiddleware",
        relation: "after",
        toMiddleware: "awsAuthMiddleware",
        override: !0
    }, t$q = (q) => async (K) => {
        let {
            request: _
        } = K;
        if (!o$q.HttpRequest.isInstance(_)) return q(K);
        return _.headers = {
            ..._.headers,
            "content-type": "application/vnd.amazon.eventstream",
            "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
        }, q({
            ...K,
            request: _
        })
    }, e$q = {
        step: "build",
        tags: ["EVENT_STREAM", "HEADER", "CONTENT_TYPE", "CONTENT_SHA256"],
        name: "eventStreamHeaderMiddleware",
        override: !0
    }, $H9 = (q) => ({
        applyToStack: (K) => {
            K.addRelativeTo(a$q(q), s$q), K.add(t$q, e$q)
        }
    });
    jH9.eventStreamHandlingMiddleware = a$q;
    jH9.eventStreamHandlingMiddlewareOptions = s$q;
    jH9.eventStreamHeaderMiddleware = t$q;
    jH9.eventStreamHeaderMiddlewareOptions = e$q;
    jH9.getEventStreamPlugin = $H9;
    jH9.resolveEventStreamConfig = wH9
})
// @from(Ln 97735, Col 4)
zjq = p((dwO, _jq) => {
    var {
        defineProperty: WD8,
        getOwnPropertyDescriptor: DH9,
        getOwnPropertyNames: ZH9
    } = Object, fH9 = Object.prototype.hasOwnProperty, GH9 = (q, K) => WD8(q, "name", {
        value: K,
        configurable: !0
    }), vH9 = (q, K) => {
        for (var _ in K) WD8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, TH9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of ZH9(K))
                if (!fH9.call(q, Y) && Y !== _) WD8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = DH9(K, Y)) || z.enumerable
                })
        }
        return q
    }, VH9 = (q) => TH9(WD8({}, "__esModule", {
        value: !0
    }), q), Kjq = {};
    vH9(Kjq, {
        isArrayBuffer: () => kH9
    });
    _jq.exports = VH9(Kjq);
    var kH9 = GH9((q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 97766, Col 4)
dO6 = p((cwO, Ojq) => {
    var {
        defineProperty: DD8,
        getOwnPropertyDescriptor: NH9,
        getOwnPropertyNames: EH9
    } = Object, yH9 = Object.prototype.hasOwnProperty, Yjq = (q, K) => DD8(q, "name", {
        value: K,
        configurable: !0
    }), LH9 = (q, K) => {
        for (var _ in K) DD8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, hH9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of EH9(K))
                if (!yH9.call(q, Y) && Y !== _) DD8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = NH9(K, Y)) || z.enumerable
                })
        }
        return q
    }, RH9 = (q) => hH9(DD8({}, "__esModule", {
        value: !0
    }), q), Ajq = {};
    LH9(Ajq, {
        fromArrayBuffer: () => CH9,
        fromString: () => bH9
    });
    Ojq.exports = RH9(Ajq);
    var SH9 = zjq(),
        sD1 = d6("buffer"),
        CH9 = Yjq((q, K = 0, _ = q.byteLength - K) => {
            if (!(0, SH9.isArrayBuffer)(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return sD1.Buffer.from(q, K, _)
        }, "fromArrayBuffer"),
        bH9 = Yjq((q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? sD1.Buffer.from(q, K) : sD1.Buffer.from(q)
        }, "fromString")
})
// @from(Ln 97807, Col 4)
Jjq = p((lwO, Hjq) => {
    var {
        defineProperty: ZD8,
        getOwnPropertyDescriptor: IH9,
        getOwnPropertyNames: xH9
    } = Object, uH9 = Object.prototype.hasOwnProperty, tD1 = (q, K) => ZD8(q, "name", {
        value: K,
        configurable: !0
    }), mH9 = (q, K) => {
        for (var _ in K) ZD8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, BH9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of xH9(K))
                if (!uH9.call(q, Y) && Y !== _) ZD8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = IH9(K, Y)) || z.enumerable
                })
        }
        return q
    }, pH9 = (q) => BH9(ZD8({}, "__esModule", {
        value: !0
    }), q), wjq = {};
    mH9(wjq, {
        fromUtf8: () => jjq,
        toUint8Array: () => FH9,
        toUtf8: () => gH9
    });
    Hjq.exports = pH9(wjq);
    var $jq = dO6(),
        jjq = tD1((q) => {
            let K = (0, $jq.fromString)(q, "utf8");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        FH9 = tD1((q) => {
            if (typeof q === "string") return jjq(q);
            if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(q)
        }, "toUint8Array"),
        gH9 = tD1((q) => {
            if (typeof q === "string") return q;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, $jq.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 97854, Col 4)
Pjq = p((Xjq) => {
    Object.defineProperty(Xjq, "__esModule", {
        value: !0
    });
    Xjq.convertToBuffer = void 0;
    var UH9 = Jjq(),
        QH9 = typeof Buffer < "u" && Buffer.from ? function(q) {
            return Buffer.from(q, "utf8")
        } : UH9.fromUtf8;

    function dH9(q) {
        if (q instanceof Uint8Array) return q;
        if (typeof q === "string") return QH9(q);
        if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(q)
    }
    Xjq.convertToBuffer = dH9
})
// @from(Ln 97872, Col 4)
Zjq = p((Wjq) => {
    Object.defineProperty(Wjq, "__esModule", {
        value: !0
    });
    Wjq.isEmptyData = void 0;

    function cH9(q) {
        if (typeof q === "string") return q.length === 0;
        return q.byteLength === 0
    }
    Wjq.isEmptyData = cH9
})
// @from(Ln 97884, Col 4)
vjq = p((fjq) => {
    Object.defineProperty(fjq, "__esModule", {
        value: !0
    });
    fjq.numToUint8 = void 0;

    function lH9(q) {
        return new Uint8Array([(q & 4278190080) >> 24, (q & 16711680) >> 16, (q & 65280) >> 8, q & 255])
    }
    fjq.numToUint8 = lH9
})
// @from(Ln 97895, Col 4)
kjq = p((Tjq) => {
    Object.defineProperty(Tjq, "__esModule", {
        value: !0
    });
    Tjq.uint32ArrayFrom = void 0;

    function nH9(q) {
        if (!Uint32Array.from) {
            var K = new Uint32Array(q.length),
                _ = 0;
            while (_ < q.length) K[_] = q[_], _ += 1;
            return K
        }
        return Uint32Array.from(q)
    }
    Tjq.uint32ArrayFrom = nH9
})
// @from(Ln 97912, Col 4)
eD1 = p((AT6) => {
    Object.defineProperty(AT6, "__esModule", {
        value: !0
    });
    AT6.uint32ArrayFrom = AT6.numToUint8 = AT6.isEmptyData = AT6.convertToBuffer = void 0;
    var iH9 = Pjq();
    Object.defineProperty(AT6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return iH9.convertToBuffer
        }
    });
    var rH9 = Zjq();
    Object.defineProperty(AT6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return rH9.isEmptyData
        }
    });
    var oH9 = vjq();
    Object.defineProperty(AT6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return oH9.numToUint8
        }
    });
    var aH9 = kjq();
    Object.defineProperty(AT6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return aH9.uint32ArrayFrom
        }
    })
})
// @from(Ln 97946, Col 4)
hjq = p((yjq) => {
    Object.defineProperty(yjq, "__esModule", {
        value: !0
    });
    yjq.AwsCrc32 = void 0;
    var Njq = IV(),
        qZ1 = eD1(),
        Ejq = KZ1(),
        tH9 = function() {
            function q() {
                this.crc32 = new Ejq.Crc32
            }
            return q.prototype.update = function(K) {
                if ((0, qZ1.isEmptyData)(K)) return;
                this.crc32.update((0, qZ1.convertToBuffer)(K))
            }, q.prototype.digest = function() {
                return Njq.__awaiter(this, void 0, void 0, function() {
                    return Njq.__generator(this, function(K) {
                        return [2, (0, qZ1.numToUint8)(this.crc32.digest())]
                    })
                })
            }, q.prototype.reset = function() {
                this.crc32 = new Ejq.Crc32
            }, q
        }();
    yjq.AwsCrc32 = tH9
})
// @from(Ln 97973, Col 4)
KZ1 = p((_Z1) => {
    Object.defineProperty(_Z1, "__esModule", {
        value: !0
    });
    _Z1.AwsCrc32 = _Z1.Crc32 = _Z1.crc32 = void 0;
    var eH9 = IV(),
        qJ9 = eD1();

    function KJ9(q) {
        return new Rjq().update(q).digest()
    }
    _Z1.crc32 = KJ9;
    var Rjq = function() {
        function q() {
            this.checksum = 4294967295
        }
        return q.prototype.update = function(K) {
            var _, z;
            try {
                for (var Y = eH9.__values(K), A = Y.next(); !A.done; A = Y.next()) {
                    var O = A.value;
                    this.checksum = this.checksum >>> 8 ^ zJ9[(this.checksum ^ O) & 255]
                }
            } catch (w) {
                _ = {
                    error: w
                }
            } finally {
                try {
                    if (A && !A.done && (z = Y.return)) z.call(Y)
                } finally {
                    if (_) throw _.error
                }
            }
            return this
        }, q.prototype.digest = function() {
            return (this.checksum ^ 4294967295) >>> 0
        }, q
    }();
    _Z1.Crc32 = Rjq;
    var _J9 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
        zJ9 = (0, qJ9.uint32ArrayFrom)(_J9),
        YJ9 = hjq();
    Object.defineProperty(_Z1, "AwsCrc32", {
        enumerable: !0,
        get: function() {
            return YJ9.AwsCrc32
        }
    })
})
// @from(Ln 98023, Col 4)
Cjq = p((HJ9) => {
    var Sjq = {},
        zZ1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        Sjq[q] = K, zZ1[K] = q
    }

    function $J9(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in zZ1) K[_ / 2] = zZ1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }

    function jJ9(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += Sjq[q[_]];
        return K
    }
    HJ9.fromHex = $J9;
    HJ9.toHex = jJ9
})
// @from(Ln 98051, Col 4)
yl6 = p((NJ9) => {
    var xjq = KZ1(),
        cO6 = Cjq();
    class OT6 {
        bytes;
        constructor(q) {
            if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(q) {
            if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
            let K = new Uint8Array(8);
            for (let _ = 7, z = Math.abs(Math.round(q)); _ > -1 && z > 0; _--, z /= 256) K[_] = z;
            if (q < 0) bjq(K);
            return new OT6(K)
        }
        valueOf() {
            let q = this.bytes.slice(0),
                K = q[0] & 128;
            if (K) bjq(q);
            return parseInt(cO6.toHex(q), 16) * (K ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function bjq(q) {
        for (let K = 0; K < 8; K++) q[K] ^= 255;
        for (let K = 7; K > -1; K--)
            if (q[K]++, q[K] !== 0) break
    }
    class YZ1 {
        toUtf8;
        fromUtf8;
        constructor(q, K) {
            this.toUtf8 = q, this.fromUtf8 = K
        }
        format(q) {
            let K = [];
            for (let Y of Object.keys(q)) {
                let A = this.fromUtf8(Y);
                K.push(Uint8Array.from([A.byteLength]), A, this.formatHeaderValue(q[Y]))
            }
            let _ = new Uint8Array(K.reduce((Y, A) => Y + A.byteLength, 0)),
                z = 0;
            for (let Y of K) _.set(Y, z), z += Y.byteLength;
            return _
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
                    let _ = new DataView(new ArrayBuffer(5));
                    return _.setUint8(0, 4), _.setInt32(1, q.value, !1), new Uint8Array(_.buffer);
                case "long":
                    let z = new Uint8Array(9);
                    return z[0] = 5, z.set(q.value.bytes, 1), z;
                case "binary":
                    let Y = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                    Y.setUint8(0, 6), Y.setUint16(1, q.value.byteLength, !1);
                    let A = new Uint8Array(Y.buffer);
                    return A.set(q.value, 3), A;
                case "string":
                    let O = this.fromUtf8(q.value),
                        w = new DataView(new ArrayBuffer(3 + O.byteLength));
                    w.setUint8(0, 7), w.setUint16(1, O.byteLength, !1);
                    let $ = new Uint8Array(w.buffer);
                    return $.set(O, 3), $;
                case "timestamp":
                    let j = new Uint8Array(9);
                    return j[0] = 8, j.set(OT6.fromNumber(q.value.valueOf()).bytes, 1), j;
                case "uuid":
                    if (!TJ9.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                    let H = new Uint8Array(17);
                    return H[0] = 9, H.set(cO6.fromHex(q.value.replace(/\-/g, "")), 1), H
            }
        }
        parse(q) {
            let K = {},
                _ = 0;
            while (_ < q.byteLength) {
                let z = q.getUint8(_++),
                    Y = this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + _, z));
                switch (_ += z, q.getUint8(_++)) {
                    case 0:
                        K[Y] = {
                            type: Ijq,
                            value: !0
                        };
                        break;
                    case 1:
                        K[Y] = {
                            type: Ijq,
                            value: !1
                        };
                        break;
                    case 2:
                        K[Y] = {
                            type: MJ9,
                            value: q.getInt8(_++)
                        };
                        break;
                    case 3:
                        K[Y] = {
                            type: PJ9,
                            value: q.getInt16(_, !1)
                        }, _ += 2;
                        break;
                    case 4:
                        K[Y] = {
                            type: WJ9,
                            value: q.getInt32(_, !1)
                        }, _ += 4;
                        break;
                    case 5:
                        K[Y] = {
                            type: DJ9,
                            value: new OT6(new Uint8Array(q.buffer, q.byteOffset + _, 8))
                        }, _ += 8;
                        break;
                    case 6:
                        let A = q.getUint16(_, !1);
                        _ += 2, K[Y] = {
                            type: ZJ9,
                            value: new Uint8Array(q.buffer, q.byteOffset + _, A)
                        }, _ += A;
                        break;
                    case 7:
                        let O = q.getUint16(_, !1);
                        _ += 2, K[Y] = {
                            type: fJ9,
                            value: this.toUtf8(new Uint8Array(q.buffer, q.byteOffset + _, O))
                        }, _ += O;
                        break;
                    case 8:
                        K[Y] = {
                            type: GJ9,
                            value: new Date(new OT6(new Uint8Array(q.buffer, q.byteOffset + _, 8)).valueOf())
                        }, _ += 8;
                        break;
                    case 9:
                        let w = new Uint8Array(q.buffer, q.byteOffset + _, 16);
                        _ += 16, K[Y] = {
                            type: vJ9,
                            value: `${cO6.toHex(w.subarray(0,4))}-${cO6.toHex(w.subarray(4,6))}-${cO6.toHex(w.subarray(6,8))}-${cO6.toHex(w.subarray(8,10))}-${cO6.toHex(w.subarray(10))}`
                        };
                        break;
                    default:
                        throw Error("Unrecognized header type tag")
                }
            }
            return K
        }
    }
    var Ijq = "boolean",
        MJ9 = "byte",
        PJ9 = "short",
        WJ9 = "integer",
        DJ9 = "long",
        ZJ9 = "binary",
        fJ9 = "string",
        GJ9 = "timestamp",
        vJ9 = "uuid",
        TJ9 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        ujq = 4,
        g76 = ujq * 2,
        lO6 = 4,
        VJ9 = g76 + lO6 * 2;

    function kJ9({
        byteLength: q,
        byteOffset: K,
        buffer: _
    }) {
        if (q < VJ9) throw Error("Provided message too short to accommodate event stream message overhead");
        let z = new DataView(_, K, q),
            Y = z.getUint32(0, !1);
        if (q !== Y) throw Error("Reported message length does not match received message length");
        let A = z.getUint32(ujq, !1),
            O = z.getUint32(g76, !1),
            w = z.getUint32(q - lO6, !1),
            $ = new xjq.Crc32().update(new Uint8Array(_, K, g76));
        if (O !== $.digest()) throw Error(`The prelude checksum specified in the message (${O}) does not match the calculated CRC32 checksum (${$.digest()})`);
        if ($.update(new Uint8Array(_, K + g76, q - (g76 + lO6))), w !== $.digest()) throw Error(`The message checksum (${$.digest()}) did not match the expected value of ${w}`);
        return {
            headers: new DataView(_, K + g76 + lO6, A),
            body: new Uint8Array(_, K + g76 + lO6 + A, Y - A - (g76 + lO6 + lO6))
        }
    }
    class mjq {
        headerMarshaller;
        messageBuffer;
        isEndOfStream;
        constructor(q, K) {
            this.headerMarshaller = new YZ1(q, K), this.messageBuffer = [], this.isEndOfStream = !1
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
            let _ = this.headerMarshaller.format(q),
                z = _.byteLength + K.byteLength + 16,
                Y = new Uint8Array(z),
                A = new DataView(Y.buffer, Y.byteOffset, Y.byteLength),
                O = new xjq.Crc32;
            return A.setUint32(0, z, !1), A.setUint32(4, _.byteLength, !1), A.setUint32(8, O.update(Y.subarray(0, 8)).digest(), !1), Y.set(_, 12), Y.set(K, _.byteLength + 12), A.setUint32(z - 4, O.update(Y.subarray(8, z - 4)).digest(), !1), Y
        }
        decode(q) {
            let {
                headers: K,
                body: _
            } = kJ9(q);
            return {
                headers: this.headerMarshaller.parse(K),
                body: _
            }
        }
        formatHeaders(q) {
            return this.headerMarshaller.format(q)
        }
    }
    class Bjq {
        options;
        constructor(q) {
            this.options = q
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let q of this.options.inputStream) yield this.options.decoder.decode(q)
        }
    }
    class pjq {
        options;
        constructor(q) {
            this.options = q
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let q of this.options.messageStream) yield this.options.encoder.encode(q);
            if (this.options.includeEndFrame) yield new Uint8Array(0)
        }
    }
    class Fjq {
        options;
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
    }
    class gjq {
        options;
        constructor(q) {
            this.options = q
        } [Symbol.asyncIterator]() {
            return this.asyncIterator()
        }
        async * asyncIterator() {
            for await (let q of this.options.inputStream) yield this.options.serializer(q)
        }
    }
    NJ9.EventStreamCodec = mjq;
    NJ9.HeaderMarshaller = YZ1;
    NJ9.Int64 = OT6;
    NJ9.MessageDecoderStream = Bjq;
    NJ9.MessageEncoderStream = pjq;
    NJ9.SmithyMessageDecoderStream = Fjq;
    NJ9.SmithyMessageEncoderStream = gjq
})
// @from(Ln 98366, Col 4)
Qjq = p((xJ9) => {
    var Ujq = {},
        AZ1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        Ujq[q] = K, AZ1[K] = q
    }

    function bJ9(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in AZ1) K[_ / 2] = AZ1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }

    function IJ9(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += Ujq[q[_]];
        return K
    }
    xJ9.fromHex = bJ9;
    xJ9.toHex = IJ9
})
// @from(Ln 98394, Col 4)
djq = p((QJ9) => {
    QJ9.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(QJ9.HttpAuthLocation || (QJ9.HttpAuthLocation = {}));
    QJ9.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(QJ9.HttpApiKeyAuthLocation || (QJ9.HttpApiKeyAuthLocation = {}));
    QJ9.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(QJ9.EndpointURLScheme || (QJ9.EndpointURLScheme = {}));
    QJ9.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(QJ9.AlgorithmId || (QJ9.AlgorithmId = {}));
    var BJ9 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => QJ9.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => QJ9.AlgorithmId.MD5,
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
        pJ9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        FJ9 = (q) => {
            return BJ9(q)
        },
        gJ9 = (q) => {
            return pJ9(q)
        };
    QJ9.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(QJ9.FieldPosition || (QJ9.FieldPosition = {}));
    var UJ9 = "__smithy_context";
    QJ9.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(QJ9.IniSectionType || (QJ9.IniSectionType = {}));
    QJ9.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(QJ9.RequestHandlerProtocol || (QJ9.RequestHandlerProtocol = {}));
    QJ9.SMITHY_CONTEXT_KEY = UJ9;
    QJ9.getDefaultClientConfiguration = FJ9;
    QJ9.resolveDefaultRuntimeConfig = gJ9
})
// @from(Ln 98459, Col 4)
ijq = p((sJ9) => {
    var nJ9 = djq(),
        iJ9 = (q) => {
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
        rJ9 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class cjq {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = nJ9.FieldPosition.HEADER,
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
    class ljq {
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
    class fD8 {
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
            let K = new fD8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = oJ9(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return fD8.clone(this)
        }
    }

    function oJ9(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class njq {
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

    function aJ9(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    sJ9.Field = cjq;
    sJ9.Fields = ljq;
    sJ9.HttpRequest = fD8;
    sJ9.HttpResponse = njq;
    sJ9.getHttpHandlerExtensionConfiguration = iJ9;
    sJ9.isValidHostname = aJ9;
    sJ9.resolveHttpHandlerRuntimeConfig = rJ9
})
// @from(Ln 98601, Col 4)
rjq = p((wX9) => {
    var AX9 = WP8();

    function OX9(q) {
        let {
            port: K,
            query: _
        } = q, {
            protocol: z,
            path: Y,
            hostname: A
        } = q;
        if (z && z.slice(-1) !== ":") z += ":";
        if (K) A += `:${K}`;
        if (Y && Y.charAt(0) !== "/") Y = `/${Y}`;
        let O = _ ? AX9.buildQueryString(_) : "";
        if (O && O[0] !== "?") O = `?${O}`;
        let w = "";
        if (q.username != null || q.password != null) {
            let j = q.username ?? "",
                H = q.password ?? "";
            w = `${j}:${H}@`
        }
        let $ = "";
        if (q.fragment) $ = `#${q.fragment}`;
        return `${z}//${w}${A}${Y}${O}${$}`
    }
    wX9.formatUrl = OX9
})
// @from(Ln 98630, Col 4)
ojq = p((XX9) => {
    var hl6 = yl6();

    function jX9(q) {
        let K = 0,
            _ = 0,
            z = null,
            Y = null,
            A = (w) => {
                if (typeof w !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + w);
                K = w, _ = 4, z = new Uint8Array(w), new DataView(z.buffer).setUint32(0, w, !1)
            },
            O = async function*() {
                let w = q[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: $,
                        done: j
                    } = await w.next();
                    if (j) {
                        if (!K) return;
                        else if (K === _) yield z;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let H = $.length,
                        J = 0;
                    while (J < H) {
                        if (!z) {
                            let M = H - J;
                            if (!Y) Y = new Uint8Array(4);
                            let P = Math.min(4 - _, M);
                            if (Y.set($.slice(J, J + P), _), _ += P, J += P, _ < 4) break;
                            A(new DataView(Y.buffer).getUint32(0, !1)), Y = null
                        }
                        let X = Math.min(K - _, H - J);
                        if (z.set($.slice(J, J + X), _), _ += X, J += X, K && K === _) yield z, z = null, K = 0, _ = 0
                    }
                }
            };
        return {
            [Symbol.asyncIterator]: O
        }
    }

    function HX9(q, K) {
        return async function(_) {
            let {
                value: z
            } = _.headers[":message-type"];
            if (z === "error") {
                let Y = Error(_.headers[":error-message"].value || "UnknownError");
                throw Y.name = _.headers[":error-code"].value, Y
            } else if (z === "exception") {
                let Y = _.headers[":exception-type"].value,
                    A = {
                        [Y]: _
                    },
                    O = await q(A);
                if (O.$unknown) {
                    let w = Error(K(_.body));
                    throw w.name = Y, w
                }
                throw O[Y]
            } else if (z === "event") {
                let Y = {
                        [_.headers[":event-type"].value]: _
                    },
                    A = await q(Y);
                if (A.$unknown) return;
                return A
            } else throw Error(`Unrecognizable event type: ${_.headers[":event-type"].value}`)
        }
    }
    class XZ1 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.eventStreamCodec = new hl6.EventStreamCodec(q, K), this.utfEncoder = q
        }
        deserialize(q, K) {
            let _ = jX9(q);
            return new hl6.SmithyMessageDecoderStream({
                messageStream: new hl6.MessageDecoderStream({
                    inputStream: _,
                    decoder: this.eventStreamCodec
                }),
                deserializer: HX9(K, this.utfEncoder)
            })
        }
        serialize(q, K) {
            return new hl6.MessageEncoderStream({
                messageStream: new hl6.SmithyMessageEncoderStream({
                    inputStream: q,
                    serializer: K
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var JX9 = (q) => new XZ1(q);
    XX9.EventStreamMarshaller = XZ1;
    XX9.eventStreamSerdeProvider = JX9
})
// @from(Ln 98738, Col 4)
tjq = p((fX9) => {
    var WX9 = ojq(),
        ajq = (q) => ({
            [Symbol.asyncIterator]: async function*() {
                let K = q.getReader();
                try {
                    while (!0) {
                        let {
                            done: _,
                            value: z
                        } = await K.read();
                        if (_) return;
                        yield z
                    }
                } finally {
                    K.releaseLock()
                }
            }
        }),
        sjq = (q) => {
            let K = q[Symbol.asyncIterator]();
            return new ReadableStream({
                async pull(_) {
                    let {
                        done: z,
                        value: Y
                    } = await K.next();
                    if (z) return _.close();
                    _.enqueue(Y)
                }
            })
        };
    class MZ1 {
        universalMarshaller;
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.universalMarshaller = new WX9.EventStreamMarshaller({
                utf8Decoder: K,
                utf8Encoder: q
            })
        }
        deserialize(q, K) {
            let _ = DX9(q) ? ajq(q) : q;
            return this.universalMarshaller.deserialize(_, K)
        }
        serialize(q, K) {
            let _ = this.universalMarshaller.serialize(q, K);
            return typeof ReadableStream === "function" ? sjq(_) : _
        }
    }
    var DX9 = (q) => typeof ReadableStream === "function" && q instanceof ReadableStream,
        ZX9 = (q) => new MZ1(q);
    fX9.EventStreamMarshaller = MZ1;
    fX9.eventStreamSerdeProvider = ZX9;
    fX9.iterableToReadableStream = sjq;
    fX9.readableStreamtoIterable = ajq
})
// @from(Ln 98797, Col 4)
YHq = p((FX9) => {
    var kX9 = yl6(),
        NX9 = Qjq(),
        PZ1 = ijq(),
        EX9 = rjq(),
        qHq = tjq(),
        ejq = DO6(),
        yX9 = (q, K, _, z) => {
            let Y = q,
                A = {
                    start() {},
                    async transform(O, w) {
                        try {
                            let $ = new Date(Date.now() + await z()),
                                j = {
                                    ":date": {
                                        type: "timestamp",
                                        value: $
                                    }
                                },
                                H = await K.sign({
                                    message: {
                                        body: O,
                                        headers: j
                                    },
                                    priorSignature: Y
                                }, {
                                    signingDate: $
                                });
                            Y = H.signature;
                            let J = _.encode({
                                headers: {
                                    ...j,
                                    ":chunk-signature": {
                                        type: "binary",
                                        value: NX9.fromHex(H.signature)
                                    }
                                },
                                body: O
                            });
                            w.enqueue(J)
                        } catch ($) {
                            w.error($)
                        }
                    }
                };
            return new TransformStream({
                ...A
            })
        };
    class KHq {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(q) {
            this.messageSigner = q.messageSigner, this.eventStreamCodec = new kX9.EventStreamCodec(q.utf8Encoder, q.utf8Decoder), this.systemClockOffsetProvider = async () => q.systemClockOffset ?? 0
        }
        async handle(q, K, _ = {}) {
            let z = K.request,
                {
                    body: Y,
                    headers: A,
                    query: O
                } = z;
            if (!(Y instanceof ReadableStream)) throw Error("Eventstream payload must be a ReadableStream.");
            let w = new TransformStream;
            z.body = w.readable;
            let $;
            try {
                $ = await q(K)
            } catch (M) {
                throw z.body.cancel(), M
            }
            let H = ((A.authorization || "").match(/Signature=([\w]+)$/) || [])[1] || O && O["X-Amz-Signature"] || "",
                J = yX9(H, await this.messageSigner(), this.eventStreamCodec, this.systemClockOffsetProvider);
            return Y.pipeThrough(J).pipeThrough(w), $
        }
    }
    var LX9 = (q) => new KHq(q),
        hX9 = () => (q) => async (K) => {
            let _ = {
                    ...K.input
                },
                z = await q(K),
                Y = z.output;
            if (_.SessionId && Y.SessionId == null) Y.SessionId = _.SessionId;
            return z
        }, RX9 = {
            step: "initialize",
            name: "injectSessionIdMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            override: !0
        }, SX9 = (q, K) => (_) => (z) => {
            let {
                request: Y
            } = z;
            if (PZ1.HttpRequest.isInstance(Y) && q.requestHandler.metadata?.handlerProtocol?.toLowerCase().includes("websocket")) {
                Y.protocol = "wss:", Y.method = "GET", Y.path = `${Y.path}-websocket`;
                let {
                    headers: A
                } = Y;
                delete A["content-type"], delete A["x-amz-content-sha256"];
                for (let O of Object.keys(A))
                    if (O.indexOf(K.headerPrefix) === 0) {
                        let w = O.replace(K.headerPrefix, "");
                        Y.query[w] = A[O]
                    } if (A["x-amz-user-agent"]) Y.query["user-agent"] = A["x-amz-user-agent"];
                Y.headers = {
                    host: A.host ?? Y.hostname
                }
            }
            return _(z)
        }, CX9 = {
            name: "websocketEndpointMiddleware",
            tags: ["WEBSOCKET", "EVENT_STREAM"],
            relation: "after",
            toMiddleware: "eventStreamHeaderMiddleware",
            override: !0
        }, bX9 = (q, K) => ({
            applyToStack: (_) => {
                _.addRelativeTo(SX9(q, K), CX9), _.add(hX9(), RX9)
            }
        }), _Hq = (q) => q.protocol === "ws:" || q.protocol === "wss:";
    class zHq {
        signer;
        constructor(q) {
            this.signer = q.signer
        }
        presign(q, K = {}) {
            return this.signer.presign(q, K)
        }
        async sign(q, K) {
            if (PZ1.HttpRequest.isInstance(q) && _Hq(q)) return {
                ...await this.signer.presign({
                    ...q,
                    body: ""
                }, {
                    ...K,
                    expiresIn: 60,
                    unsignableHeaders: new Set(Object.keys(q.headers).filter((z) => z !== "host"))
                }),
                body: q.body
            };
            else return this.signer.sign(q, K)
        }
    }
    var IX9 = (q) => {
            let {
                signer: K
            } = q;
            return Object.assign(q, {
                signer: async (_) => {
                    let z = await K(_);
                    if (xX9(z)) return new zHq({
                        signer: z
                    });
                    throw Error("Expected WebsocketSignatureV4 signer, please check the client constructor.")
                }
            })
        },
        xX9 = (q) => !!q,
        uX9 = 2000;
    class WZ1 {
        metadata = {
            handlerProtocol: "websocket/h1.1"
        };
        config;
        configPromise;
        httpHandler;
        sockets = {};
        static create(q, K = new ejq.FetchHttpHandler) {
            if (typeof q?.handle === "function") return q;
            return new WZ1(q, K)
        }
        constructor(q, K = new ejq.FetchHttpHandler) {
            if (this.httpHandler = K, typeof q === "function") this.config = {}, this.configPromise = q().then((_) => this.config = _ ?? {});
            else this.config = q ?? {}, this.configPromise = Promise.resolve(this.config)
        }
        destroy() {
            for (let [q, K] of Object.entries(this.sockets)) {
                for (let _ of K) _.close(1000, "Socket closed through destroy() call");
                delete this.sockets[q]
            }
        }
        async handle(q) {
            if (!_Hq(q)) return this.httpHandler.handle(q);
            let K = EX9.formatUrl(q),
                _ = new WebSocket(K);
            if (!this.sockets[K]) this.sockets[K] = [];
            this.sockets[K].push(_), _.binaryType = "arraybuffer", this.config = await this.configPromise;
            let {
                connectionTimeout: z = uX9
            } = this.config;
            await this.waitForReady(_, z);
            let {
                body: Y
            } = q, A = mX9(Y), O = this.connect(_, A), w = BX9(O);
            return {
                response: new PZ1.HttpResponse({
                    statusCode: 200,
                    body: w
                })
            }
        }
        updateHttpClientConfig(q, K) {
            this.configPromise = this.configPromise.then((_) => {
                return _[q] = K, _
            })
        }
        httpHandlerConfigs() {
            return this.config ?? {}
        }
        removeNotUsableSockets(q) {
            this.sockets[q] = (this.sockets[q] ?? []).filter((K) => ![WebSocket.CLOSING, WebSocket.CLOSED].includes(K.readyState))
        }
        waitForReady(q, K) {
            return new Promise((_, z) => {
                let Y = setTimeout(() => {
                    this.removeNotUsableSockets(q.url), z({
                        $metadata: {
                            httpStatusCode: 500
                        }
                    })
                }, K);
                q.onopen = () => {
                    clearTimeout(Y), _()
                }
            })
        }
        connect(q, K) {
            let _ = void 0,
                z = !1,
                Y = () => {},
                A = () => {};
            q.onmessage = ($) => {
                A({
                    done: !1,
                    value: new Uint8Array($.data)
                })
            }, q.onerror = ($) => {
                z = !0, q.close(), Y($)
            }, q.onclose = () => {
                if (this.removeNotUsableSockets(q.url), z) return;
                if (_) Y(_);
                else A({
                    done: !0,
                    value: void 0
                })
            };
            let O = {
                [Symbol.asyncIterator]: () => ({
                    next: () => {
                        return new Promise(($, j) => {
                            A = $, Y = j
                        })
                    }
                })
            };
            return (async () => {
                try {
                    for await (let $ of K) q.send($)
                } catch ($) {
                    _ = $
                } finally {
                    q.close(1000)
                }
            })(), O
        }
    }
    var mX9 = (q) => {
            if (q[Symbol.asyncIterator]) return q;
            if (pX9(q)) return qHq.readableStreamtoIterable(q);
            return {
                [Symbol.asyncIterator]: async function*() {
                    yield q
                }
            }
        },
        BX9 = (q) => typeof ReadableStream === "function" ? qHq.iterableToReadableStream(q) : q,
        pX9 = (q) => typeof ReadableStream === "function" && q instanceof ReadableStream;
    FX9.WebSocketFetchHandler = WZ1;
    FX9.eventStreamPayloadHandlerProvider = LX9;
    FX9.getWebSocketPlugin = bX9;
    FX9.resolveWebSocketConfig = IX9
})
// @from(Ln 99082, Col 4)
AHq = p((lX9) => {
    var cX9 = (q) => Object.assign(q, {
        eventStreamMarshaller: q.eventStreamSerdeProvider(q)
    });
    lX9.resolveEventStreamSerdeConfig = cX9
})
// @from(Ln 99088, Col 4)
VZ1 = p((tX9) => {
    tX9.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tX9.HttpAuthLocation || (tX9.HttpAuthLocation = {}));
    tX9.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tX9.HttpApiKeyAuthLocation || (tX9.HttpApiKeyAuthLocation = {}));
    tX9.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(tX9.EndpointURLScheme || (tX9.EndpointURLScheme = {}));
    tX9.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(tX9.AlgorithmId || (tX9.AlgorithmId = {}));
    var iX9 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => tX9.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => tX9.AlgorithmId.MD5,
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
        rX9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        oX9 = (q) => {
            return iX9(q)
        },
        aX9 = (q) => {
            return rX9(q)
        };
    tX9.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(tX9.FieldPosition || (tX9.FieldPosition = {}));
    var sX9 = "__smithy_context";
    tX9.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(tX9.IniSectionType || (tX9.IniSectionType = {}));
    tX9.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(tX9.RequestHandlerProtocol || (tX9.RequestHandlerProtocol = {}));
    tX9.SMITHY_CONTEXT_KEY = sX9;
    tX9.getDefaultClientConfiguration = oX9;
    tX9.resolveDefaultRuntimeConfig = aX9
})
// @from(Ln 99153, Col 4)
Sl6 = p(($T6) => {
    var $Hq = gU(),
        LZ1 = XE(),
        NZ1 = VZ1(),
        _M9 = sj(),
        OHq = JE();
    class jHq {
        config;
        middlewareStack = $Hq.constructStack();
        initConfig;
        handlers;
        constructor(q) {
            this.config = q
        }
        send(q, K, _) {
            let z = typeof K !== "function" ? K : void 0,
                Y = typeof K === "function" ? K : _,
                A = z === void 0 && this.config.cacheMiddleware === !0,
                O;
            if (A) {
                if (!this.handlers) this.handlers = new WeakMap;
                let w = this.handlers;
                if (w.has(q.constructor)) O = w.get(q.constructor);
                else O = q.resolveMiddleware(this.middlewareStack, this.config, z), w.set(q.constructor, O)
            } else delete this.handlers, O = q.resolveMiddleware(this.middlewareStack, this.config, z);
            if (Y) O(q).then((w) => Y(null, w.output), (w) => Y(w)).catch(() => {});
            else return O(q).then((w) => w.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var kZ1 = "***SensitiveInformation***";

    function EZ1(q, K) {
        if (K == null) return K;
        let _ = _M9.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return kZ1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return kZ1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return kZ1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = EZ1(O, z[A]);
            return Y
        }
        return K
    }
    class hZ1 {
        middlewareStack = $Hq.constructStack();
        schema;
        static classBuilder() {
            return new HHq
        }
        resolveMiddlewareWithContext(q, K, _, {
            middlewareFn: z,
            clientName: Y,
            commandName: A,
            inputFilterSensitiveLog: O,
            outputFilterSensitiveLog: w,
            smithyContext: $,
            additionalContext: j,
            CommandCtor: H
        }) {
            for (let W of z.bind(this)(H, q, K, _)) this.middlewareStack.use(W);
            let J = q.concat(this.middlewareStack),
                {
                    logger: X
                } = K,
                M = {
                    logger: X,
                    clientName: Y,
                    commandName: A,
                    inputFilterSensitiveLog: O,
                    outputFilterSensitiveLog: w,
                    [NZ1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...j
                },
                {
                    requestHandler: P
                } = K;
            return J.resolve((W) => P.handle(W.request, _ || {}), M)
        }
    }
    class HHq {
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
        init(q) {
            this._init = q
        }
        ep(q) {
            return this._ep = q, this
        }
        m(q) {
            return this._middlewareFn = q, this
        }
        s(q, K, _ = {}) {
            return this._smithyContext = {
                service: q,
                operation: K,
                ..._
            }, this
        }
        c(q = {}) {
            return this._additionalContext = q, this
        }
        n(q, K) {
            return this._clientName = q, this._commandName = K, this
        }
        f(q = (_) => _, K = (_) => _) {
            return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
        }
        ser(q) {
            return this._serializer = q, this
        }
        de(q) {
            return this._deserializer = q, this
        }
        sc(q) {
            return this._operationSchema = q, this._smithyContext.operationSchema = q, this
        }
        build() {
            let q = this,
                K;
            return K = class extends hZ1 {
                input;
                static getEndpointParameterInstructions() {
                    return q._ep
                }
                constructor(...[_]) {
                    super();
                    this.input = _ ?? {}, q._init(this), this.schema = q._operationSchema
                }
                resolveMiddleware(_, z, Y) {
                    let A = q._operationSchema,
                        O = A?.[4] ?? A?.input,
                        w = A?.[5] ?? A?.output;
                    return this.resolveMiddlewareWithContext(_, z, Y, {
                        CommandCtor: K,
                        middlewareFn: q._middlewareFn,
                        clientName: q._clientName,
                        commandName: q._commandName,
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? EZ1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? EZ1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var zM9 = "***SensitiveInformation***",
        YM9 = (q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        };
    class wT6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(q) {
            super(q.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return wT6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === wT6) return wT6.isInstance(q);
            if (wT6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var JHq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        XHq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = OM9(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw JHq(O, K)
        },
        AM9 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                XHq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        OM9 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        wM9 = (q) => {
            switch (q) {
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
        wHq = !1,
        $M9 = (q) => {
            if (q && !wHq && parseInt(q.substring(1, q.indexOf("."))) < 16) wHq = !0
        },
        jM9 = (q) => {
            let K = [];
            for (let _ in NZ1.AlgorithmId) {
                let z = NZ1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        HM9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        JM9 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        XM9 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        MHq = (q) => {
            return Object.assign(jM9(q), JM9(q))
        },
        MM9 = MHq,
        PM9 = (q) => {
            return Object.assign(HM9(q), XM9(q))
        },
        WM9 = (q) => Array.isArray(q) ? q : [q],
        PHq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = PHq(q[_]);
            return q
        },
        DM9 = (q) => {
            return q != null
        };
    class WHq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function DHq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, GM9(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            ZHq(z, null, A, O)
        }
        return z
    }
    var ZM9 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        fM9 = (q, K) => {
            let _ = {};
            for (let z in K) ZHq(_, q, K, z);
            return _
        },
        GM9 = (q, K, _) => {
            return DHq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        ZHq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = vM9, $ = TM9, j = z] = O;
                if (typeof w === "function" && w(K[j]) || typeof w !== "function" && !!w) q[z] = $(K[j]);
                return
            }
            let [Y, A] = _[z];
            if (typeof A === "function") {
                let O, w = Y === void 0 && (O = A()) != null,
                    $ = typeof Y === "function" && !!Y(void 0) || typeof Y !== "function" && !!Y;
                if (w) q[z] = O;
                else if ($) q[z] = A()
            } else {
                let O = Y === void 0 && A != null,
                    w = typeof Y === "function" && !!Y(A) || typeof Y !== "function" && !!Y;
                if (O || w) q[z] = A
            }
        },
        vM9 = (q) => q != null,
        TM9 = (q) => q,
        VM9 = (q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        },
        kM9 = (q) => q.toISOString().replace(".000Z", "Z"),
        yZ1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(yZ1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = yZ1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty($T6, "collectBody", {
        enumerable: !0,
        get: function() {
            return LZ1.collectBody
        }
    });
    Object.defineProperty($T6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return LZ1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty($T6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return LZ1.resolvedPath
        }
    });
    $T6.Client = jHq;
    $T6.Command = hZ1;
    $T6.NoOpLogger = WHq;
    $T6.SENSITIVE_STRING = zM9;
    $T6.ServiceException = wT6;
    $T6._json = yZ1;
    $T6.convertMap = ZM9;
    $T6.createAggregatedClient = YM9;
    $T6.decorateServiceException = JHq;
    $T6.emitWarningIfUnsupportedVersion = $M9;
    $T6.getArrayIfSingleItem = WM9;
    $T6.getDefaultClientConfiguration = MM9;
    $T6.getDefaultExtensionConfiguration = MHq;
    $T6.getValueFromTextNode = PHq;
    $T6.isSerializableHeaderValue = DM9;
    $T6.loadConfigsForDefaultMode = wM9;
    $T6.map = DHq;
    $T6.resolveDefaultRuntimeConfig = PM9;
    $T6.serializeDateTime = kM9;
    $T6.serializeFloat = VM9;
    $T6.take = fM9;
    $T6.throwDefaultError = XHq;
    $T6.withBaseException = AM9;
    Object.keys(OHq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call($T6, q)) Object.defineProperty($T6, q, {
            enumerable: !0,
            get: function() {
                return OHq[q]
            }
        })
    })
})
// @from(Ln 99623, Col 4)
CZ1 = p((fHq) => {
    Object.defineProperty(fHq, "__esModule", {
        value: !0
    });
    fHq.resolveHttpAuthSchemeConfig = fHq.defaultBedrockRuntimeHttpAuthSchemeProvider = fHq.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = void 0;
    var iM9 = k$(),
        RZ1 = FO(),
        SZ1 = Dv(),
        rM9 = async (q, K, _) => {
            return {
                operation: (0, SZ1.getSmithyContext)(K).operation,
                region: await (0, SZ1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    fHq.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = rM9;

    function oM9(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "bedrock",
                region: q.region
            },
            propertiesExtractor: (K, _) => ({
                signingProperties: {
                    config: K,
                    context: _
                }
            })
        }
    }

    function aM9(q) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: K,
                filepath: _,
                configFilepath: z,
                ignoreCache: Y
            }, A) => ({
                identityProperties: {
                    profile: K,
                    filepath: _,
                    configFilepath: z,
                    ignoreCache: Y
                }
            })
        }
    }
    var sM9 = (q) => {
        let K = [];
        switch (q.operation) {
            default:
                K.push(oM9(q)), K.push(aM9(q))
        }
        return K
    };
    fHq.defaultBedrockRuntimeHttpAuthSchemeProvider = sM9;
    var tM9 = (q) => {
        let K = (0, RZ1.memoizeIdentityProvider)(q.token, RZ1.isIdentityExpired, RZ1.doesIdentityRequireRefresh),
            _ = (0, iM9.resolveAwsSdkSigV4Config)(q);
        return Object.assign(_, {
            authSchemePreference: (0, SZ1.normalizeProvider)(q.authSchemePreference ?? []),
            token: K
        })
    };
    fHq.resolveHttpAuthSchemeConfig = tM9
})
// @from(Ln 99694, Col 4)
vHq = p((D2O, KP9) => {
    KP9.exports = {
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
// @from(Ln 99799, Col 4)
kHq = p((AP9) => {
    var _P9 = yl6(),
        GD8 = d6("stream");
    class THq extends GD8.Transform {
        priorSignature;
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(q) {
            super({
                autoDestroy: !0,
                readableObjectMode: !0,
                writableObjectMode: !0,
                ...q
            });
            this.priorSignature = q.priorSignature, this.eventStreamCodec = q.eventStreamCodec, this.messageSigner = q.messageSigner, this.systemClockOffsetProvider = q.systemClockOffsetProvider
        }
        async _transform(q, K, _) {
            try {
                let z = new Date(Date.now() + await this.systemClockOffsetProvider()),
                    Y = {
                        ":date": {
                            type: "timestamp",
                            value: z
                        }
                    },
                    A = await this.messageSigner.sign({
                        message: {
                            body: q,
                            headers: Y
                        },
                        priorSignature: this.priorSignature
                    }, {
                        signingDate: z
                    });
                this.priorSignature = A.signature;
                let O = this.eventStreamCodec.encode({
                    headers: {
                        ...Y,
                        ":chunk-signature": {
                            type: "binary",
                            value: zP9(A.signature)
                        }
                    },
                    body: q
                });
                return this.push(O), _()
            } catch (z) {
                _(z)
            }
        }
    }

    function zP9(q) {
        let K = Buffer.from(q, "hex");
        return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }
    class VHq {
        messageSigner;
        eventStreamCodec;
        systemClockOffsetProvider;
        constructor(q) {
            this.messageSigner = q.messageSigner, this.eventStreamCodec = new _P9.EventStreamCodec(q.utf8Encoder, q.utf8Decoder), this.systemClockOffsetProvider = async () => q.systemClockOffset ?? 0
        }
        async handle(q, K, _ = {}) {
            let z = K.request,
                {
                    body: Y,
                    query: A
                } = z;
            if (!(Y instanceof GD8.Readable)) throw Error("Eventstream payload must be a Readable stream.");
            let O = Y;
            z.body = new GD8.PassThrough({
                objectMode: !0
            });
            let $ = z.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? A?.["X-Amz-Signature"] ?? "",
                j = new THq({
                    priorSignature: $,
                    eventStreamCodec: this.eventStreamCodec,
                    messageSigner: await this.messageSigner(),
                    systemClockOffsetProvider: this.systemClockOffsetProvider
                });
            GD8.pipeline(O, j, z.body, (J) => {
                if (J) throw J
            });
            let H;
            try {
                H = await q(K)
            } catch (J) {
                throw z.body.end(), J
            }
            return H
        }
    }
    var YP9 = (q) => new VHq(q);
    AP9.eventStreamPayloadHandlerProvider = YP9
})
// @from(Ln 99896, Col 4)
NHq = p((HP9) => {
    var Cl6 = yl6();

    function wP9(q) {
        let K = 0,
            _ = 0,
            z = null,
            Y = null,
            A = (w) => {
                if (typeof w !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + w);
                K = w, _ = 4, z = new Uint8Array(w), new DataView(z.buffer).setUint32(0, w, !1)
            },
            O = async function*() {
                let w = q[Symbol.asyncIterator]();
                while (!0) {
                    let {
                        value: $,
                        done: j
                    } = await w.next();
                    if (j) {
                        if (!K) return;
                        else if (K === _) yield z;
                        else throw Error("Truncated event message received.");
                        return
                    }
                    let H = $.length,
                        J = 0;
                    while (J < H) {
                        if (!z) {
                            let M = H - J;
                            if (!Y) Y = new Uint8Array(4);
                            let P = Math.min(4 - _, M);
                            if (Y.set($.slice(J, J + P), _), _ += P, J += P, _ < 4) break;
                            A(new DataView(Y.buffer).getUint32(0, !1)), Y = null
                        }
                        let X = Math.min(K - _, H - J);
                        if (z.set($.slice(J, J + X), _), _ += X, J += X, K && K === _) yield z, z = null, K = 0, _ = 0
                    }
                }
            };
        return {
            [Symbol.asyncIterator]: O
        }
    }

    function $P9(q, K) {
        return async function(_) {
            let {
                value: z
            } = _.headers[":message-type"];
            if (z === "error") {
                let Y = Error(_.headers[":error-message"].value || "UnknownError");
                throw Y.name = _.headers[":error-code"].value, Y
            } else if (z === "exception") {
                let Y = _.headers[":exception-type"].value,
                    A = {
                        [Y]: _
                    },
                    O = await q(A);
                if (O.$unknown) {
                    let w = Error(K(_.body));
                    throw w.name = Y, w
                }
                throw O[Y]
            } else if (z === "event") {
                let Y = {
                        [_.headers[":event-type"].value]: _
                    },
                    A = await q(Y);
                if (A.$unknown) return;
                return A
            } else throw Error(`Unrecognizable event type: ${_.headers[":event-type"].value}`)
        }
    }
    class bZ1 {
        eventStreamCodec;
        utfEncoder;
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.eventStreamCodec = new Cl6.EventStreamCodec(q, K), this.utfEncoder = q
        }
        deserialize(q, K) {
            let _ = wP9(q);
            return new Cl6.SmithyMessageDecoderStream({
                messageStream: new Cl6.MessageDecoderStream({
                    inputStream: _,
                    decoder: this.eventStreamCodec
                }),
                deserializer: $P9(K, this.utfEncoder)
            })
        }
        serialize(q, K) {
            return new Cl6.MessageEncoderStream({
                messageStream: new Cl6.SmithyMessageEncoderStream({
                    inputStream: q,
                    serializer: K
                }),
                encoder: this.eventStreamCodec,
                includeEndFrame: !0
            })
        }
    }
    var jP9 = (q) => new bZ1(q);
    HP9.EventStreamMarshaller = bZ1;
    HP9.eventStreamSerdeProvider = jP9
})
// @from(Ln 100004, Col 4)
EHq = p((ZP9) => {
    var MP9 = NHq(),
        PP9 = d6("stream");
    async function* WP9(q) {
        let K = !1,
            _ = !1,
            z = [];
        q.on("error", (Y) => {
            if (!K) K = !0;
            if (Y) throw Y
        }), q.on("data", (Y) => {
            z.push(Y)
        }), q.on("end", () => {
            K = !0
        });
        while (!_) {
            let Y = await new Promise((A) => setTimeout(() => A(z.shift()), 0));
            if (Y) yield Y;
            _ = K && z.length === 0
        }
    }
    class IZ1 {
        universalMarshaller;
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.universalMarshaller = new MP9.EventStreamMarshaller({
                utf8Decoder: K,
                utf8Encoder: q
            })
        }
        deserialize(q, K) {
            let _ = typeof q[Symbol.asyncIterator] === "function" ? q : WP9(q);
            return this.universalMarshaller.deserialize(_, K)
        }
        serialize(q, K) {
            return PP9.Readable.from(this.universalMarshaller.serialize(q, K))
        }
    }
    var DP9 = (q) => new IZ1(q);
    ZP9.EventStreamMarshaller = IZ1;
    ZP9.eventStreamSerdeProvider = DP9
})
// @from(Ln 100048, Col 4)
yHq = p((TP9) => {
    var vP9 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    TP9.isArrayBuffer = vP9
})
// @from(Ln 100052, Col 4)
uZ1 = p((yP9) => {
    var kP9 = yHq(),
        xZ1 = d6("buffer"),
        NP9 = (q, K = 0, _ = q.byteLength - K) => {
            if (!kP9.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return xZ1.Buffer.from(q, K, _)
        },
        EP9 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? xZ1.Buffer.from(q, K) : xZ1.Buffer.from(q)
        };
    yP9.fromArrayBuffer = NP9;
    yP9.fromString = EP9
})
// @from(Ln 100066, Col 4)
RHq = p((LHq) => {
    Object.defineProperty(LHq, "__esModule", {
        value: !0
    });
    LHq.fromBase64 = void 0;
    var RP9 = uZ1(),
        SP9 = /^[A-Za-z0-9+/]*={0,2}$/,
        CP9 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!SP9.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, RP9.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    LHq.fromBase64 = CP9
})
// @from(Ln 100081, Col 4)
bHq = p((SHq) => {
    Object.defineProperty(SHq, "__esModule", {
        value: !0
    });
    SHq.toBase64 = void 0;
    var bP9 = uZ1(),
        IP9 = nw(),
        xP9 = (q) => {
            let K;
            if (typeof q === "string") K = (0, IP9.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, bP9.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    SHq.toBase64 = xP9
})
// @from(Ln 100097, Col 4)
uHq = p((bl6) => {
    var IHq = RHq(),
        xHq = bHq();
    Object.keys(IHq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(bl6, q)) Object.defineProperty(bl6, q, {
            enumerable: !0,
            get: function() {
                return IHq[q]
            }
        })
    });
    Object.keys(xHq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(bl6, q)) Object.defineProperty(bl6, q, {
            enumerable: !0,
            get: function() {
                return xHq[q]
            }
        })
    })
})