
// @from(Ln 90762, Col 4)
ab8 = R((p72, ob8) => {
    var {
        kState: l$1,
        kError: Wo6,
        kResult: db8,
        kAborted: qL1,
        kLastProgressEventFired: Go6
    } = Po6(), {
        ProgressEvent: wJ3
    } = gb8(), {
        getEncoding: cb8
    } = pb8(), {
        serializeAMimeType: HJ3,
        parseMIMEType: lb8
    } = qV(), {
        types: $J3
    } = h1("node:util"), {
        StringDecoder: ib8
    } = h1("string_decoder"), {
        btoa: nb8
    } = h1("node:buffer"), OJ3 = {
        enumerable: !0,
        writable: !1,
        configurable: !1
    };

    function _J3(A, q, K, Y) {
        if (A[l$1] === "loading") throw new DOMException("Invalid state", "InvalidStateError");
        A[l$1] = "loading", A[db8] = null, A[Wo6] = null;
        let w = q.stream().getReader(),
            H = [],
            $ = w.read(),
            O = !0;
        (async () => {
            while (!A[qL1]) try {
                let {
                    done: _,
                    value: J
                } = await $;
                if (O && !A[qL1]) queueMicrotask(() => {
                    Jn("loadstart", A)
                });
                if (O = !1, !_ && $J3.isUint8Array(J)) {
                    if (H.push(J), (A[Go6] === void 0 || Date.now() - A[Go6] >= 50) && !A[qL1]) A[Go6] = Date.now(), queueMicrotask(() => {
                        Jn("progress", A)
                    });
                    $ = w.read()
                } else if (_) {
                    queueMicrotask(() => {
                        A[l$1] = "done";
                        try {
                            let X = JJ3(H, K, q.type, Y);
                            if (A[qL1]) return;
                            A[db8] = X, Jn("load", A)
                        } catch (X) {
                            A[Wo6] = X, Jn("error", A)
                        }
                        if (A[l$1] !== "loading") Jn("loadend", A)
                    });
                    break
                }
            } catch (_) {
                if (A[qL1]) return;
                queueMicrotask(() => {
                    if (A[l$1] = "done", A[Wo6] = _, Jn("error", A), A[l$1] !== "loading") Jn("loadend", A)
                });
                break
            }
        })()
    }

    function Jn(A, q) {
        let K = new wJ3(A, {
            bubbles: !1,
            cancelable: !1
        });
        q.dispatchEvent(K)
    }

    function JJ3(A, q, K, Y) {
        switch (q) {
            case "DataURL": {
                let z = "data:",
                    w = lb8(K || "application/octet-stream");
                if (w !== "failure") z += HJ3(w);
                z += ";base64,";
                let H = new ib8("latin1");
                for (let $ of A) z += nb8(H.write($));
                return z += nb8(H.end()), z
            }
            case "Text": {
                let z = "failure";
                if (Y) z = cb8(Y);
                if (z === "failure" && K) {
                    let w = lb8(K);
                    if (w !== "failure") z = cb8(w.parameters.get("charset"))
                }
                if (z === "failure") z = "UTF-8";
                return XJ3(A, z)
            }
            case "ArrayBuffer":
                return rb8(A).buffer;
            case "BinaryString": {
                let z = "",
                    w = new ib8("latin1");
                for (let H of A) z += w.write(H);
                return z += w.end(), z
            }
        }
    }

    function XJ3(A, q) {
        let K = rb8(A),
            Y = DJ3(K),
            z = 0;
        if (Y !== null) q = Y, z = Y === "UTF-8" ? 3 : 2;
        let w = K.slice(z);
        return new TextDecoder(q).decode(w)
    }

    function DJ3(A) {
        let [q, K, Y] = A;
        if (q === 239 && K === 187 && Y === 191) return "UTF-8";
        else if (q === 254 && K === 255) return "UTF-16BE";
        else if (q === 255 && K === 254) return "UTF-16LE";
        return null
    }

    function rb8(A) {
        let q = A.reduce((Y, z) => {
                return Y + z.byteLength
            }, 0),
            K = 0;
        return A.reduce((Y, z) => {
            return Y.set(z, K), K += z.byteLength, Y
        }, new Uint8Array(q))
    }
    ob8.exports = {
        staticPropertyDescriptors: OJ3,
        readOperation: _J3,
        fireAProgressEvent: Jn
    }
})
// @from(Ln 90905, Col 4)
Au8 = R((d72, eb8) => {
    var {
        staticPropertyDescriptors: i$1,
        readOperation: p66,
        fireAProgressEvent: sb8
    } = ab8(), {
        kState: q81,
        kError: tb8,
        kResult: d66,
        kEvents: Rz,
        kAborted: jJ3
    } = Po6(), {
        webidl: o2
    } = OM(), {
        kEnumerableProperty: zV
    } = W9();
    class T2 extends EventTarget {
        constructor() {
            super();
            this[q81] = "empty", this[d66] = null, this[tb8] = null, this[Rz] = {
                loadend: null,
                error: null,
                abort: null,
                load: null,
                progress: null,
                loadstart: null
            }
        }
        readAsArrayBuffer(A) {
            o2.brandCheck(this, T2), o2.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), A = o2.converters.Blob(A, {
                strict: !1
            }), p66(this, A, "ArrayBuffer")
        }
        readAsBinaryString(A) {
            o2.brandCheck(this, T2), o2.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), A = o2.converters.Blob(A, {
                strict: !1
            }), p66(this, A, "BinaryString")
        }
        readAsText(A, q = void 0) {
            if (o2.brandCheck(this, T2), o2.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), A = o2.converters.Blob(A, {
                    strict: !1
                }), q !== void 0) q = o2.converters.DOMString(q, "FileReader.readAsText", "encoding");
            p66(this, A, "Text", q)
        }
        readAsDataURL(A) {
            o2.brandCheck(this, T2), o2.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), A = o2.converters.Blob(A, {
                strict: !1
            }), p66(this, A, "DataURL")
        }
        abort() {
            if (this[q81] === "empty" || this[q81] === "done") {
                this[d66] = null;
                return
            }
            if (this[q81] === "loading") this[q81] = "done", this[d66] = null;
            if (this[jJ3] = !0, sb8("abort", this), this[q81] !== "loading") sb8("loadend", this)
        }
        get readyState() {
            switch (o2.brandCheck(this, T2), this[q81]) {
                case "empty":
                    return this.EMPTY;
                case "loading":
                    return this.LOADING;
                case "done":
                    return this.DONE
            }
        }
        get result() {
            return o2.brandCheck(this, T2), this[d66]
        }
        get error() {
            return o2.brandCheck(this, T2), this[tb8]
        }
        get onloadend() {
            return o2.brandCheck(this, T2), this[Rz].loadend
        }
        set onloadend(A) {
            if (o2.brandCheck(this, T2), this[Rz].loadend) this.removeEventListener("loadend", this[Rz].loadend);
            if (typeof A === "function") this[Rz].loadend = A, this.addEventListener("loadend", A);
            else this[Rz].loadend = null
        }
        get onerror() {
            return o2.brandCheck(this, T2), this[Rz].error
        }
        set onerror(A) {
            if (o2.brandCheck(this, T2), this[Rz].error) this.removeEventListener("error", this[Rz].error);
            if (typeof A === "function") this[Rz].error = A, this.addEventListener("error", A);
            else this[Rz].error = null
        }
        get onloadstart() {
            return o2.brandCheck(this, T2), this[Rz].loadstart
        }
        set onloadstart(A) {
            if (o2.brandCheck(this, T2), this[Rz].loadstart) this.removeEventListener("loadstart", this[Rz].loadstart);
            if (typeof A === "function") this[Rz].loadstart = A, this.addEventListener("loadstart", A);
            else this[Rz].loadstart = null
        }
        get onprogress() {
            return o2.brandCheck(this, T2), this[Rz].progress
        }
        set onprogress(A) {
            if (o2.brandCheck(this, T2), this[Rz].progress) this.removeEventListener("progress", this[Rz].progress);
            if (typeof A === "function") this[Rz].progress = A, this.addEventListener("progress", A);
            else this[Rz].progress = null
        }
        get onload() {
            return o2.brandCheck(this, T2), this[Rz].load
        }
        set onload(A) {
            if (o2.brandCheck(this, T2), this[Rz].load) this.removeEventListener("load", this[Rz].load);
            if (typeof A === "function") this[Rz].load = A, this.addEventListener("load", A);
            else this[Rz].load = null
        }
        get onabort() {
            return o2.brandCheck(this, T2), this[Rz].abort
        }
        set onabort(A) {
            if (o2.brandCheck(this, T2), this[Rz].abort) this.removeEventListener("abort", this[Rz].abort);
            if (typeof A === "function") this[Rz].abort = A, this.addEventListener("abort", A);
            else this[Rz].abort = null
        }
    }
    T2.EMPTY = T2.prototype.EMPTY = 0;
    T2.LOADING = T2.prototype.LOADING = 1;
    T2.DONE = T2.prototype.DONE = 2;
    Object.defineProperties(T2.prototype, {
        EMPTY: i$1,
        LOADING: i$1,
        DONE: i$1,
        readAsArrayBuffer: zV,
        readAsBinaryString: zV,
        readAsText: zV,
        readAsDataURL: zV,
        abort: zV,
        readyState: zV,
        result: zV,
        error: zV,
        onloadstart: zV,
        onprogress: zV,
        onload: zV,
        onabort: zV,
        onerror: zV,
        onloadend: zV,
        [Symbol.toStringTag]: {
            value: "FileReader",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(T2, {
        EMPTY: i$1,
        LOADING: i$1,
        DONE: i$1
    });
    eb8.exports = {
        FileReader: T2
    }
})
// @from(Ln 91064, Col 4)
c66 = R((c72, qu8) => {
    qu8.exports = {
        kConstruct: h$().kConstruct
    }
})
// @from(Ln 91069, Col 4)
zu8 = R((l72, Yu8) => {
    var MJ3 = h1("node:assert"),
        {
            URLSerializer: Ku8
        } = qV(),
        {
            isValidHeaderName: PJ3
        } = bT();

    function WJ3(A, q, K = !1) {
        let Y = Ku8(A, K),
            z = Ku8(q, K);
        return Y === z
    }

    function GJ3(A) {
        MJ3(A !== null);
        let q = [];
        for (let K of A.split(","))
            if (K = K.trim(), PJ3(K)) q.push(K);
        return q
    }
    Yu8.exports = {
        urlEquals: WJ3,
        getFieldValues: GJ3
    }
})
// @from(Ln 91096, Col 4)
$u8 = R((i72, Hu8) => {
    var {
        kConstruct: ZJ3
    } = c66(), {
        urlEquals: fJ3,
        getFieldValues: Zo6
    } = zu8(), {
        kEnumerableProperty: K81,
        isDisturbed: VJ3
    } = W9(), {
        webidl: zK
    } = OM(), {
        Response: NJ3,
        cloneResponse: TJ3,
        fromInnerResponse: vJ3
    } = sk1(), {
        Request: Gg,
        fromInnerRequest: EJ3
    } = c$1(), {
        kState: BC
    } = ti(), {
        fetching: kJ3
    } = ek1(), {
        urlIsHttpHttpsScheme: l66,
        createDeferredPromise: n$1,
        readAllBytes: LJ3
    } = bT(), fo6 = h1("node:assert");
    class xb {
        #A;
        constructor() {
            if (arguments[0] !== ZJ3) zK.illegalConstructor();
            zK.util.markAsUncloneable(this), this.#A = arguments[1]
        }
        async match(A, q = {}) {
            zK.brandCheck(this, xb);
            let K = "Cache.match";
            zK.argumentLengthCheck(arguments, 1, K), A = zK.converters.RequestInfo(A, K, "request"), q = zK.converters.CacheQueryOptions(q, K, "options");
            let Y = this.#Y(A, q, 1);
            if (Y.length === 0) return;
            return Y[0]
        }
        async matchAll(A = void 0, q = {}) {
            zK.brandCheck(this, xb);
            let K = "Cache.matchAll";
            if (A !== void 0) A = zK.converters.RequestInfo(A, K, "request");
            return q = zK.converters.CacheQueryOptions(q, K, "options"), this.#Y(A, q)
        }
        async add(A) {
            zK.brandCheck(this, xb);
            let q = "Cache.add";
            zK.argumentLengthCheck(arguments, 1, q), A = zK.converters.RequestInfo(A, q, "request");
            let K = [A];
            return await this.addAll(K)
        }
        async addAll(A) {
            zK.brandCheck(this, xb);
            let q = "Cache.addAll";
            zK.argumentLengthCheck(arguments, 1, q);
            let K = [],
                Y = [];
            for (let X of A) {
                if (X === void 0) throw zK.errors.conversionFailed({
                    prefix: q,
                    argument: "Argument 1",
                    types: ["undefined is not allowed"]
                });
                if (X = zK.converters.RequestInfo(X), typeof X === "string") continue;
                let D = X[BC];
                if (!l66(D.url) || D.method !== "GET") throw zK.errors.exception({
                    header: q,
                    message: "Expected http/s scheme when method is not GET."
                })
            }
            let z = [];
            for (let X of A) {
                let D = new Gg(X)[BC];
                if (!l66(D.url)) throw zK.errors.exception({
                    header: q,
                    message: "Expected http/s scheme."
                });
                D.initiator = "fetch", D.destination = "subresource", Y.push(D);
                let j = n$1();
                z.push(kJ3({
                    request: D,
                    processResponse(M) {
                        if (M.type === "error" || M.status === 206 || M.status < 200 || M.status > 299) j.reject(zK.errors.exception({
                            header: "Cache.addAll",
                            message: "Received an invalid status code or the request failed."
                        }));
                        else if (M.headersList.contains("vary")) {
                            let P = Zo6(M.headersList.get("vary"));
                            for (let W of P)
                                if (W === "*") {
                                    j.reject(zK.errors.exception({
                                        header: "Cache.addAll",
                                        message: "invalid vary field value"
                                    }));
                                    for (let G of z) G.abort();
                                    return
                                }
                        }
                    },
                    processResponseEndOfBody(M) {
                        if (M.aborted) {
                            j.reject(new DOMException("aborted", "AbortError"));
                            return
                        }
                        j.resolve(M)
                    }
                })), K.push(j.promise)
            }
            let H = await Promise.all(K),
                $ = [],
                O = 0;
            for (let X of H) {
                let D = {
                    type: "put",
                    request: Y[O],
                    response: X
                };
                $.push(D), O++
            }
            let _ = n$1(),
                J = null;
            try {
                this.#q($)
            } catch (X) {
                J = X
            }
            return queueMicrotask(() => {
                if (J === null) _.resolve(void 0);
                else _.reject(J)
            }), _.promise
        }
        async put(A, q) {
            zK.brandCheck(this, xb);
            let K = "Cache.put";
            zK.argumentLengthCheck(arguments, 2, K), A = zK.converters.RequestInfo(A, K, "request"), q = zK.converters.Response(q, K, "response");
            let Y = null;
            if (A instanceof Gg) Y = A[BC];
            else Y = new Gg(A)[BC];
            if (!l66(Y.url) || Y.method !== "GET") throw zK.errors.exception({
                header: K,
                message: "Expected an http/s scheme when method is not GET"
            });
            let z = q[BC];
            if (z.status === 206) throw zK.errors.exception({
                header: K,
                message: "Got 206 status"
            });
            if (z.headersList.contains("vary")) {
                let D = Zo6(z.headersList.get("vary"));
                for (let j of D)
                    if (j === "*") throw zK.errors.exception({
                        header: K,
                        message: "Got * vary field value"
                    })
            }
            if (z.body && (VJ3(z.body.stream) || z.body.stream.locked)) throw zK.errors.exception({
                header: K,
                message: "Response body is locked or disturbed"
            });
            let w = TJ3(z),
                H = n$1();
            if (z.body != null) {
                let j = z.body.stream.getReader();
                LJ3(j).then(H.resolve, H.reject)
            } else H.resolve(void 0);
            let $ = [],
                O = {
                    type: "put",
                    request: Y,
                    response: w
                };
            $.push(O);
            let _ = await H.promise;
            if (w.body != null) w.body.source = _;
            let J = n$1(),
                X = null;
            try {
                this.#q($)
            } catch (D) {
                X = D
            }
            return queueMicrotask(() => {
                if (X === null) J.resolve();
                else J.reject(X)
            }), J.promise
        }
        async delete(A, q = {}) {
            zK.brandCheck(this, xb);
            let K = "Cache.delete";
            zK.argumentLengthCheck(arguments, 1, K), A = zK.converters.RequestInfo(A, K, "request"), q = zK.converters.CacheQueryOptions(q, K, "options");
            let Y = null;
            if (A instanceof Gg) {
                if (Y = A[BC], Y.method !== "GET" && !q.ignoreMethod) return !1
            } else fo6(typeof A === "string"), Y = new Gg(A)[BC];
            let z = [],
                w = {
                    type: "delete",
                    request: Y,
                    options: q
                };
            z.push(w);
            let H = n$1(),
                $ = null,
                O;
            try {
                O = this.#q(z)
            } catch (_) {
                $ = _
            }
            return queueMicrotask(() => {
                if ($ === null) H.resolve(!!O?.length);
                else H.reject($)
            }), H.promise
        }
        async keys(A = void 0, q = {}) {
            zK.brandCheck(this, xb);
            let K = "Cache.keys";
            if (A !== void 0) A = zK.converters.RequestInfo(A, K, "request");
            q = zK.converters.CacheQueryOptions(q, K, "options");
            let Y = null;
            if (A !== void 0) {
                if (A instanceof Gg) {
                    if (Y = A[BC], Y.method !== "GET" && !q.ignoreMethod) return []
                } else if (typeof A === "string") Y = new Gg(A)[BC]
            }
            let z = n$1(),
                w = [];
            if (A === void 0)
                for (let H of this.#A) w.push(H[0]);
            else {
                let H = this.#K(Y, q);
                for (let $ of H) w.push($[0])
            }
            return queueMicrotask(() => {
                let H = [];
                for (let $ of w) {
                    let O = EJ3($, new AbortController().signal, "immutable");
                    H.push(O)
                }
                z.resolve(Object.freeze(H))
            }), z.promise
        }
        #q(A) {
            let q = this.#A,
                K = [...q],
                Y = [],
                z = [];
            try {
                for (let w of A) {
                    if (w.type !== "delete" && w.type !== "put") throw zK.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: 'operation type does not match "delete" or "put"'
                    });
                    if (w.type === "delete" && w.response != null) throw zK.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: "delete operation should not have an associated response"
                    });
                    if (this.#K(w.request, w.options, Y).length) throw new DOMException("???", "InvalidStateError");
                    let H;
                    if (w.type === "delete") {
                        if (H = this.#K(w.request, w.options), H.length === 0) return [];
                        for (let $ of H) {
                            let O = q.indexOf($);
                            fo6(O !== -1), q.splice(O, 1)
                        }
                    } else if (w.type === "put") {
                        if (w.response == null) throw zK.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "put operation should have an associated response"
                        });
                        let $ = w.request;
                        if (!l66($.url)) throw zK.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "expected http or https scheme"
                        });
                        if ($.method !== "GET") throw zK.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "not get method"
                        });
                        if (w.options != null) throw zK.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "options must not be defined"
                        });
                        H = this.#K(w.request);
                        for (let O of H) {
                            let _ = q.indexOf(O);
                            fo6(_ !== -1), q.splice(_, 1)
                        }
                        q.push([w.request, w.response]), Y.push([w.request, w.response])
                    }
                    z.push([w.request, w.response])
                }
                return z
            } catch (w) {
                throw this.#A.length = 0, this.#A = K, w
            }
        }
        #K(A, q, K) {
            let Y = [],
                z = K ?? this.#A;
            for (let w of z) {
                let [H, $] = w;
                if (this.#z(A, H, $, q)) Y.push(w)
            }
            return Y
        }
        #z(A, q, K = null, Y) {
            let z = new URL(A.url),
                w = new URL(q.url);
            if (Y?.ignoreSearch) w.search = "", z.search = "";
            if (!fJ3(z, w, !0)) return !1;
            if (K == null || Y?.ignoreVary || !K.headersList.contains("vary")) return !0;
            let H = Zo6(K.headersList.get("vary"));
            for (let $ of H) {
                if ($ === "*") return !1;
                let O = q.headersList.get($),
                    _ = A.headersList.get($);
                if (O !== _) return !1
            }
            return !0
        }
        #Y(A, q, K = 1 / 0) {
            let Y = null;
            if (A !== void 0) {
                if (A instanceof Gg) {
                    if (Y = A[BC], Y.method !== "GET" && !q.ignoreMethod) return []
                } else if (typeof A === "string") Y = new Gg(A)[BC]
            }
            let z = [];
            if (A === void 0)
                for (let H of this.#A) z.push(H[1]);
            else {
                let H = this.#K(Y, q);
                for (let $ of H) z.push($[1])
            }
            let w = [];
            for (let H of z) {
                let $ = vJ3(H, "immutable");
                if (w.push($.clone()), w.length >= K) break
            }
            return Object.freeze(w)
        }
    }
    Object.defineProperties(xb.prototype, {
        [Symbol.toStringTag]: {
            value: "Cache",
            configurable: !0
        },
        match: K81,
        matchAll: K81,
        add: K81,
        addAll: K81,
        put: K81,
        delete: K81,
        keys: K81
    });
    var wu8 = [{
        key: "ignoreSearch",
        converter: zK.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreMethod",
        converter: zK.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreVary",
        converter: zK.converters.boolean,
        defaultValue: () => !1
    }];
    zK.converters.CacheQueryOptions = zK.dictionaryConverter(wu8);
    zK.converters.MultiCacheQueryOptions = zK.dictionaryConverter([...wu8, {
        key: "cacheName",
        converter: zK.converters.DOMString
    }]);
    zK.converters.Response = zK.interfaceConverter(NJ3);
    zK.converters["sequence<RequestInfo>"] = zK.sequenceConverter(zK.converters.RequestInfo);
    Hu8.exports = {
        Cache: xb
    }
})
// @from(Ln 91479, Col 4)
_u8 = R((n72, Ou8) => {
    var {
        kConstruct: KL1
    } = c66(), {
        Cache: i66
    } = $u8(), {
        webidl: wW
    } = OM(), {
        kEnumerableProperty: YL1
    } = W9();
    class Xn {
        #A = new Map;
        constructor() {
            if (arguments[0] !== KL1) wW.illegalConstructor();
            wW.util.markAsUncloneable(this)
        }
        async match(A, q = {}) {
            if (wW.brandCheck(this, Xn), wW.argumentLengthCheck(arguments, 1, "CacheStorage.match"), A = wW.converters.RequestInfo(A), q = wW.converters.MultiCacheQueryOptions(q), q.cacheName != null) {
                if (this.#A.has(q.cacheName)) {
                    let K = this.#A.get(q.cacheName);
                    return await new i66(KL1, K).match(A, q)
                }
            } else
                for (let K of this.#A.values()) {
                    let z = await new i66(KL1, K).match(A, q);
                    if (z !== void 0) return z
                }
        }
        async has(A) {
            wW.brandCheck(this, Xn);
            let q = "CacheStorage.has";
            return wW.argumentLengthCheck(arguments, 1, q), A = wW.converters.DOMString(A, q, "cacheName"), this.#A.has(A)
        }
        async open(A) {
            wW.brandCheck(this, Xn);
            let q = "CacheStorage.open";
            if (wW.argumentLengthCheck(arguments, 1, q), A = wW.converters.DOMString(A, q, "cacheName"), this.#A.has(A)) {
                let Y = this.#A.get(A);
                return new i66(KL1, Y)
            }
            let K = [];
            return this.#A.set(A, K), new i66(KL1, K)
        }
        async delete(A) {
            wW.brandCheck(this, Xn);
            let q = "CacheStorage.delete";
            return wW.argumentLengthCheck(arguments, 1, q), A = wW.converters.DOMString(A, q, "cacheName"), this.#A.delete(A)
        }
        async keys() {
            return wW.brandCheck(this, Xn), [...this.#A.keys()]
        }
    }
    Object.defineProperties(Xn.prototype, {
        [Symbol.toStringTag]: {
            value: "CacheStorage",
            configurable: !0
        },
        match: YL1,
        has: YL1,
        open: YL1,
        delete: YL1,
        keys: YL1
    });
    Ou8.exports = {
        CacheStorage: Xn
    }
})
// @from(Ln 91546, Col 4)
Xu8 = R((r72, Ju8) => {
    Ju8.exports = {
        maxAttributeValueSize: 1024,
        maxNameValuePairSize: 4096
    }
})
// @from(Ln 91552, Col 4)
Vo6 = R((o72, Wu8) => {
    function RJ3(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K >= 0 && K <= 8 || K >= 10 && K <= 31 || K === 127) return !0
        }
        return !1
    }

    function Du8(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 33 || K > 126 || K === 34 || K === 40 || K === 41 || K === 60 || K === 62 || K === 64 || K === 44 || K === 59 || K === 58 || K === 92 || K === 47 || K === 91 || K === 93 || K === 63 || K === 61 || K === 123 || K === 125) throw Error("Invalid cookie name")
        }
    }

    function ju8(A) {
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

    function Mu8(A) {
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 32 || K === 127 || K === 59) throw Error("Invalid cookie path")
        }
    }

    function yJ3(A) {
        if (A.startsWith("-") || A.endsWith(".") || A.endsWith("-")) throw Error("Invalid cookie domain")
    }
    var CJ3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        SJ3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        n66 = Array(61).fill(0).map((A, q) => q.toString().padStart(2, "0"));

    function Pu8(A) {
        if (typeof A === "number") A = new Date(A);
        return `${CJ3[A.getUTCDay()]}, ${n66[A.getUTCDate()]} ${SJ3[A.getUTCMonth()]} ${A.getUTCFullYear()} ${n66[A.getUTCHours()]}:${n66[A.getUTCMinutes()]}:${n66[A.getUTCSeconds()]} GMT`
    }

    function hJ3(A) {
        if (A < 0) throw Error("Invalid cookie max-age")
    }

    function IJ3(A) {
        if (A.name.length === 0) return null;
        Du8(A.name), ju8(A.value);
        let q = [`${A.name}=${A.value}`];
        if (A.name.startsWith("__Secure-")) A.secure = !0;
        if (A.name.startsWith("__Host-")) A.secure = !0, A.domain = null, A.path = "/";
        if (A.secure) q.push("Secure");
        if (A.httpOnly) q.push("HttpOnly");
        if (typeof A.maxAge === "number") hJ3(A.maxAge), q.push(`Max-Age=${A.maxAge}`);
        if (A.domain) yJ3(A.domain), q.push(`Domain=${A.domain}`);
        if (A.path) Mu8(A.path), q.push(`Path=${A.path}`);
        if (A.expires && A.expires.toString() !== "Invalid Date") q.push(`Expires=${Pu8(A.expires)}`);
        if (A.sameSite) q.push(`SameSite=${A.sameSite}`);
        for (let K of A.unparsed) {
            if (!K.includes("=")) throw Error("Invalid unparsed");
            let [Y, ...z] = K.split("=");
            q.push(`${Y.trim()}=${z.join("=")}`)
        }
        return q.join("; ")
    }
    Wu8.exports = {
        isCTLExcludingHtab: RJ3,
        validateCookieName: Du8,
        validateCookiePath: Mu8,
        validateCookieValue: ju8,
        toIMFDate: Pu8,
        stringify: IJ3
    }
})
// @from(Ln 91633, Col 4)
Zu8 = R((a72, Gu8) => {
    var {
        maxNameValuePairSize: xJ3,
        maxAttributeValueSize: bJ3
    } = Xu8(), {
        isCTLExcludingHtab: uJ3
    } = Vo6(), {
        collectASequenceOfCodePointsFast: r66
    } = qV(), BJ3 = h1("node:assert");

    function mJ3(A) {
        if (uJ3(A)) return null;
        let q = "",
            K = "",
            Y = "",
            z = "";
        if (A.includes(";")) {
            let w = {
                position: 0
            };
            q = r66(";", A, w), K = A.slice(w.position)
        } else q = A;
        if (!q.includes("=")) z = q;
        else {
            let w = {
                position: 0
            };
            Y = r66("=", q, w), z = q.slice(w.position + 1)
        }
        if (Y = Y.trim(), z = z.trim(), Y.length + z.length > xJ3) return null;
        return {
            name: Y,
            value: z,
            ...r$1(K)
        }
    }

    function r$1(A, q = {}) {
        if (A.length === 0) return q;
        BJ3(A[0] === ";"), A = A.slice(1);
        let K = "";
        if (A.includes(";")) K = r66(";", A, {
            position: 0
        }), A = A.slice(K.length);
        else K = A, A = "";
        let Y = "",
            z = "";
        if (K.includes("=")) {
            let H = {
                position: 0
            };
            Y = r66("=", K, H), z = K.slice(H.position + 1)
        } else Y = K;
        if (Y = Y.trim(), z = z.trim(), z.length > bJ3) return r$1(A, q);
        let w = Y.toLowerCase();
        if (w === "expires") {
            let H = new Date(z);
            q.expires = H
        } else if (w === "max-age") {
            let H = z.charCodeAt(0);
            if ((H < 48 || H > 57) && z[0] !== "-") return r$1(A, q);
            if (!/^\d+$/.test(z)) return r$1(A, q);
            let $ = Number(z);
            q.maxAge = $
        } else if (w === "domain") {
            let H = z;
            if (H[0] === ".") H = H.slice(1);
            H = H.toLowerCase(), q.domain = H
        } else if (w === "path") {
            let H = "";
            if (z.length === 0 || z[0] !== "/") H = "/";
            else H = z;
            q.path = H
        } else if (w === "secure") q.secure = !0;
        else if (w === "httponly") q.httpOnly = !0;
        else if (w === "samesite") {
            let H = "Default",
                $ = z.toLowerCase();
            if ($.includes("none")) H = "None";
            if ($.includes("strict")) H = "Strict";
            if ($.includes("lax")) H = "Lax";
            q.sameSite = H
        } else q.unparsed ??= [], q.unparsed.push(`${Y}=${z}`);
        return r$1(A, q)
    }
    Gu8.exports = {
        parseSetCookie: mJ3,
        parseUnparsedAttributes: r$1
    }
})
// @from(Ln 91723, Col 4)
Nu8 = R((s72, Vu8) => {
    var {
        parseSetCookie: FJ3
    } = Zu8(), {
        stringify: QJ3
    } = Vo6(), {
        webidl: a9
    } = OM(), {
        Headers: o66
    } = tA1();

    function gJ3(A) {
        a9.argumentLengthCheck(arguments, 1, "getCookies"), a9.brandCheck(A, o66, {
            strict: !1
        });
        let q = A.get("cookie"),
            K = {};
        if (!q) return K;
        for (let Y of q.split(";")) {
            let [z, ...w] = Y.split("=");
            K[z.trim()] = w.join("=")
        }
        return K
    }

    function UJ3(A, q, K) {
        a9.brandCheck(A, o66, {
            strict: !1
        });
        let Y = "deleteCookie";
        a9.argumentLengthCheck(arguments, 2, Y), q = a9.converters.DOMString(q, Y, "name"), K = a9.converters.DeleteCookieAttributes(K), fu8(A, {
            name: q,
            value: "",
            expires: new Date(0),
            ...K
        })
    }

    function pJ3(A) {
        a9.argumentLengthCheck(arguments, 1, "getSetCookies"), a9.brandCheck(A, o66, {
            strict: !1
        });
        let q = A.getSetCookie();
        if (!q) return [];
        return q.map((K) => FJ3(K))
    }

    function fu8(A, q) {
        a9.argumentLengthCheck(arguments, 2, "setCookie"), a9.brandCheck(A, o66, {
            strict: !1
        }), q = a9.converters.Cookie(q);
        let K = QJ3(q);
        if (K) A.append("Set-Cookie", K)
    }
    a9.converters.DeleteCookieAttributes = a9.dictionaryConverter([{
        converter: a9.nullableConverter(a9.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }]);
    a9.converters.Cookie = a9.dictionaryConverter([{
        converter: a9.converters.DOMString,
        key: "name"
    }, {
        converter: a9.converters.DOMString,
        key: "value"
    }, {
        converter: a9.nullableConverter((A) => {
            if (typeof A === "number") return a9.converters["unsigned long long"](A);
            return new Date(A)
        }),
        key: "expires",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters["long long"]),
        key: "maxAge",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters.boolean),
        key: "secure",
        defaultValue: () => null
    }, {
        converter: a9.nullableConverter(a9.converters.boolean),
        key: "httpOnly",
        defaultValue: () => null
    }, {
        converter: a9.converters.USVString,
        key: "sameSite",
        allowedValues: ["Strict", "Lax", "None"]
    }, {
        converter: a9.sequenceConverter(a9.converters.DOMString),
        key: "unparsed",
        defaultValue: () => []
    }]);
    Vu8.exports = {
        getCookies: gJ3,
        deleteCookie: UJ3,
        getSetCookies: pJ3,
        setCookie: fu8
    }
})
// @from(Ln 91835, Col 4)
a$1 = R((t72, vu8) => {
    var {
        webidl: cq
    } = OM(), {
        kEnumerableProperty: wV
    } = W9(), {
        kConstruct: Tu8
    } = h$(), {
        MessagePort: dJ3
    } = h1("node:worker_threads");
    class UT extends Event {
        #A;
        constructor(A, q = {}) {
            if (A === Tu8) {
                super(arguments[1], arguments[2]);
                cq.util.markAsUncloneable(this);
                return
            }
            let K = "MessageEvent constructor";
            cq.argumentLengthCheck(arguments, 1, K), A = cq.converters.DOMString(A, K, "type"), q = cq.converters.MessageEventInit(q, K, "eventInitDict");
            super(A, q);
            this.#A = q, cq.util.markAsUncloneable(this)
        }
        get data() {
            return cq.brandCheck(this, UT), this.#A.data
        }
        get origin() {
            return cq.brandCheck(this, UT), this.#A.origin
        }
        get lastEventId() {
            return cq.brandCheck(this, UT), this.#A.lastEventId
        }
        get source() {
            return cq.brandCheck(this, UT), this.#A.source
        }
        get ports() {
            if (cq.brandCheck(this, UT), !Object.isFrozen(this.#A.ports)) Object.freeze(this.#A.ports);
            return this.#A.ports
        }
        initMessageEvent(A, q = !1, K = !1, Y = null, z = "", w = "", H = null, $ = []) {
            return cq.brandCheck(this, UT), cq.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new UT(A, {
                bubbles: q,
                cancelable: K,
                data: Y,
                origin: z,
                lastEventId: w,
                source: H,
                ports: $
            })
        }
        static createFastMessageEvent(A, q) {
            let K = new UT(Tu8, A, q);
            return K.#A = q, K.#A.data ??= null, K.#A.origin ??= "", K.#A.lastEventId ??= "", K.#A.source ??= null, K.#A.ports ??= [], K
        }
    }
    var {
        createFastMessageEvent: cJ3
    } = UT;
    delete UT.createFastMessageEvent;
    class o$1 extends Event {
        #A;
        constructor(A, q = {}) {
            cq.argumentLengthCheck(arguments, 1, "CloseEvent constructor"), A = cq.converters.DOMString(A, "CloseEvent constructor", "type"), q = cq.converters.CloseEventInit(q);
            super(A, q);
            this.#A = q, cq.util.markAsUncloneable(this)
        }
        get wasClean() {
            return cq.brandCheck(this, o$1), this.#A.wasClean
        }
        get code() {
            return cq.brandCheck(this, o$1), this.#A.code
        }
        get reason() {
            return cq.brandCheck(this, o$1), this.#A.reason
        }
    }
    class Dn extends Event {
        #A;
        constructor(A, q) {
            cq.argumentLengthCheck(arguments, 1, "ErrorEvent constructor");
            super(A, q);
            cq.util.markAsUncloneable(this), A = cq.converters.DOMString(A, "ErrorEvent constructor", "type"), q = cq.converters.ErrorEventInit(q ?? {}), this.#A = q
        }
        get message() {
            return cq.brandCheck(this, Dn), this.#A.message
        }
        get filename() {
            return cq.brandCheck(this, Dn), this.#A.filename
        }
        get lineno() {
            return cq.brandCheck(this, Dn), this.#A.lineno
        }
        get colno() {
            return cq.brandCheck(this, Dn), this.#A.colno
        }
        get error() {
            return cq.brandCheck(this, Dn), this.#A.error
        }
    }
    Object.defineProperties(UT.prototype, {
        [Symbol.toStringTag]: {
            value: "MessageEvent",
            configurable: !0
        },
        data: wV,
        origin: wV,
        lastEventId: wV,
        source: wV,
        ports: wV,
        initMessageEvent: wV
    });
    Object.defineProperties(o$1.prototype, {
        [Symbol.toStringTag]: {
            value: "CloseEvent",
            configurable: !0
        },
        reason: wV,
        code: wV,
        wasClean: wV
    });
    Object.defineProperties(Dn.prototype, {
        [Symbol.toStringTag]: {
            value: "ErrorEvent",
            configurable: !0
        },
        message: wV,
        filename: wV,
        lineno: wV,
        colno: wV,
        error: wV
    });
    cq.converters.MessagePort = cq.interfaceConverter(dJ3);
    cq.converters["sequence<MessagePort>"] = cq.sequenceConverter(cq.converters.MessagePort);
    var No6 = [{
        key: "bubbles",
        converter: cq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: cq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: cq.converters.boolean,
        defaultValue: () => !1
    }];
    cq.converters.MessageEventInit = cq.dictionaryConverter([...No6, {
        key: "data",
        converter: cq.converters.any,
        defaultValue: () => null
    }, {
        key: "origin",
        converter: cq.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lastEventId",
        converter: cq.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "source",
        converter: cq.nullableConverter(cq.converters.MessagePort),
        defaultValue: () => null
    }, {
        key: "ports",
        converter: cq.converters["sequence<MessagePort>"],
        defaultValue: () => []
    }]);
    cq.converters.CloseEventInit = cq.dictionaryConverter([...No6, {
        key: "wasClean",
        converter: cq.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "code",
        converter: cq.converters["unsigned short"],
        defaultValue: () => 0
    }, {
        key: "reason",
        converter: cq.converters.USVString,
        defaultValue: () => ""
    }]);
    cq.converters.ErrorEventInit = cq.dictionaryConverter([...No6, {
        key: "message",
        converter: cq.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "filename",
        converter: cq.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lineno",
        converter: cq.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "colno",
        converter: cq.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "error",
        converter: cq.converters.any
    }]);
    vu8.exports = {
        MessageEvent: UT,
        CloseEvent: o$1,
        ErrorEvent: Dn,
        createFastMessageEvent: cJ3
    }
})
// @from(Ln 92042, Col 4)
Y81 = R((e72, Eu8) => {
    var lJ3 = {
            enumerable: !0,
            writable: !1,
            configurable: !1
        },
        iJ3 = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        },
        nJ3 = {
            NOT_SENT: 0,
            PROCESSING: 1,
            SENT: 2
        },
        rJ3 = {
            CONTINUATION: 0,
            TEXT: 1,
            BINARY: 2,
            CLOSE: 8,
            PING: 9,
            PONG: 10
        },
        oJ3 = {
            INFO: 0,
            PAYLOADLENGTH_16: 2,
            PAYLOADLENGTH_64: 3,
            READ_DATA: 4
        },
        aJ3 = Buffer.allocUnsafe(0),
        sJ3 = {
            string: 1,
            typedArray: 2,
            arrayBuffer: 3,
            blob: 4
        };
    Eu8.exports = {
        uid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        sentCloseFrameState: nJ3,
        staticPropertyDescriptors: lJ3,
        states: iJ3,
        opcodes: rJ3,
        maxUnsigned16Bit: 65535,
        parserStates: oJ3,
        emptyBuffer: aJ3,
        sendHints: sJ3
    }
})
// @from(Ln 92092, Col 4)
zL1 = R((A42, ku8) => {
    ku8.exports = {
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
// @from(Ln 92104, Col 4)
$L1 = R((q42, bu8) => {
    var {
        kReadyState: wL1,
        kController: tJ3,
        kResponse: eJ3,
        kBinaryType: AX3,
        kWebSocketURL: qX3
    } = zL1(), {
        states: HL1,
        opcodes: jn
    } = Y81(), {
        ErrorEvent: KX3,
        createFastMessageEvent: YX3
    } = a$1(), {
        isUtf8: zX3
    } = h1("node:buffer"), {
        collectASequenceOfCodePointsFast: wX3,
        removeHTTPWhitespace: Lu8
    } = qV();

    function HX3(A) {
        return A[wL1] === HL1.CONNECTING
    }

    function $X3(A) {
        return A[wL1] === HL1.OPEN
    }

    function OX3(A) {
        return A[wL1] === HL1.CLOSING
    }

    function _X3(A) {
        return A[wL1] === HL1.CLOSED
    }

    function To6(A, q, K = (z, w) => new Event(z, w), Y = {}) {
        let z = K(A, Y);
        q.dispatchEvent(z)
    }

    function JX3(A, q, K) {
        if (A[wL1] !== HL1.OPEN) return;
        let Y;
        if (q === jn.TEXT) try {
            Y = xu8(K)
        } catch {
            yu8(A, "Received invalid UTF-8 in text frame.");
            return
        } else if (q === jn.BINARY)
            if (A[AX3] === "blob") Y = new Blob([K]);
            else Y = XX3(K);
        To6("message", A, YX3, {
            origin: A[qX3].origin,
            data: Y
        })
    }

    function XX3(A) {
        if (A.byteLength === A.buffer.byteLength) return A.buffer;
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
    }

    function DX3(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; ++q) {
            let K = A.charCodeAt(q);
            if (K < 33 || K > 126 || K === 34 || K === 40 || K === 41 || K === 44 || K === 47 || K === 58 || K === 59 || K === 60 || K === 61 || K === 62 || K === 63 || K === 64 || K === 91 || K === 92 || K === 93 || K === 123 || K === 125) return !1
        }
        return !0
    }

    function jX3(A) {
        if (A >= 1000 && A < 1015) return A !== 1004 && A !== 1005 && A !== 1006;
        return A >= 3000 && A <= 4999
    }

    function yu8(A, q) {
        let {
            [tJ3]: K, [eJ3]: Y
        } = A;
        if (K.abort(), Y?.socket && !Y.socket.destroyed) Y.socket.destroy();
        if (q) To6("error", A, (z, w) => new KX3(z, w), {
            error: Error(q),
            message: q
        })
    }

    function Cu8(A) {
        return A === jn.CLOSE || A === jn.PING || A === jn.PONG
    }

    function Su8(A) {
        return A === jn.CONTINUATION
    }

    function hu8(A) {
        return A === jn.TEXT || A === jn.BINARY
    }

    function MX3(A) {
        return hu8(A) || Su8(A) || Cu8(A)
    }

    function PX3(A) {
        let q = {
                position: 0
            },
            K = new Map;
        while (q.position < A.length) {
            let Y = wX3(";", A, q),
                [z, w = ""] = Y.split("=");
            K.set(Lu8(z, !0, !1), Lu8(w, !1, !0)), q.position++
        }
        return K
    }

    function WX3(A) {
        for (let q = 0; q < A.length; q++) {
            let K = A.charCodeAt(q);
            if (K < 48 || K > 57) return !1
        }
        return !0
    }
    var Iu8 = typeof process.versions.icu === "string",
        Ru8 = Iu8 ? new TextDecoder("utf-8", {
            fatal: !0
        }) : void 0,
        xu8 = Iu8 ? Ru8.decode.bind(Ru8) : function(A) {
            if (zX3(A)) return A.toString("utf-8");
            throw TypeError("Invalid utf-8 received.")
        };
    bu8.exports = {
        isConnecting: HX3,
        isEstablished: $X3,
        isClosing: OX3,
        isClosed: _X3,
        fireEvent: To6,
        isValidSubprotocol: DX3,
        isValidStatusCode: jX3,
        failWebsocketConnection: yu8,
        websocketMessageReceived: JX3,
        utf8Decode: xu8,
        isControlFrame: Cu8,
        isContinuationFrame: Su8,
        isTextBinaryFrame: hu8,
        isValidOpcode: MX3,
        parseExtensions: PX3,
        isValidClientWindowBits: WX3
    }
})
// @from(Ln 92255, Col 4)
a66 = R((K42, Bu8) => {
    var {
        maxUnsigned16Bit: GX3
    } = Y81(), vo6, OL1 = null, s$1 = 16386;
    try {
        vo6 = h1("node:crypto")
    } catch {
        vo6 = {
            randomFillSync: function(q, K, Y) {
                for (let z = 0; z < q.length; ++z) q[z] = Math.random() * 255 | 0;
                return q
            }
        }
    }

    function ZX3() {
        if (s$1 === 16386) s$1 = 0, vo6.randomFillSync(OL1 ??= Buffer.allocUnsafe(16386), 0, 16386);
        return [OL1[s$1++], OL1[s$1++], OL1[s$1++], OL1[s$1++]]
    }
    class uu8 {
        constructor(A) {
            this.frameData = A
        }
        createFrame(A) {
            let q = this.frameData,
                K = ZX3(),
                Y = q?.byteLength ?? 0,
                z = Y,
                w = 6;
            if (Y > GX3) w += 8, z = 127;
            else if (Y > 125) w += 2, z = 126;
            let H = Buffer.allocUnsafe(Y + w);
            H[0] = H[1] = 0, H[0] |= 128, H[0] = (H[0] & 240) + A; /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
            if (H[w - 4] = K[0], H[w - 3] = K[1], H[w - 2] = K[2], H[w - 1] = K[3], H[1] = z, z === 126) H.writeUInt16BE(Y, 2);
            else if (z === 127) H[2] = H[3] = 0, H.writeUIntBE(Y, 4, 6);
            H[1] |= 128;
            for (let $ = 0; $ < Y; ++$) H[w + $] = q[$] ^ K[$ & 3];
            return H
        }
    }
    Bu8.exports = {
        WebsocketFrameSend: uu8
    }
})
// @from(Ln 92299, Col 4)
ko6 = R((Y42, du8) => {
    var {
        uid: fX3,
        states: _L1,
        sentCloseFrameState: s66,
        emptyBuffer: VX3,
        opcodes: NX3
    } = Y81(), {
        kReadyState: JL1,
        kSentClose: t66,
        kByteParser: Fu8,
        kReceivedClose: mu8,
        kResponse: Qu8
    } = zL1(), {
        fireEvent: TX3,
        failWebsocketConnection: Mn,
        isClosing: vX3,
        isClosed: EX3,
        isEstablished: kX3,
        parseExtensions: LX3
    } = $L1(), {
        channels: t$1
    } = D$1(), {
        CloseEvent: RX3
    } = a$1(), {
        makeRequest: yX3
    } = c$1(), {
        fetching: CX3
    } = ek1(), {
        Headers: SX3,
        getHeadersList: hX3
    } = tA1(), {
        getDecodeSplit: IX3
    } = bT(), {
        WebsocketFrameSend: xX3
    } = a66(), Eo6;
    try {
        Eo6 = h1("node:crypto")
    } catch {}

    function bX3(A, q, K, Y, z, w) {
        let H = A;
        H.protocol = A.protocol === "ws:" ? "http:" : "https:";
        let $ = yX3({
            urlList: [H],
            client: K,
            serviceWorkers: "none",
            referrer: "no-referrer",
            mode: "websocket",
            credentials: "include",
            cache: "no-store",
            redirect: "error"
        });
        if (w.headers) {
            let X = hX3(new SX3(w.headers));
            $.headersList = X
        }
        let O = Eo6.randomBytes(16).toString("base64");
        $.headersList.append("sec-websocket-key", O), $.headersList.append("sec-websocket-version", "13");
        for (let X of q) $.headersList.append("sec-websocket-protocol", X);
        let _ = "permessage-deflate; client_max_window_bits";
        return $.headersList.append("sec-websocket-extensions", _), CX3({
            request: $,
            useParallelQueue: !0,
            dispatcher: w.dispatcher,
            processResponse(X) {
                if (X.type === "error" || X.status !== 101) {
                    Mn(Y, "Received network error or non-101 status code.");
                    return
                }
                if (q.length !== 0 && !X.headersList.get("Sec-WebSocket-Protocol")) {
                    Mn(Y, "Server did not respond with sent protocols.");
                    return
                }
                if (X.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
                    Mn(Y, 'Server did not set Upgrade header to "websocket".');
                    return
                }
                if (X.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
                    Mn(Y, 'Server did not set Connection header to "upgrade".');
                    return
                }
                let D = X.headersList.get("Sec-WebSocket-Accept"),
                    j = Eo6.createHash("sha1").update(O + fX3).digest("base64");
                if (D !== j) {
                    Mn(Y, "Incorrect hash received in Sec-WebSocket-Accept header.");
                    return
                }
                let M = X.headersList.get("Sec-WebSocket-Extensions"),
                    P;
                if (M !== null) {
                    if (P = LX3(M), !P.has("permessage-deflate")) {
                        Mn(Y, "Sec-WebSocket-Extensions header does not match.");
                        return
                    }
                }
                let W = X.headersList.get("Sec-WebSocket-Protocol");
                if (W !== null) {
                    if (!IX3("sec-websocket-protocol", $.headersList).includes(W)) {
                        Mn(Y, "Protocol was not set in the opening handshake.");
                        return
                    }
                }
                if (X.socket.on("data", gu8), X.socket.on("close", Uu8), X.socket.on("error", pu8), t$1.open.hasSubscribers) t$1.open.publish({
                    address: X.socket.address(),
                    protocol: W,
                    extensions: M
                });
                z(X, P)
            }
        })
    }

    function uX3(A, q, K, Y) {
        if (vX3(A) || EX3(A));
        else if (!kX3(A)) Mn(A, "Connection was closed before it was established."), A[JL1] = _L1.CLOSING;
        else if (A[t66] === s66.NOT_SENT) {
            A[t66] = s66.PROCESSING;
            let z = new xX3;
            if (q !== void 0 && K === void 0) z.frameData = Buffer.allocUnsafe(2), z.frameData.writeUInt16BE(q, 0);
            else if (q !== void 0 && K !== void 0) z.frameData = Buffer.allocUnsafe(2 + Y), z.frameData.writeUInt16BE(q, 0), z.frameData.write(K, 2, "utf-8");
            else z.frameData = VX3;
            A[Qu8].socket.write(z.createFrame(NX3.CLOSE)), A[t66] = s66.SENT, A[JL1] = _L1.CLOSING
        } else A[JL1] = _L1.CLOSING
    }

    function gu8(A) {
        if (!this.ws[Fu8].write(A)) this.pause()
    }

    function Uu8() {
        let {
            ws: A
        } = this, {
            [Qu8]: q
        } = A;
        q.socket.off("data", gu8), q.socket.off("close", Uu8), q.socket.off("error", pu8);
        let K = A[t66] === s66.SENT && A[mu8],
            Y = 1005,
            z = "",
            w = A[Fu8].closingInfo;
        if (w && !w.error) Y = w.code ?? 1005, z = w.reason;
        else if (!A[mu8]) Y = 1006;
        if (A[JL1] = _L1.CLOSED, TX3("close", A, (H, $) => new RX3(H, $), {
                wasClean: K,
                code: Y,
                reason: z
            }), t$1.close.hasSubscribers) t$1.close.publish({
            websocket: A,
            code: Y,
            reason: z
        })
    }

    function pu8(A) {
        let {
            ws: q
        } = this;
        if (q[JL1] = _L1.CLOSING, t$1.socketError.hasSubscribers) t$1.socketError.publish(A);
        this.destroy()
    }
    du8.exports = {
        establishWebSocketConnection: bX3,
        closeWebSocketConnection: uX3
    }
})
// @from(Ln 92465, Col 4)
iu8 = R((z42, lu8) => {
    var {
        createInflateRaw: BX3,
        Z_DEFAULT_WINDOWBITS: mX3
    } = h1("node:zlib"), {
        isValidClientWindowBits: FX3
    } = $L1(), QX3 = Buffer.from([0, 0, 255, 255]), e66 = Symbol("kBuffer"), AA6 = Symbol("kLength");
    class cu8 {
        #A;
        #q = {};
        constructor(A) {
            this.#q.serverNoContextTakeover = A.has("server_no_context_takeover"), this.#q.serverMaxWindowBits = A.get("server_max_window_bits")
        }
        decompress(A, q, K) {
            if (!this.#A) {
                let Y = mX3;
                if (this.#q.serverMaxWindowBits) {
                    if (!FX3(this.#q.serverMaxWindowBits)) {
                        K(Error("Invalid server_max_window_bits"));
                        return
                    }
                    Y = Number.parseInt(this.#q.serverMaxWindowBits)
                }
                this.#A = BX3({
                    windowBits: Y
                }), this.#A[e66] = [], this.#A[AA6] = 0, this.#A.on("data", (z) => {
                    this.#A[e66].push(z), this.#A[AA6] += z.length
                }), this.#A.on("error", (z) => {
                    this.#A = null, K(z)
                })
            }
            if (this.#A.write(A), q) this.#A.write(QX3);
            this.#A.flush(() => {
                let Y = Buffer.concat(this.#A[e66], this.#A[AA6]);
                this.#A[e66].length = 0, this.#A[AA6] = 0, K(null, Y)
            })
        }
    }
    lu8.exports = {
        PerMessageDeflate: cu8
    }
})
// @from(Ln 92507, Col 4)
zB8 = R((w42, YB8) => {
    var {
        Writable: gX3
    } = h1("node:stream"), UX3 = h1("node:assert"), {
        parserStates: HV,
        opcodes: e$1,
        states: pX3,
        emptyBuffer: nu8,
        sentCloseFrameState: ru8
    } = Y81(), {
        kReadyState: dX3,
        kSentClose: ou8,
        kResponse: au8,
        kReceivedClose: su8
    } = zL1(), {
        channels: qA6
    } = D$1(), {
        isValidStatusCode: cX3,
        isValidOpcode: lX3,
        failWebsocketConnection: gk,
        websocketMessageReceived: tu8,
        utf8Decode: iX3,
        isControlFrame: eu8,
        isTextBinaryFrame: Lo6,
        isContinuationFrame: nX3
    } = $L1(), {
        WebsocketFrameSend: AB8
    } = a66(), {
        closeWebSocketConnection: qB8
    } = ko6(), {
        PerMessageDeflate: rX3
    } = iu8();
    class KB8 extends gX3 {
        #A = [];
        #q = 0;
        #K = !1;
        #z = HV.INFO;
        #Y = {};
        #$ = [];
        #w;
        constructor(A, q) {
            super();
            if (this.ws = A, this.#w = q == null ? new Map : q, this.#w.has("permessage-deflate")) this.#w.set("permessage-deflate", new rX3(q))
        }
        _write(A, q, K) {
            this.#A.push(A), this.#q += A.length, this.#K = !0, this.run(K)
        }
        run(A) {
            while (this.#K)
                if (this.#z === HV.INFO) {
                    if (this.#q < 2) return A();
                    let q = this.consume(2),
                        K = (q[0] & 128) !== 0,
                        Y = q[0] & 15,
                        z = (q[1] & 128) === 128,
                        w = !K && Y !== e$1.CONTINUATION,
                        H = q[1] & 127,
                        $ = q[0] & 64,
                        O = q[0] & 32,
                        _ = q[0] & 16;
                    if (!lX3(Y)) return gk(this.ws, "Invalid opcode received"), A();
                    if (z) return gk(this.ws, "Frame cannot be masked"), A();
                    if ($ !== 0 && !this.#w.has("permessage-deflate")) {
                        gk(this.ws, "Expected RSV1 to be clear.");
                        return
                    }
                    if (O !== 0 || _ !== 0) {
                        gk(this.ws, "RSV1, RSV2, RSV3 must be clear");
                        return
                    }
                    if (w && !Lo6(Y)) {
                        gk(this.ws, "Invalid frame type was fragmented.");
                        return
                    }
                    if (Lo6(Y) && this.#$.length > 0) {
                        gk(this.ws, "Expected continuation frame");
                        return
                    }
                    if (this.#Y.fragmented && w) {
                        gk(this.ws, "Fragmented frame exceeded 125 bytes.");
                        return
                    }
                    if ((H > 125 || w) && eu8(Y)) {
                        gk(this.ws, "Control frame either too large or fragmented");
                        return
                    }
                    if (nX3(Y) && this.#$.length === 0 && !this.#Y.compressed) {
                        gk(this.ws, "Unexpected continuation frame");
                        return
                    }
                    if (H <= 125) this.#Y.payloadLength = H, this.#z = HV.READ_DATA;
                    else if (H === 126) this.#z = HV.PAYLOADLENGTH_16;
                    else if (H === 127) this.#z = HV.PAYLOADLENGTH_64;
                    if (Lo6(Y)) this.#Y.binaryType = Y, this.#Y.compressed = $ !== 0;
                    this.#Y.opcode = Y, this.#Y.masked = z, this.#Y.fin = K, this.#Y.fragmented = w
                } else if (this.#z === HV.PAYLOADLENGTH_16) {
                if (this.#q < 2) return A();
                let q = this.consume(2);
                this.#Y.payloadLength = q.readUInt16BE(0), this.#z = HV.READ_DATA
            } else if (this.#z === HV.PAYLOADLENGTH_64) {
                if (this.#q < 8) return A();
                let q = this.consume(8),
                    K = q.readUInt32BE(0);
                if (K > 2147483647) {
                    gk(this.ws, "Received payload length > 2^31 bytes.");
                    return
                }
                let Y = q.readUInt32BE(4);
                this.#Y.payloadLength = (K << 8) + Y, this.#z = HV.READ_DATA
            } else if (this.#z === HV.READ_DATA) {
                if (this.#q < this.#Y.payloadLength) return A();
                let q = this.consume(this.#Y.payloadLength);
                if (eu8(this.#Y.opcode)) this.#K = this.parseControlFrame(q), this.#z = HV.INFO;
                else if (!this.#Y.compressed) {
                    if (this.#$.push(q), !this.#Y.fragmented && this.#Y.fin) {
                        let K = Buffer.concat(this.#$);
                        tu8(this.ws, this.#Y.binaryType, K), this.#$.length = 0
                    }
                    this.#z = HV.INFO
                } else {
                    this.#w.get("permessage-deflate").decompress(q, this.#Y.fin, (K, Y) => {
                        if (K) {
                            qB8(this.ws, 1007, K.message, K.message.length);
                            return
                        }
                        if (this.#$.push(Y), !this.#Y.fin) {
                            this.#z = HV.INFO, this.#K = !0, this.run(A);
                            return
                        }
                        tu8(this.ws, this.#Y.binaryType, Buffer.concat(this.#$)), this.#K = !0, this.#z = HV.INFO, this.#$.length = 0, this.run(A)
                    }), this.#K = !1;
                    break
                }
            }
        }
        consume(A) {
            if (A > this.#q) throw Error("Called consume() before buffers satiated.");
            else if (A === 0) return nu8;
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
            UX3(A.length !== 1);
            let q;
            if (A.length >= 2) q = A.readUInt16BE(0);
            if (q !== void 0 && !cX3(q)) return {
                code: 1002,
                reason: "Invalid status code",
                error: !0
            };
            let K = A.subarray(2);
            if (K[0] === 239 && K[1] === 187 && K[2] === 191) K = K.subarray(3);
            try {
                K = iX3(K)
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
            if (q === e$1.CLOSE) {
                if (K === 1) return gk(this.ws, "Received close frame with a 1-byte body."), !1;
                if (this.#Y.closeInfo = this.parseCloseBody(A), this.#Y.closeInfo.error) {
                    let {
                        code: Y,
                        reason: z
                    } = this.#Y.closeInfo;
                    return qB8(this.ws, Y, z, z.length), gk(this.ws, z), !1
                }
                if (this.ws[ou8] !== ru8.SENT) {
                    let Y = nu8;
                    if (this.#Y.closeInfo.code) Y = Buffer.allocUnsafe(2), Y.writeUInt16BE(this.#Y.closeInfo.code, 0);
                    let z = new AB8(Y);
                    this.ws[au8].socket.write(z.createFrame(e$1.CLOSE), (w) => {
                        if (!w) this.ws[ou8] = ru8.SENT
                    })
                }
                return this.ws[dX3] = pX3.CLOSING, this.ws[su8] = !0, !1
            } else if (q === e$1.PING) {
                if (!this.ws[su8]) {
                    let Y = new AB8(A);
                    if (this.ws[au8].socket.write(Y.createFrame(e$1.PONG)), qA6.ping.hasSubscribers) qA6.ping.publish({
                        payload: A
                    })
                }
            } else if (q === e$1.PONG) {
                if (qA6.pong.hasSubscribers) qA6.pong.publish({
                    payload: A
                })
            }
            return !0
        }
        get closingInfo() {
            return this.#Y.closeInfo
        }
    }
    YB8.exports = {
        ByteParser: KB8
    }
})
// @from(Ln 92734, Col 4)
JB8 = R((H42, _B8) => {
    var {
        WebsocketFrameSend: oX3
    } = a66(), {
        opcodes: wB8,
        sendHints: AO1
    } = Y81(), aX3 = Jr6(), HB8 = Buffer[Symbol.species];
    class OB8 {
        #A = new aX3;
        #q = !1;
        #K;
        constructor(A) {
            this.#K = A
        }
        add(A, q, K) {
            if (K !== AO1.blob) {
                let z = $B8(A, K);
                if (!this.#q) this.#K.write(z, q);
                else {
                    let w = {
                        promise: null,
                        callback: q,
                        frame: z
                    };
                    this.#A.push(w)
                }
                return
            }
            let Y = {
                promise: A.arrayBuffer().then((z) => {
                    Y.promise = null, Y.frame = $B8(z, K)
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

    function $B8(A, q) {
        return new oX3(sX3(A, q)).createFrame(q === AO1.string ? wB8.TEXT : wB8.BINARY)
    }

    function sX3(A, q) {
        switch (q) {
            case AO1.string:
                return Buffer.from(A);
            case AO1.arrayBuffer:
            case AO1.blob:
                return new HB8(A);
            case AO1.typedArray:
                return new HB8(A.buffer, A.byteOffset, A.byteLength)
        }
    }
    _B8.exports = {
        SendQueue: OB8
    }
})
// @from(Ln 92802, Col 4)
fB8 = R(($42, ZB8) => {
    var {
        webidl: j3
    } = OM(), {
        URLSerializer: tX3
    } = qV(), {
        environmentSettingsObject: XB8
    } = bT(), {
        staticPropertyDescriptors: Pn,
        states: XL1,
        sentCloseFrameState: eX3,
        sendHints: KA6
    } = Y81(), {
        kWebSocketURL: DB8,
        kReadyState: Ro6,
        kController: AD3,
        kBinaryType: YA6,
        kResponse: jB8,
        kSentClose: qD3,
        kByteParser: KD3
    } = zL1(), {
        isConnecting: YD3,
        isEstablished: zD3,
        isClosing: wD3,
        isValidSubprotocol: HD3,
        fireEvent: MB8
    } = $L1(), {
        establishWebSocketConnection: $D3,
        closeWebSocketConnection: PB8
    } = ko6(), {
        ByteParser: OD3
    } = zB8(), {
        kEnumerableProperty: Uk,
        isBlobLike: WB8
    } = W9(), {
        getGlobalDispatcher: _D3
    } = v66(), {
        types: GB8
    } = h1("node:util"), {
        ErrorEvent: JD3,
        CloseEvent: XD3
    } = a$1(), {
        SendQueue: DD3
    } = JB8();
    class az extends EventTarget {
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
            j3.util.markAsUncloneable(this);
            let K = "WebSocket constructor";
            j3.argumentLengthCheck(arguments, 1, K);
            let Y = j3.converters["DOMString or sequence<DOMString> or WebSocketInit"](q, K, "options");
            A = j3.converters.USVString(A, K, "url"), q = Y.protocols;
            let z = XB8.settingsObject.baseUrl,
                w;
            try {
                w = new URL(A, z)
            } catch ($) {
                throw new DOMException($, "SyntaxError")
            }
            if (w.protocol === "http:") w.protocol = "ws:";
            else if (w.protocol === "https:") w.protocol = "wss:";
            if (w.protocol !== "ws:" && w.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${w.protocol}`, "SyntaxError");
            if (w.hash || w.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
            if (typeof q === "string") q = [q];
            if (q.length !== new Set(q.map(($) => $.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            if (q.length > 0 && !q.every(($) => HD3($))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            this[DB8] = new URL(w.href);
            let H = XB8.settingsObject;
            this[AD3] = $D3(w, q, H, this, ($, O) => this.#$($, O), Y), this[Ro6] = az.CONNECTING, this[qD3] = eX3.NOT_SENT, this[YA6] = "blob"
        }
        close(A = void 0, q = void 0) {
            j3.brandCheck(this, az);
            let K = "WebSocket.close";
            if (A !== void 0) A = j3.converters["unsigned short"](A, K, "code", {
                clamp: !0
            });
            if (q !== void 0) q = j3.converters.USVString(q, K, "reason");
            if (A !== void 0) {
                if (A !== 1000 && (A < 3000 || A > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
            }
            let Y = 0;
            if (q !== void 0) {
                if (Y = Buffer.byteLength(q), Y > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${Y}`, "SyntaxError")
            }
            PB8(this, A, q, Y)
        }
        send(A) {
            j3.brandCheck(this, az);
            let q = "WebSocket.send";
            if (j3.argumentLengthCheck(arguments, 1, q), A = j3.converters.WebSocketSendData(A, q, "data"), YD3(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
            if (!zD3(this) || wD3(this)) return;
            if (typeof A === "string") {
                let K = Buffer.byteLength(A);
                this.#q += K, this.#Y.add(A, () => {
                    this.#q -= K
                }, KA6.string)
            } else if (GB8.isArrayBuffer(A)) this.#q += A.byteLength, this.#Y.add(A, () => {
                this.#q -= A.byteLength
            }, KA6.arrayBuffer);
            else if (ArrayBuffer.isView(A)) this.#q += A.byteLength, this.#Y.add(A, () => {
                this.#q -= A.byteLength
            }, KA6.typedArray);
            else if (WB8(A)) this.#q += A.size, this.#Y.add(A, () => {
                this.#q -= A.size
            }, KA6.blob)
        }
        get readyState() {
            return j3.brandCheck(this, az), this[Ro6]
        }
        get bufferedAmount() {
            return j3.brandCheck(this, az), this.#q
        }
        get url() {
            return j3.brandCheck(this, az), tX3(this[DB8])
        }
        get extensions() {
            return j3.brandCheck(this, az), this.#z
        }
        get protocol() {
            return j3.brandCheck(this, az), this.#K
        }
        get onopen() {
            return j3.brandCheck(this, az), this.#A.open
        }
        set onopen(A) {
            if (j3.brandCheck(this, az), this.#A.open) this.removeEventListener("open", this.#A.open);
            if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
            else this.#A.open = null
        }
        get onerror() {
            return j3.brandCheck(this, az), this.#A.error
        }
        set onerror(A) {
            if (j3.brandCheck(this, az), this.#A.error) this.removeEventListener("error", this.#A.error);
            if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
            else this.#A.error = null
        }
        get onclose() {
            return j3.brandCheck(this, az), this.#A.close
        }
        set onclose(A) {
            if (j3.brandCheck(this, az), this.#A.close) this.removeEventListener("close", this.#A.close);
            if (typeof A === "function") this.#A.close = A, this.addEventListener("close", A);
            else this.#A.close = null
        }
        get onmessage() {
            return j3.brandCheck(this, az), this.#A.message
        }
        set onmessage(A) {
            if (j3.brandCheck(this, az), this.#A.message) this.removeEventListener("message", this.#A.message);
            if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
            else this.#A.message = null
        }
        get binaryType() {
            return j3.brandCheck(this, az), this[YA6]
        }
        set binaryType(A) {
            if (j3.brandCheck(this, az), A !== "blob" && A !== "arraybuffer") this[YA6] = "blob";
            else this[YA6] = A
        }
        #$(A, q) {
            this[jB8] = A;
            let K = new OD3(this, q);
            K.on("drain", jD3), K.on("error", MD3.bind(this)), A.socket.ws = this, this[KD3] = K, this.#Y = new DD3(A.socket), this[Ro6] = XL1.OPEN;
            let Y = A.headersList.get("sec-websocket-extensions");
            if (Y !== null) this.#z = Y;
            let z = A.headersList.get("sec-websocket-protocol");
            if (z !== null) this.#K = z;
            MB8("open", this)
        }
    }
    az.CONNECTING = az.prototype.CONNECTING = XL1.CONNECTING;
    az.OPEN = az.prototype.OPEN = XL1.OPEN;
    az.CLOSING = az.prototype.CLOSING = XL1.CLOSING;
    az.CLOSED = az.prototype.CLOSED = XL1.CLOSED;
    Object.defineProperties(az.prototype, {
        CONNECTING: Pn,
        OPEN: Pn,
        CLOSING: Pn,
        CLOSED: Pn,
        url: Uk,
        readyState: Uk,
        bufferedAmount: Uk,
        onopen: Uk,
        onerror: Uk,
        onclose: Uk,
        close: Uk,
        onmessage: Uk,
        binaryType: Uk,
        send: Uk,
        extensions: Uk,
        protocol: Uk,
        [Symbol.toStringTag]: {
            value: "WebSocket",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(az, {
        CONNECTING: Pn,
        OPEN: Pn,
        CLOSING: Pn,
        CLOSED: Pn
    });
    j3.converters["sequence<DOMString>"] = j3.sequenceConverter(j3.converters.DOMString);
    j3.converters["DOMString or sequence<DOMString>"] = function(A, q, K) {
        if (j3.util.Type(A) === "Object" && Symbol.iterator in A) return j3.converters["sequence<DOMString>"](A);
        return j3.converters.DOMString(A, q, K)
    };
    j3.converters.WebSocketInit = j3.dictionaryConverter([{
        key: "protocols",
        converter: j3.converters["DOMString or sequence<DOMString>"],
        defaultValue: () => []
    }, {
        key: "dispatcher",
        converter: j3.converters.any,
        defaultValue: () => _D3()
    }, {
        key: "headers",
        converter: j3.nullableConverter(j3.converters.HeadersInit)
    }]);
    j3.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(A) {
        if (j3.util.Type(A) === "Object" && !(Symbol.iterator in A)) return j3.converters.WebSocketInit(A);
        return {
            protocols: j3.converters["DOMString or sequence<DOMString>"](A)
        }
    };
    j3.converters.WebSocketSendData = function(A) {
        if (j3.util.Type(A) === "Object") {
            if (WB8(A)) return j3.converters.Blob(A, {
                strict: !1
            });
            if (ArrayBuffer.isView(A) || GB8.isArrayBuffer(A)) return j3.converters.BufferSource(A)
        }
        return j3.converters.USVString(A)
    };

    function jD3() {
        this.ws[jB8].socket.resume()
    }

    function MD3(A) {
        let q, K;
        if (A instanceof XD3) q = A.reason, K = A.code;
        else q = A.message;
        MB8("error", this, () => new JD3("error", {
            error: A,
            message: q
        })), PB8(this, K)
    }
    ZB8.exports = {
        WebSocket: az
    }
})
// @from(Ln 93067, Col 4)
yo6 = R((O42, VB8) => {
    function PD3(A) {
        return A.indexOf("\x00") === -1
    }

    function WD3(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; q++)
            if (A.charCodeAt(q) < 48 || A.charCodeAt(q) > 57) return !1;
        return !0
    }

    function GD3(A) {
        return new Promise((q) => {
            setTimeout(q, A).unref()
        })
    }
    VB8.exports = {
        isValidLastEventId: PD3,
        isASCIINumber: WD3,
        delay: GD3
    }
})
// @from(Ln 93090, Col 4)
kB8 = R((_42, EB8) => {
    var {
        Transform: ZD3
    } = h1("node:stream"), {
        isASCIINumber: NB8,
        isValidLastEventId: TB8
    } = yo6(), Zg = [239, 187, 191];
    class vB8 extends ZD3 {
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
                    if (this.buffer[0] === Zg[0]) {
                        K();
                        return
                    }
                    this.checkBOM = !1, K();
                    return;
                case 2:
                    if (this.buffer[0] === Zg[0] && this.buffer[1] === Zg[1]) {
                        K();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                case 3:
                    if (this.buffer[0] === Zg[0] && this.buffer[1] === Zg[1] && this.buffer[2] === Zg[2]) {
                        this.buffer = Buffer.alloc(0), this.checkBOM = !1, K();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                default:
                    if (this.buffer[0] === Zg[0] && this.buffer[1] === Zg[1] && this.buffer[2] === Zg[2]) this.buffer = this.buffer.subarray(3);
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
                let w = K + 1;
                if (A[w] === 32) ++w;
                z = A.subarray(w).toString("utf8")
            } else Y = A.toString("utf8"), z = "";
            switch (Y) {
                case "data":
                    if (q[Y] === void 0) q[Y] = z;
                    else q[Y] += `
${z}`;
                    break;
                case "retry":
                    if (NB8(z)) q[Y] = z;
                    break;
                case "id":
                    if (TB8(z)) q[Y] = z;
                    break;
                case "event":
                    if (z.length > 0) q[Y] = z;
                    break
            }
        }
        processEvent(A) {
            if (A.retry && NB8(A.retry)) this.state.reconnectionTime = parseInt(A.retry, 10);
            if (A.id && TB8(A.id)) this.state.lastEventId = A.id;
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
    EB8.exports = {
        EventSourceStream: vB8
    }
})
// @from(Ln 93230, Col 4)
xB8 = R((J42, IB8) => {
    var {
        pipeline: fD3
    } = h1("node:stream"), {
        fetching: VD3
    } = ek1(), {
        makeRequest: ND3
    } = c$1(), {
        webidl: fg
    } = OM(), {
        EventSourceStream: TD3
    } = kB8(), {
        parseMIMEType: vD3
    } = qV(), {
        createFastMessageEvent: ED3
    } = a$1(), {
        isNetworkError: LB8
    } = sk1(), {
        delay: kD3
    } = yo6(), {
        kEnumerableProperty: z81
    } = W9(), {
        environmentSettingsObject: RB8
    } = bT(), yB8 = !1, CB8 = 3000, DL1 = 0, SB8 = 1, jL1 = 2, LD3 = "anonymous", RD3 = "use-credentials";
    class qO1 extends EventTarget {
        #A = {
            open: null,
            error: null,
            message: null
        };
        #q = null;
        #K = !1;
        #z = DL1;
        #Y = null;
        #$ = null;
        #w;
        #_;
        constructor(A, q = {}) {
            super();
            fg.util.markAsUncloneable(this);
            let K = "EventSource constructor";
            if (fg.argumentLengthCheck(arguments, 1, K), !yB8) yB8 = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
                code: "UNDICI-ES"
            });
            A = fg.converters.USVString(A, K, "url"), q = fg.converters.EventSourceInitDict(q, K, "eventSourceInitDict"), this.#w = q.dispatcher, this.#_ = {
                lastEventId: "",
                reconnectionTime: CB8
            };
            let Y = RB8,
                z;
            try {
                z = new URL(A, Y.settingsObject.baseUrl), this.#_.origin = z.origin
            } catch ($) {
                throw new DOMException($, "SyntaxError")
            }
            this.#q = z.href;
            let w = LD3;
            if (q.withCredentials) w = RD3, this.#K = !0;
            let H = {
                redirect: "follow",
                keepalive: !0,
                mode: "cors",
                credentials: w === "anonymous" ? "same-origin" : "omit",
                referrer: "no-referrer"
            };
            H.client = RB8.settingsObject, H.headersList = [
                ["accept", {
                    name: "accept",
                    value: "text/event-stream"
                }]
            ], H.cache = "no-store", H.initiator = "other", H.urlList = [new URL(this.#q)], this.#Y = ND3(H), this.#J()
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
        #J() {
            if (this.#z === jL1) return;
            this.#z = DL1;
            let A = {
                    request: this.#Y,
                    dispatcher: this.#w
                },
                q = (K) => {
                    if (LB8(K)) this.dispatchEvent(new Event("error")), this.close();
                    this.#O()
                };
            A.processResponseEndOfBody = q, A.processResponse = (K) => {
                if (LB8(K))
                    if (K.aborted) {
                        this.close(), this.dispatchEvent(new Event("error"));
                        return
                    } else {
                        this.#O();
                        return
                    } let Y = K.headersList.get("content-type", !0),
                    z = Y !== null ? vD3(Y) : "failure",
                    w = z !== "failure" && z.essence === "text/event-stream";
                if (K.status !== 200 || w === !1) {
                    this.close(), this.dispatchEvent(new Event("error"));
                    return
                }
                this.#z = SB8, this.dispatchEvent(new Event("open")), this.#_.origin = K.urlList[K.urlList.length - 1].origin;
                let H = new TD3({
                    eventSourceSettings: this.#_,
                    push: ($) => {
                        this.dispatchEvent(ED3($.type, $.options))
                    }
                });
                fD3(K.body.stream, H, ($) => {
                    if ($?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
                })
            }, this.#$ = VD3(A)
        }
        async #O() {
            if (this.#z === jL1) return;
            if (this.#z = DL1, this.dispatchEvent(new Event("error")), await kD3(this.#_.reconnectionTime), this.#z !== DL1) return;
            if (this.#_.lastEventId.length) this.#Y.headersList.set("last-event-id", this.#_.lastEventId, !0);
            this.#J()
        }
        close() {
            if (fg.brandCheck(this, qO1), this.#z === jL1) return;
            this.#z = jL1, this.#$.abort(), this.#Y = null
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
    var hB8 = {
        CONNECTING: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: DL1,
            writable: !1
        },
        OPEN: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: SB8,
            writable: !1
        },
        CLOSED: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: jL1,
            writable: !1
        }
    };
    Object.defineProperties(qO1, hB8);
    Object.defineProperties(qO1.prototype, hB8);
    Object.defineProperties(qO1.prototype, {
        close: z81,
        onerror: z81,
        onmessage: z81,
        onopen: z81,
        readyState: z81,
        url: z81,
        withCredentials: z81
    });
    fg.converters.EventSourceInitDict = fg.dictionaryConverter([{
        key: "withCredentials",
        converter: fg.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "dispatcher",
        converter: fg.converters.any
    }]);
    IB8.exports = {
        EventSource: qO1,
        defaultReconnectionTime: CB8
    }
})
// @from(Ln 93432, Col 0)
function ML1(A) {
    return (q, K, Y) => {
        if (typeof K === "function") Y = K, K = null;
        if (!q || typeof q !== "string" && typeof q !== "object" && !(q instanceof URL)) throw new zA6("invalid url");
        if (K != null && typeof K !== "object") throw new zA6("invalid opts");
        if (K && K.path != null) {
            if (typeof K.path !== "string") throw new zA6("invalid opts.path");
            let H = K.path;
            if (!K.path.startsWith("/")) H = `/${H}`;
            q = new URL(wA6.parseOrigin(q).origin + H)
        } else {
            if (!K) K = typeof q === "object" ? q : {};
            q = wA6.parseURL(q)
        }
        let {
            agent: z,
            dispatcher: w = ID3()
        } = K;
        if (z) throw new zA6("unsupported opts.agent. Did you mean opts.client?");
        return A.call(w, {
            ...K,
            origin: q.origin,
            path: q.search ? `${q.pathname}${q.search}` : q.pathname,
            method: K.method || (K.body ? "PUT" : "GET")
        }, Y)
    }
}
// @from(Ln 93459, Col 4)
X42
// @from(Ln 93459, Col 9)
yD3
// @from(Ln 93459, Col 14)
D42
// @from(Ln 93459, Col 19)
j42
// @from(Ln 93459, Col 24)
CD3
// @from(Ln 93459, Col 29)
M42
// @from(Ln 93459, Col 34)
SD3
// @from(Ln 93459, Col 39)
P42
// @from(Ln 93459, Col 44)
hD3
// @from(Ln 93459, Col 49)
wA6
// @from(Ln 93459, Col 54)
zA6
// @from(Ln 93459, Col 59)
KO1
// @from(Ln 93459, Col 64)
W42
// @from(Ln 93459, Col 69)
G42
// @from(Ln 93459, Col 74)
Z42
// @from(Ln 93459, Col 79)
f42
// @from(Ln 93459, Col 84)
V42
// @from(Ln 93459, Col 89)
N42
// @from(Ln 93459, Col 94)
ID3
// @from(Ln 93459, Col 99)
xD3
// @from(Ln 93459, Col 104)
T42
// @from(Ln 93459, Col 109)
v42
// @from(Ln 93459, Col 114)
E42
// @from(Ln 93459, Col 119)
Co6
// @from(Ln 93459, Col 124)
So6
// @from(Ln 93459, Col 129)
BD3
// @from(Ln 93459, Col 134)
mD3
// @from(Ln 93459, Col 139)
HA6
// @from(Ln 93459, Col 144)
k42
// @from(Ln 93459, Col 149)
FD3
// @from(Ln 93459, Col 154)
QD3
// @from(Ln 93459, Col 159)
gD3
// @from(Ln 93459, Col 164)
UD3
// @from(Ln 93459, Col 169)
pD3
// @from(Ln 93459, Col 174)
dD3
// @from(Ln 93459, Col 179)
L42
// @from(Ln 93459, Col 184)
R42
// @from(Ln 93459, Col 189)
bD3
// @from(Ln 93459, Col 194)
uD3
// @from(Ln 93459, Col 199)
cD3
// @from(Ln 93459, Col 204)
y42
// @from(Ln 93459, Col 209)
C42
// @from(Ln 93459, Col 214)
S42
// @from(Ln 93459, Col 219)
h42
// @from(Ln 93459, Col 224)
I42
// @from(Ln 93459, Col 229)
x42
// @from(Ln 93459, Col 234)
b42
// @from(Ln 93459, Col 239)
u42
// @from(Ln 93459, Col 244)
B42
// @from(Ln 93459, Col 249)
lD3
// @from(Ln 93459, Col 254)
iD3
// @from(Ln 93459, Col 259)
nD3
// @from(Ln 93459, Col 264)
rD3
// @from(Ln 93459, Col 269)
oD3
// @from(Ln 93459, Col 274)
aD3
// @from(Ln 93459, Col 279)
m42
// @from(Ln 93460, Col 4)
ho6 = v(() => {
    X42 = uk1(), yD3 = Mk1(), D42 = I$1(), j42 = Wh8(), CD3 = x$1(), M42 = Tr6(), SD3 = Bh8(), P42 = dh8(), hD3 = Lz(), wA6 = W9(), {
        InvalidArgumentError: zA6
    } = hD3, KO1 = BI8(), W42 = Wk1(), G42 = nr6(), Z42 = Nx8(), f42 = or6(), V42 = Br6(), N42 = M66(), {
        getGlobalDispatcher: ID3,
        setGlobalDispatcher: xD3
    } = v66(), T42 = E66(), v42 = z66(), E42 = w66();
    Object.assign(yD3.prototype, KO1);
    Co6 = CD3, So6 = SD3, BD3 = {
        redirect: yx8(),
        retry: Sx8(),
        dump: xx8(),
        dns: Fx8()
    }, mD3 = {
        parseHeaders: wA6.parseHeaders,
        headerNameToString: wA6.headerNameToString
    };
    HA6 = xD3;
    k42 = ek1().fetch;
    FD3 = tA1().Headers, QD3 = sk1().Response, gD3 = c$1().Request, UD3 = Tk1().FormData, pD3 = globalThis.File ?? h1("node:buffer").File, dD3 = Au8().FileReader;
    ({
        setGlobalOrigin: L42,
        getGlobalOrigin: R42
    } = xn6()), {
        CacheStorage: bD3
    } = _u8(), {
        kConstruct: uD3
    } = c66();
    cD3 = new bD3(uD3);
    ({
        deleteCookie: y42,
        getCookies: C42,
        getSetCookies: S42,
        setCookie: h42
    } = Nu8()), {
        parseMIMEType: I42,
        serializeAMimeType: x42
    } = qV(), {
        CloseEvent: b42,
        ErrorEvent: u42,
        MessageEvent: B42
    } = a$1();
    lD3 = fB8().WebSocket, iD3 = ML1(KO1.request), nD3 = ML1(KO1.stream), rD3 = ML1(KO1.pipeline), oD3 = ML1(KO1.connect), aD3 = ML1(KO1.upgrade);
    ({
        EventSource: m42
    } = xB8())
})
// @from(Ln 93511, Col 0)
function Io6() {
    let A = mC();
    if (!A) return;
    return {
        cert: A.cert,
        key: A.key,
        passphrase: A.passphrase
    }
}
// @from(Ln 93521, Col 0)
function xo6() {
    let A = mC();
    if (!A) return {};
    if (typeof Bun < "u") return {
        tls: A
    };
    return h("mTLS: Created undici agent with custom certificates"), {
        dispatcher: new Co6({
            connect: {
                cert: A.cert,
                key: A.key,
                passphrase: A.passphrase
            },
            pipelining: 1
        })
    }
}
// @from(Ln 93539, Col 0)
function BB8() {
    if (!mC()) return;
    if (process.env.NODE_EXTRA_CA_CERTS) h("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Ln 93543, Col 4)
mC
// @from(Ln 93543, Col 8)
uB8
// @from(Ln 93544, Col 4)
YO1 = v(() => {
    zq();
    ho6();
    Z6();
    _8();
    mC = KA(() => {
        let A = {};
        if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
            A.cert = b1().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
                encoding: "utf8"
            }), h("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
        } catch (q) {
            h(`mTLS: Failed to load client certificate: ${q}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
            A.key = b1().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
                encoding: "utf8"
            }), h("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
        } catch (q) {
            h(`mTLS: Failed to load client key: ${q}`, {
                level: "error"
            })
        }
        if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) A.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, h("mTLS: Using client key passphrase");
        if (Object.keys(A).length === 0) return;
        return A
    }), uB8 = KA(() => {
        let A = mC();
        if (!A) return;
        let q = {
            ...A,
            keepAlive: !0
        };
        return h("mTLS: Creating HTTPS agent with custom certificates"), new sD3(q)
    })
})
// @from(Ln 93583, Col 0)
function tD3(A) {
    switch (A.family) {
        case 0:
        case 4:
        case 6:
            return A.family;
        case "IPv6":
            return 6;
        case "IPv4":
        case void 0:
            return 4;
        default:
            throw Error(`Unsupported address family: ${A.family}`)
    }
}
// @from(Ln 93599, Col 0)
function Vg(A = process.env) {
    return A.https_proxy || A.HTTPS_PROXY || A.http_proxy || A.HTTP_PROXY
}
// @from(Ln 93603, Col 0)
function eD3(A = process.env) {
    return A.no_proxy || A.NO_PROXY
}
// @from(Ln 93607, Col 0)
function PL1(A, q = eD3()) {
    if (!q) return !1;
    if (q === "*") return !0;
    try {
        let K = new URL(A),
            Y = K.hostname.toLowerCase(),
            z = K.port || (K.protocol === "https:" ? "443" : "80"),
            w = `${Y}:${z}`;
        return q.split(/[,\s]+/).filter(Boolean).some(($) => {
            if ($ = $.toLowerCase().trim(), $.includes(":")) return w === $;
            if ($.startsWith(".")) {
                let O = $;
                return Y === $.substring(1) || Y.endsWith(O)
            }
            return Y === $
        })
    } catch {
        return !1
    }
}