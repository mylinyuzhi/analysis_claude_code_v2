
// @from(Ln 63450, Col 4)
Co7 = p((KzO, So7) => {
    var {
        kState: oG6,
        kError: z$1,
        kResult: No7,
        kAborted: Sd6,
        kLastProgressEventFired: Y$1
    } = _$1(), {
        ProgressEvent: xq3
    } = To7(), {
        getEncoding: Eo7
    } = ko7(), {
        serializeAMimeType: uq3,
        parseMIMEType: yo7
    } = qE(), {
        types: mq3
    } = d6("node:util"), {
        StringDecoder: Lo7
    } = d6("string_decoder"), {
        btoa: ho7
    } = d6("node:buffer"), Bq3 = {
        enumerable: !0,
        writable: !1,
        configurable: !1
    };

    function pq3(q, K, _, z) {
        if (q[oG6] === "loading") throw new DOMException("Invalid state", "InvalidStateError");
        q[oG6] = "loading", q[No7] = null, q[z$1] = null;
        let A = K.stream().getReader(),
            O = [],
            w = A.read(),
            $ = !0;
        (async () => {
            while (!q[Sd6]) try {
                let {
                    done: j,
                    value: H
                } = await w;
                if ($ && !q[Sd6]) queueMicrotask(() => {
                    Y76("loadstart", q)
                });
                if ($ = !1, !j && mq3.isUint8Array(H)) {
                    if (O.push(H), (q[Y$1] === void 0 || Date.now() - q[Y$1] >= 50) && !q[Sd6]) q[Y$1] = Date.now(), queueMicrotask(() => {
                        Y76("progress", q)
                    });
                    w = A.read()
                } else if (j) {
                    queueMicrotask(() => {
                        q[oG6] = "done";
                        try {
                            let J = Fq3(O, _, K.type, z);
                            if (q[Sd6]) return;
                            q[No7] = J, Y76("load", q)
                        } catch (J) {
                            q[z$1] = J, Y76("error", q)
                        }
                        if (q[oG6] !== "loading") Y76("loadend", q)
                    });
                    break
                }
            } catch (j) {
                if (q[Sd6]) return;
                queueMicrotask(() => {
                    if (q[oG6] = "done", q[z$1] = j, Y76("error", q), q[oG6] !== "loading") Y76("loadend", q)
                });
                break
            }
        })()
    }

    function Y76(q, K) {
        let _ = new xq3(q, {
            bubbles: !1,
            cancelable: !1
        });
        K.dispatchEvent(_)
    }

    function Fq3(q, K, _, z) {
        switch (K) {
            case "DataURL": {
                let Y = "data:",
                    A = yo7(_ || "application/octet-stream");
                if (A !== "failure") Y += uq3(A);
                Y += ";base64,";
                let O = new Lo7("latin1");
                for (let w of q) Y += ho7(O.write(w));
                return Y += ho7(O.end()), Y
            }
            case "Text": {
                let Y = "failure";
                if (z) Y = Eo7(z);
                if (Y === "failure" && _) {
                    let A = yo7(_);
                    if (A !== "failure") Y = Eo7(A.parameters.get("charset"))
                }
                if (Y === "failure") Y = "UTF-8";
                return gq3(q, Y)
            }
            case "ArrayBuffer":
                return Ro7(q).buffer;
            case "BinaryString": {
                let Y = "",
                    A = new Lo7("latin1");
                for (let O of q) Y += A.write(O);
                return Y += A.end(), Y
            }
        }
    }

    function gq3(q, K) {
        let _ = Ro7(q),
            z = Uq3(_),
            Y = 0;
        if (z !== null) K = z, Y = z === "UTF-8" ? 3 : 2;
        let A = _.slice(Y);
        return new TextDecoder(K).decode(A)
    }

    function Uq3(q) {
        let [K, _, z] = q;
        if (K === 239 && _ === 187 && z === 191) return "UTF-8";
        else if (K === 254 && _ === 255) return "UTF-16BE";
        else if (K === 255 && _ === 254) return "UTF-16LE";
        return null
    }

    function Ro7(q) {
        let K = q.reduce((z, Y) => {
                return z + Y.byteLength
            }, 0),
            _ = 0;
        return q.reduce((z, Y) => {
            return z.set(Y, _), _ += Y.byteLength, z
        }, new Uint8Array(K))
    }
    So7.exports = {
        staticPropertyDescriptors: Bq3,
        readOperation: pq3,
        fireAProgressEvent: Y76
    }
})
// @from(Ln 63593, Col 4)
uo7 = p((_zO, xo7) => {
    var {
        staticPropertyDescriptors: aG6,
        readOperation: oM8,
        fireAProgressEvent: bo7
    } = Co7(), {
        kState: $O6,
        kError: Io7,
        kResult: aM8,
        kEvents: WO,
        kAborted: Qq3
    } = _$1(), {
        webidl: lw
    } = lZ(), {
        kEnumerableProperty: zE
    } = Hz();
    class Zw extends EventTarget {
        constructor() {
            super();
            this[$O6] = "empty", this[aM8] = null, this[Io7] = null, this[WO] = {
                loadend: null,
                error: null,
                abort: null,
                load: null,
                progress: null,
                loadstart: null
            }
        }
        readAsArrayBuffer(q) {
            lw.brandCheck(this, Zw), lw.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), q = lw.converters.Blob(q, {
                strict: !1
            }), oM8(this, q, "ArrayBuffer")
        }
        readAsBinaryString(q) {
            lw.brandCheck(this, Zw), lw.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), q = lw.converters.Blob(q, {
                strict: !1
            }), oM8(this, q, "BinaryString")
        }
        readAsText(q, K = void 0) {
            if (lw.brandCheck(this, Zw), lw.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), q = lw.converters.Blob(q, {
                    strict: !1
                }), K !== void 0) K = lw.converters.DOMString(K, "FileReader.readAsText", "encoding");
            oM8(this, q, "Text", K)
        }
        readAsDataURL(q) {
            lw.brandCheck(this, Zw), lw.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), q = lw.converters.Blob(q, {
                strict: !1
            }), oM8(this, q, "DataURL")
        }
        abort() {
            if (this[$O6] === "empty" || this[$O6] === "done") {
                this[aM8] = null;
                return
            }
            if (this[$O6] === "loading") this[$O6] = "done", this[aM8] = null;
            if (this[Qq3] = !0, bo7("abort", this), this[$O6] !== "loading") bo7("loadend", this)
        }
        get readyState() {
            switch (lw.brandCheck(this, Zw), this[$O6]) {
                case "empty":
                    return this.EMPTY;
                case "loading":
                    return this.LOADING;
                case "done":
                    return this.DONE
            }
        }
        get result() {
            return lw.brandCheck(this, Zw), this[aM8]
        }
        get error() {
            return lw.brandCheck(this, Zw), this[Io7]
        }
        get onloadend() {
            return lw.brandCheck(this, Zw), this[WO].loadend
        }
        set onloadend(q) {
            if (lw.brandCheck(this, Zw), this[WO].loadend) this.removeEventListener("loadend", this[WO].loadend);
            if (typeof q === "function") this[WO].loadend = q, this.addEventListener("loadend", q);
            else this[WO].loadend = null
        }
        get onerror() {
            return lw.brandCheck(this, Zw), this[WO].error
        }
        set onerror(q) {
            if (lw.brandCheck(this, Zw), this[WO].error) this.removeEventListener("error", this[WO].error);
            if (typeof q === "function") this[WO].error = q, this.addEventListener("error", q);
            else this[WO].error = null
        }
        get onloadstart() {
            return lw.brandCheck(this, Zw), this[WO].loadstart
        }
        set onloadstart(q) {
            if (lw.brandCheck(this, Zw), this[WO].loadstart) this.removeEventListener("loadstart", this[WO].loadstart);
            if (typeof q === "function") this[WO].loadstart = q, this.addEventListener("loadstart", q);
            else this[WO].loadstart = null
        }
        get onprogress() {
            return lw.brandCheck(this, Zw), this[WO].progress
        }
        set onprogress(q) {
            if (lw.brandCheck(this, Zw), this[WO].progress) this.removeEventListener("progress", this[WO].progress);
            if (typeof q === "function") this[WO].progress = q, this.addEventListener("progress", q);
            else this[WO].progress = null
        }
        get onload() {
            return lw.brandCheck(this, Zw), this[WO].load
        }
        set onload(q) {
            if (lw.brandCheck(this, Zw), this[WO].load) this.removeEventListener("load", this[WO].load);
            if (typeof q === "function") this[WO].load = q, this.addEventListener("load", q);
            else this[WO].load = null
        }
        get onabort() {
            return lw.brandCheck(this, Zw), this[WO].abort
        }
        set onabort(q) {
            if (lw.brandCheck(this, Zw), this[WO].abort) this.removeEventListener("abort", this[WO].abort);
            if (typeof q === "function") this[WO].abort = q, this.addEventListener("abort", q);
            else this[WO].abort = null
        }
    }
    Zw.EMPTY = Zw.prototype.EMPTY = 0;
    Zw.LOADING = Zw.prototype.LOADING = 1;
    Zw.DONE = Zw.prototype.DONE = 2;
    Object.defineProperties(Zw.prototype, {
        EMPTY: aG6,
        LOADING: aG6,
        DONE: aG6,
        readAsArrayBuffer: zE,
        readAsBinaryString: zE,
        readAsText: zE,
        readAsDataURL: zE,
        abort: zE,
        readyState: zE,
        result: zE,
        error: zE,
        onloadstart: zE,
        onprogress: zE,
        onload: zE,
        onabort: zE,
        onerror: zE,
        onloadend: zE,
        [Symbol.toStringTag]: {
            value: "FileReader",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(Zw, {
        EMPTY: aG6,
        LOADING: aG6,
        DONE: aG6
    });
    xo7.exports = {
        FileReader: Zw
    }
})
// @from(Ln 63752, Col 4)
sM8 = p((zzO, mo7) => {
    mo7.exports = {
        kConstruct: oj().kConstruct
    }
})
// @from(Ln 63757, Col 4)
Fo7 = p((YzO, po7) => {
    var dq3 = d6("node:assert"),
        {
            URLSerializer: Bo7
        } = qE(),
        {
            isValidHeaderName: cq3
        } = kh();

    function lq3(q, K, _ = !1) {
        let z = Bo7(q, _),
            Y = Bo7(K, _);
        return z === Y
    }

    function nq3(q) {
        dq3(q !== null);
        let K = [];
        for (let _ of q.split(","))
            if (_ = _.trim(), cq3(_)) K.push(_);
        return K
    }
    po7.exports = {
        urlEquals: lq3,
        getFieldValues: nq3
    }
})
// @from(Ln 63784, Col 4)
Qo7 = p((AzO, Uo7) => {
    var {
        kConstruct: iq3
    } = sM8(), {
        urlEquals: rq3,
        getFieldValues: A$1
    } = Fo7(), {
        kEnumerableProperty: jO6,
        isDisturbed: oq3
    } = Hz(), {
        webidl: b5
    } = lZ(), {
        Response: aq3,
        cloneResponse: sq3,
        fromInnerResponse: tq3
    } = yd6(), {
        Request: Fr,
        fromInnerRequest: eq3
    } = rG6(), {
        kState: Um
    } = l16(), {
        fetching: q43
    } = hd6(), {
        urlIsHttpHttpsScheme: tM8,
        createDeferredPromise: sG6,
        readAllBytes: K43
    } = kh(), O$1 = d6("node:assert");
    class BU {
        #q;
        constructor() {
            if (arguments[0] !== iq3) b5.illegalConstructor();
            b5.util.markAsUncloneable(this), this.#q = arguments[1]
        }
        async match(q, K = {}) {
            b5.brandCheck(this, BU);
            let _ = "Cache.match";
            b5.argumentLengthCheck(arguments, 1, _), q = b5.converters.RequestInfo(q, _, "request"), K = b5.converters.CacheQueryOptions(K, _, "options");
            let z = this.#z(q, K, 1);
            if (z.length === 0) return;
            return z[0]
        }
        async matchAll(q = void 0, K = {}) {
            b5.brandCheck(this, BU);
            let _ = "Cache.matchAll";
            if (q !== void 0) q = b5.converters.RequestInfo(q, _, "request");
            return K = b5.converters.CacheQueryOptions(K, _, "options"), this.#z(q, K)
        }
        async add(q) {
            b5.brandCheck(this, BU);
            let K = "Cache.add";
            b5.argumentLengthCheck(arguments, 1, K), q = b5.converters.RequestInfo(q, K, "request");
            let _ = [q];
            return await this.addAll(_)
        }
        async addAll(q) {
            b5.brandCheck(this, BU);
            let K = "Cache.addAll";
            b5.argumentLengthCheck(arguments, 1, K);
            let _ = [],
                z = [];
            for (let J of q) {
                if (J === void 0) throw b5.errors.conversionFailed({
                    prefix: K,
                    argument: "Argument 1",
                    types: ["undefined is not allowed"]
                });
                if (J = b5.converters.RequestInfo(J), typeof J === "string") continue;
                let X = J[Um];
                if (!tM8(X.url) || X.method !== "GET") throw b5.errors.exception({
                    header: K,
                    message: "Expected http/s scheme when method is not GET."
                })
            }
            let Y = [];
            for (let J of q) {
                let X = new Fr(J)[Um];
                if (!tM8(X.url)) throw b5.errors.exception({
                    header: K,
                    message: "Expected http/s scheme."
                });
                X.initiator = "fetch", X.destination = "subresource", z.push(X);
                let M = sG6();
                Y.push(q43({
                    request: X,
                    processResponse(P) {
                        if (P.type === "error" || P.status === 206 || P.status < 200 || P.status > 299) M.reject(b5.errors.exception({
                            header: "Cache.addAll",
                            message: "Received an invalid status code or the request failed."
                        }));
                        else if (P.headersList.contains("vary")) {
                            let W = A$1(P.headersList.get("vary"));
                            for (let D of W)
                                if (D === "*") {
                                    M.reject(b5.errors.exception({
                                        header: "Cache.addAll",
                                        message: "invalid vary field value"
                                    }));
                                    for (let Z of Y) Z.abort();
                                    return
                                }
                        }
                    },
                    processResponseEndOfBody(P) {
                        if (P.aborted) {
                            M.reject(new DOMException("aborted", "AbortError"));
                            return
                        }
                        M.resolve(P)
                    }
                })), _.push(M.promise)
            }
            let O = await Promise.all(_),
                w = [],
                $ = 0;
            for (let J of O) {
                let X = {
                    type: "put",
                    request: z[$],
                    response: J
                };
                w.push(X), $++
            }
            let j = sG6(),
                H = null;
            try {
                this.#K(w)
            } catch (J) {
                H = J
            }
            return queueMicrotask(() => {
                if (H === null) j.resolve(void 0);
                else j.reject(H)
            }), j.promise
        }
        async put(q, K) {
            b5.brandCheck(this, BU);
            let _ = "Cache.put";
            b5.argumentLengthCheck(arguments, 2, _), q = b5.converters.RequestInfo(q, _, "request"), K = b5.converters.Response(K, _, "response");
            let z = null;
            if (q instanceof Fr) z = q[Um];
            else z = new Fr(q)[Um];
            if (!tM8(z.url) || z.method !== "GET") throw b5.errors.exception({
                header: _,
                message: "Expected an http/s scheme when method is not GET"
            });
            let Y = K[Um];
            if (Y.status === 206) throw b5.errors.exception({
                header: _,
                message: "Got 206 status"
            });
            if (Y.headersList.contains("vary")) {
                let X = A$1(Y.headersList.get("vary"));
                for (let M of X)
                    if (M === "*") throw b5.errors.exception({
                        header: _,
                        message: "Got * vary field value"
                    })
            }
            if (Y.body && (oq3(Y.body.stream) || Y.body.stream.locked)) throw b5.errors.exception({
                header: _,
                message: "Response body is locked or disturbed"
            });
            let A = sq3(Y),
                O = sG6();
            if (Y.body != null) {
                let M = Y.body.stream.getReader();
                K43(M).then(O.resolve, O.reject)
            } else O.resolve(void 0);
            let w = [],
                $ = {
                    type: "put",
                    request: z,
                    response: A
                };
            w.push($);
            let j = await O.promise;
            if (A.body != null) A.body.source = j;
            let H = sG6(),
                J = null;
            try {
                this.#K(w)
            } catch (X) {
                J = X
            }
            return queueMicrotask(() => {
                if (J === null) H.resolve();
                else H.reject(J)
            }), H.promise
        }
        async delete(q, K = {}) {
            b5.brandCheck(this, BU);
            let _ = "Cache.delete";
            b5.argumentLengthCheck(arguments, 1, _), q = b5.converters.RequestInfo(q, _, "request"), K = b5.converters.CacheQueryOptions(K, _, "options");
            let z = null;
            if (q instanceof Fr) {
                if (z = q[Um], z.method !== "GET" && !K.ignoreMethod) return !1
            } else O$1(typeof q === "string"), z = new Fr(q)[Um];
            let Y = [],
                A = {
                    type: "delete",
                    request: z,
                    options: K
                };
            Y.push(A);
            let O = sG6(),
                w = null,
                $;
            try {
                $ = this.#K(Y)
            } catch (j) {
                w = j
            }
            return queueMicrotask(() => {
                if (w === null) O.resolve(!!$?.length);
                else O.reject(w)
            }), O.promise
        }
        async keys(q = void 0, K = {}) {
            b5.brandCheck(this, BU);
            let _ = "Cache.keys";
            if (q !== void 0) q = b5.converters.RequestInfo(q, _, "request");
            K = b5.converters.CacheQueryOptions(K, _, "options");
            let z = null;
            if (q !== void 0) {
                if (q instanceof Fr) {
                    if (z = q[Um], z.method !== "GET" && !K.ignoreMethod) return []
                } else if (typeof q === "string") z = new Fr(q)[Um]
            }
            let Y = sG6(),
                A = [];
            if (q === void 0)
                for (let O of this.#q) A.push(O[0]);
            else {
                let O = this.#_(z, K);
                for (let w of O) A.push(w[0])
            }
            return queueMicrotask(() => {
                let O = [];
                for (let w of A) {
                    let $ = eq3(w, new AbortController().signal, "immutable");
                    O.push($)
                }
                Y.resolve(Object.freeze(O))
            }), Y.promise
        }
        #K(q) {
            let K = this.#q,
                _ = [...K],
                z = [],
                Y = [];
            try {
                for (let A of q) {
                    if (A.type !== "delete" && A.type !== "put") throw b5.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: 'operation type does not match "delete" or "put"'
                    });
                    if (A.type === "delete" && A.response != null) throw b5.errors.exception({
                        header: "Cache.#batchCacheOperations",
                        message: "delete operation should not have an associated response"
                    });
                    if (this.#_(A.request, A.options, z).length) throw new DOMException("???", "InvalidStateError");
                    let O;
                    if (A.type === "delete") {
                        if (O = this.#_(A.request, A.options), O.length === 0) return [];
                        for (let w of O) {
                            let $ = K.indexOf(w);
                            O$1($ !== -1), K.splice($, 1)
                        }
                    } else if (A.type === "put") {
                        if (A.response == null) throw b5.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "put operation should have an associated response"
                        });
                        let w = A.request;
                        if (!tM8(w.url)) throw b5.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "expected http or https scheme"
                        });
                        if (w.method !== "GET") throw b5.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "not get method"
                        });
                        if (A.options != null) throw b5.errors.exception({
                            header: "Cache.#batchCacheOperations",
                            message: "options must not be defined"
                        });
                        O = this.#_(A.request);
                        for (let $ of O) {
                            let j = K.indexOf($);
                            O$1(j !== -1), K.splice(j, 1)
                        }
                        K.push([A.request, A.response]), z.push([A.request, A.response])
                    }
                    Y.push([A.request, A.response])
                }
                return Y
            } catch (A) {
                throw this.#q.length = 0, this.#q = _, A
            }
        }
        #_(q, K, _) {
            let z = [],
                Y = _ ?? this.#q;
            for (let A of Y) {
                let [O, w] = A;
                if (this.#Y(q, O, w, K)) z.push(A)
            }
            return z
        }
        #Y(q, K, _ = null, z) {
            let Y = new URL(q.url),
                A = new URL(K.url);
            if (z?.ignoreSearch) A.search = "", Y.search = "";
            if (!rq3(Y, A, !0)) return !1;
            if (_ == null || z?.ignoreVary || !_.headersList.contains("vary")) return !0;
            let O = A$1(_.headersList.get("vary"));
            for (let w of O) {
                if (w === "*") return !1;
                let $ = K.headersList.get(w),
                    j = q.headersList.get(w);
                if ($ !== j) return !1
            }
            return !0
        }
        #z(q, K, _ = 1 / 0) {
            let z = null;
            if (q !== void 0) {
                if (q instanceof Fr) {
                    if (z = q[Um], z.method !== "GET" && !K.ignoreMethod) return []
                } else if (typeof q === "string") z = new Fr(q)[Um]
            }
            let Y = [];
            if (q === void 0)
                for (let O of this.#q) Y.push(O[1]);
            else {
                let O = this.#_(z, K);
                for (let w of O) Y.push(w[1])
            }
            let A = [];
            for (let O of Y) {
                let w = tq3(O, "immutable");
                if (A.push(w.clone()), A.length >= _) break
            }
            return Object.freeze(A)
        }
    }
    Object.defineProperties(BU.prototype, {
        [Symbol.toStringTag]: {
            value: "Cache",
            configurable: !0
        },
        match: jO6,
        matchAll: jO6,
        add: jO6,
        addAll: jO6,
        put: jO6,
        delete: jO6,
        keys: jO6
    });
    var go7 = [{
        key: "ignoreSearch",
        converter: b5.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreMethod",
        converter: b5.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "ignoreVary",
        converter: b5.converters.boolean,
        defaultValue: () => !1
    }];
    b5.converters.CacheQueryOptions = b5.dictionaryConverter(go7);
    b5.converters.MultiCacheQueryOptions = b5.dictionaryConverter([...go7, {
        key: "cacheName",
        converter: b5.converters.DOMString
    }]);
    b5.converters.Response = b5.interfaceConverter(aq3);
    b5.converters["sequence<RequestInfo>"] = b5.sequenceConverter(b5.converters.RequestInfo);
    Uo7.exports = {
        Cache: BU
    }
})
// @from(Ln 64167, Col 4)
co7 = p((OzO, do7) => {
    var {
        kConstruct: Cd6
    } = sM8(), {
        Cache: eM8
    } = Qo7(), {
        webidl: Wv
    } = lZ(), {
        kEnumerableProperty: bd6
    } = Hz();
    class A76 {
        #q = new Map;
        constructor() {
            if (arguments[0] !== Cd6) Wv.illegalConstructor();
            Wv.util.markAsUncloneable(this)
        }
        async match(q, K = {}) {
            if (Wv.brandCheck(this, A76), Wv.argumentLengthCheck(arguments, 1, "CacheStorage.match"), q = Wv.converters.RequestInfo(q), K = Wv.converters.MultiCacheQueryOptions(K), K.cacheName != null) {
                if (this.#q.has(K.cacheName)) {
                    let _ = this.#q.get(K.cacheName);
                    return await new eM8(Cd6, _).match(q, K)
                }
            } else
                for (let _ of this.#q.values()) {
                    let Y = await new eM8(Cd6, _).match(q, K);
                    if (Y !== void 0) return Y
                }
        }
        async has(q) {
            Wv.brandCheck(this, A76);
            let K = "CacheStorage.has";
            return Wv.argumentLengthCheck(arguments, 1, K), q = Wv.converters.DOMString(q, K, "cacheName"), this.#q.has(q)
        }
        async open(q) {
            Wv.brandCheck(this, A76);
            let K = "CacheStorage.open";
            if (Wv.argumentLengthCheck(arguments, 1, K), q = Wv.converters.DOMString(q, K, "cacheName"), this.#q.has(q)) {
                let z = this.#q.get(q);
                return new eM8(Cd6, z)
            }
            let _ = [];
            return this.#q.set(q, _), new eM8(Cd6, _)
        }
        async delete(q) {
            Wv.brandCheck(this, A76);
            let K = "CacheStorage.delete";
            return Wv.argumentLengthCheck(arguments, 1, K), q = Wv.converters.DOMString(q, K, "cacheName"), this.#q.delete(q)
        }
        async keys() {
            return Wv.brandCheck(this, A76), [...this.#q.keys()]
        }
    }
    Object.defineProperties(A76.prototype, {
        [Symbol.toStringTag]: {
            value: "CacheStorage",
            configurable: !0
        },
        match: bd6,
        has: bd6,
        open: bd6,
        delete: bd6,
        keys: bd6
    });
    do7.exports = {
        CacheStorage: A76
    }
})
// @from(Ln 64234, Col 4)
no7 = p((wzO, lo7) => {
    lo7.exports = {
        maxAttributeValueSize: 1024,
        maxNameValuePairSize: 4096
    }
})
// @from(Ln 64240, Col 4)
w$1 = p(($zO, so7) => {
    function _43(q) {
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (_ >= 0 && _ <= 8 || _ >= 10 && _ <= 31 || _ === 127) return !0
        }
        return !1
    }

    function io7(q) {
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (_ < 33 || _ > 126 || _ === 34 || _ === 40 || _ === 41 || _ === 60 || _ === 62 || _ === 64 || _ === 44 || _ === 59 || _ === 58 || _ === 92 || _ === 47 || _ === 91 || _ === 93 || _ === 63 || _ === 61 || _ === 123 || _ === 125) throw Error("Invalid cookie name")
        }
    }

    function ro7(q) {
        let K = q.length,
            _ = 0;
        if (q[0] === '"') {
            if (K === 1 || q[K - 1] !== '"') throw Error("Invalid cookie value");
            --K, ++_
        }
        while (_ < K) {
            let z = q.charCodeAt(_++);
            if (z < 33 || z > 126 || z === 34 || z === 44 || z === 59 || z === 92) throw Error("Invalid cookie value")
        }
    }

    function oo7(q) {
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (_ < 32 || _ === 127 || _ === 59) throw Error("Invalid cookie path")
        }
    }

    function z43(q) {
        if (q.startsWith("-") || q.endsWith(".") || q.endsWith("-")) throw Error("Invalid cookie domain")
    }
    var Y43 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        A43 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        qP8 = Array(61).fill(0).map((q, K) => K.toString().padStart(2, "0"));

    function ao7(q) {
        if (typeof q === "number") q = new Date(q);
        return `${Y43[q.getUTCDay()]}, ${qP8[q.getUTCDate()]} ${A43[q.getUTCMonth()]} ${q.getUTCFullYear()} ${qP8[q.getUTCHours()]}:${qP8[q.getUTCMinutes()]}:${qP8[q.getUTCSeconds()]} GMT`
    }

    function O43(q) {
        if (q < 0) throw Error("Invalid cookie max-age")
    }

    function w43(q) {
        if (q.name.length === 0) return null;
        io7(q.name), ro7(q.value);
        let K = [`${q.name}=${q.value}`];
        if (q.name.startsWith("__Secure-")) q.secure = !0;
        if (q.name.startsWith("__Host-")) q.secure = !0, q.domain = null, q.path = "/";
        if (q.secure) K.push("Secure");
        if (q.httpOnly) K.push("HttpOnly");
        if (typeof q.maxAge === "number") O43(q.maxAge), K.push(`Max-Age=${q.maxAge}`);
        if (q.domain) z43(q.domain), K.push(`Domain=${q.domain}`);
        if (q.path) oo7(q.path), K.push(`Path=${q.path}`);
        if (q.expires && q.expires.toString() !== "Invalid Date") K.push(`Expires=${ao7(q.expires)}`);
        if (q.sameSite) K.push(`SameSite=${q.sameSite}`);
        for (let _ of q.unparsed) {
            if (!_.includes("=")) throw Error("Invalid unparsed");
            let [z, ...Y] = _.split("=");
            K.push(`${z.trim()}=${Y.join("=")}`)
        }
        return K.join("; ")
    }
    so7.exports = {
        isCTLExcludingHtab: _43,
        validateCookieName: io7,
        validateCookiePath: oo7,
        validateCookieValue: ro7,
        toIMFDate: ao7,
        stringify: w43
    }
})
// @from(Ln 64321, Col 4)
eo7 = p((jzO, to7) => {
    var {
        maxNameValuePairSize: $43,
        maxAttributeValueSize: j43
    } = no7(), {
        isCTLExcludingHtab: H43
    } = w$1(), {
        collectASequenceOfCodePointsFast: KP8
    } = qE(), J43 = d6("node:assert");

    function X43(q) {
        if (H43(q)) return null;
        let K = "",
            _ = "",
            z = "",
            Y = "";
        if (q.includes(";")) {
            let A = {
                position: 0
            };
            K = KP8(";", q, A), _ = q.slice(A.position)
        } else K = q;
        if (!K.includes("=")) Y = K;
        else {
            let A = {
                position: 0
            };
            z = KP8("=", K, A), Y = K.slice(A.position + 1)
        }
        if (z = z.trim(), Y = Y.trim(), z.length + Y.length > $43) return null;
        return {
            name: z,
            value: Y,
            ...tG6(_)
        }
    }

    function tG6(q, K = {}) {
        if (q.length === 0) return K;
        J43(q[0] === ";"), q = q.slice(1);
        let _ = "";
        if (q.includes(";")) _ = KP8(";", q, {
            position: 0
        }), q = q.slice(_.length);
        else _ = q, q = "";
        let z = "",
            Y = "";
        if (_.includes("=")) {
            let O = {
                position: 0
            };
            z = KP8("=", _, O), Y = _.slice(O.position + 1)
        } else z = _;
        if (z = z.trim(), Y = Y.trim(), Y.length > j43) return tG6(q, K);
        let A = z.toLowerCase();
        if (A === "expires") {
            let O = new Date(Y);
            K.expires = O
        } else if (A === "max-age") {
            let O = Y.charCodeAt(0);
            if ((O < 48 || O > 57) && Y[0] !== "-") return tG6(q, K);
            if (!/^\d+$/.test(Y)) return tG6(q, K);
            let w = Number(Y);
            K.maxAge = w
        } else if (A === "domain") {
            let O = Y;
            if (O[0] === ".") O = O.slice(1);
            O = O.toLowerCase(), K.domain = O
        } else if (A === "path") {
            let O = "";
            if (Y.length === 0 || Y[0] !== "/") O = "/";
            else O = Y;
            K.path = O
        } else if (A === "secure") K.secure = !0;
        else if (A === "httponly") K.httpOnly = !0;
        else if (A === "samesite") {
            let O = "Default",
                w = Y.toLowerCase();
            if (w.includes("none")) O = "None";
            if (w.includes("strict")) O = "Strict";
            if (w.includes("lax")) O = "Lax";
            K.sameSite = O
        } else K.unparsed ??= [], K.unparsed.push(`${z}=${Y}`);
        return tG6(q, K)
    }
    to7.exports = {
        parseSetCookie: X43,
        parseUnparsedAttributes: tG6
    }
})
// @from(Ln 64411, Col 4)
_a7 = p((HzO, Ka7) => {
    var {
        parseSetCookie: M43
    } = eo7(), {
        stringify: P43
    } = w$1(), {
        webidl: KY
    } = lZ(), {
        Headers: _P8
    } = AO6();

    function W43(q) {
        KY.argumentLengthCheck(arguments, 1, "getCookies"), KY.brandCheck(q, _P8, {
            strict: !1
        });
        let K = q.get("cookie"),
            _ = {};
        if (!K) return _;
        for (let z of K.split(";")) {
            let [Y, ...A] = z.split("=");
            _[Y.trim()] = A.join("=")
        }
        return _
    }

    function D43(q, K, _) {
        KY.brandCheck(q, _P8, {
            strict: !1
        });
        let z = "deleteCookie";
        KY.argumentLengthCheck(arguments, 2, z), K = KY.converters.DOMString(K, z, "name"), _ = KY.converters.DeleteCookieAttributes(_), qa7(q, {
            name: K,
            value: "",
            expires: new Date(0),
            ..._
        })
    }

    function Z43(q) {
        KY.argumentLengthCheck(arguments, 1, "getSetCookies"), KY.brandCheck(q, _P8, {
            strict: !1
        });
        let K = q.getSetCookie();
        if (!K) return [];
        return K.map((_) => M43(_))
    }

    function qa7(q, K) {
        KY.argumentLengthCheck(arguments, 2, "setCookie"), KY.brandCheck(q, _P8, {
            strict: !1
        }), K = KY.converters.Cookie(K);
        let _ = P43(K);
        if (_) q.append("Set-Cookie", _)
    }
    KY.converters.DeleteCookieAttributes = KY.dictionaryConverter([{
        converter: KY.nullableConverter(KY.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }]);
    KY.converters.Cookie = KY.dictionaryConverter([{
        converter: KY.converters.DOMString,
        key: "name"
    }, {
        converter: KY.converters.DOMString,
        key: "value"
    }, {
        converter: KY.nullableConverter((q) => {
            if (typeof q === "number") return KY.converters["unsigned long long"](q);
            return new Date(q)
        }),
        key: "expires",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters["long long"]),
        key: "maxAge",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters.DOMString),
        key: "domain",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters.DOMString),
        key: "path",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters.boolean),
        key: "secure",
        defaultValue: () => null
    }, {
        converter: KY.nullableConverter(KY.converters.boolean),
        key: "httpOnly",
        defaultValue: () => null
    }, {
        converter: KY.converters.USVString,
        key: "sameSite",
        allowedValues: ["Strict", "Lax", "None"]
    }, {
        converter: KY.sequenceConverter(KY.converters.DOMString),
        key: "unparsed",
        defaultValue: () => []
    }]);
    Ka7.exports = {
        getCookies: W43,
        deleteCookie: D43,
        getSetCookies: Z43,
        setCookie: qa7
    }
})
// @from(Ln 64523, Col 4)
qv6 = p((JzO, Ya7) => {
    var {
        webidl: Z5
    } = lZ(), {
        kEnumerableProperty: YE
    } = Hz(), {
        kConstruct: za7
    } = oj(), {
        MessagePort: f43
    } = d6("node:worker_threads");
    class Sh extends Event {
        #q;
        constructor(q, K = {}) {
            if (q === za7) {
                super(arguments[1], arguments[2]);
                Z5.util.markAsUncloneable(this);
                return
            }
            let _ = "MessageEvent constructor";
            Z5.argumentLengthCheck(arguments, 1, _), q = Z5.converters.DOMString(q, _, "type"), K = Z5.converters.MessageEventInit(K, _, "eventInitDict");
            super(q, K);
            this.#q = K, Z5.util.markAsUncloneable(this)
        }
        get data() {
            return Z5.brandCheck(this, Sh), this.#q.data
        }
        get origin() {
            return Z5.brandCheck(this, Sh), this.#q.origin
        }
        get lastEventId() {
            return Z5.brandCheck(this, Sh), this.#q.lastEventId
        }
        get source() {
            return Z5.brandCheck(this, Sh), this.#q.source
        }
        get ports() {
            if (Z5.brandCheck(this, Sh), !Object.isFrozen(this.#q.ports)) Object.freeze(this.#q.ports);
            return this.#q.ports
        }
        initMessageEvent(q, K = !1, _ = !1, z = null, Y = "", A = "", O = null, w = []) {
            return Z5.brandCheck(this, Sh), Z5.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new Sh(q, {
                bubbles: K,
                cancelable: _,
                data: z,
                origin: Y,
                lastEventId: A,
                source: O,
                ports: w
            })
        }
        static createFastMessageEvent(q, K) {
            let _ = new Sh(za7, q, K);
            return _.#q = K, _.#q.data ??= null, _.#q.origin ??= "", _.#q.lastEventId ??= "", _.#q.source ??= null, _.#q.ports ??= [], _
        }
    }
    var {
        createFastMessageEvent: G43
    } = Sh;
    delete Sh.createFastMessageEvent;
    class eG6 extends Event {
        #q;
        constructor(q, K = {}) {
            Z5.argumentLengthCheck(arguments, 1, "CloseEvent constructor"), q = Z5.converters.DOMString(q, "CloseEvent constructor", "type"), K = Z5.converters.CloseEventInit(K);
            super(q, K);
            this.#q = K, Z5.util.markAsUncloneable(this)
        }
        get wasClean() {
            return Z5.brandCheck(this, eG6), this.#q.wasClean
        }
        get code() {
            return Z5.brandCheck(this, eG6), this.#q.code
        }
        get reason() {
            return Z5.brandCheck(this, eG6), this.#q.reason
        }
    }
    class O76 extends Event {
        #q;
        constructor(q, K) {
            Z5.argumentLengthCheck(arguments, 1, "ErrorEvent constructor");
            super(q, K);
            Z5.util.markAsUncloneable(this), q = Z5.converters.DOMString(q, "ErrorEvent constructor", "type"), K = Z5.converters.ErrorEventInit(K ?? {}), this.#q = K
        }
        get message() {
            return Z5.brandCheck(this, O76), this.#q.message
        }
        get filename() {
            return Z5.brandCheck(this, O76), this.#q.filename
        }
        get lineno() {
            return Z5.brandCheck(this, O76), this.#q.lineno
        }
        get colno() {
            return Z5.brandCheck(this, O76), this.#q.colno
        }
        get error() {
            return Z5.brandCheck(this, O76), this.#q.error
        }
    }
    Object.defineProperties(Sh.prototype, {
        [Symbol.toStringTag]: {
            value: "MessageEvent",
            configurable: !0
        },
        data: YE,
        origin: YE,
        lastEventId: YE,
        source: YE,
        ports: YE,
        initMessageEvent: YE
    });
    Object.defineProperties(eG6.prototype, {
        [Symbol.toStringTag]: {
            value: "CloseEvent",
            configurable: !0
        },
        reason: YE,
        code: YE,
        wasClean: YE
    });
    Object.defineProperties(O76.prototype, {
        [Symbol.toStringTag]: {
            value: "ErrorEvent",
            configurable: !0
        },
        message: YE,
        filename: YE,
        lineno: YE,
        colno: YE,
        error: YE
    });
    Z5.converters.MessagePort = Z5.interfaceConverter(f43);
    Z5.converters["sequence<MessagePort>"] = Z5.sequenceConverter(Z5.converters.MessagePort);
    var $$1 = [{
        key: "bubbles",
        converter: Z5.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: Z5.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: Z5.converters.boolean,
        defaultValue: () => !1
    }];
    Z5.converters.MessageEventInit = Z5.dictionaryConverter([...$$1, {
        key: "data",
        converter: Z5.converters.any,
        defaultValue: () => null
    }, {
        key: "origin",
        converter: Z5.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lastEventId",
        converter: Z5.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "source",
        converter: Z5.nullableConverter(Z5.converters.MessagePort),
        defaultValue: () => null
    }, {
        key: "ports",
        converter: Z5.converters["sequence<MessagePort>"],
        defaultValue: () => []
    }]);
    Z5.converters.CloseEventInit = Z5.dictionaryConverter([...$$1, {
        key: "wasClean",
        converter: Z5.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "code",
        converter: Z5.converters["unsigned short"],
        defaultValue: () => 0
    }, {
        key: "reason",
        converter: Z5.converters.USVString,
        defaultValue: () => ""
    }]);
    Z5.converters.ErrorEventInit = Z5.dictionaryConverter([...$$1, {
        key: "message",
        converter: Z5.converters.DOMString,
        defaultValue: () => ""
    }, {
        key: "filename",
        converter: Z5.converters.USVString,
        defaultValue: () => ""
    }, {
        key: "lineno",
        converter: Z5.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "colno",
        converter: Z5.converters["unsigned long"],
        defaultValue: () => 0
    }, {
        key: "error",
        converter: Z5.converters.any
    }]);
    Ya7.exports = {
        MessageEvent: Sh,
        CloseEvent: eG6,
        ErrorEvent: O76,
        createFastMessageEvent: G43
    }
})
// @from(Ln 64730, Col 4)
HO6 = p((XzO, Aa7) => {
    var v43 = {
            enumerable: !0,
            writable: !1,
            configurable: !1
        },
        T43 = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        },
        V43 = {
            NOT_SENT: 0,
            PROCESSING: 1,
            SENT: 2
        },
        k43 = {
            CONTINUATION: 0,
            TEXT: 1,
            BINARY: 2,
            CLOSE: 8,
            PING: 9,
            PONG: 10
        },
        N43 = {
            INFO: 0,
            PAYLOADLENGTH_16: 2,
            PAYLOADLENGTH_64: 3,
            READ_DATA: 4
        },
        E43 = Buffer.allocUnsafe(0),
        y43 = {
            string: 1,
            typedArray: 2,
            arrayBuffer: 3,
            blob: 4
        };
    Aa7.exports = {
        uid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        sentCloseFrameState: V43,
        staticPropertyDescriptors: v43,
        states: T43,
        opcodes: k43,
        maxUnsigned16Bit: 65535,
        parserStates: N43,
        emptyBuffer: E43,
        sendHints: y43
    }
})
// @from(Ln 64780, Col 4)
Id6 = p((MzO, Oa7) => {
    Oa7.exports = {
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
// @from(Ln 64792, Col 4)
md6 = p((PzO, Wa7) => {
    var {
        kReadyState: xd6,
        kController: L43,
        kResponse: h43,
        kBinaryType: R43,
        kWebSocketURL: S43
    } = Id6(), {
        states: ud6,
        opcodes: w76
    } = HO6(), {
        ErrorEvent: C43,
        createFastMessageEvent: b43
    } = qv6(), {
        isUtf8: I43
    } = d6("node:buffer"), {
        collectASequenceOfCodePointsFast: x43,
        removeHTTPWhitespace: wa7
    } = qE();

    function u43(q) {
        return q[xd6] === ud6.CONNECTING
    }

    function m43(q) {
        return q[xd6] === ud6.OPEN
    }

    function B43(q) {
        return q[xd6] === ud6.CLOSING
    }

    function p43(q) {
        return q[xd6] === ud6.CLOSED
    }

    function j$1(q, K, _ = (Y, A) => new Event(Y, A), z = {}) {
        let Y = _(q, z);
        K.dispatchEvent(Y)
    }

    function F43(q, K, _) {
        if (q[xd6] !== ud6.OPEN) return;
        let z;
        if (K === w76.TEXT) try {
            z = Pa7(_)
        } catch {
            ja7(q, "Received invalid UTF-8 in text frame.");
            return
        } else if (K === w76.BINARY)
            if (q[R43] === "blob") z = new Blob([_]);
            else z = g43(_);
        j$1("message", q, b43, {
            origin: q[S43].origin,
            data: z
        })
    }

    function g43(q) {
        if (q.byteLength === q.buffer.byteLength) return q.buffer;
        return q.buffer.slice(q.byteOffset, q.byteOffset + q.byteLength)
    }

    function U43(q) {
        if (q.length === 0) return !1;
        for (let K = 0; K < q.length; ++K) {
            let _ = q.charCodeAt(K);
            if (_ < 33 || _ > 126 || _ === 34 || _ === 40 || _ === 41 || _ === 44 || _ === 47 || _ === 58 || _ === 59 || _ === 60 || _ === 61 || _ === 62 || _ === 63 || _ === 64 || _ === 91 || _ === 92 || _ === 93 || _ === 123 || _ === 125) return !1
        }
        return !0
    }

    function Q43(q) {
        if (q >= 1000 && q < 1015) return q !== 1004 && q !== 1005 && q !== 1006;
        return q >= 3000 && q <= 4999
    }

    function ja7(q, K) {
        let {
            [L43]: _, [h43]: z
        } = q;
        if (_.abort(), z?.socket && !z.socket.destroyed) z.socket.destroy();
        if (K) j$1("error", q, (Y, A) => new C43(Y, A), {
            error: Error(K),
            message: K
        })
    }

    function Ha7(q) {
        return q === w76.CLOSE || q === w76.PING || q === w76.PONG
    }

    function Ja7(q) {
        return q === w76.CONTINUATION
    }

    function Xa7(q) {
        return q === w76.TEXT || q === w76.BINARY
    }

    function d43(q) {
        return Xa7(q) || Ja7(q) || Ha7(q)
    }

    function c43(q) {
        let K = {
                position: 0
            },
            _ = new Map;
        while (K.position < q.length) {
            let z = x43(";", q, K),
                [Y, A = ""] = z.split("=");
            _.set(wa7(Y, !0, !1), wa7(A, !1, !0)), K.position++
        }
        return _
    }

    function l43(q) {
        if (q.length === 0) return !1;
        for (let _ = 0; _ < q.length; _++) {
            let z = q.charCodeAt(_);
            if (z < 48 || z > 57) return !1
        }
        let K = Number.parseInt(q, 10);
        return K >= 8 && K <= 15
    }
    var Ma7 = typeof process.versions.icu === "string",
        $a7 = Ma7 ? new TextDecoder("utf-8", {
            fatal: !0
        }) : void 0,
        Pa7 = Ma7 ? $a7.decode.bind($a7) : function(q) {
            if (I43(q)) return q.toString("utf-8");
            throw TypeError("Invalid utf-8 received.")
        };
    Wa7.exports = {
        isConnecting: u43,
        isEstablished: m43,
        isClosing: B43,
        isClosed: p43,
        fireEvent: j$1,
        isValidSubprotocol: U43,
        isValidStatusCode: Q43,
        failWebsocketConnection: ja7,
        websocketMessageReceived: F43,
        utf8Decode: Pa7,
        isControlFrame: Ha7,
        isContinuationFrame: Ja7,
        isTextBinaryFrame: Xa7,
        isValidOpcode: d43,
        parseExtensions: c43,
        isValidClientWindowBits: l43
    }
})
// @from(Ln 64945, Col 4)
zP8 = p((WzO, Za7) => {
    var {
        maxUnsigned16Bit: n43
    } = HO6(), H$1, Bd6 = null, Kv6 = 16386;
    try {
        H$1 = d6("node:crypto")
    } catch {
        H$1 = {
            randomFillSync: function(K, _, z) {
                for (let Y = 0; Y < K.length; ++Y) K[Y] = Math.random() * 255 | 0;
                return K
            }
        }
    }

    function i43() {
        if (Kv6 === 16386) Kv6 = 0, H$1.randomFillSync(Bd6 ??= Buffer.allocUnsafe(16386), 0, 16386);
        return [Bd6[Kv6++], Bd6[Kv6++], Bd6[Kv6++], Bd6[Kv6++]]
    }
    class Da7 {
        constructor(q) {
            this.frameData = q
        }
        createFrame(q) {
            let K = this.frameData,
                _ = i43(),
                z = K?.byteLength ?? 0,
                Y = z,
                A = 6;
            if (z > n43) A += 8, Y = 127;
            else if (z > 125) A += 2, Y = 126;
            let O = Buffer.allocUnsafe(z + A);
            O[0] = O[1] = 0, O[0] |= 128, O[0] = (O[0] & 240) + q; /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
            if (O[A - 4] = _[0], O[A - 3] = _[1], O[A - 2] = _[2], O[A - 1] = _[3], O[1] = Y, Y === 126) O.writeUInt16BE(z, 2);
            else if (Y === 127) O[2] = O[3] = 0, O.writeUIntBE(z, 4, 6);
            O[1] |= 128;
            for (let w = 0; w < z; ++w) O[A + w] = K[w] ^ _[w & 3];
            return O
        }
    }
    Za7.exports = {
        WebsocketFrameSend: Da7
    }
})
// @from(Ln 64989, Col 4)
X$1 = p((DzO, Na7) => {
    var {
        uid: r43,
        states: pd6,
        sentCloseFrameState: YP8,
        emptyBuffer: o43,
        opcodes: a43
    } = HO6(), {
        kReadyState: Fd6,
        kSentClose: AP8,
        kByteParser: Ga7,
        kReceivedClose: fa7,
        kResponse: va7
    } = Id6(), {
        fireEvent: s43,
        failWebsocketConnection: $76,
        isClosing: t43,
        isClosed: e43,
        isEstablished: qK3,
        parseExtensions: KK3
    } = md6(), {
        channels: _v6
    } = PG6(), {
        CloseEvent: _K3
    } = qv6(), {
        makeRequest: zK3
    } = rG6(), {
        fetching: YK3
    } = hd6(), {
        Headers: AK3,
        getHeadersList: OK3
    } = AO6(), {
        getDecodeSplit: wK3
    } = kh(), {
        WebsocketFrameSend: $K3
    } = zP8(), J$1;
    try {
        J$1 = d6("node:crypto")
    } catch {}

    function jK3(q, K, _, z, Y, A) {
        let O = q;
        O.protocol = q.protocol === "ws:" ? "http:" : "https:";
        let w = zK3({
            urlList: [O],
            client: _,
            serviceWorkers: "none",
            referrer: "no-referrer",
            mode: "websocket",
            credentials: "include",
            cache: "no-store",
            redirect: "error"
        });
        if (A.headers) {
            let J = OK3(new AK3(A.headers));
            w.headersList = J
        }
        let $ = J$1.randomBytes(16).toString("base64");
        w.headersList.append("sec-websocket-key", $), w.headersList.append("sec-websocket-version", "13");
        for (let J of K) w.headersList.append("sec-websocket-protocol", J);
        let j = "permessage-deflate; client_max_window_bits";
        return w.headersList.append("sec-websocket-extensions", j), YK3({
            request: w,
            useParallelQueue: !0,
            dispatcher: A.dispatcher,
            processResponse(J) {
                if (J.type === "error" || J.status !== 101) {
                    $76(z, "Received network error or non-101 status code.");
                    return
                }
                if (K.length !== 0 && !J.headersList.get("Sec-WebSocket-Protocol")) {
                    $76(z, "Server did not respond with sent protocols.");
                    return
                }
                if (J.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
                    $76(z, 'Server did not set Upgrade header to "websocket".');
                    return
                }
                if (J.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
                    $76(z, 'Server did not set Connection header to "upgrade".');
                    return
                }
                let X = J.headersList.get("Sec-WebSocket-Accept"),
                    M = J$1.createHash("sha1").update($ + r43).digest("base64");
                if (X !== M) {
                    $76(z, "Incorrect hash received in Sec-WebSocket-Accept header.");
                    return
                }
                let P = J.headersList.get("Sec-WebSocket-Extensions"),
                    W;
                if (P !== null) {
                    if (W = KK3(P), !W.has("permessage-deflate")) {
                        $76(z, "Sec-WebSocket-Extensions header does not match.");
                        return
                    }
                }
                let D = J.headersList.get("Sec-WebSocket-Protocol");
                if (D !== null) {
                    if (!wK3("sec-websocket-protocol", w.headersList).includes(D)) {
                        $76(z, "Protocol was not set in the opening handshake.");
                        return
                    }
                }
                if (J.socket.on("data", Ta7), J.socket.on("close", Va7), J.socket.on("error", ka7), _v6.open.hasSubscribers) _v6.open.publish({
                    address: J.socket.address(),
                    protocol: D,
                    extensions: P
                });
                Y(J, W)
            }
        })
    }

    function HK3(q, K, _, z) {
        if (t43(q) || e43(q));
        else if (!qK3(q)) $76(q, "Connection was closed before it was established."), q[Fd6] = pd6.CLOSING;
        else if (q[AP8] === YP8.NOT_SENT) {
            q[AP8] = YP8.PROCESSING;
            let Y = new $K3;
            if (K !== void 0 && _ === void 0) Y.frameData = Buffer.allocUnsafe(2), Y.frameData.writeUInt16BE(K, 0);
            else if (K !== void 0 && _ !== void 0) Y.frameData = Buffer.allocUnsafe(2 + z), Y.frameData.writeUInt16BE(K, 0), Y.frameData.write(_, 2, "utf-8");
            else Y.frameData = o43;
            q[va7].socket.write(Y.createFrame(a43.CLOSE)), q[AP8] = YP8.SENT, q[Fd6] = pd6.CLOSING
        } else q[Fd6] = pd6.CLOSING
    }

    function Ta7(q) {
        if (!this.ws[Ga7].write(q)) this.pause()
    }

    function Va7() {
        let {
            ws: q
        } = this, {
            [va7]: K
        } = q;
        K.socket.off("data", Ta7), K.socket.off("close", Va7), K.socket.off("error", ka7);
        let _ = q[AP8] === YP8.SENT && q[fa7],
            z = 1005,
            Y = "",
            A = q[Ga7].closingInfo;
        if (A && !A.error) z = A.code ?? 1005, Y = A.reason;
        else if (!q[fa7]) z = 1006;
        if (q[Fd6] = pd6.CLOSED, s43("close", q, (O, w) => new _K3(O, w), {
                wasClean: _,
                code: z,
                reason: Y
            }), _v6.close.hasSubscribers) _v6.close.publish({
            websocket: q,
            code: z,
            reason: Y
        })
    }

    function ka7(q) {
        let {
            ws: K
        } = this;
        if (K[Fd6] = pd6.CLOSING, _v6.socketError.hasSubscribers) _v6.socketError.publish(q);
        this.destroy()
    }
    Na7.exports = {
        establishWebSocketConnection: jK3,
        closeWebSocketConnection: HK3
    }
})
// @from(Ln 65155, Col 4)
ha7 = p((ZzO, La7) => {
    var {
        createInflateRaw: JK3,
        Z_DEFAULT_WINDOWBITS: XK3
    } = d6("node:zlib"), {
        isValidClientWindowBits: MK3
    } = md6(), {
        MessageSizeExceededError: Ea7
    } = aA(), PK3 = Buffer.from([0, 0, 255, 255]), OP8 = Symbol("kBuffer"), gd6 = Symbol("kLength");
    class ya7 {
        #q;
        #K = {};
        #_;
        #Y = !1;
        #z = null;
        constructor(q, K = {}) {
            this.#K.serverNoContextTakeover = q.has("server_no_context_takeover"), this.#K.serverMaxWindowBits = q.get("server_max_window_bits"), this.#_ = K.maxDecompressedMessageSize ?? 4194304
        }
        decompress(q, K, _) {
            if (this.#Y) {
                _(new Ea7);
                return
            }
            if (!this.#q) {
                let z = XK3;
                if (this.#K.serverMaxWindowBits) {
                    if (!MK3(this.#K.serverMaxWindowBits)) {
                        _(Error("Invalid server_max_window_bits"));
                        return
                    }
                    z = Number.parseInt(this.#K.serverMaxWindowBits)
                }
                try {
                    this.#q = JK3({
                        windowBits: z
                    })
                } catch (Y) {
                    _(Y);
                    return
                }
                this.#q[OP8] = [], this.#q[gd6] = 0, this.#q.on("data", (Y) => {
                    if (this.#Y) return;
                    if (this.#q[gd6] += Y.length, this.#q[gd6] > this.#_) {
                        if (this.#Y = !0, this.#q.removeAllListeners(), this.#q.destroy(), this.#q = null, this.#z) {
                            let A = this.#z;
                            this.#z = null, A(new Ea7)
                        }
                        return
                    }
                    this.#q[OP8].push(Y)
                }), this.#q.on("error", (Y) => {
                    this.#q = null, _(Y)
                })
            }
            if (this.#z = _, this.#q.write(q), K) this.#q.write(PK3);
            this.#q.flush(() => {
                if (this.#Y || !this.#q) return;
                let z = Buffer.concat(this.#q[OP8], this.#q[gd6]);
                this.#q[OP8].length = 0, this.#q[gd6] = 0, this.#z = null, _(null, z)
            })
        }
    }
    La7.exports = {
        PerMessageDeflate: ya7
    }
})
// @from(Ln 65221, Col 4)
Fa7 = p((fzO, pa7) => {
    var {
        Writable: WK3
    } = d6("node:stream"), DK3 = d6("node:assert"), {
        parserStates: AE,
        opcodes: zv6,
        states: ZK3,
        emptyBuffer: Ra7,
        sentCloseFrameState: Sa7
    } = HO6(), {
        kReadyState: fK3,
        kSentClose: Ca7,
        kResponse: ba7,
        kReceivedClose: Ia7
    } = Id6(), {
        channels: wP8
    } = PG6(), {
        isValidStatusCode: GK3,
        isValidOpcode: vK3,
        failWebsocketConnection: Ch,
        websocketMessageReceived: xa7,
        utf8Decode: TK3,
        isControlFrame: ua7,
        isTextBinaryFrame: M$1,
        isContinuationFrame: VK3
    } = md6(), {
        WebsocketFrameSend: ma7
    } = zP8(), {
        closeWebSocketConnection: kK3
    } = X$1(), {
        PerMessageDeflate: NK3
    } = ha7();
    class Ba7 extends WK3 {
        #q = [];
        #K = 0;
        #_ = !1;
        #Y = AE.INFO;
        #z = {};
        #w = [];
        #A;
        #$;
        constructor(q, K, _ = {}) {
            super();
            if (this.ws = q, this.#A = K == null ? new Map : K, this.#$ = _, this.#A.has("permessage-deflate")) this.#A.set("permessage-deflate", new NK3(K, _))
        }
        _write(q, K, _) {
            this.#q.push(q), this.#K += q.length, this.#_ = !0, this.run(_)
        }
        run(q) {
            while (this.#_)
                if (this.#Y === AE.INFO) {
                    if (this.#K < 2) return q();
                    let K = this.consume(2),
                        _ = (K[0] & 128) !== 0,
                        z = K[0] & 15,
                        Y = (K[1] & 128) === 128,
                        A = !_ && z !== zv6.CONTINUATION,
                        O = K[1] & 127,
                        w = K[0] & 64,
                        $ = K[0] & 32,
                        j = K[0] & 16;
                    if (!vK3(z)) return Ch(this.ws, "Invalid opcode received"), q();
                    if (Y) return Ch(this.ws, "Frame cannot be masked"), q();
                    if (w !== 0 && !this.#A.has("permessage-deflate")) {
                        Ch(this.ws, "Expected RSV1 to be clear.");
                        return
                    }
                    if ($ !== 0 || j !== 0) {
                        Ch(this.ws, "RSV1, RSV2, RSV3 must be clear");
                        return
                    }
                    if (A && !M$1(z)) {
                        Ch(this.ws, "Invalid frame type was fragmented.");
                        return
                    }
                    if (M$1(z) && this.#w.length > 0) {
                        Ch(this.ws, "Expected continuation frame");
                        return
                    }
                    if (this.#z.fragmented && A) {
                        Ch(this.ws, "Fragmented frame exceeded 125 bytes.");
                        return
                    }
                    if ((O > 125 || A) && ua7(z)) {
                        Ch(this.ws, "Control frame either too large or fragmented");
                        return
                    }
                    if (VK3(z) && this.#w.length === 0 && !this.#z.compressed) {
                        Ch(this.ws, "Unexpected continuation frame");
                        return
                    }
                    if (O <= 125) this.#z.payloadLength = O, this.#Y = AE.READ_DATA;
                    else if (O === 126) this.#Y = AE.PAYLOADLENGTH_16;
                    else if (O === 127) this.#Y = AE.PAYLOADLENGTH_64;
                    if (M$1(z)) this.#z.binaryType = z, this.#z.compressed = w !== 0;
                    this.#z.opcode = z, this.#z.masked = Y, this.#z.fin = _, this.#z.fragmented = A
                } else if (this.#Y === AE.PAYLOADLENGTH_16) {
                if (this.#K < 2) return q();
                let K = this.consume(2);
                this.#z.payloadLength = K.readUInt16BE(0), this.#Y = AE.READ_DATA
            } else if (this.#Y === AE.PAYLOADLENGTH_64) {
                if (this.#K < 8) return q();
                let K = this.consume(8),
                    _ = K.readUInt32BE(0),
                    z = K.readUInt32BE(4);
                if (_ !== 0 || z > 2147483647) {
                    Ch(this.ws, "Received payload length > 2^31 bytes.");
                    return
                }
                this.#z.payloadLength = z, this.#Y = AE.READ_DATA
            } else if (this.#Y === AE.READ_DATA) {
                if (this.#K < this.#z.payloadLength) return q();
                let K = this.consume(this.#z.payloadLength);
                if (ua7(this.#z.opcode)) this.#_ = this.parseControlFrame(K), this.#Y = AE.INFO;
                else if (!this.#z.compressed) {
                    if (this.#w.push(K), !this.#z.fragmented && this.#z.fin) {
                        let _ = Buffer.concat(this.#w);
                        xa7(this.ws, this.#z.binaryType, _), this.#w.length = 0
                    }
                    this.#Y = AE.INFO
                } else {
                    this.#A.get("permessage-deflate").decompress(K, this.#z.fin, (_, z) => {
                        if (_) {
                            Ch(this.ws, _.message);
                            return
                        }
                        if (this.#w.push(z), !this.#z.fin) {
                            this.#Y = AE.INFO, this.#_ = !0, this.run(q);
                            return
                        }
                        xa7(this.ws, this.#z.binaryType, Buffer.concat(this.#w)), this.#_ = !0, this.#Y = AE.INFO, this.#w.length = 0, this.run(q)
                    }), this.#_ = !1;
                    break
                }
            }
        }
        consume(q) {
            if (q > this.#K) throw Error("Called consume() before buffers satiated.");
            else if (q === 0) return Ra7;
            if (this.#q[0].length === q) return this.#K -= this.#q[0].length, this.#q.shift();
            let K = Buffer.allocUnsafe(q),
                _ = 0;
            while (_ !== q) {
                let z = this.#q[0],
                    {
                        length: Y
                    } = z;
                if (Y + _ === q) {
                    K.set(this.#q.shift(), _);
                    break
                } else if (Y + _ > q) {
                    K.set(z.subarray(0, q - _), _), this.#q[0] = z.subarray(q - _);
                    break
                } else K.set(this.#q.shift(), _), _ += z.length
            }
            return this.#K -= q, K
        }
        parseCloseBody(q) {
            DK3(q.length !== 1);
            let K;
            if (q.length >= 2) K = q.readUInt16BE(0);
            if (K !== void 0 && !GK3(K)) return {
                code: 1002,
                reason: "Invalid status code",
                error: !0
            };
            let _ = q.subarray(2);
            if (_[0] === 239 && _[1] === 187 && _[2] === 191) _ = _.subarray(3);
            try {
                _ = TK3(_)
            } catch {
                return {
                    code: 1007,
                    reason: "Invalid UTF-8",
                    error: !0
                }
            }
            return {
                code: K,
                reason: _,
                error: !1
            }
        }
        parseControlFrame(q) {
            let {
                opcode: K,
                payloadLength: _
            } = this.#z;
            if (K === zv6.CLOSE) {
                if (_ === 1) return Ch(this.ws, "Received close frame with a 1-byte body."), !1;
                if (this.#z.closeInfo = this.parseCloseBody(q), this.#z.closeInfo.error) {
                    let {
                        code: z,
                        reason: Y
                    } = this.#z.closeInfo;
                    return kK3(this.ws, z, Y, Y.length), Ch(this.ws, Y), !1
                }
                if (this.ws[Ca7] !== Sa7.SENT) {
                    let z = Ra7;
                    if (this.#z.closeInfo.code) z = Buffer.allocUnsafe(2), z.writeUInt16BE(this.#z.closeInfo.code, 0);
                    let Y = new ma7(z);
                    this.ws[ba7].socket.write(Y.createFrame(zv6.CLOSE), (A) => {
                        if (!A) this.ws[Ca7] = Sa7.SENT
                    })
                }
                return this.ws[fK3] = ZK3.CLOSING, this.ws[Ia7] = !0, !1
            } else if (K === zv6.PING) {
                if (!this.ws[Ia7]) {
                    let z = new ma7(q);
                    if (this.ws[ba7].socket.write(z.createFrame(zv6.PONG)), wP8.ping.hasSubscribers) wP8.ping.publish({
                        payload: q
                    })
                }
            } else if (K === zv6.PONG) {
                if (wP8.pong.hasSubscribers) wP8.pong.publish({
                    payload: q
                })
            }
            return !0
        }
        get closingInfo() {
            return this.#z.closeInfo
        }
    }
    pa7.exports = {
        ByteParser: Ba7
    }
})
// @from(Ln 65449, Col 4)
la7 = p((GzO, ca7) => {
    var {
        WebsocketFrameSend: EK3
    } = zP8(), {
        opcodes: ga7,
        sendHints: Yv6
    } = HO6(), yK3 = aw1(), Ua7 = Buffer[Symbol.species];
    class da7 {
        #q = new yK3;
        #K = !1;
        #_;
        constructor(q) {
            this.#_ = q
        }
        add(q, K, _) {
            if (_ !== Yv6.blob) {
                let Y = Qa7(q, _);
                if (!this.#K) this.#_.write(Y, K);
                else {
                    let A = {
                        promise: null,
                        callback: K,
                        frame: Y
                    };
                    this.#q.push(A)
                }
                return
            }
            let z = {
                promise: q.arrayBuffer().then((Y) => {
                    z.promise = null, z.frame = Qa7(Y, _)
                }),
                callback: K,
                frame: null
            };
            if (this.#q.push(z), !this.#K) this.#Y()
        }
        async #Y() {
            this.#K = !0;
            let q = this.#q;
            while (!q.isEmpty()) {
                let K = q.shift();
                if (K.promise !== null) await K.promise;
                this.#_.write(K.frame, K.callback), K.callback = K.frame = null
            }
            this.#K = !1
        }
    }

    function Qa7(q, K) {
        return new EK3(LK3(q, K)).createFrame(K === Yv6.string ? ga7.TEXT : ga7.BINARY)
    }

    function LK3(q, K) {
        switch (K) {
            case Yv6.string:
                return Buffer.from(q);
            case Yv6.arrayBuffer:
            case Yv6.blob:
                return new Ua7(q);
            case Yv6.typedArray:
                return new Ua7(q.buffer, q.byteOffset, q.byteLength)
        }
    }
    ca7.exports = {
        SendQueue: da7
    }
})
// @from(Ln 65517, Col 4)
qs7 = p((vzO, ea7) => {
    var {
        webidl: v3
    } = lZ(), {
        URLSerializer: hK3
    } = qE(), {
        environmentSettingsObject: na7
    } = kh(), {
        staticPropertyDescriptors: j76,
        states: Ud6,
        sentCloseFrameState: RK3,
        sendHints: $P8
    } = HO6(), {
        kWebSocketURL: ia7,
        kReadyState: P$1,
        kController: SK3,
        kBinaryType: jP8,
        kResponse: ra7,
        kSentClose: CK3,
        kByteParser: bK3
    } = Id6(), {
        isConnecting: IK3,
        isEstablished: xK3,
        isClosing: uK3,
        isValidSubprotocol: mK3,
        fireEvent: oa7
    } = md6(), {
        establishWebSocketConnection: BK3,
        closeWebSocketConnection: aa7
    } = X$1(), {
        ByteParser: pK3
    } = Fa7(), {
        kEnumerableProperty: wb,
        isBlobLike: sa7
    } = Hz(), {
        getGlobalDispatcher: FK3
    } = SM8(), {
        types: ta7
    } = d6("node:util"), {
        ErrorEvent: gK3,
        CloseEvent: UK3
    } = qv6(), {
        SendQueue: QK3
    } = la7();
    class pO extends EventTarget {
        #q = {
            open: null,
            error: null,
            close: null,
            message: null
        };
        #K = 0;
        #_ = "";
        #Y = "";
        #z;
        #w;
        constructor(q, K = []) {
            super();
            v3.util.markAsUncloneable(this);
            let _ = "WebSocket constructor";
            v3.argumentLengthCheck(arguments, 1, _);
            let z = v3.converters["DOMString or sequence<DOMString> or WebSocketInit"](K, _, "options");
            q = v3.converters.USVString(q, _, "url"), K = z.protocols;
            let Y = na7.settingsObject.baseUrl,
                A;
            try {
                A = new URL(q, Y)
            } catch (w) {
                throw new DOMException(w, "SyntaxError")
            }
            if (A.protocol === "http:") A.protocol = "ws:";
            else if (A.protocol === "https:") A.protocol = "wss:";
            if (A.protocol !== "ws:" && A.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${A.protocol}`, "SyntaxError");
            if (A.hash || A.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
            if (typeof K === "string") K = [K];
            if (K.length !== new Set(K.map((w) => w.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            if (K.length > 0 && !K.every((w) => mK3(w))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
            this[ia7] = new URL(A.href), this.#w = {
                maxDecompressedMessageSize: z.maxDecompressedMessageSize
            };
            let O = na7.settingsObject;
            this[SK3] = BK3(A, K, O, this, (w, $) => this.#A(w, $), z), this[P$1] = pO.CONNECTING, this[CK3] = RK3.NOT_SENT, this[jP8] = "blob"
        }
        close(q = void 0, K = void 0) {
            v3.brandCheck(this, pO);
            let _ = "WebSocket.close";
            if (q !== void 0) q = v3.converters["unsigned short"](q, _, "code", {
                clamp: !0
            });
            if (K !== void 0) K = v3.converters.USVString(K, _, "reason");
            if (q !== void 0) {
                if (q !== 1000 && (q < 3000 || q > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
            }
            let z = 0;
            if (K !== void 0) {
                if (z = Buffer.byteLength(K), z > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${z}`, "SyntaxError")
            }
            aa7(this, q, K, z)
        }
        send(q) {
            v3.brandCheck(this, pO);
            let K = "WebSocket.send";
            if (v3.argumentLengthCheck(arguments, 1, K), q = v3.converters.WebSocketSendData(q, K, "data"), IK3(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
            if (!xK3(this) || uK3(this)) return;
            if (typeof q === "string") {
                let _ = Buffer.byteLength(q);
                this.#K += _, this.#z.add(q, () => {
                    this.#K -= _
                }, $P8.string)
            } else if (ta7.isArrayBuffer(q)) this.#K += q.byteLength, this.#z.add(q, () => {
                this.#K -= q.byteLength
            }, $P8.arrayBuffer);
            else if (ArrayBuffer.isView(q)) this.#K += q.byteLength, this.#z.add(q, () => {
                this.#K -= q.byteLength
            }, $P8.typedArray);
            else if (sa7(q)) this.#K += q.size, this.#z.add(q, () => {
                this.#K -= q.size
            }, $P8.blob)
        }
        get readyState() {
            return v3.brandCheck(this, pO), this[P$1]
        }
        get bufferedAmount() {
            return v3.brandCheck(this, pO), this.#K
        }
        get url() {
            return v3.brandCheck(this, pO), hK3(this[ia7])
        }
        get extensions() {
            return v3.brandCheck(this, pO), this.#Y
        }
        get protocol() {
            return v3.brandCheck(this, pO), this.#_
        }
        get onopen() {
            return v3.brandCheck(this, pO), this.#q.open
        }
        set onopen(q) {
            if (v3.brandCheck(this, pO), this.#q.open) this.removeEventListener("open", this.#q.open);
            if (typeof q === "function") this.#q.open = q, this.addEventListener("open", q);
            else this.#q.open = null
        }
        get onerror() {
            return v3.brandCheck(this, pO), this.#q.error
        }
        set onerror(q) {
            if (v3.brandCheck(this, pO), this.#q.error) this.removeEventListener("error", this.#q.error);
            if (typeof q === "function") this.#q.error = q, this.addEventListener("error", q);
            else this.#q.error = null
        }
        get onclose() {
            return v3.brandCheck(this, pO), this.#q.close
        }
        set onclose(q) {
            if (v3.brandCheck(this, pO), this.#q.close) this.removeEventListener("close", this.#q.close);
            if (typeof q === "function") this.#q.close = q, this.addEventListener("close", q);
            else this.#q.close = null
        }
        get onmessage() {
            return v3.brandCheck(this, pO), this.#q.message
        }
        set onmessage(q) {
            if (v3.brandCheck(this, pO), this.#q.message) this.removeEventListener("message", this.#q.message);
            if (typeof q === "function") this.#q.message = q, this.addEventListener("message", q);
            else this.#q.message = null
        }
        get binaryType() {
            return v3.brandCheck(this, pO), this[jP8]
        }
        set binaryType(q) {
            if (v3.brandCheck(this, pO), q !== "blob" && q !== "arraybuffer") this[jP8] = "blob";
            else this[jP8] = q
        }
        #A(q, K) {
            this[ra7] = q;
            let _ = new pK3(this, K, this.#w);
            _.on("drain", dK3), _.on("error", cK3.bind(this)), q.socket.ws = this, this[bK3] = _, this.#z = new QK3(q.socket), this[P$1] = Ud6.OPEN;
            let z = q.headersList.get("sec-websocket-extensions");
            if (z !== null) this.#Y = z;
            let Y = q.headersList.get("sec-websocket-protocol");
            if (Y !== null) this.#_ = Y;
            oa7("open", this)
        }
    }
    pO.CONNECTING = pO.prototype.CONNECTING = Ud6.CONNECTING;
    pO.OPEN = pO.prototype.OPEN = Ud6.OPEN;
    pO.CLOSING = pO.prototype.CLOSING = Ud6.CLOSING;
    pO.CLOSED = pO.prototype.CLOSED = Ud6.CLOSED;
    Object.defineProperties(pO.prototype, {
        CONNECTING: j76,
        OPEN: j76,
        CLOSING: j76,
        CLOSED: j76,
        url: wb,
        readyState: wb,
        bufferedAmount: wb,
        onopen: wb,
        onerror: wb,
        onclose: wb,
        close: wb,
        onmessage: wb,
        binaryType: wb,
        send: wb,
        extensions: wb,
        protocol: wb,
        [Symbol.toStringTag]: {
            value: "WebSocket",
            writable: !1,
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(pO, {
        CONNECTING: j76,
        OPEN: j76,
        CLOSING: j76,
        CLOSED: j76
    });
    v3.converters["sequence<DOMString>"] = v3.sequenceConverter(v3.converters.DOMString);
    v3.converters["DOMString or sequence<DOMString>"] = function(q, K, _) {
        if (v3.util.Type(q) === "Object" && Symbol.iterator in q) return v3.converters["sequence<DOMString>"](q);
        return v3.converters.DOMString(q, K, _)
    };
    v3.converters.WebSocketInit = v3.dictionaryConverter([{
        key: "protocols",
        converter: v3.converters["DOMString or sequence<DOMString>"],
        defaultValue: () => []
    }, {
        key: "dispatcher",
        converter: v3.converters.any,
        defaultValue: () => FK3()
    }, {
        key: "headers",
        converter: v3.nullableConverter(v3.converters.HeadersInit)
    }, {
        key: "maxDecompressedMessageSize",
        converter: v3.nullableConverter((q) => {
            if (q = v3.converters["unsigned long long"](q), q <= 0) throw v3.errors.exception({
                header: "WebSocket constructor",
                message: "maxDecompressedMessageSize must be greater than 0"
            });
            return q
        })
    }]);
    v3.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(q) {
        if (v3.util.Type(q) === "Object" && !(Symbol.iterator in q)) return v3.converters.WebSocketInit(q);
        return {
            protocols: v3.converters["DOMString or sequence<DOMString>"](q)
        }
    };
    v3.converters.WebSocketSendData = function(q) {
        if (v3.util.Type(q) === "Object") {
            if (sa7(q)) return v3.converters.Blob(q, {
                strict: !1
            });
            if (ArrayBuffer.isView(q) || ta7.isArrayBuffer(q)) return v3.converters.BufferSource(q)
        }
        return v3.converters.USVString(q)
    };

    function dK3() {
        this.ws[ra7].socket.resume()
    }

    function cK3(q) {
        let K, _;
        if (q instanceof UK3) K = q.reason, _ = q.code;
        else K = q.message;
        oa7("error", this, () => new gK3("error", {
            error: q,
            message: K
        })), aa7(this, _)
    }
    ea7.exports = {
        WebSocket: pO
    }
})
// @from(Ln 65794, Col 4)
W$1 = p((TzO, Ks7) => {
    function lK3(q) {
        return q.indexOf("\x00") === -1
    }

    function nK3(q) {
        if (q.length === 0) return !1;
        for (let K = 0; K < q.length; K++)
            if (q.charCodeAt(K) < 48 || q.charCodeAt(K) > 57) return !1;
        return !0
    }

    function iK3(q) {
        return new Promise((K) => {
            setTimeout(K, q).unref()
        })
    }
    Ks7.exports = {
        isValidLastEventId: lK3,
        isASCIINumber: nK3,
        delay: iK3
    }
})
// @from(Ln 65817, Col 4)
Os7 = p((VzO, As7) => {
    var {
        Transform: rK3
    } = d6("node:stream"), {
        isASCIINumber: _s7,
        isValidLastEventId: zs7
    } = W$1(), gr = [239, 187, 191];
    class Ys7 extends rK3 {
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
        constructor(q = {}) {
            q.readableObjectMode = !0;
            super(q);
            if (this.state = q.eventSourceSettings || {}, q.push) this.push = q.push
        }
        _transform(q, K, _) {
            if (q.length === 0) {
                _();
                return
            }
            if (this.buffer) this.buffer = Buffer.concat([this.buffer, q]);
            else this.buffer = q;
            if (this.checkBOM) switch (this.buffer.length) {
                case 1:
                    if (this.buffer[0] === gr[0]) {
                        _();
                        return
                    }
                    this.checkBOM = !1, _();
                    return;
                case 2:
                    if (this.buffer[0] === gr[0] && this.buffer[1] === gr[1]) {
                        _();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                case 3:
                    if (this.buffer[0] === gr[0] && this.buffer[1] === gr[1] && this.buffer[2] === gr[2]) {
                        this.buffer = Buffer.alloc(0), this.checkBOM = !1, _();
                        return
                    }
                    this.checkBOM = !1;
                    break;
                default:
                    if (this.buffer[0] === gr[0] && this.buffer[1] === gr[1] && this.buffer[2] === gr[2]) this.buffer = this.buffer.subarray(3);
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
            _()
        }
        parseLine(q, K) {
            if (q.length === 0) return;
            let _ = q.indexOf(58);
            if (_ === 0) return;
            let z = "",
                Y = "";
            if (_ !== -1) {
                z = q.subarray(0, _).toString("utf8");
                let A = _ + 1;
                if (q[A] === 32) ++A;
                Y = q.subarray(A).toString("utf8")
            } else z = q.toString("utf8"), Y = "";
            switch (z) {
                case "data":
                    if (K[z] === void 0) K[z] = Y;
                    else K[z] += `
${Y}`;
                    break;
                case "retry":
                    if (_s7(Y)) K[z] = Y;
                    break;
                case "id":
                    if (zs7(Y)) K[z] = Y;
                    break;
                case "event":
                    if (Y.length > 0) K[z] = Y;
                    break
            }
        }
        processEvent(q) {
            if (q.retry && _s7(q.retry)) this.state.reconnectionTime = parseInt(q.retry, 10);
            if (q.id && zs7(q.id)) this.state.lastEventId = q.id;
            if (q.data !== void 0) this.push({
                type: q.event || "message",
                options: {
                    data: q.data,
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
    As7.exports = {
        EventSourceStream: Ys7
    }
})
// @from(Ln 65957, Col 4)
Ps7 = p((kzO, Ms7) => {
    var {
        pipeline: oK3
    } = d6("node:stream"), {
        fetching: aK3
    } = hd6(), {
        makeRequest: sK3
    } = rG6(), {
        webidl: Ur
    } = lZ(), {
        EventSourceStream: tK3
    } = Os7(), {
        parseMIMEType: eK3
    } = qE(), {
        createFastMessageEvent: q53
    } = qv6(), {
        isNetworkError: ws7
    } = yd6(), {
        delay: K53
    } = W$1(), {
        kEnumerableProperty: JO6
    } = Hz(), {
        environmentSettingsObject: $s7
    } = kh(), js7 = !1, Hs7 = 3000, Qd6 = 0, Js7 = 1, dd6 = 2, _53 = "anonymous", z53 = "use-credentials";
    class Av6 extends EventTarget {
        #q = {
            open: null,
            error: null,
            message: null
        };
        #K = null;
        #_ = !1;
        #Y = Qd6;
        #z = null;
        #w = null;
        #A;
        #$;
        constructor(q, K = {}) {
            super();
            Ur.util.markAsUncloneable(this);
            let _ = "EventSource constructor";
            if (Ur.argumentLengthCheck(arguments, 1, _), !js7) js7 = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
                code: "UNDICI-ES"
            });
            q = Ur.converters.USVString(q, _, "url"), K = Ur.converters.EventSourceInitDict(K, _, "eventSourceInitDict"), this.#A = K.dispatcher, this.#$ = {
                lastEventId: "",
                reconnectionTime: Hs7
            };
            let z = $s7,
                Y;
            try {
                Y = new URL(q, z.settingsObject.baseUrl), this.#$.origin = Y.origin
            } catch (w) {
                throw new DOMException(w, "SyntaxError")
            }
            this.#K = Y.href;
            let A = _53;
            if (K.withCredentials) A = z53, this.#_ = !0;
            let O = {
                redirect: "follow",
                keepalive: !0,
                mode: "cors",
                credentials: A === "anonymous" ? "same-origin" : "omit",
                referrer: "no-referrer"
            };
            O.client = $s7.settingsObject, O.headersList = [
                ["accept", {
                    name: "accept",
                    value: "text/event-stream"
                }]
            ], O.cache = "no-store", O.initiator = "other", O.urlList = [new URL(this.#K)], this.#z = sK3(O), this.#H()
        }
        get readyState() {
            return this.#Y
        }
        get url() {
            return this.#K
        }
        get withCredentials() {
            return this.#_
        }
        #H() {
            if (this.#Y === dd6) return;
            this.#Y = Qd6;
            let q = {
                    request: this.#z,
                    dispatcher: this.#A
                },
                K = (_) => {
                    if (ws7(_)) this.dispatchEvent(new Event("error")), this.close();
                    this.#j()
                };
            q.processResponseEndOfBody = K, q.processResponse = (_) => {
                if (ws7(_))
                    if (_.aborted) {
                        this.close(), this.dispatchEvent(new Event("error"));
                        return
                    } else {
                        this.#j();
                        return
                    } let z = _.headersList.get("content-type", !0),
                    Y = z !== null ? eK3(z) : "failure",
                    A = Y !== "failure" && Y.essence === "text/event-stream";
                if (_.status !== 200 || A === !1) {
                    this.close(), this.dispatchEvent(new Event("error"));
                    return
                }
                this.#Y = Js7, this.dispatchEvent(new Event("open")), this.#$.origin = _.urlList[_.urlList.length - 1].origin;
                let O = new tK3({
                    eventSourceSettings: this.#$,
                    push: (w) => {
                        this.dispatchEvent(q53(w.type, w.options))
                    }
                });
                oK3(_.body.stream, O, (w) => {
                    if (w?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
                })
            }, this.#w = aK3(q)
        }
        async #j() {
            if (this.#Y === dd6) return;
            if (this.#Y = Qd6, this.dispatchEvent(new Event("error")), await K53(this.#$.reconnectionTime), this.#Y !== Qd6) return;
            if (this.#$.lastEventId.length) this.#z.headersList.set("last-event-id", this.#$.lastEventId, !0);
            this.#H()
        }
        close() {
            if (Ur.brandCheck(this, Av6), this.#Y === dd6) return;
            this.#Y = dd6, this.#w.abort(), this.#z = null
        }
        get onopen() {
            return this.#q.open
        }
        set onopen(q) {
            if (this.#q.open) this.removeEventListener("open", this.#q.open);
            if (typeof q === "function") this.#q.open = q, this.addEventListener("open", q);
            else this.#q.open = null
        }
        get onmessage() {
            return this.#q.message
        }
        set onmessage(q) {
            if (this.#q.message) this.removeEventListener("message", this.#q.message);
            if (typeof q === "function") this.#q.message = q, this.addEventListener("message", q);
            else this.#q.message = null
        }
        get onerror() {
            return this.#q.error
        }
        set onerror(q) {
            if (this.#q.error) this.removeEventListener("error", this.#q.error);
            if (typeof q === "function") this.#q.error = q, this.addEventListener("error", q);
            else this.#q.error = null
        }
    }
    var Xs7 = {
        CONNECTING: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: Qd6,
            writable: !1
        },
        OPEN: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: Js7,
            writable: !1
        },
        CLOSED: {
            __proto__: null,
            configurable: !1,
            enumerable: !0,
            value: dd6,
            writable: !1
        }
    };
    Object.defineProperties(Av6, Xs7);
    Object.defineProperties(Av6.prototype, Xs7);
    Object.defineProperties(Av6.prototype, {
        close: JO6,
        onerror: JO6,
        onmessage: JO6,
        onopen: JO6,
        readyState: JO6,
        url: JO6,
        withCredentials: JO6
    });
    Ur.converters.EventSourceInitDict = Ur.dictionaryConverter([{
        key: "withCredentials",
        converter: Ur.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "dispatcher",
        converter: Ur.converters.any
    }]);
    Ms7.exports = {
        EventSource: Av6,
        defaultReconnectionTime: Hs7
    }
})
// @from(Ln 66158, Col 4)
ld6 = p((m53, C3) => {
    var Y53 = xG6(),
        Ws7 = nQ6(),
        A53 = uG6(),
        O53 = gl7(),
        w53 = mG6(),
        $53 = j21(),
        j53 = Pn7(),
        H53 = Tn7(),
        Ds7 = aA(),
        JP8 = Hz(),
        {
            InvalidArgumentError: HP8
        } = Ds7,
        Ov6 = Pi7(),
        J53 = rQ6(),
        X53 = x21(),
        M53 = qr7(),
        P53 = m21(),
        W53 = k21(),
        D53 = TM8(),
        {
            getGlobalDispatcher: Zs7,
            setGlobalDispatcher: Z53
        } = SM8(),
        f53 = CM8(),
        G53 = JM8(),
        v53 = XM8();
    Object.assign(Ws7.prototype, Ov6);
    m53.Dispatcher = Ws7;
    m53.Client = Y53;
    m53.Pool = A53;
    m53.BalancedPool = O53;
    m53.Agent = w53;
    m53.ProxyAgent = $53;
    m53.EnvHttpProxyAgent = j53;
    m53.RetryAgent = H53;
    m53.RetryHandler = D53;
    m53.DecoratorHandler = f53;
    m53.RedirectHandler = G53;
    m53.createRedirectInterceptor = v53;
    m53.interceptors = {
        redirect: wr7(),
        retry: jr7(),
        dump: Xr7(),
        dns: Zr7()
    };
    m53.buildConnector = J53;
    m53.errors = Ds7;
    m53.util = {
        parseHeaders: JP8.parseHeaders,
        headerNameToString: JP8.headerNameToString
    };

    function cd6(q) {
        return (K, _, z) => {
            if (typeof _ === "function") z = _, _ = null;
            if (!K || typeof K !== "string" && typeof K !== "object" && !(K instanceof URL)) throw new HP8("invalid url");
            if (_ != null && typeof _ !== "object") throw new HP8("invalid opts");
            if (_ && _.path != null) {
                if (typeof _.path !== "string") throw new HP8("invalid opts.path");
                let O = _.path;
                if (!_.path.startsWith("/")) O = `/${O}`;
                K = new URL(JP8.parseOrigin(K).origin + O)
            } else {
                if (!_) _ = typeof K === "object" ? K : {};
                K = JP8.parseURL(K)
            }
            let {
                agent: Y,
                dispatcher: A = Zs7()
            } = _;
            if (Y) throw new HP8("unsupported opts.agent. Did you mean opts.client?");
            return q.call(A, {
                ..._,
                origin: K.origin,
                path: K.search ? `${K.pathname}${K.search}` : K.pathname,
                method: _.method || (_.body ? "PUT" : "GET")
            }, z)
        }
    }
    m53.setGlobalDispatcher = Z53;
    m53.getGlobalDispatcher = Zs7;
    var T53 = hd6().fetch;
    m53.fetch = async function(K, _ = void 0) {
        try {
            return await T53(K, _)
        } catch (z) {
            if (z && typeof z === "object") Error.captureStackTrace(z);
            throw z
        }
    };
    m53.Headers = AO6().Headers;
    m53.Response = yd6().Response;
    m53.Request = rG6().Request;
    m53.FormData = qd6().FormData;
    m53.File = globalThis.File ?? d6("node:buffer").File;
    m53.FileReader = uo7().FileReader;
    var {
        setGlobalOrigin: V53,
        getGlobalOrigin: k53
    } = Tw1();
    m53.setGlobalOrigin = V53;
    m53.getGlobalOrigin = k53;
    var {
        CacheStorage: N53
    } = co7(), {
        kConstruct: E53
    } = sM8();
    m53.caches = new N53(E53);
    var {
        deleteCookie: y53,
        getCookies: L53,
        getSetCookies: h53,
        setCookie: R53
    } = _a7();
    m53.deleteCookie = y53;
    m53.getCookies = L53;
    m53.getSetCookies = h53;
    m53.setCookie = R53;
    var {
        parseMIMEType: S53,
        serializeAMimeType: C53
    } = qE();
    m53.parseMIMEType = S53;
    m53.serializeAMimeType = C53;
    var {
        CloseEvent: b53,
        ErrorEvent: I53,
        MessageEvent: x53
    } = qv6();
    m53.WebSocket = qs7().WebSocket;
    m53.CloseEvent = b53;
    m53.ErrorEvent = I53;
    m53.MessageEvent = x53;
    m53.request = cd6(Ov6.request);
    m53.stream = cd6(Ov6.stream);
    m53.pipeline = cd6(Ov6.pipeline);
    m53.connect = cd6(Ov6.connect);
    m53.upgrade = cd6(Ov6.upgrade);
    m53.MockClient = X53;
    m53.MockPool = P53;
    m53.MockAgent = M53;
    m53.mockErrors = W53;
    var {
        EventSource: u53
    } = Ps7();
    m53.EventSource = u53
})
// @from(Ln 66311, Col 0)
function OE() {
    let q = $b(),
        K = Im();
    if (!q && !K) return;
    return {
        ...q,
        ...K && {
            ca: K
        }
    }
}
// @from(Ln 66323, Col 0)
function MP8() {
    let q = $b(),
        K = Im();
    if (!q && !K) return {};
    let _ = {
        ...q,
        ...K && {
            ca: K
        }
    };
    if (typeof Bun < "u") return {
        tls: _
    };
    return E("TLS: Created undici agent with custom certificates"), {
        dispatcher: new(ld6()).Agent({
            connect: {
                cert: _.cert,
                key: _.key,
                passphrase: _.passphrase,
                ..._.ca && {
                    ca: _.ca
                }
            },
            pipelining: 1
        })
    }
}
// @from(Ln 66351, Col 0)
function fs7() {
    $b.cache.clear?.(), XP8.cache.clear?.(), E("Cleared mTLS configuration cache")
}
// @from(Ln 66355, Col 0)
function Gs7() {
    if (!$b()) return;
    if (process.env.NODE_EXTRA_CA_CERTS) E("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Ln 66359, Col 4)
$b
// @from(Ln 66359, Col 8)
XP8