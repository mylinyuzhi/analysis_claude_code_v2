
// @from(Ln 52069, Col 4)
SV = x((hw_, mhA) => {
    var {
        Transform: VhK
    } = x6("node:stream"), ThA = x6("node:zlib"), {
        redirectStatusSet: khK,
        referrerPolicySet: EhK,
        badPortsSet: yhK
    } = CR6(), {
        getGlobalOrigin: vhA
    } = hr1(), {
        collectASequenceOfCodePoints: R76,
        collectAnHTTPQuotedString: LhK,
        removeChars: RhK,
        parseMIMEType: hhK
    } = hT(), {
        performance: ShK
    } = x6("node:perf_hooks"), {
        isBlobLike: ChK,
        ReadableStreamFrom: IhK,
        isValidHTTPToken: NhA,
        normalizedMethodRecordsBase: bhK
    } = Y9(), h76 = x6("node:assert"), {
        isUint8Array: xhK
    } = x6("node:util/types"), {
        webidl: bR6
    } = vP(), VhA = [], X71;
    try {
        X71 = x6("node:crypto");
        let A = ["sha256", "sha384", "sha512"];
        VhA = X71.getHashes().filter((q) => A.includes(q))
    } catch {}

    function khA(A) {
        let q = A.urlList,
            K = q.length;
        return K === 0 ? null : q[K - 1].toString()
    }

    function uhK(A, q) {
        if (!khK.has(A.status)) return null;
        let K = A.headersList.get("location", !0);
        if (K !== null && yhA(K)) {
            if (!EhA(K)) K = mhK(K);
            K = new URL(K, khA(A))
        }
        if (K && !K.hash) K.hash = q;
        return K
    }

    function EhA(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K > 126 || K < 32) return !1
        }
        return !0
    }

    function mhK(A) {
        return Buffer.from(A, "binary").toString("utf8")
    }

    function uR6(A) {
        return A.urlList[A.urlList.length - 1]
    }

    function BhK(A) {
        let q = uR6(A);
        if (ChA(q) && yhK.has(q.port)) return "blocked";
        return "allowed"
    }

    function ghK(A) {
        return A instanceof Error || (A?.constructor?.name === "Error" || A?.constructor?.name === "DOMException")
    }

    function FhK(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (!(K === 9 || K >= 32 && K <= 126 || K >= 128 && K <= 255)) return !1
        }
        return !0
    }
    var phK = NhA;

    function yhA(A) {
        return (A[0] === "\t" || A[0] === " " || A[A.length - 1] === "\t" || A[A.length - 1] === " " || A.includes(`
`) || A.includes("\r") || A.includes("\x00")) === !1
    }

    function QhK(A, q) {
        let {
            headersList: K
        } = q, Y = (K.get("referrer-policy", !0) ?? "").split(","), z = "";
        if (Y.length > 0)
            for (let _ = Y.length; _ !== 0; _--) {
                let w = Y[_ - 1].trim();
                if (EhK.has(w)) {
                    z = w;
                    break
                }
            }
        if (z !== "") A.referrerPolicy = z
    }

    function UhK() {
        return "allowed"
    }

    function dhK() {
        return "success"
    }

    function chK() {
        return "success"
    }

    function lhK(A) {
        let q = null;
        q = A.mode, A.headersList.set("sec-fetch-mode", q, !0)
    }

    function ihK(A) {
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
                    if (A.origin && br1(A.origin) && !br1(uR6(A))) q = null;
                    break;
                case "same-origin":
                    if (!P71(A, uR6(A))) q = null;
                    break;
                default:
            }
            A.headersList.append("origin", q, !0)
        }
    }

    function GH6(A, q) {
        return A
    }

    function nhK(A, q, K) {
        if (!A?.startTime || A.startTime < q) return {
            domainLookupStartTime: q,
            domainLookupEndTime: q,
            connectionStartTime: q,
            connectionEndTime: q,
            secureConnectionStartTime: q,
            ALPNNegotiatedProtocol: A?.ALPNNegotiatedProtocol
        };
        return {
            domainLookupStartTime: GH6(A.domainLookupStartTime, K),
            domainLookupEndTime: GH6(A.domainLookupEndTime, K),
            connectionStartTime: GH6(A.connectionStartTime, K),
            connectionEndTime: GH6(A.connectionEndTime, K),
            secureConnectionStartTime: GH6(A.secureConnectionStartTime, K),
            ALPNNegotiatedProtocol: A.ALPNNegotiatedProtocol
        }
    }

    function rhK(A) {
        return GH6(ShK.now(), A)
    }

    function ohK(A) {
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

    function LhA() {
        return {
            referrerPolicy: "strict-origin-when-cross-origin"
        }
    }

    function ahK(A) {
        return {
            referrerPolicy: A.referrerPolicy
        }
    }

    function shK(A) {
        let q = A.referrerPolicy;
        h76(q);
        let K = null;
        if (A.referrer === "client") {
            let O = vhA();
            if (!O || O.origin === "null") return "no-referrer";
            K = new URL(O)
        } else if (A.referrer instanceof URL) K = A.referrer;
        let Y = Ir1(K),
            z = Ir1(K, !0);
        if (Y.toString().length > 4096) Y = z;
        let _ = P71(A, Y),
            w = xR6(Y) && !xR6(A.url);
        switch (q) {
            case "origin":
                return z != null ? z : Ir1(K, !0);
            case "unsafe-url":
                return Y;
            case "same-origin":
                return _ ? z : "no-referrer";
            case "origin-when-cross-origin":
                return _ ? Y : z;
            case "strict-origin-when-cross-origin": {
                let O = uR6(A);
                if (P71(Y, O)) return Y;
                if (xR6(Y) && !xR6(O)) return "no-referrer";
                return z
            }
            case "strict-origin":
            case "no-referrer-when-downgrade":
            default:
                return w ? "no-referrer" : z
        }
    }

    function Ir1(A, q) {
        if (h76(A instanceof URL), A = new URL(A), A.protocol === "file:" || A.protocol === "about:" || A.protocol === "blank:") return "no-referrer";
        if (A.username = "", A.password = "", A.hash = "", q) A.pathname = "", A.search = "";
        return A
    }

    function xR6(A) {
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

    function thK(A, q) {
        if (X71 === void 0) return !0;
        let K = RhA(q);
        if (K === "no metadata") return !0;
        if (K.length === 0) return !0;
        let Y = ASK(K),
            z = qSK(K, Y);
        for (let _ of z) {
            let {
                algo: w,
                hash: O
            } = _, $ = X71.createHash(w).update(A).digest("base64");
            if ($[$.length - 1] === "=")
                if ($[$.length - 2] === "=") $ = $.slice(0, -2);
                else $ = $.slice(0, -1);
            if (KSK($, O)) return !0
        }
        return !1
    }
    var ehK = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

    function RhA(A) {
        let q = [],
            K = !0;
        for (let Y of A.split(" ")) {
            K = !1;
            let z = ehK.exec(Y);
            if (z === null || z.groups === void 0 || z.groups.algo === void 0) continue;
            let _ = z.groups.algo.toLowerCase();
            if (VhA.includes(_)) q.push(z.groups)
        }
        if (K === !0) return "no metadata";
        return q
    }

    function ASK(A) {
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

    function qSK(A, q) {
        if (A.length === 1) return A;
        let K = 0;
        for (let Y = 0; Y < A.length; ++Y)
            if (A[Y].algo === q) A[K++] = A[Y];
        return A.length = K, A
    }

    function KSK(A, q) {
        if (A.length !== q.length) return !1;
        for (let K = 0; K < A.length; ++K)
            if (A[K] !== q[K]) {
                if (A[K] === "+" && q[K] === "-" || A[K] === "/" && q[K] === "_") continue;
                return !1
            } return !0
    }

    function YSK(A) {}

    function P71(A, q) {
        if (A.origin === q.origin && A.origin === "null") return !0;
        if (A.protocol === q.protocol && A.hostname === q.hostname && A.port === q.port) return !0;
        return !1
    }

    function zSK() {
        let A, q;
        return {
            promise: new Promise((Y, z) => {
                A = Y, q = z
            }),
            resolve: A,
            reject: q
        }
    }

    function _SK(A) {
        return A.controller.state === "aborted"
    }

    function wSK(A) {
        return A.controller.state === "aborted" || A.controller.state === "terminated"
    }

    function OSK(A) {
        return bhK[A.toLowerCase()] ?? A
    }

    function $SK(A) {
        let q = JSON.stringify(A);
        if (q === void 0) throw TypeError("Value is not JSON serializable");
        return h76(typeof q === "string"), q
    }
    var HSK = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

    function hhA(A, q, K = 0, Y = 1) {
        class z {
            #A;
            #q;
            #K;
            constructor(_, w) {
                this.#A = _, this.#q = w, this.#K = 0
            }
            next() {
                if (typeof this !== "object" || this === null || !(#A in this)) throw TypeError(`'next' called on an object that does not implement interface ${A} Iterator.`);
                let _ = this.#K,
                    w = this.#A[q],
                    O = w.length;
                if (_ >= O) return {
                    value: void 0,
                    done: !0
                };
                let {
                    [K]: $, [Y]: H
                } = w[_];
                this.#K = _ + 1;
                let j;
                switch (this.#q) {
                    case "key":
                        j = $;
                        break;
                    case "value":
                        j = H;
                        break;
                    case "key+value":
                        j = [$, H];
                        break
                }
                return {
                    value: j,
                    done: !1
                }
            }
        }
        return delete z.prototype.constructor, Object.setPrototypeOf(z.prototype, HSK), Object.defineProperties(z.prototype, {
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
            function(_, w) {
                return new z(_, w)
            }
    }

    function jSK(A, q, K, Y = 0, z = 1) {
        let _ = hhA(A, K, Y, z),
            w = {
                keys: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return bR6.brandCheck(this, q), _(this, "key")
                    }
                },
                values: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return bR6.brandCheck(this, q), _(this, "value")
                    }
                },
                entries: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return bR6.brandCheck(this, q), _(this, "key+value")
                    }
                },
                forEach: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function($, H = globalThis) {
                        if (bR6.brandCheck(this, q), bR6.argumentLengthCheck(arguments, 1, `${A}.forEach`), typeof $ !== "function") throw TypeError(`Failed to execute 'forEach' on '${A}': parameter 1 is not of type 'Function'.`);
                        for (let {
                                0: j,
                                1: J
                            }
                            of _(this, "key+value")) $.call(H, J, j, this)
                    }
                }
            };
        return Object.defineProperties(q.prototype, {
            ...w,
            [Symbol.iterator]: {
                writable: !0,
                enumerable: !1,
                configurable: !0,
                value: w.entries.value
            }
        })
    }
    async function JSK(A, q, K) {
        let Y = q,
            z = K,
            _;
        try {
            _ = A.stream.getReader()
        } catch (w) {
            z(w);
            return
        }
        try {
            Y(await ShA(_))
        } catch (w) {
            z(w)
        }
    }

    function MSK(A) {
        return A instanceof ReadableStream || A[Symbol.toStringTag] === "ReadableStream" && typeof A.tee === "function"
    }

    function DSK(A) {
        try {
            A.close(), A.byobRequest?.respond(0)
        } catch (q) {
            if (!q.message.includes("Controller is already closed") && !q.message.includes("ReadableStream is already closed")) throw q
        }
    }
    var XSK = /[^\x00-\xFF]/;

    function D71(A) {
        return h76(!XSK.test(A)), A
    }
    async function ShA(A) {
        let q = [],
            K = 0;
        while (!0) {
            let {
                done: Y,
                value: z
            } = await A.read();
            if (Y) return Buffer.concat(q, K);
            if (!xhK(z)) throw TypeError("Received non-Uint8Array chunk");
            q.push(z), K += z.length
        }
    }

    function PSK(A) {
        h76("protocol" in A);
        let q = A.protocol;
        return q === "about:" || q === "blob:" || q === "data:"
    }

    function br1(A) {
        return typeof A === "string" && A[5] === ":" && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && A[4] === "s" || A.protocol === "https:"
    }

    function ChA(A) {
        h76("protocol" in A);
        let q = A.protocol;
        return q === "http:" || q === "https:"
    }

    function WSK(A, q) {
        let K = A;
        if (!K.startsWith("bytes")) return "failure";
        let Y = {
            position: 5
        };
        if (q) R76(($) => $ === "\t" || $ === " ", K, Y);
        if (K.charCodeAt(Y.position) !== 61) return "failure";
        if (Y.position++, q) R76(($) => $ === "\t" || $ === " ", K, Y);
        let z = R76(($) => {
                let H = $.charCodeAt(0);
                return H >= 48 && H <= 57
            }, K, Y),
            _ = z.length ? Number(z) : null;
        if (q) R76(($) => $ === "\t" || $ === " ", K, Y);
        if (K.charCodeAt(Y.position) !== 45) return "failure";
        if (Y.position++, q) R76(($) => $ === "\t" || $ === " ", K, Y);
        let w = R76(($) => {
                let H = $.charCodeAt(0);
                return H >= 48 && H <= 57
            }, K, Y),
            O = w.length ? Number(w) : null;
        if (Y.position < K.length) return "failure";
        if (O === null && _ === null) return "failure";
        if (_ > O) return "failure";
        return {
            rangeStartValue: _,
            rangeEndValue: O
        }
    }

    function ZSK(A, q, K) {
        let Y = "bytes ";
        return Y += D71(`${A}`), Y += "-", Y += D71(`${q}`), Y += "/", Y += D71(`${K}`), Y
    }
    class IhA extends VhK {
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
                this._inflateStream = (A[0] & 15) === 8 ? ThA.createInflate(this.#A) : ThA.createInflateRaw(this.#A), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (Y) => this.destroy(Y))
            }
            this._inflateStream.write(A, q, K)
        }
        _final(A) {
            if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
            A()
        }
    }

    function GSK(A) {
        return new IhA(A)
    }

    function fSK(A) {
        let q = null,
            K = null,
            Y = null,
            z = bhA("content-type", A);
        if (z === null) return "failure";
        for (let _ of z) {
            let w = hhK(_);
            if (w === "failure" || w.essence === "*/*") continue;
            if (Y = w, Y.essence !== K) {
                if (q = null, Y.parameters.has("charset")) q = Y.parameters.get("charset");
                K = Y.essence
            } else if (!Y.parameters.has("charset") && q !== null) Y.parameters.set("charset", q)
        }
        if (Y == null) return "failure";
        return Y
    }

    function TSK(A) {
        let q = A,
            K = {
                position: 0
            },
            Y = [],
            z = "";
        while (K.position < q.length) {
            if (z += R76((_) => _ !== '"' && _ !== ",", q, K), K.position < q.length)
                if (q.charCodeAt(K.position) === 34) {
                    if (z += LhK(q, K), K.position < q.length) continue
                } else h76(q.charCodeAt(K.position) === 44), K.position++;
            z = RhK(z, !0, !0, (_) => _ === 9 || _ === 32), Y.push(z), z = ""
        }
        return Y
    }

    function bhA(A, q) {
        let K = q.get(A, !0);
        if (K === null) return null;
        return TSK(K)
    }
    var vSK = new TextDecoder;

    function NSK(A) {
        if (A.length === 0) return "";
        if (A[0] === 239 && A[1] === 187 && A[2] === 191) A = A.subarray(3);
        return vSK.decode(A)
    }
    class xhA {
        get baseUrl() {
            return vhA()
        }
        get origin() {
            return this.baseUrl?.origin
        }
        policyContainer = LhA()
    }
    class uhA {
        settingsObject = new xhA
    }
    var VSK = new uhA;
    mhA.exports = {
        isAborted: _SK,
        isCancelled: wSK,
        isValidEncodedURL: EhA,
        createDeferredPromise: zSK,
        ReadableStreamFrom: IhK,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: YSK,
        clampAndCoarsenConnectionTimingInfo: nhK,
        coarsenedSharedCurrentTime: rhK,
        determineRequestsReferrer: shK,
        makePolicyContainer: LhA,
        clonePolicyContainer: ahK,
        appendFetchMetadata: lhK,
        appendRequestOriginHeader: ihK,
        TAOCheck: chK,
        corsCheck: dhK,
        crossOriginResourcePolicyCheck: UhK,
        createOpaqueTimingInfo: ohK,
        setRequestReferrerPolicyOnRedirect: QhK,
        isValidHTTPToken: NhA,
        requestBadPort: BhK,
        requestCurrentURL: uR6,
        responseURL: khA,
        responseLocationURL: uhK,
        isBlobLike: ChK,
        isURLPotentiallyTrustworthy: xR6,
        isValidReasonPhrase: FhK,
        sameOrigin: P71,
        normalizeMethod: OSK,
        serializeJavascriptValueToJSONString: $SK,
        iteratorMixin: jSK,
        createIterator: hhA,
        isValidHeaderName: phK,
        isValidHeaderValue: yhA,
        isErrorLike: ghK,
        fullyReadBody: JSK,
        bytesMatch: thK,
        isReadableStreamLike: MSK,
        readableStreamClose: DSK,
        isomorphicEncode: D71,
        urlIsLocal: PSK,
        urlHasHttpsScheme: br1,
        urlIsHttpHttpsScheme: ChA,
        readAllBytes: ShA,
        simpleRangeHeaderValue: WSK,
        buildContentRange: ZSK,
        parseMetadata: RhA,
        createInflate: GSK,
        extractMimeType: fSK,
        getDecodeSplit: bhA,
        utf8DecodeBytes: NSK,
        environmentSettingsObject: VSK
    }
})
// @from(Ln 52776, Col 4)
Nr = x((Sw_, BhA) => {
    BhA.exports = {
        kUrl: Symbol("url"),
        kHeaders: Symbol("headers"),
        kSignal: Symbol("signal"),
        kState: Symbol("state"),
        kDispatcher: Symbol("dispatcher")
    }
})
// @from(Ln 52785, Col 4)
xr1 = x((Cw_, ghA) => {
    var {
        Blob: kSK,
        File: ESK
    } = x6("node:buffer"), {
        kState: KQ
    } = Nr(), {
        webidl: Au
    } = vP();
    class qu {
        constructor(A, q, K = {}) {
            let Y = q,
                z = K.type,
                _ = K.lastModified ?? Date.now();
            this[KQ] = {
                blobLike: A,
                name: Y,
                type: z,
                lastModified: _
            }
        }
        stream(...A) {
            return Au.brandCheck(this, qu), this[KQ].blobLike.stream(...A)
        }
        arrayBuffer(...A) {
            return Au.brandCheck(this, qu), this[KQ].blobLike.arrayBuffer(...A)
        }
        slice(...A) {
            return Au.brandCheck(this, qu), this[KQ].blobLike.slice(...A)
        }
        text(...A) {
            return Au.brandCheck(this, qu), this[KQ].blobLike.text(...A)
        }
        get size() {
            return Au.brandCheck(this, qu), this[KQ].blobLike.size
        }
        get type() {
            return Au.brandCheck(this, qu), this[KQ].blobLike.type
        }
        get name() {
            return Au.brandCheck(this, qu), this[KQ].name
        }
        get lastModified() {
            return Au.brandCheck(this, qu), this[KQ].lastModified
        }
        get[Symbol.toStringTag]() {
            return "File"
        }
    }
    Au.converters.Blob = Au.interfaceConverter(kSK);

    function ySK(A) {
        return A instanceof ESK || A && (typeof A.stream === "function" || typeof A.arrayBuffer === "function") && A[Symbol.toStringTag] === "File"
    }
    ghA.exports = {
        FileLike: qu,
        isFileLike: ySK
    }
})
// @from(Ln 52844, Col 4)
mR6 = x((Iw_, dhA) => {
    var {
        isBlobLike: W71,
        iteratorMixin: LSK
    } = SV(), {
        kState: PG
    } = Nr(), {
        kEnumerableProperty: fH6
    } = Y9(), {
        FileLike: FhA,
        isFileLike: RSK
    } = xr1(), {
        webidl: vw
    } = vP(), {
        File: UhA
    } = x6("node:buffer"), phA = x6("node:util"), QhA = globalThis.File ?? UhA;
    class Ku {
        constructor(A) {
            if (vw.util.markAsUncloneable(this), A !== void 0) throw vw.errors.conversionFailed({
                prefix: "FormData constructor",
                argument: "Argument 1",
                types: ["undefined"]
            });
            this[PG] = []
        }
        append(A, q, K = void 0) {
            vw.brandCheck(this, Ku);
            let Y = "FormData.append";
            if (vw.argumentLengthCheck(arguments, 2, Y), arguments.length === 3 && !W71(q)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
            A = vw.converters.USVString(A, Y, "name"), q = W71(q) ? vw.converters.Blob(q, Y, "value", {
                strict: !1
            }) : vw.converters.USVString(q, Y, "value"), K = arguments.length === 3 ? vw.converters.USVString(K, Y, "filename") : void 0;
            let z = ur1(A, q, K);
            this[PG].push(z)
        }
        delete(A) {
            vw.brandCheck(this, Ku);
            let q = "FormData.delete";
            vw.argumentLengthCheck(arguments, 1, q), A = vw.converters.USVString(A, q, "name"), this[PG] = this[PG].filter((K) => K.name !== A)
        }
        get(A) {
            vw.brandCheck(this, Ku);
            let q = "FormData.get";
            vw.argumentLengthCheck(arguments, 1, q), A = vw.converters.USVString(A, q, "name");
            let K = this[PG].findIndex((Y) => Y.name === A);
            if (K === -1) return null;
            return this[PG][K].value
        }
        getAll(A) {
            vw.brandCheck(this, Ku);
            let q = "FormData.getAll";
            return vw.argumentLengthCheck(arguments, 1, q), A = vw.converters.USVString(A, q, "name"), this[PG].filter((K) => K.name === A).map((K) => K.value)
        }
        has(A) {
            vw.brandCheck(this, Ku);
            let q = "FormData.has";
            return vw.argumentLengthCheck(arguments, 1, q), A = vw.converters.USVString(A, q, "name"), this[PG].findIndex((K) => K.name === A) !== -1
        }
        set(A, q, K = void 0) {
            vw.brandCheck(this, Ku);
            let Y = "FormData.set";
            if (vw.argumentLengthCheck(arguments, 2, Y), arguments.length === 3 && !W71(q)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
            A = vw.converters.USVString(A, Y, "name"), q = W71(q) ? vw.converters.Blob(q, Y, "name", {
                strict: !1
            }) : vw.converters.USVString(q, Y, "name"), K = arguments.length === 3 ? vw.converters.USVString(K, Y, "name") : void 0;
            let z = ur1(A, q, K),
                _ = this[PG].findIndex((w) => w.name === A);
            if (_ !== -1) this[PG] = [...this[PG].slice(0, _), z, ...this[PG].slice(_ + 1).filter((w) => w.name !== A)];
            else this[PG].push(z)
        } [phA.inspect.custom](A, q) {
            let K = this[PG].reduce((z, _) => {
                if (z[_.name])
                    if (Array.isArray(z[_.name])) z[_.name].push(_.value);
                    else z[_.name] = [z[_.name], _.value];
                else z[_.name] = _.value;
                return z
            }, {
                __proto__: null
            });
            q.depth ??= A, q.colors ??= !0;
            let Y = phA.formatWithOptions(q, K);
            return `FormData ${Y.slice(Y.indexOf("]")+2)}`
        }
    }
    LSK("FormData", Ku, PG, "name", "value");
    Object.defineProperties(Ku.prototype, {
        append: fH6,
        delete: fH6,
        get: fH6,
        getAll: fH6,
        has: fH6,
        set: fH6,
        [Symbol.toStringTag]: {
            value: "FormData",
            configurable: !0
        }
    });

    function ur1(A, q, K) {
        if (typeof q === "string");
        else {
            if (!RSK(q)) q = q instanceof Blob ? new QhA([q], "blob", {
                type: q.type
            }) : new FhA(q, "blob", {
                type: q.type
            });
            if (K !== void 0) {
                let Y = {
                    type: q.type,
                    lastModified: q.lastModified
                };
                q = q instanceof UhA ? new QhA([q], K, Y) : new FhA(q, K, Y)
            }
        }
        return {
            name: A,
            value: q
        }
    }
    dhA.exports = {
        FormData: Ku,
        makeEntry: ur1
    }
})
// @from(Ln 52968, Col 4)
ohA = x((bw_, rhA) => {
    var {
        isUSVString: chA,
        bufferToLowerCasedHeaderName: hSK
    } = Y9(), {
        utf8DecodeBytes: SSK
    } = SV(), {
        HTTP_TOKEN_CODEPOINTS: CSK,
        isomorphicDecode: lhA
    } = hT(), {
        isFileLike: ISK
    } = xr1(), {
        makeEntry: bSK
    } = mR6(), Z71 = x6("node:assert"), {
        File: xSK
    } = x6("node:buffer"), uSK = globalThis.File ?? xSK, mSK = Buffer.from('form-data; name="'), ihA = Buffer.from("; filename"), BSK = Buffer.from("--"), gSK = Buffer.from(`--\r
`);

    function FSK(A) {
        for (let q = 0; q < A.length; ++q)
            if ((A.charCodeAt(q) & -128) !== 0) return !1;
        return !0
    }

    function pSK(A) {
        let q = A.length;
        if (q < 27 || q > 70) return !1;
        for (let K = 0; K < q; ++K) {
            let Y = A.charCodeAt(K);
            if (!(Y >= 48 && Y <= 57 || Y >= 65 && Y <= 90 || Y >= 97 && Y <= 122 || Y === 39 || Y === 45 || Y === 95)) return !1
        }
        return !0
    }

    function QSK(A, q) {
        Z71(q !== "failure" && q.essence === "multipart/form-data");
        let K = q.parameters.get("boundary");
        if (K === void 0) return "failure";
        let Y = Buffer.from(`--${K}`, "utf8"),
            z = [],
            _ = {
                position: 0
            };
        while (A[_.position] === 13 && A[_.position + 1] === 10) _.position += 2;
        let w = A.length;
        while (A[w - 1] === 10 && A[w - 2] === 13) w -= 2;
        if (w !== A.length) A = A.subarray(0, w);
        while (!0) {
            if (A.subarray(_.position, _.position + Y.length).equals(Y)) _.position += Y.length;
            else return "failure";
            if (_.position === A.length - 2 && G71(A, BSK, _) || _.position === A.length - 4 && G71(A, gSK, _)) return z;
            if (A[_.position] !== 13 || A[_.position + 1] !== 10) return "failure";
            _.position += 2;
            let O = USK(A, _);
            if (O === "failure") return "failure";
            let {
                name: $,
                filename: H,
                contentType: j,
                encoding: J
            } = O;
            _.position += 2;
            let M;
            {
                let X = A.indexOf(Y.subarray(2), _.position);
                if (X === -1) return "failure";
                if (M = A.subarray(_.position, X - 4), _.position += M.length, J === "base64") M = Buffer.from(M.toString(), "base64")
            }
            if (A[_.position] !== 13 || A[_.position + 1] !== 10) return "failure";
            else _.position += 2;
            let D;
            if (H !== null) {
                if (j ??= "text/plain", !FSK(j)) j = "";
                D = new uSK([M], H, {
                    type: j
                })
            } else D = SSK(Buffer.from(M));
            Z71(chA($)), Z71(typeof D === "string" && chA(D) || ISK(D)), z.push(bSK($, D, H))
        }
    }

    function USK(A, q) {
        let K = null,
            Y = null,
            z = null,
            _ = null;
        while (!0) {
            if (A[q.position] === 13 && A[q.position + 1] === 10) {
                if (K === null) return "failure";
                return {
                    name: K,
                    filename: Y,
                    contentType: z,
                    encoding: _
                }
            }
            let w = TH6((O) => O !== 10 && O !== 13 && O !== 58, A, q);
            if (w = mr1(w, !0, !0, (O) => O === 9 || O === 32), !CSK.test(w.toString())) return "failure";
            if (A[q.position] !== 58) return "failure";
            switch (q.position++, TH6((O) => O === 32 || O === 9, A, q), hSK(w)) {
                case "content-disposition": {
                    if (K = Y = null, !G71(A, mSK, q)) return "failure";
                    if (q.position += 17, K = nhA(A, q), K === null) return "failure";
                    if (G71(A, ihA, q)) {
                        let O = q.position + ihA.length;
                        if (A[O] === 42) q.position += 1, O += 1;
                        if (A[O] !== 61 || A[O + 1] !== 34) return "failure";
                        if (q.position += 12, Y = nhA(A, q), Y === null) return "failure"
                    }
                    break
                }
                case "content-type": {
                    let O = TH6(($) => $ !== 10 && $ !== 13, A, q);
                    O = mr1(O, !1, !0, ($) => $ === 9 || $ === 32), z = lhA(O);
                    break
                }
                case "content-transfer-encoding": {
                    let O = TH6(($) => $ !== 10 && $ !== 13, A, q);
                    O = mr1(O, !1, !0, ($) => $ === 9 || $ === 32), _ = lhA(O);
                    break
                }
                default:
                    TH6((O) => O !== 10 && O !== 13, A, q)
            }
            if (A[q.position] !== 13 && A[q.position + 1] !== 10) return "failure";
            else q.position += 2
        }
    }

    function nhA(A, q) {
        Z71(A[q.position - 1] === 34);
        let K = TH6((Y) => Y !== 10 && Y !== 13 && Y !== 34, A, q);
        if (A[q.position] !== 34) return null;
        else q.position++;
        return K = new TextDecoder().decode(K).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), K
    }

    function TH6(A, q, K) {
        let Y = K.position;
        while (Y < q.length && A(q[Y])) ++Y;
        return q.subarray(K.position, K.position = Y)
    }

    function mr1(A, q, K, Y) {
        let z = 0,
            _ = A.length - 1;
        if (q)
            while (z < A.length && Y(A[z])) z++;
        if (K)
            while (_ > 0 && Y(A[_])) _--;
        return z === 0 && _ === A.length - 1 ? A : A.subarray(z, _ + 1)
    }

    function G71(A, q, K) {
        if (A.length < q.length) return !1;
        for (let Y = 0; Y < q.length; Y++)
            if (q[Y] !== A[K.position + Y]) return !1;
        return !0
    }
    rhA.exports = {
        multipartFormDataParser: QSK,
        validateBoundary: pSK
    }
})
// @from(Ln 53133, Col 4)
VH6 = x((xw_, YSA) => {
    var BR6 = Y9(),
        {
            ReadableStreamFrom: dSK,
            isBlobLike: ahA,
            isReadableStreamLike: cSK,
            readableStreamClose: lSK,
            createDeferredPromise: iSK,
            fullyReadBody: nSK,
            extractMimeType: rSK,
            utf8DecodeBytes: ehA
        } = SV(),
        {
            FormData: shA
        } = mR6(),
        {
            kState: NH6
        } = Nr(),
        {
            webidl: oSK
        } = vP(),
        {
            Blob: aSK
        } = x6("node:buffer"),
        Br1 = x6("node:assert"),
        {
            isErrored: ASA,
            isDisturbed: sSK
        } = x6("node:stream"),
        {
            isArrayBuffer: tSK
        } = x6("node:util/types"),
        {
            serializeAMimeType: eSK
        } = hT(),
        {
            multipartFormDataParser: ACK
        } = ohA(),
        gr1;
    try {
        let A = x6("node:crypto");
        gr1 = (q) => A.randomInt(0, q)
    } catch {
        gr1 = (A) => Math.floor(Math.random(A))
    }
    var f71 = new TextEncoder;

    function qCK() {}
    var Fr1 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
        pr1;
    if (Fr1) pr1 = new FinalizationRegistry((A) => {
        let q = A.deref();
        if (q && !q.locked && !sSK(q) && !ASA(q)) q.cancel("Response object has been garbage collected").catch(qCK)
    });

    function qSA(A, q = !1) {
        let K = null;
        if (A instanceof ReadableStream) K = A;
        else if (ahA(A)) K = A.stream();
        else K = new ReadableStream({
            async pull($) {
                let H = typeof z === "string" ? f71.encode(z) : z;
                if (H.byteLength) $.enqueue(H);
                queueMicrotask(() => lSK($))
            },
            start() {},
            type: "bytes"
        });
        Br1(cSK(K));
        let Y = null,
            z = null,
            _ = null,
            w = null;
        if (typeof A === "string") z = A, w = "text/plain;charset=UTF-8";
        else if (A instanceof URLSearchParams) z = A.toString(), w = "application/x-www-form-urlencoded;charset=UTF-8";
        else if (tSK(A)) z = new Uint8Array(A.slice());
        else if (ArrayBuffer.isView(A)) z = new Uint8Array(A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength));
        else if (BR6.isFormDataLike(A)) {
            let $ = `----formdata-undici-0${`${gr1(100000000000)}`.padStart(11,"0")}`,
                H = `--${$}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
            let j = (W) => W.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
                J = (W) => W.replace(/\r?\n|\r/g, `\r
`),
                M = [],
                D = new Uint8Array([13, 10]);
            _ = 0;
            let X = !1;
            for (let [W, Z] of A)
                if (typeof Z === "string") {
                    let G = f71.encode(H + `; name="${j(J(W))}"\r
\r
${J(Z)}\r
`);
                    M.push(G), _ += G.byteLength
                } else {
                    let G = f71.encode(`${H}; name="${j(J(W))}"` + (Z.name ? `; filename="${j(Z.name)}"` : "") + `\r
Content-Type: ${Z.type||"application/octet-stream"}\r
\r
`);
                    if (M.push(G, Z, D), typeof Z.size === "number") _ += G.byteLength + Z.size + D.byteLength;
                    else X = !0
                } let P = f71.encode(`--${$}--`);
            if (M.push(P), _ += P.byteLength, X) _ = null;
            z = A, Y = async function*() {
                for (let W of M)
                    if (W.stream) yield* W.stream();
                    else yield W
            }, w = `multipart/form-data; boundary=${$}`
        } else if (ahA(A)) {
            if (z = A, _ = A.size, A.type) w = A.type
        } else if (typeof A[Symbol.asyncIterator] === "function") {
            if (q) throw TypeError("keepalive");
            if (BR6.isDisturbed(A) || A.locked) throw TypeError("Response body object should not be disturbed or locked");
            K = A instanceof ReadableStream ? A : dSK(A)
        }
        if (typeof z === "string" || BR6.isBuffer(z)) _ = Buffer.byteLength(z);
        if (Y != null) {
            let $;
            K = new ReadableStream({
                async start() {
                    $ = Y(A)[Symbol.asyncIterator]()
                },
                async pull(H) {
                    let {
                        value: j,
                        done: J
                    } = await $.next();
                    if (J) queueMicrotask(() => {
                        H.close(), H.byobRequest?.respond(0)
                    });
                    else if (!ASA(K)) {
                        let M = new Uint8Array(j);
                        if (M.byteLength) H.enqueue(M)
                    }
                    return H.desiredSize > 0
                },
                async cancel(H) {
                    await $.return()
                },
                type: "bytes"
            })
        }
        return [{
            stream: K,
            source: z,
            length: _
        }, w]
    }

    function KCK(A, q = !1) {
        if (A instanceof ReadableStream) Br1(!BR6.isDisturbed(A), "The body has already been consumed."), Br1(!A.locked, "The stream is locked.");
        return qSA(A, q)
    }

    function YCK(A, q) {
        let [K, Y] = q.stream.tee();
        if (Fr1) pr1.register(A, new WeakRef(K));
        return q.stream = K, {
            stream: Y,
            length: q.length,
            source: q.source
        }
    }

    function zCK(A) {
        if (A.aborted) throw new DOMException("The operation was aborted.", "AbortError")
    }

    function _CK(A) {
        return {
            blob() {
                return vH6(this, (K) => {
                    let Y = thA(this);
                    if (Y === null) Y = "";
                    else if (Y) Y = eSK(Y);
                    return new aSK([K], {
                        type: Y
                    })
                }, A)
            },
            arrayBuffer() {
                return vH6(this, (K) => {
                    return new Uint8Array(K).buffer
                }, A)
            },
            text() {
                return vH6(this, ehA, A)
            },
            json() {
                return vH6(this, OCK, A)
            },
            formData() {
                return vH6(this, (K) => {
                    let Y = thA(this);
                    if (Y !== null) switch (Y.essence) {
                        case "multipart/form-data": {
                            let z = ACK(K, Y);
                            if (z === "failure") throw TypeError("Failed to parse body as FormData.");
                            let _ = new shA;
                            return _[NH6] = z, _
                        }
                        case "application/x-www-form-urlencoded": {
                            let z = new URLSearchParams(K.toString()),
                                _ = new shA;
                            for (let [w, O] of z) _.append(w, O);
                            return _
                        }
                    }
                    throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
                }, A)
            },
            bytes() {
                return vH6(this, (K) => {
                    return new Uint8Array(K)
                }, A)
            }
        }
    }

    function wCK(A) {
        Object.assign(A.prototype, _CK(A))
    }
    async function vH6(A, q, K) {
        if (oSK.brandCheck(A, K), KSA(A)) throw TypeError("Body is unusable: Body has already been read");
        zCK(A[NH6]);
        let Y = iSK(),
            z = (w) => Y.reject(w),
            _ = (w) => {
                try {
                    Y.resolve(q(w))
                } catch (O) {
                    z(O)
                }
            };
        if (A[NH6].body == null) return _(Buffer.allocUnsafe(0)), Y.promise;
        return await nSK(A[NH6].body, _, z), Y.promise
    }

    function KSA(A) {
        let q = A[NH6].body;
        return q != null && (q.stream.locked || BR6.isDisturbed(q.stream))
    }

    function OCK(A) {
        return JSON.parse(ehA(A))
    }

    function thA(A) {
        let q = A[NH6].headersList,
            K = rSK(q);
        if (K === "failure") return null;
        return K
    }
    YSA.exports = {
        extractBody: qSA,
        safelyExtractBody: KCK,
        cloneBody: YCK,
        mixinBody: wCK,
        streamRegistry: pr1,
        hasFinalizationRegistry: Fr1,
        bodyUnusable: KSA
    }
})
// @from(Ln 53397, Col 4)
PSA = x((uw_, XSA) => {
    var EK = x6("node:assert"),
        Z5 = Y9(),
        {
            channels: zSA
        } = jH6(),
        Qr1 = vr1(),
        {
            RequestContentLengthMismatchError: S76,
            ResponseContentLengthMismatchError: $CK,
            RequestAbortedError: jSA,
            HeadersTimeoutError: HCK,
            HeadersOverflowError: jCK,
            SocketError: E71,
            InformationalError: kH6,
            BodyTimeoutError: JCK,
            HTTPParserError: MCK,
            ResponseExceededMaxSizeError: DCK
        } = mz(),
        {
            kUrl: JSA,
            kReset: ST,
            kClient: lr1,
            kParser: LH,
            kBlocking: pR6,
            kRunning: GW,
            kPending: XCK,
            kSize: _SA,
            kWriting: kr,
            kQueue: BS,
            kNoRef: gR6,
            kKeepAliveDefaultTimeout: PCK,
            kHostHeader: WCK,
            kPendingIdx: ZCK,
            kRunningIdx: vy,
            kError: Ny,
            kPipelining: V71,
            kSocket: EH6,
            kKeepAliveTimeoutValue: y71,
            kMaxHeadersSize: Ur1,
            kKeepAliveMaxTimeout: GCK,
            kKeepAliveTimeoutThreshold: fCK,
            kHeadersTimeout: TCK,
            kBodyTimeout: vCK,
            kStrictContentLength: ir1,
            kMaxRequests: wSA,
            kCounter: NCK,
            kMaxResponseSize: VCK,
            kOnError: kCK,
            kResume: Vr,
            kHTTPContext: MSA
        } = UO(),
        Yu = eRA(),
        ECK = Buffer.alloc(0),
        T71 = Buffer[Symbol.species],
        v71 = Z5.addListener,
        yCK = Z5.removeAllListeners,
        dr1;
    async function LCK() {
        let A = process.env.JEST_WORKER_ID ? Lr1() : void 0,
            q;
        try {
            q = await WebAssembly.compile(KhA())
        } catch (K) {
            q = await WebAssembly.compile(A || Lr1())
        }
        return await WebAssembly.instantiate(q, {
            env: {
                wasm_on_url: (K, Y, z) => {
                    return 0
                },
                wasm_on_status: (K, Y, z) => {
                    EK(hM.ptr === K);
                    let _ = Y - _u + zu.byteOffset;
                    return hM.onStatus(new T71(zu.buffer, _, z)) || 0
                },
                wasm_on_message_begin: (K) => {
                    return EK(hM.ptr === K), hM.onMessageBegin() || 0
                },
                wasm_on_header_field: (K, Y, z) => {
                    EK(hM.ptr === K);
                    let _ = Y - _u + zu.byteOffset;
                    return hM.onHeaderField(new T71(zu.buffer, _, z)) || 0
                },
                wasm_on_header_value: (K, Y, z) => {
                    EK(hM.ptr === K);
                    let _ = Y - _u + zu.byteOffset;
                    return hM.onHeaderValue(new T71(zu.buffer, _, z)) || 0
                },
                wasm_on_headers_complete: (K, Y, z, _) => {
                    return EK(hM.ptr === K), hM.onHeadersComplete(Y, Boolean(z), Boolean(_)) || 0
                },
                wasm_on_body: (K, Y, z) => {
                    EK(hM.ptr === K);
                    let _ = Y - _u + zu.byteOffset;
                    return hM.onBody(new T71(zu.buffer, _, z)) || 0
                },
                wasm_on_message_complete: (K) => {
                    return EK(hM.ptr === K), hM.onMessageComplete() || 0
                }
            }
        })
    }
    var cr1 = null,
        nr1 = LCK();
    nr1.catch();
    var hM = null,
        zu = null,
        N71 = 0,
        _u = null,
        RCK = 0,
        FR6 = 1,
        yH6 = 2 | FR6,
        k71 = 4 | FR6,
        rr1 = 8 | RCK;
    class DSA {
        constructor(A, q, {
            exports: K
        }) {
            EK(Number.isFinite(A[Ur1]) && A[Ur1] > 0), this.llhttp = K, this.ptr = this.llhttp.llhttp_alloc(Yu.TYPE.RESPONSE), this.client = A, this.socket = q, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = A[Ur1], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = A[VCK]
        }
        setTimeout(A, q) {
            if (A !== this.timeoutValue || q & FR6 ^ this.timeoutType & FR6) {
                if (this.timeout) Qr1.clearTimeout(this.timeout), this.timeout = null;
                if (A)
                    if (q & FR6) this.timeout = Qr1.setFastTimeout(OSA, A, new WeakRef(this));
                    else this.timeout = setTimeout(OSA, A, new WeakRef(this)), this.timeout.unref();
                this.timeoutValue = A
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.timeoutType = q
        }
        resume() {
            if (this.socket.destroyed || !this.paused) return;
            if (EK(this.ptr != null), EK(hM == null), this.llhttp.llhttp_resume(this.ptr), EK(this.timeoutType === k71), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.paused = !1, this.execute(this.socket.read() || ECK), this.readMore()
        }
        readMore() {
            while (!this.paused && this.ptr) {
                let A = this.socket.read();
                if (A === null) break;
                this.execute(A)
            }
        }
        execute(A) {
            EK(this.ptr != null), EK(hM == null), EK(!this.paused);
            let {
                socket: q,
                llhttp: K
            } = this;
            if (A.length > N71) {
                if (_u) K.free(_u);
                N71 = Math.ceil(A.length / 4096) * 4096, _u = K.malloc(N71)
            }
            new Uint8Array(K.memory.buffer, _u, N71).set(A);
            try {
                let Y;
                try {
                    zu = A, hM = this, Y = K.llhttp_execute(this.ptr, _u, A.length)
                } catch (_) {
                    throw _
                } finally {
                    hM = null, zu = null
                }
                let z = K.llhttp_get_error_pos(this.ptr) - _u;
                if (Y === Yu.ERROR.PAUSED_UPGRADE) this.onUpgrade(A.slice(z));
                else if (Y === Yu.ERROR.PAUSED) this.paused = !0, q.unshift(A.slice(z));
                else if (Y !== Yu.ERROR.OK) {
                    let _ = K.llhttp_get_error_reason(this.ptr),
                        w = "";
                    if (_) {
                        let O = new Uint8Array(K.memory.buffer, _).indexOf(0);
                        w = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(K.memory.buffer, _, O).toString() + ")"
                    }
                    throw new MCK(w, Yu.ERROR[Y], A.slice(z))
                }
            } catch (Y) {
                Z5.destroy(q, Y)
            }
        }
        destroy() {
            EK(this.ptr != null), EK(hM == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && Qr1.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
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
            let K = q[BS][q[vy]];
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
                let Y = Z5.bufferToLowerCasedHeaderName(K);
                if (Y === "keep-alive") this.keepAlive += A.toString();
                else if (Y === "connection") this.connection += A.toString()
            } else if (K.length === 14 && Z5.bufferToLowerCasedHeaderName(K) === "content-length") this.contentLength += A.toString();
            this.trackHeader(A.length)
        }
        trackHeader(A) {
            if (this.headersSize += A, this.headersSize >= this.headersMaxSize) Z5.destroy(this.socket, new jCK)
        }
        onUpgrade(A) {
            let {
                upgrade: q,
                client: K,
                socket: Y,
                headers: z,
                statusCode: _
            } = this;
            EK(q), EK(K[EH6] === Y), EK(!Y.destroyed), EK(!this.paused), EK((z.length & 1) === 0);
            let w = K[BS][K[vy]];
            EK(w), EK(w.upgrade || w.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, Y.unshift(A), Y[LH].destroy(), Y[LH] = null, Y[lr1] = null, Y[Ny] = null, yCK(Y), K[EH6] = null, K[MSA] = null, K[BS][K[vy]++] = null, K.emit("disconnect", K[JSA], [K], new kH6("upgrade"));
            try {
                w.onUpgrade(_, z, Y)
            } catch (O) {
                Z5.destroy(Y, O)
            }
            K[Vr]()
        }
        onHeadersComplete(A, q, K) {
            let {
                client: Y,
                socket: z,
                headers: _,
                statusText: w
            } = this;
            if (z.destroyed) return -1;
            let O = Y[BS][Y[vy]];
            if (!O) return -1;
            if (EK(!this.upgrade), EK(this.statusCode < 200), A === 100) return Z5.destroy(z, new E71("bad response", Z5.getSocketInfo(z))), -1;
            if (q && !O.upgrade) return Z5.destroy(z, new E71("bad upgrade", Z5.getSocketInfo(z))), -1;
            if (EK(this.timeoutType === yH6), this.statusCode = A, this.shouldKeepAlive = K || O.method === "HEAD" && !z[ST] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
                let H = O.bodyTimeout != null ? O.bodyTimeout : Y[vCK];
                this.setTimeout(H, k71)
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if (O.method === "CONNECT") return EK(Y[GW] === 1), this.upgrade = !0, 2;
            if (q) return EK(Y[GW] === 1), this.upgrade = !0, 2;
            if (EK((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && Y[V71]) {
                let H = this.keepAlive ? Z5.parseKeepAliveTimeout(this.keepAlive) : null;
                if (H != null) {
                    let j = Math.min(H - Y[fCK], Y[GCK]);
                    if (j <= 0) z[ST] = !0;
                    else Y[y71] = j
                } else Y[y71] = Y[PCK]
            } else z[ST] = !0;
            let $ = O.onHeaders(A, _, this.resume, w) === !1;
            if (O.aborted) return -1;
            if (O.method === "HEAD") return 1;
            if (A < 200) return 1;
            if (z[pR6]) z[pR6] = !1, Y[Vr]();
            return $ ? Yu.ERROR.PAUSED : 0
        }
        onBody(A) {
            let {
                client: q,
                socket: K,
                statusCode: Y,
                maxResponseSize: z
            } = this;
            if (K.destroyed) return -1;
            let _ = q[BS][q[vy]];
            if (EK(_), EK(this.timeoutType === k71), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if (EK(Y >= 200), z > -1 && this.bytesRead + A.length > z) return Z5.destroy(K, new DCK), -1;
            if (this.bytesRead += A.length, _.onData(A) === !1) return Yu.ERROR.PAUSED
        }
        onMessageComplete() {
            let {
                client: A,
                socket: q,
                statusCode: K,
                upgrade: Y,
                headers: z,
                contentLength: _,
                bytesRead: w,
                shouldKeepAlive: O
            } = this;
            if (q.destroyed && (!K || O)) return -1;
            if (Y) return;
            EK(K >= 100), EK((this.headers.length & 1) === 0);
            let $ = A[BS][A[vy]];
            if (EK($), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, K < 200) return;
            if ($.method !== "HEAD" && _ && w !== parseInt(_, 10)) return Z5.destroy(q, new $CK), -1;
            if ($.onComplete(z), A[BS][A[vy]++] = null, q[kr]) return EK(A[GW] === 0), Z5.destroy(q, new kH6("reset")), Yu.ERROR.PAUSED;
            else if (!O) return Z5.destroy(q, new kH6("reset")), Yu.ERROR.PAUSED;
            else if (q[ST] && A[GW] === 0) return Z5.destroy(q, new kH6("reset")), Yu.ERROR.PAUSED;
            else if (A[V71] == null || A[V71] === 1) setImmediate(() => A[Vr]());
            else A[Vr]()
        }
    }

    function OSA(A) {
        let {
            socket: q,
            timeoutType: K,
            client: Y,
            paused: z
        } = A.deref();
        if (K === yH6) {
            if (!q[kr] || q.writableNeedDrain || Y[GW] > 1) EK(!z, "cannot be paused while waiting for headers"), Z5.destroy(q, new HCK)
        } else if (K === k71) {
            if (!z) Z5.destroy(q, new JCK)
        } else if (K === rr1) EK(Y[GW] === 0 && Y[y71]), Z5.destroy(q, new kH6("socket idle timeout"))
    }
    async function hCK(A, q) {
        if (A[EH6] = q, !cr1) cr1 = await nr1, nr1 = null;
        q[gR6] = !1, q[kr] = !1, q[ST] = !1, q[pR6] = !1, q[LH] = new DSA(A, q, cr1), v71(q, "error", function(Y) {
            EK(Y.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
            let z = this[LH];
            if (Y.code === "ECONNRESET" && z.statusCode && !z.shouldKeepAlive) {
                z.onMessageComplete();
                return
            }
            this[Ny] = Y, this[lr1][kCK](Y)
        }), v71(q, "readable", function() {
            let Y = this[LH];
            if (Y) Y.readMore()
        }), v71(q, "end", function() {
            let Y = this[LH];
            if (Y.statusCode && !Y.shouldKeepAlive) {
                Y.onMessageComplete();
                return
            }
            Z5.destroy(this, new E71("other side closed", Z5.getSocketInfo(this)))
        }), v71(q, "close", function() {
            let Y = this[lr1],
                z = this[LH];
            if (z) {
                if (!this[Ny] && z.statusCode && !z.shouldKeepAlive) z.onMessageComplete();
                this[LH].destroy(), this[LH] = null
            }
            let _ = this[Ny] || new E71("closed", Z5.getSocketInfo(this));
            if (Y[EH6] = null, Y[MSA] = null, Y.destroyed) {
                EK(Y[XCK] === 0);
                let w = Y[BS].splice(Y[vy]);
                for (let O = 0; O < w.length; O++) {
                    let $ = w[O];
                    Z5.errorRequest(Y, $, _)
                }
            } else if (Y[GW] > 0 && _.code !== "UND_ERR_INFO") {
                let w = Y[BS][Y[vy]];
                Y[BS][Y[vy]++] = null, Z5.errorRequest(Y, w, _)
            }
            Y[ZCK] = Y[vy], EK(Y[GW] === 0), Y.emit("disconnect", Y[JSA], [Y], _), Y[Vr]()
        });
        let K = !1;
        return q.on("close", () => {
            K = !0
        }), {
            version: "h1",
            defaultPipelining: 1,
            write(...Y) {
                return ICK(A, ...Y)
            },
            resume() {
                SCK(A)
            },
            destroy(Y, z) {
                if (K) queueMicrotask(z);
                else q.destroy(Y).on("close", z)
            },
            get destroyed() {
                return q.destroyed
            },
            busy(Y) {
                if (q[kr] || q[ST] || q[pR6]) return !0;
                if (Y) {
                    if (A[GW] > 0 && !Y.idempotent) return !0;
                    if (A[GW] > 0 && (Y.upgrade || Y.method === "CONNECT")) return !0;
                    if (A[GW] > 0 && Z5.bodyLength(Y.body) !== 0 && (Z5.isStream(Y.body) || Z5.isAsyncIterable(Y.body) || Z5.isFormDataLike(Y.body))) return !0
                }
                return !1
            }
        }
    }

    function SCK(A) {
        let q = A[EH6];
        if (q && !q.destroyed) {
            if (A[_SA] === 0) {
                if (!q[gR6] && q.unref) q.unref(), q[gR6] = !0
            } else if (q[gR6] && q.ref) q.ref(), q[gR6] = !1;
            if (A[_SA] === 0) {
                if (q[LH].timeoutType !== rr1) q[LH].setTimeout(A[y71], rr1)
            } else if (A[GW] > 0 && q[LH].statusCode < 200) {
                if (q[LH].timeoutType !== yH6) {
                    let K = A[BS][A[vy]],
                        Y = K.headersTimeout != null ? K.headersTimeout : A[TCK];
                    q[LH].setTimeout(Y, yH6)
                }
            }
        }
    }

    function CCK(A) {
        return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
    }

    function ICK(A, q) {
        let {
            method: K,
            path: Y,
            host: z,
            upgrade: _,
            blocking: w,
            reset: O
        } = q, {
            body: $,
            headers: H,
            contentLength: j
        } = q, J = K === "PUT" || K === "POST" || K === "PATCH" || K === "QUERY" || K === "PROPFIND" || K === "PROPPATCH";
        if (Z5.isFormDataLike($)) {
            if (!dr1) dr1 = VH6().extractBody;
            let [W, Z] = dr1($);
            if (q.contentType == null) H.push("content-type", Z);
            $ = W.stream, j = W.length
        } else if (Z5.isBlobLike($) && q.contentType == null && $.type) H.push("content-type", $.type);
        if ($ && typeof $.read === "function") $.read(0);
        let M = Z5.bodyLength($);
        if (j = M ?? j, j === null) j = q.contentLength;
        if (j === 0 && !J) j = null;
        if (CCK(K) && j > 0 && q.contentLength !== null && q.contentLength !== j) {
            if (A[ir1]) return Z5.errorRequest(A, q, new S76), !1;
            process.emitWarning(new S76)
        }
        let D = A[EH6],
            X = (W) => {
                if (q.aborted || q.completed) return;
                Z5.errorRequest(A, q, W || new jSA), Z5.destroy($), Z5.destroy(D, new kH6("aborted"))
            };
        try {
            q.onConnect(X)
        } catch (W) {
            Z5.errorRequest(A, q, W)
        }
        if (q.aborted) return !1;
        if (K === "HEAD") D[ST] = !0;
        if (_ || K === "CONNECT") D[ST] = !0;
        if (O != null) D[ST] = O;
        if (A[wSA] && D[NCK]++ >= A[wSA]) D[ST] = !0;
        if (w) D[pR6] = !0;
        let P = `${K} ${Y} HTTP/1.1\r
`;
        if (typeof z === "string") P += `host: ${z}\r
`;
        else P += A[WCK];
        if (_) P += `connection: upgrade\r
upgrade: ${_}\r
`;
        else if (A[V71] && !D[ST]) P += `connection: keep-alive\r
`;
        else P += `connection: close\r
`;
        if (Array.isArray(H))
            for (let W = 0; W < H.length; W += 2) {
                let Z = H[W + 0],
                    G = H[W + 1];
                if (Array.isArray(G))
                    for (let f = 0; f < G.length; f++) P += `${Z}: ${G[f]}\r
`;
                else P += `${Z}: ${G}\r
`
            }
        if (zSA.sendHeaders.hasSubscribers) zSA.sendHeaders.publish({
            request: q,
            headers: P,
            socket: D
        });
        if (!$ || M === 0) $SA(X, null, A, q, D, j, P, J);
        else if (Z5.isBuffer($)) $SA(X, $, A, q, D, j, P, J);
        else if (Z5.isBlobLike($))
            if (typeof $.stream === "function") HSA(X, $.stream(), A, q, D, j, P, J);
            else xCK(X, $, A, q, D, j, P, J);
        else if (Z5.isStream($)) bCK(X, $, A, q, D, j, P, J);
        else if (Z5.isIterable($)) HSA(X, $, A, q, D, j, P, J);
        else EK(!1);
        return !0
    }

    function bCK(A, q, K, Y, z, _, w, O) {
        EK(_ !== 0 || K[GW] === 0, "stream body cannot be pipelined");
        let $ = !1,
            H = new or1({
                abort: A,
                socket: z,
                request: Y,
                contentLength: _,
                client: K,
                expectsPayload: O,
                header: w
            }),
            j = function(X) {
                if ($) return;
                try {
                    if (!H.write(X) && this.pause) this.pause()
                } catch (P) {
                    Z5.destroy(this, P)
                }
            },
            J = function() {
                if ($) return;
                if (q.resume) q.resume()
            },
            M = function() {
                if (queueMicrotask(() => {
                        q.removeListener("error", D)
                    }), !$) {
                    let X = new jSA;
                    queueMicrotask(() => D(X))
                }
            },
            D = function(X) {
                if ($) return;
                if ($ = !0, EK(z.destroyed || z[kr] && K[GW] <= 1), z.off("drain", J).off("error", D), q.removeListener("data", j).removeListener("end", D).removeListener("close", M), !X) try {
                    H.end()
                } catch (P) {
                    X = P
                }
                if (H.destroy(X), X && (X.code !== "UND_ERR_INFO" || X.message !== "reset")) Z5.destroy(q, X);
                else Z5.destroy(q)
            };
        if (q.on("data", j).on("end", D).on("error", D).on("close", M), q.resume) q.resume();
        if (z.on("drain", J).on("error", D), q.errorEmitted ?? q.errored) setImmediate(() => D(q.errored));
        else if (q.endEmitted ?? q.readableEnded) setImmediate(() => D(null));
        if (q.closeEmitted ?? q.closed) setImmediate(M)
    }

    function $SA(A, q, K, Y, z, _, w, O) {
        try {
            if (!q)
                if (_ === 0) z.write(`${w}content-length: 0\r
\r
`, "latin1");
                else EK(_ === null, "no body must not have content length"), z.write(`${w}\r
`, "latin1");
            else if (Z5.isBuffer(q)) {
                if (EK(_ === q.byteLength, "buffer body must have content length"), z.cork(), z.write(`${w}content-length: ${_}\r
\r
`, "latin1"), z.write(q), z.uncork(), Y.onBodySent(q), !O && Y.reset !== !1) z[ST] = !0
            }
            Y.onRequestSent(), K[Vr]()
        } catch ($) {
            A($)
        }
    }
    async function xCK(A, q, K, Y, z, _, w, O) {
        EK(_ === q.size, "blob body must have content length");
        try {
            if (_ != null && _ !== q.size) throw new S76;
            let $ = Buffer.from(await q.arrayBuffer());
            if (z.cork(), z.write(`${w}content-length: ${_}\r
\r
`, "latin1"), z.write($), z.uncork(), Y.onBodySent($), Y.onRequestSent(), !O && Y.reset !== !1) z[ST] = !0;
            K[Vr]()
        } catch ($) {
            A($)
        }
    }
    async function HSA(A, q, K, Y, z, _, w, O) {
        EK(_ !== 0 || K[GW] === 0, "iterator body cannot be pipelined");
        let $ = null;

        function H() {
            if ($) {
                let M = $;
                $ = null, M()
            }
        }
        let j = () => new Promise((M, D) => {
            if (EK($ === null), z[Ny]) D(z[Ny]);
            else $ = M
        });
        z.on("close", H).on("drain", H);
        let J = new or1({
            abort: A,
            socket: z,
            request: Y,
            contentLength: _,
            client: K,
            expectsPayload: O,
            header: w
        });
        try {
            for await (let M of q) {
                if (z[Ny]) throw z[Ny];
                if (!J.write(M)) await j()
            }
            J.end()
        } catch (M) {
            J.destroy(M)
        } finally {
            z.off("close", H).off("drain", H)
        }
    }
    class or1 {
        constructor({
            abort: A,
            socket: q,
            request: K,
            contentLength: Y,
            client: z,
            expectsPayload: _,
            header: w
        }) {
            this.socket = q, this.request = K, this.contentLength = Y, this.client = z, this.bytesWritten = 0, this.expectsPayload = _, this.header = w, this.abort = A, q[kr] = !0
        }
        write(A) {
            let {
                socket: q,
                request: K,
                contentLength: Y,
                client: z,
                bytesWritten: _,
                expectsPayload: w,
                header: O
            } = this;
            if (q[Ny]) throw q[Ny];
            if (q.destroyed) return !1;
            let $ = Buffer.byteLength(A);
            if (!$) return !0;
            if (Y !== null && _ + $ > Y) {
                if (z[ir1]) throw new S76;
                process.emitWarning(new S76)
            }
            if (q.cork(), _ === 0) {
                if (!w && K.reset !== !1) q[ST] = !0;
                if (Y === null) q.write(`${O}transfer-encoding: chunked\r
`, "latin1");
                else q.write(`${O}content-length: ${Y}\r
\r
`, "latin1")
            }
            if (Y === null) q.write(`\r
${$.toString(16)}\r
`, "latin1");
            this.bytesWritten += $;
            let H = q.write(A);
            if (q.uncork(), K.onBodySent(A), !H) {
                if (q[LH].timeout && q[LH].timeoutType === yH6) {
                    if (q[LH].timeout.refresh) q[LH].timeout.refresh()
                }
            }
            return H
        }
        end() {
            let {
                socket: A,
                contentLength: q,
                client: K,
                bytesWritten: Y,
                expectsPayload: z,
                header: _,
                request: w
            } = this;
            if (w.onRequestSent(), A[kr] = !1, A[Ny]) throw A[Ny];
            if (A.destroyed) return;
            if (Y === 0)
                if (z) A.write(`${_}content-length: 0\r
\r
`, "latin1");
                else A.write(`${_}\r
`, "latin1");
            else if (q === null) A.write(`\r
0\r
\r
`, "latin1");
            if (q !== null && Y !== q)
                if (K[ir1]) throw new S76;
                else process.emitWarning(new S76);
            if (A[LH].timeout && A[LH].timeoutType === yH6) {
                if (A[LH].timeout.refresh) A[LH].timeout.refresh()
            }
            K[Vr]()
        }
        destroy(A) {
            let {
                socket: q,
                client: K,
                abort: Y
            } = this;
            if (q[kr] = !1, A) EK(K[GW] <= 1, "pipeline should only contain this request"), Y(A)
        }
    }
    XSA.exports = hCK
})
// @from(Ln 54104, Col 4)
VSA = x((mw_, NSA) => {
    var Vy = x6("node:assert"),
        {
            pipeline: uCK
        } = x6("node:stream"),
        p9 = Y9(),
        {
            RequestContentLengthMismatchError: ar1,
            RequestAbortedError: WSA,
            SocketError: QR6,
            InformationalError: sr1
        } = mz(),
        {
            kUrl: L71,
            kReset: h71,
            kClient: LH6,
            kRunning: S71,
            kPending: mCK,
            kQueue: Er,
            kPendingIdx: tr1,
            kRunningIdx: gS,
            kError: pS,
            kSocket: FD,
            kStrictContentLength: BCK,
            kOnError: er1,
            kMaxConcurrentStreams: vSA,
            kHTTP2Session: FS,
            kResume: yr,
            kSize: gCK,
            kHTTPContext: FCK
        } = UO(),
        YQ = Symbol("open streams"),
        ZSA, GSA = !1,
        R71;
    try {
        R71 = x6("node:http2")
    } catch {
        R71 = {
            constants: {}
        }
    }
    var {
        constants: {
            HTTP2_HEADER_AUTHORITY: pCK,
            HTTP2_HEADER_METHOD: QCK,
            HTTP2_HEADER_PATH: UCK,
            HTTP2_HEADER_SCHEME: dCK,
            HTTP2_HEADER_CONTENT_LENGTH: cCK,
            HTTP2_HEADER_EXPECT: lCK,
            HTTP2_HEADER_STATUS: iCK
        }
    } = R71;

    function nCK(A) {
        let q = [];
        for (let [K, Y] of Object.entries(A))
            if (Array.isArray(Y))
                for (let z of Y) q.push(Buffer.from(K), Buffer.from(z));
            else q.push(Buffer.from(K), Buffer.from(Y));
        return q
    }
    async function rCK(A, q) {
        if (A[FD] = q, !GSA) GSA = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
            code: "UNDICI-H2"
        });
        let K = R71.connect(A[L71], {
            createConnection: () => q,
            peerMaxConcurrentStreams: A[vSA]
        });
        K[YQ] = 0, K[LH6] = A, K[FD] = q, p9.addListener(K, "error", aCK), p9.addListener(K, "frameError", sCK), p9.addListener(K, "end", tCK), p9.addListener(K, "goaway", eCK), p9.addListener(K, "close", function() {
            let {
                [LH6]: z
            } = this, {
                [FD]: _
            } = z, w = this[FD][pS] || this[pS] || new QR6("closed", p9.getSocketInfo(_));
            if (z[FS] = null, z.destroyed) {
                Vy(z[mCK] === 0);
                let O = z[Er].splice(z[gS]);
                for (let $ = 0; $ < O.length; $++) {
                    let H = O[$];
                    p9.errorRequest(z, H, w)
                }
            }
        }), K.unref(), A[FS] = K, q[FS] = K, p9.addListener(q, "error", function(z) {
            Vy(z.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[pS] = z, this[LH6][er1](z)
        }), p9.addListener(q, "end", function() {
            p9.destroy(this, new QR6("other side closed", p9.getSocketInfo(this)))
        }), p9.addListener(q, "close", function() {
            let z = this[pS] || new QR6("closed", p9.getSocketInfo(this));
            if (A[FD] = null, this[FS] != null) this[FS].destroy(z);
            A[tr1] = A[gS], Vy(A[S71] === 0), A.emit("disconnect", A[L71], [A], z), A[yr]()
        });
        let Y = !1;
        return q.on("close", () => {
            Y = !0
        }), {
            version: "h2",
            defaultPipelining: 1 / 0,
            write(...z) {
                return qIK(A, ...z)
            },
            resume() {
                oCK(A)
            },
            destroy(z, _) {
                if (Y) queueMicrotask(_);
                else q.destroy(z).on("close", _)
            },
            get destroyed() {
                return q.destroyed
            },
            busy() {
                return !1
            }
        }
    }

    function oCK(A) {
        let q = A[FD];
        if (q?.destroyed === !1)
            if (A[gCK] === 0 && A[vSA] === 0) q.unref(), A[FS].unref();
            else q.ref(), A[FS].ref()
    }

    function aCK(A) {
        Vy(A.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[FD][pS] = A, this[LH6][er1](A)
    }

    function sCK(A, q, K) {
        if (K === 0) {
            let Y = new sr1(`HTTP/2: "frameError" received - type ${A}, code ${q}`);
            this[FD][pS] = Y, this[LH6][er1](Y)
        }
    }

    function tCK() {
        let A = new QR6("other side closed", p9.getSocketInfo(this[FD]));
        this.destroy(A), p9.destroy(this[FD], A)
    }

    function eCK(A) {
        let q = this[pS] || new QR6(`HTTP/2: "GOAWAY" frame received with code ${A}`, p9.getSocketInfo(this)),
            K = this[LH6];
        if (K[FD] = null, K[FCK] = null, this[FS] != null) this[FS].destroy(q), this[FS] = null;
        if (p9.destroy(this[FD], q), K[gS] < K[Er].length) {
            let Y = K[Er][K[gS]];
            K[Er][K[gS]++] = null, p9.errorRequest(K, Y, q), K[tr1] = K[gS]
        }
        Vy(K[S71] === 0), K.emit("disconnect", K[L71], [K], q), K[yr]()
    }

    function AIK(A) {
        return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
    }

    function qIK(A, q) {
        let K = A[FS],
            {
                method: Y,
                path: z,
                host: _,
                upgrade: w,
                expectContinue: O,
                signal: $,
                headers: H
            } = q,
            {
                body: j
            } = q;
        if (w) return p9.errorRequest(A, q, Error("Upgrade not supported for H2")), !1;
        let J = {};
        for (let v = 0; v < H.length; v += 2) {
            let N = H[v + 0],
                V = H[v + 1];
            if (Array.isArray(V))
                for (let L = 0; L < V.length; L++)
                    if (J[N]) J[N] += `,${V[L]}`;
                    else J[N] = V[L];
            else J[N] = V
        }
        let M, {
            hostname: D,
            port: X
        } = A[L71];
        J[pCK] = _ || `${D}${X?`:${X}`:""}`, J[QCK] = Y;
        let P = (v) => {
            if (q.aborted || q.completed) return;
            if (v = v || new WSA, p9.errorRequest(A, q, v), M != null) p9.destroy(M, v);
            p9.destroy(j, v), A[Er][A[gS]++] = null, A[yr]()
        };
        try {
            q.onConnect(P)
        } catch (v) {
            p9.errorRequest(A, q, v)
        }
        if (q.aborted) return !1;
        if (Y === "CONNECT") {
            if (K.ref(), M = K.request(J, {
                    endStream: !1,
                    signal: $
                }), M.id && !M.pending) q.onUpgrade(null, null, M), ++K[YQ], A[Er][A[gS]++] = null;
            else M.once("ready", () => {
                q.onUpgrade(null, null, M), ++K[YQ], A[Er][A[gS]++] = null
            });
            return M.once("close", () => {
                if (K[YQ] -= 1, K[YQ] === 0) K.unref()
            }), !0
        }
        J[UCK] = z, J[dCK] = "https";
        let W = Y === "PUT" || Y === "POST" || Y === "PATCH";
        if (j && typeof j.read === "function") j.read(0);
        let Z = p9.bodyLength(j);
        if (p9.isFormDataLike(j)) {
            ZSA ??= VH6().extractBody;
            let [v, N] = ZSA(j);
            J["content-type"] = N, j = v.stream, Z = v.length
        }
        if (Z == null) Z = q.contentLength;
        if (Z === 0 || !W) Z = null;
        if (AIK(Y) && Z > 0 && q.contentLength != null && q.contentLength !== Z) {
            if (A[BCK]) return p9.errorRequest(A, q, new ar1), !1;
            process.emitWarning(new ar1)
        }
        if (Z != null) Vy(j, "no body must not have content length"), J[cCK] = `${Z}`;
        K.ref();
        let G = Y === "GET" || Y === "HEAD" || j === null;
        if (O) J[lCK] = "100-continue", M = K.request(J, {
            endStream: G,
            signal: $
        }), M.once("continue", f);
        else M = K.request(J, {
            endStream: G,
            signal: $
        }), f();
        return ++K[YQ], M.once("response", (v) => {
            let {
                [iCK]: N, ...V
            } = v;
            if (q.onResponseStarted(), q.aborted) {
                let L = new WSA;
                p9.errorRequest(A, q, L), p9.destroy(M, L);
                return
            }
            if (q.onHeaders(Number(N), nCK(V), M.resume.bind(M), "") === !1) M.pause();
            M.on("data", (L) => {
                if (q.onData(L) === !1) M.pause()
            })
        }), M.once("end", () => {
            if (M.state?.state == null || M.state.state < 6) q.onComplete([]);
            if (K[YQ] === 0) K.unref();
            P(new sr1("HTTP/2: stream half-closed (remote)")), A[Er][A[gS]++] = null, A[tr1] = A[gS], A[yr]()
        }), M.once("close", () => {
            if (K[YQ] -= 1, K[YQ] === 0) K.unref()
        }), M.once("error", function(v) {
            P(v)
        }), M.once("frameError", (v, N) => {
            P(new sr1(`HTTP/2: "frameError" received - type ${v}, code ${N}`))
        }), !0;

        function f() {
            if (!j || Z === 0) fSA(P, M, null, A, q, A[FD], Z, W);
            else if (p9.isBuffer(j)) fSA(P, M, j, A, q, A[FD], Z, W);
            else if (p9.isBlobLike(j))
                if (typeof j.stream === "function") TSA(P, M, j.stream(), A, q, A[FD], Z, W);
                else YIK(P, M, j, A, q, A[FD], Z, W);
            else if (p9.isStream(j)) KIK(P, A[FD], W, M, j, A, q, Z);
            else if (p9.isIterable(j)) TSA(P, M, j, A, q, A[FD], Z, W);
            else Vy(!1)
        }
    }

    function fSA(A, q, K, Y, z, _, w, O) {
        try {
            if (K != null && p9.isBuffer(K)) Vy(w === K.byteLength, "buffer body must have content length"), q.cork(), q.write(K), q.uncork(), q.end(), z.onBodySent(K);
            if (!O) _[h71] = !0;
            z.onRequestSent(), Y[yr]()
        } catch ($) {
            A($)
        }
    }

    function KIK(A, q, K, Y, z, _, w, O) {
        Vy(O !== 0 || _[S71] === 0, "stream body cannot be pipelined");
        let $ = uCK(z, Y, (j) => {
            if (j) p9.destroy($, j), A(j);
            else {
                if (p9.removeAllListeners($), w.onRequestSent(), !K) q[h71] = !0;
                _[yr]()
            }
        });
        p9.addListener($, "data", H);

        function H(j) {
            w.onBodySent(j)
        }
    }
    async function YIK(A, q, K, Y, z, _, w, O) {
        Vy(w === K.size, "blob body must have content length");
        try {
            if (w != null && w !== K.size) throw new ar1;
            let $ = Buffer.from(await K.arrayBuffer());
            if (q.cork(), q.write($), q.uncork(), q.end(), z.onBodySent($), z.onRequestSent(), !O) _[h71] = !0;
            Y[yr]()
        } catch ($) {
            A($)
        }
    }
    async function TSA(A, q, K, Y, z, _, w, O) {
        Vy(w !== 0 || Y[S71] === 0, "iterator body cannot be pipelined");
        let $ = null;

        function H() {
            if ($) {
                let J = $;
                $ = null, J()
            }
        }
        let j = () => new Promise((J, M) => {
            if (Vy($ === null), _[pS]) M(_[pS]);
            else $ = J
        });
        q.on("close", H).on("drain", H);
        try {
            for await (let J of K) {
                if (_[pS]) throw _[pS];
                let M = q.write(J);
                if (z.onBodySent(J), !M) await j()
            }
            if (q.end(), z.onRequestSent(), !O) _[h71] = !0;
            Y[yr]()
        } catch (J) {
            A(J)
        } finally {
            q.off("close", H).off("drain", H)
        }
    }
    NSA.exports = rCK
})
// @from(Ln 54442, Col 4)
C71 = x((Bw_, LSA) => {
    var wu = Y9(),
        {
            kBodyUsed: UR6
        } = UO(),
        qo1 = x6("node:assert"),
        {
            InvalidArgumentError: zIK
        } = mz(),
        _IK = x6("node:events"),
        wIK = [300, 301, 302, 303, 307, 308],
        kSA = Symbol("body");
    class Ao1 {
        constructor(A) {
            this[kSA] = A, this[UR6] = !1
        }
        async * [Symbol.asyncIterator]() {
            qo1(!this[UR6], "disturbed"), this[UR6] = !0, yield* this[kSA]
        }
    }
    class ySA {
        constructor(A, q, K, Y) {
            if (q != null && (!Number.isInteger(q) || q < 0)) throw new zIK("maxRedirections must be a positive number");
            if (wu.validateHandler(Y, K.method, K.upgrade), this.dispatch = A, this.location = null, this.abort = null, this.opts = {
                    ...K,
                    maxRedirections: 0
                }, this.maxRedirections = q, this.handler = Y, this.history = [], this.redirectionLimitReached = !1, wu.isStream(this.opts.body)) {
                if (wu.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function() {
                    qo1(!1)
                });
                if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[UR6] = !1, _IK.prototype.on.call(this.opts.body, "data", function() {
                    this[UR6] = !0
                })
            } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new Ao1(this.opts.body);
            else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && wu.isIterable(this.opts.body)) this.opts.body = new Ao1(this.opts.body)
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
            if (this.location = this.history.length >= this.maxRedirections || wu.isDisturbed(this.opts.body) ? null : OIK(A, q), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
                if (this.request) this.request.abort(Error("max redirects"));
                this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
                return
            }
            if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
            if (!this.location) return this.handler.onHeaders(A, q, K, Y);
            let {
                origin: z,
                pathname: _,
                search: w
            } = wu.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), O = w ? `${_}${w}` : _;
            if (this.opts.headers = $IK(this.opts.headers, A === 303, this.opts.origin !== z), this.opts.path = O, this.opts.origin = z, this.opts.maxRedirections = 0, this.opts.query = null, A === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
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

    function OIK(A, q) {
        if (wIK.indexOf(A) === -1) return null;
        for (let K = 0; K < q.length; K += 2)
            if (q[K].length === 8 && wu.headerNameToString(q[K]) === "location") return q[K + 1]
    }

    function ESA(A, q, K) {
        if (A.length === 4) return wu.headerNameToString(A) === "host";
        if (q && wu.headerNameToString(A).startsWith("content-")) return !0;
        if (K && (A.length === 13 || A.length === 6 || A.length === 19)) {
            let Y = wu.headerNameToString(A);
            return Y === "authorization" || Y === "cookie" || Y === "proxy-authorization"
        }
        return !1
    }

    function $IK(A, q, K) {
        let Y = [];
        if (Array.isArray(A)) {
            for (let z = 0; z < A.length; z += 2)
                if (!ESA(A[z], q, K)) Y.push(A[z], A[z + 1])
        } else if (A && typeof A === "object") {
            for (let z of Object.keys(A))
                if (!ESA(z, q, K)) Y.push(z, A[z])
        } else qo1(A == null, "headers must be an object or an array");
        return Y
    }
    LSA.exports = ySA
})
// @from(Ln 54546, Col 4)
I71 = x((gw_, RSA) => {
    var HIK = C71();

    function jIK({
        maxRedirections: A
    }) {
        return (q) => {
            return function(Y, z) {
                let {
                    maxRedirections: _ = A
                } = Y;
                if (!_) return q(Y, z);
                let w = new HIK(q, _, Y, z);
                return Y = {
                    ...Y,
                    maxRedirections: 0
                }, q(Y, w)
            }
        }
    }
    RSA.exports = jIK
})