
// @from(Ln 38935, Col 4)
Hg5 = (q, K) => {
        let {
            length: _
        } = q = q ? q.filter(Boolean) : [];
        if (K || _) {
            let z = new AbortController,
                Y, A = function(j) {
                    if (!Y) {
                        Y = !0, w();
                        let H = j instanceof Error ? j : this.reason;
                        z.abort(H instanceof v4 ? H : new Hh(H instanceof Error ? H.message : H))
                    }
                },
                O = K && setTimeout(() => {
                    O = null, A(new v4(`timeout of ${K}ms exceeded`, v4.ETIMEDOUT))
                }, K),
                w = () => {
                    if (q) O && clearTimeout(O), O = null, q.forEach((j) => {
                        j.unsubscribe ? j.unsubscribe(A) : j.removeEventListener("abort", A)
                    }), q = null
                };
            q.forEach((j) => j.addEventListener("abort", A));
            let {
                signal: $
            } = z;
            return $.unsubscribe = () => H1.asap(w), $
        }
    }
// @from(Ln 38963, Col 4)
aI7
// @from(Ln 38964, Col 4)
sI7 = L(() => {
    $A6();
    jh();
    Z$();
    aI7 = Hg5
})
// @from(Ln 38970, Col 4)
Jg5 = function*(q, K) {
        let _ = q.byteLength;
        if (!K || _ < K) {
            yield q;
            return
        }
        let z = 0,
            Y;
        while (z < _) Y = z + K, yield q.slice(z, Y), z = Y
    }
// @from(Ln 38980, Col 4)
Xg5 = async function*(q, K) {
        for await (let _ of Mg5(q)) yield* Jg5(_, K)
    }
// @from(Ln 38982, Col 7)
Mg5 = async function*(q) {
        if (q[Symbol.asyncIterator]) {
            yield* q;
            return
        }
        let K = q.getReader();
        try {
            for (;;) {
                let {
                    done: _,
                    value: z
                } = await K.read();
                if (_) break;
                yield z
            }
        } finally {
            await K.cancel()
        }
    }
// @from(Ln 39000, Col 7)
Cz1 = (q, K, _, z) => {
        let Y = Xg5(q, K),
            A = 0,
            O, w = ($) => {
                if (!O) O = !0, z && z($)
            };
        return new ReadableStream({
            async pull($) {
                try {
                    let {
                        done: j,
                        value: H
                    } = await Y.next();
                    if (j) {
                        w(), $.close();
                        return
                    }
                    let J = H.byteLength;
                    if (_) {
                        let X = A += J;
                        _(X)
                    }
                    $.enqueue(new Uint8Array(H))
                } catch (j) {
                    throw w(j), j
                }
            },
            cancel($) {
                return w($), Y.return()
            }
        }, {
            highWaterMark: 2
        })
    }
// @from(Ln 39034, Col 4)
tI7 = 65536
// @from(Ln 39035, Col 4)
ZH8
// @from(Ln 39035, Col 9)
Pg5
// @from(Ln 39035, Col 14)
eI7
// @from(Ln 39035, Col 19)
qx7
// @from(Ln 39035, Col 24)
Kx7 = (q, ...K) => {
        try {
            return !!q(...K)
        } catch (_) {
            return !1
        }
    }
// @from(Ln 39042, Col 4)
Wg5 = (q) => {
        q = H1.merge.call({
            skipUndefined: !0
        }, Pg5, q);
        let {
            fetch: K,
            Request: _,
            Response: z
        } = q, Y = K ? ZH8(K) : typeof fetch === "function", A = ZH8(_), O = ZH8(z);
        if (!Y) return !1;
        let w = Y && ZH8(eI7),
            $ = Y && (typeof qx7 === "function" ? ((P) => (W) => P.encode(W))(new qx7) : async (P) => new Uint8Array(await new _(P).arrayBuffer())),
            j = A && w && Kx7(() => {
                let P = !1,
                    W = new _(iA.origin, {
                        body: new eI7,
                        method: "POST",
                        get duplex() {
                            return P = !0, "half"
                        }
                    }).headers.has("Content-Type");
                return P && !W
            }),
            H = O && w && Kx7(() => H1.isReadableStream(new z("").body)),
            J = {
                stream: H && ((P) => P.body)
            };
        Y && (() => {
            ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((P) => {
                !J[P] && (J[P] = (W, D) => {
                    let Z = W && W[P];
                    if (Z) return Z.call(W);
                    throw new v4(`Response type '${P}' is not supported`, v4.ERR_NOT_SUPPORT, D)
                })
            })
        })();
        let X = async (P) => {
            if (P == null) return 0;
            if (H1.isBlob(P)) return P.size;
            if (H1.isSpecCompliantForm(P)) return (await new _(iA.origin, {
                method: "POST",
                body: P
            }).arrayBuffer()).byteLength;
            if (H1.isArrayBufferView(P) || H1.isArrayBuffer(P)) return P.byteLength;
            if (H1.isURLSearchParams(P)) P = P + "";
            if (H1.isString(P)) return (await $(P)).byteLength
        }, M = async (P, W) => {
            let D = H1.toFiniteNumber(P.getContentLength());
            return D == null ? X(W) : D
        };
        return async (P) => {
            let {
                url: W,
                method: D,
                data: Z,
                signal: G,
                cancelToken: f,
                timeout: v,
                onDownloadProgress: V,
                onUploadProgress: k,
                responseType: N,
                headers: R,
                withCredentials: h = "same-origin",
                fetchOptions: C
            } = DH8(P), x = K || fetch;
            N = N ? (N + "").toLowerCase() : "text";
            let B = aI7([G, f && f.toAbortSignal()], v),
                m = null,
                S = B && B.unsubscribe && (() => {
                    B.unsubscribe()
                }),
                F;
            try {
                if (k && j && D !== "get" && D !== "head" && (F = await M(R, Z)) !== 0) {
                    let z6 = new _(W, {
                            method: "POST",
                            body: Z,
                            duplex: "half"
                        }),
                        A6;
                    if (H1.isFormData(Z) && (A6 = z6.headers.get("content-type"))) R.setContentType(A6);
                    if (z6.body) {
                        let [e, i] = jf6(F, Wr(Hf6(k)));
                        Z = Cz1(z6.body, tI7, e, i)
                    }
                }
                if (!H1.isString(h)) h = h ? "include" : "omit";
                let U = A && "credentials" in _.prototype,
                    g = {
                        ...C,
                        signal: B,
                        method: D.toUpperCase(),
                        headers: R.normalize().toJSON(),
                        body: Z,
                        duplex: "half",
                        credentials: U ? h : void 0
                    };
                m = A && new _(W, g);
                let c = await (A ? x(m, C) : x(W, g)),
                    n = H && (N === "stream" || N === "response");
                if (H && (V || n && S)) {
                    let z6 = {};
                    ["status", "statusText", "headers"].forEach((O6) => {
                        z6[O6] = c[O6]
                    });
                    let A6 = H1.toFiniteNumber(c.headers.get("content-length")),
                        [e, i] = V && jf6(A6, Wr(Hf6(V), !0)) || [];
                    c = new z(Cz1(c.body, tI7, e, () => {
                        i && i(), S && S()
                    }), z6)
                }
                N = N || "text";
                let l = await J[H1.findKey(J, N) || "text"](c, P);
                return !n && S && S(), await new Promise((z6, A6) => {
                    jU(z6, A6, {
                        data: l,
                        headers: sH.from(c.headers),
                        status: c.status,
                        statusText: c.statusText,
                        config: P,
                        request: m
                    })
                })
            } catch (U) {
                if (S && S(), U && U.name === "TypeError" && /Load failed|fetch/i.test(U.message)) throw Object.assign(new v4("Network Error", v4.ERR_NETWORK, P, m, U && U.response), {
                    cause: U.cause || U
                });
                throw v4.from(U, U && U.code, P, m, U && U.response)
            }
        }
    }
// @from(Ln 39173, Col 4)
Dg5
// @from(Ln 39173, Col 9)
bz1 = (q) => {
        let K = q && q.env || {},
            {
                fetch: _,
                Request: z,
                Response: Y
            } = K,
            A = [z, Y, _],
            O = A.length,
            w = O,
            $, j, H = Dg5;
        while (w--) $ = A[w], j = H.get($), j === void 0 && H.set($, j = w ? new Map : Wg5(K)), H = j;
        return j
    }
// @from(Ln 39187, Col 4)
IFA
// @from(Ln 39188, Col 4)
_x7 = L(() => {
    km();
    Z$();
    jh();
    sI7();
    $U();
    PH8();
    Sz1();
    YH8();
    ({
        isFunction: ZH8
    } = H1), Pg5 = (({
        Request: q,
        Response: K
    }) => ({
        Request: q,
        Response: K
    }))(H1.global), {
        ReadableStream: eI7,
        TextEncoder: qx7
    } = H1.global, Dg5 = new Map, IFA = bz1()
})
// @from(Ln 39211, Col 0)
function Gg5(q, K) {
    q = H1.isArray(q) ? q : [q];
    let {
        length: _
    } = q, z, Y, A = {};
    for (let O = 0; O < _; O++) {
        z = q[O];
        let w;
        if (Y = z, !fg5(z)) {
            if (Y = Iz1[(w = String(z)).toLowerCase()], Y === void 0) throw new v4(`Unknown adapter '${w}'`)
        }
        if (Y && (H1.isFunction(Y) || (Y = Y.get(K)))) break;
        A[w || "#" + O] = Y
    }
    if (!Y) {
        let O = Object.entries(A).map(([$, j]) => `adapter ${$} ` + (j === !1 ? "is not supported by the environment" : "is not available in the build")),
            w = _ ? O.length > 1 ? `since :
` + O.map(zx7).join(`
`) : " " + zx7(O[0]) : "as no adapter specified";
        throw new v4("There is no suitable adapter to dispatch the request " + w, "ERR_NOT_SUPPORT")
    }
    return Y
}
// @from(Ln 39234, Col 4)
Iz1
// @from(Ln 39234, Col 9)
zx7 = (q) => `- ${q}`
// @from(Ln 39235, Col 4)
fg5 = (q) => H1.isFunction(q) || q === null || q === !1
// @from(Ln 39236, Col 4)
fH8
// @from(Ln 39237, Col 4)
xz1 = L(() => {
    Z$();
    QI7();
    oI7();
    _x7();
    jh();
    Iz1 = {
        http: UI7,
        xhr: rI7,
        fetch: {
            get: bz1
        }
    };
    H1.forEach(Iz1, (q, K) => {
        if (q) {
            try {
                Object.defineProperty(q, "name", {
                    value: K
                })
            } catch (_) {}
            Object.defineProperty(q, "adapterName", {
                value: K
            })
        }
    });
    fH8 = {
        getAdapter: Gg5,
        adapters: Iz1
    }
})
// @from(Ln 39268, Col 0)
function uz1(q) {
    if (q.cancelToken) q.cancelToken.throwIfRequested();
    if (q.signal && q.signal.aborted) throw new Hh(null, q)
}
// @from(Ln 39273, Col 0)
function GH8(q) {
    if (uz1(q), q.headers = sH.from(q.headers), q.data = NU6.call(q, q.transformRequest), ["post", "put", "patch"].indexOf(q.method) !== -1) q.headers.setContentType("application/x-www-form-urlencoded", !1);
    return fH8.getAdapter(q.adapter || zf6.adapter, q)(q).then(function(z) {
        return uz1(q), z.data = NU6.call(q, q.transformResponse, z), z.headers = sH.from(z.headers), z
    }, function(z) {
        if (!EU6(z)) {
            if (uz1(q), z && z.response) z.response.data = NU6.call(q, q.transformResponse, z.response), z.response.headers = sH.from(z.response.headers)
        }
        return Promise.reject(z)
    })
}
// @from(Ln 39284, Col 4)
Yx7 = L(() => {
    nb7();
    _H8();
    $A6();
    $U();
    xz1()
})
// @from(Ln 39292, Col 0)
function vg5(q, K, _) {
    if (typeof q !== "object") throw new v4("options must be an object", v4.ERR_BAD_OPTION_VALUE);
    let z = Object.keys(q),
        Y = z.length;
    while (Y-- > 0) {
        let A = z[Y],
            O = K[A];
        if (O) {
            let w = q[A],
                $ = w === void 0 || O(w, A, q);
            if ($ !== !0) throw new v4("option " + A + " must be " + $, v4.ERR_BAD_OPTION_VALUE);
            continue
        }
        if (_ !== !0) throw new v4("Unknown option " + A, v4.ERR_BAD_OPTION)
    }
}
// @from(Ln 39308, Col 4)
vH8
// @from(Ln 39308, Col 9)
Ax7
// @from(Ln 39308, Col 14)
bU6
// @from(Ln 39309, Col 4)
Ox7 = L(() => {
    jh();
    vH8 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((q, K) => {
        vH8[q] = function(z) {
            return typeof z === q || "a" + (K < 1 ? "n " : " ") + q
        }
    });
    Ax7 = {};
    vH8.transitional = function(K, _, z) {
        function Y(A, O) {
            return "[Axios v" + PA6 + "] Transitional option '" + A + "'" + O + (z ? ". " + z : "")
        }
        return (A, O, w) => {
            if (K === !1) throw new v4(Y(O, " has been removed" + (_ ? " in " + _ : "")), v4.ERR_DEPRECATED);
            if (_ && !Ax7[O]) Ax7[O] = !0, console.warn(Y(O, " has been deprecated since v" + _ + " and will be removed in the near future"));
            return K ? K(A, O, w) : !0
        }
    };
    vH8.spelling = function(K) {
        return (_, z) => {
            return console.warn(`${z} is likely a misspelling of ${K}`), !0
        }
    };
    bU6 = {
        assertOptions: vg5,
        validators: vH8
    }
})
// @from(Ln 39338, Col 0)
class IU6 {
    constructor(q) {
        this.defaults = q || {}, this.interceptors = {
            request: new t_1,
            response: new t_1
        }
    }
    async request(q, K) {
        try {
            return await this._request(q, K)
        } catch (_) {
            if (_ instanceof Error) {
                let z = {};
                Error.captureStackTrace ? Error.captureStackTrace(z) : z = Error();
                let Y = z.stack ? z.stack.replace(/^.+\n/, "") : "";
                try {
                    if (!_.stack) _.stack = Y;
                    else if (Y && !String(_.stack).endsWith(Y.replace(/^.+\n.+\n/, ""))) _.stack += `
` + Y
                } catch (A) {}
            }
            throw _
        }
    }
    _request(q, K) {
        if (typeof q === "string") K = K || {}, K.url = q;
        else K = q || {};
        K = Nm(this.defaults, K);
        let {
            transitional: _,
            paramsSerializer: z,
            headers: Y
        } = K;
        if (_ !== void 0) bU6.assertOptions(_, {
            silentJSONParsing: UC.transitional(UC.boolean),
            forcedJSONParsing: UC.transitional(UC.boolean),
            clarifyTimeoutError: UC.transitional(UC.boolean),
            legacyInterceptorReqResOrdering: UC.transitional(UC.boolean)
        }, !1);
        if (z != null)
            if (H1.isFunction(z)) K.paramsSerializer = {
                serialize: z
            };
            else bU6.assertOptions(z, {
                encode: UC.function,
                serialize: UC.function
            }, !0);
        if (K.allowAbsoluteUrls !== void 0);
        else if (this.defaults.allowAbsoluteUrls !== void 0) K.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        else K.allowAbsoluteUrls = !0;
        bU6.assertOptions(K, {
            baseUrl: UC.spelling("baseURL"),
            withXsrfToken: UC.spelling("withXSRFToken")
        }, !0), K.method = (K.method || this.defaults.method || "get").toLowerCase();
        let A = Y && H1.merge(Y.common, Y[K.method]);
        Y && H1.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (M) => {
            delete Y[M]
        }), K.headers = sH.concat(A, Y);
        let O = [],
            w = !0;
        this.interceptors.request.forEach(function(P) {
            if (typeof P.runWhen === "function" && P.runWhen(K) === !1) return;
            w = w && P.synchronous;
            let W = K.transitional || P16;
            if (W && W.legacyInterceptorReqResOrdering) O.unshift(P.fulfilled, P.rejected);
            else O.push(P.fulfilled, P.rejected)
        });
        let $ = [];
        this.interceptors.response.forEach(function(P) {
            $.push(P.fulfilled, P.rejected)
        });
        let j, H = 0,
            J;
        if (!w) {
            let M = [GH8.bind(this), void 0];
            M.unshift(...O), M.push(...$), J = M.length, j = Promise.resolve(K);
            while (H < J) j = j.then(M[H++], M[H++]);
            return j
        }
        J = O.length;
        let X = K;
        while (H < J) {
            let M = O[H++],
                P = O[H++];
            try {
                X = M(X)
            } catch (W) {
                P.call(this, W);
                break
            }
        }
        try {
            j = GH8.call(this, X)
        } catch (M) {
            return Promise.reject(M)
        }
        H = 0, J = $.length;
        while (H < J) j = j.then($[H++], $[H++]);
        return j
    }
    getUri(q) {
        q = Nm(this.defaults, q);
        let K = jA6(q.baseURL, q.url, q.allowAbsoluteUrls);
        return wA6(K, q.params, q.paramsSerializer)
    }
}
// @from(Ln 39444, Col 4)
UC
// @from(Ln 39444, Col 8)
xU6
// @from(Ln 39445, Col 4)
wx7 = L(() => {
    Z$();
    qH8();
    xb7();
    Yx7();
    WH8();
    AH8();
    Ox7();
    $U();
    TU6();
    UC = bU6.validators;
    H1.forEach(["delete", "get", "head", "options"], function(K) {
        IU6.prototype[K] = function(_, z) {
            return this.request(Nm(z || {}, {
                method: K,
                url: _,
                data: (z || {}).data
            }))
        }
    });
    H1.forEach(["post", "put", "patch"], function(K) {
        function _(z) {
            return function(A, O, w) {
                return this.request(Nm(w || {}, {
                    method: K,
                    headers: z ? {
                        "Content-Type": "multipart/form-data"
                    } : {},
                    url: A,
                    data: O
                }))
            }
        }
        IU6.prototype[K] = _(), IU6.prototype[K + "Form"] = _(!0)
    });
    xU6 = IU6
})
// @from(Ln 39482, Col 0)
class mz1 {
    constructor(q) {
        if (typeof q !== "function") throw TypeError("executor must be a function.");
        let K;
        this.promise = new Promise(function(Y) {
            K = Y
        });
        let _ = this;
        this.promise.then((z) => {
            if (!_._listeners) return;
            let Y = _._listeners.length;
            while (Y-- > 0) _._listeners[Y](z);
            _._listeners = null
        }), this.promise.then = (z) => {
            let Y, A = new Promise((O) => {
                _.subscribe(O), Y = O
            }).then(z);
            return A.cancel = function() {
                _.unsubscribe(Y)
            }, A
        }, q(function(Y, A, O) {
            if (_.reason) return;
            _.reason = new Hh(Y, A, O), K(_.reason)
        })
    }
    throwIfRequested() {
        if (this.reason) throw this.reason
    }
    subscribe(q) {
        if (this.reason) {
            q(this.reason);
            return
        }
        if (this._listeners) this._listeners.push(q);
        else this._listeners = [q]
    }
    unsubscribe(q) {
        if (!this._listeners) return;
        let K = this._listeners.indexOf(q);
        if (K !== -1) this._listeners.splice(K, 1)
    }
    toAbortSignal() {
        let q = new AbortController,
            K = (_) => {
                q.abort(_)
            };
        return this.subscribe(K), q.signal.unsubscribe = () => this.unsubscribe(K), q.signal
    }
    static source() {
        let q;
        return {
            token: new mz1(function(z) {
                q = z
            }),
            cancel: q
        }
    }
}
// @from(Ln 39540, Col 4)
$x7
// @from(Ln 39541, Col 4)
jx7 = L(() => {
    $A6();
    $x7 = mz1
})
// @from(Ln 39546, Col 0)
function Bz1(q) {
    return function(_) {
        return q.apply(null, _)
    }
}
// @from(Ln 39552, Col 0)
function pz1(q) {
    return H1.isObject(q) && q.isAxiosError === !0
}
// @from(Ln 39555, Col 4)
Hx7 = L(() => {
    Z$()
})
// @from(Ln 39558, Col 4)
Fz1
// @from(Ln 39558, Col 9)
Jx7
// @from(Ln 39559, Col 4)
Xx7 = L(() => {
    Fz1 = {
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
        NetworkAuthenticationRequired: 511,
        WebServerIsDown: 521,
        ConnectionTimedOut: 522,
        OriginIsUnreachable: 523,
        TimeoutOccurred: 524,
        SslHandshakeFailed: 525,
        InvalidSslCertificate: 526
    };
    Object.entries(Fz1).forEach(([q, K]) => {
        Fz1[K] = q
    });
    Jx7 = Fz1
})
// @from(Ln 39637, Col 0)
function Mx7(q) {
    let K = new xU6(q),
        _ = JU6(xU6.prototype.request, K);
    return H1.extend(_, xU6.prototype, K, {
        allOwnKeys: !0
    }), H1.extend(_, K, null, {
        allOwnKeys: !0
    }), _.create = function(Y) {
        return Mx7(Nm(q, Y))
    }, _
}
// @from(Ln 39648, Col 4)
YP
// @from(Ln 39648, Col 8)
Z1
// @from(Ln 39649, Col 4)
Px7 = L(() => {
    Z$();
    wx7();
    WH8();
    _H8();
    Yz1();
    $A6();
    jx7();
    vU6();
    jh();
    Hx7();
    $U();
    xz1();
    Xx7();
    YP = Mx7(zf6);
    YP.Axios = xU6;
    YP.CanceledError = Hh;
    YP.CancelToken = $x7;
    YP.isCancel = EU6;
    YP.VERSION = PA6;
    YP.toFormData = M16;
    YP.AxiosError = v4;
    YP.Cancel = YP.CanceledError;
    YP.all = function(K) {
        return Promise.all(K)
    };
    YP.spread = Bz1;
    YP.isAxiosError = pz1;
    YP.mergeConfig = Nm;
    YP.AxiosHeaders = sH;
    YP.formToJSON = (q) => KH8(H1.isHTMLForm(q) ? new FormData(q) : q);
    YP.getAdapter = fH8.getAdapter;
    YP.HttpStatusCode = Jx7;
    YP.default = YP;
    Z1 = YP
})
// @from(Ln 39685, Col 4)
Jf6 = {}
// @from(Ln 39705, Col 4)
Tg5
// @from(Ln 39705, Col 9)
Vg5
// @from(Ln 39705, Col 14)
kg5
// @from(Ln 39705, Col 19)
Ng5
// @from(Ln 39705, Col 24)
Eg5
// @from(Ln 39705, Col 29)
yg5
// @from(Ln 39705, Col 34)
Lg5
// @from(Ln 39705, Col 39)
hg5
// @from(Ln 39705, Col 44)
Rg5
// @from(Ln 39705, Col 49)
Sg5
// @from(Ln 39705, Col 54)
Cg5
// @from(Ln 39705, Col 59)
bg5
// @from(Ln 39705, Col 64)
Ig5
// @from(Ln 39705, Col 69)
xg5
// @from(Ln 39705, Col 74)
ug5
// @from(Ln 39705, Col 79)
mg5
// @from(Ln 39706, Col 4)
CK = L(() => {
    Px7();
    ({
        Axios: Tg5,
        AxiosError: Vg5,
        CanceledError: kg5,
        isCancel: Ng5,
        CancelToken: Eg5,
        VERSION: yg5,
        all: Lg5,
        Cancel: hg5,
        isAxiosError: Rg5,
        spread: Sg5,
        toFormData: Cg5,
        AxiosHeaders: bg5,
        HttpStatusCode: Ig5,
        formToJSON: xg5,
        getAdapter: ug5,
        mergeConfig: mg5
    } = Z1)
})
// @from(Ln 39728, Col 0)
function Bg5(q, K, _, z) {
    if (!xO(q)) return q;
    K = TC(K, q);
    var Y = -1,
        A = K.length,
        O = A - 1,
        w = q;
    while (w != null && ++Y < A) {
        var $ = VC(K[Y]),
            j = _;
        if ($ === "__proto__" || $ === "constructor" || $ === "prototype") return q;
        if (Y != O) {
            var H = w[$];
            if (j = z ? z(H, $, w) : void 0, j === void 0) j = xO(H) ? H : G86(K[Y + 1]) ? [] : {}
        }
        g86(w, $, j), w = w[$]
    }
    return q
}
// @from(Ln 39747, Col 4)
TH8
// @from(Ln 39748, Col 4)
gz1 = L(() => {
    ep6();
    $Y6();
    RB6();
    zV();
    jY6();
    TH8 = Bg5
})
// @from(Ln 39757, Col 0)
function pg5(q, K, _) {
    var z = -1,
        Y = K.length,
        A = {};
    while (++z < Y) {
        var O = K[z],
            w = k86(q, O);
        if (_(w, O)) TH8(A, TC(O, q), w)
    }
    return A
}
// @from(Ln 39768, Col 4)
Wx7
// @from(Ln 39769, Col 4)
Dx7 = L(() => {
    uB6();
    gz1();
    $Y6();
    Wx7 = pg5
})
// @from(Ln 39776, Col 0)
function Fg5(q, K) {
    if (q == null) return {};
    var _ = V86(aD6(q), function(z) {
        return [z]
    });
    return K = xN(K), Wx7(q, _, function(z, Y) {
        return K(z, Y[0])
    })
}
// @from(Ln 39785, Col 4)
QC
// @from(Ln 39786, Col 4)
Xf6 = L(() => {
    xB6();
    N86();
    Dx7();
    Qw8();
    QC = Fg5
})
// @from(Ln 39793, Col 4)
hx7 = p((Lx7) => {
    Object.defineProperty(Lx7, "__esModule", {
        value: !0
    });
    var vx7 = /^[a-zA-Z:_][a-zA-Z0-9:_.-]*$/,
        dz1 = {
            revert: function() {}
        },
        EH8 = new Map,
        Qz1 = new Set;

    function yH8(q) {
        var K = EH8.get(q);
        return K || EH8.set(q, K = {
            element: q,
            attributes: {}
        }), K
    }

    function LH8(q, K, _, z, Y) {
        var A = _(q),
            O = {
                isDirty: !1,
                originalValue: A,
                virtualValue: A,
                mutations: [],
                el: q,
                _positionTimeout: null,
                observer: new MutationObserver(function() {
                    if (K !== "position" || !O._positionTimeout) {
                        K === "position" && (O._positionTimeout = setTimeout(function() {
                            O._positionTimeout = null
                        }, 1000));
                        var w = _(q);
                        K === "position" && w.parentNode === O.virtualValue.parentNode && w.insertBeforeNode === O.virtualValue.insertBeforeNode || w !== O.virtualValue && (O.originalValue = w, Y(O))
                    }
                }),
                mutationRunner: Y,
                setValue: z,
                getCurrentValue: _
            };
        return K === "position" && q.parentNode ? O.observer.observe(q.parentNode, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }) : O.observer.observe(q, function(w) {
            return w === "html" ? {
                childList: !0,
                subtree: !0,
                attributes: !0,
                characterData: !0
            } : {
                childList: !1,
                subtree: !1,
                attributes: !0,
                attributeFilter: [w]
            }
        }(K)), O
    }

    function hH8(q, K) {
        var _ = K.getCurrentValue(K.el);
        K.virtualValue = q, q && typeof q != "string" ? _ && q.parentNode === _.parentNode && q.insertBeforeNode === _.insertBeforeNode || (K.isDirty = !0, Zx7()) : q !== _ && (K.isDirty = !0, Zx7())
    }

    function gg5(q) {
        var K = q.originalValue;
        q.mutations.forEach(function(_) {
            return K = _.mutate(K)
        }), hH8(function(_) {
            return VH8 || (VH8 = document.createElement("div")), VH8.innerHTML = _, VH8.innerHTML
        }(K), q)
    }

    function Ug5(q) {
        var K = new Set(q.originalValue.split(/\s+/).filter(Boolean));
        q.mutations.forEach(function(_) {
            return _.mutate(K)
        }), hH8(Array.from(K).filter(Boolean).join(" "), q)
    }

    function Qg5(q) {
        var K = q.originalValue;
        q.mutations.forEach(function(_) {
            return K = _.mutate(K)
        }), hH8(K, q)
    }

    function dg5(q) {
        var K = q.originalValue;
        q.mutations.forEach(function(_) {
            var z = function(Y) {
                var A = Y.insertBeforeSelector,
                    O = document.querySelector(Y.parentSelector);
                if (!O) return null;
                var w = A ? document.querySelector(A) : null;
                return A && !w ? null : {
                    parentNode: O,
                    insertBeforeNode: w
                }
            }(_.mutate());
            K = z || K
        }), hH8(K, q)
    }
    var cg5 = function(q) {
            return q.innerHTML
        },
        lg5 = function(q, K) {
            return q.innerHTML = K
        };

    function Tx7(q) {
        var K = yH8(q);
        return K.html || (K.html = LH8(q, "html", cg5, lg5, gg5)), K.html
    }
    var ng5 = function(q) {
            return {
                parentNode: q.parentElement,
                insertBeforeNode: q.nextElementSibling
            }
        },
        ig5 = function(q, K) {
            K.insertBeforeNode && !K.parentNode.contains(K.insertBeforeNode) || K.parentNode.insertBefore(q, K.insertBeforeNode)
        };

    function Vx7(q) {
        var K = yH8(q);
        return K.position || (K.position = LH8(q, "position", ng5, ig5, dg5)), K.position
    }
    var VH8, mU6, rg5 = function(q, K) {
            return K ? q.className = K : q.removeAttribute("class")
        },
        og5 = function(q) {
            return q.className
        };

    function kx7(q) {
        var K = yH8(q);
        return K.classes || (K.classes = LH8(q, "class", og5, rg5, Ug5)), K.classes
    }

    function Nx7(q, K) {
        var _, z = yH8(q);
        return z.attributes[K] || (z.attributes[K] = LH8(q, K, (_ = K, function(Y) {
            var A;
            return (A = Y.getAttribute(_)) != null ? A : null
        }), function(Y) {
            return function(A, O) {
                return O !== null ? A.setAttribute(Y, O) : A.removeAttribute(Y)
            }
        }(K), Qg5)), z.attributes[K]
    }

    function kH8(q, K, _) {
        if (_.isDirty) {
            _.isDirty = !1;
            var z = _.virtualValue;
            _.mutations.length || function(Y, A) {
                var O, w, $ = EH8.get(Y);
                if ($)
                    if (A === "html")(O = $.html) == null || (w = O.observer) == null || w.disconnect(), delete $.html;
                    else if (A === "class") {
                    var j, H;
                    (j = $.classes) == null || (H = j.observer) == null || H.disconnect(), delete $.classes
                } else if (A === "position") {
                    var J, X;
                    (J = $.position) == null || (X = J.observer) == null || X.disconnect(), delete $.position
                } else {
                    var M, P, W;
                    (M = $.attributes) == null || (P = M[A]) == null || (W = P.observer) == null || W.disconnect(), delete $.attributes[A]
                }
            }(q, K), _.setValue(q, z)
        }
    }

    function ag5(q, K) {
        q.html && kH8(K, "html", q.html), q.classes && kH8(K, "class", q.classes), q.position && kH8(K, "position", q.position), Object.keys(q.attributes).forEach(function(_) {
            kH8(K, _, q.attributes[_])
        })
    }

    function Zx7() {
        EH8.forEach(ag5)
    }

    function Ex7(q) {
        if (q.kind !== "position" || q.elements.size !== 1) {
            var K = new Set(q.elements);
            document.querySelectorAll(q.selector).forEach(function(_) {
                K.has(_) || (q.elements.add(_), function(z, Y) {
                    var A = null;
                    z.kind === "html" ? A = Tx7(Y) : z.kind === "class" ? A = kx7(Y) : z.kind === "attribute" ? A = Nx7(Y, z.attribute) : z.kind === "position" && (A = Vx7(Y)), A && (A.mutations.push(z), A.mutationRunner(A))
                }(q, _))
            })
        }
    }

    function fx7() {
        Qz1.forEach(Ex7)
    }

    function yx7() {
        typeof document < "u" && (mU6 || (mU6 = new MutationObserver(function() {
            fx7()
        })), fx7(), mU6.observe(document.documentElement, {
            childList: !0,
            subtree: !0,
            attributes: !1,
            characterData: !1
        }))
    }

    function RH8(q) {
        return typeof document > "u" ? dz1 : (Qz1.add(q), Ex7(q), {
            revert: function() {
                var K;
                (K = q).elements.forEach(function(_) {
                    return function(z, Y) {
                        var A = null;
                        if (z.kind === "html" ? A = Tx7(Y) : z.kind === "class" ? A = kx7(Y) : z.kind === "attribute" ? A = Nx7(Y, z.attribute) : z.kind === "position" && (A = Vx7(Y)), A) {
                            var O = A.mutations.indexOf(z);
                            O !== -1 && A.mutations.splice(O, 1), A.mutationRunner(A)
                        }
                    }(K, _)
                }), K.elements.clear(), Qz1.delete(K)
            }
        })
    }

    function Uz1(q, K) {
        return RH8({
            kind: "html",
            elements: new Set,
            mutate: K,
            selector: q
        })
    }

    function Gx7(q, K) {
        return RH8({
            kind: "position",
            elements: new Set,
            mutate: K,
            selector: q
        })
    }

    function uU6(q, K) {
        return RH8({
            kind: "class",
            elements: new Set,
            mutate: K,
            selector: q
        })
    }

    function NH8(q, K, _) {
        return vx7.test(K) ? K === "class" || K === "className" ? uU6(q, function(z) {
            var Y = _(Array.from(z).join(" "));
            z.clear(), Y && Y.split(/\s+/g).filter(Boolean).forEach(function(A) {
                return z.add(A)
            })
        }) : RH8({
            kind: "attribute",
            attribute: K,
            elements: new Set,
            mutate: _,
            selector: q
        }) : dz1
    }
    yx7();
    var sg5 = {
        html: Uz1,
        classes: uU6,
        attribute: NH8,
        position: Gx7,
        declarative: function(q) {
            var {
                selector: K,
                action: _,
                value: z,
                attribute: Y,
                parentSelector: A,
                insertBeforeSelector: O
            } = q;
            if (Y === "html") {
                if (_ === "append") return Uz1(K, function(w) {
                    return w + (z != null ? z : "")
                });
                if (_ === "set") return Uz1(K, function() {
                    return z != null ? z : ""
                })
            } else if (Y === "class") {
                if (_ === "append") return uU6(K, function(w) {
                    z && w.add(z)
                });
                if (_ === "remove") return uU6(K, function(w) {
                    z && w.delete(z)
                });
                if (_ === "set") return uU6(K, function(w) {
                    w.clear(), z && w.add(z)
                })
            } else if (Y === "position") {
                if (_ === "set" && A) return Gx7(K, function() {
                    return {
                        insertBeforeSelector: O,
                        parentSelector: A
                    }
                })
            } else {
                if (_ === "append") return NH8(K, Y, function(w) {
                    return w !== null ? w + (z != null ? z : "") : z != null ? z : ""
                });
                if (_ === "set") return NH8(K, Y, function() {
                    return z != null ? z : ""
                });
                if (_ === "remove") return NH8(K, Y, function() {
                    return null
                })
            }
            return dz1
        }
    };
    Lx7.connectGlobalObserver = yx7, Lx7.default = sg5, Lx7.disconnectGlobalObserver = function() {
        mU6 && mU6.disconnect()
    }, Lx7.validAttributeName = vx7
})
// @from(Ln 40122, Col 0)
function Cx7() {
    return Sx7
}
// @from(Ln 40126, Col 0)
function cz1(q) {
    let K = 2166136261,
        _ = q.length;
    for (let z = 0; z < _; z++) K ^= q.charCodeAt(z), K += (K << 1) + (K << 4) + (K << 7) + (K << 8) + (K << 24);
    return K >>> 0
}
// @from(Ln 40133, Col 0)
function BU6(q, K, _) {
    if (_ === 2) return cz1(cz1(q + K) + "") % 1e4 / 1e4;
    if (_ === 1) return cz1(K + q) % 1000 / 1000;
    return null
}
// @from(Ln 40139, Col 0)
function tg5(q) {
    if (q <= 0) return [];
    return Array(q).fill(1 / q)
}
// @from(Ln 40144, Col 0)
function SH8(q, K) {
    return q >= K[0] && q < K[1]
}
// @from(Ln 40148, Col 0)
function bx7(q, K) {
    let _ = BU6("__" + K[0], q, 1);
    if (_ === null) return !1;
    return _ >= K[1] && _ < K[2]
}
// @from(Ln 40154, Col 0)
function Ix7(q, K) {
    for (let _ = 0; _ < K.length; _++)
        if (SH8(q, K[_])) return _;
    return -1
}
// @from(Ln 40160, Col 0)
function nz1(q) {
    try {
        let K = q.replace(/([^\\])\//g, "$1\\/");
        return new RegExp(K)
    } catch (K) {
        console.error(K);
        return
    }
}
// @from(Ln 40170, Col 0)
function CH8(q, K) {
    if (!K.length) return !1;
    let _ = !1,
        z = !1;
    for (let Y = 0; Y < K.length; Y++) {
        let A = KU5(q, K[Y].type, K[Y].pattern);
        if (K[Y].include === !1) {
            if (A) return !1
        } else if (_ = !0, A) z = !0
    }
    return z || !_
}
// @from(Ln 40183, Col 0)
function eg5(q, K, _) {
    try {
        let z = K.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
        if (_) z = "\\/?" + z.replace(/(^\/|\/$)/g, "") + "\\/?";
        return new RegExp("^" + z + "$", "i").test(q)
    } catch (z) {
        return !1
    }
}
// @from(Ln 40193, Col 0)
function qU5(q, K) {
    try {
        let _ = new URL(K.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"),
            z = [
                [q.host, _.host, !1],
                [q.pathname, _.pathname, !0]
            ];
        if (_.hash) z.push([q.hash, _.hash, !1]);
        return _.searchParams.forEach((Y, A) => {
            z.push([q.searchParams.get(A) || "", Y, !1])
        }), !z.some((Y) => !eg5(Y[0], Y[1], Y[2]))
    } catch (_) {
        return !1
    }
}
// @from(Ln 40209, Col 0)
function KU5(q, K, _) {
    try {
        let z = new URL(q, "https://_");
        if (K === "regex") {
            let Y = nz1(_);
            if (!Y) return !1;
            return Y.test(z.href) || Y.test(z.href.substring(z.origin.length))
        } else if (K === "simple") return qU5(z, _);
        return !1
    } catch (z) {
        return !1
    }
}
// @from(Ln 40223, Col 0)
function xx7(q, K, _) {
    if (K = K === void 0 ? 1 : K, K < 0) K = 0;
    else if (K > 1) K = 1;
    let z = tg5(q);
    if (_ = _ || z, _.length !== q) _ = z;
    let Y = _.reduce((O, w) => w + O, 0);
    if (Y < 0.99 || Y > 1.01) _ = z;
    let A = 0;
    return _.map((O) => {
        let w = A;
        return A += O, [w, w + K * O]
    })
}
// @from(Ln 40237, Col 0)
function ux7(q, K, _) {
    if (!K) return null;
    let z = K.split("?")[1];
    if (!z) return null;
    let Y = z.replace(/#.*/, "").split("&").map((A) => A.split("=", 2)).filter((A) => {
        let [O] = A;
        return O === q
    }).map((A) => {
        let [, O] = A;
        return parseInt(O)
    });
    if (Y.length > 0 && Y[0] >= 0 && Y[0] < _) return Y[0];
    return null
}
// @from(Ln 40252, Col 0)
function mx7(q) {
    try {
        return q()
    } catch (K) {
        return console.error(K), !1
    }
}
// @from(Ln 40259, Col 0)
async function DA6(q, K, _) {
    if (K = K || "", _ = _ || globalThis.crypto && globalThis.crypto.subtle || Sx7.SubtleCrypto, !_) throw Error("No SubtleCrypto implementation found");
    try {
        let z = await _.importKey("raw", lz1(K), {
                name: "AES-CBC",
                length: 128
            }, !0, ["encrypt", "decrypt"]),
            [Y, A] = q.split("."),
            O = await _.decrypt({
                name: "AES-CBC",
                iv: lz1(Y)
            }, z, lz1(A));
        return new TextDecoder().decode(O)
    } catch (z) {
        throw Error("Failed to decrypt")
    }
}
// @from(Ln 40277, Col 0)
function pU6(q) {
    if (typeof q === "string") return q;
    return JSON.stringify(q)
}
// @from(Ln 40282, Col 0)
function Jh(q) {
    if (typeof q === "number") q = q + "";
    if (!q || typeof q !== "string") q = "0";
    let K = q.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
    if (K.length === 3) K.push("~");
    return K.map((_) => _.match(/^[0-9]+$/) ? _.padStart(5, " ") : _).join("-")
}
// @from(Ln 40290, Col 0)
function Bx7() {
    let q;
    try {
        q = "1.6.1"
    } catch (K) {
        q = ""
    }
    return q
}
// @from(Ln 40300, Col 0)
function px7(q, K) {
    let _, z;
    try {
        _ = new URL(q), z = new URL(K)
    } catch (Y) {
        return console.error(`Unable to merge query strings: ${Y}`), K
    }
    return _.searchParams.forEach((Y, A) => {
        if (z.searchParams.has(A)) return;
        z.searchParams.set(A, Y)
    }), z.toString()
}
// @from(Ln 40313, Col 0)
function Rx7(q) {
    return typeof q === "object" && q !== null
}
// @from(Ln 40317, Col 0)
function bH8(q) {
    if (q.urlPatterns && q.variations.some((K) => Rx7(K) && ("urlRedirect" in K))) return "redirect";
    else if (q.variations.some((K) => Rx7(K) && (K.domMutations || ("js" in K) || ("css" in K)))) return "visual";
    return "unknown"
}
// @from(Ln 40322, Col 0)
async function IH8(q, K) {
    return new Promise((_) => {
        let z = !1,
            Y, A = (O) => {
                if (z) return;
                z = !0, Y && clearTimeout(Y), _(O || null)
            };
        if (K) Y = setTimeout(() => A(), K);
        q.then((O) => A(O)).catch(() => A())
    })
}
// @from(Ln 40333, Col 4)
Sx7
// @from(Ln 40333, Col 9)
lz1 = (q) => Uint8Array.from(atob(q), (K) => K.charCodeAt(0))
// @from(Ln 40334, Col 4)
FU6 = L(() => {
    Sx7 = {
        fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
        SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
        EventSource: globalThis.EventSource
    }
})
// @from(Ln 40342, Col 0)
function Ux7(q) {
    if (Object.assign(_v, q), !_v.backgroundSync) jU5()
}
// @from(Ln 40345, Col 0)
async function Qx7(q) {
    let {
        instance: K,
        timeout: _,
        skipCache: z,
        allowStale: Y,
        backgroundSync: A
    } = q;
    if (!A) _v.backgroundSync = !1;
    return AU5({
        instance: K,
        allowStale: Y,
        timeout: _,
        skipCache: z
    })
}
// @from(Ln 40362, Col 0)
function _U5(q) {
    let K = gU6(q),
        _ = Pf6.get(K) || new Set;
    _.add(q), Pf6.set(K, _)
}
// @from(Ln 40368, Col 0)
function dx7(q) {
    Pf6.forEach((K) => K.delete(q))
}
// @from(Ln 40372, Col 0)
function zU5() {
    Wf6.forEach((q) => {
        if (!q) return;
        q.state = "idle", az1(q)
    })
}
// @from(Ln 40379, Col 0)
function YU5() {
    Wf6.forEach((q) => {
        if (!q) return;
        if (q.state !== "idle") return;
        sz1(q)
    })
}
// @from(Ln 40386, Col 0)
async function gx7() {
    try {
        if (!HU.localStorage) return;
        await HU.localStorage.setItem(_v.cacheKey, JSON.stringify(Array.from(Dr.entries())))
    } catch (q) {}
}
// @from(Ln 40392, Col 0)
async function AU5(q) {
    let {
        instance: K,
        allowStale: _,
        timeout: z,
        skipCache: Y
    } = q, A = gU6(K), O = rz1(K), w = new Date, $ = new Date(w.getTime() - _v.maxAge + _v.staleTTL);
    await OU5();
    let j = !_v.disableCache && !Y ? Dr.get(O) : void 0;
    if (j && (_ || j.staleAt > w) && j.staleAt > $) {
        if (j.sse) Df6.add(A);
        if (j.staleAt < w) iz1(K);
        else oz1(K);
        return {
            data: j.data,
            success: !0,
            source: "cache"
        }
    } else return await IH8(iz1(K), z) || {
        data: null,
        success: !1,
        source: "timeout",
        error: Error("Timeout")
    }
}
// @from(Ln 40418, Col 0)
function gU6(q) {
    let [K, _] = q.getApiInfo();
    return `${K}||${_}`
}
// @from(Ln 40423, Col 0)
function rz1(q) {
    let K = gU6(q);
    if (!("isRemoteEval" in q) || !q.isRemoteEval()) return K;
    let _ = q.getAttributes(),
        z = q.getCacheKeyAttributes() || Object.keys(q.getAttributes()),
        Y = {};
    z.forEach((w) => {
        Y[w] = _[w]
    });
    let A = q.getForcedVariations(),
        O = q.getUrl();
    return `${K}||${JSON.stringify({ca:Y,fv:A,url:O})}`
}
// @from(Ln 40436, Col 0)
async function OU5() {
    if (Fx7) return;
    Fx7 = !0;
    try {
        if (HU.localStorage) {
            let q = await HU.localStorage.getItem(_v.cacheKey);
            if (!_v.disableCache && q) {
                let K = JSON.parse(q);
                if (K && Array.isArray(K)) K.forEach((_) => {
                    let [z, Y] = _;
                    Dr.set(z, {
                        ...Y,
                        staleAt: new Date(Y.staleAt)
                    })
                });
                cx7()
            }
        }
    } catch (q) {}
    if (!_v.disableIdleStreams) {
        let q = Mf6.startIdleListener();
        if (q) Mf6.stopIdleListener = q
    }
}
// @from(Ln 40461, Col 0)
function cx7() {
    let q = Array.from(Dr.entries()).map((_) => {
            let [z, Y] = _;
            return {
                key: z,
                staleAt: Y.staleAt.getTime()
            }
        }).sort((_, z) => _.staleAt - z.staleAt),
        K = Math.min(Math.max(0, Dr.size - _v.maxEntries), Dr.size);
    for (let _ = 0; _ < K; _++) Dr.delete(q[_].key)
}
// @from(Ln 40473, Col 0)
function lx7(q, K, _) {
    let z = _.dateUpdated || "",
        Y = new Date(Date.now() + _v.staleTTL),
        A = !_v.disableCache ? Dr.get(K) : void 0;
    if (A && z && A.version === z) {
        A.staleAt = Y, gx7();
        return
    }
    if (!_v.disableCache) Dr.set(K, {
        data: _,
        version: z,
        staleAt: Y,
        sse: Df6.has(q)
    }), cx7();
    gx7();
    let O = Pf6.get(q);
    O && O.forEach((w) => wU5(w, _))
}
// @from(Ln 40491, Col 0)
async function wU5(q, K) {
    await q.setPayload(K || q.getPayload())
}
// @from(Ln 40494, Col 0)
async function iz1(q) {
    let {
        apiHost: K,
        apiRequestHeaders: _
    } = q.getApiHosts(), z = q.getClientKey(), Y = "isRemoteEval" in q && q.isRemoteEval(), A = gU6(q), O = rz1(q), w = xH8.get(O);
    if (!w) w = (Y ? Mf6.fetchRemoteEvalCall({
        host: K,
        clientKey: z,
        payload: {
            attributes: q.getAttributes(),
            forcedVariations: q.getForcedVariations(),
            forcedFeatures: Array.from(q.getForcedFeatures().entries()),
            url: q.getUrl()
        },
        headers: _
    }) : Mf6.fetchFeaturesCall({
        host: K,
        clientKey: z,
        headers: _
    })).then((j) => {
        if (!j.ok) throw Error(`HTTP error: ${j.status}`);
        if (j.headers.get("x-sse-support") === "enabled") Df6.add(A);
        return j.json()
    }).then((j) => {
        return lx7(A, O, j), oz1(q), xH8.delete(O), {
            data: j,
            success: !0,
            source: "network"
        }
    }).catch((j) => {
        return xH8.delete(O), {
            data: null,
            source: "error",
            success: !1,
            error: j
        }
    }), xH8.set(O, w);
    return w
}
// @from(Ln 40534, Col 0)
function oz1(q) {
    let K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
        _ = gU6(q),
        z = rz1(q),
        {
            streamingHost: Y,
            streamingHostRequestHeaders: A
        } = q.getApiHosts(),
        O = q.getClientKey();
    if (K) Df6.add(_);
    if (_v.backgroundSync && Df6.has(_) && HU.EventSource) {
        if (Wf6.has(_)) return;
        let w = {
            src: null,
            host: Y,
            clientKey: O,
            headers: A,
            cb: ($) => {
                try {
                    if ($.type === "features-updated") {
                        let j = Pf6.get(_);
                        j && j.forEach((H) => {
                            iz1(H)
                        })
                    } else if ($.type === "features") {
                        let j = JSON.parse($.data);
                        lx7(_, z, j)
                    }
                    w.errors = 0
                } catch (j) {
                    nx7(w)
                }
            },
            errors: 0,
            state: "active"
        };
        Wf6.set(_, w), sz1(w)
    }
}
// @from(Ln 40574, Col 0)
function nx7(q) {
    if (q.state === "idle") return;
    if (q.errors++, q.errors > 3 || q.src && q.src.readyState === 2) {
        let K = Math.pow(3, q.errors - 3) * (1000 + Math.random() * 1000);
        az1(q), setTimeout(() => {
            if (["idle", "active"].includes(q.state)) return;
            sz1(q)
        }, Math.min(K, 300000))
    }
}
// @from(Ln 40585, Col 0)
function az1(q) {
    if (!q.src) return;
    if (q.src.onopen = null, q.src.onerror = null, q.src.close(), q.src = null, q.state === "active") q.state = "disabled"
}
// @from(Ln 40590, Col 0)
function sz1(q) {
    q.src = Mf6.eventSourceCall({
        host: q.host,
        clientKey: q.clientKey,
        headers: q.headers
    }), q.state = "active", q.src.addEventListener("features", q.cb), q.src.addEventListener("features-updated", q.cb), q.src.onerror = () => nx7(q), q.src.onopen = () => {
        q.errors = 0
    }
}
// @from(Ln 40600, Col 0)
function $U5(q, K) {
    az1(q), Wf6.delete(K)
}
// @from(Ln 40604, Col 0)
function jU5() {
    Df6.clear(), Wf6.forEach($U5), Pf6.clear(), Mf6.stopIdleListener()
}
// @from(Ln 40608, Col 0)
function uH8(q, K) {
    if (K.streaming) {
        if (!q.getClientKey()) throw Error("Must specify clientKey to enable streaming");
        if (K.payload) oz1(q, !0);
        _U5(q)
    }
}
// @from(Ln 40615, Col 4)
_v
// @from(Ln 40615, Col 8)
HU
// @from(Ln 40615, Col 12)
Mf6
// @from(Ln 40615, Col 17)
Pf6
// @from(Ln 40615, Col 22)
Fx7 = !1
// @from(Ln 40616, Col 4)
Dr
// @from(Ln 40616, Col 8)
xH8
// @from(Ln 40616, Col 13)
Wf6
// @from(Ln 40616, Col 18)
Df6
// @from(Ln 40617, Col 4)
ix7 = L(() => {
    FU6();
    _v = {
        staleTTL: 60000,
        maxAge: 14400000,
        cacheKey: "gbFeaturesCache",
        backgroundSync: !0,
        maxEntries: 10,
        disableIdleStreams: !1,
        idleStreamInterval: 20000,
        disableCache: !1
    }, HU = Cx7(), Mf6 = {
        fetchFeaturesCall: (q) => {
            let {
                host: K,
                clientKey: _,
                headers: z
            } = q;
            return HU.fetch(`${K}/api/features/${_}`, {
                headers: z
            })
        },
        fetchRemoteEvalCall: (q) => {
            let {
                host: K,
                clientKey: _,
                payload: z,
                headers: Y
            } = q, A = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...Y
                },
                body: JSON.stringify(z)
            };
            return HU.fetch(`${K}/api/eval/${_}`, A)
        },
        eventSourceCall: (q) => {
            let {
                host: K,
                clientKey: _,
                headers: z
            } = q;
            if (z) return new HU.EventSource(`${K}/sub/${_}`, {
                headers: z
            });
            return new HU.EventSource(`${K}/sub/${_}`)
        },
        startIdleListener: () => {
            let q;
            if (!(typeof window < "u" && typeof document < "u")) return;
            let _ = () => {
                if (document.visibilityState === "visible") window.clearTimeout(q), YU5();
                else if (document.visibilityState === "hidden") q = window.setTimeout(zU5, _v.idleStreamInterval)
            };
            return document.addEventListener("visibilitychange", _), () => document.removeEventListener("visibilitychange", _)
        },
        stopIdleListener: () => {}
    };
    try {
        if (globalThis.localStorage) HU.localStorage = globalThis.localStorage
    } catch (q) {}
    Pf6 = new Map, Dr = new Map, xH8 = new Map, Wf6 = new Map, Df6 = new Set
})
// @from(Ln 40683, Col 0)
function Z16(q, K, _) {
    _ = _ || {};
    for (let [z, Y] of Object.entries(K)) switch (z) {
        case "$or":
            if (!rx7(q, Y, _)) return !1;
            break;
        case "$nor":
            if (rx7(q, Y, _)) return !1;
            break;
        case "$and":
            if (!WU5(q, Y, _)) return !1;
            break;
        case "$not":
            if (Z16(q, Y, _)) return !1;
            break;
        default:
            if (!UU6(Y, HU5(q, z), _)) return !1
    }
    return !0
}
// @from(Ln 40704, Col 0)
function HU5(q, K) {
    let _ = K.split("."),
        z = q;
    for (let Y = 0; Y < _.length; Y++)
        if (z && typeof z === "object" && _[Y] in z) z = z[_[Y]];
        else return null;
    return z
}
// @from(Ln 40713, Col 0)
function JU5(q) {
    if (!tz1[q]) tz1[q] = new RegExp(q.replace(/([^\\])\//g, "$1\\/"));
    return tz1[q]
}
// @from(Ln 40718, Col 0)
function UU6(q, K, _) {
    if (typeof q === "string") return K + "" === q;
    if (typeof q === "number") return K * 1 === q;
    if (typeof q === "boolean") return K !== null && !!K === q;
    if (q === null) return K === null;
    if (Array.isArray(q) || !ox7(q)) return JSON.stringify(K) === JSON.stringify(q);
    for (let z in q)
        if (!PU5(z, K, q[z], _)) return !1;
    return !0
}
// @from(Ln 40729, Col 0)
function ox7(q) {
    let K = Object.keys(q);
    return K.length > 0 && K.filter((_) => _[0] === "$").length === K.length
}
// @from(Ln 40734, Col 0)
function XU5(q) {
    if (q === null) return "null";
    if (Array.isArray(q)) return "array";
    let K = typeof q;
    if (["string", "number", "boolean", "object", "undefined"].includes(K)) return K;
    return "unknown"
}
// @from(Ln 40742, Col 0)
function MU5(q, K, _) {
    if (!Array.isArray(q)) return !1;
    let z = ox7(K) ? (Y) => UU6(K, Y, _) : (Y) => Z16(Y, K, _);
    for (let Y = 0; Y < q.length; Y++)
        if (q[Y] && z(q[Y])) return !0;
    return !1
}
// @from(Ln 40750, Col 0)
function mH8(q, K) {
    if (Array.isArray(q)) return q.some((_) => K.includes(_));
    return K.includes(q)
}
// @from(Ln 40755, Col 0)
function PU5(q, K, _, z) {
    switch (q) {
        case "$veq":
            return Jh(K) === Jh(_);
        case "$vne":
            return Jh(K) !== Jh(_);
        case "$vgt":
            return Jh(K) > Jh(_);
        case "$vgte":
            return Jh(K) >= Jh(_);
        case "$vlt":
            return Jh(K) < Jh(_);
        case "$vlte":
            return Jh(K) <= Jh(_);
        case "$eq":
            return K === _;
        case "$ne":
            return K !== _;
        case "$lt":
            return K < _;
        case "$lte":
            return K <= _;
        case "$gt":
            return K > _;
        case "$gte":
            return K >= _;
        case "$exists":
            return _ ? K != null : K == null;
        case "$in":
            if (!Array.isArray(_)) return !1;
            return mH8(K, _);
        case "$inGroup":
            return mH8(K, z[_] || []);
        case "$notInGroup":
            return !mH8(K, z[_] || []);
        case "$nin":
            if (!Array.isArray(_)) return !1;
            return !mH8(K, _);
        case "$not":
            return !UU6(_, K, z);
        case "$size":
            if (!Array.isArray(K)) return !1;
            return UU6(_, K.length, z);
        case "$elemMatch":
            return MU5(K, _, z);
        case "$all":
            if (!Array.isArray(K)) return !1;
            for (let Y = 0; Y < _.length; Y++) {
                let A = !1;
                for (let O = 0; O < K.length; O++)
                    if (UU6(_[Y], K[O], z)) {
                        A = !0;
                        break
                    } if (!A) return !1
            }
            return !0;
        case "$regex":
            try {
                return JU5(_).test(K)
            } catch (Y) {
                return !1
            }
        case "$type":
            return XU5(K) === _;
        default:
            return console.error("Unknown operator: " + q), !1
    }
}
// @from(Ln 40824, Col 0)
function rx7(q, K, _) {
    if (!K.length) return !0;
    for (let z = 0; z < K.length; z++)
        if (Z16(q, K[z], _)) return !0;
    return !1
}
// @from(Ln 40831, Col 0)
function WU5(q, K, _) {
    for (let z = 0; z < K.length; z++)
        if (!Z16(q, K[z], _)) return !1;
    return !0
}
// @from(Ln 40836, Col 4)
tz1
// @from(Ln 40837, Col 4)
ax7 = L(() => {
    FU6();
    tz1 = {}
})
// @from(Ln 40842, Col 0)
function fU5(q) {
    let K = new Map;
    if (q.global.forcedFeatureValues) q.global.forcedFeatureValues.forEach((_, z) => K.set(z, _));
    if (q.user.forcedFeatureValues) q.user.forcedFeatureValues.forEach((_, z) => K.set(z, _));
    return K
}
// @from(Ln 40849, Col 0)
function GU5(q) {
    if (q.global.forcedVariations && q.user.forcedVariations) return {
        ...q.global.forcedVariations,
        ...q.user.forcedVariations
    };
    else if (q.global.forcedVariations) return q.global.forcedVariations;
    else if (q.user.forcedVariations) return q.user.forcedVariations;
    else return {}
}
// @from(Ln 40858, Col 0)
async function Zf6(q) {
    try {
        await q()
    } catch (K) {}
}
// @from(Ln 40864, Col 0)
function sx7(q, K, _) {
    if (q.user.trackedExperiments) {
        let Y = FH8(K, _);
        if (q.user.trackedExperiments.has(Y)) return [];
        q.user.trackedExperiments.add(Y)
    }
    if (q.user.enableDevMode && q.user.devLogs) q.user.devLogs.push({
        experiment: K,
        result: _,
        timestamp: Date.now().toString(),
        logType: "experiment"
    });
    let z = [];
    if (q.global.trackingCallback) {
        let Y = q.global.trackingCallback;
        z.push(Zf6(() => Y(K, _, q.user)))
    }
    if (q.user.trackingCallback) {
        let Y = q.user.trackingCallback;
        z.push(Zf6(() => Y(K, _)))
    }
    if (q.global.eventLogger) {
        let Y = q.global.eventLogger;
        z.push(Zf6(() => Y(ZU5, {
            experimentId: K.key,
            variationId: _.key,
            hashAttribute: _.hashAttribute,
            hashValue: _.hashValue
        }, q.user)))
    }
    return z
}
// @from(Ln 40897, Col 0)
function vU5(q, K, _) {
    if (q.user.trackedFeatureUsage) {
        let z = JSON.stringify(_.value);
        if (q.user.trackedFeatureUsage[K] === z) return;
        if (q.user.trackedFeatureUsage[K] = z, q.user.enableDevMode && q.user.devLogs) q.user.devLogs.push({
            featureKey: K,
            result: _,
            timestamp: Date.now().toString(),
            logType: "feature"
        })
    }
    if (q.global.onFeatureUsage) {
        let z = q.global.onFeatureUsage;
        Zf6(() => z(K, _, q.user))
    }
    if (q.user.onFeatureUsage) {
        let z = q.user.onFeatureUsage;
        Zf6(() => z(K, _))
    }
    if (q.global.eventLogger) {
        let z = q.global.eventLogger;
        Zf6(() => z(DU5, {
            feature: K,
            source: _.source,
            value: _.value,
            ruleId: _.source === "defaultValue" ? "$default" : _.ruleId || "",
            variationId: _.experimentResult ? _.experimentResult.key : ""
        }, q.user))
    }
}
// @from(Ln 40928, Col 0)
function BH8(q, K) {
    if (K.stack.evaluatedFeatures.has(q)) return f16(K, q, null, "cyclicPrerequisite");
    K.stack.evaluatedFeatures.add(q), K.stack.id = q;
    let _ = fU5(K);
    if (_.has(q)) return f16(K, q, _.get(q), "override");
    if (!K.global.features || !K.global.features[q]) return f16(K, q, null, "unknownFeature");
    let z = K.global.features[q];
    if (z.rules) {
        let Y = new Set(K.stack.evaluatedFeatures);
        q: for (let A of z.rules) {
            if (A.parentConditions)
                for (let $ of A.parentConditions) {
                    K.stack.evaluatedFeatures = new Set(Y);
                    let j = BH8($.id, K);
                    if (j.source === "cyclicPrerequisite") return f16(K, q, null, "cyclicPrerequisite");
                    let H = {
                        value: j.value
                    };
                    if (!Z16(H, $.condition || {})) {
                        if ($.gate) return f16(K, q, null, "prerequisite");
                        continue q
                    }
                }
            if (A.filters && qu7(A.filters, K)) continue;
            if ("force" in A) {
                if (A.condition && !ex7(A.condition, K)) continue;
                if (!TU5(K, A.seed || q, A.hashAttribute, K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing ? A.fallbackAttribute : void 0, A.range, A.coverage, A.hashVersion)) continue;
                if (A.tracks) A.tracks.forEach(($) => {
                    if (!sx7(K, $.experiment, $.result).length && K.global.saveDeferredTrack) K.global.saveDeferredTrack({
                        experiment: $.experiment,
                        result: $.result
                    })
                });
                return f16(K, q, A.force, "force", A.id)
            }
            if (!A.variations) continue;
            let O = {
                variations: A.variations,
                key: A.key || q
            };
            if ("coverage" in A) O.coverage = A.coverage;
            if (A.weights) O.weights = A.weights;
            if (A.hashAttribute) O.hashAttribute = A.hashAttribute;
            if (A.fallbackAttribute) O.fallbackAttribute = A.fallbackAttribute;
            if (A.disableStickyBucketing) O.disableStickyBucketing = A.disableStickyBucketing;
            if (A.bucketVersion !== void 0) O.bucketVersion = A.bucketVersion;
            if (A.minBucketVersion !== void 0) O.minBucketVersion = A.minBucketVersion;
            if (A.namespace) O.namespace = A.namespace;
            if (A.meta) O.meta = A.meta;
            if (A.ranges) O.ranges = A.ranges;
            if (A.name) O.name = A.name;
            if (A.phase) O.phase = A.phase;
            if (A.seed) O.seed = A.seed;
            if (A.hashVersion) O.hashVersion = A.hashVersion;
            if (A.filters) O.filters = A.filters;
            if (A.condition) O.condition = A.condition;
            let {
                result: w
            } = pH8(O, q, K);
            if (K.global.onExperimentEval && K.global.onExperimentEval(O, w), w.inExperiment && !w.passthrough) return f16(K, q, w.value, "experiment", A.id, O, w)
        }
    }
    return f16(K, q, z.defaultValue === void 0 ? null : z.defaultValue, "defaultValue")
}
// @from(Ln 40993, Col 0)
function pH8(q, K, _) {
    let z = q.key,
        Y = q.variations.length;
    if (Y < 2) return {
        result: cj(_, q, -1, !1, K)
    };
    if (_.global.enabled === !1 || _.user.enabled === !1) return {
        result: cj(_, q, -1, !1, K)
    };
    if (q = VU5(q, _), q.urlPatterns && !CH8(_.user.url || "", q.urlPatterns)) return {
        result: cj(_, q, -1, !1, K)
    };
    let A = ux7(z, _.user.url || "", Y);
    if (A !== null) return {
        result: cj(_, q, A, !1, K)
    };
    let O = GU5(_);
    if (z in O) {
        let D = O[z];
        return {
            result: cj(_, q, D, !1, K)
        }
    }
    if (q.status === "draft" || q.active === !1) return {
        result: cj(_, q, -1, !1, K)
    };
    let {
        hashAttribute: w,
        hashValue: $
    } = ZA6(_, q.hashAttribute, _.user.saveStickyBucketAssignmentDoc && !q.disableStickyBucketing ? q.fallbackAttribute : void 0);
    if (!$) return {
        result: cj(_, q, -1, !1, K)
    };
    let j = -1,
        H = !1,
        J = !1;
    if (_.user.saveStickyBucketAssignmentDoc && !q.disableStickyBucketing) {
        let {
            variation: D,
            versionIsBlocked: Z
        } = EU5({
            ctx: _,
            expKey: q.key,
            expBucketVersion: q.bucketVersion,
            expHashAttribute: q.hashAttribute,
            expFallbackAttribute: q.fallbackAttribute,
            expMinBucketVersion: q.minBucketVersion,
            expMeta: q.meta
        });
        H = D >= 0, j = D, J = !!Z
    }
    if (!H) {
        if (q.filters) {
            if (qu7(q.filters, _)) return {
                result: cj(_, q, -1, !1, K)
            }
        } else if (q.namespace && !bx7($, q.namespace)) return {
            result: cj(_, q, -1, !1, K)
        };
        if (q.include && !mx7(q.include)) return {
            result: cj(_, q, -1, !1, K)
        };
        if (q.condition && !ex7(q.condition, _)) return {
            result: cj(_, q, -1, !1, K)
        };
        if (q.parentConditions) {
            let D = new Set(_.stack.evaluatedFeatures);
            for (let Z of q.parentConditions) {
                _.stack.evaluatedFeatures = new Set(D);
                let G = BH8(Z.id, _);
                if (G.source === "cyclicPrerequisite") return {
                    result: cj(_, q, -1, !1, K)
                };
                let f = {
                    value: G.value
                };
                if (!Z16(f, Z.condition || {})) return {
                    result: cj(_, q, -1, !1, K)
                }
            }
        }
        if (q.groups && !NU5(q.groups, _)) return {
            result: cj(_, q, -1, !1, K)
        }
    }
    if (q.url && !kU5(q.url, _)) return {
        result: cj(_, q, -1, !1, K)
    };
    let X = BU6(q.seed || z, $, q.hashVersion || 1);
    if (X === null) return {
        result: cj(_, q, -1, !1, K)
    };
    if (!H) {
        let D = q.ranges || xx7(Y, q.coverage === void 0 ? 1 : q.coverage, q.weights);
        j = Ix7(X, D)
    }
    if (J) return {
        result: cj(_, q, -1, !1, K, void 0, !0)
    };
    if (j < 0) return {
        result: cj(_, q, -1, !1, K)
    };
    if ("force" in q) return {
        result: cj(_, q, q.force === void 0 ? -1 : q.force, !1, K)
    };
    if (_.global.qaMode || _.user.qaMode) return {
        result: cj(_, q, -1, !1, K)
    };
    if (q.status === "stopped") return {
        result: cj(_, q, -1, !1, K)
    };
    let M = cj(_, q, j, !0, K, X, H);
    if (_.user.saveStickyBucketAssignmentDoc && !q.disableStickyBucketing) {
        let {
            changed: D,
            key: Z,
            doc: G
        } = LU5(_, w, pU6($), {
            [ez1(q.key, q.bucketVersion)]: M.key
        });
        if (D) _.user.stickyBucketAssignmentDocs = _.user.stickyBucketAssignmentDocs || {}, _.user.stickyBucketAssignmentDocs[Z] = G, _.user.saveStickyBucketAssignmentDoc(G)
    }
    let P = sx7(_, q, M);
    if (P.length === 0 && _.global.saveDeferredTrack) _.global.saveDeferredTrack({
        experiment: q,
        result: M
    });
    let W = !P.length ? void 0 : P.length === 1 ? P[0] : Promise.all(P).then(() => {});
    return "changeId" in q && q.changeId && _.global.recordChangeId && _.global.recordChangeId(q.changeId), {
        result: M,
        trackingCall: W
    }
}
// @from(Ln 41127, Col 0)
function f16(q, K, _, z, Y, A, O) {
    let w = {
        value: _,
        on: !!_,
        off: !_,
        source: z,
        ruleId: Y || ""
    };
    if (A) w.experiment = A;
    if (O) w.experimentResult = O;
    if (z !== "override") vU5(q, K, w);
    return w
}
// @from(Ln 41141, Col 0)
function tx7(q) {
    return {
        ...q.user.attributes,
        ...q.user.attributeOverrides
    }
}
// @from(Ln 41148, Col 0)
function ex7(q, K) {
    return Z16(tx7(K), q, K.global.savedGroups || {})
}
// @from(Ln 41152, Col 0)
function qu7(q, K) {
    return q.some((_) => {
        let {
            hashValue: z
        } = ZA6(K, _.attribute);
        if (!z) return !0;
        let Y = BU6(_.seed, z, _.hashVersion || 2);
        if (Y === null) return !0;
        return !_.ranges.some((A) => SH8(Y, A))
    })
}
// @from(Ln 41164, Col 0)
function TU5(q, K, _, z, Y, A, O) {
    if (!Y && A === void 0) return !0;
    if (!Y && A === 0) return !1;
    let {
        hashValue: w
    } = ZA6(q, _, z);
    if (!w) return !1;
    let $ = BU6(K, w, O || 1);
    if ($ === null) return !1;
    return Y ? SH8($, Y) : A !== void 0 ? $ <= A : !0
}
// @from(Ln 41176, Col 0)
function cj(q, K, _, z, Y, A, O) {
    let w = !0;
    if (_ < 0 || _ >= K.variations.length) _ = 0, w = !1;
    let {
        hashAttribute: $,
        hashValue: j
    } = ZA6(q, K.hashAttribute, q.user.saveStickyBucketAssignmentDoc && !K.disableStickyBucketing ? K.fallbackAttribute : void 0), H = K.meta ? K.meta[_] : {}, J = {
        key: H.key || "" + _,
        featureId: Y,
        inExperiment: w,
        hashUsed: z,
        variationId: _,
        value: K.variations[_],
        hashAttribute: $,
        hashValue: j,
        stickyBucketUsed: !!O
    };
    if (H.name) J.name = H.name;
    if (A !== void 0) J.bucket = A;
    if (H.passthrough) J.passthrough = H.passthrough;
    return J
}
// @from(Ln 41199, Col 0)
function VU5(q, K) {
    let _ = q.key,
        z = K.global.overrides;
    if (z && z[_]) {
        if (q = Object.assign({}, q, z[_]), typeof q.url === "string") q.url = nz1(q.url)
    }
    return q
}
// @from(Ln 41208, Col 0)
function ZA6(q, K, _) {
    let z = K || "id",
        Y = "",
        A = tx7(q);
    if (A[z]) Y = A[z];
    if (!Y && _) {
        if (A[_]) Y = A[_];
        if (Y) z = _
    }
    return {
        hashAttribute: z,
        hashValue: Y
    }
}
// @from(Ln 41223, Col 0)
function kU5(q, K) {
    let _ = K.user.url;
    if (!_) return !1;
    let z = _.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
    if (q.test(_)) return !0;
    if (q.test(z)) return !0;
    return !1
}
// @from(Ln 41232, Col 0)
function NU5(q, K) {
    let _ = K.global.groups || {};
    for (let z = 0; z < q.length; z++)
        if (_[q[z]]) return !0;
    return !1
}
// @from(Ln 41239, Col 0)
function EU5(q) {
    let {
        ctx: K,
        expKey: _,
        expBucketVersion: z,
        expHashAttribute: Y,
        expFallbackAttribute: A,
        expMinBucketVersion: O,
        expMeta: w
    } = q;
    z = z || 0, O = O || 0, Y = Y || "id", w = w || [];
    let $ = ez1(_, z),
        j = yU5(K, Y, A);
    if (O > 0)
        for (let X = 0; X <= O; X++) {
            let M = ez1(_, X);
            if (j[M] !== void 0) return {
                variation: -1,
                versionIsBlocked: !0
            }
        }
    let H = j[$];
    if (H === void 0) return {
        variation: -1
    };
    let J = w.findIndex((X) => X.key === H);
    if (J < 0) return {
        variation: -1
    };
    return {
        variation: J
    }
}
// @from(Ln 41273, Col 0)
function ez1(q, K) {
    return K = K || 0, `${q}__${K}`
}
// @from(Ln 41277, Col 0)
function qY1(q, K) {
    return `${q}||${K}`
}
// @from(Ln 41281, Col 0)
function yU5(q, K, _) {
    if (!q.user.stickyBucketAssignmentDocs) return {};
    let {
        hashAttribute: z,
        hashValue: Y
    } = ZA6(q, K), A = qY1(z, pU6(Y)), {
        hashAttribute: O,
        hashValue: w
    } = ZA6(q, _), $ = w ? qY1(O, pU6(w)) : null, j = {};
    if ($ && q.user.stickyBucketAssignmentDocs[$]) Object.assign(j, q.user.stickyBucketAssignmentDocs[$].assignments || {});
    if (q.user.stickyBucketAssignmentDocs[A]) Object.assign(j, q.user.stickyBucketAssignmentDocs[A].assignments || {});
    return j
}
// @from(Ln 41295, Col 0)
function LU5(q, K, _, z) {
    let Y = qY1(K, _),
        A = q.user.stickyBucketAssignmentDocs && q.user.stickyBucketAssignmentDocs[Y] ? q.user.stickyBucketAssignmentDocs[Y].assignments || {} : {},
        O = {
            ...A,
            ...z
        },
        w = JSON.stringify(A) !== JSON.stringify(O);
    return {
        key: Y,
        doc: {
            attributeName: K,
            attributeValue: _,
            assignments: O
        },
        changed: w
    }
}
// @from(Ln 41314, Col 0)
function hU5(q, K) {
    let _ = new Set,
        z = K && K.features ? K.features : q.global.features || {},
        Y = K && K.experiments ? K.experiments : q.global.experiments || [];
    return Object.keys(z).forEach((A) => {
        let O = z[A];
        if (O.rules) {
            for (let w of O.rules)
                if (w.variations) {
                    if (_.add(w.hashAttribute || "id"), w.fallbackAttribute) _.add(w.fallbackAttribute)
                }
        }
    }), Y.map((A) => {
        if (_.add(A.hashAttribute || "id"), A.fallbackAttribute) _.add(A.fallbackAttribute)
    }), Array.from(_)
}
// @from(Ln 41330, Col 0)
async function Ku7(q, K, _) {
    let z = KY1(q, _);
    return K.getAllAssignments(z)
}
// @from(Ln 41335, Col 0)
function KY1(q, K) {
    let _ = {};
    return hU5(q, K).forEach((Y) => {
        let {
            hashValue: A
        } = ZA6(q, Y);
        _[Y] = pU6(A)
    }), _
}
// @from(Ln 41344, Col 0)
async function _u7(q, K, _) {
    if (q = {
            ...q
        }, q.encryptedFeatures) {
        try {
            q.features = JSON.parse(await DA6(q.encryptedFeatures, K, _))
        } catch (z) {
            console.error(z)
        }
        delete q.encryptedFeatures
    }
    if (q.encryptedExperiments) {
        try {
            q.experiments = JSON.parse(await DA6(q.encryptedExperiments, K, _))
        } catch (z) {
            console.error(z)
        }
        delete q.encryptedExperiments
    }
    if (q.encryptedSavedGroups) {
        try {
            q.savedGroups = JSON.parse(await DA6(q.encryptedSavedGroups, K, _))
        } catch (z) {
            console.error(z)
        }
        delete q.encryptedSavedGroups
    }
    return q
}
// @from(Ln 41374, Col 0)
function zu7(q) {
    let K = q.apiHost || "https://cdn.growthbook.io";
    return {
        apiHost: K.replace(/\/*$/, ""),
        streamingHost: (q.streamingHost || K).replace(/\/*$/, ""),
        apiRequestHeaders: q.apiHostRequestHeaders,
        streamingHostRequestHeaders: q.streamingHostRequestHeaders
    }
}
// @from(Ln 41384, Col 0)
function FH8(q, K) {
    return K.hashAttribute + K.hashValue + q.key + K.variationId
}
// @from(Ln 41387, Col 4)
DU5 = "Feature Evaluated"
// @from(Ln 41388, Col 4)
ZU5 = "Experiment Viewed"
// @from(Ln 41389, Col 4)
Yu7 = L(() => {
    ax7();
    FU6()
})
// @from(Ln 41393, Col 0)
class gH8 {
    constructor(q) {
        if (q = q || {}, this.version = RU5, this._options = this.context = q, this._renderer = q.renderer || null, this._trackedExperiments = new Set, this._completedChangeIds = new Set, this._trackedFeatures = {}, this.debug = !!q.debug, this._subscriptions = new Set, this.ready = !1, this._assigned = new Map, this._activeAutoExperiments = new Map, this._triggeredExpKeys = new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = new Map, this._autoExperimentsAllowed = !q.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), q.remoteEval) {
            if (q.decryptionKey) throw Error("Encryption is not available for remoteEval");
            if (!q.clientKey) throw Error("Missing clientKey");
            let K = !1;
            try {
                K = !!new URL(q.apiHost || "").hostname.match(/growthbook\.io$/i)
            } catch (_) {}
            if (K) throw Error("Cannot use remoteEval on GrowthBook Cloud")
        } else if (q.cacheKeyAttributes) throw Error("cacheKeyAttributes are only used for remoteEval");
        if (q.stickyBucketService) {
            let K = q.stickyBucketService;
            this._saveStickyBucketAssignmentDoc = (_) => {
                return K.saveAssignments(_)
            }
        }
        if (q.plugins)
            for (let K of q.plugins) K(this);
        if (q.features) this.ready = !0;
        if (ff6 && q.enableDevMode) window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
        if (q.experiments) this.ready = !0, this._updateAllAutoExperiments();
        if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
            for (let K in this._options.stickyBucketAssignmentDocs) {
                let _ = this._options.stickyBucketAssignmentDocs[K];
                if (_) this._options.stickyBucketService.saveAssignments(_).catch(() => {})
            }
        if (this.ready) this.refreshStickyBuckets(this.getPayload())
    }
    async setPayload(q) {
        this._payload = q;
        let K = await _u7(q, this._options.decryptionKey);
        if (this._decryptedPayload = K, await this.refreshStickyBuckets(K), K.features) this._options.features = K.features;
        if (K.savedGroups) this._options.savedGroups = K.savedGroups;
        if (K.experiments) this._options.experiments = K.experiments, this._updateAllAutoExperiments();
        this.ready = !0, this._render()
    }
    initSync(q) {
        this._initialized = !0;
        let K = q.payload;
        if (K.encryptedExperiments || K.encryptedFeatures) throw Error("initSync does not support encrypted payloads");
        if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs) this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, K);
        if (this._payload = K, this._decryptedPayload = K, K.features) this._options.features = K.features;
        if (K.experiments) this._options.experiments = K.experiments, this._updateAllAutoExperiments();
        return this.ready = !0, uH8(this, q), this
    }
    async init(q) {
        if (this._initialized = !0, q = q || {}, q.cacheSettings) Ux7(q.cacheSettings);
        if (q.payload) return await this.setPayload(q.payload), uH8(this, q), {
            success: !0,
            source: "init"
        };
        else {
            let {
                data: K,
                ..._
            } = await this._refresh({
                ...q,
                allowStale: !0
            });
            return uH8(this, q), await this.setPayload(K || {}), _
        }
    }
    async loadFeatures(q) {
        q = q || {}, await this.init({
            skipCache: q.skipCache,
            timeout: q.timeout,
            streaming: (this._options.backgroundSync ?? !0) && (q.autoRefresh || this._options.subscribeToChanges)
        })
    }
    async refreshFeatures(q) {
        let K = await this._refresh({
            ...q || {},
            allowStale: !1
        });
        if (K.data) await this.setPayload(K.data)
    }
    getApiInfo() {
        return [this.getApiHosts().apiHost, this.getClientKey()]
    }
    getApiHosts() {
        return zu7(this._options)
    }
    getClientKey() {
        return this._options.clientKey || ""
    }
    getPayload() {
        return this._payload || {
            features: this.getFeatures(),
            experiments: this.getExperiments()
        }
    }
    getDecryptedPayload() {
        return this._decryptedPayload || this.getPayload()
    }
    isRemoteEval() {
        return this._options.remoteEval || !1
    }
    getCacheKeyAttributes() {
        return this._options.cacheKeyAttributes
    }
    async _refresh(q) {
        let {
            timeout: K,
            skipCache: _,
            allowStale: z,
            streaming: Y
        } = q;
        if (!this._options.clientKey) throw Error("Missing clientKey");
        return Qx7({
            instance: this,
            timeout: K,
            skipCache: _ || this._options.disableCache,
            allowStale: z,
            backgroundSync: Y ?? this._options.backgroundSync ?? !0
        })
    }
    _render() {
        if (this._renderer) try {
            this._renderer()
        } catch (q) {
            console.error("Failed to render", q)
        }
    }
    setFeatures(q) {
        this._options.features = q, this.ready = !0, this._render()
    }
    async setEncryptedFeatures(q, K, _) {
        let z = await DA6(q, K || this._options.decryptionKey, _);
        this.setFeatures(JSON.parse(z))
    }
    setExperiments(q) {
        this._options.experiments = q, this.ready = !0, this._updateAllAutoExperiments()
    }
    async setEncryptedExperiments(q, K, _) {
        let z = await DA6(q, K || this._options.decryptionKey, _);
        this.setExperiments(JSON.parse(z))
    }
    async setAttributes(q) {
        if (this._options.attributes = q, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async updateAttributes(q) {
        return this.setAttributes({
            ...this._options.attributes,
            ...q
        })
    }
    async setAttributeOverrides(q) {
        if (this._options.attributeOverrides = q, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async setForcedVariations(q) {
        if (this._options.forcedVariations = q || {}, this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    setForcedFeatures(q) {
        this._options.forcedFeatureValues = q, this._render()
    }
    async setURL(q) {
        if (q === this._options.url) return;
        if (this._options.url = q, this._redirectedUrl = "", this._options.remoteEval) {
            await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
            return
        }
        this._updateAllAutoExperiments(!0)
    }
    getAttributes() {
        return {
            ...this._options.attributes,
            ...this._options.attributeOverrides
        }
    }
    getForcedVariations() {
        return this._options.forcedVariations || {}
    }
    getForcedFeatures() {
        return this._options.forcedFeatureValues || new Map
    }
    getStickyBucketAssignmentDocs() {
        return this._options.stickyBucketAssignmentDocs || {}
    }
    getUrl() {
        return this._options.url || ""
    }
    getFeatures() {
        return this._options.features || {}
    }
    getExperiments() {
        return this._options.experiments || []
    }
    getCompletedChangeIds() {
        return Array.from(this._completedChangeIds)
    }
    subscribe(q) {
        return this._subscriptions.add(q), () => {
            this._subscriptions.delete(q)
        }
    }
    async _refreshForRemoteEval() {
        if (!this._options.remoteEval) return;
        if (!this._initialized) return;
        let q = await this._refresh({
            allowStale: !1
        });
        if (q.data) await this.setPayload(q.data)
    }
    getAllResults() {
        return new Map(this._assigned)
    }
    onDestroy(q) {
        this._destroyCallbacks.push(q)
    }
    isDestroyed() {
        return !!this._destroyed
    }
    destroy() {
        if (this._destroyed = !0, this._destroyCallbacks.forEach((q) => {
                try {
                    q()
                } catch (K) {
                    console.error(K)
                }
            }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, dx7(this), this.logs = [], ff6 && window._growthbook === this) delete window._growthbook;
        this._activeAutoExperiments.forEach((q) => {
            q.undo()
        }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear()
    }
    setRenderer(q) {
        this._renderer = q
    }
    forceVariation(q, K) {
        if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[q] = K, this._options.remoteEval) {
            this._refreshForRemoteEval();
            return
        }
        this._updateAllAutoExperiments(), this._render()
    }
    run(q) {
        let {
            result: K
        } = pH8(q, null, this._getEvalContext());
        return this._fireSubscriptions(q, K), K
    }
    triggerExperiment(q) {
        if (this._triggeredExpKeys.add(q), !this._options.experiments) return null;
        return this._options.experiments.filter((_) => _.key === q).map((_) => {
            return this._runAutoExperiment(_)
        }).filter((_) => _ !== null)
    }
    triggerAutoExperiments() {
        this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0)
    }
    _getEvalContext() {
        return {
            user: this._getUserContext(),
            global: this._getGlobalContext(),
            stack: {
                evaluatedFeatures: new Set
            }
        }
    }
    _getUserContext() {
        return {
            attributes: this._options.user ? {
                ...this._options.user,
                ...this._options.attributes
            } : this._options.attributes,
            enableDevMode: this._options.enableDevMode,
            blockedChangeIds: this._options.blockedChangeIds,
            stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
            url: this._getContextUrl(),
            forcedVariations: this._options.forcedVariations,
            forcedFeatureValues: this._options.forcedFeatureValues,
            attributeOverrides: this._options.attributeOverrides,
            saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
            trackingCallback: this._options.trackingCallback,
            onFeatureUsage: this._options.onFeatureUsage,
            devLogs: this.logs,
            trackedExperiments: this._trackedExperiments,
            trackedFeatureUsage: this._trackedFeatures
        }
    }
    _getGlobalContext() {
        return {
            features: this._options.features,
            experiments: this._options.experiments,
            log: this.log,
            enabled: this._options.enabled,
            qaMode: this._options.qaMode,
            savedGroups: this._options.savedGroups,
            groups: this._options.groups,
            overrides: this._options.overrides,
            onExperimentEval: this._subscriptions.size > 0 ? this._fireSubscriptions : void 0,
            recordChangeId: this._recordChangedId,
            saveDeferredTrack: this._saveDeferredTrack,
            eventLogger: this._options.eventLogger
        }
    }
    _runAutoExperiment(q, K) {
        let _ = this._activeAutoExperiments.get(q);
        if (q.manual && !this._triggeredExpKeys.has(q.key) && !_) return null;
        let z = this._isAutoExperimentBlockedByContext(q),
            Y, A;
        if (z) Y = cj(this._getEvalContext(), q, -1, !1, "");
        else({
            result: Y,
            trackingCall: A
        } = pH8(q, null, this._getEvalContext())), this._fireSubscriptions(q, Y);
        let O = JSON.stringify(Y.value);
        if (!K && Y.inExperiment && _ && _.valueHash === O) return Y;
        if (_) this._undoActiveAutoExperiment(q);
        if (Y.inExperiment) {
            let w = bH8(q);
            if (w === "redirect" && Y.value.urlRedirect && q.urlPatterns) {
                let $ = q.persistQueryString ? px7(this._getContextUrl(), Y.value.urlRedirect) : Y.value.urlRedirect;
                if (CH8($, q.urlPatterns)) return this.log("Skipping redirect because original URL matches redirect URL", {
                    id: q.key
                }), Y;
                this._redirectedUrl = $;
                let {
                    navigate: j,
                    delay: H
                } = this._getNavigateFunction();
                if (j)
                    if (ff6) Promise.all([...A ? [IH8(A, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((J) => window.setTimeout(J, this._options.navigateDelay ?? H))]).then(() => {
                        try {
                            j($)
                        } catch (J) {
                            console.error(J)
                        }
                    });
                    else try {
                        j($)
                    } catch (J) {
                        console.error(J)
                    }
            } else if (w === "visual") {
                let $ = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(Y.value) : this._applyDOMChanges(Y.value);
                if ($) this._activeAutoExperiments.set(q, {
                    undo: $,
                    valueHash: O
                })
            }
        }
        return Y
    }
    _undoActiveAutoExperiment(q) {
        let K = this._activeAutoExperiments.get(q);
        if (K) K.undo(), this._activeAutoExperiments.delete(q)
    }
    _updateAllAutoExperiments(q) {
        if (!this._autoExperimentsAllowed) return;
        let K = this._options.experiments || [],
            _ = new Set(K);
        this._activeAutoExperiments.forEach((z, Y) => {
            if (!_.has(Y)) z.undo(), this._activeAutoExperiments.delete(Y)
        });
        for (let z of K) {
            let Y = this._runAutoExperiment(z, q);
            if (Y !== null && Y !== void 0 && Y.inExperiment && bH8(z) === "redirect") break
        }
    }
    _fireSubscriptions(q, K) {
        let _ = q.key,
            z = this._assigned.get(_);
        if (!z || z.result.inExperiment !== K.inExperiment || z.result.variationId !== K.variationId) this._assigned.set(_, {
            experiment: q,
            result: K
        }), this._subscriptions.forEach((Y) => {
            try {
                Y(q, K)
            } catch (A) {
                console.error(A)
            }
        })
    }
    _recordChangedId(q) {
        this._completedChangeIds.add(q)
    }
    isOn(q) {
        return this.evalFeature(q).on
    }
    isOff(q) {
        return this.evalFeature(q).off
    }
    getFeatureValue(q, K) {
        let _ = this.evalFeature(q).value;
        return _ === null ? K : _
    }
    feature(q) {
        return this.evalFeature(q)
    }
    evalFeature(q) {
        return BH8(q, this._getEvalContext())
    }
    log(q, K) {
        if (!this.debug) return;
        if (this._options.log) this._options.log(q, K);
        else console.log(q, K)
    }
    getDeferredTrackingCalls() {
        return Array.from(this._deferredTrackingCalls.values())
    }
    setDeferredTrackingCalls(q) {
        this._deferredTrackingCalls = new Map(q.filter((K) => K && K.experiment && K.result).map((K) => {
            return [FH8(K.experiment, K.result), K]
        }))
    }
    async fireDeferredTrackingCalls() {
        if (!this._options.trackingCallback) return;
        let q = [];
        this._deferredTrackingCalls.forEach((K) => {
            if (!K || !K.experiment || !K.result) console.error("Invalid deferred tracking call", {
                call: K
            });
            else q.push(this._options.trackingCallback(K.experiment, K.result))
        }), this._deferredTrackingCalls.clear(), await Promise.all(q)
    }
    setTrackingCallback(q) {
        this._options.trackingCallback = q, this.fireDeferredTrackingCalls()
    }
    setEventLogger(q) {
        this._options.eventLogger = q
    }
    async logEvent(q, K) {
        if (this._destroyed) {
            console.error("Cannot log event to destroyed GrowthBook instance");
            return
        }
        if (this._options.enableDevMode) this.logs.push({
            eventName: q,
            properties: K,
            timestamp: Date.now().toString(),
            logType: "event"
        });
        if (this._options.eventLogger) try {
            await this._options.eventLogger(q, K || {}, this._getUserContext())
        } catch (_) {
            console.error(_)
        } else console.error("No event logger configured")
    }
    _saveDeferredTrack(q) {
        this._deferredTrackingCalls.set(FH8(q.experiment, q.result), q)
    }
    _getContextUrl() {
        return this._options.url || (ff6 ? window.location.href : "")
    }
    _isAutoExperimentBlockedByContext(q) {
        let K = bH8(q);
        if (K === "visual") {
            if (this._options.disableVisualExperiments) return !0;
            if (this._options.disableJsInjection) {
                if (q.variations.some((_) => _.js)) return !0
            }
        } else if (K === "redirect") {
            if (this._options.disableUrlRedirectExperiments) return !0;
            try {
                let _ = new URL(this._getContextUrl());
                for (let z of q.variations) {
                    if (!z || !z.urlRedirect) continue;
                    let Y = new URL(z.urlRedirect);
                    if (this._options.disableCrossOriginUrlRedirectExperiments) {
                        if (Y.protocol !== _.protocol) return !0;
                        if (Y.host !== _.host) return !0
                    }
                }
            } catch (_) {
                return this.log("Error parsing current or redirect URL", {
                    id: q.key,
                    error: _
                }), !0
            }
        } else return !0;
        if (q.changeId && (this._options.blockedChangeIds || []).includes(q.changeId)) return !0;
        return !1
    }
    getRedirectUrl() {
        return this._redirectedUrl
    }
    _getNavigateFunction() {
        if (this._options.navigate) return {
            navigate: this._options.navigate,
            delay: 0
        };
        else if (ff6) return {
            navigate: (q) => {
                window.location.replace(q)
            },
            delay: 100
        };
        return {
            navigate: null,
            delay: 0
        }
    }
    _applyDOMChanges(q) {
        if (!ff6) return;
        let K = [];
        if (q.css) {
            let _ = document.createElement("style");
            _.innerHTML = q.css, document.head.appendChild(_), K.push(() => _.remove())
        }
        if (q.js) {
            let _ = document.createElement("script");
            if (_.innerHTML = q.js, this._options.jsInjectionNonce) _.nonce = this._options.jsInjectionNonce;
            document.head.appendChild(_), K.push(() => _.remove())
        }
        if (q.domMutations) q.domMutations.forEach((_) => {
            K.push(Au7.default.declarative(_).revert)
        });
        return () => {
            K.forEach((_) => _())
        }
    }
    async refreshStickyBuckets(q) {
        if (this._options.stickyBucketService) {
            let K = this._getEvalContext(),
                _ = await Ku7(K, this._options.stickyBucketService, q);
            this._options.stickyBucketAssignmentDocs = _
        }
    }
    generateStickyBucketAssignmentDocsSync(q, K) {
        if (!("getAllAssignmentsSync" in q)) {
            console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
            return
        }
        let _ = this._getEvalContext(),
            z = KY1(_, K);
        return q.getAllAssignmentsSync(z)
    }
    inDevMode() {
        return !!this._options.enableDevMode
    }
}
// @from(Ln 41939, Col 4)
Au7
// @from(Ln 41939, Col 9)
ff6
// @from(Ln 41939, Col 14)
RU5
// @from(Ln 41940, Col 4)
Ou7 = L(() => {
    FU6();
    ix7();
    Yu7();
    Au7 = K6(hx7(), 1), ff6 = typeof window < "u" && typeof document < "u", RU5 = Bx7()
})
// @from(Ln 41946, Col 4)
wu7 = L(() => {
    Ou7()
})
// @from(Ln 41950, Col 0)
function SU5(q, K) {
    return MD6(q, K)
}
// @from(Ln 41953, Col 4)
f$
// @from(Ln 41954, Col 4)
JU = L(() => {
    NO8();
    f$ = SU5
})
// @from(Ln 41959, Col 0)
function CU5(q) {
    return function(K, _, z) {
        var Y = -1,
            A = Object(K),
            O = z(K),
            w = O.length;
        while (w--) {
            var $ = O[q ? w : ++Y];
            if (_(A[$], $, A) === !1) break
        }
        return K
    }
}
// @from(Ln 41972, Col 4)
$u7
// @from(Ln 41973, Col 4)
ju7 = L(() => {
    $u7 = CU5
})
// @from(Ln 41976, Col 4)
bU5
// @from(Ln 41976, Col 9)
UH8
// @from(Ln 41977, Col 4)
_Y1 = L(() => {
    ju7();
    bU5 = $u7(), UH8 = bU5
})
// @from(Ln 41982, Col 0)
function IU5(q, K) {
    return q && UH8(q, K, vC)
}
// @from(Ln 41985, Col 4)
QH8
// @from(Ln 41986, Col 4)
zY1 = L(() => {
    _Y1();
    OY6();
    QH8 = IU5
})
// @from(Ln 41992, Col 0)
function xU5(q, K) {
    var _ = {};
    return K = xN(K, 3), QH8(q, function(z, Y, A) {
        F86(_, Y, K(z, Y, A))
    }), _
}
// @from(Ln 41998, Col 4)
c0
// @from(Ln 41999, Col 4)
G16 = L(() => {
    tp6();
    zY1();
    N86();
    c0 = xU5
})
// @from(Ln 42005, Col 4)
v16 = L(() => {
    JU();
    G16();
    U4();
    Xf6()
})
// @from(Ln 42012, Col 0)
function Hu7() {
    return "sdk-zAZezfDKGoZuXXKe"
}
// @from(Ln 42015, Col 4)
QU6 = {}
// @from(Ln 42028, Col 0)
function Xu7() {
    return "prod"
}
// @from(Ln 42032, Col 0)
function YY1() {
    if (process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL) return "-custom-oauth";
    switch (Xu7()) {
        case "local":
            return "-local-oauth";
        case "staging":
            return "-staging-oauth";
        case "prod":
            return ""
    }
}