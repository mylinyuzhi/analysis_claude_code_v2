
// @from(Ln 81190, Col 4)
D$1 = R((h82, Zy8) => {
    var oz = h1("node:diagnostics_channel"),
        Mn6 = h1("node:util"),
        h16 = Mn6.debuglog("undici"),
        jn6 = Mn6.debuglog("fetch"),
        FA1 = Mn6.debuglog("websocket"),
        Gy8 = !1,
        N53 = {
            beforeConnect: oz.channel("undici:client:beforeConnect"),
            connected: oz.channel("undici:client:connected"),
            connectError: oz.channel("undici:client:connectError"),
            sendHeaders: oz.channel("undici:client:sendHeaders"),
            create: oz.channel("undici:request:create"),
            bodySent: oz.channel("undici:request:bodySent"),
            headers: oz.channel("undici:request:headers"),
            trailers: oz.channel("undici:request:trailers"),
            error: oz.channel("undici:request:error"),
            open: oz.channel("undici:websocket:open"),
            close: oz.channel("undici:websocket:close"),
            socketError: oz.channel("undici:websocket:socket_error"),
            ping: oz.channel("undici:websocket:ping"),
            pong: oz.channel("undici:websocket:pong")
        };
    if (h16.enabled || jn6.enabled) {
        let A = jn6.enabled ? jn6 : h16;
        oz.channel("undici:client:beforeConnect").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: w
                }
            } = q;
            A("connecting to %s using %s%s", `${w}${z?`:${z}`:""}`, Y, K)
        }), oz.channel("undici:client:connected").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: w
                }
            } = q;
            A("connected to %s using %s%s", `${w}${z?`:${z}`:""}`, Y, K)
        }), oz.channel("undici:client:connectError").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: w
                },
                error: H
            } = q;
            A("connection to %s using %s%s errored - %s", `${w}${z?`:${z}`:""}`, Y, K, H.message)
        }), oz.channel("undici:client:sendHeaders").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                }
            } = q;
            A("sending request to %s %s/%s", K, z, Y)
        }), oz.channel("undici:request:headers").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                },
                response: {
                    statusCode: w
                }
            } = q;
            A("received response to %s %s/%s - HTTP %d", K, z, Y, w)
        }), oz.channel("undici:request:trailers").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                }
            } = q;
            A("trailers received from %s %s/%s", K, z, Y)
        }), oz.channel("undici:request:error").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                },
                error: w
            } = q;
            A("request to %s %s/%s errored - %s", K, z, Y, w.message)
        }), Gy8 = !0
    }
    if (FA1.enabled) {
        if (!Gy8) {
            let A = h16.enabled ? h16 : FA1;
            oz.channel("undici:client:beforeConnect").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: w
                    }
                } = q;
                A("connecting to %s%s using %s%s", w, z ? `:${z}` : "", Y, K)
            }), oz.channel("undici:client:connected").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: w
                    }
                } = q;
                A("connected to %s%s using %s%s", w, z ? `:${z}` : "", Y, K)
            }), oz.channel("undici:client:connectError").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: w
                    },
                    error: H
                } = q;
                A("connection to %s%s using %s%s errored - %s", w, z ? `:${z}` : "", Y, K, H.message)
            }), oz.channel("undici:client:sendHeaders").subscribe((q) => {
                let {
                    request: {
                        method: K,
                        path: Y,
                        origin: z
                    }
                } = q;
                A("sending request to %s %s/%s", K, z, Y)
            })
        }
        oz.channel("undici:websocket:open").subscribe((A) => {
            let {
                address: {
                    address: q,
                    port: K
                }
            } = A;
            FA1("connection opened %s%s", q, K ? `:${K}` : "")
        }), oz.channel("undici:websocket:close").subscribe((A) => {
            let {
                websocket: q,
                code: K,
                reason: Y
            } = A;
            FA1("closed connection to %s - %s %s", q.url, K, Y)
        }), oz.channel("undici:websocket:socket_error").subscribe((A) => {
            FA1("connection errored - %s", A.message)
        }), oz.channel("undici:websocket:ping").subscribe((A) => {
            FA1("ping received")
        }), oz.channel("undici:websocket:pong").subscribe((A) => {
            FA1("pong received")
        })
    }
    Zy8.exports = {
        channels: N53
    }
})
// @from(Ln 81360, Col 4)
Ey8 = R((I82, vy8) => {
    var {
        InvalidArgumentError: LO,
        NotSupportedError: T53
    } = Lz(), $g = h1("node:assert"), {
        isValidHTTPToken: Ny8,
        isValidHeaderValue: fy8,
        isStream: v53,
        destroy: E53,
        isBuffer: k53,
        isFormDataLike: L53,
        isIterable: R53,
        isBlobLike: y53,
        buildURL: C53,
        validateHandler: S53,
        getServerName: h53,
        normalizedMethodRecords: I53
    } = W9(), {
        channels: Vb
    } = D$1(), {
        headerNameLowerCasedRecord: Vy8
    } = R16(), x53 = /[^\u0021-\u00ff]/, bk = Symbol("handler");
    class Ty8 {
        constructor(A, {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: w,
            idempotent: H,
            blocking: $,
            upgrade: O,
            headersTimeout: _,
            bodyTimeout: J,
            reset: X,
            throwOnError: D,
            expectContinue: j,
            servername: M
        }, P) {
            if (typeof q !== "string") throw new LO("path must be a string");
            else if (q[0] !== "/" && !(q.startsWith("http://") || q.startsWith("https://")) && K !== "CONNECT") throw new LO("path must be an absolute URL or start with a slash");
            else if (x53.test(q)) throw new LO("invalid request path");
            if (typeof K !== "string") throw new LO("method must be a string");
            else if (I53[K] === void 0 && !Ny8(K)) throw new LO("invalid request method");
            if (O && typeof O !== "string") throw new LO("upgrade must be a string");
            if (_ != null && (!Number.isFinite(_) || _ < 0)) throw new LO("invalid headersTimeout");
            if (J != null && (!Number.isFinite(J) || J < 0)) throw new LO("invalid bodyTimeout");
            if (X != null && typeof X !== "boolean") throw new LO("invalid reset");
            if (j != null && typeof j !== "boolean") throw new LO("invalid expectContinue");
            if (this.headersTimeout = _, this.bodyTimeout = J, this.throwOnError = D === !0, this.method = K, this.abort = null, Y == null) this.body = null;
            else if (v53(Y)) {
                this.body = Y;
                let W = this.body._readableState;
                if (!W || !W.autoDestroy) this.endHandler = function() {
                    E53(this)
                }, this.body.on("end", this.endHandler);
                this.errorHandler = (G) => {
                    if (this.abort) this.abort(G);
                    else this.error = G
                }, this.body.on("error", this.errorHandler)
            } else if (k53(Y)) this.body = Y.byteLength ? Y : null;
            else if (ArrayBuffer.isView(Y)) this.body = Y.buffer.byteLength ? Buffer.from(Y.buffer, Y.byteOffset, Y.byteLength) : null;
            else if (Y instanceof ArrayBuffer) this.body = Y.byteLength ? Buffer.from(Y) : null;
            else if (typeof Y === "string") this.body = Y.length ? Buffer.from(Y) : null;
            else if (L53(Y) || R53(Y) || y53(Y)) this.body = Y;
            else throw new LO("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
            if (this.completed = !1, this.aborted = !1, this.upgrade = O || null, this.path = w ? C53(q, w) : q, this.origin = A, this.idempotent = H == null ? K === "HEAD" || K === "GET" : H, this.blocking = $ == null ? !1 : $, this.reset = X == null ? null : X, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = j != null ? j : !1, Array.isArray(z)) {
                if (z.length % 2 !== 0) throw new LO("headers array must be even");
                for (let W = 0; W < z.length; W += 2) I16(this, z[W], z[W + 1])
            } else if (z && typeof z === "object")
                if (z[Symbol.iterator])
                    for (let W of z) {
                        if (!Array.isArray(W) || W.length !== 2) throw new LO("headers must be in key-value pair format");
                        I16(this, W[0], W[1])
                    } else {
                        let W = Object.keys(z);
                        for (let G = 0; G < W.length; ++G) I16(this, W[G], z[W[G]])
                    } else if (z != null) throw new LO("headers must be an object or an array");
            if (S53(P, K, O), this.servername = M || h53(this.host), this[bk] = P, Vb.create.hasSubscribers) Vb.create.publish({
                request: this
            })
        }
        onBodySent(A) {
            if (this[bk].onBodySent) try {
                return this[bk].onBodySent(A)
            } catch (q) {
                this.abort(q)
            }
        }
        onRequestSent() {
            if (Vb.bodySent.hasSubscribers) Vb.bodySent.publish({
                request: this
            });
            if (this[bk].onRequestSent) try {
                return this[bk].onRequestSent()
            } catch (A) {
                this.abort(A)
            }
        }
        onConnect(A) {
            if ($g(!this.aborted), $g(!this.completed), this.error) A(this.error);
            else return this.abort = A, this[bk].onConnect(A)
        }
        onResponseStarted() {
            return this[bk].onResponseStarted?.()
        }
        onHeaders(A, q, K, Y) {
            if ($g(!this.aborted), $g(!this.completed), Vb.headers.hasSubscribers) Vb.headers.publish({
                request: this,
                response: {
                    statusCode: A,
                    headers: q,
                    statusText: Y
                }
            });
            try {
                return this[bk].onHeaders(A, q, K, Y)
            } catch (z) {
                this.abort(z)
            }
        }
        onData(A) {
            $g(!this.aborted), $g(!this.completed);
            try {
                return this[bk].onData(A)
            } catch (q) {
                return this.abort(q), !1
            }
        }
        onUpgrade(A, q, K) {
            return $g(!this.aborted), $g(!this.completed), this[bk].onUpgrade(A, q, K)
        }
        onComplete(A) {
            if (this.onFinally(), $g(!this.aborted), this.completed = !0, Vb.trailers.hasSubscribers) Vb.trailers.publish({
                request: this,
                trailers: A
            });
            try {
                return this[bk].onComplete(A)
            } catch (q) {
                this.onError(q)
            }
        }
        onError(A) {
            if (this.onFinally(), Vb.error.hasSubscribers) Vb.error.publish({
                request: this,
                error: A
            });
            if (this.aborted) return;
            return this.aborted = !0, this[bk].onError(A)
        }
        onFinally() {
            if (this.errorHandler) this.body.off("error", this.errorHandler), this.errorHandler = null;
            if (this.endHandler) this.body.off("end", this.endHandler), this.endHandler = null
        }
        addHeader(A, q) {
            return I16(this, A, q), this
        }
    }

    function I16(A, q, K) {
        if (K && (typeof K === "object" && !Array.isArray(K))) throw new LO(`invalid ${q} header`);
        else if (K === void 0) return;
        let Y = Vy8[q];
        if (Y === void 0) {
            if (Y = q.toLowerCase(), Vy8[Y] === void 0 && !Ny8(Y)) throw new LO("invalid header key")
        }
        if (Array.isArray(K)) {
            let z = [];
            for (let w = 0; w < K.length; w++)
                if (typeof K[w] === "string") {
                    if (!fy8(K[w])) throw new LO(`invalid ${q} header`);
                    z.push(K[w])
                } else if (K[w] === null) z.push("");
            else if (typeof K[w] === "object") throw new LO(`invalid ${q} header`);
            else z.push(`${K[w]}`);
            K = z
        } else if (typeof K === "string") {
            if (!fy8(K)) throw new LO(`invalid ${q} header`)
        } else if (K === null) K = "";
        else K = `${K}`;
        if (A.host === null && Y === "host") {
            if (typeof K !== "string") throw new LO("invalid host header");
            A.host = K
        } else if (A.contentLength === null && Y === "content-length") {
            if (A.contentLength = parseInt(K, 10), !Number.isFinite(A.contentLength)) throw new LO("invalid content-length header")
        } else if (A.contentType === null && Y === "content-type") A.contentType = K, A.headers.push(q, K);
        else if (Y === "transfer-encoding" || Y === "keep-alive" || Y === "upgrade") throw new LO(`invalid ${Y} header`);
        else if (Y === "connection") {
            let z = typeof K === "string" ? K.toLowerCase() : null;
            if (z !== "close" && z !== "keep-alive") throw new LO("invalid connection header");
            if (z === "close") A.reset = !0
        } else if (Y === "expect") throw new T53("expect header not supported");
        else A.headers.push(q, K)
    }
    vy8.exports = Ty8
})
// @from(Ln 81557, Col 4)
Mk1 = R((x82, Ly8) => {
    var b53 = h1("node:events");
    class Pn6 extends b53 {
        dispatch() {
            throw Error("not implemented")
        }
        close() {
            throw Error("not implemented")
        }
        destroy() {
            throw Error("not implemented")
        }
        compose(...A) {
            let q = Array.isArray(A[0]) ? A[0] : A,
                K = this.dispatch.bind(this);
            for (let Y of q) {
                if (Y == null) continue;
                if (typeof Y !== "function") throw TypeError(`invalid interceptor, expected function received ${typeof Y}`);
                if (K = Y(K), K == null || typeof K !== "function" || K.length !== 2) throw TypeError("invalid interceptor")
            }
            return new ky8(this, K)
        }
    }
    class ky8 extends Pn6 {
        #A = null;
        #q = null;
        constructor(A, q) {
            super();
            this.#A = A, this.#q = q
        }
        dispatch(...A) {
            this.#q(...A)
        }
        close(...A) {
            return this.#A.close(...A)
        }
        destroy(...A) {
            return this.#A.destroy(...A)
        }
    }
    Ly8.exports = Pn6
})
// @from(Ln 81599, Col 4)
W$1 = R((b82, yy8) => {
    var u53 = Mk1(),
        {
            ClientDestroyedError: Wn6,
            ClientClosedError: B53,
            InvalidArgumentError: j$1
        } = Lz(),
        {
            kDestroy: m53,
            kClose: F53,
            kClosed: Pk1,
            kDestroyed: M$1,
            kDispatch: Gn6,
            kInterceptors: QA1
        } = h$(),
        Og = Symbol("onDestroyed"),
        P$1 = Symbol("onClosed"),
        x16 = Symbol("Intercepted Dispatch");
    class Ry8 extends u53 {
        constructor() {
            super();
            this[M$1] = !1, this[Og] = null, this[Pk1] = !1, this[P$1] = []
        }
        get destroyed() {
            return this[M$1]
        }
        get closed() {
            return this[Pk1]
        }
        get interceptors() {
            return this[QA1]
        }
        set interceptors(A) {
            if (A) {
                for (let q = A.length - 1; q >= 0; q--)
                    if (typeof this[QA1][q] !== "function") throw new j$1("interceptor must be an function")
            }
            this[QA1] = A
        }
        close(A) {
            if (A === void 0) return new Promise((K, Y) => {
                this.close((z, w) => {
                    return z ? Y(z) : K(w)
                })
            });
            if (typeof A !== "function") throw new j$1("invalid callback");
            if (this[M$1]) {
                queueMicrotask(() => A(new Wn6, null));
                return
            }
            if (this[Pk1]) {
                if (this[P$1]) this[P$1].push(A);
                else queueMicrotask(() => A(null, null));
                return
            }
            this[Pk1] = !0, this[P$1].push(A);
            let q = () => {
                let K = this[P$1];
                this[P$1] = null;
                for (let Y = 0; Y < K.length; Y++) K[Y](null, null)
            };
            this[F53]().then(() => this.destroy()).then(() => {
                queueMicrotask(q)
            })
        }
        destroy(A, q) {
            if (typeof A === "function") q = A, A = null;
            if (q === void 0) return new Promise((Y, z) => {
                this.destroy(A, (w, H) => {
                    return w ? z(w) : Y(H)
                })
            });
            if (typeof q !== "function") throw new j$1("invalid callback");
            if (this[M$1]) {
                if (this[Og]) this[Og].push(q);
                else queueMicrotask(() => q(null, null));
                return
            }
            if (!A) A = new Wn6;
            this[M$1] = !0, this[Og] = this[Og] || [], this[Og].push(q);
            let K = () => {
                let Y = this[Og];
                this[Og] = null;
                for (let z = 0; z < Y.length; z++) Y[z](null, null)
            };
            this[m53](A).then(() => {
                queueMicrotask(K)
            })
        } [x16](A, q) {
            if (!this[QA1] || this[QA1].length === 0) return this[x16] = this[Gn6], this[Gn6](A, q);
            let K = this[Gn6].bind(this);
            for (let Y = this[QA1].length - 1; Y >= 0; Y--) K = this[QA1][Y](K);
            return this[x16] = K, K(A, q)
        }
        dispatch(A, q) {
            if (!q || typeof q !== "object") throw new j$1("handler must be an object");
            try {
                if (!A || typeof A !== "object") throw new j$1("opts must be an object.");
                if (this[M$1] || this[Og]) throw new Wn6;
                if (this[Pk1]) throw new B53;
                return this[x16](A, q)
            } catch (K) {
                if (typeof q.onError !== "function") throw new j$1("invalid onError method");
                return q.onError(K), !1
            }
        }
    }
    yy8.exports = Ry8
})
// @from(Ln 81708, Col 4)
kn6 = R((u82, Iy8) => {
    var G$1 = 0,
        Zn6 = 1000,
        fn6 = (Zn6 >> 1) - 1,
        _g, Vn6 = Symbol("kFastTimer"),
        Jg = [],
        Nn6 = -2,
        Tn6 = -1,
        Sy8 = 0,
        Cy8 = 1;

    function vn6() {
        G$1 += fn6;
        let A = 0,
            q = Jg.length;
        while (A < q) {
            let K = Jg[A];
            if (K._state === Sy8) K._idleStart = G$1 - fn6, K._state = Cy8;
            else if (K._state === Cy8 && G$1 >= K._idleStart + K._idleTimeout) K._state = Tn6, K._idleStart = -1, K._onTimeout(K._timerArg);
            if (K._state === Tn6) {
                if (K._state = Nn6, --q !== 0) Jg[A] = Jg[q]
            } else ++A
        }
        if (Jg.length = q, Jg.length !== 0) hy8()
    }

    function hy8() {
        if (_g) _g.refresh();
        else if (clearTimeout(_g), _g = setTimeout(vn6, fn6), _g.unref) _g.unref()
    }
    class En6 {
        [Vn6] = !0;
        _state = Nn6;
        _idleTimeout = -1;
        _idleStart = -1;
        _onTimeout;
        _timerArg;
        constructor(A, q, K) {
            this._onTimeout = A, this._idleTimeout = q, this._timerArg = K, this.refresh()
        }
        refresh() {
            if (this._state === Nn6) Jg.push(this);
            if (!_g || Jg.length === 1) hy8();
            this._state = Sy8
        }
        clear() {
            this._state = Tn6, this._idleStart = -1
        }
    }
    Iy8.exports = {
        setTimeout(A, q, K) {
            return q <= Zn6 ? setTimeout(A, q, K) : new En6(A, q, K)
        },
        clearTimeout(A) {
            if (A[Vn6]) A.clear();
            else clearTimeout(A)
        },
        setFastTimeout(A, q, K) {
            return new En6(A, q, K)
        },
        clearFastTimeout(A) {
            A.clear()
        },
        now() {
            return G$1
        },
        tick(A = 0) {
            G$1 += A - Zn6 + 1, vn6(), vn6()
        },
        reset() {
            G$1 = 0, Jg.length = 0, clearTimeout(_g), _g = null
        },
        kFastTimer: Vn6
    }
})
// @from(Ln 81783, Col 4)
Wk1 = R((B82, my8) => {
    var Q53 = h1("node:net"),
        xy8 = h1("node:assert"),
        By8 = W9(),
        {
            InvalidArgumentError: g53,
            ConnectTimeoutError: U53
        } = Lz(),
        b16 = kn6();

    function by8() {}
    var Ln6, Rn6;
    if (global.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG)) Rn6 = class {
        constructor(q) {
            this._maxCachedSessions = q, this._sessionCache = new Map, this._sessionRegistry = new global.FinalizationRegistry((K) => {
                if (this._sessionCache.size < this._maxCachedSessions) return;
                let Y = this._sessionCache.get(K);
                if (Y !== void 0 && Y.deref() === void 0) this._sessionCache.delete(K)
            })
        }
        get(q) {
            let K = this._sessionCache.get(q);
            return K ? K.deref() : null
        }
        set(q, K) {
            if (this._maxCachedSessions === 0) return;
            this._sessionCache.set(q, new WeakRef(K)), this._sessionRegistry.register(K, q)
        }
    };
    else Rn6 = class {
        constructor(q) {
            this._maxCachedSessions = q, this._sessionCache = new Map
        }
        get(q) {
            return this._sessionCache.get(q)
        }
        set(q, K) {
            if (this._maxCachedSessions === 0) return;
            if (this._sessionCache.size >= this._maxCachedSessions) {
                let {
                    value: Y
                } = this._sessionCache.keys().next();
                this._sessionCache.delete(Y)
            }
            this._sessionCache.set(q, K)
        }
    };

    function p53({
        allowH2: A,
        maxCachedSessions: q,
        socketPath: K,
        timeout: Y,
        session: z,
        ...w
    }) {
        if (q != null && (!Number.isInteger(q) || q < 0)) throw new g53("maxCachedSessions must be a positive integer or zero");
        let H = {
                path: K,
                ...w
            },
            $ = new Rn6(q == null ? 100 : q);
        return Y = Y == null ? 1e4 : Y, A = A != null ? A : !1,
            function({
                hostname: _,
                host: J,
                protocol: X,
                port: D,
                servername: j,
                localAddress: M,
                httpSocket: P
            }, W) {
                let G;
                if (X === "https:") {
                    if (!Ln6) Ln6 = h1("node:tls");
                    j = j || H.servername || By8.getServerName(J) || null;
                    let Z = j || _;
                    xy8(Z);
                    let N = z || $.get(Z) || null;
                    D = D || 443, G = Ln6.connect({
                        highWaterMark: 16384,
                        ...H,
                        servername: j,
                        session: N,
                        localAddress: M,
                        ALPNProtocols: A ? ["http/1.1", "h2"] : ["http/1.1"],
                        socket: P,
                        port: D,
                        host: _
                    }), G.on("session", function(T) {
                        $.set(Z, T)
                    })
                } else xy8(!P, "httpSocket can only be sent on TLS update"), D = D || 80, G = Q53.connect({
                    highWaterMark: 65536,
                    ...H,
                    localAddress: M,
                    port: D,
                    host: _
                });
                if (H.keepAlive == null || H.keepAlive) {
                    let Z = H.keepAliveInitialDelay === void 0 ? 60000 : H.keepAliveInitialDelay;
                    G.setKeepAlive(!0, Z)
                }
                let f = d53(new WeakRef(G), {
                    timeout: Y,
                    hostname: _,
                    port: D
                });
                return G.setNoDelay(!0).once(X === "https:" ? "secureConnect" : "connect", function() {
                    if (queueMicrotask(f), W) {
                        let Z = W;
                        W = null, Z(null, this)
                    }
                }).on("error", function(Z) {
                    if (queueMicrotask(f), W) {
                        let N = W;
                        W = null, N(Z)
                    }
                }), G
            }
    }
    var d53 = process.platform === "win32" ? (A, q) => {
        if (!q.timeout) return by8;
        let K = null,
            Y = null,
            z = b16.setFastTimeout(() => {
                K = setImmediate(() => {
                    Y = setImmediate(() => uy8(A.deref(), q))
                })
            }, q.timeout);
        return () => {
            b16.clearFastTimeout(z), clearImmediate(K), clearImmediate(Y)
        }
    } : (A, q) => {
        if (!q.timeout) return by8;
        let K = null,
            Y = b16.setFastTimeout(() => {
                K = setImmediate(() => {
                    uy8(A.deref(), q)
                })
            }, q.timeout);
        return () => {
            b16.clearFastTimeout(Y), clearImmediate(K)
        }
    };

    function uy8(A, q) {
        if (A == null) return;
        let K = "Connect Timeout Error";
        if (Array.isArray(A.autoSelectFamilyAttemptedAddresses)) K += ` (attempted addresses: ${A.autoSelectFamilyAttemptedAddresses.join(", ")},`;
        else K += ` (attempted address: ${q.hostname}:${q.port},`;
        K += ` timeout: ${q.timeout}ms)`, By8.destroy(A, new U53(K))
    }
    my8.exports = p53
})
// @from(Ln 81938, Col 4)
gy8 = R((Fy8) => {
    Object.defineProperty(Fy8, "__esModule", {
        value: !0
    });
    Fy8.enumToMap = void 0;

    function c53(A) {
        let q = {};
        return Object.keys(A).forEach((K) => {
            let Y = A[K];
            if (typeof Y === "number") q[K] = Y
        }), q
    }
    Fy8.enumToMap = c53
})
// @from(Ln 81953, Col 4)
YC8 = R((ry8) => {
    Object.defineProperty(ry8, "__esModule", {
        value: !0
    });
    ry8.SPECIAL_HEADERS = ry8.HEADER_STATE = ry8.MINOR = ry8.MAJOR = ry8.CONNECTION_TOKEN_CHARS = ry8.HEADER_CHARS = ry8.TOKEN = ry8.STRICT_TOKEN = ry8.HEX = ry8.URL_CHAR = ry8.STRICT_URL_CHAR = ry8.USERINFO_CHARS = ry8.MARK = ry8.ALPHANUM = ry8.NUM = ry8.HEX_MAP = ry8.NUM_MAP = ry8.ALPHA = ry8.FINISH = ry8.H_METHOD_MAP = ry8.METHOD_MAP = ry8.METHODS_RTSP = ry8.METHODS_ICE = ry8.METHODS_HTTP = ry8.METHODS = ry8.LENIENT_FLAGS = ry8.FLAGS = ry8.TYPE = ry8.ERROR = void 0;
    var l53 = gy8(),
        i53;
    (function(A) {
        A[A.OK = 0] = "OK", A[A.INTERNAL = 1] = "INTERNAL", A[A.STRICT = 2] = "STRICT", A[A.LF_EXPECTED = 3] = "LF_EXPECTED", A[A.UNEXPECTED_CONTENT_LENGTH = 4] = "UNEXPECTED_CONTENT_LENGTH", A[A.CLOSED_CONNECTION = 5] = "CLOSED_CONNECTION", A[A.INVALID_METHOD = 6] = "INVALID_METHOD", A[A.INVALID_URL = 7] = "INVALID_URL", A[A.INVALID_CONSTANT = 8] = "INVALID_CONSTANT", A[A.INVALID_VERSION = 9] = "INVALID_VERSION", A[A.INVALID_HEADER_TOKEN = 10] = "INVALID_HEADER_TOKEN", A[A.INVALID_CONTENT_LENGTH = 11] = "INVALID_CONTENT_LENGTH", A[A.INVALID_CHUNK_SIZE = 12] = "INVALID_CHUNK_SIZE", A[A.INVALID_STATUS = 13] = "INVALID_STATUS", A[A.INVALID_EOF_STATE = 14] = "INVALID_EOF_STATE", A[A.INVALID_TRANSFER_ENCODING = 15] = "INVALID_TRANSFER_ENCODING", A[A.CB_MESSAGE_BEGIN = 16] = "CB_MESSAGE_BEGIN", A[A.CB_HEADERS_COMPLETE = 17] = "CB_HEADERS_COMPLETE", A[A.CB_MESSAGE_COMPLETE = 18] = "CB_MESSAGE_COMPLETE", A[A.CB_CHUNK_HEADER = 19] = "CB_CHUNK_HEADER", A[A.CB_CHUNK_COMPLETE = 20] = "CB_CHUNK_COMPLETE", A[A.PAUSED = 21] = "PAUSED", A[A.PAUSED_UPGRADE = 22] = "PAUSED_UPGRADE", A[A.PAUSED_H2_UPGRADE = 23] = "PAUSED_H2_UPGRADE", A[A.USER = 24] = "USER"
    })(i53 = ry8.ERROR || (ry8.ERROR = {}));
    var n53;
    (function(A) {
        A[A.BOTH = 0] = "BOTH", A[A.REQUEST = 1] = "REQUEST", A[A.RESPONSE = 2] = "RESPONSE"
    })(n53 = ry8.TYPE || (ry8.TYPE = {}));
    var r53;
    (function(A) {
        A[A.CONNECTION_KEEP_ALIVE = 1] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 2] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 4] = "CONNECTION_UPGRADE", A[A.CHUNKED = 8] = "CHUNKED", A[A.UPGRADE = 16] = "UPGRADE", A[A.CONTENT_LENGTH = 32] = "CONTENT_LENGTH", A[A.SKIPBODY = 64] = "SKIPBODY", A[A.TRAILING = 128] = "TRAILING", A[A.TRANSFER_ENCODING = 512] = "TRANSFER_ENCODING"
    })(r53 = ry8.FLAGS || (ry8.FLAGS = {}));
    var o53;
    (function(A) {
        A[A.HEADERS = 1] = "HEADERS", A[A.CHUNKED_LENGTH = 2] = "CHUNKED_LENGTH", A[A.KEEP_ALIVE = 4] = "KEEP_ALIVE"
    })(o53 = ry8.LENIENT_FLAGS || (ry8.LENIENT_FLAGS = {}));
    var GK;
    (function(A) {
        A[A.DELETE = 0] = "DELETE", A[A.GET = 1] = "GET", A[A.HEAD = 2] = "HEAD", A[A.POST = 3] = "POST", A[A.PUT = 4] = "PUT", A[A.CONNECT = 5] = "CONNECT", A[A.OPTIONS = 6] = "OPTIONS", A[A.TRACE = 7] = "TRACE", A[A.COPY = 8] = "COPY", A[A.LOCK = 9] = "LOCK", A[A.MKCOL = 10] = "MKCOL", A[A.MOVE = 11] = "MOVE", A[A.PROPFIND = 12] = "PROPFIND", A[A.PROPPATCH = 13] = "PROPPATCH", A[A.SEARCH = 14] = "SEARCH", A[A.UNLOCK = 15] = "UNLOCK", A[A.BIND = 16] = "BIND", A[A.REBIND = 17] = "REBIND", A[A.UNBIND = 18] = "UNBIND", A[A.ACL = 19] = "ACL", A[A.REPORT = 20] = "REPORT", A[A.MKACTIVITY = 21] = "MKACTIVITY", A[A.CHECKOUT = 22] = "CHECKOUT", A[A.MERGE = 23] = "MERGE", A[A["M-SEARCH"] = 24] = "M-SEARCH", A[A.NOTIFY = 25] = "NOTIFY", A[A.SUBSCRIBE = 26] = "SUBSCRIBE", A[A.UNSUBSCRIBE = 27] = "UNSUBSCRIBE", A[A.PATCH = 28] = "PATCH", A[A.PURGE = 29] = "PURGE", A[A.MKCALENDAR = 30] = "MKCALENDAR", A[A.LINK = 31] = "LINK", A[A.UNLINK = 32] = "UNLINK", A[A.SOURCE = 33] = "SOURCE", A[A.PRI = 34] = "PRI", A[A.DESCRIBE = 35] = "DESCRIBE", A[A.ANNOUNCE = 36] = "ANNOUNCE", A[A.SETUP = 37] = "SETUP", A[A.PLAY = 38] = "PLAY", A[A.PAUSE = 39] = "PAUSE", A[A.TEARDOWN = 40] = "TEARDOWN", A[A.GET_PARAMETER = 41] = "GET_PARAMETER", A[A.SET_PARAMETER = 42] = "SET_PARAMETER", A[A.REDIRECT = 43] = "REDIRECT", A[A.RECORD = 44] = "RECORD", A[A.FLUSH = 45] = "FLUSH"
    })(GK = ry8.METHODS || (ry8.METHODS = {}));
    ry8.METHODS_HTTP = [GK.DELETE, GK.GET, GK.HEAD, GK.POST, GK.PUT, GK.CONNECT, GK.OPTIONS, GK.TRACE, GK.COPY, GK.LOCK, GK.MKCOL, GK.MOVE, GK.PROPFIND, GK.PROPPATCH, GK.SEARCH, GK.UNLOCK, GK.BIND, GK.REBIND, GK.UNBIND, GK.ACL, GK.REPORT, GK.MKACTIVITY, GK.CHECKOUT, GK.MERGE, GK["M-SEARCH"], GK.NOTIFY, GK.SUBSCRIBE, GK.UNSUBSCRIBE, GK.PATCH, GK.PURGE, GK.MKCALENDAR, GK.LINK, GK.UNLINK, GK.PRI, GK.SOURCE];
    ry8.METHODS_ICE = [GK.SOURCE];
    ry8.METHODS_RTSP = [GK.OPTIONS, GK.DESCRIBE, GK.ANNOUNCE, GK.SETUP, GK.PLAY, GK.PAUSE, GK.TEARDOWN, GK.GET_PARAMETER, GK.SET_PARAMETER, GK.REDIRECT, GK.RECORD, GK.FLUSH, GK.GET, GK.POST];
    ry8.METHOD_MAP = l53.enumToMap(GK);
    ry8.H_METHOD_MAP = {};
    Object.keys(ry8.METHOD_MAP).forEach((A) => {
        if (/^H/.test(A)) ry8.H_METHOD_MAP[A] = ry8.METHOD_MAP[A]
    });
    var a53;
    (function(A) {
        A[A.SAFE = 0] = "SAFE", A[A.SAFE_WITH_CB = 1] = "SAFE_WITH_CB", A[A.UNSAFE = 2] = "UNSAFE"
    })(a53 = ry8.FINISH || (ry8.FINISH = {}));
    ry8.ALPHA = [];
    for (let A = 65; A <= 90; A++) ry8.ALPHA.push(String.fromCharCode(A)), ry8.ALPHA.push(String.fromCharCode(A + 32));
    ry8.NUM_MAP = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    };
    ry8.HEX_MAP = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15
    };
    ry8.NUM = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    ry8.ALPHANUM = ry8.ALPHA.concat(ry8.NUM);
    ry8.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
    ry8.USERINFO_CHARS = ry8.ALPHANUM.concat(ry8.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]);
    ry8.STRICT_URL_CHAR = ["!", '"', "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"].concat(ry8.ALPHANUM);
    ry8.URL_CHAR = ry8.STRICT_URL_CHAR.concat(["\t", "\f"]);
    for (let A = 128; A <= 255; A++) ry8.URL_CHAR.push(A);
    ry8.HEX = ry8.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
    ry8.STRICT_TOKEN = ["!", "#", "$", "%", "&", "'", "*", "+", "-", ".", "^", "_", "`", "|", "~"].concat(ry8.ALPHANUM);
    ry8.TOKEN = ry8.STRICT_TOKEN.concat([" "]);
    ry8.HEADER_CHARS = ["\t"];
    for (let A = 32; A <= 255; A++)
        if (A !== 127) ry8.HEADER_CHARS.push(A);
    ry8.CONNECTION_TOKEN_CHARS = ry8.HEADER_CHARS.filter((A) => A !== 44);
    ry8.MAJOR = ry8.NUM_MAP;
    ry8.MINOR = ry8.MAJOR;
    var Z$1;
    (function(A) {
        A[A.GENERAL = 0] = "GENERAL", A[A.CONNECTION = 1] = "CONNECTION", A[A.CONTENT_LENGTH = 2] = "CONTENT_LENGTH", A[A.TRANSFER_ENCODING = 3] = "TRANSFER_ENCODING", A[A.UPGRADE = 4] = "UPGRADE", A[A.CONNECTION_KEEP_ALIVE = 5] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 6] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 7] = "CONNECTION_UPGRADE", A[A.TRANSFER_ENCODING_CHUNKED = 8] = "TRANSFER_ENCODING_CHUNKED"
    })(Z$1 = ry8.HEADER_STATE || (ry8.HEADER_STATE = {}));
    ry8.SPECIAL_HEADERS = {
        connection: Z$1.CONNECTION,
        "content-length": Z$1.CONTENT_LENGTH,
        "proxy-connection": Z$1.CONNECTION,
        "transfer-encoding": Z$1.TRANSFER_ENCODING,
        upgrade: Z$1.UPGRADE
    }
})