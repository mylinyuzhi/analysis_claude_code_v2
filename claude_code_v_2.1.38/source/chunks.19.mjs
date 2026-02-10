
// @from(Ln 57901, Col 4)
tX8 = R((NVK) => {
    var WVK = rX8(),
        GVK = (A) => {
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
        ZVK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class oX8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = WVK.FieldPosition.HEADER,
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
    class aX8 {
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
    class ht1 {
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
            let q = new ht1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = fVK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return ht1.clone(this)
        }
    }

    function fVK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class sX8 {
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

    function VVK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    NVK.Field = oX8;
    NVK.Fields = aX8;
    NVK.HttpRequest = ht1;
    NVK.HttpResponse = sX8;
    NVK.getHttpHandlerExtensionConfiguration = GVK;
    NVK.isValidHostname = VVK;
    NVK.resolveHttpHandlerRuntimeConfig = ZVK
})
// @from(Ln 58043, Col 4)
rg6 = R((bVK) => {
    bVK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(bVK.HttpAuthLocation || (bVK.HttpAuthLocation = {}));
    bVK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(bVK.HttpApiKeyAuthLocation || (bVK.HttpApiKeyAuthLocation = {}));
    bVK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(bVK.EndpointURLScheme || (bVK.EndpointURLScheme = {}));
    bVK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(bVK.AlgorithmId || (bVK.AlgorithmId = {}));
    var CVK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => bVK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => bVK.AlgorithmId.MD5,
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
        SVK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        hVK = (A) => {
            return CVK(A)
        },
        IVK = (A) => {
            return SVK(A)
        };
    bVK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(bVK.FieldPosition || (bVK.FieldPosition = {}));
    var xVK = "__smithy_context";
    bVK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(bVK.IniSectionType || (bVK.IniSectionType = {}));
    bVK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(bVK.RequestHandlerProtocol || (bVK.RequestHandlerProtocol = {}));
    bVK.SMITHY_CONTEXT_KEY = xVK;
    bVK.getDefaultClientConfiguration = hVK;
    bVK.resolveDefaultRuntimeConfig = IVK
})
// @from(Ln 58108, Col 4)
xt1 = R((dVK) => {
    var FVK = rg6(),
        QVK = (A) => {
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
        gVK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class eX8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = FVK.FieldPosition.HEADER,
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
    class AD8 {
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
    class It1 {
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
            let q = new It1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = UVK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return It1.clone(this)
        }
    }

    function UVK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class qD8 {
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

    function pVK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    dVK.Field = eX8;
    dVK.Fields = AD8;
    dVK.HttpRequest = It1;
    dVK.HttpResponse = qD8;
    dVK.getHttpHandlerExtensionConfiguration = QVK;
    dVK.isValidHostname = pVK;
    dVK.resolveHttpHandlerRuntimeConfig = gVK
})
// @from(Ln 58250, Col 4)
wX = R((ANK) => {
    class TH1 extends Error {
        name = "ProviderError";
        tryNextLink;
        constructor(A, q = !0) {
            let K, Y = !0;
            if (typeof q === "boolean") K = void 0, Y = q;
            else if (q != null && typeof q === "object") K = q.logger, Y = q.tryNextLink ?? !0;
            super(A);
            this.tryNextLink = Y, Object.setPrototypeOf(this, TH1.prototype), K?.debug?.(`@smithy/property-provider ${Y?"->":"(!)"} ${A}`)
        }
        static from(A, q = !0) {
            return Object.assign(new this(A.message, q), A)
        }
    }
    class og6 extends TH1 {
        name = "CredentialsProviderError";
        constructor(A, q = !0) {
            super(A, q);
            Object.setPrototypeOf(this, og6.prototype)
        }
    }
    class ag6 extends TH1 {
        name = "TokenProviderError";
        constructor(A, q = !0) {
            super(A, q);
            Object.setPrototypeOf(this, ag6.prototype)
        }
    }
    var sVK = (...A) => async () => {
        if (A.length === 0) throw new TH1("No providers in chain");
        let q;
        for (let K of A) try {
            return await K()
        } catch (Y) {
            if (q = Y, Y?.tryNextLink) continue;
            throw Y
        }
        throw q
    }, tVK = (A) => () => Promise.resolve(A), eVK = (A, q, K) => {
        let Y, z, w, H = !1,
            $ = async () => {
                if (!z) z = A();
                try {
                    Y = await z, w = !0, H = !1
                } finally {
                    z = void 0
                }
                return Y
            };
        if (q === void 0) return async (O) => {
            if (!w || O?.forceRefresh) Y = await $();
            return Y
        };
        return async (O) => {
            if (!w || O?.forceRefresh) Y = await $();
            if (H) return Y;
            if (K && !K(Y)) return H = !0, Y;
            if (q(Y)) return await $(), Y;
            return Y
        }
    };
    ANK.CredentialsProviderError = og6;
    ANK.ProviderError = TH1;
    ANK.TokenProviderError = ag6;
    ANK.chain = sVK;
    ANK.fromStatic = tVK;
    ANK.memoize = eVK
})
// @from(Ln 58319, Col 4)
of = R((XNK) => {
    var sg6 = {
            warningEmitted: !1
        },
        $NK = (A) => {
            if (A && !sg6.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) sg6.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function ONK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }

    function _NK(A, q, K) {
        if (!A.__aws_sdk_context) A.__aws_sdk_context = {
            features: {}
        };
        else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
        A.__aws_sdk_context.features[q] = K
    }

    function JNK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }
    XNK.emitWarningIfUnsupportedVersion = $NK;
    XNK.setCredentialFeature = ONK;
    XNK.setFeature = _NK;
    XNK.setTokenFeature = JNK;
    XNK.state = sg6
})
// @from(Ln 58356, Col 4)
YD8 = R((fNK) => {
    var KD8 = {},
        tg6 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        KD8[A] = q, tg6[q] = A
    }

    function GNK(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in tg6) q[K / 2] = tg6[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function ZNK(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += KD8[A[K]];
        return q
    }
    fNK.fromHex = GNK;
    fNK.toHex = ZNK
})
// @from(Ln 58384, Col 4)
zD8 = R((vNK) => {
    var TNK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    vNK.isArrayBuffer = TNK
})
// @from(Ln 58388, Col 4)
HD8 = R((RNK) => {
    var wD8 = (A) => encodeURIComponent(A).replace(/[!'()*]/g, kNK),
        kNK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        LNK = (A) => A.split("/").map(wD8).join("/");
    RNK.escapeUri = wD8;
    RNK.escapeUriPath = LNK
})
// @from(Ln 58395, Col 4)
_U6 = R((gNK) => {
    var Si = YD8(),
        DA1 = Z2(),
        SNK = zD8(),
        JD8 = xt1(),
        $D8 = iP(),
        bt1 = HD8(),
        XD8 = "X-Amz-Algorithm",
        DD8 = "X-Amz-Credential",
        qU6 = "X-Amz-Date",
        jD8 = "X-Amz-SignedHeaders",
        MD8 = "X-Amz-Expires",
        KU6 = "X-Amz-Signature",
        YU6 = "X-Amz-Security-Token",
        hNK = "X-Amz-Region-Set",
        zU6 = "authorization",
        wU6 = qU6.toLowerCase(),
        PD8 = "date",
        WD8 = [zU6, wU6, PD8],
        GD8 = KU6.toLowerCase(),
        Qt1 = "x-amz-content-sha256",
        ZD8 = YU6.toLowerCase(),
        INK = "host",
        fD8 = {
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
        VD8 = /^proxy-/,
        ND8 = /^sec-/,
        xNK = [/^proxy-/i, /^sec-/i],
        ut1 = "AWS4-HMAC-SHA256",
        bNK = "AWS4-ECDSA-P256-SHA256",
        TD8 = "AWS4-HMAC-SHA256-PAYLOAD",
        vD8 = "UNSIGNED-PAYLOAD",
        ED8 = 50,
        HU6 = "aws4_request",
        kD8 = 604800,
        vH1 = {},
        Bt1 = [],
        mt1 = (A, q, K) => `${A}/${q}/${K}/${HU6}`,
        LD8 = async (A, q, K, Y, z) => {
            let w = await OD8(A, q.secretAccessKey, q.accessKeyId),
                H = `${K}:${Y}:${z}:${Si.toHex(w)}:${q.sessionToken}`;
            if (H in vH1) return vH1[H];
            Bt1.push(H);
            while (Bt1.length > ED8) delete vH1[Bt1.shift()];
            let $ = `AWS4${q.secretAccessKey}`;
            for (let O of [K, Y, z, HU6]) $ = await OD8(A, $, O);
            return vH1[H] = $
        }, uNK = () => {
            Bt1.length = 0, Object.keys(vH1).forEach((A) => {
                delete vH1[A]
            })
        }, OD8 = (A, q, K) => {
            let Y = new A(q);
            return Y.update(DA1.toUint8Array(K)), Y.digest()
        }, eg6 = ({
            headers: A
        }, q, K) => {
            let Y = {};
            for (let z of Object.keys(A).sort()) {
                if (A[z] == null) continue;
                let w = z.toLowerCase();
                if (w in fD8 || q?.has(w) || VD8.test(w) || ND8.test(w)) {
                    if (!K || K && !K.has(w)) continue
                }
                Y[w] = A[z].trim().replace(/\s+/g, " ")
            }
            return Y
        }, Ft1 = async ({
            headers: A,
            body: q
        }, K) => {
            for (let Y of Object.keys(A))
                if (Y.toLowerCase() === Qt1) return A[Y];
            if (q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof q === "string" || ArrayBuffer.isView(q) || SNK.isArrayBuffer(q)) {
                let Y = new K;
                return Y.update(DA1.toUint8Array(q)), Si.toHex(await Y.digest())
            }
            return vD8
        };
    class RD8 {
        format(A) {
            let q = [];
            for (let z of Object.keys(A)) {
                let w = DA1.fromUtf8(z);
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
                    let H = DA1.fromUtf8(A.value),
                        $ = new DataView(new ArrayBuffer(3 + H.byteLength));
                    $.setUint8(0, 7), $.setUint16(1, H.byteLength, !1);
                    let O = new Uint8Array($.buffer);
                    return O.set(H, 3), O;
                case "timestamp":
                    let _ = new Uint8Array(9);
                    return _[0] = 8, _.set($U6.fromNumber(A.value.valueOf()).bytes, 1), _;
                case "uuid":
                    if (!BNK.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
                    let J = new Uint8Array(17);
                    return J[0] = 9, J.set(Si.fromHex(A.value.replace(/\-/g, "")), 1), J
            }
        }
    }
    var BNK = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    class $U6 {
        bytes;
        constructor(A) {
            if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(A) {
            if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
            let q = new Uint8Array(8);
            for (let K = 7, Y = Math.abs(Math.round(A)); K > -1 && Y > 0; K--, Y /= 256) q[K] = Y;
            if (A < 0) _D8(q);
            return new $U6(q)
        }
        valueOf() {
            let A = this.bytes.slice(0),
                q = A[0] & 128;
            if (q) _D8(A);
            return parseInt(Si.toHex(A), 16) * (q ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function _D8(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    var yD8 = (A, q) => {
            A = A.toLowerCase();
            for (let K of Object.keys(q))
                if (A === K.toLowerCase()) return !0;
            return !1
        },
        CD8 = (A, q = {}) => {
            let {
                headers: K,
                query: Y = {}
            } = JD8.HttpRequest.clone(A);
            for (let z of Object.keys(K)) {
                let w = z.toLowerCase();
                if (w.slice(0, 6) === "x-amz-" && !q.unhoistableHeaders?.has(w) || q.hoistableHeaders?.has(w)) Y[z] = K[z], delete K[z]
            }
            return {
                ...A,
                headers: K,
                query: Y
            }
        },
        AU6 = (A) => {
            A = JD8.HttpRequest.clone(A);
            for (let q of Object.keys(A.headers))
                if (WD8.indexOf(q.toLowerCase()) > -1) delete A.headers[q];
            return A
        },
        SD8 = ({
            query: A = {}
        }) => {
            let q = [],
                K = {};
            for (let Y of Object.keys(A)) {
                if (Y.toLowerCase() === GD8) continue;
                let z = bt1.escapeUri(Y);
                q.push(z);
                let w = A[Y];
                if (typeof w === "string") K[z] = `${z}=${bt1.escapeUri(w)}`;
                else if (Array.isArray(w)) K[z] = w.slice(0).reduce((H, $) => H.concat([`${z}=${bt1.escapeUri($)}`]), []).sort().join("&")
            }
            return q.sort().map((Y) => K[Y]).filter((Y) => Y).join("&")
        },
        mNK = (A) => FNK(A).toISOString().replace(/\.\d{3}Z$/, "Z"),
        FNK = (A) => {
            if (typeof A === "number") return new Date(A * 1000);
            if (typeof A === "string") {
                if (Number(A)) return new Date(Number(A) * 1000);
                return new Date(A)
            }
            return A
        };
    class OU6 {
        service;
        regionProvider;
        credentialProvider;
        sha256;
        uriEscapePath;
        applyChecksum;
        constructor({
            applyChecksum: A,
            credentials: q,
            region: K,
            service: Y,
            sha256: z,
            uriEscapePath: w = !0
        }) {
            this.service = Y, this.sha256 = z, this.uriEscapePath = w, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = $D8.normalizeProvider(K), this.credentialProvider = $D8.normalizeProvider(q)
        }
        createCanonicalRequest(A, q, K) {
            let Y = Object.keys(q).sort();
            return `${A.method}
${this.getCanonicalPath(A)}
${SD8(A)}
${Y.map((z)=>`${z}:${q[z]}`).join(`
`)}

${Y.join(";")}
${K}`
        }
        async createStringToSign(A, q, K, Y) {
            let z = new this.sha256;
            z.update(DA1.toUint8Array(K));
            let w = await z.digest();
            return `${Y}
${A}
${q}
${Si.toHex(w)}`
        }
        getCanonicalPath({
            path: A
        }) {
            if (this.uriEscapePath) {
                let q = [];
                for (let z of A.split("/")) {
                    if (z?.length === 0) continue;
                    if (z === ".") continue;
                    if (z === "..") q.pop();
                    else q.push(z)
                }
                let K = `${A?.startsWith("/")?"/":""}${q.join("/")}${q.length>0&&A?.endsWith("/")?"/":""}`;
                return bt1.escapeUri(K).replace(/%2F/g, "/")
            }
            return A
        }
        validateResolvedCredentials(A) {
            if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
        }
        formatDate(A) {
            let q = mNK(A).replace(/[\-:]/g, "");
            return {
                longDate: q,
                shortDate: q.slice(0, 8)
            }
        }
        getCanonicalHeaderList(A) {
            return Object.keys(A).sort().join(";")
        }
    }
    class hD8 extends OU6 {
        headerFormatter = new RD8;
        constructor({
            applyChecksum: A,
            credentials: q,
            region: K,
            service: Y,
            sha256: z,
            uriEscapePath: w = !0
        }) {
            super({
                applyChecksum: A,
                credentials: q,
                region: K,
                service: Y,
                sha256: z,
                uriEscapePath: w
            })
        }
        async presign(A, q = {}) {
            let {
                signingDate: K = new Date,
                expiresIn: Y = 3600,
                unsignableHeaders: z,
                unhoistableHeaders: w,
                signableHeaders: H,
                hoistableHeaders: $,
                signingRegion: O,
                signingService: _
            } = q, J = await this.credentialProvider();
            this.validateResolvedCredentials(J);
            let X = O ?? await this.regionProvider(),
                {
                    longDate: D,
                    shortDate: j
                } = this.formatDate(K);
            if (Y > kD8) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
            let M = mt1(j, X, _ ?? this.service),
                P = CD8(AU6(A), {
                    unhoistableHeaders: w,
                    hoistableHeaders: $
                });
            if (J.sessionToken) P.query[YU6] = J.sessionToken;
            P.query[XD8] = ut1, P.query[DD8] = `${J.accessKeyId}/${M}`, P.query[qU6] = D, P.query[MD8] = Y.toString(10);
            let W = eg6(P, z, H);
            return P.query[jD8] = this.getCanonicalHeaderList(W), P.query[KU6] = await this.getSignature(D, M, this.getSigningKey(J, X, j, _), this.createCanonicalRequest(P, W, await Ft1(A, this.sha256))), P
        }
        async sign(A, q) {
            if (typeof A === "string") return this.signString(A, q);
            else if (A.headers && A.payload) return this.signEvent(A, q);
            else if (A.message) return this.signMessage(A, q);
            else return this.signRequest(A, q)
        }
        async signEvent({
            headers: A,
            payload: q
        }, {
            signingDate: K = new Date,
            priorSignature: Y,
            signingRegion: z,
            signingService: w
        }) {
            let H = z ?? await this.regionProvider(),
                {
                    shortDate: $,
                    longDate: O
                } = this.formatDate(K),
                _ = mt1($, H, w ?? this.service),
                J = await Ft1({
                    headers: {},
                    body: q
                }, this.sha256),
                X = new this.sha256;
            X.update(A);
            let D = Si.toHex(await X.digest()),
                j = [TD8, O, _, Y, D, J].join(`
`);
            return this.signString(j, {
                signingDate: K,
                signingRegion: H,
                signingService: w
            })
        }
        async signMessage(A, {
            signingDate: q = new Date,
            signingRegion: K,
            signingService: Y
        }) {
            return this.signEvent({
                headers: this.headerFormatter.format(A.message.headers),
                payload: A.message.body
            }, {
                signingDate: q,
                signingRegion: K,
                signingService: Y,
                priorSignature: A.priorSignature
            }).then((w) => {
                return {
                    message: A.message,
                    signature: w
                }
            })
        }
        async signString(A, {
            signingDate: q = new Date,
            signingRegion: K,
            signingService: Y
        } = {}) {
            let z = await this.credentialProvider();
            this.validateResolvedCredentials(z);
            let w = K ?? await this.regionProvider(),
                {
                    shortDate: H
                } = this.formatDate(q),
                $ = new this.sha256(await this.getSigningKey(z, w, H, Y));
            return $.update(DA1.toUint8Array(A)), Si.toHex(await $.digest())
        }
        async signRequest(A, {
            signingDate: q = new Date,
            signableHeaders: K,
            unsignableHeaders: Y,
            signingRegion: z,
            signingService: w
        } = {}) {
            let H = await this.credentialProvider();
            this.validateResolvedCredentials(H);
            let $ = z ?? await this.regionProvider(),
                O = AU6(A),
                {
                    longDate: _,
                    shortDate: J
                } = this.formatDate(q),
                X = mt1(J, $, w ?? this.service);
            if (O.headers[wU6] = _, H.sessionToken) O.headers[ZD8] = H.sessionToken;
            let D = await Ft1(O, this.sha256);
            if (!yD8(Qt1, O.headers) && this.applyChecksum) O.headers[Qt1] = D;
            let j = eg6(O, Y, K),
                M = await this.getSignature(_, X, this.getSigningKey(H, $, J, w), this.createCanonicalRequest(O, j, D));
            return O.headers[zU6] = `${ut1} Credential=${H.accessKeyId}/${X}, SignedHeaders=${this.getCanonicalHeaderList(j)}, Signature=${M}`, O
        }
        async getSignature(A, q, K, Y) {
            let z = await this.createStringToSign(A, q, Y, ut1),
                w = new this.sha256(await K);
            return w.update(DA1.toUint8Array(z)), Si.toHex(await w.digest())
        }
        getSigningKey(A, q, K, Y) {
            return LD8(this.sha256, A, K, q, Y || this.service)
        }
    }
    var QNK = {
        SignatureV4a: null
    };
    gNK.ALGORITHM_IDENTIFIER = ut1;
    gNK.ALGORITHM_IDENTIFIER_V4A = bNK;
    gNK.ALGORITHM_QUERY_PARAM = XD8;
    gNK.ALWAYS_UNSIGNABLE_HEADERS = fD8;
    gNK.AMZ_DATE_HEADER = wU6;
    gNK.AMZ_DATE_QUERY_PARAM = qU6;
    gNK.AUTH_HEADER = zU6;
    gNK.CREDENTIAL_QUERY_PARAM = DD8;
    gNK.DATE_HEADER = PD8;
    gNK.EVENT_ALGORITHM_IDENTIFIER = TD8;
    gNK.EXPIRES_QUERY_PARAM = MD8;
    gNK.GENERATED_HEADERS = WD8;
    gNK.HOST_HEADER = INK;
    gNK.KEY_TYPE_IDENTIFIER = HU6;
    gNK.MAX_CACHE_SIZE = ED8;
    gNK.MAX_PRESIGNED_TTL = kD8;
    gNK.PROXY_HEADER_PATTERN = VD8;
    gNK.REGION_SET_PARAM = hNK;
    gNK.SEC_HEADER_PATTERN = ND8;
    gNK.SHA256_HEADER = Qt1;
    gNK.SIGNATURE_HEADER = GD8;
    gNK.SIGNATURE_QUERY_PARAM = KU6;
    gNK.SIGNED_HEADERS_QUERY_PARAM = jD8;
    gNK.SignatureV4 = hD8;
    gNK.SignatureV4Base = OU6;
    gNK.TOKEN_HEADER = ZD8;
    gNK.TOKEN_QUERY_PARAM = YU6;
    gNK.UNSIGNABLE_PATTERNS = xNK;
    gNK.UNSIGNED_PAYLOAD = vD8;
    gNK.clearCredentialCache = uNK;
    gNK.createScope = mt1;
    gNK.getCanonicalHeaders = eg6;
    gNK.getCanonicalQuery = SD8;
    gNK.getPayloadHash = Ft1;
    gNK.getSigningKey = LD8;
    gNK.hasHeader = yD8;
    gNK.moveHeadersToQuery = CD8;
    gNK.prepareRequest = AU6;
    gNK.signatureV4aContainer = QNK
})
// @from(Ln 58877, Col 4)
xD8 = R((RTK) => {
    var ID8 = typeof TextEncoder == "function" ? new TextEncoder : null,
        LTK = (A) => {
            if (typeof A === "string") {
                if (ID8) return ID8.encode(A).byteLength;
                let q = A.length;
                for (let K = q - 1; K >= 0; K--) {
                    let Y = A.charCodeAt(K);
                    if (Y > 127 && Y <= 2047) q++;
                    else if (Y > 2047 && Y <= 65535) q += 2;
                    if (Y >= 56320 && Y <= 57343) K--
                }
                return q
            } else if (typeof A.byteLength === "number") return A.byteLength;
            else if (typeof A.size === "number") return A.size;
            throw Error(`Body Length computation failed for ${A}`)
        };
    RTK.calculateBodyLength = LTK
})
// @from(Ln 58896, Col 4)
vU6 = R((sTK) => {
    var ct1 = nf(),
        mD8 = Z2(),
        WE1 = rf(),
        CTK = ov1(),
        STK = xD8(),
        EH1 = R$(),
        hTK = iP(),
        FD8 = Gg6(),
        pt1 = 0,
        dt1 = 1,
        jA1 = 2,
        hi = 3,
        PE1 = 4,
        gt1 = 5,
        QD8 = 6,
        JU6 = 7,
        gD8 = 20,
        jU6 = 21,
        UD8 = 22,
        ITK = 23,
        PU6 = 24,
        MA1 = 25,
        PA1 = 26,
        Ii = 27,
        WU6 = 31;

    function kH1(A) {
        return typeof Buffer < "u" ? Buffer.alloc(A) : new Uint8Array(A)
    }
    var GU6 = Symbol("@smithy/core/cbor::tagSymbol");

    function ZU6(A) {
        return A[GU6] = !0, A
    }
    var xTK = typeof TextDecoder < "u",
        bTK = typeof Buffer < "u",
        r2 = kH1(0),
        lQ = new DataView(r2.buffer, r2.byteOffset, r2.byteLength),
        bD8 = xTK ? new TextDecoder : null,
        P9 = 0;

    function uTK(A) {
        r2 = A, lQ = new DataView(r2.buffer, r2.byteOffset, r2.byteLength)
    }

    function iQ(A, q) {
        if (A >= q) throw Error("unexpected end of (decode) payload.");
        let K = (r2[A] & 224) >> 5,
            Y = r2[A] & 31;
        switch (K) {
            case pt1:
            case dt1:
            case QD8:
                let z, w;
                if (Y < 24) z = Y, w = 1;
                else switch (Y) {
                    case PU6:
                    case MA1:
                    case PA1:
                    case Ii:
                        let H = dD8[Y],
                            $ = H + 1;
                        if (w = $, q - A < $) throw Error(`countLength ${H} greater than remaining buf len.`);
                        let O = A + 1;
                        if (H === 1) z = r2[O];
                        else if (H === 2) z = lQ.getUint16(O);
                        else if (H === 4) z = lQ.getUint32(O);
                        else z = lQ.getBigUint64(O);
                        break;
                    default:
                        throw Error(`unexpected minor value ${Y}.`)
                }
                if (K === pt1) return P9 = w, XU6(z);
                else if (K === dt1) {
                    let H;
                    if (typeof z === "bigint") H = BigInt(-1) - z;
                    else H = -1 - z;
                    return P9 = w, XU6(H)
                } else if (Y === 2 || Y === 3) {
                    let H = GE1(A + w, q),
                        $ = BigInt(0),
                        O = A + w + P9;
                    for (let _ = O; _ < O + H; ++_) $ = $ << BigInt(8) | BigInt(r2[_]);
                    return P9 = w + P9 + H, Y === 3 ? -$ - BigInt(1) : $
                } else if (Y === 4) {
                    let H = iQ(A + w, q),
                        [$, O] = H,
                        _ = O < 0 ? -1 : 1,
                        J = "0".repeat(Math.abs($) + 1) + String(BigInt(_) * BigInt(O)),
                        X, D = O < 0 ? "-" : "";
                    if (X = $ === 0 ? J : J.slice(0, J.length + $) + "." + J.slice($), X = X.replace(/^0+/g, ""), X === "") X = "0";
                    if (X[0] === ".") X = "0" + X;
                    return X = D + X, P9 = w + P9, ct1.nv(X)
                } else {
                    let H = iQ(A + w, q);
                    return P9 = w + P9, ZU6({
                        tag: XU6(z),
                        value: H
                    })
                }
            case hi:
            case gt1:
            case PE1:
            case jA1:
                if (Y === WU6) switch (K) {
                    case hi:
                        return QTK(A, q);
                    case gt1:
                        return cTK(A, q);
                    case PE1:
                        return pTK(A, q);
                    case jA1:
                        return gTK(A, q)
                } else switch (K) {
                    case hi:
                        return FTK(A, q);
                    case gt1:
                        return dTK(A, q);
                    case PE1:
                        return UTK(A, q);
                    case jA1:
                        return fU6(A, q)
                }
                default: return lTK(A, q)
        }
    }

    function pD8(A, q, K) {
        if (bTK && A.constructor?.name === "Buffer") return A.toString("utf-8", q, K);
        if (bD8) return bD8.decode(A.subarray(q, K));
        return mD8.toUtf8(A.subarray(q, K))
    }

    function BTK(A) {
        let q = Number(A);
        if (q < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < q) console.warn(Error(`@smithy/core/cbor - truncating BigInt(${A}) to ${q} with loss of precision.`));
        return q
    }
    var dD8 = {
        [PU6]: 1,
        [MA1]: 2,
        [PA1]: 4,
        [Ii]: 8
    };

    function mTK(A, q) {
        let K = A >> 7,
            Y = (A & 124) >> 2,
            z = (A & 3) << 8 | q,
            w = K === 0 ? 1 : -1,
            H, $;
        if (Y === 0)
            if (z === 0) return 0;
            else H = Math.pow(2, -14), $ = 0;
        else if (Y === 31)
            if (z === 0) return w * (1 / 0);
            else return NaN;
        else H = Math.pow(2, Y - 15), $ = 1;
        return $ += z / 1024, w * (H * $)
    }

    function GE1(A, q) {
        let K = r2[A] & 31;
        if (K < 24) return P9 = 1, K;
        if (K === PU6 || K === MA1 || K === PA1 || K === Ii) {
            let Y = dD8[K];
            if (P9 = Y + 1, q - A < P9) throw Error(`countLength ${Y} greater than remaining buf len.`);
            let z = A + 1;
            if (Y === 1) return r2[z];
            else if (Y === 2) return lQ.getUint16(z);
            else if (Y === 4) return lQ.getUint32(z);
            return BTK(lQ.getBigUint64(z))
        }
        throw Error(`unexpected minor value ${K}.`)
    }

    function FTK(A, q) {
        let K = GE1(A, q),
            Y = P9;
        if (A += Y, q - A < K) throw Error(`string len ${K} greater than remaining buf len.`);
        let z = pD8(r2, A, A + K);
        return P9 = Y + K, z
    }

    function QTK(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (r2[A] === 255) {
                let O = kH1(K.length);
                return O.set(K, 0), P9 = A - Y + 2, pD8(O, 0, O.length)
            }
            let z = (r2[A] & 224) >> 5,
                w = r2[A] & 31;
            if (z !== hi) throw Error(`unexpected major type ${z} in indefinite string.`);
            if (w === WU6) throw Error("nested indefinite string.");
            let H = fU6(A, q);
            A += P9;
            for (let O = 0; O < H.length; ++O) K.push(H[O])
        }
        throw Error("expected break marker.")
    }

    function fU6(A, q) {
        let K = GE1(A, q),
            Y = P9;
        if (A += Y, q - A < K) throw Error(`unstructured byte string len ${K} greater than remaining buf len.`);
        let z = r2.subarray(A, A + K);
        return P9 = Y + K, z
    }

    function gTK(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (r2[A] === 255) {
                let O = kH1(K.length);
                return O.set(K, 0), P9 = A - Y + 2, O
            }
            let z = (r2[A] & 224) >> 5,
                w = r2[A] & 31;
            if (z !== jA1) throw Error(`unexpected major type ${z} in indefinite string.`);
            if (w === WU6) throw Error("nested indefinite string.");
            let H = fU6(A, q);
            A += P9;
            for (let O = 0; O < H.length; ++O) K.push(H[O])
        }
        throw Error("expected break marker.")
    }

    function UTK(A, q) {
        let K = GE1(A, q),
            Y = P9;
        A += Y;
        let z = A,
            w = Array(K);
        for (let H = 0; H < K; ++H) {
            let $ = iQ(A, q),
                O = P9;
            w[H] = $, A += O
        }
        return P9 = Y + (A - z), w
    }

    function pTK(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (r2[A] === 255) return P9 = A - Y + 2, K;
            let z = iQ(A, q);
            A += P9, K.push(z)
        }
        throw Error("expected break marker.")
    }

    function dTK(A, q) {
        let K = GE1(A, q),
            Y = P9;
        A += Y;
        let z = A,
            w = {};
        for (let H = 0; H < K; ++H) {
            if (A >= q) throw Error("unexpected end of map payload.");
            let $ = (r2[A] & 224) >> 5;
            if ($ !== hi) throw Error(`unexpected major type ${$} for map key at index ${A}.`);
            let O = iQ(A, q);
            A += P9;
            let _ = iQ(A, q);
            A += P9, w[O] = _
        }
        return P9 = Y + (A - z), w
    }

    function cTK(A, q) {
        A += 1;
        let K = A,
            Y = {};
        for (; A < q;) {
            if (A >= q) throw Error("unexpected end of map payload.");
            if (r2[A] === 255) return P9 = A - K + 2, Y;
            let z = (r2[A] & 224) >> 5;
            if (z !== hi) throw Error(`unexpected major type ${z} for map key.`);
            let w = iQ(A, q);
            A += P9;
            let H = iQ(A, q);
            A += P9, Y[w] = H
        }
        throw Error("expected break marker.")
    }

    function lTK(A, q) {
        let K = r2[A] & 31;
        switch (K) {
            case jU6:
            case gD8:
                return P9 = 1, K === jU6;
            case UD8:
                return P9 = 1, null;
            case ITK:
                return P9 = 1, null;
            case MA1:
                if (q - A < 3) throw Error("incomplete float16 at end of buf.");
                return P9 = 3, mTK(r2[A + 1], r2[A + 2]);
            case PA1:
                if (q - A < 5) throw Error("incomplete float32 at end of buf.");
                return P9 = 5, lQ.getFloat32(A + 1);
            case Ii:
                if (q - A < 9) throw Error("incomplete float64 at end of buf.");
                return P9 = 9, lQ.getFloat64(A + 1);
            default:
                throw Error(`unexpected minor value ${K}.`)
        }
    }

    function XU6(A) {
        if (typeof A === "number") return A;
        let q = Number(A);
        if (Number.MIN_SAFE_INTEGER <= q && q <= Number.MAX_SAFE_INTEGER) return q;
        return A
    }
    var uD8 = typeof Buffer < "u",
        iTK = 2048,
        T3 = kH1(iTK),
        cQ = new DataView(T3.buffer, T3.byteOffset, T3.byteLength),
        dq = 0;

    function DU6(A) {
        if (T3.byteLength - dq < A)
            if (dq < 16000000) MU6(Math.max(T3.byteLength * 4, T3.byteLength + A));
            else MU6(T3.byteLength + A + 16000000)
    }

    function BD8() {
        let A = kH1(dq);
        return A.set(T3.subarray(0, dq), 0), dq = 0, A
    }

    function MU6(A) {
        let q = T3;
        if (T3 = kH1(A), q)
            if (q.copy) q.copy(T3, 0, 0, q.byteLength);
            else T3.set(q, 0);
        cQ = new DataView(T3.buffer, T3.byteOffset, T3.byteLength)
    }

    function dQ(A, q) {
        if (q < 24) T3[dq++] = A << 5 | q;
        else if (q < 256) T3[dq++] = A << 5 | 24, T3[dq++] = q;
        else if (q < 65536) T3[dq++] = A << 5 | MA1, cQ.setUint16(dq, q), dq += 2;
        else if (q < 4294967296) T3[dq++] = A << 5 | PA1, cQ.setUint32(dq, q), dq += 4;
        else T3[dq++] = A << 5 | Ii, cQ.setBigUint64(dq, typeof q === "bigint" ? q : BigInt(q)), dq += 8
    }

    function nTK(A) {
        let q = [A];
        while (q.length) {
            let K = q.pop();
            if (DU6(typeof K === "string" ? K.length * 4 : 64), typeof K === "string") {
                if (uD8) dQ(hi, Buffer.byteLength(K)), dq += T3.write(K, dq);
                else {
                    let Y = mD8.fromUtf8(K);
                    dQ(hi, Y.byteLength), T3.set(Y, dq), dq += Y.byteLength
                }
                continue
            } else if (typeof K === "number") {
                if (Number.isInteger(K)) {
                    let Y = K >= 0,
                        z = Y ? pt1 : dt1,
                        w = Y ? K : -K - 1;
                    if (w < 24) T3[dq++] = z << 5 | w;
                    else if (w < 256) T3[dq++] = z << 5 | 24, T3[dq++] = w;
                    else if (w < 65536) T3[dq++] = z << 5 | MA1, T3[dq++] = w >> 8, T3[dq++] = w;
                    else if (w < 4294967296) T3[dq++] = z << 5 | PA1, cQ.setUint32(dq, w), dq += 4;
                    else T3[dq++] = z << 5 | Ii, cQ.setBigUint64(dq, BigInt(w)), dq += 8;
                    continue
                }
                T3[dq++] = JU6 << 5 | Ii, cQ.setFloat64(dq, K), dq += 8;
                continue
            } else if (typeof K === "bigint") {
                let Y = K >= 0,
                    z = Y ? pt1 : dt1,
                    w = Y ? K : -K - BigInt(1),
                    H = Number(w);
                if (H < 24) T3[dq++] = z << 5 | H;
                else if (H < 256) T3[dq++] = z << 5 | 24, T3[dq++] = H;
                else if (H < 65536) T3[dq++] = z << 5 | MA1, T3[dq++] = H >> 8, T3[dq++] = H & 255;
                else if (H < 4294967296) T3[dq++] = z << 5 | PA1, cQ.setUint32(dq, H), dq += 4;
                else if (w < BigInt("18446744073709551616")) T3[dq++] = z << 5 | Ii, cQ.setBigUint64(dq, w), dq += 8;
                else {
                    let $ = w.toString(2),
                        O = new Uint8Array(Math.ceil($.length / 8)),
                        _ = w,
                        J = 0;
                    while (O.byteLength - ++J >= 0) O[O.byteLength - J] = Number(_ & BigInt(255)), _ >>= BigInt(8);
                    if (DU6(O.byteLength * 2), T3[dq++] = Y ? 194 : 195, uD8) dQ(jA1, Buffer.byteLength(O));
                    else dQ(jA1, O.byteLength);
                    T3.set(O, dq), dq += O.byteLength
                }
                continue
            } else if (K === null) {
                T3[dq++] = JU6 << 5 | UD8;
                continue
            } else if (typeof K === "boolean") {
                T3[dq++] = JU6 << 5 | (K ? jU6 : gD8);
                continue
            } else if (typeof K > "u") throw Error("@smithy/core/cbor: client may not serialize undefined value.");
            else if (Array.isArray(K)) {
                for (let Y = K.length - 1; Y >= 0; --Y) q.push(K[Y]);
                dQ(PE1, K.length);
                continue
            } else if (typeof K.byteLength === "number") {
                DU6(K.length * 2), dQ(jA1, K.length), T3.set(K, dq), dq += K.byteLength;
                continue
            } else if (typeof K === "object") {
                if (K instanceof ct1.NumericValue) {
                    let z = K.string.indexOf("."),
                        w = z === -1 ? 0 : z - K.string.length + 1,
                        H = BigInt(K.string.replace(".", ""));
                    T3[dq++] = 196, q.push(H), q.push(w), dQ(PE1, 2);
                    continue
                }
                if (K[GU6])
                    if ("tag" in K && "value" in K) {
                        q.push(K.value), dQ(QD8, K.tag);
                        continue
                    } else throw Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(K));
                let Y = Object.keys(K);
                for (let z = Y.length - 1; z >= 0; --z) {
                    let w = Y[z];
                    q.push(K[w]), q.push(w)
                }
                dQ(gt1, Y.length);
                continue
            }
            throw Error(`data type ${K?.constructor?.name??typeof K} not compatible for encoding.`)
        }
    }
    var lt1 = {
            deserialize(A) {
                return uTK(A), iQ(0, A.length)
            },
            serialize(A) {
                try {
                    return nTK(A), BD8()
                } catch (q) {
                    throw BD8(), q
                }
            },
            resizeEncodingBuffer(A) {
                MU6(A)
            }
        },
        cD8 = (A, q) => {
            return WE1.collectBody(A, q).then(async (K) => {
                if (K.length) try {
                    return lt1.deserialize(K)
                } catch (Y) {
                    throw Object.defineProperty(Y, "$responseBodyText", {
                        value: q.utf8Encoder(K)
                    }), Y
                }
                return {}
            })
        },
        Ut1 = (A) => {
            return ZU6({
                tag: 1,
                value: A.getTime() / 1000
            })
        },
        rTK = async (A, q) => {
            let K = await cD8(A, q);
            return K.message = K.message ?? K.Message, K
        }, lD8 = (A, q) => {
            let K = (z) => {
                let w = z;
                if (typeof w === "number") w = w.toString();
                if (w.indexOf(",") >= 0) w = w.split(",")[0];
                if (w.indexOf(":") >= 0) w = w.split(":")[0];
                if (w.indexOf("#") >= 0) w = w.split("#")[1];
                return w
            };
            if (q.__type !== void 0) return K(q.__type);
            let Y = Object.keys(q).find((z) => z.toLowerCase() === "code");
            if (Y && q[Y] !== void 0) return K(q[Y])
        }, oTK = (A) => {
            if (String(A.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor") throw Error("Malformed RPCv2 CBOR response, status: " + A.statusCode)
        }, aTK = async (A, q, K, Y, z) => {
            let {
                hostname: w,
                protocol: H = "https",
                port: $,
                path: O
            } = await A.endpoint(), _ = {
                protocol: H,
                hostname: w,
                port: $,
                method: "POST",
                path: O.endsWith("/") ? O.slice(0, -1) + K : O + K,
                headers: {
                    ...q
                }
            };
            if (Y !== void 0) _.hostname = Y;
            if (z !== void 0) {
                _.body = z;
                try {
                    _.headers["content-length"] = String(STK.calculateBodyLength(z))
                } catch (J) {}
            }
            return new CTK.HttpRequest(_)
        };
    class VU6 extends WE1.SerdeContext {
        createSerializer() {
            let A = new NU6;
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new TU6;
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class NU6 extends WE1.SerdeContext {
        value;
        write(A, q) {
            this.value = this.serialize(A, q)
        }
        serialize(A, q) {
            let K = EH1.NormalizedSchema.of(A);
            if (q == null) {
                if (K.isIdempotencyToken()) return ct1.generateIdempotencyToken();
                return q
            }
            if (K.isBlobSchema()) {
                if (typeof q === "string") return (this.serdeContext?.base64Decoder ?? FD8.fromBase64)(q);
                return q
            }
            if (K.isTimestampSchema()) {
                if (typeof q === "number" || typeof q === "bigint") return Ut1(new Date(Number(q) / 1000 | 0));
                return Ut1(q)
            }
            if (typeof q === "function" || typeof q === "object") {
                let Y = q;
                if (K.isListSchema() && Array.isArray(Y)) {
                    let w = !!K.getMergedTraits().sparse,
                        H = [],
                        $ = 0;
                    for (let O of Y) {
                        let _ = this.serialize(K.getValueSchema(), O);
                        if (_ != null || w) H[$++] = _
                    }
                    return H
                }
                if (Y instanceof Date) return Ut1(Y);
                let z = {};
                if (K.isMapSchema()) {
                    let w = !!K.getMergedTraits().sparse;
                    for (let H of Object.keys(Y)) {
                        let $ = this.serialize(K.getValueSchema(), Y[H]);
                        if ($ != null || w) z[H] = $
                    }
                } else if (K.isStructSchema())
                    for (let [w, H] of K.structIterator()) {
                        let $ = this.serialize(H, Y[w]);
                        if ($ != null) z[w] = $
                    } else if (K.isDocumentSchema())
                        for (let w of Object.keys(Y)) z[w] = this.serialize(K.getValueSchema(), Y[w]);
                return z
            }
            return q
        }
        flush() {
            let A = lt1.serialize(this.value);
            return this.value = void 0, A
        }
    }
    class TU6 extends WE1.SerdeContext {
        read(A, q) {
            let K = lt1.deserialize(q);
            return this.readValue(A, K)
        }
        readValue(A, q) {
            let K = EH1.NormalizedSchema.of(A);
            if (K.isTimestampSchema() && typeof q === "number") return ct1._parseEpochTimestamp(q);
            if (K.isBlobSchema()) {
                if (typeof q === "string") return (this.serdeContext?.base64Decoder ?? FD8.fromBase64)(q);
                return q
            }
            if (typeof q > "u" || typeof q === "boolean" || typeof q === "number" || typeof q === "string" || typeof q === "bigint" || typeof q === "symbol") return q;
            else if (typeof q === "function" || typeof q === "object") {
                if (q === null) return null;
                if ("byteLength" in q) return q;
                if (q instanceof Date) return q;
                if (K.isDocumentSchema()) return q;
                if (K.isListSchema()) {
                    let z = [],
                        w = K.getValueSchema(),
                        H = !!K.getMergedTraits().sparse;
                    for (let $ of q) {
                        let O = this.readValue(w, $);
                        if (O != null || H) z.push(O)
                    }
                    return z
                }
                let Y = {};
                if (K.isMapSchema()) {
                    let z = !!K.getMergedTraits().sparse,
                        w = K.getValueSchema();
                    for (let H of Object.keys(q)) {
                        let $ = this.readValue(w, q[H]);
                        if ($ != null || z) Y[H] = $
                    }
                } else if (K.isStructSchema())
                    for (let [z, w] of K.structIterator()) {
                        let H = this.readValue(w, q[z]);
                        if (H != null) Y[z] = H
                    }
                return Y
            } else return q
        }
    }
    class iD8 extends WE1.RpcProtocol {
        codec = new VU6;
        serializer = this.codec.createSerializer();
        deserializer = this.codec.createDeserializer();
        constructor({
            defaultNamespace: A
        }) {
            super({
                defaultNamespace: A
            })
        }
        getShapeId() {
            return "smithy.protocols#rpcv2Cbor"
        }
        getPayloadCodec() {
            return this.codec
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (Object.assign(Y.headers, {
                    "content-type": this.getDefaultContentType(),
                    "smithy-protocol": "rpc-v2-cbor",
                    accept: this.getDefaultContentType()
                }), EH1.deref(A.input) === "unit") delete Y.body, delete Y.headers["content-type"];
            else {
                if (!Y.body) this.serializer.write(15, {}), Y.body = this.serializer.flush();
                try {
                    Y.headers["content-length"] = String(Y.body.byteLength)
                } catch ($) {}
            }
            let {
                service: z,
                operation: w
            } = hTK.getSmithyContext(K), H = `/service/${z}/operation/${w}`;
            if (Y.path.endsWith("/")) Y.path += H.slice(1);
            else Y.path += H;
            return Y
        }
        async deserializeResponse(A, q, K) {
            return super.deserializeResponse(A, q, K)
        }
        async handleError(A, q, K, Y, z) {
            let w = lD8(K, Y) ?? "Unknown",
                H = this.options.defaultNamespace;
            if (w.includes("#"))[H] = w.split("#");
            let $ = {
                    $metadata: z,
                    $fault: K.statusCode <= 500 ? "client" : "server"
                },
                O = EH1.TypeRegistry.for(H),
                _;
            try {
                _ = O.getSchema(w)
            } catch (P) {
                if (Y.Message) Y.message = Y.Message;
                let W = EH1.TypeRegistry.for("smithy.ts.sdk.synthetic." + H),
                    G = W.getBaseException();
                if (G) {
                    let f = W.getErrorCtor(G);
                    throw Object.assign(new f({
                        name: w
                    }), $, Y)
                }
                throw Object.assign(Error(w), $, Y)
            }
            let J = EH1.NormalizedSchema.of(_),
                X = O.getErrorCtor(_),
                D = Y.message ?? Y.Message ?? "Unknown",
                j = new X(D),
                M = {};
            for (let [P, W] of J.structIterator()) M[P] = this.deserializer.readValue(W, Y[P]);
            throw Object.assign(j, $, {
                $fault: J.getMergedTraits().error,
                message: D
            }, M)
        }
        getDefaultContentType() {
            return "application/cbor"
        }
    }
    sTK.CborCodec = VU6;
    sTK.CborShapeDeserializer = TU6;
    sTK.CborShapeSerializer = NU6;
    sTK.SmithyRpcV2CborProtocol = iD8;
    sTK.buildHttpRpcRequest = aTK;
    sTK.cbor = lt1;
    sTK.checkCborResponse = oTK;
    sTK.dateToTag = Ut1;
    sTK.loadSmithyRpcV2CborErrorCode = lD8;
    sTK.parseCborBody = cD8;
    sTK.parseCborErrorBody = rTK;
    sTK.tag = ZU6;
    sTK.tagSymbol = GU6
})
// @from(Ln 59612, Col 4)
wb = R((XvK) => {
    var WA1 = (A, q) => {
            let K = [];
            if (A) K.push(A);
            if (q)
                for (let Y of q) K.push(Y);
            return K
        },
        xi = (A, q) => {
            return `${A||"anonymous"}${q&&q.length>0?` (a.k.a. ${q.join(",")})`:""}`
        },
        EU6 = () => {
            let A = [],
                q = [],
                K = !1,
                Y = new Set,
                z = (X) => X.sort((D, j) => nD8[j.step] - nD8[D.step] || rD8[j.priority || "normal"] - rD8[D.priority || "normal"]),
                w = (X) => {
                    let D = !1,
                        j = (M) => {
                            let P = WA1(M.name, M.aliases);
                            if (P.includes(X)) {
                                D = !0;
                                for (let W of P) Y.delete(W);
                                return !1
                            }
                            return !0
                        };
                    return A = A.filter(j), q = q.filter(j), D
                },
                H = (X) => {
                    let D = !1,
                        j = (M) => {
                            if (M.middleware === X) {
                                D = !0;
                                for (let P of WA1(M.name, M.aliases)) Y.delete(P);
                                return !1
                            }
                            return !0
                        };
                    return A = A.filter(j), q = q.filter(j), D
                },
                $ = (X) => {
                    return A.forEach((D) => {
                        X.add(D.middleware, {
                            ...D
                        })
                    }), q.forEach((D) => {
                        X.addRelativeTo(D.middleware, {
                            ...D
                        })
                    }), X.identifyOnResolve?.(J.identifyOnResolve()), X
                },
                O = (X) => {
                    let D = [];
                    return X.before.forEach((j) => {
                        if (j.before.length === 0 && j.after.length === 0) D.push(j);
                        else D.push(...O(j))
                    }), D.push(X), X.after.reverse().forEach((j) => {
                        if (j.before.length === 0 && j.after.length === 0) D.push(j);
                        else D.push(...O(j))
                    }), D
                },
                _ = (X = !1) => {
                    let D = [],
                        j = [],
                        M = {};
                    return A.forEach((W) => {
                        let G = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let f of WA1(G.name, G.aliases)) M[f] = G;
                        D.push(G)
                    }), q.forEach((W) => {
                        let G = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let f of WA1(G.name, G.aliases)) M[f] = G;
                        j.push(G)
                    }), j.forEach((W) => {
                        if (W.toMiddleware) {
                            let G = M[W.toMiddleware];
                            if (G === void 0) {
                                if (X) return;
                                throw Error(`${W.toMiddleware} is not found when adding ${xi(W.name,W.aliases)} middleware ${W.relation} ${W.toMiddleware}`)
                            }
                            if (W.relation === "after") G.after.push(W);
                            if (W.relation === "before") G.before.push(W)
                        }
                    }), z(D).map(O).reduce((W, G) => {
                        return W.push(...G), W
                    }, [])
                },
                J = {
                    add: (X, D = {}) => {
                        let {
                            name: j,
                            override: M,
                            aliases: P
                        } = D, W = {
                            step: "initialize",
                            priority: "normal",
                            middleware: X,
                            ...D
                        }, G = WA1(j, P);
                        if (G.length > 0) {
                            if (G.some((f) => Y.has(f))) {
                                if (!M) throw Error(`Duplicate middleware name '${xi(j,P)}'`);
                                for (let f of G) {
                                    let Z = A.findIndex((T) => T.name === f || T.aliases?.some((k) => k === f));
                                    if (Z === -1) continue;
                                    let N = A[Z];
                                    if (N.step !== W.step || W.priority !== N.priority) throw Error(`"${xi(N.name,N.aliases)}" middleware with ${N.priority} priority in ${N.step} step cannot be overridden by "${xi(j,P)}" middleware with ${W.priority} priority in ${W.step} step.`);
                                    A.splice(Z, 1)
                                }
                            }
                            for (let f of G) Y.add(f)
                        }
                        A.push(W)
                    },
                    addRelativeTo: (X, D) => {
                        let {
                            name: j,
                            override: M,
                            aliases: P
                        } = D, W = {
                            middleware: X,
                            ...D
                        }, G = WA1(j, P);
                        if (G.length > 0) {
                            if (G.some((f) => Y.has(f))) {
                                if (!M) throw Error(`Duplicate middleware name '${xi(j,P)}'`);
                                for (let f of G) {
                                    let Z = q.findIndex((T) => T.name === f || T.aliases?.some((k) => k === f));
                                    if (Z === -1) continue;
                                    let N = q[Z];
                                    if (N.toMiddleware !== W.toMiddleware || N.relation !== W.relation) throw Error(`"${xi(N.name,N.aliases)}" middleware ${N.relation} "${N.toMiddleware}" middleware cannot be overridden by "${xi(j,P)}" middleware ${W.relation} "${W.toMiddleware}" middleware.`);
                                    q.splice(Z, 1)
                                }
                            }
                            for (let f of G) Y.add(f)
                        }
                        q.push(W)
                    },
                    clone: () => $(EU6()),
                    use: (X) => {
                        X.applyToStack(J)
                    },
                    remove: (X) => {
                        if (typeof X === "string") return w(X);
                        else return H(X)
                    },
                    removeByTag: (X) => {
                        let D = !1,
                            j = (M) => {
                                let {
                                    tags: P,
                                    name: W,
                                    aliases: G
                                } = M;
                                if (P && P.includes(X)) {
                                    let f = WA1(W, G);
                                    for (let Z of f) Y.delete(Z);
                                    return D = !0, !1
                                }
                                return !0
                            };
                        return A = A.filter(j), q = q.filter(j), D
                    },
                    concat: (X) => {
                        let D = $(EU6());
                        return D.use(X), D.identifyOnResolve(K || D.identifyOnResolve() || (X.identifyOnResolve?.() ?? !1)), D
                    },
                    applyToStack: $,
                    identify: () => {
                        return _(!0).map((X) => {
                            let D = X.step ?? X.relation + " " + X.toMiddleware;
                            return xi(X.name, X.aliases) + " - " + D
                        })
                    },
                    identifyOnResolve(X) {
                        if (typeof X === "boolean") K = X;
                        return K
                    },
                    resolve: (X, D) => {
                        for (let j of _().map((M) => M.middleware).reverse()) X = j(X, D);
                        if (K) console.log(J.identify());
                        return X
                    }
                };
            return J
        },
        nD8 = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        rD8 = {
            high: 3,
            normal: 2,
            low: 1
        };
    XvK.constructStack = EU6
})
// @from(Ln 59822, Col 4)
hU6 = R((RH1) => {
    var sD8 = wb(),
        CU6 = rf(),
        LU6 = rg6(),
        jvK = R$(),
        oD8 = nf();
    class tD8 {
        config;
        middlewareStack = sD8.constructStack();
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
    var kU6 = "***SensitiveInformation***";

    function RU6(A, q) {
        if (q == null) return q;
        let K = jvK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return kU6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return kU6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return kU6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = RU6(H, Y[w]);
            return z
        }
        return q
    }
    class SU6 {
        middlewareStack = sD8.constructStack();
        schema;
        static classBuilder() {
            return new eD8
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
                    [LU6.SMITHY_CONTEXT_KEY]: {
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
    class eD8 {
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
            return q = class extends SU6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? RU6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? RU6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var MvK = "***SensitiveInformation***",
        PvK = (A, q) => {
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
    class LH1 extends Error {
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
            return LH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === LH1) return LH1.isInstance(A);
            if (LH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var A08 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        q08 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = GvK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw A08(H, q)
        },
        WvK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                q08({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        GvK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        ZvK = (A) => {
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
        aD8 = !1,
        fvK = (A) => {
            if (A && !aD8 && parseInt(A.substring(1, A.indexOf("."))) < 16) aD8 = !0
        },
        VvK = (A) => {
            let q = [];
            for (let K in LU6.AlgorithmId) {
                let Y = LU6.AlgorithmId[K];
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
        NvK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        TvK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        vvK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        K08 = (A) => {
            return Object.assign(VvK(A), TvK(A))
        },
        EvK = K08,
        kvK = (A) => {
            return Object.assign(NvK(A), vvK(A))
        },
        LvK = (A) => Array.isArray(A) ? A : [A],
        Y08 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = Y08(A[K]);
            return A
        },
        RvK = (A) => {
            return A != null
        };
    class z08 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function w08(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, SvK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            H08(Y, null, w, H)
        }
        return Y
    }
    var yvK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        CvK = (A, q) => {
            let K = {};
            for (let Y in q) H08(K, A, q, Y);
            return K
        },
        SvK = (A, q, K) => {
            return w08(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        H08 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = hvK, O = IvK, _ = Y] = H;
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
        hvK = (A) => A != null,
        IvK = (A) => A,
        xvK = (A) => {
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
        bvK = (A) => A.toISOString().replace(".000Z", "Z"),
        yU6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(yU6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = yU6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(RH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return CU6.collectBody
        }
    });
    Object.defineProperty(RH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return CU6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(RH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return CU6.resolvedPath
        }
    });
    RH1.Client = tD8;
    RH1.Command = SU6;
    RH1.NoOpLogger = z08;
    RH1.SENSITIVE_STRING = MvK;
    RH1.ServiceException = LH1;
    RH1._json = yU6;
    RH1.convertMap = yvK;
    RH1.createAggregatedClient = PvK;
    RH1.decorateServiceException = A08;
    RH1.emitWarningIfUnsupportedVersion = fvK;
    RH1.getArrayIfSingleItem = LvK;
    RH1.getDefaultClientConfiguration = EvK;
    RH1.getDefaultExtensionConfiguration = K08;
    RH1.getValueFromTextNode = Y08;
    RH1.isSerializableHeaderValue = RvK;
    RH1.loadConfigsForDefaultMode = ZvK;
    RH1.map = w08;
    RH1.resolveDefaultRuntimeConfig = kvK;
    RH1.serializeDateTime = bvK;
    RH1.serializeFloat = xvK;
    RH1.take = CvK;
    RH1.throwDefaultError = q08;
    RH1.withBaseException = WvK;
    Object.keys(oD8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(RH1, A)) Object.defineProperty(RH1, A, {
            enumerable: !0,
            get: function() {
                return oD8[A]
            }
        })
    })
})
// @from(Ln 60292, Col 4)
$08 = R((wEK) => {
    var zEK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    wEK.isArrayBuffer = zEK
})
// @from(Ln 60296, Col 4)
xU6 = R((JEK) => {
    var $EK = $08(),
        IU6 = h1("buffer"),
        OEK = (A, q = 0, K = A.byteLength - q) => {
            if (!$EK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return IU6.Buffer.from(A, q, K)
        },
        _EK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? IU6.Buffer.from(A, q) : IU6.Buffer.from(A)
        };
    JEK.fromArrayBuffer = OEK;
    JEK.fromString = _EK
})
// @from(Ln 60310, Col 4)
J08 = R((O08) => {
    Object.defineProperty(O08, "__esModule", {
        value: !0
    });
    O08.fromBase64 = void 0;
    var jEK = xU6(),
        MEK = /^[A-Za-z0-9+/]*={0,2}$/,
        PEK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!MEK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, jEK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    O08.fromBase64 = PEK
})
// @from(Ln 60325, Col 4)
j08 = R((X08) => {
    Object.defineProperty(X08, "__esModule", {
        value: !0
    });
    X08.toBase64 = void 0;
    var WEK = xU6(),
        GEK = Z2(),
        ZEK = (A) => {
            let q;
            if (typeof A === "string") q = (0, GEK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, WEK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    X08.toBase64 = ZEK
})
// @from(Ln 60341, Col 4)
bU6 = R((ZE1) => {
    var M08 = J08(),
        P08 = j08();
    Object.keys(M08).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZE1, A)) Object.defineProperty(ZE1, A, {
            enumerable: !0,
            get: function() {
                return M08[A]
            }
        })
    });
    Object.keys(P08).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZE1, A)) Object.defineProperty(ZE1, A, {
            enumerable: !0,
            get: function() {
                return P08[A]
            }
        })
    })
})