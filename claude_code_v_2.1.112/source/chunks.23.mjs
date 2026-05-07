
// @from(Ln 55337, Col 4)
kh = p((Y_O, jc7) => {
    var {
        Transform: va5
    } = d6("node:stream"), id7 = d6("node:zlib"), {
        redirectStatusSet: Ta5,
        referrerPolicySet: Va5,
        badPortsSet: ka5
    } = oQ6(), {
        getGlobalOrigin: rd7
    } = Tw1(), {
        collectASequenceOfCodePoints: nA6,
        collectAnHTTPQuotedString: Na5,
        removeChars: Ea5,
        parseMIMEType: ya5
    } = qE(), {
        performance: La5
    } = d6("node:perf_hooks"), {
        isBlobLike: ha5,
        ReadableStreamFrom: Ra5,
        isValidHTTPToken: od7,
        normalizedMethodRecordsBase: Sa5
    } = Hz(), iA6 = d6("node:assert"), {
        isUint8Array: Ca5
    } = d6("node:util/types"), {
        webidl: sQ6
    } = lZ(), ad7 = [], rX8;
    try {
        rX8 = d6("node:crypto");
        let q = ["sha256", "sha384", "sha512"];
        ad7 = rX8.getHashes().filter((K) => q.includes(K))
    } catch {}

    function sd7(q) {
        let K = q.urlList,
            _ = K.length;
        return _ === 0 ? null : K[_ - 1].toString()
    }

    function ba5(q, K) {
        if (!Ta5.has(q.status)) return null;
        let _ = q.headersList.get("location", !0);
        if (_ !== null && ed7(_)) {
            if (!td7(_)) _ = Ia5(_);
            _ = new URL(_, sd7(q))
        }
        if (_ && !_.hash) _.hash = K;
        return _
    }

    function td7(q) {
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (_ > 126 || _ < 32) return !1
        }
        return !0
    }

    function Ia5(q) {
        return Buffer.from(q, "binary").toString("utf8")
    }

    function eQ6(q) {
        return q.urlList[q.urlList.length - 1]
    }

    function xa5(q) {
        let K = eQ6(q);
        if (Yc7(K) && ka5.has(K.port)) return "blocked";
        return "allowed"
    }

    function ua5(q) {
        return q instanceof Error || (q?.constructor?.name === "Error" || q?.constructor?.name === "DOMException")
    }

    function ma5(q) {
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (!(_ === 9 || _ >= 32 && _ <= 126 || _ >= 128 && _ <= 255)) return !1
        }
        return !0
    }
    var Ba5 = od7;

    function ed7(q) {
        return (q[0] === "\t" || q[0] === " " || q[q.length - 1] === "\t" || q[q.length - 1] === " " || q.includes(`
`) || q.includes("\r") || q.includes("\x00")) === !1
    }

    function pa5(q, K) {
        let {
            headersList: _
        } = K, z = (_.get("referrer-policy", !0) ?? "").split(","), Y = "";
        if (z.length > 0)
            for (let A = z.length; A !== 0; A--) {
                let O = z[A - 1].trim();
                if (Va5.has(O)) {
                    Y = O;
                    break
                }
            }
        if (Y !== "") q.referrerPolicy = Y
    }

    function Fa5() {
        return "allowed"
    }

    function ga5() {
        return "success"
    }

    function Ua5() {
        return "success"
    }

    function Qa5(q) {
        let K = null;
        K = q.mode, q.headersList.set("sec-fetch-mode", K, !0)
    }

    function da5(q) {
        let K = q.origin;
        if (K === "client" || K === void 0) return;
        if (q.responseTainting === "cors" || q.mode === "websocket") q.headersList.append("origin", K, !0);
        else if (q.method !== "GET" && q.method !== "HEAD") {
            switch (q.referrerPolicy) {
                case "no-referrer":
                    K = null;
                    break;
                case "no-referrer-when-downgrade":
                case "strict-origin":
                case "strict-origin-when-cross-origin":
                    if (q.origin && Ew1(q.origin) && !Ew1(eQ6(q))) K = null;
                    break;
                case "same-origin":
                    if (!oX8(q, eQ6(q))) K = null;
                    break;
                default:
            }
            q.headersList.append("origin", K, !0)
        }
    }

    function VG6(q, K) {
        return q
    }

    function ca5(q, K, _) {
        if (!q?.startTime || q.startTime < K) return {
            domainLookupStartTime: K,
            domainLookupEndTime: K,
            connectionStartTime: K,
            connectionEndTime: K,
            secureConnectionStartTime: K,
            ALPNNegotiatedProtocol: q?.ALPNNegotiatedProtocol
        };
        return {
            domainLookupStartTime: VG6(q.domainLookupStartTime, _),
            domainLookupEndTime: VG6(q.domainLookupEndTime, _),
            connectionStartTime: VG6(q.connectionStartTime, _),
            connectionEndTime: VG6(q.connectionEndTime, _),
            secureConnectionStartTime: VG6(q.secureConnectionStartTime, _),
            ALPNNegotiatedProtocol: q.ALPNNegotiatedProtocol
        }
    }

    function la5(q) {
        return VG6(La5.now(), q)
    }

    function na5(q) {
        return {
            startTime: q.startTime ?? 0,
            redirectStartTime: 0,
            redirectEndTime: 0,
            postRedirectStartTime: q.startTime ?? 0,
            finalServiceWorkerStartTime: 0,
            finalNetworkResponseStartTime: 0,
            finalNetworkRequestStartTime: 0,
            endTime: 0,
            encodedBodySize: 0,
            decodedBodySize: 0,
            finalConnectionTimingInfo: null
        }
    }

    function qc7() {
        return {
            referrerPolicy: "strict-origin-when-cross-origin"
        }
    }

    function ia5(q) {
        return {
            referrerPolicy: q.referrerPolicy
        }
    }

    function ra5(q) {
        let K = q.referrerPolicy;
        iA6(K);
        let _ = null;
        if (q.referrer === "client") {
            let w = rd7();
            if (!w || w.origin === "null") return "no-referrer";
            _ = new URL(w)
        } else if (q.referrer instanceof URL) _ = q.referrer;
        let z = Nw1(_),
            Y = Nw1(_, !0);
        if (z.toString().length > 4096) z = Y;
        let A = oX8(q, z),
            O = tQ6(z) && !tQ6(q.url);
        switch (K) {
            case "origin":
                return Y != null ? Y : Nw1(_, !0);
            case "unsafe-url":
                return z;
            case "same-origin":
                return A ? Y : "no-referrer";
            case "origin-when-cross-origin":
                return A ? z : Y;
            case "strict-origin-when-cross-origin": {
                let w = eQ6(q);
                if (oX8(z, w)) return z;
                if (tQ6(z) && !tQ6(w)) return "no-referrer";
                return Y
            }
            case "strict-origin":
            case "no-referrer-when-downgrade":
            default:
                return O ? "no-referrer" : Y
        }
    }

    function Nw1(q, K) {
        if (iA6(q instanceof URL), q = new URL(q), q.protocol === "file:" || q.protocol === "about:" || q.protocol === "blank:") return "no-referrer";
        if (q.username = "", q.password = "", q.hash = "", K) q.pathname = "", q.search = "";
        return q
    }

    function tQ6(q) {
        if (!(q instanceof URL)) return !1;
        if (q.href === "about:blank" || q.href === "about:srcdoc") return !0;
        if (q.protocol === "data:") return !0;
        if (q.protocol === "file:") return !0;
        return K(q.origin);

        function K(_) {
            if (_ == null || _ === "null") return !1;
            let z = new URL(_);
            if (z.protocol === "https:" || z.protocol === "wss:") return !0;
            if (/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(z.hostname) || (z.hostname === "localhost" || z.hostname.includes("localhost.")) || z.hostname.endsWith(".localhost")) return !0;
            return !1
        }
    }

    function oa5(q, K) {
        if (rX8 === void 0) return !0;
        let _ = Kc7(K);
        if (_ === "no metadata") return !0;
        if (_.length === 0) return !0;
        let z = sa5(_),
            Y = ta5(_, z);
        for (let A of Y) {
            let {
                algo: O,
                hash: w
            } = A, $ = rX8.createHash(O).update(q).digest("base64");
            if ($[$.length - 1] === "=")
                if ($[$.length - 2] === "=") $ = $.slice(0, -2);
                else $ = $.slice(0, -1);
            if (ea5($, w)) return !0
        }
        return !1
    }
    var aa5 = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

    function Kc7(q) {
        let K = [],
            _ = !0;
        for (let z of q.split(" ")) {
            _ = !1;
            let Y = aa5.exec(z);
            if (Y === null || Y.groups === void 0 || Y.groups.algo === void 0) continue;
            let A = Y.groups.algo.toLowerCase();
            if (ad7.includes(A)) K.push(Y.groups)
        }
        if (_ === !0) return "no metadata";
        return K
    }

    function sa5(q) {
        let K = q[0].algo;
        if (K[3] === "5") return K;
        for (let _ = 1; _ < q.length; ++_) {
            let z = q[_];
            if (z.algo[3] === "5") {
                K = "sha512";
                break
            } else if (K[3] === "3") continue;
            else if (z.algo[3] === "3") K = "sha384"
        }
        return K
    }

    function ta5(q, K) {
        if (q.length === 1) return q;
        let _ = 0;
        for (let z = 0; z < q.length; ++z)
            if (q[z].algo === K) q[_++] = q[z];
        return q.length = _, q
    }

    function ea5(q, K) {
        if (q.length !== K.length) return !1;
        for (let _ = 0; _ < q.length; ++_)
            if (q[_] !== K[_]) {
                if (q[_] === "+" && K[_] === "-" || q[_] === "/" && K[_] === "_") continue;
                return !1
            } return !0
    }

    function qs5(q) {}

    function oX8(q, K) {
        if (q.origin === K.origin && q.origin === "null") return !0;
        if (q.protocol === K.protocol && q.hostname === K.hostname && q.port === K.port) return !0;
        return !1
    }

    function Ks5() {
        let q, K;
        return {
            promise: new Promise((z, Y) => {
                q = z, K = Y
            }),
            resolve: q,
            reject: K
        }
    }

    function _s5(q) {
        return q.controller.state === "aborted"
    }

    function zs5(q) {
        return q.controller.state === "aborted" || q.controller.state === "terminated"
    }

    function Ys5(q) {
        return Sa5[q.toLowerCase()] ?? q
    }

    function As5(q) {
        let K = JSON.stringify(q);
        if (K === void 0) throw TypeError("Value is not JSON serializable");
        return iA6(typeof K === "string"), K
    }
    var Os5 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

    function _c7(q, K, _ = 0, z = 1) {
        class Y {
            #q;
            #K;
            #_;
            constructor(A, O) {
                this.#q = A, this.#K = O, this.#_ = 0
            }
            next() {
                if (typeof this !== "object" || this === null || !(#q in this)) throw TypeError(`'next' called on an object that does not implement interface ${q} Iterator.`);
                let A = this.#_,
                    O = this.#q[K],
                    w = O.length;
                if (A >= w) return {
                    value: void 0,
                    done: !0
                };
                let {
                    [_]: $, [z]: j
                } = O[A];
                this.#_ = A + 1;
                let H;
                switch (this.#K) {
                    case "key":
                        H = $;
                        break;
                    case "value":
                        H = j;
                        break;
                    case "key+value":
                        H = [$, j];
                        break
                }
                return {
                    value: H,
                    done: !1
                }
            }
        }
        return delete Y.prototype.constructor, Object.setPrototypeOf(Y.prototype, Os5), Object.defineProperties(Y.prototype, {
                [Symbol.toStringTag]: {
                    writable: !1,
                    enumerable: !1,
                    configurable: !0,
                    value: `${q} Iterator`
                },
                next: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                }
            }),
            function(A, O) {
                return new Y(A, O)
            }
    }

    function ws5(q, K, _, z = 0, Y = 1) {
        let A = _c7(q, _, z, Y),
            O = {
                keys: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return sQ6.brandCheck(this, K), A(this, "key")
                    }
                },
                values: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return sQ6.brandCheck(this, K), A(this, "value")
                    }
                },
                entries: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function() {
                        return sQ6.brandCheck(this, K), A(this, "key+value")
                    }
                },
                forEach: {
                    writable: !0,
                    enumerable: !0,
                    configurable: !0,
                    value: function($, j = globalThis) {
                        if (sQ6.brandCheck(this, K), sQ6.argumentLengthCheck(arguments, 1, `${q}.forEach`), typeof $ !== "function") throw TypeError(`Failed to execute 'forEach' on '${q}': parameter 1 is not of type 'Function'.`);
                        for (let {
                                0: H,
                                1: J
                            }
                            of A(this, "key+value")) $.call(j, J, H, this)
                    }
                }
            };
        return Object.defineProperties(K.prototype, {
            ...O,
            [Symbol.iterator]: {
                writable: !0,
                enumerable: !1,
                configurable: !0,
                value: O.entries.value
            }
        })
    }
    async function $s5(q, K, _) {
        let z = K,
            Y = _,
            A;
        try {
            A = q.stream.getReader()
        } catch (O) {
            Y(O);
            return
        }
        try {
            z(await zc7(A))
        } catch (O) {
            Y(O)
        }
    }

    function js5(q) {
        return q instanceof ReadableStream || q[Symbol.toStringTag] === "ReadableStream" && typeof q.tee === "function"
    }

    function Hs5(q) {
        try {
            q.close(), q.byobRequest?.respond(0)
        } catch (K) {
            if (!K.message.includes("Controller is already closed") && !K.message.includes("ReadableStream is already closed")) throw K
        }
    }
    var Js5 = /[^\x00-\xFF]/;

    function iX8(q) {
        return iA6(!Js5.test(q)), q
    }
    async function zc7(q) {
        let K = [],
            _ = 0;
        while (!0) {
            let {
                done: z,
                value: Y
            } = await q.read();
            if (z) return Buffer.concat(K, _);
            if (!Ca5(Y)) throw TypeError("Received non-Uint8Array chunk");
            K.push(Y), _ += Y.length
        }
    }

    function Xs5(q) {
        iA6("protocol" in q);
        let K = q.protocol;
        return K === "about:" || K === "blob:" || K === "data:"
    }

    function Ew1(q) {
        return typeof q === "string" && q[5] === ":" && q[0] === "h" && q[1] === "t" && q[2] === "t" && q[3] === "p" && q[4] === "s" || q.protocol === "https:"
    }

    function Yc7(q) {
        iA6("protocol" in q);
        let K = q.protocol;
        return K === "http:" || K === "https:"
    }

    function Ms5(q, K) {
        let _ = q;
        if (!_.startsWith("bytes")) return "failure";
        let z = {
            position: 5
        };
        if (K) nA6(($) => $ === "\t" || $ === " ", _, z);
        if (_.charCodeAt(z.position) !== 61) return "failure";
        if (z.position++, K) nA6(($) => $ === "\t" || $ === " ", _, z);
        let Y = nA6(($) => {
                let j = $.charCodeAt(0);
                return j >= 48 && j <= 57
            }, _, z),
            A = Y.length ? Number(Y) : null;
        if (K) nA6(($) => $ === "\t" || $ === " ", _, z);
        if (_.charCodeAt(z.position) !== 45) return "failure";
        if (z.position++, K) nA6(($) => $ === "\t" || $ === " ", _, z);
        let O = nA6(($) => {
                let j = $.charCodeAt(0);
                return j >= 48 && j <= 57
            }, _, z),
            w = O.length ? Number(O) : null;
        if (z.position < _.length) return "failure";
        if (w === null && A === null) return "failure";
        if (A > w) return "failure";
        return {
            rangeStartValue: A,
            rangeEndValue: w
        }
    }

    function Ps5(q, K, _) {
        let z = "bytes ";
        return z += iX8(`${q}`), z += "-", z += iX8(`${K}`), z += "/", z += iX8(`${_}`), z
    }
    class Ac7 extends va5 {
        #q;
        constructor(q) {
            super();
            this.#q = q
        }
        _transform(q, K, _) {
            if (!this._inflateStream) {
                if (q.length === 0) {
                    _();
                    return
                }
                this._inflateStream = (q[0] & 15) === 8 ? id7.createInflate(this.#q) : id7.createInflateRaw(this.#q), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (z) => this.destroy(z))
            }
            this._inflateStream.write(q, K, _)
        }
        _final(q) {
            if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
            q()
        }
    }

    function Ws5(q) {
        return new Ac7(q)
    }

    function Ds5(q) {
        let K = null,
            _ = null,
            z = null,
            Y = Oc7("content-type", q);
        if (Y === null) return "failure";
        for (let A of Y) {
            let O = ya5(A);
            if (O === "failure" || O.essence === "*/*") continue;
            if (z = O, z.essence !== _) {
                if (K = null, z.parameters.has("charset")) K = z.parameters.get("charset");
                _ = z.essence
            } else if (!z.parameters.has("charset") && K !== null) z.parameters.set("charset", K)
        }
        if (z == null) return "failure";
        return z
    }

    function Zs5(q) {
        let K = q,
            _ = {
                position: 0
            },
            z = [],
            Y = "";
        while (_.position < K.length) {
            if (Y += nA6((A) => A !== '"' && A !== ",", K, _), _.position < K.length)
                if (K.charCodeAt(_.position) === 34) {
                    if (Y += Na5(K, _), _.position < K.length) continue
                } else iA6(K.charCodeAt(_.position) === 44), _.position++;
            Y = Ea5(Y, !0, !0, (A) => A === 9 || A === 32), z.push(Y), Y = ""
        }
        return z
    }

    function Oc7(q, K) {
        let _ = K.get(q, !0);
        if (_ === null) return null;
        return Zs5(_)
    }
    var fs5 = new TextDecoder;

    function Gs5(q) {
        if (q.length === 0) return "";
        if (q[0] === 239 && q[1] === 187 && q[2] === 191) q = q.subarray(3);
        return fs5.decode(q)
    }
    class wc7 {
        get baseUrl() {
            return rd7()
        }
        get origin() {
            return this.baseUrl?.origin
        }
        policyContainer = qc7()
    }
    class $c7 {
        settingsObject = new wc7
    }
    var vs5 = new $c7;
    jc7.exports = {
        isAborted: _s5,
        isCancelled: zs5,
        isValidEncodedURL: td7,
        createDeferredPromise: Ks5,
        ReadableStreamFrom: Ra5,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: qs5,
        clampAndCoarsenConnectionTimingInfo: ca5,
        coarsenedSharedCurrentTime: la5,
        determineRequestsReferrer: ra5,
        makePolicyContainer: qc7,
        clonePolicyContainer: ia5,
        appendFetchMetadata: Qa5,
        appendRequestOriginHeader: da5,
        TAOCheck: Ua5,
        corsCheck: ga5,
        crossOriginResourcePolicyCheck: Fa5,
        createOpaqueTimingInfo: na5,
        setRequestReferrerPolicyOnRedirect: pa5,
        isValidHTTPToken: od7,
        requestBadPort: xa5,
        requestCurrentURL: eQ6,
        responseURL: sd7,
        responseLocationURL: ba5,
        isBlobLike: ha5,
        isURLPotentiallyTrustworthy: tQ6,
        isValidReasonPhrase: ma5,
        sameOrigin: oX8,
        normalizeMethod: Ys5,
        serializeJavascriptValueToJSONString: As5,
        iteratorMixin: ws5,
        createIterator: _c7,
        isValidHeaderName: Ba5,
        isValidHeaderValue: ed7,
        isErrorLike: ua5,
        fullyReadBody: $s5,
        bytesMatch: oa5,
        isReadableStreamLike: js5,
        readableStreamClose: Hs5,
        isomorphicEncode: iX8,
        urlIsLocal: Xs5,
        urlHasHttpsScheme: Ew1,
        urlIsHttpHttpsScheme: Yc7,
        readAllBytes: zc7,
        simpleRangeHeaderValue: Ms5,
        buildContentRange: Ps5,
        parseMetadata: Kc7,
        createInflate: Ws5,
        extractMimeType: Ds5,
        getDecodeSplit: Oc7,
        utf8DecodeBytes: Gs5,
        environmentSettingsObject: vs5
    }
})
// @from(Ln 56044, Col 4)
l16 = p((A_O, Hc7) => {
    Hc7.exports = {
        kUrl: Symbol("url"),
        kHeaders: Symbol("headers"),
        kSignal: Symbol("signal"),
        kState: Symbol("state"),
        kDispatcher: Symbol("dispatcher")
    }
})
// @from(Ln 56053, Col 4)
yw1 = p((O_O, Jc7) => {
    var {
        Blob: Ts5,
        File: Vs5
    } = d6("node:buffer"), {
        kState: Ir
    } = l16(), {
        webidl: yU
    } = lZ();
    class LU {
        constructor(q, K, _ = {}) {
            let z = K,
                Y = _.type,
                A = _.lastModified ?? Date.now();
            this[Ir] = {
                blobLike: q,
                name: z,
                type: Y,
                lastModified: A
            }
        }
        stream(...q) {
            return yU.brandCheck(this, LU), this[Ir].blobLike.stream(...q)
        }
        arrayBuffer(...q) {
            return yU.brandCheck(this, LU), this[Ir].blobLike.arrayBuffer(...q)
        }
        slice(...q) {
            return yU.brandCheck(this, LU), this[Ir].blobLike.slice(...q)
        }
        text(...q) {
            return yU.brandCheck(this, LU), this[Ir].blobLike.text(...q)
        }
        get size() {
            return yU.brandCheck(this, LU), this[Ir].blobLike.size
        }
        get type() {
            return yU.brandCheck(this, LU), this[Ir].blobLike.type
        }
        get name() {
            return yU.brandCheck(this, LU), this[Ir].name
        }
        get lastModified() {
            return yU.brandCheck(this, LU), this[Ir].lastModified
        }
        get[Symbol.toStringTag]() {
            return "File"
        }
    }
    yU.converters.Blob = yU.interfaceConverter(Ts5);

    function ks5(q) {
        return q instanceof Vs5 || q && (typeof q.stream === "function" || typeof q.arrayBuffer === "function") && q[Symbol.toStringTag] === "File"
    }
    Jc7.exports = {
        FileLike: LU,
        isFileLike: ks5
    }
})
// @from(Ln 56112, Col 4)
qd6 = p((w_O, Dc7) => {
    var {
        isBlobLike: aX8,
        iteratorMixin: Ns5
    } = kh(), {
        kState: SV
    } = l16(), {
        kEnumerableProperty: kG6
    } = Hz(), {
        FileLike: Xc7,
        isFileLike: Es5
    } = yw1(), {
        webidl: V$
    } = lZ(), {
        File: Wc7
    } = d6("node:buffer"), Mc7 = d6("node:util"), Pc7 = globalThis.File ?? Wc7;
    class hU {
        constructor(q) {
            if (V$.util.markAsUncloneable(this), q !== void 0) throw V$.errors.conversionFailed({
                prefix: "FormData constructor",
                argument: "Argument 1",
                types: ["undefined"]
            });
            this[SV] = []
        }
        append(q, K, _ = void 0) {
            V$.brandCheck(this, hU);
            let z = "FormData.append";
            if (V$.argumentLengthCheck(arguments, 2, z), arguments.length === 3 && !aX8(K)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
            q = V$.converters.USVString(q, z, "name"), K = aX8(K) ? V$.converters.Blob(K, z, "value", {
                strict: !1
            }) : V$.converters.USVString(K, z, "value"), _ = arguments.length === 3 ? V$.converters.USVString(_, z, "filename") : void 0;
            let Y = Lw1(q, K, _);
            this[SV].push(Y)
        }
        delete(q) {
            V$.brandCheck(this, hU);
            let K = "FormData.delete";
            V$.argumentLengthCheck(arguments, 1, K), q = V$.converters.USVString(q, K, "name"), this[SV] = this[SV].filter((_) => _.name !== q)
        }
        get(q) {
            V$.brandCheck(this, hU);
            let K = "FormData.get";
            V$.argumentLengthCheck(arguments, 1, K), q = V$.converters.USVString(q, K, "name");
            let _ = this[SV].findIndex((z) => z.name === q);
            if (_ === -1) return null;
            return this[SV][_].value
        }
        getAll(q) {
            V$.brandCheck(this, hU);
            let K = "FormData.getAll";
            return V$.argumentLengthCheck(arguments, 1, K), q = V$.converters.USVString(q, K, "name"), this[SV].filter((_) => _.name === q).map((_) => _.value)
        }
        has(q) {
            V$.brandCheck(this, hU);
            let K = "FormData.has";
            return V$.argumentLengthCheck(arguments, 1, K), q = V$.converters.USVString(q, K, "name"), this[SV].findIndex((_) => _.name === q) !== -1
        }
        set(q, K, _ = void 0) {
            V$.brandCheck(this, hU);
            let z = "FormData.set";
            if (V$.argumentLengthCheck(arguments, 2, z), arguments.length === 3 && !aX8(K)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
            q = V$.converters.USVString(q, z, "name"), K = aX8(K) ? V$.converters.Blob(K, z, "name", {
                strict: !1
            }) : V$.converters.USVString(K, z, "name"), _ = arguments.length === 3 ? V$.converters.USVString(_, z, "name") : void 0;
            let Y = Lw1(q, K, _),
                A = this[SV].findIndex((O) => O.name === q);
            if (A !== -1) this[SV] = [...this[SV].slice(0, A), Y, ...this[SV].slice(A + 1).filter((O) => O.name !== q)];
            else this[SV].push(Y)
        } [Mc7.inspect.custom](q, K) {
            let _ = this[SV].reduce((Y, A) => {
                if (Y[A.name])
                    if (Array.isArray(Y[A.name])) Y[A.name].push(A.value);
                    else Y[A.name] = [Y[A.name], A.value];
                else Y[A.name] = A.value;
                return Y
            }, {
                __proto__: null
            });
            K.depth ??= q, K.colors ??= !0;
            let z = Mc7.formatWithOptions(K, _);
            return `FormData ${z.slice(z.indexOf("]")+2)}`
        }
    }
    Ns5("FormData", hU, SV, "name", "value");
    Object.defineProperties(hU.prototype, {
        append: kG6,
        delete: kG6,
        get: kG6,
        getAll: kG6,
        has: kG6,
        set: kG6,
        [Symbol.toStringTag]: {
            value: "FormData",
            configurable: !0
        }
    });

    function Lw1(q, K, _) {
        if (typeof K === "string");
        else {
            if (!Es5(K)) K = K instanceof Blob ? new Pc7([K], "blob", {
                type: K.type
            }) : new Xc7(K, "blob", {
                type: K.type
            });
            if (_ !== void 0) {
                let z = {
                    type: K.type,
                    lastModified: K.lastModified
                };
                K = K instanceof Wc7 ? new Pc7([K], _, z) : new Xc7(K, _, z)
            }
        }
        return {
            name: q,
            value: K
        }
    }
    Dc7.exports = {
        FormData: hU,
        makeEntry: Lw1
    }
})
// @from(Ln 56236, Col 4)
Vc7 = p(($_O, Tc7) => {
    var {
        isUSVString: Zc7,
        bufferToLowerCasedHeaderName: ys5
    } = Hz(), {
        utf8DecodeBytes: Ls5
    } = kh(), {
        HTTP_TOKEN_CODEPOINTS: hs5,
        isomorphicDecode: fc7
    } = qE(), {
        isFileLike: Rs5
    } = yw1(), {
        makeEntry: Ss5
    } = qd6(), sX8 = d6("node:assert"), {
        File: Cs5
    } = d6("node:buffer"), bs5 = globalThis.File ?? Cs5, Is5 = Buffer.from('form-data; name="'), Gc7 = Buffer.from("; filename"), xs5 = Buffer.from("--"), us5 = Buffer.from(`--\r
`);

    function ms5(q) {
        for (let K = 0; K < q.length; ++K)
            if ((q.charCodeAt(K) & -128) !== 0) return !1;
        return !0
    }

    function Bs5(q) {
        let K = q.length;
        if (K < 27 || K > 70) return !1;
        for (let _ = 0; _ < K; ++_) {
            let z = q.charCodeAt(_);
            if (!(z >= 48 && z <= 57 || z >= 65 && z <= 90 || z >= 97 && z <= 122 || z === 39 || z === 45 || z === 95)) return !1
        }
        return !0
    }

    function ps5(q, K) {
        sX8(K !== "failure" && K.essence === "multipart/form-data");
        let _ = K.parameters.get("boundary");
        if (_ === void 0) return "failure";
        let z = Buffer.from(`--${_}`, "utf8"),
            Y = [],
            A = {
                position: 0
            };
        while (q[A.position] === 13 && q[A.position + 1] === 10) A.position += 2;
        let O = q.length;
        while (q[O - 1] === 10 && q[O - 2] === 13) O -= 2;
        if (O !== q.length) q = q.subarray(0, O);
        while (!0) {
            if (q.subarray(A.position, A.position + z.length).equals(z)) A.position += z.length;
            else return "failure";
            if (A.position === q.length - 2 && tX8(q, xs5, A) || A.position === q.length - 4 && tX8(q, us5, A)) return Y;
            if (q[A.position] !== 13 || q[A.position + 1] !== 10) return "failure";
            A.position += 2;
            let w = Fs5(q, A);
            if (w === "failure") return "failure";
            let {
                name: $,
                filename: j,
                contentType: H,
                encoding: J
            } = w;
            A.position += 2;
            let X;
            {
                let P = q.indexOf(z.subarray(2), A.position);
                if (P === -1) return "failure";
                if (X = q.subarray(A.position, P - 4), A.position += X.length, J === "base64") X = Buffer.from(X.toString(), "base64")
            }
            if (q[A.position] !== 13 || q[A.position + 1] !== 10) return "failure";
            else A.position += 2;
            let M;
            if (j !== null) {
                if (H ??= "text/plain", !ms5(H)) H = "";
                M = new bs5([X], j, {
                    type: H
                })
            } else M = Ls5(Buffer.from(X));
            sX8(Zc7($)), sX8(typeof M === "string" && Zc7(M) || Rs5(M)), Y.push(Ss5($, M, j))
        }
    }

    function Fs5(q, K) {
        let _ = null,
            z = null,
            Y = null,
            A = null;
        while (!0) {
            if (q[K.position] === 13 && q[K.position + 1] === 10) {
                if (_ === null) return "failure";
                return {
                    name: _,
                    filename: z,
                    contentType: Y,
                    encoding: A
                }
            }
            let O = NG6((w) => w !== 10 && w !== 13 && w !== 58, q, K);
            if (O = hw1(O, !0, !0, (w) => w === 9 || w === 32), !hs5.test(O.toString())) return "failure";
            if (q[K.position] !== 58) return "failure";
            switch (K.position++, NG6((w) => w === 32 || w === 9, q, K), ys5(O)) {
                case "content-disposition": {
                    if (_ = z = null, !tX8(q, Is5, K)) return "failure";
                    if (K.position += 17, _ = vc7(q, K), _ === null) return "failure";
                    if (tX8(q, Gc7, K)) {
                        let w = K.position + Gc7.length;
                        if (q[w] === 42) K.position += 1, w += 1;
                        if (q[w] !== 61 || q[w + 1] !== 34) return "failure";
                        if (K.position += 12, z = vc7(q, K), z === null) return "failure"
                    }
                    break
                }
                case "content-type": {
                    let w = NG6(($) => $ !== 10 && $ !== 13, q, K);
                    w = hw1(w, !1, !0, ($) => $ === 9 || $ === 32), Y = fc7(w);
                    break
                }
                case "content-transfer-encoding": {
                    let w = NG6(($) => $ !== 10 && $ !== 13, q, K);
                    w = hw1(w, !1, !0, ($) => $ === 9 || $ === 32), A = fc7(w);
                    break
                }
                default:
                    NG6((w) => w !== 10 && w !== 13, q, K)
            }
            if (q[K.position] !== 13 && q[K.position + 1] !== 10) return "failure";
            else K.position += 2
        }
    }

    function vc7(q, K) {
        sX8(q[K.position - 1] === 34);
        let _ = NG6((z) => z !== 10 && z !== 13 && z !== 34, q, K);
        if (q[K.position] !== 34) return null;
        else K.position++;
        return _ = new TextDecoder().decode(_).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), _
    }

    function NG6(q, K, _) {
        let z = _.position;
        while (z < K.length && q(K[z])) ++z;
        return K.subarray(_.position, _.position = z)
    }

    function hw1(q, K, _, z) {
        let Y = 0,
            A = q.length - 1;
        if (K)
            while (Y < q.length && z(q[Y])) Y++;
        if (_)
            while (A > 0 && z(q[A])) A--;
        return Y === 0 && A === q.length - 1 ? q : q.subarray(Y, A + 1)
    }

    function tX8(q, K, _) {
        if (q.length < K.length) return !1;
        for (let z = 0; z < K.length; z++)
            if (K[z] !== q[_.position + z]) return !1;
        return !0
    }
    Tc7.exports = {
        multipartFormDataParser: ps5,
        validateBoundary: Bs5
    }
})
// @from(Ln 56401, Col 4)
LG6 = p((j_O, bc7) => {
    var Kd6 = Hz(),
        {
            ReadableStreamFrom: gs5,
            isBlobLike: kc7,
            isReadableStreamLike: Us5,
            readableStreamClose: Qs5,
            createDeferredPromise: ds5,
            fullyReadBody: cs5,
            extractMimeType: ls5,
            utf8DecodeBytes: yc7
        } = kh(),
        {
            FormData: Nc7
        } = qd6(),
        {
            kState: yG6
        } = l16(),
        {
            webidl: ns5
        } = lZ(),
        {
            Blob: is5
        } = d6("node:buffer"),
        Rw1 = d6("node:assert"),
        {
            isErrored: Lc7,
            isDisturbed: rs5
        } = d6("node:stream"),
        {
            isArrayBuffer: os5
        } = d6("node:util/types"),
        {
            serializeAMimeType: as5
        } = qE(),
        {
            multipartFormDataParser: ss5
        } = Vc7(),
        Sw1;
    try {
        let q = d6("node:crypto");
        Sw1 = (K) => q.randomInt(0, K)
    } catch {
        Sw1 = (q) => Math.floor(Math.random(q))
    }
    var eX8 = new TextEncoder;

    function ts5() {}
    var hc7 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
        Rc7;
    if (hc7) Rc7 = new FinalizationRegistry((q) => {
        let K = q.deref();
        if (K && !K.locked && !rs5(K) && !Lc7(K)) K.cancel("Response object has been garbage collected").catch(ts5)
    });

    function Sc7(q, K = !1) {
        let _ = null;
        if (q instanceof ReadableStream) _ = q;
        else if (kc7(q)) _ = q.stream();
        else _ = new ReadableStream({
            async pull($) {
                let j = typeof Y === "string" ? eX8.encode(Y) : Y;
                if (j.byteLength) $.enqueue(j);
                queueMicrotask(() => Qs5($))
            },
            start() {},
            type: "bytes"
        });
        Rw1(Us5(_));
        let z = null,
            Y = null,
            A = null,
            O = null;
        if (typeof q === "string") Y = q, O = "text/plain;charset=UTF-8";
        else if (q instanceof URLSearchParams) Y = q.toString(), O = "application/x-www-form-urlencoded;charset=UTF-8";
        else if (os5(q)) Y = new Uint8Array(q.slice());
        else if (ArrayBuffer.isView(q)) Y = new Uint8Array(q.buffer.slice(q.byteOffset, q.byteOffset + q.byteLength));
        else if (Kd6.isFormDataLike(q)) {
            let $ = `----formdata-undici-0${`${Sw1(100000000000)}`.padStart(11,"0")}`,
                j = `--${$}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
            let H = (D) => D.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
                J = (D) => D.replace(/\r?\n|\r/g, `\r
`),
                X = [],
                M = new Uint8Array([13, 10]);
            A = 0;
            let P = !1;
            for (let [D, Z] of q)
                if (typeof Z === "string") {
                    let G = eX8.encode(j + `; name="${H(J(D))}"\r
\r
${J(Z)}\r
`);
                    X.push(G), A += G.byteLength
                } else {
                    let G = eX8.encode(`${j}; name="${H(J(D))}"` + (Z.name ? `; filename="${H(Z.name)}"` : "") + `\r
Content-Type: ${Z.type||"application/octet-stream"}\r
\r
`);
                    if (X.push(G, Z, M), typeof Z.size === "number") A += G.byteLength + Z.size + M.byteLength;
                    else P = !0
                } let W = eX8.encode(`--${$}--\r
`);
            if (X.push(W), A += W.byteLength, P) A = null;
            Y = q, z = async function*() {
                for (let D of X)
                    if (D.stream) yield* D.stream();
                    else yield D
            }, O = `multipart/form-data; boundary=${$}`
        } else if (kc7(q)) {
            if (Y = q, A = q.size, q.type) O = q.type
        } else if (typeof q[Symbol.asyncIterator] === "function") {
            if (K) throw TypeError("keepalive");
            if (Kd6.isDisturbed(q) || q.locked) throw TypeError("Response body object should not be disturbed or locked");
            _ = q instanceof ReadableStream ? q : gs5(q)
        }
        if (typeof Y === "string" || Kd6.isBuffer(Y)) A = Buffer.byteLength(Y);
        if (z != null) {
            let $;
            _ = new ReadableStream({
                async start() {
                    $ = z(q)[Symbol.asyncIterator]()
                },
                async pull(j) {
                    let {
                        value: H,
                        done: J
                    } = await $.next();
                    if (J) queueMicrotask(() => {
                        j.close(), j.byobRequest?.respond(0)
                    });
                    else if (!Lc7(_)) {
                        let X = new Uint8Array(H);
                        if (X.byteLength) j.enqueue(X)
                    }
                    return j.desiredSize > 0
                },
                async cancel(j) {
                    await $.return()
                },
                type: "bytes"
            })
        }
        return [{
            stream: _,
            source: Y,
            length: A
        }, O]
    }

    function es5(q, K = !1) {
        if (q instanceof ReadableStream) Rw1(!Kd6.isDisturbed(q), "The body has already been consumed."), Rw1(!q.locked, "The stream is locked.");
        return Sc7(q, K)
    }

    function qt5(q, K) {
        let [_, z] = K.stream.tee();
        return K.stream = _, {
            stream: z,
            length: K.length,
            source: K.source
        }
    }

    function Kt5(q) {
        if (q.aborted) throw new DOMException("The operation was aborted.", "AbortError")
    }

    function _t5(q) {
        return {
            blob() {
                return EG6(this, (_) => {
                    let z = Ec7(this);
                    if (z === null) z = "";
                    else if (z) z = as5(z);
                    return new is5([_], {
                        type: z
                    })
                }, q)
            },
            arrayBuffer() {
                return EG6(this, (_) => {
                    return new Uint8Array(_).buffer
                }, q)
            },
            text() {
                return EG6(this, yc7, q)
            },
            json() {
                return EG6(this, Yt5, q)
            },
            formData() {
                return EG6(this, (_) => {
                    let z = Ec7(this);
                    if (z !== null) switch (z.essence) {
                        case "multipart/form-data": {
                            let Y = ss5(_, z);
                            if (Y === "failure") throw TypeError("Failed to parse body as FormData.");
                            let A = new Nc7;
                            return A[yG6] = Y, A
                        }
                        case "application/x-www-form-urlencoded": {
                            let Y = new URLSearchParams(_.toString()),
                                A = new Nc7;
                            for (let [O, w] of Y) A.append(O, w);
                            return A
                        }
                    }
                    throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
                }, q)
            },
            bytes() {
                return EG6(this, (_) => {
                    return new Uint8Array(_)
                }, q)
            }
        }
    }

    function zt5(q) {
        Object.assign(q.prototype, _t5(q))
    }
    async function EG6(q, K, _) {
        if (ns5.brandCheck(q, _), Cc7(q)) throw TypeError("Body is unusable: Body has already been read");
        Kt5(q[yG6]);
        let z = ds5(),
            Y = (O) => z.reject(O),
            A = (O) => {
                try {
                    z.resolve(K(O))
                } catch (w) {
                    Y(w)
                }
            };
        if (q[yG6].body == null) return A(Buffer.allocUnsafe(0)), z.promise;
        return await cs5(q[yG6].body, A, Y), z.promise
    }

    function Cc7(q) {
        let K = q[yG6].body;
        return K != null && (K.stream.locked || Kd6.isDisturbed(K.stream))
    }

    function Yt5(q) {
        return JSON.parse(yc7(q))
    }

    function Ec7(q) {
        let K = q[yG6].headersList,
            _ = ls5(K);
        if (_ === "failure") return null;
        return _
    }
    bc7.exports = {
        extractBody: Sc7,
        safelyExtractBody: es5,
        cloneBody: qt5,
        mixinBody: zt5,
        streamRegistry: Rc7,
        hasFinalizationRegistry: hc7,
        bodyUnusable: Cc7
    }
})
// @from(Ln 56665, Col 4)
cc7 = p((H_O, dc7) => {
    var f3 = d6("node:assert"),
        D9 = Hz(),
        {
            channels: Ic7
        } = PG6(),
        Cw1 = Mw1(),
        {
            RequestContentLengthMismatchError: rA6,
            ResponseContentLengthMismatchError: At5,
            RequestAbortedError: Fc7,
            HeadersTimeoutError: Ot5,
            HeadersOverflowError: wt5,
            SocketError: AM8,
            InformationalError: hG6,
            BodyTimeoutError: $t5,
            HTTPParserError: jt5,
            ResponseExceededMaxSizeError: Ht5
        } = aA(),
        {
            kUrl: gc7,
            kReset: KE,
            kClient: uw1,
            kParser: KX,
            kBlocking: Yd6,
            kRunning: Jv,
            kPending: Jt5,
            kSize: xc7,
            kWriting: i16,
            kQueue: xm,
            kNoRef: _d6,
            kKeepAliveDefaultTimeout: Xt5,
            kHostHeader: Mt5,
            kPendingIdx: Pt5,
            kRunningIdx: _b,
            kError: zb,
            kPipelining: zM8,
            kSocket: RG6,
            kKeepAliveTimeoutValue: OM8,
            kMaxHeadersSize: bw1,
            kKeepAliveMaxTimeout: Wt5,
            kKeepAliveTimeoutThreshold: Dt5,
            kHeadersTimeout: Zt5,
            kBodyTimeout: ft5,
            kStrictContentLength: mw1,
            kMaxRequests: uc7,
            kCounter: Gt5,
            kMaxResponseSize: vt5,
            kOnError: Tt5,
            kResume: n16,
            kHTTPContext: Uc7
        } = oj(),
        RU = yd7(),
        Vt5 = Buffer.alloc(0),
        qM8 = Buffer[Symbol.species],
        KM8 = D9.addListener,
        kt5 = D9.removeAllListeners,
        Iw1;
    async function Nt5() {
        let q = process.env.JEST_WORKER_ID ? Gw1() : void 0,
            K;
        try {
            K = await WebAssembly.compile(Rd7())
        } catch (_) {
            K = await WebAssembly.compile(q || Gw1())
        }
        return await WebAssembly.instantiate(K, {
            env: {
                wasm_on_url: (_, z, Y) => {
                    return 0
                },
                wasm_on_status: (_, z, Y) => {
                    f3(bW.ptr === _);
                    let A = z - CU + SU.byteOffset;
                    return bW.onStatus(new qM8(SU.buffer, A, Y)) || 0
                },
                wasm_on_message_begin: (_) => {
                    return f3(bW.ptr === _), bW.onMessageBegin() || 0
                },
                wasm_on_header_field: (_, z, Y) => {
                    f3(bW.ptr === _);
                    let A = z - CU + SU.byteOffset;
                    return bW.onHeaderField(new qM8(SU.buffer, A, Y)) || 0
                },
                wasm_on_header_value: (_, z, Y) => {
                    f3(bW.ptr === _);
                    let A = z - CU + SU.byteOffset;
                    return bW.onHeaderValue(new qM8(SU.buffer, A, Y)) || 0
                },
                wasm_on_headers_complete: (_, z, Y, A) => {
                    return f3(bW.ptr === _), bW.onHeadersComplete(z, Boolean(Y), Boolean(A)) || 0
                },
                wasm_on_body: (_, z, Y) => {
                    f3(bW.ptr === _);
                    let A = z - CU + SU.byteOffset;
                    return bW.onBody(new qM8(SU.buffer, A, Y)) || 0
                },
                wasm_on_message_complete: (_) => {
                    return f3(bW.ptr === _), bW.onMessageComplete() || 0
                }
            }
        })
    }
    var xw1 = null,
        Bw1 = Nt5();
    Bw1.catch();
    var bW = null,
        SU = null,
        _M8 = 0,
        CU = null,
        Et5 = 0,
        zd6 = 1,
        SG6 = 2 | zd6,
        YM8 = 4 | zd6,
        pw1 = 8 | Et5;
    class Qc7 {
        constructor(q, K, {
            exports: _
        }) {
            f3(Number.isFinite(q[bw1]) && q[bw1] > 0), this.llhttp = _, this.ptr = this.llhttp.llhttp_alloc(RU.TYPE.RESPONSE), this.client = q, this.socket = K, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = q[bw1], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = q[vt5]
        }
        setTimeout(q, K) {
            if (q !== this.timeoutValue || K & zd6 ^ this.timeoutType & zd6) {
                if (this.timeout) Cw1.clearTimeout(this.timeout), this.timeout = null;
                if (q)
                    if (K & zd6) this.timeout = Cw1.setFastTimeout(mc7, q, new WeakRef(this));
                    else this.timeout = setTimeout(mc7, q, new WeakRef(this)), this.timeout.unref();
                this.timeoutValue = q
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.timeoutType = K
        }
        resume() {
            if (this.socket.destroyed || !this.paused) return;
            if (f3(this.ptr != null), f3(bW == null), this.llhttp.llhttp_resume(this.ptr), f3(this.timeoutType === YM8), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            this.paused = !1, this.execute(this.socket.read() || Vt5), this.readMore()
        }
        readMore() {
            while (!this.paused && this.ptr) {
                let q = this.socket.read();
                if (q === null) break;
                this.execute(q)
            }
        }
        execute(q) {
            f3(this.ptr != null), f3(bW == null), f3(!this.paused);
            let {
                socket: K,
                llhttp: _
            } = this;
            if (q.length > _M8) {
                if (CU) _.free(CU);
                _M8 = Math.ceil(q.length / 4096) * 4096, CU = _.malloc(_M8)
            }
            new Uint8Array(_.memory.buffer, CU, _M8).set(q);
            try {
                let z;
                try {
                    SU = q, bW = this, z = _.llhttp_execute(this.ptr, CU, q.length)
                } catch (A) {
                    throw A
                } finally {
                    bW = null, SU = null
                }
                let Y = _.llhttp_get_error_pos(this.ptr) - CU;
                if (z === RU.ERROR.PAUSED_UPGRADE) this.onUpgrade(q.slice(Y));
                else if (z === RU.ERROR.PAUSED) this.paused = !0, K.unshift(q.slice(Y));
                else if (z !== RU.ERROR.OK) {
                    let A = _.llhttp_get_error_reason(this.ptr),
                        O = "";
                    if (A) {
                        let w = new Uint8Array(_.memory.buffer, A).indexOf(0);
                        O = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(_.memory.buffer, A, w).toString() + ")"
                    }
                    throw new jt5(O, RU.ERROR[z], q.slice(Y))
                }
            } catch (z) {
                D9.destroy(K, z)
            }
        }
        destroy() {
            f3(this.ptr != null), f3(bW == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && Cw1.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
        }
        onStatus(q) {
            this.statusText = q.toString()
        }
        onMessageBegin() {
            let {
                socket: q,
                client: K
            } = this;
            if (q.destroyed) return -1;
            let _ = K[xm][K[_b]];
            if (!_) return -1;
            _.onResponseStarted()
        }
        onHeaderField(q) {
            let K = this.headers.length;
            if ((K & 1) === 0) this.headers.push(q);
            else this.headers[K - 1] = Buffer.concat([this.headers[K - 1], q]);
            this.trackHeader(q.length)
        }
        onHeaderValue(q) {
            let K = this.headers.length;
            if ((K & 1) === 1) this.headers.push(q), K += 1;
            else this.headers[K - 1] = Buffer.concat([this.headers[K - 1], q]);
            let _ = this.headers[K - 2];
            if (_.length === 10) {
                let z = D9.bufferToLowerCasedHeaderName(_);
                if (z === "keep-alive") this.keepAlive += q.toString();
                else if (z === "connection") this.connection += q.toString()
            } else if (_.length === 14 && D9.bufferToLowerCasedHeaderName(_) === "content-length") this.contentLength += q.toString();
            this.trackHeader(q.length)
        }
        trackHeader(q) {
            if (this.headersSize += q, this.headersSize >= this.headersMaxSize) D9.destroy(this.socket, new wt5)
        }
        onUpgrade(q) {
            let {
                upgrade: K,
                client: _,
                socket: z,
                headers: Y,
                statusCode: A
            } = this;
            f3(K), f3(_[RG6] === z), f3(!z.destroyed), f3(!this.paused), f3((Y.length & 1) === 0);
            let O = _[xm][_[_b]];
            f3(O), f3(O.upgrade || O.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, z.unshift(q), z[KX].destroy(), z[KX] = null, z[uw1] = null, z[zb] = null, kt5(z), _[RG6] = null, _[Uc7] = null, _[xm][_[_b]++] = null, _.emit("disconnect", _[gc7], [_], new hG6("upgrade"));
            try {
                O.onUpgrade(A, Y, z)
            } catch (w) {
                D9.destroy(z, w)
            }
            _[n16]()
        }
        onHeadersComplete(q, K, _) {
            let {
                client: z,
                socket: Y,
                headers: A,
                statusText: O
            } = this;
            if (Y.destroyed) return -1;
            let w = z[xm][z[_b]];
            if (!w) return -1;
            if (f3(!this.upgrade), f3(this.statusCode < 200), q === 100) return D9.destroy(Y, new AM8("bad response", D9.getSocketInfo(Y))), -1;
            if (K && !w.upgrade) return D9.destroy(Y, new AM8("bad upgrade", D9.getSocketInfo(Y))), -1;
            if (f3(this.timeoutType === SG6), this.statusCode = q, this.shouldKeepAlive = _ || w.method === "HEAD" && !Y[KE] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
                let j = w.bodyTimeout != null ? w.bodyTimeout : z[ft5];
                this.setTimeout(j, YM8)
            } else if (this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if (w.method === "CONNECT") return f3(z[Jv] === 1), this.upgrade = !0, 2;
            if (K) return f3(z[Jv] === 1), this.upgrade = !0, 2;
            if (f3((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && z[zM8]) {
                let j = this.keepAlive ? D9.parseKeepAliveTimeout(this.keepAlive) : null;
                if (j != null) {
                    let H = Math.min(j - z[Dt5], z[Wt5]);
                    if (H <= 0) Y[KE] = !0;
                    else z[OM8] = H
                } else z[OM8] = z[Xt5]
            } else Y[KE] = !0;
            let $ = w.onHeaders(q, A, this.resume, O) === !1;
            if (w.aborted) return -1;
            if (w.method === "HEAD") return 1;
            if (q < 200) return 1;
            if (Y[Yd6]) Y[Yd6] = !1, z[n16]();
            return $ ? RU.ERROR.PAUSED : 0
        }
        onBody(q) {
            let {
                client: K,
                socket: _,
                statusCode: z,
                maxResponseSize: Y
            } = this;
            if (_.destroyed) return -1;
            let A = K[xm][K[_b]];
            if (f3(A), f3(this.timeoutType === YM8), this.timeout) {
                if (this.timeout.refresh) this.timeout.refresh()
            }
            if (f3(z >= 200), Y > -1 && this.bytesRead + q.length > Y) return D9.destroy(_, new Ht5), -1;
            if (this.bytesRead += q.length, A.onData(q) === !1) return RU.ERROR.PAUSED
        }
        onMessageComplete() {
            let {
                client: q,
                socket: K,
                statusCode: _,
                upgrade: z,
                headers: Y,
                contentLength: A,
                bytesRead: O,
                shouldKeepAlive: w
            } = this;
            if (K.destroyed && (!_ || w)) return -1;
            if (z) return;
            f3(_ >= 100), f3((this.headers.length & 1) === 0);
            let $ = q[xm][q[_b]];
            if (f3($), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, _ < 200) return;
            if ($.method !== "HEAD" && A && O !== parseInt(A, 10)) return D9.destroy(K, new At5), -1;
            if ($.onComplete(Y), q[xm][q[_b]++] = null, K[i16]) return f3(q[Jv] === 0), D9.destroy(K, new hG6("reset")), RU.ERROR.PAUSED;
            else if (!w) return D9.destroy(K, new hG6("reset")), RU.ERROR.PAUSED;
            else if (K[KE] && q[Jv] === 0) return D9.destroy(K, new hG6("reset")), RU.ERROR.PAUSED;
            else if (q[zM8] == null || q[zM8] === 1) setImmediate(() => q[n16]());
            else q[n16]()
        }
    }

    function mc7(q) {
        let {
            socket: K,
            timeoutType: _,
            client: z,
            paused: Y
        } = q.deref();
        if (_ === SG6) {
            if (!K[i16] || K.writableNeedDrain || z[Jv] > 1) f3(!Y, "cannot be paused while waiting for headers"), D9.destroy(K, new Ot5)
        } else if (_ === YM8) {
            if (!Y) D9.destroy(K, new $t5)
        } else if (_ === pw1) f3(z[Jv] === 0 && z[OM8]), D9.destroy(K, new hG6("socket idle timeout"))
    }
    async function yt5(q, K) {
        if (q[RG6] = K, !xw1) xw1 = await Bw1, Bw1 = null;
        K[_d6] = !1, K[i16] = !1, K[KE] = !1, K[Yd6] = !1, K[KX] = new Qc7(q, K, xw1), KM8(K, "error", function(z) {
            f3(z.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
            let Y = this[KX];
            if (z.code === "ECONNRESET" && Y.statusCode && !Y.shouldKeepAlive) {
                Y.onMessageComplete();
                return
            }
            this[zb] = z, this[uw1][Tt5](z)
        }), KM8(K, "readable", function() {
            let z = this[KX];
            if (z) z.readMore()
        }), KM8(K, "end", function() {
            let z = this[KX];
            if (z.statusCode && !z.shouldKeepAlive) {
                z.onMessageComplete();
                return
            }
            D9.destroy(this, new AM8("other side closed", D9.getSocketInfo(this)))
        }), KM8(K, "close", function() {
            let z = this[uw1],
                Y = this[KX];
            if (Y) {
                if (!this[zb] && Y.statusCode && !Y.shouldKeepAlive) Y.onMessageComplete();
                this[KX].destroy(), this[KX] = null
            }
            let A = this[zb] || new AM8("closed", D9.getSocketInfo(this));
            if (z[RG6] = null, z[Uc7] = null, z.destroyed) {
                f3(z[Jt5] === 0);
                let O = z[xm].splice(z[_b]);
                for (let w = 0; w < O.length; w++) {
                    let $ = O[w];
                    D9.errorRequest(z, $, A)
                }
            } else if (z[Jv] > 0 && A.code !== "UND_ERR_INFO") {
                let O = z[xm][z[_b]];
                z[xm][z[_b]++] = null, D9.errorRequest(z, O, A)
            }
            z[Pt5] = z[_b], f3(z[Jv] === 0), z.emit("disconnect", z[gc7], [z], A), z[n16]()
        });
        let _ = !1;
        return K.on("close", () => {
            _ = !0
        }), {
            version: "h1",
            defaultPipelining: 1,
            write(...z) {
                return Rt5(q, ...z)
            },
            resume() {
                Lt5(q)
            },
            destroy(z, Y) {
                if (_) queueMicrotask(Y);
                else K.destroy(z).on("close", Y)
            },
            get destroyed() {
                return K.destroyed
            },
            busy(z) {
                if (K[i16] || K[KE] || K[Yd6]) return !0;
                if (z) {
                    if (q[Jv] > 0 && !z.idempotent) return !0;
                    if (q[Jv] > 0 && (z.upgrade || z.method === "CONNECT")) return !0;
                    if (q[Jv] > 0 && D9.bodyLength(z.body) !== 0 && (D9.isStream(z.body) || D9.isAsyncIterable(z.body) || D9.isFormDataLike(z.body))) return !0
                }
                return !1
            }
        }
    }

    function Lt5(q) {
        let K = q[RG6];
        if (K && !K.destroyed) {
            if (q[xc7] === 0) {
                if (!K[_d6] && K.unref) K.unref(), K[_d6] = !0
            } else if (K[_d6] && K.ref) K.ref(), K[_d6] = !1;
            if (q[xc7] === 0) {
                if (K[KX].timeoutType !== pw1) K[KX].setTimeout(q[OM8], pw1)
            } else if (q[Jv] > 0 && K[KX].statusCode < 200) {
                if (K[KX].timeoutType !== SG6) {
                    let _ = q[xm][q[_b]],
                        z = _.headersTimeout != null ? _.headersTimeout : q[Zt5];
                    K[KX].setTimeout(z, SG6)
                }
            }
        }
    }

    function ht5(q) {
        return q !== "GET" && q !== "HEAD" && q !== "OPTIONS" && q !== "TRACE" && q !== "CONNECT"
    }

    function Rt5(q, K) {
        let {
            method: _,
            path: z,
            host: Y,
            upgrade: A,
            blocking: O,
            reset: w
        } = K, {
            body: $,
            headers: j,
            contentLength: H
        } = K, J = _ === "PUT" || _ === "POST" || _ === "PATCH" || _ === "QUERY" || _ === "PROPFIND" || _ === "PROPPATCH";
        if (D9.isFormDataLike($)) {
            if (!Iw1) Iw1 = LG6().extractBody;
            let [D, Z] = Iw1($);
            if (K.contentType == null) j.push("content-type", Z);
            $ = D.stream, H = D.length
        } else if (D9.isBlobLike($) && K.contentType == null && $.type) j.push("content-type", $.type);
        if ($ && typeof $.read === "function") $.read(0);
        let X = D9.bodyLength($);
        if (H = X ?? H, H === null) H = K.contentLength;
        if (H === 0 && !J) H = null;
        if (ht5(_) && H > 0 && K.contentLength !== null && K.contentLength !== H) {
            if (q[mw1]) return D9.errorRequest(q, K, new rA6), !1;
            process.emitWarning(new rA6)
        }
        let M = q[RG6],
            P = (D) => {
                if (K.aborted || K.completed) return;
                D9.errorRequest(q, K, D || new Fc7), D9.destroy($), D9.destroy(M, new hG6("aborted"))
            };
        try {
            K.onConnect(P)
        } catch (D) {
            D9.errorRequest(q, K, D)
        }
        if (K.aborted) return !1;
        if (_ === "HEAD") M[KE] = !0;
        if (A || _ === "CONNECT") M[KE] = !0;
        if (w != null) M[KE] = w;
        if (q[uc7] && M[Gt5]++ >= q[uc7]) M[KE] = !0;
        if (O) M[Yd6] = !0;
        let W = `${_} ${z} HTTP/1.1\r
`;
        if (typeof Y === "string") W += `host: ${Y}\r
`;
        else W += q[Mt5];
        if (A) W += `connection: upgrade\r
upgrade: ${A}\r
`;
        else if (q[zM8] && !M[KE]) W += `connection: keep-alive\r
`;
        else W += `connection: close\r
`;
        if (Array.isArray(j))
            for (let D = 0; D < j.length; D += 2) {
                let Z = j[D + 0],
                    G = j[D + 1];
                if (Array.isArray(G))
                    for (let f = 0; f < G.length; f++) W += `${Z}: ${G[f]}\r
`;
                else W += `${Z}: ${G}\r
`
            }
        if (Ic7.sendHeaders.hasSubscribers) Ic7.sendHeaders.publish({
            request: K,
            headers: W,
            socket: M
        });
        if (!$ || X === 0) Bc7(P, null, q, K, M, H, W, J);
        else if (D9.isBuffer($)) Bc7(P, $, q, K, M, H, W, J);
        else if (D9.isBlobLike($))
            if (typeof $.stream === "function") pc7(P, $.stream(), q, K, M, H, W, J);
            else Ct5(P, $, q, K, M, H, W, J);
        else if (D9.isStream($)) St5(P, $, q, K, M, H, W, J);
        else if (D9.isIterable($)) pc7(P, $, q, K, M, H, W, J);
        else f3(!1);
        return !0
    }

    function St5(q, K, _, z, Y, A, O, w) {
        f3(A !== 0 || _[Jv] === 0, "stream body cannot be pipelined");
        let $ = !1,
            j = new Fw1({
                abort: q,
                socket: Y,
                request: z,
                contentLength: A,
                client: _,
                expectsPayload: w,
                header: O
            }),
            H = function(P) {
                if ($) return;
                try {
                    if (!j.write(P) && this.pause) this.pause()
                } catch (W) {
                    D9.destroy(this, W)
                }
            },
            J = function() {
                if ($) return;
                if (K.resume) K.resume()
            },
            X = function() {
                if (queueMicrotask(() => {
                        K.removeListener("error", M)
                    }), !$) {
                    let P = new Fc7;
                    queueMicrotask(() => M(P))
                }
            },
            M = function(P) {
                if ($) return;
                if ($ = !0, f3(Y.destroyed || Y[i16] && _[Jv] <= 1), Y.off("drain", J).off("error", M), K.removeListener("data", H).removeListener("end", M).removeListener("close", X), !P) try {
                    j.end()
                } catch (W) {
                    P = W
                }
                if (j.destroy(P), P && (P.code !== "UND_ERR_INFO" || P.message !== "reset")) D9.destroy(K, P);
                else D9.destroy(K)
            };
        if (K.on("data", H).on("end", M).on("error", M).on("close", X), K.resume) K.resume();
        if (Y.on("drain", J).on("error", M), K.errorEmitted ?? K.errored) setImmediate(() => M(K.errored));
        else if (K.endEmitted ?? K.readableEnded) setImmediate(() => M(null));
        if (K.closeEmitted ?? K.closed) setImmediate(X)
    }

    function Bc7(q, K, _, z, Y, A, O, w) {
        try {
            if (!K)
                if (A === 0) Y.write(`${O}content-length: 0\r
\r
`, "latin1");
                else f3(A === null, "no body must not have content length"), Y.write(`${O}\r
`, "latin1");
            else if (D9.isBuffer(K)) {
                if (f3(A === K.byteLength, "buffer body must have content length"), Y.cork(), Y.write(`${O}content-length: ${A}\r
\r
`, "latin1"), Y.write(K), Y.uncork(), z.onBodySent(K), !w && z.reset !== !1) Y[KE] = !0
            }
            z.onRequestSent(), _[n16]()
        } catch ($) {
            q($)
        }
    }
    async function Ct5(q, K, _, z, Y, A, O, w) {
        f3(A === K.size, "blob body must have content length");
        try {
            if (A != null && A !== K.size) throw new rA6;
            let $ = Buffer.from(await K.arrayBuffer());
            if (Y.cork(), Y.write(`${O}content-length: ${A}\r
\r
`, "latin1"), Y.write($), Y.uncork(), z.onBodySent($), z.onRequestSent(), !w && z.reset !== !1) Y[KE] = !0;
            _[n16]()
        } catch ($) {
            q($)
        }
    }
    async function pc7(q, K, _, z, Y, A, O, w) {
        f3(A !== 0 || _[Jv] === 0, "iterator body cannot be pipelined");
        let $ = null;

        function j() {
            if ($) {
                let X = $;
                $ = null, X()
            }
        }
        let H = () => new Promise((X, M) => {
            if (f3($ === null), Y[zb]) M(Y[zb]);
            else $ = X
        });
        Y.on("close", j).on("drain", j);
        let J = new Fw1({
            abort: q,
            socket: Y,
            request: z,
            contentLength: A,
            client: _,
            expectsPayload: w,
            header: O
        });
        try {
            for await (let X of K) {
                if (Y[zb]) throw Y[zb];
                if (!J.write(X)) await H()
            }
            J.end()
        } catch (X) {
            J.destroy(X)
        } finally {
            Y.off("close", j).off("drain", j)
        }
    }
    class Fw1 {
        constructor({
            abort: q,
            socket: K,
            request: _,
            contentLength: z,
            client: Y,
            expectsPayload: A,
            header: O
        }) {
            this.socket = K, this.request = _, this.contentLength = z, this.client = Y, this.bytesWritten = 0, this.expectsPayload = A, this.header = O, this.abort = q, K[i16] = !0
        }
        write(q) {
            let {
                socket: K,
                request: _,
                contentLength: z,
                client: Y,
                bytesWritten: A,
                expectsPayload: O,
                header: w
            } = this;
            if (K[zb]) throw K[zb];
            if (K.destroyed) return !1;
            let $ = Buffer.byteLength(q);
            if (!$) return !0;
            if (z !== null && A + $ > z) {
                if (Y[mw1]) throw new rA6;
                process.emitWarning(new rA6)
            }
            if (K.cork(), A === 0) {
                if (!O && _.reset !== !1) K[KE] = !0;
                if (z === null) K.write(`${w}transfer-encoding: chunked\r
`, "latin1");
                else K.write(`${w}content-length: ${z}\r
\r
`, "latin1")
            }
            if (z === null) K.write(`\r
${$.toString(16)}\r
`, "latin1");
            this.bytesWritten += $;
            let j = K.write(q);
            if (K.uncork(), _.onBodySent(q), !j) {
                if (K[KX].timeout && K[KX].timeoutType === SG6) {
                    if (K[KX].timeout.refresh) K[KX].timeout.refresh()
                }
            }
            return j
        }
        end() {
            let {
                socket: q,
                contentLength: K,
                client: _,
                bytesWritten: z,
                expectsPayload: Y,
                header: A,
                request: O
            } = this;
            if (O.onRequestSent(), q[i16] = !1, q[zb]) throw q[zb];
            if (q.destroyed) return;
            if (z === 0)
                if (Y) q.write(`${A}content-length: 0\r
\r
`, "latin1");
                else q.write(`${A}\r
`, "latin1");
            else if (K === null) q.write(`\r
0\r
\r
`, "latin1");
            if (K !== null && z !== K)
                if (_[mw1]) throw new rA6;
                else process.emitWarning(new rA6);
            if (q[KX].timeout && q[KX].timeoutType === SG6) {
                if (q[KX].timeout.refresh) q[KX].timeout.refresh()
            }
            _[n16]()
        }
        destroy(q) {
            let {
                socket: K,
                client: _,
                abort: z
            } = this;
            if (K[i16] = !1, q) f3(_[Jv] <= 1, "pipeline should only contain this request"), z(q)
        }
    }
    dc7.exports = yt5
})
// @from(Ln 57372, Col 4)
tc7 = p((J_O, sc7) => {
    var Yb = d6("node:assert"),
        {
            pipeline: bt5
        } = d6("node:stream"),
        qY = Hz(),
        {
            RequestContentLengthMismatchError: gw1,
            RequestAbortedError: lc7,
            SocketError: Ad6,
            InformationalError: Uw1
        } = aA(),
        {
            kUrl: wM8,
            kReset: jM8,
            kClient: CG6,
            kRunning: HM8,
            kPending: It5,
            kQueue: r16,
            kPendingIdx: Qw1,
            kRunningIdx: um,
            kError: Bm,
            kSocket: o0,
            kStrictContentLength: xt5,
            kOnError: dw1,
            kMaxConcurrentStreams: ac7,
            kHTTP2Session: mm,
            kResume: o16,
            kSize: ut5,
            kHTTPContext: mt5
        } = oj(),
        xr = Symbol("open streams"),
        nc7, ic7 = !1,
        $M8;
    try {
        $M8 = d6("node:http2")
    } catch {
        $M8 = {
            constants: {}
        }
    }
    var {
        constants: {
            HTTP2_HEADER_AUTHORITY: Bt5,
            HTTP2_HEADER_METHOD: pt5,
            HTTP2_HEADER_PATH: Ft5,
            HTTP2_HEADER_SCHEME: gt5,
            HTTP2_HEADER_CONTENT_LENGTH: Ut5,
            HTTP2_HEADER_EXPECT: Qt5,
            HTTP2_HEADER_STATUS: dt5
        }
    } = $M8;

    function ct5(q) {
        let K = [];
        for (let [_, z] of Object.entries(q))
            if (Array.isArray(z))
                for (let Y of z) K.push(Buffer.from(_), Buffer.from(Y));
            else K.push(Buffer.from(_), Buffer.from(z));
        return K
    }
    async function lt5(q, K) {
        if (q[o0] = K, !ic7) ic7 = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
            code: "UNDICI-H2"
        });
        let _ = $M8.connect(q[wM8], {
            createConnection: () => K,
            peerMaxConcurrentStreams: q[ac7]
        });
        _[xr] = 0, _[CG6] = q, _[o0] = K, qY.addListener(_, "error", it5), qY.addListener(_, "frameError", rt5), qY.addListener(_, "end", ot5), qY.addListener(_, "goaway", at5), qY.addListener(_, "close", function() {
            let {
                [CG6]: Y
            } = this, {
                [o0]: A
            } = Y, O = this[o0][Bm] || this[Bm] || new Ad6("closed", qY.getSocketInfo(A));
            if (Y[mm] = null, Y.destroyed) {
                Yb(Y[It5] === 0);
                let w = Y[r16].splice(Y[um]);
                for (let $ = 0; $ < w.length; $++) {
                    let j = w[$];
                    qY.errorRequest(Y, j, O)
                }
            }
        }), _.unref(), q[mm] = _, K[mm] = _, qY.addListener(K, "error", function(Y) {
            Yb(Y.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[Bm] = Y, this[CG6][dw1](Y)
        }), qY.addListener(K, "end", function() {
            qY.destroy(this, new Ad6("other side closed", qY.getSocketInfo(this)))
        }), qY.addListener(K, "close", function() {
            let Y = this[Bm] || new Ad6("closed", qY.getSocketInfo(this));
            if (q[o0] = null, this[mm] != null) this[mm].destroy(Y);
            q[Qw1] = q[um], Yb(q[HM8] === 0), q.emit("disconnect", q[wM8], [q], Y), q[o16]()
        });
        let z = !1;
        return K.on("close", () => {
            z = !0
        }), {
            version: "h2",
            defaultPipelining: 1 / 0,
            write(...Y) {
                return tt5(q, ...Y)
            },
            resume() {
                nt5(q)
            },
            destroy(Y, A) {
                if (z) queueMicrotask(A);
                else K.destroy(Y).on("close", A)
            },
            get destroyed() {
                return K.destroyed
            },
            busy() {
                return !1
            }
        }
    }

    function nt5(q) {
        let K = q[o0];
        if (K?.destroyed === !1)
            if (q[ut5] === 0 && q[ac7] === 0) K.unref(), q[mm].unref();
            else K.ref(), q[mm].ref()
    }

    function it5(q) {
        Yb(q.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[o0][Bm] = q, this[CG6][dw1](q)
    }

    function rt5(q, K, _) {
        if (_ === 0) {
            let z = new Uw1(`HTTP/2: "frameError" received - type ${q}, code ${K}`);
            this[o0][Bm] = z, this[CG6][dw1](z)
        }
    }

    function ot5() {
        let q = new Ad6("other side closed", qY.getSocketInfo(this[o0]));
        this.destroy(q), qY.destroy(this[o0], q)
    }

    function at5(q) {
        let K = this[Bm] || new Ad6(`HTTP/2: "GOAWAY" frame received with code ${q}`, qY.getSocketInfo(this)),
            _ = this[CG6];
        if (_[o0] = null, _[mt5] = null, this[mm] != null) this[mm].destroy(K), this[mm] = null;
        if (qY.destroy(this[o0], K), _[um] < _[r16].length) {
            let z = _[r16][_[um]];
            _[r16][_[um]++] = null, qY.errorRequest(_, z, K), _[Qw1] = _[um]
        }
        Yb(_[HM8] === 0), _.emit("disconnect", _[wM8], [_], K), _[o16]()
    }

    function st5(q) {
        return q !== "GET" && q !== "HEAD" && q !== "OPTIONS" && q !== "TRACE" && q !== "CONNECT"
    }

    function tt5(q, K) {
        let _ = q[mm],
            {
                method: z,
                path: Y,
                host: A,
                upgrade: O,
                expectContinue: w,
                signal: $,
                headers: j
            } = K,
            {
                body: H
            } = K;
        if (O) return qY.errorRequest(q, K, Error("Upgrade not supported for H2")), !1;
        let J = {};
        for (let v = 0; v < j.length; v += 2) {
            let V = j[v + 0],
                k = j[v + 1];
            if (Array.isArray(k))
                for (let N = 0; N < k.length; N++)
                    if (J[V]) J[V] += `,${k[N]}`;
                    else J[V] = k[N];
            else J[V] = k
        }
        let X, {
            hostname: M,
            port: P
        } = q[wM8];
        J[Bt5] = A || `${M}${P?`:${P}`:""}`, J[pt5] = z;
        let W = (v) => {
            if (K.aborted || K.completed) return;
            if (v = v || new lc7, qY.errorRequest(q, K, v), X != null) qY.destroy(X, v);
            qY.destroy(H, v), q[r16][q[um]++] = null, q[o16]()
        };
        try {
            K.onConnect(W)
        } catch (v) {
            qY.errorRequest(q, K, v)
        }
        if (K.aborted) return !1;
        if (z === "CONNECT") {
            if (_.ref(), X = _.request(J, {
                    endStream: !1,
                    signal: $
                }), X.id && !X.pending) K.onUpgrade(null, null, X), ++_[xr], q[r16][q[um]++] = null;
            else X.once("ready", () => {
                K.onUpgrade(null, null, X), ++_[xr], q[r16][q[um]++] = null
            });
            return X.once("close", () => {
                if (_[xr] -= 1, _[xr] === 0) _.unref()
            }), !0
        }
        J[Ft5] = Y, J[gt5] = "https";
        let D = z === "PUT" || z === "POST" || z === "PATCH";
        if (H && typeof H.read === "function") H.read(0);
        let Z = qY.bodyLength(H);
        if (qY.isFormDataLike(H)) {
            nc7 ??= LG6().extractBody;
            let [v, V] = nc7(H);
            J["content-type"] = V, H = v.stream, Z = v.length
        }
        if (Z == null) Z = K.contentLength;
        if (Z === 0 || !D) Z = null;
        if (st5(z) && Z > 0 && K.contentLength != null && K.contentLength !== Z) {
            if (q[xt5]) return qY.errorRequest(q, K, new gw1), !1;
            process.emitWarning(new gw1)
        }
        if (Z != null) Yb(H, "no body must not have content length"), J[Ut5] = `${Z}`;
        _.ref();
        let G = z === "GET" || z === "HEAD" || H === null;
        if (w) J[Qt5] = "100-continue", X = _.request(J, {
            endStream: G,
            signal: $
        }), X.once("continue", f);
        else X = _.request(J, {
            endStream: G,
            signal: $
        }), f();
        return ++_[xr], X.once("response", (v) => {
            let {
                [dt5]: V, ...k
            } = v;
            if (K.onResponseStarted(), K.aborted) {
                let N = new lc7;
                qY.errorRequest(q, K, N), qY.destroy(X, N);
                return
            }
            if (K.onHeaders(Number(V), ct5(k), X.resume.bind(X), "") === !1) X.pause();
            X.on("data", (N) => {
                if (K.onData(N) === !1) X.pause()
            })
        }), X.once("end", () => {
            if (X.state?.state == null || X.state.state < 6) K.onComplete([]);
            if (_[xr] === 0) _.unref();
            W(new Uw1("HTTP/2: stream half-closed (remote)")), q[r16][q[um]++] = null, q[Qw1] = q[um], q[o16]()
        }), X.once("close", () => {
            if (_[xr] -= 1, _[xr] === 0) _.unref()
        }), X.once("error", function(v) {
            W(v)
        }), X.once("frameError", (v, V) => {
            W(new Uw1(`HTTP/2: "frameError" received - type ${v}, code ${V}`))
        }), !0;

        function f() {
            if (!H || Z === 0) rc7(W, X, null, q, K, q[o0], Z, D);
            else if (qY.isBuffer(H)) rc7(W, X, H, q, K, q[o0], Z, D);
            else if (qY.isBlobLike(H))
                if (typeof H.stream === "function") oc7(W, X, H.stream(), q, K, q[o0], Z, D);
                else qe5(W, X, H, q, K, q[o0], Z, D);
            else if (qY.isStream(H)) et5(W, q[o0], D, X, H, q, K, Z);
            else if (qY.isIterable(H)) oc7(W, X, H, q, K, q[o0], Z, D);
            else Yb(!1)
        }
    }

    function rc7(q, K, _, z, Y, A, O, w) {
        try {
            if (_ != null && qY.isBuffer(_)) Yb(O === _.byteLength, "buffer body must have content length"), K.cork(), K.write(_), K.uncork(), K.end(), Y.onBodySent(_);
            if (!w) A[jM8] = !0;
            Y.onRequestSent(), z[o16]()
        } catch ($) {
            q($)
        }
    }

    function et5(q, K, _, z, Y, A, O, w) {
        Yb(w !== 0 || A[HM8] === 0, "stream body cannot be pipelined");
        let $ = bt5(Y, z, (H) => {
            if (H) qY.destroy($, H), q(H);
            else {
                if (qY.removeAllListeners($), O.onRequestSent(), !_) K[jM8] = !0;
                A[o16]()
            }
        });
        qY.addListener($, "data", j);

        function j(H) {
            O.onBodySent(H)
        }
    }
    async function qe5(q, K, _, z, Y, A, O, w) {
        Yb(O === _.size, "blob body must have content length");
        try {
            if (O != null && O !== _.size) throw new gw1;
            let $ = Buffer.from(await _.arrayBuffer());
            if (K.cork(), K.write($), K.uncork(), K.end(), Y.onBodySent($), Y.onRequestSent(), !w) A[jM8] = !0;
            z[o16]()
        } catch ($) {
            q($)
        }
    }
    async function oc7(q, K, _, z, Y, A, O, w) {
        Yb(O !== 0 || z[HM8] === 0, "iterator body cannot be pipelined");
        let $ = null;

        function j() {
            if ($) {
                let J = $;
                $ = null, J()
            }
        }
        let H = () => new Promise((J, X) => {
            if (Yb($ === null), A[Bm]) X(A[Bm]);
            else $ = J
        });
        K.on("close", j).on("drain", j);
        try {
            for await (let J of _) {
                if (A[Bm]) throw A[Bm];
                let X = K.write(J);
                if (Y.onBodySent(J), !X) await H()
            }
            if (K.end(), Y.onRequestSent(), !w) A[jM8] = !0;
            z[o16]()
        } catch (J) {
            q(J)
        } finally {
            K.off("close", j).off("drain", j)
        }
    }
    sc7.exports = lt5
})
// @from(Ln 57710, Col 4)
JM8 = p((X_O, _l7) => {
    var bU = Hz(),
        {
            kBodyUsed: Od6
        } = oj(),
        lw1 = d6("node:assert"),
        {
            InvalidArgumentError: Ke5
        } = aA(),
        _e5 = d6("node:events"),
        ze5 = [300, 301, 302, 303, 307, 308],
        ec7 = Symbol("body");
    class cw1 {
        constructor(q) {
            this[ec7] = q, this[Od6] = !1
        }
        async * [Symbol.asyncIterator]() {
            lw1(!this[Od6], "disturbed"), this[Od6] = !0, yield* this[ec7]
        }
    }
    class Kl7 {
        constructor(q, K, _, z) {
            if (K != null && (!Number.isInteger(K) || K < 0)) throw new Ke5("maxRedirections must be a positive number");
            if (bU.validateHandler(z, _.method, _.upgrade), this.dispatch = q, this.location = null, this.abort = null, this.opts = {
                    ..._,
                    maxRedirections: 0
                }, this.maxRedirections = K, this.handler = z, this.history = [], this.redirectionLimitReached = !1, bU.isStream(this.opts.body)) {
                if (bU.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function() {
                    lw1(!1)
                });
                if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[Od6] = !1, _e5.prototype.on.call(this.opts.body, "data", function() {
                    this[Od6] = !0
                })
            } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new cw1(this.opts.body);
            else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && bU.isIterable(this.opts.body)) this.opts.body = new cw1(this.opts.body)
        }
        onConnect(q) {
            this.abort = q, this.handler.onConnect(q, {
                history: this.history
            })
        }
        onUpgrade(q, K, _) {
            this.handler.onUpgrade(q, K, _)
        }
        onError(q) {
            this.handler.onError(q)
        }
        onHeaders(q, K, _, z) {
            if (this.location = this.history.length >= this.maxRedirections || bU.isDisturbed(this.opts.body) ? null : Ye5(q, K), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
                if (this.request) this.request.abort(Error("max redirects"));
                this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
                return
            }
            if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
            if (!this.location) return this.handler.onHeaders(q, K, _, z);
            let {
                origin: Y,
                pathname: A,
                search: O
            } = bU.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), w = O ? `${A}${O}` : A;
            if (this.opts.headers = Ae5(this.opts.headers, q === 303, this.opts.origin !== Y), this.opts.path = w, this.opts.origin = Y, this.opts.maxRedirections = 0, this.opts.query = null, q === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
        }
        onData(q) {
            if (this.location);
            else return this.handler.onData(q)
        }
        onComplete(q) {
            if (this.location) this.location = null, this.abort = null, this.dispatch(this.opts, this);
            else this.handler.onComplete(q)
        }
        onBodySent(q) {
            if (this.handler.onBodySent) this.handler.onBodySent(q)
        }
    }

    function Ye5(q, K) {
        if (ze5.indexOf(q) === -1) return null;
        for (let _ = 0; _ < K.length; _ += 2)
            if (K[_].length === 8 && bU.headerNameToString(K[_]) === "location") return K[_ + 1]
    }

    function ql7(q, K, _) {
        if (q.length === 4) return bU.headerNameToString(q) === "host";
        if (K && bU.headerNameToString(q).startsWith("content-")) return !0;
        if (_ && (q.length === 13 || q.length === 6 || q.length === 19)) {
            let z = bU.headerNameToString(q);
            return z === "authorization" || z === "cookie" || z === "proxy-authorization"
        }
        return !1
    }

    function Ae5(q, K, _) {
        let z = [];
        if (Array.isArray(q)) {
            for (let Y = 0; Y < q.length; Y += 2)
                if (!ql7(q[Y], K, _)) z.push(q[Y], q[Y + 1])
        } else if (q && typeof q === "object") {
            for (let Y of Object.keys(q))
                if (!ql7(Y, K, _)) z.push(Y, q[Y])
        } else lw1(q == null, "headers must be an object or an array");
        return z
    }
    _l7.exports = Kl7
})
// @from(Ln 57814, Col 4)
XM8 = p((M_O, zl7) => {
    var Oe5 = JM8();

    function we5({
        maxRedirections: q
    }) {
        return (K) => {
            return function(z, Y) {
                let {
                    maxRedirections: A = q
                } = z;
                if (!A) return K(z, Y);
                let O = new Oe5(K, A, z, Y);
                return z = {
                    ...z,
                    maxRedirections: 0
                }, K(z, O)
            }
        }
    }
    zl7.exports = we5
})