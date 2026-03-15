
// @from(Ln 60103, Col 4)
ixA = x((yO_, lxA) => {
    var {
        kState: dH6,
        kError: Ma1,
        kResult: FxA,
        kAborted: Ph6,
        kLastProgressEventFired: Da1
    } = Ja1(), {
        ProgressEvent: dBK
    } = mxA(), {
        getEncoding: pxA
    } = gxA(), {
        serializeAMimeType: cBK,
        parseMIMEType: QxA
    } = hT(), {
        types: lBK
    } = x6("node:util"), {
        StringDecoder: UxA
    } = x6("string_decoder"), {
        btoa: dxA
    } = x6("node:buffer"), iBK = {
        enumerable: !0,
        writable: !1,
        configurable: !1
    };

    function nBK(A, q, K, Y) {
        if (A[dH6] === "loading") throw new DOMException("Invalid state", "InvalidStateError");
        A[dH6] = "loading", A[FxA] = null, A[Ma1] = null;
        let _ = q.stream().getReader(),
            w = [],
            O = _.read(),
            $ = !0;
        (async () => {
            while (!A[Ph6]) try {
                let {
                    done: H,
                    value: j
                } = await O;
                if ($ && !A[Ph6]) queueMicrotask(() => {
                    xr("loadstart", A)
                });
                if ($ = !1, !H && lBK.isUint8Array(j)) {
                    if (w.push(j), (A[Da1] === void 0 || Date.now() - A[Da1] >= 50) && !A[Ph6]) A[Da1] = Date.now(), queueMicrotask(() => {
                        xr("progress", A)
                    });
                    O = _.read()
                } else if (H) {
                    queueMicrotask(() => {
                        A[dH6] = "done";
                        try {
                            let J = rBK(w, K, q.type, Y);
                            if (A[Ph6]) return;
                            A[FxA] = J, xr("load", A)
                        } catch (J) {
                            A[Ma1] = J, xr("error", A)
                        }
                        if (A[dH6] !== "loading") xr("loadend", A)
                    });
                    break
                }
            } catch (H) {
                if (A[Ph6]) return;
                queueMicrotask(() => {
                    if (A[dH6] = "done", A[Ma1] = H, xr("error", A), A[dH6] !== "loading") xr("loadend", A)
                });
                break
            }
        })()
    }

    function xr(A, q) {
        let K = new dBK(A, {
            bubbles: !1,
            cancelable: !1
        });
        q.dispatchEvent(K)
    }

    function rBK(A, q, K, Y) {
        switch (q) {
            case "DataURL": {
                let z = "data:",
                    _ = QxA(K || "application/octet-stream");
                if (_ !== "failure") z += cBK(_);
                z += ";base64,";
                let w = new UxA("latin1");
                for (let O of A) z += dxA(w.write(O));
                return z += dxA(w.end()), z
            }
            case "Text": {
                let z = "failure";
                if (Y) z = pxA(Y);
                if (z === "failure" && K) {
                    let _ = QxA(K);
                    if (_ !== "failure") z = pxA(_.parameters.get("charset"))
                }
                if (z === "failure") z = "UTF-8";
                return oBK(A, z)
            }
            case "ArrayBuffer":
                return cxA(A).buffer;
            case "BinaryString": {
                let z = "",
                    _ = new UxA("latin1");
                for (let w of A) z += _.write(w);
                return z += _.end(), z
            }
        }
    }

    function oBK(A, q) {
        let K = cxA(A),
            Y = aBK(K),
            z = 0;
        if (Y !== null) q = Y, z = Y === "UTF-8" ? 3 : 2;
        let _ = K.slice(z);
        return new TextDecoder(q).decode(_)
    }

    function aBK(A) {
        let [q, K, Y] = A;
        if (q === 239 && K === 187 && Y === 191) return "UTF-8";
        else if (q === 254 && K === 255) return "UTF-16BE";
        else if (q === 255 && K === 254) return "UTF-16LE";
        return null
    }

    function cxA(A) {
        let q = A.reduce((Y, z) => {
                return Y + z.byteLength
            }, 0),
            K = 0;
        return A.reduce((Y, z) => {
            return Y.set(z, K), K += z.byteLength, Y
        }, new Uint8Array(q))
    }
    lxA.exports = {
        staticPropertyDescriptors: iBK,
        readOperation: nBK,
        fireAProgressEvent: xr
    }
})
// @from(Ln 60246, Col 4)
axA = x((LO_, oxA) => {
    var {
        staticPropertyDescriptors: cH6,
        readOperation: P41,
        fireAProgressEvent: nxA
    } = ixA(), {
        kState: d76,
        kError: rxA,
        kResult: W41,
        kEvents: Bz,
        kAborted: sBK
    } = Ja1(), {
        webidl: z2
    } = vP(), {
        kEnumerableProperty: IT
    } = Y9();
    class S_ extends EventTarget {
        constructor() {
            super();
            this[d76] = "empty", this[W41] = null, this[rxA] = null, this[Bz] = {
                loadend: null,
                error: null,
                abort: null,
                load: null,
                progress: null,
                loadstart: null
            }
        }
        readAsArrayBuffer(A) {
            z2.brandCheck(this, S_), z2.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), A = z2.converters.Blob(A, {
                strict: !1
            }), P41(this, A, "ArrayBuffer")
        }
        readAsBinaryString(A) {
            z2.brandCheck(this, S_), z2.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), A = z2.converters.Blob(A, {
                strict: !1
            }), P41(this, A, "BinaryString")
        }
        readAsText(A, q = void 0) {
            if (z2.brandCheck(this, S_), z2.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), A = z2.converters.Blob(A, {
                    strict: !1
                }), q !== void 0) q = z2.converters.DOMString(q, "FileReader.readAsText", "encoding");
            P41(this, A, "Text", q)
        }
        readAsDataURL(A) {
            z2.brandCheck(this, S_), z2.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), A = z2.converters.Blob(A, {
                strict: !1
            }), P41(this, A, "DataURL")
        }
        abort() {
            if (this[d76] === "empty" || this[d76] === "done") {
                this[W41] = null;
                return
            }
            if (this[d76] === "loading") this[d76] = "done", this[W41] = null;
            if (this[sBK] = !0, nxA("abort", this), this[d76] !== "loading") nxA("loadend", this)
        }
        get readyState() {
            switch (z2.brandCheck(this, S_), this[d76]) {
                case "empty":
                    return this.EMPTY;
                case "loading":
                    return this.LOADING;
                case "done":
                    return this.DONE
            }
        }
        get result() {
            return z2.brandCheck(this, S_), this[W41]
        }
        get error() {
            return z2.brandCheck(this, S_), this[rxA]
        }
        get onloadend() {
            return z2.brandCheck(this, S_), this[Bz].loadend
        }
        set onloadend(A) {
            if (z2.brandCheck(this, S_), this[Bz].loadend) this.removeEventListener("loadend", this[Bz].loadend);
            if (typeof A === "function") this[Bz].loadend = A, this.addEventListener("loadend", A);
            else this[Bz].loadend = null
        }
        get onerror() {
            return z2.brandCheck(this, S_), this[Bz].error
        }
        set onerror(A) {
            if (z2.brandCheck(this, S_), this[Bz].error) this.removeEventListener("error", this[Bz].error);
            if (typeof A === "function") this[Bz].error = A, this.addEventListener("error", A);
            else this[Bz].error = null
        }
        get onloadstart() {
            return z2.brandCheck(this, S_), this[Bz].loadstart
        }
        set onloadstart(A) {
            if (z2.brandCheck(this, S_), this[Bz].loadstart) this.removeEventListener("loadstart", this[Bz].loadstart);
            if (typeof A === "function") this[Bz].loadstart = A, this.addEventListener("loadstart", A);
            else this[Bz].loadstart = null
        }
        get onprogress() {
            return z2.brandCheck(this, S_), this[Bz].progress
        }
        set onprogress(A) {
            if (z2.brandCheck(this, S_), this[Bz].progress) this.removeEventListener("progress", this[Bz].progress);
            if (typeof A === "function") this[Bz].progress = A, this.addEventListener("progress", A);
            else this[Bz].progress = null
        }
        get onload() {
            return z2.brandCheck(this, S_), this[Bz].load
        }
        set onload(A) {
            if (z2.brandCheck(this, S_), this[Bz].load) this.removeEventListener("load", this[Bz].load);
            if (typeof A === "function") this[Bz].load = A, this.addEventListener("load", A);
            else this[Bz].load = null
        }
        get onabort() {
            return z2.brandCheck(this, S_), this[Bz].abort
        }
        set onabort(A) {
            if (z2.brandCheck(this, S_), this[Bz].abort) this.removeEventListener("abort", this[Bz].abort);
            if (typeof A === "function") this[Bz].abort = A, this.addEventListener("abort", A);
            else this[Bz].abort = null
        }
    }
    S_.EMPTY = S_.prototype.EMPTY = 0;
    S_.LOADING = S_.prototype.LOADING = 1;
    S_.DONE = S_.prototype.DONE = 2;
    Object.defineProperties(S_.prototype, {
        EMPTY: cH6,
        LOADING: cH6,
        DONE: cH6,
        readAsArrayBuffer: IT,
        readAsBinaryString: IT,
        readAsText: IT,
        readAsDataURL: IT,
        abort: IT,
        readyState: IT,
        result: IT,
        error: IT,
        onloadstart: IT,
        onprogress: IT,
        onload: IT,
        onabort: IT,
        onerror: IT,
        onloadend: IT,
        [Symbol.toStringTag]: {
            value: "FileReader",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(S_, {
        EMPTY: cH6,
        LOADING: cH6,
        DONE: cH6
    });
    oxA.exports = {
        FileReader: S_
    }
})
// @from(Ln 60405, Col 4)
Z41 = x((RO_, sxA) => {
    sxA.exports = {
        kConstruct: UO().kConstruct
    }
})
// @from(Ln 60410, Col 4)
AuA = x((hO_, exA) => {
    var tBK = x6("node:assert"),
        {
            URLSerializer: txA
        } = hT(),
        {
            isValidHeaderName: eBK
        } = SV();

    function AgK(A, q, K = !1) {
        let Y = txA(A, K),
            z = txA(q, K);
        return Y === z
    }

    function qgK(A) {
        tBK(A !== null);
        let q = [];
        for (let K of A.split(","))
            if (K = K.trim(), eBK(K)) q.push(K);
        return q
    }
    exA.exports = {
        urlEquals: AgK,
        getFieldValues: qgK
    }
})
// @from(Ln 60437, Col 4)
YuA = x((SO_, KuA) => {
    var {
        kConstruct: KgK
    } = Z41(), {
        urlEquals: YgK,
        getFieldValues: Xa1
    } = AuA(), {
        kEnumerableProperty: c76,
        isDisturbed: zgK
    } = Y9(), {
        webidl: dq
    } = vP(), {
        Response: _gK,
        cloneResponse: wgK,
        fromInnerResponse: OgK
    } = Jh6(), {
        Request: $Q,
        fromInnerRequest: $gK
    } = UH6(), {
        kState: cS
    } = Nr(), {
        fetching: HgK
    } = Dh6(), {
        urlIsHttpHttpsScheme: G41,
        createDeferredPromise: lH6,
        readAllBytes: jgK
    } = SV(), Pa1 = x6("node:assert");
    class Ju {
        #A;
        constructor() {
            if (arguments[0] !== KgK) dq.illegalConstructor();
            dq.util.markAsUncloneable(this), this.#A = arguments[1]
        }
        async match(A, q = {}) {
            dq.brandCheck(this, Ju);
            let K = "Cache.match";
            dq.argumentLengthCheck(arguments, 1, K), A = dq.converters.RequestInfo(A, K, "request"), q = dq.converters.CacheQueryOptions(q, K, "options");
            let Y = this.#Y(A, q, 1);
            if (Y.length === 0) return;
            return Y[0]
        }
        async matchAll(A = void 0, q = {}) {
            dq.brandCheck(this, Ju);
            let K = "Cache.matchAll";
            if (A !== void 0) A = dq.converters.RequestInfo(A, K, "request");
            return q = dq.converters.CacheQueryOptions(q, K, "options"), this.#Y(A, q)
        }
        async add(A) {
            dq.brandCheck(this, Ju);
            let q = "Cache.add";
            dq.argumentLengthCheck(arguments, 1, q), A = dq.converters.RequestInfo(A, q, "request");
            let K = [A];
            return await this.addAll(K)
        }
        async addAll(A) {
            dq.brandCheck(this, Ju);
            let q = "Cache.addAll";
            dq.argumentLengthCheck(arguments, 1, q);
            let K = [],
                Y = [];
            for (let J of A) {
                if (J === void 0) throw dq.errors.conversionFailed({
                    prefix: q,
                    argument: "Argument 1",
                    types: ["undefined is not allowed"]
                });
                if (J = dq.converters.RequestInfo(J), typeof J === "string") continue;
                let M = J[cS];
                if (!G41(M.url) || M.method !== "GET") throw dq.errors.exception({
                    header: q,
                    message: "Expected http/s scheme when method is not GET."
                })
            }
            let z = [];
            for (let J of A) {
                let M = new $Q(J)[cS];
                if (!G41(M.url)) throw dq.errors.exception({
                    header: q,
                    message: "Expected http/s scheme."
                });
                M.initiator = "fetch", M.destination = "subresource", Y.push(M);
                let D = lH6();
                z.push(HgK({
                    request: M,
                    processResponse(X) {
                        if (X.type === "error" || X.status === 206 || X.status < 200 || X.status > 299) D.reject(dq.errors.exception({
                            header: "Cache.addAll",
                            message: "Received an invalid status code or the request failed."
                        }));
                        else if (X.headersList.contains("vary")) {
                            let P = Xa1(X.headersList.get("vary"));
                            for (let W of P)
                                if (W === "*") {
                                    D.reject(dq.errors.exception({
                                        header: "Cache.addAll",
                                        message: "invalid vary field value"
                                    }));
                                    for (let Z of z) Z.abort();
                                    return
                                }
                        }
                    },
                    processResponseEndOfBody(X) {
                        if (X.aborted) {
                            D.reject(new DOMException("aborted", "AbortError"));
                            return
                        }
                        D.resolve(X)
                    }
                })), K.push(D.promise)
            }
            let w = await Promise.all(K),
                O = [],
                $ = 0;
            for (let J of w) {
                let M = {
                    type: "put",
                    request: Y[$],
                    response: J
                };
                O.push(M), $++
            }
            let H = lH6(),
                j = null;
            try {
                this.#q(O)
            } catch (J) {
                j = J
            }
            return queueMicrotask(() => {
                if (j === null) H.resolve(void 0);
                else H.reject(j)
            }), H.promise
        }
        async put(A, q) {
            dq.brandCheck(this, Ju);
            let K = "Cache.put";
            dq.argumentLengthCheck(arguments, 2, K), A = dq.converters.RequestInfo(A, K, "request"), q = dq.converters.Response(q, K, "response");
            let Y = null;
            if (A instanceof $Q) Y = A[cS];
            else Y = new $Q(A)[cS];
            if (!G41(Y.url) || Y.method !== "GET") throw dq.errors.exception({
                header: K,
                message: "Expected an http/s scheme when method is not GET"
            });
            let z = q[cS];
            if (z.status === 206) throw dq.errors.exception({
                header: K,
                message: "Got 206 status"
            });
            if (z.headersList.contains("vary")) {
                let M = Xa1(z.headersList.get("vary"));
                for (let D of M)
                    if (D === "*") throw dq.errors.exception({
                        header: K,
                        message: "Got * vary field value"
                    })
            }
            if (z.body && (zgK(z.body.stream) || z.body.stream.locked)) throw dq.errors.exception({
                header: K,
                message: "Response body is locked or disturbed"
            });
            let _ = wgK(z),
                w = lH6();
            if (z.body != null) {
                let D = z.body.stream.getReader();
                jgK(D).then(w.resolve, w.reject)
            } else w.resolve(void 0);
            let O = [],
                $ = {
                    type: "put",
                    request: Y,
                    response: _
                };
            O.push($);
            let H = await w.promise;
            if (_.body != null) _.body.source = H;
            let j = lH6(),
                J = null;
            try {
                this.#q(O)
            } catch (M) {
                J = M
            }
            return queueMicrotask(() => {
                if (J === null) j.resolve();
                else j.reject(J)
            }), j.promise
        }
        async delete(A, q = {}) {
            dq.brandCheck(this, Ju);
            let K = "Cache.delete";
            dq.argumentLengthCheck(arguments, 1, K), A = dq.converters.RequestInfo(A, K, "request"), q = dq.converters.CacheQueryOptions(q, K, "options");
            let Y = null;
            if (A instanceof $Q) {
                if (Y = A[cS], Y.method !== "GET" && !q.ignoreMethod) return !1
            } else Pa1(typeof A === "string"), Y = new $Q(A)[cS];
            let z = [],
                _ = {
                    type: "delete",
                    request: Y,
                    options: q
                };
            z.push(_);
            let w = lH6(),
                O = null,
                $;
            try {
                $ = this.#q(z)
            } catch (H) {
                O = H
            }
            return queueMicrotask(() => {
                if (O === null) w.resolve(!!$?.length);
                else w.reject(O)
            }), w.promise
        }
        async keys(A = void 0, q = {}) {
            dq.brandCheck(this, Ju);
            let K = "Cache.keys";
            if (A !== void 0) A = dq.converters.RequestInfo(A, K, "request");
            q = dq.converters.CacheQueryOptions(q, K, "options");
            let Y = null;
            if (A !== void 0) {
                if (A instanceof $Q) {
                    if (Y = A[cS], Y.method !== "GET" && !q.ignoreMethod) return []
                } else if (typeof A === "string") Y = new $Q(A)[cS]
            }
            let z = lH6(),
                _ = [];
            if (A === void 0)
                for (let w of this.#A) _.push(w[0]);
            else {
                let w = this.#K(Y, q);
                for (let O of w) _.push(O[0])
            }
            return queueMicrotask(() => {
                let w = [];
                for (let O of _) {
                    let $ = $gK(O, new AbortController().signal, "immutable");
                    w.push($)
                }
                z.resolve(Object.freeze(w))
            }), z.promise
        }
        #q(A) {
            let q = this.#A,
                K = [...q],
                Y = [],
                z = [];
            try {
                for (let _ of A) {
                    if (_.type !== "delete" && _.type !== "put") throw dq.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: 'operation type does not match "delete" or "put"'
                    });
                    if (_.type === "delete" && _.response != null) throw dq.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: "delete operation should not have an associated response"
                    });
                    if (this.#K(_.request, _.options, Y).length) throw new DOMException("???", "InvalidStateError");
                    let w;
                    if (_.type === "delete") {
                        if (w = this.#K(_.request, _.options), w.length === 0) return [];
                        for (let O of w) {
                            let $ = q.indexOf(O);
                            Pa1($ !== -1), q.splice($, 1)
                        }
                    } else if (_.type === "put") {
                        if (_.response == null) throw dq.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "put operation should have an associated response"
                        });
                        let O = _.request;
                        if (!G41(O.url)) throw dq.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "expected http or https scheme"
                        });
                        if (O.method !== "GET") throw dq.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "not get method"
                        });
                        if (_.options != null) throw dq.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "options must not be defined"
                        });
                        w = this.#K(_.request);
                        for (let $ of w) {
                            let H = q.indexOf($);
                            Pa1(H !== -1), q.splice(H, 1)
                        }
                        q.push([_.request, _.response]), Y.push([_.request, _.response])
                    }
                    z.push([_.request, _.response])
                }
                return z
            } catch (_) {
                throw this.#A.length = 0, this.#A = K, _
            }
        }
        #K(A, q, K) {
            let Y = [],
                z = K ?? this.#A;
            for (let _ of z) {
                let [w, O] = _;
                if (this.#z(A, w, O, q)) Y.push(_)
            }
            return Y
        }
        #z(A, q, K = null, Y) {
            let z = new URL(A.url),
                _ = new URL(q.url);
            if (Y?.ignoreSearch) _.search = "", z.search = "";
            if (!YgK(z, _, !0)) return !1;
            if (K == null || Y?.ignoreVary || !K.headersList.contains("vary")) return !0;
            let w = Xa1(K.headersList.get("vary"));
            for (let O of w) {
                if (O === "*") return !1;
                let $ = q.headersList.get(O),
                    H = A.headersList.get(O);
                if ($ !== H) return !1
            }
            return !0
        }
        #Y(A, q, K = 1 / 0) {
            let Y = null;
            if (A !== void 0) {
                if (A instanceof $Q) {
                    if (Y = A[cS], Y.method !== "GET" && !q.ignoreMethod) return []
                } else if (typeof A === "string") Y = new $Q(A)[cS]
            }
            let z = [];
            if (A === void 0)
                for (let w of this.#A) z.push(w[1]);
            else {
                let w = this.#K(Y, q);
                for (let O of w) z.push(O[1])
            }
            let _ = [];
            for (let w of z) {
                let O = OgK(w, "immutable");
                if (_.push(O.clone()), _.length >= K) break
            }
            return Object.freeze(_)
        }
    }
    Object.defineProperties(Ju.prototype, {
        [Symbol.toStringTag]: {
            value: "Cache",
            configurable: !0
        },
        match: c76,
        matchAll: c76,
        add: c76,
        addAll: c76,
        put: c76,
        delete: c76,
        keys: c76
    });
    var quA = [{
        key: "ignoreSearch",
        converter: dq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreMethod",
        converter: dq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreVary",
        converter: dq.converters.boolean,
        defaultValue: () => !1
    }];
    dq.converters.CacheQueryOptions = dq.dictionaryConverter(quA);
    dq.converters.MultiCacheQueryOptions = dq.dictionaryConverter([...quA, {
        key: "cacheName",
        converter: dq.converters.DOMString
    }]);
    dq.converters.Response = dq.interfaceConverter(_gK);
    dq.converters["sequence<RequestInfo>"] = dq.sequenceConverter(dq.converters.RequestInfo);
    KuA.exports = {
        Cache: Ju
    }
})
// @from(Ln 60820, Col 4)
_uA = x((CO_, zuA) => {
    var {
        kConstruct: Wh6
    } = Z41(), {
        Cache: f41
    } = YuA(), {
        webidl: NW
    } = vP(), {
        kEnumerableProperty: Zh6
    } = Y9();
    class ur {
        #A = new Map;
        constructor() {
            if (arguments[0] !== Wh6) NW.illegalConstructor();
            NW.util.markAsUncloneable(this)
        }
        async match(A, q = {}) {
            if (NW.brandCheck(this, ur), NW.argumentLengthCheck(arguments, 1, "CacheStorage.match"), A = NW.converters.RequestInfo(A), q = NW.converters.MultiCacheQueryOptions(q), q.cacheName != null) {
                if (this.#A.has(q.cacheName)) {
                    let K = this.#A.get(q.cacheName);
                    return await new f41(Wh6, K).match(A, q)
                }
            } else
                for (let K of this.#A.values()) {
                    let z = await new f41(Wh6, K).match(A, q);
                    if (z !== void 0) return z
                }
        }
        async has(A) {
            NW.brandCheck(this, ur);
            let q = "CacheStorage.has";
            return NW.argumentLengthCheck(arguments, 1, q), A = NW.converters.DOMString(A, q, "cacheName"), this.#A.has(A)
        }
        async open(A) {
            NW.brandCheck(this, ur);
            let q = "CacheStorage.open";
            if (NW.argumentLengthCheck(arguments, 1, q), A = NW.converters.DOMString(A, q, "cacheName"), this.#A.has(A)) {
                let Y = this.#A.get(A);
                return new f41(Wh6, Y)
            }
            let K = [];
            return this.#A.set(A, K), new f41(Wh6, K)
        }
        async delete(A) {
            NW.brandCheck(this, ur);
            let q = "CacheStorage.delete";
            return NW.argumentLengthCheck(arguments, 1, q), A = NW.converters.DOMString(A, q, "cacheName"), this.#A.delete(A)
        }
        async keys() {
            return NW.brandCheck(this, ur), [...this.#A.keys()]
        }
    }
    Object.defineProperties(ur.prototype, {
        [Symbol.toStringTag]: {
            value: "CacheStorage",
            configurable: !0
        },
        match: Zh6,
        has: Zh6,
        open: Zh6,
        delete: Zh6,
        keys: Zh6
    });
    zuA.exports = {
        CacheStorage: ur
    }
})
// @from(Ln 60887, Col 4)
OuA = x((IO_, wuA) => {
    wuA.exports = {
        maxAttributeValueSize: 1024,
        maxNameValuePairSize: 4096
    }
})
// @from(Ln 60893, Col 4)
Wa1 = x((bO_, MuA) => {
    function JgK(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K >= 0 && K <= 8 || K >= 10 && K <= 31 || K === 127) return !0
        }
        return !1
    }

    function $uA(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 33 || K > 126 || K === 34 || K === 40 || K === 41 || K === 60 || K === 62 || K === 64 || K === 44 || K === 59 || K === 58 || K === 92 || K === 47 || K === 91 || K === 93 || K === 63 || K === 61 || K === 123 || K === 125) throw Error("Invalid cookie name")
        }
    }

    function HuA(A) {
        let q = A.length,
            K = 0;
        if (A[0] === '"') {
            if (q === 1 || A[q - 1] !== '"') throw Error("Invalid cookie value");
            --q, ++K
        }
        while (K < q) {
            let Y = A.charCodeAt(K++);
            if (Y < 33 || Y > 126 || Y === 34 || Y === 44 || Y === 59 || Y === 92) throw Error("Invalid cookie value")
        }
    }

    function juA(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 32 || K === 127 || K === 59) throw Error("Invalid cookie path")
        }
    }

    function MgK(A) {
        if (A.startsWith("-") || A.endsWith(".") || A.endsWith("-")) throw Error("Invalid cookie domain")
    }
    var DgK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        XgK = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        T41 = Array(61).fill(0).map((A, q) => q.toString().padStart(2, "0"));

    function JuA(A) {
        if (typeof A === "number") A = new Date(A);
        return `${DgK[A.getUTCDay()]}, ${T41[A.getUTCDate()]} ${XgK[A.getUTCMonth()]} ${A.getUTCFullYear()} ${T41[A.getUTCHours()]}:${T41[A.getUTCMinutes()]}:${T41[A.getUTCSeconds()]} GMT`
    }

    function PgK(A) {
        if (A < 0) throw Error("Invalid cookie max-age")
    }

    function WgK(A) {
        if (A.name.length === 0) return null;
        $uA(A.name), HuA(A.value);
        let q = [`${A.name}=${A.value}`];
        if (A.name.startsWith("__Secure-")) A.secure = !0;
        if (A.name.startsWith("__Host-")) A.secure = !0, A.domain = null, A.path = "/";
        if (A.secure) q.push("Secure");
        if (A.httpOnly) q.push("HttpOnly");
        if (typeof A.maxAge === "number") PgK(A.maxAge), q.push(`Max-Age=${A.maxAge}`);
        if (A.domain) MgK(A.domain), q.push(`Domain=${A.domain}`);
        if (A.path) juA(A.path), q.push(`Path=${A.path}`);
        if (A.expires && A.expires.toString() !== "Invalid Date") q.push(`Expires=${JuA(A.expires)}`);
        if (A.sameSite) q.push(`SameSite=${A.sameSite}`);
        for (let K of A.unparsed) {
            if (!K.includes("=")) throw Error("Invalid unparsed");
            let [Y, ...z] = K.split("=");
            q.push(`${Y.trim()}=${z.join("=")}`)
        }
        return q.join("; ")
    }
    MuA.exports = {
        isCTLExcludingHtab: JgK,
        validateCookieName: $uA,
        validateCookiePath: juA,
        validateCookieValue: HuA,
        toIMFDate: JuA,
        stringify: WgK
    }
})
// @from(Ln 60974, Col 4)
XuA = x((xO_, DuA) => {
    var {
        maxNameValuePairSize: ZgK,
        maxAttributeValueSize: GgK
    } = OuA(), {
        isCTLExcludingHtab: fgK
    } = Wa1(), {
        collectASequenceOfCodePointsFast: v41
    } = hT(), TgK = x6("node:assert");

    function vgK(A) {
        if (fgK(A)) return null;
        let q = "",
            K = "",
            Y = "",
            z = "";
        if (A.includes(";")) {
            let _ = {
                position: 0
            };
            q = v41(";", A, _), K = A.slice(_.position)
        } else q = A;
        if (!q.includes("=")) z = q;
        else {
            let _ = {
                position: 0
            };
            Y = v41("=", q, _), z = q.slice(_.position + 1)
        }
        if (Y = Y.trim(), z = z.trim(), Y.length + z.length > ZgK) return null;
        return {
            name: Y,
            value: z,
            ...iH6(K)
        }
    }

    function iH6(A, q = {}) {
        if (A.length === 0) return q;
        TgK(A[0] === ";"), A = A.slice(1);
        let K = "";
        if (A.includes(";")) K = v41(";", A, {
            position: 0
        }), A = A.slice(K.length);
        else K = A, A = "";
        let Y = "",
            z = "";
        if (K.includes("=")) {
            let w = {
                position: 0
            };
            Y = v41("=", K, w), z = K.slice(w.position + 1)
        } else Y = K;
        if (Y = Y.trim(), z = z.trim(), z.length > GgK) return iH6(A, q);
        let _ = Y.toLowerCase();
        if (_ === "expires") {
            let w = new Date(z);
            q.expires = w
        } else if (_ === "max-age") {
            let w = z.charCodeAt(0);
            if ((w < 48 || w > 57) && z[0] !== "-") return iH6(A, q);
            if (!/^\d+$/.test(z)) return iH6(A, q);
            let O = Number(z);
            q.maxAge = O
        } else if (_ === "domain") {
            let w = z;
            if (w[0] === ".") w = w.slice(1);
            w = w.toLowerCase(), q.domain = w
        } else if (_ === "path") {
            let w = "";
            if (z.length === 0 || z[0] !== "/") w = "/";
            else w = z;
            q.path = w
        } else if (_ === "secure") q.secure = !0;
        else if (_ === "httponly") q.httpOnly = !0;
        else if (_ === "samesite") {
            let w = "Default",
                O = z.toLowerCase();
            if (O.includes("none")) w = "None";
            if (O.includes("strict")) w = "Strict";
            if (O.includes("lax")) w = "Lax";
            q.sameSite = w
        } else q.unparsed ??= [], q.unparsed.push(`${Y}=${z}`);
        return iH6(A, q)
    }
    DuA.exports = {
        parseSetCookie: vgK,
        parseUnparsedAttributes: iH6
    }
})
// @from(Ln 61064, Col 4)
ZuA = x((uO_, WuA) => {
    var {
        parseSetCookie: NgK
    } = XuA(), {
        stringify: VgK
    } = Wa1(), {
        webidl: Q9
    } = vP(), {
        Headers: N41
    } = p76();

    function kgK(A) {
        Q9.argumentLengthCheck(arguments, 1, "getCookies"), Q9.brandCheck(A, N41, {
            strict: !1
        });
        let q = A.get("cookie"),
            K = {};
        if (!q) return K;
        for (let Y of q.split(";")) {
            let [z, ..._] = Y.split("=");
            K[z.trim()] = _.join("=")
        }
        return K
    }

    function EgK(A, q, K) {
        Q9.brandCheck(A, N41, {
            strict: !1
        });
        let Y = "deleteCookie";
        Q9.argumentLengthCheck(arguments, 2, Y), q = Q9.converters.DOMString(q, Y, "name"), K = Q9.converters.DeleteCookieAttributes(K), PuA(A, {
            name: q,
            value: "",
            expires: new Date(0),
            ...K
        })
    }

    function ygK(A) {
        Q9.argumentLengthCheck(arguments, 1, "getSetCookies"), Q9.brandCheck(A, N41, {
            strict: !1
        });
        let q = A.getSetCookie();
        if (!q) return [];
        return q.map((K) => NgK(K))
    }

    function PuA(A, q) {
        Q9.argumentLengthCheck(arguments, 2, "setCookie"), Q9.brandCheck(A, N41, {
            strict: !1
        }), q = Q9.converters.Cookie(q);
        let K = VgK(q);
        if (K) A.append("Set-Cookie", K)
    }
    Q9.converters.DeleteCookieAttributes = Q9.dictionaryConverter([{
        converter: Q9.nullableConverter(Q9.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }]);
    Q9.converters.Cookie = Q9.dictionaryConverter([{
        converter: Q9.converters.DOMString,
        key: "name"
    }, {
        converter: Q9.converters.DOMString,
        key: "value"
    }, {
        converter: Q9.nullableConverter((A) => {
            if (typeof A === "number") return Q9.converters["unsigned long long"](A);
            return new Date(A)
        }),
        key: "expires",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters["long long"]),
        key: "maxAge",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters.boolean),
        key: "secure",
        defaultValue: () => null
    }, {
        converter: Q9.nullableConverter(Q9.converters.boolean),
        key: "httpOnly",
        defaultValue: () => null
    }, {
        converter: Q9.converters.USVString,
        key: "sameSite",
        allowedValues: ["Strict", "Lax", "None"]
    }, {
        converter: Q9.sequenceConverter(Q9.converters.DOMString),
        key: "unparsed",
        defaultValue: () => []
    }]);
    WuA.exports = {
        getCookies: kgK,
        deleteCookie: EgK,
        getSetCookies: ygK,
        setCookie: PuA
    }
})
// @from(Ln 61176, Col 4)
rH6 = x((mO_, fuA) => {
    var {
        webidl: Iq
    } = vP(), {
        kEnumerableProperty: bT
    } = Y9(), {
        kConstruct: GuA
    } = UO(), {
        MessagePort: LgK
    } = x6("node:worker_threads");
    class BV extends Event {
        #A;
        constructor(A, q = {}) {
            if (A === GuA) {
                super(arguments[1], arguments[2]);
                Iq.util.markAsUncloneable(this);
                return
            }
            let K = "MessageEvent constructor";
            Iq.argumentLengthCheck(arguments, 1, K), A = Iq.converters.DOMString(A, K, "type"), q = Iq.converters.MessageEventInit(q, K, "eventInitDict");
            super(A, q);
            this.#A = q, Iq.util.markAsUncloneable(this)
        }
        get data() {
            return Iq.brandCheck(this, BV), this.#A.data
        }
        get origin() {
            return Iq.brandCheck(this, BV), this.#A.origin
        }
        get lastEventId() {
            return Iq.brandCheck(this, BV), this.#A.lastEventId
        }
        get source() {
            return Iq.brandCheck(this, BV), this.#A.source
        }
        get ports() {
            if (Iq.brandCheck(this, BV), !Object.isFrozen(this.#A.ports)) Object.freeze(this.#A.ports);
            return this.#A.ports
        }
        initMessageEvent(A, q = !1, K = !1, Y = null, z = "", _ = "", w = null, O = []) {
            return Iq.brandCheck(this, BV), Iq.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new BV(A, {
                bubbles: q,
                cancelable: K,
                data: Y,
                origin: z,
                lastEventId: _,
                source: w,
                ports: O
            })
        }
        static createFastMessageEvent(A, q) {
            let K = new BV(GuA, A, q);
            return K.#A = q, K.#A.data ??= null, K.#A.origin ??= "", K.#A.lastEventId ??= "", K.#A.source ??= null, K.#A.ports ??= [], K
        }
    }
    var {
        createFastMessageEvent: RgK
    } = BV;
    delete BV.createFastMessageEvent;
    class nH6 extends Event {
        #A;
        constructor(A, q = {}) {
            Iq.argumentLengthCheck(arguments, 1, "CloseEvent constructor"), A = Iq.converters.DOMString(A, "CloseEvent constructor", "type"), q = Iq.converters.CloseEventInit(q);
            super(A, q);
            this.#A = q, Iq.util.markAsUncloneable(this)
        }
        get wasClean() {
            return Iq.brandCheck(this, nH6), this.#A.wasClean
        }
        get code() {
            return Iq.brandCheck(this, nH6), this.#A.code
        }
        get reason() {
            return Iq.brandCheck(this, nH6), this.#A.reason
        }
    }
    class mr extends Event {
        #A;
        constructor(A, q) {
            Iq.argumentLengthCheck(arguments, 1, "ErrorEvent constructor");
            super(A, q);
            Iq.util.markAsUncloneable(this), A = Iq.converters.DOMString(A, "ErrorEvent constructor", "type"), q = Iq.converters.ErrorEventInit(q ?? {}), this.#A = q
        }
        get message() {
            return Iq.brandCheck(this, mr), this.#A.message
        }
        get filename() {
            return Iq.brandCheck(this, mr), this.#A.filename
        }
        get lineno() {
            return Iq.brandCheck(this, mr), this.#A.lineno
        }
        get colno() {
            return Iq.brandCheck(this, mr), this.#A.colno
        }
        get error() {
            return Iq.brandCheck(this, mr), this.#A.error
        }
    }
    Object.defineProperties(BV.prototype, {
        [Symbol.toStringTag]: {
            value: "MessageEvent",
            configurable: !0
        },
        data: bT,
        origin: bT,
        lastEventId: bT,
        source: bT,
        ports: bT,
        initMessageEvent: bT
    });
    Object.defineProperties(nH6.prototype, {
        [Symbol.toStringTag]: {
            value: "CloseEvent",
            configurable: !0
        },
        reason: bT,
        code: bT,
        wasClean: bT
    });
    Object.defineProperties(mr.prototype, {
        [Symbol.toStringTag]: {
            value: "ErrorEvent",
            configurable: !0
        },
        message: bT,
        filename: bT,
        lineno: bT,
        colno: bT,
        error: bT
    });
    Iq.converters.MessagePort = Iq.interfaceConverter(LgK);
    Iq.converters["sequence<MessagePort>"] = Iq.sequenceConverter(Iq.converters.MessagePort);
    var Za1 = [{
        key: "bubbles",
        converter: Iq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: Iq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: Iq.converters.boolean,
        defaultValue: () => !1
    }];
    Iq.converters.MessageEventInit = Iq.dictionaryConverter([...Za1, {
        key: "data",
        converter: Iq.converters.any,
        defaultValue: () => null
    }, {
        key: "origin",
        converter: Iq.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lastEventId",
        converter: Iq.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "source",
        converter: Iq.nullableConverter(Iq.converters.MessagePort),
        defaultValue: () => null
    }, {
        key: "ports",
        converter: Iq.converters["sequence<MessagePort>"],
        defaultValue: () => []
    }]);
    Iq.converters.CloseEventInit = Iq.dictionaryConverter([...Za1, {
        key: "wasClean",
        converter: Iq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "code",
        converter: Iq.converters["unsigned short"],
        defaultValue: () => 0
    }, {
        key: "reason",
        converter: Iq.converters.USVString,
        defaultValue: () => ""
    }]);
    Iq.converters.ErrorEventInit = Iq.dictionaryConverter([...Za1, {
        key: "message",
        converter: Iq.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "filename",
        converter: Iq.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lineno",
        converter: Iq.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "colno",
        converter: Iq.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "error",
        converter: Iq.converters.any
    }]);
    fuA.exports = {
        MessageEvent: BV,
        CloseEvent: nH6,
        ErrorEvent: mr,
        createFastMessageEvent: RgK
    }
})
// @from(Ln 61383, Col 4)
l76 = x((BO_, TuA) => {
    var hgK = {
            enumerable: !0,
            writable: !1,
            configurable: !1
        },
        SgK = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        },
        CgK = {
            NOT_SENT: 0,
            PROCESSING: 1,
            SENT: 2
        },
        IgK = {
            CONTINUATION: 0,
            TEXT: 1,
            BINARY: 2,
            CLOSE: 8,
            PING: 9,
            PONG: 10
        },
        bgK = {
            INFO: 0,
            PAYLOADLENGTH_16: 2,
            PAYLOADLENGTH_64: 3,
            READ_DATA: 4
        },
        xgK = Buffer.allocUnsafe(0),
        ugK = {
            string: 1,
            typedArray: 2,
            arrayBuffer: 3,
            blob: 4
        };
    TuA.exports = {
        uid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        sentCloseFrameState: CgK,
        staticPropertyDescriptors: hgK,
        states: SgK,
        opcodes: IgK,
        maxUnsigned16Bit: 65535,
        parserStates: bgK,
        emptyBuffer: xgK,
        sendHints: ugK
    }
})
// @from(Ln 61433, Col 4)
Gh6 = x((gO_, vuA) => {
    vuA.exports = {
        kWebSocketURL: Symbol("url"),
        kReadyState: Symbol("ready state"),
        kController: Symbol("controller"),
        kResponse: Symbol("response"),
        kBinaryType: Symbol("binary type"),
        kSentClose: Symbol("sent close"),
        kReceivedClose: Symbol("received close"),
        kByteParser: Symbol("byte parser")
    }
})
// @from(Ln 61445, Col 4)
vh6 = x((FO_, SuA) => {
    var {
        kReadyState: fh6,
        kController: mgK,
        kResponse: BgK,
        kBinaryType: ggK,
        kWebSocketURL: FgK
    } = Gh6(), {
        states: Th6,
        opcodes: Br
    } = l76(), {
        ErrorEvent: pgK,
        createFastMessageEvent: QgK
    } = rH6(), {
        isUtf8: UgK
    } = x6("node:buffer"), {
        collectASequenceOfCodePointsFast: dgK,
        removeHTTPWhitespace: NuA
    } = hT();

    function cgK(A) {
        return A[fh6] === Th6.CONNECTING
    }

    function lgK(A) {
        return A[fh6] === Th6.OPEN
    }

    function igK(A) {
        return A[fh6] === Th6.CLOSING
    }

    function ngK(A) {
        return A[fh6] === Th6.CLOSED
    }

    function Ga1(A, q, K = (z, _) => new Event(z, _), Y = {}) {
        let z = K(A, Y);
        q.dispatchEvent(z)
    }

    function rgK(A, q, K) {
        if (A[fh6] !== Th6.OPEN) return;
        let Y;
        if (q === Br.TEXT) try {
            Y = huA(K)
        } catch {
            kuA(A, "Received invalid UTF-8 in text frame.");
            return
        } else if (q === Br.BINARY)
            if (A[ggK] === "blob") Y = new Blob([K]);
            else Y = ogK(K);
        Ga1("message", A, QgK, {
            origin: A[FgK].origin,
            data: Y
        })
    }

    function ogK(A) {
        if (A.byteLength === A.buffer.byteLength) return A.buffer;
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
    }

    function agK(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 33 || K > 126 || K === 34 || K === 40 || K === 41 || K === 44 || K === 47 || K === 58 || K === 59 || K === 60 || K === 61 || K === 62 || K === 63 || K === 64 || K === 91 || K === 92 || K === 93 || K === 123 || K === 125) return !1
        }
        return !0
    }

    function sgK(A) {
        if (A >= 1000 && A < 1015) return A !== 1004 && A !== 1005 && A !== 1006;
        return A >= 3000 && A <= 4999
    }

    function kuA(A, q) {
        let {
            [mgK]: K, [BgK]: Y
        } = A;
        if (K.abort(), Y?.socket && !Y.socket.destroyed) Y.socket.destroy();
        if (q) Ga1("error", A, (z, _) => new pgK(z, _), {
            error: Error(q),
            message: q
        })
    }

    function EuA(A) {
        return A === Br.CLOSE || A === Br.PING || A === Br.PONG
    }

    function yuA(A) {
        return A === Br.CONTINUATION
    }

    function LuA(A) {
        return A === Br.TEXT || A === Br.BINARY
    }

    function tgK(A) {
        return LuA(A) || yuA(A) || EuA(A)
    }

    function egK(A) {
        let q = {
                position: 0
            },
            K = new Map;
        while (q.position < A.length) {
            let Y = dgK(";", A, q),
                [z, _ = ""] = Y.split("=");
            K.set(NuA(z, !0, !1), NuA(_, !1, !0)), q.position++
        }
        return K
    }

    function AFK(A) {
        for (let q = 0; q < A.length; q++) {
            let K = A.charCodeAt(q);
            if (K < 48 || K > 57) return !1
        }
        return !0
    }
    var RuA = typeof process.versions.icu === "string",
        VuA = RuA ? new TextDecoder("utf-8", {
            fatal: !0
        }) : void 0,
        huA = RuA ? VuA.decode.bind(VuA) : function(A) {
            if (UgK(A)) return A.toString("utf-8");
            throw TypeError("Invalid utf-8 received.")
        };
    SuA.exports = {
        isConnecting: cgK,
        isEstablished: lgK,
        isClosing: igK,
        isClosed: ngK,
        fireEvent: Ga1,
        isValidSubprotocol: agK,
        isValidStatusCode: sgK,
        failWebsocketConnection: kuA,
        websocketMessageReceived: rgK,
        utf8Decode: huA,
        isControlFrame: EuA,
        isContinuationFrame: yuA,
        isTextBinaryFrame: LuA,
        isValidOpcode: tgK,
        parseExtensions: egK,
        isValidClientWindowBits: AFK
    }
})
// @from(Ln 61596, Col 4)
V41 = x((pO_, IuA) => {
    var {
        maxUnsigned16Bit: qFK
    } = l76(), fa1, Nh6 = null, oH6 = 16386;
    try {
        fa1 = x6("node:crypto")
    } catch {
        fa1 = {
            randomFillSync: function(q, K, Y) {
                for (let z = 0; z < q.length; ++z) q[z] = Math.random() * 255 | 0;
                return q
            }
        }
    }

    function KFK() {
        if (oH6 === 16386) oH6 = 0, fa1.randomFillSync(Nh6 ??= Buffer.allocUnsafe(16386), 0, 16386);
        return [Nh6[oH6++], Nh6[oH6++], Nh6[oH6++], Nh6[oH6++]]
    }
    class CuA {
        constructor(A) {
            this.frameData = A
        }
        createFrame(A) {
            let q = this.frameData,
                K = KFK(),
                Y = q?.byteLength ?? 0,
                z = Y,
                _ = 6;
            if (Y > qFK) _ += 8, z = 127;
            else if (Y > 125) _ += 2, z = 126;
            let w = Buffer.allocUnsafe(Y + _);
            w[0] = w[1] = 0, w[0] |= 128, w[0] = (w[0] & 240) + A; /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
            if (w[_ - 4] = K[0], w[_ - 3] = K[1], w[_ - 2] = K[2], w[_ - 1] = K[3], w[1] = z, z === 126) w.writeUInt16BE(Y, 2);
            else if (z === 127) w[2] = w[3] = 0, w.writeUIntBE(Y, 4, 6);
            w[1] |= 128;
            for (let O = 0; O < Y; ++O) w[_ + O] = q[O] ^ K[O & 3];
            return w
        }
    }
    IuA.exports = {
        WebsocketFrameSend: CuA
    }
})
// @from(Ln 61640, Col 4)
va1 = x((QO_, FuA) => {
    var {
        uid: YFK,
        states: Vh6,
        sentCloseFrameState: k41,
        emptyBuffer: zFK,
        opcodes: _FK
    } = l76(), {
        kReadyState: kh6,
        kSentClose: E41,
        kByteParser: xuA,
        kReceivedClose: buA,
        kResponse: uuA
    } = Gh6(), {
        fireEvent: wFK,
        failWebsocketConnection: gr,
        isClosing: OFK,
        isClosed: $FK,
        isEstablished: HFK,
        parseExtensions: jFK
    } = vh6(), {
        channels: aH6
    } = jH6(), {
        CloseEvent: JFK
    } = rH6(), {
        makeRequest: MFK
    } = UH6(), {
        fetching: DFK
    } = Dh6(), {
        Headers: XFK,
        getHeadersList: PFK
    } = p76(), {
        getDecodeSplit: WFK
    } = SV(), {
        WebsocketFrameSend: ZFK
    } = V41(), Ta1;
    try {
        Ta1 = x6("node:crypto")
    } catch {}

    function GFK(A, q, K, Y, z, _) {
        let w = A;
        w.protocol = A.protocol === "ws:" ? "http:" : "https:";
        let O = MFK({
            urlList: [w],
            client: K,
            serviceWorkers: "none",
            referrer: "no-referrer",
            mode: "websocket",
            credentials: "include",
            cache: "no-store",
            redirect: "error"
        });
        if (_.headers) {
            let J = PFK(new XFK(_.headers));
            O.headersList = J
        }
        let $ = Ta1.randomBytes(16).toString("base64");
        O.headersList.append("sec-websocket-key", $), O.headersList.append("sec-websocket-version", "13");
        for (let J of q) O.headersList.append("sec-websocket-protocol", J);
        let H = "permessage-deflate; client_max_window_bits";
        return O.headersList.append("sec-websocket-extensions", H), DFK({
            request: O,
            useParallelQueue: !0,
            dispatcher: _.dispatcher,
            processResponse(J) {
                if (J.type === "error" || J.status !== 101) {
                    gr(Y, "Received network error or non-101 status code.");
                    return
                }
                if (q.length !== 0 && !J.headersList.get("Sec-WebSocket-Protocol")) {
                    gr(Y, "Server did not respond with sent protocols.");
                    return
                }
                if (J.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
                    gr(Y, 'Server did not set Upgrade header to "websocket".');
                    return
                }
                if (J.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
                    gr(Y, 'Server did not set Connection header to "upgrade".');
                    return
                }
                let M = J.headersList.get("Sec-WebSocket-Accept"),
                    D = Ta1.createHash("sha1").update($ + YFK).digest("base64");
                if (M !== D) {
                    gr(Y, "Incorrect hash received in Sec-WebSocket-Accept header.");
                    return
                }
                let X = J.headersList.get("Sec-WebSocket-Extensions"),
                    P;
                if (X !== null) {
                    if (P = jFK(X), !P.has("permessage-deflate")) {
                        gr(Y, "Sec-WebSocket-Extensions header does not match.");
                        return
                    }
                }
                let W = J.headersList.get("Sec-WebSocket-Protocol");
                if (W !== null) {
                    if (!WFK("sec-websocket-protocol", O.headersList).includes(W)) {
                        gr(Y, "Protocol was not set in the opening handshake.");
                        return
                    }
                }
                if (J.socket.on("data", muA), J.socket.on("close", BuA), J.socket.on("error", guA), aH6.open.hasSubscribers) aH6.open.publish({
                    address: J.socket.address(),
                    protocol: W,
                    extensions: X
                });
                z(J, P)
            }
        })
    }

    function fFK(A, q, K, Y) {
        if (OFK(A) || $FK(A));
        else if (!HFK(A)) gr(A, "Connection was closed before it was established."), A[kh6] = Vh6.CLOSING;
        else if (A[E41] === k41.NOT_SENT) {
            A[E41] = k41.PROCESSING;
            let z = new ZFK;
            if (q !== void 0 && K === void 0) z.frameData = Buffer.allocUnsafe(2), z.frameData.writeUInt16BE(q, 0);
            else if (q !== void 0 && K !== void 0) z.frameData = Buffer.allocUnsafe(2 + Y), z.frameData.writeUInt16BE(q, 0), z.frameData.write(K, 2, "utf-8");
            else z.frameData = zFK;
            A[uuA].socket.write(z.createFrame(_FK.CLOSE)), A[E41] = k41.SENT, A[kh6] = Vh6.CLOSING
        } else A[kh6] = Vh6.CLOSING
    }

    function muA(A) {
        if (!this.ws[xuA].write(A)) this.pause()
    }

    function BuA() {
        let {
            ws: A
        } = this, {
            [uuA]: q
        } = A;
        q.socket.off("data", muA), q.socket.off("close", BuA), q.socket.off("error", guA);
        let K = A[E41] === k41.SENT && A[buA],
            Y = 1005,
            z = "",
            _ = A[xuA].closingInfo;
        if (_ && !_.error) Y = _.code ?? 1005, z = _.reason;
        else if (!A[buA]) Y = 1006;
        if (A[kh6] = Vh6.CLOSED, wFK("close", A, (w, O) => new JFK(w, O), {
                wasClean: K,
                code: Y,
                reason: z
            }), aH6.close.hasSubscribers) aH6.close.publish({
            websocket: A,
            code: Y,
            reason: z
        })
    }

    function guA(A) {
        let {
            ws: q
        } = this;
        if (q[kh6] = Vh6.CLOSING, aH6.socketError.hasSubscribers) aH6.socketError.publish(A);
        this.destroy()
    }
    FuA.exports = {
        establishWebSocketConnection: GFK,
        closeWebSocketConnection: fFK
    }
})
// @from(Ln 61806, Col 4)
UuA = x((UO_, QuA) => {
    var {
        createInflateRaw: TFK,
        Z_DEFAULT_WINDOWBITS: vFK
    } = x6("node:zlib"), {
        isValidClientWindowBits: NFK
    } = vh6(), VFK = Buffer.from([0, 0, 255, 255]), y41 = Symbol("kBuffer"), L41 = Symbol("kLength");
    class puA {
        #A;
        #q = {};
        constructor(A) {
            this.#q.serverNoContextTakeover = A.has("server_no_context_takeover"), this.#q.serverMaxWindowBits = A.get("server_max_window_bits")
        }
        decompress(A, q, K) {
            if (!this.#A) {
                let Y = vFK;
                if (this.#q.serverMaxWindowBits) {
                    if (!NFK(this.#q.serverMaxWindowBits)) {
                        K(Error("Invalid server_max_window_bits"));
                        return
                    }
                    Y = Number.parseInt(this.#q.serverMaxWindowBits)
                }
                this.#A = TFK({
                    windowBits: Y
                }), this.#A[y41] = [], this.#A[L41] = 0, this.#A.on("data", (z) => {
                    this.#A[y41].push(z), this.#A[L41] += z.length
                }), this.#A.on("error", (z) => {
                    this.#A = null, K(z)
                })
            }
            if (this.#A.write(A), q) this.#A.write(VFK);
            this.#A.flush(() => {
                let Y = Buffer.concat(this.#A[y41], this.#A[L41]);
                this.#A[y41].length = 0, this.#A[L41] = 0, K(null, Y)
            })
        }
    }
    QuA.exports = {
        PerMessageDeflate: puA
    }
})
// @from(Ln 61848, Col 4)
AmA = x((dO_, euA) => {
    var {
        Writable: kFK
    } = x6("node:stream"), EFK = x6("node:assert"), {
        parserStates: xT,
        opcodes: sH6,
        states: yFK,
        emptyBuffer: duA,
        sentCloseFrameState: cuA
    } = l76(), {
        kReadyState: LFK,
        kSentClose: luA,
        kResponse: iuA,
        kReceivedClose: nuA
    } = Gh6(), {
        channels: R41
    } = jH6(), {
        isValidStatusCode: RFK,
        isValidOpcode: hFK,
        failWebsocketConnection: yy,
        websocketMessageReceived: ruA,
        utf8Decode: SFK,
        isControlFrame: ouA,
        isTextBinaryFrame: Na1,
        isContinuationFrame: CFK
    } = vh6(), {
        WebsocketFrameSend: auA
    } = V41(), {
        closeWebSocketConnection: suA
    } = va1(), {
        PerMessageDeflate: IFK
    } = UuA();
    class tuA extends kFK {
        #A = [];
        #q = 0;
        #K = !1;
        #z = xT.INFO;
        #Y = {};
        #w = [];
        #_;
        constructor(A, q) {
            super();
            if (this.ws = A, this.#_ = q == null ? new Map : q, this.#_.has("permessage-deflate")) this.#_.set("permessage-deflate", new IFK(q))
        }
        _write(A, q, K) {
            this.#A.push(A), this.#q += A.length, this.#K = !0, this.run(K)
        }
        run(A) {
            while (this.#K)
                if (this.#z === xT.INFO) {
                    if (this.#q < 2) return A();
                    let q = this.consume(2),
                        K = (q[0] & 128) !== 0,
                        Y = q[0] & 15,
                        z = (q[1] & 128) === 128,
                        _ = !K && Y !== sH6.CONTINUATION,
                        w = q[1] & 127,
                        O = q[0] & 64,
                        $ = q[0] & 32,
                        H = q[0] & 16;
                    if (!hFK(Y)) return yy(this.ws, "Invalid opcode received"), A();
                    if (z) return yy(this.ws, "Frame cannot be masked"), A();
                    if (O !== 0 && !this.#_.has("permessage-deflate")) {
                        yy(this.ws, "Expected RSV1 to be clear.");
                        return
                    }
                    if ($ !== 0 || H !== 0) {
                        yy(this.ws, "RSV1, RSV2, RSV3 must be clear");
                        return
                    }
                    if (_ && !Na1(Y)) {
                        yy(this.ws, "Invalid frame type was fragmented.");
                        return
                    }
                    if (Na1(Y) && this.#w.length > 0) {
                        yy(this.ws, "Expected continuation frame");
                        return
                    }
                    if (this.#Y.fragmented && _) {
                        yy(this.ws, "Fragmented frame exceeded 125 bytes.");
                        return
                    }
                    if ((w > 125 || _) && ouA(Y)) {
                        yy(this.ws, "Control frame either too large or fragmented");
                        return
                    }
                    if (CFK(Y) && this.#w.length === 0 && !this.#Y.compressed) {
                        yy(this.ws, "Unexpected continuation frame");
                        return
                    }
                    if (w <= 125) this.#Y.payloadLength = w, this.#z = xT.READ_DATA;
                    else if (w === 126) this.#z = xT.PAYLOADLENGTH_16;
                    else if (w === 127) this.#z = xT.PAYLOADLENGTH_64;
                    if (Na1(Y)) this.#Y.binaryType = Y, this.#Y.compressed = O !== 0;
                    this.#Y.opcode = Y, this.#Y.masked = z, this.#Y.fin = K, this.#Y.fragmented = _
                } else if (this.#z === xT.PAYLOADLENGTH_16) {
                if (this.#q < 2) return A();
                let q = this.consume(2);
                this.#Y.payloadLength = q.readUInt16BE(0), this.#z = xT.READ_DATA
            } else if (this.#z === xT.PAYLOADLENGTH_64) {
                if (this.#q < 8) return A();
                let q = this.consume(8),
                    K = q.readUInt32BE(0);
                if (K > 2147483647) {
                    yy(this.ws, "Received payload length > 2^31 bytes.");
                    return
                }
                let Y = q.readUInt32BE(4);
                this.#Y.payloadLength = (K << 8) + Y, this.#z = xT.READ_DATA
            } else if (this.#z === xT.READ_DATA) {
                if (this.#q < this.#Y.payloadLength) return A();
                let q = this.consume(this.#Y.payloadLength);
                if (ouA(this.#Y.opcode)) this.#K = this.parseControlFrame(q), this.#z = xT.INFO;
                else if (!this.#Y.compressed) {
                    if (this.#w.push(q), !this.#Y.fragmented && this.#Y.fin) {
                        let K = Buffer.concat(this.#w);
                        ruA(this.ws, this.#Y.binaryType, K), this.#w.length = 0
                    }
                    this.#z = xT.INFO
                } else {
                    this.#_.get("permessage-deflate").decompress(q, this.#Y.fin, (K, Y) => {
                        if (K) {
                            suA(this.ws, 1007, K.message, K.message.length);
                            return
                        }
                        if (this.#w.push(Y), !this.#Y.fin) {
                            this.#z = xT.INFO, this.#K = !0, this.run(A);
                            return
                        }
                        ruA(this.ws, this.#Y.binaryType, Buffer.concat(this.#w)), this.#K = !0, this.#z = xT.INFO, this.#w.length = 0, this.run(A)
                    }), this.#K = !1;
                    break
                }
            }
        }
        consume(A) {
            if (A > this.#q) throw Error("Called consume() before buffers satiated.");
            else if (A === 0) return duA;
            if (this.#A[0].length === A) return this.#q -= this.#A[0].length, this.#A.shift();
            let q = Buffer.allocUnsafe(A),
                K = 0;
            while (K !== A) {
                let Y = this.#A[0],
                    {
                        length: z
                    } = Y;
                if (z + K === A) {
                    q.set(this.#A.shift(), K);
                    break
                } else if (z + K > A) {
                    q.set(Y.subarray(0, A - K), K), this.#A[0] = Y.subarray(A - K);
                    break
                } else q.set(this.#A.shift(), K), K += Y.length
            }
            return this.#q -= A, q
        }
        parseCloseBody(A) {
            EFK(A.length !== 1);
            let q;
            if (A.length >= 2) q = A.readUInt16BE(0);
            if (q !== void 0 && !RFK(q)) return {
                code: 1002,
                reason: "Invalid status code",
                error: !0
            };
            let K = A.subarray(2);
            if (K[0] === 239 && K[1] === 187 && K[2] === 191) K = K.subarray(3);
            try {
                K = SFK(K)
            } catch {
                return {
                    code: 1007,
                    reason: "Invalid UTF-8",
                    error: !0
                }
            }
            return {
                code: q,
                reason: K,
                error: !1
            }
        }
        parseControlFrame(A) {
            let {
                opcode: q,
                payloadLength: K
            } = this.#Y;
            if (q === sH6.CLOSE) {
                if (K === 1) return yy(this.ws, "Received close frame with a 1-byte body."), !1;
                if (this.#Y.closeInfo = this.parseCloseBody(A), this.#Y.closeInfo.error) {
                    let {
                        code: Y,
                        reason: z
                    } = this.#Y.closeInfo;
                    return suA(this.ws, Y, z, z.length), yy(this.ws, z), !1
                }
                if (this.ws[luA] !== cuA.SENT) {
                    let Y = duA;
                    if (this.#Y.closeInfo.code) Y = Buffer.allocUnsafe(2), Y.writeUInt16BE(this.#Y.closeInfo.code, 0);
                    let z = new auA(Y);
                    this.ws[iuA].socket.write(z.createFrame(sH6.CLOSE), (_) => {
                        if (!_) this.ws[luA] = cuA.SENT
                    })
                }
                return this.ws[LFK] = yFK.CLOSING, this.ws[nuA] = !0, !1
            } else if (q === sH6.PING) {
                if (!this.ws[nuA]) {
                    let Y = new auA(A);
                    if (this.ws[iuA].socket.write(Y.createFrame(sH6.PONG)), R41.ping.hasSubscribers) R41.ping.publish({
                        payload: A
                    })
                }
            } else if (q === sH6.PONG) {
                if (R41.pong.hasSubscribers) R41.pong.publish({
                    payload: A
                })
            }
            return !0
        }
        get closingInfo() {
            return this.#Y.closeInfo
        }
    }
    euA.exports = {
        ByteParser: tuA
    }
})
// @from(Ln 62075, Col 4)
wmA = x((cO_, _mA) => {
    var {
        WebsocketFrameSend: bFK
    } = V41(), {
        opcodes: qmA,
        sendHints: tH6
    } = l76(), xFK = wo1(), KmA = Buffer[Symbol.species];
    class zmA {
        #A = new xFK;
        #q = !1;
        #K;
        constructor(A) {
            this.#K = A
        }
        add(A, q, K) {
            if (K !== tH6.blob) {
                let z = YmA(A, K);
                if (!this.#q) this.#K.write(z, q);
                else {
                    let _ = {
                        promise: null,
                        callback: q,
                        frame: z
                    };
                    this.#A.push(_)
                }
                return
            }
            let Y = {
                promise: A.arrayBuffer().then((z) => {
                    Y.promise = null, Y.frame = YmA(z, K)
                }),
                callback: q,
                frame: null
            };
            if (this.#A.push(Y), !this.#q) this.#z()
        }
        async #z() {
            this.#q = !0;
            let A = this.#A;
            while (!A.isEmpty()) {
                let q = A.shift();
                if (q.promise !== null) await q.promise;
                this.#K.write(q.frame, q.callback), q.callback = q.frame = null
            }
            this.#q = !1
        }
    }

    function YmA(A, q) {
        return new bFK(uFK(A, q)).createFrame(q === tH6.string ? qmA.TEXT : qmA.BINARY)
    }

    function uFK(A, q) {
        switch (q) {
            case tH6.string:
                return Buffer.from(A);
            case tH6.arrayBuffer:
            case tH6.blob:
                return new KmA(A);
            case tH6.typedArray:
                return new KmA(A.buffer, A.byteOffset, A.byteLength)
        }
    }
    _mA.exports = {
        SendQueue: zmA
    }
})
// @from(Ln 62143, Col 4)
PmA = x((lO_, XmA) => {
    var {
        webidl: rK
    } = vP(), {
        URLSerializer: mFK
    } = hT(), {
        environmentSettingsObject: OmA
    } = SV(), {
        staticPropertyDescriptors: Fr,
        states: Eh6,
        sentCloseFrameState: BFK,
        sendHints: h41
    } = l76(), {
        kWebSocketURL: $mA,
        kReadyState: Va1,
        kController: gFK,
        kBinaryType: S41,
        kResponse: HmA,
        kSentClose: FFK,
        kByteParser: pFK
    } = Gh6(), {
        isConnecting: QFK,
        isEstablished: UFK,
        isClosing: dFK,
        isValidSubprotocol: cFK,
        fireEvent: jmA
    } = vh6(), {
        establishWebSocketConnection: lFK,
        closeWebSocketConnection: JmA
    } = va1(), {
        ByteParser: iFK
    } = AmA(), {
        kEnumerableProperty: Ly,
        isBlobLike: MmA
    } = Y9(), {
        getGlobalDispatcher: nFK
    } = a71(), {
        types: DmA
    } = x6("node:util"), {
        ErrorEvent: rFK,
        CloseEvent: oFK
    } = rH6(), {
        SendQueue: aFK
    } = wmA();
    class __ extends EventTarget {
        #A = {
            open: null,
            error: null,
            close: null,
            message: null
        };
        #q = 0;
        #K = "";
        #z = "";
        #Y;
        constructor(A, q = []) {
            super();
            rK.util.markAsUncloneable(this);
            let K = "WebSocket constructor";
            rK.argumentLengthCheck(arguments, 1, K);
            let Y = rK.converters["DOMString or sequence<DOMString> or WebSocketInit"](q, K, "options");
            A = rK.converters.USVString(A, K, "url"), q = Y.protocols;
            let z = OmA.settingsObject.baseUrl,
                _;
            try {
                _ = new URL(A, z)
            } catch (O) {
                throw new DOMException(O, "SyntaxError")
            }
            if (_.protocol === "http:") _.protocol = "ws:";
            else if (_.protocol === "https:") _.protocol = "wss:";
            if (_.protocol !== "ws:" && _.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${_.protocol}`, "SyntaxError");
            if (_.hash || _.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
            if (typeof q === "string") q = [q];
            if (q.length !== new Set(q.map((O) => O.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            if (q.length > 0 && !q.every((O) => cFK(O))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            this[$mA] = new URL(_.href);
            let w = OmA.settingsObject;
            this[gFK] = lFK(_, q, w, this, (O, $) => this.#w(O, $), Y), this[Va1] = __.CONNECTING, this[FFK] = BFK.NOT_SENT, this[S41] = "blob"
        }
        close(A = void 0, q = void 0) {
            rK.brandCheck(this, __);
            let K = "WebSocket.close";
            if (A !== void 0) A = rK.converters["unsigned short"](A, K, "code", {
                clamp: !0
            });
            if (q !== void 0) q = rK.converters.USVString(q, K, "reason");
            if (A !== void 0) {
                if (A !== 1000 && (A < 3000 || A > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
            }
            let Y = 0;
            if (q !== void 0) {
                if (Y = Buffer.byteLength(q), Y > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${Y}`, "SyntaxError")
            }
            JmA(this, A, q, Y)
        }
        send(A) {
            rK.brandCheck(this, __);
            let q = "WebSocket.send";
            if (rK.argumentLengthCheck(arguments, 1, q), A = rK.converters.WebSocketSendData(A, q, "data"), QFK(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
            if (!UFK(this) || dFK(this)) return;
            if (typeof A === "string") {
                let K = Buffer.byteLength(A);
                this.#q += K, this.#Y.add(A, () => {
                    this.#q -= K
                }, h41.string)
            } else if (DmA.isArrayBuffer(A)) this.#q += A.byteLength, this.#Y.add(A, () => {
                this.#q -= A.byteLength
            }, h41.arrayBuffer);
            else if (ArrayBuffer.isView(A)) this.#q += A.byteLength, this.#Y.add(A, () => {
                this.#q -= A.byteLength
            }, h41.typedArray);
            else if (MmA(A)) this.#q += A.size, this.#Y.add(A, () => {
                this.#q -= A.size
            }, h41.blob)
        }
        get readyState() {
            return rK.brandCheck(this, __), this[Va1]
        }
        get bufferedAmount() {
            return rK.brandCheck(this, __), this.#q
        }
        get url() {
            return rK.brandCheck(this, __), mFK(this[$mA])
        }
        get extensions() {
            return rK.brandCheck(this, __), this.#z
        }
        get protocol() {
            return rK.brandCheck(this, __), this.#K
        }
        get onopen() {
            return rK.brandCheck(this, __), this.#A.open
        }
        set onopen(A) {
            if (rK.brandCheck(this, __), this.#A.open) this.removeEventListener("open", this.#A.open);
            if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
            else this.#A.open = null
        }
        get onerror() {
            return rK.brandCheck(this, __), this.#A.error
        }
        set onerror(A) {
            if (rK.brandCheck(this, __), this.#A.error) this.removeEventListener("error", this.#A.error);
            if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
            else this.#A.error = null
        }
        get onclose() {
            return rK.brandCheck(this, __), this.#A.close
        }
        set onclose(A) {
            if (rK.brandCheck(this, __), this.#A.close) this.removeEventListener("close", this.#A.close);
            if (typeof A === "function") this.#A.close = A, this.addEventListener("close", A);
            else this.#A.close = null
        }
        get onmessage() {
            return rK.brandCheck(this, __), this.#A.message
        }
        set onmessage(A) {
            if (rK.brandCheck(this, __), this.#A.message) this.removeEventListener("message", this.#A.message);
            if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
            else this.#A.message = null
        }
        get binaryType() {
            return rK.brandCheck(this, __), this[S41]
        }
        set binaryType(A) {
            if (rK.brandCheck(this, __), A !== "blob" && A !== "arraybuffer") this[S41] = "blob";
            else this[S41] = A
        }
        #w(A, q) {
            this[HmA] = A;
            let K = new iFK(this, q);
            K.on("drain", sFK), K.on("error", tFK.bind(this)), A.socket.ws = this, this[pFK] = K, this.#Y = new aFK(A.socket), this[Va1] = Eh6.OPEN;
            let Y = A.headersList.get("sec-websocket-extensions");
            if (Y !== null) this.#z = Y;
            let z = A.headersList.get("sec-websocket-protocol");
            if (z !== null) this.#K = z;
            jmA("open", this)
        }
    }
    __.CONNECTING = __.prototype.CONNECTING = Eh6.CONNECTING;
    __.OPEN = __.prototype.OPEN = Eh6.OPEN;
    __.CLOSING = __.prototype.CLOSING = Eh6.CLOSING;
    __.CLOSED = __.prototype.CLOSED = Eh6.CLOSED;
    Object.defineProperties(__.prototype, {
        CONNECTING: Fr,
        OPEN: Fr,
        CLOSING: Fr,
        CLOSED: Fr,
        url: Ly,
        readyState: Ly,
        bufferedAmount: Ly,
        onopen: Ly,
        onerror: Ly,
        onclose: Ly,
        close: Ly,
        onmessage: Ly,
        binaryType: Ly,
        send: Ly,
        extensions: Ly,
        protocol: Ly,
        [Symbol.toStringTag]: {
            value: "WebSocket",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(__, {
        CONNECTING: Fr,
        OPEN: Fr,
        CLOSING: Fr,
        CLOSED: Fr
    });
    rK.converters["sequence<DOMString>"] = rK.sequenceConverter(rK.converters.DOMString);
    rK.converters["DOMString or sequence<DOMString>"] = function(A, q, K) {
        if (rK.util.Type(A) === "Object" && Symbol.iterator in A) return rK.converters["sequence<DOMString>"](A);
        return rK.converters.DOMString(A, q, K)
    };
    rK.converters.WebSocketInit = rK.dictionaryConverter([{
        key: "protocols",
        converter: rK.converters["DOMString or sequence<DOMString>"],
        defaultValue: () => []
    }, {
        key: "dispatcher",
        converter: rK.converters.any,
        defaultValue: () => nFK()
    }, {
        key: "headers",
        converter: rK.nullableConverter(rK.converters.HeadersInit)
    }]);
    rK.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(A) {
        if (rK.util.Type(A) === "Object" && !(Symbol.iterator in A)) return rK.converters.WebSocketInit(A);
        return {
            protocols: rK.converters["DOMString or sequence<DOMString>"](A)
        }
    };
    rK.converters.WebSocketSendData = function(A) {
        if (rK.util.Type(A) === "Object") {
            if (MmA(A)) return rK.converters.Blob(A, {
                strict: !1
            });
            if (ArrayBuffer.isView(A) || DmA.isArrayBuffer(A)) return rK.converters.BufferSource(A)
        }
        return rK.converters.USVString(A)
    };

    function sFK() {
        this.ws[HmA].socket.resume()
    }

    function tFK(A) {
        let q, K;
        if (A instanceof oFK) q = A.reason, K = A.code;
        else q = A.message;
        jmA("error", this, () => new rFK("error", {
            error: A,
            message: q
        })), JmA(this, K)
    }
    XmA.exports = {
        WebSocket: __
    }
})
// @from(Ln 62408, Col 4)
ka1 = x((iO_, WmA) => {
    function eFK(A) {
        return A.indexOf("\x00") === -1
    }

    function ApK(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; q++)
            if (A.charCodeAt(q) < 48 || A.charCodeAt(q) > 57) return !1;
        return !0
    }

    function qpK(A) {
        return new Promise((q) => {
            setTimeout(q, A).unref()
        })
    }
    WmA.exports = {
        isValidLastEventId: eFK,
        isASCIINumber: ApK,
        delay: qpK
    }
})
// @from(Ln 62431, Col 4)
vmA = x((nO_, TmA) => {
    var {
        Transform: KpK
    } = x6("node:stream"), {
        isASCIINumber: ZmA,
        isValidLastEventId: GmA
    } = ka1(), HQ = [239, 187, 191];
    class fmA extends KpK {
        state = null;
        checkBOM = !0;
        crlfCheck = !1;
        eventEndCheck = !1;
        buffer = null;
        pos = 0;
        event = {
            data: void 0,
            event: void 0,
            id: void 0,
            retry: void 0
        };
        constructor(A = {}) {
            A.readableObjectMode = !0;
            super(A);
            if (this.state = A.eventSourceSettings || {}, A.push) this.push = A.push
        }
        _transform(A, q, K) {
            if (A.length === 0) {
                K();
                return
            }
            if (this.buffer) this.buffer = Buffer.concat([this.buffer, A]);
            else this.buffer = A;
            if (this.checkBOM) switch (this.buffer.length) {
                case 1:
                    if (this.buffer[0] === HQ[0]) {
                        K();
                        return
                    }
                    this.checkBOM = !1, K();
                    return;
                case 2:
                    if (this.buffer[0] === HQ[0] && this.buffer[1] === HQ[1]) {
                        K();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                case 3:
                    if (this.buffer[0] === HQ[0] && this.buffer[1] === HQ[1] && this.buffer[2] === HQ[2]) {
                        this.buffer = Buffer.alloc(0), this.checkBOM = !1, K();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                default:
                    if (this.buffer[0] === HQ[0] && this.buffer[1] === HQ[1] && this.buffer[2] === HQ[2]) this.buffer = this.buffer.subarray(3);
                    this.checkBOM = !1;
                    break
            }
            while (this.pos < this.buffer.length) {
                if (this.eventEndCheck) {
                    if (this.crlfCheck) {
                        if (this.buffer[this.pos] === 10) {
                            this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.crlfCheck = !1;
                            continue
                        }
                        this.crlfCheck = !1
                    }
                    if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
                        if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
                        if (this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.event.data !== void 0 || this.event.event || this.event.id || this.event.retry) this.processEvent(this.event);
                        this.clearEvent();
                        continue
                    }
                    this.eventEndCheck = !1;
                    continue
                }
                if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
                    if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
                    this.parseLine(this.buffer.subarray(0, this.pos), this.event), this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.eventEndCheck = !0;
                    continue
                }
                this.pos++
            }
            K()
        }
        parseLine(A, q) {
            if (A.length === 0) return;
            let K = A.indexOf(58);
            if (K === 0) return;
            let Y = "",
                z = "";
            if (K !== -1) {
                Y = A.subarray(0, K).toString("utf8");
                let _ = K + 1;
                if (A[_] === 32) ++_;
                z = A.subarray(_).toString("utf8")
            } else Y = A.toString("utf8"), z = "";
            switch (Y) {
                case "data":
                    if (q[Y] === void 0) q[Y] = z;
                    else q[Y] += `
${z}`;
                    break;
                case "retry":
                    if (ZmA(z)) q[Y] = z;
                    break;
                case "id":
                    if (GmA(z)) q[Y] = z;
                    break;
                case "event":
                    if (z.length > 0) q[Y] = z;
                    break
            }
        }
        processEvent(A) {
            if (A.retry && ZmA(A.retry)) this.state.reconnectionTime = parseInt(A.retry, 10);
            if (A.id && GmA(A.id)) this.state.lastEventId = A.id;
            if (A.data !== void 0) this.push({
                type: A.event || "message",
                options: {
                    data: A.data,
                    lastEventId: this.state.lastEventId,
                    origin: this.state.origin
                }
            })
        }
        clearEvent() {
            this.event = {
                data: void 0,
                event: void 0,
                id: void 0,
                retry: void 0
            }
        }
    }
    TmA.exports = {
        EventSourceStream: fmA
    }
})
// @from(Ln 62571, Col 4)
hmA = x((rO_, RmA) => {
    var {
        pipeline: YpK
    } = x6("node:stream"), {
        fetching: zpK
    } = Dh6(), {
        makeRequest: _pK
    } = UH6(), {
        webidl: jQ
    } = vP(), {
        EventSourceStream: wpK
    } = vmA(), {
        parseMIMEType: OpK
    } = hT(), {
        createFastMessageEvent: $pK
    } = rH6(), {
        isNetworkError: NmA
    } = Jh6(), {
        delay: HpK
    } = ka1(), {
        kEnumerableProperty: i76
    } = Y9(), {
        environmentSettingsObject: VmA
    } = SV(), kmA = !1, EmA = 3000, yh6 = 0, ymA = 1, Lh6 = 2, jpK = "anonymous", JpK = "use-credentials";
    class eH6 extends EventTarget {
        #A = {
            open: null,
            error: null,
            message: null
        };
        #q = null;
        #K = !1;
        #z = yh6;
        #Y = null;
        #w = null;
        #_;
        #$;
        constructor(A, q = {}) {
            super();
            jQ.util.markAsUncloneable(this);
            let K = "EventSource constructor";
            if (jQ.argumentLengthCheck(arguments, 1, K), !kmA) kmA = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
                code: "UNDICI-ES"
            });
            A = jQ.converters.USVString(A, K, "url"), q = jQ.converters.EventSourceInitDict(q, K, "eventSourceInitDict"), this.#_ = q.dispatcher, this.#$ = {
                lastEventId: "",
                reconnectionTime: EmA
            };
            let Y = VmA,
                z;
            try {
                z = new URL(A, Y.settingsObject.baseUrl), this.#$.origin = z.origin
            } catch (O) {
                throw new DOMException(O, "SyntaxError")
            }
            this.#q = z.href;
            let _ = jpK;
            if (q.withCredentials) _ = JpK, this.#K = !0;
            let w = {
                redirect: "follow",
                keepalive: !0,
                mode: "cors",
                credentials: _ === "anonymous" ? "same-origin" : "omit",
                referrer: "no-referrer"
            };
            w.client = VmA.settingsObject, w.headersList = [
                ["accept", {
                    name: "accept",
                    value: "text/event-stream"
                }]
            ], w.cache = "no-store", w.initiator = "other", w.urlList = [new URL(this.#q)], this.#Y = _pK(w), this.#H()
        }
        get readyState() {
            return this.#z
        }
        get url() {
            return this.#q
        }
        get withCredentials() {
            return this.#K
        }
        #H() {
            if (this.#z === Lh6) return;
            this.#z = yh6;
            let A = {
                    request: this.#Y,
                    dispatcher: this.#_
                },
                q = (K) => {
                    if (NmA(K)) this.dispatchEvent(new Event("error")), this.close();
                    this.#j()
                };
            A.processResponseEndOfBody = q, A.processResponse = (K) => {
                if (NmA(K))
                    if (K.aborted) {
                        this.close(), this.dispatchEvent(new Event("error"));
                        return
                    } else {
                        this.#j();
                        return
                    } let Y = K.headersList.get("content-type", !0),
                    z = Y !== null ? OpK(Y) : "failure",
                    _ = z !== "failure" && z.essence === "text/event-stream";
                if (K.status !== 200 || _ === !1) {
                    this.close(), this.dispatchEvent(new Event("error"));
                    return
                }
                this.#z = ymA, this.dispatchEvent(new Event("open")), this.#$.origin = K.urlList[K.urlList.length - 1].origin;
                let w = new wpK({
                    eventSourceSettings: this.#$,
                    push: (O) => {
                        this.dispatchEvent($pK(O.type, O.options))
                    }
                });
                YpK(K.body.stream, w, (O) => {
                    if (O?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
                })
            }, this.#w = zpK(A)
        }
        async #j() {
            if (this.#z === Lh6) return;
            if (this.#z = yh6, this.dispatchEvent(new Event("error")), await HpK(this.#$.reconnectionTime), this.#z !== yh6) return;
            if (this.#$.lastEventId.length) this.#Y.headersList.set("last-event-id", this.#$.lastEventId, !0);
            this.#H()
        }
        close() {
            if (jQ.brandCheck(this, eH6), this.#z === Lh6) return;
            this.#z = Lh6, this.#w.abort(), this.#Y = null
        }
        get onopen() {
            return this.#A.open
        }
        set onopen(A) {
            if (this.#A.open) this.removeEventListener("open", this.#A.open);
            if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
            else this.#A.open = null
        }
        get onmessage() {
            return this.#A.message
        }
        set onmessage(A) {
            if (this.#A.message) this.removeEventListener("message", this.#A.message);
            if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
            else this.#A.message = null
        }
        get onerror() {
            return this.#A.error
        }
        set onerror(A) {
            if (this.#A.error) this.removeEventListener("error", this.#A.error);
            if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
            else this.#A.error = null
        }
    }
    var LmA = {
        CONNECTING: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: yh6,
            writable: !1
        },
        OPEN: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: ymA,
            writable: !1
        },
        CLOSED: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: Lh6,
            writable: !1
        }
    };
    Object.defineProperties(eH6, LmA);
    Object.defineProperties(eH6.prototype, LmA);
    Object.defineProperties(eH6.prototype, {
        close: i76,
        onerror: i76,
        onmessage: i76,
        onopen: i76,
        readyState: i76,
        url: i76,
        withCredentials: i76
    });
    jQ.converters.EventSourceInitDict = jQ.dictionaryConverter([{
        key: "withCredentials",
        converter: jQ.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "dispatcher",
        converter: jQ.converters.any
    }]);
    RmA.exports = {
        EventSource: eH6,
        defaultReconnectionTime: EmA
    }
})
// @from(Ln 62773, Col 0)
function Rh6(A) {
    return (q, K, Y) => {
        if (typeof K === "function") Y = K, K = null;
        if (!q || typeof q !== "string" && typeof q !== "object" && !(q instanceof URL)) throw new C41("invalid url");
        if (K != null && typeof K !== "object") throw new C41("invalid opts");
        if (K && K.path != null) {
            if (typeof K.path !== "string") throw new C41("invalid opts.path");
            let w = K.path;
            if (!K.path.startsWith("/")) w = `/${w}`;
            q = new URL(I41.parseOrigin(q).origin + w)
        } else {
            if (!K) K = typeof q === "object" ? q : {};
            q = I41.parseURL(q)
        }
        let {
            agent: z,
            dispatcher: _ = WpK()
        } = K;
        if (z) throw new C41("unsupported opts.agent. Did you mean opts.client?");
        return A.call(_, {
            ...K,
            origin: q.origin,
            path: q.search ? `${q.pathname}${q.search}` : q.pathname,
            method: K.method || (K.body ? "PUT" : "GET")
        }, Y)
    }
}
// @from(Ln 62800, Col 4)
oO_
// @from(Ln 62800, Col 9)
MpK
// @from(Ln 62800, Col 14)
aO_
// @from(Ln 62800, Col 19)
sO_
// @from(Ln 62800, Col 24)
DpK
// @from(Ln 62800, Col 29)
tO_
// @from(Ln 62800, Col 34)
XpK
// @from(Ln 62800, Col 39)
eO_
// @from(Ln 62800, Col 44)
PpK
// @from(Ln 62800, Col 49)
I41
// @from(Ln 62800, Col 54)
C41
// @from(Ln 62800, Col 59)
Aj6
// @from(Ln 62800, Col 64)
A$_
// @from(Ln 62800, Col 69)
q$_
// @from(Ln 62800, Col 74)
K$_
// @from(Ln 62800, Col 79)
Y$_
// @from(Ln 62800, Col 84)
z$_
// @from(Ln 62800, Col 89)
_$_
// @from(Ln 62800, Col 94)
WpK
// @from(Ln 62800, Col 99)
ZpK
// @from(Ln 62800, Col 104)
w$_
// @from(Ln 62800, Col 109)
O$_
// @from(Ln 62800, Col 114)
$$_
// @from(Ln 62800, Col 119)
Ea1
// @from(Ln 62800, Col 124)
ya1
// @from(Ln 62800, Col 129)
TpK
// @from(Ln 62800, Col 134)
vpK
// @from(Ln 62800, Col 139)
b41
// @from(Ln 62800, Col 144)
H$_
// @from(Ln 62800, Col 149)
NpK
// @from(Ln 62800, Col 154)
VpK
// @from(Ln 62800, Col 159)
kpK
// @from(Ln 62800, Col 164)
EpK
// @from(Ln 62800, Col 169)
ypK
// @from(Ln 62800, Col 174)
LpK
// @from(Ln 62800, Col 179)
j$_
// @from(Ln 62800, Col 184)
J$_
// @from(Ln 62800, Col 189)
GpK
// @from(Ln 62800, Col 194)
fpK
// @from(Ln 62800, Col 199)
RpK
// @from(Ln 62800, Col 204)
M$_
// @from(Ln 62800, Col 209)
D$_
// @from(Ln 62800, Col 214)
X$_
// @from(Ln 62800, Col 219)
P$_
// @from(Ln 62800, Col 224)
W$_
// @from(Ln 62800, Col 229)
Z$_
// @from(Ln 62800, Col 234)
G$_
// @from(Ln 62800, Col 239)
f$_
// @from(Ln 62800, Col 244)
T$_
// @from(Ln 62800, Col 249)
hpK
// @from(Ln 62800, Col 254)
SpK
// @from(Ln 62800, Col 259)
CpK
// @from(Ln 62800, Col 264)
IpK
// @from(Ln 62800, Col 269)
bpK
// @from(Ln 62800, Col 274)
xpK
// @from(Ln 62800, Col 279)
v$_
// @from(Ln 62801, Col 4)
La1 = E(() => {
    oO_ = oR6(), MpK = RR6(), aO_ = SH6(), sO_ = MCA(), DpK = CH6(), tO_ = Go1(), XpK = ICA(), eO_ = FCA(), PpK = mz(), I41 = Y9(), {
        InvalidArgumentError: C41
    } = PpK, Aj6 = IIA(), A$_ = SR6(), q$_ = do1(), K$_ = ZbA(), Y$_ = lo1(), z$_ = Io1(), _$_ = Q71(), {
        getGlobalDispatcher: WpK,
        setGlobalDispatcher: ZpK
    } = a71(), w$_ = s71(), O$_ = C71(), $$_ = I71();
    Object.assign(MpK.prototype, Aj6);
    Ea1 = DpK, ya1 = XpK, TpK = {
        redirect: kbA(),
        retry: ybA(),
        dump: hbA(),
        dns: xbA()
    }, vpK = {
        parseHeaders: I41.parseHeaders,
        headerNameToString: I41.headerNameToString
    };
    b41 = ZpK;
    H$_ = Dh6().fetch;
    NpK = p76().Headers, VpK = Jh6().Response, kpK = UH6().Request, EpK = mR6().FormData, ypK = globalThis.File ?? x6("node:buffer").File, LpK = axA().FileReader;
    ({
        setGlobalOrigin: j$_,
        getGlobalOrigin: J$_
    } = hr1()), {
        CacheStorage: GpK
    } = _uA(), {
        kConstruct: fpK
    } = Z41();
    RpK = new GpK(fpK);
    ({
        deleteCookie: M$_,
        getCookies: D$_,
        getSetCookies: X$_,
        setCookie: P$_
    } = ZuA()), {
        parseMIMEType: W$_,
        serializeAMimeType: Z$_
    } = hT(), {
        CloseEvent: G$_,
        ErrorEvent: f$_,
        MessageEvent: T$_
    } = rH6();
    hpK = PmA().WebSocket, SpK = Rh6(Aj6.request), CpK = Rh6(Aj6.stream), IpK = Rh6(Aj6.pipeline), bpK = Rh6(Aj6.connect), xpK = Rh6(Aj6.upgrade);
    ({
        EventSource: v$_
    } = hmA())
})
// @from(Ln 62849, Col 0)
function CmA() {
    lS.cache.clear?.(), k("Cleared CA certificates cache")
}
// @from(Ln 62852, Col 4)
lS
// @from(Ln 62853, Col 4)
hh6 = E(() => {
    SA();
    U4();
    H1();
    A8();
    lS = e1(() => {
        let A = aw6("--use-system-ca") || aw6("--use-openssl-ca"),
            q = process.env.NODE_EXTRA_CA_CERTS;
        if (k(`CA certs: useSystemCA=${A}, extraCertsPath=${q}`), !A && !q) return;
        let K = x6("tls"),
            Y = [];
        if (A) {
            let z = K.getCACertificates,
                _ = z?.("system");
            if (_ && _.length > 0) Y.push(..._), k(`CA certs: Loaded ${Y.length} system CA certificates (--use-system-ca)`);
            else if (!z && !q) {
                k("CA certs: --use-system-ca set but system CA API unavailable, deferring to runtime");
                return
            } else Y.push(...K.rootCertificates), k(`CA certs: Loaded ${Y.length} bundled root certificates as base (--use-system-ca fallback)`)
        } else Y.push(...K.rootCertificates), k(`CA certs: Loaded ${Y.length} bundled root certificates as base`);
        if (q) try {
            let z = $1().readFileSync(q, {
                encoding: "utf8"
            });
            Y.push(z), k(`CA certs: Appended extra certificates from NODE_EXTRA_CA_CERTS (${q})`)
        } catch (z) {
            k(`CA certs: Failed to read NODE_EXTRA_CA_CERTS file (${q}): ${z}`, {
                level: "error"
            })
        }
        return Y.length > 0 ? Y : void 0
    })
})
// @from(Ln 62890, Col 0)
function iS() {
    let A = Ry(),
        q = lS();
    if (!A && !q) return;
    return {
        ...A,
        ...q && {
            ca: q
        }
    }
}
// @from(Ln 62902, Col 0)
function u41() {
    let A = Ry(),
        q = lS();
    if (!A && !q) return {};
    let K = {
        ...A,
        ...q && {
            ca: q
        }
    };
    if (typeof Bun < "u") return {
        tls: K
    };
    return k("TLS: Created undici agent with custom certificates"), {
        dispatcher: new Ea1({
            connect: {
                cert: K.cert,
                key: K.key,
                passphrase: K.passphrase,
                ...K.ca && {
                    ca: K.ca
                }
            },
            pipelining: 1
        })
    }
}
// @from(Ln 62930, Col 0)
function ImA() {
    Ry.cache.clear?.(), x41.cache.clear?.(), k("Cleared mTLS configuration cache")
}
// @from(Ln 62934, Col 0)
function bmA() {
    if (!Ry()) return;
    if (process.env.NODE_EXTRA_CA_CERTS) k("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Ln 62938, Col 4)
Ry
// @from(Ln 62938, Col 8)
x41