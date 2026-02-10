
// @from(Ln 31094, Col 4)
go1 = (A) => {
    let q = _C({}, A),
        {
            data: K,
            withXSRFToken: Y,
            xsrfHeaderName: z,
            xsrfCookieName: w,
            headers: H,
            auth: $
        } = q;
    if (q.headers = H = fO.from(H), q.url = h61(x61(q.baseURL, q.url, q.allowAbsoluteUrls), A.params, A.paramsSerializer), $) H.set("Authorization", "Basic " + btoa(($.username || "") + ":" + ($.password ? unescape(encodeURIComponent($.password)) : "")));
    let O;
    if (i6.isFormData(K)) {
        if (qz.hasStandardBrowserEnv || qz.hasStandardBrowserWebWorkerEnv) H.setContentType(void 0);
        else if ((O = H.getContentType()) !== !1) {
            let [_, ...J] = O ? O.split(";").map((X) => X.trim()).filter(Boolean) : [];
            H.setContentType([_ || "multipart/form-data", ...J].join("; "))
        }
    }
    if (qz.hasStandardBrowserEnv) {
        if (Y && i6.isFunction(Y) && (Y = Y(q)), Y || Y !== !1 && G98(q.url)) {
            let _ = z && w && f98.read(w);
            if (_) H.set(z, _)
        }
    }
    return q
}
// @from(Ln 31121, Col 4)
TI6 = v(() => {
    OC();
    Zw();
    Z98();
    V98();
    Bo1();
    Qo1();
    Qx();
    So1()
})
// @from(Ln 31131, Col 4)
xYK
// @from(Ln 31131, Col 9)
T98
// @from(Ln 31132, Col 4)
v98 = v(() => {
    Zw();
    uo1();
    ho1();
    MT();
    I61();
    OC();
    Qx();
    Fo1();
    TI6();
    xYK = typeof XMLHttpRequest < "u", T98 = xYK && function(A) {
        return new Promise(function(K, Y) {
            let z = go1(A),
                w = z.data,
                H = fO.from(z.headers).normalize(),
                {
                    responseType: $,
                    onUploadProgress: O,
                    onDownloadProgress: _
                } = z,
                J, X, D, j, M;

            function P() {
                j && j(), M && M(), z.cancelToken && z.cancelToken.unsubscribe(J), z.signal && z.signal.removeEventListener("abort", J)
            }
            let W = new XMLHttpRequest;
            W.open(z.method.toUpperCase(), z.url, !0), W.timeout = z.timeout;

            function G() {
                if (!W) return;
                let Z = fO.from("getAllResponseHeaders" in W && W.getAllResponseHeaders()),
                    T = {
                        data: !$ || $ === "text" || $ === "json" ? W.responseText : W.response,
                        status: W.status,
                        statusText: W.statusText,
                        headers: Z,
                        config: A,
                        request: W
                    };
                gx(function(y) {
                    K(y), P()
                }, function(y) {
                    Y(y), P()
                }, T), W = null
            }
            if ("onloadend" in W) W.onloadend = G;
            else W.onreadystatechange = function() {
                if (!W || W.readyState !== 4) return;
                if (W.status === 0 && !(W.responseURL && W.responseURL.indexOf("file:") === 0)) return;
                setTimeout(G)
            };
            if (W.onabort = function() {
                    if (!W) return;
                    Y(new H4("Request aborted", H4.ECONNABORTED, A, W)), W = null
                }, W.onerror = function() {
                    Y(new H4("Network Error", H4.ERR_NETWORK, A, W)), W = null
                }, W.ontimeout = function() {
                    let N = z.timeout ? "timeout of " + z.timeout + "ms exceeded" : "timeout exceeded",
                        T = z.transitional || $w1;
                    if (z.timeoutErrorMessage) N = z.timeoutErrorMessage;
                    Y(new H4(N, T.clarifyTimeoutError ? H4.ETIMEDOUT : H4.ECONNABORTED, A, W)), W = null
                }, w === void 0 && H.setContentType(null), "setRequestHeader" in W) i6.forEach(H.toJSON(), function(N, T) {
                W.setRequestHeader(T, N)
            });
            if (!i6.isUndefined(z.withCredentials)) W.withCredentials = !!z.withCredentials;
            if ($ && $ !== "json") W.responseType = z.responseType;
            if (_)[D, M] = GQ(_, !0), W.addEventListener("progress", D);
            if (O && W.upload)[X, j] = GQ(O), W.upload.addEventListener("progress", X), W.upload.addEventListener("loadend", j);
            if (z.cancelToken || z.signal) {
                if (J = (Z) => {
                        if (!W) return;
                        Y(!Z || Z.type ? new PT(null, A, W) : Z), W.abort(), W = null
                    }, z.cancelToken && z.cancelToken.subscribe(J), z.signal) z.signal.aborted ? J() : z.signal.addEventListener("abort", J)
            }
            let f = WT1(z.url);
            if (f && qz.protocols.indexOf(f) === -1) {
                Y(new H4("Unsupported protocol " + f + ":", H4.ERR_BAD_REQUEST, A));
                return
            }
            W.send(w || null)
        })
    }
})
// @from(Ln 31215, Col 4)
bYK = (A, q) => {
        let {
            length: K
        } = A = A ? A.filter(Boolean) : [];
        if (q || K) {
            let Y = new AbortController,
                z, w = function(_) {
                    if (!z) {
                        z = !0, $();
                        let J = _ instanceof Error ? _ : this.reason;
                        Y.abort(J instanceof H4 ? J : new PT(J instanceof Error ? J.message : J))
                    }
                },
                H = q && setTimeout(() => {
                    H = null, w(new H4(`timeout ${q} of ms exceeded`, H4.ETIMEDOUT))
                }, q),
                $ = () => {
                    if (A) H && clearTimeout(H), H = null, A.forEach((_) => {
                        _.unsubscribe ? _.unsubscribe(w) : _.removeEventListener("abort", w)
                    }), A = null
                };
            A.forEach((_) => _.addEventListener("abort", w));
            let {
                signal: O
            } = Y;
            return O.unsubscribe = () => i6.asap($), O
        }
    }
// @from(Ln 31243, Col 4)
E98
// @from(Ln 31244, Col 4)
k98 = v(() => {
    I61();
    MT();
    Zw();
    E98 = bYK
})
// @from(Ln 31250, Col 4)
uYK = function*(A, q) {
        let K = A.byteLength;
        if (!q || K < q) {
            yield A;
            return
        }
        let Y = 0,
            z;
        while (Y < K) z = Y + q, yield A.slice(Y, z), Y = z
    }
// @from(Ln 31260, Col 4)
BYK = async function*(A, q) {
        for await (let K of mYK(A)) yield* uYK(K, q)
    }
// @from(Ln 31262, Col 7)
mYK = async function*(A) {
        if (A[Symbol.asyncIterator]) {
            yield* A;
            return
        }
        let q = A.getReader();
        try {
            for (;;) {
                let {
                    done: K,
                    value: Y
                } = await q.read();
                if (K) break;
                yield Y
            }
        } finally {
            await q.cancel()
        }
    }
// @from(Ln 31280, Col 7)
vI6 = (A, q, K, Y) => {
        let z = BYK(A, q),
            w = 0,
            H, $ = (O) => {
                if (!H) H = !0, Y && Y(O)
            };
        return new ReadableStream({
            async pull(O) {
                try {
                    let {
                        done: _,
                        value: J
                    } = await z.next();
                    if (_) {
                        $(), O.close();
                        return
                    }
                    let X = J.byteLength;
                    if (K) {
                        let D = w += X;
                        K(D)
                    }
                    O.enqueue(new Uint8Array(J))
                } catch (_) {
                    throw $(_), _
                }
            },
            cancel(O) {
                return $(O), z.return()
            }
        }, {
            highWaterMark: 2
        })
    }
// @from(Ln 31314, Col 4)
po1
// @from(Ln 31314, Col 9)
R98
// @from(Ln 31314, Col 14)
FYK
// @from(Ln 31314, Col 19)
y98 = (A, ...q) => {
        try {
            return !!A(...q)
        } catch (K) {
            return !1
        }
    }
// @from(Ln 31321, Col 4)
QYK
// @from(Ln 31321, Col 9)
L98 = 65536
// @from(Ln 31322, Col 4)
EI6
// @from(Ln 31322, Col 9)
Uo1
// @from(Ln 31322, Col 14)
gYK = async (A) => {
        if (A == null) return 0;
        if (i6.isBlob(A)) return A.size;
        if (i6.isSpecCompliantForm(A)) return (await new Request(qz.origin, {
            method: "POST",
            body: A
        }).arrayBuffer()).byteLength;
        if (i6.isArrayBufferView(A) || i6.isArrayBuffer(A)) return A.byteLength;
        if (i6.isURLSearchParams(A)) A = A + "";
        if (i6.isString(A)) return (await FYK(A)).byteLength
    }
// @from(Ln 31332, Col 7)
UYK = async (A, q) => {
        let K = i6.toFiniteNumber(A.getContentLength());
        return K == null ? gYK(q) : K
    }
// @from(Ln 31335, Col 7)
C98
// @from(Ln 31336, Col 4)
S98 = v(() => {
    OC();
    Zw();
    MT();
    k98();
    Qx();
    Fo1();
    TI6();
    uo1();
    po1 = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function", R98 = po1 && typeof ReadableStream === "function", FYK = po1 && (typeof TextEncoder === "function" ? ((A) => (q) => A.encode(q))(new TextEncoder) : async (A) => new Uint8Array(await new Response(A).arrayBuffer())), QYK = R98 && y98(() => {
        let A = !1,
            q = new Request(qz.origin, {
                body: new ReadableStream,
                method: "POST",
                get duplex() {
                    return A = !0, "half"
                }
            }).headers.has("Content-Type");
        return A && !q
    }), EI6 = R98 && y98(() => i6.isReadableStream(new Response("").body)), Uo1 = {
        stream: EI6 && ((A) => A.body)
    };
    po1 && ((A) => {
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((q) => {
            !Uo1[q] && (Uo1[q] = i6.isFunction(A[q]) ? (K) => K[q]() : (K, Y) => {
                throw new H4(`Response type '${q}' is not supported`, H4.ERR_NOT_SUPPORT, Y)
            })
        })
    })(new Response);
    C98 = po1 && (async (A) => {
        let {
            url: q,
            method: K,
            data: Y,
            signal: z,
            cancelToken: w,
            timeout: H,
            onDownloadProgress: $,
            onUploadProgress: O,
            responseType: _,
            headers: J,
            withCredentials: X = "same-origin",
            fetchOptions: D
        } = go1(A);
        _ = _ ? (_ + "").toLowerCase() : "text";
        let j = E98([z, w && w.toAbortSignal()], H),
            M, P = j && j.unsubscribe && (() => {
                j.unsubscribe()
            }),
            W;
        try {
            if (O && QYK && K !== "get" && K !== "head" && (W = await UYK(J, Y)) !== 0) {
                let T = new Request(q, {
                        method: "POST",
                        body: Y,
                        duplex: "half"
                    }),
                    k;
                if (i6.isFormData(Y) && (k = T.headers.get("content-type"))) J.setContentType(k);
                if (T.body) {
                    let [y, B] = Jw1(W, GQ(Xw1(O)));
                    Y = vI6(T.body, L98, y, B)
                }
            }
            if (!i6.isString(X)) X = X ? "include" : "omit";
            let G = "credentials" in Request.prototype;
            M = new Request(q, {
                ...D,
                signal: j,
                method: K.toUpperCase(),
                headers: J.normalize().toJSON(),
                body: Y,
                duplex: "half",
                credentials: G ? X : void 0
            });
            let f = await fetch(M),
                Z = EI6 && (_ === "stream" || _ === "response");
            if (EI6 && ($ || Z && P)) {
                let T = {};
                ["status", "statusText", "headers"].forEach((S) => {
                    T[S] = f[S]
                });
                let k = i6.toFiniteNumber(f.headers.get("content-length")),
                    [y, B] = $ && Jw1(k, GQ(Xw1($), !0)) || [];
                f = new Response(vI6(f.body, L98, y, () => {
                    B && B(), P && P()
                }), T)
            }
            _ = _ || "text";
            let N = await Uo1[i6.findKey(Uo1, _) || "text"](f, A);
            return !Z && P && P(), await new Promise((T, k) => {
                gx(T, k, {
                    data: N,
                    headers: fO.from(f.headers),
                    status: f.status,
                    statusText: f.statusText,
                    config: A,
                    request: M
                })
            })
        } catch (G) {
            if (P && P(), G && G.name === "TypeError" && /fetch/i.test(G.message)) throw Object.assign(new H4("Network Error", H4.ERR_NETWORK, A, M), {
                cause: G.cause || G
            });
            throw H4.from(G, G && G.code, A, M)
        }
    })
})
// @from(Ln 31444, Col 4)
kI6
// @from(Ln 31444, Col 9)
h98 = (A) => `- ${A}`
// @from(Ln 31445, Col 4)
pYK = (A) => i6.isFunction(A) || A === null || A === !1
// @from(Ln 31446, Col 4)
do1
// @from(Ln 31447, Col 4)
LI6 = v(() => {
    Zw();
    W98();
    v98();
    S98();
    MT();
    kI6 = {
        http: P98,
        xhr: T98,
        fetch: C98
    };
    i6.forEach(kI6, (A, q) => {
        if (A) {
            try {
                Object.defineProperty(A, "name", {
                    value: q
                })
            } catch (K) {}
            Object.defineProperty(A, "adapterName", {
                value: q
            })
        }
    });
    do1 = {
        getAdapter: (A) => {
            A = i6.isArray(A) ? A : [A];
            let {
                length: q
            } = A, K, Y, z = {};
            for (let w = 0; w < q; w++) {
                K = A[w];
                let H;
                if (Y = K, !pYK(K)) {
                    if (Y = kI6[(H = String(K)).toLowerCase()], Y === void 0) throw new H4(`Unknown adapter '${H}'`)
                }
                if (Y) break;
                z[H || "#" + w] = Y
            }
            if (!Y) {
                let w = Object.entries(z).map(([$, O]) => `adapter ${$} ` + (O === !1 ? "is not supported by the environment" : "is not available in the build")),
                    H = q ? w.length > 1 ? `since :
` + w.map(h98).join(`
`) : " " + h98(w[0]) : "as no adapter specified";
                throw new H4("There is no suitable adapter to dispatch the request " + H, "ERR_NOT_SUPPORT")
            }
            return Y
        },
        adapters: kI6
    }
})
// @from(Ln 31498, Col 0)
function RI6(A) {
    if (A.cancelToken) A.cancelToken.throwIfRequested();
    if (A.signal && A.signal.aborted) throw new PT(null, A)
}
// @from(Ln 31503, Col 0)
function co1(A) {
    if (RI6(A), A.headers = fO.from(A.headers), A.data = JT1.call(A, A.transformRequest), ["post", "put", "patch"].indexOf(A.method) !== -1) A.headers.setContentType("application/x-www-form-urlencoded", !1);
    return do1.getAdapter(A.adapter || Ow1.adapter)(A).then(function(Y) {
        return RI6(A), Y.data = JT1.call(A, A.transformResponse, Y), Y.headers = fO.from(Y.headers), Y
    }, function(Y) {
        if (!XT1(Y)) {
            if (RI6(A), Y && Y.response) Y.response.data = JT1.call(A, A.transformResponse, Y.response), Y.response.headers = fO.from(Y.response.headers)
        }
        return Promise.reject(Y)
    })
}
// @from(Ln 31514, Col 4)
I98 = v(() => {
    u58();
    xo1();
    I61();
    Qx();
    LI6()
})
// @from(Ln 31522, Col 0)
function dYK(A, q, K) {
    if (typeof A !== "object") throw new H4("options must be an object", H4.ERR_BAD_OPTION_VALUE);
    let Y = Object.keys(A),
        z = Y.length;
    while (z-- > 0) {
        let w = Y[z],
            H = q[w];
        if (H) {
            let $ = A[w],
                O = $ === void 0 || H($, w, A);
            if (O !== !0) throw new H4("option " + w + " must be " + O, H4.ERR_BAD_OPTION_VALUE);
            continue
        }
        if (K !== !0) throw new H4("Unknown option " + w, H4.ERR_BAD_OPTION)
    }
}
// @from(Ln 31538, Col 4)
lo1
// @from(Ln 31538, Col 9)
x98
// @from(Ln 31538, Col 14)
ZT1
// @from(Ln 31539, Col 4)
b98 = v(() => {
    MT();
    lo1 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((A, q) => {
        lo1[A] = function(Y) {
            return typeof Y === A || "a" + (q < 1 ? "n " : " ") + A
        }
    });
    x98 = {};
    lo1.transitional = function(q, K, Y) {
        function z(w, H) {
            return "[Axios v" + B61 + "] Transitional option '" + w + "'" + H + (Y ? ". " + Y : "")
        }
        return (w, H, $) => {
            if (q === !1) throw new H4(z(H, " has been removed" + (K ? " in " + K : "")), H4.ERR_DEPRECATED);
            if (K && !x98[H]) x98[H] = !0, console.warn(z(H, " has been deprecated since v" + K + " and will be removed in the near future"));
            return q ? q(w, H, $) : !0
        }
    };
    lo1.spelling = function(q) {
        return (K, Y) => {
            return console.warn(`${Y} is likely a misspelling of ${q}`), !0
        }
    };
    ZT1 = {
        assertOptions: dYK,
        validators: lo1
    }
})
// @from(Ln 31568, Col 0)
class fT1 {
    constructor(A) {
        this.defaults = A, this.interceptors = {
            request: new oh6,
            response: new oh6
        }
    }
    async request(A, q) {
        try {
            return await this._request(A, q)
        } catch (K) {
            if (K instanceof Error) {
                let Y = {};
                Error.captureStackTrace ? Error.captureStackTrace(Y) : Y = Error();
                let z = Y.stack ? Y.stack.replace(/^.+\n/, "") : "";
                try {
                    if (!K.stack) K.stack = z;
                    else if (z && !String(K.stack).endsWith(z.replace(/^.+\n.+\n/, ""))) K.stack += `
` + z
                } catch (w) {}
            }
            throw K
        }
    }
    _request(A, q) {
        if (typeof A === "string") q = q || {}, q.url = A;
        else q = A || {};
        q = _C(this.defaults, q);
        let {
            transitional: K,
            paramsSerializer: Y,
            headers: z
        } = q;
        if (K !== void 0) ZT1.assertOptions(K, {
            silentJSONParsing: Ux.transitional(Ux.boolean),
            forcedJSONParsing: Ux.transitional(Ux.boolean),
            clarifyTimeoutError: Ux.transitional(Ux.boolean)
        }, !1);
        if (Y != null)
            if (i6.isFunction(Y)) q.paramsSerializer = {
                serialize: Y
            };
            else ZT1.assertOptions(Y, {
                encode: Ux.function,
                serialize: Ux.function
            }, !0);
        if (q.allowAbsoluteUrls !== void 0);
        else if (this.defaults.allowAbsoluteUrls !== void 0) q.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        else q.allowAbsoluteUrls = !0;
        ZT1.assertOptions(q, {
            baseUrl: Ux.spelling("baseURL"),
            withXsrfToken: Ux.spelling("withXSRFToken")
        }, !0), q.method = (q.method || this.defaults.method || "get").toLowerCase();
        let w = z && i6.merge(z.common, z[q.method]);
        z && i6.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (j) => {
            delete z[j]
        }), q.headers = fO.concat(w, z);
        let H = [],
            $ = !0;
        this.interceptors.request.forEach(function(M) {
            if (typeof M.runWhen === "function" && M.runWhen(q) === !1) return;
            $ = $ && M.synchronous, H.unshift(M.fulfilled, M.rejected)
        });
        let O = [];
        this.interceptors.response.forEach(function(M) {
            O.push(M.fulfilled, M.rejected)
        });
        let _, J = 0,
            X;
        if (!$) {
            let j = [co1.bind(this), void 0];
            j.unshift.apply(j, H), j.push.apply(j, O), X = j.length, _ = Promise.resolve(q);
            while (J < X) _ = _.then(j[J++], j[J++]);
            return _
        }
        X = H.length;
        let D = q;
        J = 0;
        while (J < X) {
            let j = H[J++],
                M = H[J++];
            try {
                D = j(D)
            } catch (P) {
                M.call(this, P);
                break
            }
        }
        try {
            _ = co1.call(this, D)
        } catch (j) {
            return Promise.reject(j)
        }
        J = 0, X = O.length;
        while (J < X) _ = _.then(O[J++], O[J++]);
        return _
    }
    getUri(A) {
        A = _C(this.defaults, A);
        let q = x61(A.baseURL, A.url, A.allowAbsoluteUrls);
        return h61(q, A.params, A.paramsSerializer)
    }
}
// @from(Ln 31671, Col 4)
Ux
// @from(Ln 31671, Col 8)
VT1
// @from(Ln 31672, Col 4)
u98 = v(() => {
    Zw();
    So1();
    v58();
    I98();
    Qo1();
    Bo1();
    b98();
    Qx();
    Ux = ZT1.validators;
    i6.forEach(["delete", "get", "head", "options"], function(q) {
        fT1.prototype[q] = function(K, Y) {
            return this.request(_C(Y || {}, {
                method: q,
                url: K,
                data: (Y || {}).data
            }))
        }
    });
    i6.forEach(["post", "put", "patch"], function(q) {
        function K(Y) {
            return function(w, H, $) {
                return this.request(_C($ || {}, {
                    method: q,
                    headers: Y ? {
                        "Content-Type": "multipart/form-data"
                    } : {},
                    url: w,
                    data: H
                }))
            }
        }
        fT1.prototype[q] = K(), fT1.prototype[q + "Form"] = K(!0)
    });
    VT1 = fT1
})
// @from(Ln 31708, Col 0)
class yI6 {
    constructor(A) {
        if (typeof A !== "function") throw TypeError("executor must be a function.");
        let q;
        this.promise = new Promise(function(z) {
            q = z
        });
        let K = this;
        this.promise.then((Y) => {
            if (!K._listeners) return;
            let z = K._listeners.length;
            while (z-- > 0) K._listeners[z](Y);
            K._listeners = null
        }), this.promise.then = (Y) => {
            let z, w = new Promise((H) => {
                K.subscribe(H), z = H
            }).then(Y);
            return w.cancel = function() {
                K.unsubscribe(z)
            }, w
        }, A(function(z, w, H) {
            if (K.reason) return;
            K.reason = new PT(z, w, H), q(K.reason)
        })
    }
    throwIfRequested() {
        if (this.reason) throw this.reason
    }
    subscribe(A) {
        if (this.reason) {
            A(this.reason);
            return
        }
        if (this._listeners) this._listeners.push(A);
        else this._listeners = [A]
    }
    unsubscribe(A) {
        if (!this._listeners) return;
        let q = this._listeners.indexOf(A);
        if (q !== -1) this._listeners.splice(q, 1)
    }
    toAbortSignal() {
        let A = new AbortController,
            q = (K) => {
                A.abort(K)
            };
        return this.subscribe(q), A.signal.unsubscribe = () => this.unsubscribe(q), A.signal
    }
    static source() {
        let A;
        return {
            token: new yI6(function(Y) {
                A = Y
            }),
            cancel: A
        }
    }
}
// @from(Ln 31766, Col 4)
B98
// @from(Ln 31767, Col 4)
m98 = v(() => {
    I61();
    B98 = yI6
})
// @from(Ln 31772, Col 0)
function CI6(A) {
    return function(K) {
        return A.apply(null, K)
    }
}
// @from(Ln 31778, Col 0)
function SI6(A) {
    return i6.isObject(A) && A.isAxiosError === !0
}
// @from(Ln 31781, Col 4)
F98 = v(() => {
    Zw()
})
// @from(Ln 31784, Col 4)
hI6
// @from(Ln 31784, Col 9)
Q98
// @from(Ln 31785, Col 4)
g98 = v(() => {
    hI6 = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
    };
    Object.entries(hI6).forEach(([A, q]) => {
        hI6[q] = A
    });
    Q98 = hI6
})
// @from(Ln 31857, Col 0)
function U98(A) {
    let q = new VT1(A),
        K = AT1(VT1.prototype.request, q);
    return i6.extend(K, VT1.prototype, q, {
        allOwnKeys: !0
    }), i6.extend(K, q, null, {
        allOwnKeys: !0
    }), K.create = function(z) {
        return U98(_C(A, z))
    }, K
}
// @from(Ln 31868, Col 4)
eJ
// @from(Ln 31868, Col 8)
sA
// @from(Ln 31869, Col 4)
p98 = v(() => {
    Zw();
    u98();
    Qo1();
    xo1();
    qI6();
    I61();
    m98();
    $T1();
    MT();
    F98();
    Qx();
    LI6();
    g98();
    eJ = U98(Ow1);
    eJ.Axios = VT1;
    eJ.CanceledError = PT;
    eJ.CancelToken = B98;
    eJ.isCancel = XT1;
    eJ.VERSION = B61;
    eJ.toFormData = Di;
    eJ.AxiosError = H4;
    eJ.Cancel = eJ.CanceledError;
    eJ.all = function(q) {
        return Promise.all(q)
    };
    eJ.spread = CI6;
    eJ.isAxiosError = SI6;
    eJ.mergeConfig = _C;
    eJ.AxiosHeaders = fO;
    eJ.formToJSON = (A) => Io1(i6.isHTMLForm(A) ? new FormData(A) : A);
    eJ.getAdapter = do1.getAdapter;
    eJ.HttpStatusCode = Q98;
    eJ.default = eJ;
    sA = eJ
})
// @from(Ln 31905, Col 4)
d98 = {}
// @from(Ln 31925, Col 4)
cYK
// @from(Ln 31925, Col 9)
II6
// @from(Ln 31925, Col 14)
lYK
// @from(Ln 31925, Col 19)
iYK
// @from(Ln 31925, Col 24)
nYK
// @from(Ln 31925, Col 29)
rYK
// @from(Ln 31925, Col 34)
oYK
// @from(Ln 31925, Col 39)
aYK
// @from(Ln 31925, Col 44)
sYK
// @from(Ln 31925, Col 49)
tYK
// @from(Ln 31925, Col 54)
eYK
// @from(Ln 31925, Col 59)
AzK
// @from(Ln 31925, Col 64)
qzK
// @from(Ln 31925, Col 69)
KzK
// @from(Ln 31925, Col 74)
YzK
// @from(Ln 31925, Col 79)
zzK
// @from(Ln 31926, Col 4)
y5 = v(() => {
    p98();
    ({
        Axios: cYK,
        AxiosError: II6,
        CanceledError: lYK,
        isCancel: iYK,
        CancelToken: nYK,
        VERSION: rYK,
        all: oYK,
        Cancel: aYK,
        isAxiosError: sYK,
        spread: tYK,
        toFormData: eYK,
        AxiosHeaders: AzK,
        HttpStatusCode: qzK,
        formToJSON: KzK,
        getAdapter: YzK,
        mergeConfig: zzK
    } = sA)
})
// @from(Ln 31954, Col 0)
function ij() {
    if (b1().existsSync(xI6(O8(), ".config.json"))) return xI6(O8(), ".config.json");
    let A = `.claude${w48()}.json`;
    return xI6(process.env.CLAUDE_CONFIG_DIR || wzK(), A)
}
// @from(Ln 31959, Col 0)
async function jw1(A) {
    try {
        return !!await mf(A)
    } catch {
        return !1
    }
}
// @from(Ln 31967, Col 0)
function XzK() {
    if (process.env.CURSOR_TRACE_ID) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor")) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf")) return "windsurf";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("antigravity")) return "antigravity";
    let A = process.env.__CFBundleIdentifier?.toLowerCase();
    if (A?.includes("vscodium")) return "codium";
    if (A?.includes("windsurf")) return "windsurf";
    if (A?.includes("com.google.android.studio")) return "androidstudio";
    if (A) {
        for (let q of bI6)
            if (A.includes(q)) return q
    }
    if (process.env.VisualStudioVersion) return "visualstudio";
    if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
        if (process.platform === "darwin") return "pycharm";
        return "pycharm"
    }
    if (process.env.TERM === "xterm-ghostty") return "ghostty";
    if (process.env.TERM?.includes("kitty")) return "kitty";
    if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM;
    if (process.env.TMUX) return "tmux";
    if (process.env.STY) return "screen";
    if (process.env.KONSOLE_VERSION) return "konsole";
    if (process.env.GNOME_TERMINAL_SERVICE) return "gnome-terminal";
    if (process.env.XTERM_VERSION) return "xterm";
    if (process.env.VTE_VERSION) return "vte-based";
    if (process.env.TERMINATOR_UUID) return "terminator";
    if (process.env.KITTY_WINDOW_ID) return "kitty";
    if (process.env.ALACRITTY_LOG) return "alacritty";
    if (process.env.TILIX_ID) return "tilix";
    if (process.env.WT_SESSION) return "windows-terminal";
    if (process.env.SESSIONNAME && process.env.TERM === "cygwin") return "cygwin";
    if (process.env.MSYSTEM) return process.env.MSYSTEM.toLowerCase();
    if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return "conemu";
    if (process.env.WSL_DISTRO_NAME) return `wsl-${process.env.WSL_DISTRO_NAME}`;
    if (i98()) return "ssh-session";
    if (process.env.TERM) {
        let q = process.env.TERM;
        if (q.includes("alacritty")) return "alacritty";
        if (q.includes("rxvt")) return "rxvt";
        if (q.includes("termite")) return "termite";
        return process.env.TERM
    }
    if (!process.stdout.isTTY) return "non-interactive";
    return null
}
// @from(Ln 32015, Col 0)
function i98() {
    return !!(process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY)
}
// @from(Ln 32018, Col 4)
c98
// @from(Ln 32018, Col 9)
HzK
// @from(Ln 32018, Col 14)
$zK
// @from(Ln 32018, Col 19)
OzK
// @from(Ln 32018, Col 24)
l98
// @from(Ln 32018, Col 29)
_zK
// @from(Ln 32018, Col 34)
JzK = () => {
        return process.env.__CFBundleIdentifier === "com.conductor.app"
    }
// @from(Ln 32021, Col 4)
bI6
// @from(Ln 32021, Col 9)
DzK
// @from(Ln 32021, Col 14)
xA
// @from(Ln 32022, Col 4)
G5 = v(() => {
    zq();
    _8();
    G2();
    hA();
    Uz();
    WQ();
    c98 = o(FS6(), 1);
    HzK = KA(async () => {
        try {
            let A = Aq(),
                q = setTimeout(() => A.abort(), 1000),
                {
                    default: K
                } = await Promise.resolve().then(() => (y5(), d98));
            return await K.head("http://1.1.1.1", {
                signal: A.signal
            }), clearTimeout(q), !0
        } catch {
            return !1
        }
    });
    $zK = KA(async () => {
        let A = [];
        if (await jw1("npm")) A.push("npm");
        if (await jw1("yarn")) A.push("yarn");
        if (await jw1("pnpm")) A.push("pnpm");
        return A
    }), OzK = KA(async () => {
        let A = [];
        if (await jw1("bun")) A.push("bun");
        if (await jw1("deno")) A.push("deno");
        if (await jw1("node")) A.push("node");
        return A
    }), l98 = KA(() => {
        try {
            return b1().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")
        } catch (A) {
            return !1
        }
    }), _zK = KA(() => {
        try {
            if (!l98()) return !1;
            let {
                cmd: A
            } = c98.findActualExecutable("npm", []);
            return A.startsWith("/mnt/c/")
        } catch (A) {
            return !1
        }
    }), bI6 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];
    DzK = KA(() => {
        if (J6(process.env.CODESPACES)) return "codespaces";
        if (process.env.GITPOD_WORKSPACE_ID) return "gitpod";
        if (process.env.REPL_ID || process.env.REPL_SLUG) return "replit";
        if (process.env.PROJECT_DOMAIN) return "glitch";
        if (J6(process.env.VERCEL)) return "vercel";
        if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME) return "railway";
        if (J6(process.env.RENDER)) return "render";
        if (J6(process.env.NETLIFY)) return "netlify";
        if (process.env.DYNO) return "heroku";
        if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID) return "fly.io";
        if (J6(process.env.CF_PAGES)) return "cloudflare-pages";
        if (process.env.DENO_DEPLOYMENT_ID) return "deno-deploy";
        if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws-lambda";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE") return "aws-fargate";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2") return "aws-ecs";
        try {
            if (b1().existsSync("/sys/hypervisor/uuid")) {
                if (b1().readFileSync("/sys/hypervisor/uuid", {
                        encoding: "utf8"
                    }).trim().toLowerCase().startsWith("ec2")) return "aws-ec2"
            }
        } catch {}
        if (process.env.K_SERVICE) return "gcp-cloud-run";
        if (process.env.GOOGLE_CLOUD_PROJECT) return "gcp";
        if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU) return "azure-app-service";
        if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) return "azure-functions";
        if (process.env.APP_URL?.includes("ondigitalocean.app")) return "digitalocean-app-platform";
        if (process.env.SPACE_CREATOR_USER_ID) return "huggingface-spaces";
        if (J6(process.env.GITHUB_ACTIONS)) return "github-actions";
        if (J6(process.env.GITLAB_CI)) return "gitlab-ci";
        if (process.env.CIRCLECI) return "circleci";
        if (process.env.BUILDKITE) return "buildkite";
        if (J6(!1)) return "ci";
        if (process.env.KUBERNETES_SERVICE_HOST) return "kubernetes";
        try {
            if (b1().existsSync("/.dockerenv")) return "docker"
        } catch {}
        if (xA.platform === "darwin") return "unknown-darwin";
        if (xA.platform === "linux") return "unknown-linux";
        if (xA.platform === "win32") return "unknown-win32";
        return "unknown"
    });
    xA = {
        hasInternetAccess: HzK,
        isCI: J6(!1),
        platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
        arch: process.arch,
        nodeVersion: process.version,
        terminal: XzK(),
        isSSH: i98,
        getPackageManagers: $zK,
        getRuntimes: OzK,
        isRunningWithBun: KA(s21),
        isWslEnvironment: l98,
        isNpmFromWindowsPath: _zK,
        isConductor: JzK,
        detectDeploymentEnvironment: DzK
    }
})
// @from(Ln 32134, Col 0)
function io1() {
    return Ex()
}
// @from(Ln 32138, Col 0)
function h6() {
    try {
        return io1()
    } catch {
        return y8()
    }
}
// @from(Ln 32145, Col 4)
N7 = v(() => {
    B6()
})
// @from(Ln 32149, Col 0)
function m61(A) {
    return A.sort((q, K) => {
        let Y = K.modified.getTime() - q.modified.getTime();
        if (Y !== 0) return Y;
        return K.created.getTime() - q.created.getTime()
    })
}
// @from(Ln 32160, Col 0)
function mI6(A, {
    suffix: q = "nodejs"
} = {}) {
    if (typeof A !== "string") throw TypeError(`Expected a string, got ${typeof A}`);
    if (q) A += `-${q}`;
    if (uI6.platform === "darwin") return jzK(A);
    if (uI6.platform === "win32") return MzK(A);
    return PzK(A)
}
// @from(Ln 32169, Col 4)
Pi
// @from(Ln 32169, Col 8)
BI6
// @from(Ln 32169, Col 13)
Mw1
// @from(Ln 32169, Col 18)
jzK = (A) => {
        let q = VO.join(Pi, "Library");
        return {
            data: VO.join(q, "Application Support", A),
            config: VO.join(q, "Preferences", A),
            cache: VO.join(q, "Caches", A),
            log: VO.join(q, "Logs", A),
            temp: VO.join(BI6, A)
        }
    }
// @from(Ln 32179, Col 4)
MzK = (A) => {
        let q = Mw1.APPDATA || VO.join(Pi, "AppData", "Roaming"),
            K = Mw1.LOCALAPPDATA || VO.join(Pi, "AppData", "Local");
        return {
            data: VO.join(K, A, "Data"),
            config: VO.join(q, A, "Config"),
            cache: VO.join(K, A, "Cache"),
            log: VO.join(K, A, "Log"),
            temp: VO.join(BI6, A)
        }
    }
// @from(Ln 32190, Col 4)
PzK = (A) => {
        let q = VO.basename(Pi);
        return {
            data: VO.join(Mw1.XDG_DATA_HOME || VO.join(Pi, ".local", "share"), A),
            config: VO.join(Mw1.XDG_CONFIG_HOME || VO.join(Pi, ".config"), A),
            cache: VO.join(Mw1.XDG_CACHE_HOME || VO.join(Pi, ".cache"), A),
            log: VO.join(Mw1.XDG_STATE_HOME || VO.join(Pi, ".local", "state"), A),
            temp: VO.join(BI6, q, A)
        }
    }
// @from(Ln 32200, Col 4)
r98 = v(() => {
    Pi = n98.homedir(), BI6 = n98.tmpdir(), {
        env: Mw1
    } = uI6
})
// @from(Ln 32209, Col 0)
function o98(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Ln 32213, Col 0)
function oo1(A) {
    return o98(A)
}
// @from(Ln 32216, Col 4)
ro1
// @from(Ln 32216, Col 9)
Wi
// @from(Ln 32217, Col 4)
NT1 = v(() => {
    r98();
    _8();
    ro1 = mI6("claude-cli");
    Wi = {
        baseLogs: () => no1(ro1.cache, oo1(b1().cwd())),
        errors: () => no1(ro1.cache, oo1(b1().cwd()), "errors"),
        messages: () => no1(ro1.cache, oo1(b1().cwd()), "messages"),
        mcpLogs: (A) => no1(ro1.cache, oo1(b1().cwd()), `mcp-logs-${o98(A)}`)
    }
})
// @from(Ln 32228, Col 4)
SG = "command-name"
// @from(Ln 32229, Col 4)
pP = "command-message"
// @from(Ln 32230, Col 4)
a98 = "bash-stdout"
// @from(Ln 32231, Col 4)
s98 = "bash-stderr"
// @from(Ln 32232, Col 4)
Pw1 = "local-command-stdout"
// @from(Ln 32233, Col 4)
ao1 = "local-command-stderr"
// @from(Ln 32234, Col 4)
FI6 = "local-command-caveat"
// @from(Ln 32235, Col 4)
JC = "tick"
// @from(Ln 32236, Col 4)
NO = "task-notification"
// @from(Ln 32237, Col 4)
dP = "task-id"
// @from(Ln 32238, Col 4)
so1 = "task-type"
// @from(Ln 32239, Col 4)
WT = "output-file"
// @from(Ln 32240, Col 4)
ND = "status"
// @from(Ln 32241, Col 4)
TD = "summary"
// @from(Ln 32242, Col 4)
qJ = "teammate-message"
// @from(Ln 32243, Col 4)
Ww1
// @from(Ln 32243, Col 9)
Gw1
// @from(Ln 32244, Col 4)
vz = v(() => {
    Ww1 = ["help", "-h", "--help"], Gw1 = ["list", "show", "display", "current", "view", "get", "check", "describe", "print", "version", "about", "status", "?"]
})
// @from(Ln 32248, Col 0)
function to1(A) {
    return A.replace(GzK, "").trim() || A
}
// @from(Ln 32251, Col 4)
WzK
// @from(Ln 32251, Col 9)
GzK
// @from(Ln 32252, Col 4)
QI6 = v(() => {
    WzK = ["ide_opened_file", "ide_selection"], GzK = new RegExp(WzK.map((A) => `<${A}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${A}>\\n?`).join("|"), "g")
})
// @from(Ln 32256, Col 0)
function Gi(A, q) {
    let K = A.firstPrompt?.startsWith(`<${JC}>`),
        Y = A.firstPrompt && A.firstPrompt !== "" && !K,
        z = A.agentName || A.customTitle || A.summary || (Y ? A.firstPrompt : void 0) || q || (K ? "Autonomous session" : void 0) || (A.sessionId ? A.sessionId.slice(0, 8) : "") || "";
    return to1(z).trim()
}
// @from(Ln 32263, Col 0)
function t98(A) {
    return A.toISOString().replace(/[:.]/g, "-")
}
// @from(Ln 32267, Col 0)
function fzK(A) {
    if (eo1.length >= ZzK) eo1.shift();
    eo1.push(A)
}
// @from(Ln 32272, Col 0)
function e98(A) {
    if (XC !== null) throw Error("Error log sink already attached - cannot attach more than once");
    if (XC = A, Zw1.length > 0) {
        let q = [...Zw1];
        Zw1.length = 0;
        for (let K of q) switch (K.type) {
            case "error":
                XC.logError(K.error);
                break;
            case "mcpError":
                XC.logMCPError(K.serverName, K.error);
                break;
            case "mcpDebug":
                XC.logMCPDebug(K.serverName, K.message);
                break
        }
    }
}
// @from(Ln 32291, Col 0)
function K1(A) {
    try {
        if (J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_ERROR_REPORTING || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
        let K = {
            error: A.stack || A.message,
            timestamp: new Date().toISOString()
        };
        if (fzK(K), XC === null) {
            Zw1.push({
                type: "error",
                error: A
            });
            return
        }
        XC.logError(A)
    } catch {}
}
// @from(Ln 32309, Col 0)
function fw1() {
    return [...eo1]
}
// @from(Ln 32313, Col 0)
function Kz(A, q) {
    try {
        if (XC === null) {
            Zw1.push({
                type: "mcpError",
                serverName: A,
                error: q
            });
            return
        }
        XC.logMCPError(A, q)
    } catch {}
}
// @from(Ln 32327, Col 0)
function SA(A, q) {
    try {
        if (XC === null) {
            Zw1.push({
                type: "mcpDebug",
                serverName: A,
                message: q
            });
            return
        }
        XC.logMCPDebug(A, q)
    } catch {}
}
// @from(Ln 32341, Col 0)
function Aa1(A, q) {
    if (!q || q !== "repl_main_thread") return;
    let K = nlA(A);
    UL6(K)
}
// @from(Ln 32346, Col 4)
ZzK = 100
// @from(Ln 32347, Col 4)
eo1
// @from(Ln 32347, Col 9)
Zw1
// @from(Ln 32347, Col 14)
XC = null
// @from(Ln 32348, Col 4)
qlz
// @from(Ln 32349, Col 4)
y6 = v(() => {
    B6();
    NT1();
    _8();
    zq();
    hA();
    m6();
    vz();
    QI6();
    eo1 = [];
    Zw1 = [];
    qlz = KA(() => {
        return process.argv.includes("--hard-fail")
    })
})
// @from(Ln 32365, Col 0)
function vT1(A, q = !1) {
    let K = A.length,
        Y = 0,
        z = "",
        w = 0,
        H = 16,
        $ = 0,
        O = 0,
        _ = 0,
        J = 0,
        X = 0;

    function D(Z, N) {
        let T = 0,
            k = 0;
        while (T < Z || !N) {
            let y = A.charCodeAt(Y);
            if (y >= 48 && y <= 57) k = k * 16 + y - 48;
            else if (y >= 65 && y <= 70) k = k * 16 + y - 65 + 10;
            else if (y >= 97 && y <= 102) k = k * 16 + y - 97 + 10;
            else break;
            Y++, T++
        }
        if (T < Z) k = -1;
        return k
    }

    function j(Z) {
        Y = Z, z = "", w = 0, H = 16, X = 0
    }

    function M() {
        let Z = Y;
        if (A.charCodeAt(Y) === 48) Y++;
        else {
            Y++;
            while (Y < A.length && Vw1(A.charCodeAt(Y))) Y++
        }
        if (Y < A.length && A.charCodeAt(Y) === 46)
            if (Y++, Y < A.length && Vw1(A.charCodeAt(Y))) {
                Y++;
                while (Y < A.length && Vw1(A.charCodeAt(Y))) Y++
            } else return X = 3, A.substring(Z, Y);
        let N = Y;
        if (Y < A.length && (A.charCodeAt(Y) === 69 || A.charCodeAt(Y) === 101)) {
            if (Y++, Y < A.length && A.charCodeAt(Y) === 43 || A.charCodeAt(Y) === 45) Y++;
            if (Y < A.length && Vw1(A.charCodeAt(Y))) {
                Y++;
                while (Y < A.length && Vw1(A.charCodeAt(Y))) Y++;
                N = Y
            } else X = 3
        }
        return A.substring(Z, N)
    }

    function P() {
        let Z = "",
            N = Y;
        while (!0) {
            if (Y >= K) {
                Z += A.substring(N, Y), X = 2;
                break
            }
            let T = A.charCodeAt(Y);
            if (T === 34) {
                Z += A.substring(N, Y), Y++;
                break
            }
            if (T === 92) {
                if (Z += A.substring(N, Y), Y++, Y >= K) {
                    X = 2;
                    break
                }
                switch (A.charCodeAt(Y++)) {
                    case 34:
                        Z += '"';
                        break;
                    case 92:
                        Z += "\\";
                        break;
                    case 47:
                        Z += "/";
                        break;
                    case 98:
                        Z += "\b";
                        break;
                    case 102:
                        Z += "\f";
                        break;
                    case 110:
                        Z += `
`;
                        break;
                    case 114:
                        Z += "\r";
                        break;
                    case 116:
                        Z += "\t";
                        break;
                    case 117:
                        let y = D(4, !0);
                        if (y >= 0) Z += String.fromCharCode(y);
                        else X = 4;
                        break;
                    default:
                        X = 5
                }
                N = Y;
                continue
            }
            if (T >= 0 && T <= 31)
                if (TT1(T)) {
                    Z += A.substring(N, Y), X = 2;
                    break
                } else X = 6;
            Y++
        }
        return Z
    }

    function W() {
        if (z = "", X = 0, w = Y, O = $, J = _, Y >= K) return w = K, H = 17;
        let Z = A.charCodeAt(Y);
        if (gI6(Z)) {
            do Y++, z += String.fromCharCode(Z), Z = A.charCodeAt(Y); while (gI6(Z));
            return H = 15
        }
        if (TT1(Z)) {
            if (Y++, z += String.fromCharCode(Z), Z === 13 && A.charCodeAt(Y) === 10) Y++, z += `
`;
            return $++, _ = Y, H = 14
        }
        switch (Z) {
            case 123:
                return Y++, H = 1;
            case 125:
                return Y++, H = 2;
            case 91:
                return Y++, H = 3;
            case 93:
                return Y++, H = 4;
            case 58:
                return Y++, H = 6;
            case 44:
                return Y++, H = 5;
            case 34:
                return Y++, z = P(), H = 10;
            case 47:
                let N = Y - 1;
                if (A.charCodeAt(Y + 1) === 47) {
                    Y += 2;
                    while (Y < K) {
                        if (TT1(A.charCodeAt(Y))) break;
                        Y++
                    }
                    return z = A.substring(N, Y), H = 12
                }
                if (A.charCodeAt(Y + 1) === 42) {
                    Y += 2;
                    let T = K - 1,
                        k = !1;
                    while (Y < T) {
                        let y = A.charCodeAt(Y);
                        if (y === 42 && A.charCodeAt(Y + 1) === 47) {
                            Y += 2, k = !0;
                            break
                        }
                        if (Y++, TT1(y)) {
                            if (y === 13 && A.charCodeAt(Y) === 10) Y++;
                            $++, _ = Y
                        }
                    }
                    if (!k) Y++, X = 1;
                    return z = A.substring(N, Y), H = 13
                }
                return z += String.fromCharCode(Z), Y++, H = 16;
            case 45:
                if (z += String.fromCharCode(Z), Y++, Y === K || !Vw1(A.charCodeAt(Y))) return H = 16;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                return z += M(), H = 11;
            default:
                while (Y < K && G(Z)) Y++, Z = A.charCodeAt(Y);
                if (w !== Y) {
                    switch (z = A.substring(w, Y), z) {
                        case "true":
                            return H = 8;
                        case "false":
                            return H = 9;
                        case "null":
                            return H = 7
                    }
                    return H = 16
                }
                return z += String.fromCharCode(Z), Y++, H = 16
        }
    }

    function G(Z) {
        if (gI6(Z) || TT1(Z)) return !1;
        switch (Z) {
            case 125:
            case 93:
            case 123:
            case 91:
            case 34:
            case 58:
            case 44:
            case 47:
                return !1
        }
        return !0
    }

    function f() {
        let Z;
        do Z = W(); while (Z >= 12 && Z <= 15);
        return Z
    }
    return {
        setPosition: j,
        getPosition: () => Y,
        scan: q ? f : W,
        getToken: () => H,
        getTokenValue: () => z,
        getTokenOffset: () => w,
        getTokenLength: () => Y - w,
        getTokenStartLine: () => O,
        getTokenStartCharacter: () => w - J,
        getTokenError: () => X
    }
}
// @from(Ln 32606, Col 0)
function gI6(A) {
    return A === 32 || A === 9
}
// @from(Ln 32610, Col 0)
function TT1(A) {
    return A === 10 || A === 13
}
// @from(Ln 32614, Col 0)
function Vw1(A) {
    return A >= 48 && A <= 57
}
// @from(Ln 32617, Col 4)
AY8
// @from(Ln 32618, Col 4)
qa1 = v(() => {
    (function(A) {
        A[A.lineFeed = 10] = "lineFeed", A[A.carriageReturn = 13] = "carriageReturn", A[A.space = 32] = "space", A[A._0 = 48] = "_0", A[A._1 = 49] = "_1", A[A._2 = 50] = "_2", A[A._3 = 51] = "_3", A[A._4 = 52] = "_4", A[A._5 = 53] = "_5", A[A._6 = 54] = "_6", A[A._7 = 55] = "_7", A[A._8 = 56] = "_8", A[A._9 = 57] = "_9", A[A.a = 97] = "a", A[A.b = 98] = "b", A[A.c = 99] = "c", A[A.d = 100] = "d", A[A.e = 101] = "e", A[A.f = 102] = "f", A[A.g = 103] = "g", A[A.h = 104] = "h", A[A.i = 105] = "i", A[A.j = 106] = "j", A[A.k = 107] = "k", A[A.l = 108] = "l", A[A.m = 109] = "m", A[A.n = 110] = "n", A[A.o = 111] = "o", A[A.p = 112] = "p", A[A.q = 113] = "q", A[A.r = 114] = "r", A[A.s = 115] = "s", A[A.t = 116] = "t", A[A.u = 117] = "u", A[A.v = 118] = "v", A[A.w = 119] = "w", A[A.x = 120] = "x", A[A.y = 121] = "y", A[A.z = 122] = "z", A[A.A = 65] = "A", A[A.B = 66] = "B", A[A.C = 67] = "C", A[A.D = 68] = "D", A[A.E = 69] = "E", A[A.F = 70] = "F", A[A.G = 71] = "G", A[A.H = 72] = "H", A[A.I = 73] = "I", A[A.J = 74] = "J", A[A.K = 75] = "K", A[A.L = 76] = "L", A[A.M = 77] = "M", A[A.N = 78] = "N", A[A.O = 79] = "O", A[A.P = 80] = "P", A[A.Q = 81] = "Q", A[A.R = 82] = "R", A[A.S = 83] = "S", A[A.T = 84] = "T", A[A.U = 85] = "U", A[A.V = 86] = "V", A[A.W = 87] = "W", A[A.X = 88] = "X", A[A.Y = 89] = "Y", A[A.Z = 90] = "Z", A[A.asterisk = 42] = "asterisk", A[A.backslash = 92] = "backslash", A[A.closeBrace = 125] = "closeBrace", A[A.closeBracket = 93] = "closeBracket", A[A.colon = 58] = "colon", A[A.comma = 44] = "comma", A[A.dot = 46] = "dot", A[A.doubleQuote = 34] = "doubleQuote", A[A.minus = 45] = "minus", A[A.openBrace = 123] = "openBrace", A[A.openBracket = 91] = "openBracket", A[A.plus = 43] = "plus", A[A.slash = 47] = "slash", A[A.formFeed = 12] = "formFeed", A[A.tab = 9] = "tab"
    })(AY8 || (AY8 = {}))
})
// @from(Ln 32623, Col 4)
GT
// @from(Ln 32623, Col 8)
UI6
// @from(Ln 32623, Col 13)
qY8
// @from(Ln 32624, Col 4)
KY8 = v(() => {
    GT = Array(20).fill(0).map((A, q) => {
        return " ".repeat(q)
    }), UI6 = {
        " ": {
            "\n": Array(200).fill(0).map((A, q) => {
                return `
` + " ".repeat(q)
            }),
            "\r": Array(200).fill(0).map((A, q) => {
                return "\r" + " ".repeat(q)
            }),
            "\r\n": Array(200).fill(0).map((A, q) => {
                return `\r
` + " ".repeat(q)
            })
        },
        "\t": {
            "\n": Array(200).fill(0).map((A, q) => {
                return `
` + "\t".repeat(q)
            }),
            "\r": Array(200).fill(0).map((A, q) => {
                return "\r" + "\t".repeat(q)
            }),
            "\r\n": Array(200).fill(0).map((A, q) => {
                return `\r
` + "\t".repeat(q)
            })
        }
    }, qY8 = [`
`, "\r", `\r
`]
})
// @from(Ln 32659, Col 0)
function pI6(A, q, K) {
    let Y, z, w, H, $;
    if (q) {
        H = q.offset, $ = H + q.length, w = H;
        while (w > 0 && !ET1(A, w - 1)) w--;
        let T = $;
        while (T < A.length && !ET1(A, T)) T++;
        z = A.substring(w, T), Y = NzK(z, K)
    } else z = A, Y = 0, w = 0, H = 0, $ = A.length;
    let O = TzK(K, A),
        _ = qY8.includes(O),
        J = 0,
        X = 0,
        D;
    if (K.insertSpaces) D = GT[K.tabSize || 4] ?? Nw1(GT[1], K.tabSize || 4);
    else D = "\t";
    let j = D === "\t" ? "\t" : " ",
        M = vT1(z, !1),
        P = !1;

    function W() {
        if (J > 1) return Nw1(O, J) + Nw1(D, Y + X);
        let T = D.length * (Y + X);
        if (!_ || T > UI6[j][O].length) return O + Nw1(D, Y + X);
        if (T <= 0) return O;
        return UI6[j][O][T]
    }

    function G() {
        let T = M.scan();
        J = 0;
        while (T === 15 || T === 14) {
            if (T === 14 && K.keepLines) J += 1;
            else if (T === 14) J = 1;
            T = M.scan()
        }
        return P = T === 16 || M.getTokenError() !== 0, T
    }
    let f = [];

    function Z(T, k, y) {
        if (!P && (!q || k < $ && y > H) && A.substring(k, y) !== T) f.push({
            offset: k,
            length: y - k,
            content: T
        })
    }
    let N = G();
    if (K.keepLines && J > 0) Z(Nw1(O, J), 0, 0);
    if (N !== 17) {
        let T = M.getTokenOffset() + w,
            k = D.length * Y < 20 && K.insertSpaces ? GT[D.length * Y] : Nw1(D, Y);
        Z(k, w, T)
    }
    while (N !== 17) {
        let T = M.getTokenOffset() + M.getTokenLength() + w,
            k = G(),
            y = "",
            B = !1;
        while (J === 0 && (k === 12 || k === 13)) {
            let m = M.getTokenOffset() + w;
            Z(GT[1], T, m), T = M.getTokenOffset() + M.getTokenLength() + w, B = k === 12, y = B ? W() : "", k = G()
        }
        if (k === 2) {
            if (N !== 1) X--;
            if (K.keepLines && J > 0 || !K.keepLines && N !== 1) y = W();
            else if (K.keepLines) y = GT[1]
        } else if (k === 4) {
            if (N !== 3) X--;
            if (K.keepLines && J > 0 || !K.keepLines && N !== 3) y = W();
            else if (K.keepLines) y = GT[1]
        } else {
            switch (N) {
                case 3:
                case 1:
                    if (X++, K.keepLines && J > 0 || !K.keepLines) y = W();
                    else y = GT[1];
                    break;
                case 5:
                    if (K.keepLines && J > 0 || !K.keepLines) y = W();
                    else y = GT[1];
                    break;
                case 12:
                    y = W();
                    break;
                case 13:
                    if (J > 0) y = W();
                    else if (!B) y = GT[1];
                    break;
                case 6:
                    if (K.keepLines && J > 0) y = W();
                    else if (!B) y = GT[1];
                    break;
                case 10:
                    if (K.keepLines && J > 0) y = W();
                    else if (k === 6 && !B) y = "";
                    break;
                case 7:
                case 8:
                case 9:
                case 11:
                case 2:
                case 4:
                    if (K.keepLines && J > 0) y = W();
                    else if ((k === 12 || k === 13) && !B) y = GT[1];
                    else if (k !== 5 && k !== 17) P = !0;
                    break;
                case 16:
                    P = !0;
                    break
            }
            if (J > 0 && (k === 12 || k === 13)) y = W()
        }
        if (k === 17)
            if (K.keepLines && J > 0) y = W();
            else y = K.insertFinalNewline ? O : "";
        let S = M.getTokenOffset() + w;
        Z(y, T, S), N = k
    }
    return f
}
// @from(Ln 32781, Col 0)
function Nw1(A, q) {
    let K = "";
    for (let Y = 0; Y < q; Y++) K += A;
    return K
}
// @from(Ln 32787, Col 0)
function NzK(A, q) {
    let K = 0,
        Y = 0,
        z = q.tabSize || 4;
    while (K < A.length) {
        let w = A.charAt(K);
        if (w === GT[1]) Y++;
        else if (w === "\t") Y += z;
        else break;
        K++
    }
    return Math.floor(Y / z)
}
// @from(Ln 32801, Col 0)
function TzK(A, q) {
    for (let K = 0; K < q.length; K++) {
        let Y = q.charAt(K);
        if (Y === "\r") {
            if (K + 1 < q.length && q.charAt(K + 1) === `
`) return `\r
`;
            return "\r"
        } else if (Y === `
`) return `
`
    }
    return A && A.eol || `
`
}
// @from(Ln 32817, Col 0)
function ET1(A, q) {
    return `\r
`.indexOf(A.charAt(q)) !== -1
}
// @from(Ln 32821, Col 4)
dI6 = v(() => {
    qa1();
    KY8()
})
// @from(Ln 32826, Col 0)
function YY8(A, q = [], K = kT1.DEFAULT) {
    let Y = null,
        z = [],
        w = [];

    function H(O) {
        if (Array.isArray(z)) z.push(O);
        else if (Y !== null) z[Y] = O
    }
    return lI6(A, {
        onObjectBegin: () => {
            let O = {};
            H(O), w.push(z), z = O, Y = null
        },
        onObjectProperty: (O) => {
            Y = O
        },
        onObjectEnd: () => {
            z = w.pop()
        },
        onArrayBegin: () => {
            let O = [];
            H(O), w.push(z), z = O, Y = null
        },
        onArrayEnd: () => {
            z = w.pop()
        },
        onLiteralValue: H,
        onError: (O, _, J) => {
            q.push({
                error: O,
                offset: _,
                length: J
            })
        }
    }, K), z[0]
}
// @from(Ln 32864, Col 0)
function cI6(A, q = [], K = kT1.DEFAULT) {
    let Y = {
        type: "array",
        offset: -1,
        length: -1,
        children: [],
        parent: void 0
    };

    function z(O) {
        if (Y.type === "property") Y.length = O - Y.offset, Y = Y.parent
    }

    function w(O) {
        return Y.children.push(O), O
    }
    lI6(A, {
        onObjectBegin: (O) => {
            Y = w({
                type: "object",
                offset: O,
                length: -1,
                parent: Y,
                children: []
            })
        },
        onObjectProperty: (O, _, J) => {
            Y = w({
                type: "property",
                offset: _,
                length: -1,
                parent: Y,
                children: []
            }), Y.children.push({
                type: "string",
                value: O,
                offset: _,
                length: J,
                parent: Y
            })
        },
        onObjectEnd: (O, _) => {
            z(O + _), Y.length = O + _ - Y.offset, Y = Y.parent, z(O + _)
        },
        onArrayBegin: (O, _) => {
            Y = w({
                type: "array",
                offset: O,
                length: -1,
                parent: Y,
                children: []
            })
        },
        onArrayEnd: (O, _) => {
            Y.length = O + _ - Y.offset, Y = Y.parent, z(O + _)
        },
        onLiteralValue: (O, _, J) => {
            w({
                type: EzK(O),
                offset: _,
                length: J,
                parent: Y,
                value: O
            }), z(_ + J)
        },
        onSeparator: (O, _, J) => {
            if (Y.type === "property") {
                if (O === ":") Y.colonOffset = _;
                else if (O === ",") z(_)
            }
        },
        onError: (O, _, J) => {
            q.push({
                error: O,
                offset: _,
                length: J
            })
        }
    }, K);
    let $ = Y.children[0];
    if ($) delete $.parent;
    return $
}
// @from(Ln 32948, Col 0)
function Ka1(A, q) {
    if (!A) return;
    let K = A;
    for (let Y of q)
        if (typeof Y === "string") {
            if (K.type !== "object" || !Array.isArray(K.children)) return;
            let z = !1;
            for (let w of K.children)
                if (Array.isArray(w.children) && w.children[0].value === Y && w.children.length === 2) {
                    K = w.children[1], z = !0;
                    break
                } if (!z) return
        } else {
            let z = Y;
            if (K.type !== "array" || z < 0 || !Array.isArray(K.children) || z >= K.children.length) return;
            K = K.children[z]
        } return K
}
// @from(Ln 32967, Col 0)
function lI6(A, q, K = kT1.DEFAULT) {
    let Y = vT1(A, !1),
        z = [];

    function w(g) {
        return g ? () => g(Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter()) : () => !0
    }

    function H(g) {
        return g ? () => g(Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter(), () => z.slice()) : () => !0
    }

    function $(g) {
        return g ? (U) => g(U, Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter()) : () => !0
    }

    function O(g) {
        return g ? (U) => g(U, Y.getTokenOffset(), Y.getTokenLength(), Y.getTokenStartLine(), Y.getTokenStartCharacter(), () => z.slice()) : () => !0
    }
    let _ = H(q.onObjectBegin),
        J = O(q.onObjectProperty),
        X = w(q.onObjectEnd),
        D = H(q.onArrayBegin),
        j = w(q.onArrayEnd),
        M = O(q.onLiteralValue),
        P = $(q.onSeparator),
        W = w(q.onComment),
        G = $(q.onError),
        f = K && K.disallowComments,
        Z = K && K.allowTrailingComma;

    function N() {
        while (!0) {
            let g = Y.scan();
            switch (Y.getTokenError()) {
                case 4:
                    T(14);
                    break;
                case 5:
                    T(15);
                    break;
                case 3:
                    T(13);
                    break;
                case 1:
                    if (!f) T(11);
                    break;
                case 2:
                    T(12);
                    break;
                case 6:
                    T(16);
                    break
            }
            switch (g) {
                case 12:
                case 13:
                    if (f) T(10);
                    else W();
                    break;
                case 16:
                    T(1);
                    break;
                case 15:
                case 14:
                    break;
                default:
                    return g
            }
        }
    }

    function T(g, U = [], x = []) {
        if (G(g), U.length + x.length > 0) {
            let p = Y.getToken();
            while (p !== 17) {
                if (U.indexOf(p) !== -1) {
                    N();
                    break
                } else if (x.indexOf(p) !== -1) break;
                p = N()
            }
        }
    }

    function k(g) {
        let U = Y.getTokenValue();
        if (g) M(U);
        else J(U), z.push(U);
        return N(), !0
    }

    function y() {
        switch (Y.getToken()) {
            case 11:
                let g = Y.getTokenValue(),
                    U = Number(g);
                if (isNaN(U)) T(2), U = 0;
                M(U);
                break;
            case 7:
                M(null);
                break;
            case 8:
                M(!0);
                break;
            case 9:
                M(!1);
                break;
            default:
                return !1
        }
        return N(), !0
    }

    function B() {
        if (Y.getToken() !== 10) return T(3, [], [2, 5]), !1;
        if (k(!1), Y.getToken() === 6) {
            if (P(":"), N(), !b()) T(4, [], [2, 5])
        } else T(5, [], [2, 5]);
        return z.pop(), !0
    }

    function S() {
        _(), N();
        let g = !1;
        while (Y.getToken() !== 2 && Y.getToken() !== 17) {
            if (Y.getToken() === 5) {
                if (!g) T(4, [], []);
                if (P(","), N(), Y.getToken() === 2 && Z) break
            } else if (g) T(6, [], []);
            if (!B()) T(4, [], [2, 5]);
            g = !0
        }
        if (X(), Y.getToken() !== 2) T(7, [2], []);
        else N();
        return !0
    }

    function m() {
        D(), N();
        let g = !0,
            U = !1;
        while (Y.getToken() !== 4 && Y.getToken() !== 17) {
            if (Y.getToken() === 5) {
                if (!U) T(4, [], []);
                if (P(","), N(), Y.getToken() === 4 && Z) break
            } else if (U) T(6, [], []);
            if (g) z.push(0), g = !1;
            else z[z.length - 1]++;
            if (!b()) T(4, [], [4, 5]);
            U = !0
        }
        if (j(), !g) z.pop();
        if (Y.getToken() !== 4) T(8, [4], []);
        else N();
        return !0
    }

    function b() {
        switch (Y.getToken()) {
            case 3:
                return m();
            case 1:
                return S();
            case 10:
                return k(!0);
            default:
                return y()
        }
    }
    if (N(), Y.getToken() === 17) {
        if (K.allowEmptyContent) return !0;
        return T(4, [], []), !1
    }
    if (!b()) return T(4, [], []), !1;
    if (Y.getToken() !== 17) T(9, [], []);
    return !0
}
// @from(Ln 33147, Col 0)
function EzK(A) {
    switch (typeof A) {
        case "boolean":
            return "boolean";
        case "number":
            return "number";
        case "string":
            return "string";
        case "object": {
            if (!A) return "null";
            else if (Array.isArray(A)) return "array";
            return "object"
        }
        default:
            return "null"
    }
}
// @from(Ln 33164, Col 4)
kT1
// @from(Ln 33165, Col 4)
iI6 = v(() => {
    qa1();
    (function(A) {
        A.DEFAULT = {
            allowTrailingComma: !1
        }
    })(kT1 || (kT1 = {}))
})
// @from(Ln 33174, Col 0)
function zY8(A, q, K, Y) {
    let z = q.slice(),
        H = cI6(A, []),
        $ = void 0,
        O = void 0;
    while (z.length > 0)
        if (O = z.pop(), $ = Ka1(H, z), $ === void 0 && K !== void 0)
            if (typeof O === "string") K = {
                [O]: K
            };
            else K = [K];
    else break;
    if (!$) {
        if (K === void 0) throw Error("Can not delete in empty document");
        return F61(A, {
            offset: H ? H.offset : 0,
            length: H ? H.length : 0,
            content: JSON.stringify(K)
        }, Y)
    } else if ($.type === "object" && typeof O === "string" && Array.isArray($.children)) {
        let _ = Ka1($, [O]);
        if (_ !== void 0)
            if (K === void 0) {
                if (!_.parent) throw Error("Malformed AST");
                let J = $.children.indexOf(_.parent),
                    X, D = _.parent.offset + _.parent.length;
                if (J > 0) {
                    let j = $.children[J - 1];
                    X = j.offset + j.length
                } else if (X = $.offset + 1, $.children.length > 1) D = $.children[1].offset;
                return F61(A, {
                    offset: X,
                    length: D - X,
                    content: ""
                }, Y)
            } else return F61(A, {
                offset: _.offset,
                length: _.length,
                content: JSON.stringify(K)
            }, Y);
        else {
            if (K === void 0) return [];
            let J = `${JSON.stringify(O)}: ${JSON.stringify(K)}`,
                X = Y.getInsertionIndex ? Y.getInsertionIndex($.children.map((j) => j.children[0].value)) : $.children.length,
                D;
            if (X > 0) {
                let j = $.children[X - 1];
                D = {
                    offset: j.offset + j.length,
                    length: 0,
                    content: "," + J
                }
            } else if ($.children.length === 0) D = {
                offset: $.offset + 1,
                length: 0,
                content: J
            };
            else D = {
                offset: $.offset + 1,
                length: 0,
                content: J + ","
            };
            return F61(A, D, Y)
        }
    } else if ($.type === "array" && typeof O === "number" && Array.isArray($.children)) {
        let _ = O;
        if (_ === -1) {
            let J = `${JSON.stringify(K)}`,
                X;
            if ($.children.length === 0) X = {
                offset: $.offset + 1,
                length: 0,
                content: J
            };
            else {
                let D = $.children[$.children.length - 1];
                X = {
                    offset: D.offset + D.length,
                    length: 0,
                    content: "," + J
                }
            }
            return F61(A, X, Y)
        } else if (K === void 0 && $.children.length >= 0) {
            let J = O,
                X = $.children[J],
                D;
            if ($.children.length === 1) D = {
                offset: $.offset + 1,
                length: $.length - 2,
                content: ""
            };
            else if ($.children.length - 1 === J) {
                let j = $.children[J - 1],
                    M = j.offset + j.length,
                    P = $.offset + $.length;
                D = {
                    offset: M,
                    length: P - 2 - M,
                    content: ""
                }
            } else D = {
                offset: X.offset,
                length: $.children[J + 1].offset - X.offset,
                content: ""
            };
            return F61(A, D, Y)
        } else if (K !== void 0) {
            let J, X = `${JSON.stringify(K)}`;
            if (!Y.isArrayInsertion && $.children.length > O) {
                let D = $.children[O];
                J = {
                    offset: D.offset,
                    length: D.length,
                    content: X
                }
            } else if ($.children.length === 0 || O === 0) J = {
                offset: $.offset + 1,
                length: 0,
                content: $.children.length === 0 ? X : X + ","
            };
            else {
                let D = O > $.children.length ? $.children.length : O,
                    j = $.children[D - 1];
                J = {
                    offset: j.offset + j.length,
                    length: 0,
                    content: "," + X
                }
            }
            return F61(A, J, Y)
        } else throw Error(`Can not ${K===void 0?"remove":Y.isArrayInsertion?"insert":"modify"} Array index ${_} as length is not sufficient`)
    } else throw Error(`Can not add ${typeof O!=="number"?"index":"property"} to parent of type ${$.type}`)
}
// @from(Ln 33309, Col 0)
function F61(A, q, K) {
    if (!K.formattingOptions) return [q];
    let Y = Ya1(A, q),
        z = q.offset,
        w = q.offset + q.content.length;
    if (q.length === 0 || q.content.length === 0) {
        while (z > 0 && !ET1(Y, z - 1)) z--;
        while (w < Y.length && !ET1(Y, w)) w++
    }
    let H = pI6(Y, {
        offset: z,
        length: w - z
    }, {
        ...K.formattingOptions,
        keepLines: !1
    });
    for (let O = H.length - 1; O >= 0; O--) {
        let _ = H[O];
        Y = Ya1(Y, _), z = Math.min(z, _.offset), w = Math.max(w, _.offset + _.length), w += _.content.length - _.length
    }
    let $ = A.length - (Y.length - w) - z;
    return [{
        offset: z,
        length: $,
        content: Y.substring(z, w)
    }]
}
// @from(Ln 33337, Col 0)
function Ya1(A, q) {
    return A.substring(0, q.offset) + q.content + A.substring(q.offset + q.length)
}
// @from(Ln 33340, Col 4)
wY8 = v(() => {
    dI6();
    iI6()
})
// @from(Ln 33345, Col 0)
function _Y8(A, q, K, Y) {
    return zY8(A, q, K, Y)
}
// @from(Ln 33349, Col 0)
function JY8(A, q) {
    let K = q.slice(0).sort((z, w) => {
            let H = z.offset - w.offset;
            if (H === 0) return z.length - w.length;
            return H
        }),
        Y = A.length;
    for (let z = K.length - 1; z >= 0; z--) {
        let w = K[z];
        if (w.offset + w.length <= Y) A = Ya1(A, w);
        else throw Error("Overlapping edit");
        Y = w.offset
    }
    return A
}
// @from(Ln 33364, Col 4)
HY8
// @from(Ln 33364, Col 9)
$Y8
// @from(Ln 33364, Col 14)
nI6
// @from(Ln 33364, Col 19)
OY8
// @from(Ln 33365, Col 4)
XY8 = v(() => {
    dI6();
    wY8();
    qa1();
    iI6();
    (function(A) {
        A[A.None = 0] = "None", A[A.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 4] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 6] = "InvalidCharacter"
    })(HY8 || (HY8 = {}));
    (function(A) {
        A[A.OpenBraceToken = 1] = "OpenBraceToken", A[A.CloseBraceToken = 2] = "CloseBraceToken", A[A.OpenBracketToken = 3] = "OpenBracketToken", A[A.CloseBracketToken = 4] = "CloseBracketToken", A[A.CommaToken = 5] = "CommaToken", A[A.ColonToken = 6] = "ColonToken", A[A.NullKeyword = 7] = "NullKeyword", A[A.TrueKeyword = 8] = "TrueKeyword", A[A.FalseKeyword = 9] = "FalseKeyword", A[A.StringLiteral = 10] = "StringLiteral", A[A.NumericLiteral = 11] = "NumericLiteral", A[A.LineCommentTrivia = 12] = "LineCommentTrivia", A[A.BlockCommentTrivia = 13] = "BlockCommentTrivia", A[A.LineBreakTrivia = 14] = "LineBreakTrivia", A[A.Trivia = 15] = "Trivia", A[A.Unknown = 16] = "Unknown", A[A.EOF = 17] = "EOF"
    })($Y8 || ($Y8 = {}));
    nI6 = YY8;
    (function(A) {
        A[A.InvalidSymbol = 1] = "InvalidSymbol", A[A.InvalidNumberFormat = 2] = "InvalidNumberFormat", A[A.PropertyNameExpected = 3] = "PropertyNameExpected", A[A.ValueExpected = 4] = "ValueExpected", A[A.ColonExpected = 5] = "ColonExpected", A[A.CommaExpected = 6] = "CommaExpected", A[A.CloseBraceExpected = 7] = "CloseBraceExpected", A[A.CloseBracketExpected = 8] = "CloseBracketExpected", A[A.EndOfFileExpected = 9] = "EndOfFileExpected", A[A.InvalidCommentToken = 10] = "InvalidCommentToken", A[A.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 14] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 16] = "InvalidCharacter"
    })(OY8 || (OY8 = {}))
})
// @from(Ln 33387, Col 0)
function Tw1(A) {
    return A.startsWith(SzK) ? A.slice(1) : A
}
// @from(Ln 33391, Col 0)
function DY8(A) {
    if (!A) return null;
    try {
        return nI6(Tw1(A))
    } catch (q) {
        return K1(q), null
    }
}
// @from(Ln 33400, Col 0)
function hzK(A) {
    let q = jY8,
        K = A.length,
        Y = q(A);
    if (!Y.error || Y.done || Y.read >= K) return Y.values;
    let {
        values: z,
        read: w
    } = Y;
    while (w < K) {
        let H = typeof A === "string" ? A.indexOf(`
`, w) : A.indexOf(10, w);
        if (H === -1) break;
        w = H + 1;
        let $ = q(A, w);
        if ($.values.length > 0) z = z.concat($.values);
        if (!$.error || $.done || $.read >= K) break;
        w = $.read
    }
    return z
}
// @from(Ln 33422, Col 0)
function IzK(A) {
    let q = A.length,
        K = 0;
    if (A[0] === 239 && A[1] === 187 && A[2] === 191) K = 3;
    let Y = [];
    while (K < q) {
        let z = A.indexOf(10, K);
        if (z === -1) z = q;
        let w = A.toString("utf8", K, z).trim();
        if (K = z + 1, !w) continue;
        try {
            Y.push(JSON.parse(w))
        } catch {}
    }
    return Y
}
// @from(Ln 33439, Col 0)
function xzK(A) {
    let q = Tw1(A),
        K = q.length,
        Y = 0,
        z = [];
    while (Y < K) {
        let w = q.indexOf(`
`, Y);
        if (w === -1) w = K;
        let H = q.substring(Y, w).trim();
        if (Y = w + 1, !H) continue;
        try {
            z.push(JSON.parse(H))
        } catch {}
    }
    return z
}
// @from(Ln 33457, Col 0)
function Q61(A) {
    if (jY8) return hzK(A);
    if (typeof A === "string") return xzK(A);
    return IzK(A)
}
// @from(Ln 33462, Col 0)
async function ZQ(A) {
    let $ = [];
    try {
        let {
            size: q
        } = await yzK(A);
        if (q <= LT1) return Q61(await RzK(A));
        const K = oUA($, await CzK(A, "r"), 1);
        let Y = Buffer.allocUnsafe(LT1);
        let z = 0;
        let w = q - LT1;
        while (z < LT1) {
            let {
                bytesRead: D
            } = await K.read(Y, z, LT1 - z, w + z);
            if (D === 0) break;
            z += D
        }
        let H = Y.indexOf(10);
        if (H !== -1 && H < z - 1) return Q61(Y.subarray(H + 1, z));
        return Q61(Y.subarray(0, z))
    } catch (O) {
        var _ = O,
            J = 1
    } finally {
        var X = aUA($, _, J);
        X && await X
    }
}
// @from(Ln 33492, Col 0)
function MY8(A, q) {
    try {
        if (!A || A.trim() === "") return Q1([q], null, 4);
        let K = Tw1(A),
            Y = nI6(K);
        if (Array.isArray(Y)) {
            let z = Y.length,
                $ = _Y8(K, z === 0 ? [0] : [z], q, {
                    formattingOptions: {
                        insertSpaces: !0,
                        tabSize: 4
                    },
                    isArrayInsertion: !0
                });
            if (!$ || $.length === 0) {
                let O = [...Y, q];
                return Q1(O, null, 4)
            }
            return JY8(K, $)
        } else return Q1([q], null, 4)
    } catch (K) {
        return K1(K), Q1([q], null, 4)
    }
}
// @from(Ln 33516, Col 4)
SzK = "\uFEFF"
// @from(Ln 33517, Col 4)
j9
// @from(Ln 33517, Col 8)
jY8
// @from(Ln 33517, Col 13)
LT1 = 104857600
// @from(Ln 33518, Col 4)
AH = v(() => {
    y6();
    XY8();
    zq();
    m6();
    j9 = KA((A, q = !0) => {
        if (!A) return null;
        try {
            return JSON.parse(Tw1(A))
        } catch (K) {
            if (q) K1(K);
            return null
        }
    });
    jY8 = (() => {
        if (typeof Bun > "u") return !1;
        let q = Bun.JSONL;
        if (!q?.parseChunk) return !1;
        return q.parseChunk
    })()
})
// @from(Ln 33539, Col 4)
rI6
// @from(Ln 33539, Col 9)
eA
// @from(Ln 33539, Col 13)
g61
// @from(Ln 33539, Col 18)
PY8
// @from(Ln 33540, Col 4)
x3 = v(() => {
    zq();
    y6();
    _8();
    rI6 = ["macos", "wsl"], eA = KA(() => {
        try {
            if (process.platform === "darwin") return "macos";
            if (process.platform === "win32") return "windows";
            if (process.platform === "linux") {
                try {
                    let A = b1().readFileSync("/proc/version", {
                        encoding: "utf8"
                    });
                    if (A.toLowerCase().includes("microsoft") || A.toLowerCase().includes("wsl")) return "wsl"
                } catch (A) {
                    K1(A instanceof Error ? A : Error(String(A)))
                }
                return "linux"
            }
            return "unknown"
        } catch (A) {
            return K1(A instanceof Error ? A : Error(String(A))), "unknown"
        }
    }), g61 = KA(() => {
        if (process.platform !== "linux") return;
        try {
            let A = b1().readFileSync("/proc/version", {
                    encoding: "utf8"
                }),
                q = A.match(/WSL(\d+)/i);
            if (q && q[1]) return q[1];
            if (A.toLowerCase().includes("microsoft")) return "1";
            return
        } catch (A) {
            K1(A instanceof Error ? A : Error(String(A)));
            return
        }
    }), PY8 = eA() !== "windows"
})
// @from(Ln 33579, Col 0)
class Ew1 {
    heap;
    length;
    static #A = !1;
    static create(A) {
        let q = fY8(A);
        if (!q) return [];
        Ew1.#A = !0;
        let K = new Ew1(A, q);
        return Ew1.#A = !1, K
    }
    constructor(A, q) {
        if (!Ew1.#A) throw TypeError("instantiate Stack using Stack.create(n)");
        this.heap = new q(A), this.length = 0
    }
    push(A) {
        this.heap[this.length++] = A
    }
    pop() {
        return this.heap[--this.length]
    }
}
// @from(Ln 33601, Col 4)
vw1
// @from(Ln 33601, Col 9)
GY8
// @from(Ln 33601, Col 14)
oI6
// @from(Ln 33601, Col 19)
ZY8 = (A, q, K, Y) => {
        typeof oI6.emitWarning === "function" ? oI6.emitWarning(A, q, K, Y) : console.error(`[${K}] ${q}: ${A}`)
    }
// @from(Ln 33604, Col 4)
za1
// @from(Ln 33604, Col 9)
WY8
// @from(Ln 33604, Col 14)
bzK = (A) => !GY8.has(A)
// @from(Ln 33605, Col 4)
Llz
// @from(Ln 33605, Col 9)
Zi = (A) => A && A === Math.floor(A) && A > 0 && isFinite(A)
// @from(Ln 33606, Col 4)
fY8 = (A) => !Zi(A) ? null : A <= Math.pow(2, 8) ? Uint8Array : A <= Math.pow(2, 16) ? Uint16Array : A <= Math.pow(2, 32) ? Uint32Array : A <= Number.MAX_SAFE_INTEGER ? RT1 : null
// @from(Ln 33607, Col 4)
RT1
// @from(Ln 33607, Col 9)
ZT