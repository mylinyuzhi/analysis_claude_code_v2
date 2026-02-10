
// @from(Ln 82728, Col 4)
bT = R((l82, gC8) => {
    var {
        Transform: Q93
    } = h1("node:stream"), EC8 = h1("node:zlib"), {
        redirectStatusSet: g93,
        referrerPolicySet: U93,
        badPortsSet: p93
    } = Gk1(), {
        getGlobalOrigin: kC8
    } = xn6(), {
        collectASequenceOfCodePoints: gA1,
        collectAnHTTPQuotedString: d93,
        removeChars: c93,
        parseMIMEType: l93
    } = qV(), {
        performance: i93
    } = h1("node:perf_hooks"), {
        isBlobLike: n93,
        ReadableStreamFrom: r93,
        isValidHTTPToken: LC8,
        normalizedMethodRecordsBase: o93
    } = W9(), UA1 = h1("node:assert"), {
        isUint8Array: a93
    } = h1("node:util/types"), {
        webidl: fk1
    } = OM(), RC8 = [], U16;
    try {
        U16 = h1("node:crypto");
        let A = ["sha256", "sha384", "sha512"];
        RC8 = U16.getHashes().filter((q) => A.includes(q))
    } catch {}

    function yC8(A) {
        let q = A.urlList,
            K = q.length;
        return K === 0 ? null : q[K - 1].toString()
    }

    function s93(A, q) {
        if (!g93.has(A.status)) return null;
        let K = A.headersList.get("location", !0);
        if (K !== null && SC8(K)) {
            if (!CC8(K)) K = t93(K);
            K = new URL(K, yC8(A))
        }
        if (K && !K.hash) K.hash = q;
        return K
    }

    function CC8(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K > 126 || K < 32) return !1
        }
        return !0
    }

    function t93(A) {
        return Buffer.from(A, "binary").toString("utf8")
    }

    function Nk1(A) {
        return A.urlList[A.urlList.length - 1]
    }

    function e93(A) {
        let q = Nk1(A);
        if (uC8(q) && p93.has(q.port)) return "blocked";
        return "allowed"
    }

    function AY3(A) {
        return A instanceof Error || (A?.constructor?.name === "Error" || A?.constructor?.name === "DOMException")
    }

    function qY3(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (!(K === 9 || K >= 32 && K <= 126 || K >= 128 && K <= 255)) return !1
        }
        return !0
    }
    var KY3 = LC8;

    function SC8(A) {
        return (A[0] === "\t" || A[0] === " " || A[A.length - 1] === "\t" || A[A.length - 1] === " " || A.includes(`
`) || A.includes("\r") || A.includes("\x00")) === !1
    }

    function YY3(A, q) {
        let {
            headersList: K
        } = q, Y = (K.get("referrer-policy", !0) ?? "").split(","), z = "";
        if (Y.length > 0)
            for (let w = Y.length; w !== 0; w--) {
                let H = Y[w - 1].trim();
                if (U93.has(H)) {
                    z = H;
                    break
                }
            }
        if (z !== "") A.referrerPolicy = z
    }

    function zY3() {
        return "allowed"
    }

    function wY3() {
        return "success"
    }

    function HY3() {
        return "success"
    }

    function $Y3(A) {
        let q = null;
        q = A.mode, A.headersList.set("sec-fetch-mode", q, !0)
    }

    function OY3(A) {
        let q = A.origin;
        if (q === "client" || q === void 0) return;
        if (A.responseTainting === "cors" || A.mode === "websocket") A.headersList.append("origin", q, !0);
        else if (A.method !== "GET" && A.method !== "HEAD") {
            switch (A.referrerPolicy) {
                case "no-referrer":
                    q = null;
                    break;
                case "no-referrer-when-downgrade":
                case "strict-origin":
                case "strict-origin-when-cross-origin":
                    if (A.origin && mn6(A.origin) && !mn6(Nk1(A))) q = null;
                    break;
                case "same-origin":
                    if (!p16(A, Nk1(A))) q = null;
                    break;
                default:
            }
            A.headersList.append("origin", q, !0)
        }
    }

    function V$1(A, q) {
        return A
    }

    function _Y3(A, q, K) {
        if (!A?.startTime || A.startTime < q) return {
            domainLookupStartTime: q,
            domainLookupEndTime: q,
            connectionStartTime: q,
            connectionEndTime: q,
            secureConnectionStartTime: q,
            ALPNNegotiatedProtocol: A?.ALPNNegotiatedProtocol
        };
        return {
            domainLookupStartTime: V$1(A.domainLookupStartTime, K),
            domainLookupEndTime: V$1(A.domainLookupEndTime, K),
            connectionStartTime: V$1(A.connectionStartTime, K),
            connectionEndTime: V$1(A.connectionEndTime, K),
            secureConnectionStartTime: V$1(A.secureConnectionStartTime, K),
            ALPNNegotiatedProtocol: A.ALPNNegotiatedProtocol
        }
    }

    function JY3(A) {
        return V$1(i93.now(), A)
    }

    function XY3(A) {
        return {
            startTime: A.startTime ?? 0,
            redirectStartTime: 0,
            redirectEndTime: 0,
            postRedirectStartTime: A.startTime ?? 0,
            finalServiceWorkerStartTime: 0,
            finalNetworkResponseStartTime: 0,
            finalNetworkRequestStartTime: 0,
            endTime: 0,
            encodedBodySize: 0,
            decodedBodySize: 0,
            finalConnectionTimingInfo: null
        }
    }

    function hC8() {
        return {
            referrerPolicy: "strict-origin-when-cross-origin"
        }
    }

    function DY3(A) {
        return {
            referrerPolicy: A.referrerPolicy
        }
    }

    function jY3(A) {
        let q = A.referrerPolicy;
        UA1(q);
        let K = null;
        if (A.referrer === "client") {
            let $ = kC8();
            if (!$ || $.origin === "null") return "no-referrer";
            K = new URL($)
        } else if (A.referrer instanceof URL) K = A.referrer;
        let Y = Bn6(K),
            z = Bn6(K, !0);
        if (Y.toString().length > 4096) Y = z;
        let w = p16(A, Y),
            H = Vk1(Y) && !Vk1(A.url);
        switch (q) {
            case "origin":
                return z != null ? z : Bn6(K, !0);
            case "unsafe-url":
                return Y;
            case "same-origin":
                return w ? z : "no-referrer";
            case "origin-when-cross-origin":
                return w ? Y : z;
            case "strict-origin-when-cross-origin": {
                let $ = Nk1(A);
                if (p16(Y, $)) return Y;
                if (Vk1(Y) && !Vk1($)) return "no-referrer";
                return z
            }
            case "strict-origin":
            case "no-referrer-when-downgrade":
            default:
                return H ? "no-referrer" : z
        }
    }

    function Bn6(A, q) {
        if (UA1(A instanceof URL), A = new URL(A), A.protocol === "file:" || A.protocol === "about:" || A.protocol === "blank:") return "no-referrer";
        if (A.username = "", A.password = "", A.hash = "", q) A.pathname = "", A.search = "";
        return A
    }

    function Vk1(A) {
        if (!(A instanceof URL)) return !1;
        if (A.href === "about:blank" || A.href === "about:srcdoc") return !0;
        if (A.protocol === "data:") return !0;
        if (A.protocol === "file:") return !0;
        return q(A.origin);

        function q(K) {
            if (K == null || K === "null") return !1;
            let Y = new URL(K);
            if (Y.protocol === "https:" || Y.protocol === "wss:") return !0;
            if (/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(Y.hostname) || (Y.hostname === "localhost" || Y.hostname.includes("localhost.")) || Y.hostname.endsWith(".localhost")) return !0;
            return !1
        }
    }

    function MY3(A, q) {
        if (U16 === void 0) return !0;
        let K = IC8(q);
        if (K === "no metadata") return !0;
        if (K.length === 0) return !0;
        let Y = WY3(K),
            z = GY3(K, Y);
        for (let w of z) {
            let {
                algo: H,
                hash: $
            } = w, O = U16.createHash(H).update(A).digest("base64");
            if (O[O.length - 1] === "=")
                if (O[O.length - 2] === "=") O = O.slice(0, -2);
                else O = O.slice(0, -1);
            if (ZY3(O, $)) return !0
        }
        return !1
    }
    var PY3 = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

    function IC8(A) {
        let q = [],
            K = !0;
        for (let Y of A.split(" ")) {
            K = !1;
            let z = PY3.exec(Y);
            if (z === null || z.groups === void 0 || z.groups.algo === void 0) continue;
            let w = z.groups.algo.toLowerCase();
            if (RC8.includes(w)) q.push(z.groups)
        }
        if (K === !0) return "no metadata";
        return q
    }

    function WY3(A) {
        let q = A[0].algo;
        if (q[3] === "5") return q;
        for (let K = 1; K < A.length; ++K) {
            let Y = A[K];
            if (Y.algo[3] === "5") {
                q = "sha512";
                break
            } else if (q[3] === "3") continue;
            else if (Y.algo[3] === "3") q = "sha384"
        }
        return q
    }

    function GY3(A, q) {
        if (A.length === 1) return A;
        let K = 0;
        for (let Y = 0; Y < A.length; ++Y)
            if (A[Y].algo === q) A[K++] = A[Y];
        return A.length = K, A
    }

    function ZY3(A, q) {
        if (A.length !== q.length) return !1;
        for (let K = 0; K < A.length; ++K)
            if (A[K] !== q[K]) {
                if (A[K] === "+" && q[K] === "-" || A[K] === "/" && q[K] === "_") continue;
                return !1
            } return !0
    }

    function fY3(A) {}

    function p16(A, q) {
        if (A.origin === q.origin && A.origin === "null") return !0;
        if (A.protocol === q.protocol && A.hostname === q.hostname && A.port === q.port) return !0;
        return !1
    }

    function VY3() {
        let A, q;
        return {
            promise: new Promise((Y, z) => {
                A = Y, q = z
            }),
            resolve: A,
            reject: q
        }
    }

    function NY3(A) {
        return A.controller.state === "aborted"
    }

    function TY3(A) {
        return A.controller.state === "aborted" || A.controller.state === "terminated"
    }

    function vY3(A) {
        return o93[A.toLowerCase()] ?? A
    }

    function EY3(A) {
        let q = JSON.stringify(A);
        if (q === void 0) throw TypeError("Value is not JSON serializable");
        return UA1(typeof q === "string"), q
    }
    var kY3 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

    function xC8(A, q, K = 0, Y = 1) {
        class z {
            #A;
            #q;
            #K;
            constructor(w, H) {
                this.#A = w, this.#q = H, this.#K = 0
            }
            next() {
                if (typeof this !== "object" || this === null || !(#A in this)) throw TypeError(`'next' called on an object that does not implement interface ${A} Iterator.`);
                let w = this.#K,
                    H = this.#A[q],
                    $ = H.length;
                if (w >= $) return {
                    value: void 0,
                    done: !0
                };
                let {
                    [K]: O, [Y]: _
                } = H[w];
                this.#K = w + 1;
                let J;
                switch (this.#q) {
                    case "key":
                        J = O;
                        break;
                    case "value":
                        J = _;
                        break;
                    case "key+value":
                        J = [O, _];
                        break
                }
                return {
                    value: J,
                    done: !1
                }
            }
        }
        return delete z.prototype.constructor, Object.setPrototypeOf(z.prototype, kY3), Object.defineProperties(z.prototype, {
                [Symbol.toStringTag]: {
                    writable: !1,
                    enumerable: !1,
                    configurable: !0,
                    value: `${A} Iterator`
                },
                next: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                }
            }),
            function(w, H) {
                return new z(w, H)
            }
    }

    function LY3(A, q, K, Y = 0, z = 1) {
        let w = xC8(A, K, Y, z),
            H = {
                keys: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return fk1.brandCheck(this, q), w(this, "key")
                    }
                },
                values: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return fk1.brandCheck(this, q), w(this, "value")
                    }
                },
                entries: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return fk1.brandCheck(this, q), w(this, "key+value")
                    }
                },
                forEach: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function(O, _ = globalThis) {
                        if (fk1.brandCheck(this, q), fk1.argumentLengthCheck(arguments, 1, `${A}.forEach`), typeof O !== "function") throw TypeError(`Failed to execute 'forEach' on '${A}': parameter 1 is not of type 'Function'.`);
                        for (let {
                                0: J,
                                1: X
                            }
                            of w(this, "key+value")) O.call(_, X, J, this)
                    }
                }
            };
        return Object.defineProperties(q.prototype, {
            ...H,
            [Symbol.iterator]: {
                writable: !0,
                enumerable: !1,
                configurable: !0,
                value: H.entries.value
            }
        })
    }
    async function RY3(A, q, K) {
        let Y = q,
            z = K,
            w;
        try {
            w = A.stream.getReader()
        } catch (H) {
            z(H);
            return
        }
        try {
            Y(await bC8(w))
        } catch (H) {
            z(H)
        }
    }

    function yY3(A) {
        return A instanceof ReadableStream || A[Symbol.toStringTag] === "ReadableStream" && typeof A.tee === "function"
    }

    function CY3(A) {
        try {
            A.close(), A.byobRequest?.respond(0)
        } catch (q) {
            if (!q.message.includes("Controller is already closed") && !q.message.includes("ReadableStream is already closed")) throw q
        }
    }
    var SY3 = /[^\x00-\xFF]/;

    function g16(A) {
        return UA1(!SY3.test(A)), A
    }
    async function bC8(A) {
        let q = [],
            K = 0;
        while (!0) {
            let {
                done: Y,
                value: z
            } = await A.read();
            if (Y) return Buffer.concat(q, K);
            if (!a93(z)) throw TypeError("Received non-Uint8Array chunk");
            q.push(z), K += z.length
        }
    }

    function hY3(A) {
        UA1("protocol" in A);
        let q = A.protocol;
        return q === "about:" || q === "blob:" || q === "data:"
    }

    function mn6(A) {
        return typeof A === "string" && A[5] === ":" && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && A[4] === "s" || A.protocol === "https:"
    }

    function uC8(A) {
        UA1("protocol" in A);
        let q = A.protocol;
        return q === "http:" || q === "https:"
    }

    function IY3(A, q) {
        let K = A;
        if (!K.startsWith("bytes")) return "failure";
        let Y = {
            position: 5
        };
        if (q) gA1((O) => O === "\t" || O === " ", K, Y);
        if (K.charCodeAt(Y.position) !== 61) return "failure";
        if (Y.position++, q) gA1((O) => O === "\t" || O === " ", K, Y);
        let z = gA1((O) => {
                let _ = O.charCodeAt(0);
                return _ >= 48 && _ <= 57
            }, K, Y),
            w = z.length ? Number(z) : null;
        if (q) gA1((O) => O === "\t" || O === " ", K, Y);
        if (K.charCodeAt(Y.position) !== 45) return "failure";
        if (Y.position++, q) gA1((O) => O === "\t" || O === " ", K, Y);
        let H = gA1((O) => {
                let _ = O.charCodeAt(0);
                return _ >= 48 && _ <= 57
            }, K, Y),
            $ = H.length ? Number(H) : null;
        if (Y.position < K.length) return "failure";
        if ($ === null && w === null) return "failure";
        if (w > $) return "failure";
        return {
            rangeStartValue: w,
            rangeEndValue: $
        }
    }

    function xY3(A, q, K) {
        let Y = "bytes ";
        return Y += g16(`${A}`), Y += "-", Y += g16(`${q}`), Y += "/", Y += g16(`${K}`), Y
    }
    class BC8 extends Q93 {
        #A;
        constructor(A) {
            super();
            this.#A = A
        }
        _transform(A, q, K) {
            if (!this._inflateStream) {
                if (A.length === 0) {
                    K();
                    return
                }
                this._inflateStream = (A[0] & 15) === 8 ? EC8.createInflate(this.#A) : EC8.createInflateRaw(this.#A), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (Y) => this.destroy(Y))
            }
            this._inflateStream.write(A, q, K)
        }
        _final(A) {
            if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
            A()
        }
    }

    function bY3(A) {
        return new BC8(A)
    }

    function uY3(A) {
        let q = null,
            K = null,
            Y = null,
            z = mC8("content-type", A);
        if (z === null) return "failure";
        for (let w of z) {
            let H = l93(w);
            if (H === "failure" || H.essence === "*/*") continue;
            if (Y = H, Y.essence !== K) {
                if (q = null, Y.parameters.has("charset")) q = Y.parameters.get("charset");
                K = Y.essence
            } else if (!Y.parameters.has("charset") && q !== null) Y.parameters.set("charset", q)
        }
        if (Y == null) return "failure";
        return Y
    }

    function BY3(A) {
        let q = A,
            K = {
                position: 0
            },
            Y = [],
            z = "";
        while (K.position < q.length) {
            if (z += gA1((w) => w !== '"' && w !== ",", q, K), K.position < q.length)
                if (q.charCodeAt(K.position) === 34) {
                    if (z += d93(q, K), K.position < q.length) continue
                } else UA1(q.charCodeAt(K.position) === 44), K.position++;
            z = c93(z, !0, !0, (w) => w === 9 || w === 32), Y.push(z), z = ""
        }
        return Y
    }

    function mC8(A, q) {
        let K = q.get(A, !0);
        if (K === null) return null;
        return BY3(K)
    }
    var mY3 = new TextDecoder;

    function FY3(A) {
        if (A.length === 0) return "";
        if (A[0] === 239 && A[1] === 187 && A[2] === 191) A = A.subarray(3);
        return mY3.decode(A)
    }
    class FC8 {
        get baseUrl() {
            return kC8()
        }
        get origin() {
            return this.baseUrl?.origin
        }
        policyContainer = hC8()
    }
    class QC8 {
        settingsObject = new FC8
    }
    var QY3 = new QC8;
    gC8.exports = {
        isAborted: NY3,
        isCancelled: TY3,
        isValidEncodedURL: CC8,
        createDeferredPromise: VY3,
        ReadableStreamFrom: r93,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: fY3,
        clampAndCoarsenConnectionTimingInfo: _Y3,
        coarsenedSharedCurrentTime: JY3,
        determineRequestsReferrer: jY3,
        makePolicyContainer: hC8,
        clonePolicyContainer: DY3,
        appendFetchMetadata: $Y3,
        appendRequestOriginHeader: OY3,
        TAOCheck: HY3,
        corsCheck: wY3,
        crossOriginResourcePolicyCheck: zY3,
        createOpaqueTimingInfo: XY3,
        setRequestReferrerPolicyOnRedirect: YY3,
        isValidHTTPToken: LC8,
        requestBadPort: e93,
        requestCurrentURL: Nk1,
        responseURL: yC8,
        responseLocationURL: s93,
        isBlobLike: n93,
        isURLPotentiallyTrustworthy: Vk1,
        isValidReasonPhrase: qY3,
        sameOrigin: p16,
        normalizeMethod: vY3,
        serializeJavascriptValueToJSONString: EY3,
        iteratorMixin: LY3,
        createIterator: xC8,
        isValidHeaderName: KY3,
        isValidHeaderValue: SC8,
        isErrorLike: AY3,
        fullyReadBody: RY3,
        bytesMatch: MY3,
        isReadableStreamLike: yY3,
        readableStreamClose: CY3,
        isomorphicEncode: g16,
        urlIsLocal: hY3,
        urlHasHttpsScheme: mn6,
        urlIsHttpHttpsScheme: uC8,
        readAllBytes: bC8,
        simpleRangeHeaderValue: IY3,
        buildContentRange: xY3,
        parseMetadata: IC8,
        createInflate: bY3,
        extractMimeType: uY3,
        getDecodeSplit: mC8,
        utf8DecodeBytes: FY3,
        environmentSettingsObject: QY3
    }
})
// @from(Ln 83435, Col 4)
ti = R((i82, UC8) => {
    UC8.exports = {
        kUrl: Symbol("url"),
        kHeaders: Symbol("headers"),
        kSignal: Symbol("signal"),
        kState: Symbol("state"),
        kDispatcher: Symbol("dispatcher")
    }
})
// @from(Ln 83444, Col 4)
Fn6 = R((n82, pC8) => {
    var {
        Blob: gY3,
        File: UY3
    } = h1("node:buffer"), {
        kState: Xg
    } = ti(), {
        webidl: Tb
    } = OM();
    class vb {
        constructor(A, q, K = {}) {
            let Y = q,
                z = K.type,
                w = K.lastModified ?? Date.now();
            this[Xg] = {
                blobLike: A,
                name: Y,
                type: z,
                lastModified: w
            }
        }
        stream(...A) {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.stream(...A)
        }
        arrayBuffer(...A) {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.arrayBuffer(...A)
        }
        slice(...A) {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.slice(...A)
        }
        text(...A) {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.text(...A)
        }
        get size() {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.size
        }
        get type() {
            return Tb.brandCheck(this, vb), this[Xg].blobLike.type
        }
        get name() {
            return Tb.brandCheck(this, vb), this[Xg].name
        }
        get lastModified() {
            return Tb.brandCheck(this, vb), this[Xg].lastModified
        }
        get[Symbol.toStringTag]() {
            return "File"
        }
    }
    Tb.converters.Blob = Tb.interfaceConverter(gY3);

    function pY3(A) {
        return A instanceof UY3 || A && (typeof A.stream === "function" || typeof A.arrayBuffer === "function") && A[Symbol.toStringTag] === "File"
    }
    pC8.exports = {
        FileLike: vb,
        isFileLike: pY3
    }
})
// @from(Ln 83503, Col 4)
Tk1 = R((r82, nC8) => {
    var {
        isBlobLike: d16,
        iteratorMixin: dY3
    } = bT(), {
        kState: FG
    } = ti(), {
        kEnumerableProperty: N$1
    } = W9(), {
        FileLike: dC8,
        isFileLike: cY3
    } = Fn6(), {
        webidl: zH
    } = OM(), {
        File: iC8
    } = h1("node:buffer"), cC8 = h1("node:util"), lC8 = globalThis.File ?? iC8;
    class Eb {
        constructor(A) {
            if (zH.util.markAsUncloneable(this), A !== void 0) throw zH.errors.conversionFailed({
                prefix: "FormData constructor",
                argument: "Argument 1",
                types: ["undefined"]
            });
            this[FG] = []
        }
        append(A, q, K = void 0) {
            zH.brandCheck(this, Eb);
            let Y = "FormData.append";
            if (zH.argumentLengthCheck(arguments, 2, Y), arguments.length === 3 && !d16(q)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
            A = zH.converters.USVString(A, Y, "name"), q = d16(q) ? zH.converters.Blob(q, Y, "value", {
                strict: !1
            }) : zH.converters.USVString(q, Y, "value"), K = arguments.length === 3 ? zH.converters.USVString(K, Y, "filename") : void 0;
            let z = Qn6(A, q, K);
            this[FG].push(z)
        }
        delete(A) {
            zH.brandCheck(this, Eb);
            let q = "FormData.delete";
            zH.argumentLengthCheck(arguments, 1, q), A = zH.converters.USVString(A, q, "name"), this[FG] = this[FG].filter((K) => K.name !== A)
        }
        get(A) {
            zH.brandCheck(this, Eb);
            let q = "FormData.get";
            zH.argumentLengthCheck(arguments, 1, q), A = zH.converters.USVString(A, q, "name");
            let K = this[FG].findIndex((Y) => Y.name === A);
            if (K === -1) return null;
            return this[FG][K].value
        }
        getAll(A) {
            zH.brandCheck(this, Eb);
            let q = "FormData.getAll";
            return zH.argumentLengthCheck(arguments, 1, q), A = zH.converters.USVString(A, q, "name"), this[FG].filter((K) => K.name === A).map((K) => K.value)
        }
        has(A) {
            zH.brandCheck(this, Eb);
            let q = "FormData.has";
            return zH.argumentLengthCheck(arguments, 1, q), A = zH.converters.USVString(A, q, "name"), this[FG].findIndex((K) => K.name === A) !== -1
        }
        set(A, q, K = void 0) {
            zH.brandCheck(this, Eb);
            let Y = "FormData.set";
            if (zH.argumentLengthCheck(arguments, 2, Y), arguments.length === 3 && !d16(q)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
            A = zH.converters.USVString(A, Y, "name"), q = d16(q) ? zH.converters.Blob(q, Y, "name", {
                strict: !1
            }) : zH.converters.USVString(q, Y, "name"), K = arguments.length === 3 ? zH.converters.USVString(K, Y, "name") : void 0;
            let z = Qn6(A, q, K),
                w = this[FG].findIndex((H) => H.name === A);
            if (w !== -1) this[FG] = [...this[FG].slice(0, w), z, ...this[FG].slice(w + 1).filter((H) => H.name !== A)];
            else this[FG].push(z)
        } [cC8.inspect.custom](A, q) {
            let K = this[FG].reduce((z, w) => {
                if (z[w.name])
                    if (Array.isArray(z[w.name])) z[w.name].push(w.value);
                    else z[w.name] = [z[w.name], w.value];
                else z[w.name] = w.value;
                return z
            }, {
                __proto__: null
            });
            q.depth ??= A, q.colors ??= !0;
            let Y = cC8.formatWithOptions(q, K);
            return `FormData ${Y.slice(Y.indexOf("]")+2)}`
        }
    }
    dY3("FormData", Eb, FG, "name", "value");
    Object.defineProperties(Eb.prototype, {
        append: N$1,
        delete: N$1,
        get: N$1,
        getAll: N$1,
        has: N$1,
        set: N$1,
        [Symbol.toStringTag]: {
            value: "FormData",
            configurable: !0
        }
    });

    function Qn6(A, q, K) {
        if (typeof q === "string");
        else {
            if (!cY3(q)) q = q instanceof Blob ? new lC8([q], "blob", {
                type: q.type
            }) : new dC8(q, "blob", {
                type: q.type
            });
            if (K !== void 0) {
                let Y = {
                    type: q.type,
                    lastModified: q.lastModified
                };
                q = q instanceof iC8 ? new lC8([q], K, Y) : new dC8(q, K, Y)
            }
        }
        return {
            name: A,
            value: q
        }
    }
    nC8.exports = {
        FormData: Eb,
        makeEntry: Qn6
    }
})
// @from(Ln 83627, Col 4)
eC8 = R((o82, tC8) => {
    var {
        isUSVString: rC8,
        bufferToLowerCasedHeaderName: lY3
    } = W9(), {
        utf8DecodeBytes: iY3
    } = bT(), {
        HTTP_TOKEN_CODEPOINTS: nY3,
        isomorphicDecode: oC8
    } = qV(), {
        isFileLike: rY3
    } = Fn6(), {
        makeEntry: oY3
    } = Tk1(), c16 = h1("node:assert"), {
        File: aY3
    } = h1("node:buffer"), sY3 = globalThis.File ?? aY3, tY3 = Buffer.from('form-data; name="'), aC8 = Buffer.from("; filename"), eY3 = Buffer.from("--"), Az3 = Buffer.from(`--\r
`);

    function qz3(A) {
        for (let q = 0; q < A.length; ++q)
            if ((A.charCodeAt(q) & -128) !== 0) return !1;
        return !0
    }

    function Kz3(A) {
        let q = A.length;
        if (q < 27 || q > 70) return !1;
        for (let K = 0; K < q; ++K) {
            let Y = A.charCodeAt(K);
            if (!(Y >= 48 && Y <= 57 || Y >= 65 && Y <= 90 || Y >= 97 && Y <= 122 || Y === 39 || Y === 45 || Y === 95)) return !1
        }
        return !0
    }

    function Yz3(A, q) {
        c16(q !== "failure" && q.essence === "multipart/form-data");
        let K = q.parameters.get("boundary");
        if (K === void 0) return "failure";
        let Y = Buffer.from(`--${K}`, "utf8"),
            z = [],
            w = {
                position: 0
            };
        while (A[w.position] === 13 && A[w.position + 1] === 10) w.position += 2;
        let H = A.length;
        while (A[H - 1] === 10 && A[H - 2] === 13) H -= 2;
        if (H !== A.length) A = A.subarray(0, H);
        while (!0) {
            if (A.subarray(w.position, w.position + Y.length).equals(Y)) w.position += Y.length;
            else return "failure";
            if (w.position === A.length - 2 && l16(A, eY3, w) || w.position === A.length - 4 && l16(A, Az3, w)) return z;
            if (A[w.position] !== 13 || A[w.position + 1] !== 10) return "failure";
            w.position += 2;
            let $ = zz3(A, w);
            if ($ === "failure") return "failure";
            let {
                name: O,
                filename: _,
                contentType: J,
                encoding: X
            } = $;
            w.position += 2;
            let D;
            {
                let M = A.indexOf(Y.subarray(2), w.position);
                if (M === -1) return "failure";
                if (D = A.subarray(w.position, M - 4), w.position += D.length, X === "base64") D = Buffer.from(D.toString(), "base64")
            }
            if (A[w.position] !== 13 || A[w.position + 1] !== 10) return "failure";
            else w.position += 2;
            let j;
            if (_ !== null) {
                if (J ??= "text/plain", !qz3(J)) J = "";
                j = new sY3([D], _, {
                    type: J
                })
            } else j = iY3(Buffer.from(D));
            c16(rC8(O)), c16(typeof j === "string" && rC8(j) || rY3(j)), z.push(oY3(O, j, _))
        }
    }

    function zz3(A, q) {
        let K = null,
            Y = null,
            z = null,
            w = null;
        while (!0) {
            if (A[q.position] === 13 && A[q.position + 1] === 10) {
                if (K === null) return "failure";
                return {
                    name: K,
                    filename: Y,
                    contentType: z,
                    encoding: w
                }
            }
            let H = T$1(($) => $ !== 10 && $ !== 13 && $ !== 58, A, q);
            if (H = gn6(H, !0, !0, ($) => $ === 9 || $ === 32), !nY3.test(H.toString())) return "failure";
            if (A[q.position] !== 58) return "failure";
            switch (q.position++, T$1(($) => $ === 32 || $ === 9, A, q), lY3(H)) {
                case "content-disposition": {
                    if (K = Y = null, !l16(A, tY3, q)) return "failure";
                    if (q.position += 17, K = sC8(A, q), K === null) return "failure";
                    if (l16(A, aC8, q)) {
                        let $ = q.position + aC8.length;
                        if (A[$] === 42) q.position += 1, $ += 1;
                        if (A[$] !== 61 || A[$ + 1] !== 34) return "failure";
                        if (q.position += 12, Y = sC8(A, q), Y === null) return "failure"
                    }
                    break
                }
                case "content-type": {
                    let $ = T$1((O) => O !== 10 && O !== 13, A, q);
                    $ = gn6($, !1, !0, (O) => O === 9 || O === 32), z = oC8($);
                    break
                }
                case "content-transfer-encoding": {
                    let $ = T$1((O) => O !== 10 && O !== 13, A, q);
                    $ = gn6($, !1, !0, (O) => O === 9 || O === 32), w = oC8($);
                    break
                }
                default:
                    T$1(($) => $ !== 10 && $ !== 13, A, q)
            }
            if (A[q.position] !== 13 && A[q.position + 1] !== 10) return "failure";
            else q.position += 2
        }
    }

    function sC8(A, q) {
        c16(A[q.position - 1] === 34);
        let K = T$1((Y) => Y !== 10 && Y !== 13 && Y !== 34, A, q);
        if (A[q.position] !== 34) return null;
        else q.position++;
        return K = new TextDecoder().decode(K).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), K
    }

    function T$1(A, q, K) {
        let Y = K.position;
        while (Y < q.length && A(q[Y])) ++Y;
        return q.subarray(K.position, K.position = Y)
    }

    function gn6(A, q, K, Y) {
        let z = 0,
            w = A.length - 1;
        if (q)
            while (z < A.length && Y(A[z])) z++;
        if (K)
            while (w > 0 && Y(A[w])) w--;
        return z === 0 && w === A.length - 1 ? A : A.subarray(z, w + 1)
    }

    function l16(A, q, K) {
        if (A.length < q.length) return !1;
        for (let Y = 0; Y < q.length; Y++)
            if (q[Y] !== A[K.position + Y]) return !1;
        return !0
    }
    tC8.exports = {
        multipartFormDataParser: Yz3,
        validateBoundary: Kz3
    }
})
// @from(Ln 83792, Col 4)
k$1 = R((a82, $S8) => {
    var vk1 = W9(),
        {
            ReadableStreamFrom: wz3,
            isBlobLike: AS8,
            isReadableStreamLike: Hz3,
            readableStreamClose: $z3,
            createDeferredPromise: Oz3,
            fullyReadBody: _z3,
            extractMimeType: Jz3,
            utf8DecodeBytes: YS8
        } = bT(),
        {
            FormData: qS8
        } = Tk1(),
        {
            kState: E$1
        } = ti(),
        {
            webidl: Xz3
        } = OM(),
        {
            Blob: Dz3
        } = h1("node:buffer"),
        Un6 = h1("node:assert"),
        {
            isErrored: zS8,
            isDisturbed: jz3
        } = h1("node:stream"),
        {
            isArrayBuffer: Mz3
        } = h1("node:util/types"),
        {
            serializeAMimeType: Pz3
        } = qV(),
        {
            multipartFormDataParser: Wz3
        } = eC8(),
        pn6;
    try {
        let A = h1("node:crypto");
        pn6 = (q) => A.randomInt(0, q)
    } catch {
        pn6 = (A) => Math.floor(Math.random(A))
    }
    var i16 = new TextEncoder;

    function Gz3() {}
    var dn6 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
        cn6;
    if (dn6) cn6 = new FinalizationRegistry((A) => {
        let q = A.deref();
        if (q && !q.locked && !jz3(q) && !zS8(q)) q.cancel("Response object has been garbage collected").catch(Gz3)
    });

    function wS8(A, q = !1) {
        let K = null;
        if (A instanceof ReadableStream) K = A;
        else if (AS8(A)) K = A.stream();
        else K = new ReadableStream({
            async pull(O) {
                let _ = typeof z === "string" ? i16.encode(z) : z;
                if (_.byteLength) O.enqueue(_);
                queueMicrotask(() => $z3(O))
            },
            start() {},
            type: "bytes"
        });
        Un6(Hz3(K));
        let Y = null,
            z = null,
            w = null,
            H = null;
        if (typeof A === "string") z = A, H = "text/plain;charset=UTF-8";
        else if (A instanceof URLSearchParams) z = A.toString(), H = "application/x-www-form-urlencoded;charset=UTF-8";
        else if (Mz3(A)) z = new Uint8Array(A.slice());
        else if (ArrayBuffer.isView(A)) z = new Uint8Array(A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength));
        else if (vk1.isFormDataLike(A)) {
            let O = `----formdata-undici-0${`${pn6(100000000000)}`.padStart(11,"0")}`,
                _ = `--${O}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
            let J = (W) => W.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
                X = (W) => W.replace(/\r?\n|\r/g, `\r
`),
                D = [],
                j = new Uint8Array([13, 10]);
            w = 0;
            let M = !1;
            for (let [W, G] of A)
                if (typeof G === "string") {
                    let f = i16.encode(_ + `; name="${J(X(W))}"\r
\r
${X(G)}\r
`);
                    D.push(f), w += f.byteLength
                } else {
                    let f = i16.encode(`${_}; name="${J(X(W))}"` + (G.name ? `; filename="${J(G.name)}"` : "") + `\r
Content-Type: ${G.type||"application/octet-stream"}\r
\r
`);
                    if (D.push(f, G, j), typeof G.size === "number") w += f.byteLength + G.size + j.byteLength;
                    else M = !0
                } let P = i16.encode(`--${O}--`);
            if (D.push(P), w += P.byteLength, M) w = null;
            z = A, Y = async function*() {
                for (let W of D)
                    if (W.stream) yield* W.stream();
                    else yield W
            }, H = `multipart/form-data; boundary=${O}`
        } else if (AS8(A)) {
            if (z = A, w = A.size, A.type) H = A.type
        } else if (typeof A[Symbol.asyncIterator] === "function") {
            if (q) throw TypeError("keepalive");
            if (vk1.isDisturbed(A) || A.locked) throw TypeError("Response body object should not be disturbed or locked");
            K = A instanceof ReadableStream ? A : wz3(A)
        }
        if (typeof z === "string" || vk1.isBuffer(z)) w = Buffer.byteLength(z);
        if (Y != null) {
            let O;
            K = new ReadableStream({
                async start() {
                    O = Y(A)[Symbol.asyncIterator]()
                },
                async pull(_) {
                    let {
                        value: J,
                        done: X
                    } = await O.next();
                    if (X) queueMicrotask(() => {
                        _.close(), _.byobRequest?.respond(0)
                    });
                    else if (!zS8(K)) {
                        let D = new Uint8Array(J);
                        if (D.byteLength) _.enqueue(D)
                    }
                    return _.desiredSize > 0
                },
                async cancel(_) {
                    await O.return()
                },
                type: "bytes"
            })
        }
        return [{
            stream: K,
            source: z,
            length: w
        }, H]
    }

    function Zz3(A, q = !1) {
        if (A instanceof ReadableStream) Un6(!vk1.isDisturbed(A), "The body has already been consumed."), Un6(!A.locked, "The stream is locked.");
        return wS8(A, q)
    }

    function fz3(A, q) {
        let [K, Y] = q.stream.tee();
        if (dn6) cn6.register(A, new WeakRef(K));
        return q.stream = K, {
            stream: Y,
            length: q.length,
            source: q.source
        }
    }

    function Vz3(A) {
        if (A.aborted) throw new DOMException("The operation was aborted.", "AbortError")
    }

    function Nz3(A) {
        return {
            blob() {
                return v$1(this, (K) => {
                    let Y = KS8(this);
                    if (Y === null) Y = "";
                    else if (Y) Y = Pz3(Y);
                    return new Dz3([K], {
                        type: Y
                    })
                }, A)
            },
            arrayBuffer() {
                return v$1(this, (K) => {
                    return new Uint8Array(K).buffer
                }, A)
            },
            text() {
                return v$1(this, YS8, A)
            },
            json() {
                return v$1(this, vz3, A)
            },
            formData() {
                return v$1(this, (K) => {
                    let Y = KS8(this);
                    if (Y !== null) switch (Y.essence) {
                        case "multipart/form-data": {
                            let z = Wz3(K, Y);
                            if (z === "failure") throw TypeError("Failed to parse body as FormData.");
                            let w = new qS8;
                            return w[E$1] = z, w
                        }
                        case "application/x-www-form-urlencoded": {
                            let z = new URLSearchParams(K.toString()),
                                w = new qS8;
                            for (let [H, $] of z) w.append(H, $);
                            return w
                        }
                    }
                    throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
                }, A)
            },
            bytes() {
                return v$1(this, (K) => {
                    return new Uint8Array(K)
                }, A)
            }
        }
    }

    function Tz3(A) {
        Object.assign(A.prototype, Nz3(A))
    }
    async function v$1(A, q, K) {
        if (Xz3.brandCheck(A, K), HS8(A)) throw TypeError("Body is unusable: Body has already been read");
        Vz3(A[E$1]);
        let Y = Oz3(),
            z = (H) => Y.reject(H),
            w = (H) => {
                try {
                    Y.resolve(q(H))
                } catch ($) {
                    z($)
                }
            };
        if (A[E$1].body == null) return w(Buffer.allocUnsafe(0)), Y.promise;
        return await _z3(A[E$1].body, w, z), Y.promise
    }

    function HS8(A) {
        let q = A[E$1].body;
        return q != null && (q.stream.locked || vk1.isDisturbed(q.stream))
    }

    function vz3(A) {
        return JSON.parse(YS8(A))
    }

    function KS8(A) {
        let q = A[E$1].headersList,
            K = Jz3(q);
        if (K === "failure") return null;
        return K
    }
    $S8.exports = {
        extractBody: wS8,
        safelyExtractBody: Zz3,
        cloneBody: fz3,
        mixinBody: Tz3,
        streamRegistry: cn6,
        hasFinalizationRegistry: dn6,
        bodyUnusable: HS8
    }
})
// @from(Ln 84056, Col 4)
fS8 = R((s82, ZS8) => {
    var bK = h1("node:assert"),
        b3 = W9(),
        {
            channels: OS8
        } = D$1(),
        ln6 = kn6(),
        {
            RequestContentLengthMismatchError: pA1,
            ResponseContentLengthMismatchError: Ez3,
            RequestAbortedError: MS8,
            HeadersTimeoutError: kz3,
            HeadersOverflowError: Lz3,
            SocketError: t16,
            InformationalError: L$1,
            BodyTimeoutError: Rz3,
            HTTPParserError: yz3,
            ResponseExceededMaxSizeError: Cz3
        } = Lz(),
        {
            kUrl: PS8,
            kReset: KV,
            kClient: on6,
            kParser: f_,
            kBlocking: Lk1,
            kRunning: qW,
            kPending: Sz3,
            kSize: _S8,
            kWriting: An,
            kQueue: CC,
            kNoRef: Ek1,
            kKeepAliveDefaultTimeout: hz3,
            kHostHeader: Iz3,
            kPendingIdx: xz3,
            kRunningIdx: uk,
            kError: Bk,
            kPipelining: a16,
            kSocket: R$1,
            kKeepAliveTimeoutValue: e16,
            kMaxHeadersSize: in6,
            kKeepAliveMaxTimeout: bz3,
            kKeepAliveTimeoutThreshold: uz3,
            kHeadersTimeout: Bz3,
            kBodyTimeout: mz3,
            kStrictContentLength: an6,
            kMaxRequests: JS8,
            kCounter: Fz3,
            kMaxResponseSize: Qz3,
            kOnError: gz3,
            kResume: ei,
            kHTTPContext: WS8
        } = h$(),
        kb = YC8(),
        Uz3 = Buffer.alloc(0),
        n16 = Buffer[Symbol.species],
        r16 = b3.addListener,
        pz3 = b3.removeAllListeners,
        nn6;
    async function dz3() {
        let A = process.env.JEST_WORKER_ID ? hn6() : void 0,
            q;
        try {
            q = await WebAssembly.compile(HC8())
        } catch (K) {
            q = await WebAssembly.compile(A || hn6())
        }
        return await WebAssembly.instantiate(q, {
            env: {
                wasm_on_url: (K, Y, z) => {
                    return 0
                },
                wasm_on_status: (K, Y, z) => {
                    bK(LD.ptr === K);
                    let w = Y - Rb + Lb.byteOffset;
                    return LD.onStatus(new n16(Lb.buffer, w, z)) || 0
                },
                wasm_on_message_begin: (K) => {
                    return bK(LD.ptr === K), LD.onMessageBegin() || 0
                },
                wasm_on_header_field: (K, Y, z) => {
                    bK(LD.ptr === K);
                    let w = Y - Rb + Lb.byteOffset;
                    return LD.onHeaderField(new n16(Lb.buffer, w, z)) || 0
                },
                wasm_on_header_value: (K, Y, z) => {
                    bK(LD.ptr === K);
                    let w = Y - Rb + Lb.byteOffset;
                    return LD.onHeaderValue(new n16(Lb.buffer, w, z)) || 0
                },
                wasm_on_headers_complete: (K, Y, z, w) => {
                    return bK(LD.ptr === K), LD.onHeadersComplete(Y, Boolean(z), Boolean(w)) || 0
                },
                wasm_on_body: (K, Y, z) => {
                    bK(LD.ptr === K);
                    let w = Y - Rb + Lb.byteOffset;
                    return LD.onBody(new n16(Lb.buffer, w, z)) || 0
                },
                wasm_on_message_complete: (K) => {
                    return bK(LD.ptr === K), LD.onMessageComplete() || 0
                }
            }
        })
    }
    var rn6 = null,
        sn6 = dz3();
    sn6.catch();
    var LD = null,
        Lb = null,
        o16 = 0,
        Rb = null,
        cz3 = 0,
        kk1 = 1,
        y$1 = 2 | kk1,
        s16 = 4 | kk1,
        tn6 = 8 | cz3;
    class GS8 {
        constructor(A, q, {
            exports: K
        }) {
            bK(Number.isFinite(A[in6]) && A[in6] > 0), this.llhttp = K, this.ptr = this.llhttp.llhttp_alloc(kb.TYPE.RESPONSE), this.client = A, this.socket = q, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = A[in6], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = A[Qz3]
        }
        setTimeout(A, q) {
            if (A !== this.timeoutValue || q & kk1 ^ this.timeoutType & kk1) {
                if (this.timeout) ln6.clearTimeout(this.timeout), this.timeout = null;
                if (A)
                    if (q & kk1) this.timeout = ln6.setFastTimeout(XS8, A, new WeakRef(this));
                    else this.timeout = setTimeout(XS8, A, new WeakRef(this)), this.timeout.unref();
                this.timeoutValue = A
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.timeoutType = q
        }
        resume() {
            if (this.socket.destroyed || !this.paused) return;
            if (bK(this.ptr != null), bK(LD == null), this.llhttp.llhttp_resume(this.ptr), bK(this.timeoutType === s16), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.paused = !1, this.execute(this.socket.read() || Uz3), this.readMore()
        }
        readMore() {
            while (!this.paused && this.ptr) {
                let A = this.socket.read();
                if (A === null) break;
                this.execute(A)
            }
        }
        execute(A) {
            bK(this.ptr != null), bK(LD == null), bK(!this.paused);
            let {
                socket: q,
                llhttp: K
            } = this;
            if (A.length > o16) {
                if (Rb) K.free(Rb);
                o16 = Math.ceil(A.length / 4096) * 4096, Rb = K.malloc(o16)
            }
            new Uint8Array(K.memory.buffer, Rb, o16).set(A);
            try {
                let Y;
                try {
                    Lb = A, LD = this, Y = K.llhttp_execute(this.ptr, Rb, A.length)
                } catch (w) {
                    throw w
                } finally {
                    LD = null, Lb = null
                }
                let z = K.llhttp_get_error_pos(this.ptr) - Rb;
                if (Y === kb.ERROR.PAUSED_UPGRADE) this.onUpgrade(A.slice(z));
                else if (Y === kb.ERROR.PAUSED) this.paused = !0, q.unshift(A.slice(z));
                else if (Y !== kb.ERROR.OK) {
                    let w = K.llhttp_get_error_reason(this.ptr),
                        H = "";
                    if (w) {
                        let $ = new Uint8Array(K.memory.buffer, w).indexOf(0);
                        H = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(K.memory.buffer, w, $).toString() + ")"
                    }
                    throw new yz3(H, kb.ERROR[Y], A.slice(z))
                }
            } catch (Y) {
                b3.destroy(q, Y)
            }
        }
        destroy() {
            bK(this.ptr != null), bK(LD == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && ln6.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
        }
        onStatus(A) {
            this.statusText = A.toString()
        }
        onMessageBegin() {
            let {
                socket: A,
                client: q
            } = this;
            if (A.destroyed) return -1;
            let K = q[CC][q[uk]];
            if (!K) return -1;
            K.onResponseStarted()
        }
        onHeaderField(A) {
            let q = this.headers.length;
            if ((q & 1) === 0) this.headers.push(A);
            else this.headers[q - 1] = Buffer.concat([this.headers[q - 1], A]);
            this.trackHeader(A.length)
        }
        onHeaderValue(A) {
            let q = this.headers.length;
            if ((q & 1) === 1) this.headers.push(A), q += 1;
            else this.headers[q - 1] = Buffer.concat([this.headers[q - 1], A]);
            let K = this.headers[q - 2];
            if (K.length === 10) {
                let Y = b3.bufferToLowerCasedHeaderName(K);
                if (Y === "keep-alive") this.keepAlive += A.toString();
                else if (Y === "connection") this.connection += A.toString()
            } else if (K.length === 14 && b3.bufferToLowerCasedHeaderName(K) === "content-length") this.contentLength += A.toString();
            this.trackHeader(A.length)
        }
        trackHeader(A) {
            if (this.headersSize += A, this.headersSize >= this.headersMaxSize) b3.destroy(this.socket, new Lz3)
        }
        onUpgrade(A) {
            let {
                upgrade: q,
                client: K,
                socket: Y,
                headers: z,
                statusCode: w
            } = this;
            bK(q), bK(K[R$1] === Y), bK(!Y.destroyed), bK(!this.paused), bK((z.length & 1) === 0);
            let H = K[CC][K[uk]];
            bK(H), bK(H.upgrade || H.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, Y.unshift(A), Y[f_].destroy(), Y[f_] = null, Y[on6] = null, Y[Bk] = null, pz3(Y), K[R$1] = null, K[WS8] = null, K[CC][K[uk]++] = null, K.emit("disconnect", K[PS8], [K], new L$1("upgrade"));
            try {
                H.onUpgrade(w, z, Y)
            } catch ($) {
                b3.destroy(Y, $)
            }
            K[ei]()
        }
        onHeadersComplete(A, q, K) {
            let {
                client: Y,
                socket: z,
                headers: w,
                statusText: H
            } = this;
            if (z.destroyed) return -1;
            let $ = Y[CC][Y[uk]];
            if (!$) return -1;
            if (bK(!this.upgrade), bK(this.statusCode < 200), A === 100) return b3.destroy(z, new t16("bad response", b3.getSocketInfo(z))), -1;
            if (q && !$.upgrade) return b3.destroy(z, new t16("bad upgrade", b3.getSocketInfo(z))), -1;
            if (bK(this.timeoutType === y$1), this.statusCode = A, this.shouldKeepAlive = K || $.method === "HEAD" && !z[KV] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
                let _ = $.bodyTimeout != null ? $.bodyTimeout : Y[mz3];
                this.setTimeout(_, s16)
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if ($.method === "CONNECT") return bK(Y[qW] === 1), this.upgrade = !0, 2;
            if (q) return bK(Y[qW] === 1), this.upgrade = !0, 2;
            if (bK((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && Y[a16]) {
                let _ = this.keepAlive ? b3.parseKeepAliveTimeout(this.keepAlive) : null;
                if (_ != null) {
                    let J = Math.min(_ - Y[uz3], Y[bz3]);
                    if (J <= 0) z[KV] = !0;
                    else Y[e16] = J
                } else Y[e16] = Y[hz3]
            } else z[KV] = !0;
            let O = $.onHeaders(A, w, this.resume, H) === !1;
            if ($.aborted) return -1;
            if ($.method === "HEAD") return 1;
            if (A < 200) return 1;
            if (z[Lk1]) z[Lk1] = !1, Y[ei]();
            return O ? kb.ERROR.PAUSED : 0
        }
        onBody(A) {
            let {
                client: q,
                socket: K,
                statusCode: Y,
                maxResponseSize: z
            } = this;
            if (K.destroyed) return -1;
            let w = q[CC][q[uk]];
            if (bK(w), bK(this.timeoutType === s16), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if (bK(Y >= 200), z > -1 && this.bytesRead + A.length > z) return b3.destroy(K, new Cz3), -1;
            if (this.bytesRead += A.length, w.onData(A) === !1) return kb.ERROR.PAUSED
        }
        onMessageComplete() {
            let {
                client: A,
                socket: q,
                statusCode: K,
                upgrade: Y,
                headers: z,
                contentLength: w,
                bytesRead: H,
                shouldKeepAlive: $
            } = this;
            if (q.destroyed && (!K || $)) return -1;
            if (Y) return;
            bK(K >= 100), bK((this.headers.length & 1) === 0);
            let O = A[CC][A[uk]];
            if (bK(O), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, K < 200) return;
            if (O.method !== "HEAD" && w && H !== parseInt(w, 10)) return b3.destroy(q, new Ez3), -1;
            if (O.onComplete(z), A[CC][A[uk]++] = null, q[An]) return bK(A[qW] === 0), b3.destroy(q, new L$1("reset")), kb.ERROR.PAUSED;
            else if (!$) return b3.destroy(q, new L$1("reset")), kb.ERROR.PAUSED;
            else if (q[KV] && A[qW] === 0) return b3.destroy(q, new L$1("reset")), kb.ERROR.PAUSED;
            else if (A[a16] == null || A[a16] === 1) setImmediate(() => A[ei]());
            else A[ei]()
        }
    }

    function XS8(A) {
        let {
            socket: q,
            timeoutType: K,
            client: Y,
            paused: z
        } = A.deref();
        if (K === y$1) {
            if (!q[An] || q.writableNeedDrain || Y[qW] > 1) bK(!z, "cannot be paused while waiting for headers"), b3.destroy(q, new kz3)
        } else if (K === s16) {
            if (!z) b3.destroy(q, new Rz3)
        } else if (K === tn6) bK(Y[qW] === 0 && Y[e16]), b3.destroy(q, new L$1("socket idle timeout"))
    }
    async function lz3(A, q) {
        if (A[R$1] = q, !rn6) rn6 = await sn6, sn6 = null;
        q[Ek1] = !1, q[An] = !1, q[KV] = !1, q[Lk1] = !1, q[f_] = new GS8(A, q, rn6), r16(q, "error", function(Y) {
            bK(Y.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
            let z = this[f_];
            if (Y.code === "ECONNRESET" && z.statusCode && !z.shouldKeepAlive) {
                z.onMessageComplete();
                return
            }
            this[Bk] = Y, this[on6][gz3](Y)
        }), r16(q, "readable", function() {
            let Y = this[f_];
            if (Y) Y.readMore()
        }), r16(q, "end", function() {
            let Y = this[f_];
            if (Y.statusCode && !Y.shouldKeepAlive) {
                Y.onMessageComplete();
                return
            }
            b3.destroy(this, new t16("other side closed", b3.getSocketInfo(this)))
        }), r16(q, "close", function() {
            let Y = this[on6],
                z = this[f_];
            if (z) {
                if (!this[Bk] && z.statusCode && !z.shouldKeepAlive) z.onMessageComplete();
                this[f_].destroy(), this[f_] = null
            }
            let w = this[Bk] || new t16("closed", b3.getSocketInfo(this));
            if (Y[R$1] = null, Y[WS8] = null, Y.destroyed) {
                bK(Y[Sz3] === 0);
                let H = Y[CC].splice(Y[uk]);
                for (let $ = 0; $ < H.length; $++) {
                    let O = H[$];
                    b3.errorRequest(Y, O, w)
                }
            } else if (Y[qW] > 0 && w.code !== "UND_ERR_INFO") {
                let H = Y[CC][Y[uk]];
                Y[CC][Y[uk]++] = null, b3.errorRequest(Y, H, w)
            }
            Y[xz3] = Y[uk], bK(Y[qW] === 0), Y.emit("disconnect", Y[PS8], [Y], w), Y[ei]()
        });
        let K = !1;
        return q.on("close", () => {
            K = !0
        }), {
            version: "h1",
            defaultPipelining: 1,
            write(...Y) {
                return rz3(A, ...Y)
            },
            resume() {
                iz3(A)
            },
            destroy(Y, z) {
                if (K) queueMicrotask(z);
                else q.destroy(Y).on("close", z)
            },
            get destroyed() {
                return q.destroyed
            },
            busy(Y) {
                if (q[An] || q[KV] || q[Lk1]) return !0;
                if (Y) {
                    if (A[qW] > 0 && !Y.idempotent) return !0;
                    if (A[qW] > 0 && (Y.upgrade || Y.method === "CONNECT")) return !0;
                    if (A[qW] > 0 && b3.bodyLength(Y.body) !== 0 && (b3.isStream(Y.body) || b3.isAsyncIterable(Y.body) || b3.isFormDataLike(Y.body))) return !0
                }
                return !1
            }
        }
    }

    function iz3(A) {
        let q = A[R$1];
        if (q && !q.destroyed) {
            if (A[_S8] === 0) {
                if (!q[Ek1] && q.unref) q.unref(), q[Ek1] = !0
            } else if (q[Ek1] && q.ref) q.ref(), q[Ek1] = !1;
            if (A[_S8] === 0) {
                if (q[f_].timeoutType !== tn6) q[f_].setTimeout(A[e16], tn6)
            } else if (A[qW] > 0 && q[f_].statusCode < 200) {
                if (q[f_].timeoutType !== y$1) {
                    let K = A[CC][A[uk]],
                        Y = K.headersTimeout != null ? K.headersTimeout : A[Bz3];
                    q[f_].setTimeout(Y, y$1)
                }
            }
        }
    }

    function nz3(A) {
        return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
    }

    function rz3(A, q) {
        let {
            method: K,
            path: Y,
            host: z,
            upgrade: w,
            blocking: H,
            reset: $
        } = q, {
            body: O,
            headers: _,
            contentLength: J
        } = q, X = K === "PUT" || K === "POST" || K === "PATCH" || K === "QUERY" || K === "PROPFIND" || K === "PROPPATCH";
        if (b3.isFormDataLike(O)) {
            if (!nn6) nn6 = k$1().extractBody;
            let [W, G] = nn6(O);
            if (q.contentType == null) _.push("content-type", G);
            O = W.stream, J = W.length
        } else if (b3.isBlobLike(O) && q.contentType == null && O.type) _.push("content-type", O.type);
        if (O && typeof O.read === "function") O.read(0);
        let D = b3.bodyLength(O);
        if (J = D ?? J, J === null) J = q.contentLength;
        if (J === 0 && !X) J = null;
        if (nz3(K) && J > 0 && q.contentLength !== null && q.contentLength !== J) {
            if (A[an6]) return b3.errorRequest(A, q, new pA1), !1;
            process.emitWarning(new pA1)
        }
        let j = A[R$1],
            M = (W) => {
                if (q.aborted || q.completed) return;
                b3.errorRequest(A, q, W || new MS8), b3.destroy(O), b3.destroy(j, new L$1("aborted"))
            };
        try {
            q.onConnect(M)
        } catch (W) {
            b3.errorRequest(A, q, W)
        }
        if (q.aborted) return !1;
        if (K === "HEAD") j[KV] = !0;
        if (w || K === "CONNECT") j[KV] = !0;
        if ($ != null) j[KV] = $;
        if (A[JS8] && j[Fz3]++ >= A[JS8]) j[KV] = !0;
        if (H) j[Lk1] = !0;
        let P = `${K} ${Y} HTTP/1.1\r
`;
        if (typeof z === "string") P += `host: ${z}\r
`;
        else P += A[Iz3];
        if (w) P += `connection: upgrade\r
upgrade: ${w}\r
`;
        else if (A[a16] && !j[KV]) P += `connection: keep-alive\r
`;
        else P += `connection: close\r
`;
        if (Array.isArray(_))
            for (let W = 0; W < _.length; W += 2) {
                let G = _[W + 0],
                    f = _[W + 1];
                if (Array.isArray(f))
                    for (let Z = 0; Z < f.length; Z++) P += `${G}: ${f[Z]}\r
`;
                else P += `${G}: ${f}\r
`
            }
        if (OS8.sendHeaders.hasSubscribers) OS8.sendHeaders.publish({
            request: q,
            headers: P,
            socket: j
        });
        if (!O || D === 0) DS8(M, null, A, q, j, J, P, X);
        else if (b3.isBuffer(O)) DS8(M, O, A, q, j, J, P, X);
        else if (b3.isBlobLike(O))
            if (typeof O.stream === "function") jS8(M, O.stream(), A, q, j, J, P, X);
            else az3(M, O, A, q, j, J, P, X);
        else if (b3.isStream(O)) oz3(M, O, A, q, j, J, P, X);
        else if (b3.isIterable(O)) jS8(M, O, A, q, j, J, P, X);
        else bK(!1);
        return !0
    }

    function oz3(A, q, K, Y, z, w, H, $) {
        bK(w !== 0 || K[qW] === 0, "stream body cannot be pipelined");
        let O = !1,
            _ = new en6({
                abort: A,
                socket: z,
                request: Y,
                contentLength: w,
                client: K,
                expectsPayload: $,
                header: H
            }),
            J = function(M) {
                if (O) return;
                try {
                    if (!_.write(M) && this.pause) this.pause()
                } catch (P) {
                    b3.destroy(this, P)
                }
            },
            X = function() {
                if (O) return;
                if (q.resume) q.resume()
            },
            D = function() {
                if (queueMicrotask(() => {
                        q.removeListener("error", j)
                    }), !O) {
                    let M = new MS8;
                    queueMicrotask(() => j(M))
                }
            },
            j = function(M) {
                if (O) return;
                if (O = !0, bK(z.destroyed || z[An] && K[qW] <= 1), z.off("drain", X).off("error", j), q.removeListener("data", J).removeListener("end", j).removeListener("close", D), !M) try {
                    _.end()
                } catch (P) {
                    M = P
                }
                if (_.destroy(M), M && (M.code !== "UND_ERR_INFO" || M.message !== "reset")) b3.destroy(q, M);
                else b3.destroy(q)
            };
        if (q.on("data", J).on("end", j).on("error", j).on("close", D), q.resume) q.resume();
        if (z.on("drain", X).on("error", j), q.errorEmitted ?? q.errored) setImmediate(() => j(q.errored));
        else if (q.endEmitted ?? q.readableEnded) setImmediate(() => j(null));
        if (q.closeEmitted ?? q.closed) setImmediate(D)
    }

    function DS8(A, q, K, Y, z, w, H, $) {
        try {
            if (!q)
                if (w === 0) z.write(`${H}content-length: 0\r
\r
`, "latin1");
                else bK(w === null, "no body must not have content length"), z.write(`${H}\r
`, "latin1");
            else if (b3.isBuffer(q)) {
                if (bK(w === q.byteLength, "buffer body must have content length"), z.cork(), z.write(`${H}content-length: ${w}\r
\r
`, "latin1"), z.write(q), z.uncork(), Y.onBodySent(q), !$ && Y.reset !== !1) z[KV] = !0
            }
            Y.onRequestSent(), K[ei]()
        } catch (O) {
            A(O)
        }
    }
    async function az3(A, q, K, Y, z, w, H, $) {
        bK(w === q.size, "blob body must have content length");
        try {
            if (w != null && w !== q.size) throw new pA1;
            let O = Buffer.from(await q.arrayBuffer());
            if (z.cork(), z.write(`${H}content-length: ${w}\r
\r
`, "latin1"), z.write(O), z.uncork(), Y.onBodySent(O), Y.onRequestSent(), !$ && Y.reset !== !1) z[KV] = !0;
            K[ei]()
        } catch (O) {
            A(O)
        }
    }
    async function jS8(A, q, K, Y, z, w, H, $) {
        bK(w !== 0 || K[qW] === 0, "iterator body cannot be pipelined");
        let O = null;

        function _() {
            if (O) {
                let D = O;
                O = null, D()
            }
        }
        let J = () => new Promise((D, j) => {
            if (bK(O === null), z[Bk]) j(z[Bk]);
            else O = D
        });
        z.on("close", _).on("drain", _);
        let X = new en6({
            abort: A,
            socket: z,
            request: Y,
            contentLength: w,
            client: K,
            expectsPayload: $,
            header: H
        });
        try {
            for await (let D of q) {
                if (z[Bk]) throw z[Bk];
                if (!X.write(D)) await J()
            }
            X.end()
        } catch (D) {
            X.destroy(D)
        } finally {
            z.off("close", _).off("drain", _)
        }
    }
    class en6 {
        constructor({
            abort: A,
            socket: q,
            request: K,
            contentLength: Y,
            client: z,
            expectsPayload: w,
            header: H
        }) {
            this.socket = q, this.request = K, this.contentLength = Y, this.client = z, this.bytesWritten = 0, this.expectsPayload = w, this.header = H, this.abort = A, q[An] = !0
        }
        write(A) {
            let {
                socket: q,
                request: K,
                contentLength: Y,
                client: z,
                bytesWritten: w,
                expectsPayload: H,
                header: $
            } = this;
            if (q[Bk]) throw q[Bk];
            if (q.destroyed) return !1;
            let O = Buffer.byteLength(A);
            if (!O) return !0;
            if (Y !== null && w + O > Y) {
                if (z[an6]) throw new pA1;
                process.emitWarning(new pA1)
            }
            if (q.cork(), w === 0) {
                if (!H && K.reset !== !1) q[KV] = !0;
                if (Y === null) q.write(`${$}transfer-encoding: chunked\r
`, "latin1");
                else q.write(`${$}content-length: ${Y}\r
\r
`, "latin1")
            }
            if (Y === null) q.write(`\r
${O.toString(16)}\r
`, "latin1");
            this.bytesWritten += O;
            let _ = q.write(A);
            if (q.uncork(), K.onBodySent(A), !_) {
                if (q[f_].timeout && q[f_].timeoutType === y$1) {
                    if (q[f_].timeout.refresh) q[f_].timeout.refresh()
                }
            }
            return _
        }
        end() {
            let {
                socket: A,
                contentLength: q,
                client: K,
                bytesWritten: Y,
                expectsPayload: z,
                header: w,
                request: H
            } = this;
            if (H.onRequestSent(), A[An] = !1, A[Bk]) throw A[Bk];
            if (A.destroyed) return;
            if (Y === 0)
                if (z) A.write(`${w}content-length: 0\r
\r
`, "latin1");
                else A.write(`${w}\r
`, "latin1");
            else if (q === null) A.write(`\r
0\r
\r
`, "latin1");
            if (q !== null && Y !== q)
                if (K[an6]) throw new pA1;
                else process.emitWarning(new pA1);
            if (A[f_].timeout && A[f_].timeoutType === y$1) {
                if (A[f_].timeout.refresh) A[f_].timeout.refresh()
            }
            K[ei]()
        }
        destroy(A) {
            let {
                socket: q,
                client: K,
                abort: Y
            } = this;
            if (q[An] = !1, A) bK(K[qW] <= 1, "pipeline should only contain this request"), Y(A)
        }
    }
    ZS8.exports = lz3
})
// @from(Ln 84763, Col 4)
RS8 = R((t82, LS8) => {
    var mk = h1("node:assert"),
        {
            pipeline: sz3
        } = h1("node:stream"),
        o9 = W9(),
        {
            RequestContentLengthMismatchError: Ar6,
            RequestAbortedError: VS8,
            SocketError: Rk1,
            InformationalError: qr6
        } = Lz(),
        {
            kUrl: A66,
            kReset: K66,
            kClient: C$1,
            kRunning: Y66,
            kPending: tz3,
            kQueue: qn,
            kPendingIdx: Kr6,
            kRunningIdx: SC,
            kError: IC,
            kSocket: R0,
            kStrictContentLength: ez3,
            kOnError: Yr6,
            kMaxConcurrentStreams: kS8,
            kHTTP2Session: hC,
            kResume: Kn,
            kSize: A23,
            kHTTPContext: q23
        } = h$(),
        Dg = Symbol("open streams"),
        NS8, TS8 = !1,
        q66;
    try {
        q66 = h1("node:http2")
    } catch {
        q66 = {
            constants: {}
        }
    }
    var {
        constants: {
            HTTP2_HEADER_AUTHORITY: K23,
            HTTP2_HEADER_METHOD: Y23,
            HTTP2_HEADER_PATH: z23,
            HTTP2_HEADER_SCHEME: w23,
            HTTP2_HEADER_CONTENT_LENGTH: H23,
            HTTP2_HEADER_EXPECT: $23,
            HTTP2_HEADER_STATUS: O23
        }
    } = q66;

    function _23(A) {
        let q = [];
        for (let [K, Y] of Object.entries(A))
            if (Array.isArray(Y))
                for (let z of Y) q.push(Buffer.from(K), Buffer.from(z));
            else q.push(Buffer.from(K), Buffer.from(Y));
        return q
    }
    async function J23(A, q) {
        if (A[R0] = q, !TS8) TS8 = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
            code: "UNDICI-H2"
        });
        let K = q66.connect(A[A66], {
            createConnection: () => q,
            peerMaxConcurrentStreams: A[kS8]
        });
        K[Dg] = 0, K[C$1] = A, K[R0] = q, o9.addListener(K, "error", D23), o9.addListener(K, "frameError", j23), o9.addListener(K, "end", M23), o9.addListener(K, "goaway", P23), o9.addListener(K, "close", function() {
            let {
                [C$1]: z
            } = this, {
                [R0]: w
            } = z, H = this[R0][IC] || this[IC] || new Rk1("closed", o9.getSocketInfo(w));
            if (z[hC] = null, z.destroyed) {
                mk(z[tz3] === 0);
                let $ = z[qn].splice(z[SC]);
                for (let O = 0; O < $.length; O++) {
                    let _ = $[O];
                    o9.errorRequest(z, _, H)
                }
            }
        }), K.unref(), A[hC] = K, q[hC] = K, o9.addListener(q, "error", function(z) {
            mk(z.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[IC] = z, this[C$1][Yr6](z)
        }), o9.addListener(q, "end", function() {
            o9.destroy(this, new Rk1("other side closed", o9.getSocketInfo(this)))
        }), o9.addListener(q, "close", function() {
            let z = this[IC] || new Rk1("closed", o9.getSocketInfo(this));
            if (A[R0] = null, this[hC] != null) this[hC].destroy(z);
            A[Kr6] = A[SC], mk(A[Y66] === 0), A.emit("disconnect", A[A66], [A], z), A[Kn]()
        });
        let Y = !1;
        return q.on("close", () => {
            Y = !0
        }), {
            version: "h2",
            defaultPipelining: 1 / 0,
            write(...z) {
                return G23(A, ...z)
            },
            resume() {
                X23(A)
            },
            destroy(z, w) {
                if (Y) queueMicrotask(w);
                else q.destroy(z).on("close", w)
            },
            get destroyed() {
                return q.destroyed
            },
            busy() {
                return !1
            }
        }
    }

    function X23(A) {
        let q = A[R0];
        if (q?.destroyed === !1)
            if (A[A23] === 0 && A[kS8] === 0) q.unref(), A[hC].unref();
            else q.ref(), A[hC].ref()
    }

    function D23(A) {
        mk(A.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[R0][IC] = A, this[C$1][Yr6](A)
    }

    function j23(A, q, K) {
        if (K === 0) {
            let Y = new qr6(`HTTP/2: "frameError" received - type ${A}, code ${q}`);
            this[R0][IC] = Y, this[C$1][Yr6](Y)
        }
    }

    function M23() {
        let A = new Rk1("other side closed", o9.getSocketInfo(this[R0]));
        this.destroy(A), o9.destroy(this[R0], A)
    }

    function P23(A) {
        let q = this[IC] || new Rk1(`HTTP/2: "GOAWAY" frame received with code ${A}`, o9.getSocketInfo(this)),
            K = this[C$1];
        if (K[R0] = null, K[q23] = null, this[hC] != null) this[hC].destroy(q), this[hC] = null;
        if (o9.destroy(this[R0], q), K[SC] < K[qn].length) {
            let Y = K[qn][K[SC]];
            K[qn][K[SC]++] = null, o9.errorRequest(K, Y, q), K[Kr6] = K[SC]
        }
        mk(K[Y66] === 0), K.emit("disconnect", K[A66], [K], q), K[Kn]()
    }

    function W23(A) {
        return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
    }

    function G23(A, q) {
        let K = A[hC],
            {
                method: Y,
                path: z,
                host: w,
                upgrade: H,
                expectContinue: $,
                signal: O,
                headers: _
            } = q,
            {
                body: J
            } = q;
        if (H) return o9.errorRequest(A, q, Error("Upgrade not supported for H2")), !1;
        let X = {};
        for (let N = 0; N < _.length; N += 2) {
            let T = _[N + 0],
                k = _[N + 1];
            if (Array.isArray(k))
                for (let y = 0; y < k.length; y++)
                    if (X[T]) X[T] += `,${k[y]}`;
                    else X[T] = k[y];
            else X[T] = k
        }
        let D, {
            hostname: j,
            port: M
        } = A[A66];
        X[K23] = w || `${j}${M?`:${M}`:""}`, X[Y23] = Y;
        let P = (N) => {
            if (q.aborted || q.completed) return;
            if (N = N || new VS8, o9.errorRequest(A, q, N), D != null) o9.destroy(D, N);
            o9.destroy(J, N), A[qn][A[SC]++] = null, A[Kn]()
        };
        try {
            q.onConnect(P)
        } catch (N) {
            o9.errorRequest(A, q, N)
        }
        if (q.aborted) return !1;
        if (Y === "CONNECT") {
            if (K.ref(), D = K.request(X, {
                    endStream: !1,
                    signal: O
                }), D.id && !D.pending) q.onUpgrade(null, null, D), ++K[Dg], A[qn][A[SC]++] = null;
            else D.once("ready", () => {
                q.onUpgrade(null, null, D), ++K[Dg], A[qn][A[SC]++] = null
            });
            return D.once("close", () => {
                if (K[Dg] -= 1, K[Dg] === 0) K.unref()
            }), !0
        }
        X[z23] = z, X[w23] = "https";
        let W = Y === "PUT" || Y === "POST" || Y === "PATCH";
        if (J && typeof J.read === "function") J.read(0);
        let G = o9.bodyLength(J);
        if (o9.isFormDataLike(J)) {
            NS8 ??= k$1().extractBody;
            let [N, T] = NS8(J);
            X["content-type"] = T, J = N.stream, G = N.length
        }
        if (G == null) G = q.contentLength;
        if (G === 0 || !W) G = null;
        if (W23(Y) && G > 0 && q.contentLength != null && q.contentLength !== G) {
            if (A[ez3]) return o9.errorRequest(A, q, new Ar6), !1;
            process.emitWarning(new Ar6)
        }
        if (G != null) mk(J, "no body must not have content length"), X[H23] = `${G}`;
        K.ref();
        let f = Y === "GET" || Y === "HEAD" || J === null;
        if ($) X[$23] = "100-continue", D = K.request(X, {
            endStream: f,
            signal: O
        }), D.once("continue", Z);
        else D = K.request(X, {
            endStream: f,
            signal: O
        }), Z();
        return ++K[Dg], D.once("response", (N) => {
            let {
                [O23]: T, ...k
            } = N;
            if (q.onResponseStarted(), q.aborted) {
                let y = new VS8;
                o9.errorRequest(A, q, y), o9.destroy(D, y);
                return
            }
            if (q.onHeaders(Number(T), _23(k), D.resume.bind(D), "") === !1) D.pause();
            D.on("data", (y) => {
                if (q.onData(y) === !1) D.pause()
            })
        }), D.once("end", () => {
            if (D.state?.state == null || D.state.state < 6) q.onComplete([]);
            if (K[Dg] === 0) K.unref();
            P(new qr6("HTTP/2: stream half-closed (remote)")), A[qn][A[SC]++] = null, A[Kr6] = A[SC], A[Kn]()
        }), D.once("close", () => {
            if (K[Dg] -= 1, K[Dg] === 0) K.unref()
        }), D.once("error", function(N) {
            P(N)
        }), D.once("frameError", (N, T) => {
            P(new qr6(`HTTP/2: "frameError" received - type ${N}, code ${T}`))
        }), !0;

        function Z() {
            if (!J || G === 0) vS8(P, D, null, A, q, A[R0], G, W);
            else if (o9.isBuffer(J)) vS8(P, D, J, A, q, A[R0], G, W);
            else if (o9.isBlobLike(J))
                if (typeof J.stream === "function") ES8(P, D, J.stream(), A, q, A[R0], G, W);
                else f23(P, D, J, A, q, A[R0], G, W);
            else if (o9.isStream(J)) Z23(P, A[R0], W, D, J, A, q, G);
            else if (o9.isIterable(J)) ES8(P, D, J, A, q, A[R0], G, W);
            else mk(!1)
        }
    }

    function vS8(A, q, K, Y, z, w, H, $) {
        try {
            if (K != null && o9.isBuffer(K)) mk(H === K.byteLength, "buffer body must have content length"), q.cork(), q.write(K), q.uncork(), q.end(), z.onBodySent(K);
            if (!$) w[K66] = !0;
            z.onRequestSent(), Y[Kn]()
        } catch (O) {
            A(O)
        }
    }

    function Z23(A, q, K, Y, z, w, H, $) {
        mk($ !== 0 || w[Y66] === 0, "stream body cannot be pipelined");
        let O = sz3(z, Y, (J) => {
            if (J) o9.destroy(O, J), A(J);
            else {
                if (o9.removeAllListeners(O), H.onRequestSent(), !K) q[K66] = !0;
                w[Kn]()
            }
        });
        o9.addListener(O, "data", _);

        function _(J) {
            H.onBodySent(J)
        }
    }
    async function f23(A, q, K, Y, z, w, H, $) {
        mk(H === K.size, "blob body must have content length");
        try {
            if (H != null && H !== K.size) throw new Ar6;
            let O = Buffer.from(await K.arrayBuffer());
            if (q.cork(), q.write(O), q.uncork(), q.end(), z.onBodySent(O), z.onRequestSent(), !$) w[K66] = !0;
            Y[Kn]()
        } catch (O) {
            A(O)
        }
    }
    async function ES8(A, q, K, Y, z, w, H, $) {
        mk(H !== 0 || Y[Y66] === 0, "iterator body cannot be pipelined");
        let O = null;

        function _() {
            if (O) {
                let X = O;
                O = null, X()
            }
        }
        let J = () => new Promise((X, D) => {
            if (mk(O === null), w[IC]) D(w[IC]);
            else O = X
        });
        q.on("close", _).on("drain", _);
        try {
            for await (let X of K) {
                if (w[IC]) throw w[IC];
                let D = q.write(X);
                if (z.onBodySent(X), !D) await J()
            }
            if (q.end(), z.onRequestSent(), !$) w[K66] = !0;
            Y[Kn]()
        } catch (X) {
            A(X)
        } finally {
            q.off("close", _).off("drain", _)
        }
    }
    LS8.exports = J23
})
// @from(Ln 85101, Col 4)
z66 = R((e82, hS8) => {
    var yb = W9(),
        {
            kBodyUsed: yk1
        } = h$(),
        wr6 = h1("node:assert"),
        {
            InvalidArgumentError: V23
        } = Lz(),
        N23 = h1("node:events"),
        T23 = [300, 301, 302, 303, 307, 308],
        yS8 = Symbol("body");
    class zr6 {
        constructor(A) {
            this[yS8] = A, this[yk1] = !1
        }
        async * [Symbol.asyncIterator]() {
            wr6(!this[yk1], "disturbed"), this[yk1] = !0, yield* this[yS8]
        }
    }
    class SS8 {
        constructor(A, q, K, Y) {
            if (q != null && (!Number.isInteger(q) || q < 0)) throw new V23("maxRedirections must be a positive number");
            if (yb.validateHandler(Y, K.method, K.upgrade), this.dispatch = A, this.location = null, this.abort = null, this.opts = {
                    ...K,
                    maxRedirections: 0
                }, this.maxRedirections = q, this.handler = Y, this.history = [], this.redirectionLimitReached = !1, yb.isStream(this.opts.body)) {
                if (yb.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function() {
                    wr6(!1)
                });
                if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[yk1] = !1, N23.prototype.on.call(this.opts.body, "data", function() {
                    this[yk1] = !0
                })
            } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new zr6(this.opts.body);
            else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && yb.isIterable(this.opts.body)) this.opts.body = new zr6(this.opts.body)
        }
        onConnect(A) {
            this.abort = A, this.handler.onConnect(A, {
                history: this.history
            })
        }
        onUpgrade(A, q, K) {
            this.handler.onUpgrade(A, q, K)
        }
        onError(A) {
            this.handler.onError(A)
        }
        onHeaders(A, q, K, Y) {
            if (this.location = this.history.length >= this.maxRedirections || yb.isDisturbed(this.opts.body) ? null : v23(A, q), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
                if (this.request) this.request.abort(Error("max redirects"));
                this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
                return
            }
            if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
            if (!this.location) return this.handler.onHeaders(A, q, K, Y);
            let {
                origin: z,
                pathname: w,
                search: H
            } = yb.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), $ = H ? `${w}${H}` : w;
            if (this.opts.headers = E23(this.opts.headers, A === 303, this.opts.origin !== z), this.opts.path = $, this.opts.origin = z, this.opts.maxRedirections = 0, this.opts.query = null, A === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
        }
        onData(A) {
            if (this.location);
            else return this.handler.onData(A)
        }
        onComplete(A) {
            if (this.location) this.location = null, this.abort = null, this.dispatch(this.opts, this);
            else this.handler.onComplete(A)
        }
        onBodySent(A) {
            if (this.handler.onBodySent) this.handler.onBodySent(A)
        }
    }

    function v23(A, q) {
        if (T23.indexOf(A) === -1) return null;
        for (let K = 0; K < q.length; K += 2)
            if (q[K].length === 8 && yb.headerNameToString(q[K]) === "location") return q[K + 1]
    }

    function CS8(A, q, K) {
        if (A.length === 4) return yb.headerNameToString(A) === "host";
        if (q && yb.headerNameToString(A).startsWith("content-")) return !0;
        if (K && (A.length === 13 || A.length === 6 || A.length === 19)) {
            let Y = yb.headerNameToString(A);
            return Y === "authorization" || Y === "cookie" || Y === "proxy-authorization"
        }
        return !1
    }

    function E23(A, q, K) {
        let Y = [];
        if (Array.isArray(A)) {
            for (let z = 0; z < A.length; z += 2)
                if (!CS8(A[z], q, K)) Y.push(A[z], A[z + 1])
        } else if (A && typeof A === "object") {
            for (let z of Object.keys(A))
                if (!CS8(z, q, K)) Y.push(z, A[z])
        } else wr6(A == null, "headers must be an object or an array");
        return Y
    }
    hS8.exports = SS8
})
// @from(Ln 85205, Col 4)
w66 = R((A72, IS8) => {
    var k23 = z66();

    function L23({
        maxRedirections: A
    }) {
        return (q) => {
            return function(Y, z) {
                let {
                    maxRedirections: w = A
                } = Y;
                if (!w) return q(Y, z);
                let H = new k23(q, w, Y, z);
                return Y = {
                    ...Y,
                    maxRedirections: 0
                }, q(Y, H)
            }
        }
    }
    IS8.exports = L23
})